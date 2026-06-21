import React, { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, CartesianGrid
} from "recharts";
import {
  FileText, Download, Printer, Shield, AlertTriangle,
  CheckCircle, XCircle, TrendingUp, CheckCircle2
} from "lucide-react";
import { fetchAuditReport, fetchPortfolioTextReport } from "../utils/api";

export default function AuditReport({ vendors }) {
  const [report, setReport] = useState(null);
  const [portfolioText, setPortfolioText] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchAuditReport();
      if (data) {
        setReport(data);
        const textData = await fetchPortfolioTextReport();
        if (textData?.report_text) setPortfolioText(textData.report_text);
      } else {
        // Generate fallback from vendor data
        const riskDist = { Critical: 0, High: 0, Medium: 0, Low: 0 };
        const typeDist = {};
        vendors.forEach(v => {
          riskDist[v.riskLevel] = (riskDist[v.riskLevel] || 0) + 1;
          typeDist[v.vendorType || v.industry] = (typeDist[v.vendorType || v.industry] || 0) + 1;
        });
        const soc2 = Math.round(vendors.filter(v => v.complianceStatus?.SOC2 === "Compliant").length / vendors.length * 100);
        const iso = Math.round(vendors.filter(v => v.complianceStatus?.ISO27001 === "Compliant").length / vendors.length * 100);
        const gdpr = Math.round(vendors.filter(v => v.complianceStatus?.GDPR === "Compliant").length / vendors.length * 100);
        setReport({
          report_date: new Date().toISOString().split("T")[0],
          report_id: "SG-SNTNL-AUDIT-" + Math.floor(Math.random() * 1000000),
          total_vendors: vendors.length,
          risk_distribution: riskDist,
          vendor_type_distribution: typeDist,
          high_risk_vendors: vendors.filter(v => v.riskLevel === "Critical" || v.riskLevel === "High")
            .sort((a, b) => b.riskScore - a.riskScore).slice(0, 10),
          compliance_summary: { soc2_pct: soc2, iso27001_pct: iso, gdpr_pct: gdpr, overall_pct: Math.round((soc2 + iso + gdpr) / 3) },
          breach_count: vendors.filter(v => v.breachStatus || v.activeBreaches > 0).length,
          success_metrics: {
            vendor_coverage_pct: 95,
            risk_accuracy_pct: 80,
            ground_truth_high_risk_count: 20,
            alert_timeliness: "Contract/cert alerts generated 30+ days early",
            operational_efficiency: "Vendor compliance answer available from registry in under 5 minutes",
            audit_readiness: "Portfolio report generated in under 15 minutes",
          },
        });
      }
      setLoading(false);
    };
    load();
  }, [vendors]);

  const handlePrint = () => {
    setGenerating(true);
    setTimeout(() => {
      window.print();
      setGenerating(false);
    }, 500);
  };

  if (loading || !report) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-sm text-slate-400 font-mono tracking-widest uppercase">Compiling Executive Report...</span>
      </div>
    );
  }

  const riskChartData = Object.entries(report.risk_distribution).map(([name, value]) => ({
    name, value,
    color: name === "Critical" ? "#ef4444" : name === "High" ? "#f97316" : name === "Medium" ? "#eab308" : "#10b981"
  }));

  const typeChartData = Object.entries(report.vendor_type_distribution || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-4 md:p-8 print:p-0 flex flex-col print:block items-center pb-24 print:pb-0">
      {/* Print Action Bar (Hidden on Print) */}
      <div className="w-full max-w-5xl flex justify-end mb-4 print:hidden">
        <button
          onClick={handlePrint}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded shadow-lg shadow-blue-500/20 transition-all uppercase tracking-widest"
        >
          {generating ? <Download className="w-4 h-4 animate-bounce" /> : <Printer className="w-4 h-4" />}
          {generating ? "Preparing PDF..." : "Export Official PDF"}
        </button>
      </div>

      {/* THE REPORT DOCUMENT */}
      <div className="w-full max-w-5xl bg-[#0a0a0a] border border-[#27272a] shadow-2xl relative">

        {/* --- REPORT HEADER --- */}
        <div className="border-b-4 border-blue-600 p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#111111]">
          <div className="flex items-center gap-6">
            <img src="/socgen_seal.png" alt="SocGen Sentinel Seal" className="h-16 md:h-20 w-auto max-w-[250px] object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div>
              <h1 className="text-3xl font-display font-black text-white uppercase tracking-tight">Executive Audit Report</h1>
              <h2 className="text-sm font-mono text-blue-400 tracking-widest mt-1">SocGen Sentinel • Vendor Ecosystem Security</h2>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-slate-400 uppercase tracking-widest">Report ID</p>
            <p className="text-sm font-mono text-white bg-[#18181b] px-3 py-1 border border-[#27272a] inline-block">{report.report_id || "SG-SNTNL-LIVE"}</p>
            <p className="text-xs text-slate-400 mt-2">Generated: <span className="text-white font-medium">{report.report_date}</span></p>
          </div>
        </div>

        {/* --- REPORT BODY --- */}
        <div className="p-8 space-y-10">
          
          {/* Section 1: Executive Overview Matrix */}
          <section>
            <div className="flex items-center gap-3 mb-4 border-b border-[#27272a] pb-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">1. Portfolio Overview</h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-0 border border-[#27272a] bg-[#111111] divide-x divide-y lg:divide-y-0 divide-[#27272a]">
              {[
                { label: "Total Monitored", value: report.total_vendors, icon: Shield, color: "text-blue-400" },
                { label: "Critical Risk", value: report.risk_distribution.Critical || 0, icon: AlertTriangle, color: "text-red-500" },
                { label: "High Risk", value: report.risk_distribution.High || 0, icon: TrendingUp, color: "text-orange-500" },
                { label: "Active Breaches", value: report.breach_count || 0, icon: XCircle, color: "text-red-500" },
                { label: "Avg Compliance", value: `${report.compliance_summary.overall_pct}%`, icon: CheckCircle, color: "text-emerald-500" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="p-5 text-center flex flex-col items-center justify-center">
                    <Icon className={`w-6 h-6 mb-3 ${stat.color}`} />
                    <p className="text-3xl font-black font-display text-white">{stat.value}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Visual Intelligence (2 Columns) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Risk Distribution */}
            <div className="border border-[#27272a] bg-[#111111] p-6">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-6 flex items-center justify-between">
                <span>Risk Stratification</span>
                <PieChart className="w-4 h-4 text-slate-500" />
              </h3>
              <div className="flex items-center gap-6">
                <div className="h-40 w-40 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={riskChartData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                        {riskChartData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 flex-1 border-l border-[#27272a] pl-6">
                  {riskChartData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 border border-[#27272a]" style={{ backgroundColor: d.color }}></span>
                        <span className="text-slate-300 font-mono uppercase tracking-wider">{d.name}</span>
                      </div>
                      <span className="font-bold text-white font-mono">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance Matrix */}
            <div className="border border-[#27272a] bg-[#111111] p-6">
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-6 flex items-center justify-between">
                <span>Regulatory Posture</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </h3>
              <div className="space-y-5">
                {[
                  { name: "SOC 2 Type II", pct: report.compliance_summary.soc2_pct },
                  { name: "ISO 27001", pct: report.compliance_summary.iso27001_pct },
                  { name: "GDPR", pct: report.compliance_summary.gdpr_pct },
                ].map((c, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-300 font-mono uppercase tracking-wider">{c.name}</span>
                      <span className={`font-bold font-mono ${c.pct >= 70 ? "text-emerald-400" : "text-orange-400"}`}>{c.pct}%</span>
                    </div>
                    <div className="w-full bg-[#18181b] border border-[#27272a] h-2">
                      <div className={`h-full transition-all duration-1000 ${c.pct >= 70 ? "bg-emerald-500" : "bg-orange-500"}`} style={{ width: `${c.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: NLP Assessment Text (if exists) */}
          {portfolioText && (
            <section className="print:block">
              <div className="flex items-center justify-between mb-4 border-b border-[#27272a] pb-2">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">2. AI Intelligence Briefing</h3>
                </div>
              </div>
              <div className="bg-[#111111] border border-[#27272a] p-6">
                <p className="text-xs text-blue-400 font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  Generated via SocGen Sentinel Threat Engine
                </p>
                <div className="text-xs leading-relaxed text-slate-300 font-sans whitespace-pre-wrap columns-1 md:columns-2 gap-8 text-justify">
                  {portfolioText}
                </div>
              </div>
            </section>
          )}

        </div>
        
        {/* REPORT FOOTER */}
        <div className="bg-[#111111] border-t border-[#27272a] p-6 text-center">
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
            CONFIDENTIAL • FOR INTERNAL USE ONLY • GENERATED AUTOMATICALLY BY SOCGEN SENTINEL
          </p>
        </div>
      </div>
    </div>
  );
}
