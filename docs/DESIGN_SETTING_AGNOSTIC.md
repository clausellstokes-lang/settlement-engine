# TE-AGNOSTIC-1 — the setting-agnostic engine vocabulary (ODQ §857)

**Status: LANDED. Car 1 the census bill · car 2 the output-neutral cures · car 3
the corpus rewrite (shift record 1) · car 4 the service names (shift record 2) ·
car 5 the display-layer residue the first census missed (§4).**

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

Counted at `1d27accdc`, over `src/`. The tables below were the census's own
enumeration; the totals here are **re-derived from the landed diff after car 5**
rather than carried forward from the first estimate, because a census that
reports its opening guess as its closing figure is the defect this file spends
§4 on.

Measured over `git diff 1d27accdc..HEAD -- src`, counting added lines that carry
a cure (deduplicated by line, so a line curing two families counts once):

| | Count |
| --- | --- |
| Cured sites in `src/` | **61** |
| ...of which comments (output-neutral) | 9 |
| ...of which code and string literals (output-moving) | 52 |
| Alignment label rows (output-neutral, not a string cure) | 8 + the select |
| EXCLUDED, owner's legal carve-out (§2f) | 3 surfaces |
| DEFERRED to a keys car (§2g) | 2 families, 14 sites |

By family: `in gold` 21 · spell-level scale 10 · service names 9 ·
`Speaking Stone(s)` 5 · `dream-walking` 4 · `compelled truth` 4 ·
conjured/quickened 4 · `warded weapons` 3 · `arcane fabrication` 3 ·
comment-only lifts 3 · `poison sensed` 1 · `Bargain-Sworn` 1.

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

Institution keys, not service names.

**`Healer (divine, 1st level)`** — 11 sites, including the ORDER-AUTHORITATIVE
generated file `institutionServiceKeys.generated.js` and four by-name pins in
`magicLicenceCensus.walker` plus one in `arcaneIdentity.test`. This is G3's
family exactly. Its own SERVICE (`Cure light wounds`) was cured; the institution
key is a keys-car row.

**`servicesData.js:44-46`** — three `spellcasting services (1st-Nth level)`
LOCALE override SOURCES. **Measured rather than assumed:** the lookup is an
EXACT lowercased key access (`LOCALE_SERVICE_OVERRIDES[instName.toLowerCase()]`
at `generators/services/institutionServices.js:111`, and the same shape at
`display/institutionProfile.js:118`), and no producer in `src/` emits an
institution named `spellcasting services (1st-Nth level)`. So the three rows are
UNREACHABLE today. **Deliberately NOT renamed:** renaming an unreachable lookup
source only invents a differently-dead key that reads even less like a plausible
institution name. Their honest disposition is deletion, which belongs to a
dead-code car with its own bill, not to a vocabulary wave. Recorded so the rows
cannot be lost.

**`Druid Circle`** — not deferred but KEPT, per §0. A druidic circle is Celtic,
not a rulebook class.

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

### SHIFT RECORD 2 — car 4, the three SERVICE names

**Cause: TE-AGNOSTIC-1 / ODQ §857**, the rulebook-scale service names.
`Spellcasting (1st-3rd level)` → `Spellcasting (minor)` ·
`Spellcasting (1st-8th level)` → `Spellcasting (greater)` ·
`Cure light wounds` → `Wound closing`. Eleven sites across
`institutionServices`, `supplyChainData`, `serviceCategoryTables`,
`goodsCatalog` (a comment), and two tests that pin the registration census.

| Measure | Value |
| --- | --- |
| Rows moved by car 4 alone | **156** of 525 |
| By tier | metropolis 80/84 · city 72/84 · town 4/105 · village, hamlet, thorp 0 |
| Wave CUMULATIVE against the pre-wave base | **305** of 525 (UNCHANGED from car 3) |

⭐ The cumulative figure not moving is itself a receipt: every row car 4 touched
had already moved in car 3, so the two cars edit the same institutions rather
than widening the blast radius.

**The names are LIVE, and the swap is exact.** Generating 112 worlds
(4 tiers × 7 terrains × 4 seeds) at base and at tip:

| Name | base | tip |
| --- | --- | --- |
| `Cure light wounds` → `Wound closing` | 3/112 | 3/112 |
| `Spellcasting (1st-3rd level)` → `(minor)` | 52/112 | 52/112 |
| `Spellcasting (1st-8th level)` → `(greater)` | 52/112 | 52/112 |
| the three OLD names, at tip | — | **0/112** |

Present in exactly the same worlds under the new name, and the old names reach
zero. Not a dead-row rename dressed up as a cure.

**The one deliberate classifier movement in the whole wave, stated plainly.**
The invariance probe returns 4,609 rows with **ZERO answer flips on all 4,600
shared keys**; the 9 keys that changed ADDRESS are these three services × three
arms. Across that rename the asserting total falls 264 → 263, and the single
row is `svcName · Healer (divine, 1st level)|Cure light wounds` (1) →
`Wound closing` (0). **That arm is not read by anything.** Measured, not
reasoned: `generationContext.allowsService` gates on
`` `${entity.name} ${entity.desc}` ``, all seven call sites
(`servicesGenerator:361`, `serviceRollMaterialization:158,216`,
`economyReconcilePass:255`) pass service OBJECTS, and the `svcJoin` and
`svcDesc` arms both hold at 1 for all three services because
`Basic divine healing.` carries the `divine healing` token.

**Structural control, re-run:** 39,037 lines a side, 40 changed lines = 20
substitutions, every one a cured string; six addresses more than car 3, all six
the Spellcasting names inside the city and metropolis sections. The three HELD
rows still show ZERO.

---

## 4. CAR 5 — THE RESIDUE THE FIRST CENSUS MISSED, AND WHY IT MISSED IT

Re-sweeping the whole of `src/` for every cured family after cars 3 and 4 turned
up four rows the §857 census and this file's own §2 both missed. **All four were
missed the same way: the census looked where content is AUTHORED
(`src/data`, `src/generators`) and these live where content is DISPLAYED or
DOCUMENTED.**

| Address | Miss | Cure |
| --- | --- | --- |
| `src/domain/display/institutionVocabulary.js:254` | `paired sending stones`, LOWERCASE, so a Title-Case proper-noun sweep walked past it | `paired speaking stones` |
| `src/domain/display/institutionVocabulary.js:309` | `from cheap cantrips to costly higher magic` — a POWER LADDER, which is the one shape §0 says `cantrip` may not take | `from cheap charms to costly greater workings` |
| `src/domain/worldPulse/magicForms.js:17` | a design comment QUOTING two catalog descs car 3 rewrote | quotes re-synced |
| `src/domain/worldPulse/magicFormsPractitioner.js:15` | the same, one file over | quotes re-synced |

⭐ **THE LESSON WORTH KEEPING: a content wave owes a re-sweep of the DISPLAY layer
and of every comment that QUOTES the corpus.** A doc that quotes a string the
corpus no longer contains is the same defect this wave cured in
`magicAssertionText`'s receipt ledger, one layer up.

Car 5 does NOT move the generator goldens (`generatorGoldenMaster` passes
untouched) because `institutionVocabulary` is read at DISPLAY time, not during
generation. It is nevertheless reader-visible, which is the whole point.

### The three `cantrip` sites deliberately LEFT

`serviceCategoryTables.js:552` (`'Cantrips and minor magic'`),
`institutionServices.js:142` (`"Cantrips, light spells, minor enchantments…"`)
and the matcher `serviceAvailability.js:50` (`svc.includes('cantrip')`) all keep
the word, per §0: here it reads as the Scots noun, not as a level. Leaving them
also leaves the matcher pointed at a name that still exists, which is G3's law.

### Historical records are NOT rewritten

`docs/implementation/packets/catalog-hygiene/MF-CH6.md`,
`docs/implementation/PACKET_MANIFEST.json` and `docs/implementation/INDEX.md`
quote `'Basic healing spells. Cure Wounds (10 GP).'` in their account of a
LANDED packet. That account was true at its landing and is part of the program's
ledger, not live content. **Deliberately left standing** — falsifying a landed
record to make a grep come back clean would be the worse defect. Named here so a
future sweep that finds them knows they are history, not residue.

---

## 5. THE GUARD — Tier 4 of the voice ratchet (car 6)

Cars 1 to 5 are a cleanup. Without machinery the next content wave writes the
tells straight back, so the cure becomes an event rather than a property.

`tests/copy/voiceMechanics.test.js` gains a **Tier 4: the setting-agnostic tell
ban**, HARD ZERO over every string literal in `src/data` and `src/domain`. It
lives in the existing voice-ratchet file deliberately: that file already walks
exactly this corpus with exactly this tiered shape, and a NEW lint test file
would have cost three censuses for no added reach.

**Four detectors, in two shapes:**

| Detector | Shape | Why |
| --- | --- | --- |
| `currency GP` | a number adjacent to `GP` | the rulebook UNIT, without convicting `GPS` |
| `spell-level scale` | `\d+(st\|nd\|rd\|th)[- ]level` | the rulebook SCALE, hyphen or space |
| `item plus` | `+N weapon/armour/sword/shield` | the other SCALE, without convicting `a +1 modifier` |
| `named spell` | CASE-SENSITIVE list | Title Case is the tell: a tanner may `cure hides`, a catalogue may not sell `Cure Wounds` |
| `named spell (no ordinary reading)` | CASE-INSENSITIVE list | ⭐ exists because of §4's real miss: `paired sending stones`, lowercase, walked past a Title-Case sweep |

**The quarantine is EXACT-SET-EQUAL to what is measured**, in both directions: a
new tell reds, and a quarantine row whose text has been cured must be struck, so
the keys car cannot land while leaving dead prose behind. Seven rows, every one
a `Healer (divine, 1st level)` join key or the three unreachable `servicesData`
lookup sources, each with its written reason.

**MUTANT-PROVEN.** A guard never shown to fail is not a guard. Three tells were
seeded into `src/data/narrativeData.js` and the walk executed against the real
tree; all four detectors fired, each on its own row, and the seed was reverted.
The seeded sentence `Scrolls from a cantrip to a 3rd-level spell, and +1 weapons
besides.` is the sharpest single line in the proof: `3rd-level` and `+1 weapons`
are both convicted while `cantrip` in the same breath is correctly spared, which
is both halves of §0's rule in one assertion.

`magicAssertionText.js` is deliberately NOT quarantined and does not need to be:
its ledger names the spent receipts in COMMENTS and its pattern carries them in a
REGEX LITERAL, and Tier 2's extractor reads neither. Measured, not assumed — the
file produces zero Tier-4 hits.
