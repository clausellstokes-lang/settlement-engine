# Cold read brief (REVIEW-W2-FIX-DATA, step one)

You are a cold reader of generated tabletop-RPG settlement pages. You know nothing of the code. For each town you are
given a packet: <scratch>/mine-tip/<id>.packet.txt. Its first five lines are FACTS taken from the town's record (size,
population, terrain, trade access, culture, the crisis/stress, the defence institutions, the full institution list).
Then the page's own text: tabs overview, institutions, services, history, traditions, daily_life, defense, and the
Tonight sheet.

READ, as the owner would, EVERY sentence of these kinds:
- institution descriptions (institutions tab: the line under each institution name),
- service lines (services tab: the line under each service name, and the service names themselves),
- arrival beats (the "arrival" / first-impression lines; overview, daily_life or tonight),
- history lines (history tab),
- culture lines (traditions, daily_life, culture/identity lines on the overview).
Check each against what THE SAME PAGE / the FACTS say the town has. A sentence is FALSE when it asserts or presumes
something the town lacks or contradicts (an institution it does not have: a market, walls, a watch, a garrison, a
harbour, a guild; a size wrong for the population; a state wrong for the crisis: trade/travel/caravans/visitors while
under siege, plenty while in famine, an occupier absent; a terrain wrong: desert/sea/mountain lines in a town of other
terrain; a count wrong). DOUBTFUL when it is probably false or reads oddly against the facts but you are not sure.
Also flag any sentence that shows MACHINERY (points, shares, percentages of a model, rule names, "because the
generator...", explanations of how a value was worked out): the owner's law is that the page shows facts and ratings
and never the machinery.

Do NOT flag: sentences that are true; style you dislike; repeats. Do NOT read any file under docs/chair/, do NOT read
git history or diffs. You may grep the source tree to attribute a sentence.

SOURCE: for each flagged sentence, find the literal it came from: grep -rn -F -i a distinctive 20-40 char fragment
(no names, no numbers) in <scratch>/tip/src (data files mostly under src/data/). Tier nouns (village/town/city...) and names
are substituted, so pick a fragment without them. Record file:line, or "unfound".

OUTPUT: write ONE JSON file <scratch>/cold/<your-letter>.json: an array of rows
{ "town": "<id>", "tab": "<tab>", "kind": "institution|service|arrival|history|culture|other",
  "sentence": "<exact sentence as printed>", "verdict": "FALSE|DOUBTFUL|MACHINERY", "severity": "HIGH|MED|LOW",
  "fact": "<the fact it contradicts, quoting the packet>", "source": "<file:line or unfound>" }
HIGH = an owner would see the contradiction at a glance on the same page; MED = a second read finds it; LOW = only a
cross-check. Be exhaustive within these kinds: every institution description and every service line in every town.
Reply with only: the file path, the number of rows by verdict, and towns read.
