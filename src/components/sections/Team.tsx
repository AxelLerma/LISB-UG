"use client";

import React from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { Badge } from "@/components/ui/Badge";
import { useLab } from "@/context/LabContext";

type MemberArea = "robotica" | "electronica" | "neurociencia" | "direccion";

const AREA_LABELS: Record<MemberArea, string> = {
  robotica: "Robótica",
  electronica: "Electrónica",
  neurociencia: "Neurociencia",
  direccion: "Dirección",
};

// Enlaces genéricos (los mismos para todos los miembros). Si más adelante
// quieres enlaces personalizados, agrégalos al modelo de datos del miembro.
const SOCIAL_LINKS: { label: string; url: string }[] = [
  { label: "Google Scholar", url: "https://scholar.google.com" },
  { label: "GitHub", url: "https://github.com" },
  { label: "LinkedIn", url: "https://linkedin.com" },
];

function PlaceholderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-ug-light rounded-xl p-8 text-center">
      <p className="text-ug-text-secondary">{children}</p>
    </div>
  );
}

export function Team() {
  const { labData, loading } = useLab();

  if (loading || !labData) {
    return <p className="text-center py-20">Cargando equipo...</p>;
  }

  return (
    <section id="equipo" className="bg-ug-light py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-montserrat text-3xl font-bold text-ug-navy mb-4">
            Equipo de Investigación
          </h2>
          <p className="text-ug-text-secondary text-lg">
            Profesores, investigadores y estudiantes del Laboratorio de
            Sistemas Bio-inspirados.
          </p>
        </div>

        <div className="space-y-16">
          <div>
            <h3 className="font-montserrat text-2xl font-bold text-ug-navy mb-8 border-b border-b-ug-gold pb-3">
              Investigadores y Profesores UG
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {labData.team.map((member) => (
                <article
                  key={member.id}
                  className="bg-white border border-ug-light rounded-xl overflow-hidden hover:border-ug-gold transition-all duration-300"
                >
                  <div className="relative aspect-square">
                    <LabImageSlot
                      src={member.image}
                      alt={`Retrato de ${member.name}`}
                      aspectRatio="square"
                      placeholderLabel={`Retrato de ${member.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-montserrat text-lg font-bold text-ug-navy mb-1">
                      {member.name}
                    </h3>
                    <p className="text-ug-institutional text-sm font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-ug-text text-sm leading-relaxed mb-4">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="tech" className="text-xs">
                        {AREA_LABELS[member.area]}
                      </Badge>
                      {member.researchLines.map((line, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {line}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {SOCIAL_LINKS.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ug-navy hover:text-ug-institutional text-sm font-medium underline underline-offset-2"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-montserrat text-2xl font-bold text-ug-navy mb-8 border-b border-b-ug-gold pb-3">
              Posgrado (Tesis / Investigación)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PlaceholderCard>
                Estudiantes de Maestría y Doctorado desarrollando tesis de
                investigación en el laboratorio. ¡Contáctanos para conocer las
                líneas disponibles!
              </PlaceholderCard>
            </div>
          </div>

          <div>
            <h3 className="font-montserrat text-2xl font-bold text-ug-navy mb-8 border-b border-b-ug-gold pb-3">
              Licenciatura (Tesis / Servicio Social)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PlaceholderCard>
                Estudiantes de Licenciatura en desarrollo de tesis y servicio
                social. ¡Únete a nuestros proyectos!
              </PlaceholderCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}