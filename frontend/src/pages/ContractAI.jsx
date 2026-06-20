import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  UploadCloud, 
  ShieldAlert, 
  ChevronRight, 
  AlertOctagon, 
  Sparkles,
  CheckCircle,
  FileCheck,
  RefreshCw,
  Info
} from "lucide-react";
import { mockContractAIContracts } from "../data/mockData";

export default function ContractAI() {
  const [selectedContractId, setSelectedContractId] = useState(mockContractAIContracts[0].id);
  const [contract, setContract] = useState(mockContractAIContracts[0]);
  
  // Loading states
  const [scanning, setScanning] = useState(false);
  const [progressText, setProgressText] = useState("");

  // Select sample contract
  const handleSelectContract = (id) => {
    setSelectedContractId(id);
    const doc = mockContractAIContracts.find(c => c.id === id);
    if (doc) {
      setScanning(true);
      setProgressText("Initializing AI OCR Engine...");
      
      setTimeout(() => {
        setProgressText("Identifying legal nodes & clause structures...");
      }, 1000);
      
      setTimeout(() => {
        setProgressText("Evaluating against SocGen Compliance Rules...");
      }, 2000);

      setTimeout(() => {
        setContract(doc);
        setScanning(false);
      }, 3000);
    }
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "Critical": return "bg-red-500/10 border-red-500/20 text-red-400";
      case "Moderate": return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      default: return "bg-blue-500/10 border-blue-500/20 text-blue-400";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved": return "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
      case "Passed with Warnings": return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
      default: return "text-red-400 bg-red-500/10 border border-red-500/20";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Contract AI Intelligence</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-light">NLP legal parser highlights high-risk vendor SLA liabilities automatically</p>
        </div>
        <div className="flex gap-2">
          {mockContractAIContracts.map(c => (
            <button
              key={c.id}
              onClick={() => handleSelectContract(c.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                selectedContractId === c.id 
                  ? "bg-blue-600/15 border-blue-500/40 text-white" 
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              {c.vendorName} Agreement
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Drag & Drop Uploader (Interactive Sandbox) */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
          <div>
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-500" /> SLA Document Portal
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Upload a PDF contract to trigger NLP audit check</p>
          </div>

          <div className="border border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors my-5 flex flex-col items-center justify-center flex-grow bg-slate-900/10">
            <UploadCloud className="w-8 h-8 text-slate-500 mb-3" />
            <span className="text-xs font-semibold text-slate-300">Drag & drop contract files here</span>
            <span className="text-[10px] text-slate-600 mt-1">Accepts PDF, DOCX, TXT (Max 25MB)</span>
          </div>

          <div className="bg-blue-950/20 border border-blue-900/30 p-3 rounded-lg flex items-start gap-2.5 text-xs text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed font-light">
              SocGen Sentinel AI reviews legal clauses against 22 key regulatory principles including GDPR Article 28 and internal bank liability ceilings.
            </p>
          </div>
        </div>

        {/* Right Clauses analysis */}
        <div className="glass-panel rounded-xl p-5 lg:col-span-2 flex flex-col justify-between min-h-[380px] relative">
          
          <AnimatePresence mode="wait">
            {scanning ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl p-6"
              >
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-sm font-semibold text-white font-display uppercase tracking-widest">{progressText}</p>
                <div className="w-48 bg-slate-900 h-1 rounded-full mt-3 overflow-hidden">
                  <div className="bg-blue-500 h-1 rounded-full w-2/3 animate-[pulse_1.5s_infinite]"></div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {contract ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-900">
                <div>
                  <h4 className="font-display font-bold text-white text-base leading-tight">
                    {contract.docName}
                  </h4>
                  <span className="text-[10px] text-slate-500">Uploaded on {contract.uploadDate}</span>
                </div>
                <div className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${getStatusStyles(contract.aiReviewStatus)}`}>
                  AI Status: {contract.aiReviewStatus}
                </div>
              </div>

              {/* Highlighted Clauses */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Flagged Risk Clauses ({contract.clauses.length})</span>
                {contract.clauses.map((clause, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500" /> Clause Highlight
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getSeverityStyles(clause.riskSeverity)}`}>
                        {clause.riskSeverity} Risk
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 font-mono leading-relaxed">
                      "{clause.clauseText}"
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="p-2.5 rounded-lg bg-red-950/5 border border-red-500/10 space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold block">Risk Rationale</span>
                        <p className="text-red-300 leading-relaxed font-light">{clause.riskExplanation}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/5 border border-emerald-500/10 space-y-1">
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold block">AI Remediation Advice</span>
                        <p className="text-emerald-300 leading-relaxed font-light">{clause.recommendedFix}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 text-xs">
              No contract analysis active. Select a vendor agreement or upload.
            </div>
          )}

          <div className="text-[10px] text-slate-600 text-center uppercase tracking-widest font-semibold mt-4">
            Security audits verified by NLP Legal Core.
          </div>
        </div>

      </div>
    </div>
  );
}
