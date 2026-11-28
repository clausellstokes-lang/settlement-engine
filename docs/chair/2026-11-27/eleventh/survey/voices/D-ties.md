# (D) THE PERSON WITH A CRIMINAL TIE

Tree 682667fe2. Script counts CONFIRMED (`cd/cd.mjs`, C and V, 900 births each); readings PLAUSIBLE where marked.

## How the record holds the tie

- **The one field: `npc.allegiance`**, read through ONE reader: `src/domain/people/allegiance.js :: allegianceOf`. Its shape is `{ power, house, vector, via, handler, share, veiled: true, covert: true }`. It is born by `dealAllegiances` at the coherence seam (`generators/people/castPowers.js :: landMemberships`, then the deal, then `rankPowers`). Four gates: the card has a corruptible flaw (`corruption.js :: npcCorruptibleFlaw`); it is NOT a criminal face (`isCriminalFace`: a criminal house's face, or a criminal power's minted face); the roster holds a criminal house WITH a face (J-4); and a chance scaled by the corruption climate and `organizedCrimeOf`. `hiddenMembershipOf` is its membership-shaped view for the readers that loop memberships. `npcProfile.js:603-605` exposes it as DM-only (`corruptionVector`, `allegiance`, "covert"). This field is exactly "a legitimate person with a criminal tie".
- **The veil bits** (`src/domain/people/cardVeil.js`): `institution.veiled` (the card's house is hideable: criminal by category, clandestine by facet, an illegal brokerage) and `memberships[].veiled` (a `hidden` power or a criminal one), stamped at birth by every writer (`representatives.js`, `castPowers.js`, the v1 to v2 migration, the edit layer's reassignment). They are READ, never re-derived, by `display/publicSafe.js`, the SQL sanitiser (migration 206), `display/galleryVeil.js`, `seat/holderOfSeat.js` and `seat/seatTable.js`, `people/cardPowers.js :: cardInstitutionVeilOf / publicMembershipsOf`, `facts/factVocabulary.js`, `dailyLife.js` and `dailyLife/outsiderImpressions.js`, and `traditions/shownTraditions.js`. A second, rarer form of the tie is a legitimate house face holding a membership stamped `veiled` in a criminal or hidden power.
- **The third form is stored tie prose** (`relationships[]`, the npc1/npc2 strings) between a legitimate person and a criminal face. These strings are public today, and the second reader of 118 counted 199 to 207 strings that leak a veiled face's title. Every town with a criminal face holds at least one such tie (the counts below are equal). That makes the stored tie too common to serve as the liar's mark.

## Counts by size


**C** | thorp | hamlet | village | town | city | metropolis | all
|---|---|---|---|---|---|---|---|
| towns | 150 | 150 | 150 | 150 | 150 | 150 | 900 |
| towns holding a criminal house on the roster | 10 | 18 | 10 | 69 | 145 | 150 | 402 |
| towns holding a criminal face (house face or a criminal power member) | 10 | 18 | 10 | 69 | 145 | 150 | 402 |
| **towns with at least one legitimate person holding a hidden allegiance** | 0 | 0 | 1 | 46 | 123 | 148 | 318 |
| **towns with more than one** | 0 | 0 | 0 | 20 | 102 | 134 | 256 |
| such people | 0 | 0 | 1 | 72 | 364 | 535 | 972 |
| towns where a legitimate house face holds a membership stamped veiled (a criminal or hidden power) | 0 | 0 | 0 | 3 | 6 | 26 | 35 |
| towns where a legitimate person has a stored tie (relationships[]) to a criminal face | 10 | 18 | 10 | 69 | 145 | 150 | 402 |

**V** | thorp | hamlet | village | town | city | metropolis | all
|---|---|---|---|---|---|---|---|
| towns | 150 | 150 | 150 | 150 | 150 | 150 | 900 |
| towns holding a criminal house on the roster | 8 | 15 | 7 | 56 | 131 | 146 | 363 |
| towns holding a criminal face (house face or a criminal power member) | 8 | 16 | 7 | 57 | 131 | 146 | 365 |
| **towns with at least one legitimate person holding a hidden allegiance** | 0 | 4 | 1 | 36 | 104 | 108 | 253 |
| **towns with more than one** | 0 | 0 | 0 | 21 | 82 | 83 | 186 |
| such people | 0 | 4 | 1 | 76 | 408 | 520 | 1009 |
| towns where a legitimate house face holds a membership stamped veiled (a criminal or hidden power) | 0 | 0 | 0 | 26 | 49 | 54 | 129 |
| towns where a legitimate person has a stored tie (relationships[]) to a criminal face | 8 | 16 | 7 | 57 | 131 | 146 | 365 |

The `via` of the allegiances (how the tie reaches the person's own house; `allegiance.js :: viaOf`): C front 456, retainer 308, office 208; V front 467, retainer 329, office 213. Of the holders' own cards, C 965 are house faces and 7 minted power faces; V 998 and 11.

**What this does to "at most one a place".** The cap binds in most places that have a liar at all: more than one holder in C 256 of 318 towns and V 186 of 253. The holders cluster in towns and up: on C 0 thorps, 0 hamlets, 1 village; on V 0, 4, 1. **The deliberately false quote is a town-and-city feature.** Small places, which are most of what a DM reads by count, will almost never carry one.

**Would the ranking give a holder a line at all?** With (B)'s strict ranking (C / V): a holder speaks in 232 of 318 / 189 of 253 such towns; 374 of 972 / 412 of 1,009 holders speak, 476 / 556 lines in all. Of those lines, 56 / 88 are about safety or crime, and 28 / 29 name the holder's own house. So the liar's line is there to be had, but the plain ranking hands the holder an ordinary line on their own trade far more often than one the tie touches. The lie needs its own pick: choose the holder, then the one line the tie touches. Do not hope the ranking lands on it.

## What the tie "touches", as the record can name it

The record names four things, all on the allegiance row and the cards it points at:
1. **The holder's own house** (`institution.key`, e.g. *Parish church*, *Craft guilds (30-80)*, *State granary complex*) and **the way the tie runs through it** (`via`): `front` (the house fronts for the criminal house: its trade, its stock, its books), `office` (an office-shelf house, the seat or a minted face: its rulings, its inspections), `retainer` (a hired hand: what they see and carry).
2. **The criminal house** (`allegiance.house`, e.g. *Smuggling waypoint*, *Black market*, *Thieves' guild (powerful)*, *Whisper market*), and the criminal power when the town holds one (`allegiance.power`: C and V mostly null; *Thieves' Guild* in some metropolises).
3. **The handler** (`allegiance.handler`, a card id, usually a veiled face `npc_veiled_…`, sometimes a named one such as `npc_pawnbroker`).
4. **The vector** (greed, hunger_for_status, fear, forbidden_patron): the reason, not a subject.

So a false quote's subject, as the record can name it, is: **the holder's own house's dealings** (a front denies the trade it carries; an office-holder vouches for the order or the inspection), **crime and safety in the place** (play down the criminal house: "nothing goes missing here"), or **the criminal house by its public face**, where that house is not hidden. Examples (C): dp-village-99, Konstantina Chortasmenos, the priest (Parish church), with *Smuggling waypoint*, via office, greed; dp-city-126, Yngvar Ormsson, the tailor (Tailor's guild), with *Whisper market*, via front; dp-metropolis-14, Aarav Upadhyay, the master of granaries (State granary complex), with *Thieves' guild (powerful)*, via retainer. PLAUSIBLE (the subjects are my reading of the fields; the fields are CONFIRMED).

**One caution for the build.** A false quote about the criminal house names a house the share veil hides whole (`isHideableHouse`). The quote and its DM mark must therefore go through the same server-side veil as the covert tie. The design already says this. The measure shows the subject a liar would most naturally speak to is the hidden one.
