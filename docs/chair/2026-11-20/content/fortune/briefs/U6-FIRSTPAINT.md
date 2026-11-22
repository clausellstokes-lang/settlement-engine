# FORTUNE U6: the fortune law leaves the first-paint closure (two vite.config.js lines; proved by a build)

Written 2026-11-20 19:43 UTC (`date -u`) by FORTUNE-4 on the chair's words of 2026-11-20 19:28 and 19:36 UTC, from FORTUNE-4's read-only
measure (`../measures/firstpaint/FIRSTPAINT-CHAIN.md`). THE RULE: NO UNIT MAY RAISE THE FIRST-PAINT CLOSURE unless a surface
first paint renders needs it and the chair has ruled it.

THE MEASURE (EXECUTED, a build of a49838e67): `src/domain/fortune/fortuneLaw.js` is in EAGER engine-core, reached by NO
import chain from first paint: its five importers sit in lazy chunks. It rides there because `vite.config.js ::
computeEngineSharedDomain` seeds engine-core with every domain module a generator imports (prosperity, factionDynamics,
rulingStructure import it). So a SOURCE cut changes nothing. The cure, probed (probe C): (1) append
`'/src/domain/fortune/fortuneLaw.js'` to `ENGINE_SHARED_DOMAIN_EXCISIONS`; (2) a `manualChunks` rule just before
`if (isEngineSharedDomain(id))`: `if (id.includes('/src/domain/fortune/fortuneLaw.js')) return 'fortune-law';`. Probe C's
figures: first paint raw 1,179,219 -> 1,177,726, gzip 375,228 -> 374,696, Brotli 314,955 -> 314,727; worker unchanged
2,590,351; no eager chunk imports `fortune-law`. ⛔ EXCISION WITHOUT THE PIN IS WRONG (probe B): the law lands in the 914 kB
`engine` chunk and `densityCreateBoundary` gains a static edge to it. ⛔ The who-rules lane's trial: pinning a module into
the LAZY-DOMAIN list blindly dragged two lazy chunks into first paint (2.1 MB): this cure pins to the law's OWN chunk, not a
shared lazy list; prove it by the figures.

KNOWN REDS AT THE BASE (not yours; the same five before and after): the three first-paint budgets, the worker ceiling,
"engine chunk ... remains large". Your proof is that your build moves ONLY the law (its chunk, the three figures down, the
worker equal) and adds no red.

READ FIRST: `COMMON.md`; `vite.config.js`'s `ENGINE_SHARED_DOMAIN_EXCISIONS` block with the ironAtHand precedent and the
orphan warning above it; `tests/build/engineChunkLazy.test.js`, `tests/build/vendorPdfLazy.test.js`,
`tests/build/generationWorkerLazy.test.js`, `tests/architecture/engineCoreLazyEdge*`: where the precedent's excision is
pinned as a row or a figure. Extend the config's own test the precedent's way (the excision's row; the pinned chunk).

MANIFEST: `vite.config.js` (the two appended lines and their comment in the house form, citing the measure AND saying why probe B, excision without the pin, is never taken; APPEND ONLY:
the who-rules lane edits this file too; list your lines in the report for the join); the build tests' rows only. Nothing
under `src/`; `package.json` and the lock untouched.

RED FIRST: the extended test (e.g. "fortuneLaw.js is not in the first-paint closure" / "is in its own chunk") red on a build of
the base, green on yours. GATES through `sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh ...`, never a pipe, default
TMPDIR: `npm run build`; `VERIFY_DIST=1 npx vitest run tests/build/engineChunkLazy.test.js tests/build/vendorPdfLazy.test.js
tests/build/generationWorkerLazy.test.js tests/build/customContentCharsetLazy.test.js` and `tests/architecture/engineCoreLazyEdge`;
`tests/lint` whole. REPORT per COMMON.md with the four figures before and after.
