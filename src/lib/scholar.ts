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

// Francesco Guerra's Semantic Scholar author ID.
// https://www.semanticscholar.org/author/Francesco-Guerra/2165249842
const KNOWN_S2_AUTHOR_ID = process.env.S2_AUTHOR_ID ?? "2165249842";

async function findAuthorId(): Promise<string | null> {
  // 1. Use hardcoded/env ID if available
  if (KNOWN_S2_AUTHOR_ID) return KNOWN_S2_AUTHOR_ID;

  // 2. Try multiple search strategies
  const queries = [
    "Francesco Guerra Modena",
    "Francesco Guerra UNIMORE entity matching",
    "Francesco Guerra data integration NLP",
  ];

  for (const q of queries) {
    try {
      const res = await fetch(
        `${S2_BASE}/author/search?query=${encodeURIComponent(q)}&fields=name,affiliations,paperCount&limit=10`,
        { signal: AbortSignal.timeout(10000) }
      );
      if (!res.ok) continue;
      const data = (await res.json()) as { data: S2Author[] };
      const author = data.data?.find(
        (a) =>
          a.name.toLowerCase().includes("guerra") &&
          (
            (a.affiliations?.some((aff) =>
              aff.toLowerCase().includes("modena") ||
              aff.toLowerCase().includes("unimore") ||
              aff.toLowerCase().includes("reggio")
            )) ?? false
          )
      );
      if (author?.authorId) return author.authorId;
    } catch {
      // try next query
    }
  }
  return null;
}

async function fetchPapersByAuthorId(authorId: string): Promise<Publication[]> {
  const fields = "title,year,venue,citationCount,abstract,authors,externalIds,url";
  const res = await fetch(
    `${S2_BASE}/author/${authorId}/papers?fields=${fields}&limit=200`,
    { signal: AbortSignal.timeout(20000) }
  );
  if (!res.ok) throw new Error(`Semantic Scholar API error: ${res.status} ${res.statusText}`);
  const data = (await res.json()) as { data: S2Paper[] };

  return data.data
    .filter((p) => p.title && p.year)
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .map((p): Publication => ({
      id: p.paperId,
      title: p.title,
      authors: p.authors.map((a) => a.name),
      venue: p.venue ?? "",
      year: p.year ?? 0,
      citations: p.citationCount,
      abstract: p.abstract ?? "",
      doi: p.externalIds?.DOI ?? null,
      url:
        p.url ??
        (p.externalIds?.ArXiv
          ? `https://arxiv.org/abs/${p.externalIds.ArXiv}`
          : null),
      tags: [],
      featured: false,
    }));
}

export async function refreshPublicationsFromSemanticScholar(): Promise<{
  publications: Publication[];
  source: string;
  authorId: string;
}> {
  const authorId = await findAuthorId();
  if (!authorId) {
    throw new Error(
      "Could not find Francesco Guerra on Semantic Scholar. " +
      "Set the S2_AUTHOR_ID environment variable to their Semantic Scholar author ID " +
      "(find it at https://www.semanticscholar.org/author/Francesco-Guerra)."
    );
  }
  const publications = await fetchPapersByAuthorId(authorId);
  return { publications, source: "semantic_scholar", authorId };
}
