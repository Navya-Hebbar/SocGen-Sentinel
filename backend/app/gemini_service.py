"""
Gemini AI Service — Contract Analysis, Risk Narration, Recommendations.
Uses real Gemini API with intelligent mock fallback.
"""
import os
import json

# Custom lightweight .env file loader to avoid python-dotenv installation dependency
def _load_env():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_path = os.path.join(base_dir, ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#"):
                        continue
                    if "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip('"').strip("'")
                        os.environ[key] = val
        except Exception as e:
            print(f"Warning: Failed to parse .env file: {e}")

_load_env()

# Try to import Gemini
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")


def _init_gemini():
    """Initialize Gemini with API key."""
    if GEMINI_AVAILABLE and GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        return True
    return False


def _call_gemini(prompt: str) -> str:
    """Call Gemini API with fallback."""
    if _init_gemini():
        try:
            model = genai.GenerativeModel("gemini-2.0-flash")
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Gemini API error: {e}, using mock fallback")
    return None


# ==================== CONTRACT ANALYZER ====================

def analyze_contract(file_content: str = None, filename: str = "contract.pdf") -> dict:
    """
    Analyze a vendor contract using Gemini or intelligent mock.
    Extracts key clauses and identifies risks.
    """
    prompt = f"""You are a legal AI assistant specializing in vendor contract risk analysis for financial institutions.

Analyze this vendor contract document named "{filename}" and extract the following in JSON format:
{{
  "vendor_name": "extracted vendor name",
  "contract_start": "YYYY-MM-DD",
  "contract_end": "YYYY-MM-DD",
  "breach_notification": "clause details",
  "data_ownership": "who owns the data",
  "gdpr_terms": true/false,
  "sla_uptime": "percentage",
  "indemnity_limit": "dollar amount or description",
  "flagged_clauses": [
    {{
      "clause_text": "exact clause text",
      "risk_severity": "Critical/Moderate/Low",
      "risk_explanation": "why this is risky",
      "recommended_fix": "what to do about it"
    }}
  ],
  "overall_risk": "Critical/Moderate/Low",
  "summary": "2-3 sentence summary of the contract risk posture"
}}

{"Document content: " + file_content[:3000] if file_content else "No document content available. Generate a realistic analysis based on the filename."}"""

    result = _call_gemini(prompt)
    if result:
        try:
            # Try to parse JSON from Gemini response
            json_start = result.find("{")
            json_end = result.rfind("}") + 1
            if json_start >= 0 and json_end > json_start:
                return json.loads(result[json_start:json_end])
        except json.JSONDecodeError:
            pass

    # Mock fallback with realistic data
    return _mock_contract_analysis(filename)


def _mock_contract_analysis(filename: str) -> dict:
    """Generate realistic mock contract analysis."""
    name_lower = filename.lower()

    # Determine vendor type from filename
    if any(k in name_lower for k in ["cloud", "aws", "azure", "gcp"]):
        vendor_type = "Cloud Infrastructure"
    elif any(k in name_lower for k in ["payment", "stripe", "paypal"]):
        vendor_type = "Payment Processing"
    elif any(k in name_lower for k in ["security", "cyber"]):
        vendor_type = "Security Services"
    else:
        vendor_type = "Technology Services"

    return {
        "vendor_name": filename.replace(".pdf", "").replace(".docx", "").replace("_", " ").title(),
        "contract_start": "2024-01-15",
        "contract_end": "2027-01-14",
        "breach_notification": "72 hours written notice to data controller",
        "data_ownership": "Customer retains full ownership; vendor has processing rights only",
        "gdpr_terms": True,
        "sla_uptime": "99.9%",
        "indemnity_limit": "$2,000,000 aggregate annual cap",
        "flagged_clauses": [
            {
                "clause_text": "Section 11.2: Vendor liability for data breaches is limited to fees paid in the preceding 3 months.",
                "risk_severity": "Critical",
                "risk_explanation": "Extremely low liability cap fails to protect against costly breach notification, forensics, and regulatory fine exposure that can exceed $10M.",
                "recommended_fix": "Renegotiate to exclude cyber and data breach events from the general limitation of liability. Set a minimum floor of $5,000,000 for data breach indemnification."
            },
            {
                "clause_text": "Section 8.4: Service Provider may utilize subprocessors without prior written consent, subject to maintaining equivalent security controls.",
                "risk_severity": "Critical",
                "risk_explanation": "Lack of prior consent mechanism for subprocessor engagement violates GDPR Article 28(2) and increases supply chain attack surface.",
                "recommended_fix": "Require 30-day prior written notification and right to object for any new subprocessor. Maintain an auditable subprocessor registry."
            },
            {
                "clause_text": "Section 15.3: Either party may terminate without cause upon 60 days written notice.",
                "risk_severity": "Moderate",
                "risk_explanation": "60-day termination window is insufficient for critical infrastructure migration and may cause operational disruption.",
                "recommended_fix": "Extend termination without cause to 180 days with mandatory transition assistance period and data return obligations."
            },
        ],
        "overall_risk": "Critical",
        "summary": f"This {vendor_type} vendor contract contains critical liability and subprocessor risks. The breach liability cap is dangerously low for an organization handling sensitive financial data. Immediate renegotiation of Sections 11.2 and 8.4 is recommended before contract renewal."
    }


# ==================== RISK NARRATOR ====================

def narrate_risk(vendor_data: dict) -> str:
    """
    Generate business-language risk narrative for a vendor.
    Uses Gemini or template-based fallback.
    """
    prompt = f"""You are a cybersecurity risk analyst writing executive briefings for the CISO.

Given this vendor risk profile, write a concise 3-4 sentence risk narrative in professional business language.
Do NOT use markdown formatting. Write plain text paragraphs.

Vendor Profile:
- Name: {vendor_data.get('name', 'Unknown')}
- Risk Score: {vendor_data.get('riskScore', 50)}/100
- Severity: {vendor_data.get('severity', 'MEDIUM')}
- Breach Status: {"Active breach detected" if vendor_data.get('breachStatus', False) else "No active breaches"}
- Data Access: {vendor_data.get('dataAssetsShared', 'Standard')}
- SOC2 Status: {vendor_data.get('complianceStatus', {}).get('SOC2', 'Unknown')}
- ISO 27001 Status: {vendor_data.get('complianceStatus', {}).get('ISO27001', 'Unknown')}
- Days until SOC2 expiry: {vendor_data.get('daysUntilSoc2Expiry', 'N/A')}
- Days until contract end: {vendor_data.get('daysUntilContractEnd', 'N/A')}
- Annual Spend: ${vendor_data.get('annualSpend', 0):,}
- Financial Rating: {vendor_data.get('financialRating', 'N/A')}

Write the narrative focusing on: what the risk is, why it matters, and urgency level."""

    result = _call_gemini(prompt)
    if result:
        return result.strip()

    # Template fallback
    return _mock_risk_narrative(vendor_data)


def _mock_risk_narrative(v: dict) -> str:
    """Generate template-based risk narrative."""
    name = v.get("name", "This vendor")
    score = v.get("riskScore", 50)
    severity = v.get("severity", "MEDIUM")
    breach = v.get("breachStatus", False)
    data = v.get("dataAssetsShared", "standard")
    soc2 = v.get("complianceStatus", {}).get("SOC2", "Unknown")
    iso = v.get("complianceStatus", {}).get("ISO27001", "Unknown")
    soc2_days = v.get("daysUntilSoc2Expiry", 999)
    contract_days = v.get("daysUntilContractEnd", 999)
    spend = v.get("annualSpend", 0)

    parts = []

    if breach:
        parts.append(f"{name} has experienced a recent security breach and maintains access to {data} data assets, creating an immediate exposure vector.")
    else:
        parts.append(f"{name} currently operates with a risk score of {score}/100, classified as {severity} severity.")

    if soc2 == "Non-Compliant":
        if soc2_days < 0:
            parts.append(f"SOC 2 Type II certification has expired, creating a critical compliance gap.")
        elif soc2_days <= 90:
            parts.append(f"SOC 2 certification expires in {soc2_days} days — renewal action required immediately.")
    
    if iso == "Non-Compliant":
        parts.append(f"ISO 27001 certification is non-compliant, indicating gaps in information security management controls.")

    if contract_days <= 90 and contract_days > 0:
        parts.append(f"Contract expires in {contract_days} days. Renewal assessment and renegotiation should be prioritized.")

    if severity in ("CRITICAL", "HIGH"):
        parts.append(f"Risk Level: {severity}. Immediate executive review and remediation planning recommended.")
    else:
        parts.append(f"Risk Level: {severity}. Continue routine monitoring with scheduled compliance reviews.")

    return " ".join(parts)


# ==================== RECOMMENDATION ENGINE ====================

def generate_recommendations(vendor_data: dict) -> list:
    """
    Generate actionable recommendations for a vendor.
    Uses Gemini or rule-based fallback.
    """
    prompt = f"""You are a third-party risk management advisor for a financial institution.

Given this vendor profile, generate exactly 5 specific, actionable recommendations.
Return as a JSON array of objects with "action", "priority" (Critical/High/Medium/Low), and "timeline" fields.

Vendor: {vendor_data.get('name', 'Unknown')}
Risk Score: {vendor_data.get('riskScore', 50)}/100
Severity: {vendor_data.get('severity', 'MEDIUM')}
Breach: {vendor_data.get('breachStatus', False)}
SOC2: {vendor_data.get('complianceStatus', {}).get('SOC2', 'Unknown')}
ISO: {vendor_data.get('complianceStatus', {}).get('ISO27001', 'Unknown')}
Data Access: {vendor_data.get('dataAssetsShared', 'Standard')}
SOC2 Expiry Days: {vendor_data.get('daysUntilSoc2Expiry', 999)}
Contract End Days: {vendor_data.get('daysUntilContractEnd', 999)}

Return only the JSON array, no other text."""

    result = _call_gemini(prompt)
    if result:
        try:
            json_start = result.find("[")
            json_end = result.rfind("]") + 1
            if json_start >= 0 and json_end > json_start:
                recs = json.loads(result[json_start:json_end])
                if isinstance(recs, list) and len(recs) > 0:
                    return recs
        except json.JSONDecodeError:
            pass

    return _mock_recommendations(vendor_data)


def _mock_recommendations(v: dict) -> list:
    """Generate rule-based recommendations."""
    recs = []
    severity = v.get("severity", "MEDIUM")
    breach = v.get("breachStatus", False)
    soc2 = v.get("complianceStatus", {}).get("SOC2", "Unknown")
    iso = v.get("complianceStatus", {}).get("ISO27001", "Unknown")
    gdpr = v.get("complianceStatus", {}).get("GDPR", "Unknown")
    soc2_days = v.get("daysUntilSoc2Expiry", 999)
    contract_days = v.get("daysUntilContractEnd", 999)
    data = v.get("dataAssetsShared", "Standard")

    if breach:
        recs.append({
            "action": "Initiate immediate incident response protocol. Isolate vendor network access and conduct forensic review of compromised data pathways.",
            "priority": "Critical",
            "timeline": "Immediate (0-24 hours)"
        })

    if soc2 == "Non-Compliant":
        recs.append({
            "action": "Request updated SOC 2 Type II audit report. If vendor cannot provide within 30 days, initiate vendor replacement evaluation.",
            "priority": "High",
            "timeline": "Within 30 days"
        })

    if iso == "Non-Compliant":
        recs.append({
            "action": "Require vendor to implement AES-256 encryption for all data at rest and in transit. Schedule ISO 27001 gap assessment.",
            "priority": "High",
            "timeline": "Within 45 days"
        })

    if gdpr == "Non-Compliant":
        recs.append({
            "action": "Draft and execute a GDPR-compliant Data Processing Agreement (DPA). Document all subprocessors with data access.",
            "priority": "High",
            "timeline": "Within 14 days"
        })

    if soc2_days <= 90 and soc2_days > 0:
        recs.append({
            "action": f"SOC2 certification expires in {soc2_days} days. Begin renewal coordination with vendor security team immediately.",
            "priority": "High",
            "timeline": f"Before expiry ({soc2_days} days)"
        })

    if contract_days <= 90 and contract_days > 0:
        recs.append({
            "action": f"Contract expires in {contract_days} days. Begin renewal negotiations with enhanced security requirements and updated SLA terms.",
            "priority": "Medium",
            "timeline": f"Within {max(14, contract_days - 30)} days"
        })

    if data in ("PII", "Financial"):
        recs.append({
            "action": "Conduct data access audit to verify principle of least privilege. Implement additional monitoring for sensitive data access patterns.",
            "priority": "Medium",
            "timeline": "Within 30 days"
        })

    if severity in ("CRITICAL", "HIGH"):
        recs.append({
            "action": "Schedule executive-level risk review meeting. Evaluate alternative vendor options to reduce single-source dependency risk.",
            "priority": "High",
            "timeline": "Within 7 days"
        })

    # Always include baseline
    recs.append({
        "action": "Maintain bi-annual security questionnaire cadence and continuous automated compliance certificate monitoring.",
        "priority": "Low",
        "timeline": "Ongoing"
    })

    return recs[:6]
