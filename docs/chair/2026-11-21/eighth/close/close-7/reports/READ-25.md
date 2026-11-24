# READ-25: the page census's whole battery over V and C, LIT (CLOSE-7 chain two, phase 1; RULING-R24 R24-0). A measure; nothing was built.

The lit tree `/home/user/wt/lit` stood at `d447ee31e` with an empty `git status --short` before and after every run. No file under
`src/`, `tests/` or `scripts/` was changed in any tree, no door was run, no register was touched, nothing was committed or pushed.
Every heavy run went through `scripts/gate-mutex.sh --run`, one at a time, to a log (exit 0 each).

## The runner (committed-to-be under `close-7/read25/`)
`scripts/census/page-census.mjs` births only its own corpus (prefix r2, the census's dials), so I wrote a runner that takes any plan:
- `read25/page-battery.mjs --plan=<plan.json> --out=<dir> [--tree=<tree>] [--workers=4]`: per pattern, the count by size and three
  seeds (`<out>/table.txt`), every seed per pattern (`<out>/seeds/<row>.txt`, `counts.json`). It also writes per birth `recordHash`
  (sha256 of the born record, before the public prose is stamped) and `pageHash` (sha256 of the walked views): a cure's "what else
  moved". `--diff=<before>,<after>` lists the births whose rows, record or page moved. `--grid` births the page census's twelve grid
  births and checks them row for row against the tree's register.
- `read25/page-battery.render.census.jsx`: the page census's renderer (`page-census.render.census.jsx`) with two changes and no
  other. The tree is a parameter (every src module, the walk `pageCensusWalk.shared.mjs :: walkDossier` and the mocks are the measured
  tree's own, loaded after `vi.doMock`). The birth reads the row: a row with `config` is born `birthConfig(row.config)` (C and V), a
  row without one is born as the page census births it (`configOf`). Options `{ seed, customContent: {} }`, as the page census.
  `pageCensusFindings` is applied unchanged. Chain one runs it on its own worktree with `--tree=/home/user/wt/<unit>`.
- Plans: `read24/make-plan.mjs` (C) and `read24/make-visitor-plan.mjs` over the chair's `plan-lit.json` (V). Both are byte-equal to
  READ-24's plans (`cmp`; V equals READ-24's `plan-visitor-check.json`, and row for row READ-24's `plan-visitor.json`).

**THE PROOF OF THE RUNNER (CONFIRMED).**
- `--grid` on the lit tree: all 12 grid births read EXACTLY the register's `grid` rows (`read25/grid-proof.log`). A second run gives
  the same record and page hash for all 12 (determinism).
- Over the 900 of each corpus, every birth's `recordHash` equals the hash of the same birth made by the separate record measure
  (`read25/records.census.jsx`): 900/900 on V and 900/900 on C. So the renderer births exactly the corpus.
- 900 of 900 births rendered on each corpus. 23 patterns applied (`PAGE_CENSUS_ROWS` of the lit tree). The fewest views in a birth
  was 22. No check threw. Wall time: V 17.6 min, C 15.0 min (4 workers).

## The battery on V and on C (counts of births; size order thorp, hamlet, village, town, city, metropolis)

| row | pattern | V by size | V all | C by size | C all | register banked (r2 720) |
|---|---|---|---|---|---|---|
| **P9** | a weak beasts grade over settled-country text | 44 51 32 2 0 0 | **129** | 0 0 0 0 0 0 | **0** | 103 |
| **P19** | a diagnostic printed as a tension ("operating on stockpiles only") | 0 2 0 0 0 0 | **2** | 0 | **0** | 7 |
| **NEW2** | magic income, and no practitioner on the rolls | 2 1 2 1 0 0 | **6** | 0 | **0** | 6 |
| P8any | no church, and worship in the economy | 62 72 0 0 0 0 | 134 | 19 41 0 0 0 0 | 60 | 118 |
| P14 | size words in small places | 0 0 1 0 0 0 | 1 | 0 0 1 0 0 0 | 1 | 2 |
| P16three | "the ruling three" over fewer | 0 4 32 59 42 100 | 237 | 0 7 26 108 73 134 | 348 | 179 |
| P17 | non-goods produced locally | 2 0 105 107 133 139 | 486 | 3 0 150 150 150 150 | 603 | 395 |
| P18 | catalogue count ranges printed as names | 0 0 0 150 132 134 | 416 | 0 0 0 150 128 141 | 419 | 341 |
| **P5b** | "Diffuse, no gang" beside a criminal power | 0 | **0** | 0 0 0 1 0 0 | **1** | **0** |
| the other 14 rows (P2siege, P3source, P4, P5false, P6need, P7a, P7b, P10, P11, F4, P13, P16powers, P20, NEW1) | | 0 | 0 | 0 | 0 | 0 |

Three seeds each (the first three in plan order; every seed of every pattern is in `read25/V/counts.json` and `read25/C/counts.json`):
- V: P9 dp-thorp-4, dp-thorp-14, dp-thorp-21 · P19 dp-hamlet-2, dp-hamlet-117 · NEW2 dp-thorp-6, dp-thorp-53, dp-hamlet-9 · P8any
  dp-thorp-0, dp-thorp-4, dp-thorp-11 · P14 dp-village-136 · P16three dp-hamlet-77, dp-hamlet-83, dp-hamlet-85 · P17 dp-thorp-123,
  dp-thorp-135, dp-village-0 · P18 dp-town-0, dp-town-1, dp-town-2.
- C: P5b dp-town-143 · P8any dp-thorp-3, dp-thorp-14, dp-thorp-43 · P14 dp-village-33 · P16three dp-hamlet-2, dp-hamlet-42,
  dp-hamlet-64 · P17 dp-thorp-1, dp-thorp-11, dp-thorp-38 · P18 dp-town-0, dp-town-1, dp-town-2.

## THE ANSWER: what the plains-only corpus hid (V fires, C does not)
1. **P9: 129 of V and 0 of C.** A "Critical" or "Weak" Beasts & Monsters grade sits over a line from the "settled" pool, for example
   dp-hamlet-104: "Beasts & Monsters: Critical" over "[settled, nothing organized] Whoever walks out of Bayarhan … is unli…". It is all in
   small places (thorp 44, hamlet 51, village 32, town 2). PLAUSIBLE cause: V's `monsterThreat: random_threat` against C's default
   threat. The plan does not record the drawn threat, and I did not measure it.
2. **P19: 2 of V and 0 of C.** "1 institution operating on stockpiles only (isolated trade): Citizen militia." (dp-hamlet-2,
   dp-hamlet-117). PLAUSIBLE: only an isolated route prints it, and C is all road.
3. **NEW2: 6 of V and 0 of C.** The income pool for the practice of magic prints beside "No arcane practitioners on the rolls" (dp-thorp-6,
   dp-thorp-53, dp-hamlet-9, …). PLAUSIBLE: V's random priorities.
4. **P8any is twice as common on V (134 against 60).** It is in thorps and hamlets only on both corpora.

Every pattern that fires on V is already a row the register banks above zero on the r2 corpus. So on V the battery finds no NEW kind
of fault. What the plains-only corpus hid is the size of three known ones: P9, P19 and NEW2 read zero on C. **None of READ-24's five
faults (A1, A2, B1(i), B1(ii), C1) is a pattern of the battery today.** The battery cannot see them on either corpus. That is why the
ruling asks a pattern of each cure.

**Over the bar on C (not asked, reported):** P5b, whose banked count is 0, fires once on C. dp-town-143 prints "Criminal structure:
Diffuse criminal presence" beside a "Street gang" power. P14 (banked 2) fires once on each corpus, in a village where the line "support
dense populations" prints (dp-village-33 C, dp-village-136 V).

## Corrections to READ-24, found on the way (CONFIRMED by read)
- READ-24 said the desert's modifiers "touch none of" the tags of Fish market, Sawmill and Hunter's lodge. **That is false.** The
  desert's table holds `{ tags: ['trade'], modifier: 1.8 }`, and all three rows carry `trade`. So in a desert each stands at 1.8× its
  plain chance, before any resource boost. Desert resources that hold the key `market` (`oasis_water` 1.6, `desert_salt` 1.6,
  `camel_herds` 1.5, `date_palms` 1.4) raise the Fish market further, because `getResourceMultiplier` matches `instBoosts` keys as
  substrings of the house's name. Details in `B1I-TABLE.md`.
- READ-24's 28 desert places with one of the three include dp-village-129. Its Hunter's lodge stands beside `hunting_grounds`, a
  resource that gives game. Under the ruling's rule that place keeps its house, so the ruling's desert count is **27**.

## Files
Committed-to-be (`close-7/read25/`): `page-battery.mjs`, `page-battery.render.census.jsx`, `records.census.jsx`, `b1i-table.mjs`,
`V/` and `C/` (`table.txt`, `counts.json`, `b1i-table.md`; `V/b1i-hits.tsv`), `grid-proof.log`, `c1-readers.tsv`, `c1-tests.tsv`,
`c1-paths.txt`. Scratchpad `READ-25/`: the renders (`V/rows`, `C/rows`, 900 JSON each), `records-V.jsonl`, `records-C.jsonl`, logs,
and `V-hashes.tsv` and `C-hashes.tsv` (seed, recordHash, pageHash, rows: **the BEFORE baseline for every cure's "what else moved"**).
