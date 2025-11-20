// src/lib/email.ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  text,
  html
}: {
  to: string;
  subject: string;
  text?: string;
  html : string
  
}) {
  const response = await resend.emails.send({
    from: "no-reply@jouonsentrepotes.com", // Doit être un domaine validé sur Resend
    to,
    subject,
    text,
    html
  });

  if (response.error) {
    console.error("❌ Erreur envoi email:", response.error);
  } else {
    console.log("📨 Email envoyé à:", to);
  }
}
