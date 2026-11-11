import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { normalizeBiodata, type BiodataSection } from "@/lib/types/biodata";

/** Everything needed to render a public biodata submission. */
export interface SubmissionForPdf {
  id: string;
  createdAt: Date;
  submitterFirstName: string;
  submitterLastName: string;
  email: string;
  phone: string;
  howHeard: string;
  biodata: BiodataSection;
}

type Row = [label: string, value: string];
type Section = { title: string; rows: Row[] } | { title: string; text: string };

function ageFrom(dob: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return "";
  const now = new Date();
  let age = now.getFullYear() - Number(m[1]);
  const md = (now.getMonth() + 1) * 100 + now.getDate();
  if (md < Number(m[2]) * 100 + Number(m[3])) age--;
  return age > 0 && age < 120 ? String(age) : "";
}

/**
 * The submission as labelled sections. Empty fields are dropped. Shared by
 * the PDF and the HTML email body so both always show the same data.
 */
export function submissionSections(s: SubmissionForPdf): Section[] {
  const b = normalizeBiodata(s.biodata);
  const p = b.personal;
  const age = ageFrom(p.dateOfBirth);
  const keep = (rows: Row[]) => rows.filter(([, v]) => v && v.trim());

  const sections: Section[] = [
    {
      title: "Contact",
      rows: keep([
        ["Name", `${s.submitterFirstName} ${s.submitterLastName}`.trim()],
        ["Email", s.email],
        ["Phone", s.phone],
        ["Heard about us", s.howHeard],
      ]),
    },
    {
      title: "Personal",
      rows: keep([
        ["Gender", p.gender === "Female" ? "Sister (Female)" : p.gender === "Male" ? "Brother (Male)" : p.gender],
        ["Date of birth", age ? `${p.dateOfBirth}  (age ${age})` : p.dateOfBirth],
        ["Marital status", p.maritalStatus],
        ["Height", p.height],
        ["Weight", p.weight ? `${p.weight} kg` : ""],
        ["City", p.city],
        ["Province / State", p.province],
        ["Country", p.country],
        ["Ethnicity", p.ethnicity],
        ["Other ethnicity", p.otherEthnicity],
        ["District (Bangladesh)", p.bangladeshDistrict],
        ["Citizenship status", p.citizenshipStatus],
        ["Health issues", p.healthIssues],
        ["Nationality", p.nationality],
        ["Complexion", p.complexion],
        ["Blood group", p.bloodGroup],
      ]),
    },
    {
      title: "Religious",
      rows: keep([
        ["Hijab", b.religious.hijab],
        ["Prayer routine", b.religious.prayerRoutine],
        ["Sect", b.religious.sect],
        ["Religious history", b.religious.religiousHistory],
        ["Modesty", b.religious.modesty],
        ["Beard", b.religious.beard],
        ["Quran reading", b.religious.quranReading],
        ["Islamic education", b.religious.islamicEducation],
      ]),
    },
    {
      title: "Education & Work",
      rows: keep([
        ["Education level", b.education.educationLevel],
        ["Institution", b.education.institution],
        ["Field of study", b.education.fieldOfStudy],
        ["Occupation", b.education.occupation],
        ["Employer", b.education.employer],
        ["Annual income", b.education.income],
      ]),
    },
    {
      title: "Lifestyle",
      rows: keep([
        ["Languages", b.lifestyle.languages],
        ["Diet", b.lifestyle.diet],
        ["Smoking", b.lifestyle.smoking],
        ["Hobbies", b.lifestyle.hobbies],
      ]),
    },
    {
      title: "Family",
      rows: keep([
        ["Father", b.family.fatherName],
        ["Father's occupation", b.family.fatherOccupation],
        ["Mother", b.family.motherName],
        ["Mother's occupation", b.family.motherOccupation],
        ["Siblings", b.family.siblings],
        ["Family type", b.family.familyType],
        ["Family status", b.family.familyStatus],
      ]),
    },
    {
      title: "Wali",
      rows: keep([
        ["Name", b.family.waliName],
        ["Relationship", b.family.waliRelationship],
        ["Phone", b.family.waliPhone],
        ["Email", b.family.waliEmail],
        ["Receives matches via", b.family.waliContactMethod],
      ]),
    },
    { title: "What I do in life", text: b.aboutMe },
    { title: "What I'm looking for", text: b.lookingFor ?? "" },
  ];

  return sections.filter((sec) => ("rows" in sec ? sec.rows.length > 0 : sec.text.trim()));
}

// ─── PDF rendering ───────────────────────────────────────────────────────────

const PAGE_W = 595.28; // A4
const PAGE_H = 841.89;
const MARGIN = 50;
const LABEL_W = 150;
const GREEN = rgb(0.11, 0.255, 0.227); // #1c413a
const GREY = rgb(0.45, 0.45, 0.45);
const TEXT = rgb(0.13, 0.13, 0.13);
const RULE = rgb(0.85, 0.85, 0.82);

const SMART: Record<string, string> = {
  "‘": "'", "’": "'", "“": '"', "”": '"',
  "–": "-", "—": "-", "…": "...", " ": " ",
};

/**
 * Standard PDF fonts only cover Latin-1. Map common typographic characters and
 * replace anything else (e.g. Bangla script) with "?" — the email body carries
 * the exact text.
 */
function pdfSafe(s: string): string {
  return s
    .replace(/[‘’“”–—… ]/g, (c) => SMART[c])
    .replace(/\r\n?/g, "\n")
    .replace(/\t/g, "  ")
    .replace(/[^\n\x20-\x7E\xA0-\xFF]/g, "?");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const para of pdfSafe(text).split("\n")) {
    let line = "";
    for (const word of para.split(/ +/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) lines.push(line);
      // Hard-break words longer than the column.
      let w = word;
      while (font.widthOfTextAtSize(w, size) > maxWidth) {
        let i = w.length - 1;
        while (i > 1 && font.widthOfTextAtSize(w.slice(0, i), size) > maxWidth) i--;
        lines.push(w.slice(0, i));
        w = w.slice(i);
      }
      line = w;
    }
    lines.push(line);
  }
  return lines;
}

export async function renderSubmissionPdf(s: SubmissionForPdf): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const name = `${s.submitterFirstName} ${s.submitterLastName}`.trim();
  doc.setTitle(pdfSafe(`Biodata - ${name}`));
  doc.setAuthor("BanglaNikahCanada");
  doc.setCreationDate(s.createdAt);

  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;
  const contentW = PAGE_W - MARGIN * 2;

  const ensure = (needed: number) => {
    if (y - needed < MARGIN) {
      page = doc.addPage([PAGE_W, PAGE_H]);
      y = PAGE_H - MARGIN;
    }
  };
  const draw = (t: string, x: number, size: number, font: PDFFont, color = TEXT) =>
    page.drawText(t, { x, y, size, font, color });

  // Header band
  page.drawRectangle({ x: 0, y: PAGE_H - 90, width: PAGE_W, height: 90, color: GREEN });
  page.drawText("BanglaNikahCanada", { x: MARGIN, y: PAGE_H - 45, size: 20, font: bold, color: rgb(0.94, 0.94, 0.89) });
  page.drawText("Biodata Submission", { x: MARGIN, y: PAGE_H - 68, size: 11, font: regular, color: rgb(0.72, 0.83, 0.78) });
  y = PAGE_H - 120;

  draw(pdfSafe(name || "Unnamed"), MARGIN, 18, bold, GREEN);
  y -= 18;
  draw(`Submitted ${s.createdAt.toUTCString()}`, MARGIN, 9, regular, GREY);
  y -= 12;
  draw(`Submission ID ${s.id}`, MARGIN, 9, regular, GREY);
  y -= 10;

  for (const sec of submissionSections(s)) {
    // Keep short table sections on one page; long text may flow.
    const tableH = "rows" in sec ? sec.rows.length * 16 + 50 : 0;
    ensure(tableH && tableH < 300 ? tableH : 60);
    y -= 22;
    draw(pdfSafe(sec.title.toUpperCase()), MARGIN, 10, bold, GREEN);
    y -= 6;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.75, color: RULE });
    y -= 14;

    if ("rows" in sec) {
      for (const [label, value] of sec.rows) {
        const lines = wrap(value, regular, 10, contentW - LABEL_W);
        ensure(lines.length * 13 + 2);
        draw(pdfSafe(label), MARGIN, 9, bold, GREY);
        for (const ln of lines) {
          ensure(13);
          draw(ln, MARGIN + LABEL_W, 10, regular);
          y -= 13;
        }
        y -= 3;
      }
    } else {
      for (const ln of wrap(sec.text, regular, 10, contentW)) {
        ensure(14);
        draw(ln, MARGIN, 10, regular);
        y -= 14;
      }
    }
  }

  // Footer on every page
  const pages = doc.getPages();
  pages.forEach((pg, i) =>
    pg.drawText(`Confidential - BanglaNikahCanada   |   Page ${i + 1} of ${pages.length}`, {
      x: MARGIN,
      y: 25,
      size: 8,
      font: regular,
      color: GREY,
    })
  );

  return doc.save();
}
