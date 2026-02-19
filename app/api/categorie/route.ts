import { apiFetch } from "@/lib/api";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
    

export async function GET(req: NextRequest) {
  try {
    const categories = await apiFetch("/category", {
      method: "GET",
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}