import { Publication } from "./data";

interface S2Author {
  authorId: string;
  name: string;
  affiliations?: string[];
  paperCount?: number;
}

interface S2Paper {
  paperId: string;
  title: string;
  year: number | null;
  venue: string | null;
  citationCount: number;
  abstract: string | null;
  authors: { authorId: string; name: string }[];
  externalIds: { DOI?: string; ArXiv?: string } | null;
  url: string | null;
}

const S2_BASE = "https://api.semanticscholar.org/graph/v1";

async function findAuthorId(name: string, affiliation: string): Promise<string | null> {
  const res = await fetch(
    `${S2_BASE}/author/search?query=${encodeURIComponent(name + " " + affiliation)}&fields=name,affiliations,paperCount&limit=5`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) return null;
  const data = (await res.json()) as { data: S2Author[] };
  const author = data.data?.find(
    (a) =>
      a.name.toLowerCase().includes("guerra") &&
      (a.affiliations?.some((aff) => aff.toLowerCase().includes("modena")) ?? false)
  );
  return author?.authorId ?? null;
}

async function fetchPapersByAuthorId(authorId: string): Promise<Publication[]> {
  const fields = "title,year,venue,citationCount,abstract,authors,externalIds,url";
  const res = await fetch(
    `${S2_BASE}/author/${authorId}/papers?fields=${fields}&limit=100`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`Semantic Scholar API error: ${res.status}`);
  const data = (await res.json()) as { data: S2Paper[] };

  return data.data
    .filter((p) => p.title && p.year)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .map((p): Publication => ({
      id: p.paperId,
      title: p.title,
      authors: p.authors.map((a) => a.name),
      venue: p.venue ?? "Unknown Venue",
      year: p.year ?? 0,
      citations: p.citationCount,
      abstract: p.abstract ?? "",
      doi: p.externalIds?.DOI ?? null,
      url: p.url ?? (p.externalIds?.ArXiv ? `https://arxiv.org/abs/${p.externalIds.ArXiv}` : null),
      tags: [],
      featured: false,
    }));
}

export async function refreshPublicationsFromSemanticScholar(): Promise<{
  publications: Publication[];
  source: string;
}> {
  const authorId = await findAuthorId("Francesco Guerra", "Modena");
  if (!authorId) throw new Error("Author not found in Semantic Scholar");
  const publications = await fetchPapersByAuthorId(authorId);
  return { publications, source: "semantic_scholar" };
}
