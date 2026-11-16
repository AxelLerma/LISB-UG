"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { useLab } from "@/context/LabContext";

const subLines: Record<string, string[]> = {
  robotica: [
    "Locomoción adaptativa",
    "Morfología funcional",
    "Robótica blanda",
    "Control autónomo inspirado en sistemas biológicos",
  ],
  electronica: [
    "Diseño de hardware y PCBs",
    "Instrumentación biomédica",
    "Sensores neuromórficos",
    "Adquisición de señales (EMG/EEG)",
  ],
  neurociencia: [
    "Procesamiento de señales neuronales",
    "Redes neuronales de impulsos (SNN)",
    "Control motor",
    "Interfaces cerebro-máquina (BCI)",
  ],
};

export function Pillars() {
  const { labData, loading } = useLab();

  if (loading || !labData) return <p className="text-center py-20">Cargando pilares...</p>;

  return (
    <section id="investigacion" className="bg-ug-light py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Áreas de Investigación"
          subtitle="Tres pilares fundamentales sustentan el quehacer científico del Laboratorio de Sistemas Bio-inspirados."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {labData.pillars.map((pillar) => {
            const lines = subLines[pillar.id] ?? [];
            return (
              <article
                key={pillar.id}
                className={`relative group bg-white border-t-4 border-ug-gold rounded-xl overflow-hidden transition-all duration-300 hover:border-ug-navy hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="relative aspect-video">
                  <LabImageSlot
                    src={pillar.image}
                    alt={`Imagen de ${pillar.name}`}
                    aspectRatio="video"
                    placeholderLabel={`Fotografía representativa de ${pillar.name}`}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${pillar.color === "#002E5D" ? "bg-ug-navy text-white" : pillar.color === "#00468B" ? "bg-ug-institutional text-white" : "bg-ug-tech text-white"}`}
                  >
                    {pillar.badgeLabel}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-montserrat text-xl font-bold text-ug-navy mb-3 leading-tight group-hover:text-ug-institutional transition-colors">
                    {pillar.name}
                  </h3>
                  <p className="text-ug-text-secondary text-sm leading-relaxed mb-5">
                    {pillar.description}
                  </p>
                  <h4 className="text-xs font-semibold text-ug-gold uppercase tracking-wider mb-3">
                    Líneas de investigación
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {lines.map((line, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-ug-text text-sm"
                      >
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ug-gold shrink-0" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="tech">{pillar.badgeLabel}</Badge>
                    <Badge variant="outline">
                      {pillar.id === "robotica" ? "Autónomo" : pillar.id === "electronica" ? "Embebido" : "Neural"}
                    </Badge>
                    <Badge variant="default">Investigación</Badge>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}