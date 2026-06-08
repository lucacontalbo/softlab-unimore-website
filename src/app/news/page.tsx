import type { Metadata } from "next";
import { getNews } from "@/lib/data";
import NewsCard from "@/components/NewsCard";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and updates from SoftLab UNIMORE: research breakthroughs, awards, events, and new publications.",
};

export const revalidate = 3600;

const CATEGORIES = ["All", "Research", "Publication", "Award", "Event"];

export default async function NewsPage() {
  const news = await getNews();
  const sorted = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Stay updated
          </span>
          <h1 className="text-5xl font-black mb-5">News & Updates</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Follow the latest developments from our research group.
          </p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sorted.length === 0 ? (
            <p className="text-center text-slate-400 py-20">No news items yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
