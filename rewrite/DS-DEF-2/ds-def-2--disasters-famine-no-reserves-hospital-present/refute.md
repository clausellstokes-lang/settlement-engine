# REFUTER PACKET (seat opus) — DS-DEF-2 · pool `Disasters & Famine: NO reserves, hospital present`
# STATUS: COMPLETE. 18 units judged (3 spines + 15 faces). 0 FAIL · 0 WITHHELD · 18 PASS.
# CRAFT (pool grain): PASS. 5 speakers. Near-collapse named below, not charged.
# 4 instrument/wiring rows filed — three of them CARD DEFECTS found by executing the card's own grounds.

THE TEST APPLIED: a face is lawful unless the record DENIES it. Silence is permission. Every ground
below was executed against the checkout at `$SC/laneRW-DEF2`, not read off the card. Where the card
and the code disagreed, the code won and the card is the thing corrected (see WIRING).

---

## WHAT I CONFIRMED BEFORE JUDGING (executed, not quoted from the card)

| claim | file:line | result |
|---|---|---|
| `hasHospital` fires on `healer` at village | `src/generators/priorityHelpers.js:64` | ✅ `hasAny(names,['hospital','monastery','healer','friary'])` |
| the healer's menu | `src/data/institutionServices.js:1566-1571` | ✅ Wound closing on p1 (*"Closes cuts, reduces fever, eases pain."*) · Purify food and water on p0.8 · Remove minor disease **off** p0.6 |
| `deriveHealerLabel` → "the healers" | `src/generators/power/governanceNarrative.js:127` | ✅ the engine's own plural label |
| `deriveCouncilLabel` → "the village elders" | `src/generators/power/governanceNarrative.js:101-105` | ✅ seated with no roster read (F1-22's named exception) |
| `Priest (resident)` Healing | `src/data/institutionServices.js:1196` | ⚠ **on: true, p 0.7** — ON, and the card's §2b bar (p≥0.8) omits it |
| `Records` on `Parish church` | `src/data/institutionServices.js:1164` | ✅ on: false, p 0.5 |
| `Graveyard` Burial | `src/data/institutionServices.js:1398` | ✅ on p 1 |
| `Mill` desc | `src/data/institutionalCatalog.js:548-553` | ✅ *"monopoly milling rights"*; variant `institutionDescVariants.js` *"the richest man in the village, and the least loved"* |
| `Farmland` desc | `src/data/institutionalCatalog.js:470-475` | ✅ *"Open-field agriculture with crop rotation."* |
| `Multiple water sources` desc | `src/data/institutionalCatalog.js` | ✅ *"Wells and springs throughout village."* — MULTIPLE, and no cleanliness claim either way |
| `Parish church` desc | `src/data/institutionalCatalog.js` | ✅ *"Stone construction. Mandatory tithes."* |
| no granary row below town | `src/data/institutionalCatalog.js` (`Town granary` at the town section) | ✅ |
| mechanical scan of all 18 units | executed | ✅ zero digits · zero em/en dashes · zero exclamation marks · zero semicolons · zero contractions · zero `will`/`shall` |

---

## THE TIER WORD — THE SELECTOR'S OPEN QUESTION, ANSWERED: **NOT A FINDING**

The selector flagged three units carrying "the town" on a VILLAGE-only preimage and asked to be
overruled or confirmed. **Confirmed: "the town" is not refutable here, and the ground is measured,
not argued.** `grep -o "the town" src/data/dossierStateProse/defense.generated.js | wc -l` returns
**227**. The shipped defense corpus spends the word 227 times, including on `UNWALLED`/no-force keys
that fire across thorp and village (e.g. `defense.generated.js:112`, `:136`). The engine's own
vocabulary uses it tier-blind (`fieldSynonyms.js:51`, "the town's pay for its watch"). F1-31's bar is
a TIER CLAIM, and V-03 fixes its shape by example: *"a town of {name}'s weight" beside "Thorp"* — a
SIZE claim. None of the three units makes one. `{r.tier}` printing "Village" does not deny the
generic English word for a settlement. **The peer selector's seven refusals on another pool were a
selector's taste, not a refuter's floor; this seat does not adopt them.** The three substitutions the
selector prepared are not needed.

---

## THE VERDICTS — one line per unit

`V·F | verdict | floor | the field checked | quote | finding | cure`

### VARIANT 1 — `[ledger]`

- **1·0 spine | PASS | — | `inst.hasGranary` false + `inst.hasHospital` true (`priorityHelpers.js:63`, `:64`), both FROZEN, both the key's own reads** | "Nothing is laid by here against a bad harvest." | Both limbs are engine-held and stand bare in the archiver's hand (ruling 40). "the treating is paid for" is the Healer row's own price with no digit. The durative is licensed twice over (key's own read AND zero pulse writers, ruling 11b). | none
- **1·1 elders | PASS | — | `deriveCouncilLabel` (`governanceNarrative.js:104`); `Dwellings (80-180)` required** | "the answer to a hungry year here is the next house along" | An OPINION from a seated universal source. It does not deny `threatAssessment.js:181`'s "immediate hardship" — it is a claim about the town's PRACTICE, and its own pair half contests it. A speaker's opinion is never a finding. | none
- **1·2 stranger | PASS | — | `Farmland` required, *"Open-field agriculture with crop rotation"* (`institutionalCatalog.js:470-475`)** | "the next house along has the same fields and the same year" | Open-field is exactly a shared loss. No magnitude, no date. Genuine disagreement with its pair half from a different source. | none
- **1·3 register | PASS | — | `Priest (resident)` Healing on p0.7 (`institutionServices.js:1196`) + `Graveyard` Burial p1 (`:1398`)** | "the ones who come to sit up and the ones who come to dig" | Both limbs are ON in the model, so the double duty is asserted, not inferred. "A person of the parish" evades the singular `Parish Priest` the `plague_onset` stress mints (F3-06). The withheld cost is the archiver's report, not a claim. | none
- **1·4 tavern | PASS | — | `deriveHealerLabel` → "the healers" (`governanceNarrative.js:127`); the card's §9 dispute** | "a house sends for the parish when it cannot settle with the healers" | "the healers" is the ENGINE'S OWN label, plural, so the singular `Healer` NPC is untouched. No field fixes the order of resort; silence is permission. Tavern is conditional and car 18c's draw filters it. | none
- **1·5 market | PASS | — | `Mill` Grain milling p1 (`institutionalCatalog.js:548`); F1-44** | "the same sacks that come off the wheel go out of the town" | Grain LEAVING is not denied by any field on this tab: F1-44 records that a `Deficit` village prints "surplus farm trade", so the engine itself puts outbound farm trade on a hungry town. "the day's price" carries no digit. Ruling 32's BILL; two sentences, second bare, which is licensed. | none

### VARIANT 2 — `[street]`

- **2·0 spine | PASS | — | `inst.hasGranary` FROZEN, zero writers under `worldPulse/` (card §6)** | "Why nothing was ever laid in against a bad harvest" | The perfect + "ever" rides a FROZEN field that is also the key's own read — ruling 11b licenses it on both counts. The withheld reason is the licensed device, not an archiver's claim of knowledge. | none
- **2·1 register | PASS | — | `Priest (resident)` Healing on:true p0.7 with NO price; `Healer (divine, 1st level)` desc *"A closed wound costs 10 in gold"*** | "the tending is the parish's to do and nobody's to pay for" | ⚠ **THE CLOSEST CALL IN THE POOL, AND IT CLEARS.** I opened this as a candidate neighbouring-rung finding (§2d: `NO reserves, NO medical provision` prints *"Parish clergy provide basic wound care"*). Executing the menus cleared it: the priest's Healing carries NO price and the Healer's row DOES, so "the parish's tending is unpaid" is the model's own distinction, not the sibling rung. It asserts nothing about the healer's presence, which is what the key fixes. | none
- **2·2 elders | PASS | — | `deriveCouncilLabel`; no field orders the resort** | "the tending falls to the neighbours first and the parish last" | Opinion, seated source, and the pair's kind is correct: it genuinely disagrees with 2·1 on whose the tending is, from a different source. The "no complaint against the parish" rider is the source's own hedge. | none
- **2·3 stranger | PASS | — | F2-04 checked and cleared; the brief's own licence** | "a pedlar was given the name of a household and no other answer" | The past tense reports the ASKING, not a world event that moved a field. The struck-bars list licenses it by name: *"A stranger may act, be turned away, be told the wrong thing, pay twice."* The household is named to the pedlar, never to the reader, so F3-01 is untouched. | none
- **2·4 tavern | PASS | — | `Multiple water sources` required, *"Wells and springs throughout village"*; `Purify food and water` on p0.8 (`institutionServices.js:1568`)** | "the water is fetched from whichever source runs clean" | "whichever source" needs the PLURAL the required row supplies. The purifying-for-a-price limb is the healer's own service at the bar, priced without a digit. The row states nothing about cleanliness in either direction, so neither clause is denied. | none
- **2·5 market | PASS | — | `Wound closing` on p1 (`institutionServices.js:1567`); `hasHospital` FROZEN** | "a house that has paid to have a wound closed buys differently after" | The perfect sits in a restrictive relative clause describing a CLASS of household — the habitual, not an elapsed course over a live field. It rides the key's own frozen read besides. | none

### VARIANT 3 — `[unfolding]`

- **3·0 spine | PASS | — | `Farmland` + `Mill` required; `hasGranary` false; `hasHospital` = a PERSON (`priorityHelpers.js:64`)** | "none of it stops anywhere in between" | ⚠ I pressed this against the port branch (`defenseDisplay.js:245`, *"No reserves, but sea supply continues while port is open"*, `tradeRouteAccess` FROZEN and OPEN across the preimage) and it holds: the sentence denies a STOPPING-PLACE, not an arrival, and its own second sentence forces that reading (the chair's GENERAL FORM). Carries the pool's one `{settlement}` in a unit and no face — ruling 12 met. | none
- **3·1 elders | PASS | — | `Farmland` *"Open-field agriculture with crop rotation"*; `Village reeve` p0.92 NOT named** | "the strips are laid out so that no house is favoured" | The passive is doing real work: it takes the strips from the required `Farmland` row without seating the `Village reeve` (p 0.92, not required) as the allocator. No magnitude in "short for every house". | none
- **3·2 register | PASS | — | `Mill` *"monopoly milling rights"*; `Parish church` *"Mandatory tithes"*** | "the tithe is weighed after the wheel has taken its share" | Both bodies are required rows and both takings are their own rows' words. No field fixes the ORDER, so silence is permission. The perfect is sequential ("after X has happened"), not an elapsed course. ⚠ Its "and not before" is an ANTITHESIS CLOSE — the selector's veto list, **explicitly never a refuter's finding**; recorded under CRAFT, not charged. | none
- **3·3 stranger | PASS | — | `Parish church` required (*"Stone construction"*); `Mill` required; `Farmland` required; `hasGranary` false** | "the church, the wheel and the open fields, and nothing anywhere" | Three required rows and one true absence. I pressed it for a PLACEMENT (the card's §2b) and it states none — it inventories what is found, it does not position anything. No culture-profile furniture (F3-05): no thatch, no churchyard, no market green. | none
- **3·4 tavern | PASS | — | the Healer's price is a ROW value, not a `marketPrices.js` drift good** | "the price for closing a wound is the same price in a bad year" | The engine holds the service price on the institution row and models no year-drift over it, so the face AGREES with the model. "the ones with least to settle with" identifies a class of household; it states no count, share or sum (F2-01). Two sentences, second bare. | none
- **3·5 market | PASS | — | `hasGranary` false; §1.4 **W-07** applies (see WIRING)** | "nobody here buys against a year that has not come" | The only surface that could deny this is the granary CAPACITY reading that falls through at `foodStockpile.js:190-193` with no granary row — and W-07 already rules the ROSTER the record and the reading a wiring debt, so under §R-1 the face stands. "On market day" names an occasion, not a frequency: no rate is asserted (F2-06). | none

---

## CRAFT — POOL GRAIN: **PASS**

**Speakers: FIVE** (elders · register · stranger · tavern · market) — the bar is "fewer than three".

Every one of the six named DULL bars is cleared:

| bar | measured |
|---|---|
| one construction repeated | no — five distinct subjects, verbs and landing nouns per variant |
| the same few nouns | no — sacks, wheel, meal, water, strips, tithe, wound, stalls, fields, church all carry |
| faces that are permutations | no — checked pairwise inside each variant |
| fewer than three speakers | FIVE |
| duller than the shipped rows it replaces | **no, and not close.** The shipped pool is three bare survey abstractions ("arranged against the sickness it has seen and not against the hunger it has not"); this is 18 units, five voices, two live disputes, and concrete furniture |
| no stake in it | no — the elders against the stranger on whether the neighbours are the answer; the parish against the elders on whose the tending is; the wheel taking its share before the church takes the tithe; the households with least to settle with being the ones who send |

**AND THE FOUR COUNTS THE LAST TWO SITTINGS NAMED ARE ALL CLEARED** (this is the test that matters):
one attribution verb on every row — **no** (say 9 · hold 2 · and five frames with no report verb at
all); zero faces carrying two sentences — **no**, two carry two; the same first three words opening a
face in every variant — **no**, zero repeats within any variant; siblings growing more alike after a
cure — **no**.

### THE NEAR-COLLAPSE, NAMED BUT NOT CHARGED

⚠ **The `<adjective> year / harvest` frame carries 9 of the 18 units** — "a bad harvest" ×2 · "a
hungry year" · "the same year" · "the harvest comes in short" · "a short year … short for every
house" · "a worse year" · "in a bad year" ×2 · "a year that has not come". **Variant 3 is four of
five faces.** It is the pool's own subject and the sentences around it differ in subject, verb and
landing, so it is a NOUN-PHRASE concentration and not the construction collapse the verdict charges.
The chair should see it; it is the one axis on which this pool could be improved without touching a
floor, and the cheapest cure is at variant 3 face 3 or face 5.

Also carried forward from the selector's own honest reporting, and confirmed as craft not floor:
sensory nouns 1.99 per hundred words against a bar of 2.00 (under by one hundredth, cause named in
the candidate set); all three spines subject-class where ruling 29 asks for three classes; ruling
36's no-run-of-three breached once in variant 1. **"house/household" also carries 9 of 18 units** —
the unit of survival in a town with no common store, and the second-highest concentration.

Pair kinds audited: pair 1 (elders / stranger) and pair 2 (register / elders) are both `disagree`,
both genuinely disagree, and neither is two faces of one source. No misdescribed kind.

---

## WIRING AND INSTRUMENT ROWS — the frozen/live and card/code seams

**⛔ THREE OF THESE ARE DEFECTS IN THE CARD ITSELF, found by executing its grounds. They charge no
face in this pool. They will charge, or wrongly spare, faces on the sibling pools that reuse §2b.**

1. **CARD DEFECT — §2b's p≥0.8 bar misses a service that is ON.** The card's "what a face may not
   deny" list is built at p ≥ 0.8 and therefore omits **`Priest (resident)` → `Healing`, which is
   `on: true` at p 0.7** (`src/data/institutionServices.js:1196`, *"Divine healing magic for the sick
   and injured"*), on a row that is `required: true` at village. Under §V.0 floor 1 the refuter reads
   the PRINTED roster, and a service flagged `on` prints. **No face in this pool denies it** (2·1,
   2·2 and 1·4 all put the parish's tending on the page), so nothing is charged — but on the sibling
   rung `NO reserves, NO medical provision`, where the parish is the whole provision, this omission
   is the difference between a licensed face and a floor-1 finding. The bar should be `on: true`, not
   `p ≥ 0.8`.

2. **CARD DEFECT — §2b's "no required row states a placement at all" is FALSE.** The `Graveyard` row
   is `required: true`, `baseChance 1` at village and its own printed desc states three placements:
   *"Consecrated ground beside the church, on the parish's own plot"* and *"The ground nearest the
   church wall…"* (`src/data/institutionalCatalog.js:785-791`). The card's §2b prints "(none)". This
   charges no kept face — 3·3 states no placement — but it is the ground on which the selector
   refused two candidates ("the road in passes a mill and a church"; "the fields here run up to the
   houses"), and at least the church-adjacency is now a stated fact of every preimage town.

3. **CARD DEFECT / TWO-SURFACE SEAM — the citation budget is not zero.** The card's §8 bars citing
   the parish register on the ground that `Records` on `Parish church` is `on: false, p 0.5`. But the
   required `Graveyard` row's own printed desc asserts the book: *"the parish has begun keeping the
   names in the same book as the baptisms"* (`institutionalCatalog.js:789`). **Two engine surfaces
   disagree: a service flag OFF against a required row's printed description asserting the record
   exists.** Under §V.0 floor 1 ("the refuter checks the PRINTED roster … not the flag alone") the
   desc is the printed roster. Disposition: **WIRING** — no face is charged in either direction (no
   kept face cites a record), and the provenance-shape hazard of batch 3 is a separate reason to
   leave the budget at zero in practice. But F1-24 is not the ground the card thinks it is here, and
   the next marker should not repeat it.

4. **§1.4 W-07 APPLIES, ALREADY FILED, NO NEW ROW.** `foodStockpile.js:190-193` prints a granary
   capacity reading (1.5/2.0 months) on a town with no granary row. It is the only surface that could
   be read as denying 3·5 and spine 2. W-07's disposition is unchanged: **the ROSTER is the record,
   the reading is the wiring debt, F1-09 still governs the building**, and under §R-1 the face stands.

**NOT WIRING, RULED CLEAN:** the frozen/live seam on `defenseProfile.scores.disaster` (LIVE, one
writer at `foodStockpile.js:473`) — no face in this pool welds an intensity to the badge, so F1-40
and W-10/W-11 do not reach it. The `tradeRouteAccess === 'port'` branch — pressed against spine 3 and
3·3 and cleared on the reading, not waived.
