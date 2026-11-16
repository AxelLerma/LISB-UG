"use client";

import React from "react";
import { ImageUploaderField } from "../ImageUploaderField";
import {
  Panel,
  SelectField,
  TextAreaField,
  TextField,
  updateById,
} from "../fields";
import type { TabProps } from "../fields";
import type { HeroContent, HeroIndicator, IndicatorSource } from "@/data/labData";

const SOURCE_OPTIONS: { value: IndicatorSource; label: string }[] = [
  { value: "manual", label: "Escribir el número a mano" },
  { value: "pillars", label: "Automático: número de áreas de investigación" },
  { value: "activeProjects", label: "Automático: proyectos activos" },
  { value: "publications", label: "Automático: número de publicaciones" },
];

export function HeroTab({ data, patch }: TabProps) {
  const hero = data.hero;

  const setHero = (changes: Partial<HeroContent>) =>
    patch("hero", (prev) => ({ ...prev, ...changes }));

  const setIndicator = (id: string, changes: Partial<HeroIndicator>) =>
    patch("hero", (prev) => ({
      ...prev,
      indicators: updateById(prev.indicators, id, changes),
    }));

  return (
    <div className="space-y-6">
      <Panel title="Textos principales">
        <TextField
          label="Etiqueta superior"
          value={hero.badge}
          onChange={(v) => setHero({ badge: v })}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Título (línea 1)"
            value={hero.titleLine1}
            onChange={(v) => setHero({ titleLine1: v })}
          />
          <TextField
            label="Subtítulo destacado (línea 2, en azul)"
            value={hero.titleLine2}
            onChange={(v) => setHero({ titleLine2: v })}
          />
        </div>
        <TextAreaField
          label="Descripción"
          value={hero.description}
          onChange={(v) => setHero({ description: v })}
          rows={4}
          hint="Usa **dos asteriscos** alrededor de una palabra para ponerla en negritas."
        />
      </Panel>

      <Panel title="Botones">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Botón principal: texto"
            value={hero.primaryButtonLabel}
            onChange={(v) => setHero({ primaryButtonLabel: v })}
          />
          <TextField
            label="Botón principal: enlace"
            value={hero.primaryButtonHref}
            onChange={(v) => setHero({ primaryButtonHref: v })}
          />
          <TextField
            label="Botón secundario: texto"
            value={hero.secondaryButtonLabel}
            onChange={(v) => setHero({ secondaryButtonLabel: v })}
          />
          <TextField
            label="Botón secundario: enlace"
            value={hero.secondaryButtonHref}
            onChange={(v) => setHero({ secondaryButtonHref: v })}
          />
        </div>
        <p className="text-xs text-ug-text-secondary">
          Deja el texto vacío para ocultar un botón.
        </p>
      </Panel>

      <Panel title="Imagen principal">
        <ImageUploaderField
          value={data.images.hero}
          onChange={(url) => patch("images", (prev) => ({ ...prev, hero: url }))}
          label="Imagen del Hero"
          aspectRatio="video"
          placeholderLabel="Fotografía principal del laboratorio"
        />
        <TextField
          label="Pie de foto"
          value={hero.caption}
          onChange={(v) => setHero({ caption: v })}
        />
      </Panel>

      <Panel
        title="Indicadores numéricos"
        description="Los tres números que aparecen debajo del Hero."
      >
        <div className="space-y-4">
          {hero.indicators.map((indicator, idx) => (
            <div
              key={indicator.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200 rounded-lg p-4"
            >
              <TextField
                label={`Indicador ${idx + 1}: etiqueta`}
                value={indicator.label}
                onChange={(v) => setIndicator(indicator.id, { label: v })}
              />
              <SelectField
                label="De dónde sale el número"
                value={indicator.source}
                onChange={(v) =>
                  setIndicator(indicator.id, { source: v as IndicatorSource })
                }
                options={SOURCE_OPTIONS}
              />
              {indicator.source === "manual" ? (
                <TextField
                  label="Número o texto"
                  value={indicator.value}
                  onChange={(v) => setIndicator(indicator.id, { value: v })}
                  placeholder="Ej. 12"
                />
              ) : (
                <div className="flex items-end text-xs text-ug-text-secondary">
                  Se calcula solo a partir del contenido del sitio.
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}