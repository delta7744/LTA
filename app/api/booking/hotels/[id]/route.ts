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
      { error: "Hotel ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/bk-hotels/${id}`, {
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

//Patch handler
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Hotel ID is required" },
      { status: 400 }
    );
  }

  const data = await req.json();

  if (!data) {
    return NextResponse.json(
      { error: "Hotel status is required" },
      { status: 400 }
    );
  }

  console.log(data);

  try {
    const result = await apiFetch(`/bk-hotels/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete handler 
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Hotel ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/bk-hotels/${id}`, {
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