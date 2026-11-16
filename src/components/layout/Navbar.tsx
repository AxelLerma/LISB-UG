"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { LabImageSlot } from "@/components/ui/LabImageSlot";

const navLinks = [
  { label: "Investigación", href: "#investigacion" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Publicaciones", href: "#publicaciones" },
  { label: "Infraestructura", href: "#infraestructura" },
  { label: "Equipo", href: "#equipo" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-[3rem] z-50 w-full bg-white transition-all duration-300 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="border-b border-b-ug-gold border-[3px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Lado izquierdo: Logo + Título */}
              <div className="flex items-center gap-4">
                <div className="hidden md:block w-10 h-10 flex-shrink-0">
                  <LabImageSlot
                    src="/images/logos/escudo-ug.png"
                    alt="Escudo Universidad de Guanajuato"
                    aspectRatio="square"
                    placeholderLabel="Escudo UG"
                    className="w-10 h-10"
                  />
                </div>
                {/* Línea vertical divisoria dorada */}
                <div className="hidden md:block w-0.5 h-8 bg-ug-gold" />
                <div className="text-ug-navy font-montserrat font-bold text-xl tracking-tight">
                  Laboratorio de Sistemas Bio-inspirados
                </div>
              </div>

              {/* Lado derecho: Enlaces + Botón */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-ug-navy font-medium text-sm hover:text-ug-institutional transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#contacto"
                  className="px-5 py-2 bg-ug-navy text-white text-sm font-semibold rounded-md hover:bg-ug-institutional transition-colors"
                >
                  Colabora / Únete
                </a>
              </div>

              {/* Botón móvil */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className="text-ug-navy hover:text-ug-institutional"
                  aria-label={isMobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-b-ug-gold border-[3px]">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-ug-navy text-sm font-medium py-2 hover:text-ug-institutional transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contacto"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-5 py-3 bg-ug-navy text-white text-sm font-semibold text-center rounded-md hover:bg-ug-institutional transition-colors"
              >
                Colabora / Únete
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}