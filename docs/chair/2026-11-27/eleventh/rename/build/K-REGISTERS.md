# K-REGISTERS: THE REGISTERS POINT 124 MOVES (the chair's ruling K-REG: named for the join, re-taken by none on this branch)

RENAME-BUILD, 2026-11-28. Each register's door was run in CHECK mode, or its walker alone, on the tip. The outputs are under `registers/`.

**How "moved by" was found (CONFIRMED).** The nine walkers ran alone on detached worktrees:
- 5ad631588, the base: green;
- 1189e1e4b: K1 complete;
- 8bfe1a5f9: K2 complete, before K1b's cure;
- the tip.

The CHAIR re-takes each register by its own door at the landing, after point 124's independent reader.

| register | its door, in check mode (output) | moved by | the move | the cause (one line) |
|---|---|---|---|---|
| `docs/content/wiring-census.json` (`tests/lint/proseWiringCensus.walker`: the holder census and the committed JSON) | `node scripts/wiring-census.mjs --check`: "stale" (`registers/wiring-census-check.txt`); `--dry`: **sections that would move: stamp; ROWS that would move: 0** (`wiring-census-dry.txt`); walker 2 red (`proseWiringCensus.walker.txt`) | K1 (52d8d175a) | the stamp only, no row | K1's site files (each read now through `pickKeyOf`) change the source shas the census stamps |
| the lighting census, `tests/lint/sovereigntyLightingContract.walker` `CENSUS.files` | the walker (`sovereigntyLightingContract.walker.txt`) | K1 6e08473b6 (+1), K2 0acc29494 and ee6fe4dc6 (+2), K1b 8bfe1a5f9 (+1) | 3,827 -> 3,831 | four new test files: renameKeepsThePage, townRenameCascade, townRename, foundingTraditionsKeepTheId |
| the Wizard News headline and voice contracts, `scripts/lib/news-voice-contract.mjs` `CORPUS` | the two walkers (`newsHeadlineContract.walker.txt`, `newsVoiceContract.walker.txt`) | K1b (beaa3c707) | introductions 419 -> 424, final entries 417 -> 422 | the AO-0 year's first lit tick mints the id-keyed founding set (PLAUSIBLE: green at 8bfe1a5f9, red with the cure) |
| `tests/lint/proseFamilyContract.walker` | the walker (`proseFamilyContract.walker.txt`) | K1b | scalarRows 38,197 -> 38,587; the same Wizard News counts | the same |
| observed-shape's executed corpus (`tests/lint/observedShapeReaders.walker`, "the producers ran") | `node scripts/check-observed-shape-readers.mjs`: exit 0, the live scan clean (`observed-shape-readers-check.txt`); walker 1 red (`observedShapeReaders.walker.txt`) | K1b | wizardNewsAccumulatedEntries 2,627 -> 2,661; final entries 417 -> 422; unique 419 -> 424 | the same |
| writer-reach's `shapesDigest` and the lit-dial arm (`tests/lint/writerReach.walker`) | `node scripts/check-writer-reach.mjs`: exit 0 (`writer-reach-check.txt`); walker 2 red (`writerReach.walker.txt`) | K1b | shapesDigest 08f7da56... -> 76c3328f... | the same executed corpus |

## Not moved by point 124

Run alone on the base, these are red there too (CONFIRMED), and point 124 does not change them: `proseComposed` (over-claim 20 vs at most 19), `proseCorpusBytes` (GZIP and RAW) and `siteCoherenceRatchet` C1. The K1 goldens named in `K1-PROOF.md` stand as named.

## Moved by K2, and cured on the branch (no register re-taken)

- `noLegacyFactionReaders`, and observed-shape's live scan (4 NEW rows): `townRename.js` read the legacy `factions` and two keys no born record carries. Cured in 987d5a68d.
- `domainAnyCastBaseline` (3 `any`): cured in 01cc209a6.
- `ruinFilterRoster`: an EXEMPT row (name-lookup), 114 -> 115, in 122f38fbe (the chair's ruling K2-2). At the join with SURVEY-FINAL's `printRecord` row the count is 116.
