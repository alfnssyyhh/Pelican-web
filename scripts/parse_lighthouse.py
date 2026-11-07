import fitz
import glob
import os
import re

pdf_files = glob.glob(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\*.pdf')

for f in sorted(pdf_files):
    fname = os.path.basename(f)
    doc = fitz.open(f)
    full_text = ""
    for page in doc:
        full_text += page.get_text() + "\n"
    
    print("====================================")
    print("FILE:", fname)
    
    # In Lighthouse PDF, scores usually appear near the top
    # Let's search for lines with Performance, Accessibility, Best Practices, SEO
    lines = [l.strip() for l in full_text.splitlines() if l.strip()]
    
    # Find metrics
    metrics = {}
    for i, l in enumerate(lines[:80]):
        if l in ["Performance", "Accessibility", "Best Practices", "SEO"]:
            # usually score is nearby
            context = lines[max(0, i-3):min(len(lines), i+4)]
            # check digits
            digits = [c for c in context if c.isdigit()]
            metrics[l] = digits
    print("Metrics detected:", metrics)

    # Let's find specific issues:
    issues = []
    for i, l in enumerate(lines):
        if any(term in l.lower() for term in [
            "opportunities", "diagnostics", "contrast", "aria", "tap target",
            "largest contentful paint image was not", "render-blocking",
            "total blocking time", "cumulative layout shift", "speed index",
            "first contentful paint", "reduce unused", "serve images",
            "properly size images", "efficiently encode", "eliminate render-blocking"
        ]):
            issues.append(f"{l} -> {lines[i+1] if i+1 < len(lines) else ''}")
            
    print("Key issues count:", len(issues))
    for iss in issues[:12]:
        print("  *", iss)
