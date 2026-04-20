/* eslint-disable no-console */
/**
 * Seed script — creates dummy user profiles in MongoDB.
 *
 * Usage:  npx tsx scripts/seed-users.ts
 *
 * Requires MONGODB_URI in .env.local
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import mongoose from "mongoose";
import User from "../models/User";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI not set in .env.local");
  process.exit(1);
}

const DUMMY_USERS = [
  // ─── Female profiles ───
  {
    firebaseUid: "dummy_female_001",
    email: "ayesha.r@example.com",
    provider: "email" as const,
    firstName: "Ayesha",
    lastName: "Rahman",
    profileName: "Ayesha R",
    biodata: {
      personal: {
        dateOfBirth: "1998-03-15",
        gender: "Female",
        maritalStatus: "Never Married",
        height: "5'4\"",
        weight: "125",
        complexion: "Fair",
        bloodGroup: "A+",
        nationality: "Bangladeshi Canadian",
        city: "Toronto",
        country: "Canada",
      },
      education: {
        educationLevel: "Master's",
        institution: "University of Toronto",
        fieldOfStudy: "Public Health",
        occupation: "Healthcare Analyst",
        employer: "Sunnybrook Hospital",
        income: "$75,000 – $100,000",
      },
      family: {
        fatherName: "Abdul Rahman",
        fatherOccupation: "Business Owner",
        motherName: "Fatima Rahman",
        motherOccupation: "Homemaker",
        siblings: "1 brother, 1 sister",
        familyType: "Nuclear",
        familyStatus: "Upper Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Always prays",
        modesty: "Always Wears Hijab",
        quranReading: "Can read Arabic fluently",
        islamicEducation: "Completed basic Islamic studies",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Reading, calligraphy, hiking, volunteering",
        languages: "English, Bengali, Arabic",
      },
      aboutMe:
        "Alhamdulillah, I am a practicing Muslimah who values family, faith, and personal growth. I enjoy spending time with my family, volunteering at the local mosque, and exploring nature. Looking for a spouse who is God-conscious, family-oriented, and has a sense of humor.",
    },
  },
  {
    firebaseUid: "dummy_female_002",
    email: "nusrat.k@example.com",
    provider: "email" as const,
    firstName: "Nusrat",
    lastName: "Khan",
    profileName: "Nusrat K",
    biodata: {
      personal: {
        dateOfBirth: "1996-07-22",
        gender: "Female",
        maritalStatus: "Never Married",
        height: "5'3\"",
        weight: "118",
        complexion: "Medium",
        bloodGroup: "B+",
        nationality: "Bangladeshi Canadian",
        city: "Mississauga",
        country: "Canada",
      },
      education: {
        educationLevel: "Bachelor's",
        institution: "York University",
        fieldOfStudy: "Computer Science",
        occupation: "Software Developer",
        employer: "Shopify",
        income: "$100,000 – $150,000",
      },
      family: {
        fatherName: "Kamal Khan",
        fatherOccupation: "Engineer",
        motherName: "Salma Khan",
        motherOccupation: "Teacher",
        siblings: "2 brothers",
        familyType: "Nuclear",
        familyStatus: "Upper Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Always prays",
        modesty: "Always Wears Hijab",
        quranReading: "Can read Arabic fluently",
        islamicEducation: "Attended weekend Islamic school",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Coding side projects, baking, Islamic lectures, travel",
        languages: "English, Bengali",
      },
      aboutMe:
        "I'm a tech-loving Muslimah who balances deen and dunya. I enjoy building things, learning new skills, and spending weekends with family. Looking for someone who is ambitious, kind, and takes their deen seriously.",
    },
  },
  {
    firebaseUid: "dummy_female_003",
    email: "mariam.h@example.com",
    provider: "email" as const,
    firstName: "Mariam",
    lastName: "Hossain",
    profileName: "Mariam H",
    biodata: {
      personal: {
        dateOfBirth: "1999-11-08",
        gender: "Female",
        maritalStatus: "Never Married",
        height: "5'5\"",
        weight: "130",
        complexion: "Olive",
        bloodGroup: "O+",
        nationality: "Bangladeshi Canadian",
        city: "Vancouver",
        country: "Canada",
      },
      education: {
        educationLevel: "Bachelor's",
        institution: "UBC",
        fieldOfStudy: "Psychology",
        occupation: "Counselor",
        employer: "Vancouver Coastal Health",
        income: "$50,000 – $75,000",
      },
      family: {
        fatherName: "Jamal Hossain",
        fatherOccupation: "Restaurant Owner",
        motherName: "Nasreen Hossain",
        motherOccupation: "Homemaker",
        siblings: "1 sister",
        familyType: "Extended",
        familyStatus: "Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Simply Muslim",
        prayerRoutine: "Occasionally miss Fajr, make up later",
        modesty: "Occasionally Wears Hijab",
        quranReading: "Reads with translation",
        islamicEducation: "",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Journaling, yoga, cooking Bengali food, podcasts",
        languages: "English, Bengali, French",
      },
      aboutMe:
        "I'm a compassionate soul who loves helping people. I work as a counselor and find fulfillment in making a difference. Family is everything to me. Looking for a kind, patient, and emotionally mature partner.",
    },
  },
  {
    firebaseUid: "dummy_female_004",
    email: "tasneem.a@example.com",
    provider: "email" as const,
    firstName: "Tasneem",
    lastName: "Ahmed",
    profileName: "Tasneem A",
    biodata: {
      personal: {
        dateOfBirth: "1997-05-30",
        gender: "Female",
        maritalStatus: "Never Married",
        height: "5'2\"",
        weight: "115",
        complexion: "Fair",
        bloodGroup: "AB+",
        nationality: "Bangladeshi Canadian",
        city: "Ottawa",
        country: "Canada",
      },
      education: {
        educationLevel: "PhD / Doctoral",
        institution: "University of Ottawa",
        fieldOfStudy: "Biomedical Engineering",
        occupation: "Research Scientist",
        employer: "Ottawa Hospital Research Institute",
        income: "$75,000 – $100,000",
      },
      family: {
        fatherName: "Iqbal Ahmed",
        fatherOccupation: "Professor",
        motherName: "Rehana Ahmed",
        motherOccupation: "Pharmacist",
        siblings: "1 brother, 2 sisters",
        familyType: "Nuclear",
        familyStatus: "Upper Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Always prays",
        modesty: "Always Wears Hijab",
        quranReading: "Can read Arabic fluently",
        islamicEducation: "Completed Hifz",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Research, Quran recitation, swimming, gardening",
        languages: "English, Bengali, Arabic, French",
      },
      aboutMe:
        "Alhamdulillah, I'm a Hafiza pursuing a career in biomedical research. I believe in balancing faith, knowledge, and family. Looking for a spouse who values education, is strong in deen, and shares a vision for building a beautiful Muslim family in Canada.",
    },
  },
  {
    firebaseUid: "dummy_female_005",
    email: "sabrina.c@example.com",
    provider: "email" as const,
    firstName: "Sabrina",
    lastName: "Chowdhury",
    profileName: "Sabrina C",
    biodata: {
      personal: {
        dateOfBirth: "2000-01-14",
        gender: "Female",
        maritalStatus: "Never Married",
        height: "5'6\"",
        weight: "135",
        complexion: "Medium",
        bloodGroup: "A-",
        nationality: "Bangladeshi Canadian",
        city: "Calgary",
        country: "Canada",
      },
      education: {
        educationLevel: "Bachelor's",
        institution: "University of Calgary",
        fieldOfStudy: "Business Administration",
        occupation: "Marketing Manager",
        employer: "Self-employed",
        income: "$50,000 – $75,000",
      },
      family: {
        fatherName: "Rafiq Chowdhury",
        fatherOccupation: "Retired Banker",
        motherName: "Ruma Chowdhury",
        motherOccupation: "Homemaker",
        siblings: "2 brothers",
        familyType: "Nuclear",
        familyStatus: "Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Rarely miss prayers, compensate later",
        modesty: "Always Wears Hijab",
        quranReading: "Learning to read",
        islamicEducation: "",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Entrepreneurship, photography, travel, cooking",
        languages: "English, Bengali",
      },
      aboutMe:
        "I'm an entrepreneur at heart with a passion for creativity. I run a small marketing business and love the freedom it gives me. Looking for someone who is supportive, ambitious, and ready to build a life together InshaAllah.",
    },
  },

  // ─── Male profiles ───
  {
    firebaseUid: "dummy_male_001",
    email: "faisal.m@example.com",
    provider: "email" as const,
    firstName: "Faisal",
    lastName: "Mahmud",
    profileName: "Faisal M",
    biodata: {
      personal: {
        dateOfBirth: "1995-09-12",
        gender: "Male",
        maritalStatus: "Never Married",
        height: "5'10\"",
        weight: "170",
        complexion: "Medium",
        bloodGroup: "O+",
        nationality: "Bangladeshi Canadian",
        city: "Toronto",
        country: "Canada",
      },
      education: {
        educationLevel: "Master's",
        institution: "University of Waterloo",
        fieldOfStudy: "Software Engineering",
        occupation: "Senior Software Engineer",
        employer: "Google",
        income: "Above $150,000",
      },
      family: {
        fatherName: "Mahmud Ali",
        fatherOccupation: "Civil Engineer",
        motherName: "Nasima Mahmud",
        motherOccupation: "Homemaker",
        siblings: "1 brother",
        familyType: "Nuclear",
        familyStatus: "Upper Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Always prays",
        modesty: "",
        quranReading: "Can read Arabic fluently",
        islamicEducation: "Weekend Islamic school, regular halaqah attendee",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Basketball, reading Islamic books, coding, hiking",
        languages: "English, Bengali, Arabic",
      },
      aboutMe:
        "Alhamdulillah, I'm a practicing Muslim who strives to grow spiritually and professionally. I love my work in tech but family comes first. Looking for a pious, educated, and kind-hearted partner to build a home filled with love and iman.",
    },
  },
  {
    firebaseUid: "dummy_male_002",
    email: "tariq.i@example.com",
    provider: "email" as const,
    firstName: "Tariq",
    lastName: "Islam",
    profileName: "Tariq I",
    biodata: {
      personal: {
        dateOfBirth: "1994-02-28",
        gender: "Male",
        maritalStatus: "Never Married",
        height: "5'11\"",
        weight: "175",
        complexion: "Brown",
        bloodGroup: "B+",
        nationality: "Bangladeshi Canadian",
        city: "Montreal",
        country: "Canada",
      },
      education: {
        educationLevel: "Bachelor's",
        institution: "McGill University",
        fieldOfStudy: "Finance",
        occupation: "Financial Analyst",
        employer: "RBC",
        income: "$100,000 – $150,000",
      },
      family: {
        fatherName: "Nurul Islam",
        fatherOccupation: "Business Owner",
        motherName: "Shabana Islam",
        motherOccupation: "Doctor",
        siblings: "2 sisters",
        familyType: "Nuclear",
        familyStatus: "Upper Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Always prays",
        modesty: "",
        quranReading: "Can read Arabic fluently",
        islamicEducation: "Completed Hifz as a teenager",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Soccer, Quran recitation, investing, traveling",
        languages: "English, Bengali, French, Arabic",
      },
      aboutMe:
        "I'm a Hafiz working in finance in Montreal. I believe in working hard and giving back to the community. I volunteer at the local mosque on weekends. Looking for a partner who is family-oriented, practicing, and has a warm personality.",
    },
  },
  {
    firebaseUid: "dummy_male_003",
    email: "raihan.s@example.com",
    provider: "email" as const,
    firstName: "Raihan",
    lastName: "Siddique",
    profileName: "Raihan S",
    biodata: {
      personal: {
        dateOfBirth: "1997-06-18",
        gender: "Male",
        maritalStatus: "Never Married",
        height: "5'9\"",
        weight: "160",
        complexion: "Fair",
        bloodGroup: "A+",
        nationality: "Bangladeshi Canadian",
        city: "Edmonton",
        country: "Canada",
      },
      education: {
        educationLevel: "Master's",
        institution: "University of Alberta",
        fieldOfStudy: "Medicine",
        occupation: "Medical Resident",
        employer: "University of Alberta Hospital",
        income: "$75,000 – $100,000",
      },
      family: {
        fatherName: "Shafiq Siddique",
        fatherOccupation: "Pharmacist",
        motherName: "Amina Siddique",
        motherOccupation: "Teacher",
        siblings: "1 brother, 1 sister",
        familyType: "Nuclear",
        familyStatus: "Upper Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Occasionally miss Fajr, make up later",
        modesty: "",
        quranReading: "Reads with translation",
        islamicEducation: "Attended Islamic summer camps",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Cricket, reading, cooking, photography",
        languages: "English, Bengali",
      },
      aboutMe:
        "I'm a medical resident who is passionate about helping people. Despite the busy schedule, I make time for family and faith. Looking for a patient, supportive, and kind partner who understands the demands of a medical career.",
    },
  },
  {
    firebaseUid: "dummy_male_004",
    email: "imran.h@example.com",
    provider: "email" as const,
    firstName: "Imran",
    lastName: "Hassan",
    profileName: "Imran H",
    biodata: {
      personal: {
        dateOfBirth: "1993-12-05",
        gender: "Male",
        maritalStatus: "Never Married",
        height: "6'0\"",
        weight: "180",
        complexion: "Medium",
        bloodGroup: "O-",
        nationality: "Bangladeshi Canadian",
        city: "Brampton",
        country: "Canada",
      },
      education: {
        educationLevel: "Bachelor's",
        institution: "Ryerson University",
        fieldOfStudy: "Mechanical Engineering",
        occupation: "Project Manager",
        employer: "Bombardier",
        income: "$100,000 – $150,000",
      },
      family: {
        fatherName: "Zahid Hassan",
        fatherOccupation: "Retired Government Officer",
        motherName: "Kulsum Hassan",
        motherOccupation: "Homemaker",
        siblings: "3 brothers",
        familyType: "Joint",
        familyStatus: "Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Always prays",
        modesty: "",
        quranReading: "Can read Arabic fluently",
        islamicEducation: "Active dawah volunteer",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Gym, dawah activities, camping, board games",
        languages: "English, Bengali, Urdu",
      },
      aboutMe:
        "I'm an engineer turned project manager who loves building things — both at work and in the community. I'm active in the local Muslim community and enjoy outdoor adventures. Looking for a partner who is practicing, family-oriented, and ready to grow together.",
    },
  },
  {
    firebaseUid: "dummy_male_005",
    email: "yusuf.a@example.com",
    provider: "email" as const,
    firstName: "Yusuf",
    lastName: "Ali",
    profileName: "Yusuf A",
    biodata: {
      personal: {
        dateOfBirth: "1996-08-25",
        gender: "Male",
        maritalStatus: "Never Married",
        height: "5'8\"",
        weight: "155",
        complexion: "Olive",
        bloodGroup: "AB+",
        nationality: "Bangladeshi Canadian",
        city: "Winnipeg",
        country: "Canada",
      },
      education: {
        educationLevel: "Islamic Scholar",
        institution: "Islamic University of Madinah",
        fieldOfStudy: "Islamic Studies",
        occupation: "Imam & Islamic Teacher",
        employer: "Winnipeg Central Mosque",
        income: "$30,000 – $50,000",
      },
      family: {
        fatherName: "Musa Ali",
        fatherOccupation: "Imam",
        motherName: "Halima Ali",
        motherOccupation: "Quran Teacher",
        siblings: "2 brothers, 2 sisters",
        familyType: "Extended",
        familyStatus: "Middle Class",
      },
      religious: {
        religiousHistory: "Muslim Since Birth",
        sect: "Sunni Muslim",
        prayerRoutine: "Always prays",
        modesty: "",
        quranReading: "Can read Arabic fluently",
        islamicEducation: "Graduated from Islamic University of Madinah, Hafiz",
      },
      lifestyle: {
        diet: "Strictly Halal",
        smoking: "Never",
        hobbies: "Teaching, Quran memorization, archery, community service",
        languages: "English, Bengali, Arabic, Urdu",
      },
      aboutMe:
        "I'm a graduate of the Islamic University of Madinah, currently serving as an Imam. I'm passionate about spreading Islamic knowledge and building a strong Muslim community. Looking for a righteous partner who shares a love for the deen and wants to serve the ummah together.",
    },
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected.");

  for (const userData of DUMMY_USERS) {
    const existing = await User.findOne({ firebaseUid: userData.firebaseUid });
    if (existing) {
      console.log(`  Skipping ${userData.profileName} (already exists)`);
      continue;
    }
    await User.create(userData);
    console.log(`  Created ${userData.profileName} (${userData.biodata.personal.gender})`);
  }

  console.log(`\nDone — ${DUMMY_USERS.length} dummy users processed.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
