# BAR6-AUDIT-E · HAND-BACK · LAW 9 · a state word has one reading (M1; kinds K3, K5, K7)

Seat E of BRIEF-BAR6-AUDIT (`lane/chair-2026-11-08 :: docs/chair/2026-11-14/briefs/BRIEF-BAR6-AUDIT.md`). Tree: the joined
line's tip **600b7683a** (as named), with `lane/bar5-audit-a-2026-11-16` at c0ea05497 and `lane/bar5-audit-b-2026-11-16`
at d40d6ab28 merged once, first. NOTHING UNDER `src/` CHANGED; no test file; no file of another seat or earlier auditor edited.

THE FILES (all new, all mine):
- `tests/helpers/pageLaws/law9.mjs`: the detector. Pure, over `pageB.mjs :: readTown` (dump + record). It returns instances
  `{ law, rule, town, tab, line, sentence, against, why, held, status }`. `held` names the BAR5 seat whose section names the
  line or fact. `status: 'apart'` marks a row the checkers ruled WEAK or ruled both ways: it is reported, never counted.
- `docs/chair/2026-11-16/bar6/AUDIT/runE.mjs`: THE CHAIR'S RUNNER: `node docs/chair/2026-11-16/bar6/AUDIT/runE.mjs
  <render-dir> <out.json> [second-check.json ...]`. It runs over any PAGE-COPY render and prints counts by rule (towns,
  instances, distinct lines, the holding seat, apart). Given the second-check files it also prints the controls table
  (`controlsE.json`). It runs two earlier detectors UNCHANGED and relabels them (no wrapper edits them):
  `9e.none` = LAW 1 rule 1a (`law1.mjs :: law1a`), `9c.game` = LAW 3's `L3.foodModel` (`law3.mjs`).
- `traceE.mjs`: the writer of each distinct line, and of its `against`, in a counted tree (writers2.mjs's method; that file
  runs on import, so it is re-stated, not imported). `sampleE.mjs`: the seeded precision draw. `tablesE.mjs`: `TABLES-E.md`.
- `PRECISION-E.seed616.md` (point 3), `TABLES-E.md` (point 2, every rule's thirty commonest lines with writer files),
  `tablesE/` (every instance: `law9-E.{150,720,300,30}.json`, their `.writers.json` and `.controls.json`, the drawn sample).

THE POPULATIONS (rendered at the tip in a scratch worktree with its own `npm ci`, PAGE-COPY's `census3.sh --count-only`):
- the 150 wide-read towns (`bar0-<shape>-rand-27..41`);
- the census's 720 (PAGE-COPY `seeds.txt`);
- the fresh 300 (`packets11/seeds.fresh300.txt`);
- and the bar read's 30 (`rand-24..26`), for its controls only.

## 1 · THE CONTROLS

Every control row of LAW 9 in `SECOND-CHECK.final221.json` (the wide read) and `SECOND-CHECK.final72.json` (the bar read),
run on its own town (`tablesE/law9-E.150.controls.json`, `law9-E.30.controls.json`). The result:

- **STANDS: 58 of 58 found.** Two are found APART on purpose (see the ruled-both-ways notes below).
- **EXPLAINED: 22 of 22 clean.** No counted instance holds their text.
- **WEAK: 8 found** (all apart or held). **5 not found**, and the 5 are not owed: C162769, C18731, C26440, C183125 and
  C36857 are WEAK rows a conservative rule may leave.

RULED BOTH WAYS, reported apart with both readings:
- **`9a.contested`: diffuse crime against the hook "The crime wave is coordinated."** STANDS C154050 and C155339 (the record
  names "the criminal network" as a party and the hook says someone directs it). EXPLAINED C81673, C82881, C207455, C151604
  and the bar read's C18578 (a hook states its own hidden fact; the party is a label). The rule finds the two STANDS rows
  and none of the five EXPLAINED. Its count stands apart: 13 in 6 towns of the 150, 46 in 23 of the 720, 16 in 8 of the 300.
- **`9a.watch-weak`: "The town watch exists on paper" under an occupation.** C187260 (STANDS) and the bar read's C36857
  (WEAK) are the same shape: an occupied town whose only working watch is the night rounds of its card, or the roster's
  "It keeps a watch". The counted rule `9a.watch` keeps what neither ruling disputes.

| rule | id | verdict | town | result | text |
|---|---|---|---|---|---|
| 9a.balance | C157107 | STANDS | thorp-calm-rand-41 | found | Waldhausen keeps a working balance: the law is present, so is crime, a |
| 9a.balance | C162769 | WEAK | town-calm-rand-30 | MISS | Mönkhobo keeps a working balance: the law is present, so is crime, and |
| 9a.band-quiet | C152996 | STANDS | thorp-calm-rand-32 | found | Law & order · Critical |
| 9a.band-quiet | C84676 | STANDS | hamlet-calm-rand-33 | found | Law & order · Critical |
| 9a.band-quiet | C85310 | STANDS | hamlet-calm-rand-34 | found | Law & order · Collapsed |
| 9a.band-quiet | C86320 | STANDS | hamlet-calm-rand-36 | found | Law & order · Critical |
| 9a.collapsed | C14349 | STANDS | city-under_siege+famine-rand-32 | found | Offenders at Indragarh are arrested, heard and held, and each case is  |
| 9a.collapsed | C219464 | STANDS | village-famine-rand-39 | found | The old families keep the peace, and anyone who breaks it answers to a |
| 9a.collapsed | C26311 | STANDS | city-under_siege+famine-rand-36 | found | A functioning court and prison mean crimes carry real consequences. |
| 9a.collapsed | C26333 | STANDS | city-under_siege+famine-rand-36 | found | Offenders at Lagoorum are arrested, heard and held, and each case is w |
| 9a.collapsed | C28848 | STANDS | city-under_siege+famine-rand-37 | found | Offenders at Neugasse are arrested, heard and held, and each case is w |
| 9a.collapsed | C42116 | STANDS | village-famine-rand-24 | found | A thief is known by name within a day, and everyone shuns them until t |
| 9a.collapsed | C8611 | STANDS | city-under_siege+famine-rand-30 | found | Offenders at Khutulunserai are arrested, heard and held, and each case |
| 9a.contested | C151604 | EXPLAINED | thorp-calm-rand-28 | clean | Petty theft is the primary risk; organized crime has found no foothold |
| 9a.contested | C154050 | STANDS | thorp-calm-rand-34 | found (apart) | The danger at Loughshaw comes from lone thieves, not a gang: a cut pur |
| 9a.contested | C155339 | STANDS | thorp-calm-rand-37 | found (apart) | The danger at Medinaistan comes from lone thieves, not a gang: a cut p |
| 9a.contested | C18578 | EXPLAINED | hamlet-under_siege-rand-26 | clean | Thieves, fences and bandits each work for themselves; there is no boss |
| 9a.contested | C207455 | EXPLAINED | village-calm-rand-37 | clean | Thieves, fences and bandits each work for themselves; there is no boss |
| 9a.contested | C81673 | EXPLAINED | hamlet-calm-rand-27 | clean | Thieves, fences and bandits each work for themselves; there is no boss |
| 9a.contested | C82881 | EXPLAINED | hamlet-calm-rand-29 | clean | Thieves, fences and bandits each work for themselves; there is no boss |
| 9a.curfew | C183057 | STANDS | town-occupied-rand-30 | found | Theft is rising even under the curfew, and the greater danger is infor |
| 9a.curfew | C194447 | STANDS | town-occupied-rand-38 | found | There is a curfew at Roccafossae now, and checkpoints; ordinary theft  |
| 9a.curfew | C198660 | STANDS | town-occupied-rand-41 | found | There is a curfew at Dagaker now, and checkpoints; ordinary theft has  |
| 9a.hands | C213284 | STANDS | village-famine-rand-31 | found | Little of Mayancalco's trade goes unrecorded, but what does goes throu |
| 9a.lawless | C172465 | STANDS | town-calm-rand-38 | found | The law here is slow and easily outbid. |
| 9a.manned | C80552 | STANDS | city-wartime-rand-41 | found | Dobroburg's accounts keep its city walls and gates in repair and stret |
| 9a.militia | C199950 | STANDS | village-calm-rand-27 | found | The militia is present and responsive. |
| 9a.pay | C51048 | STANDS | city-wartime-rand-31 | found | The garrison and city watch are well paid, well equipped and patrol pr |
| 9a.structure | C131929 | STANDS | metropolis-calm-rand-36 | found | Petty theft is the primary risk; organized crime has a limited foothol |
| 9a.structure | C143085 | STANDS | metropolis-calm-rand-39 | found | Petty theft is the primary risk; organized crime has a limited foothol |
| 9a.watch | C200637 | STANDS | village-calm-rand-28 | found | The local watch exists on paper. |
| 9a.watch-weak | C187260 | STANDS | town-occupied-rand-33 | found (apart) | The town watch exists on paper. |
| 9a.watch-weak | C36857 | WEAK | town-occupied-rand-24 | MISS | The town watch exists on paper. |
| 9a.wave | C143088 | STANDS | metropolis-calm-rand-39 | found | The metropolis's record of crimes at Albamunicipium stays short: there |
| 9a.wave | C43177 | STANDS | city-wartime-rand-28 | found | It keeps the streets quiet because trouble brings the law, lives on pr |
| 9b.purse | C16520 | EXPLAINED | hamlet-calm-rand-25 | clean | Nothing about Ioannochorion's condition asks to be remarked on. |
| 9b.purse | C32519 | STANDS | town-calm-rand-24 | found | The town pays its own way and has a little in hand. |
| 9b.purse | C58141 | EXPLAINED | city-wartime-rand-33 | clean | Wukou closes every year ahead. |
| 9b.purse | C61967 | EXPLAINED | city-wartime-rand-35 | clean | With a little left over each year, Tyrhammer gets by on a broad base o |
| 9b.purse | C66113 | STANDS | city-wartime-rand-36 | found | Clíodhna O'Dwyer's treasury borrowed from Tlachtga O'Meara to cover a  |
| 9b.shadow | C216091 | WEAK | village-famine-rand-35 | found (apart) | What passes for a shadow economy here has never grown into one. |
| 9b.shadow | C216874 | WEAK | village-famine-rand-36 | found (apart) | What passes for a shadow economy here has never grown into one. |
| 9b.shadow | C83868 | WEAK | hamlet-calm-rand-31 | found (apart) | A little changes hands here quietly, between neighbours, and no one re |
| 9b.shadow | C89075 | WEAK | hamlet-calm-rand-41 | found (apart) | What passes for a shadow economy here has never grown into one. |
| 9b.subsistence | C88465 | STANDS | hamlet-calm-rand-40 | found | Subsistence — survival economy |
| 9b.subsistence | C89035 | WEAK | hamlet-calm-rand-41 | found (apart) | Subsistence — survival economy |
| 9c.carts | C177322 | STANDS | town-calm-rand-41 | found | Beloovo grows about four parts in five of what it needs, and carts bri |
| 9c.carts | C177698 | EXPLAINED | town-calm-rand-41 | clean | Beloovo lies off the trade roads, yet it gets by: some of its food com |
| 9c.fish-stopped | C17290 | STANDS | hamlet-under_siege-rand-24 | found | What each holding grows goes to its own table; beyond that, what it pu |
| 9c.fish-stopped | C90582 | STANDS | hamlet-under_siege-rand-29 | found | Each holding grows for its own table, and beyond that its food is fish |
| 9c.fish-stopped | C96337 | WEAK | hamlet-under_siege-rand-39 | found | The table is cheese and smoked meat from the grazing herds, with salte |
| 9c.game | C39597 | STANDS | village-calm-rand-24 | found | What it puts on the table itself is the hunters' game. |
| 9c.no-imports | C154358 | STANDS | thorp-calm-rand-35 | found | No recorded imports. |
| 9c.nothing-over | C156726 | STANDS | thorp-calm-rand-40 | found | What Schwarzhausen raises leaves nothing over in an ordinary year, and |
| 9c.putby | C117522 | EXPLAINED | metropolis-calm-rand-32 | clean | Rathsike's food trades are failing, and what they fail to put by is fo |
| 9c.putby | C128263 | STANDS | metropolis-calm-rand-35 | found | The food trades at Sundhavn are struggling to keep up, and less is bei |
| 9c.putby | C33652 | EXPLAINED | town-calm-rand-25 | clean | Padmavalli's food trades are failing, so less food is being put by tha |
| 9c.putby | C62474 | EXPLAINED | city-wartime-rand-35 | clean | Tyrhammer's food trades are failing, and what they fail to put by is f |
| 9c.putby | C99619 | EXPLAINED | metropolis-calm-rand-27 | clean | Staroko's food trades are failing, and what they fail to put by is foo |
| 9c.reassure | C184150 | STANDS | town-occupied-rand-31 | found | Its food comes from more than one source, the herds most of all, so a  |
| 9c.reassure | C40276 | STANDS | village-calm-rand-25 | found | With more than its herds to rely on, Aquaium can take a bad season in  |
| 9d.isolated | C176731 | EXPLAINED | town-calm-rand-41 | clean | Isolated, and running a shortfall it cannot farm its way out of. |
| 9d.isolated | C193977 | STANDS | town-occupied-rand-38 | found | No trade access: running on existing stockpiles only. |
| 9d.isolated | C194173 | STANDS | town-occupied-rand-38 | found | Law enforcement, patrol and gate control here run on stored iron: no t |
| 9d.isolated | C194531 | STANDS | town-occupied-rand-38 | found | 11 institutions operating on stockpiles only (isolated trade): Weekly  |
| 9d.no-exports | C211337 | STANDS | village-famine-rand-28 | found | No significant exports. |
| 9d.no-exports | C217617 | STANDS | village-famine-rand-37 | found | No significant exports. |
| 9d.no-exports | C93420 | EXPLAINED | hamlet-under_siege-rand-34 | clean | No significant exports. |
| 9e.heresy | C18731 | WEAK | city-under_siege+famine-rand-33 | MISS | The church in Purivaram preaches that magic is heresy against the fait |
| 9e.heresy | C84616 | STANDS | hamlet-calm-rand-32 | found | The faithful of Raskot treat magic as heresy and hunt it as such: a su |
| 9e.if-help | C110376 | WEAK | metropolis-calm-rand-30 | found (apart) | If the help beyond ordinary work failed at Agioscastron, the trade tha |
| 9e.if-help | C117636 | WEAK | metropolis-calm-rand-32 | found (apart) | If the help beyond ordinary work failed at Rathsike, the trade that ma |
| 9e.if-help | C78252 | EXPLAINED | city-wartime-rand-40 | clean | If the help beyond ordinary work failed at Khānmandi, the trade that m |
| 9e.leans | C128358 | STANDS | metropolis-calm-rand-35 | found | At Sundhavn the usual work no longer yields enough baked goods, and th |
| 9e.leans | C14460 | STANDS | city-under_siege+famine-rand-32 | found | At Indragarh the usual work no longer yields enough medical treatment, |
| 9e.leans | C158346 | STANDS | town-calm-rand-27 | found | At Gantulgakhurel the usual work no longer yields enough baked goods,  |
| 9e.military | C164227 | STANDS | town-calm-rand-31 | found | Arcane work at Zelenosk answers to its military, and the practitioners |
| 9e.military | C62573 | STANDS | city-wartime-rand-35 | found | The soldiers at Tyrhammer command its magic: the arcane houses answer  |
| 9e.none | C139724 | EXPLAINED | metropolis-calm-rand-38 | clean | No arcane practitioners on the rolls. |
| 9e.none | C17061 | STANDS | hamlet-under_siege-rand-24 | found | "The settlement relies on arcane workings it does not entirely trust. |
| 9e.none | C176732 | EXPLAINED | town-calm-rand-41 | clean | Survival here rests on carriage by magic or the tracks in a good seaso |
| 9e.none | C177702 | EXPLAINED | town-calm-rand-41 | clean | Much of what Beloovo needs arrives by magic now, and if that magic fai |
| 9e.none | C183125 | WEAK | town-occupied-rand-30 | MISS | Nothing structural at Nandapeta depends on arcane work. |
| 9e.none | C26440 | WEAK | city-under_siege+famine-rand-36 | MISS | Nothing structural at Lagoorum depends on arcane work. |
| 9e.none | C29831 | STANDS | thorp-calm-rand-24 | found | "The settlement relies on arcane workings it does not entirely trust. |
| 9e.none | C31972 | EXPLAINED | town-calm-rand-24 | clean | Nothing structural at Andronkastro depends on arcane work. |
| 9e.none | C33713 | STANDS | town-calm-rand-25 | found | People at Padmavalli know that part of the town's work now holds up on |
| 9e.none | C40444 | EXPLAINED | village-calm-rand-25 | clean | Nothing structural at Aquaium depends on arcane work. |
| 9e.none | C43125 | STANDS | village-famine-rand-25 | found | People at Bjorney know that part of the village's work now holds up on |
| 9e.none | C83538 | EXPLAINED | hamlet-calm-rand-30 | clean | Whatever magic reaches Dionnea, the hamlet does not rest on it: nothin |
| 9e.none | C9617 | STANDS | city-wartime-rand-24 | found | People at Ingines know that part of the city's work now holds up only  |
| 9e.quietly | C32780 | STANDS | city-under_siege+famine-rand-39 | found | Nobody in Kallipolis sells enchanting by the hour, and what magic is d |
| 9f.loyal | C76517 | STANDS | city-wartime-rand-40 | found | The settlement is loyal. |

## 2 · THE COUNTS

The columns are **towns / instances / distinct lines**. A distinct line is the sentence with the town's own name and its
tier word folded out. The whole tables, with the thirty commonest lines of each rule, their towns and their writer files,
are in `TABLES-E.md`.

| rule | the 150 | the 720 | the fresh 300 | held by (BAR5) | |
|---|---|---|---|---|---|
| 9a.band-quiet · "Law & order · Critical/Collapsed" on a quiet small place (LB1's four conditions) | 24 / 24 / 2 | 45 / 45 / 2 | 43 / 43 / 2 | BAR5-BAND | counted |
| 9a.collapsed · the calm law line beside "Collapsed" under a crisis or an unsafe word | 16 / 19 / 5 | 55 / 55 / 3 | 27 / 27 / 4 | BAR5-SAFETY | counted |
| 9a.wave · crime "kept down"/"the streets quiet" beside the crime-wave tension | 3 / 3 / 2 | 19 / 19 / 2 | 3 / 3 / 2 | - | counted |
| 9a.structure · "organized crime has a limited/no foothold" beside an organised structure | 2 / 2 / 1 | 5 / 5 / 1 | 1 / 1 / 1 | - | counted |
| 9a.hands · the shadow economy's "same organised hands" beside a structure with no one hand | 1 / 1 / 1 | 6 / 6 / 1 | 2 / 2 / 1 | - | counted |
| 9a.curfew · "theft has dropped" beside "theft is rising even under the curfew" | 3 / 3 / 1 | 1 / 1 / 1 | 2 / 2 / 1 | - | counted |
| 9a.watch · "exists on paper" beside a working watch | 2 / 2 / 2 | 3 / 3 / 1 | 0 | - | counted |
| 9a.militia · "present and responsive" beside "absent during routine crime" / "There is no watch" | 1 / 1 / 1 | 2 / 2 / 1 | 1 / 1 / 1 | - | counted |
| 9a.manned · "too few people man them" beside forces in good order | 2 / 2 / 1 | 4 / 4 / 3 | 0 | - | counted |
| 9a.balance · "the law is present" beside no watch and no court | 2 / 2 / 1 | 1 / 1 / 1 | 0 | - | counted |
| 9a.lawless · "The law here is slow and easily outbid" beside a court, a gaol and Adequate | 1 / 1 / 1 | 0 | 1 / 1 / 1 | - | counted |
| 9a.pay · "well paid" beside a card's cut pay | 1 / 1 / 1 | 0 | 0 | - | counted |
| 9b.subsistence · "Subsistence — survival economy" under Comfortable or better | 2 / 2 / 1 (1 apart) | 8 / 8 / 1 (4 apart) | 4 / 4 / 1 (2 apart) | - | counted |
| 9b.purse · the purse's surplus beside a public purse that borrows, or "chronically underfunded" | 1 / 2 / 2 | 1 / 2 / 2 | 1 / 1 / 1 | - | counted |
| 9c.putby · "less is being put by" beside a granary of more than a year | 1 / 1 / 1 | 6 / 6 / 1 | 0 | - | counted |
| 9c.nothing-over · "leaves nothing over" beside "grows more than it eats" | 1 / 1 / 1 | 2 / 2 / 1 | 3 / 3 / 1 | - | counted |
| 9c.reassure · "a poor year does not empty the tables" under Food · Pressured | 1 / 1 / 1 | 8 / 8 / 8 | 6 / 6 / 4 | (4 of the 720's 8: BAR5-FOOD (c)) | counted |
| 9c.carts · "carts bring in" where the import comes by magic | 1 / 1 / 1 | 6 / 6 / 6 | 2 / 2 / 2 | - | counted |
| 9c.no-imports · "No recorded imports." above "+ N imported" | 1 / 1 / 1 | 10 / 10 / 1 | 4 / 4 / 1 | - | counted |
| 9c.fish-stopped · the catch on the table where the fishing is marked stopped | 4 / 4 / 4 | 5 / 5 / 4 | 2 / 2 / 1 | BAR5-FOOD (b) | counted |
| 9c.game · the table's game or catch beside a Farmland selling grain (L3.foodModel) | 4 / 4 / 4 | 13 / 13 / 7 | 2 / 2 / 2 | BAR5-FOOD (d) | counted |
| 9d.isolated · "No trade access … stockpiles only" / "no trade road reaches" where food comes in by road | 3 / 7 / 4 | 5 / 18 / 7 | 4 / 14 / 9 | - | counted |
| 9d.no-exports · "No significant exports." beside an export that moves (no siege) | 2 / 2 / 1 | 0 | 2 / 2 / 1 | - | counted |
| 9e.leans · a trade "now leans on help beyond ordinary work" that the reliance row does not name | 3 / 3 / 2 | 21 / 21 / 4 | 6 / 6 / 2 | - | counted |
| 9e.military · "the soldiers command its magic" where every arcane house backs another power (or Military role: absent) | 5 / 5 / 2 | 8 / 8 / 2 | 4 / 4 / 2 | - | counted |
| 9e.quietly · "nobody sells enchanting … done quietly" beside an enchanting chain or Integral reliance | 1 / 1 / 1 | 2 / 2 / 1 | 0 | - | counted |
| 9e.heresy · the Faith tab's heresy hunt beside "Religious acceptance · indifferent" | 1 / 1 / 1 | 1 / 1 / 1 | 0 | - | counted |
| 9e.none · LAW 1 rule 1a: reliance asserted under None (or denied under Relied upon / Integral) | 8 / 10 / 6 | 23 / 24 / 9 | 9 / 10 / 8 | BAR5-MAGIC | counted |
| 9f.loyal · "The settlement is loyal." under a legitimacy crisis | 1 / 1 / 1 | 4 / 4 / 1 | 2 / 2 / 1 | - | counted |
| APART · 9a.contested (above) | 6 / 13 / 5 | 23 / 46 / 4 | 8 / 16 / 4 | - | apart |
| APART · 9a.watch-weak (above) | 4 / 4 / 1 | 2 / 2 / 1 | 8 / 8 / 1 | - | apart |
| APART · 9b.shadow (WEAK by C89075's ruling) | 8 / 10 / 2 | 23 / 27 / 2 | 9 / 10 / 2 | - | apart |
| APART · 9b.purse-house (a house's treasury borrows; the town's own surplus is not denied) | 0 | 7 / 7 / 4 | 3 / 3 / 2 | - | apart |
| APART · 9e.if-help (the twin "if the help … failed"; WEAK by C110376's ruling) | 7 / 7 / 4 | 28 / 28 / 7 | 6 / 6 / 4 | - | apart |
| APART · 9f.loyal-contested (under Contested, not a crisis) | 1 / 1 / 1 | 2 / 2 / 1 | 0 | - | apart |

**THE TOTALS, COUNTED** (towns / instances / distinct lines, a line counted once a rule; `runE.mjs`'s own headline counts a line once across rules, so it prints 52, 70 and 48):

| | the 150 | the 720 | the fresh 300 |
|---|---|---|---|
| all of LAW 9 | 77 / 107 / 53 | 232 / 275 / 72 | 117 / 140 / 49 |
| beyond the round in flight | 34 / 46 / 32 | 110 / 133 / 47 | 44 / 56 / 32 |

THE STOCK IS FEW SENTENCES PRINTED IN MANY TOWNS. That is unlike the read's tail, where 95 of 116 sentences were seen once.
Every LAW 9 rule is a TEMPLATE PAIR: one line and one state word, each written in one place. The 720's 275 instances are
72 distinct sentences, and 47 of those are beyond the round in flight.

BY WRITER FILE (the false line → the fact it should read; traced at the tip, `TABLES-E.md` per line). The tracer labels
rows it cannot trace "(untraced)"; this list traces those rows by hand.
- 9a.band-quiet: the row `Law & order · <band>`, printed by `src/domain/display/foundationBandShown.js`. It reads
  `src/domain/causalState.js :: deriveLawOrder`, and the round in flight moves it to `domain/facts/lawBand.js :: lawBandOf`
  (`lane/bar5-safety-2026-11-16`).
- 9a.collapsed: `src/generators/safetyProfile.js :: NO_WATCH_SMALL` ("A thief is known by name…", "The old families keep
  the peace…"; 54 of 55 in the 720) and `COURT_AND_PRISON` and `DS-DEF-2 › Internal Security: full legal chain`. All
  three are read against that same band.
- 9a.wave: `src/domain/display/defenseDisplay.js :: ORGANIZED_RING_NOTES` (18 of 19) and `DS-DEF-3 › Safe · v2`. The
  fact is the crime-wave tension (`history.currentTensions` type `crime_wave`; printed by `src/data/historyData.js`; read
  as `foundationBandShown.js :: crimeWaveStands`).
- 9a.structure: `src/generators/safetyLineTruth.js :: footholdWord`, which reads "a criminal house stands" only. The fact
  is `src/domain/facts/criminalStructureKey.js :: criminalStructureKeyOf`, printed through `defenseDisplay.js ::
  CRIM_STRUCTURE_DATA`.
- 9a.hands: `src/data/dossierStateProse/economy.generated.js :: DS-ECO-6 › TIER: minor shadow activity (≥3) · v4`. It is
  read against the same `criminalStructureKeyOf`.
- 9a.curfew: `DS-DEF-3 › COMPOUND: occupation curfew · v1` ("ordinary theft has dropped"), against `safetyLineTruth.js ::
  CRIME_WAVE_TWINS` ("Theft is rising even under the curfew").
- 9a.watch / 9a.militia: `src/generators/safetyLineTruth.js :: paperTruth` (the effectiveness line, stored as
  `safetyProfile.guardEffectivenessDesc`) and `safetyProfile.js :: generateSafetyProfile`'s `lawLine` ("The militia is
  present and responsive"). Both are read against the roster's own row for the watch or militia: the card, its mark, and
  "absent during routine crime".
- 9a.manned: `DS-DEF-11 › WALLED-STRAINED · v1`, against `DS-DEF-1 › readiness STRONG` and the arrival line.
- 9a.balance: `DS-DEF-3 › Moderate · v1`, against `DS-DEF-2 › Internal Security: no legal infrastructure`.
- 9a.lawless: `src/generators/servicesGenerator.js` (the `(lawless)` criminal service row), against `DS-GEN-17 ›
  ADMINISTERED`.
- 9a.pay: `safetyLineTruth.js :: patrolTruth`, against `src/generators/npcStructure.js` (the commander's constraint line).
- 9b.subsistence: `src/domain/display/labelBands.js :: COMPLEXITY_LABEL` (`economicState.economicComplexity`, set in
  `src/generators/economy/prosperity.js`), against the Prosperity word of the same record.
- 9b.purse: `DS-ECO-1` / `DS-ECO-8`, against `src/data/npcData.js` (the borrowing relationship) or the stability word.
- 9c.putby: `src/data/dossierStateProse/defense.generated.js :: DS-DEF-2 › CHAIN: food trades failing · v2`, against
  `defenseDisplay.js :: foodEnduranceLine`.
- 9c.nothing-over: `DS-DEF-12 › CAPACITY: enough · v2`, against `EconomicsTab.jsx :: foodSentence`.
- 9c.reassure: `economy.generated.js :: DS-ECO-9 › FOOD SOURCES: several, the largest named`, against the Food word
  (`tonightSheet.js :: foodBandOf`).
- 9c.carts: `src/components/new/tabs/EconomicsTab.jsx :: foodSentence`, against
  `economicViability.metrics.foodBalance.importChannel` and the chain-need line (`src/domain/display/chainNeedShown.js`).
- 9c.no-imports: `EconomicsTab.jsx` (line 516, "No recorded imports."), against the same tab's food production line.
- 9c.fish-stopped / 9c.game: `src/domain/foodways.js :: FRAMES` (and `cultureProfiles.js`).
- 9d.isolated: `src/generators/economy/economicState.js` (line 663, "No trade access: running on existing stockpiles
  only.", the Services row), `src/generators/economy/viability.js` (line 531, "N institutions operating on stockpiles only
  (isolated trade)": Overview, History and Outlook print it, so one town carries it up to four times) and
  `src/data/crisisDependence.js` ("run on stored X: no trade road reaches"). All read `tradeAccess === isolated`. The fact
  they should read is the import channel the food line prints (`foodBalance.importChannel`: "minor routes and sanctioned caravans" in every instance of the 150, the 720 and the 300, carrying 5% to 21% of the food).
- 9d.no-exports: `EconomicsTab.jsx` (line 481), against `DS-ECO-11` ("the raw material moves").
- 9e.leans: `DS-DEF-9 › magicDependency true, with a NAMED dependent chain · v1`; the good is
  `defenseStateProse.js :: namedMagicChainGood`. The fact is the reliance row's "for …" list
  (`src/domain/display/magicProvisionShown.js`, printed by `MagicTab.jsx`).
- 9e.military: `DS-DEF-9 › FLAG: magicMilitarized` (the flag is drawn in `src/generators/priorityHelpers.js`, line 634),
  against the Institutions tab's "Backs · …" rows (the arcane houses' faction) and the Military role.
- 9e.quietly: `src/data/arrivalProse.js :: ARRIVAL_SENSES`, against the reliance row or the enchanting chain.
- 9e.heresy: `warFaith.generated.js :: DS-FTH-4 › FLAG: heresySuppression: hunted`, against
  `MagicTab.jsx :: FACET_LABEL` (the envelope's religious acceptance, `magicProfile.js`).
- 9e.none: `DS-DEF-9` and `narrativeText.js :: POLITICAL_FLAVOR` (LAW 1 rule 1a's own table).
- 9f.loyal: `src/generators/narrativeText.js :: PRESSURE_SENTENCES` (the wartime "losing side" variant), against
  `powerStructure.publicLegitimacy` (printed through `power.generated.js :: DS-POW-1`).

## 3 · PRECISION

The full table is `PRECISION-E.seed616.md`. It holds twenty a rule from the 720 (seed 616), or every instance where a
rule has fewer, each judged by the second check's rules.

After narrowing, every counted rule is at or above 17 in 20: most at 20/20 or at all of their instances, `9c.fish-stopped`
at 4/5 (held), `9e.leans` at 19/20 before its narrowing.

THREE RULES WERE NARROWED AND COUNTED AGAIN:
- **`9a.watch`**: 3 of 5 as first written. The occupation's "It keeps a watch" is not a working watch (C36857's ruling); that
  form now sits in `9a.watch-weak`, apart.
- **`9b.purse`**: 1 of 9. In eight draws the borrowing treasury is a HOUSE's (an arena master's, a granary reeve's) and does
  not deny the town's surplus. Now counted only against a public purse or the stability word; the rest is `9b.purse-house`,
  apart. NOTE FOR THE CHAIR: C66113's borrower is the mint master, so it stays counted. A checker who reads the mint as
  the mint's own purse would rule it as these eight.
- **`9e.leans`**: 19 of 20. A food good under a row naming "food (… provision)" is backed; it is now skipped.

`9a.collapsed`: the pair stands in all twenty draws. But in 6 of the 20 the crisis does not itself break order (monster
pressure, a plague's onset, a recent betrayal). There the false side is likelier the BAND than the line, and LB1's floor does
not reach it, because it requires no crisis.

## 4 · THE CURE'S FORM, by rule (proposed, not made)

FOR EACH STATE: where it is written, which lines read it, which do not, and whether ONE leaf could serve them all.

- **THE LAW BAND (9a.band-quiet, 9a.collapsed, 9a.balance, 9a.lawless).**
  - WRITTEN: `causalState.js :: deriveLawOrder`, under `foundationBandShown.js`'s cap. The round in flight makes
    `domain/facts/lawBand.js :: lawBandOf` the ONE home and adds LB1's floor there.
  - READ BY: on BAR5-SAFETY's branch, the guard line (`display/guardLineUnderTheLaw.js`) and the `law` atom of the fact
    vocabulary.
  - NOT READ BY: `DS-DEF-3 › Moderate` ("a working balance: the law is present"), the `(lawless)` service row
    (`servicesGenerator.js`), and `COURT_AND_PRISON`'s "crimes carry real consequences" where the court stands but the band
    is Collapsed.
  - ONE LEAF: YES, `lawBandOf`. Display only: every reader takes the band at print and draws its twin. Nothing in the
    stored record moves.
- **THE CRIME STRUCTURE (9a.structure, 9a.hands; and 9a.contested's STANDS reading).**
  - WRITTEN: `domain/facts/criminalStructureKey.js :: criminalStructureKeyOf` (organized / semi-organized / diffuse / null),
    printed as "Criminal structure: …".
  - NOT READ BY: `safetyLineTruth.js :: footholdWord`, which asks only "a criminal house stands". It should read the key:
    "limited foothold" only at semi-organized, a syndicate's twin at organized. Nor by `DS-ECO-6 › minor shadow activity ·
    v4` ("the same organised hands"), which should be refused below organized.
  - ONE LEAF: YES, `criminalStructureKeyOf`. Display only.
  - FOR THE CONTESTED ROWS: a decision, not a cure. Either the diffuse lines take a twin where the crime-wave hook "is
    coordinated" stands (and the hook is then no hidden twist), or the hook is refused where the structure is diffuse.
    Refusing the hook moves the stored hook draw (`history` hooks), and THE OWNER'S CALL ON RULE 2 OF THE SECOND CHECK
    decides it.
- **THE CRIME WAVE AND THE CURFEW (9a.wave, 9a.curfew).**
  - WRITTEN: `history.currentTensions` `crime_wave`, read today as `foundationBandShown.js :: crimeWaveStands` (and again
    privately in `lawBand.js :: crimeWave`).
  - NOT READ BY: `defenseDisplay.js :: ORGANIZED_RING_NOTES` (the syndicate "keeps the streets quiet"), `DS-DEF-3 › Safe ·
    v2`, and `DS-DEF-3 › COMPOUND: occupation curfew` ("ordinary theft has dropped"). Its sibling `CRIME_WAVE_TWINS`
    already reads it.
  - ONE LEAF: YES, `crimeWaveStands`, one exported reading; `lawBand.js`'s private copy should import it. Display only.
- **THE WATCH'S AND THE MILITIA'S OWN ROW (9a.watch, 9a.militia, 9a.manned, 9a.pay).**
  - WRITTEN: the defence roster (`defenseProfile.institutions`: watch, militia, garrison) and the card's mark. The lines
    are drawn in `safetyProfile.js` at the ECONOMY STEP, before the roster settles (lawBand.js's own header says so).
  - NOT READ BY: `paperTruth`, `generateSafetyProfile`'s `lawLine`, `patrolTruth` and `DS-DEF-11 › WALLED-STRAINED`.
  - ONE LEAF: a new leaf in the form of `lawBand.js` ("the force that keeps order, once": kept or not, paid or volunteers,
    marked, manned), read at print by those four. Display only, as long as it reads at print and does not redraw
    `guardEffectivenessDesc` (that would move the stored record: `safetyProfile`).
- **THE PURSE AND THE ECONOMY'S LABEL (9b.subsistence, 9b.purse).**
  - WRITTEN: `economicState.prosperity`, the Prosperity word.
  - NOT READ BY: `labelBands.js :: COMPLEXITY_LABEL` "Subsistence — survival economy", a complexity label that prints as
    if it were a prosperity line. The cure is the label's own twin at Comfortable or better ("Subsistence economy"), at
    print. It moves nothing, because `economicComplexity` stays.
  - 9b.purse: the borrowing relationship (`npcData.js`) is drawn for a public-purse holder where the town's prosperity
    line says the purse has a little over. Refusing that draw would move the stored `relationships`. A twin at print
    would not.
  - ONE LEAF: the prosperity rung already exists (`prosperity.js`); the two readers are what is missing.
- **FOOD (9c.\*).**
  - WRITTEN: BAR5-FOOD's ruling FD1 makes the food word one leaf: the word THE PAGE PRINTS (`foodBandOf`). Beyond it,
    LAW 9 finds three facts that are not the word.
  - (i) THE STORES: `DS-DEF-2 › CHAIN: food trades failing · v2` ("less is being put by than ought to be") does not read
    the endurance figure that `defenseDisplay.js :: foodEnduranceLine` prints two lines below it. It should be refused at
    a granary of twelve months or more.
  - (ii) THE SURPLUS: `DS-DEF-12 › CAPACITY: enough · v2` ("leaves nothing over") does not read `foodRecord.surplusPct` /
    `growsMoreThanEats`.
  - (iii) THE CHANNEL: `EconomicsTab.jsx :: foodSentence` says "carts" for every import, whatever
    `foodBalance.importChannel` says. And "No recorded imports." reads the trade list, not the food import printed four
    lines below it.
  - `9c.reassure` is half BAR5-FOOD (c): 4 of the 720's 8 are a stored Secure under a printed Pressured. The other half
    is `DS-ECO-9`'s "several sources" pool printed under a printed Pressured: it should read the printed word.
  - ONE LEAF: YES, the food record (`foodBalance.js` / `foodRecord`) with the printed band. Display only.
- **TRADE ACCESS (9d.isolated, 9d.no-exports).**
  - WRITTEN: `spatialLayout.tradeAccess` / `config.tradeRouteAccess` = isolated, which in these towns means a poor road
    and seasonal tracks. Meanwhile `foodBalance.importChannel` = "minor routes and sanctioned caravans" carries 5% to 21% of the food (every instance).
  - NOT READ BY: three writers read "isolated" as NO TRADE (`economicState.js` line 663, `viability.js` line 531,
    `crisisDependence.js`). They should read the import channel: "isolated" with a road channel is the poor-road twin
    ("the way out is unreliable"), which the page already prints elsewhere.
  - NO-EXPORTS: `EconomicsTab.jsx` line 481 prints "No significant exports." (both towns are famine villages whose livestock export is marked failed; unverified whether the tab's list drops the failed export), but the Resources tab still says the raw material moves (`DS-ECO-11`). The two should read one
    filtered export list.
  - ONE LEAF: a trade-reach reading of `importChannel` and `primaryExports`. Display only.
- **MAGIC'S OWN ROWS (9e.\*).**
  - WRITTEN: the reliance row (`magicProvisionShown.js :: relianceReadingShown` plus its "for …" list).
  - NOT READ BY:
    - `DS-DEF-9`'s NAMED-chain pool (9e.leans). It reads `namedMagicChainGood`, the first chain with a magic note, and
      that chain is not one the row names. The pool should draw its chain FROM THE ROW'S LIST, or refuse.
    - `DS-DEF-9 › FLAG: magicMilitarized` (9e.military). The flag is drawn (`priorityHelpers.js`, line 634) without the
      arcane houses' backing. A display cure reads the "Backs" faction and the Military role and refuses at absent or
      where no house backs a military power. Excluding at the draw would move the stored flag.
    - `arrivalProse.js :: ARRIVAL_SENSES`' "nobody sells enchanting … done quietly" (9e.quietly), which should declare
      `needs: reliance ≤ present` and no enchanting chain.
    - `DS-FTH-4 › heresySuppression: hunted` against the envelope's religious acceptance (9e.heresy). The record's
      `safetyProfile.flags.heresySuppression` and `magicProfile.religiousAcceptance` disagree. ONE OF THE TWO IS THE
      STORED RECORD'S ERROR: the envelope should read the flag, which moves the stored `magicProfile`, or the Faith line
      should read the envelope (display).
  - ONE LEAF: YES, for 9e.leans / 9e.quietly / 9e.none: the shown reading and its list (BAR5-MAGIC's leaf). 9e.military
    and 9e.heresy are each a pair of stored fields.
- **LEGITIMACY (9f.loyal).**
  - WRITTEN: `powerStructure.publicLegitimacy`.
  - NOT READ BY: `narrativeText.js :: PRESSURE_SENTENCES` (wartime, the losing variant), which writes "The settlement is
    loyal." unconditionally. It should take a twin under `isLegitimacyCrisis` ("The settlement obeys; it is not loyal").
  - THIS ONE MOVES THE STORED RECORD: the sentence is stored (`pressureSentence`, a top-level record key; checked on
    r2s-wartime-thorp-0 of the 720). A twin at the draw changes that field in every wartime town under a legitimacy
    crisis (4 in the 720, 2 in the fresh 300). Count the reference configurations it moves at the round's usual measure
    before cutting.

## 5 · THE OVERLAP WITH THE ROUND IN FLIGHT

| rule | the seat that holds it | the 720 (instances) | what the round holds |
|---|---|---|---|
| 9a.band-quiet | BAR5-BAND (LB1) | 45 | all: the four conditions are LB1's own |
| 9a.collapsed | BAR5-SAFETY (`L2.law.collapsed`, guard line under the band) | 55 | all the safety lines under the band (`NO_WATCH_SMALL`, `COURT_AND_PRISON`) |
| 9c.fish-stopped | BAR5-FOOD (b) | 5 | all |
| 9c.game | BAR5-FOOD (d) | 13 | all |
| 9e.none | BAR5-MAGIC | 24 | all (LAW 1 rule 1a) |
| 9c.reassure | BAR5-FOOD (c), in part | 4 of 8 | the stored-Secure, printed-Pressured towns; the other 4 are the pool unconditioned on the printed word |
| 9e.leans | BAR5-MAGIC, in part | 0 of 21 by fact | the reliance WORD agrees with the line (Relied upon / Integral); what disagrees is WHICH TRADE, which BAR5-MAGIC's section does not name. The line's block DS-DEF-9 is that seat's file |
| all 9a rules beyond the band | none by fact | 41 | their files are BAR5-SAFETY's list (`safetyProfile.js`, `safetyLineTruth.js`, the DS-DEF blocks) but its fact is the band, not the structure, the wave, or the force's own row |

- **HELD BY THE ROUND IN FLIGHT:** 142 of the 720's 275 counted instances (52%). The chair should find them GONE at that
  round's joined tree: run `runE.mjs` there.
- **THE NEXT WAVE'S:** 133 instances in 110 towns of the 720, 47 distinct sentences.

## 6 · FOR THE OWNER, IN PLAIN WORDS

When one part of a town's page states how things stand (how lawful it is, how organised its crime is, whether its food is
short, whether trade reaches it, what its magic is for, whether its people accept their rulers), other sentences elsewhere
on the same page often say the opposite.

- **HOW DEEP THE STOCK IS:** in the census's 720 towns, 232 towns (about one in three) carry at least one such sentence.
  There are 275 in all, but they are only 72 different sentences, each repeated across many towns.
- **WHAT THE ROUND UNDER WAY CLEARS:** about half (142). That half is the law-and-order rating in quiet small places, the
  safety lines under a collapsed rating, the fish and game on the table, and magic said to be relied on where the page
  says it is not.
- **WHAT IS LEFT:** 133 instances in 110 towns, from 47 sentences. That is about one town in six or seven.
- **HOW MUCH ONE FACT CLEARS:** each remaining sentence is written in one place. Each disagrees with one fact that already
  exists in the code and that the sentence simply does not look at, so a cure is one fact read in one place, and it
  clears that sentence in every town at once:

  | fact the sentences should read | towns it clears in the 720 |
  |---|---:|
  | the crime structure and the crime wave | 30 |
  | which trades magic actually props up, and whom its houses back | 31 |
  | the import route (and the export list) | 21 |
  | the food record's own figures | 16 |
  | the force that keeps order (watch, militia, walls, pay) | 10 |
  | the town's prosperity | 5 |
  | whether its people accept their rulers | 4 |

  (A town can carry more than one; together they are the 110 towns.)

- **NONE OF THESE CHANGES WHAT A TOWN IS.** They change what its page says about it. The exceptions are two magic facts and
  the wartime "loyal" line (stored as `pressureSentence`), which would change stored data and need a count first.
