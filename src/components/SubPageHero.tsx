"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SubPageHeroProps {
  title: React.ReactNode;
  description: React.ReactNode;
  badgeText?: string;
  category?: string;
}

export function SubPageHero({
  title,
  description,
  badgeText,
  category,
}: SubPageHeroProps) {
  return (
    <section className="relative pt-32 pb-48 px-6 overflow-hidden bg-[#0f172a] min-h-[500px] flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-sky-500/15 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
        {/* Badge */}
        {badgeText && (
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 backdrop-blur-md mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-indigo-200 text-xs font-bold tracking-wide uppercase">
              {badgeText}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6 animate-slide-up">
          {title}
        </h1>

        {/* Description */}
        <p
          className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-8 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          {description}
        </p>

        {/* Breadcrumb / Category (Optional) */}
        {category && (
          <div
            className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/"
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-indigo-400">{category}</span>
          </div>
        )}
      </div>
    </section>
  );
}
