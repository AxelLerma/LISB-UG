"use client";

import React, { useState } from "react";
import { Globe, Mail, MapPin, Phone } from "lucide-react";
import { useLab } from "@/context/LabContext";

const fieldBase =
  "w-full min-w-0 px-4 py-2 rounded border bg-white dark:bg-ug-slate text-ug-text placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-ug-gold outline-none";

const fieldClass = (hasError: boolean) =>
  `${fieldBase} ${
    hasError ? "border-red-500" : "border-slate-300 dark:border-ug-line"
  }`;

const labelClass = "text-ug-text text-sm font-medium";

export function Contact() {
  // Todos los hooks van SIEMPRE antes de cualquier `return` condicional.
  const { labData } = useLab();
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    tipo: "estudiante",
    programa: "",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!labData) {
    return <section id="contacto" className="bg-white dark:bg-ug-night py-12 md:py-20" />;
  }

  const contact = labData.contact;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Correo inválido";
    }
    if (!formData.programa.trim()) {
      newErrors.programa = "El programa es obligatorio";
    }
    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es obligatorio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const tipoLabels: Record<string, string> = {
    estudiante: "Estudiante UG",
    externo: "Colaborador Externo",
  };

  const websiteHref = /^https?:\/\//i.test(contact.website)
    ? contact.website
    : `https://${contact.website}`;

  return (
    <section id="contacto" className="bg-white dark:bg-ug-night py-12 md:py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          <div className="space-y-6 min-w-0">
            <h2 className="font-montserrat text-2xl sm:text-3xl font-bold text-ug-navy dark:text-ug-sky-soft break-words">
              {contact.title}
            </h2>
            {submitted ? (
              <div className="bg-ug-light dark:bg-ug-surface border border-ug-gold rounded-xl p-6 text-center">
                <h3 className="font-montserrat font-bold text-ug-navy dark:text-ug-sky-soft mb-2 break-words">
                  {contact.successTitle}
                </h3>
                <p className="text-ug-text-secondary break-words">{contact.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 min-w-0">
                    <label htmlFor="nombre" className={labelClass}>
                      Nombre completo
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={fieldClass(Boolean(errors.nombre))}
                      placeholder="Juan Pérez"
                    />
                    {errors.nombre && (
                      <p className="text-red-500 dark:text-red-400 text-xs">{errors.nombre}</p>
                    )}
                  </div>
                  <div className="space-y-2 min-w-0">
                    <label htmlFor="correo" className={labelClass}>
                      Correo institucional
                    </label>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      value={formData.correo}
                      onChange={handleChange}
                      className={fieldClass(Boolean(errors.correo))}
                      placeholder="nombre@ugto.mx"
                    />
                    {errors.correo && (
                      <p className="text-red-500 dark:text-red-400 text-xs">{errors.correo}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="tipo" className={labelClass}>
                    Tipo de solicitante
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className={fieldClass(false)}
                  >
                    {Object.entries(tipoLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="programa" className={labelClass}>
                    Programa de interés
                  </label>
                  <select
                    id="programa"
                    name="programa"
                    value={formData.programa}
                    onChange={handleChange}
                    className={fieldClass(Boolean(errors.programa))}
                  >
                    <option value="">Selecciona una opción</option>
                    {contact.programOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.programa && (
                    <p className="text-red-500 dark:text-red-400 text-xs">{errors.programa}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="mensaje" className={labelClass}>
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={4}
                    className={fieldClass(Boolean(errors.mensaje))}
                    placeholder="Cuéntanos sobre tu interés en el laboratorio..."
                  />
                  {errors.mensaje && (
                    <p className="text-red-500 dark:text-red-400 text-xs">{errors.mensaje}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night text-sm font-semibold rounded-md hover:bg-ug-institutional dark:hover:bg-ug-gold-bright transition-colors"
                >
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>

          {/* Tarjeta lateral */}
          <div className="min-w-0 bg-ug-navy dark:bg-ug-surface border-t-4 border-t-ug-gold dark:border-t-ug-gold-bright dark:border-x dark:border-b dark:border-x-ug-line dark:border-b-ug-line rounded-xl p-6 sm:p-8 text-white">
            <h3 className="font-montserrat text-xl sm:text-2xl font-bold mb-4 break-words">
              {contact.infoTitle}
            </h3>
            <p className="text-white/85 text-sm leading-relaxed mb-6 whitespace-pre-line break-words">
              {contact.infoDescription}
            </p>
            <div className="space-y-4">
              {contact.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 w-5 h-5 text-ug-gold dark:text-ug-gold-bright shrink-0" strokeWidth={2} />
                  <p className="text-white/85 text-sm break-words min-w-0">{contact.address}</p>
                </div>
              )}
              {contact.email && (
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 w-5 h-5 text-ug-gold dark:text-ug-gold-bright shrink-0" strokeWidth={2} />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-white/85 text-sm hover:text-white underline underline-offset-2 break-all min-w-0"
                  >
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phones.map((phone, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Phone className="mt-0.5 w-5 h-5 text-ug-gold dark:text-ug-gold-bright shrink-0" strokeWidth={2} />
                  <a
                    href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                    className="text-white/85 text-sm hover:text-white break-words min-w-0"
                  >
                    {phone}
                  </a>
                </div>
              ))}
              {contact.website && (
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 w-5 h-5 text-ug-gold dark:text-ug-gold-bright shrink-0" strokeWidth={2} />
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/85 text-sm hover:text-white underline underline-offset-2 break-all min-w-0"
                  >
                    {contact.website}
                  </a>
                </div>
              )}
            </div>
            {contact.note && (
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-xs text-white/70 uppercase tracking-wider break-words">
                  {contact.note}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}