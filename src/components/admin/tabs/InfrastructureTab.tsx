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
import type { Infrastructure, SectionHeading } from "@/data/labData";
import { SHARED_AREA, getAreaOptions, newId } from "@/lib/labHelpers";

export function InfrastructureTab({ data, patch }: TabProps) {
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const areaOptions = getAreaOptions(data, [SHARED_AREA]);

  const setHeading = (changes: Partial<SectionHeading>) =>
    patch("sections", (prev) => ({
      ...prev,
      infrastructure: { ...prev.infrastructure, ...changes },
    }));

  const setInfra = (id: string, changes: Partial<Infrastructure>) =>
    patch("infrastructure", (prev) => updateById(prev, id, changes));

  const addInfra = () => {
    const id = newId("infra");
    setLastAdded(id);
    patch("infrastructure", (prev) => [
      ...prev,
      {
        id,
        name: "Nuevo laboratorio o espacio",
        description: "",
        image: "",
        equipment: [],
        area: SHARED_AREA.value,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <Panel title="Encabezado de la sección">
        <TextField
          label="Título"
          value={data.sections.infrastructure.title}
          onChange={(v) => setHeading({ title: v })}
        />
        <TextAreaField
          label="Texto introductorio"
          value={data.sections.infrastructure.subtitle}
          onChange={(v) => setHeading({ subtitle: v })}
          rows={2}
        />
      </Panel>

      <Panel title="Infraestructura y equipamiento">
        <div className="space-y-3">
          {data.infrastructure.map((infra, index) => (
            <ItemCard
              key={infra.id}
              title={infra.name}
              defaultOpen={infra.id === lastAdded}
              canMoveUp={index > 0}
              canMoveDown={index < data.infrastructure.length - 1}
              onMoveUp={() => patch("infrastructure", (prev) => moveById(prev, infra.id, -1))}
              onMoveDown={() => patch("infrastructure", (prev) => moveById(prev, infra.id, 1))}
              onDelete={() => {
                if (confirmDelete(infra.name)) {
                  patch("infrastructure", (prev) => removeById(prev, infra.id));
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Nombre"
                  value={infra.name}
                  onChange={(v) => setInfra(infra.id, { name: v })}
                />
                <SelectField
                  label="Área"
                  value={infra.area}
                  onChange={(v) => setInfra(infra.id, { area: v })}
                  options={areaOptions}
                />
              </div>
              <TextAreaField
                label="Descripción"
                value={infra.description}
                onChange={(v) => setInfra(infra.id, { description: v })}
                rows={3}
              />
              <ListField
                label="Equipamiento"
                value={infra.equipment}
                onChange={(v) => setInfra(infra.id, { equipment: v })}
                rows={5}
              />
              <ImageUploaderField
                value={infra.image}
                onChange={(url) => setInfra(infra.id, { image: url })}
                label="Imagen"
                aspectRatio="video"
                placeholderLabel={`Fotografía de ${infra.name}`}
              />
            </ItemCard>
          ))}
          {data.infrastructure.length === 0 && (
            <p className="text-sm text-ug-text-secondary">Aún no hay espacios registrados.</p>
          )}
        </div>
        <AddButton label="Agregar laboratorio o espacio" onClick={addInfra} />
      </Panel>
    </div>
  );
}