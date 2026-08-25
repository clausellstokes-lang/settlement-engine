---
name: tc5bi-seam-mints-a-second-manifest-compiler-chunk
description: "RESOLVED at CR-TC5BII-1, landed `c82cc859` — TC-5b-ii STOP — giving TC-5b-i's cartography seam ANY production importer mints a SECOND compileTownSceneManifest-* chunk (64,307 B, main thread), redding townScene3dLazy.test.js:657 `expect(manifestCompilers).toHaveLength(1)`. MEASURED CAUSAL: with the seam edge = 2 chunks, without it = 1. TC-5B-II §6.5's stated mitigation ('import the compiler through the SAME direct specifier the worker uses') CANNOT work — a Vite worker is a SEPARATE Rollup build, so a main-thread importer can never share the worker's chunk. The bounded PAIR is untouched (77,455 + 307,682 = 385,137, exactly B3); only the count identity breaks. The chair ruled option (a): the count identity is replaced by a graph-shaped arm (2 chunks; the worker's referenced only by the worker; the main-thread one absent from the eager closure; each byte-budgeted). ⚠ The worker imports its compiler DYNAMICALLY, and the eager closure is only 8 chunks."
metadata: 
  node_type: memory
  type: project
  modified: 2026-08-12T04:50:36.138Z
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
---

2026-08-12, TC-5b-ii Opus implementation lane (Lane Y), build branch
`claude/composite-r4`, base `df15a68a`. All figures EXECUTED.

## Why (the shape of the failure)

`TC-5B-II.md` §6.5 predicted this arm as "the one arm TC-5b-i handed forward" and
claimed the risk was *minimized* because TC-5b-i "imports the compiler through the
**same direct specifier the worker uses** and places the seam behind exactly one
`import()`". **That mitigation is structurally impossible.** Vite builds a worker as
its OWN Rollup build with its own module graph; the worker's copy of
`compileTownSceneManifest.js` can never be shared with the main-thread graph no
matter how the specifier is spelled. So the moment anything on the main thread
reaches the compiler, a second chunk exists by construction.

Before this packet, nothing on the main thread compiled a manifest. `SettlementScene3D`
gets its manifest from the worker client. TC-5b-i's `townCartographyBlock.js`
introduced a **synchronous main-thread compile** — deliberately, as the cheaper of
the two doors in §-1 — but it landed with ZERO production importers, so the second
chunk never materialized and TC-5b-i's "expected bundle delta ZERO" measured true.
TC-5b-ii is the first importer, and the cost lands here.

## The measurement (causal, not correlational)

Same tree, two builds, differing only in whether `MapTabShell.jsx` holds the
`useTownCartographyBlock` edge:

| build | chunks matching `^compileTownSceneManifest-[A-Za-z0-9_-]+\.js$` |
|---|---|
| seam edge REMOVED | **1** — `…-tEOuPjqu.js`, 307,682 B, imported only by `townScene.worker-*` |
| seam edge PRESENT | **2** — the above, plus `…-BIVFR1mR.js`, **64,307 B**, main thread |

Corroboration that the probe build really is base-equivalent: worker 77,455 B +
worker-compiler 307,682 B = **385,137 B**, which is *exactly* TC-5A's recorded
bounded-pair figure (B3). Nothing else in the change moves a byte of it.

The new chunk's importers in the failing build are `MapTabShell-*`,
`SettlementMapPane-*`, `StyleOverhaulPanel-*`, `index-*`, `townSceneExport-*` and
`townCartographyBlock-*`. In the base-equivalent build **`SettlementMapPane` imports
no compiler chunk at all** — so those are not pre-existing importers being revealed;
Rollup hoists the compiler into a shared chunk only once `townCartographyBlock.js`
enters the main-thread graph.

## What is NOT broken (so the finding is not over-read)

- The bounded PAIR is byte-identical to base. Every byte assertion in the arm still
  passes: 64,307 > 10,000, < 350,000; 77,455 + 64,307 = 141,762 < 400,000.
- First-paint cost is still ZERO — and this was later MEASURED rather than inferred
  (see the traps below): the entry's transitive static closure is 8 chunks and holds
  neither compiler. Only a reader who opens a lit settlement's Map tab fetches it.
- **Only the identity `expect(manifestCompilers).toHaveLength(1)` fails.** Its premise
  — "the compiler exists once, inside the worker" — was true only while nothing on
  the main thread compiled a manifest, which TC-5b-i deliberately changed.

## RESOLVED — CR-TC5BII-1 (chair, 2026-08-12), landed at `c82cc859`

The STOP was raised and upheld; the chair ruled **option (a)** and authorized the one
edit to `townScene3dLazy.test.js` (its "Run, never edit" protection yields to a chair
order). The old count's premise legitimately expired, so the cure is to **encode the
new invariant**, which is strictly stronger than the count it replaces:

1. exactly **2** chunks match the compiler pattern;
2. one is referenced by nothing but the scene worker (the old identity, preserved);
3. the other is **absent from the entry's transitive static closure** — reachable only
   through the seam's dynamic `import()`;
4. each is byte-budgeted separately (worker keeps 10,000–350,000 and the <400,000
   pair; main-thread gets 10,000–100,000 against the measured 64,307).

⚠⚠ **TWO TRAPS THE CURE HAD TO MEASURE AROUND, both counter-intuitive:**
- **The WORKER reaches its own compiler through a DYNAMIC `import()`**, so a
  static-specifier scan finds it ZERO importers. Classify the two chunks by
  **reference**, not by static import, or the worker's copy is mis-classified.
- **The eager first-paint closure is TINY — 8 chunks.** A `length > 20` liveness floor
  (the idiom `mapTabShellLazy.test.js` uses on its *source* closure) reds here. Anchor
  on a chunk that must be eager (the React vendor chunk) instead of a count.
- CONFIRMED by measurement, and it corrects a claim made too early in this lane: the
  main-thread compiler **is** genuinely lazy. Neither compiler is in the eager closure.
  "It sits behind a dynamic import" was inference; the closure walk is the proof.

## How to apply

⚠ The arm is `it.skipIf(!REQUIRE_DIST)`. It does NOT run under a bare vitest pass — but
it DOES run in the gate, because `npm run check` ends with `… && npm run build && npm
run verify:dist`. A lane that stops at `test:ratchet` never reaches it, which is how
this stayed invisible until TC-5b-ii: **always run the gate to completion.**

⭐ Generalizes, and this is the durable half: **any** future main-thread consumer of a
module the worker also bundles duplicates that module across the two builds. The
duplication is invisible to `npm run check`'s test phase and invisible to every
source-closure test; only a dist chunk count sees it. When adding one, expect to widen
a count-shaped build pin into a graph-shaped one — and prove the new arm live with a
mutant that points it at an eager chunk.
