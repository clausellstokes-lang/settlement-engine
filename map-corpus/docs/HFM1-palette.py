#!/usr/bin/env python3
"""HF-M1 palette instrument — RECOVERED, not inherited.
MF-S1's §2.3.1 paper/ink figures ("mean RGB of the brightest 2% / darkest 0.5% per
plate") and its L-percentile line are NOT produced by any surviving MFS1-*.py script,
so this reimplements the stated definition on MF-S1's own image basis: the 640-px-wide,
3%-inset BILINEAR downsample that MFS1-measure.analyze() builds from the source plate.
Calibrated against the 49 paper/ink pairs published in the atlas's per-plate (k) rows.
"""
import sys, os, json
from PIL import Image

def hexof(t): return "#%02X%02X%02X" % t

def run(path):
    im = Image.open(path).convert("RGB")
    ow, oh = im.size
    h = int(round(oh * 640.0 / ow))
    small = im.resize((640, h), Image.BILINEAR)
    ix, iy = int(640 * 0.03), int(h * 0.03)
    small = small.crop((ix, iy, 640 - ix, h - iy))
    rgb = list(small.getdata())
    n = len(rgb)
    lum = [0.299*r + 0.587*g + 0.114*b for (r, g, b) in rgb]
    order = sorted(range(n), key=lambda i: lum[i])
    def mean(idx):
        s = [0.0, 0.0, 0.0]
        for i in idx:
            p = rgb[i]; s[0]+=p[0]; s[1]+=p[1]; s[2]+=p[2]
        k = float(len(idx))
        return hexof(tuple(int(round(v/k)) for v in s)), round(sum(lum[i] for i in idx)/k, 1)
    dk = order[:max(1, int(n*0.005))]
    br = order[-max(1, int(n*0.02)):]
    ink_hex, ink_L = mean(dk)
    paper_hex, paper_L = mean(br)
    sl = sorted(lum)
    pct = lambda f: round(sl[min(n-1, int(n*f))], 1)
    return {"file": os.path.basename(path).replace(".png",""),
            "paper_hex_2pct": paper_hex, "paper_L_2pct": paper_L,
            "ink_hex_05pct": ink_hex, "ink_L_05pct": ink_L,
            "L1": pct(.01), "L10": pct(.10), "L50": pct(.50), "L90": pct(.90), "L99": pct(.99),
            "L_range_1_99": round(pct(.99)-pct(.01), 1)}

if __name__ == "__main__":
    for p in sys.argv[1:]:
        print(json.dumps(run(p)))
        sys.stdout.flush()
