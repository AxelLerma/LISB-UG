"use client";

import React from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { RichText } from "@/components/ui/RichText";
import { useLab } from "@/context/LabContext";
import { isExternalLink } from "@/lib/labHelpers";
import type { CustomSection } from "@/data/labData";

function CustomSectionBlock({ section }: { section: CustomSection }) {
  const hasImage = Boolean(section.image);
  const bg = section.background === "light" ? "bg-ug-light" : "bg-white";

  const content = (
    <div className="space-y-5">
      {section.subtitle && (
        <p className="text-xs font-semibold text-ug-gold uppercase tracking-wider">
          {section.subtitle}
        </p>
      )}
      <h2 className="font-montserrat text-2xl md:text-3xl font-bold text-ug-navy tracking-tight">
        {section.title}
      </h2>
      <div className="w-16 h-1 bg-ug-gold rounded-full" />
      {section.paragraphs.map((paragraph, idx) => (
        <p key={idx} className="text-ug-text-secondary text-base md:text-lg leading-relaxed">
          <RichText text={paragraph} />
        </p>
      ))}
      {section.bullets.length > 0 && (
        <ul className="space-y-2">
          {section.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2 text-ug-text text-sm md:text-base">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-ug-gold shrink-0" />
              <RichText text={bullet} />
            </li>
          ))}
        </ul>
      )}
      {section.buttonLabel && section.buttonHref && (
        <div className="pt-2">
          <a
            href={section.buttonHref}
            {...(isExternalLink(section.buttonHref)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-block px-6 py-3 bg-ug-navy text-white text-sm font-semibold rounded-md hover:bg-ug-institutional transition-colors"
          >
            {section.buttonLabel}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <section id={section.id} className={`${bg} py-20 md:py-28 scroll-mt-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {hasImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={section.imagePosition === "left" ? "lg:order-2" : ""}>
              {content}
            </div>
            <div className={section.imagePosition === "left" ? "lg:order-1" : ""}>
              <LabImageSlot
                src={section.image}
                alt={section.title}
                aspectRatio="video"
                placeholderLabel={section.title}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">{content}</div>
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