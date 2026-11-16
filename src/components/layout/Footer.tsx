"use client";

import React from "react";
import { Lock } from "lucide-react";
import { LogoMark } from "@/components/ui/LogoMark";
import { useLab } from "@/context/LabContext";
import { isExternalLink } from "@/lib/labHelpers";

export function Footer() {
  const { labData, isAdmin, openAdminPanel, openLoginModal } = useLab();
  const footer = labData?.footer;
  const settings = labData?.settings;

  const externalProps = (href: string) =>
    isExternalLink(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <footer className="bg-ug-navy border-t-4 border-t-ug-gold text-white">
      {labData && footer && settings ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Logo institucional */}
            <div className="flex flex-col items-center text-center">
              <LogoMark
                src={labData.images.logo}
                alt={`Logo de ${settings.labName}`}
                className="w-16 h-16 mb-4"
                tone="light"
              />
              <p className="text-white/70 text-sm text-center whitespace-pre-line">
                {footer.description}
              </p>
            </div>

            {/* Enlaces del laboratorio */}
            <div>
              <h4 className="font-montserrat font-bold text-ug-gold mb-4 uppercase tracking-wider text-sm">
                {footer.labColumnTitle}
              </h4>
              <ul className="space-y-2">
                {footer.labLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      {...externalProps(link.href)}
                      className="text-white/70 text-sm hover:text-white transition-colors"
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
                {footer.ugColumnTitle}
              </h4>
              <ul className="space-y-2">
                {footer.ugLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      {...externalProps(link.href)}
                      className="text-white/70 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Franja con aviso de derechos */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-xs text-white/70 text-center md:text-left">
                © {new Date().getFullYear()} {footer.copyright}
              </div>
              <div className="text-xs text-white/70 text-center md:text-right">
                {footer.rightNote}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-40" />
      )}

      {/* Franja inferior institucional con acceso discreto de administración */}
      <div className="bg-[#001F3F] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/70 text-center sm:text-left">
            {footer?.bottomStrip ?? ""}
          </p>
          <button
            type="button"
            onClick={isAdmin ? openAdminPanel : openLoginModal}
            className="inline-flex items-center gap-1 text-[11px] text-white/35 hover:text-white/80 transition-colors"
            aria-label={isAdmin ? "Abrir editor del sitio" : "Acceso de administración"}
          >
            <Lock size={11} strokeWidth={2} />
            {isAdmin ? "Abrir editor" : "Administración"}
          </button>
        </div>
      </div>
    </footer>
  );
}