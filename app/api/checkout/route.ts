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

  const contentType = request.headers.get("content-type") || ""
  let plan: string | null = null
  let customerEmail = session?.user?.email
  let customerName = session?.user?.name
  
  if (contentType.includes("application/json")) {
    const body = await request.json()
    plan = body?.plan || null
    if (!session) {
      customerEmail = body?.email
      customerName = body?.name
    }
  } else {
    const formData = await request.formData()
    plan = formData.get("plan")?.toString() || null
    if (!session) {
      customerEmail = formData.get("email")?.toString()
      customerName = formData.get("name")?.toString()
    }
  }

  if (!plan || !planToPriceId[plan]) {
    return NextResponse.json(
      { message: "Stripe is nog niet geconfigureerd voor dit pakket." },
      { status: 400 }
    )
  }

  // If no session and no email provided, we can't proceed with "Access Code" flow properly
  // unless we rely entirely on Stripe collecting the email.
  // But to generate the user we need the email. Stripe collects it, so we can get it in the webhook.
  // However, `customer_email` pre-fills it.
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail || undefined,
      client_reference_id: session?.user?.id,
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
        userId: session?.user?.id || "",
        guestName: customerName || "",
      },
      payment_intent_data: {
        metadata: {
            plan,
            userId: session?.user?.id || "",
        }
      }
    })

    if (contentType.includes("application/json")) {
       return NextResponse.json({ url: checkoutSession.url })
    }
    
    return NextResponse.redirect(checkoutSession.url || baseUrl, 303)
  } catch (error) {
    console.error("Stripe Checkout Error:", error)
    return NextResponse.json(
      { message: "Kon checkout niet starten. Controleer Stripe configuratie." },
      { status: 500 }
    )
  }
}
