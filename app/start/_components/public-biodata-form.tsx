"use client";

import { useState, useEffect, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { EMPTY_BIODATA, type BiodataSection } from "@/lib/types/biodata";
import { waliErrors } from "@/lib/wali";
import { cn } from "@/lib/utils";
import {
  FieldSelect,
  ChipSelect,
  FieldDateSelect,
} from "@/app/dashboard/biodata/_components/biodata-form-fields";
import {
  ETHNICITY_OPTIONS,
  PUBLIC_HEIGHT_OPTIONS,
  WEIGHT_KG_OPTIONS,
  CITIZENSHIP_STATUS_OPTIONS,
  PUBLIC_MARITAL_STATUS_OPTIONS,
  HIJAB_OPTIONS,
  PUBLIC_WALI_RELATIONSHIP_OPTIONS,
  HOW_HEARD_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  INCOME_OPTIONS,
  BANGLADESH_DISTRICT_OPTIONS,
} from "@/lib/constants/biodata-options";
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { goldButtonClass } from "@/components/ui/button-styles";

// Bumped from v1 when the questionnaire changed — old drafts don't match.
const STORAGE_KEY = "biodata-public-draft-v2";
const LEGACY_STORAGE_KEYS = ["biodata-public-draft-v1", "biodata-public-draft-name-v1"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOB_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

const FAITH_DECLARATION = `I believe in Allah as He is with all His names and attributes and I have accepted all His orders.

I believe in Allah and His Angels, and His Books, and His Messengers, and in the Last Day (Day of Judgment) and in Fate, that good and bad is from Allah and the life after death.

I declare that:
a. There is no deity worthy of worship besides Allah.
b. Muhammad ﷺ is the Messenger and Slave of Allah.
c. Rasulullah ﷺ is the absolute finality of Prophethood, and there has never been nor shall ever be any Prophet after Rasulullah ﷺ.
d. I hold all companions of Rasulullah ﷺ to be righteous, upon Haqq and epitome of Imaan. I believe them to be completely pleased with Allah, and Allah to be pleased with them.
e. I believe the above, and in particular our righteous Khulafaa in order of their superiority, namely Sayiduna Abu Bakr al-Sideeq, Sayiduna Umar al-Farooq, Sayiduna Uthman al-Ghani and Sayiduna Ali ibn Abi Talib [radiAllahu anhum wa Radhu' anh wa ala kulli ashaab al ajma'een]
f. I believe that Qur'an is the final book revealed by Allah through Sayiduna Jibra'eel alayh salam upon Nabi ﷺ, and preserved, understood and practiced in its true form by the Sahaaba, Tabi'een and illustrious heirs of Rasulullah ﷺ after them.`;

interface Submitter {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Draft {
  biodata: BiodataSection;
  submitter: Submitter;
  howHeard: string;
  faithDeclarationAccepted: boolean;
}

const EMPTY_SUBMITTER: Submitter = { firstName: "", lastName: "", email: "", phone: "" };

const EMPTY_DRAFT: Draft = {
  biodata: EMPTY_BIODATA,
  submitter: EMPTY_SUBMITTER,
  howHeard: "",
  faithDeclarationAccepted: false,
};

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function loadDraft(): Draft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    for (const k of LEGACY_STORAGE_KEYS) localStorage.removeItem(k);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DRAFT;
    const parsed = JSON.parse(raw);
    const b = parsed.biodata ?? {};
    const s = parsed.submitter ?? {};
    return {
      biodata: {
        personal: { ...EMPTY_BIODATA.personal, ...b.personal },
        education: { ...EMPTY_BIODATA.education, ...b.education },
        family: { ...EMPTY_BIODATA.family, ...b.family },
        religious: { ...EMPTY_BIODATA.religious, ...b.religious },
        lifestyle: { ...EMPTY_BIODATA.lifestyle, ...b.lifestyle },
        aboutMe: str(b.aboutMe),
        lookingFor: str(b.lookingFor),
      },
      submitter: {
        firstName: str(s.firstName),
        lastName: str(s.lastName),
        email: str(s.email),
        phone: str(s.phone),
      },
      howHeard: str(parsed.howHeard),
      faithDeclarationAccepted: parsed.faithDeclarationAccepted === true,
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

function saveDraft(d: Draft) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
  } catch {
    // Ignore quota errors — user just loses persistence on this device.
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

function isCompleteDob(v: string): boolean {
  const m = DOB_RE.exec(v);
  return !!m && m[1] !== "0000" && m[2] !== "00" && m[3] !== "00";
}

/* ─── Steps & per-step validation (mirrors /api/biodata/submit) ─── */

const ALL_STEPS = [
  { id: "you", label: "Your Details" },
  { id: "profile", label: "Profile" },
  { id: "education", label: "Education" },
  { id: "about", label: "About You" },
  { id: "wali", label: "Wali" },
  { id: "declaration", label: "Submit" },
] as const;

type StepId = (typeof ALL_STEPS)[number]["id"];

/** Brothers don't have a wali step. */
function stepsFor(gender: string) {
  return gender === "Male" ? ALL_STEPS.filter((s) => s.id !== "wali") : [...ALL_STEPS];
}
type Errors = Record<string, string>;

function stepErrors(step: StepId, d: Draft): Errors {
  const { biodata: b, submitter: s } = d;
  const p = b.personal;
  const f = b.family;
  const e: Errors = {};
  const req = (key: string, ok: boolean, msg = "This field is required.") => {
    if (!ok) e[key] = msg;
  };

  switch (step) {
    case "you":
      req("firstName", !!s.firstName.trim());
      req("lastName", !!s.lastName.trim());
      if (!s.email.trim()) e.email = "This field is required.";
      else if (!EMAIL_RE.test(s.email.trim())) e.email = "Please enter a valid email address.";
      req("phone", !!s.phone.trim());
      break;
    case "profile":
      req("city", !!p.city.trim());
      req("country", !!p.country.trim());
      req("ethnicity", !!p.ethnicity, "Please select your ethnicity.");
      req("languages", !!b.lifestyle.languages.trim());
      req("dateOfBirth", isCompleteDob(p.dateOfBirth), "Please select month, day and year.");
      req("height", !!p.height, "Please select your height.");
      req("weight", !!p.weight, "Please select your weight.");
      req("healthIssues", !!p.healthIssues.trim(), 'Please answer (write "None" if not applicable).');
      req("citizenshipStatus", !!p.citizenshipStatus, "Please select your citizenship status.");
      req("maritalStatus", !!p.maritalStatus, "Please select your marital status.");
      if (p.gender === "Female") req("hijab", !!b.religious.hijab, "Please choose an answer.");
      break;
    case "about":
      req("aboutMe", !!b.aboutMe.trim());
      req("lookingFor", !!(b.lookingFor ?? "").trim());
      break;
    case "wali":
      Object.assign(e, waliErrors(p.gender, f));
      break;
    case "declaration":
      req("faith", d.faithDeclarationAccepted, "You must accept the declaration to submit.");
      break;
  }
  return e;
}

/** Index of the first step that still has errors (or the last step). */
function firstIncompleteStep(d: Draft): number {
  const steps = stepsFor(d.biodata.personal.gender);
  const i = steps.findIndex((s) => Object.keys(stepErrors(s.id, d)).length > 0);
  return i === -1 ? steps.length - 1 : i;
}

/* ─── Small local inputs ─── */

const inputBase =
  "mt-1.5 w-full rounded-lg border bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:ring-1 placeholder:text-[var(--color-dark-28)] sm:mt-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]";
const inputOk = "border-[var(--color-dark-14)] focus:border-[var(--foreground)] focus:ring-[var(--foreground)]";
const inputBad = "border-red-400 focus:border-red-500 focus:ring-red-500";
const labelClass = "block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]";

function ErrorText({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-start gap-1 text-[12px] font-medium text-red-600 sm:text-[13px]">
      <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
      <span>{msg}</span>
    </p>
  );
}

/** Wrapper for shared selects/chips: anchors scroll-to-error and shows the message. */
function FieldBox({
  name,
  error,
  className,
  children,
}: {
  name: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      id={`field-${name}`}
      className={cn(
        "scroll-mt-24",
        error && "[&_select]:border-red-400 [&_[role=radiogroup]_button]:border-red-300",
        className
      )}
    >
      {children}
      <ErrorText msg={error} />
    </div>
  );
}

function TextField({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  help,
  maxLength = 200,
  autoComplete,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  help?: string;
  maxLength?: number;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <div id={`field-${name}`} className="scroll-mt-24">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={cn(inputBase, error ? inputBad : inputOk)}
      />
      <ErrorText msg={error} />
      {help && !error && <p className="mt-1 text-[12px] text-[var(--color-dark-56)]">{help}</p>}
    </div>
  );
}

function TextAreaField({
  name,
  label,
  value,
  onChange,
  error,
  help,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  help?: string;
}) {
  const id = useId();
  return (
    <div id={`field-${name}`} className="scroll-mt-24">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {help && <p className="mt-1 text-[12px] text-[var(--color-dark-56)] sm:text-[13px]">{help}</p>}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        maxLength={3000}
        aria-invalid={!!error}
        className={cn(inputBase, error ? inputBad : inputOk, "resize-y leading-relaxed")}
      />
      <div className="flex items-start justify-between gap-3">
        <ErrorText msg={error} />
        <p className="ml-auto mt-1 shrink-0 text-[11px] text-[var(--color-dark-28)]">{value.length}/3000</p>
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">{children}</div>;
}

/* ─── Form ─── */

export default function PublicBiodataForm() {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  // Steps where the user pressed Next/Submit — only these show errors, so a
  // fresh step isn't covered in red before they've typed anything.
  const [attempted, setAttempted] = useState<Set<StepId>>(new Set());

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Honeypot — bots will fill this hidden field
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    const d = loadDraft();
    setDraft(d);
    // Returning visitors resume at their first unfinished step.
    const touched = d.submitter.firstName || d.submitter.email || d.biodata.personal.city;
    setStepIndex(touched ? firstIncompleteStep(d) : 0);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDraft(draft);
  }, [draft, hydrated]);

  const b = draft.biodata;
  const s = draft.submitter;
  const gender = b.personal.gender;
  const isSister = gender === "Female";
  const STEPS = stepsFor(gender);
  const step = STEPS[Math.min(stepIndex, STEPS.length - 1)];
  const liveErrors = stepErrors(step.id, draft);
  const errors: Errors = attempted.has(step.id) ? liveErrors : {};
  // Users may jump back to any step, or forward up to the first incomplete one.
  const maxReachable = firstIncompleteStep(draft);

  function setPersonal(key: keyof BiodataSection["personal"], val: string) {
    setDraft((d) => ({ ...d, biodata: { ...d.biodata, personal: { ...d.biodata.personal, [key]: val } } }));
  }
  function setEducation(key: keyof BiodataSection["education"], val: string) {
    setDraft((d) => ({ ...d, biodata: { ...d.biodata, education: { ...d.biodata.education, [key]: val } } }));
  }
  function setFamily(key: keyof BiodataSection["family"], val: string) {
    setDraft((d) => ({ ...d, biodata: { ...d.biodata, family: { ...d.biodata.family, [key]: val } } }));
  }
  function setReligious(key: keyof BiodataSection["religious"], val: string) {
    setDraft((d) => ({ ...d, biodata: { ...d.biodata, religious: { ...d.biodata.religious, [key]: val } } }));
  }
  function setLifestyle(key: keyof BiodataSection["lifestyle"], val: string) {
    setDraft((d) => ({ ...d, biodata: { ...d.biodata, lifestyle: { ...d.biodata.lifestyle, [key]: val } } }));
  }
  function setText(key: "aboutMe" | "lookingFor", val: string) {
    setDraft((d) => ({ ...d, biodata: { ...d.biodata, [key]: val } }));
  }
  function setSubmitter(key: keyof Submitter, val: string) {
    setDraft((d) => ({ ...d, submitter: { ...d.submitter, [key]: val } }));
  }

  function scrollTop() {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function focusFirstError(errs: Errors) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    // Wait a frame so the error styles render before scrolling.
    requestAnimationFrame(() => {
      const el = document.getElementById(`field-${first}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector<HTMLElement>("input, select, textarea, button")?.focus({ preventScroll: true });
    });
  }

  /** Mark the current step attempted; returns true if it has no errors. */
  function validateCurrent(): boolean {
    setAttempted((a) => new Set(a).add(step.id));
    if (Object.keys(liveErrors).length > 0) {
      focusFirstError(liveErrors);
      return false;
    }
    return true;
  }

  function goNext() {
    if (!validateCurrent()) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    scrollTop();
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
    scrollTop();
  }

  function goTo(i: number) {
    if (i === stepIndex) return;
    if (i > stepIndex && !validateCurrent()) return;
    if (i > maxReachable) return;
    setStepIndex(i);
    scrollTop();
  }

  function chooseGender(g: "Female" | "Male") {
    setPersonal("gender", g);
    setStepIndex(0);
    scrollTop();
  }

  async function submit() {
    if (!validateCurrent()) return;
    // Safety net: if an earlier step became invalid, send the user there.
    const bad = firstIncompleteStep(draft);
    if (bad < STEPS.length - 1) {
      const badStep = STEPS[bad];
      setAttempted((a) => new Set(a).add(badStep.id));
      setStepIndex(bad);
      focusFirstError(stepErrors(badStep.id, draft));
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/biodata/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biodata: draft.biodata,
          submitterFirstName: s.firstName,
          submitterLastName: s.lastName,
          email: s.email,
          phone: s.phone,
          howHeard: draft.howHeard,
          faithDeclarationAccepted: draft.faithDeclarationAccepted,
          website: honeypot, // honeypot — empty for humans
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(body?.error ?? "Submission failed. Please try again.");
        return;
      }
      clearDraft();
      setSubmitted(true);
      scrollTop();
    } catch (err) {
      console.error("Submit failed:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) return <SuccessScreen />;

  if (!hydrated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  /* Step 0 — sister or brother */
  if (gender !== "Female" && gender !== "Male") {
    return (
      <div>
        <header className="text-center">
          <h1 className="text-[24px] text-[var(--foreground)] sm:text-[var(--font-size-h1-mobile)]">
            Submit your biodata
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-[14px] text-[var(--color-dark-56)] sm:text-[16px]">
            Your progress is saved automatically on this device, so you can
            close this page and pick up where you left off.
          </p>
        </header>
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6">
          {(
            [
              { g: "Female", title: "Are you a sister, looking for a husband?" },
              { g: "Male", title: "Are you a brother, looking for a wife?" },
            ] as const
          ).map(({ g, title }) => (
            <button
              key={g}
              type="button"
              onClick={() => chooseGender(g)}
              className="group rounded-2xl border border-[var(--color-dark-14)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-6 text-left transition-all hover:border-[var(--foreground)] hover:shadow-md sm:p-8"
            >
              <span className="block text-[18px] leading-snug text-[var(--foreground)] sm:text-[22px]">
                {title}
              </span>
              <span className="mt-4 inline-block text-[13px] font-semibold text-[var(--color-dark-56)] group-hover:text-[var(--foreground)]">
                Start registration →
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const who = isSister ? "sister" : "brother";
  const Who = isSister ? "Sister" : "Brother";
  const spouse = isSister ? "husband" : "wife";
  const showDistrict = b.personal.ethnicity === "Bangladesh" || b.personal.otherEthnicity === "Bangladesh";
  const isLast = stepIndex === STEPS.length - 1;
  const errorCount = Object.keys(errors).length;

  const stepTitle: Record<StepId, { title: string; description?: string }> = {
    you: {
      title: `${Who}'s Details`,
      description: isSister
        ? `If you are the wali, you may register on behalf of the ${who} under your guardianship.`
        : undefined,
    },
    profile: { title: "Profile Information" },
    education: { title: "Education & Career", description: "Optional — your qualifications and professional background." },
    about: { title: "About You", description: "Pictures will be requested at a later stage." },
    wali: {
      title: `${Who}'s Wali`,
      description: "A wali is required for sisters. Please provide your wali's details. Potential matches will be sent to your wali by email.",
    },
    declaration: { title: "Declaration" },
  };

  return (
    <div>
      <header className="text-center sm:text-left">
        <button
          type="button"
          onClick={() => setPersonal("gender", "")}
          className="mb-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--color-dark-56)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-3.5" />
          {isSister ? "Registering as a sister" : "Registering as a brother"} · Change
        </button>
        <h1 className="text-[24px] text-[var(--foreground)] sm:text-[var(--font-size-h1-mobile)]">
          {isSister ? "Registration for sisters" : "Registration for brothers"}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-[14px] text-[var(--color-dark-56)] sm:mx-0 sm:text-[16px]">
          Fields marked * are required. Your progress is saved automatically on
          this device.
        </p>
      </header>

      {/* Honeypot — hidden from humans, visible to dumb bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
        <label>
          Website (leave blank)
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {/* Progress */}
      <nav aria-label="Registration steps" className="mt-6 sm:mt-8">
        <p className="text-[13px] font-semibold text-[var(--foreground)] sm:text-[14px]">
          Step {stepIndex + 1} of {STEPS.length}
          <span className="font-normal text-[var(--color-dark-56)]"> · {step.label}</span>
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-dark-08)]">
          <div
            className="h-full rounded-full bg-[var(--foreground)] transition-[width] duration-300"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <ol className="mt-3 hidden grid-cols-6 gap-2 sm:grid">
          {STEPS.map((st, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            const reachable = i <= maxReachable || i < stepIndex;
            return (
              <li key={st.id}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  disabled={!reachable && !current}
                  aria-current={current ? "step" : undefined}
                  className={cn(
                    "flex w-full items-center gap-1.5 rounded-lg px-1 py-1 text-left text-[12px] font-semibold transition-colors disabled:cursor-not-allowed",
                    current
                      ? "text-[var(--foreground)]"
                      : reachable
                        ? "text-[var(--color-dark-56)] hover:text-[var(--foreground)]"
                        : "text-[var(--color-dark-28)]"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px]",
                      current || done
                        ? "bg-[var(--foreground)] text-[var(--background)]"
                        : "border border-[var(--color-dark-18)]"
                    )}
                    style={current || done ? { color: "var(--background)" } : undefined}
                  >
                    {done ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span className="truncate">{st.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section className="mt-5 rounded-xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-4 sm:mt-6 sm:rounded-2xl sm:p-6 md:p-8">
        <h2 className="text-[18px] text-[var(--foreground)] sm:text-[22px]">{stepTitle[step.id].title}</h2>
        {stepTitle[step.id].description && (
          <p className="mt-1 text-[13px] text-[var(--color-dark-56)] sm:text-[14px]">
            {stepTitle[step.id].description}
          </p>
        )}

        {errorCount > 0 && (
          <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] font-medium text-red-700">
            Please complete the {errorCount === 1 ? "highlighted field" : `${errorCount} highlighted fields`} to continue.
          </div>
        )}

        <div className="mt-5 sm:mt-6">
          {step.id === "you" && (
            <Grid>
              <TextField name="firstName" label="First Name *" value={s.firstName} onChange={(v) => setSubmitter("firstName", v)} error={errors.firstName} maxLength={80} autoComplete="given-name" />
              <TextField name="lastName" label="Last Name *" value={s.lastName} onChange={(v) => setSubmitter("lastName", v)} error={errors.lastName} maxLength={80} autoComplete="family-name" />
              <TextField name="email" label="Email *" type="email" value={s.email} onChange={(v) => setSubmitter("email", v)} error={errors.email} autoComplete="email" />
              <TextField
                name="phone"
                label="Phone *"
                type="tel"
                value={s.phone}
                onChange={(v) => setSubmitter("phone", v)}
                error={errors.phone}
                help="We may contact you by WhatsApp / SMS also."
                maxLength={40}
                autoComplete="tel"
              />
            </Grid>
          )}

          {step.id === "profile" && (
            <Grid>
              <div className="md:col-span-2">
                <p className="mb-3 text-[13px] font-semibold text-[var(--foreground)] sm:text-[14px]">
                  Where Do You Live? *
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <TextField name="city" label="City *" value={b.personal.city} onChange={(v) => setPersonal("city", v)} error={errors.city} placeholder="e.g. Toronto" />
                  <TextField name="province" label="Province / State" value={b.personal.province} onChange={(v) => setPersonal("province", v)} placeholder="e.g. Ontario" />
                  <TextField name="country" label="Country *" value={b.personal.country} onChange={(v) => setPersonal("country", v)} error={errors.country} placeholder="e.g. Canada" />
                </div>
              </div>
              <FieldBox name="ethnicity" error={errors.ethnicity}>
                <FieldSelect label="Ethnicity *" value={b.personal.ethnicity} onChange={(v) => setPersonal("ethnicity", v)} options={ETHNICITY_OPTIONS} />
              </FieldBox>
              <FieldBox name="otherEthnicity">
                <FieldSelect label="Other Ethnicity (If Any)" value={b.personal.otherEthnicity} onChange={(v) => setPersonal("otherEthnicity", v)} options={ETHNICITY_OPTIONS} />
              </FieldBox>
              {showDistrict && (
                <FieldBox name="bangladeshDistrict">
                  <FieldSelect
                    label="District of Origin (Bangladesh)"
                    value={b.personal.bangladeshDistrict}
                    onChange={(v) => setPersonal("bangladeshDistrict", v)}
                    options={BANGLADESH_DISTRICT_OPTIONS}
                    placeholder="Select your home district..."
                  />
                </FieldBox>
              )}
              <TextField name="languages" label="Which Languages Do You Speak? *" value={b.lifestyle.languages} onChange={(v) => setLifestyle("languages", v)} error={errors.languages} placeholder="e.g. Bangla, English" />
              <FieldBox name="dateOfBirth" error={errors.dateOfBirth}>
                <FieldDateSelect label="Date Of Birth *" value={b.personal.dateOfBirth} onChange={(v) => setPersonal("dateOfBirth", v)} />
              </FieldBox>
              <FieldBox name="height" error={errors.height}>
                <FieldSelect label={`Height (ft'in") *`} value={b.personal.height} onChange={(v) => setPersonal("height", v)} options={PUBLIC_HEIGHT_OPTIONS} />
              </FieldBox>
              <FieldBox name="weight" error={errors.weight}>
                <FieldSelect label="Weight (kg) *" value={b.personal.weight} onChange={(v) => setPersonal("weight", v)} options={WEIGHT_KG_OPTIONS} />
              </FieldBox>
              <div className="md:col-span-2">
                <TextField
                  name="healthIssues"
                  label="Do You Have Any Serious Health Issue(s)? If so, please describe briefly. *"
                  value={b.personal.healthIssues}
                  onChange={(v) => setPersonal("healthIssues", v)}
                  error={errors.healthIssues}
                  placeholder='Write "None" if not applicable'
                  maxLength={500}
                />
              </div>
              <FieldBox name="citizenshipStatus" error={errors.citizenshipStatus}>
                <FieldSelect label="What Is Your Citizenship Status? *" value={b.personal.citizenshipStatus} onChange={(v) => setPersonal("citizenshipStatus", v)} options={CITIZENSHIP_STATUS_OPTIONS} />
              </FieldBox>
              <FieldBox name="maritalStatus" error={errors.maritalStatus}>
                <FieldSelect label="What Is Your Marital Status? *" value={b.personal.maritalStatus} onChange={(v) => setPersonal("maritalStatus", v)} options={PUBLIC_MARITAL_STATUS_OPTIONS} />
              </FieldBox>
              {isSister && (
                <FieldBox name="hijab" error={errors.hijab} className="md:col-span-2">
                  <ChipSelect label="Do You Wear The Hijab In Your Daily Life? *" value={b.religious.hijab} onChange={(v) => setReligious("hijab", v)} options={HIJAB_OPTIONS} />
                </FieldBox>
              )}
            </Grid>
          )}

          {step.id === "education" && (
            <Grid>
              <FieldBox name="educationLevel">
                <FieldSelect label="Education Level" value={b.education.educationLevel} onChange={(v) => setEducation("educationLevel", v)} options={EDUCATION_LEVEL_OPTIONS} />
              </FieldBox>
              <TextField name="institution" label="Institution" value={b.education.institution} onChange={(v) => setEducation("institution", v)} placeholder="e.g. University of Toronto" />
              <TextField name="fieldOfStudy" label="Field of Study" value={b.education.fieldOfStudy} onChange={(v) => setEducation("fieldOfStudy", v)} placeholder="e.g. Computer Science" />
              <TextField name="occupation" label="Occupation" value={b.education.occupation} onChange={(v) => setEducation("occupation", v)} placeholder="e.g. Software Engineer" />
              <TextField name="employer" label="Employer" value={b.education.employer} onChange={(v) => setEducation("employer", v)} placeholder="Company name (optional)" />
              <FieldBox name="income">
                <FieldSelect label="Annual Income" value={b.education.income} onChange={(v) => setEducation("income", v)} options={INCOME_OPTIONS} />
              </FieldBox>
            </Grid>
          )}

          {step.id === "about" && (
            <div className="space-y-5 sm:space-y-6">
              <TextAreaField
                name="aboutMe"
                label="What Do You Do In Life? *"
                value={b.aboutMe}
                onChange={(v) => setText("aboutMe", v)}
                error={errors.aboutMe}
                help="It is very important to provide as much relevant detail as possible about your religious life, education, work, hobbies, passions, etc. Write complete sentences."
              />
              <TextAreaField
                name="lookingFor"
                label={`What Are You Looking For In Your Future ${isSister ? "Husband" : "Wife"}? *`}
                value={b.lookingFor ?? ""}
                onChange={(v) => setText("lookingFor", v)}
                error={errors.lookingFor}
                help="It is very important to state clearly and fully all your requirements: religious life, ethnic group, age, personality, work, education, etc. Write complete sentences."
              />
              <div className="md:max-w-[50%] md:pr-3">
                <FieldBox name="howHeard">
                  <FieldSelect
                    label="How Did You Hear About Us?"
                    value={draft.howHeard}
                    onChange={(v) => setDraft((d) => ({ ...d, howHeard: v }))}
                    options={HOW_HEARD_OPTIONS}
                  />
                </FieldBox>
              </div>
            </div>
          )}

          {step.id === "wali" && (
            <Grid>
              <TextField name="waliName" label={isSister ? "Full Name *" : "Full Name"} value={b.family.waliName} onChange={(v) => setFamily("waliName", v)} error={errors.waliName} maxLength={120} />
              <TextField name="waliEmail" label={isSister ? "Email * (matches are sent here)" : "Email (matches are sent here)"} type="email" value={b.family.waliEmail} onChange={(v) => setFamily("waliEmail", v)} error={errors.waliEmail} />
              <TextField name="waliPhone" label="Phone (optional)" type="tel" value={b.family.waliPhone} onChange={(v) => setFamily("waliPhone", v)} error={errors.waliPhone} maxLength={40} />
              <FieldBox name="waliRelationship" error={errors.waliRelationship}>
                <FieldSelect
                  label={isSister ? "What Is Your Relationship With Your Wali? *" : "What Is Your Relationship With Your Wali?"}
                  value={b.family.waliRelationship}
                  onChange={(v) => setFamily("waliRelationship", v)}
                  options={PUBLIC_WALI_RELATIONSHIP_OPTIONS}
                />
              </FieldBox>
              <p className="text-[13px] text-[var(--color-dark-56)] md:col-span-2">
                {isSister
                  ? "Your wali will receive an email letting them know they have been named, and potential matches will be sent to them by email only."
                  : "If you include a wali, they will receive an email letting them know, and potential matches will be sent to them by email only."}
              </p>
            </Grid>
          )}

          {step.id === "declaration" && (
            <div id="field-faith" className="scroll-mt-24">
              <p className={labelClass}>Declaration of Islamic Faith *</p>
              <div className="mt-2 max-h-64 overflow-y-auto whitespace-pre-line rounded-lg border border-[var(--color-dark-12)] bg-[var(--background)] p-4 text-[13px] leading-relaxed text-[var(--color-dark-72)] sm:text-[14px]">
                {FAITH_DECLARATION}
              </div>
              <label
                className={cn(
                  "mt-4 flex cursor-pointer items-start gap-3 rounded-lg p-2 text-[14px] text-[var(--foreground)]",
                  errors.faith && "bg-red-50 ring-1 ring-red-300"
                )}
              >
                <input
                  type="checkbox"
                  checked={draft.faithDeclarationAccepted}
                  onChange={(e) => setDraft((d) => ({ ...d, faithDeclarationAccepted: e.target.checked }))}
                  className="mt-0.5 size-4 shrink-0 accent-[var(--foreground)]"
                />
                <span>I understand and agree to all the above articles of Islamic faith</span>
              </label>
              <ErrorText msg={errors.faith} />
              <p className="mt-6 text-[13px] text-[var(--color-dark-56)] sm:text-[14px]">
                Once submitted, your biodata will be reviewed by our team before
                we begin looking for a {spouse} for you, In Sha Allah.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[var(--color-dark-08)] pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-[var(--color-dark-18)] px-6 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)]"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}

          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className={cn(
                goldButtonClass,
                "inline-flex h-11 items-center justify-center gap-2 rounded-full px-8 text-[14px] font-semibold disabled:opacity-50"
              )}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Submit Biodata
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className={cn(
                goldButtonClass,
                "inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-8 text-[14px] font-semibold"
              )}
            >
              Next: {STEPS[stepIndex + 1].label}
              <ArrowRight className="size-4" />
            </button>
          )}
        </div>

        {submitError && (
          <p role="alert" className="mt-3 flex items-start gap-1.5 text-[13px] font-medium text-red-600">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>{submitError}</span>
          </p>
        )}
      </section>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1d1a20]">
      <Image src="/flowers.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative flex min-h-full items-center px-6 py-16 sm:px-10">
        <div
          role="status"
          className="mx-auto max-w-[620px] space-y-6 [&>p]:text-[19px] [&>p]:leading-[1.75] sm:[&>p]:text-[22px]"
          style={{ color: "#fff" }}
        >
          <p>
            Thank you for registering with BanglaNikahCanada! We are very pleased to have you registered
            to our Matrimonial Service.
          </p>
          <p>
            We will now begin finding matches for you. Please note that you may only be contacted once a
            possible match has been found.
          </p>
          <p>We appreciate your patience and understanding.</p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/50 px-7 text-[15px] font-semibold transition-colors hover:bg-white/10"
              style={{ color: "#fff" }}
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
