"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { useLab } from "@/context/LabContext";
import { getAreaLabel } from "@/lib/labHelpers";
import type { LabData } from "@/services/labApiClient";

type Publication = LabData["publications"][number];

function formatAuthors(authors: string[]): string {
  if (authors.length <= 2) return authors.join(" y ");
  return `${authors[0]} et al.`;
}

function generateBibTeX(pub: Publication): string {
  const lastName = pub.authors[0]?.split(" ").pop() ?? "autor";
  const key = `${lastName}${pub.year}`;
  return `@article{${key},\n  author = {${pub.authors.join(" and ")}},\n  title = {${pub.title}},\n  journal = {${pub.journal}},\n  year = {${pub.year}},\n  doi = {${pub.doi}}\n}`;
}

export function Publications() {
  // Todos los hooks van SIEMPRE antes de cualquier `return` condicional.
  const { labData, loading } = useLab();
  const [copiedBibtex, setCopiedBibtex] = useState<string | null>(null);

  if (loading || !labData) {
    return <p className="text-center py-20">Cargando publicaciones...</p>;
  }

  const heading = labData.sections.publications;
  const sortedPublications = [...labData.publications].sort(
    (a, b) => b.year - a.year
  );

  const handleCopyBibtex = async (pub: Publication) => {
    try {
      await navigator.clipboard.writeText(generateBibTeX(pub));
      setCopiedBibtex(pub.id);
      setTimeout(() => setCopiedBibtex(null), 2000);
    } catch {
      // El portapapeles puede no estar disponible (http sin TLS, permisos…)
      setCopiedBibtex(null);
    }
  };

  const actionClass =
    "text-ug-institutional dark:text-ug-sky hover:text-ug-navy dark:hover:text-ug-sky-soft font-medium";

  return (
    <section id="publicaciones" className="bg-ug-light dark:bg-ug-slate py-12 md:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center mb-10 md:mb-12">
          <div className="min-w-0">
            <h2 className="font-montserrat text-2xl sm:text-3xl font-bold text-ug-navy dark:text-ug-sky-soft mb-2 break-words">
              {heading.title}
            </h2>
            {heading.subtitle && (
              <p className="text-ug-text-secondary text-base sm:text-lg">{heading.subtitle}</p>
            )}
          </div>
        </div>

        {sortedPublications.length === 0 ? (
          <p className="text-center text-ug-text-secondary py-12">
            Próximamente se publicarán nuestras investigaciones.
          </p>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {sortedPublications.map((pub) => {
              const isCopied = copiedBibtex === pub.id;
              return (
                <article
                  key={pub.id}
                  className="bg-white dark:bg-ug-surface border border-slate-200 dark:border-ug-line rounded-xl p-4 sm:p-6 hover:border-ug-gold dark:hover:border-ug-gold-bright transition-all duration-200"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 min-w-8 h-8 px-2 rounded bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night flex items-center justify-center text-xs font-bold">
                      {pub.year || "—"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-montserrat font-bold text-ug-navy dark:text-ug-sky-soft text-base sm:text-lg leading-tight mb-2 break-words">
                        {pub.title}
                      </h3>
                      <p className="text-ug-text-secondary text-sm mb-3 break-words">
                        {formatAuthors(pub.authors)}.
                      </p>
                      {pub.abstract && (
                        <p className="text-ug-text text-sm leading-relaxed mb-3 line-clamp-3 break-words">
                          {pub.abstract}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {pub.area && (
                          <Badge variant="tech" className="text-xs">
                            {getAreaLabel(labData, pub.area)}
                          </Badge>
                        )}
                        {pub.journal && (
                          <Badge variant="outline" className="text-xs">
                            {pub.journal.split(" (")[0]}
                          </Badge>
                        )}
                        {pub.year > 0 && (
                          <Badge variant="default" className="text-xs">
                            {pub.year}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={pub.doi}
                            className={`${actionClass} underline underline-offset-2 break-all`}
                          >
                            DOI
                          </a>
                        )}
                        {pub.pdfUrl && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${actionClass} underline underline-offset-2 break-all`}
                          >
                            PDF
                          </a>
                        )}
                        <button
                          onClick={() => handleCopyBibtex(pub)}
                          className={`flex items-center gap-1.5 ${actionClass}`}
                        >
                          {isCopied ? (
                            <>
                              <Check size={16} className="text-ug-gold dark:text-ug-gold-bright" />
                              Copiado
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              Copiar BibTeX
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    {pub.image && (
                      <div className="hidden sm:block w-28 shrink-0">
                        <LabImageSlot
                          src={pub.image}
                          alt={`Imagen de ${pub.title}`}
                          aspectRatio="square"
                          placeholderLabel="Imagen"
                          className="w-28 h-28"
                        />
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