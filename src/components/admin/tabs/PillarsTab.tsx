"use client";

import React, { useState } from "react";
import { ImageUploaderField } from "../ImageUploaderField";
import {
  AddButton,
  ItemCard,
  ListField,
  PILLAR_COLORS,
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
import type { Pillar, SectionHeading } from "@/data/labData";
import { newId } from "@/lib/labHelpers";

export function PillarsTab({ data, patch }: TabProps) {
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const setHeading = (changes: Partial<SectionHeading>) =>
    patch("sections", (prev) => ({ ...prev, pillars: { ...prev.pillars, ...changes } }));

  const setPillar = (id: string, changes: Partial<Pillar>) =>
    patch("pillars", (prev) => updateById(prev, id, changes));

  const addPillar = () => {
    const id = newId("area");
    setLastAdded(id);
    patch("pillars", (prev) => [
      ...prev,
      {
        id,
        name: "Nueva área",
        description: "",
        image: "",
        badgeLabel: "Nueva área",
        color: "#002E5D",
        lines: [],
        tags: [],
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <Panel title="Encabezado de la sección">
        <TextField
          label="Título"
          value={data.sections.pillars.title}
          onChange={(v) => setHeading({ title: v })}
        />
        <TextAreaField
          label="Texto introductorio"
          value={data.sections.pillars.subtitle}
          onChange={(v) => setHeading({ subtitle: v })}
          rows={2}
        />
      </Panel>

      <Panel
        title="Áreas de investigación"
        description="Agrega, edita, ordena o elimina las áreas que quieras. Las nuevas áreas aparecen solas en los filtros y selectores de Proyectos, Publicaciones, Infraestructura y Equipo."
      >
        <div className="space-y-3">
          {data.pillars.map((pillar, index) => (
            <ItemCard
              key={pillar.id}
              title={pillar.name}
              subtitle={pillar.badgeLabel}
              defaultOpen={pillar.id === lastAdded}
              canMoveUp={index > 0}
              canMoveDown={index < data.pillars.length - 1}
              onMoveUp={() => patch("pillars", (prev) => moveById(prev, pillar.id, -1))}
              onMoveDown={() => patch("pillars", (prev) => moveById(prev, pillar.id, 1))}
              onDelete={() => {
                if (confirmDelete(pillar.name)) {
                  patch("pillars", (prev) => removeById(prev, pillar.id));
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Nombre del área"
                  value={pillar.name}
                  onChange={(v) => setPillar(pillar.id, { name: v })}
                />
                <TextField
                  label="Etiqueta sobre la imagen"
                  value={pillar.badgeLabel}
                  onChange={(v) => setPillar(pillar.id, { badgeLabel: v })}
                />
                <SelectField
                  label="Color de la etiqueta"
                  value={pillar.color}
                  onChange={(v) => setPillar(pillar.id, { color: v })}
                  options={PILLAR_COLORS}
                />
              </div>
              <TextAreaField
                label="Descripción"
                value={pillar.description}
                onChange={(v) => setPillar(pillar.id, { description: v })}
                rows={4}
              />
              <ListField
                label="Líneas de investigación"
                value={pillar.lines}
                onChange={(v) => setPillar(pillar.id, { lines: v })}
                rows={4}
              />
              <ListField
                label="Etiquetas técnicas"
                value={pillar.tags}
                onChange={(v) => setPillar(pillar.id, { tags: v })}
                separator="comma"
                rows={2}
              />
              <ImageUploaderField
                value={pillar.image}
                onChange={(url) => setPillar(pillar.id, { image: url })}
                label="Imagen del área"
                aspectRatio="video"
                placeholderLabel={`Fotografía de ${pillar.name}`}
              />
            </ItemCard>
          ))}
          {data.pillars.length === 0 && (
            <p className="text-sm text-ug-text-secondary">
              Aún no hay áreas. Agrega la primera.
            </p>
          )}
        </div>
        <AddButton label="Agregar área" onClick={addPillar} />
      </Panel>
    </div>
  );
}