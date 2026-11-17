"use client";

import React, { useEffect, useCallback } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  imageSrc,
  imageAlt,
  children,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay con cierre al hacer clic fuera */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl bg-white dark:bg-ug-surface border-2 border-ug-gold dark:border-ug-gold/70 shadow-2xl overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="bg-ug-navy dark:bg-ug-slate text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <h2
            id="modal-title"
            className="font-montserrat font-bold text-lg sm:text-xl tracking-tight break-words min-w-0"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="shrink-0 text-white hover:text-ug-gold dark:hover:text-ug-gold-bright transition-colors focus:outline-none"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="overflow-y-auto overflow-x-hidden max-h-[calc(90vh-4rem)] p-4 sm:p-6">
          {imageSrc && (
            <div className="mb-6 aspect-video rounded-xl border border-ug-light dark:border-ug-line overflow-hidden bg-ug-light dark:bg-ug-slate">
              {imageAlt && (
                <p className="sr-only">{imageAlt}</p>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={imageAlt ?? "Contenido del proyecto"}
                className="object-cover w-full h-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <div className="text-ug-text break-words">{children}</div>
        </div>
      </div>
    </div>
  );
}