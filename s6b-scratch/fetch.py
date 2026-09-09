#!/usr/bin/env python3
"""Polite fetcher: one URL per line on argv, saves body to RAWDIR/<name>, prints http code + bytes + exit."""
import sys, os, time, subprocess, json
RAW = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/primary/raw"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
delay = float(os.environ.get("DELAY", "10"))
os.makedirs(RAW, exist_ok=True)
pairs = [a.split("::", 1) for a in sys.argv[1:]]
rows = []
for i, (name, url) in enumerate(pairs):
    if i: time.sleep(delay)
    out = os.path.join(RAW, name)
    p = subprocess.run(["curl", "-sSL", "-A", UA,
                        "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "-H", "Accept-Language: en-US,en;q=0.9",
                        "--compressed", "--max-time", "60",
                        "-o", out, "-w", "%{http_code} %{size_download} %{url_effective}", url],
                       capture_output=True, text=True)
    print(f"{name}\tcurl_exit={p.returncode}\t{p.stdout.strip()}")
    if p.stderr.strip(): print("   stderr:", p.stderr.strip()[:300])
