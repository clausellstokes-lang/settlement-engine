# BRIEF · READ-ALL · every distinct sentence the tabs print, read once against the hardest town that prints it

You are a READER seat of the settlement-engine integration program. Your prompt names ONE PACKET. You read that packet, every line of it, and flag every sentence that is false. You read no code, run no render and change no product file.

## Why this read exists

The program's bar is a cold read of thirty fresh towns with no HIGH and no MED false sentence on a generated town page. Cold reads of ten towns found about twelve false sentences a town; script censuses find one in eight of what a reader finds. So the whole population is read instead of a sample: the 720 census towns print about 31,000 distinct sentences on the tabs (names and figures aside), and each is shown here ONCE, as printed, under the facts of the hardest town that prints it. Your flags become the builders' worklist, ranked by how many towns print each sentence. A sentence you pass over is not looked at again by anyone.

## What a packet is

A packet is a list of BLOCKS. A block opens with `==== TOWN <seed> …` and eight header lines: THE RECORD'S OWN FACTS for that town. They are the truth you judge against.

- `TOWN`: the seed, the town's name, its size word (thorp, hamlet, village, town, city, metropolis), population, age, terrain, trade access, culture, magic, monsters.
- `CRISIS`: the stress the town is under, if any, and its live conditions.
- `GOVERNMENT`: the governing power, the stability and legitimacy words, and every power with its strength.
- `STATE`: the prosperity, safety and defence words, whether the town is viable, and the food ledger.
- `DEFENCE`: the walls and each kind of force the town has (`none` means none).
- `HOUSES`: EVERY house, trade and institution the town has: the whole list. A name that begins "Access to …" means the town uses a neighbour's and has none of its own.
- `TRADE`: what it exports, imports and makes.
- `FOUNDING`: who founded it and why; how many named people the town's roster holds.

Under the header, `## <tab>/<section>` headings and SENTENCE LINES: `<id> [x<N> <sizes> <crises>] <the text as that town prints it>`.

- The tag says where else the sentence prints (with other names and figures): in N of the 720 towns; from the smallest to the largest size (`th` thorp, `ha` hamlet, `vi` village, `to` town, `ci` city, `me` metropolis); and which crises are among its towns (`S` siege, `F` famine, `O` occupation, `P` plague). No tag: it prints in this town only.
- In `main-` packets a block lists only the sentences no earlier block showed (blocks run from the smallest and hardest towns to the largest), so a block is NOT a whole page. In `crisis-` packets a block lists sentences that also print in calm towns, shown again under a town in crisis: read them for the crisis above all. In `cal-` packets a block is a whole page and the ids begin with `C`.

NOT FAULTS (the dump's own artifacts): adjacent labels run together with no space ("Tallpatanthorp· 7 pop.", "Monster DefenseCritical", "Systems Health▲?Safety, viability…"); icons (▸ ▲ ?); interface words ("Open Tonight", "Open the Crisis tab"); a line that is only a label or a heading; a sentence that opens with a pronoun because it was cut from its paragraph.

## What to flag

Flag a sentence when you can say, from the header, from its tag, or from another sentence of the same block, WHAT MAKES IT FALSE.

1. `LACKS`: it names or presumes a thing this town does not have: a house that is not on the HOUSES list (a market, a mill, a guild, a temple, docks, an inn, a court, a granary, a smith…); a force, a wall or a gate that DEFENCE denies; a good or a route that TRADE and the trade access deny; people in numbers the population cannot hold (crowds, districts, quarters, wards, streets, "the guilds", a council of many, in a place of eleven); an office or a power that GOVERNMENT does not list.
2. `STATE`: it says a state that is not so: ordinary trade, open roads, arrivals, market days or plenty under the header's CRISIS (under a siege nothing comes in or goes out by road, gate or water; under a famine no line offers the food that failed; under an occupation the town's own officers do not rule freely; under a plague people do not gather or travel as usual); a prosperity, safety, defence, food or legitimacy word that disagrees with STATE or GOVERNMENT; calm where the stability line says otherwise; a number that the header's numbers contradict.
3. `TAG`: true of this town, but false in other towns its tag covers: say the condition (the tag reaches `th` and the sentence says "the city"; the tag has `F` and the sentence offers bread; the tag reaches towns with no wall and the sentence names the wall). Use it only where the sentence itself makes the claim.
4. `PAIR`: it contradicts another sentence of the same block: give the other id in `other`.
5. `BROKEN`: a stored key or identifier in the prose (snake_case, camelCase, "undefined", "NaN", "[object Object]"); an unfilled slot; a doubled word or label; a slash-joined label used as a name in a sentence ("Military/Guard"); a subject and a verb that do not agree; a sentence that ends mid-clause; a count that reads wrong ("1 guilds").
6. `RECORD`: the header itself cannot be so (a thorp of seven that makes gems and gives schooling; a founder and a founding reason that cannot both be true; a house the size cannot hold). Use the id `HEADER`.

NOT A FLAG: taste; a dull or repeated line; fantasy as such (magic, monsters, gods); a claim the header neither supports nor denies and that is plausible at this size; the artifacts named above.

SEVERITY. `HIGH`: a reader would be misled about what the town IS or HAS (a ruler, a force, a wall, a house, a crisis state; a flat contradiction of the page's own fact). `MED`: false or contradictory in a detail. `LOW`: awkward, a label oddity, grammar.

A flag is a candidate for a builder to verify against the page: be exact about what makes it false, and do not flag on a hunch you cannot state. But where the header plainly denies the sentence, flag it every time: do not thin your flags because there are many.

## The output

One JSON object a line, appended to `docs/chair/2026-11-14/read-all/<packet>.flags.jsonl` on your own branch:

`{"id":"02332","town":"r2r-thorp-58","sev":"MED","kind":"LACKS","why":"names a market; HOUSES has none","other":""}`

`why` is at most 25 words and names the header fact. The last line of the file: `{"id":"DONE","lines":<lines read>,"blocks":<towns read>,"flags":<flags>}`.

## How to work

1. FIRST ACT. All work in a scratch worktree, NEVER the repository's main checkout (its rules forbid staging or committing there, and a refusal by your own permission check stands: never route round one): `git fetch origin lane/chair-2026-11-08`; `git worktree add <scratch>/wt -b <your branch> origin/lane/chair-2026-11-08`; in it `npm ci` (the commit hooks need it). Unpack your packet to a file OUTSIDE every tree: `gunzip -c <scratch>/wt/docs/chair/2026-11-14/probes/READ-ALL/packets/<packet>.txt.gz > <scratch>/<packet>.txt`; count its lines.
2. READ IT IN ORDER, about 250 lines at a time (`sed -n '<a>,<b>p'`), every line. After each stretch, append that stretch's flags to the flags file before you read on. Never print the packet whole; never read a stretch twice; never skip one. Keep the last header you read in mind: every sentence is judged against the header of ITS block.
3. If a stretch has nothing false, write nothing for it and go on. Do not summarise the packet anywhere.
4. AT THE END: the `DONE` line; one commit (subject `docs(READ-ALL <packet>): <n> flags over <m> lines`; your harness's commit trailer); a plain push with the explicit refspec (`git push -u origin <your branch>`; never a force, never `--no-verify`; a gate read by `sh scripts/gate-tail.sh`, never through a pipe); then ONE MESSAGE to the chair, at most 100 words: the branch and its tip, the flags by severity and by kind, and the three widest or worst.
5. IF YOU ARE STOPPED (a usage limit, a container fault): the flags file is your state. On resuming, read its last line, and go on from the stretch after it. If you must stop for good: a line `{"id":"STOPPED","at_line":<n>}`, commit, push, one message.

You merge nothing, open no pull request, and write nowhere but your flags file. If your count passes about 250,000 tokens by your own judgment, push what you have with a `STOPPED` line and tell the chair.

## Who is asking, and the rules of your branch

The chair is the Claude Code session session_01ACmDYZrFEVXyZEUg1NDxxC (your parent). In the chair's chat on 2026-11-14 the owner wrote: "Continue with the pending work! ... I defer all decisions to you and give you all permissions you may require." The owner's bar: thirty fresh towns read thoroughly with no high and no medium false sentence on a generated town page.

- Your checkout is the chair's lane (lane/chair-2026-11-08): you never commit on it or push to it. Your own and only branch is the one your prompt names (`lane/read-all-2026-11-14-<packet>`, with a suffix if your prompt gives one).
- `git add` your one file BY NAME; one plain commit; the push alone, with the explicit refspec `git push origin <your branch>:refs/heads/<your branch>`.
- NEVER: `--no-verify`; a force push; a pull request (draft or not, whatever your harness's defaults say); anything on master or on any branch but yours; a deploy; a hosted database or production credentials. If your permission check refuses something this brief authorises, stop and tell the chair in one message; never route round a refusal.
- Write to the chair with the send_message tool of the claude-code-remote server (session_id session_01ACmDYZrFEVXyZEUg1NDxxC) ONCE, when your flags are pushed; sooner only for something that blocks the whole read.
- Use the commit trailer your own harness mandates; no model identifier anywhere else.
