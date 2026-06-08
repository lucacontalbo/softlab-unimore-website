"use client";

import { useState, useMemo } from "react";
import { useEffect } from "react";
import { Search, Filter, SortDesc } from "lucide-react";
import PublicationCard from "@/components/PublicationCard";
import type { Publication } from "@/lib/data";

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState<"year" | "citations">("year");

  useEffect(() => {
    fetch("/api/publications/list")
      .then((r) => r.json())
      .then((data) => { setPublications(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>(["All"]);
    publications.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [publications]);

  const filtered = useMemo(() => {
    let result = publications;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.authors.some((a) => a.toLowerCase().includes(q)) ||
          p.venue.toLowerCase().includes(q) ||
          p.abstract.toLowerCase().includes(q)
      );
    }
    if (selectedTag !== "All") {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }
    return [...result].sort((a, b) =>
      sortBy === "year" ? b.year - a.year : b.citations - a.citations
    );
  }, [publications, query, selectedTag, sortBy]);

  const yearGroups = useMemo(() => {
    const groups = new Map<number, Publication[]>();
    filtered.forEach((p) => {
      const list = groups.get(p.year) ?? [];
      list.push(p);
      groups.set(p.year, list);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Our output
          </span>
          <h1 className="text-5xl font-black mb-5">Publications</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A curated list of our research publications. Automatically updated from Google Scholar.
          </p>
          {!loading && (
            <p className="mt-4 text-slate-400 text-sm">{publications.length} publications</p>
          )}
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title, author, venue…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 bg-slate-50"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortDesc className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "year" | "citations")}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 text-slate-700"
              >
                <option value="year">Sort by Year</option>
                <option value="citations">Sort by Citations</option>
              </select>
            </div>
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Filter className="w-4 h-4 text-slate-400 self-center" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  selectedTag === tag
                    ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-cyan-300 hover:text-cyan-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-cyan-600/30 border-t-cyan-600 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg font-medium">No publications found</p>
              <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
          ) : sortBy === "year" ? (
            <div className="space-y-10">
              {yearGroups.map(([year, pubs]) => (
                <div key={year}>
                  <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                    {year}
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="font-medium normal-case tracking-normal">{pubs.length}</span>
                  </h2>
                  <div className="space-y-4">
                    {pubs.map((pub) => <PublicationCard key={pub.id} publication={pub} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((pub) => <PublicationCard key={pub.id} publication={pub} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
