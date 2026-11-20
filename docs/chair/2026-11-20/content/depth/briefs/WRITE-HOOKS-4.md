# Brief: WRITE-HOOKS-4 (DEPTH-3's line writer, hooks tranche 3; written 2026-11-20T18:21Z by `date -u`)

THE OWNER (2026-11-20, verbatim): "So do what you can to comprehensively fix the sameness fault as much as you can". After tranches 1
and 2 a second metropolis still repeats about 35% of a first's person hooks (bar: under 30%). You write 60 NEW PERSON HOOKS, LINES
ONLY, into ONE review file; you change no source file, run no test, commit nothing, push nothing (DEPTH-3 reads, commits, sends).

READ WHOLE FIRST (in /home/user/settlement-engine, all under `docs/chair/2026-11-20/content/depth/`): `measure-3/MEASURE-3.md` (the
placement and why), `briefs/WRITE-HOOKS.md` (THE WRITING RULES 1-6: they bind every line, word for word), `lines/HOOKS-3B.md`
(THE CHAIR'S RULE OF WHAT A HOOK IS: a LEAD a DM can use tonight; something has just happened or is about to: a visitor, a letter, an
object, a request, a deadline, a discovery; it may propose a twist; NEVER a question, NEVER a mood or a state of mind, NEVER a house the
place lacks), and every line of `lines/HOOKS-1.md`, `HOOKS-2.md`, `HOOKS-3.md`, `HOOKS-3B.md` (as amended at their feet): no line
of yours may repeat, echo or near-paraphrase any of them or any row of `src/data/npcData.js :: NPC_FACTION_LOYALTY`. Who draws each
pool: `src/generators/people/poolMap.js :: hookPoolFor`. Theme names: `src/domain/hookThemes.js :: HOOK_THEMES`; an existing row's
theme: `themeOfText(row)` (run it with node from the checkout).

THE RULES ADDED SINCE TRANCHE 1 (the chair's; binding):
- No wording may NEED a house of a hideable kind (`src/domain/people/cardVeil.js :: isHideableHouse`: criminal, clandestine, illegal
  brokerage) or ANY fact about crime. No crime done, planned or hidden.
- A line states nothing about the person the record may contradict: no age, household, spouse, child, kin, birthplace, trade other
  than the pool's own (`economy` presumes a trade; `religious` a faith the person serves; `magic` a practice of magic).
- `religious`: no temple, shrine, order, priesthood or rite presumed beyond "their faith" / "the faithful" / "those they serve";
  `succession` lines speak of who will follow someone in a role the person's own circle holds, never an office the town may lack.
  `forbidden_love`: an attachment their vows or their circle frown on, at the quiet weight of a letter or a meeting, never scandal.
- `vanished_person` and `looming_threat` lines carry NO disappearance and NO danger as an event: someone long out of touch writes or is
  seen; a warning, a rumour, a date that approaches. Calm towns stay calm.
- No `corruption` theme; no `crime_ring`, `smuggling`, `blackmail`.

THE PLACEMENT (each line takes EXACTLY the theme its slot names, in this order; numbering restarts per pool):
- `other` 20: 1-3 divided_loyalty, 4-6 old_wound, 7-9 hidden_debt, 10-11 looming_threat, 12-13 vanished_person, 14-15 secret_identity,
  16-17 forbidden_knowledge, 18-19 ambition, 20 outsider_suspicion.
- `government` 12: 1-3 divided_loyalty, 4-5 vanished_person, 6-7 forbidden_knowledge, 8-9 old_wound, 10-11 outsider_suspicion, 12 ambition.
- `economy` 10: 1-3 scarcity_pressure, 4-5 ambition, 6-7 hidden_debt, 8-9 rivalry, 10 betrayal.
- `religious` 10: 1-3 succession, 4-6 forbidden_love, 7-8 faith_crisis, 9 secret_identity, 10 looming_threat.
- `magic` 8: 1-2 looming_threat, 3-5 forbidden_knowledge, 6 vanished_person, 7 outsider_suspicion, 8 betrayal.

OUTPUT: `docs/chair/2026-11-20/content/depth/lines/HOOKS-4.md` (do not git add). Open with one paragraph naming this brief and the
placement. Per pool a heading, then per new line, in the format of HOOKS-1.md:
`N. NEW [theme] "the line"` then two indented lines `beside: [theme] "an existing row of that pool"` (two DIFFERENT existing rows of the
SAME pool, verbatim, the nearest in theme). End with a table per pool: theme -> new lines beside the pool's existing count.
Then a SELF-CHECK section: for each line, one word "ok" or the rule it strains. ANSWER (at most 120 words): the path, the counts, any
rule you found hard to keep and on which line.
