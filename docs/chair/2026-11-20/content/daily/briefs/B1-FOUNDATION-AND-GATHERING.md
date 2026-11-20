# DAILY-1 · B1 — THE FOUNDATION AND `gathering_places` (a build unit; read `briefs/B-BUILD-COMMON.md` first: it binds you)

Worktree `/home/user/wt-daily-b1`, branch `lane/daily-1-2026-11-20-b1` (cut by DAILY-1 from the lane's tip). Three
commits, in this order, each red first:

C1 · THE DEAD CALL (ruling 18:19). `dailyLife.js :: buildContext` calls `deriveAllNpcProfiles(settlement)` (it reads a
person's `secret` and `plotHooks`) and no deriver reads `ctx.npcs` (M1 table 6). Remove the call and the field.
RED FIRST: a PARITY ARM, new test file `tests/domain/dailyLifeNoPeople.test.js` (a name outside the mutation
manifest's pattern list, see the standard's rule 39 addendum): (a) a spy/mock proves `deriveAllNpcProfiles` is not
called by `deriveDailyLife` (red before, green after); (b) on a fixed set of born places (at least 30, all six sizes;
births as M1's script does: `docs/chair/2026-11-20/content/daily/measures/M1/measure.m1.mjs`), all eight slot texts are
byte-equal before and after the removal AND equal on the place's `src/domain/display/publicSafe.js :: toPublicSafe`
document; record the before texts as a fixture taken from the PRE-change code in the same commit. Say in the commit
the time one `deriveDailyLife` call saves (median of 30, before vs after).

C2 · THE ATOMS AND THE NEEDS. Append to `src/domain/facts/institutions.js :: INSTITUTION_KIND_PATTERNS`, one row each,
nothing else in the file touched (the chair's grant of 18:37): waterSource, dwellings, farmland, commonGrazing, bridge,
square, bakery, warehouse, theatre, fishingLanding, rootCellar, shepherd, craftGuild, each pattern exactly the name
test the LINES files used (`lines/L1/LINES-1.md` § ATOM-WANTED and `lines/L1/probe.1.mjs`); then
`src/domain/dailyLife/dailyLifeNeeds.js :: needsHold` (common law 2) with every need name LINES-1 and LINES-2 use
(`lines/L2/pools.2.mjs`, `lines/L1/probe.1.mjs :: NEED_DOC`), each through a fact home; the hideable/crime walker test.
RED FIRST: a test that a need name with no evaluator throws, and that each atom's row answers `hasInstitution` on a
record holding it (red before the rows exist).

C3 · `gathering_places` BY LINES-1 AS RULED. The pools `named` and `plain` of `lines/L1/LINES-1.md` § gathering_places
into `src/data/dailyLife/gatheringPlaces.js`, WITH THE CHAIR'S CHANGES OF 18:37: N0 reads "By midday people are
gathered on the steps of {church}, at {market} and at {inn}: talking, trading, and watching."; N17, N23, P5, P8
ALSO need a small place (thorp, hamlet or village: `record.tier` or its fact home); N26, N27, P12 are CUT (no
wellLandmark). The re-cut (live, non-hideable, non-access-only houses; the sacred-house preference order) as LINES-1
§ HOW THE POOLS ARE APPLIED says. RED FIRST: a born thorp M1 names (hxd-thorp-0) prints "the bridge" / "the open
square" it lacks; a metropolis prints "Great cathedral" with no article or "(district)". Green after; then the
probe's own numbers re-measured on the BUILT code (150 a size, top share by size, 0 false lines by M1's tests),
written to `docs/chair/2026-11-20/content/daily/measures/B1/` with its re-run line.
