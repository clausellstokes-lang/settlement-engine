# V33-JOINPROBE: THE JOIN PROBE, PASS 1 (DARK). A measure of what the join adds, never the join.
Builder V33-JOINPROBE for VEIL-33, 2026-11-22. Worktree `/home/user/wt/jp`, branch `lane/veil-33-2026-11-22-joinprobe-wip` (local; never pushed).
Lane side ed027fca7 (src/supabase/tests = 3cca025b8). Line side: THE CHAIR'S PASS-1 REF `lane/close-1-join-scratch-2026-11-22` AT 4bba8781d
(stack-97 840020b9b + fortune's lane f13f31820 merged as a TRIAL; both laws present and DARK), per the seat's re-made merge and brief dcc79a5a5.
Nothing was done against the first (stack-97) merge but git reads; my probe files are ref-independent and were kept.
All databases are local (PGHOST=/var/tmp/rv7). Nothing in supabase/, the twin, the registry or any test was changed. Every heavy run went
inside `scripts/gate-mutex.sh --run`, and every one started after the seat's chain wrote END (09:47:26).

## STOPS
NONE. Nothing exited non-zero for a reason other than a measure's own red: every pool shard, gate shard and probe shard returned rc=0. 212's sha256 on this tree is
8688ddb6148e84baaeee6f9cdcd89fec40a382c390f44133affa15ae66cc5a3a. No step needed a change to 212, the twin, the registry or a test. No
permission refusal.

## 1. The commit of the merge
- **27c7e79dd** (parents ed027fca7, 4bba8781d): `git commit --no-edit` with the hooks (never `--no-verify`), inside the mutex.
  **lint-staged changed NOTHING**: the committed tree 26963dc5b is the pre-commit index tree.
- `git diff --stat ed027fca7 HEAD -- src supabase | tail -1`: **116 files changed, 10189 insertions(+), 987 deletions(-)**. Over
  `supabase` alone the stat is empty.

## 2. The conflicts and the worklist (`conflicts.md`, appended)
The eleven are resolved to the line's bytes at 4bba8781d exactly. The worklist, one line a file, is in `conflicts.md`. In short:
registers 1, 2, 4, 5 keep the line's measures and drop the lane's re-takes (VEIL-17, VEIL-21 R2, VR3). Test 3 drops VR47's
re-measure (72→77 and 71→76). Test 6 drops the lane's EXEMPT rows for `importRederive.js` and `pageRederive.js` and its count
of 118. Test 7 drops VR3's ceilings 542 and 15.
**Ruling 69's fixture-git step (PART 30): FIVE of the eleven are its files** (tuningRegister walker, implementationPackets,
implementationSession, landingStageMeasure, soakRegister). Each now imports the line's own door, `tests/helpers/gitFixture.js`
(point 76, GIT-DOOR, 4b9ca37e0). `tests/helpers/fixtureGit.js` and `tests/lint/fixtureGitIsolation.walker.test.js` are left as they fell.
**Nothing imports `tests/helpers/fixtureGit.js`.** The walker reds 3 of 5 on this tree (section 5).

## 3. The pool's births (what moved in the pool itself, before any attribution)
`pool-jp1`, made fresh (part A mode `pool`; no `pool-t2sig-1` exists to re-read) with this tree's generator: part A took 16.5 min and part B 9.8 min, and all
eight shards returned rc=0. `measure/pool-compare.mjs` reads it against the lane's `pool-t2sig-2`, which the seat re-made today on the lane tip:
**NOTHING MOVED.** The two pools hold 1,200 + 608 births. Each is byte-equal to its lane twin: every seed, crisis and dial, and
part B's held hideable houses (163 / 282 / 559 / 759 by size). Tries and rejections by step are equal (e.g. metropolis A: 11054
tried, 10754 rejected at `assembleInstitutions`). The four shards' signature tables are equal (distinct full signatures off / dm:
1577/2124, 2254/2753, 1787/2238, 1546/1753). Only the CPU columns differ.
**The pool records no trouble.** Troubles on this tree's births are measured in section 6.
CONFIRMED: the line's generator changes nothing the tell's instrument reads (houses, powers, chains, income, services) on these
1,808 births.

## 4. The two gates beside the lane's
`TELL_DB=jp1 tell2.sh /home/user/wt/jp gates jp1tpl pool-jp1`: four towns shards returned rc=0, and the analyzer exited 1, which is the measure's own red, the same as the lane's.
| | lane (3cca025b8; the seat's run at a2a2cb325) | join 27c7e79dd |
|---|---|---|
| GATE-1 | 4 of 92 at every gated setting, both reads (off 4, dm 4) | **4 of 92**, identical |
| LOWER BY RULE | 7 | **7**, the same seven towns and parts |
| GATE-2 | 20 of 40 cells red | **20 of 40**, identical |
| non-governing rows against the rule | 0 | **0** |
| twin = server | yes | yes (part A server sample: 112 births, 0 differ) |
The failing towns are unchanged: r3m-city-none-1-113 and r3m-metropolis-infiltrated-0-62 (`f.economicState.safetyProfile.safetyDesc="a"`),
r3m-town-insurgency-0-14 (`r.imports.criminal="n"`) and r3m-town-none-0-23 (`f.history.currentTensions="e"`).
**`diff` of the two `tell2-table.txt` files: 20 lines, all of them the path line and the pool's CPU and wall columns.** Every count, every failing town and its
parts, and every GATE-2 failing page with its families are byte-identical (`gates/table-vs-lane.diff`). The chain's second gate run,
`chain/gates`, is byte-identical to this one.

## 5. The green chain on this tree (`measure/chain-jp.sh`; `chain/done.txt`)
chain1.sh's lines, from typecheck to acceptance, re-pointed. The lint step is not tests/lint whole but the join's: the 27 tests/lint test files the merge changes against ed027fca7.
| step | rc |
|---|---|
| typecheck | 0 (167, ceiling 167) |
| eslint (5 files) | 0 |
| walkers + manifest | **1**: `rosterChoiceRegistry.walker.test.js > ARM A` (16 UNREGISTERED sites) |
| arms 3+4+5 | 0 |
| registry-check | 0 |
| tpl (jp1tpl, this tree's 212) | 0 |
| verify (pool-jp1, 40) | 0 (45 cached births re-read, 0 differ) |
| gates (TELL_DB=jp1m) | 1, the measure's own red: section 4, identical |
| sv + handrows + born | 0 |
| harnesses (render-twice, inversion, criminal-switch reach) | 0 |
| R3 gate | 0 |
| acceptance | 0, **40 PASS** |
| `troubleHooksShared.test.js` + `samenessHideable.walker.test.js` | **1**: troubleHooksShared's one test reds at arm (D) (line 132). Arms (A), (B) and (C) hold. samenessHideable is green (its file passed; 31 of 32 tests in the two files) |
| lint, the join's 27 files | **1**: 14 failed in 7 files (below) |
| (extra) `fixtureGitIsolation.walker.test.js` | **1**: 3 of 5 (R1, R2, "the walk sees its subjects") |

THE REDS BY NAME (join-NEW unless marked; "on the lane too" means the seat's lint-whole at the lane tip, same counts):
- R-A `rosterChoiceRegistry.walker > ARM A`: 16 sites unregistered: galleryRosterChoices `BENEATH_THE_WALLS`, `GATES_BENEATH`,
  `applyRosterChoices`, `entryOut`; galleryVeil `DEFAULT_VEIL_RULES`, `applyVeil`, `curateModelFor`, `isHideable`; cardVeil
  `isHideableHouse`, `veiledOfInstitution`; shownTraditions `drawnSetOf`; traditionDescription `houseFor`, `ownerFor`, `readerView`;
  factionLeaderSecret `GUILD_REWRITTEN_WORDS`; goals `refusalRowsOf`. The lane's files are unchanged. They enter the walker's
  "composer's reach" because `publicProseCompose.js` now imports `shownTraditions.js`, which imports cardVeil and galleryVeil.
- R-D `troubleHooksShared > (D)`: `expected [] to include 'A fixer of the Hollow Hand wants a do…'`. With the DM door open and only
  the hooks' eyes opened, the lane's twin does not serve the planted hook.
- R-T `tuningRegister.walker` ×3: the inventory is not exact; `gallerySecondHomes.js: 0 -> 1`; ceilings `UNREGISTERED_NAMED 541 -> 542`,
  `DECLARED_GROWTH 14 -> 15` (worklist 5 and 7).
- R-R `ruinFilterRoster.walker` ×2: `importRederive.js` and `pageRederive.js` are not EXEMPT; readers 117 against 114 (worklist 6).
- R-O `observedShapeReaders.walker` ×2 NEW: the baseline is not content-addressed, and "a DETECTOR SOURCE drifted since the mint"
  (`scripts/check-observed-shape-readers.mjs`, `scripts/lib/observed-shape-baseline.mjs`, `scripts/migrate-observed-shape-readers.mjs`).
  Two more are ON THE LANE TOO but moved by one: A1/A7 reads 2222 → 2223 and identities 1556 → 1557 (ceiling 2214/1552); SHRINK-ONLY
  violations 5 → 6.
- R-P `proseComposed.walker > A0b`: under-claims **2322 > 2103** (the ceiling 1282 + 821 is the same on ed027fca7, 840020b9b,
  f13f31820 and HEAD; green on the lane).
- R-W `proseWiringCensus.walker` ×2, ON THE LANE TOO: at the join the census is STALE against `powerStateProse.js` and `economyStateProse.js`.
- `presumedThings > ARM 1` (57) and `presumptionClasses > no NEW undeclared line` (3: galleryRosterChoices `plenty:none`,
  gallerySecondHomes `office:none`, `size:none`): ON THE LANE TOO, the same counts. They are not the join's.
- R-G `fixtureGitIsolation.walker` ×3: R1 `tests/helpers/gitFixture.test.js:297, :329`; R2 `gitFixture.js`, `gitFixture.test.js`,
  `tuningRegister.walker`, `landingStageMeasure`, `soakRegister` (they do not call `isolateFromHostRepo()`); the subjects test.

## 6. E35's hook gap, measured both engines (`measure/hookgap.probe.jsx`, `hookgap-an.mjs`, `hookgap-eleven.mjs`; `measure/out/`)
240 births of this tree (40 a size, seeds `jp5-<size>-<i>`, DEFAULT_CONFIG; publicProse composed as a saved record). The read is arm (D)'s
on born places: the DM door open, `tab:plot_hooks` and `class:tension:hooks` written shown, and every hideable house at its default.
TWIN: `projectShareVeil(galleryPayloadFor(r, {shareDm:true, memberOverrides: eyes}), eyes)`. SERVER: a share row on jp1tpl's copy,
read by `get_gallery_dossier` (the R3 harness's insert). "Served" means the stored hook is in the document's troubles, in its text, or in the
Plot Hooks tab's collection (the test's `servedHooks`).
| size | births | places (trouble with hooks AND a hideable house) | serving any hook | served hooks | served needing a hidden house | naming a hidden house/power |
|---|---|---|---|---|---|---|
| thorp | 40 | 4 | 0 | 0 | 0 | 0 |
| hamlet | 40 | 3 | 1 | 3 | 0 | 0 |
| village | 40 | 2 | 2 | 6 | 0 | 0 |
| town | 40 | 11 | 9 | 44 | 2 | 0 |
| city | 40 | 35 | 35 | 188 | 4 | 0 |
| metropolis | 40 | 37 | 37 | 221 | 5 | 0 |
| **all** | 240 | 92 | 84 | **462** | **11** | **0** |
**SERVER = TWIN on all 92 places** (the served sets, the gap rows, the hidden houses and the naming, each equal).
- **THE STRICT GAP (a need of class crime or hideable, as the walker's `atomClass` reads it, with a hideable house hidden): 11 of 462, all
  guild_conflict 12** ("A trader outside the guild has been offered protection by people outside the law, and is tempted"; need
  `organised crime`). It is served at jp5-town-5 and jp5-town-6 {Smuggling operation}; jp5-city-0, -12, -13, -34; and jp5-metropolis-10,
  -17, -23, -27, -39 (each with 2 to 8 hidden houses: Black market, Front businesses, Smuggling network, Whisper market, Assassins' guild,
  Thieves' guild (powerful), Underground city/network, Contract killer, Multiple criminal factions: `measure/out/hookgap-table.txt`).
  The other three rows of that class (crime_wave 2, 10, 11) were not served on these births.
- AGAINST THE WALKER'S NAMED ELEVEN (its EXEMPT reason: WITHHELD 5, LISTED 6), **18 of 462** are served, every one on a place whose read hides a house:
  guild_conflict 12 ×11 (WITHHELD), succession_crisis 8 ×4 (LISTED, need `ruler: council`), external_threat 8 ×2 (LISTED, `guardPresence`),
  succession_crisis 3 ×1 (LISTED). The LISTED needs name non-hideable houses (a council, a guard), so they are not "a house the
  read hides". crime_wave 12's need `law: ≤ critical` is not of the crime class by `atomClass`. The walker calls it WITHHELD "by crime facts".
- **NAMING: 0.** No served hook names a hidden house or a withheld power by the lane's fold (`buildNameSearch` over the hidden houses'
  and withheld powers' names, with the served names open), on either engine.
- This explains arm (D)'s red (R-D) and does not contradict it. The planted hook NAMES the hidden power "The Hollow Hand", so the lane's name sweep
  withholds it. Born hooks name no house, so on born places the gap stays open.

## 7. Every red by the landed lane that brings it (`git log 8f3b8bf4b..4bba8781d`)
| red | brought by | CONFIRMED / PLAUSIBLE |
|---|---|---|
| R-A (16 sites) | **point 88** (TRAD-5, f26e934c6): the 4 traditions sites, plus the 10 lane sites by reach. **point 84** (goals-3, 31a053445): `refusalRowsOf`. **point 85** (page-6, c7687030b): `GUILD_REWRITTEN_WORDS` (`git log -S`) | CONFIRMED |
| R-D (arm D) | **point 96** (page-12, c35847792; its test cured at cc2f43aee, points 94-96) against the lane's name fold (VEIL-17's sweep, unchanged) | CONFIRMED (the planted hook's name, section 6) |
| the gap (11/462) | **point 96** (the trouble half: `troubleHooks.js`'s pool and its stored hooks) | CONFIRMED |
| R-T (×3) | the resolution toward the line: the line's register re-taken at **points 93/97** (`.tuning-inventory.json`) and its walker at **point 76** hold none of the lane's VR3/R2 rows | CONFIRMED (worklist 5, 7) |
| R-R (×2) | the resolution toward the line: the walker's EXEMPT list as **point 90** (daily-2, d50e8c0e9) left it, against the lane's VR25/R2 readers | CONFIRMED (worklist 6) |
| R-G (×3) | **point 76** (GIT-DOOR, 4b9ca37e0): the line's door `gitFixture.js` against the lane's walker | CONFIRMED |
| R-O (detector drift; +1 read and violation) | **fortune's lane (TRIAL merge 4bba8781d, f13f31820)**: the only side that changes the three detector scripts | drift CONFIRMED; the +1 PLAUSIBLE |
| R-W (stale census at the join) | **fortune's lane (TRIAL)**: it changes exactly `powerStateProse.js` and `economyStateProse.js` | PLAUSIBLE (red on the lane too, for its own rows) |
| R-P (under-claims 2322) | fortune's lane (TRIAL; the two state-prose files) or **point 89** (prose-3, e7096fe96, the walker's last line-side change) | PLAUSIBLE: not run at 840020b9b or 4bba8781d alone |
| gates | none: section 4 is identical | CONFIRMED |

## 8. PROPOSED units for the lane's writer (build none; one line each: the row, both engines, its red first)
1. (R-A) **REGISTER THE 16 SITES** in `REGISTRY_SITES` (and `--check`), the 10 lane sites as reached through `shownTraditions.js`. Both engines must
   hold the traditions' readers: `traditionDescription.js :: houseFor/ownerFor/readerView` read `isHideableHouse` and `isVeiledPower`, so 212's
   served description must take a hidden house's owner out exactly as the twin does. Red first: ARM A at the join (red now), then a born
   arm in which a tradition whose house is hidden serves no owner or house word, on both engines.
2. (the gap, 11/462) **WITHHOLD A TROUBLE HOOK WHOSE DECLARED NEED IS A HOUSE THE READ HIDES.** guild_conflict 12 (`organised crime`), and
   crime_wave 2, 10, 11 and 12 by the walker's list. On a DM-door read with the hooks' eye open, the hook goes when every house answering its need is
   veiled. 212 `get_gallery_dossier` and the twin's `projectShareVeil` must agree, from a need table both engines read. Red first: section 6's probe as a
   pglite arm over born places (11 served now, server = twin), and a planted place whose hook names no house (unlike arm (D)'s).
3. (R-D) Not a 212 unit: **arm (D) as written meets the lane's name fold**. The owner of the line's test re-plants (D) with a hook that names
   no hidden power, or reads (D) on born places, so that it pins the gap of unit 2 and not the name sweep. The walker's EXEMPT entry is
   rewritten the day unit 2 lands.
4. (R-T, R-R) **RE-TAKE THE LANE'S REGISTER ROWS BY THEIR DOORS AT THE JOIN**: VR3's two ceilings and NAME_WALK_BOUND, R2's facts/keep.js importers, and
   the EXEMPT rows for `importRederive.js` and `pageRederive.js` (readers 117). Registers only: 212 and the twin gain nothing.
5. (R-G) **RULING 69's STEP AGAINST POINT 76'S DOOR**: either the lane's walker reads `gitFixture.js`'s `fixtureGit` and
   `withoutRepositoryEnv` as isolation, or the walker and `fixtureGit.js` retire in favour of the line's guard. That is the chair's call. 212 and the twin gain nothing.
6. (R-O, R-W, R-P) **FORTUNE'S TRIAL**: its detector-script and state-prose changes need their own doors (a governed observed-shape
   migration, the wiring census re-taken, the under-claim reading attributed) before the trial lands. 212 and the twin gain nothing, unless the re-read
   shows a served fortune sentence. That is for pass 2 and the reader.

## CONFIRMED vs PLAUSIBLE
CONFIRMED (executed): the commit and its unchanged tree; the eleven at the line's bytes and the worklist; nothing imports `fixtureGit.js`;
the pool byte-equal; the gates identical (4/92, 7 LOWER, 20/40, 0); every chain exit above; the 16 sites and their points; arm (D)'s red
and its cause (the planted name); the hook gap 11/462 with server = twin and naming 0; the fixture-git walker's 3 reds; the detector
scripts changed only by fortune's trial.
PLAUSIBLE (not run at the line alone): R-P's 2322 split between fortune's trial and point 89; R-W's stale pair, and the observed-shape +1, by
fortune's trial. The hook-gap table is 240 births, not the pool's 1,808: the pool's births are signature-only, and the probe births its own.
