import fs from "fs/promises";
import path from "path";

import { labData as seedData } from "../../data/labData";

interface LabData {
  pillars: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    badgeLabel: string;
    color: string;
  }>;
  projects: Array<{
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    area: "robotica" | "electronica" | "neurociencia";
    tags: string[];
    status: "activo" | "completado" | "en-desarrollo";
    objectives?: string[];
    hardwareArchitecture?: string;
    softwareArchitecture?: string;
    participants?: string[];
  }>;
  publications: Array<{
    id: string;
    title: string;
    authors: string[];
    journal: string;
    year: number;
    doi: string;
    abstract: string;
    area: "robotica" | "electronica" | "neurociencia";
    image?: string;
  }>;
  infrastructure: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    equipment: string[];
    area: "robotica" | "electronica" | "neurociencia" | "compartido";
  }>;
  team: Array<{
    id: string;
    name: string;
    role: string;
    area: "robotica" | "electronica" | "neurociencia" | "direccion";
    image: string;
    email: string;
    bio: string;
    researchLines: string[];
  }>;
  images: {
    logo: string;
    hero: string;
    default: string;
  };
}

const STORAGE_DIR = path.resolve(process.cwd(), "src/server/storage");
const DB_PATH = path.resolve(STORAGE_DIR, "db.json");

async function ensureStorageDir(): Promise<void> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
}

async function readDb(): Promise<LabData> {
  await ensureStorageDir();
  try {
    const content = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(content) as LabData;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      await writeDb(seedData);
      return JSON.parse(JSON.stringify(seedData)) as LabData;
    }
    throw err;
  }
}

async function writeDb(data: LabData): Promise<void> {
  await ensureStorageDir();
  const json = JSON.stringify(data, null, 2);
  await fs.writeFile(DB_PATH, json, "utf-8");
}

export class LabRepository {
  async getAll(): Promise<LabData> {
    return readDb();
  }

  async update(partial: Partial<LabData>): Promise<LabData> {
    const current = await readDb();
    const updated = { ...current, ...partial };
    await writeDb(updated);
    return updated;
  }

  async reset(): Promise<LabData> {
    await writeDb(JSON.parse(JSON.stringify(seedData)) as LabData);
    return JSON.parse(JSON.stringify(seedData)) as LabData;
  }
}

export const labRepository = new LabRepository();