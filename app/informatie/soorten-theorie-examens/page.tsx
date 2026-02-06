import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function SoortenTheorieExamensPage() {
  return (
    <InfoPageLayout
      title="Soorten theorie-examens"
      intro="Kies de examenvorm die het beste bij jouw situatie past."
      breadcrumbCurrent="Soorten theorie-examens"
    >
      <>
        <p>
          Bij het CBR kun je kiezen uit verschillende vormen van het theorie-examen. Welke optie het beste is, hangt af van jouw voorkeuren en eventuele extra ondersteuning.
        </p>
        <h2>Individueel theorie-examen</h2>
        <p>
          Dit is de meest gekozen optie. Je maakt het examen zelfstandig op een computer in een examenzaal.
        </p>
        <h2>Klassikaal theorie-examen</h2>
        <p>
          Bij een klassikaal examen krijg je extra uitleg en begeleiding. Dit kan prettig zijn als je liever met instructie werkt.
        </p>
        <h2>Met extra voorzieningen</h2>
        <p>
          Het CBR biedt aanvullende opties, zoals extra tijd of andere hulpmiddelen. Bekijk de mogelijkheden bij het CBR voor de meest actuele informatie.
        </p>
      </>
    </InfoPageLayout>
  )
}
