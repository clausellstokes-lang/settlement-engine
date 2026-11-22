# MEASURE-VISITOR — the contest measured on a VISITOR's world (measure only). Builder BMV. Written 2026-11-20T17:35:57Z by SEAT-6 on the chair's 17:32Z order.

Read `briefs/COMMON.md` (its SEAT-6 section) and `briefs/MEASURE-LIT.md` and `u4/measure-lit.md` (the instrument you extend) first. **Cut from** `lane/seat-6-2026-11-20` at the commit SEAT-6 names when it dispatches you: `git checkout -b lane/seat-6-2026-11-20-visitor <commit>`, then `npm ci`. You write NOTHING under `src/` or `tests/`; plants live only in a scratch copy, as MEASURE-LIT's do.

**Files you own:** `docs/chair/2026-11-20/content/seat/u4/measure-lit.sh`, `measure-lit.mjs`, and their outputs `measure-lit.md` / `.json` (regenerated); your report `briefs/MEASURE-VISITOR-REPORT.md`.

**Why (the chair, 17:32Z).** Pool A (`measure-holder.mjs`'s default: `birthConfig({ settType: tier })`, no `DEFAULT_CONFIG`) births every place on a road at a frontier (`tradeRouteAccess` unset → `'road'`; `monsterThreat` unset → `'frontier'`): it is NOT a visitor's world and goes into no table for the owner. Pool B (the chair's 600: `{ ...birthConfig({ ...DEFAULT_CONFIG, settType: size }), ...FORCE }`, seeds `hxd-<size>-0..99`) is nearer, but a visitor's birth also carries `_randomizePriorities: true`.

**Do:**
1. **THE VISITOR POOL**: born EXACTLY as `settlementGenerateAction.js` births a visitor who touches no setting (read it whole; QUOTE the call and the config it builds in your report, signed-out and signed-in paths both, and say which you measure and why; size uniform over the six tiers, 100 a size; seeds of a new family, e.g. `visitor-<size>-<i>`). The forced law keys are set the way MEASURE-LIT sets them (on the config `birthConfig` returns). This pool is the HEADLINE of the owner's table; the chair's 600 stand beside it; pool A is reported only in the calibration and marked "not a visitor's world".
2. **THE FORTUNE TREE AT `1cd2e6d93`** (`lane/fortune-3-2026-11-20`, with its safety term; `git fetch origin lane/fortune-3-2026-11-20`): every arm with and without fortune, the scratch merge per MEASURE-LIT's own conflict recipe. If the merge has conflicts MEASURE-LIT's recipe does not cover, STOP and report them.
3. **ONE ARM ON THE CAUSE:** pool A with `tradeRouteAccess: 'random_trade'` and `monsterThreat: 'random_threat'` added (nothing else changed): does the gap between pool A and pool B close? CONFIRM or REFUTE, with the figures.
4. Keep MEASURE-LIT's calibration first (it must still reproduce the chair's joint reading on pool B at its own commits, or the instrument is refuted: STOP).

**Output:** the contender table per kind and the risk label by size, calm and crisis-born apart, calm places whose seat reads contested by size, for each arm × pool. Every rate "under today's standing" where fortune is off. ONE command, its run time stated. Report ≤350 words plus one table; commit by explicit paths with COMMON's trailers; do not push.
