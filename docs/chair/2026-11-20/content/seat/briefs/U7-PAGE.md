# U7 THE PAGE (CS13): under the seat law, the ruling chain names the HOLDER and its person, not the form's old house. Builder BU7.

Written 2026-11-22T07:47:07Z by SEAT-10, on the chair's rulings of 07:33Z (U7 before the first deploy; its red first is the probe's own cases) and 07:46Z (E45: U7 beside U6, file-disjoint). It lands as its own line, after U6.

## THE FAULT (CONFIRMED: `u7probe/U7-PROBE.md`, `u7probe/result.json`, `u7probe/probe.mjs`)

Under the LIT law, after a kept-form transfer (the form row stays governing and `holderOf(s, { audience: 'owner' })` names a new holder), `src/domain/dossier/powerStrata.js :: rulingChainOf` takes its person from the GOVERNING row's ladder (`ladderRungsOf(…, ladderFactionKeyOf(governing))`). So it names the OLD house's person as ruler.

- **The count:** 6 of 11 kept-form transfers on 160 lit germanic births (village to metropolis × 40, seeds `u7p-<size>-<i>`), all on the DM's road (`mutateSettlementChecked` with `CHANGE_RULING_POWER`).
- **The example:** `u7p-town-8`, Town Mayor, Craft Guilds → Merchant Guilds. The chain still prints "Judith Weber, the smelt master and Mayor", of the Craft Guilds.
- **The six seeds:** `probe.mjs` reproduces them on a tree with the two dials. Re-run it there to list all six by seed: the report's examples hold only some.

## THE RULE

Under the seat law (`seatLaw.js :: seatsByHolder` of the record), where the holder (`seat/holderOfSeat.js :: holderOf`) stands apart from the form:
- `rulingChainOf` keeps `power` as the FORM (the office);
- its `npc` is the HOLDER's person: `holderOf(…).person` where the record names one, else the holder house's first by the same ladder or roster rule the function uses today, applied to the HOLDER's row;
- `faction` is the holder.

Apply the same reading to `deciderOf` and `outrankingRivalOf` where they read the governing row as the ruling house. `derivePowerStrata` reads the same holder. Under law 1, or where the holder IS the form's own row, NOT ONE BYTE moves.

**THE AUDIENCE:**
- These reads serve shared and public pages (`PowerTab.jsx`, `powerStateProse.js`, `tonightSheet.js`, `crisisCast.js`, `patronage.js`, `governanceAccount.js`, `seatHolderFindings.js` read them).
- Use `holderOf(…, { audience: 'reader' })` unless the caller is the owner's own document.
- **A hidden or criminal holder** (`seatTable.js :: isVeiledRow`) is never named by these reads to a reader: the chain then prints exactly what it prints today.
- Say for each reader which audience it gets.

## NO NEW WORDING WITHOUT A RULING

If a surface needs a sentence it does not have (for example a holder line on `PowerStrata.jsx`), DO NOT WRITE IT. Commit the structural cure, STOP, and put the drafted sentence(s) in your report under "WORDINGS FOR THE CHAIR". Give each one's houses, and whether a hideable house or a crime fact chooses it. The chair rules every authored wording, and a pool would need the sameness hand list, which U6 holds now.

## WHERE AND WHAT YOU MAY TOUCH

- **Tree:** ONLY the scratch clone `/tmp/claude-0/-home-user-settlement-engine/063b430e-c1e9-57b8-bc28-1d71aefb0933/scratchpad/bu7`, branch `u7`, cut at `46339e5c7`. Read this brief from `/home/user/settlement-engine/docs/chair/2026-11-20/content/seat/briefs/U7-PAGE.md` (read-only there). NEVER write, run git in, or run tests in `/home/user/settlement-engine`.
- **Manifest:**
  - `src/domain/dossier/powerStrata.js` (the cure's home);
  - ONLY IF a reader must change to pass the audience: `src/components/new/tabs/power/PowerStrata.jsx`, `src/components/new/tabs/PowerTab.jsx`, `src/components/new/powerDeskRead.js`, `src/domain/display/stateProse/powerStateProse.js`, `src/domain/display/stateProse/printProse.js` or `src/components/dossier/EngineSections.jsx`;
  - one NEW test file `tests/domain/seat/seatChainHolder.test.js`;
  - your report `docs/chair/2026-11-20/content/seat/briefs/U7-PAGE-REPORT.md`.
  - **NOT** U6's files (`factionDynamics.js`, `power/factionStanding.js`, `power/rulingStructure.js`, `power/claimStanding.js`, `people/castPowers.js`, any new `src/data` table, `tests/generators/seat/`, `tests/lint/samenessHideable.*`). If the cure needs one, STOP and report.
  - A size ceiling in the way is cured by a leaf, never by packing lines.
- **Git:** commit in the clone by explicit paths. No push, no pull request. The integrator pushes it as `lane/seat-10-2026-11-21-u7-wip`.

## THE TEST (every expected word a literal; labels; absences through `expectPresentThenAbsent` with `// anchored:` on the assertion's line or the one above)

- (1) **RED FIRST:** the probe's six seeds, each after its DM-road kept-form transfer on a lit tree (the dials planted as in `tests/domain/seat/seatLawSavedTown.test.js`).
  - Before the cure, the chain's person is of the old house.
  - After it, the person is of the holder's house. Name the person by a literal.
- (2) A veiled holder: the chain to a reader is today's.
- (3) Under law 1: byte-identical, as a differential in one tree (no stored digest).
- (4) The holder is the form's own row: unchanged.

## GREEN (single files through `TMPDIR=/tmp GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 <files>`, output to a file, read after; never a pipe; ONE heavy run at a time, another builder shares the box)

- The new file green.
- Green and unmoved: `tests/domain/seat` whole, and every test file under `tests/` that names `powerStrata`. Find them by grep, and list them with their counts; RED-AT-LINE reds are named.
- **`tests/lint` WHOLE once at the end** (COMMON-EIGHTH 11): its counts and each red by name.
- **The flipped copy** (exactly the two dials, a separate scratch copy): the new file and `tests/domain/seat` green.
- The dark proof is the integrator's.

## LIMITS

- **Environment:** never with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX set. No supabase, no hosted database, no deploy, no build.
- **If your own permission check refuses any action:** that refusal stands. Report it in one line and try nothing else.
- **Commit** at each natural stop.

## OUTPUT

`U7-PAGE-REPORT.md` holds:
- the cure by `file :: symbol`;
- the six seeds with red and green;
- each reader's audience;
- each GREEN with its count;
- `tests/lint` whole;
- the flipped copy's diff;
- WORDINGS FOR THE CHAIR, if any;
- your sha.

Label each claim CONFIRMED (run) or PLAUSIBLE (read). Final message: at most 200 words, the sha first.
