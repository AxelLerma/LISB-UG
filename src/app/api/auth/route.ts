import { NextRequest, NextResponse } from "next/server";
import { validateAdminPassword, generateSessionToken, registerToken } from "@/server/services/authService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Contraseña requerida" },
        { status: 400 }
      );
    }

    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    const token = generateSessionToken();
    registerToken(token);

    return NextResponse.json({
      success: true,
      token,
      expiresIn: 8 * 60 * 60 * 1000, // 8 horas en ms
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}