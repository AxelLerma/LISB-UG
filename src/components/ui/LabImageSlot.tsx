"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";

export interface LabImageSlotProps {
  src?: string;
  alt: string;
  aspectRatio?: "video" | "square" | "portrait" | "banner";
  placeholderLabel?: string;
  className?: string;
}

const ASPECT_RATIO_CLASSES: Record<string, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  banner: "aspect-[16/5]",
};

export function LabImageSlot({
  src,
  alt,
  aspectRatio = "square",
  placeholderLabel,
  className,
}: LabImageSlotProps) {
  const [hasError, setHasError] = React.useState(false);
  const shouldShowPlaceholder = !src || hasError;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 border-dashed border-ug-gold bg-ug-light ${ASPECT_RATIO_CLASSES[aspectRatio]} ${className ?? ""}`}
      aria-label={placeholderLabel ?? "Contenedor de imagen"}
    >
      {!shouldShowPlaceholder ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt}
          className="object-cover w-full h-full"
          onError={() => setHasError(true)}
          decoding="async"
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-ug-gold/10 flex items-center justify-center mb-3 border border-ug-gold/30">
            <ImageIcon className="w-6 h-6 text-ug-gold" strokeWidth={2} />
          </div>
          <p className="text-sm font-medium text-ug-navy mb-1">
            {placeholderLabel ?? "Imagen no disponible"}
          </p>
          <p className="text-xs text-ug-text-secondary truncate max-w-[200px]">
            {src ? `Ruta esperada: ${src}` : "Agregar imagen en /images/"}
          </p>
        </div>
      )}
    </div>
  );
}