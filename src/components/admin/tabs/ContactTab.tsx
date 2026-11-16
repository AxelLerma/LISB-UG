"use client";

import React from "react";
import {
  LinkListEditor,
  ListField,
  Panel,
  TextAreaField,
  TextField,
} from "../fields";
import type { TabProps } from "../fields";
import type { ContactContent, FooterContent } from "@/data/labData";

export function ContactTab({ data, patch }: TabProps) {
  const c = data.contact;
  const f = data.footer;

  const setContact = (changes: Partial<ContactContent>) =>
    patch("contact", (prev) => ({ ...prev, ...changes }));

  const setFooter = (changes: Partial<FooterContent>) =>
    patch("footer", (prev) => ({ ...prev, ...changes }));

  return (
    <div className="space-y-6">
      <Panel title="Formulario de contacto">
        <TextField
          label="Título de la sección"
          value={c.title}
          onChange={(v) => setContact({ title: v })}
        />
        <ListField
          label="Opciones de «Programa de interés»"
          value={c.programOptions}
          onChange={(v) => setContact({ programOptions: v })}
          rows={4}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Título al enviar el mensaje"
            value={c.successTitle}
            onChange={(v) => setContact({ successTitle: v })}
          />
          <TextAreaField
            label="Texto al enviar el mensaje"
            value={c.successMessage}
            onChange={(v) => setContact({ successMessage: v })}
            rows={3}
          />
        </div>
      </Panel>

      <Panel
        title="Tarjeta de información de contacto"
        description="El cuadro azul que aparece al lado del formulario."
      >
        <TextField
          label="Título de la tarjeta"
          value={c.infoTitle}
          onChange={(v) => setContact({ infoTitle: v })}
        />
        <TextAreaField
          label="Texto descriptivo"
          value={c.infoDescription}
          onChange={(v) => setContact({ infoDescription: v })}
          rows={4}
          hint="Cada renglón se respeta tal como lo escribas."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Dirección física en la UG"
            value={c.address}
            onChange={(v) => setContact({ address: v })}
          />
          <TextField
            label="Correo electrónico"
            type="email"
            value={c.email}
            onChange={(v) => setContact({ email: v })}
          />
          <TextField
            label="Sitio web"
            value={c.website}
            onChange={(v) => setContact({ website: v })}
          />
          <TextField
            label="Nota al pie de la tarjeta"
            value={c.note}
            onChange={(v) => setContact({ note: v })}
          />
        </div>
        <ListField
          label="Teléfonos"
          value={c.phones}
          onChange={(v) => setContact({ phones: v })}
          rows={3}
          hint="Un teléfono por línea. Déjalo vacío si no quieres mostrar ninguno."
        />
      </Panel>

      <Panel title="Pie de página">
        <TextAreaField
          label="Texto bajo el logo"
          value={f.description}
          onChange={(v) => setFooter({ description: v })}
          rows={2}
        />
        <TextField
          label="Título de la columna del laboratorio"
          value={f.labColumnTitle}
          onChange={(v) => setFooter({ labColumnTitle: v })}
        />
        <LinkListEditor
          label="Enlaces de la columna del laboratorio"
          items={f.labLinks}
          onChange={(fn) =>
            patch("footer", (prev) => ({ ...prev, labLinks: fn(prev.labLinks) }))
          }
        />
        <TextField
          label="Título de la columna institucional"
          value={f.ugColumnTitle}
          onChange={(v) => setFooter({ ugColumnTitle: v })}
        />
        <LinkListEditor
          label="Enlaces de la columna institucional"
          items={f.ugLinks}
          onChange={(fn) =>
            patch("footer", (prev) => ({ ...prev, ugLinks: fn(prev.ugLinks) }))
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Aviso de derechos de autor"
            value={f.copyright}
            onChange={(v) => setFooter({ copyright: v })}
            hint="El símbolo © y el año se agregan solos."
          />
          <TextField
            label="Nota a la derecha"
            value={f.rightNote}
            onChange={(v) => setFooter({ rightNote: v })}
          />
          <TextField
            label="Texto de la franja inferior"
            value={f.bottomStrip}
            onChange={(v) => setFooter({ bottomStrip: v })}
          />
        </div>
      </Panel>
    </div>
  );
}