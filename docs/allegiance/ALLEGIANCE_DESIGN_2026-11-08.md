# ALLEGIANCE-DESIGN: the allegiance train on paper (2026-11-08)

Seat: ALLEGIANCE-DESIGN, an Opus 5.5 child of the cloud chair (session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's full delegation of 2026-11-06. This seat does design and measurement only. Branch `lane/allegiance-design-2026-11-08`, cut from `origin/lane/integration-2026-11-07` at `8308f13f8`. No product code changed. The only repository files touched are this document and the source-citation roster.

**What I read.** The owner's words and the chair's readings are in `docs/chair/2026-11-07/ODQ-934.105-DRAFT.md` on `origin/chair/handoff-2026-11-07`, from "THE OWNER'S IDEA (2026-11-08, ~03:3x UTC" to the end of the file. I also read `docs/OPERATING_STANDARD.md`, `docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md` and the car's records, which include the face census. On the veil branch I read `src/domain/people/cardVeil.js`, the veil lane's record and migration 206. The code is cited below as `path :: symbol`.

**The roster.** This document joined `tests/lint/.source-citation-baseline.json`, in `archivalExclusionAtFreeze.byRule.dated` (148 → 149) and the walker header. I measured it once, with `sh scripts/gate-tail.sh npx vitest run tests/lint/sourceCitationIntegrity.walker.test.js`:
- `dated` reads 149, which matches.
- The arm is still red on `tree`, 109 committed against 112 measured. The same run at the base `8308f13f8`, in a clean detached worktree, reads the same 109 → 112, so that red is the integration tip's, not this seat's. I left it to its owner (MERGE-WAVE).

**Reference conventions.** Every judgment the chair must rule on is marked **⚖ J-n**, and §11 lists them all. Every figure is marked **CONFIRMED** (measured by the scripts named in §0) or **PLAUSIBLE** (inferred, with the reason stated).

**The owner's governing principle** (verbatim): *"it's not predictability we are going for its plausibility with confidence and that makes sense."* It shapes three parts of this document:
- §5 sets bands, not predictions.
- §4 holds the hard rules (the invariants).
- §9 and the receipts carry the confidence.

---

## 0. The measurement: the baselines the bands are judged against

**Instrument.** Four scratch scripts, kept with this seat's scratchpad and not committed. They follow `docs/chair/2026-11-07/people-1/measure.mjs`:
- `measure.mjs`, `measure2.mjs` and `measure3.mjs` each birth the soak 1,000 through `scripts/audit/soak-review/corpus.mjs :: birth` (seeds `soak1k-0` to `soak1k-999`, 167 per tier and 166 for city and metropolis);
- `golden.mjs` births the golden 525.

The runs were on the integration tip `8308f13f8`, with 0 errors in 1,000. Every figure in this section is **CONFIRMED** unless it is marked otherwise.

**Two words used throughout:**
- A **crim house** is an institution that passes `src/domain/corruption.js :: isCriminalInstitution`.
- A **criminal power** is a `powerStructure.factions[]` row with `category === 'criminal'`, or a row whose name contains "thie". This is the test `src/generators/factionDynamics.js :: computeCriminalCaptureState` uses.

### 0.1 Criminal institutions and the criminal power (by tier)

| tier | towns | with a crim house | crim houses per town (median) | with a criminal power | of those, governing (Corrupt Council / Shadow Senate) | crim house but **no** criminal power | crim-house faces | of those, with **no membership at all** |
|---|---|---|---|---|---|---|---|---|
| thorp | 167 | 16 | 1 | 0 | 0 | 16 | 19 | 19 |
| hamlet | 167 | 11 | 1 | 0 | 0 | 11 | 12 | 12 |
| village | 167 | 12 | 1 | 2 | 0 | 11 | 12 | 11 |
| town | 167 | 65 | 2 | 46 | 23 | 31 | 193 | 54 |
| city | 166 | 136 | 4 | 61 | 11 | 75 | 811 | 147 |
| metropolis | 166 | 161 | 6 | 75 | 11 | 86 | 1,269 | 314 |
| **all** | 1,000 | **401** | — | **184** | **45** | **230** | 2,316 | 557 |

**Which houses.** Number of towns holding each criminal house:

| house | towns | house | towns |
|---|---|---|---|
| Front businesses | 264 | Contract killer | 67 |
| Smuggling network | 210 | Black market bazaar | 60 |
| Whisper market | 152 | Rookery | 50 |
| Multiple criminal factions | 130 | Street gang | 47 |
| Underground network | 118 | Smuggling operation | 32 |
| Black market | 109 | Thieves' guild chapter | 27 |
| Underground city | 89 | Fence (word of mouth) | 27 |
| Assassins' guild | 80 | Local fence | 12 |
| Thieves' guild (powerful) | 74 | trafficking, bandit, outlaw, kidnapping, waypoint | 6–8 each |

**Which criminal powers.** Number of towns holding each:

| criminal power | towns |
|---|---|
| Thieves' Guild | 175 |
| Corrupt Council (governing) | 23 |
| The Black Circle | 18 |
| Corrupt City Council (governing) | 11 |
| Shadow Senate (governing) | 11 |
| The Shadow Compact | 11 |
| The Hidden Hand | 9 |
| The Underground | 7 |

**Strength.** A criminal power's strength has a median of **15 points**. Strength is measured in points out of 100: every town's powers sum to 100 (`factionDynamics.js :: renormTo100`).

**Ranked faces.** In the 175 towns with a non-governing criminal power, the power ranks 3 faces in 156 towns, 2 in 8, 1 in 8 and none in 3.

> **Finding 0.1, the shape the design must meet.** 230 of the 401 towns with a crim house (57%) have **no criminal power**. 557 crim-house faces in the 1,000 belong to no power at all. A "hidden membership in the criminal power" therefore has no power to point at in most of the places where corruption happens: 305 of the 1,158 non-criminal agents (§0.2) live in such towns. This drives **J-1**.

### 0.2 Today's corruption (the `corrupt` mark)

The writer is `src/generators/steps/corruptionPass.js :: registerStep('corruptionPass')`. The gate has two conditions: the town must have a criminal institution (`readCorruptionClimate(...).hasCriminalInst`) and the card must carry a corruptible flaw (`npcCorruptibleFlaw`). The chance is one draw per card at `p = spawnCorruptionChance({ crime, security, prosperity })`:

```
p = 0.10 + crime·0.35 − security·0.20 − prosperity·0.15, clamped to [0.02, 0.60]
```

The constants are `CORRUPTION_TUNING.spawn`.

**Rate by tier** (towns with a crim house):

| tier | eligible (flaw) | corrupt | corrupt ÷ eligible | corrupt ÷ cards | towns with ≥ 1 | p (median) | corrupt in the ruling three | corrupt lord |
|---|---|---|---|---|---|---|---|---|
| thorp | 17 | 0 | 0% | 0% | 0 | 0.221 | 0 | 0 |
| hamlet | 24 | 5 | 20.8% | 8.1% | 4 | 0.282 | 5 | 3 |
| village | 43 | 8 | 18.6% | 5.4% | 3 | 0.170 | 2 | 0 |
| town | 545 | 120 | 22.0% | 6.6% | 46 | 0.271 | 15 | 3 |
| city | 2,582 | 466 | 18.0% | 5.7% | 99 | 0.168 | 28 | 16 |
| metropolis | 3,898 | 680 | 17.4% | 5.4% | 127 | 0.148 | 18 | 7 |

**Totals.** 1,310 corrupt cards in all. 31 of them are in 15 towns that have **no crim house on the roster**. These pass the gate through `safetyProfile.criminalInstitutions`, the second arm of `readCorruptionClimate` (see J-4).

**Rate by climate** (corrupt ÷ eligible, towns with a crim house):

| input | low | mid | high |
|---|---|---|---|
| crime | 2.9% | 13.5% | 31.4% |
| security | 27.8% | 11.9% | 3.0% |
| prosperity | 23.0% | 17.6% | 3.9% |

The bands are below 0.33, 0.33–0.66, and above 0.66.

**Rate by the criminal slider** (`priorityCriminal`):

| slider | towns | with a crim house | with a criminal power | corrupt cards | corrupt ÷ eligible | capture state ≠ none |
|---|---|---|---|---|---|---|
| 0–19 | 200 | 52 | 0 | 28 | 2.5% | 0 |
| 20–39 | 195 | 64 | 6 | 81 | 6.3% | 10 |
| 40–59 | 222 | 96 | 41 | 314 | 18.3% | 66 |
| 60–79 | 196 | 88 | 59 | 363 | 25.9% | 78 |
| 80–100 | 187 | 101 | 78 | 493 | 31.5% | 95 |

**Vectors and flaws.**
- Vectors: greed 621, fear 308, forbidden_patron 292, hunger_for_status 89. **`fanaticism` occurs 0 times.** It cannot be reached: no flaw in `corruption.js :: FLAW_VECTOR` maps to it, although `corruptionPass.js :: CORRUPT_SHORT_GOAL` has a line for it.
- Flaws: the 13 that fired run evenly from 89 to 115 each.
- `vector null`: 0. The PEOPLE-1 §5 defect, a vector read from the old role words, is not present at this tip.

**Who is corrupt.**
- By importance: minor 965, pillar 128, key 112, notable 105.
- By the card's institution: house 1,308, a minted face 2.
- The 1,195 corrupt cards that are not crim-house faces, by shelf: Crafts 466, Economy 313, Entertainment 90, Defense 72, Religious 69, Adventuring 63, Infrastructure 48, Government 36, Magic 25, Exotic 11.
- Ranked in a legitimate (non-criminal) power: rank 1 107, rank 2 91, rank 3 83.
- In the governing power's ranked three: 71. **The lord: 31.**
- Law-house faces (§0.6): 64.

> **Finding 0.2, the gate the owner remembers is not in the code.** The owner said "only certain personality types that are not already in a criminal institution can become compromised". The pass has **no** such exclusion. Of the 1,583 crim-house faces, 526 carry a corruptible flaw, and **115 are stamped `corrupt`**, tied by `corruptTies` to a criminal house, sometimes their own. Car 1 adds the exclusion (J-3).

### 0.3 The rank deal's outcomes

The deal is `src/generators/people/castPowers.js :: assignCastPowers`. Ranked faces per power, all powers:

| tier | powers | 0 ranked | 1 | 2 | 3 | the governing power: 1 / 2 / 3 ranked |
|---|---|---|---|---|---|---|
| thorp | 186 | 15 | 86 | 80 | 5 | 82 / 80 / 5 |
| hamlet | 216 | 20 | 56 | 46 | 94 | 37 / 42 / 88 |
| village | 398 | 26 | 120 | 61 | 191 | 0 / 11 / 156 |
| town | 641 | 15 | 127 | 83 | 416 | 0 / 0 / 167 |
| city | 999 | 25 | 115 | 94 | 765 | 0 / 0 / 166 |
| metropolis | 1,192 | 9 | 119 | 79 | 985 | 0 / 0 / 166 |

### 0.4 Patronage's reach (the ruling three's other memberships)

**Who has a second membership.** Ruling-three faces holding at least one other membership, by tier: thorp 0 of 257, hamlet 8 of 385, village 16 of 490, town 71 of 501, city 104 of 498, metropolis 109 of 498. That is **308** in all, with 309 other memberships. Their categories by rank:

| ruling rank | other memberships, by category |
|---|---|
| rank 1 (the lord) | economy 109, noble 76 |
| rank 2 | economy 7, military 1 |
| rank 3 | military 55, economy 34, religious 14, noble 6, magic 5, criminal 2 |

**Share in the other power.** Median 0.5. 226 of 309 are at or above 0.5, and 17 are below 0.34.

**A simulated boost** at the chair's starting points: 15%, 10% and 5% of the other power's strength by rank, scaled by share, with no cap.
- Reach: 265 towns touched and 297 powers boosted.
- Size: median boost **0.99 points**, maximum 6.75. Relative to the boosted power's base, median **7.5%**.
- Against the ruler: 95 boosted powers end above the ruler. **80 of the 95 were already above the ruler at birth.** Only 15 would be pushed past it by the boost.

> **Finding 0.4, "no boosted power passes its ruler" is not the same as "no power out-weighs its ruler".** In **436 of the 1,000 towns** some power already out-weighs the governing power at birth. That is the generator's own picture: a ruler holding the title while the garrison holds the decisions (W3's "Holds the title; the decisions that matter are made by {rival}"). The governing power's median strength is thorp 100, hamlet 100, village 39, town 28, city 23, metropolis 22. The governing category is government in 591 towns, economy 172, religious 83, criminal 45, military 37, magic 30, other 27, noble 15. This drives **J-9**.

### 0.5 The hall-capture state today

The writer is `factionDynamics.js :: computeCriminalCaptureState`, a deterministic threshold classifier with no roll. It runs in `generatePower` and is re-projected in `powerEconomyReconcilePass`.

| tier | none | adversarial | equilibrium | corrupted | capture |
|---|---|---|---|---|---|
| thorp | 167 | 0 | 0 | 0 | 0 |
| hamlet | 165 | 1 | 1 | 0 | 0 |
| village | 159 | 1 | 4 | 3 | 0 |
| town | 113 | 6 | 20 | 25 | 3 |
| city | 79 | 38 | 26 | 23 | 0 |
| metropolis | 68 | 48 | 30 | 19 | 1 |

**Agreement with today's agents.** The table below crosses each town's state with whether a corrupt card sits in the ruling three:

| state | an agent in the ruling three | no agent |
|---|---|---|
| none | 11 | 740 |
| adversarial | 18 | 76 |
| equilibrium | 17 | 64 |
| corrupted | 18 | 52 |
| capture | **0** | 4 |

**The 45 criminal-governed towns** read: corrupted 38, capture 3, none 2, equilibrium 1, adversarial 1.

**Agents in the ruling three by organized-crime level** (criminalEffective ÷ 100, CONFIRMED). "Agent" here means a corrupt card that is not a crim-house face.

| level | towns | with a crim house | with an agent in the ruling three | with an agent lord |
|---|---|---|---|---|
| 0–0.2 | 300 | 47 | 0 | 0 |
| 0.2–0.4 | 276 | 89 | 4 | 1 |
| 0.4–0.6 | 187 | 77 | 12 | 5 |
| 0.6–0.8 | 122 | 80 | 17 | 10 |
| 0.8 and up | 115 | 108 | 31 | 15 |

> **Finding 0.5, the two sources contradict today.** All 4 'capture' towns have no agent in the three, and 11 towns with an agent in the three read 'none'. That is the contradiction the chair's ONE SOURCE ruling foresaw.

### 0.6 Law enforcement

Law faces are faces whose house family matches `/militia|watch|barracks|garrison|citadel|warden|prison/`. In the face census these are:
- Barracks → the garrison commander (372)
- Citizen militia → the watch commander (332) · the watch captain (167) · the militia captain (115)
- Small prison/stocks → the prison warden (264) · the gaoler (29)
- Citadel → the castellan (257)
- Village watch → the watch sergeant (14)
- Warden's Lodge → the warden (13)

| tier | law faces | per town (median) | towns with ≥ 1 | towns with ≥ 1 law face and a crim-house face | corrupt law faces |
|---|---|---|---|---|---|
| thorp | 0 | 0 | 0 | 0 | 0 |
| hamlet | 60 | 0 | 60 | 5 | 1 |
| village | 69 | 0 | 66 | 5 | 0 |
| town | 265 | 1 | 167 | 65 | 5 |
| city | 549 | 3 | 166 | 136 | 21 |
| metropolis | 620 | 4 | 166 | 161 | 37 |

**Their memberships.** Law faces' powers by category: military 1,197, government 519, economy 392, **criminal 86**, religious 85, magic 69, noble 25, other 25. The 86 criminal memberships are PLAUSIBLY the watch and prison houses whose government share lands on a criminal **governing** power (a Corrupt Council's watch).

### 0.7 Goals

The writer is `npcGenerator.js :: generateNPCGoal`. It draws through `NPC_FACTION_GOALS`: 26 roles, 54 rows, 54 short and 54 long lines, with 0 slots. The pool map `people/poolMap.js` maps 191 titles; **156 of them fall back** to a category pool (agent C's count of `POOL_BY_TITLE`).

> **Finding 0.7, half the cast has no goal.** **15,664 of 29,020 cards (54.0%) hold `goal: null`.** The share grows with tier: thorp 0.0%, hamlet 3.6%, village 21.3%, town 37.6%, city 57.4%, metropolis 64.3%.
>
> **The cause** is the roster-wide refusal of held goals: REVIEW-INTAKE-4 with MERGE-R2. In `npcGenerator.js :: generateNPCGoal`'s own header: "pool exhausted answers null, a figure without a goal". The refusal works: **0 within-town duplicates** among the 13,356 goals that exist. But the pools are a few hundred lines for a cast of tens.

**Across towns.**
- 309 distinct short lines among the 13,356 goals.
- The ten most-used lines carry 33.8% of all goals.
- One line recurs in up to 115 (thorp) to 160 (metropolis) towns of its tier.
- Cards per distinct short line: thorp 7.8, hamlet 6.6, village 9.9, town 14.4, city 19.5, metropolis 21.5.
- The corruption pass's rewritten short goals print on **322** of the 1,310 corrupt cards. The rest are refused as held, or the card had no goal.

**What the record can support** for the goal families of §6, as a share of cards:

| tier | its house processes a chain | that chain's status is not 'running' | house has a trade dependency | in a power with a tense / competitive / corrupted relation | has an outgoing tie | ranked in some power | has a flaw |
|---|---|---|---|---|---|---|---|
| thorp | 6.1% | 6.1% | 0% | 10.0% | 73.9% | 93.2% | 70.0% |
| hamlet | 28.1% | 18.9% | 12.4% | 11.3% | 94.9% | 69.9% | 68.2% |
| village | 34.7% | 23.1% | 2.9% | 48.6% | 100% | 50.9% | 70.1% |
| town | 41.2% | 33.9% | 22.0% | 61.9% | 100% | 35.3% | 71.0% |
| city | 43.9% | 36.8% | 20.3% | 60.5% | 100% | 26.8% | 71.7% |
| metropolis | 41.1% | 37.2% | 22.1% | 59.0% | 100% | 24.4% | 69.8% |

Notes on the table:
- The status column counts operational, vulnerable, impaired and entrepot.
- The relation column also counts subordinate or dependent ties: these are the relation types `factionRelationships` uses, with competitive 334, tense 573 and corrupted 91 across the 1,000.
- The isolation receipt `isolationSupport` applies in 166 towns. The 1,000's statuses are connected 834, viable 62, untenable 66, precarious 19, magic-dependent 11, resilient 7, magic-supported 1.

### 0.8 The handler supply

There are 291 towns where at least one corrupt card is not a crim-house face.
- In 276 of them a crim-house face exists to handle it. The median is one agent per crim-house face, and the worst town has 3.
- 15 towns have none: town 6, city 7, metropolis 2. These are exactly the 15 towns of the second gate arm (§0.2).
- In 163 of the 291 towns some criminal-power member exists. In the other 128 the handler would have to be a crim-house face that belongs to no power.

### 0.9 The golden 525

The run was through `tests/helpers/goldenMasterCorpus.js :: goldenCorpus`, recorded in the scratchpad `m/golden.out`, CONFIRMED:
- **258 of 525** settlements hold a crim house;
- 168 hold a criminal power;
- **181** hold at least one corrupt card, **375** corrupt cards in all;
- **258** carry the `corrupt` boolean on their cards.

A golden row moves under car 1 wherever the corruption pass runs at all. The pass stamps `corrupt: false` on every card of a crim-house town, and the field leaves the card, so **at least 258 of 525 rows move** (a floor, CONFIRMED). The fence 360 has not been measured (PLAUSIBLY a similar share).

---

## 1. The building blocks

### 1.1 The membership (unchanged)

The membership is `{ power, rank: 1|2|3|null, share }`.
- **Writer:** `castPowers.js :: assignCastPowers`, through `join`.
- **Readers:** `src/domain/people/membership.js` (`membershipsOf`, `rankIn`, `powersByRankOf`, `firstRankMembershipOf`).
- **Keying:** keyed by `power`, the display name, in `src/domain/edit/recordRegister.js` KEYED_COLLECTIONS.
- **Veil:** the veil branch adds `veiled: boolean`, stamped at birth by `cardVeil.js :: stampMembershipsVeil`. A membership of a hidden or criminal power is veiled (`isVeiledPower`).
- **Shares:** they sum to 1 over a card's landed backs. 3 of 2,145 cards differ, where a share lapsed (agent B, 48 seeds).

### 1.2 The hidden allegiance: ONE field, `allegiance`

**⚖ J-1 (the shape; recommended: a field of its own, not a membership row).** The chair's reading added "a veiled membership in the criminal power (a small share, rank none)". The measurement says a membership row cannot carry the allegiance alone, for five reasons:

1. **No power to point at.** 230 of the 401 crim-house towns have no criminal power, and 305 of the 1,158 non-criminal agents live there (Finding 0.1). A membership is keyed by `power`. A row with `power: null` breaks the register's KEYED_COLLECTIONS key, `membershipsOf` and every rename cascade (`factionRename.js` cascades `memberships[].power`).
2. **The share sum.** A "small share" breaks the sum-to-1 of the open memberships, which the rank deal's weight (`share × house weight`) and the card line's reading assume.
3. **The tie draw.** `ties.js :: drawTies` triples the target weight on ANY shared membership (`sharesPower`, `SHARED_POWER_FACTOR = 3`). A hidden row would make every criminal face three times likelier to draw a tie to the agent. Ties are public, so the pattern would leak.
4. **The card line.** `domain/people/cardPowers.js` prints every membership ("first of X · member of Y"). Each such reader would need a hidden-row filter.
5. **The handler is part of the allegiance.** The chair's ruling makes the allegiance, its reason (the vector) and its handler ONE unit. A membership row holds none of them.

**Recommendation.** One field per card, `allegiance`, absent on a clean card:

```
allegiance: {
  power:   "<criminal power name>" | null,   // the independent criminal power when one exists (§2 rule A2), else null
  house:   "<criminal house key>",           // the criminal house the allegiance runs to — always set (rule A2)
  vector:  'greed' | 'hunger_for_status' | 'fear' | 'forbidden_patron' | 'fanaticism',
  via:     'office' | 'front' | 'retainer',  // what the card brings the guild (§1.4)
  handler: "<card id>",                      // exactly one (§1.5)
  share:   0.15,                             // ALLEGIANCE_TUNING.share — the weight patronage and the push read; NOT in the open shares' sum
  veiled:  true,  covert: true,              // the two veil marks, both: the card veil's bit and the value-level covert drop (§8)
}
```

**One reader**, `src/domain/people/allegiance.js :: allegianceOf(card)`. It returns the record, or null for a card born clean, a DM card or a malformed record. It sits beside `membership.js`, and a membership-shaped view, `hiddenMembershipOf(card) → { power, rank: null, share, hidden: true } | null`, lets patronage and the push read memberships and allegiance through one loop.

**What does not change.** No reader of `memberships` changes. The DM's Power tab lists hidden members of a power by calling `allegianceOf`.

*Alternative B (the chair's reading, literally):* a `memberships` row `{ power, rank: null, share: 0, hidden: true }` where a criminal power exists, plus `allegiance` for the house, the vector and the handler. That makes two shapes and two sources, and it still needs the field in 230 towns. *Alternative C:* mint a criminal power wherever criminal houses stand without one. That changes the power structure, and so the 100-sum, the doubled-niche deal and the conflicts, in 230 towns; it is outside this train. Neither is recommended.

### 1.3 The gate and the chance (car 1's roll)

The pass keeps its gate, chance, vector, goal and receipt, as the chair ruled.
- **Gate:** the card carries a corruptible flaw (`corruption.js :: npcCorruptibleFlaw`), **and** the card is not a crim-house face (new, J-3), **and** the town has a crim house **on its roster** (J-4).
- **Chance:** `p = spawnCorruptionChance(climate) + organizedCrime(settlement) × ALLEGIANCE_TUNING.organizedCrime`, clamped to the same `[min, max]` (J-5).
- **Vector:** `corruptionVectorForFlaw(flaw)`, unchanged. Fanaticism stays unreachable unless J-6 adds a flaw.
- **Receipt:** today's trace, plus the house, the handler, the front mark and the chance's terms.

**⚖ J-3 (the exclusion; recommended: add it).** A crim-house face is an open member. It holds no hidden allegiance, and it is the handler pool. Removing the 115 corrupt crim-house faces is a CONFIRMED move.

**⚖ J-4 (the second gate arm; recommended: require a crim house on the roster).** `readCorruptionClimate` also opens the gate when `safetyProfile.criminalInstitutions` is non-empty while no criminal institution stands on the roster. In 15 towns this corrupts 31 cards with **no criminal face** to handle them, so they could carry no handler and no front. Recommended: the allegiance roll requires a crim house on the roster, so those 31 cards are born clean. The simulation's onset, which reads the same climate, is untouched.

**⚖ J-5 (organized crime's meaning; recommended: organization, not volume).** The climate's `crime` term already is `criminalEffective ÷ 100`: the amount of crime. An "organized crime" dial that re-reads `criminalEffective` would double-count it. Recommended: organized crime measures ORGANIZATION.

```
organizedCrime = n01( Σ over crim houses of backing weight (institutionBacking.js :: backingRowFor(name).weight, 0 → 0.5)  ÷  ALLEGIANCE_TUNING.organizedFull )
               + ALLEGIANCE_TUNING.powerBonus  when an independent criminal power stands
```

The terms read as follows:
- **The house-weight sum.** One fence weighs 1. Assassins, the Thieves' guild chapter, the Underground city and the Smuggling network weigh 3 each. A metropolis with six criminal houses reaches the full value at the starting `organizedFull = 8`.
- **`powerBonus`** starts at 0.25.
- **The cap.** The result is clamped to [0, 1].
- **The weight on the chance.** It starts at `ALLEGIANCE_TUNING.organizedCrime = 0.10`. That is a third of the crime term's weight, so the corruption ÷ eligible rate in an organized city rises by at most ten points before the clamp.

The same `organizedCrime` feeds the push (§3) and the law's pursuit (§6.7).

**⚖ J-6 (fanaticism; recommended: leave it unreachable at birth).** The vector map gives `fanaticism` to no flaw (0 of 1,310). It is the simulation's vector (W-LIVES drift: `npcCorruptibleVector`'s drifted door). The CAUSE tie kind (§1.5) is specified for it so that a later drift or a DM's imposition has a kind, but birth does not mint it. Making it reachable means adding a flaw such as 'zealous' to `FLAW_VECTOR`, which is the owner's vocabulary.

### 1.4 The front mark (registry), and `via`

**What a front is.** A FRONT is a legitimate house whose face carries the hidden allegiance and whose trade can carry the guild's business: launder its coin, move its goods, house its people. The front mark is a registry-only mark on a family's `shared` block, like `face` and `noPower` (`src/data/institutionalCatalog.js`, read through a new `isFrontCapableInstitution`). It is never on a row or a save.

**How `via` is derived.** It is set draw-free from the agent card's house:

| `via` | when | what the card brings the guild |
|---|---|---|
| `office` | the house is an office (shelves Government, Defense, Religious, Magic, Infrastructure, or the seat or a minted face) | protection, blind eyes, decisions |
| `front` | the house's family is front-capable (table below) | a place for the money and the goods |
| `retainer` | any other house (a craft with no front mark, an adventuring hall, an exotic) | information, small favours |

**⚖ J-7 (which families can front; for the chair's ruling, a proposed table by trade).** There are three classes:
- **PRIME** front-capable: cash moves, goods move, strangers come and go.
- **FRONT** front-capable: materials flow through the house, so goods can hide.
- Everything else **no**.

| class | families (catalog family names, as they print on the 1,000) | why |
|---|---|---|
| PRIME | Inns and taverns (district) · Coaching inn · Caravanserai · Warehouse district · Stable district · Money changers · Pawnbroker (already 0.3 criminal) · Luxury goods quarter · Brewery · Vintner · Public bathhouse · Theaters · Fish market · Mills (2-5) · Merchant guilds (3-8) / Merchant guilds (15-40) · Caravan masters' exchange · Toll bridge (when it is a private house) | the classic covers: drink, travel, storage, cash and crowds |
| FRONT | Tanner · Dyer · Chandler · Cooper · Ropemaker · Butchers (3-8) · Bakers (5-15) · Smelter · Sawmill (commercial) · Carpenters (5-15) · Glassmakers · Furrier's district · Charcoal burner · Brickmaker · Potter · Weavers/Textile workers · Tailor's guild · Cobbler's guild · Specialized metalworkers · Blacksmiths (3-10) · Craft guilds (5-15) / (30-80) · Dungeon delving supply district · Beast trainers | materials come in and goods go out, so something extra can travel with them |
| no | every Government, Defense, Religious, Magic, Infrastructure, Adventuring and Exotic shelf family; the criminal families themselves (a criminal house is an open criminal house, not a front); "Front businesses" (already a criminal house: its face, "the front man", is an OPEN member, the handler pool) | an office is corrupted, not used as a front; a criminal house is open |

The table covers every Crafts, Economy and Entertainment family that showed in §0.1's crim-house towns. A family it does not name defaults to **no** and is listed by the car's walker for the chair.

**⚖ J-8 (does the front class weight the roll?; recommended: no in car 1).** The owner asked to "randomly choose amongst the NPC and/or legitimate business". Today's roll is uniform over flawed cards, and 466 of 1,195 agents already land in Crafts houses. Car 1 classifies only, so its plausibility band can be compared one for one with §0.2's baseline. A PRIME-front weight (the roll × 1.25) is a dial reserved by name, `ALLEGIANCE_TUNING.frontWeight = 1`, that the chair can raise after the car 1 measurement.

### 1.5 The handler tie

**One handler.** Every allegiance has exactly ONE handler: a real criminal face. It is drawn by the one tie writer, `ties.js :: drawTies`, with the handler as a forced target. This extends the mechanism that already forces an `other` mint's tie to the seat (`ties.js :: isOtherMint` / `forced`). There is no second tie system.

**Direction and the one-out rule.** The tie is FROM the agent TO the handler, so it is the agent's one outgoing tie. The handler collects incoming ties, which the owner's rule allows ("if called by two or more … could have multiple relationships"). The other direction would spend the handler's single outgoing tie on one agent, and it fails when a handler has two agents (up to 3 per face, §0.8).

**The handler pool.** The pool is the town's criminal faces:
1. members of the allegiance's `power` when one is named;
2. else the faces of crim houses.

The pick is **draw-free**, so the save migration (§7) and birth pick the same handler:
- Order the agents by standing: their best rank in any power (1 < 2 < 3 < none), then importance (pillar > key > notable > minor), then roster order.
- Order the handlers: the criminal power's rank 2, then its rank 3, then its other members, then the crim-house faces by house weight descending, then roster order. **The rank-1 face (the boss) handles only when no one else can.** The chair's "the guild's second handles the councilman".
- Deal agents to handlers in order. The first agent goes to the first handler, and so on; when agents outnumber handlers, the remainder goes to the LAST handler, the lesser members, by the "a lesser member the tavern" reading. ⚖ J-10, the dealing rule. [AMENDED BY CAUSE, ALLEGIANCE-CAR3, the chair's ruling of 2026-11-08: "the remainder to the last" piled up to ten agents on one handler beside five with one each on the soak 1,000 (32 towns above 4), which fails the owner's law of plausibility; the deal now goes ROUND the pool — the first agent to the first handler, and so on, then round again — so no handler of a pool carries more than ceil(agents / handlers). The order of the pool, the agents' standing order and the boss-last rule are unchanged; the deal stays draw-free (`allegiance.js :: assignHandlers`). Boss-last in its fallback sense (the chair's ruling, the same day): the boss joins the round ONLY when every other handler would otherwise carry more than `ALLEGIANCE_TUNING.bossJoinsAbove` (4) agents — one town of the 1,000 (soak1k-537).]

**The tie's kind** follows the vector already on the card and is never re-rolled. Each kind is a new archetype in `generators/power/relationshipArchetypes.js`, mapped onto an existing `RELATIONSHIP_STRENGTHS` type so every surface that styles a type keeps working:

| vector | handler tie kind (archetype key) | the existing type it styles as | label (for the writing seat) |
|---|---|---|---|
| greed | `handler_partnership` | `patron_client` | "Silent Partnership" |
| hunger_for_status | `handler_partnership` | `patron_client` | "Silent Partnership" |
| fear | `handler_leverage` (a debt · a secret · a past crime · someone loved: one of four sub-kinds, drawn on the agent's tie fork) | `debtor_creditor` | "Held Over Them" |
| forbidden_patron | `handler_patron` | `patron_client` | "The Patron No One Names" |
| fanaticism | `handler_cause` | `ally` | "Sworn to the Cause" |

**The tie record** is today's record plus `covert: true` and `handler: true`. `covert: true` is what drops it from every public projection (§8). A DM-locked or DM-authored outgoing tie on the agent wins: the handler is still recorded on `allegiance.handler`, and the DM view shows it.

### 1.6 The targeted goal (car 4)

A goal that names a person or a power carries a **target** beside its text: `goal.intent.{short,long} = { family, key, target: { kind: 'npc'|'power'|'house'|'chain', id } }` (§6.9). The targeted goals this train adds come in three sets:
- the law's WARRANT and SUSPICION;
- the handler's keep-in-line and the agent's serve-or-escape;
- the rank, rival-power and tie families.

---

## 2. The pass order: one forward pass at birth

**Where things sit today.** The order below is from `src/generators/pipeline.js :: getStepOrder`, as agent A ran it:

```
19 generatePopulation   deps ['coherenceRepairPass','powerEconomyReconcilePass']          — people/representatives.js :: generateRepresentatives births the cards (and their goals: generateSingleNPC)
20 corruptionPass       deps ['generatePopulation','economyReconcilePass']                — stamps corrupt / vector / corruptTies / goal.short, in place
21 generateNarratives   deps ['generatePopulation','economyReconcilePass']
22 assembleSettlement   deps ['generateNarratives','generatePopulation','corruptionPass','structuralValidationPass']
     └ narrativeGenerator.js :: generateCoherence → enrichNpcCoherence → castPowers.js :: assignCastPowers (memberships, ranks, importance)
       → npcStructure.js :: enrichNPCsWithStructure → people/ties.js :: drawTies (the seam) → late ties (people-ties-late) …
23 resolveCrisisCast    deps ['assembleSettlement']
```

The capture state is computed earlier, in `12 generatePower` (`rulingStructure.js :: generatePowerStructure` → `computeCriminalCaptureState`), and re-projected in `17 powerEconomyReconcilePass` (`economyReconciliation.js`).

> **The ordering fact the design turns on.** People modules are not registered steps. Memberships, ranks and ties are written INSIDE `assembleSettlement`, after the corruption pass has run. The corruption pass can therefore never read a card's power. The push needs the allegiance BEFORE the ranks. The handler needs the agent's and the guild's ranks AFTER them.

**The new order.** Everything happens inside `assembleSettlement :: generateCoherence → enrichNpcCoherence`, one forward pass with no loop:

| # | step | inputs | output (its ONE writer) | car |
|---|---|---|---|---|
| A1 | **land** — `castPowers.js :: landMemberships` (the first half of today's `assignCastPowers`, split, no behaviour change) | cards, `houseBacksOf` after `dealDoubledNiches`, powers | `memberships[]` with `rank: null` | 1 |
| A2 | **allegiance** — `people/allegiance.js :: dealAllegiances` | cards, institutions, powers, `economicState` (the climate, reconciled), the front mark | `card.allegiance` (no handler yet); the trace | 1 |
| A3 | **rank deal, with the guild's push** — `castPowers.js :: rankPowers` (the second half) | memberships, `allegiance` (push), FLOOR 1, FLOOR 2 | `memberships[].rank`, `importance` | 1 (split), 2 (push) |
| A4 | **handlers** — `allegiance.js :: assignHandlers` (draw-free) | allegiances, ranks, importance | `allegiance.handler` | 1 |
| A5 | the structure — `npcStructure.js :: enrichNPCsWithStructure` (unchanged) | | `structuralRank` | — |
| A6 | **the hall-capture state, DERIVED** — `domain/people/hallCapture.js :: hallCaptureOf` | ranks, allegiances, criminal powers, `safetyRatio` | `powerStructure.criminalCaptureState` (+ the governing row's `captureState`) | 2 |
| A7 | **ties** — `ties.js :: drawTies` (the agent's tie forced to its handler) | cards, `allegiance.handler`, `allegiance.vector` | `relationships[]` (the handler ties `covert`) | 1 |
| A8 | **patronage** — `domain/people/patronage.js :: patronageOf` (pure, derived, never stored, §3.3) | final ranks, memberships, allegiances, powers | (nothing stored) | 3 |
| A9 | **goals** — `people/goals.js :: dealGoals` (moved here from birth) | everything above, the chains, the isolation receipt | `goal` text + `goal.intent` | 4 |

Notes on the table:

- **Forks.** A2 rolls each card on its own keyed fork, `people-allegiance::<card id>`, under the coherence stream (the people car's precedent: `people-faces::<id>`, `people-ties::<id>`). Removing one card never moves another card's roll. The old `corruptionPass` step stream (one sequential `rng.fork('corruptionPass')`) retires. ⚖ **J-2: retire the registered step `corruptionPass`.** Its `registerStep` and the `assembleSettlement` dep on it go, and the fork census re-derives. Car 1 removes the step; it is not left as an empty step.
- **Regeneration.** `enrichNpcCoherence` is also the regeneration path (`generateSettlementPipeline.js :: regenNPCsPipeline`). Today regen never runs the corruption pass (agent A, PLAUSIBLE from the code). After car 1 a regenerated cast deals its allegiances like a fresh birth: a consistency the old step lacked.
- **Goals.** A9 moves the goal draw out of `generateSingleNPC` (step 19) to the end of the seam. Families bind facts that do not exist at step 19: ranks, ties, allegiance, rivals. This is car 4's largest single move (§10). The stress overrides (`npcGenerator.js :: STRESS_GOAL_OVERRIDES`, inside the enrichment loop) become the CRISIS family at A9.
- **The seat.** FLOOR 1 (the seat's face first in the governing power) is not touched by the push. The lord is an agent only when the lord's own A2 roll made it one (CONFIRMED today: 31 lords in 1,000).
- **What moves in the step graph.** `corruptionPass` leaves (J-2). `assembleSettlement`'s `deps` lose it. `generatePower` no longer writes the capture state at birth; its value is overwritten at A6, or the classifier becomes an input to A6 (§3.4 keeps it as the "climate rung"). `economyReconciliation.js`'s re-projection of `criminalCaptureState` becomes a pass-through, because A6 runs after it.

---

## 3. The dials: every number, with its unit, home and register path

The register is `tests/lint/.tuning-register.json`. Its rows are keyed `"<file>#<EXPORT>"`, born `{ role: null, status: 'draft', signedAt: null, unit, band: null, note }`, with units all-or-none per table from the vocabulary (`probability`, `fraction01`, `multiplier`, `points`, `share`, `rank`, `count`, …). The refreeze runs through `tests/lint/tuningRegister.walker.test.js`:

```
TUNING_INVENTORY_REFREEZE='<seat>' TUNING_INVENTORY_NOTE='<why>' npx vitest run tests/lint/tuningRegister.walker.test.js
```

**Every new number lives inside a frozen `*_TUNING` table.** A module-level named constant such as `PRESSURE_MULT_MAX` counts as P2 "unregistered named" (`corruption.js` already holds 1, shrink-only) and would red the walker. Signing stays the owner's.

### 3.1 `ALLEGIANCE_TUNING`: car 1, home `src/domain/people/allegiance.js` (new; a draft row)

| leaf | unit | start | what |
|---|---|---|---|
| `organizedCrime` | probability | 0.10 | organized crime's weight on the birth chance (added to `spawnCorruptionChance`'s sum before its clamp; J-5) |
| `organizedFull` | points | 8 | the summed criminal-house backing weight at which organized crime reads 1 |
| `powerBonus` | fraction01 | 0.25 | organized crime's step when an independent criminal power stands |
| `share` | share | 0.15 | the allegiance's weight for patronage and the push (outside the open shares' sum) |
| `frontWeight` | multiplier | 1 | a PRIME front's roll weight (reserved; J-8) |

The birth chance itself stays `corruption.js :: CORRUPTION_TUNING.spawn`, signed by nobody yet and unchanged.

### 3.2 `GUILD_PUSH_TUNING`: car 2, home `src/generators/people/castPowers.js` (beside `CAST_POWERS_TUNING`; a draft row)

The push is a multiplier on an agent's roll weight in the rank deal of each of its LEGITIMATE powers. It is written in the corruption module's pressure-cap style, as a sum with a final clamp:

```
push(card) = clamp( 1 + strength·n01(criminalStrength ÷ strengthFull) + organized·organizedCrime , 1, max )
weight     = rollWeightOf(share, houseWeight) × push(card)        // castPowers.js :: rankPowers, the one draw line
```

| leaf | unit | start | what |
|---|---|---|---|
| `strength` | multiplier | 0.6 | the criminal power's pull (its strength ÷ `strengthFull`) |
| `strengthFull` | points | 30 | the strength at which the pull is full (median criminal power 15 points, §0.1) |
| `organized` | multiplier | 0.4 | organized crime's pull |
| `max` | multiplier | 2.0 | the cap (the same 2.0 as `corruption.js`'s pressure cap) |

Where no criminal power stands, `criminalStrength` is 0, so the push is `1 + 0.4·organizedCrime`, at most 1.4.

**⚖ J-11 (the push and FLOOR 2; recommended: the push never moves a floor).** FLOOR 1 (the seat) and FLOOR 2 (a power's landmark, the highest-weight house whose largest share lands on it) sort on raw house weight, not the roll weight. The push reaches only the weighted roll, so for the governing power only rank 3 can move, and for every other power ranks 2 and 3. That is the owner's "It may not get them to the top three … it simply depends on the ranks after the maths".

### 3.3 `RULING_PATRONAGE_TUNING`: car 3, home `src/domain/people/patronage.js` (new; a draft row)

The name `PATRONAGE_TUNING` is taken: `corruption.js :: PATRONAGE_TUNING` is the security drag of a bought watch. ⚖ **J-12: the name `RULING_PATRONAGE_TUNING`.**

```
boost(P) = Σ over the ruling power's ranked three f, over f's memberships m in P ≠ ruler:   byRank[f's rank in the ruler] × m.share × base(P)
          (+ the same with allegiance.share for f's hidden allegiance in P)                 — the boost of a hidden power is DM-only (§8)
effective(P) = base(P) + min( boost(P), cap·base(P), max(0, base(ruler) − ceilingGap − base(P)) )
```

| leaf | unit | start | what |
|---|---|---|---|
| `byRank.1` / `byRank.2` / `byRank.3` | fraction01 | 0.15 / 0.10 / 0.05 | the chair's starting points, of the other power's strength |
| `steward` | fraction01 | 0.10 | a steward in a vacant seat counts at rank 2's weight |
| `cap` | fraction01 | 0.25 | per-power cap: never more than a quarter of the power's own strength (the 1,000's largest uncapped relative boost would be 6.75 points on a 15-point power, 45%) |
| `ceilingGap` | points | 1 | a boosted power stops one point under the ruler |

**⚖ J-9 (patronage derived, never stored; recommended).**
- **Derived, not stored.** Patronage is computed from the ranks, never from boosted strengths, by ONE pure function, and it is **not written into `powerStructure.factions[].power`**. The stored `power` stays the generator's base: integer points summing to 100, which `renormTo100` and `conserveSeatPower` guarantee. A boost written in would either break the sum or, renormalised, cut the ruler with everyone else. Renormalisation is what lets a boosted power pass the ruler, which is the invariant the chair wants never broken.
- **Readers.** The Power tab's DM layer, the dossier's one evidence sentence, the DM view (§9) and the derived capture state (A6, which reads ranks, not strength) read `patronageOf`. The public page shows base strengths only.
- **The chair's expected moves fall away.** The reading foresaw that patronage "moves the power figures, and so the frozen samples, in most towns". Under J-9 it moves NO stored figure. Its golden moves are the derived display line only (§10).
- **"Never past the ruler"** means a power at or below the ruler at base is boosted at most to one point under it. A power already above the ruler at birth (436 towns, Finding 0.4) gets **no** boost, so patronage never widens a lead over the ruler.
- **Rivals.** A rival of a boosted power gets a tension line, not a cut (the chair's "rivals answered with tension").

### 3.4 `HALL_CAPTURE_TUNING`: car 2, home `src/domain/people/hallCapture.js` (new; a draft row)

The derived state is ONE source. It combines the agents in the ruling three with today's classifier, kept as the "climate rung":

```
agentScore = Σ over the ruling three's agents (a card with an allegiance, ranked 1..3 in the governing power) of weight[rank]
agentRung  = capture    if the lord is an agent and agentScore ≥ captureScore
             corrupted  if the lord is an agent, or agentScore ≥ corruptedScore, or the governing power is itself criminal (a purchased council)
             equilibrium if agentScore > 0
             (else none)
climateRung = computeCriminalCaptureState(...)  capped at 'equilibrium'  — today's classifier, never above equilibrium on its own
state      = max(agentRung, climateRung)  on CAPTURE_LADDER
```

| leaf | unit | start | what |
|---|---|---|---|
| `weight.1` / `weight.2` / `weight.3` | points | 3 / 2 / 1 | an agent's weight by its rank in the ruling three |
| `captureScore` | points | 5 | the lord plus the second (or the lord, the third and more) |
| `corruptedScore` | points | 3 | the second and the third, or the lord alone |

**⚖ J-13 (the derivation; recommended as above).**
- **What it guarantees.** 'capture' always has an agent lord. 'corrupted' always has an agent in the three or a criminal governing power. Neither is reachable from strengths alone, which is the ONE SOURCE rule.
- **What it keeps.** The climate keeps the two coexistence rungs, adversarial and equilibrium, that strengths describe honestly.
- **The 45 criminal-governed towns** stay 'corrupted' at least (38 of them read so today).
- **The 4 towns read 'capture' today with no agent** fall to equilibrium at most.
- **What the derived state cannot answer.** It cannot read 'capture' in any town without an agent lord. That is the intent.

### 3.5 `LAW_PURSUIT_TUNING`: car 4, home `src/generators/people/goals.js` (new; a draft row)

A law face is a face of a law family (§0.6's set, as a registry mark `lawEnforcement: true`, J-14). Each law face rolls once on its goal fork for a pursuit goal, and the roll reads as follows:

```
pWarrant   = clamp( w.base + w.enforcer·n01(enfStrength ÷ 30) − w.guild·n01(crimStrength ÷ 30), w.min, w.max )   // a target: an OPEN member of a crim house
pSuspicion = clamp( s.base + s.enforcer·n01(enfStrength ÷ 30) + s.guild·n01(crimStrength ÷ 30) + s.organized·organizedCrime, s.min, s.max )  // a target: a hidden allegiance
target     = weighted by exposure[target kind] × importance weight, among real criminal links, never the enforcer's own power, never itself;
             a corrupt enforcer never targets its own allegiance's house or power (it may target a rival criminal house)
```

| leaf | unit | start |
|---|---|---|
| `warrant.base` / `.enforcer` / `.guild` / `.min` / `.max` | probability | 0.20 / 0.40 / 0.25 / 0.05 / 0.60 |
| `suspicion.base` / `.enforcer` / `.guild` / `.organized` / `.min` / `.max` | probability | 0.10 / 0.30 / 0.20 / 0.10 / 0.02 / 0.40 |
| `exposure.open` / `.front` / `.office` / `.retainer` | multiplier | 1.0 / 0.5 / 0.75 / 0.4 |

The two strengths behave as the chair ruled: a strong guild draws more suspicion and fewer warrants. Wrongful suspicion (a target with no real link) is a later, rare flavour and is not in this train.

### 3.6 `GOAL_FAMILY_TUNING`: car 4, home `src/generators/people/goals.js` (a draft row)

These are the family weights of §6.8. Each family's base weight is a `multiplier` leaf, and its support gates are draw-free.

---

## 4. The invariants: testable statements, each with its check

These are the HARD rules. A violation is a defect, never a band.

| # | statement | where checked |
|---|---|---|
| I-1 | **A captured or corrupted hall has a criminal in the ruling three**: an agent (an `allegiance`), or a member of a criminal governing power. A 'capture' hall's lord is an agent. | `tests/generators/people/hallCapture.test.js` (new, car 2) over the soak slice; a soak finding kind `coh:capture-without-agent` in `scripts/audit/soak-review/checks.mjs` (score −1) |
| I-2 | **Every hidden allegiance has exactly one handler**, a roster card ≠ itself; every front's face has exactly one. | `tests/generators/people/allegiance.test.js` (new, car 1); soak `coh:allegiance-handler` |
| I-3 | **Every handler is a criminal face**: a member of `allegiance.power` when one is named, else a crim-house face; never a card that itself holds an allegiance. | allegiance.test.js; soak `coh:allegiance-handler` |
| I-4 | **The gate**: no allegiance on a card without a corruptible flaw, on a crim-house face, or in a town with no crim house on its roster. | allegiance.test.js; the walker's generation sweep |
| I-5 | **The seat**: the governing power's rank 1 is the seat's face whatever the push (FLOOR 1); the lord is an agent only through its own roll. | `tests/generators/people/castPowers.test.js` (an arm per floor under a maximal push, car 2) |
| I-6 | **No boosted power passes its ruler**: `effective(P) ≤ base(ruler) − ceilingGap` for every P ≤ ruler at base; boost 0 for every P > ruler at base; `boost ≤ cap·base`. | `tests/domain/people/patronage.test.js` (new, car 3), property-style over the 1,000's ranks |
| I-7 | **Patronage stores nothing**: `powerStructure.factions[].power` byte-identical with and without car 3; the 100-sum holds. | patronage.test.js; the golden diff of car 3 (expected: display rows only) |
| I-8 | **A corrupt enforcer never targets its own guild's people**: a pursuit target's house and power ≠ the enforcer's `allegiance.house`/`.power`; never itself; never the enforcer's own power. | `tests/generators/people/goals.test.js` (new, car 4) |
| I-9 | **Every pursuit target is real at birth**: WARRANT → an open member of a crim house; SUSPICION → a card with an `allegiance`. | goals.test.js |
| I-10 | **No hidden allegiance, handler tie, suspicion goal or hidden-power boost on any public page** (§8). | `tests/security/allegianceVeil.pglite.test.js` (new, car 1, extended by car 4); the proof walk on the 525 and the 1,000 (counts 0) |
| I-11 | **Every goal names only facts the record holds**: each slot's value resolves to a record id or fact; the false-presumption detector reads 0. | `src/domain/facts/presumptionCheck.js :: presumptionFindings` (the existing self-check) plus soak `cert:false-presumption` at 0; goals.test.js asserts `intent.target` resolves |
| I-12 | **One outgoing tie per card** still holds (the handler tie replaces the agent's drawn tie; `tie_<from>` unique). | `tests/generators/people/ties.test.js` (existing arms), one arm added |
| I-13 | **Keyed determinism**: removing a card leaves every other card's allegiance roll, push and goal byte-identical. | allegiance.test.js, the people car's removal-arm pattern |
| I-14 | **The save migration**: v2 → v3 converts every `corrupt: true` card to an `allegiance` (or reports it), leaves no `corrupt`/`corruptionVector`/`corruptTies` on a migrated birth-era card, and is idempotent. | `tests/domain/settlementMigrations.test.js` (car 1) |
| I-15 | **One reader**: no file outside the dormant list reads `npc.corrupt`, `corruptTies` or `corruptionVector`. | a walker `tests/lint/noLegacyCorruptReaders.walker.test.js` (car 1), on `noLegacyFactionReaders`' pattern with its own list (§7.3) |

---

## 5. The plausibility bands: measured after each car against §0

These are bands, not predictions. A band shows how often a thing happens by condition. A car's measurement outside a band is a question for the chair, not a red. The invariants are the reds.

| measure | baseline (§0, CONFIRMED) | band after the car | car |
|---|---|---|---|
| agents ÷ eligible, towns with a crim house | 2.9% / 13.5% / 31.4% by crime low/mid/high | the same ±3 points in a town with no criminal power; up to +10 points where organized crime is 1 | 1 |
| agents in towns with no crim house on the roster | 31 (15 towns) | 0 (J-4) | 1 |
| crim-house faces with an allegiance | 115 | 0 (J-3) | 1 |
| `via` split | — (new) | front 30–45%, office 20–30%, retainer the rest, PLAUSIBLY from §0.2's shelves (Crafts + Economy + Entertainment 869 of 1,195) [TARGET CORRECTED, the chair's ruling of 2026-11-08 on ALLEGIANCE-CAR3's census: front **40–50%** — J-7's table is the design's own and yields 48.1–48.5% at any organized-crime weight; a target correction, not a tune] | 1 |
| every allegiance with one handler | — | 100% (I-2) | 1 |
| agents per handler | median 1, max 3 (§0.8) | median 1, max ≤ 4 [AMENDED, the chair's ruling of 2026-11-08 on ALLEGIANCE-CAR3's residue: "handler maximum ≤ 4, except where the town's criminal faces cannot supply it — such towns named in the record" (soak1k-849, car 3's record)] | 1 |
| agents in the ruling three, by organized crime 0–0.2 / 0.2–0.4 / 0.4–0.6 / 0.6–0.8 / 0.8+ | 0 / 4 / 12 / 17 / 31 towns | **never** at 0 (no crim house); rarely below 0.4 (≤ 3% of towns); often at 0.8+ (25–40% of those towns) — the owner's "often under strong organized crime, rarely in a clean town, never with no organized crime" | 2 |
| agent lord | 31 towns | 25–40 (the push never reaches FLOOR 1) | 2 |
| capture / corrupted / equilibrium / adversarial / none | 4 / 70 / 81 / 94 / 751 | capture 5–20 (every one an agent lord); corrupted 60–110; none ≥ 700 (the towns with no crim house) | 2 |
| towns touched by patronage | 265 | 260–270 (rank-driven; the hidden allegiance adds the agents' guilds) | 3 |
| median patronage boost | 0.99 points, 7.5% of base | ≤ 1.2 points, ≤ 8% (the cap only lowers it) | 3 |
| boosted powers newly passing the ruler | 15 (uncapped) | **0** (I-6) | 3 |
| cards with no goal | 54.0% (15,664 / 29,020) | **≤ 2%** (the crisis family and the personality family are always supported) | 4 |
| distinct short goals across the 1,000 | 309 | ≥ 3,000 (slots × families); no line in more than 2% of a tier's towns | 4 |
| law faces holding a pursuit goal | — | warrant 15–35% of law faces in towns with an open criminal house; suspicion 5–20% in towns with an agent; 0 where neither | 4 |
| false presumptions | soak `cert:false-presumption` 0 | 0 | 4 |

---

## 6. The goal families (car 4, THE GOALS REBUILT)

**The model.** A card's goal is drawn at A9 (§2) from the FAMILIES its record supports. There are two draws, SHORT (this season) and LONG (the life), from two different families. Each line names only what exists in the record, and the keyed intent is stored beside the text. Today's pools retire: `NPC_FACTION_GOALS` (54 rows) and the stress templates of `generateNPCGoal` (`STRESS_GOALS`). `STRESS_GOAL_OVERRIDES` is kept as the crisis family. The REVIEW-INTAKE-4 refusal of held text stays. With slots it refuses a FILLED line, which is now rare (§5's ≥ 3,000 distinct).

### 6.1 The families, their slots and the record facts they bind

| family | supported when (draw-free, from the record) | slots → record facts | §0.7 support |
|---|---|---|---|
| **RANK** (own power) | the card holds a membership | `{power}` (membership), `{rank}`, `{above}` = the card ranked one place above it (its name and title), `{below}` = the one below for a first defending its chair | ranked 24–93% by tier; members ~100% |
| **POWER vs RIVAL** | one of the card's powers stands in a `factionRelationships` row typed tense / competitive / corrupted, or in a `conflicts` entry | `{power}`, `{rival}` (the other power), `{issue}` (the conflict's issue when one exists) | 10–62% |
| **INSTITUTION** | the card's house is on the roster | `{house}`, `{condition}` from the house record (an impairment, a chain status naming it, a trade dependency); takeover: `{otherHouse}`, a house sharing a chain | every house face |
| **SUPPLY CHAIN** | the house processes an active chain, or has a trade dependency, or the town's isolation receipt applies | `{chain}` (label), `{resource}` + its condition, `{status}`, `{import}` (a necessity import), `{route}` from the isolation receipt's paths / its status | 6–44% chain; 0–22% dependency; 166 towns isolation |
| **TIES** | the card has an outgoing tie, or is named by one | `{other}` (the tie's other end), `{kind}` → rival/enemy: undo or outlast; debtor_creditor: repay or collect; ally: protect; family / lover; mentor_student; political / respect | 74–100% |
| **PERSONALITY** | always | `{flaw}`, `{dominant}`, `{modifier}` (the card's own words; a cluster key, §6.6) | 100% (the fallback) |
| **ALLEGIANCE** | the card has an allegiance, is a handler, is a crim-house face, or is a law face with a real target | agent: serve or escape `{guild}` (= `allegiance.power` or `.house`), `{handler}`; the front's face: keep `{front}`'s books clean / get `{front}` out; the handler: keep `{agent}` in line; the law's pursuit (§6.7): `{target}`, `{targetHouse}` | §0.2, §0.6 |
| **CRISIS** | a stress the record holds | today's `STRESS_GOAL_OVERRIDES` (wartime, insurgency, mass_migration, religious_conversion, slave_revolt) and the siege goal, kept verbatim through `resolveDeclared` | as today |

### 6.2 The weighting, from the record (draw-free gates, one weighted draw per vantage)

```
w(family) = base[family] × support(family) × fit(family, card)
fit: RANK ×1.5 for a card ranked 2 or 3 (a rank to climb) · POWER ×1.3 for a rank-1 face · SUPPLY ×1.5 on the Crafts / Economy shelves ·
     INSTITUTION ×1.3 when the house carries an impairment · ALLEGIANCE ×3 for an agent's SHORT goal (the corruption pass's rewrite today is certain; ×3
     keeps it likely, not certain — plausibility) and ×2 for a handler · CRISIS ×2 under its stress · PERSONALITY ×0.6 (the floor that keeps every card supported)
starting base: 1.0 for every family
```

⚖ **J-15, the weights.** They are dials in `GOAL_FAMILY_TUNING` and are measured on the 1,000 against §5's band (family share by tier).

### 6.3 The keyed goal stored for the simulation

```
goal: { short: '<text>', long: '<text>',
        intent: { short: { family, key, target }, long: { family, key, target } } }   // target: { kind: 'npc'|'power'|'house'|'chain', id } | null
```

**`key`** is an `NPC_GOAL_CATALOG` key (`src/domain/npc/npcFacetContract.js`), so the simulation can act on it when it wakes (`npcAgency` seeds from 10 of the 23 keys today). The families map to existing keys where one fits: RANK → `secure_office` / `consolidate_power`; POWER → `expand_influence` / `settle_rivalry`; INSTITUTION → `control_institution`; TIES (rival) → `settle_rivalry`; CRISIS → `survive_crisis` / `restore_order` / `mobilize_defenses`.

**New keys**, each with `{ onAchieve, onFail, drive }` entries in the catalog (the simulation is frozen, M-6, so the entries are data): `secure_supply`, `repay_debt`, `collect_debt`, `protect_ally`, `serve_patron`, `escape_patron`, `keep_agent`, `pursue_warrant`, `prove_allegiance`, `indulge_trait`.

**Public projection.** The NPC public allowlist (`publicSafe.js :: publicNpc`, SQL 033/205/206) already drops `goal`. `intent` rides inside it, so it is dropped too.

### 6.4 The law's pursuit (inside ALLEGIANCE)

These are the WARRANT and SUSPICION goals of §3.5, as the enforcer's SHORT goal when the roll lands:
- **A WARRANT** reads "Bring {target} of the {targetHouse} in before the {season} assize", with variants.
- **A SUSPICION** reads "Prove what {target} answers to".

Rules:
- Both are DM-only by construction: the goal is not public.
- A suspicion's TARGET is a veiled membership's holder, so the DM view (§9) is its only surface.
- On the card, the DM sees the line. The player-facing card prints no goal (as today).
- In the simulation, confirmation and escalation over time, and the turning of a front into an informant, are the simulation's.

### 6.5 W4's deferred item 15 (the ~80 fallback titles), folded in

**The item.** W4's item 15 (`origin/lane/w4-people-2026-11-07:docs/WIRING_W4_2026-11-07.md` §S12) asks for goal, secret and presentation lines by title for the fallback titles. The list is in `docs/PEOPLE_1_CAST_2026-11-07.md` §1, "The pool map's fallbacks". 156 of 191 `POOL_BY_TITLE` titles fall back today.

**⚖ J-16 (recommended).**
- **Goals:** none by title. The INSTITUTION, SUPPLY and RANK families with `{house}`, `{title}` and `{chain}` slots replace a per-title goal pool. "The miller" gets the mill's chain, its grain status and its rank, not a miller line.
- **Secrets and presentations:** BY TITLE for the 76 titles that fire on the 1,000 (PEOPLE-1's list), 3 secrets and 3 presentation lines each. The long tail draws by category, as today.

### 6.6 The writing size (for a writing seat; the style law; every line for the owner's veto)

**Vantages.** Lines are counted per family, per vantage (SHORT, LONG), per sub-kind. Six variants per cell is the ceiling that keeps the slotted space above §5's distinct-line band.

| family | sub-kinds | vantages | variants | lines |
|---|---|---|---|---|
| RANK | climb (2nd/3rd) · defend the first · enter the ranks (unranked) | 2 | 6 | 36 |
| POWER vs RIVAL | tense · competitive · corrupted · conflict-named | 2 | 6 | 48 |
| INSTITUTION | solvency · rebuilding (an impairment) · a charter · a takeover | 2 | 6 | 48 |
| SUPPLY CHAIN | an impaired chain · a dependency · isolation (precarious / untenable) · expansion of a running chain | 2 | 6 | 48 |
| TIES | rival/enemy · debtor · creditor · ally · family/lover · mentor/student | 2 | 5 | 60 |
| PERSONALITY | 12 trait clusters (the 17 corruptible flaws in 4 vectors, plus 8 clusters of the other flaws and temperaments, drawn from `npcData.js`'s trait lists) | 2 | 4 | 96 |
| ALLEGIANCE | serve × 4 vectors · escape × 4 vectors (SHORT only) · handler keep-in-line × 4 kinds (SHORT) · the front's face × 2 (keep / get out) · WARRANT · SUSPICION | 1–2 | 5–6 | 40 + 20 + 20 + 24 + 12 + 12 = 128 |
| CRISIS | (existing lines) | — | — | 0 |
| **goals total** | | | | **464** |
| the handler tie's prose | 4 kinds × (description, tension) | — | 6 | 48 |
| item 15: secrets and presentations by title | 76 titles × 2 kinds | — | 3 | 456 |
| the dossier's patronage and capture sentences (DM layer) | 2 + 5 rungs | — | 3 | 21 |
| **the writing car total** | | | | **≈ 989 lines** |

The writing can run as two seats, both off the families spec, with the data files path-disjoint from car 4's wiring:
- Seat A: the goal families.
- Seat B: item 15 and the tie prose.

---

## 7. The readers to re-point and the save migration (v2 → v3)

### 7.1 The field readers outside the simulation (car 1 re-points each through `allegianceOf`)

**The count.** Of the 43 files outside `src/domain/worldPulse/` that contain `compromised` as a word (`git grep -l -w compromised`), and of the 102 files in the union with `corrupt` / `corruptTies` / `corruptionVector`, **18 read or write the NPC field**. The rest are prose, comments or another meaning: the event-role quality `'corrupt'`, the paradigm axis's own `corruptionVector`, a ransom action. That figure is agent C's classification, CONFIRMED by grep; the per-file judgment is PLAUSIBLE where the file is long.

| file :: symbol | what it does with the mark | re-point |
|---|---|---|
| `src/generators/steps/corruptionPass.js` (registerStep) | the one birth writer | RETIRED (J-2); the writer is `people/allegiance.js :: dealAllegiances` |
| `src/components/new/npcComponents.jsx` (the NPC card's badge) | `npc.corrupt`, `corruptTies.criminalInstitution` | the DM layer's allegiance line ("answers to {guild}, through {handler}") |
| `src/domain/corruption.js :: compromisedSecurityInstitutions`, `npcHomeInstitution` | `npc.corrupt` and the home institution by `factionAffiliation` (gone since schema 2) | `allegianceOf` + `institution.key`; the in-file reader is on the FPZ list for its `factionAffiliation` read — car 1 re-points the corrupt half only |
| `src/domain/corruptionLeash.js` | `corruptTies.leash`, `.foreignPatron` | `allegiance.leash`, `.foreignPatron` (the simulation's sub-fields, carried by the migration) |
| `src/domain/crisis/crisisCast.js` | `.corrupt`, `corruptTies` (casting) | `allegianceOf` |
| `src/domain/events/affordanceManifest.js` | `n.corrupt` → exposure targets | `allegianceOf` |
| `src/domain/events/mutateEntities.js :: EXPOSE_CORRUPTION`, `IMPOSE_CORRUPTION` | the DM's event writer | writes / clears `allegiance` (the DM's Impose picks the handler by §1.5's rule) |
| `src/domain/events/undoEvent.js` | restores the three fields | restores `allegiance` |
| `src/domain/institutionRename.js` | cascades `corruptTies.thievesGuild`, `.criminalInstitution` | cascades `allegiance.house`; `factionRename.js` gains `allegiance.power` |
| `src/domain/npc/livedExperienceSources.js` | the data path `'corruptTies.revealed'` | `'allegiance.revealed'` |
| `src/domain/npcProfile.js` | `.corrupt` (tri-state), `corruptionVector` | `allegianceOf` |
| `src/domain/settlement.schema.js` | the typedef | the `allegiance` typedef; the three fields marked legacy (sim-only) |
| `src/domain/tableLedger.js` | `n.corrupt` → exposure refs | `allegianceOf` |
| `src/domain/display/galleryVeil.js` | the veil rule `corruption: ['corrupt','corruptionVector','corruptTies']` | + `'allegiance'` (§8) |
| `src/domain/display/npcInteriorityRead.js` | `n.corrupt` → `gt.compromised` | `allegianceOf` |
| `src/generators/steps/stepMetadata.js` | counts `npc.corrupt === true` | counts allegiances |
| `src/lib/structuralFingerprint.js` | `corrupt_count` | `allegiance_count` (⚖ J-17: the fingerprint's key renames — a fingerprint consumer outside the repo would see it; recommended: rename, the fingerprint is ours) |
| `src/domain/prose/holderTable.js` | `world.compromised.{covert,revealed}` (the WORLD roster, a simulation surface) | unchanged — the simulator's "compromised" (the owner: kept for the simulator) |

`src/domain/edit/recordRegister.js` gains `allegiance` as a held card field, for the DM's edits.

### 7.2 The save migration, v2 → v3 (in-app; no database migration)

`src/domain/settlementMigrations.js` gets a new entry, `{ from: 2, to: 3, description, migrate: (s) => migrateV2toV3(s).settlement }`. `src/domain/settlement.schema.js :: SCHEMA_VERSION` goes 2 → 3, and a test is added in `tests/domain/settlementMigrations.test.js`.

For each card with `corrupt === true` and not ousted:
- `allegiance = { power, house, vector, via, handler, share, veiled: true, covert: true }`:
  - `power` is the independent criminal power, if one stands;
  - `house` is `corruptTies.criminalInstitution` when it names a roster house, else the first crim house on the roster;
  - `vector` is `corruptionVector`, or `corruptionVectorForFlaw(flaw)`;
  - `via` follows the front rule;
  - `handler` comes from §1.5's draw-free rule, which is why that rule is draw-free;
  - the simulation's sub-fields (`leash`, `foreignPatron`, `revealed`) are carried verbatim.
- `corrupt`, `corruptionVector` and `corruptTies` are deleted.
- A card it cannot map (no crim house on the roster) goes to `migrationReports`, keeping the three fields, so a DM's corrupt NPC is never silently cleaned.
- `corrupt === false` is deleted, because the absence of an allegiance is the clean state.

**⚖ J-18 (the migration adds no tie; recommended).** A migrated save keeps its ties as the DM has them. A handler tie would replace the agent's outgoing tie, which may be DM-authored. The handler lives on `allegiance.handler`, and the DM view shows it. I-2 checks the field; the forced tie is a birth rule.

### 7.3 The simulation's 21 readers: the dormant list

The 21 files inside `src/domain/worldPulse/` containing `compromised`:
- beliefMap, causeLifecycle, causeVocabulary, clergyTraitPlane, envoyChanceMeeting, envoyChanceMeetingReceiptPools, envoyChanceMeetingStage;
- factionCapture, habitForkRegistry, npcAgency, npcConsequencesTuning, npcLadderChallenge, npcLadderKernel, npcLedgerFacets;
- npcVerdictTable, pulseKernel, religionLegitimacy, roadsKernel, sendTwoDivergence, settlementStrategy, warSeatBooks.

The 16 that read the NPC FIELD (`.corrupt`, `corruptTies`, `corruptionVector`):
- applyWorldPulseBetrayal, assizeKernel, beliefMap, causeLifecycle, clergyTraitPlane, commonsVoiceKernel;
- corruptionImpair, corruptionWeb, factionCapture, npcAgency, npcGrowthKernel, npcLadderChallenge;
- npcLadderKernel, npcVerdictTable, religionLegitimacy, settlementPolitics.

**The list.** Car 1 writes a dormant list `tests/lint/legacyCorruptReaders/dormant-list.json`, the union of those 37 names (about 30 distinct; the census writes the exact set). It follows `tests/lint/legacyFactionReaders/fpz-list.json`'s shape: `{ file, reads, reason }`. The walker of I-15 reads it.

**When the simulation unfreezes.** `npcAgency.js :: ensureNpcStates` treats a non-boolean `corrupt` as a legacy save and RE-ROLLS corruption with `spawnCorruptionChance`. A v3 card carries no `corrupt`, so the unfrozen simulation would double-corrupt the town. The dormant list's row for `npcAgency.js` names this: the reader must read `allegianceOf` when FPZ rebuilds it (⚖ J-19, recorded, nothing to build now). [AMENDED BY CAUSE, ALLEGIANCE-CAR1, the chair's ruling of 2026-11-08: a certified band (`tests/property/statecraftExposureBand.test.js`) runs the simulation and exposed the double read at car 1's tip (fp-read-2, twenty years: 38 scandals against the ceiling 29; base 22). `ensureNpcStates` was cured at the car (`d131ab158`: `corruptionLeash.js :: corruptMarkOf`; a v3 card is never re-rolled; the draw is kept), so that reader leaves this risk; the rest of the dormant list stands. "Dormant" means "silently changed at the tip when the simulation is lit": car 3 measures each dormant reader base-against-tip in a lit run before it re-points it.] The simulator keeps "compromised" for cross-settlement espionage, as the owner ruled.

---

## 8. The veil extensions and the public-export scan

**What the veil already does.** The veil branch (`origin/lane/fix-public-veil-2026-11-07`, merged before the train) gives this design most of what it needs:

| thing | public drop by | new code |
|---|---|---|
| `allegiance` (the card field) | the NPC public ALLOWLIST (`publicSafe.js :: publicNpc`; SQL `_gallery_sanitize_public_json`'s NPC allowlist, 033 → 205 → 206): a key not on the list never leaves | none; `galleryVeil.js`'s corruption rule gains the key for the gallery's own projection |
| `allegiance` inside the DM-full share (`gallery_share_dm`) | it is the DM's share: kept by design | none |
| the handler TIE | `covert: true` on the tie object: the VALUE-level covert drop, client (`publicSafe.js`, W-DOCTRINE-3 §6) and SQL (migration 142, re-stated in 206 line "COVERT DROP") — the object is dropped whole | the tie writer sets `covert: true`; **no database migration** |
| a suspicion / warrant / allegiance GOAL and its `intent` | `npcs[].goal` is already dropped publicly | none |
| a hidden power's patronage boost | stored nowhere (J-9); the public page reads base strength | the DM-only display calls `patronageOf` on the DM record only |
| the derived capture state | `galleryVeil.js` deletes `criminalCaptureState` and `captureState` on the gallery projection (`UNDERSIDE_MOUNT`); **PLAUSIBLE gap**: `publicSafe.js` keeps `powerStructure` whole, and I found no strip of `criminalCaptureState` there | ⚖ J-20: measure the public page's `criminalCaptureState` in car 1's proof walk; if present, it is PRE-EXISTING, and the cure belongs with the owner's queued "server-side institutional veil" |
| a veiled card's opaque id on a handler tie's ends | the tie is dropped whole (covert), so no end leaks | none |

**The scan test.** `tests/security/allegianceVeil.pglite.test.js` is built by car 1 and extended by car 4. On generated infiltrated, criminal and organized cities, it plants an allegiance, a covert handler tie, a WARRANT and a SUSPICION goal with intent, and a hidden-power boost receipt. It asserts that each appears **0 times** in both the client `toPublicSafe` and the pglite SQL projection, with client equal to server, on `gallerySanitizer.pglite.test.js`'s harness.

**The proof walk.** On the 525 and the 1,000, the public projection's counts must all be 0: `allegiance` keys, `covert` ties, `handler` ties, the planted strings, and every agent's guild name appearing beside the agent's name.

---

## 9. The DM view: "who really runs this town" (display spec; car 3, DM layer only)

**Where.** A DM-only panel on the Power tab's underside (the `UNDERSIDE_MOUNT` the capture reading already uses) and a DM chapter section in the PDF. It is never on a player surface, a public page or the Foundry journal: the W7 receipt ruling's surfaces.

| block | rows | from |
|---|---|---|
| **The ruling three** | rank · face (link) · title · open powers (rank there) · **answers to** {guild} through {handler}, when an agent · the patronage it lends ("lends {power} +{n} through its {share} share") | memberships, `allegianceOf`, `patronageOf` |
| **Who answers to whom** | per criminal power or house: the boss → each handler → each agent (face, title, house, `via`, the tie's kind in plain words: "a silent partnership", "held over them — a debt") | `allegianceOf`, the covert ties |
| **The fronts** | house → its face → the guild it fronts for → its handler | `via: 'front'` |
| **Who hunts whom** | law face → target · WARRANT or SUSPICION · "shields {guild}'s people" on a corrupt enforcer | `goal.intent` (car 4) |
| **The hall** | the capture rung, and its receipt in one plain line: "Corrupted: the second and the third answer to the Thieves' Guild." | `hallCaptureOf`'s receipt |
| **The boosts** | power · base · boost · effective · the sentence of evidence (one per boosted power) | `patronageOf` |

**Confidence lives here.** Every surprising outcome has its WHY on this panel: an agent lord, a capture, a boost, a pursuit. Each block reads one writer's receipt and invents nothing. This is display only: no card field, no golden beyond the PDF DM chapter's rows.

---

## 10. The car split

Every car is cut from the integration tip after MERGE-WAVE lands, which carries the veil. Each car signs ONE golden record for its one cause through the golden door, staged forward (`scripts/audit/landing-stage.sh`, the `Owner-Signed: §934.105` trailer, the people car's M-1 method). Each car measures its band on the 1,000 before its push.

| car | cause | file manifest (create · modify) | depends on | golden moves expected |
|---|---|---|---|---|
| **1 · ALLEGIANCE** (corruption as allegiance, fronts, handlers, readers, migration, veil test) | the mark becomes a hidden allegiance with a handler; the pass moves into the seam; the gate gains J-3/J-4 | CREATE `src/domain/people/allegiance.js` (reader, dials, `dealAllegiances`, `assignHandlers`), `tests/generators/people/allegiance.test.js`, `tests/security/allegianceVeil.pglite.test.js`, `tests/lint/noLegacyCorruptReaders.walker.test.js` + `legacyCorruptReaders/dormant-list.json`; MODIFY `castPowers.js` (split land / rank), `narrativeGenerator.js :: enrichNpcCoherence`, `ties.js` (forced handler, covert), `relationshipArchetypes.js` (4 kinds), `institutionalCatalog.js` (the front mark), `steps/corruptionPass.js` (deleted) + `steps/index.js` + `steps/assembleSettlement.js` (deps), the 17 readers of §7.1, `settlementMigrations.js`, `settlement.schema.js`, `recordRegister.js`, `factionRename.js`, `galleryVeil.js`; registers: fork census, writer reach, observed shape (a rung), tuning register (+1 row), lighting census | MERGE-WAVE (the veil) | every golden row whose town has a crim house or a criminal climate: the `corrupt: false` stamp leaves every card there; at least 258 of the 525 (CONFIRMED floor, §0.9) and PLAUSIBLY a similar share of the fence 360; the prose manifest where a corrupt line or a tie moved |
| **2 · THE PUSH and THE HALL** | the push in the rank deal; the capture state derived | MODIFY `castPowers.js` (`GUILD_PUSH_TUNING`, the draw line); CREATE `src/domain/people/hallCapture.js`, `tests/generators/people/hallCapture.test.js`; MODIFY `rulingStructure.js` / `economyReconciliation.js` (the classifier as the climate rung), `narrativeGenerator.js` (A6), `soak-review/checks.mjs` (`coh:capture-without-agent`); registers: tuning (+2 rows), fork census unchanged (the draws are the same count, weights moved) | car 1 | the rows where an agent's ranks moved (towns with an agent in a ranked power) and every row whose capture state changes |
| **3 · PATRONAGE and THE DM VIEW** | the derived boost; the DM panel | CREATE `src/domain/people/patronage.js`, `tests/domain/people/patronage.test.js`, the panel component under `src/components/new/tabs/` (the Power tab's underside), the PDF DM section; MODIFY `PowerTab.jsx`, `pdf/lib/viewModel.js`; registers: tuning (+1), lighting | car 1 (car 2 for the panel's hall block; the panel can be built against car 1 and re-read at car 2's tip) | none in the generator goldens (I-7); the PDF DM-chapter rows only |
| **4 · THE GOALS REBUILT** (with the law's pursuit and item 15) | goals by families at the seam, keyed intent; the law's pursuit; item 15's secrets and presentations | CREATE `src/generators/people/goals.js` (families, `LAW_PURSUIT_TUNING`, `GOAL_FAMILY_TUNING`), the data module(s) of the writing car, `tests/generators/people/goals.test.js`; MODIFY `npcGenerator.js` (the goal draw leaves `generateSingleNPC`; the size ratchet shrinks), `narrativeGenerator.js` (A9), `npcFacetContract.js` (new catalog keys), `poolMap.js` (item 15's title keys), `institutionalCatalog.js` (`lawEnforcement` mark); the veil test extended | cars 1 and 2 (it reads the final ranks and the agents); the WRITING can run beside cars 1–3 | **every** row of the 525 and the 360 (every card's goal text changes); the prose manifest's goal-bearing rows |

**Parallel.**
- Car 1 runs alone; everything reads its field.
- Cars 2 and 3 are path-disjoint apart from `narrativeGenerator.js`'s two call lines. They can be built in parallel off car 1's tip and merged 2 then 3, with car 3's panel re-read at the merged tip.
- Car 4's writing seats (§6.6) can start as soon as the chair rules §6. Car 4's wiring follows car 2.
- At most four seats run at once: car 2, car 3 and two writing seats.

**The signed records.** Each car signs ONE record:
- Record 1: the allegiance shift.
- Record 2: the push and the hall.
- Record 3: the DM display, if any PDF golden moves.
- Record 4: the goals.

Each is measured on the 1,000 (the §5 band) and the 525, with each cause's golden counts quoted. The tuning rows are born draft and signed by the owner. The new lines (§6.6) go to the owner's veto in the writing car's record.

---

## 11. Risks and open questions, and every judgment for the chair's ruling

| # | the question | my recommendation |
|---|---|---|
| **J-1** | The allegiance's shape: a field of its own, or a membership row? | A field, `allegiance`, with one reader. 230 of 401 crim-house towns have no criminal power, and a membership row breaks the power key, the share sum, the tie draw and the card line (§1.2). |
| **J-2** | Retire the registered step `corruptionPass`? | Retire it. The roll moves into the seam on per-card keyed forks, and regeneration then runs it too. |
| **J-3** | Exclude crim-house faces from the allegiance? | Yes: the owner's remembered gate, absent today. 115 cards move. |
| **J-4** | Require a crim house on the roster? | Yes. 31 cards in 15 towns have no possible handler. |
| **J-5** | Organized crime's meaning and weight? | Organization (criminal-house backing weight, plus a criminal power), at 0.10 on the chance, so `criminalEffective` is not counted twice. |
| **J-6** | Make fanaticism reachable at birth? | No. It stays the simulation's drifted vector; its tie kind is specified. |
| **J-7** | Which families can front? | The PRIME / FRONT / no table of §1.4. |
| **J-8** | Does the front class weight the roll? | Not in car 1. The dial `frontWeight = 1` is reserved. |
| **J-9** | Is patronage stored? | No. It is derived and never written into `power`: the 100-sum holds, and nothing frozen moves. A power above the ruler at birth gets no boost. |
| **J-10** | The handler dealing rule? | Draw-free: the second handles the best agent, and the lesser members take the rest. The boss handles last. |
| **J-11** | Does the push reach FLOOR 2? | No. Only the weighted roll moves: ranks 2 and 3, and rank 3 of the ruler. |
| **J-12** | The patronage table's name? | `RULING_PATRONAGE_TUNING` (`PATRONAGE_TUNING` is taken). |
| **J-13** | The capture derivation? | The agent rung, combined with today's classifier capped at equilibrium (§3.4). |
| **J-14** | The law set? | A registry mark `lawEnforcement` on the militia / watch / barracks / garrison / citadel / warden / prison families. Not the courthouse: a magistrate judges and does not hunt. |
| **J-15** | The goal family weights? | The starting weights of §6.2, measured. |
| **J-16** | Item 15? | No goals by title. Secrets and presentations by title for the 76 that fire; the tail by category. |
| **J-17** | Rename the fingerprint's `corrupt_count`? | Rename it to `allegiance_count`. |
| **J-18** | Does the migration add handler ties? | No. The handler is kept on the field; the tie is a birth rule. |
| **J-19** | The simulation's double-corruption on unfreeze? | Recorded on the dormant list's `npcAgency` row; nothing is built now. [AMENDED BY CAUSE at car 1: cured in `ensureNpcStates`; §7.3's note.] |
| **J-20** | Is the capture state on the public page? | Measure it in car 1's proof walk. If it is there, it is pre-existing and goes with the owner's queued server-side veil. |

**Risks.**
1. **Car 4's golden blast is total** (every card's goal). It must be its own signed cause, after the other three, so their records stay readable.
2. **54% of the cast has no goal today.** If the train is delayed, that is the largest visible gap on the card, and the goals car can be pulled forward independently of cars 2–3 (it needs car 1's field only for the ALLEGIANCE family).
3. **Moving the goal draw to the seam** changes `generateSingleNPC`'s draw count, and so the population step's fork-census row and the pinned-mode arm (`tests/generators/pipelinePinnedMode.test.js`), as the people car's step 2 did. This is expected and re-keyed with cause.
4. **The fork census** re-derives in cars 1 and 4: the corruption step's stream leaves, and the allegiance and goal forks come in. The writer-reach and observed-shape registers move in car 1 (a new card field) and car 4 (`intent`).
5. **The `corrupt` boolean.** Every reader of `npc.corrupt === false` as "generation decided" (`npcAgency.js`, J-19) loses its signal. That is the simulation's concern, and the simulation is frozen (M-6).

**CONFIRMED vs PLAUSIBLE.**
- CONFIRMED: every figure in §0 and §5's baseline column, measured on the soak 1,000 at `8308f13f8` by the scratch instrument, 0 errors; the code facts quoted by symbol (read whole for `corruptionPass.js`, `corruption.js`'s rate and climate half, `computeCriminalCaptureState`, and by the four reading agents for the rest).
- PLAUSIBLE, each with its reason:
  - the per-file classification of the 102-file union (agent C's reading of long files);
  - the regeneration path's not running the corruption pass (agent A, from the code, not executed);
  - §0.6's attribution of the 86 criminal memberships on law faces;
  - §0.7's chain-status column, which counts every status other than 'running';
  - every band in §5 (they are proposals);
  - §10's golden-move estimates.
