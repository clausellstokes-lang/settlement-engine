# SECRETS-1 · hand-back: the very rare secrets (BRIEF-SECRETS-1, ruling RS1 and its widenings)

The joined line's tip as given: `7cf3cb9f0`; AMENDMENT 2 proved also in a scratch merge with the line's later tip `fd93fb998`. My tip: `0089fbc4a` (AMENDMENT 3) and this hand-back. My branch: `lane/secrets-rare-2026-11-17`. I merged
nothing. Every run named here was seen to its end; the runners and their outputs are in scratch and named in § The
measures.

## 0. AMENDMENT 2 (the chair's ten, 2026-11-17, by message; not yet on the brief's foot when I read it): DONE AT `0e5ec8421` and `8beed42b2`

This section supersedes what the sections below say of the felon, the faked death, the two "stranger" rows and the
five rows the chair reworded; the rest stands.

**The table of item 2 again, at the tip after these** (the odds unchanged): over the 720, **identical to § 1** —
thorps 115 none · 5 one; hamlets 108 · 12; villages 102 · 18; towns 88 · 30 · 2 two; cities 58 · 42 · 19 two · 1 three;
metropolises 33 · 55 · 29 · 3. Families: deeds 83, natures 85, ties 88, hidden masters 7 (of 360 small places), outsiders
11 (of 720). Over the 150: identical to § 1 (deeds 16, natures 15, ties 14, masters 5, outsiders 3). The same people
carry one (the odds and the eligibility are unchanged); which row each carries moved where a row's conditions did: 126
rows are now seen in the 720 (128 before), and the felon is dealt twice (0 before). fieldDiff, base `7cf3cb9f0` against
this tip: the 720, 216 moved only in the dealt secrets, 0 in any other field; the 150, 42 and 0.

**1. The felon and the faked death**: "in another town" → "in another place"; both stand at any size again (the felon
keeps its route and its offices). **2. "A stranger"**: `paysDebts` and `lostChild` as the chair wrote them. **4. Years
need an age** (a new holder key `minYears`, read through the card's age words, `RARE_SECRET_AGE_YEARS`, now data):
`neverAngry`, `thumbOnScale` forty or older; `spared` thirty or older. **5. `cannotRead`, `oneBook`**: never on a trade of
letters, learning, law, account, faith or magic — the roles: scribe, clerk, teacher, chronicler, librarian, sage,
cartographer, printer, college master, dean, chancellor, postmaster, post's master, message-master, scroll scribe,
charter master, magistrate, notary, lawyer, customs collector, mint master, exchange master, exchange's steward,
auctioneer, banker, assayer, warehouse factor, chief administrator, (the master of) granaries, granary reeve, priest,
abbot, abbess, bishop, almoner, hospitaller, archdruid, circle-keeper, grove elder, wizard, alchemist, enchanter,
archmage, golem-master, necromancer-overseer, dream-keeper, planar factor, fortune teller; and no card of the religious
or the magic category. **6. The card's own lines**: a row that names a `{target}` never names a person the card's own
goal (short or long) or hook names; `nameless` never beside a hook that names kin (sister, brother, son, daughter,
mother, father, parent(s), child(ren), spouse, wife, husband, cousin, uncle, aunt, niece, nephew, grandmother,
grandfather); `promised` never beside a hook that names a spouse (spouse, wife, husband, widow, widower, married,
marriage) (a new holder key `notHookWords`). **7. Four pairings**: `tooHonest` never on a trade of wealth (luxury
merchant, banker, mint master, exchange master, exchange's steward, First Magnate, jeweller, auctioneer); `graveRobber`
never the head of the ruling body or a title of blood; `stoleRelic` also refused beside *pious* and *incorruptible*;
`raisedDead` beside *pious*; `thumbOnScale` beside *candid* and *forthright*. **8. The chair's rewordings**:
`masterBlade`, `masterThief` (and never first of a criminal power: a new office `criminalHead`, a rank-1 standing in a
power whose category is criminal or whose name is the underworld's), `hearsLies`, `runaway`.

**3. A re-roll breaks no cap.** In the deal, a KEPT person's rare secret (known by its words: `rareRowOf` reads every
row's two lines with the name slots open) fills its family's cap in the place, so the re-roll deals no second of that
family; the receipt names it (`kept`). Proved end to end in the guard: `r2r-metropolis-1`'s holder kept by a user's
edit through `regenNPCsPipeline` on three re-roll seeds keeps their secret, and the re-rolled cast holds exactly one of
that family. **A kept card's rare secret that names a person the re-roll replaced KEEPS THE OLD NAME**: measured on 5
born holders of a naming row (`lovesNamed`, `guardian` ×2, `hiddenSpouse`, `oathAgainst`), kept and re-rolled: 5 of 5
name a person no longer on the roster. The cause is not in my files: a re-roll draws a new cast, and the pipeline's one
substitution point (`refreshRosterProse`) skips keepers by design ("their prose may be user-authored"), as it does for
a keeper's crime secret at the base. To cure it would be to rewrite a keeper's secret, which item 4 of the brief
forbids ("a person a re-roll KEEPS keeps the secret they have"). **Named, not cured**: the choice is the chair's (a
keeper's naming row could be re-dealt, or its name followed, in `generateSettlementPipeline.js`, not mine).

**9. The guard, widened** (20 tests): the two exclusions it named (a face drawn from its secret; a crisis pool's own
secret) each asserted; the re-roll end to end, and a kept holder filling its cap over 300 seeds; every hidden master
planted in a thorp and a hamlet as in a village; the 47 magic-only keys pinned by name; one seed shown to pass two of
a family and deal one (the cap's anchor); and each new condition (`minYears`, `notHookWords`, `criminalHead`) planted
and refused beside its anchor.

**Every changed row, old and new** (the data's own diff; the eight rows that name a `{target}` — `hired`,
`blackmailer`, `lovesNamed`, `parentOf`, `owesLife`, `guardian`, `oathAgainst`, `hiddenSpouse` — change in whom they may
name, not in their words):

| row | old → new |
|---|---|
| `felon` | what: "Is wanted for a crime in another town, and came here to be forgotten" → "Is wanted for a crime in another place, and came here to be forgotten"; needs: ["tier: town"] → null |
| `graveRobber` | holder.not: null → ["head","hereditary"] |
| `raisedDead` | holder.deniedBy: null → ["pious"] |
| `paysDebts` | what: "Has been quietly paying off a stranger's debts for years, and will not say why" → "Has been quietly paying off someone else's debts for years, and will not say why"; stakes: "The stranger has found out, and wants to know what is owed in return" → "The one they are paying for has found out, and wants to know what is owed in return" |
| `stoleRelic` | holder.deniedBy: + pious, incorruptible |
| `fakedDeath` | what: "Is supposed to be dead, with a grave and mourners in another town" → "Is supposed to be dead, with a grave and mourners in another place"; needs: ["tier: town"] → null |
| `thumbOnScale` | holder.deniedBy: + candid, forthright; holder.minYears: null → 40 |
| `spared` | holder.minYears: null → 30 |
| `cannotRead` | holder.notRoles: + scroll scribe, charter master, magistrate, notary, lawyer, customs collector, mint master, exchange master, exchange's steward, auctioneer, banker, assayer, warehouse factor, chief administrator, granaries, granary reeve, priest, abbot, abbess, bishop, almoner, hospitaller, archdruid, circle-keeper, grove elder, wizard, alchemist, enchanter, archmage, golem-master, necromancer-overseer, dream-keeper, planar factor, fortune teller; holder.notCategory: null → ["religious","magic"] |
| `neverAngry` | holder.minYears: null → 40 |
| `hearsLies` | what: "Always knows when they are being lied to, and has learned to keep a straight face" → "Always knows a lie when they hear one, and has learned to keep a straight face" |
| `oneBook` | holder.notRoles: + scroll scribe, charter master, magistrate, notary, lawyer, customs collector, mint master, exchange master, exchange's steward, auctioneer, banker, assayer, warehouse factor, chief administrator, granaries, granary reeve, priest, abbot, abbess, bishop, almoner, hospitaller, archdruid, circle-keeper, grove elder, wizard, alchemist, enchanter, archmage, golem-master, necromancer-overseer, dream-keeper, planar factor, fortune teller; holder.notCategory: null → ["religious","magic"] |
| `tooHonest` | holder.notRoles: null → ["luxury merchant","banker","mint master","exchange master","exchange's steward","first magnate","jeweller","auctioneer"] |
| `lostChild` | stakes: "A stranger with that face would be of an age to ask questions now" → "Anyone with that face would be of an age to ask questions now" |
| `promised` | holder.notHookWords: null → ["spouse","wife","husband","widow","widower","married","marriage"] |
| `runaway` | stakes: "One of those people has reached this road" → "One of those people has come this way" |
| `nameless` | holder.notHookWords: null → ["sister","brother","son","daughter","mother","father","parent","parents","child","children","spouse","wife","husband","cousin","uncle","aunt","niece","nephew","grandmother","grandfather"] |
| `masterBlade` | what: "Was captain of a great house's guard, and came here so that no one would ask them to fight again" → "Was captain of a great house's guard, and keeps a quiet watch here so that no one asks" |
| `masterThief` | what: "Was the best lock-breaker of a great city's guild, and lifts nothing here so that no one asks" → "Was the best lock-breaker of a great city's guild, and keeps to small work here so that no one asks"; holder.not: null → ["criminalHead"] |

**At the doors** (the new words): one fresh row came of my own list (the role words "master of granaries", a three-word
literal the things door reads as a granary: written "granaries") and one strip-shaped read in my deal (a hook's
`.text`: the hooks are read as the strings they are). After them: `presumption-classes-door` fresh 0 and
`presumed-things-door` fresh 39 (the line's own), at my tip and in the merge alike. One fact-layers reader of the crime
words in my deal (the thief's office): cured by reading the underworld through the engine's own reading
(`domain/people/allegiance.js :: criminalPowersOf`, which the goals use).

**Proved at my tip (`8beed42b2`) and in a scratch merge of the line's tip `fd93fb998` with it** (`git merge --no-commit`,
local, never pushed; the merge clean):

| | the line `fd93fb998` | the merge | my tip | my base `7cf3cb9f0` |
|---|---|---|---|---|
| my guard + the people's guards (8 files) | — | 98 green | 98 green | (the guard red) |
| `presumption-classes-door --check` | fresh 0 | fresh 0 | fresh 0 | fresh 0 |
| `presumed-things-door --check` | fresh 39 | fresh 39 | fresh 39 | fresh 39 |
| `tests/lint` (red tests) | 65 | 66 | 66 | 65 |

**tests/lint by name:** red in the merge and not at the line, and red at my tip and not at my base: ONE, the same:
`poolDominance.walker` "every drawn pool has a row" (the five `ledger:rareSecrets:*` register rows, owed to the close).
The style law's "a stranger" and the tuning register's named constant are cured; nothing is red at the line or the
base that is green in the merge or at the tip. The mutation-coverage entry my guard owes is still owed (that test is red
at the base and the line with other files).

At the tip also: both type gates green (1113 of 1113; 167 of 167), eslint clean on my files, ONE `npm run build` green with
`vendorPdfLazy` and `bootSmoke` (49 passed, 17 skipped by the files); the 720 born again at `8beed42b2` is byte for byte
the 720 of `0e5ec8421` (the thief's re-reading moves no card).

### 0.3 AMENDMENT 3 (the chair's seven, by message): DONE AT `2c49a67d9`, `60fe5581b`, `0089fbc4a`

It supersedes 0's paragraph on the keeper's old name (the chair ruled); the rest of 0 stands.

1. **The keeper's old name is followed.** A KEPT holder whose secret matches a rare row exactly (`rareRowOf` now captures
   the name slot, the same name in both lines or it is not that row) and whose named person is no longer on the roster
   keeps THE SAME ROW, its name re-filled by the row's own picker under the row's own rules (`namedFor`: never the
   person, never their superior, never one their own lines name, the tie refusals, a generation younger for `parentOf`).
   None fits: left as it is and counted (`receipt.unfollowed`). A user's own words match no row and are never touched
   (the guard plants one). **Of my five measured holders, five re-fill**, each on its own row, each with a person on
   the re-rolled roster: `lovesNamed` (r2r-city-29: Lakshmana Banerjee → Sharda Khanna), `guardian` (r2r-city-56:
   Regina Maier → Ingrid Eisenberg; r2r-metropolis-15: Malati Narayanan → Gayatri Subramanian), `hiddenSpouse`
   (r2r-metropolis-19: Selma al-Malik → Tamim al-Rumi), `oathAgainst` (r2r-metropolis-41: Timofei Đorđević → Luba Đurić).
2. **`superior` reads the card's own lines**: never one the card's own goal or hook names (the row is then not dealt).
3. **A hook of either shape**: a string, or a declared line, whose every string is read (the words, not a draw; read
   without the `.text` unwrap the strip ban names, so the things door's strips stay the line's). **Measured, not cured**:
   the 720 and the 150 store 24,872 hooks on cards, all strings, none object-shaped. Over the 870 births (a probe tree
   recording each holder's hooks at the deal), **327 holders; the assembly's later pass changes the hook of NONE after
   the deal read it, so none ends beside a row it should have refused.**
4. **`masterThief` never a criminal house's head**: beside the rank-1 office, the roles of a criminal house's head read
   from the catalogue's faces — house boss, gang boss, rookery boss, undercity boss, pit boss, the network's head, the
   network's spider, the guildmaster of thieves, the guildmaster, ringleader, outlaw host. It still stands in a small
   place: the 720's thorps, hamlets and villages cast 22 fences, 10 smugglers and 3 bandit contacts (and 7 outlaw hosts,
   1 network's spider and 1 guildmaster, now refused); the no-dead-row test passes.
5. **The guard's three proofs**: the re-roll's positive anchor (before the re-roll the holder has the row, and the town
   holds exactly one of its family); two STANDING candidates of one family in one place, one dealt (`receipt.standing`
   counts every passer a row stands for); each hidden master in a thorp and a hamlet beside the same card in a town that
   holds none. And two tests more: the followed name, and the superior refused beside a goal that names them. 22 tests.
6. **`tooHonest`** never the head of the ruling body or a title of blood; **the kin words by stem** (a word, its plural
   and its possessive, -y to -ies: sister's, sisters, families; `family` and `kin` added to the list), and the
   spouse words likewise.
7. **The rows that left the 720's seen set** (128 at `f1c903c47`, 126 at `8beed42b2`, 124 now). Not two: 13 left and 11
   joined between the first two, as AMENDMENT 2's conditions changed the rows that may stand for a person and the row
   is picked by the hash modulo that list's length. Left: ghost, noTaste, cold, killer (2), wroteSong (2),
   falseWitness (2), nameless, fearsWater, noFaces, thumbOnScale, neverAngry, demon, noSleep. Joined: felon (2), luck
   (2), burnedRecord (4), cursed, sings, noTouch, wishedDeath, paidToForget (2), oathBreaker (2), xenophobe, bearLie.
   Since `8beed42b2`: left savedEnemy, mimic, owesLife, noTouch; joined fearsWater, foresees. Every row still stands
   somewhere (measure 6; the guard's no-dead-row test).

**Changed rows, old → new** (the data's diff; `superior` and the eight `{target}` rows change in whom they may name):

| row | old → new |
|---|---|
| `tooHonest` | holder.not: + head, hereditary |
| `nameless` | holder.notHookWords: + family, kin (and every kin word read by stem) |
| `promised` | its spouse words read by stem |
| `masterThief` | holder.notRoles: + the eleven head roles above |

**The table again** (odds unchanged): the 720 and the 150 as in § 1, to the place and the family: the same people carry
one. fieldDiff, base `7cf3cb9f0` against `0089fbc4a`: the 720, 216 moved only in the dealt secrets, 0 in any other field;
the 150, 42 and 0.

**Proved at `0089fbc4a` and in a scratch merge of the line's tip `fd93fb998` with it** (`--no-commit`, never pushed):
my guard and the people's guards 8 files, 100 green at both; `presumption-classes-door` fresh 0 and
`presumed-things-door` fresh 39, strips fresh 0, at both (the line's own); tests/lint by name: red in the merge and not
at the line, and red at my tip and not at my base, ONE, `poolDominance.walker` (the five `ledger:rareSecrets:*` rows,
the close's); nothing green at the line or the base is red in the merge or at the tip but that. The type ratchet, the
strict domain gate and eslint ran green on each push (the pre-push hook) and eslint alone on my files; the one build
(`8beed42b2`) stands: no import has changed since.

## 1. HOW RARE, AS BORN (the table of item 2, first)

**In plain words.** Over the census's 720 towns (120 of each size), at the tip:

| size | places | none | one | two | three | share holding any |
|---|---:|---:|---:|---:|---:|---:|
| thorp | 120 | 115 | 5 | 0 | 0 | 4% |
| hamlet | 120 | 108 | 12 | 0 | 0 | 10% |
| village | 120 | 102 | 18 | 0 | 0 | 15% |
| town | 120 | 88 | 30 | 2 | 0 | 27% |
| city | 120 | 58 | 42 | 19 | 1 | 52% |
| metropolis | 120 | 33 | 55 | 29 | 3 | 72% |

By family over the 720 (274 secrets on 274 people, of 21,013 named): **dark and bright deeds 83, hidden natures 85,
hidden ties and blood 88, hidden masters 7, outsiders 11**. A hidden master stands in **7 of the 360 thorps, hamlets
and villages (about one in 51)**; an outsider in **11 of the 720 places (about one in 65)**. The killer was dealt twice
in the 720 (both in a metropolis); one who means to kill their superior twice; the brother's wife once.

Over the wide read's 150 (the ten shapes, `rand-27` to `rand-41`): thorps 1 of 15 hold one; hamlets 3 of 30; villages
6 of 30 (two hold two); towns 9 of 30 (one holds two); cities 12 of 30 (two hold two); metropolises 11 of 15 (two hold
two, two hold three). Families: deeds 16, natures 15, ties 14, masters 5 (5 of the 75 small places), outsiders 3 (of 150).

**Against what the chair told the owner.** "Most thorps and villages none": yes (96%, 85%). "A metropolis one to three":
72% hold one to three, 28% none. "A hidden master in about one small place in forty": one in 51 measured (a place that
passes and holds no one of a mapped trade holds none). "An outsider in about one place in sixty": one in 65. **"Most
cities one": NOT MET** — about half the cities hold one or more (52%), 35% exactly one, 48% none. The odds are as the
brief set them (`RARE_SECRET_ODDS`: one eligible person in 200 for each of the first three families); I did not tune
them. **What would meet it:** at one person in 120 for each of the first three families, a city of the census (about 46
eligible named people) would hold one or more about 69% of the time; a metropolis about 85%; a village about 25%; a
thorp about 6%. At one in 100: cities about 75%, villages about 29%. The owner's choice.

**Worlds without magic.** The 720 and the 150 hold no magic-free place (their dials keep magic on). A sample of my own,
240 places born with magic off (the census's r2r dials, `magicExists: false`, 40 of each size): 76 rare secrets, **no
magic-only row among them**. The guard holds it for every magic-only row and over a hundred seeds of a large roster.

## 2. THE ROWS AS BUILT: 194 OF 197

All in `src/data/rareSecrets.js` in their five families, each with its conditions as data, and one table of odds.
**Deeds 47, natures 55, ties and blood 42, hidden masters 24, outsiders 26; 47 magic only; 30 the owner's own.**

**Left out BY NAME (three, all hidden masters; the engine has no such role in a thorp, a hamlet or a village):**
`masterGardener` (no gardener or orchard keeper anywhere in the catalogue), `masterSexton` (no gravedigger or sexton),
`masterFool` (a juggler, a fool or an entertainer but a singer: the catalogue's troupe leader and impresario stand from a
town up; below it the only entertainer is the musician, `masterSinger`'s).

**Kept but unseen in the 720:** `masterTutor` (the catalogue's Village scribe, a village house at a low chance; no
village of the 720 casts its face). It is shown on a planted card in measure 6.

**Words changed (measure 3: each the smallest change that keeps the sense; old → new):**

| row | old | new | the door's reading |
|---|---|---|---|
| `wroteSong` | the song everyone here **sings** | the song everyone here **knows** | ease |
| `cannotRead` | and **hides** it behind a good memory | and **conceals** it behind a good memory | goods ("hides") |
| `counting` | and **hides** how much of the day it takes | and **conceals** how much of the day it takes | goods |
| `noTouch` | a life that **hides** it | a life that **conceals** it | goods |
| `masterCook` | for a great **lord's** table, and **hides** how good | for a great **house's** table, and **conceals** how good | sovereign, goods |
| `masterTailor` | mends workaday **cloth** · A single fine **seam** | mends workaday **clothes** · A single fine **stitch** | goods, resource |
| `masterBrewer` | a great **lord's** cellar, and keeps a plain **ale** | a great **house's** cellar, and keeps a plain **brew** | sovereign, goods |
| `masterSoldier` | Once led **soldiers** in a war | Once led **an army** in a war | office, armedForce |
| `masterHuntsman` | huntsman to a great **lord** · The **lord's** best hound | huntsman to a great **house** · The **house's** best hound | sovereign |
| `masterBlade` | captain of a great **lord's** guard | captain of a great **house's** guard | sovereign |
| `masterRider` | Trained a great **lord's** warhorses | Trained a great **house's** warhorses | sovereign |
| `masterCarrier` | Carried a great **lord's** letters | Carried a great **house's** letters | sovereign |
| `masterMiner` | the deepest shaft of a famous **mine** | the deepest shaft of a famous **pit** | resource, house: mine (no atom answers it) |
| `swappedBabes` | to **spare** one of them a hard house | to **save** one of them **from** a hard house | plenty ("to spare") |
| `godBlood` | Believers would either **crown** them or bury them | Believers would either **worship** them or bury them | sovereign |
| `counterfeit` | **A money-changer** has started weighing | **A trader** has started weighing | bank |
| `stoleRelic` | from **a shrine on the road** | from **a roadside altar** | shrine |
| `forgedLetters` | **Forges** letters of introduction | **Fakes** letters of introduction | smith ("forges") |

(18 rows. My commit `6f45667d7`'s message says "21 by a declaration, 18 by wording": the 18 is right, the 21 is not:
12 rows are cured by a declaration, and 5 more by reading the declarations they already had once they were written as
plain arrays rather than frozen ones.)

**Cured by a declaration that is true of the place** (the vocabulary's own atoms; no new atom): `sings` and
`masterSinger` (`excludes: crisis: threat, crisis: hunger`: singing as ease); `wateredAle` (`institution: tavern`);
`sameBattle` (`watch`: "the watch has started to wonder"); `stagedMiracle` ("pilgrims ask the way") and `felon` ("a
traveller from there") (`excludes: route: isolated`); `ghostChild` (milk) and `killedTheBeast` (sheep) (`livestock`);
`masterHealer` (`healer`: "physician"); `masterPriest` (`church`, `sacredHouse`: "temple", "shrine"); `masterMiller`
(`institution: mill`); `masterShipwright` (`navigable`: "a great harbour").

**One row moved by a battery, not a door:** `felon` ("wanted for a crime in **another town**") and `fakedDeath` ("in
**another town**") stand **only in a town** (`needs: tier: town`). Everywhere else the record battery's tier-noun check
(`domain/coherence/tierNounFindings.js`) reads the singular "town" as the place's own size, and the generation receipt
moved in 5 of the 720 (all the felon, all cities and metropolises). **What I would change (the owner's or the chair's
call, not mine):** "in another town" → "in another place" (the owner's own word was "from another settlement"); the
felon would then stand anywhere again. The cost now: the owner's felon is never dealt outside a town (0 in the 720).

## 3. WHERE EACH ROW STANDS, AND THE EXACT WORDS IT IS REFUSED BESIDE

Read from the engine's vocabularies: the sizes (`thorp … metropolis`), the routes (`road river port crossroads isolated
mountain_pass`), the government kinds (`rulerKindLabel.js`), the temperaments, flaws and manners
(`NPC_PERSONALITY_TRAITS`), the dispositions (`welcoming cautious dismissive transactional`), the roles (the
catalogue's faces), the ages (`NPC_AGE_DATA`; every named card is twenty or more, so every card is an adult; "of some
years" = never the twenties band; "old" = the sixties and seventies band).

**The place** (declared atoms, through the declared door `filterDeclared` over `factsOf`):
- town or larger (`tier: ≥ town`): killer, hired, blackmailer, counterfeit, falseWitness, harem, widowOf, forgedLetters,
  holdsDeeds, paidToForget; village or larger: spouse, sellsSecrets, graveRobber, cold, burnedRecord, soldThrice,
  stagedMiracle, lostTheBet; hamlet or larger: floor, cursed, raisedDead; a town only: felon, fakedDeath; a thorp, a
  hamlet or a village: killedTheBeast and all hidden masters (the odds' `tiers`).
- not isolated (on a road, a river or a port: every route but `isolated`): sellsSecrets, robbedDead, twoMarriages,
  postsLetters, stoleRelic, keptThePurse, penFriend, runaway, felon, stagedMiracle.
- `ruler: lord` (a lord's, a noble house's, a steward's or an appointee's government, the vocabulary's kind): bastard.
- `coast`: selkie. The houses and sources named above (tavern, watch, healer, church and sacred house, mill, navigable
  water, livestock; not under threat or hunger for the two singers).
- magic only (the world law's `magicFunctions()`): the 47 marked. "Only where the law admits gods, if it has such a law"
  (godBlood, masterPriest, stoleRelic, stagedMiracle, smallGod): **the law has no such reading** ("generation creates no
  gods"; faith is culture), so none of the five is held by it.

**The person** (`holder`; the closed keys of `HOLDER_KEYS`):
- never beside these words (temperament, flaw, manner or disposition): killer *merciful, compassionate*; superior
  *loyal*; spouse *merciful, compassionate, warm-hearted*; hired *incorruptible*; demon *pious*; drowned, falseHeir,
  bearLie, forgedLetters, stagedMiracle, smallLies *honest, plain-dealing, candid, forthright*; sellsSecrets *loyal,
  incorruptible*; deserter *loyal, incorruptible*; robbedDead *merciful, compassionate, honest*; oathBreaker *loyal,
  steadfast, protective*; blackmailer *principled, generous*; graveRobber *pious*; counterfeit *honest, incorruptible,
  plain-dealing*; cursed *merciful, compassionate*; falseWitness *honest, plain-dealing, candid, forthright,
  fair-minded*; leftForDead *loyal*; paysDebts *greedy*; wroteSong *vain*; stoleRelic *honest*; burnedRecord
  *fair-minded, equitable*; soldThrice *honest, plain-dealing, candid, forthright, incorruptible*; thumbOnScale *honest,
  incorruptible, plain-dealing, fair-minded, equitable*; gaveCredit *vain, cowardly*; killedTheBeast *cowardly*;
  wateredAle *honest*; paidToForget *incorruptible*; lostTheBet *honest*; counting *lazy, reckless*; givesUp *greedy,
  self-serving, corrupt*; noFaces *perceptive*; cannotLie *deceitful, mendacious, corrupt, hypocritical, manipulative*;
  noFear *cowardly, paranoid*; cannotRead, oneBook *scholarly*; takes *honest, incorruptible*; laughs *unflappable*;
  despair *optimistic* (a cheerful manner is the mask: "good-humoured" is not refused); cannotRefuse *stubborn,
  domineering, overbearing, imperious, contrarian*; neverAngry *wrathful, volatile*; cannotBeAlone *detached*;
  truthInWine *hedonistic*; keepsList *merciful, magnanimous*; lateLaugh *good-humoured*; tooHonest *corrupt, greedy,
  deceitful, mendacious, self-serving*; stammer *charismatic*; widowOf *merciful*; seventhChild *volatile, wrathful*.
  The cold one, the one who distrusts strangers and the despairing one are written as masks: a kind or courteous word
  is not refused.
- never on these trades: noTouch (healer, midwife, bath-keeper, barber, madam, keeper of the houses); fireFear (smith,
  metalworker, smelt master, baker, potter, glassmaker, brickmaker, collier, mint; nor at a house of a forge, smelter,
  bakery, pottery, glassworks, brickworks, charcoal, kiln, foundry or mint); noTaste (cook, baker, brewer, brewster,
  alewife, vintner, apothecary, innkeeper, tavern keeper, coaching-inn keeper); cannotRead, oneBook (scribe, clerk,
  teacher, chronicler, librarian, sage, cartographer, printer, college master, dean, chancellor, postmaster, post's
  master, message-master); bloodFaint (healer, barber, butcher, midwife, the hunt, militia, watch, garrison, castellan,
  captains, marshal, lanista, arena master, killer, hospital's master; and no military card); cannotLie (fortune teller,
  front man, nominal owner, whisper broker, fixer, fence, smuggler; and no criminal card); afraidOfBirds (fowler,
  wildfowler, poulterer, falconer); fearsWater (fisher, boatman, ferryman, ferry keeper, sailor, boat-master,
  boat-headman, barge master, boatwright, shipwright, harbour master, wharfinger); truthInWine (brewer, brewster,
  alewife, vintner, maltster); sings (musician, minstrel, singer).
- only on these trades: thumbOnScale (miller, butcher, baker, fishmonger, chandler, apothecary, salt master, grocer,
  spicer); wateredAle (innkeeper, tavern keeper, coaching-inn keeper, caravanserai keeper, alewife, brewster, brewer).
- offices: felon never the head of the ruling body (first of the governing power), a title of blood or an elder's
  office; bastard never the head nor a title of blood; lastHeir, highBirth, deadTitle never a title of blood (the lord,
  the lady, the monarch …; the first of a lord's governing power; a member of a noble house's power); growsYounger,
  ageless, wanderer, nameless never an elder's office, a title of blood, or one the place has known from birth (kin on
  the page by a family tie, an elder's office, a title of blood); falseHeir only the face of a house of their own.
- ages: swappedBabes, sameBattle, lostChild and every hidden master never in their twenties; oldLove only the old;
  promised, shortLived never the old.
- **the hidden masters, each on its own trade only** (the engine's roles): smith (smith, master smith, farrier); healer
  (healer, midwife, barber); cook (innkeeper, tavern keeper, coaching-inn keeper, waystation keeper, baker, cook);
  builder (carpenter, master carpenter, thatcher, mason, wheelwright); blade (militia captain, watch captain, watcher,
  the master of the hunt, guard); tutor (scribe, clerk, teacher); tailor (tailor, weaver, dyer); trader (pawnbroker,
  chandler, outfitter, merchant, trader, pedlar, shopkeeper); soldier (dairy farmer, head shepherd, farmer, herder,
  labourer); wizard [M] (any trade); captain (ferryman, ferry keeper, boat-master, boat-headman, barge master, fisher,
  boatman); rider (stable master, horse-coper, groom, ostler, drover, stablehand); priest (priest, shrine keeper); singer
  (musician, minstrel, storyteller); craft (potter, woodcarver, cooper, cobbler, tanner, brickmaker, ropemaker,
  glassmaker, jeweller, bowyer, sawyer); ruler (an elder, reeve, headman or eldest who is first of the governing power);
  thief (any criminal card); poisoner (apothecary, herbalist); miller (miller); huntsman (wildfowler, trapper, forester);
  shipwright (boatwright, shipwright); brewer (alewife, brewster, brewer, vintner, maltster); miner (mine captain,
  quarry master, miner, quarryman); carrier (carriers' master, message-master, postmaster, post's master).
- **the names**: `{superior}` (superior) is the first of the first body the card prints the person a second, a third or
  a member of (its printed order; a veiled standing never read), else the mentor of a tie whose student this person is
  (the ties store mentor → student); a card first of every body it is in has no superior and the row is not dealt.
  `{target}` (hired, blackmailer, lovesNamed, owesLife, guardian, oathAgainst, hiddenSpouse, parentOf) is another named
  person of the roster picked by the hash, never the person, never their superior, never one of the same name;
  parentOf only one at least eighteen years younger by the two cards' age words (none, and the row is not dealt);
  lovesNamed and hiddenSpouse never one the page ties to them as family; oathAgainst ("they like {target}") never one
  the page ties to them as enemy or rival.

**Pairings I checked and name (item 7):** the refusals above are my reading of the engine's words against each row,
held by the guard word by word. Of measure 6 I read every seventh card (28) beside its temperament, flaw, manner,
disposition, goal and "How they deal": none says the opposite of its row. Left standing and named: the cold one, the
stranger-hater and the despairing one beside a warm or courteous word (the brief's masks); `noFear` beside the
disposition *cautious* (caution is no fear); `cannotRefuse` beside a dealing line of easy promises (consonant). I did
not read the other six-sevenths line by line: measure 6 below is whole for the second reader.

## 4. WHO MAY CARRY ONE, AND EVERY READER OF A CARD'S `secret` (item 5)

Of the 720's 21,013 named people, **17,219 are eligible and 3,794 excluded**: 1,582 because another card's secret names
them (that secret is about them), 1,400 because their secret is one of a crisis pool's own (the tonight sheet's keeper
and the crisis target read it: `stressInstitutionEffects.js`), 755 because their presentation was drawn from their
secret's words (`npcGenerator.js :: getStressHistory`'s three modes), 57 with no secret (the card has no secret row to
replace). Every named card is an adult; a card whose age is not one of the vocabulary's words is never dealt.

The readers in `src` (a writer at birth runs before the deal; a reader at print reads whatever the card holds):

| reader | what it does | with a rare secret |
|---|---|---|
| `npcGenerator.js :: generateCrimeLevel` (the branch that bakes a name), `generateFactionLeaderSecret`, the title lines (`people/poolMap.js`) | write the first secret at birth, refusing a text another card holds (the hook registry) | run before the deal; never re-read |
| `narrativeGenerator.js :: buildPoliticalNarrative → getStressHistory` | draws a presentation from the secret's words (40%) | before the deal; such a card is excluded (755) |
| `people/castPowers.js` (`CarriedSecrets`, `withTownsOwnUnderworld`), `hookVariety.js`, the hook registry | the held texts; the underworld's name rewritten | before the deal; the rows name no guild or underworld |
| `domain/foodSurplus.js :: secretsHeldByFoodRecord` | filters a crisis pool by the food record | reads no card |
| `generationContext.js :: allowsSecret` (the generation law's filter) | refuses a magic claim where magic is off; the content profile's topics | the deal passes every row through it; every row passes for heroic, grounded, grim × magic on/off where it may stand (guard) |
| `generateSettlementPipeline.js :: refreshRosterProse` | rewrites a displaced name in `secret.what`/`stakes` | the one substitution point: a renamed target is followed (guard) |
| `npcGenerator.js` criminal-affiliation test (`isCriminalSecret`) | a pure read, `void` since PEOPLE-LAND | no effect |
| `domain/summary/tonightSheet.js` (`secretOf`, the crisis patterns), `crisisFactFindings.js :: target_runs_plot` | voices a person's secret as their line; the keeper and the target read the crisis pool | a crisis secret is never replaced (excluded); otherwise the same words print as the person's line |
| `tonightAtTheTable.js`, `settlementQuickGuide.js`, `npcInteriorityRead.js`, `dossier/entityLinks.js`, `npcProfile.js` (stakes), `galleryVeil.js` (veils the class), `components/new/npcComponents.jsx` (the card's Secret line), `pdf/lib/viewModel.js` ("what: stakes"), `foundry/journalPages.js` ("Secrets (GM only)", tonight) | print the card's secret | print the row's two lines, nothing else read |
| `userEdits.js`, `settlementPendingEdits.js`, `pendingEditIntents.js`, `settlementSlice.js` | the user's edit of `secret.what` | unchanged; a saved town is never re-dealt |
| `factionRename.js` | lists `secret.what`/`stakes` as owner-gated prose a power's rename does not rewrite | unchanged (the rows name no power) |
| `events/mutateEntities.js`, `eventComposer/*`, `SessionMode.jsx`, `ChroniclePanel.jsx`, `settlement.schema.js` | an event's own payload; the shape | unchanged |
| `domain/people/patronage.js` ("held over them: a secret") | the allegiance's leverage, in general words | reads as the card's own secret, rare or not |

**The proof (measure 2):** over the 720 and the 150, base against tip, every field of every record is identical but
the `secret` of the dealt cards: 216 of the 720 and 42 of the 150 move, each only in those cards; the generation
receipt, the ties, the names, the roster and every other field of `npcs` unchanged (after the felon's fix above; before
it, 5 receipts moved).

## 5. THE MEASURES (base `7cf3cb9f0`, tip as pushed)

Every runner is in scratch (`tools/` beside the worktrees; not committed, as they are instruments): `measure.mjs` (measure
1, by the rows' own words), `secretDiff.mjs` (measure 2, field by field beside the birth lane's
`docs/chair/2026-11-17/birth/probes/fieldDiff.mjs`), `doors.sh` (measure 3), `everyRow.mjs` (measure 6), `nomagic.mjs`,
`excl.mjs`, `golden.mjs`, `audits.sh` + `auditCmp.mjs` (measure 5). The corpora: the 720 born by PAGE-COPY's
`births.mjs` at the base and the tip; the 150 born and rendered by PAGE-COPY's `census3.sh --count-only` (2 workers)
at both.

1. **The table of item 2:** § 1 above. Which rows: 128 of the 194 were dealt in the 720 (the commonest: `fey` 7,
   `paysDebts` 6; `falseHeir`, `firstWord`, `ward`, `foundling`, `luckless` 5 each); 44 in the 150. Places without
   magic: none in the 720 or the 150; 240 in my magic-off sample, holding 76 rare secrets and no magic-only row.
   Three example cards of each family: § 10.
2. **fieldDiff, base against tip:** the 720: 504 identical, **216 moved only in the dealt cards' `secret`, 0 in any
   other field** (274 cards; every moved secret is a row of the table). The 150: 108 identical, **42 only in the dealt
   secrets, 0 other** (53 cards). The birth lane's `fieldDiff.mjs` agrees by family: `npcs` 216 and 42, nothing else.
3. **The doors**, base → tip: `presumption-classes-door --check` "hits 1787 · banked 1938 · fresh 0 · stale 151" →
   the same, **fresh 0**; `presumed-things-door --check` "fresh 39 · stale 72 · first-register stale 7 · banked 4688 ·
   strips fresh 0" → the same (the 39 fresh are the base's own, none in my files). The rows changed or declared to
   get there: § 2.
4. **The people's guards** (`bar6PeopleLaw10`, `bar4PeopleKinds`, `bar7CardsMarkOnce`; the hook variety's
   `rosterDuplicateDraws` and `hookThemeDraws`; and `people/goals`, `regenPreservesUserCanon`): base 7 files, 78 tests
   green; tip 7 files, 78 tests green.
5. **The auditors' runners over the 150** (`bar5/AUDIT/run-a.mjs`, `runB.mjs`; `bar6/AUDIT/runC` to `runG`;
   `bar7/AUDIT/runH`, `runI`), base render against tip render: every runner exits 0 at both; **no rule's count rises**;
   the logs are identical but runH's census of secret lines in a house's trade (123 short-marked lines: 90 → 88 of the
   trade; 285 crisis-marked: 124 → 122 — two trade secrets replaced by rare ones) and runG's own output path.
6. **Every row seen once:** § 11, in full: 128 born, 66 planted (a real card of the 720 on which the deal's own reading
   lets the row stand, its secret set to the row; `masterTutor` on a real village card whose role I set to "the
   scribe", as no card of the 720 holds it).

## 6. THE REFERENCE TOWNS THAT MOVE (R10: none re-taken)

The golden master (`tests/property/generatorGoldenMaster.test.js`, the 525 configurations) is red at my base already
(485 of 525 differ from `tests/fixtures/generator-golden-master.json`; its re-take is the close's) and red at my tip
with the same count, so it cannot itself say which moved. Born at the tip, **168 of the 525 configurations now carry a
rare secret, all on the golden's one seed `golden-master-v3`**, all of the ties: `owesLife` 54, `familiar` 42, `ward` 29,
`widowOf` 12, `seventhChild` 12, `changeling` 12, `debtOfHonour` 6, `hiddenSpouse` 1; on the beast master (120), the
crier (47), a master baker (1); 12 towns, 72 cities, 84 metropolises. Every one is listed in § 12 (its key, the seed,
the card). **A finding:** the golden births every configuration on one seed, and the deal reads the seed and the card's id, so
the same faces pass in every configuration that casts them: all 168 are ties, on two faces. The share is like the
census's for towns and larger (the census: about half of its towns, cities and metropolises hold one); the correlation
is the golden's single seed, and a town's own seed is what keeps the deal varied.

The census guards' stored figures I did not touch (R10). `tests/property` at base and tip: 704 tests, the same reds
(7 at the base; at the tip `editCorpusRatchet` A5 red once under load, green alone: a timeout; A7 red at both with the
same figures).

## 7. THE NET (each alone, through `sh scripts/gate-tail.sh`, to a file; never a pipe)

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | (the pre-push hook) | green: 1113 errors, ceiling 1113 |
| `npm run typecheck:ratchet` | (the pre-push hook) | green: 167 errors, ceiling 167 |
| `npx eslint` my five files | — | clean |
| `npx vitest run tests/architecture` | — | 21 files, 347 tests green |
| my guard `tests/generators/rareSecretsLaw.test.js` | **red** (the module does not exist) | 15 tests green (≈15 s: planted rosters, 600 planted places, three births) |
| the earlier rounds' guards (`tests/{domain,generators}/bar5*`, `bar6*`) | 21 files, 171 green | 21 files, 171 green |
| `tests/lint`, compared by name | 65 red | 69 red (run before `c18a33b7d`, which cures two of the four, re-run alone) |
| ONE `npm run build`; `tests/build/vendorPdfLazy` + `bootSmoke` | — | build green; 2 files, 49 passed, 17 skipped by the files |
| the scratch merge of the line's tip with mine | the line's tip is still `7cf3cb9f0` (fetched at the end): the merge is my tip itself; the guard and the people's guards there are the tip's above |

**tests/lint, red at my tip and not at my base (four, by name):**
- `tuningRegister.walker` "no file carries more unregistered named constants" and "the six ceilings never rise":
  my deal's one named constant (a generation's eighteen years). **Cured** in `c18a33b7d` (it lives in the data file
  as `RARE_SECRET_GENERATION_YEARS`; the walker re-run alone: those two green; its third red, "dependents moved" on
  `domain/corruption.js`'s tables, is red at the base too).
- `poolDominance.walker` "every drawn pool has a row": **the register owes five rows**, `ledger:rareSecrets:deeds`,
  `…:natures`, `…:ties`, `…:masters`, `…:outsiders` (the declared door notes each family's pool in the presumption
  ledger). The register is a stored figure: **for the close** (R10).
- `styleLaw.walker` "no file's count of any struck phrase rises": "a stranger" (struck, the walker's id `a-stranger`)
  in two of the chair's rows: `paysDebts` ("Has been quietly paying off **a stranger's** debts for years…") and
  `lostChild` ("**A stranger** with that face would be of an age to ask questions now"). Not a door, so the brief does
  not let me change the words: **explained, not cured.** What I would write (the chair's call): "someone else's debts";
  "Anyone with that face …".

**Red at both, but owed by me (named):** `mutationCoverageManifest` "TOTALITY: every enumerated invariant file has a
manifest entry" is red at the base with other files and now also names `tests/generators/rareSecretsLaw.test.js`
(`tests/generators` is an enforcer directory). **The registration my guard owes** (a sweep label in
`scripts/mutation-sweep.sh`, or a rationale row in `scripts/mutation-coverage-manifest.json`) is a shared tool's:
**for the close.** `domainAnyCastBaseline`, `negativeAssertionAnchor.walker` and `seedLoopTotality.walker` are red at
both, and none names a file of mine.

## 8. LEFT BY NAME

1. **"Most cities one" is not met by the odds as set** (§ 1): about half the cities hold one or more. The odds that
   would meet it are in § 1; I did not tune.
2. **`masterGardener`, `masterSexton`, `masterFool`** not built: no such role below a town (§ 2).
3. **The felon and `fakedDeath` stand only in a town** (the record battery's tier noun; § 2): the wording I would use.
4. **Two of the chair's rows hold a struck phrase** (`paysDebts`, `lostChild`; § 7): the wording I would use.
5. **Stored figures owed to the close:** five `poolDominance` register rows; my guard's mutation-coverage entry; the
   golden master's re-take (168 configurations carry a rare secret, § 12).
6. **ONE HUNK, read narrowly:** each of `narrativeGenerator.js` and `generateSettlementPipeline.js` has the call (one
   line, wrapping `dealGoals`, with a one-line comment) and **one import line** beside the import of `dealGoals`: an
   import cannot ride inside a function, so it is two hunks in each file. Nothing else in either.
7. **"Only where the world's law admits gods, if it has such a law"**: the law has none, so `godBlood`, `masterPriest`,
   `stoleRelic`, `stagedMiracle`, `smallGod` are not held by one (`smallGod` and `godBlood` are magic only).
8. **The government kind `lord`** (for `bastard`) is the vocabulary's: it admits a steward's or an appointee's government
   (`rulerKindLabel.js`), where "a former lord of this place" may be thinner. I used the atom as it stands.
9. **The 720 and the 150 hold no magic-free place**; my own 240-place sample stands in for "how many places of each
   population are worlds without magic" (§ 1).
10. **`masterTutor` was never dealt in the 720** (no village casts its Village scribe's face); kept, reachable.
11. **The superior through a mentor**: the ties store mentor → student, so the mentor is read as the superior only where
    the card has no body's head above it; a mentor is a teacher more than one the person answers to. Vetoable.
12. My commit `6f45667d7`'s message gives a wrong count (21 cured by a declaration; the truth is 12, and 5 by plain arrays): § 2.

## 9. FOR THE OWNER'S VETO LIST, IN PLAIN WORDS

- **The rows:** 194 built of the 197 (§ 2, § 11): 30 from the owner's own examples, 47 only where magic works.
  Eighteen rows' words were changed to pass the two doors (§ 2, old and new).
- **The odds:** one eligible named person in two hundred for each of the deeds, the natures and the ties, at most one
  of a family in a place and one a person; a hidden master in one thorp, hamlet or village in forty (measured one in
  51); an outsider in one place in sixty, any size (measured one in 65). Measured: most thorps and villages none; about
  half the cities one or more; about three metropolises in four one to three. A turn of the odds is one figure in
  `src/data/rareSecrets.js :: RARE_SECRET_ODDS`.
- **Who never carries one:** a person whose secret another card names, whose secret is a crisis's own, or whose face
  was drawn from their secret (about one named person in five, § 4).
- **Where each row stands and what it never stands beside:** § 3.

## 10. THREE EXAMPLE CARDS OF EACH FAMILY (born, the 720, at the tip)

- **deeds** · `arson` · `r2r-hamlet-18` (hamlet): **Daigh O'Connor**, Elder (mid-sixties); temperament gracious, flaw —, manner traditionalist, cautious. Wants: Settle one quarrel inside Elder Council before Lasairfhiona Walsh can settle it and take the credit. **Secret:** Set the fire that everyone here calls an accident. **Stakes:** One person saw them walk away from it.
- **deeds** · `floor` · `r2r-metropolis-34` (metropolis): **Veronika Zimmerer**, the miller (early twenties); temperament —, flaw bitter, manner nostalgic, welcoming. Wants: Find a patron among those who lead City-State Council, and make themselves useful to them. **Secret:** Has a body buried under their own floor. **Stakes:** The missing one's kin have never stopped asking.
- **deeds** · `raisedDead` · `r2s-mass_migration-metropolis-0` (metropolis): **Xian Yang**, the whisper broker (late fifties); temperament generous, flaw cold-blooded, manner traditionalist, transactional. Wants: Bring Thieves' Guild a piece of news before anyone else does. **Secret:** Raised something from a grave, once, and could not put it back. **Stakes:** It has been seen at the edge of the fields.
- **natures** · `gambler` · `r2r-thorp-3` (thorp): **Borchigid Kiyad**, Elder (mid-thirties); temperament intuitive, flaw callous, manner perfectionist, welcoming. Wants: Get the fishing community through the season without borrowing. **Secret:** Is far better at dice and cards than anyone here knows. **Stakes:** The people they have been quietly winning from are starting to count.
- **natures** · `cannotBeAlone` · `r2r-metropolis-50` (metropolis): **Fergus Ryan**, the collier (late twenties); temperament warm-hearted, flaw overbearing, manner eccentric, cautious. Wants: Take one piece of business from Grand Council and bring it to Merchant Guilds. **Secret:** Cannot bear to be alone, not for an hour, and has built a life with no empty rooms. **Stakes:** The rooms are emptying.
- **natures** · `afraidDark` · `r2s-mass_migration-city-3` (city): **Fionnuala Fitzgerald**, the potter (late fifties); temperament gracious, flaw —, manner secretive, cautious. Wants: Do one thing for Craft Guilds this season that the people who lead it cannot ignore. **Secret:** Cannot bear the dark, and burns a light all night at a cost they can ill afford. **Stakes:** The night the oil runs out, someone will hear.
- **ties** · `dragonBlood` · `r2r-thorp-53` (thorp): **Walburga Fischer**, Household Elder (late forties); temperament incorruptible, flaw —, manner stoic, cautious. Wants: Tell the truth about something that others keep quiet about. **Secret:** Carries a dragon's blood, and it has begun to show. **Stakes:** There are people who pay well for word of such blood.
- **ties** · `oathAgainst` · `r2r-metropolis-46` (metropolis): **Fujio Liang**, the senior guild master (mid-twenties); temperament —, flaw petty, manner idealistic, welcoming. Wants: Find a patron among those who lead Merchant Guilds, and make themselves useful to them. **Secret:** Belongs to a family sworn, generations back, to end the line of Wei Kato, and is the last who remembers the oath. **Stakes:** They like Wei Kato.
- **ties** · `ward` · `r2s-mass_migration-metropolis-2` (metropolis): **Cornelia Laevinus**, the guild's master (late twenties); temperament patient, flaw suspicious, manner fatalistic, cautious. Wants: Get the assassins' guild through the season without borrowing. **Secret:** Is the secret ward of someone powerful far away, who pays for everything and has never once visited. **Stakes:** A visit has been announced.
- **masters** · `masterWizard` · `r2r-thorp-4` (thorp): **Devota Koch**, the reeve (mid-sixties); temperament gracious, flaw —, manner ambitious, cautious. Wants: Get the lord's reeve's office through the season without borrowing. **Secret:** Was a court wizard, and has not cast a spell since the day they left. **Stakes:** The first spell would be felt by people who are listening for it.
- **masters** · `masterCaptain` · `r2s-occupied-village-2` (village): **Gawain Gallagher**, the ferryman (early forties); temperament steadfast, flaw —, manner opportunistic, welcoming. Wants: Get to whatever both Household Council and Merchant Guilds want this season first. **Secret:** Was master of a great ship, and works a small boat here so that no one asks. **Stakes:** Sailors remember a captain who lost a ship.
- **masters** · `masterWizard` · `r2s-mass_migration-village-2` (village): **Soha ibn Rashid**, the priest (seventies); temperament —, flaw —, manner opportunistic, welcoming. Wants: Make sure no one else learns how much is owed to Tamim ibn Khalid. **Secret:** Was a court wizard, and has not cast a spell since the day they left. **Stakes:** The first spell would be felt by people who are listening for it.
- **outsiders** · `dragonHiding` · `r2r-thorp-35` (thorp): **Messalina Maximus**, Elder (late twenties); temperament incorruptible, flaw paranoid, manner pragmatic, cautious. Wants: Make sure nothing they did in the past can come back on them this season. **Secret:** Is a dragon, and has worn this shape so long that the hoard is mostly kitchenware. **Stakes:** They still count it every night.
- **outsiders** · `realWorld` · `r2r-metropolis-53` (metropolis): **Abaqa Salji'ud**, the master furrier (early forties); temperament astute, flaw —, manner iconoclast, welcoming. Wants: Bring Merchant Guilds a piece of news before anyone else does. **Secret:** Was someone else in a world where this one is a game, and woke here in a body that was not theirs. **Stakes:** They remember the rules, and have started to use them.
- **outsiders** · `returns` · `r2s-mass_migration-city-2` (city): **Matrona Hyaleas**, the sage (early sixties); temperament wise, flaw bitter, manner eccentric, transactional. Wants: Gain ground for Merchant oligarchy at the expense of Thieves' Guild before the season is out. **Secret:** Has died four times, and each time woken in their own bed the next morning. **Stakes:** They no longer take the care they should.

## 11. MEASURE 6 IN FULL: EVERY ROW BESIDE A REAL CARD

Rows: 194. Born (the row stands on this card in the town as born at the tip): 128. Planted (a real card of the 720 on which the deal's own reading lets the row stand, its secret set to the row): 66. Not found: 0.

#### deeds · `killer` (the owner's)
BORN · seed `r2r-city-2`

**Fenghua Cho**, the watch commander (late twenties) · city, Xinxian  
Temperament: courteous · Flaw: vain · Manner: reserved · Disposition: transactional  
Impression: Tired but sharp, with the patience of someone used to hearing complaints all day.  
How they deal: Will hear a complaint and send someone, if the complaint is worth the trouble.  
Wants (now): Make sure no new rule from those who govern costs the professional city watch anything this season.  
Wants (life): Be remembered as one of the great figures of this place.  
Hook: They've noticed the same group of faces at multiple locations where incidents occurred. No one else has.  
**Secret: Has killed more than once, and no one has connected the deaths** · Stakes: The deaths are still counted as separate misfortunes; one person laying them side by side would end that

#### deeds · `superior` (the owner's)
BORN · seed `r2r-metropolis-26`

**Zhen Sato**, the house boss (early twenties) · metropolis, Kitaxian  
Temperament: — · Flaw: wrathful · Manner: stoic · Disposition: cautious  
Impression: Quiet and watchful, standing where they can see every table at once.  
How they deal: Asks who sent you; strangers are welcome to lose money but not to ask questions.  
Wants (now): Keep Jian Zhan from spending the money where people will notice.  
Wants (life): Turn the bargain with Rong Kimura into real trust over the years.  
Hook: Someone tried to rob them, and did it like a professional: no noise, the lock picked, nothing touched but the strongbox.  
**Secret: Means to kill Yong Yamazaki, and has worked out how** · Stakes: If Yong Yamazaki learns of it first, only one of them walks away

#### deeds · `spouse`
BORN · seed `r2r-metropolis-0`

**Asuka Park**, the miller (late twenties) · metropolis, Baigang  
Temperament: magnanimous · Flaw: — · Manner: pragmatic · Disposition: welcoming  
Impression: Broad-shouldered and easy, with the patience of someone who spends the day waiting for the stones to turn.  
How they deal: Talks freely about the harvest and who brought what to the mill; it is a good place to hear who is short this year.  
Wants (now): Keep the accounts of the mills balanced, and show them to anyone who asks.  
Wants (life): Build up a store of grain and water power at the mills large enough to last two bad years.  
Hook: Someone keeps paying off their small debts around the place before they can, and has left no name.  
**Secret: Has been giving their own spouse a little poison each week, and is patient about it** · Stakes: Any healer who looks closely will know the signs

#### deeds · `floor`
BORN · seed `r2r-town-8`

**Panteleimonissa Niketas**, the brewer (mid-twenties) · town, Hagiokastro  
Temperament: perceptive · Flaw: — · Manner: secretive · Disposition: welcoming  
Impression: Smells of malt and hops, round and good-humoured. Offers you a taste before anything else.  
How they deal: Generous with a cup and with talk; hears everything the taverns say.  
Wants (now): Do one piece of work so well that no one could find fault with it.  
Wants (life): Outlast Sophia Komnenos, and be the one still standing.  
Hook: Their son has been seen at night with people who do not work, and comes home with coin.  
**Secret: Has a body buried under their own floor** · Stakes: The missing one's kin have never stopped asking

#### deeds · `hired`
BORN · seed `r2r-city-45`

**Purev Kipchak**, the blade captain (late forties) · city, Jalalger  
Temperament: — · Flaw: — · Manner: hedonistic · Disposition: welcoming  
Impression: Relaxed and sure of themselves, and not careless with it.  
How they deal: Free with talk and small favours, and remembers every one when they want something back.  
Wants (now): Get the hired blades excused from one tax or levy this season.  
Wants (life): See more of the world than this place.  
Hook: Two of the people under their command have been settling a private quarrel with drawn steel, and the rest are picking sides.  
**Secret: Has taken coin to kill Sorghaghtani Dörbete, and has not yet decided to refuse** · Stakes: Whoever paid expects it done, and Sorghaghtani Dörbete suspects nothing

#### deeds · `felon` (the owner's)
PLANTED · seed `r2r-town-0`

**Macrina Cicero**, the gang boss (mid-sixties) · town, Farosaltus  
Temperament: intuitive · Flaw: — · Manner: brooding · Disposition: cautious  
Impression: Lean, quiet and watchful. People on the street step aside without being asked.  
How they deal: Asks who you are and who you know; strangers are tolerated, not welcomed.  
Wants (now): Learn exactly what Thieves' Guild and Corrupt Council have agreed in private, and who agreed it.  
Wants (life): See the street gang out of debt for good, with money set aside for bad years.  
Hook: Someone has been using their name to frighten shopkeepers, and the shopkeepers have begun paying the wrong people.  
**Secret: Is wanted for a crime in another town, and came here to be forgotten** · Stakes: A traveller from there would know the face

#### deeds · `demon` (the owner's) [magic only]
BORN · seed `r2s-wartime-village-3`

**Radmila Ivanov**, the sawyer (early fifties) · village, Zelenonick  
Temperament: — · Flaw: wrathful · Manner: detached · Disposition: welcoming  
Impression: Easy and open, smelling of fresh pine. Likes to talk about wood more than most people do.  
How they deal: Tells you which timber is good this year and who has been buying it.  
Wants (now): Get the sawmill excused from one tax or levy this season.  
Wants (life): Have what others have, and more of it.  
Hook: Their savings were hidden in a place only one other person knew, and the savings are gone.  
**Secret: Made a bargain with a demon, and the price has not yet been named** · Stakes: It will be named at the worst hour

#### deeds · `drowned`
BORN · seed `r2r-city-50`

**Laberia Falco**, the nominal owner (late thirties) · city, Capocolonia  
Temperament: generous · Flaw: — · Manner: calculating · Disposition: cautious  
Impression: Nervous under the smile. Their eyes keep going to the back door.  
How they deal: Says little and wants you gone; if you mention certain names, the shop closes early.  
Wants (now): Show the rest of Thieves' Guild that Marcus Volso can be wrong, without ever saying so aloud.  
Wants (life): See every child they know grow up fed and safe.  
Hook: A rival crew has offered peace, and the offer arrived on the same day one of their people went missing.  
**Secret: Let a rival drown and has told it as a failed rescue ever since** · Stakes: One other person was on the bank that day

#### deeds · `sellsSecrets`
BORN · seed `r2s-under_siege-metropolis-2`

**Khadija al-Malik**, the apothecary (early sixties) · metropolis, Raassaray  
Temperament: — · Flaw: — · Manner: opportunistic · Disposition: cautious  
Impression: Precise in every movement. The jars behind them are labelled in a hand only they can read.  
How they deal: Sells the common remedies freely; asks why you want anything stronger, and watches the answer.  
Wants (now): Find the weak spot in what Uqba al-Tamimi is doing, and press on it.  
Wants (life): See Grand Guild Consortium outgrow The Guard, so it never has to look over its shoulder again.  
Hook: They overheard two people they know settle a bribe, and do not know whom to tell.  
**Secret: Sells what is said here in private to someone outside, a letter at a time** · Stakes: The letters are kept, and not by them

#### deeds · `arson`
BORN · seed `r2r-hamlet-18`

**Daigh O'Connor**, Elder (mid-sixties) · hamlet, Caerwick  
Temperament: gracious · Flaw: — · Manner: traditionalist · Disposition: cautious  
Impression: Watches strangers on the shore closely. Says little until they know what you want.  
How they deal: Answers about the fishing; asks why you have come to the landing.  
Wants (now): Settle one quarrel inside Elder Council before Lasairfhiona Walsh can settle it and take the credit.  
Wants (life): Keep a household where anyone in need can find a meal and a bed.  
Hook: They agreed to hold a parcel for a traveller, and two different people have since come to collect it.  
**Secret: Set the fire that everyone here calls an accident** · Stakes: One person saw them walk away from it

#### deeds · `deserter`
BORN · seed `r2r-city-16`

**Jade Cohuoh**, the master baker (mid-twenties) · city, Copantzin  
Temperament: — · Flaw: petty · Manner: melancholic · Disposition: transactional  
Impression: Up since the middle of the night and quick about everything. The queue moves fast.  
How they deal: Sells what is baked; special orders by the day before, paid on collection.  
Wants (now): Do Uijah Ixim one useful favour this season, unasked.  
Wants (life): See Merchant Guilds too weak to threaten Craft Guilds again.  
Hook: They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone.  
**Secret: Deserted an army with its pay chest, and has spent almost none of it** · Stakes: The army hangs deserters, and thieves twice

#### deeds · `falseHeir`
BORN · seed `r2r-village-37`

**Gavril Frolov**, the cobbler (late twenties) · village, Dobroets  
Temperament: warm-hearted · Flaw: — · Manner: proud · Disposition: cautious  
Impression: Quiet and careful. The good work is kept in the back and shown only on request.  
How they deal: Polite, but asks where you are from before taking an order for new shoes.  
Wants (now): Do Dubravka Petrov one useful favour this season, unasked.  
Wants (life): See every child they know grow up fed and safe.  
Hook: Their landlord has doubled the rent and will lower it only if they report on the family next door.  
**Secret: Holds what they hold on a forged will, and the true heir is alive** · Stakes: The forger is still being paid, and has begun to ask for more

#### deeds · `robbedDead`
BORN · seed `r2s-recently_betrayed-metropolis-0`

**Eyjolf Bjarnarson**, the dyer (seventies) · metropolis, Ormstrand  
Temperament: — · Flaw: stubborn · Manner: methodical · Disposition: welcoming  
Impression: Cheerful in the stink of the vats. Proud of a good colour.  
How they deal: Shows off the best cloth and explains how the colours are made.  
Wants (now): Find a new supply for the work at the dyer's dyehouse, and have it coming in before the season is out.  
Wants (life): See Merchant Guilds too weak to threaten Craft Guilds again.  
Hook: A cousin has arrived to stay without warning, and spends every day watching one particular house.  
**Secret: Robbed a dying traveller on the road and left them there** · Stakes: The traveller did not die

#### deeds · `oathBreaker`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Swore to protect someone and stood aside when it mattered** · Stakes: The one they failed has kin who keep count

#### deeds · `blackmailer`
BORN · seed `r2s-monster_pressure-city-3`

**Laenas Tubertus**, the woodcarver (mid-thirties) · city, Villaplenum  
Temperament: pious · Flaw: imperious · Manner: reserved · Disposition: transactional  
Impression: Patient and exact. Every piece on the shelf has a price, and the price is firm.  
How they deal: Takes commissions with a drawing and a deposit; the work is slow and good.  
Wants (now): Stop Merchant Guilds from taking anything more from Craft Guilds this season.  
Wants (life): Rise together with Plotina Pacuvius, and share what they win.  
Hook: A child they took in as a favour has family who want the child back, and want paying for the years.  
**Secret: Is bleeding Hortensia Rufus for coin over a thing done long ago** · Stakes: Hortensia Rufus has begun to wonder whether another way would be cheaper

#### deeds · `graveRobber`
BORN · seed `r2r-village-56`

**Eanán Burke**, the lord (mid-twenties) · village, Treford  
Temperament: plain-dealing · Flaw: — · Manner: superstitious · Disposition: transactional  
Impression: Ordinary in a way that is itself a kind of presence.  
How they deal: Names a fair price, keeps to it, and expects you to keep to yours.  
Wants (now): Warn Muirenn Flaherty of any trouble before it reaches them.  
Wants (life): Make peace between The Highborn Circle and Elder Council on terms The Highborn Circle can live with.  
Hook: They promised the same post to two people, and both have already told their families.  
**Secret: Digs up the newly buried for what was buried with them** · Stakes: The last grave had more kin than they thought

#### deeds · `counterfeit`
BORN · seed `r2r-city-56`

**Adela Moser**, the theatre manager (late twenties) · city, Spitzgate  
Temperament: — · Flaw: — · Manner: mercurial · Disposition: transactional  
Impression: Harried and quick, with a list of things going wrong in every pocket.  
How they deal: Sells seats and hires players; talks about money more than art.  
Wants (now): Bring Merchant Guild Council a piece of news before anyone else does.  
Wants (life): Turn the contest with Merchant Guilds into a partnership on terms set by Merchant Guild Council.  
Hook: A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week.  
**Secret: Clips and re-casts coin in a back room, a little at a time** · Stakes: A trader has started weighing every coin that comes from here

#### deeds · `cursed` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Called a curse down on a neighbour, and it worked** · Stakes: Curses of that kind are paid for twice

#### deeds · `falseWitness`
BORN · seed `r2r-metropolis-41`

**Danilo Antonović**, the circle-keeper (late twenties) · metropolis, Hvaliko  
Temperament: incorruptible · Flaw: — · Manner: theatrical · Disposition: cautious  
Impression: Precise, quiet and watchful, standing beside the carved circle as if guarding it.  
How they deal: Asks your destination, your business and your name, and writes all three down.  
Wants (now): Do Vasili Smirnov one useful favour this season, unasked.  
Wants (life): Make the bond between Grand Merchant Oligarchy and Thieves' Guild so deep that neither can afford to break it.  
Hook: An experiment failed in a way that shouldn't be possible. The results have been sealed. They're still thinking.  
**Secret: Sent an innocent to the gallows with a lie, and watched** · Stakes: The one who truly did it knows who lied

#### deeds · `leftForDead`
BORN · seed `r2r-metropolis-32`

**Drusus Nasica**, the senior craft-guild master (early twenties) · metropolis, Torrinovum  
Temperament: charismatic · Flaw: imperious · Manner: proud · Disposition: welcoming  
Impression: Quick to smile, quick to calculate. Both things are happening simultaneously.  
How they deal: Gracious in the way of someone doing you a kindness, and expects to be thanked for it.  
Wants (now): Get to whatever both Craft Guilds and Merchant Guilds want this season first.  
Wants (life): Make Craft Guilds so much their own that it could not run a week without them.  
Hook: A buyer has paid them in advance for a whole season of goods, far above the price, and will not say what the goods are for.  
**Secret: Left a partner for dead in the wilds and came home with both shares** · Stakes: The partner has been seen alive

#### deeds · `raisedDead` [magic only]
BORN · seed `r2r-town-39`

**Angelina Hyaleas**, the tanner (early forties) · town, Lykotion  
Temperament: — · Flaw: greedy · Manner: mercurial · Disposition: cautious  
Impression: Watches who comes to the yard and why. Asks your business before you can ask theirs.  
How they deal: Says nothing about where the hides come from.  
Wants (now): Find the weak spot in what Agamemnon Attaleiates is doing, and press on it.  
Wants (life): Be counted one day among those who lead Town Mayor.  
Hook: Their apprentice has been talking to a rival, and came back with an offer to buy them out.  
**Secret: Raised something from a grave, once, and could not put it back** · Stakes: It has been seen at the edge of the fields

#### deeds · `postsLetters`
BORN · seed `r2r-town-21`

**Sempronia Capito**, the sawyer (mid-thirties) · town, Campoplenum  
Temperament: — · Flaw: reckless · Manner: opportunistic · Disposition: dismissive  
Impression: Busy and impatient. The saws run all day and every stop costs money.  
How they deal: Shouts the price over the noise and turns back to the logs.  
Wants (now): Do Minucia Cordus one useful favour this season, unasked.  
Wants (life): Carry the name of the sawmill beyond this place, so people come from far off for the work done there.  
Hook: Their landlord has doubled the rent and will lower it only if they report on the family next door.  
**Secret: Writes a letter every week to someone who died years ago, and posts every one** · Stakes: The carrier has started reading them

#### deeds · `feedsNeighbour`
BORN · seed `r2r-city-7`

**Quartica Denter**, the scroll scribe (early sixties) · city, Faromare  
Temperament: dependable · Flaw: manipulative · Manner: cynical · Disposition: transactional  
Impression: Exact about everything. Prices by the spell and the length.  
How they deal: Sells copies at a posted rate; rare spells take longer and cost more.  
Wants (now): Win the scroll scribe's desk first call on any help those who govern can give this season.  
Wants (life): Make Egnatius Sabinus the first of many who owe them.  
Hook: Someone has been making inquiries about their past research. Not the published work, the unpublished work.  
**Secret: Leaves food on a neighbour's step each night, and has never once let themselves be seen** · Stakes: The neighbour has started lying awake to catch them

#### deeds · `bearLie`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Has told one small lie for so long that half the place believes they once wrestled a bear** · Stakes: Sooner or later someone who was there will pass through

#### deeds · `paysDebts`
BORN · seed `r2r-city-55`

**Gregorios Argyros**, the bishop (early thirties) · city, Archoambelos  
Temperament: — · Flaw: hypocritical · Manner: ambitious · Disposition: welcoming  
Impression: Interested in you as a person, or at least in what you might need. The attention feels real.  
How they deal: Tells you what you want to hear, and the story changes with who else is listening.  
Wants (now): Find out what Despoina Chomatenos really wants in return.  
Wants (life): Have the final say in everything that touches them.  
Hook: They know which of the current leadership will be the next to fall from grace. They are waiting.  
**Secret: Has been quietly paying off a stranger's debts for years, and will not say why** · Stakes: The stranger has found out, and wants to know what is owed in return

#### deeds · `buriedHoard`
BORN · seed `r2r-metropolis-8`

**Hadwige Uhl**, the mint master (seventies) · metropolis, Langenberg  
Temperament: — · Flaw: deceitful · Manner: opportunistic · Disposition: transactional  
Impression: Precise and formal, with a scale on the desk and a weight for every coin.  
How they deal: Will change coin and test metal at the posted rate; asks who you are first.  
Wants (now): Get the mint through the season without borrowing.  
Wants (life): Outlast Thieves' Guild, and still be standing with Royal Authority when they are gone.  
Hook: A ledger they swore was complete is missing the pages for one season, and an auditor is coming to read it.  
**Secret: Buried a fortune somewhere near and has forgotten exactly where** · Stakes: They dig at night, and someone has been filling in the holes

#### deeds · `savedEnemy`
BORN · seed `r2s-mass_migration-city-2`

**Pavlos Melas**, the outfitter (seventies) · city, Megalrema  
Temperament: scholarly · Flaw: vain · Manner: theatrical · Disposition: transactional  
Impression: Quick and practical. Sizes up your gear and your purse in one look.  
How they deal: Sells everything a delver needs and buys back what comes up; the prices go both ways.  
Wants (now): Take one piece of business from Thieves' Guild and bring it to Merchant oligarchy.  
Wants (life): Be counted one day among those who lead Merchant oligarchy.  
Hook: A contract they signed in difficult times has a clause they didn't fully read. Someone has read it.  
**Secret: Once saved the life of the person they hate most, and has regretted it every day since** · Stakes: That person still does not know who it was

#### deeds · `wroteSong`
BORN · seed `r2r-city-11`

**Ramesh Trivedi**, the midwife (early twenties) · city, Puripat  
Temperament: equitable · Flaw: ruthless · Manner: methodical · Disposition: cautious  
Impression: Watchful and private. People lower their voices as the midwife passes.  
How they deal: Will help anyone in need; says nothing about anyone else's household.  
Wants (now): Ask Vasudhara Prasad for advice on one hard decision this season.  
Wants (life): Hand on the midwife's house with full stores, honest accounts and nothing owed.  
Hook: They lent their savings to a friend who has since left, and the friend's family says there was no loan.  
**Secret: Wrote the song everyone here knows, and has never told a soul** · Stakes: A singer passing through is claiming it as their own

#### deeds · `tookBlame`
BORN · seed `r2r-city-17`

**Ughul Jirgin**, the necromancer-overseer (late forties) · city, Jalaldavan  
Temperament: protective · Flaw: manipulative · Manner: melancholic · Disposition: cautious  
Impression: Pale, precise and quiet, with a cold that seems to follow them.  
How they deal: Asks what you want with the dead before saying anything else.  
Wants (now): Do Rentsendorj Kiyad one useful favour this season, unasked.  
Wants (life): Be given the secrets of Arcane Orders to keep, as well as its errands to run.  
Hook: They've been approached by someone who knows things about their research that were never made public.  
**Secret: Took the blame for another's crime, and has carried the name of it ever since** · Stakes: The one who did it has prospered

#### deeds · `hidesSomeone`
BORN · seed `r2r-town-9`

**Sigrid Ketilsson**, the carriers' master (early sixties) · town, Ravengarde  
Temperament: dependable · Flaw: wrathful · Manner: nostalgic · Disposition: transactional  
Impression: Loud, practical and quick. Has a carrier and a price for every load.  
How they deal: Hires carriers by the day and the load; heavy loads cost more.  
Wants (now): Bring Merchant Guilds a piece of news before anyone else does.  
Wants (life): Make the caravanserai a branch of the carriers' guild in all but name.  
Hook: They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.  
**Secret: Is hiding someone under their roof, and has been for a month** · Stakes: The house is not as quiet as it was

#### deeds · `stoleRelic`
BORN · seed `r2r-city-14`

**Titus Silanus**, the sawyer (mid-twenties) · city, Serrasinum  
Temperament: incorruptible · Flaw: deceitful · Manner: brooding · Disposition: welcoming  
Impression: Easy and open, smelling of fresh pine. Likes to talk about wood more than most people do.  
How they deal: Tells you which timber is good this year and who has been buying it.  
Wants (now): Keep every meeting with Junia Tubertus secret, even from their closest friends.  
Wants (life): Pull the strings in this place without anyone seeing their hand.  
Hook: Their savings were hidden in a place only one other person knew, and the savings are gone.  
**Secret: Stole a holy thing from a roadside altar and cannot bring themselves to sell it** · Stakes: The ones it was taken from are still asking along the road

#### deeds · `fakedDeath`
PLANTED · seed `r2r-town-0`

**Laevinus Scipio**, the mayor (mid-thirties) · town, Farosaltus  
Temperament: — · Flaw: overbearing · Manner: melancholic · Disposition: cautious  
Impression: Tired. Not rudely, but visibly. This is a person who has been doing a hard job for a long time.  
How they deal: Keeps you at a distance, and makes you prove you are worth their time.  
Wants (now): Make sure no one can trace the arrangement between Corrupt Council and Thieves' Guild back to them.  
Wants (life): Keep Lepidus Serranus loyal for life, and make loyalty pay better than ambition.  
Hook: A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why.  
**Secret: Is supposed to be dead, with a grave and mourners in another town** · Stakes: One of the mourners travels

#### deeds · `forgedLetters`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Fakes letters of introduction, and more than one newcomer who prospered here carried one** · Stakes: One of them has been found out, elsewhere

#### deeds · `swappedBabes`
BORN · seed `r2r-hamlet-25`

**Liutgar Klein**, the brewster (mid-fifties) · hamlet, Rotbrücke  
Temperament: diligent · Flaw: — · Manner: nostalgic · Disposition: transactional  
Impression: Tired, but alert. The combination of someone who works hard and pays attention.  
How they deal: Wants every term settled before anything changes hands, and writes it down.  
Wants (now): Find out how much is owed by the wayside inn, and to whom.  
Wants (life): Bring every step of the trade, from the first goods to the last, under the roof of the alehouse.  
Hook: The oldest family has started keeping its children indoors after dark, and will not say what they saw.  
**Secret: Exchanged two newborns years ago to save one of them from a hard house, and has watched both grow** · Stakes: The two are of an age now to be told, or to find out

#### deeds · `burnedRecord`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Burned the one record that proved a neighbour's claim, out of spite** · Stakes: A copy exists

#### deeds · `soldThrice`
BORN · seed `r2s-politically_fractured-town-3`

**Hierotheos Lekapenos**, the bloc's speaker (late forties) · town, Ioannovrysi  
Temperament: — · Flaw: envious · Manner: contrarian · Disposition: welcoming  
Impression: Warmer than their office suggests. They have the gift of making people feel briefly important.  
How they deal: Promises help easily, and is hard to find when the time comes to give it.  
Wants (now): Keep Pulcheria Nikerites from calling in what is owed this season.  
Wants (life): Make sure no one wrongs them twice.  
Hook: A rule they wrote to stop one abuse has opened the door to another, and the people using it are their friends.  
**Secret: Sold the same field to three buyers, and is running out of excuses** · Stakes: The three have started comparing papers

#### deeds · `wishedDeath`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Wished a brother dead in anger the night before he died, and has believed it their doing ever since** · Stakes: They are atoning in ways that have started to cost other people

#### deeds · `thumbOnScale`
BORN · seed `r2s-religious_conversion-metropolis-2`

**Járnsaxa Thorsson**, the master baker (mid-fifties) · metropolis, Eisnes  
Temperament: candid · Flaw: manipulative · Manner: hedonistic · Disposition: welcoming  
Impression: Warm in every sense: flour on the arms, the smell of bread, a cheerful greeting before dawn.  
How they deal: Talks while serving; knows every household by the bread it buys.  
Wants (now): Find a second supplier of grain, so one lost cart cannot stop the work at the bakers.  
Wants (life): Make powerful people need them without knowing why.  
Hook: A neighbour's quarrel with them has gone before the people who settle disputes, and the hearing is next week.  
**Secret: Has kept a thumb on the scale for twenty years, a grain at a time** · Stakes: Someone has brought their own weights

#### deeds · `spared`
BORN · seed `r2r-metropolis-55`

**Ulbrecht Frank**, the blade captain (mid-thirties) · metropolis, Flachmoor  
Temperament: scholarly · Flaw: cowardly · Manner: fatalistic · Disposition: cautious  
Impression: Alert. Not hostile, but attentive in a way that doesn't quite switch off.  
How they deal: Keeps out of trouble by keeping away from you, and sends you to someone else when they can.  
Wants (now): Take one piece of business from Craft Guilds and bring it to Merchant Guilds.  
Wants (life): Have enough friends in high places that no one dares touch them.  
Hook: They have been ordered to clear a family off land the family has worked for generations, and the order is lawful.  
**Secret: Was sent here to kill someone, and has stayed eleven years without doing it** · Stakes: Whoever sent them has started to ask

#### deeds · `holdsDeeds`
BORN · seed `r2r-city-40`

**Li Chen**, the house boss (early twenties) · city, Weikou  
Temperament: charismatic · Flaw: overbearing · Manner: brooding · Disposition: welcoming  
Impression: Well dressed, smiling, with a hand on every shoulder in the room. Makes newcomers feel like guests.  
How they deal: Offers a drink and a seat at a table; watches how you play before offering anything more.  
Wants (now): Learn what Myung Jung has been saying about them, and to whom.  
Wants (life): Become someone Merchant Guilds cannot do without.  
Hook: The dice at one table have been weighted, and it was not done by anyone they pay.  
**Secret: Holds, by a debt no one remembers, the deed to half the houses on their street** · Stakes: They have not decided whether to call it in

#### deeds · `gaveCredit`
BORN · seed `r2r-town-13`

**Toragana Merkit**, the master baker (late fifties) · town, Vatankher  
Temperament: — · Flaw: manipulative · Manner: reserved · Disposition: cautious  
Impression: Watches the till and the trays with equal care.  
How they deal: Polite and brief; does not give credit to anyone they do not know.  
Wants (now): Get the bakers through the season without borrowing.  
Wants (life): Free the bakers from depending on a single source of grain.  
Hook: Their spouse has been making payments to someone every month for years, and will not say who.  
**Secret: Pulled three children from a flood years ago and let another take the credit** · Stakes: The other has built a name on it

#### deeds · `stagedMiracle`
BORN · seed `r2r-city-5`

**Amina al-Bukhari**, the scroll scribe (early sixties) · city, Khānhaven  
Temperament: diplomatic · Flaw: domineering · Manner: contrarian · Disposition: welcoming  
Impression: Eager to talk about spells and the hands that wrote them.  
How they deal: Shows off the finest scrolls and explains how each is made.  
Wants (now): Be the one others look to when something goes wrong.  
Wants (life): Turn the debt to Wadih al-Jabbar into a friendship between equals.  
Hook: An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago.  
**Secret: Once staged a miracle with a mirror and a length of thread, and people still speak of it** · Stakes: Pilgrims have begun to ask the way

#### deeds · `killedTheBeast`
PLANTED · seed `r2s-infiltrated-hamlet-0`

**Rhiannon Lynch**, the militia captain (mid-sixties) · hamlet, Ardgill  
Temperament: — · Flaw: vindictive · Manner: stoic · Disposition: cautious  
Impression: Alert. Not hostile, but attentive in a way that doesn't quite switch off.  
How they deal: Treats every question as a possible threat, and remembers who asked it.  
Wants (now): Lay in a season of iron at the citizen militia while it can still be had.  
Wants (life): Never end up in Maeve Byrne's shadow.  
Hook: The oldest resident refuses to speak about a specific year. Others confirm the year exists. No one remembers what happened.  
**Secret: Killed the thing that used to take the sheep, alone, and told no one** · Stakes: It had a mate

#### deeds · `wateredAle`
PLANTED · seed `r2r-city-0`

**Marta Tretyakov**, the innkeeper (early twenties) · city, Goraka  
Temperament: plain-dealing · Flaw: lazy · Manner: detached · Disposition: welcoming  
Impression: Apron, rolled sleeves and a ready greeting. They have already guessed which room you will want.  
How they deal: Offers a seat, a meal and the gossip of the road before you have taken your coat off.  
Wants (now): Take on the work in Merchant Guilds that no one else wants, and do it without complaint.  
Wants (life): Make the work at the inns and taverns the thing this place is known for.  
Hook: Someone close to them has been ill in a way nobody can name, and recovers whenever one particular visitor stays away.  
**Secret: Has watered the ale for years, and saved every coin of the difference for someone else's child** · Stakes: The child's guardian has started asking where the money comes from

#### deeds · `paidToForget`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Saw who did a thing that another was punished for, and was paid to forget** · Stakes: The payments have stopped

#### deeds · `keptThePurse`
BORN · seed `r2r-town-52`

**Yifan Cao**, the senior craft-guild master (seventies) · town, Yunxian  
Temperament: temperate · Flaw: greedy · Manner: calculating · Disposition: welcoming  
Impression: Affable. The manner of someone for whom friendliness is both genuine and useful.  
How they deal: Free with talk and small favours, and remembers every one when they want something back.  
Wants (now): Be in the room the next time Craft Guilds must decide something that matters.  
Wants (life): Grow rich enough that no one can ever tell them no.  
Hook: A business rival has offered them a partnership with terms so good it must be a trap. They can't find the trap.  
**Secret: Found a dead traveller's purse years ago, kept it, and has added a coin to it every week since, meaning to give it back** · Stakes: The traveller's kin have finally come asking

#### deeds · `lostTheBet`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Lost the family's land at dice in one night, and has let everyone believe it was sold** · Stakes: The winner's heir has found the paper

#### natures · `cold` (the owner's)
BORN · seed `r2r-city-1`

**Cairbre Reilly**, the bowyer (early twenties) · city, Pengill  
Temperament: fair-minded · Flaw: paranoid · Manner: mercurial · Disposition: cautious  
Impression: Steady hands and a calloused draw-finger. They test the bend of a stave while they talk to you.  
How they deal: Asks what the bow is for before agreeing to make it, and remembers the answer.  
Wants (now): Be asked for an opinion by those who lead The Guard, once, this season.  
Wants (life): Be free of what is owed to Deirdre Sheridan, completely.  
Hook: They have been invited to the wedding of someone who once ruined their family, and refusing would be noticed.  
**Secret: Feels nothing for other people and has learned to act as though they do** · Stakes: Everyone close to them has seen the act slip once, and no two of them have compared what they saw

#### natures · `counting` (the owner's)
BORN · seed `r2s-occupied-town-0`

**Felicia Strabo**, the cobbler (late fifties) · town, Cerrocastra  
Temperament: — · Flaw: volatile · Manner: mercurial · Disposition: cautious  
Impression: Quiet and careful. The good work is kept in the back and shown only on request.  
How they deal: Polite, but asks where you are from before taking an order for new shoes.  
Wants (now): Take one piece of business from Occupation Authority and bring it to Town Council.  
Wants (life): Make the work at the cobbler's guild safe from the next shortage, with more than one source for every need.  
Hook: They were seen leaving a house they had no business in, on the night its owner disappeared.  
**Secret: Cannot leave a thing uneven: counts, straightens and checks again, and conceals how much of the day it takes** · Stakes: Those who have noticed think it harmless; it costs them more each year

#### natures · `givesUp` (the owner's)
BORN · seed `r2r-metropolis-51`

**Damir Ilyin**, the brewer (mid-sixties) · metropolis, Divoko  
Temperament: — · Flaw: lazy · Manner: iconoclast · Disposition: welcoming  
Impression: Smells of malt and hops, round and good-humoured. Offers you a taste before anything else.  
How they deal: Generous with a cup and with talk; hears everything the taverns say.  
Wants (now): Take on more hands at the brewery, and keep them busy all season.  
Wants (life): Outlast Merchant Guilds, and still be standing with Craft Guilds when they are gone.  
Hook: They found something hidden in a place it shouldn't be. They put it back. They haven't told anyone.  
**Secret: Is only at ease when giving something up for someone else, and goes looking for the chance** · Stakes: Anyone who sees it can have whatever they ask for

#### natures · `noPain` (the owner's)
BORN · seed `r2r-metropolis-59`

**Setsuko Liu**, the master furrier (early twenties) · metropolis, Dongcheng  
Temperament: warm-hearted · Flaw: — · Manner: fatalistic · Disposition: welcoming  
Impression: Smooth and flattering. Drapes a fur over your shoulders before you can say no.  
How they deal: Talks about the hunters, the trade routes and who has been buying furs this season.  
Wants (now): Keep the work going at the furrier's district through the season, whatever it takes.  
Wants (life): Never end up in Zixuan Chen's shadow.  
Hook: They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.  
**Secret: Feels no pain, heat or cold, and has never told anyone** · Stakes: A wound they do not notice will one day be the one that matters

#### natures · `remembers`
BORN · seed `r2r-city-11`

**Dhruv Rao**, the customs collector (mid-fifties) · city, Puripat  
Temperament: — · Flaw: domineering · Manner: restless · Disposition: transactional  
Impression: Polite in a practised way. Every question has a fee attached to the answer.  
How they deal: Names the duty, takes the coin and writes the receipt; small favours have small prices.  
Wants (now): Learn what Nirmala Nair has been saying about them, and to whom.  
Wants (life): Build the work at the customs house into a trade that will feed the next generation here.  
Hook: A merchant they spoke against has started praising them in public, and will not say why.  
**Secret: Forgets nothing: every face, every word, every slight, whether they want it or not** · Stakes: People who have forgotten what they said in front of them should not have

#### natures · `noFaces`
BORN · seed `r2s-succession_void-metropolis-1`

**Andronikos Kyriadotes**, the lord (early twenties) · metropolis, Filoprion  
Temperament: diligent · Flaw: corrupt · Manner: melancholic · Disposition: transactional  
Impression: Tired, but alert. The combination of someone who works hard and pays attention.  
How they deal: Everything has a price, and the price rises the more you seem to need it.  
Wants (now): Put away more coin this season than last.  
Wants (life): Stay at the head of The Highborn Circle until they choose who comes after them.  
Hook: A regular customer has stopped coming. The reason they've been given doesn't make sense.  
**Secret: Cannot tell one face from another, and knows people by voice and walk** · Stakes: Anyone who learned it could stand in front of them as someone else

#### natures · `noSleep`
BORN · seed `r2s-wartime-town-2`

**Jyoti Pillai**, the alchemist (mid-sixties) · town, Shivapalli  
Temperament: — · Flaw: cold-blooded · Manner: restless · Disposition: dismissive  
Impression: Polite but removed. Not unfriendly, just operating at a different register.  
How they deal: Curt to the point of rudeness, and does not care how it lands.  
Wants (now): Beat Suvarchala Pandey at something this season, in front of people who matter.  
Wants (life): Own something that earns while they sleep.  
Hook: They've been approached by someone who knows things about their research that were never made public.  
**Secret: Has not slept a whole night in years, and does not let it show** · Stakes: It is beginning to show

#### natures · `noTouch`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Cannot bear to be touched, and has built a life that conceals it** · Stakes: One crowded room, one friendly hand, and it would be plain to everyone

#### natures · `xenophobe` (the owner's)
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Distrusts anyone not born here, and hides it behind good manners** · Stakes: It decides more of their dealings than anyone has noticed

#### natures · `fireFear` (the owner's)
BORN · seed `r2r-city-36`

**Notburga Zimmermann**, the chief magistrate (mid-sixties) · city, Schwarzmoor  
Temperament: stalwart · Flaw: — · Manner: restless · Disposition: cautious  
Impression: Formally polite. Every sentence is measured before it leaves their mouth.  
How they deal: Answers slowly, checks what you say against what they know, and gives little at a first meeting.  
Wants (now): Speak for Ecclesiastical Council in one dispute this season where Dietmar Lange would usually speak.  
Wants (life): Get so far ahead of Salome Werner that no one remembers they were ever rivals.  
Hook: They owe their post to a patron who has started asking for repayment in favours they cannot grant openly.  
**Secret: Survived a fire and cannot stand near an open flame** · Stakes: The day they must cross one, everyone will see

#### natures · `gambler` (the owner's)
BORN · seed `r2r-thorp-3`

**Borchigid Kiyad**, Elder (mid-thirties) · thorp, Gantulgaabad  
Temperament: intuitive · Flaw: callous · Manner: perfectionist · Disposition: welcoming  
Impression: Weathered and steady, with hands like rope and an eye always on the sky.  
How they deal: Talks about the catch, the weather and the boats; quick to offer a meal of fish.  
Wants (now): Get the fishing community through the season without borrowing.  
Wants (life): Gather enough wealth to pass on, and leave the family rich after them.  
Hook: Someone close to them has been ill in a way nobody can name, and recovers whenever one particular visitor stays away.  
**Secret: Is far better at dice and cards than anyone here knows** · Stakes: The people they have been quietly winning from are starting to count

#### natures · `growsYounger` (the owner's) [magic only]
BORN · seed `r2r-metropolis-21`

**Anna Lange**, the wharfinger (mid-sixties) · metropolis, Altmoor  
Temperament: optimistic · Flaw: — · Manner: theatrical · Disposition: transactional  
Impression: Weathered, loud and quick with figures. Has a berth and a fee for every ship.  
How they deal: Names the fee for a berth and the time it is free; pays attention to which ships pay on time.  
Wants (now): Lay in a season of timber at the docks while it can still be had.  
Wants (life): See every child they know grow up fed and safe.  
Hook: They found a name scratched into their door overnight, and it belongs to someone who died last winter.  
**Secret: Was born old and grows younger each year, and no one here has known them long enough to notice** · Stakes: In a few more years the questions will start

#### natures · `cannotLie`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Cannot tell a lie, not even a kind one, and has built a life in which no one asks the wrong question** · Stakes: The wrong question is coming

#### natures · `sleepwalks`
BORN · seed `r2s-plague_onset-metropolis-0`

**Tserenpuntsag Besud**, the whisper broker (mid-twenties) · metropolis, Tarkhanshari  
Temperament: — · Flaw: callous · Manner: secretive · Disposition: welcoming  
Impression: Charming and attentive, with a talent for making you say more than you meant to.  
How they deal: Friendly and curious; remembers everything you say.  
Wants (now): Get the whisper market through the season without borrowing.  
Wants (life): Gather enough wealth to pass on, and leave the family rich after them.  
Hook: A client wants to buy back a secret the client sold them, at any price.  
**Secret: Walks in their sleep, and has woken in places they do not remember reaching** · Stakes: Something went missing on one of those nights

#### natures · `noFear`
BORN · seed `r2r-village-33`

**Sneha Balan**, Elder (mid-forties) · village, Devapur  
Temperament: tenacious · Flaw: — · Manner: detached · Disposition: welcoming  
Impression: Broad-shouldered and easy, with the patience of someone who spends the day waiting for the stones to turn.  
How they deal: Talks freely about the harvest and who brought what to the mill; it is a good place to hear who is short this year.  
Wants (now): Ask Hemavati Chatterjee for advice on one hard decision this season.  
Wants (life): Hand Elder Council on to an heir of their own choosing, and not to Vijay Bakshi.  
Hook: Their apprentice has been talking to a rival, and came back with an offer to buy them out.  
**Secret: Has never once felt fear, and has learned to imitate it so as not to alarm people** · Stakes: The day they do not flinch, someone will remember it

#### natures · `voices`
BORN · seed `r2r-town-32`

**Vijayalakshmi Dixit**, the toll-keeper (late forties) · town, Vedabari  
Temperament: — · Flaw: imperious · Manner: calculating · Disposition: welcoming  
Impression: Bored and glad of company, with gossip about everyone who has crossed this week.  
How they deal: Talks about the road and the travellers; knows who has passed and when.  
Wants (now): Stand by Lakshmana Kulkarni in their next quarrel, whoever it is with.  
Wants (life): Make the toll bridge so needed by those who govern that no one dares touch the rights of the house.  
Hook: They know who committed a crime the guard is currently investigating. They're not telling the guard.  
**Secret: Hears a voice that no one else hears, and has learned not to answer it in company** · Stakes: The day they answer it aloud, people will decide what they are

#### natures · `hoards`
BORN · seed `r2s-insurgency-city-2`

**Berke Uzbek**, the sawyer (early fifties) · city, Jalalkul  
Temperament: humble · Flaw: paranoid · Manner: idealistic · Disposition: dismissive  
Impression: Busy and impatient. The saws run all day and every stop costs money.  
How they deal: Shouts the price over the noise and turns back to the logs.  
Wants (now): Do Wershi Budaad one useful favour this season, unasked.  
Wants (life): Bring the work at the sawmill back to its full strength, and keep it there.  
Hook: They have been invited to the wedding of someone who once ruined their family, and refusing would be noticed.  
**Secret: Cannot throw anything away, and the back rooms are full to the rafters** · Stakes: One spark, or one curious visitor

#### natures · `luck` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Has never lost a wager, a coin toss or a drawn lot, and is frightened of what that means** · Stakes: Others have started to bet on them

#### natures · `noTaste`
BORN · seed `r2r-city-0`

**Frantisek Dmitriev**, the master butcher (mid-twenties) · city, Goraka  
Temperament: wise · Flaw: suspicious · Manner: cynical · Disposition: welcoming  
Impression: Red-faced and jovial, with a joke for every customer and a word about the weather.  
How they deal: Talks about the farms and the herds; hears who is selling stock and why.  
Wants (now): Look for a way to do more at the butchers with the same hands.  
Wants (life): Secure rights for the butchers that will outlast whoever governs now.  
Hook: Their savings were hidden in a place only one other person knew, and the savings are gone.  
**Secret: Cannot taste or smell anything, and has hidden it for years** · Stakes: The day something spoils, they will be the last to know

#### natures · `afraidDark`
BORN · seed `r2s-mass_migration-city-3`

**Fionnuala Fitzgerald**, the potter (late fifties) · city, Rossmere  
Temperament: gracious · Flaw: — · Manner: secretive · Disposition: cautious  
Impression: Watches visitors near the shelves as if they might break something.  
How they deal: Polite enough; keeps people back from the drying racks and the kiln.  
Wants (now): Do one thing for Craft Guilds this season that the people who lead it cannot ignore.  
Wants (life): Outlast Merchant Guilds, and still be standing with Craft Guilds when they are gone.  
Hook: Their savings were hidden in a place only one other person knew, and the savings are gone.  
**Secret: Cannot bear the dark, and burns a light all night at a cost they can ill afford** · Stakes: The night the oil runs out, someone will hear

#### natures · `twoPeople`
BORN · seed `r2r-metropolis-9`

**Priya Mukherjee**, the innkeeper (late fifties) · metropolis, Satyagarh  
Temperament: dependable · Flaw: callous · Manner: fatalistic · Disposition: transactional  
Impression: Busy, and good at being busy. Counts the room with one look: who has paid, who has not.  
How they deal: Friendly while the coin lasts; asks for payment up front from anyone they have not seen before.  
Wants (now): Do one thing for Merchant Guilds this season that the people who lead it cannot ignore.  
Wants (life): Bring Craft Guilds under the sway of Merchant Guilds, one member at a time.  
Hook: Their landlord has doubled the rent and will lower it only if they report on the family next door.  
**Secret: Is two people by turns, and neither remembers the other's days** · Stakes: One of them has made promises the other will have to keep

#### natures · `cannotRead`
BORN · seed `r2r-city-31`

**Bera Eindriðason**, the wizard (late twenties) · city, Vikkvam  
Temperament: resourceful · Flaw: lazy · Manner: methodical · Disposition: cautious  
Impression: Precise: words chosen carefully, pauses before answering, a slight sense of being assessed.  
How they deal: Keeps out of trouble by keeping away from you, and sends you to someone else when they can.  
Wants (now): Win the wizard's tower first call on any help those who govern can give this season.  
Wants (life): Live well, and worry about tomorrow when it comes.  
Hook: An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago.  
**Secret: Cannot read a word, and conceals it behind a good memory and a trusted helper** · Stakes: The helper has started to ask for more

#### natures · `bloodFaint`
BORN · seed `r2r-metropolis-0`

**Ning Wei**, the exchange master (mid-forties) · metropolis, Baigang  
Temperament: — · Flaw: overbearing · Manner: fatalistic · Disposition: welcoming  
Impression: Quick to smile, quick to calculate. Both things are happening simultaneously.  
How they deal: Gracious in the way of someone doing you a kindness, and expects to be thanked for it.  
Wants (now): Be in the room the next time Shadow Senate must decide something that matters.  
Wants (life): Have the rights of the international trade center set down so firmly that the next ruler must keep them too.  
Hook: They sold a batch they knew was bad, and the customer it sickened is now asking who supplied it.  
**Secret: Faints at the sight of blood, and has arranged never to be seen near it** · Stakes: The day someone is hurt in front of them, it will be known

#### natures · `foresees` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Dreams of things before they happen, and has stopped telling anyone** · Stakes: The last dream was about this place

#### natures · `beastSpeech` [magic only]
BORN · seed `r2r-city-5`

**Zakariya al-Yamani**, the pawnbroker (mid-forties) · city, Khānhaven  
Temperament: wise · Flaw: corrupt · Manner: idealistic · Disposition: cautious  
Impression: Polite behind a grille. Never asks where a thing came from, and never forgets who brought it.  
How they deal: Takes goods and gives coin; answers no questions about other customers.  
Wants (now): Find a patron among those who lead The Merchant Bloc, and make themselves useful to them.  
Wants (life): Make Thieves' Guild the first name people think of, ahead of City Council.  
Hook: Someone has been selling cheaper and worse goods under their mark, and customers are blaming them.  
**Secret: Understands what animals say, and wishes they did not** · Stakes: The dogs here know something

#### natures · `ageless` [magic only]
BORN · seed `r2r-town-14`

**Faris ibn Ahmed**, the miller (mid-forties) · town, Nahrkhel  
Temperament: — · Flaw: — · Manner: proud · Disposition: welcoming  
Impression: Broad-shouldered and easy, with the patience of someone who spends the day waiting for the stones to turn.  
How they deal: Talks freely about the harvest and who brought what to the mill; it is a good place to hear who is short this year.  
Wants (now): Answer the next move by Thieves' Guild against Merchant Council, quickly and in public.  
Wants (life): Grow the work at the mills until no one nearby can match it.  
Hook: Someone close to them has been ill in a way nobody can name, and recovers whenever one particular visitor stays away.  
**Secret: Has not aged a day in forty years, and moves on before people count** · Stakes: They have stayed here too long already

#### natures · `takes`
BORN · seed `r2r-metropolis-30`

**Thordis Lifolfsson**, the dean (mid-twenties) · metropolis, Ulfoy  
Temperament: — · Flaw: — · Manner: stoic · Disposition: cautious  
Impression: Composed. The particular stillness of someone who has practised being still.  
How they deal: Answers questions without volunteering; watches who you talk to next.  
Wants (now): Stay out of every quarrel they can this season.  
Wants (life): Leave the houses of worship protected by law, so whoever runs the house next need not fight for the same rights.  
Hook: They know which of the current leadership will be the next to fall from grace. They are waiting.  
**Secret: Takes small things without meaning to, and returns most of them** · Stakes: One thing they took cannot be returned

#### natures · `laughs`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Laughs when they are afraid, and has paid for it more than once** · Stakes: The next time will be the wrong time

#### natures · `despair` (the owner's)
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is in a black despair that nothing lifts, and gets through each day on habit alone** · Stakes: The habits are wearing thin, and no one has noticed

#### natures · `cannotRefuse`
BORN · seed `r2r-village-52`

**Wilhelm Lehmann**, the carpenter (early fifties) · village, Niederbrücke  
Temperament: discerning · Flaw: greedy · Manner: calculating · Disposition: welcoming  
Impression: Easy-going, with shavings in the hair and a folding rule tucked in the belt.  
How they deal: Happy to talk about any job, and about who nearby has been building what.  
Wants (now): Take on the work in Elder Council that no one else wants, and do it without complaint.  
Wants (life): Leave the carpenter's workshop protected by law, so whoever runs the house next need not fight for the same rights.  
Hook: An old letter of theirs, written in anger years ago, has been shown to the person it was about.  
**Secret: Cannot say no to anyone, and has promised the same thing to three people** · Stakes: All three are coming to collect

#### natures · `smallLies`
BORN · seed `r2r-village-17`

**Ronan Carey**, Reeve (late sixties) · village, Cnocbury  
Temperament: principled · Flaw: — · Manner: proud · Disposition: transactional  
Impression: Wet to the elbows, loud, and quick with a knife. Calls the prices over every head in the market.  
How they deal: Haggles with pleasure; the price drops for anyone who buys a lot and comes back.  
Wants (now): Keep the old lessons between them and Una Jordan private.  
Wants (life): Leave a name that no one can say was ever bought.  
Hook: A lender has bought the note on their shop and wants it settled by the end of the month.  
**Secret: Lies without meaning to, about small things, and remembers every one** · Stakes: Two of the lies have met

#### natures · `talksToDead`
BORN · seed `r2r-metropolis-39`

**Christodoulaki Choniates**, the brickmaker (late fifties) · metropolis, Lykopolis  
Temperament: — · Flaw: vindictive · Manner: mercurial · Disposition: dismissive  
Impression: Too busy at the kilns to be pleasant. The smoke is always in their eyes.  
How they deal: Wants to know how many bricks and when; anything else can wait.  
Wants (now): Keep the work going at the brickmaker's brickyard through the season, whatever it takes.  
Wants (life): Be counted one day among those who lead Craft Guilds.  
Hook: Their best customer owes them a year's takings and has started avoiding their street.  
**Secret: Talks every evening to a spouse who died, and sets a place at the table** · Stakes: Lately they have begun to pause as if for an answer

#### natures · `afraidOfBirds`
BORN · seed `r2r-village-28`

**Umesh Jha**, the priest (mid-forties) · village, Radhakund  
Temperament: discerning · Flaw: suspicious · Manner: perfectionist · Disposition: welcoming  
Impression: Interested in you as a person, or at least in what you might need. The attention feels real.  
How they deal: Friendly on the surface, but soon asks where you are staying and who sent you.  
Wants (now): Make sure no new rule from those who govern costs the house of worship anything this season.  
Wants (life): Make peace between Religious Authorities and Elder Council on terms Religious Authorities can live with.  
Hook: Someone has been leaving offerings at the shrine that shouldn't be possible. The site has been sealed.  
**Secret: Is terrified of birds, all of them, and plans every walk around the dovecote** · Stakes: Someone has noticed, and has bought a goose

#### natures · `lovesStorms`
BORN · seed `r2r-hamlet-56`

**Slavica Alexeyev**, the dairy farmer (seventies) · hamlet, Polavich  
Temperament: magnanimous · Flaw: arrogant · Manner: perfectionist · Disposition: welcoming  
Impression: Red-cheeked and cheerful, smelling of the byre, with a jug of milk ready.  
How they deal: Offers a cup and talk of the weather and the price of milk.  
Wants (now): Be the one others look to when something goes wrong.  
Wants (life): Become someone Headman's Authority cannot do without.  
Hook: Someone keeps paying off their small debts around the place before they can, and has left no name.  
**Secret: Walks out into every storm, bare-headed, and comes back calmer** · Stakes: One day they will not come back

#### natures · `fearsWater`
BORN · seed `r2s-occupied-city-0`

**Paul Rosenfeld**, the tanner (mid-twenties) · city, Breitgrund  
Temperament: equitable · Flaw: imperious · Manner: ambitious · Disposition: dismissive  
Impression: Smells of the pits and keeps visitors at a distance.  
How they deal: Names the price for a hide and wants you gone.  
Wants (now): Pay every hand at the tanners in full and on time this season.  
Wants (life): Outlast Otto Berger, and be the one still standing.  
Hook: One of their staff has started asking questions about records from seven years ago. They've been reassigned twice already.  
**Secret: Has not crossed water since the day of a drowning, and will walk a day round sooner than take a ferry** · Stakes: The day the only way is across

#### natures · `reckons`
BORN · seed `r2r-town-48`

**Yafang He**, the coaching-inn keeper (mid-twenties) · town, Hongpu  
Temperament: forthright · Flaw: callous · Manner: zealous · Disposition: cautious  
Impression: Notes every traveller's name, face and baggage, and remembers all three.  
How they deal: Pleasant, but asks where you are going and when, and writes it down.  
Wants (now): Keep the quarrel between Merchant Guilds and Craft Guilds from turning into open trouble this season.  
Wants (life): Turn the bargain with Daisuke Matsumoto into real trust over the years.  
Hook: They overheard two people they know settle a bribe, and do not know whom to tell.  
**Secret: Can reckon any sum in their head faster than a clerk with a board, and pretends to count on their fingers** · Stakes: Someone with debts has noticed

#### natures · `neverAngry`
BORN · seed `r2s-slave_revolt-metropolis-2`

**Irene Groß**, the luxury merchant (late twenties) · metropolis, Weichfeld  
Temperament: — · Flaw: — · Manner: fatalistic · Disposition: welcoming  
Impression: Quick to smile, quick to calculate. Both things are happening simultaneously.  
How they deal: Offers information freely, and asks questions that sound like interest, not prying.  
Wants (now): Recover the economic loss from the market suspension, or redirect capital away from a labour system that may not survive this in its current form  
Wants (life): Be the first person Merchant Guilds would turn to, before anyone thinks to ask Zacharias Wirth.  
Hook: Their master craftsman is talking to a rival. They haven't confronted them. They're not sure what they'd do.  
**Secret: Has not been angry in twenty years, and is saving all of it for one person** · Stakes: That person lives nearer than they think

#### natures · `keepsTeeth`
BORN · seed `r2r-metropolis-14`

**Abhimanyu Anand**, the enchanter (late fifties) · metropolis, Prabhapeta  
Temperament: magnanimous · Flaw: — · Manner: perfectionist · Disposition: transactional  
Impression: Calm and exact. Every charm has a price, and custom work costs much more.  
How they deal: Sells from the shelves; commissions need a deposit and a month.  
Wants (now): Keep the accounts of the enchanter's shop balanced, and show them to anyone who asks.  
Wants (life): Build up stores large enough that the work at the enchanter's shop never stops for lack of supply again.  
Hook: An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago.  
**Secret: Keeps a tooth of everyone they have ever loved, in a tin** · Stakes: The tin is nearly full

#### natures · `cannotBeAlone`
BORN · seed `r2r-metropolis-50`

**Fergus Ryan**, the collier (late twenties) · metropolis, Penham  
Temperament: warm-hearted · Flaw: overbearing · Manner: eccentric · Disposition: cautious  
Impression: Black with soot to the elbows, eyes red from the smoke. Says little to people from outside the woods.  
How they deal: Answers questions about the woods; asks who sent you.  
Wants (now): Take one piece of business from Grand Council and bring it to Merchant Guilds.  
Wants (life): Turn the trouble at the charcoal kilns into a reason to do the work better.  
Hook: Their son has been seen at night with people who do not work, and comes home with coin.  
**Secret: Cannot bear to be alone, not for an hour, and has built a life with no empty rooms** · Stakes: The rooms are emptying

#### natures · `truthInWine`
BORN · seed `r2r-metropolis-32`

**Plautilla Crispus**, the arena master (late thirties) · metropolis, Torrinovum  
Temperament: — · Flaw: envious · Manner: perfectionist · Disposition: welcoming  
Impression: Loud, showy and expensively dressed, with a voice used to filling the stands.  
How they deal: Invites you to the games and offers good seats; asks if you have ever fought.  
Wants (now): Bring Cara Varro together with someone who can help them.  
Wants (life): Have what others have, and more of it.  
Hook: A petition they set aside has gathered names from half their street, and the people who signed it want an answer this week.  
**Secret: Tells the whole plain truth when drunk, and so never drinks** · Stakes: Someone has bought them a drink, and is waiting

#### natures · `hearsLies` [magic only]
BORN · seed `r2r-metropolis-46`

**Hanako Ma**, the collier (mid-forties) · metropolis, Beiguan  
Temperament: good-humoured · Flaw: — · Manner: superstitious · Disposition: cautious  
Impression: Black with soot to the elbows, eyes red from the smoke. Says little to people from outside the woods.  
How they deal: Answers questions about the woods; asks who sent you.  
Wants (now): Find the charcoal kilns one more source of money.  
Wants (life): Earn a place among the leaders of Merchant Guilds without buying it or marrying into it.  
Hook: They have been invited to the wedding of someone who once ruined their family, and refusing would be noticed.  
**Secret: Always knows when they are being lied to, and has learned to keep a straight face** · Stakes: They know of three lies in this place that matter

#### natures · `tooStrong`
BORN · seed `r2r-metropolis-2`

**Ruixiang Kimura**, the smelt master (early sixties) · metropolis, Xidao  
Temperament: — · Flaw: cowardly · Manner: iconoclast · Disposition: cautious  
Impression: Watchful of the furnace and the people near it. Moves visitors back without asking.  
How they deal: Talks about the trade, but not about the workers or the stream.  
Wants (now): Get the rights of the smelter written down and sealed by those who govern, this season.  
Wants (life): Leave Ukon Suzuki with no power left to do them harm.  
Hook: They have seen the same unmarked cart pass their door three nights running, and have not wondered why.  
**Secret: Is far stronger than anyone their size should be, and breaks things when they forget** · Stakes: The last thing they broke was someone's arm

#### natures · `mimic`
BORN · seed `r2r-metropolis-8`

**Dietmar Licht**, the lord (mid-fifties) · metropolis, Langenberg  
Temperament: clever · Flaw: — · Manner: opportunistic · Disposition: transactional  
Impression: Tired, but alert. The combination of someone who works hard and pays attention.  
How they deal: Bargains well, and spots a weak offer before you finish making it.  
Wants (now): Win over one of Oda Kauf's friends.  
Wants (life): Lead The Reform Line so long and so well that no one, Herbert Schröder included, thinks of replacing them.  
Hook: Their spouse has been making payments to someone every month for years, and will not say who.  
**Secret: Can speak in anyone's voice after hearing it once** · Stakes: They have already used it twice

#### natures · `luckless`
BORN · seed `r2r-city-27`

**Timur Oirat**, the company captain (late fifties) · city, Qaraiin  
Temperament: intuitive · Flaw: vindictive · Manner: reserved · Disposition: cautious  
Impression: Direct. They assess you in the first three seconds and their expression tells you they've reached a provisional conclusion.  
How they deal: Treats every question as a possible threat, and remembers who asked it.  
Wants (now): Learn who controls the supply of iron and grain, and get on good terms with them.  
Wants (life): Build up enough savings at the mercenary quarter to ride out two bad years.  
Hook: They've noticed the same group of faces at multiple locations where incidents occurred. No one else has.  
**Secret: Nothing they touch goes right, not once, and they have started to think it is aimed** · Stakes: People have begun to cross the street

#### natures · `oneBook`
BORN · seed `r2r-metropolis-15`

**Siddharth Mukherjee**, the barge master (mid-thirties) · metropolis, Nandamala  
Temperament: — · Flaw: ruthless · Manner: melancholic · Disposition: cautious  
Impression: Watches the cargo and the people near it.  
How they deal: Asks what you are sending and where; writes it down.  
Wants (now): Put away more coin this season than last.  
Wants (life): Outlast Kaikeyyi Bhat in Merchant Guilds, and be ready when the place falls empty.  
Hook: A lender has bought the note on their shop and wants it settled by the end of the month.  
**Secret: Taught themselves to read from a single book, knows it by heart, and has read nothing else** · Stakes: The book is not what they think it is

#### natures · `keepsList`
BORN · seed `r2s-plague_onset-metropolis-3`

**Pandit Bose**, the watch commander (late twenties) · metropolis, Umagrad  
Temperament: — · Flaw: greedy · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Find one person willing to speak against Kavya Iyer, and keep them safe until they do.  
Wants (life): Make Jai Khatri admit, in public, that they were wrong.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Keeps a list of every wrong done to them, with the dates, and reads it nightly** · Stakes: Half the place is on it

#### natures · `nightSight` [magic only]
BORN · seed `r2s-occupied-metropolis-0`

**Theophylaktos Exazenos**, the innkeeper (mid-forties) · metropolis, Chrissopetra  
Temperament: generous · Flaw: wrathful · Manner: reserved · Disposition: transactional  
Impression: Busy, and good at being busy. Counts the room with one look: who has paid, who has not.  
How they deal: Friendly while the coin lasts; asks for payment up front from anyone they have not seen before.  
Wants (now): Be asked for an opinion by those who lead Merchant Guilds, once, this season.  
Wants (life): Win the inns and taverns a voice whenever those who govern decide something that touches the work.  
Hook: They signed an order last month on bad information, and the family it ruined has learned whose seal is on it.  
**Secret: Sees in the dark as well as by day, and has never mentioned it** · Stakes: They have seen who walks at night here

#### natures · `lateLaugh`
BORN · seed `r2r-village-31`

**Svetlana Komarov**, the priest (early thirties) · village, Vysokoburg  
Temperament: discerning · Flaw: manipulative · Manner: opportunistic · Disposition: welcoming  
Impression: Interested in you as a person, or at least in what you might need. The attention feels real.  
How they deal: Tells you what you want to hear, and the story changes with who else is listening.  
Wants (now): Find the house of worship one more source of money.  
Wants (life): Build a life no one can see all of.  
Hook: The holy relic in their keeping is not what everyone believes it is. Only they know this.  
**Secret: Has never understood a joke in their life, and laughs half a breath after everyone else** · Stakes: One person has begun to test it

#### natures · `sings`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Sings in a voice that makes people weep, alone, where no one can hear** · Stakes: Someone has heard

#### natures · `sameBattle`
BORN · seed `r2s-politically_fractured-city-0`

**Esha Singh**, the mint master (early sixties) · city, Aryabagh  
Temperament: — · Flaw: wrathful · Manner: melancholic · Disposition: transactional  
Impression: Precise and formal, with a scale on the desk and a weight for every coin.  
How they deal: Will change coin and test metal at the posted rate; asks who you are first.  
Wants (now): Speak for Noble Governorship in one dispute this season where Sheela Kapoor would usually speak.  
Wants (life): Leave the mint protected by law, so whoever runs the house next need not fight for the same rights.  
Hook: An old ruling of theirs is being used to take a widow's house, and they cannot undo it without admitting the mistake.  
**Secret: Wakes every night at the same hour from the same battle, and walks until dawn** · Stakes: The watch has started to wonder who walks

#### natures · `wanderer`
BORN · seed `r2s-monster_pressure-city-0`

**Umar al-Karimi**, the necromancer-overseer (late fifties) · city, Burjmandi  
Temperament: incorruptible · Flaw: ruthless · Manner: cynical · Disposition: dismissive  
Impression: More interested in the dead than the living.  
How they deal: Gives the rate and turns away.  
Wants (now): Win over one of Zubaida al-Andalusi's friends.  
Wants (life): Make the undead labor too sound for any creditor to threaten.  
Hook: An old colleague has sent a message asking for a meeting. The colleague was declared dead six years ago.  
**Secret: Has never slept two years in one place, and the itch has started again** · Stakes: They have made promises here

#### natures · `tooHonest`
BORN · seed `r2s-insurgency-metropolis-0`

**Hicham ibn Umar**, the luxury merchant (mid-thirties) · metropolis, Medinapara  
Temperament: — · Flaw: cruel · Manner: reserved · Disposition: welcoming  
Impression: Quick to smile, quick to calculate. Both things are happening simultaneously.  
How they deal: Pleasant until crossed; then the warmth goes at once and does not come back.  
Wants (now): Win over one of Nasir al-Hakim's friends.  
Wants (life): Grow the work at the luxury goods quarter until no one nearby can match it.  
Hook: Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.  
**Secret: Has never taken a coin that was not theirs, and is quietly ashamed of how poor it has kept them** · Stakes: Someone has offered them a great deal to change

#### natures · `deathWatch` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Knows, to the day, when each person they meet will die, and has never been wrong** · Stakes: They have met everyone here

#### natures · `paintsOneFace`
BORN · seed `r2r-city-37`

**Star Ucan**, the blade captain (late thirties) · city, Tikalac  
Temperament: protective · Flaw: cold-blooded · Manner: perfectionist · Disposition: cautious  
Impression: Direct. They assess you in the first three seconds and their expression tells you they've reached a provisional conclusion.  
How they deal: Treats every question as a possible threat, and remembers who asked it.  
Wants (now): Find one more way to be paid for work already being done.  
Wants (life): See the hired blades out of debt for good, with money set aside for bad years.  
Hook: Someone under their command has been selling duty rosters to people who want to know when the roads are empty.  
**Secret: Paints the same face over and over on anything that will take paint, and does not know whose it is** · Stakes: Someone here does

#### natures · `stammer`
BORN · seed `r2r-city-6`

**Donal O'Brien**, the senior charter master (mid-fifties) · city, Llancross  
Temperament: loyal · Flaw: corrupt · Manner: inscrutable · Disposition: welcoming  
Impression: A retired adventurer, loud and friendly, with stories ready for anyone who will listen.  
How they deal: Generous with advice about the work and the dangers; slower to hand out the best jobs.  
Wants (now): Cut the spending at the adventurers' guilds by a tenth this season, and keep the work going.  
Wants (life): Never have to count coins again.  
Hook: They have seen the same unmarked cart pass their door three nights running, and have not wondered why.  
**Secret: Stammers with everyone but one person, and has never worked out why** · Stakes: That person is leaving

#### ties · `brothersWife` (the owner's)
BORN · seed `r2s-indebted-city-0`

**Jaguar Chi**, the master tanner (seventies) · city, Cobaac  
Temperament: — · Flaw: arrogant · Manner: reserved · Disposition: cautious  
Impression: Watchful of who comes near the pits. Asks your business before you have finished asking theirs.  
How they deal: Polite enough; says nothing about where the hides come from.  
Wants (now): Be the one others look to when something goes wrong.  
Wants (life): Make Noh Ek Ixim admit, in public, that they were wrong.  
Hook: Someone keeps paying off their small debts around the place before they can, and has left no name.  
**Secret: Is in love with their brother's wife, and has never said so** · Stakes: A word of it would break the family

#### ties · `bastard` (the owner's)
PLANTED · seed `r2s-famine-city-0`

**Ukon Ito**, the senior guild master (late fifties) · city, Weizhen  
Temperament: — · Flaw: vindictive · Manner: stoic · Disposition: welcoming  
Impression: Quick to smile, quick to calculate. Both things are happening simultaneously.  
How they deal: Pleasant until crossed; then the warmth goes at once and does not come back.  
Wants (now): Stop The Guard from taking anything more from Royal Authority this season.  
Wants (life): Take Li Ma's place in Royal Authority, and keep it longer than Li Ma did.  
Hook: They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.  
**Secret: Is the unacknowledged child of a former lord of this place, and can prove it** · Stakes: The ruling house would rather the proof did not exist

#### ties · `harem` (the owner's)
BORN · seed `r2r-city-48`

**Om Seth**, the master furrier (late fifties) · city, Vishnumala  
Temperament: scholarly · Flaw: ruthless · Manner: fatalistic · Disposition: welcoming  
Impression: Smooth and flattering. Drapes a fur over your shoulders before you can say no.  
How they deal: Talks about the hunters, the trade routes and who has been buying furs this season.  
Wants (now): Stand by Anjali Banerjee in their next quarrel, whoever it is with.  
Wants (life): Leave more money at the furrier's district than there was when they took charge.  
Hook: Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.  
**Secret: Belongs to a harem kept out of sight, and has been told to find it one more** · Stakes: The one they have chosen has not been asked yet

#### ties · `ghost` (the owner's) [magic only]
BORN · seed `r2r-village-14`

**Pall Haraldsson**, the dairy farmer (seventies) · village, Skaldaker  
Temperament: gracious · Flaw: vengeful · Manner: opportunistic · Disposition: welcoming  
Impression: Red-cheeked and cheerful, smelling of the byre, with a jug of milk ready.  
How they deal: Offers a cup and talk of the weather and the price of milk.  
Wants (now): Keep the accounts of the dairy balanced, and show them to anyone who asks.  
Wants (life): Settle things with Helga Svensson for good, one way or another.  
Hook: Their son has been seen at night with people who do not work, and comes home with coin.  
**Secret: Their closest friend is a ghost, and they talk every night** · Stakes: Those who overhear think they talk to themselves; one of them has started to listen

#### ties · `godBlood` (the owner's) [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is descended from a god, and has started to dream of what it wants** · Stakes: Believers would either worship them or bury them

#### ties · `dragonBlood` (the owner's) [magic only]
BORN · seed `r2r-thorp-53`

**Walburga Fischer**, Household Elder (late forties) · thorp, Grünfurt  
Temperament: incorruptible · Flaw: — · Manner: stoic · Disposition: cautious  
Impression: Watches strangers on the shore closely. Says little until they know what you want.  
How they deal: Answers about the fishing; asks why you have come to the landing.  
Wants (now): Tell the truth about something that others keep quiet about.  
Wants (life): See the fishing community out of debt for good, with money set aside for bad years.  
Hook: A family they look after has stopped answering the door, and the shutters have stayed closed for a week.  
**Secret: Carries a dragon's blood, and it has begun to show** · Stakes: There are people who pay well for word of such blood

#### ties · `lastHeir`
BORN · seed `r2r-metropolis-52`

**Notburga Ihle**, the master furrier (early sixties) · metropolis, Steinsee  
Temperament: brave · Flaw: — · Manner: calculating · Disposition: transactional  
Impression: Wrapped in a fine fur and runs a hand over any pelt in reach. Knows the price of everything you wear.  
How they deal: Sells by the pelt and the coat; the finest furs go to buyers with letters of credit.  
Wants (now): Tell the truth about something that others keep quiet about.  
Wants (life): Leave the furrier's district protected by law, so whoever runs the house next need not fight for the same rights.  
Hook: Someone is buying up their debts. Quietly. They don't know who, or why, or when they plan to call them in.  
**Secret: Is the last living heir of a house everyone believes ended, and has told no one** · Stakes: The ones who ended it would finish the work

#### ties · `twoMarriages`
BORN · seed `r2s-wartime-city-0`

**Ishaq al-Rumi**, the outfitter (early twenties) · city, Wadiabad  
Temperament: — · Flaw: — · Manner: brooding · Disposition: transactional  
Impression: Quick and practical. Sizes up your gear and your purse in one look.  
How they deal: Sells everything a delver needs and buys back what comes up; the prices go both ways.  
Wants (now): Show Intisar al-Fasi how far they have both come since the lessons ended.  
Wants (life): Leave more money at the dungeon delving supply district than there was when they took charge.  
Hook: Their scales were tested and found heavy in their favour, and they swear someone changed them overnight.  
**Secret: Is married in two places, and each household believes it is the only one** · Stakes: The two places trade with each other

#### ties · `foundling`
BORN · seed `r2r-city-26`

**Olena Osipov**, the tailor (late forties) · city, Miropol  
Temperament: — · Flaw: vindictive · Manner: melancholic · Disposition: welcoming  
Impression: Measuring tape around the neck, pins between the lips, and a quick flattering look at your coat.  
How they deal: Compliments, measures, suggests; it is easy to order more than you came for.  
Wants (now): Grow the work at the tailor's guild by one more pair of hands, then another.  
Wants (life): Build up enough savings at the tailor's guild to ride out two bad years.  
Hook: A traveller passed through asking which nights their door is left unbarred, and was gone by morning.  
**Secret: Is raising as their own a child left on the step, and the child's true kin have started to ask** · Stakes: The kin are not people who ask twice

#### ties · `changeling` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is not the child their parents bore, and has known it since they could speak** · Stakes: The ones who made the exchange keep accounts

#### ties · `twin`
BORN · seed `r2r-metropolis-51`

**Ostap Orlov**, the wharfinger (late twenties) · metropolis, Divoko  
Temperament: diplomatic · Flaw: reckless · Manner: iconoclast · Disposition: welcoming  
Impression: Cheerful and noisy, with news of every ship that has come and gone.  
How they deal: Talks about the ships, the weather and the cargoes; a good ear at the berths.  
Wants (now): Find a patron among those who lead The Guild Alliance, and make themselves useful to them.  
Wants (life): Secure rights for the docks that will outlast whoever governs now.  
Hook: They've been offered money to not ask questions about something they hadn't even started asking about.  
**Secret: Has a twin no one here knows of, who has already been mistaken for them once** · Stakes: The twin is not a careful person

#### ties · `parentOf`
BORN · seed `r2s-under_siege-metropolis-3`

**Tyche Tarchaneiotes**, the pit boss (late fifties) · metropolis, Andronrion  
Temperament: — · Flaw: reckless · Manner: nostalgic · Disposition: transactional  
Impression: Loud and friendly with a purse in every hand. Talks in odds.  
How they deal: Takes bets, sells places by the pit and will match a fighter for a fee.  
Wants (now): Pay every hand at the fighting pits in full and on time this season.  
Wants (life): Earn a place among the leaders of Thieves' Guild without buying it or marrying into it.  
Hook: A valuable item came through their network recently. Three different parties have asked about it quietly.  
**Secret: Is the true parent of Hypatia Laskaris, and Hypatia Laskaris does not know** · Stakes: One other person knows, and has been patient so far

#### ties · `lovesNamed`
BORN · seed `r2r-city-29`

**Sita Goswami**, the mine captain (late forties) · city, Kamalapalli  
Temperament: clever · Flaw: dismissive · Manner: calculating · Disposition: dismissive  
Impression: Busy and short. The shift change is coming and there is no time for visitors.  
How they deal: Gives a word or two and turns back to the shaft.  
Wants (now): Find the mine one more source of money.  
Wants (life): Be counted one day among those who lead Merchant Guilds.  
Hook: A supplier is providing goods of uncertain provenance. The price is too good to ask questions. People have started asking questions.  
**Secret: Is in love with Lakshmana Banerjee, and would sooner die than have it known** · Stakes: Lakshmana Banerjee has started to notice

#### ties · `swornOrder`
BORN · seed `r2r-metropolis-30`

**Styrkar Svensson**, the master weaver (early thirties) · metropolis, Ulfoy  
Temperament: — · Flaw: envious · Manner: iconoclast · Disposition: cautious  
Impression: Sharp-eyed and particular. Runs a thumb along any cloth that passes, including yours.  
How they deal: Answers questions about the trade; questions about the workshop's hands are turned aside.  
Wants (now): Gain ground for Craft Guilds at the expense of Merchant Guilds before the season is out.  
Wants (life): Be given the secrets of Craft Guilds to keep, as well as its errands to run.  
Hook: Their apprentice has been talking to a rival, and came back with an offer to buy them out.  
**Secret: Is sworn to an order that has no name here, and is still waiting for its word** · Stakes: The word, when it comes, will not be a small thing

#### ties · `highBirth`
BORN · seed `r2s-plague_onset-town-0`

**Majid al-Masri**, the carriers' master (early sixties) · town, Ainkarez  
Temperament: — · Flaw: — · Manner: idealistic · Disposition: welcoming  
Impression: Friendly and gossipy, with news of every road the carriers have walked.  
How they deal: Talks about the roads and who has been sending what.  
Wants (now): Stand by Zayd ibn Khaldun in their next quarrel, whoever it is with.  
Wants (life): Make the carriers' guild so needed by those who govern that no one dares touch the rights of the house.  
Hook: They sold a batch they knew was bad, and the customer it sickened is now asking who supplied it.  
**Secret: Is of far higher birth than they let on, and left it behind on purpose** · Stakes: The family has not stopped looking

#### ties · `exile`
BORN · seed `r2r-city-30`

**Vitali Tarasov**, the senior abbot (mid-thirties) · city, Lyssono  
Temperament: clever · Flaw: cold-blooded · Manner: secretive · Disposition: welcoming  
Impression: Interested in you as a person, or at least in what you might need. The attention feels real.  
How they deal: Pleasant until crossed; then the warmth goes at once and does not come back.  
Wants (now): Get the better side of every bargain struck this season.  
Wants (life): Leave Merchant Guilds holding nothing that Religious Authorities could not take away.  
Hook: They know which of the current leadership will be the next to fall from grace. They are waiting.  
**Secret: Was cast out by their own people for a thing they will not name** · Stakes: Anyone from there would be bound to act on sight

#### ties · `widowOf`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is the widow or widower of someone this place put to death, and has never said so** · Stakes: They have not forgiven it

#### ties · `fey` [magic only]
BORN · seed `r2r-town-18`

**Shashi Bhatt**, the cobbler (early twenties) · town, Vedakota  
Temperament: intuitive · Flaw: suspicious · Manner: secretive · Disposition: welcoming  
Impression: Sits low at the bench, cheerful, with tacks held in the mouth while they talk.  
How they deal: Talks about the road by the state of your boots; a fair price for a quick mend.  
Wants (now): Gather proof of what passes between Corrupt Council and Thieves' Guild, and keep it somewhere safe.  
Wants (life): Earn a place among the leaders of Corrupt Council without buying it or marrying into it.  
Hook: Someone keeps paying off their small debts around the place before they can, and has left no name.  
**Secret: Owes a year of service to something in the woods, and the year has not yet been called in** · Stakes: It will be called in without warning

#### ties · `moonChanged` [magic only]
BORN · seed `r2r-city-57`

**Frantisek Novikov**, the house boss (mid-fifties) · city, Celosk  
Temperament: — · Flaw: — · Manner: mercurial · Disposition: transactional  
Impression: Friendly in the way of someone always counting. Your purse is noted before your face.  
How they deal: Extends credit to anyone who looks good for it, and remembers every coin owed.  
Wants (now): Win the gambling halls first call on any help those who govern can give this season.  
Wants (life): Double the work at the gambling halls, and find the hands to do it.  
Hook: They're protecting someone from something worse. The someone doesn't know and wouldn't thank them.  
**Secret: Is not themselves when the moon is full, and locks the door from the inside** · Stakes: The lock is getting old

#### ties · `feyReplaced` (the owner's) [magic only]
BORN · seed `r2r-metropolis-5`

**Aristoteles Dalassenos**, the dyer (seventies) · metropolis, Filopambelos  
Temperament: — · Flaw: — · Manner: detached · Disposition: welcoming  
Impression: Cheerful in the stink of the vats. Proud of a good colour.  
How they deal: Shows off the best cloth and explains how the colours are made.  
Wants (now): Answer the next move by Merchant Guilds against Craft Guilds, quickly and in public.  
Wants (life): Settle things with Christodoulaki Palaiologos for good, one way or another.  
Hook: A traveller passed through asking which nights their door is left unbarred, and was gone by morning.  
**Secret: Is not the person everyone remembers: a fey thing ate that one and has worn the face ever since** · Stakes: It has the memories, but not all of them, and someone has begun to test it

#### ties · `firstWord` (the owner's)
BORN · seed `r2r-town-12`

**Shahd al-Kindi**, the nominal owner (mid-thirties) · town, Qasrtappa  
Temperament: good-humoured · Flaw: wrathful · Manner: proud · Disposition: transactional  
Impression: Polite and a little too careful with the till. Watches who comes in after you.  
How they deal: Sells what is on the shelves; questions about anything else get a shrug.  
Wants (now): Learn the secret of someone they envy.  
Wants (life): Stay at the head of Thieves' Guild until they choose who comes after them.  
Hook: A debt they called in was paid by someone they have never met, and that person now wants to meet.  
**Secret: Will fall in love, at once and completely, with the first newcomer who speaks to them** · Stakes: They will not hide it well, and it will not pass

#### ties · `lostChild`
BORN · seed `r2r-metropolis-2`

**Hong Moon**, the mint master (late fifties) · metropolis, Xidao  
Temperament: — · Flaw: imperious · Manner: zealous · Disposition: transactional  
Impression: Precise and formal, with a scale on the desk and a weight for every coin.  
How they deal: Will change coin and test metal at the posted rate; asks who you are first.  
Wants (now): Stand by Jiangli Han in their next quarrel, whoever it is with.  
Wants (life): Rise in High Theocratic Council far enough that their word carries weight outside it.  
Hook: A clerk in their office has been copying letters at night, and the copies have turned up in a rival's hands.  
**Secret: Gave up a child at birth, and has watched for its face in every stranger since** · Stakes: A stranger with that face would be of an age to ask questions now

#### ties · `oldLove`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Has loved the same person for forty years and never once said so** · Stakes: That person is ailing

#### ties · `deadTitle`
BORN · seed `r2r-hamlet-48`

**Sharif al-Basri**, the stable keeper (late forties) · hamlet, Markazmela  
Temperament: equitable · Flaw: — · Manner: zealous · Disposition: welcoming  
Impression: Straw on the boots and a horse's nose over each shoulder. Glad of anyone who likes animals.  
How they deal: Talks about the horses in the yard and the roads their riders came by.  
Wants (now): Learn what Saqr al-Basri has been saying about them, and to whom.  
Wants (life): Carry the name of the stable yard beyond this place, so people come from far off for the work done there.  
Hook: A young trader has been undercutting them in ways that shouldn't be possible on their claimed capital.  
**Secret: Is heir to a title that no longer has any land under it, and keeps the seal in a sock** · Stakes: Someone is buying up dead titles

#### ties · `wolves`
BORN · seed `r2r-city-27`

**Jalayir Seljuk**, the fuller (mid-sixties) · city, Qaraiin  
Temperament: perceptive · Flaw: — · Manner: detached · Disposition: dismissive  
Impression: Smells of the fulling vats and seems to know it. Keeps the talk short.  
How they deal: Takes the cloth, names a day and a price, and goes back to work.  
Wants (now): Learn who really runs the tailor's guild, and what it would take to replace them.  
Wants (life): Reach the head of Royal Authority and run it the way Bilgüün Khwarezm never would.  
Hook: A customer paid them with a ring that someone else has reported stolen.  
**Secret: Was raised by wolves until the age of seven, and has told everyone it was an aunt** · Stakes: They still answer to a howl

#### ties · `penFriend`
BORN · seed `r2r-metropolis-33`

**Uljana Borisov**, the librarian (mid-forties) · metropolis, Hvaliya  
Temperament: loyal · Flaw: lazy · Manner: perfectionist · Disposition: dismissive  
Impression: Impatient with anyone who treats the library as a place to sit and talk.  
How they deal: Points to the rules and the door.  
Wants (now): Collect what is owed to the great library before the season is out.  
Wants (life): Reach the top of Religious Authorities by the long road, one earned favour at a time.  
Hook: Something they were told had been burned has turned up for sale.  
**Secret: Has written for years to someone in a far city they have never met, and is in love with the handwriting** · Stakes: The letters have stopped

#### ties · `owesLife`
BORN · seed `r2s-occupied-metropolis-1`

**Theofanis Voulgaropoulos**, the master smith (early fifties) · metropolis, Dionpetra  
Temperament: — · Flaw: — · Manner: secretive · Disposition: dismissive  
Impression: Treats anyone who is not buying as noise. The hammer keeps time while you speak.  
How they deal: Answers in a word or two unless the talk turns to metal, and then cannot be stopped.  
Wants (now): Ration what is left at the blacksmiths so the work lasts until new supply arrives.  
Wants (life): Live a quiet life, out of other people's quarrels.  
Hook: An old ruling of theirs is being used to take a widow's house, and they cannot undo it without admitting the mistake.  
**Secret: Owes their life to Panteleimon Laskaris, and has never found a way to say it** · Stakes: Panteleimon Laskaris has asked them for something they ought to refuse

#### ties · `guardian`
BORN · seed `r2r-city-56`

**Balduin Brandt**, the vintner (late thirties) · city, Spitzgate  
Temperament: brave · Flaw: cold-blooded · Manner: iconoclast · Disposition: transactional  
Impression: Smooth and polite, with a merchant's knack for knowing what you can afford.  
How they deal: Sells by the cask and the bottle; the better years cost much more.  
Wants (now): Get the better side of every bargain struck this season.  
Wants (life): Become someone Merchant Guild Council cannot do without.  
Hook: Their scales were tested and found heavy in their favour, and they swear someone changed them overnight.  
**Secret: Was asked by a dying friend to watch over Regina Maier, and has done it for years without a word** · Stakes: Regina Maier thinks they are being followed

#### ties · `promised`
PLANTED · seed `r2r-city-0`

**Varvara Vorobev**, Lord Burgomaster (late twenties) · city, Goraka  
Temperament: loyal · Flaw: wrathful · Manner: obsessive · Disposition: cautious  
Impression: Cautious with newcomers, because the work requires it; it is nothing personal.  
How they deal: Treats every question as a possible threat, and remembers who asked it.  
Wants (now): Make sure Konstantin Alexeyev keeps paying, even if late.  
Wants (life): Lead Merchant City Council so long and so well that no one, Liliya Gusev included, thinks of replacing them.  
Hook: A family they put out of business has opened again under a new name, two doors down.  
**Secret: Was promised in marriage as a child to someone they have never met, and the day is coming** · Stakes: The other family keeps its promises

#### ties · `ghostChild` [magic only]
PLANTED · seed `r2r-town-0`

**Laevinus Scipio**, the mayor (mid-thirties) · town, Farosaltus  
Temperament: — · Flaw: overbearing · Manner: melancholic · Disposition: cautious  
Impression: Tired. Not rudely, but visibly. This is a person who has been doing a hard job for a long time.  
How they deal: Keeps you at a distance, and makes you prove you are worth their time.  
Wants (now): Make sure no one can trace the arrangement between Corrupt Council and Thieves' Guild back to them.  
Wants (life): Keep Lepidus Serranus loyal for life, and make loyalty pay better than ambition.  
Hook: A sealed letter arrived for them three weeks ago. They haven't opened it. They won't say why.  
**Secret: Is followed by the ghost of a child who is not theirs, and has started leaving out milk** · Stakes: The child has begun to bring things

#### ties · `familiar` [magic only]
BORN · seed `r2r-town-47`

**Laxman Kapoor**, the magistrate (early sixties) · town, Mahapeth  
Temperament: methodical · Flaw: — · Manner: reserved · Disposition: transactional  
Impression: Efficient, slightly distracted: someone with too many things in their head and a practised way of not showing it.  
How they deal: Wants every term settled before anything changes hands, and writes it down.  
Wants (now): Put their own work in order, down to the last detail.  
Wants (life): Hand on the courthouse with full stores, honest accounts and nothing owed.  
Hook: Someone has been leaving anonymous notes in their office pointing to a colleague's corruption. The notes are accurate.  
**Secret: Keeps a small creature in the roof that is not an animal, and feeds it secrets** · Stakes: It has been asking for bigger ones

#### ties · `seventhChild` [magic only]
BORN · seed `r2r-town-22`

**Jalayir Önggirad**, the potter (early twenties) · town, Altaiköl  
Temperament: — · Flaw: — · Manner: reserved · Disposition: transactional  
Impression: Practical and unhurried. Shelves of pots behind them, every price chalked on the board.  
How they deal: Sells what is on the shelves at the chalked price; orders take a firing to fill.  
Wants (now): Cut the spending at the potter's workshop by a tenth this season, and keep the work going.  
Wants (life): Grow old in peace, with their secrets still their own.  
Hook: Their son has been seen at night with people who do not work, and comes home with coin.  
**Secret: Is a seventh child of a seventh child, and things they say in anger come true** · Stakes: They are very careful, and very tired

#### ties · `shortLived`
BORN · seed `r2r-village-46`

**Fergus Hayes**, the beekeeper (early forties) · village, Glenheath  
Temperament: gracious · Flaw: paranoid · Manner: iconoclast · Disposition: welcoming  
Impression: Calm and slow-moving, with a veil pushed back and a jar of honey offered.  
How they deal: Talks about the bees and the flowers; gives a taste of honey.  
Wants (now): Keep Isolde O'Neill from calling in what is owed this season.  
Wants (life): Lead Feudal Stewardship one day, with Rónán Murphy's blessing or without it.  
Hook: Someone has been asking the neighbours what time they leave in the morning and when they come home.  
**Secret: Comes of a family in which no one has ever grown old, and has begun to put things in order** · Stakes: They have not told the ones who will be left

#### ties · `oathAgainst`
BORN · seed `r2r-metropolis-41`

**Anton Grbić**, the sage (late forties) · metropolis, Hvaliko  
Temperament: charismatic · Flaw: manipulative · Manner: secretive · Disposition: cautious  
Impression: Reserved. Not hostile, just private.  
How they deal: Gives careful answers that are true as far as they go, and they never go far.  
Wants (now): Stand by Lukas Loginov in their next quarrel, whoever it is with.  
Wants (life): Rise in Arcane Orders far enough that their word carries weight outside it.  
Hook: They have seen the same unmarked cart pass their door three nights running, and have not wondered why.  
**Secret: Belongs to a family sworn, generations back, to end the line of Timofei Đorđević, and is the last who remembers the oath** · Stakes: They like Timofei Đorđević

#### ties · `runaway`
BORN · seed `r2r-city-43`

**Rong Suzuki**, the brewer (late thirties) · city, Lincheng  
Temperament: — · Flaw: corrupt · Manner: proud · Disposition: transactional  
Impression: Practical, with the red hands of someone who works hot vats all day.  
How they deal: Sells by the barrel to taverns and by the jug to anyone; talks prices plainly.  
Wants (now): Put away more coin this season than last.  
Wants (life): Settle things with Xin Sasaki for good, one way or another.  
Hook: Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it.  
**Secret: Ran from a marriage on the morning of it, three towns away, and the other family still pays people to look** · Stakes: One of those people has reached this road

#### ties · `inheritance`
BORN · seed `r2r-metropolis-9`

**Vishnu Sahni**, the prison warden (late sixties) · metropolis, Satyagarh  
Temperament: good-humoured · Flaw: manipulative · Manner: cautious · Disposition: transactional  
Impression: Polite, tired and reasonable, as long as there is something to be gained.  
How they deal: Visits can be arranged, and so can a better cell, for a price.  
Wants (now): Find a patron among those who lead Ducal Governorship, and make themselves useful to them.  
Wants (life): Protect Pradeep Mukhopadhyay from anyone who would bring them down.  
Hook: They've been meeting privately with someone from outside the settlement whose identity they won't disclose.  
**Secret: Will inherit a fortune the day a certain old woman dies, and has started visiting her with soup** · Stakes: The old woman is no fool

#### ties · `hiddenSpouse`
BORN · seed `r2r-metropolis-19`

**Razan al-Waqqas**, the auctioneer (late sixties) · metropolis, Mintaroasis  
Temperament: warm-hearted · Flaw: overbearing · Manner: eccentric · Disposition: transactional  
Impression: Sharp and fast. Remembers what every buyer paid and what they can afford.  
How they deal: Takes goods for sale at a fee and a share; payment is in coin, on the day.  
Wants (now): Bring Grand Merchant Oligarchy a piece of news before anyone else does.  
Wants (life): Be obeyed without ever having to raise their voice.  
Hook: They have evidence of price-fixing across the whole market. Publishing it helps their competition as much as their customers.  
**Secret: Is secretly married to Selma al-Malik, and neither has found the right day to say so** · Stakes: A third person has started courting one of them

#### ties · `ward`
BORN · seed `r2r-city-24`

**Alexios Alexios**, the garrison commander (mid-forties) · city, Kalliousa  
Temperament: candid · Flaw: stubborn · Manner: superstitious · Disposition: welcoming  
Impression: Relaxed and sure of themselves, and not careless with it.  
How they deal: Promises help easily, and is hard to find when the time comes to give it.  
Wants (now): Watch who goes in and out of the front businesses, and write it all down.  
Wants (life): Repay Simeon Komnenos in full, and owe nobody anything again.  
Hook: They are carrying out orders they believe are wrong. They have not yet decided at what point they stop carrying them out.  
**Secret: Is the secret ward of someone powerful far away, who pays for everything and has never once visited** · Stakes: A visit has been announced

#### ties · `debtOfHonour`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Carries a debt of honour to a family they have never met, laid on them by a dying parent** · Stakes: That family has fallen on hard times, and does not know to ask

#### ties · `nameless`
BORN · seed `r2r-metropolis-47`

**Chagatai Merv**, the prison warden (mid-thirties) · metropolis, Tumeniin  
Temperament: — · Flaw: vengeful · Manner: proud · Disposition: cautious  
Impression: Heavy keys at the belt and a flat, patient look. Has heard every lie a prisoner can tell.  
How they deal: Answers questions about the cells in as few words as possible; asks who you want to see and why.  
Wants (now): Bring Grand Merchant Oligarchy a piece of news before anyone else does.  
Wants (life): Hand on the prison with full stores, honest accounts and nothing owed.  
Hook: Their sister has been taking gifts from people who need their signature, and they found out from the person who paid most.  
**Secret: Does not know their true name or where they were born: they were found on the road with a purse and a knife** · Stakes: The knife has a maker's mark that someone here knows

#### ties · `selkie` [magic only]
BORN · seed `r2s-religious_conversion-city-2`

**Titus Aurelius**, the company captain (mid-thirties) · city, Ventomunicipium  
Temperament: humble · Flaw: cold-blooded · Manner: detached · Disposition: cautious  
Impression: Alert. Not hostile, but attentive in a way that doesn't quite switch off.  
How they deal: Treats every question as a possible threat, and remembers who asked it.  
Wants (now): Find one more way to be paid for work already being done.  
Wants (life): Free the mercenary quarter from depending on a single source of iron and grain.  
Hook: Three guards have gone missing in the same district on night patrol. The report filed says they deserted.  
**Secret: Has a sealskin hidden in the rafters, and a spouse who must never find it** · Stakes: The roof needs mending

#### ties · `grandmother` [magic only]
BORN · seed `r2r-metropolis-18`

**Inga Helgason**, the potter (late forties) · metropolis, Víkthorpe  
Temperament: — · Flaw: wrathful · Manner: cynical · Disposition: transactional  
Impression: Practical and unhurried. Shelves of pots behind them, every price chalked on the board.  
How they deal: Sells what is on the shelves at the chalked price; orders take a firing to fill.  
Wants (now): Take one piece of business from Thieves' Guild and bring it to High Theocratic Council.  
Wants (life): Have the rights of the potter's workshop set down so firmly that the next ruler must keep them too.  
Hook: They found a name scratched into their door overnight, and it belongs to someone who died last winter.  
**Secret: Had a grandmother who was not a woman, and it has begun to show in the teeth** · Stakes: Someone has started counting them

#### masters · `masterSmith` (the owner's)
BORN · seed `r2r-hamlet-36`

**Dina al-Amin**, the smith (mid-forties) · hamlet, Nahrmandi  
Temperament: fair-minded · Flaw: — · Manner: eccentric · Disposition: transactional  
Impression: Practical and short. Names a price and a day.  
How they deal: Mends anything iron; new work takes a few days and coin up front.  
Wants (now): Get the rights of the resident smith's forge written down and sealed by those who govern, this season.  
Wants (life): Grow the work at the resident smith's forge until no one nearby can match it.  
Hook: Someone has been taking eggs and bread from doorsteps, a little at a time, and nobody has caught them.  
**Secret: Is a master armourer in hiding, and shoes horses here so that no one asks** · Stakes: Anyone who has seen their old work would know the hand at once

#### masters · `masterHealer`
PLANTED · seed `r2s-insurgency-village-2`

**Bing Zhang**, the healer (mid-sixties) · village, Xiji  
Temperament: brave · Flaw: imperious · Manner: obsessive · Disposition: transactional  
Impression: Ordinary in a way that is itself a kind of presence.  
How they deal: Deals with you as a favour, and lets you know the terms are theirs to set.  
Wants (now): Answer the next move by Elder Council against Religious Authorities, quickly and in public.  
Wants (life): Be the person everyone here defers to.  
Hook: Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious.  
**Secret: Was physician to a great house, and treats sprains and fevers here so that no one asks** · Stakes: They left after a death that was never explained, and someone is still looking

#### masters · `masterCook`
PLANTED · seed `r2r-village-0`

**Dag Magnusson**, the waystation keeper (early fifties) · village, Lundborg  
Temperament: resourceful · Flaw: manipulative · Manner: melancholic · Disposition: cautious  
Impression: Watches every traveller and remembers where they came from.  
How they deal: Asks where you are going and when.  
Wants (now): Find out what the underground network would do if the work at the waystation stopped serving them.  
Wants (life): Win the waystation a voice whenever those who govern decide something that touches the work.  
Hook: A purse they found and kept has a rightful owner, and that owner has started asking around.  
**Secret: Once cooked for a great house's table, and conceals how good they are** · Stakes: One feast would give them away

#### masters · `masterBuilder`
PLANTED · seed `r2s-infiltrated-village-0`

**Kasim al-Hassan**, the thatcher (mid-fifties) · village, Khirbetserai  
Temperament: — · Flaw: overbearing · Manner: obsessive · Disposition: welcoming  
Impression: Sunburned and easy, with straw in the hair and a ladder on one shoulder.  
How they deal: Talks about the weather and the roofs; knows every house nearby from above.  
Wants (now): Bring Hakim ibn Ahmed together with someone who can help them.  
Wants (life): Become someone Elder Council cannot do without.  
Hook: Someone keeps paying off their small debts around the place before they can, and has left no name.  
**Secret: Built siege works for an army, and mends carts and roofs here so that no one asks** · Stakes: The army that lost to those works has not forgotten the builder

#### masters · `masterBlade`
PLANTED · seed `r2s-indebted-hamlet-0`

**Sorghaghtani Taichiud**, the militia captain (mid-sixties) · hamlet, Gantulgabulag  
Temperament: warm-hearted · Flaw: reckless · Manner: contrarian · Disposition: cautious  
Impression: Alert. Not hostile, but attentive in a way that doesn't quite switch off.  
How they deal: Keeps out of trouble by keeping away from you, and sends you to someone else when they can.  
Wants (now): Keep the accounts of the citizen militia balanced, and show them to anyone who asks.  
Wants (life): Outlast Gereltsetseg Kiyad in Free Elder Council, and be ready when the place falls empty.  
Hook: Tracks they were told to ignore lead from the edge of the fields to a camp nobody has reported.  
**Secret: Was captain of a great house's guard, and came here so that no one would ask them to fight again** · Stakes: The day the place is threatened, everyone will see what they are

#### masters · `masterTutor`
PLANTED · seed `r2r-village-0#masterTutor` · role set to "the scribe" (no card of the 720 holds it)

**Mord Bjarnarson**, the scribe (early thirties) · village, Lundborg  
Temperament: charismatic · Flaw: wrathful · Manner: pragmatic · Disposition: welcoming  
Impression: Friendly and ordinary, the kind of person you would forget an hour later.  
How they deal: Chats easily and learns far more than you meant to tell.  
Wants (now): Learn what Kráka Finsson has been saying about them, and to whom.  
Wants (life): Outlast every person who ever crossed them.  
Hook: Someone has been using their name to frighten shopkeepers, and the shopkeepers have begun paying the wrong people.  
**Secret: Was tutor to a noble heir, and keeps tallies here so that no one asks** · Stakes: The heir, grown, would know them at a glance

#### masters · `masterTailor`
PLANTED · seed `r2s-religious_conversion-village-0`

**Adela Zimmermann**, the tailor (early fifties) · village, Steinfeld  
Temperament: plain-dealing · Flaw: — · Manner: superstitious · Disposition: welcoming  
Impression: Measuring tape around the neck, pins between the lips, and a quick flattering look at your coat.  
How they deal: Compliments, measures, suggests; it is easy to order more than you came for.  
Wants (now): Do one thing for Elected Reeve this season that the people who lead it cannot ignore.  
Wants (life): Protect the people in their care for as long as they are able.  
Hook: Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious.  
**Secret: Once dressed a great court, and mends workaday clothes here so that no one asks** · Stakes: A single fine stitch would start the questions

#### masters · `masterTrader`
PLANTED · seed `r2s-religious_conversion-hamlet-0`

**Terentia Cicero**, the pawnbroker (early thirties) · hamlet, Capovetum  
Temperament: brave · Flaw: self-serving · Manner: brooding · Disposition: dismissive  
Impression: Bored by anything that is not worth much.  
How they deal: Waves away small things; the good pieces get their full attention.  
Wants (now): Remind Xenia Flavius, quietly, of what is owed.  
Wants (life): Gather enough wealth to pass on, and leave the family rich after them.  
Hook: They have promised the same order to two buyers, and both are due to collect on the same morning.  
**Secret: Once ran a trading house in a great city, and walked away from it** · Stakes: The partners they left behind are still owed an answer

#### masters · `masterSoldier`
PLANTED · seed `r2s-politically_fractured-hamlet-0`

**Kamil Lebedev**, the dairy farmer (early forties) · hamlet, Zelenoichi  
Temperament: — · Flaw: corrupt · Manner: superstitious · Disposition: cautious  
Impression: Watchful of strangers near the herd.  
How they deal: Polite enough; keeps you away from the byre.  
Wants (now): Do one thing for Headman's Authority this season that the people who lead it cannot ignore.  
Wants (life): Gather enough wealth to pass on, and leave the family rich after them.  
Hook: The family that has always mended the common track says it is theirs to close, and has closed it.  
**Secret: Once led an army in a war people still talk about, and works the land here so that no one asks** · Stakes: Some who followed them, and some who fought them, are still alive

#### masters · `masterWizard` [magic only]
BORN · seed `r2r-thorp-4`

**Devota Koch**, the reeve (mid-sixties) · thorp, Hochthal  
Temperament: gracious · Flaw: — · Manner: ambitious · Disposition: cautious  
Impression: Plain, careful and watchful, with a tally stick and muddy boots.  
How they deal: Asks your business and who you have come to see.  
Wants (now): Get the lord's reeve's office through the season without borrowing.  
Wants (life): Be loved by the people here for the good they did.  
Hook: A pedlar who comes every spring did not come this year, and the goods everyone ordered were paid for in advance.  
**Secret: Was a court wizard, and has not cast a spell since the day they left** · Stakes: The first spell would be felt by people who are listening for it

#### masters · `masterCaptain`
BORN · seed `r2s-occupied-village-2`

**Gawain Gallagher**, the ferryman (early forties) · village, Caerwood  
Temperament: steadfast · Flaw: — · Manner: opportunistic · Disposition: welcoming  
Impression: Weathered and slow-spoken, with arms like cables and a calm way of handling the boat.  
How they deal: Talks about the river and the people who cross it; knows who comes and goes.  
Wants (now): Get to whatever both Household Council and Merchant Guilds want this season first.  
Wants (life): Never end up in Baothghalach Walsh's shadow.  
Hook: Someone has forged their seal well enough to fool their own staff, and three orders went out under it before anyone noticed.  
**Secret: Was master of a great ship, and works a small boat here so that no one asks** · Stakes: Sailors remember a captain who lost a ship

#### masters · `masterRider`
BORN · seed `r2s-insurgency-village-1`

**Manlia Flavius**, the horse-coper (mid-thirties) · village, Collenovum  
Temperament: diplomatic · Flaw: — · Manner: contrarian · Disposition: welcoming  
Impression: Loud, friendly and full of praise for every horse on the line.  
How they deal: Talks up the horses and offers a ride.  
Wants (now): Put someone who slighted them back in their place.  
Wants (life): Be the first person Elder Council would turn to, before anyone thinks to ask Serranus Capito.  
Hook: They have promised the same order to two buyers, and both are due to collect on the same morning.  
**Secret: Trained a great house's warhorses, and minds plough horses here so that no one asks** · Stakes: Any horse-dealer passing through would know the name

#### masters · `masterPriest`
PLANTED · seed `r2s-monster_pressure-village-0`

**Jatin Chaudhary**, the priest (late thirties) · village, Dharmagiri  
Temperament: — · Flaw: — · Manner: cynical · Disposition: welcoming  
Impression: Interested in you as a person, or at least in what you might need. The attention feels real.  
How they deal: Offers information freely, and asks questions that sound like interest, not prying.  
Wants (now): Get the house of worship through the season without borrowing.  
Wants (life): Lead Religious Authorities so long and so well that no one, Satyajit Dutta included, thinks of replacing them.  
Hook: The holy relic in their keeping is not what everyone believes it is. Only they know this.  
**Secret: Stood high in a great temple, and keeps a small shrine here so that no one asks** · Stakes: The temple does not forgive those who leave

#### masters · `masterSinger`
PLANTED · seed `r2r-village-3`

**Vladislav Dmitriev**, the musician (mid-sixties) · village, Malonitsa  
Temperament: — · Flaw: corrupt · Manner: contrarian · Disposition: cautious  
Impression: Friendly in company and quiet alone. Listens more than they play between songs.  
How they deal: Gives away little about themselves, and remembers what others let slip.  
Wants (now): Warn Olga Ilyin of any trouble before it reaches them.  
Wants (life): Gather enough wealth to pass on, and leave the family rich after them.  
Hook: Someone left an item in their care and hasn't returned. The item is valuable. The absence is now suspicious.  
**Secret: Once sang for courts, and sings for suppers here so that no one asks** · Stakes: There is a song about why they stopped, and someone here knows it

#### masters · `masterCraft`
PLANTED · seed `r2s-infiltrated-village-0`

**Jana al-Amin**, the sawyer (mid-sixties) · village, Khirbetserai  
Temperament: — · Flaw: callous · Manner: proud · Disposition: welcoming  
Impression: Easy and open, smelling of fresh pine. Likes to talk about wood more than most people do.  
How they deal: Tells you which timber is good this year and who has been buying it.  
Wants (now): Ask Zubaida al-Rashidi for advice on one hard decision this season.  
Wants (life): Make the sawmill too sound for any creditor to threaten.  
Hook: They agreed to hold a parcel for a traveller, and two different people have since come to collect it.  
**Secret: Is a master of their craft far beyond this place, and sells plain work here so that no one asks** · Stakes: One fine piece, sold by mistake, would bring buyers and questions

#### masters · `masterRuler`
PLANTED · seed `r2r-thorp-0`

**Cosij Chan**, Elder (mid-fifties) · thorp, Izamitza  
Temperament: — · Flaw: manipulative · Manner: detached · Disposition: welcoming  
Impression: Weathered and steady, with hands like rope and an eye always on the sky.  
How they deal: Talks about the catch, the weather and the boats; quick to offer a meal of fish.  
Wants (now): Collect what is owed to the fishing community before the season is out.  
Wants (life): Leave the family stronger, with Cuauhtli Ahau on the same side.  
Hook: They saw an accident that was no accident, and the person responsible knows they saw it.  
**Secret: Once governed a city, and settles fence disputes here so that no one asks** · Stakes: The city did not let them go willingly

#### masters · `masterThief`
PLANTED · seed `r2r-village-0`

**Mord Bjarnarson**, the network's spider (early thirties) · village, Lundborg  
Temperament: charismatic · Flaw: wrathful · Manner: pragmatic · Disposition: welcoming  
Impression: Friendly and ordinary, the kind of person you would forget an hour later.  
How they deal: Chats easily and learns far more than you meant to tell.  
Wants (now): Learn what Kráka Finsson has been saying about them, and to whom.  
Wants (life): Outlast every person who ever crossed them.  
Hook: Someone has been using their name to frighten shopkeepers, and the shopkeepers have begun paying the wrong people.  
**Secret: Was the best lock-breaker of a great city's guild, and lifts nothing here so that no one asks** · Stakes: The guild believes they are dead, and would correct the error

#### masters · `masterPoisoner`
PLANTED · seed `r2r-village-0`

**Hervor Egilsson**, the apothecary (early fifties) · village, Lundborg  
Temperament: — · Flaw: stubborn · Manner: nostalgic · Disposition: transactional  
Impression: Neat, quick, and used to people who are frightened and in a hurry.  
How they deal: Will mix whatever is asked for at a fair price; the rare things cost more and take a day.  
Wants (now): Win new business for the apothecary's shop beyond the people who already come.  
Wants (life): Outlast Merchant Guilds, and still be standing with Craft Guilds when they are gone.  
Hook: Two neighbours have each asked them to stand witness in the same dispute, on opposite sides.  
**Secret: Was a great house's poisoner, and sells simples here so that no one asks** · Stakes: Three deaths at that house were never explained

#### masters · `masterMiller`
BORN · seed `r2s-under_siege-village-1`

**Killian Kelly**, the miller (late sixties) · village, Neaddale  
Temperament: wise · Flaw: — · Manner: stoic · Disposition: welcoming  
Impression: Broad-shouldered and easy, with the patience of someone who spends the day waiting for the stones to turn.  
How they deal: Talks freely about the harvest and who brought what to the mill; it is a good place to hear who is short this year.  
Wants (now): Make sure Tormod Ryan is not left behind by the changes in the work.  
Wants (life): Keep the settlement intact whatever the cost to themselves  
Hook: Their son has been seen at night with people who do not work, and comes home with coin.  
**Secret: Once ran the mills of a great city, and grinds for a few fields here so that no one asks** · Stakes: The city went hungry the year they left

#### masters · `masterHuntsman`
PLANTED · seed `r2s-succession_void-village-0`

**Saad al-Mawsili**, the wildfowler (early sixties) · village, Wadiistan  
Temperament: magnanimous · Flaw: dismissive · Manner: brooding · Disposition: cautious  
Impression: Mud to the knees and very quiet, with a habit of listening before speaking.  
How they deal: Asks why you are in the marsh.  
Wants (now): Do one thing for Priestly Guidance this season that the people who lead it cannot ignore.  
Wants (life): See Religious Authorities too weak to threaten Priestly Guidance again.  
Hook: They saw an accident that was no accident, and the person responsible knows they saw it.  
**Secret: Was huntsman to a great house, and sets snares here so that no one asks** · Stakes: The house's best hound would still know them

#### masters · `masterShipwright`
PLANTED · seed `r2s-indebted-village-1`

**Symeonissa Gabalas**, the boatwright (early sixties) · village, Olympnea  
Temperament: methodical · Flaw: vain · Manner: reserved · Disposition: transactional  
Impression: Sawdust and tar on the hands, a pencil behind the ear and a boat half-built behind them.  
How they deal: Builds to order and repairs anything that floats; wants half paid before starting.  
Wants (now): Keep the friendship with Vasileios Hyaleas quiet, where it does the most good.  
Wants (life): Rise higher than anyone in the family ever has.  
Hook: They agreed to hold a parcel for a traveller, and two different people have since come to collect it.  
**Secret: Built ships for a great harbour, and patches hulls here so that no one asks** · Stakes: One of those ships is overdue

#### masters · `masterBrewer`
PLANTED · seed `r2r-hamlet-1`

**Alexei Volkov**, the brewster (early forties) · hamlet, Divoino  
Temperament: — · Flaw: callous · Manner: cautious · Disposition: cautious  
Impression: Reserved. Not hostile, just private.  
How they deal: Treats every question as a possible threat, and remembers who asked it.  
Wants (now): Take on more hands at the alehouse, and keep them busy all season.  
Wants (life): Lead Headman's Authority one day, with Dragomir Alexeyev's blessing or without it.  
Hook: An old letter of theirs, written in anger years ago, has been shown to the person it was about.  
**Secret: Brewed for a great house's cellar, and keeps a plain brew here so that no one asks** · Stakes: One cask of the old kind is still in the back

#### masters · `masterMiner`
PLANTED · seed `r2s-religious_conversion-hamlet-0`

**Galeria Cato**, the quarry master (late forties) · hamlet, Capovetum  
Temperament: brave · Flaw: reckless · Manner: restless · Disposition: dismissive  
Impression: Busy and blunt. Visitors are a danger near the face.  
How they deal: Keeps you at the gate and gives a price.  
Wants (now): Bring Terentia Cicero together with someone who can help them.  
Wants (life): Hand on the stone quarry with full stores, honest accounts and nothing owed.  
Hook: A supplier is providing goods of uncertain provenance. The price is too good to ask questions. People have started asking questions.  
**Secret: Sank the deepest shaft of a famous pit, and digs wells here so that no one asks** · Stakes: They know why that shaft was closed

#### masters · `masterCarrier`
PLANTED · seed `r2s-insurgency-village-1`

**Torquatus Flaccus**, the carriers' master (early forties) · village, Collenovum  
Temperament: level-headed · Flaw: — · Manner: inscrutable · Disposition: welcoming  
Impression: Friendly and gossipy, with news of every road the carriers have walked.  
How they deal: Talks about the roads and who has been sending what.  
Wants (now): Win over one of Serranus Capito's friends.  
Wants (life): Have enough set by that no bad year can break them.  
Hook: They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.  
**Secret: Carried a great house's letters for twenty years, and drives a cart here so that no one asks** · Stakes: They read some of what they carried

#### outsiders · `fourthWall` (the owner's)
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Knows they are a figure in someone's game, speaks of the one who runs it and the ones who play, and is not troubled at all** · Stakes: Now and then they are right about what happens next

#### outsiders · `fromThePast` (the owner's) [magic only]
BORN · seed `r2r-town-48`

**Wen Tanaka**, the mint master (late fifties) · town, Hongpu  
Temperament: conscientious · Flaw: — · Manner: fatalistic · Disposition: cautious  
Impression: Stern, careful and heavily guarded. Their eyes go to your hands before your face.  
How they deal: Speaks briefly through the grille; asks your business and whether you have business here at all.  
Wants (now): Remind Hiroshi Xiao, quietly, of what is owed.  
Wants (life): Leave more money at the mint than there was when they took charge.  
Hook: A merchant they spoke against has started praising them in public, and will not say why.  
**Secret: Belongs to an age three centuries gone, and is still learning what has changed** · Stakes: They know where something was buried, and it is still there

#### outsiders · `fromTheFuture` (the owner's) [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Comes from years that have not happened yet, and is careful what they say about them** · Stakes: They know how something here ends

#### outsiders · `regressor` (the owner's) [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Has lived these years once already, died at the end of them, and woke at the beginning to try again** · Stakes: They know who betrays whom, and are no longer sure it will go the same way

#### outsiders · `otherWorld` (the owner's) [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Was pulled here from a world of machines and starlight, and still reaches for tools that do not exist** · Stakes: They talk in their sleep, and someone has been writing it down

#### outsiders · `realWorld` (the owner's) [magic only]
BORN · seed `r2r-metropolis-53`

**Abaqa Salji'ud**, the master furrier (early forties) · metropolis, Gantulgashari  
Temperament: astute · Flaw: — · Manner: iconoclast · Disposition: welcoming  
Impression: Smooth and flattering. Drapes a fur over your shoulders before you can say no.  
How they deal: Talks about the hunters, the trade routes and who has been buying furs this season.  
Wants (now): Bring Merchant Guilds a piece of news before anyone else does.  
Wants (life): Become someone Luvsandorj Mughal needs as much as they are needed.  
Hook: They have quietly stopped paying a supplier who cannot afford to take them to law.  
**Secret: Was someone else in a world where this one is a game, and woke here in a body that was not theirs** · Stakes: They remember the rules, and have started to use them

#### outsiders · `loop` [magic only]
BORN · seed `r2s-under_siege-hamlet-1`

**Konstantin Sokolov**, Headman (seventies) · hamlet, Zlatoko  
Temperament: — · Flaw: — · Manner: methodical · Disposition: dismissive  
Impression: Too busy with the nets and boats for idle talk.  
How they deal: Gives short answers and goes back to the work.  
Wants (now): Cut the spending at the fisher's landing by a tenth this season, and keep the work going.  
Wants (life): Keep Radmila Bogdanov loyal for life, and make loyalty pay better than ambition.  
Hook: An inheritance they did not expect has arrived from a relative they never met, along with that relative's debts.  
**Secret: Has lived this same year many times over, and is tired** · Stakes: This time they mean to do something different

#### outsiders · `dreamer`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Believes all of this is their own dream, and is waiting to wake** · Stakes: They take risks no waking person would

#### outsiders · `returns` [magic only]
BORN · seed `r2s-mass_migration-city-2`

**Matrona Hyaleas**, the sage (early sixties) · city, Megalrema  
Temperament: wise · Flaw: bitter · Manner: eccentric · Disposition: transactional  
Impression: Tired, but alert. The combination of someone who works hard and pays attention.  
How they deal: Holds you to every word of a deal and collects in full, whatever it costs you.  
Wants (now): Gain ground for Merchant oligarchy at the expense of Thieves' Guild before the season is out.  
Wants (life): Be given the secrets of Merchant oligarchy to keep, as well as its errands to run.  
Hook: A rival has hired away their two best hands in one week, on wages the rival cannot afford for long.  
**Secret: Has died four times, and each time woken in their own bed the next morning** · Stakes: They no longer take the care they should

#### outsiders · `statSight` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Sees numbers over people's heads, and has learned what most of them mean** · Stakes: One number here is much higher than it should be

#### outsiders · `riddler` (the owner's) [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Knows the answer to any question, and can give it only as a riddle** · Stakes: Every riddle so far has been true, and people have started bringing questions

#### outsiders · `sameDay` (the owner's) [magic only]
BORN · seed `r2s-indebted-hamlet-2`

**Liesel Schäfer**, the hedge wizard (mid-twenties) · hamlet, Goldhausen  
Temperament: plain-dealing · Flaw: hypocritical · Manner: cynical · Disposition: cautious  
Impression: Precise: words chosen carefully, pauses before answering, a slight sense of being assessed.  
How they deal: Gives careful answers that are true as far as they go, and they never go far.  
Wants (now): Bring Josefine Schulz together with someone who can help them.  
Wants (life): Make the traveling hedge wizard's wagon too sound for any creditor to threaten.  
Hook: They've been approached by someone who knows things about their research that were never made public.  
**Secret: Is living one day over and over, and will know a newcomer at first meeting as though they had met many times** · Stakes: By their second meeting the days have started moving again, and it is over

#### outsiders · `trueName` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is the last person alive who knows the true name of this place, and what answers to it** · Stakes: It has begun to stir

#### outsiders · `noShadow` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Has cast no shadow since a certain night, and stands carefully out of the sun** · Stakes: A child has noticed

#### outsiders · `smallGod` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Was a god once, of something small, and has almost forgotten what** · Stakes: The last worshipper is on the way here

#### outsiders · `deathsClerk` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Was Death's clerk for a long age, and still knows whose name is next** · Stakes: The next name is one they know

#### outsiders · `inAStory`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is certain they are a figure in a story someone is writing, and tries hard to be worth reading** · Stakes: They have begun to guess the ending

#### outsiders · `wrongEnding` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Was the hero of a tale that ended badly, and has walked out of it** · Stakes: The tale wants them back

#### outsiders · `madeThing` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is not a person at all but a made thing, and does not know it** · Stakes: The maker's mark is behind the left ear

#### outsiders · `starFallen` [magic only]
BORN · seed `r2r-metropolis-44`

**Lubna al-Basri**, the vintner (early fifties) · metropolis, Tallchowk  
Temperament: loyal · Flaw: suspicious · Manner: iconoclast · Disposition: cautious  
Impression: Keeps the cellar locked and the best casks out of sight.  
How they deal: Talks about the common wines freely; the rare ones are for buyers they know.  
Wants (now): Do Hana al-Rifai a favour big enough to count against what is owed.  
Wants (life): Have the rights of the vintner's cellars set down so firmly that the next ruler must keep them too.  
Hook: A lender has bought the note on their shop and wants it settled by the end of the month.  
**Secret: Fell from the sky as a light one winter night, and has been learning to be a person ever since** · Stakes: Something else fell that night

#### outsiders · `swappedBodies` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Woke one morning in this body, and the one who used to live in it is out there in theirs** · Stakes: A letter has come, in their own old hand

#### outsiders · `thousandLives` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Remembers every life they have lived before this one, and is bored of most trades** · Stakes: They have met someone here before, under other names

#### outsiders · `dragonHiding` [magic only]
BORN · seed `r2r-thorp-35`

**Messalina Maximus**, Elder (late twenties) · thorp, Fortemonte  
Temperament: incorruptible · Flaw: paranoid · Manner: pragmatic · Disposition: cautious  
Impression: Big, quiet and watchful, with an axe never far from the hand.  
How they deal: Asks your business in the woods before anything else.  
Wants (now): Make sure nothing they did in the past can come back on them this season.  
Wants (life): Be remembered as the one who kept the woodcutter's camp out of debt.  
Hook: Something they were told had been burned has turned up for sale.  
**Secret: Is a dragon, and has worn this shape so long that the hoard is mostly kitchenware** · Stakes: They still count it every night

#### outsiders · `underTheHat` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is the last of a people the world believes gone, and passes by keeping their hat on** · Stakes: Someone has seen under the hat

#### outsiders · `narrator` [magic only]
BORN · seed `r2r-city-23`

**Eithne MacMillan**, the senior charter master (seventies) · city, Benhurst  
Temperament: good-humoured · Flaw: lazy · Manner: ambitious · Disposition: transactional  
Impression: Scarred, heavy-set and used to dealing with armed people who want paying. The noticeboard behind them is full.  
How they deal: Matches work to companies; wants to see your company's charter, its strength and its record before offering a contract.  
Wants (now): Take on the work in The Guard that no one else wants, and do it without complaint.  
Wants (life): Leave more money at the adventurers' guilds than there was when they took charge.  
Hook: A purse they found and kept has a rightful owner, and that owner has started asking around.  
**Secret: Hears their own life told aloud a moment before it happens, and has started arguing with the voice** · Stakes: The voice has started arguing back

#### outsiders · `prophecy` [magic only]
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is named in a prophecy, misspelled, and has spent a lifetime hoping it means someone else** · Stakes: It does not

## 12. THE GOLDEN MASTER'S CONFIGURATIONS THAT NOW CARRY A RARE SECRET (168 of 525; key · seed · size · the card · the row)

- town|latin|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Moderatus Geta, the beast master · ties/owesLife: "Owes their life to Vita Severus, and has never found a way to say it"
- town|celtic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Kilian O'Neill, the beast master · ties/owesLife: "Owes their life to Eileen Fitzgerald, and has never found a way to say it"
- town|arabic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Usama al-Masri, the beast master · ties/owesLife: "Owes their life to Rashida al-Rahman, and has never found a way to say it"
- town|norse|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Lodmund Ketilsson, the beast master · ties/owesLife: "Owes their life to Ingrid Thorsson, and has never found a way to say it"
- town|slavic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Jordanka Karpov, the beast master · ties/owesLife: "Owes their life to Svetlana Sidorov, and has never found a way to say it"
- town|east_asian|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Tae Liang, the beast master · ties/owesLife: "Owes their life to Juan Zhang, and has never found a way to say it"
- town|mesoamerican|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Maize Ku, the beast master · ties/owesLife: "Owes their life to Huitzilxochitl Balam, and has never found a way to say it"
- town|steppe|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Ulugh Arulad, the beast master · ties/owesLife: "Owes their life to Ergene Kiyad, and has never found a way to say it"
- town|greek|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Theofanis Hexamilites, the beast master · ties/owesLife: "Owes their life to Athanasia Alexios, and has never found a way to say it"
- town|mediterranean|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · town · Moderatus Geta, the beast master · ties/owesLife: "Owes their life to Vita Severus, and has never found a way to say it"
- city|germanic|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Notker Jung, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|germanic|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Notker Jung, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|germanic|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Notker Jung, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|germanic|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Notker Jung, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|germanic|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Notker Jung, the beast master · ties/owesLife: "Owes their life to Hans Krüger, and has never found a way to say it"
- city|germanic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Notker Jung, the beast master · ties/owesLife: "Owes their life to Hans Krüger, and has never found a way to say it"
- city|latin|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|latin|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|latin|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|latin|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|latin|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/owesLife: "Owes their life to Regulus Geta, and has never found a way to say it"
- city|latin|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/owesLife: "Owes their life to Regulus Geta, and has never found a way to say it"
- city|celtic|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Kilian Farrell, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|celtic|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Kilian Farrell, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|celtic|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Kilian Farrell, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|celtic|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Kilian Farrell, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|celtic|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Kilian Farrell, the beast master · ties/owesLife: "Owes their life to Uilleam O'Neill, and has never found a way to say it"
- city|celtic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Kilian Farrell, the beast master · ties/owesLife: "Owes their life to Uilleam O'Neill, and has never found a way to say it"
- city|arabic|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Usama al-Suri, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|arabic|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Usama al-Suri, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|arabic|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Usama al-Suri, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|arabic|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Usama al-Suri, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|arabic|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Usama al-Suri, the beast master · ties/owesLife: "Owes their life to Musa al-Masri, and has never found a way to say it"
- city|arabic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Usama al-Suri, the beast master · ties/owesLife: "Owes their life to Musa al-Masri, and has never found a way to say it"
- city|norse|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Lodmund Sigvaldsson, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|norse|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Lodmund Sigvaldsson, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|norse|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Lodmund Sigvaldsson, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|norse|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Lodmund Sigvaldsson, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|norse|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Lodmund Sigvaldsson, the beast master · ties/owesLife: "Owes their life to Varg Ketilsson, and has never found a way to say it"
- city|norse|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Lodmund Sigvaldsson, the beast master · ties/owesLife: "Owes their life to Varg Ketilsson, and has never found a way to say it"
- city|slavic|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Jordanka Kuznetsov, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|slavic|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Jordanka Kuznetsov, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|slavic|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Jordanka Kuznetsov, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|slavic|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Jordanka Kuznetsov, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|slavic|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Jordanka Kuznetsov, the beast master · ties/owesLife: "Owes their life to Lukas Karpov, and has never found a way to say it"
- city|slavic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Jordanka Kuznetsov, the beast master · ties/owesLife: "Owes their life to Lukas Karpov, and has never found a way to say it"
- city|east_asian|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Tae Sato, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|east_asian|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Tae Sato, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|east_asian|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Tae Sato, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|east_asian|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Tae Sato, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|east_asian|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Tae Sato, the beast master · ties/owesLife: "Owes their life to Zi Liang, and has never found a way to say it"
- city|east_asian|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Tae Sato, the beast master · ties/owesLife: "Owes their life to Zi Liang, and has never found a way to say it"
- city|mesoamerican|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Maize Pech, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|mesoamerican|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Maize Pech, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|mesoamerican|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Maize Pech, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|mesoamerican|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Maize Pech, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|mesoamerican|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Maize Pech, the beast master · ties/owesLife: "Owes their life to Zac Ku, and has never found a way to say it"
- city|mesoamerican|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Maize Pech, the beast master · ties/owesLife: "Owes their life to Zac Ku, and has never found a way to say it"
- city|south_asian|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Yogesh Mehta, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|south_asian|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Yogesh Mehta, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|south_asian|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Yogesh Mehta, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|south_asian|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Yogesh Mehta, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|south_asian|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Yogesh Mehta, the beast master · ties/owesLife: "Owes their life to Prakash Jha, and has never found a way to say it"
- city|south_asian|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Yogesh Mehta, the beast master · ties/owesLife: "Owes their life to Prakash Jha, and has never found a way to say it"
- city|steppe|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Ulugh Ba'arin, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|steppe|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Ulugh Ba'arin, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|steppe|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Ulugh Ba'arin, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|steppe|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Ulugh Ba'arin, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|steppe|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Ulugh Ba'arin, the beast master · ties/owesLife: "Owes their life to Sorqan Geniges, and has never found a way to say it"
- city|steppe|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Ulugh Ba'arin, the beast master · ties/owesLife: "Owes their life to Sorqan Geniges, and has never found a way to say it"
- city|greek|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Theofanis Kataphloron, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|greek|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Theofanis Kataphloron, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|greek|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Theofanis Kataphloron, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|greek|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Theofanis Kataphloron, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|greek|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Theofanis Kataphloron, the beast master · ties/owesLife: "Owes their life to Manasses Hexamilites, and has never found a way to say it"
- city|greek|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Theofanis Kataphloron, the beast master · ties/owesLife: "Owes their life to Manasses Hexamilites, and has never found a way to say it"
- city|mediterranean|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|mediterranean|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|mediterranean|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/widowOf: "Is the widow or widower of someone this place put to death, and has never said so"
- city|mediterranean|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- city|mediterranean|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/owesLife: "Owes their life to Regulus Geta, and has never found a way to say it"
- city|mediterranean|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · city · Moderatus Moderatus, the beast master · ties/owesLife: "Owes their life to Regulus Geta, and has never found a way to say it"
- metropolis|germanic|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Notker Brauer, the beast master · ties/owesLife: "Owes their life to Franziska Stahl, and has never found a way to say it"
- metropolis|germanic|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Zita Klein, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|germanic|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Zita Klein, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|germanic|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Zita Klein, the crier · ties/debtOfHonour: "Carries a debt of honour to a family they have never met, laid on them by a dying parent"
- metropolis|germanic|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Notker Brauer, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|germanic|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Zita Klein, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|germanic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Notker Brauer, the beast master · ties/owesLife: "Owes their life to Kunhild Schulz, and has never found a way to say it"
- metropolis|latin|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Moderatus Regulus, the beast master · ties/owesLife: "Owes their life to Drusilla Pacuvius, and has never found a way to say it"
- metropolis|latin|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gratidia Nero, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|latin|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gratidia Nero, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|latin|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Moderatus Regulus, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- metropolis|latin|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Moderatus Regulus, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|latin|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gratidia Nero, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|latin|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gratidia Nero, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|celtic|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Kilian O'Halloran, the beast master · ties/owesLife: "Owes their life to Moira MacPherson, and has never found a way to say it"
- metropolis|celtic|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Scáthach Lynch, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|celtic|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Scáthach Lynch, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|celtic|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Scáthach Lynch, the crier · ties/debtOfHonour: "Carries a debt of honour to a family they have never met, laid on them by a dying parent"
- metropolis|celtic|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Kilian O'Halloran, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|celtic|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Scáthach Lynch, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|celtic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Kilian O'Halloran, the beast master · ties/owesLife: "Owes their life to Saidhbhín Ryan, and has never found a way to say it"
- metropolis|arabic|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Usama ibn Battuta, the beast master · ties/owesLife: "Owes their life to Iman al-Omani, and has never found a way to say it"
- metropolis|arabic|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Vidha al-Amin, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|arabic|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Vidha al-Amin, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|arabic|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Usama ibn Battuta, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- metropolis|arabic|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Usama ibn Battuta, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|arabic|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Vidha al-Amin, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|arabic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Usama ibn Battuta, the beast master · ties/owesLife: "Owes their life to Haneen al-Aziz, and has never found a way to say it"
- metropolis|norse|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Lodmund Leidolfsson, the beast master · ties/owesLife: "Owes their life to Inga Þorkellsson, and has never found a way to say it"
- metropolis|norse|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Menja Andersson, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|norse|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Menja Andersson, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|norse|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Menja Andersson, the crier · ties/debtOfHonour: "Carries a debt of honour to a family they have never met, laid on them by a dying parent"
- metropolis|norse|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Lodmund Leidolfsson, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|norse|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Menja Andersson, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|norse|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Lodmund Leidolfsson, the beast master · ties/owesLife: "Owes their life to Hlíf Olafsson, and has never found a way to say it"
- metropolis|slavic|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Jordanka Orlov, the beast master · ties/owesLife: "Owes their life to Jana Lazić, and has never found a way to say it"
- metropolis|slavic|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Rumena Alexeyev, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|slavic|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Rumena Alexeyev, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|slavic|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Rumena Alexeyev, the crier · ties/debtOfHonour: "Carries a debt of honour to a family they have never met, laid on them by a dying parent"
- metropolis|slavic|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Jordanka Orlov, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|slavic|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Rumena Alexeyev, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|slavic|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Jordanka Orlov, the beast master · ties/owesLife: "Owes their life to Danica Pavlov, and has never found a way to say it"
- metropolis|east_asian|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Tae Kato, the beast master · ties/owesLife: "Owes their life to Zhen Kwon, and has never found a way to say it"
- metropolis|east_asian|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Haruka Ma, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|east_asian|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Haruka Ma, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|east_asian|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Haruka Ma, the crier · ties/debtOfHonour: "Carries a debt of honour to a family they have never met, laid on them by a dying parent"
- metropolis|east_asian|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Tae Kato, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|east_asian|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Haruka Ma, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|east_asian|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Haruka Ma, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|mesoamerican|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Maize Uc, the beast master · ties/owesLife: "Owes their life to Ix Chup Itzam, and has never found a way to say it"
- metropolis|mesoamerican|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Water Lily Dzul, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|mesoamerican|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Water Lily Dzul, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|mesoamerican|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Maize Uc, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- metropolis|mesoamerican|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Maize Uc, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|mesoamerican|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Water Lily Dzul, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|mesoamerican|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Maize Uc, the beast master · ties/owesLife: "Owes their life to Morning Star Chuc, and has never found a way to say it"
- metropolis|south_asian|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Yogesh Pandey, the beast master · ties/owesLife: "Owes their life to Indira Upadhyay, and has never found a way to say it"
- metropolis|south_asian|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Padmini Das, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|south_asian|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Padmini Das, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|south_asian|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Yogesh Pandey, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- metropolis|south_asian|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Yogesh Pandey, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|south_asian|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Padmini Das, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|south_asian|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Yogesh Pandey, the beast master · ties/owesLife: "Owes their life to Chandravathi Chatterjee, and has never found a way to say it"
- metropolis|steppe|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Ulugh Arlat, the beast master · ties/owesLife: "Owes their life to Regünjid Ghurid, and has never found a way to say it"
- metropolis|steppe|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gantuyaa Qonggirad, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|steppe|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gantuyaa Qonggirad, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|steppe|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gantuyaa Qonggirad, the crier · ties/debtOfHonour: "Carries a debt of honour to a family they have never met, laid on them by a dying parent"
- metropolis|steppe|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Ulugh Arlat, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|steppe|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gantuyaa Qonggirad, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|steppe|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Ulugh Arlat, the beast master · ties/owesLife: "Owes their life to Selmeg Merkit, and has never found a way to say it"
- metropolis|greek|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Irini Chrysoberges, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|greek|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Irini Chrysoberges, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|greek|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Irini Chrysoberges, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|greek|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Theofanis Limniotes, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- metropolis|greek|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Theofanis Limniotes, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|greek|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Irini Chrysoberges, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|greek|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Irini Chrysoberges, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|mediterranean|plains|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Moderatus Regulus, the beast master · ties/owesLife: "Owes their life to Drusilla Pacuvius, and has never found a way to say it"
- metropolis|mediterranean|hills|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gratidia Nero, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|mediterranean|forest|isolated|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gratidia Nero, the crier · ties/changeling: "Is not the child their parents bore, and has known it since they could speak"
- metropolis|mediterranean|riverside|river|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Moderatus Regulus, the beast master · ties/familiar: "Keeps a small creature in the roof that is not an animal, and feeds it secrets"
- metropolis|mediterranean|coastal|port|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Moderatus Regulus, the beast master · ties/seventhChild: "Is a seventh child of a seventh child, and things they say in anger come true"
- metropolis|mediterranean|mountain|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gratidia Nero, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- metropolis|mediterranean|desert|road|civilized|golden-master-v3 · seed golden-master-v3 · metropolis · Gratidia Nero, the crier · ties/ward: "Is the secret ward of someone powerful far away, who pays for everything and has never once visited"
- town|germanic|plains|mountain_pass|civilized|golden-master-v3 · seed golden-master-v3 · town · Notker Krüger, the beast master · ties/owesLife: "Owes their life to Kunhild Meyer, and has never found a way to say it"
- town|germanic|plains|road|civilized|gm-seed-c · seed gm-seed-c · town · Peregrina Keller, the master baker · ties/hiddenSpouse: "Is secretly married to Moritz Ritter, and neither has found the right day to say so"

## 13. MEASURE 6 AGAIN, FOR THE 27 ROWS AMENDMENT 2 CHANGES (the tip `8beed42b2`)

Rows: 27 (every row whose words or conditions AMENDMENT 2 changes, and the eight that name a {target}, whose choice of person it changes). Born at the tip: 20. Planted (a real card of the 720 on which the deal's own reading lets the row stand, its secret set to the row): 7.

#### deeds · `hired`
BORN · seed `r2s-infiltrated-metropolis-2`

**Maize Acalan**, the warehouse factor (early twenties) · metropolis, Oxtetun  
Temperament: charismatic · Flaw: hypocritical · Manner: idealistic · Disposition: cautious  
Impression: Speaks quietly and walks the bays as they talk, checking seals and locks without seeming to.  
How they deal: Asks what you are moving and where it came from before saying whether there is room.  
Wants (now): Take on the work in The Guild Alliance that no one else wants, and do it without complaint.  
Wants (life): Be the person everyone here defers to.  
Hook: They have promised the same order to two buyers, and both are due to collect on the same morning.  
**Secret: Has taken coin to kill Bakab Dzunum, and has not yet decided to refuse** · Stakes: Whoever paid expects it done, and Bakab Dzunum suspects nothing

#### deeds · `felon` (the owner's)
BORN · seed `r2r-city-11`

**Ramesh Trivedi**, the midwife (early twenties) · city, Puripat  
Temperament: equitable · Flaw: ruthless · Manner: methodical · Disposition: cautious  
Impression: Watchful and private. People lower their voices as the midwife passes.  
How they deal: Will help anyone in need; says nothing about anyone else's household.  
Wants (now): Ask Vasudhara Prasad for advice on one hard decision this season.  
Wants (life): Hand on the midwife's house with full stores, honest accounts and nothing owed.  
Hook: They lent their savings to a friend who has since left, and the friend's family says there was no loan.  
**Secret: Is wanted for a crime in another place, and came here to be forgotten** · Stakes: A traveller from there would know the face

#### deeds · `blackmailer`
BORN · seed `r2r-city-7`

**Quartica Denter**, the scroll scribe (early sixties) · city, Faromare  
Temperament: dependable · Flaw: manipulative · Manner: cynical · Disposition: transactional  
Impression: Exact about everything. Prices by the spell and the length.  
How they deal: Sells copies at a posted rate; rare spells take longer and cost more.  
Wants (now): Win the scroll scribe's desk first call on any help those who govern can give this season.  
Wants (life): Make Egnatius Sabinus the first of many who owe them.  
Hook: Someone has been making inquiries about their past research. Not the published work, the unpublished work.  
**Secret: Is bleeding Secunda Cordus for coin over a thing done long ago** · Stakes: Secunda Cordus has begun to wonder whether another way would be cheaper

#### deeds · `graveRobber`
BORN · seed `r2r-village-37`

**Gavril Frolov**, the cobbler (late twenties) · village, Dobroets  
Temperament: warm-hearted · Flaw: — · Manner: proud · Disposition: cautious  
Impression: Quiet and careful. The good work is kept in the back and shown only on request.  
How they deal: Polite, but asks where you are from before taking an order for new shoes.  
Wants (now): Do Dubravka Petrov one useful favour this season, unasked.  
Wants (life): See every child they know grow up fed and safe.  
Hook: Their landlord has doubled the rent and will lower it only if they report on the family next door.  
**Secret: Digs up the newly buried for what was buried with them** · Stakes: The last grave had more kin than they thought

#### deeds · `raisedDead` [magic only]
BORN · seed `r2r-town-39`

**Angelina Hyaleas**, the tanner (early forties) · town, Lykotion  
Temperament: — · Flaw: greedy · Manner: mercurial · Disposition: cautious  
Impression: Watches who comes to the yard and why. Asks your business before you can ask theirs.  
How they deal: Says nothing about where the hides come from.  
Wants (now): Find the weak spot in what Agamemnon Attaleiates is doing, and press on it.  
Wants (life): Be counted one day among those who lead Town Mayor.  
Hook: Their apprentice has been talking to a rival, and came back with an offer to buy them out.  
**Secret: Raised something from a grave, once, and could not put it back** · Stakes: It has been seen at the edge of the fields

#### deeds · `paysDebts`
BORN · seed `r2r-metropolis-25`

**Jochi Yorqin**, the banker (early forties) · metropolis, Mönkhköl  
Temperament: honest · Flaw: arrogant · Manner: idealistic · Disposition: welcoming  
Impression: Quick to smile, quick to calculate. Both things are happening simultaneously.  
How they deal: Gracious in the way of someone doing you a kindness, and expects to be thanked for it.  
Wants (now): Either profit from the demographic change or find a way to be insulated from it. Either answer requires moving faster than the uncertainty  
Wants (life): Free the banking district from depending on a single source of precious metals.  
Hook: They have been slowly acquiring a controlling interest in a competitor through intermediaries. The competitor hasn't noticed yet.  
**Secret: Has been quietly paying off someone else's debts for years, and will not say why** · Stakes: The one they are paying for has found out, and wants to know what is owed in return

#### deeds · `stoleRelic`
BORN · seed `r2r-metropolis-57`

**Padmini Chatterjee**, the chief magistrate (mid-thirties) · metropolis, Vedapeta  
Temperament: generous · Flaw: — · Manner: iconoclast · Disposition: cautious  
Impression: Formally polite. Every sentence is measured before it leaves their mouth.  
How they deal: Kind but careful; helps once they know who you are and why you came.  
Wants (now): Take over one of Raj Varma's duties in Democratic assembly this season, and be seen to do it well.  
Wants (life): Make the court buildings too sound for any creditor to threaten.  
Hook: They promised the same post to two people, and both have already told their families.  
**Secret: Stole a holy thing from a roadside altar and cannot bring themselves to sell it** · Stakes: The ones it was taken from are still asking along the road

#### deeds · `fakedDeath`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Is supposed to be dead, with a grave and mourners in another place** · Stakes: One of the mourners travels

#### deeds · `thumbOnScale`
PLANTED · seed `r2r-city-0`

**Zina Nikitin**, the master fishmonger (early fifties) · city, Goraka  
Temperament: generous · Flaw: paranoid · Manner: nostalgic · Disposition: transactional  
Impression: Wet to the elbows, loud, and quick with a knife. Calls the prices over every head in the market.  
How they deal: Haggles with pleasure; the price drops for anyone who buys a lot and comes back.  
Wants (now): Find someone in authority who would shield them if they talked.  
Wants (life): Rise past Radoslav Solovyov in The Guild Alliance on their own merit, owing no one for the climb.  
Hook: Their scales were tested and found heavy in their favour, and they swear someone changed them overnight.  
**Secret: Has kept a thumb on the scale for twenty years, a grain at a time** · Stakes: Someone has brought their own weights

#### deeds · `spared`
BORN · seed `r2r-city-50`

**Laberia Falco**, the nominal owner (late thirties) · city, Capocolonia  
Temperament: generous · Flaw: — · Manner: calculating · Disposition: cautious  
Impression: Nervous under the smile. Their eyes keep going to the back door.  
How they deal: Says little and wants you gone; if you mention certain names, the shop closes early.  
Wants (now): Show the rest of Thieves' Guild that Marcus Volso can be wrong, without ever saying so aloud.  
Wants (life): See every child they know grow up fed and safe.  
Hook: A rival crew has offered peace, and the offer arrived on the same day one of their people went missing.  
**Secret: Was sent here to kill someone, and has stayed eleven years without doing it** · Stakes: Whoever sent them has started to ask

#### natures · `cannotRead`
BORN · seed `r2s-monster_pressure-city-3`

**Bassus Caepio**, the whisper broker (early fifties) · city, Villaplenum  
Temperament: gracious · Flaw: — · Manner: fatalistic · Disposition: cautious  
Impression: Soft voice, forgettable clothes and a habit of sitting with their back to the wall.  
How they deal: Listens far more than they speak; asks what you know before saying what they know.  
Wants (now): Find the weak spot in what Torquatus Silanus is doing, and press on it.  
Wants (life): Build up enough savings at the whisper market to ride out two bad years.  
Hook: Someone has been using their name to frighten shopkeepers, and the shopkeepers have begun paying the wrong people.  
**Secret: Cannot read a word, and conceals it behind a good memory and a trusted helper** · Stakes: The helper has started to ask for more

#### natures · `neverAngry`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Has not been angry in twenty years, and is saving all of it for one person** · Stakes: That person lives nearer than they think

#### natures · `hearsLies` [magic only]
BORN · seed `r2r-metropolis-46`

**Hanako Ma**, the collier (mid-forties) · metropolis, Beiguan  
Temperament: good-humoured · Flaw: — · Manner: superstitious · Disposition: cautious  
Impression: Black with soot to the elbows, eyes red from the smoke. Says little to people from outside the woods.  
How they deal: Answers questions about the woods; asks who sent you.  
Wants (now): Find the charcoal kilns one more source of money.  
Wants (life): Earn a place among the leaders of Merchant Guilds without buying it or marrying into it.  
Hook: They have been invited to the wedding of someone who once ruined their family, and refusing would be noticed.  
**Secret: Always knows a lie when they hear one, and has learned to keep a straight face** · Stakes: They know of three lies in this place that matter

#### natures · `oneBook`
BORN · seed `r2r-metropolis-53`

**Naya Jirgin**, the castellan (late fifties) · metropolis, Gantulgashari  
Temperament: diligent · Flaw: bitter · Manner: proud · Disposition: dismissive  
Impression: Proud and impatient with outsiders. The citadel's business is not yours.  
How they deal: Gives permission to pass or refuses it, and does not explain either.  
Wants (now): Learn who Borte Kipchak really meets, and how often.  
Wants (life): Be remembered as the one who kept the citadel out of debt.  
Hook: They've noticed the same group of faces at multiple locations where incidents occurred. No one else has.  
**Secret: Taught themselves to read from a single book, knows it by heart, and has read nothing else** · Stakes: The book is not what they think it is

#### natures · `tooHonest`
BORN · seed `r2r-town-48`

**Yafang He**, the coaching-inn keeper (mid-twenties) · town, Hongpu  
Temperament: forthright · Flaw: callous · Manner: zealous · Disposition: cautious  
Impression: Notes every traveller's name, face and baggage, and remembers all three.  
How they deal: Pleasant, but asks where you are going and when, and writes it down.  
Wants (now): Keep the quarrel between Merchant Guilds and Craft Guilds from turning into open trouble this season.  
Wants (life): Turn the bargain with Daisuke Matsumoto into real trust over the years.  
Hook: They overheard two people they know settle a bribe, and do not know whom to tell.  
**Secret: Has never taken a coin that was not theirs, and is quietly ashamed of how poor it has kept them** · Stakes: Someone has offered them a great deal to change

#### ties · `parentOf`
BORN · seed `r2s-under_siege-metropolis-3`

**Tyche Tarchaneiotes**, the pit boss (late fifties) · metropolis, Andronrion  
Temperament: — · Flaw: reckless · Manner: nostalgic · Disposition: transactional  
Impression: Loud and friendly with a purse in every hand. Talks in odds.  
How they deal: Takes bets, sells places by the pit and will match a fighter for a fee.  
Wants (now): Pay every hand at the fighting pits in full and on time this season.  
Wants (life): Earn a place among the leaders of Thieves' Guild without buying it or marrying into it.  
Hook: A valuable item came through their network recently. Three different parties have asked about it quietly.  
**Secret: Is the true parent of Hypatia Laskaris, and Hypatia Laskaris does not know** · Stakes: One other person knows, and has been patient so far

#### ties · `lovesNamed`
BORN · seed `r2r-city-29`

**Sita Goswami**, the mine captain (late forties) · city, Kamalapalli  
Temperament: clever · Flaw: dismissive · Manner: calculating · Disposition: dismissive  
Impression: Busy and short. The shift change is coming and there is no time for visitors.  
How they deal: Gives a word or two and turns back to the shaft.  
Wants (now): Find the mine one more source of money.  
Wants (life): Be counted one day among those who lead Merchant Guilds.  
Hook: A supplier is providing goods of uncertain provenance. The price is too good to ask questions. People have started asking questions.  
**Secret: Is in love with Lakshmana Banerjee, and would sooner die than have it known** · Stakes: Lakshmana Banerjee has started to notice

#### ties · `lostChild`
BORN · seed `r2r-metropolis-2`

**Hong Moon**, the mint master (late fifties) · metropolis, Xidao  
Temperament: — · Flaw: imperious · Manner: zealous · Disposition: transactional  
Impression: Precise and formal, with a scale on the desk and a weight for every coin.  
How they deal: Will change coin and test metal at the posted rate; asks who you are first.  
Wants (now): Stand by Jiangli Han in their next quarrel, whoever it is with.  
Wants (life): Rise in High Theocratic Council far enough that their word carries weight outside it.  
Hook: A clerk in their office has been copying letters at night, and the copies have turned up in a rival's hands.  
**Secret: Gave up a child at birth, and has watched for its face in every stranger since** · Stakes: Anyone with that face would be of an age to ask questions now

#### ties · `owesLife`
BORN · seed `r2s-occupied-metropolis-1`

**Theofanis Voulgaropoulos**, the master smith (early fifties) · metropolis, Dionpetra  
Temperament: — · Flaw: — · Manner: secretive · Disposition: dismissive  
Impression: Treats anyone who is not buying as noise. The hammer keeps time while you speak.  
How they deal: Answers in a word or two unless the talk turns to metal, and then cannot be stopped.  
Wants (now): Ration what is left at the blacksmiths so the work lasts until new supply arrives.  
Wants (life): Live a quiet life, out of other people's quarrels.  
Hook: An old ruling of theirs is being used to take a widow's house, and they cannot undo it without admitting the mistake.  
**Secret: Owes their life to Panteleimon Laskaris, and has never found a way to say it** · Stakes: Panteleimon Laskaris has asked them for something they ought to refuse

#### ties · `guardian`
BORN · seed `r2r-village-14`

**Pall Haraldsson**, the dairy farmer (seventies) · village, Skaldaker  
Temperament: gracious · Flaw: vengeful · Manner: opportunistic · Disposition: welcoming  
Impression: Red-cheeked and cheerful, smelling of the byre, with a jug of milk ready.  
How they deal: Offers a cup and talk of the weather and the price of milk.  
Wants (now): Keep the accounts of the dairy balanced, and show them to anyone who asks.  
Wants (life): Settle things with Helga Svensson for good, one way or another.  
Hook: Their son has been seen at night with people who do not work, and comes home with coin.  
**Secret: Was asked by a dying friend to watch over Unnr Magnusson, and has done it for years without a word** · Stakes: Unnr Magnusson thinks they are being followed

#### ties · `promised`
PLANTED · seed `r2r-city-0`

**Varvara Vorobev**, Lord Burgomaster (late twenties) · city, Goraka  
Temperament: loyal · Flaw: wrathful · Manner: obsessive · Disposition: cautious  
Impression: Cautious with newcomers, because the work requires it; it is nothing personal.  
How they deal: Treats every question as a possible threat, and remembers who asked it.  
Wants (now): Make sure Konstantin Alexeyev keeps paying, even if late.  
Wants (life): Lead Merchant City Council so long and so well that no one, Liliya Gusev included, thinks of replacing them.  
Hook: A family they put out of business has opened again under a new name, two doors down.  
**Secret: Was promised in marriage as a child to someone they have never met, and the day is coming** · Stakes: The other family keeps its promises

#### ties · `oathAgainst`
BORN · seed `r2r-metropolis-41`

**Anton Grbić**, the sage (late forties) · metropolis, Hvaliko  
Temperament: charismatic · Flaw: manipulative · Manner: secretive · Disposition: cautious  
Impression: Reserved. Not hostile, just private.  
How they deal: Gives careful answers that are true as far as they go, and they never go far.  
Wants (now): Stand by Lukas Loginov in their next quarrel, whoever it is with.  
Wants (life): Rise in Arcane Orders far enough that their word carries weight outside it.  
Hook: They have seen the same unmarked cart pass their door three nights running, and have not wondered why.  
**Secret: Belongs to a family sworn, generations back, to end the line of Timofei Đorđević, and is the last who remembers the oath** · Stakes: They like Timofei Đorđević

#### ties · `runaway`
BORN · seed `r2r-city-43`

**Rong Suzuki**, the brewer (late thirties) · city, Lincheng  
Temperament: — · Flaw: corrupt · Manner: proud · Disposition: transactional  
Impression: Practical, with the red hands of someone who works hot vats all day.  
How they deal: Sells by the barrel to taverns and by the jug to anyone; talks prices plainly.  
Wants (now): Put away more coin this season than last.  
Wants (life): Settle things with Xin Sasaki for good, one way or another.  
Hook: Their predecessor left something behind (in a place where it shouldn't have been), and they haven't reported finding it.  
**Secret: Ran from a marriage on the morning of it, three towns away, and the other family still pays people to look** · Stakes: One of those people has come this way

#### ties · `hiddenSpouse`
BORN · seed `r2r-metropolis-19`

**Razan al-Waqqas**, the auctioneer (late sixties) · metropolis, Mintaroasis  
Temperament: warm-hearted · Flaw: overbearing · Manner: eccentric · Disposition: transactional  
Impression: Sharp and fast. Remembers what every buyer paid and what they can afford.  
How they deal: Takes goods for sale at a fee and a share; payment is in coin, on the day.  
Wants (now): Bring Grand Merchant Oligarchy a piece of news before anyone else does.  
Wants (life): Be obeyed without ever having to raise their voice.  
Hook: They have evidence of price-fixing across the whole market. Publishing it helps their competition as much as their customers.  
**Secret: Is secretly married to Selma al-Malik, and neither has found the right day to say so** · Stakes: A third person has started courting one of them

#### ties · `nameless`
PLANTED · seed `r2r-city-0`

**Anna Loginov**, the watch commander (seventies) · city, Goraka  
Temperament: — · Flaw: petty · Manner: obsessive · Disposition: cautious  
Impression: Upright and watchful, with a habit of standing where they can see the whole room.  
How they deal: Polite and brief; asks your business, your lodgings and how long you plan to stay.  
Wants (now): Get one person close to Zina Nikitin to talk, quietly.  
Wants (life): Be counted one day among those who lead Merchant City Council.  
Hook: Someone is paying their soldiers more than their salary. The soldiers aren't saying who.  
**Secret: Does not know their true name or where they were born: they were found on the road with a purse and a knife** · Stakes: The knife has a maker's mark that someone here knows

#### masters · `masterBlade`
PLANTED · seed `r2s-indebted-hamlet-0`

**Sorghaghtani Taichiud**, the militia captain (mid-sixties) · hamlet, Gantulgabulag  
Temperament: warm-hearted · Flaw: reckless · Manner: contrarian · Disposition: cautious  
Impression: Alert. Not hostile, but attentive in a way that doesn't quite switch off.  
How they deal: Keeps out of trouble by keeping away from you, and sends you to someone else when they can.  
Wants (now): Keep the accounts of the citizen militia balanced, and show them to anyone who asks.  
Wants (life): Outlast Gereltsetseg Kiyad in Free Elder Council, and be ready when the place falls empty.  
Hook: Tracks they were told to ignore lead from the edge of the fields to a camp nobody has reported.  
**Secret: Was captain of a great house's guard, and keeps a quiet watch here so that no one asks** · Stakes: The day the place is threatened, everyone will see what they are

#### masters · `masterThief`
PLANTED · seed `r2r-village-0`

**Mord Bjarnarson**, the network's spider (early thirties) · village, Lundborg  
Temperament: charismatic · Flaw: wrathful · Manner: pragmatic · Disposition: welcoming  
Impression: Friendly and ordinary, the kind of person you would forget an hour later.  
How they deal: Chats easily and learns far more than you meant to tell.  
Wants (now): Learn what Kráka Finsson has been saying about them, and to whom.  
Wants (life): Outlast every person who ever crossed them.  
Hook: Someone has been using their name to frighten shopkeepers, and the shopkeepers have begun paying the wrong people.  
**Secret: Was the best lock-breaker of a great city's guild, and keeps to small work here so that no one asks** · Stakes: The guild believes they are dead, and would correct the error
