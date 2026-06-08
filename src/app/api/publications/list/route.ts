import { NextResponse } from "next/server";
import { getPublications } from "@/lib/data";

export async function GET() {
  const pubs = await getPublications();
  return NextResponse.json(pubs);
}
