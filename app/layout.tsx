import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"
import { SpeechProvider } from "@/lib/SpeechContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Gratis Theorie - Gratis Nederlandse Theorie-examens Oefenen",
    template: "%s | Gratis Theorie",
  },
  description:
    "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen. Geen registratie vereist, 100% gratis, actuele vragen en proefexamens.",
  keywords: [
    "theorie examen",
    "gratis theorie",
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
  authors: [{ name: "Gratis Theorie Team" }],
  creator: "Gratis Theorie",
  publisher: "Gratis Theorie",
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
    url: "https://gratis-theorie.com",
    siteName: "Gratis Theorie",
    title: "Gratis Auto Theorie - Gratis Nederlandse Theorie-examens Oefenen",
    description:
      "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen. Geen registratie vereist, 100% gratis.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gratis Auto Theorie - Gratis Nederlandse Theorie-examens",
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
    canonical: "https://gratis-theorie.com",
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
    <html lang="nl">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5158083181827933"
     crossOrigin="anonymous"></script>
        <link rel="canonical" href="https://gratis-theorie.com" />
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
              name: "Gratis Auto Theorie",
              url: "https://gratis-theorie.com",
              description:
                "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen.",
              inLanguage: "nl-NL",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://gratis-theorie.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <SpeechProvider>
          <Navbar />
          <main>{children}</main>
        </SpeechProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  )
}
