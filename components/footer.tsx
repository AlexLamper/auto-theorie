import { BookOpen, Mail, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-black text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Image
                src="/logo/transparent/logo-transparent.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain brightness-0 invert"
              />
              <span className="text-xl font-bold text-white">Auto Theorie</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">Het beste platform voor auto theorie-examens in Nederland. Oefen gericht en slaag met vertrouwen.</p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <a href="mailto:info@auto-theorie.com" className="hover:text-blue-400 transition-colors">info@auto-theorie.com</a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>Zuid-Holland, Nederland</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-slate-100">Auto Theorie</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <Link href="/leren/gevaarherkenning" className="hover:text-blue-400 transition-colors flex items-center cursor-pointer">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Gevaarherkenning
                </Link>
              </li>
              <li>
                <Link href="/leren/verkeersregels-en-snelheid" className="hover:text-blue-400 transition-colors flex items-center cursor-pointer">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Verkeersregels
                </Link>
              </li>
              <li>
                <Link href="/leren/voorrang-en-voor-laten-gaan" className="hover:text-blue-400 transition-colors flex items-center cursor-pointer">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Verkeersinzicht
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-slate-100">Platform</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors cursor-pointer">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/prijzen" className="hover:text-blue-400 transition-colors cursor-pointer">
                  Prijzen
                </Link>
              </li>
              <li>
                <Link href="/veelgestelde-vragen" className="hover:text-blue-400 transition-colors cursor-pointer">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors cursor-pointer">
                  Privacy Beleid
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-blue-400 transition-colors cursor-pointer">
                  Algemene Voorwaarden
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-slate-100">Account</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <Link href="/inloggen" className="hover:text-blue-400 transition-colors cursor-pointer">
                  Inloggen
                </Link>
              </li>
              <li>
                <Link href="/aanmelden" className="hover:text-blue-400 transition-colors cursor-pointer">
                  Aanmelden
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; 2025 Auto Theorie. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  )
}