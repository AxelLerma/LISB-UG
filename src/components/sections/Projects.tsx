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
    <section id="proyectos" className="bg-white py-20 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={heading.title} subtitle={heading.subtitle} />

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                activeFilter === option.value
                  ? "bg-ug-navy border-ug-navy text-white"
                  : "border-ug-gold/30 text-ug-text hover:border-ug-gold hover:bg-ug-gold/5 hover:text-ug-navy"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-ug-gold transition-all duration-300"
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
                    className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
                    style={{ backgroundColor: getAreaColor(labData, project.area) }}
                  >
                    {getAreaLabel(labData, project.area)}
                  </span>
                  <span className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-ug-navy border border-ug-navy/30">
                    {STATUS_LABELS[project.status] ?? project.status}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-montserrat text-xl font-bold text-ug-navy mb-2 leading-tight group-hover:text-ug-institutional transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-ug-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
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
                    className="w-full py-3 bg-ug-navy text-white text-sm font-semibold rounded-md hover:bg-ug-institutional transition-colors"
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
                <p className="text-ug-institutional font-medium">
                  {selectedProject.subtitle}
                </p>
              )}
              {(selectedProject.objectives ?? []).length > 0 && (
                <div>
                  <h4 className="font-montserrat font-bold text-ug-navy text-lg mb-3">
                    Objetivos
                  </h4>
                  <ul className="space-y-2 text-ug-text text-sm leading-relaxed">
                    {(selectedProject.objectives ?? []).map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ug-gold shrink-0" />
                        {obj}
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
                      <h4 className="font-montserrat font-bold text-ug-navy text-lg mb-3">
                        Arquitectura de Hardware
                      </h4>
                      <p className="text-ug-text text-sm leading-relaxed">
                        {selectedProject.hardwareArchitecture}
                      </p>
                    </div>
                  )}
                  {selectedProject.softwareArchitecture && (
                    <div>
                      <h4 className="font-montserrat font-bold text-ug-navy text-lg mb-3">
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
                  <h4 className="font-montserrat font-bold text-ug-navy text-lg mb-3">
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