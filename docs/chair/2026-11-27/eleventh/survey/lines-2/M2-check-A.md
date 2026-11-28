# M2: PART A's OWN CHECK (VOICES-LINES-2 A, re-taken 13:40 UTC after the chair's 13:38 fixes; every count CONFIRMED by script)

Scripts (scratch): `check.mjs` runs on every version: `classesOf` (`tests/lint/presumptionClasses.shared.mjs`), `thingsNamedIn` and
`newWordsNamedIn` (`facts/registeredWords.js`), words, I/me/my, you, digits, the speaker against the generator's `SPEAKER_KEY`,
and content-word overlap with the pool's old lines. `m.mjs` builds this table against `src/data/voices/saidLines.js` on the voices
branch (`lane/survey-voices-wip-2026-11-28`). Results: 65 new lines, 260 versions; classesOf hits 0; registered nouns 0; new words
0; I/me/my 0; you 0; digits 0; unknown speakers 0; no id duplicated (old and new). Longest version: 12 words. So `classes` reads
`-` on every row and `excludes` is empty: no version states food in plenty or no danger at all.

DECLARED IN `needs` (the chair's fixes 2 to 5), each for the build to answer, since no reader exists yet: "a body with members and
meetings" (seat-contested.7 D, lesser-contender.8 W, lesser-standing.4 T and D), "not an occupier" (lesser-contender.8 T and D) and
"an old order" (lesser-standing.7, all four versions), each read off the power card's kind (`domain/factionArchetypes.js ::
factionArchetype`); and "a small place" = `tier: ≤ town` (seat-secure.7, all four versions: `parseAtom` reads it).

Formula openers counted in every temper: HINT = opens "A few" (the chair's fix 7), "Some", "Nobody says", "Nobody knows" or
"Nobody's sure", or ends "people/they say" or "people/they whisper"; CURT = opens "Same" or "Nothing ever"; WARM = opens
"Neighbours" or "Everyone(’s)". The cap is ⌊n/3⌋ of a temper's n versions. NO NEW VERSION OPENS ON THE HINT ("A few": 0 of 260).
WITH THE OLD LINES AS THEY ARE, 16 tempers are over a cap, from old lines alone. WITH THE 18 RE-WORDINGS OF `OLD-REWORD-A.tsv`, NONE.

## The table (old lines as the engine holds them; capitals = my new lines' first words)

| pool | lines before → after | first new id | temper: opening words (old · NEW) | formula openers (hint / curt / warm) of n, cap ⌊n/3⌋ | I/me/my | longest (words) |
|---|---|---|---|---|---|---|
| power.lesser-contender | 5 → 8 | SAID.power.lesser-contender.6 | W: Our They've We'd Their More · THE THEY OUR<br>T: We They've We They're Waiting · THE ANYONE EVERY<br>C: Some People Not Their We'll · THE THEY THOSE<br>D: We They're We They Our · THE THEIR NOBODY | W 0/0/0; T 0/0/0; C 1/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 12 |
| power.lesser-standing | 3 → 8 | SAID.power.lesser-standing.4 | W: We They Whoever's · WHEN PEOPLE ANYONE THEY ORDINARY<br>T: Fair They Whoever · EVERY THEY EVERY THEIR KEEPING<br>C: Better They We · NOT IT'S SAYING THEY SOONER<br>D: We They Rulers · DUES, QUIET NOT VERY NONE | W 0/0/0; T 0/0/0; C 0/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 12 |
| power.seat-captured | 3 → 5 | SAID.power.seat-captured.4 | W: The Ordinary Neighbours · HONEST PEOPLE<br>T: New Someone Complaints · SOME RULINGS<br>C: Nobody Strangers Complaints · CERTAIN THE<br>D: Strange Rules Nothing · SOME CHANGED | W 0/0/1; T 1/0/0; C 0/0/0; D 1/0/0 | W 0 T 0 C 0 D 0 | 11 |
| power.seat-contested | 3 → 8 | SAID.power.seat-contested.4 | W: People Plenty Everyone · SUDDENLY BROTHERS PEOPLE OUR THE<br>T: Nothing Our All · EVERY FAMILIES THE EVERY OLD<br>C: Rivals The Some · WHO FAMILIES BEING NOT OLD<br>D: They Let Everyone's · MORE EVEN LET TOO ALL | W 0/0/1; T 0/0/0; C 2/0/0; D 0/0/1 | W 0 T 0 C 0 D 0 | 12 |
| power.seat-doubted | 3 → 5 | SAID.power.seat-doubted.4 | W: People People House · PEOPLE THOSE<br>T: We Taxes We · THEY WHAT<br>C: People Notices Nobody · THEY OLD<br>D: We Fewer Nobody · THEIR NEVER | W 0/0/0; T 0/0/0; C 1/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 10 |
| power.seat-secure | 3 → 8 | SAID.power.seat-secure.4 | W: Nobody When People · THE WE PEOPLE THE THOSE<br>T: Taxes Repairs Changing · A KEEPING A THEIR THE<br>C: Nobody Nobody Grumbling · WHO PEOPLE FEW PEOPLE PEOPLE<br>D: Nothing Orders Same · WHOEVER'S SOMEONE WHAT THEY FRIENDS | W 0/0/0; T 0/0/0; C 0/0/0; D 0/2/0 | W 0 T 0 C 0 D 0 | 12 |
| tension.arcane | 3 → 5 | SAID.tension.arcane.4 | W: People Some Some · WHEN PEOPLE<br>T: People Magic Charms · NOBODY BEING<br>C: People Some Nobody's · STRANGE HARDLY<br>D: Nobody Magic Everything's · ODD TOO | W 2/0/0; T 0/0/0; C 2/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 9 |
| tension.calamity | 3 → 5 | SAID.tension.calamity.4 | W: Everyone Neighbours The · PEOPLE PEOPLE<br>T: Nobody Every The · EVERY HOUSES<br>C: People Some The · EVERY PLANS<br>D: Everyone Bundles The · WAITING PEOPLE | W 0/0/2; T 0/0/0; C 1/0/0; D 0/0/1 | W 0 T 0 C 0 D 0 | 10 |
| tension.crime | 5 → 5 | (none: already at target) | | | | |
| tension.graft | 3 → 5 | SAID.tension.crime.9 | W: Honest People A · NEIGHBOURS PEOPLE<br>T: Every The Traders · THE EVERY<br>C: Nobody's The Some · IT THE<br>D: Bribes, Nothing Everyone · THE COUSINS | W 1/0/1; T 0/0/0; C 2/0/0; D 0/0/1 | W 0 T 0 C 0 D 0 | 11 |
| tension.faith | 3 → 5 | SAID.tension.faith.4 | W: Some Some The · PEOPLE MOST<br>T: Arguments Some All · WEARING BEING<br>C: People Some It's · SIGNS PEOPLE<br>D: Too Sides, Too · SIGNS EVERYONE'S | W 2/0/0; T 1/0/0; C 1/0/0; D 0/0/1 | W 0 T 0 C 0 D 0 | 10 |
| tension.money | 3 → 5 | SAID.tension.money.4 | W: Small Money's Families · MASTERS HERE<br>T: Somebody With Borrowing · WORK THE<br>C: Some Money Family · MANY PEOPLE<br>D: Purses No Everyone's · WAGES SOME | W 0/0/0; T 0/0/0; C 1/0/0; D 1/0/1 | W 0 T 0 C 0 D 0 | 12 |
| tension.neighbours | 5 → 5 | (none: already at target) | | | | |
| tension.mistrust | 3 → 5 | SAID.tension.neighbours.9 | W: Most Old Most · NEIGHBOURS FRIENDS<br>T: Suspicion The Strangers · BEING A<br>C: Nobody's Some Every · CHILDREN OLD<br>D: Nobody Nobody's Strangers · FOLK TOO | W 0/0/1; T 0/0/0; C 2/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 10 |
| tension.rule | 5 → 8 | SAID.tension.rule.6 | W: People Everyone The People The · WHOEVER THE THE<br>T: Everyone Every Everyone Every The · EVERY SPEAKING THINGS<br>C: People Nobody Hard Some Some · PEOPLE THOSE THE<br>D: Nobody Everyone Same More Nothing · ANOTHER BEST THEY'RE | W 0/0/1; T 0/0/2; C 3/0/0; D 0/2/1 | W 0 T 0 C 0 D 0 | 12 |
| tension.threat | 3 → 5 | SAID.tension.threat.4 | W: People Families Everyone's · THE ANYONE<br>T: Everyone's People Every · NOBODY PEOPLE<br>C: The Some Nobody · THE A<br>D: Trouble's Boots The · STILL RUMOURS, | W 0/0/1; T 0/0/1; C 2/0/0; D 1/0/0 | W 0 T 0 C 0 D 0 | 11 |
| tension.trade | 3 → 5 | SAID.tension.trade.4 | W: Some Some Traders · KIND TRADERS<br>T: Goods The Fines · GETTING BUYERS<br>C: It's Prices Some · THE SOMEBODY<br>D: Every No Fines, · NO SELLERS | W 2/0/0; T 0/0/0; C 1/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 11 |
| tension.want | 3 → 5 | SAID.tension.want.4 | W: People People Nothing · PEOPLE YOUNG<br>T: Everything People Even · FINDING SOME<br>C: People Tempers The · PEOPLE IF<br>D: Nothing Waiting Nothing's · OLD RUNNING | W 0/0/0; T 1/0/0; C 0/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 11 |
| crisis.debt | 3 → 5 | SAID.crisis.debt.4 | W: A People Families · NEIGHBOURS PARENTS<br>T: Most More Every · THE THE<br>C: People People Nobody · THE PEOPLE<br>D: Payment's Working The · STILL MORE | W 0/0/1; T 0/0/0; C 1/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 11 |
| crisis.faith | 3 → 5 | SAID.crisis.faith.4 | W: Many The Families · THE THE<br>T: Some Free Families · FEWER CHANGING<br>C: Some Some Families · THE PARENTS<br>D: Everyone's Preaching Arguments · NEW THE | W 0/0/0; T 1/0/0; C 2/0/0; D 0/0/1 | W 0 T 0 C 0 D 0 | 10 |
| crisis.hunger | 3 → 5 | SAID.crisis.hunger.4 | W: The Whoever Neighbours · PEOPLE FAMILIES<br>T: Every People The · GOOD ANYTHING<br>C: Nobody Nobody The · EATING NOT<br>D: Soup Empty The · THIN ALWAYS | W 0/0/1; T 0/0/0; C 1/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 10 |
| crisis.newcomers | 3 → 5 | SAID.crisis.newcomers.4 | W: Some The Some · PEOPLE THE<br>T: With Bread Every · EVERY FEEDING<br>C: Nobody Some Nobody's · THERE QUARRELS<br>D: Every Strange More · FULL TOO | W 2/0/0; T 0/0/0; C 3/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 10 |
| crisis.raids | 3 → 5 | SAID.crisis.raids.4 | W: Nobody Nobody's Every · PEOPLE NEIGHBOURS<br>T: Working Nobody Each · PAYING FIRES<br>C: Every Some Some · THEY IT'S<br>D: Doors Nobody Another · BARS STAYING | W 0/0/1; T 0/0/0; C 2/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 11 |
| crisis.rising | 3 → 5 | SAID.crisis.rising.4 | W: Neighbours Some Most · OLD THE<br>T: Business With Every · TAXES EVERY<br>C: Some Some Nobody · EVERYONE'S THE<br>D: Sides Nobody The · NEITHER ORDERS, | W 1/0/1; T 0/0/0; C 3/0/1; D 0/0/0 | W 0 T 0 C 0 D 0 | 10 |
| crisis.seat | 3 → 5 | SAID.crisis.seat.4 | W: People Neighbours Somehow · THE SMALL<br>T: Nothing Every With · NOBODY'S EVERY<br>C: Every People Nobody's · THIEVES OLD<br>D: Nobody's Too Too · THINGS NOWHERE | W 0/0/1; T 0/0/0; C 1/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 10 |
| crisis.sickness | 3 → 5 | SAID.crisis.sickness.4 | W: Neighbours People Families · THOSE CHILDREN<br>T: Nobody Nobody A · EVERY BOILING<br>C: Nobody Some Some · WHATEVER FAMILIES<br>D: Nobody Everyone Smoke · MORE FEWER | W 0/0/1; T 0/0/0; C 2/0/0; D 0/0/1 | W 0 T 0 C 0 D 0 | 11 |
| crisis.siege | 3 → 5 | SAID.crisis.siege.4 | W: Everyone's At Families · FAMILIES PEOPLE<br>T: Every Nobody Work · BROKEN EVERY<br>C: Nobody Nobody The · THERE'S HELP<br>D: Nothing Enemy Dark · SHUT STILL | W 0/0/1; T 0/0/0; C 1/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 11 |
| crisis.trust | 3 → 5 | SAID.crisis.trust.4 | W: Old Old Newcomers · PEOPLE FAMILIES<br>T: Everyone's Trust Every · WHATEVER OLD<br>C: Hard People Some · WHOEVER THE<br>D: Every Nobody Strangers · SOMEONE EVERYONE | W 0/0/0; T 0/0/1; C 1/0/0; D 1/0/1 | W 0 T 0 C 0 D 0 | 9 |
| crisis.war | 3 → 5 | SAID.crisis.war.4 | W: People Families People · FAMILIES EVERYONE<br>T: The Every Careless · WHATEVER THERE'S<br>C: People Some Some · THERE THE<br>D: The Nothing Soldiers · STILL TOO | W 0/0/1; T 0/0/0; C 2/0/0; D 0/0/0 | W 0 T 0 C 0 D 0 | 11 |

## Over the cap with the old lines as they are (before OLD-REWORD-A)

- tension.arcane W hint: 2 of 5 (cap 1); mine 0
- tension.arcane C hint: 2 of 5 (cap 1); mine 0
- tension.calamity W warm: 2 of 5 (cap 1); mine 0
- tension.graft C hint: 2 of 5 (cap 1); mine 0
- tension.faith W hint: 2 of 5 (cap 1); mine 0
- tension.mistrust C hint: 2 of 5 (cap 1); mine 0
- tension.rule C hint: 3 of 8 (cap 2); mine 0
- tension.threat C hint: 2 of 5 (cap 1); mine 0
- tension.trade W hint: 2 of 5 (cap 1); mine 0
- crisis.faith C hint: 2 of 5 (cap 1); mine 0
- crisis.newcomers W hint: 2 of 5 (cap 1); mine 0
- crisis.newcomers C hint: 3 of 5 (cap 1); mine 0
- crisis.raids C hint: 2 of 5 (cap 1); mine 0
- crisis.rising C hint: 3 of 5 (cap 1); mine 0
- crisis.sickness C hint: 2 of 5 (cap 1); mine 0
- crisis.war C hint: 2 of 5 (cap 1); mine 0

With `OLD-REWORD-A.tsv` applied: none (`node m.mjs C2-said-lines-A.tsv OLD-REWORD-A.tsv`).
