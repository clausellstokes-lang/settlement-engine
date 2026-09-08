# DESIGN A — THE COMPOSED-PROSE MODEL, LED FROM THE DATA
**Seat: Fable 5.1 — architect · 2026-09-07 · angle: DATA-MODEL FIRST**

Product read at `$SC/laneB6` = `3b1c0eaa5` (`git log --oneline -1`, executed); instruments at `$SC/skepINSTR` = `74a1aa0e8` (executed). `$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad`. Every figure is either (a) the print of a command I ran (`arch-prose/_a-blocks.mjs`, `arch-prose/_a-conj.mjs`, both read-only, both under `$SC/arch-prose/`), (b) cited to a reader map (`read-kernel.md`, `read-data.md`, `read-explanations.md`, `read-facts.md`, `read-specs.md`, `read-instruments-seed.md`) whose author ran it, or (c) cited to `file:line`. Anything else is marked **ESTIMATE**. No corpus sentence is quoted past twelve words; illustrative fragments are marked ILLUSTRATIVE and are shapes, not authored text. Nothing was written outside `$SC/arch-prose/`.

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
- **The 111 conjunction-keyed pools** (`read-data.md:453` under its marker set; 72 under a strict boolean-marker set — `_a-conj.mjs`, executed: `AND | NO | with | without | × | · | only | neither | but`; 52 of 68 blocks hold none) stay SPINES with a two- or three-fact `reads` and a conjunctive `predicate`. A multi-fact spine is lawful — the predicate is the key function's, e.g. `invasionRowPoolKey(walls, garrison, militia)` at `defenseStateProse.js:309`. They are simply never GROWN: a new combination cell is refused at the gate (a `ROLE: spine` pool whose `reads` is a superset of a sibling spine's `reads` in the same block is a finding, WITHHELD to the chair). DS-DEF-2's 18 conjunction-keyed pools of 26 (`_a-conj.mjs`) are the specimen: they were the hand-paid explosion (`read-facts.md:452-458`) and the model's job is to stop the bill, not refund it.
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
