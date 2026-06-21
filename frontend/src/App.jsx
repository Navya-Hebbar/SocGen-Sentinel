import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

// Import API Helpers
import { fetchVendors, fetchContracts, fetchComplianceSummary, fetchBreachFeed } from "./utils/api";

// Import Pages
import DashboardHome from "./pages/DashboardHome";
import Vendors from "./pages/Vendors";
import RiskAnalysis from "./pages/RiskAnalysis";
import Compliance from "./pages/Compliance";
import ContractAI from "./pages/ContractAI";
import Welcome from "./pages/Welcome";
import FutureRisk from "./pages/FutureRisk";
import BreachMonitor from "./pages/BreachMonitor";
import AuditReport from "./pages/AuditReport";

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

  // Load all dashboard states dynamically from Backend or fallback JSON
  React.useEffect(() => {
    async function loadAllData() {
      try {
        const backendVendors = await fetchVendors();
        if (backendVendors && backendVendors.length > 0) {
          setVendors(backendVendors);
          
          // Generate expiry alerts dynamically
          const alerts = [];
          backendVendors.forEach(v => {
            if (v.certifications) {
              v.certifications.forEach(c => {
                if (c.status === "Expired" || c.status === "Non-Compliant") {
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
          
          // Fetch contracts from backend
          const backendContracts = await fetchContracts();
          if (backendContracts) setContracts(backendContracts);
          
          // Fetch compliance standards fallback
          const defaultCompliance = {
            "SOC2": [
              {"id": "req-s1", "name": "CC6.1 - Logical Access Control", "desc": "MFA, SSO, and endpoint protection must be active for all staff."},
              {"id": "req-s2", "name": "CC6.3 - Perimeter Defenses", "desc": "Vulnerability scanners and firewall rules must be reviewed monthly."},
              {"id": "req-s3", "name": "CC7.1 - Vulnerability Management", "desc": "Pen tests annually; critical findings patched within 30 days."}
            ],
            "ISO27001": [
              {"id": "req-i1", "name": "A.9.2 - User Access Mgmt", "desc": "Formal authorization process for privileged developer roles."},
              {"id": "req-i2", "name": "A.12.6 - Tech Vulnerabilities", "desc": "Patches cataloged and deployed systematically by security level."},
              {"id": "req-i3", "name": "A.10.1 - Cryptographic Controls", "desc": "Sensitive data encrypted at rest and in transit."}
            ],
            "GDPR": [
              {"id": "req-g1", "name": "Article 32 - Security of Processing", "desc": "Pseudo-anonymization and log auditing on user database assets."},
              {"id": "req-g2", "name": "Article 28 - Subprocessor Agreements", "desc": "Contracts must declare all downstream subprocessors."},
              {"id": "req-g3", "name": "Article 33 - Breach Notification", "desc": "Client notification within 72 hours of security incidents."}
            ]
          };
          setComplianceStandards(defaultCompliance);
          
          // Fetch recent activities from global feed
          const feedRes = await fetchBreachFeed();
          if (feedRes && feedRes.feed) {
            const activities = feedRes.feed.map(item => ({
              id: item.id,
              vendorName: item.vendor_match || "Security Intelligence Feed",
              type: item.severity === "Critical" ? "breach" : "compliance",
              content: item.title,
              timestamp: item.date || "Recent"
            }));
            setRecentActivities(activities);
            setNotifications(activities.slice(0, 3));
          }
          return;
        }
      } catch (err) {
        console.warn("Backend unavailable:", err);
      }
    }
    
    loadAllData();
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

  // Dynamically update body background based on active tab
  useEffect(() => {
    const getBgUrl = () => {
      switch (activeTab) {
        case "vendors": return "url('/cyber_vendors_bg.png')";
        case "riskAnalysis": 
        case "futureRisk":
        case "breachMonitor": return "url('/cyber_risk_bg.png')";
        case "compliance": 
        case "auditReport": return "url('/cyber_compliance_bg.png')";
        case "contractAI": return "url('/cyber_contract_bg.png')";
        case "dashboard":
        default: return "url('/cyber_sentinel_bg.png')";
      }
    };
    
    // Apply background with our sleek dark overlay gradient
    document.body.style.backgroundImage = `linear-gradient(rgba(3, 7, 18, 0.85), rgba(3, 7, 18, 0.95)), ${getBgUrl()}`;
  }, [activeTab]);

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
      case "futureRisk":
        return (
          <FutureRisk 
            vendors={vendors}
            setActiveTab={setActiveTab}
            setSelectedVendor={setSelectedVendor}
          />
        );
      case "breachMonitor":
        return (
          <BreachMonitor vendors={vendors} />
        );
      case "auditReport":
        return (
          <AuditReport vendors={vendors} />
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
    <div className="min-h-screen bg-transparent flex print:block font-sans selection:bg-blue-600/30 selection:text-white relative overflow-hidden print:overflow-visible">

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
      <div className="flex-1 flex flex-col print:block min-w-0 z-10 relative">
        {/* Top Navbar */}
        <Navbar 
          activeTab={activeTab} 
          notifications={notifications} 
          setNotifications={setNotifications}
          threatLevel={threatLevel}
        />

        {/* View Frame */}
        <main className="flex-1 overflow-y-auto print:overflow-visible">
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
