import fitz
import glob
import os
import re

pdf_files = glob.glob(r'R:\Gemini-Workspace\Pelican-web\SEO-test-lighthouse\*.pdf')

for f in sorted(pdf_files):
    fname = os.path.basename(f)
    doc = fitz.open(f)
    print("=" * 60)
    print(f"FILE: {fname}")
    p1 = doc[0].get_text()
    
    # Check top lines of page 1
    lines = [l.strip() for l in p1.splitlines() if l.strip()]
    # Usually in page 1 there are 4 main category scores
    print("Top page 1 lines:", lines[:25])
    
    # Also find any failed audits across the PDF
    full_text = "\n".join([page.get_text() for page in doc])
    
    # Look for OPPORTUNITIES and DIAGNOSTICS
    print("\n--- OPPORTUNITIES & DIAGNOSTICS ---")
    matches = re.findall(r'([A-Za-z0-9\s—–\-\(\)\/\.\:\,]+Est savings[^\n]+)', full_text)
    for m in set(matches):
        print("  Savings:", m.strip())
        
    diag_matches = re.findall(r'(Reduce JavaScript execution time[^\n]+|Minimize main-thread work[^\n]+|Avoid large layout shifts[^\n]+|Largest Contentful Paint image was not[^\n]+|Image elements do not have explicit[^\n]+|Serve static assets with an efficient cache[^\n]+)', full_text, re.IGNORECASE)
    for dm in set(diag_matches):
        print("  Diagnostic:", dm.strip())
        
    # Check for accessibility failures
    acc_fails = re.findall(r'(\[?[a-zA-Z0-9_\-\.\#\:\s\"\'\=\>\<\(\)]+does not have sufficient color contrast[^\n]+|Background and foreground colors do not have a sufficient contrast ratio[^\n]+|Heading elements are not in a sequentially-descending order[^\n]+|Links do not have a discernible name[^\n]+|Buttons do not have an accessible name[^\n]+)', full_text, re.IGNORECASE)
    for af in set(acc_fails):
        print("  A11y fail:", af.strip())
        
    # Check for Best Practices issues
    bp_fails = re.findall(r'(Issues were logged to the console[^\n]+|Missing doctype[^\n]+|Detected [0-9]+ errors logged to the console[^\n]+|Charset is not defined[^\n]+)', full_text, re.IGNORECASE)
    for bp in set(bp_fails):
        print("  Best practice fail:", bp.strip())
