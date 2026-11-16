"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/ui/LogoMark";
import { useLab } from "@/context/LabContext";
import { isExternalLink } from "@/lib/labHelpers";

export function Navbar() {
  const { labData } = useLab();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const settings = labData?.settings;

  // Las secciones extra visibles que lo pidan se agregan solas al menú.
  const customLinks = (labData?.customSections ?? [])
    .filter((s) => s.visible && s.showInNav && s.title.trim())
    .map((s) => ({ id: s.id, label: s.title, href: `#${s.id}` }));
  const links = [...(settings?.navLinks ?? []), ...customLinks];

  const linkProps = (href: string) =>
    isExternalLink(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b-[3px] border-[#B38E5D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo + nombre */}
          <a href="/" className="flex items-center gap-3 min-w-0">
            {settings && (
              <>
                <LogoMark
                  src={labData?.images.logo}
                  alt={`Logo de ${settings.labName}`}
                  className="w-10 h-10"
                />
                <div className="hidden sm:block w-0.5 h-8 bg-ug-gold" />
                <div className="leading-tight min-w-0">
                  <div className="text-ug-navy font-montserrat font-bold text-base xl:text-xl tracking-tight truncate">
                    {settings.labName}
                  </div>
                  {settings.institutionalSubtitle && (
                    <div className="hidden sm:block text-xs text-ug-text-secondary tracking-wide truncate">
                      {settings.institutionalSubtitle}
                    </div>
                  )}
                </div>
              </>
            )}
          </a>

          {/* Enlaces escritorio */}
          {settings && (
            <div className="hidden lg:flex items-center gap-6 shrink-0">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  {...linkProps(link.href)}
                  className="text-ug-navy font-medium text-sm hover:text-ug-institutional transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {settings.navButtonLabel && (
                <a
                  href={settings.navButtonHref}
                  {...linkProps(settings.navButtonHref)}
                  className="px-5 py-2 bg-ug-navy text-white text-sm font-semibold rounded-md hover:bg-ug-institutional transition-colors"
                >
                  {settings.navButtonLabel}
                </a>
              )}
            </div>
          )}

          {/* Botón móvil */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-ug-navy hover:text-ug-institutional"
              aria-label={isMobileMenuOpen ? "Cerrar menú móvil" : "Abrir menú móvil"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={24} strokeWidth={2.5} />
              ) : (
                <Menu size={24} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && settings && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                {...linkProps(link.href)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-ug-navy text-sm font-medium py-2 hover:text-ug-institutional transition-colors"
              >
                {link.label}
              </a>
            ))}
            {settings.navButtonLabel && (
              <a
                href={settings.navButtonHref}
                {...linkProps(settings.navButtonHref)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-5 py-3 bg-ug-navy text-white text-sm font-semibold text-center rounded-md hover:bg-ug-institutional transition-colors"
              >
                {settings.navButtonLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}