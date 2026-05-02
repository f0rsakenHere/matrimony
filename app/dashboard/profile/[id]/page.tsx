"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User as UserIcon,
  GraduationCap,
  Users,
  Moon,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { calculateAge, formatDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

// Invitation/Wali-unlock UI is intentionally hidden — matchmaking is being
// done manually right now. Wali fields are still stripped server-side in
// /api/profiles/[id] until an accepted Invitation exists, which currently
// never happens. The Invitation model + API endpoints remain wired up for
// when we re-enable the in-app invite flow.

interface FullMatchProfile {
  _id: string;
  profileName: string;
  photoURL?: string;
  biodata: {
    personal: {
      dateOfBirth: string;
      gender: string;
      maritalStatus: string;
      height: string;
      weight: string;
      complexion: string;
      bloodGroup: string;
      nationality: string;
      city: string;
      country: string;
      bangladeshDistrict: string;
    };
    education: {
      educationLevel: string;
      institution: string;
      fieldOfStudy: string;
      occupation: string;
      employer: string;
      income: string;
    };
    family: {
      fatherName: string;
      fatherOccupation: string;
      motherName: string;
      motherOccupation: string;
      siblings: string;
      familyType: string;
      familyStatus: string;
      waliName: string;
      waliRelationship: string;
      waliPhone: string;
      waliEmail: string;
    };
    religious: {
      religiousHistory: string;
      sect: string;
      prayerRoutine: string;
      modesty: string;
      beard: string;
      quranReading: string;
      islamicEducation: string;
    };
    lifestyle: {
      diet: string;
      smoking: string;
      hobbies: string;
      languages: string;
    };
    aboutMe: string;
  };
}

export default function ProfileViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, getAuthHeaders } = useAuth();
  const [profile, setProfile] = useState<FullMatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`/api/profiles/${id}`, { headers: authHeaders });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (err) {
        console.error("Failed to fetch profile detail:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--foreground)] border-t-transparent" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-6 py-10">
        <p className="text-[var(--color-dark-56)]">Profile not found.</p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--foreground)] hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { personal, education, religious, family, lifestyle, aboutMe } =
    profile.biodata;
  const age = calculateAge(personal.dateOfBirth);

  const TABS = [
    { id: "details", label: "Profile", icon: UserIcon },
    { id: "education", label: "Education & Career", icon: GraduationCap },
    { id: "family", label: "Family", icon: Users },
    { id: "religious", label: "Religious", icon: Moon },
    { id: "lifestyle", label: "Lifestyle", icon: Heart },
  ];

  return (
    <div>
      {/* Navigation */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--background)] px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--color-dark-56)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="size-4" />
          Back to matches
        </Link>
      </div>

      {/* Header */}
      <div
        className="px-4 py-6 sm:px-6 sm:py-10"
        style={{
          backgroundColor: "var(--foreground)",
          color: "var(--background)",
        }}
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-full text-2xl font-semibold sm:size-20 sm:text-3xl"
            style={{ backgroundColor: "rgba(240,244,248,0.18)" }}
          >
            {profile.profileName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold sm:text-3xl">{profile.profileName}</h1>
            <p className="mt-2 text-[16px] opacity-70">
              {[age ? `${age} yrs` : null, personal.height, personal.maritalStatus]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Invitation & Wali Contact (hidden during manual matchmaking phase) ─── */}

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        {/* Tabs */}
        <div className="-mx-4 flex gap-1 overflow-x-auto border-b border-[var(--border-subtle)] px-4 pb-px sm:mx-0 sm:px-0">
          {TABS.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              onClick={() => setActiveTab(tabId)}
              className={cn(
                "flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-[14px] font-medium transition-colors",
                activeTab === tabId
                  ? "border-[var(--foreground)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--color-dark-56)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-8 max-w-3xl">
          {/* ─── Profile / Personal ─── */}
          {activeTab === "details" && (
            <div className="space-y-10">
              {aboutMe && (
                <section>
                  <SectionTitle>About Me</SectionTitle>
                  <p className="text-[16px] leading-relaxed text-[var(--color-dark-72)]">
                    {aboutMe}
                  </p>
                </section>
              )}

              <section>
                <SectionTitle>Personal Information</SectionTitle>
                <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
                  <DetailRow
                    label="Date of Birth"
                    value={
                      personal.dateOfBirth
                        ? `${formatDate(personal.dateOfBirth)}${age ? ` (${age} yrs)` : ""}`
                        : undefined
                    }
                  />
                  <DetailRow label="Gender" value={personal.gender} />
                  <DetailRow
                    label="Marital Status"
                    value={personal.maritalStatus}
                  />
                  <DetailRow label="Height" value={personal.height} />
                  <DetailRow label="Weight" value={personal.weight ? `${personal.weight} kg` : undefined} />
                  <DetailRow label="Complexion" value={personal.complexion} />
                  <DetailRow label="Blood Group" value={personal.bloodGroup} />
                  <DetailRow label="Nationality" value={personal.nationality} />
                  <DetailRow
                    label="Location"
                    value={[personal.city, personal.country]
                      .filter(Boolean)
                      .join(", ")}
                  />
                  <DetailRow
                    label="Origin (Bangladesh)"
                    value={personal.bangladeshDistrict}
                  />
                </div>
              </section>
            </div>
          )}

          {/* ─── Education & Career ─── */}
          {activeTab === "education" && (
            <section>
              <SectionTitle>Education & Career</SectionTitle>
              <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
                <DetailRow
                  label="Education Level"
                  value={education.educationLevel}
                />
                <DetailRow label="Institution" value={education.institution} />
                <DetailRow
                  label="Field of Study"
                  value={education.fieldOfStudy}
                />
                <DetailRow label="Occupation" value={education.occupation} />
                <DetailRow label="Employer" value={education.employer} />
                <DetailRow label="Annual Income" value={education.income} />
              </div>
            </section>
          )}

          {/* ─── Family ─── */}
          {activeTab === "family" && (
            <section>
              <SectionTitle>Family Details</SectionTitle>
              <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
                <DetailRow label="Father's Name" value={family.fatherName} />
                <DetailRow
                  label="Father's Occupation"
                  value={family.fatherOccupation}
                />
                <DetailRow label="Mother's Name" value={family.motherName} />
                <DetailRow
                  label="Mother's Occupation"
                  value={family.motherOccupation}
                />
                <DetailRow label="Siblings" value={family.siblings} />
                <DetailRow label="Family Type" value={family.familyType} />
                <DetailRow label="Family Status" value={family.familyStatus} />
              </div>
            </section>
          )}

          {/* ─── Religious ─── */}
          {activeTab === "religious" && (
            <section>
              <SectionTitle>Religious Background</SectionTitle>
              <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
                <DetailRow
                  label="Religious History"
                  value={religious.religiousHistory}
                />
                <DetailRow label="Sect" value={religious.sect} />
                <DetailRow
                  label="Prayer Routine"
                  value={religious.prayerRoutine}
                />
                {personal.gender === "Female" && (
                  <DetailRow label="Modesty" value={religious.modesty} />
                )}
                {personal.gender === "Male" && (
                  <DetailRow label="Beard" value={religious.beard} />
                )}
                <DetailRow
                  label="Quran Reading"
                  value={religious.quranReading}
                />
                <DetailRow
                  label="Islamic Education"
                  value={religious.islamicEducation}
                />
              </div>
            </section>
          )}

          {/* ─── Lifestyle ─── */}
          {activeTab === "lifestyle" && (
            <section>
              <SectionTitle>Lifestyle</SectionTitle>
              <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2">
                <DetailRow label="Diet" value={lifestyle.diet} />
                <DetailRow label="Smoking" value={lifestyle.smoking} />
                <DetailRow label="Hobbies & Interests" value={lifestyle.hobbies} />
                <DetailRow
                  label="Languages Spoken"
                  value={lifestyle.languages}
                />
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
}


function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-6 text-[18px] font-semibold text-[var(--foreground)]">
      {children}
    </h3>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--border-subtle)] py-3 text-[15px]">
      <span className="text-[13px] text-[var(--color-dark-56)]">{label}</span>
      <span className="font-medium text-[var(--foreground)]">{value}</span>
    </div>
  );
}
