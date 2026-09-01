# TE-AGNOSTIC-1 — the setting-agnostic engine vocabulary (ODQ §857)

**Status: the census bill (car 1). Cures land in cars 2 and 3.**

The product is SETTING-AGNOSTIC by law. That law binds the ENGINE: the prose,
vocabulary tables and service names a generated world carries must not read as
one publisher's rulebook. ODQ §857 collected the census and chartered this wave
"guard-safe, before TE-GOLDEN-1". This file is the wave's tracked home: the
census it measured, the cures it made, the rows it deliberately did not touch,
and the three guards a future sweep must not walk into.

---

## 0. What is NOT a tell (and must never be swept)

Half of what looks like a lift is older than the game that borrowed it. A pass
that "de-D&Ds" these would strip genuine period vocabulary out of a
setting-agnostic engine, which is the opposite of the law:

| Kept | Why |
| --- | --- |
| `Druid`, `Druid Circle`, `Archdruid` | The Celtic priesthood. `namingData.celtic.titles.priest` is a CULTURE title, correctly Celtic. |
| `Bard` | Celtic `sage` title, and a Norse personal name (`namingData` given-names). |
| `Paladin` | Russian `templar` title; the Twelve Peers of Charlemagne. |
| `Sorcerer`, `Witch`, `Warlock`, `Mage`, `Enchanter`, `Conjurer`, `Runesmith`, `Diviner` | Plain English / folkloric. |
| `Artificer` | A skilled craftsman or military engineer; sits in a roster beside `Siege Engineer`. |
| `Ranger` | A forest warden. `Scout/Ranger` reads as the office, not the class. |
| `cantrip` | Scots, for a charm or trick, centuries older than the game. Retained where it reads as a word; replaced only where it names a POWER TIER. |
| DM as audience model, `adventurers`, `the party`, `teleportation circle`, `dungeon delving` | §857 records these as DELIBERATE product vocabulary. Not lifts, not strippable. |

The tell is never a fantasy word. The tell is a **rulebook proper noun**
(a spell's Title Case name), a **rulebook scale** (`3rd-level`, `+1`), or a
**rulebook unit** (`GP`).

---

## 1. THE THREE GUARDS

### G1 — the magic-assertion vocabulary is DERIVED FROM THE CORPUS

`src/domain/magicAssertionText.js` holds the ONE reading of "does this text
claim magic works?". Its tokens are phrases, not words, and every one was
derived from a live corpus string. Two independent consequences:

1. **A cure that ADDS an assertion token where there was none convicts a
   mundane row**, and a cure that REMOVES the last token from an asserting row
   acquits a magical one. Either is a behaviour change wearing a rewrite's
   clothes. The wave's own instrument is
   `textAssertsFunctionalMagic` run over EVERY authored name, desc, variant and
   gate reason, base against tip: **4,609 rows, 264 asserting, and the answer on
   every row must be identical.**
2. **A token whose corpus receipt this wave rewrites does not become dead.**
   `src/domain/customContent.js` and `src/domain/arcaneIdentity.js` run the same
   predicate over USER-AUTHORED text, which this repo does not control. Tokens
   are therefore RETAINED and their receipt notes re-derived, never deleted.

### G2 — the alignment token is read by THREE parsers, and the retarget is BY SYMBOL

`warSeatBooks.js:274`, `settlementPolitics.js:1062` and `npcReplacement.js:166`
each parse the stored alignment string with `token.includes('lawful' | 'chaotic'
| 'good' | 'evil')`. `warSeatBooks:305` carries the standing warning. A text
sweep of the word breaks all three silently.

**The cure is therefore a DISPLAY LABEL, not a value rename.** The stored token
stays `lawful_good`; the reader sees agnostic words. Three parsers untouched,
saved worlds untouched, same-seed bytes untouched.

### G3 — institution names are join keys in eight name-matching families

`Healer (divine, 1st level)` is pinned by name in
`tests/lint/magicLicenceCensus.walker.test.js` (four places, including the
census map key), in `tests/domain/arcaneIdentity.test.js`, and in the
ORDER-AUTHORITATIVE generated file `src/data/institutionServiceKeys.generated.js`.
Renaming an institution is a distinct car with its own census and golden bill.
SERVICE names under an institution are a smaller, bounded family and are cured
here.

---

## 2. THE CENSUS

Counted at `1d27accdc`, over `src/`. **57 authored sites** carry a rulebook
tell; **6 are the owner's legal carve-out and are not touched by any engine
lane**; **8 are join keys deferred to a keys car**; **43 are cured by this
wave**, of which 9 are comments or docs (output-neutral) and 34 are generated
output (output-moving).

### 2a. Currency — `GP` (20 string sites + 1 comment)

`GP` is the rulebook's coin abbreviation. Cured to `in gold`, which keeps the
price and drops the system.

| Address | String |
| --- | --- |
| `src/data/spatialData.js:457` | `Cost: 18,250 GP to create.` |
| `src/data/spatialData.js:482` | `250–10,000 GP per station.` |
| `src/data/institutionDescVariants.js:258,259` | Sending Stones station, `250 to 10,000 GP` |
| `src/data/institutionDescVariants.js:342,343` | scroll prices, `25 GP` / `500 GP` |
| `src/data/institutionDescVariants.js:698,699` | charlatan fortunes, `1-5 GP` |
| `src/data/institutionDescVariants.js:702,703` | hireling hall, `1 GP` / `5 GP` |
| `src/data/institutionDescVariants.js:990,991` | healing draught, `50 GP` |
| `src/data/institutionDescVariants.js:1238,1239` | village healer, `10 GP` |
| `src/data/institutionalCatalog.js:860,1401,1439,1453,1982,2261` | six `desc` rows |
| `src/data/institutionalCatalog.js:851` | comment quoting the desc (output-neutral) |

### 2b. Rulebook proper nouns — named spells (17 sites)

| Proper noun | Addresses | Cured to |
| --- | --- | --- |
| `Zone of Truth` | `institutionDescVariants.js:218,219` · `institutionalCatalog.js:2154` · `defenseGenerator.js:251` (comment) | compelled truth |
| `Cure Wounds` | `institutionDescVariants.js:1238,1239` · `institutionServices.js:488` · `institutionalCatalog.js:860` | a closed wound / wounds closed |
| `Lesser Restoration` | `institutionServices.js:488` | sickness lifted |
| `Sending Stones` | `institutionDescVariants.js:258,259` · `institutionalCatalog.js:2261` · `spatialData.js:482` | `Speaking Stones` (the corpus's own alternative) |
| `Conjure Animals` | `chainMagicSubstitution.js:67` | conjured game |
| `Plant Growth` | `chainMagicSubstitution.js:68` · `foodBalance.js:249` · `defenseGenerator.js:385` (comment) | quickened growth |
| `Fabricate` | `chainMagicSubstitution.js:88,113,27` (last is a comment) | arcane fabrication |
| `Transmute Rock` | `chainMagicSubstitution.js:113` | stone-shaping |
| `Speak with Animals`, `Detect Poison`, `Purify Food`, `Pass Without Trace` | `institutionServices.js:486` | descriptive phrases |
| `Goodberry` | `defenseGenerator.js:385` (comment) | conjured forage |
| `Detect Thoughts` | `defenseGenerator.js:249` (comment) | thought-reading |

### 2c. Rulebook scale — spell levels and item plusses (11 sites)

| Address | String | Cured to |
| --- | --- | --- |
| `institutionDescVariants.js:18,19` · `institutionalCatalog.js:2192` | `+1 weapons` | warded weapons |
| `institutionDescVariants.js:250,251` · `institutionalCatalog.js:2243` · `spatialData.js:472` | `5th level Dream spell` | dream-walking |
| `institutionDescVariants.js:342,343` · `institutionalCatalog.js:1982` | `3rd-level spell` / `(3rd level)` | a greater working |
| `institutionDescVariants.js:506,507` · `institutionalCatalog.js:320` | `1st-level spells` | the smallest spells |
| `institutionDescVariants.js:1242,1243` · `institutionalCatalog.js:824` | `1st to 3rd level spells` | minor spells |
| `institutionServices.js:142,172` (+7 consumer sites) | `Spellcasting (1st-3rd level)` / `(1st-8th level)` | `Spellcasting (minor)` / `(greater)` |
| `institutionServices.js:1567` (+2 consumer sites) | `Cure light wounds` | `Wound closing` |

### 2d. The alignment grid — two copies, one user-facing select

| Address | Row |
| --- | --- |
| `src/domain/npc/npcFacetContract.js:12-15` | `NPC_ALIGNMENTS`, the transport vocabulary |
| `src/domain/worldPulse/npcAgency.js:159-168` | `ALIGNMENTS`, the generation pool |
| `src/components/new/NpcLifecycleControls.jsx:25,162` | the select, humanized straight from the symbol |

Cured per G2: an agnostic LABEL over an unchanged SYMBOL.

### 2e. One rulebook role construction

`src/data/historyData.js:858` — `Warlock/Pact-Bound`. `Warlock` is Old English
(`wǣrloga`, oath-breaker) and STAYS; the pairing with a binding pact is the
rulebook's class, not the folklore. Cured to `Warlock/Bargain-Sworn`.

⚠ The first draft of this cure read `Witch/Bargain-Sworn`, and it was WRONG for a
reason worth keeping: `warlock` is an alternative in BOTH
`MAGIC_ASSERTION_PATTERN` and `ARCANE_CERTAIN_PATTERN`, and `witch` is in the
first but NOT the second. Swapping the word would have silently changed one
classifier's answer on this role while leaving the other's intact. Keeping the
half that is genuine folklore also kept both classifiers exactly where they were.

### 2f. EXCLUDED — the owner's legal carve-out (§857 ruling 2)

The chair executes nothing on marketing or public copy. These are
TRADEMARK-adjacent and wait for the owner's pen:

- `src/lib/galleryHubs.js:43` — "Public D&D settlements", on a crawlable SEO surface (the highest-exposure single hit in the census)
- "A simulator for Dungeon Masters" — landing eyebrow and footer
- "PCs" — tab copy

### 2g. DEFERRED — the keys car

Institution keys, not service names. Each is a join key in G3's families:
`Healer (divine, 1st level)` (11 sites incl. an order-authoritative generated
file and four test pins) and `servicesData.js:44-46`'s three
`spellcasting services (1st-Nth level)` LOCALE override SOURCES (matched against
institution names; renaming one silently kills a live mapping if a producer
still emits the old name). Recorded here so the rows cannot be lost.

---

## 3. THE PROMISE, AND WHY THIS WAVE PRECEDES THE FREEZE

A seed is a starting world forever. Rewriting a prose pool MOVES same-seed bytes
by construction. That is why §857 placed this wave BEFORE TE-GOLDEN-1's freeze
rather than after it: the shift is taken once, deliberately, with a record, and
the goldens freeze over the cured corpus. Cures that touch only comments, docs
or display labels are output-neutral and carry no shift.

### SHIFT RECORD 1 — car 3, `tests/fixtures/generator-golden-master.json`

**Cause: TE-AGNOSTIC-1 / ODQ §857, the setting-agnostic corpus rewrite.**
Re-recorded through the file's own governed ritual
(`UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js`).

| Measure | Value |
| --- | --- |
| Corpus rows | 525 (key set UNCHANGED, asserted) |
| Hashes moved | **305** |
| Hashes held | 220 |
| By tier | town 105/105 · city 84/84 · metropolis 80/84 · village 36/84 · hamlet **0/84** · thorp **0/84** |

The tier distribution is the shift's own control. Thorps and hamlets hold none of
the cured institutions, and they moved by exactly zero. Village moved on fewer
than half its rows, which is what a probabilistic institution roll should look
like. A behaviour change would not have respected that shape.

**Two independent instruments say the shift is PROSE AND NOTHING ELSE:**

1. **The classifier-invariance probe** ran `textAssertsFunctionalMagic` over every
   authored service name, service desc, desc variant, catalog name, catalog desc,
   and spatial gate reason at base and at tip: **4,609 rows, 264 asserting, diff
   EMPTY.** Not one row changed which side of the magic gate it falls on. This is
   what makes the rewrite guard-safe rather than merely careful: several cures had
   to keep a token they were deleting the words of (`Cure Wounds, Lesser
   Restoration` → `Wounds closed and sickness lifted by magic` keeps the row
   asserting through `magic`), and several had to AVOID gaining one
   (`+1 weapons` → `warded`, never `enchanted`, which would have convicted a
   mundane row).
2. **A structural control across two worktrees.** Seven golden rows generated at
   the pre-car-3 commit and at tip, serialized whole and diffed: 39,037 lines each
   side, **28 changed lines = 14 substitutions, every one a cured string.** Zero
   keys, counts, numbers, names or structure moved. And the three rows the
   manifest independently called HELD show ZERO diff (all 14 addresses fall in the
   four MOVED sections) — the two instruments agree from opposite ends.
