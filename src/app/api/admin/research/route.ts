import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getResearchAreas, saveResearchAreas } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getResearchAreas());
}

export async function PUT(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  await saveResearchAreas(data);
  revalidatePath("/research");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
