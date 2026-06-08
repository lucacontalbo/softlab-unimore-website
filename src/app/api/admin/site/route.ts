import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteConfig, saveSiteConfig } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getSiteConfig());
}

export async function PUT(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  await saveSiteConfig(data);
  revalidatePath("/");
  revalidatePath("/contact");
  return NextResponse.json({ ok: true });
}
