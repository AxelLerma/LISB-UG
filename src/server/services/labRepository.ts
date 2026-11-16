import fs from "fs/promises";
import path from "path";

import { labData as seedData } from "../../data/labData";
import type {
  ContactContent,
  CustomCardItem,
  CustomSection,
  FooterContent,
  HeroContent,
  LabData,
  Pillar,
  SiteSettings,
  TeamLevel,
  TeamMember,
  TeamSectionContent,
} from "../../data/labData";
import {
  createCustomCard,
  createCustomSection,
  newId,
} from "../../lib/labHelpers";

const STORAGE_DIR = path.resolve(process.cwd(), "src/server/storage");
const DB_PATH = path.resolve(STORAGE_DIR, "db.json");

const ALLOWED_KEYS: (keyof LabData)[] = [
  "settings",
  "hero",
  "sections",
  "pillars",
  "projects",
  "publications",
  "infrastructure",
  "team",
  "contact",
  "footer",
  "customSections",
  "images",
];

// Caracteres de Windows-1252 en 0x80-0x9F (para reparar textos con codificación corrupta).
const CP1252_REVERSE: Record<string, number> = {
  "\u20AC": 0x80,
  "\u201A": 0x82,
  "\u0192": 0x83,
  "\u201E": 0x84,
  "\u2026": 0x85,
  "\u2020": 0x86,
  "\u2021": 0x87,
  "\u02C6": 0x88,
  "\u2030": 0x89,
  "\u0160": 0x8a,
  "\u2039": 0x8b,
  "\u0152": 0x8c,
  "\u017D": 0x8e,
  "\u2018": 0x91,
  "\u2019": 0x92,
  "\u201C": 0x93,
  "\u201D": 0x94,
  "\u2022": 0x95,
  "\u2013": 0x96,
  "\u2014": 0x97,
  "\u02DC": 0x98,
  "\u2122": 0x99,
  "\u0161": 0x9a,
  "\u203A": 0x9b,
  "\u0153": 0x9c,
  "\u017E": 0x9e,
  "\u0178": 0x9f,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function strArr(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : fallback;
}

function isTeamLevel(value: unknown): value is TeamLevel {
  return (
    value === "investigadores" || value === "posgrado" || value === "licenciatura"
  );
}

function repairMojibake(value: string): string {
  if (!/[\u00C2\u00C3\u00E2]/.test(value)) return value;
  const bytes: number[] = [];
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code <= 0xff) {
      bytes.push(code);
    } else if (CP1252_REVERSE[ch] !== undefined) {
      bytes.push(CP1252_REVERSE[ch]);
    } else {
      return value;
    }
  }
  try {
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(
      Uint8Array.from(bytes)
    );
    return decoded.length < value.length ? decoded : value;
  } catch {
    return value;
  }
}

function deepRepair(value: unknown): unknown {
  if (typeof value === "string") return repairMojibake(value);
  if (Array.isArray(value)) return value.map(deepRepair);
  if (isRecord(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = deepRepair(item);
    }
    return out;
  }
  return value;
}

function arrayOr<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function objectOr<T extends object>(value: unknown, fallback: T): T {
  return isRecord(value) ? ({ ...fallback, ...value } as T) : fallback;
}

// Sección Equipo: migra los nombres antiguos de campos a los nuevos
// (investigatorsTitle, postgradTitle/Text, undergradTitle/Text).
function normalizeTeamSection(
  raw: unknown,
  base: TeamSectionContent
): TeamSectionContent {
  const r = isRecord(raw) ? raw : {};
  const pick = (key: keyof TeamSectionContent, legacyKey?: string): string => {
    const current = r[key];
    if (typeof current === "string") return current;
    if (legacyKey && typeof r[legacyKey] === "string") return r[legacyKey] as string;
    return base[key];
  };
  return {
    title: pick("title"),
    subtitle: pick("subtitle"),
    investigadoresTitle: pick("investigadoresTitle", "investigatorsTitle"),
    investigadoresEmptyText: pick("investigadoresEmptyText"),
    posgradoTitle: pick("posgradoTitle", "postgradTitle"),
    posgradoEmptyText: pick("posgradoEmptyText", "postgradText"),
    licenciaturaTitle: pick("licenciaturaTitle", "undergradTitle"),
    licenciaturaEmptyText: pick("licenciaturaEmptyText", "undergradText"),
  };
}

function normalizeTeamMember(item: Record<string, unknown>): TeamMember {
  return {
    id: str(item.id, newId("team")),
    name: str(item.name, ""),
    role: str(item.role, ""),
    area: str(item.area, "direccion"),
    level: isTeamLevel(item.level) ? item.level : "investigadores",
    image: str(item.image, ""),
    email: str(item.email, ""),
    scholar: str(item.scholar, ""),
    github: str(item.github, ""),
    linkedin: str(item.linkedin, ""),
    bio: str(item.bio, ""),
    researchLines: strArr(item.researchLines, []),
  };
}

function normalizeCard(item: Record<string, unknown>): CustomCardItem {
  const d = createCustomCard();
  return {
    id: str(item.id, d.id),
    title: str(item.title, ""),
    subtitle: str(item.subtitle, ""),
    description: str(item.description, ""),
    image: str(item.image, ""),
    bullets: strArr(item.bullets, []),
    buttonLabel: str(item.buttonLabel, ""),
    buttonHref: str(item.buttonHref, ""),
  };
}

function normalizeCustomSection(item: Record<string, unknown>): CustomSection {
  const d = createCustomSection();
  return {
    id: str(item.id, d.id),
    visible: typeof item.visible === "boolean" ? item.visible : true,
    navLabel: str(item.navLabel, ""),
    layoutType: item.layoutType === "cards" ? "cards" : "editorial",
    title: str(item.title, ""),
    subtitle: str(item.subtitle, ""),
    intro: str(item.intro, ""),
    paragraphs: strArr(item.paragraphs, []),
    bullets: strArr(item.bullets, []),
    image: str(item.image, ""),
    imagePosition: item.imagePosition === "left" ? "left" : "right",
    buttonLabel: str(item.buttonLabel, ""),
    buttonHref: str(item.buttonHref, ""),
    background: item.background === "light" ? "light" : "white",
    cards: Array.isArray(item.cards)
      ? item.cards.filter(isRecord).map(normalizeCard)
      : [],
  };
}

// Completa datos antiguos con los campos nuevos y repara textos corruptos.
function normalize(raw: unknown): LabData {
  const base = clone(seedData);
  if (!isRecord(raw)) return base;
  const r = deepRepair(raw) as Record<string, unknown>;

  const sec = isRecord(r.sections) ? r.sections : {};
  const hero = objectOr<HeroContent>(r.hero, base.hero);
  if (!Array.isArray(hero.indicators)) hero.indicators = base.hero.indicators;

  const pillars = arrayOr<Pillar>(r.pillars, base.pillars).map((p) => {
    const seedPillar = base.pillars.find((s) => s.id === p.id);
    return {
      ...p,
      lines: Array.isArray(p.lines) ? p.lines : seedPillar?.lines ?? [],
      tags: Array.isArray(p.tags) ? p.tags : seedPillar?.tags ?? [],
    };
  });

  const rawTeam: Record<string, unknown>[] = Array.isArray(r.team)
    ? r.team.filter(isRecord)
    : (base.team as unknown as Record<string, unknown>[]);

  const rawCustom: Record<string, unknown>[] = Array.isArray(r.customSections)
    ? r.customSections.filter(isRecord)
    : [];

  return {
    settings: objectOr<SiteSettings>(r.settings, base.settings),
    hero,
    sections: {
      pillars: objectOr(sec.pillars, base.sections.pillars),
      projects: objectOr(sec.projects, base.sections.projects),
      publications: objectOr(sec.publications, base.sections.publications),
      infrastructure: objectOr(sec.infrastructure, base.sections.infrastructure),
      team: normalizeTeamSection(sec.team, base.sections.team),
    },
    pillars,
    projects: arrayOr(r.projects, base.projects),
    publications: arrayOr(r.publications, base.publications),
    infrastructure: arrayOr(r.infrastructure, base.infrastructure),
    team: rawTeam.map(normalizeTeamMember),
    contact: objectOr<ContactContent>(r.contact, base.contact),
    footer: objectOr<FooterContent>(r.footer, base.footer),
    customSections: rawCustom.map(normalizeCustomSection),
    images: objectOr(r.images, base.images),
  };
}

function isNodeError(err: unknown): err is NodeJS.ErrnoException {
  return typeof err === "object" && err !== null && "code" in err;
}

async function ensureStorageDir(): Promise<void> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
}

async function writeDb(data: LabData): Promise<void> {
  await ensureStorageDir();
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(DB_PATH, json, "utf8");
}

async function backupCorruptFile(raw: string): Promise<void> {
  try {
    const backupPath = path.resolve(STORAGE_DIR, `db.corrupt-${Date.now()}.json`);
    await fs.writeFile(backupPath, raw, "utf8");
  } catch {
    // El respaldo es opcional.
  }
}

async function readDb(): Promise<LabData> {
  await ensureStorageDir();

  let raw: string;
  try {
    raw = await fs.readFile(DB_PATH, "utf8");
  } catch (err: unknown) {
    if (isNodeError(err) && err.code === "ENOENT") {
      const fresh = clone(seedData);
      await writeDb(fresh);
      return fresh;
    }
    throw err;
  }

  const hadBom = raw.charCodeAt(0) === 0xfeff;
  const text = hadBom ? raw.slice(1) : raw;

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    // JSON ilegible: se guarda copia y se regenera limpio en UTF-8.
    await backupCorruptFile(raw);
    const fresh = clone(seedData);
    await writeDb(fresh);
    return fresh;
  }

  const normalized = normalize(parsed);
  const changed =
    hadBom ||
    JSON.stringify(normalized, null, 2) !== JSON.stringify(parsed, null, 2);
  if (changed) {
    await writeDb(normalized);
  }
  return normalized;
}

export class LabRepository {
  async getAll(): Promise<LabData> {
    return readDb();
  }

  async update(partial: Partial<LabData>): Promise<LabData> {
    const current = await readDb();
    const incoming: Record<string, unknown> = {};
    if (isRecord(partial)) {
      for (const key of ALLOWED_KEYS) {
        if (partial[key] !== undefined) incoming[key] = partial[key];
      }
    }
    const updated = normalize({ ...current, ...incoming });
    await writeDb(updated);
    return updated;
  }

  async reset(): Promise<LabData> {
    const fresh = clone(seedData);
    await writeDb(fresh);
    return clone(fresh);
  }
}

export const labRepository = new LabRepository();