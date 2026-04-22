"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth, type BiodataSection } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";
import {
  User,
  GraduationCap,
  Users,
  Moon,
  Heart,
  FileText,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

const TABS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "education", label: "Education & Career", icon: GraduationCap },
  { id: "family", label: "Family", icon: Users },
  { id: "religious", label: "Religious", icon: Moon },
  { id: "lifestyle", label: "Lifestyle", icon: Heart },
  { id: "aboutMe", label: "About Me", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─── Option lists ─── */

const GENDER_OPTIONS = ["Male", "Female"];
const MARITAL_STATUS_OPTIONS = ["Never Married", "Divorced", "Widowed"];
const HEIGHT_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const totalInches = 54 + i;
  const ft = Math.floor(totalInches / 12);
  const inch = totalInches % 12;
  return `${ft}'${inch}"`;
});
const COMPLEXION_OPTIONS = ["Fair", "Medium", "Olive", "Brown", "Dark"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const EDUCATION_LEVEL_OPTIONS = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD / Doctoral",
  "Islamic Scholar",
  "Other",
];
const INCOME_OPTIONS = [
  "Prefer not to say",
  "Below $30,000",
  "$30,000 – $50,000",
  "$50,000 – $75,000",
  "$75,000 – $100,000",
  "$100,000 – $150,000",
  "Above $150,000",
];

const FAMILY_TYPE_OPTIONS = ["Nuclear", "Joint", "Extended"];
const FAMILY_STATUS_OPTIONS = ["Middle Class", "Upper Middle Class", "Upper Class"];
const WALI_RELATIONSHIP_OPTIONS = [
  "Father",
  "Brother",
  "Uncle (Paternal)",
  "Uncle (Maternal)",
  "Grandfather",
  "Other Male Guardian",
];

const RELIGIOUS_HISTORY_OPTIONS = ["Muslim Since Birth", "Revert Muslim"];
const SECT_OPTIONS = ["Sunni Muslim", "Shia Muslim", "Simply Muslim"];
const PRAYER_ROUTINE_OPTIONS = [
  "Always prays",
  "Occasionally miss Fajr, make up later",
  "Rarely miss prayers, compensate later",
  "Occasionally prays",
  "Intend to start praying",
];
const MODESTY_OPTIONS = [
  "Not Wearing Hijab",
  "Occasionally Wears Hijab",
  "Always Wears Hijab",
  "Always Wears Niqab",
];
const QURAN_READING_OPTIONS = [
  "Can read Arabic fluently",
  "Learning to read",
  "Cannot read Arabic",
  "Reads with translation",
];

const DIET_OPTIONS = ["Strictly Halal", "Halal when possible", "No restrictions"];
const SMOKING_OPTIONS = ["Never", "Occasionally", "Trying to quit", "Yes"];

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function daysInMonth(month: number, year: number): number {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

export default function BiodataForm() {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("personal");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [biodata, setBiodata] = useState<BiodataSection | null>(null);
  const biodataRef = useRef<BiodataSection | null>(null);

  useEffect(() => {
    biodataRef.current = biodata;
  }, [biodata]);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (profile && !initialized) {
      setBiodata(profile.biodata);
      setInitialized(true);
    }
  }, [profile, initialized]);

  const updatePersonal = useCallback(
    (key: keyof BiodataSection["personal"], val: string) => {
      setBiodata((prev) =>
        prev ? { ...prev, personal: { ...prev.personal, [key]: val } } : prev
      );
    },
    []
  );

  const updateEducation = useCallback(
    (key: keyof BiodataSection["education"], val: string) => {
      setBiodata((prev) =>
        prev ? { ...prev, education: { ...prev.education, [key]: val } } : prev
      );
    },
    []
  );

  const updateFamily = useCallback(
    (key: keyof BiodataSection["family"], val: string) => {
      setBiodata((prev) =>
        prev ? { ...prev, family: { ...prev.family, [key]: val } } : prev
      );
    },
    []
  );

  const updateReligious = useCallback(
    (key: keyof BiodataSection["religious"], val: string) => {
      setBiodata((prev) =>
        prev ? { ...prev, religious: { ...prev.religious, [key]: val } } : prev
      );
    },
    []
  );

  const updateLifestyle = useCallback(
    (key: keyof BiodataSection["lifestyle"], val: string) => {
      setBiodata((prev) =>
        prev ? { ...prev, lifestyle: { ...prev.lifestyle, [key]: val } } : prev
      );
    },
    []
  );

  if (!biodata) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  async function save(section: string) {
    if (!user || !biodataRef.current) return;
    const sectionData =
      section === "aboutMe"
        ? biodataRef.current.aboutMe
        : biodataRef.current[section as keyof Omit<BiodataSection, "aboutMe">];
    console.log("[biodata save] sending:", section, JSON.stringify(sectionData));
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      const res = await fetch("/api/profile/biodata", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, section, data: sectionData }),
      });
      const result = await res.json();
      console.log("[biodata save] response:", res.status, JSON.stringify(result));
      if (!res.ok) {
        setSaveError(result?.error ?? "Failed to save. Please try again.");
        return;
      }
      const savedUser = result.user;
      if (savedUser?.biodata) {
        const EMPTY: BiodataSection = {
          personal: { dateOfBirth: "", gender: "", maritalStatus: "", height: "", weight: "", complexion: "", bloodGroup: "", nationality: "", city: "", country: "" },
          education: { educationLevel: "", institution: "", fieldOfStudy: "", occupation: "", employer: "", income: "" },
          family: { fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", siblings: "", familyType: "", familyStatus: "", waliName: "", waliRelationship: "", waliPhone: "", waliEmail: "" },
          religious: { religiousHistory: "", sect: "", prayerRoutine: "", modesty: "", quranReading: "", islamicEducation: "" },
          lifestyle: { diet: "", smoking: "", hobbies: "", languages: "" },
          aboutMe: "",
        };
        setBiodata({
          personal: { ...EMPTY.personal, ...savedUser.biodata.personal },
          education: { ...EMPTY.education, ...savedUser.biodata.education },
          family: { ...EMPTY.family, ...savedUser.biodata.family },
          religious: { ...EMPTY.religious, ...savedUser.biodata.religious },
          lifestyle: { ...EMPTY.lifestyle, ...savedUser.biodata.lifestyle },
          aboutMe: savedUser.biodata.aboutMe ?? "",
        });
      }
      refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveError("Network error. Please check your connection.");
    } finally {
      setSaving(false);
    }
  }

  /* ─── Tab completion helpers ─── */
  function sectionFilled(obj: Record<string, string>, keys?: string[]): boolean {
    const vals = keys ? keys.map((k) => obj[k]) : Object.values(obj);
    return vals.some((v) => v && v.trim() !== "");
  }

  const tabStatus: Record<TabId, boolean> = {
    personal: sectionFilled(biodata.personal),
    education: sectionFilled(biodata.education),
    family: sectionFilled(biodata.family),
    religious: sectionFilled(biodata.religious),
    lifestyle: sectionFilled(biodata.lifestyle),
    aboutMe: biodata.aboutMe.trim().length > 0,
  };

  return (
    <div>
      {/* Tabs — scrollable pills */}
      <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:gap-2 sm:px-0">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          const filled = tabStatus[id];
          return (
            <button
              key={id}
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

      {/* Tab content inside a card */}
      <div className="mt-4 rounded-xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-3 sm:mt-6 sm:rounded-2xl sm:p-6 md:p-8">
        {activeTab === "personal" && (
          <TabPersonal
            data={biodata.personal}
            onChange={updatePersonal}
            onSave={() => save("personal")}
            saving={saving}
            saved={saved}
            saveError={saveError}
          />
        )}
        {activeTab === "education" && (
          <TabEducation
            data={biodata.education}
            onChange={updateEducation}
            onSave={() => save("education")}
            saving={saving}
            saved={saved}
            saveError={saveError}
          />
        )}
        {activeTab === "family" && (
          <TabFamily
            data={biodata.family}
            gender={biodata.personal.gender}
            onChange={updateFamily}
            onSave={() => save("family")}
            saving={saving}
            saved={saved}
            saveError={saveError}
          />
        )}
        {activeTab === "religious" && (
          <TabReligious
            data={biodata.religious}
            onChange={updateReligious}
            onSave={() => save("religious")}
            saving={saving}
            saved={saved}
            saveError={saveError}
          />
        )}
        {activeTab === "lifestyle" && (
          <TabLifestyle
            data={biodata.lifestyle}
            onChange={updateLifestyle}
            onSave={() => save("lifestyle")}
            saving={saving}
            saved={saved}
            saveError={saveError}
          />
        )}
        {activeTab === "aboutMe" && (
          <TabAboutMe
            data={biodata.aboutMe}
            onChange={(val) =>
              setBiodata((prev) => (prev ? { ...prev, aboutMe: val } : prev))
            }
            onSave={() => save("aboutMe")}
            saving={saving}
            saved={saved}
            saveError={saveError}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Shared primitives ─── */

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 sm:mb-8">
      <h3 className="text-[18px] text-[var(--foreground)] sm:text-[24px]">{title}</h3>
      <p className="mt-1 text-[13px] text-[var(--color-dark-56)] sm:text-[14px]">{description}</p>
    </div>
  );
}

function SaveButton({
  onSave,
  saving,
  saved,
  saveError,
  disabled,
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[var(--color-dark-08)] pt-4 sm:mt-10 sm:pt-6">
      <button
        onClick={onSave}
        disabled={saving || disabled}
        className={cn(
          goldButtonClass,
          "inline-flex h-10 w-full items-center justify-center gap-2 rounded-full px-6 text-[13px] font-semibold disabled:opacity-50 sm:h-11 sm:w-auto sm:px-8 sm:text-[14px]"
        )}
      >
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Saving...
          </>
        ) : saved ? (
          <>
            <Check className="size-4" />
            Saved
          </>
        ) : (
          "Save Changes"
        )}
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-dark-56)]">
          <Check className="size-3.5" />
          All changes saved
        </span>
      )}
      {saveError && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
          <AlertCircle className="size-3.5" />
          {saveError}
        </span>
      )}
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] placeholder:text-[var(--color-dark-28)] sm:mt-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]"
      />
    </div>
  );
}

function FieldDateSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const parts = value ? value.split("-") : [];
  const year = parts[0] ?? "";
  const month = parts[1] ?? "";
  const day = parts[2] ?? "";

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => String(currentYear - 16 - i));
  const monthNum = parseInt(month, 10) || 0;
  const yearNum = parseInt(year, 10) || 0;
  const maxDays = daysInMonth(monthNum, yearNum);
  const days = Array.from({ length: maxDays }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  function update(newYear: string, newMonth: string, newDay: string) {
    if (newYear && newMonth && newDay) {
      onChange(`${newYear}-${newMonth}-${newDay}`);
    } else if (!newYear && !newMonth && !newDay) {
      onChange("");
    } else {
      onChange(`${newYear || "0000"}-${newMonth || "00"}-${newDay || "00"}`);
    }
  }

  const selectClass =
    "w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-2 py-2 text-[13px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] sm:px-3 sm:py-2.5 sm:text-[15px]";

  return (
    <div>
      <label className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
        {label}
      </label>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5 sm:mt-2 sm:gap-2">
        <select
          value={month}
          onChange={(e) => update(year, e.target.value, day)}
          className={selectClass}
        >
          <option value="">Month</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={String(i + 1).padStart(2, "0")}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={day}
          onChange={(e) => update(year, month, e.target.value)}
          className={selectClass}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {parseInt(d, 10)}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => update(e.target.value, month, day)}
          className={selectClass}
        >
          <option value="">Year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] sm:mt-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChipSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
        {label}
      </label>
      <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-2.5 sm:gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all sm:px-4 sm:py-2 sm:text-[13px]",
              value === opt
                ? "border-[var(--foreground)] bg-[var(--foreground)] shadow-sm"
                : "border-[var(--color-dark-18)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--foreground)]"
            )}
            style={value === opt ? { color: "var(--background)" } : undefined}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Tab components ─── */

function TabPersonal({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
}: {
  data: BiodataSection["personal"];
  onChange: (key: keyof BiodataSection["personal"], val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
}) {
  return (
    <div>
      <SectionHeader
        title="Personal Information"
        description="Basic details about yourself"
      />

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <FieldDateSelect
          label="Date of Birth"
          value={data.dateOfBirth}
          onChange={(v) => onChange("dateOfBirth", v)}
        />
        <ChipSelect
          label="Gender"
          value={data.gender}
          onChange={(v) => onChange("gender", v)}
          options={GENDER_OPTIONS}
        />
        <ChipSelect
          label="Marital Status"
          value={data.maritalStatus}
          onChange={(v) => onChange("maritalStatus", v)}
          options={MARITAL_STATUS_OPTIONS}
        />
        <FieldSelect
          label="Height"
          value={data.height}
          onChange={(v) => onChange("height", v)}
          options={HEIGHT_OPTIONS}
        />
        <FieldInput
          label="Weight (kg)"
          value={data.weight}
          onChange={(v) => onChange("weight", v)}
          placeholder="e.g. 70"
        />
        <FieldSelect
          label="Complexion"
          value={data.complexion}
          onChange={(v) => onChange("complexion", v)}
          options={COMPLEXION_OPTIONS}
        />
        <FieldSelect
          label="Blood Group"
          value={data.bloodGroup}
          onChange={(v) => onChange("bloodGroup", v)}
          options={BLOOD_GROUP_OPTIONS}
        />
        <FieldInput
          label="Nationality"
          value={data.nationality}
          onChange={(v) => onChange("nationality", v)}
          placeholder="e.g. Bangladeshi Canadian"
        />
        <FieldInput
          label="City"
          value={data.city}
          onChange={(v) => onChange("city", v)}
          placeholder="e.g. Toronto"
        />
        <FieldInput
          label="Country"
          value={data.country}
          onChange={(v) => onChange("country", v)}
          placeholder="e.g. Canada"
        />
      </div>

      <SaveButton onSave={onSave} saving={saving} saved={saved} saveError={saveError} />
    </div>
  );
}

function TabEducation({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
}: {
  data: BiodataSection["education"];
  onChange: (key: keyof BiodataSection["education"], val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
}) {
  return (
    <div>
      <SectionHeader
        title="Education & Career"
        description="Your qualifications and professional background"
      />

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <FieldSelect
          label="Education Level"
          value={data.educationLevel}
          onChange={(v) => onChange("educationLevel", v)}
          options={EDUCATION_LEVEL_OPTIONS}
        />
        <FieldInput
          label="Institution"
          value={data.institution}
          onChange={(v) => onChange("institution", v)}
          placeholder="e.g. University of Toronto"
        />
        <FieldInput
          label="Field of Study"
          value={data.fieldOfStudy}
          onChange={(v) => onChange("fieldOfStudy", v)}
          placeholder="e.g. Computer Science"
        />
        <FieldInput
          label="Occupation"
          value={data.occupation}
          onChange={(v) => onChange("occupation", v)}
          placeholder="e.g. Software Engineer"
        />
        <FieldInput
          label="Employer"
          value={data.employer}
          onChange={(v) => onChange("employer", v)}
          placeholder="Company name (optional)"
        />
        <FieldSelect
          label="Annual Income"
          value={data.income}
          onChange={(v) => onChange("income", v)}
          options={INCOME_OPTIONS}
        />
      </div>

      <SaveButton onSave={onSave} saving={saving} saved={saved} saveError={saveError} />
    </div>
  );
}

function TabFamily({
  data,
  gender,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
}: {
  data: BiodataSection["family"];
  gender: string;
  onChange: (key: keyof BiodataSection["family"], val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
}) {
  const waliMissing = !data.waliName || !data.waliRelationship || !data.waliPhone;

  return (
    <div>
      <SectionHeader
        title="Family Details"
        description="Information about your family"
      />

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <FieldInput
          label="Father's Name"
          value={data.fatherName}
          onChange={(v) => onChange("fatherName", v)}
          placeholder="Father's full name"
        />
        <FieldInput
          label="Father's Occupation"
          value={data.fatherOccupation}
          onChange={(v) => onChange("fatherOccupation", v)}
          placeholder="e.g. Business Owner"
        />
        <FieldInput
          label="Mother's Name"
          value={data.motherName}
          onChange={(v) => onChange("motherName", v)}
          placeholder="Mother's full name"
        />
        <FieldInput
          label="Mother's Occupation"
          value={data.motherOccupation}
          onChange={(v) => onChange("motherOccupation", v)}
          placeholder="e.g. Homemaker"
        />
        <FieldInput
          label="Number of Siblings"
          value={data.siblings}
          onChange={(v) => onChange("siblings", v)}
          placeholder="e.g. 2 brothers, 1 sister"
        />
        <ChipSelect
          label="Family Type"
          value={data.familyType}
          onChange={(v) => onChange("familyType", v)}
          options={FAMILY_TYPE_OPTIONS}
        />
        <ChipSelect
          label="Family Status"
          value={data.familyStatus}
          onChange={(v) => onChange("familyStatus", v)}
          options={FAMILY_STATUS_OPTIONS}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-[var(--color-dark-12)] bg-[var(--background)] p-6">
        <h3 className="text-[var(--foreground)]">
          Wali&apos;s Contact Information
        </h3>
        <p className="mt-1 text-[14px] text-[var(--color-dark-56)]">
          Required — your Wali (male guardian) will be the point of contact
          for prospective families
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <FieldInput
            label="Wali's Full Name *"
            value={data.waliName}
            onChange={(v) => onChange("waliName", v)}
            placeholder="e.g. Abdul Rahman"
          />
          <FieldSelect
            label="Relationship to You *"
            value={data.waliRelationship}
            onChange={(v) => onChange("waliRelationship", v)}
            options={WALI_RELATIONSHIP_OPTIONS}
            placeholder="Select relationship..."
          />
          <FieldInput
            label="Wali's Phone Number *"
            value={data.waliPhone}
            onChange={(v) => onChange("waliPhone", v)}
            placeholder="e.g. +1 (416) 555-0123"
          />
          <FieldInput
            label="Wali's Email"
            value={data.waliEmail}
            onChange={(v) => onChange("waliEmail", v)}
            placeholder="e.g. wali@email.com"
          />
        </div>

        {waliMissing && (
          <p className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-red-600">
            <AlertCircle className="size-3.5" />
            Wali&apos;s name, relationship, and phone number are required.
          </p>
        )}
      </div>

      <SaveButton
        onSave={onSave}
        saving={saving}
        saved={saved}
        saveError={saveError}
        disabled={waliMissing}
      />
    </div>
  );
}

function TabReligious({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
}: {
  data: BiodataSection["religious"];
  onChange: (key: keyof BiodataSection["religious"], val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
}) {
  return (
    <div>
      <SectionHeader
        title="Religious Background"
        description="Your faith and practice"
      />

      <div className="grid gap-8">
        <ChipSelect
          label="Religious History"
          value={data.religiousHistory}
          onChange={(v) => onChange("religiousHistory", v)}
          options={RELIGIOUS_HISTORY_OPTIONS}
        />
        <ChipSelect
          label="Sect"
          value={data.sect}
          onChange={(v) => onChange("sect", v)}
          options={SECT_OPTIONS}
        />
        <ChipSelect
          label="Prayer Routine"
          value={data.prayerRoutine}
          onChange={(v) => onChange("prayerRoutine", v)}
          options={PRAYER_ROUTINE_OPTIONS}
        />
        <ChipSelect
          label="Modesty"
          value={data.modesty}
          onChange={(v) => onChange("modesty", v)}
          options={MODESTY_OPTIONS}
        />
        <ChipSelect
          label="Quran Reading"
          value={data.quranReading}
          onChange={(v) => onChange("quranReading", v)}
          options={QURAN_READING_OPTIONS}
        />
        <FieldInput
          label="Islamic Education"
          value={data.islamicEducation}
          onChange={(v) => onChange("islamicEducation", v)}
          placeholder="e.g. Completed Hifz, Alim course, etc."
        />
      </div>

      <SaveButton onSave={onSave} saving={saving} saved={saved} saveError={saveError} />
    </div>
  );
}

function TabLifestyle({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
}: {
  data: BiodataSection["lifestyle"];
  onChange: (key: keyof BiodataSection["lifestyle"], val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
}) {
  return (
    <div>
      <SectionHeader
        title="Lifestyle"
        description="Your habits and interests"
      />

      <div className="grid gap-8">
        <ChipSelect
          label="Diet"
          value={data.diet}
          onChange={(v) => onChange("diet", v)}
          options={DIET_OPTIONS}
        />
        <ChipSelect
          label="Smoking"
          value={data.smoking}
          onChange={(v) => onChange("smoking", v)}
          options={SMOKING_OPTIONS}
        />
        <FieldInput
          label="Hobbies & Interests"
          value={data.hobbies}
          onChange={(v) => onChange("hobbies", v)}
          placeholder="e.g. Reading, hiking, cooking, Islamic lectures"
        />
        <FieldInput
          label="Languages Spoken"
          value={data.languages}
          onChange={(v) => onChange("languages", v)}
          placeholder="e.g. English, Bengali, Arabic"
        />
      </div>

      <SaveButton onSave={onSave} saving={saving} saved={saved} saveError={saveError} />
    </div>
  );
}

function TabAboutMe({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
}: {
  data: string;
  onChange: (val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
}) {
  return (
    <div>
      <SectionHeader
        title="About Me"
        description="Write a brief introduction about yourself, your values, and what you are looking for in a life partner"
      />

      <div>
        <textarea
          value={data}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          maxLength={1000}
          placeholder="Tell potential matches about yourself..."
          className="w-full resize-none rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] p-4 text-[15px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] placeholder:text-[var(--color-dark-28)]"
        />
        <div className="mt-2 flex justify-end">
          <span
            className={cn(
              "text-[13px] font-medium",
              data.length > 900
                ? "text-red-600"
                : "text-[var(--color-dark-56)]"
            )}
          >
            {data.length}/1000
          </span>
        </div>
      </div>

      <SaveButton onSave={onSave} saving={saving} saved={saved} saveError={saveError} />
    </div>
  );
}
