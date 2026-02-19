import { apiFetch } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server"
import { authorize } from "@/lib/session";
;
    

export async function POST(req: NextRequest) {
  
  const body = await req.json();
  console.log(body)
  try {
    const transfer = await apiFetch('/transfer/request', {
      headers:{
        "Content-Type": "application/json",
      },
      method: 'POST',
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
    const transfers = await apiFetch("/transfer", {
      headers :{
        Authorization: `Bearer ${token}`,
      },
      method: "GET",
    });

    return NextResponse.json(transfers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
