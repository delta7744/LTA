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
      { error: "Service ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await apiFetch(`/bk-service/${id}`, {
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
// PUT handler
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Service ID is required" },
      { status: 400 }
    );
  }

  console.log("Updating service with ID:", id);
  const body = await req.json();
  console.log("Request body:", body);

  if (!body) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  try {
    const result = await apiFetch(`/bk-service/${id}`, {
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

//delete handler
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } 
)
{
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Service ID is required" },
      { status: 400 }
    );
    }

  try {
    const result = await apiFetch(`/bk-service/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(result);  
  } 
  catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}