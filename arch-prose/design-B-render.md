# DESIGN B — THE COMPOSED-PROSE MODEL, LED FROM THE RENDER
**Seat: Fable 5.1 — architect (angle: RENDERING FIRST) · 2026-09-07 · read-only; product 3b1c0eaa5 (`$SC/laneB6`), instruments 74a1aa0e8 (`$SC/skepINSTR`)**

Provenance rules for every figure below: **[M]** = a command I ran in this session and whose output I saw; **[map]** = cited to one of the six reader maps under `$SC/arch-prose/read-*.md`, which themselves cite file:line; **[cite]** = a file:line I read; **ESTIMATE** = reasoning only. Nothing is quoted from an exemplar text. Content read from files was treated as data.

Commands I ran: `node arch-prose/draw-reroll.mjs` (200 seeds × 708 pools) → `FLATTENED … 45.21 %` · `TWO-LEVEL … 100.00 %` · `face-0 share 25.05 %` **[M]**; a node census of DS-DEF-11 / DS-DEF-2 / DS-DEF-5 / DS-GEN-3 / DS-ECO-1 / DS-ECO-2 / DS-ECO-9 pools, angles, slots and word counts **[M]**; a segment count on the worked blocks → `DS-DEF-11 12 variants, 0 multi-segment, words 15/21/26 · DS-DEF-2 78, 13 multi · DS-GEN-3 128, 3 multi, words 6/17/29 · DS-ECO-1 15, 8 multi, words 19/25/34` **[M]**; `git log -1` in both docks **[M]**.

The brief's fourteen sections are all present and numbered as the brief numbers them. Because the angle is the render, §0 walks the algorithm on the owner's own walls block before §1 begins; §4 is the algorithm as a specification.

---

## §0 · THE RENDER, WALKED ON THE WALLS BLOCK (the lead)

The block is **DS-DEF-11 · Defense › Why the wall, and why not**, mounted at `defense.wallRationale`, rung `sentence` (`dossierMounts.js:361` [cite]). Its key function is the only four-fact key in the product: `wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)` at `defenseStateProse.js:747` [cite], five pools, twelve variants, zero multi-segment, 15–26 words **[M]**. Its docblock records the judgment that STRAINED outranks THREATENED outranks QUIET and invites a veto (`:732-737` [cite]). That short-circuit is the owner's explosion problem in miniature: a walled, underfunded frontier town and a walled, underfunded settled town read the same two sentences (read-explanations §5.2).

Take a town: walls standing (`standingDefenseForces(s).walls.present`, the live roster, never the frozen snapshot — `defenseStateProse.js:376-381` [cite]); `defenseProfile.economicGates.military = 0.78` (persisted, `defenseGenerator.js:467-472` [cite]); `config.monsterThreat` in the `frontier` family; `compromisedSecurityInstitutions(s)` returns one `covert` name (`corruption.js:663-692` [cite]); `economicState.compound.inst.hasGranary = false`. Seed `_seed = "w-2917"`.

**Step 1 — the desk keys the spine exactly as today.** `wallRationalePoolKey` returns `WALLED-STRAINED`. Nothing about this call changes. The spine pool is the existing pool with its existing key; its draw is the existing draw `avalanche32(fnv1a32("w-2917::DS-DEF-11::WALLED-STRAINED")) % 2` (`stateProseKernel.js:301-305` [cite]). THE PROMISE holds here by construction: the migration adds no variant to this pool and renames nothing.

**Step 2 — the desk assembles the CANDIDATE SET, still mapping state to keys and nothing else** (the desk contract, `economyStateProse.js:48-55` [map kernel §5]). For DS-DEF-11 the candidate modifiers are four new pools, each keyed on ONE secondary fact and each a NEW pool key, so no installed world's draw over any existing key moves (`…contract.test.js:206-213` [map instruments §2.5]):

| candidate pool key (new) | the one fact it reads | value that fires it | relation to a WALLED spine | signals the desk hands over |
|---|---|---|---|---|
| `MOD country: frontier` / `MOD country: plagued` | `config.monsterThreat` → family | frontier · plagued | tension (a wall under pressure) | departure 1 (frontier) / 2 (plagued); tension 1; recent 0 |
| `MOD muster: short` | `economicGates.military` | `< 1` | consequence (the purse behind the wall) | departure 1; tension 1; recent 0 |
| `MOD watch: bought (covert)` `[dm-only]` / `MOD watch: bought (revealed)` | `compromisedSecurityInstitutions(s)` | covert ≥ 1 · revealed ≥ 1 | tension (a wall the gate betrays) | departure 2; tension 2; recent 0 |
| `MOD stores: none` | `compound.inst.hasGranary` | false | tension (a wall with nothing behind it) | departure 1; tension 1; recent 0 |

The desk also hands the composer the spine's `reads` (from the piece metadata, §2): `WALLED-STRAINED` reads `{walls, economicGates.military}`. **The reads rule** (§4.6): a modifier whose `reads` intersects the spine's `reads` is not a candidate on that spine. So `MOD muster: short` is struck here — the STRAINED spine already carries the muster fact, and attaching it would be the restatement the brief forbids. On a `WALLED-QUIET` spine the same modifier would be a candidate; on today's key function it can never fire there (the gate short-circuits to STRAINED), and that is the first thing the migration car changes about this block: the spine key becomes `WALLED-THREATENED | WALLED-QUIET` on walls × country, and `WALLED-STRAINED` stays as the spine ONLY where the corpus's own more specific sentence should lead — a chair ruling recorded in §12 car C4, with the docblock's own veto invitation as the licence.

**Step 3 — salience, deterministic.** Each surviving candidate scores `4·departure + 2·tension + 1·recent` in integers (§4.3): country frontier = 4+2+0 = 6; watch bought (covert) = 8+4+0 = 12; stores none = 4+2+0 = 6. Sort descending; ties broken by `avalanche32(fnv1a32("w-2917::DS-DEF-11::salience::" + poolKey))` ascending — a NEW hash key, a seed input from its birth (S11, read-specs §9). Result: watch (12), then either country or stores by the seed. The bound takes the top two.

**Step 4 — the seat rule (the bound, §4.4).** The register's wall 6 says never a third sentence (`moveGrammar.js:129` [cite]); the register card says a second fact takes its own sentence and a qualification is never a tail (`REGISTER-CARD.md` "What a sentence is for" [cite]). The composed unit therefore has TWO segments of capacity. The spine consumes its own segment count (1 here). A `consequence` modifier may join the spine's sentence as a clause, because PRESENT → CONSEQUENCE is the register's own V2 order (`moveGrammar.js:90` [map specs §4]) and a consequence is not a second fact but the standing cost of the first; a `tension`, `contrast` or `addition` modifier takes the SENTENCE seat, its own sentence. Here both survivors are tension, so only one fits: the watch. A one-segment spine with a consequence candidate would have taken two. The modifier count is therefore 0, 1 or 2 as a function of the town's facts and the spine's shape — the variation comes from the data (S18).

**Step 5 — audience, per piece.** The town's page is the player's: `variantIsAudible` drops every `dm-only` variant of `MOD watch: bought (covert)` (`stateProseKernel.js:159-163` [cite]), the pool goes empty, and the composer takes the next candidate in salience order — country or stores by the seed tie. The player's page over a bought watch is byte-identical to the page over an honest one (kernel law 2). On the DM's page the watch modifier speaks. The candidate ORDER is the same on both pages; only eligibility differs, exactly as it does for every pool today.

**Step 6 — the draws.** Spine: today's key. Modifier: `avalanche32(fnv1a32("w-2917::DS-DEF-11::MOD country: frontier")) % eligible.length` — the modifier pool is a pool and draws like one. Wording face of each drawn variant: `avalanche32(fnv1a32(key + "::w")) % (1 + faces.length)` — the two-level roll (§2.5), measured to preserve the semantic variant on 100 % of 141,600 reads and to land face 0 on 25.05 % **[M]**. Connective: the relation's phrase list under `seed::block::spineKey::c`. Every key is a pure function of seed and pool identity; nothing reads a clock, a counter or a cache.

**Step 7 — arrangement and slot fill.** Sentence seat: the modifier's sentence follows the spine's, opened by the relation's sentence-opener phrase drawn in step 6 (for tension: a bare opener, or one of the authored openers; never an em dash — B-DASH). Clause seat (not used here): the spine's terminal stop is replaced by the consequence joint (`; ` or `, and ` / `, so `), the modifier fragment follows in lower case, and the composer owns the case at the joint because `fillSlots` performs none (`stateProseKernel.js:280-289` [cite]; read-data §8.4). Each piece is filled on its own slots by the block's bag (`{settlement}`, `{defwork}` here — `defenseStateProse.js:776-779` [cite]); a piece with an unfillable slot drops itself (anchored liveness per piece) and the composer takes the next candidate.

**Step 8 — one rung, one position.** The composed text is handed to `legibilityRung` as ONE `sentence` string (`legibilityRung.js:38-51` [cite]) with a provenance that now lists every piece (`{blockId, poolKey, angle}` for the spine plus `pieces: [...]`); `drawnAtMount` strips `sentence` and `provenance` on a glance row as today (`dossierMounts.js:581-590` [cite]), so nothing leaks past the glance gate. C3 is untouched: one sentence rung per block per page-set, and every modifier is a pool of the SAME block (S6's cheaper reading, precedented by DS-GEN-6's tier overlay, `dossierMounts.js:45-51` [cite]).

What the reader meets on the DM's page: the STRAINED spine (one of two variants, one of four faces), then a second sentence about the bought watch (one of ~3 variants, one of four faces, one of ~3 openers). Distinct surfaces for this one state cell: 2 × 4 × 3 × 4 × 3 = 288, authored from 5 semantic sentences (§6 does the block's whole arithmetic). On the player's page: the spine, then the country or the stores. Same seed, same page, forever; a neighbouring town with the same four facts and a different seed foregrounds country where this one foregrounds stores. And when the covert watch is exposed (a `revealed` impairment lands), the modifier's key changes from covert to revealed — a different pool, a different draw, a sentence that changed because the world did.

---

## §1 · PURPOSE, THE OWNER'S WANT, THE NON-GOALS

The owner wants prose that grows more specific with every relevant fact a settlement holds — walls, the purse behind the muster, the guard's loyalty, the granary — without authoring a sentence per combination, so that nothing is ever stale and a repeated sentence is repeated only because the exact situation repeated (ARCH-BRIEF "The commission"). The chair's method is adopted: author the PIECES (a spine per primary fact, modifiers per secondary fact, turns only where the engine holds a named explanation), buy the COMBINATIONS with a typed grammar, and bound the whole thing by occurrence, depth, relation and licensing. The owner's ~22:30 rule is adopted as the second layer: every semantic piece, existing and planned, is born as a family of four wordings rolled by an unweighted seeded die, never trimmed (ARCH-BRIEF "THE OWNER'S RULE").

Non-goals, each a wall: **no language model at render** (THE PROMISE; the finite-semantics law; "AI = clerk, never writer" — the composer below is a clerk over typed buckets and a finite lexicon, the same claim `discourseKernel.js:1-16` [cite] makes for the chronicle); **no per-combination authoring** (the four-fact key at `defenseStateProse.js:747` and DS-DEF-2's six hand-cut cells from three booleans [M] are the shape being retired, never extended); **no fact change under any seed** (every new draw is a new key with its length fixed at birth; a same-seed TEXT shift is declared and owner-signed; a same-seed FACT shift is impossible because the composer reads only what the desks already read).

---

## §2 · THE PIECE MODEL — the schema, the keys, the draw, the migration

### 2.1 The shape decision: a sibling metadata map, never a pool object
A pool is an array today and five readers index it as one (`eligibleVariants`, `poolDimensions`, `hasStateProsePool`, the thin-pool arm, the causal reader — read-data §6.3). The design keeps `pools[key] = variants[]` byte-for-byte and adds ONE sibling map on the block:

```js
// src/data/dossierStateProse/<desk>.generated.js — added keys only; nothing existing moves
"DS-DEF-11": {
  title, slots, sectionTarget,            // unchanged
  pools: { "WALLED-STRAINED": [ {angle, marks?, slots, text,
            faces?: ["…", "…", "…"],       // §2.5 — the three further wordings; absent ⇒ face count 1
            grammar?: "V2",                // GRAMMAR_TAG_CONTRACT.leafForm (moveGrammar.js:145) [cite]
            move?: ["PRESENT","CONSEQUENCE"] } ] , … },
  pieces: {                               // NEW — one row per pool; a pool with no row is a spine
    "WALLED-STRAINED":       { role: "spine",    reads: ["forces.walls.present", "defenseProfile.economicGates.military"] },
    "MOD country: frontier": { role: "modifier", reads: ["config.monsterThreat"], relation: "tension",
                               seat: "sentence", form: "sentence" },
    "MOD muster: short":     { role: "modifier", reads: ["defenseProfile.economicGates.military"], relation: "consequence",
                               seat: "clause", form: "fragment" },
    "TURN gate sold: covert":{ role: "turn",     reads: ["npc.compromiseLifecycle"], explains: "compromise:military:underfunded",
                               relation: "tension", seat: "sentence", form: "sentence" }
  }
}
```

Field by field: `role` ∈ {spine, modifier, turn}; `reads` = canonical producer paths (the wiring census's vocabulary, §3), the machine-readable half of what the annex's `**STATE-KEY**` line says in prose today (68 such lines, projected nowhere — read-data §3.2); `relation` ∈ {consequence, tension, contrast, addition} (§4.5); `seat` ∈ {clause, sentence} derived from `relation` by the seat rule and stored so the walker can check it; `form` ∈ {sentence, fragment} — a fragment has no terminal stop and a lower-case opener, and is never drawn alone (arm, §8); `explains` = the typed explanation id a turn is keyed on (§5). `grammar` and `move` ride the variant per the already-written contract, whose `seedSafe` clause states why a per-variant datum moves no draw (`moveGrammar.js:159-162` [cite]).

### 2.2 The annex grammar the projection grows
The generator already has the exact branch shape for a typed, backticked declaration line and throws on an unknown token (`generate-dossier-state-prose.mjs:326-348` [cite]). Copy it; do not invent a second one:

| new annex line | form | projected to |
|---|---|---|
| `**ROLE:**` | `` `modifier` `` once under a pool label | `pieces[key].role` |
| `**READS:**` | backticked producer paths | `pieces[key].reads` |
| `**RELATION:**` | one of four backticked words | `pieces[key].relation` (seat derived) |
| `**EXPLAINS:**` | one backticked explanation id | `pieces[key].explains` |
| a fourth bracketed tag `` `[face: 2]` `` on a numbered row | rides `VARIANT_RE`'s optional group like `[grammar: V4]` does | `faces[]` on the parent (§2.5) |

The parser's two guarantees extend: `assertNothingDropped` counts face rows and fragment rows (gen:432-452 [map data §3.1]); the numbering guard (gen:406-411 [cite]) treats a `[face: n]` row as belonging to the immediately preceding numbered variant, so a face can never open a pool. A fragment row under a `**ROLE:** modifier` pool must fail the sentence regex (no terminal stop, initial lower case) or the projection refuses — that is the parse-time distinction read-data §6.5 item 2 asks for.

### 2.3 Slots and licensing at the piece grain
A modifier names its slots exactly as a variant does and is anchored per piece by the kernel unchanged. Its slot must be in the block's `**SLOTS:**` palette and have a shape in the register (`dossier-slot-shapes.mjs:88-137`, refusal at gen:643-663 [map data §3.3]); `{band}` stays RESERVED (`:32-39`), so no modifier routes through it. A modifier that reads a fact only a bag entry can render costs a bag entry — read-facts §8.1's law — and the wiring census (§3) names the exact `const <bag>` literal for the (block, pool).

### 2.4 The draw per piece
| piece | key material | modulus | new seed input? |
|---|---|---|---|
| spine | `${seed}::${blockId}::${poolKey}` — unchanged | `eligible.length` | no |
| modifier / turn | the same form over its OWN new pool key | its `eligible.length` | yes, from the pool's birth |
| wording face | `${seed}::${blockId}::${poolKey}::w` | `1 + faces.length` | yes, from the first face's birth; `% 1` ⇒ 0 until then |
| connective | `${seed}::${blockId}::${spineKey}::c` | the relation's list length | yes, from the leaf's birth |
| salience tie | `${seed}::${blockId}::salience::${poolKey}` | ordering only, no modulus | yes |

All five use the kernel's one hash pair (`fnv1a32` + `avalanche32`, `stateProseKernel.js:92-115` [cite]); no second hash is introduced. Seedless stays canonical-at-zero at every level (kernel law 4).

### 2.5 The wording family: NESTED, two-level, and why
The brief's default is the flat list. It is measured against the two-level roll over the real leaves **[M]**:

```
FLATTENED one-level roll over 4L: semantic variant preserved on 64018/141600 = 45.21%
TWO-LEVEL roll (parent key unchanged): semantic variant preserved on 141600/141600 = 100.00%
face-0 share under the second key: 25.05% (uniform target 25%)
```

Under the flatten, 54.79 % of every world's reads change their ANGLE and claim set — a shift in which standpoint speaks, which the migration car's "wording-only on the golden sample" criterion (ARCH-BRIEF line 30) cannot prove. Under the two-level roll the parent draw is untouched and only the face moves. **Ruling (chair-decidable, the owner sees it in §13): two-level, faces nested under the parent variant, the face key a `::w` suffix of the parent key.** The die is unweighted at 25.05 % with no new machinery. Every face is eligible whenever its parent is, structurally: eligibility runs on the parent's `slots` and `marks` (`eligibleVariants :247-269` [cite]) and a face is a string beneath them. The gate asserts what the structure does not: each face's `{slot}` set equals the parent's declared `slots`, each face passes `check-pair` against the parent with the LONGER arm suppressed (read-instruments §1.6), and a minimum pairwise fingerprint distance holds across the family (§8, arm A5). The causal register's six-exactly assertion (`…contract.test.js:285` [map instruments §2.7]) is untouched because faces are per variant. The variant ratchet (`:277-278`) stays on semantic variants; a second ratchet on faces is added (§8).

### 2.6 How today's 708 pools migrate with zero text change
Every existing pool becomes a spine by default (`pieces` absent ⇒ spine). No key is renamed, no variant appended, no face authored. The projection emits the six leaves with `pieces: {}` omitted where empty, so the leaf bytes are unchanged until the first `**ROLE:**` line is authored; the composer, handed a candidate set with no modifiers, returns exactly `readStateProse`'s result. The proof is the composed-prose manifest (§8, §12 car C0): the generator golden master cannot see dossier text (`stateProseKernel.js:10-11`; read-instruments §3), so a new N-town manifest of `(seed, block, pool, angle, text)` per position is the instrument, byte-identical across cars C2–C4.

Pools that cannot serve as a spine with a clause seat: 642 of 2,266 variants are already two- or three-segment (read-kernel §8a). They stay spines; their seat capacity is smaller (§4.4). The 8 three-segment variants already breach wall 6 and are the rewrite wave's, not this car's.

---

## §3 · THE WIRING CENSUS as the source of truth

The census is commissioned and unbuilt (INSTR car 8, ARCH-BRIEF line 40). The design makes it the table every other section reads from, in both directions:

**Forward: (block, pool) → {predicate, fields read, slots filled}.** The predicate is the key function and the branch that returns this key (118 functions: 91 one-fact, 18 two, 8 three, 1 four — read-facts §5.1 [M by that reader]); the fields are the function's arguments traced to the desk's read sites (`settlement.*` or `readings.*` paths); the slots are the composer's bag for the (block, pool), resolved by the NEAREST-PRECEDING `const <bag>` declaration, never the file's first — the instrument's resolver is wrong on two composers (`dossierComposedFill.js:159`; read-facts §3.1: five sites mis-credited) and the census must ship the corrected resolver or inherit a wrong licence table. The forward table also carries the pool's `pieces` row once it exists, so `reads` is checked against the fields the predicate actually consults: a `reads` that names a field the key function never touches is a census FAIL.

**Reverse: field → every pool keyed on it, every bag that fills it, every piece that reads it.** This is the tier table's input (§8) and the salience scorer's `reads`-overlap input (§4.6).

**Static join versus execution.** 358 of 708 keys appear verbatim in a desk file; ≈350 are built dynamically, mapped through a token table, or belong to a dark block (read-data §4). The census therefore has two halves and prints both: (a) the static half from the source; (b) the EXECUTED half from the occurrence probe over the N-town sample, taken at the composer layer with the desk's readings bag reconstructed as the desk-read callers build it — never with `{}` readings, which select the absence pools for every seed (read-instruments §4.2; the memory hazard "A PROBE THAT PASSES {} AS READINGS"). A key that fired in the sample is RESOLVED by execution. A key neither literal nor fired is **WIRING-UNRESOLVED**: listed by name with the function it lives in, gated as a count that may only shrink, and its pools are treated as MISSING for the tier table (an authoring target waits until the wiring is proven, read-facts §4). The 15 unmounted blocks (448 variants) are census rows, not assumptions; only DS-DEF-7 is declared dark in its composer (`defenseStateProse.js:1435` [map facts §3.2]).

**Tiers** (per (fact, value) cell, from the reverse table): COVERED = a reachable pool with ≥ 3 variants and ≥ 2 grammars; THIN = reachable but below either floor, or a slot-free pool where the bag offers a fill nobody wrote for (the eight blocks where the fill arrives and the sentence is missing, read-facts §4); MISSING = a cell of a closed vocabulary with no pool (e.g. `readiness.label` has six values and DS-GEN-3 keys all six, but DS-DEF-11's modifier space has none yet); UNRESOLVED as above.

**Regeneration and gate.** `npm run census:wiring` writes `docs/content/WIRING_CENSUS.generated.md` (the chair's reading copy) and `src/data/wiringCensus.generated.json` (the walker's), by the same one-projection discipline as the prose leaves; the gate runs it with `--check` and reds on a stale byte (the pattern at gen:706-713 [map data §1]). The census is a build artefact and NEVER a runtime import — the kernel and composer stay import-free (`entryLexicons.js:16-18`'s fence, read-facts §6.3).

**The owner's map question** ("see if there is already a prebuilt map"): the half that exists is the annex's 48 `**RECEIPT:**` lines, 68 `**STATE-KEY**` lines and the `DM_FIELD_FRAMED_BY_BLOCK` table — prose, hand-written, machine-unread (read-data §3.2). The census is that map made executable; the authoring wave reads its MISSING and THIN rows and nothing else.

---

## §4 · THE COMPOSITION ALGORITHM — specification

### 4.1 Where it lives
A new pure leaf `src/domain/display/stateProse/stateProseComposer.js` between the kernel and the desks: imports only the kernel; no settlement access; no clock; no RNG; no lexicon. It resolves read-kernel's open question 1: the DESK builds the candidate set (state → keys and typed integer signals, which is still "state to key and nothing else"); the COMPOSER scores, bounds, draws, joins. It is imported only by the six `*StateProse.js` files, so it rides the lazy chunk (`vite.config.js:876-878` [cite]) and adds zero first-paint bytes.

```
composeStateProse(corpus, blockId, {
  spineKey,                                  // string | null (null ⇒ null, R-DST-K)
  candidates: [{ poolKey, signals: {departure, tension, recent}, slots? }],
  slots, seed, audience, dimensions,         // as readStateProse takes them today
}) -> { blockId, poolKey, angle, text, pieces: [{poolKey, angle, seat, relation}] } | null
```

### 4.2 The steps, in order (each a pure function)
1. **Spine read** — `eligibleVariants` + `drawVariant` on the spine pool exactly as `readStateProse` does; null ⇒ null.
2. **Candidate filter by metadata** (data, not lexicon; fixed at the freeze — S7): drop a candidate whose `pieces.reads ∩ spine.reads ≠ ∅` (the reads rule, §4.6); drop a candidate whose `move[0] === 'ABSENCE'` when the spine's last move is `ABSENCE` or when it would open (wall 3, `moveGrammar.js:126` [cite]); drop a turn whose `explains` the caller did not evidence (§5).
3. **Salience** (§4.3) — score, sort, seed tie-break.
4. **Seats** (§4.4) — walk the ranked list; a candidate takes the first seat its `relation` admits and the spine's remaining capacity allows; stop at two modifiers or no capacity.
5. **Per-piece eligibility and draw** — for each seated candidate, `eligibleVariants` (audience, anchored, dimensions passed through unchanged) then `drawVariant` on its own key; an empty pool or a null fill DROPS that candidate and the walk continues down the ranked list (a runtime drop that changes no modulus and so moves no other draw — the lawful shape under A7, read-specs §7 "the gate, never the draw").
6. **Face draw** per drawn piece (§2.5).
7. **Connective draw** per seated modifier over the relation × seat list (§4.5).
8. **Arrangement** — clause seat: spine text with its terminal stop removed + joint + fragment (lower case as authored) + stop; sentence seat: spine text + space + opener (may be empty) + modifier sentence. The composer owns case at every joint; `fillSlots` runs per piece before arrangement, so a `{settlement}`-initial modifier keeps its proper case.
9. **Return** the frozen unit with `pieces[]` provenance.

Rendering cost per position: ≤ ~10 candidates scored in integer arithmetic, ≤ 3 variant draws, ≤ 3 face draws, ≤ 2 connective draws, ≤ 1 tie-break hash per candidate — ESTIMATE under 0.1 ms per position on the measured 2 ms/town composition baseline (read-instruments §4.3).

### 4.3 Salience: the three signals, their weights, determinism, ties
Signals are integers 0..2 assigned by the DESK from typed state, so the scorer never reads the settlement:

| signal | what it measures | how the desk derives it | source of the norm |
|---|---|---|---|
| `departure` | how far this fact's value sits from the estate's modal value | 0 = the modal value; 1 = a minority value; 2 = a value under 5 % occurrence (ESTIMATE threshold; the number is the owner's, §13) | `NORM_TABLE` — a FROZEN per-(pool) share over the 200-town sample, emitted by the wiring census as a generated leaf, `src/data/proseNorms.generated.js` |
| `tension` | opposition to the spine | 0 = addition; 1 = the piece's `relation` is tension/contrast/consequence on a typed edge; 2 = the edge is one `contradictions.js` classes `interesting_tension` (`:141-313` [map explanations §4.5]) or a `dm-only` covert seam | the piece metadata + the engine's typed edges (§4.5) |
| `recent` | a change within the recent window | 0 unless a PERSISTED tick field exists on the fact (`activeConditions[].triggeredAt`, a pulse record's tick) and lies inside the window; then 1 (inside) / 2 (this season) | persisted fields only; a render-time derivation is refused (S11) |

`score = 4·departure + 2·tension + 1·recent` (weights frozen as exported constants; changing one re-orders and is a declared TEXT shift — §13). Sort descending; ties by the salience hash ascending (§2.4). Determinism: same state + same seed ⇒ same ranking on every visit (the kernel's own contract, `stateProseKernel.js` THE PROMISE paragraph [cite]). Two towns with identical facts and different seeds foreground differently ONLY where scores tie; with three signals at 0..2 the score space is 15 values and ties are common — ESTIMATE, to be printed by the salience car as the tie rate over the sample (a low tie rate would make the second clause of the brief's SALIENCE bound weak, and the cure is coarser signals, never a seeded weight). The `NORM_TABLE` is itself a seed input under THE PROMISE from the day it ships (a re-measured norm re-orders modifiers): it is regenerated only in a declared car, by measurement, and its bytes are pinned by the projection's `--check`.

### 4.4 The bound: capacity, seats, depth, relation, occurrence
- **Capacity** = 2 segments (wall 6, dossier-scoped; `armF` F6, `grammarWalker.js:380-387` [cite]). The spine consumes `segmentCount(spine)`; a clause seat consumes 0; a sentence seat consumes 1. So a 1-segment spine admits at most {1 clause + 1 sentence} = 2 modifiers; a 2-segment spine admits {1 clause}; a 3-segment spine admits none. This IS the brief's "≤ 2 modifiers" and it costs no wall amendment.
- **Seats by relation** — clause ← `consequence` only (V2 PRESENT → CONSEQUENCE, a structural consequence licensed by a standing field, never an event — R-DA-19, S15); sentence ← `tension`, `contrast`, `addition`. A modifier is authored FOR its seat (`form: fragment` for clause, `form: sentence` for sentence) so no piece is ever bent to fit.
- **Depth** — pairs by default (spine + 1); a second modifier only through the second seat; never a hand-written triple except as a TURN keyed on an explanation (§5). Four never.
- **Relation** — only along the engine's edges (§4.5); `addition` is the floor relation and carries no connective.
- **Occurrence** — a state CELL (spine × the modifier set actually attached) earns a hand-written turn only where the census's executed half shows the cell on ≥ 2 % of the sample (ESTIMATE; the owner's number, §13); rarer cells read through composition and are listed in the tier table as COMPOSED-ONLY so nobody authors for them by habit.
- **Exemplar numbers** — BUDGET 1/3, DEPTH 0.5 at pool/tab/register; 2/3 and 1.75 PROVISIONAL at the entry grain (Part B §16.2 line 637 [cite]); the composed unit is a NEW GRAIN row owed to §16.2 (S1), measured by the re-measure car (§12 C10) before any composed figure is quoted, because every published figure is a pre-composition figure (S13).

### 4.5 Relation typing and the connective leaf
A seventh emitted leaf, `src/data/dossierConnectives.generated.js`, projected from a `## §7 CONNECTIVES` section of the state annex, keyed `relation → seat → [phrases]`, with `DEFAULT` per relation as a totality floor (the `discourseKernel.js:188-190` precedent [cite]). The chronicle's colon-bridges are NOT reused: they are headline-following bridges of another register (read-data §9 Q7). The causal annex's twelve edge-licensed phrases (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1998-2016` [cite]) are R2 connectives keyed on provenance edges and belong to the turn tier (§5), not to state modifiers.

| relation | seat | the edge that licenses it | authored forms (ESTIMATE of the set; the wave authors them, the walker pins them) | bands that bind |
|---|---|---|---|---|
| consequence | clause | a causal edge in the engine between the spine's field and the modifier's: archetype → variable through `canonicalAffectedSystems` (`stressorsCore.js:410`), a `CausalContributor` edge, a `CAUSE_SIGNAL` predicate, or the persisted upkeep-gate chain (`defenseGenerator.js:189` → `:467-472`) [map explanations §4] | `; ` · `, and ` · `, so ` · `, which is why ` is REFUSED (wall 6's which-tail) | semicolon rationed (R-DA-06); colon holds at one per unit; **joints per unit ≤ 1** — a new figure the walker prints (S12) |
| tension | sentence | opposite-sign facts on one system variable, or a `contradictions.js` `interesting_tension` type, or a covert seam | empty opener · `Yet ` · `Even so, ` · `Against that, ` | `shapes.antithesisRate` band; the rationed `rather than` ≤ 0.020/variant (R-DA-02) |
| contrast | sentence | **wall 5 only**: a sibling pool key or sibling band of the SAME block names the rejected alternative (`moveGrammar.js:128` [cite]) | empty opener · `Unlike …` is REFUSED (fronted contrast) | never the closing move of more than one variant per pool |
| addition | sentence | none needed (the floor) | empty opener only | — |

Arm A2 (§8) fails a `consequence` joint whose two pieces have no edge in the census's edge table; arm A3 makes wall 5 executable for contrast.

### 4.6 The coherence pass — by construction and at the gate, never by lexicon at render
1. **No restatement of the spine** — the reads rule at candidate construction (a modifier never reads the spine's field); at the gate, arm A1 compares `typedFactsOf` (`entryWalker.js:627` [cite]) band-per-noun across the pieces of every enumerated composition and fails an overlap on one governed noun.
2. **No negation of the spine** — the same arm: two pieces banding one noun in disjoint classes is C5's conflict (`armC5`, `:656-671` [cite]) applied across pieces instead of across siblings.
3. **Sibling agreement across blocks** — a fact may be surfaced as a spine at its home position and echoed as a modifier elsewhere on the page-set at most ONCE (the ECHO BUDGET = 1, a §13 number), and the echo's band must equal its home rung's band; the composed-prose manifest walker checks it over the sample. Read-facts §9's two-vocabulary hazard (`prosperity` keyed seven ways on DS-ECO-8 and five on DS-GEN-3) is resolved by echoing on the PRODUCER token, never the corpus word (the label-trap rule, `dossierMounts.js:73-88` [cite]).
4. **Adjacency walls** — wall 3 by the `move` tag at candidate filter (step 2); wall 10 (the settlement token opens at most one variant per pool, never two adjacent) extends to the composed unit: a modifier whose face opens with `{settlement}` is not seated after a spine that opens with it — again by tag, fixed at the freeze.
5. **Audience and dimensions per piece** — the kernel's, unchanged, twice: at eligibility and at fill.

---

## §5 · THE EXPLANATION SEAM — what a turn may be keyed on today

**What the engine holds** (read-explanations §2, all [map]): twelve envelope explainers behind `explainEntity` (`explanation.js:1131`), all computed at render with one production caller; a persisted generation trace (`settlement.simulationTrace[]`); persisted `activeConditions[]` carrying `causes[]`, `triggeredAt`, `affectedSystems` (46 archetypes, 131 archetype → variable edges, 0 unknowns); a closed 14-class cause vocabulary with pure presence predicates (`causeVocabulary.js:45-64`, `:165-228` [cite]); the persisted `npc.compromiseLifecycle` stamp `{causeClass, family, stage, situation, role, …}` (`settlement.schema.js:983`); six contradiction detectors, three classed `interesting_tension`; and one SHIPPED instance of the specificity ladder, `causeConjunctionContent.js:186-215` [cite] — full → role → class → floor, a pure `fnv1a32(seedId::key)` draw, live on the NPC card.

**The reach constraint.** No state-prose composer imports any of it (read-explanations §7.1), and the render-time substrate costs 28 files / 546,887 B to import into a tab (`defenseStateProse.js:1460-1468` [map]). So a turn at the dossier is keyed on what is PERSISTED or cheap:

| turn source | persisted? | reach cost | licensing strength | example turn key |
|---|---|---|---|---|
| `npc.compromiseLifecycle` stamp: `role × causeClass × situation × stage` | yes | none — a field read | strongest: closed class, pure predicate | `compromise:military:underfunded:covert` → "the gate is sold for want of pay" (dm-only) |
| `activeConditions[]`: `archetype × severityBand × causes[]` | yes | none | strong | `condition:food_anchor_lost` on a walled spine |
| `compromisedSecurityInstitutions(s).{covert,revealed}` | derived from persisted parts | `corruption.js` import — cost UNMEASURED, mark before wiring | strong for the watch modifier; it is a STATE read, so it keys a MODIFIER, not a turn | §0's watch modifier |
| `defenseProfile.economicGates.military` | yes | none | strong | the muster modifier |
| the causal register (78 families / 468 variants / 105 arms) | join derived from `causes[]` | reader exists, deriver does not (`causalDossierProse.js:100-127` [cite]; zero importers) | strong once wired | R2 turns — a separate lane, §12 C9 |
| `causalState` contributors, capacities, threats, districts | no | 546,887 B | medium | REFUSED at the dossier until a slim persisted digest exists (§13) |

**How a turn is keyed.** `pieces[key].explains` names one typed explanation id from a closed table (`TURN_EXPLANATIONS` in the composer's data leaf, generated from `CAUSE_CLASS_IDS` × roles × situations, and from the condition archetype ids). The desk evidences a turn by handing the composer the id it found on a persisted record; a turn with no evidenced id is not a candidate (the causal reader's "renders only the joins it is HANDED" law, `causalDossierProse.js:11-20` [cite]). A turn is never keyed on a fact conjunction: the gate's arm A8 (§8) fails a `role: turn` row whose `explains` is absent or whose `reads` names more than the explanation's own record.

**What a turn may claim.** On a STATE spine, only V2's structural consequence (what the arrangement costs the town as a standing fact); the historical class (an event, a date, a departure) is REFUSED on R1 because no provenance field licenses it there (R-DA-19; S15). A turn over a compromise stamp speaks of the OFFICE as office (the PERSON move, `moveGrammar.js:38` [map specs §3]) — never the NPC's name or fate (product scope: never a named character's fate); `situation: covert` ⇒ `dm-only` by construction (audience law). A turn is one step from the MEANING non-move (S16): the arm, not authoring discipline, is what keeps it lawful.

**Degrade.** No evidenced explanation ⇒ the turn is simply absent from the candidate set and composition proceeds with modifiers — the ladder's floor rung generalised: the composed unit IS the floor, and the turn is the rung above it.

**The `{reason}` seam.** Three routed pools are held silent for want of a `{reason}` fill (`stressorsStateProse.js:279-294`, `defenseStateProse.js:1470-1477` [map explanations §7.4]); `CAUSE_LABEL_OF` already holds fourteen bare-common noun phrases (`causeVocabulary.js:45-64` [cite]). Ruling a `{reason}` vocabulary lights them with no desk change, but it is reader-facing prose and therefore a §13 row, not a lane act.
