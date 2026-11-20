# Brief: WRITE-TIES (DEPTH-1's writer; written 2026-11-20 14:40 UTC)

You write 80 NEW TIE PAIRS (a description and its tension) as two review files. You change NO source file, run no test, take
no census, commit nothing (DEPTH-1 reads your files line by line, commits them and sends them to the chair; nothing is built
before the chair's word; the tie pools' file belongs to another seat until the chair says).

## Why
The owner (2026-11-20, verbatim): "Sameness between settlements shrinks but stays." and "A calm town should be as it currently
is… Don't invent drama capitalize on what's already there if it's there… We are not creating the campaign." Two cities repeat
63% of each other's tie descriptions. New pairs APPENDED to six archetypes lower that (measured: to about 37% at city size).

## How a tie's line works (read, do not edit)
`src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS[<archetype>]`, built by `pairProse('d', [...])` and `pairProse('t', [...])`;
`src/generators/power/relationshipArchetypes.js :: createTieProseDraw`. ONE index picks the description AND the tension at
the same place: so each new index is a PAIR, written as ONE beat (TAIL-TIES T2, "one state for the pair": the tension is a
present turn of the very situation its description states, never a contradiction of it, e.g. old_debt desc "repaid in small
amounts ever since" / tension "has offered to clear what is left in one payment"). `r` is the tie's first card, `s` the second;
old_debt writes the DEBTOR first (`r` owes `s`). Lines name both cards by `${r.name}` / `${s.name}`; a later mention in the
same sentence is shortened by the house (`data/people/personMention.js :: secondMentions`). Use no he/she; "their" where needed.

| archetype | label | write pairs |
|---|---|---|
| wary_alliance | Pragmatic Alliance (allies by reckoning, not affection) | 14 |
| peer_rivalry | Professional Rivalry (want the same thing; civil, unforgiving) | 14 |
| old_debt | Outstanding Debt (debtor first; a favour or a sum still owed) | 14 |
| mutual_leverage | Mutual Leverage (each holds something over the other; no trust) | 14 |
| mentor_legacy | Mentor and Successor (one made the other; a pupil now grown) | 12 |
| genuine_respect | Genuine Respect (a long record of kept words; trust) | 12 |

## The rules (the chair's, binding every line)
1. A description is TRUE OF ANY TWO PEOPLE OF THAT ARCHETYPE in any town, whatever their trades (a smith and a priest, a
   clerk and a farmer): no shared trade, shop, contracts, clients or apprenticeship presumed (those lines exist with twins;
   yours need none); no council, vote, seat, bloc, court, market, temple, guild, garrison, customs, harbour presumed.
2. The tension is a SMALL PRESENT TURN of the pair's situation, naming BOTH cards; NOTHING THAT READS AS AN EVENT OR A CRIME
   (no theft, violence, scandal, arrest, disappearance, plague, siege, fire); no season or date that a town's record may lack
   ("next week" is fine; "at midsummer" exists once already). Most towns are calm: the pair must sit in a calm town.
3. genuine_respect: write NO line that states the pair's trust as none; you may state full trust (it is then `trust: 'full'`:
   mark it [trust: full]). mutual_leverage: write no line stating full trust. No other archetype states trust either way.
4. Not a near-copy of an existing line or of another new one: a different situation, not a re-wording.
5. No proper names but the two cards, no numerals (words), no slots.

## Output (two files, in `docs/chair/2026-11-20/content/depth/lines/`)
- `TIES-1.md`: wary_alliance, peer_rivalry, old_debt (42 pairs). `TIES-2.md`: mutual_leverage, mentor_legacy, genuine_respect (38).
- Per archetype a heading, then per new pair one block:
  `N. NEW desc: "…"` / `   tension: "…"` (written with `R` and `S` for `${r.name}` and `${s.name}`), then two indented lines
  `beside: desc "…" / tension "…"` quoting two DIFFERENT existing pairs of the archetype at one index each (verbatim, R/S), so a
  reader sees the new pair in its archetype's voice.
- Then STOP and answer in at most 120 words: the two paths, the counts, any rule you found hard to keep and where.
