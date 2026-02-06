import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function ArtikelenPage() {
  return (
    <InfoPageLayout
      title="Artikelen"
      intro="Verdiep je kennis met praktische artikelen en extra uitleg."
      breadcrumbCurrent="Artikelen"
    >
      <>
        <h2>Extra uitleg</h2>
        <p>
          In onze artikelen vind je aanvullende tips, uitleg en handige overzichten. Zo leer je sneller en beter.
        </p>
        <h2>Blijf op de hoogte</h2>
        <p>
          We voegen regelmatig nieuwe artikelen toe die aansluiten op het theorie-examen.
        </p>
      </>
    </InfoPageLayout>
  )
}
