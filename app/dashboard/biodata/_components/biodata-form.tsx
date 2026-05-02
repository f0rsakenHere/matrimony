"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth, type BiodataSection } from "@/contexts/AuthContext";
import { EMPTY_BIODATA } from "@/lib/types/biodata";
import { cn } from "@/lib/utils";
import {
  TabPersonal,
  TabEducation,
  TabFamily,
  TabReligious,
  TabLifestyle,
  TabAboutMe,
} from "./biodata-form-fields";
import {
  User,
  GraduationCap,
  Users,
  Moon,
  Heart,
  FileText,
  Check,
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

export default function BiodataForm() {
  const { user, profile, loading: authLoading, refreshProfile, getAuthHeaders } = useAuth();
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
  const [retried, setRetried] = useState(false);

  useEffect(() => {
    if (profile && !initialized) {
      setBiodata(profile.biodata);
      setInitialized(true);
      return;
    }
    // Auth finished but profile is null — likely a 404/error race during sign-in.
    // Retry once; if still null, fall back to an empty form so the user can fill it in.
    if (!authLoading && user && !profile && !initialized && !retried) {
      setRetried(true);
      refreshProfile().then(() => {
        if (!biodataRef.current) {
          setBiodata(EMPTY_BIODATA);
          setInitialized(true);
        }
      });
    }
  }, [profile, initialized, authLoading, user, retried, refreshProfile]);

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
    setSaving(true);
    setSaved(false);
    setSaveError(null);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/profile/biodata", {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ section, data: sectionData }),
      });
      const result = await res.json();
      if (!res.ok) {
        setSaveError(result?.error ?? "Failed to save. Please try again.");
        return;
      }
      const savedUser = result.user;
      if (savedUser?.biodata) {
        setBiodata({
          personal: { ...EMPTY_BIODATA.personal, ...savedUser.biodata.personal },
          education: { ...EMPTY_BIODATA.education, ...savedUser.biodata.education },
          family: { ...EMPTY_BIODATA.family, ...savedUser.biodata.family },
          religious: { ...EMPTY_BIODATA.religious, ...savedUser.biodata.religious },
          lifestyle: { ...EMPTY_BIODATA.lifestyle, ...savedUser.biodata.lifestyle },
          aboutMe: savedUser.biodata.aboutMe ?? "",
        });
      }
      refreshProfile();
      setSaved(true);

      // Auto-navigate to the next incomplete tab
      const updated: BiodataSection = savedUser?.biodata
        ? {
            personal: { ...EMPTY_BIODATA.personal, ...savedUser.biodata.personal },
            education: { ...EMPTY_BIODATA.education, ...savedUser.biodata.education },
            family: { ...EMPTY_BIODATA.family, ...savedUser.biodata.family },
            religious: { ...EMPTY_BIODATA.religious, ...savedUser.biodata.religious },
            lifestyle: { ...EMPTY_BIODATA.lifestyle, ...savedUser.biodata.lifestyle },
            aboutMe: savedUser.biodata.aboutMe ?? "",
          }
        : biodataRef.current!;
      const isFilled = (obj: Record<string, string>) => Object.values(obj).some((v) => v && v.trim() !== "");
      const tabOrder: TabId[] = ["personal", "education", "family", "religious", "lifestyle", "aboutMe"];
      const currentIdx = tabOrder.indexOf(section as TabId);
      const nextIncomplete = tabOrder.find((tab, i) => {
        if (i <= currentIdx) return false;
        if (tab === "aboutMe") return updated.aboutMe.trim().length === 0;
        return !isFilled(updated[tab] as unknown as Record<string, string>);
      });
      if (nextIncomplete) {
        setTimeout(() => setActiveTab(nextIncomplete), 600);
      }

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
      {/* Tabs — wrap on every viewport so all 6 stay visible */}
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

      {/* Tab content inside a card */}
      <div role="tabpanel" id={`panel-${activeTab}`} className="mt-4 rounded-xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-3 sm:mt-6 sm:rounded-2xl sm:p-6 md:p-8">
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
            gender={biodata.personal.gender}
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
