import Link from "next/link"
import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function KlantenserviceEnContactPage() {
  return (
    <InfoPageLayout
      title="Klantenservice en contact"
      intro="We helpen je graag met vragen over je account, betaling of voorbereiding."
      breadcrumbCurrent="Klantenservice en contact"
    >
      <>
        <h2>Snelle hulp</h2>
        <p>
          Heb je een vraag? Kijk eerst bij de veelgestelde vragen of neem direct contact met ons op.
        </p>
        <h2>Contact opnemen</h2>
        <p>
          Gebruik het contactformulier op <Link href="/contact">de contactpagina</Link>. We reageren zo snel mogelijk.
        </p>
      </>
    </InfoPageLayout>
  )
}
