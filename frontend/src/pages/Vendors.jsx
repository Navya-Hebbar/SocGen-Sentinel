import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  X, 
  Shield, 
  Mail, 
  FileText, 
  Activity, 
  CheckCircle2, 
  AlertOctagon, 
  Database,
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function Vendors({ 
  vendors, 
  setVendors, 
  selectedVendor, 
  setSelectedVendor,
  heatmapFilter,
  setHeatmapFilter
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All");
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
    contactName: "",
    contactEmail: "",
    riskFactors: ""
  });

  // Calculate distinct industries
  const industries = ["All", ...new Set(vendors.map(v => v.industry))];

  // Handle adding vendor
  const handleAddVendorSubmit = (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.industry) return;

    const score = parseInt(newVendor.riskScore);
    let level = "Low";
    if (score > 80) level = "Critical";
    else if (score > 60) level = "High";
    else if (score > 40) level = "Medium";

    const vendorObj = {
      id: `v-${vendors.length + 1}`,
      name: newVendor.name,
      industry: newVendor.industry,
      description: newVendor.description || "No description provided.",
      riskScore: score,
      riskLevel: level,
      complianceStatus: {
        SOC2: newVendor.SOC2,
        GDPR: newVendor.GDPR,
        ISO27001: newVendor.ISO27001
      },
      activeBreaches: score > 80 ? 1 : 0,
      riskFactors: newVendor.riskFactors 
        ? newVendor.riskFactors.split(",").map(f => f.trim()) 
        : ["Pending compliance verification review"],
      certifications: [
        { name: "SOC 2 Type II", status: newVendor.SOC2, expiryDate: "2027-06-30" },
        { name: "ISO 27001", status: newVendor.ISO27001, expiryDate: "2027-08-30" }
      ],
      contacts: {
        name: newVendor.contactName || "Unassigned",
        email: newVendor.contactEmail || "nocontact@sentinel.com"
      },
      subprocessors: Math.floor(Math.random() * 20) + 1,
      dataAssetsShared: "Proprietary database structures, Customer PII"
    };

    setVendors([vendorObj, ...vendors]);
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
      contactName: "",
      contactEmail: "",
      riskFactors: ""
    });
  };

  // Delete vendor
  const handleDeleteVendor = (id, e) => {
    e.stopPropagation();
    setVendors(vendors.filter(v => v.id !== id));
    if (selectedVendor && selectedVendor.id === id) {
      setSelectedVendor(null);
    }
  };

  // Filter lists
  const filteredVendors = vendors.filter(v => {
    // If filtered by risk heatmap grid
    if (heatmapFilter && heatmapFilter.length > 0) {
      if (!heatmapFilter.includes(v.name)) return false;
    }

    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.riskFactors.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesIndustry = industryFilter === "All" || v.industry === industryFilter;
    const matchesRisk = riskFilter === "All" || v.riskLevel === riskFilter;

    return matchesSearch && matchesIndustry && matchesRisk;
  });

  const getRiskBadgeStyles = (level) => {
    switch (level) {
      case "Critical": return "bg-red-500/10 text-red-400 border border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
      default: return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case "Compliant": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "Partial": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <AlertOctagon className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="p-6 relative min-h-screen">
      {/* Top Banner Filter Alert */}
      {heatmapFilter && heatmapFilter.length > 0 && (
        <div className="mb-4 bg-blue-950/20 border border-blue-900/30 rounded-xl p-3 flex justify-between items-center">
          <span className="text-xs text-blue-300 font-semibold font-display">
            Active Filter: Showing {heatmapFilter.length} vendors from Heatmap selection.
          </span>
          <button 
            onClick={() => setHeatmapFilter(null)}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 px-2 py-0.5 rounded transition-all"
          >
            Clear Matrix Filter
          </button>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Vendor Ecosystem</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage risk scores, compliance documentations, and threat vectors</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg hover:shadow-blue-500/10 transition-all font-sans"
        >
          <Plus className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Search vendor directory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
        </div>

        <div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
          >
            {industries.map((ind, i) => (
              <option key={i} value={ind} className="bg-slate-950 text-slate-300">{ind === "All" ? "All Industries" : ind}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
          >
            <option value="All" className="bg-slate-950 text-slate-300">All Risk Levels</option>
            <option value="Low" className="bg-slate-950 text-emerald-400">Low Risk</option>
            <option value="Medium" className="bg-slate-950 text-yellow-400">Medium Risk</option>
            <option value="High" className="bg-slate-950 text-orange-400">High Risk</option>
            <option value="Critical" className="bg-slate-950 text-red-400">Critical Risk</option>
          </select>
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredVendors.map((vendor) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className={`glass-panel rounded-xl p-5 cursor-pointer relative overflow-hidden flex flex-col justify-between h-56 ${selectedVendor?.id === vendor.id ? "glass-panel-active" : ""}`}
            >
              <div className="radial-glow absolute inset-0"></div>
              
              {/* Card Header */}
              <div className="flex justify-between items-start z-10">
                <div>
                  <h3 className="font-display font-bold text-white text-base leading-tight hover:text-blue-400 transition-colors">
                    {vendor.name}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-medium">{vendor.industry}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${getRiskBadgeStyles(vendor.riskLevel)}`}>
                  {vendor.riskScore} Risk
                </span>
              </div>

              {/* Card Body */}
              <p className="text-xs text-slate-400 line-clamp-3 my-3 z-10 font-light leading-relaxed">
                {vendor.description}
              </p>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-slate-800/40 pt-3 z-10">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span>Compliance:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-slate-400" title="SOC2">S:{vendor.complianceStatus.SOC2 === "Compliant" ? "✅" : "❌"}</span>
                    <span className="text-[9px] text-slate-400" title="ISO">I:{vendor.complianceStatus.ISO27001 === "Compliant" ? "✅" : "❌"}</span>
                    <span className="text-[9px] text-slate-400" title="GDPR">G:{vendor.complianceStatus.GDPR === "Compliant" ? "✅" : "❌"}</span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => handleDeleteVendor(vendor.id, e)}
                  className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Remove vendor"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredVendors.length === 0 && (
        <div className="text-center py-20 text-slate-500 text-sm glass-panel rounded-xl">
          <Activity className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          No vendors match the specified filters.
        </div>
      )}

      {/* Slide-out Drawer: Vendor Detail */}
      <AnimatePresence>
        {selectedVendor && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVendor(null)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-slate-950 border-l border-slate-900 shadow-2xl p-6 z-50 overflow-y-auto text-slate-300"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-900">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">{selectedVendor.name}</h3>
                  <span className="text-xs text-slate-500">{selectedVendor.industry}</span>
                </div>
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="mt-5 space-y-6">
                {/* Risk Gauge Header */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold block">Risk Health Index</span>
                    <span className="text-2xl font-bold font-display text-white mt-1">{selectedVendor.riskScore} <span className="text-slate-500 text-xs">/ 100</span></span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadgeStyles(selectedVendor.riskLevel)}`}>
                    {selectedVendor.riskLevel} Level
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Overview</h4>
                  <p className="text-xs text-slate-300 font-light leading-relaxed">{selectedVendor.description}</p>
                </div>

                {/* Compliance statuses */}
                <div>
                  <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Compliance Auditing Overview</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedVendor.complianceStatus).map(([framework, status]) => (
                      <div key={framework} className="flex justify-between items-center p-2 rounded-lg bg-slate-900/40 border border-slate-800/40 text-xs">
                        <span className="font-medium text-slate-300">{framework} Standards</span>
                        <div className="flex items-center gap-1.5">
                          {getComplianceIcon(status)}
                          <span className="font-semibold">{status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div>
                  <h4 className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Threat Vector Details</h4>
                  <div className="space-y-2">
                    {selectedVendor.riskFactors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-red-950/5 border border-red-500/10 text-xs text-red-300">
                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed font-light">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subprocessors & Shared assets */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg text-xs">
                    <span className="text-slate-500 block mb-1">Subprocessors</span>
                    <span className="font-bold text-white text-base">{selectedVendor.subprocessors} downstream</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg text-xs">
                    <span className="text-slate-500 block mb-1">Active Incident Breaches</span>
                    <span className={`font-bold text-base ${selectedVendor.activeBreaches > 0 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
                      {selectedVendor.activeBreaches} detected
                    </span>
                  </div>
                </div>

                {/* Data Assets */}
                <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg text-xs">
                  <span className="text-slate-500 block mb-1">Bank Assets Shared</span>
                  <span className="font-medium text-slate-300">{selectedVendor.dataAssetsShared}</span>
                </div>

                {/* Contacts Info */}
                <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                  <span className="text-slate-500 uppercase tracking-widest font-semibold block mb-1">Primary Contacts Vendor</span>
                  <p className="text-slate-200 font-semibold">{selectedVendor.contacts.name}</p>
                  <p className="text-slate-400 flex items-center gap-1.5 select-all">
                    <Mail className="w-3.5 h-3.5 text-blue-500" /> {selectedVendor.contacts.email}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal: Add Vendor */}
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
              {/* Header */}
              <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-950/40">
                <h3 className="font-display font-bold text-white text-base">Register New Third-Party Vendor</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-md hover:bg-slate-900 border border-transparent hover:border-slate-800"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-white" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddVendorSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Vendor Name *</label>
                    <input
                      type="text"
                      required
                      value={newVendor.name}
                      onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                      placeholder="e.g. Acme Cloud Solutions"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Industry *</label>
                    <input
                      type="text"
                      required
                      value={newVendor.industry}
                      onChange={(e) => setNewVendor({...newVendor, industry: e.target.value})}
                      placeholder="e.g. Cloud Hosting"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Overview Description</label>
                  <textarea
                    rows={2}
                    value={newVendor.description}
                    onChange={(e) => setNewVendor({...newVendor, description: e.target.value})}
                    placeholder="Short description of products or services provided..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">SOC 2 Status</label>
                    <select
                      value={newVendor.SOC2}
                      onChange={(e) => setNewVendor({...newVendor, SOC2: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="Compliant">Compliant</option>
                      <option value="Partial">Partial</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">ISO 27001 Status</label>
                    <select
                      value={newVendor.ISO27001}
                      onChange={(e) => setNewVendor({...newVendor, ISO27001: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="Compliant">Compliant</option>
                      <option value="Partial">Partial</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">GDPR Status</label>
                    <select
                      value={newVendor.GDPR}
                      onChange={(e) => setNewVendor({...newVendor, GDPR: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                    >
                      <option value="Compliant">Compliant</option>
                      <option value="Partial">Partial</option>
                      <option value="Non-Compliant">Non-Compliant</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Security Score (0-100) *</label>
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
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Primary Contacts Name</label>
                    <input
                      type="text"
                      value={newVendor.contactName}
                      onChange={(e) => setNewVendor({...newVendor, contactName: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Primary Contacts Email</label>
                  <input
                    type="email"
                    value={newVendor.contactEmail}
                    onChange={(e) => setNewVendor({...newVendor, contactEmail: e.target.value})}
                    placeholder="johndoe@vendor.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">Threat Vectors / Risk Factors (comma separated)</label>
                  <input
                    type="text"
                    value={newVendor.riskFactors}
                    onChange={(e) => setNewVendor({...newVendor, riskFactors: e.target.value})}
                    placeholder="e.g. API access limits unset, Unsecured database backups"
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-5050 border border-blue-600 text-xs font-semibold text-white transition-colors"
                  >
                    Register Vendor
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
