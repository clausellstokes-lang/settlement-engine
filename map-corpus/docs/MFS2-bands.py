#!/usr/bin/env python3
"""MF-S2 — re-derive the atlas §2.3 bands on the STRONGEST MEASURED COHORT
(ODQ §244.4 amendment): HF-1-era plates UNION the measured top-decile on the
register index.  Never the corpus median.

Reads only map-corpus/docs/laneHFM1-corpus-measured.csv (313 rows x 47 cols).
Prints every figure MF-S2 writes into the atlas, with its cohort and n.
"""
import csv, math, json, sys, os

CSV = "/Users/cstokes/Desktop/settlement-engine/map-corpus/docs/laneHFM1-corpus-measured.csv"

rows = list(csv.DictReader(open(CSV)))

def f(r, k):
    v = r.get(k, "")
    if v is None or v == "":
        return None
    try:
        return float(v)
    except ValueError:
        return None

def pct(vals, p):
    v = sorted(vals)
    if not v:
        return None
    k = (len(v) - 1) * p / 100.0
    lo, hi = math.floor(k), math.ceil(k)
    if lo == hi:
        return v[int(k)]
    return v[lo] + (v[hi] - v[lo]) * (k - lo)

def band(vals, nd=2):
    vals = [v for v in vals if v is not None]
    if not vals:
        return None
    return dict(n=len(vals),
                mn=round(min(vals), nd), p5=round(pct(vals, 5), nd),
                med=round(pct(vals, 50), nd), p95=round(pct(vals, 95), nd),
                mx=round(max(vals), nd))

# ---------------------------------------------------------------- cohorts
reg = [f(r, "register_index") for r in rows]
REG_P90 = pct([v for v in reg if v is not None], 90)
print(f"register_index: n={len(rows)}  corpus median={pct([v for v in reg if v is not None],50):.2f}  "
      f"TOP-DECILE THRESHOLD p90={REG_P90:.2f}")

hf1     = [r for r in rows if r["era"] == "HF-1"]
topdec  = [r for r in rows if f(r, "register_index") is not None and f(r, "register_index") >= REG_P90]
strong  = [r for r in rows if r in hf1 or r in topdec]
# set-union by id (avoid identity issues)
ids_hf1 = {r["id"] for r in hf1}
ids_top = {r["id"] for r in topdec}
ids_str = ids_hf1 | ids_top
strong  = [r for r in rows if r["id"] in ids_str]

print(f"HF-1 cohort n={len(hf1)} | top-decile n={len(topdec)} "
      f"(overlap {len(ids_hf1 & ids_top)}) | STRONGEST COHORT n={len(strong)}")
print("  top-decile members not in HF-1:", sorted(ids_top - ids_hf1, key=lambda s: int(s[2:])))
print()

AXES = [
    ("chroma",                 "chroma",                  1),
    ("paper_grain_sigma",      "paper grain sigma",       2),
    ("wash_within_sigma",      "within-fill wash sigma",  2),
    ("fill_tone_iqr",          "fill-tone IQR",           1),
    ("stroke_ratio_p90_p25",   "stroke ratio p90/p25",    2),
    ("stroke_p25",             "stroke p25",              1),
    ("stroke_p50",             "stroke p50",              1),
    ("stroke_p75",             "stroke p75",              1),
    ("stroke_p90",             "stroke p90",              1),
    ("ink_L",                  "ink L",                   1),
    ("paper_L",                "paper L",                 1),
    ("paper_warmth_RmB",       "paper warmth R-B",        1),
    ("ink_warmth_RmB",         "ink warmth R-B",          1),
    ("L1",                     "L1",                      1),
    ("L10",                    "L10",                     1),
    ("L50",                    "L50",                     1),
    ("L90",                    "L90",                     1),
    ("L99",                    "L99",                     1),
    ("L_range_1_99",           "true L1->L99 range",      1),
    ("value_range_pal8",       "palette-8 cluster range", 1),
]

print("=" * 100)
print(f"{'axis':26s} {'cohort':10s} {'n':>4s} {'min':>8s} {'p5':>8s} {'MEDIAN':>8s} {'p95':>8s} {'max':>8s}")
print("=" * 100)
out = {}
for key, label, nd in AXES:
    out[key] = {}
    for cname, coh in (("STRONGEST", strong), ("HF-1", hf1), ("top-dec", topdec), ("corpus", rows)):
        b = band([f(r, key) for r in coh], nd)
        out[key][cname] = b
        if b:
            print(f"{label:26s} {cname:10s} {b['n']:4d} {b['mn']:8.2f} {b['p5']:8.2f} "
                  f"{b['med']:8.2f} {b['p95']:8.2f} {b['mx']:8.2f}")
    print("-" * 100)

# ------------------------------------------------- hex centroids (strongest)
def centroid(coh, key):
    hexes = [r[key] for r in coh if r.get(key)]
    R = G = B = 0
    for h in hexes:
        h = h.lstrip("#")
        R += int(h[0:2], 16); G += int(h[2:4], 16); B += int(h[4:6], 16)
    n = len(hexes)
    return "#%02X%02X%02X" % (round(R / n), round(G / n), round(B / n)), n

for key in ("paper_hex", "ink_hex"):
    for cname, coh in (("STRONGEST", strong), ("HF-1", hf1), ("corpus", rows)):
        c, n = centroid(coh, key)
        print(f"{key:10s} centroid {cname:10s} n={n:3d}  {c}")
print()

# ---------------------------------------------- ink-L quality gate check
print("=" * 100)
print("INK L AS THE QUALITY PROXY (replaces the retired value-range band)")
for cname, coh in (("STRONGEST", strong), ("HF-1", hf1), ("corpus", rows)):
    v = [f(r, "ink_L") for r in coh if f(r, "ink_L") is not None]
    print(f"  {cname:10s} n={len(v):3d}  p5={pct(v,5):.1f}  p25={pct(v,25):.1f}  med={pct(v,50):.1f}  "
          f"p75={pct(v,75):.1f}  p95={pct(v,95):.1f}  max={max(v):.1f}")
for thr in (45, 62):
    for cname, coh in (("STRONGEST", strong), ("corpus", rows)):
        v = [f(r, "ink_L") for r in coh if f(r, "ink_L") is not None]
        above = sum(1 for x in v if x > thr)
        print(f"  share above ink L {thr}: {cname:10s} {above}/{len(v)} = {100*above/len(v):.1f}%")
print()

# ---------------------------------------------- named plates
NAMED = ["hf3","hf5","hf10","hf11","hf15","hf20","hf24","hf34","hf35","hf40","hf50",
         "hf56","hf57","hf60","hf61","hf62","hf63","hf72","hf90","hf100","hf103",
         "hf104","hf289","hf300","hf355","hf389"]
by_id = {r["id"]: r for r in rows}
print("=" * 100)
print(f"{'plate':7s} {'era':6s} {'inkL':>6s} {'pal8':>6s} {'L1_99':>6s} {'chroma':>7s} "
      f"{'grain':>6s} {'wash':>6s} {'IQR':>6s} {'ratio':>6s} {'REG':>6s} {'paperL':>7s} {'warm':>5s}")
for pid in NAMED:
    r = by_id.get(pid)
    if not r:
        print(f"{pid:7s}  -- not in corpus --"); continue
    def g(k, d="  n/a"):
        v = f(r, k)
        return f"{v:6.1f}" if v is not None else d
    print(f"{pid:7s} {r['era']:6s} {g('ink_L')} {g('value_range_pal8')} {g('L_range_1_99')} "
          f"{g('chroma'):>7s} {g('paper_grain_sigma')} {g('wash_within_sigma')} {g('fill_tone_iqr')} "
          f"{g('stroke_ratio_p90_p25')} {g('register_index')} {g('paper_L'):>7s} {g('paper_warmth_RmB'):>5s}")
print()

# ---------------------------------------------- superlative audit (atlas claims over n=49 vs n=313)
print("=" * 100)
print("SUPERLATIVE AUDIT — atlas claims made over its 49, tested over 313")
def extreme(key, hi=True, n=5):
    v = [(f(r, key), r["id"], r["era"]) for r in rows if f(r, key) is not None]
    v.sort(reverse=hi)
    return v[:n]
for key, hi, claim in (("chroma", True,  "hf72 chroma 69.5 = highest in corpus"),
                       ("chroma", False, "hf5 chroma 18.0 = lowest in corpus"),
                       ("wash_within_sigma", True, "hf20/hf50 wash 4.44 = highest in corpus"),
                       ("paper_grain_sigma", True, "hf62 grain 3.18 = highest measured"),
                       ("fill_tone_iqr", True, "hf56 IQR 100.1 = by far the widest measured"),
                       ("ink_L", True, "hf60 ink #6F5546 = lightest ink in corpus"),
                       ("stroke_p90", True, "hf55 stroke p90 35 = heaviest strokes in corpus"),
                       ("L_range_1_99", True, "hf5 = widest value range in corpus"),
                       ("register_index", True, "(no atlas claim) best painted register")):
    print(f"  CLAIM: {claim}")
    print("        ", [(i, round(x, 2), e) for x, i, e in extreme(key, hi)])
print()

json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 "MFS2-bands.json"), "w"), indent=1)
print("wrote MFS2-bands.json")
