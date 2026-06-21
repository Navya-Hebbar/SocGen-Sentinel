import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Shield, ArrowRight, Users, Activity, Database, FileCheck, TrendingUp, Radio, ChevronRight, Zap, Lock, BarChart3, Cpu } from "lucide-react";

/* ─── Animated Number Counter ─── */
function Counter({ target, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

const features = [
  { icon: Users, title: "Risk Diagnosis", desc: "Continuous scanning maps subprocessor trees and indexes live vendor threat scores in real-time.", color: "#818cf8", glow: "rgba(129,140,248,0.12)", dim: "rgba(129,140,248,0.2)" },
  { icon: Activity, title: "Threat Sandbox", desc: "Simulate MFA, encryption and security controls — instantly see the mathematical risk reduction.", color: "#22d3ee", glow: "rgba(34,211,238,0.1)", dim: "rgba(34,211,238,0.2)" },
  { icon: Database, title: "AI Contract Review", desc: "Deep NLP flags risky clauses, low liability caps, and GDPR violations in vendor agreements.", color: "#a78bfa", glow: "rgba(167,139,250,0.1)", dim: "rgba(167,139,250,0.2)" },
  { icon: FileCheck, title: "Compliance Radar", desc: "Track SOC2, ISO27001, and GDPR controls dynamically with automated expiry alerts.", color: "#34d399", glow: "rgba(52,211,153,0.1)", dim: "rgba(52,211,153,0.2)" },
  { icon: TrendingUp, title: "Predictive AI", desc: "ML-powered trajectory forecasting predicts vendor risk escalation 90 days before it happens.", color: "#fbbf24", glow: "rgba(251,191,36,0.1)", dim: "rgba(251,191,36,0.2)" },
  { icon: Radio, title: "Breach Monitor", desc: "CISA KEV threat intelligence cross-references your vendor registry for instant breach detection.", color: "#f87171", glow: "rgba(248,113,113,0.1)", dim: "rgba(248,113,113,0.2)" },
];

const stats = [
  { value: 400, suffix: "+", label: "Vendors Tracked" },
  { value: 98, suffix: "%", label: "Risk Accuracy" },
  { value: 72, suffix: "h", label: "Breach Response" },
  { value: 3, suffix: "x", label: "Faster Audits" },
];

export default function Welcome({ onEnterPortal }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* Particle network canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.4,
      color: Math.random() > 0.5 ? "rgba(99,102,241," : "rgba(6,182,212,",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const mx = mouseRef.current.x, my = mouseRef.current.y;

      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
        if (d < 180) { p.x -= dx * 0.008; p.y -= dy * 0.008; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "0.6)";
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const dist = Math.hypot(pts[j].x - p.x, pts[j].y - p.y);
          if (dist < 130) {
            const a = (1 - dist / 130) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${a})`; ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
      });
      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const onMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMove); };
  }, []);

  return (
    <div className="min-h-screen w-screen flex flex-col relative overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg, #03040d 0%, #060918 40%, #04060f 100%)" }}>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0, opacity: 0.4 }}
      >
        <source src="/homebg.mp4" type="video/mp4" />
      </video>

      {/* Cinematic dark overlay gradient on top of the video to ensure high contrast/text readability */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 0,
        background: "radial-gradient(circle at center, rgba(3, 4, 13, 0.45) 0%, rgba(3, 4, 13, 0.85) 75%, rgba(2, 3, 10, 0.98) 100%)"
      }} />

      {/* Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.9 }} />

      {/* Orbs */}
      <div className="orb" style={{ width: 700, height: 700, top: -250, right: -200, background: "radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 65%)" }} />
      <div className="orb" style={{ width: 600, height: 600, bottom: -200, left: -150, background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 65%)" }} />
      <div className="orb" style={{ width: 400, height: 400, top: "40%", left: "40%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />

      {/* Cyber grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 0,
        backgroundImage: "linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }} />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #4f46e5, #06b6d4)", boxShadow: "0 4px 20px rgba(79,70,229,0.5)" }}>
              <Shield className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="absolute -inset-0.5 rounded-xl opacity-50" style={{ background: "linear-gradient(135deg, #4f46e5, #06b6d4)", filter: "blur(8px)", zIndex: -1 }} />
          </div>
          <div>
            <span className="font-display font-bold text-sm tracking-wide text-white">SocGen</span>
            <span className="font-display font-bold text-sm tracking-wide" style={{ color: "#22d3ee" }}> Sentinel</span>
          </div>
        </motion.div>

        <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          onClick={onEnterPortal}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold tracking-wide text-white transition-all"
          style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.2)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(99,102,241,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.12)"; e.currentTarget.style.boxShadow = "none"; }}>
          Launch Portal <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-5xl mx-auto">



          {/* Main title */}
          <h1 className="hero-title mb-5">
            <motion.span
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="block text-white" style={{ textShadow: "0 0 35px rgba(99,102,241,0.65), 0 0 70px rgba(99,102,241,0.3)" }}>
              SOCGEN
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.8 }}
              className="block text-gradient" style={{ textShadow: "0 0 35px rgba(34,211,238,0.55), 0 0 70px rgba(34,211,238,0.25)" }}>
              SENTINEL
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-sm md:text-base font-semibold tracking-[0.18em] uppercase font-mono mb-5"
            style={{ color: "#64748b", letterSpacing: "0.2em" }}>
            AI-Powered&nbsp;&nbsp;·&nbsp;&nbsp;Third-Party Risk Intelligence&nbsp;&nbsp;·&nbsp;&nbsp;Real-Time
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed mb-10">
            Continuous compliance auditing, predictive threat mitigation, and NLP contract analysis — 
            securing your entire downstream corporate dependency chain at enterprise scale.
          </motion.p>

          {/* CTA Button */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
            <motion.button
              onClick={onEnterPortal}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-sm font-bold tracking-wide text-white cursor-pointer overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #0891b2 100%)",
                boxShadow: "0 0 50px rgba(79,70,229,0.45), 0 20px 40px -10px rgba(0,0,0,0.5)"
              }}>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.06] transition-opacity" />
              <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30" />
              <span>Launch Control Portal</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-14 mb-14 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.1 }}
              whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.12)", boxShadow: "0 12px 40px rgba(0,0,0,0.5)" }}
              className="text-center px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-md min-w-[150px] shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] transition-all duration-300">
              <div className="font-display font-black text-3xl text-white mb-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
                {mounted && <Counter target={s.value} duration={2000} suffix={s.suffix} />}
              </div>
              <div className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Header: Platform Capabilities */}
        <div className="w-full max-w-6xl mx-auto mt-8 mb-10 flex flex-col items-center justify-center text-center relative">
          {/* Subtle glowing orb behind header */}
          <div className="absolute w-[200px] h-[50px] bg-indigo-500/10 blur-[40px] rounded-full -top-4 pointer-events-none" />
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 mb-3">
            <Cpu className="w-3 h-3 text-indigo-400 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] font-mono text-indigo-300">Operational Suite</span>
          </div>

          <h2 className="text-xl md:text-2xl font-display font-black text-white uppercase tracking-wider mb-2">
            Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.25)]">Capabilities</span>
          </h2>
          
          <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
            Harnessing generative AI, predictive classifiers, and real-time monitoring to secure your corporate supply chain.
          </p>

          {/* Futuristic horizontal line indicator */}
          <div className="w-16 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent mt-4 opacity-50" />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-6xl mx-auto">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.08, duration: 0.5 }}
                onClick={onEnterPortal}
                className="feature-card group"
                style={{ "--feat-color": feat.color, "--feat-color-dim": feat.dim, "--feat-glow": feat.glow }}>
                
                {/* Icon Box */}
                <div className="feature-icon-box" style={{ background: feat.glow, border: `1px solid ${feat.dim}` }}>
                  <Icon className="w-5 h-5" style={{ color: feat.color }} />
                </div>

                {/* Content */}
                <h3 className="text-sm font-bold text-white mb-2 font-display tracking-wide group-hover:text-white transition-colors duration-300">{feat.title}</h3>
                <p className="text-[11.5px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{feat.desc}</p>
                
                {/* Action Arrow */}
                <div className="feature-explore" style={{ color: feat.color }}>
                  Explore Platform <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
