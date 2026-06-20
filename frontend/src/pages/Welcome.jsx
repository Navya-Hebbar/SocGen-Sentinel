import React from "react";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Users, Activity, Database, ChevronDown } from "lucide-react";

export default function Welcome({ onEnterPortal }) {
  const features = [
    {
      title: "Third-Party Registry",
      desc: "Dynamic vendor registries, security threat feeds, active breaches monitoring, and real-time risk score indexing.",
      icon: Users,
      glowClass: "hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
      iconGlow: "bg-blue-500/10 text-blue-400 border-blue-500/20 icon-glow-blue",
      tag: "VULNERABILITY TELEMETRY"
    },
    {
      title: "Threat Sandbox Modeling",
      desc: "Simulate multi-factor authentication (MFA), database encryption, and audit policies to estimate overall risk reduction.",
      icon: Activity,
      glowClass: "hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]",
      iconGlow: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 icon-glow-blue",
      tag: "ESTIMATION SANDBOX"
    },
    {
      title: "Contract AI Parser",
      desc: "Automated NLP engine parses uploaded PDF/TXT service agreements, flags low liability caps, and generates audit warnings.",
      icon: Database,
      glowClass: "hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]",
      iconGlow: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 icon-glow-blue",
      tag: "NLP LIABILITY REVIEW"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-x-hidden select-none text-slate-200">
      {/* Blurred Cyber HUD Background with Blue Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-all duration-1000 ease-in-out pointer-events-none z-0 scale-105 filter blur-sm"
        style={{
          backgroundImage: "linear-gradient(rgba(3, 7, 18, 0.92), rgba(3, 7, 18, 0.95)), url('/cyber_sentinel_bg.png')"
        }}
      ></div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none z-0"></div>

      {/* Top Navbar */}
      <header className="h-20 w-full px-8 md:px-12 flex items-center justify-between z-10 border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-blue-400 filter drop-shadow(0 0 3px rgba(59, 130, 246, 0.5))" />
          </div>
          <span className="font-display font-bold text-sm tracking-wider uppercase text-white">
            SocGen <span className="text-blue-400">Sentinel</span>
          </span>
        </div>
        <div>
          <button 
            onClick={onEnterPortal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-blue-500/30 text-blue-400 hover:text-white hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer bg-slate-950/50"
          >
            Portal Access
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-grow z-10 flex flex-col justify-between">
        
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto py-16 md:py-24 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-semibold tracking-widest uppercase font-mono shadow-[0_0_15px_rgba(59,130,246,0.08)]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              SecOps Shield Terminal v2.1
            </div>

            {/* Typography Heading */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-8xl font-display font-extrabold tracking-tight text-white leading-none uppercase">
                SocGen
              </h1>
              <h1 className="text-5xl md:text-8xl font-serif-italic text-blue-400 tracking-wide leading-none filter drop-shadow(0 0 8px rgba(59,130,246,0.3))">
                Sentinel AI
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
              Automated third-party vendor risk assessment, sandbox threat remediation modeling, and NLP contract compliance parser. Designed for next-gen corporate infrastructure defense.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={onEnterPortal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.03] cursor-pointer shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.45)]"
              >
                Launch Control Portal <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Scroll cue */}
          <div className="pt-8 animate-bounce text-slate-600 flex flex-col items-center gap-1">
            <span className="text-[9px] uppercase tracking-widest font-mono">Platform Capabilities</span>
            <ChevronDown className="w-4 h-4 text-blue-500/60" />
          </div>
        </section>

        {/* Feature Cards Grid Section */}
        <section className="px-6 md:px-12 py-16 border-t border-slate-900 bg-slate-950/60 backdrop-blur-sm relative overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Section Title */}
            <div className="text-center space-y-1.5">
              <span className="text-[10px] text-blue-500 uppercase tracking-widest font-mono font-semibold">Security Framework Modules</span>
              <h2 className="text-xl md:text-2xl font-bold font-display text-white uppercase">Operational Threat Domains</h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div 
                    key={idx}
                    onClick={onEnterPortal}
                    className={`glass-panel rounded-xl p-5 hover:bg-slate-900/30 transition-all duration-300 border border-slate-800/80 group flex flex-col justify-between h-56 cursor-pointer ${feat.glowClass}`}
                  >
                    <div className="space-y-3">
                      {/* Icon */}
                      <div className="flex justify-between items-start">
                        <div className={`p-2.5 rounded-lg border relative overflow-hidden ${feat.iconGlow}`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <span className="text-[8px] text-slate-500 font-mono tracking-wider uppercase font-semibold">{feat.tag}</span>
                      </div>

                      {/* Header */}
                      <h3 className="text-sm font-semibold text-white font-display group-hover:text-blue-400 transition-colors pt-1.5">
                        {feat.title}
                      </h3>

                      {/* Desc */}
                      <p className="text-xs text-slate-400 leading-relaxed font-light font-sans line-clamp-3">
                        {feat.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] text-blue-400 group-hover:text-blue-300 font-semibold tracking-wider uppercase pt-3 border-t border-slate-900">
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="h-16 w-full flex items-center justify-center text-[10px] text-slate-600 tracking-widest uppercase font-mono border-t border-slate-900 bg-slate-950">
        © {new Date().getFullYear()} SocGen Sentinel. All Rights Reserved.
      </footer>
    </div>
  );
}
