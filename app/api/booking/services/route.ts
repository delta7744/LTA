import { apiFetch } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body) {
    return NextResponse.json({ error: "NO Data Provided" }, { status: 400 });
  }
  try {
    const bk = await apiFetch("/bk-service/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(bk);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  try {
    const transfers = await apiFetch("/bk-service", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    return NextResponse.json(transfers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
