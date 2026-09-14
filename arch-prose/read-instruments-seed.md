# READ — THE INSTRUMENTS AND THE SEED MECHANICS
**Reader lens for the COMPOSED-PROSE architecture · Opus 5 (Fable-unvalidated) · 2026-09-07**

Trees read (read-only, no writes outside `$SC/arch-prose/`):
- `$SC/laneB6` — the product tip **3b1c0eaa5** (`git log --oneline -2` executed).
- `$SC/skepINSTR` — INSTR-912 at **74a1aa0e8** (`git log --oneline -12` executed; cars 1–7b).
- `$SC/prose-research/check-pair.mjs` (136 lines), `$SC/s12-sitting/taste/gen-probe.mjs`, `gen-probe2.mjs`.

Every figure below is either (a) output of a command I ran in this session, marked **[EXECUTED]**, or (b) cited to `file:line`. Nothing is carried from a receipt without saying so.

---

## §0 · THE ONE STRUCTURAL FACT THAT ORGANISES EVERYTHING BELOW

**The instruments are NOT in the product.** At the product tip there is no `src/domain/prose/` at all:

```
$ ls $SC/laneB6/src/domain/prose  →  NO src/domain/prose at product tip
$ ls $SC/laneB6/tests/lint/ | grep -i prose
  proseFamilyContract.walker.test.js
  proseNumerics.test.js
```
**[EXECUTED]**

Everything in §1 (entry walker, grammar walker, move grammar, fingerprint, plant ledger, presence measure, the register loaders, `institutionTable.js`, the composed-fill resolver) exists **only** in `skepINSTR` at `74a1aa0e8` and is unlanded. `tests/lint/proseFamilyContract.walker.test.js` at the product tip is a **different** thing — the chronicle/news event-prose "four durable prose families" totality contract (`tests/lint/proseFamilyContract.walker.test.js:1-55`), not a wording family. The name collision is a live trap for the design: **do not call the 4× wording group a "prose family" in code** — that identifier is taken and gated.

---

## §1 · WHAT EACH INSTRUMENT CAN GATE ON A COMPOSED SENTENCE TODAY

### 1.1 The roster, with what it reads and what it can decide

| Instrument | File (skepINSTR) | Unit it judges | Channels | Gates? |
|---|---|---|---|---|
| Same-entry contradiction walker | `src/domain/prose/entryWalker.js` (900 ln) | ONE variant against typed fields + its pool-cell siblings | FAIL · WITHHELD · NOTE · NOT-EXECUTABLE | Gates the **instrument** (controls), not the corpus — see 1.4 |
| The typed ground | `src/domain/prose/entryGround.js` (108 ln) | supplies `estate` / `settlement` scope | throws on an empty roster/table | n/a |
| Published lexicons | `src/domain/prose/entryLexicons.js` (338 ln) | the detectors' word lists | — | pinned against the engine's `QUANTITY_BANDS` (test:75-77) |
| Move vocabulary + classifier | `src/domain/prose/moveGrammar.js` (298 ln) | one variant → an ordered move list | tag vs classifier disagreement | **Never gates** (`moveGrammar.js:13-17`) |
| B-GRAMMAR walker | `src/domain/prose/grammarWalker.js` (766 ln) | pool · register · simulated reading | figures · fails · withheld · notes · notExecutable | Arms F/G gate per entry; A/B/three-numbers gate only with owner numbers supplied |
| Style fingerprint | `src/domain/prose/proseFingerprint.js` (200 ln) | any paragraph set → 21 rate metrics | — | scoring only; bands are an argument |
| Presence measure | `src/domain/prose/presenceMeasure.js` (135 ln) | any paragraph set → 3 lines | — | **"It never gates."** (`presenceMeasure.js:6`) |
| D8 plant ledger | `src/domain/prose/plantLedger.js` (154 ln) | a town's plot hooks | fails · notes · notExecutable | **NOT-EXECUTABLE today** — the three fields do not exist (`plantLedger.js:46-50`) |
| Pair checker | `$SC/prose-research/check-pair.mjs` (136 ln) | a BEFORE/AFTER rewrite pair | FAIL · WITHHELD(R4-BAND) · NOTE | a script, run by hand |

### 1.2 The entry walker's arms, exactly

`walkEntry(entry, ground)` (`entryWalker.js:841`) runs ten limbs in fixed order (`:235-244`):

| Arm | Function | What it can decide about a COMPOSED sentence |
|---|---|---|
| C1 count vs count | `armC1` `:357` | two band phrases governing ONE count noun → **FAIL** (`:370`); a figure outside the closed vocabulary → FAIL (`:393`); a cardinal governing no noun → NOTE |
| C2 duty vs exemption | `armC2` `:410` | an exemption claim on a null column → FAIL (`:434`); an office noun the estate has no term for → FAIL (`:459`); a duty no institution carries → FAIL (`:474`) |
| C3 state vs provenance | `armC3` `:496` | a history/event claim on a state-only field → FAIL (`:510`); a pronoun contradicting typed gender → FAIL (`:546`); "is this clause historical?" → **WITHHELD** (`:517`) |
| C4 modality (B-CLAIM) | `armC4` `:574` | a totality quantifier over an OPEN column → FAIL (`:608`); a bare future indicative → FAIL (`:614`) |
| C5 sibling vs sibling | `armC5` `:656` | two siblings band **the same governed noun** differently → FAIL (`:671`); office/status divergence → WITHHELD (`:688`) — a measured retreat, `:676-682` |
| C6 relation | `armC6` `:703` | a relation lemma with an empty join set → FAIL (`:713`); no join set supplied → NOT-EXECUTABLE |
| D licence | `armD` `:730` | a slot the variant does not declare → FAIL; **a slot the composer never fills** → FAIL (`:132`-`:135` of the arm) — keyed on `(block, pool)` |
| Q qualify | `armQualify` `:767` | a second sentence naming no second typed field → **WITHHELD** |
| X exhaustivity | `armExhaustivity` `:795` | a specificational copula over an OPEN column → WITHHELD; no column → NOT-EXECUTABLE |
| F25 citation | `armCitation` `:827` | a cited record's content → WITHHELD always (no loader reaches a cited record) |

`verdictOf` (`:874`): `FAIL` if any fail; else `WITHHELD` if any withheld; else `PASS`. **WITHHELD is never a pass** and the docblock says so (`:20-24`).

### 1.3 The grammar walker's arms

| Arm | Function | Ceiling / rule | Executable today? |
|---|---|---|---|
| A single-order share | `armA` `grammarWalker.js:186` | `ceilingFor(n, shape) = min(1/n + slack, ratioCap/n)`, `null` at n ≤ 2 (`:97-101`) | Needs a `CeilingShape` **argument** — no default; absent ⇒ NOT-EXECUTABLE (`:87-92`) |
| B1 run | `armsB` `:232` | `runCeilingFor = 1/n + max(2·SE, runFloor)` (`:112-120`) | **Needs a simulated reading sequence; absent ⇒ NOT-EXECUTABLE** (`:710-715`) |
| B2 adjacency | same | note above twice the chance floor `1/n` | same |
| B3 rota | same | per-row successor ceiling; needs n ≥ 3 (`:292-307`) | same |
| E pool spread | `armE` `:319` | uniform grammar / shared openers / uniform segment count — **notes only** | yes |
| F walls | `armF` `:357` | walls 1, 2, 3, 6 implemented; 6 dossier-scoped; walls 4,5,7,8,9,10 **not implemented as arms** | yes, **FAILS** |
| G non-moves | `armG` `:401` | 6 detectors: FORECAST · MEANING · VERDICT · FEELING · FIGURE · SAYING (`moveGrammar.js:59-84`) | yes, **FAILS** |
| BUDGET / DEPTH / PERFECTION | `armThreeNumbers` `:433` | owner's three numbers over exemplar bands | needs `bands` + `three`; absent ⇒ NOT-EXECUTABLE (`:721-726`) |
| I unwritten slot | inline `:735-739` | needs a rank-form manifest | **NOT-EXECUTABLE, permanently reported** |
| J fact budget | inline `:743-753` | sentences vs licensed move/field units — **note only** | yes |
| C-sibling | inline `:654-667` | imported `typedFactsOf`, band-per-noun | yes, **FAILS** |
| ten gaps | `tenGaps` `:556` | opener shape, tense, close kind, contrast shapes, bare relatives, appositives | report-only census |

### 1.4 What actually reds a build, over the shipped corpus

`tests/lint/proseEntryContradiction.walker.test.js:303-338` — the corpus run is a **census with soft bounds**, not a zero-fail gate:
```
expect(failing).toBeGreaterThan(4);
expect(failing).toBeLessThan(corpus.length / 4);
expect(arms.size).toBeGreaterThanOrEqual(4);
expect(notExecutable).toBeGreaterThan(0);
```
`tests/lint/proseMoveGrammar.walker.test.js:417-419` — the same shape:
```
expect(report.fails.length).toBeGreaterThan(0);
expect(report.fails.length).toBeLessThan(corpus.length);
```
**So no instrument today refuses a corpus with a contradiction in it.** They refuse a corpus that produces *no* findings (anti-vacuity) and they refuse *themselves* when a control does not convict. The four Brackwater fixtures (`test:89-146`) and the four negative + one positive control (`test:71-127`) are what is gated.

**The classifier's measured accuracy, and why arm A cannot gate:** `proseMoveGrammar.walker.test.js:9-15` — 20/24 exact (0.83), 18/24 (0.75) counting the two tags revised after seeing output. The test **prints** the rate and asserts only that it beats the "everything is PRESENT" baseline (`:320-322`).

### 1.5 The four arms the composed model needs — and which exist

| Arm the brief asks for | Status | Nearest existing thing |
|---|---|---|
| **modifier restating the spine** | **MISSING — no arm anywhere** | Closest is `armQualify` (`entryWalker.js:767`): a second *sentence* naming no second typed field → WITHHELD. It does not compare two clauses for redundancy, and it fires per SENTENCE, not per attached modifier. `armF` wall 6 (`grammarWalker.js:380-387`) caps segment count at 2 and bans `, which` tails — a length rule, not a restatement rule. |
| **connective typing** (tension / consequence / contrast / addition) | **MISSING as a type; PARTIALLY present as a shape** | `CONTRAST_SHAPES` (`entryLexicons.js`, consumed at `grammarWalker.js:561`) counts contrast SHAPES; `check-pair.mjs:60` `CONTRAST` regex and `:88-107` R4-BAND withhold the band half. Wall 5 ("CONTRAST only where a sibling pool key or band names the rejected alternative", `moveGrammar.js:127`) is **declared and not implemented as an arm** — `armF` implements walls 1, 2, 3, 6 only. Wall 1 (`armF` `:363-368`) is the only relation-order check: STATE before CAUSE. |
| **salience determinism** | **MISSING — nothing scores notability anywhere** | Grep over `src/domain/display` + `src/domain/dossier` at the product tip for `salien|notabl` returns only unrelated files (tradePressure, servicesDisplay, rumour pools). The only ordering layer is `dossierMounts.js` — a **hand-written position registry** (`dossierMounts.js:257 DOSSIER_MOUNTS`, `:521 mountById`, `:533 mountsForTab`, `:552 sentenceMountForBlock`, `:581 drawnAtMount`), which is static per block and knows nothing about this town. |
| **licensing by fields** | **PRESENT and the strongest arm in the estate** | `armD` (`entryWalker.js:730`) + `tests/helpers/dossierComposedFill.js` — the composer's bag resolved from SOURCE per `(block, pool)`, with `conditional` and `unresolved` tiers (`dossierComposedFill.js:20-35`). Test proves it resolves every call site with nothing unread and finds exactly the 15 unmounted blocks (`proseEntryContradiction.walker.test.js:201-219`). |

**Design consequence.** Three of the four arms the composed model depends on do not exist. The licensing arm exists and is per-`(block,pool)`, which is the right grain for a spine/modifier schema — a modifier is licensed by exactly the same question `armD` already asks.

### 1.6 What `check-pair.mjs` can and cannot do for a composed sentence

It is a **pair** instrument: `pairs.json` of `{id, before, after}` and it locates the BEFORE by exact text in the corpus (`check-pair.mjs:64`). Its arms: slot set equality (`:68`), digits/percent/em-dash/exclamation in AFTER (`:69`), longer-than-before (`:70`), duration words added (`:71`), count words added or lost (`:72-73`), a cut word naming a sibling pool key (`:74-76`), three-plus sentences (`:78`), rationed pet words (`:80-81`), antithesis shape added (`:83-85`), R4-BAND withhold (`:88-107`), A11 pool spread flattening and shared-opener creation (`:108-121`), future indicative added / subjunctive removed (`:123-124`), existential opener added (`:126-127`), pronoun closer added (`:128-129`).

**It cannot check a composed sentence at all.** Every arm is a *delta* between two strings, and a composed sentence has no BEFORE. For the wording-family design its value is different and real: **four faces of one family are four AFTERs of one BEFORE**, so `check-pair` run four times against the parent is exactly the claim-equality instrument the brief asks for (`ARCH-BRIEF.md:25`) — with two known holes: it has no arm for "the four are too similar" (the sibling-distance measure), and its LONGER arm (`:70`) will fail three of four faces of any family that deliberately spans the length classes.

---

## §2 · THE SEED MECHANICS

### 2.1 The two draw kernels, and which text the golden master freezes

| | `src/kernel/proseHash.js` | `src/domain/display/stateProse/stateProseKernel.js` |
|---|---|---|
| Function | `pickVariant(pool, seed)` `:47` | `drawVariant(eligible, blockId, poolKey, seed)` `:301` |
| Hash | `pool[fnv1a32(String(seed)) % pool.length]` `:52` | `eligible[avalanche32(fnv1a32(\`${seed}::${blockId}::${poolKey}\`)) % eligible.length]` `:304` |
| Why avalanche | — | FNV's low bit is a parity; a `% 8` draw reached 4 residues of 8 on `wizard_news` (`stateProseKernel.js:29-35`) |
| Seedless | index 0, "canonical at zero" `:49-51` | index 0 `:303` |
| Where it runs | **generation** — `generators/steps/assembleInstitutions.js`, `generators/narrativeGenerator.js`, `generators/narrative/settlementOriginProse.js`, `data/institutionDescVariants.js`, `data/historyDescVariants.js`, `domain/worldPulse/*` | **display only** — the six `*StateProse.js` composers and `causalDossierProse.js`; consumers are `src/components/new/**` alone |

**[EXECUTED]** `grep -rn "stateProse/" src --include=*.js --include=*.jsx | grep -v src/domain/display/stateProse/` returns only `src/components/new/*` files. **No generator reaches the dossier state-prose corpus.**

### 2.2 The seed string at the dossier draw

`src/components/new/generalDeskRead.js:257`:
```js
{ seed: String(r?._seed ?? r?.id ?? ''), audience: options.playerView ? 'player' : 'dm' }
```
So the draw seed is the settlement's `_seed`, falling back to its `id`, falling back to `''` (which selects index 0 everywhere). The same shape is used by `$SC/s12-sitting/taste/gen-probe.mjs:16` and `gen-probe2.mjs:16`.

### 2.3 Eligibility — the filter that sits BEFORE the modulus

`eligibleVariants(pool, {slots, audience, dimensions})` (`stateProseKernel.js:247-269`) removes, in this order:
1. **fail-closed dimensions** — a pool partitioning itself by `severity` / `deficit` / `anchor` (`STATE_MARK_DIMENSIONS` `:192-196`) that the caller did not answer returns `[]` (`:258-261`). Read on the RAW pool *before* any filter, deliberately (`:249-252`).
2. `variantIsAudible` — `dm-only` marks (`:159-163`).
3. `variantIsAnchored` — every `{slot}` the variant names must have a non-empty **string** fill (`:146-151`; a number is rejected on purpose, `:128-138`).
4. `variantSpeaksOver` per dimension (`:235-238`).

**Consequence for the composed model:** `eligible.length` is a function of the *town's state and the audience*, not of the pool. Two towns reading one pool can have different eligible lengths and therefore different indices. Any wording-family scheme must guarantee "every face of a family is ELIGIBLE whenever its parent is" (brief `:27`) — which means **every face carries the identical `slots` array and the identical `marks` array**, or the four faces will differ in eligibility and the family will silently become 3 or 2 wide on some towns.

### 2.4 The causal register draws differently

`causalDossierProse.js:100-118`: the pool is `family.pools['*']` filtered to `variant.marks.includes(join.arm)` (`:111-113`), then `drawVariant(eligible, join.familyId, join.arm, seed)` (`:116`). The draw key is `${seed}::${familyId}::${arm}` — **the block/pool positions carry the family and the arm**. Every family holds exactly six variants in one `*` pool (`tests/data/dossierStateProseProjection.contract.test.js:281-288`), so the per-arm eligible list is small (six across all arms).

### 2.5 THE LAW THE ESTATE HAS ALREADY WRITTEN ABOUT ADDING VARIANTS

`tests/data/dossierStateProseProjection.contract.test.js:206-213`, verbatim in substance:
> `drawVariant` keys its hash on `${seed}::${blockId}::${poolKey}` and indexes `% eligible.length`, so **APPENDING to an existing pool would move every seeded draw over that pool, while a NEW block moves nothing.**

Three content-train cars (CT-1a, CT-2, CT-3) all landed as *wholly new blocks* for exactly this reason, each measured "zero pre-existing `(blockId, poolKey)` pools changed length" (`:234-236`). The 4× wording plan is the **first** change in this corpus's history that deliberately changes existing pool lengths. It is therefore not merely "a declared shift" — it is a reversal of the standing landing pattern, and the design must say so in the owner rows.

### 2.6 [EXECUTED] How much moves under each roll shape

`$SC/arch-prose/draw-reroll.mjs`, run over the real R1 leaves at the product tip, 200 seeds × 708 pools = 141,600 `(seed, pool)` reads:

```
R1 leaves: 708 pools, 2266 variants, mean 3.20
pool-length histogram: 2->33 3->547 4->96 5->17 6->15
FLATTENED one-level roll over 4L: semantic variant preserved on 64018/141600 = 45.21%
TWO-LEVEL roll (parent key unchanged): semantic variant preserved on 141600/141600 = 100.00%
face-0 share under the second key: 25.05% (uniform target 25%)
```

| Roll shape | Wording moves | **Semantic variant (angle, claim set) moves** | Same-seed shift class |
|---|---|---|---|
| Flatten all 4N wordings into one pool, one key (the brief's default, `:27`) | ~100 % | **54.79 % of all reads** | a shift in WHICH ANGLE SPEAKS, not only in wording |
| Two-level: parent key `seed::block::pool` unchanged, face key `seed::block::pool::wording` | ~75 % (3 of 4 faces differ from today's text) | **0 %** | a pure WORDING shift, exactly as declared |

The brief asks the design to "state whether a two-level roll is preferred and why" (`ARCH-BRIEF.md:27`). **The measurement answers it**: only the two-level roll makes the declared shift honestly "wording-only". Under the flatten, the migration car's acceptance criterion — "proves wording-only on the golden sample" (`ARCH-BRIEF.md:30`) — is unprovable, because more than half the reads change their semantic variant. The face key must be a **suffix** of the parent key, never a re-hash of a different string, or the parent moves too. Uniformity of the face draw is measured at 25.05 % over 141,600 draws, so the unweighted one-in-four die is satisfied by the existing avalanche hash with no new machinery.

### 2.7 The projection's own ratchets (what a 4× corpus must satisfy)

`tests/data/dossierStateProseProjection.contract.test.js`:

| Gate | Line | What it asserts | Effect of a 4× family |
|---|---|---|---|
| block/family census | `:237-238` | 68 state blocks, 78 causal families | unchanged (families are per-variant) |
| **the variant ratchet** | `:277-278` | `stateVariants >= 2266`, `causalVariants >= 468` | satisfied by growth; the header says the floor is **re-pinned to the measured total at every car** (`:248-253`) — so the wave re-pins to 9,064 (state) / 1,872 (causal) |
| six arm-tagged variants per causal family | `:285` | `family.pools['*'].length === 6` **exactly** | ⛔ **BREAKS** — 6 × 4 = 24. This assertion must move with the wave or the causal register cannot carry families of four |
| no thin pool | `:290-298` | every pool ≥ 2 | trivially satisfied |
| slot declaration | `:313` | every variant declares every slot it uses | binds each face |
| dm-only marks | `:334` | audience marks survive the projection | binds each face (see 2.3) |
| `--check` byte compare | brief `:31`; `GRAMMAR_TAG_CONTRACT.movesWith` (`moveGrammar.js:151-157`) | the projector's output is byte-compared | any leaf-shape change moves `scripts/generate-dossier-state-prose.mjs` **and** this test together |

`ONE known downward move` is recorded at `:263-276` (2269 → 2266, the DS-FTH-3 `abandoned` shrink-back) — the precedent for how a corpus cut is ruled and receipted. **"NEVER TRIM"** (brief `:23`) is consistent with this ratchet; the ratchet is the mechanism that enforces it.

---

## §3 · THE GOLDEN MASTER — WHAT IT FREEZES AND WHAT IT DOES NOT

`$SC/laneB6/tests/property/generatorGoldenMaster.test.js` (899 lines; lines 1–758 are the SHIFT RECORD, the executable body is `:759-899`).

**Mechanism**

| Element | Line | Value |
|---|---|---|
| corpus builder | `:802-847` | tier × culture × terrain grid (terrain paired with an honest route) + trade sweep + threat sweep + `random_trade` rows on 4 seeds + 3 extra base seeds, deduped by key |
| key | `:849` | `[settType, culture, terrainOverride, tradeRouteAccess, monsterThreat, _seed].join('|')` |
| hash | `:851-855` | `sha256(JSON.stringify(generateSettlementPipeline(cfg, null, {seed, customContent:{}})))` |
| manifest | `:857` | `tests/fixtures/generator-golden-master.json` |
| rows | **[EXECUTED]** `node -e ... Object.keys(m).length` | **525** |
| re-record door | `:862-877` | `UPDATE_GOLDEN=1 npx vitest run …`, through `tests/helpers/goldenRecordDoor.js` |
| totality arm | `:885-887` | key set must equal the corpus exactly — no silent add/remove |
| drift arm | `:890-898` | every row byte-identical; `drift` must be `[]` |

**What it freezes.** The serialised **settlement object**. That includes every string `pickVariant` (`src/kernel/proseHash.js`) wrote at generation time — institution descriptions, history descriptions, founding notes, NPC archetypes — because those are fields of the object.

**What it does NOT freeze.** Dossier state prose and causal prose. `readStateProse` is called only from `src/domain/display/stateProse/*` which is imported only by `src/components/new/**` **[EXECUTED grep, §2.1]**. `stateProseKernel.js:10-11` says so of itself: *"Composition lives display-side and nothing here is persisted — dark, the page is byte-identical."*

> **⛔ THE LOAD-BEARING GAP FOR THE MIGRATION CAR.** The brief's acceptance criterion is "the migration car proves **BYTE-IDENTICAL dossier output** for every seed in the golden sample before any text changes" (`ARCH-BRIEF.md:57`). **The golden master cannot prove that.** A change that rewrote every dossier sentence would leave all 525 hashes untouched. The migration car needs a **new** instrument: an N-town composed-prose manifest (block, pool, angle, text per seed) captured through the shipped desk-read callers. That instrument does not exist at either tip. §4 measures what it would cost.

**How a declared same-seed text shift is recorded.** The header law is at `:17-19`:
> *"A hash manifest cannot show WHY it moved, so every re-record is written down here. Re-recording without adding a row is a deleted alarm."*

The discipline the last window actually executed (`:21-127`), which the wording wave should copy verbatim in shape:
1. state the window and the consist, and the tip it was measured at;
2. print the **base-side totality** first — regenerate the boarding base from committed bytes in a detached worktree and reproduce the committed manifest on all rows, so the consist is proven to be the only source of drift (`:140-145`);
3. prove the **comparator can see** — plant one enumerable field and watch the sha move, then restore (`:31-34`) — a threshold constant is explicitly named the *weak* control;
4. **name every flipped row individually** and attribute it by single-variable revert (`:95-111` — one row, `momentum.js`… convicted as `attrition.js`);
5. record rows that did **not** move as well, so a re-record that never happened still leaves a trace (`:22-24`).

**A precedent worth copying:** the T13 window closed with **zero of 525 moved** and the manifest was *not* re-recorded, and the block exists anyway. The wording wave's shift record belongs in the same header even though the golden master will not move — otherwise the absence of movement reads as an absence of change.

---

## §4 · THE 200-TOWN SAMPLE AND THE SIMULATED READING SEQUENCE

### 4.1 It does not exist as an instrument

`grammarWalker.js:575-576` declares the input:
```js
@property {ReadonlyArray<{unit: string, orders: string[]}>} [sequences] simulated reading
  sequences; ABSENT ⇒ arms B1/B2/B3 are NOT-EXECUTABLE, never passed
```
and `:710-715` reports NOT-EXECUTABLE with the reason: *the consecutive-pair statistics are taken over a READING, never over a pool dump.*

**[EXECUTED]** `grep -rn "simulated reading\|readingSequence" src tests scripts` in skepINSTR returns four hits — all four are the declaration, the guard, and the test that asserts the guard fires (`tests/lint/proseMoveGrammar.walker.test.js:382-389`). **No generator of reading sequences exists anywhere I can read.** The only sequences fed to arms B are synthetic fixtures: `OWNER_TEMPLATE_SEQUENCE`, `ROTA_SEQUENCE`, `fairDraw(n, samples)` from `tests/fixtures/grammarControls.js`.

The "200 towns" figures quoted in `$SC/s12-sitting/SITTING-RULINGS-912.md:124` (V1 at 78.4 % of 1,986 lines over 200 towns against a 10.7 % ceiling at n = 14; run rate 0.618 against 0.121) are a **one-off probe run recorded in the sitting**, not a re-runnable instrument in either tree. Treat them as receipts, not as reproducible measurements, until car 2's sequence generator is built.

### 4.2 The two real probes, and the artefact one of them demonstrates

| Probe | What it does | Verdict |
|---|---|---|
| `$SC/s12-sitting/taste/gen-probe.mjs` | one settlement; calls the six composers **directly** with `{}` readings (`:29-31`) | ⚠ **the known artefact** — a composer called with `{}` readings selects its ABSENCE pools for every seed (`tests/helpers/dossierComposedFill.js:13-15`). Do not build the occurrence census on this shape. |
| `$SC/s12-sitting/taste/gen-probe2.mjs` | one settlement; composes through `generalDeskLines` and builds the power desk's readings **as `PowerTab.jsx:200` builds them** (`:1-4`, `:22-26`) | the honest shape |

### 4.3 [EXECUTED] What a 200-town occurrence census would actually cost and yield

I built `$SC/arch-prose/occurrence-probe.mjs` on the honest shape — the readings bag replicated from `src/components/new/generalDeskRead.js:176-210`, composed through `generalStateProse`, walked for `legibilityRung` provenance. 25 towns, six tiers round-robin:

```
N=25 towns (6 tiers round-robin) · 561 ms total = 22 ms/town (generate 559, compose 2)
general-desk rungs with provenance: 439 (17.6 per town); distinct (block,pool) cells: 50
cell occurrence histogram (towns-hit -> cells): 1->5 2->3 3->7 4->3 6->4 7->4 8->3 9->3
  10->3 11->6 15->1 16->1 17->1 24->2 25->4
cells hit on ONE town only: 5 of 50
cells hit on EVERY town: 4
angles drawn: street=128 visitor=126 ledger=122 counterforce=26 elder=14 threshold=14 unfolding=9
PROJECTED 200-town cost (general desk only): 4.5 s
```

Readings for the designer:
- **Cost is not a constraint.** 22 ms/town, of which **559 of 561 ms is `generateSettlementPipeline` and 2 ms is composition**. A 200-town census over one desk is ~4.5 s; over all six desks the generate cost is shared, so the whole-dossier census is still seconds, not minutes. The occurrence bound can be measured at the gate, per car, without a soak.
- **The occurrence distribution is already legible at N = 25**: a long tail (5 cells on one town) and a hard core (4 cells on every town). The OCCURRENCE threshold the brief asks for (`ARCH-BRIEF.md:15`) has a real distribution to be set against.
- **The angle draw is visibly non-uniform**: street/visitor/ledger ≈ 126 each against counterforce 26, elder 14, threshold 14, unfolding 9. That is the corpus's own angle census showing through (brief `:31`: visitor 403, ledger 681, street 609, counterforce 170, threshold 96, unfolding 230, elder 70, canonical 7) — the draw is uniform over the pool, the *authoring* is not uniform over the angles.

### 4.4 ⚠ The desk read strips provenance — the census must not use it

**[EXECUTED]** `generalDeskLines(s, {seed, audience:'dm'})` returns `{overview, history, viability, hooks, economics, relationships, steadings}` whose `overview.healthLines` is an array of **bare strings**. The provenance exists one layer down: `legibilityRung` (`src/domain/display/stateProse/legibilityRung.js:38-51`) returns `{glance, sentence, detail, provenance:{blockId, poolKey, angle}}`, and `generalStateProse` returns those rungs. So the occurrence census must be taken at the **composer** layer (`*StateProse.js`), with the desk's readings bag reconstructed, exactly as `occurrence-probe.mjs` does — never from the desk's return value, and never with `{}` readings.

### 4.5 Reusing the sample for arms B1/B2/B3

A reading sequence is `{unit, orders}` (`grammarWalker.js:575`) — an ordered list of *order ids*, one per line as a reader meets them. From the occurrence probe's output the sequence is one map away: for each town, walk the mounts in `DOSSIER_MOUNTS` order (`dossierMounts.js:257`, an array precisely so the page order survives, `:526-532`), take each drawn variant, and classify it with `classifyMoves` → `orderIdOf` (`moveGrammar.js:230, 272`). That gives arms B their input **and** it gives the occurrence census its denominator, from one run. Two cautions:
- `orderIdOf` returns `V3|V8` for `PRESENT→ABSENCE` (`:264-278`) — the sequence carries an ambiguous token that arm A already tolerates; arms B tally it as its own symbol, which slightly inflates n.
- the classifier is 0.75–0.83 accurate; a sequence built from it is a **report**, and B1/B2/B3 built on it inherit that and must not gate until the `grammar:` tag ships.

---

## §5 · THE `grammar:` TAG — THE ONE MIGRATION CONTRACT ALREADY WRITTEN

`moveGrammar.js:145-162` (`GRAMMAR_TAG_CONTRACT`) is a worked precedent for how a per-variant datum lands without touching a seed:

| Field | Value |
|---|---|
| `shape` | a member id of `LEVEL1_ORDERS` (`V1`…`V8`), one per variant, optional while the wave runs |
| `annexForm` | a third bracketed tag on the row: `` N. `[angle · mark]` `[grammar: V4]` text `` — rides `VARIANT_RE`'s existing optional second bracketed group |
| `leafForm` | `"grammar": "V4"` beside `angle`, `marks`, `slots` |
| `movesWith` | `scripts/generate-dossier-state-prose.mjs` (parseTag must route it away from `marks` or `STATE_MARK_DIMENSIONS`'s contract reds) **and** `tests/data/dossierStateProseProjection.contract.test.js` |
| `seedSafe` | *"THE PROMISE holds: … It changes no pool length, no key, no index and no eligibility — `variantIsAnchored` reads `slots`, `variantIsAudible` reads `marks`, and neither reads `grammar`."* |

**A wording family is the same shape one step further.** A `wording:` index or a `family:` id is a per-variant datum that no eligibility predicate reads — but unlike `grammar:`, it *does* change pool length, which is precisely the line `seedSafe` draws. The design should reuse this contract's **form** (annex tag → projector → leaf key → two files that move together) and state plainly that it crosses the line `seedSafe` names, with §2.6's numbers as the price.

Test proof the tag is applied to nothing today: `proseMoveGrammar.walker.test.js:375-378` — `expect(corpus.filter((e) => 'grammar' in e)).toEqual([])`.

---

## §6 · THE CORPUS AND LOADER SHAPE A COMPOSED MODEL PLUGS INTO

### 6.1 The entry shape, one vocabulary across the estate

Carried verbatim from `check-pair.mjs:22` into `tests/helpers/dossierCorpus.js:10-15`:
```
{ id, text, block, pool, poolId, idx, angle, marks, slots, file, line, register, siblings }
```
`siblings` = sibling **pool keys** of the same block; the sibling **variants** of one cell come from `poolCells(corpus)` (`dossierCorpus.js:393-401`) because the entry walker needs the cell.

### 6.2 The counts the loaders reproduce (asserted, `proseEntryContradiction.walker.test.js:174-198`)

| Figure | Value | Assertion |
|---|---|---|
| state leaves + causal | **2,734** entries | `:180` |
| distinct poolIds | **786** | `:181` (708 R1 pools + 78 causal families) |
| state blocks | **68** | `:182` |
| annex rows joined to a projected twin | **2,030**, none unjoined | `:191-197` |
| crier (R5) rows | > 300 | `:183` |

**[EXECUTED, my own re-derivation at the product tip]** `draw-reroll.mjs` over `src/data/dossierStateProse/*.generated.js`: **708 pools, 2,266 variants, mean 3.20**; pool-length histogram `2→33 3→547 4→96 5→17 6→15`. This reproduces the brief's §31 figures exactly.

### 6.3 The composed fill — the licensing table the design needs

`tests/helpers/dossierComposedFill.js`:
- `COMPOSERS` (`:42-49`) — the six `*StateProse.js` files, named as *"the only callers of `readStateProse` in the estate"*.
- resolves the bag from **source**, per `(block, pool)`, marking `conditional` keys (`key: cond ? a : undefined`) and reporting `unresolved` rather than dropping (`:26-32`).
- the reason it is per-pair, not per-block, is a measured one: `generalStateProse`'s `craftSlots` fills `{resource}` on `HOME-FED` and `UNWORKED` and refuses it on `STALLED`, in the same block (`:15-18`).
- proved against an orthogonal witness: `noBag` blocks equal `UNMOUNTED_BLOCKS` exactly, **15 of them** (`proseEntryContradiction.walker.test.js:209-219`).

**[EXECUTED]** `readStateProse(` lexical call sites at the product tip: general 11 · power 7 · defense 9 · stressors 2 · economy 1 · warFaith 1 = **31** (several sit inside loop helpers, so the resolved `(block, pool)` pair count is larger — the test asserts `sites.length > 30`, `:204`).

### 6.4 The register loaders (car 3)

`dossierCorpus.js:439-458` + `proseRegisterLoaders.walker.test.js`: **one harvester, not seven** — `harvestExports({rel, register, module, exports})` walks a frozen table and admits leaves by a **published** predicate `isProse` (`:465-471`: ≥ 3 whitespace-separated words, ≥ 1 lower-case letter, not SCREAMING_SNAKE, not a kebab slug). Every loader **throws** on an empty read or a stale export roster (`:50-58` of the test) — the anti-vacuity discipline. Two counts are asserted exactly because they are reproductions: R6's 1,662 rows in 1,104 pools and R4b's 50 (`proseRegisterLoaders.walker.test.js:15-21`); everything else is printed beside `PROBE_ALL`'s figure with the reason they differ.

---

## §7 · MEASUREMENT RULERS THE DESIGN INHERITS (pin these, do not re-spell them)

| Quantity | Canonical definition | Site |
|---|---|---|
| **SEGMENT** (= sentence of a variant) | slots blanked to one token, split on `(?<=[.?!])\s+(?=[A-Z"'(])` | `grammarWalker.segmentCount` `:172-175`, pinned from `check-pair.mjs:43` |
| **OPENER** | first two words, slots normalised to `{}` , lower-cased, edge punctuation stripped | `grammarWalker.openerOf` `:154-158`, from `check-pair.mjs:45` |
| **sentence** (fingerprint) | `p.split(/(?<=[.?!]["'”’)]?)\s+(?=["'“‘(]?[A-Z])/)`, ≥ 2 words | `proseFingerprint.sentencesIn` `:72-77` |
| **clause** (findings attribution) | sentence end · `;` · `:` · `,` · coordinator | `entryWalker.clausesOf` `:164-170` |
| **clause unit** (classifier) | as above **plus** a fronted subordinate clause split out (`after|when|since|because|though|while|if|before|once` + ≤ 70 chars + comma) | `moveGrammar.clauseUnits` `:208-221` |
| **band width depth** | `(value − hi)/(hi − lo)`; a **zero-width band is SKIPPED**, never scored as infinite | `proseFingerprint.scoreAgainstBands` `:158-176` |
| **bands** | min…max of the OTHER exemplars — leave-one-out, ≥ 2 required | `proseFingerprint.bandsFrom` `:187-199` |
| **entropy** | `log2Det`, never `Math.log2` — `src/domain/**` bans engine transcendentals | `grammarWalker.entropyOf` `:125-137` |
| **21 rate metrics** | dotted paths that ARE the fingerprint JSON's own paths, so a band file and a measurement cannot mis-align | `proseFingerprint.RATE_METRICS` `:35-57` |

⚠ `proseFingerprint.js:17-24` names its own worst risk: *"THE FORMULAS ARE A SECOND SPELLING and the drift is real"* — the exemplar fingerprints were taken by the research kit's 33-line tool **outside this repo**. If a sibling-distance measure for wording families is defined in band-widths, it inherits this drift. Prefer a distance defined on the estate's own ruler alone (e.g. metric-vector L1 over `RATE_METRICS`, computed by `fingerprint()` on both siblings) so no external tool is in the loop.

---

## §8 · THE ARM SHOPPING LIST, AS BUILDABLE WORK

| # | Arm | Where it goes | What it reads | Gate or report |
|---|---|---|---|---|
| A1 | **restatement** — a modifier may not re-assert the spine's claim | new limb in `entryWalker.js` beside `armQualify` | the spine's typed facts (`typedFactsOf`, `:627`) vs the modifier's; overlap on a governed noun with the same band class = restatement | FAIL (it is a claim rule, so it belongs in the entry walker) |
| A2 | **connective typing** | new limb in `grammarWalker.js` beside `armF` | the connective token's declared relation vs the engine's causal edge between the two pieces' fields | FAIL when a `consequence` connective joins two pieces with no causal edge; WITHHELD when the edge exists but the direction is unread |
| A3 | **wall 5 as an arm** (contrast needs a named rejected alternative) | `armF`, currently walls 1/2/3/6 only | the pool's sibling keys / bands — the machinery already exists in `check-pair.mjs:47-59` (`axisOf`, `bandSiblingsOf`) | FAIL, replacing today's R4-BAND WITHHELD |
| A4 | **salience determinism** | new module; nothing to extend | the notability scores + the seed; assert the same town yields the same two modifiers on repeated calls, and that two towns with identical readings but different seeds do **not** foreground identically more than chance | FAIL on non-determinism; report on the spread |
| A5 | **sibling distance** within a wording family | `grammarWalker.js` (a shape rule) | `fingerprint()` per face; minimum pairwise distance; plus opener equality and segment-count spread (`openerOf`, `segmentCount`) | FAIL below a measured floor — a family of four synonym-swaps is a tell |
| A6 | **claim equality** within a wording family | `check-pair.mjs` run parent→face ×4, **plus** `walkEntry` on each face with the parent's ground | slots, marks, band words, count words, duration words | FAIL on any divergence; the LONGER arm (`check-pair.mjs:70`) must be **suppressed** for face comparison or three of four faces red by design |
| A7 | **the composed-prose manifest** (the migration car's proof) | new `tests/property/` golden beside the generator's | N seeds × the six composers → `(seed, block, pool, angle, text)`; sha per seed | byte-identical before any text change; a re-record obeys §3's five-step discipline |

---

## OPEN QUESTIONS

1. **Does the migration car get a composed-prose golden at all, and at what N?** The generator golden master (525 rows) provably cannot see dossier text (§3). §4.3 shows the capture costs ~22 ms/town. Is the manifest 525 rows keyed like the generator's, or a smaller purpose-built seed set? Chair-decidable; the *existence* of the instrument is not optional if the brief's byte-identical criterion is to mean anything.
2. **Two-level roll or flatten?** §2.6 measures 45.21 % semantic preservation under the flatten against 100 % under the two-level roll. The brief names the flatten as the default. This is a design decision with a measured price and an owner row attached (the declared shift's size).
3. **Six-exactly.** `dossierStateProseProjection.contract.test.js:285` asserts every causal family holds **exactly six** variants. Does the causal register take wording families at all (→ 24), or do families of four apply to R1 only in the first wave? Owner-gated if it changes the causal leaf's shape.
4. **Does a wording face inherit `marks` verbatim?** Eligibility reads `marks` twice (audience + demoted state dimension, `stateProseKernel.js:159-163, 235-238`). If any face's marks differ, the family narrows to 3 or 2 on some towns and the "unweighted one-in-four" is false. I believe verbatim inheritance is required; it should be an assertion, not a convention.
5. **Where does the salience score's determinism come from?** No notability layer exists (§1.5). If the score reads a float, `src/domain/**`'s transcendental ban applies (`grammarWalker.js:125-131`) and the kernel's `detMath` is the only lawful arithmetic. Chair-decidable; must be settled before the composition algorithm is written.
6. **Is arm A ever allowed to gate?** It reads the `grammar:` tag, which is on zero variants today (`proseMoveGrammar.walker.test.js:377`). The sitting's ruling (`SITTING-RULINGS-912.md:124`) is that arm A gates tagged variants and reports on untagged ones. Does the composed wave author the tag on every new piece from birth? (I recommend yes — a spine/modifier/turn is born knowing its move.)
7. **The 200-town figures in the sitting are not reproducible.** No reading-sequence generator exists in either tree (§4.1). Are `78.4 % / 1,986 lines / run rate 0.618` to be re-derived by car 2's instrument before the design's bounds cite them, or carried as receipts?
8. **The first-paint byte margin.** The brief carries 1,042,122 of 1,048,000 (margin 5,878 bytes) from the L-MAT tip, which I am fenced out of. I searched the product tip and found **no first-paint byte ratchet**: `tests/lint/sizeBaseline.test.js` is a per-file **max-lines** ratchet over `scripts/.size-baseline.json` (`:4-18`), `scripts/bundle-analyze.mjs` prints kB and asserts nothing, and no `package.json` script gates bytes. If the prose data is to grow ~4× (640 KB → ~2.5 MB raw, brief `:26`), **the ratchet that would catch a regression does not exist yet** and building it is a car.
9. **`check-pair.mjs` lives in a scratchpad, not in the repo.** Six INSTR-912 walkers cite it as the estate's pair instrument and copy its definitions by hand (`grammarWalker.js:150, 165`). If the wording wave runs it thousands of times, does it land in `scripts/` with a test, or stay a lane tool? A definition copied by hand into two trees is the drift class `proseFingerprint.js:17-24` already names.
10. **What happens to `angle` under a wording family?** All four faces of a variant presumably share its angle. If so, the angle census (brief `:31`) is unchanged by the 4× and the observed angle imbalance (§4.3: street/visitor/ledger ≈ 126 each vs unfolding 9) is untouched by the wave — which means the wave buys wording variety and buys **no** angle variety. Worth saying out loud in the design.
