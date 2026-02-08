export const PLAN_EXAM_LIMITS: Record<string, number> = {
  "plan_basic": 100,
  "plan_pro": 200,
  "plan_premium": 500,
}

export function hasActivePlan(plan?: { expiresAt?: string | Date | null }): boolean {
  if (!plan?.expiresAt) return false
  const expires = typeof plan.expiresAt === "string" ? new Date(plan.expiresAt) : plan.expiresAt
  return expires.getTime() > Date.now()
}

export function getExamLimit(planName?: string, hasPlan = false): number {
  if (!hasPlan) return 1
  if (!planName) return 1
  return PLAN_EXAM_LIMITS[planName] ?? 100
}
