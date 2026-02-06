import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function BedrijfsinformatiePage() {
  return (
    <InfoPageLayout
      title="Bedrijfsinformatie"
      intro="Meer over Auto Theorie en onze missie."
      breadcrumbCurrent="Bedrijfsinformatie"
    >
      <>
        <h2>Onze missie</h2>
        <p>
          We willen theorie-examens toegankelijk en begrijpelijk maken voor iedereen die zijn rijbewijs wil halen.
        </p>
        <h2>Onze aanpak</h2>
        <p>
          Duidelijke uitleg, actuele vragen en een rustige leeromgeving. Zo kun je gericht oefenen en sneller slagen.
        </p>
      </>
    </InfoPageLayout>
  )
}
