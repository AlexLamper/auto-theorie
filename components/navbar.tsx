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
  
  // Calculate if user has active plan
  const hasPlan = !!(
    session?.user?.plan?.expiresAt && 
    new Date(session.user.plan.expiresAt) > new Date()
  )

  const isHomePage = pathname === "/"

  const getPageTitle = () => {
    if (pathname === "/") return null
    if (pathname.startsWith("/practice")) return "Oefenen"
    if (pathname.startsWith("/oefenexamens")) return "Examens"
    if (pathname.startsWith("/verkeersborden")) return "Verkeersborden"
    if (pathname.startsWith("/leren")) return "Auto Theorie"
    if (pathname.startsWith("/informatie")) return "Informatie"
    if (pathname.startsWith("/account")) return "Account"
    if (pathname.startsWith("/prijzen")) return "Prijzen"
    if (pathname.startsWith("/contact")) return "Contact"
    if (pathname.startsWith("/over-ons")) return "Over ons"
    if (pathname.startsWith("/veelgestelde-vragen")) return "FAQ"
    if (pathname.startsWith("/privacy-policy")) return "Privacy"
    if (pathname.startsWith("/terms-of-service")) return "Voorwaarden"
    if (pathname.startsWith("/inloggen")) return "Inloggen"
    if (pathname.startsWith("/aanmelden")) return "Aanmelden"
    if (pathname === "/dashboard") return "Dashboard"
    return null
  }


  const navigationItems = [
    { href: hasPlan ? "/dashboard" : "/", label: hasPlan ? "Dashboard" : "Home" },
    { href: "/leren", label: "Auto Theorie" },
    { href: "/oefenexamens", label: "Proefexamens" },
    { href: "/verkeersborden", label: "Verkeersborden" },
    { href: "/prijzen", label: "Prijzen", hidden: hasPlan }, // Start hiding pricing
    { href: "/informatie", label: "Informatie" },
  ]

  const navItems = navigationItems.filter(item => !item.hidden)

  const userName = session?.user?.name || session?.user?.email || "Gebruiker"
  const planLabel = session?.user?.plan?.label
  const planExpiry = session?.user?.plan?.expiresAt
    ? new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium" }).format(
        new Date(session.user.plan.expiresAt)
      )
    : null

  const isAppPage = pathname !== "/" && !pathname.startsWith("/auth")

  return (
    <header className={`border-b sticky top-0 z-[100] transition-colors duration-200 ${isAppPage ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100'}`}>
      <div className="container mx-auto px-4 py-4 max-w-[1600px]">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Page title */}
          <div className="flex items-center space-x-4">
            <Link href={hasPlan ? "/dashboard" : "/"} className="flex items-center space-x-2 group cursor-pointer">
              <img
                src="/logo/transparent/logo-transparent.png"
                alt="Logo"
                className={`h-8 w-8 object-contain ${isAppPage ? 'brightness-0 invert' : ''}`}
              />
              <span className={`text-xl font-bold transition-colors ${isAppPage ? 'text-white group-hover:text-blue-400' : 'text-slate-900 group-hover:text-blue-600'}`}>
                Auto Theorie
              </span>
            </Link>

            {/* Page title for non-home pages */}
            {getPageTitle() && (
              <>
                <div className={`hidden sm:block w-px h-6 ${isAppPage ? 'bg-slate-700' : 'bg-slate-200'}`} />
                <h2 className={`hidden sm:block text-lg font-medium ${isAppPage ? 'text-slate-300' : 'text-slate-600'}`}>
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
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? isAppPage 
                         ? "bg-slate-800 text-blue-400" 
                         : "bg-blue-50 text-blue-700"
                    : isAppPage 
                        ? "text-slate-400 hover:text-white hover:bg-slate-800" 
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className={isAppPage ? "brightness-0 invert opacity-70" : ""}>
               <ThemeToggle />
            </div>
            {isAuthenticated ? (
              <div className="ml-2 flex items-center gap-2">
                <Link href="/account" className={`flex items-center gap-3 rounded-full border pl-1 pr-4 py-1 text-sm transition-colors cursor-pointer ${isAppPage ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                  <div className={`relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full ${isAppPage ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={userName}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-600">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className={`text-sm font-bold leading-tight ${isAppPage ? 'text-white' : 'text-slate-900'}`}>{userName}</p>
                    {planLabel && (
                      <p className={`text-[10px] font-medium leading-tight mt-0.5 ${isAppPage ? 'text-blue-400' : 'text-slate-500'}`}>{planLabel}</p>
                    )}
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-900 px-2"
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
                <div className={`border-t pt-3 ${isAppPage ? 'border-slate-800' : 'border-slate-100'}`}>
                  <p className={`text-sm font-bold ${isAppPage ? 'text-white' : 'text-slate-900'}`}>{userName}</p>
                  {planLabel && (
                    <p className={`text-xs ${isAppPage ? 'text-blue-400' : 'text-slate-500'}`}>
                      {planLabel}
                      {planExpiry ? ` • geldig tot ${planExpiry}` : ""}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`mt-2 ${isAppPage ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500'}`}
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
