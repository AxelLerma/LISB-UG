"use client";

import React, { useEffect, useRef, useState } from "react";
import { useLab } from "@/context/LabContext";

export interface ImageUploaderFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspectRatio?: "video" | "square" | "portrait" | "banner";
  placeholderLabel?: string;
}

export function ImageUploaderField({
  value,
  onChange,
  label,
  aspectRatio = "square",
  placeholderLabel,
}: ImageUploaderFieldProps) {
  const { uploadImage } = useLab();
  const [urlInput, setUrlInput] = useState(value);
  const [uploading, setUploading] = useState(false);
  // Un ref por instancia (antes se usaba un id compartido por aspectRatio y
  // todos los botones terminaban disparando el primer <input> del DOM).
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value);
  }, [value]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
      setUrlInput(url);
    } catch {
      // El toast de error ya lo muestra el LabProvider
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3" data-aspect={aspectRatio} title={placeholderLabel}>
      {label && (
        <label className="text-sm font-medium text-ug-text-secondary block">
          {label}
        </label>
      )}
      <div className="relative aspect-video w-full max-w-md bg-ug-light border-2 border-dashed border-ug-gold rounded-xl overflow-hidden">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label ?? "Imagen"}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <span className="text-xs text-ug-text-secondary mb-2">
              Sin imagen
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-ug-navy text-white px-4 py-2 rounded text-sm font-medium hover:bg-ug-institutional transition-colors disabled:opacity-50"
        >
          {uploading ? "Subiendo…" : "Subir imagen"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </div>

      <form onSubmit={handleUrlSubmit} className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Pegar URL o ruta de imagen…"
          className="flex-1 px-3 py-2 rounded border border-ug-light text-ug-text text-sm focus:ring-2 focus:ring-ug-gold outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-ug-navy text-white text-sm font-medium rounded hover:bg-ug-institutional transition-colors"
        >
          Aplicar
        </button>
      </form>
      {value && (
        <p className="text-xs text-ug-text-secondary truncate max-w-md">
          {value}
        </p>
      )}
    </div>
  );
}