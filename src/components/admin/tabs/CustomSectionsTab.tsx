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
  TextAreaField,
  TextField,
  ToggleField,
  confirmDelete,
  moveById,
  removeById,
  updateById,
} from "../fields";
import type { TabProps } from "../fields";
import type { CustomCardItem, CustomLayoutType, CustomSection } from "@/data/labData";
import { createCustomCard, createCustomSection } from "@/lib/labHelpers";

const LAYOUT_OPTIONS: { value: CustomLayoutType; label: string }[] = [
  { value: "editorial", label: "Tipo 1 — Bloque editorial" },
  { value: "cards", label: "Tipo 2 — Cuadrícula de tarjetas" },
];

export function CustomSectionsTab({ data, patch }: TabProps) {
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [lastCardAdded, setLastCardAdded] = useState<string | null>(null);
  const sections = data.customSections ?? [];

  const setSection = (id: string, changes: Partial<CustomSection>) =>
    patch("customSections", (prev) => updateById(prev, id, changes));

  const setCards = (
    sectionId: string,
    fn: (prev: CustomCardItem[]) => CustomCardItem[]
  ) =>
    patch("customSections", (prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, cards: fn(s.cards ?? []) } : s
      )
    );

  const setCard = (
    sectionId: string,
    cardId: string,
    changes: Partial<CustomCardItem>
  ) => setCards(sectionId, (prev) => updateById(prev, cardId, changes));

  const addSection = () => {
    const section = createCustomSection();
    setLastAdded(section.id);
    patch("customSections", (prev) => [...prev, section]);
  };

  const addCard = (sectionId: string) => {
    const card = createCustomCard();
    setLastCardAdded(card.id);
    setCards(sectionId, (prev) => [...prev, card]);
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Secciones extra"
        description="Crea secciones nuevas para la página pública (por ejemplo: Noticias, Vinculación, Convocatorias). Aparecen entre el Equipo y el Contacto, en el orden de esta lista, y las visibles se agregan solas al menú superior."
      >
        <AddButton label="Crear nueva sección" onClick={addSection} />
        <div className="space-y-3">
          {sections.map((section, index) => (
            <ItemCard
              key={section.id}
              title={section.title}
              subtitle={`${section.visible ? "Visible" : "Oculta"} · ${
                section.layoutType === "cards" ? "Tarjetas" : "Bloque editorial"
              }`}
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
              <ToggleField
                label="Mostrar esta sección en la página y en el menú"
                checked={section.visible}
                onChange={(v) => setSection(section.id, { visible: v })}
                hint="Apágalo para ocultarla sin borrarla."
              />

              <SelectField
                label="Tipo de diseño de sección"
                value={section.layoutType}
                onChange={(v) =>
                  setSection(section.id, { layoutType: v as CustomLayoutType })
                }
                options={LAYOUT_OPTIONS}
                hint="Puedes cambiar de tipo cuando quieras: el contenido de ambos tipos se conserva."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Título"
                  value={section.title}
                  onChange={(v) => setSection(section.id, { title: v })}
                />
                <TextField
                  label="Nombre corto en el menú (opcional)"
                  value={section.navLabel}
                  onChange={(v) => setSection(section.id, { navLabel: v })}
                  hint="Si lo llenas, el menú usa este nombre en lugar del título."
                />
                <TextField
                  label="Subtítulo / etiqueta"
                  value={section.subtitle}
                  onChange={(v) => setSection(section.id, { subtitle: v })}
                  hint="Texto pequeño en dorado arriba del título."
                />
                <SelectField
                  label="Color de fondo"
                  value={section.background}
                  onChange={(v) =>
                    setSection(section.id, { background: v as CustomSection["background"] })
                  }
                  options={[
                    { value: "white", label: "Blanco (#FFFFFF)" },
                    { value: "light", label: "Gris claro (#F4F6F9)" },
                  ]}
                />
              </div>

              {section.layoutType === "editorial" ? (
                <>
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
                        setSection(section.id, {
                          imagePosition: v as CustomSection["imagePosition"],
                        })
                      }
                      options={[
                        { value: "right", label: "A la derecha" },
                        { value: "left", label: "A la izquierda" },
                      ]}
                    />
                    <div />
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
                </>
              ) : (
                <>
                  <TextAreaField
                    label="Texto introductorio"
                    value={section.intro}
                    onChange={(v) => setSection(section.id, { intro: v })}
                    rows={2}
                    hint="Aparece debajo del título de la sección."
                  />

                  <div className="space-y-3 pt-2">
                    <h4 className="font-montserrat font-bold text-ug-navy">
                      Tarjetas / elementos
                    </h4>
                    {(section.cards ?? []).map((card, cardIndex, cards) => (
                      <ItemCard
                        key={card.id}
                        title={card.title}
                        subtitle={card.subtitle}
                        defaultOpen={card.id === lastCardAdded}
                        canMoveUp={cardIndex > 0}
                        canMoveDown={cardIndex < cards.length - 1}
                        onMoveUp={() => setCards(section.id, (prev) => moveById(prev, card.id, -1))}
                        onMoveDown={() => setCards(section.id, (prev) => moveById(prev, card.id, 1))}
                        onDelete={() => {
                          if (confirmDelete(card.title)) {
                            setCards(section.id, (prev) => removeById(prev, card.id));
                          }
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField
                            label="Título"
                            value={card.title}
                            onChange={(v) => setCard(section.id, card.id, { title: v })}
                          />
                          <TextField
                            label="Subtítulo o etiqueta"
                            value={card.subtitle}
                            onChange={(v) => setCard(section.id, card.id, { subtitle: v })}
                          />
                        </div>
                        <TextAreaField
                          label="Descripción"
                          value={card.description}
                          onChange={(v) => setCard(section.id, card.id, { description: v })}
                          rows={4}
                          hint="Puedes usar **negritas** con dos asteriscos."
                        />
                        <ListField
                          label="Lista de puntos / palabras clave (opcional)"
                          value={card.bullets}
                          onChange={(v) => setCard(section.id, card.id, { bullets: v })}
                          rows={3}
                        />
                        <ImageUploaderField
                          value={card.image}
                          onChange={(url) => setCard(section.id, card.id, { image: url })}
                          label="Imagen (opcional)"
                          aspectRatio="video"
                          placeholderLabel={`Imagen de ${card.title}`}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <TextField
                            label="Botón o enlace (opcional): texto"
                            value={card.buttonLabel}
                            onChange={(v) => setCard(section.id, card.id, { buttonLabel: v })}
                          />
                          <TextField
                            label="Botón o enlace (opcional): URL"
                            value={card.buttonHref}
                            onChange={(v) => setCard(section.id, card.id, { buttonHref: v })}
                            placeholder="https://… o #contacto"
                          />
                        </div>
                      </ItemCard>
                    ))}
                    {(section.cards ?? []).length === 0 && (
                      <p className="text-sm text-ug-text-secondary">
                        Aún no hay tarjetas en esta sección.
                      </p>
                    )}
                    <AddButton label="+ Agregar tarjeta" onClick={() => addCard(section.id)} />
                  </div>
                </>
              )}
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