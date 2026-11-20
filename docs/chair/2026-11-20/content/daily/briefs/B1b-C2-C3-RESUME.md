# DAILY-2 · B1b — C2 (THE ATOMS, THE ROUTE) AND C3 (`gathering_places`), RESUMED ON RULING 12

A build unit staffed by DAILY-2 (session_019yED1NEpr7XE73nDAxNLv2), who now holds the lane. You are a FRESH builder:
DAILY-1's B1 builder ended after C1 (merged at 8e2534945, the parity arm `tests/domain/dailyLifeNoPeople.test.js`).

Worktree `/home/user/wt-daily2-b1`, branch `lane/daily-2-2026-11-20-b1`, cut from the lane's tip 0eadcb032.
`node_modules` there is a symlink to `/home/user/settlement-engine/node_modules` (being installed by `npm ci` as you
start: wait until `/home/user/settlement-engine/node_modules/.bin/vitest` exists). Never stage the symlinks.

READ WHOLE, ONCE, IN THIS ORDER (all paths under `docs/chair/2026-11-20/content/daily/` unless rooted):
1. `briefs/B-BUILD-COMMON.md`: it binds you, EXCEPT where ruling 12 supersedes it (below) and except item 9's
   session trailer: yours is `Claude-Session: https://claude.ai/code/session_019yED1NEpr7XE73nDAxNLv2`.
2. `briefs/B1-FOUNDATION-AND-GATHERING.md`: sections C2 and C3 (C1 is done).
3. `DAILY-1-HANDBACK.md` sections 3 and 4 (rulings 1 to 12). RULING 12 OUTRANKS BOTH BRIEFS:
   - The 13 kinds go in BOTH `src/domain/facts/institutions.js :: INSTITUTION_KIND_PATTERNS` (appended rows) AND
     `src/domain/facts/factVocabulary.js :: INSTITUTION_WORDS` (matching rows); nothing else in either file moves
     except what the vocabulary's own atom table needs to answer them.
   - NO `dailyLifeNeeds.js` / `needsHold` module (B-BUILD-COMMON item 2 is SUPERSEDED). Every pool line is DECLARED in
     the vocabulary's own atoms (the shape `src/domain/facts/drawDeclared.js` and `factVocabulary.js ::
     declarationOf` read; find a pool in `src/data/` already declared that way and copy its form), and selected by
     `filterDeclared(pool, { facts })` then `pickVariantMixed(eligible, \`${record.name}::dailyLife.<slot>::<branch>\`)`
     (or `drawDeclared` with `draw: (p) => pickVariantMixed(p, key)`: choose the one that keeps "eligible first,
     then the keyed pick", and say which).
   - Each need of LINES-1 / LINES-2 maps to an EXISTING atom; where none exists an atom is GRANTED IN ADVANCE when its
     home is an existing getter (`factsOf`, `defenceOf`, `rulerKindOf`, `rulingBodyOf`, `marketOf`, `waterOf`,
     `tradeRouteOf`, the tier). NOT granted: a name test with no home beyond the 13 kinds: STOP and report it.
     Branch selectors (food band, threat kind/stage, tension type, audience) are not atoms: they stay in the deriver.
   - Write, in your report, ONE LINE PER ATOM YOU ADD: `ATOM <key> : <home> : <the exact pattern or getter> : <wording>`.
4. `lines/L1/LINES-1.md` § gathering_places, § ATOM-WANTED, § HOW THE POOLS ARE APPLIED, § THE HOUSES EACH SLOT NEEDS;
   `lines/L1/LINES-1b.md` where it touches gathering_places; `lines/L1/probe.1.mjs :: NEED_DOC` and its name tests.
   Do NOT read `lines/L2/` pools now (that is B3's), except `lines/L2/pools.2.mjs`'s need NAMES, so the atoms you add
   at C2 cover every need both line files use (one list, not two passes).
5. `src/domain/dailyLife.js`, `src/kernel/proseHash.js`, `src/domain/facts/drawDeclared.js`,
   `src/domain/facts/factVocabulary.js`, `src/domain/facts/institutions.js`: whole.

C2's RED FIRST (record the failing titles and lines in the commit): (a) each of the 13 kinds answers
`hasInstitution` on a planted record holding a row of that kind (red before the rows exist); (b) a dailyLife pool line
declaring an atom the vocabulary does not know is refused or throws (pin whatever the vocabulary's own rule is: never a
silent admit); (c) THE LANE'S HIDEABLE-AND-CRIME ARM (ruling 6, rule 5 of the lane): every line of every pool under
`src/data/dailyLife/` declares no crime atom and no atom a hideable house (`src/domain/people/cardVeil.js ::
isHideableHouse`) can satisfy (it reds on a planted bad line). Also write, in your report, the rows the sameness
seat's hand list (`samenessHideable.handPools.json`, SAME-2's, not on this base) will need for these pools.

C3 as the B1 brief says, with ruling 12's route. Then re-measure on the BUILT code (150 a size, M1's births, top share
by size, EMPTY by size, 0 false lines by M1's tests) into `measures/B1/` with its re-run line.

Commit C2 and C3 separately on your branch, by explicit paths. You do NOT push and do NOT merge (DAILY-2 does).
Write `measures/B1/REPORT.md` (the atom lines, the hand-list rows, the houses gathering_places needs, what moved by
which door, the red/green receipts) and commit it with C3. Your final message: B-BUILD-COMMON item 11.
