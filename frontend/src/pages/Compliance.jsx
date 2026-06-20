import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  Search, 
  FileSpreadsheet, 
  Send,
  Layers,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function Compliance({ vendors, setNotifications }) {
  const [selectedStandard, setSelectedStandard] = useState("SOC2");
  const [searchTerm, setSearchTerm] = useState("");

  const standardsRequirements = {
    SOC2: [
      { id: "req-s1", name: "CC6.1 - Logical Access Control", desc: "MFA, single sign-on, and endpoint protection must be active for all staff." },
      { id: "req-s2", name: "CC6.3 - Perimeter Defenses", desc: "Vulnerability scanners, firewall rules, and intrusion alarms must be reviewed monthly." },
      { id: "req-s3", name: "CC7.1 - Vulnerability Management", desc: "Penetration tests must be conducted annually and critical findings patched within 30 days." }
    ],
    ISO27001: [
      { id: "req-i1", name: "A.9.2 - User Access Mgmt", desc: "Formal authorization process and periodic reviews for privileged developer roles." },
      { id: "req-i2", name: "A.12.6 - Tech Vulnerabilities", desc: "System patches must be cataloged and deployed systematically based on severity levels." },
      { id: "req-i3", name: "A.10.1 - Cryptographic Controls", desc: "Backup files and sensitive transaction tables must be encrypted at rest and in transit." }
    ],
    GDPR: [
      { id: "req-g1", name: "Article 32 - Security of Processing", desc: "Pseudo-anonymization and systematic log auditing must be enforced on user database assets." },
      { id: "req-g2", name: "Article 28 - Subprocessor Agreements", desc: "Formal vendor contracts must declare all downstream subprocessors sharing customer records." },
      { id: "req-g3", name: "Article 33 - Breach Notification", desc: "Formal policies must guarantee client notification of security incidents within 72 hours." }
    ]
  };

  const getComplianceStatus = (vendor, standard) => {
    return vendor.complianceStatus[standard] || "Non-Compliant";
  };

  const filteredVendors = vendors.filter(v => {
    return v.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSendReminder = (vendorName, reqName) => {
    const alertId = `com-${Date.now()}`;
    const newAlert = {
      id: alertId,
      vendorName: vendorName,
      type: "info",
      content: `Compliance ticket dispatched: Requested audit logs for ${reqName}.`,
      timestamp: "Just now"
    };

    setNotifications(prev => [newAlert, ...prev]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Compliance & Governance</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-light">Track compliance alignments across SOC2, GDPR, and ISO27001 audit standards</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 rounded-lg transition-colors font-sans select-none">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Compliance Matrix
        </button>
      </div>

      {/* Grid: Stats Overview */}
      <div className="grid grid-cols-3 gap-5">
        {Object.keys(standardsRequirements).map((standard) => {
          const compliantCount = vendors.filter(v => getComplianceStatus(v, standard) === "Compliant").length;
          const compliantPercent = Math.round((compliantCount / vendors.length) * 100) || 0;
          
          return (
            <button
              key={standard}
              onClick={() => setSelectedStandard(standard)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedStandard === standard 
                  ? "bg-blue-600/10 border-blue-500/40 text-slate-200" 
                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold">{standard} Standard</span>
                <span className="font-mono text-lg font-bold text-white">{compliantPercent}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 mb-2">
                <div 
                  className={`h-1.5 rounded-full ${compliantPercent > 75 ? "bg-emerald-400" : "bg-yellow-400"}`} 
                  style={{ width: `${compliantPercent}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500">{compliantCount} of {vendors.length} vendors compliant</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Requirement Checklist */}
        <div className="glass-panel rounded-xl p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-900">
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" /> Audit Control Framework Requirements ({selectedStandard})
            </h4>
          </div>

          <div className="space-y-4">
            {standardsRequirements[selectedStandard].map((req) => {
              const failingVendors = vendors.filter(v => getComplianceStatus(v, selectedStandard) !== "Compliant");
              
              return (
                <div key={req.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-xs text-white">{req.name}</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-light leading-relaxed">{req.desc}</p>
                    </div>
                  </div>

                  {failingVendors.length > 0 && (
                    <div className="pt-2 border-t border-slate-900/50">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-2">Non-Compliant Vendors ({failingVendors.length})</span>
                      <div className="flex flex-wrap gap-2">
                        {failingVendors.map(fv => (
                          <div key={fv.id} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/10 text-[10px] text-red-300">
                            <span>{fv.name}</span>
                            <button 
                              onClick={() => handleSendReminder(fv.name, req.name)}
                              className="text-[9px] text-red-400 hover:text-white transition-colors flex items-center gap-0.5"
                              title="Send audit reminder ticket"
                            >
                              <Send className="w-2.5 h-2.5 ml-1" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Vendors Status Grid side */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-full space-y-4">
          <div>
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-500" /> Vendor Alignments Matrix
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Alignment checklist by search term</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-lg py-1.5 pl-8 pr-4 text-xs text-slate-300 placeholder-slate-500 focus:outline-none"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[320px] pr-1 flex-grow">
            {filteredVendors.map((vendor) => {
              const status = getComplianceStatus(vendor, selectedStandard);
              return (
                <div key={vendor.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/20 border border-slate-800/40 text-xs">
                  <div>
                    <p className="font-semibold text-slate-200">{vendor.name}</p>
                    <p className="text-[9px] text-slate-500 mt-0.5">{vendor.industry}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {status === "Compliant" ? (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Compliant
                      </span>
                    ) : status === "Partial" ? (
                      <span className="flex items-center gap-1 text-[10px] text-yellow-400 font-semibold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                        <AlertTriangle className="w-3 h-3" /> Partial
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        <XCircle className="w-3 h-3" /> Failed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
