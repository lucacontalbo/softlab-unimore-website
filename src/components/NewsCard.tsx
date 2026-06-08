import Link from "next/link";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import type { NewsItem } from "@/lib/data";

const CATEGORY_COLORS: Record<string, string> = {
  Research: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Award: "bg-amber-50 text-amber-700 border-amber-200",
  Event: "bg-violet-50 text-violet-700 border-violet-200",
  Publication: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsCard({ news }: { news: NewsItem }) {
  return (
    <Link href={`/news/${news.slug}`}>
      <article className="card-hover group h-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[news.category] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
          >
            <Tag className="w-3 h-3" />
            {news.category}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3 h-3" />
            {formatDate(news.date)}
          </span>
        </div>

        <h2 className="font-bold text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors leading-snug text-lg">
          {news.title}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">{news.excerpt}</p>

        <div className="flex items-center gap-2 text-cyan-600 text-sm font-semibold group-hover:gap-3 transition-all">
          Read more <ArrowRight className="w-4 h-4" />
        </div>
      </article>
    </Link>
  );
}
