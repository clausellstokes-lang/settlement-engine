# Catalog hygiene / MF-CH6 — FAITH IS NOT MAGIC: six words that name faith leave the magic-dependence vocabulary, two druid rows stop claiming arcane, and the keyword list is measured to decide one catalog row of twenty-eight

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `233c35a69ccb67bb3ce2612427ad918a42fc4af8`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-6**. The deity-doctrine car of the
  catalog-hygiene train, after `MF-CH1`, `MF-CH2A`, `MF-CH5`, `MF-CH7` and `MF-CH4` (all
  LANDED at this base) and beside `MF-CH3` (DRAFT, which reserves `institutionalCatalog.js`
  — this packet is minted at the terminal status LANDED, so no change path is reserved and
  no duplicate-path error is raised; the same seam `MF-CH5` landed through).
- **Charter and rulings:** **ODQ §541.8** (the shipped deity-doctrine violation) and
  **§541.9** (`ARCANE_INST_KW` is redundant over the catalog and contradicts the licence on
  five rows), sequenced there onto this car. Classified a **REPAIR** — chair-ruled. It mints
  no capability, changes no schema, no persisted shape, no public API and no paid surface.
  Every figure below is **re-derived at this base by execution**.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed`.

---

## §0 · THE ONE SENTENCE

`ARCANE_INST_KW` answers "does this institution NEED MAGIC TO EXIST?" from the NAME, and it
was carrying six words that name FAITH — `'druid circle'`, `'elder grove council'`,
`'elder grove'`, `'healer (divine'`, `'divine healer'`, `'wandering healer'` — so the engine
asserted that divine healing is a species of magic, against a constitutional doctrine that
says faith is CULTURE and never theology.

## §0.1 · AND THE SECOND SENTENCE, WHICH IS WHY THIS CAR IS SHAPED THE WAY IT IS

**The keyword list was not what decided those rows.** Measured through the live world law at
`magicExists:false`, over the exact entity shape `assembleInstitutions.js:268` builds:

> the magic arm strikes **28 of 311 catalog rows** — exactly the 28 licensed Magic/Exotic
> rows — and **`ARCANE_INST_KW` decides EXACTLY ONE of them on its own: `Dragon resident`.**

Every other row is over-determined. `Druid Circle` and `Elder Grove Council` were struck
three ways over (the `Magic` display SHELF inside `carriesExplicitMagicMetadata`, an `arcane`
TAG, and this list); `Healer (divine, 1st level)` twice over (SHELF and list), plus the
declared `magicLicense: 'low'` reaching `isArcaneInstitution` and `institutionProbability`'s
direct world-fact gate. **Removing a keyword from an over-determined gate frees nothing**, and
A7 of the licence walker now asserts that fact so the theory cannot be re-run by a successor.

## §1 · WHAT CHANGED

| file | change |
|---|---|
| `src/domain/arcaneInstitutionVocabulary.js` | the six faith words leave `ARCANE_INST_KW` (**39 → 33** members), with a header block stating the doctrine, where the six were live, and the over-determination measurement |
| `src/data/institutionalCatalog.js` | `Druid Circle` and `Elder Grove Council`: the redundant `arcane` tag is dropped beside their `religious` one and the licence moves `low` → `none`. `Healer (divine, 1st level)` is **held at `low`** with the reason recorded beside the value |
| `tests/lint/magicLicenceCensus.walker.test.js` | the declared table, the distribution, and **two new arms** (A9 the faith vocabulary, A10 the measured gap); A7 gains the one-row attribution |
| `tests/domain/arcaneIdentity.test.js` | **MG-LAW-2's institution half** — the faction half was already pinned there, the institution half shipped broken |
| `tests/property/generatorGoldenMaster.test.js` + its fixture | the declared shift record and the 30-row re-record |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | the census, 21,049 → 21,052 titles, attributed per file by execution |
| `supabase/functions/_shared/*` (8 files) | the edge-shared regen both source files bill |

**Two logic-bearing production files are modified: ZERO.** `arcaneInstitutionVocabulary.js` is
a zero-import constant leaf and `institutionalCatalog.js` is a 2,526-line data literal;
neither carries a branch. The default hard scope budget's "at most three existing
logic-bearing production files" is not approached, and this classification is stated here
rather than assumed so it can be refused.

## §2 · WHERE THE SIX WORDS WERE ACTUALLY LIVE — measured, not assumed

Over the 276 distinct catalog names:

| word | catalog matches | what it decided |
|---|---|---|
| `'divine healer'` | **0** | free text only |
| `'wandering healer'` | **0** | free text only |
| `'druid circle'` | 1 (`Druid Circle`) | over-determined by SHELF + TAG |
| `'elder grove council'` | 1 (`Elder Grove Council`) | over-determined by SHELF + TAG |
| `'elder grove'` | 1 (same row) | over-determined by SHELF + TAG |
| `'healer (divine'` | 1 (`Healer (divine, 1st level)`) | over-determined by SHELF |

**Two of the six matched no catalog row at all**, so the only names they ever struck were the
ones a PLAYER typed — through `arcaneInstitutionNameFallback` and, because
`filterServicesForMagic` calls `isArcaneInst(instName, '', [])` with neither category nor
tags, through the SERVICES filter, where the keyword list is the sole decider. **That surface
is cured outright**, and A9 pins it in both directions with live positive controls.

## §3 · ⛔ §541.8's PREMISE IS REFUTED FOR ONE OF THE THREE ROWS

`Healer (divine, 1st level)` is **held at `magicLicense: 'low'`**. Its own authored desc is
`'Basic healing spells. Cure Wounds (10 GP).'`, and the estate's shared prose detector agrees
with the engine about it:

    textAssertsFunctionalMagic('Basic healing spells. Cure Wounds (10 GP).')  ===  true

The entry as authored is a **first-level SPELLCASTER the catalog files under faith**, not a
cultural healer the engine wrongly convicts, and a world where spells do not work genuinely
cannot hold it. Dropping it to `none` would put a Cure Wounds caster in a world with no
spells — shipping a contradiction rather than curing one.

⭐ **THE DOCTRINE GAP IS REAL AND IT IS A CONTENT GAP.** The catalog holds **no cultural divine
healer at all** for a magic-free world to keep; the only village healing row is the
spellcaster. Filling that is a NEW CATALOG ROW — new content, the owner's call — and it is
recorded here rather than folded into a repair car. The row's mundane TAG and its `low`
licence therefore still disagree, and that disagreement remains pinned as the licence
walker's single `LICENCE_OVERRIDES_TAG` entry with the whole account beside it.

`Elder Grove Council` carries the same hazard in one clause — its desc ends "Found in cities
that have made peace with **nature magic**", which the same detector reads as an assertion —
but the institution itself is a council of senior druids who "mediate between urban expansion
and wild places", so the row is re-licensed and the PROSE is left to the car that owns prose.

## §4 · ⛔⛔ THE GATE HALF WAS BUILT, MEASURED AND REVERTED — the smallest split, proposed

§541.9's cure is to route the gates through the declared licence. **It was implemented in full
and swept**: `nativeInstitutionRequiresMagic` reading the declaration first,
`institutionProbability`'s magic multiplier and exotic scaler yielding to it, and
`magicFilter.isArcaneInst` doing the same so generation and the catalog panel answer alike.
It works — at `magicExists:false` over the 525-row grid, `Druid Circle` **0 → 36**,
`Healer (divine, 1st level)` **0 → 48**, `Elder Grove Council` **0 → 17**.

**It also reds a shipped user-facing certification.** The freed rows are filed on the `Magic`
SHELF, and `world_law_magic` in `generationCoherence` reads the record's own taxonomy fields
as claims:

| tree | magic-free settlements holding a `Magic`-shelf row | `world_law_magic` FAILING |
|---|---|---|
| slot `233c35a69` | **0** of 504 | **0** |
| this car as shipped | **0** of 504 | **0** |
| with the gate half | **264** of 504 | **264** |

The evidence templates are `institutions[*].category <= "Magic"` (404),
`institutions[*].priorityCategory <= "magic"` (260), the same two under
`defenseProfile.institutions.magicDef[*]` (149 each), and — not a taxonomy false positive —
`institutions[*].name <= "Druid Circle"` (36), because `textAssertsFunctionalMagic` convicts
that NAME outright.

**So the remaining cure is a train, not a car:** the three shelf-reading gates, PLUS the
receipt's own assertion vocabulary, PLUS the display-shelf question, PLUS two rows of authored
prose. PACKET_STANDARD's rule is explicit — *"If the work cannot fit, the agent stops and
proposes the smallest split"* — so the half that is complete, coherent and zero-roster ships
here, and A10 pins the gap by execution so it cannot be mistaken for an oversight or
half-flipped without a red.

## §5 · THE DECLARED SHIFT — measured over 2,625 settlements

**TOTALITY CONTROL FIRST:** the measuring harness (plain `node` over a `git archive` of the
slot's `src`) reproduces **all 525 committed golden hashes with 0 mismatches**, so every count
below is a count and not a sample.

| magic case | hashes moved | rosters moved | of |
|---|---|---|---|
| `magicExists:false` | **0** | **0** | 525 |
| `priorityMagic:0` | **0** | **0** | 525 |
| `priorityMagic:20` | **0** | **0** | 525 |
| `priorityMagic:50` | 30 | **0** | 525 |
| `priorityMagic:80` | 139 | **0** | 525 |

**No institution's instance count moves by one, in any case.** The golden master re-records
**30 of 525** rows (18 town, 12 village — exactly the tiers the two rows are authored in),
0 added, 0 removed. The complete path-template census is **six templates, all field-level**:

    $.institutions[*].tags[*] changed / removed / .tags.length changed     30 rows each
    $.institutions[*].magicLicense changed                                 30 rows
    $.simulationTrace[*].downstreamEffects[*] removed / .length changed    30 rows

Family one is the tag string leaving. Family two is the licence value. Family three is the
ONE effect that tag drove — `{ target: 'magicCapacity', effect: 'reinforced' }` from
`tagsToDownstream`, which feeds nothing but the trace. **No capacity, economy, magic-profile,
count, name, id or rng draw moves anywhere.**

⚠ **A MAGIC-FREE WORLD IS BYTE-IDENTICAL TO BEFORE, and that is a finding as much as a
figure.** The world law strikes both druid rows by the SHELF, so removing the words changed
what the vocabulary CLAIMS without changing what a dead-magic world CONTAINS. §4 is why.

**THE PROMISE.** Institution tags are stamped at generation and persisted; no store,
migration or rehydration path re-reads `institutionalCatalog`. A saved world keeps its stored
tags and is untouched — only newly generated worlds differ.

## §6 · THE PINS, AND FOUR DELIBERATE MUTATIONS

Three new arms in two ALREADY-CREDITED files (no new test file, so no ratchet is incurred),
plus A7 sharpened. Each mutation was applied to source and the arms re-run:

| mutation | reds |
|---|---|
| re-add `'druid circle'` to `ARCANE_INST_KW` | **A9** (the vocabulary + free text), **A10** (the shelf attribution) |
| `Druid Circle` licence `none` → `low` | **A1**, **A2**, **A5**, **A10** |
| restore the `arcane` tag on `Elder Grove Council` | **A5**, **A8**, **A10**, **MG-LAW-2 institutions** |
| drop `'dragon resident'` and `'dragon'` from the list | **A7** (the one-row attribution) |

Unmutated, the two files run **51 passed of 51**.

## §7 · SIBLING SITES FOUND, MEASURED, AND OUT OF SCOPE

1. **`MAGIC_ROLE_PATTERN`** (`generationContext.js:38`) carries `druid` beside `sorcerer` and
   `warlock`, so a magic-free world can hold no druid NPC either. The same doctrine, a
   different surface (roles, not institutions), and it moves NPC rosters.
2. **`textAssertsFunctionalMagic`** convicts the bare name `'Druid Circle'`. It is the shared
   assertion vocabulary read by the world law's generated-content arm, the roles arm, the
   coherence receipt and the arcane detector; editing it moves generated content estate-wide.
3. **The coherence receipt reads TAXONOMY FIELDS as prose** (`category`, `priorityCategory`),
   which is what makes §4's 264 what it is. A recorded estate hazard, not this car's file.
4. **`customContent.js`'s own arcane pattern carries the ambiguous token `circle`**, so a DM's
   "Circle of the Elder Grove" reads arcane through a vocabulary this car does not own — the
   W-K2 mixed-alternation class, already exempted with a stated reason in
   `arcaneClassifierCensus.walker.test.js`.
5. **`Druid Circle` declares `priorityCategory: 'magic'`** and `Elder Grove Council` declares
   `'military'`. Both are `priorityCategory` slips of the class `MF-CH3` owns (its §3.3 run of
   four), and `district` placement reads that field. Left to CH-3 deliberately; noted so it is
   not re-found as new.
6. **`ARCANE_INST_KW` remains redundant over the catalog** — 24 of 276 names matched, 24 of 24
   declaring a licence, 5 contradicting it (`Alchemist shop`, `Alchemist quarter`,
   `Warden's Lodge`, `Dragon resident`, `Great library`). §541.9's cure is §4's gate half.

## §8 · WHAT THIS CAR DOES NOT TOUCH

`ARCANE_INST_TAGS` (CH-5's, landed), `npcProfile.js` (CH-7's, landed), `districtProfile.js`
(CH-4's, landed), `institutionDescVariants.js` and the three `assembleInstitutions`/`lookups`
files (CH-3's live change paths), `generationContext.js`, `institutionProbability.js` and
`magicFilter.js` (§4, deliberately reverted), and every authored desc.
