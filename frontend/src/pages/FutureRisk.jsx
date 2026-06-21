import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Cell, Area, AreaChart
} from "recharts";
import {
  TrendingUp, AlertTriangle, Clock, ChevronRight,
  Zap, Activity, Shield, ArrowUpRight
} from "lucide-react";
import { fetchFutureRisk, fetchFutureRiskAll } from "../utils/api";

export default function FutureRisk({ vendors, setActiveTab, setSelectedVendor }) {
  const [allPredictions, setAllPredictions] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [trajectory, setTrajectory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  // Load all future risk predictions
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchFutureRiskAll();
      if (data?.predictions) {
        setAllPredictions(data.predictions);
      } else {
        // Fallback: generate from vendor data
        const mock = vendors
          .map(v => ({
            vendor_id: v.id,
            current_severity: v.riskLevel,
            escalation_probability: Math.min(99, Math.max(0,
              (v.riskScore > 70 ? 40 : 0) +
              (v.daysUntilSoc2Expiry < 90 && v.daysUntilSoc2Expiry > 0 ? 25 : 0) +
              (v.daysUntilContractEnd < 90 && v.daysUntilContractEnd > 0 ? 20 : 0) +
              (v.breachStatus ? 30 : 0) +
              Math.random() * 10
            )),
            reasons: [
              ...(v.daysUntilSoc2Expiry < 90 && v.daysUntilSoc2Expiry > 0 ? [`SOC2 expires in ${v.daysUntilSoc2Expiry} days`] : []),
              ...(v.daysUntilContractEnd < 90 && v.daysUntilContractEnd > 0 ? [`Contract expires in ${v.daysUntilContractEnd} days`] : []),
              ...(v.breachStatus ? ["Active breach detected"] : []),
              ...(v.riskScore > 70 ? ["Elevated base risk score"] : []),
            ]
          }))
          .sort((a, b) => b.escalation_probability - a.escalation_probability);
        setAllPredictions(mock);
      }
      setLoading(false);
    };
    load();
  }, [vendors]);

  // Load trajectory for selected vendor
  useEffect(() => {
    if (!selectedVendorId) {
      if (allPredictions.length > 0) {
        setSelectedVendorId(allPredictions[0].vendor_id);
      }
      return;
    }

    const loadDetail = async () => {
      setDetailLoading(true);
      const data = await fetchFutureRisk(selectedVendorId, 120);
      if (data?.trajectory) {
        setTrajectory(data);
      } else {
        // Fallback mock trajectory
        const v = vendors.find(x => x.id === selectedVendorId);
        const base = v?.riskScore || 50;
        setTrajectory({
          vendor_id: selectedVendorId,
          current_severity: v?.riskLevel || "Medium",
          escalation_probability: 45,
          trajectory: [0, 15, 30, 45, 60, 90, 120].map(d => ({
            days_ahead: d,
            predicted_severity: base + d * 0.15 > 80 ? "CRITICAL" : base + d * 0.15 > 60 ? "HIGH" : base + d * 0.15 > 40 ? "MEDIUM" : "LOW",
            probabilities: {
              LOW: Math.max(0, 30 - d * 0.3),
              MEDIUM: Math.max(0, 40 - d * 0.2),
              HIGH: Math.min(50, 20 + d * 0.2),
              CRITICAL: Math.min(50, 10 + d * 0.3),
            }
          })),
          reasons: ["Risk trend increasing", "Certifications expiring"]
        });
      }
      setDetailLoading(false);
    };
    loadDetail();
  }, [selectedVendorId, allPredictions, vendors]);

  const getEscalationColor = (prob) => {
    if (prob >= 70) return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", bar: "#f87171" };
    if (prob >= 40) return { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", bar: "#fb923c" };
    if (prob >= 20) return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", bar: "#fbbf24" };
    return { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", bar: "#34d399" };
  };

  const getSeverityColor = (sev) => {
    const s = (sev || "").toUpperCase();
    if (s === "CRITICAL" || s === "Critical") return "#f87171";
    if (s === "HIGH" || s === "High") return "#fb923c";
    if (s === "MEDIUM" || s === "Medium") return "#fbbf24";
    return "#34d399";
  };

  const top10 = allPredictions.slice(0, 10);
  const selectedPred = allPredictions.find(p => p.vendor_id === selectedVendorId);
  const selectedVendor = vendors.find(v => v.id === selectedVendorId);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] bg-purple-500/15 border border-purple-500/30 text-purple-400 px-2 py-0.5 rounded font-mono uppercase tracking-widest">Predictive Intelligence</span>
        </div>
        <h2 className="text-xl font-bold font-display text-white">Future Risk Prediction</h2>
        <p className="text-xs text-slate-500 mt-0.5">ML-powered risk trajectory forecasting — predict vendor escalation before it happens</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20 glass-panel rounded-2xl">
          <Activity className="w-6 h-6 text-blue-500 animate-spin mr-3" />
          <span className="text-sm text-slate-400">Computing risk trajectories for {vendors.length} vendors...</span>
        </div>
      ) : (
        <>
          {/* Top Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Critical Escalation", value: allPredictions.filter(p => p.escalation_probability >= 70).length, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
              { label: "High Risk Trending", value: allPredictions.filter(p => p.escalation_probability >= 40 && p.escalation_probability < 70).length, icon: TrendingUp, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
              { label: "Moderate Watch", value: allPredictions.filter(p => p.escalation_probability >= 20 && p.escalation_probability < 40).length, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
              { label: "Stable Vendors", value: allPredictions.filter(p => p.escalation_probability < 20).length, icon: Shield, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-panel rounded-xl p-4 flex items-center justify-between h-20 relative overflow-hidden">
                  <div className="radial-glow absolute inset-0"></div>
                  <div className="z-10">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">{stat.label}</span>
                    <span className="text-2xl font-bold font-display text-white mt-1 block">{stat.value}</span>
                  </div>
                  <div className={`p-2 rounded-lg border z-10 ${stat.bg} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 10 Escalation Risks */}
            <div className="glass-panel rounded-xl p-5 lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900/60">
                <div>
                  <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Top 10 Escalation Risks (60 Days)</h4>
                  <p className="text-[10px] text-slate-500">Vendors most likely to increase in severity within 60 days</p>
                </div>
                <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                {top10.map((pred, idx) => {
                  const v = vendors.find(x => x.id === pred.vendor_id);
                  const esc = getEscalationColor(pred.escalation_probability);
                  const isSelected = pred.vendor_id === selectedVendorId;
                  return (
                    <motion.div
                      key={pred.vendor_id}
                      onClick={() => setSelectedVendorId(pred.vendor_id)}
                      whileHover={{ scale: 1.01 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected ? "bg-blue-600/10 border-blue-500/40" : "bg-slate-900/20 border-slate-800/40 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-600 font-mono w-5">#{idx + 1}</span>
                        <div>
                          <p className="text-xs font-semibold text-white">{v?.name || pred.vendor_id}</p>
                          <p className="text-[10px] text-slate-500">{v?.industry || "Unknown"} • Current: {pred.current_severity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Probability bar */}
                        <div className="w-24 bg-slate-900 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full transition-all`} style={{ width: `${Math.min(100, pred.escalation_probability)}%`, backgroundColor: esc.bar }}></div>
                        </div>
                        <span className={`text-sm font-bold font-mono ${esc.text} w-12 text-right`}>
                          {Math.round(pred.escalation_probability)}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Selected Vendor Detail */}
            <div className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[420px]">
              {selectedVendor && selectedPred ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-white">{selectedVendor.name}</h4>
                    <p className="text-[10px] text-slate-500">{selectedVendor.industry} • Score: {selectedVendor.riskScore}/100</p>
                  </div>

                  {/* Big Probability Display */}
                  <div className="text-center py-4">
                    <div className={`inline-flex flex-col items-center p-6 rounded-2xl border ${getEscalationColor(selectedPred.escalation_probability).bg} ${getEscalationColor(selectedPred.escalation_probability).border}`}>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest">Escalation Probability</span>
                      <span className={`text-4xl font-extrabold font-display mt-1 ${getEscalationColor(selectedPred.escalation_probability).text}`}>
                        {Math.round(selectedPred.escalation_probability)}%
                      </span>
                      <span className="text-[9px] text-slate-500 mt-1">within 60 days</span>
                    </div>
                  </div>

                  {/* Reasons */}
                  <div>
                    <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Escalation Drivers</h5>
                    <div className="space-y-1.5">
                      {(selectedPred.reasons || []).slice(0, 4).map((reason, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300 font-light">
                          <ChevronRight className="w-3 h-3 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mini Trajectory Chart */}
                  {trajectory?.trajectory && (
                    <div>
                      <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Risk Trajectory</h5>
                      <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trajectory.trajectory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="days_ahead" stroke="#475569" fontSize={8} tickLine={false} />
                            <YAxis stroke="#475569" fontSize={8} tickLine={false} domain={[0, 100]} />
                            <Tooltip
                              contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8, fontSize: 10 }}
                              labelStyle={{ color: "#94a3b8" }}
                            />
                            <Area type="monotone" dataKey="probabilities.CRITICAL" name="Critical" stroke="#f87171" fill="url(#critGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="probabilities.HIGH" name="High" stroke="#fb923c" fill="url(#highGrad)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                  Select a vendor to view trajectory
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
