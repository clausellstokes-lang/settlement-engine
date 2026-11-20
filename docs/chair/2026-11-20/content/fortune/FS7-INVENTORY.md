# FS7 INVENTORY: the page agrees with itself under the new law (FORTUNE-3's U4 builder, 2026-11-20)

A READING, not code. Read on `lane/fortune-3-u4-2026-11-20` cut at 9910adb03 (U1, U2, U3 and U5s merged). Every
figure below was EXECUTED on that tree on the fixture arm (COMMON: `{ ...birthConfig(cfg), _fortuneLawVersion: 2 }`
after `loadGenerationLawPayloads()`; law 1 is the same config without the marker), seeds `u4-<size>-<i>`, 20 a size,
`DEFAULT_CONFIG` (the FS7 prototype screen's own config), unless a row says otherwise. The instruments are in
`instruments/u4-*` beside this file (`u4-births.mjs` and `u4-pages.mjs` birth the towns and render their stored and
printed prose; the others read those files); each prints its own counts.

THE FOUR FORTUNE COMBINATIONS (the chair's ruling 4): COMFORTABLE or PROSPEROUS at THORP, HAMLET, VILLAGE ("rich-small");
POOR or MODERATE at CITY, METROPOLIS ("modest-big"). THE THREE STANDING COMBINATIONS (step 3): APPROVED at thorp, hamlet,
village; TOLERATED or CONTESTED at city, metropolis.

A FINDING presumes a size's wealth (or a size's want) on the other size: a line that credits a small place's economy
with what only a big place's economy has, or the reverse. A line that speaks the label's own wealth word at any size
AGREES (the label IS the place's fortune under the law, read against its size). The estate's generic "town" is the
tier noun's (`tierVoice.js`), never a finding here.

## 0. How often the combinations occur (`u4-births.mjs`, 120 towns a law)

| size | law 1: Comfortable / Prosperous | law 2: Comfortable / Prosperous | law 1: Poor / Moderate | law 2: Poor / Moderate |
|---|---|---|---|---|
| thorp | 3 / 0 | 5 / 3 | 4 / 5 | 2 / 2 |
| hamlet | 3 / 0 | 7 / 8 | 9 / 6 | 3 / 1 |
| village | 0 / 0 | 10 / 1 | 11 / 5 | 2 / 4 |
| city | 5 / 14 | 12 / 2 | 0 / 0 | 0 / 5 |
| metropolis | 4 / 15 | 10 / 8 | 0 / 0 | 1 / 0 |

Standing, law 2: Approved at thorp 3, hamlet 7, village 1 (law 1: 0, 0, 0); Tolerated or Contested at city 17,
metropolis 10 (law 1: 5, 3). The combinations are the new law's ordinary towns.

## 1. THE READERS THAT PICK TEXT BY THE FORTUNE LABEL (step 1)

Found from the brief's grep (59 files, 147 lines) widened to `prosperityRank(`, `prosperityRank01(`, the facts atom
`prosperity: ...` on a declared line, and `publicLegitimacy.breakdown.prosperity` (the label's term on the standing
card). Every hit was opened. The readers that pick NO text (a number, a facet, a fingerprint, a sort key, a severity, a
service row kept) are listed at 1.Z and not enumerated.

### 1.A `src/generators/economy/prosperity.js :: situationDescOf` (stored `economicState.situationDesc`)

Condition: a crisis line first (siege, famine, occupied, indebted, plague, fractured), then the food gap, then the
route (isolated), then the trade line by the economy OUTPUT band (`priorityToCategory(flags.economyOutput)`),
RE-KEYED by the label where the band contradicts it (`tradeBandFor`): Comfortable or better takes no slow line
(Comfortable re-keys to `medium`, Prosperous to `high`); Poor or worse no busy line (Poor re-keys to `low`).
Siblings: `PROSPERITY_LINE_SIBLINGS` (the market twins).

| line (opening words) | rich-small | modest-big | verdict |
|---|---|---|---|
| The market is shut and the caravans have stopped coming (+ no-market twin) | yes (siege) | yes | AGREES: the crisis's |
| Food is short, and those with grain hold the power (+ twin) | yes | yes | AGREES |
| The occupiers take their share through {channel} | yes | yes | AGREES |
| Much of what the settlement takes in goes on its debts | yes | yes | AGREES |
| Fear of the sickness and the quarantine (+ twin) | yes | yes | AGREES |
| Trading now means picking a way between rival powers | yes | yes | AGREES |
| Even with what is brought in, people here go short of {much of / part of} the food | yes | yes | AGREES |
| The settlement is too big to live cut off (isolated, town and above) | no | yes | AGREES: size-gated |
| Goods come and go by magic (isolated, town and above) | no | yes | AGREES |
| Those in power take so much that little gets made (isolated, state crime) | yes | yes | AGREES |
| Cut off as it is, the settlement runs itself well: skilled crafts, well-worked fields | yes (Prosperous) | no | AGREES: crafts and fields hold at any size |
| With no outside trade, the settlement struggles | no | yes (Poor) | AGREES |
| The settlement feeds and supplies itself without outside trade | yes | yes | AGREES |
| The church controls most economic activity (+ twin) | yes | yes | AGREES |
| Trade is brisk, and it is hard to say where honest business ends | yes | yes | AGREES |
| On paper the settlement's trade looks healthy | yes | yes | AGREES |
| Trade is what this settlement lives on. The markets are busy at all hours, and the guilds have a hand in every craft (+ twin "Goods change hands ...") | by the OUTPUT band only (Wealthy re-keys here; no combination does) | no | FINDING-OUTSIDE-THE-LABEL (F3): names guilds at a place that holds none; picked by the economy output, not by the fortune label |
| **Trade is brisk, the guilds are well run, and the settlement's coffers fill steadily.** | **yes: Prosperous re-keys a slow band to `high`** (and the output band picks it) | no | **FINDING F2**: names guilds where the place holds no guild (`facts/guild.js :: guildOf` false) |
| Commerce is sluggish; markets meet infrequently (+ no-market twin) | no (Comfortable+ re-keys away) | yes (Poor re-keys a busy band to `low`) | AGREES: a poor place's market meeting seldom is a poor place's market (declared on the market atom); noted, vetoable |
| Little coin changes hands here; people barter | no | no (Struggling only) | n/a |
| Honest trade gets by, but a busy black market undercuts it | yes | yes | AGREES |
| Trade proceeds at an ordinary pace for a settlement of this size | yes (Comfortable re-keys here) | yes | AGREES: size-relative by its own words |

F2 measured (`u4-findings.mjs`, thorp/hamlet/village x economy 25/50/92 x 20, the guild line where `guildOf` is false):
law 1: thorp 12, hamlet 10, village 10 (labels: Comfortable 11, Prosperous 11, Moderate 10); law 2: thorp 14, hamlet
11, village 11 (Prosperous 31, Comfortable 4, Moderate 1). In the default-config twenty it prints in none (the output
band is `medium` there).

### 1.B DS-ECO-1, the prosperity header (`src/domain/display/stateProse/economyStateProse.js :: prosperityHeaderPoolKey`)

Condition: the rung (`prosperityRank`) and the approach: high (Prosperous, Wealthy), middle (Moderate, Comfortable),
low (Subsistence, Struggling, Poor); narrow approach (isolated, mountain_pass) splits high and low. Slot `{complexity}`
is `COMPLEXITY_NOUN[economicComplexity]`, and at thorp and hamlet the complexity is a SIZE ladder
(`prosperity.js :: complexityByExports`): "Subsistence — survival economy" is "subsistence living".

| pool / line | rich-small | modest-big | verdict |
|---|---|---|---|
| C1 v1 A {complexity} keeps everyone at {settlement} busy. Nobody here is waiting for work. | Prosperous | no | **FINDING F1** where {complexity} is "subsistence living" (the high rung's busy economy credited to subsistence); AGREES otherwise |
| C1 v2 {settlement} lives on a {complexity} and ends each year with money to spare. | Prosperous | no | **FINDING F1** where {complexity} is "subsistence living" ("lives on a subsistence living and ends each year with money to spare"); AGREES otherwise |
| C1 v3 Nobody here talks about the price of bread. The town is well off ... | Prosperous | no | AGREES |
| C1 v4 {settlement} earns well, but much of what it earns goes to the outside power it owes. | Prosperous, indebted | no | AGREES |
| C2 v1 richer than its road suggests ... its stores are deep and its halls are finished. | Prosperous, narrow | no | AGREES (stores >= 6 declared) |
| C2 v2 Hard as {settlement} is to reach, it does well all the same on a {complexity}. | Prosperous, narrow | no | **FINDING F1** where {complexity} is "subsistence living"; AGREES otherwise |
| C2 v3 A narrow way in has not kept {settlement} poor ... | Prosperous, narrow | no | AGREES |
| C3 v1 With a little left over each year, {settlement} gets by on a {complexity} ... | Comfortable | Moderate | AGREES ("gets by on a subsistence living" with a little over is true) |
| C3 v2 pays its way from year to year, and nobody here calls the town poor. | Comfortable | Moderate | AGREES |
| C3 v3 Nothing about {settlement} looks rich or poor: the {access} is busy enough, the market is open | Comfortable | Moderate | AGREES (market declared) |
| C4 v1 to v7 (sits on its {access} and stays poor; the town is poor and says so; the traders at its market; the siege lines; no market to hold what its {access} brings) | no | Poor | AGREES: no size presumed, market and siege declared |
| C5 v1 to v3 (poor, and the road to it is long and hard) | no | Poor, narrow | AGREES |

F1 measured (`u4-findings.mjs`, the header naming "subsistence living" in a high-rung line): law 1: thorp 3, hamlet 2,
village 0; law 2: thorp 4, hamlet 3, village 1. In the default-config twenty, law 2: three hamlets (Rasdeh, Mönkhtala,
Qaranuur: "lives on a subsistence living and ends each year with money to spare"); law 1: none.

### 1.C DS-ECO-8, the rung read on its own (`economyStateProse.js`, `daily_life.standingOfLiving`)

| pool / line | rich-small | modest-big | verdict |
|---|---|---|---|
| COMFORTABLE v1 purse closes every year ahead ... money laid by | yes | no | AGREES |
| COMFORTABLE v2 People here put things by, and can ... between this town and a poorer one | yes | no | AGREES |
| COMFORTABLE v3 / v4 The town is plainly comfortable. The buildings are finished ... (stores >= 3 / < 3) | yes | no | AGREES |
| PROSPEROUS v1 has money to spend, and spends it on the town's buildings | yes | no | AGREES |
| PROSPEROUS v2 / v4 visibly well off. The halls, the walls (houses) and the roads are all better than a town this size strictly requires (walls / no walls) | yes | no | AGREES: size-relative by its own words ("a hamlet this size") |
| PROSPEROUS v3 There is money here and it goes into the town | yes | no | AGREES |
| MODERATE v1 to v4 (a little more than it pays out; neither comfortable nor tight; nothing asks to be remarked on; the accounts still balance) | no | yes | AGREES |
| POOR v1 to v6 (covers what it must; the town gets by, nobody building; old buildings patched; money short; does not raise all its food; some of what its work needs does not reach it) | no | yes | AGREES: absolute words for a poor place, no size named (noted: "nothing new goes up" in a metropolis reads strong; vetoable) |
| FOOD AND PROSPERITY (three pools) | keyed on `foodSecurity.prosperityMod`, not the label | | not a label reader |

### 1.D DS-GEN-3, the systems-health prosperity rung (`generalStateProse.js :: prosperityPoolKey`)

| pool / line | rich-small | modest-big | verdict |
|---|---|---|---|
| Comfortable / Prosperous v1 to v3 (the ordinary year leaves something over; the surplus is real; can afford to argue about other things) | yes | no | AGREES |
| Moderate / Modest v1 to v4 (neither rich nor poor; pays for itself; eats well enough; does not eat as well as it would like) | no | yes | AGREES |
| Struggling / Poor v1 to v3 (gets by, just; ends most years barely even; households keep careful account) | no | yes | AGREES |

### 1.E Stored prose picked by the label or its atom

| reader | condition | lines in the combinations | verdict |
|---|---|---|---|
| `narrative/arrivalScene.js` (tension beat) | prosperous / wealthy -> `ARRIVAL_TENSIONS.prosperous`; subsistence / struggling / poor -> `.poor`; Comfortable and Moderate pick none | prosperous: fresh paint; well-fed children; even the outbuildings; a merchant shows off a new cloak. poor: patched roofs; mend what they have; outgrown clothes; goods mostly second-hand | AGREES (8). Noted: "a merchant" at a thorp is a trader, not a size's wealth; vetoable |
| `power/settlementNarrative.js` | Poor -> two lines; Wealthy -> one | "{name} is poor, and {gov} and {top} quarrel over who goes without" / "... decides who goes without" | AGREES (2) |
| `narrativeGenerator.js` power_economic note, and DS-GEN-7 `power_economic: powerful criminal faction in a prosperous settlement` | Prosperous / Wealthy and a criminal power above 35 | the note; DS-GEN-7 v1 to v4 (tax lists, the hall would rather not itemise, visibly wealthy, the tax rolls) | AGREES (5): the estate's fiscal words, printed at village size by other pools too |
| `narrativeText.js` wartime rows | `prosperity: ≥ comfortable` (prospering row, needs garrison); `purseHoldsMargin` (requisition row's two forms) | 3 | AGREES |
| `data/narrativeData.js` wartime arrival | `prosperity: ≥ moderate` (+ the poor twin) | 2 | AGREES |
| `stressNarrative.js` wartime | `prosperity: ≥ moderate` and a market (profit) else loss | 2 | AGREES |
| `data/stressInstitutionEffects.js` secret | `prosperity: ≥ comfortable` ("the war contracts that made the settlement rich") | 1 | AGREES |
| `safetyProfile.js` guard purse lines | `prosperity: ≥ moderate`, `≤ poor`, `≤ comfortable` (five sets, ten lines) | 10 | AGREES |
| DS-DEF-2 Economic Survival | `prosperity: ≥ moderate`, `≥ poor`, `≤ comfortable`, `≥ prosperous` | 8 | AGREES |
| DS-ECO-12 one source carries the town | `prosperity: ≥ moderate` | 1 | AGREES |
| `npcStructure.js :: getPrimaryCondition` | struggling / poor / subsist -> `economic_stress` (six categories, two ranks) | 12 entries (36 strings) | AGREES: none presumes a size |
| `legacyGenerator.js` | prosperous / stressed suffixes | 4 | AGREES |
| `historyGenerator.js :: trueToRecord` | refuses market_crash and trade_collapse at Prosperous and Wealthy | (refusal only) | AGREES |
| `defenseGenerator.js` | caps Economic Survival below STRONG at Poor and below | (number only) | AGREES |

### 1.F Display words that print the label itself

`components/map/heraldRegister.js` ("A prosperous hamlet, at peace."), `TableView.jsx`, `ShareToGallery.jsx`,
`summary/settlementQuickGuide.js` ("the economy is comfortable"), `summary/tonightAtTheTable.js`,
`dossierViewModel.js` (the label and `prosperityInCrisis.js`'s two-word sentence), `causalState.js` ("Prosperity is
X."), `districtProfile.js` (Prosperous / Wealthy: "district wealth nudged up"), `magicProfile.js` ("Too poor to keep
magic stocked", Struggling and below by `keepOf`): each says the label's own word. AGREES (10).

### 1.Z Readers that pick no text (not enumerated)

`foodGenerator.js`, `services/serviceRollMaterialization.js`, `economicState.js`, `assembleSettlement.js`,
`defenseGenerator.js` (keep), `facts/keep.js`, `facts/factsOf.js`, `facts/factLayers.js`, `facts/factVocabulary.js`
(the atom's home), `prosperityRank.js`, `neighbourGenerator.js` (a 0..1 strength), `density/applyDensityLaw.js`,
`density/titularSuccession.js` (comment), `steps/stepMetadata.js` (a trace label), `steps/economyReconcilePass.js`,
`generationCoherence.js` (the receipt), `npcGenerator.js`, `people/representatives.js`, `people/castPowers.js`
(`_prosperity` is carried on the person; no reader picks text by it), `data/economyFingerprint.js`,
`lib/generationTelemetry.js`, `lib/gallery.js`, `lib/structuralFingerprint.js`, `components/gallery/galleryUtils.js`,
`autonomy/signalRegistry.js`, `tuning/proposedSoakBands.js`, `conditionPromotion.js`, `interior/interiorModel.js`,
`townMap/townLayoutV2.js`, `townScene/buildingProfiles.js`, `townCartography/*`, the worldPulse kernels
(`generosityKernel`, `treasury`, `traditionsKernel`, `religiousContest`, `factionDensityKernel`: play-time numbers),
`display/defenseScoreBands.js` (comment). `power/rulingStructure.js` (another seat's) reads Wealthy only, for the
merchants' cap: no combination reaches it.

## 2. THE FINDINGS AND WHERE EACH IS CURED (step 2)

| id | file :: symbol | the line | why | this lane's? | cure |
|---|---|---|---|---|---|
| F1 | `display/stateProse/economyStateProse.js :: economyStateProse` (DS-ECO-1 C1 v1, v2; C2 v2) | "{settlement} lives on a subsistence living and ends each year with money to spare." | the high rung credits its money to the economy the slot names; at a thorp or hamlet that slot is the size ladder's "subsistence living", the one economy that is no source of a high rung's money | yes | under law 2 only: at a high rung the subsistence complexity does not fill `{complexity}` (the slot's own condition), so the variants naming it are not drawn (anchored liveness) |
| F2 | `generators/economy/prosperity.js :: deriveEconomicSituationDesc` | "Trade is brisk, the guilds are well run, and the settlement's coffers fill steadily." | names guilds where the place holds none (`guildOf` false: no guild house, no guild power); the label picks it at a Prosperous place on a slow output band | yes | under law 2 only: the line declares the guild it names, and its twin without the guilds ("Trade is brisk, and the settlement's coffers fill steadily.") prints where none stands |
| F3 | `generators/economy/prosperity.js :: situationDescOf` (very_high) | "... and the guilds have a hand in every craft." (and its market twin) | the same guild presumption, but picked by the economy OUTPUT band, never by the fortune label in a combination (only Wealthy re-keys to it) | yes | NOT cured here (outside the label's reach; the brief does not chase it): reported to the integrator |

Both cures choose differently ONLY under law 2 (`isSizeRelativeFortune` on the town's own config); under law 1 every
line picks exactly what it picks today, so both F1 and F2 stand under law 1 and are LISTED at 5.

Findings in files NOT this lane's (COMMON's list): none. The summary and people readers (1.F, 1.Z) print the label's own
word or pick no text.

## 3. THE STANDING WORDS (step 3)

| reader | APPROVED at thorp / hamlet / village | TOLERATED / CONTESTED at city / metropolis | verdict |
|---|---|---|---|
| DS-POW-1 band ladder (`powerStateProse.js :: legitimacyBandPoolKey`) | Approved v1 to v5 ("thinks well enough ... in most quarters"; "has the town on its side"; "grumbling ... stays grumbling"; "liked well enough"; the occupied form) | Tolerated v1 to v5; Contested v1 to v5 (dues late; two answers before the day is out; one hard season) | AGREES (15): no size presumed ("in most quarters" is the idiom, not districts); the tier-bound lines are Endorsed's and Crisis's, marked `tier:` |
| DS-POW-1 lens (`legitimacyLensPoolKey`) | PROSPERITY favourable v1 to v3 (doing well and gives the seat the credit) | SAFETY / DEFENSE / PROSPERITY / FOOD adverse (12) | AGREES (15) |
| DS-POW-4 hold (`legitimacyHoldPoolKey`, the band's multiplier) | hardens the hold v1 to v3 | neither helps nor hurts v1 to v3 (Tolerated); breaking the hold v1 to v3 (Contested) | AGREES (9) |
| DS-POW-6 capture pressure (`capturePoolKey`, the signs of safety and prosperity) | RECOVERING v1 to v4 | ADVANCING v1 to v11 (tier-marked) | AGREES (15) |
| `governanceAccount.js :: standingSentence` | Approved: bare; "{causes} has earned"; "has the approval ... {causes} earned it" | Tolerated: bare; "{causes} keep ... from more than tolerating"; "... is the reason"; Contested: bare and two arrangements | AGREES (9 forms); the reason clause is read at 4 |
| `data/historyData.js` legitimacy tension twins (`isApproved`) | the held twins (3) | the questioned forms (3) | AGREES (6) |
| `npcStructure.js` `contested` (six categories, two ranks) | n/a | 12 entries | AGREES |
| `crisis/crisisCast.js` stake reasons, `hookEscalation.js` legitimacy clock, `legacyGenerator.js` contested suffix, `display/rulingAuthorityShown.js` cap | n/a | the church gains while the seat struggles; the clock's stages; the quarrel never settled; the Foundations cap | AGREES |

Lines read for step 3: 85. Findings: 0.

## 4. THE REASON CLAUSE (step 4: the chair's finding of 10:48 UTC, the rules of 11:52 and 12:01 UTC)

THE CHOOSER. The sentence the chair read ("Weak defences keep Zuuhan from more than tolerating the Corrupt Council.")
is not DS-POW-1's: it is `src/domain/display/governanceAccount.js :: standingSentence`, whose causes come from
`legitimacyCausesOf(breakdown, adverse, safetyLabel)`. It keeps the terms of the band's direction (adverse bands
Tolerated, Contested, Legitimacy Crisis: `value < 0`; Approved, Endorsed: `value > 0`), sorts them by magnitude
(ties: prosperity, safety, defence, food), and names at most two. EVERY CLAUSE IT CAN PRINT:

| clause | trigger term | direction |
|---|---|---|
| poverty | `breakdown.prosperity` < 0 | adverse |
| crime (a plain safety label) / insecurity (a crisis-named label) / the curfew (a curfew alone) | `breakdown.safety` < 0 | adverse |
| weak defences | `breakdown.defense` < 0 | adverse |
| hunger | `breakdown.food` < 0 | adverse |
| prosperity / safety / strong defences / full stores | the same four > 0 | favourable |
| (no clause: "tolerates ..., and no more", "... approves of ...") | no term of the band's direction | |

THE CRIMINAL CAPTURE is no term of the score, so the clause never names it; the same paragraph names it in its own
sentence ("{criminals} decide what the hall decides" / "have bought people inside the hall"). Where the largest negative
is safety, the clause names safety first in every adverse band (law 1: 30 such towns of 120, 21 in an adverse band,
all named "insecurity" first, and 9 Approved, whose sentence names favourable terms only; law 2: 26, all adverse, all
named first).

DOES IT NAME THE LARGEST TERM? It names the largest term OF THE BAND'S DIRECTION, always (by construction). Counted
against the largest term by magnitude in either direction, the first clause differs in 10 law-1 towns (all
"Weak defences keep ... from more than tolerating" where prosperity +8 is the largest term and defence -1 or -2 the only
negative) and in 1 law-2 town (Qaranuur, hamlet: insecurity -12 named, prosperity +15 the largest; without the -12 it
would be Approved, so the clause is true).

THE CHAIR'S RULE OF 11:52 UTC, CHECKED: under law 2 a place inside its size's usual defence range has a defence term
of 0, and a term of 0 is never kept (`value < 0` / `value > 0`), so it NEVER prints the defence clause. Executed: in
all 240 towns (both laws) the stored defence term equals its law's rule applied to the card's own readiness label
(`u4-defcheck.mjs`: 0 disagree), the clause names a term of 0 in 0 towns, and "weak defences" prints in ONE law-2 town (Cnocgarth,
a town at Vulnerable, one band under the town's usual Lightly Defended: term -3). The rule holds by construction on the
built law; there is no cure to make, so no red can be written for it (a test written now would pass before any edit).

SAFETY UNDER U5s (FORTUNE-3's rule 3), THE SAME RULE: a calm safety label inside the size's usual range has a safety
term of 0 under law 2; the clauses that can print for safety are "crime", "insecurity", "the curfew" (adverse) and
"safety" (favourable) in this sentence, DS-POW-1's "breakdown dominated by SAFETY, adverse" (three lines) and DS-POW-6's
ADVANCING / RECOVERING (both signs strict). Every one needs a non-zero term. Executed: the stored safety term equals
its law's rule applied to the card's own safety label in all 240 towns (`u4-safecheck.mjs`: 0 disagree; the
prosperity term likewise equals the label's points in 240 of 240), and no clause names a
safety term of 0. No safety clause names a term of 0 as THE reason, so NONE IS CURED (the chair may veto this reading).

THE CLAUSES, TOWNS OF 20 A SIZE THAT PRINT EACH (`u4-step4.cjs`; first and second clause counted apart):

| clause (trigger) | law | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|---|
| first: poverty (prosperity) | 1 | 11 | 10 | 14 | 0 | 1 | 1 |
| | 2 | 10 | 3 | 4 | 0 | 1 | 1 |
| first: crime / insecurity (safety) | 1 | 3 | 2 | 2 | 6 | 5 | 3 |
| | 2 | 3 | 3 | 3 | 6 | 6 | 5 |
| first: weak defences (defence) | 1 | 6 | 8 | 4 | 6 | 0 | 0 |
| | 2 | 0 | 0 | 0 | 1 | 0 | 0 |
| first: hunger (food) | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| | 2 | 0 | 0 | 1 | 0 | 0 | 0 |
| second: weak defences (defence) | 1 | 4 | 8 | 11 | 4 | 0 | 0 |
| | 2 | 0 | 0 | 0 | 1 | 0 | 0 |
| second: insecurity / the curfew (safety) | 1 | 9 | 3 | 4 | 0 | 1 | 1 |
| | 2 | 9 | 2 | 3 | 0 | 1 | 1 |
| second: poverty (prosperity) | 1 | 1 | 1 | 1 | 2 | 0 | 0 |
| | 2 | 0 | 1 | 1 | 3 | 0 | 1 |
| second: hunger (food) | 2 | 1 | 0 | 0 | 0 | 0 | 0 |
| first: prosperity (favourable) | 1 | 0 | 0 | 0 | 7 | 14 | 15 |
| | 2 | 3 | 7 | 1 | 7 | 2 | 8 |
| first: strong defences (favourable) | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| second: strong defences (favourable) | 1 | 0 | 0 | 0 | 0 | 14 | 15 |
| | 2 | 0 | 2 | 0 | 0 | 0 | 0 |
| no clause (Tolerated, bare) | 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| | 2 | 4 | 7 | 11 | 6 | 11 | 6 |

What the light changes on that card: "weak defences" leaves the small places (law 1: 18 first and 23 second of 60;
law 2: none) and most towns; the bare "tolerates ... and no more" becomes the ordinary Tolerated sentence (law 2: 45
of 120). The criminally held towns (`corrupted`, `capture`): law 1, 3 (clauses: poverty + insecurity; strong defences +
prosperity; prosperity + strong defences); law 2, 4 (poverty + insecurity; insecurity; bare; bare): none names defence
under either law in these seeds.

## 5. THE LAW-1 READINGS, LISTED FOR THE OWNER (not cured: the dark rule and the chair's ruling of 12:01 UTC)

| reading | where | law-1 reach (measured) |
|---|---|---|
| "Weak defences keep {place} from more than tolerating {ruler}." / "... is the reason." where defence is the only negative and the town would be Tolerated without it (prosperity +8, defence -1 or -2: score 56 or 57) | `governanceAccount.js :: standingSentence` | 10 of 120 default-config towns (thorp 3, hamlet 3, town 4); defence named first anywhere: thorp 6, hamlet 8, village 4, town 6 of 20. The chair ruled it true under law 1 (it is that score's term) |
| F1: "{settlement} lives on a subsistence living and ends each year with money to spare." / "A subsistence living keeps everyone at {settlement} busy." | DS-ECO-1 C1 / C2, `economyStateProse.js` | thorp 3, hamlet 2, village 0 of 60 each (economy 25 / 50 / 92) |
| F2: "Trade is brisk, the guilds are well run, and the settlement's coffers fill steadily." with no guild | `prosperity.js :: deriveEconomicSituationDesc` | thorp 12, hamlet 10, village 10 of 60 each |
| F3: "... the guilds have a hand in every craft." with no guild (output-band picked) | `prosperity.js :: situationDescOf` | not measured apart; reported only |

## 6. COUNTS

Lines read for the four fortune combinations: 1.A 29, 1.B 20, 1.C 18, 1.D 10, 1.E 58, 1.F 10 (readers): 145. Standing
lines: 85. Reason clauses: 10. Total 240 lines read. Findings: 3 (F1, F2 cured under law 2 in their own commits; F3 reported);
step 3: 0; step 4: 0 under law 2 (the chair's rule holds by construction), the law-1 reading listed.
