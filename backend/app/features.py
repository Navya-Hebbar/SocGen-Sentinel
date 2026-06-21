"""
Feature Engineering Pipeline for Vendor Risk Assessment.
Transforms raw CSV vendor data into ML-ready features.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Reference date for computing day-offsets
REFERENCE_DATE = datetime(2026, 6, 21)

FINANCIAL_RATING_MAP = {
    "A+": 1, "A": 2, "A-": 3, "B": 4, "C": 5, "D": 6
}

DATA_ACCESS_SENSITIVITY = {
    "PII": 5,
    "Financial": 4,
    "Database": 4,
    "Employee": 3,
    "Backup_Database": 5,
    "ReadOnly": 1
}

VENDOR_TYPE_MAP = {
    "Cloud": 1, "Payment": 2, "MSP": 3, "Integration": 4,
    "Security": 5, "Contractor": 6, "Backup": 7, "HR": 8
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


def load_and_merge(registry_path: str, labels_path: str) -> pd.DataFrame:
    """Load both CSVs and merge on vendor_id."""
    registry = pd.read_csv(registry_path)
    labels = pd.read_csv(labels_path)
    df = registry.merge(labels, on="vendor_id", how="left")
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create ML features from raw vendor data.
    Returns DataFrame with both raw columns and engineered features.
    """
    features = df.copy()

    # --- Date-based features ---
    features["days_until_soc2_expiry"] = features["soc2_expiry"].apply(
        lambda x: days_between(x)
    )
    features["days_until_iso_expiry"] = features["iso27001_expiry"].apply(
        lambda x: days_between(x)
    )
    features["days_until_contract_end"] = features["contract_end"].apply(
        lambda x: days_between(x)
    )
    features["contract_duration_days"] = features.apply(
        lambda row: days_between(row["contract_end"], pd.to_datetime(row["contract_start"])),
        axis=1
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
    features["breached_recently"] = features["breach_status"].apply(
        lambda x: 1 if str(x).strip().lower() == "true" else 0
    )
    features["under_investigation"] = features.get("investigation_status", "False").apply(
        lambda x: 1 if str(x).strip().lower() == "true" else 0
    )
    features["missing_gdpr_dpa"] = features.get("gdpr_dpa", "True").apply(
        lambda x: 1 if str(x).strip().lower() == "false" else 0
    )

    # --- Categorical encoding ---
    features["financial_rating_numeric"] = features["financial_rating"].map(
        FINANCIAL_RATING_MAP
    ).fillna(4)

    features["data_sensitivity"] = features["data_access"].map(
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
    features["severity_numeric"] = features["severity"].map(SEVERITY_MAP).fillna(0)

    return features


# The feature columns used by the XGBoost model
ML_FEATURE_COLUMNS = [
    "risk_score",
    "financial_rating_numeric",
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
    "financial_rating_numeric": "Financial Rating",
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
