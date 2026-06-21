import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  AreaChart, Area, CartesianGrid,
} from "recharts";
import {
  Users, ShieldAlert, Clock, AlertTriangle, ArrowUpRight, TrendingUp,
  FileCheck, Zap, ShieldCheck, Eye, Activity, BarChart3,
} from "lucide-react";

/* ─── Animated Counter ─── */
function Counter({ to, duration = 1800 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= to) { setV(to); clearInterval(t); }
      else setV(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [to]);
  return <>{v}</>;
}

/* ─── Data helpers ─── */
const getRisk = vendors => {
  const c = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  vendors.forEach(v => c[v.riskLevel] !== undefined && c[v.riskLevel]++);
  return [
    { name: "Critical", value: c.Critical, color: "#f43f5e" },
    { name: "High", value: c.High, color: "#fb923c" },
    { name: "Medium", value: c.Medium, color: "#fbbf24" },
    { name: "Low", value: c.Low, color: "#34d399" },
  ];
};

const getCompliance = vendors => {
  let s = 0, g = 0, iso = 0;
  vendors.forEach(v => {
    if (v.complianceStatus?.SOC2 === "Compliant") s++;
    if (v.complianceStatus?.GDPR === "Compliant") g++;
    if (v.complianceStatus?.ISO27001 === "Compliant") iso++;
  });
  const t = vendors.length || 1;
  return [
    { name: "SOC2", pct: Math.round(s / t * 100), color: "#818cf8" },
    { name: "ISO 27001", pct: Math.round(iso / t * 100), color: "#22d3ee" },
    { name: "GDPR", pct: Math.round(g / t * 100), color: "#34d399" },
  ];
};

const getHeatmap = vendors => {
  const m = [
    // Row 1: Likelihood High (H)
    { l: "H", i: "L", count: 0, vendors: [], bg: "rgba(251,146,60,0.10)", border: "rgba(251,146,60,0.28)", text: "#fb923c", label: "High" },
    { l: "H", i: "M", count: 0, vendors: [], bg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.3)", text: "#fb7185", label: "Critical" },
    { l: "H", i: "H", count: 0, vendors: [], bg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.3)", text: "#fb7185", label: "Critical" },

    // Row 2: Likelihood Medium (M)
    { l: "M", i: "L", count: 0, vendors: [], bg: "rgba(52,211,153,0.05)", border: "rgba(52,211,153,0.15)", text: "#34d399", label: "Low" },
    { l: "M", i: "M", count: 0, vendors: [], bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.25)", text: "#fbbf24", label: "Medium" },
    { l: "M", i: "H", count: 0, vendors: [], bg: "rgba(244,63,94,0.12)", border: "rgba(244,63,94,0.3)", text: "#fb7185", label: "Critical" },

    // Row 3: Likelihood Low (L)
    { l: "L", i: "L", count: 0, vendors: [], bg: "rgba(52,211,153,0.05)", border: "rgba(52,211,153,0.15)", text: "#34d399", label: "Low" },
    { l: "L", i: "M", count: 0, vendors: [], bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.2)", text: "#34d399", label: "Low" },
    { l: "L", i: "H", count: 0, vendors: [], bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.22)", text: "#fb923c", label: "High" },
  ];
  vendors.forEach(v => {
    const l = v.riskScore > 75 ? "H" : v.riskScore > 40 ? "M" : "L";
    const sensitive = v.dataAssetsShared?.toLowerCase().match(/pii|financial|customer/);
    const i = sensitive ? "H" : v.subprocessors > 8 ? "M" : "L";
    const cell = m.find(c => c.l === l && c.i === i);
    if (cell) {
      cell.count++;
      cell.vendors.push(v.name);
    }
  });
  return m;
};

const badgeLevel = level => {
  const m = { Critical: "badge-critical", High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
  return <span className={`badge ${m[level] || "badge-blue"}`}>{level}</span>;
};

const CustomTooltip = ({ active, payload, label }) => active && payload?.length ? (
  <div style={{ background: "rgba(4,6,18,0.97)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12, padding: "10px 14px" }}>
    <p style={{ fontSize: 10, color: "#475569", marginBottom: 4, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
    {payload.map((p, i) => <p key={i} style={{ fontSize: 12, fontWeight: 700, color: p.color || "#e2e8f0" }}>{p.name}: {p.value}</p>)}
  </div>
) : null;

const stagger = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] } } },
};

export default function DashboardHome({ vendors, expiryAlerts, recentActivities, setActiveTab, setSelectedVendor, setHeatmapFilter }) {
  const total = vendors.length;
  const high = vendors.filter(v => v.riskLevel === "High" || v.riskLevel === "Critical").length;
  const expired = expiryAlerts.filter(a => a.status === "expired").length;
  const breached = vendors.filter(v => v.activeBreaches > 0).length;
  const avgRisk = Math.round(vendors.reduce((a, v) => a + v.riskScore, 0) / (vendors.length || 1));
  const secIdx = 100 - avgRisk;

  const riskDist = getRisk(vendors);
  const compliance = getCompliance(vendors);
  const heatmap = getHeatmap(vendors);
  const topHigh = vendors.filter(v => v.riskLevel === "High" || v.riskLevel === "Critical").slice(0, 6);

  const statCards = [
    { label: "Total Vendors", value: total, icon: Users, accent: "#818cf8", glow: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.22)" },
    { label: "High Risk", value: high, icon: AlertTriangle, accent: "#fb923c", glow: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.22)" },
    { label: "Expired Certs", value: expired, icon: Clock, accent: "#fbbf24", glow: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.22)" },
    { label: "Active Breaches", value: breached, icon: ShieldAlert, accent: breached > 0 ? "#f43f5e" : "#475569", glow: breached > 0 ? "rgba(244,63,94,0.08)" : "transparent", border: breached > 0 ? "rgba(244,63,94,0.28)" : "rgba(71,85,105,0.2)" },
  ];

  return (
    <motion.div variants={stagger.container} initial="hidden" animate="show" className="p-5 space-y-5">

      {/* ── Header Banner ── */}
      <motion.div variants={stagger.item} className="glass-panel p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        {/* Animated corner orb */}
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", filter: "blur(20px)" }} />

        <div className="z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-blue">Security Operations Center</span>
            <span className="badge badge-cyan">XGBoost ML Active</span>
          </div>
          <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white">
            Vendor <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.25)]">Intelligence Dashboard</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 font-medium tracking-wide">Real-time third-party risk — powered by XGBoost + SHAP Explainability AI</p>
        </div>

        <div className="flex items-center gap-4 z-10">
          {/* Security index ring - mini */}
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="-rotate-90 w-16 h-16">
              <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="none" />
              <circle cx="32" cy="32" r="26"
                stroke="url(#miniRingGrad)"
                strokeWidth="5" fill="none" strokeLinecap="round"
                strokeDasharray={163.4}
                strokeDashoffset={163.4 - (163.4 * secIdx / 100)}
                className="ring-track" />
              <defs>
                <linearGradient id="miniRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={secIdx > 50 ? "#34d399" : "#f43f5e"} />
                  <stop offset="100%" stopColor={secIdx > 50 ? "#06b6d4" : "#fb923c"} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display font-black text-sm text-white leading-none">{secIdx}%</span>
              <span className="text-[7px] text-slate-500 uppercase tracking-widest leading-tight mt-0.5">Safe</span>
            </div>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Security Index</p>
            <p className="font-display font-black text-3xl" style={{ color: secIdx > 50 ? "#34d399" : "#f43f5e" }}>{secIdx}<span className="text-lg">%</span></p>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div variants={stagger.item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.25, ease: [0.23,1,0.32,1] }}
              className="stat-card"
              style={{ "--card-accent": s.accent, "--card-border": s.border, "--card-glow": s.glow, "--card-shadow": s.glow }}>
              {/* Background icon watermark */}
              <div className="absolute right-3 bottom-3 opacity-[0.04]">
                <Icon className="w-12 h-12" style={{ color: s.accent }} />
              </div>
              <p className="section-label mb-3">{s.label}</p>
              <p className="font-display font-black text-4xl text-white mb-1">
                <Counter to={s.value} />
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.glow}`, border: `1px solid ${s.border}` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: s.accent }} />
                </div>
                <span className="text-[10px] text-slate-500">Active count</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Charts Row ── */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Security Score - Big Ring */}
        <div className="glass-card p-6 flex flex-col items-center gap-4">
          <div className="w-full">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" style={{ color: "#818cf8" }} /> Overall Security Score
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Aggregate across all {total} vendors</p>
          </div>

          <div className="relative flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full" style={{
              background: `conic-gradient(${secIdx > 50 ? "rgba(52,211,153,0.12)" : "rgba(244,63,94,0.12)"} ${secIdx * 3.6}deg, transparent 0)`,
              filter: "blur(8px)",
              borderRadius: "50%",
            }} />

            <svg width="156" height="156" className="-rotate-90">
              {/* Track */}
              <circle cx="78" cy="78" r="66" stroke="rgba(255,255,255,0.04)" strokeWidth="10" fill="none" />
              {/* Segmented decorative track */}
              {Array.from({ length: 60 }, (_, i) => {
                const a = i * 6 * Math.PI / 180;
                const x1 = 78 + 73 * Math.cos(a), y1 = 78 + 73 * Math.sin(a);
                const x2 = 78 + 78 * Math.cos(a), y2 = 78 + 78 * Math.sin(a);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />;
              })}
              {/* Main fill */}
              <circle cx="78" cy="78" r="66"
                stroke={`url(#bigRing)`}
                strokeWidth="10" fill="none" strokeLinecap="round"
                strokeDasharray={414.7}
                strokeDashoffset={414.7 - (414.7 * secIdx / 100)}
                className="ring-track"
              />
              <defs>
                <linearGradient id="bigRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  {secIdx > 50 ? (
                    <>
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </>
                  ) : (
                    <>
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#fb923c" />
                    </>
                  )}
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute text-center">
              <span className="font-display font-black text-4xl text-white">{secIdx}%</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block mt-1 font-mono">Secure State</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {[
              { label: "Avg Risk", value: `${avgRisk}%`, color: "#fb923c" },
              { label: "Critical", value: riskDist[0].value, color: "#f43f5e" },
            ].map((m, i) => (
              <div key={i} className="text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="font-display font-black text-lg" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-mono">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Donut */}
        <div className="glass-card p-5">
          <div className="card-header flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Risk Distribution</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">{vendors.length} vendors classified</p>
            </div>
            <Activity className="w-4 h-4" style={{ color: "#818cf8" }} />
          </div>

          <div className="relative" style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDist} cx="50%" cy="50%" innerRadius={48} outerRadius={66} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {riskDist.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-display font-black text-2xl text-white">{vendors.length}</span>
              <span className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Vendors</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {riskDist.map((d, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}80` }} />
                <span className="text-[10px] text-slate-400">{d.name}: <strong className="text-white font-bold">{d.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Coverage */}
        <div className="glass-card p-5">
          <div className="card-header flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white">Compliance Coverage</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Policy standard pass rates</p>
            </div>
            <FileCheck className="w-4 h-4" style={{ color: "#34d399" }} />
          </div>

          <div className="space-y-4">
            {compliance.map((c, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold text-slate-300">{c.name}</span>
                  <span className="font-display font-bold text-sm text-white">{c.pct}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${c.pct}%` }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.15, ease: [0.23, 1, 0.32, 1] }}
                    style={{ background: `linear-gradient(90deg, ${c.color}aa, ${c.color})` }} />
                </div>
                <div className="flex justify-between text-[9px] mt-1 font-mono">
                  <span style={{ color: "#334155" }}>{Math.round(total * c.pct / 100)} compliant</span>
                  <span style={{ color: "#334155" }}>{total - Math.round(total * c.pct / 100)} gaps</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => setActiveTab("compliance")} className="btn-ghost w-full mt-4 text-[11px]">
            <FileCheck className="w-3.5 h-3.5" /> Full Compliance Dashboard
          </button>
        </div>
      </motion.div>

      {/* ── Bottom Row: Table + Heatmap ── */}
      <motion.div variants={stagger.item} className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* High Risk Table */}
        <div className="glass-card p-5 lg:col-span-2">
          <div className="card-header flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" style={{ color: "#f43f5e" }} /> Red Flag Vendors
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Requiring immediate risk mitigation</p>
            </div>
            <button onClick={() => setActiveTab("vendors")} className="btn-ghost text-[10px] gap-1">
              All Vendors <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {topHigh.length === 0 ? (
            <div className="py-12 text-center">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2" style={{ color: "#34d399" }} />
              <p className="text-sm text-slate-500">No high-risk vendors detected</p>
            </div>
          ) : (
            <table className="sentinel-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th className="text-center">Score</th>
                  <th>Level</th>
                  <th className="hidden md:table-cell">Primary Factor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {topHigh.map((v, i) => (
                  <motion.tr key={v.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => { setSelectedVendor(v); setActiveTab("vendors"); }}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: v.riskLevel === "Critical" ? "rgba(244,63,94,0.1)" : "rgba(251,146,60,0.1)", border: `1px solid ${v.riskLevel === "Critical" ? "rgba(244,63,94,0.25)" : "rgba(251,146,60,0.25)"}` }}>
                          <span className="font-bold text-[10px]" style={{ color: v.riskLevel === "Critical" ? "#fb7185" : "#fb923c" }}>{v.name[0]}</span>
                        </div>
                        <span className="font-semibold text-white text-[12px]">{v.name}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="font-mono font-black" style={{ color: v.riskLevel === "Critical" ? "#f43f5e" : "#fb923c" }}>
                        {(v.riskScore / 10).toFixed(1)}
                      </span>
                    </td>
                    <td>{badgeLevel(v.riskLevel)}</td>
                    <td className="hidden md:table-cell text-[11px] max-w-[160px] truncate" style={{ color: "#475569" }}>
                      {v.riskFactors?.[0] || "—"}
                    </td>
                    <td>
                      <Eye className="w-3.5 h-3.5 transition-colors" style={{ color: "#334155" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#818cf8"}
                        onMouseLeave={e => e.currentTarget.style.color = "#334155"} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Risk Heatmap */}
        <div className="glass-card p-5">
          <div className="card-header">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" style={{ color: "#22d3ee" }} /> Risk Matrix
            </h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Click cells to filter vendors</p>
          </div>

          {/* Axis labels */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[8px] text-slate-600 font-mono uppercase tracking-widest writing-mode-vertical rotate-[-90deg] origin-center">Likelihood</span>
            <div className="flex-1">
              <div className="flex justify-between text-[8px] text-slate-600 font-mono mb-1 px-1">
                <span>Low</span><span>→ Impact</span><span>High</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {heatmap.map((cell, idx) => (
                  <motion.button key={idx} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                    onClick={() => { if (cell.vendors.length) { setHeatmapFilter(cell.vendors); setActiveTab("vendors"); } }}
                    className="flex flex-col items-center justify-center rounded-xl py-3.5 transition-all"
                    style={{ background: cell.bg, border: `1px solid ${cell.border}` }}>
                    <span className="font-display font-black text-2xl" style={{ color: cell.text }}>{cell.count}</span>
                    <span className="text-[8px] font-bold mt-0.5 font-mono uppercase" style={{ color: cell.text, opacity: 0.7 }}>
                      {cell.l}/{cell.i}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex flex-wrap gap-2">
              {[{ l: "Critical Zone", c: "#f43f5e" }, { l: "Elevated", c: "#fb923c" }, { l: "Managed", c: "#34d399" }].map(({ l, c }) => (
                <div key={l} className="flex items-center gap-1.5 text-[9px] font-mono" style={{ color: "#475569" }}>
                  <div className="w-2.5 h-2.5 rounded" style={{ background: c, opacity: 0.6 }} />{l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
