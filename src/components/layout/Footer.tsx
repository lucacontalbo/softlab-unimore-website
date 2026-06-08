import Link from "next/link";
import { FlaskConical, GitFork, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                SOFT<span className="text-cyan-400">LAB</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Software Engineering & Data Analysis Laboratory at the University of Modena and Reggio Emilia.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/softlab-unimore"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="GitHub"
              >
                <GitFork className="w-5 h-5" />
              </a>
              <a
                href="mailto:softlab@unimore.it"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Research */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Research</h3>
            <ul className="space-y-2 text-sm">
              {["Entity Matching", "NLP & Text Analytics", "Time Series Analysis", "Anomaly Detection", "Knowledge Graphs"].map((area) => (
                <li key={area}>
                  <Link href="/research" className="text-slate-400 hover:text-cyan-400 transition-colors">
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Lab */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Lab</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/team", label: "Team" },
                { href: "/publications", label: "Publications" },
                { href: "/news", label: "News" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-cyan-500" />
                <span>Via Pietro Vivarelli, 10<br />41125 Modena MO, Italy</span>
              </li>
              <li>
                <a href="mailto:softlab@unimore.it" className="text-slate-400 hover:text-cyan-400 transition-colors">
                  softlab@unimore.it
                </a>
              </li>
              <li className="text-slate-400">
                Dept. of Engineering "Enzo Ferrari"<br />
                <a href="https://www.unimore.it" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                  University of Modena and Reggio Emilia
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {year} SoftLab, University of Modena and Reggio Emilia. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Dept. of Engineering "Enzo Ferrari" · UNIMORE
          </p>
        </div>
      </div>
    </footer>
  );
}
