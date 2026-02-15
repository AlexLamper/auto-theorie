import type React from "react"
import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Script from "next/script"
import { GoogleAnalytics } from "@next/third-parties/google"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Providers } from "@/components/Providers"

const manrope = Manrope({ subsets: ["latin"] })
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://auto-theorie.com"
const googleVerification = process.env.GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    url: siteUrl,
    siteName: "Auto Theorie",
    title: "Auto Theorie - Nederlandse Theorie-examens Oefenen",
    description:
      "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen. Geen registratie vereist, 100% gratis.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
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
    images: [`${siteUrl}/og-image.jpg`],
  },
  alternates: {
    canonical: "/",
  },
  verification: googleVerification ? { google: googleVerification } : undefined,
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5158083181827933"
     crossOrigin="anonymous"></script>
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
              url: siteUrl,
              description:
                "Het beste gratis platform om te oefenen voor je Nederlandse auto theorie-examen.",
              inLanguage: "nl-NL",
            }),
          }}
        />
      </head>
      <body className={`${manrope.className} antialiased min-h-screen flex flex-col bg-background`}>
        <Providers session={session}>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
      </body>
    </html>
  )
}
