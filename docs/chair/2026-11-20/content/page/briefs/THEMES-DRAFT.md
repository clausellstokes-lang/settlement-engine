# THEMES-DRAFT: the 86 trouble hooks, each beside a proposed theme, for the chair's eye. PAGE-10's brief, written 20:31 UTC 2026-11-20

A DRAFT ONLY: one docs file, nothing under `src/` or `tests/`. Read first: `CLAUDE.md`, `briefs/BUILDER-RULES.md` (rules 1,
6, 7 bind), `src/domain/hookThemes.js` WHOLE (the closed set `HOOK_THEMES`, and how the authored templates already in its
table are themed: follow their usage), `src/data/npcData.js :: NPC_FACTION_LOYALTY_THEMES` (the shape the build will take),
and `src/data/troubleHooks.js` at the commit PAGE-10 gives (the merged hooks: the texts and their `needs`).

THE DEPTH LANE (DEPTH-3, via the chair, 20:31): each pool's themes are an index-aligned array beside its rows in the pool's
OWN data file (`TROUBLE_HOOK_THEMES[kind] = [theme per row]`); today all 86 answer `untyped`.

WRITE `lines/TROUBLE-HOOK-THEMES.md`: one table, one row per hook, in the data file's order, kind by kind: | kind | index |
text | needs | proposed theme | (a reason only where the choice is close, at most eight words). THE THEME IS A MEMBER OF
`HOOK_THEMES`, no other word: where none fits, write `ASK` and say in the reason what the hook is about; never `untyped`.
A theme says what the hook IS (a crime ring, a succession, a looming threat, scarcity pressure, corruption...), read from the
hook's own text and needs, not from its trouble's kind alone. Add at the foot: the count per theme, and every `ASK`.

Commit the one file on your worktree's branch `lane/page-10-2026-11-20-themes` (cut from the commit PAGE-10 gives) by explicit
path; never push or merge. Reply at most 150 words: the commit, the counts per theme, the ASKs.
