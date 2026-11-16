"use client";

import React from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { Badge } from "@/components/ui/Badge";
import { useLab } from "@/context/LabContext";

export function Infrastructure() {
  const { labData, loading } = useLab();

  if (loading || !labData) return <p className="text-center py-20">Cargando infraestructura...</p>;

  return (
    <section id="infraestructura" className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-montserrat text-3xl font-bold text-ug-navy mb-4">
            Infraestructura y Equipamiento
          </h2>
          <p className="text-ug-text-secondary text-lg">
            Laboratorios especializados para el desarrollo de investigación en
            Robótica, Electrónica y Neurociencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {labData.infrastructure.map((infra) => {
            return (
              <article
                key={infra.id}
                className="relative group bg-white border border-ug-light rounded-xl overflow-hidden hover:border-ug-gold transition-all duration-300"
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
                    className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      infra.area === "robotica"
                        ? "bg-ug-navy text-white"
                        : infra.area === "electronica"
                        ? "bg-ug-institutional text-white"
                        : infra.area === "neurociencia"
                        ? "bg-ug-tech text-white"
                        : "bg-ug-light text-ug-navy border border-ug-gold"
                    }`}
                  >
                    {infra.area === "compartido"
                      ? "Compartido"
                      : infra.area === "robotica"
                      ? "Robótica"
                      : infra.area === "electronica"
                      ? "Electrónica"
                      : "Neurociencia"}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-montserrat text-xl font-bold text-ug-navy mb-2">
                    {infra.name}
                  </h3>
                  <p className="text-ug-text-secondary text-sm leading-relaxed mb-5">
                    {infra.description}
                  </p>
                  <h4 className="text-xs font-semibold text-ug-gold uppercase tracking-wider mb-3">
                    Equipamiento
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {infra.equipment.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-ug-text text-sm"
                      >
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-ug-gold shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Badge variant="outline" className="text-xs">
                    {infra.area === "compartido"
                      ? "Uso Compartido"
                      : infra.area === "robotica"
                      ? "Robótica"
                      : infra.area === "electronica"
                      ? "Electrónica"
                      : "Neurociencia"}
                  </Badge>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}