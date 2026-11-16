"use client";

import React, { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { useLab } from "@/context/LabContext";
import type { LabData } from "@/data/labData";
import type { PatchFn } from "./fields";
import { GeneralTab } from "./tabs/GeneralTab";
import { HeroTab } from "./tabs/HeroTab";
import { PillarsTab } from "./tabs/PillarsTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { PublicationsTab } from "./tabs/PublicationsTab";
import { InfrastructureTab } from "./tabs/InfrastructureTab";
import { TeamTab } from "./tabs/TeamTab";
import { ContactTab } from "./tabs/ContactTab";
import { CustomSectionsTab } from "./tabs/CustomSectionsTab";

type TabId =
  | "general"
  | "hero"
  | "pillars"
  | "projects"
  | "publications"
  | "infrastructure"
  | "team"
  | "contact"
  | "extra";

const TABS: { id: TabId; label: string }[] = [
  { id: "general", label: "Encabezado y menú" },
  { id: "hero", label: "Hero principal" },
  { id: "pillars", label: "Áreas de investigación" },
  { id: "projects", label: "Proyectos" },
  { id: "publications", label: "Publicaciones" },
  { id: "infrastructure", label: "Infraestructura" },
  { id: "team", label: "Equipo" },
  { id: "contact", label: "Contacto y pie" },
  { id: "extra", label: "Secciones Extra" },
];

function cloneData(data: LabData): LabData {
  return JSON.parse(JSON.stringify(data)) as LabData;
}

export function AdminDrawer() {
  // Todos los hooks se llaman siempre y en el mismo orden, antes de cualquier return.
  const {
    labData,
    isAdmin,
    adminPanelOpen,
    closeAdminPanel,
    updateLabData,
    resetToDefaults,
  } = useLab();

  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [draft, setDraft] = useState<LabData | null>(null);
  const [baseline, setBaseline] = useState("");
  const [version, setVersion] = useState(0);
  const [saving, setSaving] = useState(false);

  const open = isAdmin && adminPanelOpen;
  const dirty = draft !== null && JSON.stringify(draft) !== baseline;

  // El borrador se crea al abrir el panel y se descarta al cerrarlo.
  useEffect(() => {
    if (!open) {
      if (draft !== null) setDraft(null);
      return;
    }
    if (labData && draft === null) {
      const copy = cloneData(labData);
      setDraft(copy);
      setBaseline(JSON.stringify(copy));
      setVersion((v) => v + 1);
    }
  }, [open, labData, draft]);

  const requestClose = useCallback(() => {
    if (dirty && !window.confirm("Tienes cambios sin guardar. ¿Cerrar de todos modos?")) {
      return;
    }
    closeAdminPanel();
  }, [dirty, closeAdminPanel]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, requestClose]);

  if (!open || !labData || !draft) return null;

  const patch: PatchFn = (key, value) => {
    setDraft((current) => {
      if (!current) return current;
      const next =
        typeof value === "function"
          ? (value as (prev: LabData[typeof key]) => LabData[typeof key])(current[key])
          : value;
      return { ...current, [key]: next } as LabData;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLabData(draft);
      setBaseline(JSON.stringify(draft));
    } catch {
      // updateLabData ya muestra el mensaje de error.
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (!dirty) return;
    if (!window.confirm("¿Descartar todos los cambios sin guardar?")) return;
    setDraft(null); // el efecto vuelve a clonar los datos guardados
  };

  const handleReset = async () => {
    const ok = window.confirm(
      "Esto borra TODO lo que has editado y regresa el sitio a los valores originales. ¿Continuar?"
    );
    if (!ok) return;
    try {
      await resetToDefaults();
      setDraft(null);
    } catch {
      // El mensaje de error ya se muestra.
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Panel de Administración"
    >
      <div className="bg-ug-navy text-white px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-montserrat font-bold text-lg sm:text-xl tracking-tight">
            Editor del sitio LISB-UG
          </h2>
          <p className="text-xs text-white/70">
            {dirty ? "Tienes cambios sin guardar" : "Todo está guardado"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDiscard}
            disabled={!dirty || saving}
            className="px-3 py-2 border border-white/30 text-white text-sm font-semibold rounded hover:bg-white/10 transition-colors disabled:opacity-40"
          >
            Descartar
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || saving}
            className="px-4 py-2 bg-ug-gold text-ug-navy text-sm font-bold rounded hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          <button
            onClick={requestClose}
            className="p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar editor"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto bg-white border-b border-slate-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-ug-gold text-ug-navy"
                : "border-transparent text-ug-text-secondary hover:text-ug-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div key={version} className="max-w-5xl mx-auto">
          {activeTab === "general" && <GeneralTab data={draft} patch={patch} />}
          {activeTab === "hero" && <HeroTab data={draft} patch={patch} />}
          {activeTab === "pillars" && <PillarsTab data={draft} patch={patch} />}
          {activeTab === "projects" && <ProjectsTab data={draft} patch={patch} />}
          {activeTab === "publications" && <PublicationsTab data={draft} patch={patch} />}
          {activeTab === "infrastructure" && (
            <InfrastructureTab data={draft} patch={patch} />
          )}
          {activeTab === "team" && <TeamTab data={draft} patch={patch} />}
          {activeTab === "contact" && <ContactTab data={draft} patch={patch} />}
          {activeTab === "extra" && <CustomSectionsTab data={draft} patch={patch} />}

          <div className="mt-10 pt-6 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="text-sm text-red-600 hover:text-red-700 underline underline-offset-2"
            >
              Restaurar el sitio a los valores originales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}