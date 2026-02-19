import { NextResponse } from "next/server";
import { requestMyGoAPI } from "@/lib/mygo-service";

// POST handler
export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const result = await requestMyGoAPI("HotelSearch", data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in API Handler (HotelSearch):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const data = Object.fromEntries(searchParams.entries());
    const result = await requestMyGoAPI("ListHotel", data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in API Handler (HotelSearch GET):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
