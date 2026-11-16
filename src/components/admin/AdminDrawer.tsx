"use client";

import React, { useState, useEffect } from "react";
import { useLab } from "@/context/LabContext";
import { ImageUploaderField } from "./ImageUploaderField";
import { Badge } from "@/components/ui/Badge";
import { X } from "lucide-react";
import type { LabData } from "@/services/labApiClient";

type Tab =
  | "general"
  | "pillars"
  | "projects"
  | "publications"
  | "infrastructure"
  | "team";

const TABS: { id: Tab; label: string }[] = [
  { id: "general", label: "General y Hero" },
  { id: "pillars", label: "Áreas (Pilares)" },
  { id: "projects", label: "Proyectos" },
  { id: "publications", label: "Publicaciones" },
  { id: "infrastructure", label: "Infraestructura" },
  { id: "team", label: "Equipo" },
];

interface TabProps {
  labData: LabData;
  save: (data: Partial<LabData>) => void;
}

const inputClass =
  "w-full px-2 py-1 rounded border border-ug-light text-sm text-ug-text";
const labelClass = "text-xs font-semibold text-ug-gold uppercase";
const cardClass =
  "bg-white border border-ug-light rounded-xl p-6 hover:border-ug-gold transition-colors";

export function AdminDrawer() {
  // ⚠️ Todos los hooks se llaman siempre y en el mismo orden. Antes había un
  // `if (typeof window === "undefined") return null;` ANTES de los hooks, lo
  // que provoca "Invalid hook call" / "Rendered more hooks…" y mismatch de
  // hidratación. En el servidor `isAdmin` es false, así que este componente
  // ya devuelve null sin necesidad de ese guard.
  const { labData, isAdmin, adminPanelOpen, closeAdminPanel, updateLabData } =
    useLab();
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const open = isAdmin && adminPanelOpen;

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAdminPanel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeAdminPanel]);

  if (!open || !labData) return null;

  // updateLabData ya muestra un toast si falla; evitamos rechazos sin capturar.
  const save = (data: Partial<LabData>) => {
    updateLabData(data).catch(() => {});
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-white shadow-2xl flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Panel de Administración"
    >
      <div className="bg-ug-navy text-white px-6 py-4 flex items-center justify-between">
        <h2 className="font-montserrat font-bold text-xl tracking-tight">
          Panel de Administración LISB-UG
        </h2>
        <button
          onClick={closeAdminPanel}
          className="text-white/70 hover:text-white transition-colors"
          aria-label="Cerrar panel"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex overflow-x-auto pb-2 border-b border-ug-light/50 scrollbar-hidden -mb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === tab.id
                ? "border-ug-gold text-ug-navy"
                : "border-transparent text-ug-text-secondary hover:text-ug-navy"
            } whitespace-nowrap`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "general" && <GeneralTab labData={labData} save={save} />}
        {activeTab === "pillars" && <PillarsTab labData={labData} save={save} />}
        {activeTab === "projects" && <ProjectsTab labData={labData} save={save} />}
        {activeTab === "publications" && (
          <PublicationsTab labData={labData} save={save} />
        )}
        {activeTab === "infrastructure" && (
          <InfrastructureTab labData={labData} save={save} />
        )}
        {activeTab === "team" && <TeamTab labData={labData} save={save} />}
      </div>
    </div>
  );
}

function GeneralTab({ labData, save }: TabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-montserrat font-bold text-lg text-ug-navy mb-4">
          Configuración Hero
        </h3>
        <ImageUploaderField
          value={labData.images.hero}
          onChange={(url) => save({ images: { ...labData.images, hero: url } })}
          label="Imagen Principal del Hero"
          aspectRatio="video"
          placeholderLabel="Fotografía principal del laboratorio"
        />
      </div>
    </div>
  );
}

function PillarsTab({ labData, save }: TabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-montserrat font-bold text-lg text-ug-navy mb-4">
          Áreas de Investigación
        </h3>
        <p className="text-ug-text-secondary text-sm mb-6">
          Edita las descripciones, sub-líneas y fotos de cada pilar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {labData.pillars.map((pillar) => (
            <div key={pillar.id} className={cardClass}>
              <div className="mb-4">
                <ImageUploaderField
                  value={pillar.image}
                  onChange={(url) =>
                    save({
                      pillars: labData.pillars.map((p) =>
                        p.id === pillar.id ? { ...p, image: url } : p
                      ),
                    })
                  }
                  label={pillar.name}
                  aspectRatio="video"
                  placeholderLabel={`Fotografía de ${pillar.name}`}
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={labelClass}>Nombre</label>
                  <input
                    type="text"
                    defaultValue={pillar.name}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Descripción</label>
                  <textarea
                    defaultValue={pillar.description}
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <div className="flex gap-2">
                  <Badge variant="tech" className="text-xs">
                    {pillar.badgeLabel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {pillar.color}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectsTab({ labData, save }: TabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-montserrat font-bold text-lg text-ug-navy mb-4">
          Proyectos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labData.projects.map((project) => (
            <div key={project.id} className={cardClass}>
              <div className="mb-4">
                <ImageUploaderField
                  value={project.image}
                  onChange={(url) =>
                    save({
                      projects: labData.projects.map((p) =>
                        p.id === project.id ? { ...p, image: url } : p
                      ),
                    })
                  }
                  label={project.title}
                  aspectRatio="video"
                  placeholderLabel={`Fotografía de ${project.title}`}
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={labelClass}>Título</label>
                  <input
                    type="text"
                    defaultValue={project.title}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Área</label>
                  <select defaultValue={project.area} className={inputClass}>
                    <option value="robotica">Robótica</option>
                    <option value="electronica">Electrónica</option>
                    <option value="neurociencia">Neurociencia</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Estado</label>
                  <select defaultValue={project.status} className={inputClass}>
                    <option value="activo">Activo</option>
                    <option value="completado">Completado</option>
                    <option value="en-desarrollo">En Desarrollo</option>
                  </select>
                </div>
                <Badge variant="tech" className="text-xs mb-2">
                  {project.status}
                </Badge>
                <div className="space-y-1">
                  <label className={labelClass}>Descripción</label>
                  <textarea
                    defaultValue={project.description}
                    rows={3}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PublicationsTab({ labData }: TabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-montserrat font-bold text-lg text-ug-navy mb-4">
          Publicaciones Científicas
        </h3>
        <div className="space-y-6">
          {labData.publications.map((pub) => (
            <div key={pub.id} className={cardClass}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded bg-ug-navy flex items-center justify-center text-white text-xs font-bold">
                  {pub.year}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="space-y-1">
                    <label className={labelClass}>Título</label>
                    <input
                      type="text"
                      defaultValue={pub.title}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Autores</label>
                    <input
                      type="text"
                      defaultValue={pub.authors.join(", ")}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>Revista / Congreso</label>
                    <input
                      type="text"
                      defaultValue={pub.journal}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={labelClass}>DOI</label>
                    <input
                      type="text"
                      defaultValue={pub.doi}
                      className={inputClass}
                    />
                  </div>
                  <Badge variant="tech" className="text-xs">
                    {pub.area}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfrastructureTab({ labData, save }: TabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-montserrat font-bold text-lg text-ug-navy mb-4">
          Infraestructura y Equipamiento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labData.infrastructure.map((infra) => (
            <div key={infra.id} className={cardClass}>
              <div className="mb-4">
                <ImageUploaderField
                  value={infra.image}
                  onChange={(url) =>
                    save({
                      infrastructure: labData.infrastructure.map((i) =>
                        i.id === infra.id ? { ...i, image: url } : i
                      ),
                    })
                  }
                  label={infra.name}
                  aspectRatio="video"
                  placeholderLabel={`Fotografía de ${infra.name}`}
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={labelClass}>Nombre</label>
                  <input
                    type="text"
                    defaultValue={infra.name}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Descripción</label>
                  <textarea
                    defaultValue={infra.description}
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>
                    Equipo (separado por comas)
                  </label>
                  <textarea
                    defaultValue={infra.equipment.join(", ")}
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <Badge variant="outline" className="text-xs">
                  {infra.area}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamTab({ labData, save }: TabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-montserrat font-bold text-lg text-ug-navy mb-4">
          Equipo de Investigación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labData.team.map((member) => (
            <div key={member.id} className={cardClass}>
              <div className="mb-4">
                <ImageUploaderField
                  value={member.image}
                  onChange={(url) =>
                    save({
                      team: labData.team.map((t) =>
                        t.id === member.id ? { ...t, image: url } : t
                      ),
                    })
                  }
                  label={member.name}
                  aspectRatio="square"
                  placeholderLabel={`Retrato de ${member.name}`}
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className={labelClass}>Nombre</label>
                  <input
                    type="text"
                    defaultValue={member.name}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Rol</label>
                  <input
                    type="text"
                    defaultValue={member.role}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    defaultValue={member.email}
                    className={inputClass}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>
                    Líneas de Investigación (separado por comas)
                  </label>
                  <textarea
                    defaultValue={member.researchLines.join(", ")}
                    rows={3}
                    className={inputClass}
                  />
                </div>
                <Badge variant="outline" className="text-xs">
                  {member.area}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}