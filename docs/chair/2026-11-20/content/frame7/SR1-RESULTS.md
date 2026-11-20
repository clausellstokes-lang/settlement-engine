# FRAME-7 · SR1 results: the stakes' reason, built as approved

Written 2026-11-20 by the SR1 builder on `frame7-sr1` (base `334f9fb68`), for FRAME-7. Brief: `frame7/SR1-BUILD.md`;
design: `frame7/SR1-PROPOSAL.md` as the chair approved it at 20:04 UTC. Each point vetoable by the owner. E = executed.

**Commit:** `4eea702d8` fix(FRAME-7 · SR1): the stakes' reason said by what the record holds; the readers compare a key
(this file is the second commit).

**⚠ ONE STOP CONDITION MET BY ITS LETTER (first paint, Brotli +107 B; §6).** Raw first paint is byte-for-byte the base's
size and the new data file is not in it; the Brotli figure moves only by chunk-hash names and minifier export letters. It is
reported for the chair, not cured.

## 1. What was built

- **`src/data/crisis/stakeReasonLines.js`** (new; a pure data leaf, no import):
  - `STAKE_REASONS`: all 34 pre-SR1 literals, byte for byte. `crisisCast.js` re-exports this one object, so every reader and
    pin imports it unchanged.
  - `STAKE_REASON_LINES.loses`: the approved wordings by matched system, in agreement form (`{power|one|many}`), with the
    four cures applied. That is 21 wordings over 11 systems. A system with no pool takes `LOSES_FALLBACK`, the pre-SR1 line
    in agreement form.
  - `STAKE_REASON_LINES.split`: the three approved wordings.
  - `stakeReasonKey(reason)`: the closed reverse map. It covers every pre-SR1 literal, "their own people feel the crisis
    first", and every wording in both numbers. Any other text gives null.
- **`crisisCast.js :: deriveStakes(s, kind, seed = '')`**:
  - It keeps the matched system (the `sys` that set `loses`).
  - A `loses` row draws from its system's pool, and a `split` row from the split pool. The draw goes through
    `drawDeclared` with `castHash(seed, kind, 'stake:' + name)`, keyed `${seed}::${kind}::${name}`, pool ids
    `STAKE_REASON_LINES.loses.<sys>` and `STAKE_REASON_LINES.split`, surface `crisis`, drawKind `H`.
  - The drawn text is filled by `fillAgreement` with the stake's own power, which replaces C2b(b)'s one line. A singular
    power that draws the fallback still gets `STAKE_REASONS.loses` byte for byte.
  - `deriveCrisisCast` passes its `seed`.
  - There is no rng, and no other stake, key or row moves (§4).
- **The readers compare a key, never a sentence:**
  - `bruntCandidates` reads `stakeReasonKey(k.reason) === 'split'`.
  - `crisisPage.js :: stakeShown` reads `=== 'untouched'`, imported from the data file.
  - `crisisHooks.js` is untouched: `loserClause` still folds its/their, and is now a no-op on the new forms.
- **At birth only.** A saved town keeps its stored sentence, and its stored literals still map to their keys (tested).
- **`crisisCast.js`: 800 → 770 effective lines** (eslint `max-lines`, skipBlankLines/skipComments); 1,453 → 1,423
  physical. No ceiling was raised and no size baseline was touched.
- **About `needs`** (implementation note, for the chair's eye):
  - A wording's `needs` is its pool's key, the matched system. It is not a fact atom. `factVocabulary.js` has no atom for an
    affected system, and `drawDeclared` refuses an unknown atom (fail-closed), so a `needs: ['defense_readiness']` field
    would refuse every line.
  - The wordings are plain strings in system-keyed pools. Because of that, `declaredLineShape` has no declared line to walk
    in this file.
  - `drawDeclaredKeys.walker` is green: the key leads with the seed.
  - If the chair rules a real fact `needs` on a wording, it goes on that line as `{ text, needs }`.
- **Registration:**
  - `scripts/census/pool-dominance.register.json`: 8 new drawn pools banked through the lane's own door,
    `pool-dominance.mjs --bank-new`. The output was "8 new rows banked, no other row touched". For example, `split` top1
    0.3444 and `loses.public_legitimacy` top1 0.28.
  - The census header was re-taken by the door: pools 960 → 968.

## 2. THE CHAIR'S MEASURE BEFORE THE MERGE (E; `chair.mjs` over the base births; `loses` rows by matched system)

| matched system | CRISIS (543 rows): powers · crisis kinds | ALL (150) | ALL-C (123) |
|---|---|---|---|
| public_legitimacy | 235, ALL governing (government 184, merchant 35, other 14, noble 2) · 10 social/engineered/external kinds | 56, all governing | 55, all governing |
| defense_readiness | 94, ALL military, not governing · occupied 37, wartime 23, monster_pressure 22, insurgency 10, slave_revolt 2 | 24 military · monster_pressure, wartime, occupied, insurgency | 15 military · wartime, insurgency, monster_pressure |
| trade_connectivity | 86, merchant (79 not governing, 7 governing) · monster_pressure 30, under_siege 30, indebted 26 | 24 merchant | 19 merchant |
| social_trust | 64, religious · religious_conversion 16, infiltrated 14, politically_fractured 9, recently_betrayed 9, mass_migration 8, insurgency 8 | 19 religious | 14 religious |
| tax_revenue | 48, ALL governing · wartime 24, indebted 24 | 20 governing | 17 governing |
| law_order | 12, military · succession_void 12 | 7 | 2 |
| healing_capacity | 4, religious · plague_onset 4 | 0 | 1 |

**Plainly:**
- No power that arms no one reaches `defense_readiness`: every power that reaches it is a military power.
- No crisis that is no danger of arms reaches it: occupation, war, monsters, insurgency and slave revolt are all dangers of
  arms.
- So "sent to hold the line" and "those it arms" need no `needs`.
- The governing wordings ("it governs", "its right to rule") are said only of governing powers. Both public_legitimacy and
  tax_revenue are matched by governing in every row.

## 3. The commonest printed reason's share of a size's places (E; thorp, hamlet, village, town, city, metropolis)

"Printed" means every stake row the page prints as stored, i.e. all but `untouched`.

| pool | base | tip |
|---|---|---|
| ALL-C (census births) | 18 / 32 / 22 / 20 / 28 / 28% ("its own people…"; village "gains and loses…") | **8 / 10 / 8 / 10 / 10 / 10%** (all SR1 wordings) |
| ALL | 20 / 34 / 34 / 24 / 30 / 26% | 8 / 18 / 20 / 12 / 14 / 14% |
| CRISIS | 80 / 80 / 80 / 85 / 85 / 85% ("its own people…") | 18 / 45 / 47 / 45 / 35 / 38% |

**ALL:**
- The two over 15% are not SR1's keys: hamlet 18% is gainsVacuum and village 20% is gainsChurch.
- SR1's own wordings alone are at most 14% (8 / 10 / 12 / 10 / 14 / 8%). No SR1 wording is over 15% on ALL or ALL-C.

**CRISIS** (structural: four towns a kind a size):
- The tip's commonest are other keys (gainsVacuum, gainsChurch, gainsCrime).
- SR1's commonest are 18 / 22 / 38 / 23 / 27 / 28%.
- SR1 wordings over 15% on CRISIS, named:
  - thorp: "it governs, and the crisis is laid at its door" 18, "people look to it first…" 17, "every day…" 17;
  - hamlet: "every day…" 22, "has as much to gain…" 20, "gains and loses…" 18, three at 17;
  - village: "gains and loses by it at once" 38, "stands to win…" 22, "has as much to gain…" 22, "its right to rule…" 20,
    "stand to win…" 18, "every day…" 18;
  - town: "stand to win…" 23, "its right to rule…" 20, three at 17;
  - city: "the neighbours they speak for have stopped trusting each other" 27, "people look to it first for an answer" 25;
  - metropolis: the same two, 28 and 23, and "it governs…" 17.

**Rows changed (E):**
- Only `loses` and `split` rows changed; no other key moved; no row's power, stake or key moved.
- CRISIS: 696 of 2,238 rows changed.
  - By key and system: loses public_legitimacy 235, defense_readiness 94, trade_connectivity 86, social_trust 64,
    tax_revenue 48, law_order 12, healing_capacity 4; split 157.
  - By kind: loses occupied 61, monster_pressure 52, under_siege 51, indebted 50, wartime 47, insurgency 42, … (all 15
    kinds).
- ALL: 195 of 618 rows changed. ALL-C: 143 of 352.

**Two towns, as the owner reads the Crisis tab's Stakes (base → tip):**
- `b7-under_siege-town-1`:
  - "The Guard split · gains and loses by it at once" → "… · has as much to gain from it as to lose";
  - "The Town Council loses · its own people feel the crisis first" → "… · people look to it first for an answer";
  - "The Merchant Guilds lose · their own people feel the crisis first" → "… · their trade is the first thing the crisis
    cuts";
  - "The Craft Guilds lose · …" → "… · they live by trade, and trade is what suffers".
- `b7-insurgency-town-0`:
  - "The Religious Authorities split · gains and loses by it at once" → "… · stand to win by it and to lose by it alike";
  - "The People's Council split · …" → "… · stands to win by it and to lose by it alike";
  - "The Town Council loses · its own people…" → "… · people look to it first for an answer".
- The lever hook (Plot Hooks and the Tonight sheet), e.g. `frame-calm-city-24`: "…the Guard loses most, because its own
  people feel the crisis first." → "…because it has to find the hands to keep watch."
- Hooks carrying "because" on 45 B7 births: 27 → 27. The truth gate drops none.

## 4. The proofs

**(a) B7's pool (CRISIS, 360) and the 330-town calm pool, base vs tip** (E; `proofA.mjs`):

| What | Towns | Identical |
|---|---|---|
| Crisis towns with no `loses` or `split` row: record and owner's page | 11 | 11 |
| Crisis towns, every non-reason leaf (record and page with stake reasons blanked) | 360 | 360 |
| Crisis towns with such a row, record whole | 349 | 13 (they drew the old wording) |
| Calm pool (`frame6/tools/pool.mjs` 55: tried 484): record and owner's page | 330 | 330 |

- In the 360 crisis towns, 0 rows other than `loses` and `split` changed.
- CF12's W4 towns (`frame-calm-town-20`, `-town-80`, `-city-12`, `-city-14`, `-city-49`, `-metropolis-51`) are identical,
  6 of 6.

**(b) A forced two-crisis pool** (E; `proofB.mjs`):
- The pool: `config.stressTypes: [a, b]`, every unordered pair of the 15 kinds (105 pairs), one seed a tier, so 630 towns
  and 1,260 casts. Every kind holds a `loses` or `split` row; 628 towns hold one.
- **Every cast role is byte for byte the same: 1,260 of 1,260.**
- Absences: 0 moved. Stake keys: 0 moved. A stake's power or stake: 0 moved.
- Stake reasons that differ: 2,541.
- No role moved, so this STOP condition is not met.

**(c) Confinement, `334f9fb68 → 4eea702d8`** (E; `tools/confinement/trees.mjs --words=none`):

| corpus | documents | identical | non-string differences | differing strings | fields |
|---|---|---|---|---|---|
| golden 525 | 525 | 9 | **0** | 1,752 | `stress.cast.stakes[].reason` 876 (516 docs) and its `stressors` alias 876 |
| census 720 | 720 | 301 | **0** | 1,362 | `stress.cast.stakes[].reason` 653 (407), `stress[].…reason` 28 (12), and their aliases |

- Every differing stake reason was read by key (`confkeys.mjs`):
  - golden: loses → loses 689, split → split 187;
  - census: loses → loses 558, split → split 123;
  - 0 with a moved key or row.
- No hook string is stored, so none is in the confinement. The hooks that carry the reason move at render only (§3).

## 5. Red first, the pins, the stored figures

**Red first.** `tests/domain/crisis/stakeReasonLines.test.js`:
- On the base tree (`git archive 334f9fb68`) **10 of 11 are red**:
  - "every pre-SR1 literal stands byte for byte, and crisisCast.js re-exports that one set";
  - "the loses pools are keyed by the systems a loss can match; …";
  - "no loses wording repeats the cast's brunt line for its system";
  - "every text a row can hold maps to its key: …";
  - "any other text, or no text, has no key";
  - "b7-under_siege-town-1: each loser says its own system's wording …";
  - "the pick is the keyed hash: …";
  - "each draw is noted in the presumption ledger under its pool …";
  - "b7-plague_onset-town-1: the brunt's losers hold a split power whatever split wording it says …";
  - "a saved town's pre-SR1 loses and split reasons print as stored …".
- 1 is green on both sides: "the page routes a stored untouched row by its key …".
- At the tip: 11 of 11.

**Pins moved, re-recorded by cause** (each the stored loses/split reason, or the hook carrying it):
- `tests/domain/crisisCast.test.js`, "rule 11: every faction gets exactly one stake and one reason": a reason is now a text
  of the closed set (`stakeReasonKey`), in its power's number.
- `tests/domain/tailCrisisBatch3.test.js`, "no FALSE words print, and the line the record bears prints in their place"
  (r2s-insurgency-town-0, 20875): "…because the danger lands first on those it arms."
- `tests/domain/tailCrisisBatch4.test.js`, "every KEEP sibling still prints" (r2s-famine-town-1): "Merchant oligarchy loses
  · its right to rule is what the crisis puts to the test".
- `tests/components/crisisStakeFollowups.test.jsx`, C2B (b), "b7-under_siege-town-1: the Merchant Guilds and the Craft
  Guilds lose in their own number …". It replaces "… lose by "their own people"; the singular loser keeps "its"".
- `tests/domain/tension/troubleWeight.test.js`, "6 towns in crisis, one a tier: the sheet digests …". The sheet differs in
  one leaf, `hooks[n].text` (the "because" clause), and in nothing else (E: `sheetdiff.mjs`):
  - frame-calm-town-6: eae16131620269ec → 7f8fea0ab7b08fa1;
  - city-24: 4545a9abe27449f1 → edd1a8338c5ec9a9;
  - metropolis-0: e3bb76cf91977d0f → 7e775f15f6b2628f.

**Stored figures moved, signed by nobody.** These are red at both ends with the same 11 failing titles; nothing was
re-recorded. All are base → tip:
- Generator golden master: 521 → 525 of 525 rows unequal. 516 documents move (confinement), and the 4 matching rows no
  longer match.
- `dmLayerGoldenIsolation` A7: 521 → 525.
- `espionageDormancyFence` FENCE 1, the driven hash: `9dc8b4dd…` → `e758afdc…` (committed `9829e655…`).
- `generationForkCensus` A1 control row: `f1a55652…` → `e93989aa…` (committed `71ea4d5f…`).
- `pipelinePinnedMode` A1/A2/A5 and `pipelinePinnedChoosers` A1: 40 → 41 golden rows moved.
- `institutionBudgetPromise` "sixty seeds": 50 → 54.
- `dossierProseManifest` DRIFT: 1,050 → 1,050.
- `worldFactRederive` A7: 7 → 7.
- `tuningRegister`: no new numeric table.

## 6. Gates (E, every run to a file)

**The gate files, 87 test files** (`tests/domain/crisis`, `tests/domain/tension`, every importer of `crisisCast.js`,
`crisisPage.js`, `crisisHooks.js`, `crisisPrint.js`, `journalPages.js`, the data file, and `frameShareVeil`):
- At the first run: 5 failed, 716 passed, 1 expected fail.
- The 5 are the pins above, re-recorded.
- At the tip (`4eea702d8`): 86 files, **721 passed, 1 expected fail, 0 failed**.

**`tests/lint` whole at the tip:** 220 files, 3,265 passed, 6 failed. Red only on:
- `tuningRegister` (the known three rows);
- `sovereigntyLightingContract` (the lighting census: a test file was added; FRAME-7 refreezes it);
- **`presumptionClasses.walker`** (2 titles) and **`presumedThings.walker`** (2 titles). These are SR1's: the six moved
  literals.
  - Each is the same text, the same hash, banked under `src/domain/crisis/crisisCast.js`, and now found in
    `src/data/crisis/stakeReasonLines.js`.
  - presumptionClasses: `1b6ce4bda88a0124` (warDivides, outside), `e2d354fb58d85754` (someHoldDebt, sovereign),
    `f752da5c98cfa973` (holdsDebt, sovereign).
  - presumedThings: `c9dfc07fb36b9cc3` (gainsVacuum, armedForce), `6362016ab7cd7eab` (gainsChurch, temple),
    `735fba0c13964804` (gainsOccupier, occupation).
  - The debt is unchanged: 1,785 hits, 1,785 banked. The brief's "every text moves" forces this.
  - The doors bank only a literal that stood in the same file at base, and BG1 gives the registers to their seats, so the
    six rows' file key is NOT moved here. **It is owed to FRAME-7 or the chair: re-key six rows, no new debt.**
  - None of SR1's 25 new wordings hits either walker.

**Other gates:**
- `negativeAssertionAnchor` and `poolDominance`: red at the first run, cured in the commit (markers; `--bank-new`).
- `typecheck:ratchet`: 167 / 167. `typecheck:domain:strict`: 1,113 / 1,113.
- eslint on the touched files: 0.

**First paint** (`npm run build`, then `VERIFY_DIST=1` `vendorPdfLazy` and `generationWorkerLazy`), against the lane's
base:
- raw **1,177,668 = 1,177,668** (+0);
- gzip **374,651** vs 374,669 (−18);
- **Brotli 314,478 vs 314,371 (+107)**;
- the worker **2,590,851 vs 2,588,252 (+2,599)**: the new wordings, and not first paint.

**The data file is NOT in first paint.** Its words are in `data-lazy-*`, the generation worker, and the two other workers.

**Per file, base build vs tip build:**
- Every first-paint file has the same raw size.
- Only `engine-core` and the entry `index` differ in bytes. Their only differences are chunk-hash file names and the
  minifier's export-alias letters (`bh as Xl` → `bi as Xl`). After normalizing the hashes, 6 residual sites remain, all
  aliases.
- So the Brotli +107 B is compression noise from renamed chunks, not content.
- It is still a rise by the brief's letter, so it is reported as the STOP condition. No ceiling was raised.

## 7. For the security reader

- No new holder, no new name, no new fact. A stake reason says why a POWER loses or splits, in that power's number. A
  person is never the subject, so no "it" is said of a person. No wording names a member's house or a power's
  description, and none speaks of how the cast was dealt.
- The shared record still carries the cast's stakes (hidden powers' rows dropped by `publicSafe.js :: dropStakes`), so a
  shared JSON holds the new wordings where it held "its own people…".
- The Crisis tab is not mounted on the gallery page or the party link. The PDF and the journal are the owner's.
- The lever hook (Plot Hooks and the Tonight sheet for the owner and the player) carries the new loses wording after
  "because", as it carried the old.
- What I would test: the gallery and party-link renders hold no SR1 wording outside the record's stakes (unchanged
  surfaces).

## 8. Scripts (scratch `…/scratchpad/SR1/`, not committed)

`dump.mjs`/`dumpK.mjs` (SR0's births; the tip reads `stakeReasonKey`), `fixkey.mjs`, `chair.mjs`, `share.mjs`,
`sr1share.mjs`, `proofA.mjs`, `proofB.mjs`, `confkeys.mjs`, `sheetdiff.mjs`, `twotowns.mjs`, `fpcmp.mjs`. The confinement
births are deleted once this file is written.
