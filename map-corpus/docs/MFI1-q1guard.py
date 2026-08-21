#!/usr/bin/env python3
"""MF-I1 · THE Q-1 GUARD (ODQ §297.7b) — REDS if a grading document issues a
verdict against a WITHDRAWN rung.

WHAT §297.7b ORDERED, verbatim: *"Q-1: RATIFIED; the '(counts hedges as
buildings)' mechanism IS sourced — §244.5's hf90 (12 roofs, reads 99.6); a
guard that REDS if a grading verdict cites a withdrawn rung is ordered into
W0's instrument work."*

WHAT IS WITHDRAWN.  ODQ §244.5, restated at GENERATION-SPEC.md §2.1: T-01's
THORP and HAMLET fabric-grain bands are WITHDRAWN — not widened — because
`cells_across` counts dark runs and at that scale the bounding box is mostly
hedges, tofts, furlong furrows and orchard rows.  *"Any grading verdict already
issued against them is withdrawn with them."*  A withdrawn target is the fifth
verdict in §0.1's honesty key: **not a pass, not a fail, and it MAY NOT BE
GRADED.**

WHAT THE GUARD FIRES ON.  A line of a grading surface that, in one sentence:
  (a) names a withdrawn rung  -- `thorp` or `hamlet`  -- AND
  (b) names the withdrawn quantity -- the grain band / cells-across family -- AND
  (c) carries a GRADING VERDICT token -- MEETS, MISSES, PASS, FAIL, in band,
      out of band, "x1.76 from the floor", a check or star verdict glyph.
and does NOT carry a WITHDRAWAL MARKER (withdrawn / may not be graded / NOT
GRADED / no band / unvalidated-by-instrument / this guard's own allow-list),
which is how the documents correctly SAY that the rung is withdrawn.

WHY ALL THREE CONDITIONS.  A guard on (a) alone would red on every honest
sentence in the spec.  A guard on (a)+(c) would red on the tier ladder's
prose about thorps generally.  The conjunction is narrow enough to be quiet on
a correct corpus and specific enough to catch the actual failure -- a table row
that grades a thorp's grain against a band that no longer exists.

THE PLANTED-VIOLATION ARM IS PART OF THE INSTRUMENT.  `--selftest` writes a
synthetic grading surface containing (i) three sentences that MUST fire and
(ii) five near-miss sentences quoted from the real documents that MUST NOT, and
fails loudly if either half is wrong.  A guard nobody has watched fire is a
guard nobody knows is wired up.

INVOCATION
    python3 MFI1-q1guard.py --selftest     # prove it can fire, and can stay quiet
    python3 MFI1-q1guard.py                # scan map-corpus/docs grading surfaces
    python3 MFI1-q1guard.py --json
  Exit status: 0 = green, 1 = RED (a verdict against a withdrawn rung),
  2 = the self-test failed, which is a RED about the guard itself.
  Designed to run beside corpus_integrity.py; it imports nothing from it and
  has no side effects.
"""
import json, os, re, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))

WITHDRAWN_RUNGS = ("thorp", "hamlet")

# (b) the withdrawn QUANTITY: T-01's fabric-grain band and its instrument.
QUANTITY_RE = re.compile(
    r"cells[ _-]?across|fabric grain|grain band|T-01|grain \(cells|cells_across",
    re.I)

# (c) a GRADING VERDICT.
VERDICT_RE = re.compile(
    r"\bMEETS\b|\bMISSES\b|\bMISSED\b|\bPASSES\b|\bPASS\b|\bFAILS\b|\bFAIL\b"
    r"|\bIN BAND\b|\bOUT OF BAND\b|\bWITHIN BAND\b|\bOFF BAND\b"
    r"|from the floor|from the ceiling|below the band|above the band"
    r"|\bCOMPLIES\b|\bNON-COMPLIANT\b|\bGRADED\s+(?:A|B|C|D|F)\b",
    re.I)

# the markers that say the rung is withdrawn -- the correct sentences.
WITHDRAWAL_RE = re.compile(
    r"withdraw|may not be graded|not graded|no band|none —|none -"
    r"|unvalidated-by-instrument|instrument artifact|instrument artefact"
    r"|restores? (?:two )?rungs?|roof-count",
    re.I)

# Documents that are GRADING SURFACES: they publish verdicts.  Receipts and
# plans are scanned too -- a verdict is a verdict wherever it is written.
DEFAULT_GLOBS = ("*.md",)
# ...except this guard's own file and any file whose whole purpose is to quote
# the rule (the guard must not convict its own docstring; cf. ODQ 2026-08-16's
# lesson that quoting a forbidden matcher IN PROSE convicts).
SELF_EXEMPT = ("MFI1-q1guard.py",)


def sentences(text):
    """Split into sentence-ish units, keeping table rows whole -- a markdown
    table row IS the unit a verdict is published in."""
    out = []
    for lineno, line in enumerate(text.splitlines(), start=1):
        s = line.strip()
        if not s:
            continue
        if s.startswith("|"):
            out.append((lineno, s))
            continue
        for part in re.split(r"(?<=[.;])\s+", s):
            if part.strip():
                out.append((lineno, part.strip()))
    return out


def scan_text(text, source="<memory>"):
    hits = []
    for lineno, s in sentences(text):
        low = s.lower()
        rung = [r for r in WITHDRAWN_RUNGS if r in low]
        if not rung:
            continue
        if not QUANTITY_RE.search(s):
            continue
        if not VERDICT_RE.search(s):
            continue
        if WITHDRAWAL_RE.search(s):
            continue
        hits.append({"source": source, "line": lineno, "rungs": rung,
                     "text": s[:400]})
    return hits


def scan_dir(root=None):
    root = root or HERE
    hits, scanned = [], []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith(".")]
        for fn in sorted(filenames):
            if not fn.endswith(".md"):
                continue
            if fn in SELF_EXEMPT:
                continue
            path = os.path.join(dirpath, fn)
            rel = os.path.relpath(path, os.path.dirname(os.path.dirname(root)))
            try:
                text = open(path, encoding="utf-8", errors="replace").read()
            except OSError:
                continue
            scanned.append(rel)
            hits.extend(scan_text(text, rel))
    return hits, scanned


MUST_FIRE = [
    "| thorp | 5.4 | 8–14 | MISSES the band by x1.6 | fabric grain |",
    "The hamlet rung MEETS its cells across target at 18-26 and needs no work.",
    "T-01 grading: thorp fabric grain FAILS, town PASSES.",
]
MUST_NOT_FIRE = [
    "| thorp | — | 5.4 | withdrawn | NOT GRADED — the reported miss was an INSTRUMENT ARTIFACT |",
    "| **thorp** | none — WITHDRAWN | published 8-14 rested on n=1 with a misplaced window | may not be graded until a roof-count instrument exists |",
    "| village | 9.6 | 17.0 | 30-50 | MISSES x1.76 from the floor |",
    "T-01's THORP AND HAMLET RUNGS ARE WITHDRAWN AND MAY NOT BE GRADED.",
    "The thorp family reads as a loose cluster of holdings around a green.",
]


def selftest():
    bad = []
    for s in MUST_FIRE:
        if not scan_text(s, "<must-fire>"):
            bad.append(("SHOULD HAVE FIRED", s))
    for s in MUST_NOT_FIRE:
        if scan_text(s, "<must-not-fire>"):
            bad.append(("SHOULD NOT HAVE FIRED", s))
    # and the planted-violation arm on a real FILE, not only a string, so the
    # file walk itself is exercised.
    with tempfile.TemporaryDirectory() as td:
        with open(os.path.join(td, "PLANTED-GRADING-SURFACE.md"), "w") as fh:
            fh.write("# planted\n\n" + MUST_FIRE[0] + "\n")
        hits, scanned = scan_dir(td)
        if not hits:
            bad.append(("FILE WALK DID NOT FIRE ON A PLANTED FILE", td))
    return bad


def main():
    args = sys.argv[1:]
    if "--selftest" in args:
        bad = selftest()
        if bad:
            print("Q-1 GUARD SELF-TEST FAILED:")
            for why, s in bad:
                print("  %-34s %s" % (why, s[:160]))
            sys.exit(2)
        print("Q-1 guard self-test PASSED — %d planted violations fired, "
              "%d near-misses stayed quiet, file walk fired."
              % (len(MUST_FIRE), len(MUST_NOT_FIRE)))
        return
    hits, scanned = scan_dir()
    out = {"guard": "MFI1-q1guard", "orders": "ODQ 297.7b",
           "withdrawn_rungs": list(WITHDRAWN_RUNGS),
           "files_scanned": len(scanned), "violations": hits}
    if "--json" in args:
        print(json.dumps(out, indent=1))
    else:
        print("Q-1 guard: scanned %d markdown surfaces under %s"
              % (len(scanned), os.path.relpath(HERE)))
        if not hits:
            print("GREEN — no grading verdict is issued against a withdrawn rung.")
        else:
            print("RED — %d verdict(s) against a withdrawn rung:" % len(hits))
            for h in hits:
                print("  %s:%d  %s" % (h["source"], h["line"], h["text"][:200]))
    sys.exit(1 if hits else 0)


if __name__ == "__main__":
    main()
