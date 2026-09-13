# DESIGN A — THE COMPOSED-PROSE MODEL, LED FROM THE DATA
**Seat: Fable 5.1 — architect · 2026-09-07 · angle: DATA-MODEL FIRST**

Product read at `$SC/laneB6` = `3b1c0eaa5` (`git log --oneline -1`, executed); instruments at `$SC/skepINSTR` = `74a1aa0e8` (executed). `$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit`. Every figure is either (a) the print of a command I ran (`arch-prose/_a-blocks.mjs`, `arch-prose/_a-conj.mjs`, both read-only, both under `$SC/arch-prose/`), (b) cited to a reader map (`read-kernel.md`, `read-data.md`, `read-explanations.md`, `read-facts.md`, `read-specs.md`, `read-instruments-seed.md`) whose author ran it, or (c) cited to `file:line`. Anything else is marked **ESTIMATE**. No corpus sentence is quoted past twelve words; illustrative fragments are marked ILLUSTRATIVE and are shapes, not authored text. Nothing was written outside `$SC/arch-prose/`.

**The one-paragraph thesis.** The corpus already IS a piece table: a pool is a spine family keyed on a predicate, drawn by seed, licensed by its slots and marks. Everything the owner's model needs that is missing is METADATA — a role, a machine-readable licence, a relation, an attachment — and a second draw over wordings. So this design changes the data shape by ADDING KEYS beside the pools and never inside them, keeps every reader byte-identical through migration, puts the composition in one new pure leaf between the kernel and the desks, and makes the wiring census (INSTR car 8, already commissioned) the arbiter of what any piece may claim. The bold part is not a new engine; it is refusing to let the corpus grow by another hand-cut combination cell ever again.

---

## 1. PURPOSE, THE OWNER'S WANT, THE NON-GOALS

The owner wants a town page whose prose grows more specific with every relevant fact the engine holds — a wall funded by an underpaid muster, said one way when the granary behind it is thin and another when the watch that mans it is bought — with the growth bounded so the authored corpus stays linear while the surfaced readings multiply, and with staleness gone: nothing ever repeats unless the very same situation repeats (`ARCH-BRIEF.md:5-7`). The chair's method, adopted, is to author PIECES (spines, modifiers, turns, connectives) and buy the COMBINATIONS with grammar, under bounds of occurrence, depth, relation and licensing (`ARCH-BRIEF.md:11-17`); the owner's ~22:30 rule adds that every semantic piece, existing and planned, is born as a family of four wordings the seed rolls an unweighted die over, and nothing authored is ever trimmed (`:23-30`).

**Non-goals, each a refusal with its law.** (1) No language model at render — THE PROMISE and FINITE SEMANTICS; the model is a clerk (`:18`). (2) No per-combination authoring: a fact conjunction never earns its own pool again; only a NAMED combination the engine holds as a typed explanation earns a hand-written turn (`:14`). (3) No fact shift under any seed: the model touches display only (`stateProseKernel.js:10-11`, "nothing here is persisted"); every persisted-shape change it would like is listed in §13 as the owner's, not taken. (4) No draw-time refusal or weighting: rhythm and variety come from AUTHORING and the GATE (`:28`; CLERK-LAWS §2.5 via `read-specs.md:197`).

---

## 2. THE PIECE MODEL — the schema, led from what ships

### 2.1 What ships today (the record the design extends)

The runtime shape, verbatim from the projector (`scripts/generate-dossier-state-prose.mjs:556-582`, `read-data.md:40-59`):

```
block  = { title, sectionTarget?, arms?, slots, pools: Record<poolKey, Variant[]> }
Variant = { angle, marks?, text, slots }
```

Measured over the six leaves: 68 blocks · 708 pools · 2,266 variants · mean 3.20; histogram 2→33, 3→547, 4→96, 5→17, 6→15 (`ARCH-BRIEF.md:31`; reproduced independently by `read-kernel.md:169-172` and `read-facts.md:504-505`). **There is no other metadata** — no licence, no fields-read, no role, no relation, no family (`read-data.md:73-75`). The licence exists, but as prose the projector drops: 68 STATE-KEY lines, 48 RECEIPT, 23 PROVENANCE, 22 ENTAILMENT (`read-data.md:157-166`). The only machine-read licences are `slots` (anchored liveness, `stateProseKernel.js:146-151`) and `marks` (audience + demoted dimension, `:159-163`, `:235-238`).

Three shipped facts fix the shape decision:
- **A pool is an ARRAY and every consumer indexes it as one** — `eligibleVariants` (`stateProseKernel.js:247-269`), `poolDimensions` (`:215-224`), `hasStateProsePool` (`:354-357`), the causal reader (`causalDossierProse.js:110-113`), the thin-pool contract arm (`read-data.md:354-358`).
- **The draw is `seed::blockId::poolKey` over `eligible.length`** (`stateProseKernel.js:304`); appending re-rolls, a new key moves nothing, a rename re-rolls (`read-data.md:270-280`).
- **`marks` is an untyped bag with three semantics already** (`stateProseKernel.js:48-53`); a fourth vocabulary in it is the next silent failure (`read-data.md:456-457`).

### 2.2 The four pieces, as data

**A PIECE IS A POOL.** Not a variant. The role, the licence and the relation belong to the thing the desk's key function selects, and that is the pool. Every existing pool is a spine from the day the schema lands, with zero text change and zero leaf change (§2.6).

| piece | what it is in the data | draws alone? | keyed by |
|---|---|---|---|
| **SPINE** | a pool of whole sentences (today's pool, unchanged) | yes | the block's primary predicate — the key function's return |
| **MODIFIER** | a pool of FRAGMENTS (independent clauses, no capital, no stop) keyed on ONE secondary fact, with a declared RELATION and a declared ATTACH set | **never** | a secondary predicate; a fragment is never rendered without a spine |
| **TURN** | a pool of whole sentences keyed on a typed EXPLANATION the engine holds, replacing spine+modifiers for its block when its explanation is present | yes, in place of the spine | `explains:` a closed id (§5) |
| **CONNECTIVE** | not a pool — a seventh leaf, a table keyed by RELATION with a clause form and a sentence form per phrase, and a totality floor | n/a | the relation, never the music (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1991-1999`) |

### 2.3 The schema delta — a SIBLING MAP, never a pool object

```js
// src/data/dossierStateProse/<desk>.generated.js — projected, never hand-edited
StateProseBlock = {
  title, sectionTarget?, arms?, slots,
  pools:    Record<poolKey, StateProseVariant[]>,     // UNCHANGED — every reader stays byte-identical
  poolMeta?: Record<poolKey, PoolMeta>,               // NEW — absent ⇒ { role: 'spine' } with undeclared reads
}
PoolMeta = {
  role:       'spine' | 'modifier' | 'turn',
  reads:      string[],        // canonical field paths, e.g. 'defenseProfile.economicGates.military'
  predicate:  string,          // the typed predicate as authored: 'economicGates.military < 1'
  relation?:  'tension' | 'consequence' | 'contrast' | 'addition',   // modifiers only
  attach?:    string[],        // modifiers/turns: spine pool keys of THIS block, or 'DS-XXX-N:<key>' for a reservoir pool (§2.7)
  explains?:  string,          // turns only: 'cause:scandal' | 'contradiction:threat_without_response' | 'condition:famine'
  occurrence?: { towns: number, of: number, band: 'rare'|'uncommon'|'common'|'universal' },  // baked from the census (§3.4), frozen per wave
}
StateProseVariant = {
  angle, marks?, text, slots,                         // UNCHANGED
  grammar?:  'V1'…'V8',                                // per GRAMMAR_TAG_CONTRACT (moveGrammar.js:145-162), spines and turns
  move?:     'PRESENT' | 'CONSEQUENCE' | 'ABSENCE' | …, // modifiers: ONE move (moveGrammar.js:38 MOVES), not an order
  form?:     'sentence' | 'clause',                    // defaults: spine/turn 'sentence', modifier 'clause'
  wordings?: string[],                                 // the owner's family: faces 1…n-1; face 0 is `text`; slot set and marks are the variant's — shared by construction
}
// src/data/dossierStateProse/connectives.generated.js — the seventh leaf
Connectives = {
  tension:     { clause: string[], sentence: string[], licence: 'edge' },
  consequence: { clause: string[], sentence: string[], licence: 'edge' },
  contrast:    { clause: string[], sentence: string[], licence: 'sibling-band' },   // wall 5
  addition:    { clause: string[], sentence: string[], licence: 'none' },
  default:     { clause: 'and', sentence: 'And' },                                   // the totality floor (discourseKernel.js:188-190 precedent)
}
```

**Why the sibling map and not `{role, reads, variants}`.** `read-data.md:352-366` lays out the trade: the nested pool object touches every reader and four test arms; the sibling map leaves `pools` an array-of-variants and lets the migration car prove byte-identical dossier output with nothing but ADDED keys. This design takes the sibling map and adds the reason the read-data lens did not: **the sibling map is also the only shape under which a pool's IDENTITY (the draw key) is provably untouched by any metadata edit** — `drawVariant` reads `blockId` and `poolKey` (`stateProseKernel.js:304`) and never a pool's fields, so a `poolMeta` edit cannot move a draw by construction. A nested object would make that a property to prove rather than a shape.

**Why `wordings` is NESTED and not flattened into the pool.** Because eligibility is per variant (`variantIsAnchored :146`, `variantIsAudible :159`, `variantSpeaksOver :235`) and the modulus is over the eligible list (`:304`): four flat siblings that differ in `slots` or `marks` by one token are drawn at unequal rates on some towns — a weighted draw wearing an unweighted one's coat (`read-specs.md:244` S8; `read-facts.md:719-724` Q4). Nesting makes the identity law STRUCTURAL: a face has no `slots` and no `marks` of its own, so it cannot differ. The projector asserts the one thing nesting cannot guarantee — that `slotsOn(face)` equals `slotsOn(text)` for every face (a face that drops `{settlement}` would render a claim without its anchor). Measured consequence (`read-instruments-seed.md:163-178`, `draw-reroll.mjs`, 200 seeds × 708 pools): the flattened one-level roll preserves the semantic variant on 45.21 % of reads; the two-level roll on 100.00 %, with the face draw uniform at 25.05 %. **This is the design's one departure from the brief's stated default (`ARCH-BRIEF.md:27`), and §13 row O-2 puts the choice to the owner with that number.**

**Naming.** The field is `wordings`, the prose word is "wording set" or the owner's "family". Never `family` in code: `tests/lint/proseFamilyContract.walker.test.js` already owns that identifier for the chronicle's four durable prose families (`read-instruments-seed.md:25`).

### 2.4 The annex grammar — copy the SECTION-TARGET shape, do not invent a second

The projector already has one pattern for a typed, backticked, fail-closed metadata line: `^\*\*NAME[:.]\*\*` scraped for backticked tokens, unknown tokens thrown (`generate-dossier-state-prose.mjs:326-348`, `assertSectionTargets :533-554`). Every new line uses that pattern and lands in the same parser branch (`read-data.md:403-406`). A per-pool line sits between the pool's bold label and its first variant; the parser's pending label is sticky across exactly that gap (`:420-423`), and a colon-terminated bold span is already refused as a label (`isPoolLabel :218`), so the new lines are invisible to today's parser and captured by tomorrow's — the annex can carry them before the projector reads them, which is what makes car M2 a zero-text car.

| annex line | scope | grammar | projects to | refused when |
|---|---|---|---|---|
| `**ROLE:** \`modifier\`` | pool | one token of {spine, modifier, turn}; absent ⇒ spine | `poolMeta[key].role` | a token outside the three |
| `**READS:** \`defenseProfile.economicGates.military\` · \`config.monsterThreat\`` | pool | backticked canonical paths | `.reads` | a path the wiring census does not list under this (block, pool) (§3.3) |
| `**PREDICATE:** \`economicGates.military < 1\`` | pool | one backticked row, or `∨`-joined rows | `.predicate` | absent on a modifier or a turn |
| `**RELATION:** \`tension\`` | modifier pool | one of four | `.relation` | absent on a modifier; present on a spine |
| `**ATTACH:** \`WALLED-THREATENED\` · \`WALLED-QUIET\` · \`WALLED-STRAINED\`` | modifier / turn pool | spine pool keys of this block, or `DS-XXX-N:<key>` | `.attach` | a key the block does not hold; more than THREE attachments per modifier pool (the echo bound, §4.8) |
| `**EXPLAINS:** \`cause:scandal\`` | turn pool | one id from the closed vocabulary of §5.2 | `.explains` | an id outside it; a turn with no EXPLAINS |
| variant tag `` `[street · dm-only]` `[grammar: V2]` `` | spine/turn variant | the existing optional second tag (`VARIANT_RE :174`) | `.grammar` | (GRAMMAR_TAG_CONTRACT unchanged) |
| variant tag `` `[street]` `[move: CONSEQUENCE]` `` | modifier variant | same slot, the word `move:` | `.move` | a modifier with `grammar:` or a spine with `move:` |
| `   ~ second wording text` (an indented tilde line under a variant) | variant | up to n−1 faces; slot set must equal the parent's | `.wordings[]` | a face whose `slotsOn` differs; a face after the freeze (§2.5) |
| §7b table `THE STATE CONNECTIVES` | annex section | relation · clause form · sentence form · licence · band | the seventh leaf | a relation outside the four; an em dash (B-DASH); a `which` |

**The composed unit's grammar is DERIVED, never tagged.** A spine or turn carries one `grammar:` order (V1…V8) and a modifier carries one `move:`; the unit's order is the spine's order followed by the taken modifiers' moves in arrangement order, and that is what the classifier is compared against. The tag vocabulary does not grow, so `parseTag` and `GRAMMAR_TAG_CONTRACT` are untouched beyond routing the two new tag words (S20, `read-specs.md:268`).

The drop-check (`assertNothingDropped :432-452`) extends to the tilde line and the two new tags, or the parser's one real guarantee shrinks (`read-data.md:415-417`). `parseTag` routes `grammar:` and `move:` away from `marks` or `STATE_MARK_DIMENSIONS`' contract reds (`moveGrammar.js:151-157` via `read-specs.md:93`); the projector and `tests/data/dossierStateProseProjection.contract.test.js` move together (`--check` is a byte compare, `read-instruments-seed.md:192`).

### 2.5 The draws — one existing key, one new key, both seed inputs from birth

```js
// stateProseKernel.js — the variant draw is UNCHANGED (:301-305)
drawVariant(eligible, blockId, poolKey, seed)   // eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length]

// NEW — the face draw, keyed by a SUFFIX of the same string
facesOf(variant)    = [variant.text, ...(variant.wordings ?? [])]
drawFace(faces, blockId, poolKey, seed)
  = faces.length === 1 ? faces[0]                                              // no hash at all: today's path, byte-identical
  : !seed              ? faces[0]                                              // seedless is canonical-at-zero (law 4)
  : faces[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}::w`)) % faces.length]
```

Laws this satisfies, each named: the parent key is unchanged so no semantic variant moves (THE PROMISE, `read-specs.md:246` S9 — the re-roll a length change forces is AVOIDED, not declared); the face key is a new key and therefore a seed input from its birth (A7/A17; `read-explanations.md:559-561` C8); the face draw is uniform and unweighted (owner ~22:30; measured 25.05 %, `read-instruments-seed.md:171`); seedless reads face 0 (kernel law 4, `:36-38`). A modifier pool draws with its own `seed::block::key` because it IS its own pool — no third key is needed, and two modifiers on one spine draw independently of each other and of the spine (the read-facts Q5 question, answered by the data shape rather than by a new segment). The salience tie-break (§4.4) is the ONLY genuinely new key beyond `::w`, and it is declared as such.

**The one-time-per-pool shift, stated plainly.** Before the rewrite a variant has one face, `drawFace` never hashes, and the page is byte-identical. The day a pool's wording sets land (faces 1→4), that pool's text shifts on every existing world — the declared, owner-signed TEXT shift (`ARCH-BRIEF.md:30`), pool by pool, wave by wave, and NEVER a shift of which angle or claim speaks. A fifth face added later re-rolls only that pool's face draw; the rule "never trim" is therefore paired with "never append after the freeze; a new wording goes in a new key" (`read-specs.md:246`). The migration car proves wording-only by the manifest of §3.5, not by the generator golden master, which cannot see dossier text (`read-instruments-seed.md:213-219`).

### 2.6 How the 708 pools MIGRATE — zero text change, zero leaf change, then zero text change

Three cars, in order, each with a proof (§12 has the full rows):

1. **M1 — the composer path lands, the corpus does not move.** `poolMeta` is absent on every block, so every pool reads as `{role: 'spine'}`; `wordings` is absent on every variant, so `drawFace` never hashes; the composer (§4) finds no modifier candidates and returns the spine alone. The six leaves are byte-identical; the manifest (§3.5) is byte-identical over N = 200 seeds. **Proof: the manifest.**
2. **M2 — the schema lands, the text does not move.** The projector learns the lines of §2.4 and emits `poolMeta` only where the annex declares one; the census (§3) reconciles every `READS` token. The first declarations are the 68 STATE-KEY lines re-spelled as `READS` + `PREDICATE` rows on the spines they already describe — a transcription the census verifies against the recovered `fieldsRead`, never a re-authoring. Leaf bytes change (new keys); `pools[key]` arrays do not; the manifest is byte-identical. **Proof: the manifest, plus a leaf diff showing only `poolMeta` keys added.**
3. **The rewrite (per register) and the authoring wave** — text changes, declared per car (§12).

Two families of existing pool need a ruling at migration and get one here (vetoable):
- **The 111 conjunction-keyed pools** (`read-kernel.md:453` under its marker set; 72 under a strict boolean-marker set — `_a-conj.mjs`, executed: `AND | NO | with | without | × | · | only | neither | but`; 52 of 68 blocks hold none) stay SPINES with a two- or three-fact `reads` and a conjunctive `predicate`. A multi-fact spine is lawful — the predicate is the key function's, e.g. `invasionRowPoolKey(walls, garrison, militia)` at `defenseStateProse.js:309`. They are simply never GROWN: a new combination cell is refused at the gate (a `ROLE: spine` pool whose `reads` is a superset of a sibling spine's `reads` in the same block is a finding, WITHHELD to the chair). DS-DEF-2's 18 conjunction-keyed pools of 26 (`_a-conj.mjs`) are the specimen: they were the hand-paid explosion (`read-facts.md:452-458`) and the model's job is to stop the bill, not refund it.
- **The 642 multi-sentence variants** (28.3 %, `read-kernel.md:376-385`) stay spines with reduced CAPACITY (§4.5): a two-sentence spine accepts one clause modifier and no sentence modifier; the eight three-sentence spines accept none. No split, no rewrite at migration; the rewrite wave decides per variant whether to split, which is a corpus act with its own declared shift.

### 2.7 The reservoir — 448 authored variants in 15 blocks no composer calls

Fifteen blocks (`UNMOUNTED_BLOCKS`, `dossierMounts.js:483`; 448 variants, `read-facts.md:329-336`) are authored, licensed prose about real facts with no caller. The model treats a reservoir pool as a MODIFIER CANDIDATE only by an explicit annex act: `**ATTACH:** \`DS-DEF-11:WALLED-STRAINED\`` on the reservoir pool, which (a) leaves its draw key `seed::<its own block>::<its key>` untouched (moving nothing, the CT-1a/2/3 pattern, `read-data.md:274-277`), (b) licenses it by the ATTACH site's bag, not its own (the S5 amendment, `read-specs.md:238`), and (c) needs a fragment form — a whole-sentence reservoir variant cannot attach as a clause and so attaches only as a sentence modifier (§4.5). `UNMOUNTED_BLOCKS` stays shrink-only and unchanged: an attached reservoir block is still unmounted, because it still has no sentence rung of its own (the C3 law, `dossierMounts.js:26-52`). Which of the fifteen are wiring debt and which are dead by design is the census's question (§3), not this document's; only DS-DEF-7 is declared dark in source (`defenseStateProse.js:1435` via `read-facts.md:334-335`).

---

## 3. THE WIRING CENSUS — the source of truth

### 3.1 What it is and where it comes from

INSTR car 8 is commissioned and not built (`$SC/briefs/brief-INSTR-912-car8.md`, 38 lines, read whole). Its specification is the owner's: for every (block, pool), `{predicate, fieldsRead, slotsFilled, status}` recovered from the SOURCE of the key functions and bags, never inferred from prose, with `WIRING-UNRESOLVED` for what static reading cannot follow; and, by the 21:50 addendum, the same table indexed the other way — fact → the pools, variant count and grammar count that can speak to it, including every fact COMBINATION a key function conjoins. This design does not re-mint it. It says what the census must ADD to serve composition, how it becomes product-visible without an instrument entering the product, and what a missing row does.

Three prebuilt maps already exist and the census unifies them — the owner's question at `ARCH-BRIEF.md:8` is answered YES: (1) the annex's STATE-KEY / RECEIPT / ENTAILMENT prose — the licence, hand-written for 68/48/22 blocks, unread by any machine (`read-data.md:181-183`); (2) `tests/helpers/dossierComposedFill.js` — the composer's bag per (block, pool), static from source, with `conditional` and `unresolved` tiers (`read-instruments-seed.md:329-336`); (3) `src/domain/display/causeConjunctionContent.js` — a live four-rung specificity ladder over a licensed key with a seeded draw and a floor (`read-explanations.md:414-438`). The census is (1)+(2) in machine form; the composer generalises (3).

### 3.2 The row, both directions

```
row  = { block, pool,
         predicate:   [{ field, op, value }] | 'WIRING-UNRESOLVED:<reason>',
         fieldsRead:  string[],                                   // recovered from the key function + the reading function
         bag:         { declared: string[], variantUnion: string[], composed: string[], conditional: string[], unresolved: string[] },
         site:        string[],                                   // the mounts this pool can speak at, incl. ATTACH sites for modifiers
         occurrence:  { towns, of: N, sha },                      // by execution over the N-town sample (§3.4)
         status:      'RESOLVED' | 'WIRING-UNRESOLVED',
         tier:        'COVERED' | 'THIN' | 'MISSING' }            // §3.3
fact = { field, values: string[] | null, closed: boolean,          // closed per the value-space table, read-facts.md §5.2
         pools: [{block, pool, role, grammars}],
         asModifier: [{block, pool, attach}],                    // where this fact can already attach
         combos: [{ with: field, pools: [...], occurrence }] }   // fact-pair co-occurrence BY EXECUTION
```

Two corrections the census must carry from the readers, or it inherits their errors: the bag resolver resolves a name to the FIRST `const <name> =` in the file and mis-credits nine defense sites and DS-POW-1 (`read-facts.md:239-268`; corrected bags in its §3.2) — car 8 fixes this before the census is trusted; and a KEY-ONLY fact is not a dark fact but a rendered CHOICE, so 59 is an upper bound on opportunity (`read-facts.md:116-119`).

### 3.3 The tiers — the authoring list falls out of the table

| tier | definition (per fact, and per fact-pair that fires on ≥ the occurrence threshold of §6.1) | what the wave does |
|---|---|---|
| **COVERED** | a RESOLVED pool reads it AND (as a spine) its pools carry ≥ 2 distinct level-1 grammars AND at least one modifier can attach to that spine | nothing; measured spread only |
| **THIN** | a RESOLVED pool reads it as a spine, but the block licenses one grammar (33 of 68 do, `read-specs.md:248`) or no modifier attaches, or the fact reaches only a bag slot nobody wrote for (the five cheapest blocks, `read-facts.md:388-392`) | a modifier pool, or a sentence for a fill the bag already offers |
| **MISSING** | the fact or pair fires above threshold on the sample and NO pool reads it, or the only pool is WIRING-UNRESOLVED | a new modifier (or, if the pair is an engine-named explanation, a turn) — the authoring list, sorted by occurrence descending |

The authoring list is `MISSING` by occurrence, then `THIN`; the census prints it; the chair rules the cut-line (§6.1); the owner vetoes the numbers (§13).

### 3.4 Regeneration and the gate — how an instrument becomes product truth without entering the product

The instruments are unlanded and must stay out of any product import path (`read-instruments-seed.md:15-25`; car 8's own fence). So the census is COMMITTED AS DATA: `docs/content/WIRING_CENSUS.json`, written by one command the census car names, stamped with the sha256 of the six composers and the mount registry. The projector reads that JSON (the way it already reads `scripts/lib/dossier-slot-shapes.mjs` and `economyFreshness.js`, `read-data.md:19-21`) to (a) REFUSE a `READS` token the census does not list for that (block, pool) — the annex may not claim a field the desk does not read, which is the wiring yardstick as a build error; (b) bake `poolMeta.occurrence` from the census's execution counts; (c) refuse to run when the stamped sha is stale against the composers — the census must be regenerated before the corpus is. `--check` covers all three, so the gate fails on any of them exactly as it fails on a stale leaf today (`generate-dossier-state-prose.mjs:706-713`).

Costs measured: generating and composing a town is 22 ms, of which composition is 2 ms (`read-instruments-seed.md:262-273`); a 200-town census over all six desks is seconds, so it runs per car, not per soak. The census is taken at the COMPOSER layer with the desk's readings rebuilt as the desk-read callers build them, never through the desk's stripped return and never with `{}` readings (`read-instruments-seed.md:277-279`; the probe artefact at `dossierComposedFill.js:13-15`).

### 3.5 The composed-prose manifest — the census's twin and the migration car's proof

The generator golden master (525 rows, `tests/property/generatorGoldenMaster.test.js`) hashes the serialised settlement and provably cannot see a dossier sentence (`read-instruments-seed.md:198-219`). So the brief's acceptance criterion needs its own instrument: `tests/property/dossierComposedProse.golden.test.js` (new) capturing `(seed, mount, block, spineKey, [modifierKeys], variantIdx, faceIdx, text)` per town over a purpose-built seed set (N = 200 by default; O-9 lets the owner set it) through the desk-read callers, sha per seed, a manifest under `tests/fixtures/`, a re-record door in the golden master's five-step idiom (`read-instruments-seed.md:224-229`), and a header shift record that is written even when nothing moved (the T13 precedent, `:231`). The same run yields the reading sequence arms B1–B3 need (`:283`) and the occurrence census's denominator. One run, three instruments.

### 3.6 WIRING-UNRESOLVED handling — fail closed, print loud, shrink only

A pool whose row is `WIRING-UNRESOLVED` (a) keeps working exactly as today as a SPINE — the composer never refuses a spine the desk selected, because that would be a draw-time refusal; (b) is NOT a modifier or turn candidate — `attach` on an unresolved pool is a projector error; (c) makes arm D and C-pair/C-sibling NOT-EXECUTABLE for that pair (the §908 law; `read-specs.md:22`), printed, never a pass; (d) counts against a shrink-only ratchet the contract test pins at the census car's measured total. The static approximation already bounds the work: 358 of 708 keys appear verbatim in a desk file and ≈350 need resolution no grep can join, ten blocks with zero verbatim hits (`read-data.md:243-249`).

---

## 4. THE COMPOSITION ALGORITHM

### 4.1 Where it lives — one new pure leaf between the kernel and the desks

`src/domain/display/stateProse/stateProseComposer.js` (new, pure, imports the kernel only). The read-kernel lens left this open (`read-kernel.md:523-527`): the one-caller rule and the desk-derives-nothing law push composition below the desks; salience needs the readings, which pushes it into them. The data model resolves it: **the desk supplies KEYS, the corpus supplies RELATIONS, the composer supplies everything else.** A desk keeps its one law — "maps LIVE STATE to a POOL KEY, and nothing else" (`economyStateProse.js:48-55`) — and simply calls its modifier pools' key functions the way it calls its spine's, handing the composer the keys that fired. The relation, the attach set, the occurrence band and the role are `poolMeta`, read off the corpus. Nothing new is derived in a desk; nothing about readings is known to the composer.

```js
composeStateProse(corpus, blockId, spineKey, {
  slots, seed, audience, dimensions,                        // exactly readStateProse's options
  modifiers: [{ poolKey, recent?: boolean }],               // every modifier/turn key of this block whose predicate fired; the desk's only new duty
  connectives,                                              // the seventh leaf
}) → { blockId, poolKey: spineKey, angle, text,             // readStateProse's shape, so legibilityRung is untouched
       pieces: [{ role, poolKey, angle, relation?, form?, variantIdx, faceIdx }] }   // provenance per piece
```

`legibilityRung` (`legibilityRung.js:39-50`) keeps `sentence: string|null` — one string, the composed unit — so no consumer changes; `provenance` gains `pieces`, and `drawnAtMount` (`dossierMounts.js:581-587`) strips it with `sentence` and `provenance` on a glance row, which closes the leak the read-kernel lens flagged (`read-kernel.md:498-502`). `DeskLines` and the `key={line}` collision (`EconomicsGlance.jsx:168`) are unchanged by this car; the collision becomes less reachable, not more, because two lenses at one mount now differ by their modifier sets as well as their variants.

### 4.2 The steps, in order, each with its law

```
readings ─(desk)─▶ spineKey, [modifierKeys], slots, dimensions, seed, audience
   1  SPINE POOL     pool = block.pools[spineKey]; meta = block.poolMeta?.[spineKey] ?? {role:'spine'}
                     a TURN whose `explains` is present outranks the spine: if any fired key has role 'turn' and
                     attach includes spineKey, it becomes the spine (the conjunction-ladder rule, §5.4)
   2  ELIGIBILITY    eligibleVariants(pool, {slots, audience, dimensions})      — kernel :247, UNCHANGED, per piece
   3  SPINE DRAW     v = drawVariant(eligible, blockId, spineKey, seed)          — kernel :301, UNCHANGED
                     face = drawFace(facesOf(v), blockId, spineKey, seed)        — §2.5
   4  CANDIDATES     for each fired modifier key m of THIS block (or an ATTACHed reservoir key):
                       meta(m).role === 'modifier' ∧ spineKey ∈ meta(m).attach ∧ meta(m).status RESOLVED
                       ∧ ¬ (meta(m).reads ⊆ meta(spine).reads)                  — the structural restatement bar (§4.7)
                       ∧ eligibleVariants(block.pools[m], {slots-at-site, audience, dimensions}).length > 0
                     the candidate SET is a pure function of state and the freeze; its length is never a draw modulus
   5  SALIENCE       score(m) = 3·rarity(meta(m).occurrence.band) + 2·relationWeight(meta(m).relation) + 1·[recent]
                     rank descending; ties by avalanche32(fnv1a32(`${seed}::${blockId}::salience::${m}`)) ascending  — a NEW key (§4.4)
   6  CAPACITY       k = min(2, capacity(v))  where capacity = 2 − sentences(v) for the sentence slot, plus one clause slot (§4.5)
                     take the top k; the FIRST-ranked takes the clause form, the second the sentence form
   7  MODIFIER DRAW  per taken m: drawVariant(eligible_m, blockId, m, seed); drawFace(…, blockId, m, seed)      — their own keys
   8  CONNECTIVE     phrase = connectives[meta(m).relation][form][ avalanche32(fnv1a32(`${seed}::${blockId}::${m}::c`)) % n ]
                     contrast is admitted only when meta(m).licence === 'sibling-band' is satisfied at the freeze (§4.6)
   9  FILL           fillSlots(text, slots) per piece — kernel :280, UNCHANGED; any null piece DROPS THAT PIECE, never the unit
  10  ARRANGE        the join grammar (§4.5): case owned by the composer, never by fillSlots (kernel does no casing, read-data.md:444-447)
  11  COHERENCE      the gate's job, not the render's (§4.7): nothing here filters; the instrument walks the unit
```

Determinism: every input to steps 4–8 is state, the freeze (`poolMeta`, the connectives leaf) or a seed-keyed hash; no clock, no counter, no cache (`stateProseKernel.js:55-57`; `read-specs.md:250` S11). Integer arithmetic only — `src/domain/**` bans engine transcendentals (`read-instruments-seed.md:356`).

### 4.3 The bound, structurally

≤ 2 modifiers, ≤ 2 sentences, ≤ 3 licensed facts per composed unit. The first is `k ≤ 2` at step 6; the second is capacity (§4.5); the third follows because a spine of one fact plus two one-fact modifiers is three, and a multi-fact spine (a conjunction key) LOWERS its own modifier budget by its extra facts — `k ≤ 3 − |meta(spine).reads|`, so `invasionRowPoolKey`'s three-fact spines take no modifier at all, which is the right reading of a cell that was hand-authored as a combination. A turn is a sentence pool and takes ≤ 1 modifier, in clause form (its explanation already spent two facts).

### 4.4 Salience — the signals, their weights, the tie-break

| signal | source | values | weight |
|---|---|---|---|
| DEPARTURE from the norm | `poolMeta.occurrence.band`, baked from the census's N-town execution count (§3.4) — the norm IS the sample | universal 0 · common 1 · uncommon 2 · rare 3 | ×3 |
| TENSION with the spine | `poolMeta.relation` | tension 2 · contrast 2 · consequence 1 · addition 0 | ×2 |
| RECENT change | the desk's `recent` flag, true only where a TYPED timeband exists for the fact (the `{timeband_*}` producers; else always false) | 0 · 1 | ×1 |

Bands (ESTIMATE, to be set against the census's histogram; the N = 25 probe already shows the shape — 5 of 50 cells on one town, 4 on every town, `read-instruments-seed.md:262-266`): universal ≥ 75 % of towns; common 25–75 %; uncommon 5–25 %; rare < 5 %. Weights 3 / 2 / 1 are the chair's opening numbers and the owner's to veto (§13 O-4). Max score 14; ties are common when two modifiers share a band and a relation, and the seeded tie-break is what makes two towns with the same facts foreground differently — and ONLY ties do, which is stated as a limit rather than hidden: identical facts with unequal bands foreground identically on every seed. A weight change or a band change re-orders every affected world and is a declared text shift (S11), so the weights are frozen per wave with the connectives.

### 4.5 The join grammar and the capacity rule — the answer to strain S2

The three-sentence wall (R-DA-03; wall 6, `moveGrammar.js:122`; `armF` F6; `check-pair.mjs:78`) is not amended. The composed unit is held to **two sentences** by the shape of the modifier and by capacity:

- A MODIFIER FRAGMENT is an independent clause: subject and verb, no capital unless a proper fill opens it, no terminal stop, ≤ 10 words (ESTIMATE; a band the wave measures), naming its slot or its band word (arm Q by construction, `read-specs.md:256` S14). One authored form serves both joins.
- **CLAUSE join (J1):** the spine's final sentence loses its stop; `, ` + connective(clause form) + ` ` + fragment + `.`. Connectives are the corpus's own measured inventory — `and`, `yet`, `but`, `while`, `though`, `so`, `because` (`read-kernel.md:423-433`: `and` 1,789 variants, `because` 81, `so` 56, `yet` 54, `but` 36, `while` 19, `though` 9) — never `which` (wall 6), never a dash (B-DASH), a semicolon only where the register's ration allows (R-DA-06, `read-specs.md:252`).
- **SENTENCE join (J2):** spine + ` ` + connective(sentence form, capitalised by the grammar) + `, ` + fragment + `.` — or, for `addition`, the fragment alone with its first character upper-cased by the composer (the one casing act in the system; `fillSlots` never cases, `stateProseKernel.js:280-289`).
- **Capacity:** a one-sentence spine (1,624 of 2,266 variants, 71.7 %, `read-kernel.md:378-380`) takes one clause modifier and one sentence modifier — two sentences, three facts. A two-sentence spine (634) takes one clause modifier on its final sentence and no sentence modifier. A three-sentence spine (8) takes none. **The modifier count therefore varies 0/1/2 with the data and with the drawn face** — S18's law, satisfied by the corpus's own mixture rather than by a rule that always attaches two.

ILLUSTRATIVE, not authored: spine (DS-DEF-11 `WALLED-STRAINED` `[ledger]`, first eleven words) "{settlement}'s {defwork} stands better than the watch that should man it…" + J1 `, and` + fragment "nothing is stored behind it" ⇒ one sentence, two facts, no third sentence, no which-tail.

### 4.6 Connective choice — relation typing, and why contrast is different

The connective is chosen by the RELATION and the relation is a property of the modifier pool fixed at the freeze — never chosen by music (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1991-1999`, the causal annex's own law). Four relations, each with its licence:

| relation | licence at the freeze | who checks |
|---|---|---|
| `consequence` | an engine causal edge from the modifier's `reads` to the spine's `reads` or the reverse, in the relation source of §5.3 | arm A2 (new; `read-instruments-seed.md:368`) — FAIL with no edge, WITHHELD when the edge exists but its direction is unread |
| `tension` | the two facts sit on a `Contradiction` type's field pair, or on opposite signs of one system variable's contributor edges (§5.3) | arm A2 |
| `contrast` | wall 5: a sibling pool key or sibling band names the rejected alternative — the SPINE's sibling, at the composition site | arm A3 (new; wall 5 implemented as an arm, replacing today's R4-BAND WITHHELD) |
| `addition` | none — but it spends a licensed (move, field, value) triple like any modifier, so arm J's fact budget still binds | arm J (spec owed, chair M-5) |

The connective's own claim: a connective may not add a claim, a modality, a threat class or a pool's spread (B-CLAIM, W2). `consequence` connectives (`so`, `because`) assert a cause, which is why they need an edge; `and` asserts nothing and is the totality floor.

### 4.7 The coherence pass — at the gate, never at the draw

CLERK-LAWS §2.5 / R-DA-20 forbid a runtime refusal because it would change `eligible.length` and move every later index (`read-specs.md:197`, `:242` S7). So coherence is split into what the FREEZE makes impossible and what the GATE catches:

- **No restatement of the spine — structural half:** a modifier whose `reads` is a subset of the spine's `reads` is never a candidate (step 4). This is what keeps `MOD: the muster is thinning` off `WALLED-STRAINED` (§6.2). **Lexical half:** arm A1 (new) — the modifier's typed facts (`typedFactsOf`, `entryWalker.js:627`) overlap the spine's on a governed noun with the same band class ⇒ FAIL.
- **No negation of the spine:** a `consequence` or `addition` modifier whose predicate is the logical complement of the spine's predicate on a shared field is refused by the projector (the census holds both predicates); `contrast` is the only relation that may set two values of one field side by side, and only with the sibling-band licence.
- **No absence beside absence, no absence opening** (wall 3, estate-wide; `armF` F3): a `move: ABSENCE` modifier may not attach to a spine tagged `grammar: V3|V8`, and two ABSENCE modifiers may not both be taken — both are attach-table facts fixed at the freeze, checked by the projector, never by a draw-time filter.
- **Sibling agreement across pieces:** C1/C2/C5 walk the COMPOSED unit (S17): a spine and a modifier that band one count noun differently FAIL; an office noun in the spine plus a duty verb in the modifier is a C2 pair neither piece carried. The gate is therefore SAMPLED over the manifest's N towns and says so (§8.4).
- **The echo bound across blocks (§4.8).**

### 4.8 Cross-block echo — bounded at the freeze by the attach table

A fact may be a MODIFIER at no more than three spine pools (`attach.length ≤ 3`, a projector error above it), and at no mount on a tab where the same fact is a SPINE (the census's `fact → pools` index knows both; the mount registry is static, `dossierMounts.js:257`, so the walker enumerates (tab, fact) → modifier mentions and refuses > 1 per tab and any on the fact's own spine tab). No render-time coordination across desks is needed and none is built — the one-caller rule (ARM 2) and the per-desk silent shapes (`read-kernel.md:335-343`) stay exactly as they are.

### 4.9 Multi-rung mounts — the position budget

`overview.systemsHealth` draws up to 11 rungs, `faith.patronSeat` 8, five mounts 5 (`read-kernel.md:387-409`). Eleven two-sentence units at one position would be a wall. Rule: at a mount drawing more than two rungs, at most TWO rungs carry modifiers — the two highest-salience (spine, modifier) pairs across the position, ties by the salience key. This is an arrangement rule over draws already made (no eligible list changes), so it is lawful; a later change to the budget is a declared text shift.

---

## 5. THE EXPLANATION SEAM

### 5.1 What the engine holds today (from `read-explanations.md`, executed there)

Twelve explainers behind `explainEntity` (`src/domain/explanation.js:1131`) with one caller in `src/` (`counterfactual.js:203, :244`); a persisted generation trace log; a 16-variable causal substrate with signed contributors, computed at render; a 46-archetype condition catalog with 131 archetype→variable edges; a closed 14-class cause vocabulary with presence predicates (`worldPulse/causeVocabulary.js:45-64`, `:165-228`); six contradiction detectors, three classed `interesting_tension` (`contradictions.js:134-313`); and the shipped conjunction ladder (`causeConjunctionContent.js:186-195`) — a four-rung specificity ladder over `{role × situation × causeClass × stage}` with a seeded draw, live on the NPC card. **No dossier composer imports any of it** except one read of `condition.causes` at `stressorsStateProse.js:242-250`; the causal register (78 families, 468 variants) has no importer at all (`read-explanations.md:395-412`).

### 5.2 The turn's key — a closed vocabulary, three namespaces

A turn's `explains` is one id from:

| namespace | ids | how presence is read at dossier render | class |
|---|---|---|---|
| `cause:<class>` | the 14 `CAUSE_CLASSES` | `CAUSE_SIGNAL` (`causeVocabulary.js:165-228`) | **A** where the predicate reads persisted fields only: `chain-starved`/`depleted`/`trade-strangled`/`siege-scarred` (condition branches), `levied-away` (`deployed`), `occupation`, `conduct-drift`, `conversion-pressure`, `clergy-scandal`, `captured` (`criminalCaptureState`), `scandal` (`revealedInstitutions`); plus `underfunded` via the persisted `defenseProfile.economicGates.military < 1` (`read-explanations.md:244`). **B** where it needs a `causalState` score band (`underfunded` by `economic_capacity`, `garrison-drained`, `secularization`, `depleted` by band) — behind the 546,887 B / 28-file import wall (`defenseStateProse.js:1460-1468`) until a slim digest is persisted (§13 O-6) |
| `contradiction:<type>` | the 6 `Contradiction.type`s | `detectContradictions` — render-time but cheap (`contradictions.js:338`) | A, pending an import-cost measurement in the car |
| `condition:<archetype>` | the 46 archetypes | persisted `activeConditions[]` (`activeConditions.js:680-684`) | A — already routed by DS-CND-1 |

A turn keyed on anything else — a raw fact conjunction, a slot value, a threshold the desk invents — is a projector error. This is S16's arm (`read-specs.md:260`): the named combination is lawful only where the engine holds it as a typed explanation; without the arm a turn is a MEANING move with a good vocabulary.

### 5.3 The relation source — what a `consequence` or `tension` may legally cite

In descending typedness (`read-explanations.md:150-230`): (1) condition archetype → system variable, read ONLY through `canonicalAffectedSystems` (`stressorsCore.js:410`) — the raw catalog carries aliases that are not variables; (2) contributor edges, fact → variable with a signed delta, from the 16 derivers (render-time; usable at the FREEZE as a static table the census extracts, never at render); (3) the cause-class table — which state read licenses which named mechanism; (4) contradiction types — the tension relations by name; (5) envelope `downstreamEffects` — weakest, prose-shaped, not used. The census bakes the (field, field, edge-kind) triples it can recover from (1), (3) and (4) into `WIRING_CENSUS.json` so arm A2 has a table to consult without importing the substrate.

### 5.4 What a turn may claim, and how absence degrades

A turn asserts the named MECHANISM as a STANDING fact (V2's structural consequence — what the arrangement costs the town), never the event (R-DA-19 forbids the event move on a state spine; `read-specs.md:258` S15). Where the explanation carries provenance (R2's families, the annex's event rows) the historical clause is lawful there and nowhere else. The ladder degrades exactly as the shipped one does (`full → role → class → floor`, `read-explanations.md:419-427`): **turn → spine + 2 → spine + 1 → spine** — absent explanation ⇒ composition; absent explanation LAYER (class B behind the wall) ⇒ the turn is NOT-EXECUTABLE and prints as such; absent modifiers ⇒ the spine alone, which is today's page. The floor always speaks.

The `{reason}` seam is the cheapest real win and is a ruling, not a lane act: `CAUSE_LABEL_OF` already holds fourteen `bare-common`-shaped noun phrases (`causeVocabulary.js:73-75`) that light three routed-silent pools with no desk change (`read-explanations.md:464-483`); it is reader-facing prose, so it is §13 O-7.

---

## 6. THE BOUNDS — numbers, their measurements, and the arithmetic on three real blocks

### 6.1 The numbers

| bound | number | measurement that sets it | who vetoes |
|---|---|---|---|
| OCCURRENCE (a cell earns a hand-written TURN) | the (spine × explanation) cell fires on ≥ 3 % of the N-town sample (≥ 6 of 200) — **ESTIMATE** | the census's execution counts (§3.4); the N = 25 probe's histogram is the shape (`read-instruments-seed.md:264-265`) | owner (O-4) |
| DEPTH | ≤ 2 modifiers; ≤ 2 sentences; ≤ 3 facts; triples only as turns; never four | §4.3, §4.5; wall 6 / R-DA-03 unamended | chair (a wall) |
| RELATION | consequence/tension only along an edge in §5.3; contrast only with a sibling-band licence; addition free but budgeted | arm A2, A3, J | chair |
| LICENSING | every piece: arm D at its composition site; every composed unit: C1–C6 sampled over N | `entryWalker.js:730`; §8.4 | chair; R-DA-20's SIZE amended (S17) |
| ATTACH / ECHO | ≤ 3 attachments per modifier; ≤ 1 modifier mention per fact per tab; none on its spine tab | projector + mount walker | chair |
| EXEMPLAR | budget 1/3 · depth 0.5 (register/tab/pool); 2/3 · 1.75 (entry, provisional); perfection flagged; re-anchored on the COMPOSED UNIT as a new grain | `read-specs.md:139-144`; S1 | owner (the entry numbers are owed a re-measure, `:142`) |
| FACES | 4 per semantic piece; fixed at the freeze; sibling distance ≥ a floor measured on the estate's own ruler (metric-vector L1 over `RATE_METRICS`, never band-widths — `read-instruments-seed.md:359`) | arm A5 | owner (the 4; the floor) |

### 6.2 Worked block 1 — DS-DEF-11, the owner's walls (`defense.wallRationale`, `dossierMounts.js:361`)

**Today** (executed, `_a-blocks.mjs`): 5 pools · 12 variants (3+3+2+2+2), all one-sentence; bag `{settlement, defwork}` (`defenseStateProse.js:776-779`); key `wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)` at `:747` — the corpus's only four-fact key (`read-facts.md:434-437`). It SHORT-CIRCUITS: `militaryGate < 1` returns `WALLED-STRAINED` before the monster family is consulted (`:748-754`), so a strained frontier town and a strained settled town read the same two sentences, and the trade is recorded as vetoable at `:732-737`. A town reads 1 of 12 sentences; a repeat needs only the same one-of-five cell and a hash collision at 1/2 or 1/3.

**Phase 1 — additive, no re-key, no existing text moved.** New pools in DS-DEF-11 (annex, projected):

| new pool (key) | role | READS (canonical) | PREDICATE | RELATION | ATTACH | note |
|---|---|---|---|---|---|---|
| `MOD: the country presses` | modifier | `config.monsterThreat` | `measuredMonsterFamily ≠ 'settled'` | tension | `WALLED-STRAINED`, `UNWALLED-SMALL`, `UNWALLED-LARGE` | restores the fact the short-circuit silences; on THREATENED it would restate (`reads ⊆`), and QUIET cannot co-occur |
| `MOD: nothing stored behind the wall` | modifier | `economicState.compound.inst.hasGranary` | `=== false` | tension | the three `WALLED-*` | the desk already reads this flag (`:359`, `:1213`); the stock BAND needs a reading the desk has no parameter for (`read-facts.md:84`) — a later car |
| `MOD: the watch is bought, revealed` | modifier | `compromisedSecurityInstitutions(s).revealed` | `.length > 0` | tension | the three `WALLED-*` | the canonical reader at `corruption.js:663-692`; its import cost into the defense chunk is UNMEASURED and the car measures it first |
| `MOD: the watch is bought, covert` | modifier, `dm-only` | `compromisedSecurityInstitutions(s).covert` | `.length > 0` | tension | the three `WALLED-*` | W8 by construction — no engine explanation names the covert case, so it is a modifier, never a turn |
| `TURN: the gate is sold` | turn | `explains: cause:scandal` (`revealedInstitutions > 0`, `causeVocabulary.js:227`) | — | — | the three `WALLED-*` | the owner's named combination; outranks the spine when present; takes ≤ 1 clause modifier |

The owner's fourth fact — the guard's alignment, evil/neutral/good — has NO field (`read-explanations.md:246`): no modifier is authored for it; §13 O-8 asks whether a field is minted or the proxy (`criminalCaptureState` + the compromised read) is the meaning.

**Arithmetic.** Authored: 12 → 27 semantic pieces (4 modifier pools × 3 + 1 turn × 3 = 15 new); with faces, 108 wordings. State cells the block distinguishes: 5 today → player 19 (STRAINED 1+3+3, THREATENED 4, QUIET 4, the two UNWALLED 2 each) and DM 29, plus 3 turn cells. Distinct surfaces for ONE fully-loaded cell (a strained wall with a thin store and a bought watch): spine 2 variants × 4 faces = 8; clause modifier 3 × 4 = 12; sentence modifier 12; connectives 3 × 3 = 9 (ESTIMATE, ≥ 3 phrases per relation per form) ⇒ **8 × 12 × 12 × 9 = 10,368 readings, against 2 today.** The block's total surface count is the sum over 19–29 cells and lands in the tens of thousands from 27 pieces. The same 19 player cells authored as combination pools, the way DS-DEF-2 was, would cost 19 × 3 = 57 sentences (228 wordings) with no shared wording and would double again at the next secondary fact — the exponential the owner named, avoided.

**Phase 2 — optional, owner-signed (O-10).** Re-key the block to three spines (`WALLED`, `UNWALLED-SMALL`, `UNWALLED-LARGE`) with `MOD: the muster is thinning` (`economicGates.military < 1`, consequence) and `MOD: the country presses` as modifiers, re-voicing `WALLED-STRAINED` and `WALLED-THREATENED` into fragments. It is cleaner, it re-rolls the block (a rename is hash input, `read-data.md:277`), and the model does not need it to deliver the owner's sentence — Phase 1 already says both halves of the true pair the docblock at `:737` chose between.

### 6.3 Worked block 2 — DS-ECO-1, the hand-cut combination spines (`economics.prosperityHeader`, `dossierMounts.js:259`)

**Today** (executed): 5 `COMBINATION C1…C5` pools over `prosperity × tradeAccess` · 15 variants · 8 of them two-sentence (`_a-conj.mjs`, strict splitter); bag `{access, complexity, good, season, settlement}` (`read-facts.md:286`); keys hand-copied as literals at `economyStateProse.js:375` — the label trap (`read-data.md:239`). These pools ARE what a spine+modifier would have composed; the model keeps them as two-fact spines (`reads: [economicState.prosperity, economicState.tradeAccess]`) and stops the family at five.

**Modifiers from the desk's ten KEY-ONLY facts** (`read-facts.md:109`), each with an attach ≤ 3:

| new pool | READS | PREDICATE | RELATION | ATTACH |
|---|---|---|---|---|
| `MOD: not viable on its own` | `settlement.economicViability.viable` | `=== false` | tension | C1, C2, C3 |
| `MOD: the food books are short` | `readings.foodBalance` | `deficit > 0` (the flag; no figure printed) | tension | C1, C2, C3 |
| `MOD: an entrepot` | `settlement.economicState.isEntrepot` | `=== true` | addition | C1, C4 |
| `MOD: the flow is drifting` | `readings.flowDrift.band` | the adverse band (vocabulary read off the reading's typedef in the car) | consequence | C4, C5 — needs an edge: `trade_connectivity` ← the trade conditions (§5.3, 20 edges) |

**Arithmetic.** 15 → 27 pieces; cells 5 → 18 (C1 1+3+3, C2 4, C3 4, C4 2, C5 1). **Capacity shows the S18 variation from the data:** C1's `[ledger]` face is two sentences (capacity one clause modifier), its `[visitor]` face one (capacity two), so the same cell reads one, two or three facts by the seed's spine draw, and the composed unit never reaches a third sentence. A drifting flow on C2 is refused as `consequence` unless the census finds the edge — the design would rather print the spine alone than a `because` the engine does not hold.

### 6.4 Worked block 3 — DS-GEN-3, the flat block at the eleven-rung mount (`overview.systemsHealth`, `dossierMounts.js:337`)

**Today** (executed): 42 pools · 128 variants, `{settlement}` only in both censuses (`read-facts.md:379-385`); six independent facts (5 axes × 4 bands + prosperity 5 + safety 3 + viability 2 + readiness 6 + food 6, `read-facts.md:515-517`), up to 11 rungs drawn as 11 `<p>` with no relation (`generalStateProse.js:1718-1725`; `read-kernel.md:392`). A town's dashboard is 3¹¹ = 177,147 possible surfaces already, but each is eleven assertions in a row (`read-kernel.md:411-415`).

**The floor, honestly:** every one of the 42 pools is a spine at migration with zero change. The block itself holds no second fact per rung (S10, `read-specs.md:248`), so its modifiers come from the DESK — the general desk's 28 KEY-ONLY facts (`read-facts.md:107`) — and the census's `fact → asModifier` index is what says which. Two, under the echo rule:

| new pool | READS | PREDICATE | RELATION | ATTACH | echo check |
|---|---|---|---|---|---|
| `MOD: the approach is narrow` | `readings.tradeRouteAccess` | `∈ {isolated, mountain_pass}` (the pair C2 already names) | consequence | `scores.economic: WEAK`, `scores.economic: CRITICAL`, `scores.military: CRITICAL` | `tradeRouteAccess` is a spine at `overview.origin` (DS-GEN-6, same tab) ⇒ **REFUSED on the overview tab by §4.8**; lawful only if `origin`'s spine moves or the rule is amended — kept here as the worked refusal |
| `MOD: the roll is falling` | `readings.populationTrend.band` | the falling band | consequence | `scores.military: WEAK`, `scores.military: CRITICAL`, `scores.internal: WEAK` | `populationTrend` is spined on no overview mount ⇒ admitted; edge: `labor_capacity` ← the population conditions (§5.3) |

**Arithmetic and the position budget.** 128 → 131 pieces for one admitted modifier (3 variants); per axis cell 3 variants × 4 faces = 12 → with the modifier 12 × 12 × 3 = 432 surfaces against 3 today; the mount carries at most two modifier-bearing rungs (§4.9), so the dashboard's length grows by at most two clauses or sentences per town and its reading-sequence statistics (arms B1–B3) move by a measured, bounded amount rather than eleven-fold.

### 6.5 The corpus arithmetic — linear in pieces, multiplicative in readings

| quantity | today | after the rewrite + the wave (ESTIMATE) | note |
|---|---|---|---|
| semantic pieces (pools' variants) | 2,266 | 2,266 + ≈ 760 (modifiers ≈ 4 per wired block × 53 × 3 = 636; turns ≈ 40 × 3 = 120) ≈ 3,026 | the brief's ≈ 1,800 (`ARCH-BRIEF.md:19`) is the ceiling if every block takes 8; the attach bound makes 4 the working number |
| wordings (× 4 faces) | 2,266 | ≈ 12,100 | linear in pieces |
| distinct surfaces at a fully-loaded cell | 2–6 | ≈ 10⁴ | §6.2 |
| authoring cost per new secondary fact | a new pool per affected cell (DS-DEF-2's shape) | ONE modifier pool with ≤ 3 attachments | the bound the owner asked for |

---

## 7. STALENESS AND REPETITION

**Within-town stability** is THE PROMISE by construction: every draw is `seed × identity` (`stateProseKernel.js:304`, §2.5 for `::w`, §4.4 for `::salience::`, §4.2 step 8 for `::c`), salience reads only frozen metadata and state, and the arrangement is a pure function of the draws. A town reads the same composed unit on every visit until an owner-signed shift lands.

**Across-town variety** is guaranteed by AUTHORING (a wording set spans the length classes; the fingerprint's 21 metrics are the ruler, `proseFingerprint.js:35-57`) and MEASURED by three instruments, none of which gates the draw: the spread (arm E per pool; arms B1–B3 over the simulated reading sequence the manifest run produces, §3.5); the presence measure (`presenceMeasure.js:103`, reported never gated — and a `{settlement}` fill buys zero texture by it, `read-facts.md:616-618`); and a new REPORTED figure from the manifest: the **duplicate-unit rate** — the share of composed units at one mount whose full text recurs at that mount on another town in the sample.

**"Repeated only because the instance repeated", operationally:** two towns print the same unit at a mount iff they share the spine key, the same modifier set after capacity, the same variant and face indices, the same connective indices and the same fills. Today, two towns in one cell of a 3-variant pool collide with probability 1/3; under the model a fully-loaded cell collides at roughly 1/10,368 (§6.2) and the cell itself is one of 19–29 rather than 5, so a repeat means the same very specific situation AND the same hashes. The manifest prints today's baseline rate at M0 and every car's after, so the owner's claim is a measured number rather than a promise.

**The four index-paired list positions** (conflicts, steadings, neighbours, engagements) draw the same variant for every row of equal state (`read-kernel.md:113`); two different quarrels reading alike is the repetition the owner names, with the instances different. The cure is the ladder's own idiom — a per-instance seed suffix (`PowerTab.jsx:480`) — which is a new key and a declared text shift on those positions (§13 O-11).

---

## 8. THE AUTHORING PIPELINE

### 8.1 Writers and the list

Opus writes, Fable chairs (owner 09-05); one workflow per register, the register card as the writer's contract, the prompts carrying the ~22:30 rule verbatim. The list is the census's `MISSING`-then-`THIN` tiers by occurrence (§3.3), cut at the occurrence threshold; the walls block goes first because it is the owner's example and the corpus's deepest key.

### 8.2 Per-piece licensing at authoring time

A piece is written INTO its annex lines: `ROLE`, `READS`, `PREDICATE`, `RELATION`, `ATTACH` or `EXPLAINS`, its `grammar:` or `move:` tag, and its four faces under tilde lines. The writer may not write a claim outside `READS` — the wiring yardstick — and the projector refuses a `READS` token the census does not license for that pool (§3.4). The truth critic attacks licensing per piece; the four faces are four AFTERs of one BEFORE, so `check-pair.mjs` run four times is the claim-equality instrument with its LONGER arm suppressed for faces (`read-instruments-seed.md:114`, arm A6).

### 8.3 The checkers at the gate — which walker gates which property

| property | instrument | status |
|---|---|---|
| shape: roles, reads, relations, attach ≤ 3, faces' slot equality, no fragment projected as a spine, no `which`/dash in connectives | the projection contract test (`tests/data/dossierStateProseProjection.contract.test.js`), new arms | build (car M2) |
| per-piece licence at its composition site | `armD` (`entryWalker.js:730`) with the census as input (car 8's item 3) | extend (S5) |
| claims: count, duty, provenance, modality, siblings, relations | `armC1…C6` on the COMPOSED unit | walk the unit; sampled (§8.4) |
| walls 1, 2, 3, 6 and the non-moves | `armF`, `armG` (`grammarWalker.js:357`, `:401`) on the unit | as today |
| restatement · connective typing · wall 5 · salience determinism · sibling distance · claim equality · the manifest | A1–A7 (`read-instruments-seed.md:365-373`) | **build** — three of the four arms the model depends on do not exist (`:108`) |
| the echo bound · the relation/edge table · the turn's explanation id | A8 (mount walker extension), A9 (projector), A10 (projector) | build |
| ceilings and runs | arm A on tagged pieces (every new piece is born tagged), arms B over the manifest's sequences | as ruled (`read-specs.md:93`) |

### 8.4 The sampled gate, said out loud

R-DA-20's SIZE becomes two figures (S17): zero unresolved over every PIECE in isolation (exhaustive, as today over 2,734 R1/R2 entries) plus zero unresolved over the enumerated compositions of the N-town manifest (sampled; N and the manifest sha printed). A sampled gate that calls itself exhaustive is the false-green class the estate has burned; the anti-vacuity guard gains a composed fixture that manufactures a C2 pair beside the seven shipped breaches (`read-specs.md:195`).

### 8.5 Refuters, the chair, the beta, the shift

Refuters sample compositions from the manifest and produce FINDINGS, never a pass (fault 32). The chair rules per car. There is no blind DM panel: the beta is the panel and should capture the tell (owner 09-07 ~20:10). Every car that moves text declares its shift in the manifest header in the golden master's five-step idiom, names the pools whose faces landed, and records the rows that did not move.

---

## 9. SURFACES BEYOND THE DOSSIER

| surface | composer today | shares the state kernel? | what the model means there | register scope |
|---|---|---|---|---|
| **dossier tabs** (13 tabs, 56 mounts) | six desks → `readStateProse` | yes | the full model (§2–§8) | walls 1–3, 5–7, 10 (`read-specs.md:44`) |
| **the ladder** (`power.blocs` per faction) | `powerLadderRung` (`powerStateProse.js:628`), per-instance seed `${seed}::${f.faction}` (`PowerTab.jsx:480`) | yes | each faction row is a spine; modifiers come from the faction's own canonical profile facts (`deriveFactionProfile`, a canonical reader); the echo bound counts per instance | ceiling ≤ 0.07 lift-filtered |
| **DM page** | `projectBesideDmField` (`dmFieldProjection.js:135`); 8 blocks framed | yes | the composed unit IS the machine line BESIDE the DM's pen; a modifier never enters the DM's field; the five shape-varying members ≤ 0.30, no run beyond two | DM page rules |
| **chronicle** | `discourseKernel.js` — `RELATION_FOR_TYPE` (causal · adversative), a colon-bridge lexicon with a totality floor (`:151-190`), marked DRAFT pending the Fable authoring pass | **no** (its own composer; generation-side prose draws with `proseHash.pickVariant`) | events are already spines with relation-typed connectives; STATE modifiers would need the settlement state at chronicle render and are not in this program; turns from typed predictions already exist as the anticipatory register (`:177-185`). The dossier's connective table is NOT reused there — §0b forbids the register cross (`read-data.md:490-493`) | walls 1, 2, 3, 7, 9 |
| **news / the crier** (R5) | `newsVoice.js`, `newsBody.js` — headline/subheader/telling molds | no | events as spines already; the `why` clause is the Herald's own mold ("following", "born of"), not the dossier's inline connective (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1984-1989`). No composition lands on the crier in this program; three of the seven live breaches are crier lines and stay the owner's at the walk (`read-specs.md:195`) | R5: n = 2, no share ceiling |
| **chrome / docent** | LABEL move only | no | **REFUSED** — the archivist is never on chrome (W9, CC-1) | — |
| **generation-time prose** (institution and history descriptions, origin prose) | `proseHash.pickVariant` at generation, PERSISTED, golden-frozen (`read-instruments-seed.md:122-128`, `:215`) | no | **REFUSED** — composing a persisted string is a FACT shift under every seed (THE PROMISE); the model is display-only | — |
| **the causal register** (R2, 78 families, 468 variants, dark) | `causalDossierProse.js` — a complete reader with zero callers | yes (`drawVariant(eligible, familyId, arm, seed)`, `:116`) | the natural home of PROVENANCE-BEARING turns (S15): a family is already one pool, arm-tagged, keyed on a join the caller has evidence for. Lighting it needs a join-deriver from `causes[]` / `sourceEventId` that does not exist (`read-explanations.md:602-604`) — car W2b | — |

---

## 10. PERFORMANCE, SIZE, DELIVERY

**Where the bytes go.** The dossier prose ships in the lazy chunk and nowhere else: `dist/assets/data-lazy-pqPyi0JA.js`, 939,520 B, not referenced from `dist/index.html` (`read-kernel.md:470-483`, a probe on a real variant string; the build artefact is consistent with the tip but was not rebuilt, fences). `vite.config.js:876-878` routes any `/src/data/` module an eager chunk does not statically reach to `data-lazy` (`read-data.md:395-397`), so the seventh leaf and the `poolMeta` keys land there by derivation, not by curation. The composer leaf is imported by the desks, which are imported by tab components — the tab chunks, never first paint; the car confirms this with `scripts/bundle-analyze.mjs`, which prints and asserts nothing (`read-instruments-seed.md:386`).

**Size, by component (state register; the causal leaf is unchanged unless O-12):**

| component | today (measured) | after (ESTIMATE) | basis |
|---|---|---|---|
| variant records | 505,033 B of 641,410 B; sentence text alone 280,577 B at 124 B/sentence (`read-data.md:390`) | + 3 × 280,577 ≈ 842 KB of face text, ≈ +10 % JSON overhead ⇒ ≈ 1.57 MB | NESTED faces add TEXT only — slots and marks are not repeated; the flat ×4 would be 2,156,509 B (`:390`) |
| `poolMeta` | 0 | 708 × ≈ 130 B ≈ 92 KB | one small object per pool |
| modifier + turn pieces | 0 | ≈ 760 pieces × 4 faces × ≈ 124 B ≈ 377 KB + their `poolMeta` | §6.5 |
| connectives leaf | 0 | < 5 KB | four relations × two forms × a handful of phrases |
| **state total, raw** | **641,410 B** | **≈ 2.0 MB** | inside the brief's ≈ 2.5 MB (`ARCH-BRIEF.md:26`); gzip in the lazy chunk |

**The ratchets that do not exist yet, and the car that adds them.** `scripts/.size-baseline.json` holds 19 entries and no prose leaf; `tests/lint/sizeBaseline.test.js` is a per-file max-LINES ratchet (`read-data.md:397-399`; `read-instruments-seed.md:386`); no first-paint byte gate exists at the product tip — the brief's 1,042,122 of 1,048,000 with a 5,878-byte margin is a receipt from the L-MAT tip this design is fenced out of. Car C1b adds: (a) the six state leaves and the connectives leaf to the size baseline with ceilings re-pinned per car by name; (b) a first-paint gate: `data-lazy` absent from `index.html`, and the RAW first-paint total against 1,048,000 with the margin printed — O-16 puts the number to the owner; (c) a chunk-membership assertion that the composer leaf is not in the first-paint chunk.

**Render cost.** Measured: generate 559 ms, compose 2 ms per town over the general desk (`read-instruments-seed.md:262-263`). The model adds, per composed block, at most two modifier draws, two face draws, two connective draws, one salience pass over ≤ 10 candidates, and one tie-break hash — a few hundred integer hash operations per block, ≈ 60 blocks per page-set. ESTIMATE: < 10 ms per dossier, well under a frame. The desks are un-memoized except one site (`read-kernel.md:558-561`); a `useMemo` per desk call is a one-line-per-caller car item and is not load-bearing for the model.

**Build-time gates over the sample.** The manifest run (N = 200, all six desks, generation shared) is seconds (`:269-273`); the composed-unit walker over ≈ 200 × 56 mounts ≈ 11,200 units has an unmeasured cost (ESTIMATE seconds to a minute) and runs per car, not per commit, if it proves slow — printed with its N and sha either way.

---

## 11. RISKS AND REFUSALS

**Risks, each with its guard.**
1. **The explosion comes back through the attach table.** A modifier with ten attachments across five blocks is the combination cell in a new coat. Guard: `attach.length ≤ 3` as a projector error; the echo bound per tab (§4.8); the fact budget `k ≤ 3 − |reads|` (§4.3).
2. **Two pieces contradict.** A spine banding a count noun one way and a modifier the other; a duty verb meeting an office noun across the join. Guard: the structural restatement bar (`reads ⊆`) at the freeze; the negation refusal in the projector; C1/C2/C5 walked on the COMPOSED unit, sampled over the manifest with N and sha printed (§8.4) — and the honest statement that a sampled gate is a sample.
3. **Authoring debt outruns the wave.** ≈ 760 pieces × 4 faces ≈ 3,000 new wordings plus 2,266 × 3 re-voiced faces ≈ 6,800; the 62 unreachable and 448 unwired variants sit beside the queue. Guard: the tiers ARE the queue (§3.3), sorted by occurrence; the floor speaks before the wave lands (§5.4); nothing is trimmed (the variant ratchet, `read-instruments-seed.md:187`).
4. **The golden master is blind to every sentence this program moves.** Guard: the manifest instrument (§3.5) lands FIRST (car C1), before any composer byte.
5. **The instruments' blind spots.** The classifier is 0.75–0.83 and never gates (`read-instruments-seed.md:97`); arms B need a reading sequence that exists only as synthetic fixtures (`:239-246`); the bag resolver mis-credits nine defense sites (`read-facts.md:239-268`); the seven raw exemplar texts are gone, so every ENTRY-grain number is provisional on one author (`read-specs.md:142`); the sensory lexicon is 166 nouns, not 177 (`read-facts.md:621-630`). Guard: car 8 fixes the resolver before the census is trusted; every new piece is born tagged so arm A gates it; the entry-grain numbers are labelled provisional wherever they bind.
6. **The flat roll would move the meaning, not the wording.** 54.79 % of reads change semantic variant under the brief's default (`read-instruments-seed.md:173-178`). Guard: the two-level roll (§2.3, §2.5); O-2.
7. **A default wearing a reading's clothes** (`dossierMounts.js:53-71`): `economicGates.military` is ABSENT, not 1.0, when there is no paid stack (`defenseGenerator.js:465-468` via `read-explanations.md:577`). Guard: a modifier predicate over a field that can be absent must name absence as its own value (`PREDICATE: \`=== false\`` is lawful; `< 1` over `undefined` is a projector error unless the predicate says `present ∧ < 1`).
8. **Case and capitalisation.** `fillSlots` cases nothing; a fragment promoted to sentence form needs a capital. Guard: the composer owns exactly one casing act (§4.5) and the projector refuses a fragment that opens with a capital letter that is not a proper slot.
9. **Import cost of the canonical readers** the walls modifiers need (`corruption.js`). Guard: measured in the car before the pool is wired; the 546,887 B wall is the precedent for a refusal (`read-explanations.md:139-146`).

**Refusals, each with its reason.**
- **No language model at render** — THE PROMISE; FINITE SEMANTICS; "AI = clerk, never writer".
- **No per-combination pool ever again** — the `reads ⊇ sibling.reads` finding; the model exists to stop that bill (§2.6).
- **No draw-time filter, weight or refusal** — CLERK-LAWS §2.5, R-DA-20, S7; every bound is a freeze-time or arrangement rule.
- **No flat wording roll as the default** — the measured 45.21 % (§2.3); the owner may still choose it (O-2).
- **No guard-alignment modifier** — no field exists (`read-explanations.md:246`); a proxy is a meaning the owner rules (O-8).
- **No `{band}` fill** — RESERVED, six roles in one name (`dossier-slot-shapes.mjs:32-39`); O-13 asks about the split.
- **No cross-block SENTENCE rung** — C3 (`dossierMounts.js:26-52`); a reservoir pool attaches as a modifier only (§2.7).
- **No composition on chrome, on the crier, or on generation-time prose** — W9; the register fence; the fact-shift law (§9).
- **No `which`, no em dash, no third sentence** in a composed unit — wall 6, B-DASH, R-DA-03 (§4.5).
- **No turn keyed on a fact conjunction** — S16; the turn arm (§5.2).
- **No `consequence` connective without an engine edge** — the causal annex's own law (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1991-1999`); arm A2.
- **No modifier on a WIRING-UNRESOLVED pool** — §3.6; the §908 law.
- **No walker in the product import graph** — THE PROMISE's fence on the lexicons (`entryLexicons.js:16-18` via `read-facts.md:602-605`); the census is committed data, never an import.

---

## 12. THE IMPLEMENTATION SEQUENCE

Each car: what it builds · files · proof (an executed arm) · register doors it moves · acceptance · decidability. Every car that moves text declares its shift in the manifest header (§8.5). No pushes; explicit staging; the four-lane cap; one implementation lane at a time (the 09-06 rows).

| # | car | builds | files | proof | doors | acceptance | who |
|---|---|---|---|---|---|---|---|
| C0 | **INSTR car 8 — the wiring census** (commissioned) | `wiringCensus.js`; the census both ways; tiers; the corrected bag resolver; arm D / C-pair take the census as input | `skepINSTR/src/domain/prose/wiringCensus.js`, `tests/lint/proseWiringCensus.walker.test.js`, `tests/helpers/dossierComposedFill.js` (extend) | TOTALITY = the loaders' pool count as an integer; four planted controls fire; the resolver's nine mis-credits corrected and printed | mutation-coverage manifest (+1 plant); lighting census (report) | rows = 708; UNRESOLVED counted and shrink-pinned; `docs/content/WIRING_CENSUS.json` committed with the composers' sha | chair (the owner's spec) |
| C1 | **M0 — the composed-prose manifest** | the golden the generator's cannot be; the reading-sequence export; the duplicate-unit rate | `tests/property/dossierComposedProse.golden.test.js`, `tests/fixtures/dossier-composed-prose.json`, `scripts/dossier-composed-manifest.mjs` | 200 seeds recorded through the desk-read callers; a planted one-word change in one variant flips exactly its rows and no other; base-side totality reproduced | mutation manifest (+1) | manifest committed; baseline duplicate-unit rate printed | chair (N: O-9) |
| C1b | **the ratchets** | prose leaves in the size baseline; the first-paint gate; chunk membership | `scripts/.size-baseline.json`, `tests/lint/sizeBaseline.test.js`, a new `tests/lint/firstPaintBytes.test.js` | a planted 1 KB in a leaf reds the baseline; a planted `data-lazy` reference in a fixture index reds the gate | size baseline | ceilings pinned at today's bytes | chair (the number: O-16) |
| C2 | **M1 — the composer path** | `stateProseComposer.js`; `drawFace` in the kernel; `pieces` on the rung; `drawnAtMount` strips it; the six desks route spines through `composeStateProse` with empty modifier lists | `stateProseKernel.js`, `stateProseComposer.js` (new), `legibilityRung.js`, `dossierMounts.js`, the six `*StateProse.js`, `tests/domain/stateProseKernel.test.js` (+ a composer test) | six leaves sha-identical; **manifest byte-identical over 200**; `drawFace` on a one-face variant provably never hashes; a two-face fixture draws 50/50 over 10,000 seeds | kernel test; desk tests | zero product-text movement; zero corpus bytes | chair (display only, no persisted shape) |
| C3 | **M2 — the schema** | the annex lines of §2.4; the projector branches; `poolMeta` emitted; the connectives leaf with only the floor; the census reconciliation; the contract-test arms (roles, reads-vs-census, faces' slot equality, attach ≤ 3, fragment form, no `which`/dash) | `scripts/generate-dossier-state-prose.mjs`, `RECEIPT_POOLS_DOSSIER_STATE.md` (68 STATE-KEY transcriptions into READS/PREDICATE — no sentence touched), the six leaves (added keys), `connectives.generated.js` (new), `dossierStateProseProjection.contract.test.js` | `--check` green; a leaf diff of ADDED KEYS ONLY; **manifest byte-identical**; each new arm convicted by a planted fixture | projection contract (variant ratchet unchanged at 2,266); lighting census | 68 blocks carry reconciled `READS`; zero text change | chair |
| C4 | **M3 — connectives and arms** | the §7b table to the register card; arms A1–A6, A8–A10; the sampled composed gate with its two-figure SIZE; the composed anti-vacuity fixture | `RECEIPT_POOLS_DOSSIER_STATE.md` §7b, `skepINSTR/src/domain/prose/{entryWalker,grammarWalker}.js`, walker tests | every arm fires on its control and is silent on the shipped corpus except where a finding is expected and printed | walker tests; mutation manifest | the table has ≥ 3 phrases per relation per form; no dash, no `which` | chair (arms); **owner** signs the copy at the walk (O-15) |
| C5 | **R — the rewrite wave**, one workflow per register | every variant re-voiced INTO the model and born with four faces and a grammar tag, in one pass | the annex; the leaves by regeneration | A5 sibling distance ≥ floor; A6 claim equality ×4; walkers green; spread and presence printed; **manifest re-recorded with the shift record naming every pool whose faces landed** | variant ratchet re-pinned UP; lighting census | per register: zero FAIL, WITHHELD ruled, duplicate-unit rate printed before/after | **owner** (the declared shift, O-1) |
| C6 | **W1 — modifiers**, DS-DEF-11 first | the walls block's four modifiers (§6.2); then the THIN tier; then reservoir ATTACH acts | the annex; the defense desk's key calls (+ the `corruption.js` import, measured); other desks per tier | census tiers move by named counts; the walls block prints ≥ 19 player cells on the sample; manifest re-recorded (new text appearing on affected mounts is declared) | projection contract; lighting census | per block: MISSING → COVERED counts, occurrence-sorted | chair per pool; **owner** for the walls numbers (O-4) |
| C7 | **W2 — turns** | class-A turns (§5.2); `TURN: the gate is sold`; the `{reason}` vocabulary (after O-7) | the annex; the stressors/defense desks for `{reason}` | the turn arm refuses a planted conjunction-keyed turn; each turn's cell ≥ the occurrence threshold | as C6 | — | chair; **owner** O-7 |
| C7b | **W2b — the causal register lit** | a join-deriver `causes[]`/`sourceEventId` → `{familyId, arm, slots}`; provenance-bearing turns | new deriver; `causalDossierProse.js` callers | 468 sentences reachable; arm-required-no-default preserved | projection contract (six-exactly, O-12) | — | chair; **owner** O-12 |
| C8 | **the re-measure** (S13) | reading sequences over composed units; re-anchored Figures; arms B executable | `grammarWalker.js` callers; the manifest run | B1–B3 report over N = 200 with n and ceilings printed | walker tests | every quoted consecutive-pair number is a composed-unit number | chair |
| C9 | **the walk** | — | — | the owner's | — | — | **owner** |

Deferred and recorded, not dropped: the slim causal digest (O-6); the guard-alignment field (O-8); per-instance keys on the four list positions (O-11); DS-DEF-11's re-key (O-10); the `{band}` split (O-13); `compromisedSecurityInstitutions` feeding `law_order` (O-14); `useMemo` on the desk callers (a housekeeping car).

---

## 13. OWNER ROWS

| # | decision | the chair's proposal | the number or shape to sign |
|---|---|---|---|
| O-1 | **The declared same-seed TEXT shift.** | Per pool, per car, as its faces land: wording changes, angle and claim do not (§2.5). Recorded in the manifest header every car, moved or not. | sign the SHAPE: "wording-only, per pool, once per pool" |
| O-2 | **Two-level roll (variant, then wording) instead of the brief's flat default.** | Two-level: 100 % of reads keep their semantic variant; the face draw is uniform at 25.05 %. Flat: 45.21 % keep it (`read-instruments-seed.md:163-178`). Flat would also be the first pool-length change in the corpus's history — a reversal of the CT-1a/2/3 landing pattern (`:154-159`). | choose two-level (proposed) or flat |
| O-3 | **Faces per piece = 4; fixed at the freeze; never appended after.** | "Never trim" paired with "a new wording is a new key" (§2.5). | 4; the pairing |
| O-4 | **The numbers.** | occurrence threshold 3 % (≥ 6 of 200); salience weights 3/2/1 with bands 75/25/5; ≤ 2 modifiers, ≤ 2 sentences, ≤ 3 facts; attach ≤ 3; echo ≤ 1 per tab; position budget 2 rungs; fragment ≤ 10 words; ≥ 3 phrases per relation per form. All ESTIMATE-grade, set against the census's histogram. | veto any |
| O-5 | **The ENTRY-grain three numbers** (2/3, 1.75) bind the composed unit as a new grain and are provisional on one author. | Carry them labelled provisional; the re-measure is the owner's on cost and IP (`read-specs.md:142`). | whether to re-measure before the wave |
| O-6 | **A slim persisted causal digest** `{variable: {band, top-2 contributors as {source, causeNoun, sign}}}` for 16 variables. | Unlocks class-B turns and contributor-typed modifiers past the 546,887 B wall; it is a persisted shape and a seed input from birth. | yes / no / later |
| O-7 | **The `{reason}` fill vocabulary** — `CAUSE_LABEL_OF`'s fourteen noun phrases as the fills. | Lights DS-CND-1 and DS-DEF-7's routed-silent pools with no desk change; reader-facing prose (`read-explanations.md:587-590`). | approve the fourteen, or hand the register card its own |
| O-8 | **The guard's alignment (evil / neutral / good).** | No field exists. Either mint one (persisted shape) or rule that "a dark guard" MEANS a captured watch (`criminalCaptureState` + the compromised read). | field or proxy |
| O-9 | **The manifest's N and seed set.** | N = 200 purpose-built seeds; not the generator's 525 keys (a different corpus). | N; the set |
| O-10 | **DS-DEF-11 Phase 2 re-key** to three spines. | Not needed for the owner's sentence; cleaner; re-rolls the block. | now / after the wave / never |
| O-11 | **Per-instance seed suffix on the four index-paired list positions** (conflicts, steadings, neighbours, engagements). | A new key; a declared text shift on those positions; the ladder's idiom. | sign or defer |
| O-12 | **The causal register (R2): families of four, and lighting it.** | Families of four break the six-exactly assertion (24 per family; `read-instruments-seed.md:188`); lighting needs the join-deriver (C7b). | faces on R2 in this wave or the next; wire it or park it |
| O-13 | **Split `{band}`** into its six named roles. | Recovers authored prose in seven blocks; an annex + projection + composer act; a declared text shift. | this program or later |
| O-14 | **`compromisedSecurityInstitutions` feeding `law_order`.** | The obvious missing edge (`read-explanations.md:367-373`); a same-seed BEHAVIOUR shift on every world with a corrupt watch. | sign or refuse |
| O-15 | **The connectives' public copy** and every composed surface's text. | Owner-signed at the walk, as all public copy is. | at the walk |
| O-16 | **The first-paint ratchet number.** | 1,048,000 with the L-MAT tip's 5,878-byte margin carried as a receipt until re-measured at a tip this design can read. | the ceiling |

---

## 14. A LAYMAN'S SUMMARY (for the owner)

Today every sentence on a town page is picked from a small shelf of hand-written sentences, one shelf per fact. The shelf for "why the wall" has five slots and twelve sentences; a town gets one, and towns in one slot often repeat. To say more, someone has had to write a whole new shelf for every new combination, the runaway cost you named.

This design keeps every sentence you have and adds labels beside them: which fact each one may talk about, whether it is a main sentence or a short add-on, and how an add-on joins a main sentence (a cost, a tension, a contrast, or "and"). The page then builds its sentence from parts: the main sentence for the primary fact, plus up to two add-ons for that town's most notable secondary facts, chosen by fixed rules and the town's own seed so it reads the same on every visit. Where the engine already names a combination (the watch is bought), a hand-written line for that exact case wins.

No model writes at render; every part is licensed by the fact it reads, and the checkers walk the assembled sentence. Each part is also written four ways in the house voice, and the seed rolls a fair die over the four, so wording varies without meaning moving. A census of what each sentence is wired to is the map of what is missing, and the writing list.

The walls shelf goes from twelve sentences to twenty-seven parts, and from twelve readings to tens of thousands; every new secondary fact costs one add-on, not a new shelf. Your decisions are in section 13: the numbers, the one-time wording shift and how it is rolled, and three things that would need new saved data.
