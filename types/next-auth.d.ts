import type { DefaultSession, DefaultUser } from "next-auth"
import type { StoredPlan } from "@/lib/user"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string
      plan?: StoredPlan
    }
  }

  interface User extends DefaultUser {
    plan?: StoredPlan
    removalAt?: Date
    streak?: number
    lastStreakUpdate?: Date
  }
}
