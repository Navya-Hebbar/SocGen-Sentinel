import React from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert, LayoutDashboard, Users, Activity, FileCheck,
  Database, ChevronLeft, ChevronRight, LogOut, TrendingUp, Radio, ClipboardCheck, Cpu
} from "lucide-react";

const sections = [
  {
    label: "Intelligence",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "vendors", label: "Vendors", icon: Users },
      { id: "riskAnalysis", label: "Risk Analysis", icon: Activity },
    ]
  },
  {
    label: "Monitoring",
    items: [
      { id: "futureRisk", label: "Future Risk", icon: TrendingUp },
      { id: "breachMonitor", label: "Breach Monitor", icon: Radio },
    ]
  },
  {
    label: "Governance",
    items: [
      { id: "compliance", label: "Compliance", icon: FileCheck },
      { id: "contractAI", label: "Contract AI", icon: Database },
      { id: "auditReport", label: "Audit Report", icon: ClipboardCheck },
    ]
  }
];

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, onSignOut }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 250 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="print:hidden h-screen sticky top-0 left-0 flex flex-col z-30 select-none overflow-hidden flex-shrink-0"
      style={{
        background: "rgba(3, 4, 13, 0.92)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}>

      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(6,182,212,0.3), transparent)" }} />

      {/* Logo */}
      <div className="flex items-center justify-between px-3.5 h-[60px] flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="flex items-center gap-2.5">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #4f46e5, #06b6d4)", boxShadow: "0 0 20px rgba(79,70,229,0.45)" }}>
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-[13px] text-white tracking-wide">SocGen</span>
              <span className="font-display font-bold text-[13px] tracking-wide" style={{ color: "#22d3ee" }}> Sentinel</span>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div className="mx-auto w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4f46e5, #06b6d4)", boxShadow: "0 0 16px rgba(79,70,229,0.4)" }}>
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1.5 rounded-lg transition-all flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#94a3b8" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#a5b4fc"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 pt-3 pb-2 space-y-0">
        {sections.map((section, si) => (
          <div key={section.label}>
            {!collapsed && (
              <div className="px-2 pt-4 pb-1.5 first:pt-2">
                <span className="section-label">{section.label}</span>
              </div>
            )}
            {collapsed && si > 0 && <div className="my-2.5" style={{ height: "1px", background: "rgba(255,255,255,0.04)" }} />}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: collapsed ? 0 : 2 }}
                  transition={{ duration: 0.15 }}
                  className={`nav-item ${isActive ? "active" : ""} mb-0.5`}
                  title={collapsed ? item.label : undefined}>
                  <div className="nav-active-bar" />
                  <Icon className={`nav-icon w-4 h-4 flex-shrink-0 ${isActive ? "" : "text-slate-400"}`} />
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                      className="text-[13px]">{item.label}</motion.span>
                  )}
                  {/* Collapsed tooltip */}
                  {collapsed && (
                    <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all"
                      style={{ background: "rgba(4,6,18,0.98)", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
                      {item.label}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: collapse toggle + sign out */}
      <div className="flex-shrink-0 p-2.5 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        {collapsed && (
          <button onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl transition-all"
            style={{ color: "#94a3b8" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#a5b4fc"; e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-widest transition-all"
          style={{ color: "#94a3b8", fontFamily: "var(--font-mono)" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#fb7185"; e.currentTarget.style.background = "rgba(244,63,94,0.07)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; }}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
