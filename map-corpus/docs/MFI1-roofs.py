#!/usr/bin/env python3
"""MF-I1 · THE ROOF-COUNT INSTRUMENT — the tier-appropriate ruler for the two
rungs T-01 withdrew (ODQ §244.5, ratified and routed to W0 at §298.4c).

WHY IT EXISTS.  `cells_across` counts DARK RUNS along scanlines.  At thorp and
hamlet scale the bounding box is mostly hedges, tofts, furlong furrows and
orchard rows, so the ruler counts field furniture: §244.5's own witness is
`hf90`, a TWELVE-ROOF thorp that returns 99.6 cells across (MF-S3a's
re-implementation of the same kernel returns 55.0 on the same plate).  T-01's
thorp and hamlet bands were therefore WITHDRAWN — not widened — and any grading
verdict already issued against them was withdrawn with them.  §244.5 also names
the restoration path in one line: *these plates carry 6–24 roofs, so an eye
count is exact.*  This is that eye count, mechanised, with the eye kept in the
loop as the control.

WHAT IT COUNTS.  ROOF MASSES: connected drawn building masses inside the
hand-set window.  A range with two wings under one continuous roof is ONE mass.
⚠ It does NOT count roof PLANES — an L-plan house drawn with two pitches is one
mass here and might be two "roofs" to a human counter.  Which of the two
§244.5's "twelve" meant is not recoverable from the ledger, so both this
instrument's count and my own hand count are published side by side and the
discrepancy is RAISED rather than reconciled by picking the flattering reading.

WHY IT CANNOT REUSE MFI1-footprints's SCALING.  That instrument keys its render
scale AND its area band to the cell pitch, and the cell pitch is exactly what is
invalid here.  Measured on hf90: the pitch comes out at 34 px because it is
reading furrow spacing, the houses come out at ~1.7% of the window, and every
one of them is dropped as over-size while the hedgerows are kept.  So this
instrument uses a WINDOW-RELATIVE area band and a fixed render longside, and
never consults the grain kernel at all.

INVARIANCES, stated because ODQ §298.5e was a lesson about exactly this: the
count is invariant to render longside (verified by the --scales arm below) and
to window size only in the trivial sense that a bigger window contains more
roofs -- it is a COUNT, so it must be quoted with its window, never alone.
`roofs_per_window` is the raw count; `roof_area_share` is the scale-free
companion.

INVOCATION
    python3 MFI1-roofs.py                 # dry run over the low-tier windows
    python3 MFI1-roofs.py --write         # -> MFI1-roofs.json
    python3 MFI1-roofs.py --overlay       # -> MFI1-roofoverlay/<id>.png  (LOOK AT THESE)
    python3 MFI1-roofs.py --scales        # longside invariance check
LAW L6: every id passes MFI1-exclusions.allowed() before the plate is opened.
"""
import json, os, sys

import numpy as np
from scipy import ndimage as ndi
from skimage.morphology import (binary_closing, binary_dilation, binary_opening,
                                disk, remove_small_holes, remove_small_objects)

HERE = os.path.dirname(os.path.abspath(__file__))
import importlib.util as _ilu
_s = _ilu.spec_from_file_location("mfi1_fp", os.path.join(HERE, "MFI1-footprints.py"))
FP = _ilu.module_from_spec(_s); _s.loader.exec_module(FP)
EXCL = FP.EXCL

# HFM1-grain2.py's own window table, low tiers only, holdout ids removed at run
# time by allowed().  Windows are HAND-SET and are the analyst's eye-bounds:
# they are quoted from HFM1-grain2.py unchanged so that this instrument and the
# withdrawn grain figures are read off the SAME frame.
WINDOWS = [
    ("hf10-thorp-plains",      .13, .31, .45, .70, "thorp"),
    ("hf85-thorp-riverside",   .20, .20, .87, .72, "thorp"),
    ("hf86-thorp-upland",      .19, .25, .85, .72, "thorp"),
    ("hf88-thorp-crossroads",  .20, .13, .80, .60, "thorp"),
    ("hf89-thorp-coastal",     .26, .08, .92, .62, "thorp"),
    ("hf90-thorp-plains",      .11, .10, .88, .78, "thorp"),
    ("hf11-hamlet-forest",     .30, .15, .72, .76, "hamlet"),
    ("hf91-hamlet-green",      .25, .12, .76, .80, "hamlet"),
    ("hf93-hamlet-street",     .08, .08, .92, .72, "hamlet"),
    ("hf95-hamlet-riverside",  .10, .10, .90, .50, "hamlet"),
    ("hf96-hamlet-upland",     .22, .18, .72, .72, "hamlet"),
    ("hf3-village-organic",    .30, .28, .66, .72, "village"),
    ("hf13-village-fishing",   .28, .28, .74, .74, "village"),
    ("hf16-village-cold",      .18, .34, .84, .70, "village"),
    ("hf17-village-wealthy",   .30, .24, .72, .78, "village"),
    ("hf126-village-terrace",  .23, .28, .72, .63, "village"),
    ("hf128-village-steppe",   .28, .20, .80, .80, "village"),
]

# [E] HAND VALIDATION, executed against the instrument's own overlay sheet.
# This is the recovery figure the brief demands and it is NOT flattering.
HAND_VALIDATION = [
    {"plate": "hf90-thorp-plains", "window": "the WINDOWS row below",
     "hand_building_masses": 16, "instrument_count": 25, "true_positives": 14,
     "recall": 0.875, "precision": 0.56,
     "false_positives": "1 well + ~10 hedge-bank fragments along field boundaries",
     "false_negatives": "2 houses dropped by the outline test (a mid-tone brown and a "
                        "sage-green roof whose boundary ring fell below 0.75 ink)",
     "method": "counted off MFI1-roofoverlay/hf90.png at 1800 px by this lane, 2026-08-21"},
]
HAND_VALIDATION_VERDICT = (
    "⛔ THE COUNTS ARE UPPER BOUNDS AND MAY NOT SET A BAND. Measured recall 0.88, "
    "precision 0.56 on the one plate with a hand count -- and that plate is §244.5's own "
    "witness. The instrument is a real improvement on `cells_across` at these tiers (it "
    "counts drawn building masses, not furrows: hf90 returns 25 against the grain kernel's "
    "99.6 'cells across'), but a 0.56 precision cannot carry a target band. What it needs is "
    "one more pass on the false-positive class, which is a single named thing: hedge-bank "
    "fragments at field boundaries near the window edge.")

PARAMS = dict(
    longside=2600,
    # window-relative area band.  A roof mass at these tiers runs from a small
    # cot to a hall-barn; the band is deliberately wide and every drop is
    # reported, because a silently narrow band is how an instrument invents a
    # tidy answer.
    a_min_frac=2.0e-4,
    a_max_frac=6.0e-2,
    delta_L=26.0,     # a mass reads DARK against paper by at least this much L ...
    delta_C=16.0,     # ... or this much more chroma
    r_bridge=3,
    r_open=3,
    hole_frac=1.5e-4,
    edge_margin=3,
    elong_max=9.0,    # a hedgerow or a road band is a ribbon; a roof is not
    r_solid=6,        # see masks(): strict enough that hedge stipple cannot survive
    outline_min=0.75,  # share of a component's boundary ring that must be INK
)


def masks(rgb, window, p):
    from skimage.filters import threshold_multiotsu
    L = rgb.mean(2)
    H, W = L.shape
    x0, y0 = int(window[0] * W), int(window[1] * H)
    x1, y1 = int(window[2] * W), int(window[3] * H)
    Lw = L[y0:y1, x0:x1]
    aw = rgb[y0:y1, x0:x1]
    chroma = aw.max(2) - aw.min(2)
    t = threshold_multiotsu(Lw, classes=3)
    ink = binary_closing(Lw < float(t[0]), disk(1))
    fill, rdiag = FP._region_fill(Lw, chroma, ink, p)
    # The solid-dark-mass arm is kept but made STRICT (disk(r_solid) with
    # r_solid=6 rather than 3).  Both failure modes were seen on the hf90
    # validation sheet: at r_solid=3 the hedgerow's dark stipple survives and
    # enters the count as ~10 spurious roofs; with the arm removed entirely the
    # DARK HALF of a two-tone roof drops out and a house splits into two
    # components, which over-counts a different way.  A hedge dot cannot survive
    # an opening by disk(6); a roof slope can.
    body = fill | binary_opening(ink, disk(p["r_solid"]))
    body = binary_closing(body, disk(p["r_bridge"]))
    area = float(Lw.size)
    body = remove_small_holes(body, int(max(24, p["hole_frac"] * area)))
    body = binary_opening(body, disk(p["r_open"]))
    body = remove_small_objects(body, int(max(24, p["a_min_frac"] * area)))
    return Lw, aw, chroma, body, rdiag, (x0, y0, x1, y1), ink, float(t[0])


def count(stem, window, p=None, longside=None):
    p = dict(PARAMS); p.update({} if longside is None else {"longside": longside})
    rgb = FP.load_plate(stem, p["longside"])
    Lw, aw, chroma, body, rdiag, box, ink, ink_thr = masks(rgb, window, p)
    wh, ww = Lw.shape
    win_area = float(wh * ww)
    lab, n = ndi.label(body)
    keep = np.zeros(n + 1, bool)
    rows = []
    reasons = {"area_low": 0, "area_high": 0, "edge": 0, "green": 0, "ribbon": 0,
               "not_outlined": 0}
    R, G, B = aw[:, :, 0], aw[:, :, 1], aw[:, :, 2]
    m = p["edge_margin"]
    for i, sl in enumerate(ndi.find_objects(lab), start=1):
        if sl is None:
            continue
        sub = lab[sl] == i
        a = float(sub.sum())
        if a < p["a_min_frac"] * win_area:
            reasons["area_low"] += 1; continue
        if a > p["a_max_frac"] * win_area:
            reasons["area_high"] += 1; continue
        ys, xs = sl[0], sl[1]
        if ys.start <= m or xs.start <= m or ys.stop >= wh - m or xs.stop >= ww - m:
            reasons["edge"] += 1; continue
        gmean = float((G[sl][sub] - R[sl][sub]).mean())
        if gmean > 4.0:
            reasons["green"] += 1; continue
        # IS IT OUTLINED?  Every drawn building in this corpus is enclosed by an
        # ink line; a hedge-bank fragment or a road-edge sliver is not.  So the
        # share of a component's own boundary ring that lands on ink separates
        # the two STRUCTURALLY, without tuning a size threshold.  Measured on
        # hf90: houses run at or near 1.0, the hedge fragments the validation
        # sheet showed sit well below it.
        pad = (slice(max(0, ys.start - 2), min(wh, ys.stop + 2)),
               slice(max(0, xs.start - 2), min(ww, xs.stop + 2)))
        big = (lab[pad] == i)
        ring = binary_dilation(big, disk(2)) & ~big
        outlined = float(ink[pad][ring].mean()) if ring.any() else 0.0
        # ...unless the mass IS ink: a black hall roof or a wash-blacked barn
        # has no separate outline because its own body is the darkest thing
        # there.  The first build of this test dropped five real houses on hf90
        # for exactly that reason, and the validation sheet showed it.
        self_dark = float(np.median(Lw[sl][sub])) < ink_thr
        if outlined < p["outline_min"] and not self_dark:
            reasons["not_outlined"] += 1; continue
        yy, xx = np.nonzero(sub)
        pts = np.column_stack([xx + xs.start, yy + ys.start]).astype(float)
        pts = np.vstack([pts + [-0.5, -0.5], pts + [0.5, -0.5],
                         pts + [-0.5, 0.5], pts + [0.5, 0.5]])
        mar, lo, sh, th = FP.min_area_rect(pts)
        if sh <= 0 or mar <= 0:
            continue
        if lo / sh > p["elong_max"]:
            reasons["ribbon"] += 1; continue
        keep[i] = True
        rows.append({"area_px": int(a), "area_frac": round(a / win_area, 6),
                     "outlined": round(outlined, 3),
                     "rect": round(min(a / mar, 1.0), 4), "elong": round(lo / sh, 2),
                     "cx": round(float(xx.mean() + xs.start), 1),
                     "cy": round(float(yy.mean() + ys.start), 1)})
    areas = np.array([r["area_px"] for r in rows], float) if rows else np.array([0.0])
    out = {"plate": stem, "window": list(window), "longside": p["longside"],
           "win_px": [int(ww), int(wh)],
           "region_split": rdiag,
           "roofs_per_window": len(rows),
           "roof_area_share": round(float(areas.sum() / win_area), 5) if rows else 0.0,
           "roof_area_frac_p50": round(float(np.median(areas) / win_area), 5) if rows else None,
           "roof_rect_p50": round(float(np.median([r["rect"] for r in rows])), 4) if rows else None,
           "dropped": reasons, "components_labelled": int(n)}
    return out, rows, lab, keep, box, rgb


def main():
    args = sys.argv[1:]
    write = "--write" in args
    over = "--overlay" in args
    scales = "--scales" in args
    odir = os.path.join(HERE, "MFI1-roofoverlay")
    out, skipped, scale_rows = [], [], []
    for stem, x0, y0, x1, y1, tier in WINDOWS:
        pid = EXCL.plate_id(stem)
        if not EXCL.allowed(pid):
            skipped.append({"plate": stem, "why": "holdout(L6)"}); continue
        r, rows, lab, keep, box, rgb = count(stem, (x0, y0, x1, y1))
        r["tier"] = tier
        r["masses"] = rows
        out.append(r)
        sys.stderr.write("  %-30s %-8s roofs=%-3d share=%.4f drop=%s\n"
                         % (stem, tier, r["roofs_per_window"], r["roof_area_share"], r["dropped"]))
        sys.stderr.flush()
        if over:
            os.makedirs(odir, exist_ok=True)
            FP._overlay_png(rgb, lab, keep, box,
                            os.path.join(odir, "%s.png" % EXCL.plate_id(stem)))
        if scales:
            for ls in (2000, 2600, 3400):
                r2, *_ = count(stem, (x0, y0, x1, y1), longside=ls)
                scale_rows.append({"plate": stem, "longside": ls,
                                   "roofs": r2["roofs_per_window"],
                                   "share": r2["roof_area_share"]})
    by_tier = {}
    for r in out:
        by_tier.setdefault(r["tier"], []).append(r["roofs_per_window"])
    bands = {t: {"n_windows": len(v), "min": int(min(v)), "p50": float(np.median(v)),
                 "max": int(max(v)), "values": sorted(v)}
             for t, v in sorted(by_tier.items())}
    blob = {"instrument": "MFI1-roofs", "params": PARAMS,
            "hand_validation": HAND_VALIDATION,
            "hand_validation_verdict": HAND_VALIDATION_VERDICT,
            "exclusions": EXCL.report(), "skipped": skipped,
            "measured_counts_by_tier": bands,
            "band_status": ("MEASUREMENTS ONLY, AND NOT YET CLEAN ENOUGH TO PROPOSE RUNGS. "
                            "Band adoption is the chair's in any case (ODQ 244.5: the thorp "
                            "and hamlet rungs are WITHDRAWN and may not be graded). Nothing "
                            "here proposes a target. See hand_validation_verdict."),
            "scale_invariance": scale_rows, "rows": out}
    dest = os.path.join(HERE, "MFI1-roofs.json")
    if write:
        tmp = dest + ".tmp"
        json.dump(blob, open(tmp, "w"), indent=1); open(tmp, "a").write("\n")
        os.replace(tmp, dest); print("wrote", dest, "rows", len(out))
    else:
        light = dict(blob); light["rows"] = [{k: v for k, v in r.items() if k != "masses"} for r in out]
        print(json.dumps(light, indent=1))
        print("DRY RUN — pass --write to persist; rows", len(out))


if __name__ == "__main__":
    main()
