# COHERENCE-POWERS — phase 1 addendum: the chair's six asks of 2026-11-11 (23:10 UTC)

This is scratch only. Nothing under `src/` is pushed. The base is decc7bf15. The corpus uses the same
dials and the same `critique-<tier>-<i>` seeds as before. The 360 corpus is 60 villages, 160 towns, 100
cities and 40 metropolises. The 1,000 corpus is 170 villages, 440 towns, 280 cities and 110 metropolises.

## 1. A-PLUS: a same-kind contender left with no house is folded into the ruler

The scratch folds at the people seam (`castPowers.js :: landMemberships`). A contender of the ruler's kind
that has no member after the deal is removed from the roster, and its figure is added to the ruler's.

| On the same seeds, against before | A (360) | A-plus (360) | A (1,000) | A-plus (1,000) |
|---|---|---|---|---|
| Towns whose count of powers changes | 0 | **59** (61 powers folded) | 0 | **147** (149 folded) |
| Towns where a power figure moved | 0 | 59 (the ruler only: it gains the folded figure) | 0 | 147 |
| Coup label moved | 0 | **22** | 0 | **45** |
| Capture label moved | 17 | 19 | 52 | 55 |
| Legitimacy moved | 0 | 0 | 0 | 0 |
| Stability moved | 0 | 0 (see note) | 0 | 0 (see note) |
| Power relationships left naming a folded power | — | 12 (of 224 in those towns) | — | 25 (of 587) |
| Quarrels left naming a folded power | — | 0 | — | 0 |
| Cards still naming a folded power | — | 1 | — | 13 |

All coup-label moves go one way, toward safety, because the folded rival no longer challenges the seat:

| Coup label, before → A-plus | 360 | 1,000 |
|---|---|---|
| Contested → Holding | 13 | 26 |
| Critical → Contested | 4 | 7 |
| Contested → Stable | 2 | 4 |
| Holding → Stable | 2 | 3 |
| Critical → Holding | 1 | 5 |

**Note on legitimacy and stability.** `computePublicLegitimacy` reads the economy, the defence and the
tier, not the roster, so it does not move. Stability is computed when the roster is built
(`rulingStructure.js :: buildGovernanceLabels` reads the factions), before the people seam. A fold at the
seam cannot move it, so this scratch does not measure stability.

A-plus done properly must fold where the roster is built (the deal is pure over institutions and powers,
so it can run there). That puts it in `rulingStructure.js` and the density resize, both outside my
charter's files: PRESUME holds `rulingStructure.js`. The relationships that name a folded power (12 and
25) would then never be written. Done at the seam, they dangle.

## 2. The capture distribution (1,000 births)

| State | Before | A | A-plus |
|---|---|---|---|
| none | 655 | 652 | 652 |
| equilibrium | 89 | 90 | 87 |
| adversarial | 160 | 153 | 156 |
| corrupted | 91 | **102** | **102** |
| capture | 5 | 3 | 3 |
| Leaders who are agents | 25 | **35** | 35 |
| Agents in the ruling three (sum over towns) | 81 | 91 | 91 |

The distribution holds in shape: none, equilibrium and adversarial each move by less than 5%. Corrupted
rises by 11 (12%), and leaders who are agents rise from 25 to 35. The cause is the new leader. Before, the
leader was the office face. Now it is a house face, and some of those carry a hidden allegiance; the
office faces carried fewer. That is the same rule applied to new people, as the chair reads it, but it
shifts the mix toward a corrupted hall.

## 3. The feudal rows, both ways

| Government | Size | Way 1 (the proposal's table) | Way 2 (on the model of Mayor and Lord Mayor) |
|---|---|---|---|
| Feudal Stewardship | thorp–village | **Lord Reeve**: a local man the lord raises, with house and office; the steward stays at his side as the second | **Reeve**: a local man the lord raises, with house and office; the steward is the man sent in, as the second |
| Elected Reeve | village | Reeve: house and office, chosen by the peasants | Reeve: house and office, chosen by the peasants |
| Feudal Appointee | town | the Lord's Steward: **appointed**, no house | **Lord Reeve**: a local man the lord raises, with house and office; the steward or bailiff is the man sent in, as the second |
| Noble Governorship / Ducal Governorship / Royal Authority | city–metropolis | Governor / Ducal Governor / Royal Governor: appointed | the same |

Way 2 turns the Feudal Appointee from an appointing government into a dual-hat one. The guard's list of
appointing governments then loses that row. In the corpus that is 13 town leaders who gain a house, and
the leader count with a house goes from 275 to 288. In both ways the man sent in is a face the town
already has: the steward house's face. No card is minted.

## 4. A ruler of a kind with no house of its kind: 14 of 33 Arcane Councils

There are two cures. **The seat recommends the first: don't draw that government.** The roster already
reads the town's houses before it names the government: `rulingStructure.js` sets `hasNobleInst` from the
institutions, and it reads a mage, wizard, alchemist or arcane house when it sizes the arcane power's
figure. The council names (`Arcane Council` and the rest) are chosen from the priorities alone, and that
is the gap. The cure is one condition: a council of a kind is drawn only
where the town has a house of that kind, else the next priority, else Town Council. That changes the
government label in about 14 of 360 towns, all members of the class.

The other cure, raising a house as the coherence repairs raise walls, adds an institution. That moves the
roster, the economy's reads, the face census and the cast, which is a wider wake. It also invents a tower
to justify a label.

Either way the file is `rulingStructure.js`, which PRESUME holds, so this waits with phase 2. Only arcane
has the gap. Every religious, military, merchant and noble ruler in the corpus has a house of its kind.
Criminal rulers lack one in 7 of 28, but they stand outside the guard.

## 5. The veil: a hideable house in a ruling three

**No new leak, so no stop.** I traced Celoki's front man (`npc_veiled_…`, house "Front businesses", veiled).

- **The public projection** (`publicSafe.js :: toPublicSafe`) prints a veiled face by name only: no title,
  no role, no institution, no memberships. The ruling three is not projected at all, because public cards
  carry no memberships. Before and after, all 681 veiled faces are name-only.
- **The player record** (`publicVeiledRecordOf`, which the power and defence desks read in player view)
  strips the title and the role. It keeps `institution` (its key and its title) and the memberships, as
  it does today for every veiled face. A grep for `institution.title` and `institution?.title` under
  `src/components`, `src/domain/display` and `src/domain/dossier` finds no reader. I found nothing that
  prints the kept institution title.
- **Before the change**, 293 veiled faces already rank in some legitimate power's three: the guild's push
  of ALLEGIANCE-CAR2, by design. Under A, 3 of 360 towns have a veiled face in the ruling three (0
  before). The Power tab names them there by name only, exactly as it already names them in the Merchant
  Guilds' three.
- **The dual-hat leader** is never a veiled face: the picker excludes them, and the corpus has 0 veiled
  leaders.
- **To check, not a stop:** `publicVeiledRecordOf` keeps a veiled face's `institution.title`. Today no
  reader prints it. A future reader that did would leak "the front man". The record's strip could drop
  it beside `title` and `role`. That is VEIL's file, not mine.

## 6. The guard, written first (tests only)

`tests/generators/people/powersDualHat.test.js` holds 13 seeds and three checks:
- the leader has a house of the town unless the government appoints (criminal rulers aside, because of
  the veil);
- a ruler of a kind has its kind among its first three where the town has such a house;
- a ruler of a kind has a house of its kind in the town.

At decc7bf15 it is red on 17 of 39 rows: 10 for the first check, 6 for the second, 1 for the third
(Arcane Council at critique-town-0). The red rows are phase 2's to turn green. These are new failing
titles, named here as this lane's, and none is banked.

On the scratch rule A, the same file is red on 2 of 39 rows, both critique-town-0. That is the Arcane
Council with no arcane house, so its leader has no house of its kind to come from. Item 4's cure turns
both green.
