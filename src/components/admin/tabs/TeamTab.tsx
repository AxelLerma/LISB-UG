"use client";

import React, { useState } from "react";
import { ImageUploaderField } from "../ImageUploaderField";
import {
  AddButton,
  ItemCard,
  ListField,
  Panel,
  SelectField,
  TextAreaField,
  TextField,
  confirmDelete,
  removeById,
  updateById,
} from "../fields";
import type { TabProps } from "../fields";
import type { TeamLevel, TeamMember, TeamSectionContent } from "@/data/labData";
import { DIRECTION_AREA, TEAM_LEVELS, getAreaOptions, newId } from "@/lib/labHelpers";

// Sube o baja a un integrante dentro de su mismo grupo (nivel).
function moveWithinLevel(items: TeamMember[], id: string, direction: -1 | 1): TeamMember[] {
  const current = items.find((m) => m.id === id);
  if (!current) return items;
  const sameLevel = items
    .map((m, i) => (m.level === current.level ? i : -1))
    .filter((i) => i >= 0);
  const pos = sameLevel.findIndex((i) => items[i].id === id);
  const targetPos = pos + direction;
  if (targetPos < 0 || targetPos >= sameLevel.length) return items;
  const copy = [...items];
  const a = sameLevel[pos];
  const b = sameLevel[targetPos];
  [copy[a], copy[b]] = [copy[b], copy[a]];
  return copy;
}

export function TeamTab({ data, patch }: TabProps) {
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const areaOptions = getAreaOptions(data, [DIRECTION_AREA]);
  const heading = data.sections.team;

  const setHeading = (changes: Partial<TeamSectionContent>) =>
    patch("sections", (prev) => ({ ...prev, team: { ...prev.team, ...changes } }));

  const setMember = (id: string, changes: Partial<TeamMember>) =>
    patch("team", (prev) => updateById(prev, id, changes));

  const addMember = (level: TeamLevel) => {
    const id = newId("team");
    setLastAdded(id);
    patch("team", (prev) => [
      ...prev,
      {
        id,
        name: "Nuevo integrante",
        role: "",
        area: data.pillars[0]?.id ?? DIRECTION_AREA.value,
        level,
        image: "",
        email: "",
        scholar: "",
        github: "",
        linkedin: "",
        bio: "",
        researchLines: [],
      },
    ]);
  };

  const groups: {
    level: TeamLevel;
    titleKey: "investigadoresTitle" | "posgradoTitle" | "licenciaturaTitle";
    emptyKey: "investigadoresEmptyText" | "posgradoEmptyText" | "licenciaturaEmptyText";
    label: string;
  }[] = [
    {
      level: "investigadores",
      titleKey: "investigadoresTitle",
      emptyKey: "investigadoresEmptyText",
      label: TEAM_LEVELS[0].label,
    },
    {
      level: "posgrado",
      titleKey: "posgradoTitle",
      emptyKey: "posgradoEmptyText",
      label: TEAM_LEVELS[1].label,
    },
    {
      level: "licenciatura",
      titleKey: "licenciaturaTitle",
      emptyKey: "licenciaturaEmptyText",
      label: TEAM_LEVELS[2].label,
    },
  ];

  return (
    <div className="space-y-6">
      <Panel title="Encabezado de la sección">
        <TextField
          label="Título"
          value={heading.title}
          onChange={(v) => setHeading({ title: v })}
        />
        <TextAreaField
          label="Texto introductorio"
          value={heading.subtitle}
          onChange={(v) => setHeading({ subtitle: v })}
          rows={2}
        />
      </Panel>

      {groups.map((group) => {
        const members = data.team.filter((m) => m.level === group.level);
        return (
          <Panel
            key={group.level}
            title={group.label}
            description="El mensaje de grupo vacío solo se muestra en la página cuando este grupo no tiene integrantes."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField
                label="Título del grupo en la página"
                value={heading[group.titleKey]}
                onChange={(v) => setHeading({ [group.titleKey]: v })}
                hint="Si lo dejas vacío y no hay integrantes, el grupo se oculta."
              />
              <TextAreaField
                label="Mensaje cuando no hay integrantes"
                value={heading[group.emptyKey]}
                onChange={(v) => setHeading({ [group.emptyKey]: v })}
                rows={3}
              />
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <ItemCard
                  key={member.id}
                  title={member.name}
                  subtitle={member.role}
                  defaultOpen={member.id === lastAdded}
                  canMoveUp={index > 0}
                  canMoveDown={index < members.length - 1}
                  onMoveUp={() => patch("team", (prev) => moveWithinLevel(prev, member.id, -1))}
                  onMoveDown={() => patch("team", (prev) => moveWithinLevel(prev, member.id, 1))}
                  onDelete={() => {
                    if (confirmDelete(member.name)) {
                      patch("team", (prev) => removeById(prev, member.id));
                    }
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Nombre"
                      value={member.name}
                      onChange={(v) => setMember(member.id, { name: v })}
                    />
                    <TextField
                      label="Cargo o rol"
                      value={member.role}
                      onChange={(v) => setMember(member.id, { role: v })}
                    />
                    <SelectField
                      label="Grupo en el que aparece"
                      value={member.level}
                      onChange={(v) => {
                        // Al cambiar de grupo la tarjeta se mueve; se deja abierta para no perderla.
                        setLastAdded(member.id);
                        setMember(member.id, { level: v as TeamLevel });
                      }}
                      options={TEAM_LEVELS}
                    />
                    <SelectField
                      label="Área de investigación"
                      value={member.area}
                      onChange={(v) => setMember(member.id, { area: v })}
                      options={areaOptions}
                    />
                  </div>
                  <TextAreaField
                    label="Biografía"
                    value={member.bio}
                    onChange={(v) => setMember(member.id, { bio: v })}
                    rows={4}
                  />
                  <ListField
                    label="Líneas de investigación"
                    value={member.researchLines}
                    onChange={(v) => setMember(member.id, { researchLines: v })}
                    rows={4}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                      label="Correo electrónico"
                      type="email"
                      value={member.email}
                      onChange={(v) => setMember(member.id, { email: v })}
                      placeholder="nombre@ugto.mx"
                    />
                    <TextField
                      label="Google Scholar"
                      value={member.scholar}
                      onChange={(v) => setMember(member.id, { scholar: v })}
                      placeholder="https://scholar.google.com/citations?user=…"
                    />
                    <TextField
                      label="GitHub"
                      value={member.github}
                      onChange={(v) => setMember(member.id, { github: v })}
                      placeholder="https://github.com/usuario"
                    />
                    <TextField
                      label="LinkedIn"
                      value={member.linkedin}
                      onChange={(v) => setMember(member.id, { linkedin: v })}
                      placeholder="https://www.linkedin.com/in/usuario"
                    />
                  </div>
                  <p className="text-xs text-ug-text-secondary">
                    En la página solo aparecen los íconos de los enlaces que llenes.
                  </p>
                  <ImageUploaderField
                    value={member.image}
                    onChange={(url) => setMember(member.id, { image: url })}
                    label="Fotografía"
                    aspectRatio="square"
                    placeholderLabel={`Retrato de ${member.name}`}
                  />
                </ItemCard>
              ))}
              {members.length === 0 && (
                <p className="text-sm text-ug-text-secondary">
                  Aún no hay integrantes en este grupo.
                </p>
              )}
            </div>
            <AddButton
              label={`Agregar integrante a este grupo`}
              onClick={() => addMember(group.level)}
            />
          </Panel>
        );
      })}
    </div>
  );
}