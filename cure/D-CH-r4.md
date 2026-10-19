# D-CH-r4 — THE CHAMPIONS, P3 round 4a disposition lane (Opus 5.5 xhigh; chair 0a2e8bd9, Fable 5.1, continuing a73343ed; 2026-10-18 21:58–22:4x EDT by `date`)

**OUTCOME: 46 of 46 input ids disposed — 25 CURED · 0 REFUTED · 0 ⛔ STOP · 21 NOTED. 11 REFINED. 0 new STOP. Three items routed to the chair (none blocking).**

Owned files: `docs/DESIGN_FP_ARCH_CH.md` (rewritten in place; brackets `[CURED 2026-10-18 (fp-final r4) — <id>: …]` / `[REFINED 2026-10-18 (fp-final r4) — …]`; §25 gains the Round 4a block), this log, `cure/D-CH-r4-probe/`. Code of record: master `81f1cd963` (the detached worktree named in `briefs/RESEARCH-COMMON.md`, read-only; HEAD verified `81f1cd963553f226b222714914ff34584e9911b8`). No git, no suite.

Pre-round copy: `D-CH-r4-probe/CH.before-r4.md` (sha1 `1c821fcb…`, byte-identical to the verifier's snapshot `skeptic/CH-r3-verify-probe/CH.at-verify.md`). Every diff line against it is this lane's (checked: every changed line carries an r4 bracket or is a row this lane wrote).

## 0. Inputs (read whole)
README (RESUME BLOCK 2) · COMPILE-COMMON · DISPOSE · RESEARCH-COMMON · OWNERSHIP · RULINGS-PL-MN · -AFTER-RESEARCH · -AFTER-COMPILE · CHAIR-NOTES (1–18, incl. 17 and 18 (d)) · ROUND1 (+addendum) · ROUND2 · ROUND2b (+addendum) · ROUND3 (§A–§G) · ROUND4 (§A–§D) · the BOARD's owner lines 18:00–21:52 · `skeptic/CH-r3-verify.md` · `skeptic/SEAMS-r3.md` (its ROUTES: "CH: —") · the ROUTES of all nine `cure/D-*-r3.md` · `cure/L-BD.md` (whole; §4's CH line) · `briefs/L-BD.md` items 28–49 (+22b · 23b · 25b · 32b · 33b · 34b · 42 (e) · 46b) · `docs/DESIGN_FP_ARCH_BD.md` §2.1–§2.4, §5, §7.1, §9.5, §9.8, §12, §19 · sibling texts as they stand at 22:0x (PR §2.5–§2.6, §5.5, §8.1, §10.5 after D-PR-r4; RN §2.3, §3.4; PT §2.1 SHAPE 1, §9.2, P49) · the volume (1,094 lines) whole.

## 1. The input ids
- `skeptic/CH-r3-verify.md`: FAILS RU-1 · RU-2 · RU-3 (all ROUTED-UNAPPLIED); NEW CH-Wm1 · CH-Wm2; notes n1–n8; the seam note (RN's own ROUTED-UNAPPLIED).
- `skeptic/SEAMS-r3.md`: ROUTES "CH: —" (no id).
- `cure/D-*-r3.md` ROUTES to CH: D-PL-r3 (the harbouring flag; the ban grammar) · D-PR-r3 (the "ride with the watch" row via `paragonLean`; `fundingBandOfSettlement` moot) · D-MN-r3 (the wildland `{ mult }`) · D-PT-r3 items 1 and 2 (= RU-3, RU-2) · D-RN-r3 (= RU-1). D-PS-r3, D-ST-r3, D-FOLD-r3: none to CH.
- `cure/L-BD.md` §4 (THE BODIES → CH): (1) the covert-hire idiom widened to an `employed` gang, one exposure source; (2) the corps' `desertion` names the `deserted` birth; (3) the road arm takes a body counterparty.
- `briefs/RULINGS-ROUND4.md`: all twenty A-rows; the CH B-row (A.8 · A.9 · RU-1 · RU-3 · CH-Wm1 · A.19 · BD's routes · L-BD 32 · 33 · 40 · 41 · 46).

## 2. Measured first (each CONFIRMED by a read at the cited symbol on `81f1cd963`, or executed)
- **A.8's read exists as ruled.** `beliefMap.js :: readBeliefRelationship(observerId, subjectId, worldState, truthType)`: "ground truth verbatim (dormant / self / unknown — the declared relationship is public, so absence is NON-paranoid), or the believed (and possibly STALE) allianceLabel"; the chooser calls it the same way (`settlementStrategy.js`: `readBeliefRelationship(id, other, worldState, relState.relationshipType)`).
- **n8's landed reading.** `roads/embassyHazard.js :: atWarWith`: "a live war-layer front OR a `hostile` relationship rung (§4: 'hostile = open war')".
- **n1.** `npcDmVerbs.js :: assignRoamer` refuses `active_errand` beside a live envoy errand (the "two lifecycle owners" comment) and `no_route` where the lifecycle is lit and the record already carries a leg or a `dmAssignment` ("An existing leg has no exact settlement from which a new ruling can honestly depart").
- **n6.** `relationshipEvolution.js :: applyRelationshipPatch` computes `current = ensureRelationshipState(typedEdge, worldState.relationshipStates?.[outcome.relationshipKey])`; `RELATIONSHIP_DEFAULTS.neutral.trust` 0.45; the precedent `sovereigntyTransfer.js :: accrueSaleGrievance` reads `Number(current?.trust) || 0` — an unmaterialized pair's trust collapses to 0 on its first grievance (a LANDED defect).
- **A.19.** `npcLedger.js :: addExclusionEdge` merges through `normalizeExclusionEdges` (one edge per door and kind; "already the strictest"); master's own `pardon` inverse replays the lifted edges ("pardon: re-shut every door, with its original window", `undoDmVerb`).
- **CH-Wm2 / A.9.** `rumorNetwork.js`: "A record with arrivalTick > current tick is IN TRANSIT (parked in its destination ledger, the arrival-queue idiom): invisible to the read model until it arrives"; "In-transit records (arrivalTick > now) never age"; the relay checks the continuation guard before arrival; `beliefMap.js :: reportsBySubject`: `if (arrivalTick > now) continue; // in transit — not yet heard`.
- **L-BD 41 / RF-7.** `npcAgency.js :: NPC_ROLE_ARCHETYPES` labels carry `captain`, `doctor`, `agitator` — neither `warden` nor `magistrate`; `roleCategory.js` lists `'warden'` (military) and `'magistrate'` (government); `factionRoles.js :: warden: 'watch'`. The landed hidden-path seam: `npcCirculationTransit.js :: nextHopToward({ …, hiddenHopsOf })` ("ABSENT (every caller today)"; a hidden hop wins only when "STRICTLY closer") and `planWanderLeg` ("A hidden way costs HIDDEN_PATH_SLOWDOWN times the nominal hop"); `npcConsequencesTuning.js :: HIDDEN_PATH_SLOWDOWN: 2`. THE BODIES §5.2 prices a trail at the hop × `TRAIL_WEEKS_MULT` (DRAFT 1.5) — one edge, two numbers (ROUTED).
- **Token census** (`D-CH-r4-probe/census-r4.tokens.out`; src files · quoted-literal files · tests · master docs · ledger docs): `hunt_body` 0·0·0·0·0 · `hunt_won` 0·0·0·0·0 · `isWardenParagon` 0·0·0·0·0 · `leads` 45·1 (a comment)·53·27·41 · `hunt` 22·5·19·32·80 (LANDED: `traditionCorpus.js` id `'hunt'`, `foodBalance.js`) · `warden` 18·8·8·8·21 · `bodyId` 2·0·0·4·4 · `paragon_leak` 0·0·0·0·3 · `paragonBeliefs` 0·0·0·0·3. (`census-r4.out` is the first, shell-broken run; the `.tokens.out` file is authoritative.)
- **Probes (EXECUTED against master's own modules):**
  - `findingsArrival.mjs` → `findingsArrival.out`: stamped with a 4-week journey, held by `home` alone, first readable at 14 (seed 10), gone at 28; stamped with none, readable 10, gone 24; unstamped control relays to `meet` and `third`.
  - `banLapse.mjs` (round 3's) re-run → `banLapse.rerun.out`, byte-identical to `D-CH-r3-probe/banLapse.out`.
  - `banKeysUndo.mjs` → `banKeysUndo.out`: after ten bans with one door indefinite — 9 keys, 8 windowed, the inert key kept, the oldest windowed (`A`) evicted; a re-ban at `J` leaves one key (`ep-J2`); a seat change at the indefinite door lifts nothing and keeps the key; the NAIVE `banish` inverse leaves the door open (`edgeAtC: null`), the CURED inverse restores `{ untilTick: 300 }`, after which a seat change lifts it; prior absent ⇒ no edge; prior indefinite ⇒ that edge.
  - `tablecheck.py` and `tablecheck-strict.py` (GFM: a pipe in a code span splits a cell unless escaped): 24 tables, 0 mismatches either way (`tablecheck*.out`).

## 3. The record table
| Id | Sev | Disposition | Where (CH) | Receipt |
|---|---|---|---|---|
| RU-2 · A.8 · n3 | **M** | CURED | §11 step 3; §2.2 `gateDefault`; §0 row; S44 | `readBeliefRelationship(courtId, servedId, worldState, relationshipTypeBetween(…))`; the served court as believed (a covert employer only at `confident`); the shared leaf names belief-vs-truth once (CHAIR-NOTES 18 (d)); "exactly the landed `atWarWith`" struck |
| RU-1 | m | CURED | §2.2 `believedWhereabouts`; S46 | RN §2.3 l.181 (`doerKey` "must name it"; `hopDelayTicks` 0 omniscient) |
| RU-3 | m | CURED | §11 Lifted; §21 L3; OD-CH-34; S45 | PT §2.1 l.115's three clauses; `banKeysUndo.out` |
| CH-Wm1 | m | CURED | P2; §6.1; §6.3; §9 road 1; §2.2; §5 (d); L3; S51 | `exertion.settlementId`; every seam reads it there |
| CH-Wm2 · A.9 (CH's half) | m | CURED | §8; L9; OD-CH-40; S52 | `arrivalTick = tick + hopWeeks(meeting, seat, season)`; `findingsArrival.out` |
| n1 | m | CURED | CH8 | `assignRoamer`'s two refusals quoted |
| n2 | m | CURED | §4.2 (2) | `seek_work` as a resignation named |
| n4 | m | CURED | §2.2; §5 (d) | the villain's `1 − d` declared; PR §10.5 (round 4) agrees |
| n5 | m | CURED | §9 accused | the bound restated as a rate |
| n6 | m | CURED | §9 accused; §0 row | `ensureRelationshipState`; landed `\|\| 0` defect routed |
| n8 | m | CURED | §11 step 3 | "hostile = open war" quoted; front vs rung |
| n7 | m | NOTED | — | A.10's MN/PR halves (PR applied, MN's lane) |
| seam note (RN's CH-V4 end to end) | — | NOTED | OD-CH-40 | RN's half of A.9 — routed |
| SEAMS-r3 ("CH: —") | — | NOTED | — | 0 `cult` hits in CH; CH is the authority SEAMS-r3-9 cites |
| D-PL-r3 → CH | — | NOTED | §11 | carried r3 (verifier holds) |
| D-PR-r3 → CH | — | NOTED | §5 (d) | carried r3 |
| D-MN-r3 → CH | — | NOTED | §6.2 | carried r3 |
| BD (1) · L-BD 46 (· 46b · 47) | — | CURED (+REFINED) | §9 ONE IDIOM; P3; §2.2; §19; L5; CH-7; OD-CH-14; S47 | one idiom, three ties; one store keyed `wnpc_`/`body:`; one writer; `exposeCovertHire` a CH-owned shared unit; one source; one latch per tie |
| BD (2) | — | CURED | §16b | WC's road or BD's `deserted` through WC's `brigand` event; §G.4 correction routed |
| BD (3) | — | CURED (+REFINED) | §11 road arm; §18; §19; S50 | `person_at_the_gate` with a body party; `admitted · refused`; never a lone fight |
| A.12 | — | CURED | §0; §16b | six kinds |
| A.19 | — | CURED | §11 Authored; CH-5 (≤ 10 lines); OD-CH-45; S45 | `banKeysUndo.out` |
| A.3 | — | CURED | S38; §14 | the untied `band` → BD's body ref |
| L-BD 32 (· 32b) | — | CURED (+REFINED) | P2 `leads`; §7; §4.2 (3); L10; OD-CH-44; S49 | sibling field, DM-named only |
| L-BD 33 | — | CURED | §7; §14; §18; CH-2; S48 | the bounty a call and an offer; one `hunt_won` |
| L-BD 40 | — | CURED (+REFINED) | §4.2 `hunt_body`; §18 champion arm; §2.2b; §5; CH-1; OD-CH-43; S48 | on PR's `predictedPlaceOf`; `championForHunt` |
| L-BD 41 | — | CURED (+REFINED) | CH16; §2.2; §5 trail arm; §11; OD-CH-42 | `isWardenParagon`; a retained warden's office ways; the landed person price |
| A.1 · A.2 · A.4 · A.5 · A.6 · A.7 · A.10 · A.11 · A.13 · A.14 · A.15 · A.16 · A.17 · A.18 · A.20 | — | NOTED | — | no CH text on their subjects (0 `readiness01`, 0 field-force, relief, menace-producer, veil or holder-tuple text); A.7's kingdom reach cited in §5; A.10's form CH's and unchanged |

## 4. STOPs
NONE.

## 5. REFINED (each bracketed where it stands; vetoable)
1. RF-7 corrected (CH16): `warden`/`magistrate` are roster keywords, not `inferRoleArchetype` labels; the law stands.
2. Names kept (P3): `paragonBeliefs` and `paragon_leak` hold one meaning each across three ties; the prefix names the owner. Alternative: rename to `hiddenEmployerBeliefs` / `covert_hire_leak` (both FREE).
3. `leads` is a sibling of `retainer`, not a kind inside it (§7). Alternative: `retainer.kind ∈ serves · leads`.
4. A body party's verdicts are `admitted · refused`; a paragon never fights a body alone (§11). Alternative: a new CH kind for a lone skirmish and a lone champion's band.
5. `hunt_body` for the brief's `hunt` (§4.2): `hunt` is landed and is BD's court↔beast stance word.
6. "Its job is its retainer" (§5): a RETAINED warden holds the trade in its court's service. Alternative: only a titled office-holder; a warden paragon is then a guide whose rides teach `by_guide`.
7. Every paragon knows the trails the town it stands in knows (§5; CH7's picture).
8. The paragon captive's road when ES-2b lands (§12.4; L-BD 34/34b): the ransom race words, a free paragon released, never designed on.
9. The mercenary institution is never a corps (§16b; L-BD 42 (b)).
10. After the owner's 21:52 word, the default's arms are CH's belief arms (§19 TIER).
11. The owner's five evening words that reach CH are quoted at the head (by stamp).

## 6. ROUTED — the other volumes' halves (this lane wrote none of them)
- **PR:** at l.294, l.594 and R46, "CH's aim `hunt`" → `hunt_body` (CH §4.2). §5.5's "held by CH's WARDEN archetype" should also count a warden paragon RETAINED by the court (`isWardenParagon`, CH §5; "its job is its retainer"). §8.1's traveller rule: a PARAGON on a trail is met by `trailWatchOf` exactly as a body is (CH §5's trail arm).
- **BD (D-BD-r4 / round 5):**
  - §7.1 and the sponsorship tie (item 46): carry `exposedAt` as the tie's latch on the stance row and on the sponsorship record; call CH's `exposeCovertHire` only where CH's covert arm is lit; never write `paragonBeliefs`; put each caught courier's receipt (item 47) on a record CH's pass reads.
  - The body leak row to RN: `leak:body:<bodyId>:<employerId>:<sinceTick>`, content `what: 'paragon_leak'` with `bodyId`/`bodyKind` (BD §2.4).
  - The `hunt_taken` card: its champion arm is CH's `championForHunt`, its resolution names the leader so CH mints ONE `hunt_won`, and its outcome words are the card's.
  - The DM's "NAME its leader" (item 36) writes through CH's `setLeader`; a leader only on a named gang or conclave.
  - The posted-bounty record is named so CH's call board reads it.
  - §19's CH row (2) "where WC's ledger is dark" → "through WC-11/12's `brigand` event" (§G.4).
  - ⚠ `TRAIL_WEEKS_MULT` 1.5 vs the landed `HIDDEN_PATH_SLOWDOWN` 2: cite one, or name why a band and a lone traveller differ (CHAIR).
- **RN:**
  - §3.4 l.262 (A.9 — RN's half, CH-r3-verify's seam note): copy each row's declared `relayedTick` AND `arrivalTick`; the findings' origin is the employer's seat; the leak `eventRef` gains `:<retainer.sinceTick>`; register BD's body leak row beside CH's.
  - `hunt_won` (CH §2.2b) joins `paragon_act`'s registered kinds, with a corps doer (`u:`) and a body target (`g:` / `creed:`; none for a beast — the place).
- **PT:** P49 names `atOpenWar` and pins A.8's read (PT's B-row). PT's road arm with a body is PT's; CH's narrowing of `person_at_the_gate` to `admitted · refused` for a body party binds CH's kind only.
- **MN:** A.10 — §5.2/§5.5 name `'menace_siege_draw'` / `'menace_raid_wear'` (n7; SEAMS-r3-9).
- **THE FOLD (P4 / D-FOLD-r4):**
  - §3.1.25 ↳ and §5 gate ↳: A.8, citing CH §11 step 3 as cured.
  - §3.3: six actor kinds (A.12).
  - §3.4: `person_at_the_gate` gains a body party and the WHERE `trail:<a|b>`; `paragon_disgraced` covers a failed hunt; `hunt_taken`'s champion arm is CH's.
  - §5: register `hunt_body`, `hunt_won`, `leads`, `isWardenParagon`, `exertion.settlementId`; `paragonBeliefs`/`paragon_leak` widened to body subjects (one meaning); "warden"'s two prose senses (route wardenship, EC-6 · H13, vs the public-security office, L-BD 41) — one register row or a pick (CHAIR).
  - Inbox: `accrueSaleGrievance`'s `|| 0` (a landed defect).
  - OD-FC-48 ↳ for OD-CH-41..45.
- **ES:** none new — the `paragon_employer` subject kind serves a body subject too where ES lights (CH §9 road 2; the subject id may be `body:`).

## 7. Open for the chair
1. The hidden way's two prices (§6 BD ⚠): CH uses the landed 2. Which governs a trail?
2. REFINED 2 (keep or rename `paragonBeliefs` / `paragon_leak`).
3. REFINED 6 ("its job is its retainer" for the warden's office knowledge) — PR's and BD's reads must agree with whichever stands.

## 8. Cross-volume check (no new contradiction opened by CH's text)
Grepped at 22:0x–22:2x:
- **Agree:** PT l.115/l.323/P49 (A.8, RU-3); RN l.181 (RU-1); PR §10.5 l.457 (n4, round 4); PR §2.5/§2.6/§5.5 (`leaderRef`, `predictedPlaceOf`, "PR NEVER MOVES A PERSON'S RECORD", a corps hunts with its own unit); BD §7.1/§9.5/§9.8/§12/§19 (the three routes as written); the fold §5 l.723 (`paragonBeliefs`' meaning unchanged).
- **Pre-existing and routed, not opened by CH:** RN §3.4 (A.9); PR's `hunt` (three sites, written in round 4 before CH named its token); BD's trail price; BD's §19 CH row (2).

## 9. CONFIRMED vs PLAUSIBLE
- **CONFIRMED by execution:** `findingsArrival.out`, `banLapse.rerun.out` (byte-identical), `banKeysUndo.out` (master's one exclusions writer; the key list and token are modelled), both table checks, the census.
- **CONFIRMED by code read:** every master symbol in §2.
- **CONFIRMED by quoting:** the sibling texts in §8 and the BOARD quotations (by stamp).
- **PLAUSIBLE, not upgraded:**
  - BD's stage order relative to the person stage (the latch design does not depend on it);
  - `predictedPlaceOf`'s place-to-node walk for a leader;
  - CH-Wm1's original leak scenario;
  - the cost note (§17);
  - every DRAFT constant (`hunt_won`'s cells, the trail choice's weights).
