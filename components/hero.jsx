"use client";
 
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet, Coins, PieChart, Receipt, Sparkles, Banknote } from "lucide-react";

// Mapping icons to names for easy lookup
const componentsMap = {
  Wallet,
  Coins,
  PieChart,
  Receipt,
  Banknote,
};

// Generate deterministic pseudo-random values for 30 elements
// We use Object.keys to get the names of the icons available
const iconKeys = Object.keys(componentsMap);

const miniElements = Array.from({ length: 30 }).map((_, i) => {
  const angle = i * 137.5 * (Math.PI / 180); 
  const radius = 20 + i * 2.5; 
  
  return {
    id: i,
    type: iconKeys[i % iconKeys.length],
    tx: Math.cos(angle) * radius, 
    ty: Math.sin(angle) * radius, 
    delay: (i % 5) * 0.15,
    size: 24 + (i % 3) * 12,
    speed: 1.2 + (i % 5) * 0.4,
    color: ["text-blue-300", "text-orange-300", "text-purple-300", "text-pink-300", "text-emerald-300"][i % 5],
  };
});

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure scale doesn't break during server-side rendering
  const currentScale = typeof window !== "undefined" ? Math.max(0.85, 1 - scrollY * 0.0003) : 1;

  return (
    <section className="relative w-full h-[250vh] bg-[#12002b]">
      {/* Sticky Container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#12002b] via-[#d90368] to-[#fb8b24]">
        
        {/* Parallax Background Overlay */}
        <div 
          className="absolute inset-[-100px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#12002b]/40 to-[#12002b]/90 pointer-events-none transition-transform duration-75 ease-out will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />

        {/* Hero Text Content */}
        <div 
          className="relative z-20 text-center px-4 transition-transform duration-75 ease-out will-change-transform"
          style={{ transform: `scale(${currentScale})` }}
        >
          <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-200 to-orange-300 drop-shadow-2xl">
            Smart Receipts, <br /> Smarter Finance
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-medium tracking-wide drop-shadow-md">
            An AI-powered financial management platform that helps you track,
            analyze, and optimize your spending with real-time insights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 py-6 text-lg bg-white text-[#d90368] hover:bg-gray-100 hover:scale-105 transition-all shadow-lg">
                Get Started
              </Button>
            </Link>
            <Link href="https://www.youtube.com/@ash29924t">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg text-white border-white hover:bg-white/20 hover:scale-105 transition-all">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Bursting Mini Icons */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {miniElements.map((el) => {
            const IconComponent = componentsMap[el.type];
            return (
              <div
                key={el.id}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-out will-change-transform"
                style={{
                  transform: isMounted 
                    ? `translate(${el.tx}vw, ${el.ty}vh) translateY(${scrollY * el.speed}px) scale(1)`
                    : `translate(0px, 0px) scale(0)`,
                  transitionDelay: isMounted ? `${el.delay}s` : '0s',
                  opacity: isMounted ? 0.8 : 0,
                }}
              >
                <IconComponent className={`${el.color} drop-shadow-lg`} size={el.size} />
              </div>
            );
          })}
        </div>

        {/* Background Sparkles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Sparkles className="absolute top-1/4 left-1/4 text-white h-6 w-6 animate-pulse opacity-60" />
          <Sparkles className="absolute bottom-1/4 right-1/4 text-white h-8 w-8 animate-pulse opacity-50" style={{ animationDelay: "0.5s" }} />
          <Sparkles className="absolute top-1/2 right-1/5 text-white h-5 w-5 animate-pulse opacity-70" style={{ animationDelay: "1s" }} />
        </div>

      </div>
    </section>
  );
};

export default HeroSection;