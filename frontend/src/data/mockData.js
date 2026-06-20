// Mock data for SocGen Sentinel Vendor Risk Intelligence Platform

export const mockVendors = [
  {
    id: "v-1",
    name: "CrowdStrike Sec",
    industry: "Cybersecurity",
    riskScore: 78,
    riskLevel: "High",
    description: "Endpoint protection, threat intelligence, and cyberattack response services.",
    complianceStatus: {
      SOC2: "Compliant",
      GDPR: "Compliant",
      ISO27001: "Compliant"
    },
    activeBreaches: 1,
    riskFactors: [
      "Subprocessor database vulnerability",
      "API credential exposure risk",
      "High privilege access roles unreviewed"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Active", expiryDate: "2026-12-15" },
      { name: "ISO 27001", status: "Active", expiryDate: "2027-02-28" },
      { name: "GDPR Assessment", status: "Active", expiryDate: "2026-08-30" }
    ],
    contacts: {
      name: "Sarah Jenkins",
      email: "sjenkins@crowdstrike.sec.com"
    },
    subprocessors: 14,
    dataAssetsShared: "Endpoint Telemetry, PII, Internal System Logs"
  },
  {
    id: "v-2",
    name: "Snowflake Data",
    industry: "Cloud Data Warehousing",
    riskScore: 92,
    riskLevel: "Critical",
    description: "Cloud-based data storage and analytics service provider.",
    complianceStatus: {
      SOC2: "Compliant",
      GDPR: "Partial",
      ISO27001: "Non-Compliant"
    },
    activeBreaches: 2,
    riskFactors: [
      "Unauthorized dark web credentials detected",
      "MFA bypass vulnerability in client portals",
      "Unencrypted backup storage detected"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Expired", expiryDate: "2026-05-10" },
      { name: "ISO 27001", status: "Active", expiryDate: "2026-10-01" },
      { name: "GDPR Assessment", status: "Expired", expiryDate: "2026-06-01" }
    ],
    contacts: {
      name: "Marcus Aurelius",
      email: "maurelius@snowflake.data.com"
    },
    subprocessors: 22,
    dataAssetsShared: "Financial Customer Records, Transaction Logs, User Profiles"
  },
  {
    id: "v-3",
    name: "Auth0 Auth",
    industry: "Identity Management",
    riskScore: 35,
    riskLevel: "Low",
    description: "Enterprise authentication, single sign-on, and user identity management API.",
    complianceStatus: {
      SOC2: "Compliant",
      GDPR: "Compliant",
      ISO27001: "Compliant"
    },
    activeBreaches: 0,
    riskFactors: [
      "Minor patch delay in secondary testing environment"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Active", expiryDate: "2027-01-20" },
      { name: "ISO 27001", status: "Active", expiryDate: "2027-04-15" },
      { name: "GDPR Assessment", status: "Active", expiryDate: "2027-06-30" }
    ],
    contacts: {
      name: "Elena Rostova",
      email: "erostova@auth0.auth.com"
    },
    subprocessors: 6,
    dataAssetsShared: "User Credentials, Session Tokens, MFA Device Metadata"
  },
  {
    id: "v-4",
    name: "SolarWinds Net",
    industry: "Network Management",
    riskScore: 68,
    riskLevel: "Medium",
    description: "System administration and network monitoring software suite.",
    complianceStatus: {
      SOC2: "Partial",
      GDPR: "Compliant",
      ISO27001: "Compliant"
    },
    activeBreaches: 0,
    riskFactors: [
      "Historical source code injection vulnerability",
      "Slow patch release pipeline response"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Active", expiryDate: "2026-07-12" },
      { name: "ISO 27001", status: "Active", expiryDate: "2026-11-30" },
      { name: "GDPR Assessment", status: "Active", expiryDate: "2026-12-01" }
    ],
    contacts: {
      name: "David Vance",
      email: "dvance@solarwinds.net.com"
    },
    subprocessors: 9,
    dataAssetsShared: "Internal Network Layouts, SNMP Credentials, IP Configurations"
  },
  {
    id: "v-5",
    name: "Salesforce CRM",
    industry: "Customer Relationship Management",
    riskScore: 42,
    riskLevel: "Medium",
    description: "Cloud-based customer management database, support ticketing, and marketing suite.",
    complianceStatus: {
      SOC2: "Compliant",
      GDPR: "Compliant",
      ISO27001: "Compliant"
    },
    activeBreaches: 0,
    riskFactors: [
      "Access control configuration complexity leading to customer misconfigurations",
      "High number of API endpoints exposed to public networks"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Active", expiryDate: "2027-03-10" },
      { name: "ISO 27001", status: "Active", expiryDate: "2027-05-18" },
      { name: "GDPR Assessment", status: "Active", expiryDate: "2027-01-11" }
    ],
    contacts: {
      name: "Robert Downey",
      email: "rdowney@salesforce.crm.com"
    },
    subprocessors: 45,
    dataAssetsShared: "Lead Data, Customer Interaction Logs, Sales Revenue Projections"
  },
  {
    id: "v-6",
    name: "Stripe Pay",
    industry: "Payment Gateway",
    riskScore: 28,
    riskLevel: "Low",
    description: "Online payment processing, merchant ledger, and API integrations for e-commerce.",
    complianceStatus: {
      SOC2: "Compliant",
      GDPR: "Compliant",
      ISO27001: "Compliant"
    },
    activeBreaches: 0,
    riskFactors: [
      "Extensive global payment routing latency dependencies"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Active", expiryDate: "2027-02-15" },
      { name: "ISO 27001", status: "Active", expiryDate: "2027-06-20" },
      { name: "PCI-DSS Level 1", status: "Active", expiryDate: "2027-01-31" }
    ],
    contacts: {
      name: "Clara Oswald",
      email: "coswald@stripe.pay.com"
    },
    subprocessors: 8,
    dataAssetsShared: "Credit Card Hashes, Merchant Financial details, PII"
  },
  {
    id: "v-7",
    name: "Slack Comm",
    industry: "Collaboration & Chat",
    riskScore: 54,
    riskLevel: "Medium",
    description: "Enterprise communication hub and team collaboration software.",
    complianceStatus: {
      SOC2: "Compliant",
      GDPR: "Compliant",
      ISO27001: "Partial"
    },
    activeBreaches: 0,
    riskFactors: [
      "OAuth tokens exposed via user phishing attacks",
      "Data retention policy enforcement overrides by admins"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Active", expiryDate: "2026-09-08" },
      { name: "ISO 27001", status: "Expired", expiryDate: "2026-04-18" },
      { name: "GDPR Assessment", status: "Active", expiryDate: "2026-10-15" }
    ],
    contacts: {
      name: "Peter Parker",
      email: "pparker@slack.comm.com"
    },
    subprocessors: 18,
    dataAssetsShared: "Internal Chat Logs, Shared Files, Employee Work Schedules"
  },
  {
    id: "v-8",
    name: "Microsoft Cloud",
    industry: "Cloud Infrastructure",
    riskScore: 48,
    riskLevel: "Medium",
    description: "Azure computing power, database servers, Active Directory, and infrastructure hosting.",
    complianceStatus: {
      SOC2: "Compliant",
      GDPR: "Compliant",
      ISO27001: "Compliant"
    },
    activeBreaches: 0,
    riskFactors: [
      "State-sponsored cyber group targeting global Azure AD tenants",
      "Complex network configuration panel showing visual settings drift"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Active", expiryDate: "2027-05-30" },
      { name: "ISO 27001", status: "Active", expiryDate: "2027-08-15" },
      { name: "FedRAMP High", status: "Active", expiryDate: "2027-03-20" }
    ],
    contacts: {
      name: "Bill Spencer",
      email: "bspencer@microsoft.cloud.com"
    },
    subprocessors: 60,
    dataAssetsShared: "Source Code Repository, App Backends, Customer Virtual Machines"
  },
  {
    id: "v-9",
    name: "Zoom Video",
    industry: "Video Conferencing",
    riskScore: 71,
    riskLevel: "High",
    description: "Cloud-based video meetings, screen sharing, webinar and enterprise chat room systems.",
    complianceStatus: {
      SOC2: "Partial",
      GDPR: "Non-Compliant",
      ISO27001: "Partial"
    },
    activeBreaches: 0,
    riskFactors: [
      "Inadequate end-to-end encryption keys distribution settings",
      "Meeting room ID brute-force vulnerability (Zoom-bombing risk)",
      "Vulnerability in desktop client local privilege escalation"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Expired", expiryDate: "2026-03-12" },
      { name: "ISO 27001", status: "Expired", expiryDate: "2026-02-18" },
      { name: "GDPR Assessment", status: "Expired", expiryDate: "2025-12-15" }
    ],
    contacts: {
      name: "Bruce Banner",
      email: "bbanner@zoom.video.com"
    },
    subprocessors: 11,
    dataAssetsShared: "Video and Audio Streams, Transcript Texts, Chat History"
  },
  {
    id: "v-10",
    name: "HashiCorp Vault",
    industry: "Secrets Management",
    riskScore: 31,
    riskLevel: "Low",
    description: "Secrets management, encryption key protection, and dynamic system credential generation.",
    complianceStatus: {
      SOC2: "Compliant",
      GDPR: "Compliant",
      ISO27001: "Compliant"
    },
    activeBreaches: 0,
    riskFactors: [
      "Access control policies requires periodic manual cleanups"
    ],
    certifications: [
      { name: "SOC 2 Type II", status: "Active", expiryDate: "2027-04-20" },
      { name: "ISO 27001", status: "Active", expiryDate: "2027-07-01" }
    ],
    contacts: {
      name: "Tony Stark",
      email: "tstark@hashicorp.vault.com"
    },
    subprocessors: 5,
    dataAssetsShared: "System Master Password Hashes, API Tokens, SSH keys"
  }
];

export const mockRecentActivities = [
  {
    id: "act-1",
    vendorId: "v-2",
    vendorName: "Snowflake Data",
    type: "critical",
    content: "AI detected 15 unauthorized administrator credential sets exposed on dark web repositories.",
    timestamp: "10 mins ago"
  },
  {
    id: "act-2",
    vendorId: "v-1",
    vendorName: "CrowdStrike Sec",
    type: "warning",
    content: "Active zero-day alert issued for endpoint client software. Patch release scheduled.",
    timestamp: "1 hour ago"
  },
  {
    id: "act-3",
    vendorId: "v-5",
    vendorName: "Salesforce CRM",
    type: "success",
    content: "Successfully renewed SOC 2 Type II certification with 0 exceptions recorded in audit report.",
    timestamp: "5 hours ago"
  },
  {
    id: "act-4",
    vendorId: "v-7",
    vendorName: "Slack Comm",
    type: "info",
    content: "Initiated automated compliance scan for newly added third-party bot integrations.",
    timestamp: "1 day ago"
  },
  {
    id: "act-5",
    vendorId: "v-9",
    vendorName: "Zoom Video",
    type: "critical",
    content: "GDPR compliance status degraded to Non-Compliant due to data transfer policy violations.",
    timestamp: "2 days ago"
  },
  {
    id: "act-6",
    vendorId: "v-10",
    vendorName: "HashiCorp Vault",
    type: "success",
    content: "Passed quarterly ISO 27001 surveillance audit without external auditor recommendations.",
    timestamp: "4 days ago"
  }
];

export const mockExpiryAlerts = [
  {
    id: "exp-1",
    vendorName: "Zoom Video",
    certName: "SOC 2 Type II",
    expiryDays: -100, // Expired
    status: "expired",
    expiryDate: "2026-03-12"
  },
  {
    id: "exp-2",
    vendorName: "Snowflake Data",
    certName: "GDPR Audit Assessment",
    expiryDays: -19, // Expired
    status: "expired",
    expiryDate: "2026-06-01"
  },
  {
    id: "exp-3",
    vendorName: "CrowdStrike Sec",
    certName: "GDPR Assessment",
    expiryDays: 71, // Expiring soon
    status: "warning",
    expiryDate: "2026-08-30"
  },
  {
    id: "exp-4",
    vendorName: "Slack Comm",
    certName: "ISO 27001",
    expiryDays: -63, // Expired
    status: "expired",
    expiryDate: "2026-04-18"
  },
  {
    id: "exp-5",
    vendorName: "SolarWinds Net",
    certName: "SOC 2 Type II",
    expiryDays: 22, // Expiring soon
    status: "critical",
    expiryDate: "2026-07-12"
  }
];

export const mockContractAIContracts = [
  {
    id: "c-1",
    docName: "CloudServices_Master_Agreement_2026.pdf",
    vendorName: "Snowflake Data",
    uploadDate: "2026-05-15",
    aiReviewStatus: "Flagged",
    overallRisk: "Critical",
    clauses: [
      {
        clauseText: "Section 12.4: Limit of Liability is capped at $5,000 for any data leakage incident, regardless of negligence level.",
        riskSeverity: "Critical",
        riskExplanation: "Extremely low liability ceiling that fails to protect against costly cyber data breaches.",
        recommendedFix: "Renegotiate to at least $10,000,000 or 12 months fees, whichever is higher, and exclude data breaches from the liability cap entirely."
      },
      {
        clauseText: "Section 14.8: Vendor reserves the right to share aggregated telemetry metadata with undisclosed partners without notice.",
        riskSeverity: "Moderate",
        riskExplanation: "Violates internal bank policies regarding data leakage and subprocessor audits.",
        recommendedFix: "Require customer approval and explicit details on who the partners are before data sharing is permitted."
      },
      {
        clauseText: "Section 9.2: Vendor has 72 hours from confirmation of incident to notify client of any security breach.",
        riskSeverity: "Low",
        riskExplanation: "Should ideally be 24-48 hours under SOC Gen internal standard operating procedures.",
        recommendedFix: "Request modification of notification timeline to 'within 24 hours of discovery of incident'."
      }
    ]
  },
  {
    id: "c-2",
    docName: "MFA_Provider_SLA_CrowdStrike.pdf",
    vendorName: "CrowdStrike Sec",
    uploadDate: "2026-06-10",
    aiReviewStatus: "Passed with Warnings",
    overallRisk: "Moderate",
    clauses: [
      {
        clauseText: "Section 5.3: SLA availability target is set to 99.5% excluding planned maintenance intervals.",
        riskSeverity: "Moderate",
        riskExplanation: "99.5% availability permits up to 43 hours of downtime annually, which is unacceptable for enterprise identity gateways.",
        recommendedFix: "Negotiate service level agreements to at least 99.99% availability."
      },
      {
        clauseText: "Section 8.1: Auditing files are deleted automatically after 30 days.",
        riskSeverity: "Low",
        riskExplanation: "Auditing compliance requirements dictate maintaining audit access trails for 90 days minimum.",
        recommendedFix: "Increase log retention schedule to 90 days or support exporting to a customer-controlled SIEM."
      }
    ]
  },
  {
    id: "c-3",
    docName: "Stripe_Merchant_Service_Level_V3.pdf",
    vendorName: "Stripe Pay",
    uploadDate: "2026-06-18",
    aiReviewStatus: "Approved",
    overallRisk: "Low",
    clauses: [
      {
        clauseText: "Section 21.2: Customer data will be processed strictly in accordance with GDPR and PCI-DSS requirements.",
        riskSeverity: "Low",
        riskExplanation: "Aligned with industry standards.",
        recommendedFix: "No changes needed."
      }
    ]
  }
];

// Data structure helper for Recharts
export const getRiskDistributionData = (vendors) => {
  const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  vendors.forEach(v => {
    if (counts[v.riskLevel] !== undefined) {
      counts[v.riskLevel]++;
    }
  });
  return [
    { name: "Low", value: counts.Low, color: "#34d399" },
    { name: "Medium", value: counts.Medium, color: "#fbbf24" },
    { name: "High", value: counts.High, color: "#fb923c" },
    { name: "Critical", value: counts.Critical, color: "#f87171" }
  ];
};

export const getComplianceStatusData = (vendors) => {
  let soc2Count = 0, gdprCount = 0, isoCount = 0;
  vendors.forEach(v => {
    if (v.complianceStatus.SOC2 === "Compliant") soc2Count++;
    if (v.complianceStatus.GDPR === "Compliant") gdprCount++;
    if (v.complianceStatus.ISO27001 === "Compliant") isoCount++;
  });
  return [
    { name: "SOC 2 Type II", compliant: soc2Count, partial: vendors.length - soc2Count, amt: vendors.length },
    { name: "GDPR Compliance", compliant: gdprCount, partial: vendors.length - gdprCount, amt: vendors.length },
    { name: "ISO 27001 Audit", compliant: isoCount, partial: vendors.length - isoCount, amt: vendors.length }
  ];
};

export const mockRiskHeatmap = [
  { likelihood: "High", impact: "High", count: 2, vendors: ["Snowflake Data", "Zoom Video"] },
  { likelihood: "High", impact: "Medium", count: 1, vendors: ["CrowdStrike Sec"] },
  { likelihood: "Medium", impact: "High", count: 1, vendors: ["SolarWinds Net"] },
  { likelihood: "Medium", impact: "Medium", count: 2, vendors: ["Slack Comm", "Salesforce CRM"] },
  { likelihood: "Low", impact: "High", count: 1, vendors: ["Microsoft Cloud"] },
  { likelihood: "Low", impact: "Low", count: 3, vendors: ["Auth0 Auth", "Stripe Pay", "HashiCorp Vault"] }
];
