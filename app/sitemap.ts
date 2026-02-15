import type { MetadataRoute } from "next"
import { readdir } from "node:fs/promises"
import path from "node:path"

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://auto-theorie.com").replace(/\/$/, "")
const APP_DIR = path.join(process.cwd(), "app")

const EXCLUDED_SEGMENTS = new Set([
  "api",
  "account",
  "dashboard",
  "aanmelden",
  "inloggen",
  "betaling",
])

const EXCLUDED_ROUTES = new Set(["/oefenexamens/start"])

const LEER_CATEGORIEEN = [
  "verantwoord-en-milieubewust-rijden",
  "verkeersborden-en-verkeersregelaars",
  "verkeersregels-snelheden-en-parkeren",
  "verkeersveiligheid",
  "verkeerswetten",
  "voorrangsregels-kruispunten-en-voetgangers",
  "weggebruikers",
  "voertuig",
]

const VERKEERSBORDEN_CATEGORIEEN = ["auto", "alle"]

function isRouteGroup(segment: string) {
  return segment.startsWith("(") && segment.endsWith(")")
}

function isDynamicSegment(segment: string) {
  return segment.startsWith("[") && segment.endsWith("]")
}

function isPageFile(fileName: string) {
  return ["page.tsx", "page.ts", "page.jsx", "page.js"].includes(fileName)
}

function toRoute(segments: string[]) {
  if (segments.length === 0) return "/"
  return `/${segments.join("/")}`
}

async function collectStaticRoutes(currentDir: string, segments: string[] = []): Promise<string[]> {
  const entries = await readdir(currentDir, { withFileTypes: true })
  const routes: string[] = []

  if (entries.some((entry) => entry.isFile() && isPageFile(entry.name))) {
    const route = toRoute(segments)
    if (!EXCLUDED_ROUTES.has(route)) {
      routes.push(route)
    }
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith("_")) continue
    if (isDynamicSegment(entry.name)) continue

    if (isRouteGroup(entry.name)) {
      const groupRoutes = await collectStaticRoutes(path.join(currentDir, entry.name), segments)
      routes.push(...groupRoutes)
      continue
    }

    if (EXCLUDED_SEGMENTS.has(entry.name)) {
      continue
    }

    const childRoutes = await collectStaticRoutes(path.join(currentDir, entry.name), [...segments, entry.name])
    routes.push(...childRoutes)
  }

  return routes
}

function getPriority(route: string) {
  if (route === "/") return 1
  if (["/leren", "/oefenexamens", "/verkeersborden", "/prijzen"].includes(route)) return 0.9
  if (route.startsWith("/informatie")) return 0.8
  return 0.7
}

function getChangeFrequency(route: string): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (["/", "/leren", "/oefenexamens", "/verkeersborden"].includes(route)) return "daily"
  if (route.startsWith("/informatie")) return "weekly"
  return "monthly"
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = await collectStaticRoutes(APP_DIR)

  const dynamicRoutes = [
    ...LEER_CATEGORIEEN.map((slug) => `/leren/${slug}`),
    ...VERKEERSBORDEN_CATEGORIEEN.map((slug) => `/verkeersborden/${slug}`),
  ]

  const allRoutes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]))

  return allRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: getChangeFrequency(route),
    priority: getPriority(route),
  }))
}
