# MAP-1 — the eligibility map of the state-prose pools (measure only)

MAP-1 for PROSE-1, 2026-11-20 (brief: `../briefs/MAP-1.md`). Measured on the worktree of `lane/prose-1-2026-11-20`
(HEAD `c7b7caa83`, which has the brief's base `43ab0f5eb` as an ancestor). Nothing under `src/`, `tests/`, `scripts/`,
`docs/content/` or `package*.json` was touched.

## Files

| file | what |
|---|---|
| `map-birth.shared.mjs` | the birth, SAME-1's copied: `loadGenerationLawPayloads()` once; `generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })`; `composePublicProse(town)` |
| `map-plain.census.mjs` | the control: no kernel mock; writes `<seed>.plain.json` (the composed publicProse) |
| `map-draws.census.mjs` | the instrument: `vi.mock` of `src/domain/display/stateProse/stateProseKernel.js` wrapping `drawVariant` and `readStateProse` (per the brief); recording only while `composePublicProse` runs, only blockIds of the six generated leaves; writes `<seed>.instr.json`, `draws.<w>.jsonl`, `calls.<w>.jsonl` |
| `vitest.map.config.mjs` | its own config (SAME-1's census config, copied); `MAP_FILE` names the one test file |
| `run-map.sh` | `sh run-map.sh <plain\|draws> <outdir> <workers> <seed-prefix> <n> [sizes...]` (plan split round-robin over workers, each log to a file) |
| `analyze-map.mjs` | reads `draws.hxd.jsonl`, writes `ALL-POOLS.md` and `OFFLIST-MAP.md` |
| `draws.hxd.jsonl` | the raw records, 21,678 lines, 10.8 MB (locally listed in `.git/info/exclude`) |
| `OFFLIST-MAP.md`, `ALL-POOLS.md` | the two maps |

## Commands run (from `docs/chair/2026-11-20/content/prose/map/`; SP = this session's scratchpad)

```
# the proof, 3 places (hxd-thorp-0, hxd-town-0, hxd-metropolis-0), plain then instrumented — wall 14 s
sh run-map.sh plain SP/proof 1 hxd 1 thorp town metropolis
sh run-map.sh draws SP/proof 1 hxd 1 thorp town metropolis
cmp SP/proof/<seed>.plain.json SP/proof/<seed>.instr.json
# the measurement, 300 places (hxd-<size>-<0..49>, six sizes), 4 workers — wall 52 s, 4 × "Tests 75 passed (75)", exit 0
sh run-map.sh draws SP/full 4 hxd 50
cat SP/full/draws.*.jsonl > draws.hxd.jsonl     # then eligibleSig / poolIsLeafPool fields dropped to slim the file
# the maps (OFF-LIST from: git show origin/lane/same-1-2026-11-20:docs/chair/2026-11-20/content/same/census/OFF-LIST.md)
node analyze-map.mjs SP/OFF-LIST.md
```

Each worker runs exactly: `MAP_FILE=<map>/map-<mode>.census.mjs MAP_PLAN=<out>/plan.<mode>.<k>.json MAP_OUT=<out> MAP_WORKER=<k> npx vitest run --config <map>/vitest.map.config.mjs` (cwd the repository root).

## The instrument's proof

- **Byte-identity (EXECUTED).** The composed `publicProse` is byte-identical with and without the mock on all 3 places:
  hxd-thorp-0 13,050 B (sha256 `477c13385beae615…`), hxd-town-0 14,647 B (`46f9825201773fa0…`), hxd-metropolis-0
  16,989 B (`ad23c0cbe57f330d…`); `cmp` silent on each.
- **Recorded calls by path (EXECUTED).** Over the 300 places: `drawVariant <- src/domain/display/stateProse/composeStateProse.js`
  93,288 calls, all in scope (blockId in the six leaves), 0 out of scope; `readStateProse` wrapper: **0 calls**.
  This is not a blind instrument: no module under `src/` imports `readStateProse` or `stateProseSentence` (grep: only
  the kernel itself names them), and the kernel's own internal call cannot be seen through a module mock. Every
  public-prose state draw goes through `composeStateProse.drawPiece` → the imported `drawVariant`, which is seen.
  (`decreeProse.js`, `causalDossierProse.js` and `eventCatalogue.js` also import `drawVariant`; none recorded a call
  inside `composePublicProse` for a blockId of the six leaves.)
- **Pool identity (EXECUTED, proof run).** On the 224 deduplicated proof records, eligible + excluded = pool length for
  every record (the eligible variants are the leaf pool's own objects), so the excluded lists are exact.

## EXECUTED vs INFERRED

EXECUTED: the 300 births and composes; every recorded draw (eligible vids, chosen vid, template text, pool length);
the dedupe per place by (blockId, poolKey, chosen vid); all counts, medians, shares and causes in the two maps.
291 records drew nothing (eligible 0: the pool was read and was silent).

INFERRED / by rule:
- **Exclusion signatures are STATIC.** At `drawVariant` the slot fills and the facts are not visible, so the signature
  is what each excluded variant carries that the drawn one does not: slots it names beyond the drawn variant's,
  `dm-only`, dimension marks (`STATE_MARK_DIMENSIONS` values), other (fact) marks — all marks are listed, not a diff.
  "no static difference" means the exclusion came from a slot fill or a fact value the instrument cannot see.
- **Per-place eligible** = the MAX over that place's draws of the pool (a place can draw a pool more than once).
- **OFF-LIST resolution** is a text match of the masked top sentence to the templates drawn at that size
  (`{slot}` matches anything, `town` ↔ the size noun, a `#` may stand for a literal number, `…` = prefix, and the
  row may be ANY sentence of a multi-sentence template, since SAME-1 split lines into sentences); the best match is
  the one with the most literal characters matched. 53 of 54 rows resolved; 1 UNRESOLVED (thorp 4, "Nobody here is
  paid to keep order." — an engine string of `safetyProfile.js`, not a pool template).
- **Causes** follow the brief's rule exactly; a pool with median eligible ≥ 2 whose top share is under
  max(0.5, 2/median) is SPREAD, and a median of 0 is SILENT.

## What the map says (in one place)

TOTALS: pools drawn 340; pools with a one-eligible size 16; places affected 280 of 300; UNKEYED candidates (≥ 10 at a
size) 3. Of SAME-1's 54 STATE rows: EXCLUDED 5 (DS-GEN-11 ×4 — vids 1,2 name `{band}`; DS-ECO-11 hamlet ×1), SPREAD 48,
UNRESOLVED 1, UNKEYED 0, ONE-VARIANT 0. The DS-DEF-5 "100%" rows (arcane ABSENT, charter hall ABSENT, garrison
PRESENT) are SPREAD at the draw (3 eligible, ~35–42% top): in the 8 such rows where the row's vid is not the pool's
top, SAME-1's holder count equals exactly the places that drew that one vid (12, 13, 10, 7, 9, 15, 12, 15), so the
100% is made downstream of the draw (INFERRED: the sibling variants print under a different slot key), not by the pick.

## Follow-up (PROSE-1's message): `stored`

`map-draws.census.mjs` now adds `stored: true|false` to each record: whether the drawn template (each `{slot}` a lazy
wildcard, `town`/`Town` also matching the size noun) matches any string under that place's composed
`publicProse.blocks` (no-variant draws are `false`). Re-proved on the same 3 places (instrumented prose still
byte-identical to the plain control). Re-ran the 300 places (4 workers, 56 s, 4 × 75 passed): the same 21,678 records;
13,906 of 21,387 variant draws stored (65.0%). A probe of the zero-stored pools (DS-GEN-9 founding, DS-POW-7 DORMANT,
DS-GEN-3 Secure, DS-REL-2) found no literal fragment of the drawn templates in the prose, so these are real
non-prints, not regex misses (EXECUTED). `rank-excess-stored.mjs` is PROSE-1's `rank-excess.mjs` plus
`if (!r.stored) continue;`; run as `node rank-excess-stored.mjs draws.hxd.jsonl 60 > RANK-EXCESS-STORED.md`
(238 pools; total excess 7,619; top 60: 4,959).
