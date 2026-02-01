import { BookOpen, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Gratis Auto Theorie</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">Het beste gratis platform voor auto theorie-examens in Nederland. Oefen onbeperkt en bereid je optimaal voor.</p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>devlamper06@gmail.com</span>
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
                <Link href="/leren" className="hover:text-blue-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Gevaarherkenning
                </Link>
              </li>
              <li>
                <Link href="/leren" className="hover:text-blue-400 transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Verkeersregels
                </Link>
              </li>
              <li>
                <Link href="/leren" className="hover:text-blue-400 transition-colors flex items-center">
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
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">
                  Privacy Beleid
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-blue-400 transition-colors">
                  Algemene Voorwaarden
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg text-slate-100">Pagina's</h4>
            <ul className="space-y-4 text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/leren" className="hover:text-blue-400 transition-colors">
                  Leren
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-blue-400 transition-colors">
                  Proefexamens
                </Link>
              </li>
              <li>
                <Link href="/verkeersborden" className="hover:text-blue-400 transition-colors">
                  Verkeersborden
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; 2025 Gratis Theorie. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  )
}