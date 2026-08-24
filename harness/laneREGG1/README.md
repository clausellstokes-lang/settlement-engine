# harness/laneREGG1 — TE-REG-G1's instruments (§297.2b / ODQ §577)

Lane-local, never imported by `src/`. Reproduce every figure in `laneREGG1-receipt.md` from here.

| file | what it proves | how to run |
|---|---|---|
| `runPins.mjs` | the 15 pins in `tests/domain/townMapFabricCliffs.test.js`, executed under plain node | `node harness/laneREGG1/runPins.mjs` from the tree root |
| `vitest-shim.mjs` | ⚠ the sealed W3f tree has NO node_modules and `npm install` cannot run in it. Copy this to `node_modules/vitest/index.js` (with a `package.json` naming it as `main`) and the estate-shaped pin file runs unmodified. An unimplemented matcher THROWS rather than passing. | see above |
| `cliffSweep.mjs` | the 35-leaf sweep: escarpment counts and the wall-over-cliff ops differential | `node cliffSweep.mjs <treeRoot>` |
| `fabricDigest.mjs` + `cmp.mjs` | the DORMANCY proof — a full-fabric sha256 at the tip vs a pristine `ee0db96d3` worktree | `node fabricDigest.mjs <root> <out.json> [--arm]`, then `node cmp.mjs` |
| `probeMut.mjs` | the convicting mutations and the consumption differential | `node harness/laneREGG1/probeMut.mjs` from the tree root |
| `probeAttr.mjs` | attribution of over-cliff drawn segments — the probe that ended three rounds of sampled guessing | as above |
| `probeKind.mjs` | the brink/foot re-classification agreement (84.0% hills / 81.7% mountain) | as above |
