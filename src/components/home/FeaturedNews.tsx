import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
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

export default function FeaturedNews({ news }: { news: NewsItem[] }) {
  const items = news.filter((n) => n.featured).slice(0, 3);
  const [main, ...rest] = items;

  if (!main) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-14">
          <div>
            <span className="inline-block text-xs font-semibold tracking-widest text-cyan-600 uppercase mb-3">
              Latest updates
            </span>
            <h2 className="text-4xl font-black text-slate-900">News & Updates</h2>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors group shrink-0"
          >
            All news
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main featured */}
          <div className="lg:col-span-2">
            <Link href={`/news/${main.slug}`}>
              <article className="card-hover h-full bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[main.category] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
                  >
                    <Tag className="w-3 h-3" />
                    {main.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(main.date)}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors leading-snug">
                  {main.title}
                </h3>
                <p className="text-slate-500 leading-relaxed mb-6">{main.excerpt}</p>

                <span className="inline-flex items-center gap-2 text-cyan-600 font-semibold text-sm group-hover:gap-3 transition-all">
                  Read more <ArrowRight className="w-4 h-4" />
                </span>
              </article>
            </Link>
          </div>

          {/* Side items */}
          <div className="flex flex-col gap-6">
            {rest.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`}>
                <article className="card-hover bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all duration-300 group h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[item.category] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">{formatDate(item.date)}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2 group-hover:text-cyan-700 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{item.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
