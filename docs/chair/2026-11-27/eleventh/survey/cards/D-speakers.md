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

Corpora: C · V. "Lawful" = a named person whose house the public may see (`cardPowers.js :: isHousePublic`).

| cards with at least one lawful speaker | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| crisis | 27/50 (54%) · 33/55 (60%) | 29/49 (59%) · 47/61 (77%) | 51/56 (91%) · 36/45 (80%) | 48/53 (91%) · 48/53 (91%) | 47/48 (98%) · 40/43 (93%) | 40/41 (98%) · 38/40 (95%) |
| institution | 250/1254 (20%) · 201/1210 (17%) | 554/1675 (33%) · 492/1640 (30%) | 1237/2191 (56%) · 1244/2227 (56%) | 3749/4918 (76%) · 3667/4752 (77%) | 8610/10384 (83%) · 8190/9888 (83%) | 11690/13985 (84%) · 11250/13382 (84%) |
| power | 159/164 (97%) · 158/160 (99%) | 180/184 (98%) · 181/186 (97%) | 353/356 (99%) · 331/333 (99%) | 591/596 (99%) · 556/574 (97%) | 966/966 (100%) · 887/896 (99%) | 1202/1204 (100%) · 1054/1059 (100%) |
| person | 171/192 (89%) · 168/193 (87%) | 502/535 (94%) · 470/507 (93%) | 1181/1198 (99%) · 1202/1214 (99%) | 3627/3739 (97%) · 3580/3678 (97%) | 8595/9138 (94%) · 8138/8636 (94%) | 11724/12589 (93%) · 11250/11990 (94%) |
| tradition | 151/220 (69%) · 155/220 (70%) | 151/226 (67%) · 158/226 (70%) | 251/300 (84%) · 246/300 (82%) | 395/450 (88%) · 377/450 (84%) | 598/675 (89%) · 577/675 (85%) | 833/896 (93%) · 812/896 (91%) |
| tension | 16/155 (10%) · 11/159 (7%) | 17/158 (11%) · 15/157 (10%) | 35/238 (15%) · 25/232 (11%) | 47/234 (20%) · 40/225 (18%) | 84/380 (22%) · 77/380 (20%) | 100/377 (27%) · 92/377 (24%) |

| cards with NONE (of which: only a veiled or criminal face) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| crisis | 23 (9) · 22 (7) | 20 (11) · 14 (5) | 5 (1) · 9 (4) | 5 (0) · 5 (2) | 1 (0) · 3 (2) | 1 (0) · 2 (1) |
| institution | 1004 (10) · 1009 (10) | 1121 (19) · 1148 (16) | 954 (10) · 983 (7) | 1169 (112) · 1085 (93) | 1774 (543) · 1698 (496) | 2295 (864) · 2132 (739) |
| power | 5 (0) · 2 (0) | 4 (0) · 5 (1) | 3 (1) · 2 (0) | 5 (1) · 18 (18) | 0 (0) · 9 (9) | 2 (2) · 5 (5) |
| person | 21 (21) · 25 (25) | 33 (33) · 37 (37) | 17 (17) · 12 (12) | 112 (112) · 98 (98) | 543 (543) · 498 (498) | 865 (865) · 740 (740) |
| tradition | 69 (0) · 65 (0) | 75 (0) · 68 (0) | 49 (0) · 54 (0) | 55 (0) · 73 (0) | 77 (0) · 98 (0) | 63 (0) · 84 (0) |
| tension | 139 (0) · 148 (0) | 141 (0) · 142 (0) | 203 (0) · 207 (0) | 187 (1) · 185 (5) | 296 (0) · 303 (2) | 277 (0) · 285 (0) |
| tension: a party of the roster (the only route to a speaker) | 16 · 11 | 17 · 15 | 35 · 25 | 48 · 45 | 84 · 79 | 100 · 92 |
| tension: a person named in its own text | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 | 0 · 0 |
| institution: a face (the Connection row) | 260/1254 · 211/1210 | 573/1675 · 508/1640 | 1247/2191 · 1251/2227 | 3861/4918 · 3760/4752 | 9153/10384 · 8686/9888 | 12554/13985 · 11989/13382 |

| one person the ONLY lawful speaker of more than one card (of crisis, institution, power, tradition, tension) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| towns (of 150) | 139 · 140 | 114 · 107 | 144 · 135 | 148 · 148 | 149 · 149 | 150 · 149 |
| such people | 144 · 143 | 121 · 114 | 243 · 205 | 337 · 317 | 422 · 412 | 499 · 466 |


## Reading the numbers (CONFIRMED counts; reading PLAUSIBLE)

1. **Powers and the crisis are well served.** 97 to 100% of power cards have a lawful member, because the cast seats
   people in the powers. The crisis has a lawful cast member in 54 to 98% of cases (low in thorps and hamlets, where the
   crisis's lead role often falls to a veiled face or to nobody).
2. **Institutions are served from the village up** (a lawful speaker on 56 to 84% of houses, C and V alike). In thorps and hamlets most houses are
   the fabric of the place (the dwellings, the well, the walk to the next church) and have no face: 20% and 33% have a
   speaker (C; V 17% and 30%).
3. **Tensions are the kind with no speaker.** 73 to 93% of current tensions (C and V) have no lawful speaker, because their parties
   are words, not powers of the roster. A tension card could only speak through a new route (the aggrieved by trade or
   category, as the voices measure's rung 1 did by topic). **That is a design choice to put to the owner**, not something
   the record answers.
4. **Traditions:** 69 to 93% have a keeper with a lawful face or member (lowest in thorps, where the keeper is often the
   one ruling power and its one person).
5. **One person, many cards.** In 107 to 150 of 150 towns (C and V) at every size, some person is the ONLY lawful speaker of two or
   more cards. In a thorp that is the one named person, who is the face, the ruler's member, the tradition's keeper and the
   crisis's cast at once. Under "one quote a person a page" that person speaks once and the other cards are silent.
   **The rule, not the odds, sets a small place's voice.**
6. **Veiled faces are removed as speakers:** 21 to 865 person cards a size on C are veiled faces (the criminal and
   clandestine houses' people). They are also the cast's lead in some crises ("instigator").
