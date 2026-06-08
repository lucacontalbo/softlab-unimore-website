import type { Metadata } from "next";
import { getConsulting } from "@/lib/data";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Consulting",
  description: "Consulting services offered by DTALab – University of Modena and Reggio Emilia.",
};

export const revalidate = 3600;

export default function ConsultingPage() {
  let items: Awaited<ReturnType<typeof getConsulting>> = [];
  try { items = getConsulting().sort((a, b) => a.order - b.order); } catch {}

  return (
    <main className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="section-title mb-3">Consulting</h1>
          <p className="section-subtitle max-w-2xl mx-auto">
            Technology transfer and consulting services from the DTALab group.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Briefcase className="w-14 h-14 text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg font-medium">No consulting items yet.</p>
            <p className="text-slate-400 text-sm mt-1">Consulting services will appear here once added via the admin panel.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <article key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 card-hover">
                {item.category && (
                  <span className="tag mb-3 inline-block">{item.category}</span>
                )}
                <h2 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                {item.client && <p className="mt-3 text-xs text-slate-400">Client: {item.client}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
