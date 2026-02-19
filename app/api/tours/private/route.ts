import { apiFetch } from "@/lib/api";
import { authorize } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;
  const data = await req.formData();
  if (!data) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trip = await apiFetch("/trips", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: data,
    });

    return NextResponse.json(trip);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trips = await apiFetch("/trips", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    return NextResponse.json(trips);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
