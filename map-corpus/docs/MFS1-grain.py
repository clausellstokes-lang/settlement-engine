#!/usr/bin/env python3
"""GRAIN: how many fabric cells fit across the settlement.
MEASURED: inside a square window centred on the fabric centroid (side = 1.2 x r80,
i.e. inside the built core), scan 90 horizontal and 90 vertical lines; count
dark RUNS (ink strokes/edges) per line; cell pitch = scanned length / runs.
Then cells_across_settlement = settlement diameter (2 x r80, in plate px) / pitch.
This measures the fabric's grain relative to its own extent -- the property that
separates a city that reads as a city from a village blown up to city size.
"""
import sys, json, math, os
from PIL import Image

met = {r["file"]: r for r in json.load(open(sys.argv[1]))}
rows = []
for path in sys.argv[2:]:
    base = os.path.basename(path)
    key = base.replace(".png", "").replace(".svg", "")
    m = met.get(key)
    if m is None:
        rows.append({"file": base, "error": "no metric row"}); continue
    im = Image.open(path).convert("L")
    W, H = im.size
    cx, cy = m["core_centroid_norm"]
    r80 = m["r50_r80_blocks"][1]
    gw = int(640 * 0.94) // 8                 # blocks across the analysis grid
    diam_frac = 2.0 * r80 / gw                # settlement diameter as a fraction of plate width
    side_frac = min(0.9, 1.2 * r80 / gw)
    sx = int(W * max(0.0, min(1 - side_frac, cx - side_frac / 2)))
    sy = int(H * max(0.0, min(1 - side_frac * W / H, cy - side_frac * W / H / 2)))
    sw = int(W * side_frac); sh = min(sw, H - sy)
    win = im.crop((sx, sy, sx + sw, sy + sh))
    ww, wh = win.size
    px = win.load()
    runs_h = []
    for k in range(90):
        y = int(wh * (k + 0.5) / 90)
        row = [px[x, y] for x in range(ww)]
        m0 = sum(row) / float(len(row)); thr = m0 - 30
        c, inrun = 0, False
        for v in row:
            if v < thr and not inrun: c += 1; inrun = True
            elif v >= thr: inrun = False
        if c: runs_h.append(c)
    for k in range(90):
        x = int(ww * (k + 0.5) / 90)
        col = [px[x, y] for y in range(wh)]
        m0 = sum(col) / float(len(col)); thr = m0 - 30
        c, inrun = 0, False
        for v in col:
            if v < thr and not inrun: c += 1; inrun = True
            elif v >= thr: inrun = False
        if c: runs_h.append(c)
    if not runs_h:
        rows.append({"file": key, "error": "no runs"}); continue
    runs_h.sort()
    med = runs_h[len(runs_h) // 2]
    pitch_px = ww / float(med)                     # px per fabric cell
    diam_px = diam_frac * W
    rows.append({"file": key, "window_side_px": ww,
                 "median_dark_runs_per_scan": med,
                 "cell_pitch_px": round(pitch_px, 1),
                 "cell_pitch_frac_of_plate_w": round(pitch_px / W, 4),
                 "settlement_diam_frac_of_plate_w": round(diam_frac, 3),
                 "CELLS_ACROSS_SETTLEMENT": round(diam_px / pitch_px, 1)})
print(json.dumps(rows, indent=1))
