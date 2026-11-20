# PAGE-5's hand-back: THE TROUBLE (kept current at every push; last written 2026-11-20 14:18 UTC by `date -u`)

Read this, then `PAGE-3-HANDBACK.md` (sections 0, 0a, 4b), `briefs/BUILDER-RULES.md`, `briefs/T1.md` (S6),
`briefs/S7.md` + `briefs/S7-FOLLOWUP.md` (sides). PAGE-5 integrates; builders (the Agent tool) build. PAGE-6 owns the
other half (L2, L4/S9, S3); no file is shared.

## 1. State

- Lane `lane/page-5-2026-11-20`, fast-forwarded to PAGE-3's final tip 79710682d (the chair, 14:06 and 14:13).
- Container: `npm ci` done; `/node_modules` in `.git/info/exclude`; ledger ref review-fixes-2026-07-08 fetched.

## 2. Units

| unit | state | commit | next |
|---|---|---|---|
| 1 sides table | MERGED: 2f6b6a1db read once against 13:22/13:50 (all six changes + case arm verbatim); red re-run "6 failed / 9 passed (15)" (five new arms + the S7-TABLE arm: the table was regenerated in the same commit; the builder's 5 was with the old table), green 15/15; merge c5da1cfb3; lighting census refrozen 12e2fd25b (titles 31247->31252), verified 34/34; wiring --check green (861/3054/169) | c5da1cfb3, 12e2fd25b | owed at the join: parity test with `sideArchetypes.js` (origin/lane/frame-5-2026-11-20) |
| 2 S6 | NOT STARTED by PAGE-5: origin `lane/page-2-2026-11-20-t1` 532a74fa2 (5 files: historyData.js, historyGenerator.js one call site, new test, bar4HistoryOneTelling re-anchor, manifest row); gates never ran | | one builder runs its gates + the confinement (T1.md acceptance 4); PAGE-5 reads diff once, re-runs red/green, censuses, merges |
| 3 causes | (a) MEASURED, (b) PROPOSED to the chair 14:16 (awaiting ruling: priority vs hash-among-held; whether "a third" binds raw or spoken-for share) | | (c) lines in batches to the chair; (d) `src/data/tensionCauses.js` + totality test |

## 3. Unit 3's measure (scripts and outputs: `measures/page-5/`)

- `feat.mjs` (per town: tensions + flat born-record facts), `an.mjs` (lift per kind), `in.mjs` (within-kind rates),
  `inst.mjs` (houses/powers per kind), `tx.mjs` (texts per kind), `sim.mjs` (the candidate cause tables over the real
  document, placeholder lines 2 a cause / 3 plain, `pickVariant` keyed `<seed>::cause::<kind>`; mode `priority` or `held`).
  Run: `node <script> $PWD 150 hxd priority`.
- Generator reads (historyGenerator.js :: buildHistoricalEvent): crime_wave = criminal-priority house + viability record
  (rng>.5), small tier + fence/smuggler/bandit/outlaw house, or fill (crime signal); guild_conflict = fill, guild-biased
  (rng>.7), needs guild; resource_scarcity = viability issues (rng>.4) or famine/plague stress; external_threat,
  succession_crisis, outside_debt, legitimacy_crisis = STRESS_TO_TENSION (historyPolicyData.js) or fill; great_flood = fill.
- Baseline (900 towns hxd-<size>-0..149): same-size three in a row 41.2% (city 83.1%, metropolis 81.1%), random triples
  34.1%. Projection with the proposed tables: priority 10.3% random, city 18.9%, metropolis 27.7%; hash-among-held 9.7%,
  city 20.3%, metropolis 20.9%. Tables and rates: `causes.priority.150.out.txt`.
- SURPRISE reported: great_flood stands in towns with no water about half the time (its stored text says rising water).
