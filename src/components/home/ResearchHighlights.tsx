import Link from "next/link";
import { ArrowRight, GitMerge, MessageSquare, TrendingUp, Database, AlertTriangle, Share2 } from "lucide-react";
import type { ResearchArea } from "@/lib/data";

const ICON_MAP: Record<string, React.ReactNode> = {
  GitMerge: <GitMerge className="w-6 h-6" />,
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  AlertTriangle: <AlertTriangle className="w-6 h-6" />,
  Share2: <Share2 className="w-6 h-6" />,
};

export default function ResearchHighlights({ areas }: { areas: ResearchArea[] }) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest text-cyan-600 uppercase mb-3">
            What we do
          </span>
          <h2 className="text-4xl font-black text-slate-900 mb-4">Research Areas</h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-lg">
            Our research spans multiple interconnected areas at the intersection of data management, AI, and software engineering.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.slice(0, 6).map((area) => (
            <div
              key={area.id}
              className="card-hover group bg-white rounded-2xl p-7 border border-slate-100 shadow-sm"
            >
              {/* Icon */}
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 text-white"
                style={{ backgroundColor: area.color }}
              >
                {ICON_MAP[area.icon] ?? <Database className="w-6 h-6" />}
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                {area.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">
                {area.description}
              </p>

              {/* Topics */}
              <div className="flex flex-wrap gap-1.5">
                {area.topics.slice(0, 3).map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors group"
          >
            View all research areas
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
