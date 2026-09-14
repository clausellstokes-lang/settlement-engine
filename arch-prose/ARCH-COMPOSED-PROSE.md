# ARCH-COMPOSED-PROSE — THE COMPOSED-PROSE MODEL, v1
**Seat: Fable 5.1 — architect. Owner commission 2026-09-07 ~22:10 (`ARCH-BRIEF.md`). Written 2026-09-08 from the winning design (C, authoring/gates-led; judged 96 · 95 · 90) with every graft the three judges named from A (data-led) and B (render-led). Read-only throughout; nothing written outside `$SC/arch-prose/`.**

`$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit`. Product read at `$SC/laneB6` = **3b1c0eaa5** (`git log --oneline -1`, executed); instruments at `$SC/skepINSTR` = **74a1aa0e8** (executed). Paths are repo-relative to those docks unless written whole. The six reader maps are cited as `read-kernel`, `read-data`, `read-explanations`, `read-facts`, `read-specs`, `read-instruments` with their section numbers; the designs as A/B/C with theirs.

**Provenance of every figure.** CONFIRMED = a command I ran in this pass whose output I saw; CITED = a reader map, a design or a `file:line` I read; ESTIMATE = reasoning only, marked as such. Nothing over twelve words is quoted from any exemplar text.

What I executed: `node arch-prose/variants-per-pool.mjs $SC/laneB6` → `pools 708 variants 2266 mean 3.20`, histogram `2:33 3:547 4:96 5:17 6:15`, angles `visitor 403 · ledger 681 · street 609 · counterforce 170 · threshold 96 · unfolding 230 · elder 70 · canonical 7`, `blocks with pools below four: 58 of 68` · `node arch-prose/draw-reroll.mjs` (200 seeds × 708 pools = 141,600 reads) → flatten preserves the semantic variant on **45.21 %**, the two-level roll on **100.00 %**, face-0 share **25.05 %** · `node s12-sitting/verify/slots.mjs` → `blocks 68 pools 708 variants 2266`, `{settlement}` 68 · a module-level census over the six leaves → **12 pools mix `dm-only` with public variants · 21 wholly `dm-only` · 7 `canonical` · 642 multi-sentence · 386 semicolon-carrying** · `node arch-prose/_c-dump.mjs` (the three worked blocks' pools, angles, sentence and word counts) · a per-pool seat census on the worked blocks (one-sentence variants; variants with no `;`/`:`) · a read of C's 200-town occurrence output (`_c-occ200.out.json`: N 200 · 56 cells · 9 below ten towns · 4 on every town · 2 on one town · 14 at ≤ 10 % · 47 at ≥ 5 %) · `wc -c` on the seven leaves (six state 641,410 B; causal 210,260 B) · `sed` reads of `stateProseKernel.js:245-306`, `defenseStateProse.js:275-420, 725-800, 1458-1478`, `generalStateProse.js:177, 1712-1725`, `dossierMounts.js:26-90, 475-490, 578-592`, `defenseGenerator.js:187-192, 463-473`, `corruption.js:628-668`, `causeVocabulary.js:70-90`, `generate-dossier-state-prose.mjs:324-350, 704-714`, `dossierStateProseProjection.contract.test.js:275-299`, `sizeBaseline.test.js:1-22`, `generatorGoldenMaster.test.js:800-858`, `vite.config.js:872-880`, `EconomicsGlance.jsx:160-172`, `WarFaithDesk.jsx:136-183`, the instruments' `moveGrammar.js:38-62, 120-163`, `grammarWalker.js:95-121`, `entryWalker.js:728-740, 872-884`, `dossierComposedFill.js:155-165`, `check-pair.mjs:66-72`, `REGISTER-CARD.md` whole, `briefs/brief-INSTR-912-car8.md` whole, `RULES-V2-PART-B.md:622,624,637`, `SITTING-RULINGS-912.md:124-128` · `ls laneB6/src/domain/prose` → no such directory (the instruments are unlanded).

**One measured correction carried through this document:** `read-kernel §8b` and all three judges say `overview.systemsHealth` draws up to **eleven** rungs. The code lists **ten** — four status rungs, `SCORE_AXES` of five (`generalStateProse.js:177`), one food rung (`:1712-1725`, "DS-GEN-3's ten lenses"). Ten is used below.

---

## §0 · THE RENDER, WALKED ON THE OWNER'S WALLS BLOCK (the lead; the specification begins at §1)

The block is **DS-DEF-11 · Defense › Why the wall, and why not**, mounted at `defense.wallRationale`, rung `sentence` (`dossierMounts.js:361`). Its key function is the corpus's only four-fact key, `wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)` (`defenseStateProse.js:747-757`): five pools, twelve variants, all one sentence (CONFIRMED). The docblock at `:732-737` records that STRAINED outranks THREATENED outranks QUIET as a vetoable JUDGMENT and ends "Say 'veto' to reorder." The short-circuit is the owner's explosion problem in miniature: once `militaryGate < 1` the monster family is never consulted, so a walled, underpaid frontier town and a walled, underpaid settled town read the same two sentences.

Take a town after car 8 has landed (the rewrite, the faces, and the walls block's Phase-1 modifiers of §6.2): walls standing on the live roster (`standingDefenseForces`, never the frozen snapshot — `defenseStateProse.js:376-381`); `defenseProfile.economicGates.military = 0.78` (persisted, present because there is a paid stack — `defenseGenerator.js:465-472`); `config.monsterThreat` in the `frontier` family; `compromisedSecurityInstitutions(s)` returns one `covert` name and no `revealed` one (`corruption.js:663-692`); `foodSecurity.label = Deficit`. Seed `_seed = "w-2917"`.

1. **The desk keys the spine exactly as today.** `wallRationalePoolKey` returns `WALLED-STRAINED`. The draw is the existing draw, `eligible[avalanche32(fnv1a32("w-2917::DS-DEF-11::WALLED-STRAINED")) % eligible.length]` (`stateProseKernel.js:301-305`). THE PROMISE holds by construction: no variant was appended to this pool and nothing was renamed.
2. **The desk collects the candidates, still mapping state to keys and nothing else** (`economyStateProse.js:48-55`). Each modifier pool of the block has a candidate function in the key-function idiom; the non-null ones are handed over with a typed `change` flag. Here: `country: pressed` fires (frontier); `watch: bought (covert)` fires; `watch: bought (revealed)` does not. `stores: short` is not a candidate on this block — the echo bound (§4.6) fixed at the freeze puts the stock on DS-DEF-2's disaster row, the same tab's other home for it. `muster: short` is not authored on this block in Phase 1, because every reachable strained town already reads the muster in its spine.
3. **The fact budget.** `WALLED-STRAINED` reads two facts (walls; the gate), so `k ≤ 3 − 2 = 1`: one modifier at most (§4.4). On this seed the spine draws its second variant (index 1 of 2 — computed with the kernel's hash pair; face 3 of 4 once the faces land); that variant's text carries no semicolon, so the clause seat would be open, and it carries a `which` tail, which is the rewrite's cure list (wall 6), not the composer's. Both candidates are `tension` and take the sentence seat, open on a one-sentence spine; one fits.
4. **Salience.** Each candidate's band is the count of notability signals it carries — departure (its firing rate in the norm leaf at or below the departure line), tension (its relation), change (a typed change record). The covert watch: rare + tension = band 2. The pressed country: tension only = band 1 (a frontier is common on this grid). Band 2 first; inside a band the order is a seeded permutation on `w-2917::DS-DEF-11::WALLED-STRAINED::salience::<candidate>` — a new key, a seed input from its birth.
5. **Audience, per piece.** On the DM's page the covert pool is eligible and is seated. On the player's page every face of `watch: bought (covert)` is `dm-only`; `variantIsAudible` drops them (`stateProseKernel.js:159-163`), the pool is empty, the candidate is passed over and the next in rank — the country — is seated. **The player's page over a bought watch is byte-identical to the page over an honest one** (kernel law 2): the honest town's candidate list is `{country}`, the seated piece is the same pool, and its draw key does not mention the watch.
6. **The draws.** Spine: today's key, then its face on `…::WALLED-STRAINED::w` (modulus 4 after the faces land). Modifier: its own key, `w-2917::DS-DEF-11::watch: bought (covert)`, then its face. Opener: the tension relation's sentence-seat list under `…::WALLED-STRAINED::joint::watch: bought (covert)`. Every key is a pure function of seed and pool identity; nothing reads a clock, a counter or a cache.
7. **Fill and arrangement.** Each piece is filled on its own slots by the block's bag (`{settlement}`, `{defwork}` — `defenseStateProse.js:776-779`); a piece with an unfillable slot drops itself and the walk continues down the rank. Sentence seat: the spine's sentence, a space, the drawn opener (possibly empty), the modifier's sentence. No em dash anywhere (B-DASH); no `which` (wall 6); the composer owns the one capital at the seam because `fillSlots` cases nothing (`stateProseKernel.js:280-289`).
8. **One rung, one position.** The composed text is handed to `legibilityRung` as ONE `sentence` string; `provenance` gains `pieces[]` inside the object `drawnAtMount` already strips on a glance row (`dossierMounts.js:581-587`), so nothing leaks past the glance gate. The C3 law holds — one sentence rung per block per page-set — because the modifier is a pool of the same block and the unit is one rung.

What the DM reads: the strained wall (one of two variants, one of four faces), then a second sentence about the bought watch (one of three variants, one of four faces, one of about three openers). Distinct surfaces for this one state cell: 2 × 4 × 3 × 4 × 3 = **288** (ESTIMATE: three openers), from five semantic sentences; today the cell reads one of two. What the player reads: the strained wall, then the country. A neighbouring town with the same facts and a different seed foregrounds the same watch (band 2 outranks band 1 on every seed) and, where two candidates share a band, foregrounds them in the other order. **When the covert watch is exposed** — a `revealed` corruption impairment lands — `.revealed.length > 0`, the revealed pool fires and the covert one does not: a different pool, a different draw, and the player's page now carries the watch. A sentence that changed because the world did, not because the prose was stale. And when the owner signs Phase 2 (§6.2, §13 row 4), the spine becomes `WALLED` with one read, `k ≤ 2`, and the town reads the wall, the short muster in the clause seat and the watch in the sentence seat: the owner's own sentence, three facts, two sentences, one joint.

---

## §1 · PURPOSE, THE OWNER'S WANT, THE NON-GOALS

The owner wants a town page whose prose grows more specific with every relevant fact the engine holds — a wall funded by an underpaid garrison, said one way when the watch that mans it is bought and another when the granary behind it is thin — "getting more specific with every relevant combination", for "every single thing in a settlement in every aspect of its state", with the growth bounded so the authored corpus stays linear while the surfaced readings multiply, and with staleness gone: "if something is repeated, it is because that very specific instance is repeated" (`ARCH-BRIEF.md:5-7`). The chair's method is adopted (`:11-17`): author PIECES — a SPINE per primary fact, MODIFIERS per secondary fact joined by relation-typed connectives along the engine's own edges, hand-written TURNS only where the engine names the combination — and buy the COMBINATIONS with grammar, under bounds of occurrence, depth, relation and licensing, with salience choosing the two most notable secondary facts for this town deterministically. The owner's ~22:30 rule is the second layer (`:22-30`): every semantic piece, existing and planned, is born as a family of four wordings the seed rolls an unweighted die over; NEVER TRIM.

**Non-goals, each with its law.** (1) No language model at render — THE PROMISE; FINITE SEMANTICS; "AI = clerk, never writer" (`:18`); the composer is a clerk over typed buckets and frozen tables, and a lint arm pins its import list. (2) No per-combination authoring — a fact conjunction never earns its own pool again except above the occurrence floor as a TURN keyed on a typed explanation (`:14-15`); the four-fact key at `defenseStateProse.js:747` and DS-DEF-2's six hand-cut cells from three booleans (`:309-318`) are the shape being retired, never extended. (3) No fact change under any seed — the model is display-only (`stateProseKernel.js:10-11`, "nothing here is persisted"); every new draw is a new key with its length fixed at birth; a same-seed TEXT shift is declared and owner-signed; every persisted-shape change the model would like is a §13 row, not taken. (4) No draw-time filter, weight or refusal — rhythm and variety come from AUTHORING and the GATE (`:28`; CLERK-LAWS §2.5 via `read-specs §7`); the chair's rhythm-aware draw is withdrawn.

---

## §2 · THE PIECE MODEL

### 2.1 What ships, and what is added

Today: `StateProseCorpus = Record<blockId, {title, sectionTarget?, arms?, slots, pools: Record<poolKey, Variant[]>}>`, `Variant = {angle, marks?, text, slots}` (`stateProseKernel.js:62-83`; `generate-dossier-state-prose.mjs:556-582`). 68 blocks · 708 pools · 2,266 variants · mean 3.20 (CONFIRMED). No licence, no role, no relation, no grammar, no family id (`read-data §2.1`). The licence exists as prose the projector drops — 68 STATE-KEY, 48 RECEIPT, 23 PROVENANCE, 22 ENTAILMENT lines (`read-data §3.2`); the only machine-read licences are `slots` (anchored liveness) and `marks` (audience; the demoted dimension).

Three shipped facts fix the shape: a pool is an ARRAY and five readers index it as one (`eligibleVariants :247-269`, `poolDimensions :215-224`, `hasStateProsePool :354-357`, the causal reader, the thin-pool arm — `read-data §6.3`); the draw is `seed::blockId::poolKey` over `eligible.length` (`:304`) so appending re-rolls, a rename re-rolls, a new key moves nothing; and `marks` is an untyped bag carrying three vocabularies already (`:48-53`), so a fourth in it is the next silent failure.

The design keeps `pools[key]` an array byte-for-byte and adds a SIBLING METADATA MAP on the block, a NESTED WORDING LIST on the variant, and three small generated leaves. **Why the sibling map and not a pool object (all three designs agree; A supplies the decisive reason):** `drawVariant` reads `blockId` and `poolKey` and never a pool's fields (`stateProseKernel.js:304`), so a `poolMeta` edit cannot move a draw BY CONSTRUCTION — the migration's central claim is a shape, not a property to prove. **Why nested wordings and not four siblings in the pool:** eligibility runs per variant on `marks` and `slots` before the modulus (`:247-269`), so four flat siblings differing by one token would drop out on some towns and the one-in-four would silently become one-in-three (`read-specs S8`); nesting makes eligibility-identity structural — one record, one mark set, one slot set, four surfaces — and leaves `eligible.length` untouched, which is what keeps the semantic draw where it is.

### 2.2 The four pieces

| piece | what it is | keyed on | licence | grammar | angle | draw |
|---|---|---|---|---|---|---|
| **SPINE** | today's pool: one sentence, or two (642 of 2,266 variants are two or three sentences, CONFIRMED), keyed on the block's primary fact | the key the desk's key function returns (118 functions: 91 one-fact, 18 two, 8 three, 1 four — `read-facts §5.1`) | `reads` ⊆ the census's recovered `tests` (§3); arm D on its (block, pool) bag | its `[grammar: Vn]` tag (V1–V8) | one of the eight | `${seed}::${blockId}::${poolKey}` — UNCHANGED |
| **MODIFIER** | a FRAGMENT (lower-case opener, no terminal stop; the clause seat) or a SENTENCE (the sentence seat), keyed on ONE secondary fact the same desk reads; authored once per block, attachable to ≤ 3 of its spines | a new pool key in the SAME block, in the key-function idiom (`muster: short`) | `reads` = exactly one field path; the projector refuses a second (C); refuses a field the attached spine's branch `tests` (§4.6) | ONE move ∈ {PRESENT, CONSEQUENCE, OBJECT, INSTITUTION, GEOGRAPHY, TRADITION}; never ABSENCE (§4.6); OPEN is NOT-EXECUTABLE until a typed unresolved field exists (SITTING A12) | `plain` — standpoint-neutral by law, for fragment and sentence forms alike (C; §13 row 15) | `${seed}::${blockId}::${modifierKey}` — a new key, a seed input from the pool's birth |
| **TURN** | a whole unit (one or two sentences) for a combination the ENGINE names; it REPLACES the spine and the modifiers it `covers` when its registry id holds (the conjunction ladder's rung 1, `causeConjunctionContent.js:186-195`, generalised) | `explains: <registry id>` × `spines: [...]` (§5.3) | the spine's fields ∪ the explanation record's own; keyed on a covert source ⇒ `dm-only` on every face (W8) | its own `[grammar: Vn]` | one of the eight | `${seed}::${blockId}::${turnKey}` |
| **CONNECTIVE** | the joint between a spine sentence and a fragment (clause seat), or the opener before a sentence-form piece (sentence seat); a phrase list per relation × seat in its own leaf, with a totality floor | relation ∈ {addition, consequence, tension, contrast} | the RELATION TABLE row for (spine field, modifier field) — a connective may not add a claim, a modality, a threat class or a spread (W2, B-CLAIM) | none; it is a joint | `${seed}::${blockId}::${spineKey}::joint::${modifierKey}` over the relation × seat list |

### 2.3 The schema (leaf form; projected, never hand-edited)

```js
StateProseBlock = {
  title, sectionTarget?, arms?, slots,
  pools:    Record<poolKey, Variant[]>,             // UNCHANGED — every reader stays byte-identical
  poolMeta?: Record<poolKey, PoolMeta>,             // NEW sibling map; absent ⇒ {role:'spine'} with undeclared reads
}
PoolMeta = {
  role:      'spine' | 'modifier' | 'turn',
  tests:     string[],        // RECOVERED by the census: every field the pool's selecting branch evaluates
  reads:     string[],        // DECLARED (**READS:**), ⊆ tests for a spine; exactly ONE path for a modifier
  predicate: string,          // the census's recovered predicate as text, e.g. "economicGates.military present AND < 1"
  relation?: 'addition'|'consequence'|'tension'|'contrast',   // modifier: fixed per pool (§4.5)
  form?:     'fragment'|'sentence',       // modifier: BOUND to relation — consequence ⇒ fragment; the rest ⇒ sentence (B's seat rule)
  move?:     string,                      // modifier: the ONE move it adds
  attach?:   string[],                    // modifier/turn: spine keys of THIS block (≤ 3; a projector error above) — wave two: 'DS-XXX-N:<key>' reservoir sites (§2.9)
  explains?: string,                      // turn: an id from TURN_KEY_REGISTRY (§5.3)
  spines?:   string[],                    // turn: the spine keys it may replace ('*' = any of the block)
  covers?:   string[],                    // turn: modifier keys whose facts it already states
}
Variant = {
  angle, marks?, slots,
  text:      string,          // FACE 0 — today's text; canonical-at-zero
  wordings?: string[],        // FACES 1..3 — same claim set, same slots, same marks BY CONSTRUCTION
  grammar?:  'V1'…'V8',       // spine/turn (GRAMMAR_TAG_CONTRACT, moveGrammar.js:145-162)
}
// three new generated leaves, all in the lazy chunk:
//   src/data/dossierConnectives.generated.js   {relation: {clause: string[], sentence: string[]}} + DEFAULT (the totality floor, discourseKernel.js:188-190's precedent)
//   src/data/proseNorms.generated.js           {`${block}::${pool}`: rateBp}  — the NORM TABLE, --check-pinned, an OWNER-FACING SEED INPUT from the day it ships (B; §13 row 6)
//   src/data/dossierRelations.generated.js     {`${fieldA}|${fieldB}`: [{relation, source, direction, whenA?}]}  — projected from the engine's own tables (§5.2)
```

`rateBp` lives in the norm leaf and not inside `poolMeta` (B over C), because a re-measured norm re-orders modifiers on installed worlds and therefore needs its own regeneration door, its own byte pin and its own owner row.

**Naming.** The field is `wordings`; the prose word is "wording set" or the owner's "family"; never `family` in code — `tests/lint/proseFamilyContract.walker.test.js` owns that identifier for the chronicle (`read-instruments §0`).

### 2.4 The key table — every hash the model mints (B's form, extended)

| # | piece | key material | modulus | new seed input? | note |
|---|---|---|---|---|---|
| 1 | spine variant | `${seed}::${blockId}::${poolKey}` | `eligible.length` | **no** — unchanged | seedless ⇒ index 0 (law 4) |
| 2 | modifier / turn variant | the same form over its OWN new key | its `eligible.length` | yes, from the pool's birth | a new pool moves nothing existing (CT-1a/2/3, `…contract.test.js:198-236`) |
| 3 | wording face | `${seed}::${blockId}::${poolKey}::w` | `1 + wordings.length`; **no hash at all when 1** (A's short-circuit) | yes, from the first face's landing (Shift 1) | a SUFFIX of key 1, so the parent string never changes |
| 4 | connective (joint or opener) | `${seed}::${blockId}::${spineKey}::joint::${modifierKey}` | the relation × seat list length | yes, from the leaf's birth | list lengths frozen; a longer list is a declared shift |
| 5 | salience order within a band | `${seed}::${blockId}::${spineKey}::salience::${candidateKey}` | ordering only | yes | the position budget's tie reuses it (§4.4) |
| 6 | list-position instance (car 10, owner-gated) | `${seed}::${instanceId}` as the seed prefix — the existing idiom (`OverviewTab.jsx:284`) | — | yes | the four index-paired positions |

All keys use the kernel's one hash pair (`fnv1a32` + `avalanche32`, `stateProseKernel.js:92-115`); no second hash is introduced; seedless stays canonical-at-zero at every level.

### 2.5 The annex grammar

The generator already has the exact branch for a typed, backticked declaration line that throws on an unknown token (`generate-dossier-state-prose.mjs:326-348`, `assertSectionTargets :533-554`). Copy it; do not invent a second one.

```
**`muster: short`** — *the paid muster is short of its funding*
**ROLE:** `modifier` · **FORM:** `fragment` · **MOVE:** `CONSEQUENCE`
**READS:** `defenseProfile.economicGates.military`
**RELATION:** `consequence`
**ATTACH:** `WALLED-THREATENED` · `WALLED-QUIET`
1. `[plain]` and the muster behind it is thinner than the wage roll says
   - `[face]` …
   - `[face]` …
   - `[face]` …
```

| annex line | scope | projects to | refused when |
|---|---|---|---|
| `**ROLE:**` | pool | `role` | outside the three |
| `**READS:**` | pool | `reads` | a path the census does not list under this (block, pool)'s `tests`; two paths on a modifier |
| `**RELATION:**` | modifier pool | `relation` | `consequence`/`tension` with no RELATION TABLE row; absent on a modifier |
| `**FORM:**` | modifier pool | `form` | a form that disagrees with the relation's seat |
| `**MOVE:**` | modifier pool | `move` | `ABSENCE`; `HISTORY`; anything outside the six |
| `**ATTACH:**` | modifier / turn pool | `attach` | a key the block does not hold; > 3; a spine whose branch `tests` the modifier's field; a site on a tab where the fact is a spine (§4.6) |
| `**EXPLAINS:**` / `**SPINES:**` / `**COVERS:**` | turn pool | `explains`, `spines`, `covers` | an id outside `TURN_KEY_REGISTRY`; a turn with no `EXPLAINS` |
| `` `[grammar: Vn]` `` | spine/turn variant | `grammar` | routed away from `marks` (the tag contract, `moveGrammar.js:151-157`) |
| `- `[face]` text` sub-rows | variant | `wordings[]` | a face whose `{slot}` set differs from the parent's; a fourth face after the freeze; a face on the nine bound rows |
| `## §7b THE STATE CONNECTIVES` | annex section | the connectives leaf | a relation outside the four; an em dash; a `which` |

The numbering guard (`:406-411`) is untouched because faces are not numbered rows; `assertNothingDropped` (`:432-452`) extends to face rows and the new tags, or the parser's one real guarantee shrinks (`read-data §6.5`). The projector and `tests/data/dossierStateProseProjection.contract.test.js` move together (`--check` is a byte compare). A modifier row must fail the sentence regex where `FORM: fragment` and pass it where `FORM: sentence` (arm A9). Sentence-form modifier faces may not open with `{settlement}` — wall 10 across the join, enforced at projection so no seat rule ever reads a drawn face (§4.6).

### 2.6 The draws, and the two-level ruling

```js
// stateProseKernel.js (car 3)
export function drawFace(variant, blockId, poolKey, seed) {
  const faces = 1 + (Array.isArray(variant.wordings) ? variant.wordings.length : 0);
  if (faces === 1) return 0;                                            // no hash at all: today's path, byte-identical
  if (!seed) return 0;                                                  // canonical-at-zero (law 4)
  return avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}::w`)) % faces;
}
```

**Ruling: the two-level roll (variant on today's key, face on a `::w` suffix), not the brief's flat default** (`ARCH-BRIEF.md:27`) — because the measurement answers the brief's own question: over 141,600 reads the flatten preserves the semantic variant on 45.21 % and the two-level roll on 100.00 %, with the face die uniform at 25.05 % (CONFIRMED). Under the flatten the migration criterion "wording-only on the golden sample" (`:30`) is unprovable, since 54.79 % of reads would change their ANGLE and claim set. Every face is eligible whenever its parent is, structurally (eligibility runs on the parent's `slots` and `marks`); the gate asserts what the structure cannot — each face's `{slot}` set equals the parent's, and claim equality holds (arm A6). Rhythm and variety come from authoring and the gate, never from weighting.

**Nine rows keep one face, by refusal** (C): the 7 `canonical` variants (CONFIRMED) and the 2 live-string-bound rows (`economy.generated.js:1007`, `:1035` — `read-data §3.4`), because re-voicing a byte-copy of an engine string forks the string's one home. Listed as `NO-FACES: bound`.

**The one-time shift, stated plainly.** A pool's face count is fixed at its freeze at four. "Never trim" is paired with "never append after the freeze; a new wording goes in a new key" (`read-specs S9`), because a fifth face would re-roll every world's face for that pool again. Shift 1 (§8.7) is the FIRST change in this corpus's history that deliberately changes what an existing pool draws for an existing world (three content-train cars landed as wholly new blocks to avoid exactly this — `read-instruments §2.5`); the owner signs it once, on the manifest diff.

### 2.7 How today's 708 pools MIGRATE — two provable halves, then text

Ruling: A's two-car split over C's single kernel car, because each half is then provable alone.

- **M1 — the composer path (car 3).** `drawFace` with modulus 1 everywhere; `composeStateProse.js` handed empty candidate lists returns exactly `readStateProse`'s result; `poolMeta` absent so every pool reads `{role:'spine'}`; `provenance.pieces`; the six desks route their spines through the composer. **Proof:** the six leaves sha-identical (zero corpus bytes); the manifest (§3.5) byte-identical on 525 towns × 2 audiences.
- **M2 — the schema (car 4).** The projector learns §2.5's lines and emits `poolMeta[key] = {role:'spine', tests, reads, predicate}` for every pool from the census, the three leaves with floors only, and the contract-test arms; the 68 STATE-KEY lines are transcribed into `READS` rows the census reconciles — never re-authored. **Proof:** a key-by-key leaf diff printing `0 ADDED / 0 REMOVED / 0 CHANGED pools` and only `poolMeta` keys added; the manifest byte-identical.
- **Then text, declared per car** (§12): the rewrite + faces (Shift 1); modifiers and turns as NEW keys (moves nothing existing); DS-DEF-11's Phase-2 re-key (Shift 2, owner-gated).

### 2.8 The conjunction-keyed pools, and the door that stays shut

111 of 708 keys carry a conjunction marker (`read-kernel §10` item 2; 72 under a strict boolean-marker set — A). They stay SPINES with a multi-field `reads` and a conjunctive predicate; the fact budget (§4.4) makes them spend their own modifier budget, so the hand-paid explosion is never re-paid through modifiers. They are never GROWN: after the freeze, a new `role: spine` pool whose `tests` is a superset of a sibling spine's `tests` in the same block is a finding, **WITHHELD to the chair** (A); the shipped pairs (DS-DEF-2's invasion row, `defenseStateProse.js:309-318`) are grandfathered by the census's pinned baseline. Together with the modifier side (one `READS:` path, a projector error above it — C) this closes the door the owner asked to have closed, and keeps it closed after the wave's list is gone.

The 642 multi-sentence variants (28.3 %) stay spines with smaller capacity (§4.4); no split at migration; the rewrite wave decides per variant, declared.

### 2.9 The reservoir — 448 authored variants in fifteen unmounted blocks (wave two, owner-visible)

`UNMOUNTED_BLOCKS` holds 15 blocks (`dossierMounts.js:483`; shrink-only), 448 variants no composer calls (`read-facts §3.2`). Ruling: A's RESERVOIR ACT is grafted as the NAMED wave-two form (§13 row 18), so the 448 are a scheduled asset rather than a standing debt — but with four guards, not three: (1) the reservoir pool's own draw key is untouched (moving nothing, the CT-1a/2/3 pattern); (2) it is licensed by the ATTACH SITE's bag (the S5 amendment, an extension not a reversal — `read-specs §9`); (3) `UNMOUNTED_BLOCKS` is unchanged, because the block still has no sentence rung of its own (C3 holds: the composed unit is one rung); (4) — the guard A lacked — a reservoir variant attaches only after being re-voiced `plain` and sentence-form in the wave-two act, a declared text act, because a `[street]` sentence under a `[ledger]` spine is a standpoint switch inside one unit, and a seat rule that read the spine's drawn angle would make the modifier's eligibility a function of the seed, which the kernel's contract forbids. The act needs a candidate function in the attach site's desk for the reservoir's fact, which is the wiring debt regardless; the census says which of the fifteen hold a fact an attach site's desk already reads. Only DS-DEF-7 is declared dark in source (`defenseStateProse.js:1435`).

---

## §3 · THE WIRING CENSUS AS THE SOURCE OF TRUTH

INSTR car 8 is commissioned and unbuilt (`briefs/brief-INSTR-912-car8.md`, read whole). It is the owner's specification — (block, pool) → `{predicate, fieldsRead, slotsFilled, status}` from the SOURCE of the key functions and bags, never inferred from prose; the addendum makes it one table indexed both ways with MISSING / THIN / COVERED tiers and co-occurrence by EXECUTION. This design does not re-mint it; it says what the census must ADD to serve composition, how it becomes product truth without an instrument entering the product, and what a missing row does. The owner's question at `ARCH-BRIEF.md:8` is answered YES: the prebuilt half-maps are the annex's STATE-KEY / RECEIPT / ENTAILMENT prose (unread by any machine), `tests/helpers/dossierComposedFill.js` (the bag per (block, pool)), the mount registry, and the shipped conjunction ladder (`causeConjunctionContent.js`); the census is those made executable and joined.

### 3.1 The row, both directions

```
row  = { block, pool, role,
         predicate: [{field, op, value}] | 'WIRING-UNRESOLVED:<reason>',
         tests:     string[],                      // every field the branch evaluates (recovered)
         reads:     string[],                      // the annex's declared claim set, reconciled ⊆ tests
         absent:    Record<field, 'measured'|'default'|'not-produced'>,   // B's column, on EVERY path (§3.3)
         bag:       { declared, variantUnion, composed, conditional, unresolved },   // the nearest-in-scope resolver
         sites:     string[],                      // mounts where this pool can speak, incl. ATTACH sites
         rateBp:    number,                        // firing share over the sample, by execution (→ the norm leaf)
         status:    'RESOLVED' | 'WIRING-UNRESOLVED',
         tier:      'COVERED' | 'THIN' | 'MISSING' }
fact = { field (the PRODUCER token, never the corpus word), values|null, closed: boolean,
         pools: [{block, pool, role, grammars}], asModifier: [{block, pool, attach, tab}],
         combos: [{with, pools, rateBp}] }        // fact-pair co-occurrence by execution
```

Two corrections the census carries or inherits their errors: the instrument's bag resolver takes a name to the file's FIRST `const <name> =` (`dossierComposedFill.js:159`, CONFIRMED) and mis-credits DS-DEF-4/-9/-11 and DS-POW-1 (`read-facts §3.1`); the car ships a nearest-preceding-in-scope resolver and prints the three "twenty" censuses side by side (declared 20 / bag-instrument 22 / bag-corrected 19) so the wave never sizes itself on the wrong twenty. And a KEY-ONLY fact is a rendered CHOICE, not a dark fact: 59 is an upper bound on opportunity (`read-facts §2`).

### 3.2 The tiers → the list (C's mechanical rule; §8.3)

COVERED = a RESOLVED spine with ≥ 3 variants and ≥ 2 grammars and at least one modifier attachable; THIN = below either floor, or a `{settlement}`-only slot set where the bag offers a fill nobody wrote for (the five cheapest blocks: DS-ECO-3, DS-ECO-8, DS-ECO-9, DS-FTH-2, DS-WAR-3 — `read-facts §4`); MISSING = a held fact or a co-firing pair at or above the occurrence floor with no pool; WIRING-UNRESOLVED as below. Every row names the block, the field(s), the reading function, the bag and the count that put it there.

### 3.3 The `absent` column, the label trap, and the echo index

Every `reads` path carries an absence semantics (B), generalising the "default wearing a reading's clothes" test (`dossierMounts.js:53-71`): `economicGates.military` is ABSENT, not 1.0, when there is no paid stack (`defenseGenerator.js:465-472`, CONFIRMED), so a modifier predicate `< 1` over it is a projector error unless written `present AND < 1`. A key built from a producer token through a table is RESOLVED only when the map is asserted total in both directions (the label trap: `indebted`, `religious_conversion`, `heartland` — `dossierMounts.js:73-88`; 2 of 15 crisis banners darkened with no error anywhere). The `fact → asModifier` index is keyed on the PRODUCER TOKEN (B), which is what lets the echo bound (§4.6) join `prosperity` keyed seven ways on DS-ECO-8 and five on DS-GEN-3 without a silent mis-join.

### 3.4 Regeneration and the gate — committed data, never an import; a sha interlock

The instruments are unlanded and must stay out of any product import path (`ls laneB6/src/domain/prose` → none, CONFIRMED; the car-8 fence). So the census is COMMITTED AS DATA — `docs/content/wiring-census.json`, written by `node scripts/wiring-census.mjs`, `--check`-gated on a stale byte exactly as the leaves are (`generate-dossier-state-prose.mjs:706-713`), stamped with the sha256 of the six composers and the mount registry. The projector reads that JSON beside the annex (as it already reads `dossier-slot-shapes.mjs` and `economyFreshness.js`) to (a) refuse a `READS` token the census does not list under the (block, pool)'s `tests`; (b) emit `tests`/`predicate` into `poolMeta` and `rateBp` into the norm leaf; (c) **refuse to run when the stamped sha is stale against the composers** (A's interlock) — the census must be regenerated before the corpus is. The census re-runs at every car that touches a key function, a bag or the annex; its totality arm asserts the integer 708 (then the grown count), never `> 0`. Co-occurrence is measured at the COMPOSER layer with the readings bag rebuilt as the desk-read callers build it (`generalDeskRead.js:176-210`, `PowerTab.jsx:200`), never through the desk's stripped return and never with `{}` readings, which select the absence pools for every seed (`dossierComposedFill.js:13-15`; the taste-sample hazard). The sample is the golden master's 525-row corpus builder (`generatorGoldenMaster.test.js:802-847`) so tier, culture, terrain, route and threat all vary; C's 200-town run varied tier only and is a feasibility probe (56 general-desk cells, a hard core of 4 and a thin tail of 2 — CONFIRMED), not the number the wave uses.

### 3.5 WIRING-UNRESOLVED — fail closed, print loud, shrink only

A pool whose row is UNRESOLVED (a) keeps working exactly as today as a SPINE — the composer never refuses a spine the desk selected, because that would be a draw-time refusal; (b) is not a modifier or turn candidate and cannot host one (`ATTACH` to it is a projector error); (c) makes arm D and C-pair/C-sibling NOT-EXECUTABLE for that pair (the §908 law), printed, never a pass; (d) counts against a shrink-only ratchet pinned at the census car's measured total; (e) prints `NO-LIST-ROW: wiring first` in the authoring list. The static approximation bounds the work: 358 of 708 keys appear verbatim in a desk file; ≈ 350 need resolution no grep can join; ten blocks have zero verbatim hits (`read-data §4`).

### 3.6 The composed-prose manifest — the census's twin and the migration car's proof

The generator golden master (525 rows) hashes the serialised settlement and provably cannot see a dossier sentence: `readStateProse` is called only from `src/domain/display/stateProse/*`, imported only by `src/components/new/**` (`read-instruments §2.1, §3`). The brief's acceptance criterion therefore needs its own instrument (car 1): `tests/property/dossierProseManifest.test.js` + `tests/fixtures/dossier-prose-manifest.json`, the golden's own 525-row corpus builder × the six composers through the shipped desk-read readings, at `audience: dm` AND `audience: player`, a sha per seed over `(mount, block, pool, index, face, angle, pieces[], text)` in `DOSSIER_MOUNTS` order, an `UPDATE_MANIFEST=1` door through `goldenRecordDoor.js`, and the golden master's five-step shift discipline (`generatorGoldenMaster.test.js:21-127`) copied in shape, including a header record written even when nothing moved (the T13 precedent). **Both audiences, because of a control no one-audience manifest can see:** `eligibleVariants` applies `variantIsAudible` before `drawVariant` takes `% eligible.length` (`stateProseKernel.js:264-268, :304`, CONFIRMED), so on the 12 pools that mix `dm-only` with public variants (CONFIRMED) the player's list is shorter and the drawn INDEX of a public variant may differ between audiences; the manifest pins the count of such cells, and a difference on any other cell is a leak. The same run yields the reading sequences arms B1–B3 need, the occurrence census's denominator, and the duplicate-unit baseline (§7.3) — one run, four instruments.

---

## §4 · THE COMPOSITION ALGORITHM

### 4.1 Where it lives

`src/domain/display/stateProse/composeStateProse.js` (new): pure, headless, no clock, no RNG, no settlement access, no lexicon detector. It imports the kernel and the three FROZEN DATA leaves (connectives, norms, relations) — data that is a declared draw input, never a walker — and a lint arm pins that import list (`vendorPdfLazy.test.js`'s shape); an import from generation or the pulse kernel reds. Ruling on `read-kernel`'s open question 1: **the DESK supplies KEYS and typed flags, the CORPUS supplies RELATIONS and roles, the COMPOSER supplies everything else.** A desk keeps its one law — "maps LIVE STATE to a POOL KEY, and nothing else" (`economyStateProse.js:48-55`) — and simply calls its modifier pools' candidate functions the way it calls its spine's key function, handing over the keys that fired and a typed `change` flag. Notability is NOT derived in the desk (B's departure scoring in the desk is refused: a desk that scores against a norm table is deriving); it is read off the norm leaf by the composer.

```
composeStateProse(corpus, blockId, {
  spineKey,                                     // string | null  (null ⇒ null, R-DST-K)
  candidates: [{ key, change: 0|1 }],           // every modifier pool of the block whose predicate holds
  turns:      [{ key }],                        // every turn whose registry id holds for this town
  slots, seed, audience, dimensions,            // exactly readStateProse's options
}) → { blockId, poolKey: spineKey, angle: spine.angle, text: <one string>,
       pieces: [{ role, key, index, face, relation?, seat? }] } | null
```

`legibilityRung.sentence` stays one string; `provenance` grows `pieces` INSIDE the object `drawnAtMount` strips on a glance row (`dossierMounts.js:581-587`); `DeskLines` renders one `<p>` per unit and its `key={line}` collision (`EconomicsGlance.jsx:168`, `WarFaithDesk.jsx:128`) is cured in M1 by keying on mount + index, because composition makes near-identical siblings likelier, not rarer.

### 4.2 The steps, in order (each a pure function)

1. **Readings → spine key.** Unchanged: the key function returns the key or `null`. A TURN whose registry id holds and whose `spines` lists this key REPLACES the spine and the modifiers it `covers` (§5.3); a covert turn truncates to silence on the player face and the composition falls to spine + modifiers (W8).
2. **Candidates.** The desk's fired modifier keys, filtered by frozen metadata only: `spineKey ∈ attach`; the pool RESOLVED; the modifier's field ∉ the spine's `tests` (§4.6); a pool that partitions itself by a demoted dimension the caller has not answered is silent BY ITSELF, the spine untouched (`poolDimensions` is per pool, `stateProseKernel.js:215-224`).
3. **Salience** (§4.3): band, then a seeded permutation within the band.
4. **The bound** (§4.4): the fact budget, the seats, the capacity; walk the ranked list; a candidate takes the seat its relation admits if it is open and the budget allows; stop at two, or at no seat, or at no budget.
5. **Per-piece eligibility and draw**: `eligibleVariants` then `drawVariant` on the piece's own key; an empty pool or a null fill DROPS that candidate and the walk continues down the rank — a drop that changes no modulus of any drawn pool and so moves no other draw.
6. **Face draw** per drawn piece (§2.6); **connective draw** per seated modifier (§4.5).
7. **Fill** per piece with the block's bag (anchored liveness per piece; `fillSlots` cases nothing).
8. **Arrangement.** Clause seat: the spine's FINAL sentence loses its stop; `, ` + the drawn joint + ` ` + the fragment + `.`. Sentence seat: the spine text + ` ` + the drawn opener (may be empty; capitalised by the composer) + the modifier's sentence. Ruling (A over C): the joint goes on the spine's final sentence, not its first, because then the unit's derived order is literally `spine.order ++ [modifier.move…]` — the thing the arms compare against — and the unit closes on the consequence, a standing fact the table could act on (W-O7).
9. **Return** the frozen unit.
10. **Coherence** is the FREEZE's and the GATE's, never the render's (§4.6): nothing here filters on lexicon.

### 4.3 Salience — the signals, the bands, determinism, ties

Three signals, each 0 or 1, all integer, no float, no transcendental (`src/domain/**`'s ban):

| signal | what it measures | source | the number (owner's, §13 row 5) |
|---|---|---|---|
| DEPARTURE | the fact's value is uncommon on the estate | the norm leaf: this candidate pool's `rateBp` ≤ the departure line | line = **10 %** of the sample (ESTIMATE, set against C's distribution: 14 of 56 general-desk cells at ≤ 10 %, 9 at ≤ 5 %, 28 at ≤ 25 % — CONFIRMED; 25 % would call half the cells a departure) |
| TENSION | opposition to the spine | `poolMeta.relation ∈ {tension, contrast}` (licensed, §4.5) | — |
| CHANGE | a typed recent change | the desk's `change` flag, true only from a PERSISTED change record (a condition's `direction: worsening`, `populationTrend.band`, a pulse-stamped transition tick inside the window); a render-time derivation is refused (S11) | the window: one season (ESTIMATE) |

**Band = the count of signals present (0–3); within a band, a seeded permutation on key 5.** Ruling (over A's 3/2/1 weights and C's two bands): the count keeps C's property that both halves of the brief's SALIENCE bound hold by construction — a rare, tense or changed fact always outranks an ordinary one, deterministically, and two towns holding the same two ordinary facts foreground them differently by seed — while honouring that a fact carrying two signals is more notable than one carrying one. Weights are unit and frozen; the departure line and the window are frozen data in the leaf; a change to any of them re-orders installed worlds and is a declared text shift (S11). A4 asserts repeat-call identity and prints the tie rate over the sample.

### 4.4 The bound — facts, seats, capacity, position

- **The FACT BUDGET (A, grafted at the highest priority):** `k ≤ 3 − |spine.reads|`, where `reads` is the spine's DECLARED claim set (⊆ the census's `tests`; the walker's C-arms check the text claims every declared field and no other). A one-fact spine takes ≤ 2 modifiers; a two-fact conjunctive spine ≤ 1; a three-fact spine none. A modifier reads exactly one field, so a unit never holds four facts — the brief's DEPTH bound ("never four") made structural. A turn's `reads` is the spine's fields ∪ the explanation record's, so a turn over a two-fact spine takes no modifier beside it. Every worked figure in §6 is computed under this rule.
- **SEATS bound to RELATION (B):** the CLAUSE seat ← `consequence` ONLY, because PRESENT → CONSEQUENCE is the register's own V2 order (`moveGrammar.js:90`) and a consequence is not a second subject but the standing cost of the first; the SENTENCE seat ← `tension`, `contrast`, `addition`, each its own sentence (R-DA-03 to the letter: a second fact takes its own sentence, never a tail). A modifier is authored FOR its seat (`form: fragment` vs `form: sentence`) so no piece is ever bent to fit; W-O1 (STATE precedes CAUSE) holds by construction.
- **CAPACITY from the drawn spine (C):** the unit is at most TWO sentences with at most ONE joint (wall 6; R-DA-03; R-DA-06). The clause seat is open only if the spine's final sentence carries no `;` or `:` already (386 variants carry a semicolon, CONFIRMED); the sentence seat is open only if the spine is one sentence. So the attached count is 0, 1 or 2 as the DATA and the DRAW allow (S18, never "always two"): on DS-DEF-11 only 3 of 12 variants have a free clause seat and all 12 a free sentence seat; on DS-DEF-2, 59 of 78 and 65 of 78; on DS-GEN-3, 108 of 128 and 125 of 128 (CONFIRMED).
- **The POSITION BUDGET (A):** at a mount whose desk returns more than two rungs — `overview.systemsHealth` up to 10, `faith.patronSeat` 8 (`WarFaithDesk.jsx:178-181`, CONFIRMED), `war.standing`, `defense.threatAssessment`, `defense.armedForces`, `overview.activeConditions` 5 each (`read-kernel §8b`) — at most TWO rungs carry modifiers: after each rung composes independently, the desk keeps modifiers on the two rungs whose top-ranked (rung, modifier) pair is highest (band, then key 5) and renders the rest as bare spines; and a modifier pool seated at one rung is withdrawn from the other rungs at that mount. This is an arrangement over draws already made, inside the ONE desk call that returns the grouped shape (`generalStateProse.js:1663-1668`), so it changes no eligible list and needs no cross-desk state. A later change to the budget is a declared text shift.
- **DEPTH:** pairs by default; a triple only as spine + joint + a second-sentence piece, or as a TURN at or above the occurrence floor (§6.1); never four.
- **OCCURRENCE:** a cell earns hand-written text (a turn) only at ≥ **5 %** of the sample (C; ≥ 27 of 525 — §13 row 5); below it the pair reads by composition and is listed `COMPOSED-ONLY` so nobody authors for it by habit.

### 4.5 Connective choice — relation typing, the leaf, and the relation that flips

The connective is chosen by the RELATION and the relation is a property of the modifier pool fixed at the freeze — "a connective is chosen by the typed provenance EDGE, never by the music" (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1991-1999`, the causal annex's own law). Four relations:

| relation | seat | licence at the freeze | forms (ESTIMATE of the set; the wave authors them, the walker pins them) | bands that bind |
|---|---|---|---|---|
| `consequence` | clause | a RELATION TABLE row from sources (a)–(c) of §5.2 between the spine's field and the modifier's | `, and` · `, so` · `; ` where the list authors it — never `, which` (wall 6) | semicolon rationed (R-DA-06); joints per unit ≤ 1 (a new printed figure, S12) |
| `tension` | sentence | a row from source (d): an `interesting_tension` contradiction type or a ratified axis pair | empty opener · `Yet` · `Even so,` · `Against that,` | `shapes.antithesisRate`; `rather than` ≤ 0.020/variant (R-DA-02) |
| `contrast` | sentence | **wall 5 only**: a sibling pool key or sibling band of THIS block names the rejected alternative (`moveGrammar.js:127`); arm A3 | empty opener; a fronted contrast is refused | never the closing move of more than one variant per pool |
| `addition` | sentence | none — the claim-free floor; still spends a licensed (move, field, value) triple under arm J | empty opener only | — |

The connectives leaf (`src/data/dossierConnectives.generated.js`) is projected from a new `§7b` section of the state annex in the causal annex's §7 idiom; the chronicle's colon-bridges are NOT reused (a register breach, `read-data` Q7). Arm A2 fails a `consequence` or `tension` joint whose pair has no row; WITHHELD where a row exists but its direction is unread.

**The relation that flips with the spine's polarity (B; a hole in C's table).** A food deficit is a `tension` against a high prosperity rung and an `addition` beside a low one (DS-ECO-1, B §6.5). `relation` must stay fixed per pool for the walker to check it, so a flipping relation is TWO pools with DISJOINT `attach` sets, and the RELATION TABLE row carries a `whenA` predicate on the spine's value class that the projector checks each pool's `attach` set against. The desk keys nothing extra: the attach lists do the routing.

### 4.6 The coherence pass — impossible at the freeze, caught at the gate, never filtered at the draw

CLERK-LAWS §2.5 / R-DA-20 forbid a runtime refusal because it would change `eligible.length` and move every later index (`read-specs §7`, S7). So:

- **No restatement or negation of the spine.** Structural: a modifier's one field may not be a field the attached spine's branch `tests` (a projector error on `ATTACH`); this is stricter than A's `reads ⊆` and it is what keeps `muster: short` off every spine whose branch consulted the gate. Lexical: arm A1 (new) — `typedFactsOf` (`entryWalker.js:627`) overlap on a governed noun with the same band class across pieces = restatement; disjoint classes on one noun = C5's conflict across pieces (negation).
- **No ABSENCE modifier at all** (C over A/B): `MOVE: ABSENCE` is struck from the modifier vocabulary because R-DA-08 makes an absence a replacement never an addition and V3's LACK class is undemonstrable (`read-specs §4`); a class that cannot exist cannot open or sit beside itself (wall 3), and `armF` F3 stays the belt behind that brace.
- **Wall 10 across the join** (B): no sentence-form modifier face opens with `{settlement}` (a projector refusal, §2.5), so the settlement token — the estate's largest opener concentration, 0.240 (`read-specs S13`) — can never open two adjacent sentences of one unit; enforced at authoring so no seat rule ever reads a drawn face.
- **Sibling agreement across pieces and across the page-set:** C1/C2/C5 walk the COMPOSED unit (S17); at the gate `armC5` runs with `ground.siblings` = every unit on the page-set for the sampled town, band-per-noun; an office noun in the spine plus a duty verb in the modifier is a C2 pair neither piece carried — the composed anti-vacuity control (§8.5).
- **The ECHO BOUND — static, census-enforced, no render-time coordination across desks** (A over C; ruling: C's first-mount-wins needs one desk to know what another attached, which the one-caller rule ARM 2 and the per-desk silent shapes forbid). Three layers, all keyed on the PRODUCER TOKEN (B): (i) `attach.length ≤ 3` per modifier pool; (ii) one producer fact backs a modifier at ≤ 1 mount per TAB, and at NO mount on a tab where that fact is a spine; (iii) ≤ 3 mounts per page-set (the census prints mounts-per-fact; the chair rules). Within a mount the position budget seats each pool once (§4.4). A refused attach is a projector error with the site named — the worked refusals in §6.2–§6.4.
- **Audience and dimensions per piece:** the kernel's, unchanged, twice — at eligibility and at fill.

### 4.7 Determinism, in the kernel's own words

"Eligibility is a function of the state alone, and the draw is a function of the seed and the pool identity alone" (`stateProseKernel.js`, THE PROMISE paragraph). Composition adds: attachment is a function of the state and of frozen leaf data; ranking within a band is a function of the seed and a documented key; every draw is per pool on a fixed-length eligible list; the position budget is an arrangement over draws already made. Nothing reads a clock, a counter or a cache. Arm A4 asserts it at the gate.

---

## §5 · THE EXPLANATION SEAM

### 5.1 What the engine holds today

Twelve per-entity explainers behind `explainEntity` (`src/domain/explanation.js:1131`), all computed at render, one production caller (`counterfactual.js:203, :244`), none in any composer; a persisted `simulationTrace[]` (generation only); persisted `activeConditions[]` with `causes[]`, `triggeredAt`, `affectedSystems` (46 archetypes, 131 archetype→variable edges, 0 unknowns — `read-explanations §4.1`, executed there); a 16-variable causal substrate with signed contributors, NOT persisted, costing 546,887 B / 28 files to import into a dossier tab (`defenseStateProse.js:1460-1468`, CONFIRMED); the closed 14-class cause vocabulary with pure presence predicates (`causeVocabulary.js:45-64`, `:165-228`); the persisted `npc.compromiseLifecycle` stamp; six contradiction detectors, four classed `interesting_tension` at `contradictions.js:142, :194, :270, :314` (CONFIRMED — `read-explanations` says three); and the shipped conjunction ladder (`causeConjunctionContent.js:186-215`, full → role → class → floor, hashed on `${seedId}::${key}`, live on the NPC card). The single causal read in any composer is `conditionProvenancePoolKey` (`stressorsStateProse.js:242-250`). The causal register — 78 families, 468 variants, 105 arms — has no importer (`read-explanations §7.2`).

### 5.2 The RELATION TABLE — four sources, projected, never hand-typed except (d)

`src/data/dossierRelations.generated.js`, keyed `(fieldA, fieldB) → [{relation, source, direction, whenA?}]`:
(a) condition archetype → system variable, read ONLY through `canonicalAffectedSystems` (`stressorsCore.js:410`; the raw catalog carries aliases that are not variables) → `consequence`; (b) the `CAUSE_SIGNAL` rows (`causeVocabulary.js:165-228`) → `consequence`; (c) the generator's recorded derivations — the wall/muster edge is `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)` degrading `scores.military`, persisted as `economicGates.military` (`defenseGenerator.js:189-191`, `:467-472`, CONFIRMED) → `consequence`; (d) the `interesting_tension` contradiction types and RATIFIED AXIS PAIRS (a sitting act citing the engine edge or generator rule per row — e.g. a manned wall × a bought watch, edge `patronageSecurityDrag`, `corruption.js:702-709`) → `tension`. No row ⇒ `addition`. `contrast` is never a table relation; it is wall 5's. **Deity doctrine (W7) binds here:** no row runs from a deity's alignment axis to a civic fact; a TRADITION-move modifier on a faith block reads a culture field (piety band, rank axis, cults present, mandate) and never theology.

### 5.3 TURN-KEY REGISTRY — what a turn may be keyed on today, and the refusal

| tier | id form | source | persisted? | cost at the dossier | standing |
|---|---|---|---|---|---|
| 1a | `condition:<archetype>[:<severityBand>]` | `activeConditions[]` (46 archetypes) | yes | the stressors desk reads it already | AVAILABLE |
| 1b | `corruption:revealed` / `corruption:covert` | `compromisedSecurityInstitutions(s) → {covert, revealed}` (`corruption.js:663-692`; watch/garrison/constab/guard/magistrate/court/barracks by `SECURITY_INSTITUTION_RE :630`) | computed from persisted parts | the closure of `corruption.js` into a desk is UNMEASURED — the taste car measures it by the defense desk's own import walk and refuses above the 293,079 B precedent | AVAILABLE if the closure is small; covert ⇒ dm-only on every face |
| 1c | `contradiction:<type>` | `detectContradictions` (six types) | render-time | closure UNMEASURED (`surplus_but_capacity_critical` reaches the capacity model) | measure first |
| 2 | `cause:<class>` (14) | `presentCauseClasses(readCauseContext(...))` | NO — needs the 16 scores | 546,887 B / 28 files | **REFUSED at the dossier until the persisted digest** (§13 row 10) |
| 2 | `join:<familyId>` (78) | the causal register's join-deriver from `causes[]` / `sourceEventId` | the deriver does not exist | — | **REFUSED: no deriver**; car 13 |

The registry is a frozen list in the generator; `**EXPLAINS:**` outside it throws (arm A8). This is the arm that keeps a turn from being the MEANING non-move with a good vocabulary (S16): "the gate is sold" is a lawful turn keyed `corruption:revealed` on the spines `WALLED-*`; "a town that has forgotten its walls" is not a turn, because no field holds what a fact means. **What a turn may claim:** on a STATE spine, only V2's structural consequence — what the arrangement costs the town as a standing fact; the historical class is REFUSED on R1 (R-DA-19; S15); a turn over a compromise stamp speaks of the OFFICE as office (the PERSON move), never the NPC's name or fate (product scope). The `{reason}` seam — three routed pools silent for want of a `bare-common` fill (`stressorsStateProse.js:279-294`; `defenseStateProse.js:1470-1477`, CONFIRMED) — lights with `CAUSE_LABEL_OF`'s fourteen noun phrases (`causeVocabulary.js:73-75`) and no desk change; reader-facing prose, so §13 row 9.

### 5.4 How an explanation's absence degrades

A steady state with no event, no condition and no contributor has NO explanation record — the majority state of a fresh settlement (`read-explanations §8`). The ladder: no registry id ⇒ no turn ⇒ spine + modifiers ⇒ spine + one ⇒ spine alone ⇒ silence (R-DST-K). No rung is ever written empty (ruling 4, the full form). A tier-2 key behind the import wall is NOT-EXECUTABLE and prints as such, never `[]` (the §908 law).

---

## §6 · THE BOUNDS, THEIR NUMBERS, AND THE ARITHMETIC ON THREE REAL BLOCKS

### 6.1 The numbers

| bound | number | how it was set | binds |
|---|---|---|---|
| OCCURRENCE | a turn at ≥ 5 % of the sample (≥ 27 of 525) | C's executed distribution (56 cells; 9 below ten towns; 4 on every town) — the six-desk figure on the golden grid is car 0's | owner row 5 |
| DEPARTURE line | a candidate is notable-by-rarity at ≤ 10 % | the same distribution (14 of 56 at ≤ 10 %) — ESTIMATE | owner row 5 |
| FACTS | ≤ 3 per unit: `k ≤ 3 − |spine.reads|` | the brief's "never four" | wall-grade (chair) |
| SENTENCES / JOINTS | ≤ 2 sentences; ≤ 1 joint; seats by relation | wall 6; R-DA-03; R-DA-06 | walls |
| ATTACH / ECHO / POSITION | attach ≤ 3; ≤ 1 mount per tab per fact, none where it spines; ≤ 3 per page-set; ≤ 2 modifier-bearing rungs per mount | A's bounds, all freeze-time or one-call arrangements | chair; owner row 5 |
| RELATION | consequence/tension only on a table row; contrast under wall 5; addition free | §5.2 | arms A2, A3, J |
| LICENSING | every piece: arm D at its (block, pool) bag; every unit: C1–C6 sampled with N and sha printed; `reads` ⊆ `tests` | the census; R-DA-20's SIZE as two figures (S17) | W1 |
| EXEMPLAR | REGISTER/TAB/POOL: BUDGET 1/3 · DEPTH 0.5; ENTRY and the COMPOSED UNIT: 2/3 · 1.75 PROVISIONAL (one author); PERFECTION flagged | Part B §16.1 line 624, §16.2 line 637 | owner row 8 |
| FACES | 4 per piece, fixed at the freeze; sibling distance ≥ a floor measured on the estate's own ruler (L1 over the 21 `RATE_METRICS`, never band-widths) | the owner's rule; A5 | owner rows 3, 7 |
| FRAGMENT length | ≤ 12 words (ESTIMATE; measured at the taste) | the taste car | owner row 5 |

### 6.2 The general law (B)

Let a block hold a spine fact with `|S|` values and secondary facts `F_1 … F_m` with `|V_i|` notable values each, `k` variants per pool, `w` faces per variant, `c` connective forms per relation × seat. **Authored pieces = `k·(|S| + Σ|V_i|)` semantic sentences, `w` times that in wordings — LINEAR in the facts and their values. Hand-authoring the cells costs `k·|S|·Π(|V_i|+1)` — the product the owner named.** Surfaced readings for one state cell with two modifiers seated ≈ `(k·w)·(k·w·c)·(k·w·c)`. The corpus stays linear; the page multiplies. The fact budget is what stops the product from re-entering through a multi-fact spine.

### 6.3 Worked block 1 — DS-DEF-11 · the owner's walls (`defense.wallRationale`)

**As shipped (CONFIRMED, `_c-dump.mjs`):** 5 pools · 12 variants, every one a single sentence; slots `{settlement, defwork}`; angles per pool THREATENED ledger/street/visitor · QUIET visitor/elder/ledger · STRAINED ledger/unfolding · UNWALLED-SMALL street/visitor · UNWALLED-LARGE counterforce/ledger; words 15–26. Free clause seats: THREATENED 0 of 3, QUIET 1 of 3, STRAINED 1 of 2, UNWALLED-SMALL 0 of 2, UNWALLED-LARGE 1 of 2 (CONFIRMED). The census's `tests` per pool from the branch at `:747-757`: STRAINED {walls, gate}; THREATENED and QUIET {walls, gate (by exclusion), family}; UNWALLED-* {walls, tier}. Declared `reads`: STRAINED {walls, gate}; THREATENED/QUIET {walls, family}; UNWALLED-* {walls, tier} — two each, so **`k ≤ 1` on every spine of this block today.**

**Migration (cars 3–4):** every pool `role: spine`; zero text change.

**Phase 1 — additive, no re-key (ruling: A's landing first, because it delivers the owner's fact with zero REPLACED cells and no block-level declared shift; C's re-key becomes the owner's Phase 2).** New pools, same block, each reading ONE field:

| pool | reads | predicate | relation · seat · move | attach | echo / refusal |
|---|---|---|---|---|---|
| `country: pressed` | `config.monsterThreat` | `measuredMonsterFamily ∈ {plagued, frontier}` | `tension` (source d, the axis pair walls × country, ratified at the sitting; else `addition`) · sentence · PRESENT | STRAINED, UNWALLED-SMALL, UNWALLED-LARGE | on THREATENED/QUIET refused: their branch `tests` the family |
| `watch: bought (revealed)` | `compromisedSecurityInstitutions().revealed` | `.length > 0` | `tension` (source d, edge `patronageSecurityDrag`) · sentence · INSTITUTION | the three WALLED-* | closure of `corruption.js` measured first (§5.3) |
| `watch: bought (covert)` | `…().covert` | `.length > 0` | `tension` · sentence · INSTITUTION; `dm-only` on every face (W8) | the three WALLED-* | — |
| `stores: short` | `economicState.foodSecurity.label` | `∈ {Deficit, Deficit × Active Famine}` | `addition` · sentence · PRESENT | — | **REFUSED on this block by the echo bound (ii): DS-DEF-2's disaster row is the stock's home on the defense tab (§6.4)** |
| `muster: short` | `economicGates.military` | `present AND < 1` | `consequence` · clause · CONSEQUENCE | — | **NOT AUTHORED in Phase 1**: every reachable strained town reads the gate in its spine; on THREATENED/QUIET the branch `tests` the gate |

The owner's fourth fact — the guard's alignment (evil / neutral / good) — has NO field (`read-explanations §5`); no modifier is authored for it; §13 row 11 asks whether a field is minted or the proxy (`criminalCaptureState` + the compromised set) is the meaning.

**Arithmetic, Phase 1.** Authored: 12 → 21 semantic pieces (3 modifier pools × 3), 84 wordings; the turn `corruption:revealed` on the WALLED-* spines ("the gate is sold", 3 × 4, `covers: [watch: bought (revealed)]`) is authored only if car 0 shows its cell at ≥ the floor. Cells the block can speak (DM): STRAINED × {bare, country, watch-r, watch-c} 4, THREATENED × {bare, watch-r, watch-c} 3, QUIET 3, each UNWALLED × {bare, country} 2 = **14 (player 11), from 5 today**. Distinct surfaces at the fully loaded DM cell (a strained frontier wall with a bought watch): spine 2 × 4 = 8; sentence-seat modifier 3 × 4 = 12; openers ≈ 3 ⇒ **288 (ESTIMATE) from 5 semantic sentences, against 2 today.** The country and the stores wait — the fact budget lets one modifier through on a two-fact spine, and that is the honest reading of the owner's five-fact ideal on this block: the three most salient facts speak here, the fourth speaks at the stock's own home on the same tab.

**Phase 2 — the re-key (owner-gated, Shift 2; §13 row 4).** Three spines — `WALLED` (reads {walls}, `k ≤ 2`), `UNWALLED-SMALL`, `UNWALLED-LARGE` — with `muster: short` (consequence, clause) and `country: pressed` as modifiers, the eight existing WALLED-* variants re-voiced into the two modifier pools' faces (a declared text act; counted, never trimmed; the variant ratchet holds), and a `WALLED` spine authored at ≥ 3 × 4. This is the shape under which the owner's own sentence — the wall, the short muster in the joint, the bought watch in sentence two — is lawful under the fact budget; C's reorder (family first, STRAINED only where the family is unmeasured) keeps every spine at two reads and can never seat the watch beside the muster, which is why A's shape is taken. The manifest names every REPLACED cell (walled + strained + measured family) and proves every other moved cell ADDITIVE. Fully loaded DM cell under Phase 2: 12 × (3 × 12) × (3 × 12) = **15,552 (ESTIMATE)**. The hand-cut alternative for the same reach: 5 spines × 2⁴ modifier states = 80 pools × 3 = 240 variants (960 wordings), doubling with every new fact (C).

### 6.4 Worked block 2 — DS-DEF-2 · Threat assessment (five rungs at one mount; the fact budget biting)

**As shipped (CONFIRMED):** 26 pools · 78 variants, every pool exactly 3; slots declared `{settlement, band, route}` but every variant names `{settlement}` alone; 13 multi-sentence; free clause seats 59 of 78, free sentence seats 65 of 78. Five rows at `defense.threatAssessment` (`dossierMounts.js:325`): Beasts (7 pools, `beastsRowPoolKey(monsterThreat, perimeter, force)`, `:283`), Invasion (6, `invasionRowPoolKey(walls, garrison, militia)`, `:309` — TOTAL over eight combinations), Internal (4, court × prison), Economic (4 bands, one score), Disasters (5, `disasterRowPoolKey(granary, hospital, church)`, `:359`). This is the hand-paid explosion, already paid once (`read-facts §5.1`).

**The fact budget per cell (declared `reads` ⊆ the branch's `tests`, from the shipped texts — the census confirms):** Invasion: `walls AND professional garrison` {walls, garrison} k ≤ 1 · `walls with citizen militia` {walls, militia} k ≤ 1 · `walls with NO force` {walls, garrison, militia} **k = 0** · `force with NO walls` {walls, garrison} k ≤ 1 · `militia only` {walls, garrison, militia} **k = 0** · `neither walls nor force` **k = 0**. Beasts: the three-clause cells (`plagued, perimeter AND organized force`; `plagued, NO perimeter and NO force`) k = 0; the two-clause cells k ≤ 1. Internal: k ≤ 1 everywhere. Economic: reads one score ⇒ k ≤ 2. Disasters: `granary AND hospital` and `NO reserves, hospital present` k ≤ 1; `granary AND parish care only`, `granary, NO medical provision` **k = 0**; `NO reserves, NO medical provision` {granary, hospital} k ≤ 1. **The rule bites exactly where the cell was hand-cut as a three-fact conjunction, and nowhere else.**

**Modifiers:** `stores: short` (reads `foodSecurity.label ∈ {Deficit, Deficit × Active Famine}` — the STOCK behind the building the row names, PRESENT of a short stock, never the ABSENCE of a granary; `addition`, no table row joins the stock to the reserves; sentence seat) and `stores: import-fed` (`= Import-Dependent`; `addition`) — attach ≤ 3 each: `granary AND hospital`, `NO reserves, hospital present`, `NO reserves, NO medical provision`. **The worked REFUSAL:** `muster: short` on the invasion row's garrison cells is refused at the freeze in Phase 1 (the gate is a spine fact on the defense tab, DS-DEF-11 STRAINED — echo bound (ii)) and in Phase 2 (DS-DEF-11 already carries it as a modifier on the same tab); the muster is said once on the defense tab, at the wall. `watch: bought (*)` on the beasts row is refused for the same reason. The position budget's ceiling of two modifier-bearing rungs is not reached in wave one (only the disaster row has candidates); it is the wall that stops the mount from growing five clauses later.

**Arithmetic.** 78 + 2 × 3 = **84 semantic pieces (336 wordings)**, where a hand-cut disaster row that also knew the stock would be 5 × 3 states = 15 pools × 3 = 45 variants for one row. The cell `granary AND hospital, stores short`: spine 3 × 4 = 12 × opener 3 × modifier 12 = **432 (ESTIMATE)** against 3 today; the row's cells 5 → **11** (three cells × {bare, short, import-fed} — the two stock values are exclusive and `k ≤ 1` — plus two cells bare).

### 6.5 Worked block 3 — DS-GEN-3 · Systems Health (ten rungs at one mount; the position budget and the worked refusal)

**As shipped (CONFIRMED):** 42 pools · 128 variants · `{settlement}` only in both censuses (`read-facts §4`); every pool reads ONE fact (five axes × four bands + prosperity 5 + safety 3 + viability 2 + readiness 6 + food 6), so **`k ≤ 2` on every rung**; 105 of 128 variants have both seats free. Up to ten rungs draw at `overview.systemsHealth` (`generalStateProse.js:1712-1725`; `dossierMounts.js:337`) as ten `<p>` with no relation — 3¹⁰ = 59,049 possible dashboards already, but ten assertions in a row (`read-kernel §8`). The block holds no second fact per rung (S10), so its modifiers come from the general desk's 28 KEY-ONLY facts (`read-facts §2`) through the census's `fact → asModifier` index.

| pool | reads | predicate | relation · seat | attach | echo check |
|---|---|---|---|---|---|
| `approach: narrow` | `readings.tradeRouteAccess` | `∈ {isolated, mountain_pass}` | consequence (trade_connectivity edges) · clause | `scores.economic: WEAK`, `CRITICAL`, `scores.military: CRITICAL` | **REFUSED at the freeze: `tradeRouteAccess` is a spine fact at `overview.origin` (DS-GEN-6, `dossierMounts.js:334`) on the same tab — echo bound (ii). Kept here as the worked refusal.** |
| `purse: short` | `economicGates.military` | `present AND < 1` | consequence (source c) · clause · CONSEQUENCE | `scores.military: WEAK`, `CRITICAL`, `ADEQUATE` | a different tab from the wall (defense) ⇒ admitted; 2 of ≤ 3 mounts per page-set; the bag needs `economicGates` in the general desk's readings — a caller line at `generalDeskRead.js:176-210`, named by the census |
| `roll: falling` | `readings.populationTrend.band` | the falling band | `addition` · sentence · PRESENT (no source (a)–(d) row from the roll to a score today; the sitting may ratify one) | `scores.military: WEAK`, `CRITICAL`, `scores.internal: WEAK` | `populationTrend` spines on no overview mount ⇒ admitted |

**The position budget at work.** Ten rungs compose independently; `purse: short` can seat only on the military rung (its attach set), `roll: falling` on the military or internal rung; each pool seats once per mount; at most two rungs carry modifiers. A town at `scores.military: WEAK` with a short purse and a falling roll reads that rung as spine + joint + purse + a second sentence on the roll (k = 2), the internal rung bare, the other eight bare — the dashboard grows by one clause and one sentence, not tenfold; arms B1–B3's consecutive-pair statistics move by a bounded amount. Surfaces at that cell: 12 × (3 × 12) × (3 × 12) = **15,552 (ESTIMATE)** against 3 today. Authored: 128 + 2 × 3 = **134 semantic (536 wordings)**. The angle imbalance this block shows in C's run (visitor 1033 / street 1028 / ledger 946 against unfolding 34) is authoring's, not the draw's; faces buy wording variety and no angle variety (`read-instruments` Q10, said out loud).

### 6.6 The corpus arithmetic, whole (ESTIMATE, sized by car 0)

Today 2,266 semantic variants. Faces: 2,266 × 4 = **9,064 wordings** less the 9 bound rows (27 faces). The authoring wave: ≈ 3 modifier pools × 3 variants on each of ≈ 50 wired-and-resolved blocks ≈ 450, turns at the floor ≈ 40 × 3 = 120, THIN pools' second grammars ≈ 200 → **≈ 770 new semantic pieces (≈ 3,100 wordings)**; the brief's ≈ 1,800 (`ARCH-BRIEF.md:19`) was PLAUSIBLE, mine is sized from the tier rules under the attach and fact bounds and is equally unmeasured until car 0 prints the tiers. The corpus stays linear: 2,266 + ≈ 770 pieces; surfaced readings per block go from hundreds to tens of thousands.

---

## §7 · STALENESS AND REPETITION

**Within-town stability (THE PROMISE).** Every draw is keyed on the seed and a pool identity; every new key is fixed at birth; eligibility is a function of state; attachment of state and frozen data. Same seed, same state ⇒ same composed text on every visit, forever. A page re-rendered after the world pulse moved a fact is different because the KEY moved — the world changing, not staleness; the composer reads and never writes. Executable form: the manifest's zero-drift arm.

**Across-town variety — measured, never manufactured.** Nothing at render produces variation the data does not hold (fault 35). Variety comes from the pieces' dispersion (arm E per pool: uniform grammar ≤ 0.30, uniform segment count ≤ 0.400, repeated opener ≤ 0.030 — `read-specs §5`), the wording sets (A5), the salience bands, and the data-borne modifier count. Measured by: the SPREAD arms (A on tagged rows; B1–B3 over the manifest's reading sequences; E per pool); the PRESENCE measure (`presenceMeasure.js:103`, reported, never a gate; `{settlement}` buys no texture because `hasTextureDevice` strips slot markers — `read-facts §6.4`; the sensory lexicon is 166 distinct nouns, not the receipt's 177).

**"Repeated only because the instance repeated" — the operational form.** Two towns render byte-identical text at one mount iff their INSTANCE coincides: ⟨spine key, ranked modifier keys, turn, spine index, faces, joint index, fills⟩. The REPEAT CENSUS (C, a report arm over the manifest, per mount): distinct texts ÷ towns per state cell against the CHANCE FLOOR given the piece counts (a 3 × 4 spine alone: 1/12 per pair of towns in the cell; with one modifier and a joint: 1/432). A mount whose collision rate sits ABOVE the floor is a finding — a pool too thin for its cell's frequency, an authoring row, never a draw change; a mount AT the floor is the owner's sentence made exact. Beside it, A's trendline: the DUPLICATE-UNIT RATE (share of (position, text) pairs seen on more than one town) printed at M0 before any text moves and after every car, so the owner's staleness claim is a measured delta. The four index-paired list positions (conflicts, steadings, neighbours, engagements) draw the same variant for distinct instances today (`generalStateProse.js:1746-1937`); car 10 cures it with the per-instance key, owner-gated.

---

## §8 · THE AUTHORING PIPELINE

### 8.1 Writers

Opus workflows to the register card (`REGISTER-CARD.md`, read whole), one per register, every lane `model: "opus"` (owner 09-05: Fable chairs and criticises, Opus writes and finds). Each prompt carries verbatim: the card; Part B §1 and §16–§16.2; MOVE-GRAMMAR §1–§3; the block's annex section as it stands; the block's LICENCE CARDS (8.3); the owner's ~22:30 rule (the rewrite to the voice AND the three further wordings in ONE pass; NEVER TRIM); and **the exemplar-not-the-practical ruling bound as a stopping rule** (B; the brief's own law list): each wording set is shot for the ideal in the first or second attempt and not chased after — "no round past the second on any wording set" is a car acceptance (cars 8 and 9). A writer produces annex rows, never leaf bytes; a writer who cannot produce a lawful row writes a REFUSAL row with the measurement, which the chair reads at the sitting.

### 8.2 Tier table → authoring list (C's mechanical rule)

Each tier row becomes at most ONE list row: COVERED → REWRITE+FACES (role unchanged); THIN by grammar → REWRITE+FACES plus one or two new variants in a missing level-1 member (V2/V4/V5; V3/V6/V8 are NOT-EXECUTABLE or owner-gated); THIN by `{settlement}`-only where the bag offers more → a MODIFIER keyed on the unused fill; MISSING held fact → a MODIFIER pool per notable value class (2–3 values → 1–2 pools; a band of ≥ 4 → the two edge bands, never the middle); MISSING co-firing pair at or above the floor → the two MODIFIERS first, a TURN only with a registry id; unwired or UNRESOLVED → `NO-LIST-ROW: wiring first` (or, for the fifteen reservoir blocks in wave two, the ATTACH act of §2.9); declared dark → `NO-LIST-ROW: declared dark`. Order: MISSING at or above the floor by `rateBp` × departure, then THIN (the five blocks where the fill already arrives are the cheapest rows in the estate), COMPOSED-ONLY never. "Specificity rises everywhere" means everywhere a second typed fact exists, and nowhere else: 33 of 68 blocks license one level-1 member today (`SITTING-RULINGS-912.md` §K.5).

### 8.3 Licensing at authoring — the LICENCE CARD (C)

```
LICENCE (block DS-DEF-11 · role modifier · key `muster: short`)
  reads:      defenseProfile.economicGates.military   (absent when there is no paid stack — absence is NOT "fully funded")
  predicate:  present AND < 1
  bag:        {settlement: proper, defwork: bare-common (conditional: wall-class names only)}
  relation:   consequence   ← edge: milUpkeepMult degrades scores.military (defenseGenerator.js:189-191)
  seat/form:  clause / fragment      move: CONSEQUENCE (structural; R-DA-19: never an event)     angle: plain
  attach:     WALLED (Phase 2)       echo: the gate is said once on the defense tab, here
  may claim:  that the paid muster is short of its funding, as a STANDING fact
  may NOT:    a count, an office, an exemption, a date, a cause outside the edge, a treasury (none exists), a future, a standpoint
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons (whoIsCounted is open on every settlement forever); an exemption from a duty (whoIsExempt null everywhere)
```

The card is the machine-readable form of the annex's prose licence, derived from the census; the writer's row carries it back as typed lines so the projector can refuse a row that contradicts its card. The estate's three questions are asked on the card. A modifier whose surface names neither a slot nor a band word is not licensed — it is the summarising beat (arm Q; S14).

### 8.4 The gate — which walker gates which property, and what is new

Three of the four arms the brief names do not exist today; the licensing arm does and is per (block, pool) (`read-instruments §1.5`). None of the instruments exist in the product tree (CONFIRMED); the gate below can run in CI only after they LAND (car 5), and until then the wave's gate is a lane tool run by hand and its verdicts are receipts, not green.

| property | existing instrument | new or extended | channel |
|---|---|---|---|
| every piece licensed by a typed field (W1) | entry walker C2/C3/C4/C6 per piece, estate ground (`entryWalker.js:841`) | none; each piece is an entry | FAIL |
| a piece names only slots its (block, pool) bag fills | arm D (`entryWalker.js:730`) | the census row as input; the corrected resolver; the ATTACH site's bag for a reservoir pool (S5) | FAIL |
| `reads` ⊆ `tests`; the text claims every declared field and no other | none | **A0 the licence-reconciliation arm** (projector + walker) | FAIL at projection |
| B-CLAIM on every face; the four claim-equal | `check-pair.mjs` parent → face ×3 | **A6** with the LONGER arm (`check-pair.mjs:70`, CONFIRMED) SUPPRESSED for faces; `walkEntry` per face; a slot/mark byte-equality assertion | FAIL |
| the four faces are not four synonym-swaps | none | **A5 sibling distance** on the estate's own ruler; REPORT until the floor is measured, then FAIL | REPORT → FAIL |
| a modifier neither restates nor negates its spine | `armQualify` (`:767`), per sentence | **A1** (`typedFactsOf` overlap; C5 across pieces); the structural half at projection | FAIL |
| the connective carries exactly its relation, licensed | wall 1 only (`grammarWalker.js:363-368`) | **A2 connective typing** against the relation leaf; **A3 wall 5 as an arm** | FAIL / WITHHELD |
| ≤ 2 sentences, ≤ 1 joint, no which-tail (wall 6) | `armF` F6 (`:380-387`) over the composed text | the walked entry becomes the composed unit (S17); joints-per-unit printed | FAIL |
| walls 1, 3, 2 on the derived order | `armF` F1/F3/F2 | the composed order is DERIVED (spine tag ++ modifier moves), so no tag vocabulary change (S20) | FAIL |
| no non-move in any piece | `armG` (`:401`) | none | FAIL |
| a turn keyed on a typed explanation | none | **A8 the registry** (projector) | FAIL at projection |
| fragment / sentence form; no `{settlement}`-initial modifier face | none | **A9 fragment grammar** | FAIL at projection |
| salience deterministic; ties by the documented key | none | **A4** repeat-call identity; tie rate printed | FAIL / REPORT |
| the face count fixed at the freeze | the variant ratchet (`…contract.test.js:277-278`) counts variants | **a per-pool FACE-COUNT PIN** | FAIL |
| attach ≤ 3; the per-tab and per-page-set echo bounds; the position budget | none | **A11 echo** (projector + mount walker over the census's fact index); **A12 position** (desk test) | FAIL |
| the composed corpus keeps its exemplar shape | `armThreeNumbers` (`:433`) with bands and numbers as arguments | the walked unit at the ENTRY grain; bands stay outside the repo | FAIL past BUDGET/DEPTH; PERFECTION a finding |
| consecutive-pair statistics over a READING | B1/B2/B3, NOT-EXECUTABLE without sequences (`:710-715`) | the manifest run as the sequence generator; classified by `orderIdOf` (report at 0.75–0.83) or the derived order where tags exist | REPORT → FAIL |
| byte-identical dossier output before any text change | the generator golden master cannot see dossier text | **A7 the manifest** (§3.6) | FAIL on drift |
| exhaustive per piece, SAMPLED per composition | R-DA-20's SIZE is one figure | two figures, with N and the sample sha printed (S17) | FAIL |

Every new arm declares NOT-EXECUTABLE where its input is absent, never `[]`; every arm convicts a planted control and passes a clean one (the Brackwater idiom); the anti-vacuity guard gains a planted composition that manufactures a C2 duty+exemption pair from two innocent pieces.

### 8.5 Refuters, the chair, the beta

Refuters sample the composed 525-town run (never the pool dump): every WITHHELD unit (a report the refuter owes an answer on — `verdictOf`, `entryWalker.js:874`, CONFIRMED: WITHHELD is never a pass) plus a fixed random sample of PASS units; findings only, never a pass (fault 32). The chair rules each at a sitting; the ruling is written into the annex row or the list. **No blind DM panel** (owner 09-07 ~20:10; Part B §17 line 632): the pre-launch acceptance is the checkers at the freeze, the refuters by sample, and the owner's walk; the beta's readers are the panel and the tell a reader names is a beta feedback surface.

### 8.6 The same-seed TEXT shift — declared, sized, signed

THE PROMISE (W3): a FACT shift is forbidden; a TEXT shift is declared and owner-signed. This architecture produces exactly TWO declared text shifts, each proven by the manifest before it is signed, and no fact shift anywhere.

**Shift 1 — the REWRITE + FACES freeze.** Every variant rewritten to the voice and given three faces in one pass; the walls block's Phase-1 modifiers land with it. Two things move: the wording of every drawn variant (in place; length and key unchanged, so the semantic index does not move) and the face on a NEW suffix key (modulus 1 → 4; semantic variant preserved on 100.00 % of reads, face differs from face 0 on ≈ 75 % — CONFIRMED). The manifest prints, per changed cell, the spine's `(pool, index)` before and after; equal on every row is the proof it is wording-only. Signed once.

**Shift 2 — DS-DEF-11's Phase-2 re-key and the list-position keys.** The manifest classifies every moved cell ADDITIVE or REPLACED and names the REPLACED ones individually (walled + strained + measured family); the docblock's own veto invitation is the licence. The authoring wave's modifiers and turns are NEW keys and move no existing draw; their text changes are declared per block as ADDITIVE and owner-signed at the walk (Part B §15 line 614: every key's text is public copy).

---

## §9 · SURFACES BEYOND THE DOSSIER

| surface | register | composer today | shares the kernel? | what the model means there |
|---|---|---|---|---|
| **the dossier** (13 tabs, 56 mounts) | R1 archivist | six desks → kernel → `legibilityRung` → the mount registry → `DeskLines` | yes — this design | spines + modifiers + turns as §2–§6; walls 1–3, 5–7, 10 |
| **the DM page / DM face** | D-a…D-e | the same corpus at `audience: 'dm'`; `dmFieldProjection.js` keeps the DM's pen whole (eight framed blocks; the machine line renders BESIDE the field, never into it) | yes | the turn tier's natural home; `dm-only` pieces and covert turns attach on the DM face only, per PIECE; a composed unit is one `beside` string; ≤ 0.30 share, no run beyond two |
| **the NPC ladder** | R6 | `causeConjunctionContent.js` — the shipped four-rung ladder, its own `fnv1a32(seedId::key)` draw | no | UNCHANGED: it already selects the most specific authored cell, the degraded form of this design's turn rung; its `causeClass` vocabulary is the registry's tier-2 source |
| **the faction ladder** (`power.blocs`) | R1 | `powerLadderRung` per faction on a per-instance seed (`PowerTab.jsx:480`) | yes | each faction row a spine; modifiers from `deriveFactionProfile` (a canonical reader) — wave two; ceiling ≤ 0.07 lift-filtered |
| **news / the crier** | R5 | `newsVoice.js`, `newsBody.js` — event-keyed pools, canonical-at-zero | no | events ARE the spines; a STATE modifier in the head is REFUSED (H-1 the deed and one gesture; H-3 the bill apart from the deed); a state fragment in the card body is lawful in principle and deferred to the Herald's own program under the same connective law (H-10); the crier questions are the owner's (09-07 ~19:15) |
| **the chronicle** | R11/R12 | `discourseKernel.js` — relation-typed connectives over BYTE-VERBATIM headlines with a totality floor (`:151-190`) | no | this IS the composed model in the event register: events as spines, edges as connectives; no state modifiers (a verbatim headline admits no attached clause); shares the LAW, never the lexicon (the colon-bridge is the chronicle's) |
| **chrome and the docent** | R9/R16/R10 | product copy | no | REFUSED — the archivist is never on chrome (W9, CC-1) |
| **generation-time prose** (institution, history, origin) | — | `proseHash.pickVariant` at generation, persisted, golden-frozen | no | REFUSED — composing a persisted string is a FACT shift under every seed |
| **the public gallery dossier** | — | the paid gate at every caller (`DefenseTab.jsx:92`) draws nothing | — | unchanged: a free viewer sees no corpus prose |
| **the PDF** | — | no state prose reaches it (`read-facts §1`) | no | out of scope; the annex's 21 PDF PARITY lines are a list finding |
| **the causal register (R2)** | R2 | `causalDossierProse.js` — a complete reader, `drawVariant(eligible, familyId, arm, seed)`, zero callers | yes | the home of PROVENANCE-BEARING turns (S15); needs the join-deriver that does not exist — car 13, owner: wire or retire; no wording sets on R2 in wave one (six-exactly, `…contract.test.js:285`) |

---

## §10 · PERFORMANCE, SIZE, DELIVERY

**Where the bytes live.** The six state leaves (641,410 B) and the dark causal leaf (210,260 B) ride the `data-lazy-*` chunk (one such file in the dock's `dist/assets`, CONFIRMED; 939,520 B and unreferenced from `index.html` per `read-kernel §11`'s probe on a real variant string — a build artefact consistent with the tip, not rebuilt), routed there by `vite.config.js:876-878` (CONFIRMED: derived, not curated). The composer and the three new leaves are imported only by the desks, which are imported only by lazy tab components — zero first-paint bytes, pinned by the import-fence arm.

**Size after the model (ESTIMATE).** Nested faces add text plus array overhead, not a fourfold record copy: 3 × 280,577 B of sentence text (`read-data §6.4`) ≈ 842 KB; `poolMeta` ≈ 708 × 130 B ≈ 92 KB; ≈ 770 new pieces × 4 faces ≈ 630 KB; the three leaves ≈ 75 KB ⇒ **≈ 2.3 MB raw for the state register** (the brief's ≈ 2.5 MB is a fair bracket; a flat ×4 of records would be 2,156,509 B on its own). Gzip on prose JSON ≈ 4 : 1 ⇒ ≈ 0.6 MB over the wire, fetched with the first lazy tab.

**Ratchets that do not exist and must — built EARLY (car 2, before any composer byte; the one finding belonging to no design).** `scripts/.size-baseline.json` holds 19 per-file max-LINES rows and no prose leaf (CONFIRMED); `sizeBaseline.test.js` is a lines ratchet (CONFIRMED); `bundle-analyze.mjs` asserts nothing; no first-paint byte ratchet exists at the product tip. The brief carries first-paint RAW 1,042,122 of 1,048,000 (margin 5,878 B) from the L-MAT tip, which this design is fenced from and cites as a receipt. Car 2 lands: a byte row for each prose leaf and a gzipped row for the `data-lazy` chunk, moved only with a declared row; a first-paint byte gate at the ceiling with the margin printed (the number is the owner's, §13 row 16); a chunk-membership assertion that no `dossierStateProse` or composer module is reachable from an eager chunk.

**Render cost.** Generate 19–22 ms per town; compose ≈ 0.1 ms per town for the general desk (`read-instruments §4.3`; C's 21 ms over 200 towns). The composer adds ≤ 3 variant draws, ≤ 3 face draws, ≤ 2 connective draws, one integer ranking over ≤ 10 candidates and one tie-break hash per candidate — ESTIMATE under 2 ms per dossier over ~56 mounts. Most callers are un-memoised (`read-kernel` Q11); a `useMemo` per desk call is a housekeeping hunk if the manifest run shows a page-set above 5 ms.

**Build-time gates over the sample.** The manifest (525 towns × 2 audiences, ≈ 30 s ESTIMATE) runs as a property test; the composed walk samples it; the occurrence census and the reading sequences come from the same run.

---

## §11 · RISKS AND REFUSALS

| risk | what goes wrong | the guard |
|---|---|---|
| **explosion arithmetic gone wrong** — a writer authors a modifier per spine, a turn per pair, or a fifth conjunction cell | the corpus goes exponential by the back door | the list is the only door; one `READS:` path per modifier; `attach ≤ 3`; the fact budget; the superset finding WITHHELD to the chair after the wave (§2.8); the census prints pieces per field |
| **contradiction between pieces** — a spine and a modifier band one noun differently; a composed C2 pair; a standpoint switch inside one unit | a sentence no piece would have said | the structural `tests` guard at projection; A1; C5 across the page-set; `plain` fragments; the composed anti-vacuity control; the sampled composed walk with N and sha printed — and the honest statement that a sample is a sample |
| **the flatten** (the brief's default) | 54.79 % of reads change angle under a "wording-only" signature | refused by measurement; the two-level roll (§2.6) |
| **eligibility drift within a wording set** | one-in-four becomes one-in-three on some towns | nested `wordings` (structural); A6 asserts one slot set and one mark set per variant |
| **appending after the freeze** | every world's face re-rolls for that pool, each time | the face-count pin; "a new wording goes in a new key" |
| **a modifier reads a default as a measurement** (`economicGates.military` absent; `defenseProfile.institutions` stale) | "fully funded" printed on a town with no paid stack; a ruined citadel described as walls | the `absent` column on every path; candidate functions read the live roster; absence is no-candidate |
| **the covert seam** — a public spine joined to a covert fragment | a player page hints | the audience check per piece before the draw; a covert turn falls to the public composition; the manifest's player face recorded and diffed; the 12 mixed pools pinned |
| **the golden master** cannot see dossier text | a wave that rewrote every sentence leaves 525 hashes untouched and reads as "no change" | car 1's manifest; its header carries the shift record even when the generator golden does not move (the T13 precedent) |
| **the instruments' blind spots** — the classifier at 0.75–0.83; arms B need sequences no generator produces; the bag resolver's first-declaration bug; the receipt's 177-noun lexicon (166 distinct); arm A NOT-EXECUTABLE at n ≤ 2 on 33 blocks; `check-pair.mjs` in a scratchpad, copied by hand | a green that is not a verdict | arm A gates on tags only (every new piece is born tagged); sequences from the manifest run; the resolver corrected in car 0; the 166 denominator printed; `check-pair`'s definitions land with the instruments (car 5) so one ruler exists |
| **the render-time substrate's cost** (546,887 B) | a turn key pulls half a megabyte into a tab | tier-2 keys REFUSED until the persisted digest (§13 row 10); tier-1b/1c closures measured before use |
| **uniform composition** — "always two" | the SPREAD arm fires on the whole register (S18) | seats by data and by draw; the modifier count varies 0/1/2 |
| **the norm leaf moves under a world** | a re-measurement re-orders modifiers on installed worlds | a generated leaf, `--check`-pinned, changed only in a declared car; §13 row 6 |
| **the composed unit's figures quoted from pool dumps** (S13) | pre-composition figures cited as composed ones | the sitting re-anchors provisionally on the taste's units; car 12 re-measures over composed sequences before any consecutive-pair figure is quoted |
| **the seedless page** (`galleryImportSettlement.js:67` nulls `_seed`; no `id` ⇒ `''` ⇒ index 0 everywhere) | every such town reads the same canonical composition | not this design's to cure; recorded; the manifest records the seedless face as a control |
| **the fifteen unwired blocks (448 variants)** | authored prose no reader meets | census rows; the reservoir act in wave two (§2.9); never a design assumption |

**Refusals, each with its reason:** no LLM at render (THE PROMISE; finite semantics); no per-combination authoring below the floor (the owner's own danger); no fact change under any seed (W3); no draw-time filter, weight or refusal (CLERK-LAWS §2.5, R-DA-20, S7); no ABSENCE-move modifier (R-DA-08; the LACK class undemonstrable); no HISTORY-move modifier or historical turn on a state spine (R-DA-19; S15); no guard-alignment field (none exists; a persisted shape is the owner's); no tier-2 turn keys at the dossier (the import wall); no render-time cross-desk echo coordination (ARM 2); no cross-block modifier in wave one, and in wave two only by the reservoir act with its four guards (C3; S6); no wording sets on the causal register in wave one (six-exactly); no reuse of the chronicle's connectives (register scope); no Herald state modifier in the head (H-1/H-3); no composition on chrome, the crier's head, or generation-time prose (W9; the fact-shift law); no `which`, no em dash, no third sentence in a unit (wall 6; B-DASH; R-DA-03); no `consequence` or `tension` without a table row (the causal annex's law; A2); no `{band}` fill (RESERVED, six roles in one name); no modifier on a WIRING-UNRESOLVED pool (§3.5; the §908 law); no walker in the product import graph (THE PROMISE's fence on the lexicons); no faces on the nine bound rows; no weighting of any draw (the withdrawn rhythm-aware draw).

---

## §12 · THE IMPLEMENTATION SEQUENCE

Every car lands on the product branch in a dock, in order, `model: "opus"`, four build lanes at most, one implementation lane at a time; the chair rules; a car that cannot meet its acceptance lands as a measured refusal, never a partial. "Doors" names the register doors a car moves. Every car that moves text declares its shift in the manifest header.

| # | car | builds | files (product tree unless marked) | proof (executed) | doors | acceptance | decides |
|---|---|---|---|---|---|---|---|
| **0** | **the wiring census** (INSTR car 8, extended) | `(block, pool) → {predicate, tests, reads, absent, bag, sites, rateBp, status, tier}` both ways; co-occurrence by execution over the golden's 525 grid through the shipped composers with real readings; the nearest-in-scope resolver; the `fact → asModifier` index on producer tokens; the relation extraction from sources (a)–(c); the norm figures | `skepINSTR: src/domain/prose/wiringCensus.js`, `tests/lint/proseWiringCensus.walker.test.js`, `tests/helpers/dossierComposedFill.js` (extend); `scripts/wiring-census.mjs` → `docs/content/wiring-census.json` (sha-stamped) | totality = 708 as an integer; the brief's five controls fire; anti-vacuity; the three "twenty" censuses printed side by side; DS-DEF-4/-9/-11 and DS-POW-1 bags corrected | lighting census; mutation-coverage manifest | RESOLVED + UNRESOLVED = 708; `noBag` = `UNMOUNTED_BLOCKS` (15); UNRESOLVED count pinned shrink-only | chair |
| **1** | **the composed-prose manifest** (A7) | the golden's 525-row corpus builder × six composers × two audiences → a sha per seed over `(mount, block, pool, index, face, angle, pieces[], text)` in `DOSSIER_MOUNTS` order; `UPDATE_MANIFEST=1` through `goldenRecordDoor.js`; the five-step shift discipline; the reading-sequence export; the duplicate-unit baseline | `tests/property/dossierProseManifest.test.js`, `tests/fixtures/dossier-prose-manifest.json`, `tests/helpers/dossierManifest.js` (a readings-bag builder shared with the census) | base-side totality (525 recorded; re-run drift `[]` three times); the comparator can see (plant one variant text edit, exactly its cells move, restore); the two audiences differ ONLY on the 12 mixed pools' cells, the count pinned; the seedless control | mutation-coverage manifest | zero drift; the plant convicts; cost ≤ 30 s (ESTIMATE) | chair (N: §13 row 14) |
| **2** | **the byte ratchets** | a byte row per prose leaf and a gzipped row for the `data-lazy` chunk; the first-paint byte gate; chunk membership | `scripts/.size-baseline.json` (a byte row, new kind), `tests/lint/sizeBaseline.test.js`, `tests/lint/firstPaintBytes.test.js` (new), `vendorPdfLazy.test.js` (extend) | a planted 1 KB in a leaf reds; a planted eager import reds; the ratchet moves only with a declared row | size baseline | ceilings pinned at today's bytes; the first-paint margin printed | chair (the ceiling: §13 row 16) |
| **3** | **M1 — the composer path, byte-identical** | `drawFace` with the no-hash short-circuit; `composeStateProse.js`; `provenance.pieces`; `drawnAtMount` strips it; the six desks route spines through the composer with empty candidate lists; the `DeskLines` key cure; the import-fence arm | `stateProseKernel.js`, `composeStateProse.js` (new), `legibilityRung.js`, `dossierMounts.js`, the six `*StateProse.js`, `EconomicsGlance.jsx:162`, `WarFaithDesk.jsx:122`, `tests/domain/stateProseKernel.test.js` (+ a composer test) | the six leaves sha-identical (zero corpus bytes); the manifest byte-identical on 525 × 2; a one-face variant provably never hashes; a planted four-face variant draws face 0 seedless and 25 % ± 2 SE per face over 10,000 seeds; a planted eager import reds | none | manifest drift `[]`; zero corpus bytes | chair |
| **4** | **M2 — the schema, added keys only** | the annex lines of §2.5; the parser branches, drop-check and tag routing; `poolMeta` emitted from the census (`role: spine`, `tests`, `reads`, `predicate`) for every pool; the three leaves with floors only; the contract-test arms (roles; reads ⊆ tests; face slot/mark identity; the face pin at 1; fragment form; attach ≤ 3; no `which`/dash); the sha interlock; the 68 STATE-KEY transcriptions | `scripts/generate-dossier-state-prose.mjs`, `RECEIPT_POOLS_DOSSIER_STATE.md` (READS/PREDICATE rows; no sentence touched), the six leaves, the three new leaves, `dossierStateProseProjection.contract.test.js` | `--check` green; a key-by-key leaf diff: `0 ADDED / 0 REMOVED / 0 CHANGED pools`, only `poolMeta` keys added; the manifest byte-identical; each new arm convicted by a plant | projection contract (variant ratchet unchanged at 2,266; the face pin born at 1); lighting census | 68 blocks carry reconciled `READS`; zero text change | chair (the leaf shape: §13 row 20) |
| **5** | **the instruments LAND + the new arms** | INSTR-912's `src/domain/prose/*` and walker tests land in the product tree under their own ritual; then A0–A6, A8, A9, A11, A12; `composedWalker.js`; `check-pair` lands in `scripts/` with its LONGER arm switchable; the composed anti-vacuity control | `src/domain/prose/{entryWalker,grammarWalker,moveGrammar,composedWalker}.js`, `tests/lint/*.walker.test.js`, fixtures, `scripts/check-pair.mjs` | each arm convicts a plant and passes a clean control; every arm NOT-EXECUTABLE where its input is absent; the composed walk runs over the manifest's 525 towns and prints N and the sha | lighting census; mutation-coverage manifest | anti-vacuity on every arm | chair; **§13 row 17** (the landing) |
| **6** | **the TASTE — DS-DEF-11 Phase 1, in a dock, not landed** | the three modifier pools of §6.3 and DS-DEF-2's two `stores:*` pools as wording sets; candidate functions in the key-function idiom; the `corruption.js` closure measured; the connective set drafted to the register card (≥ 3 per relation per seat); the norm rows for the new pools; composed over the 525 grid on both audiences; walked; the manifest diff classified ADDITIVE | dock only: the annex, `defenseStateProse.js`, the leaves | the composed walk over the affected towns: zero FAIL, every WITHHELD listed; A1–A4, A9, A11 exercised on real pieces; the fragment-length and tie-rate figures printed; the closure figure printed against the 293,079 B precedent | none (a dock artefact) | the taste and its figures exist for the sitting; nothing on the product branch moves | chair; the owner sees it |
| **7** | **the SITTING — amendments before any text moves** | the unit law re-anchored on the taste's composed units (S1; a COMPOSED-UNIT row in §16.2 at the ENTRY numbers, provisional); R-DA-03 + wall 6 read as "two sentences, one joint" (S2); arm J's spec as the relation triple (S3); R-DA-20's SIZE as two figures (S17); the connective set with bands ratified (S12); the relation table's source (d) axis pairs ratified; `plain` added to §0b for `role: modifier`; the ABSENCE ruling; the exemplar-not-the-practical stopping rule bound to cars 8–9; the `{reason}` vocabulary and every §13 number put to the owner | `RULES-V2-PART-B.md` (append-only), `MOVE-GRAMMAR.md`, `CLERK-LAWS.md`; the ledger | every strain S1–S20 of `read-specs §9` has a written, numbered, vetoable disposition | ledger § | the rulings written; the owner's answers to §13 recorded | chair rules; owner signs the numbers |
| **8** | **the REWRITE + FACES wave** (register by register as Opus workflows) | every one of the 708 pools: k variants rewritten to the voice AND given three faces AND their `[grammar: Vn]`, `READS`/`ROLE` lines, in one pass; THIN pools gain a second grammar; the nine bound rows keep one face; the walls taste and the `stores:*` pools land with their blocks | the annex; the leaves regenerated; `defenseStateProse.js` (the candidate functions) | per pool: `check-pair` parent → face ×3 with LONGER suppressed; `walkEntry` per face; A5/A6; arm A on tagged rows; the manifest diff: semantic `(pool, index)` preserved on 100 % of cells, face moved on ≈ 75 %, the walls/stores cells ADDITIVE; SPREAD/PERFECTION per pool; the duplicate-unit rate before/after | the variant ratchet re-pinned (semantic count unchanged; the face pin 1 → 4 per pool); size rows | zero FAIL; every WITHHELD ruled; no round past the second on any wording set; **Shift 1 signed** on the manifest diff | **owner-gated** |
| **9** | **the AUTHORING wave** (block by block from the list) | modifiers for every MISSING/THIN row as wording sets; candidate functions per desk; bag lines named by the census; the norm leaf gains the new pools' rows; the reservoir ATTACH acts where the census admits them (§2.9, after §13 row 18) | the annex; the leaves; the desks; `generalDeskRead.js` (`economicGates` in the bag) | per block: the manifest diff proves ADDITIVE; the sampled composed walk; the repeat census against the chance floor; A11/A12 on the census's fact index; no round past the second | lighting census per landing; the variant ratchet up; the norm leaf (declared row) | zero FAIL; WITHHELD ruled; the block's tier rows discharged and re-printed by car 0's command | chair per block once the class is signed; the text owner-signed at the walk |
| **10** | **DS-DEF-11 Phase 2 + the list-position keys** | the three-spine re-key with `muster: short` and `country: pressed` as modifiers; the eight WALLED-* variants re-voiced into faces; a `WALLED` spine; `::${instanceId}` on the four index-paired positions | `defenseStateProse.js`, `generalStateProse.js`, `generalDeskRead.js`, the annex, the leaves | the manifest names every REPLACED cell and every moved list row; the composed walk over those towns | lighting census | the REPLACED list finite and printed; nothing trimmed; **Shift 2 signed** | **owner-gated** (§13 rows 4, 19) |
| **11** | **TURNS** | `TURN_KEY_REGISTRY` tiers 1a–1c (closures measured); "the gate is sold"; condition turns on DS-CND-1's spines; the `{reason}` vocabulary if ruled (lights three pools with no desk change) | the generator's registry, the desks that read stamps, the annex | A8 refuses a planted conjunction-keyed turn; each turn's cell ≥ the floor on the grid; the audience arm on covert turns | lighting census | turns only where evidenced and above the floor | chair; owner for `{reason}` (§13 row 9) |
| **12** | **the RE-MEASURE** (S13) | reading sequences over composed units from the manifest; arms B1–B3 executable; every consecutive-pair figure re-quoted; the §16.2 composed-unit row confirmed or moved | `grammarWalker.js` callers; the manifest run; `RULES-V2-PART-B.md` | B1–B3 report over 525 with n and ceilings printed | walker tests | every quoted consecutive-pair number is a composed-unit number | chair; the row's numbers the owner's |
| **13** | **the causal register (R2)** — a separate lane | a join-deriver `causes[]`/`sourceEventId` → `{familyId, arm, slots}`; provenance-bearing turns; `causalDossierProse.js` gains a caller | new deriver; the callers | 468 sentences reach a reader; arm-required-no-default preserved | projection contract (six-exactly, §13 row 13) | — | **owner**: wire or retire |
| **14** | **the persisted cause digest** (tier-2 turn keys) | `settlement.causeDigest = {present: string[]}` from `presentCauseClasses`, written by the generator and the pulse | schema, generator, pulse kernel, the golden master | golden re-record by the five-step discipline; the digest equals the render-time derivation on 525 towns | golden master; schema | — | **owner-gated**; deferred until asked (§13 row 10) |
| — | **the WALK** | the owner reads the three worked blocks on real towns, then the register | — | — | — | signatures | **owner** |

**Order and gating, in one line:** 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 (Shift 1 signed) → 9 → 10 (Shift 2 signed) → 11 → 12 → the walk; 13 and 14 wait for the owner's word. Cars 0–7 move no reader-facing byte on the product branch; car 3 is proven byte-identical by an instrument that exists only because car 1 built it; the ratchets exist before the corpus grows.

**Deferred and recorded, not dropped:** the guard-alignment field (§13 row 11); the `{band}` split (row 12); `compromisedSecurityInstitutions` feeding `law_order` (row 19); faces on R2 (row 13); a `useMemo` per desk caller (housekeeping); the Herald's body-state fragment (the owner's crier questions).

---

## §13 · OWNER ROWS — every decision that is the owner's, stated plainly

1. **Shift 1 — the rewrite + faces freeze.** Sign one same-seed TEXT shift over all 708 pools, proven wording-only by the manifest (the semantic index preserved on 100 % of cells; measured on today's leaves at 141,600 reads). This reverses the standing landing pattern (new blocks only) for the first time.
2. **The roll shape.** The two-level roll (variant on today's key, face on a suffix key), not the brief's flatten, because the flatten changes which angle speaks on 54.79 % of reads. Veto returns the flatten and forfeits the wording-only proof.
3. **Four faces per piece, fixed at the freeze, forever.** A later fifth wording goes in a new key; veto means every later wording re-rolls every world's face for that pool, each time.
4. **Shift 2 — DS-DEF-11's Phase-2 re-key and the list-position keys.** Sign at the walk on the manifest's ADDITIVE/REPLACED classification; the docblock's invitation ("Say 'veto' to reorder") is taken; Phase 2 is the shape under which your own three-fact wall sentence is lawful.
5. **The numbers to veto:** the occurrence floor 5 % (≥ 27 of 525); the departure line 10 %; the change window one season; unit salience weights (the band is the count of signals); ≤ 2 modifiers, ≤ 2 sentences, ≤ 3 facts, ≤ 1 joint; attach ≤ 3; echo ≤ 1 mount per tab and ≤ 3 per page-set; the position budget of 2; fragments ≤ 12 words; ≥ 3 phrases per relation per seat.
6. **The norm leaf is a seed input** from the day it ships: a re-measurement re-orders modifiers on installed worlds; it changes only in a declared car.
7. **The sibling-distance floor** is set by measurement on the first two desks' wording sets before it gates; you see the number and the four faces it would refuse.
8. **The composed unit's BUDGET and DEPTH** take the ENTRY numbers (2/3 and 1.75 band-widths, PROVISIONAL on one author) until the seven raw exemplar texts are re-obtained — the owner's on cost and IP.
9. **The `{reason}` vocabulary:** `CAUSE_LABEL_OF`'s fourteen noun phrases as the fill that lights three routed-silent pools with no desk change; reader-facing words, yours to sign or replace.
10. **A persisted cause digest (car 14)** — a persisted-shape change and a seed input; deferred until you ask. Without it, turns key on persisted conditions and the two corruption reads only.
11. **No guard-alignment axis exists**; the design refuses to mint one and uses `criminalCaptureState` and the compromised set as the "dark guard" proxies. If you want a real moral axis on an institution, that is a persisted shape and its own lane.
12. **`{band}` stays RESERVED**; splitting it into six named slots would recover authored prose dropped on seven blocks — an annex act and a declared shift, deferred and listed.
13. **The causal register (R2):** 468 authored sentences, a reader, no caller — wire (car 13) or retire; no wording sets on R2 in wave one (the six-exactly arm stands).
14. **The manifest's N** is the golden's 525-row grid on both audiences; a smaller purpose-built set trades proof breadth for run time.
15. **`plain` joins the angle palette** for `role: modifier` rows only — a §0b amendment you see at the sitting.
16. **The first-paint byte ceiling** (1,048,000; the 5,878 B margin is a receipt from the L-MAT tip until re-measured at a tip this design can read); the prose corpus grows from 641 KB to ≈ 2.3 MB raw inside the lazy chunk and must stay there.
17. **The instruments land in the product tree** (car 5) — today they exist only in `skepINSTR`.
18. **The reservoir ATTACH acts** (wave two): the fifteen unmounted blocks' 448 variants admitted as sentence-form `plain` modifiers by explicit annex acts under four guards, licensed by the attach site's bag, `UNMOUNTED_BLOCKS` untouched.
19. **`compromisedSecurityInstitutions` feeding `law_order`** — the obvious missing edge (`read-explanations §6.3`); a same-seed BEHAVIOUR shift on every world with a corrupt watch. Sign or refuse.
20. **The leaf shape grows** (`poolMeta`, `wordings`, `grammar`, `form`; three new leaves) — a projection shape, not a settlement shape; no persisted settlement field changes anywhere in this design except cars 13–14, which wait for you.
21. **The connectives' copy and every composed surface's text** are public copy and are signed at the walk.

---

## §14 · A LAYMAN'S SUMMARY (for the owner)

Today every sentence on a town's page comes from a small hand-written set tied to one fact. When two facts matter at once, someone had to write a separate sentence for that exact pair, so the writing multiplies without end.

This plan stops writing pairs. Writers write pieces: one main sentence for the main fact (the wall stands), and short add-ons for side facts (the guards' pay is short; the watch is bought; the stores are low), each tied to one thing the engine tracks. The page assembles them: the main sentence, plus the one or two side facts most worth noticing for this town, joined by a connecting word that says how they relate, only where the engine's own rules say they do. A sentence never carries more than three facts; a fourth waits for its own place on the page. A hand-written line for a named situation (a bought watch on a good wall) is allowed only where that situation is common enough to earn it.

Every piece is also written four ways in the house voice, and the town's seed rolls a fair four-sided die to pick one. Same seed, same words, forever. Two towns read the same sentence only when they share the situation and the die.

Before anything changes, a new test records every sentence on 525 sample towns to prove the plumbing moved nothing. The rewrite and the four wordings then land as one signed change, wording only and measured. New pieces are added block by block, checked by the rule-checkers that guard the voice plus new ones built for the joins.

Your decisions are in section 13: the one signed wording change, four wordings fixed forever, the rarity floor for hand-written lines, and the numbers you can veto.

---

## APPENDIX A · Where the designs disagreed — the rulings, one sentence each

| question | A | B | C | ruled | why |
|---|---|---|---|---|---|
| the wording roll | two-level | two-level | two-level | two-level | measured: 100 % vs 45.21 % semantic preservation |
| the migration cars | M1 + M2 | one kernel car + a migration car | one bundled car | A's split | each half provable alone |
| the manifest's N | 200 purpose-built | open | the golden's 525 grid × 2 audiences | C | one corpus builder; the audience-modulus control on 12 mixed pools |
| delivering the walls | Phase 1 additive; re-key optional | re-key in the migration car | re-key in car 6 | A first, C's re-key as owner Phase 2, in A's three-spine shape | zero REPLACED cells first; the three-spine shape is the only one where the owner's triple is lawful under the fact budget |
| the fact bound | `k ≤ 3 − |reads|` | none | none | A, on the DECLARED reads bounded by the census's `tests` | the brief's "never four" made structural |
| the seats | capacity by sentence count | seat bound to relation; form authored for the seat | capacity + `!spineHasJoint` | B's binding + C's capacity | W-O1 by construction; no piece bent to fit; the count varies by data and draw |
| the joint's sentence | the final one | the spine's sentence | sentence one | the final one | the derived order is literally spine ++ moves; the unit closes on the standing cost (W-O7) |
| salience | weights 3/2/1, bands baked | 4·2·1 in the desk | two bands, seeded within | signal COUNT as the band, seeded within; read off the norm leaf, never derived in the desk | both halves of the brief's SALIENCE bound by construction; the desk derives nothing |
| the echo rule | static per tab, `attach ≤ 3` | manifest walker, echo budget 1 | render-time first-mount-wins | A's static bounds plus a page-set ceiling; the position budget within one desk call | no cross-desk coordination at render (ARM 2) |
| the norm | occurrence bands in `poolMeta` | its own leaf, a seed input | `rateBp` in `poolMeta` | B's leaf | its own regeneration door and owner row |
| ABSENCE modifiers | excluded by attach table | excluded by move filter | struck from the vocabulary | C | a class that cannot exist cannot be adjacent to itself |
| the modifier's angle | silent | silent | `plain` | C, for both forms | a standpoint inside another standpoint's sentence is the sibling-coherence class |
| the reservoir | ATTACH act, three guards | refused | refused in wave one | A as a named wave-two owner row, four guards | recovers a fifth of the corpus lawfully; the fourth guard keeps eligibility off the seed |
| wall 10 across the join | absent | a seat exclusion by tag | absent | an authoring/projector rule on modifier faces | so no seat rule ever reads a drawn face |
| the byte ratchets | car C1b (early) | car C10 (late) | car 8 (beside the waves) | car 2, before any composer byte | the only instrument between a 2.3 MB corpus and a 5,878 B margin |
| the sitting | none | none | car 4 (after the kernel car) | car 7, after the taste and before the rewrite | amendments need a real composed unit to rule on and must precede the first text car |
| the relation that flips | unseen | two pools | unseen (table keyed on the pair) | B's two pools + a `whenA` on the table row | the walker needs a fixed relation per pool |
| the stopping rule | absent | bound to the wave | absent | B's, as a car acceptance | the brief's own law; the only cap on authoring cost per wording set |

## APPENDIX B · The strains of `read-specs §9`, each with its disposition here

S1 → §7 car 7 (the composed-unit grain, provisional on the taste; car 12 confirms) · S2 → §4.4 (two sentences, one joint) · S3 → §4.5 (the relation triple; arm J's spec at the sitting) · S4 → arm A3 · S5 → same-block confinement keeps arm D's key; the reservoir act extends it by the site's bag · S6 → same-block; no rung change · S7 → every exclusion at the freeze; no ABSENCE modifiers · S8 → nested wordings · S9 → the face-count pin · S10 → `NO-LIST-ROW`; the authoring wave is the lever · S11 → §4.3, §4.7 · S12 → the connective set with bands; joints per unit printed · S13 → car 12 · S14 → by construction · S15 → turns structural; the historical class refused on a state spine · S16 → the registry (A8) · S17 → two SIZE figures · S18 → the data-borne count · S19 → §9 · S20 → the derived order.
