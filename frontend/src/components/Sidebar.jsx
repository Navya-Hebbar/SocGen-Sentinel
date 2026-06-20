import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  Activity, 
  FileCheck, 
  FileText, 
  Sliders, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Lock,
  UserCheck,
  LogOut
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, onSignOut }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "vendors", label: "Vendors", icon: Users },
    { id: "riskAnalysis", label: "Risk Analysis", icon: Activity },
    { id: "compliance", label: "Compliance", icon: FileCheck },
    { id: "contractAI", label: "Contract AI", icon: Database },
  ];

  return (
    <motion.div
      animate={{ width: collapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 left-0 bg-slate-950 border-r border-slate-900 flex flex-col justify-between z-30 select-none text-slate-300"
    >
      <div>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-slate-900">
          {!collapsed ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <ShieldAlert className="w-6 h-6 text-blue-500 neon-text-blue" />
              <span className="font-display font-bold text-lg text-white tracking-wider">
                SOCGEN <span className="text-blue-500">SENTINEL</span>
              </span>
            </motion.div>
          ) : (
            <div className="mx-auto">
              <ShieldAlert className="w-6 h-6 text-blue-500 neon-text-blue" />
            </div>
          )}

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/50 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Threat Banner */}
        {!collapsed && (
          <div className="m-3 p-3 rounded-lg bg-blue-950/20 border border-blue-900/30 flex items-center gap-2 text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-400">Threat Guard Active: Secure</span>
          </div>
        )}

        {/* Menu Items */}
        <nav className="mt-4 px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all group relative ${
                  isActive 
                    ? "bg-blue-600/10 text-white border-l-2 border-blue-500 shadow-[inset_4px_0_12px_rgba(59,130,246,0.05)]" 
                    : "hover:bg-slate-900/60 hover:text-white text-slate-400"
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-blue-500" : "text-slate-400 group-hover:text-blue-400"}`} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.span>
                )}
                {/* Tooltip for collapsed sidebar */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-slate-950 border border-slate-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      {/* Sign Out Button */}
      <div className="p-3 border-t border-slate-900/60 mt-auto">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 p-2.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
          {!collapsed && <span className="uppercase tracking-wider">Sign Out</span>}
        </button>
      </div>
    </motion.div>
  );
}
