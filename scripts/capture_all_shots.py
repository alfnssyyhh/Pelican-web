import os
import subprocess
import time

edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
shots_dir = r"R:\Gemini-Workspace\Pelican-web\pelican-app\scripts\shots"
os.makedirs(shots_dir, exist_ok=True)

pages = [
    ("home", "http://localhost:3000/"),
    ("service", "http://localhost:3000/service"),
    ("product", "http://localhost:3000/product"),
    ("rent", "http://localhost:3000/rent"),
    ("works", "http://localhost:3000/works"),
    ("artikel", "http://localhost:3000/artikel"),
    ("contact", "http://localhost:3000/contact"),
    ("marine", "http://localhost:3000/marine-automation-marine-navigation-marine-electrical-support"),
]

for name, url in pages:
    out_png = os.path.join(shots_dir, f"{name}.png")
    cmd = [
        edge_exe,
        "--headless=new",
        f"--screenshot={out_png}",
        "--window-size=1280,720",
        "--hide-scrollbars",
        url
    ]
    print(f"Capturing screenshot for {name} ({url})...")
    subprocess.run(cmd, check=True)
    if os.path.exists(out_png):
        print(f"  -> Saved {out_png} ({os.path.getsize(out_png)} bytes)")
    else:
        print(f"  -> FAILED to capture {name}")

print("All screenshots captured!")
