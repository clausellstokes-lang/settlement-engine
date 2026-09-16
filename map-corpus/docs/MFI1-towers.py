#!/usr/bin/env python3
"""MF-I1 · G-40(i) · TOWER SPACING — spacing CV along the circuit, and towers
per unit circuit length.

⛔ READ THE LIMITATION FIRST.  The plate-side extractor in this file is a
PROTOTYPE WITH AN UNVALIDATED RECOVERY RATE and its numbers may not gate
anything.  ODQ §298.5a already ruled the general form of this: the junction
extractor's X-recovery was unmeasured and large, so its ABSOLUTE band may never
gate generated output.  The same refusal applies here, and this file states it
rather than publishing a figure that looks like a measurement.

WHAT THE HAND PASS FOUND, AND IT MATTERS MORE THAN THE PROTOTYPE
Five non-holdout walled plates were viewed and their circuits counted by eye at
1500 px.  **Two of the five carry a circuit with ZERO towers**: hf239's is a
`vallum et fossa` — a rampart and ditch with rounded corners and four gates and
no bastions anywhere — and hf324's is a hedged bank.  The three masonry
circuits carry towers at INTERVALS ALONG THE RUN, on straight stretches and on
smooth curves alike; hf347's circuit is a smooth oval with no corners at all
and still carries a dozen and more.  ⚠ **So "towers at wall corners" (S13 /
§3.4 #7 / SUB-3) is at best a PART of the corpus's vocabulary and is not its
governing rule, and a mechanism that places towers only at corners would emit
nothing at all on a smooth circuit and would emit them on two circuits that
should have none.**  That is a finding about the MECHANISM, and it does not
depend on the prototype's recovery rate.

THE GENERATED-SIDE INSTRUMENT — the one that can be exact, specified
The generator holds the circuit as a POLYLINE and the towers as PLACEMENTS on
it, so nothing has to be recovered from pixels.  Specification:

  INPUT   circuit ring R as an ordered closed polyline in world units;
          tower placements T = [t_1..t_n] as arc-length positions on R
          (a tower that is not ON the ring is a fault, not a datum).
  LENGTH  L(R) = sum of segment lengths, closed.
  GAPS    g_i  = (s_{i+1} - s_i) mod L(R), for towers sorted by arc length.
          n gaps for n towers on a closed ring.  n < 2 => spacing UNDEFINED,
          reported as null, never as 0.
  METRICS towers_per_unit_length = n / L(R)          [towers per world unit]
          spacing_mean           = L(R) / n           (identically the inverse)
          spacing_cv             = sd(g) / mean(g)    [dimensionless]
          spacing_cv_robust      = IQR(g) / (1.349 * median(g))
          corner_share           = share of towers within `tol` of a ring
                                   vertex whose exterior angle exceeds
                                   `corner_deg` — the quantity that actually
                                   tests S13's corner rule, and the one no
                                   instrument has ever reported.
  INVARIANCES  spacing_cv is invariant to the settlement's SIZE and to the unit
          of length (both numerator and denominator are lengths);
          towers_per_unit_length is NOT — it must be quoted with its unit, or
          normalised as towers_per_circuit (= n) beside the ring's perimeter.
          ⚠ This is the ODQ §298.5e discipline: publish the dimensionless one
          as the comparison quantity and the dimensional one only with its unit.
  BANDS   ⛔ NONE MAY BE SET FROM THE PROTOTYPE BELOW.  A corpus band needs a
          zoom-resolution hand census over a stated sample, which this lane did
          not have the budget to run; the hand counts here are a CALIBRATION
          SAMPLE, expressly not a band.

INVOCATION
    python3 MFI1-towers.py --hand         # the hand-count calibration sample
    python3 MFI1-towers.py --probe        # the plate-side prototype, unvalidated
    python3 MFI1-towers.py --write        # -> MFI1-towers.json
LAW L6: every plate passes MFI1-exclusions.allowed() before it is opened.
"""
import json, math, os, sys

import numpy as np
from scipy import ndimage as ndi
from skimage.filters import threshold_multiotsu
from skimage.morphology import binary_closing, binary_opening, disk, skeletonize

HERE = os.path.dirname(os.path.abspath(__file__))
import importlib.util as _ilu
_s = _ilu.spec_from_file_location("mfi1_fp", os.path.join(HERE, "MFI1-footprints.py"))
FP = _ilu.module_from_spec(_s); _s.loader.exec_module(FP)
EXCL = FP.EXCL

# [E] EYE COUNTS at 1500 px whole-plate renders, by this lane, 2026-08-21.
# The uncertainty is stated because it is real: at this resolution a mural
# tower is 6-10 px and a run of them is easy to miscount by one or two.  These
# are a CALIBRATION SAMPLE for an instrument, not a corpus census and not a band.
HAND_COUNTS = [
    {"plate": "hf324-town-bastide-halffilled", "circuit": "hedged bank + ditch",
     "towers": 0, "uncertainty": 0, "gates": 0,
     "note": "no masonry circuit at all; the Lord's Court has corner buttresses, "
             "which are a building's, not the town circuit's"},
    {"plate": "hf239-castra-town", "circuit": "vallum et fossa (rampart + ditch)",
     "towers": 0, "uncertainty": 0, "gates": 4,
     "note": "playing-card plan, rounded corners, four gates, NO bastions"},
    {"plate": "hf364-town-sacked-resettled", "circuit": "masonry, round towers",
     "towers": 10, "uncertainty": 2, "gates": 5,
     "note": "towers spaced along straight and curved runs; gates drawn as double jambs"},
    {"plate": "hf347-town-three-circuits", "circuit": "masonry, round towers, smooth oval",
     "towers": 17, "uncertainty": 3, "gates": 4,
     "note": "the outer circuit is a smooth OVAL with no corners, and still carries towers "
             "at intervals -- the single clearest refutation of a corners-only rule. Two "
             "former towers survive INSIDE the fabric as 'TOWER DWELLING' circles, which is "
             "circuitDemotion's vocabulary drawn"},
    {"plate": "hf331-town-dual-lordship", "circuit": "masonry, D-shaped mural towers",
     "towers": 25, "uncertainty": 4, "gates": 4,
     "note": "towers at polygon angle points AND along straight runs; one labelled "
             "RUINOUS TOWER, one PRISON TOWER -- the corpus types its towers"},
]


def hand_summary():
    walled = [h for h in HAND_COUNTS if h["towers"] > 0]
    return {
        "n_plates": len(HAND_COUNTS),
        "n_with_zero_towers": sum(1 for h in HAND_COUNTS if h["towers"] == 0),
        "zero_tower_share": round(sum(1 for h in HAND_COUNTS if h["towers"] == 0) / len(HAND_COUNTS), 3),
        "towers_when_present_min": min(h["towers"] for h in walled),
        "towers_when_present_max": max(h["towers"] for h in walled),
        "towers_when_present_median": float(np.median([h["towers"] for h in walled])),
        "method": "[E] eye count at 1500 px whole-plate render, uncertainty stated per row",
        "status": ("CALIBRATION SAMPLE, NOT A BAND. n=5, whole-plate resolution, one counter, "
                   "no second reader. A band needs a zoom-resolution census with a stated "
                   "sample and a second reader."),
    }


def probe(stem, longside=3000):
    """PLATE-SIDE PROTOTYPE.  Circuit = the longest thin dark ribbon that is not
    fabric; towers = local maxima of the ribbon's width along its skeleton.
    Recovery is UNMEASURED; the output is diagnostic only."""
    rgb = FP.load_plate(stem, longside)
    L = rgb.mean(2)
    t = threshold_multiotsu(L, classes=3)
    ink = binary_closing(L < float(t[0]), disk(1))
    # a circuit is drawn heavier than a street line: keep only ink with half
    # width >= r_wall, then restore its width.
    out = {"plate": stem, "longside": longside, "ink_thr": round(float(t[0]), 1)}
    best = None
    for r_wall in (3, 4, 5):
        thick = binary_opening(ink, disk(r_wall))
        lab, n = ndi.label(thick)
        if n == 0:
            continue
        sizes = np.bincount(lab.ravel()); sizes[0] = 0
        cand = int(np.argmax(sizes))
        m = lab == cand
        sk = skeletonize(m)
        length = int(sk.sum())
        dt = ndi.distance_transform_edt(m)
        w = dt[sk]
        if length < 200:
            continue
        # elongation of the component: a circuit is a ribbon, a building is not
        ys, xs = np.nonzero(m)
        span = math.hypot(xs.max() - xs.min(), ys.max() - ys.min())
        ribbon = length / max(float(np.median(w)), 1e-6)
        rec = {"r_wall": r_wall, "skeleton_px": length, "bbox_span_px": round(span, 1),
               "half_width_p50": round(float(np.median(w)), 2),
               "half_width_p90": round(float(np.percentile(w, 90)), 2),
               "ribbon_ratio": round(ribbon, 1),
               "bulges_above_p90": int((w > np.percentile(w, 90)).sum())}
        if best is None or rec["skeleton_px"] > best["skeleton_px"]:
            best = rec
    out["circuit_candidate"] = best
    out["verdict"] = ("NO RELIABLE CIRCUIT" if best is None else
                      "CANDIDATE FOUND — ⛔ recovery UNMEASURED, spacing NOT reported")
    # Deliberately NOT reporting a spacing CV: the prototype cannot separate a
    # tower bulge from a gatehouse, a corner thickening, or a wall-side
    # building, and a number published from it would be exactly the
    # unmeasured-recovery disease ODQ 298.5a named.
    return out


def main():
    args = sys.argv[1:]
    write = "--write" in args
    rows = []
    if "--probe" in args or write:
        for h in HAND_COUNTS:
            pid = EXCL.plate_id(h["plate"])
            if not EXCL.allowed(pid):
                continue
            r = probe(h["plate"])
            r["hand_towers"] = h["towers"]
            rows.append(r)
            sys.stderr.write("  %-34s hand=%-3d %s\n" % (h["plate"], h["towers"], r["verdict"]))
            sys.stderr.flush()
    blob = {"instrument": "MFI1-towers", "gap": "G-40(i)",
            "exclusions": EXCL.report(),
            "status": "PLATE-SIDE EXTRACTION NOT DELIVERED — see the module docstring",
            "hand_calibration": HAND_COUNTS, "hand_summary": hand_summary(),
            "prototype_probe": rows,
            "generated_side_spec": (
                "See the module docstring. towers_per_unit_length = n / L(R); "
                "spacing_cv = sd(gaps)/mean(gaps) over the n closed-ring gaps; "
                "corner_share = share of towers within tol of a ring vertex whose "
                "exterior angle exceeds corner_deg. spacing_cv is the dimensionless "
                "comparison quantity; towers_per_unit_length must carry its unit."),
            "headline_finding": (
                "2 of 5 non-holdout walled plates carry a circuit with ZERO towers "
                "(an earth vallum and a hedged bank); of the 3 masonry circuits, all three "
                "space towers ALONG the run, and hf347's is a smooth oval with no corners at "
                "all. A corners-only tower rule is refuted as the governing rule by the "
                "corpus's own drawing.")}
    if "--hand" in args and not write:
        print(json.dumps({"hand_calibration": HAND_COUNTS,
                          "hand_summary": hand_summary(),
                          "headline_finding": blob["headline_finding"]}, indent=1))
        return
    dest = os.path.join(HERE, "MFI1-towers.json")
    if write:
        tmp = dest + ".tmp"
        json.dump(blob, open(tmp, "w"), indent=1); open(tmp, "a").write("\n")
        os.replace(tmp, dest); print("wrote", dest)
    else:
        print(json.dumps(blob, indent=1))
        print("DRY RUN — pass --write to persist")


if __name__ == "__main__":
    main()
