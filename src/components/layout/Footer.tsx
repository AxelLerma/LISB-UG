"use client";

import React from "react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Investigación", href: "#investigacion" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Publicaciones", href: "#publicaciones" },
  { label: "Infraestructura", href: "#infraestructura" },
  { label: "Equipo", href: "#equipo" },
  { label: "Contacto", href: "#contacto" },
];

const ugLinks = [
  { label: "Portal UG", href: "https://www.ugto.mx/" },
  { label: "División de Ingenierías", href: "https://www.ugto.mx/" },
  { label: "Transparencia", href: "https://www.ugto.mx/" },
  { label: "Contacto UG", href: "https://www.ugto.mx/" },
];

export function Footer() {
  return (
    <footer className="bg-ug-navy border-t-4 border-t-ug-gold text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Escudo institucional */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 mb-4 flex-shrink-0">
              <LabImageSlot
                src="/images/logos/escudo-ug.png"
                alt="Escudo Universidad de Guanajuato"
                aspectRatio="square"
                placeholderLabel="Escudo UG"
                className="w-16 h-16"
              />
            </div>
            <p className="text-ug-text-secondary text-sm text-center">
              Laboratorio de Sistemas Bio-inspirados<br />
              Universidad de Guanajuato
            </p>
          </div>

          {/* Enlaces de navegación del laboratorio */}
          <div>
            <h4 className="font-montserrat font-bold text-ug-gold mb-4 uppercase tracking-wider text-sm">
              Laboratorio
            </h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-ug-text-secondary text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Enlaces institucionales UG */}
          <div>
            <h4 className="font-montserrat font-bold text-ug-gold mb-4 uppercase tracking-wider text-sm">
              Universidad de Guanajuato
            </h4>
            <ul className="space-y-2">
              {ugLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ug-text-secondary text-sm hover:text-white transition-colors"
                    aria-label={`${link.label} (abre en nueva pestaña)`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Franja inferior con aviso institucional */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-ug-text-secondary">
              © {new Date().getFullYear()} Laboratorio de Sistemas
              Bio-inspirados - Universidad de Guanajuato. Todos los derechos
              reservados.
            </div>
            <div className="text-xs text-ug-text-secondary text-center md:text-right">
              Sitio oficial del LISB-UG • División de Ingenierías
            </div>
          </div>
        </div>
      </div>
      {/* Franja inferior institucional #001F3F */}
      <div className="bg-[#001F3F] py-4 text-center">
        <p className="text-xs text-ug-text-secondary">
          Universidad de Guanajuato - Portal Institucional
        </p>
      </div>
    </footer>
  );
}