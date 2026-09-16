#!/usr/bin/env python3
"""STREET-WIDTH DISTRIBUTION inside the settlement window (same windows as grain2).
MEASURED: runs of PALE pixels (>= local scan mean + 8) along 120 h + 120 v scans
inside the settlement box; each run normalised by that plate's measured CELL
PITCH, so a value of 1.0 == one building-plot width. Caveat: a pale run also
catches squares, greens and yards, so the top decile mixes 'widest street' with
'market void'; the p50..p90 band is the street-hierarchy read.
"""
import json, os, sys
from PIL import Image

grain = {r["file"]: r for r in json.load(open("MFS1-grain2.json")) if "error" not in r}
jobs = json.load(open("MFS1-streetjobs.json"))
out = []
for path, x0, y0, x1, y1, lab in jobs:
    key = os.path.basename(path).replace(".svg.png", "").replace(".png", "")
    g = grain.get(key)
    if not g: continue
    pitch = g["cell_pitch_px"]
    im = Image.open(path).convert("L"); W, H = im.size
    win = im.crop((int(W*x0), int(H*y0), int(W*x1), int(H*y1)))
    ww, wh = win.size; px = win.load()
    runs = []
    for k in range(120):
        y = int(wh*(k+.5)/120); row = [px[x, y] for x in range(ww)]
        thr = sum(row)/len(row) + 8; run = 0
        for v in row:
            if v >= thr: run += 1
            else:
                if 0 < run < ww*0.5: runs.append(run/pitch)
                run = 0
    for k in range(120):
        x = int(ww*(k+.5)/120); col = [px[x, y] for y in range(wh)]
        thr = sum(col)/len(col) + 8; run = 0
        for v in col:
            if v >= thr: run += 1
            else:
                if 0 < run < wh*0.5: runs.append(run/pitch)
                run = 0
    runs.sort()
    def q(f): return round(runs[min(len(runs)-1, int(len(runs)*f))], 2) if runs else None
    out.append({"file": key, "band": lab, "n": len(runs),
                "width_in_plot_widths": {"p25": q(.25), "p50": q(.50), "p75": q(.75),
                                          "p90": q(.90), "p97": q(.97), "p99": q(.99)},
                "hierarchy_ratio_p90_over_p25": round(q(.90)/max(q(.25), .01), 2) if runs else None,
                "hierarchy_ratio_p97_over_p50": round(q(.97)/max(q(.50), .01), 2) if runs else None})
print(json.dumps(out, indent=1))
