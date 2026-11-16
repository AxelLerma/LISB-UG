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
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay con cierre al hacer clic fuera */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl bg-white border-2 border-ug-gold shadow-2xl overflow-hidden"
      >
        {/* Cabecera del modal */}
        <div className="bg-ug-navy text-white px-6 py-4 flex items-center justify-between">
          <h2
            id="modal-title"
            className="font-montserrat font-bold text-xl tracking-tight"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-white hover:text-ug-gold transition-colors focus:outline-none"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] p-6">
          {imageSrc && (
            <div className="mb-6 aspect-video rounded-xl border border-ug-light overflow-hidden bg-ug-light">
              {imageAlt && (
                <p className="sr-only">{imageAlt}</p>
              )}
              <img
                src={imageSrc}
                alt={imageAlt ?? "Contenido del proyecto"}
                className="object-cover w-full h-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
          <div className="text-ug-text">{children}</div>
        </div>
      </div>
    </div>
  );

}