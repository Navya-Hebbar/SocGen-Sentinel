import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Search, ShieldAlert, X, CheckCircle2, AlertTriangle, Zap, ChevronRight } from "lucide-react";

const breadcrumbs = {
  dashboard: ["Intelligence", "Security Operations Overview"],
  vendors: ["Ecosystem", "Vendor Registry"],
  riskAnalysis: ["AI Engine", "Risk Analysis & Remediation"],
  compliance: ["Governance", "Compliance Standards Matrix"],
  contractAI: ["Legal AI", "Contract Intelligence Parser"],
  futureRisk: ["Predictive ML", "Future Risk Trajectories"],
  breachMonitor: ["Threat Intel", "Live Breach Monitor"],
  auditReport: ["Reports", "Executive Audit Portfolio"],
};

export default function Navbar({ activeTab, notifications, setNotifications, threatLevel = {} }) {
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState("");
  const unread = notifications.length;
  const [parent, child] = breadcrumbs[activeTab] || ["Sentinel", "Dashboard"];

  const threatConfig = {
    CRITICAL: { text: "#fb7185", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.3)", glow: "0 0 16px rgba(244,63,94,0.15)" },
    ELEVATED: { text: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.28)", glow: "0 0 16px rgba(251,146,60,0.12)" },
    SECURE: { text: "#34d399", bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.22)", glow: "none" },
  };
  const tc = threatConfig[threatLevel.label] || threatConfig.ELEVATED;

  return (
    <header className="print:hidden h-14 sticky top-0 z-20 px-5 flex items-center justify-between select-none flex-shrink-0"
      style={{
        background: "rgba(3, 4, 13, 0.88)",
        backdropFilter: "blur(28px) saturate(200%)",
        WebkitBackdropFilter: "blur(28px) saturate(200%)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>

      {/* Animated scan line */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(6,182,212,0.3), transparent)" }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="w-0.5 h-6 rounded-full" style={{ background: "linear-gradient(to bottom, #6366f1, #06b6d4)" }} />
        <div>
          <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest font-mono font-bold" style={{ color: "#818cf8" }}>
            <span>SocGen Sentinel</span>
            <ChevronRight className="w-2.5 h-2.5" />
            <span>{parent}</span>
          </div>
          <p className="text-[13px] font-semibold text-slate-200 leading-tight mt-0.5">{child}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">


        {/* Threat Level */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono"
          style={{ background: tc.bg, border: `1px solid ${tc.border}`, color: tc.text, boxShadow: tc.glow }}>
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="tracking-wider">{threatLevel.label || "ELEVATED"}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <motion.button
            id="notifications-btn"
            whileTap={{ scale: 0.92 }}
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all"
            style={{
              background: showNotif ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${showNotif ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
              color: showNotif ? "#a5b4fc" : "#475569",
              boxShadow: showNotif ? "0 0 16px rgba(99,102,241,0.15)" : "none",
            }}>
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-black text-white"
                style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)", boxShadow: "0 2px 8px rgba(244,63,94,0.5)" }}>
                {unread > 9 ? "9+" : unread}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.94 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50"
                style={{
                  background: "rgba(4, 6, 18, 0.98)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 40px 80px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.1)"
                }}>
                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(99,102,241,0.04)" }}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" style={{ color: "#818cf8" }} />
                    <span className="text-xs font-bold text-white">Alert Logs</span>
                    {unread > 0 && <span className="badge badge-blue">{unread}</span>}
                  </div>
                  {unread > 0 && (
                    <button onClick={() => setNotifications([])}
                      className="text-[10px] font-semibold transition-colors font-mono uppercase tracking-wider"
                      style={{ color: "#334155" }}
                      onMouseEnter={e => e.target.style.color = "#a5b4fc"}
                      onMouseLeave={e => e.target.style.color = "#334155"}>
                      Clear all
                    </button>
                  )}
                </div>

                {/* Notifications list */}
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-3" style={{ color: "#34d399" }} />
                      <p className="text-xs font-semibold text-slate-400">All systems secure</p>
                      <p className="text-[10px] text-slate-600 mt-1">No outstanding alerts</p>
                    </div>
                  ) : (
                    notifications.map(item => (
                      <motion.div key={item.id} layout
                        className="px-4 py-3 flex gap-3 relative group cursor-default"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.2)" }}>
                          <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#fb923c" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-slate-200 truncate">{item.vendorName}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{item.content}</p>
                          <span className="text-[10px] mt-1 block font-mono" style={{ color: "#64748b" }}>{item.timestamp || "Just now"}</span>
                        </div>
                        <button
                          onClick={() => setNotifications(p => p.filter(n => n.id !== item.id))}
                          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          style={{ color: "#94a3b8" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                          onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
