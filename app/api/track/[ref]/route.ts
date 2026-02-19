
import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ ref: string }> }
) {

  const { ref } = await context.params;


  if (!ref) {
    return NextResponse.json(
      { error: "REF ID is required" },
      { status: 400 }
    );
  }
    console.log("Fetching track with REF:", ref);
  let apiPath = "";
  if (ref.startsWith("REQ-VIP-")) {
    apiPath = `/vip-req/ref/${ref}`;
  } else if (ref.startsWith("REQ-TR-")) {
    apiPath = `/transfer/ref/${ref}`;
  } else if (ref.startsWith("BK-H-")) {
    apiPath = `/bk-hotels/ref/${ref}`;
  } else if (ref.startsWith("BK-S-")) {
    apiPath = `/bk-service/ref/${ref}`;
  } else if (ref.startsWith("REQ-FER-")) {
    apiPath = `/ferry/ref/${ref}`;
  } else if (ref.startsWith("REQ-FLT-")) {
    apiPath = `/flight/ref/${ref}`;
  } else {
    throw new Error("Invalid reference prefix.");
  }

  try {
    const result = await apiFetch(`${apiPath}`, {
      method: "GET",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}