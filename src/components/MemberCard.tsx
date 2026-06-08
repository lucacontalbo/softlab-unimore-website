import Image from "next/image";
import { Mail } from "lucide-react";
import type { TeamMember } from "@/lib/data";

export default function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center text-center card-hover">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 mb-4 ring-2 ring-slate-200">
        {member.image ? (
          <Image
            src={member.image}
            alt={`${member.name} ${member.surname}`}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#003B71] to-[#005BAE]">
            <span className="text-white text-2xl font-bold">
              {member.name[0]}{member.surname[0]}
            </span>
          </div>
        )}
      </div>
      <p className="font-bold text-slate-900 text-sm">{member.name} {member.surname}</p>
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="mt-2 text-[#003B71] hover:text-[#005BAE] transition-colors"
          aria-label="Email"
        >
          <Mail className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
