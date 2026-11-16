"use client";

import React from "react";
import { ImageUploaderField } from "../ImageUploaderField";
import { LinkListEditor, Panel, TextField } from "../fields";
import type { TabProps } from "../fields";
import type { SiteSettings } from "@/data/labData";

export function GeneralTab({ data, patch }: TabProps) {
  const s = data.settings;

  const setSettings = (changes: Partial<SiteSettings>) =>
    patch("settings", (prev) => ({ ...prev, ...changes }));

  return (
    <div className="space-y-6">
      <Panel
        title="Identidad del laboratorio"
        description="Aparece en el menú superior y en el pie de página."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Nombre del laboratorio"
            value={s.labName}
            onChange={(v) => setSettings({ labName: v })}
          />
          <TextField
            label="Subtítulo institucional"
            value={s.institutionalSubtitle}
            onChange={(v) => setSettings({ institutionalSubtitle: v })}
            placeholder="Universidad de Guanajuato"
          />
        </div>
        <ImageUploaderField
          value={data.images.logo}
          onChange={(url) => patch("images", (prev) => ({ ...prev, logo: url }))}
          label="Logo (sube un archivo PNG/JPG/WEBP o pega una URL)"
          aspectRatio="square"
          placeholderLabel="Logo del laboratorio"
        />
      </Panel>

      <Panel
        title="Barra superior"
        description="Franja azul delgada que está arriba de todo el sitio."
      >
        <LinkListEditor
          label="Enlaces de la barra superior"
          items={s.topBarLinks}
          onChange={(fn) =>
            patch("settings", (prev) => ({ ...prev, topBarLinks: fn(prev.topBarLinks) }))
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Texto del enlace de la derecha"
            value={s.topBarRightLabel}
            onChange={(v) => setSettings({ topBarRightLabel: v })}
            hint="Déjalo vacío para ocultarlo."
          />
          <TextField
            label="Dirección del enlace de la derecha"
            value={s.topBarRightHref}
            onChange={(v) => setSettings({ topBarRightHref: v })}
          />
        </div>
      </Panel>

      <Panel
        title="Menú de navegación"
        description="Las secciones extra visibles con la opción «Mostrar en el menú» se agregan solas al final."
      >
        <LinkListEditor
          label="Enlaces del menú"
          items={s.navLinks}
          onChange={(fn) =>
            patch("settings", (prev) => ({ ...prev, navLinks: fn(prev.navLinks) }))
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Texto del botón principal"
            value={s.navButtonLabel}
            onChange={(v) => setSettings({ navButtonLabel: v })}
            hint="Déjalo vacío para ocultar el botón."
          />
          <TextField
            label="Dirección del botón principal"
            value={s.navButtonHref}
            onChange={(v) => setSettings({ navButtonHref: v })}
            placeholder="#contacto"
          />
        </div>
      </Panel>
    </div>
  );
}