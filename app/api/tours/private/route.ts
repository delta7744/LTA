import { authorize } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req: NextRequest) {
  const { authorized, token, response } = await authorize();
  if (!authorized) return response;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Forwarding POST request to /trips (Tour Creation)");

    // Read the raw FormData from the incoming request and forward it directly
    const formData = await req.formData();

    const backendResponse = await fetch(`${BACKEND_URL}/trips`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set Content-Type — let the fetch API set it with the proper boundary
      },
      body: formData,
    });

    const responseText = await backendResponse.text();
    console.log(`Backend responded with status: ${backendResponse.status}, body: ${responseText.substring(0, 200)}`);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: responseData.message || "Backend error" },
        { status: backendResponse.status }
      );
    }

    console.log("Successfully created tour via backend");
    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Error in POST /api/tours/private:", error);
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
    const backendResponse = await fetch(`${BACKEND_URL}/trips`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: data.message || "Backend error" },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error in GET /api/tours/private:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
