# VEIL-R1: hand-back. Stage R1 of the roster-choice registry (ruling VR7)

Seat: VEIL-R1, a builder of the seventh chair (session_019yED1SUxGVHyjQnoqoFvQ8). Branch `lane/veil-r1-2026-11-20`, cut
from origin/lane/veil-18-2026-11-19 at **bedd5a3921d5a34bab92d1f0f1250dd16cf51f56**. I read it back from origin first
and the two were equal. The assignment is `lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-R1.txt`.
The work follows `docs/chair/2026-11-19/veil/briefs/SUB-BRIEF-VR7.md`, stage R1.

Every database used is a scratch PostgreSQL 16 cluster in this container (`/var/tmp/r1pg`, unix socket `/var/tmp/rv7`,
`listen_addresses = ''`). No hosted database, no production credential, no `supabase` command, no deploy, no pull request.

**Written 2026-11-20 00:44 UTC, amended 00:56 and 01:06 UTC (each read from `date -u`). Section 9 (the chair's rulings, applied) SUPERSEDES sections 2 to 4 wherever they differ.**

## 0. Outcome

R1 is built. It is one commit of new files, plus the walker's row in the mutation manifest. The files are:
- the module `src/domain/veil/rosterChoiceRegistry.js`;
- the export script `scripts/veil/rosterChoiceRegistry.mjs`, which also has `--check` and `--all <dir outside the tree>`;
- the generated `docs/chair/2026-11-19/veil/registry/{registry.json, rulings.json}`;
- the walker `tests/lint/rosterChoiceRegistry.walker.test.js`.

Every row is `built: false`, so no behaviour changes. Nothing touched 212, its rollback, either twin file, CurateMode,
criminalVeilSwitch or 211.

The bytes, at the base and at this commit, are unchanged:

| File | sha256 |
|---|---|
| 211 | `eface6d0…e373be0b01` |
| 211 rollback | `ce8474ff…ef6338d3bd49712f` |
| 212 | `dae0ae6c…f75e19e247` |
| 212 rollback | `45da09eb…cbc700f14a66233f77520e6cd67cf30a1c9` |

## 1. The first act, measured (it could have refuted the brief; it did not)

I ran the reader's differ THROUGH THE SERVER at the base, with every veil (default, hand, every eye shut) and Reveal DM
off and on. Here is the gate's reading with an empty registry and the VR13 rng ruling:

| Run | Reading | Against the readers' baseline |
|---|---|---|
| New shape, gallery | 124 unregistered / 20 rng-only | The reader's 124 paths exactly, diffed path for path. VEIL-18 got the same at 1f501779b, and V8-2/4/5 moved no class path. |
| Master's shape, gallery (N=1, master's generator db832c892, chain 203+211+212) | 135 / 20 | The reader's 135 paths exactly |
| New shape, link | 118 / 20 | A subset of the gallery read. It lacks only the six Reveal-DM paths. |
| Master's shape, link | 122 / 20 | — |

Across the four runs the union is **214 in-class paths**.

One surprise in the instruments. The readers' `rul-vr13.json` was never committed, so I rebuilt it from the measurement.
The rng regex `^history\.(historicalEvents|eventsTimeline|legacyAnnotations|historicalCharacter)` gives exactly 20
paths. Adding `founding` and `general:history.legacyLines` gives 23. The rebuilt file is saved as
`instruments/rul-vr13.json`.

## 2. The rows (142 rows over the 214 paths; no path is matched by two rows)

The row form is the binding one: `id, path, writer, house, rule, when, vr14, drawn, inputs, server, twin, built`. Each
row also carries `scope`, which says the part of the path a rule reaches, and `chair`, which says why the row is listed
for the chair. A composed row also carries `compose`.

A family whose writer, rule and drawn answer all agree is folded into one anchored regex. Point 9 of the chair message
asks whether the chair wants literally one row per path instead.

The rule and `when` of each composed row are DERIVED by one function, `derivedRule` (VR12):
- **An input that tells.** An input withheld because a hidden house moves it (`house-hidden` or VR14 (i)) moves the row.
  The row then takes its own `compose` answer.
- **An input that does not tell.** An input withheld for payload minimisation only (VR16, iii) does not move the row.
- **An undrawn composed row** is withheld always.

Twelve rows match no differ path. They are registered from VR4 and SUB-BRIEF-BCD: C's flags, the names lists, D's
criminal row and percentages, blackMarketCapture, merchantCriminalBlur, crimeTypes, plotHooks, criminalInstitutions, the
criminal desk, NPC secrets, and M4's `legitimacyCrisis`.

**The rows by rule and by VR14 class (counts):**

| rule / when | (i) | (ii) | (iii) | (iv) | none | rows | paths covered |
|---|---|---|---|---|---|---|---|
| withhold / always (R2) | 11 | 0 | 20 | 0 | 33 | 64 | 88 |
| withhold / house-hidden (R3, R4, B, D) | 1 | 0 | 0 | 0 | 28 | 29 | 68 |
| recompose / house-hidden (R3, C, D) | 1 | 2 | 0 | 2 | 2 | 7 | 5 |
| recompose / always (the drawn integer) | 0 | 0 | 0 | 1 | 0 | 1 | 1 |
| diffuse (VR8, VR14 (iv)) | 0 | 0 | 0 | 18 | 11 | 29 | 38 |
| rng (VR13) | 0 | 0 | 0 | 2 | 10 | 12 | 14 |
| **all** | 13 | 2 | 20 | 23 | 84 | **142** | **214** |

`drawn` follows VR7-MEASURE M3 wherever M3 reached the path:
- **M3's one unread path, resolved:** `history.currentTensions[].factions[]` is DRAWN (`HistoryTab.jsx :: TensionRow`
  chips).
- **Paths M3 did not reach:** eight rows are `unsettled` (master's defence gates and scores, the conflicts,
  `factionRelationships[].direction`, `legitimacyCrisis`, the four `incomeWeight` sites, campaign-only storage months).
  R2's render-twice test decides them (VR16 (1)).

**The hosts** (the module's `REGISTRY_HOSTS`):
- **Built rules live in existing hosts.** B and C use `_gallery_veil_second_homes` / `withholdSecondHomes`. D uses
  `_gallery_veil_apply` / `withholdCriminalIncome`. Diffuse and rng rows use `get_gallery_dossier` / `galleryPayloadFor`
  (sent as stored).
- **Planned hosts** (they do not exist yet):

  | Stage | Server | Twin |
  |---|---|---|
  | R2 | `_gallery_veil_withhold_always` | `withholdAlways` |
  | R3 | `_gallery_veil_roster_choices` | `applyRosterChoices` |
  | R4 | `_gallery_veil_holders` and `_gallery_veil_rekey` | `withholdHolders` and `rekeyPeople` |
  | R5 | `_gallery_veil_composed` | `withholdComposed` |

  Each later stage may rename these; the walker requires only that a BUILT row's symbol exists and names its id.

## 3. Rows left to the chair

These went to the chair in one message (2026-11-20 ~00:34 UTC). For each, the law decided the row meanwhile.

| # | Row(s) | Recommendation |
|---|---|---|
| 1 | `compound.economyOutput` | Send it only as the drawn integer. |
| 2 | `safetyRatio` and `blackMarketCapture` | Withhold always, and the VR12 rows follow (shadowEconomy, structureFlag, templeFraud). |
| 3 | The criminal POWER entry | Withhold, with VR11; its relations, dmNote, recentConflict and desc follow. |
| 4 | The "only in B" composition rows and `conflicts[]` | Diffuse. |
| 5 | The crime-worded stability label | Withhold. Its absence tells in 14 towns; a fixed lawful label would need a ruling. |
| 6 | `economy:economics.incomeWeight` | Diffuse (iv). It conflicts with BCD D(4); VEIL-19's grep decides. |
| 7 | `institutions[].desc` | rng. |
| 8 | `npcs[].memberships[].veiled` | NOT DECIDED. The import may need it; that is for R2's import measure. |
| 9 | The row form | Families folded into regexes. |
| 10 | `rulings.json` carries no rng rows while every row is unbuilt | Should the VR13 rows be marked built at R2? |
| 11 | The reconstructed rng ruling | — |

## 4. THE PROOF OF R1 (`R1-gate-readings.txt`, executed)

| Run | Committed export (built rows only, so none) | Every row exported to `/var/tmp/v18/all` (outside the tree) |
|---|---|---|
| New shape, gallery | `registered 0 \| diffuse 0 \| rng-only 0 \| UNREGISTERED 144` (exit 1) | `registered 106 \| diffuse 24 \| rng-only 14 \| UNREGISTERED 0` (exit 0) |
| New shape, link | 138 unregistered (exit 1) | `100 \| 24 \| 14 \| 0` (exit 0) |
| Master's shape, gallery | 155 unregistered (exit 1) | `120 \| 25 \| 10 \| 0` (exit 0) |
| Master's shape, link | 142 unregistered (exit 1) | `107 \| 25 \| 10 \| 0` (exit 0) |

**What the committed reading shows.** Each figure is the baseline's unregistered plus rng-only paths, path for path
(compared on all four runs). It equals the baseline exactly modulo the VR13 rng ruling, which the committed
`rulings.json` does not carry while every row is unbuilt (point 10). No behaviour changed.

**What the every-row reading shows.** ZERO unregistered on both shapes, the gallery read and the link.

## 5. The walker, red first, then green (`R1-walker-redgreen.txt`, executed)

The tracked files were restored byte-identical (sha256 verified), and the plant files were deleted.

| Plant | Red, the walker's own words |
|---|---|
| A1: an `isCriminalInstitution` call from a new generator function | ARM A, `src/generators/__r1plantA.js :: plantChooser` |
| A2: a `/smuggler den/i` literal at a new generator site (the brief's regex arm) | ARM A, `__r1plantB.js :: PLANT_DEN` |
| B: a second crime literal at the registered `threatProfile.js :: TYPE_PATTERNS` | ARM B, "registered 1, found 2" |
| C1: a row with no server symbol | ARM C, "no server symbol" |
| C2: a row with no twin symbol | ARM C, "no twin symbol" |
| D1: a row marked built on a planned host | ARM D, "not a function of 212" and "not a top-level declaration" |
| D2: a row marked built on an existing host with no `-- registry:` / `// registry:` | ARM D, "does not name it" |
| E: `registry.json` edited by hand | ARM E. `--check` also exits 1 on `rulings.json` edited by hand. |

Green before and after: 10 of 10. The census also proves itself on every run: a synthetic source is walked before the
live tree is trusted, and it asserts zero parse failures over 478 files (the generators plus the composer's
transitive reach).

## 6. Guards run at the commit, and the stored figures the change moves (NOT re-taken here; VEIL-19 takes each door once at the merged tree)

**Guards, all executed and green (re-run at the second commit):**
- the walker, 10 of 10;
- `tests/lint/mutationCoverageManifest.test.js`, 10 of 10;
- eslint on the three new JS files, 0;
- `typecheck:domain:strict` and `typecheck:ratchet`, both exit 0 (the module is strict-clean);
- `--check`, 0.

**The whole `tests/lint` directory, executed at the first commit b4ed24b04 (220 files):** 13 files were red.

**Ten of them are red at the base too.** I ran the same 13 files in a worktree at bedd5a392. Ten fail there, and their
failure messages are identical to mine, compared line by line. Those are the base's, not mine:
- `chainPrintSites`
- `ledgerCitationIntegrity`: it needs the ledger ref `review-fixes-2026-07-08`, which a shallow clone lacks
- `noLegacyFactionReaders`
- `observedShapeReaders`: violations 1
- `presumedThings`: 4 hits
- `proseWiringCensus`
- `slugifyIdiomBaseline`
- `sovereigntyLightingContract`
- `styleLaw`
- `writerReach`: the same `weight` row on contenders

**Four reds were my own, and each was cured in my own files in the second commit:**

| Walker | What it found | The cure |
|---|---|---|
| `moduleScopeCwdRatchet` | 18 roots against 17 banked | The walker's ROOT now comes from `import.meta.url`. |
| `netCurrentExtractorAnchor` | two unanchored function regexes | Now `^create\s+or\s+replace\s+function` with the m flag. |
| `presumptionClasses` | a "size" word in a note | The note is reworded. |
| `presumedThings` | 8 new hits from my note strings: the trade, crime and place words in the `scope`, `chair` and `why` texts | Reworded, so its count is back to the base's 4. |

After the cures those four walkers and the registry's own walker are green. ARM D's plants were re-run after the anchor
cure (`R1-walker-redgreen.txt`, its tail), and the every-row export is byte-identical, so the gate readings stand.

**THE STORED FIGURE MY CHANGE MOVES (not re-taken here):**
- **The lighting census** (`tests/lint/.lighting-census-baseline.json`, frozen at 3705 files).
  - The estate read 3707 at the base, already red, and reads 3708 on my branch. The +1 is my new walker file.
  - The walker asserts the file count first. Its other figures (parked, credited, titles, suiteTitles) were therefore
    not read here.
  - The expected movement is +1 file, and in titles my walker's own: 10 tests in 5 describe blocks. That is PLAUSIBLE,
    not measured.
  - Door: `LIGHTING_CENSUS_REFREEZE='VEIL-19' LIGHTING_CENSUS_NOTE='VEIL-R1: the roster-choice registry walker'
    npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js`, on a clean tree at the merged tip.
- **Did not move:** the writers' reach (`writerReach`'s message is the same as at the base), the wiring census
  (`proseWiringCensus`, the same) and the tuning inventory (`tuningRegister.walker` green: no new top-level named
  numeric constant).
- **The test ratchet** (`scripts/.test-ratchet-baseline.json`, in `npm run check`): gains one file and 10 tests. Not
  run here; the whole check is not run on a lane branch.

## 7. How the instruments are re-made

PART 19 section 4 and the reader's hand-off section 4, with these changes:

1. **The cluster.** `initdb` at `/var/tmp/r1pg` (C.UTF-8, trust), with `listen_addresses = ''`, the socket in
   `/var/tmp/rv7` and `fsync = off`.
2. **The pg module.** `pg@8.13.1` in `/var/tmp/v18/pgmod`.
3. **The readers' library.**
   - 72a3bb24f is not in a shallow clone. It is the tip of `lane/review-veil-3-2026-11-12`: run
     `git fetch --depth=1 origin lane/review-veil-3-2026-11-12`, then `git archive 72a3bb24f …REVIEW-VEIL-6 …-7 …-8`
     into `/var/tmp/v18/lib`.
   - Put the REVIEW-VEIL-9 probes in `/var/tmp/v18/rv9` by `git archive`.
   - None of it is committed.
4. **The trees.**
   - The base is `git archive bedd5a392` into `/var/tmp/v18/base`.
   - Master is a worktree at origin/master db832c892, in `/home/user/wt/master`.
   - Each takes `cp -al` of this checkout's real `node_modules`, installed by `npm ci` with hooks. The package-locks
     are equal, and nothing is symlinked.
5. **The runner.** `instruments/run-differ-server2.sh <src> <out> <N> <gallery|link> <gen> <chain spec>` is VEIL-18's
   runner with the generator and the chain as arguments.
6. **The rest.** `classlist.mjs` lists the in-class paths, and `tally.mjs` counts the rows and paths. The rng ruling is
   `instruments/rul-vr13.json`.
7. **The four runs.** Each took about 4 minutes on 4 shards.

## 8. Executed or plausible

**Executed:**
- the four differ runs and every gate reading;
- the reader-path equality;
- the walker's plants and their greens;
- the type gates, eslint and the manifest test;
- the census (71 sites);
- the sha256 values.

**Plausible (read, not executed):**
- every row's `writer` symbol (traced by grep to its function; not stepped through);
- every `drawn` answer not taken from M3;
- the `scope` notes;
- whether the planned hosts are the right places for R2 to R5.

**Not done here:** no rule is built (R1 builds none).


## 9. THE CHAIR'S RULINGS OF 00:44 UTC, APPLIED (the third commit; written 01:06 UTC)

**The chair's two messages, read at 00:59 UTC.** They were sent at 00:11 and 00:44 UTC; the harness delivered both late.

**THE HAZARD CHECK (the 00:11 message), executed:**
- `git config` shows `core.bare=false` and the user `Claude <noreply@anthropic.com>`. There is no "Fixture" user.
- All three commits are authored by the harness identity.
- `env | grep '^GIT_'` shows only the harness's `GIT_CONFIG_*`, `GIT_SSL_CAINFO`, `GIT_EDITOR` and `GIT_TERMINAL_PROMPT`.
  There is no `GIT_DIR`.
- My pushes were lane-only fast-forwards, so the hook ran the three fast gates and no tests.
- I ran the `tests/lint` directory once, from a plain shell. I ran neither the whole suite nor `tests/scripts`.

**THE ROWS, by the rulings:**

| Ruling | What changed in the rows |
|---|---|
| VR19, 1 | `compound.economyOutput` is now withheld always, class (i), page `re-derive`. `getInstFlags(config, institutions)` reads only the config and the house names, both served. That every config key it reads survives the projection is PLAUSIBLE, not executed. |
| 2 | `safetyRatio` and `blackMarketCapture` are withheld always, page `not drawn`. The daily-life order words cut safetyRatio at 2.0 / 1.5 / 1.2 / 1.0 / 0.7 / 0.5 (`dailyLifeLogic.js` safetyScore). The band cuts effectiveSafety at 3.5 / 2 / 1.2 / 0.6. The words are FINER, and no served field re-derives the ratio, so the page does not draw them. `shadowEconomy`, `structureFlag` and `templeFraud` carry `crimeOnly`, so `derivedRule` keeps them conditional (VR19 (d)): withheld where a house is hidden whole or the grouping is shut. |
| 3, 4, 8, 9 | Accepted as they stood. The chair notes are cleared. |
| 5 | `power.stability` is now `recompose`, always, page `not drawn`: the band word stays and the cause is withheld on every read. |
| 6 | `prose.incomeWeight` is class (ii). It follows item D: it is re-derived with the percentages (input `income.percentage`), on D's hosts. |
| 7 | `institutions[].desc` is (b), withheld where a house is hidden whole. Measured on the three towns: each description is one of a declared twin pair in `institutionDescVariants.js` ("belongs solely to" excludes 'rival power'; its twin is "rests with"). The pair is resolved by `drawDeclared.js :: drawDeclared` over the fact 'rival power', read from powerStructure, which the hidden house's power moves. So it is not rng. |
| 10 | Every rng row is built (a ruling, not a build). A diffuse row carries `condition` (the band's: both `criminalEffective`, `safetyRatio`, both `militaryEffective`) and is exported once those rows are built. |
| 11 | The reader's `rul-vr13.json` is on origin and holds the pattern I had rebuilt. My copy was removed; the readings cite the reader's file. |
| V10-1 | The tile columns are rows. `tile.stability` copies `power.stability`, and `tile.prosperity` copies `economy.prosperity`. `tile.threat_level` and `tile.government_type` are diffuse: their sources (`threatProfile.level`, `powerStructure.government`) differed in none of the four runs. `chronicle` is a PLACEHOLDER family, withheld where a house is hidden whole until VEIL-19 designs it. The hosts are planned (`_gallery_veil_tile_columns`, `_gallery_veil_chronicle`). |

**The walker gained ARM F:**
- a `page` answer appears only on a value withheld on every read;
- every rng row is built;
- a diffuse row is built exactly when its condition is;
- a copy takes its source's rule.

ARM D now binds only built withhold and recompose rows. A built rng or diffuse row is sent as stored, so no rule names
it.

**THE ROWS NOW: 147 rows**

| rule / when | (i) | (ii) | (iii) | (iv) | none | rows |
|---|---|---|---|---|---|---|
| withhold / always | 12 | 0 | 20 | 0 | 30 | 62 |
| withhold / house-hidden | 1 | 0 | 0 | 0 | 32 | 33 |
| recompose / house-hidden | 1 | 3 | 0 | 2 | 2 | 8 |
| recompose / always (VR19 (a): the band kept, the rest withheld) | 0 | 0 | 0 | 2 | 0 | 2 |
| diffuse (exported once the band's condition is built) | 0 | 0 | 0 | 18 | 13 | 31 |
| rng (built) | 0 | 0 | 0 | 2 | 9 | 11 |
| **all** | 14 | 3 | 20 | 24 | 86 | **147** |

**THE GATE, re-read at the third commit (`R1-gate-readings.txt`):**

| Run | Baseline (empty registry + the reader's VR13) | Committed export | Every row |
|---|---|---|---|
| New shape, gallery | 124 / 20 | 131 unregistered / 13 rng-only | 0 unregistered (108 registered, 23 diffuse, 13 rng) |
| New shape, link | 118 / 20 | 125 / 13 | 0 |
| Master's shape, gallery | 135 / 20 | 145 / 10 | 0 |
| Master's shape, link | 122 / 20 | 132 / 10 | 0 |

Each total is unchanged (144, 138, 155, 142). The committed reading moves 7 paths (10 in master's shape) from the
reader's rng pattern to unregistered. The registry rules those paths otherwise: the crime-wave entries "only in A"
(withheld, VR4 ii-11) and the undrawn history fields (withheld always, VR16). They stay unregistered until R2 and R3
build them. No behaviour changed.

### (i) WHAT A SHARED PAGE LOSES UNDER THE REGISTRY (drawn rows only; the undrawn ones cost no page)

**Withheld on EVERY non-owner read, whatever the veil:**

| Row | Page |
|---|---|
| `compound.economyOutput` (the Economics output chip, "NN/100") | the page RE-DERIVES it from the served config and houses |
| `safety.safetyRatio` (the daily-life order words) | NOT DRAWN (finer than the band) |
| `safety.blackMarketCapture` (the shadow-economy figure) | NOT DRAWN |
| `power.stability`, the cause after the band word (e.g. "(pervasive organized crime)") | NOT DRAWN; the band word stays |
| `tile.stability` (the gallery card's stability cause) | NOT DRAWN; the band word stays |
| `food.storageMonths`, `power.relation.direction`, `power.factions.legitimacyCrisis` | drawn status UNSETTLED; R2's render-twice test decides |

**Withheld or recomposed ONLY where a house is hidden whole (or, where its grouping governs, the grouping is shut):**
- **Recomposed to the served town's wording:** the gates tail and the foothold word (`guardEffectivenessDesc`,
  `safetyDesc`), `economicComplexity`, the income percentages and `incomeWeight`, the powers' shares and labels.
- **Withheld:**
  - from the income: the criminal income row and its desc, `economicDragDesc`;
  - from the safety profile: crimeTypes entries, plot hooks, `criminalInstitutions`;
  - from the history: the crime-wave tension and event, and a legacy line composed from one;
  - from the houses and powers: the open houses' twin descriptions, the criminal power with its relations, dmNote,
    recentConflict and power descriptions;
  - from the people: the handler ties, the trace's criminal-allegiance entries, the holder's card whole with its roster
    copies, ties, prominentRelationship and pressureSentence, and the people's secrets;
  - from the prose: `shadowEconomy`, `incomeMix`, `structureFlag`, `templeFraud`, the criminal desk;
  - the chronicle (placeholder).

### (ii) V10-1, THE COLUMNS BESIDE `data` (registered; not in the differ, which reads `data` only)

The tile columns are cut from `data` by `_gallery_public_tile_rows` (147) and returned by `get_gallery_dossier` and
the gallery list's cards:

| Row | Source | Rule |
|---|---|---|
| `tile.stability` | `powerStructure.stability` | its source's: the band kept, the cause withheld always |
| `tile.prosperity` | `economicState.prosperity` | its source's: diffuse |
| `tile.threat_level` | `threatProfile.level` | diffuse, recorded |
| `tile.government_type` | `powerStructure.government` | diffuse, recorded |
| `chronicle` (`_gallery_chronicle_json` over `campaign_state.eventLog`) | — | a placeholder family for VEIL-19 |

The paths `tile.<column>` and `chronicle` are this registry's own names: no differ run produces them yet, because they
are columns, not `data`.
