"""
Breach Monitoring Service.
Uses Google News RSS search and CISA Known Exploited Vulnerabilities (KEV) Catalog
to find real breach and vulnerability intelligence for vendor names.
No simulated data fallbacks.
"""
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import hashlib
import urllib.parse
import os
import json

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KEV_CACHE_PATH = os.path.join(BASE_DIR, "ml", "cisa_kev.json")
KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"

def _load_cisa_kev() -> dict:
    """
    Downloads the CISA Known Exploited Vulnerabilities catalog and caches it locally.
    Refreshes the cache if it's older than 24 hours.
    """
    should_download = True
    if os.path.exists(KEV_CACHE_PATH):
        try:
            mtime = os.path.getmtime(KEV_CACHE_PATH)
            if datetime.now().timestamp() - mtime < 86400:  # 24 hours
                should_download = False
        except Exception:
            pass

    if should_download:
        try:
            print(f"Downloading latest CISA KEV catalog from {KEV_URL}...")
            response = requests.get(KEV_URL, timeout=10)
            if response.status_code == 200:
                data = response.json()
                os.makedirs(os.path.dirname(KEV_CACHE_PATH), exist_ok=True)
                with open(KEV_CACHE_PATH, "w") as f:
                    json.dump(data, f, indent=2)
                print("CISA KEV catalog cached successfully.")
                return data
        except Exception as e:
            print(f"Warning: Failed to download CISA KEV catalog: {e}")

    # Fallback to cache if download failed or not needed
    if os.path.exists(KEV_CACHE_PATH):
        try:
            with open(KEV_CACHE_PATH, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Failed to read CISA KEV cache: {e}")

    return {"vulnerabilities": []}

def _clean_vendor_name(name: str) -> str:
    """Helper to clean vendor name for fuzzy matching (remove Inc, LLC, etc.)"""
    name = name.lower()
    for suffix in [" inc.", " inc", " corp.", " corp", " corporation", " ltd.", " ltd", " llc", " software", " technologies", " systems"]:
        if name.endswith(suffix):
            name = name[:-len(suffix)]
    return name.strip()

def _search_cisa_kev(vendor_name: str) -> list:
    """
    Search the CISA KEV catalog for vulnerabilities associated with the vendor.
    """
    data = _load_cisa_kev()
    vulnerabilities = data.get("vulnerabilities", [])
    
    cleaned_name = _clean_vendor_name(vendor_name)
    results = []
    
    for v in vulnerabilities:
        vendor_project = str(v.get("vendorProject", "")).lower()
        cleaned_proj = _clean_vendor_name(vendor_project)
        
        # Match if cleaned project is in cleaned vendor name or vice-versa
        if cleaned_name and cleaned_proj and (cleaned_name in cleaned_proj or cleaned_proj in cleaned_name):
            cve_id = v.get("cveID", "CVE-Unknown")
            vul_name = v.get("vulnerabilityName", "Exploited Vulnerability")
            product = v.get("product", "Software Product")
            pub_date = v.get("dateAdded", "")
            short_desc = v.get("shortDescription", "")
            req_action = v.get("requiredAction", "")
            ransomware = v.get("knownRansomwareCampaignUse", "Unknown")
            
            severity = "Critical" if ransomware == "Known" else "High"
            
            results.append({
                "id": cve_id,
                "title": f"{cve_id}: {vul_name} in {product}",
                "source": "CISA Known Exploited Vulnerabilities Catalog",
                "url": f"https://nvd.nist.gov/vuln/detail/{cve_id}",
                "date": pub_date,
                "severity": severity,
                "type": "real_news",
                "vendor_match": vendor_name,
                "description": short_desc,
                "remediation": req_action
            })
            
    # Sort matching vulnerabilities by dateAdded descending
    results.sort(key=lambda x: x["date"], reverse=True)
    return results

def _search_google_news(vendor_name: str) -> list:
    """Search Google News RSS for vendor breach/security news."""
    try:
        query = urllib.parse.quote(f"{vendor_name} data breach security")
        url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, headers=headers, timeout=5)

        if response.status_code != 200:
            return []

        soup = BeautifulSoup(response.content, "xml")
        items = soup.find_all("item", limit=5)

        results = []
        for item in items:
            title = item.title.text if item.title else ""
            link = item.link.text if item.link else ""
            pub_date = item.pubDate.text if item.pubDate else ""
            source = item.source.text if item.source else "Unknown Source"

            try:
                dt = datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %Z")
                formatted_date = dt.strftime("%Y-%m-%d")
            except Exception:
                formatted_date = pub_date

            lower_title = title.lower()
            is_breach = any(kw in lower_title for kw in [
                "breach", "hack", "leak", "vulnerability", "exploit",
                "cyber", "security", "ransomware", "phishing", "malware",
                "compromised", "incident", "attack"
            ])

            if is_breach:
                severity = "Critical" if any(k in lower_title for k in ["breach", "ransomware", "hack"]) else "High"
                results.append({
                    "id": hashlib.md5(title.encode()).hexdigest()[:12],
                    "title": title,
                    "source": source,
                    "url": link,
                    "date": formatted_date,
                    "severity": severity,
                    "type": "real_news",
                    "vendor_match": vendor_name,
                })

        return results

    except Exception as e:
        print(f"Google News search error: {e}")
        return []

def search_vendor_breaches(vendor_name: str) -> list:
    """
    Search for real breach news about a vendor using Google News RSS and CISA KEV.
    No simulated data fallback.
    """
    news_results = _search_google_news(vendor_name)
    kev_results = _search_cisa_kev(vendor_name)
    
    # Merge and return
    total_results = news_results + kev_results
    
    # Sort all by date descending
    total_results.sort(key=lambda x: x["date"], reverse=True)
    return total_results

def get_global_breach_feed() -> list:
    """
    Get a global cybersecurity breach news feed combining live Google News search
    and recent CISA KEV vulnerability advisories. No simulated data.
    """
    results = []
    
    # 1. Fetch live news
    try:
        query = urllib.parse.quote("data breach cybersecurity 2026")
        url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(url, headers=headers, timeout=5)

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "xml")
            items = soup.find_all("item", limit=10)

            for item in items:
                title = item.title.text if item.title else ""
                link = item.link.text if item.link else ""
                pub_date = item.pubDate.text if item.pubDate else ""
                source = item.source.text if item.source else "Unknown"

                try:
                    dt = datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %Z")
                    formatted_date = dt.strftime("%Y-%m-%d")
                except Exception:
                    formatted_date = pub_date

                lower_title = title.lower()
                severity = "Critical"
                if any(k in lower_title for k in ["breach", "ransomware", "hack", "compromised"]):
                    severity = "Critical"
                elif any(k in lower_title for k in ["vulnerability", "exploit", "patch"]):
                    severity = "High"
                elif any(k in lower_title for k in ["phishing", "warning", "advisory"]):
                    severity = "Medium"
                else:
                    severity = "Low"

                results.append({
                    "id": hashlib.md5(title.encode()).hexdigest()[:12],
                    "title": title,
                    "source": source,
                    "url": link,
                    "date": formatted_date,
                    "severity": severity,
                    "type": "real_news",
                })
    except Exception as e:
        print(f"Error fetching global news feed: {e}")

    # 2. Fetch CISA KEV entries
    try:
        data = _load_cisa_kev()
        vuls = data.get("vulnerabilities", [])
        vuls_sorted = sorted(vuls, key=lambda x: x.get("dateAdded", ""), reverse=True)[:15]
        
        for v in vuls_sorted:
            cve_id = v.get("cveID", "CVE-Unknown")
            vul_name = v.get("vulnerabilityName", "Exploited Vulnerability")
            product = v.get("product", "Software Product")
            vendor = v.get("vendorProject", "Vendor")
            pub_date = v.get("dateAdded", "")
            
            results.append({
                "id": cve_id,
                "title": f"CISA KEV Alert: {cve_id} - {vul_name} in {vendor} {product}",
                "source": "CISA KEV Catalog",
                "url": f"https://nvd.nist.gov/vuln/detail/{cve_id}",
                "date": pub_date,
                "severity": "Critical" if v.get("knownRansomwareCampaignUse") == "Known" else "High",
                "type": "real_news",
            })
    except Exception as e:
        print(f"Error fetching CISA KEV global alerts: {e}")

    # 3. Sort merged list by date descending
    results.sort(key=lambda x: x["date"], reverse=True)
    return results
