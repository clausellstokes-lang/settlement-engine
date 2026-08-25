---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-03
  topic: WR-7b size-ratchet decomposition program + two ratchets broken at HEAD
  status: "in-flight (3 of 6 blocker files cleared, uncommitted)"
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-06T10:27:10.918Z
---

# WR-7b: the size-ratchet decomposition, and two ratchets already broken at HEAD

## Why this exists

WR-7b cannot commit until every lane-dirty file is eslint-clean, because
`.husky/pre-commit` runs `npx lint-staged` → `eslint --fix` on STAGED files, and a
staged file with a `max-lines` error aborts the commit. Baseline entries and
`--no-verify` are both forbidden by chair ruling R-BLD-4. So "land WR-7b" is
literally "get every dirty file under its ceiling".

**Structural reason nobody noticed sooner:** lint-staged lints only STAGED files, so a
lane that never stages an over-ceiling file commits happily past a red ratchet. WR-7b is
the first wave forced to stage them.

## The six blockers (effective lines, eslint's own max-lines measure)

| file | HEAD | ceiling | state 2026-08-03 |
|---|---|---|---|
| npcDmVerbs.js | 639 | 800 | ✅ CLEARED 972 → 711 |
| informationStatecraft.js | 755 | 800 | ✅ CLEARED 955 → 770 |
| eventProse.js | 1334 | 800 | ✅ CLEARED 1418 → 751 |
| applyWorldPulse.js | 1388 | 903 | ❌ 1395 (lane adds only 7; 485 inherited) |
| peaceTerms.js | 1289 | 800 | ❌ 1680 (489 over at HEAD) |
| envoyErrand.js | 1389 | 800 | ❌ 2638 (589 over at HEAD) |

Of the ~4,161 effective lines needing relocation, **~2,097 is inherited debt already over
ceiling at HEAD** — not WR-7b's growth.

New leaves created (all under ceiling, all uncommitted): `npcDmVerbRecords.js` (174),
`npcDmVerbAuthority.js` (127), `disinformationPlant.js` (203), `warReceiptPools.js` (674).

## ⚠️⚠️ TWO RATCHETS ARE ALREADY RED AT CLEAN HEAD — do not attribute them to your lane

Both CONFIRMED by running against a detached `git worktree add --detach <dir> HEAD`
(symlink minifold's `node_modules` in, or tsc/vitest resolve nothing):

1. **`npm run typecheck:domain:strict` — 52 files, exit 1.** `CEILING = 0`, so
   `npm run check` CANNOT PASS at HEAD, independent of WR-7b. Consequence: do NOT burn
   budget writing strict-clean JSDoc on new domain leaves; match house style. The
   burn-down is its own program.
2. **`tests/lint/domainAnyCastBaseline.test.js` — 2 assertions, exit 1 at HEAD.**
   Its per-file baseline is perturbed by ANY file split (occurrence count is
   split-invariant, but per-file entries move). The sanctioned fix is
   `node scripts/count-domain-any.mjs --update` — but **do not run it mid-program**: the
   tree carries several concurrent lanes' uncommitted work and the update would bank
   their debt into your commit. Run it only at the moment WR-7b actually lands.
3. Also inherited-red at HEAD, proven by a byte-identical failure-set diff:
   `warCoalitionKindPools` / `warRulingKindPools` / `warCostKindPools` /
   `voiceMechanics` — 20 failures, IDENTICAL at HEAD and in the tree.

## ⚠️ Decomposition hazards specific to src/domain/worldPulse

- **`tests/lint/namedPersonTransitTotality.walker.test.js` scans ALL of `src/domain`.**
  Any file containing `advanceLivedTraveller(`, `normalizeRoutePlan(`,
  `namedPersonLegPosition(`, `openNamedPersonLeg(`, `walkLivedJourney(` or
  `legArrivalTick:` must be registered in its `MOVEMENT_SITES` manifest. It ALSO pins a
  required token per registered file (`npcDmVerbs.js` must keep `advanceLivedTraveller`;
  `envoyErrand.js` must keep `namedPersonLegPosition`) and mutation-tests the literal
  string `placeNpcRecord(worldState, text(wnpcId), null, at, {`. **envoyErrand.js has a
  private `normalizeRoutePlan` — moving it to a shape leaf REQUIRES registering that leaf.**
- **`tests/domain/envoyK3BeliefSeam.test.js` pins an EXACT import list** for
  `envoyErrand.js` (`['./namedPersonTransit.js', './negotiationPictures.js']`),
  `negotiationPictures.js`, `envoyEncounter.js`, `foreignGuestHold.js`. Adding any leaf
  import trips it. The honest fix is to add each new leaf to `NEGOTIATION_MODULES` with
  its OWN closed import list (strictly strengthens the fence), never to widen
  envoyErrand's list alone. Each fenced module must also survive
  `expect(source.length).toBeGreaterThan(1000)` after comment-stripping.
- **`tests/lint/sizeBaseline.test.js` rule 3 is two-directional:** a baselined file that
  SHRANK below its frozen number FAILS and demands the number be LOWERED; one that falls
  under its LAYER ceiling demands its entry be DELETED. So decomposing
  `applyWorldPulse.js` obliges an edit to `scripts/.size-baseline.json` — that is the
  ratchet working, not a forbidden "baseline entry".

## ⚠️ Tooling trap that cost a repair cycle

Excising a function with a brace-walker: `function foo({ a, b }) {…}` — if you seek the
first `{` after the function name you land on the **parameter destructuring**, and depth
returns to 0 at the end of the PARAMETER LIST, leaving an orphaned `) { … }` tail that
parses as `Unexpected token )`. Seek the `{` that follows the closing `)` of the
parameter list, or just cut by measured line ranges. eslint caught it instantly — always
lint immediately after a scripted excision.

## How to apply

Resume by decomposing the three remaining blockers. `envoyErrand.js` needs ~6 leaves
(vocabulary+helpers ~500, normalizeErrand+evidence ~400, picture/offer ~200, then the
interception / hold-continuation / parlay / refusal writer half as PURE DELTA leaves per
R-BLD-4). `peaceTerms.js` has the identical shape/writer split. `applyWorldPulse.js`
splits at its ~40 private appliers (lines 100–937 ≈ 527 effective) — enough for 903,
not for 800 without splitting `applyWorldPulseOutcomes` itself.

Never commit a partial: the tree is written by 3+ concurrent sessions and a half-landed
decomposition of the sole envoy/treaty writers is worse than an uncommitted tree.

## ⚠️⚠️ THE TYPE SURFACE IS PART OF THE PUBLIC SURFACE (migrated from the memory index, 2026-08-06)

The memory index files this recipe under exactly this law, and the law was never written
here. Measured when `peaceTerms` was finally split **@ `bb44fccc`** (cycle 10, verified
AST-canonical; the war tranche's file 2 of 4):

**Moved typedefs broke `import('...').Type` consumers OUTSIDE the family**, and nothing in
the split's own gate saw it — it was caught ONLY by the repaired domain-strict ratchet.

**How to apply:** a decomposition's blast radius is not its import graph. Check the
WHOLE-DOMAIN strict delta on every split, not just the files you moved and their importers
— a typedef relocated out of a module is a public-API break to every `import('<module>').<Type>`
site in the estate. Same-cycle receipts on the same class: R-BLD-9 executed + pinned
(strict 1329/75 banked, any 2287/159), and `npm run build` went HARD RED on that tranche
because a rename missed a call site in `envoyInterceptionStage` (chair-fixed @ `fdfbb6c0`).
Fuller record: [[fable-build-era-takeover]] (cycle 10).
