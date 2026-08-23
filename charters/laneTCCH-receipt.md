# laneTCCH receipt — TC-CH-COMPILE (CATALOG-HYGIENE charter compile)

STARTED 2026-08-23T19:14:47Z
MARK: [OPUS-RUN . FABLE-VALIDATION OWED] (ODQ §484)
BASE: claude/composite-r4 = f1e4d5150748f13cc27fbbb2d34db614d49d7620
  tip subject: test(MF-UC4 landing): pay the sixth flag-bill surface — the covering-array flag domain (ODQ §489)
DISK at start: 19,215,492 KB available on / (threshold 3,000,000 KB) — PASS
LANE: SOLO, chair-tier compile. READ-ONLY on the main repo; private worktree at $SP/laneTCCH-tree.
DELIVERABLE: $SP/draft-CATALOG-HYGIENE-PLAN.md

## RESUME POINT 2026-08-23T19:14:47Z
(a) PROVEN: base sha captured; disk checked.
(b) IN FLIGHT: worktree creation; input reads.
(c) NEXT: read ODQ §491/§488.2/§485.2/§476/§462/§488.3/§464/§481/§484; then dossiers; then live code.

## RESUME POINT 2026-08-23T19:17:59Z
(a) PROVEN: worktree $SP/laneTCCH-tree detached at f1e4d5150, package-lock cmp EXIT=0 vs chair-baseproof-b10ed1a1, node_modules cp -Rc 468 entries, /tmp/chc made, node v24.12.0, vitest 4.1.8.
    READ WHOLE: ODQ §491/§492/§488/§489/§485/§476/§462/§464/§484 (snapshot at $SP/CH-odq-snapshot.md, 20158 lines from review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md).
    READ: R-INST-5 §Σ (law map, G1-G8, R1-R14, the 32-entry verdict table with magicLicense column), §L items 44-54 (item 53 = the live experiment owed).
    READ: R-INST-6 §Σ.2 (16 gaps E1-E16 + D6-1/D6-2), §Σ.3 (the executed facet simulation over 28 criminal rows), §Σ.4 verdicts, §0.2 the two catalog defects, L.14 Kidnapping ring.
(b) IN FLIGHT: live-code measurement pass (FACET_INFERENCE, facetOf, magicFilter, magicProfile, institutionProbability, the catalog, interiorTemplates, the packet machinery).
(c) NEXT: the measured-home table §0; then the scripted catalog-wide audits (regex before/after; minTier vs block over all 311 rows).

## RESUME POINT 2026-08-23T19:25:34Z
(a) PROVEN — the CH-1 measurement is COMPLETE and settles R-INST-5 ledger item 53 (the owed live experiment):
    - minTier audit over all 311 rows: 36 rows carry minTier; 26 REDUNDANT, 10 ABOVE-BLOCK, 0 BELOW-BLOCK.
      The ABOVE-BLOCK class is TEN, not five: R-INST-5's G2 named 4 + Dragon resident; R-INST-6's D6-1 added 1;
      FOUR MORE (city/Entertainment: Colosseum/arena, Gambling district, Multiple theaters, Opera house) and
      Planar traders (city/Exotic) were seen by no tranche.
    - reader dependency MEASURED: generators/lookups.js getInstitutionalCatalog(tier) returns the RAW block with
      NO minTier filter (:54-58); assembleInstitutions.js:256 applies the gate BEFORE the toggle read, so a user
      force-requiring an ABOVE-BLOCK row at city gets silence.
    - facetOf resolved LIVE over all 311 rows (CH-facet-base.tsv). Interior-kind tally
      generic 202 / trade 39 / civic 16 / vice 14 / faith 13 / craft 12 / security 11 / learning 4.
    - the mis-inference set is FOUR, not three: Warden's Lodge -> vice, Dragon resident -> vice,
      Charlatan fortune tellers -> security, and **Priest (resident) (village/Religious) -> vice** (unfound by research).
    - R-INST-5's prescribed cure is WRONG for one of them: /fort/ matches "fortune" at a LEADING WORD BOUNDARY,
      so anchoring alone cannot fix Charlatan fortune tellers; the stem must change.
    - naive leading-\b anchoring REGRESSES 4 rows (Blacksmith x2, Sawmill x2) whose craft verdict rides a MID-WORD match.
    - the proposed table (leading \b everywhere; smiths?\b / mills?\b trailing; \bdens?\b and \bcult\b both;
      \bfort\b|\bfortif|\bfortress) changes EXACTLY 4 of 933 cells, all four the mis-inferences, zero collateral.
(b) IN FLIGHT: CH-3 measurements (religiousCenter, L1670, L1112, HK-6), the pin census, the packet machinery.
(c) NEXT: the declared-shift seed sweep; the size-baseline and edge-bundle bills; then write the charter.

## RESUME POINT 2026-08-23T19:50:56Z
(a) PROVEN — every declared shift MEASURED over the 420-settlement corpus (6 tiers x 2 cultures x 7 terrains x 5 seeds,
    generateSettlementPipeline, the UC-1 idiom; control 'none' reproduces the base digest exactly):
    BASE CORPUS DIGEST = 1a4a8d3f85e6424a427167ddc44a5e3d7a0e63a9316dab2894632883cf9c9c84
    - CH-1 anchoring: corpus digest IDENTICAL to base -> the GENERATION PATH IS UNMOVED, no generation golden can move.
      111/420 settlements change an interior kind (Priest (resident) 70, Charlatan fortune tellers 26, Warden's Lodge 17,
      Dragon resident 6); roster unchanged in all 420; hasVice flips true->false in 70 villages (DARK: the flag
      underwaysOrganicFoundingEnabled is ABSENT from DEFAULT_SIMULATION_RULES, measured).
    - CH-3 religiousCenter (drop the group from the two city rows): 81/420 rosters change, ~130 distinct names move.
      MECHANISM MEASURED: assembleInstitutions.js:323 returns BEFORE the rng.chance draw, so un-suppressing the row
      consumes a draw and reshuffles the whole downstream sequence.
    - CH-3 minTier DELETE (10 above-block rows fire at their own tier): 97/420 change; Colosseum +28, Multiple theaters +27,
      Fighting pits +23, Opera house +21 -> a CONTENT change, refused.
    - CH-3 minTier MOVE (into the block the minTier names): 108/420 change and the naive move CLOBBERS the city's own
      'Smuggling network' row (69 settlements lose it) -- a name collision across blocks.
    - R-INST-6-1 facets: 0/420 roster or kind change; corpus digest MOVES (the facets key is spread onto the record);
      deriveStrataExistence goes from zero seeds to one INSTITUTION_FACET seed on both rows (measured end to end).
    - priorityCategory run: 0/420 roster change; digest moves; the district affinity moves military -> merchant/criminal.
    - CH-2 model (licence + 4 gate rewrites) over 2100 magic-axis cases: 361 change; 0 at dead and 0 at pm0.
(b) IN FLIGHT: the CH-1 focused battery (re-fired); writing draft-CATALOG-HYGIENE-PLAN.md.
(c) NEXT: the charter sections 0 through Sigma, then the FINAL.

## FINAL 2026-08-23T20:02:19Z

**DELIVERABLE:** `$SP/draft-CATALOG-HYGIENE-PLAN.md`, 82,221 bytes, C0 = 0.
Receipt C0 = 0. No emojis. Nothing committed; the worktree is pristine
(`git status --porcelain` shows only untracked `CH-*.mjs` measurement scripts);
the main repo was never written.

**BASE:** f1e4d5150748f13cc27fbbb2d34db614d49d7620. ⚠ The branch ADVANCED during the lane to
00e7af612 (MF-UC2 landed AT slot f1e4d515). Checked, not assumed: `git diff` over all ten
CH-touched source files across that range is EMPTY, so every measured home holds at the new
tip. Two figures restated in the charter: the census tuple is now 2515/366/2149/20854/5807
(:6049) and the manifest is 168 packets / 0 non-terminal.

**MEASURED-HOME TALLY (charter §0, 40 rows):** 24 CONFIRMED · 9 CORRECTED · 3 REFUTED · 4 NEW.

**DECLARED-SHIFT FIGURES PER CAR** (420-settlement corpus; base digest
1a4a8d3f85e6424a427167ddc44a5e3d7a0e63a9316dab2894632883cf9c9c84, control reproduces it):
| car / item | rosters changed | interior kinds changed | corpus digest |
|---|---|---|---|
| CH-1 anchoring | 0 / 420 | 111 / 420 | **IDENTICAL** |
| CH-1 hasVice (DARK) | -- | -- | 70 villages flip true to false |
| CH-2 model, all four gates | 361 / 2100 magic cases | -- | moves |
| CH-2 without the P2 arm | 273 / 2100 | -- | moves |
| CH-3 religiousCenter | 81 / 420 | 81 | 6127eae7... |
| CH-3 minTier DELETE (refused) | 97 / 420 | 97 | 9d710694... |
| CH-3 minTier MOVE (refused) | 108 / 420 | 108 | 3d2b69f2... |
| CH-3 minTier reader fix (recommended) | 0 / 420 | 0 | unchanged |
| CH-3 R-INST-6-1 facets | 0 / 420 | 0 | a542cc2e... (+1 undercity seed per row) |
| CH-3 priorityCategory run | 0 / 420 | 0 | 58446037... (district placement moves) |
| CH-3 prose items (L1112, HK-6, Kidnapping ring) | 0 | 0 | desc bytes only |

**EXECUTED BATTERY at the CH-1 patch, mutexed:** `Test Files 7 passed (7)`,
`Tests 110 passed (110)`, **TRUE_EXIT=0** (/tmp/chc/ch1-after.log) --
generation.test.js (the golden master) + cohesionWeave + interiorModel + the two undercity
tests + underwaysInstitutionParity + memoryHorizon. The patch was in the tree when it ran.

**PINS EACH CAR RE-RECORDS** (charter §4.5 holds the full grep-driven arm per car):
- CH-1: none on the generation side (digest identical, golden green). Interior fixtures
  (tests/fixtures/interiorFixtures.js) and tests/interior/interiorModel.test.js only if they
  name one of the four rows -- both were GREEN at the patch, so the re-record list is
  currently EMPTY. Plus the census tuple (+1 file / +1 credited / +N titles) for the new walker.
- CH-2a/2b: tests/lint/arcaneClassifierCensus.walker.test.js (allowlist entries are keyed to
  the EXACT alternation signature -- every rewritten alternation needs its entry updated WITH
  a reason, and its :319-331 arm asserts institutionProbability still imports the canonical
  detector); tests/domain/arcaneIdentity.test.js; tests/lib/instantWorld/mundaneRealmAcceptance.test.js
  (21 pins, the dead-magic census); tests/generators/generationWorldLaw.test.js; the census tuple.
- CH-3: tests/generators/metropolisCatalogReachable.test.js (its RATCHET arm WILL red under the
  recommended reader fix and must be amended deliberately); tests/generators/dossierContent.test.js
  (the desc walker/register/canonical-at-zero arms, for HK-6 + L1112 + Kidnapping ring);
  tests/data/priorityCategoryPlausibility.test.js; tests/domain/undercityStrataExistence.test.js
  and tests/data/underwaysInstitutionParity.test.js (R-INST-6-1's seeds); plus every generation
  golden that carries a city/metropolis roster, for the religiousCenter item.

**NEEDS A CHAIR RULING BEFORE THE TRAIN BUILDS -- but NOTHING blocks CH-1:**
CH-1 is fully measured, its battery is green at the patch, and its one judgment (J-CH-1) is
in scope. It can be dispatched the moment the charter is ratified. The seven open questions
in charter §6 block CH-3 (1-3) and re-shape CH-2 (4-7). The three that matter most:
 (a) J-CH-3-1 CONTRADICTS §491's "the tier block is the structural truth" on the measurement
     -- the charter recommends closing the minTier class at the READER (0 shift) over either
     data rewrite (97 and 108 of 420). This is the charter's one substantive divergence.
 (b) §491 says THREE shelf-as-gate paths; the measurement says FIVE. CH-2 must be re-chartered.
 (c) J-CH-3-2: religiousCenter is 81/420 and a whole-roster re-roll -- the chair should rule it
     against THE PROMISE explicitly rather than let a repair car carry it silently.

## FINAL ADDENDUM 2026-08-23T20:07:07Z — two self-caught defects, both cured before hand-off
1. The first draft named `tests/generation.test.js` "the generator golden master". WRONG —
   the golden master is `tests/property/generatorGoldenMaster.test.js` (sha256 over
   JSON.stringify(settlement)). RUN at the CH-1 patch: **1 file / 3 tests / TRUE_EXIT=0**
   (/tmp/chc/ch1-golden.log). The charter carries the correction and both receipts.
2. §3.4's "no engine reader enforces the tanner prose" was asserted, then CHECKED: the town
   map DOES have a downwind/downstream rule (`townLayoutV2.js:209`) but it reads a QUARTER's
   own `location` prose from `spatialGenerator.js:57-61`, never the catalog desc
   (`townMapModel.js:516`'s haystack is name+priorityCategory+category+tags). Claim stands,
   now with its mechanism. AND the check found the overstatement has **FIVE spellings**, not
   one — catalog L1116, descVariants L778/L779, institutionVocabulary L87/L107 — so CH-3's
   prose sweep widened and `institutionVocabulary.js` became a fourth production file, which
   forced J-CH-3-5 (the CH-3 three-way split at the ≤3 ceiling).
Charter final size: 86,536 bytes, 1,164 lines, C0 = 0. Worktree reverted to pristine
(cohesionWeave / institutionalCatalog / institutionProbability all cmp-clean); only untracked
CH-*.mjs measurement scripts remain; the main repo was never written.
MEMORY: three topic files written (facet-inference-anchoring-has-four-traps,
the-magic-shelf-gate-census-is-five-paths, catalog-edits-measure-the-corpus-digest-not-the-roster)
plus three index rows under "Live program hazards". ⚠ MEMORY.md is now 16,061 B against the
~17 KB hard read limit — a FOLD is owed soon.
