import Link from "next/link";
import { ArrowRight, Quote, ExternalLink } from "lucide-react";
import type { Publication } from "@/lib/data";

export default function FeaturedPublications({ publications }: { publications: Publication[] }) {
  const featured = publications.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-14">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest text-cyan-600 uppercase mb-3">
              Latest work
            </span>
            <h2 className="text-4xl font-black text-slate-900">Featured Publications</h2>
          </div>
          <Link
            href="/publications"
            className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors group shrink-0"
          >
            All publications
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Publications */}
        <div className="space-y-5">
          {featured.map((pub, i) => (
            <div
              key={pub.id}
              className="card-hover group bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-100 hover:border-cyan-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex gap-5">
                <div className="hidden sm:flex items-start pt-1 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <Quote className="w-4 h-4 text-cyan-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors text-lg leading-snug">
                      {pub.url ? (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {pub.title}
                        </a>
                      ) : (
                        pub.title
                      )}
                    </h3>
                    {pub.url && (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-slate-300 hover:text-cyan-500 transition-colors mt-1">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {pub.authors.join(", ")}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="text-sm font-medium text-slate-700">{pub.venue}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-sm text-slate-400">{pub.year}</span>
                    {pub.citations > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="text-sm text-slate-400">{pub.citations} citations</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {pub.tags.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
