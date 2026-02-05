import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { findUserById } from "@/lib/user"

const dateFormatter = new Intl.DateTimeFormat("nl-NL", {
  dateStyle: "medium",
})

const currencyFormatter = (amount: number, currency: string) =>
  new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount / 100)

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-xl mx-auto rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900">Account</h1>
            <p className="mt-3 text-slate-600">
              Log in om je accountgegevens, betalingen en plannen in te zien. Alles wordt gekoppeld aan je Google-
              account zodat je voortgang bewaard blijft.
            </p>
            <div className="mt-8">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/inloggen">Inloggen</Link>
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  const user = await findUserById(session.user.id)
  const plan = user?.plan
  const planAmount = plan ? currencyFormatter(plan.amount, plan.currency) : null
  const planStart = plan?.startedAt ? new Date(plan.startedAt) : null
  const planExpiry = plan?.expiresAt ? new Date(plan.expiresAt) : null
  const removalAt = user?.removalAt ? new Date(user.removalAt) : null
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Account</p>
            <h1 className="text-3xl font-bold text-slate-900 mt-3">{session.user.name || session.user.email}</h1>
            <p className="mt-2 text-slate-600">
              Alle betalingen, plannen en voortgang worden opgeslagen op dit account. Betaal je voor een pakket? Dan
              wordt het pakket en de geldigheidsduur direct gekoppeld aan deze gebruiker.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Actieve toegang</h2>
              {plan ? (
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p className="text-sm font-semibold text-slate-900">{plan.label}</p>
                  <p>Plan: {plan.name}</p>
                  <p>Geleverd voor: {planAmount}</p>
                  <p>Start: {planStart ? dateFormatter.format(planStart) : "Onbekend"}</p>
                  <p>Vervalt: {planExpiry ? dateFormatter.format(planExpiry) : "Onbekend"}</p>
                  <p>Laatst betaald: {user?.lastPaymentAt ? dateFormatter.format(new Date(user.lastPaymentAt)) : "Nog geen betaling"}</p>
                  {plan.metadata && Object.keys(plan.metadata).length > 0 && (
                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <p className="font-semibold uppercase tracking-[0.2em] text-slate-400">Metadata</p>
                      {Object.entries(plan.metadata).map(([key, value]) => (
                        <p key={key}>
                          {key}: {value}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">Je hebt op dit moment geen actief betaalde toegang.</p>
              )}
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Accountstatus</h2>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Account aangemaakt: {createdAt ? dateFormatter.format(createdAt) : "Onbekend"}</p>
                <p>
                  Verwijdering gepland: {removalAt ? dateFormatter.format(removalAt) : "Binnen 1 jaar na aanmaak"}
                </p>
                <p className="text-xs text-slate-500">
                  Accounts worden automatisch uit de database verwijderd zodra de datum is verstreken. Log opnieuw in als
                  je langer wilt oefenen.
                </p>
              </div>
              <div className="mt-6">
                <Button asChild variant="outline" className="w-full border-slate-200 text-slate-700">
                  <Link href="/oefenexamens">Ga naar oefenexamens</Link>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
