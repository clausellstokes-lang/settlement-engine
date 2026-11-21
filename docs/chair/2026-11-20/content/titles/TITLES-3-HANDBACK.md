# TITLES-3: HAND-BACK (written 2026-11-20 08:40 UTC; branch `lane/titles-3-2026-11-20`, cut from `origin/lane/titles-2-2026-11-20` at `da33bc58f`)

This is the third pass on the office titles. It gives the small places their culture's word for the elders and the headman where a sourced small word exists, and nothing else.

**Files changed (only these):**
- `src/data/cultureOfficeTitles.js`: 5 rows changed or added (14 cells), plus one header paragraph.
- `tests/data/cultureOfficeTitles.test.js`: one new describe block of 2 tests. It pins every new cell and every target cell left on the fallback.
- `tests/lint/__lighting_census__.json`: two test titles added (see §5).
- this hand-back.

**The interface does not change.** `officeTitleOf`, `officeTitleIn`, `officeFamilyOfForm`, `officeWordInfo` and `crimeBossesHeading` are byte-identical. Every new word reaches SEAT-1 through `officeWordInfo` with its full row.

**Search:** WebSearch worked all session. Every word below was read this session in the source named beside it, in the search results' summaries of those pages. One direct page fetch, of the UNAM calpulli volume, failed: the host is outside this session's network.

## 0. The target list (measured from `GOVERNMENT_FAMILY`, no search)

| the chair's small-place form | family |
|---|---|
| Elder Council, Free Elder Council, Household Council | elders |
| Headman's Authority, Elected Reeve, Town Mayor | headman |
| Feudal Stewardship | appointed (not mine) |
| Town Council | council |
| Guild Council, Merchant oligarchy | guild, merchant (not mine) |

**Item (3) is empty.** "Household Council" falls in the elders family and "Elected Reeve" in the headman family. Both are therefore covered by items (1) and (2).

**The target is 40 cells:**
1. **elders, thorp to town, in six cultures** (germanic, latin, celtic, norse, greek, mesoamerican): 24 cells, all empty at the base.
2. **headman where empty** (germanic, norse, greek and celtic at thorp and hamlet; latin at thorp to village; mesoamerican at thorp to town): 15 cells.
3. **council at town, mesoamerican:** 1 cell.

**Filled: 14 cells. Left on the fallback: 26** (§3, each with what would settle it). The tests pin all 40 cells: the 14 as their words, the 26 as null (today's title).

## 1. The cells added: 14 cells, 6 words, 5 rows

**Counts** (rendered from the data file; TITLES-2's 245, 481 and 132 plus this pass's 14 and 6):

| | before (TITLES-2) | now |
|---|---|---|
| culture cells authored | 245 | **259** (+14) |
| left to the fallback | 481 | **467** (of 726) |
| `CULTURE_OFFICE_WORDS` rows | 132 | **138** (+6) |

**How to read each row:** the size range, then the word, then a three-word gloss and a say-it hint, then what the office was, then the source read this session.

**germanic headman, thorp and hamlet: Bauermeister**, "the village's head" (BOW-er-my-ster). Schultheiss stays at village.
- The office: a medieval name for the head of a German village, who ran its administration and its court. It stands beside Schultheiß, Heimbürge and Richter; Richter became the general word only in the early modern period.
- Sources:
  - dewiki "Dorfgericht": "Den Dorfvorsteher nannte man Schultheiß, Bauermeister, Heimbürge oder Richter".
  - *Vorträge und Forschungen* (Konstanzer Arbeitskreis, Heidelberg journals) on the medieval village community: "der Bauermeister, der dem Dorfe vorsteht", with the administration and justice he exercised.
  - A Saxony-Anhalt archive file, "Wahl und Verpflichtung der Bauermeister und Vorsteher, 1735–1826", showing that the office was elected.
- Why it is a small word: the holder headed one village.

**greek headman, thorp and hamlet: Komarch**, "the village's chief" (KOH-mark). Demarch stays at village.
- The office: *kōmarchēs*, the head of a *kōmē* (a village). In Xenophon's *Anabasis* the Ten Thousand quarter in Armenian villages and deal with each village's komarch. Xenophon dines with one and returns another to his household; the komarch answers for the village's tribute of horses.
- Sources:
  - Perseus lexicon, κώμαρχος (lemma 48841), with about eleven uses in the *Anabasis*.
  - The Suda, via the Suda On Line, entry kappa 2253 (Anabasis 4.5.10 and 4.5.24).
  - The Perseus/Perseids text of *Anabasis* 4.5.
- Register: classical (4th century BC), as are Demarch and Archon. It ends in "-arch" like Demarch, Polemarch and Archon, so it is a single word that fits any holder.

**celtic headman, thorp and hamlet: Pencenedl**, "head of the kindred" (pen-KEN-ed-ul). Chieftain stays at village and town. **KEPT by the chair** (2026-11-20, ruling on my first message).
- The office: in the medieval Welsh laws, the head of a kindred (*pen* "head" + *cenedl* "kindred"), the kin group that paid and received compensation and held the kindred's hereditary land.
- Sources:
  - Wiktionary "pencenedl" ("head of a kindred (in the Welsh laws)").
  - T. P. Ellis, *Welsh Tribal Law and Custom in the Middle Ages* (McMaster text).
  - F. Seebohm, *The Tribal System in Wales* (1895, archive.org).
  - Britannica, "Welsh law".
- **Note** (the chair kept the word and put the modern sense here, not in the gloss):
  - Modern Welsh *cenedl* means "nation", so a Welsh speaker may hear "head of the nation". In the laws it is the kindred, which is not a people.
  - One older critique doubts several of the Triads' kin officers, but not the pencenedl. It is quoted on a blog and is undated.
  - Strike it and these two cells read "Headman".

**mesoamerican headman, thorp to town: Calpullec**, "the calpulli's head" (kal-POOL-lek). City and metropolis stay on today's title.
- The office: the head of a *calpulli* (a ward, or a village of related households). Zorita writes that its commoners always had a head and would not be without one, and that he had to be one of their own, not from another calpulli or a stranger. He held office for life, and on his death the members chose the most honoured and able man of his kin.
- Sources:
  - A *Past and Present* article (latinamericanstudies.org, "aztec society"): "Its headman was the calpullec who was elected by the totality of the members, but had always to be chosen from the same family."
  - The UNAM (Instituto de Investigaciones Históricas) calpulli volume, quoting Zorita's *Breve y sumaria relación*. I read only the search summary of that PDF; the direct fetch failed.
  - Wikipedia "Aztec society": "ruled by a local chief (calpuleh)".
- **This settles TITLES-2's open item.** The spelling is Zorita's *calpullec*, which is the form scholars quote. Classical Nahuatl writes *calpoleh*. The plural is not used.
- Why it is a small word: a calpulli was a subdivision of an altepetl, so its head ruled neither a city nor a people. Above town the place's head is a lord, and the cell stays open.

**mesoamerican elders, thorp to town: Huehue / Ilama**, "the old man" and "the old woman" (WAY-way / ee-LAH-mah). City and metropolis stay on today's title.
- The office: *huehue*, an old man, an elder. Its plural *huehuetque* means "the elders" in Nahuatl wills, sales and acts of possession, where it stands beside or instead of the ward's people (*tlaxilacalque*). A Cuauhtinchan ordinance of 1559 glosses *vevetque* as those of sixty years or more. The female is *ilama*, an old woman; the plural *ilamatque* is paired with *huehuetque* in Sahagún ("in vevetque, in jlamatque").
- Sources:
  - The Wired Humanities Nahuatl dictionary, "huehue" (Molina 1571, "viejo o anciano") and "ilamatl" (Molina, "vieja"; "an elder woman").
  - Wiktionary "huehueh" and "ilama", citing Karttunen (1992) and Lockhart.
  - kaikki.org, "huehueh".
- **Two forms, because the word names a sex** (CT4). TITLES-2 had refused *aqsaqal* for want of a female form; here both forms are attested.
- **This settles TITLES-2's item "Huehuetque is a plural".** The singular is used.
- **For SEAT-1:** "Huehue" is already the Mesoamerican word for `master` in `src/data/namingData.js` (its culture title list, a separate table). `officeWordInfo('Huehue')` now returns the elders family, so a census that matches an office by its word will read a "Huehue" master as an elder.

**Say it:**

| word | say it | word | say it |
|---|---|---|---|
| Bauermeister | BOW-er-my-ster | Komarch | KOH-mark |
| Pencenedl | pen-KEN-ed-ul | Calpullec | kal-POOL-lek |
| Huehue / Ilama | WAY-way / ee-LAH-mah | | |

These hints are from the words' usual English renderings. They are a reading aid and are not executed.

## 2. What SEAT-1 sees

**The classifier check, on every word (the chair's order).** All 127 distinct words the table writes, from all three passes, were run through `roleToCategory`, `classOfRole` and `holdsOffice` in node. Geron and Graia were added to the run. The results:
- 120 words read `other / other / false`, including all six of this pass.
- Lord reads `noble / office / true`, and Lady reads `noble / other / false`.
- Chieftain reads `other / other / true`.
- Steward reads `government / other / false`, and Governor reads `government / office / true`.
- Magister reads `magic / other / true`, and Archmagister reads `magic / arcane / false`. Both sit in latin's ARCANE row, where `magic` is right.

**No word in the table is misclassed.** The two words this pass weighed and dropped for the classifier, Magister Vici and Magister Pagi, are in §3.


- All six new words class as `other` under `roleToCategory`, `classOfRole` and `holdsOffice` (measured in node).
- None is sovereign or a crown word. None is in the CROWN or SACRED patterns of the tests.
- **Ilama** is female and **Huehue** male (`officeWordInfo` gives each its sex). The other four are single words that fit any holder.
- Each new word sits in one family alone: elders for Huehue and Ilama, headman for the rest.
- **For the security lane:** all six are plain ASCII.
- **The collision measured:** the only other use of any of the six in `src` is "Huehue" in `namingData.js` (see §1).

## 3. Left on the fallback (26 cells), with what would settle each

**Correction to my first message to the chair:** I offered **Geron** for greek elders. It is NOT used.
- Geron means "old man", and it has no female form for the office (the gerousia was men only). It therefore fails CT4 on the same ground as TITLES-2's *aqsaqal*.
- The Spartan gerontes also sat on a city's governing council, which breaks the small-word rule.
- *Graia* (γραῖα, "old woman") is a plain word and was never an office, so a Geron / Graia pair would invent a title.
- Planting it back is pinned red (§5).
- **The chair's ruling (2026-11-20, 08:55 UTC):** the chair had first ruled Geron kept. It withdrew that ruling on this ground, which is the one on which aqsaqal was refused, and chose (c): the greek elders stay on "Elder".

**greek elders, thorp to town (4): "Elder" stands.**
- *Geron*: above.
- *Protogeros* ("first elder") is the Byzantine village head. It is a later register than the table's classical words (the chair's Podestà ruling). Settled by: a ruling that greek may take Byzantine words, plus the *Oxford Dictionary of Byzantium*'s entry.

**germanic elders, thorp to town (4): "Elder" stands.**
- No sourced medieval title for the first of a village's elders was found ("Dorfältester" is not attested as an office in what I read).
- *Altermann/Oldermann* was the head of a Hanse guild or Kontor, which is a merchant word.
- Settled by: K. S. Bader, *Studien zur Rechtsgeschichte des mittelalterlichen Dorfes*, vol. 2, or the *Deutsches Rechtswörterbuch*.

**latin elders, thorp to town (4), and latin headman, thorp to village (3): "Elder" and "Headman" stand.**
- *Magister vici* and *magister pagi* (the heads of a village and of a rural district) are classical and sourced. But "Magister Vici" and "Magister Pagi" class as **`magic`** under `roleToCategory` (measured), so a village head would be read as an arcane role.
- *Pater* is a priest's title today, so it is out.
- *Paterfamilias* names a household's head, not an elder council's.
- *Senior* reads as an English adjective.
- Settled by: a ruling that the classifier may be taught "Magister Vici" (not mine: the interface and the readers do not change), or a classical title I could not find.

**celtic elders, thorp to town (4): "Elder" stands.**
- *Henadur* is attested only as modern Welsh "alderman" (Wiktionary). I found no medieval sense of "elder".
- Settled by: *Geiriadur Prifysgol Cymru*'s dated citations for *henadur*.

**norse elders, thorp to town (4), and norse headman, thorp and hamlet (2): "Elder" and "Headman" stand.**
- *Hauld* (hǫldr) is a RANK of odal-holding farmer in the Norwegian laws (Lexicon of Medieval Nordic Law; SNL "hauld"), not a place's head.
- *Bóndi* is every free farmer.
- *Hreppstjóri* is the head of an Icelandic *hreppr*. It is attested in law from Jónsbók (1281), and today it names an appointed sheriff's agent. It is also hard to say.
- I found no Viking-age word for the first of the elders.
- Settled by: a source showing a hauld or another named holder heading a settlement, such as the *Kulturhistorisk leksikon for nordisk middelalder*.

**mesoamerican council, town (1): today's title stands.**
- No first-of-council title was found. *Cihuacoatl* stays out (a goddess's name).
- *Teuctlatoani* ("leader of a calpolli") contains the sovereign word *tlatoani*.
- Settled by: Lockhart, *The Nahuas After the Conquest*, on the altepetl's council.

## 4. THE SMALL-SIZE TABLE, AS PLAIN TEXT, FOR THE OWNER (elders and headman; six sizes down, eleven cultures across)

A `·` means the cell falls back to today's title:
- elders: "Elder" ("Household Elder" for a Household Council);
- headman: "Headman", "Reeve" or "Mayor" by the government's name, and "Lord Mayor" at city and up.

**Plainly, for the owner:** norse and latin small places keep "Elder" and "Headman" at thorp and hamlet. Latin also keeps them at village, and both keep "Elder" at town. I found no office word that holds for those cells, so the English words stand. The same is true of the elders in germanic, celtic and greek (§3).

The table is rendered from the data file by a script.

```
ELDERS
            germanic       latin          celtic         arabic         norse          slavic         east_asian     mesoamerican   south_asian    steppe         greek          
 thorp      ·              ·              ·              Sheikh/Sheikha ·              Starosta       ·              Huehue/Ilama   Sarpanch       Biy            ·              
 hamlet     ·              ·              ·              Sheikh/Sheikha ·              Starosta       ·              Huehue/Ilama   Sarpanch       Biy            ·              
 village    ·              ·              ·              Sheikh/Sheikha ·              Starosta       ·              Huehue/Ilama   Sarpanch       Biy            ·              
 town       ·              ·              ·              Sheikh/Sheikha ·              Starosta       Toshiyori      Huehue/Ilama   Sarpanch       Biy            ·              
 city       ·              ·              ·              Sheikh/Sheikha ·              Starosta       Toshiyori      ·              ·              Biy            ·              
 metropolis ·              ·              ·              Sheikh/Sheikha ·              Starosta       Toshiyori      ·              ·              Biy            ·              
HEADMAN
            germanic       latin          celtic         arabic         norse          slavic         east_asian     mesoamerican   south_asian    steppe         greek          
 thorp      Bauermeister   ·              Pencenedl      Mukhtar        ·              Starosta       Nanushi        Calpullec      Mukhiya        ·              Komarch        
 hamlet     Bauermeister   ·              Pencenedl      Mukhtar        ·              Starosta       Nanushi        Calpullec      Mukhiya        ·              Komarch        
 village    Schultheiss    ·              Chieftain      Mukhtar        Jarl           Starosta       Nanushi        Calpullec      Mukhiya        Beg/Begim      Demarch        
 town       Burgomaster    Praetor        Chieftain      Ra'is          Jarl           Posadnik       Toshiyori      Calpullec      ·              Beg/Begim      Demarch        
 city       Burgomaster    Praetor        ·              Ra'is          Jarl           Posadnik       Toshiyori      ·              ·              Beg/Begim      Demarch        
 metropolis Burgomaster    Praetor        ·              Ra'is          Jarl           Posadnik       Toshiyori      ·              ·              Beg/Begim      Demarch        
COUNTS: authored culture cells 259; left to the fallback 467 (of 726); CULTURE_OFFICE_WORDS rows 138
```

## 5. Red and green, with counts

All runs were on this branch, with none of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment (checked with `env`). Each was read through `scripts/gate-tail.sh` or from its log's count lines, never through a pipe.

**The suite** (`tests/data/cultureOfficeTitles.test.js`): **21/21 green**, which is TITLES-2's 19 plus this pass's 2.

**The plants.** Each was planted in the data file and run verbosely. The file was restored byte for byte after each (`cmp`).

| plant | red | which tests went red |
|---|---|---|
| `'King'` in slavic `council` at city | **4/21** | CT3's crown-row arm · CT4's sex arm · the officeWordInfo arm · TITLES-2's pinned rows |
| the fallback `?? todayOfficeTitle(...)` replaced by `?? 'Elder'` | **4/21** | CT1's byte-for-byte arm · CT1's null arm · TITLES-2's open-size arm · TITLES-3's open-cell arm |
| `'Imam'` in base `crime_boss` at metropolis | **2/21** | CT4's sacred arm · the criminal ladder |
| `'Geron'` planted at greek `elders`, thorp | **2/21** | both TITLES-3 tests (the cell left open; Geron's null reverse read) |
| Huehue unpaired (`'Huehue'` for `pair('Huehue', 'Ilama')` at town) | **1/21** | TITLES-3's forms-by-sex test |

**The neighbours:** `tests/data` whole: **83 files, 596/596 green**.

### 5a. `tests/lint`, the census, the gates

**`tests/lint` whole, at `0e7fe71eb`** (the cells and the tests):
- 219 files: **1 red, mine, 3257/3258.** The red is the lighting census (`sovereigntyLightingContract.walker.test.js`, "THE CENSUS IS AN ASSERTION, NOT A SENTENCE"), because a test title moved.
- **The census by its own door.** I moved the hand-back aside to leave the tree clean, then ran `LIGHTING_CENSUS_REFREEZE='TITLES-3'`. It measured: files 3703 → 3703, parked 472 → 472, credited 3231 → 3231, titles 31190 → 31192, suiteTitles 8636 → 8637. That is exactly this pass's two tests and one describe block. The run failed by design, as such a run always does.
- The walker re-run plainly afterwards: **34/34 green**. The register is committed alone as `551de03a8`.

**The other gates, at `551de03a8`:**
- `npm run typecheck:ratchet`: exit 0 (167 errors, ceiling 167).
- `npm run typecheck:domain:strict`: exit 0 (1113 errors, ceiling 1113).
- `npm run lint`: exit 0 (0 errors; 38 warnings, all elsewhere). eslint on my two files alone is clean.

**`tests/lint` whole at `a2d985282`** (the hand-back's first commit): **219 files, 3258/3258 green**, exit 0. Every later commit changes only this hand-back. Recorded 2026-11-20 09:08 UTC.

**Commits:**
- `0e7fe71eb`: the cells and the tests.
- `551de03a8`: the census.
- the next commit: this hand-back.

## 6. Executed versus plausible

**EXECUTED:**
- the target list, read from `GOVERNMENT_FAMILY`;
- every count in §1 and §5, and the table in §4 (rendered from the data file);
- the five plants and their restores;
- every gate and suite in §5;
- the classifier measure over the six words and over Magister Vici and Magister Pagi (`roleToCategory`, `classOfRole`, `holdsOffice`, run in node);
- the grep of `src` for the six words;
- the searches named in §1 and §3, run by WebSearch this session.

**PLAUSIBLE (my judgment, not executed):**
- that each word suits its culture's fantasy register and its size. In particular:
  - Pencenedl at a hamlet (a kindred's head as a place's head);
  - Calpullec at a town (a calpulli could be a town-sized ward);
  - Bauermeister at a thorp (sourced for a village).
- that the search summaries quoted the works they named. I read no primary text directly (Xenophon only through the Perseus lexicon and text pages, and Zorita only as quoted by the UNAM volume and the *Past and Present* article).

Each cell is the owner's to veto. A struck cell falls back to today's title, and the fallback is pinned.

Written 2026-11-20 08:54 UTC.
