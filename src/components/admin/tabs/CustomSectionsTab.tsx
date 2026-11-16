"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ImageUploaderField } from "../ImageUploaderField";
import {
  AddButton,
  IconButton,
  ItemCard,
  ListField,
  Panel,
  SelectField,
  TextField,
  ToggleField,
  confirmDelete,
  moveById,
  removeById,
  updateById,
} from "../fields";
import type { TabProps } from "../fields";
import type { CustomSection } from "@/data/labData";
import { createCustomSection } from "@/lib/labHelpers";

export function CustomSectionsTab({ data, patch }: TabProps) {
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const sections = data.customSections ?? [];

  const setSection = (id: string, changes: Partial<CustomSection>) =>
    patch("customSections", (prev) => updateById(prev, id, changes));

  const addSection = () => {
    const section = createCustomSection();
    setLastAdded(section.id);
    patch("customSections", (prev) => [...prev, section]);
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Secciones extra"
        description="Crea secciones nuevas para la página pública (por ejemplo: Noticias, Vinculación, Convocatorias). Aparecen entre el Equipo y el Contacto, en el orden de esta lista, con el mismo estilo institucional de la UG."
      >
        <AddButton label="Crear nueva sección" onClick={addSection} />
        <div className="space-y-3">
          {sections.map((section, index) => (
            <ItemCard
              key={section.id}
              title={section.title}
              subtitle={section.visible ? "Visible en la página" : "Oculta (no se muestra al público)"}
              defaultOpen={section.id === lastAdded}
              canMoveUp={index > 0}
              canMoveDown={index < sections.length - 1}
              onMoveUp={() => patch("customSections", (prev) => moveById(prev, section.id, -1))}
              onMoveDown={() => patch("customSections", (prev) => moveById(prev, section.id, 1))}
              onDelete={() => {
                if (confirmDelete(section.title)) {
                  patch("customSections", (prev) => removeById(prev, section.id));
                }
              }}
              extra={
                <IconButton
                  label={section.visible ? "Ocultar sección" : "Mostrar sección"}
                  onClick={() => setSection(section.id, { visible: !section.visible })}
                >
                  {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </IconButton>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleField
                  label="Mostrar esta sección en la página"
                  checked={section.visible}
                  onChange={(v) => setSection(section.id, { visible: v })}
                  hint="Apágalo para ocultarla sin borrarla."
                />
                <ToggleField
                  label="Mostrar en el menú superior"
                  checked={section.showInNav}
                  onChange={(v) => setSection(section.id, { showInNav: v })}
                  hint="Agrega un enlace a esta sección en el menú."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Título"
                  value={section.title}
                  onChange={(v) => setSection(section.id, { title: v })}
                />
                <TextField
                  label="Subtítulo / etiqueta"
                  value={section.subtitle}
                  onChange={(v) => setSection(section.id, { subtitle: v })}
                  hint="Texto pequeño en dorado arriba del título."
                />
              </div>
              <ListField
                label="Contenido (párrafos)"
                value={section.paragraphs}
                onChange={(v) => setSection(section.id, { paragraphs: v })}
                rows={6}
                hint="Un párrafo por línea. Usa **dos asteriscos** alrededor de una palabra para ponerla en negritas."
              />
              <ListField
                label="Lista de puntos (opcional)"
                value={section.bullets}
                onChange={(v) => setSection(section.id, { bullets: v })}
                rows={4}
                hint="Un punto por línea. Déjalo vacío si no quieres lista."
              />
              <ImageUploaderField
                value={section.image}
                onChange={(url) => setSection(section.id, { image: url })}
                label="Imagen (opcional)"
                aspectRatio="video"
                placeholderLabel={`Imagen de ${section.title}`}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  label="Posición de la imagen"
                  value={section.imagePosition}
                  onChange={(v) =>
                    setSection(section.id, { imagePosition: v as CustomSection["imagePosition"] })
                  }
                  options={[
                    { value: "right", label: "A la derecha" },
                    { value: "left", label: "A la izquierda" },
                  ]}
                />
                <SelectField
                  label="Color de fondo"
                  value={section.background}
                  onChange={(v) =>
                    setSection(section.id, { background: v as CustomSection["background"] })
                  }
                  options={[
                    { value: "white", label: "Blanco" },
                    { value: "light", label: "Gris claro (#F4F6F9)" },
                  ]}
                />
                <TextField
                  label="Botón (opcional): texto"
                  value={section.buttonLabel}
                  onChange={(v) => setSection(section.id, { buttonLabel: v })}
                />
                <TextField
                  label="Botón (opcional): enlace"
                  value={section.buttonHref}
                  onChange={(v) => setSection(section.id, { buttonHref: v })}
                  placeholder="https://… o #contacto"
                />
              </div>
            </ItemCard>
          ))}
          {sections.length === 0 && (
            <p className="text-sm text-ug-text-secondary">
              Aún no has creado secciones extra.
            </p>
          )}
        </div>
      </Panel>
    </div>
  );
}