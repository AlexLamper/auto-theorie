const categorieNamen = [
  "Verantwoord en milieubewust rijden",
  "Verkeersborden en verkeersregelaars",
  "Verkeersregels, snelheden en parkeren",
  "Verkeersveiligheid",
  "Verkeerswetten",
  "Voorrangsregels, kruispunten en voetgangers",
  "Weggebruikers",
  "Voertuig"
]

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")

module.exports = {
  siteUrl: 'https://gratis-theorie.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,

  async additionalPaths(config) {
    const paths = []

    // /leren
    paths.push({ loc: `/leren` })

    categorieNamen.forEach((catName) => {
      const slug = slugify(catName)
      paths.push({ loc: `/leren/${slug}` })
    })

    return paths
  }
}
