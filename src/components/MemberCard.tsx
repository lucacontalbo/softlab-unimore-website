import { Mail, GraduationCap, GitFork, Globe } from "lucide-react";
import type { TeamMember } from "@/lib/data";

const ROLE_COLORS: Record<string, string> = {
  "Full Professor": "bg-violet-50 text-violet-700 border-violet-200",
  "Associate Professor": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Postdoc": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Research Fellow": "bg-sky-50 text-sky-700 border-sky-200",
  "PhD Student": "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function MemberCard({ member }: { member: TeamMember }) {
  return (
    <article className="card-hover group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-100 transition-all duration-300">
      {/* Avatar placeholder */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 flex items-center justify-center mb-5 text-2xl font-black text-slate-400 border border-slate-100">
        {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
      </div>

      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-3 ${ROLE_COLORS[member.role] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
      >
        {member.role}
      </span>

      <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
        {member.name}
      </h3>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-3">{member.bio}</p>

      {/* Research interests */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {member.research_interests.slice(0, 3).map((interest) => (
          <span key={interest} className="tag">{interest}</span>
        ))}
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-50">
        <a
          href={`mailto:${member.email}`}
          className="text-slate-400 hover:text-cyan-500 transition-colors"
          title="Email"
        >
          <Mail className="w-4 h-4" />
        </a>
        {member.scholar_url && (
          <a
            href={member.scholar_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-500 transition-colors"
            title="Google Scholar"
          >
            <GraduationCap className="w-4 h-4" />
          </a>
        )}
        {member.github_url && (
          <a
            href={member.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-500 transition-colors"
            title="GitHub"
          >
            <GitFork className="w-4 h-4" />
          </a>
        )}
        {member.personal_url && (
          <a
            href={member.personal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-cyan-500 transition-colors"
            title="Personal website"
          >
            <Globe className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
}
