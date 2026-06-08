import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { savePublications, getPublications } from "@/lib/data";
import { refreshPublicationsFromSemanticScholar } from "@/lib/scholar";
import { revalidatePath } from "next/cache";

export async function GET() {
  const pubs = await getPublications();
  return NextResponse.json(pubs);
}

export async function POST() {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { publications, source } = await refreshPublicationsFromSemanticScholar();
    await savePublications(publications);
    revalidatePath("/publications");
    revalidatePath("/");
    return NextResponse.json({ ok: true, count: publications.length, source });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Failed to refresh publications: ${message}` }, { status: 500 });
  }
}
