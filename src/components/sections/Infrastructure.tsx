"use client";

import React from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { Badge } from "@/components/ui/Badge";
import { useLab } from "@/context/LabContext";
import { getAreaColor, getAreaLabel } from "@/lib/labHelpers";

export function Infrastructure() {
  const { labData, loading } = useLab();

  if (loading || !labData) {
    return <p className="text-center py-20">Cargando infraestructura...</p>;
  }

  const heading = labData.sections.infrastructure;

  return (
    <section id="infraestructura" className="bg-white dark:bg-ug-night py-12 md:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-montserrat text-2xl sm:text-3xl font-bold text-ug-navy dark:text-ug-sky-soft mb-4 break-words">
            {heading.title}
          </h2>
          {heading.subtitle && (
            <p className="text-ug-text-secondary text-base sm:text-lg">{heading.subtitle}</p>
          )}
        </div>

        {labData.infrastructure.length === 0 ? (
          <p className="text-center text-ug-text-secondary py-12">
            Próximamente publicaremos nuestras instalaciones.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {labData.infrastructure.map((infra) => {
              const areaLabel = getAreaLabel(labData, infra.area);
              return (
                <article
                  key={infra.id}
                  className="relative group min-w-0 bg-white dark:bg-ug-surface border border-slate-200 dark:border-ug-line rounded-xl overflow-hidden hover:border-ug-gold dark:hover:border-ug-gold-bright transition-all duration-300"
                >
                  <div className="relative aspect-video">
                    <LabImageSlot
                      src={infra.image}
                      alt={`Instalaciones de ${infra.name}`}
                      aspectRatio="video"
                      placeholderLabel={`Fotografía de ${infra.name}`}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute top-4 left-4 z-10 max-w-[80%] truncate px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
                      style={{ backgroundColor: getAreaColor(labData, infra.area) }}
                    >
                      {areaLabel}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-montserrat text-xl font-bold text-ug-navy dark:text-ug-sky-soft mb-2 break-words">
                      {infra.name}
                    </h3>
                    <p className="text-ug-text-secondary text-sm leading-relaxed mb-5 break-words">
                      {infra.description}
                    </p>
                    {infra.equipment.length > 0 && (
                      <>
                        <h4 className="text-xs font-semibold text-ug-gold dark:text-ug-gold-bright uppercase tracking-wider mb-3">
                          Equipamiento
                        </h4>
                        <ul className="space-y-2 mb-6">
                          {infra.equipment.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-ug-text text-sm break-words"
                            >
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ug-gold dark:bg-ug-gold-bright shrink-0" />
                              <span className="min-w-0">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {infra.area === "compartido" ? "Uso Compartido" : areaLabel}
                    </Badge>
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