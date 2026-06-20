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
  Legend, 
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  Activity, 
  ChevronRight, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { 
  getRiskDistributionData, 
  getComplianceStatusData, 
  mockRiskHeatmap 
} from "../data/mockData";

export default function DashboardHome({ 
  vendors, 
  expiryAlerts, 
  recentActivities, 
  setActiveTab,
  setSelectedVendor,
  setHeatmapFilter
}) {
  // Statistics Calculations
  const totalVendors = vendors.length;
  const highRiskVendors = vendors.filter(v => v.riskLevel === "High" || v.riskLevel === "Critical").length;
  const expiredCertsCount = expiryAlerts.filter(a => a.status === "expired").length;
  const breachedVendorsCount = vendors.filter(v => v.activeBreaches > 0).length;

  const riskDistribution = getRiskDistributionData(vendors);
  const complianceData = getComplianceStatusData(vendors);

  // Sparkline data for stats cards
  const sparklineData = [
    { value: 10 }, { value: 15 }, { value: 12 }, { value: 18 }, { value: 14 }, { value: 22 }, { value: 25 }
  ];

  const handleHeatmapCellClick = (vendorsList) => {
    if (vendorsList && vendorsList.length > 0) {
      setHeatmapFilter(vendorsList);
      setActiveTab("vendors");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6"
    >
      {/* Top Banner Warning if breached vendors exist */}
      {breachedVendorsCount > 0 && (
        <motion.div 
          variants={itemVariants}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.05)]"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <div>
              <p className="text-sm font-semibold text-white font-display">Active Breaches Detected</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {breachedVendorsCount} vendor{breachedVendorsCount > 1 ? "s are" : " is"} currently flagged with unresolved cybersecurity breaches. Actions required.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab("vendors")}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/35 border border-red-500/30 text-red-300 rounded-lg text-xs font-semibold transition-colors"
          >
            Review Incidents
          </button>
        </motion.div>
      )}

      {/* Grid: 4 Stats Cards */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {/* Card 1: Total Vendors */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-36">
          <div className="radial-glow absolute inset-0"></div>
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Vendors</span>
              <h3 className="text-3xl font-bold font-display text-white mt-1">{totalVendors}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mt-4 z-10">
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12% MoM
            </span>
            <span className="text-slate-500 font-light">Ecosystem active</span>
          </div>
        </motion.div>

        {/* Card 2: High Risk Vendors */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-36 border-orange-500/20">
          <div className="radial-glow absolute inset-0"></div>
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">High Risk Vendors</span>
              <h3 className="text-3xl font-bold font-display text-orange-400 mt-1">{highRiskVendors}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mt-4 z-10">
            <span className="text-slate-400 font-light">Score &gt; 70 threshold</span>
            <span className="text-orange-400 font-medium">Critical focus</span>
          </div>
        </motion.div>

        {/* Card 3: Expired Certifications */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-36 border-yellow-500/20">
          <div className="radial-glow absolute inset-0"></div>
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Expired Certs</span>
              <h3 className="text-3xl font-bold font-display text-yellow-400 mt-1">{expiredCertsCount}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mt-4 z-10">
            <span className="text-red-400 font-semibold">{expiredCertsCount} urgent renewals</span>
            <span className="text-slate-500 font-light">SOC2, ISO, GDPR</span>
          </div>
        </motion.div>

        {/* Card 4: Breached Vendors */}
        <motion.div variants={itemVariants} className={`glass-panel rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-36 ${breachedVendorsCount > 0 ? "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-slate-800"}`}>
          <div className="radial-glow absolute inset-0"></div>
          <div className="flex justify-between items-start z-10">
            <div>
              <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Breached Vendors</span>
              <h3 className={`text-3xl font-bold font-display mt-1 ${breachedVendorsCount > 0 ? "text-red-400" : "text-white"}`}>
                {breachedVendorsCount}
              </h3>
            </div>
            <div className={`p-2.5 rounded-lg border ${breachedVendorsCount > 0 ? "bg-red-500/20 border-red-500/30 text-red-400 pulse-red" : "bg-slate-900 border-slate-800 text-slate-400"}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs mt-4 z-10">
            <span className={breachedVendorsCount > 0 ? "text-red-400 font-semibold" : "text-emerald-400"}>
              {breachedVendorsCount > 0 ? "Incident Response Active" : "No active breaches"}
            </span>
            <span className="text-slate-500 font-light">Dark Web monitoring</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Grid: Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Pie Chart */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 lg:col-span-1 flex flex-col justify-between min-h-[380px]">
          <div>
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Risk Level Distribution
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Ecosystem breakdown of vendor risk segments</p>
          </div>
          <div className="h-60 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                  itemStyle={{ color: "#f1f5f9" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute text-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block">Average Score</span>
              <span className="text-3xl font-bold font-display text-white">58</span>
              <span className="text-[10px] text-slate-400 block font-medium">Medium Risk</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs mt-2">
            {riskDistribution.map((d, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full mb-1" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-400 font-medium">{d.name}</span>
                <span className="text-white font-semibold mt-0.5">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Compliance Status Chart */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[380px]">
          <div>
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-500" /> Compliance Framework Audits
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Compliant vs Non-Compliant/Partial statuses across core standards</p>
          </div>
          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={complianceData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 65, 85, 0.15)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
                />
                <Bar name="Compliant" dataKey="compliant" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar name="Partial / Non-Compliant" dataKey="partial" fill="#fb923c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-900/60 pt-3">
            <span>Scan cycle: Every 24 hours</span>
            <button 
              onClick={() => setActiveTab("compliance")}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline"
            >
              Auditing dashboard <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grid: Expiry, Heatmap, Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Grid */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
          <div>
            <h4 className="font-display font-semibold text-sm text-white">Risk Matrix (Likelihood vs Impact)</h4>
            <p className="text-xs text-slate-500 mt-0.5">Click cells to filter vendors in risk list</p>
          </div>
          <div className="grid grid-cols-3 gap-3 my-4 flex-grow justify-center items-center">
            {mockRiskHeatmap.map((cell, idx) => {
              const bg = 
                cell.likelihood === "High" && cell.impact === "High" ? "bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20" :
                cell.likelihood === "High" && cell.impact === "Medium" ? "bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-500/20" :
                cell.likelihood === "Medium" && cell.impact === "High" ? "bg-orange-500/10 border-orange-500/40 text-orange-400 hover:bg-orange-500/20" :
                cell.likelihood === "Medium" && cell.impact === "Medium" ? "bg-yellow-500/10 border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/20" :
                "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20";
                
              return (
                <button
                  key={idx}
                  onClick={() => handleHeatmapCellClick(cell.vendors)}
                  className={`p-3 rounded-lg border text-center flex flex-col items-center justify-center transition-all ${bg} cursor-pointer group`}
                >
                  <span className="text-lg font-bold group-hover:scale-110 transition-transform">{cell.count}</span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider mt-1 opacity-80 truncate max-w-full">
                    L:{cell.likelihood} / I:{cell.impact}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="text-[10px] text-slate-500 text-center leading-relaxed">
            Matrix mapped via AI security controls & historical incidents score.
          </div>
        </motion.div>

        {/* Expiry Alerts Feed */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
          <div>
            <h4 className="font-display font-semibold text-sm text-white">Compliance Expirations</h4>
            <p className="text-xs text-slate-500 mt-0.5">Critical certification deadlines requiring action</p>
          </div>
          <div className="space-y-3.5 my-4 overflow-y-auto max-h-60 pr-1 flex-grow">
            {expiryAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs ${
                  alert.status === "expired" 
                    ? "bg-red-500/5 border-red-500/10 text-red-300" 
                    : alert.status === "critical"
                    ? "bg-orange-500/5 border-orange-500/10 text-orange-300"
                    : "bg-yellow-500/5 border-yellow-500/10 text-yellow-300"
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-200">{alert.vendorName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{alert.certName}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-0.5 rounded font-semibold text-[9px] uppercase ${
                    alert.status === "expired" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                  }`}>
                    {alert.expiryDays < 0 ? "Expired" : `In ${alert.expiryDays} Days`}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{alert.expiryDate}</p>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveTab("compliance")}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 rounded-lg transition-colors text-center"
          >
            Manage Audit Documents
          </button>
        </motion.div>

        {/* Timeline Activities Feed */}
        <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
          <div>
            <h4 className="font-display font-semibold text-sm text-white">Threat Stream / Activity Log</h4>
            <p className="text-xs text-slate-500 mt-0.5">Real-time alerts and platform changes</p>
          </div>
          <div className="relative border-l border-slate-800 pl-4 space-y-4 my-4 overflow-y-auto max-h-60 pr-1 flex-grow">
            {recentActivities.map((act) => {
              const pulseColor = 
                act.type === "critical" ? "bg-red-400" :
                act.type === "warning" ? "bg-orange-400" :
                act.type === "success" ? "bg-emerald-400" : "bg-blue-400";
              return (
                <div key={act.id} className="relative text-xs">
                  {/* Timeline point */}
                  <span className={`absolute -left-[21px] top-1.5 rounded-full w-2 h-2 ${pulseColor}`}></span>
                  <div className="flex justify-between items-start gap-4">
                    <span className="font-semibold text-slate-200 hover:text-blue-400 cursor-pointer" onClick={() => {
                      const vend = vendors.find(v => v.id === act.vendorId);
                      if (vend) {
                        setSelectedVendor(vend);
                        setActiveTab("vendors");
                      }
                    }}>
                      {act.vendorName}
                    </span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-400 mt-0.5 leading-relaxed font-light">{act.content}</p>
                </div>
              );
            })}
          </div>
          <div className="text-[10px] text-slate-600 text-center uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Intelligence Feed Active
          </div>
        </motion.div>
      </div>

      {/* High Risk Vendors Table */}
      <motion.div variants={itemVariants} className="glass-panel rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="font-display font-semibold text-sm text-white">Vendor Security Roster (Focus Targets)</h4>
            <p className="text-xs text-slate-500 mt-0.5">Top exposure risks across active third parties</p>
          </div>
          <button 
            onClick={() => setActiveTab("vendors")}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 hover:underline"
          >
            All Vendors ({totalVendors}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Vendor Name</th>
                <th className="pb-3">Industry</th>
                <th className="pb-3 text-center">Risk Score</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3">Risk Factors</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60">
              {vendors
                .filter(v => v.riskLevel === "High" || v.riskLevel === "Critical")
                .map((vendor) => (
                  <tr 
                    key={vendor.id} 
                    className="hover:bg-slate-900/40 transition-colors group cursor-pointer"
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setActiveTab("vendors");
                    }}
                  >
                    <td className="py-3.5 font-semibold text-white pl-2 group-hover:text-blue-400 transition-colors">
                      {vendor.name}
                    </td>
                    <td className="py-3.5 text-slate-400">{vendor.industry}</td>
                    <td className="py-3.5 text-center">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                        vendor.riskLevel === "Critical" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      }`}>
                        {vendor.riskScore} / 100
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1 font-semibold ${
                        vendor.riskLevel === "Critical" ? "text-red-400" : "text-orange-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          vendor.riskLevel === "Critical" ? "bg-red-500 animate-pulse" : "bg-orange-500"
                        }`}></span>
                        {vendor.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-400 max-w-xs truncate">
                      {vendor.riskFactors[0]} {vendor.riskFactors.length > 1 && `+${vendor.riskFactors.length - 1} more`}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button className="px-2.5 py-1 bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 hover:text-white text-[11px] font-semibold text-slate-300 rounded transition-all">
                        Assess
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
