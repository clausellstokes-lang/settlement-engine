# DESIGN C — THE COMPOSED-PROSE MODEL, LED FROM THE WRITERS' PIPELINE AND THE GATES

**Seat: Fable 5.1 — architect (design C of the ARCH-BRIEF run, owner commission 2026-09-07 ~22:10). Read-only throughout; nothing written outside `$SC/arch-prose/`.**

`$SC` = `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit`. Product code read at `$SC/laneB6` (product tip `3b1c0eaa5`, `git log --oneline -1` executed); instruments at `$SC/skepINSTR` (INSTR-912 at `74a1aa0e8`, executed likewise). Paths below are repo-relative to those docks. The six reader maps are cited as `read-kernel`, `read-data`, `read-explanations`, `read-facts`, `read-specs`, `read-instruments` with their section numbers.

**What I executed myself in this pass** (every figure marked CONFIRMED below comes from one of these; everything else is cited to a reader map or a file:line, or is marked ESTIMATE):
- `node arch-prose/variants-per-pool.mjs $SC/laneB6` → `pools 708 variants 2266 mean 3.20`; histogram `2:33 3:547 4:96 5:17 6:15`; `below four: 580 pools · variants needed to reach four: 613`; angles `visitor 403 · ledger 681 · street 609 · counterforce 170 · threshold 96 · unfolding 230 · elder 70 · canonical 7`; `blocks with pools below four: 58 of 68`.
- `node arch-prose/draw-reroll.mjs` (200 seeds × 708 pools = 141,600 reads) → flatten preserves the semantic variant on **45.21 %**; the two-level roll on **100.00 %**; face-0 share under the second key **25.05 %**.
- `node arch-prose/_c-occ200.mjs 200` (my copy of the honest occurrence probe, output to `_c-occ200.out.json`; general desk only; six tiers round-robin, one culture/terrain/route) → `N=200 · 3745 ms = 19 ms/town (generate 3719, compose 21)` · `3504 rungs with provenance (17.5 per town) · 56 distinct (block,pool) cells` · histogram `1->2 3->2 4->1 5->1 7->3 17->1 18->3 20->1 21->2 22->2 23->1 26->2 28->1 32->2 33->1 35->1 36->1 38->1 55->1 56->1 58->1 61->2 65->1 67->1 69->1 73->1 74->2 79->1 82->1 83->1 86->3 94->1 96->1 118->1 132->1 139->1 193->2 200->4` · `cells on ONE town only: 2 of 56` · `cells on EVERY town: 4` · angles drawn `visitor 1033 · street 1028 · ledger 946 · counterforce 219 · elder 124 · threshold 120 · unfolding 34`.
- `node arch-prose/_c-dump.mjs` → the three worked blocks and DS-GEN-3 from the shipped leaves (pool keys, sizes, angles, slots, sentence and word counts; quoted in §6).

The document is led from my angle — the authoring pipeline (§8), the implementation sequence (§12) and the owner rows (§13) come first — and then covers the brief's other eleven sections in the brief's own numbering. No section is blank; two limbs are refusals with a reason (§5's tier-2 turn keys; §9's Herald state modifier).

---

## §8 (LEAD) — THE AUTHORING PIPELINE: THE TIER TABLE → THE AUTHORING LIST → LICENSING AT AUTHORING → THE GATES → THE DECLARED SHIFT

### 8.1 The one sentence this design is built on

**The corpus stays LINEAR in authored PIECES and the surfaced readings grow MULTIPLICATIVELY, because a piece is licensed by a FIELD, not by a combination, and the combinations are bought at render by a deterministic composer that can only join pieces along typed relations.** Everything in §8 exists to make that sentence true at the freeze gate rather than at the writer's desk: the writer is handed a LIST (a block, a fact, a role, a relation, the fields it may read, the bag it may name), writes to the register card, and the gate decides. No model writes at render (THE PROMISE; the finite-semantics law — "AI = clerk, never writer").

### 8.2 Who writes, and to what

**The writers are Opus workflows, one per block, under the register card** (`$SC/prose-research/REGISTER-CARD.md` — who speaks; what a sentence is for; what the record never does; what it may do; the three questions before any sentence ships). The owner's 09-05 directive binds: Fable chairs and architects, Opus implements and writes, every lane `model: "opus"`. The workflow's prompt carries, verbatim: the register card; Part B §1 (R-DA-00…24), §16–§16.2 (walls / bands / the three numbers); MOVE-GRAMMAR §1–§3 (the moves, the non-moves, the walls); the block's annex section as it stands (its `STATE-KEY`, `SLOTS`, `ENTAILMENT`, `PROVENANCE`, `RECEIPT` lines — the authored licence, `read-data §3.2`); and the block's AUTHORING LIST rows (8.4). The owner's ~22:30 rule binds every row: the rewrite of a variant to the voice AND its three further wordings are ONE pass, never two (ARCH-BRIEF line 29), and NEVER TRIM (line 23).

**What a writer produces is annex rows, never leaf bytes.** The doc is the source; the leaf is a projection; the gate refuses a stale byte (`scripts/generate-dossier-state-prose.mjs:5-11`, `:706-713`; `read-data §8` item 10). A writer who cannot produce a lawful row for a list entry writes a REFUSAL row with the measurement (the estate's idiom), which the chair reads at the sitting.

### 8.3 The tier table — the source of every list row

The tier table is INSTR-912 car 8's output (`$SC/briefs/brief-INSTR-912-car8.md`, commissioned, not built): one table indexed two ways — pool → fact (the licence: `{block, pool, predicate, fieldsRead, slotsFilled, status}`) and fact → text (for every fact the composers hold and every fact PAIR a key function conjoins or that co-fires by execution over the 200-town run, the pools, variant count and grammar count that can speak to it) — with three tiers per block: **MISSING** (a held fact, or a co-firing pair, with NO pool), **THIN** (one variant, or one grammar, or a slot set of `{settlement}` alone), **COVERED**. Its inputs already exist and are joined, not re-derived: the 118 key functions (`read-facts §5.1`: 91 one-fact, 18 two, 8 three, 1 four), the composed-fill census (`skepINSTR/tests/helpers/dossierComposedFill.js:42-49`, per `(block, pool)`, with `conditional` and `unresolved` tiers), the unrendered-facts census (72 held · 13 rendered · 59 key-only, `read-facts §2`), the mount registry (56 rows, 52 sentence, 4 glance, 15 unmounted — `dossierMounts.js:257-469`, `:483`), and the annex headers.

**Two corrections the car must carry before the table is trusted** (`read-facts §3.1`, executed there): the instrument's bag resolver takes a bag name to the file's FIRST `const <name> =` (`dossierComposedFill.js:159`), and four composers declare `const slots` more than once (defense 9 times, power 2, stressors 2), so DS-DEF-4/-9/-11 and DS-POW-1 were credited with the wrong bag; the corrected reach is **1,756 of 2,266 variants reachable, 62 unreachable inside wired blocks, 448 in the 15 unwired blocks**, and the "bag-flat" count is **19**, not the receipt's 22 (`read-facts §3.3, §4`). The car's brief already names `dossierComposedFill.js` as reuse; the design adds: the resolver becomes nearest-preceding-declaration-in-scope, and the car prints the three censuses (declared 20 / bag-instrument 22 / bag-corrected 19) side by side so the wave never again sizes itself on the wrong twenty.

### 8.4 The tier table → the authoring list (the mechanical step)

Each tier row becomes AT MOST ONE list row by a fixed rule; a row that fits no rule is printed as `NO-LIST-ROW` with the reason. The list is a table the chair hands a writer; every row names the block, the field(s), the reading function, the bag, and the count that put it there (the car-8 addendum's own requirement).

| tier row | list row it becomes | piece ROLE | what the writer is told |
|---|---|---|---|
| COVERED pool (a spine today) | REWRITE+FACES: the pool's k variants rewritten to the voice, each given three further wordings in the same pass | `spine` (today's pool, role unchanged) | the pool's predicate and fields (from the census), its bag, its siblings' keys and bands (wall 5 / R4-BAND), its `[grammar: Vn]` tag to author |
| THIN pool — one variant or one grammar | REWRITE+FACES plus **one or two NEW variants** in a new level-1 member, so the pool carries `min(k, 8)` distinct grammars, at least two (MOVE-GRAMMAR §2.1) | `spine` | as above; the missing member named (V2/V4/V5 today; V3/V6/V8 are NOT-EXECUTABLE or owner-gated — `read-specs §4`) |
| THIN pool — slot set `{settlement}` alone, but the composer's bag offers more | **a MODIFIER keyed on the bag's unused fill** (the five "cheapest targets": DS-ECO-3, DS-ECO-8, DS-ECO-9, DS-FTH-2, DS-WAR-3 — `read-facts §4`) | `modifier` | the slot, its shape row (`proper` / `bare-common` / `phrase`), the field the desk fills it from |
| MISSING — a held fact with no pool, on a block whose desk reads it (a KEY-ONLY fact of the 59) | **a MODIFIER pool keyed on that fact**, one pool per notable VALUE class (2–3 values → 1–2 pools; a band of ≥ 4 values → the two edge bands, never the middle) | `modifier` | the field path, its closed vocabulary (`read-facts §5.2`), the relation the relation table licenses against this block's spines (default `addition`) |
| MISSING — a co-firing fact PAIR at or above the OCCURRENCE floor (§6.1) with no pool keyed on both | first, **the two MODIFIERS** (the pair is then spoken by composition); a **TURN** only where the pair has a NAME in the engine — an id in the TURN-KEY REGISTRY (§5.3) | `modifier` ×2, then optionally `turn` | the pair's fields and their edge in the relation table; the registry id if one exists (and if none exists, NO turn: a turn without a registry id is the MEANING non-move with a good vocabulary — `read-specs S16`) |
| MISSING on an UNWIRED block (the 15) or a WIRING-UNRESOLVED pool | `NO-LIST-ROW: wiring first` — the wiring census's business, never the wave's | — | the census row's reason |
| a dark pool declared dark in source (DS-DEF-7's eleven, `defenseStateProse.js:1435+`) | `NO-LIST-ROW: declared dark` | — | the pinned reason |

**The floor (ARCH-BRIEF "THE FLOOR")** is met by construction: every block that today speaks keeps its spines (rewritten, faced) and gains modifiers from its own desk's KEY-ONLY facts; a block whose desk holds no second fact (S10: 33 of 68 license one level-1 member, `SITTING-RULINGS-912.md:127`) gets no modifier in wave one and the list says so — "specificity rises everywhere" means everywhere a second typed fact exists, and nowhere else (fault 35: nothing at render produces variation the data does not hold).

### 8.5 Licensing at authoring time — what a writer may claim, mechanically

A piece is licensed by its FIELDS. The writer receives, per list row, a LICENCE CARD derived from the census:

```
LICENCE (block DS-DEF-11 · role modifier · key `muster: short`)
  reads:      defenseProfile.economicGates.military   (number; absent when there is no paid stack — absence is NOT "fully funded")
  predicate:  militaryGate < 1
  bag:        {settlement: proper, defwork: bare-common (conditional: only wall-class names)}
  relation:   consequence   ← edge: generator rule milUpkeepMult (defenseGenerator.js:189-191; degrades scores.military)
  move:       CONSEQUENCE (structural; R-DA-19: never an event)     grammar: derived (spine.order + [CONSEQUENCE])
  may claim:  that the paid muster is short of its funding, as a STANDING fact
  may NOT:    a count, an office, an exemption, a date, a cause outside the edge, a treasury (none exists), a future
  audience:   player (no mark)  — unless the field is covert, then dm-only inherited by every face
```

The card is the machine-readable form of the annex's prose licence (`STATE-KEY` / `ENTAILMENT` / `PROVENANCE`, dropped at projection today — `read-data §3.2`), and the writer's row must carry it back as typed lines (`**ROLE:**`, `**READS:**`, `**RELATION:**`, `**EXPLAINS:**`; §2.4) so the projection can refuse a piece whose row contradicts its card. The estate's three questions are asked on the card, not in the writer's head: which field licenses it (the `reads` line); which claims it carries (the walker's claim set, C1–C6); what it leaves standing open (a modifier never closes a matter the spine leaves open — arm A1's negation limb).

**Two licences no writer receives, ever** (`read-facts §7`): a totality over persons (`whoIsCounted` is open on every settlement forever — `institutionTable.js:21-27`) and an exemption from a duty (`whoIsExempt` is null everywhere). The card prints them as refused columns so a fluent writer does not reach for "every household" or "exempt from the toll".

### 8.6 The gate — which existing walker gates which property, and what is new

Every property the model introduces is placed under an instrument. Three of the four arms the brief names do not exist today (`read-instruments §1.5`); the licensing arm does and is per `(block, pool)`, which is exactly the grain a spine/modifier schema needs. The walkers run at the GATE, never at the draw (CLERK-LAWS §2.5; `entryWalker.js` header) — a draw-time refusal would change `eligible.length` and move every later index.

| property of the composed model | existing instrument that gates it | extension or NEW arm | channel |
|---|---|---|---|
| every piece licensed by a typed field (W1) | entry walker C2/C3/C4/C6 per piece, estate ground (`entryWalker.js:841`) | none; each piece is an entry | FAIL |
| a piece names only slots its (block, pool) bag fills | arm D (`entryWalker.js:730`), keyed on `(block, pool)` via the composed fill | the census row becomes arm D's input (car 8 §3); a modifier is licensed by ITS OWN (block, key) bag — same-block confinement makes this the spine's bag (§2.5) | FAIL |
| B-CLAIM on every face of a wording set (claims, modality, threat class, spread unchanged) | `check-pair.mjs` parent → face, ×3 (slots, digits, em dash, duration, count words, sibling-key words, three-sentence, rationed words, antithesis, future/subjunctive, existential opener, pronoun closer) | **A6 claim-equality**: the LONGER arm (`check-pair.mjs:70`) is SUPPRESSED for face comparison (a set that spans the length classes fails it by design); plus `walkEntry` on each face with the parent's ground; plus a MARKS/SLOTS byte-equality assertion (structural under the nested shape, §2.3) | FAIL |
| the four faces are not four synonym-swaps | none | **A5 sibling distance**: `fingerprint()` per face (`proseFingerprint.js:35` `RATE_METRICS`), pairwise L1 over the 21 rates on the estate's own ruler (never band-widths — the external-tool drift `proseFingerprint.js:17-24`), plus `openerOf` inequality and segment-count spread; the floor is MEASURED (§6.5) before it gates | FAIL below the floor once set; REPORT until then |
| a modifier does not restate or negate its spine | `armQualify` (`entryWalker.js:767`) withholds a second sentence naming no second field — the nearest thing, and it is per sentence not per piece | **A1 restatement**: `typedFactsOf` (`entryWalker.js:627`) overlap on a governed noun with the same band class between spine and modifier = restatement; the NEGATION limb is STRUCTURAL: the generator refuses a modifier whose `reads` names the spine's own key field (§2.4) | FAIL |
| the connective carries exactly its relation, and the relation is licensed | wall 1 only (`grammarWalker.js:363-368`, STATE before CAUSE); wall 5 declared and not implemented; `CONTRAST_SHAPES` counted | **A2 connective typing**: the joint's declared relation vs the RELATION TABLE row for (spine field, modifier field); `consequence`/`tension` with no row = FAIL; a row present but direction unread = WITHHELD. **A3 wall 5 as an arm**: `contrast` only where a sibling key or band names the rejected alternative, using `check-pair.mjs:47-59`'s `axisOf`/`bandSiblingsOf` | FAIL / WITHHELD |
| ≤ 2 sentences per composed unit; no which-tail; no third sentence (wall 6; R-DA-03) | `armF` F6 (`grammarWalker.js:380-387`) over the COMPOSED text | none — the arm already reads text; the walked entry becomes the composed unit (S17) | FAIL |
| STATE before CAUSE; ABSENCE never opens / never adjacent; no bare future (walls 1, 3, 2) | `armF` F1/F3/F2 | the composed order is DERIVED (spine tag + modifier moves, §2.6), so no tag vocabulary change (S20); the F3 case is made IMPOSSIBLE at candidate construction (S7) and the arm is the belt behind that brace | FAIL |
| no non-move in any piece (FORECAST, MEANING, VERDICT, FEELING, FIGURE, SAYING) | `armG` (`grammarWalker.js:401`) | none | FAIL |
| a turn is keyed on a typed explanation, never a fact conjunction (S16) | none | **A8 turn-key registry**: the generator refuses an `**EXPLAINS:**` id outside `TURN_KEY_REGISTRY` (§5.3); the walker reports every turn with its id and source | FAIL at projection |
| a fragment never renders alone; a sentence-form piece never joins by a connective | none (the "no markdown / no empty" arm cannot see a fragment) | **A9 fragment grammar**: `form: 'fragment'` rows must open lowercase, carry no terminal stop, name no standpoint token; `form: 'sentence'` rows must open with a capital and end with a stop; the composer joins only fragments | FAIL at projection |
| salience is a pure function of state and seed; ties broken by a documented key (S11) | none | **A4 salience determinism**: repeat-call identity per town; identical readings under different seeds foreground differently no more than the band permits; a weight table pinned by hash in the leaf | FAIL on non-determinism; REPORT the spread |
| the wording count per pool is fixed at the freeze; no append after (S9) | the variant ratchet (`…contract.test.js:277-278`) counts variants, not faces | the ratchet gains a FACE-COUNT PIN per pool (a face count that moves outside a declared shift reds) | FAIL |
| the composed corpus keeps its exemplar shape | `armThreeNumbers` (`grammarWalker.js:433`) with bands and the owner's numbers as arguments; presence measure reported | the walked unit is the composed unit, at the ENTRY grain (§6.6); bands stay outside the repo | FAIL past BUDGET/DEPTH; PERFECTION a finding |
| consecutive-pair statistics over what a reader meets | arms B1/B2/B3, NOT-EXECUTABLE without sequences (`grammarWalker.js:710-715`) | the composed-prose manifest run (A7, §12 car 1) doubles as the sequence generator: mounts in `DOSSIER_MOUNTS` order, classified by `orderIdOf` (report-only at 0.75–0.83) or by the derived order where tags exist | REPORT until tags ship; then FAIL |
| byte-identical dossier output before any text change | the generator golden master CANNOT see dossier text (`read-instruments §3`) | **A7 the composed-prose manifest**: N seeds × six composers through the shipped desk-read readings → `(seed, mount, block, pool, angle, pieces[], text)`; sha per seed; a re-record obeys the golden's five-step discipline (`generatorGoldenMaster.test.js:21-127`) | FAIL on drift |
| the gate is exhaustive per piece and SAMPLED per composition (S17) | R-DA-20's SIZE is one figure today | R-DA-20 SIZE becomes TWO figures: zero unresolved over every piece in isolation (exhaustive) AND zero unresolved over the enumerated compositions of the N-town sample, with N and the sample sha printed | FAIL |

**Where the instruments live is itself a finding the design must carry:** none of the above exists in the product tree — there is no `src/domain/prose/` at the product tip (`read-instruments §0`, executed). The gate described here can run in CI only after the INSTR-912 instruments LAND (a landing act with its own lighting-census ritual), so the sequence in §12 puts the landing before the first authoring car. Until they land, the wave's gate is a lane tool run by hand and its verdicts are receipts, not green.

**The name-collision fence:** `tests/lint/proseFamilyContract.walker.test.js` at the product tip is the chronicle's "four durable prose families" contract; the 4× wording group is never called a "prose family" in code (`read-instruments §0`). This design calls it a WORDING SET, field name `wordings`.

### 8.7 Refuters, the chair, and the beta as the panel

The refuters sample the composed 200-town run (never the pool dump): per block, the sampled compositions whose walker verdict is WITHHELD (every WITHHELD is a report the refuter owes an answer on — `entryWalker.js:874` `verdictOf`), plus a fixed random sample of PASS units (fault 32: rubric scores are reported, never gating; findings only). The chair rules on every finding at a sitting and the ruling is written into the annex row or the list. No blind DM panel is convened (Part B §17, line 632; ledger §912.6): the pre-launch acceptance is the checkers at the freeze, the refuters by sample, and the owner's walk; the beta's readers are the panel, and the signal the panel would have produced — the sentence a reader names as the tell — is a beta feedback surface (owner-gated, scheduled with the beta).

### 8.8 The same-seed TEXT shift — declared, sized, signed

THE PROMISE (W3): a same-seed FACT shift is forbidden; a same-seed TEXT shift is declared and owner-signed. This design produces exactly TWO declared text shifts, each proven by the manifest before it is signed, and NO fact shift anywhere (no persisted field moves; no generator byte moves; the composers read the same fields they read today plus fields their desk already reaches).

**Shift 1 — the REWRITE + FACES freeze (one shift for all 708 pools at once).** Every variant is rewritten to the voice and gains three faces in the one pass. Two things move: (a) the WORDING of every drawn variant (the rewrite itself, in place — A7/A17: the pool's length and key do not move, so the semantic index does not move); (b) the FACE, drawn on a NEW suffix key (§2.3) whose modulus goes from 1 to 4 — measured on the real leaves: the semantic variant is preserved on **100.00 %** of 141,600 reads under the two-level roll, and the face differs from face 0 on ~75 % (face-0 share 25.05 %; CONFIRMED, `draw-reroll.mjs`). The manifest diff arm prints, per changed cell, the spine's `(pool, index)` before and after — equal on every row is the proof that the shift is wording-only. Under the brief's default (the flatten), that proof is unobtainable: 54.79 % of reads change their ANGLE (`45.21 %` preserved, CONFIRMED), which is a shift in which standpoint speaks, not in wording. **The two-level roll is therefore the design, and the brief's question at line 27 is answered by measurement.** Owner signs once; the manifest header carries the shift record in the golden master's own five-step form.

**Shift 2 — the DS-DEF-11 re-key and the additive wave.** (a) The owner's own example: `wallRationalePoolKey` today short-circuits — `militaryGate < 1` returns `WALLED-STRAINED` before the monster family is consulted (`defenseStateProse.js:747-755`; the docblock at `:732-737` records the ordering as a vetoable JUDGMENT and invites the veto). The re-key (§6.2) makes STRAINED a modifier and keeps the STRAINED pool as the spine only where no family is measured. Towns that are walled, strained AND in a measured family move spine (THREATENED or QUIET) and gain the muster modifier — a REPLACED cell class; every other cell is ADDITIVE (the spine piece byte-identical, pieces added). The manifest classifies every moved cell as ADDITIVE or REPLACED and names the replaced ones individually. (b) The authoring wave lands modifiers and turns as NEW pools with NEW keys (the estate's proven zero-movement shape, CT-1a/2/3 — `…contract.test.js:198-236`), so spine draws never move; the composed text changes wherever a modifier now attaches or a turn now wins, and the manifest proves the class per cell. Owner signs the wave's text at the walk (Part B §15, line 614: every key's text is public copy, owner-signed).

**What this reverses, said plainly (the owner row):** Shift 1 is the FIRST change in this corpus's history that deliberately changes what an existing pool draws for an existing world (`read-instruments §2.5`: three content-train cars each landed as wholly new blocks to avoid exactly this). The face key is a suffix of the parent key, never a re-hash of a different string, so the parent never moves; and a face count is fixed at the freeze — a fifth wording later re-rolls the face for every world, so "never trim" is paired with "never append after the freeze; a new wording goes in a new key" (S9's corollary, adopted).

---

## §12 (LEAD) — THE IMPLEMENTATION SEQUENCE

Numbered in order; each with what it builds, its files, its proof (an executed arm), the register doors it moves, its acceptance criteria, and whether it is chair-decidable or owner-gated. Every car is `model: "opus"`; the chair rules; a car that cannot meet its acceptance lands as a measured refusal, never as a partial.

| # | car | builds | files (product tree unless marked) | proof (executed) | register doors | acceptance | decides |
|---|---|---|---|---|---|---|---|
| 0 | **INSTR car 8 — the wiring census** (commissioned) | `(block, pool) → {predicate, fieldsRead, slotsFilled, status}` both ways; MISSING/THIN/COVERED; co-occurrence by execution over the 200-town run through the shipped composers with real readings; the bag resolver corrected to nearest-in-scope | `skepINSTR: src/domain/prose/wiringCensus.js`, `tests/lint/proseWiringCensus.walker.test.js`, `tests/helpers/dossierComposedFill.js` (extend), the receipt | totality: exactly 708 rows; the five controls in the brief fire; the anti-vacuity arm; the three "twenty" censuses printed side by side | lighting census (instrument commit + register commit) | rows 708 (integer); RESOLVED + UNRESOLVED = 708; `noBag` = `UNMOUNTED_BLOCKS` (15); DS-DEF-4/-9/-11 and DS-POW-1 bags corrected as `read-facts §3.1` lists | chair |
| 1 | **the composed-prose MANIFEST (arm A7)** | `tests/property/dossierProseManifest.test.js` + `tests/fixtures/dossier-prose-manifest.json`: the golden's own 525-row corpus builder (`generatorGoldenMaster.test.js:802-847`) × the six composers through the SHIPPED desk-read readings (`generalDeskRead.js:176-210`, `PowerTab.jsx:200`'s shape; never `{}` readings — `dossierComposedFill.js:13-15`), audience dm AND player → per seed a sha over `(mount, block, pool, index, face, angle, text)` in `DOSSIER_MOUNTS` order; a `UPDATE_MANIFEST=1` door through `goldenRecordDoor.js`; the header's five-step shift discipline copied verbatim in shape | new test + fixture; `tests/helpers/` a readings-bag builder shared with the census | (a) base-side totality: 525 rows recorded, re-run drift `[]`; (b) the comparator can see: plant one variant text edit, exactly its cells move, restore; (c) the two audiences differ ONLY on cells whose pool carries a `dm-only` variant — on the player face the eligible list is shorter, so the modulus and therefore the index may move even for a public variant (`stateProseKernel.js:264-268`, `:304`); the count of such cells is printed and pinned, and a difference on any other cell is a leak | none (a new test file: the mutation-coverage manifest entry, by the lane's idiom) | 525 rows; zero drift on three consecutive runs; the plant control convicts; cost ≤ 30 s (ESTIMATE from 19 ms/town generate + 0.1 ms/town compose, CONFIRMED on the general desk) | chair |
| 2 | **the kernel + composer, BYTE-IDENTICAL** | `stateProseKernel.js`: `drawFace(variant, blockId, poolKey, seed)` over `1 + (variant.wordings?.length ?? 0)` on key `${seed}::${blockId}::${poolKey}::w` (modulus 1 today ⇒ face 0 ⇒ today's text); `composeStateProse.js` (new, pure): candidates → salience → bound → joint → draws → fill → arrange → one string; `poolMeta` sibling map read (all `role: spine`); the generator parses and emits the new annex lines (`**ROLE:**`, `**READS:**`, `**RELATION:**`, `**EXPLAINS:**`, `**FORM:**`, face sub-rows, `[grammar: Vn]` routed away from `marks`) — NONE authored yet; the contract test's `--check` moves with it; the `key={line}` collision in both `DeskLines` cured (`key` = mount + index) | `src/domain/display/stateProse/{stateProseKernel,composeStateProse,dossierMounts}.js`, `scripts/generate-dossier-state-prose.mjs`, `tests/data/dossierStateProseProjection.contract.test.js`, `tests/domain/stateProseKernel.test.js`, `src/components/new/tabs/EconomicsGlance.jsx:162`, `WarFaithDesk.jsx:122` | the manifest (car 1) byte-identical on all 525 × 2 audiences; the seven leaves byte-identical after regeneration except the emitted `poolMeta` (printed key-by-key: 0 ADDED / 0 REMOVED / 0 CHANGED pools); new kernel tests: face draw modulus-1 identity; a planted 4-face variant draws face 0 seedless (canonical-at-zero) and 25 % ± 2 SE per face over 10,000 seeds | none | manifest drift `[]`; contract test green with the new arms (face eligibility-identity; fragment grammar; the face-count pin at 1 everywhere) | chair |
| 3 | **the instruments LAND + the new arms** | INSTR-912's `src/domain/prose/*` and `tests/lint/*.walker.test.js` land in the product tree under their own ritual; then arms A1, A2, A3, A4, A5 (report-only), A6, A8, A9 as §8.6 | `src/domain/prose/{entryWalker,grammarWalker,moveGrammar,composedWalker}.js` (new: `composedWalker.js` — walks composed units from the manifest run), the walker tests, fixtures | each new arm has a positive control that convicts and a negative that passes (the Brackwater idiom); the anti-vacuity guard extended with a planted composition that manufactures a C2 duty+exemption pair from two innocent pieces | lighting census; mutation-coverage manifest | every arm NOT-EXECUTABLE where its input is absent (never `[]`); the sampled composed walk runs over the manifest's 525 towns and prints N and the sample sha | chair |
| 4 | **the SITTING — amendments before any text moves** | Part B §1.0's unit law (a COMPOSED-UNIT grain; every per-variant Figure re-anchored); R-DA-03 + wall 6 read for composed units as "two sentences, one joint" (§4.5 — exit iii-plus); R-DA-20's SIZE as two figures; arm J's spec (§4.6); the connective set with each member's band and licensing relation (§4.6); the relation table's four sources (§5.2); §16.2 gains a COMPOSED-UNIT row at the ENTRY numbers; §0b's palette gains `plain` for `role: modifier` rows only; the `{reason}` vocabulary (§5.4) put to the owner | `$SC/prose-research/RULES-V2-PART-B.md` (append-only), `sweep/MOVE-GRAMMAR.md`, `CLERK-LAWS.md`; the ledger | the sitting's rulings written; each numbered; each vetoable | ledger § | every strain S1–S20 of `read-specs §9` has a written disposition | chair rules; the owner sees §13's numbers |
| 5 | **the REWRITE + FACES wave** (desk by desk, block by block, as Opus workflows; four build lanes max) | every one of the 708 pools: k variants rewritten to the voice AND given three faces each, in one pass; `[grammar: Vn]` on every row; the `**READS:**`/`**ROLE:**` lines carried from the census card; THIN pools gain their second grammar; the 7 canonical rows and the 2 live-bound rows keep ONE face (§2.3) | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, the six leaves regenerated | per pool: check-pair parent→face ×3 with LONGER suppressed; `walkEntry` per face; A5/A6; arm A on tagged rows (n after the licensing filter); the manifest diff: semantic `(pool, index)` preserved on 100 % of cells, face moved on ≈ 75 %; the SPREAD/PERFECTION report per pool | the variant ratchet re-pinned (2,266 → 2,266 semantic; the face pin 1 → 4 per pool); size ratchet row (car 8) | zero FAIL; every WITHHELD ruled; the refuters' sample findings ruled; **Shift 1 signed** on the manifest diff | **owner-gated** (the signature; the shift; the wave's public text) |
| 6 | **the owner's example — DS-DEF-11 (+ DS-DEF-2's stock modifiers)** | modifier pools `muster: short` (militaryGate < 1), `stores: short` (foodSecurity.label ∈ {Deficit, Deficit × Active Famine}), `watch: compromised (revealed)` and `watch: compromised (covert)` [dm-only] as wording sets; `wallRationalePoolKey` un-short-circuited; `defenseWallRationaleProse` returns `{spineKey, candidates[]}` to the composer; DS-DEF-2's disaster row gains `stores: short` | `defenseStateProse.js`, the annex, `defense.generated.js`, `dossierMounts.js` (no row change) | the manifest diff names every REPLACED cell (walled + strained + measured family) and proves every other moved cell ADDITIVE; the composed walk over those towns: zero FAIL; the presence measure and arm E over DS-DEF-11 reported before/after | lighting census | the REPLACED list is finite and printed; the STRAINED pool remains reachable (family unmeasured) — never trimmed | **owner-gated** (the JUDGMENT reorder is invited in the docblock; the text moves on those towns — folded into Shift 2's signature) |
| 7 | **the AUTHORING WAVE** (block by block from the list, as workflows) | modifiers for every MISSING/THIN row; turns for registry-keyed pairs at or above the occurrence floor; every piece a wording set from birth | the annex; the leaves; the desks (a candidate function per modifier, in the key-function idiom) | per block: the manifest diff proves ADDITIVE (spine pieces byte-identical; pieces added) or names the REPLACED turn cells; the sampled composed walk; the repeat census (§7.3) | lighting census per landing; the variant ratchet re-pinned upward at every car | zero FAIL; WITHHELD ruled; the block's tier rows discharged and re-printed by car 8's command | chair per block once the class is signed; the wave's text owner-signed at the walk |
| 8 | **size, delivery, first paint** | a corpus ratchet row: raw bytes of the six leaves AND gzipped bytes of the `data-lazy-*` chunk; a first-paint guard: no `dossierStateProse` import reachable from an eager chunk (`vite.config.js:876-878`'s derived routing pinned by a test that names the chunk) | `scripts/.size-baseline.json` (a byte row, new kind), `tests/lint/sizeBaseline.test.js`, `tests/lint/vendorPdfLazy.test.js` (extend) | plant an eager import, the guard reds; the ratchet moves only with a declared row | size baseline | the leaf bytes at each freeze printed; the first-paint RAW margin re-measured (the brief's 5,878 B at the L-MAT tip is a receipt this design does not re-measure) | chair |
| 9 | **turn-key sources tier 2 — the persisted cause digest** | `settlement.causeDigest = {present: string[]}` from `presentCauseClasses(readCauseContext(...))`, written by the pulse and the generator; a slim persisted read that breaks the 546,887 B import wall (`defenseStateProse.js:1460-1468`) | schema, generator, pulse kernel, the golden master (the settlement object changes ⇒ every golden row moves ⇒ a declared FACT-SHAPE addition, not a fact change) | golden re-record with the five-step discipline; the digest equals the render-time derivation on 525 towns | golden master; schema | — | **owner-gated** (persisted shape; a seed input under THE PROMISE) — deferred until asked |
| 10 | **the list positions' per-instance discriminant** | conflicts, steadings, neighbours, engagements draw on `${seed}::${blockId}::${poolKey}` with no instance id, so two quarrels of equal intensity draw the same variant (`read-kernel §2`, `generalStateProse.js:1746-1761`); add `::${instanceId}` to the draw key on those four positions (the precedent: `OverviewTab.jsx:284`, `PowerTab.jsx:480`) | `generalStateProse.js`, `generalDeskRead.js` | the manifest names every moved row | — | a text shift on those rows | **owner-gated** (folded into Shift 2) |

**Order and gating, in one line:** 0 → 1 → 2 → 3 → 4 → 5 (Shift 1 signed) → 6 → 7 (Shift 2 signed at the walk) → 8 rides beside 5–7; 9 and 10 wait for the owner's word. Cars 0–4 move no reader-facing byte; car 2 is proven byte-identical by an instrument that exists only because car 1 built it.

---

## §13 (LEAD) — OWNER ROWS

Every decision below is the owner's; the chair recommends, the owner signs or vetoes. Numbers are stated plainly with what they bound.

1. **Shift 1 — the rewrite + faces freeze.** Sign the one-time same-seed TEXT shift over all 708 pools, proven wording-only by the manifest (semantic index preserved on 100 % of cells; measured on today's leaves at 141,600 reads). This reverses the standing landing pattern (new-blocks-only) for the first time.
2. **The roll shape.** The design takes the TWO-LEVEL roll (variant on today's key, face on a suffix key), not the brief's flatten default, because the flatten changes the angle on 54.79 % of reads. Veto returns the flatten and forfeits the wording-only proof.
3. **Face count fixed at four, forever, per pool.** "Never trim" plus "never append after the freeze": a later fifth wording goes in a new key. Veto means every later wording re-rolls every world's face for that pool, each time.
4. **Shift 2 — the DS-DEF-11 re-key, the additive wave, the list-position discriminant.** Sign at the walk, on the manifest's ADDITIVE/REPLACED classification. The docblock's own invitation ("Say 'veto' to reorder") is taken: STRAINED becomes a modifier.
5. **The OCCURRENCE floor: 5 % of the sample (10 of 200 towns; ≥ 27 of 525).** Below it a cell reads by composition only; a turn is authored only above it. Measured against the general desk's real distribution (56 cells; 9 below ten towns; 4 on every town). The six-desk figure on the golden's 525-row grid is car 0's; the number is the owner's to move.
6. **The salience weights and bands** (§4.3): notable = rate ≤ the floor, or a `tension` relation, or a typed recent change; two notables outrank the seed; within a band the seed orders. Weights are frozen data; a change is a declared shift.
7. **The sibling-distance floor (A5)** is set by measurement on the first two desks' wording sets before it gates — the owner sees the number and the four faces it would refuse.
8. **The composed-unit grain's BUDGET and DEPTH** take the ENTRY numbers (2/3 and 1.75 band-widths, PROVISIONAL on one author — Part B §16.2, line 637) until the seven raw exemplar texts are re-obtained (the owner's on cost and IP).
9. **The `{reason}` vocabulary.** `CAUSE_LABEL_OF` (`causeVocabulary.js:73`; fourteen bare-common noun phrases, e.g. "funds run short", "a hollowed-out garrison") is proposed as the fill vocabulary that lights DS-CND-1's traced pool and DS-STR-2's counterforce pool with no desk change (`stressorsStateProse.js:279-294`). Reader-facing words: the owner signs them.
10. **A persisted cause digest (car 9)** — a persisted-shape change and a seed input; deferred until the owner asks. Without it, turns are keyed on persisted conditions and on the two corruption reads only (§5.3).
11. **No guard-alignment axis exists** (`read-explanations §5`: no moral axis on an institution or faction; only the deity carries one). The design uses `criminalCaptureState` and `compromisedSecurityInstitutions` as the "dark guard" proxies and REFUSES to mint a field. If the owner wants a real axis, it is a persisted shape — an owner row on its own.
12. **`{band}` stays RESERVED** (`dossier-slot-shapes.mjs:32-39`): seven blocks name it and every such variant is dropped forever; splitting it into six named slots recovers authored prose and is a declared shift on an annex shape — deferred, listed.
13. **The causal register (R2) takes no wording sets in wave one**: the six-exactly arm (`…contract.test.js:285`) stands; the 468 dark sentences and the join-deriver they need are a separate wiring debt (§5.5).
14. **The composed-prose manifest's N** is the golden's 525-row grid (one instrument, one corpus builder). Veto for a smaller purpose-built set trades proof breadth for run time (≈ 30 s ESTIMATE either way).
15. **`plain` joins the angle palette for `role: modifier` rows only** (§2.6) — a §0b amendment the owner sees at the sitting.
16. **The first-paint byte ratchet does not exist** (`read-instruments` Q8); car 8 builds it. The prose corpus rides the lazy chunk today and must keep doing so; the owner is told the corpus grows from 641 KB to ≈ 2.2 MB raw (ESTIMATE) inside that chunk.

---

## §1 — PURPOSE, THE OWNER'S WANT, THE NON-GOALS

The owner wants prose that grows more specific with every relevant fact — a wall funded by an underpaid garrison, then the guard's standing, then whether its members are compromised, then whether the granaries are short — "getting more specific with every relevant combination", for "every single thing in a settlement in every aspect of its state", bounded so the corpus does not explode, so that "nothing will ever be stale, and if something is repeated, it is because that very specific instance is repeated" (ARCH-BRIEF lines 5–7). This design answers with pieces licensed by fields and combinations bought by a deterministic composer: a SPINE per primary fact, MODIFIERS per secondary fact joined by relation-typed connectives along the engine's own edges, hand-written TURNS only where the engine names the combination, every piece born as a wording set of four faces drawn by an unweighted seeded die, and a salience rule that foregrounds this town's two most notable secondary facts the same way on every visit.

**Non-goals, absolute:** no language model at render (THE PROMISE; the finite-semantics law's "AI = clerk, never writer"); no per-combination authoring beyond the occurrence floor; no fact change under any seed (no generator byte, no persisted field, no reading path moves — the composers read what they read today plus fields their desk already reaches, and the only new persisted shape is car 9, deferred and owner-gated).

---

## §2 — THE PIECE MODEL

### 2.1 The shape as shipped, and what is added

Today: `StateProseCorpus = Record<blockId, {title, sectionTarget?, arms?, slots, pools: Record<poolKey, Variant[]>}>` with `Variant = {angle, marks?, text, slots}` (`stateProseKernel.js:62-83`; `generate-dossier-state-prose.mjs:556-582`). There is no other metadata: no licence, no role, no relation, no grammar, no family id (`read-data §2.1`, field census executed there).

The design keeps `pools[key]` an ARRAY of variants (every reader — `eligibleVariants`, `poolDimensions`, `hasStateProsePool`, the causal reader, four test arms — indexes it as one; `read-data §6.3`) and adds two things: a SIBLING METADATA MAP on the block and a NESTED WORDING LIST on the variant.

```js
StateProseBlock = {
  title, sectionTarget?, arms?, slots,
  pools:    Record<poolKey, Variant[]>,               // unchanged shape
  poolMeta: Record<poolKey, PoolMeta>,                // NEW, sibling map; absent ⇒ {role:'spine'}
}
PoolMeta = {
  role:      'spine' | 'modifier' | 'turn',
  reads:     string[],        // canonical field paths, DERIVED by the wiring census, reconciled against **READS:**
  predicate: string,          // the census's recovered predicate as text, e.g. "economicGates.military < 1"
  relation?: 'addition'|'consequence'|'tension'|'contrast',   // modifier default; the relation table overrides
  move?:     string,          // modifier: the ONE move it adds (PRESENT|CONSEQUENCE|OBJECT|INSTITUTION|GEOGRAPHY|TRADITION|OPEN)
  explains?: string,          // turn: an id from TURN_KEY_REGISTRY
  spines?:   string[],        // turn: the spine keys it may replace ('*' = any of the block)
  covers?:   string[],        // turn: modifier keys whose facts it already states (they are not attached beside it)
  rateBp?:   number,          // the cell's occurrence share over the sample, basis points, frozen at the freeze
}
Variant = {
  angle, marks?, slots,
  text:      string,          // FACE 0 — today's text; canonical-at-zero
  wordings?: string[],        // FACES 1..3 — same claim set, same slots, same marks BY CONSTRUCTION
  grammar?:  'V1'…'V8',       // spine/turn: the authored tag (GRAMMAR_TAG_CONTRACT, moveGrammar.js:145)
  form?:     'sentence'|'fragment',   // implicit from role: modifier ⇒ fragment unless declared 'sentence'
}
```

**Why the sibling map and not a pool object:** the migration car must prove byte-identical DOSSIER OUTPUT with nothing but ADDED keys, and the array contract is what every reader and every test arm pins (`read-data §6.3`). A `poolMeta` entry with `role: 'spine'` and derived `reads` changes leaf bytes and changes no draw, which the migration car states in its own diff.

**Why nested wordings and not four siblings in the pool:** `eligibleVariants` filters by `marks` (audience, dimension words) and `slots` (anchored liveness) PER VARIANT before `% eligible.length` (`stateProseKernel.js:247-269`). Four flat siblings whose slots or marks differed would drop out on some towns and not others, and the one-in-four would silently become one-in-three (`read-data §6.4`; `read-specs S8`). Nesting makes eligibility-identity STRUCTURAL: one record, one mark set, one slot set, four surfaces. It also leaves `eligible.length` untouched, which is what keeps the semantic draw where it is.

### 2.2 The four piece kinds

| piece | what it is | keyed on | licence | grammar | draw |
|---|---|---|---|---|---|
| **SPINE** | today's pool: one whole sentence (or two, 28.3 % of variants — `read-kernel §8`) keyed on the block's primary fact | the pool key the desk's key function returns, exactly as today (118 functions) | `reads` from the census; the estate ground; arm D on its (block, pool) bag | its `[grammar: Vn]` tag, one of V1–V8 | `${seed}::${blockId}::${poolKey}` — UNCHANGED |
| **MODIFIER** | a FRAGMENT (lowercase opening, no terminal stop, no standpoint token) or, where declared, a full sentence, keyed on ONE secondary fact the same desk reads; authored once per block, attachable to any spine of the block | a new pool key in the SAME block, in the key-function idiom (e.g. `muster: short`) | `reads` = exactly one field path (plus the fills it names); the generator refuses a modifier whose `reads` intersects its block's spine key fields (the restatement/negation guard, structural) | one MOVE; the composed order is derived (§2.6) | `${seed}::${blockId}::${modifierKey}` — a new key, a seed input from birth |
| **TURN** | a whole unit (one or two sentences) for a combination the ENGINE names; it REPLACES spine + modifiers when eligible (the conjunction ladder's rung 1, `causeConjunctionContent.js:186-195`, generalised) | `explains: <registry id>` × `spines: [...]` | the spine's fields ∪ the explanation's own fields; a turn keyed on a covert source is dm-only by construction (W8) | its own `[grammar: Vn]` | `${seed}::${blockId}::${turnKey}` |
| **CONNECTIVE** | the joint between a spine sentence and a fragment modifier; a phrase list per relation, authored under the register card, in its own leaf | relation ∈ {addition, consequence, tension, contrast} | the RELATION TABLE row for (spine field, modifier field) — a connective may not add a claim (W2) | none; it is a joint | `${seed}::${blockId}::${spineKey}::joint::${modifierKey}` over the relation's list |

### 2.3 The wording set and the face draw

```js
// stateProseKernel.js (car 2)
export function drawFace(variant, blockId, poolKey, seed) {
  const faces = 1 + (Array.isArray(variant.wordings) ? variant.wordings.length : 0);
  if (!seed || faces === 1) return 0;                                   // canonical-at-zero; modulus 1 today
  return avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}::w`)) % faces;
}
// readStateProse: const face = drawFace(variant, blockId, poolKey, seed);
//                 const raw  = face === 0 ? variant.text : variant.wordings[face - 1];
```

The face key is the parent key plus `::w` — a SUFFIX, so the parent hash is a different string and never moves (measured: 100.00 % semantic preservation; face-0 share 25.05 % over 141,600 draws — CONFIRMED). The draw is unweighted by construction (the same avalanche hash the kernel already trusts, `stateProseKernel.js:29-35`); rhythm and variety come from AUTHORING (a set spans the length classes) and from the GATE (A5), never from weighting — the chair's rhythm-aware draw is withdrawn (ARCH-BRIEF line 28).

**Three rows keep one face, by refusal:** the 7 `canonical` variants (byte-copies of engine strings, `read-data §3.4`) and the 2 live-string-bound rows (`economy.generated.js:1007`, `:1035`) — re-voicing a bound engine string forks the string. They are printed in the wave's list as `NO-FACES: bound`.

### 2.4 The annex grammar (what the writer types; what the projection reads)

The generator already has the exact pattern for a typed metadata line — `^\*\*NAME[:.]\*\*` scraping backticked tokens and throwing on an unknown one (`generate-dossier-state-prose.mjs:326-348`, `assertSectionTargets` `:533-554`). The design copies that shape and invents no second one (`read-data §6.5`).

```
**`muster: short`** — *the paid muster is short of its funding*
**ROLE:** `modifier` · **FORM:** `fragment` · **MOVE:** `CONSEQUENCE`
**READS:** `defenseProfile.economicGates.military`
**RELATION:** `consequence`
1. `[plain]` and the muster behind it is thinner than the wage roll says
   - `[face]` and the wage roll behind it is short of the men it names
   - `[face]` while the men who should stand on it are fewer than their pay
   - `[face]` and what the town pays its watch does not keep the watch whole
2. `[plain]` …
```

Parser deltas, each a small branch beside the existing one: `**ROLE:**`, `**FORM:**`, `**MOVE:**`, `**READS:**`, `**RELATION:**`, `**EXPLAINS:**`, `**SPINES:**`, `**COVERS:**` (closed vocabularies; an unknown token throws); a FACE sub-row regex `^\s+-\s+`\[face\]`\s+(.*)$` under a numbered row, folded into `wordings[]` (the numbering guard `:406-411` is untouched because faces are not numbered rows); `[grammar: Vn]` on the optional second-tag group routed to `variant.grammar` instead of `marks` (or `STATE_MARK_DIMENSIONS`'s contract reds — `moveGrammar.js:151-157`); the drop-check `assertNothingDropped` (`:432-452`) extended to count face rows, or the parser's one real guarantee shrinks. `cleanText` strips the italic asides as today. Uniqueness per block stays an error (`:565`).

**The connective leaf** is a seventh emitted file, `src/data/dossierConnectives.generated.js`, projected from a new annex section in the causal annex's §7 idiom (`RECEIPT_POOLS_CAUSAL_DOSSIER.md:1982-2020` — twelve connectives each licensed by an EDGE, "chosen by the typed provenance edge, never by the music"): `{relation → phrase[]}` with a DEFAULT per relation (the totality floor `discourseKernel.js:188-190` models it). The dossier's phrases are its own; the chronicle's colon-bridges are not reused (a register breach — `read-data` Q7).

### 2.5 How today's 708 pools MIGRATE — zero text change first

Car 2 emits `poolMeta[key] = {role:'spine', reads, predicate}` for every pool from the census (car 0) and nothing else; no `wordings`; no tags. Every reader indexes the same arrays; `drawFace` returns 0 everywhere; the manifest is byte-identical on 525 × 2 audiences. Then, per block, in the wave: the rewrite+faces (Shift 1) keep every key and every length; modifiers and turns are NEW keys (moves nothing that exists); DS-DEF-11's re-key (car 6) is the one place an existing key's REACH changes, and it is named.

**Same-block confinement** is the migration's cheapest lawful reading and the brief's own method ("attachable to any spine of the block"): a modifier is a pool of the block whose spine it modifies; the C3 mount law (one SENTENCE rung per block per page-set, `dossierMounts.js:26-52`) holds because the composed unit is ONE rung; the registry gains no row and no rung kind; arm D keys on the same (block, pool) bag it keys on today. A fact that two blocks want (the muster on DS-DEF-11 and on DS-DEF-2's invasion row) is authored as a modifier in each — the same field, two blocks' angles — and the cross-block echo rule (§4.8) keeps one page-set from saying it twice. A cross-desk modifier reservoir with a `modifier` rung in the registry is the wave-two extension, owner-visible, not taken now.

### 2.6 Grammars per piece, and the derived order of a composed unit

A spine carries `grammar: Vn` (authored; arm A gates on it and reports on untagged rows — SITTING §K.2). A modifier carries ONE move (`MOVE:`). A composed unit's order is DERIVED: `spine.order ++ [modifier.move …]` in attachment order; a turn carries its own tag. No tag vocabulary is extended (S20 discharged). The walls then apply directly to the derived order: STATE precedes CAUSE (a CONSEQUENCE modifier attaches after the spine by construction — W-O1); ABSENCE never opens and never sits beside another ABSENCE (an ABSENCE-move modifier is refused outright as an ADDED piece: R-DA-08's "replacing a sentence, never added", and the V3 LACK class is not demonstrable — `read-specs §4`; so `MOVE: ABSENCE` is not in the modifier vocabulary); the last move is a standing fact the table could act on (W-O7 — a modifier's move is PRESENT/CONSEQUENCE/OBJECT/INSTITUTION/GEOGRAPHY/TRADITION/OPEN, every one a standing fact; OPEN is NOT-EXECUTABLE until a typed unresolved field exists, SITTING A12).

**The modifier angle.** A fragment is STANDPOINT-NEUTRAL by law (no "a stranger", no "nobody here", no elder's maxim) and carries the angle word `plain`, added to §0b's palette for `role: modifier` rows only (owner row 15). Spines and turns keep the eight angles. The composed unit's angle is the spine's, and the manifest's angle census is the spine census — which is why this wave buys wording variety and NO angle variety (`read-instruments` Q10, said out loud): the angle imbalance measured on my 200-town run (visitor 1033 / street 1028 / ledger 946 against unfolding 34) is the authoring's imbalance showing through a uniform draw, and only authoring in the thin angles moves it.

---

## §3 — THE WIRING CENSUS AS THE SOURCE OF TRUTH

**Both directions, one table** (car 0; `brief-INSTR-912-car8.md` and its addendum). Pool → fact: `{block, pool, predicate:{field, op, value}[], fieldsRead, slotsFilled, status: RESOLVED|WIRING-UNRESOLVED}` recovered by STATIC READING of the 118 key functions' bodies and the composers' bags (never inferred from prose); fact → text: for every held fact and every co-firing pair, the pools, variant count and grammar count that can speak to it; the tiers MISSING / THIN / COVERED per block.

**What the design adds to the car's contract:**
1. `poolMeta.reads` in the leaf is EMITTED FROM the census (the generator takes a CHECKED-IN census JSON — `docs/content/wiring-census.json`, regenerated by the instrument's script and `--check`-gated like the leaves — as an input beside the annex; it never imports `wiringCensus.js`, so car 8's fence that no file under `src/` outside `src/domain/prose/` imports the census holds by construction) and RECONCILED against the annex's `**READS:**` line; a mismatch is a projection error, never a silent win for either side. The annex line exists so a writer sees the licence; the census exists so the licence is true.
2. A WIRING-UNRESOLVED pool cannot host a modifier and cannot be a turn's spine: composition attaches only to RESOLVED spines. The pool renders as today. The list prints `NO-LIST-ROW: wiring first`.
3. The label trap is a census arm: a pool whose key is built from a producer TOKEN mapped through a table (`dossierMounts.js:73-88` records `indebted` → `INDEBTED TO AN OUTSIDE POWER`, `religious_conversion` → `RELIGIOUS CRISIS`, `heartland` → `settled`) is RESOLVED only when the map is asserted total in both directions; 350 of 708 keys appear verbatim nowhere in a desk (`read-data §4`, `literal-keys.mjs`), so the census must resolve ≈ 350 keys no grep can join — its size, stated.
4. **Regeneration and gating:** `node scripts/wiring-census.mjs --check` (a new script beside `gen:dossier-prose`) regenerates the census JSON and fails the gate on a stale byte, exactly as the leaves are gated (`generate-dossier-state-prose.mjs:706-713`); the census is re-run at every car that touches a key function, a bag or the annex, and its totality arm asserts the integer 708 (then the grown count) — never `> 0`.
5. **Co-occurrence by execution** is taken through the composer layer with the readings bag reconstructed as the desk-read callers build it (`occurrence-probe.mjs`'s shape; `read-instruments §4.4`) — the desk's return value strips provenance and `{}` readings select the absence pools for every seed (the taste-sample hazard). My run's shape (six tiers round-robin, one culture/terrain/route) is a feasibility probe; the census runs on the golden's 525-row corpus builder so terrain, culture, route and threat all vary.

---

## §4 — THE COMPOSITION ALGORITHM

`composeStateProse(corpus, blockId, input, options)` — pure, headless, no clock, no RNG, imports only the kernel; lives beside it in `src/domain/display/stateProse/composeStateProse.js`. The desk still "maps LIVE STATE to a POOL KEY and nothing else" (`economyStateProse.js:48-55`): it now returns a spine key AND a candidate list, each candidate a modifier key with three typed notability inputs.

```
input = {
  spineKey: string,
  candidates: [{ key, change: 0|1 }],       // one per modifier pool whose predicate holds; `change` from a typed change record only
  turns:      [{ key }],                     // one per turn whose registry id holds for this town
  slots, seed, audience, dimensions,
}
```

**Step 1 — readings → spine key.** Unchanged: the key function returns the spine key or `null` (`null` ⇒ the block renders nothing, R-DST-K).

**Step 2 — candidate modifiers.** Each modifier pool of the block has a candidate function in the key-function idiom (`musterShortCandidate(militaryGate) → 'muster: short' | null`); the desk collects the non-null ones. A candidate whose pool partitions itself by a demoted dimension the caller has not answered is silent BY ITSELF (`poolDimensions` is per pool, `stateProseKernel.js:215-224`; kernel law 5 per pool) — the spine is untouched (answers `read-facts` Q6).

**Step 3 — salience.** Every candidate scores deterministically from three signals: DEPARTURE = the cell's rarity, `rateBp` from `poolMeta` (frozen at the freeze from the census sample; rarer is more notable); TENSION = 1 when the relation table's row for (spine field, candidate field) is `tension`; CHANGE = the candidate's typed change flag (a condition's `direction: worsening`, `populationTrend.band`, a pulse-stamped recent transition — never a clock, never a render counter). All integer arithmetic (basis points; no float, no transcendental — `src/domain/**`'s ban, `grammarWalker.js:125-131`). Candidates fall into two BANDS: NOTABLE = (rateBp ≤ floorBp) ∨ TENSION ∨ CHANGE; ORDINARY otherwise. Within a band the order is a seeded permutation on `${seed}::${blockId}::${spineKey}::salience` (a new key, a seed input from birth). So a rare or tense or changed fact always outranks an ordinary one — the same on every visit (THE PROMISE) — and two towns holding the same two ORDINARY facts foreground them differently by seed (the brief's SALIENCE row, both halves). Weights and the floor are frozen data in the leaf; a change is a declared shift (S11).

**Step 4 — the bound.** The unit is at most TWO sentences with at most ONE joint (§4.5). Capacity is computed from the drawn spine: `spineSentences ∈ {1, 2}` (the estate's segment counter, `grammarWalker.segmentCount`), `spineHasJoint` (a `;` or `:` already inside sentence one — 386 variants carry a semicolon, `read-kernel §8`). A fragment modifier takes the joint of sentence one if `!spineHasJoint`; a sentence-form modifier or a turn takes sentence two if `spineSentences === 1`. So the attached count is 0, 1 or 2 as the DATA allows (S18: never "always two"), and never four pieces in a unit.

**Step 5 — turn eligibility.** If any `turns[]` entry's pool lists this spine key in `spines` and passes audience, the highest-ranked turn (registry order, then seed) REPLACES the spine and the modifiers it `covers`; uncovered modifiers may still attach under Step 4's capacity against the turn. A turn keyed on a covert source is dm-only and truncates to silence on the player face (W8) — the composition then falls to spine + modifiers for that audience, so a player page over a covert state is byte-identical to a page over a state that lacks one (kernel law 2).

**Step 6 — connective choice.** relation = `RELATION_TABLE[(spineField, modifierField)] ?? poolMeta[modifierKey].relation ?? 'addition'`. `addition` needs no edge and claims nothing beyond the two facts (arm J: it consumes no triple). `consequence` requires a row sourced from an engine edge; `tension` a row from a contradiction type or a ratified axis pair; `contrast` is lawful only under wall 5 (a sibling key or band of THIS block names the rejected alternative) and never as the closing move of more than one variant per pool. The phrase is drawn on the joint key over the relation's list (frozen length).

**Step 7 — variant and face draws.** Spine: today's key, then `drawFace`. Each attached modifier: its own key, then its face. A dropped candidate changes no modulus of anything drawn — every draw is per pool on a fixed-length eligible list, which is why attachment can be a function of state without being a seed input.

**Step 8 — slot fill.** Per piece, with the block's bag (anchored liveness per piece; a modifier naming an unfillable slot drops itself, and its place goes to the next candidate in rank — deterministic). `fillSlots` performs no capitalisation (`stateProseKernel.js:280-289`); the fragment grammar guarantees no fragment is sentence-initial and no fill opens a sentence that was not authored to open with it.

**Step 9 — arrangement.** `spine.sentence1` (terminal stop removed) + joint + fragment + `.` [+ ` ` + sentence-form piece]. The joint token set is the connective leaf's; the semicolon and the colon are rationed by band (R-DA-06; S12), the em dash is banned (B-DASH), the which-tail is banned (wall 6), so the joint is a comma-plus-connective by default and a semicolon only where the relation list authors one.

**Step 10 — the coherence pass** (deterministic; reads state and frozen tables only): (a) no restatement/negation — structural at projection (a modifier never reads its spine's key field) and A1 at the gate; (b) sibling agreement across blocks — at the gate, `armC5` runs with `ground.siblings` = every sentence on the page-set for the sampled town (band-per-noun; small particulars may differ, CLERK-LAWS C5); (c) the cross-block echo rule (§4.8).

**The output** is `{blockId, poolKey: spineKey, angle: spine.angle, text: <one string>, pieces: [{role, key, index, face}]}`; `legibilityRung.sentence` stays one string, `drawnAtMount` (`dossierMounts.js:581`) strips `sentence` and `provenance` on a glance row as today, and `provenance` grows `pieces` INSIDE the object it already strips, so nothing leaks past the glance gate (`read-kernel §12` item 3). `DeskLines` renders one `<p>` per unit as today.

### 4.5 The sentence bound, and which exit S2 takes

R-DA-03 (the qualification gets its own sentence, never a tail, never a third) and wall 6 (never a third sentence; never a which-tail) are dossier walls. The design takes exit (iii)-plus of `read-specs S2`: a composed unit is at most TWO sentences; ONE fragment modifier may join sentence one through a typed connective (a joint, not a tail — no `, which`); ONE sentence-form modifier or turn may take sentence two, as its own sentence (R-DA-03 satisfied to the letter). "Spine + two modifiers" is therefore two sentences and one joint — three facts, never three sentences. The sitting (car 4) writes this reading into R-DA-03 and MOVE-GRAMMAR §1.4 wall 6 together; R-DA-03's Figure (`, which` 0.066 → ≤ 0.010; the 2nd-sentence summary 0.035 → 0.000) is untouched because the joint never uses `which` and the second sentence always names a second field (arm Q passes by construction — S14).

### 4.6 Arm J and the connective set

Arm J (Part B §10 item 13): no sentence exists to connect two others. A connective that carries a RELATION exists to connect two facts; it is licensed only when the relation resolves to a typed triple — which is the RELATION TABLE row. So: `addition` consumes no triple (it asserts the conjunction of two licensed facts and nothing more); `consequence` and `tension` consume the triple `(relation, spineField, modifierField)` from the table; the unit's sentence count (≤ 2) never exceeds its licensed units (spine moves + modifier moves + relation triples), so arm J passes by construction and its spec (owed, chair M-5) is written by the sitting as exactly this. The connective set is published with each member's relation, its band (`punctuation.semicolonRate`, `colonRate` from the 21 rates; `sameOpenerAsPreviousRate` for the sentence-form second sentence) and the joints-per-unit figure the manifest run prints (S12).

### 4.7 Determinism, stated as the kernel states it

"Eligibility is a function of the state alone, and the draw is a function of the seed and the pool identity alone" (`stateProseKernel.js` docblock). Composition adds: attachment is a function of the state and of frozen leaf data; ranking within a band is a function of the seed and a new documented key; every draw is per pool on a fixed-length list. Nothing reads a clock, a counter or a cache. A4 asserts it at the gate.

### 4.8 The cross-block echo rule (bounded)

One page-set may state one (field, value) modifier at ONE position: when the same modifier fact fires in two blocks of one page-set, it attaches at the first mount in `DOSSIER_MOUNTS` order (the registry is an array so page order survives, `dossierMounts.js:526-532`) and is withdrawn from the later block's candidates before ranking. Deterministic (state + a frozen order), seed-free, and it removes no eligible variant from any drawn pool. The echo census (§7.3) reports the rule's firing rate per page-set.

---

## §5 — THE EXPLANATION SEAM

### 5.1 What the engine holds today (cited to `read-explanations`, code re-read where it binds)

Twelve per-entity explainers behind `explainEntity` (`src/domain/explanation.js:1131`; `EXPLAINABLE_TYPES` `:139-152`), all COMPUTED AT RENDER, with exactly one production caller (`counterfactual.js:203`, `:244`) and none in any composer; a persisted `simulationTrace[]` (generation only); persisted `activeConditions[]` with `causes[]`, `triggeredAt`, `affectedSystems`; a 16-variable causal substrate with signed contributors, NOT persisted and costing 546,887 B / 28 files to import into a dossier tab (`defenseStateProse.js:1460-1468`); the closed 14-class CAUSE vocabulary with presence predicates (`causeVocabulary.js:45-64`, `:165-228`, `presentCauseClasses` `:232`); six contradiction detectors, three classed `interesting_tension` (`contradictions.js:141, :169, :193, :235, :269, :313`); the shipped conjunction ladder (`causeConjunctionContent.js:186-195`, full → role → class → floor, hashed on `${seedId}::${key}` `:212`, live on the NPC card); and the authored, projected, dark causal register (78 families · 468 variants · 105 arms; no importer — `read-explanations §7.2`). Not one of the six composers imports `explanation.js`, `causalState.js`, `trace.js`, `corruption.js` or `causeVocabulary.js`; the single causal read is `conditionProvenancePoolKey` (`stressorsStateProse.js:242-250`).

### 5.2 The RELATION TABLE — the four sources a relation may be typed from

A frozen leaf, `src/data/dossierRelations.generated.js`, projected by a script from the engine's own tables (never hand-typed rows, except source (d)), keyed `(fieldA, fieldB) → {relation, source, direction}`:
- (a) condition archetype → system variable edges, READ THROUGH the normaliser `canonicalAffectedSystems` (`stressorsCore.js:410`; the raw catalog carries `faction_stability` and `tax_revenue`, which are not variables) — 46 archetypes, 131 edges (`read-explanations §4.1`, executed there) → `consequence`;
- (b) the `CAUSE_SIGNAL` rows (`causeVocabulary.js:165-228`: which state read makes which named mechanism present) → `consequence`;
- (c) the generator's recorded rules where a field is derived from another — the wall/garrison edge is `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)` degrading `scores.military` and persisted as `economicGates.military` (`defenseGenerator.js:189-191`, `:467-472`) → `consequence`;
- (d) the six contradiction types classed `interesting_tension` and RATIFIED AXIS PAIRS (a sitting act with the engine edge or generator rule cited per row) → `tension`.
A modifier whose (spine field, modifier field) has no row joins by `addition` — the claim-free default. `contrast` is never a table relation; it is wall 5's.

### 5.3 TURN-KEY REGISTRY — what a turn may be keyed on today, and the refusal

| tier | id form | source | persisted? | cost at the dossier | standing |
|---|---|---|---|---|---|
| 1a | `condition:<archetype>[:<severityBand>]` | `activeConditions[]` (46 archetypes; `deriveActiveCondition` normalises) | yes | the stressors desk already reads it | AVAILABLE |
| 1b | `corruption:revealed` / `corruption:covert` | `compromisedSecurityInstitutions(settlement) → {covert, revealed}` (`corruption.js:663-692`; watch/garrison/constab/guard/magistrate/court/barracks by `SECURITY_INSTITUTION_RE :630`) | computed from persisted parts | the closure of `corruption.js` into a desk is UNMEASURED — the car measures it by the same import walk the defense desk used and refuses above the 293,079 B precedent | AVAILABLE if the closure is small; covert is dm-only by construction |
| 1c | `contradiction:<type>` | `detectContradictions` (six types) | render-time | closure UNMEASURED (`surplus_but_capacity_critical` reaches the capacity model) | measure first |
| 2 | `cause:<class>` (14) | `presentCauseClasses(readCauseContext(...))` | NO — needs the 16 scores | 546,887 B / 28 files — REFUSED at the dossier | **REFUSED until car 9's persisted digest** (owner row 10) |
| 2 | `join:<familyId>` (78) | the causal register's join-deriver from `causes[]` / `sourceEventId` | the deriver does not exist | — | **REFUSED: no deriver; a separate wiring debt** |

The registry is a frozen list in the generator; `**EXPLAINS:**` outside it throws (A8). This is the arm that keeps a turn from being a MEANING move with a good vocabulary (S16): "the gate is sold" is a lawful turn keyed `corruption:revealed` on the spines `WALLED-*` and `Invasion & War: walls AND professional garrison`; "a town that has forgotten its walls" is not a turn, because no field holds what a fact means.

### 5.4 The `{reason}` seam — the cheapest real win, put to the owner

`{reason}` has no producer in the tree; three routed pools are silent on it (DS-CND-1's traced provenance, DS-STR-2's counterforce source, DS-DEF-7's two contributor pools) and the composer's own note says "rule a `{reason}` fill vocabulary and the pool lights with NO desk change" (`stressorsStateProse.js:279-294`). `CAUSE_LABEL_OF` already holds fourteen bare-common noun phrases (`causeVocabulary.js:73`). The design proposes them as the vocabulary (owner row 9); it also gives the connective leaf its causal noun set. The alternative the defense desk names — a noun-phrase `cause` beside `reason` on `CausalContributor` — changes a shape twelve derivers write (`defenseStateProse.js:1490-1492`) and is not taken.

### 5.5 How an explanation's absence degrades

A steady state with no event, no condition and no contributor has NO explanation record (`read-explanations §8`) — the majority state of a fresh settlement. The ladder handles it: no registry id ⇒ no turn ⇒ spine + modifiers ⇒ spine alone ⇒ silence (R-DST-K). No rung is ever written empty (ruling 4, the full form). A turn is never keyed on the explanation's PROSE (`causalReason`, `CausalContributor.reason` are finished sentences); only on its typed id. The causal register's 468 sentences are neither the turns nor retired: they are the R2 register awaiting its join-deriver (owner row 13).

---

## §6 — THE BOUNDS, WITH THEIR NUMBERS, AND THE ARITHMETIC ON THREE REAL BLOCKS

### 6.1 The bounds

| bound | number | how it was set | binds |
|---|---|---|---|
| OCCURRENCE | a cell earns hand-written text (a turn, or a bespoke spine for a pair) only at ≥ **5 % of the sample** (10 of 200; ≥ 27 of 525); below it the pair reads by composition | against the general desk's 200-town distribution (CONFIRMED): 56 cells; below ten towns: 9 (2 + 2 + 1 + 1 + 3); on every town: 4; the six-desk figure on the golden grid is car 0's | owner row 5 |
| DEPTH | pairs by default (spine + one fragment in the joint); a triple only as spine + joint + a second-sentence piece; never four pieces | structural: two sentences, one joint (§4.5) | wall 6, R-DA-03, R-DA-06 |
| RELATION | `consequence`/`tension` only along a RELATION TABLE row from the four sources (§5.2); `addition` free; `contrast` under wall 5 | the engine's edges; a sitting ratifies (d) | arm J, A2, A3 |
| LICENSING | `reads` ⊆ the block's census fields; arm D per (block, pool); estate ground exhaustive per piece; per-settlement claims WITHHELD to refuters; a composition cannot manufacture a claim its pieces lack (A1, the composed C2 control) | the wiring census; the entry walker | W1 |
| the exemplar numbers | REGISTER/TAB/POOL: BUDGET 1/3 (expected 1/6 reported), DEPTH 0.5; ENTRY and the COMPOSED UNIT: BUDGET 2/3, DEPTH 1.75 (PROVISIONAL, one author); PERFECTION at every grain | Part B §16.1 line 624, §16.2 line 637 | armThreeNumbers |
| the sibling-distance floor | to be MEASURED on the first two desks' wording sets (L1 over the 21 rates; opener inequality; segment spread) before it gates | A5 | owner row 7 |
| the face count | four per variant, fixed at the freeze | the owner's rule; S9 | owner row 3 |

**A caution on my sample:** the 200-town run varies tier only (six tiers round-robin; culture germanic, terrain grassland, route road), and it walks the general desk alone; its 56 cells are a LOWER bound on the general desk's live cells and say nothing about the other five desks. It is enough to see the distribution's shape (a hard core, a thin tail) and to set a floor against; the number the wave uses comes from car 0 on the golden grid.

### 6.2 Worked block 1 — DS-DEF-11 · "Why the wall, and why not" (the owner's walls example)

**As shipped (CONFIRMED, `_c-dump.mjs`; annex `RECEIPT_POOLS_DOSSIER_STATE.md:5963-5996`):** 5 pools / 12 variants; slots `{settlement}` `{defwork}`; mounted at `defense.wallRationale` as a sentence rung (`dossierMounts.js:361`); key function `wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)` — the corpus's ONE four-fact key (`defenseStateProse.js:747`); the desk `defenseWallRationaleProse` (`:774`) reads `standingDefenseForces(settlement).walls.present` (the live roster, never the frozen snapshot — `:376-381`), `config.monsterThreat`, `defenseProfile.economicGates.military`, `tier`.

| pool | n | angles | sentences | words |
|---|---|---|---|---|
| `WALLED-THREATENED` | 3 | ledger/street/visitor | 1/1/1 | 21/19/15 |
| `WALLED-QUIET` | 3 | visitor/elder/ledger | 1/1/1 | 21/21/21 |
| `WALLED-STRAINED` | 2 | ledger/unfolding | 1/1 | 18/23 |
| `UNWALLED-SMALL` | 2 | street/visitor | 1/1 | 20/18 |
| `UNWALLED-LARGE` | 2 | counterforce/ledger | 1/1 | 26/21 |

The STRAINED pool is the owner's sentence already ("stone keeps itself, and wages do not" — the ledger variant's close), and it silences the country: once `militaryGate < 1` the family is never consulted (`:748-755`), so a strained frontier town and a strained settled town read the same two lines.

**Migration (car 2):** every pool `role: spine`; `reads` = `[standingDefenseForces.walls.present, config.monsterThreat, economicGates.military, tier]`; zero text change.

**Re-key (car 6) and the pieces:**
- spines: `WALLED-THREATENED` (family ∈ {plagued, frontier}), `WALLED-QUIET` (settled), `WALLED-STRAINED` (walls, gate < 1, family UNMEASURED — kept, never trimmed), `UNWALLED-SMALL`, `UNWALLED-LARGE`;
- modifier `muster: short` — reads `economicGates.military`, predicate `< 1` (absent ≠ 1.0: no paid stack, `defenseGenerator.js:465-468` — the "default wearing a reading's clothes" test, `dossierMounts.js:53-71`), relation `consequence` by source (c), move CONSEQUENCE (structural), form fragment, angle `plain`, 3 variants × 4 faces;
- modifier `stores: short` — reads `economicState.foodSecurity.label` ∈ {Deficit, Deficit × Active Famine} (a field the defense desk already reads for DS-DEF-6; PRESENT of a short stock, never the ABSENCE of a granary), relation `addition` (no row between the wall and the stock), 3 × 4;
- modifier `watch: compromised (revealed)` — reads `compromisedSecurityInstitutions().revealed.length > 0`, relation `tension` by source (d) once the sitting ratifies the axis pair (a manned wall × a bought watch; the engine edge is `patronageSecurityDrag`, `corruption.js:702-709`), 3 × 4;
- modifier `watch: compromised (covert)` — the same read on `.covert`, `dm-only` on every face (W8), 3 × 4;
- turn `corruption:revealed` on spines `WALLED-*` — "the gate is sold" — a whole unit, 3 × 4, `covers: [watch: compromised (revealed)]`; AUTHORED only if the cell's occurrence on the golden grid is ≥ the floor (car 0 decides; below it the pair reads by composition and the turn row is `NO-LIST-ROW: below the floor`).

**A town that is walled, on a frontier, with a short muster, a revealed bought watch and short stores:** spine `WALLED-THREATENED` (3 × 4) + joint (consequence list, ~3) + `muster: short` (3 × 4) + sentence two `watch: compromised (revealed)` in sentence form or the turn if authored (3 × 4); `stores: short` ranks third and waits (the salience bands: the tense fact and the rare fact outrank the ordinary one). Distinct surfaces for this ONE state cell: 12 × 3 × 12 × 12 = **5,184** (ESTIMATE from the piece counts; a face count of 4 assumed on every piece). State cells the block can now speak: 5 spines × (0, 1 or 2 of 4 modifiers, ordered by rank) ≈ 5 × (1 + 4 + 6) = **55**, from **12 + 12 = 24 semantic pieces (96 wordings)**. The hand-cut alternative for the same reach: 5 spines × 2⁴ modifier states = 80 pools × 3 variants = 240 variants (960 wordings), and every new fact doubles it. That is the linear-versus-exponential claim, on the owner's own block.

### 6.3 Worked block 2 — DS-DEF-2 · "Threat assessment (the five readiness rows)"

**As shipped (CONFIRMED):** 26 pools / 78 variants, EVERY pool exactly 3 variants; slots declared `{settlement, band, route}` but every variant names `{settlement}` alone (`band` and `route` are two of the 69 declared-unused slots — `read-data §3.3`); five lenses at one mount (`defense.threatAssessment`, `DefenseTab.jsx:113`), each already a hand-cut cross-product: Beasts & Monsters 7 pools from family × perimeter × force (`beastsRowPoolKey`, `defenseStateProse.js:283`), Invasion & War 6 from walls × garrison × militia (`:309`; total over 8 combinations), Internal Security 4 from court × prison, Economic Survival 4 bands, Disasters & Famine 5 from granary × hospital × church (`:359`).

**Migration:** 26 spines, zero text change. **The lift:** the rows stay five rungs at one position (the DS-GEN-6 shape, blessed); the model adds what the rows cannot say: the invasion row's `muster: short` (the same field as DS-DEF-11's — authored here in the invasion row's own idiom; the echo rule (§4.8) lets only the first mount say it), the disaster row's `stores: short` and `stores: import-fed` (`foodSecurity.label` = Import-Dependent) — the owner's "granaries are lacking" as the STOCK behind the building the row already names; the beasts row's `watch: compromised (revealed|covert)` as tension. Pieces: 78 spines (rewritten, faced) + 5 modifiers × 3 = **93 semantic pieces (372 wordings)** where a hand-cut disaster row that also knew the stock would be 5 × 3 = 15 pools alone. Readings for "granary AND hospital, stores short, import-fed": 12 × 3 × 12 × 12 = 5,184 for one cell; the row's cells 5 × (1 + 2 + 1) = 20.

### 6.4 Worked block 3 — DS-ECO-1 · "Prosperity header"

**As shipped (CONFIRMED):** 5 pools / 15 variants, the five `COMBINATION C1…C5` keys — the corpus's cleanest hand-cut PAIR: prosperity rank (7-rung ladder collapsed to high / middle / low) × approach (working / narrow), `prosperityHeaderPoolKey(rank, access)` (`economyStateProse.js:365-383`); slots `{settlement, access, complexity}`; `isolated` contributes no `{access}` fill by design (`:899`), so C2 and C5 name `{settlement, complexity}` only; mounted at `economics.prosperityHeader` (`dossierMounts.js:259`); sentence counts 1/2/2, 2/1/2, 2/2/1, 2/1/2, 1/1/1 — nine of fifteen variants are already two sentences, so their joint capacity is one fragment and no second sentence.

**Migration:** 5 spines; `reads = [economicState.prosperity (rank), tradeAccess]`. **Modifiers from the economy desk's own KEY-ONLY facts** (`read-facts §2`, economy holds 12, renders 2): `flow: falling` / `flow: rising` (`readings.flowDrift.band`), `export: sealed` (`readings.exportPosture.status`), `stores: short` (`readings.foodBalance.deficit > 0`, the demoted-dimension twin of DS-GEN-6's `deficit`), `catalog: thin` (`readings.notableAbsences` non-empty) — 6 modifier pools × 3 × 4. Relations: `flow: falling` on C1/C2 is `tension` if the sitting ratifies the axis pair (a high rung × a falling flow), else `addition`; `stores: short` on C4/C5 is `consequence` only if a table row joins prosperity to food (none of the four sources does today — so `addition`, honestly). Pieces: 15 + 18 = **33 semantic (132 wordings)**; state cells 5 × (1 + 6 + 12 cross-axis pairs) ≈ 95; the hand-cut equivalent for three more axes is 5 × 3 × 2 × 2 × 2 = 120 pools × 3 = 360 variants. A middle-rung town with a falling flow and a thin catalog reads spine C3 (12) + joint + `flow: falling` (12) — and because two of C3's three variants are two sentences, the second modifier attaches on one seed in three: the DATA varies the count.

### 6.5 The corpus arithmetic, whole (ESTIMATE, sized by car 0)

Today 2,266 semantic variants. Faces: 2,266 × 4 = **9,064 wordings** (the brief's arithmetic, line 26) less the 9 bound rows. The authoring wave (ESTIMATE): ~4 modifier pools × 3 variants on each of ~50 wired-and-resolved blocks ≈ 600, plus turns at the floor ≈ 60 × 3 = 180, plus THIN pools' second grammars ≈ 200 → **≈ 1,000 new semantic pieces (≈ 4,000 wordings)** — the brief's ~1,800 was PLAUSIBLE; mine is sized from the tier rules and is equally unmeasured until car 0 prints the tiers. The corpus stays linear: 2,266 + ≈ 1,000 pieces; the surfaced readings per block go from hundreds (5 pools × 3 variants × 8 lenses at the largest mounts) to thousands per cell and tens of thousands per block.

### 6.6 The grain

A composed unit is a new GRAIN for the three numbers (`read-specs` Q2): it is walked as an ENTRY (2/3, 1.75, provisional) because it is what a reader meets; the per-variant Figures of Part B §1 are re-anchored on the unit by the sitting (S1) and re-measured over composed sequences before any consecutive-pair number is quoted (S13: the 0.240 settlement-opener, 0.1321 same-opener, 0.3202 runs-of-three and 78.4 % V1 share are PRE-composition figures and dump figures; the manifest run replaces them).

---

## §7 — STALENESS AND REPETITION

### 7.1 Within-town stability (THE PROMISE)

Every draw is keyed on the seed and a pool identity; every new draw (face, joint, salience order) is a new key with its length fixed at birth; eligibility is a function of state; attachment is a function of state and frozen data. Same seed, same state ⇒ same composed text on every visit, forever. The manifest's zero-drift arm is the executable form.

### 7.2 Across-town variety — measured, never manufactured

Nothing at render produces variation the data does not hold (fault 35): variety comes from the pieces' dispersion (arm E per pool: uniform grammar ≤ 0.30, uniform segment count ≤ 0.400, repeated opener ≤ 0.030 — `read-specs §5`), from the wording sets (A5), from the salience bands (two towns with the same ordinary facts foreground differently by seed), and from the data-borne modifier count. It is MEASURED by: the SPREAD arms (A on tagged rows; B1/B2/B3 over the manifest's reading sequences; E per pool), the PRESENCE measure (reported, never a gate — `presenceMeasure.js:6-10`; `hasTextureDevice` strips slot markers so `{settlement}` buys no texture — `read-facts §6.4`, and the sensory lexicon is 166 distinct nouns, not 177), and the REPEAT CENSUS below.

### 7.3 "Repeated only because the instance repeated" — the operational form

Two towns render byte-identical composed text at one mount iff their state cell AND every draw coincide: (spine key, ranked modifier keys, turn, spine index, faces, joint index). The REPEAT CENSUS (a report arm over the manifest, per mount): distinct texts ÷ towns per state cell, against the chance floor given the piece counts (for a spine of 3 × 4 alone, 1/12 per pair of towns in the cell; with one modifier of 3 × 4 and a joint of 3, 1/432). A mount whose collision rate sits ABOVE the floor is a finding (a pool too thin for its cell's frequency — an authoring row, never a draw change). A mount whose rate sits AT the floor is the owner's sentence made exact: the same text appears only where the same cell and the same die fell. The four list positions that draw identical variants for distinct instances today (car 10) are the one place the estate repeats without the instance repeating; car 10 cures it with the per-instance key.

---

## §9 — SURFACES BEYOND THE DOSSIER

| surface | register | composer today | shares the kernel? | what the model means for it |
|---|---|---|---|---|
| **the dossier** (13 tabs, 56 mounts) | R1 archivist | the six desks → `stateProseKernel` → `legibilityRung` → the mount registry → `DeskLines` | yes — this design | spines + modifiers + turns as §2–§6 |
| **the DM page / DM face** | D-a…D-e (Part B §5) | the same corpus with `audience: 'dm'`; `dmScreen.js` gates the settlement projection; `dmFieldProjection.js` keeps the DM's pen whole (`projectBesideDmField`: the machine line renders BESIDE eight DM-editable fields, never into them — `DM_FIELD_FRAMED_BY_BLOCK`, 8 blocks) | yes | dm-only modifiers and covert turns attach on the DM face only, per PIECE (`variantIsAudible` runs per piece before the draw — the licence check per piece, `read-kernel §12` item 6); D13's covert twin holds because faces inherit marks structurally; D1 ("the why only from a typed field") is the turn registry's law; the DM's-pen projection is unchanged — a composed unit is one `beside` string |
| **the NPC ladder** | R6 (Part B §2) | `causeConjunctionContent.js` — the shipped specificity ladder (full → role → class → floor; hashed on the npc id) | no — its own draw (`fnv1a32` over `${seedId}::${key}`) | UNCHANGED in this program: it already selects the most specific authored cell, which is the degraded form of this design's turn rung; its `causeClass` vocabulary is the turn registry's tier-2 source; NL-8b governs its growth |
| **news / the crier** | R5 (Part B §3, H-1…H-12) | `newsVoice.js`, `newsBody.js` — event-keyed pools, FNV over the entry id, canonical-at-zero, lazy-chunk only | no | **events are already the spines** (an entry's kind/scope/severity keys a pool). A STATE MODIFIER on a headline is REFUSED here: H-1 (the deed and at most one gesture), H-3 (the bill apart from the deed) and R5's register forbid a state clause in the head; a state fragment in the card BODY is lawful in principle and is deferred to the Herald's own program with the same connective law (H-10: the connective asserts exactly its edge) |
| **the chronicle** | R11/R12 (Part B §4) | `discourseKernel.js` — relation-typed connectives (`RELATION_FOR_TYPE`, `CONNECTIVE_LEXICON` banded deep/near/pivot, `DEFAULT_CONNECTIVE` totality floor) over BYTE-VERBATIM recorded headlines; `chroniclersLetter.js` groups and prioritises | no | this IS the composed model in the event register: events as spines, edges as connectives, no state modifiers (CL-3: the chronicle composes no cause of its own). It shares the LAW (a connective by the typed edge, never by the music) and NOT the lexicon (register-scoped; the colon-bridge is the chronicle's) |
| **chrome and the docent** | R9/R16/R10 (Part B §6) | product copy; guidance registries | no | the archivist never on chrome (CC-1; W9): the model does not cross |
| **the PDF** | — | no state prose reaches the PDF path today (the composers' only callers are `src/components/new/**` — `read-facts §1`, `read-instruments §2.1`) | no | out of scope; the annex's 21 `PDF PARITY` lines are a finding for the wave's list, not a composer |

---

## §10 — PERFORMANCE, SIZE, DELIVERY

- **Where the bytes live:** the six leaves (641,410 B) and the dark causal leaf (210,260 B) ride the `data-lazy-*` chunk (939,520 B on disk in the dock's build artefact; the ONLY match for a real variant string; not referenced from `dist/index.html` — `read-kernel §11`, with its build-artefact caveat), routed there by `vite.config.js:876-878` (derived, not curated). No first-paint bytes today; the design adds none: the composer and the connective leaf are imported only by the desks, which are imported only by lazy components.
- **Size after the model (ESTIMATE):** nested faces add ≈ 3 × (124 B text + ~12 B JSON) ≈ 408 B per variant → 2,266 × 408 ≈ 925 KB; ≈ 1,000 new pieces at ≈ 630 B each ≈ 630 KB; the connective and relation leaves ≈ 20 KB → **≈ 2.2 MB raw for the state register** (the brief's ≈ 2.5 MB is a fair bracket; `read-data §6.4` measured 2.16 MB for a flat 4× of today's records alone). The causal leaf is unchanged in wave one. Gzip on the lazy chunk (ESTIMATE ≈ 4:1 on prose JSON) → ≈ 0.55 MB over the wire, fetched with the first lazy tab.
- **Ratchets:** `scripts/.size-baseline.json` holds 19 per-file max-LINES rows and none is a prose leaf; no byte ratchet and no first-paint byte ratchet exist (`read-instruments` Q8). Car 8 adds a byte row for the leaves and a gzipped row for the chunk, moved only with a declared shift row, and a guard that no `dossierStateProse` module is reachable from an eager chunk. The first-paint RAW margin (1,042,122 of 1,048,000; 5,878 B at the L-MAT tip) is a receipt this design cites and does not re-measure.
- **Render cost:** composition is ≈ 0.1 ms per town for the general desk (21 ms over 200 towns, CONFIRMED) against 19 ms per town to generate; the composer adds ≈ 3 draws and an integer ranking per unit — ESTIMATE under 2 ms per dossier for all six desks. Most callers are un-memoised (`read-kernel` Q11); a `useMemo` per desk call is a car-2 hunk if the manifest run shows a page-set above 5 ms.
- **Build-time gates over the sample:** the manifest (525 towns × 2 audiences, ≈ 30 s ESTIMATE) runs as a property test; the composed walk samples it; the occurrence census and the reading sequences come from the same run. One run, four instruments.

---

## §11 — RISKS AND REFUSALS

| risk | what goes wrong | the guard |
|---|---|---|
| **explosion arithmetic gone wrong** — a writer "helps" by authoring a modifier per spine, or a turn per pair | the corpus goes exponential by the back door | the list is the only door: a modifier row names ONE field; a turn row needs a registry id AND the floor; the generator refuses `**READS:**` with two paths on a modifier; the census prints pieces per field so the chair sees a second modifier on one field |
| **contradiction between pieces** — a spine and a modifier band one noun differently; a spine's ledger voice and a modifier's street token in one sentence; a composed C2 pair | a sentence no piece would have said | A1 (typed-fact overlap), C5 across the page-set, the standpoint-neutral fragment law, the composed C2 control in the anti-vacuity guard, the sampled composed walk with N and sha printed |
| **the flatten** (the brief's default) | 54.79 % of reads change angle under a "wording-only" signature | refused by measurement; the two-level roll |
| **eligibility drift within a wording set** | the one-in-four becomes one-in-three on some towns | nested `wordings` (structural); the contract arm asserts one slot set and one mark set per variant |
| **appending after the freeze** | every world's face re-rolls for that pool | the face-count pin; "a new wording goes in a new key" |
| **authoring debt** — 33 blocks license one member; 19–22 blocks are bag-flat; 15 blocks are unwired; 89 pools have no `{settlement}`-only floor | modifiers have nothing to attach to; a fill refusal silences a whole family | the list says `NO-LIST-ROW` with the reason; the wave lights wiring first where the fix is a composer line (the eight "prose ahead of wiring" blocks, `read-facts §4`); a family inherits its parent's slots, so it drops together — no new silence class |
| **the golden master** cannot see dossier text | a wave that rewrote every sentence leaves 525 hashes untouched and reads as "no change" | car 1's manifest; its header carries the shift record even when the generator golden does not move (the T13 precedent, `read-instruments §3`) |
| **the instruments' blind spots** — the classifier at 0.75–0.83; arms B need sequences no generator produces; the bag resolver's first-declaration bug; the sensory lexicon miscounted in the receipt; arm A NOT-EXECUTABLE at n ≤ 2 (33 blocks); `check-pair.mjs` lives in a scratchpad and is copied by hand | a green that is not a verdict | arm A gates on tags only; sequences from the manifest run; the resolver corrected in car 0; the 166-noun denominator printed; `check-pair`'s definitions land with the instruments (car 3) so one ruler exists |
| **a modifier reads a default as a measurement** (`economicGates.military` absent; `defenseProfile.institutions` stale) | "fully funded" printed on a town with no paid stack; a ruined citadel described as walls | the candidate function reads the live roster and treats absence as no-candidate; the census card prints the absence semantics |
| **the covert seam** — a public spine joined to a covert fragment | a player page hints | the audience check runs per piece before the draw; a covert turn falls to the public composition; the manifest's player face is recorded and diffed |
| **the render-time substrate's cost** (546,887 B) | a turn key pulls half a megabyte into a tab | tier-2 keys REFUSED at the dossier until the persisted digest (owner row 10); tier-1b/1c closures measured before use |
| **the seedless page** (`_seed` nulled on gallery import, `galleryImportSettlement.js:67`; no `id` ⇒ `''` ⇒ index 0 everywhere) | every such town reads the same canonical composition | not this design's to cure; recorded; the manifest records the seedless face as a control |

**Refusals, each with its reason:** no LLM at render (THE PROMISE); no per-combination authoring below the floor (the owner's own danger); no fact change under any seed (W3); no ABSENCE-move modifier (R-DA-08; the LACK class undemonstrable); no guard-alignment field (none exists; a persisted shape is the owner's); no tier-2 turn keys at the dossier (the import wall); no cross-desk modifier reservoir in wave one (a registry act); no wording sets on the causal register in wave one (six-exactly); no reuse of the chronicle's connectives in the dossier (register scope); no Herald state modifier (H-1/H-3); no weighting of any draw (the withdrawn rhythm-aware draw); no faces on the nine bound rows.

---

## §14 — A LAYMAN'S SUMMARY (for the owner)

Today every sentence on a town's page is picked from a small hand-written set for one fact — the walls are funded, or they are strained — and when two facts matter at once, someone had to write a separate sentence for that exact pair. That is why the corpus would explode if we kept going: every new fact doubles the sentences.

The design stops writing pairs. Writers write PIECES: one sentence for the main fact (the wall), and short clauses for each side fact (the muster is short; the stores are low; the watch is bought), each clause tied to exactly one field the engine actually holds. The page assembles them: the wall sentence, joined to the one or two side facts that are most worth noticing for THIS town, with a connective that says how they relate — and only where the engine's own rules say they relate. Where the engine literally names a combination (a bought watch on a manned wall), a writer may write that one line by hand, but only for combinations common enough to earn it.

Every piece is written four ways in our voice, and the world's seed rolls a fair four-sided die for which wording shows. Same seed, same words, forever. Two towns read the same sentence only when they are in the same situation and rolled the same die.

Before any of this changes a word, a new test records every sentence on 525 sample towns so we can prove the plumbing changed nothing. Then the rewrite and the four wordings land in one pass — the one deliberate, signed change to what existing worlds say (wording only; measured). Then the new pieces land as additions, block by block, checked at every step by the same rule-checkers that already guard the voice, plus a few new ones built for joins.

Your decisions are listed in §13: the one signed shift, the "four wordings, fixed forever" rule, the rarity floor for hand-written combinations, and a handful of numbers you can veto.

---

## APPENDIX — the strains of `read-specs §9`, each with its disposition here

S1 → §6.6 (the composed-unit grain; the sitting re-anchors) · S2 → §4.5 (two sentences, one joint) · S3 → §4.6 (the relation triple) · S4 → wall 5 as arm A3 · S5 → same-block confinement keeps arm D's key · S6 → same-block; no rung change · S7 → the F3 exclusion at candidate construction, and no ABSENCE modifiers at all · S8 → nested wordings · S9 → the face-count pin · S10 → the list says NO-LIST-ROW; the authoring wave is the lever · S11 → §4.3 · S12 → the connective set with bands · S13 → the manifest run re-measures · S14 → by construction · S15 → turns typed structural; the historical class refused on a state spine · S16 → the registry (A8) · S17 → two SIZE figures · S18 → the data-borne count · S19 → §9 · S20 → the derived order.
