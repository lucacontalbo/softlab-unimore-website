import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPublications, savePublications } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(getPublications()); } catch { return NextResponse.json([]); }
}

export async function PUT(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  savePublications(data);
  revalidatePath("/publications");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
