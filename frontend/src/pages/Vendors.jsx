import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  X, 
  Shield, 
  Mail, 
  AlertTriangle,
  CheckCircle,
  FileCheck,
  ShieldCheck,
  AlertOctagon,
  Trash2,
  Activity,
  Calendar,
  DollarSign
} from "lucide-react";

// Import API Helpers
import { createVendor, deleteVendor } from "../utils/api";


export default function Vendors({ 
  vendors, 
  setVendors, 
  selectedVendor, 
  setSelectedVendor,
  heatmapFilter,
  setHeatmapFilter
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new vendor
  const [newVendor, setNewVendor] = useState({
    name: "",
    industry: "",
    description: "",
    riskScore: 50,
    SOC2: "Compliant",
    GDPR: "Compliant",
    ISO27001: "Compliant",
    subprocessors: 3,
    dataAssetsShared: "",
    contactName: "",
    contactEmail: ""
  });

  // Handle adding vendor
  const handleAddVendorSubmit = async (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.industry) return;

    // Call backend API
    const res = await createVendor({
      name: newVendor.name,
      industry: newVendor.industry,
      description: newVendor.description || "Vendor assessment review in progress.",
      riskScore: parseInt(newVendor.riskScore),
      SOC2: newVendor.SOC2,
      GDPR: newVendor.GDPR,
      ISO27001: newVendor.ISO27001,
      subprocessors: parseInt(newVendor.subprocessors) || 0,
      dataAssetsShared: newVendor.dataAssetsShared || "Standard Public Marketing Assets",
      contactName: newVendor.contactName || "Security Operations",
      contactEmail: newVendor.contactEmail || `sec-ops@${newVendor.name.toLowerCase().replace(/\s+/g, "")}.com`
    });

    if (res && res.id) {
      setVendors([res, ...vendors]);
    } else {
      // Local fallback if backend is offline
      const score = parseInt(newVendor.riskScore);
      let level = "Low";
      if (score > 80) level = "Critical";
      else if (score > 60) level = "High";
      else if (score > 40) level = "Medium";

      const factors = [];
      if (newVendor.SOC2 !== "Compliant") factors.push("Expiring SOC2 certification");
      if (newVendor.GDPR !== "Compliant") factors.push("Missing GDPR agreement");
      if (score > 70) factors.push("Recent breach vector suspected");
      if (score > 50) factors.push("High sensitivity customer PII data access");
      if (factors.length === 0) factors.push("Pending routine security check");

      const vendorObj = {
        id: `v-${vendors.length + 1}`,
        name: newVendor.name,
        industry: newVendor.industry,
        description: newVendor.description || "Vendor assessment review in progress.",
        riskScore: score,
        riskLevel: level,
        complianceStatus: {
          SOC2: newVendor.SOC2,
          GDPR: newVendor.GDPR,
          ISO27001: newVendor.ISO27001
        },
        activeBreaches: score > 80 ? 1 : 0,
        riskFactors: factors,
        certifications: [
          { name: "SOC 2 Type II", status: newVendor.SOC2, expiryDate: "2027-06-30" },
          { name: "ISO 27001", status: newVendor.ISO27001, expiryDate: "2027-08-30" }
        ],
        contacts: {
          name: newVendor.contactName || "Security Operations",
          email: newVendor.contactEmail || `sec-ops@${newVendor.name.toLowerCase().replace(/\s+/g, "")}.com`
        },
        subprocessors: parseInt(newVendor.subprocessors) || 0,
        dataAssetsShared: newVendor.dataAssetsShared || "Standard Public Marketing Assets"
      };
      setVendors([vendorObj, ...vendors]);
    }

    setShowAddModal(false);
    
    // Reset form
    setNewVendor({
      name: "",
      industry: "",
      description: "",
      riskScore: 50,
      SOC2: "Compliant",
      GDPR: "Compliant",
      ISO27001: "Compliant",
      subprocessors: 3,
      dataAssetsShared: "",
      contactName: "",
      contactEmail: ""
    });
  };

  // Delete vendor
  const handleDeleteVendor = async (id, e) => {
    e.stopPropagation();
    
    // Call backend API
    const res = await deleteVendor(id);
    // Remove locally anyway (optimistic delete)
    setVendors(vendors.filter(v => v.id !== id));
    
    if (selectedVendor && selectedVendor.id === id) {
      setSelectedVendor(null);
    }
  };

  // Filter lists
  const filteredVendors = vendors.filter(v => {
    if (heatmapFilter && heatmapFilter.length > 0) {
      if (!heatmapFilter.includes(v.name)) return false;
    }
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === "All" || v.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (level) => {
    switch (level) {
      case "Critical": return "text-red-400";
      case "High": return "text-orange-400";
      case "Medium": return "text-yellow-400";
      default: return "text-emerald-400";
    }
  };

  const getRiskBadgeStyles = (level) => {
    switch (level) {
      case "Critical": return "bg-red-500/10 border-red-500/20 text-red-400";
      case "High": return "bg-orange-500/10 border-orange-500/20 text-orange-400";
      case "Medium": return "bg-yellow-500/10 border-yellow-500/20 text-yellow-400";
      default: return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
    }
  };

  // AI recommendations generator (precise output model)
  const getAiRecommendation = (vendor) => {
    const recs = [];
    if (vendor.complianceStatus?.SOC2 !== "Compliant") {
      recs.push("Request updated SOC 2 Type II audit report for validation.");
    }
    if (vendor.complianceStatus?.ISO27001 !== "Compliant") {
      recs.push("Enforce AES-256 database/backup encryption to align with ISO 27001 standard.");
    }
    if (vendor.complianceStatus?.GDPR !== "Compliant") {
      recs.push("Draft and execute standard GDPR Data Processing Agreement (DPA).");
    }
    
    if (vendor.riskFactors && vendor.riskFactors.length > 0) {
      vendor.riskFactors.forEach(factor => {
        const text = factor.toLowerCase();
        if (text.includes("credential") || text.includes("leak") || text.includes("bypass")) {
          recs.push("Perform credential sweep, revoke old API keys, and enforce strict MFA.");
        } else if (text.includes("vulnerability") || text.includes("zero-day") || text.includes("patch")) {
          recs.push("Accelerate client patching schedule and run network pen tests.");
        } else if (text.includes("subprocessor") || text.includes("downstream")) {
          recs.push("Audit and restrict downstream subprocessor data access routes.");
        }
      });
    }
    
    if (recs.length === 0) {
      if (vendor.riskLevel === "Critical" || vendor.riskLevel === "High") {
        return "Schedule an immediate compliance review, limit database access permissions, and run vulnerability scans.";
      }
      return "Maintain routine automated certificate scans and bi-annual security policy checks.";
    }
    
    return recs.slice(0, 2).join(" Furthermore, ");
  };

  return (
    <div className="p-6 relative min-h-screen">
      {/* Top filter state for heatmap */}
      {heatmapFilter && heatmapFilter.length > 0 && (
        <div className="mb-4 bg-blue-950/20 border border-blue-900/30 rounded-xl p-3 flex justify-between items-center text-xs">
          <span className="text-blue-300 font-semibold font-display">
            Active Filter: Mapped coordinates from Risk Matrix ({heatmapFilter.length} vendors)
          </span>
          <button 
            onClick={() => setHeatmapFilter(null)}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 px-2 py-0.5 rounded transition-all"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge badge-blue">Registry</span>
            <span className="badge badge-cyan">Real-time Profiles</span>
          </div>
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">
            Centralized <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.25)]">Vendor Registry</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">Inventory repository containing profiles, risk evaluations, and alignment check logs</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all font-sans"
        >
          <Plus className="w-3.5 h-3.5" /> Register Vendor
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search vendor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
        </div>

        <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
          {["All", "Low", "Medium", "High", "Critical"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1 rounded-md text-[10px] font-semibold border transition-all ${
                riskFilter === lvl
                  ? "bg-blue-600/15 border-blue-500/40 text-white"
                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              {lvl} Risk
            </button>
          ))}
        </div>
      </div>

      {/* Grid of vendors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredVendors.length === 0 ? (
            <div className="col-span-full py-16 text-center glass-panel rounded-2xl flex flex-col items-center justify-center p-8 space-y-4">
              <Shield className="w-10 h-10 text-slate-500 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-white">No Vendors Registered</p>
                <p className="text-xs text-slate-500 mt-1 font-light max-w-sm mx-auto leading-relaxed">
                  Enter new third-party entities using the registration portal or clear active matrix coordinates filters.
                </p>
              </div>
            </div>
          ) : (
            filteredVendors.map((vendor) => {
              // Scale score out of 10 as requested
              const scoreOutOfTen = (vendor.riskScore / 10).toFixed(1);
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor)}
                  className={`glass-panel glow-card-hover rounded-xl p-5 cursor-pointer relative overflow-hidden flex flex-col justify-between h-44 ${selectedVendor?.id === vendor.id ? "glass-panel-active" : ""}`}
                >
                  <div className="radial-glow absolute inset-0"></div>
                  
                  <div className="flex justify-between items-start z-10">
                    <div>
                      <h3 className="font-display font-bold text-white text-base leading-tight hover:text-blue-400 transition-colors">
                        {vendor.name}
                      </h3>
                      <span className="text-[9px] text-slate-500 font-medium">{vendor.industry}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${getRiskBadgeStyles(vendor.riskLevel)}`}>
                      {scoreOutOfTen} / 10
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 my-2.5 z-10 font-light leading-relaxed">
                    {vendor.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-800/40 pt-2.5 z-10">
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                      <Shield className="w-3.5 h-3.5 text-blue-500" />
                      <span>SOC2: {vendor.complianceStatus.SOC2 === "Compliant" ? "✅" : "❌"}</span>
                      <span className="mx-1">•</span>
                      <span>GDPR: {vendor.complianceStatus.GDPR === "Compliant" ? "✅" : "❌"}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteVendor(vendor.id, e)}
                      className="p-1 rounded text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Detail Slide-out Overlay (Precise AI Output formatting) */}
      <AnimatePresence>
        {selectedVendor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVendor(null)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-slate-950 border-l border-slate-900 shadow-2xl p-6 z-50 overflow-y-auto text-slate-300"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div>
                  <h3 className="font-display font-bold text-white text-base leading-tight">{selectedVendor.name}</h3>
                  <span className="text-[10px] text-slate-500">{selectedVendor.industry}</span>
                </div>
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Exact Expected Output Presentation */}
              <div className="mt-5 space-y-5">
                
                {/* Vendor Risk Profile Header Card */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Vendor Security Profile</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getRiskBadgeStyles(selectedVendor.riskLevel)}`}>
                      {selectedVendor.riskLevel} Level
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-[11px] text-slate-300">Risk Score:</span>
                    <span className="text-2xl font-extrabold font-display text-white">
                      {(selectedVendor.riskScore / 10).toFixed(1)} <span className="text-xs text-slate-500">/ 10</span>
                    </span>
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h4 className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2">Risk Factors</h4>
                  <ul className="space-y-1.5">
                    {selectedVendor.riskFactors.map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-light">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations (glowing visual block) */}
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
                  <h4 className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-500" /> Recommendation
                  </h4>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {getAiRecommendation(selectedVendor)}
                  </p>
                </div>

                {/* Technical Meta Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg">
                    <span className="text-slate-500 block mb-0.5">Subprocessors</span>
                    <span className="font-bold text-white text-sm">{selectedVendor.subprocessors} downstream</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg">
                    <span className="text-slate-500 block mb-0.5">Access Scope</span>
                    <span className="font-bold text-white text-sm truncate block">{selectedVendor.dataAssetsShared}</span>
                  </div>
                </div>

                {/* Contacts */}
                <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs space-y-1">
                  <span className="text-slate-500 uppercase tracking-widest font-semibold block mb-0.5">Contact Point</span>
                  <p className="text-slate-200 font-semibold">{selectedVendor.contacts.name}</p>
                  <p className="text-slate-400 select-all font-light">{selectedVendor.contacts.email}</p>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal: Add Vendor (simplified inputs) */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl z-10 relative flex flex-col justify-between text-slate-300"
            >
              <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-950/40">
                <h3 className="font-display font-bold text-white text-sm">Register Third-Party Vendor</h3>
                <button onClick={() => setShowAddModal(false)} className="cursor-pointer">
                  <X className="w-4 h-4 text-slate-400 hover:text-white" />
                </button>
              </div>

              <form onSubmit={handleAddVendorSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Vendor Name *</label>
                    <input
                      type="text"
                      required
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                      placeholder="e.g. CyberBackup Solutions"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Industry *</label>
                    <input
                      type="text"
                      required
                      value={newVendor.industry}
                      onChange={(e) => setNewVendor({...newVendor, industry: e.target.value})}
                      placeholder="e.g. Cloud Security"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newVendor.description}
                    onChange={(e) => setNewVendor({...newVendor, description: e.target.value})}
                    placeholder="Short summary of services provided..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">SOC 2</label>
                    <select
                      value={newVendor.SOC2}
                      onChange={(e) => setNewVendor({...newVendor, SOC2: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                    >
                      <option value="Compliant">Compliant</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">GDPR</label>
                    <select
                      value={newVendor.GDPR}
                      onChange={(e) => setNewVendor({...newVendor, GDPR: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                    >
                      <option value="Compliant">Compliant</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">ISO 27001</label>
                    <select
                      value={newVendor.ISO27001}
                      onChange={(e) => setNewVendor({...newVendor, ISO27001: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300"
                    >
                      <option value="Compliant">Compliant</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Subprocessors Count</label>
                    <input
                      type="number"
                      min={0}
                      value={newVendor.subprocessors}
                      onChange={(e) => setNewVendor({...newVendor, subprocessors: e.target.value})}
                      placeholder="e.g. 5"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Security Risk Score (0-100) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={newVendor.riskScore}
                      onChange={(e) => setNewVendor({...newVendor, riskScore: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Data Assets Shared</label>
                  <input
                    type="text"
                    value={newVendor.dataAssetsShared}
                    onChange={(e) => setNewVendor({...newVendor, dataAssetsShared: e.target.value})}
                    placeholder="e.g. Customer PII, Financial Transaction Data"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={newVendor.contactName}
                      onChange={(e) => setNewVendor({...newVendor, contactName: e.target.value})}
                      placeholder="e.g. Robert Smith"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={newVendor.contactEmail}
                      onChange={(e) => setNewVendor({...newVendor, contactEmail: e.target.value})}
                      placeholder="e.g. rsmith@vendor.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
