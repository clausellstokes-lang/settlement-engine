# -*- coding: utf-8 -*-
"""The EM preamble's second amendment (owed since the EM-B1k2 pre-proof's fates, ODQ §934.47 addendum 39): §P2 row 11 gains (a) the
sentence that a skipped `skipIf(!requireDistRead)` byte arm is not a pass, and (b) `src/domain/density/factionLifecycle.js`'s membership
in the DERIVED eager first-paint closure on the byte row. Self-verifying: it imports `vite.config.js`'s `EAGER_FIRST_PAINT_MODULES` (a
graph walk, not a hand list) and refuses unless factionLifecycle.js is in it, and it finds the ruling on the ledger. Run from the worktree
ON the branch, tree clean, AFTER EM-B1k2's flip and BEFORE EM-P2 v4 is placed (P2 cites the new hash). Prints the new SHA-256; the commit
is the chair's, by pathspec. argv: <ledger checkout path>"""
import hashlib, io, re, subprocess, sys

ledger = sys.argv[1]
P = "docs/implementation/preambles/EM-PREAMBLE.md"
FL = "src/domain/density/factionLifecycle.js"

def run(*a):
    return subprocess.run(list(a), capture_output=True, text=True)

assert run("git", "status", "--short").stdout.strip() == "", "the tree is not clean"
# (1) the code fact, EXECUTED: factionLifecycle.js is in the derived eager first-paint closure
probe = run("node", "--input-type=module", "-e",
            "const m = await import('./vite.config.js'); const s = [...m.EAGER_FIRST_PAINT_MODULES]; "
            "console.log(JSON.stringify({ size: s.length, member: s.some(p => p.replace(/\\\\/g, '/').endsWith('" + FL + "')) }))")
assert probe.returncode == 0, probe.stderr[-800:]
import json
fact = json.loads(probe.stdout.strip().split("\n")[-1])
assert fact["member"], "factionLifecycle.js is NOT in the derived eager closure at HEAD (size %d) — the ruling's fact does not hold; STOP" % fact["size"]
# (2) the ledger fact: the ruling and its addendum number
odq = run("git", "-C", ledger, "show", "HEAD:docs/OWNER_DECISION_QUEUE.md").stdout
m = [ln for ln in odq.split("\n") if "factionLifecycle.js`'s EAGER membership" in ln]
assert len(m) == 1, len(m)
num = re.search(r"§934\.47 addendum (\d+)", m[0])
cite = "ODQ §934.47 addendum %s" % num.group(1) if num else "ODQ §934.47 (the EM-B1k2 pre-proof's fates, 2026-09-20)"
print("eager closure size", fact["size"], "| factionLifecycle.js member: True | ruling cited as", cite)

s = io.open(P, encoding="utf-8").read()
old_hash = hashlib.sha256(s.encode("utf-8")).hexdigest()
anchor = ("THE CURE IS THE PLACEMENT BEFORE IT IS THE CEILING: bytes a bundle never reads are moved out of its import closure, not paid for "
          "(EM-P3's citation map, measured at +634 B into the worker for data the worker never reads).")
assert s.count(anchor) == 1, "row 11's closing sentence is not where this script expects it"
assert "skipIf(!requireDistRead)" not in s, "the amendment is already in the preamble"
add = (" A `skipIf(!requireDistRead)` byte arm that SKIPPED is not a pass: a receipt quotes the arm's executed figure and the dist it read, or says the arm "
       "skipped — a skipped arm proves nothing about a budget, and a `check:packet` exit 0 does not promote it (" + cite + "). `" + FL + "` is a member of the "
       "DERIVED eager first-paint closure (`EAGER_FIRST_PAINT_MODULES`, the graph walk `vite.config.js` exports — not a hand list; measured true at EM-B1k2's "
       "compile and re-executed by this amendment over a closure of " + str(fact["size"]) + " modules): bytes a member lands there are first-paint bytes and price "
       "against `tests/build/vendorPdfLazy.test.js`'s budget as well as the worker's; a pre-proof re-measures membership by importing the set, never by reading a list.")
s = s.replace(anchor, anchor + add, 1)
io.open(P, "w", encoding="utf-8").write(s)
new_hash = hashlib.sha256(s.encode("utf-8")).hexdigest()
print("EM-PREAMBLE amended; SHA-256", old_hash[:12], "->", new_hash)
print("NEW_PREAMBLE_SHA=" + new_hash)
