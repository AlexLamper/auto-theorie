export const PLAN_EXAM_LIMITS: Record<string, number> = {
  "auto-dag": 3,
  "auto-week": 5,
  "auto-maand": 10,
}

export function hasActivePlan(plan?: { expiresAt?: string | Date | null }): boolean {
  if (!plan?.expiresAt) return false
  const expires = typeof plan.expiresAt === "string" ? new Date(plan.expiresAt) : plan.expiresAt
  return expires.getTime() > Date.now()
}

export function getExamLimit(planName?: string, hasPlan = false): number {
  if (!hasPlan) return 1
  if (!planName) return 1
  return PLAN_EXAM_LIMITS[planName] ?? 1
}
