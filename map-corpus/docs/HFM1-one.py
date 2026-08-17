#!/usr/bin/env python3
"""HF-M1: one plate -> one JSON line. Reuses MF-S1's instruments UNMODIFIED
(imported by file path, not copied), so numbers stay comparable across rounds.
  measure_full : MFS1-measure.analyze(full.png, full.png)   [lossless source]
  measure_prev : MFS1-measure.analyze(prev-*.jpg, None)     [1100px preview, robustness arm]
  aesthetic    : MFS1-aesthetic.measure(full.png)           [grain/wash/IQR/stroke]
"""
import importlib.util, json, os, sys, traceback

def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m

BASE = os.path.dirname(os.path.abspath(__file__))
M = load("mfs1m", os.path.join(BASE, "MFS1-measure.py"))
A = load("mfs1a", os.path.join(BASE, "MFS1-aesthetic.py"))

for stem in sys.argv[1:]:
    full = os.path.join(BASE, "map-refs", stem + ".png")
    prev = os.path.join(BASE, "map-refs", "prev-" + stem + ".jpg")
    row = {"stem": stem}
    try:
        row["measure_full"] = M.analyze(full, full)
    except Exception:
        row["measure_full_error"] = traceback.format_exc(limit=1)
    try:
        row["measure_prev"] = M.analyze(prev, None) if os.path.exists(prev) else None
    except Exception:
        row["measure_prev_error"] = traceback.format_exc(limit=1)
    try:
        row["aesthetic"] = A.measure(full)
    except Exception:
        row["aesthetic_error"] = traceback.format_exc(limit=1)
    print(json.dumps(row))
    sys.stdout.flush()
