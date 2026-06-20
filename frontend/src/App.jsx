import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Import Pages
import DashboardHome from "./pages/DashboardHome";
import Vendors from "./pages/Vendors";
import RiskAnalysis from "./pages/RiskAnalysis";
import Compliance from "./pages/Compliance";
import ContractAI from "./pages/ContractAI";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import { 
  mockVendors, 
  mockRecentActivities, 
  mockExpiryAlerts 
} from "./data/mockData";

export default function App() {
  // Navigation & Shell States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  // App Data States
  const [vendors, setVendors] = useState(mockVendors);
  const [notifications, setNotifications] = useState(mockRecentActivities.slice(0, 3));
  const [recentActivities, setRecentActivities] = useState(mockRecentActivities);
  const [expiryAlerts, setExpiryAlerts] = useState(mockExpiryAlerts);

  // Interactions Shared States
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [heatmapFilter, setHeatmapFilter] = useState(null);

  // Router dispatcher
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardHome 
            vendors={vendors}
            expiryAlerts={expiryAlerts}
            recentActivities={recentActivities}
            setActiveTab={setActiveTab}
            setSelectedVendor={setSelectedVendor}
            setHeatmapFilter={setHeatmapFilter}
          />
        );
      case "vendors":
        return (
          <Vendors 
            vendors={vendors}
            setVendors={setVendors}
            selectedVendor={selectedVendor}
            setSelectedVendor={setSelectedVendor}
            heatmapFilter={heatmapFilter}
            setHeatmapFilter={setHeatmapFilter}
          />
        );
      case "riskAnalysis":
        return (
          <RiskAnalysis 
            vendors={vendors}
            setVendors={setVendors}
            setNotifications={setNotifications}
          />
        );
      case "compliance":
        return (
          <Compliance 
            vendors={vendors}
            setNotifications={setNotifications}
          />
        );
      case "contractAI":
        return (
          <ContractAI />
        );
      case "reports":
        return (
          <Reports 
            vendors={vendors}
          />
        );
      case "settings":
        return (
          <Settings 
            vendors={vendors}
            setVendors={setVendors}
            setNotifications={setNotifications}
          />
        );
      default:
        return (
          <div className="p-6 text-center text-slate-500 text-sm">
            Operational area under construction.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-blue-600/30 selection:text-white relative overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-blue-900/10 rounded-full blur-[10rem] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-indigo-900/5 rounded-full blur-[8rem] pointer-events-none z-0"></div>
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Panel Shell */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative cyber-grid">
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          notifications={notifications} 
          setNotifications={setNotifications}
        />

        {/* View Frame */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
