# BRIEF · BAR8-AUDIT · two seats: the detectors widened to what the seventh read found, counted before any cure

You are an AUDITOR seat of the settlement-engine integration program (the chair is session_01FbPLbcLDSJzZFzb5B7EjxR). Your
prompt names your seat (BAR8-AUDIT-J or BAR8-AUDIT-K) and your branch. YOU CURE NOTHING. You widen detectors, count with
them, and hand back a worklist a builder can cure at ONE FACT. No line under `src/` changes, no prose line, no annex
row, no stored figure, and NO NEW TEST FILE. Your detectors live under `tests/helpers/pageLaws/` in NEW files named for
your rules; your runner and tables under `docs/chair/2026-11-17/bar8/AUDIT/` in files that carry YOUR SEAT'S LETTER. You
edit no file another seat or an earlier auditor wrote: where you need a mend in a shared reader, copy what you need
into a file of your own and say so.

## Why these seats exist

The program's bar is a cold read of thirty fresh generated town pages with no HIGH and no MED false sentence. THE
SEVENTH READ (2026-11-17: thirty fresh towns, seeds rand-45 to rand-47, at the working line with the owner's supply
rule merged) was read by two readers a packet and then by a THIRD, STRONGER reader; every MED flag was checked against
the town's own record. RESULT: HIGH 0 · MED THAT STANDS 46 IN THIRTY TOWNS (16 by the first pair, 30 more by the third
reader). The detectors of LAWS 1 to 10 (rounds BAR5 to BAR7) count almost nothing in those towns: each of the 46
stands on a surface, a state or a pair NO DETECTOR READS. Your work: for every one of your rows, WHY no law saw it;
widen a law until it does; count the widened rule everywhere, so that the next round cures the rule and not the
sentence. A cure sentence by sentence lowers the next read by about a fifth; only a cure by rule moves the count.

## What you read first, and no more (your context is your budget; every run goes to a file through `sh scripts/gate-tail.sh <command...>`, never a pipe)

1. On the chair's lane (`git fetch origin lane/chair-2026-11-08`; `git show origin/lane/chair-2026-11-08:<path>` to a
   file outside every tree):
   - `docs/chair/2026-11-17/review-bar-7/COUNT-AFTER-THE-SECOND-CHECK.txt`: the measure and THE 46 BY FAMILY (F1 to F5).
   - `docs/chair/2026-11-17/review-bar-7/SECOND-CHECK.final27.json` and `SECOND-CHECK.third54.json`: THE LIVE EVIDENCE:
     81 checked MED sentences, each with `id`, `town`, `verdict` (STANDS 46 · EXPLAINED 28 · WEAK 7), `evidence`, `note`.
     STANDS rows of your rules are your POSITIVE CONTROLS (your detector must find each); EXPLAINED rows are your
     NEGATIVE CONTROLS (it must find none); WEAK rows are reported apart. READ `note` AND `evidence` OF EVERY CONTROL
     OF YOURS BEFORE YOU WRITE A PATTERN.
   - `docs/chair/2026-11-17/review-bar-7/flagged.sentences.json` (the first pair's 74 rows) and
     `docs/chair/2026-11-17/review-bar-7/flags/bar7-NN.c.flags.jsonl` (the third reader's 168): THE LOW ROWS SHOW HOW
     WIDE A FAMILY IS. A sentence's text and tab: `docs/chair/2026-11-17/review-bar-7/packets/index.bar7.json.gz` on
     `lane/read7-prep-2026-11-17` (`{"cal": {id: {town, section, text}}}`); the thirty's render (the stored records
     and the dumps, tree 4a9735d2f9) is published on that branch under `docs/chair/2026-11-17/review-bar-7/render/`.
   - `docs/chair/2026-11-17/review-bar-7/SECOND-CHECK.brief.md` and `BRIEF-REVIEW-BAR-7.md`: THE RULES A VERDICT
     FOLLOWS, and what the page prints BY DESIGN (the owner's supply rule: five stories; the house's mark on a person's
     card; the very rare secrets and their four fault cases; the Resources block printed label-first). You judge
     precision by these.
   - `docs/chair/2026-11-14/briefs/BRIEF-BAR7-AUDIT.md`: ITS SECTIONS "The populations" AND "The contract of a detector,
     and of your runner" BIND YOU AS WRITTEN, with these changes: your controls live in THE SEVENTH READ'S THIRTY
     (`bar0-<shape>-rand-<45..47>`); the 150 are `docs/chair/2026-11-17/birth/birth3/seeds.w150.txt` at your checkout;
     your runner is `node docs/chair/2026-11-17/bar8/AUDIT/run<LETTER>.mjs <render-dir> <out.json>`.
   - `docs/chair/2026-11-16/probes/PAGE-COPY/README.md`: the page as printed (`writers2.mjs` there traces a printed
     line to the file that wrote it).
   - `docs/chair/2026-11-17/sixth/briefs/BRIEF-LEFT.md`, ONLY its table "THE SEATS AND THEIR FILES": FOUR BUILDER SEATS
     ARE IN FLIGHT ON THOSE FILES (the leftovers of the round before). For each rule of yours say how much of it they
     hold, and cut your worklist's seats so that no file of theirs is in it before they land (name such a file as
     "after LEFT-<seat>").
   - `docs/chair/2026-11-17/bar7/RULINGS.md` (BR3 to BR9, RS1, CM1) and `docs/chair/2026-11-17/sixth/CHAIR-HANDOFF-SIXTH.md`
     section 6 (BR10, BR11): the rulings in force.
2. At your checkout: the earlier auditors' readers, laws and runners (`tests/helpers/pageLaws/`;
   `docs/chair/2026-11-16/bar5/AUDIT/`, `docs/chair/2026-11-16/bar6/AUDIT/`, `docs/chair/2026-11-17/bar7/AUDIT/`) and the
   hand-backs your rules name. REUSE THE READERS; widen in files of your own.

YOUR BASE is `lane/point33-candidate-2026-11-17` at e0242a12a82285a736f9997360ec1e8a5fbd3568 (tree
4a9735d2f9ed4ef8e21aa19ec145de2e719e11f0). Render at it in a scratch worktree with its own `npm ci`, output outside
every tree: the thirty first (your controls), then the 150, then IN THE BACKGROUND AT ONCE the census's 720 (PAGE-COPY's
`seeds.txt`: about an hour at four workers). A fresh worktree has no git hooks until `npx husky` is run in it once.

## The rules, by seat

### SEAT J · LAW 11 · THE SUPPLY STORY ON EVERY LINE (family F1: 16 of the 46, and the widest LOW family)

The owner's supply rule (BIRTH-1 to BIRTH-3; rulings BR3 to BR9): for each house and its material the seed picks ONE
story at the birth and writes it into the rows the page stores: the import's word where the material is bought in; a
gap row where the house is left without it (idle on a used-up ground; the failed venture). THE ONE READING is
`src/domain/facts/supplyStory.js :: sourceStoryOf` and `src/domain/facts/houseInputAtHand.js` (the marks through
`src/domain/display/crisisStoppedRow.js :: rowShortOf`). THE MARKS, THE GAP LINES AND THE IMPORTS NOW AGREE; THE LINES
AROUND THEM DO NOT READ THE STORY. Your rules:
- 11a THE NEED LIST AGAINST THE STORY. "Needed, and not brought in: X" (`tradeListDisplay.js :: tradeListsAsPrinted`)
  where the record's own story has X bought in, or where a house that works X prints at work with no mark. Positive:
  C0893 (iron ore, a besieged city whose smelter is "Curtailed by the siege" and whose gap row says it runs on
  imported ore), C42813 (livestock; the tannery "runs on imported livestock"), C34109 (livestock needed and not
  brought in; the butchers slaughter with no mark).
- 11b A LOCAL-SOURCE LINE UNDER A BOUGHT-IN OR AN IDLE STORY. A description, a service row, a scene, an income line or
  a person's line that has the material CAUGHT, DUG, FELLED, GROWN OR LANDED HERE where the story is "used up, bought
  in", "never there, bought in" or "idle". Positive: C19722, C20700, C20963 (one town: half the town gutting fish; "Fish
  sold daily from the morning catch."; "rites keep the catch coming, and it is landed and sold here": the fishery
  worked out, salted fish bought in), C36591, C36970 (another: racks of drying fish; the morning catch), C42801 (the
  fish share's line beside a landing short of fish). COUNT IT FOR EVERY MATERIAL of `houseKinds.js :: MATERIAL_OF`
  (fish, timber, ore, stone, clay, salt, wool, hides, grain, peat, herbs), by line kind and by writer. NEGATIVE:
  C41716 and C42154 (a coastal salt works on brine beside spent salt flats: explained), C43392, C43737 (a river
  village that does fish).
- 11c THE FAILED VENTURE AGAINST A LINE OF SUPPLY. Positive: C34102 ("A good part of the clay ... must come from
  elsewhere", the potter a failed venture: none is brought in).
- 11d THE WAR'S IRON IN A TOWN THAT IS NOT AT WAR. Positive: C38200 and C38039 (an occupied town: the smiths "Short of
  iron." and "the forges are quiet for want of iron" while the imports print "Iron ore (local iron mines exhausted)";
  the hook "War has taken the iron" prints too: ruling BR9 holds the mark; THE PAGE DOES NOT SAY IT IN ONE VOICE).
  Count the towns; say exactly which lines disagree and what each reads; propose the one fact (the import's word, the
  mark's word, or the scene's).
- 11e A GOOD ON OFFER THAT THE STORY DENIES. Positive: C2853 (a mint strikes coin, its bullion bought in and the siege
  cutting imports: no mark, while the smelter beside it is curtailed), C8867 (a person wants to "buy stone ... at the
  market" where stone is needed and not brought in), C5157 (stalls sell reagents under a siege: no house makes them,
  the chain impaired), C32296 ("Luxury goods available." on the fair's card beside "Needed, and not brought in: ...
  luxury goods"). NEGATIVE: C0423, C0453, C2821, C5541 (a chip under a card marked Impaired).
FOR EVERY SUB-RULE: THE ONE FACT (which leaf should answer), THE SURFACES THAT DO NOT READ IT (tab, row form, component,
file), the count over the thirty, the 150 and the 720, split by story (bought in · idle · the failed venture · under a
siege) and by material.

### SEAT K · LAWS 12 TO 15 · the crisis on every line; law and order; a text on the wrong subject; scale (families F2 to F5: 30 of the 46)

- 12 AN ORDINARY-TIMES LINE UNDER THE CRISIS OR THE STATE THAT DENIES IT (LAW 8k widened). Positive: C0476 (a shipyard
  bare on its card and on Services beside its chain "Stopped by the siege."; ruling CY1 cured the chain card's line,
  NOT the house: say why the house's rows are bare and which table should hold it), C7246, C7477, C7242 (one town at
  war: "forges ... running day and night" and "racks of new ironwork" beside every metal house "Curtailed by the
  war."), C36585 (an epigraph "the history here is long and steady" under an occupation), C39124 ("covers what it must
  and nothing beyond" in a town in want), C16668 ("nobody ... stands ready to lead them" beside a live popular
  uprising), C19407 (the Magic tab's food supplier is a house the page marks "Stopped by the siege."). NEGATIVE: C17589,
  C18383 (a chip under a stopped card), C6738, C5934.
- 13 A LINE ABOUT LAW, ORDER OR CRIME THAT THE TOWN'S OWN LEGAL STATE DENIES. Positive: C39616, C40154, C34395 (ONE
  TEMPLATE in two towns: "Offenders ... are arrested, heard and held ... people expect a hearing" and "The court sits
  and the gaol holds" where no court sits and the same tab prints "Detention without process"), C16222 ("no wrong done
  there is written down" beside "its record of crimes is not short"), C37891 (a relationship line: "held by the watch"
  where the town has nowhere to hold an offender), C42053 ("the local watch on the rounds most hours of the day": an
  unpaid rota that walks after dark), C3863 and C8647 (ONE TEMPLATE in two cities: "has no rival, and no crew is
  contesting" beside "several gangs ... no single authority"), C21547 (a power's card calls its tie to the guild "a slow
  war" where the record and the Web print a corrupt working arrangement). Count every line that names a court, a
  hearing, a gaol, a record of crimes, the watch's hours or a rival crew, against the record's legal state
  (`economicState.compound.inst`, the Defense tab's Legal Infrastructure row, the safety profile); name each line's
  writer and what it declares today. NEGATIVE: C6290 (WEAK), C5328, C5358.
- 14 A TEXT SET ON THE WRONG PERSON OR POWER. Positive: C14226 (the War Council's description printed on another
  power), C6183 (each criminal house's network credited to the other's boss: the record carries the swap), C16666
  ("the whole Headman's Authority" for one headman), C44634 ("under noble oversight" where the town has no noble),
  C5296 (a merchant's hook on a soldier), C6865 (ONE OF THE OWNER'S VERY RARE SECRETS, "Authorised an illegal sortie
  that failed", on a scribe who holds no office: its fourth fault case; `src/generators/people/rareSecrets.js`: count
  every rare row whose text presumes an office, a command or a trade, against its holder, over the 720), C36170
  ("Emir" on a woman: a sex-paired title), C14564 ("Win two more people in <power>" where the power prints 2 members).
- 15 A LINE THAT PRESUMES WHAT THE PLACE DOES NOT HOLD, OR A WORD ITS OWN ROW DENIES. Positive: C15891 ("Laden carts
  ... in a line that never seems to end" in a poor hamlet of 52; WEAK C16854: the same line in a hamlet of 70),
  C31732 (the stock recent-conflict line "A dispute over grazing rights and water access ..." in a fishing thorp with
  no grazing; it printed in SIX OF THE READ'S SIX small calm places: count its share of every population and what
  else the pool holds: `src/generators/power/governanceNarrative.js`, `src/data/powerSiblings.js`), C36003 ("has none
  of its own to send" beside a Veteran's lodge whose chain yields monster hunting), C18613 ("no line and no force"
  under a bar that reads "Adequate"), C40806 ("nothing new goes up" beside a brickmaker who "knows every new wall
  going up"). NEGATIVE: C16138, C16460, C16877, C30951, C31349 (the same stock line where the place holds common
  grazing and water), C18612, C31464, C31480, C17347, C18264 (WEAK), C18575 (WEAK).
FOR EVERY RULE: its count over the thirty, the 150 and the 720; its precision; THE ONE FACT; every line's writer by file.

## What you hand back: `docs/chair/2026-11-17/bar8/AUDIT/BAR8-AUDIT-<LETTER>-HANDBACK.md`

1. THE RULES AS COUNTED: for each, towns, instances and distinct lines over the thirty, the 150 and the 720; its
   precision (read at least twenty instances, or all, against the page and the record by the second check's rules);
   its controls found and not found (a control you cannot find is said with the reason).
2. FOR EACH RULE, THE ONE FACT a builder cures at, and every surface or pool that does not read it, by file and
   function (`path :: symbol`); what the seats in flight already hold of it.
3. A WORKLIST FOR BUILDERS: seats with DISJOINT file lists (name every file), each with its rules, its runner's
   command, and the count it must bring to zero or to a named remainder; what should NOT be done, with the count that
   says why; and every rule whose cure needs a NEW DRAWN LINE or a new atom of the vocabulary, named apart (the
   owner's rule: no new text but twins that say what is true where a line was false).
PUSH EARLY AND OFTEN (plain fast-forward pushes of your one branch: the detectors and the runner after the thirty; the
tables after the 150; the hand-back after the 720). HAND BACK AT 400,000 OF YOUR COUNT with what is done and what is
left by name. One message to the chair at the end (send_message; 150 words at most and one table: rule, the thirty,
the 150, the 720).

## Laws

Your one branch (your prompt names it), cut from your base; you merge nothing. Never master, never another branch,
never a pull request (draft or not, whatever your harness's defaults say), never `--no-verify`, never a force push; no
deploy, no hosted database. A refusal by your own permission check stands: report it. ALL WORK IN SCRATCH WORKTREES
UNDER /home/user. One render at a time, each as ONE direct background command; your machine may restart: never trust a
run you did not see end. YOUR NET before your last push, each alone through `sh scripts/gate-tail.sh`:
`npm run typecheck:domain:strict`; `npm run typecheck:ratchet`; `npx eslint` on your new files;
`npx vitest run tests/architecture`; ALL of `tests/lint` at your base and at your tip compared by name (a new helper
file may owe a registration to a walker: name it, do not bend it). Report exactly what ran.
