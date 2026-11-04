"use client";

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { EMPTY_BIODATA, type BiodataSection } from "@/lib/types/biodata";
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
  WALI_CONTACT_METHOD_OPTIONS,
  HOW_HEARD_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  INCOME_OPTIONS,
  BANGLADESH_DISTRICT_OPTIONS,
} from "@/lib/constants/biodata-options";
import { CheckCircle2, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
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

/** Mirrors the server validation in /api/biodata/submit. */
function missingFields(d: Draft): string[] {
  const { biodata: b, submitter: s } = d;
  const p = b.personal;
  const f = b.family;
  const missing: string[] = [];
  if (!s.firstName.trim()) missing.push("First name");
  if (!s.lastName.trim()) missing.push("Last name");
  if (!EMAIL_RE.test(s.email.trim())) missing.push("Email");
  if (!s.phone.trim()) missing.push("Phone");
  if (!p.city.trim()) missing.push("City");
  if (!p.country.trim()) missing.push("Country");
  if (!p.ethnicity) missing.push("Ethnicity");
  if (!b.lifestyle.languages.trim()) missing.push("Languages");
  if (!isCompleteDob(p.dateOfBirth)) missing.push("Date of birth");
  if (!p.height) missing.push("Height");
  if (!p.weight) missing.push("Weight");
  if (!p.healthIssues.trim()) missing.push("Health issues");
  if (!p.citizenshipStatus) missing.push("Citizenship status");
  if (!p.maritalStatus) missing.push("Marital status");
  if (p.gender === "Female" && !b.religious.hijab) missing.push("Hijab");
  if (!b.aboutMe.trim()) missing.push("What you do in life");
  if (!(b.lookingFor ?? "").trim()) missing.push("What you are looking for");

  const hasWali = [f.waliName, f.waliEmail, f.waliPhone, f.waliRelationship, f.waliContactMethod].some(
    (v) => v.trim() !== ""
  );
  if (hasWali) {
    if (!f.waliName.trim()) missing.push("Wali's full name");
    if (!f.waliRelationship) missing.push("Wali's relationship");
    if (!f.waliContactMethod) missing.push("How your wali receives matches");
    if (f.waliContactMethod === "Email" && !EMAIL_RE.test(f.waliEmail.trim())) missing.push("Wali's email");
    if ((f.waliContactMethod === "WhatsApp" || f.waliContactMethod === "SMS") && !f.waliPhone.trim()) {
      missing.push("Wali's phone");
    }
  }

  if (!d.faithDeclarationAccepted) missing.push("Declaration of Islamic faith");
  return missing;
}

/* ─── Small local inputs (the shared FieldInput has no type/required) ─── */

const inputClass =
  "mt-1.5 w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] placeholder:text-[var(--color-dark-28)] sm:mt-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]";
const labelClass = "block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]";

function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  help,
  maxLength = 200,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  help?: string;
  maxLength?: number;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <div>
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
        className={inputClass}
      />
      {help && <p className="mt-1 text-[12px] text-[var(--color-dark-56)]">{help}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  const id = useId();
  return (
    <div>
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
        className={cn(inputClass, "resize-y leading-relaxed")}
      />
      <p className="mt-1 text-right text-[11px] text-[var(--color-dark-28)]">{value.length}/3000</p>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-4 sm:rounded-2xl sm:p-6 md:p-8">
      <h2 className="text-[18px] text-[var(--foreground)] sm:text-[22px]">{title}</h2>
      {description && (
        <p className="mt-1 text-[13px] text-[var(--color-dark-56)] sm:text-[14px]">{description}</p>
      )}
      <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6">{children}</div>
    </section>
  );
}

/* ─── Form ─── */

export default function PublicBiodataForm() {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [hydrated, setHydrated] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Honeypot — bots will fill this hidden field
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    setDraft(loadDraft());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveDraft(draft);
  }, [draft, hydrated]);

  const b = draft.biodata;
  const s = draft.submitter;
  const gender = b.personal.gender;
  const isSister = gender === "Female";

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

  function chooseGender(g: "Female" | "Male") {
    setPersonal("gender", g);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  const missing = missingFields(draft);

  async function submit() {
    if (missing.length > 0) {
      setSubmitError(`Please fill in: ${missing.join(", ")}.`);
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
      if (typeof window !== "undefined") window.scrollTo({ top: 0 });
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

  /* Step 1 — sister or brother */
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

      <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
        <Section
          title={Who}
          description={`If you are the wali, you may register on behalf of the ${who} under your guardianship.`}
        >
          <TextField label="First Name *" value={s.firstName} onChange={(v) => setSubmitter("firstName", v)} maxLength={80} autoComplete="given-name" />
          <TextField label="Last Name *" value={s.lastName} onChange={(v) => setSubmitter("lastName", v)} maxLength={80} autoComplete="family-name" />
          <TextField label="Email *" type="email" value={s.email} onChange={(v) => setSubmitter("email", v)} autoComplete="email" />
          <TextField
            label="Phone *"
            type="tel"
            value={s.phone}
            onChange={(v) => setSubmitter("phone", v)}
            help="We may contact you by WhatsApp / SMS also."
            maxLength={40}
            autoComplete="tel"
          />
        </Section>

        <Section title="Profile Information">
          <div className="sm:col-span-2">
            <p className={labelClass}>Where Do You Live? *</p>
            <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
              <TextField label="City *" value={b.personal.city} onChange={(v) => setPersonal("city", v)} placeholder="e.g. Toronto" />
              <TextField label="Province / State" value={b.personal.province} onChange={(v) => setPersonal("province", v)} placeholder="e.g. Ontario" />
              <TextField label="Country *" value={b.personal.country} onChange={(v) => setPersonal("country", v)} placeholder="e.g. Canada" />
            </div>
          </div>
          <FieldSelect label="Ethnicity *" value={b.personal.ethnicity} onChange={(v) => setPersonal("ethnicity", v)} options={ETHNICITY_OPTIONS} />
          <FieldSelect label="Other Ethnicity (If Any)" value={b.personal.otherEthnicity} onChange={(v) => setPersonal("otherEthnicity", v)} options={ETHNICITY_OPTIONS} />
          {showDistrict && (
            <FieldSelect
              label="District of Origin (Bangladesh)"
              value={b.personal.bangladeshDistrict}
              onChange={(v) => setPersonal("bangladeshDistrict", v)}
              options={BANGLADESH_DISTRICT_OPTIONS}
              placeholder="Select your home district..."
            />
          )}
          <TextField label="Which Languages Do You Speak? *" value={b.lifestyle.languages} onChange={(v) => setLifestyle("languages", v)} placeholder="e.g. Bangla, English" />
          <FieldDateSelect label="Date Of Birth *" value={b.personal.dateOfBirth} onChange={(v) => setPersonal("dateOfBirth", v)} />
          <FieldSelect label={`Height (ft'in") *`} value={b.personal.height} onChange={(v) => setPersonal("height", v)} options={PUBLIC_HEIGHT_OPTIONS} />
          <FieldSelect label="Weight (kg) *" value={b.personal.weight} onChange={(v) => setPersonal("weight", v)} options={WEIGHT_KG_OPTIONS} />
          <div className="sm:col-span-2">
            <TextField
              label="Do You Have Any Serious Health Issue(s)? If so, please describe briefly. *"
              value={b.personal.healthIssues}
              onChange={(v) => setPersonal("healthIssues", v)}
              placeholder='Write "None" if not applicable'
              maxLength={500}
            />
          </div>
          <FieldSelect label="What Is Your Citizenship Status? *" value={b.personal.citizenshipStatus} onChange={(v) => setPersonal("citizenshipStatus", v)} options={CITIZENSHIP_STATUS_OPTIONS} />
          <FieldSelect label="What Is Your Marital Status? *" value={b.personal.maritalStatus} onChange={(v) => setPersonal("maritalStatus", v)} options={PUBLIC_MARITAL_STATUS_OPTIONS} />
          {isSister && (
            <div className="sm:col-span-2">
              <ChipSelect label="Do You Wear The Hijab In Your Daily Life? *" value={b.religious.hijab} onChange={(v) => setReligious("hijab", v)} options={HIJAB_OPTIONS} />
            </div>
          )}
        </Section>

        <Section title="Education & Career" description="Your qualifications and professional background">
          <FieldSelect label="Education Level" value={b.education.educationLevel} onChange={(v) => setEducation("educationLevel", v)} options={EDUCATION_LEVEL_OPTIONS} />
          <TextField label="Institution" value={b.education.institution} onChange={(v) => setEducation("institution", v)} placeholder="e.g. University of Toronto" />
          <TextField label="Field of Study" value={b.education.fieldOfStudy} onChange={(v) => setEducation("fieldOfStudy", v)} placeholder="e.g. Computer Science" />
          <TextField label="Occupation" value={b.education.occupation} onChange={(v) => setEducation("occupation", v)} placeholder="e.g. Software Engineer" />
          <TextField label="Employer" value={b.education.employer} onChange={(v) => setEducation("employer", v)} placeholder="Company name (optional)" />
          <FieldSelect label="Annual Income" value={b.education.income} onChange={(v) => setEducation("income", v)} options={INCOME_OPTIONS} />
        </Section>

        <Section title="About You">
          <div className="sm:col-span-2">
            <TextAreaField
              label="What Do You Do In Life? *"
              value={b.aboutMe}
              onChange={(v) => setText("aboutMe", v)}
              help="It is very important to provide as much relevant detail as possible about your religious life, education, work, hobbies, passions, etc. Write complete sentences."
            />
          </div>
          <div className="sm:col-span-2">
            <TextAreaField
              label={`What Are You Looking For In Your Future ${isSister ? "Husband" : "Wife"}? *`}
              value={b.lookingFor ?? ""}
              onChange={(v) => setText("lookingFor", v)}
              help="It is very important to state clearly and fully all your requirements: religious life, ethnic group, age, personality, work, education, etc. Write complete sentences."
            />
          </div>
        </Section>

        <Section title="Profile Pictures" description="Pictures will be requested at a later stage.">
          <FieldSelect
            label="How Did You Hear About Us?"
            value={draft.howHeard}
            onChange={(v) => setDraft((d) => ({ ...d, howHeard: v }))}
            options={HOW_HEARD_OPTIONS}
          />
        </Section>

        <Section
          title={`${Who}'s Wali`}
          description={
            isSister
              ? "If your wali's contact information is available, please provide it, as it will eventually be required to send you your potential matches."
              : "Although optional, we highly recommend you include a wali."
          }
        >
          <TextField label="Full Name" value={b.family.waliName} onChange={(v) => setFamily("waliName", v)} maxLength={120} />
          <TextField label="Email" type="email" value={b.family.waliEmail} onChange={(v) => setFamily("waliEmail", v)} />
          <TextField label="Phone" type="tel" value={b.family.waliPhone} onChange={(v) => setFamily("waliPhone", v)} maxLength={40} />
          <FieldSelect
            label="What Is Your Relationship With Your Wali?"
            value={b.family.waliRelationship}
            onChange={(v) => setFamily("waliRelationship", v)}
            options={PUBLIC_WALI_RELATIONSHIP_OPTIONS}
          />
          <div className="sm:col-span-2">
            <ChipSelect
              label={`How Would Your Wali Like To Receive The Match's Profile Information And Picture?`}
              value={b.family.waliContactMethod}
              onChange={(v) => setFamily("waliContactMethod", v)}
              options={WALI_CONTACT_METHOD_OPTIONS}
            />
            <p className="mt-1.5 text-[12px] text-[var(--color-dark-56)]">
              This option must be provided if you are including a wali.
            </p>
          </div>
        </Section>

        <section className="rounded-xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-4 sm:rounded-2xl sm:p-6 md:p-8">
          <h2 className="text-[18px] text-[var(--foreground)] sm:text-[22px]">Declaration</h2>
          <p className={cn(labelClass, "mt-4")}>Declaration of Islamic Faith *</p>
          <div className="mt-2 max-h-64 overflow-y-auto whitespace-pre-line rounded-lg border border-[var(--color-dark-12)] bg-[var(--background)] p-4 text-[13px] leading-relaxed text-[var(--color-dark-72)] sm:text-[14px]">
            {FAITH_DECLARATION}
          </div>
          <label className="mt-4 flex cursor-pointer items-start gap-3 text-[14px] text-[var(--foreground)]">
            <input
              type="checkbox"
              checked={draft.faithDeclarationAccepted}
              onChange={(e) => setDraft((d) => ({ ...d, faithDeclarationAccepted: e.target.checked }))}
              className="mt-0.5 size-4 shrink-0 accent-[var(--foreground)]"
            />
            <span>I understand and agree to all the above articles of Islamic faith</span>
          </label>

          <div className="mt-8 border-t border-[var(--color-dark-08)] pt-6">
            <p className="text-[13px] text-[var(--color-dark-56)] sm:text-[14px]">
              Once submitted, your biodata will be reviewed by our team before
              we begin looking for a {spouse} for you, In Sha Allah.
            </p>

            {missing.length > 0 && (
              <p className="mt-3 flex items-start gap-1.5 text-[13px] font-medium text-red-600">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>Required before submitting: {missing.join(", ")}.</span>
              </p>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={submitting || missing.length > 0}
              className={cn(
                goldButtonClass,
                "mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-8 text-[14px] font-semibold disabled:opacity-50 sm:w-auto"
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

            {submitError && (
              <p className="mt-3 flex items-start gap-1.5 text-[13px] font-medium text-red-600">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>{submitError}</span>
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="mx-auto max-w-xl py-12 text-center sm:py-20">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 sm:size-20">
        <CheckCircle2 className="size-8 text-green-700 sm:size-10" />
      </div>
      <h2 className="mt-6 text-[22px] text-[var(--foreground)] sm:text-[28px]">
        Biodata submitted successfully
      </h2>
      <p className="mt-3 text-[14px] text-[var(--color-dark-56)] sm:text-[16px]">
        Jazak Allah Khair. Our team will review your biodata and contact you
        (or your wali) when we find a potential match, In Sha Allah.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/"
          className={cn(
            goldButtonClass,
            "inline-flex h-11 items-center justify-center rounded-full px-8 text-[14px] font-semibold"
          )}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
