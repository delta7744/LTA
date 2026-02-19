import { NextResponse } from "next/server";
import { requestMyGoAPI } from "@/lib/mygo-service";

// POST handler
export async function POST(request: Request) {
  try {
    const { data } = await request.json(); // example City : 10
    const result = await requestMyGoAPI("ListHotel", data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in API Handler (ListHotel):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

