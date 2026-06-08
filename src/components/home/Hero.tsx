import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#2B2B2B]">
      {/* Animated orbs — Unimore red tones */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb-1 absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
             style={{ background: "radial-gradient(circle, rgba(229,51,42,0.35) 0%, transparent 70%)" }} />
        <div className="orb-2 absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full"
             style={{ background: "radial-gradient(circle, rgba(191,42,34,0.3) 0%, transparent 70%)" }} />
        <div className="orb-3 absolute top-1/2 right-1/3 w-64 h-64 rounded-full"
             style={{ background: "radial-gradient(circle, rgba(88,88,90,0.4) 0%, transparent 70%)" }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 hero-grid" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* University badge */}
        <div className="animate-fade-up opacity-0 delay-100">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
                style={{ background: "rgba(229,51,42,0.2)", color: "#FF8A84", border: "1px solid rgba(229,51,42,0.35)" }}>
            University of Modena and Reggio Emilia
          </span>
        </div>

        {/* DTA Lab logo */}
        <div className="animate-fade-up opacity-0 delay-200 flex justify-center mb-4">
          <Image src="/images/dtalab-logo.svg" alt="DTALab" width={220} height={83}
                 className="h-20 w-auto brightness-0 invert" priority />
        </div>

        <p className="animate-fade-up opacity-0 delay-300 text-lg sm:text-xl text-white/55 max-w-2xl mx-auto mb-3 font-light tracking-wide">
          Data and Text Analytics Laboratory
        </p>

        <p className="animate-fade-up opacity-0 delay-400 text-base text-white/40 max-w-xl mx-auto mb-10 leading-relaxed">
          Research at the intersection of data management, machine learning,
          and natural language processing.
        </p>

        {/* CTAs */}
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

        {/* Unimore logo */}
        <div className="animate-fade-in opacity-0 delay-700 mt-14">
          <Image src="/images/unimore-logo.svg" alt="UNIMORE" width={240} height={54}
                 className="h-12 w-auto mx-auto brightness-0 invert opacity-35" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 delay-700">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/35 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
