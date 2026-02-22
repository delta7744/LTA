import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  if (!type) {
    return NextResponse.json(
      { error: "Trip type is required" },
      { status: 400 }
    );
  }
  try {
    console.log(`Forwarding GET request for trip type: ${type}`);
    const response = await fetch(`${BACKEND_URL}/trips/type/${type}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Backend returned ${response.status} for trips/type/${type}:`, errorText.substring(0, 100));
      // Return empty list so the frontend can use its fallback data
      return NextResponse.json({ success: true, count: 0, data: [] });
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.count || 0} trips for type: ${type}`);
    return NextResponse.json(data);
  } catch (error: any) {
    // Backend is offline — return empty list (frontend will use fallback tours)
    console.warn(`Backend unavailable for trips/type/${type}:`, error.message);
    return NextResponse.json({ success: true, count: 0, data: [], _fallback: true });
  }
}
