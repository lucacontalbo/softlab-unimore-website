import { ExternalLink, Quote, BookOpen } from "lucide-react";
import type { Publication } from "@/lib/data";

interface Props {
  publication: Publication;
  compact?: boolean;
}

export default function PublicationCard({ publication: pub, compact = false }: Props) {
  return (
    <article className="card-hover group bg-white rounded-xl p-6 border border-slate-100 hover:border-cyan-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex gap-4">
        {!compact && (
          <div className="hidden sm:flex items-start pt-0.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-cyan-50 flex items-center justify-center transition-colors">
              <Quote className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-slate-900 group-hover:text-cyan-700 transition-colors leading-snug">
              {pub.url ? (
                <a href={pub.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {pub.title}
                </a>
              ) : (
                pub.title
              )}
            </h3>
            <div className="flex items-center gap-2 shrink-0">
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="DOI"
                  className="text-slate-300 hover:text-cyan-500 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                </a>
              )}
              {pub.url && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View paper"
                  className="text-slate-300 hover:text-cyan-500 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-1">{pub.authors.join(", ")}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
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

          {!compact && pub.abstract && (
            <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">{pub.abstract}</p>
          )}

          {pub.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {pub.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
