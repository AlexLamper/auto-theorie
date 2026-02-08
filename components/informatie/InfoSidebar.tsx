import Link from "next/link"
import { informatieLinks, overOnsLinks } from "@/lib/informatie"

export default function InfoSidebar() {
  return (
    <div className="space-y-6">
      <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Veelgestelde vragen</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Handige pagina's om je goed voor te bereiden op het theorie-examen.
        </p>
        <ul className="mt-4 space-y-2">
          {informatieLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <aside className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Over ons</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Meer informatie over Auto Theorie en onze dienstverlening.
        </p>
        <ul className="mt-4 space-y-2">
          {overOnsLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
