# Cold reader brief (REVIEW-POWERS-FU)

You are one of ten cold readers for an independent reviewer of a fantasy-settlement generator (settlement-engine).
You fix nothing and change nothing in any repository. You only read files and write ONE output file.

## What you read
- Rendered dossiers: `/home/user/wt/cold-tip/dumps/<seed>.txt`. Each is the whole owner's view of one generated town
  (every group, sub-tab and disclosure opened). Lines `== Group/Tab ==` start a view; every other line is one block of
  visible page text (a line may repeat across views; it is kept once per view). The last view, `== Table/Tonight sheet ==`,
  is the Tonight sheet the game master opens at the table.
- The town's record (the generated data the page is drawn from): `/home/user/wt/cold-tip/records/<seed>.json`
  (large: query it by script, e.g. `node -e` or `jq`, never print it whole). Useful paths: `tier`, `population`, `name`,
  `stress` (the crisis in force, or null), `config`, `institutions[]` (name, category), `powerStructure`
  (`factions[]` with their members, `government`, the seat / vacancy / claimants fields, `criminalCaptureState`),
  `npcs[]` (each person: name, title/role, category, house/institution, influence, power, importance, faction ties,
  structural lines such as position, constraint, goal), `relationships`, `history`, `economicState`, defence fields.
  Grep the record for any key word you need.
- The source tree at the reviewed commit: `/home/user/wt/tip` (read-only). `git -C /home/user/wt/tip grep -n -F "<a fixed run
  of the sentence>"` finds a line's source. Page code lives in `src/components/**` and `src/domain/**`; generated words in
  `src/generators/**` and `src/data/**`.
- DO NOT open any hand-back, review, charter, record or commit message (`docs/chair/**`, `docs/**` records, `git log`):
  this read is cold.

The towns were born the way the app births them: `birthConfig({...DEFAULT_CONFIG, settType, selectedStressesRandom:false,
selectedStresses:[...]})`, every other dial random as the app ships it. Seed `rpf-<size>-<crisis or calm>-13`: `calm` = no
crisis forced; a crisis name = that crisis forced; `a+b` = both forced. A forced crisis can be declined by the generator;
the record's `stress` says what is in force.

## Your scope (read these views END TO END, every line)
1. `Systems/Power` (the whole tab: the seat row, the powers and their ranked members, the ruling few, the DM-only block
   "Who really runs …", claimants, stewards or keepers of an empty seat, tensions, every disclosure).
2. `World/NPCs`: EVERY person's card (name, title, house, the influence dots and bands, position, constraint, goal,
   secrets, ties, faction lines).
3. `World/Relationships`.
4. `World/Rumors & News` (the news).
5. `Table/Tonight sheet`.
You may read the rest of the dossier for context (e.g. `Summary/Crisis`, `Systems/Institutions`), but list only sentences
from the five views above.

## What you look for
For each sentence ask: is it true of THIS town, by its record and by the rest of its own page? Pay particular attention to:
- who holds the seat, who keeps an EMPTY seat (a vacancy), who claims it, and whether each card agrees with the Power tab
  (a person said to hold, keep or claim the seat who does not; a keeper said to lead a body that contends for the seat;
  a subordinate line on the card of the person who holds the seat);
- noble powers (houses, gentry, peerage, landed families, highborn circles) and who faces or leads them: is that person a
  noble by their title and house, or a tradesperson (a miller, a mine captain, an impresario)? Does a lord's or lady's title,
  house, influence band, or claim read true against the record and the rest of the page?
- every person named on one view is on the people list and is described the same way elsewhere (title, house, office);
- possessives and plurals ("the craft guilds's"), doubled office words, a title over a different number of names
  ("the ruling three" over two names), broken text.
Kinds:
- (a) names a house, a role, a force, a good or a place the town LACKS;
- (b) DENIES something the town HAS;
- (c) presumes a STATE that is not so (normal times under a crisis in force; a crisis the town does not have; a ruler,
  holder, keeper, claimant or power that is not the record's);
- (d) a SIZE that is not so; (e) a COUNT that is not so; (f) a FIGURE against the record's;
- (g) TWO PLACES ON THE PAGE THAT DISAGREE (one tab says X, another says not-X);
- (h) BROKEN or INTERNAL text (`undefined`, `NaN`, `[object`, a `{slot}`, an identifier, a catalogue name with a count range,
  a cut or ungrammatical sentence, a bad possessive, the machinery of a rating: points, sums, shares, limits).
Verify each candidate against the record (query it) before listing it. If the record cannot settle it, say so in `fact`
and give it LOW. A sentence that is merely dull, repetitive or awkward but true is NOT listed.

Severity: HIGH = a plain false statement a GM would read out and be wrong about the town at a glance (a ruler, holder,
house, force, crisis, size or count that is not so; normal times under a crisis; broken text). MED = false when checked
against the record or another part of the same page. LOW = a stretch, a doubtful case, a nuance only a careful reader catches.

## What you write
ONE file, `/home/user/wt/cold/reader-<N>.json` (your number is in your task): a JSON array, one object per false sentence:
`{"town":"<seed>","tab":"<Group/Tab>","sentence":"<verbatim page text, the whole line as printed>","kind":"a|b|c|d|e|f|g|h",
"mechanism":"<names a house, a role or a force the town lacks | presumes normal times under a crisis in force | a figure
against the record's | names a resource, a good or a chain state that is not so | a size | two homes that disagree |
internal text | a count | denies a house, force or crossing the town has | a ruler, a power, a holder or a claimant that is
not so | broken text | other: <say>>","fact":"<the record path and value it contradicts, quoted; and/or the other page line
it contradicts>","source":"<file:line or symbol in /home/user/wt/tip, if you can find it; else ''>","severity":"HIGH|MED|LOW"}`
Copy `sentence` EXACTLY as it prints in the dump (the reviewer matches it by script). List a sentence once per town and
view. Be complete: a false sentence missed is the costly error. Write an empty array if a town has none.
Your final message: the count by severity per town, and the three you are least sure of. Nothing else.
