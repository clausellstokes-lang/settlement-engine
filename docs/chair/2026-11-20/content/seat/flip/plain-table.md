# What changes when the contest rule is switched to the rule as designed

*For the owner. A measure only; nothing in the product moved. Fortune is off, so every figure here is **under today's standing**.*

We took the same 600 places a visitor gets (100 of each size, the same seeds), born under the seat law, and read each place's seat twice: once under **today's contest rule** and once under **the contest rule as designed**.¹ Nothing else differs between the two readings.

## The short answer

- **Calm places that start or stop reading contested: 0 and 0.** Your headline does not move.
- **30 of 600 places** list their challengers differently (in 18 a challenger leaves or comes in; in the rest the same powers change order); **3** show a different risk word; **111** print anything different in the seat's list on the Power tab, and in 80 of those the only difference is that a craft guild the page called "Merchant" is now called "Craft".
- Who leaves the challengers: craft 13, criminal 5. Who comes in to take their places: arcane 4, merchant 4, military 3, government 1, noble 1, religious 1.

## By size

| | thorp | hamlet | village | town | city | metropolis | all |
|---|---|---|---|---|---|---|---|
| places | 100 | 100 | 100 | 100 | 100 | 100 | 600 |
| (1) the list of challengers changes (who, or their order) | 0 | 1 | 1 | 6 | 11 | 11 | 30 |
| … of which a challenger leaves or comes in | 0 | 1 | 1 | 3 | 6 | 7 | 18 |
| (2) the risk word changes | 0 | 1 | 1 | 1 | 0 | 0 | 3 |
| the kinds among the challengers change | 0 | 1 | 1 | 3 | 6 | 7 | 18 |
| the Power tab's seat list prints differently | 0 | 1 | 5 | 41 | 34 | 30 | 111 |
| … of which only a craft guild's kind word ("Merchant" → "Craft") | 0 | 0 | 4 | 34 | 23 | 19 | 80 |
| calm places turning contested · stopping | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |

### (1) Who leaves the challengers, and who comes in, by kind

Counted by power: a power that leaves the top three, and the power that takes its place (a kind already among the challengers can come in again).

| size | leave | enter |
|---|---|---|
| thorp | none | none |
| hamlet | criminal 1 | none |
| village | criminal 1 | none |
| town | criminal 3 | religious 1 |
| city | craft 6 | arcane 3, military 2, merchant 1 |
| metropolis | craft 7 | merchant 3, arcane 1, government 1, military 1, noble 1 |
| **all** | craft 13, criminal 5 | arcane 4, merchant 4, military 3, government 1, noble 1, religious 1 |

### (2) The risk word: from which to which

The risk word is the seat's four-step ladder (Stable · Holding · Contested · Critical. The seat could fall), the engine's one reading of it (`rulingPowerCoup.js :: coupRiskLabel`), which the Power desk reading (`powerDeskRead.js`) and the printed campaign document (`printProse.js`) carry. The Power tab's own chip on the ruler is coarser (Uncontested · Contested · Critical) and is shown in the six places below.

| from → to | thorp | hamlet | village | town | city | metropolis | all |
|---|---|---|---|---|---|---|---|
| Contested → Holding | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| Holding → Stable | 0 | 1 | 1 | 0 | 0 | 0 | 2 |

### (3) Six places, one of each size, before and after, as the Power tab prints them

Each block is the Power tab's "Seat and Its Contenders" list as it prints it: the heading, then one line a power (role · name · kind · strength · and, on the ruler, the risk chip), read through `dossier/powerStrata.js :: derivePowerStrata` with the heading, the kind word and the chip taken from `PowerStrata.jsx` itself. The chip shows only where the desk prose does not already speak the risk. The last line, in brackets, is the four-step risk word (`coupRiskLabel`), not a page line. Chosen where something changed: a changed risk word with a challenger leaving or coming in first, then a changed risk word, then a challenger leaving or coming in, then a change of order, then the page alone; the lowest seed within that.

**thorp**: no place of this size changes at all.

**hamlet, `visitor-hamlet-11`** (born in a crisis). Leaves: The Independent Bloc (criminal). Comes in: nobody.

| today's contest rule | the contest rule as designed |
|---|---|
| The Seat and Its Contenders (2) | The Seat |
| Ruler · Headman's Authority · Government · Dominant · Contested | Ruler · Headman's Authority · Government · Dominant · Uncontested |
| Contender · The Independent Bloc · Other · Significant | (risk word: Stable) |
| (risk word: Holding) |  |

**village, `visitor-village-21`** (born in a crisis). Leaves: The Independent Bloc (criminal). Comes in: nobody.

| today's contest rule | the contest rule as designed |
|---|---|
| The Seat and Its Contenders (2) | The Seat |
| Ruler · Priestly Guidance · Religious · Dominant · Contested | Ruler · Priestly Guidance · Religious · Dominant · Uncontested |
| Contender · The Independent Bloc · Other · Minor | (risk word: Stable) |
| (risk word: Holding) |  |

**town, `visitor-town-91`** (born in a crisis). Leaves: nobody. Comes in: nobody.

| today's contest rule | the contest rule as designed |
|---|---|
| The Seat and Its Contenders (2) | The Seat and Its Contenders (2) |
| Ruler · Merchant Council · Merchant · Minor · Contested | Ruler · Merchant Council · Merchant · Minor · Contested |
| Contender · Craft Guilds · Merchant · Significant | Contender · Craft Guilds · Craft · Significant |
| (risk word: Contested) | (risk word: Holding) |

**city, `visitor-city-25`** (calm). Leaves: Craft Guilds (craft). Comes in: The Order of the Watch (military).

| today's contest rule | the contest rule as designed |
|---|---|
| The Seat and Its Contenders (4) | The Seat and Its Contenders (4) |
| Ruler · Corrupt City Council · Criminal · Strong · Contested | Ruler · Corrupt City Council · Criminal · Strong · Contested |
| Contender · Military/Guard · Military · Minor | Contender · Military/Guard · Military · Minor |
| Contender · Merchant Guilds · Merchant · Minor | Contender · Merchant Guilds · Merchant · Minor |
| Contender · Craft Guilds · Merchant · Minor | Contender · The Order of the Watch · Military · Minor |
| (risk word: Holding) | (risk word: Holding) |

**metropolis, `visitor-metropolis-16`** (calm). Leaves: Craft Guilds (craft). Comes in: The Merchant Bloc (merchant).

| today's contest rule | the contest rule as designed |
|---|---|
| The Seat and Its Contenders (4) | The Seat and Its Contenders (4) |
| Ruler · Grand Guild Consortium · Merchant · Strong · Contested | Ruler · Grand Guild Consortium · Merchant · Strong · Contested |
| Contender · Military/Guard · Military · Minor | Contender · Military/Guard · Military · Minor |
| Contender · Arcane Orders · Arcane · Minor | Contender · Arcane Orders · Arcane · Minor |
| Contender · Craft Guilds · Merchant · Minor | Contender · The Merchant Bloc · Merchant · Significant |
| (risk word: Holding) | (risk word: Holding) |

## What becomes of a craft guild

Today a Craft Guild is read for the contest by its category, and the generator files the Craft Guilds under `economy`, which today's reader folds to **merchant** (`factionArchetypes.js :: factionArchetype`, `CATEGORY_MAP.economy`). So today a craft guild contends as a merchant power, and the Power tab even labels it "Merchant". Under the rule as designed the contest reads a power's own kind (`seat/seatTable.js :: contestKindOf` → `ownKindOf`, which reads craft off the name: `/craft|artisan/`), so the guild is a **craft** power, labelled "Craft". A craft power presses its claim less hard than a merchant power: the push each kind brings to a coup is `rulingPowerCoup.js :: COUP_COERCION`, merchant 0.95 and craft 0.85, so the guild's weight in the contest falls by about a tenth with the same strength behind it (every circumstance factor stays 1). Where a craft guild was third and a rival sat within that tenth, the rival now passes it and the guild drops out of the top three. Of the craft powers that leave the challengers here, today's reader had called them: merchant 13.

## What becomes of a criminal power

It leaves the open field. Under the rule as designed, any power that is criminal by category or **hidden** reads "criminal" for the contest first, whatever its name says (`seat/seatTable.js :: contestKindOf`, the veil step `isVeiledRow`), and the contest never admits a criminal power (`rulingPowerCoup.js :: coupContenders`, "Criminal factions never vie for power openly — the capture ladder is their path"). Today a power criminal by category is already kept out, but a hidden power that is not criminal by category still contends under the kind it shows. Of the 5 such powers that leave the challengers here, 5 are hidden and 0 are criminal by category; today's reader had called them: other 5. Their road to the seat is the one the game already gives them: **capture**, the slow climb of a faction its corrupt members pull down (`worldPulse/factionCapture.js :: advanceFactionCapture`, none → adversarial → equilibrium → corrupted → capture), and **the DM's own event**, "change ruling power" in the Event Composer, which may hand the seat to any power but the one holding it, hidden ones included (`events/affordanceManifest.js :: rulingPowerTargets`, `CHANGE_RULING_POWER`; `events/mutateWorld.js :: changeRulingPower`). The game never stages it as a coup on its own.

---

¹ "Today's contest rule" is arm **D**: the dial `seat/seatCircumstances.js :: SEAT_CONTEST_LIT` dark, as committed. "The contest rule as designed" is arm **L1**: the same dial lit, `SEAT_CIRCUMSTANCE_TUNING` untouched (every factor 1); the flipped scratch copy (both dials of the flip) was the L1 tree. Every place was born `{ ...birthConfig(config), _seatLawVersion: 2 }` (the law forced after `birthConfig`, as `../u4/measure-lit.mjs` forces it), on the visitor pool (`measure-lit.mjs :: visitorJob`, `visitor-<size>-0..99`), fortune off.

**Calibration: PASSES.** This run's D and L1 aggregates on this pool (the contender table, the risk ladder by size calm and crisis, protection, circumstances, markers, roads, threats) and their pairing EQUAL `../u4/measure-lit.json` (`pools.visitor` `seat-D`, `seat-L1`, `seat:D->L1`, measured at `213ec7cbbb6da480457f2089f1f9bddc157126a6`): field or risk moved in 111 of 600 (measure-lit 111); top-three kinds moved in 18 (18); leave craft 13, criminal 5; enter arcane 4, merchant 3, government 1, noble 1, religious 1. Every place's re-birth for the page reading hashed equal to the instrument's whole born record (600 of 600, both arms).

One command: `node docs/chair/2026-11-20/content/seat/flip/plain-table.mjs all <D tree> <L1 tree> <work dir>` (each tree a checkout of the cut with `node_modules`; the L1 tree carries the flip). Written 2026-11-20T20:46:56.234Z, re-made by `report` from the rows of an earlier `all`. The numbers in full: `plain-table.json` (every changed place by seed).

