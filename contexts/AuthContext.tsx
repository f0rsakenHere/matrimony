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

export interface BiodataSection {
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
  user: User | null;
  loading: boolean;
  profile: ProfileData | null;
  refreshProfile: () => Promise<void>;
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

const EMPTY_BIODATA: BiodataSection = {
  personal: { dateOfBirth: "", gender: "", maritalStatus: "", height: "", weight: "", complexion: "", bloodGroup: "", nationality: "", city: "", country: "" },
  education: { educationLevel: "", institution: "", fieldOfStudy: "", occupation: "", employer: "", income: "" },
  family: { fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "", siblings: "", familyType: "", familyStatus: "", waliName: "", waliRelationship: "", waliPhone: "", waliEmail: "" },
  religious: { religiousHistory: "", sect: "", prayerRoutine: "", modesty: "", quranReading: "", islamicEducation: "" },
  lifestyle: { diet: "", smoking: "", hobbies: "", languages: "" },
  aboutMe: "",
};

async function syncUserToMongo(
  user: User,
  provider: "email" | "google"
): Promise<{ isNewUser: boolean }> {
  const res = await fetch("/api/auth/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uid: user.uid,
      email: user.email,
      photoURL: user.photoURL,
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

  async function fetchProfile(uid: string) {
    try {
      const res = await fetch(`/api/profile?uid=${uid}`);
      if (res.ok) {
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
      }
    } catch {
      // Profile not found — leave as null
    }
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.uid);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid);
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
    await fetchProfile(result.user.uid);
    return syncResult;
  }

  async function signInWithEmail(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const syncResult = await syncUserToMongo(result.user, "email");
    return syncResult;
  }

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider);
    const syncResult = await syncUserToMongo(result.user, "google");
    // Same race condition applies for first-time Google sign-in
    await fetchProfile(result.user.uid);
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
