#!/usr/bin/env python3
"""MF-I1 EXCLUSION MODULE — LAW L6 (the whole-channel holdout law) in code.

Every MFI1-* instrument imports this and passes every candidate plate through
`allowed()` BEFORE the image is opened.  L6 requires the exclusion to hold on
EVERY channel: image, measurement, and index/prose description.  This module is
therefore the single place the roster is spelled, so no instrument can drift.

ROSTER.  `laneHFM1-holdout-proposal.json` carries TWO 53-id arms: the lane's
`proposed` set and the `minimal_swap.proposed` set it recommended in its place.
They intersect in 25 ids, so their UNION is 81 ids.  Which of the two the chair
adopted is not recorded in a document this lane can read, so this module
excludes the UNION — the only choice that is correct under either adoption.
The arithmetic is printed by `--report` and is quoted in the lane receipt.

SCRUB.  The 34-plate lettering scrub (MORPHOLOGY-PLAN.md §0.2, corrected at ODQ
§298.1c) is NOT an exclusion: its geometry is used freely.  Only NAMING and
LETTERING observations are barred.  MFI1 instruments read geometry and tone
only and emit no naming observation, so the scrub list is carried here purely
so that any future consumer can assert that rule; `naming_barred()` is the
predicate, and it is deliberately separate from `allowed()`.

Invocation:  python3 MFI1-exclusions.py --report
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CORPUS = os.path.dirname(HERE)
PLATES = os.path.join(CORPUS, "plates")

_PROPOSAL = os.path.join(HERE, "laneHFM1-holdout-proposal.json")

# MORPHOLOGY-PLAN.md §0.2, "THE LETTERING SCRUB — 34 plates [M, CORRECTED]".
SCRUB_34 = ["hf148", "hf170", "hf171", "hf190", "hf249", "hf253", "hf268", "hf284",
            "hf287", "hf292", "hf295", "hf296", "hf298", "hf299", "hf306", "hf309",
            "hf310", "hf314", "hf318", "hf328", "hf329", "hf341", "hf348", "hf350",
            "hf351", "hf353", "hf356", "hf357", "hf361", "hf368", "hf372", "hf374",
            "hf375", "hf383"]


def _load_roster():
    with open(_PROPOSAL) as fh:
        d = json.load(fh)
    a = set(d["proposed"])
    b = set(d["minimal_swap"]["proposed"])
    return a, b


ARM_A, ARM_B = _load_roster()
HOLDOUT = ARM_A | ARM_B


def plate_id(name):
    """'hf347-town-three-circuits.png' -> 'hf347'.  Accepts stem, id, or path."""
    base = os.path.basename(str(name))
    m = re.match(r"(hf\d+)", base)
    return m.group(1) if m else None


def allowed(name):
    """True iff this plate may be opened, measured, or named by an MFI1 instrument."""
    pid = plate_id(name)
    return pid is not None and pid not in HOLDOUT


def naming_barred(name):
    """True iff naming/lettering observations are barred for this plate (geometry is not)."""
    return plate_id(name) in set(SCRUB_34)


def filter_stems(stems):
    """Split an iterable of plate stems into (kept, dropped)."""
    kept, dropped = [], []
    for s in stems:
        (kept if allowed(s) else dropped).append(s)
    return kept, dropped


def all_plate_stems():
    return sorted(f[:-4] for f in os.listdir(PLATES) if f.endswith(".png"))


def report():
    stems = all_plate_stems()
    kept, dropped = filter_stems(stems)
    ids_on_disk = {plate_id(s) for s in stems}
    out = {
        "plates_on_disk": len(stems),
        "holdout_arm_proposed": len(ARM_A),
        "holdout_arm_minimal_swap": len(ARM_B),
        "holdout_arms_intersection": len(ARM_A & ARM_B),
        "holdout_union_excluded": len(HOLDOUT),
        "holdout_union_present_on_disk": len(HOLDOUT & ids_on_disk),
        "plates_admissible": len(kept),
        "plates_excluded": len(dropped),
        "arithmetic": "%d on disk - %d holdout = %d admissible" % (
            len(stems), len(dropped), len(kept)),
        "scrub_34_naming_barred": len(SCRUB_34),
        "scrub_intersect_holdout": sorted(set(SCRUB_34) & HOLDOUT),
    }
    return out


if __name__ == "__main__":
    if "--report" in sys.argv or len(sys.argv) == 1:
        print(json.dumps(report(), indent=1))
