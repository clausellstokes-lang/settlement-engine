# GOALS-1 · builder 2 · DRAFT the new lines (T1): 25 goal lines and 13 tie pairs, as text for review

Written 2026-11-20 10:31 UTC by GOALS-1 (the integrator). You WRITE A DRAFT FILE ONLY: no source file changes in this unit. GOALS-1 reads every line, the chair reads every line, the owner sees them, and only then does a later unit put them in the source.

## Read first, and no more
`CLAUDE.md`. `src/data/people/goalFamilies.js`: its header (the slot contract, `needs`/`excludes`) and the cells named below WHOLE, plus the cells beside them (the same family's other kinds, so a new want does not duplicate a neighbour's). `src/domain/facts/factVocabulary.js`: the atom names only (READ ONLY; a line that would need an atom that does not exist is rewritten to need none). `src/data/npcData.js`: the five tie archetypes named below WHOLE (`mutual_leverage`, `old_debt`, `peer_rivalry`, `wary_alliance`, `mentor_legacy`: their `desc` and `tension` lists, the `needs`/`excludes`/`trust`/`votes`/`twin`/`colour` fields and the comments that explain them), and `src/data/people/personMention.js`'s header (how a second mention is written).

## The owner's standing words (2026-11-20, verbatim): they bind every line
"Don't invent drama capitalize on what's already there if it's there. Sometimes a calm place is precisely what's needed… We are not creating the campaign."

## The cells and how many lines each (the chair's T1: no template more than twice in any town)
Goals (`GOAL_FAMILY_LINES[family][kind][vantage]`): TIES/rival_enemy/long 4 · INSTITUTION/solvency/long 4 · RANK/enter/short 4 · RANK/enter/long 3 · POWER/tense/long 3 · INSTITUTION/solvency/short 2 · POWER/tense/short 2 · TIES/rival_enemy/short 2 · INSTITUTION/charter/long 1. (25)
Tie pairs (one description AND one tension per pair, the same index picks both): mutual_leverage 5 · old_debt 2 · peer_rivalry 2 · wary_alliance 2 · mentor_legacy 2. (13 pairs, 26 sentences)

## Every new line
1. **A DIFFERENT WANT, not a rewording of any line already in the cell or a neighbouring cell, nor of another new line** (the chair's (e)). Fifteen paraphrases of one want still sound repeated. If you cannot find a distinct want for a cell, STOP SHORT of its number and say so: the shortfall is counted, never filled.
2. **A want a person of that kind could hold in ANY town.** It names only what the cell's slots give (`{power}`, `{rival}`, `{house}`, `{other}`, `{above}`…; the slot contract in the file's header is law: no article before a slot, never "{power}'s", the agreement form `{power|it|them}` / `{power|its|their}` for an "it/its" said of a power or a verb whose subject is the power). A tie line names its two people as the archetype's lines do (`${r.name}`, `${s.name}`), in the kind's own order.
3. **In the voice of the lines beside it:** plain, concrete, the same length and register. A short goal is a concrete thing for this season; a long goal is the life's direction.
4. **Declared where it presumes anything** (a market, a court, a guild, a ruling body, a temple…): give the `needs`/`excludes` atoms it would declare, from `factVocabulary.js`'s existing atoms only. Prefer a line that presumes nothing.
5. **Never a new plot, a secret or a crime; no drama that is not already in the tie's kind.** A tension may be calm (a matter between them, not a scandal). No line may promise the DM a story the town does not hold.
6. **Tie pairs:** a description and a tension that read together; the trust they state, if any, declared as the archetype's lines declare it (`trust`); no vote unless declared as `votes` lines are, with their `twin`; respect the archetype's comments (e.g. "a vote is cast only from a seat").

## The draft file
`docs/chair/2026-11-20/content/goals/GOALS-1-NEW-LINES-DRAFT.md`. Per cell or archetype: a heading; TWO existing lines of the cell quoted (the reader compares against them); then each new line, numbered, with its declared atoms if any and ONE short clause naming the distinct want ("to be trusted with the power's money"). Tie pairs as "D:" and "T:" lines, written with `{A}` for `r.name` and `{B}` for `s.name`. At the end: the shortfall per cell, if any, and why.

Do NOT commit and do NOT push. Report back (at most 200 words): the file's path, the count written per cell, the shortfall, any atom you wanted and did not find.
