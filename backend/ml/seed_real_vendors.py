import os
from datetime import datetime, timedelta

import pandas as pd


KNOWN_VENDOR_COUNT = 400
TRACKED_VENDOR_COUNT = 400
GROUND_TRUTH_HIGH_RISK_COUNT = 50


VENDOR_TYPES = ["Cloud", "Payment", "MSP", "Integration", "Security", "Contractor", "Backup", "HR"]
DATA_ACCESS = ["ReadOnly", "Employee", "Database", "PII", "Financial", "Backup_Database"]
FINANCIAL_RATINGS = ["A+", "A", "A-", "B", "C", "D"]


FEATURED_VENDORS = [
    {
        "name": "CyberBackup Solutions",
        "type": "Backup",
        "data": "Backup_Database",
        "score": 78,
        "rating": "A-",
        "anomaly": "BREACHED_VENDOR_HIGH_ACCESS",
        "severity": "HIGH",
        "breach": "Jan 2024: Unencrypted backups exposed",
        "gdpr_dpa": "False",
        "issues": "Recent breach; SOC 2 expires in 60 days; Missing GDPR DPA; Backup database access",
        "recommendation": "Schedule urgent compliance meeting; consider alternative vendor",
    },
    {
        "name": "LegacyIntegration Corp",
        "type": "Integration",
        "data": "Financial",
        "score": 75,
        "rating": "C",
        "anomaly": "HIGH_RISK_SCORE",
        "severity": "HIGH",
        "breach": "",
        "gdpr_dpa": "True",
        "issues": "Financial rating C; no SOC 2; contract SLA vague on breach notification; read-only access not enforced",
        "recommendation": "Renegotiate contract terms or replacement",
    },
    {
        "name": "DevOps Contractor Team",
        "type": "Contractor",
        "data": "Database",
        "score": 69,
        "rating": "B",
        "anomaly": "CONTRACT_EXPIRED_ACTIVE_ACCESS",
        "severity": "MEDIUM",
        "breach": "",
        "gdpr_dpa": "True",
        "issues": "Individual contractor access; background check due; contract ended while access remains active",
        "recommendation": "Extend access review; contract renewal decision",
    },
    {
        "name": "SolarWinds",
        "type": "MSP",
        "data": "Database",
        "score": 95,
        "rating": "C",
        "anomaly": "BREACHED_VENDOR_HIGH_ACCESS",
        "severity": "CRITICAL",
        "breach": "Recent supply-chain compromise detected",
        "gdpr_dpa": "True",
        "issues": "Recent breach; privileged infrastructure access; weak financial outlook",
        "recommendation": "Trigger incident response playbook and executive review",
    },
    {
        "name": "Kaseya",
        "type": "MSP",
        "data": "PII",
        "score": 92,
        "rating": "C",
        "anomaly": "VENDOR_UNDER_INVESTIGATION",
        "severity": "CRITICAL",
        "breach": "Security investigation opened by customer assurance team",
        "gdpr_dpa": "True",
        "issues": "Vendor under active investigation; MSP access; sensitive customer data",
        "recommendation": "Freeze scope expansion until investigation closes",
    },
]


def _dates_for_anomaly(ref_date, anomaly, idx):
    safe = (ref_date + timedelta(days=365 + idx % 120)).strftime("%Y-%m-%d")
    renew_soon = (ref_date + timedelta(days=30 + idx % 30)).strftime("%Y-%m-%d")
    expired = (ref_date - timedelta(days=15 + idx % 60)).strftime("%Y-%m-%d")
    contract_active = (ref_date + timedelta(days=180 + idx % 200)).strftime("%Y-%m-%d")
    contract_expired = (ref_date - timedelta(days=10 + idx % 45)).strftime("%Y-%m-%d")

    soc2 = safe
    iso = safe
    contract_end = contract_active

    if anomaly == "EXPIRED_CERTIFICATION":
        soc2 = expired
    elif anomaly == "BREACHED_VENDOR_HIGH_ACCESS" and idx == 1:
        soc2 = (ref_date + timedelta(days=60)).strftime("%Y-%m-%d")
    elif anomaly == "CONTRACT_EXPIRED_ACTIVE_ACCESS":
        contract_end = contract_expired
    elif anomaly == "ELEVATED_RISK_VENDOR":
        soc2 = renew_soon

    return soc2, iso, contract_end


def _row_from_vendor(vendor_id, vendor, ref_date, idx, high_risk_truth):
    anomaly = vendor["anomaly"]
    soc2, iso, contract_end = _dates_for_anomaly(ref_date, anomaly, idx)
    breach_status = "True" if anomaly in ("BREACHED_VENDOR_HIGH_ACCESS", "RECENTLY_BREACHED_VENDOR") else "False"
    contract_start = (ref_date - timedelta(days=365 + idx % 120)).strftime("%Y-%m-%d")

    registry = {
        "vendor_id": vendor_id,
        "vendor_name": vendor["name"],
        "vendor_type": vendor["type"],
        "data_access": vendor["data"],
        "soc2_expiry": soc2,
        "iso27001_expiry": iso,
        "breach_status": breach_status,
        "risk_score": vendor["score"],
        "annual_spend": 90000 + (idx * 37500) % 3200000,
        "contract_start": contract_start,
        "contract_end": contract_end,
        "financial_rating": vendor["rating"],
        "gdpr_dpa": vendor.get("gdpr_dpa", "True"),
        "breach_history": vendor.get("breach", ""),
        "investigation_status": "True" if anomaly == "VENDOR_UNDER_INVESTIGATION" else "False",
        "active_access": "True",
        "known_vendor_count": KNOWN_VENDOR_COUNT,
        "issues": vendor.get("issues", ""),
        "recommendation": vendor.get("recommendation", ""),
    }

    labels = {
        "vendor_id": vendor_id,
        "is_anomaly": 0 if anomaly == "NONE" else 1,
        "anomaly_type": anomaly,
        "severity": vendor["severity"],
        "expired_certifications": "True" if anomaly == "EXPIRED_CERTIFICATION" else "False",
        "ground_truth_high_risk": "True" if high_risk_truth else "False",
        "explanation": vendor.get("issues", "Standard vendor profile"),
    }
    return registry, labels


def _generated_vendor(idx):
    high_patterns = [
        ("BREACHED_VENDOR_HIGH_ACCESS", "CRITICAL", 86, "C", "PII"),
        ("VENDOR_UNDER_INVESTIGATION", "CRITICAL", 84, "C", "Financial"),
        ("HIGH_RISK_SCORE", "HIGH", 82, "B", "Database"),
        ("EXPIRED_CERTIFICATION", "HIGH", 73, "B", "PII"),
    ]
    medium_patterns = [
        ("RECENTLY_BREACHED_VENDOR", "MEDIUM", 61, "B", "ReadOnly"),
        ("CONTRACT_EXPIRED_ACTIVE_ACCESS", "MEDIUM", 58, "B", "Database"),
        ("ELEVATED_RISK_VENDOR", "LOW", 67, "A-", "Employee"),
    ]

    if idx <= 60:
        anomaly, severity, base_score, rating, data = high_patterns[(idx - 1) % len(high_patterns)]
    elif idx <= 320:
        anomaly, severity, base_score, rating, data = medium_patterns[(idx - 61) % len(medium_patterns)]
    else:
        anomaly, severity, base_score, rating, data = ("NONE", "LOW", 18 + idx % 28, "A", DATA_ACCESS[idx % 3])

    return {
        "name": f"{VENDOR_TYPES[idx % len(VENDOR_TYPES)]} Partner {idx:03d}",
        "type": VENDOR_TYPES[idx % len(VENDOR_TYPES)],
        "data": data,
        "score": min(99, base_score + idx % 7),
        "rating": rating,
        "anomaly": anomaly,
        "severity": severity,
        "breach": "Incident disclosed in last 12 months" if "BREACHED" in anomaly else "",
        "gdpr_dpa": "False" if idx % 11 == 0 or anomaly == "EXPIRED_CERTIFICATION" else "True",
        "issues": "",
        "recommendation": "",
    }


def generate_seed_data():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    registry_path = os.path.join(base_dir, "vendor_registry.csv")
    labels_path = os.path.join(base_dir, "vendor_labels.csv")

    ref_date = datetime(2026, 6, 21)
    registry_rows = []
    labels_rows = []

    all_vendors = FEATURED_VENDORS[:]
    for idx in range(len(FEATURED_VENDORS) + 1, TRACKED_VENDOR_COUNT + 1):
        all_vendors.append(_generated_vendor(idx))

    for i, vendor in enumerate(all_vendors, start=1):
        vendor_id = f"VND-{i:04d}"
        high_risk_truth = i <= GROUND_TRUTH_HIGH_RISK_COUNT
        registry, labels = _row_from_vendor(vendor_id, vendor, ref_date, i, high_risk_truth)
        registry_rows.append(registry)
        labels_rows.append(labels)

    pd.DataFrame(registry_rows).to_csv(registry_path, index=False)
    pd.DataFrame(labels_rows).to_csv(labels_path, index=False)

    print(f"Generated {len(registry_rows)} tracked vendors out of {KNOWN_VENDOR_COUNT} known vendors.")
    print(f"Ground truth high-risk labels: {GROUND_TRUTH_HIGH_RISK_COUNT}")
    print(f"Vendor coverage: {len(registry_rows) / KNOWN_VENDOR_COUNT * 100:.1f}%")


if __name__ == "__main__":
    generate_seed_data()
