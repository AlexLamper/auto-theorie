import Link from "next/link"
import InfoPageLayout from "@/components/informatie/InfoPageLayout"

export default function InformatiePage() {
  return (
    <InfoPageLayout
      title="Het auto theorie-examen"
      intro="Informatie over het auto theorie-examen"
      breadcrumbCurrent="Informatie"
      includeParentLink={false}
    >
      <>
        <h2>Voordat je het autorijbewijs kunt behalen</h2>
        <p>
          Voordat je het autorijbewijs kunt behalen, dien je het auto CBR theorie-examen met succes af te leggen. Het auto theorie-examen wordt afgenomen door het CBR en kun je bij een van de CBR locaties afleggen die het CBR theorie-examen afnemen.
        </p>
        <p>
          Het theorie-examen toetst of je de stof voldoende beheerst om te mogen autorijden. Van de kandidaten die deelnemen aan het auto theorie-examen, slaagt minder dan de helft in een keer (36% van de kandidaten slaagt, bron: CBR, 2026).
        </p>

        <h2>Voor het auto theorie-examen</h2>
        <p>
          Allereerst dien je het auto theorie-examen aan te vragen bij het CBR. Tijdens het aanvragen kun je kiezen uit twee soorten theorie-examens: het individuele en het klassikale theorie-examen. Hiervoor brengt het CBR kosten in rekening. Voordat je het auto theorie-examen gaat afleggen bij het CBR is het slim om nog een aantal tips om je theorie-examen te leren en te oefenen door te nemen.
        </p>

        <h3>Tip 1: leer eerst de auto theorie voordat je begint met oefenen voor het theorie-examen.</h3>
        <p>
          Ter voorbereiding op het CBR theorie-examen is het allereerst van belang dat je de theorie goed leert. Als je de stof niet voldoende beheerst, bijvoorbeeld omdat je nog niet geleerd hebt, slaag je waarschijnlijk niet voor het CBR theorie-examen. Kies in dat geval voor een optimale voorbereiding door online te leren: een online theorieboek plus 20 uur examentraining. Dit is de beste voorbereiding op het CBR auto theorie-examen. Met dit pakket kun je gemakkelijk en snel leren, maar ook oefenen. Inclusief: online auto theorieboek, 20 uur online examentraining en gratis extra's, zoals "Rijopleiding In Stappen"-video's en slaaggarantie. Meer informatie over: <Link href="/leren">auto theorie leren</Link>.
        </p>
        <p><strong>Theorie leren voor het auto theorie-examen?</strong></p>

        <h3>Tip 2: na het leren is het een kwestie van goed oefenen!</h3>
        <p>
          Als je de theorie geleerd hebt, is het tijd om theorie-examens te oefenen. Aan de hand van simulaties van het echte CBR theorie-examen kun je testen of je echt klaar bent voor je auto theorie-examen. De auto oefen theorie-examens zijn dus vergelijkbaar met het echte theorie-examen van het CBR. Deze theorie-examens bevatten namelijk dezelfde soort vragen en de examens werken op dezelfde manier als bij het echte CBR auto theorie-examen.
        </p>
        <p>
          Na elk gemaakt examen krijg je de uitslag te zien, waardoor je meteen te weten komt of je geslaagd of gezakt zou zijn voor het echte auto theorie-examen. Daarnaast zie je welke vragen je goed of fout beantwoord hebt. Zo weet je precies wat je nog moet leren of oefenen. Op deze manier oefen je dus snel voor het CBR theorie-examen.
        </p>
        <p><strong>Theorie-examens oefenen voor het auto theorie-examen?</strong></p>

        <h2>Tijdens het auto theorie-examen</h2>
        <p>
          Weet jij wat je moet meenemen naar het theorie-examen? Vergeet niet deze twee documenten mee te nemen naar het CBR, anders mag je het CBR auto theorie-examen niet afleggen op het examencentrum. Wil je weten hoe het auto theorie-examen in zijn werk gaat? Lees dan de pagina <Link href="/informatie/hoe-verloopt-het-examen">hoe verloopt het auto theorie-examen?</Link>.
        </p>

        <h2>Na het auto theorie-examen</h2>
        <p>
          Na afloop van het auto theorie-examen krijg je meteen de uitslag in beeld te zien. Zo weet je of je geslaagd of gezakt bent voor het theorie-examen. Als je gezakt bent voor het auto theorie-examen, krijg je direct na je examen te zien hoeveel vragen je niet, te laat of fout beantwoord hebt. Als je geslaagd bent, wordt de uitslag van het door jou afgelegde auto theorie-examen elektronisch geregistreerd door het CBR.
        </p>
        <p>
          Als je het auto theorie-examen succesvol hebt afgelegd, en dus geslaagd bent voor het auto theorie-examen, behaal je het theoriecertificaat. Dit is een document dat je nodig hebt voordat je praktijkexamen mag doen voor het autorijbewijs.
        </p>

        <h2>Veelgestelde vragen over ons platform</h2>
        <h3>Kan ik gratis starten?</h3>
        <p>Ja, je kunt direct beginnen met een selectie lessen en voorbeeldvragen. Betalen is pas nodig voor volledige toegang.</p>
        <h3>Wanneer moet ik inloggen?</h3>
        <p>Inloggen is pas nodig wanneer je een pakket kiest. Dan maken we automatisch een account aan.</p>
        <h3>Hoe werkt de betaling?</h3>
        <p>Je betaalt eenmalig voor dag, week of maand. Daarna krijg je direct toegang tot alle content.</p>
        <h3>Wordt mijn voortgang opgeslagen?</h3>
        <p>Ja, na betaling bewaren we je voortgang zodat je later verder kunt gaan waar je bleef.</p>
        <h3>Zijn de vragen actueel?</h3>
        <p>Ja, de vragen zijn afgestemd op de nieuwste CBR-richtlijnen en worden regelmatig bijgewerkt.</p>
      </>
    </InfoPageLayout>
  )
}
