"use client";

import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import type { LabData, LinkItem } from "@/data/labData";
import { newId } from "@/lib/labHelpers";

// ---------------------------------------------------------------------------
// Tipos compartidos por todas las pestañas del editor
// ---------------------------------------------------------------------------

export type PatchFn = <K extends keyof LabData>(
  key: K,
  value: LabData[K] | ((prev: LabData[K]) => LabData[K])
) => void;

export interface TabProps {
  data: LabData;
  patch: PatchFn;
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

export const baseInputClass =
  "min-w-0 px-3 py-2 rounded border border-slate-300 dark:border-ug-line text-sm text-ug-text bg-white dark:bg-ug-slate placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-ug-gold focus:border-ug-gold outline-none";
export const inputClass = `w-full ${baseInputClass}`;

export const PILLAR_COLORS = [
  { value: "#002E5D", label: "Azul marino UG" },
  { value: "#00468B", label: "Azul institucional" },
  { value: "#0284C7", label: "Azul tecnológico" },
  { value: "#B38E5D", label: "Dorado UG" },
];

// ---------------------------------------------------------------------------
// Utilidades de listas (siempre por id, para no editar el elemento equivocado)
// ---------------------------------------------------------------------------

export function updateById<T extends { id: string }>(
  items: T[],
  id: string,
  changes: Partial<T>
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...changes } : item));
}

export function removeById<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter((item) => item.id !== id);
}

export function moveById<T extends { id: string }>(
  items: T[],
  id: string,
  direction: -1 | 1
): T[] {
  const index = items.findIndex((item) => item.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

export function confirmDelete(name: string): boolean {
  return window.confirm(
    `¿Eliminar "${name || "este elemento"}"? El cambio se aplica al guardar.`
  );
}

// ---------------------------------------------------------------------------
// Campos de formulario
// ---------------------------------------------------------------------------

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1 min-w-0">
      <span className="block text-xs font-semibold text-ug-gold dark:text-ug-gold-bright uppercase tracking-wide break-words">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block text-xs text-ug-text-secondary break-words">{hint}</span>
      )}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  type?: "text" | "email" | "number" | "url";
}) {
  return (
    <Field label={label} hint={hint}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={inputClass}
      />
    </Field>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  const known = options.some((o) => o.value === value);
  const finalOptions = known
    ? options
    : [{ value, label: value ? `${value} (no disponible)` : "Sin asignar" }, ...options];
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {finalOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

// Lista de textos editada en un solo cuadro (una por línea o separadas por comas).
// Conserva el texto crudo localmente para que escribir comas o saltos de línea
// no "salte" el cursor. Se reinicia al volver a montarse (cambio de borrador).
export function ListField({
  label,
  value,
  onChange,
  separator = "line",
  rows = 3,
  placeholder,
  hint,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  separator?: "line" | "comma";
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  const [text, setText] = useState(() =>
    value.join(separator === "line" ? "\n" : ", ")
  );

  const parse = (raw: string): string[] =>
    (separator === "line" ? raw.split(/\r?\n/) : raw.split(","))
      .map((item) => item.trim())
      .filter(Boolean);

  return (
    <Field
      label={label}
      hint={hint ?? (separator === "line" ? "Un elemento por línea." : "Separados por comas.")}
    >
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(parse(e.target.value));
        }}
        rows={rows}
        placeholder={placeholder}
        className={inputClass}
      />
    </Field>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-ug-navy dark:bg-ug-gold" : "bg-slate-300 dark:bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
      <div className="min-w-0">
        <span className="block text-sm font-medium text-ug-text break-words">{label}</span>
        {hint && (
          <span className="block text-xs text-ug-text-secondary break-words">{hint}</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contenedores y botones
// ---------------------------------------------------------------------------

export function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-ug-surface border border-slate-200 dark:border-ug-line rounded-xl p-4 sm:p-5 space-y-4 min-w-0">
      <div>
        <h3 className="font-montserrat font-bold text-lg text-ug-navy dark:text-ug-sky-soft break-words">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-ug-text-secondary mt-1 break-words">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`shrink-0 p-2 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
        danger
          ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
          : "text-ug-text-secondary hover:bg-white hover:text-ug-navy dark:hover:bg-ug-surface dark:hover:text-ug-sky-soft"
      }`}
    >
      {children}
    </button>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night text-sm font-semibold rounded hover:bg-ug-institutional dark:hover:bg-ug-gold-bright transition-colors"
    >
      <Plus size={16} strokeWidth={2.5} />
      {label}
    </button>
  );
}

// Tarjeta plegable para cada elemento de una lista (área, proyecto, persona…).
export function ItemCard({
  title,
  subtitle,
  defaultOpen = false,
  extra,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDelete,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  extra?: React.ReactNode;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-ug-surface border border-slate-200 dark:border-ug-line rounded-xl overflow-hidden min-w-0">
      <div className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 bg-ug-light dark:bg-ug-slate">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex-1 min-w-0 flex items-center gap-2 text-left px-1 py-1"
        >
          {open ? (
            <ChevronUp size={16} className="shrink-0 text-ug-navy dark:text-ug-sky-soft" />
          ) : (
            <ChevronDown size={16} className="shrink-0 text-ug-navy dark:text-ug-sky-soft" />
          )}
          <span className="min-w-0">
            <span className="block font-semibold text-ug-navy dark:text-ug-sky-soft text-sm truncate">
              {title || "Sin título"}
            </span>
            {subtitle && (
              <span className="block text-xs text-ug-text-secondary truncate">
                {subtitle}
              </span>
            )}
          </span>
        </button>
        {extra}
        <IconButton label="Subir" onClick={onMoveUp} disabled={!canMoveUp}>
          <ArrowUp size={16} />
        </IconButton>
        <IconButton label="Bajar" onClick={onMoveDown} disabled={!canMoveDown}>
          <ArrowDown size={16} />
        </IconButton>
        <IconButton label="Eliminar" onClick={onDelete} danger>
          <Trash2 size={16} />
        </IconButton>
      </div>
      {open && <div className="p-3 sm:p-4 space-y-4">{children}</div>}
    </div>
  );
}

// Editor de listas de enlaces (barra superior, menú, pie de página).
export function LinkListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: LinkItem[];
  onChange: (updater: (prev: LinkItem[]) => LinkItem[]) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-ug-gold dark:text-ug-gold-bright uppercase tracking-wide">
        {label}
      </span>
      {items.length === 0 && (
        <p className="text-sm text-ug-text-secondary">No hay enlaces.</p>
      )}
      {items.map((item, index) => (
        <div key={item.id} className="flex flex-wrap items-center gap-2">
          <input
            value={item.label}
            onChange={(e) =>
              onChange((prev) => updateById(prev, item.id, { label: e.target.value }))
            }
            placeholder="Texto visible"
            className={`${baseInputClass} flex-1 min-w-[8rem]`}
          />
          <input
            value={item.href}
            onChange={(e) =>
              onChange((prev) => updateById(prev, item.id, { href: e.target.value }))
            }
            placeholder="https://… o #seccion"
            className={`${baseInputClass} flex-1 min-w-[8rem]`}
          />
          <IconButton
            label="Subir"
            disabled={index === 0}
            onClick={() => onChange((prev) => moveById(prev, item.id, -1))}
          >
            <ArrowUp size={16} />
          </IconButton>
          <IconButton
            label="Bajar"
            disabled={index === items.length - 1}
            onClick={() => onChange((prev) => moveById(prev, item.id, 1))}
          >
            <ArrowDown size={16} />
          </IconButton>
          <IconButton
            label="Eliminar enlace"
            danger
            onClick={() => onChange((prev) => removeById(prev, item.id))}
          >
            <Trash2 size={16} />
          </IconButton>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange((prev) => [
            ...prev,
            { id: newId("link"), label: "Nuevo enlace", href: "#" },
          ])
        }
        className="inline-flex items-center gap-1 text-sm font-semibold text-ug-institutional dark:text-ug-sky hover:text-ug-navy dark:hover:text-ug-sky-soft"
      >
        <Plus size={14} strokeWidth={2.5} />
        Agregar enlace
      </button>
    </div>
  );
}