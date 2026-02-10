import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { updateUserPlan, addExams, createUserWithAccessCode, getUserByEmail } from "@/lib/user"
import { sendAccessCodeEmail } from "@/lib/mail"
import { headers } from "next/headers"
import { EXAM_BUNDLES, ExamBundleId } from "@/lib/credits"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = (await headers()).get("Stripe-Signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || process.env.ENDPOINT_SECRET

  console.log("🔔 Stripe Webhook Request ontvangen")

  if (!sig || !webhookSecret) {
    console.error("❌ Webhook Fout: Ontbrekende Stripe-Signature of Webhook Secret.")
    return NextResponse.json({ error: "Missing configuration" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log(`✅ Webhook event geverifieerd: ${event.type}`)
  } catch (err: any) {
    console.error(`❌ Webhook Verificatie mislukt: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any
    console.log("💳 Checkout Session voltooid!")
    await handleSuccessfulPayment(session)
  } else if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as any
    console.log("💰 Payment Intent geslaagd!")
    await handleSuccessfulPayment(paymentIntent)
  } else {
    console.log(`ℹ️ Onbehandeld event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(sessionOrIntent: any) {
  const metadata = sessionOrIntent.metadata || {}
  const planId = metadata.plan
  let userId = sessionOrIntent.client_reference_id 

  console.log("🛠️ Metadata:", JSON.stringify(metadata))

  if (!userId && metadata.userId) {
     userId = metadata.userId
  }

  // Get email and name
  const email = sessionOrIntent.customer_details?.email || metadata.guestEmail || sessionOrIntent.receipt_email
  const name = sessionOrIntent.customer_details?.name || metadata.guestName || "Student"

  console.log(`📧 E-mail gevonden in event: ${email}`)
  console.log(`👤 Naam gevonden in event: ${name}`)
  console.log(`📦 Plan ID: ${planId}`)

  if (email) {
     const existingUser = await getUserByEmail(email)
     if (existingUser) {
        userId = existingUser._id.toString()
        console.log(`ℹ️ Bestaande gebruiker gevonden: ${userId}`)
        const code = existingUser.accessCode
        if (code) {
          console.log(`🔑 Toegangscode gevonden voor bestaande gebruiker: ${code}`)
          await sendAccessCodeEmail(email, name, code)
        } else {
          console.log("⚠️ Bestaande gebruiker heeft geen accessCode, nieuwe aanmaken...")
          const newCode = await createUserWithAccessCode(email, name)
          await sendAccessCodeEmail(email, name, newCode)
        }
     } else {
        console.log(`✨ Nieuwe gebruiker aanmaken voor: ${email}`)
        const accessCode = await createUserWithAccessCode(email, name)
        console.log(`✨ Toegangscode gegenereerd: ${accessCode}`)
        
        await sendAccessCodeEmail(email, name, accessCode)
        
        const newUser = await getUserByEmail(email)
        userId = newUser?._id.toString()
     }
  } else {
    console.error("❌ GEEN E-MAILADRES GEVONDEN IN STRIPE EVENT!")
  }

  if (planId && userId) {
    console.log(`✅ Updating plan ${planId} for user ${userId}`)

    // Check if it's an exam bundle
    const isExamBundle = Object.values(EXAM_BUNDLES).some(b => b.id === planId);

    if (isExamBundle) {
      const bundle = Object.values(EXAM_BUNDLES).find(b => b.id === planId);
      if (bundle) {
        await addExams(userId, bundle.amount);
        console.log(`✅ Added ${bundle.amount} exams to user ${userId}`);
      }
    } else {
      await updateUserPlan(userId, planId, sessionOrIntent)
    }
  } else {
    console.error("❌ Failed to process: Missing userId/email or planId", { userId, email, planId })
  }
}
