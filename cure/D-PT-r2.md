# D-PT-r2 — DISPOSITION LOG for THE PARTY (`docs/DESIGN_FP_ARCH_PT.md`), P3 round 2 (lane D-PT-r2, chair a73343ed; seat Opus 5.5; 2026-10-18 07:06–07:31 EDT by `date`)

Status: DONE. Input: `skeptic/PT-r1-verify.md` (5 FAILS · 4 NEW MAJOR · 9 unnumbered round-2 carries) + every id RULINGS-ROUND2 routes to PT (A.1–A.6, A.13, B's PT row, §E's standing items). Files owned and written: the volume, this log, `cure/D-PT-r2-probe/`. No git, no test suite. The volume before this lane: `cure/D-PT-r2-probe/PT-before-r2.md` (byte copy at 07:06; 170,830 B, 637 lines) → after: ≈203,300 B, 688 lines; 47 `[CURED 2026-10-18 (fp-final r2) — …]` brackets and 8 REFINED marks (`check-r2.out`: every r2 id has a body bracket; 0 table column mismatches; 0 raw pipes in table code spans).

Read whole, in order: kit README, COMPILE-COMMON, DISPOSE, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH (+ L-PT), RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD (items 1–16), RULINGS-ROUND1 (+ ADDENDUM), RULINGS-ROUND2, `cure/D-PT-r1.md`, `skeptic/PT-r1-verify.md`, the volume. By section: RN §1–§7, §11, §13 (twice — RN's round-2 lane was writing concurrently; the second read at 07:27 is the one this log aligns to), PL §2 (`crownReachAt`, `seatChangedSince`), MN §2.4 / MN14, CH CH12 / §11 / §16, ST §7 coverage rows, PR (PR7, PR8, PR19, §9.3, §13, STOP-PR-2, OD-PR-14/16).

## 1. MEASURED FIRST (code of record: `master-81f1cd963`, read-only; sibling volumes as of this lane's reads)

| # | Question | Receipt | Verdict / bears on |
|---|---|---|---|
| M1 | Do the toggle and a session's deeds share a tick? | `worldPulse/partyImpact.js :: applyPartyImpact`: `const tick = worldState.tick;` (the tick moves only on an advance) | CONFIRMED. PT-r1-1: a tick-only stamp cannot order a toggle and deeds of one session in EITHER direction — B's tie rule fixes "toggle, then deeds" and breaks "deeds, then toggle" |
| M2 | Is the credibility law re-foldable exactly? | `npcCredibility.js`: `SCORE_MAX: 12`, decay `score * halfLifeFactor(age, …)`, `if (age > T.MAX_LOOKBACK_TICKS) return 0;`, `round4`; the fold clamps each delta (`clamp((scores.get(key) \|\| 0) + signedOf(d), -T.SCORE_MAX, T.SCORE_MAX)`, quoted by the r1 skeptic) | CONFIRMED (read). PT-r1-8: deterministic over dated charges ⇒ a replay over the unstruck charges reproduces the holder; subtraction does not (RN's round 2 EXECUTED it: −4.2356 by refold vs −4.1017 by subtraction, `cure/D-RN-r2-probe/r2Probe.out.json` e) |
| M3 | Are weather and the sea already priced? | `spatial/distanceRead.js :: pathCost(digest, fromId, toId, season = null)` reads `activeSeaLanes`, `activeTeleportEdges`, `activeSeasonalOverlay`; `stormSeasonFactor(lanes, season)`; "Dormant (pre-M8/M9c, or a non-modal pair) ⇒ … the land distance EXACTLY (byte-identical)" | CONFIRMED (read). The owner's relayed question ("Regarding weather and Sea route isn't this already in the books?"): YES — TRADE M8 sea lanes with storm seasons and SEASONS-B M3's overlay are landed in the one travel law; PT's journey cites them (§0 row, §8.3) and mints nothing |
| M4 | Does the source event's undo reverse a party impact's world outcomes? | `store/settlementSlice.js`: `if (campaign && !event?.partyCaused) {` guards `captureCanonRelationshipUndo`; `undoLastEvent` reverses "the NON-party relationship ripple" only; `operationRegistry.js :: recordPartyImpact` `undoToken:null, undoState:'none'` | CONFIRMED (read). The verifier's carry 9 is master's behaviour; opened as OD-PT-28 (the chair's decision point) |
| M5 | Tokens minted this round | `census-r2.out` + `census-r2-quoted.out` (zsh with the session `rg`; plain `sh` has no `rg` on PATH — the first run's all-zero output was discarded) | CONFIRMED: `partySeq`, `party_cleared_site`, `party_revealed_site`, `refoldPartyCredibility` 0 everywhere; `party_reached_site` 1 ledger doc (ST's mint); `credited` prose only (25 src word hits, 0 quoted) — used in prose only |
| M6 | RN's live text on the shared seams (07:27, mid-round-2) | RN §2.1 rows (`moralWeight` "REPLACES the derived band for every reader THAT CAN SEE IT"; `correctsRef` "PT's round-1 `voidsRef` is this field", masks "inside the voider's reach"; `actAt`; `party_pledge` `made_good · fell_short`); RN §6.2 "the round-1 credibility scaling of a told reason is withdrawn" (RN-V5(c)); RN §7 Readers "a told reason is no longer scaled by it"; RN §7 "a strike, an unstrike or PT's source-event undo of a charge REBUILDS the holder by refolding"; RN §6.2 "RN-3 lights on its own unit — NO lighting gate" (HOST-r1-7, RULINGS-ROUND2 B) | CONFIRMED (read). This lane first wrote a "crediting test" (credibility gating a told reason) and an owner-row wait on PT-1/PT-2; both were WITHDRAWN to avoid opening a contradiction with RN's round-2 text and with RULINGS-ROUND2 B |
| M7 | PL's seat-change read | PL §2: `seatChangedSince(worldState, settlementId, since)` with a key form and a TICK form ("a tick-less transfer row … counts only when it stands LATER in the tail than a row stamped after `since`") | CONFIRMED (read). Carry 7: PT aligned to the signature and the tick form |
| M8 | MN's place words | MN §2.4: `MENACE_WHERE_KINDS` = `country · road` (+ `site`) | CONFIRMED. Carry 3 |
| M9 | ST / PR rows naming PT | ST §7: "PT (the party) \| BY THE SITE READ — presence at a site, reach and reveal doors, clearing deeds"; "PT's `presentAt` gains `siteId?` … `party_reached_site` … a party clearing a den is a `party_event` deed with the DM's `SITE_HOLDER` act"; PR: ⛔ STOP-PR-2, PR19 "THE PARTY IS NEVER THE TARGET", OD-PR-16 (PT a `believedWatch` consumer), item 18 (map-only until H16) | CONFIRMED (read). §E brackets |
| M10 | PT-V2's arithmetic under the cure | `cure/D-PT-r2-probe/tools/lensOneProbe.py` → `lensOneProbe.out` (RN §6.2 lens one, a 1.0 · b 0.5 · c 0.4) | EXECUTED: the verifier's case reads +0.2268 under round 1's formula and 0.0000 (= unmarked) under round 2's; the orphanage marked `admirable` to a good, lawful, peaceful holder: −0.34 unmarked → +0.038 (round 2; "excusable") |
| M11 | Does CH name `met_in_person`? | `grep -c met_in_person DESIGN_FP_ARCH_CH.md` = 0 at 07:3x (CH's round-2 lane was writing) | CONFIRMED absent; CH's half stays listed |

## 2. THE RECORD — 25 ids: 18 CURED · 0 REFUTED · 0 STOP · 7 NOTED

The verifier's unnumbered carries are `PT-r1v-c1` … `c9` in its order.

| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| PT-r1-1 | B (FAIL) | CURED — RULINGS-ROUND2 B: the LATER STAMP (tick, `partySeq`); a same-tick tie no sequence settles → the deed. REFINED on B's letter (vetoable): the party's own monotone sequence on `presentAt`, each answer and each party deed | PT3, §2.1, §2.2, §2.3, §3.1, §4, OD-PT-3, OD-PT-27, P21 | M1 |
| PT-r1-8 | M (FAIL) | CURED — A.1: credibility PERSISTED (RN §7's holder), the party door its writer; strike/unstrike/undo RE-FOLD it (RN §7's undo rule) | §0, §2.1, PT4, §5, §6, §16, OD-PT-4, P18, P24 | M2, M6 |
| PT-r1-10 | M (FAIL) | CURED — A.2: the mark REPLACES the derived band for every hearer that can see it (reason visible); the round-1 belief scaling withdrawn, as RN withdrew it; "the credibility test" struck from the truth chase | §11.3, §11.2, PT13, §2.1, answer ¶, OD-PT-20, P3, P38 | M6 |
| PT-r1-14 | M (FAIL) | CURED — A.4: void/repudiation = CORRECTION (`correctsRef`) on RN's one re-read; masked inside the voider's reach (RN's row); `voidsRef` struck | §10.3, §3.1, §3.3, §2.1, PT6, §15, §16, OD-PT-5, P34 | M6 |
| PT-r1-16 | M (FAIL) | CURED — A.3: one vocabulary, PT's; PT text unchanged, bracketed; RN aligned (M6) | §2.4 | M6 |
| PT-V1 | M (new) | CURED — presence counts only at an evaluation after the answer's tick; a relief deed after the answer counts; a deed merely targeting the town does not | §8.6, §2.2, OD-PT-9, P26, P35 | the verifier's quotes (PT9, §7.2) |
| PT-V2 | M (new) | CURED — the mark moves `kind01` alone | §11.3, P36 | M10 (EXECUTED) |
| PT-V3 | M (new) | CURED — RN-3 before PT-1/PT-2; §3.3 rows register at RN-3's unit; PT-0 does not wait; the owner-row wait is moot (RN-3's gate struck, RULINGS-ROUND2 B) | §15, §3.3, §14, OD-PT-17 | RN §5.1 "reads each through §6's lenses"; M6 |
| PT-V4 | M (new) | CURED — the governing faction's AUTHORED band (`courtRegardOf(…).baseline`) is its own voice at its share; derived regard stays in the court's | §9.1, P29, P37 | RN §5.6, §2.3 |
| PT-r1v-c1 | carry | CURED — `MARK_DEED` after mint = a correction; never a rewrite (RN2) | §6, §3.3, §16, OD-PT-29, P40 | RN2 "APPEND-ONLY … never rewritten" |
| PT-r1v-c2 | carry | CURED — a destroyed need's town ends the clock; judged, never free | §8.2, §16, OD-PT-9, P39 | — |
| PT-r1v-c3 | carry | CURED — `settlement` is the registry's word | §13 | M8 |
| PT-r1v-c4 | carry | CURED — "lens one/two" registered as RN's design prose | §2.4 | RN §2.4's homonym note |
| PT-r1v-c5 | carry | NOTED — RN's normalizer owes `partySeq` (it now names `actAt`, `backerRole`) | §20 (1) | M6 |
| PT-r1v-c6 | carry | NOTED — RN §3.1's `party_event` row still says "for EVERY party-caused settlement event" (RN's STOP SEAMS-r1-6 is gone) | §20 (1) | M6 |
| PT-r1v-c7 | carry | CURED (PT's side) — `seatChangedSince(worldState, …, tick)` aligned; CH's `met_in_person` half NOTED | §7.3, §9.3, §10.3, §20 (4) | M7, M11 |
| PT-r1v-c8 | carry | NOTED — fold §3.4 party rows are P4's | §20 (2) | — |
| PT-r1v-c9 | carry | NOTED as DECISION POINT OD-PT-28 — the ripple's outcomes stand on undo (master); the undo receipt says so | §6, OD-PT-28, P42 | M4 |
| R2-A.5 · A.6 · A.13 | routed | NOTED — PT's text already the winning one | §7.3, §13, §2.1 | RULINGS-ROUND2 A |
| R2-E-sites | §E | CURED — ONE sites bracket | §4 (+ §2.4, §3.3, §13, §19b, OD-PT-30, P41) | M9 |
| R2-E-patrols | §E | CURED — ONE patrols line | §13, §8.3 | M9 |
| R2-E-host | §E | CURED — plague-R7's quarantine slot at the town's gate; patrols map-only (H16) | §9.2, §13 | CHAIR-NOTES item 11 |
| R2-E-doctrines | §E | CURED — the 10-18 doctrines bracket | §0 | the BOARD's words via RULINGS-ROUND2 §E |

(The three routed NOTED rows are counted as three ids: 18 + 7 = 25.)

## 3. STOPS
None. No cure contradicts an owner word or needs a kernel line.

## 4. REFINED (round 2; each marked in the volume, vetoable)
- **R2-1 — the whereabouts stamp carries the party's own sequence** (`partySeq`; PT3, OD-PT-27) — on RULINGS-ROUND2 B's letter. Why: B's same-tick rule alone loses a toggle the DM sets AFTER a same-session deed (the party fought in Tolle, then rode to Kell) until a later advance; the sequence implements B's own principle ("the LATER STAMP wins"), and B's tie rule stays the fallback.
- **R2-2 — the requester weighs a "later" by the party's word** (§8.5): RN §7 declares "an actor's willingness to accept 'later' (PT)" as a reader of the party's credibility; PT never read it. DRAFT draw 0.25 · 0.5 for `doubted` · `discredited`.
- **R2-3 — the season is fed to the journey; weather and the sea cited, not re-minted** (§0 row, §8.3; M3).
- WITHDRAWN during the lane (not in the volume): a "crediting test" gating a told reason by credibility, and an owner-row wait on PT-1/PT-2 — both would have contradicted RN's concurrent round-2 text and RULINGS-ROUND2 B (M6).

## 5. THE OTHER HALVES (for the chair and sibling lanes)
1. **RN:** name `partySeq` in the one deed normalizer; §3.1's `party_event` row → "every party-caused event that does not ripple (the six mint through `party_impact`)"; §7's reader "the truth chasing a rumor (PT)" has no PT read once a told reason is never scaled — strike it, or the chair gives it one.
2. **The fold (P4):** §3.4 party rows per A.5/A.6/A.13; §5 rows for `partySeq`, `party_reached_site` · `party_cleared_site` · `party_revealed_site`, the `revealed` homonym; §6 C11/C13 chain (RN-3 before PT-1).
3. **CH:** name `met_in_person` as the producer of `marks.metParty`.
4. **PR:** ⛔ STOP-PR-2 is the chair's — PT's recommendation is (a), widen `party_gate` to a `road` WHERE (one kind for a holder's reception of the party on its land; CH's words unchanged); OD-PR-16 lists PT as a `believedWatch` consumer and PT declines (a court's belief is never the DM's read of the party).
5. **IN:** `plant_taken` skips a plant whose subject is the party (unchanged from round 1).

## 6. OPEN QUESTIONS (only what measurement cannot settle)
1. OD-PT-28: should undoing a party-caused rippling event reverse the impact's world outcomes? (New capability on a door designed with no undo; one PLAUSIBLE road for the two relationship kinds named.)
2. STOP-PR-2's choice (above).
3. Round 1's two still open: a deed-only upward size bias; an AMEND `{ lie: true }` on `party_pledge_due`.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by code read at `81f1cd963`: M1–M4, M7's PL text, M8. CONFIRMED by execution: M5 (census), M10 (lens one: +0.2268 → 0; −0.34 → +0.038), the volume check (`check-r2.out`). CONFIRMED by reading the live sibling volumes: M6, M9, M11. PLAUSIBLE, not executed: the re-fold's exactness in PT's own code (RN executed the same law's refold), the `later` draw rates, OD-PT-28's road, every host delta, the band centres (DRAFT, UNMEASURED, FP-46 roster). None upgraded.

## 8. PROBES (`cure/D-PT-r2-probe/`)
`PT-before-r2.md` · `tools/apply_r2_part1..6.py` (each replacement asserted unique; the edit record) · `tools/check_r2.py` → `check-r2.out` · `census-r2.sh` (run under zsh) → `census-r2.out`, `census-r2-quoted.out` · `tools/lensOneProbe.py` → `lensOneProbe.out`.
