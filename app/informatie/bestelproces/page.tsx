import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function BestelprocesPage() {
  return (
    <InfoPageLayout
      title="Bestelproces"
      intro="Zo werkt het bestellen van een pakket bij Auto Theorie."
      breadcrumbCurrent="Bestelproces"
    >
      <>
        <h2>Stap voor stap</h2>
        <ol>
          <li>Kies een pakket dat bij je past (dag, week of maand).</li>
          <li>Rond de betaling af via onze veilige betaalomgeving.</li>
          <li>Je account wordt automatisch aangemaakt.</li>
          <li>Je krijgt direct toegang tot alle content.</li>
        </ol>
        <h2>Direct starten</h2>
        <p>
          Na betaling kun je meteen beginnen met leren en oefenen. Je voortgang wordt opgeslagen zodat je later verder kunt gaan.
        </p>
      </>
    </InfoPageLayout>
  )
}
