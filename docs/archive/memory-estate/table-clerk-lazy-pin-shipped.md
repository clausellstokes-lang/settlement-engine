---
name: table-clerk-lazy-pin-shipped
description: "The tableClerk first-paint pin is now enforced (commit 0e07c36c) — plus the general rule for turning a \"pinned via X\" header comment into a real guard in this repo."
metadata: 
  node_type: memory
  type: project
  originSessionId: 2c5437ed-e705-4cd3-b35e-729d3147dc2f
  modified: 2026-07-26T19:13:33.223Z
---

**SHIPPED @ 0e07c36c (2026-07-26, claude/composite-r4 in the minifold worktree)** —
`tests/build/tableClerkLazy.test.js`. `src/lib/tableClerk.js`'s header claimed ZERO
first-paint bytes "pinned via TABLE_CLERK_FINGERPRINT", but the symbol was referenced
only inside its own file: convention without enforcement. Chose option (a) (make the
pin real) over (b) (delete the fingerprint) because a fingerprint pin **is** this repo's
idiom and the literal empirically survives minification (see below).

**THE REPO'S LAZY-PIN IDIOM — copy this shape, don't invent one.** `tests/build/*Lazy.test.js`
is the family (surveyorPanelsLazy, archKernelLazy, loadingJourneyLazy, engineChunkLazy,
vendorPdfLazy, townMapLazy…). A complete pin has five layers, and the STRONG ones need
no build:
1. **ALWAYS ON** — static-edge BFS from `src/main.jsx` (contentIdentityLazy's helper
   shape); assert the target is not reachable. This is the real proof of the claim.
2. **ALWAYS ON** — source scan: no `src/**` file *statically* imports the target;
   the single dynamic `import()` parent is the expected one (archKernelLazy's
   single-lazy-parent discipline); the lazy membership chain is intact.
3. **ALWAYS ON** — `expect(!requireDist || distExists)`: `VERIFY_DIST=1` with no
   `dist/assets` HARD-FAILS. Without this, layers 4–5 are green-on-nothing.
4. `describe.runIf(distExists)` — fingerprint absent from the entry's transitive
   static closure (BFS over `dist/assets` chunk `import`/`from` specifiers).
5. `it.skipIf(!requireDist)` — anti-vacuity: the fingerprint IS in *some* emitted
   chunk, so layer 4's absence means laziness, not tree-shaking.
⚠️ Layers 4–5 are dist-gated and SILENTLY SKIP on a plain `npm run test` — see
[stale-dist-gate-gotcha]. Any flag-gated guard must say so in its own header; layers
1–3 are what makes the guard bite without a build. `npm run verify:dist` =
`VERIFY_DIST=1 vitest run tests/build/`; ci.yml runs it post-build.

**Two facts worth not re-deriving:**
- A dead exported const fingerprint DOES survive Vite/Rollup into its lazy chunk here
  (`::table-clerk:v1` is present in `dist/assets/tableClerk-*.js` while unreferenced by
  any src consumer), so an absence check keyed on one is non-vacuous. Have the test
  `import` it from the module — that also makes the export load-bearing.
- **Comments are stripped by the build.** A comment-only src edit provably cannot move
  any chunk's byte count — useful for attributing byte-ceiling reds away from your diff
  without a base rebuild.

**New `tests/build/*.test.js` files need NO mutation-coverage-manifest entry** as long
as the basename carries no invariant-nomenclature token (census|scan|baseline|ratchet|
walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|
golden|contract|pin) — `tests/build` is not one of the seven E-A enforcer dirs. Naming a
build test `…Pin.test.js` or `…Scan.test.js` silently conscripts it into E-A totality.
See [enforcer-ea-mutation-shipped].

Related: [enforcer-ed-aiwall-shipped] (the census that surfaced this), [finite-semantics-law].
