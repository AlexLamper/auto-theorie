"use client"

import { BookOpen, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    { href: "/pricing", label: "Prijzen" },
    { href: "/faq", label: "FAQ" },
    { href: "/over-ons", label: "Over ons" },
  ]

  return (
    <header className="border-b border-slate-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Page title */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Auto Theorie</h1>
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
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/inloggen">Inloggen</Link>
            </Button>
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
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/inloggen"
                className="px-4 py-3 rounded-lg text-sm font-medium text-blue-700 bg-blue-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inloggen
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
