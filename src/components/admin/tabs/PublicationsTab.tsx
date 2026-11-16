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
import type { Publication, SectionHeading } from "@/data/labData";
import { getAreaOptions, newId } from "@/lib/labHelpers";

export function PublicationsTab({ data, patch }: TabProps) {
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const areaOptions = getAreaOptions(data);

  const setHeading = (changes: Partial<SectionHeading>) =>
    patch("sections", (prev) => ({
      ...prev,
      publications: { ...prev.publications, ...changes },
    }));

  const setPub = (id: string, changes: Partial<Publication>) =>
    patch("publications", (prev) => updateById(prev, id, changes));

  const addPub = () => {
    const id = newId("pub");
    setLastAdded(id);
    patch("publications", (prev) => [
      {
        id,
        title: "Nueva publicación",
        authors: [],
        journal: "",
        year: new Date().getFullYear(),
        doi: "",
        pdfUrl: "",
        abstract: "",
        area: data.pillars[0]?.id ?? "",
        image: "",
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      <Panel title="Encabezado de la sección">
        <TextField
          label="Título"
          value={data.sections.publications.title}
          onChange={(v) => setHeading({ title: v })}
        />
        <TextAreaField
          label="Texto introductorio"
          value={data.sections.publications.subtitle}
          onChange={(v) => setHeading({ subtitle: v })}
          rows={2}
        />
      </Panel>

      <Panel
        title="Publicaciones científicas"
        description="En la página se ordenan automáticamente por año, de la más reciente a la más antigua."
      >
        <AddButton label="Agregar publicación" onClick={addPub} />
        <div className="space-y-3">
          {data.publications.map((pub, index) => (
            <ItemCard
              key={pub.id}
              title={pub.title}
              subtitle={`${pub.year || ""} ${pub.journal}`.trim()}
              defaultOpen={pub.id === lastAdded}
              canMoveUp={index > 0}
              canMoveDown={index < data.publications.length - 1}
              onMoveUp={() => patch("publications", (prev) => moveById(prev, pub.id, -1))}
              onMoveDown={() => patch("publications", (prev) => moveById(prev, pub.id, 1))}
              onDelete={() => {
                if (confirmDelete(pub.title)) {
                  patch("publications", (prev) => removeById(prev, pub.id));
                }
              }}
            >
              <TextAreaField
                label="Título"
                value={pub.title}
                onChange={(v) => setPub(pub.id, { title: v })}
                rows={2}
              />
              <ListField
                label="Autores"
                value={pub.authors}
                onChange={(v) => setPub(pub.id, { authors: v })}
                separator="comma"
                rows={2}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Revista / Congreso"
                  value={pub.journal}
                  onChange={(v) => setPub(pub.id, { journal: v })}
                />
                <TextField
                  label="Año"
                  type="number"
                  value={pub.year ? String(pub.year) : ""}
                  onChange={(v) => setPub(pub.id, { year: parseInt(v, 10) || 0 })}
                />
                <TextField
                  label="DOI"
                  value={pub.doi}
                  onChange={(v) => setPub(pub.id, { doi: v })}
                  placeholder="10.1109/…"
                />
                <TextField
                  label="Enlace al PDF (opcional)"
                  value={pub.pdfUrl ?? ""}
                  onChange={(v) => setPub(pub.id, { pdfUrl: v })}
                  placeholder="https://…"
                />
                <SelectField
                  label="Área"
                  value={pub.area}
                  onChange={(v) => setPub(pub.id, { area: v })}
                  options={areaOptions}
                />
              </div>
              <TextAreaField
                label="Resumen"
                value={pub.abstract}
                onChange={(v) => setPub(pub.id, { abstract: v })}
                rows={4}
              />
              <ImageUploaderField
                value={pub.image ?? ""}
                onChange={(url) => setPub(pub.id, { image: url })}
                label="Imagen (opcional)"
                aspectRatio="square"
                placeholderLabel="Imagen de la publicación"
              />
            </ItemCard>
          ))}
          {data.publications.length === 0 && (
            <p className="text-sm text-ug-text-secondary">Aún no hay publicaciones.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}