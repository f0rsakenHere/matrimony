import { and, eq, gte, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { escapeLike } from "@/lib/sanitize";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(v: unknown): v is string {
  return typeof v === "string" && UUID_RE.test(v);
}

/**
 * API responses keep the `_id` key the client was written against
 * (it used to be a Mongo ObjectId; now it's the row's uuid).
 */
export function withId<T extends { id: string }>(row: T): T & { _id: string } {
  return { ...row, _id: row.id };
}

/** `biodata -> 'section' ->> 'field'` as a text SQL expression. */
export function bio(column: AnyPgColumn, section: string, field: string): SQL<string> {
  return sql<string>`(${column} -> ${section} ->> ${field})`;
}

/** Case-insensitive substring match. */
export function containsCI(expr: SQL | AnyPgColumn, value: string): SQL {
  return ilike(expr as AnyPgColumn, `%${escapeLike(value)}%`);
}

/** Case-insensitive exact match. */
export function equalsCI(expr: SQL | AnyPgColumn, value: string): SQL {
  return ilike(expr as AnyPgColumn, escapeLike(value));
}

/** Trimmed non-empty text expression. */
function filled(expr: SQL): SQL {
  return sql`coalesce(${expr}, '') <> ''`;
}
function blank(expr: SQL): SQL {
  return sql`coalesce(${expr}, '') = ''`;
}

/**
 * Shared demographic filters used by the admin users list, the admin
 * submissions list and member search. All biodata lives in a jsonb column.
 */
export function biodataFilters(
  column: AnyPgColumn,
  params: URLSearchParams
): SQL[] {
  const conds: SQL[] = [];
  const exact: Array<[string, string, string]> = [
    ["gender", "personal", "gender"],
    ["maritalStatus", "personal", "maritalStatus"],
    ["complexion", "personal", "complexion"],
    ["educationLevel", "education", "educationLevel"],
    ["sect", "religious", "sect"],
    ["prayerRoutine", "religious", "prayerRoutine"],
    ["modesty", "religious", "modesty"],
    ["beard", "religious", "beard"],
    ["diet", "lifestyle", "diet"],
    ["smoking", "lifestyle", "smoking"],
  ];
  for (const [param, section, field] of exact) {
    const v = params.get(param);
    if (v) conds.push(eq(bio(column, section, field), v));
  }

  const country = params.get("country")?.trim();
  if (country) conds.push(equalsCI(bio(column, "personal", "country"), country));
  const city = params.get("city")?.trim();
  if (city) conds.push(containsCI(bio(column, "personal", "city"), city));
  const district = params.get("bangladeshDistrict")?.trim();
  if (district) conds.push(eq(bio(column, "personal", "bangladeshDistrict"), district));

  const hasWali = params.get("hasWali");
  const waliName = bio(column, "family", "waliName");
  const waliPhone = bio(column, "family", "waliPhone");
  if (hasWali === "true") {
    conds.push(and(filled(waliName), filled(waliPhone))!);
  } else if (hasWali === "false") {
    conds.push(or(blank(waliName), blank(waliPhone))!);
  }

  // Age range → DOB bounds. dateOfBirth is a "YYYY-MM-DD" string, so
  // lexical comparison works for complete dates.
  const ageMin = parseInt(params.get("ageMin") ?? "", 10);
  const ageMax = parseInt(params.get("ageMax") ?? "", 10);
  const dob = bio(column, "personal", "dateOfBirth");
  const today = new Date();
  const ymd = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  if (!Number.isNaN(ageMax)) {
    const minDate = new Date(today.getFullYear() - ageMax - 1, today.getMonth(), today.getDate() + 1);
    conds.push(gte(dob, ymd(minDate)));
  }
  if (!Number.isNaN(ageMin)) {
    const maxDate = new Date(today.getFullYear() - ageMin, today.getMonth(), today.getDate());
    conds.push(lte(dob, ymd(maxDate)));
  }

  // Height range — stored like 5'4". Convert to inches in SQL so filtering
  // happens before pagination.
  const parseHeight = (h: string): number | null => {
    const m = h.match(/(\d+)'\s*(\d+)/);
    return m ? parseInt(m[1], 10) * 12 + parseInt(m[2], 10) : null;
  };
  const heightMin = parseHeight(params.get("heightMin") ?? "");
  const heightMax = parseHeight(params.get("heightMax") ?? "");
  if (heightMin !== null || heightMax !== null) {
    const h = bio(column, "personal", "height");
    const inches = sql`(
      (substring(${h} from '^(\\d+)''')::int * 12) +
      coalesce(substring(${h} from '''\\s*(\\d+)')::int, 0)
    )`;
    // Profiles without a parseable height are kept (matches previous behaviour).
    const unparsable = sql`${h} !~ '^\\d+'''`;
    const range: SQL[] = [];
    if (heightMin !== null) range.push(sql`${inches} >= ${heightMin}`);
    if (heightMax !== null) range.push(sql`${inches} <= ${heightMax}`);
    conds.push(sql`(coalesce(${h}, '') = '' or ${unparsable} or (${and(...range)}))`);
  }

  return conds;
}

/**
 * Sisters are only shown to other members once their wali's email is on file
 * (a wali is mandatory for sisters — see lib/wali.ts). Closes the gap where a
 * member saves the Family tab before setting her gender to Female.
 */
export function sisterHasWali(column: AnyPgColumn): SQL {
  return sql`not (coalesce(${bio(column, "personal", "gender")}, '') = 'Female' and coalesce(btrim(${bio(column, "family", "waliEmail")}), '') = '')`;
}
