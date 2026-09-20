# -*- coding: utf-8 -*-
"""The owner's law: there is never any deferred work; anything emergent goes into the sequence. Charter amendment + ODQ §934.56."""
import io, sys

c, f, stamp = sys.argv[1:4]

CHARTER = """## Amendments of __STAMP__ — THE OWNER'S LAW: THERE IS NEVER ANY DEFERRED WORK; ANYTHING EMERGENT GOES INTO THE SEQUENCE (ODQ §934.56)

The owner: *"there should never be any deferred work. If anything comes up emergent to put it in the sequence."* FROM NOW: the word "deferred" names nothing in this program. A finding, a follow-up, a lane's "noticed, not touched", a recon's "could not measure" is, IN THE SAME TURN IT SURFACES, given exactly one of three fates and written here: **a SLOT** (a train, a window, a parallel lane, or a named packet's compile/pre-proof that must carry it), **an OWNER'S DECISION POINT** with its moment named, or **CLOSED — not work** with the reason. There is no fourth state and no side list: the kit's `DEFERRALS-UNSEQUENCED.md` is retired to a one-line pointer at this section. Every lane brief's report asks for "anything noticed"; the chair slots each item before its next dispatch.

**Everything that surfaced today and had no slot, slotted now:**
| item (where it surfaced) | fate |
|---|---|
| **EM-B1h** (NEW; EM-B1e's pre-proof R2): `worldPulseFate` is an OPEN vocabulary with eight writers — FINITE-SEMANTICS is the estate's law; one frozen `WORLD_PULSE_FATES` and a totality walker over its writers | SLOT: train EM-T6, after EM-B1f and BEFORE EM-B1a (whose decree adds the ninth spelling, `ruined_by_decree`); compiled when EM-B1e has landed |
| **FIX-T1** (EM-B1e R7): 28 hand-built replicas of the ruin shape in `tests/` | SLOT: a PARALLEL test-side lane after EM-B1e lands (it needs the writer), composed at EM-T4's terminal |
| the fourth institution vocabulary in `institutionStatusModel.js` (`operational · impaired · shell`; EM-B1e R4) and the irreversible consequence of a decree-ruin — criminal leashes sever, so undo and the tick must each say what becomes of them (R9) | SLOT: binding measurements of **EM-B1a's pre-proof** |
| the charter's stale EM-T3 row ("`jailed` and `ruined` into the two typedefs"; EM-B1e R5) | CORRECTED HERE: `EntityStatus` is NOT widened; `ruined` is the pulse's own literal, written through EM-B1e's one writer, and the institution-state pool is EM-B1a's |
| the third recon's "could not measure" list (sequences beyond three trials; the 63-row sweep of the edit findings; thorp and hamlet; undo-then-re-edit) | SLOT: **EM-R7's corpus ratchet** covers ALL SIX tiers, every ordered PAIR of the eight edits for chain determinism, and undo-then-re-edit; its compile carries this row |
| EM-A1 has no JSON manifest in the kit (an `.md` only) | SLOT: its compile pass produces one, queued the moment EM-P2 version 3 lands (it reads that register) |
| a packet whose `checks` name a `tests/build/` file would now be refused by the dist-gate guard with no `dist/` | SLOT: the pre-proof brief gains the sentence with TOOL-2's composition (the tooling window) |
| sibling copies of the model walker's import-blanking pattern (CURE-A lists them) | SLOT: **CURE-A2**, the same sitting as CURE-A's report, before run 17 if any sibling is convicted; CLOSED if none is |
| the scratch estate (the second slot `slot-2`; the read-only tips `read-tip-a41a0e109` and `read-tip-58fcfe614`; finished lanes' scratch dirs) | SLOT: the chair retires them at train EM-T3's terminal, after the kit holds what matters |
| REVIEW-P, the public-path review | SLOT sharpened: dispatched the moment run 17 exits (the preview server is free then) |
| the two conditional byte buy-backs (ODQ §934.19 addendum 2) | **CLOSED — not work.** They exist only as the cure for a veto of the ceiling re-mints; a veto, if it comes, is a new order and is sequenced that day |
| a shared `tests/helpers/distGate.js` to unify 29 re-spellings of one gate (TOOL-A) | **CLOSED — not work:** TOOL-2's one setup guard cures the class without touching the 29 files |
| the 39 TERMINAL packets whose Markdown tables disagree with their manifests (TOOL-1's estate run) | **CLOSED — history:** terminal packets are exempt by the arm's design; nothing is re-litigated |

"""

ODQ = """- **§934.56 OWNER'S LAW (__STAMP__): "there should never be any deferred work. If anything comes up emergent to put it in the sequence."** ADOPTED AS LAW ON THE SPOT. From now a finding, a follow-up, a lane's "noticed, not touched" or a recon's "could not measure" gets, in the same turn it surfaces, exactly one of three fates written into the charter: a SLOT (a train, a window, a parallel lane, or a named packet's pre-proof that must carry it), an OWNER'S DECISION POINT with its moment named, or CLOSED — not work, with the reason. No side list exists: the kit's `DEFERRALS-UNSEQUENCED.md` is retired to a pointer. APPLIED THE SAME TURN to everything that had surfaced today without a slot (the charter's newest section): EM-B1h (close the open `worldPulseFate` vocabulary before EM-B1a adds a ninth spelling) → train EM-T6; FIX-T1 (28 hand-built ruin replicas in tests) → a parallel lane after EM-B1e lands; the fourth institution vocabulary and the irreversible consequence of a decree-ruin → EM-B1a's pre-proof; the third recon's unmeasured cases (all six tiers, every ordered pair of edits, undo-then-re-edit) → EM-R7's corpus ratchet; EM-A1's missing manifest → its compile after EM-P2 v3; sibling copies of the walker's regex defect → CURE-A2 before run 17; the scratch estate's retirement → T3's terminal; REVIEW-P → the moment run 17 exits. CLOSED as not work, with reasons: the two conditional byte buy-backs (they exist only as the cure for a veto that has not come), the shared dist-gate helper (TOOL-2's guard cures the class), the 39 terminal packets' table drift (exempt by design). The chair's failure this law corrects: twice today it wrote "docketed" in a packet's answers and in a kit note without a charter slot.
"""

t = io.open(c, encoding="utf-8").read()
anchor = "## Pre-proof tasks (Opus, read-only, before each packet is READY)"
assert t.count(anchor) == 1
io.open(c, "w", encoding="utf-8").write(t.replace(anchor, CHARTER.replace("__STAMP__", stamp) + anchor))
o = io.open(f, encoding="utf-8").read().rstrip("\n")
io.open(f, "w", encoding="utf-8").write(o + "\n" + ODQ.replace("__STAMP__", stamp))
print("charter: the no-deferred-work law + thirteen fates; ODQ 934.56")
