import { createHash } from 'node:crypto';

import { OBSERVED_SCALAR_FIELDS, VOLATILE_SCALAR_KEYS } from './observed-shape-corpus.mjs';

export const PROSE_FAMILY_PROTECTED_SUBSTRATE = Object.freeze([
  'scripts/lib/observed-shape-corpus.mjs',
  'scripts/lib/prose-family-contract.mjs',
  'src/domain/events/applyEvent.js',
  'src/domain/events/eventPipeline.js',
  'src/domain/events/prepareCanonEvent.js',
  'src/domain/events/registry.js',
  'src/domain/region/graph.js',
  'src/domain/region/propagation.js',
  'src/domain/worldPulse/advanceInterval.js',
  'src/domain/worldPulse/provenanceKernel.js',
  'src/domain/worldPulse/pulseKernel.js',
  'src/domain/worldPulse/warTermination.js',
  'src/domain/worldPulse/worldState.js',
  'src/lib/chronicle.js',
  'tests/lint/.prose-family-contract-baseline.json',
]);

const FAMILIES = Object.freeze(['chronicle', 'pulseHistory', 'regionalLog', 'timeline']);
const CORPUS_KEYS = Object.freeze([
  'scalarRows', 'canonEventLogEntries', 'wizardNewsFinalEntries',
  'wizardNewsAccumulatedEntries', 'wizardNewsUnique', 'pulseHistory',
  'regionalEventLog', 'regionalEventLogUnique', 'aiChronicle',
]);
const META_KEYS = CORPUS_KEYS.slice(1);
const ROW_KEYS = Object.freeze(['family', 'path', 'field', 'distinctValues', 'occurrences']);
const FAMILY_KEYS = Object.freeze(['family', 'identities', 'distinctValues', 'occurrences']);
const TOTAL_KEYS = Object.freeze(['families', 'identities', 'distinctValues', 'occurrences']);
const SEGMENT_KEYS = Object.freeze(['kind', 'value']);
const EXPECTED_ROOTS = new Map([
  ['pulseResult', [...Array(12).keys()]], ['worldState', [12]], ['wizardNews', [13]],
  ['canonEventResult', [14]], ['aiChronicle', [15]],
]);
// ── RE-RECORDED 2026-08-17 BY TE36 (THE P4 POPULATION RECONCILIATION), CHAIR-AUTHORIZED
// UNDER ODQ §271. THE DENOMINATOR MOVED; THE CONTRACT DID NOT ────────────────────────────
// ⭐ THE SHAPE IS UNTOUCHED AND THAT IS THE WHOLE POINT: 63 identities before, 63 after,
// ZERO added and ZERO removed, four families still nonempty, `chronicle` and `timeline`
// byte-identical. Every moved figure is a COUNT on a path the contract already governed,
// and every one moves DOWN.
// THE CAUSE, in one row: `pulseHistory[].*.populationDeltas[].reason` goes distinctValues
// 2 → 1 and occurrences 41 → 5 (consequence) / 40 → 4 (mechanical). WAVE P4 (ODQ §219.3)
// retired the bare `population_decline` candidate under `demographicsEnabled`, and this
// corpus lights EVERY `*Enabled` flag, so the reason vocabulary of the population lane
// collapses to what a conserved TRANSFER still writes. Everything else follows from that
// one retirement: `consequenceOutcomes[].type` 9 → 8 distinct and `mechanicalOutcomes[].type`
// 3 → 2 (the retired candidateType), the headline/summary/reasons counts on both lanes, the
// rumour-seed family the retired outcomes used to seed, and `regionalGraph.eventLog[]`
// 109 → 73. THE NEWS LAYER DOES NOT MOVE — wizardNewsFinalEntries 240, accumulated 1567,
// unique 272 are all unchanged — because ordinary population drift was already `state_only`.
// ⚠ SCOPE: `demographicsEnabled` is virtual and false in every shipped preset. This
// denominator is the ONLY place in the estate that observes the lit engine, so no player,
// no shipped golden and no dark-control cell sees any of this.
// ── RE-RECORDED 2026-09-01 BY T8 · SHIFT (ODQ §858 + §860, the cited-companion clause), IN THE
// SAME ACT AS `tests/lint/.prose-family-contract-baseline.json` ─────────────────────────────────
// ⭐ THE SHAPE IS AGAIN UNTOUCHED, WHICH IS THE ONE THING WORTH SAYING FIRST: 63 identities before
// and after, ZERO added and ZERO removed, four families still nonempty, `chronicle` (7/7/7) and
// `timeline` (4/8/12) byte-identical. 26 of the 63 rows moved, every one of them a COUNT on a path
// this contract already governed. Reviewed row by row against the predecessor before the write;
// the review is in laneT8ROUTE-receipt.md, not summarised away here.
// ⚠ THE ROWS DIGEST IS THE ONE FIGURE THAT CANNOT BE PATCHED BY HAND. It is the sha256 of the
// regenerated rows, and `EXPECTED_ROWS_BYTES` is `Buffer.byteLength(JSON.stringify(rows))` of the
// same array — both are re-derived from ONE `deriveProseFamilyContract` run, never transcribed.
//
// THE CAUSES, DECOMPOSED BY SINGLE-VARIABLE CONTROL RATHER THAN BY ARGUMENT. Restoring ONLY
// src/domain/prosperityRank.js + src/domain/corruption.js to the landing base `598642981` (cars 2,
// 3, both addenda and the F6 bundle bill left at the tip) measures scalarRows 25438, pulseHistory
// {1057, 5063}, regionalLog {7, 165} — the FROZEN regionalLog exactly. So:
//   cars 2 + 3    scalarRows −13, pulseHistory distinctValues −141 / occurrences −13, regionalLog 0.
//                 Car 3's priorityCategory relabel is the distinctValues half (the `reasons[]`
//                 vocabularies: consequence 110 → 74, impactDigest 118 → 80, mechanical 47 → 25,
//                 rumour-seed 33 → 20, selected 118 → 80 — backing factions re-spelling their
//                 reasons); car 2's rumour dedup is the occurrences half.
//   car 1         scalarRows −39, pulseHistory {−9, −45}, and ALL of regionalLog {7 → 8, 165 → 169}
//                 plus ALL of the news layer (accumulated 1567 → 1565, unique 272 → 268). The
//                 corruption-onset shift §858 priced (~9 → ~33 ticks) reaches a 12-interval corpus:
//                 `pulseHistory[].corruptionEvents[].kind` occurrences 3 → 1 is that shift, read
//                 directly.
// ⚠ SCOPE, unchanged from the TE36 note above: `demographicsEnabled` is virtual and false in every
// shipped preset, and this denominator is the ONLY place in the estate that observes the lit
// engine. No player, no shipped golden and no dark-control cell sees any of this.
// ── RE-RECORDED 2026-09-24 BY FP BATCH LANDING 4 (the FP chair, session 87797a6a), IN THE SAME ACT AS THE NEWS-VOICE AND
// NEWS-HEADLINE CONTRACTS AND THE OSR WALKER'S PINS ──────────────────────────────────────────────────────────────────
// scalarRows 25549 → 26329; wizardNewsFinalEntries 240 → 272; wizardNewsAccumulatedEntries 1567 → 1604;
// wizardNewsUnique 273 and every FAMILY ROW HOLD (the 63 identities, their counts, the bytes and the digest are unmoved —
// the kept news entries live under wizardNews.entries, which this contract excludes by law). ONE CAUSE: the Herald lens U2
// (32315e384, FP-31 = P1), the 52-week window under the 240 cap; attributed by equality with the U2 seat's own measurement.
// ── RE-RECORDED 2026-09-24 BY FP BATCH LANDING 3 (the FP chair, session 87797a6a), IN THE SAME ACT AS THE OSR
// WALKER'S PIN AND THE NEWS-VOICE CONTRACT ─────────────────────────────────────────────────────────────────
// scalarRows 25527 → 25549; wizardNewsUnique 272 → 273; pulseHistory 1051/5075 → 1055/5097; totals
// 1074/5270 → 1078/5292; rows bytes 8271 → 8271. ⭐ THE SHAPE IS UNTOUCHED FOR THE FOURTH RE-RECORD RUNNING: 63 identities
// before and after, the same four families, chronicle 7/7/7, regionalLog 2/8/176 and timeline 4/8/12 unmoved —
// only pulseHistory's counts grow. ONE CAUSE, ATTRIBUTED BY BISECT (the corpus builder run per sha over the
// fourteen commits since landing 2, then these walkers run at the culprit): CURE-PEACE-1 U1 (c9b24fe51) — a
// peacetime suit retires when a war opens against its court, and the feed's reconcile of the superseded proposal
// mints ONE new wizard-news id, whose impact digest lands in the twelve pulse-history records (channelType
// 150 → 151, the +22 scalar rows). The walkers at c9b24fe51 and at the landing tip 98e0d8664 measure every
// figure identically; no other batch-3 pick moves any of them.
// ── RE-RECORDED 2026-09-01 BY THE WAR LANDING (§876), IN THE SAME ACT AS
// `tests/lint/.prose-family-contract-baseline.json` ────────────────────────────────────────────
// ⭐ THE SHAPE IS UNTOUCHED FOR THE THIRD RE-RECORD RUNNING: 63 identities before and after, ZERO
// added and ZERO removed, four families still nonempty, `chronicle` (7/7/7) and `timeline` (4/8/12)
// byte-identical yet again. 25 of the 63 rows moved, every one a COUNT on a path this contract
// already governed. The row-by-row review is in the lane receipt, not summarised away here.
// ⚠⚠ `EXPECTED_ROWS_BYTES` DID NOT MOVE, AND THAT IS A COINCIDENCE OF DIGIT WIDTHS, NOT A
// DORMANCY PROOF. 25 rows changed their counts and the digit-count changes happen to cancel to
// zero, so the array is 8271 bytes at both ends. THE DIGEST MOVES — that is the pin that is
// actually load-bearing here, and a byte pin alone would have read GREEN over a real movement.
// Both figures are re-derived from ONE `deriveProseFamilyContract` run and never transcribed.
//
// THE CAUSE, BY FIVE-ARM SINGLE-VARIABLE CONTROL RATHER THAN BY ARGUMENT, and it is ONE CAR.
// `6308a27b8` (landing base) and `ca7a6ba6a` (T4 SEAT-5) both measure the FROZEN denominator
// exactly — scalarRows 25399, pulseHistory {1048, 5018}, regionalLog {8, 169}, digest
// `687ae7e5…`. `5a529f100` (T4 SEAT-2b) measures the ENTIRE tip: 25527, {1051, 5075}, {8, 176},
// digest `4cf433b2…`. `0e27b7742`, `fc155e476`, `105c65cd1` and all three WAR mini-window cars
// move it by EXACTLY ZERO — every artifact byte-identical to the picks-only arm.
// ⛔ SO THE TWO CAUSES THE LANE BRIEF NAMED ARE FALSIFIED: W-MEM's `publishRuling` funnel is
// unreached by a 12-interval AO-0 corpus, and T4's occupation-authority prose moves nothing here.
// SEAT-2b mints `legitimacyUpheavalEnabled` with its first reader `stressorGates.upheavalLit`;
// this corpus lights every `*Enabled` flag, so the key is live HERE and nowhere else.
// ⭐ REGIONALLOG IS THE CLEANEST READING IN THE FILE: `distinctValues` HOLDS AT 8 while
// occurrences go 169 → 176. The audit log records the same eight KINDS of change, seven more
// times — an upheaval re-deal, not a new kind of event, and the car's own "redistribution, not
// inflation" invariant measured from the far side of the estate.
// ⚠ SCOPE, unchanged from both notes above: `demographicsEnabled` and now
// `legitimacyUpheavalEnabled` are virtual and false in every shipped preset, and this denominator
// is the ONLY place in the estate that observes the lit engine. No player, no shipped golden and
// no dark-control cell sees any of this.
// ── RE-RECORDED 2026-10-01 BY THE URBAN-BAND CHAIR (session 93391427, under the owner's "I defer all judgment to you"), IN THE
// SAME ACT AS THE NEWS-VOICE AND NEWS-HEADLINE CONTRACTS AND THE OSR WALKER'S PINS ───────────────────────────────────────
// ONE CAUSE, MEASURED AT BOTH ENDS: THE URBAN BAND'S SAME-SEED SHIFT (ODQ §934.86) AND THE DRUID RULINGS (§934.86 addendum 2);
// the corpus builder at the pre-band base 5d699cc68 reproduces every frozen figure below exactly. scalarRows 26329 → 25724;
// wizardNews 272/1604/273 → 264/1557/265; regionalEventLog 77 → 79. 63 → 61 identities, and the TWO THAT VANISH ARE NAMED:
// pulseHistory[].consequenceOutcomes[].proposalPayload.reason and pulseHistory[].resolvedStressors[].type. The re-dealt year
// resolves no stressor and carries no such proposal (the same year the news contracts read). 40 of the 63 rows moved a count.
// ⭐ THE REGIONAL LOG'S ROOT REACH IS NOW PINNED AS AN EXACT SET: root 2's pulse logged no regional event (the 79 entries are
// all unique and all sit on the other eleven roots), so the reach is [0,1,3..11]; it was 0..11. Every root still in the
// set keeps the contiguity law, and any further change to the set reds with the set named.
// ── RE-RECORDED 2026-11-04 BY THE REGISTERS-4 SEAT (the chair's ruling C5), IN THE SAME ACT AS THE NEWS-VOICE AND
// NEWS-HEADLINE CONTRACTS AND THE OSR WALKER'S PRODUCERS ARM (the 0c1fb8dec door; the harness reproduces every frozen
// figure exactly at c0ef42c13). By stage over the DOORS trace trees:
//   T1 FOOD-1  scalarRows 25724 → 25123, accumulated 1557 → 1510, final/unique 264/265 → 257/258, regional 79 → 80;
//              identities 61 → 58: the four pulseHistory metadata.resourceTaxonomy.{kind,type} rows (consequenceOutcomes[]
//              and selectedOutcomes[]) leave and pulseHistory[].resolvedStressors[].type arrives.
//   T2 FOOD-2  25123 → 25679, 1510 → 1541, 257/258 → 264/265, regional 80 → 77; identities hold at 58.
//   S5 SIZE-3  25679 → 25277, 1541 → 1521, 264/265 → 260/261, regional 77; identities hold at 58.
// Nothing after S5 moves. Families: pulseHistory 48/996/4979 → 45/995/4838, regionalLog 2/8/180 → 2/4/153; chronicle and
// timeline hold. Totals 61/1019/5178 → 58/1014/5010; bytes 8000 → 7517; digest 59c3bb5a → 1d67e350. The regional root reach
// [0,1,3..11] holds.
// ── RE-RECORDED 2026-11-05 BY LANDING-5 (the chair's addition (c), ODQ §934.105), ONE CORPUS BUILD PER TREE MEASURED WITH
// THIS LIBRARY'S OWN FUNCTIONS (the 0c1fb8dec / 3d50676bb door; a scratch copy of this file with the two corpus-shape
// throws turned into readings, which reproduces every frozen figure below EXACTLY at the window base 1264a8152^). The
// walker had died in its beforeAll since X-46 car 1 on a duplicate regional record id, so every movement of the rung-1
// window was masked; attributed by first-parent stage (scalarRows / regional events / unique; identities, distinct,
// occurrences; bytes; digest):
//   1264a8152 X-46 car 1        25277 -> 26488, regional 77/77 -> 82/80; 58/1014/5010 -> 59/1070/5199; 7517 -> 7668; 175fcbba
//   d4bf6431c car 2             26032, 81/81; 58/1068/5173; 7518; 043e3adf
//   ac09ea83b TERRAIN-POOLS     25929, 81/81; 58/1073/5200; 9ba75a8e
//   fe56bddd4 T1/T2             26335, 87/87; 58/1048/5240; a865bf46
//   90dc22f18 car 3 (budget)    24884, 79/78, the regional root reach gains root 2; 63/1001/5240; 8271; 0148b98d
//   6129c300d PLACE-NOT-TIER    24698, 78/77; 59/957/5182; 7665; 32c745c3
//   6ca454d2b car 3 I7          24683, 75/74; 59/982/5167; b2ff37cd
//   6d84aa834 F6                25185, 74/73; 59/950/5213; 25a59983
//   5e9ffb220 F1                25614, 75/74; 59/971/5227; c24ac7a8
//   db8ce5da8 F3                25574 (accumulated 1532 -> 1529); the families hold
// and nothing else moves. Then THE RESIDUAL OUTCOME'S TICK (bc2a64000, addition (c)): regionalEventLogUnique 74 -> 75 and
// NOTHING ELSE (measured with and without it at the tip: rows, digest and reach identical). The duplicate it cures was
// osr002's raider-pressure residual. Families: pulseHistory 45/995/4838 -> 46/952/5051, regionalLog 2/4/153 -> 2/4/157;
// chronicle and timeline hold. Totals 58/1014/5010 -> 59/971/5227; bytes 7517 -> 7665; digest 1d67e350 -> c24ac7a8;
// the regional root reach [0,1,3..11] -> 0..11 (root 2 carries regional events again from X-46 car 3).
// ── RE-RECORDED 2026-11-06 BY LANDING-7 LANE E (the chair's ruling R-E10, §934.105), IN THE SAME ACT AS THE NEWS-VOICE AND
// NEWS-HEADLINE CONTRACTS AND THE OSR WALKER'S PRODUCERS ARM (the 3d50676bb door; ONE corpus build per tree measured with this
// library's own functions, which reproduces every frozen figure below EXACTLY at the ceilings' parent 989219706). ONE CAUSE:
// THE DENSITY CEILINGS RE-DERIVED FROM THE STAMP BANDS (R-E8, 20c0139c5), measured at 20c0139c5 ALONE byte-equal to the tip.
// scalarRows 25574 -> 26891; wizardNews final/accumulated/unique 253/1529/253 -> 270/1615/270; regional 75/75 -> 86/86.
// THE SHAPE HOLDS: 59 identities, none added and none removed; 42 rows move a count. Families: pulseHistory 46/952/5051 ->
// 46/957/5042, regionalLog 2/4/157 -> 2/4/189; chronicle and timeline hold. Totals 59/971/5227 -> 59/976/5250; bytes
// 7665 -> 7669; digest c24ac7a8 -> 7c53b1cd. The regional root reach 0..11 holds.
// ── RE-RECORDED 2026-11-07 BY LANDING-R2 (helper seat D2, the chair's ruling of 02:36 UTC, §934.105: a pin re-taken AT THE TIP
// with its movement ATTRIBUTED BY STEP and the residual named as interaction with rung 1), THROUGH THE SAME DOOR AS THE NEWS-VOICE
// AND NEWS-HEADLINE CONTRACTS (the 3d50676bb / 4e010ec54 door: ONE corpus build per tree, this library's own functions, the
// corpus-shape throws turned into readings in a scratch copy only). Four trees: rung 1 final 1bff51c6d reproduces every frozen
// figure below EXACTLY; the census base f28689600 reads 25554/252/1528/252, 75/74, pulseHistory 46/952/5051, bytes 7665, c24ac7a8.
// THE RUNG-2 LINE (f28689600..f5dc50c6b, all 19 first-parent src steps measured) moves at ONE step, the census-1b merge
// 0856c09d3 (e36e4916f), and census-1b's own first-parent line (3bc72bc0c..e36e4916f, bisected) attributes it by step:
//   d35532850 census-1c unit 6b (water-keyed tradition elements weigh 0 inland)   scalarRows -90, wizardNews -3 (accumulated -6)
//   950b75014 the census-4 merge (4b/4c's goal tags)          -170, -2 (-15); pulseHistory distinct -2 (consequence headline -1)
//   2b31f33f3 the census-2 merge (census-2e's {colour} rulings) pulseHistory distinct +3; nothing else
//   597866207 census-1i unit 3 (R-AX: both criminal-secret rolls read the holder's role)  -164, -2 (-13); pulseHistory -4/-14
//             (mechanical headline -1/-1, consequence -0/-1); queued|npc_suppress leaves the news
// so f5dc50c6b reads 25130/245/1494/245, 75/74, pulseHistory 46/949/5037, bytes 7665, 04a90a12. (7369c35dd, census-1 wave 0
// fact 4, is already inside the census base.) AT THE TIP 3d03dc723: 26471/262/1580/262, 86/86; pulseHistory 46/958/5052.
// Rung 2's steps sum to scalarRows -424, wizardNews -7 (accumulated -34), pulseHistory -3/-14; the INTERACTION WITH RUNG 1 is
// scalarRows +4, wizardNews -1 (accumulated -1), pulseHistory +4/+24 (the tip less rung 1 final less rung 2's steps).
// THE SHAPE HOLDS: 59 identities, none in or out; 10 rows move a count; regionalLog 2/4/189, chronicle and timeline hold.
// Totals 59/976/5250 -> 59/977/5260; bytes 7669 -> 7669 (digit widths again); digest 7c53b1cd -> 9f28cc22. Reach 0..11 holds.
// ── RE-RECORDED 2026-11-07 BY MERGE-R2 (2026-11-07, the integration merge of the rung-2 landing into lane/integration-2026-11-07;
// re-keyed by identity with its cause), THROUGH THE SAME DOOR AS THE NEWS-VOICE AND NEWS-HEADLINE CONTRACTS (ONE corpus build at the
// merged tip 6c3e25661 = the merge 10b8f09b4 of fc4cb0b9f into a8daff92c, this library's own functions). The parents pinned
// 26891/270/1615/270 (a8daff92c, the integration line) and 26471/262/1580/262 (fc4cb0b9f, rung 2); the merged tip reads
// 26701/266/1598/266, regional 86/86 — the census steps above composed with the integration side's WIRING-W0 / REVIEW-INTAKE lines.
// Against the rung-2 pin: scalarRows +230, wizardNews +4 (accumulated +18), pulseHistory -1/-1. ATTRIBUTION PLAUSIBLE, NOT
// BISECTED (the residual is interaction between the two merged lines). THE SHAPE HOLDS: 59 identities, none in or out; 10 rows
// move a count, all pulseHistory (consequenceOutcomes[].proposalPayload.kind 2/3 -> 3/3, .proposalPayload.reason 2/2 -> 1/1,
// .reasons[] 69/395 -> 68/396; impactDigest[].impactKind 26/158 -> 27/158, .reasons[] 78/350 -> 78/351, .tags[] 34/631 -> 35/631;
// rollExplanations[].proposalPayload.kind 3/22 -> 3/21, .proposalPayload.reason 3/7 -> 2/6; selectedOutcomes[].proposalPayload.reason
// 3/4 -> 2/3, .reasons[] 78/374 -> 78/375); pulseHistory 46/958/5052 -> 46/957/5051; regionalLog, chronicle and timeline hold.
// Totals 59/977/5260 -> 59/976/5259; bytes 7669 -> 7669 (digit widths again); digest 9f28cc22 -> 4c5a458d. Reach 0..11 holds.
// ── RE-RECORDED 2026-11-07 AT THE PEOPLE CAR'S LANDING (PEOPLE-LAND second seat, §934.105), IN THE SAME ACT AS THE NEWS-VOICE
// AND NEWS-HEADLINE CONTRACTS (the 4e010ec54 door; ONE corpus build per tree measured with this library's own functions,
// which reproduces every frozen figure below EXACTLY at the integration base 262e8b255). ONE CAUSE: THE PEOPLE CAR (one face
// per institution) re-dealing the AO-0 year. By first-parent point (scalarRows; wizardNews final/accumulated/unique; regional
// events; identities/distinct/occurrences; bytes; digest):
//   dc655f712 lane 1 PEOPLE-1 CAST   26891 -> 36009; 378/2394/379; 86/86 -> 80/80; 59/976/5250 -> 58/1040/5495; 7669 -> 7523;
//                                    48bcb128. ONE IDENTITY LEAVES: pulseHistory[].consequenceOutcomes[].proposalPayload.reason.
//   3aa160a70 lane 2                 37487; 399/2518/400; 81/81; 58/1048/5526; 7523; 7e783477
//   0f930ce95 lane 3 HOOKS · c7d552370 lane 4 TIES · 053283dfd lane 5A DISPLAY   no movement
//   a725df7e4 lane 5B EDIT           37469; 58/1046/5508; 7523; afddb136
//   2981f23f6 (the landing's step 1, the shim out) and the landing tip   as now
// Families: pulseHistory 46/957/5042 -> 45/1027/5331, regionalLog 2/4/189 -> 2/4/158; chronicle and timeline hold. Totals
// 59/976/5250 -> 58/1046/5508 (one identity out, none in; 39 surviving rows move a count); bytes 7669 -> 7523; digest
// 7c53b1cd -> afddb136. The regional root reach 0..11 holds.
// ── RE-RECORDED 2026-11-08 AT MERGE-CAR (the people car merged into the integration branch, 8dff691f3; re-keyed by identity with
// its cause), IN THE SAME ACT AS THE NEWS-VOICE AND NEWS-HEADLINE CONTRACTS (the 3d50676bb / 4e010ec54 door; ONE corpus build per
// tree, this library's own functions). The car parent 373a2947b reproduces every frozen figure below EXACTLY (37469; 399/2518/400;
// 81/81; 58/1046/5508; 7523; afddb136) and the integration parent 7b3ffb6ee its own MERGE-R2 pins (26701; 266/1598/266; 86/86;
// 59/976/5259; 7669; 4c5a458d). The merge 8dff691f3 and the working tree (75a9da9bc) read, byte-equal: scalarRows 37469 → 37359,
// wizardNews final/accumulated/unique 399/2518/400 → 395/2511/396, regional 81/81 HOLDS. THE SHAPE HOLDS: 58 identities, none in or
// out; ONE row moves a count: pulseHistory[].timeTicks[].summary[] 38/804 → 41/804 (the integration parent's own 41/804).
// pulseHistory 45/1027/5331 → 45/1030/5331; regionalLog, chronicle and timeline hold. Totals 58/1046/5508 → 58/1049/5508; bytes
// 7523 → 7523 (digit widths); digest afddb136 → 2bb92026. Reach 0..11 holds. ATTRIBUTION: the car's re-dealt cast × the rung-2
// landing's pool census (−4 applied|tradition introductions and three more time-tick spellings, each at the integration side's
// measured value), PLAUSIBLE, not bisected.
// ── RE-RECORDED 2026-11-08 AT MERGE-WAVE's FIX-PUBLIC-VEIL MERGE POINT (7e65c7bec; the brief §0.6: the news family re-recorded in
// ONE act, PEOPLE-1's precedent), the cause the veil lane's own: a veiled face's opaque id re-deals its keyed forks, which moves
// the corpus's AO-0 year (the lane left these walkers red for this act). ONE corpus build at the merged tip, each library's own
// functions (the voice throw disabled in an untracked scratch copy only). scalarRows 37359 → 37103; wizardNews 395/2511/396 →
// 390/2486/391 (equal to the observed-shape walker's rung-35 pin); regional 81 → 82. Two identities ARRIVE (58 → 60).
// ── RE-RECORDED 2026-11-09 AT MERGE-TRAIN's ALLEGIANCE-CAR1 MERGE POINT (e5f88930b, car 1 = lane/allegiance-car1-2026-11-08 at
// 7395b5dab; the news family re-recorded in ONE act, MERGE-WAVE's 460b1b0d9 form), the cause car 1's own generator moves re-dealing
// the corpus's AO-0 year: the hidden allegiance (5902f1a4a, dealt at the seam on its own keyed forks) and chiefly J-19 (d131ab158:
// ensureNpcStates reads the hidden allegiance, so the lit pulse's knowledge desk changes; herald 443 → 450 on its lane). ONE corpus
// build at the merged tip, each library's own functions (the voice throw disabled in an untracked scratch copy only). scalarRows
// 37103 → 37664; wizardNews 390/2486/391 → 396/2525/396 and regional 82/82 → 80/80 (equal to the observed-shape walker's rung-36
// pin). Identities HOLD at 60, two in and two out: pulseHistory[].consequenceOutcomes[].proposalPayload.reason 1/1 and
// pulseHistory[].warAuthorityVerdicts[].kind 1/3 ARRIVE; pulseHistory[].selectedOutcomes[].metadata.resourceTaxonomy.{kind,type} 1/1
// each LEAVE (the resource_depletion home's). pulseHistory 47/1050/5341 → 47/1040/5336 (20 surviving rows move a count; the
// headline lanes selected 96/164 → 97/164, mechanical 26/50 → 25/50, consequence 79/188 → 78/187; corruptionEvents[].kind 1/22 →
// 2/31); regionalLog 2/8/169 → 2/4/153 (changes[].kind 7/87 → 3/73, sourceEvent.type 1/82 → 1/80); chronicle and timeline hold.
// Totals 60/1073/5529 → 60/1059/5508; bytes 7823 → 7798; digest f207dcfb → 8a4abd46. Reach 0..11 holds.
// ── RE-RECORDED 2026-11-09 AT MERGE-TRAIN's ALLEGIANCE-CAR2 MERGE POINT (f51058995, car 2 = lane/allegiance-car2-2026-11-08 at
// 46715e751; record 2, rung 37; the news family re-recorded in ONE act, 460b1b0d9's form), the cause car 2's own: the guild's push
// (bbb1a4abc, GUILD_PUSH_TUNING / guildPushOf, the one draw line in rankPowers) re-deals the corpus's AO-0 year, with A6 the hall
// (ce90cf16e) and the capture rows read from the one state (aca93cbc5) beside it (docs/allegiance/ALLEGIANCE_CAR2_2026-11-08.md §4).
// ONE corpus build at the merged tip (562582982), each library's own functions (the voice throw disabled in an untracked scratch copy only).
// scalarRows 37664 → 37801; wizardNews 396/2525/396 → 396/2535/396 and regional 80/80 → 81/81 (equal to the observed-shape walker's
// rung-37 pin). Two identities ARRIVE (60 → 62), none leave: pulseHistory[].selectedOutcomes[].metadata.resourceTaxonomy.{kind,type}
// 1/1 each (the resource_depletion home's return). pulseHistory 47/1040/5336 → 49/1056/5362 (13 surviving rows move a count; the
// headline lanes selected 97/164 holds, mechanical 25/50 → 26/52, consequence 78/187 → 79/189); regionalLog 2/4/153 → 2/8/164
// (changes[].kind 3/73 → 7/83, sourceEvent.type 1/80 → 1/81); chronicle and timeline hold. Totals 60/1059/5508 → 62/1079/5545;
// bytes 7798 → 8098; digest 8a4abd46 → 141be9b3. Reach 0..11 holds.
// ── RE-RECORDED 2026-11-09 AT MERGE-TRAIN's ALLEGIANCE-CAR3 MERGE POINT (c6ded8e3a, car 3 = lane/allegiance-car3-2026-11-08 at
// 6ea8fb318; record 3, rung 38; the news family re-recorded in ONE act, 460b1b0d9's form), the cause car 3's own: e9070d614
// ALLEGIANCE_TUNING.organizedCrime 0.10 → 0.05 re-deals the corpus's AO-0 year (bisected by the OSR seat as the one generator cause;
// 8567f490d and 2f89aaeef are fence-only; docs/allegiance/ALLEGIANCE_CAR3_2026-11-08.md §8). ONE corpus build at the merged tip
// (5f8f76238), each library's own functions (the voice throw disabled in an untracked scratch copy only).
// scalarRows 37801 → 37645; wizardNews 396/2535/396 → 394/2525/395, regional 81/81 HOLDS (equal to the observed-shape walker's
// rung-38 pin). Identities 62 → 64, four in and two out: {consequenceOutcomes,selectedOutcomes}[].metadata.warRulingRead.{kind,reason}
// 1/1 each ARRIVE; selectedOutcomes[].metadata.resourceTaxonomy.{kind,type} 1/1 each LEAVE. pulseHistory 49/1056/5362 → 51/1063/5356
// (35 surviving rows move a count; the headline lanes selected 97/164 → 97/165, mechanical 26/52 → 25/50, consequence 79/189 →
// 81/188); regionalLog 2/8/164 → 2/4/158 (changes[].kind 7/83 → 3/77, sourceEvent.type 1/81 holds); chronicle and timeline hold.
// Totals 62/1079/5545 → 64/1082/5533; bytes 8098 → 8401; digest 141be9b3 → 9bd27a79. Reach 0..11 holds.
const EXPECTED_CORPUS = Object.freeze({
  scalarRows: 37645, canonEventLogEntries: 1, wizardNewsFinalEntries: 394,
  wizardNewsAccumulatedEntries: 2525, wizardNewsUnique: 395, pulseHistory: 12,
  regionalEventLog: 81, regionalEventLogUnique: 81, aiChronicle: 1,
});
const EXPECTED_REGIONAL_ROOTS = Object.freeze([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
const EXPECTED_FAMILY_TOTALS = Object.freeze([
  { family: 'chronicle', identities: 7, distinctValues: 7, occurrences: 7 },
  { family: 'pulseHistory', identities: 51, distinctValues: 1309, occurrences: 5356 },
  { family: 'regionalLog', identities: 2, distinctValues: 4, occurrences: 158 },
  { family: 'timeline', identities: 4, distinctValues: 8, occurrences: 12 },
]);
// 2026-10-02 (THE VOICE PROGRAM wave 1, the owner: "Updates like these need to reflect actions not to potential"):
// distinctValues 1002 → 1019, ONE FAMILY MOVING: pulseHistory 979 → 996. Identities (61) and occurrences (5178) hold, so
// no record was added or lost; six rows change only how many distinct strings they carry. The three HEADLINE rows grow
// (+6, +7, +9: both towns named, a deed per kind) and the three SUMMARY rows shrink (−1, −3, −1: the NPC line now states
// the aim alone, its move having gone to the headline). EXPECTED_ROWS_BYTES holds at 8000 by digit-width coincidence again;
// the digest below is the pin that convicts.
// 2026-11-09 (STYLE-2-PULSE-FOLLOWUP, ruling C2; RE-RECORDED at 4edce0c76 through this library's own functions, one corpus
// build per tree in an untracked scratch test): the clean worktree at bd07005b9 reproduces every frozen figure EXACTLY
// (37645; 394/2525/395; 81/81; 64/1082/5533; 8401; 9bd27a79). At the lane's tip the corpus, the 64 identities and every
// occurrence HOLD; FIVE rows move a distinct count only, all npcAgency's candidate reasons, which now carry four tellings
// seeded on npc id + move (930b611cd, the refusal line: a single telling held its frame at the old rate):
// pulseHistory[].consequenceOutcomes[].reasons[] 69 → 128, impactDigest[].reasons[] 77 → 146, mechanicalOutcomes[].reasons[]
// 17 → 46, mechanicalRumorSeeds[].reasons[] 16 → 36, selectedOutcomes[].reasons[] 77 → 146. pulseHistory 51/1063/5356 →
// 51/1309/5356; totals 64/1082/5533 → 64/1328/5533; bytes 8401 → 8404 (digit widths); digest 9bd27a79 → bc2f448a.
const EXPECTED_TOTALS = Object.freeze({ families: 4, identities: 64, distinctValues: 1328, occurrences: 5533 });
const EXPECTED_ROWS_BYTES = 8404; // MERGE-WAVE (FIX-PUBLIC-VEIL merge): 7523 → 7823, two identities arrive; MERGE-TRAIN (ALLEGIANCE-CAR1 merge): 7823 → 7798, two in and two out; (ALLEGIANCE-CAR2 merge): 7798 → 8098, two in; (ALLEGIANCE-CAR3 merge): 8098 → 8401, four in and two out; STYLE-2-PULSE-FOLLOWUP: 8401 → 8404, distinct counts only
const EXPECTED_ROWS_SHA256 = 'bc2f448a77c4449c70fd891610c2e5ee4f73f280960c07e46e4cdb0823bbd1d0';
const codepoint = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const identityOf = (row) => `${row.family}\0${row.path}\0${row.field}`;

function exactKeys(value, keys, label, ordered = false) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object`);
  }
  const actual = Object.keys(value);
  if (ordered ? !same(actual, keys) : !same(actual.sort(codepoint), [...keys].sort(codepoint))) {
    throw new Error(`${label} must have exactly keys ${keys.join(', ')}`);
  }
  return value;
}

function count(value, label, positive = false) {
  if (!Number.isSafeInteger(value) || value < (positive ? 1 : 0)) {
    throw new Error(`${label} must be a ${positive ? 'positive' : 'non-negative'} safe integer`);
  }
  return value;
}

function segmentOf(raw, label) {
  const segment = exactKeys(raw, SEGMENT_KEYS, label);
  if (segment.kind === 'field' && typeof segment.value === 'string' && segment.value.trim()) return segment;
  if (segment.kind === 'index' && Number.isSafeInteger(segment.value) && segment.value >= 0) return segment;
  throw new Error(`${label} is not a lawful typed segment`);
}

function familyOf(row) {
  const path = row.path;
  if (row.root === 'canonEventResult' && row.rootOrdinal === 14
      && path[0]?.kind === 'field' && path[0].value === 'nextEventLog') return 'timeline';
  if (row.root === 'worldState' && row.rootOrdinal === 12
      && path[0]?.kind === 'field' && path[0].value === 'pulseHistory') return 'pulseHistory';
  if (row.root === 'pulseResult' && row.rootOrdinal >= 0 && row.rootOrdinal < 12
      && path[0]?.kind === 'field' && path[0].value === 'regionalGraph'
      && path[1]?.kind === 'field' && path[1].value === 'eventLog') return 'regionalLog';
  if (row.root === 'aiChronicle' && row.rootOrdinal === 15) return 'chronicle';
  return null;
}

function validateRows(rows, label = 'rows') {
  if (!Array.isArray(rows) || rows.length === 0) throw new Error(`${label} must be a nonempty array`);
  let previous = null;
  return rows.map((raw, index) => {
    const row = exactKeys(raw, ROW_KEYS, `${label}[${index}]`, true);
    if (!FAMILIES.includes(row.family)) throw new Error(`${label}[${index}].family is not governed`);
    for (const key of ['path', 'field']) {
      if (typeof row[key] !== 'string' || !row[key].trim() || row[key].includes('\0')) {
        throw new Error(`${label}[${index}].${key} must be a nonblank collision-safe string`);
      }
    }
    if (!OBSERVED_SCALAR_FIELDS.includes(row.field)) throw new Error(`${label}[${index}].field is not observed`);
    count(row.distinctValues, `${label}[${index}].distinctValues`, true);
    count(row.occurrences, `${label}[${index}].occurrences`, true);
    if (row.occurrences < row.distinctValues) throw new Error(`${label}[${index}] has more values than occurrences`);
    const identity = identityOf(row);
    if (previous !== null && codepoint(previous, identity) >= 0) {
      throw new Error(`${label} identities must be unique and codepoint-sorted: ${identity}`);
    }
    previous = identity;
    return row;
  });
}

function totalsOf(rows) {
  return {
    families: new Set(rows.map((row) => row.family)).size,
    identities: rows.length,
    distinctValues: rows.reduce((sum, row) => sum + row.distinctValues, 0),
    occurrences: rows.reduce((sum, row) => sum + row.occurrences, 0),
  };
}

function familyTotalsOf(rows) {
  return FAMILIES.map((family) => {
    const selected = rows.filter((row) => row.family === family);
    return {
      family,
      identities: selected.length,
      distinctValues: selected.reduce((sum, row) => sum + row.distinctValues, 0),
      occurrences: selected.reduce((sum, row) => sum + row.occurrences, 0),
    };
  });
}

export function proseFamilyRowsSha256(rows) {
  return createHash('sha256').update(JSON.stringify(validateRows(rows))).digest('hex');
}

export function deriveProseFamilyContract(scalarRows, scalarMeta) {
  if (!Array.isArray(scalarRows) || scalarRows.length === 0) throw new Error('scalarRows must be a nonempty array');
  exactKeys(scalarMeta, META_KEYS, 'scalarMeta');
  const roots = new Map([...EXPECTED_ROOTS].map(([root]) => [root, new Set()]));
  const selected = []; const exactAddresses = new Set();
  for (const [index, raw] of scalarRows.entries()) {
    const row = exactKeys(raw, ['root', 'rootOrdinal', 'path', 'value'], `scalarRows[${index}]`);
    if (typeof row.root !== 'string' || !row.root.trim() || !EXPECTED_ROOTS.has(row.root)) {
      throw new Error(`scalarRows[${index}].root is outside the AO-0 topology`);
    }
    count(row.rootOrdinal, `scalarRows[${index}].rootOrdinal`);
    roots.get(row.root).add(row.rootOrdinal);
    if (!Array.isArray(row.path) || row.path.length === 0) throw new Error(`scalarRows[${index}].path is empty`);
    row.path.forEach((segment, offset) => segmentOf(segment, `scalarRows[${index}].path[${offset}]`));
    const family = familyOf(row); if (!family) continue;
    if (row.value !== null && (typeof row.value !== 'string' || !row.value.trim())) {
      throw new Error(`scalarRows[${index}].value must be null or a nonblank string`);
    }
    const fields = row.path.filter((segment) => segment.kind === 'field').map((segment) => segment.value);
    if (fields.some((field) => ['.', '[', ']'].some((delimiter) => field.includes(delimiter)))) throw new Error(`scalarRows[${index}] has a delimiter-bearing field`);
    if (fields.some((field) => VOLATILE_SCALAR_KEYS.includes(field))) throw new Error(`scalarRows[${index}] selects a volatile field`);
    const field = [...fields].reverse().find((name) => OBSERVED_SCALAR_FIELDS.includes(name));
    if (!field) throw new Error(`scalarRows[${index}] has no observed scalar field`);
    if (family === 'timeline' && (row.path[1]?.kind !== 'index' || row.path[1].value !== 0)) throw new Error('timeline must reach exact entry index 0');
    if (family === 'pulseHistory' && (row.path[1]?.kind !== 'index' || row.path[1].value >= 12)) throw new Error('pulseHistory must reach exact record indexes 0..11');
    if (family === 'regionalLog' && row.path[2]?.kind !== 'index') throw new Error('regionalLog must reach a typed event index');
    if (family === 'chronicle' && (row.path[0]?.kind !== 'index' || row.path[0].value !== 0)) throw new Error('chronicle must reach exact entry index 0');
    const typed = JSON.stringify(row.path.map(({ kind, value }) => [kind, value]));
    const address = `${row.root}\0${row.rootOrdinal}\0${typed}`;
    if (exactAddresses.has(address)) throw new Error(`duplicate exact scalar address ${address}`);
    exactAddresses.add(address);
    const path = row.path.map((segment) => (segment.kind === 'index' ? '[]' : segment.value))
      .reduce((out, part) => (part === '[]' ? `${out}[]` : out ? `${out}.${part}` : part), '');
    selected.push({ family, path, field, value: row.value, source: row });
  }
  for (const [root, expected] of EXPECTED_ROOTS) {
    const actual = [...roots.get(root)].sort((a, b) => a - b);
    if (!same(actual, expected)) throw new Error(`${root} root ordinals drifted: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
  const pulseIndexes = new Set(selected.filter(({ family }) => family === 'pulseHistory').map(({ source }) => source.path[1].value));
  const regional = selected.filter(({ family }) => family === 'regionalLog');
  const regionalRecords = new Set(regional.map(({ source }) => `${source.rootOrdinal}\0${source.path[2].value}`));
  if (!same([...pulseIndexes].sort((a, b) => a - b), [...Array(12).keys()])) throw new Error('pulseHistory record reach is not exactly 0..11');
  if (regionalRecords.size !== scalarMeta.regionalEventLog || scalarMeta.regionalEventLog !== scalarMeta.regionalEventLogUnique) throw new Error('regionalLog record reach disagrees with scalar meta');
  const regionalRoots = [...new Set(regional.map(({ source }) => source.rootOrdinal))].sort((a, b) => a - b);
  if (!same(regionalRoots, EXPECTED_REGIONAL_ROOTS)) {
    throw new Error(`regionalLog root reach is not exactly ${JSON.stringify(EXPECTED_REGIONAL_ROOTS)}: ${JSON.stringify(regionalRoots)}`);
  }
  for (const rootOrdinal of regionalRoots) {
    const indexes = [...new Set(regional.filter(({ source }) => source.rootOrdinal === rootOrdinal)
      .map(({ source }) => source.path[2].value))].sort((a, b) => a - b);
    if (!same(indexes, [...Array(indexes.at(-1) + 1).keys()])) throw new Error(`regionalLog root ${rootOrdinal} event indexes are not contiguous`);
  }
  const buckets = new Map();
  for (const row of selected) {
    const identity = identityOf(row);
    if (!buckets.has(identity)) buckets.set(identity, { family: row.family, path: row.path, field: row.field, values: new Set(), occurrences: 0 });
    const bucket = buckets.get(identity); bucket.values.add(JSON.stringify(row.value)); bucket.occurrences += 1;
  }
  const rows = [...buckets.values()].map(({ values, ...row }) => ({
    family: row.family, path: row.path, field: row.field,
    distinctValues: values.size, occurrences: row.occurrences,
  })).sort((left, right) => codepoint(identityOf(left), identityOf(right)));
  validateRows(rows);
  const corpus = { scalarRows: scalarRows.length, ...Object.fromEntries(META_KEYS.map((key) => [key, count(scalarMeta[key], `scalarMeta.${key}`)])) };
  const familyTotals = familyTotalsOf(rows);
  if (familyTotals.some((row) => row.identities === 0)) throw new Error('every governed prose family must be nonempty');
  return { corpus, familyTotals, rows, rowsSha256: proseFamilyRowsSha256(rows), totals: totalsOf(rows) };
}

export function validateProseFamilyBaseline(value) {
  exactKeys(value, ['schemaVersion', 'corpus', 'familyTotals', 'rows', 'rowsSha256', 'totals'], 'baseline');
  if (value.schemaVersion !== 1) throw new Error('baseline.schemaVersion must equal 1');
  exactKeys(value.corpus, CORPUS_KEYS, 'baseline.corpus', true);
  for (const key of CORPUS_KEYS) count(value.corpus[key], `baseline.corpus.${key}`);
  const rows = validateRows(value.rows, 'baseline.rows');
  if (!Array.isArray(value.familyTotals) || value.familyTotals.length !== FAMILIES.length) throw new Error('baseline.familyTotals must cover four families');
  value.familyTotals.forEach((row, index) => {
    exactKeys(row, FAMILY_KEYS, `baseline.familyTotals[${index}]`, true);
    if (row.family !== FAMILIES[index]) throw new Error('baseline.familyTotals must be codepoint-sorted and complete');
    for (const key of FAMILY_KEYS.slice(1)) count(row[key], `baseline.familyTotals[${index}].${key}`);
  });
  exactKeys(value.totals, TOTAL_KEYS, 'baseline.totals', true);
  for (const key of TOTAL_KEYS) count(value.totals[key], `baseline.totals.${key}`);
  if (!same(value.familyTotals, familyTotalsOf(rows)) || !same(value.totals, totalsOf(rows))) throw new Error('baseline totals disagree with rows');
  const bytes = Buffer.byteLength(JSON.stringify(rows)); const digest = proseFamilyRowsSha256(rows);
  if (!same(value.corpus, EXPECTED_CORPUS) || !same(value.familyTotals, EXPECTED_FAMILY_TOTALS)
      || !same(value.totals, EXPECTED_TOTALS) || rows.length !== EXPECTED_TOTALS.identities
      || bytes !== EXPECTED_ROWS_BYTES || digest !== EXPECTED_ROWS_SHA256
      || value.rowsSha256 !== EXPECTED_ROWS_SHA256) {
    throw new Error('baseline moved from the immutable AO-5 denominator');
  }
  return value;
}

export function compareProseFamilyRows(liveRows, frozenRows) {
  const live = validateRows(liveRows, 'live rows'); const frozen = validateRows(frozenRows, 'frozen rows');
  const left = new Map(live.map((row) => [identityOf(row), row])); const right = new Map(frozen.map((row) => [identityOf(row), row])); const failures = [];
  for (const identity of new Set([...left.keys(), ...right.keys()])) {
    const actual = left.get(identity); const expected = right.get(identity);
    if (!expected) failures.push(`new ${identity}: live=${JSON.stringify(actual)} frozen=missing`);
    else if (!actual) failures.push(`vanished ${identity}: live=missing frozen=${JSON.stringify(expected)}`);
    else for (const key of ['distinctValues', 'occurrences']) if (actual[key] !== expected[key]) {
      failures.push(`${actual[key] > expected[key] ? 'grown' : 'shrunk'} ${identity}.${key}: live=${actual[key]} frozen=${expected[key]}`);
    }
  }
  if (failures.length) throw new Error(`prose family rows moved:\n${failures.sort(codepoint).join('\n')}`);
  return true;
}
