"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";
import type { BiodataSection } from "@/lib/types/biodata";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  HEIGHT_OPTIONS,
  COMPLEXION_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  INCOME_OPTIONS,
  BANGLADESH_DISTRICT_OPTIONS,
  FAMILY_TYPE_OPTIONS,
  FAMILY_STATUS_OPTIONS,
  WALI_RELATIONSHIP_OPTIONS,
  RELIGIOUS_HISTORY_OPTIONS,
  SECT_OPTIONS,
  PRAYER_ROUTINE_OPTIONS,
  MODESTY_OPTIONS,
  BEARD_OPTIONS,
  QURAN_READING_OPTIONS,
  DIET_OPTIONS,
  SMOKING_OPTIONS,
} from "@/lib/constants/biodata-options";
import { Check, Loader2, AlertCircle } from "lucide-react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function daysInMonth(month: number, year: number): number {
  if (!month || !year) return 31;
  return new Date(year, month, 0).getDate();
}

/* ─── Primitives ─── */

export function SectionHeader({
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

export function SaveButton({
  onSave,
  saving,
  saved,
  saveError,
  disabled,
  label = "Save Changes",
  savedLabel = "Saved",
}: {
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  disabled?: boolean;
  label?: string;
  savedLabel?: string;
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
            {savedLabel}
          </>
        ) : (
          label
        )}
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-dark-56)]">
          <Check className="size-3.5" />
          {savedLabel}
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

export function FieldInput({
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
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-[var(--color-dark-14)] bg-[var(--background)] px-3 py-2 text-[14px] text-[var(--foreground)] outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)] placeholder:text-[var(--color-dark-28)] sm:mt-2 sm:px-3.5 sm:py-2.5 sm:text-[15px]"
      />
    </div>
  );
}

export function FieldDateSelect({
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

  const groupId = useId();

  return (
    <div role="group" aria-labelledby={groupId}>
      <label id={groupId} className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
        {label}
      </label>
      <div className="mt-1.5 grid grid-cols-3 gap-1.5 sm:mt-2 sm:gap-2">
        <select
          aria-label="Month"
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
          aria-label="Day"
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
          aria-label="Year"
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

export function FieldSelect({
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
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
        {label}
      </label>
      <select
        id={id}
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

export function ChipSelect({
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
  const labelId = useId();
  return (
    <div>
      <label id={labelId} className="block text-[12px] font-semibold tracking-wide text-[var(--color-dark-56)] sm:text-[13px]">
        {label}
      </label>
      <div role="radiogroup" aria-labelledby={labelId} className="mt-2 flex flex-wrap gap-1.5 sm:mt-2.5 sm:gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={value === opt}
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

type TabProps<T> = {
  data: T;
  onChange: (key: keyof T, val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  saveLabel?: string;
  savedLabel?: string;
};

export function TabPersonal({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
  saveLabel,
  savedLabel,
}: TabProps<BiodataSection["personal"]>) {
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
        <FieldSelect
          label="District of Origin (Bangladesh)"
          value={data.bangladeshDistrict}
          onChange={(v) => onChange("bangladeshDistrict", v)}
          options={BANGLADESH_DISTRICT_OPTIONS}
          placeholder="Select your home district..."
        />
      </div>

      <SaveButton
        onSave={onSave}
        saving={saving}
        saved={saved}
        saveError={saveError}
        label={saveLabel}
        savedLabel={savedLabel}
      />
    </div>
  );
}

export function TabEducation({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
  saveLabel,
  savedLabel,
}: TabProps<BiodataSection["education"]>) {
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

      <SaveButton
        onSave={onSave}
        saving={saving}
        saved={saved}
        saveError={saveError}
        label={saveLabel}
        savedLabel={savedLabel}
      />
    </div>
  );
}

export function TabFamily({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
  saveLabel,
  savedLabel,
}: TabProps<BiodataSection["family"]> & { gender?: string }) {
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
        label={saveLabel}
        savedLabel={savedLabel}
      />
    </div>
  );
}

export function TabReligious({
  data,
  gender,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
  saveLabel,
  savedLabel,
}: TabProps<BiodataSection["religious"]> & { gender?: string }) {
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
        {gender === "Female" && (
          <ChipSelect
            label="Modesty"
            value={data.modesty}
            onChange={(v) => onChange("modesty", v)}
            options={MODESTY_OPTIONS}
          />
        )}
        {gender === "Male" && (
          <ChipSelect
            label="Beard"
            value={data.beard}
            onChange={(v) => onChange("beard", v)}
            options={BEARD_OPTIONS}
          />
        )}
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

      <SaveButton
        onSave={onSave}
        saving={saving}
        saved={saved}
        saveError={saveError}
        label={saveLabel}
        savedLabel={savedLabel}
      />
    </div>
  );
}

export function TabLifestyle({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
  saveLabel,
  savedLabel,
}: TabProps<BiodataSection["lifestyle"]>) {
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

      <SaveButton
        onSave={onSave}
        saving={saving}
        saved={saved}
        saveError={saveError}
        label={saveLabel}
        savedLabel={savedLabel}
      />
    </div>
  );
}

export function TabAboutMe({
  data,
  onChange,
  onSave,
  saving,
  saved,
  saveError,
  saveLabel,
  savedLabel,
  disabled,
}: {
  data: string;
  onChange: (val: string) => void;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  saveLabel?: string;
  savedLabel?: string;
  disabled?: boolean;
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

      <SaveButton
        onSave={onSave}
        saving={saving}
        saved={saved}
        saveError={saveError}
        disabled={disabled}
        label={saveLabel}
        savedLabel={savedLabel}
      />
    </div>
  );
}
