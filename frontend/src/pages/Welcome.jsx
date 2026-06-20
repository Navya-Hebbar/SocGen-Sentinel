import React from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, BookOpen, LogIn } from "lucide-react";

export default function Welcome({ onEnterPortal }) {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden select-none text-slate-200">
      {/* Blurred Cyber HUD Background matching the reference image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-all duration-1000 ease-in-out pointer-events-none z-0 scale-105 filter blur-xs"
        style={{
          backgroundImage: "linear-gradient(rgba(3, 7, 18, 0.9), rgba(3, 7, 18, 0.93)), url('/cyber_sentinel_bg.png')"
        }}
      ></div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none z-0"></div>

      {/* Top Navbar */}
      <header className="h-20 w-full px-8 md:px-12 flex items-center justify-between z-10 border-b border-white/5 bg-slate-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-emerald-400 filter drop-shadow(0 0 3px rgba(52, 211, 153, 0.5))" />
          </div>
          <span className="font-display font-bold text-sm tracking-wider uppercase text-white">
            SocGen <span className="text-emerald-400">Sentinel</span>
          </span>
        </div>
        <div>
          <button 
            onClick={onEnterPortal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/20 hover:border-emerald-400 hover:text-emerald-400 text-xs font-semibold tracking-wide uppercase transition-all duration-300 cursor-pointer bg-slate-950/30"
          >
            <LogIn className="w-3.5 h-3.5" /> Portal Access
          </button>
        </div>
      </header>

      {/* Hero Center Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 z-10 max-w-4xl mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold tracking-widest uppercase font-mono shadow-[0_0_15px_rgba(52,211,153,0.05)] mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            SecOps Risk Shield Engine Active
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-4xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-none uppercase">
              SocGen
            </h1>
            <h1 className="text-4xl md:text-7xl font-serif-italic text-emerald-400 tracking-wide leading-none select-none filter drop-shadow(0 0 8px rgba(52,211,153,0.3))">
              Sentinel AI
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
            AI-Powered Third-Party Vendor Risk Intelligence & Contract Clause Compliance Platform for Next-Gen Corporate Defenses.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={onEnterPortal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.03] cursor-pointer shadow-[0_4px_20px_rgba(52,211,153,0.3)] hover:shadow-[0_4px_25px_rgba(52,211,153,0.4)]"
            >
              Launch Control Portal <ArrowRight className="w-4 h-4" />
            </button>
            
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                alert("SocGen Sentinel is an advanced SecOps evaluation dashboard designed to analyze and remediate third-party software vendor supply chain liabilities dynamically.");
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-white/10 hover:border-white/30 hover:bg-white/5 text-slate-300 text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-400" /> About Platform
            </a>
          </div>
        </motion.div>
      </main>

      {/* Footer copyright */}
      <footer className="h-16 w-full flex items-center justify-center text-[10px] text-slate-600 tracking-widest uppercase font-mono z-10 border-t border-white/5 bg-slate-950/10">
        © {new Date().getFullYear()} SocGen Sentinel. All Rights Reserved.
      </footer>
    </div>
  );
}
