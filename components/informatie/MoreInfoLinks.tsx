"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { informatieLinks } from "@/lib/informatie"

const normalizePath = (path: string) => {
  const cleaned = path.replace(/\/+$/, "")
  return cleaned.length === 0 ? "/" : cleaned
}

export default function MoreInfoLinks() {
  const pathname = usePathname()
  const currentPath = normalizePath(pathname)

  const links = informatieLinks
    .filter((item) => normalizePath(item.href) !== currentPath)
    .slice(0, 4)

  if (links.length === 0) return null

  return (
    <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">
        Meer weten over het auto theorie-examen?
      </h3>
      <p className="text-sm text-muted-foreground mt-2">
        Wil je meer weten over het auto theorie-examen, of over bovenstaande belangrijke aspecten? Bekijk dan ook de volgende pagina's:
      </p>
      <ul className="mt-4 space-y-2">
        {links.map((item) => (
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
    </div>
  )
}
