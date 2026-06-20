import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  ArrowRight, 
  Users, 
  Activity, 
  Database, 
  FileCheck 
} from "lucide-react";

export default function Welcome({ onEnterPortal }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let animationFrameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50; 
    const connectionDistance = 150;
    const mouse = { x: null, y: null, radius: 200 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= dx * force * 0.015;
            this.y -= dy * force * 0.015;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.4)";
        ctx.fill();
      }
    }

    const init = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const alpha = (1 - distance / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    
    init();
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const features = [
    {
      title: "RISK DIAGNOSIS",
      desc: "Ditch manual excel checklists. Continuous scanning maps subprocessor trees and indexes live vendor threat scores.",
      icon: Users,
      iconColor: "text-blue-400",
      iconGlow: "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
    },
    {
      title: "THREAT SANDBOX",
      desc: "Model control enhancements before commit. Simulate MFA, encryption, and log policies to estimate risk index reduction.",
      icon: Activity,
      iconColor: "text-cyan-400",
      iconGlow: "bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
    },
    {
      title: "AI LEGAL REVIEW",
      desc: "Scan vendor service agreements. Deep NLP engine immediately flags low liability exposure caps and privacy discrepancies.",
      icon: Database,
      iconColor: "text-indigo-400",
      iconGlow: "bg-indigo-500/10 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
    },
    {
      title: "COMPLIANCE RADAR",
      desc: "Ensure continuous alignment. Track SOC2, ISO27001, and GDPR controls dynamically with automated warning tasks.",
      icon: FileCheck,
      iconColor: "text-blue-400",
      iconGlow: "bg-blue-500/10 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
    }
  ];

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col relative overflow-hidden select-none text-slate-200">
      
      {/* Background Tech Loop Video - HIGH VISIBILITY */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 mix-blend-screen pointer-events-none"
      >
        <source src="/cyber_bg.mp4" type="video/mp4" />
      </video>

      {/* Massive Glowing Orbs for stunning backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none z-0 mix-blend-overlay"></div>

      {/* Interactive HTML5 Canvas Plexus Animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80 mix-blend-screen" 
      />

      {/* Top Navbar */}
      <header className="flex-none w-full flex items-center justify-between z-10 py-3 px-6 md:px-10 border-b border-slate-900/60 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-400 filter drop-shadow(0 0 4px rgba(59, 130, 246, 0.6))" />
          </div>
          <span className="font-display font-bold text-sm tracking-widest uppercase text-white">
            SocGen <span className="text-blue-400">Sentinel</span>
          </span>
        </div>
        <div>
          <button 
            onClick={onEnterPortal}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 text-blue-400 hover:text-white hover:bg-blue-500/10 hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer bg-slate-950/60"
          >
            Portal Access
          </button>
        </div>
      </header>

      {/* Main Container - Strictly flexed to prevent scrolling */}
      <main className="flex-1 z-10 flex flex-col justify-between w-full max-w-7xl mx-auto px-6 py-6 h-full">
        
        {/* Top Half: Massive Hero Area */}
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/40 text-blue-400 text-[10px] font-bold tracking-widest uppercase font-mono shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              System Online // SecOps v2.5
            </div>

            {/* Massive Glowing Title */}
            <div className="space-y-2">
              <h1 
                className="text-6xl md:text-8xl lg:text-[7rem] font-display font-extrabold tracking-tighter text-white leading-none uppercase"
                style={{ textShadow: "0 0 40px rgba(34, 211, 238, 0.3), 0 0 80px rgba(59, 130, 246, 0.2)" }}
              >
                SOCGEN SENTINEL
              </h1>
              <p className="text-gradient-cyan text-sm md:text-base font-bold tracking-[0.25em] uppercase font-mono mt-4 drop-shadow-md">
                AI-Powered Third-Party Risk Intelligence
              </p>
            </div>

            {/* Description */}
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm">
              Establishing continuous compliance auditing, predictive threat mitigation modeling, and NLP service agreement parsing to secure downstream corporate dependencies.
            </p>

            {/* Launch Portal Button */}
            <div className="pt-4">
              <button
                onClick={onEnterPortal}
                className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.03] cursor-pointer shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <span className="relative">Launch Control Portal</span>
                <ArrowRight className="w-4 h-4 relative transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
          
        </div>

        {/* Bottom Half: Feature Cards Grid (Compact & Absolute Fit) */}
        <div className="flex-none w-full pb-2">
          
          {/* Section Headers aligned precisely to the reference image */}
          <div className="flex flex-col items-center text-center space-y-1 mb-4">
            <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-[0.3em] font-mono drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              FEATURES
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase font-display drop-shadow-md">
              WHY IS IT USEFUL?
            </h2>
          </div>

          {/* 4 Feature Cards Row - Exact Match to User Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  onClick={onEnterPortal}
                  className="glass-glossy p-5 flex flex-col justify-start text-left h-[180px] cursor-pointer group"
                >
                  {/* Circular Icon Top Left */}
                  <div className="mb-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${feat.iconGlow}`}>
                      <Icon className={`w-4 h-4 ${feat.iconColor}`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-extrabold text-white tracking-widest uppercase mb-2 font-display group-hover:text-blue-400 transition-colors drop-shadow-sm">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] text-slate-400 leading-relaxed font-light line-clamp-3">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </main>
    </div>
  );
}
