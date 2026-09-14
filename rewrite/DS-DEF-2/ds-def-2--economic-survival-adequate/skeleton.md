Seat: MARKER (opus), DS-DEF-2 · pool `Economic Survival: ADEQUATE` · the skeleton the writer drafts from; nothing here is a face.

# DS-DEF-2 · `Economic Survival: ADEQUATE` · SKELETON

Three shipped variants, vids 1 to 3, angles `[ledger]` `[unfolding]` `[threshold]` in that order. The rows below are the annex's (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2685-2688`) and the generated leaf carries the same three texts with the same vids, angles and slot sets (`src/data/dossierStateProse/defense.generated.js:822-845`; the pool's manifest row at `:1306-1321` reads `role: spine`, `variantCount: 3`, `faceCounts: [1,1,1]`, `vids: [1,2,3]`, `readsCount: 1`, `attach: []`). The writer rewrites these three, one for one, and gives each its four `[face]` sub-rows.

⚠ **THE SLOT SETS ARE NOT UNIFORM ACROSS THIS POOL, and that is a wall.** Vid 1 and vid 3 carry `{settlement}`; **vid 2 carries NO SLOT AT ALL** (`"slots": []` at `defense.generated.js:834`). A face's slot set must equal its parent's (ARCH §2.5's face-row refusals), so **vid 2's four faces never name the town** — "the town" is the only form available to them — and vid 1's and vid 3's four faces each carry `{settlement}` exactly once. A sentence-form face may not OPEN on a `proper`-typed slot either (T-F8), so `{settlement}` sits inside the sentence, never first.

⚠ **THE CENSUS RECORDS ONE GRAMMAR ACROSS ALL THREE VARIANTS** (`wiring-census.json` row 26: `"variants": 3, "grammars": 1`). MOVE-GRAMMAR §3.2 wants min(k, |set|) = **three distinct level-1 grammars** in a pool of three, and today the pool has one. That is a rewrite target the gate can see, and it is the mechanical face of the craft verdict in §4.

**THE TEST THIS PACKET IS MARKED UNDER (ADDENDUM 14, the owner 2026-09-12).** A face is LAWFUL unless it CONTRADICTS the record. Silence is permission. "The card does not license it" is not a finding and the tag `unlicensed` does not appear anywhere below. Claims are tagged SAFE, CONTRADICTED (with the field, file and line, and which of the two is the record) or FLOOR-2.

---

## 0. What the writer reads before the first word

### 0.1 The licence card, printed this session in the dock (`node scripts/prose-licence-card.mjs DS-DEF-2 'Economic Survival: ADEQUATE'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Economic Survival: ADEQUATE`)
  reads:      scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js) === ADEQUATE
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger threshold unfolding
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading, so every pool
              that selects a row of `ECONOMIC_ROW_POOL` shares ONE echo key: a mount counted
              there may be a sibling ROW of the same table
  covert:     no
  source:     (none) · standing SOURCE-UNRESOLVED
              NO citation is licensed: a face naming a record holder here is refused by arm A13
  may claim:  that the reader `scoreBand(economicScore)` selects the row `ADEQUATE` of
              `ECONOMIC_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a
              dated cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is
  null everywhere); a named character and that character's fate; a theological claim
```

The census row behind the card (`docs/content/wiring-census.json`, row 26) adds: `status: RESOLVED`, `keyFunction: ECONOMIC_ROW_POOL`, `rung: table`, `readsGrain: branch`, `narrowed: false`, `absent: {}`, `objectClasses: []`, `sites: ["defense.threatAssessment"]`, `attach: []`, `rateBp: 1250`, `source.holderReason: "no mapping row resolves any field this pool reads"`.

⭐ **THE A13 CITATION BAR IS NOT A BAR ON RECORD WORDS.** The contradiction table strikes W24 entire: accounts, returns, duties, ledgers, manifests, minutes, the writ, a licence are all back, and a `[ledger]` face may reach freely for the town's own books. What stays refused is a CITATION to a named keeper the card cannot resolve (F1-24). Write "the entry", "the return", "the accounts"; never "the treasurer's books say" or "by the reeve's reckoning".

### 0.2 The block's header lines (annex lines 2568 to 2593, the parts that bind this pool)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`) **rendered beside the prose**. This pool is row 4, and — alone among the five — its key IS the badge (see §0.7 item 1).
- **SLOTS:** the block declares `{settlement}` `{band}` `{route}`; only `{settlement}` is filled at this block's call sites (`defenseStateProse.js:621`). `{band}` and `{route}` are dead here: a face may not reach for either.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE (the block's own, quoted in substance):** the `buildThreatAssessment` lattice is dossier-native and this shape EXTENDS it rather than replacing it; the corpus's job here is that each branch currently holds exactly ONE string, so every settlement in a branch says the same words. **Institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses and never HISTORICAL ones** unless the history surface supplies the ancestry. It does not here, and this is the fence that bites hardest in this pool: all three shipped variants are built on a temporal course.
- **Composition fences:** a SPINE, sentence form, no relation and no attach set, ONE spine mount on the defense tab and zero modifier mounts today. The spine is FIRST in its own composed unit and chooses nothing that follows it. The echo key is the whole table rung, so a mount counted against this pool may be a SIBLING ROW of `ECONOMIC_ROW_POOL` — one of STRONG, WEAK, CRITICAL — and never a second print of this one.
- **PDF PARITY:** parity (`viewModel.js` defense slice) — every face prints in the PDF as well as on the tab.

### 0.3 The register card's six one-line registers (the dossier line is this pool's)

- The dossier: the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- The NPC ladder: read aloud to the players; role-bound; never a named interior; the stage licenses the claim, never the shape.
- The Herald: the estate's one quoted in-world voice; report mode; flattest where hottest; the bill lands apart from the deed.
- The chronicle: a borrowed body of headlines; its own prose is frames and dressings; the quiet year is one sentence of varied shape.
- The DM page: candid; the why only from a typed field; second person to the referee alone; it grades, never hedges.
- Chrome and the docent: never the archivist; the product speaking to the person who runs it; mechanics first, one term per thing, the label as the only emphasis.

### 0.4 The owner's rules that bind every face, restated once

Four wording faces per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling. Never trim (Part B §22: the counts only rise; a face that fails the gate stays in the annex as a refusal row with its measurement). An unweighted seeded roll picks the face at render, so every face must stand alone. The exemplar, not the practical. No em dash, no exclamation mark, no digit or percent in a connective, no which-clause. The clerk who was there, compiling from records, citing a holder only where the card licenses a source and the budget allows — and here the card licenses none.

**THE THREAD (MOVE-GRAMMAR §1.4.1).** The tab stacks the five rows' prose as ONE italic block of paragraphs above the five bars (`DefenseTab.jsx:113-114`, `:316-320`), in the fixed order beasts · invasion · internal · economic · disaster. So this sentence is read as the **fourth paragraph of five** (the third, when the beasts row is silent — see §0.7 item 3), never the first, and it has both a paragraph before it and a paragraph after it, always. The one before is always an `Internal Security` row; the one after is always a `Disasters & Famine` row. Every face must pick up a noun the ORDER paragraph could have handed it and hand one forward that the FOOD paragraph can take — and must close on a standing fact rather than a set-up.

**THE DENSITY LAW (Part B §21.4).** Compression and idiom that reward the reader are part of the ceiling. "Unclear" is not a finding unless a law is broken. Do not trade density for plainness. The pool's shipped rows are not dense; they are abstract, which is a different thing and is the fault §4 names.

### 0.5 ⭐ THE READS THIS POOL REACHES — MATERIAL a writer may use, never a bound on what may be written

The predicate is a single table lookup on a single band word (`src/domain/display/stateProse/defenseStateProse.js:529-543`):

```
const ECONOMIC_ROW_POOL = Object.freeze({
  STRONG: 'Economic Survival: STRONG',
  ADEQUATE: 'Economic Survival: ADEQUATE',
  WEAK: 'Economic Survival: WEAK',
  CRITICAL: 'Economic Survival: CRITICAL',
});
export function economicRowPoolKey(economicScore) {
  if (typeof economicScore !== 'number' || !Number.isFinite(economicScore)) return null;
  return ECONOMIC_ROW_POOL[scoreBand(economicScore)] || null;
}
```

and the caller hands it `dp.scores?.economic` (`defenseStateProse.js:665`). The band function is the estate's one ladder (`src/domain/display/defenseScoreBands.js:38-39`):

```
export const scoreBand = (n) =>
  n >= 65 ? 'STRONG' : n >= 40 ? 'ADEQUATE' : n >= 20 ? 'WEAK' : 'CRITICAL';
```

**So the key is exactly this: `defenseProfile.scores.economic` lies in [40, 65).** One read, one interval, and the leaf's own docblock calls it "an EXACT 1:1" (`:517-527`). An absent or non-finite score is SILENCE, never CRITICAL (`:540`).

| read | what it holds on this key | what it puts in a writer's hand | what the record can deny about it |
|---|---|---|---|
| `defenseProfile.scores.economic` ∈ [40, 65) | the generated economic-resilience score, a 0–100 number banded to the word **ADEQUATE** | the band word itself, printed in the badge beside the sentence (`DefenseTab.jsx:326-327`). It is the ONE intensity word here that is not instrument-held: on this key the badge and the pool key are computed from the same number, which is the exact opposite of this block's other four pools (§0.7 item 1) | the band is a FIRST-SURVEY reading, frozen at generation and never rebuilt (§1.4 W-11 of the contradiction table; the tab's own eyebrow says *"as judged at the first survey"*, `DefenseTab.jsx:313`). It is not a claim about today's world state, and R-2 rules that a live band disagreeing with it is NOT a contradiction |

**What the score is made of, in the generator's own words (`src/generators/defenseGenerator.js:257-290`).** None of this is a second read the key performs; it is the CONSTITUTION of the one number, and it tells the writer what an ADEQUATE town is likely to be holding and what it cannot be assumed to hold:

- the primary driver is **food storage months** — `storageScore` runs 0 months → 0, 1 → 10, 3 → 25, 6 → 45, 12 → 70 (`:265-269`);
- then flat adders: **a market +10** ("financial capacity and merchant access"), **a hospital +10** ("medical resilience"), **a maritime port +10** ("sea supply cannot be cut by a land siege"), **a crossroads +8** ("multiple supply routes") (`:271-277`);
- then **econOutput × 0.2**, capped at 100 (`:277`); then **alchemy beside a granary +8** ("preservation, food extension") (`:279`);
- then the **economic-health gate**, `econHealthMult = min(1, 0.45 + econOutput/50 × 0.55)` (`:289-290`), whose own comment is the sharpest sentence in the file: *"a destitute town does not get 'Strong economic base' for owning a granary building"*;
- then **stress penalties**: `under_siege` −25, `famine` −20, `plague_onset` −15, each mitigable by a magical tradition (`:336-352`, `:354-386`, `:392-409`);
- then **chain modifiers**: a healthy food-processing chain +5, an impaired one −8 (`:604-606`).

**The consequence for the writer, and it is the whole of §0.9:** a score of 40 to 64 is reachable by a dozen different arrangements, and the pool fires on all of them.

**THE READS THIS KEY DOES NOT REACH, listed so the writer knows the page around the sentence.** `config.monsterThreat`, the seven defence buckets (walls, garrison, militia, watch, mercenary, charter, magicDef), `compound.inst.hasGranary` / `hasMarket` / `hasHospital` / `hasPort` / `hasChurch` / `hasCourtSystem` / `hasPrison`, `config.tradeRouteAccess`, `config.stressTypes`, the tier, the population, the culture profile, the food-security labels and every history field. **The score was BUILT from several of those, and the key reads none of them.** A face that names a granary, a market, a quay, a hospital, a wall or a garrison is naming a body the key never consulted, and the roster is the record — see §0.8.

### 0.6 The provenance move, priced for this pool

The card prints `SOURCE-UNRESOLVED` with the reason in full: *"no mapping row resolves any field this pool reads."* The ceiling would be ONE citation per unit and only for one of S3's three reasons (two accounts that disagree; a count from an interested party; a record whose keeper is a power). **None obtains, and no holder resolves at all.** The exemplar registers with raw text cite at zero per 786 sentences. **Recommendation: zero citations in this pool**, and a named keeper here is a live F1-24 finding.

The record VOCABULARY is free (W24 struck). A `[ledger]` face may reach for the entry, the return, the accounts, the reckoning, the year's figures, what the books will bear — that is vocabulary, not a citation.

### 0.7 ⭐ THE PAGE AROUND THE SENTENCE — four sibling surfaces, and two of them are hazards

**1. The badge beside this sentence is THIS key's own number, and that is unique on the block.** `DefenseTab.jsx:324-327` computes `scoreBand(threatScores['Economic Survival'])` where `threatScores['Economic Survival'] = scores.economic || 0` (`:183`) — the same field, the same ladder, the same interval. The contradiction table's W-10 warns that *four of DS-DEF-2's five pools are keyed on BOOLEANS and judged beside a continuous badge*, so that an intensity word in those pools is instrument-held. **This is the fifth pool, and the warning inverts.** Here the word ADEQUATE is printed in a coloured badge two inches from the sentence, and a face may lean on it as hard as it likes. What a face may NOT do is claim a DIFFERENT band's meaning (F1-40: outrunning the badge, or borrowing another arm's).

⚠ **One seam inside that agreement.** The BAR's colour beside the badge comes from a different ladder: `threatAssessment.js:170-174` uses `econScore >= 60 ? green : >= 35 ? amber : red`, while the badge uses `scoreColor`'s 65/40/20. So on a score of 60 to 64 the bar reads GREEN beside an ADEQUATE badge, and on 35 to 39 the bar reads AMBER beside a WEAK badge. That is a WIRING row for the chair (the two ladders disagree), not a wording row — but it means the visual impression beside this sentence is not always the amber the band word suggests.

**2. THE ENGINE'S OWN PROSE FOR THIS EXACT BAND PRINTS IN THE SAME ROW'S EXPANDER**, and a reader who clicks sees it directly under the corpus face (`DefenseTab.jsx:341`; `threatAssessment.js:176-178`):

> *Adequate economic resilience for a short-term crisis. A prolonged siege will begin straining reserves within months.*

Two things follow. First, the engine's own sentence is where the shipped vid 1 and vid 3 got "reserves" and "within months" — they are a paraphrase of the machine line, which is why they read as an inventory. **The rewrite's job is to say something this sentence does not.** Second, under §R-1 engine PROSE is not the record, so this line neither licenses nor denies anything; a face that agrees with it is not thereby safe, and a face that ignores it is not thereby wrong.

**3. A FUNDING NOTE PRINTS DIRECTLY BENEATH THIS ROW ON HALF THE RANGE, and it names the expense.** `READINESS_GATE_FOR['Economic Survival'] = ['economic', 'crisis logistics']` (`defenseDisplay.js:282`), and where `economicGates.economic < 1` the row renders *"Upkeep underfunded: crisis logistics at NN%"* (`:319-321`, rendered `DefenseTab.jsx:343`). The gate is `econHealthMult`, so the note prints on **every ADEQUATE town whose `econOutput` is below 50** and on no other. Consequences:
   - the page itself supplies the phrase **crisis logistics** for what this row's money is for, and the generator's own comment spells it out: *"disaster and famine RESPONSE costs money (relief purchases, granary logistics, work crews)"* (`defenseGenerator.js:609-611`). **No shipped face names one thing the money buys.** That is the flavour hole in this pool.
   - a face asserting the funding is SOUND is refutable on the half of the range carrying the note; a face asserting it is STARVED is refutable on the half that is not. The lawful shape speaks to the CAPACITY, never to the state of the purse behind it.

**4. THE PARAGRAPH DIRECTLY BELOW IS ABOUT FOOD STORES, AND ON MOST OF THIS POOL'S RANGE IT DENIES THEM.** The next paragraph is always a `Disasters & Famine` row keyed on `compound.inst.hasGranary` (`defenseStateProse.js:673-675`). Its two no-granary pools print, in the town's own voice:

> *{settlement} holds no food against a bad year and has nobody to treat the sick…*
> *{settlement} can treat and contain an outbreak and keeps no food against a bad harvest…*

and the machine line in the same row's expander reads *"No food reserves. A crop failure or supply disruption causes immediate hardship."* (`threatAssessment.js:186-187`). **Fifty-five of this pool's ninety-six towns are hamlets and villages** (§0.9), and `Town granary` is a town-tier row with **no row below town** (`institutionalCatalog.js:925-930`; F1-09). So on the modal town in this pool, the shipped vid 1's *"begins eating reserves"* is printed one paragraph above a sentence saying the town holds none. That is a floor-1 finding at the PAGE grain (R-12: the unit is the dossier, not the tab) and it is the sharpest single defect in the pool.

**5. The paragraph directly ABOVE is always an `Internal Security` row** — court, gaol, process, force, the purse reaching for exile or a fine. `internalRowPoolKey` is total (`defenseStateProse.js:506-511`), so it never goes silent. That is the noun the thread is handed: **enforcement, and what it costs to run.** The `court without detention` row one rung up already says *"so it reaches for the purse or the road"*. A face here that opens on money picks that up cleanly.

**6. The header above all five is DS-DEF-1's posture line, and this score is one fifth of its band.** `readiness = avgScore(scores) + tierBonus − threatPenalty` (`defenseGenerator.js:510`; `defenseScoreBands.js:62-68`), and DS-DEF-1 bands that (`defenseStateProse.js:770`). So the economic score moves the header sentence too. F4-06 bars explaining the readiness band by the works; the mirror caution here is that a face must not explain the HEADER either.

**7. A near-twin pool exists in the corpus and is DORMANT, deliberately.** DS-DEF-6's `Economic Backing: Adequate` is keyed on the same `scores.economic` at the same thresholds (`defenseDisplay.js:216-221`) and its three shipped rows are about upkeep, shortfalls and maintenance. It is on `DEF6_C3_BLOCKED_POOLS` (`defenseStateProse.js:1497-1504`) and `defenseSupportingProse` calls only `logistics` and `naval` (`:1647-1656`), so it does not print — the desk's own docblock says lighting it would be *"the page saying one thing twice"*. **So its material is available and its sentences are not on the page.** The writer should read those three rows once, to know what has already been said about this number, and then not write them again: upkeep, maintenance, late payment and worn equipment are DS-DEF-6's framing of the fact, and this row's framing is the THREAT — what happens when the town has to pay for a crisis.

### 0.8 ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows THIS key can walk into

| the claim that would be false | the field that denies it, and which of the two is the record | row |
|---|---|---|
| **STORED FOOD, a granary, a full store, grain against a bad year** — including the word **"reserves"** where it reads as a food store | `inst.hasGranary` false on the modal town in this pool; `Town granary` is required at town, `institutionalCatalog.js:925-930`, city `:1590-1596`, **no row below town**. And the Disasters & Famine paragraph printed immediately below says *"keeps no food against a bad harvest"* on exactly those towns (`RECEIPT_POOLS_DOSSIER_STATE.md:2715-2723`; `threatAssessment.js:186-187`). **The roster is the record.** ⚠ the score was BUILT from storage months, which is precisely why this trap is so easy to walk into: the input is not a licence | F1-09, R-12 |
| **A MARKET, a quay, a hospital, a warehouse, a toll bar** as a standing thing | `inst.hasMarket` / `hasPort` / `hasHospital` / `hasWarehouse`, `priorityHelpers.js:56`, `:61`, `:64`, `:60`. Each is +10 in the score and none is read by the key. A face may not seat any of them | F1-10, F1-14, F1-18, F1-19 |
| **A GARRISON, a watch, a militia, a wall, a gate** — or the DENIAL of any of them | `priorityHelpers.js:45-53`; the seven buckets at `defenseInstitutionBuckets.js:83-110`. This key reads no force and no fabric at all, in either direction. The negation is the same finding as the assertion | F1-01…F1-08, F1-25 |
| **"the guard"** as a body | `inst.hasMilitaryInst`; `safetyProfile.js:300`, `:309` print *"There is no meaningful guard presence."* on the towns where it fires | F1-04 |
| **A TREASURY, a strongbox, a fund, a reserve of coin as a HOLDING** | ⚠ read this one carefully. **No field denies a purse** — the engine models no treasury stock anywhere, and silence is permission, so money as a CAPACITY is free and is the whole subject of this row. What is denied is a purse as a **rostered thing**: a counting house, a mint, a customs house, a rent-roll asset (`institutionServices.js:530`; `economicState.js:55-60`, `:156-179` — the tier-default income lines name assets never checked) | F1-19, F1-21 |
| **ANY MAGNITUDE, in a digit or a word** — a sum, a share, a number of months of cover, a headcount of who would be paid, a price | the band vocabularies are CLOSED. `scoreBand` hands the writer ONE word, and **ADEQUATE is the entire magnitude this read carries** | F2-01 |
| **ANY DURATION, SEASON, MONTH OR DATE** — "within a few months", "a few months past", "every season", "for a year", "a bad winter" | `history.age` is frozen at birth and rerollable; every birth condition sits at `elapsedTicks: 0`. ⛔ **All three shipped variants breach this row**, and it is the pool's defining fault | F2-02 |
| **AN ELAPSED COURSE** — the perfect, the durative, the comparative-against-a-past, "has been", "still", "no longer", "has not been asked", "begins eating", "moves closer" | `ageBands.js`'s `HISTORICIZE_BAND = 'years-past'`: a birth-time STATE carries no origin stamp and can bear no temporal register whatever. ⛔ **All three shipped variants breach this row** | F2-05 |
| **A RATE** — "every season", "each year", "more often than not" | nothing bands a rate anywhere in the engine. ⛔ vid 2 breaches this row | F2-06 |
| **A TREND** — "is getting worse", "moves closer", "each season removes a little more" | a trend asserts a past STATE the engine does not hold. ⛔ vid 2 breaches this row | F2-08 |
| **AN EVENT THE RECORD DID NOT RUN, or its ABSENCE** — "the town has not been asked to find out", "nothing has failed yet", "it has never had to" | a generated town carries no such negative record. And see the next row: on part of this range the assertion is not merely unrecorded, it is false | F2-04, F2-09 |
| ⭐ **"THIS HAS NOT BEEN TESTED", in any wording** | `defenseGenerator.js:336-352` (`under_siege` −25), `:354-386` (`famine` −20), `:392-409` (`plague_onset` −15) apply to THIS score before it is banded, so a town at 65–89 before the penalty lands inside ADEQUATE **while the siege, the famine or the plague is standing**, and the stress banner prints on the same dossier. **The stress flag is the record.** ⛔ vid 3 breaches this row on every such town | F1 (page grain), R-12 |
| **A PREDICTION THE PULSE ADJUDICATES** — "will run out", "would not last", "the money fails before the wall does" stated as outcome | `calamityKernel`, `foodStockpile`, `warCosts` adjudicate every such claim. The lawful form is the CAPABILITY clause and the SUBJUNCTIVE edge (order wall 2: THRESHOLD/EDGE is always conditional or subjunctive), never the result | F2-05 |
| **A PURSE SPLIT, or a total collapse of pay** — "the wall kept and the relief not", "nothing is paid at all" | ONE multiplier over garrison wages and wall maintenance together, floor 0.6 (`defenseGenerator.js:182`, `:189-192`); all four gates are `min(1, floor + econOutput/50 × (1−floor))` on ONE input and **differ in degree only, never in direction** (`:189`, `:223`, `:251`, `:614`). The licensed extreme is short, late, thin — never none. ⭐ the POSITIVE of this row is this pool's best unused material: **one purse answers everything**, and the money that would pay for a crisis is the money already paying for something | F4-02, F4-03, F4-04 |
| **A TOTALITY OVER PERSONS** — "everyone knows", "nobody is spared", "hide that from anybody", "every household" | the card's REFUSED COLUMNS line, always. ⚠ vid 1's closing clause is in this shape | card |
| **AN EXEMPTION FROM A DUTY** — "the temple pays nothing", "only the traders are levied" | `whoIsExempt` is null everywhere | card |
| **A NAMED PROPER NOUN borne by the face** — a person, an inn, a family, a lane | a pooled face is authored once and drawn by every town whose key matches, so the name prints identically across a region. `{settlement}` is the only name this pool has | F1-126 |
| **CULTURAL FURNITURE the town's own culture profile denies** — thatch, hearth-smoke, the churchyard, the market green, snow on the road | `cultureProfiles.js:50-600` carries twelve profiles and **no defense pool reads the profile**. The product is SETTING-AGNOSTIC. ⚠ the contradiction table calls this *"the finding most likely to recur in every block"*, and a money face reaching for concrete civic scenery is exactly where it recurs | F3-05 |
| **AN UNNAMED PERSON'S ACT IN THE TIER'S SINGULAR OFFICE** — the mayor, the guard captain, the high priest | `TIER_MANDATORY_ROLES` emits exactly one Mayor, one Guard Captain per village-plus, one High Priest, each with a generated disposition on the NPC tab. ⭐ **but an unnamed person outside those offices may act freely** (W22a/W22b struck): a carter, a clerk, a collector, a quarter-master, whoever is asked to find the money | F3-06 |
| **`plagued` read as disease, `settled` read as "no live threat", or a safety totality** | the engine meanings. This key does not read the country at all, so none of those words belongs in a face here in any reading | F1-34, F4-05 |

**THE CLOSED ROSTERS THIS POOL TOUCHES (floor 1).** A body, building, record-keeper, force or faith-house these do not carry may not be asserted: the LIVE ruin-filtered institution roster (`institutionRoster.js`, `liveInstitutions`) and through it every flag of `priorityHelpers.js:45-77` — **`hasGranary`, `hasMarket`, `hasHospital`, `hasWarehouse`, `hasPort`, `hasMill`, `hasGuild`** are the six this pool is most likely to reach for, and the key reads none of them; the seven defence buckets (`defenseInstitutionBuckets.js:83-110`); the holder table (`holderTable.js`), which resolves NOTHING for this pool; the NPC office roster; the faction list. Everything else is silence, and silence is permission.

**Not a faith pool.** The deity's four axes, the derived temper (`deityTemper()`, never the inert stored `temperamentAxis`), the PANTHEON rank and the SETTLEMENT standing kept apart, and the `suppressed` flag beside the standing — none of these arises here, and no face may reach for any of them.

### 0.9 ⭐ THE PREIMAGE — the range of towns this key selects, MEASURED

The key is not a boolean; it is one interval on one number. The census measured it over the balanced 768-town sample (`wiring-census.json`, `rate.rows[184]` and its three siblings):

| band | towns of 768 | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|---|
| STRONG | 340 (44.27 %) | 0 | 0 | 0 | 81.25 % | 89.84 % | 94.53 % |
| **ADEQUATE** | **96 (12.50 %)** | **0** | **7.03 %** | **35.94 %** | **17.97 %** | **8.59 %** | **5.47 %** |
| WEAK | 259 (33.72 %) | 82.81 % | 74.22 % | 42.97 % | 0.78 % | 1.56 % | 0 |
| CRITICAL | 72 (9.38 %) | 17.19 % | 17.97 % | 21.09 % | 0 | 0 | 0 |

⭐ **THE ONE FACT THAT SHOULD DECIDE EVERY FACE IN THIS POOL: ADEQUATE IS A BRIDGE BAND, AND IT MEANS THE OPPOSITE THING AT THE TWO ENDS OF THE TIER LADDER.**

- At **hamlet and village it is the CEILING.** Not one settlement below town tier reaches STRONG in the whole sample — 0 of 384. A village in this pool is doing as well as a village can do, and the band above it is out of reach by construction.
- At **town, city and metropolis it is the FLOOR.** Four fifths to nineteen twentieths of those tiers are STRONG; a town in this pool is one of the minority that fell short of what its size normally manages, and the band below it is nearly empty (town WEAK 0.78 %, city 1.56 %, metropolis 0).
- **Forty-six of the ninety-six are villages** (47.9 %), 23 towns (24.0 %), 11 cities (11.5 %), 9 hamlets (9.4 %), 7 metropolises (7.3 %). **Thorp is a measured zero of 128**, verdict LAWFUL, limb `value-class` (`rate.tierSilences[152]`) — the band is simply out of a thorp's reach.

**So a face that says "as much as a place like this can manage" is false of the twenty-three towns and eighteen cities and metropolises; a face that says "less than this place should be able to do" is false of the fifty-five hamlets and villages.** The lawful and the interesting move is to write what is TRUE OF BOTH: the arrangement covers one call on it and has nothing standing behind it. That is the same fact at every tier, and it is the fact the band actually carries.

The rest of the range, all of it unread by the key:

- **Every country.** `config.monsterThreat` is not read here. This pool prints on a plagued frontier and a quiet heartland alike, and the paragraph above it changes accordingly.
- **Every stress state, including the three that CREATED the band.** No key function of this block reads `config.stressTypes`, and `under_siege`, `famine` and `plague_onset` each subtract from this very score before it is banded. So a substantial part of this pool is towns **pushed down into ADEQUATE by an active crisis whose banner prints on the same dossier**. A face written as though the town were at rest is wrong on exactly those towns, and they are the ones a game master is most likely to be reading. ⚠ This is the corner vid 3 walks into.
- **Granary or none; market or none; hospital or none; port, crossroads, road or isolated.** Every one of these is an input to the score and none is read by the key. A town can reach 40 to 64 with twelve months of stored grain and no market, or with no stored food at all and a market, a hospital and a quay. **The pool fires on both, and they look nothing alike.**
- **Funded or underfunded.** `economicGates.economic < 1` exactly when `econOutput < 50`, and the funding note prints beneath the row on that half only.
- **Both clocks.** The score is a generation-time snapshot never rebuilt (`generateDefenseProfile` has one caller, `steps/assembleSettlement.js`; contradiction table §1.4 W-11: *rows 3–5 snapshot*). The tab's eyebrow says *"as judged at the first survey"*. Under R-2 a live band that disagrees is NOT a contradiction, and a refuter may not fail a face for it.
- **Every route, terrain, culture profile, prosperity rung, population band, faith and faction arrangement.**

A face must contradict no state in that range, not merely the town on this skeleton.

---

## VARIANT 1 · vid 1 · `[ledger]` · slots `{settlement}` · canonical at index zero

### 1.1 The shipped sentence, verbatim

> `[ledger]` {settlement} can fund a short crisis. A long one begins eating reserves within a few months, and the reserves are not deep enough to hide that from anybody.

(`RECEIPT_POOLS_DOSSIER_STATE.md:2686`; `defense.generated.js:823-830`.) Two sentences, `{settlement}` once, opening on the slot — which the projector allows only because the first token is the slot itself in a sentence-form spine, and T-F8 refuses a sentence face OPENING on a `proper`-typed slot. ⚠ **The rewrite's four faces may not reproduce that opening.** This is also the CANONICAL line at index zero: it is what a falsy seed draws and what the annex's canonical form keeps live, so its grammar is the register's default for this pool.

### 1.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | the town can fund a short crisis | **SAFE.** This is the band word restated at the grain the band carries, and the ADEQUATE badge prints beside it |
| 2 | a crisis has a length, and long ones are distinguishable from short ones | **SAFE.** Nothing in the record denies it; no field bands crisis duration, so the distinction is a capability framing rather than a magnitude |
| 3 | **"within a few months"** — the cover runs out after a stated span | **FLOOR-2.** A duration is a magnitude the read does not hand you, in a word rather than a digit (F2-01), and any month, season or span is refused outright (F2-02). ⚠ note that the engine's own line in the same row's expander says *"within months"* (`threatAssessment.js:177`) — under §R-1 engine prose is not the record and cannot license this |
| 4 | **"begins eating"** — an inceptive durative over an elapsed course | **FLOOR-2.** The perfect, the durative and the comparative-against-a-past are all refused (F2-05); `ageBands.js`'s `HISTORICIZE_BAND = 'years-past'` pins it. The block's own fence says the same thing in its own words: the causal clauses here are CAPABILITY clauses and never historical ones. The cure is the subjunctive edge, not a shorter span |
| 5 | **"reserves"**, twice, as a definite holding the town has | **CONTRADICTED on the modal town in this pool** where the word reads as STORED FOOD: `inst.hasGranary` is false on the hamlets and villages that are fifty-five of the ninety-six (`priorityHelpers.js:63`; `Town granary` is a town-tier row with no row below town, `institutionalCatalog.js:925-930`), and the `Disasters & Famine` paragraph printed immediately below says *"keeps no food against a bad harvest"* / *"holds no food against a bad year"* (`RECEIPT_POOLS_DOSSIER_STATE.md:2715`, `:2720`). **The roster is the record.** Read as a PURSE the word is SAFE — no field models a treasury stock and silence is permission — but the face does not disambiguate and the paragraph below settles the reading against it |
| 6 | the shortfall is visible to observers | **SAFE.** No field models who knows what about the town's money |
| 7 | **"hide that from anybody"** — a totality over persons | **REFUSED COLUMN** on the card, always. Not a contradiction row; a wall. The rewrite does not carry this shape forward |

**Summary for vid 1: two FLOOR-2 breaches (the span, the durative), one CONTRADICTED noun on the majority of the range, one refused column, and a sound opening clause.** The first sentence survives whole; the second does not survive in any part.

### 1.3 The reads this pool reaches (material for the rewrite of vid 1)

One read, `defenseProfile.scores.economic` ∈ [40, 65), banded ADEQUATE and printed as a badge beside the sentence. Everything in §0.5's constitution table is material about what that number is made of and is not a second read: storage months, a market, a hospital, a maritime port, a crossroads, econOutput, alchemy beside a granary, three stress penalties, two chain modifiers. A `[ledger]` face may use any of it as UNDERSTANDING and may name none of it as a FACT about this town.

### 1.4 ⭐ WHAT WOULD BE FALSE HERE (vid 1)

Every row of §0.8, and these three bite this variant hardest:

1. **The word "reserves" and every synonym that lands on stored food** — the store, the granary, what is laid by, the full bins. F1-09, and the page-grain collision of §0.7 item 4.
2. **Any span at all.** Months, seasons, a winter, a year, "before long", "quickly". F2-01 and F2-02. ⚠ *"a short crisis"* and *"a long one"* are NOT spans — they are contrastive kinds, and they are lawful; *"within a few months"* is a span and is not.
3. **A totality over persons in the close.** The refused column, and it is the shape the shipped close uses.

### 1.5 The preimage, as it bites vid 1

The canonical line is the one a falsy seed draws, so it is the line most likely to be read in the product's own screenshots and in the PDF's first pass. It therefore carries the whole range: a hamlet at its ceiling and a metropolis at its floor, a granary town and a town with no stored food at all, a town at rest and a town under siege. **The "reserves" noun fails the second of each pair, and the canonical slot is the worst place in the pool for a noun that fails half the range.**

### 1.6 The angle's stance in one sentence

`[ledger]` is the office setting the fact down as the record holds it: what the arrangement is and what it can bear, landing on the civic thing the fact names, closing on a standing condition — and the record-word vocabulary is free to it (the entry, the return, the accounts, what the year's figures will carry), a named keeper is not.

### 1.7 The turns worth keeping

- **"can fund a short crisis"** — the exact grain of the band, in four words, with no magnitude in it. This is the pool's soundest clause and is worth carrying verbatim into at least one face.
- **the SHORT / LONG contrast as kinds** — lawful, and it is the discrimination the band actually makes. What must go is the attempt to say where the line falls.
- **the two-sentence shape** — a fact, then its qualification in its own sentence, is exactly R-DA-03's form. The shape is right; the second sentence's content is not.

### 1.8 What would make the rewrite of vid 1 a regression

Trading the density for plainness (Part B §21.4): "the town has enough money for a small emergency and not for a big one" is lawful, flat, and a regression against the shipped line's rhythm. Keeping the span in a softer wording ("before very long", "not for long") — the floor is on the CLAIM, not the digit. Replacing "reserves" with "stores", which is worse. Opening the sentence on `{settlement}` again.

### 1.9 ⭐ WHERE THE FLAVOUR IS (vid 1)

- **One purse answers everything, and it is already spoken for.** `defenseGenerator.js:182`, `:189-192`: one multiplier over garrison wages and wall maintenance together; all four gates on one input, differing in degree and never in direction (`:189`, `:223`, `:251`, `:614`). So the money that would pay for a crisis is not a fund set aside — it is the same money that is paying for the watch, the gaol and the upkeep, and a crisis is a competing claim on it. **No shipped face in any of the four Economic Survival pools says this**, and it is the engine's own model rather than an invention.
- **The money buys THINGS, and the page names them.** The funding note beneath this very row calls the expense *"crisis logistics"* (`defenseDisplay.js:282`) and the generator's comment spells out what that is: *"relief purchases, granary logistics, work crews"* (`defenseGenerator.js:609-611`). Carts hired, hands paid to move things, someone sent to buy at whatever the price has become. A `[ledger]` face can put ONE of those in the sentence and it will be the first concrete object this pool has ever carried.
- **What a stranger would notice: nothing.** ADEQUATE has no appearance. A WEAK town shows it in unpaid people and worn gear; a STRONG town shows it in maintained things; an ADEQUATE town looks exactly like a town. The absence here is the absence of a SECOND arrangement — there is one way of paying for trouble and no arrangement behind it. **That invisibility is itself the concrete fact**, and it is what makes this row a plot hook rather than a line item: the reader learns that the money holds and learns nothing about what happens on the second call, because the town does not know either.

---

## VARIANT 2 · vid 2 · `[unfolding]` · **NO SLOT** — this variant never names the town

### 2.1 The shipped sentence, verbatim

> `[unfolding]` The town's capacity to pay for its own emergencies is real and finite, and every season of pressure moves the finite part closer.

(`RECEIPT_POOLS_DOSSIER_STATE.md:2687`; `defense.generated.js:831-836`, `"slots": []`.) One sentence, two clauses, no slot. **All four faces of this variant must carry the empty slot set: "the town" is the form, and `{settlement}` may not appear in any of them.**

### 2.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | the town has a capacity to pay for its own emergencies | **SAFE.** The band, at the band's grain |
| 2 | that capacity is its OWN — the town pays for itself | **SAFE.** Nothing denies it; and note that the SCORE's own gate is exactly this fact, `econHealthMult` scaling the town's capacity by the town's own output (`defenseGenerator.js:289-290`) |
| 3 | the capacity is "real" | **SAFE**, and near-empty: "real" is doing the work of distinguishing this band from CRITICAL, which is a sibling-band contrast and lawful under R-DA-02, but it does no other work |
| 4 | the capacity is "finite" | **SAFE**, and a tautology: every capacity is finite. This is the padding the craft verdict names, not a finding |
| 5 | **"every season of pressure"** — a RATE over a recurring unit of time | **FLOOR-2 twice over.** Nothing bands a rate anywhere in the engine (F2-06), and a season is refused outright (F2-02). The chair's own ADDENDUM 14 example was withdrawn in its rate form for exactly this shape |
| 6 | **"moves the finite part closer"** — a TREND, a direction of travel over elapsed time | **FLOOR-2.** A trend asserts a past STATE the engine does not hold and will later compute differently (F2-08); the durative course is F2-05. And the pulse adjudicates the outcome it points at |
| 7 | the town IS under pressure, presupposed by "every season of pressure" | **FLOOR-2 / presupposition failure.** This key reads no stress field. A large part of the range carries no active condition at all, and on those towns the clause presupposes a state the dossier's own banner does not show. It is not a denial, which is why the tag is FLOOR-2 and not CONTRADICTED — but it is the clause failing in a second way |

**Summary for vid 2: three FLOOR-2 breaches concentrated in one clause, one tautology, and a sound first clause.** The second clause is the most clearly unlawful sentence-half in the pool; the first clause is lawful and hollow.

### 2.3 The reads this pool reaches (material for the rewrite of vid 2)

As §0.5. The `[unfolding]` angle has no extra read and no extra licence: it is a stance, and this block's own fence is that its clauses are CAPABILITY clauses, never historical ones.

### 2.4 ⭐ WHAT WOULD BE FALSE HERE (vid 2)

Every row of §0.8, and these four bite this variant hardest:

1. **Any rate** — "every season", "each year", "most years", "more often than not". F2-06.
2. **Any trend** — "closer", "further", "thinner than", "a little more each time", "is going one way". F2-08. ⚠ **the `[unfolding]` angle is the one that invites this, and it is the angle's standing hazard in every block.** An unfolding stance is not a licence for a course; it is a licence to write the state as something that is happening NOW and standing, not as something that has been happening.
3. **Any presupposition of an active crisis.** The key reads no stress field, and half the range is at rest.
4. **`{settlement}` in any face.** The slot set is empty and the projector refuses a face whose slot set differs from its parent's.

### 2.5 The preimage, as it bites vid 2

The no-slot constraint is a gift here rather than a cost: a variant that cannot name the town is pushed toward the general civic noun, and the general civic noun is what stays true across a range that runs from a hamlet at its ceiling to a metropolis at its floor. What the preimage takes away is the trend: a village whose ADEQUATE is the best it will ever do and a city whose ADEQUATE is a fall from STRONG are moving in OPPOSITE directions, if they are moving at all, and one sentence cannot carry a direction for both. **The lawful and interesting reading of "unfolding" here is not a slope; it is a state that is being spent — the capacity exists and is in continuous use, which is true at both ends of the ladder.**

### 2.6 The angle's stance in one sentence

`[unfolding]` is the state read as something under way rather than settled: what the arrangement is DOING, in the present, as a standing condition — never a course that has elapsed, never a slope, never a forecast the pulse will adjudicate.

### 2.7 The turns worth keeping

- **"to pay for its own emergencies"** — the possessive is doing real work (the money is the town's, and the crisis is the town's) and it is the clause that distinguishes this row from DS-DEF-6's dormant upkeep framing. Worth carrying.
- **"real and finite"** as a SHAPE — a two-term qualification of a capacity — is a lawful move; both terms need replacing with terms that say something.
- **The one-sentence, two-clause form.** Vid 1 is two sentences and vid 3 is a semicolon; this variant's job in the pool's spread is to be the single-sentence one, and it should stay that.

### 2.8 What would make the rewrite of vid 2 a regression

Keeping the trend in a quieter wording ("is being spent down", "is not being replaced") — the floor is on the CLAIM. Replacing the tautology with a second tautology. Reaching for `{settlement}` and being refused by the projector. Making the line plainer in place of making it say more (Part B §21.4).

### 2.9 ⭐ WHERE THE FLAVOUR IS (vid 2)

- **The money is not idle, and that is the whole of "unfolding" here.** The engine's model is one purse under a single multiplier (F4-02, F4-03): the capacity to pay for a crisis is not a fund waiting, it is slack in the money that is already paying for the watch, the gaol and the upkeep. So the state that is UNDER WAY is a continuous competition for the same coin, and the town is winning it at present. **Nobody has written that, and it is the model rather than an invention.**
- **What someone would complain about.** On the underfunded half of the range the page itself prints *"Upkeep underfunded: crisis logistics at NN%"* beneath this row, and the generator names the expense as relief purchases, hired carts and work crews (`defenseGenerator.js:609-611`). The complaint that writes itself is that the thing gets paid for and gets paid for LAST — the people who move things for the town are paid after the people who guard it, because one purse cannot do both at once. The ORDER is available; the amount and the lateness in months are not.
- **The absence, on the ground.** There is no second source. A STRONG town has something behind the money; this one has the money and nothing behind it. That absence has no appearance at all — which is why an `[unfolding]` face here should land on what the town is NOT doing that a richer town would be doing, stated flat, never as a lack completed by a "but" (R-DA-02).

---

## VARIANT 3 · vid 3 · `[threshold]` · slots `{settlement}`

### 3.1 The shipped sentence, verbatim

> `[threshold]` {settlement} can pay for a crisis of the ordinary length; the edge of what it can fund lies a few months past the beginning of one, and the town has not been asked to find out where.

(`RECEIPT_POOLS_DOSSIER_STATE.md:2688`; `defense.generated.js:837-844`.) One sentence, a semicolon joint, three clauses, `{settlement}` once and opening on it. Two of the three clauses fail, and the third fails differently from the first two.

### 3.2 Every claim it makes, on the new test

| # | the claim | verdict |
|---|---|---|
| 1 | the town can pay for a crisis of the ordinary length | **SAFE.** "The ordinary length" names no magnitude and bands nothing; it is a hedge on a kind, not a span. The band carries it |
| 2 | there IS an edge to what the town can fund | **SAFE**, and it is the `[threshold]` angle's own proper subject — an edge stated as an edge, in the conditional, is exactly order wall 2's licensed form |
| 3 | **"lies a few months past the beginning of one"** — the edge located at a stated span | **FLOOR-2.** A magnitude the read does not hand you, in a word (F2-01), and a duration outright (F2-02). ⚠ **the `[threshold]` angle may NAME the edge and may not LOCATE it** — that distinction is the whole rewrite of this variant |
| 4 | **"the town has not been asked to find out"** — no crisis of that length has occurred | **FLOOR-2** on its own: an event the record did not run, asserted as a negative (F2-04), on a key that reads no history field at all (F2-09), in the perfect (F2-05) |
| 5 | the same clause, **on the towns this band was PUSHED INTO by a crisis** | ⛔ **CONTRADICTED.** `defenseGenerator.js:336-352` applies `under_siege` −25 to this score, `:354-386` applies `famine` −20, `:392-409` applies `plague_onset` −15, each before the banding. A town scoring 65 to 89 before the penalty lands inside ADEQUATE **while the siege, the famine or the plague is standing**, and the stress banner for that condition prints on the same dossier. **The stress flag is the record**; the face says the town has not been asked, and the page one tab over says it is being asked now. This is a floor-1 finding at the page grain (R-12: the unit is the dossier) |
| 6 | nobody knows where the edge is | **SAFE.** Nothing models what the town knows about its own limit, and "the town does not know" is the positive move the contradiction table recommends in several places |

**Summary for vid 3: one FLOOR-2 span, one clause that is FLOOR-2 everywhere and CONTRADICTED on the crisis-pushed part of the range, and two sound claims including the one the angle exists for.**

### 3.3 The reads this pool reaches (material for the rewrite of vid 3)

As §0.5, with one addition specific to this variant: the three stress penalties are part of the score's constitution (`:336-352`, `:354-386`, `:392-409`) and they are the reason a `[threshold]` face must not assume the town is at rest. The key does not read `config.stressTypes` — but the SCORE was shaped by it, and the banner prints.

### 3.4 ⭐ WHAT WOULD BE FALSE HERE (vid 3)

Every row of §0.8, and these four bite this variant hardest:

1. **Locating the edge.** Months, seasons, "a second call", "the third bad year" — any of them is F2-01/F2-02. The edge may be named, characterised and left standing open; it may not be measured.
2. **"has not been tested", in any wording.** The strongest finding in the packet: FLOOR-2 everywhere, and a live contradiction on the besieged, famine-struck and plague-onset part of the range.
3. **A prediction the pulse adjudicates** — "would not survive", "will break", "fails on the second". The subjunctive edge is licensed; the OUTCOME is not (F2-05). ⚠ the distinction is fine and it is the one this angle lives on: *"the edge is there"* is lawful, *"the edge would be reached"* is lawful as a conditional, *"the town would fall"* is an outcome the simulation owns.
4. **The semicolon.** R-DA-06 caps the semicolon at ≤ 0.130 per variant against a shipped 0.360, and the pool of three has exactly one. Keeping it in all four faces of this variant would reproduce the shipped rate; one face may carry it.

### 3.5 The preimage, as it bites vid 3

This variant is where the range is sharpest. The pool contains:
- **towns at rest** whose ADEQUATE is simply what their arrangements produce — the hamlet and village majority, where it is also the ceiling;
- **towns pushed down into the band by an active crisis** — a siege, a famine, a plague onset, each subtracting from this exact score, each printing its own banner on the same dossier. These are the towns a game master is most likely to be reading, and they are the ones on which a "not yet tested" face is false rather than merely unrecorded.

**A `[threshold]` face must be true of a town that has never had a bad year AND of a town that is inside one right now.** The construction that survives both is an edge stated as a property of the arrangement rather than as a point in the town's experience.

### 3.6 The angle's stance in one sentence

`[threshold]` is the edge: where the arrangement stops working, stated as a standing property of the arrangement and always in the conditional or subjunctive (order wall 2), naming the edge and leaving it open — never dating it, measuring it, or saying whether the town has reached it.

### 3.7 The turns worth keeping

- **"the edge of what it can fund"** — the exact subject of the angle, in six words, carrying no magnitude. The pool's best phrase; worth carrying verbatim into a face.
- **"a crisis of the ordinary length"** — a kind rather than a span, and lawful. It also does real work: it says the town is built for the usual and not for the unusual, which is the band.
- **"nobody has been asked where"** as a SHAPE — the not-knowing as the fact — is the contradiction table's own recommended positive move (F4-13's note, F1-70's). What fails is the claim that the asking has not HAPPENED; what survives is that the answer is not held.

### 3.8 What would make the rewrite of vid 3 a regression

Turning the edge into an outcome to keep the drama. Keeping "has not been asked" in a form that reads as history ("the question has not come up", "it has not come to that"). Softening the span instead of removing it. Losing the edge entirely and writing a second `[ledger]` line — the pool would then have three variants saying the same thing in three registers, which is the DULL verdict at the pool grain.

### 3.9 ⭐ WHERE THE FLAVOUR IS (vid 3)

- **The edge is a property of the arrangement, and the arrangement is knowable.** One purse, four calls on it, no second source (F4-02, F4-03). The edge is not a date; it is the point at which two of those calls arrive together. **A threshold face can say that without a number**, and no shipped face in any of this block's twenty-six pools has.
- **What the town would do at the edge, and what it would avoid.** The engine's own words for the expense are relief purchases, granary logistics, work crews (`defenseGenerator.js:609-611`). The concrete, licensed shape of an edge is which of those stops first — the hired hands before the purchases, the purchases before the pay — and the record is silent on the order, which makes it the writer's. What is barred is naming a body that does it (the granary, the market, the carters' guild) if the roster does not hold it: **the ACT is free, the INSTITUTION is not.** An unnamed person outside the tier's singular offices may do it (W22a/W22b struck, F3-06's rider): someone sent to buy, someone who says the money is not there, a clerk who is asked twice.
- **The absence, on the ground: there is nobody whose job it is to know.** A STRONG town has an arrangement that answers the question; this one has a capacity and no procedure. That is the hook the row is for — the referee learns that the money holds for the ordinary case and that nobody in the town can tell a player what happens after that, and the not-knowing is a licensed fact rather than a hedge (the contradiction table's own recommended move, repeated at F1-70, F1-54 and F4-13).

---

## 4. THE PACKET'S OWN VERDICT, for the writer's first pass

**The pool's defining fault is TIME.** All three shipped variants are built on a temporal course — *within a few months*, *every season of pressure moves the finite part closer*, *a few months past the beginning of one*, *has not been asked* — and the block's own fence says in its own words that the clauses here are CAPABILITY clauses and never historical ones. Every one of those is a floor-2 breach, and one of them is also a live floor-1 contradiction on the part of the range that this band was pushed into by an active crisis. **The rewrite's first act is to convert every temporal claim into a standing condition**, which is the contradiction table's own recipe: *"A date closes a question; a standing condition opens one."*

**The pool's second fault is the ABSTRACT NOUN.** Capacity, reserves, resilience, the finite part, the edge of what it can fund. Not one concrete object appears in any of the three rows, and the pool is the only one of the four Economic Survival bands with no `[street]` and no `[visitor]` angle — three interior, analytic stances and nobody on the ground. The page beside it hands the writer the vocabulary it refused to use: **crisis logistics** (`defenseDisplay.js:282`), and behind it **relief purchases, granary logistics, work crews** (`defenseGenerator.js:609-611`). One purse, four claims on it, and the money for a crisis is the slack in what is already being spent.

**The pool's third fault is DULL at the pool grain** — one grammar across three variants by the census's own count, and three sentences that make the same move in three vocabularies: *can pay for the small one, not the large one*. The spread the rewrite owes is three distinct level-1 grammars and three genuinely different claims inside one band.

**What is sound and must survive.** *"can fund a short crisis"* (vid 1), *"to pay for its own emergencies"* (vid 2), *"the edge of what it can fund"* and *"a crisis of the ordinary length"* (vid 3). Four phrases, no magnitudes, and each one is the grain of the band.

**The one fact that should shape every face.** ADEQUATE is a bridge: the ceiling for a hamlet or a village (0 of 384 below town tier reach STRONG) and the floor for a town, a city or a metropolis (81 to 95 per cent of those tiers are STRONG). The same three sentences print over a village doing as well as a village can and a metropolis that fell short. **Write what is true of both** — the arrangement covers one call and has nothing standing behind it — and the pool stops being an inventory.
