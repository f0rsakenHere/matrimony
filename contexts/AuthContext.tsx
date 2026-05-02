"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { EMPTY_BIODATA } from "@/lib/types/biodata";
import type { BiodataSection } from "@/lib/types/biodata";

export type { BiodataSection };

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
  user: User | null;
  loading: boolean;
  profile: ProfileData | null;
  refreshProfile: () => Promise<void>;
  getAuthHeaders: () => Promise<Record<string, string>>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ isNewUser: boolean }>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ isNewUser: boolean }>;
  signInWithGoogle: () => Promise<{ isNewUser: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function getAuthHeadersForUser(
  firebaseUser: User
): Promise<Record<string, string>> {
  const token = await firebaseUser.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function syncUserToMongo(
  firebaseUser: User,
  provider: "email" | "google"
): Promise<{ isNewUser: boolean }> {
  const headers = await getAuthHeadersForUser(firebaseUser);
  const res = await fetch("/api/auth/sync", {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      provider,
    }),
  });
  const data = await res.json();
  return { isNewUser: data.isNewUser ?? false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  async function fetchProfile(firebaseUser: User) {
    try {
      const headers = await getAuthHeadersForUser(firebaseUser);
      const res = await fetch("/api/profile", { headers });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error(`[AuthContext] /api/profile failed: ${res.status}`, body);
        return;
      }
      const data = await res.json();
      const u = data.user;
      if (u) {
        setProfile({
          email: u.email ?? "",
          profileName: u.profileName ?? "",
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          photoURL: u.photoURL,
          isAdmin: u.isAdmin ?? false,
          isPremium: u.isPremium ?? false,
          invitesRemaining: u.invitesRemaining ?? 3,
          biodata: u.biodata
            ? {
                personal: { ...EMPTY_BIODATA.personal, ...u.biodata.personal },
                education: { ...EMPTY_BIODATA.education, ...u.biodata.education },
                family: { ...EMPTY_BIODATA.family, ...u.biodata.family },
                religious: { ...EMPTY_BIODATA.religious, ...u.biodata.religious },
                lifestyle: { ...EMPTY_BIODATA.lifestyle, ...u.biodata.lifestyle },
                aboutMe: u.biodata.aboutMe ?? "",
              }
            : EMPTY_BIODATA,
        });
      }
    } catch (err) {
      console.error("[AuthContext] fetchProfile error:", err);
    }
  }

  async function getAuthHeaders(): Promise<Record<string, string>> {
    if (!user) return {};
    return getAuthHeadersForUser(user);
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signUpWithEmail(
    email: string,
    password: string,
    name: string
  ) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    const syncResult = await syncUserToMongo(result.user, "email");
    // onAuthStateChanged races ahead and fetches profile before the user exists
    // in MongoDB — re-fetch after sync so profile is never null for new users.
    await fetchProfile(result.user);
    return syncResult;
  }

  async function signInWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const syncResult = await syncUserToMongo(result.user, "email");
    // onAuthStateChanged may have already fired and fetched a 404 (if the
    // Mongo record didn't exist yet) — re-fetch after sync so profile is set.
    await fetchProfile(result.user);
    return syncResult;
  }

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const syncResult = await syncUserToMongo(result.user, "google");
    // Same race condition applies for first-time Google sign-in
    await fetchProfile(result.user);
    return syncResult;
  }

  async function logout() {
    await signOut(auth);
    setProfile(null);
  }

  return (
    <AuthContext
      value={{
        user,
        loading,
        profile,
        refreshProfile,
        getAuthHeaders,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
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
