import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { apiFetch } from "@/lib/api";

export async function POST(
  req: NextRequest,
  context: { params: { target: string } }
) {
  try {
    const { params } = context;

    const token = await getSession();
    console.log(params.target);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const sync = await apiFetch(`/partner-sync/sync/${params.target}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "Post",
    });

    return NextResponse.json({ message: "Syncing data Successfully" });
  } catch (error) {
    console.error("Error Syncing data:", error);
    return NextResponse.json(
      { message: "Error Syncing data" },
      { status: 500 }
    );
  }
}
