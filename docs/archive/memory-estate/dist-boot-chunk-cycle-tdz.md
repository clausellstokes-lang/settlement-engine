---
name: dist-boot-chunk-cycle-tdz
description: "The shipped dist was un-bootable for days with every gate green — an eager chunk importing a lazy one closed a CHUNK-level ESM cycle and a module-scope const read hit the temporal dead zone; cure = zero-import vocabulary leaf, guard = scripts/boot-smoke.mjs (acyclic graph + all-chunks init + shell mount)"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T22:01:52.856Z
---

# ⚠️⚠️ A chunk-level import cycle makes dist un-bootable, and reading dist as text cannot see it

Lane BT, 2026-08-03, fixed @ **5998417d** on `claude/composite-r4`.

## What happened

From **a80c0be4** until 5998417d, every `dist/` this repo produced threw
`ReferenceError: Cannot access 'Ot' before initialization` out of the **entry
chunk** during module initialisation. 347 of 471 chunks inherited the throw. The
app shell never mounted. The site was shipping a white screen.

**No gate saw it.** That is the important part, and it is structural:

- `npm run build` exits 0 — Rollup emits a chunk order it never executes.
- `postbuild` prerendering is Node-side over the ROUTE TABLE, not the bundle graph.
- the whole vitest suite runs against `src/`.
- the ~48 `tests/build/*` pins DO read dist — **only as text**: chunk names, byte
  sizes, modulepreload tags. **Reading a file proves nothing about whether it evaluates.**

## The cause — a CHUNK cycle, not a source cycle

A source-graph audit to depth 14 found nothing, correctly: there is no
module-level cycle. The cycle exists only between **chunks**, created by how
`vite.config.js` routes modules:

    engine-core ──(ARCANE_INST_KW/TAGS)──▶ engine ──(FACTION_ARCHETYPES)──▶ engine-core

`arcaneInstitutionIdentity.js` sits in the EAGER `engine-core` chunk (derived
into `ENGINE_SHARED_DOMAIN`). It reached into `magicFilter.js`, which is
**deliberately excised** from that set and rides the LAZY `engine` chunk. One
edge closed the ring. ESM then has no safe evaluation order, and
`generators/factionRoles.js`'s module-scope
`CANONICAL_TO_ROLE = Object.freeze({ [FA.CRIMINAL]: … })` read `FACTION_ARCHETYPES`
from the temporal dead zone.

⚠️ **Which binding explodes depends on the entry point.** Importing the entry
chunk killed `FACTION_ARCHETYPES` (`Ot`); importing `engine` directly killed
`ARCANE_INST_TAGS` (`Ct`) instead. Same source, two victims. So a bug report
naming one minified identifier is naming a symptom, not the fault.

## The generating rule (this is the reusable lesson)

**An EAGER-chunk module must never statically import a module the chunking
config has routed LAZY.** `vite.config.js`'s excision list
(`ENGINE_SHARED_DOMAIN.delete(frag)`) is hand-maintained, and nothing checks that
an excised module has no eager importer. Any lane that gives an eager authority a
new import can silently invalidate an excision made months earlier — which is
exactly what R-BLD-5 did when it gave `factionArchetypes.js` an `arcaneIdentity.js`
edge.

## The cure

`ARCANE_INST_TAGS` / `ARCANE_INST_KW` moved to a **zero-import leaf**,
`src/domain/arcaneInstitutionVocabulary.js`. `magicFilter.js` re-exports both
names (no importer changed spelling, no consumer census owed); the eager adapter
reads the leaf. A zero-import constant module can be co-located anywhere with no
ordering obligation at all.

Rejected, on record: un-excising magicFilter (drags its filters into first paint
for two constants, hazard shape survives); making the two module-scope reads lazy
(symptom only — the cycle survives and the next read explodes on a build that
differs by hash order); manualChunks tuning.

Membership and ORDER were kept byte-identical — `ARCANE_INST_KW` is consumed as an
ordered `.some()` scan AND joined into a regex alternation, so reordering it would
be a live behaviour change dressed as a move.

## The guard — `scripts/boot-smoke.mjs` / `npm run smoke:boot`

Rides `npm run check` through `verify:dist` (`tests/build/bootSmoke.test.js`).
Three stages:

1. **The chunk graph must be ACYCLIC** (acorn parse of each chunk's top-level
   `import`/`export … from`; dynamic `import()` is NOT an edge). This fails on the
   CAUSE, at build time, before it has picked a victim.
2. **Every chunk must INITIALISE** — all 471 imported under a jsdom browser
   environment.
3. **The app shell must MOUNT** — real `dist/index.html`, real entry chunk,
   asserted twice (non-empty `#root` AND React's `__reactContainer$` marker,
   because `#root` ships empty).

⚠️ **Stage 2 walks ALL chunks on purpose — do not "simplify" it to a page load.**
The fault lived in the LAZY `engine` chunk, which a browser hitting `/` fetches
only when the user generates. A page-load smoke test catches this class today
only by accident (the same defect had dragged engine into the eager closure) and
goes **VACUOUS** the moment the fix puts engine back where it belongs.

⚠️ **The harness must look like a BROWSER, not like Node.** `js-md5` inside
vendor-pdf takes its Node branch when `process.versions.node` is readable and then
dereferences a `Buffer` no browser bundle carries — 8 chunks fail for harness
reasons. With `process` shimmed browser-side (`{env, argv, platform:'browser',
versions:{}}`) and `Buffer` masked, the broken dist produced **one** failure class
and zero noise. **The gate needs no allowlist; if you want one, fix the
environment instead.**

## How to apply

- Before ANY lane adds a static import to a module in the eager first-paint set,
  check `vite.config.js`'s excision list for the target. If the target is excised,
  extract the needed constants to a zero-import leaf rather than taking the edge.
- Run `npm run smoke:boot` after any build whose chunking or eager/lazy routing
  could have moved. It takes ~7 s.
- If stage 1 reds, break the cycle — do not make the exploding read lazy. The
  lazy-read patch greens the build you are looking at and re-explodes elsewhere on
  the next hash order.
- Never conclude "dist is fine" from a green `tests/build/` run alone. Those pins
  read text. Only boot-smoke evaluates.

## Still open (NOT fixed by this lane, measured not assumed)

⛔ **The first-paint closure is 909 kB gzip against a 337 kB budget.** Proven
pre-existing by pairing a pristine `git archive HEAD` tree with the preserved
HEAD dist: `verify:dist` fails the IDENTICAL 9 files / 13 tests at base and after
the fix; `tests/lint` fails the identical 29 rows. Different cause, same
neighbourhood: the **ENTRY** chunk still statically imports one binding from
`engine` (`index-*.js: import{a as ik}from"./engine-*.js"`) and drags `data-lazy`
with it. Belongs to a first-paint lane. The vocabulary leaf's placement adds
+120 B gzip into that already-failing closure.

⛔ The 29-module worldPulse source cycle reddening
`tests/architecture/layerBoundaries.test.js` is cycle 19's live territory —
untouched, fenced.
