# Auto Theorie - Oefenplatform voor het Theorie-examen

<p>
  <img src="https://img.shields.io/github/license/AlexLamper/auto-theorie?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/issues/AlexLamper/auto-theorie?style=for-the-badge&logo=github" alt="Issues" />
  <img src="https://img.shields.io/github/contributors/AlexLamper/auto-theorie?style=for-the-badge&logo=github" alt="Contributors" />
</p>

**Oefen gratis met voorbeeldlessen en stap over naar volledige toegang wanneer je er klaar voor bent.**

![Auto Theorie Screenshot](public/screenshot.png)
<p>
  <a href="https://auto-theorie.com">
    <img src="https://img.shields.io/badge/Ga naar Site-▶️-blue?style=for-the-badge" alt="Ga Naar Site" />
  </a>
</p>

## Over Auto Theorie

*Auto Theorie* is een modern, interactief leerplatform waarmee je je optimaal kunt voorbereiden op je theorie-examen voor de auto, motor of scooter. Met realistische oefenvragen, proefexamens, en een uitgebreide verkeersbordenbibliotheek is dit hét platform voor iedereen die wil slagen — gratis en zonder limieten.

## Inhoudsopgave

- [Functionaliteiten](#functionaliteiten)  
- [Technologieën](#technologieën)  
- [Paginastructuur](#paginastructuur)   
- [Bijdragen](#bijdragen)  
- [Licentie](#licentie)  
- [Versie](#versie)  
- [FAQ](#faq)  
- [Contact](#contact)

## Functionaliteiten

- ![📘](https://img.shields.io/badge/📘-Oefenmodules-lightgrey?style=flat-square) **Oefenmodules** — Realistische vragen per categorie, zoals voorrang, verkeersborden, etc.  
- ![🧪](https://img.shields.io/badge/🧪-Proefexamens-lightgrey?style=flat-square) **Proefexamens** — Ervaar hoe het echte theorie-examen voelt.  
- ![🛑](https://img.shields.io/badge/🛑-Verkeersborden-lightgrey?style=flat-square) **Verkeersborden** — Leer alle Nederlandse verkeersborden met visuele ondersteuning.
- ![📊](https://img.shields.io/badge/📊-Voortgangsmeting-lightgrey?style=flat-square) **Voortgangsmeting** — Houd je prestaties en groei bij.  
- ![📱](https://img.shields.io/badge/📱-Responsief_design-lightgrey?style=flat-square) **Mobile-friendly** — Oefen altijd en overal, op mobiel, tablet of desktop.  
- ![🌐](https://img.shields.io/badge/🌐-Meertalig-lightgrey?style=flat-square) **Meertalige ondersteuning** — Nederlands, Engels en meer in de toekomst.

## Technologieën

<p>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/ShadCN_UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="ShadCN UI" />
  <img src="https://img.shields.io/badge/Framer_Motion-000000?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

## Configuratie (Auth en Stripe)

### Benodigde environment variabelen

Maak een `.env.local` aan in de root met minimaal:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=VUL_HIER_EEN_GEHEIM_IN

GOOGLE_CLIENT_ID=VUL_HIER_JE_CLIENT_ID_IN
GOOGLE_CLIENT_SECRET=VUL_HIER_JE_CLIENT_SECRET_IN

EMAIL_SERVER_HOST=smtp.jouwdomein.nl
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=jij@jouwdomein.nl
EMAIL_SERVER_PASSWORD=JE_SMTP_WACHTWOORD
EMAIL_FROM="Auto Theorie <noreply@jouwdomein.nl>"

STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_AUTO_DAG=price_...
STRIPE_PRICE_AUTO_WEEK=price_...
STRIPE_PRICE_AUTO_MAAND=price_...
```

### Google Cloud Console (OAuth) stappen

1. Ga naar https://console.cloud.google.com/apis/credentials?project=... en kies je project.
2. Maak een OAuth 2.0 Client ID aan (type: Web Application).
3. Voeg Authorized JavaScript origins toe:
  - `http://localhost:3000`
  - `https://auto-theorie.com` (of jouw domein)
4. Voeg Authorized redirect URIs toe:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://auto-theorie.com/api/auth/callback/google`
5. Kopieer de Client ID en Client Secret naar `GOOGLE_CLIENT_ID` en `GOOGLE_CLIENT_SECRET`.

### NextAuth secret genereren

Gebruik bijvoorbeeld:

```
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Plaats de output in `NEXTAUTH_SECRET`.

### Stripe basis instellen

1. Maak in het Stripe dashboard drie producten/prijzen aan:
  - Auto dag (EUR 19,99)
  - Auto week (EUR 29,99)
  - Auto maand (EUR 39,99 met 79,99 als doorgestreepte prijs in de UI)
2. Kopieer de price IDs naar:
  - `STRIPE_PRICE_AUTO_DAG`
  - `STRIPE_PRICE_AUTO_WEEK`
  - `STRIPE_PRICE_AUTO_MAAND`
3. Zet je `STRIPE_SECRET_KEY`.


## Paginastructuur

- **Home** — Introductie tot het platform met duidelijke call-to-actions.
- **Oefenen** — Selecteer categorieën en oefen per onderwerp.
- **Proefexamens** — Neem volledige proefexamens af zoals bij het CBR.
- **Verkeersborden** — Alle verkeersborden overzichtelijk met uitleg.
- **Categorieën** — Oefenmateriaal per voertuigtype (Auto, Motor, Scooter).

## Bijdragen

Bijdragen zijn van harte welkom! Volg deze stappen om bij te dragen:

1. Fork deze repository  
2. Maak een feature branch (`git checkout -b feature/naam`)  
3. Commit je wijzigingen met duidelijke berichten  
4. Dien een Pull Request in

> *Samen bouwen we aan een gratis en toegankelijk theorieplatform voor iedereen!*

## Licentie

Dit project valt onder de [MIT Licentie](LICENSE). Bekijk het LICENSE-bestand voor de volledige tekst.

## Versie

**Huidige versie:** `v1.0`

## FAQ

<details>
<summary>Kan ik gratis starten?</summary>

Ja. Je kunt direct starten met een selectie lessen en voorbeeldvragen. Volledige toegang is beschikbaar via een pakket.

</details>

<details>
<summary>Zijn de vragen gelijk aan het echte CBR-examen?</summary>

De vragen zijn gebaseerd op het officiële CBR-vragentype en zijn samengesteld met dezelfde logica, maar zijn niet exact identiek.

</details>

<details>
<summary>Kan ik mijn voortgang bijhouden?</summary>

Ja, na betaling wordt je voortgang opgeslagen via je account.

</details>

## Contact

Voor vragen, feedback of samenwerking:  


Dank je wel voor het gebruiken van *Auto Theorie* — en veel succes met je theorie-examen! 🎓🚗📚
