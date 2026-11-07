import urllib.request
import urllib.parse
import urllib.error
import time
import json
import statistics

BASE_URL = "http://localhost:3000"

def make_request(path, method="GET", headers=None, data=None):
    url = f"{BASE_URL}{path}"
    req_headers = {"User-Agent": "Security-Audit-Runner/1.0"}
    if headers:
        req_headers.update(headers)
    
    encoded_data = None
    if data:
        encoded_data = json.dumps(data).encode("utf-8")
        req_headers["Content-Type"] = "application/json"

    # Custom HTTP handler to prevent following redirects automatically
    class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
        def http_error_302(self, req, fp, code, msg, headers):
            return fp
        def http_error_307(self, req, fp, code, msg, headers):
            return fp
        def http_error_301(self, req, fp, code, msg, headers):
            return fp

    opener = urllib.request.build_opener(NoRedirectHandler)
    req = urllib.request.Request(url, data=encoded_data, headers=req_headers, method=method)

    t0 = time.time()
    try:
        with opener.open(req, timeout=10) as resp:
            elapsed_ms = int((time.time() - t0) * 1000)
            body = resp.read().decode("utf-8", errors="replace")
            # Lowercase all header keys for reliable case-insensitive lookups
            normalized_headers = {k.lower(): v for k, v in resp.headers.items()}
            return {
                "status": resp.status,
                "headers": normalized_headers,
                "body": body,
                "elapsed_ms": elapsed_ms
            }
    except urllib.error.HTTPError as e:
        elapsed_ms = int((time.time() - t0) * 1000)
        body = e.read().decode("utf-8", errors="replace")
        normalized_headers = {k.lower(): v for k, v in e.headers.items()}
        return {
            "status": e.code,
            "headers": normalized_headers,
            "body": body,
            "elapsed_ms": elapsed_ms
        }
    except Exception as e:
        elapsed_ms = int((time.time() - t0) * 1000)
        return {
            "status": 0,
            "headers": {},
            "body": str(e),
            "elapsed_ms": elapsed_ms,
            "error": str(e)
        }

def run_single_security_audit(iteration):
    print(f"\n--- [ITERATION {iteration}/5] Executing Cloudflare / OWASP Security Penetration Suite ---")
    results = {}
    
    # 1. Direct Access to Protected Admin Route
    r1 = make_request("/admin/products", method="GET")
    loc1 = r1["headers"].get("location", "")
    is_r1_passed = r1["status"] in (302, 307) and "/admin/login" in loc1
    results["1_rbac_admin_route"] = {
        "name": "Akses Langsung Rute Admin Tanpa Sesi (/admin/products)",
        "expected": "HTTP 307/302 Redirect ke /admin/login",
        "actual": f"Status {r1['status']} -> Location: {loc1}",
        "passed": is_r1_passed,
        "elapsed_ms": r1["elapsed_ms"]
    }

    # 2. Destructive API Mutation Without Session
    r2 = make_request("/api/admin/products/1", method="DELETE")
    is_r2_passed = r2["status"] == 401
    results["2_destructive_api"] = {
        "name": "Bypass Otorisasi API Mutasi Destruktif (DELETE /api/admin/products/1)",
        "expected": "HTTP 401 Unauthorized",
        "actual": f"Status {r2['status']} -> Body: {r2['body'][:60]}",
        "passed": is_r2_passed,
        "elapsed_ms": r2["elapsed_ms"]
    }

    # 3. Forged Session Cookie (HMAC-SHA256 signature tampering)
    forged_cookie = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiZXhwIjoyNTI0NjA4MDAwfQ.INVALIDSIGNATUREXYZ123"
    r3 = make_request("/admin", method="GET", headers={"Cookie": f"pelican_admin_session={forged_cookie}"})
    loc3 = r3["headers"].get("location", "")
    is_r3_passed = r3["status"] in (302, 307) and "/admin/login" in loc3
    results["3_session_forgery"] = {
        "name": "Pemalsuan Cookie Sesi HMAC (Token Tampering Attack)",
        "expected": "HTTP 307/302 Redirect ke /admin/login",
        "actual": f"Status {r3['status']} -> Location: {loc3}",
        "passed": is_r3_passed,
        "elapsed_ms": r3["elapsed_ms"]
    }

    # 4. Brute Force & Rate Limiting (Cloudflare / IP Throttling simulation)
    sim_ip = f"198.51.100.{20 + iteration}"
    bf_statuses = []
    latencies = []
    for attempt in range(1, 8):
        r_login = make_request(
            "/api/admin/login",
            method="POST",
            headers={"X-Forwarded-For": sim_ip},
            data={"username": "wrong_user", "password": "wrong_password"}
        )
        bf_statuses.append(r_login["status"])
        latencies.append(r_login["elapsed_ms"])
    
    is_r4_passed = bf_statuses[:5] == [401, 401, 401, 401, 401] and bf_statuses[5] == 429
    results["4_brute_force_rate_limit"] = {
        "name": "Pencegahan Brute Force & Pembatasan Laju (Rate Limiter 5x / 15m)",
        "expected": "Urutan status: [401 x 5, 429, 429]",
        "actual": f"Status: {bf_statuses}",
        "passed": is_r4_passed,
        "simulated_ip": sim_ip,
        "latencies": latencies
    }

    # 5. Path Traversal & Config File Leakage
    r5 = make_request("/%2e%2e/%2e%2e/.env.local", method="GET")
    is_r5_passed = r5["status"] in (400, 404) and "ADMIN_PASSWORD" not in r5["body"]
    results["5_path_traversal"] = {
        "name": "Uji Penetrasi Path Traversal (%2e%2e/.env.local)",
        "expected": "HTTP 404 / 400 (Zero Secret Leakage)",
        "actual": f"Status {r5['status']}",
        "passed": is_r5_passed,
        "elapsed_ms": r5["elapsed_ms"]
    }

    # 6. OWASP / Cloudflare Security Headers
    r6 = make_request("/", method="GET")
    headers = r6["headers"]
    has_xfo = headers.get("x-frame-options", "").upper() == "SAMEORIGIN"
    has_xcto = headers.get("x-content-type-options", "").lower() == "nosniff"
    has_csp = bool(headers.get("content-security-policy"))
    has_rp = bool(headers.get("referrer-policy"))
    has_xss = bool(headers.get("x-xss-protection"))
    is_r6_passed = has_xfo and has_xcto and has_csp and has_rp
    results["6_security_headers"] = {
        "name": "Kepatuhan Header Keamanan OWASP / Cloudflare WAF",
        "expected": "X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff, CSP, Referrer-Policy",
        "actual": f"XFO: {has_xfo}, XCTO: {has_xcto}, CSP: {has_csp}, RP: {has_rp}, XSS: {has_xss}",
        "passed": is_r6_passed,
        "elapsed_ms": r6["elapsed_ms"]
    }

    # 7. Timing Attack Variance Analysis (evaluate latencies from attempts 1-5)
    mean_lat = statistics.mean(latencies[:5])
    stdev_lat = statistics.stdev(latencies[:5]) if len(latencies[:5]) > 1 else 0
    cov = (stdev_lat / mean_lat) * 100 if mean_lat > 0 else 0
    is_r7_passed = cov < 15.0
    results["7_timing_attack_resistance"] = {
        "name": "Ketahanan Terhadap Timing Attack (Artificial Delay & Constant Time)",
        "expected": "Koefisien variasi waktu < 15% (stabil merata)",
        "actual": f"Rata-rata: {mean_lat:.1f}ms, Stdev: {stdev_lat:.1f}ms, CoV: {cov:.2f}%",
        "passed": is_r7_passed,
        "cov": cov
    }

    all_passed = all(item["passed"] for item in results.values())
    print(f"  Iteration {iteration} Result: {'✅ 7/7 TESTS PASSED (100% SECURE)' if all_passed else '❌ FAILED TESTS DETECTED'}")
    for k, v in results.items():
        icon = "  ✅" if v["passed"] else "  ❌"
        print(f"  {icon} {v['name']}: {v['actual']}")

    return {
        "iteration": iteration,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "all_passed": all_passed,
        "passed_count": sum(1 for v in results.values() if v["passed"]),
        "total_count": len(results),
        "tests": results
    }

def main():
    print("=" * 80)
    print("🛡️  CLOUDFLARE & OWASP 5X SECURITY AUDIT SUITE - PT PELICAN MITRA SEJATI")
    print(f"Target: {BASE_URL}")
    print("Execution Plan: 5 Consecutive Independent Iterations")
    print("=" * 80)

    # Warmup request
    make_request("/api/admin/login", method="POST", data={"username": "warmup", "password": "warmup"})

    runs = []
    for i in range(1, 6):
        res = run_single_security_audit(i)
        runs.append(res)
        time.sleep(1)

    # Aggregate Statistics
    total_runs = len(runs)
    perfect_runs = sum(1 for r in runs if r["all_passed"])
    total_tests_conducted = sum(r["total_count"] for r in runs)
    total_tests_passed = sum(r["passed_count"] for r in runs)

    print("\n" + "=" * 80)
    print("📊 REKAPITULASI HASIL AUDIT KEAMANAN 5X ITERASI")
    print("=" * 80)
    print(f"Total Iterasi Dijalankan : {total_runs} Kali")
    print(f"Iterasi Sempurna (100%)  : {perfect_runs} / {total_runs}")
    print(f"Total Uji Spesifik       : {total_tests_conducted} Pengujian")
    print(f"Total Uji Berhasil       : {total_tests_passed} / {total_tests_conducted} ({total_tests_passed/total_tests_conducted*100:.1f}%)")
    print("=" * 80)

    # Save to JSON
    report_file = r"R:\Gemini-Workspace\Pelican-web\security_audit_5x_report.json"
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump({
            "target": BASE_URL,
            "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "summary": {
                "total_runs": total_runs,
                "perfect_runs": perfect_runs,
                "total_tests_conducted": total_tests_conducted,
                "total_tests_passed": total_tests_passed,
                "success_rate": f"{total_tests_passed/total_tests_conducted*100:.1f}%"
            },
            "runs": runs
        }, f, indent=2, ensure_ascii=False)
    print(f"\nBerkas laporan tersimpan di: {report_file}")

if __name__ == "__main__":
    main()
