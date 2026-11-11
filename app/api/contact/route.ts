import { NextResponse } from "next/server";
import { clientIp } from "@/lib/auth";
import { sendContactEmail } from "@/lib/email";
import { contactLimiter } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(/\0/g, "").trim().slice(0, max);
}

/** Public contact form → email to the office inbox (Reply-To = sender). */
export async function POST(request: Request) {
  try {
    const { success } = contactLimiter.check(clientIp(request));
    if (!success) {
      return NextResponse.json(
        { error: "Too many messages. Please try again in an hour." },
        { status: 429 }
      );
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    // Honeypot: bots fill the hidden field. Pretend success, send nothing.
    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const msg = {
      name: clean(body.name, 120),
      email: clean(body.email, 200).toLowerCase(),
      phone: clean(body.phone, 40),
      subject: clean(body.subject, 150),
      message: clean(body.message, 5000),
    };

    const errors: string[] = [];
    if (!msg.name) errors.push("Please enter your name.");
    if (!EMAIL_RE.test(msg.email)) errors.push("Please enter a valid email address.");
    if (msg.message.length < 10) errors.push("Please write a message (at least 10 characters).");
    if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

    await sendContactEmail(msg);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/contact] error:", error);
    return NextResponse.json(
      { error: "Sorry, your message could not be sent. Please try again later." },
      { status: 500 }
    );
  }
}
