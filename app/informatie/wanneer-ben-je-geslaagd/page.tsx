import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function WanneerGeslaagdPage() {
  return (
    <InfoPageLayout
      title="Wanneer ben je geslaagd?"
      intro="Zo beoordeelt het CBR of je klaar bent voor het praktijkexamen."
      breadcrumbCurrent="Wanneer ben je geslaagd?"
    >
      <>
        <p>
          Het CBR theorie-examen bestaat uit meerdere onderdelen. Per onderdeel hanteert het CBR een vaste norm. Dat betekent dat je niet alleen het totaal moet halen, maar ook per onderdeel voldoende moet scoren.
        </p>
        <h2>Waar kijkt het CBR naar?</h2>
        <ul>
          <li>Je kennis van verkeersregels en verkeersborden.</li>
          <li>Je inzicht in verkeerssituaties en veilig gedrag.</li>
          <li>Je snelheid en nauwkeurigheid bij het beantwoorden.</li>
        </ul>
        <h2>Actuele normen</h2>
        <p>
          De exacte slaagnormen kunnen wijzigen. Controleer daarom altijd de meest recente informatie op de website van het CBR voordat je je examen plant.
        </p>
        <h2>Tip</h2>
        <p>
          Oefen met volledige proefexamens om te zien of je op alle onderdelen voldoende scoort. Zo voorkom je verrassingen op de examendag.
        </p>
      </>
    </InfoPageLayout>
  )
}
