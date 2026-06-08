import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { FolderOpen, Calendar, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects",
  description: "Research projects at DTALab – University of Modena and Reggio Emilia.",
};

export const revalidate = 3600;

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-50 text-slate-600 border-slate-200",
  upcoming: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  try { projects = getProjects().sort((a, b) => a.order - b.order); } catch {}

  return (
    <main className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="section-title mb-3">Projects</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Research and innovation projects carried out by the DTALab group.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FolderOpen className="w-14 h-14 text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg font-medium">No projects yet.</p>
            <p className="text-slate-400 text-sm mt-1">Projects will appear here once added via the admin panel.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {projects.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 card-hover">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <h2 className="text-lg font-bold text-slate-900">{p.title}</h2>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLES[p.status] ?? STATUS_STYLES.active}`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{p.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  {p.start_date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {p.start_date}{p.end_date ? ` – ${p.end_date}` : ""}
                    </span>
                  )}
                  {p.funding && <span className="text-slate-500">Funded by: {p.funding}</span>}
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-[#003B71] hover:underline">
                      <ExternalLink className="w-3.5 h-3.5" /> Learn more
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
