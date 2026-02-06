import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function WatMeeTeNemenPage() {
  return (
    <InfoPageLayout
      title="Wat mee te nemen?"
      intro="Zorg dat je de juiste documenten bij je hebt op de examendag."
      breadcrumbCurrent="Wat mee te nemen?"
    >
      <>
        <h2>Verplichte documenten</h2>
        <ul>
          <li>Een geldig identiteitsbewijs (paspoort, ID-kaart of rijbewijs).</li>
          <li>Je reserveringsbevestiging of oproep (digitaal is meestal voldoende).</li>
        </ul>
        <h2>Handig om mee te nemen</h2>
        <ul>
          <li>Eventuele hulpmiddelen die je vooraf hebt aangevraagd.</li>
          <li>Een flesje water en iets warms om aan te trekken.</li>
        </ul>
        <h2>Op tijd aanwezig</h2>
        <p>
          Kom minimaal 15 minuten van tevoren. Zo kun je rustig inchecken en begin je ontspannen aan het examen.
        </p>
      </>
    </InfoPageLayout>
  )
}
