import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

const planToPriceId: Record<string, string | undefined> = {
  "auto-dag": process.env.STRIPE_PRICE_AUTO_DAG,
  "auto-week": process.env.STRIPE_PRICE_AUTO_WEEK,
  "auto-maand": process.env.STRIPE_PRICE_AUTO_MAAND,
}

export async function POST(request: Request) {
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
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
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
      },
    })

    return NextResponse.redirect(session.url || baseUrl, 303)
  } catch (error) {
    return NextResponse.json(
      { message: "Kon checkout niet starten. Controleer Stripe configuratie." },
      { status: 500 }
    )
  }
}
