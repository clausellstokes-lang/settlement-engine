# VEIL-R1: hand-back. Stage R1 of the roster-choice registry (ruling VR7)

Seat: VEIL-R1, a builder of the seventh chair (session_019yED1SUxGVHyjQnoqoFvQ8). Branch `lane/veil-r1-2026-11-20`, cut
from origin/lane/veil-18-2026-11-19 at **bedd5a3921d5a34bab92d1f0f1250dd16cf51f56**. I read it back from origin first
and the two were equal. The assignment is `lane/chair-2026-11-08 :: docs/chair/2026-11-20/seventh/prompts/VEIL-R1.txt`.
The work follows `docs/chair/2026-11-19/veil/briefs/SUB-BRIEF-VR7.md`, stage R1.

Every database used is a scratch PostgreSQL 16 cluster in this container (`/var/tmp/r1pg`, unix socket `/var/tmp/rv7`,
`listen_addresses = ''`). No hosted database, no production credential, no `supabase` command, no deploy, no pull request.

**Written 2026-11-20 00:44 UTC (read from `date -u`).**

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

**Guards, all executed and green:**
- the walker, 10 of 10;
- `tests/lint/mutationCoverageManifest.test.js`, 10 of 10;
- eslint on the three new JS files, 0;
- `typecheck:domain:strict` and `typecheck:ratchet`, both exit 0 (the module is strict-clean);
- `--check`, 0.

**The whole `tests/lint` directory:** see section 6b.

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
