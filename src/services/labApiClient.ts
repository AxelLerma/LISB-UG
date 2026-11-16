import type { LabData } from "@/data/labData";

// Se re-exporta el tipo para que los componentes existentes sigan importándolo de aquí.
export type { LabData };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Error HTTP ${response.status}`);
  }
  return response.json();
}

export class LabApiClient {
  async getLabData(): Promise<LabData> {
    const response = await fetch(`${API_BASE}/api/lab`, {
      cache: "no-store",
    });
    return handleResponse<LabData>(response);
  }

  async updateLabData(partial: Partial<LabData>, token: string): Promise<LabData> {
    const response = await fetch(`${API_BASE}/api/lab`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(partial),
    });
    const result = await handleResponse<{ success: boolean; data: LabData }>(response);
    return result.data;
  }

  async resetLabData(token: string): Promise<LabData> {
    const response = await fetch(`${API_BASE}/api/lab`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ action: "reset" }),
    });
    const result = await handleResponse<{ success: boolean; data: LabData }>(response);
    return result.data;
  }

  async login(password: string): Promise<{ token: string; expiresIn: number }> {
    const response = await fetch(`${API_BASE}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    return handleResponse<{ success: boolean; token: string; expiresIn: number }>(response);
  }

  async uploadImage(file: File, token: string): Promise<{ url: string; fileName: string; size: number }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse<{ success: boolean; url: string; fileName: string; size: number }>(response);
  }
}

export const labApiClient = new LabApiClient();