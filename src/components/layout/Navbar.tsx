"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/ui/LogoMark";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useLab } from "@/context/LabContext";
import { isExternalLink } from "@/lib/labHelpers";

export function Navbar() {
  const { labData } = useLab();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const settings = labData?.settings;

  // Toda sección extra visible aparece sola en el menú.
  // Si tiene "nombre corto" se usa ese; si no, el título.
  const customLinks = (labData?.customSections ?? [])
    .filter((s) => s.visible)
    .map((s) => ({
      id: s.id,
      label: (s.navLabel ?? "").trim() || (s.title ?? "").trim(),
      href: `#${s.id}`,
    }))
    .filter((link) => link.label.length > 0);
  const links = [...(settings?.navLinks ?? []), ...customLinks];

  const linkProps = (href: string) =>
    isExternalLink(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

  // Cierra el menú móvil al tocar cualquier enlace y hace scroll suave hacia la sección.
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (!href.startsWith("#") || href.length < 2) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white dark:bg-ug-night shadow-sm dark:shadow-none border-b-[3px] border-[#B38E5D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo + nombre */}
          <a href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-none">
            {settings && (
              <>
                <LogoMark
                  src={labData?.images.logo}
                  alt={`Logo de ${settings.labName}`}
                  className="w-9 h-9 sm:w-10 sm:h-10"
                />
                <div className="hidden sm:block w-0.5 h-8 bg-ug-gold shrink-0" />
                <div className="leading-tight min-w-0">
                  <div className="text-ug-navy dark:text-ug-sky-soft font-montserrat font-bold text-sm sm:text-base xl:text-xl tracking-tight line-clamp-2 sm:line-clamp-1 break-words">
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
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-ug-navy dark:text-ug-ink font-medium text-sm hover:text-ug-institutional dark:hover:text-ug-gold-bright transition-colors"
                >
                  {link.label}
                </a>
              ))}
              {settings.navButtonLabel && (
                <a
                  href={settings.navButtonHref}
                  {...linkProps(settings.navButtonHref)}
                  onClick={(e) => handleLinkClick(e, settings.navButtonHref)}
                  className="px-5 py-2 bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night text-sm font-semibold rounded-md hover:bg-ug-institutional dark:hover:bg-ug-gold-bright transition-colors"
                >
                  {settings.navButtonLabel}
                </a>
              )}
              <ThemeToggle />
            </div>
          )}

          {/* Controles móvil: tema + hamburguesa (siempre visibles, no se empujan) */}
          <div className="flex lg:hidden items-center gap-1 shrink-0">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="inline-flex items-center justify-center w-10 h-10 text-ug-navy dark:text-ug-sky-soft hover:text-ug-institutional dark:hover:text-ug-gold-bright"
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
        <div className="lg:hidden bg-white dark:bg-ug-night border-t border-slate-200 dark:border-ug-line max-h-[calc(100dvh-6rem)] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                {...linkProps(link.href)}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block text-ug-navy dark:text-ug-ink text-sm font-medium py-3 border-b border-slate-100 dark:border-ug-line hover:text-ug-institutional dark:hover:text-ug-gold-bright transition-colors break-words"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 space-y-3">
              <ThemeToggle variant="full" />
              {settings.navButtonLabel && (
                <a
                  href={settings.navButtonHref}
                  {...linkProps(settings.navButtonHref)}
                  onClick={(e) => handleLinkClick(e, settings.navButtonHref)}
                  className="block px-5 py-3 bg-ug-navy text-white dark:bg-ug-gold dark:text-ug-night text-sm font-semibold text-center rounded-md hover:bg-ug-institutional dark:hover:bg-ug-gold-bright transition-colors"
                >
                  {settings.navButtonLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}