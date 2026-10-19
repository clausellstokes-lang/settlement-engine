# D-PR-r2 — the round-2b disposition of THE PATROLS (`docs/DESIGN_FP_ARCH_PR.md`)

Seat: disposition lane D-PR-r2 (Opus 5.5), chair session a73343ed, 2026-10-18 (start 07:59 EDT by `date`). Read whole: the kit README, COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (+ addendum), RULINGS-ROUND2, RULINGS-ROUND2b, the BOARD, `briefs/L-PR.md`, the volume (692 lines), `skeptic/PR-r2.md`, the SEAMS-r2 and HOST-r2 rows routed to PR. Code of record: the detached master worktree `master-81f1cd963` (read-only). Probes: `cure/D-PR-r2-probe/`. No git; no test suite. The pre-cure volume is kept byte-for-byte at `cure/D-PR-r2-probe/DESIGN_FP_ARCH_PR.pre-r2.md` for diffing.

## 1. What I measured first (each CONFIRMED by reading the cited symbol at master `81f1cd963`, or executed)

(a) **The draw (PR-r2-1).** `worldPulse/warDeployment.js` (685 eff) seeds the army at the ONE new-deploy site: "Seed the deployment record HERE regardless of mode" → `seedDeploymentState({ targetId: chosenTarget, cap: fromCap, … })`; `worldPulse/warArmyRecord.js :: seedDeploymentState` (72 eff): "`const start = Math.max(0, Number(cap.offensive) || 0) * (rdy > 0 ? effectiveStatMult(rdy) : 1) * sizingFactor * qMult;`"; `warSiegeVerdict.js :: resolveSiegeVerdict`: "`const eff = Number.isFinite(stateful) ? … (stateful) : cap.offensive;`"; `warCapacityReads.js :: buildCapacityLookup`: "`const homeDefense = Math.max(0, offensive - armyAway);`". The only other seeding caller is `ensureStatefulRecord` (a light-record MIGRATION: "NO sizing rust here — the sizing DECISION is at the new-deploy site, not a migration"). CONFIRMED: the compiled per-tick draw never reached the field army and always weakened the walls. The cure takes the draw at the deploy site (+1 line in each of the two hosts, both far under 800).

(b) **The pool (PR-r2-2).** `peopleLedger.js :: POOLS` — "`census` is `settlement.population`, the existing integer" (the people ledger's census pool); `data/constants.js :: POPULATION_RANGES` (thorp 8–60 · hamlet 61–400 · village 401–900 · town 901–5000 · city 5001–25000 · metropolis 25001–100000); `militaryStrength.js :: deriveMilitaryCapacity`: "`let manpower = clamp0100(tierFrac * 70 + popScore * 30);`". EXECUTED `cure/D-PR-r2-probe/pool-r2.mjs` → `pool-r2.out`: the cured gate `pool = max(min(1, ceiling), round(ceiling × clamp01(population / tierMidpoint)))` BINDS in 7 of 24 tier×population rows (every tier whose ceiling ≥ 2 at the low end of its band: village 401 → 1 of 2; town 901 → 1 of 4, 2122 → 3; city 5001 → 3 of 8, 11181 → 6; metropolis 25001 → 5 of 12, 50001 → 10); the compiled facet read gave `pool = ceiling` in all 24 (the skeptic's 18/18 reproduced and widened).

(c) **The fast half (PR-r2-5, PR-r2-18).** `embattlement.js :: scoreRoute`: "`for (let i = 1; i < nodes.length; i++) danger += embattlementLevel(worldState, nodes[i]);`" (danger is per NODE, summed over traversed hops); `routeDangerLevel`: "`return clamp01(finiteNumber(route.danger, 0) / hops);`"; `banditryLoss`: fire test "`draw >= danger * T.BANDITRY_CHANCE`", size "`const frac = (T.BANDITRY_MIN_LOSS + draw2 * (…)) * danger;`" — the level sets BOTH rate and size; callers `commodityFlow.js:650–651`, `supplyShipments.js:371–372`. `navalLayer.js` l.606–608: "banditryLoss fires on EVERY arriving shipment sea or land alike … no naval-patrol damper". CONFIRMED.

(d) **The smuggling gate (PR-r2-6, PR-r2-23).** `smuggle.js :: worstGate` returns a SETTLEMENT gate (`id`, `hostile` "hostile to the destination", `contraband`); `smugglePipeline`: "`if (detected && hostile) return 'seizure'; if (detected && contraband) return 'confiscation';`"; `smuggleSuccessChance`: "`return round4(clamp(raw, 0, T.SUCCESS_MAX) * attemptFactor(boldness));`" (`SUCCESS_MAX` 0.65). CONFIRMED.

(e) **The counter-term stamp (PR-r2-7, SEAMS-r2-4).** `stressors.js :: ageRoamingStressors` l.380 "`counterforce: assessment`" (the stamped score MN's wear read takes); MN §5.5 (2) as re-cured: "FILLED THROUGH THE STAMP, never added here". `stressorDynamics.js :: counterforceAssessment`: "`const rawScore = clamp01(scoreSum / entries.length);`" (the footprint mean, PR-r2-29); `STRESSOR_COUNTERFORCES.criminal_corridor` sources `criminal_opportunity` (invert) 0.4 · `legitimacy` 0.3 · `labor_capacity` 0.3 — no watch term (PR-r2-21). CONFIRMED.

(f) **The tick order (PR-r2-15).** `pulseKernel.js`: `ageRoamingStressors` l.510 · `advanceSettlementSupply` l.843 (banditry, smuggling) · `advanceRumorLedgers` l.2097 · `advanceEnvoyDiplomacyPulse` l.2194 (THE ONE PERSON STAGE) · `advanceEmbattlement` l.2391 · `advanceArmyTransit` l.2442 (the transit leaves, the witness) · `advanceCalamity` l.2527 (the patrol stage at its head). Every consumer runs BEFORE the stage, so a placement the stage writes at tick t for t+1 is the one every consumer reads in t+1. CONFIRMED (ordering); the cure makes the agreement structural.

(g) **Belief and fame (PR-r2-12, PR-r2-22).** `beliefMap.js :: belief`: "`if (String(observerId) === String(subjectId)) return { source: 'truth' };` … `return rec ? { source: 'belief', record: rec } : { source: 'unknown' };`". RN §2.3: `fameIn(worldState, actorRef, observerSettlementId, tick) → { scope, heard, arm }` — "fame as belief at one town". CONFIRMED.

(h) **Envoys (PR-r2-10, SEAMS-r2-2).** `envoyEncounter.js`: "Exact node equality is the whole collision law"; `foreignGuestHold.js :: normalizeForeignGuestHold` drops any hold without `errandId` + `encounterId`; PS §9 `passage_at_the_border` lines: B's `welcomed · granted · granted_under_watch · tolerated · refused · refused_with_warning · barred`, then A's `complied · rerouted · waited · turned_back · trespassed`; PS's `PASSAGE_MOVER_KINDS` = `army · column` (PS §2.1). CONFIRMED (both volumes and the code).

(i) **The sea (SEAMS-r2-1).** `docs/DESIGN_NAVY.md` (master): "owner-commissioned: navies convoy own/allied armies on water routes; hostile navies meeting = a sea battle with LAND-PARITY semantics"; "One navy per port settlement"; `navalKernel.js` header: "SEA BATTLES: two HOSTILE navies whose paths share a SEA EDGE collide there", "BLOCKADE … MINTS A SIEGE". CONFIRMED.

(j) **PL's summons and door (PR-r2-17, SEAMS-r2-10, -20).** PL §4.1: "a SUMMONS answered by each member on WC's `call_in_answer` (`answered · half_answered · refused · lapsed`)"; PL §4 "Half service — WC's `half_answered`; a `service_answered` row with the fraction"; OD-PL-46: other volumes "REQUEST through `requestFealtyRow` … REGISTERED episode prefixes"; PL §2: `polityHoldOf(worldState, snapshot, rootId, observerId)`, `crownReachAt(worldState, snapshot, rootId, memberId, observerId) → { share01, liegeId, tier }`. CONFIRMED.

(k) **PT's road kinds (PR-r2-13, -24, STOP-PR-2).** PT l.274 `party_warrant` agent "the WATCH"; l.277 `party_ambush` agent "the WATCH, or the espionage cast", WHERE the road; l.377: "PR's `believedWatch` is a court's belief … so PT consumes it nowhere". CONFIRMED.

(l) **The host document (HOST-r2-5, -6, PR-r2-14).** H9 "send an events window … each fact with who may see it"; H13 "Send the polity facts window: the whole input of the sway and of patrols"; H16 (HR:576) "The optional reads: patrol coverage … The only door through which patrols or the sway can ever touch the simulation" — the map's INBOUND door; H23 "the lens window (`lensWindow`): the ledger rows the host already keeps … each with who may see it"; HR:813 the map's patrol phase is fixed "never from the week". CONFIRMED (text).

(m) **Hosts' effective lines** (`effLines.mjs` → `effLines.out`, eslint's own `max-lines` count): `warDeployment.js` 685 · `warArmyRecord.js` 72 · `warCapacityReads.js` 143 · `envoyInterceptionStage.js` 590 · `supplyShipments.js` 210 · `embattlement.js` 172 · `smuggle.js` 119 · `commodityFlow.js` 474 · `militaryStrength.js` 178 · `stressors.js` 558 · `settlementStrategy.js` 763. CONFIRMED (executed).

## 2. The record table

Disposed **55 of 55: cured 54 · refuted 0 · stop 0 · noted 1.** Every id is marked in the volume with a `[CURED 2026-10-18 (fp-final r2) — <id>: …]` bracket at the changed passage (136 brackets) and appears exactly once in the volume's §20 cure record (checked by script: 44 skeptic ids, 0 missing; 55 record rows; every markdown table's cell counts consistent).

| Id | Sev | Disposition | Where (volume) | Receipt |
|---|---|---|---|---|
| PR-r2-1 | B | CURED (RULINGS-ROUND2b) — the draw at the new-deploy site from the army's seed, stamped `patrolDraw: { riders, points }`; per-tick capacity untouched | PR3 · §6.6 · §2.7 · §3.2 · §16.1 · R8 · R9 · OD-PR-5 | §1(a) |
| PR-r2-2 | B | CURED (RULINGS-ROUND2b) — pool = census against the tier midpoint, rounded, floored at one | PR2 · PR3 · §3.1 · R2 · OD-PR-3 | §1(b); EXECUTED `pool-r2.out` (binds 7/24 vs 0/24) |
| PR-r2-3 | B | CURED — the army's road first; `CAMPAIGN_SHARE` 0.75 > `PEACE_SHARE` 0.6; rear absorbed; `keepRiders` to `max` | PR2 · §2.2 · §3.2 · §9.1(e) · R8 | the owner's first word |
| PR-r2-4 | B | CURED — slowed toward `SLOW_NOT_SEVER_MAX`, never closed (CHAIR-NOTES 13 corrected by RULINGS-ROUND2b HOST-r2-1) | §0.3 · PR15 · R26 · OD-PR-37 | `spatialCost.js :: SLOW_NOT_SEVER_MAX` |
| PR-r2-5 | M | CURED (RULINGS-ROUND2b) — per-hop multiplier before the mean; sea hops 1 | PR6 · §6.3 · R6 · R25 | §1(c) |
| PR-r2-6 | M | CURED — `watchOf` per power; encounter per power; gate town's riders; holder's witness | §2.6 · §6.4 · §6.5 · §8.1 · R32 | §1(d) |
| PR-r2-7 | M | CURED — (b) struck; through the stamp | PR5 · §0.2 · §6.2 · OD-PR-10 | §1(e); MN §5.5 (2) |
| PR-r2-8 | M | CURED — riders only from the envelope; the fort's suppression yields (ST OD-ST-39 concurs); `fortWill`; no fourth term | §3.1 · §6.3 · §10.5 · R34 | ST §4.1, OD-ST-39 (read 08:30) |
| PR-r2-9 | M | CURED — one road roll; ES's competence once; `catch01` not on the road | §8.1 · §8.2 · R15 · OD-PR-15 | ES §3.3 `catch01` |
| PR-r2-10 | M | CURED (RULINGS-ROUND2b) — PS's envoy arm; never `envoy_intercepted`/`envoy_held` | PR8 · §8.2 · §11.2 · R16 | §1(h); PS §6.5 (read 08:30) |
| PR-r2-11 | M | CURED — `noticed = met`; the rung gates the card (PS §6.5's defaults) | §8.1 · R16 · R32 | arithmetic; PS §6.5 |
| PR-r2-12 | M | CURED — `fameIn` | §8.1 · R17 | §1(g) |
| PR-r2-13 | M | CURED — PT's WATCH is a riders' detachment | PR19 · §8.2 · R33 | §1(k) |
| PR-r2-14 | M | CURED — the window; lighting precondition; dwell | PR14 · §2.3 · §12 · §13 | §1(l) |
| PR-r2-15 | M | CURED — the stored placement; R30 | PR4 · §2.7 · §4.1 · §16.1 | §1(f) |
| PR-r2-16 | M | CURED — five named producers; prior + `known: false` | §2.6 · §8.3 · §9.3 | — |
| PR-r2-17 | M | CURED — `patrol_order` withdrawn; PL-5's `call_in_answer` input line | §10.3 · §11.2 · R22 | §1(j) |
| PR-r2-18 | M | CURED — composition table; `1 − slowShare`; `JOINT_FLOOR` at PR-5 | §6.3 · R6 | §1(c) |
| PR-r2-19 | M | CURED — the screen's week once at the verdict | PR12 · §9.1(b) · R18 | PS9 |
| SEAMS-r2-1 | B | CURED (PR's side) — W-NAVY; no PR sea slot | §0.3 · PR15 | §1(i) |
| SEAMS-r2-2 | B | CURED (= PR-r2-10) | §8.2 · §11.2 | §1(h) |
| SEAMS-r2-4 | M | CURED (= PR-r2-7) | §6.2 | §1(e) |
| SEAMS-r2-7 | M | CURED — cite MN §3.3; `roadCountry` only (MN's round-2b sentence) | PR5 · §6.1 · OD-PR-8 | MN §3.3 (read 08:30) |
| SEAMS-r2-8 | M | CURED — the one stretch key (unordered road; halves; `gateKey`; hop→half) | PR1 · §2.1 · §2.2 · §6.5 · §10.1(c) | PS §6.5 uses `road{a, b}` too |
| SEAMS-r2-9 | M | CURED — the keep is defensibility, never men (ST OD-ST-39); alternative recorded (OD-PR-41) | §10.5 · §17 | ST §4.1 |
| SEAMS-r2-10 | M | CURED (= PR-r2-17) | §10.3 | §1(j) |
| SEAMS-r2-11 | M | CURED — pair state in every arm | §10.1(d) · §11.2 · OD-PR-25 | RN refused pairs |
| SEAMS-r2-12 | M | CURED — prosperity band always on; DM band a ceiling (RULINGS-ROUND2b ST-r2-1); settlement-keyed export routed to ST | §3.1 · §11.1 | — |
| HOST-r2-5 | M | CURED (RULINGS-ROUND2b) — the window, never H16; trade-OQ4/OQ6 not answered | PR14 · §13 · OD-PR-36 | §1(l) |
| HOST-r2-6 | M | CURED — periodic clock; presence sent | PR4 · §2.3 · §13 · R31 | HR:813 |

MINOR and RULINGS items (all in the volume's §20): PR-r2-20 … 29 CURED; SEAMS-r2-15 · 17 · 20 · 21 CURED; RULINGS-ROUND2b STOP-PR-0 · STOP-PR-1 · STOP-PR-2 · Q1 · Q2 · Q3 · Q4 · Q6 · Q7 · Q8 CURED (applied); Q5 NOTED (the fold lane's brackets; PR's §0.2 marks the superseded words).

## 3. STOPs

None. (SEAMS-r2-9 was drafted as a STOP and converted to CURED once ST's concurrent round-2b text — OD-ST-39, "the keep is defensibility, never men … with THE PATROLS lit the fort's own suppression yields to its holder's riders (one subtraction)" — was read at 08:30 and found to agree with PR's cure; the seams skeptic's stationed-share alternative is recorded for the chair in OD-PR-41.)

## 4. Open questions for the chair (also the volume's §19)

1. One body of men (OD-PR-41): ST and PR agree; the chair may prefer the stationed-share alternative.
2. SEAMS-r2-7 is settled by MN's round-2b sentence (`roadCountry` alone suppressible) — the chair's veto only.
3. The window's row: the chair named H9; PR sends dated acts there and the week's presence as an H23 lens row beside it (H13 feeds the map's patrol layer) — the row's name is the map program's.

## 5. Routes (rows other lanes own; none edited by this lane)

- **PS** — done concurrently in PS's round 2b (read 08:30): `PASSAGE_MOVER_KINDS = army · column · patrol · corps`; THE ENVOY ARM (`stopped · escorted · turned_back`, defaults ally none · stranger `escorted` · enemy `turned_back`); the deployment-id unit key. PR is aligned to all three.
- **ST** — export the settlement-keyed band `fundingBandOfSettlement` (one band law; the DM's band a ceiling). The fort's suppression yielding to riders is done (OD-ST-39).
- **MN** — the `army_beaten` bracket (Q6). The composition sentence is done (MN §3.3, round 2b).
- **PT** — `party_gate`'s road arm (STOP-PR-2); its WATCH as a riders' detachment (PR-r2-13); its patrols line still says "opens H16" (l.377) and should say "the window" (RULINGS-ROUND2b HOST-r2-5).
- **PL** — PL §15.12's "the crown's riders" (SEAMS-r2-17). The riders' line on PL-5's `call_in_answer` is already in PL (l.231, l.539, read 08:10 version).
- **RN** — RN l.239 still says PR's `patrol_joins` default reads `courtRegardOf`; after SEAMS-r2-11 it reads the landed pair state (RN's round-2b lane holds SEAMS-r2-11 too). RN's "opens H16" phrase likewise.
- **CH** — CH l.393's `believedWatch(…, stretch, tick)` signature is now `(…, roadKey, tick) → { watch01, known }`; CH l.863's "opens H16" → "the window".
- **ES** — J-ES-1's amendment bracket and the product row for `believedWatch` (through the fold lane and ES's commit).
- **The fold (P4)** — THE ONE STRETCH KEY in the WHERE companion; the §5 rows (`patrol` producer; the `placement` homonym; the cadence words' one meaning; `patrol_order` withdrawn; "the window" not "opens H16"); the map-side inbox (h) and (f)'s patrol clause struck (HOST-r2-21); §6's C16 prerequisites (H13 / H23 on M-W5 + H25); the registry rises by TWO PR kinds.

## 6. REFINED beyond the findings (each marked where it sits)

(1) the corps row in §8.2 (the chair's SEAMS-r2-6 corps ruling reaches the riders through PS); (2) the one "sites considered" line (§10.5; RULINGS-ROUND2 E); (3) the window's H23 and H13 rows beside the chair's H9 (§13); (4) the placement's `next` / `lived` split, so no surface ever shows a week ahead ("a marker is a presence, never an intention"); (5) the deployment stamp bounds the riders fielded while an army is out, and the DM's order never exceeds what the army left at home (§3.2); (6) two token renames for landed collisions found by this lane's census (`tokens-r2.out`): `placementOf` (LANDED in `npcLedger.js` and `showOnMap.js`) → `patrolPlacementOf`; `nothing_found` (LANDED in `sendTwoDivergence.js`) → `found_nothing`; `placement` registered as a compound-scoped homonym.

## 7. CONFIRMED vs PLAUSIBLE

CONFIRMED by reading the cited symbol at master `81f1cd963`: §1(a)–(m) (the deploy seed, the census pool and `POPULATION_RANGES`, `scoreRoute`/`routeDangerLevel`/`banditryLoss`, `worstGate`/`smugglePipeline`/`smuggleSuccessChance`, the stamp and the footprint mean, the kernel's stage order, `belief`, the envoy collision and custody shapes, the navy, the host-document rows, the effective line counts). EXECUTED: `pool-r2.mjs` → `pool-r2.out`; `effLines.mjs` → `effLines.out`; the token census → `tokens-r2.out`. PLAUSIBLE (never upgraded): every DRAFT constant (UNMEASURED, FP-46); `slowShare` as a proxy for the ramped level; the joint floor until PR-5 measures it; the travellers' carried picture having room (each owner's car-0); the half's `cut01` fallback; the concurrent sibling texts (PS, ST, MN, PL) as read between 08:10 and 08:30 — their lanes may still change them.
