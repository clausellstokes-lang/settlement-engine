#!/usr/bin/env python3
"""MF-I1 · G-39 · THE CHAOS/ORTHOGONALITY TEST, EXECUTED.

This script does not decide anything.  GENERATION-SPEC.md 4.1c wrote a
FOUR-OUTCOME DECISION RULE before the numbers existed, precisely so that the
numbers could not be fitted to a preferred conclusion afterwards.  This script
computes the two arms and reports which of the four rows obtains.

THE HYPOTHESIS, quoted from 4.1c:
    in the corpus, the BLOCK scale is angularly disordered and the BUILDING
    scale is near-rectangular -- and our output has this the wrong way round,
    which is why it reads as mush.

ARM 1 (large scale), from MFS3a-planmetrics.json over the studiable frame:
    block_solidity_p50 . block_elongation_p50/p90 . orientation_order_phi
    . orientation_entropy
ARM 2 (small scale), from MFI1-footprints.json (gap G-40(iii)):
    per-footprint rectangularity, read against the SYNTHETIC CONTROL's own
    reference points in MFI1-control.json -- never against 1.0, because the
    extractor's ceiling for a perfect rectangle is not 1.0 and the control
    measures where it actually is.

THRESHOLDS, and where each one comes from.  4.1c names the two arms and the
four outcomes but does not put a number on "disordered" or on "rectangular".
Those two operationalisations are this lane's, they are stated here in full,
and they are RAISED in the lane receipt as judgment-dense calls the chair may
overrule without re-running anything -- every underlying figure is published.

  ARM 1 is DISORDERED iff all three hold over the frame:
      median orientation_order_phi  < 0.30
      median block_solidity_p50     < 0.90
      median block_elongation_p50   > 1.50
    WHY 0.30: it is not invented.  The corpus's own planned/organic
    discriminator is 1.2, and 6.2 measures PLANNED fabric on this very scale
    at phi 0.585-0.652 (hf26 new quarter, hf239 castra) against organic fabric
    at 0.069-0.131.  0.30 sits in the gap between the two populations the
    corpus itself draws.  WHY 0.90 and 1.50: a convex square block would read
    solidity ~1.0 and elongation ~1.0; 2.4's published reading is that the
    corpus "does not draw square blocks, it draws STRIPS".

  ARM 2 is RECTANGULAR iff the frame's median footprint rectangularity sits
    closer to the control's TRUE-RECTANGLE reading than to its TRUE-L-SHAPE
    reading, i.e. above the midpoint of the two.
    WHY: the instrument's scale is not the unit interval.  A perfect rectangle
    reads ~0.92 through this extractor and an L-shape ~0.68; a cut at their
    midpoint asks the only question 4.1c actually asks -- does a corpus
    footprint read more like a rectangle or more like a re-entrant shape --
    and it is anchored on the control, which never saw the corpus.
    Both modes must agree, or the verdict is reported as MODE-DEPENDENT.

SUBJECT SET.  Whole-settlement windows only (`part == whole`), holdout
excluded (L6), and grain-invalid tiers (thorp, hamlet) excluded from BOTH arms
because ODQ 244.5 invalidates the cell pitch there and this instrument's
autoscale and area band are both keyed to it.  Sub-windows (`@part`) are
reported separately and never pooled with their own parent plate.

INVOCATION
    python3 MFI1-footprints.py --control --write     # produces MFI1-control.json
    python3 MFI1-footprints.py --plates  --write     # produces MFI1-footprints.json
    python3 MFI1-g39.py                              # dry
    python3 MFI1-g39.py --write                      # -> MFI1-g39.json
"""
import json, os, sys

import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
import importlib.util as _ilu
_spec = _ilu.spec_from_file_location("mfi1_excl", os.path.join(HERE, "MFI1-exclusions.py"))
EXCL = _ilu.module_from_spec(_spec); _spec.loader.exec_module(EXCL)

PHI_DISORDERED_MAX = 0.30
SOLIDITY_DISORDERED_MAX = 0.90
ELONG_DISORDERED_MIN = 1.50
GRAIN_INVALID_TIERS = ("thorp", "hamlet")

RULE = [
    ("arm 1 disordered AND arm 2 rectangular",
     "hypothesis SUPPORTED. G-38's grid-chaos axis is scoped to the cut geometry and forced "
     "toward zero as pieces approach building size; G-37's vocabulary is the small-scale half. "
     "This is the rework 261 is gating"),
    ("arm 1 disordered AND arm 2 ALSO irregular",
     "hypothesis REFUTED for our target. The corpus's buildings are not rectangular and imitating "
     "a generator's squareness would move us AWAY from it. G-38 keeps its four axes; the chaos "
     "scoping is not adopted"),
    ("arm 1 ordered (contradicting 2.4)",
     "stop and re-examine the instrument, not the hypothesis -- it would contradict figures this "
     "document publishes as CONFIRMED"),
    ("arm 2 unmeasurable (G-40(iii) not built)",
     "the hypothesis stays a hypothesis and drives nothing. An untestable diagnosis is not a "
     "licence to rework"),
]


def _q(a, f):
    return round(float(np.percentile(np.asarray(a, float), f)), 4)


def arm1():
    rows = json.load(open(os.path.join(HERE, "MFS3a-planmetrics.json")))
    used, dropped = [], []
    for r in rows:
        pid = r.get("key", "").split("@")[0] or EXCL.plate_id(r.get("stem", ""))
        if not EXCL.allowed(pid):
            dropped.append({"key": r.get("key"), "why": "holdout(L6)"}); continue
        if r.get("part") != "whole":
            dropped.append({"key": r.get("key"), "why": "sub-window, not pooled"}); continue
        if r.get("tier") in GRAIN_INVALID_TIERS:
            dropped.append({"key": r.get("key"), "why": "grain-invalid tier (ODQ 244.5)"}); continue
        used.append(r)
    def col(name):
        return [r[name] for r in used if r.get(name) is not None]
    out = {"n_windows": len(used), "dropped": dropped,
           "windows": sorted(r["key"] for r in used)}
    for name in ("orientation_order_phi", "orientation_entropy", "block_solidity_p50",
                 "block_elongation_p50", "block_elongation_p90", "block_circularity_p50"):
        v = col(name)
        out[name] = {"p10": _q(v, 10), "p50": _q(v, 50), "p90": _q(v, 90), "n": len(v)}
    phi = out["orientation_order_phi"]["p50"]
    sol = out["block_solidity_p50"]["p50"]
    elo = out["block_elongation_p50"]["p50"]
    tests = {
        "phi_p50_lt_%.2f" % PHI_DISORDERED_MAX: bool(phi < PHI_DISORDERED_MAX),
        "solidity_p50_lt_%.2f" % SOLIDITY_DISORDERED_MAX: bool(sol < SOLIDITY_DISORDERED_MAX),
        "elongation_p50_gt_%.2f" % ELONG_DISORDERED_MIN: bool(elo > ELONG_DISORDERED_MIN),
    }
    out["tests"] = tests
    out["verdict"] = "DISORDERED" if all(tests.values()) else "ORDERED_OR_MIXED"
    return out


def control_refs():
    path = os.path.join(HERE, "MFI1-control.json")
    if not os.path.exists(path):
        return None
    blob = json.load(open(path))
    refs = {}
    for mode, head in blob["headline"].items():
        rect = head["rect_measured_p50"]
        lsh = head["lshape_measured_p50"]
        refs[mode] = {
            "rect_ceiling": rect,
            "lshape_ref": lsh,
            "wedge_ref": head["wedge_measured_p50"],
            "ellipse_ref": head["ellipse_measured_p50"],
            "cut_rect_vs_lshape": round((rect + lsh) / 2.0, 4),
            "recovery_rate_min": head["recovery_rate_min"],
            "recovery_rate_median": head["recovery_rate_median"],
            "merge_rate_max": head["merge_rate_max"],
            "split_rate_max": head.get("split_rate_max"),
            "spurious_rate_max": head["spurious_rate_max"],
        }
    return refs


def arm2():
    path = os.path.join(HERE, "MFI1-footprints.json")
    if not os.path.exists(path):
        return {"status": "UNMEASURABLE", "why": "MFI1-footprints.json absent"}
    blob = json.load(open(path))
    refs = control_refs()
    if refs is None:
        return {"status": "UNMEASURABLE", "why": "MFI1-control.json absent — an extractor with "
                                                 "an unmeasured recovery rate reports nothing"}
    out = {"status": "MEASURED", "control": refs, "by_mode": {},
           "by_subject_set": {}, "dropped": []}

    def aggregate(mode, wset_filter):
        pooled, per_window, tiers, keys = [], [], {}, []
        for r in blob["rows"]:
            key = r["key"]
            if not EXCL.allowed(key.split("@")[0]):
                continue
            if "@" in key or not r.get("grain_valid", True):
                continue
            if wset_filter and r.get("wset") != wset_filter:
                continue
            blk = r.get(mode, {})
            if not blk.get("n"):
                continue
            vals = [f["rect"] for f in blk.get("footprints", [])]
            pooled.extend(vals)
            per_window.append(blk["rect_p50"])
            tiers.setdefault(r["tier"], []).extend(vals)
            keys.append(key)
        if not pooled:
            return {"status": "EMPTY"}
        ref = refs[mode]
        med = _q(pooled, 50)
        return {
            "n_windows": len(per_window), "n_footprints": len(pooled),
            "windows": sorted(keys),
            "rect_pooled_p10": _q(pooled, 10), "rect_pooled_p25": _q(pooled, 25),
            "rect_pooled_p50": med, "rect_pooled_p75": _q(pooled, 75),
            "rect_pooled_p90": _q(pooled, 90),
            "rect_window_median_of_medians": _q(per_window, 50),
            "share_at_or_above_rect_ceiling": round(
                float((np.asarray(pooled) >= ref["rect_ceiling"]).mean()), 4),
            "normalised_to_rect_ceiling": round(med / ref["rect_ceiling"], 4),
            "cut": ref["cut_rect_vs_lshape"],
            "verdict": "RECTANGULAR" if med >= ref["cut_rect_vs_lshape"] else "IRREGULAR",
            "by_tier": {t: {"n": len(v), "rect_p50": _q(v, 50),
                            "normalised": round(_q(v, 50) / ref["rect_ceiling"], 4)}
                        for t, v in sorted(tiers.items())},
        }

    for mode in ("mass", "region"):
        out["by_mode"][mode] = aggregate(mode, None)
    for wset in ("MFS3a-frame", "footprint-resolving"):
        out["by_subject_set"][wset] = {m: aggregate(m, wset) for m in ("mass", "region")}
    out["subject_set_note"] = (
        "footprint-resolving = the zoom plates and the village tier, the only frames in which "
        "this corpus draws ONE BUILDING AT A TIME. In the MFS3a-frame windows at town tier and "
        "above the corpus draws PERIMETER-BLOCK RANGES with serrated frontages and no party "
        "lines, so a rectangularity measured there is a RANGE's, not a footprint's. Both "
        "aggregates are published; the second is the one that answers 4.1c's question on its "
        "own terms.")
    verdicts = {m: b.get("verdict") for m, b in out["by_mode"].items() if "verdict" in b}
    for wset, blk in out["by_subject_set"].items():
        for m, b in blk.items():
            if "verdict" in b:
                verdicts["%s/%s" % (wset, m)] = b["verdict"]
    vals = set(verdicts.values())
    out["verdict"] = (list(vals)[0] if len(vals) == 1 else "MODE-DEPENDENT")
    out["mode_verdicts"] = verdicts
    return out


def decide(a1, a2):
    if a2.get("status") != "MEASURED":
        return 3, a2.get("why", "arm 2 not built")
    if a1["verdict"] != "DISORDERED":
        return 2, "arm 1 did not read disordered"
    if a2["verdict"] == "RECTANGULAR":
        return 0, "arm 1 disordered, arm 2 rectangular"
    if a2["verdict"] == "IRREGULAR":
        return 1, "arm 1 disordered, arm 2 also irregular"
    return 1, ("arm 1 disordered; arm 2 verdict is MODE-DEPENDENT (%s) — reported as such, and "
               "the pre-registered row it lands in is the SECOND only if the chair accepts the "
               "mode that reads IRREGULAR" % a2.get("mode_verdicts"))


def main():
    a1 = arm1()
    a2 = arm2()
    idx, why = decide(a1, a2)
    out = {"instrument": "MFI1-g39", "spec": "GENERATION-SPEC.md 4.1c",
           "exclusions": EXCL.report(),
           "thresholds": {"phi_disordered_max": PHI_DISORDERED_MAX,
                          "solidity_disordered_max": SOLIDITY_DISORDERED_MAX,
                          "elongation_disordered_min": ELONG_DISORDERED_MIN,
                          "arm2_cut": "midpoint of the control's rectangle and L-shape readings"},
           "arm1": a1, "arm2": a2,
           "outcome_index": idx, "outcome": RULE[idx][0], "what_follows": RULE[idx][1],
           "why": why}
    dest = os.path.join(HERE, "MFI1-g39.json")
    if "--write" in sys.argv:
        tmp = dest + ".tmp"
        json.dump(out, open(tmp, "w"), indent=1); open(tmp, "a").write("\n")
        os.replace(tmp, dest); print("wrote", dest)
    else:
        print(json.dumps(out, indent=1))
        print("DRY RUN — pass --write to persist")


if __name__ == "__main__":
    main()
