"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User as UserIcon,
  Phone,
  GraduationCap,
  Users,
  Moon,
  Heart,
  Lock,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Crown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { calculateAge, formatDate } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { goldButtonClass } from "@/components/ui/button-styles";

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
  const { user, profile: myProfile, refreshProfile, getAuthHeaders } = useAuth();
  const [profile, setProfile] = useState<FullMatchProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  // Invitation state
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [inviteDirection, setInviteDirection] = useState<string | null>(null);
  const [invitationId, setInvitationId] = useState<string | null>(null);
  const [waliUnlocked, setWaliUnlocked] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [respondingInvite, setRespondingInvite] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`/api/profiles/${id}`, { headers: authHeaders });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);

          // Fetch invitation status
          const profileUser = data.profile as { firebaseUid?: string };
          if (profileUser?.firebaseUid) {
            const statusRes = await fetch(
              `/api/invitations/status?profileUid=${profileUser.firebaseUid}`,
              { headers: authHeaders }
            );
            if (statusRes.ok) {
              const s = await statusRes.json();
              setInviteStatus(s.status);
              setInviteDirection(s.direction);
              setInvitationId(s.invitationId);
              setWaliUnlocked(s.waliUnlocked);
            }
          }
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
  const hasWali = family?.waliName || family?.waliPhone;
  const invitesLeft = myProfile?.invitesRemaining ?? 0;

  const TABS = [
    { id: "details", label: "Profile", icon: UserIcon },
    { id: "education", label: "Education & Career", icon: GraduationCap },
    { id: "family", label: "Family", icon: Users },
    { id: "religious", label: "Religious", icon: Moon },
    { id: "lifestyle", label: "Lifestyle", icon: Heart },
  ];

  async function sendInvite() {
    if (!user) return;
    setSendingInvite(true);
    setInviteError(null);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ receiverProfileId: id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setInviteError(data.error);
        return;
      }
      setInviteStatus("pending");
      setInviteDirection("sent");
      refreshProfile(); // update invitesRemaining
    } catch {
      setInviteError("Failed to send. Please try again.");
    } finally {
      setSendingInvite(false);
    }
  }

  async function respondToInvite(action: "accept" | "decline") {
    if (!user || !invitationId) return;
    setRespondingInvite(true);
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch("/api/invitations", {
        method: "PATCH",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId, action }),
      });
      if (res.ok) {
        if (action === "accept") {
          setInviteStatus("accepted");
          setWaliUnlocked(true);
        } else {
          setInviteStatus("declined");
        }
      }
    } catch {
      // ignore
    } finally {
      setRespondingInvite(false);
    }
  }

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

function InvitationCard({
  hasWali,
  family,
  inviteStatus,
  inviteDirection,
  waliUnlocked,
  invitesLeft,
  sendingInvite,
  respondingInvite,
  inviteError,
  onSendInvite,
  onRespond,
  profileName,
}: {
  hasWali: boolean;
  family: FullMatchProfile["biodata"]["family"];
  inviteStatus: string | null;
  inviteDirection: string | null;
  waliUnlocked: boolean;
  invitesLeft: number;
  sendingInvite: boolean;
  respondingInvite: boolean;
  inviteError: string | null;
  onSendInvite: () => void;
  onRespond: (action: "accept" | "decline") => void;
  profileName: string;
}) {
  // ─── State: Wali unlocked (both accepted) ───
  if (waliUnlocked && hasWali) {
    return (
      <div
        className="rounded-2xl border-2 p-6"
        style={{ borderColor: "var(--button-gold-mid)" }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(180deg, var(--button-gold-light), var(--button-gold-dark))",
              color: "var(--button-gold-text)",
            }}
          >
            <Phone className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-bold text-[var(--foreground)]">
                Wali (Guardian) Contact
              </h3>
              <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-[12px] font-semibold text-green-700">
                Unlocked
              </span>
            </div>
            <p className="text-[13px] text-[var(--color-dark-56)]">
              Contact the family through the Wali
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[var(--color-dark-08)] p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">
              Name & Relationship
            </p>
            <p className="mt-1.5 text-[16px] font-medium text-[var(--foreground)]">
              {family.waliName || "—"}
              {family.waliRelationship && (
                <span className="ml-2 text-[14px] font-normal text-[var(--color-dark-56)]">
                  ({family.waliRelationship})
                </span>
              )}
            </p>
          </div>
          <div className="rounded-xl bg-[var(--color-dark-08)] p-4">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">
              Phone Number
            </p>
            <a
              href={`tel:${family.waliPhone}`}
              className="mt-1.5 block text-[16px] font-medium text-[var(--foreground)] underline underline-offset-2 hover:opacity-80"
            >
              {family.waliPhone || "—"}
            </a>
          </div>
          {family.waliEmail && (
            <div className="rounded-xl bg-[var(--color-dark-08)] p-4 sm:col-span-2">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-dark-56)]">
                Email
              </p>
              <a
                href={`mailto:${family.waliEmail}`}
                className="mt-1.5 block text-[16px] font-medium text-[var(--foreground)] underline underline-offset-2 hover:opacity-80"
              >
                {family.waliEmail}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── State: Invitation pending (I sent it) ───
  if (inviteStatus === "pending" && inviteDirection === "sent") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-amber-100">
            <Clock className="size-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--foreground)]">
              Invitation Sent
            </h3>
            <p className="text-[14px] text-[var(--color-dark-56)]">
              Waiting for {profileName}&apos;s family to respond. Wali contact will
              be unlocked if accepted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── State: Invitation pending (I received it) ───
  if (inviteStatus === "pending" && inviteDirection === "received") {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border-2 p-6"
        style={{ borderColor: "var(--button-gold-mid)" }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background: "linear-gradient(90deg, var(--button-gold-light), var(--button-gold-mid), var(--button-gold-dark), var(--button-gold-mid), var(--button-gold-light))",
          }}
        />
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(180deg, var(--button-gold-light), var(--button-gold-dark))",
              color: "var(--button-gold-text)",
            }}
          >
            <Send className="size-5" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--foreground)]">
              {profileName}&apos;s family is interested
            </h3>
            <p className="text-[14px] text-[var(--color-dark-56)]">
              Accept to unlock each other&apos;s Wali contact details
            </p>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => onRespond("accept")}
            disabled={respondingInvite}
            className={cn(
              goldButtonClass,
              "inline-flex h-11 items-center gap-2 rounded-full px-6 text-[14px] font-semibold disabled:opacity-50"
            )}
          >
            {respondingInvite ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
            Accept Invitation
          </button>
          <button
            onClick={() => onRespond("decline")}
            disabled={respondingInvite}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--color-dark-18)] px-6 text-[14px] font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--color-dark-08)] disabled:opacity-50"
          >
            <XCircle className="size-4" />
            Decline
          </button>
        </div>
      </div>
    );
  }

  // ─── State: Declined ───
  if (inviteStatus === "declined") {
    return (
      <div className="rounded-2xl border border-[var(--color-dark-12)] bg-[var(--color-dark-04,rgba(30,58,95,0.04))] p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
            <XCircle className="size-5 text-gray-500" />
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-[var(--foreground)]">
              Invitation Declined
            </h3>
            <p className="text-[14px] text-[var(--color-dark-56)]">
              {inviteDirection === "sent"
                ? "This invitation was not accepted."
                : "You declined this invitation."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── State: No invitation yet — show Send Invitation CTA ───
  return (
    <div
      className="relative overflow-hidden rounded-2xl border-2 p-6"
      style={{ borderColor: "var(--button-gold-mid)" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: "linear-gradient(90deg, var(--button-gold-light), var(--button-gold-mid), var(--button-gold-dark), var(--button-gold-mid), var(--button-gold-light))",
        }}
      />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(180deg, var(--button-gold-light), var(--button-gold-dark))",
              color: "var(--button-gold-text)",
            }}
          >
            <Lock className="size-5" />
          </div>
          <div>
            <h3 className="text-[18px] font-bold text-[var(--foreground)]">
              Interested in this profile?
            </h3>
            <p className="mt-0.5 text-[14px] text-[var(--color-dark-56)]">
              Send an invitation. If accepted, both families&apos; Wali contacts will be unlocked.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          {invitesLeft > 0 ? (
            <button
              onClick={onSendInvite}
              disabled={sendingInvite}
              className={cn(
                goldButtonClass,
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-6 text-[14px] font-semibold disabled:opacity-50"
              )}
            >
              {sendingInvite ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send Invitation
            </button>
          ) : (
            <Link
              href="/dashboard/payment"
              className={cn(
                goldButtonClass,
                "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-6 text-[14px] font-semibold"
              )}
            >
              <Crown className="size-4" />
              Get More Invites
            </Link>
          )}
          <p className="text-[12px] text-[var(--color-dark-56)]">
            {invitesLeft > 0
              ? `${invitesLeft} invitation${invitesLeft !== 1 ? "s" : ""} remaining`
              : "No invitations remaining"}
          </p>
        </div>
      </div>

      {inviteError && (
        <p className="mt-3 text-[13px] font-medium text-red-600">{inviteError}</p>
      )}

      {/* Blurred preview */}
      {hasWali && (
        <div className="mt-5 select-none" aria-hidden>
          <div className="grid gap-4 sm:grid-cols-2" style={{ filter: "blur(6px)" }}>
            <div className="rounded-xl bg-[var(--color-dark-08)] p-3">
              <p className="text-[12px] text-[var(--color-dark-56)]">Name & Relationship</p>
              <p className="mt-1 text-[15px] font-medium text-[var(--foreground)]">
                ██████ ████████ · {family.waliRelationship || "Father"}
              </p>
            </div>
            <div className="rounded-xl bg-[var(--color-dark-08)] p-3">
              <p className="text-[12px] text-[var(--color-dark-56)]">Phone Number</p>
              <p className="mt-1 text-[15px] font-medium text-[var(--foreground)]">
                +█ (███) ███-████
              </p>
            </div>
          </div>
        </div>
      )}
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
