// Utilidades compartidas (sin hooks, seguras para servidor y cliente).
import type {
  CustomCardItem,
  CustomSection,
  LabData,
  TeamLevel,
} from "@/data/labData";

export interface AreaOption {
  value: string;
  label: string;
}

export const SHARED_AREA: AreaOption = { value: "compartido", label: "Compartido" };
export const DIRECTION_AREA: AreaOption = { value: "direccion", label: "Dirección" };

export const TEAM_LEVELS: { value: TeamLevel; label: string }[] = [
  { value: "investigadores", label: "Investigadores y profesores" },
  { value: "posgrado", label: "Posgrado (tesis / investigación)" },
  { value: "licenciatura", label: "Licenciatura (tesis / servicio social)" },
];

const SPECIAL_AREAS: Record<string, { label: string; color: string }> = {
  compartido: { label: "Compartido", color: "#B38E5D" },
  direccion: { label: "Dirección", color: "#002E5D" },
};

export const DEFAULT_AREA_COLOR = "#002E5D";

export function getAreaLabel(data: LabData, areaId: string): string {
  const pillar = data.pillars.find((p) => p.id === areaId);
  if (pillar) return pillar.badgeLabel || pillar.name;
  return SPECIAL_AREAS[areaId]?.label ?? "General";
}

export function getAreaColor(data: LabData, areaId: string): string {
  const pillar = data.pillars.find((p) => p.id === areaId);
  if (pillar) return pillar.color || DEFAULT_AREA_COLOR;
  return SPECIAL_AREAS[areaId]?.color ?? DEFAULT_AREA_COLOR;
}

export function getAreaOptions(
  data: LabData,
  extras: AreaOption[] = []
): AreaOption[] {
  return [
    ...data.pillars.map((p) => ({ value: p.id, label: p.badgeLabel || p.name })),
    ...extras,
  ];
}

export function isExternalLink(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function createCustomCard(): CustomCardItem {
  return {
    id: newId("tarjeta"),
    title: "Nueva tarjeta",
    subtitle: "",
    description: "",
    image: "",
    bullets: [],
    buttonLabel: "",
    buttonHref: "",
  };
}

export function createCustomSection(): CustomSection {
  return {
    id: newId("seccion"),
    visible: true,
    navLabel: "",
    layoutType: "editorial",
    title: "Nueva sección",
    subtitle: "",
    intro: "",
    paragraphs: ["Escribe aquí el contenido de la sección."],
    bullets: [],
    image: "",
    imagePosition: "right",
    buttonLabel: "",
    buttonHref: "",
    background: "white",
    cards: [],
  };
}