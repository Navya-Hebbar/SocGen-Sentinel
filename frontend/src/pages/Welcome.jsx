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
    const particleCount = 60; 
    const connectionDistance = 125;
    const mouse = { x: null, y: null, radius: 150 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
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
            this.x -= dx * force * 0.01;
            this.y -= dy * force * 0.01;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
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
            const alpha = (1 - distance / connectionDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
            ctx.lineWidth = 0.5;
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
      iconColor: "text-emerald-400",
      iconGlow: "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
    }
  ];

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col justify-between p-4 md:p-6 relative overflow-hidden select-none text-slate-200">
      
      {/* Background Tech Loop Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-15 pointer-events-none"
      >
        <source src="/cyber_bg.mp4" type="video/mp4" />
      </video>

      {/* Cyber Grid & Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950 pointer-events-none z-0"></div>
      <div className="absolute inset-0 radial-glow pointer-events-none z-0"></div>
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none z-0"></div>

      {/* Interactive HTML5 Canvas Plexus Animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-50" 
      />

      {/* Top Navbar */}
      <header className="w-full flex items-center justify-between z-10 py-1.5 border-b border-slate-900/40 bg-slate-950/20 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-400 filter drop-shadow(0 0 2px rgba(59, 130, 246, 0.4))" />
          </div>
          <span className="font-display font-bold text-xs tracking-wider uppercase text-white">
            SocGen <span className="text-blue-400">Sentinel</span>
          </span>
        </div>
        <div>
          <button 
            onClick={onEnterPortal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 text-blue-400 hover:text-white hover:border-blue-400 hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] text-[9px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer bg-slate-950/40"
          >
            Portal Access
          </button>
        </div>
      </header>

      {/* Hero & Title Center Area */}
      <main className="flex-grow z-10 flex flex-col justify-center items-center text-center max-w-5xl mx-auto py-2 space-y-4">
        
        {/* Status indicator pill */}
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[9px] font-semibold tracking-widest uppercase font-mono shadow-[0_0_10px_rgba(59,130,246,0.05)]">
          <span className="w-1 h-1 rounded-full bg-blue-400 animate-ping"></span>
          SecOps Shield v2.5
        </div>

        {/* Big Premium Header */}
        <div className="space-y-1">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-none uppercase">
            SOCGEN SENTINEL
          </h1>
          <p className="text-gradient-cyan text-xs md:text-sm font-semibold tracking-wider uppercase font-mono">
            AI-Powered Third-Party Risk Intelligence
          </p>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-xs md:text-sm max-w-xl font-light leading-relaxed">
          Establishing continuous compliance auditing, What-If threat mitigation simulation modeling, and NLP service agreement parsing.
        </p>

        {/* Launch Portal button */}
        <div className="pt-1">
          <button
            onClick={onEnterPortal}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 transform hover:scale-[1.02] cursor-pointer shadow-[0_4px_15px_rgba(59,130,246,0.25)]"
          >
            Launch Control Portal <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Features Title - Styled exactly like the User Reference image */}
        <div className="pt-4 space-y-0.5">
          <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest block font-mono">
            FEATURES
          </span>
          <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight uppercase">
            WHY IS IT USEFUL?
          </h2>
        </div>

        {/* 4 Feature Cards Row - Styled exactly like User Reference glassmorphism with glossy sheen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-1">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                onClick={onEnterPortal}
                className="glass-glossy p-4 flex flex-col justify-start text-left h-44 cursor-pointer group"
              >
                {/* Circular Icon with light glow */}
                <div className="mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${feat.iconGlow}`}>
                    <Icon className={`w-4 h-4 ${feat.iconColor}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-[11px] font-extrabold text-white tracking-wider uppercase mb-1.5 font-display group-hover:text-blue-400 transition-colors">
                  {feat.title}
                </h3>

                {/* Description */}
                <p className="text-[10px] text-slate-400 leading-relaxed font-light line-clamp-4">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full flex items-center justify-center text-[8px] text-slate-600 tracking-widest uppercase font-mono py-1.5 border-t border-slate-900/40">
        © {new Date().getFullYear()} SocGen Sentinel. All Rights Reserved.
      </footer>
    </div>
  );
}
