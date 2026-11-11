"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";
import { EMPTY_BIODATA } from "@/lib/types/biodata";
import type { BiodataSection } from "@/lib/types/biodata";

export type { BiodataSection };

/** The signed-in login. Field names kept from the Firebase era. */
export interface AppUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

export interface ProfileData {
  email: string;
  profileName: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  isAdmin: boolean;
  isPremium: boolean;
  invitesRemaining: number;
  biodata: BiodataSection;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  profile: ProfileData | null;
  refreshProfile: () => Promise<void>;
  /** Sessions are cookie-based now; kept so existing fetch calls still work. */
  getAuthHeaders: () => Promise<Record<string, string>>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ isNewUser: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<{ isNewUser: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toProfile(u: Record<string, unknown> & { biodata?: Partial<BiodataSection> }): ProfileData {
  const b = u.biodata;
  return {
    email: (u.email as string) ?? "",
    profileName: (u.profileName as string) ?? "",
    firstName: (u.firstName as string) ?? "",
    lastName: (u.lastName as string) ?? "",
    photoURL: (u.photoURL as string | null) ?? undefined,
    isAdmin: (u.isAdmin as boolean) ?? false,
    isPremium: (u.isPremium as boolean) ?? false,
    invitesRemaining: (u.invitesRemaining as number) ?? 3,
    biodata: b
      ? {
          personal: { ...EMPTY_BIODATA.personal, ...b.personal },
          education: { ...EMPTY_BIODATA.education, ...b.education },
          family: { ...EMPTY_BIODATA.family, ...b.family },
          religious: { ...EMPTY_BIODATA.religious, ...b.religious },
          lifestyle: { ...EMPTY_BIODATA.lifestyle, ...b.lifestyle },
          aboutMe: b.aboutMe ?? "",
        }
      : EMPTY_BIODATA,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileLoadedFor, setProfileLoadedFor] = useState<string | null>(null);

  const sessionUser = session?.user;
  const user = useMemo<AppUser | null>(
    () =>
      sessionUser
        ? {
            uid: sessionUser.id,
            email: sessionUser.email,
            displayName: sessionUser.name || null,
            photoURL: sessionUser.image ?? null,
          }
        : null,
    [sessionUser]
  );
  const uid = user?.uid ?? null;

  const fetchProfile = useCallback(async (forUid: string) => {
    try {
      const res = await fetch("/api/profile", { credentials: "same-origin" });
      if (!res.ok) {
        console.error(`[AuthContext] /api/profile failed: ${res.status}`);
        setProfile(null);
      } else {
        const data = await res.json();
        setProfile(data.user ? toProfile(data.user) : null);
      }
    } catch (err) {
      console.error("[AuthContext] fetchProfile error:", err);
    } finally {
      setProfileLoadedFor(forUid);
    }
  }, []);

  useEffect(() => {
    if (uid) void fetchProfile(uid);
  }, [uid, fetchProfile]);

  const refreshProfile = useCallback(async () => {
    if (uid) await fetchProfile(uid);
  }, [uid, fetchProfile]);

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => ({}), []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, name: string) => {
      const { error } = await authClient.signUp.email({ email, password, name });
      if (error) throw new Error(error.message || "Could not create account");
      await refetch();
      return { isNewUser: true };
    },
    [refetch]
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) throw new Error(error.message || "Invalid email or password");
      await refetch();
      return { isNewUser: false };
    },
    [refetch]
  );

  const logout = useCallback(async () => {
    await authClient.signOut();
    setProfile(null);
    setProfileLoadedFor(null);
    await refetch();
  }, [refetch]);

  // Loading until the session is known and, if signed in, the profile fetched.
  const loading = isPending || (uid !== null && profileLoadedFor !== uid);

  return (
    <AuthContext
      value={{
        user,
        loading,
        profile: uid ? profile : null,
        refreshProfile,
        getAuthHeaders,
        signUpWithEmail,
        signInWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
