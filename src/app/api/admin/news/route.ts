import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getNews, saveNews } from "@/lib/data";
import { revalidatePath } from "next/cache";

export async function GET() {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getNews());
}

export async function PUT(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  await saveNews(data);
  revalidatePath("/news");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
