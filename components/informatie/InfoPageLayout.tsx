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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <section className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 py-14 max-w-6xl">
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-slate-500 hover:text-blue-600">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-slate-400" />
                {includeParentLink && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/informatie" className="text-slate-500 hover:text-blue-600">Informatie</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-slate-400" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-slate-900 font-medium">{breadcrumbCurrent}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Info className="h-4 w-4" />
                Informatie
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mt-6">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground mt-4 max-w-3xl">
              {intro}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
            <div className="space-y-6">
              <InfoSidebar />
            </div>
            <div>
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm prose prose-slate max-w-none prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-blue-700">
                {children}
              </div>
              <MoreInfoLinks />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
