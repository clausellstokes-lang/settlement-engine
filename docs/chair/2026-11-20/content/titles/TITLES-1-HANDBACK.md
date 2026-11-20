# TITLES-1 — HAND-BACK (written 2026-11-20 06:22 UTC; branch `lane/titles-2026-11-20`, cut at `7e0c77ae2`)

Commits:
- `fce5fe802`: the proposal.
- `8fbc976d6`: the interface agreed with SEAT-1.
- `ddf458393`: the table, the resolvers, the tests and the manifest row.
- `8585ba7d4`: the lighting census, re-measured for the one test file this lane adds.
- This hand-back.

Files:
- `src/data/cultureOfficeTitles.js` (new)
- `tests/data/cultureOfficeTitles.test.js` (new)
- `scripts/mutation-coverage-manifest.json` (+1 row)
- `tests/lint/.lighting-census-baseline.json` (re-measured by the walker's own refreeze)
- this folder

No generator, reader or component was edited. `officeTitles.js` is read, never changed.

## 1. The families (the chair's rulings applied)

There are 13 office families plus the group card's heading:

- **official:** sovereign, appointed, headman, council, assembly, elders, merchant, guild, faith, military, arcane
- **criminal:** underboss, crime_boss
- **heading:** `CRIME_BOSSES_HEADING`, "Crime Bosses"

The proposal counted 14 because it took the heading as the fourteenth row. Nothing has changed since; the count is now stated correctly.

All 58 government names are mapped in `GOVERNMENT_FAMILY`; the mapping is in the proposal's §1. No name maps to `sovereign`, because SEAT-1 assigns that family from the seat's form.

**Correction to the proposal.** Nine families have a title today, not eight: headman, council, assembly, elders, merchant, guild, faith, military, arcane. Four take the base ladder: sovereign, appointed, underboss, crime_boss.

## 2. The interface (agreed with SEAT-1, session_019yED1PyQxQZi2zHJeLhhLu)

- `officeTitleOf({ family, tier, culture, sovereign, sex })` returns a string or null.
  - The `sovereign` switch is read only for `headman`. `family: 'sovereign'` reaches the same row.
  - Null means "no cell; keep today's title". It is returned only for the nine families that have a title today.
- `officeTitleIn({ family, tier, culture, government, sovereign, sex })` returns a string and is never blank. It is the chair's CT1 form: the cell, else the base ladder, else today's title.
- `todayOfficeTitle(government, tier)` is `OFFICE_TITLES[government] || CIVIC_OFFICE_BY_SIZE[tier] || 'Mayor'`, the same expression `officeTitleFor` uses.
- `officeFamilyOfForm(form)` returns the family of a government name.
- `officeWordInfo(word)` returns `{ families, sovereign, crown, sex }` or null. It covers every word this table writes, every word today's table writes, and King, Queen and Monarch. `crown` means a word whose empty seat is kept by a regent: King, Kaiserin and Sultan are crown words; Jarl is not, because a non-sovereign row also writes it.
- `CULTURE_OFFICE_WORDS` lists every word with its family, whether it is sovereign, and its sex.
- `crimeBossesHeading()` returns the group card's heading.

## 3. The table's counts

- **Culture cells authored:** 174.
- **Culture cells left to the fallback:** 552, of 726 (11 cultures × 11 official families × 6 sizes). Of those, 66 are the faith row (CT4: no culture holds one).
- **Base cells:** 24.
- **Criminal culture cells:** none (the chair's hold).
- **Distinct (word, family, sovereign, sex) rows:** `CULTURE_OFFICE_WORDS` holds 106.

### The words of the eight cultures beyond the sample, with a three-word gloss for the DM

**germanic**
- Graf / Gräfin: a sovereign count. König / Königin: king, queen. Kaiser / Kaiserin: emperor, empress.
- Vogt: the lord's bailiff. Landvogt: the regional bailiff. Statthalter: the crown's governor.
- Schultheiss: the village headman. Burgomaster: the town's master.

**celtic**
- Chieftain: the clan's head. King / Queen and High King / High Queen: from the Irish ard rí.
- Vergobret: the elected chief magistrate (the Gaulish office, from Caesar).

**slavic**
- Knyaz / Knyaginya: prince, princess. Grand Knyaz / Grand Knyaginya: grand prince, grand princess. Tsar / Tsaritsa: emperor, empress.
- Namestnik: the prince's lieutenant-governor. Starosta: the village elder. Posadnik: the elected mayor (Novgorod). Voivode: the war-leader.

**east_asian** (Japanese words only, per the chair's 2026-11-08 ruling that the culture's naming reaches Japan)
- Daimyo: the domain's lord. Daikan: the shogunate's intendant. Bugyo: the shogunate's magistrate. Nanushi: the village headman.

**mesoamerican**
- Tlatoani: the speaker-ruler. Huey Tlatoani: the great speaker. Calpixqui: the empire's tribute governor.

**south_asian**
- Raja / Rani: king, queen. Maharaja / Maharani: great king, great queen. Samrat / Samrajni: emperor, empress.
- Faujdar: the district's commander-governor. Subahdar: the province's governor.
- Mukhiya: the village headman. Sarpanch: the village council's head. Sabhapati: the assembly's chair.
- Nagarsheth: the city's chief merchant. Senapati: the army's commander.

**steppe**
- Khan / Khatun: the ruler. Khagan: the khan of khans.
- Darughachi: the khan's resident governor. Noyan: the commanding lord.

**greek**
- Basileus / Basilissa: the king (Homeric).
- Harmost: the overlord's garrison-governor. Demarch: the district's headman. Archon: the chief magistrate. Epistates: the assembly's chair. Polemarch: the war magistrate.

## 4. THE FULL TABLE, AS PLAIN TEXT, FOR THE OWNER

`·` means the cell is left to the fallback. For the nine families with a title today, the town keeps today's title, which depends on the government's NAME, not on the size; the legend at the top lists each name's word. For the four with no title today, the base word it shows is in brackets. The table is generated from the data file by a script, so it is the table, not a copy of it.

(Corrected after the first hand-back commit `4902e1229`: the first rendering annotated each `·` with the most common of today's words across the family's names, which could show "Lord Mayor" at a thorp. Today's table never writes that there.)

```
TODAY'S TITLES (what a "·" cell shows, by the government's name; a name today's table does not hold shows the size's civic title: thorp Elder, hamlet Elder, village Elder, town Mayor, city Lord Mayor, metropolis Lord Mayor)
 headman: Town Mayor = Mayor; Elected Reeve = Reeve; Headman's Authority = Headman
 council: Town Council = Mayor; City Council = Lord Mayor; Grand Council = Lord Mayor; City-State Council = First Councillor; Mixed Council = (civic title)
 assembly: Democratic assembly = Speaker of the Assembly; Commons Assembly = (civic title); Workers' Assembly = (civic title); Grand Commons Assembly = (civic title)
 elders: Elder Council = Elder; Free Elder Council = Elder; Elder Consensus = Elder; Household Council = Household Elder
 merchant: Merchant Council = Burgomaster; Merchant City Council = Lord Burgomaster; Grand Merchant Senate = Doge; Merchant oligarchy = First Magnate; Grand Merchant Oligarchy = First Magnate; Merchant Guild Council = Master of the Guilds; Grand Guild Consortium = Master of the Guilds
 guild: Guild Council = Alderman; Guild Authority = Lord Alderman; Grand Guild Council = Lord Alderman; Guildmasters' Moot = Alderman; Guildhall Council = Alderman; Grand Guild Assembly = Lord Alderman
 faith: Priestly Guidance = Elder Priest; Church Council = Warden of the Council; Ecclesiastical Council = Lord Warden; Theocratic Council = Lord Warden; High Theocratic Council = Lord Protector of the Faith
 military: Militia Command = Captain of the Muster; Military Council = Captain-Mayor; Military City Council = Lord Marshal; Grand Military Council = Lord Marshal; Garrison Command = Lord Marshal
 arcane: Circle of Adepts = First Adept; Arcane Council = Archmage of the Council; Arcane Senate = Archmage of the Senate; Grand Arcane Council = Archmage of the Council

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
 guild      ·                       ·                       ·                       ·                       ·                       ·                       
 faith      ·                       ·                       ·                       ·                       ·                       ·                       
 military   ·                       ·                       ·                       ·                       ·                       ·                       
 arcane     ·                       ·                       ·                       ·                       ·                       ·                       
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
LATIN
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Princeps                Rex / Regina            Imperator / Imperatrix  
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              Procurator              Legate                  Proconsul               
 headman    ·                       ·                       ·                       ·                       ·                       ·                       
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
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              ·(Governor)             ·(Governor)             ·(Governor)             
 headman    ·                       ·                       Chieftain               Chieftain               ·                       ·                       
 council    ·                       ·                       ·                       Vergobret               Vergobret               Vergobret               
 assembly   ·                       ·                       ·                       ·                       ·                       ·                       
 elders     ·                       ·                       ·                       ·                       ·                       ·                       
 merchant   ·                       ·                       ·                       ·                       ·                       ·                       
 guild      ·                       ·                       ·                       ·                       ·                       ·                       
 faith      ·                       ·                       ·                       ·                       ·                       ·                       
 military   ·                       ·                       ·                       ·                       ·                       ·                       
 arcane     ·                       ·                       ·                       ·                       ·                       ·                       
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
ARABIC
 sovereign  ·(Chieftain)            ·(Chieftain)            Sheikh / Sheikha        Sheikh / Sheikha        Emir / Emira            Sultan / Sultana        
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              ·(Governor)             Wali                    Wali                    
 headman    Mukhtar                 Mukhtar                 Mukhtar                 Ra'is                   Ra'is                   Ra'is                   
 council    ·                       ·                       ·                       ·                       ·                       ·                       
 assembly   ·                       ·                       ·                       ·                       ·                       ·                       
 elders     Sheikh / Sheikha        Sheikh / Sheikha        Sheikh / Sheikha        Sheikh / Sheikha        Sheikh / Sheikha        Sheikh / Sheikha        
 merchant   ·                       ·                       ·                       Shahbandar              Shahbandar              Shahbandar              
 guild      ·                       ·                       ·                       ·                       ·                       ·                       
 faith      ·                       ·                       ·                       ·                       ·                       ·                       
 military   ·                       ·                       Qaid                    Qaid                    ·                       ·                       
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
 military   ·                       ·                       Hersir                  Hersir                  ·                       ·                       
 arcane     ·                       ·                       ·                       ·                       ·                       ·                       
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
SLAVIC
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Knyaz / Knyaginya       Grand Knyaz / Grand Knyaginya Tsar / Tsaritsa         
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              Namestnik               Namestnik               Namestnik               
 headman    Starosta                Starosta                Starosta                Posadnik                Posadnik                Posadnik                
 council    ·                       ·                       ·                       ·                       ·                       ·                       
 assembly   ·                       ·                       ·                       ·                       ·                       ·                       
 elders     Starosta                Starosta                Starosta                Starosta                Starosta                Starosta                
 merchant   ·                       ·                       ·                       ·                       ·                       ·                       
 guild      ·                       ·                       ·                       ·                       ·                       ·                       
 faith      ·                       ·                       ·                       ·                       ·                       ·                       
 military   ·                       ·                       Voivode                 Voivode                 Voivode                 Voivode                 
 arcane     ·                       ·                       ·                       ·                       ·                       ·                       
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
EAST_ASIAN
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Daimyo                  Daimyo                  ·(Emperor / Empress)    
 appointed  ·(Steward)              ·(Steward)              Daikan                  Bugyo                   Bugyo                   Bugyo                   
 headman    Nanushi                 Nanushi                 Nanushi                 ·                       ·                       ·                       
 council    ·                       ·                       ·                       ·                       ·                       ·                       
 assembly   ·                       ·                       ·                       ·                       ·                       ·                       
 elders     ·                       ·                       ·                       ·                       ·                       ·                       
 merchant   ·                       ·                       ·                       ·                       ·                       ·                       
 guild      ·                       ·                       ·                       ·                       ·                       ·                       
 faith      ·                       ·                       ·                       ·                       ·                       ·                       
 military   ·                       ·                       ·                       ·                       ·                       ·                       
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
 military   ·                       ·                       ·                       ·                       ·                       ·                       
 arcane     ·                       ·                       ·                       ·                       ·                       ·                       
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
SOUTH_ASIAN
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Raja / Rani             Maharaja / Maharani     Samrat / Samrajni       
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              Faujdar                 Subahdar                Subahdar                
 headman    Mukhiya                 Mukhiya                 Mukhiya                 ·                       ·                       ·                       
 council    ·                       ·                       Sarpanch                Sarpanch                ·                       ·                       
 assembly   ·                       ·                       Sabhapati               Sabhapati               Sabhapati               Sabhapati               
 elders     ·                       ·                       ·                       ·                       ·                       ·                       
 merchant   ·                       ·                       ·                       Nagarsheth              Nagarsheth              Nagarsheth              
 guild      ·                       ·                       ·                       ·                       ·                       ·                       
 faith      ·                       ·                       ·                       ·                       ·                       ·                       
 military   ·                       ·                       ·                       Senapati                Senapati                Senapati                
 arcane     ·                       ·                       ·                       ·                       ·                       ·                       
 criminal   the BASE rows (underboss, crime_boss); heading "Crime Bosses"
STEPPE
 sovereign  ·(Chieftain)            ·(Chieftain)            ·(Chieftain)            Khan / Khatun           Khan / Khatun           Khagan / Khatun         
 appointed  ·(Steward)              ·(Steward)              ·(Steward)              Darughachi              Darughachi              Darughachi              
 headman    ·                       ·                       ·                       ·                       ·                       ·                       
 council    ·                       ·                       ·                       ·                       ·                       ·                       
 assembly   ·                       ·                       ·                       ·                       ·                       ·                       
 elders     ·                       ·                       ·                       ·                       ·                       ·                       
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

COUNTS: authored culture cells 174; culture cells left to the fallback 552 (of 726 = 11 cultures x 11 official families x 6 sizes); base cells 24
```

**THE CRIMINAL SIDE IS FINAL** (the chair, 2026-11-20, on the owner's deferral "Again I defer all decisions to you"). It varies by size only, the same in all eleven cultures: Ringleader at thorp and hamlet, Underboss above; Crime Boss for each of the three; the heading "Crime Bosses". The reason, for the record: every culture-specific word for a crime boss is a real people's organised-crime word, and it would read as a stereotype of that people.

## 5. UNSURE (left to the fallback; what would settle each)

Carried from the proposal, with the chair's decisions applied: High King, Sultana and Wali stay; Shaykh of the craft is not authored; Goði, Gyðja, Völva, Pontifex and Flamen are not authored.

- **norse:**
  - merchant and guild: I know no Norse word for the head of a fellowship (félag).
  - appointed below city: Lendmann and Ármaðr are obscure.
  - military at city size and above: Stallari is obscure.
- **latin:**
  - headman: magister pagi would read as arcane (`roleCategory.js` matches 'magister'), and duumvir means one of two.
  - merchant and guild: magister collegii has the same clash.
- **arabic:**
  - council and assembly: I know no period word for the first of a shura that I am sure of.
  - appointed below city: ʿĀmil is obscure.
- **germanic:**
  - military: Hauptmann names a man, and its female form ("Hauptfrau") reads as a joke.
  - merchant and guild: today's Burgomaster, Alderman and Doge already carry the flavour, so they are left as they are.
  - assembly and elders: no word I am sure of.
- **celtic:**
  - appointed, assembly, elders, merchant, guild, military: no word I am sure of. (Oireachtas is a modern state's name.)
  - headman at city size and above: Chieftain reads small there.
  - arcane: Druid, a revived faith.
- **slavic:**
  - council: Novgorod's posadnik already serves the headman row.
  - assembly: the veche's speaker had no settled title.
  - merchant: Tysyatsky is obscure.
  - arcane: Volkhv is used by Rodnovery, a revived faith.
- **east_asian:**
  - sovereign at metropolis: left to the base Emperor / Empress. Tennō is tied to Shinto, a living faith.
  - sovereign at city: Shogun reads as a trope, so Daimyo is used.
  - council: Tairo and Toshiyori are uncertain at town size.
  - military: Taisho and Shogun would collide with the sovereign row.
  - arcane: Onmyoji is tied to a surviving practice.
  - The culture's spread across China, Korea and Japan needs the owner's word before any Chinese or Korean word is used.
- **mesoamerican:**
  - headman: the head of a calpulli (calpullec) has an uncertain spelling.
  - elders: huehuetque is uncertain.
  - merchant: the pochteca's head title is too long to say.
  - military: Tlacochcalcatl is too hard to say.
  - council: Cihuacoatl is a goddess's name.
- **south_asian:**
  - guild: Shreshthi (the head of a shreni) has an uncertain spelling.
  - headman at town size and above: Kotwal is a police office.
  - Patel is not used: it is a common surname.
- **steppe:**
  - elders: Aqsaqal ("white-beard") names a man, and no female form is known.
  - headman, council, assembly, merchant, guild: no word I am sure of.
  - village sovereign: Bey has an uncertain female form.
- **greek:**
  - sovereign at metropolis: Autokrator has an uncertain female form, so it is left to the base Emperor / Empress.
  - Eparch and Exarch are not used: both are ecclesiastical titles today.
  - merchant: Agoranomos is a market overseer, not the merchants' first.
  - elders: the Gerousia's first had no title.
- **every culture, faith:** CT4. Today's words stand: Elder Priest, Warden of the Council, Lord Warden, Lord Protector of the Faith.

## 6. Red and green, with counts

All runs were on this branch, with no GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX in the environment.

**The suite** (`tests/data/cultureOfficeTitles.test.js`) is green, 17/17.

**The three planted reds.** Each was planted in the data file and run. They were run twice: on the first version of the test, and again on the final, anchored one. The file was restored byte for byte after each (`cmp`). Both rounds gave the same counts.

| plant | red |
|---|---|
| `'King'` in norse `council` at city | **4/17 red**: CT3's crown-row arm, the sovereign-switch arm, the sex arm (King names a man), and the officeWordInfo arm |
| the fallback `?? todayOfficeTitle(...)` replaced by `?? 'Elder'` | **2/17 red**: CT1's byte-for-byte arm against `officeTitleFor`, and the null arm |
| `'Imam'` in base `crime_boss` at metropolis | **2/17 red**: CT4's sacred arm, and the criminal ladder |

**The neighbouring tables:** `faceHonorifics` ×3, `holderTitleForms`, `midwifeHonorific` and this suite give 6 files, **42/42 green**.

**`tests/lint` whole, first run (at `ddf458393`'s content, before commit):** 219 files, **2 red, both mine, both fixed**:
- **The anchor walker.** The new test had 7 bare `not.toContain` sites. Each is now anchored: a positive proof on the same collection, and the one-line `// anchored:` marker.
- **The lighting census.** The file count moved 3702 to 3703. It was re-measured by `LIGHTING_CENSUS_REFREEZE` on the clean tree at `ddf458393`: files +1, credited +1, titles +17, suiteTitles +7, which is exactly this file's 17 tests and 7 describe blocks. The walker re-run plainly is green, 34/34.
- After the fixes, the anchor walker, the manifest walker and this suite were run together: **36/36 green**.

**The other gates:**
- `npm run lint`: exit 0, 0 errors. The 38 warnings are elsewhere; none is in my files.
- `npm run typecheck:domain:strict`: exit 0 (1113, ceiling 1113).
- `npm run typecheck:ratchet`: exit 0 (167, ceiling 167).

**`tests/lint` whole at `4902e1229`** (the code, the census and the first hand-back): **219/219 files, 3258/3258 tests green**, exit 0 by `scripts/gate-tail.sh`. The only change after it is this hand-back's §4 and §6, a docs file under `docs/chair/`; the closing message says whether the walkers were re-run on it.

## 7. CT5's map (read, none edited)

**What changes now:**
- **Nothing.** The table writes nothing until SEAT-1 wires it. Then every authored cell changes the role written at a birth of that culture under SEAT-1's new law, and saved towns keep theirs.

**What SEAT-1 must handle when it wires the table** (told, and SEAT-1 accepted):
- **`domain/people/cardPowers.js :: caretakerFormOf`.** `CROWN_OFFICES` holds only King, Queen and Monarch. Key the regent on `officeWordInfo(word).crown` instead.
- **`tests/helpers/peopleKinds.js :: OFFICE_FORM`.** Exempt only the form that matches the holder's sex. `officeWordInfo(word).sex` gives it.
- **`domain/people/seatKeeperDisplay.js :: shownHonorificOf`.** The office wins: key F10 on `officeWordInfo(honorific) !== null`. Jarl (norse) and Sheikh and Wali (arabic) are already culture honorifics.
- **The readers that match an office by its word.** All of them, per SEAT-1's census: `seatHolder.js :: SEAT_TITLES / TIER_HEAD / seatTitleRankOf`, `roleClass.js :: SEAT_ROLE / classOfRole / holdsOffice` (measured: every new word classes as `other`), `roleCategory.js :: ROLE_CATEGORY_KEYWORDS` ('magister' gives arcane, 'lord' gives noble), `npcGenerator.js :: TIER_MANDATORY_ROLES` and `poolMap.js :: SEAT_ROLE_BY_TIER`.
- **Pins on today's titles.** The golden doors and the literal-title pins are SEAT-1's to move under its law: `tests/helpers/dualHatOracle.js`, `tests/domain/dossier/seatHolder.test.js` and `tests/generators/terrainPoolsSeat.test.js`.

**The presumption walker:**
- Literals under 4 words are skipped. "Tribune of the People" is the only 4-word cell, and it holds no lexicon word. **No register row was added; tests/lint is green.**

**The security lane** (`lane/veil-21-2026-11-20` at `463d0362c`):
- **What I read:** `src/domain/veil/{importRederive,pageRederive,rosterChoiceRegistry}.js` and `src/domain/display/{galleryVeil,gallerySecondHomes,galleryWithholdAlways}.js`. None holds a search or rule keyed on an office word.
- **`role` and `title`** sit on a person card's identity floor (`galleryVeil.js :: CARD_KINDS`, line 164 there), so a new word is always public and never hidden.
- **`gallerySecondHomes.js`** matches a hidden person by name identity (`nameFold`). It strips a parenthesised qualifier from a name, never an office word.
- **The civility list** (`data/civilityLists.js`) flags none of the words.
- **Nothing to change.** The lane should only know that the role text can now hold these words, all Latin-1, with an apostrophe in Ra'is.

**For the owner** (existing content, not this lane's): `faceHonorifics.js :: FACE_HONORIFICS_BY_CULTURE` prints Imam, Purohit, Pontifex, Godi/Gydja and Druid for clergy. The chair has told the owner.

## 8. Executed versus plausible

**EXECUTED:**
- every count in §3 and §6
- the three plants, run twice
- every gate in §6
- the security-lane read (grep over all six files at `463d0362c`)
- the classifier measure (`classOfRole` and `holdsOffice` over the candidate words, run in node)
- the civility grep

**PLAUSIBLE (my judgment, not executed):**
- that each authored word is right for its culture and period. This is a scholar's judgment, which no test can execute, and is the owner's to veto cell by cell.
- that `sovereign.js :: sovereignOf` is the right signal for SEAT-1's sovereign form. I read only its comment.
