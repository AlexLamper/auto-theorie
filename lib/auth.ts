import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { ensureUserRemovalDate, findUserByAccessCode } from "@/lib/user"

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Access Code",
      credentials: {
        code: { label: "Toegangscode", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.code) return null
        
        const user = await findUserByAccessCode(credentials.code)

        if (user) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            plan: user.plan,
            credits: user.credits,
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.plan = (user as any).plan
        token.credits = (user as any).credits
      }
      if (trigger === "update") {
        if (session?.plan) token.plan = session.plan
        if (session?.credits !== undefined) token.credits = session.credits
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.plan = token.plan as any
        session.user.credits = (token.credits as number) || 0
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      await ensureUserRemovalDate(user.id)
    },
    async signIn({ user }) {
      await ensureUserRemovalDate(user.id)
    },
  },
  pages: {
    signIn: "/inloggen",
  },
}
