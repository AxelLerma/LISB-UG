"use client";

import React from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { RichText } from "@/components/ui/RichText";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useLab } from "@/context/LabContext";
import { isExternalLink } from "@/lib/labHelpers";
import type { CustomSection } from "@/data/labData";

const linkProps = (href: string) =>
  isExternalLink(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

const primaryButton =
  "inline-block px-6 py-3 bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night text-sm font-semibold rounded-md hover:bg-ug-institutional dark:hover:bg-ug-gold-bright transition-colors break-words";

// Tipo 1: bloque editorial (título, párrafos, lista, imagen y botón opcionales).
function EditorialBlock({ section }: { section: CustomSection }) {
  const hasImage = Boolean(section.image);

  const content = (
    <div className="space-y-5 min-w-0">
      {section.subtitle && (
        <p className="text-xs font-semibold text-ug-gold dark:text-ug-gold-bright uppercase tracking-wider break-words">
          {section.subtitle}
        </p>
      )}
      <h2 className="font-montserrat text-2xl md:text-3xl font-bold text-ug-navy dark:text-ug-sky-soft tracking-tight break-words">
        {section.title}
      </h2>
      <div className="w-16 h-1 bg-ug-gold dark:bg-ug-gold-bright rounded-full" />
      {section.paragraphs.map((paragraph, idx) => (
        <p key={idx} className="text-ug-text-secondary text-base md:text-lg leading-relaxed break-words">
          <RichText text={paragraph} />
        </p>
      ))}
      {section.bullets.length > 0 && (
        <ul className="space-y-2">
          {section.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2 text-ug-text text-sm md:text-base break-words">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-ug-gold dark:bg-ug-gold-bright shrink-0" />
              <span className="min-w-0">
                <RichText text={bullet} />
              </span>
            </li>
          ))}
        </ul>
      )}
      {section.buttonLabel && section.buttonHref && (
        <div className="pt-2">
          <a
            href={section.buttonHref}
            {...linkProps(section.buttonHref)}
            className={primaryButton}
          >
            {section.buttonLabel}
          </a>
        </div>
      )}
    </div>
  );

  if (!hasImage) {
    return <div className="max-w-3xl">{content}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div className={section.imagePosition === "left" ? "lg:order-2" : ""}>
        {content}
      </div>
      <div className={`min-w-0 ${section.imagePosition === "left" ? "lg:order-1" : ""}`}>
        <LabImageSlot
          src={section.image}
          alt={section.title}
          aspectRatio="video"
          placeholderLabel={section.title}
          className="w-full"
        />
      </div>
    </div>
  );
}

// Tipo 2: cuadrícula de tarjetas institucionales (estilo "Áreas de investigación").
function CardsBlock({ section }: { section: CustomSection }) {
  return (
    <div>
      {section.subtitle && (
        <p className="text-xs font-semibold text-ug-gold dark:text-ug-gold-bright uppercase tracking-wider mb-3 break-words">
          {section.subtitle}
        </p>
      )}
      <SectionHeader title={section.title} subtitle={section.intro} />
      {section.cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-10 md:mt-12">
          {section.cards.map((card) => (
            <article
              key={card.id}
              className="group flex flex-col min-w-0 bg-white dark:bg-ug-surface border border-slate-200 dark:border-ug-line border-t-4 border-t-ug-gold dark:border-t-ug-gold-bright rounded-xl overflow-hidden transition-all duration-300 hover:border-t-ug-navy dark:hover:border-t-ug-sky hover:shadow-lg hover:-translate-y-1"
            >
              {card.image && (
                <div className="relative aspect-video">
                  <LabImageSlot
                    src={card.image}
                    alt={card.title}
                    aspectRatio="video"
                    placeholderLabel={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                {card.subtitle && (
                  <p className="text-xs font-semibold text-ug-gold dark:text-ug-gold-bright uppercase tracking-wider mb-2 break-words">
                    {card.subtitle}
                  </p>
                )}
                <h3 className="font-montserrat text-xl font-bold text-ug-navy dark:text-ug-sky-soft mb-3 leading-tight group-hover:text-ug-institutional dark:group-hover:text-ug-sky transition-colors break-words">
                  {card.title}
                </h3>
                {card.description && (
                  <p className="text-ug-text-secondary text-sm leading-relaxed mb-5 break-words">
                    <RichText text={card.description} />
                  </p>
                )}
                {card.bullets.length > 0 && (
                  <ul className="space-y-2 mb-6">
                    {card.bullets.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-ug-text text-sm break-words"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-ug-gold dark:bg-ug-gold-bright shrink-0" />
                        <span className="min-w-0">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {card.buttonLabel && card.buttonHref && (
                  <div className="mt-auto pt-2">
                    <a
                      href={card.buttonHref}
                      {...linkProps(card.buttonHref)}
                      className="inline-block px-5 py-2 bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night text-sm font-semibold rounded-md hover:bg-ug-institutional dark:hover:bg-ug-gold-bright transition-colors break-words"
                    >
                      {card.buttonLabel}
                    </a>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function CustomSectionBlock({ section }: { section: CustomSection }) {
  const bg =
    section.background === "light"
      ? "bg-ug-light dark:bg-ug-slate"
      : "bg-white dark:bg-ug-night";
  return (
    <section id={section.id} className={`${bg} py-12 md:py-20 scroll-mt-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.layoutType === "cards" ? (
          <CardsBlock section={section} />
        ) : (
          <EditorialBlock section={section} />
        )}
      </div>
    </section>
  );
}

export function CustomSections() {
  const { labData } = useLab();
  if (!labData) return null;

  const sections = (labData.customSections ?? []).filter((s) => s.visible);
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <CustomSectionBlock key={section.id} section={section} />
      ))}
    </>
  );
}