# U6 THE PROSE (CS12): a holder is not "under" the office it holds. Builder BU6.

Written 2026-11-22T07:40:13Z by SEAT-10, on the chair's rulings of 07:21Z and 07:37Z (the wordings below are the CHAIR'S, verbatim). It lands as "SEAT-B <commit>".

## WHAT IS WRONG (measured: `u6probe/result.json`, 150 lit germanic births, thorp to metropolis × 25)

Under the LIT law, 78 of 150 births seat the holder (`seat/holderOfSeat.js :: holderOf(s, { audience: 'owner' }).holder`) apart from the form (`rulingPower.js :: governingFactionOf`). In those births, 63 form↔holder relation rows (`factionDynamics.js :: computeFactionRelationships`) and the holder row's standing (`power/factionStanding.js :: annotateFactionStanding`) set the seat against its own holder. For example: "The Merchant Guilds work under the rules the Town Council sets…", "The Elder Council needs the taxes and loans of the Merchant Guilds…", "They operate in the shadow of the governing council…".

## THE LINES (the chair's; {Form} = the governing row, {Holder} = the holder; names through `governanceAccount.js :: powerNameInProse` or the file's own `say`/`verb` helpers; the verb by number; no colon afterthought anywhere)

- **W1, the form↔holder relation row, a POOL of six:**
  1. "The {Form} is the office here, and {Holder} {hold/holds} it."
  2. "{Holder} {sit/sits} in the {Form} and {make/makes} its rulings."
  3. "The {Form}'s seats are filled by {Holder}."
  4. "Whoever comes before the {Form} comes before {Holder}."
  5. "The {Form} is how this place is ruled, and {Holder} {rule/rules} through it."
  6. "It is {Holder} who {sit/sits} in the {Form}."
- **W2, appended to W1 ONLY on a licensed pair** (`seat/seatTable.js :: pairLicense(kind, form).pair === 'licensed'`; today only a merchant in Royal Authority or Ducal Governorship, under `trade_wealth`), ONE line: "They came to it by trade, and the money that runs this place passes through their hands."
- **W3, the holder row's standing, a POOL of five** (it replaces that row's "in the shadow of…", "The gap between them and … is narrow…" and "Behind …" lines):
  1. "They hold the {Form}'s seat, and answer for what it does."
  2. "They sit in the {Form} themselves, and its rulings are their own."
  3. "They govern through the {Form}, and what it orders is their order."
  4. "They hold the {Form}, and nothing it decides is decided without them."
  5. "They are the ones who sit in the {Form}, and its word is theirs."

## THE CONDITIONS (each binds)

1. **The pools are a NEW `src/data` table** (for example `src/data/seatHolderLines.js`). It is drawn ONLY through `src/kernel/proseHash.js :: pickVariantMixed` (the kernel's mixed key; never `pickVariant`). The key is built from what every read serves: the record's seed and the two names, never a hidden fact.
2. **The table goes on the sameness door's hand list:** `tests/lint/samenessHideable.handPools.json` (a row a table). `tests/lint/samenessHideable.walker.test.js :: HAND_CEILING` is raised from 73 by EXACTLY your rows, its comment extended in the file's idiom, and the house readings re-taken as the walker's header says.
3. **THE GATE:** W1, W2 and W3 apply ONLY when the record is under the seat law (`seatLaw.js :: seatsByHolder`, read off the record or the born config), the holder stands APART from the form, and `seatTable.js :: isVeiledRow(holder)` is false. A hidden or criminal holder keeps today's lines: nothing new is exposed. Under law 1 NOT ONE BYTE moves.
4. **The archetype's "…expect council access in return."** (`power/rulingStructure.js:464`, `power/claimStanding.js:41,128`): a GATE ONLY, no new wording. On a row that HOLDS the form, that clause does not print. Cut it at a sentence boundary, so the row's desc keeps its first clause ("Established merchant community; fund civic works") with the sentence closed properly. If that cannot be done without authoring a word, STOP and report it: it is then the second deploy's.
5. **FAULT (c), RED FIRST:** `power/rulingStructure.js:738` hands `annotateFactionStanding` the seat `{ publicLegitimacy }` with no `config`, so the birth's `contestedBy` (`SEAT_CONTESTED_STANDING`) reads law 1 under a lit birth. Hand it the born config (the step's `config`), as `factionStanding.js:84` already accepts.
   - Red first: a lit birth (the dials planted as in `tests/domain/seat/seatLawSavedTown.test.js`) whose law-1 `contestedBy` differs from the law-2 field (`coupContenders` under the law).
   - Find the witness by search over seeds. If none is found in 600 births, STOP and report the count: no fabricated fault.
6. **FAULT (b), RED FIRST:** `people/castPowers.js :: raiseToOfficeBand` calls `powerBandOfRole(officeRole)` with no config, so it reads law 1. Hand it the born config or the record.
   - Red first: a lit birth whose office role takes a different band under the law's fold (`npc/powerBand.js`).
   - Same search rule as (c).

## WHERE AND WHAT YOU MAY TOUCH

- **Tree:** ONLY the scratch clone `/tmp/claude-0/-home-user-settlement-engine/063b430e-c1e9-57b8-bc28-1d71aefb0933/scratchpad/bu6`, branch `u6`, cut at `46339e5c7`. Read this brief from `/home/user/settlement-engine/docs/chair/2026-11-20/content/seat/briefs/U6-PROSE.md` (read-only there). NEVER write, run git in, or run tests in `/home/user/settlement-engine`.
- **Manifest:**
  - `src/data/<new table>.js`, `src/generators/factionDynamics.js`, `src/generators/power/factionStanding.js`, `src/generators/power/rulingStructure.js`, `src/generators/power/claimStanding.js` and `src/generators/people/castPowers.js`;
  - one NEW test file under `tests/generators/seat/` (its basename clear of the mutation manifest's pattern: census, scan, baseline, ratchet, walker, killlist, parity, coverage, governance, freshness, integrity, exhaustiveness, roundtrip, golden, contract, pin);
  - `tests/lint/samenessHideable.handPools.json` and `HAND_CEILING` with its comment;
  - your report `docs/chair/2026-11-20/content/seat/briefs/U6-PROSE-REPORT.md`.
  - Nothing else. A size ceiling in the way is cured by a leaf, never by packing lines (SEAT-7 item 73).
- **Git:** commit in the clone by explicit paths. No push, no pull request. If you must stop unfinished, commit what you hold and say so. The integrator pushes it as `lane/seat-10-2026-11-21-u6-wip`.

## THE TEST (one file; every expected word a literal; labels on every expect; absences through `expectPresentThenAbsent` with `// anchored:` on the assertion's own line or the one above it)

- (1) Faults (b) and (c): each red first on its witness seed, then green.
- (2) A lit birth with the holder apart prints a W1 line on the form↔holder row and a W3 line on the holder row, and no "work under the rules…" / "in the shadow of…" line on that row.
- (3) A veiled holder keeps today's lines.
- (4) The licensed pair takes W2.
- (5) Under law 1 the record is byte-identical to the pre-U6 tree. Prove it as a differential in one tree: law 1 against law 1 with the new code paths forced off. NO stored digest.

## GREEN (single files through `TMPDIR=/tmp GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 <files>`, output to a file, read after; never a pipe)

- The new file green.
- Green and unmoved: `tests/domain/seat` whole, `tests/generators/seatBandFold.test.js`, `tests/generators/people/seatKeeperContender.test.js` and `tests/generators/powerStructure.test.js` (its red on RED-AT-LINE excepted, named).
- **AFTER ANY TEST CHANGE, `tests/lint` WHOLE** (COMMON-EIGHTH 11), once at the end. Report its counts, and each red by name: a register red you leave for the integrator's door (the wiring census, the lighting census, writer-reach); any other red you cure or report.
- The flipped copy: a SECOND scratch copy of your tree with exactly the two dials. There, the new file green and `tests/domain/seat` green.
- The dark proof (confine-two) is the integrator's: do not run it.

## LIMITS

- **Environment:** never with GIT_DIR, GIT_WORK_TREE, GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY or GIT_PREFIX set. No supabase, no hosted database, no deploy, no build.
- **If your own permission check refuses any action:** that refusal stands. Report it in one line and try nothing else to the same end.
- **Budget:** the account is near its weekly limit. Work tightly, read only what you need, and commit at each natural stop.

## OUTPUT

`U6-PROSE-REPORT.md` holds:
- the cure by `file :: symbol`;
- the two witnesses with their reds;
- each GREEN with its count;
- `tests/lint` whole;
- the flipped copy's diff;
- your commit sha.

Label each claim CONFIRMED (run) or PLAUSIBLE (read). Final message: at most 200 words, the sha first.

## ADDENDUM (written 2026-11-22T09:19:34Z by SEAT-10, on the chair's E65 of 09:14Z): THE FINAL-RECORD PASS

**(1) THE MANIFEST WIDENS** to `src/generators/generateSettlementPipeline.js`: ONE final-record pass beside `claimStanding.js :: settleArcaneToPractitioners`. It applies W1, W2 and W3 where the holder is known only on the final record (R2: the person's first power, cast after the power step). It binds on five conditions:
- (a) **It draws NOTHING from the stream.** Keyed picks only, as built.
  - The dark control: two trees, with the law's key absent, give 0 differences of any kind.
  - The integrator runs confine-two; you run the in-tree differential.
- (b) **Under the lit law,** on the 150 births of `u6probe`:
  - how many of the 63 form↔holder rows now print W1 (name each that does not, and why);
  - how many places print W2.
- (c) **THE BAR:** the commonest W1 and the commonest W3 sentence by size, against about 15% of a size's places.
- (d) **The pass is NAMED** wherever the pipeline's settle passes are listed or pinned. Name every stored fingerprint or census it moves, and say which of those rows are already red on RED-AT-LINE (`docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv` on `origin/lane/chair-2026-11-08`).
- (e) **ONE ORDERING PROOF:** it runs after the people are cast and before anything that reads the relation rows it rewrites.

**(2) W3 FOR A HOLDER OF ANY RANK,** in the same pass: one row a seat, the same gate (`!isVeiledRow`). "always at the table" stays for a rank-2 power that does NOT hold.

**(3) FAULT (b) IS CLOSED: unreachable at birth, named, not cured** (600 lit births, 526 calls, 0 differ). Stop searching.
- KEEP ONE SMALL GUARD: a test over a seeded sample (as many births as run in a few seconds) that the fold leaves `raiseToOfficeBand` unchanged, so it reds the day the fault becomes reachable.
- Say its size.
