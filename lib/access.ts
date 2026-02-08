export const PLAN_EXAM_LIMITS: Record<string, number> = {
  "plan_basic": 1,
  "plan_pro": 3,
  "plan_premium": 7,
}

export function hasActivePlan(plan?: { expiresAt?: string | Date | null }): boolean {
  if (!plan?.expiresAt) return false
  const expires = typeof plan.expiresAt === "string" ? new Date(plan.expiresAt) : plan.expiresAt
  return expires.getTime() > Date.now()
}

export function getExamLimit(planName?: string, hasPlan = false, userLimit = 0): number {
  const planLimit = (hasPlan && planName) ? (PLAN_EXAM_LIMITS[planName] ?? 0) : 0;
  // Everyone gets at least 1 free exam attempt.
  // Otherwise, it's the sum of their plan allowance and extra purchased attempts.
  return Math.max(1, planLimit + userLimit);
}
