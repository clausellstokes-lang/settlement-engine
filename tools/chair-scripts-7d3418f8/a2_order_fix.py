# -*- coding: utf-8 -*-
"""Charter correction: EM-A2a precedes EM-A2b (the trains had them the wrong way round); EM-B1e floats. ODQ §934.47 addendum 21."""
import io, sys

c, f, stamp = sys.argv[1:4]

CHARTER = """## Amendments of __STAMP__ — A CORRECTION TO THE TRAIN ORDER: EM-A2a PRECEDES EM-A2b; EM-B1e FLOATS (ODQ §934.47 addendum 21)

Measured from the compiled drafts while planning the pre-proof pipeline (kit `packets-waiting/`): **EM-A2b's change manifest MODIFIES `src/domain/edit/pools.js` and `tests/domain/editPools.test.js`, which EM-A2a CREATES**, and A2b's own header says `Depends on: EM-P3 and EM-A2a — this packet APPENDS rows to A2a's POOLS`; EM-A2a in turn depends on EM-A1 (a `pool` field names a pool id). The train table above — the original plan's rows for EM-T5 and EM-T6, copied unchanged into the sequencing amendment — carries A2b in T5 and A2a in T6: the wrong way round; the sealed dispatch would have refused A2b for a missing substrate. CORRECTED:

| when | members, in order |
|---|---|
| **EM-T5** | EM-A1 → **EM-A2a** · EM-P1b (with the three name-keyed choice sites) · EM-B3c |
| **EM-T6** | **EM-B1f** (first — it blocks EM-B1a) → **EM-A2b** → EM-B1a |
| **floating** | **EM-B1e** (the pulse's one ruin writer): its header says `Depends on: NONE`, its two paths touch no other member's — it is pre-proofed NOW and built whenever the slot would otherwise wait for a READY packet, joining whichever train is open |

Everything else in the sequencing amendment stands. The lesson, taken into the pre-proof pipeline: a train table is a CLAIM until it is checked against the members' change manifests — the chair diffs every train's order against `changeManifest` CREATE/MODIFY pairs before its first member is promoted.

"""

ODQ = """- **§934.47 addendum 21 — A TRAIN-ORDER DEFECT CAUGHT BEFORE IT COST ANYTHING: EM-A2a PRECEDES EM-A2b; EM-B1e FLOATS (__STAMP__; the successor chair; vetoable).** Planning which pre-proofs can run ahead of the slot, the chair read the compiled drafts' change manifests: EM-A2b MODIFIES `src/domain/edit/pools.js`, which EM-A2a CREATES (and A2b's header names A2a as a dependency), yet the charter's trains — the original plan's rows, copied unchanged into §934.53's sequencing — built A2b in T5 and A2a in T6. The sealed dispatch would have refused A2b for a missing substrate; nothing was built on the error. CORRECTED in the charter: T5 = EM-A1 → EM-A2a · EM-P1b · EM-B3c; T6 = EM-B1f → EM-A2b → EM-B1a; EM-B1e (no dependency, two paths no other member touches) FLOATS — pre-proofed now, built whenever the slot would otherwise wait. PROCESS: the chair diffs every train's order against its members' CREATE/MODIFY pairs before the train's first promotion.
"""

t = io.open(c, encoding="utf-8").read()
anchor = "## Pre-proof tasks (Opus, read-only, before each packet is READY)"
assert t.count(anchor) == 1
io.open(c, "w", encoding="utf-8").write(t.replace(anchor, CHARTER.replace("__STAMP__", stamp) + anchor))
o = io.open(f, encoding="utf-8").read().rstrip("\n")
io.open(f, "w", encoding="utf-8").write(o + "\n" + ODQ.replace("__STAMP__", stamp))
print("charter: A2a before A2b; B1e floats; ODQ addendum 21")
