// app/hulpmiddelen/page.tsx
import Image from "next/image"
import { Metadata } from "next"
import { load } from "cheerio"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Hulpmiddelen – Auto Theorie",
  description: "Bol affiliate producten met afbeelding en titel via scraping",
}

const SITE_ID = process.env.NEXT_PUBLIC_BOL_SITE_ID!

interface ProductConfig {
  url: string
  subid: string
}
interface ProductMeta {
  title: string
  imageUrl?: string
  description: string
  url: string
  subid: string
}

async function scrapeBolProduct(productUrl: string): Promise<{title:string;imageUrl?:string;description:string} | null> {
  try {
    const res = await fetch(productUrl)
    if (!res.ok) return null
    const html = await res.text()
    const $ = load(html)
    const title = $('meta[property="og:title"]').attr("content")?.trim() || ""
    const imageUrl = $('meta[property="og:image"]').attr("content")?.trim()
    const description = $('meta[property="og:description"]').attr("content")?.trim() || ""
    return { title, imageUrl, description }
  } catch {
    return null
  }
}

const productConfigs: ProductConfig[] = [
  {
    url: "https://www.bol.com/nl/nl/f/auto-theorieboek-rijbewijs-b-auto-vekabest/9300000143665827/",
    subid: "auto_vekabest_2025",
  },
  {
    url: "https://www.bol.com/nl/nl/f/compact-auto-theorieboek-rijbewijs-b-vekabest/9300000148098642/",
    subid: "auto_compact_2025",
  },
  {
    url: "https://www.bol.com/nl/nl/f/auto-theorieboek-2025-rijbewijs-b-met-samenvatting-cbr-info-en-borden-boek/9300000173965977/",
    subid: "auto_fullpakket_2025",
  },
]

export default async function HulpmiddelenPage() {
  const fetched: ProductMeta[] = []
  for (const cfg of productConfigs) {
    const md = await scrapeBolProduct(cfg.url)
    if (md) {
      fetched.push({ ...md, url: cfg.url, subid: cfg.subid })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 mb-6">
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">Hulpmiddelen</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Aanbevolen theorieboeken en leermiddelen om je voor te bereiden op het examen.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {fetched.map((p) => {
            const params = new URLSearchParams({
              t: "url",
              s: SITE_ID,
              url: p.url,
              f: "txl",
              subid: p.subid,
              name: p.title,
            })
            const trackingUrl = `https://partner.bol.com/click/click?&${params}`

            return (
              <Card key={p.subid} className="border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden flex flex-col h-full group bg-white dark:bg-slate-900">
                {p.imageUrl && (
                  <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-950/50 p-6 flex items-center justify-center overflow-hidden">
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      width={300}
                      height={300}
                      className="object-contain max-h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-1">
                    {p.description}
                  </CardDescription>
                  <Button asChild className="w-full bg-slate-900 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-white transition-colors mt-auto">
                    <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                      Bekijk op Bol.com
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  )
}
