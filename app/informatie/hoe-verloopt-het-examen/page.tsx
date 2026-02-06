import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function HoeVerlooptHetExamenPage() {
  return (
    <InfoPageLayout
      title="Hoe verloopt het examen?"
      intro="Zo ziet het CBR theorie-examen er stap voor stap uit."
      breadcrumbCurrent="Hoe verloopt het examen?"
    >
      <>
        <h2>Aankomst en inchecken</h2>
        <p>
          Meld je bij de balie en toon je identiteitsbewijs. Je wordt daarna naar de examenzaal begeleid.
        </p>
        <h2>Uitleg en start</h2>
        <p>
          Je krijgt een korte uitleg over het systeem en de regels. Daarna start het examen automatisch op je scherm.
        </p>
        <h2>De onderdelen</h2>
        <p>
          Het examen bestaat uit meerdere onderdelen. Je beantwoordt vragen over verkeersregels, inzicht en gevaarherkenning.
        </p>
        <h2>Uitslag</h2>
        <p>
          Na afloop zie je direct of je geslaagd of gezakt bent. Bij onvoldoende krijg je inzicht in welke onderdelen verbetering nodig hebben.
        </p>
      </>
    </InfoPageLayout>
  )
}
