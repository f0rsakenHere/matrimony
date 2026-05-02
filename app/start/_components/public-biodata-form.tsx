"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { EMPTY_BIODATA, type BiodataSection } from "@/lib/types/biodata";
import { cn } from "@/lib/utils";
import {
  TabPersonal,
  TabEducation,
  TabFamily,
  TabReligious,
  TabLifestyle,
  TabAboutMe,
} from "@/app/dashboard/biodata/_components/biodata-form-fields";
import {
  User,
  GraduationCap,
  Users,
  Moon,
  Heart,
  FileText,
  Check,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { goldButtonClass } from "@/components/ui/button-styles";

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "education", label: "Education & Career", icon: GraduationCap },
  { id: "family", label: "Family", icon: Users },
  { id: "religious", label: "Religious", icon: Moon },
  { id: "lifestyle", label: "Lifestyle", icon: Heart },
  { id: "aboutMe", label: "About Me", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STORAGE_KEY = "biodata-public-draft-v1";
const NAME_STORAGE_KEY = "biodata-public-draft-name-v1";

interface SubmitterName {
  firstName: string;
  lastName: string;
}

const EMPTY_NAME: SubmitterName = { firstName: "", lastName: "" };

function loadDraft(): BiodataSection {
  if (typeof window === "undefined") return EMPTY_BIODATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_BIODATA;
    const parsed = JSON.parse(raw);
    return {
      personal: { ...EMPTY_BIODATA.personal, ...parsed.personal },
      education: { ...EMPTY_BIODATA.education, ...parsed.education },
      family: { ...EMPTY_BIODATA.family, ...parsed.family },
      religious: { ...EMPTY_BIODATA.religious, ...parsed.religious },
      lifestyle: { ...EMPTY_BIODATA.lifestyle, ...parsed.lifestyle },
      aboutMe: typeof parsed.aboutMe === "string" ? parsed.aboutMe : "",
    };
  } catch {
    return EMPTY_BIODATA;
  }
}

function loadNameDraft(): SubmitterName {
  if (typeof window === "undefined") return EMPTY_NAME;
  try {
    const raw = localStorage.getItem(NAME_STORAGE_KEY);
    if (!raw) return EMPTY_NAME;
    const parsed = JSON.parse(raw);
    return {
      firstName: typeof parsed.firstName === "string" ? parsed.firstName : "",
      lastName: typeof parsed.lastName === "string" ? parsed.lastName : "",
    };
  } catch {
    return EMPTY_NAME;
  }
}

function saveDraft(b: BiodataSection) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(b));
  } catch {
    // Ignore quota errors — user just loses persistence on this device.
  }
}

function saveNameDraft(n: SubmitterName) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NAME_STORAGE_KEY, JSON.stringify(n));
  } catch {
    // Ignore
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(NAME_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

function hasRequiredForSubmit(
  b: BiodataSection,
  n: SubmitterName
): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!n.firstName.trim()) missing.push("First name");
  if (!n.lastName.trim()) missing.push("Last name");
  if (!b.personal.gender) missing.push("Gender");
  if (!b.personal.dateOfBirth) missing.push("Date of birth");
  if (!b.family.waliName) missing.push("Wali's name");
  if (!b.family.waliRelationship) missing.push("Wali's relationship");
  if (!b.family.waliPhone) missing.push("Wali's phone");
  return { ok: missing.length === 0, missing };
}

export default function PublicBiodataForm() {
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [biodata, setBiodata] = useState<BiodataSection>(EMPTY_BIODATA);
  const biodataRef = useRef<BiodataSection>(EMPTY_BIODATA);
  const [submitterName, setSubmitterName] = useState<SubmitterName>(EMPTY_NAME);
  const submitterNameRef = useRef<SubmitterName>(EMPTY_NAME);
  const [hydrated, setHydrated] = useState(false);

  // Per-section "saved" UI state — fake-async feel, just confirms local persist
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Honeypot — bots will fill this hidden field
  const [honeypot, setHoneypot] = useState("");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const draft = loadDraft();
    setBiodata(draft);
    biodataRef.current = draft;
    const nameDraft = loadNameDraft();
    setSubmitterName(nameDraft);
    submitterNameRef.current = nameDraft;
    setHydrated(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!hydrated) return;
    biodataRef.current = biodata;
    saveDraft(biodata);
  }, [biodata, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    submitterNameRef.current = submitterName;
    saveNameDraft(submitterName);
  }, [submitterName, hydrated]);

  const updatePersonal = useCallback(
    (key: keyof BiodataSection["personal"], val: string) => {
      setBiodata((prev) => ({ ...prev, personal: { ...prev.personal, [key]: val } }));
    },
    []
  );
  const updateEducation = useCallback(
    (key: keyof BiodataSection["education"], val: string) => {
      setBiodata((prev) => ({ ...prev, education: { ...prev.education, [key]: val } }));
    },
    []
  );
  const updateFamily = useCallback(
    (key: keyof BiodataSection["family"], val: string) => {
      setBiodata((prev) => ({ ...prev, family: { ...prev.family, [key]: val } }));
    },
    []
  );
  const updateReligious = useCallback(
    (key: keyof BiodataSection["religious"], val: string) => {
      setBiodata((prev) => ({ ...prev, religious: { ...prev.religious, [key]: val } }));
    },
    []
  );
  const updateLifestyle = useCallback(
    (key: keyof BiodataSection["lifestyle"], val: string) => {
      setBiodata((prev) => ({ ...prev, lifestyle: { ...prev.lifestyle, [key]: val } }));
    },
    []
  );

  function sectionFilled(obj: Record<string, string>): boolean {
    return Object.values(obj).some((v) => v && v.trim() !== "");
  }

  const tabStatus: Record<TabId, boolean> = {
    personal: sectionFilled(biodata.personal),
    education: sectionFilled(biodata.education),
    family: sectionFilled(biodata.family),
    religious: sectionFilled(biodata.religious),
    lifestyle: sectionFilled(biodata.lifestyle),
    aboutMe: biodata.aboutMe.trim().length > 0,
  };

  function saveSection(_section: TabId) {
    // Local-only save — already persisted via useEffect. Just provide a
    // confirming "Saved" UI flash and auto-advance to the next incomplete tab.
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      const tabOrder: TabId[] = ["personal", "education", "family", "religious", "lifestyle", "aboutMe"];
      const currentIdx = tabOrder.indexOf(_section);
      const isFilled = (obj: Record<string, string>) =>
        Object.values(obj).some((v) => v && v.trim() !== "");
      const nextIncomplete = tabOrder.find((tab, i) => {
        if (i <= currentIdx) return false;
        if (tab === "aboutMe") return biodataRef.current.aboutMe.trim().length === 0;
        return !isFilled(biodataRef.current[tab] as unknown as Record<string, string>);
      });
      if (nextIncomplete) {
        setTimeout(() => setActiveTab(nextIncomplete), 600);
      }
      setTimeout(() => setSaved(false), 2000);
    }, 250);
  }

  async function submit() {
    const check = hasRequiredForSubmit(biodataRef.current, submitterNameRef.current);
    if (!check.ok) {
      setSubmitError(`Please fill in: ${check.missing.join(", ")}.`);
      // Jump to whichever tab the missing field lives on (name lives above
      // the tabs — no jump needed; user sees the error at the top).
      const m = check.missing[0];
      if (m === "First name" || m === "Last name") {
        // Name fields are above the tabs — scroll to top so they're visible.
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (m === "Gender" || m === "Date of birth") setActiveTab("personal");
      else setActiveTab("family");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/biodata/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          biodata: biodataRef.current,
          submitterFirstName: submitterNameRef.current.firstName,
          submitterLastName: submitterNameRef.current.lastName,
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
    } catch (err) {
      console.error("Submit failed:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <SuccessScreen />;
  }

  if (!hydrated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  const submitCheck = hasRequiredForSubmit(biodata, submitterName);

  return (
    <div>
      <header className="text-center sm:text-left">
        <h1 className="text-[24px] text-[var(--foreground)] sm:text-[var(--font-size-h1-mobile)]">
          Submit your biodata
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-[14px] text-[var(--color-dark-56)] sm:mx-0 sm:text-[16px]">
          Fill in your biodata so families can find the right match for you,
          In Sha Allah. Your progress is saved automatically — you can close
          this page and pick up where you left off.
        </p>
      </header>

      {/* Submitter's name — required, lives outside the tabs since it's
          identity info rather than biodata. Shown above so users fill it
          first. */}
      <div className="mt-6 rounded-2xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-4 sm:mt-8 sm:p-6">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-dark-56)]">
          Your name
        </p>
        <p className="mt-1 text-[12px] text-[var(--color-dark-56)] sm:text-[13px]">
          Required — so we know who we&apos;re matching.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
          <div>
            <label htmlFor="submitter-first-name" className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
              First Name *
            </label>
            <input
              id="submitter-first-name"
              type="text"
              value={submitterName.firstName}
              onChange={(e) =>
                setSubmitterName((n) => ({ ...n, firstName: e.target.value }))
              }
              placeholder="e.g. Aisha"
              maxLength={80}
              className="mt-1.5 w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] placeholder:text-[var(--color-dark-28)] sm:mt-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]"
            />
          </div>
          <div>
            <label htmlFor="submitter-last-name" className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
              Last Name *
            </label>
            <input
              id="submitter-last-name"
              type="text"
              value={submitterName.lastName}
              onChange={(e) =>
                setSubmitterName((n) => ({ ...n, lastName: e.target.value }))
              }
              placeholder="e.g. Rahman"
              maxLength={80}
              className="mt-1.5 w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] placeholder:text-[var(--color-dark-28)] sm:mt-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-10" />

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

      {/* Tabs */}
      <div role="tablist" className="flex flex-wrap gap-1.5 pb-1 sm:gap-2">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          const filled = tabStatus[id];
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${id}`}
              onClick={() => setActiveTab(id)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold transition-colors sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[13px]",
                isActive
                  ? "bg-[var(--foreground)] shadow-sm"
                  : filled
                    ? "bg-[var(--color-dark-08)] text-[var(--foreground)] hover:bg-[var(--color-dark-12)]"
                    : "bg-transparent text-[var(--color-dark-56)] hover:bg-[var(--color-dark-08)] hover:text-[var(--foreground)]"
              )}
              style={isActive ? { color: "var(--background)" } : undefined}
            >
              <Icon className="size-3.5 sm:size-4" />
              <span className="whitespace-nowrap">{label}</span>
              {filled && !isActive && (
                <span className="flex size-3.5 items-center justify-center rounded-full bg-[var(--foreground)] sm:size-4">
                  <Check className="size-2 sm:size-2.5" style={{ color: "var(--background)" }} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Card */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        className="mt-4 rounded-xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-3 sm:mt-6 sm:rounded-2xl sm:p-6 md:p-8"
      >
        {activeTab === "personal" && (
          <TabPersonal
            data={biodata.personal}
            onChange={updatePersonal}
            onSave={() => saveSection("personal")}
            saving={saving}
            saved={saved}
            saveError={null}
            saveLabel="Continue"
            savedLabel="Saved"
          />
        )}
        {activeTab === "education" && (
          <TabEducation
            data={biodata.education}
            onChange={updateEducation}
            onSave={() => saveSection("education")}
            saving={saving}
            saved={saved}
            saveError={null}
            saveLabel="Continue"
            savedLabel="Saved"
          />
        )}
        {activeTab === "family" && (
          <TabFamily
            data={biodata.family}
            gender={biodata.personal.gender}
            onChange={updateFamily}
            onSave={() => saveSection("family")}
            saving={saving}
            saved={saved}
            saveError={null}
            saveLabel="Continue"
            savedLabel="Saved"
          />
        )}
        {activeTab === "religious" && (
          <TabReligious
            data={biodata.religious}
            gender={biodata.personal.gender}
            onChange={updateReligious}
            onSave={() => saveSection("religious")}
            saving={saving}
            saved={saved}
            saveError={null}
            saveLabel="Continue"
            savedLabel="Saved"
          />
        )}
        {activeTab === "lifestyle" && (
          <TabLifestyle
            data={biodata.lifestyle}
            onChange={updateLifestyle}
            onSave={() => saveSection("lifestyle")}
            saving={saving}
            saved={saved}
            saveError={null}
            saveLabel="Continue"
            savedLabel="Saved"
          />
        )}
        {activeTab === "aboutMe" && (
          <div>
            <TabAboutMe
              data={biodata.aboutMe}
              onChange={(val) => setBiodata((prev) => ({ ...prev, aboutMe: val }))}
              onSave={() => saveSection("aboutMe")}
              saving={saving}
              saved={saved}
              saveError={null}
              saveLabel="Save"
              savedLabel="Saved"
            />

            {/* Final submit block */}
            <div className="mt-8 rounded-2xl border border-[var(--color-dark-18)] bg-[var(--background)] p-5 sm:p-6">
              <h3 className="text-[18px] text-[var(--foreground)] sm:text-[20px]">
                Ready to submit?
              </h3>
              <p className="mt-1 text-[13px] text-[var(--color-dark-56)] sm:text-[14px]">
                Once submitted, your biodata will be reviewed before going live.
                Prospective families will contact your Wali directly using the
                phone number you provided.
              </p>

              {!submitCheck.ok && (
                <p className="mt-3 flex items-start gap-1.5 text-[13px] font-medium text-red-600">
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  <span>
                    Required before submitting: {submitCheck.missing.join(", ")}.
                  </span>
                </p>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={submitting || !submitCheck.ok}
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
          </div>
        )}
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
        Jazak Allah Khair. Our team will review your biodata and get in touch
        with your Wali if needed. Once approved, your profile will be visible
        to prospective families looking for a match.
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
