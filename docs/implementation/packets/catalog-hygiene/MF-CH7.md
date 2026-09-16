# Catalog hygiene / MF-CH7 — A WORD IS NOT A SUBSTRING: the criminal institution vocabulary is anchored in both of the copies it was spelled in, and a criminal NPC stops taking a parish priest for a workplace

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `c3289244d58b7259205d80594856e8e0cc520817`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-7**. A cure-that-did-not-travel car of the
  catalog-hygiene train, after `MF-CH1`, `MF-CH2A` and `MF-CH5` (all LANDED) and beside
  `MF-CH3` (DRAFT, which reserves none of this car's change paths).
- **Charter and rulings:** classified a **REPAIR** — chair-ruled, not owner-gated. It changes
  no schema, no persisted shape, no public API and no paid-surface behaviour, and it mints no
  capability. Every figure below is **re-derived at this base by execution**.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed`.

---

## §0 · THE ONE SENTENCE

`criminal: /tavern|den|gang|black\s+market/i` was spelled **twice** in
`src/domain/npcProfile.js`, byte-identically, and the bare `den` alternate is a **substring
test**: over the 276 live catalog institution names it matched `Resident smith (part-time)`,
`Priest (resident)`, `Warden's Lodge` and `Dragon resident`, so a criminal NPC's
`institutionLink` could resolve to **a parish priest**.

## §0.1 · WHY THIS CAR EXISTS AT ALL — a cure that did not travel

The identical four rows were anchored in a **different** classifier by an earlier car:
`src/domain/spatial/cohesionWeave.js` spells the vice row as `\btavern|\bbrothel|\bdens?\b|…`
today. The cure stopped there because the vocabulary is **duplicated with nothing pinning the
copies together**, which is the whole defect one layer up. This car therefore ships the pin as
well as the fix, and the pin is what makes the class un-regrowable in this file.

## §1 · WHAT CHANGED

| file | change |
|---|---|
| `src/domain/npcProfile.js` | both `criminal:` rows (`CATEGORY_INSTITUTION_HINTS`, `POWER_DOMAIN_HINTS`) become `/\btaverns?\b\|\bdens?\b\|\bgangs?\b\|\bblack\s+markets?\b/i`, with a trailing comment naming the twin |
| `tests/domain/npcProfile.test.js` | a seven-title pin block driven from the LIVE catalog: the anchored set, `den` liveness, the four false positives, first-match ordering, the power footprint, and byte-equality of the two copies |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | the lighting census re-recorded with its cause and its single-file attribution control |

### §1.1 · ⛔ THE LINE COUNT IS UNCHANGED ON PURPOSE, AND IT IS NOT COSMETIC

`tests/lint/arcaneClassifierCensus.walker.test.js` keys `KNOWN_UNCONVERTED` by **`path:line`**,
and two of its rows are `src/domain/npcProfile.js:334` and `:375` — the arcane rows sitting
**directly beneath** each criminal row this car edits. `MF-CH5` re-pointed those exact two keys
`333 → 334` / `374 → 375` two days ago for one added import line.

This car is therefore a **two one-line replacements** edit and nothing else: 675 lines before,
675 after. Both census keys stay valid, the arcane census stays green untouched, and — the
reason it was worth the constraint — this car does **not** edit the file that also holds
`src/domain/districtProfile.js:112`, where **TE-CH-4 is live**. The rationale that would
normally sit in a comment block above the table sits in the pin's header instead, because a
comment block above the table would have moved line 334.

## §2 · THE MEASUREMENT — printed both ways, over the live catalog

276 unique catalog institution names. `criminal`, over all four alternates:

| alternate | bare | word-anchored | dropped | gained |
|---|--:|--:|--:|--:|
| `tavern` → `\btaverns?\b` | 2 | 2 | 0 | 0 |
| `den` → `\bdens?\b` | **5** | **1** | **4** | 0 |
| `gang` → `\bgangs?\b` | 1 | 1 | 0 | 0 |
| `black\s+market` → `\bblack\s+markets?\b` | 2 | 2 | 0 | 0 |
| **the whole row** | **10** | **6** | **4** | **0** |

The four dropped rows, verbatim, with their homes: `Resident smith (part-time)`
(hamlet/Crafts), `Priest (resident)` (village/Religious), `Warden's Lodge` (town/Magic),
`Dragon resident` (city/Exotic).

**WHAT IT RENDERED AS**, executed before and after on the same two-institution settlement in
catalog order (Religious precedes Criminal, and `inferInstitutionLink` takes the FIRST match —
which is exactly how the defect reached production):

    before   institutionLink = institution.priest_resident
    after    institutionLink = institution.gambling_den

and `institutionsForCategory('criminal', …)` over the whole catalog goes from ten names to six.

### §2.1 · ⛔ THE TERM IS STILL LIVE — the sibling case, checked rather than assumed

Anchoring can **delete a category** when the term's only match was itself the false positive.
It does not here: `Gambling den` still reaches `criminal` through `\bdens?\b`, so the
alternation survives with a real member. The pin asserts that directly, so the term cannot
later be "simplified" away as dead.

### §2.2 · ⚠⚠ ANCHORING IS NOT UNIFORMLY SAFE, AND THIS IS THE CAR'S SHARPEST FINDING

A census of **every** alternate in both tables against all 276 names returns exactly four that
match mid-word — and three of them are **true positives that a word anchor would delete**:

| alternate | mid-word matches | verdict |
|---|---|---|
| `church` | `Parish churches (2-5)`, `(10-30)`, `(50-100+)` | **TRUE** — `\bchurchs?\b` misses the `-es` plural |
| `broker` | `Pawnbroker` | **TRUE** — a pawnbroker is an economic institution |
| `bank` | `Banking houses`, `Banking district` | **TRUE** — `\bbanks?\b` misses `Banking` |
| `den` | the four above | **ALL FALSE** |

So "anchor every regex" is the wrong general rule and the pin says so in its header. `den` was
the only alternate in either table whose mid-word population was entirely false, which is why
this car anchors that row and no other.

## §3 · THE PIN, AND SIX DELIBERATE MUTATIONS

Seven titles appended to `tests/domain/npcProfile.test.js` — an **existing, credited** file, so
no new-test-file ratchet is incurred. Every assertion is an **exact set** driven from the live
catalog; no negative matcher is used, so the file's frozen `negativeAssertionAnchor` count of 3
is untouched and no assertion can pass by the collection having emptied.

| mutation | result |
|---|---|
| **M1** both copies back to bare | 5 failed of 46 |
| **M2/M5** the SECOND copy only (`POWER_DOMAIN_HINTS`) | 3 failed — the `institutionsFor*` arms |
| **M6** the FIRST copy only (`CATEGORY_INSTITUTION_HINTS`) | 3 failed — the `deriveNpcProfile` arms |
| **M3** the `\bdens?\b` alternate deleted outright | 5 failed, including the den-liveness arm |
| **M4** the catalog helper cut to one tier | 3 failed — the 276 liveness control is live |
| restored | 46 passed of 46 |

**M2/M5 and M6 are the split control.** Each half of the duplicated vocabulary is bound by its
own arms, so a cure that lands in one copy and not the other now reds by name — which is the
one thing that did not exist when this defect survived the earlier car.

## §4 · THE CENSUS

**+0 files / +0 parked / +0 credited / +7 TITLES / +1 SUITE TITLE**, carried as a delta:
`2,525/366/2,159/21,026/5,848 → 2,525/366/2,159/21,033/5,849`.

Attribution is a **single-file control**, the one shape that cannot be ambiguous: the slot's
`tests/domain/npcProfile.test.js` (19,977 bytes, blob `846df16b2`, byte count printed before
use) restored over this car's copy with the tuple still at the **slot** reading ran **33 passed
of 33**, exit 0. Reverting this car's whole test delta lands on the slot tuple to the digit.
That control also proves `files`, `parked` and `credited` unmoved **by execution** — those three
assertions precede `titles` and passed at the slot figures while the car's source edit was still
applied. The car's file was restored afterwards and compared identical
(md5 `d3a171376e74dd107676572fe544be81`). Two negative controls, one per moved figure, each
guarded against a no-op edit by md5: `expected 21033 to be 21032` and `expected 5849 to be 5848`,
1 failed of 33 each, which also proves the LAST assertion is reachable.

⚠ **PARKED STAYING AT 366 IS EARNED.** All seven titles are string literals — no template
literal (which double-counts by its PARTS) and no `test.each`/`for…of` generating tests. The
block's two loops both run INSIDE a single named test.

## §5 · THE SEVENTH ARCANE SPELLING — MEASURED, PRICED, AND DELIBERATELY NOT CONVERTED

`npcProfile.js:334` and `:375` carry a seventh spelling of the arcane vocabulary,
`/mage|wizard|college|alchemist|library|laboratory|tower|sanctum/i`, already recorded
UNCONVERTED in `arcaneClassifierCensus`'s `KNOWN_UNCONVERTED`. This car was asked to price the
conversion and convert it only if free. **It is not free.**

Against the canonical detector `isArcaneInstitution` over all 276 names:

| | count |
|---|--:|
| the name regex matches | 9 |
| `isArcaneInstitution` matches | 19 |
| **only the regex** (`Alchemist shop`, `Alchemist quarter`, `Bardic college`, `Great library`) | **4** |
| **only the detector** (incl. `Healer (divine, 1st level)`) | **14** |

Eighteen of 276 rows move, on a table that decides live `institutionLink`. One of the fourteen
is the **divine healer**, which is `ARCANE_INST_KW`'s parked question under DEITY DOCTRINE and
**CH-6's**, not this car's. The rows stay unconverted and keep their census entries.

It **does** carry the same word-occurrence class, but with **zero live catalog instances**: the
mid-word census over all 276 names returns nothing for any arcane alternate. It is reachable
only through the name fallback for DM-renamed, custom or unstamped legacy rows, where
`Pilgrimage destination`, `Pilgrimage services` and `Homager hall` all read arcane via `mage`,
and `Towering Oak Inn` via `tower` — the MG-4 `PILGRIMAGE` finding, one layer over. ⚠ A naive
anchor is a trap there in a way it is not for `den`: `\bmages?\b` **loses `archmage`**, which is
why `arcaneInstitutionIdentity.js` restores that token explicitly.

## §6 · SIBLING SITES FOUND, MEASURED, AND OUT OF SCOPE

A source scan of `src/**` for the same shape returns three live bare-`den` criminal classifiers
besides this car's two rows:

| site | status |
|---|---|
| `src/domain/spatial/cohesionWeave.js:289` | ALREADY CURED — `\bdens?\b`; this is the cure that did not travel |
| `src/domain/districtProfile.js:113` | **TE-CH-4 is live in that file. Untouched by this car.** |
| `src/domain/customContent.js:114` | **UNCLAIMED — a candidate car.** Over user-typed names, `The Gardens of Sela`, `Maidens Rest`, `Warden of the Wood`, `Wooden Bridge Post` and `Resident physician` all classify `criminal` today |

The third is recorded in the pin's own header so a later audit does not re-find it as new. It is
a different population (unbounded user text, not 276 catalog names) and needs its own
measurement, so it is not swept in here.

## §7 · WHAT THIS CAR DOES NOT TOUCH

`ARCANE_INST_KW`, the divine healer and the arcane rows' verdicts (CH-6's);
`src/domain/districtProfile.js` (CH-4's); `src/data/institutionalCatalog.js` and therefore no
edge bundle and no sidecar; `arcaneClassifierCensus.walker.test.js` (no re-point is owed);
every other alternate in either hint table; any schema, persisted shape, public API, tuning
value, flag or golden fixture.
