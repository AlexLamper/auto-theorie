"use client"

import { BookOpen, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const isHomePage = pathname === "/"
  const showBackButton = !isHomePage

  const getPageTitle = () => {
    if (pathname.startsWith("/practice")) return "Oefenen"
    if (pathname.startsWith("/oefenexamens")) return "Examens"
    if (pathname.startsWith("/verkeersborden")) return "Verkeersborden"
    return null
  }


  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/leren", label: "Auto Theorie" },
    { href: "/oefenexamens", label: "Proefexamens" },
    { href: "/verkeersborden", label: "Verkeersborden" },
    { href: "/prijzen", label: "Prijzen" },
    { href: "/veelgestelde-vragen", label: "FAQ" },
    { href: "/over-ons", label: "Over ons" },
  ]

  const navItems = isAuthenticated
    ? [...navigationItems, { href: "/account", label: "Account" }]
    : navigationItems

  const userName = session?.user?.name || session?.user?.email || "Gebruiker"
  const planLabel = session?.user?.plan?.label
  const planExpiry = session?.user?.plan?.expiresAt
    ? new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(
        new Date(session.user.plan.expiresAt)
      )
    : null

  return (
    <header className="border-b border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Page title */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="relative h-6 w-32">
                <Image
                  src="/logo/transparent/logo-transparent.png"
                  alt="Auto Theorie"
                  fill
                  className="object-contain dark:hidden"
                  priority
                />
                <Image
                  src="/logo/transparent/logo-dark-transparent.png"
                  alt="Auto Theorie"
                  fill
                  className="object-contain hidden dark:block"
                  priority
                />
              </div>
            </Link>

            {/* Page title for non-home pages */}
            {getPageTitle() && (
              <>
                <div className="hidden sm:block w-px h-6 bg-slate-200" />
                <h2 className="hidden sm:block text-lg font-medium text-slate-600">
                  {getPageTitle()}
                </h2>
              </>
            )}
          </div>

          {/* Right side - Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="ml-2 flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-slate-200">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={userName}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-600">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900">{userName}</p>
                  <p className="text-xs text-slate-500">
                    {planLabel ? `${planLabel}${planExpiry ? ` • geldig tot ${planExpiry}` : ""}` : "Ingelogd"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-900"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Uitloggen
                </Button>
              </div>
            ) : (
              <Button asChild size="sm" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/inloggen">Inloggen</Link>
              </Button>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-100">
            <nav className="flex flex-col space-y-1 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-sm font-semibold text-slate-900">{userName}</p>
                  {planLabel && (
                    <p className="text-xs text-slate-500">
                      {planLabel}
                      {planExpiry ? ` • geldig tot ${planExpiry}` : ""}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-slate-500"
                    onClick={() => {
                      signOut({ callbackUrl: "/" })
                      setMobileMenuOpen(false)
                    }}
                  >
                    Uitloggen
                  </Button>
                </div>
              )}
              {!isAuthenticated && (
                <Link
                  href="/inloggen"
                  className="px-4 py-3 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Inloggen
                </Link>
              )}
              <div className="px-4 py-2">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
