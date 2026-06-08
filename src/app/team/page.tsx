import type { Metadata } from "next";
import { getTeam } from "@/lib/data";
import MemberCard from "@/components/MemberCard";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the SoftLab research team: faculty, PhD students, postdocs, and research fellows at the University of Modena and Reggio Emilia.",
};

export const revalidate = 3600;

const ROLE_ORDER = [
  "Full Professor",
  "Associate Professor",
  "Postdoc",
  "Research Fellow",
  "PhD Student",
];

export default async function TeamPage() {
  const team = await getTeam();
  const sorted = team.sort((a, b) => {
    const ai = ROLE_ORDER.indexOf(a.role);
    const bi = ROLE_ORDER.indexOf(b.role);
    if (ai !== bi) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    return a.order - b.order;
  });

  const grouped = ROLE_ORDER.reduce<Record<string, typeof team>>((acc, role) => {
    const members = sorted.filter((m) => m.role === role);
    if (members.length > 0) acc[role] = members;
    return acc;
  }, {});

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-slate-950 text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            The people
          </span>
          <h1 className="text-5xl font-black mb-5">Our Team</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We are a diverse group of researchers united by a passion for data, algorithms, and impactful science.
          </p>
        </div>
      </section>

      {/* Team grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {Object.entries(grouped).map(([role, members]) => (
            <div key={role}>
              <h2 className="text-lg font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-4">
                {role}
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-base font-medium text-slate-400 normal-case tracking-normal">{members.length}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join us */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-4">Join SoftLab</h2>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            We are always looking for talented and motivated students and researchers to join our team.
            If you are interested in working on data integration, NLP, or machine learning, get in touch!
          </p>
          <a
            href="mailto:softlab@unimore.it"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-600/20 hover:-translate-y-0.5"
          >
            Contact us
          </a>
        </div>
      </section>
    </div>
  );
}
