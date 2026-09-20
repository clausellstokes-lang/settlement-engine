# RECON-G — the Overview's `resilienceScore` against its band label

**Lane:** Opus RECON. Measured and reported; **nothing edited, staged or committed anywhere.** No vitest, eslint, npm script or build was run. Plain `node` on scratch scripts only, one process at a time.
**Tree read:** `$SP/read-tip-58fcfe614`, detached at `58fcfe614`; `git status --short` empty before and after the work.
**Holds at the build tip — CONFIRMED, not taken on report:** `git diff --stat 58fcfe614 fixes-2026-09-18-consist -- src tests/fixtures tests/helpers` is EMPTY; the only difference between the two commits is six docs files (`docs/DESIGN_EDIT_MODE_AND_DECREES.md`, `docs/implementation/…`, +757 lines). Every `src/`, golden and corpus fact below holds at `76be138a1`.
**Generation budget:** ONE 525-row run (8.0 s), cached to `g-525.json` and re-read by every analysis; plus two bounded 63-row lifecycle probes (1.4 s each) and one 8-row worked probe. Nothing was generated twice.

⚠ **Hazard found and cleared, recorded here because it will bite the next lane:** the kit's `tools/rederive-prototype-*/instrument.mjs` does `process.chdir(TREE)` at import. A harness that writes to a *relative* output path therefore writes **into the read tree**. My first 525-run did exactly that; both files were moved into this scratch within seconds and `git status --short` on the read tree is empty again (verified). The scripts here now use an absolute scratch path. **A recon harness built on `instrument.mjs` must never use a relative write path.**

---

## OUTCOME — answer first

**Is the defect real at this tip? Not the one that was reported. A different and larger one is.**

Three findings, in order of what they cost the owner:

1. **The reported defect is REFUTED as framed.** The claim was that "the bands were re-cut on 2026-07-22 and one side was not carried." **No band was re-cut on that date or near it.** Re-reading the thresholds table against every generated record, the printed label is exactly what the thresholds say on **525 of 525 rows — zero disagreements.** There is nothing to carry.

2. **There IS a real incoherence on that row of the Overview, and it is not a mismatch — it is two different facts wearing one heading.** The word ("Secure", "Import-Dependent"…) is cut from the settlement's **food deficit**. The bar beside it is `resilienceScore`, a 0–100 composite of **granary months, source diversity, import independence and adequacy**. They are different quantities, and they disagree loudly: **124 of 525 towns print an alarming word beside a bar at or past half full**, and across the corpus **"Deficit" carries a *longer* average bar (37.2) than "Active Famine" (43.7)** — the ladder inverts against its own bar.

3. **The costly defect is a lifecycle one, and it is the owner's to rule.** The bar is **re-graded every campaign tick**; the word is **never re-graded at all**. After **one quiet campaign month, 43 of 63 settlements print a Food Security word the thresholds contradict**; the word moved on **0 of 63** across a full campaign year while the bar moved on **46 of 63**. The Overview's own caption promises the opposite: *"Food Security is re-judged as the campaign advances."* Only its bar is.

**How often:** at generation, 0/525 wrong. After one campaign month, 43/63 wrong under the live reading. The word never changes for the life of a save.

---

## 1. The two sides, by symbol

### The score

`src/generators/foodGenerator.js:486-491` — a generation-time composite, 0–100, four slices:

```js
resilienceScore: Math.round(
  (storageMonths / 12 * 35)          // storage weight
  + (diversityScore * 30)             // diversity weight
  + (importDependency < 0.2 ? 15 : importDependency < 0.4 ? 8 : 0) // low dependency bonus
  + (deficitPct < 5 ? 20 : deficitPct < 20 ? 10 : 0)               // adequacy bonus
),
```

Re-graded at tick time by `src/domain/worldPulse/foodStockpile.js:387` — the storage slice only, on top of a stashed non-storage remainder (`resilienceRest`):

```js
const resilienceScore = Math.round(clamp(resilienceRest + resilienceStorageComponent(storage), 0, 100));
```

Observed range across the corpus: **31 … 93**, on 24 distinct values.

### The band label

`src/generators/foodGenerator.js:339-359` — a **different number**: the food deficit/surplus and the famine flag. `resilienceScore` is not an input.

```js
if (stressFamine)         label = 'Deficit — Active Famine';
else if (deficitPct > 40) label = 'Deficit';
else if (deficitPct > 15) label = 'Import-Dependent';
else if (deficitPct > 5)  label = 'Pressured';
else if (surplusPct > 40) label = 'Surplus';
else                      label = 'Secure';
```

**And at tick time it is a STORED FIELD that nobody rewrites.** `foodStockpile.js:404-434` builds the next record as `{ ...fs, storageMonths, deficitPct, surplusPct, resilienceScore, stockpile }` — `label`, `color` and `bg` ride through on the spread, untouched, while `deficitPct` (the label's own input) is overwritten beside them. Four other tick-time writers do the same, touching only `storageMonths`: `applyWorldPulse.js:106`, `mutateWorld.js:1153`, `generosityUpdates.js:65`, `magicBufferApply.js:357`. **A tree-wide grep finds no tick-time writer of `foodSecurity.label` and no display-side re-derivation of it** (searched `src/domain/display`, `src/components`, `src/pdf` for the threshold expressions: zero hits).

### One producer, or two derivations that can disagree?

**Two derivations of two different quantities, on two different time-bases.** There is no shared producer. The score is live; the word is frozen. The Compendium documents the word's thresholds correctly (`src/domain/compendium/bandLadders.js:159-166`) and says nothing about the bar.

### Every surface that prints either

| Surface | Prints the WORD | Prints the SCORE |
|---|---|---|
| Overview › Systems Health | `OverviewTab.jsx:462` (`statusCase(eco.foodSecurity.label)`) | `OverviewTab.jsx:465` — as the **bar width**, `width: ${resilienceScore}%`. The number itself is never shown. |
| Defense › Disasters & Famine | — | `DefenseTab.jsx:254` — `scores.disaster ?? …resilienceScore ?? …` |
| PDF | — | `pdf/lib/viewModelBodySlices.js:174-176` (`foodResilience`) |
| Dossier prose | DS-GEN-3 + DS-ECO-9 pools key on the label (`generalStateProse.js:261-266, 1745`; "A PERFECT six-for-six identity") | DS-ECO-9's title names it |
| Quick guide | `settlementQuickGuide.js:530, 579` | — |
| Prosperity / factions | `factionDynamics.js:149`, `economyReconciliation.js:90` | — |
| AI context | via the three `supabase/functions/_shared/ai*Bundle.js` food-ledger defaults | same |
| Live derivations | — | `militaryStrength.js:237-239` (logistics), `tradeSalience.js:169`, `stressorDynamics.js:102` |

**The one place the two stand beside each other is the Overview row** — which is what the chart census flagged.

## 2. The disagreement, by execution

`node g-measure.mjs 525` (one run, 8.0 s) → `node g-part1.mjs 525`:

```
A. label vs the thresholds table re-read from the PUBLISHED (rounded) deficitPct/surplusPct:
   rows disagreeing: 0/525

B. resilienceScore (the BAR) observed beside each band label (the WORD):
   label                      n     score min..max   mean
   Surplus                    0     -
   Secure                      117    61..93       71.8
   Pressured                   151    40..73       61.3
   Import-Dependent            208    31..73       51.1
   Deficit                      13    35..63       37.2
   Deficit — Active Famine      36    39..51       43.7

C. INVERSIONS — a BETTER word carrying a LOWER bar than a WORSE word:
   ordered pairs inverted: 13238  (of 137550 unordered pairs)

D. the two shapes a reader notices:
   reassuring word ("Secure"/"Surplus") beside a bar UNDER half: 0/525
   alarming word ("Pressured"+) beside a bar AT OR OVER half:   124/525

E. is the WORD a function of the BAR? distinct scores=24; scores carrying >1 label: 8
   worst: 39→{Import-Dependent,Deficit — Active Famine} … 51→{Pressured,Deficit — Active Famine,Import-Dependent} … 73→{Import-Dependent,Pressured,Secure}
   most labels on ONE score value: 3
```

Reading these:

- **A — zero threshold errors.** The label is exactly what the bands say, on every row. **The reported "one side was not carried" is refuted.**
- **B — the ranges overlap almost completely.** `Import-Dependent` spans 31–73; `Pressured` 40–73; `Secure` 61–93. A bar of 73 appears beside three different words. And **`Deficit` averages a *shorter* bar than `Active Famine`** — the two worst rungs are inverted against the bar, because a famine town keeps its granary and diversity while its deficit collapses.
- **C — 13,238 inverted ordered pairs.** The worst single case: `thorp|…|desert|road` prints **"Import-Dependent" at a 31 % bar** while `town|germanic|mountain|mountain_pass` prints the strictly worse **"Deficit" at 63 %** — twice the bar, a worse word.
- **D — the failure is one-directional.** Never a reassuring word beside a short bar; **124 rows** with an alarming word beside a bar at or past half. Concentrated in town (50/105), metropolis (38/84), hamlet (24/84).
- **E — the word is not a function of the bar.** 8 of 24 score values carry more than one label; 51 and 73 carry three each. Any cure that derives the word from the bar destroys information that exists today.
- **A sixth rung never fires.** `Surplus` requires `surplusPct > 40`; the corpus maxes at **8** (24 rows above zero). The Compendium documents a rung (`bandLadders.js:161`) that **0 of 525** settlements can reach. Recorded as a separate observation, not part of this decision.

### The lifecycle measurement — the finding that actually costs something

`node g-stale.mjs` (63 rows, 1.4 s), ticking the REAL `advanceFoodStockpile` (the same function `pulseKernel.js:543` calls on a live campaign), **with no stressor at all**:

```
at GENERATION, word disagrees with the thresholds : 0/63
after ONE quiet month, word disagrees             : 43/63
after TWELVE quiet months, word disagrees         : 34/63
the BAR moved within one month                    : 22/63
the BAR moved within twelve months                : 46/63
the WORD EVER moved                               : 0/63

by the word the record prints after 12 quiet months (STALE rows only):
   "Pressured" → thresholds say "Secure"  ×17
   "Import-Dependent" → thresholds say "Secure"  ×15
   "Deficit" → thresholds say "Secure"  ×2
```

Worked, from `g-tick.mjs`:

```
town|germanic|mountain|mountain_pass|civilized|golden-master-v3  (Schwarzwalde)
   generated : word="Deficit"  bar=63  deficitPct=52  storage=6.3
   +1 quiet  : word="Deficit"  bar=62  deficitPct=5   storage=5.87
   +5 famine : word="Deficit"  bar=51  deficitPct=5   storage=2.02
   → word moved=false  bar moved=true  the word's OWN input (deficitPct) moved=true
   → the thresholds now say "Secure"; the record still prints "Deficit"  ⛔ STALE WORD
```

The drawdown is working as designed — the granary covers the gap, `deficitPct` falls 52 → 5. The word simply never follows.

## 3. What the 2026-07-22 re-grade changed — it changed no grade

**There were two commits that day, and neither touched a threshold.** CONFIRMED:

- `697bf4191` *(2026-07-22 00:38)* — "Dossier stats: Enforcement Ratio -> Food Security, drop Food Deficit line (orders 12-13)". `git show --stat`: **one file, `src/components/new/tabs/OverviewTab.jsx`, +14/−18.** Its own message says *"Display-layer only, no generation change."* What it did was replace a raw `safetyRatio` float with the food band, and point the bar that had tracked the ratio at `resilienceScore` instead. **That commit is where the word and the bar first stood side by side — it created the pairing, it did not break a grade.**
- `d7db7a167` *(2026-07-22 04:35)* — "Wave G (deferred ladders)". Added the Compendium's six-rung Food Security ladder, **stating the generator's thresholds correctly** (surplus >40 %, deficit >5 / >15 / >40, famine floor). Measurement A confirms those readings match the generator on 525/525.

**The thresholds themselves:**

- `git log -S "deficitPct > 15" -- src` → last touched **`3cf0cd4ba`, 2026-06-11** — six weeks *before* the 2026-07-22 pairing.
- `git log -S "storageMonths / 12 * 35" -- src` → **one commit, `e608542bd`, 2026-04-13**, the initial build. The resilience composite has **never** been re-cut.

**Which side was not carried:** neither. What was not carried is the **time-base**. The commit pointed a bar at a number that `foodStockpile.js` later made live, beside a word that has stayed frozen since generation — and wrote a caption (`OverviewTab.jsx:413`) promising the reader that *"Food Security is re-judged as the campaign advances."*

## 4. What each candidate cure would MOVE

**The crux the owner is actually deciding** — which deficit should the word describe? Measured both ways over 63 rows, twelve quiet months (`g-crux.mjs`):

```
READING A — the word describes the LIVE (granary-relieved) deficit the record publishes:
   the printed word is WRONG on 34/63 rows
READING B — the word describes the STRUCTURAL deficit (stockpile.baseDeficitPct):
   the printed word is WRONG on 0/63 rows
the BAR moved on 46/63 rows either way (it is re-graded from the LIVE granary)
```

**Under reading B the frozen word is CORRECT — it is a structural fact about the land and the routes, and freezing it is right.** Under reading A it is stale on more than half the corpus within a month. The bar is unambiguously on reading A. So the honest description of the defect is: **a structural word and a live score, under one heading, with a caption that claims the live reading for both.**

| Cure | Printed labels that move | Generator golden (525 rows) | Prose manifest (1050 rows) | Saved worlds | Notes |
|---|---|---|---|---|---|
| **(a) re-grade the label to the current thresholds** | **0** | **0** | **0** | none | **A NO-OP.** 0/525 disagree today. Nothing to re-grade. |
| **(b) re-grade the thresholds to the label's old cut** | **0** | **0** | **0** | none | **A NO-OP.** No threshold ever moved: `deficitPct > 15` last 2026-06-11, the composite never. There is no old cut. |
| **(c) derive the label from the score at ONE producer** | **208 / 525 (40 %)** — best case, bands fitted to reproduce today's label mix exactly | **525 / 525** (the golden hashes the whole record; `label` is in every one) | **up to 416 of 1050** — DS-GEN-3's food pool key IS the label, six-for-six; 208 keys × `::dm` + `::player` | old saves keep the old word until a migration | **Destroys information.** 8 score values carry >1 label today, two carry three. A famine town and a secure town would be given the same word. |
| **(d) name the bar — print what it measures** | **0** | **0** | **0** | **none** | Display-only. The row stops implying the bar is the band's fill. Costs one label and a caption. |
| **(e) point the bar at the word's own number** (deficit/surplus) | **0** | **0** | **0** | **none** | Display-only. Every bar *width* moves; no printed word moves; the row becomes internally coherent. Loses the resilience read from the Overview — it still lives on the Defense tab and in the PDF. |
| **(f) re-grade the word LIVE** (`foodStockpile.js` recomputes `label`/`color`) | **43 / 63 within one campaign month** | **0** — generation is unchanged; the golden hashes `generateSettlementPipeline`, which runs no ticks | **0** — the manifest is generation-time | **every save changes the first time the clock advances** | The only cure touching `src/domain`. ⚠ It makes a lived town's Food Security word move, which is **THE PROMISE's territory** — and it commits to reading A, which says a town whose granary is covering its gap is "Secure". |

**Does any prose read the band?** Yes. `DS-GEN-3`'s food pool keys are the six label spellings verbatim (`generalStateProse.js:261-266`), and `DS-ECO-9` is the food-security ladder block. So cure (c) moves prose; cures (d), (e) and (f) do not move the *generation-time* manifest, though (f) changes what a ticked town says.

**Does a saved world persist the label?** **Yes — verbatim.** `src/lib/saves.js:470` stores `data: settlement`, the whole record; load runs `migrateSettlementShape`, never a regeneration. **What a DM with a saved world would see:** under (a), (b), (d) or (e) — no change to any word they have ever read. Under **(c)** — nothing changes until they generate a *new* town, and their old towns keep words the new engine would never print, so two towns in one campaign can be graded by two different rules. Under **(f)** — the word on every existing saved town becomes live the moment they advance the clock; a town they have known as "Deficit" for a year of play starts reading "Secure" because its granary is covering the gap.

## 5. The proposal for the OWNER

**What a DM sees today, concretely.** Open **Schwarzwalde** — a mountain metropolis on a road (`metropolis|germanic|mountain|road|civilized`). Systems Health, Food Security row:

> **Food Security — Import-Dependent**, with the bar beside it **73 % full**.

Under a caption that says *"Food Security is re-judged as the campaign advances."* The word says the town cannot feed itself and leans on its roads; the bar says it is comfortably resilient. Both are true — it has **12 months of grain** and diverse sources (that is the 73 %) and a **30 % food deficit** (that is the word) — but the row gives the reader no way to know they are two different facts, and the caption tells them the pair is live when only half of it is. Play a single quiet month and the deficit falls to 5 %; the bar ticks to 72; **the word stays "Import-Dependent" forever.**

**What they would see under each cure.**
- **(a) / (b):** exactly what they see now. Both are no-ops.
- **(c):** the same bar, but the word chosen by the bar's band — and 40 % of all towns get a different word from the one they have today, with famine towns and merely-dependent towns sometimes sharing one.
- **(d):** the same word and the same bar, but the bar is *named* — "Food resilience 73" beside "Import-Dependent" — so the reader is told they are looking at two facts. Nothing else in the product changes.
- **(e):** the same word, and a bar that finally means it — a short bar beside "Import-Dependent", a full one beside "Secure".
- **(f):** the word moves with the campaign, as the caption already promises. Schwarzwalde reads "Secure" a month in, because its granary is covering the gap.

**What each costs.** (a), (b), (d), (e): **nothing** — no golden re-records, no saved world changes, no printed word moves. (c): **525 generator-golden hashes and up to 416 prose-manifest rows**, and a permanent split between old saves and new towns. (f): **zero goldens**, but it changes the wording of **lived history on every existing save** and commits the product to calling a granary-covered deficit "Secure".

**The lane's RECOMMENDATION — marked as a recommendation; the owner decides.**

1. **Drop (a) and (b).** They are measured no-ops; keeping them on the queue costs attention for nothing.
2. **Take (d) now.** It is display-only, zero-cost on every golden and every save, and it removes the actual reader-facing lie — that one heading covers one fact. It also makes the Overview honest about what the Defense tab and the PDF already print under the name "food resilience".
3. **Fix the caption in the same breath.** `OverviewTab.jsx:413` currently promises the whole row is re-judged. Until (f) is ruled, it should promise only what is true.
4. **Refuse (c).** It is the only option that destroys information — two of the score's values carry three different labels today — and it is the only display cure that moves goldens.
5. **Put (f) in front of the owner as its own question**, because it is the one with real stakes: it is a `src/domain` re-grade, it moves lived wording on existing saves, and it forces a ruling on whether "Food Security" names the **structural** condition of the land (reading B — today's frozen word, correct on 63/63) or the **lived** condition of the table (reading A — what the caption promises, and what the bar already does). I have not ruled it and do not think a lane should.

## What I could not measure, and what would settle it

- **Whether a real DM's campaign ticks the way my probe does.** I called the real `advanceFoodStockpile` directly, but with `one_month` intervals; `foodStockpile.js:63-65` states *"the orchestrator only ever ticks `one_week`; the coarse entries are reached solely by direct unit-test calls."* The *direction* is identical and the per-tick relief is ~4× smaller, so the stale-word count is reached more slowly, not avoided — but I did not run the real orchestrator (`pulseKernel.js:543` is its call site, and driving it needs a world, which is beyond a plain-`node` recon). A short `worldPulse` soak on one seed would settle the timing exactly. **My "after one quiet month" figure is therefore an optimistic-for-the-defect bound on the calendar, not on the outcome: the word never re-grades on any interval.**
- **Whether the `Surplus` rung is reachable at all**, or only unreachable in this corpus. Max observed `surplusPct` is 8 against a >40 threshold. A targeted sweep over high-agriculture terrain × low population would settle it; if it is genuinely unreachable, the Compendium documents a rung that cannot occur.
- **The exact prose-manifest row count under cure (c).** I established the mechanism (DS-GEN-3's pool key is the label, six-for-six) and the upper bound (208 keys × 2 leaves = 416 of 1050), but I did not run the projection to confirm DS-GEN-3 is audible in both leaves on all 208. `node scripts/prose-manifest-cells.mjs` would settle it — it was out of scope for a no-npm lane.
- **Off-corpus frequency for both parts.** Everything here is the 525-row golden corpus. It is the program's canonical sample, not a player-behaviour sample.

---
*Measured by RECON-G, 2026-09-19, at `58fcfe614` (src/ identical to build tip `76be138a1`). Scripts and cached corpus in this directory: `g-measure.mjs`, `g-part1.mjs`, `g-part2.mjs`, `g-stale.mjs`, `g-crux.mjs`, `g-tick.mjs`, `g-525.json`, `g-63.json`, `g-stale.json`. PART 2 is written up in full in `FIX-G1.measurement.md`.*

## PART 2 — FIX-G1, in one paragraph

**Real, reproduced, and rarer than feared: exactly 1 of 525 rows.** `viability.js:82` counts DEPENDENCY-severity rows across `[...issues, ...warnings]`; `viability.js:568` publishes `dependencies` from `warnings` alone. Two `foodBalance.js` arms (lines 369, 382) push a DEPENDENCY into `issues`, so the sentence counts a drawer the list never shows. On `town|germanic|mountain|mountain_pass|civilized` (**Schwarzwalde**) the sentence says **6** and the list holds **5**; the sixth is "Severe Food Import Dependency", filed under issues. The list is right — the record's other counter (`metrics.dependencyCount`) agrees with it on **525/525**. Plot hooks: **0/525** wrong. Critical issues: **0/525**. Warnings and suggestions: the sentence never states either count, so there is no check to fail. The smallest cure — count from the published list at one site — changes **one digit on one town**, re-records **1 of 525** generator-golden hashes and **0 of 1050** prose-manifest rows, and leaves every saved world reading "6" because the sentence is stored verbatim and is DM-editable. Full measurement, the before/after sentence and the cure's caveats: `FIX-G1.measurement.md`.
