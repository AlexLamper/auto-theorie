import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { updateUserPlan, addExams } from "@/lib/user"
import { headers } from "next/headers"
import { EXAM_BUNDLES, ExamBundleId } from "@/lib/credits"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed:`, err.message)
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 })
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any
    const planId = session.metadata?.plan
    const userId = session.client_reference_id // We should pass user ID during checkout

    if (planId && userId) {
      console.log(`✅ Payment received for user ${userId}, plan ${planId}`)

      // Check if it's an exam bundle
      const isExamBundle = Object.values(EXAM_BUNDLES).some(b => b.id === planId);

      if (isExamBundle) {
        const bundle = Object.values(EXAM_BUNDLES).find(b => b.id === planId);
        if (bundle) {
          await addExams(userId, bundle.amount);
          console.log(`✅ Added ${bundle.amount} exams to user ${userId}`);
        }
      } else {
        await updateUserPlan(userId, planId, session)
      }
    } else {
      console.error("❌ Missing userId or planId in session metadata/client_reference_id")
    }
  }

  return NextResponse.json({ received: true })
}
