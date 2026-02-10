import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const planPricing: Record<string, number> = {
  "plan_basic": 1999,    // €19.99
  "plan_pro": 2499,      // €24.99
  "plan_premium": 2999,   // €29.99
  "bundle_5": 1495,     // €14.95
  "bundle_10": 2495,    // €24.95
  "bundle_20": 3995,    // €39.95
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const { plan, email, name } = await request.json()

  if (!plan || !planPricing[plan]) {
    return NextResponse.json({ message: "Invalid plan" }, { status: 400 })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: planPricing[plan],
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        plan,
        userId: session?.user?.id || "",
        guestName: name || "",
        guestEmail: email || "",
      },
      receipt_email: email || session?.user?.email,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error("Payment Intent Error:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
