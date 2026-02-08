import { ReactNode } from "react"
import { Info } from "lucide-react"
import Footer from "@/components/footer"
import InfoSidebar from "@/components/informatie/InfoSidebar"
import MoreInfoLinks from "@/components/informatie/MoreInfoLinks"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface InfoPageLayoutProps {
  title: string
  intro: string
  breadcrumbCurrent: string
  includeParentLink?: boolean
  children: ReactNode
}

export default function InfoPageLayout({
  title,
  intro,
  breadcrumbCurrent,
  includeParentLink = true,
  children,
}: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pb-24 pt-12 border-b border-slate-700/50">
        <div className="container mx-auto px-4 max-w-6xl">
           <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
           <p className="text-lg text-slate-400 max-w-2xl">{intro}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl -mt-16 relative z-10 flex-1 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12 h-full">
                <Breadcrumb className="mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/" className="text-slate-500 hover:text-blue-600">Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-slate-300 dark:text-slate-700" />
                    {includeParentLink && (
                      <>
                        <BreadcrumbItem>
                          <BreadcrumbLink href="/informatie" className="text-slate-500 hover:text-blue-600">Informatie</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-slate-300 dark:text-slate-700" />
                      </>
                    )}
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-slate-900 dark:text-white font-medium">{breadcrumbCurrent}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 dark:prose-strong:text-white">
                   {children}
                </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
             <InfoSidebar />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
