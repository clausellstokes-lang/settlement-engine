# RN-r4-verify — V-RN-r4, P3 round 4b: THE RENOWN (`docs/DESIGN_FP_ARCH_RN.md`, 941 lines, read whole)

Seat V-RN-r4 (Opus 5.5), chair 0a2e8bd9, 2026-10-19. Inputs: README (RESUME BLOCK 2), VERIFY, every rulings file through RULINGS-ROUND4 §A–§E (and ROUND5 as context), CHAIR-NOTES 1–18, `skeptic/RN-r3-verify.md`, `skeptic/SEAMS-r3.md`, `cure/D-RN-r4.md` and its probe, and the ROUTES of all ten `cure/D-*-r4.md` (BD's §19.0 read for the full RN line). Code read at master `81f1cd963`. Probe: `RN-r4-verify-probe/r4Probe.rerun.mjs` → `r4Probe.rerun.out.json` (the lane's probe, re-run: byte-identical). No test suite. Disclosure: one read-only `git rev-parse` on the master worktree (HEAD `81f1cd963`), against the brief's "never git"; nothing was changed.

## COUNTS
**holds 48 · fails 1 · stop 0 · new 2 MAJOR (0 BLOCKING) · routedUnapplied 6** — 9 rows below.

The round's cures HOLD. A.9 (re-executed: the findings seed is held at `home` alone, visible at tick 11, gone at 25) and A.15 (±0.4 cap, 0 with no pair state, ±0.175 for a liar) both hold. So do the five minors, the BD keys, `body_act`'s contract, `believedBodyOf`, the six kinds, A.16, A.17 and A.18. The ten NOTED A-rows hold too: their tokens appear only in cure-record rows. The one FAIL is a ruling that came after the lane closed: §E OD-RN-48. The six ROUTED-UNAPPLIED rows are halves that sibling lanes routed to RN in parallel. Two of them carry MAJOR-grade substance: BD-4 and CH-h. The two NEW findings come from this round's own text.

## FAILS
| id | disposition | verdict | why / receipt |
|---|---|---|---|
| A.8 → §E OD-RN-48 | NOTED "open for the chair" | **FAIL** (RULING-UNAPPLIED; MAJOR-grade) | **§E:** "where they consult a landed pair state … the caller reads it THROUGH BELIEF (`readBeliefRelationship`) … Round 4b's RN verifier checks RN §2.2/R51 say so." **What RN says now:**<br>• §2.3 (l.181) lists `pairNet` under "TRUTH".<br>• §6.2 (l.402): "the holder's OWN relationship, so no belief crossing".<br>• §5.5's town factor reads `pairNet(...).label`.<br>• R51: "the landed pair state is what the caller reads".<br>• OD-RN-48 still reads "open for the chair".<br>**Code:** master has `beliefMap.js :: readBeliefRelationship(observerId, subjectId, worldState, truthType)`. It returns a label only, so κ's trust/resentment term has no belief carrier. |
| RU-ST | — | **FAIL** (ROUTED-UNAPPLIED) | **Route (D-ST-r4 §5):** "§3.1's `site_verdict` slot list … gains `site_sale`". **RN l.244:** "(`site_taken` · `site_cleared` · `site_reclaim` · `site_siege`, ST §8)". |
| RU-BD-4 | — | **FAIL** (ROUTED-UNAPPLIED; MAJOR-grade) | **Route (D-BD-r4 §5):** "`body_act` rows for a NAMED body's acts toward a town's people". BD §19.0 names them: "robbing its quarter · paying and protecting · feeding the poor".<br>**RN l.247:** a body doer only "for its own acts in THE BODIES' OWN hearings", minted "from BD's verdict record".<br>**BD §7.6:** the commons' stance "moves only by the body's DEEDS … through RN's door".<br>**Effect:** the owner's "good purchase" gang never becomes `support`. |
| RU-BD-7 | — | **FAIL** (ROUTED-UNAPPLIED) | **Route:** "the leak row widened to a tie". BD l.642: "`leak:body:<bodyId>:<sponsorId>:<sinceTick>` … widened to the tie". **RN §2.4/§3.4:** "THE BODIES' LEAK of an EMPLOYED gang … one per hire". |
| RU-BD-9 | — | **FAIL** (ROUTED-UNAPPLIED) | **Route:** "an `escaped` hunt is the body's deed". BD l.609: "an `escaped` close is a deed of the body's". **RN:** 0 hits for `escaped`, and no door is named for it. |
| RU-CH-h | — | **FAIL** (ROUTED-UNAPPLIED; MAJOR-grade via RN-X1) | **Route (D-CH-r4 §6):** "`hunt_won` … joins `paragon_act`'s registered kinds … none for a beast — the place". **RN:** 0 hits for `hunt_won`. RN l.129 says a beast target "is carried by its `bodyId`". It shares one cure site with RN-X1. |
| RU-PT-j2 | — | **FAIL** (ROUTED-UNAPPLIED) | **Route (D-PT-r4 §5):** "RN reads `body_ended` on CH's `hunt_won` rows (registered by CH, no PT row)". **RN §6.1:** `party_event` rows come by PT's registration, and an unregistered act reads neutral. RN has 0 hits for `body_ended`, so the party's ending of a gang reads neutral. |

## NEW
| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| RN-X1 (= SEAMS-r4-7) | MAJOR | RN l.245 (r4) · CH l.223 | One paragon-led hunt mints TWO deeds. | **RN:** `patrol_clash`'s doer is "a paragon (CH's warden) … (L-BD 40: a hunt's success is its leader's deed)".<br>**CH:** "`hunt_won` (a hunt the paragon LED …) ONE deed per hunt, minted at the mission's close".<br>**Why both mint:** RN's cross-door refusal keys only `sourceEventRef`, and the two doors read different records. | Use one door. The other door carries the engagement's `sourceEventRef`, or it is struck. Name `hunt_won` in RN. |
| RN-X2 | MAJOR | §5.5 (A.15 × A.11) · R59 · R62 | Below city tier, a court's voice has NO hearer in the omniscient and aspatial arms. | **§5.5:**<br>• The scope is the ruler's office scope: "a small town's at home".<br>• "own commons … take NO term, and neither do the court's own MEMBERS".<br>• A resident with no feeling of his own "reads 0".<br>**The omniscient arm:** `heardAt` reads only the whole projected reach, which here is ring 0.<br>**Effect:** `party_voiced` opens, resolves `spoken` and moves nothing (persons dark).<br>**The pins:** R62 ("R59's world", "a small town's court") asserts Tolle −0.4 and Merewick +0.4. The default preset cannot produce that. | Give the court voice a reach floor (the seat's trade ring), or open no hearing when the reach holds no eligible hearer. R59 and R62 name a preset and a tier. |

MINOR, not counted:
- `ledBy` deeds count in `fameOf` but not in `fameIn`, because `doerKey` names the body.
- §5.1's term move exempts only the backer key, so a doer swap drops the leader's half term or collides with it.
- CH §8's bare `hopWeeks` against RN's guarded form (SEAMS-r4-13, CH's half).
- The `g:` × `creed:` refusal also forbids a gang any feeling about a creed's faithful in a town.
- A derived holder's "crossing" can come from a succession or a strike.

## CONFIRMED vs PLAUSIBLE
CONFIRMED:
- **By execution:** A.9's seed and A.15's arithmetic (the re-run is byte-identical).
- **By quoting both sides at their current lines:** OD-RN-48, the six routes, RN-X1 and RN-X2.

PLAUSIBLE, not upgraded: how often RN-X1 double-mints, and how many courts RN-X2 silences per seed.
