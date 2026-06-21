/**
 * API Client for SocGen Sentinel Backend.
 * Falls back to static data.json when backend is unavailable.
 */

const API_BASE = "http://localhost:8000/api";

let backendAvailable = null;

async function checkBackend() {
  if (backendAvailable !== null) return backendAvailable;
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    backendAvailable = res.ok;
  } catch {
    backendAvailable = false;
  }
  return backendAvailable;
}

export async function fetchVendors() {
  if (await checkBackend()) {
    try {
      const res = await fetch(`${API_BASE}/vendors`);
      const data = await res.json();
      return data.vendors || [];
    } catch { /* fallback */ }
  }
  return null; // Caller should fallback to data.json
}

export async function fetchMLPrediction(vendorId) {
  try {
    const res = await fetch(`${API_BASE}/ml/predict/${vendorId}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchSHAPExplanation(vendorId) {
  try {
    const res = await fetch(`${API_BASE}/ml/explain/${vendorId}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchFutureRisk(vendorId, days = 60) {
  try {
    const res = await fetch(`${API_BASE}/ml/future-risk/${vendorId}?days=${days}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchFutureRiskAll() {
  try {
    const res = await fetch(`${API_BASE}/ml/future-risk-all`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchRiskNarrative(vendorId) {
  try {
    const res = await fetch(`${API_BASE}/ai/narrate/${vendorId}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchRecommendations(vendorId) {
  try {
    const res = await fetch(`${API_BASE}/ai/recommendations/${vendorId}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchBreachFeed() {
  try {
    const res = await fetch(`${API_BASE}/breach/feed`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchVendorBreaches(vendorName) {
  try {
    const res = await fetch(`${API_BASE}/breach/vendor/${encodeURIComponent(vendorName)}`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchComplianceSummary() {
  try {
    const res = await fetch(`${API_BASE}/compliance/summary`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchAuditReport() {
  try {
    const res = await fetch(`${API_BASE}/audit/report`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchPortfolioTextReport() {
  try {
    const res = await fetch(`${API_BASE}/audit/portfolio-text`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchModelMetrics() {
  try {
    const res = await fetch(`${API_BASE}/ml/model-metrics`);
    return await res.json();
  } catch {
    return null;
  }
}

export async function uploadContract(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/contracts/analyze`, {
      method: "POST",
      body: formData,
    });
    return await res.json();
  } catch {
    return null;
  }
}

export async function createVendor(vendorData) {
  try {
    const res = await fetch(`${API_BASE}/vendors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vendorData),
    });
    return await res.json();
  } catch {
    return null;
  }
}

export async function deleteVendor(vendorId) {
  try {
    const res = await fetch(`${API_BASE}/vendors/${vendorId}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch {
    return null;
  }
}

export async function remediateVendor(vendorId, controls) {
  try {
    const res = await fetch(`${API_BASE}/vendors/${vendorId}/remediation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(controls),
    });
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchContracts() {
  try {
    const res = await fetch(`${API_BASE}/contracts`);
    return await res.json();
  } catch {
    return null;
  }
}
