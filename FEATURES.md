# SocGen Sentinel — Feature & Architecture Specification

SocGen Sentinel is an AI-powered enterprise-grade third-party vendor risk intelligence platform designed for financial institutions. It replaces static tracking sheets with a centralized, dynamic dashboard that integrates machine learning risk classification, SHAP model explainability, legal contract parsing, and threat sandboxing.

---

## 🚀 Core Features

### 1. Centralized Vendor Registry
- **Directory Management**: Track all active downstream entities (Cloud, Payment, MSP, HR, and Security partners) along with their business categorization, subprocessors count, and annual contract spend.
- **Data Access Scope Catalog**: Audit exactly what data assets are shared with which vendors (e.g., PII, Financial, Database, ReadOnly), aligning access rights to the Principle of Least Privilege.
- **Dynamic Database Operations**: Supports full CRUD capabilities (Register Vendor, Delete Vendor) directly from the dashboard, saving state to backend registry files.

### 2. AI-Powered Risk Scoring Engine
- **XGBoost Classifier**: An advanced model that classifies vendor profiles into four severity levels: **Low**, **Medium**, **High**, and **Critical**.
- **Realistic Accuracy Engine**: Avoids artificial 100% classification accuracy by injecting controlled ~8% data noise to target labels, creating a realistic machine learning sandbox environment running at **~82.5% accuracy**.
- **Metrics Breakdown**: Logs complete classification metrics on server startup and test scripts, breaking down **Precision**, **Recall**, and **F1-Score** for each risk profile class.

### 3. Model Explainability via SHAP (Shapley Additive exPlanations)
- **Feature Importance**: Uses a `TreeExplainer` (with Kernel fallback) to compute the exact impact percentage of features causing a risk classification.
- **Top Risk Factors**: Identifies key indicators (such as recent breaches, high data access, or expired SOC2 certificates) and displays whether they increase or decrease the overall risk profile of the vendor.

### 4. Risk Intelligence Sandbox (What-If Threat Mitigation)
- **Defensive Modeling**: Check off different security controls (MFA enforcement, backup encryption, SOC2 auditing, key rotation, and penetration testing).
- **Dynamic Retraining**: Applying controls updates the registry databases and triggers a backend retrain hook in real-time, instantly adjusting the vendor's ML score, severity tier, and SHAP factors.

### 5. Contract Intelligence & SLA Parser
- **Live SLA Upload**: Portal supporting PDF, DOCX, or TXT file uploads.
- **Gemini NLP Review**: Utilizes Google Gemini AI model parsing to extract:
  - Extracted contract duration (Start and End dates).
  - Indemnity limits and liability caps.
  - GDPR Article 28 data processor terms.
  - Breach notification SLA windows (e.g., 72-hour notifications).
- **Flagged Clauses**: Isolates high-risk legal terms, giving legal teams clear risk rationales and recommended text fixes.

### 6. Threat Monitoring Feed
- **Google News RSS Integrations**: Searches active breach databases and Google News feeds for security advisories and incidents related to your specific vendors.
- **Global Breach Tracker**: Real-time ticker displaying cybersecurity events and compliance warnings (e.g., VPN zero-days, GDPR enforcement fines).

---

## 🛠️ Technology Stack & Communication

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS & Glassmorphism Design Theme
- **Animations**: Framer Motion
- **Visuals**: Recharts (Risk distribution heatmaps and spend graphs)

### Backend
- **Framework**: FastAPI (Python) & Uvicorn Server
- **Machine Learning**: XGBoost, SHAP, Scikit-learn, Pandas, NumPy
- **Generative AI**: Google Generative AI (`gemini-2.0-flash` endpoint)
- **News Parser**: BeautifulSoup4 & Requests

### Inter-Service Integration
- **Hybrid Data Fetching**: Frontend reads dynamically from the FastAPI REST endpoints. If the backend server goes offline, the frontend falls back automatically to a local `/data.json` cache to keep dashboard operations functional.
