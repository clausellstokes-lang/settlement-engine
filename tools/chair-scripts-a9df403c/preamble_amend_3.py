# -*- coding: utf-8 -*-
"""The EM preamble's THIRD amendment, and the standard's matching sentences (owed at EM-B1f's placement sitting — ODQ §934.47
addenda 61 item 7, 72 Q1, 78 option 3). Four laws: (a) a CREATE `.js` under src/generators|src/domain declares the wiring census as
a GENERATED row and the build runs the generator; (b) an addresses-only citation row is outside the three-logic-file cap; (c) a
written-contract arm is proved by its counterforce measured, never red-first; (d) a `tests/lint` step that excludes the lighting
walker may join the sealed checks. Self-verifying: every anchor unique; the generator's stamped count symbol found in the tree; the
exclusion proved by vitest's own collection (the walker absent from the listed files); the three addenda found on the ledger.
Run from the worktree ON the branch, tree clean, AFTER EM-P2's flip and BEFORE EM-B1f is placed (B1f cites the new hash). Prints
the preamble's new SHA-256; the commit is the chair's, by pathspec. argv: <ledger checkout path>"""
import hashlib, io, re, subprocess, sys

ledger = sys.argv[1]
P = "docs/implementation/preambles/EM-PREAMBLE.md"
S = "docs/implementation/PACKET_STANDARD.md"
WALKER = "tests/lint/sovereigntyLightingContract.walker.test.js"
EXCL = "npx vitest run --pool=threads --maxWorkers=2 tests/lint --exclude=" + WALKER

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

assert run("git", "status", "--short").stdout.strip() == "", "the tree is not clean"
# (1) the code facts, EXECUTED
gen = io.open("scripts/wiring-census.mjs", encoding="utf-8").read()
assert "producerIndexFiles" in gen, "wiring-census.mjs no longer stamps producerIndexFiles — the law's fact does not hold; STOP"
lst = run("npx", "vitest", "list", "--filesOnly", "tests/lint", "--exclude=" + WALKER)
files = [ln for ln in lst.stdout.split("\n") if "tests/lint/" in ln]
assert files and not any(WALKER in ln for ln in files), "the exclusion did not remove the walker from vitest's collection; STOP"
# (2) the ledger facts: the three addenda and their phrases
odq = run("git", "-C", ledger, "show", "HEAD:docs/OWNER_DECISION_QUEUE.md").stdout
for num, phrase in (("61", "the THIRD preamble/standard amendment, owed at EM-B1f's placement sitting"),
                    ("72", "an ADDRESSES-ONLY citation row does NOT count against"),
                    ("78", "gains a fourth sentence: a member that CREATEs any `.js`")):
    rows = [ln for ln in odq.split("\n") if phrase in ln and ("addendum %s —" % num) in ln]
    assert len(rows) == 1, "addendum %s's ruling not found once on the ledger: %d" % (num, len(rows))
print("facts: producerIndexFiles stamped by the generator; the walker absent from %d listed tests/lint files; addenda 61/72/78 found" % len(files))

# ---- the preamble
s = io.open(P, encoding="utf-8").read()
old_hash = hashlib.sha256(s.encode("utf-8")).hexdigest()
for marker in ("wiring-census.json", "ADDRESSES-ONLY", "WRITTEN-CONTRACT", "--exclude="):
    assert marker not in s, "the amendment is already in the preamble: " + marker
a12 = "(EM-B1d version 4 joined a reversible status to an irreversible consequence).\n"
assert s.count(a12) == 1
rows = (
    "13. **A member that CREATEs any `.js` under `src/generators/**` or `src/domain/**` declares `docs/content/wiring-census.json` as a GENERATED row "
    "(a `MODIFY` in the manifest's action vocabulary) and its build runs the generator.** `scripts/wiring-census.mjs` stamps a producer-file COUNT "
    "(`producerIndexFiles`) over those two roots, so a new leaf moves the census even when no pool, variant or relation moved (EM-P2 v4's build STOP, "
    "2026-09-20 — the one register its sealed steps did not name); the build lane runs `node scripts/wiring-census.mjs` in its last gated batch and commits "
    "the regenerated file with the packet, the placement scripts add the row to any READY packet whose CREATEs qualify, and a regenerated artifact never counts "
    "as a handwritten file (ODQ §934.47 addendum 78).\n"
    "14. **An ADDRESSES-ONLY citation row is outside the standard's cap of three modified logic files.** A production file whose only edit is the "
    "`path:line` addresses inside its comments or string literals — no logic byte — is a CITATION row: it stays in the change manifest with its comment-line "
    "delta and it runs the source-citation walker, but it is not a logic home and never splits a packet (ODQ §934.47 addendum 72 Q1 — EM-R0d's "
    "`holderTable.js`; the standard's budget section carries the same sentence).\n")
s = s.replace(a12, a12 + rows, 1)
a6 = "**EM amendment:** unlike GR, an EM acceptance file under `tests/lint/` DOES owe its mutation-coverage manifest row (§P2.2).\n"
assert s.count(a6) == 1
s = s.replace(a6, a6.rstrip("\n") + (
    " **A WRITTEN-CONTRACT arm is proved by its counterforce measured, never red-first.** An acceptance case whose assertion already holds at the base "
    "(a declaration line pinned byte-identical, a set-equality true before the edit) cannot be red before the cure; it is proved by running the arm against "
    "a planted mutant or a perturbed input that reds the named title, restoring the exact pre-mutant SHA-256, then green — and the counterforce is quoted "
    "in the receipt beside the arm (ODQ §934.47 addendum 61 item 7; EM-B1k2's A2/A5/A6 idiom).\n"), 1)
a7 = "under a train both move to the terminal.\n"
assert s.count(a7) == 1
s = s.replace(a7, a7.rstrip("\n") + (
    " A `tests/lint` step that EXCLUDES the lighting walker — `" + EXCL + "` (the exclusion proved by vitest's own collection at this amendment: the walker "
    "absent from the listed files) — MAY join a member's sealed `checks` while that walker reds by design under a train, and reads TOOL-9's print mode once "
    "that lands; `tests/lint` WHOLE remains the instrument step at the lane's focused verification, because the whole directory caught a red the sealed "
    "steps could not (ODQ §934.47 addendum 61 item 7).\n"), 1)
io.open(P, "w", encoding="utf-8").write(s)
new_hash = hashlib.sha256(s.encode("utf-8")).hexdigest()

# ---- the standard
t = io.open(S, encoding="utf-8").read()
for marker in ("ADDRESSES-ONLY", "wiring-census", "--exclude=", "written-contract arm"):
    assert marker not in t, "the amendment is already in the standard: " + marker
b1 = ("Generated artifacts do not count as handwritten files, but the packet must name\n"
      "their generator and expected artifact set. Documentation receipts do not count\nas production lines.\n")
assert t.count(b1) == 1
t = t.replace(b1, b1 + (
    "\nAn ADDRESSES-ONLY citation row — a production file whose only edit is the\n"
    "`path:line` addresses inside its comments or string literals, no logic byte —\n"
    "does not count against the three-modified-logic-files cap. It stays a\n"
    "change-manifest row with its stated comment-line delta and it runs the\n"
    "source-citation walker; it is never a logic home and never splits a packet.\n"
    "Authority: `OWNER_DECISION_QUEUE.md` §934.47 addendum 72 (2026-09-20).\n"), 1)
b2 = "a formatter's diff would bury the one row that matters.\n\nAuthority: `OWNER_DECISION_QUEUE.md` §49, §50.2, §53.6, §85.4, §102.3.\n"
assert t.count(b2) == 1
t = t.replace(b2, (
    "a formatter's diff would bury the one row that matters.\n\n"
    "**A new `.js` leaf under `src/generators/**` or `src/domain/**` carries one obligation: its\n"
    "wiring-census row.** `scripts/wiring-census.mjs` stamps a producer-file COUNT\n"
    "(`producerIndexFiles`) over those two roots into `docs/content/wiring-census.json`, so a\n"
    "new leaf moves the census even when no pool or variant moved — discovered at a sealed build\n"
    "(EM-P2 v4, 2026-09-20) whose checks did not name the register. The wave declares the file\n"
    "as a GENERATED row, its build runs `node scripts/wiring-census.mjs` in its last gated batch,\n"
    "and the regenerated file lands with the packet.\n\n"
    "Authority: `OWNER_DECISION_QUEUE.md` §49, §50.2, §53.6, §85.4, §102.3, §934.47 addendum 78.\n"), 1)
b3 = "- Never raise a baseline, budget, timeout, or ceiling to finish a packet.\n"
assert t.count(b3) == 1
t = t.replace(b3, b3 + (
    "- A `tests/lint` step that excludes the lighting walker\n"
    "  (`" + EXCL + "`)\n"
    "  may be a sealed check while that walker reds by design under a train;\n"
    "  `tests/lint` whole remains the lane's instrument step (ODQ §934.47 addendum 61).\n"), 1)
b4 = "The agent must not start by changing a golden, baseline, budget, or persisted\nshape.\n"
assert t.count(b4) == 1
t = t.replace(b4, (
    "A written-contract arm — an assertion that already holds at the base — cannot fail\n"
    "first; it is proved by its counterforce measured (a planted mutant or a perturbed\n"
    "input that reds the named title, then restored) and the counterforce is quoted in\n"
    "the receipt (ODQ §934.47 addendum 61).\n\n") + b4, 1)
io.open(S, "w", encoding="utf-8").write(t)
print("EM-PREAMBLE amended (rows 13-14, §P6, §P7); PACKET_STANDARD amended (budget, registration, gate law, order); SHA-256", old_hash[:12], "->", new_hash)
print("NEW_PREAMBLE_SHA=" + new_hash)
