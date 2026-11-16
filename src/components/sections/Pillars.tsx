"use client";

import React from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { useLab } from "@/context/LabContext";

export function Pillars() {
  const { labData, loading } = useLab();

  if (loading || !labData) {
    return <p className="text-center py-20">Cargando áreas de investigación...</p>;
  }

  const heading = labData.sections.pillars;

  return (
    <section id="investigacion" className="bg-ug-light py-20 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={heading.title} subtitle={heading.subtitle} />
        {labData.pillars.length === 0 ? (
          <p className="text-center text-ug-text-secondary py-12">
            Próximamente se publicarán las áreas de investigación.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {labData.pillars.map((pillar) => {
              const lines = pillar.lines ?? [];
              const tags = pillar.tags ?? [];
              return (
                <article
                  key={pillar.id}
                  className="relative group bg-white border-t-4 border-ug-gold rounded-xl overflow-hidden transition-all duration-300 hover:border-ug-navy hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative aspect-video">
                    <LabImageSlot
                      src={pillar.image}
                      alt={`Imagen de ${pillar.name}`}
                      aspectRatio="video"
                      placeholderLabel={`Fotografía representativa de ${pillar.name}`}
                      className="w-full h-full object-cover"
                    />
                    {pillar.badgeLabel && (
                      <span
                        className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
                        style={{ backgroundColor: pillar.color || "#002E5D" }}
                      >
                        {pillar.badgeLabel}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-montserrat text-xl font-bold text-ug-navy mb-3 leading-tight group-hover:text-ug-institutional transition-colors">
                      {pillar.name}
                    </h3>
                    <p className="text-ug-text-secondary text-sm leading-relaxed mb-5">
                      {pillar.description}
                    </p>
                    {lines.length > 0 && (
                      <>
                        <h4 className="text-xs font-semibold text-ug-gold uppercase tracking-wider mb-3">
                          Líneas de investigación
                        </h4>
                        <ul className="space-y-2 mb-6">
                          {lines.map((line, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-ug-text text-sm"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ug-gold shrink-0" />
                              {line}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                          <Badge key={idx} variant={idx === 0 ? "tech" : "outline"}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}