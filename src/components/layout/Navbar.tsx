"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/research", label: "Research" },
  { href: "/team", label: "Team" },
  { href: "/publications", label: "Publications" },
  { href: "/news", label: "News" },
  { href: "/projects", label: "Projects" },
  { href: "/consulting", label: "Consulting" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = isHome && !scrolled
    ? "bg-transparent"
    : "bg-white/97 backdrop-blur-md shadow-sm border-b border-slate-100";

  const linkColor = isHome && !scrolled
    ? "text-white/80 hover:text-white"
    : "text-slate-600 hover:text-[#003B71]";

  const activeColor = isHome && !scrolled
    ? "text-white font-semibold"
    : "text-[#003B71] font-semibold";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="flex flex-col leading-none">
              <span className={`text-xl font-black tracking-tight transition-colors ${isHome && !scrolled ? "text-white" : "text-[#003B71]"}`}>
                DTA<span className={isHome && !scrolled ? "text-white/70" : "text-slate-400"}>Lab</span>
              </span>
              <span className={`text-[10px] font-medium tracking-wider uppercase transition-colors ${isHome && !scrolled ? "text-white/50" : "text-slate-400"}`}>
                UNIMORE
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  pathname === link.href ? activeColor : linkColor
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Unimore logo (desktop) */}
          <div className="hidden lg:flex items-center border-l border-slate-200/30 pl-4 ml-2">
            <Image
              src="/images/unimore-logo.svg"
              alt="UNIMORE"
              width={90}
              height={22}
              className={`h-6 w-auto transition-opacity ${isHome && !scrolled ? "brightness-0 invert opacity-70" : "opacity-100"}`}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 rounded-lg ${isHome && !scrolled ? "text-white" : "text-slate-600"}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-blue-50 text-[#003B71]"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="px-8 pb-4">
            <Image src="/images/unimore-logo.svg" alt="UNIMORE" width={90} height={22} className="h-6 w-auto opacity-60" />
          </div>
        </div>
      )}
    </header>
  );
}
