import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const paymentIntentId = searchParams.get("paymentIntentId")

  if (!paymentIntentId) {
    return NextResponse.json({ message: "Missing paymentIntentId" }, { status: 400 })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    const email = paymentIntent.receipt_email || paymentIntent.metadata?.guestEmail
    
    return NextResponse.json({ email })
  } catch (error) {
    console.error("Error retrieving payment intent:", error)
    return NextResponse.json({ message: "Error retrieving payment intent" }, { status: 500 })
  }
}
