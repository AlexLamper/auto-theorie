import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const planToPriceId: Record<string, string | undefined> = {
  "plan_basic": process.env.STRIPE_PRICE_BASIC,
  "plan_pro": process.env.STRIPE_PRICE_PRO,
  "plan_premium": process.env.STRIPE_PRICE_PREMIUM,
  "bundle_5": process.env.STRIPE_PRICE_BUNDLE_5,
  "bundle_10": process.env.STRIPE_PRICE_BUNDLE_10,
  "bundle_20": process.env.STRIPE_PRICE_BUNDLE_20,
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    // Redirect to login if not authenticated
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return NextResponse.redirect(`${baseUrl}/inloggen?callbackUrl=/prijzen`, 303)
  }

  const contentType = request.headers.get("content-type") || ""
  let plan: string | null = null

  if (contentType.includes("application/json")) {
    const body = await request.json()
    plan = body?.plan || null
  } else {
    const formData = await request.formData()
    plan = formData.get("plan")?.toString() || null
  }

  if (!plan || !planToPriceId[plan]) {
    return NextResponse.json(
      { message: "Stripe is nog niet geconfigureerd voor dit pakket." },
      { status: 400 }
    )
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email || undefined,
      client_reference_id: session.user.id,
      line_items: [
        {
          price: planToPriceId[plan],
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/betaling/geslaagd?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/betaling/geannuleerd`,
      metadata: {
        plan,
        userId: session.user.id
      },
    })

    return NextResponse.redirect(checkoutSession.url || baseUrl, 303)
  } catch (error) {
    return NextResponse.json(
      { message: "Kon checkout niet starten. Controleer Stripe configuratie." },
      { status: 500 }
    )
  }
}
