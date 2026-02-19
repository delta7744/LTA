import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";
import { authorize } from "@/lib/session";

// POST handler
export async function POST(req: NextRequest) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  try {
    const formData = await req.formData();
    if (!formData) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const result = await apiFetch("/banner", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// GET handler
export async function GET(req: NextRequest) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  try {
    const banners = await apiFetch("/banner/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(banners);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
