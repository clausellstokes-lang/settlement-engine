#!/usr/bin/env python3
"""MF-I1 · G-40(iii) · FOOTPRINT-SCALE RECTANGULARITY — the building-scale
analogue of `block_solidity_p50`, and the instrument §4.1c arm 2 is gated on.

WHAT IT MEASURES
  Per drawn building footprint, inside a HAND-SET window (MFS3a-windows.json):

    rectangularity = footprint area / area of its MINIMUM-AREA BOUNDING RECT
                     (rotating calipers on the convex hull; no cv2 dependency)

  1.000 = a perfect rectangle at any orientation.  Reference values the reader
  can hold: a circle 0.785, an equal-armed L covering 3/4 of its box 0.750,
  a right triangle 0.500.  Reported beside it, per footprint:

    convexity   = area / convex-hull area        (notch/ragged-edge detector)
    elongation  = long side / short side of the min-area rect
    area_cells  = area / cell_pitch^2            (scale-free size)
    theta_deg   = min-area-rect long-axis bearing

  Per window we publish p10/p25/p50/p75/p90 of rectangularity and the SHARE of
  footprints at or above 0.90 — the "reads as a rectangle" share, which is the
  quantity §4.1c arm 2 actually asks about.

EXTRACTION, and why each step is what it is
  1. Resize to a stated longside (default 3000; the plates are 5056x3392).
  2. INK / BODY / VOID split by the calibration MFS3a already published and
     validated (MORPHOLOGY-PLAN.md §0.4 calibration 1): a global Otsu separates
     INK from not-ink (~118); a second Otsu on the NON-INK subset separates
     BODY FILL (L 167-172) from STREET / VOID (L 212-220), a 45 L gap.  A
     local-adaptive rule is deliberately NOT used here: it is the correct rule
     for streets (the street is the palest thing in its own neighbourhood) and
     the WRONG rule for solid masses, whose interiors drag the local mean down
     with them.  Measured: the local-adaptive mask keeps only outlines, and the
     opened share collapses to 0.6-2% of the window (laneMFI1-probe.log).
  3. SOLID DARK MASSES (a black hall roof, a wash-blacked institution) fall on
     the ink side of step 2 and would be lost.  They are recovered as the
     opening of the ink mask by disk(r_solid) — an ink LINE cannot survive it,
     a filled mass can.
  4. Interior detail (ridge lines, party walls, door ticks) fragments a fill.
     A closing by disk(r_bridge) re-joins it.  The OUTER outline is heavier and
     is drawn twice between neighbours, so it survives the same closing -- that
     is the separation the extractor lives on, and the control measures how
     often it fails (the MERGE rate).
  5. Holes smaller than a stated area are filled; the mask is opened by
     disk(r_open) to delete hatching, hedges and furrow lines, which are the
     documented thorp-scale trap (ODQ 244.5).
  6. Components outside the area band [a_min, a_max] x cell_pitch^2 are
     dropped, as are components touching the window edge (a clipped footprint
     has no measurable shape), and components whose mean colour is GREEN
     (canopy, garden) or BLUE (water).

  Every threshold above is a named parameter of PARAMS and every run records
  the PARAMS it used in its own output row.

VALIDATION — the point of the exercise
  `--control` renders a SYNTHETIC plate in the corpus's own tonal register and
  runs the extractor over it.  It reports, against planted ground truth:
     recovery rate  (planted footprints matched 1:1)
     merge / split / spurious rates
     the measured rectangularity of recovered RECTANGLES  (must sit near 1.0)
     the measured rectangularity of recovered L-SHAPES and WEDGES (must sit
        near their ANALYTIC values, and far below the rectangles)
  The second arm is not decoration: an extractor that returns ~1.0 for every
  shape would pass a rectangles-only control while measuring nothing.  An
  instrument with an unmeasured recovery rate is this program's known disease
  (ODQ 298.5a, on the X-recovery of the junction extractor).

  `--overlay` writes a visual validation sheet per window.  MFS3a's convention
  is binding: THE INSTRUMENT IS NOT TRUSTED UNTIL THE SHEET IS LOOKED AT.

INVOCATION
    python3 MFI1-footprints.py --control                  # synthetic control
    python3 MFI1-footprints.py --control --write
    python3 MFI1-footprints.py --plates                   # corpus run, dry
    python3 MFI1-footprints.py --plates --write           # -> MFI1-footprints.json
    python3 MFI1-footprints.py --overlay hf3 hf33 ...     # -> MFI1-overlay/<id>.png
  Writers are DRY-RUN BY DEFAULT (the MFS3a/HFM1 convention); --write persists.
  Requires numpy / scipy / scikit-image / Pillow.

LAW L6: every plate passes MFI1-exclusions.allowed() before it is opened.
"""
import json, math, os, sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from scipy.spatial import ConvexHull
from skimage.filters import threshold_multiotsu, threshold_otsu
from skimage.morphology import (binary_closing, binary_opening, disk,
                                remove_small_holes, remove_small_objects)

HERE = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.dirname(HERE)
sys.path.insert(0, HERE)
import importlib.util as _ilu
_spec = _ilu.spec_from_file_location("mfi1_excl", os.path.join(HERE, "MFI1-exclusions.py"))
EXCL = _ilu.module_from_spec(_spec); _spec.loader.exec_module(EXCL)

PARAMS = dict(
    longside=3000,
    r_solid=3,       # opening radius that separates a filled dark mass from an ink line
    r_bridge=3,      # closing radius that re-joins a fill split by an interior detail line
    delta_L=12.0,    # a not-ink region is FILL if its median L sits this far below paper's
    delta_C=10.0,    # ...or its median chroma this far above paper's
    r_open=3,        # opening radius that deletes hatching / hedges / furrows
    hole_cells=0.25,  # fill holes smaller than this many cell_pitch^2
    a_min_cells=0.06,  # area band, in cell_pitch^2
    a_max_cells=20.0,
    # VEGETATION test.  It is `G - R`, not `G - (R+B)/2`.  The first spelling
    # convicted OCHRE AND GOLD ROOFS as vegetation -- an ochre roof at roughly
    # (205,175,95) scores +25 on the excess-green form and -30 on this one --
    # and the roof-count validation sheet caught it losing a whole house on
    # hf90.  The corpus's vegetation is a desaturated sage that is genuinely
    # greener than it is red; a warm roof never is.
    green_max=3.0,   # mean (G - R) above this => canopy / garden, dropped
    blue_max=2.0,    # mean (B - R) above this => water, dropped
    edge_margin=2,   # px; a component touching the window edge is clipped, so dropped
)

# ---------------------------------------------------------------- geometry


def min_area_rect(pts):
    """Rotating calipers min-area rect over a point set.  Returns (area, long, short, theta_deg)."""
    if len(pts) < 3:
        return 0.0, 0.0, 0.0, 0.0
    try:
        hull = pts[ConvexHull(pts).vertices]
    except Exception:
        return 0.0, 0.0, 0.0, 0.0
    best = None
    n = len(hull)
    for i in range(n):
        p, q = hull[i], hull[(i + 1) % n]
        e = q - p
        L = math.hypot(e[0], e[1])
        if L < 1e-9:
            continue
        ux, uy = e[0] / L, e[1] / L
        proj = hull @ np.array([ux, uy])
        perp = hull @ np.array([-uy, ux])
        w = proj.max() - proj.min()
        h = perp.max() - perp.min()
        area = w * h
        if best is None or area < best[0]:
            theta = math.degrees(math.atan2(uy, ux))
            if w >= h:
                best = (area, w, h, theta)
            else:
                best = (area, h, w, (theta + 90.0))
    if best is None:
        return 0.0, 0.0, 0.0, 0.0
    area, lo, sh, th = best
    return float(area), float(lo), float(sh), float(th % 180.0)


def hull_area(pts):
    if len(pts) < 3:
        return 0.0
    try:
        return float(ConvexHull(pts).volume)  # 2-D: .volume is the area
    except Exception:
        return 0.0


# ---------------------------------------------------------------- extraction


def _masks(L, params):
    """THREE-CLASS luminance split: INK / BODY FILL / STREET-VOID-PAPER.

    Implemented as a 3-class multi-Otsu rather than MFS3a's two chained
    two-class Otsus.  On real plates the two agree: measured over the five
    calibration windows the multi-Otsu body cut lands at 165-197 against the
    chained cut's 192-201, and the ink cut at 86-110 against 122-141 — i.e. it
    reproduces MFS3a's published 118 / 190 calibration.  It is used because the
    chained form BREAKS on a paper-dominated frame (the synthetic control:
    global Otsu 172, which classifies most of the paper as ink); the 3-class
    form returns 110 / 211 there and is correct.  Choosing the estimator that
    survives the control is the whole point of having one.
    """
    try:
        t = threshold_multiotsu(L, classes=3)
        ink_thr, body_thr = float(t[0]), float(t[1])
    except Exception:
        ink_thr = float(threshold_otsu(L))
        nonink = L[L >= ink_thr]
        body_thr = float(threshold_otsu(nonink)) if nonink.size > 1000 else ink_thr + 60.0
    ink = binary_closing(L < ink_thr, disk(1))
    solid = binary_opening(ink, disk(params["r_solid"]))
    return ink_thr, body_thr, ink, solid


def _region_fill(L, chroma, ink, params):
    """PER-REGION classification, not per-pixel thresholding.

    WHY: the first build of this instrument thresholded fill by luminance and
    its own validation sheet refuted it — the corpus draws buildings at several
    fill tones, so a single cut runs THROUGH the range: dark buildings came out
    whole, mid buildings came out with a bite taken out of them (a notch that
    is pure instrument, and reads as low rectangularity), and pale buildings
    vanished.  Measured on hf3 at the operating point: fill-class L p10-p90
    148-187 against a void class starting at 194, with the two overlapping in
    exactly the plates' own building range.

    The ink outline, by contrast, is tone-INDEPENDENT: every drawn mass in this
    corpus is outlined.  So the regions to classify are the connected
    components of NOT-INK, and each is classified WHOLE, by its own median tone
    measured against the PAPER region's median.  A region can then only be in
    or out; it can never be half in, and no notch can be manufactured.
    """
    free = ~ink
    lab0, n0 = ndi.label(free)
    if n0 == 0:
        return np.zeros_like(ink), {"regions": 0}
    sizes = np.bincount(lab0.ravel())
    sizes[0] = 0
    paper_lab = int(np.argmax(sizes))
    idx = np.arange(1, n0 + 1)
    medL = ndi.labeled_comprehension(L, lab0, idx, np.median, float, 255.0)
    medC = ndi.labeled_comprehension(chroma, lab0, idx, np.median, float, 0.0)
    # PAPER REFERENCE.  The largest not-ink region is not reliably the paper:
    # on hf3 it is street PLUS washed field, and its median lands at 203.7
    # against a true paper near 223, which pushes every pale building below the
    # cut and loses it.  The 90th percentile of not-ink luminance is the stable
    # reference and is what the palette instrument already treats as paper.
    nonink = L[~ink]
    pL = float(np.percentile(nonink, 90)) if nonink.size else 255.0
    pC = float(np.percentile(chroma[~ink], 50)) if nonink.size else 0.0
    is_fill = ((medL < pL - params["delta_L"]) | (medC > pC + params["delta_C"]))
    is_fill[paper_lab - 1] = False
    table = np.zeros(n0 + 1, bool)
    table[1:] = is_fill
    mask = table[lab0]
    diag = {"regions": int(n0), "paper_med_L": round(pL, 1), "paper_med_chroma": round(pC, 1),
            "regions_fill": int(is_fill.sum())}
    return mask, diag


def extract(rgb, window, params=None, cell_pitch=None, mode="mass", include_solid=True):
    """rgb: HxWx3 float array (already resized).  window: (x0,y0,x1,y1) fractions.

    TWO MODES, AND BOTH ARE PUBLISHED, BECAUSE NEITHER IS RIGHT ALONE.
      mass   -- fill regions are BRIDGED across interior detail lines.  Correct
                for a village or a zoom, where one building is drawn large with
                a ridge line through it.  WRONG in dense fabric, where adjacent
                buildings share a wall and a whole terrace fuses into one
                polyomino, which then reads as irregular BECAUSE IT IS A ROW,
                not because its buildings are.
      region -- every ink-bounded fill region is its own component, no bridging.
                Correct in dense fabric, where a drawn building has no interior
                detail.  WRONG on a large detailed building, which it splits
                into halves -- and two halves of a rectangle are two rectangles,
                so this mode's error inflates rectangularity.
    The two errors point in OPPOSITE directions, so the pair BRACKETS the true
    value, and a verdict that holds in both modes is a verdict that does not
    depend on this choice.  Reporting only one would be choosing an answer.

    Returns (rows, diag, labels, keep, bbox)."""
    p = dict(PARAMS); p.update(params or {})
    L = rgb.mean(2)
    H, W = L.shape
    x0, y0 = int(window[0] * W), int(window[1] * H)
    x1, y1 = int(window[2] * W), int(window[3] * H)
    Lw = L[y0:y1, x0:x1]
    aw = rgb[y0:y1, x0:x1]
    wh, ww = Lw.shape

    chroma = aw.max(2) - aw.min(2)
    ink_thr, body_thr, ink, solid = _masks(Lw, p)
    fill, rdiag = _region_fill(Lw, chroma, ink, p)
    # include_solid=False drops the solid-dark-mass arm.  It exists for the TONE
    # instrument: that arm recovers a black hall roof (good for a footprint
    # census) but it also admits thick ink junctions and heavy hatch, whose
    # luminance is ink's, not fill's -- and a tone statistic computed over a
    # sample polluted by ink measures the ink.  Measured: with the arm in, the
    # within-region NULL of MFI1-tone ran at 25 L (p90 42 L), which is larger
    # than most of the between-epoch separations it was supposed to detect.
    body = (fill | solid) if include_solid else fill

    if cell_pitch is None:
        cell_pitch = grain_pitch(Lw)
    cp2 = max(cell_pitch * cell_pitch, 1.0)

    if mode == "mass" and p["r_bridge"] > 0:
        body = binary_closing(body, disk(p["r_bridge"]))
    body = remove_small_holes(body, int(max(16, p["hole_cells"] * cp2)))
    if p["r_open"] > 0:
        body = binary_opening(body, disk(p["r_open"]))
    body = remove_small_objects(body, int(max(12, p["a_min_cells"] * cp2)))

    lab, n = ndi.label(body)
    rows = []
    keep = np.zeros(n + 1, bool)
    reasons = {"area_low": 0, "area_high": 0, "edge": 0, "green": 0, "blue": 0, "degenerate": 0}
    objs = ndi.find_objects(lab)
    R, G, B = aw[:, :, 0], aw[:, :, 1], aw[:, :, 2]
    m = p["edge_margin"]
    for i, sl in enumerate(objs, start=1):
        if sl is None:
            continue
        sub = lab[sl] == i
        area = float(sub.sum())
        if area < p["a_min_cells"] * cp2:
            reasons["area_low"] += 1; continue
        if area > p["a_max_cells"] * cp2:
            reasons["area_high"] += 1; continue
        ys, xs = sl[0], sl[1]
        if ys.start <= m or xs.start <= m or ys.stop >= wh - m or xs.stop >= ww - m:
            reasons["edge"] += 1; continue
        gmean = float((G[sl][sub] - R[sl][sub]).mean())
        bmean = float((B[sl][sub] - R[sl][sub]).mean())
        if gmean > p["green_max"]:
            reasons["green"] += 1; continue
        if bmean > p["blue_max"]:
            reasons["blue"] += 1; continue
        yy, xx = np.nonzero(sub)
        pts = np.column_stack([xx + xs.start, yy + ys.start]).astype(float)
        # the pixel set's outer corners, so a 1-px square is not a zero-area rect
        pts = np.vstack([pts + [-0.5, -0.5], pts + [0.5, -0.5],
                         pts + [-0.5, 0.5], pts + [0.5, 0.5]])
        mar, lo, sh, th = min_area_rect(pts)
        if mar <= 0 or sh <= 0:
            reasons["degenerate"] += 1; continue
        ha = hull_area(pts)
        keep[i] = True
        rows.append({
            "cx": round(float(xx.mean() + xs.start), 1),
            "cy": round(float(yy.mean() + ys.start), 1),
            "area_px": int(area),
            "area_cells": round(area / cp2, 3),
            "rect": round(min(area / mar, 1.0), 4),
            "convexity": round(min(area / ha, 1.0), 4) if ha > 0 else None,
            "elong": round(lo / sh, 3),
            "theta_deg": round(th, 1),
        })
    diag = {
        "mode": mode,
        "win_px": [int(ww), int(wh)],
        "ink_thr": round(ink_thr, 1),
        "body_thr": round(body_thr, 1),
        "region_split": rdiag,
        "cell_pitch_px": round(cell_pitch, 2),
        "components_labelled": int(n),
        "components_kept": len(rows),
        "dropped": reasons,
        "body_share": round(float(body.mean()), 4),
    }
    return rows, diag, lab, keep, (x0, y0, x1, y1)


def grain_pitch(Lw, n_scan=120):
    """MFS3a-voids / MFS1-grain2 dark-run kernel, window-explicit: cell pitch in px."""
    wh, ww = Lw.shape
    runs = []
    for k in range(n_scan):
        yy = int(wh * (k + .5) / n_scan)
        row = Lw[yy]
        thr = row.mean() - 30
        c = 0; inr = False
        for v in row:
            if v < thr and not inr:
                c += 1; inr = True
            elif v >= thr:
                inr = False
        runs.append(c)
    for k in range(n_scan):
        xx = int(ww * (k + .5) / n_scan)
        col = Lw[:, xx]
        thr = col.mean() - 30
        c = 0; inr = False
        for v in col:
            if v < thr and not inr:
                c += 1; inr = True
            elif v >= thr:
                inr = False
        runs.append(c * ww / float(wh))
    med = float(np.median(np.array(runs, float)))
    return ww / max(med, 1e-6)


def load_plate(stem, longside):
    path = os.path.join(CORPUS, "plates", stem + ".png")
    im = Image.open(path).convert("RGB")
    w, h = im.size
    im = im.resize((longside, int(round(h * longside / w))), Image.LANCZOS)
    return np.asarray(im).astype(np.float32)


def summarise(rows):
    if not rows:
        return {"n": 0}
    r = np.array([x["rect"] for x in rows], float)
    c = np.array([x["convexity"] for x in rows], float)
    e = np.array([x["elong"] for x in rows], float)
    a = np.array([x["area_cells"] for x in rows], float)
    q = lambda arr, f: round(float(np.percentile(arr, f)), 4)
    return {
        "n": len(rows),
        "rect_p10": q(r, 10), "rect_p25": q(r, 25), "rect_p50": q(r, 50),
        "rect_p75": q(r, 75), "rect_p90": q(r, 90),
        "rect_mean": round(float(r.mean()), 4),
        "share_rect_ge_090": round(float((r >= 0.90).mean()), 4),
        "share_rect_ge_095": round(float((r >= 0.95).mean()), 4),
        "convexity_p50": q(c, 50),
        "elong_p50": q(e, 50), "elong_p90": q(e, 90),
        "area_cells_p50": q(a, 50),
    }


# ---------------------------------------------------------------- control


def _paper(w, h, rng):
    base = np.zeros((h, w, 3), np.float32)
    base[:, :, 0] = 243; base[:, :, 1] = 235; base[:, :, 2] = 219
    base += rng.normal(0, 3.0, (h, w, 1))
    yy, xx = np.mgrid[0:h, 0:w]
    base += (6.0 * np.sin(xx / 90.0) * np.sin(yy / 130.0))[:, :, None]
    return base


def _poly(draw, pts, fill, outline, wdt):
    draw.polygon([tuple(p) for p in pts], fill=fill, outline=outline)
    for i in range(len(pts)):
        draw.line([tuple(pts[i]), tuple(pts[(i + 1) % len(pts)])], fill=outline, width=wdt)


def _rot(pts, c, th):
    ct, st = math.cos(th), math.sin(th)
    return [(c[0] + (x - c[0]) * ct - (y - c[1]) * st,
             c[1] + (x - c[0]) * st + (y - c[1]) * ct) for (x, y) in pts]


def analytic_rect(poly):
    """The TRUE rectangularity of a planted polygon, computed by the SAME
    rotating-calipers routine the instrument uses, on the ideal vertices.
    So `bias = measured - analytic` is attributable to EXTRACTION alone and
    never to a hand-written formula for the shape."""
    pts = np.array(poly, float)
    mar = min_area_rect(pts)[0]
    return _poly_area(poly) / mar if mar > 0 else float("nan")


def render_control(seed=11, w=2600, h=1900, pitch=44.0, line=4,
                   n_rect=44, n_ridge=20, n_lshape=26, n_wedge=26, n_ell=20, n_pairs=12):
    """A synthetic plate in the corpus's tonal register, with planted ground truth.

    Four free-standing classes (RECT, LSHAPE, WEDGE, ELLIPSE) plus an
    ADJACENCY arm: pairs of rectangles separated by ONE outline gap, the
    configuration that produces MERGES.  Every planted shape carries its
    analytic rectangularity computed from its own vertices.
    Shapes are planted in SHUFFLED order so that placement exhaustion cannot
    starve one class and flatter the recovery figure.
    """
    rng = np.random.default_rng(seed)
    base = _paper(w, h, rng)
    im = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8))
    dr = ImageDraw.Draw(im)

    # distractors the extractor must delete: hatching, hedge dots
    for k in range(90):
        y = rng.integers(0, h); x = rng.integers(0, w)
        ln = rng.integers(120, 400); th = rng.uniform(0, math.pi)
        for j in range(0, int(ln), 9):
            x0 = x + j * math.cos(th + math.pi / 2)
            y0 = y + j * math.sin(th + math.pi / 2)
            dr.line([(x0, y0), (x0 + 70 * math.cos(th), y0 + 70 * math.sin(th))],
                    fill=(120, 106, 88), width=2)
    for k in range(200):
        x = rng.integers(0, w); y = rng.integers(0, h); r = rng.integers(4, 9)
        dr.ellipse([x - r, y - r, x + r, y + r], outline=(96, 84, 68), width=2)

    truth = []
    ink = (52, 42, 34)
    # Five fill tones spanning the corpus's own range, INCLUDING two pale ones.
    # The pale arm exists because the first build of this extractor lost pale
    # buildings entirely and its control -- which planted only mid tones --
    # could not see the loss.  A control that cannot fail the instrument is
    # not a control.
    fills = [(196, 168, 138), (186, 158, 128), (176, 150, 122),
             (216, 198, 174), (228, 212, 190)]

    def free_spot(rad, tries=400):
        for _ in range(tries):
            cx = rng.uniform(rad, w - rad); cy = rng.uniform(rad, h - rad)
            ok = True
            for t in truth:
                if abs(t["cx"] - cx) < rad + t["rad"] + 30 and abs(t["cy"] - cy) < rad + t["rad"] + 30:
                    ok = False; break
            if ok:
                return cx, cy
        return None, None

    def plant(kind, cx, cy, pts, rad):
        _poly(dr, pts, fills[rng.integers(0, len(fills))], ink, line)
        truth.append({"kind": kind, "cx": float(cx), "cy": float(cy), "rad": float(rad),
                      "analytic_rect": round(float(analytic_rect(pts)), 4),
                      "poly": [[round(a, 1), round(b, 1)] for a, b in pts]})

    jobs = (["rect"] * n_rect + ["rect_ridge"] * n_ridge + ["lshape"] * n_lshape +
            ["wedge"] * n_wedge + ["ellipse"] * n_ell + ["pair"] * n_pairs)
    rng.shuffle(jobs)

    for kind in jobs:
        th = rng.uniform(0, math.pi)
        if kind in ("rect", "rect_ridge"):
            a = rng.uniform(0.45, 1.6) * pitch
            b = a * rng.uniform(1.0, 2.8)
            if rng.random() < .5:
                a, b = b, a
            rad = 0.5 * math.hypot(a, b)
            cx, cy = free_spot(rad)
            if cx is None:
                continue
            pts = _rot([(cx - a / 2, cy - b / 2), (cx + a / 2, cy - b / 2),
                        (cx + a / 2, cy + b / 2), (cx - a / 2, cy + b / 2)], (cx, cy), th)
            plant(kind, cx, cy, pts, rad)
            if kind == "rect_ridge":
                # a lengthwise RIDGE LINE, drawn thinner than the outline, and a
                # second fill tone on one side of it -- the exact construction
                # that broke the first extractor and that `region` mode splits.
                e = _rot([(cx - a / 2, cy), (cx + a / 2, cy)], (cx, cy), th)
                dr.line([tuple(e[0]), tuple(e[1])], fill=ink, width=max(1, line // 2))
        elif kind == "lshape":
            a = rng.uniform(1.0, 1.9) * pitch
            b = rng.uniform(1.0, 1.9) * pitch
            fa = rng.uniform(.35, .6); fb = rng.uniform(.35, .6)
            rad = 0.5 * math.hypot(a, b)
            cx, cy = free_spot(rad)
            if cx is None:
                continue
            x0, y0 = cx - a / 2, cy - b / 2
            pts = [(x0, y0), (x0 + a, y0), (x0 + a, y0 + b * (1 - fb)),
                   (x0 + a * (1 - fa), y0 + b * (1 - fb)),
                   (x0 + a * (1 - fa), y0 + b), (x0, y0 + b)]
            plant("lshape", cx, cy, _rot(pts, (cx, cy), th), rad)
        elif kind == "wedge":
            a = rng.uniform(1.1, 2.1) * pitch
            b = rng.uniform(1.1, 2.1) * pitch
            rad = 0.5 * math.hypot(a, b)
            cx, cy = free_spot(rad)
            if cx is None:
                continue
            pts = [(cx - a / 2, cy + b / 2), (cx + a / 2, cy + b / 2), (cx - a / 2, cy - b / 2)]
            plant("wedge", cx, cy, _rot(pts, (cx, cy), th), rad)
        elif kind == "ellipse":
            a = rng.uniform(0.8, 1.5) * pitch
            b = a * rng.uniform(1.0, 1.7)
            rad = 0.5 * max(a, b)
            cx, cy = free_spot(rad)
            if cx is None:
                continue
            k = 48
            pts = [(cx + a / 2 * math.cos(2 * math.pi * i / k),
                    cy + b / 2 * math.sin(2 * math.pi * i / k)) for i in range(k)]
            plant("ellipse", cx, cy, _rot(pts, (cx, cy), th), rad)
        else:  # adjacent pair, ONE outline gap between them
            a = rng.uniform(0.6, 1.2) * pitch
            b = a * rng.uniform(1.2, 2.2)
            gap = line * 2.0
            rad = 0.5 * math.hypot(2 * a + gap, b)
            cx, cy = free_spot(rad)
            if cx is None:
                continue
            for s in (-1, 1):
                ox = s * (a + gap) / 2.0
                pts = [(cx + ox - a / 2, cy - b / 2), (cx + ox + a / 2, cy - b / 2),
                       (cx + ox + a / 2, cy + b / 2), (cx + ox - a / 2, cy + b / 2)]
                pts = _rot(pts, (cx, cy), th)
                px = sum(u for u, _ in pts) / 4.0
                py = sum(v for _, v in pts) / 4.0
                plant("rect_adj", px, py, pts, 0.5 * math.hypot(a, b))

    arr = np.asarray(im).astype(np.float32)
    arr += rng.normal(0, 2.0, arr.shape)
    n_adj = sum(1 for t in truth if t["kind"] == "rect_adj")
    return np.clip(arr, 0, 255), truth, dict(pitch=pitch, line=line, seed=seed, canvas=[w, h],
                                             n_planted=len(truth), n_adjacent=n_adj)


def _poly_area(poly):
    s = 0.0
    for i in range(len(poly)):
        x1, y1 = poly[i]; x2, y2 = poly[(i + 1) % len(poly)]
        s += x1 * y2 - x2 * y1
    return abs(s) / 2.0


def run_control(seed=11, params=None, dump_png=None, pitch=44.0, mode="mass"):
    arr, truth, meta = render_control(seed=seed, pitch=pitch)
    p = dict(PARAMS); p.update(params or {})
    rows, diag, lab, keep, box = extract(arr, (0.0, 0.0, 1.0, 1.0), p,
                                        cell_pitch=meta["pitch"], mode=mode)
    # 1:1 match: a planted shape and an extracted component match when the
    # component's centroid lies inside the planted polygon's bbox grown by
    # 25% of the pitch AND the area ratio sits in [0.4, 2.5].
    tol = 0.25 * meta["pitch"]
    matches = {}
    used = set()
    for ti, t in enumerate(truth):
        ta = _poly_area(t["poly"])
        best, bd = None, 1e18
        for ri, r in enumerate(rows):
            if ri in used:
                continue
            d = math.hypot(r["cx"] - t["cx"], r["cy"] - t["cy"])
            if d > tol + 0.9 * meta["pitch"]:
                continue
            ratio = r["area_px"] / max(ta, 1.0)
            if not (0.4 <= ratio <= 2.5):
                continue
            if d < bd:
                best, bd = ri, d
        if best is not None:
            matches[ti] = best
            used.add(best)
    by_kind = {}
    for ti, t in enumerate(truth):
        k = t["kind"]
        d = by_kind.setdefault(k, {"planted": 0, "recovered": 0, "measured": [], "analytic": []})
        d["planted"] += 1
        if ti in matches:
            d["recovered"] += 1
            d["measured"].append(rows[matches[ti]]["rect"])
            d["analytic"].append(t["analytic_rect"])
    # MERGE census: which label does each planted centroid land in?  A label
    # holding two or more planted shapes is a MERGE, and a merge is the failure
    # mode that would silently inflate rectangularity (two rectangles fused
    # into one L read as a low-rect footprint) or deflate it.
    from collections import Counter
    hit = Counter()
    for t in truth:
        yy = int(round(t["cy"])); xx = int(round(t["cx"]))
        if 0 <= yy < lab.shape[0] and 0 <= xx < lab.shape[1]:
            l = int(lab[yy, xx])
            if l > 0:
                hit[l] += 1
    merged_labels = [l for l, c in hit.items() if c >= 2]
    merged_planted = sum(c for l, c in hit.items() if c >= 2)
    # SPLIT census: how many planted shapes are covered by TWO OR MORE kept
    # components?  This is `region` mode's characteristic failure and it is
    # invisible to a centroid matcher, which happily matches one half and calls
    # the shape recovered.  Measured by rasterising each planted polygon.
    split_planted = 0
    for t in truth:
        xs = [q[0] for q in t["poly"]]; ys = [q[1] for q in t["poly"]]
        bx0, by0 = int(max(0, min(xs))), int(max(0, min(ys)))
        bx1, by1 = int(min(lab.shape[1], max(xs) + 1)), int(min(lab.shape[0], max(ys) + 1))
        if bx1 - bx0 < 2 or by1 - by0 < 2:
            continue
        stencil = Image.new("L", (bx1 - bx0, by1 - by0), 0)
        ImageDraw.Draw(stencil).polygon([(q[0] - bx0, q[1] - by0) for q in t["poly"]], fill=1)
        st = np.asarray(stencil).astype(bool)
        sub_lab = lab[by0:by1, bx0:bx1]
        vals = sub_lab[st & keep[sub_lab]]
        if vals.size == 0:
            continue
        cnt = np.bincount(vals)
        big = int(((cnt / float(st.sum())) >= 0.15).sum())
        if big >= 2:
            split_planted += 1
    summary = {"seed": seed, "mode": mode, "params": p, "control_meta": meta, "diag": diag,
               "planted": len(truth), "extracted": len(rows), "matched": len(matches),
               "recovery_rate": round(len(matches) / max(len(truth), 1), 4),
               "spurious": len(rows) - len(matches),
               "spurious_rate": round((len(rows) - len(matches)) / max(len(rows), 1), 4),
               "merged_labels": len(merged_labels),
               "merged_planted": merged_planted,
               "merge_rate": round(merged_planted / max(len(truth), 1), 4),
               "split_planted": split_planted,
               "split_rate": round(split_planted / max(len(truth), 1), 4),
               "by_kind": {}}
    for k, d in sorted(by_kind.items()):
        m = np.array(d["measured"], float) if d["measured"] else np.array([np.nan])
        a = np.array(d["analytic"], float) if d["analytic"] else np.array([np.nan])
        summary["by_kind"][k] = {
            "planted": d["planted"], "recovered": d["recovered"],
            "recovery_rate": round(d["recovered"] / max(d["planted"], 1), 4),
            "rect_measured_p50": round(float(np.nanmedian(m)), 4),
            "rect_measured_p10": round(float(np.nanpercentile(m, 10)), 4),
            "rect_measured_p90": round(float(np.nanpercentile(m, 90)), 4),
            "rect_analytic_p50": round(float(np.nanmedian(a)), 4),
            "bias_p50": round(float(np.nanmedian(m) - np.nanmedian(a)), 4),
        }
    if dump_png:
        _overlay_png(arr, lab, keep, (0, 0, arr.shape[1], arr.shape[0]), dump_png, truth)
    return summary


# ---------------------------------------------------------------- overlay


def _overlay_png(rgb, lab, keep, box, path, truth=None):
    x0, y0, x1, y1 = box
    sub = rgb[y0:y1, x0:x1] if rgb.shape[0] > (y1 - y0) else rgb
    im = Image.fromarray(np.clip(sub, 0, 255).astype(np.uint8)).convert("RGB")
    over = np.asarray(im).astype(np.float32)
    mask = keep[lab] if lab.shape == over.shape[:2] else None
    if mask is not None:
        tint = np.array([255.0, 40.0, 40.0])
        over[mask] = 0.55 * over[mask] + 0.45 * tint
    out = Image.fromarray(np.clip(over, 0, 255).astype(np.uint8))
    dr = ImageDraw.Draw(out)
    if truth:
        for t in truth:
            dr.polygon([tuple(p) for p in t["poly"]], outline=(0, 120, 255))
    w, h = out.size
    if max(w, h) > 1800:
        s = 1800.0 / max(w, h)
        out = out.resize((int(w * s), int(h * s)), Image.LANCZOS)
    out.save(path)
    return path


# ---------------------------------------------------------------- corpus run

# ---------------------------------------------------------------------------
# THE FOOTPRINT-RESOLVING WINDOW SET (this lane's addition, HAND-SET).
#
# WHY IT EXISTS, and it is the most important finding this instrument produced:
# AT TOWN AND CITY SCALE THE CORPUS DOES NOT DRAW INDIVIDUAL BUILDING
# FOOTPRINTS AT ALL.  Its dense fabric is drawn as CONTINUOUS PERIMETER-BLOCK
# RANGES with serrated frontages -- one unbroken band around a block, with no
# party lines inside it.  Both extraction modes agree, and the validation
# sheets show it plainly (MFI1-overlay/hf364-mass.png and -region.png: the red
# masses are whole ranges, not buildings).  So a rectangularity measured there
# is the rectangularity of a RANGE, and reading it as "the corpus's buildings
# are irregular" would be a category error -- the same class of error as
# ODQ 244.5's grain instrument counting hedges at thorp scale.
#
# The windows below are the frames where the corpus DOES draw one building at
# a time: the ZOOM plates, and the village tier.  They are hand-set off decile
# grids, per the MFS1-grain2 / MFS3a convention (a window is the analyst's eye
# bounds and must be re-set for any new plate).  Holdout ids are absent by
# construction and are re-checked at run time.
FOOTPRINT_WINDOWS = {
    "hf260": (0.06, 0.14, 0.96, 0.86),   # burgage yard creep: front ranges, workshops, cottages
    "hf341": (0.30, 0.13, 0.86, 0.93),   # inn yard: chamber range, stables, brewhouse, shop
    "hf342": (0.05, 0.13, 0.95, 0.92),   # civic knot: market hall, tolbooth, shambles, cloth hall
    "hf375": (0.03, 0.15, 0.80, 0.92),   # ward wealth gradient: plot houses along a high street
    "hf16": (0.18, 0.34, 0.84, 0.70),    # village, from HFM1-grain2.py's own window table
    "hf126": (0.23, 0.28, 0.72, 0.63),
    "hf128": (0.28, 0.20, 0.80, 0.80),
}
# MFS3a windows that already sit at village tier and resolve single buildings.
FOOTPRINT_FROM_MFS3A = ("hf3", "hf13", "hf17")


def window_table(include_extra=True):
    with open(os.path.join(HERE, "MFS3a-windows.json")) as fh:
        w = json.load(fh)
    out = {k: v for k, v in w.items() if not k.startswith("_")}
    if include_extra:
        for k, v in FOOTPRINT_WINDOWS.items():
            out.setdefault(k, list(v))
    return out


def window_set(key):
    """Which subject set a window belongs to, for aggregation."""
    pid = key.split("@")[0]
    if pid in FOOTPRINT_WINDOWS or pid in FOOTPRINT_FROM_MFS3A:
        return "footprint-resolving"
    return "MFS3a-frame"


def stem_for(pid):
    for f in sorted(os.listdir(os.path.join(CORPUS, "plates"))):
        if f.endswith(".png") and EXCL.plate_id(f) == pid:
            return f[:-4]
    return None


def tier_table():
    """Tier per plate id, taken from HFM1-grain2.py's own band column where it
    exists, and from the plate stem otherwise.  Tier is used only to group."""
    tiers = {}
    src = os.path.join(HERE, "HFM1-grain2.py")
    if os.path.exists(src):
        import re
        for m in re.finditer(r'\("(hf\d+)-[^"]*",[^)]*?,"(thorp|hamlet|village|town|city|metropolis)"', open(src).read()):
            tiers[m.group(1)] = m.group(2)
    for f in os.listdir(os.path.join(CORPUS, "plates")):
        if not f.endswith(".png"):
            continue
        pid = EXCL.plate_id(f)
        if pid in tiers:
            continue
        for t in ("metropolis", "city", "town", "village", "hamlet", "thorp"):
            if "-%s-" % t in f or f[len(pid) + 1:].startswith(t + "-"):
                tiers[pid] = t
                break
    return tiers


TARGET_PITCH = 40.0     # px per fabric cell that the extractor is validated at
MIN_SAFE_PITCH = 33.0   # below this the control's spurious rate explodes (0.57 at 22 px)
MAX_LONGSIDE = 5056     # the plates' native long side; never upsample past it


def autoscale_longside(stem, window, base=2000, target=TARGET_PITCH):
    """Choose the render longside so the window's CELL PITCH lands near `target`.

    cells_across is scale-free, so it can be read cheaply at a small longside
    and used to solve for the longside that puts the pitch at the validated
    operating point.  This removes the SCALE confound from the corpus figures
    -- the same lesson ODQ 298.5e taught on the epoch ratios, where a published
    ratio decomposed into pitch x window width and the window half was the
    artefact.  Returns (longside, cells_across_estimate).
    """
    rgb = load_plate(stem, base)
    L = rgb.mean(2)
    H, W = L.shape
    Lw = L[int(window[1] * H):int(window[3] * H), int(window[0] * W):int(window[2] * W)]
    if min(Lw.shape) < 32:
        return base, None
    pitch0 = grain_pitch(Lw)
    cells_across = Lw.shape[1] / max(pitch0, 1e-6)
    frac = max(window[2] - window[0], 1e-6)
    ls = int(round(target * cells_across / frac))
    return max(base, min(ls, MAX_LONGSIDE)), round(cells_across, 1)


def run_plates(keys=None, params=None, overlay_dir=None, autoscale=True):
    p = dict(PARAMS); p.update(params or {})
    wins = window_table()
    tiers = tier_table()
    keys = keys or sorted(wins.keys())
    out, skipped = [], []
    for key in keys:
        pid = key.split("@")[0]
        if not EXCL.allowed(pid):
            skipped.append({"key": key, "why": "holdout(L6)"}); continue
        stem = stem_for(pid)
        if stem is None:
            skipped.append({"key": key, "why": "no plate on disk"}); continue
        ls, cells_est = (autoscale_longside(stem, wins[key]) if autoscale
                         else (p["longside"], None))
        rgb = load_plate(stem, ls)
        tier = tiers.get(pid, "?")
        row = {"key": key, "plate": stem, "tier": tier, "wset": window_set(key),
               # MORPHOLOGY-PLAN.md 0.4 calibration 3 / ODQ 244.5: the grain
               # kernel counts hedges and furrows below village tier, so every
               # quantity keyed to cell_pitch -- this instrument's autoscale AND
               # its area band -- is invalid there.  Measured here on hf90: the
               # pitch is set by furrow spacing, the houses come out at 1.7% of
               # the window, and all of them are dropped as area_high while the
               # hedgerows are kept.  Flagged, never silently aggregated.
               "grain_valid": tier not in ("thorp", "hamlet"),
               "window": wins[key], "longside_used": ls,
               "cells_across_est": cells_est,
               "params": {k: p[k] for k in sorted(p)}}
        for mode in ("mass", "region"):
            rows, diag, lab, keep, box = extract(rgb, wins[key], p, mode=mode)
            blk = dict(diag)
            blk["pitch_ok"] = bool(diag["cell_pitch_px"] >= MIN_SAFE_PITCH)
            blk.update(summarise(rows))
            blk["footprints"] = rows
            row[mode] = blk
            if overlay_dir:
                os.makedirs(overlay_dir, exist_ok=True)
                _overlay_png(rgb, lab, keep, box,
                             os.path.join(overlay_dir, "%s-%s.png" % (key.replace("@", "_"), mode)))
        out.append(row)
        sys.stderr.write("  %-16s mass n=%-4d p50=%-7s | region n=%-4d p50=%-7s\n"
                         % (key, row["mass"].get("n", 0), row["mass"].get("rect_p50"),
                            row["region"].get("n", 0), row["region"].get("rect_p50")))
        sys.stderr.flush()
    return out, skipped


def _control_headline(res):
    """The two numbers a reader of the receipt needs, pooled over the sweep."""
    def pool(k, field):
        v = [r["by_kind"][k][field] for r in res if k in r["by_kind"]
             and not (isinstance(r["by_kind"][k][field], float) and math.isnan(r["by_kind"][k][field]))]
        return round(float(np.median(v)), 4) if v else None
    return {
        "runs": len(res),
        "pitches_px": sorted({r["control_meta"]["pitch"] for r in res}),
        "seeds": sorted({r["seed"] for r in res}),
        "recovery_rate_min": round(min(r["recovery_rate"] for r in res), 4),
        "recovery_rate_median": round(float(np.median([r["recovery_rate"] for r in res])), 4),
        "merge_rate_max": round(max(r["merge_rate"] for r in res), 4),
        "split_rate_max": round(max(r.get("split_rate", 0.0) for r in res), 4),
        "split_rate_median": round(float(np.median([r.get("split_rate", 0.0) for r in res])), 4),
        "spurious_rate_max": round(max(r["spurious_rate"] for r in res), 4),
        "rect_measured_p50": pool("rect", "rect_measured_p50"),
        "rect_bias_p50": pool("rect", "bias_p50"),
        "rect_adj_measured_p50": pool("rect_adj", "rect_measured_p50"),
        "lshape_measured_p50": pool("lshape", "rect_measured_p50"),
        "wedge_measured_p50": pool("wedge", "rect_measured_p50"),
        "ellipse_measured_p50": pool("ellipse", "rect_measured_p50"),
        "note": ("A PERFECT rectangle does not read 1.000 through this extractor: the ink "
                 "outline is excluded from the fill, so the measured value is the erosion "
                 "bias below. Read the corpus figures against THIS ceiling, not against 1.0."),
    }


def main():
    args = sys.argv[1:]
    write = "--write" in args
    over = "--overlay" in args
    ls = PARAMS["longside"]
    if "--longside" in args:
        ls = int(args[args.index("--longside") + 1])
    params = {"longside": ls}

    if "--control" in args:
        seeds = [11, 12, 13]
        if "--seed" in args:
            seeds = [int(args[args.index("--seed") + 1])]
        pitches = [22.0, 33.0, 44.0, 66.0]
        if "--pitch" in args:
            pitches = [float(args[args.index("--pitch") + 1])]
        res = []
        for mode in ("mass", "region"):
            for pt in pitches:
                for s in seeds:
                    png = (os.path.join(HERE, "MFI1-control-%s-p%d-s%d.png" % (mode, int(pt), s))
                           if (write or over) and pt == 44.0 and s == 11 else None)
                    r = run_control(seed=s, params=params, dump_png=png, pitch=pt, mode=mode)
                    res.append(r)
                    sys.stderr.write("  control %-6s pitch %-4.0f seed %d  recovery=%.3f  merge=%.3f  "
                                     "rect_p50=%.3f  ridge_p50=%.3f  wedge_p50=%.3f\n"
                                     % (mode, pt, s, r["recovery_rate"], r["merge_rate"],
                                        r["by_kind"].get("rect", {}).get("rect_measured_p50", float("nan")),
                                        r["by_kind"].get("rect_ridge", {}).get("rect_measured_p50", float("nan")),
                                        r["by_kind"].get("wedge", {}).get("rect_measured_p50", float("nan"))))
                    sys.stderr.flush()
        blob = {"instrument": "MFI1-footprints", "mode": "control",
                # `headline` is the OPERATING POINT only (cell pitch >= MIN_SAFE_PITCH),
                # because that is the regime the corpus run actually renders in --
                # MFI1-footprints autoscales every window to a 40 px pitch.  The
                # full sweep, including the 22 px arm where the spurious rate
                # explodes, stays in `headline_all_pitches` so the failure is
                # published rather than trimmed away.
                "headline": {m: _control_headline([r for r in res if r["mode"] == m
                                                   and r["control_meta"]["pitch"] >= MIN_SAFE_PITCH])
                             for m in ("mass", "region")},
                "headline_all_pitches": {m: _control_headline([r for r in res if r["mode"] == m])
                                         for m in ("mass", "region")},
                "operating_point": {"target_pitch_px": TARGET_PITCH,
                                    "min_safe_pitch_px": MIN_SAFE_PITCH},
                "runs": res}
        dest = os.path.join(HERE, "MFI1-control.json")
        if write:
            tmp = dest + ".tmp"
            json.dump(blob, open(tmp, "w"), indent=1); open(tmp, "a").write("\n")
            os.replace(tmp, dest); print("wrote", dest)
        else:
            print(json.dumps(blob, indent=1))
            print("DRY RUN — pass --write to persist")
        return

    if "--plates" in args or over:
        keys = [a for a in args if a.startswith("hf")]
        odir = os.path.join(HERE, "MFI1-overlay") if over else None
        rows, skipped = run_plates(keys or None, params, odir)
        light = []
        for r in rows:
            q = dict(r)
            for mode in ("mass", "region"):
                if mode in q:
                    q[mode] = {k: v for k, v in q[mode].items() if k != "footprints"}
            light.append(q)
        blob = {"instrument": "MFI1-footprints", "mode": "plates",
                "exclusions": EXCL.report(), "skipped": skipped, "rows": rows}
        dest = os.path.join(HERE, "MFI1-footprints.json")
        if write:
            tmp = dest + ".tmp"
            json.dump(blob, open(tmp, "w"), indent=1); open(tmp, "a").write("\n")
            os.replace(tmp, dest); print("wrote", dest, "rows", len(rows))
        else:
            print(json.dumps({"summary": light, "skipped": skipped}, indent=1))
            print("DRY RUN — pass --write to persist; rows", len(rows))
        return

    print(__doc__)


if __name__ == "__main__":
    main()
