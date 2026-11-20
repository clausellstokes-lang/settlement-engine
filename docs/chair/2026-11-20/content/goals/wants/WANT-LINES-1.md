# WANT-LINES-1 · the wants' tranche, file 1 of 7: 60 new DRAWN lines, the worst cells first

> **READ BY THE CHAIR 16:33 UTC: 58 approved, 2 reworded as below** (word for word, the chair's): RANK/enter/short line 11
> → "Stand in for any member of {power} who falls ill this season, and keep their work going until they are back.";
> RANK/enter/long line 2 → "See someone of their own choosing follow them into {power}, starting higher than they did."
> The reason, carried into every later file: no line may state something about a person or member the record may not
> hold (a cleric or a childless card holds that cell): no line presumes a family, child, spouse, health, or a member's
> state the record may not hold.

GOALS-3 · builder 9 · 2026-11-20. Docs only: TEXT for the chair's reading and the owner's veto; nothing is built from it
until the chair has read it. The cells and counts are the first 60 lines of the build order in
[`WANTS-PROPOSAL.md`](WANTS-PROPOSAL.md) (`wants-by-pool.out.txt`, "THE BUILD ORDER", file 1). Each line is APPENDED to
the END of its cell in `src/data/people/goalFamilies.js :: GOAL_FAMILY_LINES` (a drawn line, never the reserve: only a
drawn line lowers the sameness across towns).

**What file 1 buys (measured by birth with THESE 60 lines appended in memory, the 300 measure towns,
`wants-verify.lines1.out.txt`):** a second city's short wants repeat 36.4% → 25.0% of a first city's, its long wants
36.0% → 26.1%; a metropolis 47.3% → 36.4% and 47.2% → 37.0%. The cost, fact (1) of the proposal: 7,939 of the 17,992
holdings change text (3,954 onto a new line, 3,837 to another line of their cell, 148 the cascade), in 264 towns. The
lane's gate measure (`goals-final.mjs`, unchanged, over the tree with these lines; `wants-goals-final.lines1.out.txt`):
identical 0 → 0, refusal 0 → 0, mirror 83 → 85 (both on an existing POWER/tense line, by the cascade; none on a new
line).

**How each line was written.** Every line keeps its cell's voice, register, tense and slot contract: a SHORT line is a
concrete thing to do or fail at this season, a LONG line a direction for the life; the person is never named (they,
them, their); only the cell's own slots (`GOAL_SUBKIND_SLOTS`); no article before a slot; no "'s" on a power or a house;
no verb that must agree in number after a power or a house slot (an agreement form `{power|one|many}` where the line
needs one); no `needs`, no `excludes`, so no fact-vocabulary atom at all. Every line is a different want from every line
of its cell (drawn and reserve), of its other vantage and of its neighbours, and quotes no other family's pool. No line
is keyed to a trade (the cells have no trade slot, and J-16 keys no goal by title): each is written to the common ground
of the offices and trades that hold its cell (listed per cell, from `wants-by-pool.out.txt` (B), the city and
metropolis towns), so it reads true for every holder. Style law: WIRING-RULINGS §5–§8 (plain and concrete, human
stakes, no ornament, no machinery), STYLE-RULINGS §2 (the struck tics), WAVE-RULINGS item 16.

**The checker.** `want-lines-check.mjs` lifts `shapeViolations` verbatim from `tests/data/goalFamilies.test.js` and runs
it over a scratch table: every cell's lines, its reserve's, and these 60 appended. Result: **0 violations**
(`want-lines-check.out.txt`), and no new line repeats another in any case.

**The gates, per kind of cell.** TIES/rival_enemy lines hold on the harshest tie the cell is dealt on (a mortal enemy, a
bitter rival, a tie of mutual leverage): none is gentle, so `GOAL_LINE_NOT_ON_TIES` needs no new row. TIES/ally lines
hold for an ally, a respect and a working patron-and-client arrangement. The one two-name line (RANK/climb) has no
mirror among the cell's lines. No line is in a refused cluster (conviction, duty).

---

### 1 · RANK/enter/short · +15 (cell 6 → 21)
Holders: unranked members of a power; in the cities and metropolises mostly the masters of a craft or trade (senior
charter master, master smith, master fishmonger, potter, tailor, warehouse factor, bowyer, master weaver, brewer,
furrier), then officials, guards, clergy and mages; their power is a merchant or craft guild about three times in five,
else a council or governorship, the guard, the church, an order or a noble house.

Existing (two of six, verbatim):
- Do one thing for {power} this season that the people who lead {power|it|them} cannot ignore.
- Take on the work in {power} that no one else wants, and do it without complaint.

New:
1. Bring one new member into {power} this season, and vouch for them.
2. Take a newer member of {power} under their wing this season.
3. Answer one public complaint against {power} this season, and answer it well.
4. Put a proposal of their own before {power} this season, and see it carried.
5. Arrange the next gathering of {power}, and see that it goes well.
6. Be trusted with the keys, coin or papers of {power} this season, and hand them back in good order.
7. Catch a costly mistake in the business of {power} before it is made, and quietly tell someone who leads {power|it|them}.
8. Make a friend this season of one member of {power} who has been there far longer than they have.
9. Win {power} one new piece of business or one useful friend that {power|it|they} did not have before.
10. Carry one grievance of the newer members of {power} to those who lead {power|it|them}, and come back with an answer.
11. Stand in for any member of {power} who falls ill this season, and keep their work going until they are back.
12. Learn the work of one office in {power} this season, well enough to fill it if it falls empty.
13. Keep a careful account of everything they do for {power} this season, so no one else can claim it.
14. Speak well of those who lead {power} all season, and make sure word of it reaches them.
15. Turn down a better offer from outside {power} this season, and let it be known why.

### 2 · RANK/enter/long · +16 (cell 6 → 22)
Holders: as the short cell (senior charter master, customs collector, prison warden, cobbler, bowyer, glassmaker, dyer,
brickmaker, master carpenter, bath-keeper); merchant and craft guilds first, then councils, the guard, the church.

Existing (two of six, verbatim):
- Be counted one day among those who lead {power}.
- Become someone {power} cannot do without.

New:
1. Spend a whole working life in {power}, and be thanked for it at the end.
2. See someone of their own choosing follow them into {power}, starting higher than they did.
3. Open the doors of {power} to people like themselves, who were kept out before.
4. Win their own line of work a louder voice inside {power}.
5. Be chosen to bargain for {power} with outsiders, year after year.
6. Set down the ways of {power} in writing, so they are not lost when the old members die.
7. Hold the purse of {power} one day, and keep it honest.
8. Be remembered in {power} as the one who saw {power|it|them} through a hard time.
9. Leave {power} fairer to newcomers than {power|it was|they were} to them.
10. Never be passed over in {power} for someone with better friends.
11. Be able to count on {power} in any trouble, after years of standing by {power|it|them}.
12. Gather enough friends inside {power} that their word is never left standing alone.
13. Make their place in {power} pay well enough to live on.
14. Be the one who teaches every new member of {power} how things are done.
15. Keep {power} true to what {power|it was|they were} founded for, whoever comes to lead {power|it|them}.
16. Be given a say in who joins {power}, and choose well.

### 3 · TIES/rival_enemy/short · +9 (cell 5 → 14)
Holders: either end of a rivalry, an enmity or a tie of mutual leverage (fortune teller, master fishmonger, master baker,
warehouse factor, cooper, cobbler, bowyer, senior charter master, apothecary, scroll scribe); every office, a tenth of
them the underworld's. Each line holds on a mortal enemy, a bitter rival and a leverage tie alike.

Existing (two of five, verbatim):
- Find the weak spot in what {other} is doing, and press on it.
- Keep {other} from getting the thing they want most this season.

New:
1. Find out who {other} has been meeting this season, and what was agreed.
2. Take one customer or supporter away from {other} before the season is out.
3. Give {other} nothing this season that could be used against them.
4. Find one thing {other} would want kept quiet, and keep it ready.
5. Have an answer ready for whatever {other} tries next.
6. Warn their own people about {other} before any harm is done.
7. Undercut {other} on one piece of work this season, and win it.
8. Keep their own plans hidden from {other} until it is too late to stop them.
9. Find others who have reason to stand against {other}, and make common cause with them.

### 4 · TIES/rival_enemy/long · +4 (cell 5 → 9)
Holders: as the short cell (master fishmonger, chief magistrate, customs collector, whisper broker, luxury merchant,
woodcarver, fuller, master metalworker, enchanter, potter).

Existing (two of five, verbatim):
- Outlast {other}, and be the one still standing.
- Leave {other} with no power left to do them harm.

New:
1. Win over everyone who once took {other}'s side.
2. Know more about {other} than {other} knows about them, for as long as they both live.
3. Build something of their own that {other} can never take from them.
4. Keep {other} out of every house, circle and power where they themselves have a say.

### 5 · TIES/ally/short · +3 (cell 5 → 8)
Holders: either end of an alliance, a respect or a working patron-and-client arrangement (chief magistrate, scroll
scribe, bath-keeper, senior craft-guild master, master metalworker, apothecary, customs collector, master fishmonger,
brickmaker, the network's head).

Existing (two of five, verbatim):
- Stand by {other} in their next quarrel, whoever it is with.
- Do {other} one useful favour this season, unasked.

New:
1. Share one piece of work with {other} this season, and split what it earns fairly.
2. Put in a good word for {other} wherever it will count this season.
3. Settle any small grievance with {other} this season, before it can grow.

### 6 · TIES/ally/long · +4 (cell 5 → 9)
Holders: as the short cell (customs collector, warehouse factor, midwife, brewer, fortune teller, master butcher, smelt
master, senior charter master, bowyer, master baker).

Existing (two of five, verbatim):
- Keep the alliance with {other} strong for as long as both live.
- Protect {other} from anyone who would bring them down.

New:
1. Remember {other} in their will, and be remembered in theirs.
2. Never let {other} face a hard year alone.
3. Bring their two families together, so the friendship outlives them both.
4. Stay on the same side as {other}, whoever comes to govern here.

### 7 · INSTITUTION/solvency/short · +2 (cell 6 → 8)
Holders: whoever answers for a house's money (whisper broker, midwife, outfitter, senior craft-guild master, banker,
warehouse factor, potter, gang boss, master of granaries, nominal owner); nearly a fifth of the houses the underworld's,
so every line reads true of a smuggling network or a den as of a mill.

Existing (two of six, verbatim):
- Get {house} through the season without borrowing.
- Pay every hand at {house} in full and on time this season.

New:
1. Sell off whatever lies unused at {house} before the season is out, and keep the money.
2. Find out where money is slipping away at {house}, and stop it this season.

### 8 · INSTITUTION/solvency/long · +2 (cell 6 → 8)
Holders: as the short cell (the network's head, black marketeer, chief magistrate, scroll scribe, dean, guildmaster of
thieves, whisper broker, watch commander, tailor, beast master).

Existing (two of six, verbatim):
- See {house} out of debt for good, with money set aside for bad years.
- Make {house} too sound for any creditor to threaten.

New:
1. Own outright every tool and every roof used for the work at {house}, and pay rent to no one.
2. Make {house} a lender to others, never a borrower.

### 9 · INSTITUTION/charter/short · +1 (cell 6 → 7)
Holders: the head of a lawful house with rights from those who govern (dean, master of granaries, enchanter, chief
magistrate, hospital's master, crier, theatre manager, cobbler, master fishmonger, beast master).

Existing (two of six, verbatim):
- Get {house} excused from one tax or levy this season.
- Have the old rights of {house} read out and recognised before anyone challenges them.

New:
1. Win one quarrel over the rights of {house} before those who govern, this season.

### 10 · INSTITUTION/charter/long · +2 (cell 6 → 8)
Holders: as the short cell (garrison commander, master of granaries, chief magistrate, sawyer, outfitter, tailor,
hospital's master, warehouse factor, master furrier, potter).

Existing (two of six, verbatim):
- Secure rights for {house} that will outlast whoever governs now.
- Win {house} a lasting privilege that no other house can claim.

New:
1. Win {house} the right to choose whoever runs the house, without leave from those who govern.
2. Have {house} written into the laws here as a house no ruler may close.

### 11 · RANK/climb/short · +1 (cell 6 → 7)
Holders: the second or third of a power, {above} the one a place above (hospital's master, mint master, sage, college
master, chief magistrate, miller, warehouse factor, midwife, master of granaries, company captain).

Existing (two of six, verbatim):
- Be the one {above} sends whenever something must be done for {power} this season.
- Fix a problem {above} has left standing in {power}, and make sure everyone knows who fixed it.

New:
1. Get the members of {power} bringing their troubles to them instead of to {above}, this season.

### 12 · PERSONALITY/sway/long · +1 (cell 4 → 5)
Holders: a card whose temperament or flaw wants to be followed or deferred to (apothecary, ropemaker, fortune teller,
mint master, master of granaries, lady, toll-keeper, stable master, innkeeper, lord).

Existing (two of four, verbatim):
- Be obeyed without ever having to raise their voice.
- Be the person everyone here defers to.

New:
1. See their way of doing things become the way everyone here does them.
