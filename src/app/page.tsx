import { getPublications, getNews, getResearchAreas, getSiteConfig } from "@/lib/data";
import Hero from "@/components/home/Hero";
import ResearchHighlights from "@/components/home/ResearchHighlights";
import FeaturedPublications from "@/components/home/FeaturedPublications";
import FeaturedNews from "@/components/home/FeaturedNews";
import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";

export const revalidate = 3600;

export default async function HomePage() {
  const [publications, news, areas, site] = await Promise.all([
    getPublications(),
    getNews(),
    getResearchAreas(),
    getSiteConfig(),
  ]);

  const sortedAreas = areas.sort((a, b) => a.order - b.order);

  return (
    <>
      <Hero />

      <ResearchHighlights areas={sortedAreas} />

      <FeaturedPublications publications={publications} />

      <FeaturedNews news={news} />

      {/* About teaser */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-cyan-400 uppercase tracking-widest">About us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-5 leading-tight">
                {site.full_name}
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-8">
                {site.about}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all duration-200 group"
                >
                  Meet the team
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-200 hover:bg-white/10"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
