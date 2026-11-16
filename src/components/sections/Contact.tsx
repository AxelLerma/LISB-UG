"use client";

import React, { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    tipo: "estudiante",
    programa: "servicio-social",
    mensaje: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      newErrors.correo = "Correo invÃ¡lido";
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

  const programaOptions = [
    { value: "servicio-social", label: "Servicio Social UG" },
    { value: "verano-investigacion", label: "Verano de InvestigaciÃ³n UG" },
    { value: "tesis", label: "Tesis" },
    { value: "colaboracion", label: "ColaboraciÃ³n Externa" },
  ];

  return (
    <section id="contacto" className="bg-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="font-montserrat text-3xl font-bold text-ug-navy">
              ContÃ¡ctanos
            </h2>
            {submitted ? (
              <div className="bg-ug-light border border-ug-gold rounded-xl p-6 text-center">
                <h3 className="font-montserrat font-bold text-ug-navy mb-2">
                  Â¡Mensaje enviado!
                </h3>
                <p className="text-ug-text-secondary">
                  Gracias por contactar al Laboratorio de Sistemas
                  Bio-inspirados. Nos comunicaremos contigo a la brevedad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-ug-text text-sm font-medium">
                      Nombre completo
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded border ${
                        errors.nombre ? "border-red-500" : "border-ug-light"
                      } focus:ring-2 focus:ring-ug-gold outline-none`}
                      placeholder="Juan PÃ©rez"
                    />
                    {errors.nombre && (
                      <p className="text-red-500 text-xs">{errors.nombre}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="correo" className="text-ug-text text-sm font-medium">
                      Correo institucional
                    </label>
                    <input
                      id="correo"
                      name="correo"
                      type="email"
                      value={formData.correo}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded border ${
                        errors.correo ? "border-red-500" : "border-ug-light"
                      } focus:ring-2 focus:ring-ug-gold outline-none`}
                      placeholder="nombre@ugto.mx"
                    />
                    {errors.correo && (
                      <p className="text-red-500 text-xs">{errors.correo}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="tipo" className="text-ug-text text-sm font-medium">
                    Tipo de solicitante
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border border-ug-light focus:ring-2 focus:ring-ug-gold outline-none"
                  >
                    {Object.entries(tipoLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="programa" className="text-ug-text text-sm font-medium">
                    Programa de interÃ©s
                  </label>
                  <select
                    id="programa"
                    name="programa"
                    value={formData.programa}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded border border-ug-light focus:ring-2 focus:ring-ug-gold outline-none"
                  >
                    {programaOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.programa && (
                    <p className="text-red-500 text-xs">{errors.programa}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="mensaje" className="text-ug-text text-sm font-medium">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 rounded border ${
                      errors.mensaje ? "border-red-500" : "border-ug-light"
                    } focus:ring-2 focus:ring-ug-gold outline-none`}
                    placeholder="CuÃ©ntanos sobre tu interÃ©s en el laboratorio..."
                  />
                  {errors.mensaje && (
                    <p className="text-red-500 text-xs">{errors.mensaje}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-ug-navy text-white text-sm font-semibold rounded-md hover:bg-ug-institutional transition-colors"
                >
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
          {/* Tarjeta lateral */}
          <div className="bg-ug-navy border-t-4 border-t-ug-gold rounded-xl p-8 text-white">
            <h3 className="font-montserrat text-2xl font-bold mb-4">
              InformaciÃ³n de Contacto
            </h3>
            <p className="text-ug-light text-sm leading-relaxed mb-6">
              Laboratorio de Sistemas Bio-inspirados (LISB-UG)<br />
              Universidad de Guanajuato<br />
              DivisiÃ³n de IngenierÃ­as<br />
              Campus LeÃ³n, Guanajuato, MÃ©xico
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 text-ug-gold">ðŸ“</span>
                <p className="text-ug-text-secondary text-sm">
                  DivisiÃ³n de IngenierÃ­as, UG
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 text-ug-gold">âœ‰ï¸</span>
                <p className="text-ug-text-secondary text-sm">
                  lisb-ug@ugto.mx
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 w-5 h-5 text-ug-gold">ðŸŒ</span>
                <p className="text-ug-text-secondary text-sm">
                  www.ugto.mx
                </p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-xs text-ug-text-secondary uppercase tracking-wider">
                Para estudiantes de la UG y colaboradores externos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}