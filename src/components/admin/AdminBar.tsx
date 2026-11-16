"use client";

import React, { useState } from "react";
import { useLab } from "@/context/LabContext";
import { LogIn, LogOut, Edit3 } from "lucide-react";

export function AdminBar() {
  const {
    isAdmin,
    login,
    logout,
    resetToDefaults,
    openAdminPanel,
    toast,
  } = useLab();
  const [loginOpen, setLoginOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(password);
      setLoginOpen(false);
      setPassword("");
      setLoginError("");
    } catch (err: unknown) {
      setLoginError(
        err instanceof Error && err.message ? err.message : "Contraseña incorrecta"
      );
    }
  };

  const handleReset = async () => {
    try {
      await resetToDefaults();
    } catch {
      // El toast de error ya lo muestra el LabProvider
    }
  };

  // El LabProvider guarda `toast` pero nadie lo pintaba: lo mostramos aquí.
  const toastEl = toast ? (
    <div
      role="status"
      className={`fixed bottom-20 right-4 z-[70] max-w-xs px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
        toast.type === "error" ? "bg-red-600" : "bg-ug-navy"
      }`}
    >
      {toast.message}
    </div>
  ) : null;

  if (!isAdmin && !loginOpen) {
    return (
      <>
        <button
          onClick={() => setLoginOpen(true)}
          className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-ug-navy text-white text-sm font-medium rounded-lg shadow-lg hover:bg-ug-institutional transition-colors flex items-center gap-2"
          aria-label="Acceso Administrador"
        >
          <LogIn size={18} strokeWidth={2} />
          Acceso Admin
        </button>
        {toastEl}
      </>
    );
  }

  return (
    <>
      {loginOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-ug-gold/30"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-montserrat text-xl font-bold text-ug-navy mb-4 flex items-center gap-2">
              <LogIn size={20} strokeWidth={2.5} />
              Inicio de Sesión Admin
            </h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-ug-text-secondary">
                  Contraseña de Administrador
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded border border-ug-light text-ug-text focus:ring-2 focus:ring-ug-gold outline-none"
                  placeholder="Ingresa la contraseña"
                  autoFocus
                />
              </div>
              {loginError && (
                <p className="text-sm text-red-500">{loginError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-ug-navy text-white text-sm font-medium rounded hover:bg-ug-institutional transition-colors disabled:opacity-50"
                disabled={!password}
              >
                Iniciar Sesión
              </button>
            </form>
            <button
              onClick={() => setLoginOpen(false)}
              className="mt-4 text-sm text-ug-text-secondary hover:text-ug-navy"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-ug-navy text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12 bg-ug-navy/90 backdrop-blur-md rounded-b-xl border-b border-ug-gold border-t-0">
              <div className="flex items-center gap-3">
                <Edit3 size={20} strokeWidth={2} />
                <span className="font-montserrat font-bold text-sm tracking-wide uppercase">
                  Modo Administrador Activo
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={openAdminPanel}
                  className="px-3 py-1.5 bg-ug-gold text-ug-navy text-xs font-bold rounded hover:bg-white transition-colors"
                >
                  Abrir Panel Editor
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 border border-white/30 text-white text-xs font-bold rounded hover:bg-white/10 transition-colors"
                >
                  Restaurar Valores
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 bg-white/10 text-white text-xs font-bold rounded hover:bg-white/20 transition-colors"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {toastEl}
    </>
  );
}