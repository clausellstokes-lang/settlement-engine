# SEAT-SAID — the first measure (PROSE-3's measuring builder, brief MEASURE-SEAT-TOWN, unit 1)

ROOT=/home/user/settlement-engine/.claude/worktrees/agent-ac99ce80789bf85d3
HEAD=9f3558f67035381fdbfa92ed1a747d3218ecd9c3 (branch `lane/prose-3-2026-11-20-measure-seat`, cut at the tip of `lane/prose-3-2026-11-20`, which has the brief's commit 56ce26391 as its parent)

MEASURE ONLY. Nothing under `src/`, `tests/`, `scripts/`, `supabase/`, `package*.json` was touched. Every claim is marked
**EXECUTED** (run, output quoted or counted from the run's files) or **INFERRED** (read in the code).

## The births and the instrument

- **900 births, `hxd-<size>-<0..149>`, six sizes** (EXECUTED). MAP-1's birth, imported unchanged
  (`../map-birth.shared.mjs :: birthAndCompose`: `DEFAULT_CONFIG` at the size, `birthConfig`,
  `generateSettlementPipeline(..., { seed, customContent: {} })`, then `composePublicProse(town)`). The one instrument wraps
  `composePublicProse` to keep the record it was handed (`seat-town.census.mjs`). Run as
  `sh scripts/gate-mutex.sh --run -- timeout 1500 sh run-seat-town.sh <ROOT> <out> 3 hxd 150`: exit 0; the three workers'
  logs: `Tests  300 passed (300)` ×3, `exit 0` ×3; `HEAD.txt` in the out dir reads the ROOT and HEAD above. 900 distinct seeds.
- **What is read.** The label: `rulingPowerCoup.js :: coupRiskLabel(coupContenders(record))` on the OWNER's record, as
  `powerDeskRead.js :: powerDeskReadings` reads it. The header and the banner: the stored strings
  `publicProse.blocks['power:desk'].stabilityHeader` / `.legitimacyBanner` (the shared page's surface). The account:
  `publicProse.blocks['power:governance'].text`, searched by CONTAINMENT. The account recomputed through
  `governanceAccountOf(publicVeiledRecordOf(record), ...)` equals the stored text on 900 of 900 (EXECUTED).
- **"Calm"** (REHEARSAL-2's own reading could not be read: `docs/chair/2026-11-20/seventh/rehearsal/REHEARSAL-2.md` is not
  on `origin/lane/chair-2026-11-08` at 04dbc2ead, EXECUTED: `fatal: path ... does not exist`). Used instead: the chair's
  own joint measure, `docs/chair/2026-11-20/seventh/measures/joint-reading/joint-measure.mjs` on that branch:
  `calm: !t.stress` (its header: "calm = !t.stress (FORTUNE's measure.mjs)"). 619 of 900 are calm (EXECUTED).
- **A VISITOR'S BIRTHS: not run.** One line why: REHEARSAL-2.md is not on the chair's branch, and the visitor instrument it
  names (`docs/chair/2026-11-20/content/seat/u4/measure-lit.mjs`) and `src/domain/seat/` are not on this tree; the
  rehearsal also ran on a FLIPPED joined tree (seat law v2, `SEAT_CONTEST_LIT = true`, BRIEF-R2 Part 2), which this tree
  cannot make without a source change. So the map's births only, on the UNFLIPPED tree (INFERRED from BRIEF-R2 and `ls`).
- **So the figures are not the chair's 23/19** and should not be read against them: another tree, other seeds.

## A fact the brief states differently from the code

`coupRiskLabel` (rulingPowerCoup.js :274-282, INFERRED): `Contested` is `incumbent.amplifiedWeight < challengers[0].weight`
(the rival STRICTLY above; equal weight reads `Holding`), and `Critical. The seat could fall` is an UNGATED incumbent,
which `coupContenders` (:111-112) only allows with a FULL field of three: `gated = challengers.length < 3 ||
amplifiedWeight >= challengers[challengers.length - 1].weight`. The holder's weight is `power × govMultiplier` (the
legitimacy band's 1.30 → 0.60), each rival's `power × COUP_COERCION[archetype]`; criminal powers and powers under 5 never
contend (:104).

## TABLE 1 — by size (the map's births; no visitor column, see above) — EXECUTED

| size | places | Contested | Critical | of C+Cr, a Stable header printed | of those, a wording that STATES AN EXPECTATION | calm contested (C / Cr) | calm contested whose account names the challenger (raw name / its prose form) | calm contested where the at-odds line fires |
|---|---|---|---|---|---|---|---|---|
| thorp | 150 | 13 | 0 | 0 | 0 | 0 | — | — |
| hamlet | 150 | 22 | 0 | 0 | 0 | 6 (6 / 0) | 1 / 6 | 5 |
| village | 150 | 115 | 0 | 52 | 52 | 69 (69 / 0) | 52 / 57 | 59 |
| town | 150 | 36 | 11 | 2 | 2 | 9 (9 / 0) | 0 / 4 | 4 |
| city | 150 | 12 | 7 | 0 | 0 | 0 | — | — |
| metropolis | 150 | 13 | 9 | 0 | 0 | 0 | — | — |
| **all** | **900** | **211** | **27** | **54** | **54** | **84 (84 / 0)** | **53 / 67** | **68** |

Read with it (EXECUTED):
- **The Stable header beside a contest is all calm and nearly all village**: 54 places, every one calm; the header vids
  v1 ×16, v3 ×19, v4 ×19 (all three state an expectation; Table 2); the legitimacy banner beside them reads `Contested`
  on 52, `Approved` 1, `Tolerated` 1. The 30 calm contested places with no Stable header read another DS-POW-2 pool
  (the first word of `powerStructure.stability` is not `stable`).
- **The village is the seat of it**: 115 of 150 villages read Contested; 113 of those 115 carry the band
  `Contested ×0.8` (68) or `Legitimacy Crisis ×0.6` (45) — the holder's own legitimacy multiplier puts it under the rival.
- **"Names the challenger"**: the raw name (case-insensitive containment) undercounts: every one of the 14 places named
  only in prose form is `Military/Guard`, which the account prints as "the Guard" (`powerNameInProse`), and in each it is
  named in the at-odds line ("The hall is at odds with the Guard.") — read off the stored text. So **17 of the 84 calm
  contested places print no sentence naming the first challenger** (village 12, town 5; hamlet 0).
- **Critical is never calm** here: 27 Critical, 0 calm; 25 of the 27 name the challenger.
- The "…Nothing large is settled in the hall without bargaining with them first." family (three arrangements and the
  occupied twins) prints on 66 of the 84 (it follows the GRAVEST tie, so it is absent where a competitive tie outranks).

### The 17 calm contested places whose account names no challenger (EXECUTED; full 84 in `calm-contested.json`)

| seed | place | holder | first challenger (weight) | holder's weight | legitimacy | Stable header | the record's tie, ruler ↔ challenger |
|---|---|---|---|---|---|---|---|
| hxd-village-0 | Dobroki | Headman's Authority | Religious Authorities 48 | 41.6 | Contested | v3 | dependent |
| hxd-village-19 | Tarkhankul | Elder Council | Merchant Guilds 51.3 | 36.8 | Contested | v3 | dependent |
| hxd-village-22 | Nokhoikul | Elder Council | Merchant Guilds 34.2 | 24 | Contested | v4 | dependent (at-odds fires for the Religious Authorities) |
| hxd-village-36 | Fjordbrekka | Headman's Authority | Religious Authorities 48 | 41.6 | Contested | v4 | dependent |
| hxd-village-40 | Hagiochorio | Headman's Authority | Religious Authorities 36 | 31.2 | Contested | v4 | dependent |
| hxd-village-51 | Inverburn | Headman's Authority | Religious Authorities 42 | 36.8 | Contested | v3 | dependent |
| hxd-village-67 | Jayakot | Headman's Authority | Religious Authorities 48 | 41.6 | Contested | v3 | dependent |
| hxd-village-88 | Ripavetum | Elder Council | Merchant Guilds 34.2 | 24 | Contested | v3 | dependent (at-odds fires for the Religious Authorities) |
| hxd-village-108 | Haicheng | Headman's Authority | Religious Authorities 48 | 41.6 | Contested | v1 | dependent |
| hxd-village-112 | Quirigahau | Headman's Authority | Merchant Guilds 47.5 | 40 | Contested | (floor pool) | dependent |
| hxd-village-140 | Frostvik | Elder Council | Merchant Guilds 34.2 | 24 | Contested | v4 | dependent (at-odds fires for the Religious Authorities) |
| hxd-village-141 | Buyantash | Elder Council | Merchant Guilds 51.3 | 36.8 | Contested | v4 | dependent |
| hxd-town-28 | Sanctafossae | Feudal Appointee | Landed Gentry 47.3 | 20 | Contested | (floor pool) | none |
| hxd-town-32 | Beloko | Feudal Appointee | Landed Gentry 29.7 | 28 | Tolerated | v1 | none |
| hxd-town-86 | Vishnubari | Feudal Appointee | Landed Gentry 49.5 | 17.6 | Contested | (floor pool) | none |
| hxd-town-97 | Mikroambelos | Feudal Appointee | Landed Gentry 26.4 | 25.3 | Approved | v1 | none |
| hxd-town-108 | Vikby | Town Mayor | Religious Authorities 32 | 28 | Contested | (floor pool) | dependent |

## TABLE 2 — the power header's Stable pool (`power.generated.js` › `DS-POW-2` › `stable matched`) — INFERRED (read), prints EXECUTED

Found through `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2216` ("Everyone at {settlement} knows who decides, …"). The
header state is `powerStateProse.js :: stabilityPoolKey(powerStructure.stability)` (the label's FIRST word; `stable`
→ `stable matched`), drawn as `stabilityHeader` (:1164) with `{settlement}` and `{faction}` filled, `{seat}` deliberately
unfilled (:998-1015). The receipt's own fence for the block (RECEIPT_POOLS :2202-2205): "A variant asserts ONLY the
condition its own token names. A `stable` match may not assert *no rivals*".

| vid | text | marks | STATES AN EXPECTATION | printed on the 900 (of 491 stable headers) |
|---|---|---|---|---|
| 1 | The hall at {settlement} is settled. {faction} holds it, the town expects {faction} to go on holding it, and business is conducted on that expectation. | — | **Y** ("the town expects … to go on holding it") | yes (16 beside a contest) |
| 2 | Nothing at {settlement} is presently pulling against the {seat}; petitions go to one place and are answered from one place, which is the whole of what a settled hall means. | — | N, but asserts NO RIVAL ("nothing … pulling against") | **0** (names `{seat}`, unfilled here, so never eligible) |
| 3 | Anyone doing business at {settlement} needs one name, {faction}'s, and can plan a season ahead on its word. | no crisis: occupied | **Y** ("can plan a season ahead on its word") | yes (19 beside a contest) |
| 4 | Everyone at {settlement} knows who decides, and nobody expects that to change this season. | no crisis: occupied | **Y** ("nobody expects that to change") | yes (19 beside a contest) |
| 5 | Everyone at {settlement} knows that {faction} holds the hall, and that under the occupation it carries out what the occupiers decide. | crisis: occupied | N | 0 |

## THE TRIGGER of "…at odds with it."

`src/domain/display/governanceAccount.js :: governanceAccountOf` (INFERRED, quoted):

```js
const estranged = estrangedPowersOf(s, governing);          // :365
const tense = named('tense');                                // :381 — estranged entries whose tie is 'tense'
if (tense) sentences.push([
  `${tense.names} ${tense.plural ? 'are' : 'is'} at odds with it.`,
  `The hall is at odds with ${lowerFirst(tense.names)}.`,
][pick('tense', 2)]);                                         // :394-397
```

and `estrangedPowersOf` (:197-228): a row of `powerStructure.factionRelationships` whose `pair` holds the governing power
(`rulingChainOf(record).power.name`) and whose `type` is `'tense'` — except `type === 'tense' && captureState ===
'equilibrium'` (:218) — one entry per power, its gravest tie kept (`capture` > `corrupted` > `competitive` > `tense`). The
consequence "Nothing large is settled in the hall without bargaining with them first." fires when the GRAVEST tie is
`tense` (:398, :414-428). On the player view the account reads the record after the public strip
(`powerDeskRead.js :: governanceAccountRead`, `publicVeiledRecordOf`).

**Where it does not fire, among the 84 calm contested (16 places) — the failing condition, by the first challenger's
tie with the ruler (EXECUTED):**

| reason | count | sizes |
|---|---|---|
| R2 — the row's type is `dependent` (not an estrangement type) | 10 | village 9, town 1 |
| R1 — no relationship row between the ruler and the first challenger at all | 4 | town 4 (all `Feudal Appointee` vs `Landed Gentry`) |
| R4 — the row is `competitive` (the account prints "… no longer takes its orders", naming it) | 2 | village 1, hamlet 1 |
| R3 tense-at-equilibrium / R5 stripped by the veil | 0 | — |

In none of the 16 does another power hold a `tense` tie on the owner's record (EXECUTED: 0). Over the 84, the first
challenger's tie: tense 64, dependent 13, none 4, competitive 3 (EXECUTED); over all 238 Contested/Critical places: tense
143, competitive 55, none 23, dependent 15, symbiotic 2.

**Is it the contest's own reading? No.** The trigger reads the relationship TYPE the generator wrote at birth
(`src/generators/factionDynamics.js`, INFERRED), which bands the RAW power ratio of each pair: religious ↔ governing
`tense` at ratio ≥ 1.1, `dependent` at ≥ 0.5 (:529-552); merchant `competitive` ≥ 1.2, `dependent` ≥ 0.6 (:504-516);
military `tense` 0.85-1.2, `competitive` above (:457-487); noble `tense` ≥ 0.9 — and NO row at all where the governing
power's name holds "feudal" (`if (noble && gov && !gov.faction?.toLowerCase().includes('feudal'))`, :631), which is R1's
whole cause. The contest (`coupContenders`) instead compares `power × COUP_COERCION[archetype]` against the holder's
`power × govMultiplier`. The two differ by exactly the legitimacy multiplier and the coercion factor: Dobroki's Religious
Authorities 48 against the Headman's 52 is a raw ratio 0.92 (`dependent`: "Each props up the other") and a contest of 48
against 52 × 0.8 = 41.6 (`Contested`).

## PROPOSE (no code) — for the chair's eye

### (a) THE ACCOUNT NAMES THE CHALLENGER — recommend a small pool, not the widened trigger

**Widening** (the condition by symbol: in `governanceAccountOf`, push the at-odds sentence for
`coupContenders(s).challengers[0]` where `coupRiskLabel(coupContenders(s))` is `Contested` or `Critical. The seat could
fall` and the account names it nowhere else) would cover 17 of 17 calm contested places now unnamed (by construction),
and newly fire on 12 crisis-born places as well (29 of the 238 Contested/Critical places print no sentence naming the
first challenger; 209 already do; EXECUTED). **It is wrong**: in 13 of the 17 calm ones the record's own tie is
`dependent`, whose narrative the record carries ("Each props up the other", "Neither can afford to ruin the other",
factionDynamics.js :516, :552), so "X is at odds with it" would contradict the record's own tie; in the other 4 there is
no tie at all. "At odds" is a claim about a relationship; the contest is a claim about weight.

**The pool** (at most 6; each names the first challenger and says only "a named power whose weight matches the holder's";
no plot, feeling, season or count; never "the town"/"a town"):

1. `{Challenger} counts for as much in {place} as {ruler} does.`
2. `In {place}, {challenger} counts for as much as {ruler}.`
3. `{Ruler} holds the seat, but {challenger} weighs as much in {place} as it does.`
4. `{Challenger} stands as strong in {place} as {ruler}, or stronger.`

The facts each NEEDS, in the vocabulary's atoms: `seat contested` (the atom of (b); its one reader). The slots:
`{challenger}`/`{Challenger}` = `coupContenders(record).challengers[0].name` in its prose form
(`governanceAccount.js :: powerNameInProse`), its verb's number from `pluralPowerName(powerSentenceName(name))` (the
account's own idiom, :376) — "counts"/"count", "stands"/"stand"; `{ruler}`/`{Ruler}` and `{place}` as the account already
fills them (:306, :326). Each also `no crisis: occupied` (the occupied seat has its own twins, :36-42). A composer rule
(not an atom): print it only where the account names the first challenger nowhere else, so 209 places do not say it
twice. Seated beside `OCCUPIED_SEAT` in `governanceAccount.js`, resolved through `drawDeclared.js :: resolveDeclared`
over `factsOf(record)` of the SAME record the account reads (the veiled one on the player view). **Reason for the pool**:
it says the one thing the record holds (weight), so it cannot contradict the tie line on the same tab.

**Hideable / crime first challengers on the 900 (EXECUTED):** with a challenger 649 places; first challenger a house of a
hideable kind (`cardVeil.js :: isHideableHouse` on its power row, or on an institution row of the same name) **0**;
criminal **0** (`coupContenders` drops `A.CRIMINAL` by construction, :104); a veiled power (`isVeiledPower`: `hidden: true`)
**1** — `hxd-hamlet-40`, the `infiltrated` stress's "The Independent Bloc", label `Holding`, crisis-born. Over the 238
Contested/Critical places: 0 of each. **Exclude, not `dm-only`**: a pool read over the veiled record never sees a hidden
power (the strip removes its row, `publicSafe.js :: publicVeiledRecordOf`), and the DM's own view may name it. That leaves
all 238 Contested/Critical places (all 84 calm) able to print it.

### (b) THE STABLE HEADER NEVER CONTRADICTS THE CONTEST — one declared atom

- **The atom**: `seat contested` (true where `coupRiskLabel(coupContenders(record))` is `Contested` or `Critical. The seat
  could fall`; false where the record holds a governing power and it reads `Stable`/`Holding`; `undefined` where no
  governing power: unanswered, fail-closed). **Its one reader**: a new leaf `src/domain/facts/seatContested.js ::
  seatContestedOf(record)` over `coupRiskLabel(coupContenders(record))`.
- **How an existing atom is declared and answered** (INFERRED, quoted): declared in
  `src/domain/facts/factVocabulary.js :: FACT_DIMENSIONS` (:350)
  `'seat outranked': dim({ shape: 'presence', home: 'seatOutranked', reader: (f) => bool(f.seatOutranked) }),`
  answered in `src/domain/facts/factsOf.js :: factsOf` (:153-154)
  `get seatOutranked() { return seatOutrankedOf(record); },` by its home `src/domain/facts/seatOutranked.js ::
  seatOutrankedOf`; a corpus line declares it by a mark — `DS-POW-4 › Holding` v3 carries `"no seat outranked"`
  (power.generated.js :1671) — and the desk's kernel reads it against `options.facts` (`powerStateProse.js :983`,
  `factsAnswered(settlement, …)` → `facts/factsAnswered.js :: factsAnswered`). `drawDeclared.js` is the door the
  account's own pools use (`resolveDeclared`, governanceAccount.js :323). The family note at factVocabulary.js :341-345
  ("no fourth without the chair"; `seat outranked` is the fourth, ruling SO1): `seat contested` would be the FIFTH, a
  grant of the chair's.
- **The Stable-header vids that would carry the exclusion** (`"no seat contested"`): DS-POW-2 › `stable matched` **v1, v3,
  v4** (the three that state an expectation; together 54 prints beside a contest on the 900, EXECUTED); v2 also asserts no
  rival and would carry it too, though it never prints here (0 of 491, EXECUTED). v5 (occupied) does not need it.
- **Dark and lit.** `coupContenders` reads only `powerStructure.factions`, `governingFactionOf(record)`,
  `powerStructure.publicLegitimacy.govMultiplier` and (through `townMap/ladderRead.js :: ladderEffectivePowerFactor`) the
  record's `npcLadder` — no clock, no world, no flag on this tree (INFERRED). **A shared read hides one of them**: the
  rows of HIDDEN powers in `powerStructure.factions` (`publicVeiledRecordOf`, "the hidden powers' rows gone"); and the
  power desk's kernel reads `factsOf` of the VEILED record on the player view (`powerDeskRead.js :73`). Measured: the label
  over the veiled record differs from the owner's on **1 of 900** (`hxd-hamlet-40`: `Holding` → `Stable`, the infiltrator
  stripped), and the atom's VALUE differs on **0 of 900** (EXECUTED). Whether the strip touches `npcLadder` was not
  checked. Whether the seat lane's lit law (`SEAT_CONTEST_LIT`, not on this tree) changes `coupContenders` was not
  checkable here.
- **First paint** (EXECUTED: `vite.config.js :: EAGER_FIRST_PAINT_MODULES`, 332 modules, imported in node):
  `facts/factVocabulary.js` **eager**, `facts/drawDeclared.js` eager, `stateProse/stateProseKernel.js` eager;
  `facts/factsOf.js` **lazy**, `rulingPowerCoup.js` **lazy**, `display/governanceAccount.js` lazy,
  `stateProse/powerStateProse.js` lazy, `power.generated.js` lazy. So: the EAGER module that DECLARES atoms is
  `factVocabulary.js` (its reader `(f) => bool(f.seatContested)` imports nothing); the LAZY module that ANSWERS them is
  `factsOf.js` (pinned `coherence-lazy`, vite.config.js :409); `rulingPowerCoup.js` is pinned there too (:374). The
  reader leaf `facts/seatContested.js` would be imported ONLY by `factsOf.js` and must be PINNED in the same list beside
  it (INFERRED from the BAR4-FIRSTPAINT precedent, vite.config.js :466-487: "the derivation walked through
  facts/factsOf.js … into its new homes", putting them in eager engine-core until pinned). Then no code enters first
  paint. (`facts/seatOutranked.js` is measured EAGER because generators import it — it is not the model for placement.)

## Files

`seat-town.census.mjs` (the census), `vitest.seat-town.config.mjs`, `run-seat-town.sh` (ROOT an argument),
`analyze-seat-town.mjs` (the counts), `calm-contested.json` (the 84). Raw records (900 lines, with every printed string
holding "town") stay in the scratch directory; they are not committed.
