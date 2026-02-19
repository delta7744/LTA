import { apiFetch } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  if (!type) {
    return NextResponse.json(
      { error: "Trip type is required" },
      { status: 400 }
    );
  }
  try {
    const trip = await apiFetch(`/trips/type/${type}`, {
      method: "GET",
    });
    return NextResponse.json(trip);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
