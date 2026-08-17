#!/usr/bin/env python3
"""Built-vs-open share inside the settlement core window.
MEASURED: within a square window centred on the measured fabric centroid with
side = 1.6 x r80, classify every pixel of a 700px-wide downsample as
  PALE   (L >= paper-18)  -> street channel, square, blank ground
  FILL   (paper-18 > L >= paper-95) -> roof/ground wash, garden, yard
  INK    (L < paper-95)   -> heavy line / dark mass
Caveat stated in the atlas: FILL merges roofs with washed open ground, so
FILL is an upper bound on built share, not the built share itself.
"""
import sys, json, math, os
from PIL import Image

met = {r["file"]: r for r in json.load(open(sys.argv[1]))}
rows = []
for path in sys.argv[3:]:
    base = os.path.basename(path)
    key = base.replace(".png", "").replace(".svg", "")
    m = met.get(key) or met.get(key + ".svg") or met.get(base.replace(".png", ""))
    if m is None:
        rows.append({"file": base, "error": "no metric row"}); continue
    im = Image.open(path).convert("L")
    W, H = im.size
    cx, cy = m["core_centroid_norm"]
    r80 = m["r50_r80_blocks"][1]
    # metric grid: analysis width 640, 3% inset, block 8 -> blocks span 0.94*640/8
    gw = int(640 * 0.94) // 8
    side_frac = min(0.95, 1.6 * r80 / gw)
    sx, sy = int(W * max(0.0, cx - side_frac / 2)), int(H * max(0.0, cy - side_frac / 2))
    sw, sh = int(W * side_frac), int(H * side_frac)
    sw = min(sw, W - sx); sh = min(sh, H - sy)
    win = im.crop((sx, sy, sx + sw, sy + sh)).resize((700, max(1, int(700 * sh / sw))))
    px = list(win.getdata())
    hist = [0] * 256
    for v in px: hist[v] += 1
    paper = max(range(120, 256), key=lambda v: hist[v])
    pale = sum(1 for v in px if v >= paper - 18)
    ink = sum(1 for v in px if v < paper - 95)
    n = float(len(px))
    rows.append({"file": key, "paper_L": paper, "window_frac_of_plate": round(side_frac, 3),
                 "pale_share": round(pale / n, 3), "fill_share": round((n - pale - ink) / n, 3),
                 "ink_share": round(ink / n, 3)})
print(json.dumps(rows, indent=1))
