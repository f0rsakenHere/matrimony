import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "NikahCanda <onboarding@resend.dev>";
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL ?? "").split(",").map((e) => e.trim()).filter(Boolean);

// ─── Core sender ─────────────────────────────────────────────────────────────

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) {
    console.error("Email send error:", error);
    throw new Error(error.message);
  }
  return data;
}

// ─── Shared layout ────────────────────────────────────────────────────────────

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NikahCanda</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e0e0d8;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1c413a;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#efefe3;font-size:26px;font-weight:700;letter-spacing:0.5px;">NikahCanda</h1>
              <p style="margin:6px 0 0;color:#b8d4c8;font-size:13px;">Connecting Muslim Families with Trust</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f0f0e8;padding:20px 40px;text-align:center;border-top:1px solid #e0e0d8;">
              <p style="margin:0;color:#888;font-size:12px;">© 2025 NikahCanda · All rights reserved</p>
              <p style="margin:4px 0 0;color:#aaa;font-size:11px;">This email was sent because you have an account with NikahCanda.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(text: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background-color:#1c413a;color:#efefe3;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:15px;font-weight:600;margin-top:24px;">${text}</a>`;
}

// ─── Email: Welcome (sent on signup) ─────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#1c413a;font-size:22px;font-weight:700;">Assalamu Alaikum, ${firstName || "there"}!</h2>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">Welcome to <strong>NikahCanda</strong> — we're glad you're here. Our platform is built to help Muslim families find the right match with dignity, trust, and care, In Sha Allah.</p>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">To get the most out of your account, complete your <strong>biodata profile</strong>. A complete profile helps families find you and shows that you're serious about this journey.</p>
    <div style="background-color:#f0f7f4;border-left:4px solid #1c413a;padding:16px 20px;border-radius:4px;margin:24px 0;">
      <p style="margin:0;color:#1c413a;font-size:14px;font-weight:600;">What to complete:</p>
      <ul style="margin:8px 0 0;padding-left:18px;color:#555;font-size:14px;line-height:1.8;">
        <li>Personal details (age, location, etc.)</li>
        <li>Education &amp; occupation</li>
        <li>Family background</li>
        <li>Religious practice</li>
        <li>Lifestyle &amp; about me</li>
      </ul>
    </div>
    ${button("Complete My Biodata", "https://matrimony-drab.vercel.app/dashboard/biodata")}
    <p style="margin:24px 0 0;color:#888;font-size:13px;">May Allah make it easy for you. Ameen.</p>
  `;
  return sendEmail({ to, subject: "Assalamu Alaikum — Welcome to NikahCanda", html: layout(content) });
}

// ─── Email: Biodata reminder (sent after onboarding completes) ────────────────

export async function sendBiodataReminderEmail(to: string, firstName: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#1c413a;font-size:22px;font-weight:700;">Your biodata is waiting, ${firstName || "there"}</h2>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">You've set up your account — great start! The next step is filling in your <strong>biodata</strong> so families can get to know you.</p>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">Profiles with complete biodata receive significantly more attention from families. It only takes a few minutes.</p>
    <div style="background-color:#f0f7f4;border-left:4px solid #1c413a;padding:16px 20px;border-radius:4px;margin:24px 0;">
      <p style="margin:0;color:#555;font-size:14px;line-height:1.8;">Fill in your <strong>personal details</strong>, <strong>family background</strong>, <strong>religious practice</strong>, and a short <strong>about me</strong> — and you'll be ready for families to find you, In Sha Allah.</p>
    </div>
    ${button("Fill My Biodata Now", "https://matrimony-drab.vercel.app/dashboard/biodata")}
    <p style="margin:24px 0 0;color:#888;font-size:13px;">JazakAllahu Khayran for being part of NikahCanda.</p>
  `;
  return sendEmail({ to, subject: "Complete your biodata — families are waiting", html: layout(content) });
}

// ─── Email: Admin — new user signed up ───────────────────────────────────────

export async function sendAdminNewUserEmail(user: {
  email: string;
  firstName?: string;
  lastName?: string;
  provider: string;
  createdAt?: Date;
}) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
  const time = user.createdAt ? new Date(user.createdAt).toUTCString() : new Date().toUTCString();
  const content = `
    <h2 style="margin:0 0 16px;color:#1c413a;font-size:20px;font-weight:700;">New User Signed Up</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${adminRow("Name", name)}
      ${adminRow("Email", user.email)}
      ${adminRow("Provider", user.provider)}
      ${adminRow("Signed up", time)}
    </table>
    ${button("View in Admin Dashboard", "https://matrimony-drab.vercel.app/dashboard/admin")}
  `;
  return sendEmail({ to: ADMIN_EMAILS, subject: `New signup: ${user.email}`, html: layout(content) });
}

// ─── Email: Admin — user completed biodata ───────────────────────────────────

export async function sendAdminBiodataEmail(user: {
  email: string;
  firstName?: string;
  lastName?: string;
  completionPct: number;
}) {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
  const content = `
    <h2 style="margin:0 0 16px;color:#1c413a;font-size:20px;font-weight:700;">Biodata Substantially Completed</h2>
    <p style="margin:0 0 16px;color:#555;font-size:14px;">A user has filled in enough of their biodata to be considered ready for matchmaking review.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${adminRow("Name", name)}
      ${adminRow("Email", user.email)}
      ${adminRow("Completion", `${user.completionPct}%`)}
    </table>
    ${button("Review Profile", "https://matrimony-drab.vercel.app/dashboard/admin")}
  `;
  return sendEmail({ to: ADMIN_EMAILS, subject: `Biodata ready for review: ${user.email}`, html: layout(content) });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function adminRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 12px;background-color:#f8f8f2;border:1px solid #e8e8e0;font-size:13px;color:#888;width:140px;font-weight:600;">${label}</td>
      <td style="padding:10px 12px;background-color:#ffffff;border:1px solid #e8e8e0;font-size:14px;color:#333;">${value}</td>
    </tr>
  `;
}
