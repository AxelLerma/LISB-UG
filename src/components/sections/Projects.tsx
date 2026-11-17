"use client";

import React, { useState } from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLab } from "@/context/LabContext";
import { getAreaColor, getAreaLabel } from "@/lib/labHelpers";
import type { LabData } from "@/services/labApiClient";

type Project = LabData["projects"][number];

const STATUS_LABELS: Record<string, string> = {
  activo: "Prototipo funcional",
  completado: "Validado",
  "en-desarrollo": "En desarrollo",
};

export function Projects() {
  // Todos los hooks van SIEMPRE antes de cualquier `return` condicional.
  const { labData, loading } = useLab();
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (loading || !labData) {
    return <p className="text-center py-20">Cargando proyectos...</p>;
  }

  const heading = labData.sections.projects;
  const filterOptions = [
    { label: "Todos", value: "all" },
    ...labData.pillars.map((p) => ({ label: p.badgeLabel || p.name, value: p.id })),
  ];

  const filteredProjects =
    activeFilter === "all"
      ? labData.projects
      : labData.projects.filter((p) => p.area === activeFilter);

  const closeModal = () => setSelectedProject(null);

  return (
    <section id="proyectos" className="bg-white dark:bg-ug-night py-12 md:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={heading.title} subtitle={heading.subtitle} />

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 md:mb-12">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border max-w-full break-words ${
                activeFilter === option.value
                  ? "bg-ug-navy border-ug-navy text-white dark:bg-ug-gold dark:border-ug-gold dark:text-ug-night"
                  : "border-ug-gold/30 text-ug-text hover:border-ug-gold hover:bg-ug-gold/5 hover:text-ug-navy dark:hover:text-ug-gold-bright"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <p className="text-center text-ug-text-secondary py-12">
            No hay proyectos en esta categoría por el momento.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group relative min-w-0 bg-white dark:bg-ug-surface border border-slate-200 dark:border-ug-line rounded-xl overflow-hidden hover:border-ug-gold dark:hover:border-ug-gold-bright transition-all duration-300"
              >
                <div className="relative aspect-video">
                  <LabImageSlot
                    src={project.image}
                    alt={`Imagen del proyecto ${project.title}`}
                    aspectRatio="video"
                    placeholderLabel={`Fotografía del proyecto ${project.title}`}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 max-w-[48%] truncate px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: getAreaColor(labData, project.area) }}
                  >
                    {getAreaLabel(labData, project.area)}
                  </span>
                  <span className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 max-w-[48%] truncate px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-ug-navy border border-ug-navy/30 dark:bg-ug-night/90 dark:text-ug-sky-soft dark:border-ug-line">
                    {STATUS_LABELS[project.status] ?? project.status}
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-montserrat text-xl font-bold text-ug-navy dark:text-ug-sky-soft mb-2 leading-tight group-hover:text-ug-institutional dark:group-hover:text-ug-sky transition-colors break-words">
                    {project.title}
                  </h3>
                  <p className="text-ug-text-secondary text-sm leading-relaxed mb-4 line-clamp-3 break-words">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full py-3 bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night text-sm font-semibold rounded-md hover:bg-ug-institutional dark:hover:bg-ug-gold-bright transition-colors"
                  >
                    Ver ficha técnica
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {selectedProject && (
          <Modal
            isOpen
            onClose={closeModal}
            title={selectedProject.title}
            imageSrc={selectedProject.image}
            imageAlt={`Detalle del proyecto ${selectedProject.title}`}
          >
            <div className="space-y-6">
              {selectedProject.subtitle && (
                <p className="text-ug-institutional dark:text-ug-sky font-medium">
                  {selectedProject.subtitle}
                </p>
              )}
              {(selectedProject.objectives ?? []).length > 0 && (
                <div>
                  <h4 className="font-montserrat font-bold text-ug-navy dark:text-ug-sky-soft text-lg mb-3">
                    Objetivos
                  </h4>
                  <ul className="space-y-2 text-ug-text text-sm leading-relaxed">
                    {(selectedProject.objectives ?? []).map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ug-gold dark:bg-ug-gold-bright shrink-0" />
                        <span className="min-w-0">{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(selectedProject.hardwareArchitecture ||
                selectedProject.softwareArchitecture) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedProject.hardwareArchitecture && (
                    <div>
                      <h4 className="font-montserrat font-bold text-ug-navy dark:text-ug-sky-soft text-lg mb-3">
                        Arquitectura de Hardware
                      </h4>
                      <p className="text-ug-text text-sm leading-relaxed">
                        {selectedProject.hardwareArchitecture}
                      </p>
                    </div>
                  )}
                  {selectedProject.softwareArchitecture && (
                    <div>
                      <h4 className="font-montserrat font-bold text-ug-navy dark:text-ug-sky-soft text-lg mb-3">
                        Arquitectura de Software
                      </h4>
                      <p className="text-ug-text text-sm leading-relaxed">
                        {selectedProject.softwareArchitecture}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {(selectedProject.participants ?? []).length > 0 && (
                <div>
                  <h4 className="font-montserrat font-bold text-ug-navy dark:text-ug-sky-soft text-lg mb-3">
                    Participantes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProject.participants ?? []).map((name, i) => (
                      <Badge key={i} variant="default" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </section>
  );
}