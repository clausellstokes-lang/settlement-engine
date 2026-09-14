# READ — THE PROSE DATA AND ITS GENERATOR
*Reader lens for the COMPOSED-PROSE ARCH run. Seat: Opus 5 — Fable-unvalidated. Read-only.
Product tip `3b1c0eaa5` in `$SC/laneB6`; every figure below is either the print of a script named
here (written under `$SC/arch-prose/`, run read-only) or is cited to file:line.*

`$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit`.
Paths below are repo-relative to `$SC/laneB6` unless written whole.

---

## §1 THE PIPELINE IN ONE PICTURE

```
docs/content/RECEIPT_POOLS_DOSSIER_STATE.md   (584,642 B, 6,313 lines, 68 live blocks)
docs/content/RECEIPT_POOLS_CAUSAL_DOSSIER.md  (188,996 B, 2,029 lines, 78 families)
        │        ↑ THE AUTHORED CORPUS. The chair and the owner read and veto HERE.
        │
        │  scripts/generate-dossier-state-prose.mjs   (723 lines — ONE projection, strict parser)
        │    reads also: scripts/lib/dossier-slot-shapes.mjs   (the slot SHAPE register, parsed
        │                    back out of the same two annexes: §0c / §0c-2 / causal §0c)
        │                src/domain/display/economyFreshness.js (LIVE_STRING_BINDINGS, gen:89-96)
        ▼
src/data/dossierStateProse/{economy,power,defense,warFaith,stressors,general}.generated.js  641,410 B
src/data/dossierCausalProse.generated.js                                                    210,260 B
        │        ↑ CHECKED IN. The runtime never parses markdown (gen:5-11).
        ▼
src/domain/display/stateProse/stateProseKernel.js   (357 lines — the ONLY reader; pure leaf)
        ▲ six desks (118 exported `*PoolKey()` functions) turn LIVE STATE into a pool-key STRING
        ▲ src/domain/display/stateProse/dossierMounts.js — 56 mount rows say WHERE a block speaks
```

Regeneration: `npm run gen:dossier-prose` (`package.json:31`). The gate runs the same script with
`--check` and fails on any stale byte (`generate-dossier-state-prose.mjs:706-713`, asserted from
`tests/data/dossierStateProseProjection.contract.test.js:182`).

---

## §2 THE EXACT DATA SHAPE AS SHIPPED

### 2.1 The emitted record (authoritative: `generate-dossier-state-prose.mjs:556-582`)

```js
export const DOSSIER_STATE_PROSE_<DESK> = Object.freeze({
  "<blockId>": {                      // e.g. "DS-ECO-1", "JF-CPL-1a"
    title:         string,            // the whole `### …` header line, verbatim
    sectionTarget?: string[],         // omitted when empty; DISCOVERY only, routes nothing
    arms?:          string[],         // omitted when empty
    slots:          string[],         // the block's `**SLOTS:**` palette
    pools: {
      "<poolKey>": [                  // pool key = the authored bold label, normalised
        { angle: string,              // one of eight words
          marks?: string[],           // omitted when empty
          text:  string,              // the sentence, slots unfilled
          slots: string[] }           // every `{slot}` the sentence names, deduped
      ]
    }
  }
});
```

Field census over the shipped leaves (`$SC/arch-prose/shape-census.mjs`):

| level | field | present on |
|---|---|---|
| block (state) | `title` | 68/68 |
| block (state) | `slots` | 68/68 (none empty) |
| block (state) | `sectionTarget` | 43/68 |
| block (state) | `arms` | **1/68** — only `DS-REL-1: [patron, client]` |
| block (causal) | `title` / `sectionTarget` / `arms` / `slots` | 78/78 each |
| variant | `angle`, `text`, `slots` | 2,266/2,266 state; 468/468 causal |
| variant | `marks` | 186/2,266 state; **468/468** causal |

**There is no other metadata.** No licence, no fields-read, no predicate, no grammar, no role, no
relation, no length class, no family id, no authoring provenance. Those facts exist — in the annex,
as PROSE — and the projection drops them (§4).

### 2.2 The corpus, measured (`$SC/s12-sitting/verify/slots.mjs`, print quoted verbatim)

```
blocks 68 pools 708 variants 2266
```

| | blocks | pools | variants | mean/pool | bytes on disk |
|---|---|---|---|---|---|
| defense.generated.js | 11 | 126 | 383 | 3.04 | 111,827 |
| economy.generated.js | 15 | 105 | 329 | 3.13 | 90,212 |
| general.generated.js | 23 | 193 | 634 | 3.28 | 182,518 |
| power.generated.js | 7 | 79 | 256 | 3.24 | 81,802 |
| stressors.generated.js | 3 | 67 | 246 | 3.67 | 59,298 |
| warFaith.generated.js | 9 | 138 | 418 | 3.03 | 115,753 |
| **state total** | **68** | **708** | **2,266** | **3.20** | **641,410** |
| dossierCausalProse.generated.js | 78 | 78 | 468 | 6.00 | 210,260 |

Variants-per-pool histogram, state: `2→33  3→547  4→96  5→17  6→15`. Causal: `6→78` (uniform).
Angles, state: `ledger 681 · street 609 · visitor 403 · unfolding 230 · counterforce 170 ·
threshold 96 · elder 70 · canonical 7`. Causal: six angles, 70–84 each, no `threshold`, no `canonical`.
Sentence length, state: min 4 words, p25 18, median 22, p75 25, max 40 (`$SC/arch-prose/keys.mjs`).

### 2.3 The pool key (`$SC/arch-prose/keys.mjs`)

- 708 keys. Length min 1 (`*`), median 23, max 77 (`safetyProfile.safetyLabel: head word in {Tense, Strained, Restricted, Unsafe}`).
- 346 of 708 carry a `": "` group join — minted by the compact-row branch at
  `generate-dossier-state-prose.mjs:367` (`group ? \`${group}: ${rowKey}\` : rowKey`).
- **0 keys contain an em or en dash.** The generator's own note at `:360-366` records that the join
  used to mint one and that the key is hashed into the draw, so the separator is renameable only
  while the corpus is dark. It is now a colon and the corpus is lit; the door is shut.
- 295 keys open with an ALL-CAPS word; only 5 open with `COMBINATION` (the DS-ECO-1 family).
- Exactly **1** state pool uses the reserved sole key `*` (`SOLE_POOL`, gen:202, kernel:126); all 78
  causal families use it (contract test asserts it, `…contract.test.js:281-288`).
- Uniqueness is per block and is an ERROR, never a merge (`generate-dossier-state-prose.mjs:565`).

### 2.4 The mark bag — three semantics, one untyped field

`stateProseKernel.js:48-53` names it: `marks` carries (a) the AUDIENCE mark `dm-only`, (b) the
demoted STATE-DIMENSION words, (c) in the causal register only, family-local ARM names.

| vocabulary | words | count |
|---|---|---|
| audience | `dm-only` | 83 state + 6 causal |
| dimension `severity` | `minor` 20, `major` 20, `catastrophic` 10 | 50 |
| dimension `deficit` | `deficit` 11, `no deficit` 11 | 22 |
| dimension `anchor` | `anchored` 19, `not anchored` 13 | 32 |
| causal arms | 89 distinct open words (`home` 41, `payer` 21, `split` 18, … 71 distinct arm PAIRS over 78 families) | 468 variants tagged |

The three vocabularies are disjoint over the shipped corpus and the contract test is what keeps them
that way (`…contract.test.js:584-614`). `STATE_MARK_DIMENSIONS` is FROZEN IN THE KERNEL
(`stateProseKernel.js:192-196`) rather than emitted by the generator, deliberately (`:184-188`).

---

## §3 WHERE AUTHORED TEXT LIVES BEFORE GENERATION

### 3.1 The annex grammar the parser consumes (`generate-dossier-state-prose.mjs:19-27, 285-426`)

| line shape | regex / site | becomes |
|---|---|---|
| `### DS-XXX-N: <title>` | `STATE_HEADER` gen:600 | a block; `FOLDED INTO` in the header ⇒ skipped (gen:308-309) |
| `### JF-<id> — <title>` | `CAUSAL_HEADER` gen:601 | a causal family |
| `**SLOTS:**` / `**SLOTS.**` | gen:326-329 | `block.slots` (slot names scraped off the line) |
| `**SECTION-TARGET:**` | gen:330-342 | `block.sectionTarget` — **backticked tokens only** |
| `**ARMS:**` | gen:343-348 | `block.arms` |
| `**<label>**` alone, or with an em-dash gloss | `BOLD_LINE_RE` gen:183 + `isPoolLabel` gen:214-229 | opens a POOL; the label becomes the key via `poolKeyOf` gen:237-243 |
| `N. \`[angle · mark]\` text` (optional second `\`[tag]\``) | `VARIANT_RE` gen:175 | a variant; both tags fold into `marks` (gen:170-173) |
| `0. *(canonical)* <text>` | `CANONICAL_RE` gen:177 | a variant with `angle:'canonical'` (7 of them ship) |
| `- \`KEY\` — 1. \`[a]\` … · 2. \`[b]\` …` | `COMPACT_BULLET_RE` gen:194 | a whole pool on one line; 225 variants across DS-GEN-3/4/5/6/10 are authored this way (gen:187-193) |
| `**KEY** — 1. \`[a]\` …` | `COMPACT_BOLD_RE` gen:196 | the same, carrying its own label |
| trailing ` *(…)*` or ` *— …*` | `cleanText` gen:252-261 | STRIPPED — an editorial aside to the chair, never prose |

Two safety properties the design must not lose:
- **Nothing may be dropped silently.** Every `[angle]`-tagged line inside a block region must land in
  a pool or the run throws (`assertNothingDropped`, gen:432-452).
- **Numbering may not restart inside a pool** (gen:406-411) — that is how a missing label would
  silently merge two pools.

### 3.2 Annex metadata the projection DOES NOT carry (measured with `grep -c`)

| annex line | count in the state annex | projected? |
|---|---|---|
| `**STATE-KEY.**` / `**STATE-KEY:**` | 68 (23 + 45) — one per block | **no** |
| `**SLOTS**` | 68 | yes → `block.slots` |
| `**SECTION-TARGET:**` | 45 (43 land non-empty) | yes → `block.sectionTarget` |
| `**RECEIPT:**` | 48 | **no** |
| `**PROVENANCE:**` | 23 | **no** |
| `**ENTAILMENT.**` / `:` | 22 | **no** |
| `**PDF PARITY:**` | 21 | **no** |
| `**SIBLING:**` | 5 | **no** |
| causal `**ARMS:**` | 79 | yes |

What those dropped lines actually hold is exactly the licensing metadata a piece model needs. From
`RECEIPT_POOLS_DOSSIER_STATE.md:794-805` (DS-ECO-1):

- `**STATE-KEY.**` names the fields and their vocabularies — *"`prosperity` (7-rung closed ladder) ×
  `tradeAccess` enum (…) × `compound.economyOutput` (0–100, banded, never printed in prose)"*.
- `**ENTAILMENT.**` names the CLAIM LICENCE — *"The rung carries no provenance (R-DST-B) ⇒ no
  historical clause anywhere in this block"*, and which sibling block reads what.
- `**RECEIPT:**` (`:1481`, `:1608`, `:1689`) is a file:line list of the rendering surfaces and the
  producers — a hand-written half of the wiring census, already written for 48 blocks.
- `**PROVENANCE:**` records statelessness and which angles are therefore unavailable (e.g. *"STATELESS
  for eight of ten types … `[elder]` is available only in those two blocks"*).

**This is the single most important finding for the piece model: the licence is authored, prose-only,
and unread by any machine.** The only machine-readable licences today are `variant.slots` (anchored
liveness, kernel:146-151) and `marks` (the demoted dimension, kernel:235-238).

### 3.3 The slot register (`scripts/lib/dossier-slot-shapes.mjs`, and §0c / §0c-2 / §0c-4 / §0c-5)

Four shapes, a closed set (`dossier-slot-shapes.mjs:27-44`): `proper`, `bare-common`, `phrase`,
`RESERVED`. The register is parsed BY COLUMN HEADER out of the annex tables (`:88-137`), merged
across both annexes (`:151-173`), and the projection REFUSES TO RUN if any used slot lacks a shape
(`generate-dossier-state-prose.mjs:643-663`). `{timeband_*}` is a prefix family.

Slot usage across the 68 state blocks (`slots.mjs` print): `{settlement}` 68 · `{faction}` 13 ·
`{institution}` 10 · `{counterpart}` 10 · `{good}` 10 · `{seat}` 7 · `{band}` 7 · `{timeband_age}` 7 ·
`{timeband_since}` 6 · `{resource}` 5 · `{reason}` 4 · `{season}` 4 · `{chain}` 4 · then 19 slots on
1–3 blocks each. **48 of 68 blocks carry a slot beyond `{settlement}`; 20 carry only `{settlement}`.**

Three measured facts that bound what the composition model can promise:
- **505 of 2,266 state variants name NO slot at all** (`$SC/arch-prose/keys.mjs`) — for those, the
  pool key is the entire licence.
- **69 block-declared slots are never used by any variant of that block**; the reverse (a variant slot
  missing from its block's SLOTS line) is **0** in both registers today, though the contract test only
  ratchets it at ≤60 (`…contract.test.js:313-333`).
- `{band}` is `RESERVED`: one name for six incompatible grammatical roles across 37 uses in 26 blocks,
  and a fill table for it is refused (`dossier-slot-shapes.mjs:32-39`).
- `{good}`, `{chain}`, `{resource}` are `bare-common` while their producers write Title-Case display
  labels, so 38 variants naming `{chain}` are unreachable on every generated world
  (`economyStateProse.js:19-33`; §0c-5 measures `{good}` at 240 of 248 honest, `{chain}` refused).

### 3.4 The one live-string binding

Two canonical rows are not corpus prose but a byte-copy of an engine string; the generator imports the
constant and substitutes a REFERENCE so the string keeps ONE home
(`generate-dossier-state-prose.mjs:63-96, 124-166`). Measured landing: exactly two refs, both in
`src/data/dossierStateProse/economy.generated.js` — `ECONOMY_FRESHNESS_SENTENCES.tallies` (`:1007`)
and `.catalog` (`:1035`), with the import hoisted at `:6`. The check is fail-closed both ways
(gen:146-166).

---

## §4 HOW A POOL IS KEYED TO ITS KEY FUNCTION

**By raw string equality, at read time, with no registry in between.**

```js
// stateProseKernel.js:318-329
const block = corpus[blockId];
const pool  = block?.pools?.[poolKey];      // ← plain object index on the authored label
```

The desk builds the string. 118 exported `*PoolKey()` functions across six leaves
(`grep -c '^export function .*PoolKey('`): defense 23, general 34, economy 16, power 15, warFaith 20,
stressors 10. Each returns `string | null`, and `null` means the composer renders NOTHING
(`economyStateProse.js:365-383` is the reference shape). 33 `readStateProse(` call sites in `src/`.

Three key-construction idioms are in the tree, and they matter to any renaming:

| idiom | example | risk |
|---|---|---|
| a literal, hand-copied from the annex | `'COMBINATION C2: a high rung on a narrow approach (isolated / mountain_pass)'` (`economyStateProse.js:375`) | a corpus reword silently darkens the pool |
| a value interpolated into a key | `` `GRANARY: ${band}` `` (`economyStateProse.js:421-424`); `` `${bucket} · ${state}` `` (`warFaithStateProse.js:368`); `` `breakdown dominated by ${word}, adverse` `` (`powerStateProse.js:261`) | 2 template-literal returns in the six desks |
| a value upper-cased into a key, then existence-checked | `CORPUS['DS-ECO-9'].pools[key] ? key : null` (`economyStateProse.js:393-401`) | 5 `toUpperCase()` sites |

**Static reachability approximation** (`$SC/arch-prose/literal-keys.mjs`): **358 of 708 pool keys
(50.6%) appear VERBATIM somewhere in `src/domain/display/stateProse/*.js`.** The other 350 are either
built dynamically, mapped through a producer-token table, or belong to a dark block. Ten blocks have
ZERO verbatim key hits: `DS-ECO-4 DS-ECO-5 DS-SUP-1 DS-POP-1 DS-GEN-1 DS-GEN-2 DS-GEN-10 DS-GEN-15
DS-STR-2 DS-WAR-5`. This is an approximation, not the wiring census — it cannot see a table-mapped key
and cannot see an unreachable literal — but it bounds the census's size: the census must resolve
≈350 keys that no grep can join.

The label trap is written down and is real: `dossierMounts.js:73-88` records three producer-token /
corpus-word mismatches (`indebted` → `INDEBTED TO AN OUTSIDE POWER`, `religious_conversion` →
`RELIGIOUS CRISIS`, `heartland` → `settled`) and measures the cost of a label route at 2 of 15 crisis
banners darkened, with no error anywhere.

### 4.1 The draw, and the one-way door it creates

```js
// stateProseKernel.js:301-305
export function drawVariant(eligible, blockId, poolKey, seed) {
  if (!eligible.length) return null;
  if (!seed) return eligible[0];                                   // seedless = canonical-at-zero
  return eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length];
}
```

The causal reader passes the ARM where the state reader passes the pool key
(`causalDossierProse.js:110-116`) — so the third argument is "pool identity", not literally a pool key.

**The identity is the (blockId, poolKey) STRING PAIR and the index is `% eligible.length`.** Two
consequences the contract test states as measured facts rather than theory
(`…contract.test.js:198-240`):

- **APPENDING a variant to an existing pool moves every seeded draw over that pool.**
- **Adding a WHOLE NEW BLOCK moves nothing** — which is why CT-1a/CT-2/CT-3 each added 3–4 wholly new
  blocks and each measured five or six of the seven leaves BYTE-IDENTICAL after regeneration.
- **Renaming a pool key re-rolls that pool for every seed** (the key is hash input).
- Note also that `eligible.length` is state-dependent (audience, slot fills, dimensions), so the draw
  is over the ELIGIBLE list, not the pool — two towns with different fills already draw from different
  denominators.

---

## §5 WHAT THE GATE ALREADY PINS (the schema's real constraints)

`tests/data/dossierStateProseProjection.contract.test.js` (770 lines):

| line | pin |
|---|---|
| 182 | the leaves are not stale against the annexes (`--check` executed in-test) |
| 192 | every desk leaf is non-empty |
| 198 | exactly **68** state blocks and **78** causal families |
| 241 | **variant ratchet**: state ≥ 2,266, causal ≥ 468 — moved DOWN exactly once (2,269→2,266, a chair-ruled corpus cut, ODQ §400) |
| 281 | every causal family: exactly six arm-tagged variants in the single `*` pool, arms declared |
| 290 | **no pool below 2 variants** ("thin enough to be single-voiced") |
| 300 | no residual markdown (`` ` `` or `**`) and no empty text |
| 313 | every slot a variant uses is on its block's SLOTS line (ratchet ≤60; measured 0 today) |
| 334 | ≥89 `dm-only` variants, so the truncation pin is not vacuous |
| 345/354/369/382 | the SHAPE contract: a shape for every used slot, **39 slots** over two registers, every variant rendered against a conformant fixture, and an adversarial fixture that must be convicted |
| 419/508 | every desk FILL TABLE in the tree obeys its slot's declared shape, rendered against every seam |
| 583-768 | the demoted-dimension channel: closed vocabulary, disjoint semantics, fail-closed read, and a DURATION-CLAIM arm (a variant may not state a duration its pool key does not license) |

`dossierMounts.js` adds the routing pins: 56 mount rows (52 `sentence`, 4 `glance`) over 53 distinct
blocks, `UNMOUNTED_BLOCKS` = 15 and SHRINK-ONLY, one sentence rung per block per page-set (the C3 law,
`:26-52`), and the FIRST-PAINT LAW — a sentence drawn inside a collapsed section is dark and must
declare `visibility: 'closed-section'` with a real reason (`:90-112`).

---

## §6 WHAT A SPINE / MODIFIER / TURN / CONNECTIVE SCHEMA WOULD HAVE TO ADD OR CHANGE

### 6.1 The four pieces against today's record

| the piece | what today's shape already gives it | what is MISSING |
|---|---|---|
| **SPINE** | everything. A pool IS a spine family: keyed on a predicate, 2–6 angle-distinct whole sentences, drawn by seed | a declared `role`, and a machine-readable predicate (today the predicate is the KEY STRING and the STATE-KEY prose) |
| **MODIFIER** | nothing structural. A modifier is a FRAGMENT keyed on one secondary fact | a fragment grammar (no terminal stop, lowercase opening, an attachment point), the secondary fact it reads, the relation it can carry, and a rule that a fragment is never drawn alone |
| **TURN** | nothing. Today a "named combination" is authored as its own POOL (DS-ECO-1's five `COMBINATION Cn` keys are exactly this, hand-cut at the block grain) | a key namespace on the engine's typed EXPLANATION, not on a fact conjunction; and an eligibility test the kernel can run |
| **CONNECTIVE** | **it is baked inside the sentence**. The causal annex's §7 authors twelve typed connectives (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1982-2020`) and they reach the runtime only as substrings of variant text (`grep -c "still being paid" src/data/dossierCausalProse.generated.js` → 4) | a separate connective table keyed on RELATION, and a licence tying each phrase to an edge |

Two prebuilt maps the design should reuse rather than mint:

1. **§7 THE INLINE CONNECTIVES** (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1982-2020`) — twelve connectives,
   each with the typed provenance EDGE that licenses it (`priced`, `caused`, `dissolved`, `remembered`,
   `enforced`, `believed`, `refused`, `carried`, `exposed`, `followed`) and a written statement of what
   it entails and must not. It states the law the composition model needs verbatim: *a connective is
   chosen by the typed provenance edge, never by the music*, and names the `followed` connective as
   "the one a fluent writer will reach past". Two terminals (`chain_end`, `horizon`) are declared NOT
   connectives.
2. **`src/domain/display/discourseKernel.js`** — the chronicle's connective machinery, already shipped:
   `RELATION_FOR_TYPE` (a typed node → one of `causal | adversative`), `CONNECTIVE_LEXICON`
   (`:151-186`, causal banded `deep`/`near`/`pivot`, plus `parallel`, `adversative`, `anticipatory`),
   `DEFAULT_CONNECTIVE` as an explicit **totality floor** (`:188-190`), and `ALL_CONNECTIVES` as a
   frozen finite set a provenance pin checks a rendered clause against (`:201-210`). Its own docblock
   marks the lexicon "DRAFT — pending the Fable-tier authoring pass". This is the exact shape a dossier
   connective table wants, one register over.

### 6.2 The minimum schema delta, field by field

| where | new field | why | cost |
|---|---|---|---|
| block | `role` is not enough at block grain — put it on the POOL | a block mixes lenses today (DS-POW-1's eleven pools are three lenses; DS-ECO-12's are three) | needs a pool to become an OBJECT, not an array (see 6.3) |
| pool | `role: 'spine'\|'modifier'\|'turn'` | the composer must know what may stand alone | schema change |
| pool | `reads: string[]` (the canonical producer tokens/paths) and `predicate: string` | the licence, machine-readable; today only in STATE-KEY prose | annex grammar + parser |
| pool | `relations: string[]` for a modifier (`tension`/`consequence`/`contrast`/`addition`) | connective choice must be typed, never chosen by music (§7's law) | schema change |
| pool | `explanationId` for a turn | keys a turn on a causal edge the engine holds, not on a fact conjunction | needs the explanation seam |
| variant | `form: 'sentence'\|'fragment'` (or make it implicit in the pool's role) | a fragment must never render alone; the "no markdown / no empty" arm does not catch a fragment | contract-test arm |
| variant | `family: <id>` **or** nesting `wordings: string[]` | the owner's 4× wording layer (§6.4) | see the draw analysis |
| variant | `lengthClass` | the family must span the exemplar bands by AUTHORING; a class makes it checkable | authoring + gate |
| corpus | a connective table `{relation → [phrases]}` + a default | totality floor, per the discourseKernel precedent | new leaf |

### 6.3 The one shape decision that is load-bearing

A pool is an **array** today (`pools[key] = variants[]`). Every consumer indexes it as an array:
`eligibleVariants` filters it (kernel:247-269), `poolDimensions` scans it (kernel:215-224),
`hasStateProsePool` checks `Array.isArray` (kernel:354-357), the contract test's thin-pool arm reads
`pool.length` (`…contract.test.js:290-299`), and the causal reader filters it by arm
(`causalDossierProse.js:110-113`).

Turning a pool into `{ role, reads, variants: [...] }` touches all of those. The alternative — keeping
`pools` an array-of-variants and putting piece metadata in a SIBLING map on the block
(`block.poolMeta[key] = {...}`) — leaves every existing reader byte-identical and lets the migration
car prove exactly what the brief demands (byte-identical dossier OUTPUT for every golden seed) with
nothing but ADDED keys. **The sibling-map shape is the cheaper migration and preserves the array
contract; the nested shape is tidier and costs a full reader sweep.** This is a design decision, not a
finding — both are open in §9.

### 6.4 The 4× wording layer against the draw (the arithmetic, measured)

Two candidate encodings:

| | FLAT (siblings in the same pool) | NESTED (`variant.wordings[]`) |
|---|---|---|
| `eligible.length` | ×4 for every pool | unchanged |
| same-seed text today | **re-rolls everywhere** (`% eligible.length`) — the declared, owner-signed TEXT shift | unchanged by the schema alone; the shift arrives only when the second draw is switched on |
| draw uniformity | uniform over wordings for free — exactly the brief's default | needs a SECOND draw; keying it on the same `${seed}::${blockId}::${poolKey}` string would correlate face-with-variant, so it needs a distinct key (e.g. `…::${poolKey}::w`) |
| thin-pool arm | 33 two-variant pools become 8-variant pools | unchanged |
| `poolDimensions` / arm filters | must hold across a family (all four faces carry the parent's marks) | free — one record, one mark set |
| the dimension/audience invariant | four faces must carry IDENTICAL `marks` and `slots`, or the family splits under filtering | structurally guaranteed |

The last row is the sharpest: under FLAT, a family whose four faces do not carry identical `slots` and
`marks` will lose faces under anchored liveness on some towns and keep them on others, so the
one-in-four roll silently becomes one-in-three. Whatever encoding is chosen, **claim-equality must
extend to slot-equality and mark-equality, and a gate arm must assert it.**

Size, measured (`$SC/arch-prose/bytes.mjs`, `bytes2.mjs`):

| | today | ×4 on the variant records only |
|---|---|---|
| state leaves | 641,410 B (variant records 505,033 B = 78.7%; sentence text alone 280,577 B, 124 B/sentence) | **2,156,509 B ≈ 2.06 MiB** |
| causal leaf | 210,260 B (variant records 163,964 B = 78.0%; text 85,931 B, 184 B/sentence) | **702,152 B** |
| both | 851,670 B | **≈ 2,858,661 B ≈ 2.73 MiB raw** |

The brief's "roughly 2.5 MB" estimate is close and slightly low for both registers together; it is a
good estimate for the state register alone. All of it rides the LAZY chunk: `vite.config.js:876-878`
routes any `/src/data/` module an eager chunk does not statically reach to `data-lazy`, derived rather
than curated. `scripts/.size-baseline.json` holds 19 entries and **none of them is a dossier prose
leaf** — so the per-file size ratchet does not currently guard this corpus, and the chunk-level
ratchets are the only thing that would notice a 2.7 MB corpus.

### 6.5 What the GENERATOR must grow

1. **New annex line kinds** (typed, backticked, machine-read the way SECTION-TARGET and ARMS already
   are): `**READS:**`, `**ROLE:**`, `**RELATION:**`, `**EXPLAINS:**`. The parser already has the exact
   pattern for this — a `^\*\*NAME[:.]\*\*` branch that scrapes backticked tokens and throws on an
   unknown one (gen:326-348, and `assertSectionTargets` gen:533-554). Copy that shape; do not invent a
   second one.
2. **A fragment grammar** for modifiers. The current `VARIANT_RE` (gen:175) accepts any body; a
   modifier must be distinguishable from a spine at parse time, or the drop-check will happily project
   fragments as spines.
3. **A family grammar** for the four wordings. Under FLAT this is free (four numbered rows in one
   pool) but then nothing marks them as ONE family; under NESTED it needs a nesting shape the numbering
   guard (gen:406-411) currently forbids.
4. **A connective leaf** — a seventh emitted file, or a section of an existing one, plus the
   fail-closed vocabulary assertion the SECTION-TARGET check already models.
5. **The drop-check must extend** to the new line kinds, or the parser's one real guarantee (nothing is
   silently lost, gen:432-452) shrinks to cover only the sentence rows.

---

## §7 THE FIVE MEASURED FACTS A DESIGNER SHOULD NOT RE-DERIVE

1. **68 blocks · 708 pools · 2,266 variants · mean 3.20** (state); **78 · 78 · 468 · 6.00** (causal).
2. **The pool key is the hash input and the array length is the modulus** — appending re-rolls, a new
   block does not, a rename re-rolls.
3. **The licence is prose.** 68 STATE-KEY, 48 RECEIPT, 23 PROVENANCE, 22 ENTAILMENT lines are authored
   and are dropped at projection; the only machine-readable licences are `slots` and `marks`.
4. **50.6% of pool keys appear verbatim in a desk file**; ten blocks have none. The wiring census must
   resolve ≈350 keys that no grep can join.
5. **The connective already has two homes** — §7's twelve edge-licensed phrases (annex prose) and
   `discourseKernel.js`'s relation-banded lexicon with a totality default (shipped code). Neither is
   wired to the dossier state register.

---

## §8 CONSTRAINTS THE DESIGN MUST OBEY (each with its enforcement site)

1. A pool may never fall below **2 variants** (`…contract.test.js:290`); under a 4× family the floor
   should be re-stated in FAMILIES, not faces, or the arm becomes vacuous.
2. The variant inventory is a **ratchet** and has moved down exactly once, by a chair ruling with a
   measured key-by-key diff (`…contract.test.js:241-280`). "NEVER TRIM" is already the tree's law.
3. **Every slot a variant names must be declared with a SHAPE, or the projection refuses to run**
   (gen:643-663). A new piece kind inherits this unchanged.
4. **`fillSlots` performs no capitalisation of any kind** (kernel:280-289; §0c-4 spells the
   consequence). A composed sentence that puts a modifier or a fill sentence-initially inherits this
   defect; the composition grammar must own case, or the kernel's fill contract changes for every
   `phrase` slot at once.
5. **Fail-closed audience and fail-closed dimensions**: an unanswered dimension reads as SILENCE, not
   as "everything" (kernel:254-261). Composition must not open a path around this.
6. **Anchored liveness**: a variant renders only when every slot it names has a fill (kernel:146-151),
   checked twice on purpose (kernel:271-278). A composed sentence has to be anchored PER PIECE.
7. **One sentence rung per block per page-set** (`dossierMounts.js:26-52`) and the **FIRST-PAINT LAW**
   (`:90-112`). More prose per block does not buy more positions.
8. **The digit ban and the band vocabulary** (§0d, `…:428-454`); the kernel rejects a numeric fill
   outright (kernel:130-138).
9. **`marks` is an untyped bag with three semantics already** (kernel:48-53). A fourth semantic in the
   same field is how the next silent failure arrives.
10. **The doc is the source; the leaf is a projection; the gate refuses a stale byte** (gen:5-11,
    706-713). Any authored piece that lives only in `src/data` forks the corpus.

---

## §9 OPEN QUESTIONS

1. **Pool shape.** Sibling metadata map (`block.poolMeta[key]`) versus a pool object
   (`{role, reads, variants}`)? The first keeps every reader and every array contract byte-identical
   and makes the migration car trivially provable; the second is tidier and costs a sweep of
   `eligibleVariants`, `poolDimensions`, `hasStateProsePool`, the causal reader and four test arms.
2. **Wording families: FLAT or NESTED?** FLAT gets uniform-over-wordings for free and re-rolls every
   seed once (the declared, owner-signed shift). NESTED preserves same-seed text until the second draw
   lands, but needs a second draw key that does not correlate with the first. The brief names FLAT as
   the default; the trade above is the argument either way.
3. **Where does the modifier's ATTACHMENT POINT live?** In the modifier (a leading connective slot), in
   the spine (a declared join site), or in the composer (a grammar that owns the seam)? Only the third
   keeps the corpus free of per-spine authoring, and only the first two survive `fillSlots` having no
   case handling.
4. **Does a modifier get its own block, or a role inside its spine's block?** A separate block id is
   the ONLY change shape the tree has proved to move no seeded draw (CT-1a/2/3); a new pool inside an
   existing block also moves nothing (the modulus is per pool), but a new ROLE field on an existing
   pool changes leaf bytes without changing any draw — that needs stating in the migration car.
5. **What is the machine-readable form of `reads`?** The RECEIPT lines are file:line citations of
   RENDERING surfaces; the STATE-KEY lines name FIELDS in prose with vocabularies inline. Neither is a
   token list. Does the authoring wave rewrite 68 STATE-KEY lines into typed `**READS:**` rows, or does
   the wiring census derive `reads` from the desks and reconcile against the prose?
6. **Do the causal families become TURNS?** They are already: one pool, six variants, arm-tagged, keyed
   on a join the caller has evidence for, and drawn on `(familyId, arm)` rather than a pool key
   (`causalDossierProse.js:110-116`). If so, the turn schema may be the causal schema, and the work is
   keying it on `src/domain/explanation.js`'s typed explanations rather than on a caller-supplied
   `familyId`.
7. **Which connective table wins?** §7's twelve edge-licensed phrases are dossier-register and prose;
   `discourseKernel.js`'s lexicon is chronicle-register and shipped code with a totality floor. Are
   they one table with two registers, or two tables? (Reusing the chronicle's phrases in the dossier
   would breach the §0b register: those are colon-bridges for headline-following clauses.)
8. **`{band}` stays RESERVED.** 37 uses in 26 blocks, six incompatible grammatical roles
   (`dossier-slot-shapes.mjs:32-39`). Does the piece model wait on the §0d split, or do modifiers
   route around `{band}` entirely?
9. **The size ratchet has no entry for this corpus.** `scripts/.size-baseline.json` holds 19 entries
   and none is a prose leaf. At ~2.7 MB raw, should the corpus get its own ratchet row, and against
   what — raw bytes, gzipped chunk bytes, or variant count (which the contract test already ratchets)?
10. **What happens to the 505 slot-less variants and the 69 unused declared slots?** They are the
    corpus's least-licensed rows: no anchored-liveness check applies to them at all, so composition
    can attach them anywhere the pool key fires. Are they the first authoring-wave targets, or the last?

---

### Scripts run for this map (read-only, written under `$SC/arch-prose/`)
`shape-census.mjs` · `keys.mjs` · `keys2.mjs` · `mounts.mjs` · `literal-keys.mjs` · `bytes.mjs` ·
`bytes2.mjs`, plus `$SC/s12-sitting/verify/slots.mjs` (read-only, as the brief directs).
