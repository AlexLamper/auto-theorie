import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function VeiligBetalenPage() {
  return (
    <InfoPageLayout
      title="Veilig betalen"
      intro="Je betaling verloopt via een beveiligde en betrouwbare omgeving."
      breadcrumbCurrent="Veilig betalen"
    >
      <>
        <h2>Beveiligde betaalomgeving</h2>
        <p>
          We gebruiken een versleutelde verbinding zodat je gegevens veilig worden verwerkt.
        </p>
        <h2>Betalingsmethoden</h2>
        <p>
          Je kunt betalen met gangbare betaalmethoden. Na betaling krijg je direct toegang.
        </p>
        <h2>Transparant en duidelijk</h2>
        <p>
          Je betaalt eenmalig voor de gekozen periode. Er zijn geen verborgen kosten.
        </p>
      </>
    </InfoPageLayout>
  )
}
