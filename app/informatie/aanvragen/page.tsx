import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function AanvragenPage() {
  return (
    <InfoPageLayout
      title="Aanvragen"
      intro="Zo vraag je het CBR theorie-examen aan in een paar stappen."
      breadcrumbCurrent="Aanvragen"
    >
      <>
        <h2>Stappenplan</h2>
        <ol>
          <li>Kies de gewenste examenvorm (standaard of met voorzieningen).</li>
          <li>Ga naar Mijn CBR en log in met je DigiD.</li>
          <li>Kies een locatie en datum die bij je past.</li>
          <li>Betaal de examenkosten en bevestig je reservering.</li>
        </ol>
        <h2>Bevestiging</h2>
        <p>
          Na het aanvragen ontvang je een bevestiging per e-mail. Controleer of alle gegevens kloppen.
        </p>
        <h2>Goed voorbereid</h2>
        <p>
          Plan je examen pas als je voldoende hebt geoefend. Zo voorkom je onnodige kosten.
        </p>
      </>
    </InfoPageLayout>
  )
}
