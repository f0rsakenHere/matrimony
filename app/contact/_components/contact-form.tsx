"use client";

import { useState } from "react";
import { CircleCheck, Loader2, Send } from "lucide-react";

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-[var(--color-dark-18)] bg-white px-4 py-3 text-[16px] text-[#2b2b33] outline-none transition-colors placeholder:text-[#9a92a6] focus:border-[#5a1a6b] focus:ring-2 focus:ring-[#5a1a6b]/15";
const labelClass = "text-[14px] font-semibold text-[#5a1a6b]";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body?.error ?? "Sorry, your message could not be sent. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
        <CircleCheck className="mx-auto size-12 text-[#5a1a6b]" strokeWidth={1.5} aria-hidden="true" />
        <p className="mt-4 font-sans text-[22px] font-bold text-[#5a1a6b]">Message sent</p>
        <p className="mt-2 text-[16px] leading-relaxed text-[#2b2b33]">
          Jazak Allah Khair, {form.name.split(" ")[0] || "and thank you"}. We&rsquo;ll reply to{" "}
          <strong>{form.email}</strong> as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Full Name *</span>
          <input required maxLength={120} autoComplete="name" value={form.name} onChange={set("name")} className={fieldClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Email *</span>
          <input required type="email" maxLength={200} autoComplete="email" value={form.email} onChange={set("email")} className={fieldClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Phone (optional)</span>
          <input type="tel" maxLength={40} autoComplete="tel" value={form.phone} onChange={set("phone")} className={fieldClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Subject (optional)</span>
          <input maxLength={150} value={form.subject} onChange={set("subject")} className={fieldClass} />
        </label>
      </div>

      <label className="block">
        <span className={labelClass}>Message *</span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          value={form.message}
          onChange={set("message")}
          className={`${fieldClass} resize-y`}
          placeholder="How can we help?"
        />
      </label>

      {/* Honeypot — hidden from people, filled by bots */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={set("website")}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden="true"
      />

      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[15px] text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#5a1a6b] text-[18px] font-bold shadow-[0_10px_24px_rgb(90_26_107_/_0.3)] transition-[filter] hover:brightness-110 disabled:opacity-70 sm:w-auto sm:min-w-[240px] sm:px-10"
        style={{ color: "#fff" }}
      >
        {status === "sending" ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
