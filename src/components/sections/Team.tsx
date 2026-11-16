"use client";

import React from "react";
import { GraduationCap, Github, Linkedin, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";
import { Badge } from "@/components/ui/Badge";
import { useLab } from "@/context/LabContext";
import { getAreaLabel } from "@/lib/labHelpers";
import type { LabData, TeamMember } from "@/data/labData";

function toUrl(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function PlaceholderCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white border border-slate-200 rounded-xl p-8 text-center">
      <p className="text-ug-text-secondary">{children}</p>
    </div>
  );
}

function MemberCard({ member, data }: { member: TeamMember; data: LabData }) {
  // Solo se muestran los enlaces que el integrante tiene capturados.
  const socials: { key: string; label: string; href: string; Icon: LucideIcon }[] = [];
  if (member.email.trim()) {
    socials.push({
      key: "email",
      label: "Correo electrónico",
      href: `mailto:${member.email.trim()}`,
      Icon: Mail,
    });
  }
  if (member.scholar.trim()) {
    socials.push({
      key: "scholar",
      label: "Google Scholar",
      href: toUrl(member.scholar.trim()),
      Icon: GraduationCap,
    });
  }
  if (member.github.trim()) {
    socials.push({
      key: "github",
      label: "GitHub",
      href: toUrl(member.github.trim()),
      Icon: Github,
    });
  }
  if (member.linkedin.trim()) {
    socials.push({
      key: "linkedin",
      label: "LinkedIn",
      href: toUrl(member.linkedin.trim()),
      Icon: Linkedin,
    });
  }

  return (
    <article className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-ug-gold transition-all duration-300">
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
        {member.role && (
          <p className="text-ug-institutional text-sm font-medium mb-3">
            {member.role}
          </p>
        )}
        {member.bio && (
          <p className="text-ug-text text-sm leading-relaxed mb-4">{member.bio}</p>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="tech" className="text-xs">
            {getAreaLabel(data, member.area)}
          </Badge>
          {member.researchLines.map((line, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {line}
            </Badge>
          ))}
        </div>
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {socials.map(({ key, label, href, Icon }) => (
              <a
                key={key}
                href={href}
                {...(key === "email"
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                aria-label={`${label} de ${member.name}`}
                title={label}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-ug-gold/40 text-ug-navy hover:bg-ug-navy hover:text-white hover:border-ug-navy transition-colors"
              >
                <Icon size={16} strokeWidth={2} />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export function Team() {
  const { labData, loading } = useLab();

  if (loading || !labData) {
    return <p className="text-center py-20">Cargando equipo...</p>;
  }

  const heading = labData.sections.team;

  const groups: {
    level: TeamMember["level"];
    title: string;
    emptyText: string;
  }[] = [
    {
      level: "investigadores",
      title: heading.investigadoresTitle,
      emptyText: heading.investigadoresEmptyText,
    },
    {
      level: "posgrado",
      title: heading.posgradoTitle,
      emptyText: heading.posgradoEmptyText,
    },
    {
      level: "licenciatura",
      title: heading.licenciaturaTitle,
      emptyText: heading.licenciaturaEmptyText,
    },
  ];

  return (
    <section id="equipo" className="bg-ug-light py-20 md:py-32 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-montserrat text-3xl font-bold text-ug-navy mb-4">
            {heading.title}
          </h2>
          {heading.subtitle && (
            <p className="text-ug-text-secondary text-lg">{heading.subtitle}</p>
          )}
        </div>

        <div className="space-y-16">
          {groups.map((group) => {
            const members = labData.team.filter((m) => m.level === group.level);
            // Un grupo sin título y sin integrantes no se muestra.
            if (!group.title.trim() && members.length === 0) return null;
            return (
              <div key={group.level}>
                {group.title.trim() && (
                  <h3 className="font-montserrat text-2xl font-bold text-ug-navy mb-8 border-b-2 border-ug-gold pb-3">
                    {group.title}
                  </h3>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {members.length === 0 && group.emptyText.trim() && (
                    <PlaceholderCard>{group.emptyText}</PlaceholderCard>
                  )}
                  {members.map((member) => (
                    <MemberCard key={member.id} member={member} data={labData} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}