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
  moveById,
  removeById,
  updateById,
} from "../fields";
import type { TabProps } from "../fields";
import type { TeamMember, TeamSectionContent } from "@/data/labData";
import { DIRECTION_AREA, getAreaOptions, newId } from "@/lib/labHelpers";

export function TeamTab({ data, patch }: TabProps) {
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const areaOptions = getAreaOptions(data, [DIRECTION_AREA]);
  const heading = data.sections.team;

  const setHeading = (changes: Partial<TeamSectionContent>) =>
    patch("sections", (prev) => ({ ...prev, team: { ...prev.team, ...changes } }));

  const setMember = (id: string, changes: Partial<TeamMember>) =>
    patch("team", (prev) => updateById(prev, id, changes));

  const addMember = () => {
    const id = newId("team");
    setLastAdded(id);
    patch("team", (prev) => [
      ...prev,
      {
        id,
        name: "Nuevo integrante",
        role: "",
        area: data.pillars[0]?.id ?? DIRECTION_AREA.value,
        image: "",
        email: "",
        bio: "",
        researchLines: [],
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <Panel title="Encabezado y bloques de la sección">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Título"
            value={heading.title}
            onChange={(v) => setHeading({ title: v })}
          />
          <TextField
            label="Título del bloque de investigadores"
            value={heading.investigatorsTitle}
            onChange={(v) => setHeading({ investigatorsTitle: v })}
          />
        </div>
        <TextAreaField
          label="Texto introductorio"
          value={heading.subtitle}
          onChange={(v) => setHeading({ subtitle: v })}
          rows={2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Bloque de posgrado: título"
            value={heading.postgradTitle}
            onChange={(v) => setHeading({ postgradTitle: v })}
            hint="Déjalo vacío para ocultar el bloque."
          />
          <TextAreaField
            label="Bloque de posgrado: texto"
            value={heading.postgradText}
            onChange={(v) => setHeading({ postgradText: v })}
            rows={3}
          />
          <TextField
            label="Bloque de licenciatura: título"
            value={heading.undergradTitle}
            onChange={(v) => setHeading({ undergradTitle: v })}
            hint="Déjalo vacío para ocultar el bloque."
          />
          <TextAreaField
            label="Bloque de licenciatura: texto"
            value={heading.undergradText}
            onChange={(v) => setHeading({ undergradText: v })}
            rows={3}
          />
        </div>
      </Panel>

      <Panel title="Integrantes del equipo">
        <div className="space-y-3">
          {data.team.map((member, index) => (
            <ItemCard
              key={member.id}
              title={member.name}
              subtitle={member.role}
              defaultOpen={member.id === lastAdded}
              canMoveUp={index > 0}
              canMoveDown={index < data.team.length - 1}
              onMoveUp={() => patch("team", (prev) => moveById(prev, member.id, -1))}
              onMoveDown={() => patch("team", (prev) => moveById(prev, member.id, 1))}
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
                  label="Área"
                  value={member.area}
                  onChange={(v) => setMember(member.id, { area: v })}
                  options={areaOptions}
                />
                <TextField
                  label="Correo electrónico"
                  type="email"
                  value={member.email}
                  onChange={(v) => setMember(member.id, { email: v })}
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
              <ImageUploaderField
                value={member.image}
                onChange={(url) => setMember(member.id, { image: url })}
                label="Fotografía"
                aspectRatio="square"
                placeholderLabel={`Retrato de ${member.name}`}
              />
            </ItemCard>
          ))}
          {data.team.length === 0 && (
            <p className="text-sm text-ug-text-secondary">Aún no hay integrantes.</p>
          )}
        </div>
        <AddButton label="Agregar integrante" onClick={addMember} />
      </Panel>
    </div>
  );
}