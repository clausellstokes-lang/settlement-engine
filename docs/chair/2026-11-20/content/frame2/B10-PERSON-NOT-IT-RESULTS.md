# FRAME-2 · B10 — a person in the crisis cast is never "it": results

Builder B10 of FRAME-2, on `frame2-b10` from `8df635b61`. Brief: `B10-PERSON-NOT-IT.md` (this folder).

## The census: every reason that can call a person "it"

The cast's closed vocabulary was read whole (`CAST_REASONS`, `STAKE_REASONS`, `CAST_ABSENCES`, `CAST_REASON_SIBLINGS`,
`CAST_CRISIS_SIBLINGS`) against the rows a PERSON can hold (`npcRow`, the linked rows, the temporary lever, the DM's
rows). Stakes and absences are never stored on a person's row. Three families say "its" of the row's holder and reach
a person:

| reason (key) | the words | who holds it |
|---|---|---|
| `waverer` (the known one, B5's 18) | "its power could go either way" | a person only (`wavererCandidates`) |
| `instigatorGains` (**new**) | "its power gains from the crisis" | a member of a gaining power, or the power |
| `bruntBase.*` except `public_legitimacy`, and their declared siblings (**new**) | "its people tend the sick", "its people stand on the walls" / "… stand guard", "its people stop trusting their neighbours", "the hunger falls first on its people" / "the strain …", "its people take in the newcomers" / "its houses are where the crisis is felt first", "its people do the work …", "its trade is cut", "its income dries up first", "its own ranks begin to split", "its people keep an order that is failing", "its streets are where the crime lands" | a member of the house hit whose role touches the base, or the house |

Not the holder's "it", and left: `bruntBase.public_legitimacy` ("the blame falls on the house, and its good name …": the
house's, named first; SW-6 B3), `targetSeatContested` / `scapegoatSeat` ("the right to it": the seat), `targetLinked`
("the occupation's … its local face"), `leverInstitution` (an institution's row only), every stake and absence (a power's
or nobody's). B5's census saw only the waverer because its (D) read pronouns against `gender`, and "its" is no gendered
pronoun; the instigator's and the brunt's rows were inside its (C) count.

## Measure first

Two pools, each born by `generateSettlementPipeline(…, null, { seed, customContent: {} })`:

- **the test's pool** (B5's `bornPool`, 120 towns, 60 in crisis), and
- **B10's pool**, 396 towns: 48 calm (8 a tier, `{ settType }` alone, a birth with a crisis set aside, seeds
  `b10-calm-<tier>-<i>`) and 348 in crisis (`{ settType, stressTypes: [kind] }`, every kind × every tier its gate allows,
  4 each, seeds `b10-<kind>-<tier>-<i>`). Scripts: `measure.mjs`, `compare.mjs` (kept in the builder's scratchpad;
  their logic is the test's reader plus a leaf diff).

Stored strings on a person's row that call that person "it", BEFORE → AFTER:

| role | test pool | B10 pool (by kind) |
|---|---|---|
| waverer | 18 → 0 | 61 → 0 (recently_betrayed 13, succession_void 12, insurgency 11, religious_conversion 11, politically_fractured 9, slave_revolt 5) |
| instigator | 10 → 0 | 20 → 0 (succession_void 20) |
| brunt | 8 → 0 | 13 → 0 (plague_onset 6 "tend the sick", monster_pressure 4 "stand on the walls", one of them next in line, mass_migration 3 "stop trusting") |
| **all** | **36 → 0** | **94 → 0** |

After, on the test pool: waverer "her" 12, "his" 6; instigator "her" 6, "his" 4; brunt "his" 6, "her" 2. Every cast
holder in both pools carries a `gender`; "their" is reached only where none is given (the hand-built town below).

## Red first

`tests/domain/frame2NamesRule.test.js`, a new case beside kind (D): "crisisCast: no stored reason on a person's row
calls that person "it"; the pronoun is the person's own". It reads every `cast.roles[]` row of kind `npc` on the pool,
masks the three "it"s the sentence itself names (the seat, the house, the occupation), and fails on any "it"/"its" left,
or on a "her"/"his" against the person's `gender`.

- At `8df635b61`: **red, 36** (waverer 18, instigator 10, brunt 8).
- At the fix: **green, 0**.

The file's other red at the tip is not this unit's: "reads every file's output (the pool is not empty)" fails at
`8df635b61` too (`read.tonightSheet` 97, floor 100; measured on a copy of the file at the base).

## The fix (one source file: `src/domain/crisis/crisisCast.js`)

- `HOLDER_ITS_REASONS`, the closed form, declared beside the sibling tables: the vocabulary's own sentences whose one
  "its" is the holder's (`waverer`, `instigatorGains`, every `bruntBase` sentence but `public_legitimacy`). No new
  sentence, no new literal: the set is built from the vocabulary's own values.
- `personReason(reason, n, key)`: a reason drawn from a sentence of the set says the person's own possessive for its
  "its": "her" for `gender` female, "his" for male, else "their". A possessive, so no verb moves. Any other reason is
  returned unchanged.
- `npcRow(n, role, reason, key = reason)` stores `personReason(…)`: filled where the row is written. The brunt's member
  row passes the sentence it resolved from as `key`, so a declared twin ("its people stand guard", "the strain falls
  first on its people", "its houses are where the crisis is felt first", each holding "its" once) is read by its
  original and no sibling pool is unwrapped (a first draft that listed the twins' texts tripped the strip ban,
  `tests/lint/presumedThings.walker.test.js` ARM 3; the form landed reads no pool). Probed on a hand-built town: Ren Hale
  (female) "the strain falls first on her people", the Craft Guilds row "… on its people". No born pool reached a twin
  on a person's row.
- `factionRow` and the institution rows are untouched, so a row held by a POWER keeps "its". The "; next in line …"
  tail is appended after, unchanged. `CastNpc` gains `gender` (typedef only).

## The proof

On B10's pool (`compare.mjs`, `JSON.stringify` of the whole stored record, sha256, before and after):

- (a) **calm towns: 48 of 48 byte-identical.**
- (b) **crisis towns whose cast holds no such row: 263 of 263 byte-identical.**
- (c) **crisis towns with one: 85, every one moved, 188 differing leaves, and every leaf is a `cast.roles[i].reason` on a
  person's row that said "its" and now says that person's own possessive** (94 rows, each stored twice: under `stress`
  and again under `stressors`). 0 leaves of any other kind.

## The pins and goldens this moves (none re-recorded)

Each was green at `8df635b61` and is red at the fix; each moved leaf was field-diffed, base against fix.

1. `tests/property/generatorGoldenMaster.test.js` · "every config produces byte-identical output to the golden master":
   **5 of 525 rows**: `metropolis|germanic|coastal|port|civilized`, `metropolis|arabic|mountain|road|civilized`,
   `metropolis|mesoamerican|mountain|road|civilized`, `metropolis|south_asian|coastal|port|civilized`,
   `metropolis|south_asian|mountain|road|civilized` (seed `golden-master-v3`). Each moves ONE row stored twice:
   infiltrated · instigator · "its power gains from the crisis" → "her power gains from the crisis". The golden's crisis
   rows are 516 (infiltrated 480, famine 36); **the waverer is cast in none of them** (infiltrated is engineered: its one
   occasional role is the collaborator; famine is natural: exploiter and scapegoat). Base: 525 of 525 green.
2. `tests/generators/institutionBudgetPromise.test.js` · "every one of sixty seeds is byte-identical with the density
   factor forced to 1.0": **6 of 60** (`x46-promise-` 21, 39, 51, 52, 53, 57), each only these reasons (×2 copies):
   waverer "its" → "his" (21, 52, 53), "her" (51); instigator "its" → "his" (51); brunt "its people tend the sick" →
   "his" (39), "its people stop trusting their neighbours" → "her" (57).
3. `tests/domain/crisisCast.test.js` · "rule 1: the one who bears the brunt is the least powerful whose role touches the
   base the crisis hits": pins the hand-built Ren Hale (no `gender`) at `CAST_REASONS.bruntBase.food_security`; the
   stored reason is now "the hunger falls first on their people". The pin holds the fault itself.
4. `tests/domain/crisisCastSeatAndAccess.test.js` · "the readers' two empty seats: no role, stake or hook says the rival
   outweighs whoever holds the seat": `toBe(CAST_REASONS.instigatorGains)` on `rpf-town-succession_void-13` and
   `rpf-village-succession_void-13`, whose instigator is a man: now "his power gains from the crisis". What it guards
   still holds (no rival is said to outweigh an empty seat); its equality reads the vocabulary's power form.
5. `tests/generators/people/castDerived.test.js` · "every person a cast names is on the roster; a power-drawn person holds
   a membership in a power of that relation": its `relationFor` keys a row by the vocabulary's exact text, so a person's
   waverer, instigator and brunt rows no longer match and are read as not power-drawn: **the figure "the corpus draws
   people from powers" falls to 444 against its floor of 500**. Those rows' membership check is skipped, not failed.
   The cure is the reader's (key the person form back to its sentence), not this unit's file.
6. The golden corpus's other readers, each red on the one golden row `metropolis|south_asian|mountain|road|civilized|
   golden-master-v3` (in their 41-row slice of the 525; the same leaf as item 1):
   `tests/generators/pipelinePinnedChoosers.test.js` · "A1 — the null change: an unpinned run and pins {} leave the golden
   corpus byte-identical"; `tests/generators/pipelinePinnedMode.test.js` · "A1 — the null change: no pins and pins {}
   leave the golden corpus byte-identical", "A2 — the lift moves nothing: the golden corpus, the draw count and the
   one-stream shape", "A5 — EM-R1b: a supplied transient chooser is still handed back, and the unpinned path is inert".
   They read the committed manifest; they go green with item 1's re-record.

Green at the fix, read for this unit: `tests/property/dossierProseManifest.test.js` and `tests/pdf/goldenViewModel.test.js`
(the composed prose and the PDF view model do not move); the hand-built hook pins (`crisisHooks.test.js`,
`plotHooks.test.js`, `displayDrawSites.test.js`) build their rows by hand and do not go through `npcRow`.

## Gates (each to a file, read by `scripts/gate-tail.sh`)

- `tests/domain/frame2NamesRule.test.js`: red at `8df635b61` (36), green at the fix (the base's own red, above, stays).
- `tests/domain/crisis` and every test file that imports `crisisCast.js` (35), with `dossierProseManifest`,
  `goldenViewModel`, the golden master and the presumed-things walker, at the landed form: 497 passed, 1 expected fail,
  6 failed: items 1 to 5 above and the base's red. The presumed-things and presumption-classes walkers: green.
- The other suites that force a crisis and pin bytes (`stressType`/`stressTypes` beside a hash or golden, 22 files, plus
  the pinned-mode, fork-census and declared-pool suites): green but item 6's four.
- The proof scripts re-run at the landed form: the stored records are byte-identical to the first draft's on all 396
  towns, and the proof above holds unchanged.
- `npm run typecheck:ratchet`: OK (167, ceiling 167). `npm run typecheck:domain:strict`: OK (1113, ceiling 1113).
  `npm run lint`: 0 errors (38 warnings, none in these files).
