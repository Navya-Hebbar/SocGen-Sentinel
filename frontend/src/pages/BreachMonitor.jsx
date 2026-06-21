import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert, Wifi, AlertTriangle, ExternalLink,
  RefreshCw, Radio, Zap, Clock, Activity
} from "lucide-react";
import { fetchBreachFeed, fetchVendorBreaches } from "../utils/api";


export default function BreachMonitor({ vendors }) {
  const [feed, setFeed] = useState([]);
  const [vendorBreaches, setVendorBreaches] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async () => {
    setLoading(true);
    const data = await fetchBreachFeed();
    if (data?.feed) {
      setFeed(data.feed);
    } else {
      setFeed([]);
    }
    setLoading(false);
  };

  useEffect(() => { loadFeed(); }, []);

  // Load breaches for breached vendors
  useEffect(() => {
    const breachedVendors = vendors.filter(v => v.breachStatus || v.activeBreaches > 0).slice(0, 5);
    breachedVendors.forEach(async (v) => {
      const data = await fetchVendorBreaches(v.name);
      if (data?.breaches) {
        setVendorBreaches(prev => ({ ...prev, [v.id]: data.breaches }));
      }
    });
  }, [vendors]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFeed();
    setRefreshing(false);
  };

  const getSeverityStyles = (sev) => {
    switch (sev) {
      case "Critical": return "bg-red-500/10 border-red-500/20 text-red-400";
      case "High": return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "Medium": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      default: return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }
  };

  const filteredFeed = selectedSeverity === "All" ? feed : feed.filter(f => f.severity === selectedSeverity);

  const breachedVendorsList = vendors.filter(v => v.breachStatus || v.activeBreaches > 0);
  const criticalCount = feed.filter(f => f.severity === "Critical").length;
  const highCount = feed.filter(f => f.severity === "High").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="badge badge-red">Live threat intel</span>
            <span className="badge badge-orange">Zero-Day Radar</span>
          </div>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">
            Breach <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.25)]">Monitoring Center</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">Real-time cybersecurity threat intelligence feed with vendor correlation</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Scanning..." : "Refresh Feed"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Threats", value: feed.length, icon: Radio, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Critical Alerts", value: criticalCount, icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          { label: "High Severity", value: highCount, icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
          { label: "Breached Vendors", value: breachedVendorsList.length, icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
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
        {/* Threat Feed */}
        <div className="glass-panel rounded-xl p-5 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-900/60">
            <div>
              <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Global Threat Intelligence Feed</h4>
              <p className="text-[10px] text-slate-500">Aggregated from news sources and security advisories</p>
            </div>
            <div className="flex gap-1.5">
              {["All", "Critical", "High", "Medium"].map(sev => (
                <button
                  key={sev}
                  onClick={() => setSelectedSeverity(sev)}
                  className={`px-2 py-0.5 rounded text-[9px] font-semibold border transition-all ${
                    selectedSeverity === sev
                      ? "bg-blue-600/15 border-blue-500/40 text-white"
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Activity className="w-5 h-5 text-blue-500 animate-spin mr-2" />
              <span className="text-xs text-slate-400">Scanning threat feeds...</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {filteredFeed.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-3 rounded-lg bg-slate-900/20 border border-slate-800/40 hover:border-slate-700 transition-all group"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-slate-200 font-medium leading-relaxed group-hover:text-white transition-colors">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] text-slate-500">{item.source}</span>
                        <span className="text-[9px] text-slate-600">•</span>
                        <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {item.date}
                        </span>
                        {item.type === "real_news" && (
                          <span className="text-[8px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono">LIVE</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold whitespace-nowrap ${getSeverityStyles(item.severity)}`}>
                      {item.severity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Affected Vendors Panel */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[420px]">
          <div>
            <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Affected Vendor Registry</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Vendors with active breach indicators</p>
          </div>

          <div className="space-y-2 mt-4 flex-grow overflow-y-auto max-h-[380px] pr-1">
            {breachedVendorsList.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                <ShieldAlert className="w-8 h-8 text-emerald-500/40 mx-auto mb-3" />
                No vendors currently flagged for breaches
              </div>
            ) : (
              breachedVendorsList.map(v => (
                <div key={v.id} className="p-3 rounded-lg bg-red-950/10 border border-red-500/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-white">{v.name}</p>
                      <p className="text-[9px] text-slate-500">{v.industry} • Score: {v.riskScore}</p>
                    </div>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </div>
                  <div className="text-[10px] text-red-300 font-light">
                    {v.riskFactors?.[0] || "Active breach detected"}
                  </div>
                  {vendorBreaches[v.id]?.length > 0 && (
                    <div className="border-t border-red-500/10 pt-1.5 space-y-1">
                      {vendorBreaches[v.id].slice(0, 2).map((b, i) => (
                        <p key={i} className="text-[9px] text-slate-400 truncate">• {b.title}</p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="text-[9px] text-slate-600 text-center pt-3 border-t border-slate-900/60 uppercase tracking-widest font-semibold">
            Monitoring {vendors.length} vendors continuously
          </div>
        </div>
      </div>
    </div>
  );
}
