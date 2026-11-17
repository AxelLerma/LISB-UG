"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface ThemeToggleProps {
  variant?: "icon" | "full";
  className?: string;
}

// Los íconos y textos se alternan con CSS (clase `dark` de <html>), no con estado,
// así nunca hay diferencias entre servidor y cliente.
export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const label = theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        className={`flex w-full items-center justify-between gap-3 px-4 py-3 rounded-md border border-slate-200 dark:border-ug-line text-sm font-medium text-ug-navy dark:text-ug-sky-soft hover:bg-ug-light dark:hover:bg-ug-surface transition-colors ${className}`}
      >
        <span>
          <span className="dark:hidden">Activar modo oscuro</span>
          <span className="hidden dark:inline">Activar modo claro</span>
        </span>
        <span className="inline-flex" aria-hidden="true">
          <Moon size={18} className="block dark:hidden" />
          <Sun size={18} className="hidden dark:block text-ug-gold-bright" />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center w-10 h-10 rounded-full border border-ug-gold/40 text-ug-navy dark:text-ug-gold-bright dark:border-ug-gold/50 hover:bg-ug-light dark:hover:bg-ug-surface transition-colors ${className}`}
    >
      <Moon size={18} className="block dark:hidden" aria-hidden="true" />
      <Sun size={18} className="hidden dark:block" aria-hidden="true" />
    </button>
  );
}