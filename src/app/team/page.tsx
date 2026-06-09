import type { Metadata } from "next";
import { getTeam, type TeamMember } from "@/lib/data";
import Image from "next/image";
import { Mail, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the DTALab research team at the University of Modena and Reggio Emilia.",
};

export const revalidate = 3600;

function MemberCard({ m }: { m: TeamMember }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center text-center card-hover">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 mb-4 ring-2 ring-slate-200">
        {m.image ? (
          <Image src={m.image} alt={`${m.name} ${m.surname}`}
            width={80} height={80} className="object-cover w-full h-full" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#003B71] to-[#005BAE]">
            <span className="text-white text-2xl font-bold">{m.name[0]}{m.surname[0]}</span>
          </div>
        )}
      </div>
      <p className="font-bold text-slate-900 text-sm leading-tight">{m.name} {m.surname}</p>
      {m.role && <p className="text-xs text-slate-500 mt-1 leading-snug">{m.role}</p>}
      {m.bio && <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-4">{m.bio}</p>}
      {m.email && (
        <a href={`mailto:${m.email}`} className="mt-2 text-[#003B71] hover:text-[#005BAE] transition-colors" aria-label="Email">
          <Mail className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}

export default function TeamPage() {
  let members: TeamMember[] = [];
  try { members = getTeam().sort((a, b) => a.order - b.order); } catch {}

  const current = members.filter(m => !m.former);
  const former  = members.filter(m => m.former);

  return (
    <main className="min-h-screen pt-24 pb-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="section-title mb-3">Our Team</h1>
          <p className="section-subtitle">The people behind DTALab research.</p>
        </div>

        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Users className="w-14 h-14 text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg font-medium">Team members coming soon.</p>
            <p className="text-slate-400 text-sm mt-1">Members will appear here once added via the admin panel.</p>
          </div>
        ) : (
          <>
            {current.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {current.map(m => <MemberCard key={m.id} m={m} />)}
              </div>
            )}

            {former.length > 0 && (
              <div className="mt-16">
                <h2 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-3">
                  Former Members
                  <span className="h-px flex-1 bg-slate-200" />
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 opacity-60">
                  {former.map(m => <MemberCard key={m.id} m={m} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
