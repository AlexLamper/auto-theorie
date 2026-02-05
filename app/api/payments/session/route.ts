import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { updateUserPlan } from "@/lib/user"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null

  if (!sessionId) {
    return NextResponse.json(
      { message: "Session id ontbreekt" },
      { status: 400 }
    )
  }

  const serverSession = await getServerSession(authOptions)
  if (!serverSession?.user?.id) {
    return NextResponse.json({ message: "Je moet eerst inloggen" }, { status: 401 })
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
    const planId = checkoutSession.metadata?.plan

    if (!planId) {
      return NextResponse.json({ message: "Geen planinformatie gevonden" }, { status: 400 })
    }

    const plan = await updateUserPlan(serverSession.user.id, planId, checkoutSession)
    return NextResponse.json({ plan })
  } catch (error) {
    console.error("Kon stripe sessie niet ophalen", error)
    return NextResponse.json({ message: "Kon betaling niet koppelen" }, { status: 500 })
  }
}
