import { type NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { authorize } from "@/lib/session";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ferry ID is required" },
        { status: 400 }
      );
    }
    const { authorized, token, response } = await authorize();
    if (!authorized) return response;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const transfer = await apiFetch(`/transfer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });
    return NextResponse.json(transfer);
  } catch (error) {
    console.error("Error fetching transfer:", error);
    return NextResponse.json(
      { message: "Error fetching transfer" },
      { status: 500 }
    );
  }
}

// PUT /api/transfer/:id - Update a transfer
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "trnsfer ID is required" },
        { status: 400 }
      );
    }    const body = await req.json();
    const { authorized, token, response } = await authorize();
    if (!authorized) return response;

    console.log("put methode", body);
    

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updatedTransfer = await apiFetch(`/transfer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json(updatedTransfer);
  } catch (error) {
    console.error("Error updating transfer:", error);
    return NextResponse.json(
      { message: "Error updating transfer" },
      { status: 500 }
    );
  }
}

// DELETE /api/transfer/:id - Delete a transfer
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "transfer ID is required" },
        { status: 400 }
      );
    }
    const { authorized, token, response } = await authorize();
    if (!authorized) return response;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const transfer = await apiFetch(`/transfer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    });
    return NextResponse.json({ message: "Transfer deleted successfully" });
  } catch (error) {
    console.error("Error deleting transfer:", error);
    return NextResponse.json(
      { message: "Error deleting transfer" },
      { status: 500 }
    );
  }
}
