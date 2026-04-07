import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminBilanNotification(data: {
  name: string;
  email: string;
  submittedAt: Date;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY or ADMIN_EMAIL not set, skipping email");
    return;
  }

  await resend.emails.send({
    from: "So Ma <noreply@so-ma.fr>",
    to: adminEmail,
    subject: `Nouveau bilan soumis — ${data.name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
        <h2 style="color: #1d1d1f; margin-bottom: 16px;">Nouveau bilan reçu</h2>
        <p style="color: #666; line-height: 1.6;">
          <strong>${data.name}</strong> (${data.email}) a rempli son formulaire de prise d'information.
        </p>
        <p style="color: #666; line-height: 1.6;">
          Soumis le ${data.submittedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}.
        </p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXTAUTH_URL}/admin/formulaires" style="background: #8B7355; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; display: inline-block;">
            Voir le bilan
          </a>
        </p>
      </div>
    `,
  });
}

export async function sendClientProfileUpdated(data: {
  to: string;
  firstName: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set, skipping email");
    return;
  }

  await resend.emails.send({
    from: "So Ma <noreply@so-ma.fr>",
    to: data.to,
    subject: "Ton profil a été mis à jour !",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
        <h2 style="color: #1d1d1f; margin-bottom: 16px;">Salut ${data.firstName} !</h2>
        <p style="color: #666; line-height: 1.6;">
          Ton profil So Ma vient d'être mis à jour par ta coach. Connecte-toi pour voir les nouveaux objectifs et recommandations.
        </p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXTAUTH_URL}/dashboard" style="background: #8B7355; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; display: inline-block;">
            Voir mon espace
          </a>
        </p>
        <p style="color: #999; font-size: 13px; line-height: 1.5; margin-top: 20px;">
          So-ma.fr &ndash; Elie. Ta conseill&egrave;re en nutrition &amp; bien-&ecirc;tre.
        </p>
      </div>
    `,
  });
}

export async function sendClientCredentials(data: {
  to: string;
  firstName: string;
  email: string;
  password: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set, skipping email");
    return;
  }

  await resend.emails.send({
    from: "So Ma <noreply@so-ma.fr>",
    to: data.to,
    subject: "Tes accès So Ma sont prêts !",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 0;">
        <h2 style="color: #1d1d1f; margin-bottom: 16px;">Bienvenue ${data.firstName} !</h2>
        <p style="color: #666; line-height: 1.6;">
          Ton espace personnel So Ma est prêt. Voici tes identifiants de connexion :
        </p>
        <div style="background: #f5f2ec; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Email</p>
          <p style="margin: 0 0 16px; font-weight: 600; color: #1d1d1f;">${data.email}</p>
          <p style="margin: 0 0 8px; color: #666; font-size: 14px;">Mot de passe temporaire</p>
          <p style="margin: 0; font-weight: 600; color: #1d1d1f; font-size: 18px; letter-spacing: 1px;">${data.password}</p>
        </div>
        <p style="color: #999; font-size: 13px; line-height: 1.5;">
          Change ton mot de passe après ta première connexion.
        </p>
        <p style="margin-top: 24px;">
          <a href="${process.env.NEXTAUTH_URL}/connexion" style="background: #8B7355; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; display: inline-block;">
            Se connecter
          </a>
        </p>
      </div>
    `,
  });
}
