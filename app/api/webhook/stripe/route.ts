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
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any
      console.log(`💳 Checkout Session voltooid: ${session.id}`)
      await handleSuccessfulPayment(session)
    } else if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any
      console.log(`💰 Payment Intent geslaagd: ${paymentIntent.id}`)
      
      // Indien het een Checkout Session is, wordt payment_intent.succeeded vaak OOK gestuurd.
      // We willen voorkomen dat we alles dubbel doen (zoals 2x mail sturen).
      // Checkout Sessions hebben meestal de session id in de metadata van de PI als we die erin zetten,
      // of we kunnen kijken of er een 'invoice' aan hangt.
      await handleSuccessfulPayment(paymentIntent)
    } else {
      console.log(`ℹ️ Onbehandeld event type: ${event.type}`)
    }
  } catch (error: any) {
    console.error("❌ Fout bij verwerken webhook event:", error)
    // We geven alsnog 200 terug om te voorkomen dat Stripe blijft retryen als het een code-fout is,
    // MAAR we loggen het wel. Indien het een DB error is, wil je misschien wel een retry.
    // Voor nu retourneren we 500 bij echte fouten zodat Stripe het opnieuw probeert.
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(sessionOrIntent: any) {
  const metadata = sessionOrIntent.metadata || {}
  const planId = metadata.plan
  let userId = sessionOrIntent.client_reference_id 
  const objectId = sessionOrIntent.id

  console.log(`🛠️ Verwerken van ${objectId} met metadata:`, JSON.stringify(metadata))

  if (!userId && metadata.userId) {
     userId = metadata.userId
  }

  // Get email and name
  const email = sessionOrIntent.customer_details?.email || metadata.guestEmail || sessionOrIntent.receipt_email
  const name = sessionOrIntent.customer_details?.name || metadata.guestName || "Student"

  if (!email) {
    console.error("❌ GEEN E-MAILADRES GEVONDEN IN STRIPE EVENT!")
    throw new Error("Missing email in event")
  }

  console.log(`📧 E-mail: ${email}, 👤 Naam: ${name}, 📦 Plan: ${planId}`)

  // 1. Zorg dat de gebruiker bestaat en een accessCode heeft
  let user = await getUserByEmail(email)
  let accessCode = ""

  if (!user) {
    console.log(`✨ Nieuwe gebruiker aanmaken voor: ${email}`)
    accessCode = await createUserWithAccessCode(email, name)
    user = await getUserByEmail(email)
    console.log(`✨ Nieuwe gebruiker aangemaakt met code: ${accessCode}`)
  } else {
    userId = user._id.toString()
    accessCode = user.accessCode
    console.log(`ℹ️ Bestaande gebruiker gevonden: ${userId}`)
    
    if (!accessCode) {
      console.log("⚠️ Bestaande gebruiker heeft geen accessCode, nieuwe aanmaken...")
      accessCode = await createUserWithAccessCode(email, name)
    }
  }

  // Voorkom dubbele verwerking (bv. zowel PI.succeeded als Checkout.completed)
  // We checken of dit specifieke objectId al eens is verwerkt voor deze gebruiker
  if (user && (user.lastPaymentSessionId === objectId)) {
    console.log(`⏭️ Event ${objectId} is al verwerkt voor deze gebruiker. Overslaan.`)
    return
  }

  // 2. Verstuur de e-mail (doe dit NU pas nadat we zeker weten dat we het niet dubbel doen)
  if (accessCode) {
    await sendAccessCodeEmail(email, name, accessCode)
  }

  // 3. Update het plan of de examens
  if (planId && (userId || user?._id)) {
    const finalUserId = userId || user._id.toString()
    console.log(`✅ Toekennen ${planId} aan gebruiker ${finalUserId}`)

    const isExamBundle = Object.values(EXAM_BUNDLES).some(b => b.id === planId);

    if (isExamBundle) {
      const bundle = Object.values(EXAM_BUNDLES).find(b => b.id === planId);
      if (bundle) {
        await addExams(finalUserId, bundle.amount, objectId);
        console.log(`✅ Added ${bundle.amount} exams to user ${finalUserId}`);
      }
    } else {
      await updateUserPlan(finalUserId, planId, sessionOrIntent)
    }
  } else {
    console.warn("⚠️ Geen planId of userId gevonden om te updaten.", { userId, planId })
  }
}
