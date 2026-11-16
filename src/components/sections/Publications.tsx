"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useLab } from "@/context/LabContext";
import type { LabData } from "@/services/labApiClient";

type Area = "robotica" | "electronica" | "neurociencia";
type Publication = LabData["publications"][number];

const AREA_LABELS: Record<Area, string> = {
  robotica: "Robótica",
  electronica: "Electrónica",
  neurociencia: "Neurociencia",
};

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

  return (
    <section id="publicaciones" className="bg-ug-light py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center mb-12">
          <div>
            <h2 className="font-montserrat text-3xl font-bold text-ug-navy mb-2">
              Publicaciones Científicas
            </h2>
            <p className="text-ug-text-secondary text-lg">
              Investigación indexada en revistas y congresos internacionales
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {sortedPublications.map((pub) => {
            const isCopied = copiedBibtex === pub.id;
            return (
              <article
                key={pub.id}
                className="bg-white border border-ug-light/50 rounded-xl p-6 hover:border-ug-gold transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-ug-navy flex items-center justify-center text-white text-xs font-bold">
                    {pub.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-montserrat font-bold text-ug-navy text-lg leading-tight mb-2">
                      {pub.title}
                    </h3>
                    <p className="text-ug-text-secondary text-sm mb-3">
                      {formatAuthors(pub.authors)}.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pub.area && (
                        <Badge variant="tech" className="text-xs">
                          {AREA_LABELS[pub.area]}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {pub.journal.split(" (")[0]}
                      </Badge>
                      <Badge variant="default" className="text-xs">
                        {pub.year}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ug-institutional hover:text-ug-navy font-medium underline underline-offset-2"
                      >
                        DOI
                      </a>
                      <a
                        href="#"
                        className="text-ug-institutional hover:text-ug-navy font-medium underline underline-offset-2"
                      >
                        PDF
                      </a>
                      <button
                        onClick={() => handleCopyBibtex(pub)}
                        className="flex items-center gap-1.5 text-ug-institutional hover:text-ug-navy font-medium"
                      >
                        {isCopied ? (
                          <>
                            <Check size={16} className="text-ug-gold" />
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
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}