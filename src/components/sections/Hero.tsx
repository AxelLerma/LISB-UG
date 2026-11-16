"use client";

import React from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { RichText } from "@/components/ui/RichText";
import { useLab } from "@/context/LabContext";
import { isExternalLink } from "@/lib/labHelpers";
import type { HeroIndicator } from "@/data/labData";

export function Hero() {
  const { labData, loading, error } = useLab();

  if (!labData) {
    return (
      <section className="bg-ug-light py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            {loading ? (
              <>
                <div className="animate-pulse rounded-full bg-slate-200 w-12 h-12 mb-4" />
                <p className="text-ug-text-secondary text-sm">Cargando contenido…</p>
              </>
            ) : (
              <p className="text-ug-text-secondary text-sm">
                {error ?? "No se pudo cargar el contenido."}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  const { hero } = labData;

  const resolveIndicator = (indicator: HeroIndicator): string => {
    switch (indicator.source) {
      case "pillars":
        return String(labData.pillars.length);
      case "activeProjects":
        return String(labData.projects.filter((p) => p.status === "activo").length);
      case "publications":
        return String(labData.publications.length);
      default:
        return indicator.value;
    }
  };

  const linkProps = (href: string) =>
    isExternalLink(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <section className="relative bg-ug-light overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#002E5D_1px,transparent_1px),linear-gradient(to_bottom,#002E5D_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            {hero.badge && (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-ug-gold/10 text-ug-navy text-xs font-semibold uppercase tracking-wider rounded-full border border-ug-gold/20">
                {hero.badge}
              </span>
            )}
            <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold text-ug-navy leading-tight">
              {hero.titleLine1}
              {hero.titleLine2 && (
                <>
                  <br />
                  <span className="text-ug-institutional">{hero.titleLine2}</span>
                </>
              )}
            </h1>
            {hero.description && (
              <p className="text-ug-text-secondary text-lg md:text-xl leading-relaxed max-w-lg">
                <RichText text={hero.description} />
              </p>
            )}
            <div className="flex flex-wrap gap-4 pt-2">
              {hero.primaryButtonLabel && (
                <a
                  href={hero.primaryButtonHref}
                  {...linkProps(hero.primaryButtonHref)}
                  className="px-6 py-3 bg-ug-navy text-white text-sm font-semibold rounded-md hover:bg-ug-institutional transition-colors"
                >
                  {hero.primaryButtonLabel}
                </a>
              )}
              {hero.secondaryButtonLabel && (
                <a
                  href={hero.secondaryButtonHref}
                  {...linkProps(hero.secondaryButtonHref)}
                  className="px-6 py-3 border border-ug-gold text-ug-navy text-sm font-semibold rounded-md hover:bg-ug-gold hover:text-white transition-colors"
                >
                  {hero.secondaryButtonLabel}
                </a>
              )}
            </div>
          </div>

          <div className="relative">
            <LabImageSlot
              src={labData.images.hero}
              alt="Fotografía principal del laboratorio"
              aspectRatio="video"
              placeholderLabel="Fotografía principal del laboratorio / prototipo bio-inspirado"
              className="w-full"
            />
            {hero.caption && (
              <p className="mt-3 text-ug-navy text-sm font-medium italic">
                {hero.caption}
              </p>
            )}
          </div>
        </div>

        {hero.indicators.length > 0 && (
          <div className="mt-16 border-t-[3px] border-ug-gold pt-10">
            <div className="flex flex-wrap justify-between gap-8 md:gap-16 items-center">
              {hero.indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className="flex flex-col items-center border-l-2 border-ug-gold pl-4 md:pl-8"
                >
                  <span className="text-3xl font-montserrat font-bold text-ug-navy">
                    {resolveIndicator(indicator)}
                  </span>
                  <span className="text-ug-text-secondary text-sm font-medium tracking-wide uppercase text-center">
                    {indicator.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}