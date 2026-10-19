# D-PS-r3 — THE PASSAGE, round 3a disposition (Opus 5.5, xhigh; chair 0a2e8bd9 continuing a73343ed), 2026-10-18

Volume: `docs/DESIGN_FP_ARCH_PS.md` (rewritten in place; every change `[CURED 2026-10-18 (fp-final r3) — <id>: …]` or `[REFINED 2026-10-18 (fp-final r3) — …]`). Probe: `cure/D-PS-r3-probe/`. Code of record: master `81f1cd963` (read-only). No suite run.
**Disclosure:** one read-only `git log -1 --format=%h` slipped into a probe command in the master worktree (it printed `81f1cd963`); no other git was run.

## 1. What was read whole
README · COMPILE-COMMON · DISPOSE · BOARD · RULINGS-PL-MN · -AFTER-RESEARCH · -AFTER-COMPILE · CHAIR-NOTES · RULINGS-ROUND1 (+ addendum) · ROUND2 · ROUND2b (+ addendum) · ROUND3 · `skeptic/PS-r2-verify.md` · the PS volume (714 lines). Rows routed to PS read in context in PL/RN/MN/PR/ST/FOLD/CH/PT `*-r2-verify.md`. Sibling text checked at PR §9.1/PR12, ST §4.1/§4.3/S21/l.374, RN1.

## 2. Measurements first (each could have refuted a ruling)
- **PS-r2-13** — CONFIRMED the fail: `beliefMap.js :: groundTruthBelief` writes `allianceLabel: allianceLabel || 'unknown'`; the advance pass feeds it `const trueType = neighbours.get(observerId)?.get(subjectId) || priorRec?.allianceLabel || 'unknown';`; `readBeliefRelationship` returns `b.record.allianceLabel || truthType` — so a belief RECORD can hand the rung `'unknown'`, and a pair with no edge has no declared label at all.
- **A.2 / PS-r2-15** — EXECUTED (`holds.out`, the landed `stepArmyPosition`): the verifier's example reproduces (round-2 clamp mid-hop: position 0.1 → 0.2, drift −1); over 111,540 (tick, node) cases the round-2 clamp applied to an arbitrary node moved the unit forward and refunded a week in 51,486; FREEZE (both clocks +1 on the carried clocks) held position = the prior tick's and drift = +1 in 17,160 / 17,160; BORDER mode admitted only for a node entered this tick (4,056 cases) equals the freeze shift in every case (0 differ, 0 forward). A THEOREM, recorded: the two modes shift the clocks identically; they differ in their admission test and in the place they name.
- **PS-V2** — CONFIRMED `armyTransitKernel.js :: battleInputs` (`groundAdvantage01: clamp01(1 - rec.position01)`, `fatigue01: rec.position01`). EXECUTED (`reroute.out`, the landed `effectiveFieldStrength`): the landed restart raises a rerouted column above its pre-reroute strength in 180,479 of 348,738 cases (worst +76.3%); the literal "fatigue from weeks marched since `sinceTick`" taken as a fraction of the (lengthened) march still RAISES at the reroute instant in 19,746 cases even with ground 0 abroad; a BANKED floor/cap raises in 0; records with no reroute banked read the landed inputs (0 differ). → REFINED the ruling's wording (§3 below).
- **m5 (rng · `fought`)** — CONFIRMED: the kernel receives `rng: rng.fork('army-transit')` (`pulseKernel.js`); `kernel/prng.js :: createPRNG` — `fork: (label) => createPRNG(`${seed}::${label}`)` derives a child without consuming the parent (so a leaf's draws cannot shift COLLISIONS' draws); `resolveFieldBattle` with no rng: `const roll = fork ? clamp01(fork.random()) : 1 - pA; // no rng ⇒ deterministic favourite`; COLLISIONS: `const fought = new Set();` … `if (fought.has(col.aId) || fought.has(col.bId)) continue;`. **NEW HAZARD (measured):** the kernel's write-back rebuilds from the deployments it captured at entry — `const nextDeployments = { ...deployments };` — and `changed` counts only its own ledger, mauled and retreated (`const changed = changedLedger || Object.keys(mauled).length > 0 || retreated.size > 0;`), while the pulse kernel keeps the result only `if (armyTransit.changed)`. A stage that wrote a border battle's loss or recall into the worldState it returns could be overwritten or dropped. Cure: the stage returns `fought · mauled · recalls · changed`; car-0 seeds the kernel's own locals from them (§4.1).
- **A.6 / PL-V5** — CONFIRMED `warCapacityReads.js :: computeAllyRelief`: `relief += (Number(capacityFor(ally)?.homeDefense) || 0) * ALLY_RELIEF_FRACTION;` with `const ALLY_RELIEF_FRACTION = 0.4;`, "an ally under its own siege sends nothing"; ST §4.1 makes relief read `homeDefense − siteDefense`.
- **A.1 (PS's side) — NEW CROSS-VOLUME CONTRADICTION found and cured:** PS §7.5 fought the border battle with B's `homeDefense`, and §14 SITES CONSIDERED claimed "a ready keep stands in B's `homeDefense` and so in the one border battle (§7.5) by construction"; ST §4.1 now puts the keep INTO `homeDefense` (`homeDefense = Math.max(0, offensive − armyAway) + siteDefense`) and says the keep "neither marches nor is drawn" (A.1: ST WINS). A field battle on the road at the border would march the keep. Cure: every PS read of B's strength is B's FIELD FORCE `homeDefense − siteDefense` (the relief idiom; dark ST ⇒ `homeDefense` verbatim).
- **A.14** — CONFIRMED `spatialDigest.js` (module-private): `const pairKey = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);`. PS mints no `a␟b`, no `hashInt`, no `cut01` (grep: 0).
- **A.8 · A.9 · A.10 · A.11 · A.12 · A.15** — grep of PS: `polity_ban` 0, `settlementFundingBand`/`fundingBand` 0, `readiness01`/garrison words 0, `party_voiced` 0, `believedWhereabouts` 0, `paragonLean` 0 → nothing to cure.

## 3. The record (filled as the volume is cured)
**Counts: disposed 30 of 30 — CURED 24 · REFUTED 0 · STOP 0 · NOTED 6.** The full table is the volume's §18 round-3 block; the receipts:

| Id | Sev | Disposition | Where (volume) | Receipt |
|---|---|---|---|---|
| PS-r2-15 (= A.2) | M fail | CURED as ruled: one helper, BORDER (node entered this tick) / FREEZE (every other hold); order once in §4.1; Bound 2 only where PS lit; no march row outside `passageEnabled` | PS9 · §2.7 · §2.8 · §4.1 · §11 · §12 L4 · §14 · P15 · OD-PS-15/35 | `holds.out`: round-2 clamp forward+refund 51,486/111,540; freeze 0/17,160 bad; border = freeze in 4,056/4,056 |
| PS-r2-12 | M fail | CURED as ruled: occupier excluded from `enemyColumnPresence`; P24 pins no movement | PS12 · §7.5 · P24 · OD-PS-33/19 | PS4's own `foreignSeatOf` test |
| PS-r2-13 | M fail | CURED as ruled: `unknown` / no label → `stranger` | §0.1 · PS3 · PS4 · §2.2 · §15 · P31 · OD-PS-40 | `groundTruthBelief`: `allianceLabel: allianceLabel \|\| 'unknown'` |
| PS-V1 | M new | CURED as ruled: per-kind bounds (8 witnessed / 4 unseen, DRAFT); nine-row fixture | PS8 · §2.8 · L3 · P25 · OD-PS-24/27 | the verifier's eviction arithmetic |
| PS-V2 | M new | CURED, fatigue REFINED (banked floor) | §4.1 step 6 + battle inputs · §2.8 · L4 · P30 · OD-PS-36 | `reroute.out`: landed 180,479 raises (+76.3%); literal fraction 19,746; banked 0 |
| PS-V3 | M new | CURED as ruled: refused `awaiting` hold → one card, `waited` absent | §4.1 · §4.2 · §9 · P5 · P15 · OD-PS-37 · §17 #18 | the volume's own steps 2–3 |
| minor 1 | m | CURED (P7 same-season) | P7 | `pathCost` seasons the cheapest-base route |
| minor 2 | m | CURED (dead text struck) | PS5 · §3 · §4.4 | §4.3 never reads a stranger's width |
| minor 3 | m | CURED (ceiling stated) | PS5 · §3 · §4.4 · P13 | clamp to four bands |
| minor 4 | m | CURED (word rule) | PS2 · §2.6 · §3 · §5.4 · §14 · P4 | §15's register |
| minor 5 | m | CURED + REFINED seam (write-back) | §0.1 · PS11 · §4.1 · §5.2 · §7.5 · P26 · OD-PS-32/41 | `prng.js` fork; `fought`; `nextDeployments = { ...deployments }`; `changed` |
| RN-V6 (= A.4) | M routed | CURED (struck ×3) | PS13 · §7.3 · §14 | RN1 |
| PL-V5 (= A.6) | M routed | CURED, PS's half (defender term; `reliefAnswerOf` at first sight) | PS14 · §7.5 · §11 · §14 · P14 · OD-PS-39 · §17 #17 | `computeAllyRelief` (0.4 × homeDefense); PL r3 text l.236/401/495 |
| PL-V4 | M routed | CURED, PS's side (four prefixes) | §2.1 · PS14 · §7.7 · §14 · §15 | RULINGS-ROUND3 B PL |
| MN-V6 (= A.3) | M routed | CURED, PS's side (shared car; no `menacesEnabled`) | PS12 · §7.5 · §10 · §11 · §14 · P14 | RULINGS-ROUND3 A.3 |
| A.1 | ruling | CURED, PS's side — NEW contradiction found and cured (field force) | §2.3/2.5/2.6/2.7 · §3 · §4.3 · §7.5 · §9 · §14 · P26 · OD-PS-38 | ST §4.1 (`homeDefense = … + siteDefense`; "neither marches nor is drawn") |
| A.2 · A.3 · A.4 · A.6 | rulings | CURED (as above) | — | — |
| A.5 | ruling | CURED (harbouring under `passageEnabled ∧ polityEnabled`) | PS14 · §7.7 · §10 · §11 | — |
| A.7 | ruling | CURED (cite) | §0.2 | — |
| A.13 | ruling | CURED (cite) | PS2 · §14 CH | — |
| A.14 | ruling | CURED (`stretch:<a\|b>`) | §0.1 · PS8 · §9 · §15 | `spatialDigest.js :: pairKey` |
| A.8 · A.9 · A.10 · A.11 · A.12 · A.15 | rulings | NOTED (no PS text; grep 0) | — | grep of PS |

## 4. STOPs
None.

## 5. REFINED (beyond the findings; each marked in the volume)
1. PS9's THEOREM — the border clamp at a node entered this tick equals the freeze shift (+1 week) in every case (executed); the helper keeps one arithmetic behind two admission tests.
2. PS-V2's fatigue rule — a banked floor instead of "weeks marched since `sinceTick`" as a fraction (that fraction falls at a reroute; executed counterexample). Ground follows the ruling as written. Vetoable (OD-PS-36).
3. Car-0's measured seam — the stage returns `fought · mauled · recalls · changed` and battle-input overrides; the kernel seeds its own locals (it writes back from the deployments it captured at entry; its `changed` gates the pulse's keep). OD-PS-41.
4. A reroute inside B's land (a bound carried the unit in) avoids B's nodes AHEAD of it, never the node it stands in.
5. Dark-after-lit for a rerouted column declared (no overrides while dark; the pin binds where PS is lit).
6. Two felt sentences (§17 #17 the joint contest, #18 the refused wait).

## 6. ROUTED — the other halves (not written by this lane)
- **PR** §9.1(b), PR12, R18, OD-PR-19: cite the helper's FREEZE mode and PS §4.1's one order; strike PR's own clock arithmetic and its "after PS's border leaf and WC Arc A's `armies_meet` leaf" order; "counts into the cap" → "where THE PASSAGE is lit". (Already applied in PR's current text — checked l.121/374/559/689/748.)
- **ST** S21, §4.3, OD-ST-14: "where THE PASSAGE is lit"; FREEZE mode on the stretch; and the §6 readers table (l.374) should list PS's FIELD-FORCE read (`homeDefense − siteDefense`, the relief idiom) beside `computeAllyRelief`, so the coverage walker sees no parallel number. (S21/§4.3 already applied, l.283/435; the l.374 row is not.)
- **PL** §4.3 / P42 / P45: the member's side of the border contest is its FIELD FORCE `homeDefense − siteDefense` (PS §2.5, A.1), not `homeDefense` — P45 says "M's `homeDefense` plus H's share"; PL registers `patrol:`/`corps:` and extends P40 (PL-V4).
- **MN** §3.3 / §8: narrow "the danger term" to MN's feeder rows and cite THE SHARED PRESENCE CAR (A.3); MN already cites PS12's feeder "as PS12 defines it", so the occupier exclusion propagates by cite.
- **FOLD** (P4): the §3.4 rows for `passage_request` (A's line when its unit stands `awaiting` at a bound) and `passage_at_the_border` (the refused-hold climax); §6's shared-presence-car builder note (first of C14 · C15 · C16 · C10); WC's `armies_meet` = FREEZE mode, Bound 1 only; the §5 rows for `stretch:<a|b>`, `border · freeze`, `PASSAGE_UNSEEN_ROWS_CAP`, `fatigueFloor01`, `groundCap01`.
- **WC** (Arc A, the fold's inbox): `armiesMeetLeaf` holds by the FREEZE mode, fourth in PS §4.1's order.

## 7. Open questions for the chair
None blocking. OD-PS-36 (the banked fatigue floor) and OD-PS-38 (the keep stays out of the border battle) are the two vetoable calls this round made beyond the letter of a ruling.

## 8. Cross-volume check (no new contradiction)
Grepped PR, ST, PL, MN, the fold, RN, CH, PT for the touched text: `stretch:<a|b>` agrees (PR l.148/151, ST l.182/327); the freeze mode and the one order agree (PR, ST round-3 text); PL's round-3 `reliefAnswerOf` mechanism adopted verbatim in PS §7.5; no sibling claims court fame (RN-V6's census); the one residue is PL P45's "M's `homeDefense`" (routed above).

## 9. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: the hold theorem and the round-2 clamp's failure (`holds.out`); the reroute strength pin and both counterexamples (`reroute.out`). CONFIRMED by read at `81f1cd963`: `groundTruthBelief`, `readBeliefRelationship`, `battleInputs`, `resolveFieldBattle`'s no-rng favourite, `prng.js` fork, the kernel's `fought`/`mauled`/`nextDeployments`/`changed`, `computeAllyRelief`, `pairKey`, the round-3 token census (0 hits). PLAUSIBLE: the car-0 line budget for the seeded locals (≤ 2 new lines inside ~40 freed); PL's "polity stage after army transit" ordering (PL's measurement, cited, not re-run); the build-time STOPs S-a, S-e, S-f unchanged.
