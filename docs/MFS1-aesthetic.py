#!/usr/bin/env python3
"""MF-S1 aesthetic measurement: paper grain, wash variation, tone jitter, stroke width.

All numbers here are MEASURED on the full-resolution files.
  paper_grain_sigma : median luminance sigma inside small ink-free windows sitting
                      on BLANK PAPER. Flat vector paper -> ~0-1. Real grain -> 3+.
  wash_within_sigma : median luminance sigma inside small ink-free windows sitting
                      on a FILL (darker than paper, lighter than ink). A flat
                      vector fill -> ~0-1.5 (antialias/compression only).
                      A hand wash -> 3+.
  fill_tone_iqr     : inter-quartile spread of those windows' MEAN luminance =
                      the per-building/per-parcel tone-jitter band actually present.
  stroke_px         : dark-run lengths across horizontal scan lines, normalised to
                      a 5056px-wide plate so both corpora compare on one ruler.
"""
import sys, os, math, json, random
from PIL import Image

REF_W = 5056.0


def q(a, f):
    if not a:
        return None
    return a[min(len(a) - 1, int(len(a) * f))]


def measure(path):
    im = Image.open(path).convert("L")
    w, h = im.size
    px = im.load()
    scale = REF_W / w
    win = max(8, int(w * 0.0022))
    random.seed(1234)

    thumb = im.resize((400, max(1, int(400 * h / w))))
    hist = [0] * 256
    for v in thumb.getdata():
        hist[v] += 1
    paper = max(range(120, 256), key=lambda v: hist[v])

    paper_sigs, wash_sigs, wash_means = [], [], []
    for _ in range(14000):
        x = random.randint(int(w * 0.05), int(w * 0.95) - win)
        y = random.randint(int(h * 0.05), int(h * 0.95) - win)
        vals = [px[x + i, y + j] for j in range(win) for i in range(win)]
        mn, mx = min(vals), max(vals)
        if mx - mn > 26:
            continue                      # an ink edge crosses the window
        mean = sum(vals) / float(len(vals))
        sig = math.sqrt(sum((v - mean) ** 2 for v in vals) / float(len(vals)))
        if mean >= max(190, paper - 12):
            paper_sigs.append(sig)
        elif 60 <= mean < paper - 22:
            wash_sigs.append(sig)
            wash_means.append(mean)

    paper_sigs.sort(); wash_sigs.sort(); wash_means.sort()
    out = {
        "file": os.path.basename(path), "px": [w, h], "paper_L_mode": paper,
        "paper_grain_sigma_median": round(q(paper_sigs, 0.5), 2) if paper_sigs else None,
        "paper_grain_n": len(paper_sigs),
        "wash_within_sigma_median": round(q(wash_sigs, 0.5), 2) if wash_sigs else None,
        "wash_within_sigma_p90": round(q(wash_sigs, 0.9), 2) if wash_sigs else None,
        "wash_n": len(wash_sigs),
        "fill_tone_iqr_L": round(q(wash_means, 0.75) - q(wash_means, 0.25), 1) if wash_means else None,
        "fill_tone_p10_p90_L": [round(q(wash_means, 0.10), 1), round(q(wash_means, 0.90), 1)] if wash_means else None,
    }

    runs = []
    for k in range(60):
        y = int(h * (0.15 + 0.7 * k / 60.0))
        row = [px[x, y] for x in range(int(w * 0.12), int(w * 0.88))]
        m = sum(row) / float(len(row))
        thr = m - 45
        run = 0
        for v in row:
            if v < thr:
                run += 1
            else:
                if 0 < run <= int(80 / scale):
                    runs.append(run * scale)
                run = 0
    runs.sort()
    if runs:
        out["stroke_px_norm5056"] = {
            "n": len(runs), "p25": round(q(runs, 0.25), 1), "p50": round(q(runs, 0.50), 1),
            "p75": round(q(runs, 0.75), 1), "p90": round(q(runs, 0.90), 1),
            "p99": round(q(runs, 0.99), 1)}
        out["lineweight_ratio_p90_over_p25"] = round(q(runs, 0.90) / max(q(runs, 0.25), 0.1), 2)
    return out


if __name__ == "__main__":
    res = []
    for p in sys.argv[1:]:
        try:
            res.append(measure(p))
        except Exception as e:
            res.append({"file": os.path.basename(p), "error": repr(e)})
    print(json.dumps(res, indent=1))
