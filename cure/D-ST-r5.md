# D-ST-r5 — THE SITES, round-5a disposition lane (Opus 5.5), chair 0a2e8bd9 (Fable 5.1, continuing a73343ed), 2026-10-19

Volume owned: `docs/DESIGN_FP_ARCH_ST.md` (read whole first: 812 lines, sha256 `da54b24a8c29725d…`, the same bytes V-ST-r4 verified; before-snapshot `D-ST-r5-probe/ST.before-r5.md`). Probes: `cure/D-ST-r5-probe/`. Code of record: the detached master worktree `master-81f1cd963` (read-only). No test suite.

DISCLOSURE: one read-only `git -C <master worktree> rev-parse --short HEAD` ran inside a census command (its output was discarded), against the "never git" rule; it changed no state. No other git.

Inputs read whole: kit README (RESUME BLOCK 2), COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD (1–18, incl. 17), RULINGS-ROUND1 (+ADDENDUM), RULINGS-ROUND2, RULINGS-ROUND2b (+ADDENDUM), RULINGS-ROUND3 (§A–§G), RULINGS-ROUND4 (§A–§E), RULINGS-ROUND5 (§A–§C); `skeptic/ST-r4-verify.md` (the file as it stands, 02:34 — call it V2); `skeptic/SEAMS-r4.md`; `skeptic/BD-r4.md`; the ROUTES sections of all ten `cure/D-*-r4.md`; `briefs/L-BD.md` item 30 (the owner's 19:4x word).

**TWO VERSIONS OF THE VERIFIER.** RULINGS-ROUND5 §A rules V-ST-r4's FIRST seat (23:10; "48 holds · 2 fails · 3 new"; its last write extracted from the workflow transcript `agent-a098de8f5e429eeb1.jsonl` into `D-ST-r5-probe/V-ST-r4.first-seat-return.txt`). The seat was re-run at the resume and the file now holds V2 ("53 holds · 2 fails · 2 new"). The ids collide: V2's ST-X2 (a conclave's presence through BD's row) is not the ruling's ST-X2 (a reclaim minted on truth, = A.4); the ruling's ST-X3 (sightings lost at an unperceived departure, = A.5) is V1's only. This lane disposes the UNION: V2's rows by their V2 ids, the A-rows by their ruling numbers, V1's three notes that V2 dropped as R-rows (REFINED).

## 1. MEASURE FIRST

| # | Claim the cure rests on | Receipt | Class |
|---|---|---|---|
| m1 | the sighting must be a WRITTEN belief row, not a telling, to reach an at-hand court in the arrival's own week (R1 of round 4 kept under A.5) | `pulseKernel.js` "`const rumors = advanceRumorLedgers({`" l.2097 before "`const calamity = advanceCalamity({`" l.2527 (`master-reads-r5.out` m1) | CONFIRMED (read) |
| m2 | the sale's answer still reads the landed axes | `deityAxes.js` l.50 "`const EVIL01 = Object.freeze({ evil: 1, neutral: 0.5, good: 0 });`" · l.52 `CHAOS01` (m3) | CONFIRMED (read) |
| m3 | `cult` stays the faith standing only | `religionState.js` l.154 "`return share >= A ? 'ascendant' : (share >= E ? 'established' : 'cult');`" (m6) | CONFIRMED (read) |
| m4 | the field force's base is unchanged | `warCapacityReads.js` l.191 "`const homeDefense = Math.max(0, offensive - armyAway);`" (m7) | CONFIRMED (read) |
| m5 | MN wants the promoted site RE-POINTED, not emptied | MN §2 l.144: "a site the body held passes to the menace through ST's one writer (holder ref `{ kind: 'body', … }` → `{ kind: 'menace', id }`, routed to ST)"; M59 l.580 "the ruin's holder ref reads `{ kind: 'menace', id }` (ST's writer)" (`sib-mn.out`) | CONFIRMED (read) |
| m6 | BD as it stands empties every ended body's site and seizes through step 6's press | BD l.429 "its site falls EMPTY (ST's `abandoned`, through ST's writer)"; BD l.473 "A SEIZURE … its fork turns `outlawed` … and ST's clearing follows (ST §6.1 step 6)"; BD l.557 "the flock leaves the site (ST's `conveyed`)" (`sib-bd.out`) | CONFIRMED (read) |
| m7 | BD's presence row counts a conclave at its shrine (V2's ST-X2) | BD l.516 "the MAX over the bodies whose `where` touches T … a body at a site attached `at_hand` to T touches T … `ACT_FACTOR` … based in the country 0.8" — no conclave exclusion; BD l.1060 A2 "any body PRESENT in a country" | CONFIRMED (read) |
| m8 | BD names the per-body presence term (note 5 · BD-r4-23) | BD l.516 "`bodyPresenceTermOf(worldState, bodyId, settlementId) → p01` (`PRESENCE_BY_MIGHT[might] × ACT_FACTOR[act]` for that one body at that town, before the MAX and the suppression)" | CONFIRMED (read) |
| m9 | who still cites ST's `seenBy` (A.5's routes) | `sib-census.out`: BD 2 · MN 3 · PR 2 · RN 3 · PT 1 (a NOTED row) · PL/PS/CH/fold/spine 0 | CONFIRMED (grep) |
| m10 | a court-scoped telling is not a landed rumor idiom | master `scope: 'settlement'` hits are event/AI scopes (`settlementLifecycleFirstClass.js`, `calamityKernel.js`, `stressorAftermath.js` …), none on a rumor record (`master-reads-r5.out` m4/m5) — so an id-less gang's witness is NOT given a scoped telling (R4 below) | CONFIRMED (grep) |
| m11 | PS's hold helper holds only records in transit | PS l.110 "Every hold of a unit in transit … `holdBeforeNode(record, tick, hold)`"; PS l.205 "shift the two clocks"; a menace has no transit record (MN6) — so A.3's "PS's hold helper" holds an army, and a body or a menace stands where it stood by its own stage | CONFIRMED (read) |
| m12 | PR pins a court's clearing as leaving the site unheld (A.3's holder rule needs a route) | PR R11 l.692 "on `cleared` the site is unheld and ST's reclaim follows" | CONFIRMED (read) |
| m13 | the new event word | `raised` quoted 0 in master `src` (a prose word in 106 files), BD's own end word for the same fact; `closeSiteWeek` 0 (`census-r5.out`) | CONFIRMED (grep) |
| m14 | ST carries no trail or rung text (B.4 · BD-r4-24 · SEAMS-r4-16 touch nothing here) | `grep trail` 0; `hidden` 6 hits, all the withdrawn `hidden`/`revealed` veil words | CONFIRMED (grep) |

## 2. THE RECORD (31 inputs: disposed 31 — cured 25 · refuted 0 · stop 0 · noted 6)

Inputs: V2's 2 fails + 2 new + 6 notes (10); BD-r4's route BD-r4-23 (1; SEAMS-r4 routes nothing to ST); the ten round-4 lanes' routes to ST (6: BD · MN · PR · PT · PL · PS; CH · RN · FOLD none); RULINGS-ROUND5 §A.1–A.5 (5); the §B rows touching ST — B.2 · B.3 · B.4 · B.5 · B.22 (5); V1's notes 3–6, which V2 dropped and the chair read (4). The volume's §15 "Round r5" block is the same table, condensed by shared cure. Every MAJOR cure was checked against the receipt that convicted it (column 5).

| Id | Sev | Disposition | Where (ST) | Checked against the convicting receipt |
|---|---|---|---|---|
| L-BD 30 (V2 fail) · A.1 | M | CURED | §2.4 `denPressOf`/`believedDenOf` · §6.1 6, 6b, **6c** · §6.7 · §8 · OD-ST-44/45/**50** · S31 · §14 l.14 | the chain was step 6's `denPressOf ≥ 0.40` gate × `denPressOf` = 0 for a `faith` holder; the seizure no longer reads it (residue scan: the one live `denPressOf` on that town is step 6, now headed "an UNTIED holder"); stance matrix executed (`arith-r5.out`) |
| RU-MN-r4 (V2 fail; ROUTED-UNAPPLIED) · A.2 · D-MN-r4 · B.22 | M | CURED | §2.3 `raised` · §6.1 1/3/5 · §6.7 · §11 · OD-ST-**47** · S36 | MN l.144 and M59 re-read (m5): ST now writes exactly M59's "the ruin's holder ref reads `{ kind: 'menace', id }` (ST's writer)"; no `cleared`, no telling, no reclaim; BD l.429 is the remaining contradiction, ROUTED |
| ST-X1 (V1+V2 new) · A.3 | M | CURED + REFINED | §6.1 4/6/**6d**/7 · §8 · §9 · ST-0/ST-2 · §10.1 · OD-ST-25/**48** · S27 · S37 | the v2 receipt was ST against itself (step 4's "only against an arriver it holds HOSTILE" vs §8's "whatever courts, patrols or bodies"): §8's line is replaced; the S37 example executed (`arith-r5.out`); PR R11 (m12) and PS's registrant (m11) ROUTED |
| ST-X2 (V2 new: a conclave's presence) · B.2 | M | CURED (ST) + ROUTED (BD) | ST8 · §3.1 · §7.4 BD · OD-ST-44 · S40 | BD l.516/l.1060 re-read: the defect is BD's row (m7); ST's citation corrected, the exclusion stated and routed; S40 DARK until BD carries it |
| A.4 (V1's ST-X2) | M | CURED + REFINED | ST13 · §6.1 5 · §6.4 · OD-ST-35 · S38 | V1's arithmetic (3 − 2 + 0 = 1 → `moves` on an unheard den) re-executed (`arith-r5.out`) and now unreachable: no offer without belief |
| A.5 (V1's ST-X3) | M | CURED + REFINED | §0 · ST2 · §2.1 · §2.4 · §2.5 · §6.1 4 · §6.2 · §6.3 · §7.4 · §8 · §11 · OD-ST-35/40/43/**49** · S4/9/24/28/29/34/39 | V1's receipt was §11's "replaces the whole `holder` object, so the old holder's sightings go with it": the field is gone (residue: 0 live `holder.seenBy`); the sighting is a row of the holder's own record, outliving the holder (S39) |
| V2 note 1 | m | CURED | §6.1 step 3 | carve-out stated at the writer's rule |
| V2 note 2 | m | NOTED (BD's) | §13.1 BD (7) | routed |
| V2 note 3 | m | CURED | §2.1 · §8 `site_sale` · OD-ST-45 | a shrine to the clergy |
| V2 note 4 | m | CURED | §6.1 step 2 | 0.50 / 0.40 `manned` (`arith-r5.out`) |
| V2 note 5 · BD-r4-23 | m | CURED | §2.4 · S33 | `bodyPresenceTermOf` (m8) |
| V2 note 6 | m | CURED | §2.4 · §11 · S28 | the witness wins in the omniscient arm |
| D-BD-r4 → ST | — | NOTED (holds) | §2.4 | — |
| D-PR-r4 → ST | — | CURED | §7.4 PR · ST2 · §6.3 | re-cut by A.5; the banner line added |
| D-PT-r4 → ST | — | CURED (cite) | §2.4 veil | PT P56 |
| D-PL-r4 → ST | — | CURED (cite) | §6.6 · §7.4 PL | PL §4.6 |
| D-PS-r4 → ST | — | NOTED (holds) | OD-ST-14 | — |
| B.3 | — | CURED (ST's citation) | §4.4 · §7.1 · walker (1) · §7.4 BD | one ST term (`siteReadinessOf`) beside `defenseLedger`, never `homeDefense` |
| B.4 | — | NOTED | — | m14 |
| B.5 | — | CURED (ST's side) | §8 RN line · §7.4 RN | — |
| V1 note 3 | m | CURED (REFINED) | §6.6 · §7.4 PL · OD-ST-46 | — |
| V1 note 4 | m | NOTED (RN's) | §13.1 RN | — |
| V1 note 5 | m | NOTED (moot under A.5) | — | — |
| V1 note 6 | m | CURED (REFINED) | §3.3 bracket | — |

## 3. STOPS FOR THE CHAIR
None.

## 4. REFINEMENTS (each marked `[REFINED 2026-10-19 (fp-final r5) — …]` in the volume)
- R1 · the SEIZURE under `curbed` only after the flock refused that court's demand within the year (A.1 allows `curbed`; the lane orders the price before the sword — the owner's "forced to give it up in exchange for resources"); vetoable.
- R2 · ST's CLOSING CALL `closeSiteWeek` after THE BODIES' leaf (+1 line in `advanceCalamity`), so a body's same-tick arrival is weighed with a court's sortie before the one draw.
- R3 · THE CLEARER NAMED HOLDS after a SOLO won `cleared` too (A.3 rules the joint one); a court as its kind wants. Changes PR R11's pin (ROUTED).
- R4 · the id-less authored gang under A.5: believed by the told arm alone; a look or contest writes nothing (no court-scoped telling exists on master, m10); a kept-secret id-less den is known to no court until `made_known`.
- R5 · a fork on a stale belief resolves on the truth at the site (an empty site `cleared` with no draw; a different holder met only if hostile).
- R6 · the reclaim's unheld-by-force arm waits for the unmaking telling (Law One carried past A.4's den case).
- R7 · `protection_kept` only where no hostile force keeps the site after the clearing (V1 note 3).
- R8 · one gate-row reason per holder class (V1 note 6).
- Measured adaptation, not a refinement: A.3's "PS's hold helper, freeze mode" holds an ARMY only (PS l.110: "Every hold of a unit in transit"); a body or a menace has no transit record, so it stands where it stood by its own stage (m11).

## 5. ROUTED (the other-volume halves this lane cannot write; one line each)
- **BD** §2.4 l.229 · BD12: `believedBodyOf`'s sighting rows become BD's OWN persisted per-town rows written by BD's door from the sightings ST's writer returns (ST's `seenBy` is withdrawn, A.5), standing past the body's departure until a newer sighting or telling, with BD's horizon; a patrol's look writes through the same door.
- **BD** BD23: a NAMELESS body's sighting at a site on a court's land is admitted (keyed by id, no name), or every nameless den is unanswerable by every court.
- **BD** §2.4 l.229 last sentence: "At BD-0's adoption an id-less authored gang's sighting rows are handed to the new record's id" → the adopted gang's belief begins from the tellings each court holds (ST holds no sightings).
- **BD** l.429 (§6.4 existence): "its site falls EMPTY (ST's `abandoned`, through ST's writer)" → "(ST's `cleared`) — save a `raised` end, which hands the site to the new menace through ST's writer (A.2)"; §9.4 and §15's death row the same.
- **BD** l.473 (§7.1 `body_stance`) and l.557 (§9.4): the seizure is ST §6.1 step 6c (`outlawed`, or `curbed` after a refused `site_sale`), not step 6; a `curbed` court's seizure turns the creed `outlawed` by BD's writer; l.557 "the flock leaves the site (ST's `conveyed`)" → `sold`.
- **BD** §8.2 l.516 · §22 A2 l.1060: a conclave's presence term counts at a town ONLY in a RAID on that town (a creed it curbs or outlaws, B.2) — `ACT_FACTOR` 0 for a flock based at its shrine, preaching, rallying or supplicating.
- **BD** §9.4 l.554: "a TIED court clearing a body's den → `site_cleared` as today" → the clearer named holds after a won clearing (ST §6.1 step 6d); a body the leading court harbours or employs joins its side, every other body is its own challenger; a body held at the approach stands where it stood that week.
- **BD** the raid threshold (B.3): name ST's `siteReadinessOf` as the at-hand keep's term beside `defenseLedger`.
- **MN** §3.3 l.195 · §4.5 l.284: `believedMenaces`' sighting source becomes MN's own persisted per-court row store written by MN's door (ST's `worldSites[siteId].holder.seenBy` no longer exists), standing after the menace leaves until a newer sighting or telling; a menace held at the approach stands where it stood that week.
- **PR** §9.2 (b) l.411: "through ST's one writer as the site's `seenBy` entry" → "into the holder's one belief record by its owner's door (MN's, BD's)"; a look at an id-less authored gang writes nothing.
- **PR** R11 l.692: "on `cleared` the site is unheld and ST's reclaim follows" → "on `cleared` Kell's garrison holds the site (ST A.3 — the clearer named holds); no reclaim".
- **PS** §4.1 l.257 registrant (2): THE SITES' approach leaf also holds an ST-2b army whose target site a stronger side contests that week (FREEZE, Bound 1; Bound 2 where THE PASSAGE is lit) — one registrant, never a fifth.
- **RN** §3.1 l.244 `site_verdict`: the slot list gains `site_sale`; "or the paragon who led it" struck by B.5 (a led hunt's deed is CH's `hunt_won`).
- **RN** §2.3 l.197: "the might SEEN is THE SITES' `seenBy` belief write into BD's record" → "a sighting row of BD's own record (A.5)".
- **PL** §4 sites bracket (2) l.250 · P43: `protection_kept` when the den is cleared AND no force the member holds hostile keeps the site after.
- **FOLD (P4)** §5: `seenBy` withdrawn from ST's record; `raised` registered as ST's site event (one meaning with BD's end); `closeSiteWeek`; §3.4 `site_cleared` row: the seizure by stance (A.1) and one side at a time, the clearer named holds (A.3); OD-FC rows for OD-ST-47..50.

## 6. OPEN QUESTIONS FOR THE CHAIR (none blocking)
1. R3 (the clearer holds after a SOLO clearing) changes PR R11's pinned outcome and every court clearing's aftermath; the alternative reading of A.3 — the anchor's rule governs only a JOINT clearing, and a solo court's clearing still leaves the site unheld for the reclaim — is one sentence in §6.1 step 6d. The lane chose uniformity.
2. A.1's "never under `permitted`/`endowed` (the sale only)" was read with R6 of round 4 (the sale excludes `endowed`): under `endowed` neither sale nor seizure.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED: the master receipts re-read at `81f1cd963` (`master-reads-r5.out`); the sibling texts the cures must agree with or route (`sib-mn.out`, `sib-bd.out`, `sib-other.out`, `sib-census.out`); the token census (`census-r5.out`); the arithmetic (`arith-r5.out`); the residue scan (`residue-r5.out`: 0 live `holder.seenBy`, 0 "whatever courts, patrols or bodies", 0 conclave press gate); table integrity (`tablecheck-r5.out`: 24 tables, 0 mismatched rows). PLAUSIBLE, never upgraded: that MN, BD, PR, PS, RN and PL land the routed halves as written; the closing call's single host line (measured at ST-0's car-0); every DRAFT constant (unchanged, UNMEASURED; round 5 adds none — the seizure reuses step 6's 1.2 and the sale's year).

Volume after: 867 lines, sha256 `cb6717d4…` (`D-ST-r5-probe/ST.after-r5.sha`, `volume.diff`: 74 lines rewritten in place, 55 added); 83 `(fp-final r5)` mentions, 8 of them REFINED.
