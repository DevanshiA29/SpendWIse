"use client";
 
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, PieChart, Receipt, Sparkles, ArrowRight, TrendingUp, Zap } from "lucide-react";

const HeroSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-slate-50">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 z-0"></div>
      
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-slate-50/50 to-slate-50 z-10 pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute top-40 -left-40 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-blue-100/50 text-blue-600 font-semibold text-sm mb-8 shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <Sparkles className="h-4 w-4 text-pink-500" />
            <span>The future of expense tracking</span>
          </div>

          {/* Main Headline */}
          <h1 className={`text-6xl md:text-8xl font-extrabold tracking-tight mb-8 transition-all duration-1000 delay-100 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 drop-shadow-sm">
              Smart Receipts,
            </span>
            <br />
            <span className="text-slate-800 drop-shadow-sm">
              Smarter Finance.
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-medium transition-all duration-1000 delay-200 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            An AI-powered financial management platform that helps you track,
            analyze, and optimize your spending with real-time insights.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row justify-center items-center gap-6 transition-all duration-1000 delay-300 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-300 rounded-full group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="https://www.youtube.com/@ash29924t">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-full flex items-center gap-2 group">
                <PieChart className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Glassmorphism Cards Container */}
        <div className={`mt-24 relative max-w-5xl mx-auto transition-all duration-1000 delay-500 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
            
            {/* Card 1 */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.1)] rounded-[2rem] p-8 transform md:-translate-y-6 hover:-translate-y-10 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Receipt className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">AI Receipt Scanner</h3>
              <p className="text-slate-600 leading-relaxed">Instantly digitize your paper trails. Just snap a photo, and our AI extracts the data automatically.</p>
            </div>

            {/* Card 2 - Center Highlighted */}
            <div className="bg-white backdrop-blur-2xl border-2 border-purple-100 shadow-[0_30px_80px_rgba(168,85,247,0.15)] hover:shadow-[0_30px_80px_rgba(168,85,247,0.25)] rounded-[2rem] p-8 transform hover:-translate-y-4 transition-all duration-500 relative z-20">
              <div className="absolute -top-4 -right-4">
                <span className="flex h-8 w-8 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-gradient-to-r from-pink-500 to-purple-500 items-center justify-center shadow-lg">
                     <Zap className="h-4 w-4 text-white" />
                  </span>
                </span>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 border border-purple-200/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Real-Time Analytics</h3>
              <p className="text-slate-600 leading-relaxed">Visualize your spending patterns with interactive charts and intelligent budgeting insights.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_rgba(236,72,153,0.1)] rounded-[2rem] p-8 transform md:-translate-y-3 hover:-translate-y-7 transition-all duration-500">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-pink-50 border border-pink-200/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Wallet className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Smart Budgets</h3>
              <p className="text-slate-600 leading-relaxed">Set custom budgets for any category. Get notified before you overspend, not after.</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;