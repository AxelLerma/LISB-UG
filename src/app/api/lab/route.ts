import { NextRequest, NextResponse } from "next/server";
import { labRepository } from "@/server/services/labRepository";
import { verifySessionToken } from "@/server/services/authService";

function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
}

export async function GET() {
  try {
    const data = await labRepository.getAll();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener datos del laboratorio" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { error: "Sesión de administrador inválida o expirada" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updated = await labRepository.update(body);
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar datos del laboratorio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!verifySessionToken(token)) {
      return NextResponse.json(
        { error: "Sesión de administrador inválida o expirada" },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (body.action === "reset") {
      const resetData = await labRepository.reset();
      return NextResponse.json({
        success: true,
        message: "Datos restablecidos a valores de fábrica",
        data: resetData,
      });
    }

    return NextResponse.json(
      { error: "Acción no reconocida" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error al procesar solicitud" },
      { status: 500 }
    );
  }
}