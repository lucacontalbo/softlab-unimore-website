import Link from "next/link";
import { ArrowRight, BookOpen, Users, Layers } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  { label: "Research Areas", value: "6+", icon: <Layers className="w-5 h-5" /> },
  { label: "Publications", value: "100+", icon: <BookOpen className="w-5 h-5" /> },
  { label: "Team Members", value: "12+", icon: <Users className="w-5 h-5" /> },
  { label: "Years Active", value: "20+", icon: <span className="text-lg font-bold">∞</span> },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="orb-2 absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="orb-3 absolute top-2/3 left-1/2 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 hero-grid pointer-events-none" />

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/60 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        {/* Badge */}
        <div className="opacity-0 animate-fade-up delay-100 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          University of Modena and Reggio Emilia
        </div>

        {/* Main title */}
        <h1 className="opacity-0 animate-fade-up delay-200 text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-4">
          SOFT<span className="gradient-text">LAB</span>
        </h1>

        {/* Subtitle */}
        <p className="opacity-0 animate-fade-up delay-300 text-xl sm:text-2xl font-light text-slate-300 mb-4">
          Software Engineering & Data Analysis Laboratory
        </p>

        <p className="opacity-0 animate-fade-up delay-400 max-w-2xl mx-auto text-base sm:text-lg text-slate-400 mb-12 leading-relaxed">
          We advance the frontiers of data management, machine learning, and natural language processing —
          from entity matching and data integration to time series analysis and big data analytics.
        </p>

        {/* CTA Buttons */}
        <div className="opacity-0 animate-fade-up delay-500 flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link
            href="/research"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
          >
            Explore Research
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/publications"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
          >
            <BookOpen className="w-4 h-4" />
            Publications
          </Link>
        </div>

        {/* Stats */}
        <div className="opacity-0 animate-fade-up delay-600 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              <div className="text-cyan-400">{stat.icon}</div>
              <div className="text-3xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
      </div>
    </section>
  );
}
