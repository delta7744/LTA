import { apiFetch } from "@/lib/api";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Trip ID is required" }, { status: 400 });
  }

  try {
    const result = await apiFetch(`/trips/${id}`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
