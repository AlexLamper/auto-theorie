import nodemailer from "nodemailer"

export async function sendAccessCodeEmail(email: string, name: string, code: string) {
  console.log(`📧 Voorbereiden e-mail voor: ${email}`)

  if (!process.env.EMAIL_SERVER_PASSWORD) {
    console.error("❌ EMAIL_SERVER_PASSWORD is niet ingesteld in .env!")
    // In dev mode, we log the code so the user can still test
    console.log(`🛠️ TEST MODE CODE: ${code}`)
  }
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.hostinger.com",
    port: Number(process.env.EMAIL_SERVER_PORT || 465),
    secure: true, 
    auth: {
      user: process.env.EMAIL_SERVER_USER || "info@auto-theorie.com",
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      // Hostinger vereist vaak specifieke TLS instellingen
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    },
    debug: true, 
    logger: true 
  })

  const mailOptions = {
    from: `"Auto Theorie" <${process.env.EMAIL_FROM || "info@auto-theorie.com"}>`,
    to: email,
    subject: "Je toegangscode voor Auto Theorie",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h1 style="color: #1e40af; text-align: center;">Welkom bij Auto Theorie!</h1>
        <p style="font-size: 16px; color: #334155;">Beste ${name},</p>
        <p style="font-size: 16px; color: #334155;">Bedankt voor je aankoop. Je kunt nu direct aan de slag met het oefenen voor je theorie-examen.</p>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; text-align: center; margin: 25px 0; border: 1px dashed #cbd5e1;">
          <p style="margin-bottom: 10px; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; font-weight: bold;">Jouw Persoonlijke Toegangscode</p>
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: bold; color: #2563eb; letter-spacing: 0.3em;">${code}</span>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://auto-theorie.com"}/inloggen" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px;">
             Direct Inloggen & Starten
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #475569; background-color: #eff6ff; padding: 15px; border-radius: 8px;">
          <strong>Let op:</strong> Bewaar deze code goed. Je hebt deze elke keer nodig om in te loggen op je account.
        </p>

        <p style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
          Heb je vragen? Beantwoord deze mail of neem contact op via info@auto-theorie.com.
        </p>
      </div>
    `,
  }

  try {
    console.log(`🚀 Email verzenden naar ${email}...`)
    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email succesvol verzonden: ${info.messageId}`)
    return info
  } catch (error) {
    console.error(`❌ FOUT bij verzenden e-mail naar ${email}:`, error)
    // Log ook de code zodat de eigenaar deze handmatig kan versturen indien nodig tot het gefixed is
    console.log(`🔑 De code die verzonden had moeten worden was: ${code}`)
    return null
  }
}
