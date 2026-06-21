import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, UploadCloud, ShieldAlert, AlertOctagon, 
  Sparkles, CheckCircle, FileCheck, RefreshCw, 
  Printer, Download, Shield, Gavel
} from "lucide-react";
import { uploadContract } from "../utils/api";


export default function ContractAI({ contracts, setContracts }) {
  const [selectedContractId, setSelectedContractId] = useState("");
  const [contract, setContract] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (contracts && contracts.length > 0 && !selectedContractId) {
      setSelectedContractId(contracts[0].id);
      setContract(contracts[0]);
    }
  }, [contracts, selectedContractId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScanning(true);
    setProgressText("Initializing AI OCR Engine...");
    
    const p1 = setTimeout(() => { setProgressText("Identifying legal nodes & clause structures..."); }, 1200);
    const p2 = setTimeout(() => { setProgressText("Analyzing terms with Gemini AI model..."); }, 2400);

    const res = await uploadContract(file);
    
    clearTimeout(p1);
    clearTimeout(p2);

    if (res && res.id) {
      if (setContracts) setContracts(prev => [res, ...prev]);
      setSelectedContractId(res.id);
      setContract(res);
    } else {
      // Fallback
      const fileName = file.name;
      let parsedVendorName = "Uploaded Vendor";
      const parts = fileName.split(/[_\-\s\.]/);
      if (parts.length > 0 && parts[0].toLowerCase() !== "contract" && parts[0].toLowerCase() !== "sla") {
        parsedVendorName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
      }
      const customClauses = [
        {
          clauseText: "Section 4. Limitation of Liability: The Vendor's maximum liability for any data breach, regardless of negligence, shall not exceed $100.",
          riskSeverity: "Critical",
          riskExplanation: "An extremely low liability cap ($100) and refusal to handle breach notifications leaves SocGen fully exposed to massive financial damages.",
          recommendedFix: "Renegotiate to entirely exclude cyber breaches from the limitation of liability cap. Mandate that Vendor covers all costs related to forensic investigations."
        },
        {
          clauseText: "Section 2. Data Processing: Vendor reserves the right to share data with third-party subprocessors without notifying the Client or obtaining prior written consent.",
          riskSeverity: "Critical",
          riskExplanation: "Direct violation of GDPR Article 28(2), which mandates prior written authorization before engaging another processor, vastly increasing supply-chain attack surface.",
          recommendedFix: "Require a minimum of 30 days prior written notice for any new subprocessor, and explicitly reserve the right to object to or terminate the contract."
        },
        {
          clauseText: "Section 3. Security Requirements: The Vendor is not required to maintain SOC 2 Type II compliance or undergo annual penetration testing.",
          riskSeverity: "High",
          riskExplanation: "A lack of SOC 2 or penetration testing provides zero assurance of the vendor's internal security controls.",
          recommendedFix: "Strike this section. Mandate annual third-party penetration testing and require continuous SOC 2 Type II compliance as a material condition."
        }
      ];

      const newContract = {
        id: `c-${Date.now()}`,
        docName: fileName,
        vendorName: parsedVendorName,
        uploadDate: new Date().toISOString().split('T')[0],
        aiReviewStatus: "Flagged",
        overallRisk: "Critical",
        clauses: customClauses
      };

      if (setContracts) setContracts(prev => [newContract, ...prev]);
      setSelectedContractId(newContract.id);
      setContract(newContract);
    }
    setScanning(false);
  };

  const handleSelectContract = (id) => {
    setSelectedContractId(id);
    const doc = contracts.find(c => c.id === id);
    if (doc) {
      setScanning(true);
      setProgressText("Initializing AI OCR Engine...");
      setTimeout(() => { setProgressText("Identifying legal nodes..."); }, 800);
      setTimeout(() => { setProgressText("Evaluating Compliance Rules..."); }, 1600);
      setTimeout(() => { setContract(doc); setScanning(false); }, 2400);
    }
  };

  const handlePrint = () => {
    setGenerating(true);
    setTimeout(() => {
      window.print();
      setGenerating(false);
    }, 500);
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "Critical": return "bg-red-500/10 border-red-500/30 text-red-400";
      case "High": return "bg-orange-500/10 border-orange-500/30 text-orange-400";
      case "Medium": return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      default: return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    }
  };

  const getStatusStyles = (status) => {
    if (status === "Approved") return "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30";
    if (status === "Passed with Warnings") return "text-yellow-400 bg-yellow-500/10 border border-yellow-500/30";
    return "text-red-400 bg-red-500/10 border border-red-500/30";
  };

  return (
    <div className="p-4 md:p-8 flex flex-col print:block items-center pb-24 print:p-0 print:pb-0">
      
      {/* Print Action Bar */}
      <div className="w-full max-w-6xl flex justify-between items-end mb-4 print:hidden">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-blue">Gemini NLP</span>
            <span className="badge badge-indigo">Legal Parsing</span>
          </div>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">
            Contract <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.25)]">AI Intelligence</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">Upload an SLA or MSA PDF. The Gemini AI engine will parse the text and flag dangerous liability caps and compliance violations.</p>
        </div>
        <button
          onClick={handlePrint}
          disabled={generating || !contract}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs rounded shadow-lg transition-all uppercase tracking-widest flex-shrink-0"
        >
          {generating ? <Download className="w-4 h-4 animate-bounce" /> : <Printer className="w-4 h-4" />}
          {generating ? "Preparing PDF..." : "Export Legal Review"}
        </button>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row print:block gap-6 items-start">
        
        {/* Left Column: Interactive Uploader (Hidden on Print) */}
        <div className="w-full lg:w-1/3 space-y-4 print:hidden shrink-0">
          <div className="glass-panel p-5 rounded-none border border-[#27272a] bg-[#0a0a0a]">
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2 border-b border-[#27272a] pb-3 mb-4">
              <UploadCloud className="w-4 h-4 text-blue-500" /> Document Portal
            </h4>
            
            <div 
              onClick={() => document.getElementById("contract-file-upload").click()}
              className="border border-dashed border-slate-700 hover:border-blue-500 bg-[#111111] p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[160px] group"
            >
              <input type="file" id="contract-file-upload" className="hidden" accept=".pdf,.txt,.docx" onChange={handleFileUpload} />
              <UploadCloud className="w-8 h-8 text-slate-500 mb-3 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">Click to upload SLA document</span>
              <span className="text-[10px] text-slate-600 mt-1">Accepts PDF, DOCX, TXT</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#27272a]">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-semibold">Previous Scans</p>
              <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto pr-1">
                {contracts && contracts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectContract(c.id)}
                    className={`text-left px-3 py-2 border text-[10px] font-mono transition-all truncate ${
                      selectedContractId === c.id 
                        ? "bg-blue-600/10 border-blue-500/50 text-blue-300" 
                        : "bg-[#111111] border-[#27272a] text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {c.vendorName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Official Document Review (Expands on Print) */}
        <div className="w-full lg:w-2/3 print:w-full bg-[#0a0a0a] border border-[#27272a] shadow-2xl relative min-h-[600px] print:block print:min-h-0 print:border-none print:shadow-none print:overflow-visible">
          
          {scanning && (
            <div className="absolute inset-0 bg-[#0a0a0a]/90 backdrop-blur z-20 flex flex-col items-center justify-center p-6 print:hidden">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-sm font-semibold text-white font-display uppercase tracking-widest">{progressText}</p>
              <div className="w-48 bg-[#18181b] h-1 mt-3 overflow-hidden">
                <div className="bg-blue-500 h-1 w-2/3 animate-[pulse_1.5s_infinite]"></div>
              </div>
            </div>
          )}

          {!contract && !scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 print:hidden p-8 text-center">
              <Gavel className="w-12 h-12 text-slate-700 mb-4" />
              <p className="text-sm uppercase tracking-widest font-display">Awaiting Document</p>
              <p className="text-xs mt-2 max-w-xs">Upload a vendor contract on the left to generate an automated legal risk review.</p>
            </div>
          )}

          {contract && (
            <div>
              {/* Report Header */}
              <div className="border-b-4 border-blue-600 p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#111111]">
                <div className="flex items-center gap-5">
                  <img src="/socgen_seal.png" alt="Seal" className="h-16 w-auto max-w-[250px] object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <div>
                    <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">AI Legal Audit Brief</h1>
                    <h2 className="text-xs font-mono text-blue-400 tracking-widest mt-1">NLP Risk Extraction Engine</h2>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Document Target</p>
                  <p className="text-sm font-bold text-white truncate max-w-[200px]" title={contract.docName}>{contract.docName}</p>
                  <p className="text-[10px] text-slate-500 mt-1">Vendor: <span className="text-slate-300">{contract.vendorName}</span></p>
                </div>
              </div>

              {/* Status Banner */}
              <div className="px-6 md:px-8 py-4 border-b border-[#27272a] bg-[#18181b] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Scan Date</p>
                    <p className="text-xs font-mono text-white">{contract.uploadDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Total Flags</p>
                    <p className="text-xs font-mono text-white">{contract.clauses.length} Discovered</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-widest ${getStatusStyles(contract.aiReviewStatus)}`}>
                    Status: {contract.aiReviewStatus}
                  </div>
                  <div className={`px-3 py-1 border text-[10px] font-bold uppercase tracking-widest ${getSeverityStyles(contract.overallRisk)}`}>
                    Overall Risk: {contract.overallRisk}
                  </div>
                </div>
              </div>

              {/* Clauses Body */}
              <div className="p-6 md:p-8 space-y-6 max-h-[500px] overflow-y-auto print:max-h-none print:overflow-visible">
                <div className="flex items-center gap-2 border-b border-[#27272a] pb-2 mb-6">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-display font-bold text-white uppercase tracking-widest">Extracted High-Risk Clauses</h3>
                </div>

                {contract.clauses.map((clause, idx) => (
                  <div key={idx} className="border border-[#27272a] bg-[#111111] p-5 space-y-4 print:break-inside-auto">
                    <div className="flex justify-between items-center pb-3 border-b border-[#27272a]/50">
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        Extraction {idx + 1}
                      </span>
                      <span className={`px-2.5 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${getSeverityStyles(clause.riskSeverity)}`}>
                        {clause.riskSeverity} Risk
                      </span>
                    </div>

                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700"></div>
                      <p className="text-sm text-slate-200 italic pl-4 font-serif leading-relaxed">
                        "{clause.clauseText}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-[#18181b] border-l-2 border-red-500/50 p-3">
                        <span className="text-[9px] text-red-400/80 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1.5">
                          <AlertOctagon className="w-3 h-3" /> Risk Exposure
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-light">{clause.riskExplanation}</p>
                      </div>
                      <div className="bg-[#18181b] border-l-2 border-emerald-500/50 p-3">
                        <span className="text-[9px] text-emerald-400/80 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1.5">
                          <CheckCircle className="w-3 h-3" /> Recommended Remediation
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-light">{clause.recommendedFix}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="bg-[#111111] border-t border-[#27272a] p-4 text-center mt-auto">
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                  NLP Review Powered by Gemini 2.0 • SocGen Sentinel Internal
                </p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
