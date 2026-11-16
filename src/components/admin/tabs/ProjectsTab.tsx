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
import type { Project, SectionHeading } from "@/data/labData";
import { getAreaOptions, newId } from "@/lib/labHelpers";

const STATUS_OPTIONS = [
  { value: "activo", label: "Activo (prototipo funcional)" },
  { value: "en-desarrollo", label: "En desarrollo" },
  { value: "completado", label: "Completado (validado)" },
];

export function ProjectsTab({ data, patch }: TabProps) {
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const areaOptions = getAreaOptions(data);

  const setHeading = (changes: Partial<SectionHeading>) =>
    patch("sections", (prev) => ({ ...prev, projects: { ...prev.projects, ...changes } }));

  const setProject = (id: string, changes: Partial<Project>) =>
    patch("projects", (prev) => updateById(prev, id, changes));

  const addProject = () => {
    const id = newId("proj");
    setLastAdded(id);
    patch("projects", (prev) => [
      {
        id,
        title: "Nuevo proyecto",
        subtitle: "",
        description: "",
        image: "",
        area: data.pillars[0]?.id ?? "",
        tags: [],
        status: "en-desarrollo",
        objectives: [],
        hardwareArchitecture: "",
        softwareArchitecture: "",
        participants: [],
      },
      ...prev,
    ]);
  };

  return (
    <div className="space-y-6">
      <Panel title="Encabezado de la sección">
        <TextField
          label="Título"
          value={data.sections.projects.title}
          onChange={(v) => setHeading({ title: v })}
        />
        <TextAreaField
          label="Texto introductorio"
          value={data.sections.projects.subtitle}
          onChange={(v) => setHeading({ subtitle: v })}
          rows={2}
        />
      </Panel>

      <Panel
        title="Proyectos"
        description="Los proyectos nuevos se agregan al principio de la lista."
      >
        <AddButton label="Agregar proyecto" onClick={addProject} />
        <div className="space-y-3">
          {data.projects.map((project, index) => (
            <ItemCard
              key={project.id}
              title={project.title}
              subtitle={project.subtitle}
              defaultOpen={project.id === lastAdded}
              canMoveUp={index > 0}
              canMoveDown={index < data.projects.length - 1}
              onMoveUp={() => patch("projects", (prev) => moveById(prev, project.id, -1))}
              onMoveDown={() => patch("projects", (prev) => moveById(prev, project.id, 1))}
              onDelete={() => {
                if (confirmDelete(project.title)) {
                  patch("projects", (prev) => removeById(prev, project.id));
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Título"
                  value={project.title}
                  onChange={(v) => setProject(project.id, { title: v })}
                />
                <TextField
                  label="Subtítulo"
                  value={project.subtitle}
                  onChange={(v) => setProject(project.id, { subtitle: v })}
                />
                <SelectField
                  label="Área"
                  value={project.area}
                  onChange={(v) => setProject(project.id, { area: v })}
                  options={areaOptions}
                />
                <SelectField
                  label="Estado"
                  value={project.status}
                  onChange={(v) =>
                    setProject(project.id, { status: v as Project["status"] })
                  }
                  options={STATUS_OPTIONS}
                />
              </div>
              <TextAreaField
                label="Descripción corta"
                value={project.description}
                onChange={(v) => setProject(project.id, { description: v })}
                rows={3}
              />
              <ListField
                label="Etiquetas"
                value={project.tags}
                onChange={(v) => setProject(project.id, { tags: v })}
                separator="comma"
                rows={2}
              />
              <ListField
                label="Objetivos (ficha técnica)"
                value={project.objectives ?? []}
                onChange={(v) => setProject(project.id, { objectives: v })}
                rows={4}
              />
              <TextAreaField
                label="Arquitectura de hardware"
                value={project.hardwareArchitecture ?? ""}
                onChange={(v) => setProject(project.id, { hardwareArchitecture: v })}
                rows={3}
              />
              <TextAreaField
                label="Arquitectura de software"
                value={project.softwareArchitecture ?? ""}
                onChange={(v) => setProject(project.id, { softwareArchitecture: v })}
                rows={3}
              />
              <ListField
                label="Participantes"
                value={project.participants ?? []}
                onChange={(v) => setProject(project.id, { participants: v })}
                separator="comma"
                rows={2}
              />
              <ImageUploaderField
                value={project.image}
                onChange={(url) => setProject(project.id, { image: url })}
                label="Imagen del proyecto"
                aspectRatio="video"
                placeholderLabel={`Fotografía de ${project.title}`}
              />
            </ItemCard>
          ))}
          {data.projects.length === 0 && (
            <p className="text-sm text-ug-text-secondary">Aún no hay proyectos.</p>
          )}
        </div>
      </Panel>
    </div>
  );
}