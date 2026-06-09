import type { Metadata } from "next";
import { getResearchAreas } from "@/lib/data";
import { GitMerge, MessageSquare, TrendingUp, Database, AlertTriangle, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const metadata: Metadata = {
  title: "Research",
  description: "Explore SoftLab's research areas: entity matching, NLP, time series analysis, anomaly detection, ML in databases, and knowledge graphs.",
};

export const revalidate = 3600;

const ICON_MAP: Record<string, React.ReactNode> = {
  GitMerge: <GitMerge className="w-7 h-7" />,
  MessageSquare: <MessageSquare className="w-7 h-7" />,
  TrendingUp: <TrendingUp className="w-7 h-7" />,
  Database: <Database className="w-7 h-7" />,
  AlertTriangle: <AlertTriangle className="w-7 h-7" />,
  Share2: <Share2 className="w-7 h-7" />,
};

export default async function ResearchPage() {
  const areas = await getResearchAreas();
  const sorted = areas.sort((a, b) => a.order - b.order);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            What we investigate
          </span>
          <h1 className="text-5xl font-black mb-5">Research Areas</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Our work spans the intersection of data management, artificial intelligence, and software engineering —
            solving real-world challenges with principled methods.
          </p>
        </div>
      </section>

      {/* Research areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sorted.map((area) => (
              <article
                key={area.id}
                className="card-hover bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all duration-300 group"
              >
                <div className="flex items-start gap-5">
                  <div
                    className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 text-white shadow-lg"
                    style={{ backgroundColor: area.color }}
                  >
                    {ICON_MAP[area.icon] ?? <Database className="w-7 h-7" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-700 transition-colors">
                      {area.title}
                    </h2>
                    <div className="prose prose-sm prose-slate max-w-none mb-5
                      prose-headings:font-bold prose-headings:text-slate-800 prose-headings:mt-4 prose-headings:mb-2
                      prose-p:text-slate-500 prose-p:leading-relaxed prose-p:my-2
                      prose-li:text-slate-500 prose-ul:my-2 prose-ol:my-2
                      prose-a:text-cyan-600 prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-slate-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{area.description}</ReactMarkdown>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {area.topics.map((topic) => (
                        <span key={topic} className="tag">{topic}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Projects teaser */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Open-Source Projects</h2>
          <p className="text-slate-500 text-lg mb-8">
            We publish our research code and datasets on GitHub, enabling reproducibility and collaboration.
          </p>
          <a
            href="https://github.com/softlab-unimore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            View on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
