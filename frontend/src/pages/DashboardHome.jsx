import React from "react";
import { motion } from "framer-motion";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid
} from "recharts";
import { 
  Users, 
  ShieldAlert, 
  Clock, 
  Activity, 
  ChevronRight, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  AlertOctagon
} from "lucide-react";
import ProductionBanner from "../components/ProductionBanner";

// Dynamic Data Aggregators
const getRiskDistributionData = (vendors) => {
  const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  vendors.forEach(v => {
    if (counts[v.riskLevel] !== undefined) {
      counts[v.riskLevel]++;
    }
  });
  return [
    { name: "Low", value: counts.Low, color: "#34d399" },
    { name: "Medium", value: counts.Medium, color: "#fbbf24" },
    { name: "High", value: counts.High, color: "#fb923c" },
    { name: "Critical", value: counts.Critical, color: "#f87171" }
  ];
};

const getComplianceStatusData = (vendors) => {
  let soc2Count = 0, gdprCount = 0, isoCount = 0;
  vendors.forEach(v => {
    if (v.complianceStatus?.SOC2 === "Compliant") soc2Count++;
    if (v.complianceStatus?.GDPR === "Compliant") gdprCount++;
    if (v.complianceStatus?.ISO27001 === "Compliant") isoCount++;
  });
  return [
    { name: "SOC 2 Type II", compliant: soc2Count, partial: vendors.length - soc2Count, amt: vendors.length },
    { name: "GDPR Compliance", compliant: gdprCount, partial: vendors.length - gdprCount, amt: vendors.length },
    { name: "ISO 27001 Audit", compliant: isoCount, partial: vendors.length - isoCount, amt: vendors.length }
  ];
};

const computeRiskHeatmap = (vendors) => {
  const matrix = [
    { likelihood: "High", impact: "High", count: 0, vendors: [] },
    { likelihood: "High", impact: "Medium", count: 0, vendors: [] },
    { likelihood: "Medium", impact: "High", count: 0, vendors: [] },
    { likelihood: "Medium", impact: "Medium", count: 0, vendors: [] },
    { likelihood: "Low", impact: "High", count: 0, vendors: [] },
    { likelihood: "Low", impact: "Low", count: 0, vendors: [] }
  ];

  vendors.forEach(v => {
    let l = "Low";
    if (v.riskScore > 75) l = "High";
    else if (v.riskScore > 40) l = "Medium";

    let i = "Low";
    const hasSensitiveData = v.dataAssetsShared?.toLowerCase().includes("pii") || v.dataAssetsShared?.toLowerCase().includes("financial") || v.dataAssetsShared?.toLowerCase().includes("credentials") || v.dataAssetsShared?.toLowerCase().includes("telemetry");
    if (hasSensitiveData) i = "High";
    else if (v.subprocessors > 10) i = "Medium";

    let cell = matrix.find(c => c.likelihood === l && c.impact === i);
    if (!cell) {
      if (l === "Low") cell = matrix.find(c => c.likelihood === "Low" && c.impact === "Low");
      else cell = matrix.find(c => c.likelihood === l && c.impact === "Medium");
    }

    if (cell) {
      cell.count++;
      cell.vendors.push(v.name);
    }
  });

  return matrix;
};

export default function DashboardHome({ 
  vendors, 
  expiryAlerts, 
  recentActivities, 
  setActiveTab,
  setSelectedVendor,
  setHeatmapFilter
}) {
  // Statistics
  const totalVendors = vendors.length;
  const highRiskVendors = vendors.filter(v => v.riskLevel === "High" || v.riskLevel === "Critical").length;
  const expiredCertsCount = expiryAlerts.filter(a => a.status === "expired").length;
  const breachedVendorsCount = vendors.filter(v => v.activeBreaches > 0).length;

  const riskDistribution = getRiskDistributionData(vendors);
  const complianceData = getComplianceStatusData(vendors);

  // Ecosystem health calculation
  const averageRisk = Math.round(vendors.reduce((acc, curr) => acc + curr.riskScore, 0) / vendors.length) || 50;
  const securityIndex = 100 - averageRisk;

  const handleHeatmapCellClick = (vendorsList) => {
    if (vendorsList && vendorsList.length > 0) {
      setHeatmapFilter(vendorsList);
      setActiveTab("vendors");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6 select-none"
    >
      {/* Visual Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl glass-panel relative overflow-hidden">
        <div className="z-10 space-y-1">
          <span className="text-[10px] bg-blue-500/15 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded font-mono uppercase tracking-widest">Security Operations Portal</span>
          <h2 className="text-xl font-bold font-display text-white mt-1.5">SocGen Sentinel Dashboard</h2>
          <p className="text-xs text-slate-400 font-light">Third-Party Vendor Risk Management Platform</p>
        </div>
        <div className="z-10 flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase font-mono">System Active</span>
        </div>
      </div>

      <ProductionBanner 
        title="Continuous Threat Monitoring" 
        description="This dashboard displays real-time metrics across your vendors. It automatically evaluates the overall security score based on active SOC2/ISO certificates, vulnerabilities, and contract risk analysis."
      />

      {vendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-2xl max-w-xl mx-auto space-y-6 relative overflow-hidden my-12">
          <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <ShieldAlert className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2 z-10">
            <h3 className="font-display font-semibold text-lg text-white">Ecosystem Registry Empty</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Awaiting vendor data payload. Populate the central database catalog at <code className="text-blue-400 bg-[#18181b] px-1.5 py-0.5 rounded">public/data.json</code> to initialize automated security feeds and compliance charts.
            </p>
          </div>
          <div className="flex gap-3 z-10">
            <button 
              onClick={() => setActiveTab("vendors")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 border border-blue-500/40 text-white text-xs font-semibold transition-all cursor-pointer shadow-lg shadow-blue-500/10"
            >
              Register Vendor Manually
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Grid: Stats Overview Cards (Compact & Minimalist) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Vendors", value: totalVendors, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", glowClass: "icon-glow-blue" },
              { label: "High Risk Focus", value: highRiskVendors, icon: AlertTriangle, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", glowClass: "icon-glow-orange" },
              { label: "Expired Certifications", value: expiredCertsCount, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", glowClass: "icon-glow-yellow" },
              { label: "Active Breaches", value: breachedVendorsCount, icon: ShieldAlert, color: breachedVendorsCount > 0 ? "text-red-400 pulse-red" : "text-zinc-400", bg: breachedVendorsCount > 0 ? "bg-red-500/10 border-red-500/30" : "bg-[#18181b] border-[#27272a]", glowClass: breachedVendorsCount > 0 ? "icon-glow-red" : "icon-glow-blue" }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="glass-panel glow-card-hover rounded-xl p-4 flex items-center justify-between relative overflow-hidden h-20">
                  <div className="z-10">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-medium">{stat.label}</span>
                    <span className="text-2xl font-bold font-display text-white mt-1 block">{stat.value}</span>
                  </div>
                  <div className={`p-2 rounded-lg border z-10 relative overflow-hidden ${stat.glowClass} ${stat.bg} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid: 3 Visual Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Security Shield circular Index (Minimalist WOW factor) */}
            <div className="glass-panel rounded-xl p-5 flex flex-col justify-between items-center min-h-[300px]">
              <div className="w-full">
                <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Overall Security Score</h4>
                <p className="text-[10px] text-slate-500">Aggregate security score across all vendors</p>
              </div>
              
              <div className="relative flex items-center justify-center my-4">
                {/* SVG Ring Dial */}
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="rgba(15, 23, 42, 0.7)" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="60" 
                    stroke={securityIndex > 70 ? "#34d399" : "#fb923c"} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={376.8}
                    strokeDashoffset={376.8 - (376.8 * securityIndex) / 100}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold font-display text-white">{securityIndex}%</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block mt-0.5">Secure State</span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 bg-[#18181b] border border-[#27272a] px-3 py-1 rounded-full">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Operational risk remains at <span className="font-semibold text-white">{averageRisk}%</span></span>
              </div>
            </div>

            {/* Center Column: Risk Pie distribution (Clean and precise) */}
            <div className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
              <div>
                <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Risk Level breakdown</h4>
                <p className="text-[10px] text-slate-500">Distribution segments across catalog</p>
              </div>
              <div className="h-44 w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={68}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center mt-[-2px]">
                  <span className="text-xl font-bold font-display text-white">{vendors.length}</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest block">Vendors</span>
                </div>
              </div>
              <div className="flex justify-around text-[10px] text-slate-400 border-t border-slate-900/60 pt-2.5">
                {riskDistribution.map((d, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                    <span>{d.name}: <strong className="text-white">{d.value}</strong></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Compliance Audits status bar chart (Focused) */}
            <div className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
              <div>
                <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Compliance Matrix Audits</h4>
                <p className="text-[10px] text-slate-500">Total vendors matching policy standard checklists</p>
              </div>
              <div className="h-44 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={complianceData}
                    margin={{ top: 10, right: 0, left: -24, bottom: 0 }}
                    barSize={12}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.1)" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <Bar name="Compliant" dataKey="compliant" fill="#34d399" radius={[3, 3, 0, 0]} />
                    <Bar name="Partial / Non-Compliant" dataKey="partial" fill="#fb923c" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[9px] text-slate-500 flex justify-between border-t border-slate-900/60 pt-2.5">
                <span>Updated hourly</span>
                <button 
                  onClick={() => setActiveTab("compliance")}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  Audits tracker <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid: Table & Heatmap Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Side: High Risk Vendors Roster (2/3 Column) */}
            <div className="glass-panel rounded-xl p-5 lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-900/60">
                <div>
                  <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">High Risk Vendors</h4>
                  <p className="text-[10px] text-slate-500">Vendors requiring immediate review</p>
                </div>
                <button 
                  onClick={() => setActiveTab("vendors")}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                >
                  All Vendors <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-900 text-slate-500 font-semibold uppercase tracking-widest text-[9px]">
                      <th className="pb-2.5 pl-1">Vendor Name</th>
                      <th className="pb-2.5 text-center">Score</th>
                      <th className="pb-2.5">Risk Level</th>
                      <th className="pb-2.5">Primary Risk Factor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900/60">
                    {vendors
                      .filter(v => v.riskLevel === "High" || v.riskLevel === "Critical")
                      .slice(0, 3)
                      .map((vendor) => (
                        <tr 
                          key={vendor.id} 
                          className="hover:bg-slate-900/30 transition-colors group cursor-pointer"
                          onClick={() => {
                            setSelectedVendor(vendor);
                            setActiveTab("vendors");
                          }}
                        >
                          <td className="py-2.5 font-semibold text-white pl-1 group-hover:text-blue-400 transition-colors">
                            {vendor.name}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className="font-mono font-bold text-red-400">
                              {(vendor.riskScore / 10).toFixed(1)}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span className={`inline-flex items-center gap-1 font-semibold ${
                              vendor.riskLevel === "Critical" ? "text-red-400" : "text-orange-400"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                vendor.riskLevel === "Critical" ? "bg-red-500 animate-pulse" : "bg-orange-500"
                              }`}></span>
                              {vendor.riskLevel}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-400 truncate max-w-xs font-light">
                            {vendor.riskFactors?.[0] || "No critical factors recorded."}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Side: Quick Risk Matrix Grid (1/3 Column) */}
            <div className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
              <div>
                <h4 className="font-display font-semibold text-xs text-white uppercase tracking-wider">Risk Matrix</h4>
                <p className="text-[10px] text-slate-500">Filter vendors by likelihood and impact</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2.5 my-3 flex-grow items-center justify-center">
                {computeRiskHeatmap(vendors).map((cell, idx) => {
                  const bg = 
                    cell.likelihood === "High" && cell.impact === "High" ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20" :
                    cell.likelihood === "High" && cell.impact === "Medium" ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20" :
                    cell.likelihood === "Medium" && cell.impact === "High" ? "bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20" :
                    cell.likelihood === "Medium" && cell.impact === "Medium" ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20" :
                    "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20";
                    
                  return (
                    <button
                      key={idx}
                      onClick={() => handleHeatmapCellClick(cell.vendors)}
                      className={`p-2 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${bg} cursor-pointer group`}
                    >
                      <span className="text-base font-bold group-hover:scale-110 transition-transform">{cell.count}</span>
                      <span className="text-[8px] font-semibold uppercase mt-0.5 opacity-85 truncate max-w-full">
                        {cell.likelihood[0]}L/{cell.impact[0]}I
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </>
      )}
    </motion.div>
  );
}
