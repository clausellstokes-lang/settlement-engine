# COHERENCE-POWERS — phase 2B: the fold, the council of a kind, the powers with no one on the page

The charter is §5 of `CHARTERS-COHERENCE-2026-11-11.md`, items 1 to 3, on the owner's law of 2026-11-11: "whoever
leads teh town, in any type of government is wearing a dual hat (where appropraite) they come from an institution,
and are elevated yet still tied to an institution".

The lane is `lane/coherence-powers-2026-11-11`, on top of 2A (528d9886e), its lint cures (c7bc4702a..ee896dfca) and
the PRESUME merge (84f02ef0e, 081928512 merged into this lane). Every figure below is measured on births through the
app's own create boundary (`birthConfig`, so the density law v2 the browser births under is on), with the browser's
dials and the `critique-<tier>-<i>` seeds. The 360 corpus is village 60, town 160, city 100, metropolis 40. The 1,000
corpus is 170, 440, 280, 110. "Before" is the lane's 2A tip, 6f1bf56f7.

A correction to phase 1: the phase-1 and 2A probes called the pipeline without `birthConfig`, so they measured with
the density law off. The figures here replace them where they differ.

## 1. The fold (A-plus)

**The rule.** A power of the ruler's own kind that no house stands behind is not a power, and its figure folds into
the ruler.

**Where.** At the density resize (`density/applyDensityLaw.js :: resizePoliticalRoster`), the roster's last build,
through `power/rulerKin.js :: settleHouselessPowers`. A first cut folded at the power step, where the roster is
first built. There the faction boost (`factionCorrelation.js`) has not yet raised the houses a power founds, so the
cut folded powers that were housed by birth's end, and dropped their houses: 6 of 360 towns lost an institution. At
the resize the houses are final.

**"No house"** is the people seam's own test: no face-bearing house lands a share on the power after the
doubled-niche deal.

**Scope.** The fold reaches only the roster's own powers (`BASE_ROSTER_NAMES`) and the density law's rivals
(`contestsNiche`). A power a stress brings stands.

| 1,000 births | the fold, and the not-built rule of section 3, together |
|---|---|
| powers folded into the ruler | 63, in 63 towns (Religious Authorities 41, Arcane Orders 13, the military bloc 8, one rival) |
| stability moved | **0** (the STOP was 60) |
| legitimacy moved | 0 |
| capture moved | 0 |
| coup label moved | 29, **every one toward safety** (Contested → Stable 13, Contested → Holding 10, Holding → Stable 8) |
| a label outside the power family moved | **0** |
| relationships left naming a folded power | 0 (`pruneToRoster` at the fold) |

## 2. The council of a kind

**The rule.** A council of a kind is drawn only where the town has an open house of that kind, else the next
priority's, else the size's civic government. No house is raised.

**Where.** `power/rulerKin.js :: drawCouncilOfAKind`, which takes `rulingStructure.js`'s own chooser. That block is
wrapped unchanged, so the module stays at its 800-line ceiling.

**Two calls of mine, both vetoable:**
- A name the roster's own government house gives (govBody) is never second-guessed.
- The substitute is never a criminal council. Its house is hidden, so no house can show it (the veil). Without this,
  2 of 360 towns became Corrupt Councils and read corrupted.

Every renamed government was an Arcane Council with no arcane house: 14 of 360 and 32 of 1,000. On 1,000 they became
Military Council 7, Church Council 4, Merchant Council 5, Town Mayor 9 and Town Council 7.

| 1,000 births | the council of a kind |
|---|---|
| stability | 0 |
| legitimacy | 2 |
| coup label | 3; one Holding → Contested, toward danger: critique-town-275's Arcane Council became a weaker Town Mayor |
| capture | 3: none → equilibrium (town-40, the new Church Council's leader is an agent), none → corrupted (town-270), equilibrium → none (town-312) |
| prosperity | 1: Prosperous → Wealthy under a Merchant Council (town-108) |
| institutions | ±1 in 4 towns (the faction boost follows the new seat) |

## 3. The powers with no one on the page

At the 2A tip, 143 powers of 1,000 births stood with no member card, in 136 towns. By cause:

| cause, as the 2A tip stood | powers | what 2B does |
|---|---|---|
| the ruler's own kind, its houses dealt to the ruler first (Religious Authorities under a Church Council or Priestly Guidance; Arcane Orders under an Arcane Council; the military bloc under a Military Council) | 63 | **the fold** (section 1): 62 of the roster's own, 1 rival |
| a density doubled-niche rival with no house left to deal | 33 | **not built** |
| the roster's own bloc with no house of its kind (the military bloc in a village; Arcane Orders in a city with no tower) | 13 | **not built** |
| Arcane Orders under an Arcane Council with no arcane house | 14 | the council of a kind renames the seat, then the orders are not built |
| a power a stress brings (The Peerage, People's Council, War Council, Resistance Network, Quarantine Council, Occupation Authority, Reform Congregation) | 20 | **left standing**, put to the chair (one more arises at this tip: 21) |
| **total** | **143** | |

**The cure, inside R-P4 and R-P5.** R-P4's mint is for a power with no archetype row in the backing catalogue, and
every power above has one. R-P5 forbids borrowing and a fabricated citizen. So the cure is "the power is not built":
at the resize, a power of the roster's own, or a density rival, that no face-bearing house stands behind leaves the
roster. Its share goes with it, and the resize's conservation restores 100. Where it is of the ruler's kind, its
figure folds into the ruler instead. An `other` power keeps its R-P4 mint. A criminal power stands outside the rule
(the veil).

**Why a stress's power is left standing.** The first cut also dropped those, and soak1k-2's strongest power, the
Occupation Authority, left an occupied town while the Religious Authorities' card still stood "in the shadow of" it.
A stress's power carries the stress's story.

**After:** 143 → **21** powers with no one on the page, in 20 towns, every one a stress's. **For the chair:** do
these take an R-P4-style mint (the occupier, the quarantine warden, the war council's captain all arrive with the
stress, and no house of the town stands behind them by construction), or do they stand with no one on the page as
R-P5's truth?

## 4. The capture condition (cure (a), the chair's ruling of 2026-11-12)

`hallCapture.js :: hallCaptureOf` reads 'capture' only where an independent criminal power stands. An agent lord
with no criminal power in the town reads at most 'corrupted'. Red first on a fixture; `captureBirthScale` is green;
the pin is untouched.

| 1,000 births | 2A tip | 2B | 2B + cure (a) |
|---|---|---|---|
| none | 767 | 766 | 766 |
| adversarial | 49 | 49 | 49 |
| equilibrium | 84 | 84 | 84 |
| corrupted | 96 | 97 | 98 |
| capture | 4 | 4 | 3 |

## 5. Cards per town, decc7bf15 → this tip (360, through `birthConfig`)

| size | mean | median | towns with one fewer card |
|---|---|---|---|
| village | 8.75 → 7.75 | 9 → 8 | 60 of 60 |
| town | 25.35 → 24.57 | 25 → 25 | 125 of 160 |
| city | 58.54 → 57.75 | 59 → 59 | 79 of 100 |
| metropolis | 80.10 → 79.53 | 83 → 82 | 23 of 40 |

Every move is cure (i) of 2A (the seat's house bears no face where a house leads). 2B moves no card: the folded and
unbuilt powers had no face.

## 6. The council's wake, town by town (1,000 births; 2A tip → this tip with cure (a))

The chair asked for each label the council of a kind moved toward danger, plus the prosperity and institution
moves, each with the rule that moved it. Every one is the new kind's own derivation. None comes from a reader that
lost the leader.

| town | government | label | before → after | the rule that moved it |
|---|---|---|---|---|
| critique-town-275 | Arcane Council → Town Mayor | coup | Holding → **Contested** | the seat's own figure: rulingStructure.js gives an Arcane Council baseGovPower + 8 and a Town Mayor less, so the governing power falls 48 → 44 and `coupContenders` finds the weakest challenger within reach |
| critique-town-40 | Arcane Council → Church Council | capture | none → **equilibrium** | the ruling three of a Church Council is the dean, the granary reeve and a tailor who is an agent of a street gang. One agent in the three gives the agent rung equilibrium (hallCapture.js, design §3.4) |
| critique-town-270 | Arcane Council → Town Mayor | capture | none → **corrupted** | the civic seat's dual-hat leader, the senior craft-guild master, is an agent of a hidden house (the Rookery) and no criminal power stands. An agent lord is corrupted (cure (a)'s own case: a lord who is bought) |
| critique-town-312 | Arcane Council → Town Council | capture | equilibrium → none | the new three hold no agent (toward safety) |
| critique-town-108 | Arcane Council → Merchant Council | prosperity, institutions | Prosperous → Wealthy; 27 → 28 | a Merchant Council lifts the merchant bloc (rulingStructure.js: merchant power × 1.25 where merchants govern); the faction boost then raises Beast trainers for the Merchant Guilds, and the economy reads the extra house |
| critique-town-159 | Arcane Council → Merchant Council | institutions | 48 → 49 | the same boost raises a Coaching inn for the Merchant Guilds |
| critique-town-204 | Arcane Council → Town Mayor | institutions | 23 → 24 | with the Arcane Council gone, the Religious Authorities stand strong enough for the boost to raise a Foundling home |
| critique-town-211 | Arcane Council → Town Council | institutions | 21 → 20 | the Arcane Orders, no longer strong, no longer found the Teleportation circle the boost raised for them |

Legitimacy moved in two towns: 108 (83 → 91, the Wealthy economy) and 211 (38 → 36). `computePublicLegitimacy` reads
the economy.

**The council guard's corpus arm on 1,000.** the governments of a kind with no open house of that kind read **0 of 575** governments of a kind (scratchpad/probe/councilarm.mjs, at fd4db104e).

## 7. The npc ladder's top rung (for the second seat; not landed here)

These readers take the governing faction's top ladder rung as "the ruler":
- `worldPulse/warSeatBooks.js :: rulingSeatId`, through `gratitudeBonds.js :: rulingSeatNidOf` (rungs[0] of the
  governing faction's ladder record). The ruler's traits (`rulerTraits`) and standing (`rulerStanding01`) read the
  same id.
- `worldPulse/gratitudeBonds.js :: seatGratitudeSevToward` (the person-bond read, through the same `rulingSeatNidOf`).

The rungs come from `npcLadderState.js :: eligibleMembersOf`, which sorts by importance, then structural rank, then
npcId. Importance is a card's best rank in ANY power, so every rank-1 card ties at the top band and the codepoint
decides.

The oath holder (`oathHolder.js`) is a separate pick, the codepoint-lowest governing member, by its own recorded
design. It was not the leader at base either.

**How often the top rung is not the leader.** Over 360 births through `birthConfig`
(`scratchpad/probe/ladder.mjs`: the governing faction's rank-1 card against `eligibleMembersOf(...)[0]`): **44 at
decc7bf15, 50 at the 2A tip.** Reproduce with `node ladder.mjs <tree>` over `critique-<tier>-<i>`, village 60, town
160, city 100, metropolis 40.

**The one-line order tried in scratch only, never landed.** In `eligibleMembersOf`, each row carries
`powerRank = (the card's membership in this faction)?.rank ?? 9`, and the sort becomes
`(a.powerRank - b.powerRank) || (b.w - a.w) || (b.rank - a.rank) || compareCodepoint(a.npcId, b.npcId)`. With it, the
leader is the top rung in all four courts of the reader realm (fp-read-2). **The patched twenty-year run gives
exactly the tip's figures: mobilizations 27, scandals 28.**

## 8. The mobilization floor (statecraftExposureBand, the reader realm fp-read-2)

**The test's own count.** The seeded run counts `war_mobilization` entries in the year captures' raw wizard news
(impactKind, else kind), twenty years, head on (`infoStatecraftEnabled`, `informationBrokeragesEnabled`). On that
metric:

| tree | live (head on) | where the number comes from |
|---|---|---|
| decc7bf15 (base) | **306** (per year 6, 1, 51, 24, 29, 52, 52, 52, 35, 4, then 0) | this lane's probe, the test's own code |
| 2A tip and this tip | **27** (6, 0, 19, 2, then 0) | the same probe; the test asserts 27 |

**The 82 in my first report** is the test's own message, "the dark twin: 82". That is the head-DARK figure the floor
was last keyed from, not the base's live figure. The floor of 72 is that dark twin minus 10, keyed 2026-11-09 (SW-8
RENAME-POWERS C1) by the note's standing rule: "the mobilization floor is the dark twin − 10".

The four keyings in the test's note:
- 100 − 10 = 90 (the original);
- 82 − 10 = 72 (2026-11-04, REGISTERS-4);
- 28 − 10 = 18 (2026-11-06, LANDING-7);
- 82 − 10 = 72 (2026-11-09, C1).

Each time the live figure swung with the realm's draw, and the note says so: "these figures are this one realm's
draw, not a curve".

**The mechanism (one court, one town-year).** All mobilizations are Grünbach's (soak-b). Both trees run the same
first war (ramp, deploy at tick 10, demobilize at 71, peace at 74). At tick 101 the base town ramps again with 1.88
months of food, and the tip town cannot: 1.02 months is under `COOL_FOOD_MONTHS_FLOOR` 1.5. The food gap comes from a
different history. Legitimacy and economy first part at tick 12, food at tick 18. At the tip only, "Famine grips
Grünbach" at tick 9 and Steinheim's pact betrayal at tick 13. The first divergence anywhere is at tick 1, in the NPCs'
own acts (sabotage, bargain, reform, suppression), because 2A changes the cast.

**The population (the chair's rule, fixed before the table).** The fall is SYSTEMATIC if any one holds:
- the realms that ever mobilize fall by more than a third;
- total mobilization ticks fall by more than half;
- NPC acts per court-tick fall by more than a fifth.

The population: 20 further realms, seeds pop-1 to pop-20. The recipe is soak-b's own (composeReaderRegion, the
deity case seated, head on, twenty years); only the seed changes. Base decc7bf15 against fd4db104e (2B with cure (a)).
The probe is scratchpad/probe/pop.mjs.

| | base | 2B + cure (a) | change | the rule's line |
|---|---|---|---|---|
| realms that ever mobilize | 20 of 20 | 20 of 20 | 0 | a fall of more than a third |
| realms that mobilize again after standing down | 13 | 12 | −1 | — |
| total mobilization ticks | 804 | 607 | **−24.5%** | a fall of more than half |
| median per realm | 22 | 20.5 | | — |
| spy scandals | 1,072 | 1,104 | +3% | — |
| NPC acts per court-tick, all four kinds | 0.15525 | 0.14736 | **−5.1%** | a fall of more than a fifth |
| sabotage | 0.00008 | 0.00010 | | |
| bargain | 0.02237 | 0.01983 | | |
| reform | 0.12946 | 0.12369 | | |
| suppression | 0.00334 | 0.00374 | | |

Per realm, base/2B: 1: 6/4, 2: 125/117, 3: 21/21, 4: 40/40, 5: 59/59, **6: 146/32**, 7: 26/25, 8: 10/10, 9: 10/10,
**10: 6/41**, 11: 64/66, 12: 11/11, 13: 36/17, 14: 6/6, **15: 29/44**, **16: 154/51**, 17: 15/15, 18: 23/20,
19: 14/14, 20: 3/4. Large swings run both ways.

**Verdict by the rule: NOT SYSTEMATIC.** None of the three lines is crossed. The fall is this realm's draw. The floor
is a driven figure of this wave, named red at this tip as the merge seat's act, and never keyed here.

**The rule the merge seat keys it by** (the test's own note, every keying since 2026-11-04): the mobilization floor is
the head-DARK twin (`infoStatecraftEnabled: false`) minus 10. Measured here: the dark twin reads 71 at decc7bf15 and
**12 at this tip**, so the floor would key at 2. The live figure at this tip is 27. The scandal band (27 to 57) holds
at 28. The upkeep lane, which scales stores, will move it again.

## 9. The residue: the 21 powers with no one on the page, by stress kind (my reading of the chair's rule)

The rule: (a) where the stress has a cast of its own, the face is that cast's named figure; (b) where the stress by
its nature has no single voice, the power is declared leaderless in data, with one declared line on the page; (c)
where neither holds, the power is not built.

| power | count | stress (stressFactions.js) | the crisis cast's roles (crisisCast.js) | my reading |
|---|---|---|---|---|
| The Peerage | 8 | succession_void (a claimant, pool-named) | social: instigator, target | (a) the claimant is the instigator |
| People's Council | 3 | politically_fractured (the popular side) | — (no crisis kind of its own) | (b) a commons' assembly has no single voice |
| War Council | 3 | under_siege, wartime | external: defender (and treater for a siege) | (a) the defender |
| Resistance Network | 3 | occupied | external: face (the occupier's); occasional collaborator | (b) a network, no single voice |
| Quarantine Council | 2 | plague_onset | natural: brunt, lever (a healer, minted when none stands) | (a) the lever, the healer |
| Occupation Authority | 1 | occupied | external: face | (a) the occupier's face |
| Reform Congregation | 1 | religious_conversion | social: instigator, target | (a) the instigator |

None is built by this lane.
