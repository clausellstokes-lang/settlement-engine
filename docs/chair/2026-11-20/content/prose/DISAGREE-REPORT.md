# DISAGREE: the builder's report (PROSE-6; brief f86828e02; addendum 1 with its 03:45 and 03:55 rulings; lines at 94e0495c5)
Lane `lane/prose-6-2026-11-23-disagree-wip`, base 244fa84ef. Logs are under `/home/user/logs/disagree-*.log` (addendum runs: `disagree-a1-*`). Every heavy run went through `gate-mutex.sh --run`.

## COMMITS
Phase 1: 687ae0dbe. Tooth red first: 6cf527f5d, fe7b25f78. Projection: 2566116a6. Cure: b34c50cd0. ARM 4: f8241d2d0. Proof scripts: 863fdfb81, 5cc9f0122.
First registers, superseded below: 1714ddb2a, d593d5e1b, d2408b703, c72fd61b5.
ADDENDUM 1:
- eed24a1cf: every `force: paid` mark goes; W1-W3 withdrawn; WEAK v2 re-worded (row CHAIR-2026-11-23-03:45).
- e3ede01d4: WEAK v1 re-worded (row CHAIR-2026-11-23-03:55).
- f7784d722, ea657a024: the tooth.
- Registers: 5298e6916 wiring census, eee231071 shift register, 17aeb585f observed-shape, 2817f676b lighting census.
- Test files: dc93e8038 pins, 6f22adf36 stateProseKernel, d03fae82d desk fixture.
At the tip, `git diff 244fa84ef` shows: nothing on the GEN-17 leaf; WEAK differs only in v1 and v2's words; CHAIN differs in v1-v4's `food: ≤ pressured` and v7-v12 (F1-F6).

## (a) RED, THEN GREEN (`tests/domain/oppositeSentencePairs.test.js`)
RED on the uncured tree, for FOOD: dz-town-12, dz-city-54, dz-metropolis-2, dz-town-0, dz-city-4, dz-metropolis-5.
ARM 5 is RED on 244fa84ef's defense leaf: dz-town-2 prints WEAK v1's old words; dz-town-36 and dz-thorp-0 print v2's.
GREEN at e3ede01d4, 6 of 6. The arms: ARM 1, the pairs (FOOD only; WAGES has no row); ARM 2a/2b, anti-vacuity; ARM 3, the GEN-17 v2 tail at 0; ARM 4, no cell left empty, with dz-city-101 as the one named exception; ARM 5, WEAK v1's and v2's old words at 0.

## (b) THE BAR, 900 births: FOOD reach by size (village 3, town 9, city 12, metropolis 44; 0 below). WAGES has no new line.
| line | village | town | city | metropolis |
|---|---|---|---|---|
| F1 | 1 | 2 | 6 (4.0%) | 0 |
| F2 | 2 | 1 | 2 | 0 |
| F3 | 0 | 3 | 2 | 0 |
| F4 | 0 | 3 | 2 | 20 (13.3%) |
| F5 | 0 | 0 | 0 | 14 (9.3%) |
| F6 | 0 | 0 | 0 | 10 (6.7%) |
No line is over 15%.
The chair's `disagree.mjs`, untouched, on the 900: WAGES BOTH **0** (base 2); NOMONEY 0 (base 17); FOOD BOTH 8 (base 27: the both-truth lines, as intended).
The new WEAK words: dz-town-2 prints v1, "{settlement} has nothing laid by to pay for a long defence, and whoever is called to make one knows it." dz-town-36 prints v2, "The people who would have to hold {settlement} through a long defence know there is nothing laid by to pay them for it."

## (c) THROUGH `OPPOSITE_PAIRS`, 900 births: 0 pages (FOOD; base 68). The old words: 0 pages. The GEN-17 v2 tail: 0 pages.
Beside each new line (pages):
- F1: SECURE v3 4, v9 2, v1/v8/v10 1
- F2: v1/v2/v3/v9/v10 1
- F3: v1 2, v2 2, v10 1
- F4: v1 6, v8 6, v6 5, v9 3, v7 2, v10 2, v2 1
- F5: v1 3, v2 3, v7 3, v8 2, v6/v9/v10 1
- F6: v8 5, v10 2, v1/v6/v7 1

## (c2) NO CELL LEFT EMPTY, 900 births: CHAIN 75 held, 0 empty; WEAK 353, 0; GARRISONED 153, 1. The one is dz-city-101 (crisis `occupied`), also empty at 244fa84ef.
## (d) DARK PROOF: both trees give sha256 `f2ecb50cc3d3ea579de0d07a67a4cd31498e03fee01c62a9a06dc740c65c05b9` over 900 births: EQUAL. 0 births differ, 0 strings differ.

## (e) `tests/lint` WHOLE at b73feab11: 3,364 tests, 3 red, ALL on RED-AT-LINE: proseCorpusBytes RAW, GZIP; proseComposed A0b.
- proseMoveGrammar CONTROL 4 is green, with its three figures moved by the chair's rulings: `repeatedOpener` 167 → 166 and the share pin `× 800` 155 → 154 (05:01, 91bb5a941); `repeatedOpener / cells.size` 0.194 → 0.193, i.e. 166 / 861 = 0.19280 (05:23, b73feab11).
  - The cause: WEAK v1, re-worded in place, opens '{} has' where it opened '{} is' like v6.
- Cured at the tip, each by its row below: factLayers, samenessHideable (the house list does not move after the withdrawal: not re-taken), wiringCensusDeclared, proseWiringCensus, proseEntryContradiction, proseWaveGate, observedShapeReaders, sovereigntyLighting.

## (f) THE NAMED FILES: 97 named, 79 kept (the 18 out are helpers, fixtures and registers). The 63 outside `tests/lint` were run with the tooth: 1,000 tests, 1 red, voiceMechanics, which is on RED-AT-LINE. crisisBlindDossierProse is green with nothing changed.
## PINS, BEFORE → AFTER (each figure is the walker's own measurement; the cause is in each comment)
- proseComposed GUARD THE GUARD: 3176 → 3182.
- proseWiringCensus VARIANT column: 3176 → 3182 (×3); mean '3.69' → '3.70' (3182 / 861); histogram 6: 40 → 39, 12: 1 → 2.
- proseEntryContradiction: 3644 → 3650; 2936 → 2942 (×2).
- proseWaveGate: 712 → 718. proseMoveGrammar CONTROL 4: 167 → 166; share × 800 155 → 154; share 0.194 → 0.193 (the chair, 05:01 and 05:23).
- stateProseKernel: departure list n=6 40 → 39, n=12 1 → 2; append list n=12 1 → 2. One pool moved: DS-DEF-2 CHAIN, 6 → 12 variants.
- Desk fixture: `fort` takes `foodBand`; the clause test passes 'pressured'.
## REGISTERS MOVED (each by its own door)
- Wiring census: against 244fa84ef, variants 3176 → 3182; WEAK's grammars 2 → 1; tiers unchanged: THIN 613, COVERED 248.
- Shift register: 3182, five pins; the notes say the re-wording.
- Observed-shape: digests and scan stats only.
- Lighting census: files 3775 → 3776, titles 31865 → 31871.
OWNER'S, untouched:
- proseCorpusBytes RAW: defense 299,885 → 302,541; general 312,515 → 312,515.
- GZIP: defense 39,774 → 40,039; general 39,500 → 39,500.
- A0b under-claim: 2,322 → 2,328.
## RATCHETS AND BUILD
`tests/copy`, `tests/store`, `tests/architecture`, `tests/docs`: 2,035 tests, 2 red, both on RED-AT-LINE (voiceMechanics, deadOperationRatchet).
`npm run build`: exit 0. `VERIFY_DIST=1 tests/build`: 623 tests, 15 red, all on RED-AT-LINE.
| figure | here | line |
|---|---|---|
| first paint, raw | 1,184,741 | 1,184,741 |
| first paint, gzip | 377,005 | 376,987 |
| first paint, Brotli | 316,557 | 316,646 |
| worker | 2,709,263 | 2,709,263 |
| engine chunk | 932,369 | 932,369 |
Git: `core.bare` false; local `user.name`, `user.email` and `commit.gpgsign` unset; 0 commits by Fixture.
