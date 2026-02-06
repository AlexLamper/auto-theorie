import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function KostenTheorieExamenPage() {
  return (
    <InfoPageLayout
      title="Kosten theorie-examen"
      intro="Dit zijn de belangrijkste kostenposten rondom het CBR theorie-examen."
      breadcrumbCurrent="Kosten theorie-examen"
    >
      <>
        <p>
          Het CBR rekent kosten voor het afleggen van het theorie-examen. De prijzen kunnen wijzigen en verschillen per type examen.
        </p>
        <h2>Waar betaal je voor?</h2>
        <ul>
          <li>Het standaard theorie-examen.</li>
          <li>Eventuele extra tijd of speciale voorzieningen.</li>
          <li>Hulpmiddelen zoals een tolk (indien van toepassing).</li>
        </ul>
        <h2>Controleer de actuele prijs</h2>
        <p>
          Bekijk altijd de actuele tarieven op de website van het CBR voordat je boekt.
        </p>
        <h2>Extra kosten</h2>
        <p>
          Houd daarnaast rekening met kosten voor leermiddelen, oefenexamens en eventueel een aanvullende cursus.
        </p>
      </>
    </InfoPageLayout>
  )
}
