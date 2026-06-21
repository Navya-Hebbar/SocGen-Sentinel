import React, { useState } from "react";
import { 
  Bell, 
  Search, 
  Settings, 
  ShieldAlert, 
  Globe, 
  Calendar,
  X,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function Navbar({ activeTab, notifications, setNotifications, threatLevel = {} }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const getBreadcrumb = () => {
    switch (activeTab) {
      case "dashboard": return "Security Operations Center / Overview";
      case "vendors": return "Vendor Ecosystem / Directory";
      case "riskAnalysis": return "Risk Operations / AI Threat Engine";
      case "compliance": return "Audit Workbench / Standards Matrix";
      case "contractAI": return "Contract Intelligence / AI Parser";
      case "reports": return "Intelligence Reports / Custom Generator";
      case "settings": return "System Control / Policy Settings";
      case "futureRisk": return "Future Risk Prediction / ML Trajectory Forecasting";
      case "breachMonitor": return "Threat Intelligence / Vendor Breach Feed";
      case "auditReport": return "Intelligence Reports / Executive Audit Report";
      default: return "Sentinel Gateway";
    }
  };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.length;

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between select-none">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
        <div>
          <span className="text-xs text-slate-500 uppercase tracking-wider font-display font-medium">SocGen Sentinel</span>
          <h2 className="text-sm font-semibold text-slate-300 font-display mt-[-2px]">
            {getBreadcrumb()}
          </h2>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search vendor, risk factor, policy..."
            className="w-64 bg-slate-900/60 border border-slate-800 rounded-lg py-1.5 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all font-sans"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Global Risk Threat Level Indicator */}
        <div className={`flex items-center gap-2 bg-slate-900/60 border ${threatLevel.border || "border-slate-800/80"} rounded-lg px-3 py-1.5 text-xs text-slate-400`}>
          <ShieldAlert className={`w-3.5 h-3.5 ${threatLevel.color || "text-orange-400"} ${threatLevel.label !== "SECURE" ? "animate-pulse" : ""}`} />
          <span className="hidden sm:inline">Threat Level:</span>
          <span className={`font-semibold ${threatLevel.color || "text-orange-400"} tracking-wider`}>
            {threatLevel.label || "ELEVATED"}
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg border bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/30 transition-all relative ${showNotifications ? "text-white border-blue-500/40" : ""}`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-950 animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800/80 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden backdrop-blur-lg">
              <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                <span className="font-display font-semibold text-xs text-white">Alert Logs ({unreadCount})</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleClearAll} 
                    className="text-[10px] font-semibold text-slate-400 hover:text-blue-400 transition-colors uppercase tracking-wider"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500/80 mx-auto mb-2" />
                    All checks secure. No outstanding alerts.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div key={item.id} className="p-3 hover:bg-slate-950/40 transition-colors relative group">
                      <button 
                        onClick={() => handleDismissNotification(item.id)}
                        className="absolute top-2 right-2 text-slate-600 hover:text-white p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="flex items-start gap-2.5">
                        {item.type === "critical" ? (
                          <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="text-xs">
                          <p className="font-semibold text-slate-200">{item.vendorName}</p>
                          <p className="text-slate-400 mt-0.5 font-light leading-relaxed">{item.content}</p>
                          <span className="text-[10px] text-slate-600 mt-1 block">{item.timestamp || "Just now"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
