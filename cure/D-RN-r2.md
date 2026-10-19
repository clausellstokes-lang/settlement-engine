# D-RN-r2 — disposition lane, P3 round 2: THE RENOWN (`docs/DESIGN_FP_ARCH_RN.md`)

Seat: D-RN-r2 (Opus 5.5), chair a73343ed, 2026-10-18. Input: `skeptic/RN-r1-verify.md` (5 FAIL · 1 STOP already ruled · 5 NEW MAJOR · 6 MINOR + the HOLD-row residues), `briefs/RULINGS-ROUND2.md` §A (A.1–A.6, A.8), §B (RN), §E. Read whole: kit README, COMPILE-COMMON, DISPOSE, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (+ ADDENDUM), RULINGS-ROUND2, L-RN, RESEARCH-COMMON, the volume (714 lines) and the verifier file. Cross-read by section: PT §2.1–§3.4, §7.3, §8.6, §10–§11; PL §2 (`crownReachAt`, `seatChangedSince`), PL's round-2 §E brackets (the format); CH §2.2b, §11; ST §7.4, §8; PR §9.3, §10.1(d), item 15; HOST-REQUIREMENTS H30 and alignment-3/4/9a/16/25e. Code of record: master `81f1cd963` (detached worktree, read-only). Backup of the volume before this lane: `cure/D-RN-r2-probe/RN-before-r2.md`. No git, no tests.

## 1. MEASURED FIRST (each CONFIRMED by reading the cited symbol at `81f1cd963`, or by execution where marked)

| # | Receipt | What it settles |
|---|---|---|
| M1 | `partyImpact.js :: baseOutcome`: `` id: `party.${stablePart(kind)}.${stablePart(action.id \|\| action.label \|\| kind)}.${fields.targetSaveId \|\| fields.relationshipKey \|\| 'realm'}` `` (no tick); `applyPartyImpact`: `const tick = worldState.tick;`; `worldPulseFeedCuration.js :: newsEntryForOutcome`: `sourceEventId: outcome.id`, `tick: normalizedTick`; V-RN's EXECUTED probe: three distinct removals share `party.remove_npc.remove_an_npc.s1`; `composerActionCarriesEventId: false` | SEAMS-r1-8: the party door's feed key is tick-free and never an identity; the deed id is `eventRef · tick · ordinal` with `worldState.tick` (RULINGS-ROUND2 B); `sourceEventRef` only where the composer supplies it; the feed guard keys on `(feedRef, tick)` |
| M2 | `pulseKernel.js`: `applyOrganicNpcVerdicts({ worldState, settlement: s, exposures: oustedExps, … tick: worldState.tick, … })` (no snapshot) at the verdict step; the verdict news appended into `wizardNews` (`newsToAppend = [… npcVerdictNewsEntries …]`) BEFORE `advanceRumorLedgers(` and `advanceEnvoyDiplomacyPulse({ worldState: memoryState, snapshot: postTimeSnapshot, regionalGraph: applied.regionalGraph, wizardNews, … })` | RN-r1-6: the person stage receives snapshot, graph and the tick's verdict news; it can mint the verdict deed from the verdict's record the same tick (or the next) with zero kernel lines |
| M3 | `npcVerdictApply.js :: verdictHeraldItem`: `` id: `npcverdict:${text(settlementId)}:${text(wnpcId)}:${String(tickOf(tick))}` ``; `VERDICT_AUDIENCE = { jailed: 'public', banished: 'public', turncoat: 'dm_only', criminal_founding: 'public' }` (module-private); `VERDICT_SEVERITY` 0.5/0.65/0.7/0.7 | the verdict's tick-stamped record key; a covert verdict must never be told; the verdict news is `notable` at `severity * 70` = 35–49 (`wizardNews.js :: normalizeEntry`), below `RUMOR_NOTABLE_SCORE_FLOOR = 60`, so the feed never seeds it — the deed is its one telling |
| M4 | `npcLedger.js :: graduateNpc`: "THE ONE-WAY DOOR. An already-graduated person keeps their id and their record exactly as it stands; graduation is not an update verb."; `normalizeRecord` keeps `verdictCause`, `originRef`, `reputation`, `sinceTick`; `moveNpcRecord({ worldState, wnpcId, hostSettlementId, patch, sinceTick })` merges a patch and re-places (null host ⇒ roamers) | NEW (D-RN-r2-N1): an officer RN graduated `in_office` and later sentenced keeps `in_office`, placed at home, with no stamp — the verdict never lands; the cure re-stamps through `moveNpcRecord`; and `sinceTick` is restampable by moves, so the verdict-deed mint also requires that tick's verdict news id |
| M5 | `settlementAlignment.js`: `lawfulness01: computeLawfulness(…)`, `malice01: computeMalice(…)`, `aggressiveness: computeAggressiveness(…)`; `disposition.js :: computeAggressiveness`: `const pers = personalityDrive(settlement);`; `computeMalice`: `const conscience = -conscienceDrive(settlement);` (the same weighting shape, alignment-3/4) and `moralDriftTerm(…).malice` (alignment-9a); `lawWord.js :: lawWordFor` (`LAW_WORD_EDGES = { lawful: 0.67, lawless: 0.33 }`, "THE ESTATE'S ONE LAW-BAND SPELLING"); `conquestDoctrineStage.js :: natureWordFor`: `malice01 >= 0.67 ? 'malicious' : malice01 <= 0.33 ? 'benevolent' : 'balanced'` ("this is the estate's one moral ladder") | HOST-r1-7: the town lens reads the two axes' landed bands and no aggression (the drive), H30 the slot (HOST-REQUIREMENTS H30: "Offer: fix the moral drift's compounding decay and its freeze outside belief worlds") |
| M6 | `rumorNetwork.js :: degradeTelling`: `content.magnitude = clampBand(content.magnitude + (fork.chance(0.5) ? 1 : -1));` and a `partyIds` swap | RN-V2: the heard magnitude must be stored with the term |
| M7 | `npcCredibility.js`: `SCORE_MAX: 12`, the advance's `clamp(… , -T.SCORE_MAX, T.SCORE_MAX)`, `decayedNpcCredibilityScore` (halfLifeFactor on `HALF_LIFE_TICKS: 52`; 0 past `MAX_LOOKBACK_TICKS: 260`) | A.1: subtraction cannot un-charge exactly; refold can (EXECUTED, P-e) |
| M8 | `npcLedgerFacets.js :: SCANDAL_CLASSES = ['none','venality','betrayal','brutality','conspiracy','heresy']`; `npcVerdictTable.js :: VERDICTS = ['jailed','banished','turncoat','criminal_founding']` | RN-V3: the verdict rows key on the stamp's scandal class |
| M9 | `heraldWanderers.js`: "The one-line WHY each card carries (design §6c). Total over VERDICT_CAUSES." above `const CAUSE_LINE` | the `in_office` member needs a line for the totality pin |
| M10 | `distanceRead.js :: seaLaneNeighbourMap(digest)` and `teleportNeighbourMap(digest)` exist | RN §3.2's tale BFS already walks the landed SEA LANES (the owner's 06:35 question: the sea is in the books — the chair's 07:5x correction stands; RN needs nothing new for sea routes) |
| M11 | `wizardNews.js :: normalizeEntry` keeps `audience` only for `'public'` or `'dm-only'` (hyphen); `verdictHeraldItem` writes `'dm_only'` (underscore); the rumor seeder filters `entry.audience !== 'dm-only'` | HAZARD for the chair (not RN's cure): a turncoat verdict's covert audience is dropped by the feed's allowlist; latent today because its score (49) is below the seed floor (60) and `npcConsequencesEnabled` is lit nowhere |

## 2. THE PROBE (`cure/D-RN-r2-probe/r2Probe.mjs` → `r2Probe.out.json`; EXECUTED, exit 0, read-only imports of master)

- P-a (persons, continuous, refined stranger rule): good non-rival 0.18 (`reading`), good rival 0, malicious rival −0.2, malicious no-tie 0, cruelty −0.18 / +0.24 — the round-1 REFINED receipt corrected.
- P-b (towns on the axes' bands, centres 0.17/0.5/0.83, no aggression): benevolent +0.198 alone, 0 as a rival; balanced 0 either way; malicious 0 alone, −0.2 as a rival; cruelty −0.198 / 0 / +0.198.
- P-c (pledge): `fell_short` to Kell read by Kell's rival +0.1333 BEFORE the clamp, 0 after; by the ally −0.2; `made_good` read by a benevolent rival 0, by a malicious rival −0.1333.
- P-d (verdict rows, lens one alone): brutality −0.264 at a benevolent town (`mistrust`), 0 at a balanced town, +0.264 at a malicious town; with the projection's face rule, `badly` at benevolent and balanced, not at malicious; heresy neutral on its face.
- P-e (credibility): one lie of two struck at tick 60 — refold −4.2356, subtraction −4.1017 (the clamp bit at tick 6).
- P-f (timing): a realm deed first reads `regional` at week 137 (`a_decade`); a heard term on `a_few_years` stands at 0.544 then.

## 3. THE RECORD (round r2)

| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| SEAMS-r1-8 | MAJOR (FAIL) | CURED (RULINGS-ROUND2 B + the verifier's cure) | RN §0 row, §2.1 `deedId`/`sourceEventRef`/`feedRef`, §2.3 `deedIndex`, §3.1, §3.4, §13 RN-0, §14, R39, OD-RN-27 | M1 (V-RN EXECUTED; read) |
| RN-r1-6 | MAJOR (FAIL) | CURED (RULINGS-ROUND2 B) | RN4, §0, §3.1 `npc_verdict` (THE ONE PERSON STAGE; that tick's verdict news id; public only), §3.4, §5.1, §10, §13 RN-2, §14, R37/R45, OD-RN-28 | M2, M3 |
| RN-r1-11 | MAJOR (FAIL) | CURED — restated honestly (fame and the heard term may part) | RN3, §4.3, R27, §17, OD-RN-30 | P-f (EXECUTED) |
| RN-r1-12 | MAJOR (FAIL) | CURED (A.8) — `crownReachAt(…, memberId, memberId).share01` | RN7, §5.3, §13 RN-2, R36, OD-RN-23 | PL §2 `crownReachAt`, P37 |
| HOST-r1-7 | MAJOR (FAIL) | CURED (ADDENDUM as worded) — the town lens on `lawWordFor`/`natureWordFor`, no town aggression, H30 the slot, no lighting gate | §0, RN9, §6.1, §6.2, §13 RN-3, §18, OD-RN-29 | M5; P-b (EXECUTED) |
| SEAMS-r1-6 | MAJOR (ruled STOP) | CURED (ADDENDUM; A.5) | status, §3.1, §5.5, §11, §13, R17/R18, OD-RN-26, §17, §18 | PT §2.4/§7.3 |
| RN-V1 | MAJOR | CURED — `heardAt` (the undecayed reach) for regard, bodies, credibility | RN3, §2.3, §4.3, §5.1, §5.3, §7, R40 | P-f |
| RN-V2 | MAJOR | CURED — the term's `mag`; the heard doer; the witness swap declared unread | §2.1, §2.3, §5.1, §6.2, §14, R41, OD-RN-31 | M6 |
| RN-V3 | MAJOR | CURED — RN's `npc_verdict` rows by scandal class; lens one alone; the projection's face rule | §4.4, §6.1, R42, OD-RN-34 | M8; P-d (EXECUTED) |
| RN-V4 | MAJOR | CURED — the settlement-doer rule narrowed to town and court holders | §2.1 `doer`, R43 | CH §2.2b, §11 |
| RN-V5 | MAJOR | CURED — (a) A.1 persisted + refold · (b) A.3 · (c) A.2 · (d) A.4/A.6 fields · (e) A.5 | §2.1, §2.2, §3.1, §3.3, §5.1, §5.5, §6.1, §6.2, §7, §14, R19/R35/R38/R46–R48 | M7; P-e (EXECUTED) |
| D-RN-r2-N1 | MAJOR (found here) | CURED — an `in_office` graduation is provisional; the verdict re-stamps via `moveNpcRecord` | §0, §5.2, §10, §14, R44, OD-RN-33 | M4 |
| 14 MINORS (the verifier's six + eight HOLD-row residues) | MINOR | CURED, each | see RN §19 r2 | read; P-a, P-c |
| A.1 · A.2 · A.3 · A.4 · A.5 · A.6 · A.8 | — | CURED (each with the id above) | RN §19 r2 | the rulings |
| E sites · E patrols · E doctrines | — | CURED (REFINED brackets; slot rows `site_verdict`, `patrol_clash`, `patrol_catch`) | §3.1, status, OD-RN-35 | ST §7.4, PR §9.3 |
| E the newest host document | — | NOTED (no RN read touches patrols before H16 or plague-R7) | §3.1 bracket | PR item 18 |

COUNTS: 37 disposed of 37 — cured 36 · refuted 0 · stop 0 · noted 1 (the full 37-row list is RN §19's round-r2 block).

## 4. STOPS
None. Every cure was buildable at `81f1cd963` with zero kernel lines: the verdict deed rides the stage the chair ruled (`envoyPulse.js` already receives `snapshot`, `regionalGraph` and the tick's `wizardNews`), and the `in_office` re-stamp uses the ledger's own landed writer.

## 5. ROUTED TO OTHER LANES (each a line that now trails RN; none is RN's to write)
- PT §3.1 (`party_impact` row): "else the eventRef of the news entry the door writes (RN §2.1)" — RN now has NO fallback: a panel act carries no `sourceEventRef`; the feed key is `feedRef`. PT's lane.
- PT §15 (PT-1 TIER, the waves table): "RN-3 LIGHTS only after the owner answers alignment-25e and -25g" — struck in RN (HOST-r1-7 as worded); PT-1/PT-2 no longer wait on it. PT's lane.
- PT §11.3: the interpolation by belief becomes "replace" for readers that can see the reason (A.2); PT §2.1/§10.3 `voidsRef` folds into `correctsRef` (A.4); PT's `contradicts` is now a named deed field in RN §2.1. PT's lane (PT's r2 already drops "derived" credibility — consistent with RN §7's refold).
- PR §8 (item 15's cover): `fameOf(…).scope` is the world's widest knowledge; a patrol recognises by fame AT ITS TOWN (`fameIn`). PR's lane.
- CH: a paragon (graduated by CH-0's door) later sentenced by a W-H2 verdict keeps its record under the landed one-way graduation law — RN re-stamps only its own `in_office` placements. CH's lane / the chair.
- THE FOLD (P4): §5 rows for `feedRef`, `contradicts`, `actAt`, `heardAt`, the slot rows `site_verdict` · `patrol_clash` · `patrol_catch`; §7 — no alignment owner row gates RN-3; the deed-id composite `eventRef · tick · ordinal`.
- HOST HAZARD (the chair's): `wizardNews.js :: normalizeEntry` keeps `audience` only for `'public'` or `'dm-only'`, while `verdictHeraldItem` writes `'dm_only'` for a turncoat — the covert audience is dropped on append; latent today (the verdict's score 49 is under `RUMOR_NOTABLE_SCORE_FLOOR = 60`; `npcConsequencesEnabled` lit nowhere). RN never tells a `dm_only` verdict regardless (§3.1).

## 6. REFINED (each bracketed in place)
- The 10-18 doctrines read against RN (under the status line).
- Sites considered and patrols considered (§3.1), with three slot rows (`site_verdict`, `patrol_clash`, `patrol_catch`).

## 7. OPEN QUESTIONS FOR THE CHAIR
1. The town lens on bands makes every `balanced` town read lens one at 0 (K = 1 − 2·0.5) — kindness and cruelty alike move such a town only through lens two and the projection's face rule (P-b, P-d). This was nearly so before (continuous values near 0.5); if the chair wants neutral towns to warm mildly to a deed good on its face (the owner's "inherently good without any bias"), a per-band K table (benevolent 1 · balanced 0.5 · malicious 0) is the one-line alternative. Not taken: it would re-tune round 1's executed formula without a finding.
2. The owner's 06:35 question ("Regarding weather and Sea route isn't this already in the books?"): yes — BOARD 07:5x records the chair's correction (TRADE M8 sea lanes with storm seasons, WY navalTransit, piracy at bandit parity, W11's blockade; the harvest is EC's conditions). For RN: the tale's BFS already walks the landed sea lanes (`distanceRead.js :: seaLaneNeighbourMap`, RN §3.2; M10). RN needs nothing new for the sea or the seasons.

## 8. CONFIRMED vs PLAUSIBLE
CONFIRMED: every receipt in §1 (read at the cited symbol on `81f1cd963`); P-a–P-f (EXECUTED, exit 0). PLAUSIBLE: that `wizardNews` still holds the previous tick's verdict news for the "or the last tick" read (the measured order makes this tick sufficient); that every observer reader of the stamp routes through the two chokepoints (RN-2's car-0, unchanged); the practical frequency of the defects moving a town across a band edge (RN-3's car-0).
