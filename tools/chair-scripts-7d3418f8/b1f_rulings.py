# -*- coding: utf-8 -*-
"""Charter rows for EM-B1f and EM-B3c, design §15's adder corrected, ODQ §934.47 addendum 17."""
import sys

d, c, f, stamp = sys.argv[1:5]

s = open(d, encoding="utf-8").read()
old = "added to the typedef by EM-B1a with every enumerating consumer named (§934.47 addendum 3)"
assert s.count(old) == 1, s.count(old)
s = s.replace(old, "added to the typedef by **EM-B1d** with every enumerating consumer named (§934.47 addenda 3, 5 and 6 — the vocabulary widening is its own packet and lands BEFORE EM-B1a; status-based ABSENCE at the one participation chokepoint is EM-B1f, §934.47 addendum 17)")
open(d, "w", encoding="utf-8").write(s)

t = open(c, encoding="utf-8").read()
anchor = "## Pre-proof tasks (Opus, read-only, before each packet is READY)"
assert t.count(anchor) == 1
add = """## Amendments of __STAMP__ — EM-B1f and EM-B3c chartered; EM-B1d's matcher (ODQ §934.47 addendum 17)

| id | outcome (one behaviour family) | CREATE / MODIFY / TEST | required symbols (existing) | collision |
|---|---|---|---|---|
| **EM-B1f** status-based absence at THE ONE PARTICIPATION CHOKEPOINT (NEW; design §15 — "a jailed or exiled holder cannot keep a seat") | `isOffStage` (`src/domain/roads/state.js`, the estate's one participation chokepoint — today `isInStasis` OR a roads hostage; it never reads `.status`) gains ONE arm: an NPC whose `status` is `jailed` or `exiled` is off-stage for every participation read, so the three consumers that pair `=== 'dead'` with it (`warSeatBooks.js` — a SEAT read — `npcLadderState.js`, `npcLadderKernel.js`) need no edit. MEASUREMENT OWED at pre-proof: does any generated or pulse-written NPC carry `exiled` today (it is already in `NpcStatus`), and does the arm move a pulse golden, the espionage fence or a preset witness; whether `missing`/`retired`/`removed` join the arm is ruled from that measurement, never assumed | M `src/domain/roads/state.js`; T the chokepoint's own suite + a seat-read arm (a jailed holder is not returned by `rosterNpcById`) | `isOffStage`, `isInStasis`, `rosterNpcById` | after EM-B1d (it needs the union); ⛔ BLOCKS EM-B1a's promotion — B1a's `set-npc-status` is what makes `jailed` producible, and a producible `jailed` without this arm is a jailed mayor who still governs |
| **EM-B3c** the SQL-side subset arm (NEW; from EM-B3a's pre-proof) | a security walker: the NET-CURRENT gallery scanner (`_gallery_world_snapshot_is_safe`, latest-wins across migrations) must carry a covering alternative for every client denylist token — the direction `tests/security/snapshotDenylistDrift.test.js` does not assert — so a NEW migration re-creating the scanner without the editor's alternatives reds at once (a new migration file is invisible to a path-based substrate check) | T `tests/security/` (one walker; its mutation-coverage row if the directory is an enforcer dir — measured at pre-proof) | the drift test's own extractors | none; any time after EM-B3a lands |

- **EM-B1d's union-totality walker matches by token membership over the DISCRIMINATING subset of the union** — `{dead, exiled, retired}`, the members measured to belong to no other declared vocabulary (`'active'` 74 files / 11 foreign vocabularies, `'removed'` 30 / 8, `'missing'` 5 / 3, `'jailed'` 3 / 3 are HOMONYMS and are excluded from the TRIGGER, never from the totality demand) — because a consumer that tests only `'active'` is total by construction and the class the walker exists for is the ENUMERATION OF NON-ACTIVE MEMBERS. It flags eight files (the five known consumers and three the compile missed), needs zero exemptions, and states its CANNOT-CATCH (a consumer that enumerates only homonym members; none exists at the tip).

"""
open(c, "w", encoding="utf-8").write(t.replace(anchor, add.replace("__STAMP__", stamp) + anchor))

o = open(f, encoding="utf-8").read().rstrip("\n")
o += """
- **§934.47 addendum 17 — EM-B1d's MATCHER, RULED TWICE, AND THE JAILED MAYOR (__STAMP__; the successor chair; vetoable).** The chair first ruled the union-totality walker to match by token membership over the WHOLE `NpcStatus` union with foreign unions declared by name — WITHOUT the homonym count. The pre-proof lane applied it as written and measured the cost: 110 files flagged, sixty to a hundred exemption rows, because `'active'` (74 files, 11 foreign vocabularies) and `'removed'` (30, 8) belong to the institution and stressor vocabularies too. THE RULING IS WITHDRAWN AS PRICED WRONG, and replaced (R6′): the trigger is the DISCRIMINATING subset `{dead, exiled, retired}` (measured: no foreign vocabulary holds them; `'missing'` and `'jailed'` are homonyms too), since a consumer that tests only `'active'` is total by construction and the class the walker guards is the enumeration of non-active members; the totality demand still names every non-active member, `jailed` included. Result: eight files flagged, ZERO exemptions, one leaf of ~110 effective lines — and THREE `NpcStatus` CONSUMERS THE COMPILE HAD MISSED, all pairing `=== 'dead'` with `isOffStage`, the estate's one participation chokepoint. One of them is the SEAT read (`warSeatBooks.js`): design §15 rules that a jailed or exiled holder cannot keep a seat, and `isOffStage` never reads `.status`, so a jailed holder would still be returned — inert today (nothing writes `jailed`), live the day EM-B1a's `set-npc-status` lands. RULED (R9): the arm is NEW work at the chokepoint, **EM-B1f**, after EM-B1d and BLOCKING EM-B1a's promotion; the three consumers take roster rows with the reasoned omission naming the idiom and the owner. Also chartered from EM-B3a's pre-proof: **EM-B3c**, the SQL-side subset arm. Design §15's sentence crediting EM-B1a with adding `jailed` is corrected to EM-B1d. LESSON, recorded against the chair: a matcher ruling is a measurement question — ask for the count before ruling the rule.
"""
open(f, "w", encoding="utf-8").write(o.replace("__STAMP__", stamp))
print("design §15 corrected; charter amendments (EM-B1f, EM-B3c, the matcher); ODQ addendum 17")
