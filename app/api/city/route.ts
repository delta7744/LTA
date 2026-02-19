import { apiFetch } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
    

export async function GET(req: NextRequest) {
  try {
    const cites = await apiFetch("/city", {
      method: "GET",
    });

    return NextResponse.json(cites);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
