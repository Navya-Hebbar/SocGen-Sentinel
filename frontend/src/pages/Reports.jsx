import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Download, 
  Settings, 
  Printer, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  CheckCircle,
  FileCheck
} from "lucide-react";

export default function Reports({ vendors }) {
  const [reportType, setReportType] = useState("exec");
  const [selectedVendors, setSelectedVendors] = useState(vendors.map(v => v.id));
  const [includeAI, setIncludeAI] = useState(true);
  const [includeCerts, setIncludeCerts] = useState(true);
  
  // Loading state
  const [compiling, setCompiling] = useState(false);
  const [compiled, setCompiled] = useState(false);
  const [progressText, setProgressText] = useState("");

  const handleSelectAll = () => {
    if (selectedVendors.length === vendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(vendors.map(v => v.id));
    }
  };

  const handleToggleVendor = (id) => {
    setSelectedVendors(prev => 
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const handleCompileReport = () => {
    setCompiling(true);
    setCompiled(false);
    setProgressText("Fetching audit databases...");
    
    setTimeout(() => {
      setProgressText("Calculating vendor threat regressions...");
    }, 1200);

    setTimeout(() => {
      setProgressText("Formatting report visualizations...");
    }, 2400);

    setTimeout(() => {
      setCompiling(false);
      setCompiled(true);
    }, 3600);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-white">Threat Intelligence Reports</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-light">Export custom executive briefings, regulatory matrices, and vendor rosters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Panel */}
        <div className="glass-panel rounded-xl p-5 space-y-4 lg:col-span-1">
          <div>
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-500" /> Report Parameters
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Configure target dataset fields</p>
          </div>

          {/* Type of Report */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Report Type</label>
            <div className="space-y-1.5">
              {[
                { id: "exec", label: "Executive Risk Briefing", desc: "High-level visual summary for executive board reviews." },
                { id: "audit", label: "Regulatory Compliance Ledger", desc: "Detailed breakdown of SOC2, ISO27001, and GDPR controls." },
                { id: "subproc", label: "Downstream Subprocessor Maps", desc: "Complete map of shared vendor data access tunnels." }
              ].map(t => (
                <div 
                  key={t.id}
                  onClick={() => setReportType(t.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-colors ${
                    reportType === t.id 
                      ? "bg-blue-600/10 border-blue-500/40 text-slate-200" 
                      : "bg-slate-900/30 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <p className="font-semibold text-white">{t.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed font-light">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Extra Fields Toggle */}
          <div className="space-y-2.5 pt-2 border-t border-slate-900">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Meta Fields</label>
            <div className="space-y-2 text-xs text-slate-300">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAI}
                  onChange={(e) => setIncludeAI(e.target.checked)}
                  className="rounded border-slate-800 text-blue-600 bg-slate-950"
                />
                <span>Include AI remediation forecasts</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCerts}
                  onChange={(e) => setIncludeCerts(e.target.checked)}
                  className="rounded border-slate-800 text-blue-600 bg-slate-950"
                />
                <span>Include certificate expiry timelines</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleCompileReport}
            disabled={selectedVendors.length === 0 || compiling}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md ${
              selectedVendors.length === 0 || compiling
                ? "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/10 cursor-pointer"
            }`}
          >
            {compiling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Compile Custom Report
          </button>
        </div>

        {/* Vendors Selection Panel (Multiple select checklist) & output */}
        <div className="glass-panel rounded-xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[380px] relative">
          
          {/* Compilation overlay */}
          <AnimatePresence>
            {compiling && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl p-6"
              >
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-sm font-semibold text-white font-display uppercase tracking-widest">{progressText}</p>
                <div className="w-48 bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-1 rounded-full w-1/3 animate-[pulse_1.5s_infinite]"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compiled Output View */}
          {compiled ? (
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-5 h-full flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <CheckCircle className="w-5 h-5" /> Compile Completed Successfully
                </div>
                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                  <p className="font-semibold text-white font-display">
                    {reportType === "exec" ? "Executive Risk Briefing" : reportType === "audit" ? "Regulatory Compliance Ledger" : "Downstream Subprocessor Maps"}
                  </p>
                  <p className="text-slate-400 font-light leading-relaxed">
                    Custom compiled ledger containing threat profiles of <span className="font-semibold text-white">{selectedVendors.length} vendors</span>. Checked and verified against internal regulatory guidelines.
                  </p>
                  <div className="flex gap-4 pt-1 text-[10px] text-slate-500 font-mono">
                    <span>Size: 3.24 MB</span>
                    <span>Pages: 14</span>
                    <span>Integrity Code: SHA-256 Verified</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setCompiled(false)}
                  className="py-2.5 rounded-lg border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 transition-colors"
                >
                  Configure New Report
                </button>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Simulated PDF report download initiated.");
                  }}
                  className="py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download PDF Report
                </a>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Selector List */}
              <div className="space-y-4 flex-grow">
                <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                  <h4 className="font-display font-semibold text-sm text-white">Target Ecosystem Scope</h4>
                  <button 
                    onClick={handleSelectAll} 
                    className="text-[10px] font-semibold text-blue-400 hover:text-blue-300"
                  >
                    {selectedVendors.length === vendors.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {vendors.map(v => {
                    const isChecked = selectedVendors.includes(v.id);
                    return (
                      <div 
                        key={v.id}
                        onClick={() => handleToggleVendor(v.id)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors text-xs ${
                          isChecked 
                            ? "bg-slate-900/60 border-blue-500/30 text-white" 
                            : "bg-slate-900/20 border-slate-900 text-slate-500 hover:border-slate-800"
                        }`}
                      >
                        <span className="font-medium truncate pr-2">{v.name}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                          className="rounded border-slate-800 text-blue-600 bg-slate-950 flex-shrink-0"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-slate-900 pt-3 flex items-center justify-between leading-relaxed">
                <span>Select at least 1 vendor to compile data.</span>
                <span>Audit standard: SOC2, ISO27001, GDPR</span>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
