import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { authorize } from "@/lib/session";

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
      { error: "City ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/city/${id}`, {
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
// DELETE handler
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "City ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/city/${id}`, {
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
// PUT handler
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "City ID is required" },
      { status: 400 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    const isFormData = contentType.includes("multipart/form-data");

    const payload = isFormData ? await req.formData() : await req.json();

    const result = await apiFetch(`/city/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PUT /city error:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
