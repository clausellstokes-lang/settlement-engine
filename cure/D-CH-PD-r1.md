# D-CH-PD-r1 — DISPOSITION of THE PATRON DEITY amendment's first skeptic (fp-final P6b; chair 6eb7b5b6; lane seat Opus 5.5)

Started 2026-10-20 ~16:4x CDT. Owns ONLY `docs/DESIGN_FP_ARCH_CH.md` (the passages carrying "(fp-final P6; L-CH-PD)") and this file + `cure/D-CH-PD-r1-probe/`. Never git; never the test suite.

## §0 INPUTS (every id disposed below)
1. `skeptic/CH-PD-r1.md` — 21 ids: CH-PD-r1-1..12 MAJOR, 13..21 MINOR (0 BLOCKING).
2. `briefs/RULINGS-P6.md` §F.1–F.6 (the chair's rulings for this amendment; the latest wins).
3. SEAMS-P6 — NOT YET RUN (`skeptic/SEAMS-P6*` absent at 16:4x CDT; BOARD 16:37: "SEAMS-P6 … after r3 and CH-PD return"): 0 ids routed to CH-PD.
4. The other skeptics' routes to CH-PD: `skeptic/OP-r1.md` OP-r1-17 names "the patron lean" inside "OP + CH: any paragon may take `false_word` through CH's one roll" (RULINGS-P6 §B.1/§C assign CH's half to the P6c brackets lane); MG-r1, WS-r1, FS-r1 — none (WS-r1-19 is WS's own deity double count).
5. The compile logs' ROUTES to CH-PD: `cure/L-MG.md` §5 "CH / L-CH-PD: a commanding paragon's verbs through CH's one roll (deity inside it)"; `cure/L-OP.md` §5 CH "the patron deity's lean stays inside CH's roll (L-CH-PD)"; L-WS, L-FS — none.

## §1 MEASUREMENTS FIRST (master `81f1cd963`, READ-ONLY; probes in `D-CH-PD-r1-probe/`)
- The skeptic's probe RE-RUN as the model of the old lean (its `lean.out.txt` stands; the numbers re-derived by hand: war champion under evil/chaotic = 0.0015 m, under good/lawful = 0.1564 m — the kind term `a·(0.65−½)·K` with `K = max(0, 1 − 2·malice01)` = 0 for an evil god dominates the force term `c·(0.60−½)·(2·0.83−1)` = 0.026). CONFIRMED.
- `deityAxes.js :: deriveTemper` — `TEMPER_DERIVATION = { W_EVIL: 0.7, W_CHAOS: 0.3, THRESHOLD: 0.15 }`; `score = W_EVIL*(evil−½) + W_CHAOS*(chaos−½)` ⇒ every evil god derives `warlike`, every good god `peacelike`, every neutral-alignment god `neutral` (±0.15 never exceeds the threshold): the DERIVED temper carries no signal apart from the alignment — the inversion's root. CONFIRMED (read; `lean.out.txt` "derived temper by (alignment, law)").
- `tests/domain/deityTemperConsumerCensus.walker.test.js` — "the consumer census is EXACTLY the thirteen named modules" (`toHaveLength(13)` over `/\bdeityTemper\s*\(/`); "twelve of the thirteen consumers read an embed" (`toHaveLength(12)`); `CONSUMERS` rows `{ file, provenance: 'embed'|'raw-draft'|'literal', probe, note }`; the stored-field register `STORED_FIELD_READERS` EMPTY (`/[.[]['"]?temperamentAxis/` outside `EMBED_WRITERS`); "exactly one module BUILDS a deity embed" (`/_deityRef:/` + `/temperamentAxis:\s/`). CONFIRMED (read).
- `deityCommitEmbed.js :: commitDeityEmbed` — re-picking a committed embed through the builder is a FIXED POINT and drops foreign keys: EXECUTED `repick.out.txt` ("re-pick through the builder is a fixed point: true"; "foreign keys dropped (junk, wallClock): true"; legacy minimal snapshot fixed point true). The parity test's "THE RESTORE ROUND-TRIP … a SECOND round-trip is a fixed point" is the same property for the intent builder. CONFIRMED.
- `customRegistry.js :: mintDeityRef` — `return scope ? \`deity:${scope}:${slug}\` : \`deity:${slug}\`;`; the panel seats by `mintDeityRef(d.raw) || d.refId` (`DeityAssignmentPanel.jsx`), the composer by `mintDeityRef(entry.raw) || refId`. CONFIRMED (the skeptic's `receipts.out`, re-read).
- `religionState.js :: suppressDeity` (WF-1b) — "the stamp records WHEN THE BELIEVERS' CREED WAS PUT OUT OF THE LIGHT by an eviction, a capacity contest or a siege"; three callers: `attemptEntry`'s same-niche push-out and cross-niche eviction, `resolvePatronContest`'s siege. CONFIRMED (read).
- `religiousContest.js` 3a — `const { deity, carrier, occupied } = reaching.get(dref);` → `attemptEntry(state, deity, …)` keys on `deity?._deityRef || deity?.name`. CONFIRMED (read).
- `livedExperienceSources.js` — `adapter('god_fortunes_rose', 'news', "impactKind 'pantheon_ascendancy' (settlementIds is EMPTY — patron join)", 'patronDeity', ['pantheon_ascendancy'], …)`; source `realmEvents.js` `impactKind: 'pantheon_ascendancy'`. CONFIRMED.
- `faithField.js` l.264 — `if (str(snapshot.boonChannel) === channel) term += …` reads RELIGION-STATE snapshots, never a paragon record. CONFIRMED.
- RN §7 (ledger) — "A paragon's credibility is the landed `npcCredibility` holder for its `wnpc_`". CONFIRMED (read).
- Token census (`census.out.tsv`, `rg -w -l` files: master src · tests · master docs · ledger docs): `swornDeity` · `swornDeityOf` · `swornLean` · `SWORN_LEAN_WEIGHT` · `sworn_creed_conflict` · `paragonSworn` · `swornTemperOf` 0·0·0·0 each — FREE; `patronDeity` 4·0·1·1 (src: W-LIVES rung, `clergyTraitPlane`, `deityStanceLane`, `religionState` — all the SETTLEMENT's seated patron; the docs hit is CH itself, the master docs copy being the docs proof's staging of CH, byte-identical). CONFIRMED.

## §2 THE RE-DERIVED LEAN (RULINGS-P6 §F.1) — EXECUTED `lean2.mjs` → `lean2.out.txt`, `lean2.out.tsv`
- THE CONVICTING PROBE RE-RUN: the skeptic's `lean.mjs`, copied to `skeptic-lean.rerun.mjs` and run from this lane's probe dir → `skeptic-lean.rerun.out.txt`, BYTE-IDENTICAL to `skeptic/CH-PD-r1-probe/lean.out.txt` (diff empty). CONFIRMED.
- THE DESIGN (`lean2.mjs`; RN §6.2's lens one restated in the PROBE only, as the model of RN's export): `align = 1 + W·m'`, `m = lensOne(god with aggr ½, face)/((a+b)/2)`, `m' = ½·m + ½·ally` on target-dependent faces (own creed helped +1 / hurt −1 / other no tie); `bold = 1 + (W/2)·sgn(force01−½)·T` (warlike +1 · neutral 0 · peacelike −1 from master's `deityTemper`); `act = align·bold`; `commit = 1 + W·(2·lawfulness01−1)`; W = `SWORN_LEAN_WEIGHT` 0.10; the grid = 3 alignments × 3 laws × {derived, authored warlike/peacelike/neutral} = 36 gods; faces = CH §2.2b's exertion rows, `duel_won`, `hunt_won` (+ the own-creed variants).
- RESULTS (`lean2.out.txt`): T1 the skeptic's rows — war champion derived-warlike 1.0002 → **1.0465**, derived-peacelike 1.0235 → **0.9722**; T1b on EVERY war deed (war champion/villain, duel champion/villain, hunt gang, hunt conclave other/own flock) min over warlike gods > max over peacelike gods — **true**; T2 monotone per coordinate (malice, law on the alignment half; authored temper on act) — **true**; T3 neutral/neutral god, no-tie faces: alignment half exactly 1 on every temper arm, act exactly 1 with a neutral temper, commit exactly 1 — **true**; authored-warlike neutral god leans only via the temper (`order/champion` 0.950, `order/villain` 1.050); T4 envelope by construction [0.855, 1.155], commit [0.90, 1.10]; MEASURED act [0.8851, 1.1200], alignment half [0.9317, 1.0667]; T5 shame (`m' ≤ −½`) reached by: fallen saint under good/lawful · good/neutral · good/chaotic · neutral/lawful · neutral/neutral; plaguebearer good/lawful · good/neutral; wildland villain good/lawful — S65 (every good creed) **true**, `m'` ≤ −0.583, act 0.885–0.989; T6 S62's god: `duel_won/villain` under good/lawful/derived act **0.9183**, the grid's minimum for that face; T7 a saint of an evil creed: align 1.0483 (was m −0.054), act 0.9959 (the boldness half 0.95 — named apart); saints by temper: warlike 0.996–1.012 · neutral 1.048–1.065 · peacelike 1.101–1.118. CONFIRMED (executed).
- `false_word` (OP's cite): `information/villain` act by derived god — good 0.957/0.973/0.990 (lawful/neutral/chaotic), neutral 0.983/1.000/1.017, evil 1.010/1.027/1.043: "a lawful god's sworn lies less readily" holds BY THE LAW AXIS, not absolutely. CONFIRMED (executed).

## §3 THE RECORD (every input id; the volume's §25 "P6 r1" block holds the same table with receipts)

| Id | Sev | Disposition | Where (CH) |
|---|---|---|---|
| CH-PD-r1-1 | MAJOR | CURED — two monotone halves; envelope said once; neutral defined on three; S62 rewritten + control | l.38 · CH22 · §2.2 · §4.4 · §10b · S62 · S68 · OD-CH-52 |
| CH-PD-r1-2 | MAJOR | CURED — bar on the alignment reading with the own-creed tie; reach stated; S65 re-pinned | §4.5 · §10b · S65 · OD-CH-55 |
| CH-PD-r1-3 | MAJOR | CURED (CH half) + ROUTED RN (the mix export) | §2.2 · §10b · OD-CH-52 |
| CH-PD-r1-4 | MAJOR | CURED — F.3 rename everywhere in the design text; W-LIVES a new rung | throughout |
| CH-PD-r1-5 | MAJOR | CURED — walker named, 13→14 / 12→13 declared (OD-CH-56 ⭐); re-pick via `commitDeityEmbed`; `swornTemperOf` | §0 · §2.2 · CH-11 · L1c · S67 · OD-CH-56 |
| CH-PD-r1-6 | MAJOR | CURED — `mintDeityRef` | §0 · §2.1 · §10b · CH-11 · L1c · S69 |
| CH-PD-r1-7 | MAJOR | CURED — the door's copy and the normalizer's re-pick allowed; S67 scan | CH22 · §10b · S67 |
| CH-PD-r1-8 | MAJOR | CURED — every embed key's status; S67 scan | CH22 · §2.1 · §10b · S67 |
| CH-PD-r1-9 | MAJOR | CURED (amended passages) + ROUTED P6c (P1 `creedRef` row clause) | §2.1 · §6.2 (3a) · §10b · CH-11 · L1c · S64 · OD-CH-55 |
| CH-PD-r1-10 | MAJOR (PLAUSIBLE) | CURED (CH half) + ROUTED RN | §2.2 · §10b · L1c · OD-CH-54 |
| CH-PD-r1-11 | MAJOR | CURED — WARMER only over step 5's watch | §11 5b · §10b · S63 (e) · OD-CH-53 |
| CH-PD-r1-12 | MAJOR | NOTED — OP's, ruled F.4 → P6c lane B | — |
| CH-PD-r1-13 | MINOR | CURED at 5b (corps paragraph untouched, F.6) | §11 5b |
| CH-PD-r1-14 | MINOR | CURED (§10b/L1c half) + ROUTED P6c (§2.4 row) | §10b · L1c veil |
| CH-PD-r1-15 | MINOR | CURED | §10b flock |
| CH-PD-r1-16 | MINOR | CURED | §24 · l.38 |
| CH-PD-r1-17 | MINOR | CURED | l.38 · §10b |
| CH-PD-r1-18 | MINOR | CURED | S61 · S65 |
| CH-PD-r1-19 | MINOR | CURED | CH22 · §10b couplings |
| CH-PD-r1-20 | MINOR | CURED | §10b · L1c import |
| CH-PD-r1-21 | MINOR | CURED (§10b/L1c half) + ROUTED P6c (CH-0b row) | §10b · L1c create |
| F.1 | ruling | APPLIED (= r1-1, r1-2, neutral, envelope) | — |
| F.2 | ruling | APPLIED (= r1-5, r1-6, OD-CH-56) | — |
| F.3 | ruling | APPLIED (= r1-4) | — |
| F.4 | ruling | NOTED — OP's (P6c lane B) | — |
| F.5 | ruling | APPLIED — OD-CH-51 visible; legacy pool-seeded god by delegation, visible; no seventh flag | §10b · OD-CH-51/52 |
| F.6 | ruling | APPLIED — diff vs `CH.before-r1.md`: every changed line inside an amended block; three halves routed | — |
| OP-r1-17 (its "patron lean") | MAJOR (OP's) | CURED (CH-PD half: the comparative made exact) · call-board half P6c's | §10b couplings |
| L-OP §5 CH route | route | NOTED — already so | §10b couplings |
| L-MG §5 CH / L-CH-PD route | route | NOTED — already so | §10b couplings |
| SEAMS-P6 | — | not run; 0 ids | — |

Disposed 30 of 30: cured 26 · refuted 0 · stop 0 · noted 4.

## §4 STOPS — none. Every cure stayed inside the amended passages (F.6); the three non-amended halves are routed below rather than written.

## §5 ROUTED (one line each: volume — the exact edit)
1. RN §6.2 — export lens one's pure core AND the lens-two mix (`(1−μ)·act + μ·ally` when a tie is found, else `act`) as pure functions `readDeed` calls, so CH's `swornLean` reads them with the god's force held at ½ and μ ½ (a god as a read-only holder; it holds no regard).
2. RN §2/§5 — the doer's public oath becomes a PART of a telling (heard with the doer as its display noun is; lost where the doer is lost; all parts at once in the omniscient arm); the temple officer's reading of a sworn doer by its creed's recorded coordinates is an OVERRIDE of §6.2's "a person its own" — RN rules it and registers it in "Which character each holder reads".
3. OP l.341 — re-attribute "a merciful god's champion rescues readily" to the chair's design (`briefs/L-CH-PD.md` item 2) and say "a good god's" (F.4, P6c lane B; CH-PD-r1-12 + r1-17's sense).
4. OP l.162 · l.301 · l.344 — "a lawful god's sworn lies less readily" → "less readily than a chaotic god's of the same good-evil axis (CH S68); an evil, lawful god's sworn still lies a little more readily than an unsworn one".
5. CH (P6c brackets lane; non-amended passages, F.6) — P1 `creedRef` row: "for a faith CHAMPION, DERIVED from `swornDeity` (written at the door, re-derived by the normalizer, §10b)".
6. CH (P6c) — §2.4 `npcLedgerProjection.js` row: the non-DM allow-list gains the public oath ("sworn to <god>"), never under `secret_faith`.
7. CH (P6c) — §3 CH-0b: a library paragon's oath is a cross-bucket deity reference the manifest row carries, copied by `commitDeityEmbed` at introduction (the OWNER's hand with CH-0b).
8. CH (P6c) — CH-3's wave text: "(3a)'s saint-oath arm lands with CH-11; before it (3a) carries only a seated creed" (a cross-cite).
9. W-LIVES (the fold INBOX) — a NEW `SUBJECT_RESOLUTIONS` rung `swornDeity` for the paragon's oath (the `god_fortunes_rose`/`_fell` events through the one drift law), never a widening of `'patronDeity'`.
10. THE FOLD (P7) §5 — register `swornDeity` · `swornDeityOf` · `swornLean` · `swornTemperOf` · `SWORN_LEAN_WEIGHT` · `sworn_creed_conflict` (and `keeps_the_faith` · `patron_creed` · `suppressed_creed`); `patronDeity` in its LANDED settlement-patron sense only; §3.4 no new kind.
11. THE FOLD (P7) FP-46 roster — `SWORN_LEAN_WEIGHT` 0.10 (boldness at ½), μ ½ for a god, the shame bar −½.
12. ODQ §934.94 — OD-CH-51 ⭐ (the field, now `swornDeity`, REQUIRED for a saint) and OD-CH-56 ⭐ (the landed temper census 13 → 14) as VISIBLE rows.
13. SEAMS-P6 — check CH-PD × RN (the two exports, the telling part), × OP (routes 3–4), × WF (open question 1 below).

## §6 REFINED (marked in place, vetoable)
- The boldness half at HALF the alignment half's weight (the temper speaks on mild-moral acts, morality on heavy ones; equal weights would let an authored-warlike good god's plaguebearer out-lean an evil god's).
- The god's lens two reads its OWN creed alone (no creed-to-creed stance inside the roll).
- `swornTemperOf` — the page's one temper read, so the landed census grows by exactly one.
- S68 (the executed lean table as a pin) and S69 (one ref for the seat and the oath).
- The Why panel names the carrying half in the follower's words ("her faith's mercy"), never a god's will.

## §7 OPEN QUESTIONS FOR THE CHAIR
1. With the saint's oath REQUIRED and (3a) carrying the oath's embed, a god the DM made but seated NOWHERE can now enter a world's faith contest through its saint (`attemptEntry`). I read the DM's introduction of the saint and its oath as the custom-content introduction the deity doctrine requires (and the owner's 10-17 word: "a champion that represents a religion … boost their respective religions conversion"); vetoable — the alternative restricts a saint's oath to gods some town already seats. PLAUSIBLE until SEAMS-P6 reads it against WF's pantheon gate.
2. `SWORN_LEAN_WEIGHT` 0.10 with the boldness half at ½ — the lane's call under F.1 ("the lane's call, said once").

## CONFIRMED vs PLAUSIBLE
CONFIRMED (read at `81f1cd963` or executed here): the inversion's root (`deriveTemper`), the re-derived lean's monotonicity, war-deed order, neutral identity, envelope and shame reach (`lean2.out.txt`), the convicting probe re-run byte-identical, the re-pick's fixed point (`repick.out.txt`), the walker's pins, `mintDeityRef`, `suppressDeity`'s wording, 3a's deity object, the token census. PLAUSIBLE: RN's two exports and the telling part (RN's to build), every DRAFT magnitude (UNMEASURED by design), S62's fixture (built at CH-11), open question 1's doctrine reading.
