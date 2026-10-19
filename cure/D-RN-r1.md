# D-RN-r1 — disposition lane, P3 round 1: THE RENOWN (`docs/DESIGN_FP_ARCH_RN.md`)

Seat: D-RN-r1 (Opus 5.5), chair a73343ed, 2026-10-18 01:07–~02:00 EDT. Code of record: the detached master worktree `master-81f1cd963` (read-only; `rg`/`sed`/`node` imports only). Probes: `cure/D-RN-r1-probe/` — `effectiveLines.mjs` + `effectiveLines.out.tsv` (eslint's own max-lines count), `lensProbe.mjs` + `lensProbe.out.json` (the cured two-reading formula on the owner's cases, and the party-credibility arithmetic on the LANDED `npcCredibility.js` imported read-only), `RN-before-r1.md` (the volume as it stood before this lane, for diffing). No git. No test suite. Edits were applied by an anchored script (each anchor matched exactly once; `scratchpad/drn/apply.py` + `stageA..G.py`); a table-integrity check over every new or changed row found 0 pipe mismatches.

**OUTCOME.** Disposed 45 of 45: CURED 44 (eleven are RN's half of a cross-volume cure), REFUTED 0, ⛔ STOP 1 (SEAMS-r1-6), NOTED 0. The chair's three round-1 re-rulings for RN (RN-r1-1, -2, -6) are executed, as are RULINGS-AFTER-COMPILE's RN items (RN-S1 → THE ONE PERSON STAGE; the deed ledger RN's; `party_pledge`; PT's `proof` words; slots and OD-RN-14 accepted) and L-FOLD's unplaced RN item (the `proof` words). The volume grew 98,985 → 159,168 bytes (578 → 714 lines); 99 `[CURED 2026-10-18 (fp-final r1) — …]` brackets, 2 `[REFINED 2026-10-18 (fp-final r1) — …]`, 1 `[STOP SEAMS-r1-6]`; §19 THE CURE RECORD (round r1) added.

## §1 FIRST ACT — what was measured before curing (all CONFIRMED at `81f1cd963`)

| # | Measurement | Receipt | Bears on |
|---|---|---|---|
| M1 | The landed pair state exists and is the engine's rivalry | `relationshipState.js :: RELATIONSHIP_DEFAULTS` (10 types; `rival` trust 0.24 / resentment 0.52; `hostile` 0.05/0.78; `allied` 0.78/0.04); read pattern `settlementStrategy.js :: trueRelationshipType`: `ensureRelationshipState(normalizeRelationshipEdge(rawEdge), snapshot?.worldState?.relationshipStates?.[relationshipKeyFromEdge(rawEdge)])` | RN-r1-1 |
| M2 | The seat-morality producer | `warSeatBooks.js :: moralityBand` (module-private): `if (value >= 0.67) return 'malicious'; if (value <= 0.33) return 'merciful'; return 'balanced';`; `rulerAlignment` returns `{ lawfulness01: 0.5, malice01: … }` only; `rulingSeatId` module-private | RN-r1-20, -25 |
| M3 | The landed fade in the roamer belief read | `npcCirculationBelief.js :: beliefFadeSteps`: `Math.floor(ticksOf(elapsedTicks) / …BELIEF_FADE_TICKS)` + `Math.floor(ticksOf(delay) / …BELIEF_DISTANCE_FADE_TICKS)`; `npcConsequencesTuning.js` `BELIEF_FADE_TICKS: 40`, `BELIEF_DISTANCE_FADE_TICKS: 3`; `rank = notorietyRank(facts.notorietyBand) - fadeSteps`; no shipped preset uses infoMode `unreliable` (`simulationRules.js`: `omniscient` · `perfect_delayed` ×2 · `full`) | RN-r1-5 |
| M4 | The verdict's writer | `npcVerdictTable.js :: npcVerdictFor` "Returns null, and writes nothing anywhere"; `npcVerdictApply.js :: applyNpcVerdict` → `graduateNpc({ … reputation: decision.reputation, … hostSettlementId: holding ? settlementId : null })`; `reputationRaceConsumer.js`: `told: NOTORIETY_BANDS.indexOf(rec.reputation.notorietyBand) > 0` | RN-r1-6 |
| M5 | The operative scalar's signature and callers | `espionageMath.js :: operativeNotoriety01(homeSettlement, npc)`, `covertCompetence01(homeSettlement, npc)`; callers `espionageGauntlet.js` (`competence01: covertCompetence01(homeItem, npc)`, `targetId` and `worldState` in scope) and `espionageMissions.js` (cast; `durableId: entry.durableId \|\| ''`, no target) | RN-r1-7 |
| M6 | Personality on a person | `npcGenerator.js` `personality: { dominant, flaw, modifier, tell, speech }`; `npcData.js :: NPC_PERSONALITY_TRAITS` negative `arrogant · cruel · vain · vengeful · petty · bitter · vindictive`, neutral `proud`, positive `compassionate · generous · fair-minded · pious · merciful · magnanimous · warm-hearted · gracious` | RN-r1-8 |
| M7 | KILL's ledger removal | `npcLedger.js :: removeNpcRecord` deletes `placed`/`roamers`/`exclusions` only; `restoreNpcRecord({ worldState, wnpcId, record, wasPlaced, exclusions })` | RN-r1-15 |
| M8 | The Wanderers register reads `placed` as settled | `src/components/map/heraldWanderers.js :: wandererRows`: `settled: pool.placed.map((p) => rowOf(p, nameFor, false))`; `graduateNpc` callers: `characterDrift.js`, `npcVerdictApply.js`, `npcCirculation.js`, `envoyDiplomacy.js`; `VERDICT_CAUSES = ['none','jailed','banished','turncoat','criminal_founding','destruction_dispersal']`; `in_office` 0 hits | RN-r1-17, -24 |
| M9 | The party door has no command id; the landed grievance; the magnitude bands | `operationRegistry.js` `recordPartyImpact: … undoToken:null, undoState:'none'`; `ransomChoices.js :: ABANDONMENT_GRIEVANCE_KIND = 'abandoned_to_captivity'`; `rumorNetwork.js :: magnitudeBandOf`: `if (s >= 0.8) return 3; if (s >= 0.55) return 2; if (s >= 0.3) return 1;`; `partyImpactKinds.js` `defaultMagnitude: 1.0` for `resolve_stressor` · `clear_condition` · `remove_npc` | RN-r1-18, -19, -22 |
| M10 | The feed seeder's key; the content whitelist | `rumorNetwork.js`: `const eventRef = String(entry.sourceEventId \|\| entry.id);`; `captureContent` "ONLY structured fields are copied off a feed entry" | RN-r1-10, -30, SEAMS-r1-8 |
| M11 | The W-H3 loop is callerless | `advanceResidency(` is called only inside `npcResidency.js`; `advanceWanderer(` only by `npcResidency.js` | SEAMS-r1-16 |
| M12 | The second credibility ladder | `display/credibilityRead.js`: `const BAND_WORDS = Object.freeze(['discredited', 'doubted', 'trusted', 'unimpeachable']);` band 1 = "neither especially trusted nor doubted"; `envoyTestimony.js :: TESTIMONY_CREDIBILITY_BANDS = ['discredited','doubted','ordinary','trusted']`; `praise`/`condemnation` 0 quoted literals | SEAMS-r1-22 |
| M13 | The town lens's input defects | `disposition.js :: personalityDrive`: `if (score === 0) continue;` and `const w = importanceWeight(npc) * governingPower * GOVERNING_UPWEIGHT;`; `moralDrift.js`: `const decay = detIntPow(T.DECAY, silent);` on the prior; `npcAgency.js` `ALIGNMENTS` without `chaotic_good` | HOST-r1-7 |
| M14 | The seat-change producers | `treatySuccession.js` header: "exactly TWO producers … A coup VERDICT, a conquest, a DM `CHANGE_RULING_POWER`, an H2 verdict removal, DM KILL/ASSIGN and an underworld faction capture all change or vacate a seat and write NO row" | RN-r1-14 (the `seat_change` slot) |
| M15 | Effective lines (eslint) | `npcVerdictApply` 296 · `espionageMissions` 132 · `espionageGauntlet` 309 · `espionageMath` 163 · `npcLedgerFacets` 146 · `npcLedgerProjection` 113 · `npcLedger` 429 · `relationshipState` 360 · `warSeatBooks` 492 · `rumorNetwork` 364 · `envoyPulse` 332 · `reputationRaceConsumer` 183 · `religiousContest` 493 · `pactFormation` 565 | every car |
| M16 | The cured formula on the owner's cases (EXECUTED) | `lensProbe.out.json`: `pairNet` at defaults `rival` −0.4 · `neutral` 0 · `allied` +0.6 · `hostile` −0.8; good rival 0 (no grudge) · balanced rival 0 · malicious rival −0.2 (grudge, lens two) · malicious non-rival 0 · good non-rival +0.18 · cruelty −0.18 (good) / +0.24 (evil); one reachable miss: `LIE_FALL` → weight 0.4719, 125 weeks to ordinary; `MISS_FALL` 2.0 → 0.8375, 37 weeks | RN-r1-1, -3, -9 |

## §2 THE RECORD (id · severity · disposition · where · receipt)

| Finding | Sev | Disposition | Where (volume §) | Receipt |
|---|---|---|---|---|
| RN-r1-1 | BLOCKING | CURED — RULINGS-ROUND1 RN-r1-1 executed | §0 row, RN5, RN9, §2.1 `doer`, §2.2 refused pairs, §2.3 `pairNet`, §6.2 lens two, §15 R4/R5 | M1, M16 (R4 0 no grudge, R5 −0.2 by lens two). No contradiction: CH/PT read RN's `regardOf`; E14 untouched (RN writes no town↔town state) |
| RN-r1-2 | BLOCKING | CURED — RULINGS-ROUND1 RN-r1-2 executed | RN7, RN16, §2.1 `ver` mask, §5.1 pass + derived arm, §5.3, §8, §15 R33 | the chair's §5 "DERIVED on read only in the omniscient arm" now holds; bodies re-read their town's heard version |
| RN-r1-3 | MAJOR | CURED | RN9, §6.2 lens one `K`, §15 R26 | M16 |
| RN-r1-4 | MAJOR | CURED | RN3, §4.3 `RING_BY_DECAY`, §15 R28 | the observer read now applies §4.1's decay and shrinks through `reach` rings |
| RN-r1-5 | MAJOR | CURED | §0 row, RN4, §4.4 | M3: one fade per person (RN's with a deed; the landed fade for a stamp-only person) |
| RN-r1-6 | MAJOR | CURED — RULINGS-ROUND1 RN-r1-6 executed | §0, RN4, §3.1, §4.4, §10, §12, §13 RN-2, §15 R37 | M4 |
| RN-r1-7 | MAJOR | CURED | §4.5, §10, §13 | M5: optional context argument, identity default, three files |
| RN-r1-8 | MAJOR | CURED | §0 row, §6.2 μ table + paragon arm | M6 |
| RN-r1-9 | MAJOR | CURED | §2.1, §2.3, §6.2, §7, §14, §15 R19/R35 | M16; `partyCredibilityAt` folds only heard pledges; `MISS_FALL` DRAFT 2.0 |
| RN-r1-10 | MAJOR | CURED | §2.1 `sourceEventRef`, §3.4, §15 R30 | M10 (R2's executed probe stands: the feed seeds the act; the deed arm now suppresses it) |
| RN-r1-11 | MAJOR | CURED | RN3, §3.2, §4.3, §15 R27 | the ONE PERSON STAGE ruling voids the REFINED rationale; road arms read what was heard |
| RN-r1-12 | MAJOR | CURED | RN7, §2.2, §5.3, §5.6, §15 R36 | PL §2: `polityOf`, `polityHoldOf` bands; RULINGS-ROUND1 PL-r1-1's reach band map |
| RN-r1-13 | MAJOR | CURED | §4.2 + PL-dark arm | PL §0's 87–94% two-town fact; realm office only at ≥ DRAFT 25% of the world |
| RN-r1-14 | MAJOR | CURED | answer bracket, §2.4, §3.1 slot table, §5.4 priest row | M14; each engine source a slot with its owner |
| RN-r1-15 | MAJOR | CURED | RN11, §2.1, §3.3, §14, §15 R31/R32 | M7: strike masks; a removed holder's entries are skipped, pruned only by decay |
| RN-r1-16 | MAJOR | CURED | RN5, §2.1, §5.1, §14, §15 R16 | weakness = smallest strongest decayed term; DM seeds/sets exempt; term cap in both arms, the subject-cap divergence stated |
| RN-r1-17 | MAJOR | CURED | §2.4, §5.2, §10, §14, §15 R34 | M8: `verdictCause: 'in_office'` added to W-H1's closed list (a declared persisted VALUE); the projection drops it |
| RN-r1-18 | MINOR | CURED | §2.1, §15 R29 | M9 |
| RN-r1-19 | MINOR | CURED | §2.4, §14 | M9; the term decays on `a_generation` (ruled: the grievance kept, the regard it colours fades across a generation) |
| RN-r1-20 | MINOR | CURED | §0, §2.4, §6.2 | M2 |
| RN-r1-21 | MINOR | CURED | §2.1, §5.5 | `warmth`/`grudge` derived; `week` struck; cooldown from the deed ledger |
| RN-r1-22 | MINOR | CURED | §2.1, §6.1 | M9 |
| RN-r1-23 | MINOR | CURED | RN11, §5.6 | ODQ §129.2 (the skeptic's quote); SMN-19's AUTHOR shape; ≤4 dials with the anchor convention |
| RN-r1-24 | MINOR | CURED | §0, §4.4 | M8 |
| RN-r1-25 | MINOR | CURED | §0, §6.2, §10, §13 RN-3 | M2 |
| RN-r1-26 | MINOR | CURED | §2.1, §13 RN-5, §14 | byte estimate restated (PLAUSIBLE), facts never pruned, `reach` compactable, RN-5 measures |
| RN-r1-27 | MINOR | CURED | §6.1 | edges inclusive upward; the outward step inside `inherentValueOf`; `resolve_stressor` kind01 0.8 |
| RN-r1-28 | MINOR | CURED | §5.3 | creed and faction dark arms over the commons |
| RN-r1-29 | MINOR | CURED | §2.1, §3.2 | no `reach` cap |
| RN-r1-30 | MINOR | CURED | §3.4, §12, §14 | M10; a lifecycle table for the telling's additions; the belief-map shift disclosed |
| RN-r1-31 | MINOR | CURED | §2.3, §13 RN-5 | `deedIndex` per snapshot; a cost pin |
| SEAMS-r1-2 | MAJOR | CURED (RN's half) | §6.1 | one `paragon_act` block CH supplies at CH-3 + a registration walker; CH §2.2b's "never authored by CH" is CH's lane |
| SEAMS-r1-6 | MAJOR | ⛔ STOP (RN's §11 sentence cured) | §5.5, §11, §16 OD-RN-26, §18 | see §3 below |
| SEAMS-r1-7 | MAJOR | CURED | §2.4, §3.1, §6.1, §15 R38 | RULINGS-AFTER-COMPILE accepted `party_pledge`; the pledge reading: requester direct, others lens two only |
| SEAMS-r1-8 | MAJOR | CURED | §2.1, §3.1 | `sourceEventRef` on the deed + the normalizer; the cross-door dedupe is the lookup, the id keeps the ordinal |
| SEAMS-r1-9 | MAJOR | CURED | RN11, §2.1, §5.1, §5.6 | `declared` = any band as baseline; `dmSet` the freeze |
| SEAMS-r1-10 | MAJOR | CURED | §6.1, §6.2 | the row's backing shift struck; PT §10.2's term is the one carrier |
| SEAMS-r1-11 | MAJOR | CURED (RN's half) | §2.2 | one key per backer role; the qualifier set is the fold's (§3.3.12) or PT's |
| SEAMS-r1-15 | MAJOR | CURED (RN's half) | §13, §16 OD-RN-20 | head unit RN-0 + PT-0; RN-2 in C11's first chain; PT §15 and fold §6 owed |
| SEAMS-r1-16 | MAJOR | CURED (RN's half) | §5.4 | M11; the fold §2 bracket and any ordinary-roamer wave are the chair's |
| SEAMS-r1-21 | MINOR | CURED (RN's half) | §5.4 | one leaf per shared seam, fixed order, joint cap (DRAFT); the fold §3.1 row is the chair's |
| SEAMS-r1-22 | MINOR | CURED (RN's half) | §2.4, §7 | M12 |
| HOST-r1-2 | BLOCKING | CURED (RN's half) | RN15, §8 | RN's arms key on infoMode, never the canon's entitlement; the owner row is the fold's |
| HOST-r1-5 | MAJOR | CURED (RN's half) | §2.4, §5.4, §5.6, §9 | `lens` never DM-facing; "the town's gate"; "party view"; `realm` registered |
| HOST-r1-7 | MAJOR | CURED (RN's half) | §0 row, §6.2, §13 RN-3 | M13; RN declares which character each holder reads and names the split on scrutiny; RN-3 lights after the owner's alignment-25e/-25g |

## §3 ⛔ STOP

**⛔ STOP SEAMS-r1-6: whether an engine voice naming the party is a hearing.** The L-RN brief's ruling 10 says "RN owns no engagement kind". PT5 says "Every act of the world toward the party is a registered engagement kind". The owner's words that OD-FC-50 rests on say "Everything with the party is a hearing nothing is ever decided for them". A cure either way would contradict one of these, and the skeptic asks for a single ruling, so the chair rules. **Proposed re-ruling (a′):** a voice whose SUBJECT is the party becomes a PT-owned CLIMAX kind with RN's crossing as its producer. Its default is requirement 24's "nothing has happened to the party yet": the voice stays unspoken unless the DM lets it be spoken, and long advances leave it unspoken. RN still owns no kind. Voices about anyone else stay as regard dynamics. The volume is written to work under either ruling. Until the chair rules, RN-4 mints no voice about the party, and §5.5, §11, §15 R17/R18, §16 OD-RN-26 and §17 are marked.

## §4 REFINED (marked `[REFINED 2026-10-18 (fp-final r1) — …]`)
1. §6.2: a holder with no tie to anyone the deed touched judges the act alone, so the personality mix no longer halves a stranger's approval. Executed: a good non-rival reading a lifted plague moves from +0.09 (`indifference`) to +0.18 (`fondness`).
2. §9: the slow fade's sign (requirement 16, chair notes item 5). Fame's fade is derived on read, so its sign is the dossier's on-read line, which the age receipt (C8) may lead with. No writer is minted.

Judgment calls inside cures, recorded so they can be vetoed: `PAIR_NET` and κ (DRAFT); `RING_BY_DECAY`; the realm office share of 25%; `MISS_FALL` 2.0; `abandoned_to_captivity` decaying on `a_generation`; `in_office` as a `VERDICT_CAUSES` member (an explicit cause rather than an inference); the creed standing weights; the pledge terms +0.2/−0.3; the joint seam caps; the party's credibility band token kept off the dossier (it speaks in sentences there). All are listed in OD-RN-19 and OD-RN-21..26.

## §5 OWED BY OTHER LANES OR BY THE CHAIR (no file of mine)
- **PT lane:** PT §8.6 should point a reachable miss at `MISS_FALL`, not `LIE_FALL` (RN-r1-9). PT §15 and §7 should carry the RN-0 + PT-0 head unit with RN-2 ahead of PT-1/PT-2 (SEAMS-r1-15). PT §2.1's backer qualifiers, or a closed `backerRole` (SEAMS-r1-11). PT5/PT6 or a new kind, whichever SEAMS-r1-6's ruling picks.
- **CH lane:** CH §2.2b's sentence becomes "supplied by CH (CH-3), read by RN", with the registration walker (SEAMS-r1-2). The paragon μ arm over the W-LIVES chart is measured at CH-1's car.
- **The fold (the chair):**
  - §3.1: the two shared-seam leaves (SEAMS-r1-21).
  - §3.3.12: the backer qualifier set (SEAMS-r1-11).
  - §5 rows: `praise · condemnation`, `in_office`, the two credibility ladders (`doubted`/`trusted`), and the map words `lens` · `realm` · `gate` (SEAMS-r1-22, HOST-r1-5).
  - §6 C11/C13: the head unit and RN-2 (SEAMS-r1-15).
  - §2: the W-H3 loop "no caller" bracket (SEAMS-r1-16).
  - §7 owner rows: alignment-25e and -25g as gates on RN-3's lighting (HOST-r1-7); H22's birth canon "whatever the tier" against spine 17 (HOST-r1-2).
  - §7 OD-FC-47: one more persisted VALUE (`in_office`) beside the three shapes.

## §6 OPEN QUESTIONS FOR THE CHAIR
1. SEAMS-r1-6, as in §3.
2. Every other item is disposed. RN-S1 and the deed ledger's ownership were already ruled, and OD-RN-14 is accepted.

## §7 CONFIRMED vs PLAUSIBLE
CONFIRMED: every code receipt in §1 (read at `81f1cd963`); the effective line counts (executed with eslint); the formula and credibility arithmetic (executed, `lensProbe.out.json`); and every id present in §19 and bracketed in the body (checked by script). PLAUSIBLE, not executed: that each door can supply `sourceEventRef` (RN-0's car measures it), the size of the belief-map shift (RN-0's car), the deed ledger's byte estimate (RN-5), the effect size of the town-lens defects (RN-3's car), and every DRAFT constant (UNMEASURED, on the FP-46 roster). None is upgraded.
