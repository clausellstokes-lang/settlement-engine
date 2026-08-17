#!/usr/bin/env python3
"""
MFS3B-context-census.py — lane MF-S3b (ODQ §245/§246).

WHAT IT MEASURES, AND WHAT IT DOES NOT.
This instrument parses `laneHF-CALIBRATION.md` into one record per plate and
counts the incidence of CONTEXT features (water works, defence members,
extramural land uses, terrain accommodation, circulation furniture) across the
plates that are ELIGIBLE for study — i.e. the 313-plate corpus minus the blind
holdout (the union of laneHFM1-holdout-proposal.json's `proposed` list, its
`minimal_swap.proposed` list and that swap's `added` list).

⚠ HONESTY BOUND, restated in every consuming document:
This is a census of the INDEX PROSE, not of pixels. It measures how often a
feature was worth WRITING DOWN by the lane that viewed the plate. It is a
faithful lower bound on incidence (an unremarked ford is still a ford) and it
is reproducible, which by-eye recall is not. Figures derived from it are
labelled [M-index] and are never presented as pixel measurements. Pixel
measurement of these features would need per-plate hand-set windows, which is
the hazard MFS1-grain2.py's header already names.

Usage:  python3 MFS3B-context-census.py [--csv out.csv]
Run from map-corpus/docs/.
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(HERE, "laneHF-CALIBRATION.md")
HOLDOUT = os.path.join(HERE, "laneHFM1-holdout-proposal.json")
MEASURED = os.path.join(HERE, "laneHFM1-corpus-measured.csv")
PLATES = os.path.join(HERE, os.pardir, "plates")

# ── The excluded set ────────────────────────────────────────────────────────
def holdout_union():
    d = json.load(open(HOLDOUT))
    u = set(d["proposed"])
    u |= set(d["minimal_swap"]["proposed"])
    u |= set(d["minimal_swap"]["added"])
    return u

# The 8-item scrub list (laneHF4-receipt.md §"SCRUB LIST"). Excluded from
# LETTERING/NAMING observations only — they remain valid geometry teachers, so
# they stay in the structural census and are flagged here for any consumer that
# wants to talk about labels.
SCRUB = {
    "hf375", "hf292", "hf348",
    "hf190", "hf170", "hf318", "hf368", "hf383", "hf372", "hf374",  # real rivers
    "hf329", "hf350", "hf356", "hf361",                              # culture-bake
    "hf351", "hf353", "hf328", "hf249", "hf284",                     # units / saints
    "hf296", "hf287", "hf341", "hf314", "hf253", "hf299", "hf357",   # dates
    "hf171", "hf148", "hf268", "hf306", "hf309", "hf310", "hf295", "hf298",  # figures
}

# ── Feature vocabulary ──────────────────────────────────────────────────────
# Each family maps a feature name to a regex over the plate's index row.
# Word-boundary anchored; case-insensitive. Deliberately conservative: a term
# that could match a defect note about lettering is not used.

FEATURES = {
    # ─ WATER: the channel and its crossings ─
    "bridge":        r"\bbridge",
    "ford":          r"\bford\b|\bfords\b|\bfording\b",
    "ferry":         r"\bferr(y|ies)\b",
    "causeway":      r"\bcauseway",
    "portage":       r"\bportage",
    # ─ WATER: worked water ─
    "mill_water":    r"\bmill\b|\bmills\b|\bmill-|\bmillpond|\bmill pond",
    "leat_race":     r"\bleat\b|\bleats\b|\brace\b|\btail[- ]race|\bhead sluice",
    "weir_sluice":   r"\bweir\b|\bweirs\b|\bsluice",
    "quay_wharf":    r"\bquay|\bwharf|\bwharves|\bjetty|\bhard\b|\blanding stage",
    "basin_dock":    r"\bbasin|\bwet dock|\bdry dock|\bslipway|\bslip\b|\bnoost",
    "boom_chain":    r"\bboom\b|\bchain (boom|across|drawn)|\bchain\b.{0,20}water",
    "fish_works":    r"\bfish (weir|trap|pass|landing)|\beel buck|\bstake-?V|\boyster|\bmussel",
    "salt_works":    r"\bsalt (pan|working|cote)|\bsaltern|\bbrine",
    # ─ WATER: domestic and drainage ─
    "well":          r"\bwell\b|\bwells\b|\bwell-head|\bwellhead",
    "cistern":       r"\bcistern|\brain[- ]catch|\bpothole cistern|\btank\b",
    "conduit":       r"\bconduit|\bfountain|\bpump room|\bspring house",
    "drain_sewer":   r"\bdrain\b|\bdrains\b|\bcloaca|\bsewer|\bcess|\bmidden|\bstreet channel",
    "dike_defence":  r"\bdike\b|\bdyke\b|\blevee\b|\bsea defence|\bgroyne|\btraining wall|\bflood bank|\bflood arch",
    # ─ DEFENCE ─
    "wall_circuit":  r"\bwall\b|\bwalls\b|\bcircuit\b|\bcurtain\b|\brampart",
    "palisade":      r"\bpalisade|\bstockade|\bthorn (barrier|hedge)|\bhurdle",
    "ditch_bank":    r"\bditch\b|\bditches\b|\bbank and ditch|\bbank-and-ditch|\bglacis|\bberm\b",
    "tower":         r"\btower|\bturret|\bdrum\b",
    "gate":          r"\bgate\b|\bgates\b|\bgatehouse|\bgateway|\bpostern|\bbar\b|\bbars\b",
    "barbican":      r"\bbarbican|\bmurder-?hole|\bportcullis|\bdrawbridge",
    "citadel":       r"\bcitadel|\bcastle|\bkeep\b|\bmotte|\bbailey|\bstronghold|\bfort\b|\bpeel tower",
    "water_gate":    r"\bwater[- ]gate|\bsea gate|\bmill water gate",
    "wall_dead":     r"\bbricked|\bblocked gate|\brobbed|\bquarried|\bstub\b|\bproperty line|\bfossil",
    "terrain_flank": r"\bno towers|\babsent (on|along|elsewhere)|\bstops at the river|\bstops along|\bcliff (flank|face)|\bthe water does the work",
    # ─ EDGE AND OUTSIDE ─
    "suburb":        r"\bsuburb|\bfaubourg|\bribbon\b|\bribbons\b|\bshanty|\bextramural|\bcamp field",
    "extra_inn":     r"\binn\b|\binns\b|\bstabl|\bcaravanserai|\bserai\b|\bhospice",
    "noxious":       r"\btanner|\bdye (yard|works)|\bshambles|\blime kiln|\bkiln|\brope[- ]?walk|\bbrickfield|\bslaughter",
    "gallows":       r"\bgallows|\bgibbet",
    "lazaret":       r"\bleper|\blazaret|\bpest|\bplague (pit|ground)|\bquarantine",
    "cemetery":      r"\bcemeter|\bburial|\bgraveyard|\bchurchyard|\bbone[- ]?(house|yard)|\bcharnel",
    "gardens":       r"\bmarket garden|\borchard|\bgarden strip|\bclose\b|\bcloses\b|\btenter",
    "fields":        r"\bfield|\bfurlong|\bstrip|\bcommon\b|\bpasture|\bmeadow|\barable",
    "road_furniture":r"\bmilestone|\bmile post|\bmile stone|\bwayside cross|\bcairn|\bboundary stone|\bmark stone|\bway[- ]?post|\bguide post|\bdistance stone",
    # ─ TERRAIN ACCOMMODATION ─
    "hachure":       r"\bhachure",
    "terrace":       r"\bterrac",
    "cliff_crag":    r"\bcliff|\bcrag\b|\bscarp|\bgorge|\bravine|\bbluff",
    "contour_street":r"\bcontour|\bswitchback|\bstair (alley|street|path)|\bhollow[- ]way|\bstepped",
    "wet_refusal":   r"\bmarsh|\bfen\b|\bbog\b|\bflood (plain|line|meadow|mark)|\bwet ground|\bsoft ground|\bterp\b",
    "spring_line":   r"\bspring[- ]line|\bspring\b|\bsprings\b|\bdew pond",
    # ─ CIRCULATION AND LOGISTICS ─
    "market_void":   r"\bmarket (place|street|square|void|ground|cross)|\bmarket\b",
    "toll":          r"\btoll\b|\btolls\b|\btoll[- ](bar|gate|house|post)|\bcustoms|\bweighbeam|\bweigh house|\bweighing",
    "drove":         r"\bdrove\b|\bdroving|\bstance\b|\bstances\b|\bbeast (pound|pen|line)|\bcattle",
    "warehouse":     r"\bwarehouse|\bgranar|\bstore\b|\bstorehouse|\bmagazine|\bcrane\b",
    "cart_ground":   r"\bcart|\bwagon|\bwaiting ground|\bpackhorse|\bpack[- ]?track|\bsledway|\bsledge",
}

FAMILY = {
    "WATER-CROSSING": ["bridge", "ford", "ferry", "causeway", "portage"],
    "WATER-WORKED": ["mill_water", "leat_race", "weir_sluice", "quay_wharf",
                     "basin_dock", "boom_chain", "fish_works", "salt_works"],
    "WATER-DOMESTIC": ["well", "cistern", "conduit", "drain_sewer", "dike_defence"],
    "DEFENCE": ["wall_circuit", "palisade", "ditch_bank", "tower", "gate",
                "barbican", "citadel", "water_gate", "wall_dead", "terrain_flank"],
    "EDGE-OUTSIDE": ["suburb", "extra_inn", "noxious", "gallows", "lazaret",
                     "cemetery", "gardens", "fields", "road_furniture"],
    "TERRAIN": ["hachure", "terrace", "cliff_crag", "contour_street",
                "wet_refusal", "spring_line"],
    "CIRCULATION": ["market_void", "toll", "drove", "warehouse", "cart_ground"],
}

# ── Parse the index into per-plate rows ─────────────────────────────────────
# TWO sources, because the corpus's description is split across two documents:
#   1. laneHF-CALIBRATION.md — one bullet row per plate for hf85 onward (the
#      HF-2/3/4 growth rounds).
#   2. laneMFS1-urbanism-atlas.md PART 1 — a multi-line prose block per plate
#      for the 35 HF-1-era plates (hf3-hf84), which the calibration index only
#      lists by name. Without this source those 35 read as zero on every
#      feature, which would silently deflate every share in this census.
ROW_RE = re.compile(r"^\s*-\s+\*\*(hf\d+)\b(.*)$")
ATLAS = os.path.join(HERE, "laneMFS1-urbanism-atlas.md")
ATLAS_HEAD = re.compile(r"^###\s+(hf\d+)\s*[·.]\s*(.*)$")

def parse_index():
    rows = {}
    for line in open(INDEX, encoding="utf-8"):
        m = ROW_RE.match(line)
        if m:
            pid = m.group(1)
            # Longest wins: a passing mention never overwrites the real row.
            body = line.strip()
            if pid not in rows or len(body) > len(rows[pid]):
                rows[pid] = body

    # Atlas Part 1 blocks. ⚠ MF-S2 is editing that file; this parser reads
    # whatever is on disk and reports the count it found, so a changed atlas
    # changes the reported n rather than silently changing a share.
    cur, buf = None, []
    if os.path.exists(ATLAS):
        for line in open(ATLAS, encoding="utf-8"):
            m = ATLAS_HEAD.match(line)
            if m:
                if cur:
                    blk = " ".join(buf)
                    if cur not in rows or len(blk) > len(rows[cur]):
                        rows[cur] = blk
                cur, buf = m.group(1), [m.group(2)]
            elif line.startswith("#"):
                if cur:
                    blk = " ".join(buf)
                    if cur not in rows or len(blk) > len(rows[cur]):
                        rows[cur] = blk
                cur, buf = None, []
            elif cur is not None:
                buf.append(line.strip())
        if cur:
            blk = " ".join(buf)
            if cur not in rows or len(blk) > len(rows[cur]):
                rows[cur] = blk
    return rows

def plate_ids_on_disk():
    ids = set()
    for f in os.listdir(PLATES):
        if f.endswith(".png"):
            ids.add(f.split("-")[0])
    return ids

# Category from the measured CSV (authoritative tier/category labels).
def categories():
    cat = {}
    with open(MEASURED, encoding="utf-8") as fh:
        header = fh.readline().rstrip("\n").split(",")
        ci, cc, ct = header.index("id"), header.index("category"), header.index("tier")
        for line in fh:
            p = line.rstrip("\n").split(",")
            if len(p) > max(ci, cc, ct):
                cat[p[ci]] = (p[cc], p[ct])
    return cat

def main():
    excluded = holdout_union()
    rows = parse_index()
    on_disk = plate_ids_on_disk()
    cat = categories()

    eligible = sorted((p for p in on_disk if p not in excluded),
                      key=lambda s: int(s[2:]))
    missing_rows = [p for p in eligible if p not in rows]

    print(f"corpus on disk        : {len(on_disk)}")
    print(f"holdout union excluded: {len(excluded & on_disk)}")
    print(f"ELIGIBLE for study    : {len(eligible)}")
    print(f"  of which no index row: {len(missing_rows)} -> {missing_rows}")
    print(f"scrub-listed (lettering observations only): "
          f"{len(SCRUB & set(eligible))} of the eligible set")
    print()

    # ── ROLES. A plate is evidence for different questions depending on what
    # it draws. A specimen sheet is not a place; a substrate sheet is a place's
    # CONTEXT at league scale; a zoom is one corner of a place at plot scale.
    # Every share in the compendium names which role-pool it is over.
    def role(pid):
        stem = ""
        body = rows.get(pid, "")
        if "**" in body:
            stem = body.split("**")[1]
        stem = stem.lower()
        if pid in ("hf3", "hf4", "hf5"):
            return "SETTLEMENT"
        if re.search(r"spec-|chrome-|legend-|letter-|lod-|glyph-ladder", stem):
            return "SPECIMEN"
        if re.search(r"zoom", stem):
            return "ZOOM"
        if re.search(r"lens-|exp-", stem):
            return "LENS"
        if re.search(r"under-", stem):
            return "UNDER"
        if re.search(r"terrain-|countryside-|march-|aqueduct|way-network|"
                     r"parish-system|commons", stem):
            return "SUBSTRATE"
        return "SETTLEMENT"

    # HF-1-era plates whose description comes from the atlas rather than the
    # calibration index carry no `**stem**`; classify them by filename instead.
    stems_on_disk = {}
    for f in os.listdir(PLATES):
        if f.endswith(".png"):
            stems_on_disk[f.split("-")[0]] = f[:-4].lower()

    def role2(pid):
        r = role(pid)
        if r == "SETTLEMENT" and pid in stems_on_disk:
            s = stems_on_disk[pid]
            if re.search(r"spec-|chrome-|legend|letter-|lod-", s):
                return "SPECIMEN"
            if "zoom" in s or "closeup" in s:
                return "ZOOM"
            if re.search(r"lens-|exp-", s):
                return "LENS"
            if "under" in s or "undercity" in s:
                return "UNDER"
            if re.search(r"terrain-|countryside-|road-ladder|docks-plate|"
                         r"castle-plate|noxious-plate", s):
                return "SUBSTRATE"
        return r

    roles = {p: role2(p) for p in eligible}
    settle = [p for p in eligible if roles[p] == "SETTLEMENT" and p in rows]
    for r in ("SETTLEMENT", "SUBSTRATE", "ZOOM", "SPECIMEN", "LENS", "UNDER"):
        n = sum(1 for p in eligible if roles[p] == r)
        print(f"  role {r:<12} {n:>4}")
    print(f"settlement-plate pool used for morphology shares: {len(settle)}")

    # ⚠ DESCRIPTION-LENGTH CONFOUND, reported not hidden: the two description
    # sources differ in verbosity by roughly an order of magnitude, so a
    # feature is likelier to be NAMED on a plate the atlas describes. Any share
    # comparing HF-1-era plates against later ones must carry this caveat.
    import statistics as st
    lens_by_src = {"atlas(hf3-hf84)": [], "index(hf85+)": []}
    for p in eligible:
        if p not in rows:
            continue
        (lens_by_src["atlas(hf3-hf84)"] if int(p[2:]) <= 84
         else lens_by_src["index(hf85+)"]).append(len(rows[p]))
    for k, v in lens_by_src.items():
        if v:
            print(f"  description chars, {k}: n={len(v)} median={int(st.median(v))} "
                  f"min={min(v)} max={max(v)}")
    print()

    hits = {f: [] for f in FEATURES}
    for pid in eligible:
        body = rows.get(pid, "")
        for f, pat in FEATURES.items():
            if re.search(pat, body, re.I):
                hits[f].append(pid)

    hits_s = {f: [p for p in v if p in settle] for f, v in hits.items()}

    print("INCIDENCE [M-index] — count and share of plates whose index row names the feature")
    print(f"{'family':<16} {'feature':<16} {'elig n=' + str(len(eligible)):>12}   "
          f"{'settl n=' + str(len(settle)):>12}")
    for fam, feats in FAMILY.items():
        for f in feats:
            a, b = len(hits[f]), len(hits_s[f])
            print(f"{fam:<16} {f:<16} {a:>5} ({a/len(eligible):5.1%})   "
                  f"{b:>5} ({b/len(settle):5.1%})")
    print()

    # Co-incidence pairs that carry an argument in the compendium.
    def both(a, b, pool):
        A, B = set(hits[a]) & set(pool), set(hits[b]) & set(pool)
        return len(A & B), len(A), len(B)

    print("CO-INCIDENCE [M-index] over the settlement subset (A&B, A, B)")
    for a, b in [("wall_circuit", "suburb"), ("wall_circuit", "terrain_flank"),
                 ("wall_circuit", "water_gate"), ("bridge", "toll"),
                 ("mill_water", "leat_race"), ("noxious", "suburb"),
                 ("quay_wharf", "warehouse"), ("cliff_crag", "terrace"),
                 ("well", "cistern"), ("gate", "market_void")]:
        n, na, nb = both(a, b, settle)
        print(f"  {a:<14} & {b:<14} {n:>4}   ({a}={na}, {b}={nb})")
    print()

    if "--csv" in sys.argv:
        out = sys.argv[sys.argv.index("--csv") + 1]
        with open(out, "w", encoding="utf-8") as fh:
            fh.write("id,category,tier,role," +
                     ",".join(FEATURES.keys()) + "\n")
            for pid in eligible:
                body = rows.get(pid, "")
                c, t = cat.get(pid, ("", ""))
                vals = ["1" if re.search(p, body, re.I) else "0"
                        for p in FEATURES.values()]
                fh.write(f"{pid},{c},{t},{roles[pid]}," +
                         ",".join(vals) + "\n")
        print(f"wrote {out}")

if __name__ == "__main__":
    main()
