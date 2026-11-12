import { Resend } from "resend";
import { renderSubmissionPdf, submissionSections, type SubmissionForPdf } from "@/lib/submission-pdf";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM ?? "BanglaNikahCanada <onboarding@resend.dev>";
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL ?? "").split(",").map((e) => e.trim()).filter(Boolean);
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.banglanikahcanada.com").replace(/\/$/, "");

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// ─── Core sender ─────────────────────────────────────────────────────────────

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  attachments,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html, replyTo, attachments });
  if (error) {
    console.error("Email send error:", error);
    throw new Error(error.message);
  }
  return data;
}

// ─── Shared layout ────────────────────────────────────────────────────────────

function layout(
  content: string,
  footerNote = "This email was sent because you have an account with BanglaNikahCanada."
) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BanglaNikahCanada</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f6f0;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f6f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e0e0d8;">
          <!-- Header -->
          <tr>
            <td style="background-color:#1b5e3b;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:0.5px;">BanglaNikahCanada</h1>
              <p style="margin:6px 0 0;color:#f0cf86;font-size:13px;font-style:italic;">A Halal Matrimony Service</p>
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
              <p style="margin:0;color:#888;font-size:12px;">© ${new Date().getFullYear()} BanglaNikahCanada · All rights reserved</p>
              <p style="margin:4px 0 0;color:#aaa;font-size:11px;">${footerNote}</p>
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
  return `<a href="${href}" style="display:inline-block;background-color:#1b5e3b;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:15px;font-weight:600;margin-top:24px;">${text}</a>`;
}

// ─── Email: Welcome (sent on signup) ─────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#1b5e3b;font-size:22px;font-weight:700;">Assalamu Alaikum, ${esc(firstName || "there")}!</h2>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">Welcome to <strong>BanglaNikahCanada</strong> — we're glad you're here. Our platform is built to help Muslim families find the right match with dignity, trust, and care, In Sha Allah.</p>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">To get the most out of your account, complete your <strong>biodata profile</strong>. A complete profile helps families find you and shows that you're serious about this journey.</p>
    <div style="background-color:#f7f1e3;border-left:4px solid #1b5e3b;padding:16px 20px;border-radius:4px;margin:24px 0;">
      <p style="margin:0;color:#1b5e3b;font-size:14px;font-weight:600;">What to complete:</p>
      <ul style="margin:8px 0 0;padding-left:18px;color:#555;font-size:14px;line-height:1.8;">
        <li>Personal details (age, location, etc.)</li>
        <li>Education &amp; occupation</li>
        <li>Family background</li>
        <li>Religious practice</li>
        <li>Lifestyle &amp; about me</li>
      </ul>
    </div>
    ${button("Complete My Biodata", `${APP_URL}/dashboard/biodata`)}
    <p style="margin:24px 0 0;color:#888;font-size:13px;">May Allah make it easy for you. Ameen.</p>
  `;
  return sendEmail({ to, subject: "Assalamu Alaikum — Welcome to BanglaNikahCanada", html: layout(content) });
}

// ─── Email: Biodata reminder (sent after onboarding completes) ────────────────

export async function sendBiodataReminderEmail(to: string, firstName: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#1b5e3b;font-size:22px;font-weight:700;">Your biodata is waiting, ${esc(firstName || "there")}</h2>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">You've set up your account — great start! The next step is filling in your <strong>biodata</strong> so families can get to know you.</p>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">Profiles with complete biodata receive significantly more attention from families. It only takes a few minutes.</p>
    <div style="background-color:#f7f1e3;border-left:4px solid #1b5e3b;padding:16px 20px;border-radius:4px;margin:24px 0;">
      <p style="margin:0;color:#555;font-size:14px;line-height:1.8;">Fill in your <strong>personal details</strong>, <strong>family background</strong>, <strong>religious practice</strong>, and a short <strong>about me</strong> — and you'll be ready for families to find you, In Sha Allah.</p>
    </div>
    ${button("Fill My Biodata Now", `${APP_URL}/dashboard/biodata`)}
    <p style="margin:24px 0 0;color:#888;font-size:13px;">JazakAllahu Khayran for being part of BanglaNikahCanada.</p>
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
    <h2 style="margin:0 0 16px;color:#1b5e3b;font-size:20px;font-weight:700;">New User Signed Up</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${adminRow("Name", name)}
      ${adminRow("Email", user.email)}
      ${adminRow("Provider", user.provider)}
      ${adminRow("Signed up", time)}
    </table>
    ${button("View in Admin Dashboard", `${APP_URL}/dashboard/admin`)}
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
    <h2 style="margin:0 0 16px;color:#1b5e3b;font-size:20px;font-weight:700;">Biodata Substantially Completed</h2>
    <p style="margin:0 0 16px;color:#555;font-size:14px;">A user has filled in enough of their biodata to be considered ready for matchmaking review.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${adminRow("Name", name)}
      ${adminRow("Email", user.email)}
      ${adminRow("Completion", `${user.completionPct}%`)}
    </table>
    ${button("Review Profile", `${APP_URL}/dashboard/admin`)}
  `;
  return sendEmail({ to: ADMIN_EMAILS, subject: `Biodata ready for review: ${user.email}`, html: layout(content) });
}

// ─── Email: New public biodata submission (with PDF) ─────────────────────────

const SUBMISSION_EMAILS = (process.env.SUBMISSION_EMAIL ?? "Info@banglanikahcanada.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

/** Replies from candidates and walis go to the office, not to noreply@. */
const OFFICE_EMAIL = SUBMISSION_EMAILS[0] ?? "Info@banglanikahcanada.com";

const P = 'style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;"';

// ─── Email: Confirmation to the person who submitted a biodata ───────────────

export async function sendSubmissionReceivedEmail(p: {
  to: string;
  firstName: string;
  /** The wali on file, if any. */
  wali: { name: string; email: string } | null;
}) {
  const sameInbox = !!p.wali && p.wali.email.trim().toLowerCase() === p.to.trim().toLowerCase();
  const waliLine = !p.wali
    ? ""
    : sameInbox
      ? `<p ${P}>This email address is also listed as the wali&rsquo;s, so potential matches will be sent here.</p>`
      : `<p ${P}>Your wali, <strong>${esc(p.wali.name)}</strong>, has been notified by email and will receive potential matches at <strong>${esc(p.wali.email)}</strong>.</p>`;

  const content = `
    <h2 style="margin:0 0 16px;color:#1b5e3b;font-size:22px;font-weight:700;">Assalamu Alaikum, ${esc(p.firstName || "there")}!</h2>
    <p ${P}>Thank you for registering with BanglaNikahCanada! We are very pleased to have you registered to our Matrimonial Service.</p>
    <p ${P}>We will now begin finding matches for you. Please note that you may only be contacted once a possible match has been found.</p>
    ${waliLine}
    <p ${P}>We appreciate your patience and understanding.</p>
    <p style="margin:24px 0 0;color:#888;font-size:13px;">Questions? Simply reply to this email.</p>
  `;
  return sendEmail({
    to: p.to,
    subject: "We've received your biodata — BanglaNikahCanada",
    html: layout(content, "You are receiving this email because you submitted a biodata at banglanikahcanada.com."),
    replyTo: OFFICE_EMAIL,
  });
}

// ─── Email: Tell the wali they have been named ───────────────────────────────

export async function sendWaliNotificationEmail(p: {
  to: string;
  waliName: string;
  relationship: string;
  candidateName: string;
  gender: string;
}) {
  const their = p.gender === "Female" ? "her" : p.gender === "Male" ? "his" : "their";
  const candidate = esc(p.candidateName || "A candidate");
  const content = `
    <h2 style="margin:0 0 16px;color:#1b5e3b;font-size:22px;font-weight:700;">Assalamu Alaikum${p.waliName ? `, ${esc(p.waliName)}` : ""}</h2>
    <p ${P}><strong>${candidate}</strong> has registered with <strong>BanglaNikahCanada</strong>, a halal matrimony service for Bengali Canadian Muslims, and has named you as ${their} wali${p.relationship ? ` (${esc(p.relationship)})` : ""}.</p>
    <p ${P}>In line with Islamic guidance, potential matches for ${candidate} will be sent to you at this email address.</p>
    <p ${P}>There is nothing you need to do right now. We will contact you once a possible match has been found, In Sha Allah.</p>
    <p style="margin:24px 0 0;color:#888;font-size:13px;">If you are not ${their} wali or did not expect this email, please reply and let us know.</p>
  `;
  return sendEmail({
    to: p.to,
    subject: `You have been named as a wali on BanglaNikahCanada`,
    html: layout(content, "You are receiving this email because you were named as a wali on banglanikahcanada.com."),
    replyTo: OFFICE_EMAIL,
  });
}

export async function sendSubmissionEmail(s: SubmissionForPdf) {
  const name = `${s.submitterFirstName} ${s.submitterLastName}`.trim() || "Unnamed";
  const pdf = await renderSubmissionPdf(s);
  const filename = `biodata-${name.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "") || "submission"}-${s.id.slice(0, 8)}.pdf`;

  const sections = submissionSections(s)
    .map((sec) => {
      const body =
        "rows" in sec
          ? `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${sec.rows
              .map(([l, v]) => adminRow(l, v))
              .join("")}</table>`
          : `<p style="margin:0;color:#333;font-size:14px;line-height:1.7;white-space:pre-wrap;">${esc(sec.text)}</p>`;
      return `<h3 style="margin:24px 0 8px;color:#1b5e3b;font-size:15px;">${esc(sec.title)}</h3>${body}`;
    })
    .join("");

  const content = `
    <h2 style="margin:0 0 8px;color:#1b5e3b;font-size:20px;font-weight:700;">New Biodata Submission</h2>
    <p style="margin:0 0 8px;color:#555;font-size:14px;">${esc(name)} submitted a biodata on ${esc(s.createdAt.toUTCString())}. The full biodata is attached as a PDF and copied below.</p>
    ${sections}
    ${button("Review in Admin Dashboard", `${APP_URL}/dashboard/admin`)}
  `;

  return sendEmail({
    to: SUBMISSION_EMAILS,
    subject: `New biodata submission: ${name}`,
    html: layout(content),
    replyTo: s.email || undefined,
    attachments: [{ filename, content: Buffer.from(pdf) }],
  });
}

// ─── Email: Contact form message ─────────────────────────────────────────────

const CONTACT_EMAILS = (process.env.CONTACT_EMAIL ?? process.env.SUBMISSION_EMAIL ?? "Info@banglanikahcanada.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export async function sendContactEmail(msg: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  const content = `
    <h2 style="margin:0 0 16px;color:#1b5e3b;font-size:20px;font-weight:700;">New Contact Message</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${adminRow("Name", msg.name)}
      ${adminRow("Email", msg.email)}
      ${msg.phone ? adminRow("Phone", msg.phone) : ""}
      ${msg.subject ? adminRow("Subject", msg.subject) : ""}
    </table>
    <p style="margin:20px 0 0;color:#333;font-size:15px;line-height:1.7;white-space:pre-wrap;">${esc(msg.message)}</p>
    <p style="margin:24px 0 0;color:#888;font-size:13px;">Reply to this email to answer ${esc(msg.name)} directly.</p>
  `;
  return sendEmail({
    to: CONTACT_EMAILS,
    subject: `Contact form: ${msg.subject || msg.name}`,
    html: layout(content),
    replyTo: msg.email,
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function adminRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 12px;background-color:#f8f8f2;border:1px solid #e8e8e0;font-size:13px;color:#888;width:140px;font-weight:600;">${label}</td>
      <td style="padding:10px 12px;background-color:#ffffff;border:1px solid #e8e8e0;font-size:14px;color:#333;">${esc(value)}</td>
    </tr>
  `;
}

// ─── Email: Password reset ───────────────────────────────────────────────────

export async function sendPasswordResetEmail(to: string, name: string, url: string) {
  const content = `
    <h2 style="margin:0 0 8px;color:#1b5e3b;font-size:22px;font-weight:700;">Reset your password</h2>
    <p style="margin:0 0 16px;color:#444;font-size:15px;line-height:1.7;">Assalamu Alaikum ${esc(name || "")}, we received a request to reset the password for your BanglaNikahCanada account.</p>
    ${button("Choose a New Password", url)}
    <p style="margin:24px 0 0;color:#888;font-size:13px;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
  `;
  return sendEmail({ to, subject: "Reset your BanglaNikahCanada password", html: layout(content) });
}
