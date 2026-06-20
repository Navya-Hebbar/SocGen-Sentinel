import React, { useState } from "react";
import { 
  Sliders, 
  Bell, 
  Cpu, 
  Key, 
  Save, 
  HelpCircle,
  ToggleLeft,
  CheckCircle,
  RefreshCw
} from "lucide-react";

export default function Settings({ vendors, setVendors, setNotifications }) {
  // Risk score weights
  const [weights, setWeights] = useState({
    leaks: 40,
    compliance: 30,
    subprocessors: 30
  });

  // Settings states
  const [threshold, setThreshold] = useState(70);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [apiLogs, setApiLogs] = useState(false);
  
  // Action status
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleWeightChange = (key, val) => {
    const value = parseInt(val);
    setWeights(prev => {
      const updated = { ...prev, [key]: value };
      
      // Keep total sum at 100 or adjust other variables proportionally
      const otherKeys = Object.keys(updated).filter(k => k !== key);
      const remaining = 100 - value;
      const firstOtherVal = Math.round(remaining / 2);
      const secondOtherVal = remaining - firstOtherVal;
      
      updated[otherKeys[0]] = firstOtherVal;
      updated[otherKeys[1]] = secondOtherVal;
      
      return updated;
    });
  };

  const handleSaveSettings = () => {
    setSaving(true);
    setSaved(false);

    // Simulate database update
    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      // Recalculate vendor scores slightly to simulate weighting change
      const updatedVendors = vendors.map(v => {
        // Adjust score base based on new weights
        // Higher leak weight increases scores for vendors with database leakage (like Snowflake, CrowdStrike)
        let modifier = 0;
        if (weights.leaks > 40 && (v.name.includes("Snowflake") || v.name.includes("CrowdStrike"))) {
          modifier = 6;
        } else if (weights.compliance > 30 && v.complianceStatus.ISO27001 !== "Compliant") {
          modifier = 8;
        } else if (weights.subprocessors > 30 && v.subprocessors > 15) {
          modifier = 7;
        }

        const newScore = Math.max(10, Math.min(100, v.riskScore + modifier));
        let level = "Low";
        if (newScore > 80) level = "Critical";
        else if (newScore > 60) level = "High";
        else if (newScore > 40) level = "Medium";

        return {
          ...v,
          riskScore: newScore,
          riskLevel: level
        };
      });

      setVendors(updatedVendors);

      // Trigger notification
      const alertId = `set-${Date.now()}`;
      setNotifications(prev => [
        {
          id: alertId,
          vendorName: "System Engine",
          type: "info",
          content: "System risk weights updated. Recalculated vendor exposure indices.",
          timestamp: "Just now"
        },
        ...prev
      ]);

      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-white">System Controls</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-light">Configure risk weights, alerting thresholds, and enterprise integrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Weightings Panel */}
        <div className="glass-panel rounded-xl p-5 space-y-5 lg:col-span-2">
          <div>
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" /> Dynamic Risk Scoring Weights
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Adjust how threat indices are calculated globally across vendors (Must total 100%)</p>
          </div>

          <div className="space-y-4">
            
            {/* Leak Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Dark Web Credentials & Leaks Exposure</span>
                <span className="text-blue-400 font-mono">{weights.leaks}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={weights.leaks}
                onChange={(e) => handleWeightChange("leaks", e.target.value)}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Compliance Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Framework Auditing Failures</span>
                <span className="text-blue-400 font-mono">{weights.compliance}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={weights.compliance}
                onChange={(e) => handleWeightChange("compliance", e.target.value)}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Subprocessor Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Downstream Subprocessor Data Risk</span>
                <span className="text-blue-400 font-mono">{weights.subprocessors}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={weights.subprocessors}
                onChange={(e) => handleWeightChange("subprocessors", e.target.value)}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

          </div>

          {/* Threshold setting */}
          <div className="pt-4 border-t border-slate-900 space-y-3">
            <div>
              <h5 className="text-xs font-semibold text-white">Alerting Score Threshold</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">Define vendor risk level score which triggers high-priority email alerts</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="50"
                max="95"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-20 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
              />
              <span className="text-xs text-slate-400">Scores higher than this flag critical notifications</span>
            </div>
          </div>
        </div>

        {/* Configurations Side Panel */}
        <div className="glass-panel rounded-xl p-5 flex flex-col justify-between h-full space-y-6">
          <div>
            <h4 className="font-display font-semibold text-sm text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" /> Integrations & Triggers
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Connect Sentinel dashboard to SIEM tools</p>
          </div>

          {/* Integrations toggles */}
          <div className="space-y-4 flex-grow">
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs">
              <div>
                <p className="font-semibold text-slate-200">Slack Alerts Endpoint</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-light">Push alerts to #sec-ops Slack channel</p>
              </div>
              <button 
                onClick={() => setSlackAlerts(!slackAlerts)}
                className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
                  slackAlerts ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-slate-900 text-slate-500 border border-slate-800"
                }`}
              >
                {slackAlerts ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-800/40 text-xs">
              <div>
                <p className="font-semibold text-slate-200">Webhook Logging</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-light">Broadcast changes to Splunk API</p>
              </div>
              <button 
                onClick={() => setApiLogs(!apiLogs)}
                className={`text-xs font-semibold px-3 py-1 rounded transition-colors ${
                  apiLogs ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-slate-900 text-slate-500 border border-slate-800"
                }`}
              >
                {apiLogs ? "Enabled" : "Disabled"}
              </button>
            </div>

          </div>

          {/* Action Trigger */}
          <div className="pt-4 border-t border-slate-900">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md ${
                saving
                  ? "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/10 cursor-pointer"
              }`}
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Recalculating Matrix...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Settings Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save System Settings
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
