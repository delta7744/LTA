import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const res = await apiFetch("/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    await createSession(
      res.data.refreshToken,
      res.data.accessToken,
      res.data.user
    );

    // Response with status 200
    return NextResponse.json(
      { message: "Login successful", user: res.data.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
