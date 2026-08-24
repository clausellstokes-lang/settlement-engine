#!/usr/bin/env python3
"""MF-I1 · G-40(ii) · PER-EPOCH MATERIAL / TONE CONTRAST — a BETWEEN-REGION
fill-tone separation, which is the thing that does not exist yet.

WHAT IT IS NOT.  `fill_tone_iqr` and `wash_within_sigma` are WHOLE-PLATE
statistics and GENERATION-SPEC.md §2.6 says in as many words that they are not
substitutes.  A plate can carry a wide whole-plate tone spread and still draw
its two epochs in the same material; and it can carry a narrow spread and still
separate them cleanly.  The question the gated mechanism ("building material
varies per epoch") actually asks is: **if I stand in region A and then in
region B, does the fabric change colour?**  That is a two-sample question and
it needs a two-sample quantity.

THE SUBJECTS are MORPHOLOGY-PLAN.md §6.2's own measured within-plate epoch
pairs — the frames whose grain, φ and dead-end shares are already published, so
the tone reading lands beside figures drawn on the identical windows:
    hf26   old fabric  -> new quarter        (+ the burnt third window)
    hf274  Oldbank     -> Newcharter
    hf239  vicus       -> castra camp
    hf347  core        -> outer ring
and two NON-EPOCH within-plate contrasts kept as comparison cases, because a
tone separation that is just as large between two contemporaneous districts is
not evidence about epochs:
    hf40   rich        -> poor      (a wealth gradient)
    hf72   east        -> west      (two nuclei of one town)

THE QUANTITIES, and their invariances stated up front because ODQ §298.5e is a
standing lesson about exactly this failure — every published epoch-coarsening
ratio there decomposed into pitch x window width, and the window half was the
artefact:

  d_paper(region)  = paper_L(PLATE) - median fill L(region)
      "how much darker than the paper this region's fabric is drawn".  The
      paper reference is taken ONCE PER PLATE and shared by both regions, so
      the plate's own paper tone divides out of any difference.
  delta_tone       = | d_paper(A) - d_paper(B) |            [L units]
  delta_chroma     = | chroma50(A) - chroma50(B) |          [RGB max-min units]
  delta_hue_warm   = | warm50(A) - warm50(B) |              [R-B units]
  sep_standardised = delta_tone / pooled robust sd          [dimensionless]
  overlap          = overlap coefficient of the two per-mass tone
                     distributions, in [0,1]                [dimensionless]

  INVARIANT TO: window size and window area (every quantity is a statistic of a
    DISTRIBUTION over drawn masses, never a count -- doubling the window adds
    more masses and moves nothing); the plate's paper tone (shared reference);
    the render longside (checked by the --scales arm, reported, not asserted).
  NOT INVARIANT TO: the ink threshold and the fill classification -- both are
    published per row; and to a region that contains too few drawn masses,
    which is why `n_masses` is reported and rows below `MIN_MASSES` are marked.

THE ZERO POINT IS MEASURED, NOT ASSUMED.  `--null` splits EACH region into two
halves and runs the identical comparison between them.  A within-region null
must return delta_tone near zero and overlap near one.  Without it, a "large"
separation has nothing to be large against.

INVOCATION
    python3 MFI1-tone.py            # dry
    python3 MFI1-tone.py --write    # -> MFI1-tone.json
    python3 MFI1-tone.py --scales   # longside-invariance arm
LAW L6: every plate passes MFI1-exclusions.allowed() before it is opened.
"""
import json, os, sys

import numpy as np
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.abspath(__file__))
import importlib.util as _ilu
_s = _ilu.spec_from_file_location("mfi1_fp", os.path.join(HERE, "MFI1-footprints.py"))
FP = _ilu.module_from_spec(_s); _s.loader.exec_module(FP)
EXCL = FP.EXCL

MIN_MASSES = 12

# FIXED render longside for the primary reading.  The first build autoscaled to
# the grain pitch of window A, which made the two regions of a pair share a
# scale but made DIFFERENT PAIRS incomparable, and the --scales sweep caught it:
# hf274's separation read 15.8 L under autoscale and 2.8-5.0 L at every fixed
# longside.  A between-region tone statistic has no business depending on a
# grain kernel, so it does not consult one.  The sweep stays, as the evidence
# that the fixed reading is stable (hf26 23.2 / 23.2 / 24.0 across 2200-3800).
LONGSIDE = 3000

PAIRS = [
    ("hf26", "hf26@old", "hf26@newquarter", "epoch", "old fabric -> new quarter"),
    ("hf26", "hf26@old", "hf26@burnt", "epoch", "old fabric -> burnt quarter"),
    ("hf274", "hf274@oldbank", "hf274@newcharter", "epoch", "Oldbank -> Newcharter"),
    ("hf239", "hf239@vicus", "hf239@camp", "epoch", "vicus -> castra camp"),
    ("hf347", "hf347@core", "hf347@outerring", "epoch", "core -> outer ring"),
    ("hf40", "hf40@rich", "hf40@poor", "district", "rich -> poor (comparison case)"),
    ("hf72", "hf72@east", "hf72@west", "district", "east nucleus -> west (comparison case)"),
]


def plate_paper_L(rgb):
    """ONE reference per plate: the 90th percentile of not-ink luminance over
    the whole plate.  Shared by both regions of a pair by construction."""
    L = rgb.mean(2)
    from skimage.filters import threshold_multiotsu
    t = threshold_multiotsu(L, classes=3)
    nonink = L[L >= float(t[0])]
    return float(np.percentile(nonink, 90)), float(t[0]), float(t[1])


def region_tones(rgb, window, paper_L, params=None, ink_thr=None):
    """Per-drawn-mass FILL tone statistics inside one window.

    Two guards, both put in after the instrument's own within-region null
    convicted the first build (null delta 25 L, p90 42 L -- bigger than the
    separations it was meant to detect):
      * include_solid=False -- the solid-dark-mass arm admits thick ink
        junctions, and their luminance is ink's;
      * a mass whose median L sits at or below the plate's INK threshold is not
        fill and is dropped by name, with the drop counted.
    """
    p = dict(FP.PARAMS); p.update(params or {})
    rows, diag, lab, keep, box = FP.extract(rgb, window, p, mode="mass", include_solid=False)
    x0, y0, x1, y1 = box
    aw = rgb[y0:y1, x0:x1]
    L = aw.mean(2)
    chroma = aw.max(2) - aw.min(2)
    warm = aw[:, :, 0] - aw[:, :, 2]
    idx = np.arange(1, lab.max() + 1)
    kept = idx[keep[1:len(idx) + 1]] if len(idx) else idx
    if len(kept) == 0:
        return {"n_masses": 0}, np.array([])
    medL_all = ndi.labeled_comprehension(L, lab, kept, np.median, float, np.nan)
    n_before = len(kept)
    if ink_thr is not None:
        ok = medL_all > (ink_thr + 8.0)
        kept = kept[ok]
        if len(kept) == 0:
            return {"n_masses": 0, "dropped_as_ink": int(n_before)}, np.array([])
    medL = ndi.labeled_comprehension(L, lab, kept, np.median, float, np.nan)
    medC = ndi.labeled_comprehension(chroma, lab, kept, np.median, float, np.nan)
    medW = ndi.labeled_comprehension(warm, lab, kept, np.median, float, np.nan)
    d = paper_L - medL
    q = lambda a, f: round(float(np.nanpercentile(a, f)), 2)
    out = {
        "n_masses": int(len(kept)),
        "dropped_as_ink": int(n_before - len(kept)),
        "fill_L_p50": q(medL, 50), "fill_L_p25": q(medL, 25), "fill_L_p75": q(medL, 75),
        "d_paper_p50": q(d, 50), "d_paper_p25": q(d, 25), "d_paper_p75": q(d, 75),
        "chroma_p50": q(medC, 50), "warm_p50": q(medW, 50),
        "cell_pitch_px": diag["cell_pitch_px"], "win_px": diag["win_px"],
    }
    return out, d


def _robust_sd(a):
    return float(np.nanpercentile(a, 75) - np.nanpercentile(a, 25)) / 1.349


def _overlap(a, b, bins=48):
    lo = float(min(np.nanmin(a), np.nanmin(b)))
    hi = float(max(np.nanmax(a), np.nanmax(b)))
    if hi - lo < 1e-9:
        return 1.0
    ha, _ = np.histogram(a, bins=bins, range=(lo, hi), density=False)
    hb, _ = np.histogram(b, bins=bins, range=(lo, hi), density=False)
    ha = ha / max(ha.sum(), 1); hb = hb / max(hb.sum(), 1)
    return round(float(np.minimum(ha, hb).sum()), 4)


def compare(name_a, stats_a, arr_a, name_b, stats_b, arr_b):
    if stats_a.get("n_masses", 0) == 0 or stats_b.get("n_masses", 0) == 0:
        return {"status": "EMPTY"}
    sd = max((_robust_sd(arr_a) + _robust_sd(arr_b)) / 2.0, 1e-6)
    dt = abs(stats_a["d_paper_p50"] - stats_b["d_paper_p50"])
    return {
        "region_a": name_a, "region_b": name_b,
        "delta_tone_L": round(dt, 2),
        "delta_chroma": round(abs(stats_a["chroma_p50"] - stats_b["chroma_p50"]), 2),
        "delta_warm": round(abs(stats_a["warm_p50"] - stats_b["warm_p50"]), 2),
        "sep_standardised": round(dt / sd, 3),
        "overlap": _overlap(arr_a, arr_b),
        "pooled_robust_sd_L": round(sd, 2),
        "n_masses_a": stats_a["n_masses"], "n_masses_b": stats_b["n_masses"],
        "underpowered": bool(min(stats_a["n_masses"], stats_b["n_masses"]) < MIN_MASSES),
    }


def split_halves(win):
    x0, y0, x1, y1 = win
    xm = (x0 + x1) / 2.0
    return (x0, y0, xm, y1), (xm, y0, x1, y1)


def main():
    args = sys.argv[1:]
    write = "--write" in args
    scales = "--scales" in args
    wins = FP.window_table()
    rows, nulls, skipped, scale_rows = [], [], [], []
    for pid, ka, kb, kind, label in PAIRS:
        if not EXCL.allowed(pid):
            skipped.append({"pair": label, "why": "holdout(L6)"}); continue
        if ka not in wins or kb not in wins:
            skipped.append({"pair": label, "why": "window missing"}); continue
        stem = FP.stem_for(pid)
        ls = LONGSIDE
        rgb = FP.load_plate(stem, ls)
        paper_L, ink_thr, body_thr = plate_paper_L(rgb)
        sa, aa = region_tones(rgb, wins[ka], paper_L, ink_thr=ink_thr)
        sb, ab = region_tones(rgb, wins[kb], paper_L, ink_thr=ink_thr)
        r = {"plate": stem, "pair": label, "kind": kind, "longside": ls,
             "plate_paper_L": round(paper_L, 1),
             "plate_ink_thr": round(ink_thr, 1), "plate_body_thr": round(body_thr, 1),
             "a": sa, "b": sb}
        r.update(compare(ka, sa, aa, kb, sb, ab))
        rows.append(r)
        sys.stderr.write("  %-34s dtone=%-6s sep=%-6s overlap=%-6s n=%d/%d\n"
                         % (label, r.get("delta_tone_L"), r.get("sep_standardised"),
                            r.get("overlap"), sa.get("n_masses", 0), sb.get("n_masses", 0)))
        sys.stderr.flush()
        # WITHIN-REGION NULL: the same comparison between the two halves of ONE
        # region.  This is the instrument's measured zero point.
        for key in (ka, kb):
            h1, h2 = split_halves(wins[key])
            s1, a1 = region_tones(rgb, h1, paper_L, ink_thr=ink_thr)
            s2, a2 = region_tones(rgb, h2, paper_L, ink_thr=ink_thr)
            n = {"plate": stem, "region": key, "arm": "within-region null"}
            n.update(compare(key + "|left", s1, a1, key + "|right", s2, a2))
            nulls.append(n)
        if scales:
            for lsx in (2200, 3000, 3800):
                rgbx = FP.load_plate(stem, lsx)
                pLx, itx, _ = plate_paper_L(rgbx)
                sax, aax = region_tones(rgbx, wins[ka], pLx, ink_thr=itx)
                sbx, abx = region_tones(rgbx, wins[kb], pLx, ink_thr=itx)
                c = compare(ka, sax, aax, kb, sbx, abx)
                scale_rows.append({"pair": label, "longside": lsx,
                                   "delta_tone_L": c.get("delta_tone_L"),
                                   "overlap": c.get("overlap"),
                                   "sep_standardised": c.get("sep_standardised")})
    good_nulls = [n for n in nulls if n.get("status") != "EMPTY" and not n.get("underpowered")]
    null_summary = {
        "n": len(good_nulls),
        "delta_tone_L_p50": round(float(np.median([n["delta_tone_L"] for n in good_nulls])), 2) if good_nulls else None,
        "delta_tone_L_p90": round(float(np.percentile([n["delta_tone_L"] for n in good_nulls], 90)), 2) if good_nulls else None,
        "overlap_p50": round(float(np.median([n["overlap"] for n in good_nulls])), 3) if good_nulls else None,
        "sep_standardised_p90": round(float(np.percentile([n["sep_standardised"] for n in good_nulls], 90)), 3) if good_nulls else None,
        "meaning": ("the separation this instrument returns between two halves of ONE region. "
                    "A pair separation must clear this to mean anything."),
    }
    blob = {"instrument": "MFI1-tone", "gap": "G-40(ii)",
            "exclusions": EXCL.report(), "skipped": skipped,
            "within_region_null": null_summary, "nulls": nulls,
            "scale_invariance": scale_rows, "pairs": rows}
    dest = os.path.join(HERE, "MFI1-tone.json")
    if write:
        tmp = dest + ".tmp"
        json.dump(blob, open(tmp, "w"), indent=1); open(tmp, "a").write("\n")
        os.replace(tmp, dest); print("wrote", dest, "pairs", len(rows))
    else:
        print(json.dumps(blob, indent=1))
        print("DRY RUN — pass --write to persist; pairs", len(rows))


if __name__ == "__main__":
    main()
