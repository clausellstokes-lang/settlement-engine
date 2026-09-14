# CRITIQUE — ARCH-COMPOSED-PROSE v1, lens: AUTHORING ECONOMICS · PERFORMANCE · SURFACES

**Seat: Opus 5 — critic (Fable-unvalidated; the adversary). Read-only throughout; written only under `$SC/arch-prose/`.**
Product read at `$SC/laneB6` = `3b1c0eaa5` (`git log --oneline -1`, executed). Instruments at `$SC/skepINSTR` (not needed for any figure below). Nothing over twelve words quoted from any exemplar text.

**Every figure below is CONFIRMED by a command I ran in this pass and whose output I saw, or is cited to a `file:line` I read.** Where I reason, I show the arithmetic and mark it ESTIMATE.

## What I executed

- `node` over `tests/fixtures/generator-golden-master.json` → **525 rows; 4 distinct seeds; `golden-master-v3` on 516 of 525**; marginals `tier {town 105, others 84 each}` · **`threat {civilized 522, frontier 1, plagued 1, safe 1}`** · `route {road 294, port 73, isolated 73, river 73, random_trade 8, mountain_pass 2, crossroads 1, none 1}`.
- A reconstruction of `corpus()` from `tests/property/generatorGoldenMaster.test.js:802-847` reproducing the same seed census (524 rows / 515 on one seed; the fixture is authoritative).
- A byte simulation over the six leaves in the projector's own pretty-printed shape: base JSON **638,800 B**; `+3 wordings + grammar` → **1,732,075 B** (delta **1,093,275**, **160.8 B per added face**); `+ full poolMeta` → **1,966,025 B** (delta **233,950**, **330.4 B per pool row**); `+ render-only poolMeta {role}` → **1,784,069 B** (delta 51,994). Flat-×4 counterfactual **2,383,447 B**.
- `zlib.gzipSync(level 9)` over the six leaves → raw **641,410** / gzip **121,630** = **5.27 : 1**.
- Per-desk census over the six leaves → defense 11/126/383 · economy 15/105/329 · general 23/193/634 · power 7/79/256 · stressors 3/67/246 · warFaith 9/138/418 → **2,266 variants = 2,266 wording sets = 6,798 new faces = 9,064 authored surfaces**; text bytes 280,581, mean 123.8 B/variant.
- `dist/assets` at this dock: eager JS from `dist/index.html`'s script+modulepreload set = **1,042,086 B** (+19,795 CSS); `data-lazy-pqPyi0JA.js` = **939,520 B**, absent from `index.html`; a DS-DEF-1 variant string `grep -c` → **1 in data-lazy, 0 in `data-`, `index-`, `engine-core-`**.
- `DOSSIER_MOUNTS` → **56 mounts, 13 tabs, 53 distinct blocks; 52 `sentence` rungs, 4 `glance`; one glance-only block (DS-ECO-2)**.
- `DM_FIELD_FRAMED_BY_BLOCK` (`dmFieldProjection.js:85-94`) → **8 entries**; `grep -rn projectBesideDmField src` → runtime callers in **`defenseStateProse.js` only** (`:558, :1104, :1110`).
- `grep -rn generalDeskLines src/components` → six un-memoised render-body call sites (`OverviewTab.jsx:201`, `EconomicsTab.jsx:328`, `ViabilityTab.jsx:43`, `HistoryTab.jsx:37`, `RelationshipsTab.jsx:106`, `SteadingsSection.jsx:44`).
- `REGISTER-CARD.md` whole → **six registers**, of which the whole dossier corpus is one.
- Word count of §14 → **296**.
- Reads: `vite.config.js:865-880`, `dmFieldProjection.js` whole, `generatorGoldenMaster.test.js:795-860`, `read-instruments-seed.md §4.1-4.5`, `read-kernel.md:552-565`, `read-specs.md:125, :266`.

---

# FINDINGS

## F1 — BREAKS · HIGH · The occurrence floor and the departure line are measured on a sample whose state marginals are degenerate; the owner's own worked example occurs on ONE of 525 rows

**v1 claims** (§3.4): "The sample is the golden master's 525-row corpus builder (`generatorGoldenMaster.test.js:802-847`) **so tier, culture, terrain, route and threat all vary**"; and §6.1 sets OCCURRENCE at "a turn at ≥ 5 % of the sample (≥ 27 of 525)" and DEPARTURE at "≤ 10 %", both keyed on `rateBp` measured over that sample, with §13 row 6 freezing the norm leaf as "an OWNER-FACING SEED INPUT from the day it ships".

**Evidence (CONFIRMED).** The marginals of `tests/fixtures/generator-golden-master.json`:

```
threat  {"civilized":522,"frontier":1,"plagued":1,"safe":1}
route   {"road":294,"port":73,"isolated":73,"river":73,"random_trade":8,
         "mountain_pass":2,"crossroads":1,"none":1}
tier    {"town":105,"city":84,"hamlet":84,"metropolis":84,"thorp":84,"village":84}
```

The builder's threat and trade axes are *sweeps from a single base row*, not grid dimensions: `for (const monsterThreat of THREAT) rows.push({...base, monsterThreat, _seed: seed})` (`:815`) contributes four rows, of which `civilized` dedupes against the base. Only tier × culture × terrain is a real grid (6 × 12 × 7 = 504 rows).

Consequences, each arithmetic:
1. v1's own lead example (§0, §6.3) is a **frontier** wall. `country: pressed` fires on `measuredMonsterFamily ∈ {plagued, frontier}` (§6.3 row 1) = **2 of 525 = rateBp 38 (0.38 %)**. The fully-loaded DM cell the whole document is built around (strained wall × frontier × bought watch) is reachable on **at most 1 row**. The manifest cannot exercise the design's own worked block.
2. **No monster-threat-conditioned turn can ever clear the 5 % floor** (needs ≥ 27 of 525; the sample offers ≤ 2). Car 11's acceptance — "each turn's cell ≥ the floor on the grid" (§12 car 11) — permanently refuses the entire threat axis, including "the gate is sold" on a frontier wall.
3. The DEPARTURE signal collapses into a tautology on those axes: every threat- or `crossroads`-conditioned modifier scores DEPARTURE = 1 because the *grid* made it rare, not the estate. Salience band 2 is then handed out by an artefact of the fixture, and §13 row 6 freezes that artefact into every installed world's modifier ordering **forever**.
4. §3.4's stated ground for choosing this sample is measured false on two of its five named axes.

**Severity: HIGH.** This is the number the owner is asked to veto (§13 row 5) and the leaf he is asked to declare a permanent seed input (§13 row 6), computed on a sample that cannot support either.

**Fix.** Split the samples by purpose, and say so in §3.4 and §13:
- The **manifest** (drift proof) keeps the golden's 525 grid — it is the right corpus for a byte-comparison because it is the golden's own and it is stable.
- The **norm / occurrence corpus** is a new, marginal-controlled grid: the cross of the axes the norm leaf actually keys on — at minimum `threat(4) × route(8) × tier(6) = 192` cells, × terrain or culture where a pool's predicate reads them — with the population the marginals represent stated explicitly and put to the owner as a **new §13 row** ("the norm leaf's rates are uniform-over-configuration, not uniform-over-what-players-generate"). At 22.4 ms/town (`read-instruments §4.3`, executed there) 192 × 4 seeds = 768 towns ≈ **17 s**, so the cost objection does not arise.
- Until that corpus exists, the OCCURRENCE floor and the DEPARTURE line are NOT-EXECUTABLE, not 5 % and 10 % (the §908 law the document itself invokes at §3.5(c)).

---

## F2 — BREAKS · HIGH · The 525-town sample carries FOUR seeds; the repeat census and the duplicate-unit rate — the two instruments that measure the owner's staleness want — are structurally unmeasurable on it

**v1 claims** (§7): "The REPEAT CENSUS (C, a report arm over the manifest, per mount): distinct texts ÷ towns per state cell against the CHANCE FLOOR given the piece counts (a 3 × 4 spine alone: 1/12 per pair of towns in the cell; with one modifier and a joint: 1/432). A mount whose collision rate sits ABOVE the floor is a finding"; and "A's trendline: the DUPLICATE-UNIT RATE (share of (position, text) pairs seen on more than one town) printed at M0 before any text moves and after every car, so the owner's staleness claim is a measured delta." §3.6 folds both into the manifest run — "one run, four instruments".

**Evidence (CONFIRMED).** The fixture's seed census:

```
N 525 · distinct seeds 4 · {"golden-master-v3":516,"gm-seed-a":3,"gm-seed-b":3,"gm-seed-c":3}
```

The draw is `${seed}::${blockId}::${poolKey}` (`stateProseKernel.js:304`, cited by v1 at §2.4 row 1) and the face is a `::w` suffix of the same string (§2.6). **Seed is the only term that distinguishes two towns in the same state cell.** With 516 of 525 rows on one seed, any two towns that land in the same `(block, pool)` cell draw the same variant index and the same face with probability 1 — not 1/12, not 1/432.

So on this sample:
- the measured collision rate inside every cell is **1.0**, which is above the chance floor on every mount, so the repeat census fires as a finding on **100 % of rows** and is discarded as noise;
- the duplicate-unit rate is likewise saturated and cannot show a delta "after every car";
- the §7 sentence "Two towns render byte-identical text at one mount iff their INSTANCE coincides: ⟨spine key, ranked modifier keys, turn, spine index, faces, joint index, fills⟩" is true, but on this sample the last four terms are constants, so the operational test reduces to "same state cell" — which is exactly the claim it was built to check.

The conflation is architectural, not incidental: a **drift proof** wants ONE seed (stable, cheap, byte-comparable across builds) and a **repetition census** wants MANY seeds. §3.6 makes them the same run, so the repetition census inherits the drift proof's seed profile and dies.

Note what does survive: the **occurrence** census is state-keyed and therefore seed-invariant, so §3.4's use of the same run for the denominator is sound (subject to F1). And car 3's face-uniformity control is a separate 10,000-seed plant (§12 car 3), correctly specified.

**Severity: HIGH.** §7 is the section that answers the owner's headline want ("nothing will ever be stale, and if something is repeated, it is because that very specific instance is repeated"). Its two instruments do not work on the sample the document assigns them.

**Fix.** Two runs, two owner rows:
- Manifest / drift: 525 configs × 1 seed × 2 audiences — unchanged, ≈ 13 s (arithmetic in F13).
- **Repeat corpus**: the same configs re-resolved on K distinct seeds, K set by the power the chance floor needs. For a 1/12 floor, K ≥ 30 per sampled cell gives a usable estimate; 525 × 8 = 4,200 towns ≈ **94 s** at 22.4 ms/town (ESTIMATE from the executed 22.4 ms figure), which is a per-car instrument, not a per-CI one. Say that split out loud in §3.6 and price it in §12 car 1.
- **§13 row 14 must state the seed count, not only N.** As written the owner signs "the golden's 525-row grid on both audiences" without being told it is four seeds.

---

## F3 — BREAKS · HIGH · The beta-as-panel is blind to both staleness axes, and v1 gives no rule for the false staleness reports the promise guarantees it will generate

**v1 claims** (§8.5): "**No blind DM panel** (owner 09-07 ~20:10; Part B §17 line 632): the pre-launch acceptance is the checkers at the freeze, the refuters by sample, and the owner's walk; the beta's readers are the panel and the tell a reader names is a beta feedback surface."

**Evidence.** Against the design's own definitions of the two staleness axes (§7):
- **Within-town.** "Same seed, same state ⇒ same composed text on every visit, forever" (§7). A beta reader returning to a town they already read sees byte-identical prose by construction. To that reader, the promise and staleness are *indistinguishable*. The beta will therefore produce reports of exactly the shape "it never changes" — the owner's own headline complaint — as an artefact of the guarantee, and v1 supplies no rule for classifying them. Refusing reader feedback on the owner's stated want, with no written disposition, is where the program loses him.
- **Across-town.** The repeat the owner named is a property of the *pair distribution over towns in one state cell*. A beta reader meets a handful of towns and almost never two in the same cell, so the beta cannot observe a repeat at all. The instrument that can is the repeat census — which F2 shows is dead on the assigned sample.

Net: **neither** instrument in v1 measures across-town repetition as the owner defined it, and the one thing the beta *can* see (a lexical or rhythmic tell, and the new join surface — a connective that reads mechanical, a modifier that restates) is the thing §8.5 mentions only in passing.

I confirmed the DM-panel refusal is faithful to the owner's ruling (memory: OWNER 09-07 ~20:10, "our real game master will just come from the beta launch"); the objection is not to the refusal, it is that §8.5 does not say what the beta replaces and what it cannot.

**Severity: HIGH.** §8 is the acceptance chain for an owner-gated wave.

**Fix.** Add three sentences to §8.5, each a stated capability boundary:
1. The beta reads the **join** — connective, restatement, standpoint switch inside a unit — and that is the composed model's genuinely new failure surface; route those reports to the sitting as findings, per the refuter idiom.
2. The beta **cannot** measure across-town repetition (cell-blind) and **cannot** distinguish the promise from staleness within a town (byte-identical by design). State the classification rule now: a report of "the same words on every visit to one town" is a **PROMISE report**, answered with the guarantee and closed, never re-authored.
3. Name the instrument that does carry the owner's want: the repeat corpus of F2, printed per car with its N and seed count, as the measured delta §7 promises.

---

## F4 — BREAKS · HIGH · Car 8's two acceptances are jointly unsatisfiable, and there is no per-set exit

**v1 claims.** §8.1: "the exemplar-not-the-practical ruling bound as a stopping rule … each wording set is shot for the ideal in the first or second attempt and not chased after — '**no round past the second on any wording set**' is a car acceptance (cars 8 and 9)." §12 car 8 acceptance: "**zero FAIL**; every WITHHELD ruled; **no round past the second on any wording set**; Shift 1 signed."

**Evidence.** §8.4's table routes at least ten properties to the **FAIL** channel over the wave's own output: arm D (bag), A0 (reads ⊆ tests), A6 (B-CLAIM per face + slot/mark byte-equality), A1 (restatement/negation), A9 (fragment form; no `{settlement}`-initial face), armF F6, armF F1/F3/F2, armG, the face-count pin, `armThreeNumbers` past BUDGET/DEPTH — plus A5 (sibling distance) escalating REPORT → FAIL once the floor is measured (§13 row 7).

A wording set that still FAILs one of those after its second round admits exactly two outcomes under the stated acceptances: a **third round** (violates the stopping rule) or a **landed FAIL** (violates zero-FAIL). v1 provides no third exit at the set grain. The only refusal path §8.1 offers is for a writer who "cannot produce a lawful row" — a *pre*-authoring refusal, not a post-gate one. §12's preamble offers "a car that cannot meet its acceptance lands as a measured refusal, never a partial" — an exit at the **wave** grain, meaning one stuck set blocks Shift 1 for all 708 pools.

Scale makes this certain rather than hypothetical: **9,064 authored surfaces** (CONFIRMED), each walked by ~10 FAIL-channel arms. A 1 % residual-failure rate after two rounds is ~23 stuck sets; 0.1 % is still ~2.

**Severity: HIGH.** It is the acceptance on the document's only owner-gated text wave.

**Fix.** Add a third, per-set disposition and re-word both acceptances. The machinery already exists: §2.6 already carves nine rows out of the face freeze as `NO-FACES: bound`, so the face-count pin is necessarily **per pool**, not a global 4. Extend that:
- `FACES-BANKED: <arm>` — a set that fails an arm after round two keeps face 0 (today's text, already lawful), banks its drafted faces unpublished (NEVER TRIM is honoured: nothing is discarded, only unlanded), and is counted and printed in the car's receipt.
- Car 8's acceptance becomes: "zero FAIL **among landed sets**; every WITHHELD ruled; every `FACES-BANKED` row listed with its arm and its count; no round past the second."
- Add the banked count to the shrink-only ratchet family, so the wave's debt is visible and can only fall.
- §13 row 3 must then say four faces **or one**, per pool, so the owner signs the real shape.

---

## F5 — STRAINS · HIGH · The rewrite wave is unsized and undivided: "one workflow per register" is ONE workflow for 2,266 wording sets

**v1 claims.** §8.1: "Opus workflows to the register card (`REGISTER-CARD.md`, read whole), **one per register**, every lane `model: \"opus\"`". §12 car 8: "the REWRITE + FACES wave (**register by register as Opus workflows**) … every one of the 708 pools".

**Evidence (CONFIRMED).** `REGISTER-CARD.md` names six registers — "the dossier, the NPC ladder, the Herald, the chronicle, the DM page, chrome and the docent". The entire state-prose corpus is **one** of them: the dossier. So "one per register" allocates **one workflow** to:

| desk | blocks | pools | variants (= wording sets) | new faces |
|---|---|---|---|---|
| general | 23 | 193 | 634 | 1,902 |
| warFaith | 9 | 138 | 418 | 1,254 |
| defense | 11 | 126 | 383 | 1,149 |
| economy | 15 | 105 | 329 | 987 |
| power | 7 | 79 | 256 | 768 |
| stressors | 3 | 67 | 246 | 738 |
| **total** | **68** | **708** | **2,266** | **6,798** |

9,064 authored surfaces in one lane, under a max-four-build-lane cap and one-implementation-lane-at-a-time, against a program whose own record says a workflow dies with its session (memory: "A WORKFLOW DIES WITH ITS SESSION BUT ITS JOURNAL `result` LINES RESUME IT"). Car 8 carries no lane count, no per-lane allocation, no per-set cost, no resume plan, and no duration — while cars 0–7 and 9–14 are each sized as single cars. Car 9 *is* sub-divided ("block by block from the list"); car 8, the larger and the owner-gated one, is not.

Note the six-desk table above is the natural division the design already has to hand and does not use. The largest desk alone (general, 634 sets over 23 blocks) is still too large for one agent.

**Severity: HIGH** for a program the owner will schedule against; it is the single largest cost item in the document and it carries no number.

**Fix.** Replace "one per register" in §8.1 and car 8 in §12 with a sized plan:
- The unit is the **block** (68 of them; mean 33.3 sets, max ≈ 60), batched into workflows of one **desk section** (3–6 blocks, ≈ 100–200 sets), giving ≈ 15–20 workflows for car 8, four running at a time under the owner's cap.
- Each workflow writes its annex rows to disk before returning (the owner's window-cutoff directive) and is resumable from its journal.
- Print a per-set cost from car 6's taste — the taste authors 5 pools' worth of sets and is the only place a real per-set figure can be measured before the wave — and make "the measured per-set cost and the resulting lane count" a car 6 output and a **§13 row**, since the owner is being asked to fund it.

---

## F6 — STRAINS · MEDIUM · The size arithmetic is ~300 KB light in two named terms; the ratchet the owner signs is set from it, and 182 KB of the growth is free to remove

**v1 claims** (§10): "Nested faces add text plus array overhead, not a fourfold record copy: **3 × 280,577 B of sentence text (`read-data §6.4`) ≈ 842 KB**; **`poolMeta` ≈ 708 × 130 B ≈ 92 KB**; ≈ 770 new pieces × 4 faces ≈ 630 KB; the three leaves ≈ 75 KB ⇒ **≈ 2.3 MB raw for the state register** … a flat ×4 of records would be 2,156,509 B on its own." §13 row 16 puts that number to the owner.

**Evidence (CONFIRMED — measured in the projector's own pretty-printed shape over the six real leaves):**

| term | v1 | measured | delta |
|---|---|---|---|
| base JSON | — | 638,800 B | — |
| + 3 faces/variant + `grammar` | 842 KB | **1,093,275 B** (160.8 B per added face) | **+251 KB** |
| + `poolMeta` (role, tests[2], reads[1], predicate) | 92 KB | **233,950 B** (330.4 B per row) | **+142 KB** |
| flat-×4 counterfactual | 2,156,509 B | **2,383,447 B** | +227 KB |

v1's face term counts raw text bytes only; the projector emits each face as a quoted JSON string inside a `"wordings": [ … ]` array at ~10 spaces of indentation, so the true unit is 160.8 B against a 123.8 B mean text. The `poolMeta` term assumes 130 B for a record whose `predicate` alone is a sentence-length string.

Recomputing the whole (ESTIMATE, on the measured unit costs): 1,966,025 (today's corpus, faced and meta'd) + ≈ 564,000 (770 new pieces at the measured per-record 158 B + text + 3 faces, plus ≈ 250 new pool rows) + 76,800 (three leaves, v1's figure, unverified) ≈ **2.61 MB raw** — the brief's 2.5 MB bracket, not v1's 2.3 MB.

Over the wire, v1 is *conservative* in its own favour: measured gzip on today's leaves is **5.27 : 1** (641,410 → 121,630), not the assumed 4 : 1. Distinct faces will raise entropy, so ≈ 4.5 : 1 ⇒ ≈ **580 KB** gzipped — v1's ≈ 0.6 MB **HOLDS**.

**The free saving.** `tests`, `reads` and `predicate` are projector-and-walker inputs; v1's own §4.1 lists what the composer reads at render (role, relation, form, move, attach, plus the norm leaf) and none of the three appear. Measured: a render-only `poolMeta = {role}` costs 51,994 B against the full 233,950 B — **181,956 B raw (~35 KB gzipped) removable at zero functional cost**, by keeping `tests`/`reads`/`predicate` in `docs/content/wiring-census.json`, which §3.4 already commits as data and which never ships.

**Severity: MEDIUM.** No first-paint consequence (F13), but car 2's ceilings and §13 row 16 are set from the wrong number, so the ratchet the owner signs will be breached by car 8 and moved again — the exact pattern a ratchet exists to prevent.

**Fix.** Restate §10's arithmetic on the measured unit costs (160.8 B/face; 330.4 B/full pool row; 51,994 B total for a render-only one); carry ≈ 2.6 MB into §13 row 16; and split `poolMeta` into a shipped RENDER half and a census-resident AUTHORING half, adding the split to car 4's leaf-shape acceptance.

---

## F7 — STRAINS · MEDIUM · The wave's authored-output estimate contradicts the design's own worked refusal rate

**v1 claims** (§6.6): "The authoring wave: ≈ **3 modifier pools × 3 variants on each of ≈ 50 wired-and-resolved blocks ≈ 450**, turns at the floor ≈ 40 × 3 = 120, THIN pools' second grammars ≈ 200 → ≈ 770 new semantic pieces (≈ 3,100 wordings)."

**Evidence.** v1's own three worked blocks, which are its best cases (hand-picked, fully read, the owner's own example among them):

| block | modifier pools considered | authored in wave one | refused / not authored | refusal reason given in v1 |
|---|---|---|---|---|
| DS-DEF-11 (§6.3) | 5 | 3 | 2 | `stores: short` — echo bound (ii); `muster: short` — the spine's branch `tests` the gate |
| DS-DEF-2 (§6.4) | 4 | 2 | 2 | `muster: short` — echo (ii) then (ii) again; `watch: bought (*)` — same |
| DS-GEN-3 (§6.5) | 3 | 2 | 1 | `approach: narrow` — echo bound (ii), `tradeRouteAccess` spines at `overview.origin` |
| **total** | **12** | **7** | **5 (42 %)** | |

Mean authored modifier pools per block on the design's own exemplars is **2.33**, not 3. Applying that: 50 × 2.33 × 3 = **350**, against the 450 in §6.6 — a **22 % overstatement**, and the overstatement is not in the accounting but in the *specificity delivered*, because a refused modifier is a cell that stays bare.

The structural reason the refusal rate is high and will stay high is the design's own echo bound (§4.6 (ii)): "one producer fact backs a modifier at ≤ 1 mount per TAB, and at NO mount on a tab where that fact is a spine." With **53 mounted blocks over 13 tabs** (CONFIRMED) — ~4 blocks per tab — and 59 of the composers' 72 facts already KEY-ONLY (i.e. already spining somewhere), the facts available to a block are largely the facts its own tab has already spent. Every one of v1's five refusals is an instance of exactly this.

v1 does hedge the *total* ("equally unmeasured until car 0 prints the tiers") but does **not** hedge the per-block 3 against its own five worked refusals, and §6.6's "surfaced readings per block go from hundreds to tens of thousands" is stated without the refusal discount.

**Severity: MEDIUM** — it mis-sizes the wave the owner funds and overstates the delivered specificity, which is the commission's whole point.

**Fix.** Restate §6.6 on the worked rate (2.33 pools/block, 42 % refusal) with the echo bound named as the cause; add to car 0's acceptance a printed figure the estimate can be rebuilt on — **modifier-eligible facts per tab** = facts the tab's desks read that do not spine on that tab — which is a one-line derivation from the census's `fact → asModifier` index the car already builds, and which is the true ceiling on the wave's size.

---

## F8 — STRAINS · MEDIUM · Every bound is a numbered owner row except the one that sets the gate's cost: the composed walk's N is never set

**v1 claims.** §8.4 last row: "exhaustive per piece, **SAMPLED per composition** | R-DA-20's SIZE is one figure | **two figures, with N and the sample sha printed** (S17) | FAIL." §6.1's table sets a number for every other bound "with the measurement named", per the brief's §6. §13 row 5 lists eleven numbers for the owner to veto.

**Evidence.** The sample size N for the composed walk appears nowhere: not in §6.1's bounds table, not in §8.4, not in §13 row 5's veto list, not in car 5's or car 9's acceptance. §12 car 5 says only "the composed walk runs over the manifest's 525 towns and prints N and the sha" — which is a sentence that both asserts 525 and defers N.

This is the number that prices the gate. Order of magnitude: 52 sentence mounts (CONFIRMED), several returning many rungs — the general desk alone was measured at **17.6 rungs/town** (`read-instruments §4.3`, executed there) — so ≈ 50–60 composed units per town across six desks (ESTIMATE). At 525 towns × 2 audiences that is ≈ 55,000 units, each through ~13 arms. No per-entry walk cost is given anywhere in v1, so the CI cost of car 5's gate is unknown to within orders of magnitude, and §12 prices only car 1 ("cost ≤ 30 s").

**Severity: MEDIUM.** A gate whose cost is unstated is a gate that gets sampled down under time pressure without a ruling — and the walk is the only thing standing between composition and a false sentence.

**Fix.** Make N a bound like the others: measure the per-entry walk cost at car 6 (the taste already walks real composed pieces), set N from a stated confidence on the arms' fire rates, put it in §6.1's table and in §13 row 5, and price car 5's and car 9's gate runs in §12 the way car 1 is priced. State separately what runs per-CI and what runs per-car.

---

## F9 — STRAINS · MEDIUM · The memoisation hunk is deferred, and its trigger is measured on an instrument that structurally cannot see the cost

**v1 claims** (§10): "Most callers are un-memoised (`read-kernel` Q11); **a `useMemo` per desk call is a housekeeping hunk if the manifest run shows a page-set above 5 ms**." §12 files it under "Deferred and recorded".

**Evidence (CONFIRMED).** `generalDeskLines(...)` is called in the render body, un-memoised, at six sites: `OverviewTab.jsx:201`, `EconomicsTab.jsx:328`, `ViabilityTab.jsx:43`, `HistoryTab.jsx:37`, `RelationshipsTab.jsx:106`, `SteadingsSection.jsx:44`. Each call builds the whole general desk. `read-kernel:559` records `PlotHooksTab.jsx:32` as the only `useMemo` around a desk call.

The manifest is a Node property test that composes each town **once** (§3.6). It cannot observe how many times a React component re-renders, and therefore cannot observe the quantity the memo would remove. The stated trigger condition is unobservable on the stated instrument.

The magnitude is modest but the ordering is wrong. Today the general desk composes at **0.08 ms/town** (2 ms over 25 towns, `read-instruments §4.3`); v1's own §10 says composition adds "≤ 3 variant draws, ≤ 3 face draws, ≤ 2 connective draws, one integer ranking over ≤ 10 candidates and one tie-break hash per candidate" — roughly 3–4× the hash work per rung — so ≈ 0.3 ms per general-desk call after the model, × 6 un-memoised call sites, **per re-render**. Additionally §4.4's position budget composes all ten `overview.systemsHealth` rungs and then discards modifiers from eight; v1 acknowledges this ("an arrangement over draws already made") but never counts it.

**Severity: MEDIUM.** Not a correctness risk; it is a deferral justified by a measurement that cannot be taken, which is the shape of a deferral that never comes back.

**Fix.** Move the memo into **car 3 (M1)**, which already touches every desk and both `DeskLines` implementations and is proven byte-identical by the manifest — a `useMemo` keyed on `(settlement, seed, audience, publicDossier, playerView)` changes no draw and is provable under the same acceptance. Replace the manifest trigger in §10 with the honest statement: the browser-side cost is unmeasured, the manifest cannot measure it, and the memo is taken as insurance rather than as a response to a number.

---

## F10 — STRAINS · MEDIUM · The layman's summary tells the owner he is signing one text change when §8.6 says two, and names 4 of 21 decisions

**v1 claims** (§14): "Your decisions are in section 13: **the one signed wording change**, four wordings fixed forever, the rarity floor for hand-written lines, and the numbers you can veto."

**Evidence.** §8.6's own heading and first sentence: "This architecture produces exactly **TWO declared text shifts**, each proven by the manifest before it is signed" — Shift 1 (rewrite + faces, §13 row 1) and **Shift 2** (DS-DEF-11's Phase-2 re-key and the list-position keys, §13 row 4, `owner-gated`, car 10). §13 additionally carries: row 10, a **persisted-shape** change (the cause digest); row 19, a **same-seed behaviour shift on every world with a corrupt watch**; row 13, wire-or-retire on 468 authored sentences; row 16, the first-paint ceiling and a corpus growing from 641 KB to ≈ 2.6 MB. None of these reach §14.

Length **HOLDS**: 296 words against the brief's ≤ 300 (CONFIRMED by `wc -w`).

The owner's standing directive is layman's terms in every message to him (memory: OWNER 09-07 11:35), which §14 obeys in register. The defect is coverage, not register: it is the only part of the document he is expected to read, and it undercounts the signatures by one and the decisions by seventeen.

**Severity: MEDIUM-HIGH** on trust, low on engineering.

**Fix.** Rewrite §14's last paragraph within the 300-word budget by trading the third paragraph's die explanation (already carried in paragraph 3's first sentence) for a plain list: **two** signed text changes — the rewrite of every sentence, and the walls re-key; four wordings fixed forever; the rarity floor; and three things that wait for his word (a new saved field, an engine edge, and 468 written sentences that reach no reader). Add one plain sentence on size: the town-page word bank goes from about two-thirds of a megabyte to about two and a half, all of it loaded only when a tab is opened.

---

## F11 — STRAINS · LOW-MEDIUM · The faction ladder is promised a wave-two composer with no car, no owner row, and no entry in the deferred list

**v1 claims** (§9, the surfaces table): "**the faction ladder** (`power.blocs`) | R1 | `powerLadderRung` per faction on a per-instance seed (`PowerTab.jsx:480`) | shares the kernel? **yes** | each faction row a spine; modifiers from `deriveFactionProfile` (a canonical reader) — **wave two**; ceiling ≤ 0.07 lift-filtered".

**Evidence.** `powerLadderRung` exists and is called at `PowerTab.jsx:477` (CONFIRMED, `grep -rn powerLadderRung src`). But "wave two" is not a thing this document schedules: §12's fourteen cars contain no faction-ladder car (car 9 is "block by block from the list", i.e. the dossier blocks); §13's twenty-one owner rows contain no faction-ladder row (row 18 is the reservoir, a different wave-two act); and §12's "Deferred and recorded, not dropped" list names six items, none of them this. The only other "wave two" in the document, §2.9's reservoir, *is* properly carried (§13 row 18) — which shows the document knows how to carry one and did not carry this.

By the estate's own doctrine, a dropped thread is the failure and a deferred-and-recorded one is fine. This one is neither: it is asserted as scheduled and is scheduled nowhere.

**Severity: LOW-MEDIUM.** Small surface, but the brief's §9 asks precisely "which share the kernel, which have their own composer, and what the model means for each", and this row answers with a schedule that does not exist.

**Fix.** Either add the faction ladder to §12's deferred list with its reason (the per-instance seed and `deriveFactionProfile`'s bag are unwired; car 0's census must first say which faction facts a ladder rung's bag fills), or give it a §13 row beside row 18 as a named wave-two act. One line either way.

---

## F12 — STRAINS · LOW · The DM's-pen guard is module-wired on two of the eight framed blocks; composition lands on the other six

**v1 claims** (§9): "**the DM page / DM face** … `dmFieldProjection.js` keeps the DM's pen whole (**eight framed blocks**; the machine line renders BESIDE the field, never into it) | shares the kernel? yes | … a composed unit is one `beside` string".

**Evidence (CONFIRMED).** `DM_FIELD_FRAMED_BY_BLOCK` (`dmFieldProjection.js:85-94`) holds exactly **8** entries — DS-GEN-5, -6, -9, -11, DS-REL-2, DS-DEF-1, DS-DEF-3, DS-ECO-6 — so the count HOLDS. All eight are mounted at `sentence` rungs. But `grep -rn projectBesideDmField src` returns runtime callers in **`defenseStateProse.js` only** (`:558`, `:1104`, `:1110`), covering DS-DEF-1 and DS-DEF-3; `tests/domain/defenseStateProseDesk.test.js:5` records that the function "had ZERO runtime callers before this car".

The other six rely on component discipline rather than the guard module — and it is real discipline, not a bug: at `OverviewTab.jsx:432-434` the DM's `arrivalScene` renders in its own block and DS-GEN-5's `situationLine` renders separately at `:444-447`. So no pen is being written through today. The defect is that §9 states as a present-tense estate-wide property something that is a module guarantee on 2 of 8 and a convention on 6 of 8 — and the composed model is exactly the change that stresses the convention, because it makes those six machine lines longer (two sentences, up to three facts) and more assertive next to a field the DM wrote.

**Severity: LOW.** Nothing writes; nothing shifts a fact. But §12 has no car re-checking the six, and the module's own docblock says the reason it exists is that "an implementer wiring 'the corpus supplies this section's prose' the obvious way overwrites the DM's pen and does it silently".

**Fix.** Correct §9's DM row to say the guard is module-wired on two blocks and convention-held on six, and add to car 3 (M1, which already routes all six desks through the composer) a one-line acceptance: each of the eight framed blocks either routes through `projectBesideDmField` or is named in the car's receipt with the component line that keeps it adjacent. Cheap, and it converts a convention into a receipt before the units get longer.

---

## F13 — HOLDS · The first-paint claim, checked at a tip this design can read

**v1 claims** (§10): the leaves "ride the `data-lazy-*` chunk … routed there by `vite.config.js:876-878` (CONFIRMED: derived, not curated). The composer and the three new leaves are imported only by the desks, which are imported only by lazy tab components — **zero first-paint bytes**"; and it cites the brief's first-paint RAW 1,042,122 of 1,048,000 (margin 5,878 B) "from the L-MAT tip, which this design is fenced from".

**Evidence (CONFIRMED at `$SC/laneB6`'s own `dist`, which v1 did not measure):**

```
eager JS from index.html (script + 7 modulepreload) = 1,042,086 B   (+ 19,795 CSS)
  index-BQkmQLx6.js 570,269 · vendor-react 193,156 · engine-core 126,452
  data-DuZw95wO.js 114,865 · vendor-state 17,310 · kernel 10,457
  content-identity 5,349 · vendor-icons 4,228
data-lazy-pqPyi0JA.js = 939,520 B — absent from index.html entirely
grep -c "<a DS-DEF-1 variant string>":  data-lazy 1 · data- 0 · index- 0 · engine-core 0
```

Margin to 1,048,000 = **5,914 B** at this tip, corroborating the brief's 5,878 B at the L-MAT tip. The chunk rule reads `if (id.includes('/src/data/')) return isEagerData(id) ? 'data' : 'data-lazy';` (`vite.config.js:877-878`) — derived from what an eager chunk statically reaches, as v1 says. The three new leaves fall under the same rule and stay lazy as long as no eager module imports them; car 2's chunk-membership assertion is the right guard and is correctly placed **before** any composer byte.

**No change requested.** One addition worth making: v1 cites its first-paint receipt from a tip it is fenced from while a measurable dist sits in its own dock. Cite the dock's own 1,042,086 / 5,914 alongside, so the number in §13 row 16 rests on a tip the document can read.

---

## F14 — HOLDS · The manifest's ≤ 30 s and the per-desk render cost

**v1 claims** (§10, §12 car 1): the manifest at "525 towns × 2 audiences, ≈ 30 s ESTIMATE"; "compose ≈ 0.1 ms per town for the general desk"; "ESTIMATE under 2 ms per dossier over ~56 mounts".

**Evidence and arithmetic.** `read-instruments §4.3` executed 25 towns in 561 ms = **22.4 ms/town, of which 559 of 561 ms is `generateSettlementPipeline` and 2 ms is composition** (0.08 ms/town for the general desk — v1's ≈ 0.1 ms rounds it correctly). Generation runs **once** per row and composition twice (two audiences):

```
525 × 22.4 ms  = 11.76 s   generation (dominates)
525 × ~0.5 ms × 2 audiences ≈ 0.53 s   six-desk composition (ESTIMATE, scaled from the general desk)
                            + serialisation and per-mount sha
                            ⇒ ≈ 13–15 s, comfortably inside ≤ 30 s
```

So car 1's cost acceptance **HOLDS**, with headroom — which is also why F2's fix is affordable.

The render figure holds as an order of magnitude but its **unit is wrong**: the composer's work is per **rung**, not per mount. 52 of 56 mounts are `sentence` rungs (CONFIRMED) and several return many rungs — the general desk alone measured **17.6 rungs/town** — so "≤ 3 variant draws … over ~56 mounts" understates the draw count by roughly the rung-to-mount ratio. Scaling the measured 0.08 ms by v1's own ~3–4× hash multiplier still lands near 0.3 ms per general-desk call and ≈ 1 ms for six desks, so **under 2 ms per desk pass holds**. The number that does not hold is per *page-set*, because of the six un-memoised call sites (F9).

**Fix (wording only).** Say "per rung" where §10 says "over ~56 mounts", and give the rung count (52 sentence mounts; 17.6 rungs/town on the general desk alone, measured) so the multiplier is legible.

---

# SUMMARY

| # | verdict | severity | one line |
|---|---|---|---|
| F1 | BREAKS | HIGH | the norm/occurrence sample's threat marginal is 522/1/1/1; the owner's frontier example occurs once in 525 |
| F2 | BREAKS | HIGH | 4 seeds in the 525-town sample; the repeat census and duplicate-unit rate cannot run on it |
| F3 | BREAKS | HIGH | the beta is blind to both staleness axes and will report the promise as staleness, with no rule written |
| F4 | BREAKS | HIGH | car 8 demands zero FAIL and no third round with no per-set exit between them |
| F5 | STRAINS | HIGH | "one workflow per register" = one lane for 2,266 wording sets / 9,064 surfaces; no sizing anywhere |
| F6 | STRAINS | MEDIUM | size arithmetic ~300 KB light in two named terms; 182 KB of it removable for free |
| F7 | STRAINS | MEDIUM | 450 modifier variants assumes 3/block; the design's own worked blocks deliver 2.33 with a 42 % refusal rate |
| F8 | STRAINS | MEDIUM | the composed walk's N — the number that prices the gate — is the one bound never set |
| F9 | STRAINS | MEDIUM | the memo deferral's trigger is measured on an instrument that cannot see the cost |
| F10 | STRAINS | MEDIUM | §14 tells the owner he signs one text change; §8.6 says exactly two |
| F11 | STRAINS | LOW-MED | the faction ladder's wave two exists in no car, no owner row, no deferred list |
| F12 | STRAINS | LOW | the DM's-pen guard is module-wired on 2 of the 8 framed blocks |
| F13 | HOLDS | — | zero first-paint bytes, re-measured at this dock: 1,042,086 eager, 5,914 B margin, leaves only in data-lazy |
| F14 | HOLDS | — | manifest ≈ 13–15 s against ≤ 30 s; per-desk composition under 2 ms — but the unit is rungs, not mounts |

**The through-line.** v1 is strongest exactly where it measured (the two-level roll, the seat and fact bounds, the chunk routing) and weakest wherever a number was inherited rather than taken. Four of the five HIGH findings are one fault: **the 525-row golden corpus was adopted as the universal sample without checking its marginals or its seed count**, and it is then asked to serve four instruments (§3.6's "one run, four instruments") whose sampling requirements are mutually exclusive — a drift proof wants one seed, a repetition census wants many, an occurrence census wants controlled state marginals, and a reading-sequence generator wants page order. Splitting that one run into three cheap ones (≈ 13 s, ≈ 94 s, ≈ 17 s on the executed 22.4 ms/town) fixes F1 and F2 outright and gives F3 its missing instrument.
