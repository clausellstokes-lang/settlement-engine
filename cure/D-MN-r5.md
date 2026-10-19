# D-MN-r5 — disposition lane for THE MENACE (`docs/DESIGN_FP_ARCH_MN.md`), P3 round 5a

Seat D-MN-r5 (Opus 5.5), chair 0a2e8bd9 (Fable 5.1) continuing a73343ed, 2026-10-19 (started 04:26 EDT by `date`). Resumed 07:3x EDT on the owner's "please continue" after the 5h limit killed the first seating at 04:3x (its volume cures kept, re-read and completed; nothing reverted). COMPLETE.

## 0. Inputs (read whole)
README (RESUME BLOCK 2) · COMPILE-COMMON · DISPOSE · RESEARCH-COMMON · RULINGS-PL-MN · -AFTER-RESEARCH · -AFTER-COMPILE · CHAIR-NOTES (1–19, incl. 17 and 18 (d)) · ROUND1 (+addendum) · ROUND2 · ROUND2b (+addendum) · ROUND3 (§A–§G) · ROUND4 (§A–§E) · ROUND5 (§A–§C); `skeptic/MN-r4-verify.md` (3 FAILS incl. 2 ROUTED-UNAPPLIED · 1 NEW MAJOR · 7 minors); `skeptic/SEAMS-r4.md` ROUTES ("MN: SEAMS-r4-9"); `skeptic/BD-r4.md` ROUTES ("MN: agrees … Nothing owed"); the ROUTES of all ten `cure/D-*-r4.md` (MN lines: BD ×2, CH ×1, PL ×1, ST ×1; PR/PS "none"; FOLD/PT/RN none); every §A/§B row of RULINGS-ROUND5 naming MN (A.2 · A.4 · A.5 · B.11 · B.20 · B.21 · B.22) and, checked beside them, A.3 and B.4. Beyond the letter (so round 5b finds nothing ROUTED-UNAPPLIED): the MN lines of the round-5a sibling ROUTES already landed (D-BD-r5 · D-PL-r5 · D-ST-r5 · D-PS-r5 · D-CH-r5 "none"). The volume WHOLE (880 lines, sha256 `2c1b0fb9…` = the r4 verifier's; pre-cure copy byte-for-byte at `D-MN-r5-probe/DESIGN_FP_ARCH_MN.pre-r5.md`). Code of record: master `81f1cd963` (read-only). No git; no suite.

## 1. Measured first (the refuting measurement for each brief)
- (a) MN-X1's premise, re-read on master (`D-MN-r5-probe/measure-a-b.out`): the stage order `advanceRumorLedgers(` l.2097 → `advanceEnvoyDiplomacyPulse(` l.2194 → `advanceCalamity(` l.2527 → `advanceTreatiesWithDisposition(` l.2752 (`pulseKernel.js`); every hop `const travelTicks = Math.max(1, finiteNumber(weeks, 1));` and arrival `if (finiteNumber(record.arrivalTick, Infinity) > now) continue; // in transit` (`rumorNetwork.js`). CONFIRMED: in a belief preset no neighbour believes a siege in its first week; B.11's per-candidate window is required, not optional.
- (b) B.4 against MN's march (`measure-b.out`): `routeNetworkConsumers.js :: mayUseHiddenPaths` — "it fails CLOSED: an unrecognized kind is refused, so a lane that forgets to declare itself gets the army's answer rather than the smuggler's"; `HIDDEN_PATH_KINDS = ['covert_envoy', 'smuggler', 'wanderer']`. `distanceRead.js :: pathCost/hopWeeks` price the digest's geography (`candidateRoutes`), not the route ladder. CONFIRMED: a menace is no `HIDDEN_PATH_KINDS` member, so once its path rides the route network it never walks a hidden way.
- (c) m4 (`measure-c-d.out`): `realmVerbExecution.js` — "a proposal-mode outcome (applyMode:'proposal', proposalPayload { kind:'realm_verb_order', verb, args })" and l.273 `proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb, args: a },`. CONFIRMED: an approved act's dials live on its proposal payload.
- (d) m5 (`measure-c-d.out`): `peopleLedger.js :: CONSERVATION_ENDPOINTS` = `SINKS: ['dm_removed', 'fell', 'mortality'] · SOURCES: ['birth']`; `TAG_EVENTS` `brigand · demobilize · reclass · untag`. CONFIRMED.
- (e) the token census (`census-r5.out`): `menaceSightings` · `recordMenaceSighting` · `pactAnswers` · `menace_not_enlisting` · `menace_absorbed` 0 · 0 · 0 · 0 everywhere (master src · tests · docs, the ledger's docs). ⚠ NEW HOMONYM found: `peopleLedger.js :: COUNT_EVENTS` carries `'enlist'` (and `CENSUS_DEBITING` = `['dispatch', 'enlist', 'mortality', 'muster']`) — the r4 census matched `enlists` word-exact (0) and missed the stem; registered (§3.4) and made a rule (a gang going over to a menace is NEVER the ledger's `enlist`).

## 2. The record (33 ids; the volume's §14 round-5a block carries the same rows)

| id | sev | disposition | where (MN) | receipt |
|---|---|---|---|---|
| A.17 (FAIL; = D-ST-r4 route) | M | CURED | MN7 · §3.1 sightings · §3.3 · §3.4 · §3.5 #9 · §4.5 · §9 · §10 K · M60 · OD-MN-4/12/41 | RULINGS-ROUND5 A.5; ST OD-ST-49 ("ST STORES NO BELIEF … the one writer RETURNS the sightings") read |
| R-BD-5 (FAIL, RU) | M | CURED | §2 promotion · M59 · OD-MN-40 | B.20; BD l.691/1012/1042 read (aligned) |
| R-BD-6 (FAIL, RU) | M | CURED | §6 · §13 · M58 · OD-MN-40 | B.21; BD l.608 read (route withdrawn) |
| MN-X1 (NEW) | M | CURED | §4.7 · §4.9 · M11 · M17 · §8 · OD-MN-41 | B.11; `measure-a-b.out` (stage order l.2097 < l.2527; `travelTicks = Math.max(1, …)`) RE-READ; PL l.437/910 carry the half |
| m1 | m | CURED | MN5 · §3.3 · §4.2 · §4.6 · §4.7 · §9 · OD-MN-29 · M56 | CHAIR-NOTES 18 (d) |
| m2 | m | CURED | OD-MN-2 | RULINGS-ROUND4 B (MN) |
| m3 | m | CURED | §6 · §5.5 · §8 · §9 MN-6 · §10 A · M58 | MN10 |
| m4 | m | CURED | §2 · M62 | `realmVerbExecution.js` l.273 `proposalPayload: { kind: REALM_VERB_PAYLOAD_KIND, verb, args: a }` (`measure-c-d.out`) |
| m5 | m | CURED | MN6 · §3.4 · §6 · M64 | `peopleLedger.js :: CONSERVATION_ENDPOINTS` `SINKS: ['dm_removed','fell','mortality']`; `COUNT_EVENTS` has `'enlist'` (`census-r5.out`) |
| m6 | m | CURED (PL side) | §4.7 cite | PL l.243, l.437 read |
| m7 | m | CURED | §3.1 `pactAnswers` · §3.5 #1/#6 · §4.7 · §10 F/L · M61 | — |
| SEAMS-r4-9 (MN half) | m | CURED (= R-BD-6) | §6 | B.21 |
| BD-r4 MN line | — | NOTED | — | "Nothing owed"; re-checked |
| D-BD-r4 (a) name | — | CURED (= R-BD-5) | §2 | — |
| D-BD-r4 (b) NAMED gangs only | — | REFUTED by ruling | — | B.21 ("MN wins"); BD l.608 withdrew it |
| D-CH-r4 A.10 | — | NOTED (held) | — | MN-r4-verify holds |
| D-PL-r4 §4.9 | — | NOTED (held) | — | MN-r4-verify holds |
| D-ST-r4 sightings | — | CURED (= A.17) | — | A.5 |
| A.2 | — | CURED | §2 · M59 | — |
| A.3 (checked) | — | CURED | §6 site bullet · §8 · §9 MN-6 · M63 · OD-MN-41 | ST l.667/l.846 ("a body or a menace stands where it stood") |
| A.4 | — | CURED | §3.3 readers | — |
| A.5 | — | CURED (= A.17) | — | — |
| B.4 (checked) | — | CURED | §6 · §3.4 · OD-MN-41 | `measure-b.out` (`HIDDEN_PATH_KINDS`; `mayUseHiddenPaths` "fails CLOSED") |
| B.11 · B.20 · B.21 | — | CURED (= MN-X1 · R-BD-5 · R-BD-6) | — | — |
| B.22 | — | applied | via R-BD-5/R-BD-6 | — |
| D-ST-r5 (1) · (2) | — | CURED (= A.17 · A.3) | — | ST l.676 |
| D-ST-r5 (3) | — | NOTED (carried by ST §6.7) | M59 | — |
| D-BD-r5 · D-PL-r5 · D-PS-r5 | — | CURED (= R-BD-5 · MN-X1 · A.3) | — | — |

**Counts: disposed 33 of 33 — cured 28 · refuted 1 · stop 0 · noted 4.** Volume after: 937 lines, sha256 `48f8c2bb…` (before the final count fix and table check the same text); tables 23, 0 column mismatches (python check, run 07:4x). Pre-r5 copy: `D-MN-r5-probe/DESIGN_FP_ARCH_MN.pre-r5.md`.

## 3. STOPs
None.

## 4. REFINED (beyond the inputs; each marked in the volume)
1. The sighting store is its own ledger key (`spatialLedgers.menaceSightings`), not a field of the menace record — the record leaves when the DM ends the menace and a belief inside it would die with the truth (A.5's defect); horizon = the long rumor TTL (one forgetting law).
2. A promotion carries no belief across records (the body's belief stays BD's; the menace is known by its own news).
3. THE PATROLS' look writes its finding of a menace WHEREVER the riders find it (PR §9.2 (b): "a menace's tracks (MN)"), not only at a menace-held site; `siteId` absent then.
4. The measured homonym: `peopleLedger.js` `enlist` (a person entering a unit) registered beside MN's `enlists`; a merge is never that event.

## 5. ROUTES (the halves this lane cannot write; one line each)
- **BD** §11 `PROMOTE_BODY` row (l.691): "any other course a `MENACE_COURSE` row in the same act" → "any other course staged by MN's `RAISE_MENACE` apply arm the tick the menace exists, read from this act's payload (MN §2, m4)"; and "the road `a|b` it holds" → "the road `a␟b` (the verb-dial idiom; its stretch key `stretch:<a|b>`)".
- **BD** §9.8 (d) (l.608): add MN's state guard (`absorbBody` refused `menace_not_enlisting` unless the menace stands `raiding` in the course's country) and, for a counted deserter gang, the merge writer's request of the people ledger's `dm_removed` sink with cause `menace_absorbed` (MN §6, m5).
- **PR** §9.2 (b) (l.419): name the door `menaceLedger.js :: recordMenaceSighting(worldState, { courtId, menaceId, mightBand, tick, whereId, siteId })` (MN's row `{ menaceName, mightBand, tick, whereId, siteId? }`), not "MN's `believedMenaces`" (that is the read).
- **FOLD** §5: register `menaceSightings` · `recordMenaceSighting` · `pactAnswers` · `menace_not_enlisting` · `menace_absorbed` (all 0 on master), and the people ledger's `enlist` as a homonym of MN's `enlists`.
- **FOLD** OD-FC-46 (persisted shapes): add `spatialLedgers.menaceSightings` and the `siege.pactAnswers` sub-field (MN §3.5 items 9 and 1; §10 K, L).
- **FOLD** §3.4 `menace_siege` row: the relief lines are taken per candidate in ITS first believing week (B.11), a pact-bound answer kept on `siege.pactAnswers`.
- **FOLD** §3.3: the ownership rows — the presence composer MN's owned unit (reads truth), `reliefAnswerOf` PL's (reads belief), the chooser's shared-signal car an owned unit whose owner volume the fold names (m1).
- **FOLD → WC inbox**: the people ledger's `dm_removed` event carries a cause (`menace_absorbed`) for a gang gone over to a menace (MN §6, m5; PLAUSIBLE that the field exists).
- **ST**: none owed (l.667/l.846 already say "a body or a menace stands where it stood"; OD-ST-49 returns the sightings MN's door takes).
- **PL**: none (B.11's half at l.437/910; m6 at l.243).

## 6. Open questions for the chair
- The same-tick order of ST's site-arrival answer, BD's stage and MN's leaf — all three now mount at `advanceCalamity`'s head (MN-0, ST's closing call, BD-0's fourth leaf); MN marks the A.3 hold PLAUSIBLE on that order. One car-0 should measure the three together (a build question, not a design one).

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by read at master `81f1cd963` (the probe outputs quote each line): the stage order and hop latency (MN-X1's premise), `HIDDEN_PATH_KINDS`/`mayUseHiddenPaths`, the proposal payload's `args`, the people ledger's sinks and its `enlist` event; by execution: the token census (0 hits for the five round-5 tokens) and the table check; by reading the siblings' current text: PL l.243/437/910, BD l.608/691/1012, ST l.667/676/846 and OD-ST-49, PR l.419. PLAUSIBLE, never upgraded: that the ring keeps an approved `PROMOTE_BODY` act until the next tick's apply; that `dm_removed` carries a cause field; the same-tick order of ST's answer and MN's leaf; every DRAFT constant (none added this round).
