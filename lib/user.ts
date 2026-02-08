import type Stripe from "stripe"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365

const PLAN_DEFINITIONS: Record<
  string,
  {
    label: string
    durationDays: number
  }
> = {
  "plan_basic": { label: "Basic", durationDays: 1 },
  "plan_pro": { label: "Pro", durationDays: 7 },
  "plan_premium": { label: "Premium", durationDays: 31 },
}

let removalIndexEnsured = false

function toMetadata(metadata?: Stripe.Metadata | null) {
  if (!metadata) return {}
  const safeMetadata: Record<string, string> = {}
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value === "string") {
      safeMetadata[key] = value
    }
  }
  return safeMetadata
}

export interface StoredPlan {
  name: string
  label: string
  durationDays: number
  startedAt: Date
  expiresAt: Date
  stripeSessionId: string
  amount: number
  currency: string
  metadata: Record<string, string>
}

async function getUsersCollection() {
  const { db } = await connectToDatabase()
  if (!removalIndexEnsured) {
    await db
      .collection("users")
      .createIndex({ removalAt: 1 }, { background: true, expireAfterSeconds: 0 })
    removalIndexEnsured = true
  }
  return db.collection("users")
}

export async function ensureUserRemovalDate(userId: string, referenceDate = new Date()) {
  const collection = await getUsersCollection()
  
  let query: any = { _id: userId }
  try {
    if (ObjectId.isValid(userId)) {
      query = { _id: new ObjectId(userId) }
    }
  } catch (e) {}

  const user = await collection.findOne(query, { projection: { removalAt: 1, createdAt: 1 } })

  const updates: Record<string, Date> = {}
  if (!user?.createdAt) {
    updates.createdAt = referenceDate
  }
  if (!user?.removalAt) {
    updates.removalAt = new Date(referenceDate.getTime() + ONE_YEAR_MS)
  }

  if (Object.keys(updates).length === 0) {
    return
  }

  await collection.updateOne(query, { $set: updates })
}

export async function updateUserPlan(
  userId: string,
  planId: string,
  checkoutSession: Stripe.Checkout.Session
): Promise<StoredPlan> {
  const definition = PLAN_DEFINITIONS[planId]
  if (!definition) {
    throw new Error("Onbekend plan")
  }

  const now = new Date()
  const startDate = checkoutSession.created
    ? new Date(checkoutSession.created * 1000)
    : now
  const expiresAt = new Date(startDate.getTime() + definition.durationDays * 24 * 60 * 60 * 1000)

  const plan: StoredPlan = {
    name: planId,
    label: definition.label,
    durationDays: definition.durationDays,
    startedAt: startDate,
    expiresAt,
    stripeSessionId: checkoutSession.id,
    amount: checkoutSession.amount_total ?? 0,
    currency: (checkoutSession.currency || "eur").toUpperCase(),
    metadata: toMetadata(checkoutSession.metadata),
  }

  const collection = await getUsersCollection()
  
  let query: any = { _id: userId }
  try {
    if (ObjectId.isValid(userId)) {
      query = { _id: new ObjectId(userId) }
    }
  } catch (e) {}

  await collection.updateOne(
    query,
    {
      $set: {
        plan,
        lastPaymentAt: new Date(),
        lastPaymentSessionId: checkoutSession.id,
      },
    }
  )

  return plan
}

export async function findUserById(userId: string) {
  const collection = await getUsersCollection()
  
  let query: any = { _id: userId }
  try {
    if (ObjectId.isValid(userId)) {
      query = { _id: new ObjectId(userId) }
    }
  } catch (e) {}

  return collection.findOne(query)
}

export async function updateAndGetStreak(userId: string): Promise<number> {
  const collection = await getUsersCollection()
  
  let query: any = { _id: userId }
  try {
    if (ObjectId.isValid(userId)) {
      query = { _id: new ObjectId(userId) }
    }
  } catch (e) {}

  const user = await collection.findOne(query)
  if (!user) return 0

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // Midnight 00:00:00
  
  const lastUpdate = user.lastStreakUpdate ? new Date(user.lastStreakUpdate) : null
  const lastDate = lastUpdate ? new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate()) : null
  
  let newStreak = user.streak || 0
  let shouldUpdate = false;

  if (!lastDate) {
    // First time
    newStreak = 1
    shouldUpdate = true
  } else {
    const diffTime = today.getTime() - lastDate.getTime()
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      // Same day, do nothing
    } else if (diffDays === 1) {
      // Consecutive day
      newStreak += 1
      shouldUpdate = true
    } else {
      // Missed a day or more
      newStreak = 1
      shouldUpdate = true
    }
  }

  if (shouldUpdate) {
    await collection.updateOne(query, { $set: { streak: newStreak, lastStreakUpdate: now } })
  }

  return newStreak
}

export async function addExams(userId: string, amount: number) {
  const collection = await getUsersCollection()
  let query: any = { _id: userId }
  try {
    if (ObjectId.isValid(userId)) {
      query = { _id: new ObjectId(userId) }
    }
  } catch (e) {}

  await collection.updateOne(query, { 
    $inc: { examLimit: amount },
  }, { upsert: false })
}

