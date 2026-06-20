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
import Welcome from "./pages/Welcome";

export default function App() {
  // Navigation & Shell States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // App Data States
  const [vendors, setVendors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [complianceStandards, setComplianceStandards] = useState({});

  // Load all dashboard states dynamically from JSON
  React.useEffect(() => {
    fetch("/data.json")
      .then(res => res.json())
      .then(data => {
        if (data.vendors) {
          setVendors(data.vendors);
          
          // Generate expiry alerts dynamically from vendor certifications status
          const alerts = [];
          data.vendors.forEach(v => {
            if (v.certifications) {
              v.certifications.forEach(c => {
                if (c.status === "Expired") {
                  alerts.push({
                    id: `exp-${v.id}-${c.name}`,
                    vendorName: v.name,
                    certName: c.name,
                    status: "expired",
                    expiryDate: c.expiryDate
                  });
                }
              });
            }
          });
          setExpiryAlerts(alerts);
        }
        if (data.recentActivities) {
          setRecentActivities(data.recentActivities);
          setNotifications(data.recentActivities.slice(0, 3));
        }
        if (data.contracts) {
          setContracts(data.contracts);
        }
        if (data.complianceStandards) {
          setComplianceStandards(data.complianceStandards);
        }
      })
      .catch(err => console.error("Error loading dynamic data:", err));
  }, []);

  // Calculate dynamic Threat Level
  const getDynamicThreatLevel = () => {
    if (!vendors || vendors.length === 0) {
      return { label: "SECURE", color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/10" };
    }
    
    const averageRisk = vendors.reduce((acc, curr) => acc + curr.riskScore, 0) / vendors.length;
    const hasBreaches = vendors.some(v => v.activeBreaches > 0);
    const hasCritical = vendors.some(v => v.riskLevel === "Critical");
    const hasHigh = vendors.some(v => v.riskLevel === "High");

    if (hasBreaches || hasCritical || averageRisk > 70) {
      return { label: "CRITICAL", color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/10" };
    }
    if (hasHigh || averageRisk > 45) {
      return { label: "ELEVATED", color: "text-orange-400", border: "border-orange-500/30", bg: "bg-orange-500/10" };
    }
    return { label: "SECURE", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" };
  };

  const threatLevel = getDynamicThreatLevel();

  // Interactions Shared States
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [heatmapFilter, setHeatmapFilter] = useState(null);

  const getBgStyle = () => {
    switch (activeTab) {
      case "dashboard":
        return "url('/cyber_sentinel_bg.png')";
      case "vendors":
        return "url('/cyber_vendors_bg.png')";
      case "riskAnalysis":
        return "url('/cyber_risk_bg.png')";
      case "compliance":
        return "url('/cyber_compliance_bg.png')";
      case "contractAI":
        return "url('/cyber_contract_bg.png')";
      default:
        return "url('/cyber_sentinel_bg.png')";
    }
  };

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
            complianceStandards={complianceStandards}
          />
        );
      case "contractAI":
        return (
          <ContractAI contracts={contracts} setContracts={setContracts} />
        );
      default:
        return (
          <div className="p-6 text-center text-slate-500 text-sm">
            Operational area under construction.
          </div>
        );
    }
  };

  if (showLanding) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="welcome"
          className="bg-slate-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Welcome onEnterPortal={() => setShowLanding(false)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans selection:bg-blue-600/30 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Image HUD Layer with smooth transition */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-all duration-1000 ease-in-out pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(3, 7, 18, 0.88), rgba(3, 7, 18, 0.94)), ${getBgStyle()}`
        }}
      ></div>

      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-[45rem] h-[45rem] bg-blue-900/10 rounded-full blur-[10rem] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-[35rem] h-[35rem] bg-indigo-900/5 rounded-full blur-[8rem] pointer-events-none z-0"></div>
      
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onSignOut={() => setShowLanding(true)}
      />

      {/* Main Panel Shell */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative cyber-grid">
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          notifications={notifications} 
          setNotifications={setNotifications}
          threatLevel={threatLevel}
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
