# cure/D-OP-r2.md — DISPOSITION LANE over `docs/DESIGN_FP_ARCH_OP.md` (THE OPPORTUNITY), P6b round r2

Seat: D-OP-r2 (Opus 5.5), chair 6eb7b5b6 (Fable 5.1). Began 2026-10-20 15:44 CDT (by `date`). Code of record: master `81f1cd963` detached worktree (READ-ONLY). Never git; never the suite. Probes under `cure/D-OP-r2-probe/` (snapshot before: `OP-before-r2.md`).

## INPUTS (enumerated before any edit)
1. `skeptic/OP-r2.md` — ABSENT at seat start (`ls skeptic/` 15:43 CDT: no `*-r2.md`; RULINGS-P6 §D.13 shapes round 2 as the dispositions over each `<V>-r1-verify.md` FAILS and NEW tables + §D, the verifiers V-<V>-r2 following) ⇒ 0 ids.
2. `skeptic/SEAMS-P6.md` — ABSENT (the seams seat runs after P5c, RULINGS-P6 preamble and §D.13) ⇒ 0 ids.
3. `skeptic/{MG,WS,FS}-r2.md` — ABSENT ⇒ 0 ids. (The r1 verify files of the siblings were grepped for OP: `MG-r1-verify.md` l.40 OP-r1-16 HOLDS, l.52 an MG-side quote — no OP edit; `WS-r1-verify.md`, `FS-r1-verify.md` — none.)
4. Compile logs' ROUTES to OP: `cure/L-MG.md` §5 (X-LMG-OP) · `cure/L-WS.md` §4 (X-LWS-OP) · `cure/L-FS.md` §5 "OP · MG | none" · `cure/L-OP.md` §5 (OP's own). All four were disposed in r1 (`cure/D-OP-r1.md`: X-LMG-OP CURED, X-LWS-OP NOTED); re-checked here against the r1 dispositions of the SIBLINGS, which ran beside D-OP-r1 and route back to OP: **X-DMG-OP** (`cure/D-MG-r1.md` §4 "OP — §7 THE PHYSICS: 'on `wild`/`way` it is BARRED' … §14 row 20 'no hidden-way detour' → per WY's access row") and **X-DWS-OP** (`cure/D-WS-r1.md` §4 "OP: §15 WS row → 'WS declined: a way never biases an opportunity's boldness; it leans only the errand KIND (C12) once ES names it' (RT-OP-1)").
5. `skeptic/OP-r1-verify.md` — FAILS: **OP-r1-1** (BLOCKING) · **OP-r1-5** (MAJOR); NEW: **OP-V1** (MAJOR) · **OP-V2** (MAJOR); the STOP **STOP-C-IN** (ruled by RULINGS-P6 §D.3); minor residue **n1–n5**. No later verify file for OP exists.
Rulings applied: `briefs/RULINGS-P6.md` §D.1 · §D.2 · §D.3 · §D.12 (and §A.5 · §B.1 as before).

(record table and measurements follow; saved as the work proceeds)

## MEASUREMENTS AT MASTER (each convicting receipt re-read before its cure; 15:4x CDT)
- OP-r1-1 / D.1: `worldPulse/envoyRansomStage.js` header "NOTHING IS PERSISTED HERE, AND THAT IS AN OWNER GATE, NOT AN OVERSIGHT"; `openRansomClaims` re-mints every matured hold's claim each tick with `ransomMessageLegs({ claim, departTick: now, venueId: text(hold.venueId) || text(hold.captorId) })`; `envoyPulse.js` l.369–371 "Nothing is persisted: a ransom claim is new persistent state … the arc is computed and handed back". ⇒ at master NO ransom demand ever arrives at a home (the leg departs anew every tick); the home's first lawful road to a foreign-guest hold is WR-7d's persistence (OPENED by P5 A.2; the war volume's slot). `roads/state.js :: RansomRec` (`homeId · captorId · startedTick · termWeeks · remainingWeeks`) is the roads hostage's landed record — the home pays it. RN's `heardAt` (RN §4.3) is the per-deed arrival read; RN's `DEED_SOURCES` hold no capture (r1, unchanged). `subsystemRowsWar.js` "all nine immediate WR-7b facts are DM-only" (the verifier's receipt) stands. CONFIRMED by read.
- OP-r1-5 / D.2: `envoyInterceptionStage.js :: legalEncounterVenue` — "`if (text(asObject(occupation).occupierId) === actor) { return { encounterRef: { id: node, kind: 'occupied_enemy_settlement' }, … }`" then `allied_hall` for `node === actor` or an `allied` edge; `holdVenueFromEncounter` maps all three settlement kinds to `{ kind: 'settlement' }`. The errand's encounter keeps `interceptorId` and `venueRef` (`ENCOUNTER_KEYS`); the hold keeps `captorId` (= the interceptor). `espionageGauntlet.js :: gauntletCatchFactors` returns `hostRung` from `relationshipTypeBetween(graph, world, homeId, targetId)` (targetId = the venue town) as one field of a plain factors object — OP may re-read that one field home → the jailer and pass the rest unchanged to the pure `catchChance01`. CONFIRMED by read (`efflines-r2.txt`: the gauntlet 309 eff, untouched).
- OP-V1: `npcLedger.js` "`wnpc_<hash>` is minted ONCE"; `OriginRef { settlementId, rosterId, name }`; `livedExperienceSources.js :: subjectByDurableId` — the reverse read, "BOTH halves must agree"; `npcAgency.js :: npcId` = "`${saveId}:${npc?.id || stablePart(…)}`"; `buildLiveNpcIds` builds the roster keys from the RAW roster ("a captive is still a live soul"); `advanceNpcCredibility` "roster-scan prune"; `corruptionWeb.js` l.533 `npcKey: npcId(sid, npc, index)` (the lean's key space is the same). CONFIRMED by read.
- OP-V2: CH §4.2 `answer_call` "a place whose call in its domain it believes is the gravest within reach … its own leg (bound: inside the lands)"; CH §14's call `{ settlementId, domain, side, band, source }`; the `hunt_body` precedent (the destination is the quarry's predicted place, not the call's settlement). CONFIRMED by read of the ledger volume (15:4x).
- Tokens (`tokens-r2.out`): `jailerOf` · `toldBy` · `rosterKeyOf` · `roads_ransom` FREE; `jailer` prose-only (1 src string); `ransom_demand` design-only in master docs (`DESIGN_WAR_RULINGS_ARCHITECTURE.md`'s errand purpose list — the same meaning, a demand carried home); `telling` LANDED (RN's and IN's word, same meaning).

## PROGRESS
- 15:5x batch b1 applied (header · §0.1 two rows + the jailer clause · §0.2 · §0.4 item 9 · OP3 (b) · OP10 · OP13).
- 15:5x batch b2 applied (§2.1 deposit row · §2.5 opportunitiesAt · detourCandidates · jailerOf · rosterKeyOf · §3.3 n3 + the paragon's verb · §4.3 · §4.4 · §5.1–§5.3).
- 15:5x batch b3 applied (§6.2 S-8 widened · §6.3 · §6.4 · §7.1 the mouthpiece key · §9 the call row (D.1, OP-V2) and the paragon's word key · §10.1 · §10.2 the ransom row's words).
- 15:5x batch b4 applied (§11 pins iii-d · vii · §12 OP-0 car-0/leaves/EDITOR n5 · OP-2 · OP-6 · §14 rows 28 · 30 · 31–34 · §15 ES · IN · RN · CH · MG·WY · WS·FS).
- 15:5x batch b5 applied (§14 row 31 walker wording · §16 tokens · §17 OD-OP-7 · 14 · 26 · 27 · new 31–34 · §18 line 14).
- 15:5x batches b6–b8 applied (the "captor"→"jailer" renames in §5.5 · §6.4 · §6.6; the mouthpiece wording after the probe; the omniscient arm never mints a home call); §19 Round r2 block appended.

## PROBES (this lane, `cure/D-OP-r2-probe/`)
- `OP-before-r2.md` — the volume as the round found it (668 lines); after: 707 lines.
- `mouthpiece-key.mjs` → `mouthpiece-key.out` — EXECUTED against master's `npcCredibility.js :: advanceNpcCredibility` and `npcAgency.js :: npcId` (imports only): with `liveNpcIds = { 'tolle:npc_3' }` and one `deception` delta on each of `wnpc_0f3a9c` and `tolle:npc_3`, the ledger after the pass holds ONLY `tolle:npc_3`; `npcCredibilityWeightOf` reads 1 (neutral) for the durable key and 0.479 for the positional key. The fold's "never resurrect a pruned NPC" skips the durable key at once (stronger than the verifier's "pruned at the next pass"). CONFIRMED (executed).
- `efflines-r2.txt` — `ransomClaim.js` 178 · `envoyRansomStage.js` 98 · `npcLedger.js` 429 · `livedExperienceSources.js` 473 · `espionageGauntlet.js` 309 eff (OP adds no line to any). CONFIRMED (executed).
- `tokens-r2.out` — `jailerOf` · `toldBy` · `rosterKeyOf` · `roads_ransom` FREE; `jailer` prose-only; `ransom_demand` design-only, same meaning; `telling` LANDED, same meaning. CONFIRMED (executed).

## THE RECORD
| id | sev | disposition | where (volume) | receipt |
|---|---|---|---|---|
| OP-r1-1 | B (r1 FAIL) | CURED — the home call and every carried chance exist only from an ARRIVED record (roads ransom · WR-7d's persisted demand · an RN telling), venue/captor copied (`toldBy`); in every info mode; at master only roads hostages | §0.1 · §0.2 · §0.4 · OP3 · OP13 · §2.5 · §9 · §12 · §14 r31 · §15 · §16 · OD-OP-14/26/32 | `envoyRansomStage.js` "NOTHING IS PERSISTED HERE"; `openRansomClaims` `departTick: now`; D.1 |
| OP-r1-5 | M (r1 FAIL) | CURED — `jailerOf` (the occupier for `occupied_enemy_settlement`); rung · `hostRung` · caught `captorId` · grievance · unwitnessed blame read it | §0.1 · OP10 · §2.5 · §4.3 · §5.1–5.5 · §6.3/6.4/6.6 · §10 · §11 (vii) · §14 r32 · §15 · §18 l.14 · OD-OP-7/31 | `legalEncounterVenue` occupied arm; `gauntletCatchFactors` `hostRung`; D.2 |
| OP-V1 | M (r1 NEW) | CURED — mouthpiece/weight keyed by `rosterKeyOf` (reverse `originRef`); unmappable ⇒ none; S-8 widened | §0.1 · §2.1 · §2.5 · §6.2 · §7.1 · §9 · §11 (iii-d) · §12 · §14 r28/r33 · §15 · §16 · OD-OP-27/34 | `mouthpiece-key.out` (executed); `subjectByDurableId`; `npcId` |
| OP-V2 | M (r1 NEW) | CURED (OP half; CH half ROUTED) — `answer_call` on a `captive_held` source walks to `source.venueId` | §9 · §12 OP-6 · §14 r34 · §15 CH · OD-OP-33 | CH §4.2 `answer_call` row; the `hunt_body` precedent |
| STOP-C-IN | — | CURED — RULED by §D.3 as proposed; recorded | §15 IN · OD-OP-27 | RULINGS-P6 §D.3 |
| n1 | m | CURED | §4.4 | — |
| n2 | m | CURED | §4.3 | — |
| n3 | m | CURED | §3.3 | `normalizeErrand` (verifier's receipt) |
| n4 | m | CURED — the court's own pacts; no ally field in the picture | §2.5 | `ENVOY_PICTURE_FIELDS` |
| n5 | m | CURED | §12 OP-0 | — |
| X-DWS-OP | route | CURED — §15 WS row restated to WS's "no" | §15 | WS §13 OP row; `cure/D-WS-r1.md` §4 |
| X-DMG-OP | route | NOTED — already met (0 hits for the quoted sentences) | §15 | grep |
| X-LMG-OP | route | NOTED — r1 CURED stands | §3.3 · §15 | MG §0.2 · §3.3 (a) |
| X-LWS-OP | route | NOTED — r1 NOTED stands; superseded by X-DWS-OP | §15 | — |

COUNTS: disposed 14 of 14 — cured 11 · refuted 0 · stop 0 · noted 3.

## ⛔ STOPS FOR THE CHAIR
None raised this round. (STOP-C-IN of r1 is RULED by §D.3 and recorded.)

## REFINED (beyond the inputs; each marked in the volume)
1. OP3 (b): the carried hold filtered to what had reached home by the errand's `departedTick` (as `map_way`'s trails are).
2. §3.3: a paragon reaches `detourEnvoyErrand` only on CH's `court_errand` once the errand-row slot lands (A.3's parenthesis read once); MG §0.2 routed.
3. §10.2: the caught rescuer's `ransom` row takes the fold's `ransom` ↳ P4 words (`pay · hunt · wait`), the landed `pay · refuse · abandon` the leaf's internal answers (r1 had named the leaf's answers as the card's words).

## ROUTED (the halves this lane cannot write — one line per volume, the exact edit)
- **CH §14** — add the `captive_held` source row: `{ settlementId: <the captive's home>, domain: 'order', side: 'help', band, source: { kind: 'captive_held', venueId, captorId, toldBy: { road: 'roads_ransom' | 'ransom_demand' | 'telling', ref, tick } } }`, minted ONLY from that arrived record (venue/captor copied from it), never from `foreignGuestHoldsOf`, in every info mode (the omniscient arm knows an existing row, never mints one); its `harm` twin at the venue town, known there by presence; both excluded from PT's read.
- **CH §4.2** — one bracket on the `answer_call` row: "for a `captive_held` source the destination is `source.venueId` (the `hunt_body` precedent); a bound paragon only where that venue lies inside its employer's lands".
- **PT** — `party_request` never reads `captive_held` (r1's route, unchanged).
- **RN (P7 row)** — if a capture TELLING source is accepted, its `heardAt` arrival at the captive's home is the `toldBy: 'telling'` road; else nothing (r1's route, now named as a road of D.1).
- **THE WAR VOLUME (WR-7d's slot)** — the persisted ransom claim keeps its `demandLeg` as minted ONCE (`departTick`/`arrivalTick` fixed at the mint, never re-minted), its `claimantId` and `fromId`: OP's home call and carried chance read that arrival.
- **ES (ES-2b)** — confirm the court-carried encounter that holds a caught rescuer in an OCCUPIED town takes `legalEncounterVenue`'s occupied arm (the occupier as actor and the hold's `captorId`).
- **MG §0.2** — "(envoys, operatives, a paragon on an aim)" → "(envoys, operatives; a paragon only on CH's `court_errand`, once the owner's errand-row slot lands — a paragon on its own aim is CH's mover)".
- **FOLD (P7)** — §5 rows `jailerOf` · `rosterKeyOf` · `toldBy` (its road members `roads_ransom` FREE · `ransom_demand` same-meaning design homonym · `telling` landed, same meaning); OD-OP-31..34 carried into the OP chain C18's notes (none is an owner row).

## OPEN QUESTIONS FOR THE CHAIR
1. At master NO foreign-guest hold ever reaches a home (the WR-7d demand is never persisted), so the champion's `captive_held` help call and every carried detour toward an envoy held abroad wait on WR-7d's persistence wave; only roads hostages have a home call. The chair may want OP-6's FIRST-VISIBLE row to name WR-7d as a dependency for the envoy arm (written as a fact in OD-OP-32, not as a dependency row).
2. `jailerOf` for an `allied_hall` held in a captor's ALLY's hall reads the ally (the court whose cells they are), as the verifier proposed; D.2 ruled only the occupied arm — vetoable.

## CONFIRMED vs PLAUSIBLE
Every BLOCKING/MAJOR cure was checked against its convicting receipt re-read at master `81f1cd963` (CONFIRMED by read: `envoyRansomStage.js`, `ransomClaim.js`, `legalEncounterVenue`, `gauntletCatchFactors`, `npcLedger.js`, `subjectByDurableId`, `npcAgency.js :: npcId`, CH §4.2/§14), and OP-V1 by execution (`mouthpiece-key.out`); PLAUSIBLE and left to car-0: `rosterKeyOf`'s both-halves test holding for every errand traveller (S-8), ES-2b's occupied-arm encounter, and WR-7d's persisted claim keeping its first `demandLeg`.
- 15:5x markdown-only fix: three table rows (§2.1 l.144–145, §2.4 l.171) had unescaped pipes inside code spans splitting their cells; escaped (\|), no text change.
