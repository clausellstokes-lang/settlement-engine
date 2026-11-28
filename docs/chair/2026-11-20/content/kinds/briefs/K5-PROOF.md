# K5-PROOF — THE DARK PROOF ON TWO CORPORA, AND THE MEASURE FOR THE OWNER (lane KINDS-2, units 4 and 5)

Seat: KINDS-2 (integrator). You are its builder. NOTHING UNDER `src/` OR `tests/` CHANGES IN THIS UNIT, IN ANY CHECKOUT.
You do not push; never the main checkout `/home/user/settlement-engine` beyond `git worktree add`; never `--no-verify`,
reset, stash or clean. Every heavy run (a corpus of births) through
`sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh <command…>`, ONE at a time, to a log, read by grep/tail.

TREES (each a worktree with `node_modules` symlinked from the main checkout):
- LANE: `git worktree add -b lane/kinds-2-2026-11-24-k5 ../kinds2-k5 <the lane tip the seat names in your prompt>`;
  the instrument and its outputs are committed HERE (docs only).
- LINE: `git worktree add --detach ../kinds2-line f03e9a868427e6b656d299c5cce8d33c74758588` (point 113; read-only).

## 1. THE INSTRUMENT: `docs/chair/2026-11-20/content/kinds/measure-plan.mjs` (new; plain `node`, as `measure-kinds.mjs` is)
Read `docs/chair/2026-11-20/content/kinds/measure-kinds.mjs`'s header and its `birth` path (how it imports a tree, its
`--plant`, its reads); REUSE its read and report code by copying what you need (do not import across files).
- `plan <kind> <out.json>`: `census` = 900 rows `{seed: "dp-<size>-<i>", size, config: {settType: size}}`, i 0..149,
  six sizes; `visitor` = the same 900 seeds, each with the visitor's config: the config of each size's row of
  `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-24/tenth/read/plan-lit.json` (read once into the plan; the
  maker it copies: `git show origin/lane/close-7-2026-11-24:docs/chair/2026-11-21/eighth/close/close-7/read24/make-visitor-plan.mjs`).
  Commit both plans' JSON beside the instrument (`out/k5/plan-census.json`, `out/k5/plan-visitor.json`).
- `birth <tree> <plan.json> <out.jsonl> [--force '<json>'] [--plant '<json>']`: for each row, after
  `loadGenerationLawPayloads()`, `generateSettlementPipeline({ ...birthConfig(row.config), ...FORCE }, null, { seed: row.seed, customContent: {} })`
  (the close's census birth, `measure.census.jsx` on the close-7 branch; with FORCE absent the call is exactly that).
  One JSON line a place: `seed, size, hash` (sha256 of `JSON.stringify(record)`, hex), `cfgHash` (the same of
  `record.config`), the troubles (`history.currentTensions` types in order), and the reads K0's instrument takes
  (`crime` = criminalEffective, `hasCriminal`, `nameRule`, `g2` economy powers). `--plant` as in measure-kinds.mjs
  (a scratch `git archive` copy, the row rewritten there only). Print the count and the wall seconds.
- `equal <a.jsonl> <b.jsonl>`: places matched by seed: the count equal by `hash`, by `cfgHash`; every unequal seed listed.
- `report <dark.jsonl> <lit.jsonl> [--table '<json>'] --out <md>`: by size (150 each), dark | lit side by side: the
  share of places born with guild_conflict and with crime_wave (any position); every other kind seen at 10% or more of
  a size, with its share; places with NO trouble; troubles a place 0/1/2/3+; distinct kinds; the commonest FIRST
  trouble and its share; HOW MANY PLACES CHANGE AT ALL (hash unequal) and how many change their trouble list; places
  whose trouble COUNT went down / up (seeds for any up); and THE CALM CHECK: a place born with no trouble under dark
  that gains one lit (must be 0: list any). Writes `<md>` and a `.json` beside it; prints at most 25 lines.

## 2. UNIT 4, THE DARK PROOF (the law dark, i.e. the lane tip as it stands, no force, no plant)
For EACH corpus (census, visitor): `birth` at the LINE tree and at the LANE tree, then `equal`. THE BAR: 900 of 900
equal by `hash` on each. Any unequal place is a STOP: report the seeds and the first differing top-level key; do not
chase it. Commit the four jsonl files under `out/k5/` only if each is under 5 MB (else keep them out and commit the
`equal` outputs and a sha256 of each jsonl).

## 3. UNIT 5, THE MEASURE (the law lit ONLY by the instrument: `--force '{"_troubleLawVersion":2}'` after birthConfig)
At the LANE tree: `birth` each corpus lit, then `report` dark-vs-lit for each corpus (`out/k5/measure-census.md`,
`out/k5/measure-visitor.md`). The table measured is the leaf's DRAFT `TROUBLE_WEIGHT_TUNING` as committed (crime B50:
0.05 to 0.50 over 20 to 90; guild 0.05 to 0.25 over 1 to 4; small place 0.50 to 0.90 over 15 to 60): no plant needed.
Also say, per corpus, how many lit places differ from dark in anything OTHER than `history` and the config's
`_troubleLawVersion` key (expected 0 if the law touches only the troubles: if not 0, name the top-level keys and count).

## REPORT (at most 300 words + ONE table)
Commits; the dark proof's two counts (census N/900, visitor N/900, by hash); the table: by size, census and visitor,
guild_conflict and crime_wave share dark -> lit, places with no trouble dark -> lit, places changed; the calm check;
the "other than history" count; wall minutes. CONFIRMED for what you ran, PLAUSIBLE for what you read.
