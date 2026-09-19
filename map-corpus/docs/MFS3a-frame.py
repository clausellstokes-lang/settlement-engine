#!/usr/bin/env python3
"""MF-S3a SAMPLING FRAME.
Builds the studiable plate roster: 313 plates minus the CONSERVATIVE holdout
union (every plate id named anywhere in laneHFM1-holdout-proposal.json, which
covers `proposed`, `kept`, `added`, `dropped` and the 12-swap `minimal_swap`
arms).  Also emits the lettering-scrub set (geometry OK, naming DISQUALIFIED)
parsed from laneHF4-receipt.md section 'SCRUB LIST'.
Outputs MFS3a-frame.json.
"""
import json, os, re, csv, collections

CORPUS = "/Users/cstokes/Desktop/settlement-engine/map-corpus"
DOCS = os.path.join(CORPUS, "docs")

# ---- holdout: conservative union of every hf-id named anywhere in the file ----
ho = json.load(open(os.path.join(DOCS, "laneHFM1-holdout-proposal.json")))
hold = set()
def walk(x):
    if isinstance(x, str):
        if re.fullmatch(r"hf\d+", x): hold.add(x)
    elif isinstance(x, list):
        for i in x: walk(i)
    elif isinstance(x, dict):
        for v in x.values(): walk(v)
walk(ho)

# ---- scrub list (LETTERING/NAMING disqualified only) ----
txt = open(os.path.join(DOCS, "laneHF4-receipt.md")).read()
m = re.search(r"### .{0,4}SCRUB LIST.*?\n(.*?)\n---", txt, re.S)
scrub = set(re.findall(r"hf\d+", m.group(1))) if m else set()

# ---- roster from the measured CSV (has category/tier/era per plate) ----
rows = list(csv.DictReader(open(os.path.join(DOCS, "laneHFM1-corpus-measured.csv"))))
by_id = {r["id"]: r for r in rows}
files = {}
for fn in sorted(os.listdir(os.path.join(CORPUS, "plates"))):
    pid = fn.split("-")[0]
    files[pid] = fn

studiable = [p for p in files if p not in hold]
frame = {
    "corpus_n": len(files),
    "holdout_excluded_n": len(hold & set(files)),
    "holdout_ids": sorted(hold & set(files), key=lambda s: int(s[2:])),
    "studiable_n": len(studiable),
    "scrub_lettering_n": len(scrub & set(files)),
    "scrub_lettering_ids": sorted(scrub & set(files), key=lambda s: int(s[2:])),
    "plates": {p: {"file": files[p],
                   "category": by_id.get(p, {}).get("category"),
                   "tier": by_id.get(p, {}).get("tier"),
                   "era": by_id.get(p, {}).get("era"),
                   "stem": by_id.get(p, {}).get("stem")}
               for p in sorted(studiable, key=lambda s: int(s[2:]))},
}
cat = collections.Counter(v["category"] for v in frame["plates"].values())
tier = collections.Counter(v["tier"] for v in frame["plates"].values())
era = collections.Counter(v["era"] for v in frame["plates"].values())
frame["studiable_by_category"] = dict(cat)
frame["studiable_by_tier"] = dict(tier)
frame["studiable_by_era"] = dict(era)
json.dump(frame, open(os.path.join(os.path.dirname(__file__), "MFS3a-frame.json"), "w"), indent=1)
print("corpus", frame["corpus_n"], "| holdout excluded", frame["holdout_excluded_n"],
      "| STUDIABLE", frame["studiable_n"], "| lettering-scrub", frame["scrub_lettering_n"])
print("by category:", dict(cat))
print("by tier:", dict(tier))
print("by era:", dict(era))
print("scrub ids:", frame["scrub_lettering_ids"])
