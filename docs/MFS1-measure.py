#!/usr/bin/env python3
"""MF-S1 reference-corpus pixel measurement (v2: urbanism + aesthetics).

HONEST SCOPE.
  MEASURED here: texture-density blocks (edge energy) as a proxy for built
  fabric; frame shares; radial density profile; palette clusters (median-cut)
  with hex + share; paper/ink extremes; value range; blue-excess water share;
  full-res paper-grain sigma; full-res ink-stroke width histogram.
  NOT measured (eye-estimated in the atlas, labelled as such): building
  footprints, block sizes, street widths in metres, court counts, wall gates.
"""
import sys, os, math, json
from collections import Counter
from PIL import Image

W = 640
BLK = 8
EDGE_T = 12
BUILT_T = 0.45   # smoothed block edge-fraction above which a block reads as DENSE BUILT FABRIC
URBAN_T = 0.30
OPEN_T = 0.10


def hexof(rgb):
    return "#%02X%02X%02X" % rgb


def analyze(prev_path, full_path=None):
    im = Image.open(prev_path)
    ow, oh = im.size
    h = int(round(oh * W / ow))
    small = im.convert("RGB").resize((W, h), Image.BILINEAR)
    ix, iy = int(W * 0.03), int(h * 0.03)
    small = small.crop((ix, iy, W - ix, h - iy))
    w2, h2 = small.size
    rgb = list(small.getdata())
    lum = [int(0.299 * r + 0.587 * g + 0.114 * b) for (r, g, b) in rgb]

    hist = [0] * 256
    for v in lum:
        hist[v] += 1
    paper = max(range(100, 256), key=lambda v: hist[v])

    edge = [0] * (w2 * h2)
    for y in range(h2 - 1):
        row, nrow = y * w2, (y + 1) * w2
        for x in range(w2 - 1):
            i = row + x
            if abs(lum[i] - lum[i + 1]) + abs(lum[i] - lum[nrow + x]) > EDGE_T:
                edge[i] = 1

    gw, gh = w2 // BLK, h2 // BLK
    raw = [[0.0] * gw for _ in range(gh)]
    for by in range(gh):
        for bx in range(gw):
            c = 0
            for y in range(by * BLK, by * BLK + BLK):
                row = y * w2
                for x in range(bx * BLK, bx * BLK + BLK):
                    c += edge[row + x]
            raw[by][bx] = c / float(BLK * BLK)
    # 3x3 smoothing
    dens = [[0.0] * gw for _ in range(gh)]
    for by in range(gh):
        for bx in range(gw):
            acc, n = 0.0, 0
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    yy, xx = by + dy, bx + dx
                    if 0 <= yy < gh and 0 <= xx < gw:
                        acc += raw[yy][xx]; n += 1
            dens[by][bx] = acc / n

    frame_blocks = gw * gh
    built = [(bx, by) for by in range(gh) for bx in range(gw) if dens[by][bx] > BUILT_T]
    urban = [(bx, by) for by in range(gh) for bx in range(gw) if dens[by][bx] > URBAN_T]
    built_share = len(built) / float(frame_blocks)
    urban_share = len(urban) / float(frame_blocks)

    anchor = built if len(built) >= 6 else urban
    if anchor:
        cx = sum(p[0] for p in anchor) / float(len(anchor))
        cy = sum(p[1] for p in anchor) / float(len(anchor))
        ds = sorted(math.hypot(bx - cx, by - cy) for bx, by in anchor)
        r50 = ds[int(len(ds) * 0.50)]
        r80 = ds[min(len(ds) - 1, int(len(ds) * 0.80))]
    else:
        cx, cy, r50, r80 = gw / 2.0, gh / 2.0, 0.0, 0.0

    halfdiag = math.hypot(gw / 2.0, gh / 2.0)
    # radial profile: 5 rings out to 2.0 * r80 (or half-diagonal if no core)
    R = max(r80 * 2.0, 4.0)
    rings = [[] for _ in range(5)]
    for by in range(gh):
        for bx in range(gw):
            d = math.hypot(bx - cx, by - cy)
            if d <= R:
                rings[int(min(4, d / R * 5))].append(dens[by][bx])
    prof = [round(sum(r) / len(r), 3) if r else 0.0 for r in rings]

    inside = [dens[by][bx] for by in range(gh) for bx in range(gw)
              if math.hypot(bx - cx, by - cy) <= max(r80, 2.0)]
    open_in = sum(1 for d in inside if d < OPEN_T) / float(len(inside)) if inside else 0.0
    built_in = sum(1 for d in inside if d > BUILT_T) / float(len(inside)) if inside else 0.0

    # ---- palette: median-cut clusters on a downsample, with hex + share ----
    q = small.resize((320, int(320 * h2 / w2)), Image.BILINEAR).quantize(
        colors=8, method=Image.MEDIANCUT).convert("RGB")
    cnt = Counter(q.getdata())
    tot = float(sum(cnt.values()))
    pal = [{"hex": hexof(c), "rgb": list(c), "share": round(n / tot, 3),
            "L": round(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2])}
           for c, n in cnt.most_common(8)]
    Ls = [p["L"] for p in pal]
    lightest = max(pal, key=lambda p: p["L"])
    darkest = min(pal, key=lambda p: p["L"])

    # blue-excess (water / cool pigment) share
    blue5 = sum(1 for (r, g, b) in rgb if b - r > 5) / float(len(rgb))
    blue18 = sum(1 for (r, g, b) in rgb if b - r > 18) / float(len(rgb))
    # green-excess (vegetation pigment)
    grn = sum(1 for (r, g, b) in rgb if g - (r + b) / 2.0 > 6) / float(len(rgb))
    # chroma: mean max-min across channels
    chroma = sum(max(p) - min(p) for p in rgb) / float(len(rgb))

    out = {
        "file": os.path.basename(prev_path).replace(".jpg", ""),
        "paper_L": paper,
        "built_share_frame": round(built_share, 3),
        "urban_share_frame": round(urban_share, 3),
        "core_centroid_norm": [round(cx / gw, 3), round(cy / gh, 3)],
        "r50_r80_blocks": [round(r50, 1), round(r80, 1)],
        "extent_r80_vs_halfdiag": round(r80 / halfdiag, 3),
        "radial_density_profile_to_2r80": prof,
        "center_edge_ratio": round(prof[0] / prof[4], 2) if prof[4] > 0.01 else None,
        "open_share_in_core": round(open_in, 3),
        "dense_share_in_core": round(built_in, 3),
        "palette8": pal,
        "paper_hex": lightest["hex"], "ink_hex": darkest["hex"],
        "value_range_L": [min(Ls), max(Ls)],
        "blue_excess_share_gt5": round(blue5, 3),
        "blue_excess_share_gt18": round(blue18, 3),
        "green_excess_share": round(grn, 3),
        "mean_chroma": round(chroma, 1),
    }

    # ---- full-res aesthetics: paper grain sigma + stroke-width histogram ----
    if full_path and os.path.exists(full_path):
        fim = Image.open(full_path).convert("L")
        fw, fh = fim.size
        # sample 12 windows, pick the flattest (lowest mean |grad|) => paper region
        best = None
        for gyi in range(3):
            for gxi in range(4):
                x0 = int(fw * (0.08 + 0.24 * gxi)); y0 = int(fh * (0.10 + 0.28 * gyi))
                win = fim.crop((x0, y0, x0 + 220, y0 + 220))
                px = list(win.getdata())
                gsum = 0
                for yy in range(219):
                    r0 = yy * 220
                    for xx in range(219):
                        gsum += abs(px[r0 + xx] - px[r0 + xx + 1])
                mg = gsum / (219.0 * 219.0)
                mean = sum(px) / float(len(px))
                var = sum((v - mean) ** 2 for v in px) / float(len(px))
                if best is None or mg < best[0]:
                    best = (mg, math.sqrt(var), mean)
        out["paper_grain"] = {"flattest_window_mean_abs_grad": round(best[0], 2),
                              "sigma_L": round(best[1], 2),
                              "mean_L": round(best[2], 1)}
        # stroke widths: scan 40 horizontal rows through the middle band, measure
        # run lengths of pixels darker than (localmean - 40)
        runs = []
        for k in range(40):
            y = int(fh * (0.25 + 0.5 * k / 40.0))
            row = list(fim.crop((int(fw * 0.15), y, int(fw * 0.85), y + 1)).getdata())
            m = sum(row) / float(len(row))
            thr = m - 45
            run = 0
            for v in row:
                if v < thr:
                    run += 1
                else:
                    if 0 < run <= 60:
                        runs.append(run)
                    run = 0
        if runs:
            runs.sort()
            out["stroke_runs_px"] = {
                "n": len(runs),
                "p10": runs[int(len(runs) * 0.10)],
                "p50": runs[int(len(runs) * 0.50)],
                "p90": runs[int(len(runs) * 0.90)],
                "p99": runs[min(len(runs) - 1, int(len(runs) * 0.99))],
                "max": runs[-1],
            }
    return out


if __name__ == "__main__":
    prevdir, fulldir = sys.argv[1], sys.argv[2]
    res = []
    for f in sorted(os.listdir(prevdir)):
        if not f.endswith(".jpg"):
            continue
        full = os.path.join(fulldir, f.replace(".jpg", ".png"))
        try:
            res.append(analyze(os.path.join(prevdir, f), full))
        except Exception as e:
            res.append({"file": f, "error": repr(e)})
    print(json.dumps(res, indent=1))
