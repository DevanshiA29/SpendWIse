"use client";

import { ArrowUp, Heart, Sparkles, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-auto overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 pt-16 pb-8 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          {/* Brand/Logo Area */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <Sparkles className="h-6 w-6 text-pink-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
                SpendWise
              </span>
            </Link>
            <p className="text-blue-200/60 max-w-xs text-center md:text-left text-sm font-medium">
              Empowering your financial journey with intelligent insights and seamless tracking.
            </p>
          </div>

          {/* Made with Love Banner */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(236,72,153,0.15)] group cursor-default relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-2.5 bg-pink-500/10 rounded-xl group-hover:scale-110 group-hover:bg-pink-500/20 transition-all duration-300 relative z-10">
                <Heart className="h-5 w-5 text-pink-500 fill-pink-500/20 group-hover:fill-pink-500 animate-pulse" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-blue-100 tracking-wide">
                  Crafted with passion
                </p>
                <p className="text-xs text-blue-300/70 mt-0.5">
                  by <span className="text-pink-400 font-bold tracking-wide text-sm drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">Devanshi Awasthi</span>
                </p>
              </div>
            </div>
            
            {/* Scroll to Top Button (Mobile prominent) */}
            <Button
              variant="outline"
              onClick={scrollToTop}
              className="md:hidden flex items-center gap-2 rounded-full bg-white/5 border-white/10 text-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
            >
              <ArrowUp className="h-4 w-4" />
              Back to top
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-blue-200/50 text-sm font-medium">
            © {new Date().getFullYear()} SpendWise. All rights reserved.
          </p>

          <div className="hidden md:flex items-center gap-6">
            <span className="text-blue-200/40 text-sm font-medium">Back to top</span>
            {/* Scroll to Top Button (Desktop) */}
            <Button
              variant="outline"
              size="icon"
              onClick={scrollToTop}
              className="rounded-full bg-white/5 border-white/10 text-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:-translate-y-1"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
