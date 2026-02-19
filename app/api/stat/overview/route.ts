import { apiFetch } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server"
import { authorize } from "@/lib/session";
;
    
export async function GET(req: NextRequest) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;
  try {
    const overview = await apiFetch("/stat/overview", {
      headers :{
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    return NextResponse.json(overview);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
