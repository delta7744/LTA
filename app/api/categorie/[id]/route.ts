import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { authorize } from "@/lib/session";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Banner ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/category/${id}`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/category/${id}`, {
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

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    console.log("body", body);
    if (!body) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const result = await apiFetch(`/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
