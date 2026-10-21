# D-BD-p5b-p5 — THE BODIES, P5d residue (RULINGS-P5 ADDENDUM §D.3) (chair 6eb7b5b6, Fable 5.1; seat Opus 5.5; 2026-10-20)

Owns: `docs/DESIGN_FP_ARCH_BD.md` (sole writer this round) · this file · `cure/D-BD-p5b-p5-probe/`.
Inputs: §D.3 (a) P5C-9's last truth bit (V-ALL-p5 fail 2; `skeptic/P5-verify-probe/visibleBand.out`) · (b) P5-V1 (`skeptic/P5-verify.md` new MAJOR). Predecessor record: `cure/D-BD-p5.md` (every P5 bracket kept).
BD backed up: `D-BD-p5b-p5-probe/BD.pre-p5b.md` (+ `.sha`).

## 0. STATUS
COMPLETE 2026-10-20 16:2x CDT — disposed 2 of 2: cured 2 · refuted 0 · stop 0 · noted 0 (+1 REFINED).
- [x] read BD whole (l.1–1415)
- [x] measure first (n1–n6, §1; two probes EXECUTED)
- [x] cures (12 in-place edits + 3 inserted sections: §19.0e · §20.6 · §21 P5d line; header line)
- [x] cross-volume greps (`xvol-greps.out`)
- [x] cure record (BD §20.6) + this file

## 1. MEASURED FIRST (master `81f1cd963`, READ-ONLY; no git; no test suite) — 2026-10-20 16:0x CDT
- BD read WHOLE (l.1–1415; sha `137b8284…fec6` = D-BD-p5's after-image — nobody else wrote BD since).
| m | What | Receipt | Consequence |
|---|---|---|---|
| n1 | the map band's ONLY truth input is the readiness arm | `mapProfile.js :: deriveDefensiveTerrain`: "`const defense = causal.scores?.defense_readiness ?? 50;`" … "`if (hasWalls && defense >= 55) { idx = Math.max(idx, 4); …'Walls plus high readiness yields fortified terrain.'`" · "`else if (hasWalls) { idx = Math.max(idx, 3); … 'Walls present; sheltered.'`"; the terrain ladder never reaches idx 4 | the walls rung ONLY = the band with `fortified` impossible; walls ⇒ `sheltered` |
| n2 | EXECUTED `D-BD-p5b-p5-probe/wallsRung.out` (master's function body, readiness arm removed) | 108 cells (9 terrains × walls × 6 readiness values): the readiness-free rung equals master's band with `fortified` read as `sheltered` in 108/108; rows whose rung moves with readiness: 0 (master's own band flips 54→55 on every walled row — the verifier's `visibleBand.out` reproduced) | the convicting probe is cleared by construction |
| n3 | no landed belief of a town's DEFENCE readiness | `beliefMap.js`: "`// Ground-truth war readiness for a warPosture state (0 calm … 1 in the field).`" `READINESS_BY_POSTURE = { peace: 0, alert: 0.25, … deployed: 1 … }` — the belief map's `readiness` is WAR POSTURE, another quantity | "the readiness through the ties' belief" would mint a new belief read and reuse `readiness` in a second meaning → BD12 names the WALLS RUNG ONLY |
| n4 | host size + the cost the verifier flagged | `mapProfile.js` 164 eff (`L-BD-probe/efflines.mjs`); `deriveMapProfile` calls "`const causal = deriveCausalState(settlement);`"; `deriveDefensiveTerrain` is module-private; the walls test `causalState.js :: defenseProfileHasWalls` is exported | the read is a byte-identical EXTRACT of the readiness-free half (BD-4 car-0, +≈4 lines), never `deriveMapProfile` — no `deriveCausalState` per town |
| n5 | P5-V1, EXECUTED on master's own module (`D-BD-p5b-p5-probe/custody.out`) | (1) `foreignGuestHoldsOf` over `[envoy a, body-held x]` → `hold:a` only; `normalizeForeignGuestHold(bodyHeld)` → `null` (`hasExactKeys(raw, ROW_KEYS)` + the six-field refusal); (2) `openForeignGuestHold` of envoy b beside them → persisted `hold:a,hold:b` — the body-held row DELETED by the write (`writeHolds`: "`.map(normalizeForeignGuestHold).filter(Boolean)`"); (3) the dedupe "`counts.errandId.get(String(row.errandId)) === 1`" (copied logic) erases BOTH of two errand-less captives (`String(undefined)` counted twice); keyed on `errandId` only when present + a unique `captiveId`, both kept | ES l.1585's "dark-after-lit: rows kept, inert" is false of master; the keep is ES-2b's OWN BUILD STEP (a declared shape, the owner's) |
| n6 | cross-volume | `xvol-greps.out`: `bodyVisibleDefenceOf` cited only at the fold l.952 ("the visible walls band") — consistent; the custody kept-while-dark claim lives ONLY at ES l.1585 (CH l.814's L7 is `authored.heldAt`, another shape) | ES edit ROUTED; no BD-caused contradiction |

## 2. THE RECORD (BD §20.6 carries the same table)
| Id | Sev | Disposition | Where (BD) | Checked against the convicting receipt |
|---|---|---|---|---|
| D.3 (a) · P5C-9 last bit (V-ALL-p5 fail 2) | MAJOR | CURED — WALLS RUNG ONLY (terrain + walls rungs; `fortified` never), via BD-4's byte-identical extract `defensiveTerrainRungOf` from `mapProfile.js`; readiness-through-belief rejected (n3) | BD12 · §0.1 · §2.5 ×2 · BD-4 car-0 + host edit · §14.1 · S63 · OD-BD-64 · §2.6 | `visibleBand.out` (54 → 55 flips) re-run as `wallsRung.out`: rung invariant under readiness (0/18 rows move), = map band with `fortified`→`sheltered` 108/108 |
| D.3 (b) · P5-V1 | MAJOR | CURED (BD half) + ROUTED (ES l.1585) — BD says master's real behaviour and declares the keep as ES-2b's build step (`captiveId`, flag-blind for the declared shape; the owner's, visible); BD-4 STOPs the race until it lands | BD27 · §9.10 · BD-4 car-0 · §15.1 `held` (dark-after-lit · migrate) · S29 · OD-BD-40 · §19.0e | `custody.out` on master's module: hidden on read, deleted on the next envoy write, two errand-less captives erased (copied dedupe); the cure's dedupe keeps both |
Counts: disposed 2 of 2 — cured 2 · refuted 0 · stop 0 · noted 0.

## 3. STOPs — none. (Build-time STOPs written into BD-4's car-0: the extract must be byte-identical, else the named fallback; the ransom race waits on ES-2b's normalizer step.)

## 4. ROUTED (BD §19.0e)
- ES (P6c brackets lane): l.1585 — strike "dark ⇒ `normalizeForeignGuestHold` byte-identical — the six-field refusal stands" / "dark-after-lit: rows kept, inert" as claims of master; state master's behaviour (custody.out); declare ES-2b's build step: errand-less captive under a unique `captiveId`, `errandId` deduped only where present, `ROW_KEYS` exact-key test admitting the relaxed set, flag-blind normalizer for the declared shape (`custodyWriteEnabled` gates writers only); the owner's shape, visible.
- THE CHAIR (ODQ §934.93 P5 addendum): ES-2b's relaxed-shape visible row names `captiveId` + the flag-blind normalizer arm.
- FOLD (P7): §5 registers `defensiveTerrainRungOf` and ES's `captiveId`; l.952's BD P5 row may read "the WALLS RUNG ONLY (never `fortified`)" (tightening; no contradiction today).

## 5. REFINED
- R1 (BD-4 car-0, marked): the readiness-free EXTRACT over a capped `deriveMapProfile` read — one ladder, no truth input, no per-town `deriveCausalState` (V-ALL-p5's PLAUSIBLE cost retired); the capped read kept as the named fallback.

## 6. VERIFICATION
- BD `BD.pre-p5b.md` sha `137b8284…fec6` → `BD.after-p5b.md` (sha in `.sha`); 1,415 → 1,430 lines; `volume-p5b.diff`; 0 deletions of meaning — 15 old lines rewritten in place, 14 keep ≥ 95% of their words, the 15th (the §14.1 BD-4 host cell "— (owners' registrations)") 93% by design; tables 24, 0 mismatches (`D-BD-r6-probe/tablecheck.py`); strict GFM pipes: the ONE pre-existing mismatch (the r6 causalState row), none new.
- Every existing P5 bracket kept (none removed; `grep -c "fp-final P5)"` rose).

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED by execution: the walls rung's invariance and equality (`wallsRung.out`, master's own function body); master's custody normalizer hiding and deleting a body-held row (`custody.out`, master's module). CONFIRMED by reading: n1, n3, n4, n6, the census (`census-p5b.out`). PLAUSIBLE: the extract's "+≈4 lines" and its byte-identity (BD-4's car-0 proves it); the dedupe hazard's runtime shape (copied logic over a hypothetical relaxed normalizer — the design is unbuilt). No git; no test suite.
