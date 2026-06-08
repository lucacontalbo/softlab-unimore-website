import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { savePublications, getPublications } from "@/lib/data";
import { refreshPublicationsFromSemanticScholar } from "@/lib/scholar";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    return NextResponse.json(getPublications());
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST() {
  const auth = await isAdminAuthenticated();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { publications, source, authorId } = await refreshPublicationsFromSemanticScholar();
    savePublications(publications);
    revalidatePath("/publications");
    revalidatePath("/");
    return NextResponse.json({
      ok: true,
      count: publications.length,
      source,
      authorId,
      message: `Fetched ${publications.length} publications from Semantic Scholar (author ${authorId}).`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[publications/refresh]", message);
    return NextResponse.json(
      {
        error: message,
        hint: "Make sure the server has outbound internet access to api.semanticscholar.org. " +
              "You can also set the S2_AUTHOR_ID env var to skip author lookup.",
      },
      { status: 500 }
    );
  }
}
