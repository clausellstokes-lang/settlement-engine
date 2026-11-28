# (D) WHO COULD SPEAK ON EACH CARD

Tree 777733a2a; C and V as in (A). The counts are a script's (CONFIRMED: `extract.mjs`, using the tree's own readers).
The fields are read from the code.

## The people of the record who belong to the thing

| kind | who | found by |
|---|---|---|
| institution | the house's FACE (the card's own `Connection:` row), then every other person of the house | `people/cardPowers.js :: facesByHouse(npcs)` on `npc.institution.key === inst.name`, else `dossier/seatHolder.js :: seatHouseFaceOf(settlement, house)`; the rest by `cardHouseOf(npc) === inst.name` |
| power | its members, first / second / third by rank, then unranked | `people/membership.js :: membersByRank(npcs, power)` over `npc.memberships[]` (the same list the card's members line prints) |
| tension | the members of the tension's parties that are powers of the roster | `history.currentTensions[].factions[]` matched by name against `derivePowerStrata(..).roster`, then `membersByRank`. **A tension names its parties as words, mostly not roster powers** ("Reformers", "Complicit beneficiaries"), and its text names no person of the record (0 on C) |
| tradition | the face of each house, and the first three members of each power, that the tradition's own description names as its keeper | `traditions/traditionDescription.js :: describeTradition(rec, settlement, { audience, set }).named` (houses, powers). The rec's own `ownerKey` is null in the preview draw |
| crisis | the cast: every person row of the crisis's cast, with the role (instigator, brunt, lever, target …) | `crisis/crisisPage.js :: composeCrisisPage(settlement)[].cast[]` of `kind: 'npc'` (the DM's edited cast where the DM spoke) |
| person | the person (the chair's one choice: a line of their own) | `npc` |

## THE ONE FUNCTION: "may this reader see this person" (as a signed speaker)

**`src/domain/people/cardPowers.js :: isHousePublic(card)`** (line 192) is `cardInstitutionVeilOf(card) === 'public'`
(line 183). The predicate itself lives in `people/cardVeil.js`: `isHideableHouse` (criminal by category, clandestine by
facet, an illegal brokerage) and `isVeiledPower` (a hidden or criminal power). It is applied ONCE, at birth, by every writer
of a card's house, which stamps `npc.institution.veiled` (`stampVeil`) and `npc.memberships[].veiled`
(`stampMembershipsVeil`). The readers READ the stamp and never re-derive it, and an unstamped card is veiled (fail-closed).
`cardInstitutionVeilOf` is that one read. Its callers are `display/publicSafe.js` (`veiledCardIdsOf`: a veiled card loses
house, title and role on every public payload, and so do the ties' roles), `seat/holderOfSeat.js`,
`generators/narrativeGenerator.js` and `generators/npcDisplayNames.js`.

A person's CARD is never hidden (existence is public, X-21b). What the reader loses is the person's house, title and role,
and those are exactly what a signature "<Name>, <role>" prints. So a quote signed by a veiled face would either name a
house the veil hides or print an unsigned name: **a lawful speaker is a card with `isHousePublic(card)` true**. The DM can
also hide a card's depth field by field on a share (`display/galleryVeil.js :: CARD_KINDS.npc.fields`; a card-level
delta expands to every depth field), so a share-time stamp of the quotes must also drop a quote whose speaker the DM
veiled. The design's fail-closed share avoids this until VOICES-ON-SHARE. The hidden allegiance (`npc.allegiance`,
`allegianceOf`) is a DM-only field on a public card, which is what lets the one liar be a lawful, public speaker.

Corpora: C. "Lawful" = a named person whose house the public may see (`cardPowers.js :: isHousePublic`).

| cards with at least one lawful speaker | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| crisis | 27/50 (54%) | 29/49 (59%) | 51/56 (91%) | 48/53 (91%) | 47/48 (98%) | 40/41 (98%) |
| institution | 250/1254 (20%) | 554/1675 (33%) | 1237/2191 (56%) | 3749/4918 (76%) | 8610/10384 (83%) | 11690/13985 (84%) |
| power | 159/164 (97%) | 180/184 (98%) | 353/356 (99%) | 591/596 (99%) | 966/966 (100%) | 1202/1204 (100%) |
| person | 171/192 (89%) | 502/535 (94%) | 1181/1198 (99%) | 3627/3739 (97%) | 8595/9138 (94%) | 11724/12589 (93%) |
| tradition | 151/220 (69%) | 151/226 (67%) | 251/300 (84%) | 395/450 (88%) | 598/675 (89%) | 833/896 (93%) |
| tension | 16/155 (10%) | 17/158 (11%) | 35/238 (15%) | 47/234 (20%) | 84/380 (22%) | 100/377 (27%) |

| cards with NONE (of which: only a veiled or criminal face) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| crisis | 23 (9) | 20 (11) | 5 (1) | 5 (0) | 1 (0) | 1 (0) |
| institution | 1004 (10) | 1121 (19) | 954 (10) | 1169 (112) | 1774 (543) | 2295 (864) |
| power | 5 (0) | 4 (0) | 3 (1) | 5 (1) | 0 (0) | 2 (2) |
| person | 21 (21) | 33 (33) | 17 (17) | 112 (112) | 543 (543) | 865 (865) |
| tradition | 69 (0) | 75 (0) | 49 (0) | 55 (0) | 77 (0) | 63 (0) |
| tension | 139 (0) | 141 (0) | 203 (0) | 187 (1) | 296 (0) | 277 (0) |
| tension: a party of the roster (the only route to a speaker) | 16 | 17 | 35 | 48 | 84 | 100 |
| tension: a person named in its own text | 0 | 0 | 0 | 0 | 0 | 0 |
| institution: a face (the Connection row) | 260/1254 | 573/1675 | 1247/2191 | 3861/4918 | 9153/10384 | 12554/13985 |

| one person the ONLY lawful speaker of more than one card (of crisis, institution, power, tradition, tension) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| towns (of 150) | 139 | 114 | 144 | 148 | 149 | 150 |
| such people | 144 | 121 | 243 | 337 | 422 | 499 |


## Reading the numbers (CONFIRMED counts; reading PLAUSIBLE)

1. **Powers and the crisis are well served.** 97 to 100% of power cards have a lawful member, because the cast seats
   people in the powers. The crisis has a lawful cast member in 54 to 98% of cases (low in thorps and hamlets, where the
   crisis's lead role often falls to a veiled face or to nobody).
2. **Institutions are served from the village up** (a lawful speaker on 56 to 84% of houses, C). In thorps and hamlets most houses are
   the fabric of the place (the dwellings, the well, the walk to the next church) and have no face: 20% and 33% have a
   speaker.
3. **Tensions are the kind with no speaker.** 73 to 90% of current tensions have no lawful speaker, because their parties
   are words, not powers of the roster. A tension card could only speak through a new route (the aggrieved by trade or
   category, as the voices measure's rung 1 did by topic). **That is a design choice to put to the owner**, not something
   the record answers.
4. **Traditions:** 69 to 93% have a keeper with a lawful face or member (lowest in thorps, where the keeper is often the
   one ruling power and its one person).
5. **One person, many cards.** In 114 to 150 of 150 towns at every size, some person is the ONLY lawful speaker of two or
   more cards. In a thorp that is the one named person, who is the face, the ruler's member, the tradition's keeper and the
   crisis's cast at once. Under "one quote a person a page" that person speaks once and the other cards are silent.
   **The rule, not the odds, sets a small place's voice.**
6. **Veiled faces are removed as speakers:** 21 to 865 person cards a size on C are veiled faces (the criminal and
   clandestine houses' people). They are also the cast's lead in some crises ("instigator").
