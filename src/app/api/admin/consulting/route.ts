import { NextResponse } from "next/server";
import { getConsulting, saveConsulting } from "@/lib/data";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  try { await verifyJWT(token); return true; } catch { return false; }
}

export async function GET() {
  try { return NextResponse.json(getConsulting()); } catch { return NextResponse.json([], { status: 200 }); }
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  saveConsulting(data);
  revalidatePath("/consulting");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
