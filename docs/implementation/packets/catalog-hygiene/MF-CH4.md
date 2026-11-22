# Catalog hygiene / MF-CH4 — THE GENERATOR'S OWN NAMES WERE NEVER READ: a declared quarter registry replaces a first-match regex sweep that had the criminal quarter and the common residential quarter exactly swapped

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `479992b6e02926f1d375a82ca6f47183b9693667`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-4**, cured by lane **TE-CH4-CURE**. A car of the
  catalog-hygiene train, after `MF-CH1`, `MF-CH2A`, `MF-CH5` and `MF-CH7` (all LANDED) and
  beside `MF-CH3` (DRAFT, which reserves none of this car's change paths).
- **Charter and rulings:** classified a **REPAIR** — chair-ruled, not owner-gated. It changes
  no schema, no persisted shape, no public API and no paid-surface behaviour, and it mints no
  capability. It DOES carry a declared same-seed output shift, disclosed in §4. Every figure
  below is **re-derived at this base by execution**.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed`.

---

## §0 · THE ONE SENTENCE

`districtProfile` classified a quarter by a first-match-wins regex sweep over its name,
description and landmarks — a sweep that had never been shown the generator's own fourteen
authored quarter names — and the unanchored `den` alternate matched the substring in the
Common Residential quarter's own description "**Dense** timber tenements", so **the criminal
quarter and the common residential quarter were exactly swapped on every city in the corpus.**

## §1 · WHAT CHANGED

| file | change |
|---|---|
| `src/domain/districtProfile.js` | `QUARTER_CATEGORY`, a declared registry of the generator's fourteen quarter names, read as `declared ?? inferred`; `den` anchored to `\bdens?\b`; `CATEGORY_TO_ARCHETYPE` reshaped from one archetype to canonical PREFERENCE LISTS; dominant-faction matching moved onto the canonical archetype and the reported archetype corrected to the one matched on |
| `tests/domain/districtProfile.test.js` | a sixteen-title pin block including a registry walker that parses the generator's own `quarters.push({ name: … })` literals and pins the registry BOTH ways, plus an interpolation pin |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | the lighting census re-recorded with its cause and its single-file attribution control |
| `tests/lint/arcaneClassifierCensus.walker.test.js` | one `KNOWN_UNCONVERTED` key re-pointed for address rot, with its dated note |
| `tests/lint/.prose-numerics-baseline.json`, `tests/lint/proseNumerics.test.js` | one row re-addressed for address rot, with its dated note |
| `tests/domain/townCartographyCalibration.test.js`, `tests/fixtures/cartography-calibration-corpus.json` | the drawn-map corpus re-recorded as a declared shift, with a FIFTH RECORD ledger row and two re-derived constants |
| `supabase/functions/_shared/*` | the edge-shared regen this car's source edit bills, taken at the rebased tip |

## §2 · THE DEFECT, MEASURED BEFORE IT WAS CURED

Over a 504-settlement corpus (6 tiers × 84 seeds, 1,696 quarters, no generation errors), the
sweep's misfires were not hypothetical:

| quarter | classified as | on | because |
|---|---|---|---|
| Common Residential | `criminal` | 168 of 168 | "**Dense** timber tenements" hit the unanchored `den` |
| Shadows District | `merchant` | 168 of 168 | "hidden markets" hit `/market/` |
| Noxious Trades Quarter | `merchant` | 164 | "Trades" hit `/trade/` |
| Wealthy Residential | `merchant` | 168 of 168 | landmark "Merchant Estates" |
| Mages' Quarter | `craft` | 45 of 148 | a `guild`/`smith` landmark beats `arcane`, which is pattern #7 |

## §3 · THE DELETIONS — the finding that decided reviewability

Applying the registry with the **shipped** `CATEGORY_TO_ARCHETYPE` would have REMOVED the
dominant-faction row from 332 cards against 45 gained: a net −287 against a 1,423-row
baseline. The cause is that the shipped map named archetypes the engine never produces — over
3,038 faction instances the canonical vocabulary yields **no `craft` and no `civic` at all**,
so `industrial → 'craft'` and `craft → 'craft'` were unconditional nulls.

A naive canonical route introduces a **second** regression of its own: matching canonical
`government` alone drops the Government Quarter's row on 93 of 216 settlements — the ones
ruled by a noble house — because `factionProfile` folds NOBLE and CIVIC into `government`
(measured: canonical `government` 411 + `noble` 359 = 770 = the folded total exactly).

The cure is preference LISTS, each ending in an archetype that actually occurs. Result:
**168 lost, 45 gained, 340 kept-but-renamed, 915 unchanged.** The one surviving deletion class
is earned: all 168 are Common Residential, whose criminal-faction row existed ONLY because of
the `den` substring bug. That row asserted a thieves' guild dominates every common residential
district in every city — a fabrication, not a lost feature — and the card gates the row on
`dominantFaction?.name`, so it simply omits.

## §4 · THE DECLARED SAME-SEED SHIFT

Per 504-settlement corpus / 1,696 districts. This is the honest statement of what moves:

- **category** changes on **1,116** districts
- **wealth band** moves on **515**; **safety band** moves on **713**
- **dominant-faction row**: 168 removed, 45 added, 340 renamed, 915 unchanged
- **map ring** moves on **668**; **wall-embrace** flag flips on **332**
- **fabric join** hits fall 1,571 → 1,276 (the deposit side is a DIFFERENT car and was not touched)
- **printed dossier legend**: mean rows 2.83 → 3.37, carried by 2 of 4 PDF variants
- **settlement-record digest / generator-golden-master: CANNOT MOVE** — `districtProfile`
  appears nowhere in `generateSettlementPipeline.js`; they are structurally blind to it

### §4.1 · ⛔ THE MAP GOLDEN FAMILY IS BLIND, AND ITS GREEN IS NOT EVIDENCE

The three map goldens stay green across a change that moves 668 rings and 332 wall-embraces,
because `tests/fixtures/townMapFixtures.js` builds settlements from **twelve hand-authored
quarter names, none of which is one of the generator's fourteen** — so `QUARTER_CATEGORY` never
fires in them. Their green is a property of their fixtures, not of this change. The
504-settlement differential and the cartography corpus are the instruments that see it.

## §5 · WHAT THE CURE LANE PAID, AND WHAT IT REFUSED

The car's first full gate came back with eleven failures outside the frozen census. Every one
was paid at its own instrument's lawful path; **no census, baseline or ratchet was widened, and
no `DECLARED_OVERRUN` row was added.**

| bill | instrument | cure |
|---|---|---|
| A | lighting census | re-walked at this base by lifting the walker's machinery out of vitest; attributed by a single-file revert |
| B | arcane classifier census | one `path:line` key re-pointed 112 → 122; the alternation is byte-identical at both addresses |
| C | domain any-cast ratchet | the two casts became REAL TYPES — `FactionLike` imported from the module this code joins against |
| D | reader-with-no-writer ratchet | the dead `power.factions` alternate DELETED, returning the inventory to its frozen figures |
| E | prose numerics | one row re-addressed 238 → 373; path, category and snippet byte-identical |
| F | town cartography calibration | re-recorded via `UPDATE_CARTOGRAPHY_CALIBRATION`, with the stacking check run FIRST |

### §5.1 · ⛔ THE HARD STOP THAT DID NOT FIRE, CHECKED BEFORE ANYTHING WAS RE-RECORDED

A re-record over a stacked-geometry regression is the one thing the cartography manifest must
never absorb. `cartoDupExact` was therefore measured LIVE before the update flag was ever set:
it reads **0 at all six tiers**, and over the whole re-recorded corpus it totals **0 of 45,868
drawn buildings**. Every one of the eight W8 failures was a record mismatch. The per-field
signature over all 504 rows confirms the cause: only `cartoBuildings` (281), `cartoRowBytes`
(299) and `cartoDupTranslate` (321) move, while `institutions`, `districts`, `sceneBuildings`,
`dark`, `outcome`, `reported` and `cartoInstitutionRefs` move on **no row at all** — so the
generator did not move underneath the re-record and every canonical institution still draws
its flagship.

### §5.2 · WHAT THE CURE LANE REFUSED TO DO

- **It did not convert the arcane spelling.** `districtProfile.js`'s arcane alternation remains
  a recorded member of the arcane census. Converting it is a separate measured car under
  R-BLD-5, and the registry only removes the misfire for the generator's own fourteen quarters
  — the alternation still decides every authored, imported and legacy quarter.
- **It did not humanize the car's comment figures.** The brief expected them to be new
  prose-numerics debt; measured, they are not in that census and could not be, because the
  detector reads numerics that FLOW INTO A PROSE KEY, not integers written in comments.
  Stripping them would have deleted reviewable evidence to satisfy an instrument that never
  saw it.
- **It did not touch the fabric deposit side**, despite measuring a −295 join regression there.
  Out of scope; disclosed above instead.

## §6 · THE REBASE, AND THE PROVENANCE IT CORRECTED

The slot moved under this lane mid-flight when `MF-CH7` landed. The whole chain was rebased
onto `479992b6e`. Two conflicts, both resolved by the stacked-landing law rather than by text:

1. **Six generated edge artifacts.** Taken wholesale from the replayed commit, verified to
   leave no conflict markers, then **regenerated at the rebased tip**. That regeneration caught
   a fiction a clean-looking tree would have shipped: three `sourceHash` values were still
   describing the PRE-CH7 source, because a meta hashes its transitive INPUTS and
   `npcProfile.js` is in all three AI closures.
2. **The lighting census tuple.** Resolved on RECORDS: CH-7's ledger block kept verbatim as
   history, this car's appended, one tuple line written — and resolved to a syntactically valid
   file first, because leaving conflict markers would have made the walker PARSE-park its own
   census file and corrupt the figure being measured.

⭐ **The DELTA survived the rebase; the TUPLE did not.** The pre-rebase stamp was
21,042/5,851 and is not carried anywhere: the tuple was re-walked at the tree this car ships
in. The cartography corpus was likewise re-measured at the rebased tree and drifted on **0 of
52 sampled rows**, which is the evidence that `MF-CH7`'s `npcProfile.js` change and this car's
district re-classification are independent on the drawn surface.

## §7 · ACCEPTANCE

See the manifest's `acceptanceCases`. The convicting evidence is eleven deliberate mutations,
each applied, run and reverted byte-identical — **two of which were VACUOUS on first run and
were rebuilt**, which is the finding that justifies the discipline: the `den` pin used a
DECLARED name, so the registry short-circuited the very regex it meant to test; and the
canonical-routing pin asserted only non-null, which BOTH routes satisfy.
