# LANDING-9-DISTILLER — the intent-atlas soak distillate re-derived through its door (2026-11-06)

Seat: Opus 5.5, a child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), on
`lane/landing9-distiller-2026-11-06` from `3c62e8ef5`. Share: the one red `intentAtlasSoakDistiller`
("the committed distillate no longer reproduces"), INHERITED in LANDING-8 Unit 4.

| red | cause (step, commit) | door | what moved | state |
|---|---|---|---|---|
| `intentAtlasSoakDistiller` (reproduction arm, 1 of 7) | step `18fd6b442` (lane H), commit `66b1407bd` R-H5 — the food writer derives the per cent from the pounds it publishes, no floor | `node scripts/distill-intent-atlas.mjs` (documented defaults: 400 seeds, `atlas-soak`), then `npm run build:edge-shared` for the bundle that inlines it | 9 of 89 cells, all `*.resilience` (effect only; one weight): settType city·low −0.13→−0.12 (w 0.50→0.49), city·moderate −0.28→−0.29, hamlet·moderate 0.18→0.17, metropolis·low −0.14→−0.13, thorp·low 0.28→0.22, town·low −0.16→−0.15, village·moderate 0.20→0.18; tradeRoute isolated·low 0.37→0.36, road·moderate 0.14→0.13. Counts unmoved (tested 207, kept 89, untestable 39, n unmoved). Distillate sha256 `437f5dc95dbc` → `79e34a8fde5e`; `intentAtlasBundle.js` `569ff64421ec` → `e582e0764962` (source hash `5e2719f43cc6d3e6` → `d42faae6628b74c5`, meta likewise) | GREEN |

## The measurement

- Bisect (the distiller run plainly in a worktree at each first-parent step; the distillate is not a freeze-register
  surface and reads only `src/`, so the staged carry changes nothing it reads): byte-identical to the committed file at
  `3d8a74e4b`, `103b1db81`, `8e60cb2a5`, `b37bbf395`, `3da1104da`, `64ad4fe47`, `5fbb339be`, `f93c69938`, `2fa94ba8e`,
  `471780f4a`; differs at `18fd6b442`, byte-identical to the tip's output.
- Inside the step, each commit's `src/` diff reverse-applied at `18fd6b442`: reverting `66b1407bd` restores the committed
  bytes; reverting `8e92c0440` (watch texts) or `5f6d243b2` (crown-3 firstDecade) does not.
- Why: `deriveResilience` (`src/domain/state/deriveSystemState.js`) reads `foodLedger(s).deficitPct / surplusPct`
  (penalty bands at 5/15/40 %, the surplus bonus at 40 %); R-H5 changed how those per cents derive, so resilience
  crosses `coarseBand` thresholds in some of the 400 worlds and nine resilience phis move. Note `bfd70d809` (the 1 lb
  floor, step `b37bbf395`) moved nothing here.
- The edge bundle: `intentAtlasBundle.freshness` hashes the distillate as an input, so it follows in the same commit.
  `build:edge-shared` also rewrote the aiCharter / aiGrounding / aiOutputSchema / analyticsEvents bundles; those are a
  sibling seat's share and were NOT committed (left as unstaged working-tree changes in this container).

## The proof

`npx vitest run tests/domain/intentAtlasSoakDistiller.test.js` → 1 file, 7 of 7, exit 0 (redirected log). With
`intentAtlasBundle.freshness` and `intentAtlasIdFree`: 3 files, 116 of 116, exit 0.
