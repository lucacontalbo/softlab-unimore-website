import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getNews } from "@/lib/data";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";

export const revalidate = 3600;

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNews();
  const item = news.find((n) => n.slug === slug);
  if (!item) return { title: "Not Found" };
  return {
    title: item.title,
    description: item.excerpt,
  };
}

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

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const news = await getNews();
  const item = news.find((n) => n.slug === slug);
  if (!item) notFound();

  const related = news.filter((n) => n.slug !== slug && n.category === item.category).slice(0, 2);

  return (
    <div className="pt-20">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Breadcrumb */}
        <Link href="/news" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[item.category] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
          >
            <Tag className="w-3 h-3" />
            {item.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            {formatDate(item.date)}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <User className="w-4 h-4" />
            {item.author}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">{item.title}</h1>
        <p className="text-xl text-slate-500 mb-10 leading-relaxed">{item.excerpt}</p>

        <div className="h-px bg-slate-100 mb-10" />

        {/* Content */}
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-slate-50 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-black text-slate-700 mb-6">Related News</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((n) => (
                <Link key={n.id} href={`/news/${n.slug}`}>
                  <div className="card-hover bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all duration-300 group">
                    <p className="text-xs text-slate-400 mb-2">{formatDate(n.date)}</p>
                    <h3 className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">{n.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
