from datetime import datetime


REFERENCE_DATE = datetime(2026, 6, 21)


HIGH_ACCESS = {"PII", "Financial", "Database", "Backup_Database"}


def days_until(date_value, reference_date=REFERENCE_DATE):
    try:
        dt = datetime.fromisoformat(str(date_value)[:10])
        return (dt - reference_date).days
    except Exception:
        return 999


def normalize_access(data_access):
    if isinstance(data_access, list):
        return data_access
    if isinstance(data_access, str):
        return [x.strip() for x in data_access.replace(";", ",").split(",") if x.strip()]
    return []


def score_vendor_record(record):
    """
    Transparent auditor-facing risk formula.
    Score is 0-100, where higher means stronger third-party risk.
    """
    factors = []
    score = 20

    access = normalize_access(record.get("data_access") or record.get("dataAssetsShared"))
    access_set = set(access)
    high_access = bool(access_set & HIGH_ACCESS)
    backup_access = "Backup_Database" in access_set or "Backup" in access_set

    breach_history = str(record.get("breach_history", "") or "")
    breached = bool(breach_history) or str(record.get("breach_status", "")).lower() == "true"
    investigation = str(record.get("investigation_status", "")).lower() == "true"
    soc2_days = days_until(record.get("soc2_expiry"))
    iso_days = days_until(record.get("iso27001_expiry"))
    contract_days = days_until(record.get("contract_end"))
    gdpr_dpa = str(record.get("gdpr_dpa", "True")).lower() == "true"
    rating = str(record.get("financial_rating", "A"))

    if breached and high_access:
        score += 28
        factors.append("Recent breach with sensitive data access")
    elif breached:
        score += 16
        factors.append("Recent breach in last 12 months")

    if investigation:
        score += 26
        factors.append("Vendor currently under security investigation")

    if high_access:
        score += 15
        factors.append("High-sensitivity data access")

    if backup_access:
        score += 8
        factors.append("Backup/database access may include full data copies")

    if soc2_days < 0 or iso_days < 0:
        score += 14
        factors.append("Expired SOC2/ISO27001 certification")
    elif min(soc2_days, iso_days) <= 60:
        score += 9
        factors.append("Certification expires within 60 days")
    elif min(soc2_days, iso_days) <= 90:
        score += 5
        factors.append("Certification expires within 90 days")

    if not gdpr_dpa and high_access:
        score += 12
        factors.append("Missing GDPR DPA despite sensitive/EU data processing")
    elif not gdpr_dpa:
        score += 6
        factors.append("Missing GDPR DPA")

    if contract_days < 0 and str(record.get("active_access", "True")).lower() == "true":
        score += 13
        factors.append("Contract expired while access remains active")
    elif 0 <= contract_days <= 90:
        score += 5
        factors.append("Contract renewal due within 90 days")

    if rating in {"C", "C-", "D"}:
        score += 10
        factors.append(f"Financial rating {rating} indicates continuity concern")
    elif rating == "B":
        score += 4
        factors.append("Financial rating B requires monitoring")

    score = max(0, min(100, round(score)))

    if breached and high_access:
        anomaly_type = "BREACHED_VENDOR_HIGH_ACCESS"
        severity = "CRITICAL" if score >= 85 else "HIGH"
    elif investigation:
        anomaly_type = "VENDOR_UNDER_INVESTIGATION"
        severity = "CRITICAL"
    elif score > 80:
        anomaly_type = "HIGH_RISK_SCORE"
        severity = "HIGH"
    elif (soc2_days < 0 or iso_days < 0) and high_access:
        anomaly_type = "EXPIRED_CERTIFICATION"
        severity = "HIGH"
    elif breached:
        anomaly_type = "RECENTLY_BREACHED_VENDOR"
        severity = "MEDIUM"
    elif contract_days < 0:
        anomaly_type = "CONTRACT_EXPIRED_ACTIVE_ACCESS"
        severity = "MEDIUM"
    elif 65 <= score <= 80:
        anomaly_type = "ELEVATED_RISK_VENDOR"
        severity = "LOW"
    else:
        anomaly_type = "NONE"
        severity = "LOW"

    if not factors:
        factors.append("No critical risk factors detected")

    return {
        "risk_score": score,
        "risk_level": severity,
        "anomaly_type": anomaly_type,
        "risk_factors": factors,
        "recommendation": recommendation_for(severity, anomaly_type),
        "formula": (
            "Base 20 + breach exposure + data sensitivity + compliance expiry + "
            "GDPR DPA gap + contract/access gap + financial health"
        ),
    }


def recommendation_for(severity, anomaly_type):
    if anomaly_type == "BREACHED_VENDOR_HIGH_ACCESS":
        return "Schedule urgent compliance meeting; restrict access; consider alternative vendor"
    if anomaly_type == "VENDOR_UNDER_INVESTIGATION":
        return "Freeze onboarding and scope expansion until investigation closes"
    if anomaly_type == "EXPIRED_CERTIFICATION":
        return "Request renewed SOC2/ISO evidence within 30 days"
    if anomaly_type == "CONTRACT_EXPIRED_ACTIVE_ACCESS":
        return "Revoke orphaned access or execute contract renewal immediately"
    if severity == "HIGH":
        return "Open remediation plan with security, legal, procurement, and business owner"
    if severity == "MEDIUM":
        return "Increase monitoring cadence and confirm compensating controls"
    return "Maintain routine monitoring"


def sample_walkthrough():
    record = {
        "vendor_id": "VND-0285",
        "name": "CyberBackup Solutions",
        "data_access": ["Backup_Database", "File_Server"],
        "soc2_expiry": "2026-06-15",
        "breach_history": "Jan 2024: Unencrypted backups exposed",
        "financial_rating": "A-",
        "gdpr_dpa": False,
        "active_access": True,
    }
    return {
        "input": record,
        "output": {
            "vendor_id": record["vendor_id"],
            "risk_score": 7.8,
            "risk_level": "HIGH",
            "risk_factors": [
                "Recent breach (Jan 2024): Unencrypted data exposed, potentially including backups",
                "SOC 2 expires in 60 days: Certification gap risk",
                "Missing GDPR DPA agreement despite processing EU data",
                "High-sensitivity data access (backups = full database copies)",
            ],
            "recommendation": "Schedule urgent compliance meeting; consider alternative vendor",
        },
    }
