import { apiFetch } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body);
  if (!body) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }
  try {
    const transfer = await apiFetch("/bk-hotels/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });

    return NextResponse.json(transfer);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  try {
    const hotels = await apiFetch("/bk-hotels", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    return NextResponse.json(hotels);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}