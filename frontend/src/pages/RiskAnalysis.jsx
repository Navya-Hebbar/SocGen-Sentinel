import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Activity, 
  HelpCircle, 
  ChevronRight, 
  TrendingDown, 
  Save, 
  AlertTriangle,
  Flame,
  CheckCircle,
  Play
} from "lucide-react";

export default function RiskAnalysis({ vendors, setVendors, setNotifications }) {
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0]?.id || "");
  const [vendor, setVendor] = useState(null);

  // Remediation Toggles
  const [controls, setControls] = useState({
    mfaEnforced: false,
    encryptionEnabled: false,
    soc2Completed: false,
    apiSecured: false,
    subprocessorRestricted: false,
    penTested: false
  });

  const [simulatedScore, setSimulatedScore] = useState(0);

  // Update local vendor details when selection changes
  useEffect(() => {
    const v = vendors.find(vend => vend.id === selectedVendorId);
    if (v) {
      setVendor(v);
      // Pre-fill controls based on vendor's actual details (simulate)
      setControls({
        mfaEnforced: v.riskScore < 50,
        encryptionEnabled: v.complianceStatus.ISO27001 === "Compliant",
        soc2Completed: v.complianceStatus.SOC2 === "Compliant",
        apiSecured: v.riskScore < 40,
        subprocessorRestricted: v.subprocessors < 10,
        penTested: v.riskScore < 30
      });
    }
  }, [selectedVendorId, vendors]);

  // Calculate simulated score based on toggles
  useEffect(() => {
    if (!vendor) return;

    let baseScore = vendor.riskScore;
    
    // Each enabled control reduces risk score (simulating defense actions)
    if (controls.mfaEnforced && vendor.riskScore > 35) baseScore -= 12;
    if (controls.encryptionEnabled && vendor.complianceStatus.ISO27001 !== "Compliant") baseScore -= 15;
    if (controls.soc2Completed && vendor.complianceStatus.SOC2 !== "Compliant") baseScore -= 15;
    if (controls.apiSecured) baseScore -= 10;
    if (controls.subprocessorRestricted && vendor.subprocessors >= 10) baseScore -= 8;
    if (controls.penTested) baseScore -= 10;

    // Boundary check
    const finalSim = Math.max(10, Math.min(100, baseScore));
    setSimulatedScore(finalSim);
  }, [controls, vendor]);

  const handleToggle = (controlKey) => {
    setControls(prev => ({
      ...prev,
      [controlKey]: !prev[controlKey]
    }));
  };

  const getSimulatedRiskLevel = (score) => {
    if (score > 80) return { label: "Critical", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" };
    if (score > 60) return { label: "High", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" };
    if (score > 40) return { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" };
    return { label: "Low", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" };
  };

  const handleApplyRemediation = () => {
    if (!vendor) return;

    // Update vendor in database list
    const simLevel = getSimulatedRiskLevel(simulatedScore).label;
    
    const updatedVendors = vendors.map(v => {
      if (v.id === vendor.id) {
        return {
          ...v,
          riskScore: simulatedScore,
          riskLevel: simLevel,
          // Update compliance statuses if audited/encrypted
          complianceStatus: {
            ...v.complianceStatus,
            SOC2: controls.soc2Completed ? "Compliant" : v.complianceStatus.SOC2,
            ISO27001: controls.encryptionEnabled ? "Compliant" : v.complianceStatus.ISO27001
          },
          // Adjust subprocessors count if restricted
          subprocessors: controls.subprocessorRestricted ? Math.min(v.subprocessors, 8) : v.subprocessors,
          activeBreaches: simulatedScore < 50 ? 0 : v.activeBreaches
        };
      }
      return v;
    });

    setVendors(updatedVendors);

    // Create system notification
    const alertId = `rem-${Date.now()}`;
    const newAlert = {
      id: alertId,
      vendorName: vendor.name,
      type: "success",
      content: `AI Remediation applied successfully. Score reduced to ${simulatedScore} (${simLevel} Risk).`,
      timestamp: "Just now"
    };

    setNotifications(prev => [newAlert, ...prev]);
  };

  const simRisk = getSimulatedRiskLevel(simulatedScore);

  return (
    <div className="p-6 space-y-6">
      {/* Tab Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-white">Risk Intelligence Modeling</h2>
        <p className="text-xs text-slate-500 mt-0.5">Use AI sandbox to run What-If threat mitigation plans and estimate exposure index</p>
      </div>

      {vendor ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Simulator Config Side (Toggles) */}
          <div className="glass-panel rounded-xl p-5 lg:col-span-2 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-slate-900">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <h4 className="font-display font-semibold text-sm text-white">Threat Mitigation Sandbox</h4>
              </div>
              <div>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500/50"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id} className="bg-slate-950">{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current State Summary */}
            <div className="p-4 bg-slate-900/30 border border-slate-800/40 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="text-slate-500 font-semibold uppercase tracking-wider">Unmitigated Profile</p>
                <p className="text-slate-300 font-light mt-1">
                  {vendor.name} currently operates at a <span className="font-semibold text-white">{vendor.riskScore}</span> risk score.
                </p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block mb-1">Impact Industry</span>
                <span className="font-semibold text-slate-200">{vendor.industry}</span>
              </div>
            </div>

            {/* Mitigation Checklist */}
            <div>
              <h5 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-3">Enable Security Controls</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Control 1: MFA */}
                <div 
                  onClick={() => handleToggle("mfaEnforced")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    controls.mfaEnforced 
                      ? "bg-blue-600/10 border-blue-500/40 text-slate-200" 
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <p className="font-semibold text-xs text-white">Enforce MFA Policies</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-light">Force multi-factor authentication across all administrator consoles.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={controls.mfaEnforced}
                    readOnly
                    className="w-4 h-4 rounded border-slate-800 text-blue-600 bg-slate-950 mt-0.5 focus:ring-0"
                  />
                </div>

                {/* Control 2: Data Encryption */}
                <div 
                  onClick={() => handleToggle("encryptionEnabled")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    controls.encryptionEnabled 
                      ? "bg-blue-600/10 border-blue-500/40 text-slate-200" 
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <p className="font-semibold text-xs text-white">Encrypt Backup Assets</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-light">Enforce AES-256 backup bucket encryption with rotating Key Manager.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={controls.encryptionEnabled}
                    readOnly
                    className="w-4 h-4 rounded border-slate-800 text-blue-600 bg-slate-950 mt-0.5 focus:ring-0"
                  />
                </div>

                {/* Control 3: Complete Audit */}
                <div 
                  onClick={() => handleToggle("soc2Completed")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    controls.soc2Completed 
                      ? "bg-blue-600/10 border-blue-500/40 text-slate-200" 
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <p className="font-semibold text-xs text-white">Complete SOC 2 Audit</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-light">Accelerate and finalize the SOC 2 Type II compliance audit verification.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={controls.soc2Completed}
                    readOnly
                    className="w-4 h-4 rounded border-slate-800 text-blue-600 bg-slate-950 mt-0.5 focus:ring-0"
                  />
                </div>

                {/* Control 4: API credentials */}
                <div 
                  onClick={() => handleToggle("apiSecured")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    controls.apiSecured 
                      ? "bg-blue-600/10 border-blue-500/40 text-slate-200" 
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <p className="font-semibold text-xs text-white">Secure API Tokens</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-light">Revoke exposed API tokens and implement automated key rotation rules.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={controls.apiSecured}
                    readOnly
                    className="w-4 h-4 rounded border-slate-800 text-blue-600 bg-slate-950 mt-0.5 focus:ring-0"
                  />
                </div>

                {/* Control 5: Subprocessors */}
                <div 
                  onClick={() => handleToggle("subprocessorRestricted")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    controls.subprocessorRestricted 
                      ? "bg-blue-600/10 border-blue-500/40 text-slate-200" 
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <p className="font-semibold text-xs text-white">Restrict Subprocessors</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-light">Offload and terminate high-risk downstream data processor access tunnels.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={controls.subprocessorRestricted}
                    readOnly
                    className="w-4 h-4 rounded border-slate-800 text-blue-600 bg-slate-950 mt-0.5 focus:ring-0"
                  />
                </div>

                {/* Control 6: Pen Test */}
                <div 
                  onClick={() => handleToggle("penTested")}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    controls.penTested 
                      ? "bg-blue-600/10 border-blue-500/40 text-slate-200" 
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <p className="font-semibold text-xs text-white">Periodic Penetration Tests</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-light">Schedule continuous penetration testing with detailed remediation tracker.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={controls.penTested}
                    readOnly
                    className="w-4 h-4 rounded border-slate-800 text-blue-600 bg-slate-950 mt-0.5 focus:ring-0"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Simulator Outcomes Panel (Gauge & Save) */}
          <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-full space-y-6">
            <div>
              <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500 animate-pulse" /> Estimated Outcomes
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Real-time simulation results based on parameters</p>
            </div>

            {/* Score comparison display */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative flex items-center justify-center">
                
                {/* Simulated score dial */}
                <div className="w-36 h-36 rounded-full border-4 border-slate-900 flex flex-col items-center justify-center">
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Simulated</span>
                  <span className={`text-4xl font-extrabold font-display ${simRisk.color} mt-1`}>
                    {simulatedScore}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">Score</span>
                </div>

                {/* Score change bubble */}
                {vendor.riskScore - simulatedScore > 0 && (
                  <div className="absolute -top-1 -right-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full px-2 py-0.5 text-[10px] font-bold flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3" /> -{vendor.riskScore - simulatedScore}
                  </div>
                )}
              </div>

              {/* Status capsule */}
              <div className={`px-4 py-1.5 rounded-full border text-xs font-semibold uppercase tracking-wider ${simRisk.bg} ${simRisk.color}`}>
                {simRisk.label} Risk Level
              </div>
            </div>

            {/* Score Comparison Bars */}
            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Current Baseline Score</span>
                  <span className="text-white font-bold">{vendor.riskScore}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: `${vendor.riskScore}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 font-medium">
                  <span>Estimated Mitigated Score</span>
                  <span className="text-white font-bold">{simulatedScore}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${simulatedScore}%` }}></div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                onClick={handleApplyRemediation}
                disabled={vendor.riskScore === simulatedScore}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  vendor.riskScore === simulatedScore
                    ? "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-500/10 cursor-pointer"
                }`}
              >
                <Save className="w-4 h-4" /> Apply Remediation Controls
              </button>
              <p className="text-[10px] text-slate-500 mt-2 text-center leading-relaxed">
                Applying controls updates the primary dashboard ecosystem scores and triggers audit compliance logs.
              </p>
            </div>

          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-2xl max-w-xl mx-auto space-y-6 relative overflow-hidden my-12">
          <div className="radial-glow absolute inset-0"></div>
          <div className="cyber-scanner"></div>
          <div className="p-4 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Flame className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-2 z-10">
            <h3 className="font-display font-semibold text-lg text-white">Simulation Vault Offline</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-light font-sans">
              No vendors registered in SecOps Catalog. Load data at <code className="text-blue-400 bg-slate-900 px-1.5 py-0.5 rounded">public/data.json</code> or register one manually to model threat controls.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
