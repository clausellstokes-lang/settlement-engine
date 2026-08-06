---
name: dirty-tree-build-artifact-class
description: "A generated artifact built while the tree carried UNSTAGED edits records a hash of content that exists on no commit — and every freshness test stays GREEN, because they re-hash the same dirty working tree; cure is a pin that hashes the git INDEX instead"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T02:45:26.657Z
---

# The dirty-tree build class: freshness tests cannot see it, by construction

Discovered and cured 2026-08-03 (lane BT2, chair ruling CR-EB-2) @ **f2c10742**
on `claude/composite-r4`.

## The class

`scripts/build-edge-shared.mjs` records a `sourceHash` computed over its inputs'
**disk content**. Each `tests/edgeFunctions/*Bundle.freshness.test.js` verifies
freshness by re-hashing those same recorded inputs **off the working tree**.

That is a closed loop. Build a bundle while the tree carries unstaged edits and
the recorded hash describes those edits; the freshness suite reads the identical
dirty files, agrees, and goes green. The artifact lands in a commit whose tree
**cannot reproduce it**, and nothing in the gate notices.

## It really happened, and the ruling understated it

On 2026-08-02 three bundles were committed this way. Recomputing each bundle's
builder hash over `git show <commit>:<input>` across the previous 60 commits:

    aiCharterBundle       a74c9c34fd4ab62c -> resolves at NO commit
    aiOutputSchemaBundle  6f9f798367e2a01f -> resolves at NO commit
    aiGroundingBundle     3b34ca73ca53af31 -> resolves at NO commit
    analyticsEventsBundle / intentAtlasBundle -> resolved cleanly

The chair ruling named only the first two. **aiGrounding was equally affected** —
when a ruling names an incident's members, re-measure the set before trusting it.

## The cure (built, mutant-proven)

`tests/edgeFunctions/edgeSharedBundleReproducibility.test.js` re-spells the
builder's recipe against the **git INDEX**, via one `git cat-file --batch`
process fed `:<path>` specs (600+ lookups; do NOT spawn per-file `git show`).
Disk fallback only for `node_modules/` inputs, with a separate assertion that no
`src/` input may take that fallback.

Index rather than HEAD is the deliberate choice: index == HEAD when nothing is
staged, so a committed artifact greens, **and** an input staged together with its
rebuilt artifact greens too — which is the honest way to land both in one commit.
A HEAD-only comparison would red every legitimate combined commit in its
pre-commit hook.

⚠️ **The decisive mutant, worth re-running if this is ever doubted**: append one
comment line to `src/kernel/math.js` WITHOUT staging it, run
`npm run build:edge-shared`. All five freshness suites go **GREEN at 102/102**
while the new pin reds on exactly the three bundles consuming that module
(3 failed / 22 passed). Freshness is blind; only the index pin sees it.

## How to apply

- Any generated artifact whose freshness is checked by re-hashing its own inputs
  off disk has this hole. Look for it in every committed build product, not just
  these bundles.
- `generatedAt` is NOT inside the hashed content — the five bundles are a pure
  function of their inputs, proven byte-identical across three consecutive builds.
- The pin also asserts all five sidecars share one build window (≤10 min), which
  reds the "partial rebuild left stale siblings" condition.
- ⚠️ `src/domain/worldPulse/*` are inputs to three bundles and are live under the
  WR-8/WZ lanes. Any commit there makes the bundles stale; the cure is one
  `npm run build:edge-shared` in the SAME commit as the input change.
- The E-A manifest entry must ride the same commit as any new
  `tests/edgeFunctions/*` file — that tree is an ENFORCER DIR, so every test file
  in it is enumerated by TOTALITY regardless of its name.

## Stale claim left behind (named open item)

Four manifest rationales (aiCharter / aiOutputSchema / intentAtlas / aiOutputTool
freshness) still say their mutation targets are UNTRACKED and standing sweep
plants are therefore INELIGIBLE. **That claim has LAPSED** — all ten bundle
artifacts are git-tracked as of f2c10742. Correcting them and planting the
standing mutations belongs to the AI-ladder lane; recorded in the new manifest
entry, deliberately deferred, not dropped.
