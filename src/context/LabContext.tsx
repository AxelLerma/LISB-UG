"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { labApiClient, LabData } from "@/services/labApiClient";

type ToastState = { message: string; type: "success" | "error" } | null;

interface LabContextType {
  labData: LabData | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  token: string | null;
  toast: ToastState;
  adminPanelOpen: boolean;
  loginOpen: boolean;
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (password: string) => Promise<void>;
  logout: () => void;
  updateLabData: (newData: Partial<LabData>) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  resetToDefaults: () => Promise<void>;
  showToast: (message: string, type?: "success" | "error") => void;
}

// Valor por defecto seguro (SSR / componentes fuera del provider)
const defaultLabContext: LabContextType = {
  labData: null,
  loading: true,
  error: null,
  isAdmin: false,
  token: null,
  toast: null,
  adminPanelOpen: false,
  loginOpen: false,
  openAdminPanel: () => {},
  closeAdminPanel: () => {},
  openLoginModal: () => {},
  closeLoginModal: () => {},
  login: async () => {},
  logout: () => {},
  updateLabData: async () => {},
  uploadImage: async () => "",
  resetToDefaults: async () => {},
  showToast: () => {},
};

const LabContext = createContext<LabContextType>(defaultLabContext);

function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export function LabProvider({ children }: { children: ReactNode }) {
  const [labData, setLabData] = useState<LabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({ message, type });
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadLabData() {
      try {
        setLoading(true);
        const data = await labApiClient.getLabData();
        if (cancelled) return;
        setLabData(data);
        setError(null);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(getErrorMessage(err, "Error al cargar datos del laboratorio"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadLabData();
    return () => {
      cancelled = true;
    };
  }, []);

  const openAdminPanel = useCallback(() => setAdminPanelOpen(true), []);
  const closeAdminPanel = useCallback(() => setAdminPanelOpen(false), []);
  const openLoginModal = useCallback(() => setLoginOpen(true), []);
  const closeLoginModal = useCallback(() => setLoginOpen(false), []);

  const login = useCallback(
    async (password: string) => {
      try {
        const result = await labApiClient.login(password);
        setToken(result.token);
        setIsAdmin(true);
        // Entrada directa al editor: se cierra el login y se abre el panel.
        setLoginOpen(false);
        setAdminPanelOpen(true);
        showToast("Sesión de administrador iniciada", "success");
      } catch (err: unknown) {
        setIsAdmin(false);
        setToken(null);
        showToast(getErrorMessage(err, "Contraseña incorrecta"), "error");
        throw err;
      }
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setToken(null);
    setIsAdmin(false);
    setAdminPanelOpen(false);
    showToast("Sesión cerrada", "success");
  }, [showToast]);

  const updateLabData = useCallback(
    async (newData: Partial<LabData>) => {
      if (!token) {
        throw new Error("No hay sesión de administrador activa");
      }
      try {
        const updated = await labApiClient.updateLabData(newData, token);
        setLabData(updated);
        showToast("Cambios guardados correctamente", "success");
      } catch (err: unknown) {
        showToast(getErrorMessage(err, "Error al guardar cambios"), "error");
        throw err;
      }
    },
    [token, showToast]
  );

  const uploadImage = useCallback(
    async (file: File): Promise<string> => {
      if (!token) {
        throw new Error("No hay sesión de administrador activa");
      }
      try {
        const result = await labApiClient.uploadImage(file, token);
        showToast("Imagen subida correctamente", "success");
        return result.url;
      } catch (err: unknown) {
        showToast(getErrorMessage(err, "Error al subir la imagen"), "error");
        throw err;
      }
    },
    [token, showToast]
  );

  const resetToDefaults = useCallback(async () => {
    if (!token) {
      throw new Error("No hay sesión de administrador activa");
    }
    try {
      const resetData = await labApiClient.resetLabData(token);
      setLabData(resetData);
      showToast("Datos restablecidos a valores iniciales", "success");
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Error al restablecer datos"), "error");
      throw err;
    }
  }, [token, showToast]);

  return (
    <LabContext.Provider
      value={{
        labData,
        loading,
        error,
        isAdmin,
        token,
        toast,
        adminPanelOpen,
        loginOpen,
        openAdminPanel,
        closeAdminPanel,
        openLoginModal,
        closeLoginModal,
        login,
        logout,
        updateLabData,
        uploadImage,
        resetToDefaults,
        showToast,
      }}
    >
      {children}
    </LabContext.Provider>
  );
}

export function useLab() {
  return useContext(LabContext);
}