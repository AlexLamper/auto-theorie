import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"
import { SpeechProvider } from "@/lib/SpeechContext"
import { ThemeProvider } from "@/components/theme-provider"

const manrope = Manrope({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Auto Theorie - Gratis Nederlandse Theorie-examens Oefenen",
    template: "%s | Auto Theorie",
  },
  description:
    "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen. Geen registratie vereist, 100% gratis, actuele vragen en proefexamens.",
  keywords: [
    "theorie examen",
    "auto theorie",
    "auto theorie",
    "CBR theorie",
    "rijbewijs theorie",
    "theorie oefenen",
    "proefexamen",
    "verkeersborden",
    "Nederlandse theorie",
    "theorie vragen",
    "rijschool",
    "theorie toppers alternatief",
  ],
  authors: [{ name: "Auto Theorie Team" }],
  creator: "Auto Theorie",
  publisher: "Auto Theorie",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://auto-theorie.com",
    siteName: "Auto Theorie",
    title: "Auto Theorie - Nederlandse Theorie-examens Oefenen",
    description:
      "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen. Geen registratie vereist, 100% gratis.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Auto Theorie - Nederlandse Theorie-examens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gratis Auto Theorie - Gratis Nederlandse Theorie-examens Oefenen",
    description:
      "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen. 100% gratis, geen registratie vereist.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://auto-theorie.com",
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5158083181827933"
     crossOrigin="anonymous"></script>
        <link rel="canonical" href="https://auto-theorie.com" />
        <meta name="geo.region" content="NL" />
        <meta name="geo.country" content="Netherlands" />
        <meta name="language" content="Dutch" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Auto Theorie",
              url: "https://auto-theorie.com",
              description:
                "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen.",
              inLanguage: "nl-NL",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://auto-theorie.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${manrope.className} antialiased min-h-screen flex flex-col bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SpeechProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </SpeechProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  )
}
