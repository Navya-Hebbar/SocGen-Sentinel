"""Generate static data.json from the ML model's processed vendor data for frontend fallback."""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from app.model import risk_model

print("Loading data and training model...")
risk_model.load_data()
risk_model.train()

print("Generating vendor data...")
vendors = risk_model.get_all_vendors_data()

# Generate recent activities from high-risk vendors
activities = []
for v in sorted(vendors, key=lambda x: x["riskScore"], reverse=True)[:10]:
    act_type = "breach" if v["breachStatus"] else "compliance"
    activities.append({
        "id": f"act-{v['id']}",
        "vendorName": v["name"],
        "type": act_type,
        "content": v["riskFactors"][0] if v["riskFactors"] else "Routine check",
        "timestamp": "Recent",
    })

# Generate sample contracts
contracts = [
    {
        "id": "c-sample-1",
        "docName": "SolarWinds_Vendor_Agreement_2026.pdf",
        "vendorName": "SolarWinds",
        "uploadDate": "2026-06-15",
        "aiReviewStatus": "Flagged",
        "overallRisk": "Critical",
        "clauses": [
            {
                "clauseText": "Section 11.2: Vendor liability for data breaches is limited to fees paid in the preceding 3 months.",
                "riskSeverity": "Critical",
                "riskExplanation": "Low liability cap fails to protect against costly breach notification and recovery expenses.",
                "recommendedFix": "Renegotiate to exclude cyber breaches from liability cap. Set minimum floor of $5,000,000."
            },
            {
                "clauseText": "Section 8.4: Service Provider may utilize subprocessors without prior written consent.",
                "riskSeverity": "Critical",
                "riskExplanation": "Violates GDPR Article 28(2) and increases supply chain attack surface.",
                "recommendedFix": "Require 30-day prior notification and right to object for any new subprocessor."
            }
        ]
    },
    {
        "id": "c-sample-2",
        "docName": "Stripe_Payment_MSA_2026.pdf",
        "vendorName": "Stripe",
        "uploadDate": "2026-06-10",
        "aiReviewStatus": "Passed with Warnings",
        "overallRisk": "Moderate",
        "clauses": [
            {
                "clauseText": "Section 4.1: Target SLA availability is set to 99.5% computed monthly.",
                "riskSeverity": "Moderate",
                "riskExplanation": "99.5% SLA permits over 3.6 hours of outage per month for payment processing.",
                "recommendedFix": "Renegotiate uptime target to 99.99% with service credits for SLA breaches."
            }
        ]
    }
]

data = {
    "vendors": vendors,
    "recentActivities": activities,
    "contracts": contracts,
    "complianceStandards": {
        "SOC2": [
            {"id": "req-s1", "name": "CC6.1 - Logical Access Control", "desc": "MFA, SSO, and endpoint protection must be active for all staff."},
            {"id": "req-s2", "name": "CC6.3 - Perimeter Defenses", "desc": "Vulnerability scanners and firewall rules must be reviewed monthly."},
            {"id": "req-s3", "name": "CC7.1 - Vulnerability Management", "desc": "Pen tests annually; critical findings patched within 30 days."}
        ],
        "ISO27001": [
            {"id": "req-i1", "name": "A.9.2 - User Access Mgmt", "desc": "Formal authorization process for privileged developer roles."},
            {"id": "req-i2", "name": "A.12.6 - Tech Vulnerabilities", "desc": "Patches cataloged and deployed systematically by severity."},
            {"id": "req-i3", "name": "A.10.1 - Cryptographic Controls", "desc": "Sensitive data encrypted at rest and in transit."}
        ],
        "GDPR": [
            {"id": "req-g1", "name": "Article 32 - Security of Processing", "desc": "Pseudo-anonymization and log auditing on user database assets."},
            {"id": "req-g2", "name": "Article 28 - Subprocessor Agreements", "desc": "Contracts must declare all downstream subprocessors."},
            {"id": "req-g3", "name": "Article 33 - Breach Notification", "desc": "Client notification within 72 hours of security incidents."}
        ],
        "PCI-DSS": [
            {"id": "req-p1", "name": "Req 3 - Protect Stored Data", "desc": "Cardholder data must be encrypted and access restricted."},
            {"id": "req-p2", "name": "Req 6 - Secure Systems", "desc": "Develop and maintain secure systems and applications."},
            {"id": "req-p3", "name": "Req 11 - Test Security", "desc": "Regularly test security systems and processes."}
        ]
    }
}

# Write to frontend public dir
frontend_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "public", "data.json")
with open(frontend_path, "w") as f:
    json.dump(data, f, indent=2)

print(f"Generated data.json with {len(vendors)} vendors")
print(f"Written to: {frontend_path}")
