---
name: ""
metadata: 
  node_type: memory
  title: "HAZARD — orchestration glue belongs in src/lib, not src/domain (four ratchets bite)"
  date: 2026-07-17
  tags: 
    - hazard
    - architecture
    - domain
    - ratchets
    - layer-boundaries
  originSessionId: 7115c211-9732-4751-8d73-170ba6bbcf31
---

# HAZARD: a new src/domain/** module that conducts generators/store, or carries `any`, trips FOUR ratchets at once

Discovered building INSTANT WORLD (2026-07-17). A composer placed in
`src/domain/instantWorld/` that imported `generators/generateSettlementPipeline`,
`store/configSlice`, and `lib/structuralFingerprint`, and carried loose `@type {any}`
JSDoc, failed FOUR independent gates simultaneously — none obvious up front:

1. **tests/architecture/layerBoundaries.test.js** — the headless-engine spine
   (kernel/data/generators/domain) must import NO store/React/lib→store chain. A
   domain module importing `store/*` is a hard violation.
2. **tests/build/domainGeneratorsBoundary.test.js** — a frozen baseline of
   domain→generators edges; a NEW domain→generators import fails it.
3. **tests/lint/domainAnyCastBaseline.test.js** — `src/domain/**` is held to a
   shrink-only per-file `any`-cast baseline; a NEW domain file with ANY `@type {any}`
   (or `{*}`) FAILS — "fix the types, do NOT widen the baseline." Counter:
   scripts/count-domain-any.mjs.
4. **typecheck:domain:strict** (scripts/check-domain-strict.mjs, tsconfig.domain-strict.json)
   — `src/domain/**` is strict + noImplicitAny at baseline 0; every implicit-any param
   needs an annotation. Also an eslint rule bans Math.random()/new Date() in domain.

## Rule
Put a **conductor over generators / store-touching orchestration glue over untyped
output** in **`src/lib/**`**, NOT `src/domain/**`. src/lib may import
domain+generators+store freely, has no strict/any-cast ratchet, and typechecks under
the lenient tsconfig.full. Keep only PURE, well-typed, kernel-grade logic in
src/domain (worldPlan.js — constants + a pure seed→plan derivation, 0 any — legitimately
stayed in domain). Enforce determinism of the relocated glue with a same-seed
byte-identity PIN instead of the domain lint (behavioural > syntactic).

## Tell
If a new `src/domain/**` file has any `import ... from '../../store/...'` or
`'../../generators/...'`, or any `@type {any}`, expect all four reds. The fix is
`git mv` to src/lib + fix the relative import paths + update consumers — it clears
three of the four at once (the fourth, architectureFreshness slice-count, is separate:
adding a store slice requires bumping the "N slices" claim in ARCHITECTURE.md).
