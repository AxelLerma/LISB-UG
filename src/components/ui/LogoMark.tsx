"use client";

import React, { useEffect, useState } from "react";
import { FlaskConical } from "lucide-react";

export interface LogoMarkProps {
  src?: string;
  alt: string;
  className?: string;
  tone?: "light" | "dark";
}

// Logo que nunca se ve roto: si no hay imagen o falla la carga, muestra un ícono limpio.
export function LogoMark({
  src,
  alt,
  className = "w-10 h-10",
  tone = "dark",
}: LogoMarkProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center rounded-full shrink-0 ${
          tone === "light" ? "bg-white text-ug-navy" : "bg-ug-navy text-white"
        } ${className}`}
      >
        <FlaskConical className="w-1/2 h-1/2" strokeWidth={2} />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`object-contain shrink-0 ${className}`}
      onError={() => setFailed(true)}
      decoding="async"
    />
  );
}