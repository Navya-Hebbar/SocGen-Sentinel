# SocGen Sentinel

**AI-powered third-party risk and governance platform for enterprise vendor security.**

SocGen Sentinel replaces spreadsheet-based vendor risk tracking with a centralized vendor registry, explainable risk scoring, compliance monitoring, contract intelligence, breach monitoring, remediation simulation, and audit-ready reporting.

The project is built for the enterprise challenge where a financial institution manages hundreds or thousands of third-party vendors including cloud providers, SaaS tools, contractors, MSPs, payment processors, HR platforms, backup providers, and integration partners.

## What This Project Solves

Third-party vendors are a major source of enterprise breach risk. The hard part is not only knowing whether a vendor is safe or unsafe, but understanding:

- Which vendors have access to customer data?
- Which vendors have expired SOC 2 or ISO 27001 evidence?
- Which vendors were recently breached?
- Which contracts have weak breach notification or GDPR DPA terms?
- Which vendors need urgent remediation?
- Can an auditor get a clear vendor risk report quickly?

SocGen Sentinel answers these questions with a ranked vendor risk register and audit-ready reports.

## What We Implemented

- Centralized vendor inventory
- Risk scoring and severity classification
- Ground-truth high-risk evaluation labels
- Full anomaly taxonomy for vendor risk
- SOC 2, ISO 27001, and GDPR tracking
- Contract/SLA AI analysis workflow
- Breach intelligence monitoring
- Risk remediation simulator
- Future risk prediction
- Audit report dashboard
- Plain text vendor risk portfolio report
- Sample walkthrough API matching the challenge expected output
- Framework alignment for GDPR, NIST, and SOX
- Integration recommendations for ITSM, procurement, IAM, and GRC systems

## Hackathon Upgrade Summary

The project was upgraded to better match the challenge requirements:

- **143 tracked vendors out of 150 known vendors**
- **95.3% vendor coverage**
- **20 ground-truth high-risk labels** for evaluation
- **83.9% anomaly flag rate**, intentionally high for tiered vendor response
- Full anomaly taxonomy implemented
- Transparent scoring rationale added
- Deterministic critical-risk guardrails added
- Portfolio-style audit text report added
- Success criteria added to the audit report
- Frontend fallback data regenerated from the backend model

## Core Features

### 1. Vendor Registry

The vendor registry tracks:

- Vendor ID
- Vendor name
- Vendor category/type
- Data access scope
- SOC 2 expiry
- ISO 27001 expiry
- GDPR DPA status
- Breach history
- Security investigation status
- Contract start/end dates
- Active access status
- Financial rating
- Annual spend
- Risk score
- Risk level
- Anomaly type
- Risk factors
- Recommended action

The frontend includes search, filtering, vendor detail view, add vendor, and delete vendor workflows.

### 2. Risk Scoring Engine

The backend uses both machine learning and deterministic risk rules.

The scoring considers:

- Breach exposure
- Sensitive data access
- SOC 2 / ISO 27001 expiry
- Missing GDPR DPA
- Contract expiration
- Active access after contract end
- Vendor investigation status
- Financial health
- Annual spend
- Vendor type

Transparent formula:

```text
Base 20
+ breach exposure
+ data sensitivity
+ compliance expiry
+ GDPR DPA gap
+ contract/access gap
+ financial health
```

ML stack:

- XGBoost classifier
- SHAP explainability
- Scikit-learn metrics
- Pandas feature engineering

### 3. Anomaly Types

The project supports all required challenge anomaly labels:

| Anomaly Type | Severity | Meaning |
| --- | --- | --- |
| `BREACHED_VENDOR_HIGH_ACCESS` | Critical/High | Vendor was breached and has sensitive access |
| `VENDOR_UNDER_INVESTIGATION` | Critical | Vendor is under active security investigation |
| `HIGH_RISK_SCORE` | High | Risk score is greater than 80/100 |
| `EXPIRED_CERTIFICATION` | High/Medium | SOC 2 or ISO 27001 evidence expired |
| `RECENTLY_BREACHED_VENDOR` | Medium | Vendor breach in last 12 months with lower access |
| `CONTRACT_EXPIRED_ACTIVE_ACCESS` | Medium | Contract expired but access remains active |
| `ELEVATED_RISK_VENDOR` | Low | Risk score 65-80, increased monitoring required |

### 4. Compliance Tracking

Compliance coverage includes:

- SOC 2 Type II
- ISO 27001
- GDPR DPA
- GDPR Article 28 processor obligations
- GDPR Article 33 breach notification readiness
- PCI-DSS style control visibility in dashboard data

The audit report shows compliance percentages and vendors requiring renewal or remediation.

### 5. Contract Intelligence

The contract module supports vendor agreement analysis for:

- Contract start and end date
- Breach notification SLA
- Liability cap
- Indemnity clauses
- GDPR Article 28 processor language
- Subprocessor consent terms
- Risky legal clauses
- Recommended contract fixes

The backend uses Gemini when configured and falls back to realistic mock analysis for reliable demos.

### 6. Breach Monitoring

The breach module monitors:

- Google News RSS security results
- CISA Known Exploited Vulnerabilities catalog
- Vendor-specific breach lookups
- Global cybersecurity threat feed

This helps detect changes in vendor posture over time.

### 7. Remediation Sandbox

The risk sandbox lets users simulate controls such as:

- Enforce MFA
- Encrypt backup assets
- Complete SOC 2 audit
- Secure API tokens
- Restrict subprocessors
- Run penetration tests

Applying remediation updates vendor risk and retrains/recalculates backend results.

### 8. Audit Reporting

Audit reporting includes:

- Total vendors tracked
- Known vendor coverage
- Risk distribution
- High-risk vendor register
- Compliance summary
- Breach count
- Early alert count
- Ground-truth high-risk evaluation
- Integration recommendations
- Framework alignment
- PDF/print export
- Plain text portfolio report

Plain text report endpoint:

```text
GET /api/audit/portfolio-text
```

Sample walkthrough endpoint:

```text
GET /api/risk/sample-walkthrough
```

Example output:

```json
{
  "vendor_id": "VND-0285",
  "risk_score": 7.8,
  "risk_level": "HIGH",
  "risk_factors": [
    "Recent breach (Jan 2024): Unencrypted data exposed, potentially including backups",
    "SOC 2 expires in 60 days: Certification gap risk",
    "Missing GDPR DPA agreement despite processing EU data",
    "High-sensitivity data access (backups = full database copies)"
  ],
  "recommendation": "Schedule urgent compliance meeting; consider alternative vendor"
}
```

## Success Criteria Mapping

| Metric | Target | Current Project |
| --- | --- | --- |
| Vendor Coverage | 95%+ | 143 of 150 vendors tracked = 95.3% |
| Risk Accuracy | 80%+ | Audit report compares predictions to 20 high-risk ground-truth labels |
| Alert Timeliness | 30+ days early | Cert and contract expiry alerts are generated before deadlines |
| Operational Efficiency | 5 min to answer vendor compliance | Searchable vendor registry and per-vendor compliance status |
| Audit Readiness | 15 min to generate report | `/api/audit/report` and `/api/audit/portfolio-text` generate reports instantly |

## Framework Alignment

### GDPR Article 28

- Tracks GDPR DPA status
- Flags missing processor agreements
- Tracks subprocessor and contract risk
- Documents vendor control gaps

### GDPR Article 33

- Tracks vendor breach history
- Supports 72-hour breach notification readiness
- Highlights weak breach notification terms in contracts

### NIST SP 800-53 SA-9

- Tracks third-party service security risk
- Supports vendor assessments
- Connects risk findings to remediation workflows

### SOX 404

- Tracks dependency on vendor controls
- Captures continuity and financial health risks
- Flags third-party control weaknesses that can affect internal controls

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- Pandas
- NumPy
- Scikit-learn
- XGBoost
- SHAP
- Requests
- BeautifulSoup4
- Google Generative AI SDK

### Data and ML

- CSV vendor registry
- CSV evaluation labels
- XGBoost model pickle
- SHAP explainer pickle
- CISA KEV JSON cache
- Generated frontend fallback data

## Important Files

```text
backend/app/main.py              FastAPI routes and API endpoints
backend/app/model.py             ML training, prediction, SHAP, vendor CRUD
backend/app/features.py          Feature engineering pipeline
backend/app/risk_rules.py        Transparent scoring rules and sample walkthrough
backend/app/breach_monitor.py    Google News RSS and CISA KEV monitoring
backend/app/gemini_service.py    Contract and narrative AI service
backend/ml/seed_real_vendors.py  Enterprise vendor dataset generator
backend/ml/vendor_registry.csv   Vendor inventory
backend/ml/vendor_labels.csv     Ground-truth labels and anomaly taxonomy
backend/generate_data.py         Generates frontend fallback data
backend/test_model.py            Model verification script
frontend/src/pages/              Dashboard pages
frontend/src/utils/api.js        Frontend API client
frontend/public/data.json        Static fallback dataset
```

## Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend URL:

```text
http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

If PowerShell blocks `npm`, use:

```bash
npm.cmd run dev
```

## Developer Commands

Regenerate vendor dataset:

```bash
python backend/ml/seed_real_vendors.py
```

Train and test model:

```bash
python backend/test_model.py
```

Regenerate frontend fallback data:

```bash
python backend/generate_data.py
```

Build frontend:

```bash
cd frontend
npm.cmd run build
```

## Verification

The upgraded project was verified with:

- `python backend/test_model.py`
- `python -m compileall backend/app`
- FastAPI smoke tests for audit report, portfolio text report, and sample walkthrough
- `npm.cmd run build`

The Vite production build succeeds. It may show a large bundle warning, but that is not a build failure.

## Demo Pitch

SocGen Sentinel helps security, procurement, legal, compliance, and audit teams answer:

```text
Who are our riskiest vendors, what data do they access, why are they risky,
which controls are failing, and what action should we take next?
```

Instead of a binary safe/unsafe result, the system produces a ranked vendor risk register designed for tiered response, continuous monitoring, and auditor-ready evidence.
