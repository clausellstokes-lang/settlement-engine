# TITLES-2: HAND-BACK (written 2026-11-20 07:19 UTC, amended 2026-11-20 07:28 UTC on the chair's rulings and 2026-11-20 08:05 UTC on its second rulings; branch `lane/titles-2-2026-11-20`, cut at `0fb18a574`)

This is the second pass on the office titles. It fills the commonest fallback cells with words read in a named source.

**Files changed (only these):**
- `src/data/cultureOfficeTitles.js`: the cells, plus one header paragraph.
- `tests/data/cultureOfficeTitles.test.js`: one new describe block of 2 tests, pinning every new cell.
- this hand-back.

**The interface does not change.** `officeTitleOf`, `officeTitleIn`, `officeFamilyOfForm`, `officeWordInfo` and `crimeBossesHeading` are byte-identical. Every new word reaches SEAT-1 through `officeWordInfo` with its full row (family, sovereign or not, sex), derived from the table as before.

**Search:** WebSearch worked all session. Every word below was read in the source named beside it, in this session. No cell rests on memory alone.

**The chair's rulings on the first twelve (received 07:27 UTC) are applied:**
- Otona is struck. The three cells, east_asian elders at thorp to village, fall back to "Elder".
- Ra'is is kept for two families, with the reason given in §1.
- A say-it hint is added for each hard word (§1a).
- Each source is recorded as the page read plus the named work it rests on.

## 1. The cells added: 71 cells, 23 words, 22 rows

**Counts:**

| | before (TITLES-1) | now |
|---|---|---|
| culture cells authored | 174 | **245** (+71) |
| left to the fallback | 552 | **481** (of 726; the faith row's 66 included) |
| `CULTURE_OFFICE_WORDS` rows | 106 | **132** |
| flagged words in the table | — | **0** (Otona was flagged, then struck by the chair) |
| unsure cells still on the fallback | listed in §3 | |

These counts were rendered by a script from the data file. The same script, run on `0fb18a574`'s file, gives TITLES-1's own 174, 552 and 106, which proves the renderer.

**How to read each row:** the size range, then the word, then a three-word gloss, then what the office was (where and when), then the source read this session.

**Priority 1: the council's first**
- **arabic council, town to metropolis: Ra'is**, "head of the notables".
  - The office: the urban leader of the notables in tenth- to twelfth-century Aleppo and Syria (ra'is al-balad, the town head).
  - Sources: Wikipedia "Rais", citing the Encyclopaedia of Islam, 2nd ed., "Raʾīs"; the Toyo Bunko Memoirs 57 article on Syrian local society; the 2025 *Historical Research* article on the ra'is of Aleppo.
  - **Ra'is is one word shared by two families (the chair's ruling).** TITLES-1 put it in the headman row at town and up; it is now in the council row at the same sizes.
    - **Why the sources support both rows.** The works cited show the ra'is as a town's head; they also show him as the leader of its notables (Aleppo, 10th to 12th centuries); in Crusader-era Syria the same word named a village or community head with jurisdiction. A town's ra'is spoke for, and led, the body of its notables. One town has one form of government, so a DM never meets both rows in one place.
    - **The alternatives.** I found no distinct sourced word for the first of a council of notables. Sheikh is excluded because the elders and the sovereign already use it.
- **slavic council, town to metropolis: Golova**, "the city's head".
  - The office: the *gorodskoy golova*, elected head of the city duma and of the town council it presided over, under Catherine II's Charter to the Towns (1785) and the city statutes of 1870.
  - Sources: Wikipedia "City duma"; Britannica "Charters to the Nobility and the Towns".
- **east_asian council: Toshiyori at town and city, Tairo at metropolis.** One tongue, Japanese.
  - Toshiyori, "the town elder": Edo's *machi-doshiyori* were the highest townsmen in the city's administration, under the machi-bugyō and over the nanushi. Sources: Samurai Archives "Machidoshiyori"; Wikipedia "Edo machi-bugyō".
  - Tairo, "the great elder": the Tokugawa *tairō*, senior to the rōjū council, presiding over it in an emergency. Sources: Wikipedia "Tairō"; Britannica "tairo".
- **steppe council, town to metropolis: Biy**, "the elected judge-elder".
  - The office: the Kazakh khanate's biys sat in the Council of biys, the highest council. The office was not inherited and was abolished in 1891.
  - Sources: Wikipedia "Biy"; e-history.kz on Tole bi.
- **Not filled:** mesoamerican, germanic below town and latin below town (see §3).

**Priority 2: the elders' first**
- **steppe elders, every size: Biy** (as above: the biys were the judge-elders).
- **east_asian elders: Toshiyori at town and up.** Otona at thorp to village was flagged and is STRUCK by the chair, so those three cells read "Elder". The source for Otona was:
  - Otona, "the village elders": the leaders of the self-governing *sō* villages of the 14th to 16th centuries. In Suganoura in the 15th century they were twenty elders chosen from the households. Sources: Japanese Wiki Corpus "Soson"; Tanaka (1995) and Nishiki (1994) via J-STAGE.
- **south_asian elders, thorp to town: Sarpanch**, "head of the panchayat".
  - The office: the panchayat was traditionally a council of respected elders, and its leader was called sarpanch, mukhiya or pradhan.
  - Sources: Wikipedia "Panchayati raj"; the INFLIBNET e-text "Functioning of Local Panchayats".
  - Sarpanch already serves the council row at village and town.

**Priority 3: the merchant and guild seats**
- **germanic guild, town to metropolis: Zunftmeister**, "the guild's master".
  - The office: the elected head of a craft guild (*Zunft*) in German-speaking towns, elected yearly with assessors. In Basel and Nördlingen the Zunftmeister also sat on the town council.
  - Sources: Historisches Lexikon der Schweiz, "Zunftmeister"; Stadtarchiv Ulm, "Zunftwesen".
- **south_asian guild, town to metropolis: Jetthaka**, "the craft guild's chief".
  - The office: *jyeṣṭhaka*, the chief of an artisans' shreni, as distinct from the shreshthi of a merchants' guild.
  - Sources: Wikipedia "Shreni"; Shah and Agrawal, "Sreni (Guilds)", Infinity Foundation Mandala.
- **slavic merchant, town to metropolis: Gost**, "first of the great merchants" (the chair's second ruling: KEPT, see §3 on Tysyatsky).
  - The office: Muscovy's *gosti* (about thirty in the 17th century) stood at the top of the merchant hierarchy and served the state for privileges. The word means "guest".
  - Source: Encyclopedia of Russian History via Encyclopedia.com, "Gosti" and "Gostinaya Sotnya".
- **Not filled:** merchant in eight cultures, guild in nine (see §3).

**Priority 4: the headman**
- **latin headman, town to metropolis: Praetor**, "the town's chief magistrate". (The chair's second ruling: it replaced Podestà, keeping latin's cells classical.)
  - The office: in classical times, the highest magistrates of the Latin towns. Rome's own consuls were at first called praetors; Festus has "the praetors, who are now consuls", and the Twelve Tables appear to give them no other title.
  - Sources: 1911 Encyclopaedia Britannica, "Praetor"; Wikipedia "Praetor", citing Festus and Livy.
  - **A caveat:** one source says the Latin communities were presided over by TWO praetors, and some by a single dictator. The word is the chief magistrate's, often one of a pair.
  - Podestà is moved to §3.
- **steppe headman, village to metropolis: Beg / Begim**, "the clan's chief".
  - The office: the Turkic title for a chief, later a lord, equal to the Arabic and Persian amir. The feminine is *begim* ("lady, princess"; Mughal *begam*).
  - Sources: Encyclopaedia Iranica, "Beg"; Wikipedia "Bey".
  - Begim is chosen over Begum because Begum reads as South Asian today.
- **east_asian headman, town to metropolis: Toshiyori** (as above: the machi-doshiyori were the townsmen's own heads over the ward nanushi). Nanushi stays at thorp to village.
- **Not filled:** mesoamerican, celtic above town and south_asian above village (see §3).

**Priority 5: the military seat**
- **germanic military, city and metropolis: Marschall**, "the army's marshal".
  - The office: from Old High German *marahscalc*, "horse-servant"; the Frankish court's master of the horse, later the military chief commander.
  - Sources: Wikipedia "Marshal"; 1911 Britannica "Marshal".
  - Below city stays open, see §3.
- **celtic military, village to metropolis: Penteulu**, "captain of the warband".
  - The office: the captain of the king's household troop, the first of the 24 court officers in the medieval Welsh lawbooks.
  - Sources: Wikipedia "Titles of the Welsh Court" and "Cyfraith Hywel"; the TRHS address "The Royal Household and the Welsh Lawbooks" (Cambridge).
- **east_asian military: Kumigashira at village, Obangashira at town to metropolis.**
  - Obangashira, "captain of the guard": the captains of the shogunate's Ōban (Great Guard, from 1586), which garrisoned Osaka and Nijō castles. The macron is dropped, as in Daimyo and Bugyo.
  - Kumigashira, "the squad's leader": the four *kumi-gashira* under each captain.
  - Sources: Wikipedia "Ōban (Great Watch)"; Japanese Wiki Corpus "Oban (the great guards)".
- **mesoamerican military, town to metropolis: Tlacateccatl**, "the army's general".
  - The office: the Aztec general in charge of the tlacatecco, the military quarter of Tenochtitlan, second in war to the tlatoani and the tlacochcalcatl. Spelled with -cc- as in the sources.
  - Sources: Wikipedia "Tlacateccatl", citing Hassig, *Aztec Warfare* (1988); the Wired Humanities Nahuatl dictionary.
- **arabic military, city and metropolis: Amir al-Juyush**, "commander of the armies".
  - The office: the Fatimid commander-in-chief's title (the army of Syria), borne from 1073–74 by Badr al-Jamali and then by the military viziers.
  - Sources: Wikipedia "Badr al-Jamali" and "Fatimid army".
  - Qaid stays at village and town.
- **norse military, city and metropolis: Stallari**, "the king's marshal".
  - The office: the marshal of the Norwegian king's hird. The first holder named is Björn stallari under St Olaf; in Heimskringla, Ulf stallari served Harald Hardrada.
  - Sources: oldnorsedictionary.com, "stallari"; Heimskringla via wisdomlib.
  - Hersir stays at village and town.

**Priority 6: the appointed ruler below the sizes written**
- **latin appointed, thorp to village: Vilicus / Vilica**, "the estate's bailiff".
  - The office: the farm manager of a Roman villa; Columella names the female *vilica*.
  - Sources: Wikipedia "Vilicus"; Carlsen, *Vilici and Roman Estate Managers* (1995), cited there.
  - A note: the holder was usually enslaved. A DM hears "bailiff". The chair may veto.
- **celtic appointed, thorp to town: Maer**, "the king's reeve".
  - The office: the king's officer in each commote in the Welsh laws, who ran the royal home farm (the maerdref) and presided over the commote court.
  - Sources: Wikipedia "Commote"; buildinghistory.org, "Medieval Landholding in Wales", citing Richards (1969).
  - He was appointed, not chosen, so the word sits in this row and not in the headman row. City and up stay on the base word, Governor.
- **slavic appointed, thorp to village: Tiun**, "the prince's steward".
  - The office: the steward of a Kievan Rus prince, later a judicial officer, named in the Russkaya Pravda.
  - Sources: Encyclopedia of Ukraine, "Court functionaries"; Štěříková, *AUC Philologica* 3 (2019).
- **The arcane seat:** no word. Every candidate I could name is a living or revived faith's word: Druid, Völva, Volkhv, Onmyoji, Magos.

**The sovereign's ladder and TITLES-1's words:** I found no word wrong, so none is changed.

## 1a. Say it: plain-letter hints for the owner (stress in capitals)

| word | say it | word | say it |
|---|---|---|---|
| Ra'is | rah-EES | Golova | guh-luh-VAH |
| Toshiyori | toh-shee-YOH-ree | Tairo | TIE-roh |
| Biy | BEE | Beg / Begim | BEG / beg-EEM |
| Sarpanch | SAR-punch | Zunftmeister | TSOONFT-my-ster |
| Jetthaka | JET-ta-ka | Gost | GOST |
| Praetor | PREE-tor | Marschall | MAR-shall |
| Penteulu | pen-TAY-lee | Kumigashira | koo-mee-gah-SHEE-rah |
| Obangashira | oh-bahn-gah-SHEE-rah | Tlacateccatl | tlah-kah-TEK-kahtl |
| Amir al-Juyush | ah-MEER al-joo-YOOSH | Stallari | STAHL-lah-ree |
| Vilicus / Vilica | VIL-ih-kus / VIL-ih-ka | Maer | MIRE |
| Tiun | tee-OON | | |

These hints are from the words' usual English renderings. They are not drawn from the sources and are not executed: they are a reading aid.

**Sources: the page and the work it rests on.** Where a page names the work it rests on, both appear in §1, as they do for Ra'is, Tlacateccatl, Zunftmeister, Vilicus and Maer. For Biy, Gost, Tairo, Obangashira, Kumigashira, Stallari, Penteulu, Tiun, Praetor (and the works it cites), Marschall, Amir al-Juyush, Golova, Beg and Jetthaka, the page read IS the reference work, or names none beyond itself. The pages are Wikipedia, Britannica, Encyclopedia of Ukraine, Iranica, and the Old Norse dictionary entry with its Heimskringla citations.

**Where sources disagreed.** They disagreed only on details, never on what the office was. On the machi-doshiyori, they disagreed on whether the holders were chosen or hereditary. On the tiun, they disagreed on his blood-price. On the date of Badr al-Jamali's rise, they disagreed by a year. So no cell was moved to the fallback on that ground.

## 2. Flagged, and notes for the chair

**FLAGGED:**
- **Otona: STRUCK by the chair (07:27 UTC).** It began as a shrine-parish (*miyaza*) representative, which touches a living faith, and "Elder" may stand. No flagged word remains in the table.

**Notes (not sacred, no action needed):**
- **Toshiyori** is also today's title of a sumo elder.
- **Gost** means "guest" today.
- **Amir al-Juyush** shares *amir* with the caliph's *Amir al-Mu'minin*, but it is the army's title and none of the faith's.
- **Sarpanch**: the word is the traditional one, and the office today is the elected head of a gram panchayat (since 1959).

**What SEAT-1 sees:**
- Every new word classes as `other` under `roleToCategory`, `classOfRole` and `holdsOffice`. This was measured in node.
- None is in `civilityLists.js`.
- None is sovereign or a crown word.
- Two name a sex:
  - **Vilica** is female; `officeWordInfo` gives `sex: 'female'`.
  - **Begim** is female; `officeWordInfo` gives `sex: 'female'`.
- Ra'is, Toshiyori, Biy and Sarpanch now sit in two or three families each. `officeWordInfo` returns all of them, sorted.
- **For the security lane:** every new word is plain ASCII (Podestà, the one accented word, was replaced by Praetor).

## 3. UNSURE: left to the fallback, with what would settle each

TITLES-1's §5 list stands except for the cells filled above.

**mesoamerican:**
- **headman:** the calpulli head's title (calpolec, calpoleh, capolehqueh) has no spelling I could confirm. Karttunen's *Analytical Dictionary of Nahuatl* would settle it.
- **merchant:** *pochtecatlatoque* ("merchant speakers") is a plural; its singular is unconfirmed. Sahagún's Florentine Codex, Book 9 (Anderson and Dibble) would settle it.
- **elders:** *calpulhuehuetque* are "elders of the temple", so not used. *Huehuetque* is a plural.
- **council:** no first-of-council title found (Cihuacoatl stays out).
- **military at village:** *tiachcauh* is unconfirmed as a title.

**greek:**
- **guild and merchant:** *prostates* and *proestos* were not found in any source as the head of a Book of the Eparch guild. Koder's edition or the ODB would settle it.

**arabic:**
- **guild:** *ʿarīf* and *amīn* were not confirmed as the head of a Mamluk craft. Behrens-Abouseif or Petry would settle it. *Amīn* would also be flagged: al-Amīn is an epithet of the Prophet.

**east_asian:**
- **merchant and guild:** *gyōji* and *nengyōji* were not confirmed as the head of a kabunakama. Sakai's *egōshū* is a body, not a title.

**steppe:**
- **merchant:** *ortoq* means a merchant partner of the state, not the first of the merchants.
- **guild and assembly:** no word.
- **headman at thorp and hamlet:** *aqsaqal* names a man and has no known female form.

**slavic:**
- **guild:** *starshina* of a tsekh was not confirmed; one source says only "an elder". Pazhitnov (1952) would settle it.

**germanic:**
- **council below town:** *Heimbürge* is found only as a dictionary citation (Buchda, in the HRG).
- **military below city:** Hauptmann's female form.

**celtic:**
- **headman at city and up:** *maer* is the king's appointee, so it went to the appointed row instead.
- **assembly, elders, merchant, guild:** no word.

**south_asian:**
- **headman above village:** every candidate is a common surname today (Patel, Chaudhuri, Pradhan, Deshmukh) or a police office (Kotwal).

**latin:**
- **headman, town and up: Podestà** (the chair's second ruling). It is sourced (Britannica "podesta"; Wikipedia "Podestà": the single chief magistrate of the Italian communes, from the late 12th century through the 13th). It is listed here because it is later Latin, medieval Italian, beside the table's classical words. Praetor holds the cells.

**slavic, merchant: Tysyatsky** (the chair's second ruling, one search).
- What the sources say:
  - the merchant court of Novgorod included the tysyatsky and two representatives of the merchants (Wikipedia "Ivan's Hundred"; "Foreign trade of medieval Novgorod");
  - the tysyatsky's own court "probably" served as a commercial court (Encyclopedia.com, "Novgorod Judicial Charter");
  - the office was elected from the boyars, and began as the militia's captain.
- Why it is not used: no source says he presided, and his tie is to a court, not to the merchants' own seat. Gost stays.

- **council and headman below town, merchant, guild:** as in TITLES-1 (*magister* collides with the arcane classifier). Medieval *consules mercatorum* is a four-word phrase that I did not confirm per city.

**norse:**
- **merchant, guild, elders, and appointed below city:** as in TITLES-1.

**every culture:**
- **faith:** not mine (the chair's rule).
- **the criminal side:** final, by size only.

## 4. THE FULL TABLE, AS PLAIN TEXT, FOR THE OWNER

A `·` means the cell falls back.
- For the nine families with a title today, it shows today's title by the government's name. TITLES-1-HANDBACK §4 holds the legend: Mayor, Lord Mayor, Elder, Burgomaster, Doge, Alderman, Captain of the Muster and the rest.
- For the four families with none, the base word is shown in brackets.

The table is generated from the data file by a script.

```
            THORP                   HAMLET                  VILLAGE                 TOWN                    CITY                    METROPOLIS
BASE (the four families with no title today; any culture without its own word)
 sovereign  Chieftain               Chieftain               Chieftain               Lord / Lady             King / Queen            Emperor / Empress
 appointed  Steward                 Steward                 Steward                 Governor                Governor                Governor
 underboss  Ringleader              Ringleader              Underboss               Underboss               Underboss               Underboss
 crime_boss Crime Boss              Crime Boss              Crime Boss              Crime Boss              Crime Boss              Crime Boss
GERMANIC
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Graf / Gräfin           König / Königin         Kaiser / Kaiserin
 appointed  Vogt                    Vogt                    Vogt                    Vogt                    Landvogt                Statthalter
 headman    ·                       ·                       Schultheiss             Burgomaster             Burgomaster             Burgomaster
 council    ·                       ·                       ·                       Burgomaster             Burgomaster             Burgomaster
 assembly   ·                       ·                       ·                       ·                       ·                       ·
 elders     ·                       ·                       ·                       ·                       ·                       ·
 merchant   ·                       ·                       ·                       ·                       ·                       ·
 guild      ·                       ·                       ·                       Zunftmeister            Zunftmeister            Zunftmeister
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       ·                       ·                       Marschall               Marschall
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
LATIN
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Princeps                Rex / Regina            Imperator / Imperatrix
 appointed  Vilicus / Vilica        Vilicus / Vilica        Vilicus / Vilica        Procurator              Legate                  Proconsul
 headman    ·                       ·                       ·                       Praetor                 Praetor                 Praetor
 council    ·                       ·                       ·                       Consul                  Consul                  First Consul
 assembly   ·                       ·                       ·                       Tribune of the People   Tribune of the People   Tribune of the People
 elders     ·                       ·                       ·                       ·                       ·                       ·
 merchant   ·                       ·                       ·                       ·                       ·                       ·
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       Decurion                Centurion               Dux                     Dux
 arcane     ·                       ·                       Magister                Magister                Archmagister            Archmagister
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
CELTIC
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Chieftain               King / Queen            High King / High Queen
 appointed  Maer                    Maer                    Maer                    Maer                    ·(Governor)             ·(Governor)
 headman    ·                       ·                       Chieftain               Chieftain               ·                       ·
 council    ·                       ·                       ·                       Vergobret               Vergobret               Vergobret
 assembly   ·                       ·                       ·                       ·                       ·                       ·
 elders     ·                       ·                       ·                       ·                       ·                       ·
 merchant   ·                       ·                       ·                       ·                       ·                       ·
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       Penteulu                Penteulu                Penteulu                Penteulu
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
ARABIC
 sovereign  ·(Chieftain)            ·(Chieftain)            Sheikh / Sheikha        Sheikh / Sheikha        Emir / Emira            Sultan / Sultana
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              ·(Governor)             Wali                    Wali
 headman    Mukhtar                 Mukhtar                 Mukhtar                 Ra'is                   Ra'is                   Ra'is
 council    ·                       ·                       ·                       Ra'is                   Ra'is                   Ra'is
 assembly   ·                       ·                       ·                       ·                       ·                       ·
 elders     Sheikh / Sheikha        Sheikh / Sheikha        Sheikh / Sheikha        Sheikh / Sheikha        Sheikh / Sheikha        Sheikh / Sheikha
 merchant   ·                       ·                       ·                       Shahbandar              Shahbandar              Shahbandar
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       Qaid                    Qaid                    Amir al-Juyush          Amir al-Juyush
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
NORSE
 sovereign  ·(Chieftain)            ·(Chieftain)            Jarl                    Jarl                    King / Queen            High King / High Queen
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              ·(Governor)             Jarl                    Jarl
 headman    ·                       ·                       Jarl                    Jarl                    Jarl                    Jarl
 council    ·                       ·                       Lawspeaker              Lawspeaker              Lawspeaker              Lawspeaker
 assembly   ·                       ·                       Lawspeaker              Lawspeaker              Lawspeaker              Lawspeaker
 elders     ·                       ·                       ·                       ·                       ·                       ·
 merchant   ·                       ·                       ·                       ·                       ·                       ·
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       Hersir                  Hersir                  Stallari                Stallari
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
SLAVIC
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Knyaz / Knyaginya       Grand Knyaz / Grand Knyaginya Tsar / Tsaritsa
 appointed  Tiun                    Tiun                    Tiun                    Namestnik               Namestnik               Namestnik
 headman    Starosta                Starosta                Starosta                Posadnik                Posadnik                Posadnik
 council    ·                       ·                       ·                       Golova                  Golova                  Golova
 assembly   ·                       ·                       ·                       ·                       ·                       ·
 elders     Starosta                Starosta                Starosta                Starosta                Starosta                Starosta
 merchant   ·                       ·                       ·                       Gost                    Gost                    Gost
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       Voivode                 Voivode                 Voivode                 Voivode
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
EAST_ASIAN
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Daimyo                  Daimyo                  ·(Emperor / Empress)
 appointed  ·(Steward)              ·(Steward)              Daikan                  Bugyo                   Bugyo                   Bugyo
 headman    Nanushi                 Nanushi                 Nanushi                 Toshiyori               Toshiyori               Toshiyori
 council    ·                       ·                       ·                       Toshiyori               Toshiyori               Tairo
 assembly   ·                       ·                       ·                       ·                       ·                       ·
 elders     ·                       ·                       ·                       Toshiyori               Toshiyori               Toshiyori
 merchant   ·                       ·                       ·                       ·                       ·                       ·
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       Kumigashira             Obangashira             Obangashira             Obangashira
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
MESOAMERICAN
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Tlatoani                Tlatoani                Huey Tlatoani
 appointed  ·(Steward)              ·(Steward)              Calpixqui               Calpixqui               Calpixqui               Calpixqui
 headman    ·                       ·                       ·                       ·                       ·                       ·
 council    ·                       ·                       ·                       ·                       ·                       ·
 assembly   ·                       ·                       ·                       ·                       ·                       ·
 elders     ·                       ·                       ·                       ·                       ·                       ·
 merchant   ·                       ·                       ·                       ·                       ·                       ·
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       ·                       Tlacateccatl            Tlacateccatl            Tlacateccatl
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
SOUTH_ASIAN
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Raja / Rani             Maharaja / Maharani     Samrat / Samrajni
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              Faujdar                 Subahdar                Subahdar
 headman    Mukhiya                 Mukhiya                 Mukhiya                 ·                       ·                       ·
 council    ·                       ·                       Sarpanch                Sarpanch                ·                       ·
 assembly   ·                       ·                       Sabhapati               Sabhapati               Sabhapati               Sabhapati
 elders     Sarpanch                Sarpanch                Sarpanch                Sarpanch                ·                       ·
 merchant   ·                       ·                       ·                       Nagarsheth              Nagarsheth              Nagarsheth
 guild      ·                       ·                       ·                       Jetthaka                Jetthaka                Jetthaka
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       ·                       Senapati                Senapati                Senapati
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
STEPPE
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Khan / Khatun           Khan / Khatun           Khagan / Khatun
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              Darughachi              Darughachi              Darughachi
 headman    ·                       ·                       Beg / Begim             Beg / Begim             Beg / Begim             Beg / Begim
 council    ·                       ·                       ·                       Biy                     Biy                     Biy
 assembly   ·                       ·                       ·                       ·                       ·                       ·
 elders     Biy                     Biy                     Biy                     Biy                     Biy                     Biy
 merchant   ·                       ·                       ·                       ·                       ·                       ·
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       Noyan                   Noyan                   Noyan                   Noyan
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
GREEK
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Basileus / Basilissa    Basileus / Basilissa    ·(Emperor / Empress)
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              Harmost                 Harmost                 Harmost
 headman    ·                       ·                       Demarch                 Demarch                 Demarch                 Demarch
 council    ·                       ·                       ·                       Archon                  Archon                  Archon
 assembly   ·                       ·                       ·                       Epistates               Epistates               Epistates
 elders     ·                       ·                       ·                       ·                       ·                       ·
 merchant   ·                       ·                       ·                       ·                       ·                       ·
 guild      ·                       ·                       ·                       ·                       ·                       ·
 faith      ·                       ·                       ·                       ·                       ·                       ·
 military   ·                       ·                       ·                       Polemarch               Polemarch               Polemarch
 arcane     ·                       ·                       ·                       ·                       ·                       ·
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"

COUNTS: authored culture cells 245; culture cells left to the fallback 481 (of 726); base cells 24; CULTURE_OFFICE_WORDS rows 132
```

## 5. Red and green, with counts

All runs were on this branch, with none of GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment. Each was read through `scripts/gate-tail.sh`.

**The suite** (`tests/data/cultureOfficeTitles.test.js`): **19/19 green**, which is TITLES-1's 17 plus TITLES-2's 2.

**The plants.** Each was planted in the data file and run verbosely. The file was restored byte for byte after each (`cmp`).

| plant | red | which tests went red |
|---|---|---|
| `'King'` in slavic `council` at city (a TITLES-2 cell) | **4/19** | CT3's crown-row arm · CT4's sex arm · the officeWordInfo arm · TITLES-2's pinned rows |
| the fallback `?? todayOfficeTitle(...)` replaced by `?? 'Elder'` | **3/19** | CT1's byte-for-byte arm against `officeTitleFor` · CT1's null arm · TITLES-2's open-size arm |
| `'Imam'` in base `crime_boss` at metropolis | **2/19** | CT4's sacred arm · the criminal ladder |
| (a fourth, for this pass) `'Bey'` for `'Biy'` in steppe `elders` at city | **1/19** | TITLES-2's pinned rows |

**The neighbours:** `tests/data` whole: **83 files, 594/594 green**.

**`tests/lint` whole, first run** (at the content of `341e87336`, before it was committed): 219 files. **1 red, mine:** the lighting census.
- The walker measured TEST titles 31188 → 31190.
- It was re-measured by `LIGHTING_CENSUS_REFREEZE` on the clean tree at `341e87336`: titles +2 and suiteTitles +1, exactly this pass's two tests and one describe block. That is commit `ec74bf071`, which touches only the register, as TITLES-1's `8585ba7d4` did.
- The walker re-run plainly afterwards is green, **34/34**.

**`tests/lint` whole at this hand-back's commit:** the count is in the closing message ("TITLES-2 <commit>"). It is run on that commit.

**The other gates** (at `341e87336`'s content):
- `npm run typecheck:ratchet`: exit 0 (167, ceiling 167).
- `npm run typecheck:domain:strict`: exit 0 (1113, ceiling 1113).
- `npm run lint`: exit 0, 0 errors. The 38 warnings are all elsewhere; eslint on my two files alone is clean.

**Commits:**
- `341e87336`: the cells and the tests.
- `ec74bf071`: the census.
- `ce8afed84`: this hand-back.
- The next commit: the chair's rulings. Otona struck in the data file and its pin; this file amended.

## 6. Executed versus plausible

**EXECUTED:**
- every count in §1 and §5;
- the four plants and their restores;
- every gate in §5;
- the classifier measure: `roleToCategory`, `classOfRole` and `holdsOffice` over all 24 words (Otona since struck), run in node;
- the civility grep;
- the renderer's proof against TITLES-1's own counts;
- each source was read this session, by WebSearch: the result pages' summaries and their named works.

**PLAUSIBLE (my judgment, not executed):**
- that each word is right for its culture's fantasy register and its size. In particular:
  - Toshiyori as the headman and the council's first at town size and up;
  - Gost as the first of a merchant seat (it was a rank, not a chair);
  - Beg at a city;
  - Tairo at a metropolis.
- that the summaries quoted the works they named. I read no primary text, such as Sahagún, the Book of the Eparch or the lawbooks, directly.

Each cell is the owner's to veto. A struck cell falls back to today's title, and the fallback is pinned.

Written 2026-11-20 07:23 UTC.

**Re-run after the chair's rulings, on the amended table:**
- the suite is 19/19 green;
- the plants again, each restored by `cmp`:
  - crown word in a council cell: **4/19** red;
  - a fallback that is not today's: **3/19** red;
  - Imam in a criminal cell: **2/19** red;
  - **Otona planted back** at east_asian elders, thorp: **1/19** red. The strike is pinned.

**Re-run after the chair's second rulings (2026-11-20 08:05 UTC, code at `c81c11065`):**
- the suite is 19/19 green;
- the plants, each restored by `cmp`:
  - crown word in a council cell: 4/19 red;
  - a fallback that is not today's: 3/19 red;
  - Imam in a criminal cell: 2/19 red;
  - Podestà planted back at latin headman, city: 2/19 red (the pinned rows, and its officeWordInfo pin);
- `tests/data`: 594/594 green.

No test title moved (the two TITLES-2 tests keep their titles), so the census was not re-taken. `tests/lint` whole at this commit: see the closing message.
