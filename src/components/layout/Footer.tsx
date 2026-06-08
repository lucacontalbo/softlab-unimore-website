import Link from "next/link";
import Image from "next/image";
import { GitFork, Mail, MapPin, ExternalLink } from "lucide-react";
import { getSiteConfig } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();
  let site;
  try { site = getSiteConfig(); } catch { site = null; }

  return (
    <footer className="bg-[#2B2B2B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image src="/images/dtalab-logo.svg" alt="DTALab" width={110} height={42}
                   className="h-10 w-auto mb-3 brightness-0 invert" />
            <p className="text-white/50 text-xs mb-4 uppercase tracking-wider">Data and Text Analytics Laboratory</p>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              {site?.department ?? "Department of Engineering Enzo Ferrari"}<br />
              {site?.university ?? "University of Modena and Reggio Emilia"}
            </p>
            <div className="flex gap-3">
              {site?.github && (
                <a href={site.github} target="_blank" rel="noopener noreferrer"
                   className="text-white/50 hover:text-white transition-colors" aria-label="GitHub">
                  <GitFork className="w-5 h-5" />
                </a>
              )}
              {site?.email && (
                <a href={`mailto:${site.email}`} className="text-white/50 hover:text-white transition-colors" aria-label="Email">
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white/90 font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2">
              {[
                ["Research", "/research"],
                ["Team", "/team"],
                ["Publications", "/publications"],
                ["News", "/news"],
                ["Projects", "/projects"],
                ["Consulting", "/consulting"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/55 hover:text-white text-sm transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white/90 font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            {site?.address && (
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                <span className="text-white/55 text-sm">{site.address}</span>
              </div>
            )}
            {site?.email && (
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-white/40 shrink-0" />
                <a href={`mailto:${site.email}`} className="text-white/55 hover:text-white text-sm transition-colors">{site.email}</a>
              </div>
            )}
            {site?.scholar_url && (
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-white/40 shrink-0" />
                <a href={site.scholar_url} target="_blank" rel="noopener noreferrer"
                   className="text-white/55 hover:text-white text-sm transition-colors">Google Scholar</a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs">© {year} DTALab – University of Modena and Reggio Emilia. All rights reserved.</p>
          <Image src="/images/unimore-logo.svg" alt="UNIMORE" width={90} height={22}
                 className="h-6 w-auto brightness-0 invert opacity-40" />
        </div>
      </div>
    </footer>
  );
}
