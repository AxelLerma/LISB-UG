"use client";

import React, { useEffect, useState } from "react";
import { useLab } from "@/context/LabContext";
import { Edit3, LogIn, LogOut } from "lucide-react";

export function AdminBar() {
  const {
    isAdmin,
    adminPanelOpen,
    loginOpen,
    closeLoginModal,
    login,
    logout,
    openAdminPanel,
    toast,
  } = useLab();
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loginOpen) {
      setPassword("");
      setLoginError("");
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLoginModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [loginOpen, closeLoginModal]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Si la contraseña es correcta, el contexto cierra este diálogo
      // y abre el editor automáticamente.
      await login(password);
    } catch (err: unknown) {
      setLoginError(
        err instanceof Error && err.message ? err.message : "Contraseña incorrecta"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Diálogo de acceso (se abre desde el enlace del Footer) */}
      {loginOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={closeLoginModal}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-ug-gold/30"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Acceso de administración"
          >
            <h2 className="font-montserrat text-xl font-bold text-ug-navy mb-4 flex items-center gap-2">
              <LogIn size={20} strokeWidth={2.5} />
              Acceso de Administración
            </h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-2">
                <label
                  htmlFor="admin-password"
                  className="text-sm font-medium text-ug-text-secondary"
                >
                  Contraseña
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-slate-300 text-ug-text focus:ring-2 focus:ring-ug-gold outline-none"
                  placeholder="Ingresa la contraseña"
                  autoFocus
                />
              </div>
              {loginError && <p className="text-sm text-red-500">{loginError}</p>}
              <button
                type="submit"
                className="w-full py-2 bg-ug-navy text-white text-sm font-medium rounded hover:bg-ug-institutional transition-colors disabled:opacity-50"
                disabled={!password || submitting}
              >
                {submitting ? "Verificando…" : "Entrar al editor"}
              </button>
            </form>
            <button
              onClick={closeLoginModal}
              className="mt-4 text-sm text-ug-text-secondary hover:text-ug-navy"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Barra flotante discreta: solo existe con sesión de administrador activa */}
      {isAdmin && !adminPanelOpen && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-ug-navy text-white rounded-full shadow-lg pl-4 pr-2 py-2 border border-ug-gold">
          <span className="hidden sm:inline text-xs font-semibold tracking-wide uppercase">
            Modo administrador
          </span>
          <button
            onClick={openAdminPanel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ug-gold text-ug-navy text-xs font-bold rounded-full hover:bg-white transition-colors"
          >
            <Edit3 size={14} strokeWidth={2.5} />
            Abrir editor
          </button>
          <button
            onClick={logout}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Cerrar sesión de administrador"
            title="Cerrar sesión"
          >
            <LogOut size={14} strokeWidth={2} />
          </button>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className={`fixed bottom-20 right-4 z-[90] max-w-xs px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            toast.type === "error" ? "bg-red-600" : "bg-ug-navy"
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
}