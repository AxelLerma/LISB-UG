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
      <section className="bg-ug-light dark:bg-ug-slate py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center h-64">
            {loading ? (
              <>
                <div className="animate-pulse rounded-full bg-slate-200 dark:bg-ug-surface w-12 h-12 mb-4" />
                <p className="text-ug-text-secondary text-sm">Cargando contenido…</p>
              </>
            ) : (
              <p className="text-ug-text-secondary text-sm text-center">
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
    <section className="relative bg-ug-light dark:bg-ug-slate overflow-hidden py-12 md:py-20 lg:py-28">
      <div className="absolute inset-0 opacity-10 dark:opacity-[0.07] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#002E5D_1px,transparent_1px),linear-gradient(to_bottom,#002E5D_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#38BDF8_1px,transparent_1px),linear-gradient(to_bottom,#38BDF8_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="space-y-5 md:space-y-6 min-w-0">
            {hero.badge && (
              <span className="inline-flex max-w-full items-center gap-2 px-4 py-1.5 bg-ug-gold/10 text-ug-navy dark:text-ug-gold-bright dark:bg-ug-gold/15 dark:border-ug-gold/40 text-[11px] sm:text-xs font-semibold uppercase tracking-wider leading-snug rounded-xl sm:rounded-full border border-ug-gold/20 break-words">
                {hero.badge}
              </span>
            )}
            <h1 className="font-montserrat text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-ug-navy dark:text-ug-ink leading-tight break-words">
              {hero.titleLine1}
              {hero.titleLine2 && (
                <>
                  <br />
                  <span className="text-ug-institutional dark:text-ug-sky">{hero.titleLine2}</span>
                </>
              )}
            </h1>
            {hero.description && (
              <p className="text-ug-text-secondary text-base sm:text-lg md:text-xl leading-relaxed max-w-lg break-words">
                <RichText text={hero.description} />
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 pt-2">
              {hero.primaryButtonLabel && (
                <a
                  href={hero.primaryButtonHref}
                  {...linkProps(hero.primaryButtonHref)}
                  className="w-full sm:w-auto text-center px-6 py-3 bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night text-sm font-semibold rounded-md hover:bg-ug-institutional dark:hover:bg-ug-gold-bright transition-colors"
                >
                  {hero.primaryButtonLabel}
                </a>
              )}
              {hero.secondaryButtonLabel && (
                <a
                  href={hero.secondaryButtonHref}
                  {...linkProps(hero.secondaryButtonHref)}
                  className="w-full sm:w-auto text-center px-6 py-3 border border-ug-gold text-ug-navy dark:text-ug-ink text-sm font-semibold rounded-md hover:bg-ug-gold hover:text-white dark:hover:text-ug-night transition-colors"
                >
                  {hero.secondaryButtonLabel}
                </a>
              )}
            </div>
          </div>

          <div className="relative min-w-0">
            <LabImageSlot
              src={labData.images.hero}
              alt="Fotografía principal del laboratorio"
              aspectRatio="video"
              placeholderLabel="Fotografía principal del laboratorio / prototipo bio-inspirado"
              className="w-full"
            />
            {hero.caption && (
              <p className="mt-3 text-ug-navy dark:text-ug-ink-soft text-sm font-medium italic break-words">
                {hero.caption}
              </p>
            )}
          </div>
        </div>

        {hero.indicators.length > 0 && (
          <div className="mt-12 md:mt-16 border-t-[3px] border-ug-gold pt-8 md:pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
              {hero.indicators.map((indicator) => (
                <div
                  key={indicator.id}
                  className="flex flex-col border-l-2 border-ug-gold pl-4 md:pl-8 min-w-0"
                >
                  <span className="text-3xl font-montserrat font-bold text-ug-navy dark:text-ug-gold-bright">
                    {resolveIndicator(indicator)}
                  </span>
                  <span className="text-ug-text-secondary text-xs sm:text-sm font-medium tracking-wide uppercase break-words">
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