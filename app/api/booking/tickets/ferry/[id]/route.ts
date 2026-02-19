import { apiFetch } from "@/lib/api";
import { authorize } from "@/lib/session";
import { type NextRequest, NextResponse } from "next/server";
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ferry ID is required" },
      { status: 400 }
    );
  }
  try {
    const body = await request.json();

    const flight = await apiFetch(`/ferry/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(body),
    });

    return NextResponse.json(flight);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE handler
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  console.log("Deleting ferry with ID:", id);
  if (!id) {
    return NextResponse.json(
      { error: "ferry ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/ferry/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET handler
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ferry ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/ferry/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
