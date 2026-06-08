"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/research",    label: "Research"    },
  { href: "/team",        label: "Team"        },
  { href: "/publications",label: "Publications"},
  { href: "/news",        label: "News"        },
  { href: "/projects",    label: "Projects"    },
  { href: "/consulting",  label: "Consulting"  },
  { href: "/contact",     label: "Contact"     },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();
  const isHome   = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-white/97 backdrop-blur-md shadow-sm border-b border-slate-100";

  const linkColor   = isHome && !scrolled ? "text-white/75 hover:text-white" : "text-slate-600 hover:text-[#E5332A]";
  const activeColor = isHome && !scrolled ? "text-white font-semibold"        : "text-[#E5332A] font-semibold";
  const logoColor   = isHome && !scrolled ? "text-white"                      : "text-[#58585A]";
  const subColor    = isHome && !scrolled ? "text-white/45"                   : "text-slate-400";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* DTALab logo mark */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <Image src="/images/dtalab-logo.svg" alt="DTALab"
                   width={90} height={34} className={`h-8 w-auto transition-all ${isHome && !scrolled ? "brightness-0 invert" : ""}`} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${pathname === link.href ? activeColor : linkColor}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Unimore logo (desktop right) */}
          <div className="hidden lg:flex items-center border-l pl-4 shrink-0"
               style={{ borderColor: isHome && !scrolled ? "rgba(255,255,255,0.2)" : "#E5E7EB" }}>
            <Image src="/images/unimore-logo.svg" alt="UNIMORE"
                   width={110} height={25}
                   className={`h-7 w-auto transition-all ${isHome && !scrolled ? "brightness-0 invert opacity-60" : "opacity-90"}`} />
          </div>

          {/* Mobile button */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu"
                  className={`lg:hidden p-2 rounded-lg transition-colors ${isHome && !scrolled ? "text-white" : "text-slate-600"}`}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.href ? "bg-red-50 text-[#E5332A]" : "text-slate-700 hover:bg-slate-50"
                    }`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-8 pb-4 pt-1 border-t border-slate-100">
            <Image src="/images/unimore-logo.svg" alt="UNIMORE" width={110} height={25}
                   className="h-6 w-auto opacity-50" />
          </div>
        </div>
      )}
    </header>
  );
}
