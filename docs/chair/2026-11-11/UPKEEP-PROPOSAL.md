# What a place can keep up: a proposal (COHERENCE-AGREE-2, item 4, phase 1)

**PHASE 1 ONLY. NOTHING UNDER `src/` HAS CHANGED FOR THIS ITEM.** The after numbers come from two scratch copies of the lane's tip. They were never committed and never pushed.

**The owner's words (2026-11-12):**

> "does defense also calculate a merecenary charter or adventure guild charter as supplements to a guard or military, replacing them to an appropriate but lesser degree that scales to the prosperity of that settlement? … if a village or town doesn't have an active guard but can hire mercenaries or adventurers if they have the cash, then that means something rather than not having a guard at all."

> "prosperity should also scale the rest inlcuding healing, magic, etc. everything is based on what can be stockpiled, refilled, rebuilt, etc."

**The corpus:** 360 births on seeds `agree-<tier>-<i>` (60 villages, 160 towns, 100 cities, 40 metropolises), every browser dial on random, `grounded`. These are the lane's own seeds, not the chair's `hire-*` seeds. In this corpus there is no village with a hired company and no standing guard. Its hired-only places are 5 places with a charter hall only.

## (a) The inventory: what costs something to keep, where it is written, and what it reads today

| Family | Where it is written | What it reads today | Does it read wealth? |
|---|---|---|---|
| Defence: military | `defenseGenerator.js` `computeDefenseScores` (the walls, garrison, militia and watch terms; the hired company +14 and the charter hall +10) | presence; `milUpkeepMult` = 0.6 → 1.0 over economic output 0 → 50, applied to everything above the community base | economic output |
| Defence: monster | the same file (charter hall +35; garrison, walls, militia, hospital, wardens) | `monsterUpkeepMult` = 0.7 → 1.0, sparing the threat base and the clergy and druid traditions | economic output |
| Defence: internal | the same file (court, prison, watch, garrison) | `internalUpkeepMult` = 0.65 → 1.0 | economic output |
| Defence: economic | the same file (storage, institutions, routes, plus 0.2 × output) | `econHealthMult` = 0.45 → 1.0 | economic output |
| Defence: disaster | `generateDefenseProfile` (`disasterGate` over the food record's resilience) | 0.55 → 1.0 | economic output |
| Defence: the contract chain | the same function: a healthy mercenary chain adds +4 | chain status | no |
| Defence: magical | the same file | magic's own standing (priority and traditions) | no |
| Services (healing among them) | `services/serviceAvailability.js :: getServiceTierInfo`, read by `serviceRollMaterialization.js` | a demand multiplier by domain: commercial services by economic output, magic services by magic influence, criminal by crime, military by military, religious by religion; **healing and every other service: 1** | commercial services only (a correction to the chair's survey) |
| Magic availability and cost | `domain/magicProfile.js` `deriveAvailability` and `deriveCost` | `config.magicLevel` and the practising institutions | no |
| Food stores | `foodGenerator.js` (`storageMonthsFull`, `storageMonths` in a famine), written through `facts/storesMonths.js :: withStoresMonths` | granaries, tier and the famine | no |
| Repair and recovery after a loss | the world pulse (the simulation) | — | outside this wave (charter §4: "The simulation" is in no lane) |

**What costs nothing to keep and is never scaled:** the community bases (armed households, the terrain alarm), the threat-level baseline, volunteer clergy and druidic wardens, the lie of the land (the terrain multiplier), and the walls already built. The walls' upkeep is in today's military gate, which has a floor of 0.6 because "built walls keep standing".

## (b) One home: the prosperity label (`economicState.prosperity`)

**Recommended: the prosperity label, for three reasons.**

1. It is the owner's own word.
2. It is the rating the page prints beside every capacity. A capacity scaled by anything else can say "paid well" beside "Poor". That is this lane's own class (one fact, two answers), and on this corpus it would happen often. Economic output is at 50 or more (today's full-funding point) in 15 Poor or Struggling towns, and below 50 in 82 Comfortable or Prosperous towns.
3. **Nothing feeds back.** `computeBaseProsperity` reads the route, the tier, the economy, magic and military sliders, the threat, the PRESENCE of walls and garrison (by name, never a score), the food record's modifier (granary presence, deficit, surplus and chain count, never the months in store), the count of economy institutions and the income diversity. `deriveProsperityLabel` adds economic output and the stresses. None of these is a score, a service availability, a magic availability or a months-in-store figure. Prosperity is written in the economic state before the defence profile (`assembleSettlement`) and before the service roll. The stores are the one thing written inside the food record that prosperity also reads. That is why the rule scales the stores AFTER prosperity, at the stores' one writer, never inside `generateFoodSecurity`.

Economic output stays what it is: an input to prosperity. Under the recommended rule it is no longer a second reader of "what can be kept up".

**Read through one reader:** a `keep` atom beside the market and the defence atoms. It maps each label to a share: Struggling 0.4, Subsistence 0.55, Poor 0.55, Moderate 0.75, Comfortable 0.9, Prosperous 1, Wealthy 1. Registering it in the vocabulary is `factVocabulary.js`, which is PRESUME's file this wave. The builder's lane needs it.

## (c) The rule, family by family

1. **The hired force (the owner's first question).** The hired company (+14 military) and the charter hall (+10 military, +35 monster) are worth what the place can pay. Each is multiplied by `keep` and added AFTER today's wage gate, so the hired force has one reader and no longer rides economic output. The healthy contract chain (+4) is scaled the same way. Each term stays capped at its present value, so a hired force never exceeds today's figure and never equals a standing force of its kind (garrison 28; walls and garrison 20 each against monsters). It already stands in where no guard stands, because the score counts it alone; the rule only makes that stand-in worth what the coin can buy.
2. **The five gates. Two alternatives; the chair rules.**
   - **A. Leave them on economic output** (this item's cost is only the hired rule). Cost: two readers of "what can be kept up" until a later wave.
   - **B. Move them to the one home**, with today's floors kept and the identity at Comfortable and above: gate = floor + (1 − floor) × s, where s is Struggling 0, Subsistence 0.3, Poor 0.4, Moderate 0.7, Comfortable and above 1. Cost: 91 defence labels move (below), up and down roughly evenly, because the two readers disagree in 97 towns.
3. **Services, healing among them.** The scale is AVAILABILITY by roll, never the healer vanishing. The demand multiplier for healing, lodging, food, equipment and transport gains a factor of 0.7 + 0.3 × `keep`. That is 0.82 in a Struggling place and 1 at Prosperous; the commercial multiplier's own economic-output read moves to the same home. **Floor:** a service whose institution stands keeps at least one row of its kind. Price is not scaled: no price field exists, and a new one would be a new key.
4. **Magic.** Availability moves down one band (`downBand`, the inverse of the `upBand` already used) where `keep` < 0.6 and the place is not magic-pervasive by its level. Cost bands follow availability as they do today. Legality and risk are not scaled.
5. **Stores.** `storageMonthsFull` × (0.7 + 0.3 × `keep`) at the stores' one writer, after prosperity. A famine still draws from what is in hand. The disaster score reads the scaled months; prosperity never reads the months.
6. **Never scaled:** the community and threat bases, volunteer traditions, terrain, walls already built (above the 0.6 floor), and a vocation (the priest, the druid, the wardens).

## (d) How the page says it: in fields that exist, as declared lines with twins

All of these lines go in `economicState.safetyProfile.guardEffectivenessDesc` (the guard-effectiveness writer's sentence) and are declared in `SAFETY_LINE_SIBLINGS` by the atoms `mercenary`/`charter`, `guardPresence` and `keep`:

- **No standing guard, a company for hire, enough coin:** "There is no standing guard; the town pays a hired company to keep the peace, and gets what it pays for." The twin, where no company stands, is today's line.
- **A guard supplemented by hired force:** "The watch is backed by hired swords when the purse allows."
- **Coin too short to keep them:** "A hired company is on the books, but the town cannot pay it for long; it comes when called and leaves when the coin does." This prints where `keep` < 0.6.

For the charter hall, the monster line beside the monster row (`deriveSupportingCapabilities`) says "bounty work, as far as the purse runs" where `keep` < 1. That is a declared line in a field that exists. The services and the stores print through their existing lines; only the numbers move.

## (e) On the corpus, before and after (the hired rule; alternative B separately)

**The hired rule alone (scratch 1):**

| What stands | Prosperity | n | Military before → after (mean) | Monster before → after | Defence labels moved |
|---|---|---|---|---|---|
| nothing | all | 37 | unchanged | unchanged | 0 |
| hired only (charter hall) | Struggling / Poor / Comfortable | 1 / 3 / 1 | 17→13 / 66.3→60.3 / 33→32 | 27→14 / 57.3→41.3 / 39→36 | 1 |
| watch or militia | all | 91 | unchanged | unchanged | 0 |
| watch or militia + hired | Struggling / Poor / Moderate / Comfortable / Prosperous / Wealthy | 5 / 11 / 12 / 10 / 5 / 7 | 37.6→34.2 / 60.0→57.0 / 55.2→54.2 / 62.0→62.1 / 42.8→44.2 / 69.3→69.4 | 45.6→33.6 / 44.4→35.0 / 58.0→52.8 / 64.3→63.9 / 67.0→69.8 / 64.4→64.4 | 3 |
| garrison | all | 30 | unchanged | unchanged | 0 |
| garrison + hired | Struggling / Poor / Moderate / Comfortable / Prosperous / Wealthy | 4 / 12 / 17 / 47 / 53 / 14 | 63.0→66.8 / 71.1→75.0 / 82.5→88.0 / 88.1→93.1 / 90.1→94.5 / 95.9→95.9 | 74.0→61.2 / 67.6→59.8 / 79.8→77.7 / 87.9→90.2 / 87.1→89.9 / 92.8→92.8 | 8 |

**Defence labels that move: 12 of 360.**

| Before → after | Count |
|---|---|
| Defensible → Well-Defended | 6 |
| Defensible → Lightly Defended | 3 |
| Well-Defended → Fortress | 2 |
| Lightly Defended → Vulnerable | 1 |

**Why some places rise:** a rich place that held its hired force under a wage gate below 1 (economic output under 50 while the label says Comfortable or Prosperous) now keeps it at the label's share. That is the owner's principle read from one home.

**Safety, food, prosperity, magic availability and stores: 0 moves each.** Prosperity is the home and must not move, and it does not.

**(iv) The proof:** of the 158 towns with no hired force (no company, no charter hall), **0 records moved**. The comparison was the whole measured row: scores, gates, labels, services and stores.

**Alternative B (scratch 2: the hired rule plus the five gates on the home):** **91 of 360 defence labels move.**

| Before → after | Count |
|---|---|
| Defensible → Well-Defended | 23 |
| Well-Defended → Fortress | 17 |
| Lightly Defended → Vulnerable | 12 |
| Defensible → Lightly Defended | 10 |
| Lightly Defended → Defensible | 9 |
| Well-Defended → Defensible | 7 |
| Vulnerable → Undefended | 5 |
| Vulnerable → Lightly Defended | 5 |
| others | 3 |

By prosperity, the 91 are: Struggling 15, Poor 17, Moderate 17, Comfortable 26, Prosperous 16, Wealthy 0. Row scores move in 178 to 229 towns per row, up and down near evenly. Of the towns at a healthy economy today (economic output 50 or more), 11 change label. Safety, food, prosperity, magic and stores: 0 moves.

**Services, magic and stores by prosperity, today** (mean rows per place; the rule's after is not simulated):

| Prosperity | n | Healing | Equipment | Legal | Magic services | Stores (months) |
|---|---|---|---|---|---|---|
| Struggling | 42 | 4.4 | 8.9 | 7.4 | 0.5 | 4.7 |
| Poor | 57 | 5.0 | 10.2 | 7.8 | 0.5 | 5.2 |
| Moderate | 54 | 5.5 | 14.6 | 11.4 | 0.7 | 6.4 |
| Comfortable | 81 | 7.6 | 24.9 | 17.6 | 1.9 | 8.4 |
| Prosperous | 85 | 8.1 | 27.4 | 20.5 | 2.5 | 9.3 |
| Wealthy | 41 | 6.6 | 23.3 | 17.8 | 1.4 | 7.9 |

The counts already fall with prosperity, because poorer places are smaller and have fewer institutions. **Magic availability does not track wealth at all:** Struggling places are "pervasive" 6 times and "common" twice, and Wealthy places are "limited" twice. That is the family the owner's word most changes.

## (f) Three places in plain words (before → the hired rule → alternative B)

- **agree-village-40, a Poor village** with economic output 56 and a charter hall, but no guard. **Today:** its adventurers are paid in full, as if it were rich (military 37, monster 39, Vulnerable). **The hired rule:** the hall is worth what a Poor village can pay (military 31, monster 23, still Vulnerable). **B:** military 27, monster 23, Vulnerable.
- **agree-town-148, a Moderate town** with economic output 22, a watch and a charter hall. **Today:** every paid defence is cut to 0.78 by the economy figure (military 56, monster 68, Defensible). **The hired rule:** the hall is at the Moderate share, monster 65, and the label falls to Lightly Defended. **B:** the watch's wages read Moderate rather than 22 (military 62, monster 66, Defensible).
- **agree-city-17, a Wealthy city** with a garrison, a watch, a hired company and a charter hall. **Today, the hired rule and B:** unchanged (military 95, monster 100, Fortress). A wealthy place reads as it does today.

## (g) What it must not break

- **No new record key.** `keep` is a reader, and every line goes in fields that exist.
- **A place at a healthy economy reads as it does today wherever today's gates already say so.** With the hired rule alone this holds for every place without a hired force (proof (iv)) and for every Prosperous or Wealthy place with one (`keep` = 1). Places with a hired force below Prosperous move by design. Under B, 11 such places change label, because the two readers disagree there. That is the owner's to accept or refuse.
- **Prosperity does not move** (0 of 360 in both scratches).
- **The edge bundles, goldens and shift records** belong to the builder's lane and its merge seat.

## Seen while measuring (not this item; reported)

agree-village-45 is a Poor village whose only defence is a charter hall, and it scores military 97 today. The likely source (read in the code, NOT measured) is the slider term `milEffective × 0.35`, which `hasAnyDefense` grants a hired-only place as if it kept a standing force. Under the owner's principle, that term belongs to standing forces. The builder should measure it.

STOP: the chair rules on the home, on A or B, and on the shares, and decides who builds it.
