# REVIEW-VEIL-8 — the reviewer's probes

Behind `../../REVIEW-VEIL-212-8-2026-11-14.md`. Scratch tools, not pins. Every database is a LOCAL scratch PostgreSQL 16
cluster on a unix socket (`PGHOST=/var/tmp/rv8/pg`, trust auth, `listen_addresses=''`); nothing here is to be run
against anything else. Chains and runners are REVIEW-VEIL-6's and -7's, unchanged (`../../../2026-11-13/probes/`):
`sh REVIEW-VEIL-7/run-all.sh <worktree>` builds `x212` (001..212) and `x211` (001..211) and runs the 37 checks.

- `hand/town-f.json` + `veil-f.json`: the neighbours of a hidden name (V8-1): Hangul, kana, Han, Thai, an arrow, a
  star, an emoji, the trade-mark sign, U+02BC, Armenian punctuation; with controls that must go and rows that must stay.
- `hand/town-g.json` + `veil-g.json`: a renamed open house with its description eye shut and a defence row under its
  birth name (V8-2); two records under one id; a shown power in both `factions` lists (V8-4); a person whose name holds
  the hidden name, and the tie that names them (V8-5); a covert tie told by `prominentRelationship` (V8-6); a hidden
  lasting effect repeated by a later event and by other keys of the annotation (V8-7).
- Each is stored and read by REVIEW-VEIL-7's `hand/run.sh <db> <town> <veil> <tag> <outdir>` (three shares, three
  reads), the twin by its `twin.probe.jsx` (`RV7_LIKE='rv8%'`), compared by its `jdiff.mjs`.
- `hand/cost8.sql -v houses= -v hitrows= -v coldrows= -v namelen=`: the walk's worst case (V8-3) and the pattern's size
  (V8-9), timed on `x211` and `x212`.
- `show.mjs <file.json> <regex>`: every key or string of a response that matches, with its path.
- `out/`: the responses the findings quote, the library's print and the timings at a12ccfee3.
