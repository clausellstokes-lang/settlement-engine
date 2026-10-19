# D-ST-r2 — THE SITES, round-2 disposition (P3 round 2b)

Lane D-ST-r2 (Opus 5.5), chair a73343ed, 2026-10-18 08:00–08:29 EDT (times from `date`). Owned files: `docs/DESIGN_FP_ARCH_ST.md` (rewritten in place; it is a compiled draft) and this log, plus `cure/D-ST-r2-probe/`. No git, no test suite. The code of record is the detached master worktree at `81f1cd963`, read only; the probes import its modules read-only.

**Status: DONE.** 44 of 44 routed ids are disposed: 42 CURED, 0 REFUTED, 2 STOP. The four chair items in RULINGS-ROUND2b/D/E are also handled: 3 CURED, 1 NOTED. The volume grew from 589 lines (109,429 bytes) to 680 lines (170,086 bytes). It now carries 120 `[CURED 2026-10-18 (fp-final r2) — …]` brackets and 10 STOP marks, and §15 is the cure record. The pre-round copy is `D-ST-r2-probe/ST.before-r2.md` and the diff is `D-ST-r2-probe/volume.diff`. Two checks pass: `check-tables.out` (0 column mismatches, 0 raw pipes in table code spans) and `check-ids.out` (every id has a body bracket and a record row).

## Inputs
- `skeptic/ST-r2.md`: ST-r2-1..32 (2 B · 18 M · 12 m).
- `skeptic/SEAMS-r2.md`, routes to ST: 7, 9, 12, 18.
- `skeptic/HOST-r2.md`, routes to ST: 3, 7, 8, 9, 10, 11, 19, 20.
- `briefs/RULINGS-ROUND2b.md`, items for ST: ST-r2-1, ST-r2-4/5, ST-r2-7, MN's routed note, HOST-r2-1, HOST-r2-3, and PR filling ST's slot. RULINGS-ROUND2 D (Q1–Q4, STOP-ST-1/2) and E also apply.

## Measured first (each refutes or confirms a premise)
| # | Measurement | Result |
|---|---|---|
| M1 | `warSiegeVerdict.js :: resolveSiegeVerdict` run read-only on the skeptic's cell (`siegeMonotone.out` (1)) | CONFIRMED BY EXECUTION: on the spatial core a +18 keep RAISES pFall from 0.0759 to 0.0937 through `relief01`'s denominator, so ST-r2-4 holds |
| M2 | the two cures (a longer starvation clock; the keep kept out of `relief01`) on a replica of the landed formula, checked equal to the landed function at keep 0 (`siegeMonotone.out` (2)) | 2,000 grid cells, 0 where a bigger keep raises pFall; the aspatial core is monotone on the landed code |
| M3 | the no-roll sentinel (`siegeMonotone.out` (3)) | the HBF-86 pin, the `SIEGE_MAX_AGE` storm and a capitulation each answer `roll: 0`; a rolled fall answers `roll: 0.001` |
| M4 | `gateResult` multiplies rows; arithmetic on the volume's constants (`scaleAndLatch.out`) | the literal product flips signs (an unfunded keep ×0.12, a capable den ×0.78); deviation scaling gives ×0.97 and ×1.18 |
| M5 | `stepEmbattlement` | a calm record latches only `if (rawT > T.ENTER_THRESHOLD)`; the only untied kind that latches ALONE is the fortification; the ruin's feeder tops out at 0.14 |
| M6 | `buildCapacityLookup(snapshot, deployments)` | cached per id with no attacker argument, but it already holds the deployments ledger, so the holder rule can exclude a besieging holder |
| M7 | `martialReadiness.js :: buildThreatByCid` | membership sets only (`raidHot`), so a weighted term has no seam |
| M8 | `pestilence.js :: careCapacity` | care is strictly below `CARE_MAX_RELIEF` 0.6 by a cross-category product; the kernel is DORMANT off the marker |
| M9 | the sea: `isPort` · `STORM_SEASON_COST` · `seaRoads.js` (S3 at LEVEL ≥ 0.35; `seaRoadsEnabled` absent from every preset) · `navalLayer.js :: activeBlockadeTargets` | all LANDED; "W10/W11" is the wrong reference |
| M10 | `prosperityRank.js` | six labels; `Prosperous` 0.8 maps to `lavish` |
| M11 | `treasury.js` · the kernel's `advanceTreasury(...)` call | one upkeep law; the call passes no worldState |
| M12 | `STRESSOR_COUNTERFORCES.criminal_corridor` | no security institution in it; that sits on `infiltration` |
| M13 | `POSTURE_ACTOR_KINDS` | "THE CLOSED ACTOR SET" of posture-bearing deciders |
| M14 | host document HR:107, 491, 499, 529, 534, 601, 644–647, 689–690, 694, 725, 894, 900 | quoted in the cures |
| M15 | tokens (`tokens-r2.out`) | all 13 new tokens are free. `concealed` is LANDED (16 src files, a GM-concealed siege visibility, i.e. an audience word) and was refused |

## The record (BLOCKING and MAJOR in full; minors in volume §15)
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| ST-r2-1 | B | CURED (ROUND2b) | ST6 · §2.4 · §6.1(3) · OD-ST-5 | The DM's band is a CEILING (`min`). Coin rides the W-COIN rows on one leaf-first car (CH OD-CH-10's car). The kernel line is quoted. |
| ST-r2-2 / HOST-r2-3 | B | CURED (ROUND2b J385) | §2.2 · §3.3 · §7.4 | `gateKeeperOf` is the territory holder. The crossing's holder gets a toll share and the crossing's effect only. |
| ST-r2-3 | M | CURED | §0 · §3.3 · §3.5 · §5 · ST-3 | M9 |
| ST-r2-4 | M | CURED (ROUND2b), executed | ST10 · §4.1 · S19 | M1, M2 |
| ST-r2-5 | M | CURED, executed | ST11 · §4.2 · S20 | M3. The band is rewritten to `narrow_fail` before attrition reads it. |
| ST-r2-6 | M | CURED | §4.1 · S23 | M6. The holder rule uses support types, PL's suspension and the holder's own deployment. The car-0 pin has a fallback. |
| ST-r2-7 | M | CURED (ROUND2b) | §3.2 · OD-ST-8 | M4 |
| ST-r2-8 | M | CURED (its pin half refuted by ROUND2b; MN M50 wins) | ST8 · §3.4 | MN owns `presenceTerms`. ST registers a feeder and a suppressor and uses MN's names. |
| ST-r2-9 | M | CURED (stated: tippers and sustainers) | ST8 | M5 |
| ST-r2-10 | M | CURED | §4.3 · §8 · S21 | PS9's cap is spent by the approach fort. The siege ceiling is set per attacker. |
| ST-r2-11 | M | CURED | ST17 · §2.4 · §7.1 | `siteWitnesses` is an INPUT to PR's `witnessedCrossing` (PR §6.5 already reads it). No `partyIds` write. |
| ST-r2-12 | M | CURED | §3.3 · §3.5 · §7.1 | M8. On the front the hospice is a care factor; in the stressor layer it is a term in the outbreak's counterforce slot. |
| ST-r2-13 | M | CURED | ST9 · §3.3 | M7 |
| ST-r2-14 | M | ⛔ STOP | ST18 · §7.3 · OD-ST-27 | below |
| ST-r2-15 | M | CURED | §2.4 `believedDenOf` · §6.1(6) · §6.6 | Law One. The seeding registration with IN is PLAUSIBLE until ST-2's car-0. |
| ST-r2-16 | M | CURED | `wantSince` · ST13 | the dwell is declared; an "act" means a dated event |
| ST-r2-17 | M | CURED | §6.1 · §8 · S12 | one hearing per arrival; a reclaim's clearing comes the next week |
| ST-r2-18 | M | CURED | §6.4 `reclaimScore` | the tilt of requirement 24(b) |
| ST-r2-19 | M | CURED | §7.2 · S8 | one PT door; ST's writer is idempotent per (site, word, tick), so PT's current text still yields one event |
| ST-r2-20 | M | CURED | §14 | deeds only |
| SEAMS-r2-7 | M | CURED (ST's side) | §3.4 | three feeders registered; the column's class is MN's and the chair's (open question 4) |
| SEAMS-r2-9 | M | CURED (ST's side) | ST10 · §4.1 · §3.3 · OD-ST-39 | one body of men; the keep is defensibility (open question 3) |
| SEAMS-r2-12 | M | CURED (ROUND2b) | ST6 · §2.4 | `settlementFundingBand` exported |
| HOST-r2-7 | M | CURED | ST2 · ST20 · ST-4 · §7.2 · §11 | DR-V14-1 · H13 · H9; position from the placement; access through the hard-deny |
| HOST-r2-8 | M | CURED | `mapSiteRef` · `SITE_KIND` · §6.5 | ENC-MS-06 |
| HOST-r2-9 | M | CURED (ST's side) | `garrisonBandOf` · ST1 | the seat's force band is a slot |
| HOST-r2-10 | M | CURED (ST's side) | §6.2 · ST-4 | H28's adoption command is ST's adopt arm |
| HOST-r2-11 | M | ⛔ STOP | §6.3 TRADED | below |
| minors ST-r2-21..32, SEAMS-r2-18, HOST-r2-19, HOST-r2-20 | m | all CURED | §15 | — |
| ROUND2b MN note · PR slot · D/E | — | CURED | ST8 · §3.3 caps · §2.2 · §7.4 | — |
| ROUND2b HOST-r2-1 | — | NOTED | §3.3 crossing | ST never said "closed pass"; the discount now composes after `seasonalPathCost` |

## ⛔ STOPS FOR THE CHAIR
**⛔ STOP ST-r2-14.** The ruling in L-ST item 20(b) ("the actor convention gains `site`"), and the fold's §3.3.12 ↳ r2 row that applied it, are refuted by `strategicPosture.js :: POSTURE_ACTOR_KINDS`. That set is the closed set of posture-bearing DECIDERS: "a posture read that quietly treats a temple as a settlement would be wrong in a way no gate could see". ST4 itself says "A site has no mind". The WHERE is already carried by `ENGAGEMENT_WHERE_KINDS`' `site`, and the subject dial already carries the target.
- **Proposed re-ruling:** `site` is a WHERE kind and a subject, never an actor kind. SP-4a's set gains no `site`. The fold row is re-bracketed at P4. A band or a cult on a card rides the `subject` dial as its holder ref until WC-12 mints a band actor.
- **Until the chair rules:** the passages stand as compiled, marked.

**⛔ STOP HOST-r2-11.** L-ST item 11(b) says the land moves "through the host's own territory mechanism (… a re-canonize — J388 …)". Three host-document lines refute it. The host's seat territory is a cost partition: "every land cell goes to the seat it is cheapest to reach, with no politics" (HR:491). "Two partitions, never one" (HR:499). J388 covers "only the added seats" (HR:900).
- **Proposed re-ruling:** a conveyance moves the SITE's holder, with its attachment re-derived by distance from the site, plus any polity act it carries where PL lights. The host partition never moves. The map's sway may draw the new holding from H13.
- **The owner's word:** his "traded … along with their surroudnig terriotry" is honoured as the site together with the holding it commands, never as cells of the partition.
- **Until the chair rules:** the row stands, marked.

## REFINED this round (each marked in the volume)
- The shrine's faith lean is +0.04 × S, ×2.5 inside a fracture, which reaches but never passes its own ±0.10 cap. The compile's +0.10 base with a ×2.5 multiplier broke that cap.
- §6.6 names PL's request door, `requestFealtyRow`, with the `den_unanswered:` prefix.
- A `siteTakenContest` HBF row is minted, because `site_taken` absorbs the same-week sortie.
- A held harbour works is a `witnessedCrossing` input for sea arrivals. This follows from ROUND2b PS-r2-2's "harbour works its keep".
- At relighting, `wantSince` is dropped, so no dark week counts toward want.

## Routes (the owners act; nothing here was edited outside ST)
- **FOLD (P4).**
  - §3.3.12 ↳ r2: pending the ST-r2-14 STOP.
  - The W-COIN inbox row's "DM-SET" is superseded by ROUND2b, so the effective band is the `min`.
  - §3.1.29 narrows to SITE garrisons, and the seat force band becomes a slot (HOST-r2-9).
  - §6: H28 is split, and M-SITE-A/F become ST's milestones (HOST-r2-10/12).
  - Map INBOX: re-emit the site at a town's death, plus the join key (HOST-r2-8).
  - §7 shape list: OD-ST-33 and OD-ST-34.
  - §5: register `keptSecret · kept_secret · made_known` against the map's three secrecy states, and add the round-2 tokens.
- **PT.** §4's sites bracket: the deed's door makes the act, and `revealed` becomes `made_known`. Item (3)'s wording waits on the STOP.
- **PR.** In §10.5, "riders count from the fort's funded garrison" becomes "from the holder's one pool, the fort's stretches first". §3.1 cites `settlementFundingBand`.
- **PS.** List the approach fort's hold among PS9's holds. The sea arm cites ST's harbour input.
- **IN.** Register ST's site news on the seeding road; this is the witness plane's slot.
- **EC.** The crossing's toll share rides EC-6's toll arm.

## Open questions for the chair
1. The ST-r2-14 STOP.
2. The HOST-r2-11 STOP.
3. SEAMS-r2-9: ST chose "the keep is defensibility, never men". The seams skeptic's alternative is a stationed share of `facets.manpower`, drawn like `patrolDraw`. That would be a same-seed shift on every war that involves a keep.
4. SEAMS-r2-7: is an enemy column suppressible? ST recommends it is not, so P14 holds. MN owns the sentence.
5. Observation, not a finding: the `ruin` kind's quality is fixed at `ruined`. Its untied feeder therefore never exceeds 0.14, even for a formidable band at hand. Is this the intended "rumour", or should a DM's dungeon at the gate weigh more?

CONFIRMED vs PLAUSIBLE: M1–M3 are CONFIRMED by execution. M4–M15 and every quoted cite are CONFIRMED by reading at `81f1cd963` or in the host document. Four things are PLAUSIBLE, each named at its car-0: the holder-rule pin, the W-COIN car's carriage, IN's seeding registration, and the graph-proxy density.
