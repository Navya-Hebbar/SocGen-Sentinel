"""
Feature Engineering Pipeline for Vendor Risk Assessment.
Transforms raw CSV vendor data into ML-ready features.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Reference date for computing day-offsets
REFERENCE_DATE = datetime(2026, 6, 21)

DATA_ACCESS_SENSITIVITY = {
    # Old scopes
    "PII": 5,
    "Financial": 4,
    "Database": 4,
    "Employee": 3,
    "Backup_Database": 5,
    "ReadOnly": 1,
    # New scopes
    "Public_Data": 1,
    "Internal_Data": 2,
    "Customer_PII": 5,
    "Financial_Data": 4,
    "All_Systems": 5
}

VENDOR_TYPE_MAP = {
    "Cloud": 1, "Payment": 2, "MSP": 3, "Integration": 4,
    "Security": 5, "Contractor": 6, "Backup": 7, "HR": 8,
    "Data_Provider": 9, "Software": 10, "Consulting": 11,
}

SEVERITY_MAP = {
    "CRITICAL": 3, "HIGH": 2, "MEDIUM": 1, "LOW": 0
}


def days_between(date_str: str, ref: datetime = REFERENCE_DATE) -> int:
    """Calculate days between a date string and reference date."""
    try:
        dt = pd.to_datetime(date_str)
        return (dt - ref).days
    except Exception:
        return 0

def extract_cert_expiry(cert_str: str, cert_name: str) -> str:
    """Extract expiry date for a specific certification from a pipe-separated string."""
    if pd.isna(cert_str) or not isinstance(cert_str, str):
        return None
    for item in cert_str.split('|'):
        parts = item.split(':')
        if len(parts) == 2 and parts[0].strip() == cert_name:
            return parts[1].strip()
    return None

def load_and_merge(registry_path: str, labels_path: str) -> pd.DataFrame:
    """Load both CSVs and merge on vendor_id."""
    registry = pd.read_csv(registry_path)
    labels = pd.read_csv(labels_path)
    
    # In new labels, the ID is record_id. If vendor_id is not in labels, try renaming record_id
    if "vendor_id" not in labels.columns and "record_id" in labels.columns:
        labels = labels.rename(columns={"record_id": "vendor_id"})
        
    df = registry.merge(labels, on="vendor_id", how="left")
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create ML features from raw vendor data.
    Returns DataFrame with both raw columns and engineered features.
    """
    features = df.copy()

    # --- Compliance Parsing ---
    features["soc2_expiry"] = features.get("compliance_certifications", "").apply(
        lambda x: extract_cert_expiry(x, "SOC2")
    )
    features["iso27001_expiry"] = features.get("compliance_certifications", "").apply(
        lambda x: extract_cert_expiry(x, "ISO27001")
    )
    features["gdpr_expiry"] = features.get("compliance_certifications", "").apply(
        lambda x: extract_cert_expiry(x, "GDPR")
    )
    
    # --- Date-based features ---
    features["days_until_soc2_expiry"] = features["soc2_expiry"].apply(
        lambda x: days_between(x) if x else -365
    )
    features["days_until_iso_expiry"] = features["iso27001_expiry"].apply(
        lambda x: days_between(x) if x else -365
    )
    features["days_until_contract_end"] = features.get("contract_end_date", features.get("contract_end")).apply(
        lambda x: days_between(x) if x else 0
    )

    # --- Boolean features ---
    features["soc2_expired"] = (features["days_until_soc2_expiry"] < 0).astype(int)
    features["iso_expired"] = (features["days_until_iso_expiry"] < 0).astype(int)
    features["contract_expired"] = (features["days_until_contract_end"] < 0).astype(int)
    features["soc2_expiring_soon"] = (
        (features["days_until_soc2_expiry"] >= 0) &
        (features["days_until_soc2_expiry"] <= 90)
    ).astype(int)
    features["iso_expiring_soon"] = (
        (features["days_until_iso_expiry"] >= 0) &
        (features["days_until_iso_expiry"] <= 90)
    ).astype(int)
    features["contract_expiring_soon"] = (
        (features["days_until_contract_end"] >= 0) &
        (features["days_until_contract_end"] <= 90)
    ).astype(int)
    features["has_soc2"] = (features["soc2_expired"] == 0).astype(int)
    features["has_iso"] = (features["iso_expired"] == 0).astype(int)

    # --- Breach features ---
    def parse_breach_status(status):
        s = str(status).strip()
        if s == "Recent_Breach_12mo": return 1
        elif s == "True": return 1
        return 0

    def parse_under_investigation(status):
        s = str(status).strip()
        if s == "Under_Investigation": return 1
        elif s == "True" and features.get("investigation_status") is not None: return 1 # fallback
        return 0

    features["breached_recently"] = features.get("breach_status", pd.Series(["False"]*len(features))).apply(parse_breach_status)
    features["under_investigation"] = features.get("breach_status", pd.Series(["False"]*len(features))).apply(parse_under_investigation)
    features["missing_gdpr_dpa"] = features["gdpr_expiry"].apply(lambda x: 1 if x is None else 0)

    # --- Categorical encoding ---
    features["data_sensitivity"] = features.get("data_access_scope", features.get("data_access")).map(
        DATA_ACCESS_SENSITIVITY
    ).fillna(2)

    features["high_data_access"] = (features["data_sensitivity"] >= 4).astype(int)

    features["vendor_type_numeric"] = features["vendor_type"].map(
        VENDOR_TYPE_MAP
    ).fillna(5)

    # --- Spend features ---
    features["annual_spend_normalized"] = (
        features["annual_spend"] / features["annual_spend"].max()
    )
    features["high_spend"] = (features["annual_spend"] > features["annual_spend"].median()).astype(int)

    # --- Composite risk indicators ---
    features["compliance_gap_count"] = (
        features["soc2_expired"] +
        features["iso_expired"] +
        features["contract_expired"]
    )
    features["expiring_soon_count"] = (
        features["soc2_expiring_soon"] +
        features["iso_expiring_soon"] +
        features["contract_expiring_soon"]
    )

    # --- Target variable encoding ---
    features["severity_numeric"] = features.get("severity", pd.Series(["LOW"] * len(features))).map(SEVERITY_MAP).fillna(0)

    return features


# The feature columns used by the XGBoost model
ML_FEATURE_COLUMNS = [
    "risk_score",
    "breached_recently",
    "under_investigation",
    "missing_gdpr_dpa",
    "has_soc2",
    "has_iso",
    "days_until_soc2_expiry",
    "days_until_iso_expiry",
    "days_until_contract_end",
    "annual_spend_normalized",
    "data_sensitivity",
    "high_data_access",
    "vendor_type_numeric",
    "soc2_expired",
    "iso_expired",
    "contract_expired",
    "soc2_expiring_soon",
    "iso_expiring_soon",
    "contract_expiring_soon",
    "compliance_gap_count",
    "expiring_soon_count",
    "high_spend",
]

# Human-readable names for SHAP plots
FEATURE_DISPLAY_NAMES = {
    "risk_score": "Base Risk Score",
    "breached_recently": "Recent Breach",
    "under_investigation": "Under Investigation",
    "missing_gdpr_dpa": "Missing GDPR DPA",
    "has_soc2": "SOC2 Valid",
    "has_iso": "ISO 27001 Valid",
    "days_until_soc2_expiry": "Days to SOC2 Expiry",
    "days_until_iso_expiry": "Days to ISO Expiry",
    "days_until_contract_end": "Days to Contract End",
    "annual_spend_normalized": "Annual Spend",
    "data_sensitivity": "Data Sensitivity",
    "high_data_access": "High Data Access",
    "vendor_type_numeric": "Vendor Type",
    "soc2_expired": "SOC2 Expired",
    "iso_expired": "ISO Expired",
    "contract_expired": "Contract Expired",
    "soc2_expiring_soon": "SOC2 Expiring Soon",
    "iso_expiring_soon": "ISO Expiring Soon",
    "contract_expiring_soon": "Contract Expiring Soon",
    "compliance_gap_count": "Compliance Gaps",
    "expiring_soon_count": "Expiring Soon Count",
    "high_spend": "High Spend",
}
