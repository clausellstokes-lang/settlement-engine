# D-PR-r3 — the round-3a disposition of THE PATROLS (`docs/DESIGN_FP_ARCH_PR.md`)

Seat: disposition lane D-PR-r3 (Opus 5.5), chair session a73343ed continued by chair 0a2e8bd9, 2026-10-18 (start 17:19 EDT by `date`). Read whole: the kit README, BOARD, COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (+ addendum), RULINGS-ROUND2, RULINGS-ROUND2b (+ addendum), RULINGS-ROUND3; `skeptic/PR-r2-verify.md`; the rows the other eight `*-r2-verify.md` route to PR (grep, read in context); `cure/D-PR-r2.md`; the volume (802 lines, mtime 08:33). Pre-cure copy kept byte-for-byte at `cure/D-PR-r3-probe/DESIGN_FP_ARCH_PR.pre-r3.md`. Code of record: master `81f1cd963` (read-only). ⚠ Process note: one read-only `git -C <master worktree> log -1 --format=%h` was run at orientation to confirm the worktree's head (`81f1cd963`); no state changed; no other git; no test suite.

## 1. What I measured first (each CONFIRMED by reading the cited symbol at master `81f1cd963`, or EXECUTED)

(a) **The feasibility gates read `fromCap` before the seed (PR-V1).** `worldPulse/warDeployment.js :: evaluateWarLayer`: "`const fromCap = capacityFor(fromId);`" is taken once, BEFORE the coalition gate ("`classifyFeasibility({ attackerCurrent: fromCap.offensive, …`") and BEFORE the solo target loop ("`for (const targetId of coalitionDecision ? [] : intentTargetOrder(…))`"), whose `CONQUEST_MARGIN` prefilter reads "`fromStrength * casusMult * mediation <= strengthFor(targetId) + CONQUEST_MARGIN`" (`fromStrength = strengthFor(fromId)`, `warCapacityReads.js :: buildStrengthLookup` — a `settlementStrength` index, a different scale from `offensive`) and whose gate reads "`attackerCurrent: fromCap.offensive`"; only after `chosenTarget` is the record seeded ("`const seededRecord = seedDeploymentState({ targetId: chosenTarget, cap: fromCap, …`"). CONFIRMED: the gates judge the undrawn army. The draw needs only the court's kept riders (the envelope and its posture), which is target-independent, so it can be taken right after `fromCap`.

(b) **The deployment normalizer keeps every field (PR-V7).** `worldPulse/worldState.js :: normalizeDeployments`: "`const next = { ...record };`" then field-specific fail-closed blocks for `casusReasons` and `joinLedger` ("malformed, empty, or multi-row imports disappear fail-closed"). CONFIRMED: the r2b sentence "the war ledger's normalizer keeps a finite non-negative pair, else drops it" was false; the landed idiom for a validated additive field is one such block.

(c) **The leg's progress is LEG-wide (PR-V8).** `worldPulse/namedPersonTransit.js :: namedPersonPathPosition`: "`const nodeIndex = Math.max(0, Math.min(last, Math.floor(alongStoredPath * last)));`" with `alongStoredPath` the leg's `progress01`. EXECUTED (`D-PR-r3-probe/arith.out` (4)): on a 4-node leg the hop-local test and the leg-fraction test `progress01 < (hopIndex + cut01) / last` agree at every tick.

(d) **The landed key and hash helpers (PR-V9, A.14).** `spatial/distanceRead.js :: pairKey`: "The codepoint-stable unordered pair key (matches the digest's routeReceipts keys)" — "`` return a < b ? `${a}|${b}` : `${b}|${a}`; ``"; `roads/seaRoads.js :: classifyLegModes(digest, path)` "Returns one entry per hop … 'land'|'sea'" (same `a|b` form); `kernel/proseHash.js :: fnv1a32` (unsigned 32-bit; imported by the decision module `worldPulse/treatySuccessionDecision.js` for a key, the precedent for a non-prose use); `region/contestMath.js :: hash01` "a value in [0, 1)". No `hashInt` exists. CONFIRMED.

(e) **Shares (PR-r2-3) and the harassment trigger (PR-V3).** EXECUTED `D-PR-r3-probe/arith.mjs` → `arith.out` (1)(2) on the verifier's own 60-row grid: the round-3 rule `kept = max(ceil(max × CAMPAIGN_SHARE), min(max, ceil(max × peaceShare) + 1))` gives campaign BELOW peace in 0 rows (was 12), EQUAL in 15 (every one with peace already at `max`), ABOVE in 45. The old harassment trigger ("`fielded` at `max`") fired in 15 rows, 3 of them by rounding alone (a bold or median court with one or two riders); the bare fork (`peaceShare > PEACE_SHARE`) fires in 36. `harass.mjs` → `harass.out`: 6 of those 36 are courts fielding EXACTLY the riders a median court of the same envelope fields (a one- or two-rider town) — the refinement below gates the input on the riders the posture actually adds (30 rows fire).

(f) **The rider-time allocation (the carry).** EXECUTED `arith.out` (3): the round-3 allocation (standing riders weekly; rovers cycling blocks at period 4, else 13; slots ordered by `fnv1a32` of the half and the power; a rover's empty slot is home) over n 0..12 × H 1..9 for 208 weeks: 0 weeks with more rider-places than riders; 0 halves whose presence differs from its word's exact period (weekly 208/208, four-weekly 52/208, thirteen-weekly 16/208); `never` only at n = 0.

(g) **Sibling texts read at 17:24 EDT** (round-3a lanes may still change them): PS9 / §4.1 (the ONE hold helper `holdBeforeNode`; the registrant order "border → THE SITES' approach-fort leaf → THE PATROLS' screen leaf → WC Arc A's `armiesMeetLeaf`"); PS §2.1 l.131 (`unitKey = 'patrol:' + detachmentId`); PS l.343 (the `patrol:`/`corps:` prefixes routed to PL); ST §3.3 l.225 and §3.4 l.240 (the "0 while THE PATROLS are lit" clauses A.1 strikes); ST §2.4 `settlementFundingBand`; MN §3.3 l.181 (`σ(T) = min(0.25, siteSuppression(T) + patrolSubtraction(T))`); PT l.287 ("A `party_warrant` served or a `party_ambush` laid on a road is carried by a DETACHMENT…", the warrant half struck by RULINGS-ROUND3 B PT); CH §2.2 l.207 (`paragonLean(worldState, settlementId, domain, side) → { mult, reason, wnpcIds } | null`); PL l.231 / P44 (the riders inside PL-5's summons).

## 2. The record table

Disposed **39 of 39: cured 33 · refuted 0 · stop 0 · noted 6.** Every id is bracketed `[CURED 2026-10-18 (fp-final r3) — <id>: …]` at the changed passage (81 bracketed lines) and appears once in the volume's §20 round-3a block. Every markdown table in the volume re-checked by script: 0 rows whose unescaped-pipe count differs from its header (four cells needed `\|` escapes, one of them pre-existing at §0.1).

| Id | Sev | Disposition | Where (volume) | Receipt |
|---|---|---|---|---|
| PR-r2-3 (FAILED r2b) | B | CURED — `kept = max(ceil(max × CAMPAIGN_SHARE), min(max, ceil(max × peaceShare) + 1))` | PR2 · §3.2 · §9.1(e) · R8 · OD-PR-4 | EXECUTED `arith.out` (1): below-peace 12 → 0 of 60; equal 15 (all with peace at `max`) |
| PR-r2-8 (FAILED r2b) | M | CURED (A.1) — keep's garrison the site's own; its rows stand lit or dark; one cap, one clamp; `fortWill` and the yielding struck; sentence 9 restated | §0.2 · §2.2 · §3.1 · §6.2 · §6.3 · §9.1 · §10.5 · §15.1 · §18 · R8 · R34 · OD-PR-3/30/41 | A.1; ST §4.1 "neither marches nor is drawn"; ST l.273 already r3-cured to "the SITE's own complement" (read 17:24) |
| PR-V1 | M | CURED — the draw right after `fromCap`, read by both `classifyFeasibility` calls, the prefilter (`drawShare01`) and the seed; +1 host line | PR3 · PR16 · §0.1 · §2.6 · §6.6 · §12 · §14 · R9 · OD-PR-5 | §1(a): `fromCap` l.1042 precedes the coalition gate l.1052, the loop's prefilter l.1104 and gate l.1106, and the seed l.1127 |
| PR-V2 | M | CURED on PR's side (A.1); MN's citation routed | §6.3 · §10.5 · R34 · OD-PR-41 | A.1: "MN M53 STANDS as pinned (0.20 + 0.15 under the cap → raid part 0.35)" |
| PR-V3 | M | CURED + REFINED — the fork or the DM's standing order triggers; sized by riders added | PR17 · §3.2 · §7.5 · §11.1 · §12 · R35 · OD-PR-33 | EXECUTED `arith.out` (2): old trigger 15 rows (3 by rounding alone); `harass.out`: bare fork 36, of which 6 add no rider; refined 30 |
| PR-V4 | m | CURED — "+0.3" cover identity struck | §8.1 · §8.2 · §10.5 · R15 · OD-PR-40 | ES §3.2 `covertCompetence01` is the only covert skill; no "declared class" in ES or master |
| PR-V5 | m | CURED — `pendingCadence · pendingSince`; switch whole | §2.3 · §2.7 · §16.1 · R31 | — |
| PR-V6 | m | CURED (A.9) | §3.1 · §15.2 · OD-PR-3 | ST §2.4 `settlementFundingBand` |
| PR-V7 | m | CURED — own normalizer block (+1 in `worldState.js`, 351 eff) | PR16 · §2.7 · §14 · §16.1 | §1(b) |
| PR-V8 | m | CURED — leg fraction; half-keyed `watchOf` | §2.2 · §2.6 · §6.4 · §6.5 · §8.1 | §1(c); EXECUTED `arith.out` (4) |
| PR-V9 | m | CURED (A.14) | PR4 · §2.2 · §2.3 · §14 | §1(d) |
| PR-V10 | m | CURED — the KEPT count, never above | PR2 · §3.2 · R36 · OD-PR-4 | — |
| PR-V11 | m | CURED — `riders_seen` (and `clash`) triggers | §4.1 step 6 | — |
| the carry (§2.3 vs PR1) | — | CURED — rider-time allocation | PR1 · PR4 · §2.3 · §2.7 · §4.1 · §12 · R3 · R31 · OD-PR-6/42 | EXECUTED `arith.out` (3): 0 violations, 0 off-period halves (117 cases × 208 weeks) |
| PS-r2-15 (PR's half) | M | CURED (A.2) — freeze mode; PS §4.1's one order; Bound 2 only with PS lit | PR12 · §9.1(b) · §14 · R18 · OD-PR-19 · §15.1 | PS9 / §4.1 read 17:24 (order border → fort → screen → `armies_meet`) |
| MN-V6 (routed by A.3) | M | CURED on PR's side — the shared composer; PR-1 builds it if first | PR5 · §6.1 · §12 · §14 · §15.1 · OD-PR-43 | A.3 |
| SEAMS-r2-7 (PR's echoes) | M | CURED on PR's side — the landed exit law | §6.1 · §14 · R5 · §15.1 | `embattlement.js :: stepEmbattlement` exit line; `EXIT_THRESHOLD` 0.3, `MIN_DWELL_TICKS` 6 (read) |
| ST-r2-verify note 2 | m | CURED (= PR-V6) | §3.1 · §15.2 | — |
| FOLD-r2-verify minor (map rule) | m | CURED on PR's side — the host's ASK | PR14 · §2.3 · §13 | fold §3.1.26 ↳ r2b |
| PL-V4 (PR's sentence) | M | CURED on PR's side | §10.3 · §15.1 | PL7 (PL l.88); PS l.131 `'patrol:' + detachmentId` |
| PL-r2-verify minor (§15.12) | m | CURED in PR's echo | PR14 | — |
| RULINGS-ROUND3 B (PT row) | — | CURED — warrant at the town; ambush on the road | PR19 · §8.2 · §11.2 · §15.1 · R33 | PT l.274 (`party_warrant` card's place "the court's town") |
| A.1 · A.2 · A.3 | — | CURED (as above) | — | — |
| A.4 | — | CURED — a court's deed is a tale | §9.3 | RN1 |
| A.5 | — | CURED — `polityObligationsEnabled` | §10.3 · §12 | — |
| A.6 | — | NOTED — not PR's | — | PR has no liege `sent` text |
| A.7 | — | CURED — corps foe; site never an actor | §11.2 | — |
| A.8 | — | NOTED — PR mints no ban key | — | §8.1 reads the landed edge only |
| A.9 | — | CURED (= PR-V6) | — | — |
| A.10 | — | CURED — band words never a garrison's | §15.2 | — |
| A.11 · A.12 · A.13 | — | NOTED — not PR's / 0 hits / land-only rounds | — | `rg` on the volume |
| A.14 | — | CURED | §2.1 · §2.2 · §2.3 · §2.7 · §11.1 · §13 · OD-PR-34/40 | §1(d); digest gates `{ between, cellA, cellB, cost }` (`spatialDigest.js`, read) |
| A.15 | — | CURED — `paragonLean`'s `{ mult }` | §10.5 · OD-PR-30 | CH §2.2 l.207 |
| hold-note SEAMS-r2-9 / OD-PR-41 | — | CURED — settled by A.1 | OD-PR-41 · §19 | — |
| hold-note `slowShare` | — | NOTED — stays PLAUSIBLE | §6.3 | — |

## 3. STOPs
None.

## 4. Open questions for the chair (also the volume's §19; none blocking)
1. The rider-time allocation's "first half always stands" (OD-PR-42): a one-rider town walks one road only; the alternative spreads it every four weeks and drops "the army's road first".
2. The harassment's excess gate (§7.5, REFINED): strike it and the bare fork grieves a wary one- or two-rider town that fields exactly a median town's riders.
3. The prefilter's `drawShare01` (§6.6): PLAUSIBLE that `settlementStrength` tracks `offensive`; PR-1's car-0 measures it.

## 5. Routes (other volumes' halves; none edited by this lane)
- **PS** — PS9/§4.1: the helper's FREEZE mode beside the border clamp, the one order written once (A.2), Bound 2 "where THE PASSAGE is lit"; §4.1's screen-leaf parenthetical names only "an army marching on the riders' OWN town" — PR's screen also covers a crossing toward a third town (RULINGS-ROUND2b Q1) (minor).
- **ST** — strike "fortification — 0 while THE PATROLS are lit" (§3.4, l.240) and "this 0.20 reads 0" (§3.3, l.225); OD-ST-39's row (l.608) still says the fort's suppression "yields"; S21 prefixed "where THE PASSAGE is lit" (A.2).
- **MN** — M50/M53 cite ST's `σ`; MN5 "never latches"; §3.3's "registered into MN's leaf by whichever commit lands second" → the shared composer (A.3).
- **PT** — strike "A `party_warrant` served … on a road" (PT l.287).
- **PL** — register `patrol:` and `corps:` in `FEALTY_EPISODE_PREFIXES`, extend P40 (PL-V4).
- **CH** — the "ride with the watch" weight row (CH §4.4) read through `paragonLean` (A.15); CH's §17 note on `fundingBandOfSettlement` (l.1025) is moot.
- **The fold (P4)** — §6's builder note for the shared composer and OD-FC-46 ↳ (3) "three feeders" (A.3); fold l.328's "road suppression YIELDS to those riders" and its OD-PR-41 alternative are superseded by A.1 (a bracket); the §5 cadence row as an ASK; the §5 register gains PR's round-3 tokens and `stretch:<a|b>` (A.14); the map-side INBOX row for a gate fraction on the digest (`cut01`).

## 6. REFINED beyond the findings (each marked where it sits)
(1) the harassment's excess gate (§7.5); (2) the first half always stands (§2.3, OD-PR-42); (3) `first`/`avoid` on `round` name the count's dial (§11.1, PR17); (4) the notice stream's two spellings agreed (§14 PR-3); (5) §9.1(f)'s "a loss the commons feel" restated; (6) the stored `phase` that keeps a held allocation exact through the dwell (§2.7); (7) housekeeping — table-cell pipes escaped, the `pairKey` quote's backticks repaired.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by reading the cited symbol at master `81f1cd963`: §1(a)–(d) (the opener's gate order, `normalizeDeployments`, `namedPersonPathPosition`, `pairKey` / `classifyLegModes` / `fnv1a32` / `hash01`, the digest gate fields, `stepEmbattlement`'s exit law). EXECUTED: `arith.mjs` → `arith.out` (shares, triggers, the allocation, the leg fraction), `harass.mjs` → `harass.out`, `effLines.mjs` → `effLines.out` (`worldState.js` 351, `warDeployment.js` 685, `embattlement.js` 172), the token census `tokens-r3.out`. PLAUSIBLE, never upgraded: every DRAFT constant (UNMEASURED, FP-46); the prefilter's `drawShare01` equivalence; the allocation's fitness on real rounds (PR-5); the sibling texts as read at 17:24 EDT (round-3a lanes may still change them).
