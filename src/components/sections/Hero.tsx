"use client";

import React from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { useLab } from "@/context/LabContext";

export function Hero() {
  const { labData, loading } = useLab();

  if (loading || !labData) {
    return (
      <section className="bg-ug-light py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-pulse rounded-full bg-ug-light w-12 h-12 mb-4" />
            <p className="text-ug-text-secondary text-sm">Cargando contenidoâ€¦</p>
          </div>
        </div>
      </section>
    );
  }

  const indicators = [
    { label: "Ãreas de InvestigaciÃ³n", value: String(labData.pillars.length) },
    {
      label: "Proyectos Activos",
      value: String(
        labData.projects.filter((p) => p.status === "activo").length
      ),
    },
    { label: "Publicaciones Indexadas", value: String(labData.publications.length) },
  ];

  return (
    <section className="relative bg-ug-light overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#002E5D_1px,transparent_1px),linear-gradient(to_bottom,#002E5D_1px,transparent_1px)] bg-[size:4rem_4rem]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-ug-gold/10 text-ug-navy text-xs font-semibold uppercase tracking-wider rounded-full border border-ug-gold/20">
              UNIVERSIDAD DE GUANAJUATO â€¢ DIVISIÃ“N DE INGENIERÃAS
            </span>
            <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold text-ug-navy leading-tight">
              Sistemas Bio-inspirados<br />
              <span className="text-ug-institutional">para la Ciencia y la TecnologÃ­a</span>
            </h1>
            <p className="text-ug-text-secondary text-lg md:text-xl leading-relaxed max-w-lg">
              InvestigaciÃ³n de vanguardia en{" "}
              <strong className="text-ug-navy">RobÃ³tica</strong>{" "}
              y{" "}
              <strong className="text-ug-institutional">ElectrÃ³nica</strong>{" "}
              y{" "}
              <strong className="text-ug-tech">Neurociencia</strong>. Desarrollamos
              soluciones tecnolÃ³gicas basadas en principios biolÃ³gicos para la
              rehabilitaciÃ³n, la neuroprÃ³tesis y la interacciÃ³n humano-mÃ¡quina.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#proyectos"
                className="px-6 py-3 bg-ug-navy text-white text-sm font-semibold rounded-md hover:bg-ug-institutional transition-colors"
              >
                Conoce nuestros Proyectos
              </a>
              <a
                href="#investigacion"
                className="px-6 py-3 border border-ug-gold text-ug-navy text-sm font-semibold rounded-md hover:bg-ug-gold hover:text-white transition-colors"
              >
                Ver Publicaciones
              </a>
            </div>
          </div>

          <div className="relative">
            <LabImageSlot
              src={labData.images.hero}
              alt="FotografÃ­a principal del laboratorio de sistemas bio-inspirados"
              aspectRatio="video"
              placeholderLabel="FotografÃ­a principal del laboratorio / prototipo bio-inspirado"
              className="w-full"
            />
            <div className="absolute -bottom-4 left-0 right-0 px-4">
              <p className="text-ug-navy text-sm font-medium italic">
                Prototipo bio-inspirado en fase de pruebas â€” Laboratorio LISB-UG
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-b-ug-gold border-[3px] pt-10">
          <div className="flex flex-wrap justify-between gap-8 md:gap-16 items-center">
            {indicators.map((indicator) => (
              <div
                key={indicator.label}
                className="flex flex-col items-center border-l border-b-ug-gold pl-4 md:pl-8"
              >
                <span className="text-3xl font-montserrat font-bold text-ug-navy">
                  {indicator.value}
                </span>
                <span className="text-ug-text-secondary text-sm font-medium tracking-wide uppercase">
                  {indicator.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}