# TITLES-1 — PROPOSAL (written 2026-11-20 05:47 UTC; branch `lane/titles-2026-11-20` cut at `7e0c77ae2`, the tip of `origin/lane/join-2026-11-14`)

Status: a proposal and a sample page. No code yet. The other eight cultures, the resolver and its tests wait for the chair's GO.

## 0. Corrections to the brief (measured at `7e0c77ae2`)

1. **Today's table is 39 rows, but the generator writes 58 government names.** `OFFICE_TITLES` holds 39. Another 19 are written by `generators/power/rulingStructure.js`, `domain/rulingPower.js :: GOVERNMENT_PREFERENCES` and `representatives.js :: APPOINTED_GOVERNMENTS` and are not in the table: the 10 appointed seats, the 5 criminal seats, 3 assemblies and Mixed Council. Today the dual hat never reaches the appointed or criminal seats (`dualHatHouseOf` returns null for both), so `officeTitleFor` is never asked for them.
2. **`officeTitleFor` is called with the governing POWER's name** (`castPowers.js:436`, `officeTitleFor(power, tier)`). For a governing power, that name is the government's name.
3. **`src/domain/veil/` does not exist**, either at `7e0c77ae2` or on `lane/sec-grants-2-2026-11-20` (`a18bf94`). The only file matching `src/domain/display/gallery*.js` is `galleryVeil.js`.
4. **No government name means "a ruler who answers to no one".** Every single-ruler name is either sent by another (the appointed ten) or a local head (Town Mayor, Elected Reeve, Headman's Authority). The sovereign family is therefore assigned by SEAT-1's FORM, not by a name. The record already carries the signal: `domain/facts/sovereign.js :: sovereignOf` says whether a lord, liege or crown stands over the town. This is inferred from the fact's doc comment; I have not traced the function.

## 1. The families (14: 11 official, 3 criminal) and every name's family

| family | who | the 58 names |
|---|---|---|
| `sovereign` | the single ruler who answers to no one | (none by name: SEAT-1 assigns it, see §0.4) |
| `appointed` | the single ruler SENT by another | Royal Authority, Noble Governorship, Ducal Governorship, Feudal Stewardship, Feudal Appointee, Noble Regency, Foreign Stewardship, Foreign Administration, Occupation Authority, Martial Administration |
| `headman` | the single head the place puts up itself, who may stand under a crown | Town Mayor, Elected Reeve, Headman's Authority; also the civic fallback for a name no family holds |
| `council` | the first of a council | Town Council, City Council, Grand Council, City-State Council, Mixed Council |
| `assembly` | the speaker of an assembly | Democratic assembly, Commons Assembly, Workers' Assembly, Grand Commons Assembly |
| `elders` | the first of the elders | Elder Council, Free Elder Council, Elder Consensus, Household Council |
| `merchant` | the first of a merchant seat | Merchant Council, Merchant City Council, Grand Merchant Senate, Merchant oligarchy, Grand Merchant Oligarchy, Merchant Guild Council, Grand Guild Consortium |
| `guild` | the first of a craft-guild seat | Guild Council, Guild Authority, Grand Guild Council, Guildmasters' Moot, Guildhall Council, Grand Guild Assembly |
| `faith` | the first of a faith's seat | Priestly Guidance, Church Council, Ecclesiastical Council, Theocratic Council, High Theocratic Council |
| `military` | the first of a military seat | Militia Command, Military Council, Military City Council, Grand Military Council, Garrison Command |
| `arcane` | the first of an arcane seat | Circle of Adepts, Arcane Council, Arcane Senate, Grand Arcane Council |
| `underboss` (criminal) | the single figure behind a captured seat | Corrupt Council, Corrupt City Council, Shadow Senate, Corrupt Oligarchy, Shadowed Council. SEAT-1 picks `underboss` when one person holds the seat and `crime_boss` when a group does. |
| `crime_boss` (criminal) | each of the top three on the group card | (as above) |
| heading (criminal) | the group card's heading | "Crime Bosses" |

**Why I split `merchant` from `guild`, against the brief's one family:** the culture words differ. In the Arabic table, the head of the merchants is a shahbandar, while a craft guild's head is not. One family would force a wrong word onto six names. Today's titles already split the same way (Burgomaster and Doge for merchants, Alderman for guilds). One more key, no other cost. Vetoable.

## 2. The file and the resolver

**New file `src/data/cultureOfficeTitles.js`.** It holds pure data and one resolver, following the precedent of `faceHonorifics.js`. It does not edit `officeTitles.js`; it only reads `OFFICE_TITLES` and `CIVIC_OFFICE_BY_SIZE` from it.

- `OFFICE_FAMILIES` lists the 14 keys.
- `GOVERNMENT_FAMILY` maps each name to its family, per the table in §1.
- `BASE_OFFICE_TITLES` holds the culture-neutral ladders, for the three families that have no title today: `sovereign`, `appointed` and the criminal pair.
- `CULTURE_OFFICE_TITLES` is `culture → family → tier → cell`. A cell is a string or `{ male, female }`. An absent cell means "fall back".
- `CULTURE_OFFICE_WORDS` lists every word the new table can write, as `{ word, family, sex }`. It sits beside `OFFICE_WORDS` for the readers in §4.
- One test file, `tests/data/cultureOfficeTitles.test.js`, plus its row in `scripts/mutation-coverage-manifest.json`.

```js
familyOfGovernment(name: string): OfficeFamily | null
officeTitleIn({ family, tier, culture, government = null, sex = null }): string
crimeBossesHeadingIn({ culture, tier }): string
```

**The fallback order:**
1. The culture's cell, in the holder's form.
2. For the 8 families that have a title today: **today's title**, i.e. `OFFICE_TITLES[government] || CIVIC_OFFICE_BY_SIZE[tier] || 'Mayor'`. This is the same expression `officeTitleFor` uses.
3. For the 3 families with no title today (`sovereign`, `appointed`, criminal): the `BASE` ladder.
4. An unknown culture (`mixed` included) or an unknown family skips step 1.

The result is never blank and never another culture's word. When no sex is given, the masculine form is used, following the `faceHonorifics` precedent.

## 3. SAMPLE PAGE FOR THE OWNER (plain text)

`·(X)` means the table leaves the cell to the fallback, and the town shows X. For a family whose fallback is today's title, X is today's word for that family's most common name at that size.

```
SIZES:                 THORP           HAMLET          VILLAGE          TOWN             CITY                 METROPOLIS

BASE (any culture without its own word; the three families that have no title today)
 sovereign             Chieftain       Chieftain       Chieftain        Lord / Lady      King / Queen         Emperor / Empress
 appointed             Steward         Steward         Steward          Governor         Governor             Governor
 underboss             Ringleader      Ringleader      Underboss        Underboss        Underboss            Underboss
 crime boss (each)     Crime Boss      Crime Boss      Crime Boss       Crime Boss       Crime Boss           Crime Boss
 group card heading    Crime Bosses    (the same at every size, in every culture: the owner's word)

NORSE
 sovereign             ·(Chieftain)    ·(Chieftain)    Jarl             Jarl             King / Queen         High King / High Queen
 appointed             ·(Steward)      ·(Steward)      ·(Steward)       ·(Governor)      Jarl                 Jarl
 headman               ·(Elder)        ·(Elder)        Jarl             Jarl             Jarl                 Jarl
 council               ·(Elder)        ·(Elder)        Lawspeaker       Lawspeaker       Lawspeaker           Lawspeaker
 assembly              ·(Elder)        ·(Elder)        Lawspeaker       Lawspeaker       Lawspeaker           Lawspeaker
 elders                ·(Elder)        ·(Elder)        ·(Elder)         ·(Elder)         -                    -
 merchant              -               -               ·(Burgomaster)   ·(Burgomaster)   ·(Lord Burgomaster)  ·(Doge)
 guild                 -               -               ·(Alderman)      ·(Alderman)      ·(Lord Alderman)     ·(Lord Alderman)
 faith                 ·(Elder Priest) ·(Elder Priest) ·(Elder Priest)  ·(Warden of the Council) ·(Lord Warden) ·(Lord Protector of the Faith)
 military              ·(Elder)        ·(Elder)        Hersir           Hersir           ·(Lord Marshal)      ·(Lord Marshal)
 arcane                -               -               ·(First Adept)   ·(Archmage of the Council) ·(Archmage of the Council) ·(Archmage of the Senate)
 criminal side         the BASE rows (no culture word: see the note below)

LATIN
 sovereign             ·(Chieftain)    ·(Chieftain)    ·(Chieftain)     Princeps         Rex / Regina         Imperator / Imperatrix
 appointed             ·(Steward)      ·(Steward)      ·(Steward)       Procurator       Legate               Proconsul
 headman               ·(Elder)        ·(Elder)        ·(Elder)         ·(Mayor)         ·(Lord Mayor)        ·(Lord Mayor)
 council               ·(Elder)        ·(Elder)        ·(Elder)         Consul           Consul               First Consul
 assembly              ·(Elder)        ·(Elder)        ·(Elder)         Tribune of the People (town, city, metropolis)
 elders                ·(Elder)        ·(Elder)        ·(Elder)         ·(Elder)         -                    -
 merchant / guild      (all cells fall back: today's Burgomaster, Doge, Alderman)
 faith                 (all cells fall back)
 military              ·(Elder)        ·(Elder)        Decurion         Centurion        Dux                  Dux
 arcane                -               -               Magister         Magister         Archmagister         Archmagister
 criminal side         the BASE rows

ARABIC
 sovereign             ·(Chieftain)    ·(Chieftain)    Sheikh / Sheikha Sheikh / Sheikha Emir / Emira         Sultan / Sultana
 appointed             ·(Steward)      ·(Steward)      ·(Steward)       ·(Governor)      Wali                 Wali
 headman               Mukhtar         Mukhtar         Mukhtar          Ra'is            Ra'is                Ra'is
 council / assembly    (all cells fall back: today's Mayor, Lord Mayor, First Councillor, Speaker of the Assembly)
 elders                Sheikh / Sheikha at every size where an elders' seat exists
 merchant              -               -               ·(Burgomaster)   Shahbandar       Shahbandar           Shahbandar
 guild                 (all cells fall back: today's Alderman)
 faith                 (all cells fall back: Islam is a living faith, so I author no title here)
 military              ·(Elder)        ·(Elder)        Qaid             Qaid             ·(Lord Marshal)      ·(Lord Marshal)
 arcane                (all cells fall back)
 criminal side         the BASE rows
```

A dash (`-`) means the generator writes no such seat at that size; the cell is still defined.

**One three-word gloss per new word, for the DM:**
- Jarl: the northern earl.
- Lawspeaker: the assembly's lawgiver.
- Hersir: a local war-chief.
- Princeps: the first citizen.
- Rex / Regina: king, queen.
- Imperator / Imperatrix: emperor, empress.
- Procurator, Legate, Proconsul: the empire's governor, by rank.
- Consul: the council's first.
- Tribune of the People: the commons' speaker.
- Decurion, Centurion, Dux: commanders of ten, of a hundred, of a province.
- Magister / Archmagister: the master mage.
- Sheikh / Sheikha: the respected elder.
- Emir / Emira: the commanding prince.
- Sultan / Sultana: the sovereign ruler.
- Wali: the appointed governor.
- Mukhtar: the chosen headman.
- Ra'is: the town's head.
- Shahbandar: the chief of merchants.
- Qaid: the commander.

**The criminal side has no culture words, on purpose.** Every culture-specific crime word I can think of is a real people's organised-crime word: capo, oyabun, the triads' ranks. Each reads as a stereotype of a people, which CT4 forbids. So the criminal side varies by size, not by culture, and the owner's words "Underboss" and "Crime Bosses" stand everywhere. Vetoable.

## 4. CT5: what new words touch (read, none edited)

1. **`domain/people/seatKeeperDisplay.js :: shownHonorificOf` (reads `OFFICE_WORDS`).** It prints the house's own title where the house's honorific is itself an office word. The culture honorifics in `faceHonorifics.js :: FACE_HONORIFICS_BY_CULTURE` already write Jarl (norse: the lord, the headman), Sheikh (arabic: the eldest, the headman) and Wali (arabic: the governor). Those same words now become offices. A norse headman-house leader who holds the headman office would print "Jarl" on the honorific row AND as the office. **SEAT-1:** test against `OFFICE_WORDS` together with `CULTURE_OFFICE_WORDS`, or against the card's own office.
2. **`domain/people/cardPowers.js :: caretakerFormOf`.** Its `CROWN_OFFICES` is the literal list `['King','Queen','Monarch']` and gives "Regent". Every new sovereign word would print "Acting Jarl", "Acting Emperor", "Acting Sultan". **SEAT-1:** decide the regent by family (`sovereign`), not by word. `CULTURE_OFFICE_WORDS` carries each word's family.
3. **`tests/helpers/peopleKinds.js :: OFFICE_FORM` (the sex-named-title walker).** It exempts every `OFFICE_WORDS` entry from the sex check. If SEAT-1 adds the new words to `OFFICE_WORDS` wholesale, "King" on a woman would pass unseen. **SEAT-1:** exempt only the form that matches the holder's sex. `CULTURE_OFFICE_WORDS` carries each form's sex. The walker's own lists know `king`/`queen` and `lord`/`lady`, not Emperor, Sultan or Sheikh.
4. **`domain/roles/roleClass.js :: classOfRole` / `holdsOffice`.** These are read by the coherence walker `domain/coherence/readerBattery.js` (Jurisdictional Tension) and by `npc/factionLeaderSecret.js`. Measured: King, Jarl, Lawspeaker, Sultan, Consul, Underboss and Crime Boss all class as `other` and do not hold office. Today's Headman, Burgomaster, Doge, First Councillor and Speaker are already `other`/false too. So the gap predates this work, but new words widen it. **SEAT-1:** class the leader's role from its family.
5. **`generators/roleCategory.js :: roleToCategory`** matches keywords by substring. "Magister" reads as magic (right for arcane; that is why I gave no civic seat that word). "Lord / Lady" (the base town sovereign) reads as noble. No new word contains "crime lord" or "kingpin".
6. **`domain/people/cardPowers.js :: cardHatsOf`** removes a doubled last word. A new word doubles only where a house title ends in the same word. None does today.
7. **The presumption walker `tests/lint/presumptionClasses.*`** skips literals under 4 words. Every cell is 3 words or fewer except "Tribune of the People", which holds none of its lexicon words. So the shrink-only register needs no rows.
8. **The security lane.** `galleryVeil.js` searches no office word. `role` and `title` are on the identity floor (`CARD_KINDS[k].floor`), so a new word is always public and never hidden. The civility list `data/civilityLists.js` flags none of the candidate words (grep, 0 hits). **Security lane:** nothing to change. They should only know that the role text can now hold these words.
9. **Births move.** Every authored cell changes the role written at birth for a town of that culture. Saved towns keep theirs, because the resolver is called only at birth. **SEAT-1** owns the golden doors and the pins that hold literal titles: `tests/helpers/dualHatOracle.js`, `tests/domain/dossier/seatHolder.test.js` and `tests/generators/terrainPoolsSeat.test.js`.
10. **For the owner (not mine to edit).** `FACE_HONORIFICS_BY_CULTURE` already prints living faiths' sacred titles: Imam (arabic), Purohit (south_asian), Pontifex (latin, a title of the Pope today), and Godi/Gydja (norse, the priest titles of today's Ásatrú). Under CT4's rule, those would be refused here.

## 5. UNSURE (left to the fallback; what would settle each)

- **norse `faith`.** Goði and Gyðja are used by a living faith (Ásatrú). I need the owner's ruling on whether a revived faith counts as living.
- **norse `merchant` and `guild`.** I know no Norse word for the head of a merchant or craft fellowship (félag). I would need a source.
- **norse `arcane`.** Völva is a seeress, not a seat's head, and is also used by modern Heathenry.
- **norse `appointed` below city.** Lendmann or Ármaðr would fit (the king's landed man, the king's bailiff), but both are obscure and I am not sure a DM could say either.
- **norse `military` at city size and above.** Stallari (the king's marshal) is real but obscure.
- **latin `headman`.** The real word, magister pagi, would read as arcane (see §4.5), and duumvir means one of two. I need a word for a single elected town head.
- **latin `merchant` and `guild`.** The head of a guild (collegium) was a magister, which has the same arcane clash.
- **latin `faith`.** Pontifex and Flamen. Pontifex is a living title; for Flamen I need a ruling on revived Roman religion.
- **arabic `council` and `assembly`.** I know no period word for the first of a shura that I am sure of.
- **arabic `guild`.** Shaykh of the craft is right but collides with the elders' Sheikh. I need the owner's choice.
- **arabic `appointed` below city.** ʿĀmil is real but obscure.
- **Wali (authored, flagged).** Wali is also the Sufi word for a saint. Its governor sense is standard (the Ottoman vali), and `faceHonorifics` already prints it. If the owner reads it as sacred, it goes to the fallback.
- **Sultana for a woman who reigns.** Usage is split. Razia Sultan refused "Sultana", while English usage gives Sultana. I authored the pair; the owner may prefer "Sultan" for both.
- **High King at a norse metropolis.** It is a fantasy convention (an Irish loanword), not a Norse office. The alternative is "King" at both city and metropolis.

## 6. ADDENDUM (2026-11-20 05:54 UTC): the interface agreed with SEAT-1 (session_019yED1PyQxQZi2zHJeLhhLu), which replaces §2's signatures

SEAT-1 asked for these names. I accepted them with two changes, `sex` and the never-null rule.

- `officeTitleOf({ family, tier, culture, sovereign, sex }) → string | null`.
  - `sovereign` is read only for `headman`. It replaces the separate `sovereign` family, so there are 13 families.
  - NULL means "use today's title" and is given only for the 8 families that have a title today.
  - `headman` with `sovereign`, `appointed` and the criminal families never return NULL; they return the BASE word.
- `officeFamilyOfForm(form) → family | null` covers all 58 names.
- `crimeBossesHeading() → "Crime Bosses"`.
- `officeWordInfo(word) → { families, sovereign, crown, sex } | null` covers every word this table emits plus today's `OFFICE_WORDS`. It gives SEAT-1's census of the word-matching readers (`seatHolder.js`, `roleClass.js`, `roleCategory.js`, `caretakerFormOf`, `shownHonorificOf`, `TIER_MANDATORY_ROLES`, `poolMap.js`, the two test oracles) one home.
- Where a word is both a house honorific and an office, the office wins: the F10 rule, keyed on `officeWordInfo`.
