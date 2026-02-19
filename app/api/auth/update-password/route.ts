import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { authorize } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { authorized, token, response } = await authorize();
    if (!authorized) return response;

    const { currentPassword, newPassword } = await req.json();

    const result =await apiFetch("/auth/update-password", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return NextResponse.json(result);
    
  } catch (error) {

    const errorMessage =
      error instanceof Error ? error.message : "failed to update password";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
  