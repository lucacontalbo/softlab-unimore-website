import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#001428]">
      {/* Animated orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
             style={{ background: "radial-gradient(circle, rgba(0,91,174,0.5) 0%, transparent 70%)" }} />
        <div className="orb-2 absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full"
             style={{ background: "radial-gradient(circle, rgba(0,59,113,0.6) 0%, transparent 70%)" }} />
        <div className="orb-3 absolute top-1/2 right-1/3 w-64 h-64 rounded-full"
             style={{ background: "radial-gradient(circle, rgba(0,120,200,0.35) 0%, transparent 70%)" }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-up opacity-0 delay-100">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ background: "rgba(0,91,174,0.3)", color: "#7DB8E8", border: "1px solid rgba(0,91,174,0.4)" }}>
            University of Modena and Reggio Emilia
          </span>
        </div>

        <h1 className="animate-fade-up opacity-0 delay-200 text-5xl sm:text-7xl font-black text-white tracking-tight leading-none mb-4">
          DTA<span style={{ color: "#4A9FD5" }}>Lab</span>
        </h1>

        <p className="animate-fade-up opacity-0 delay-300 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-4 font-light">
          Data and Text Analytics Laboratory
        </p>

        <p className="animate-fade-up opacity-0 delay-400 text-base text-white/45 max-w-xl mx-auto mb-10 leading-relaxed">
          Research at the intersection of data management, machine learning, and natural language processing.
        </p>

        <div className="animate-fade-up opacity-0 delay-500 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/research" className="btn-primary">
            Our Research <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/publications" className="btn-outline">
            <BookOpen className="w-4 h-4" /> Publications
          </Link>
          <Link href="/team" className="btn-outline">
            <Users className="w-4 h-4" /> Meet the Team
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 delay-700">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
