---
name: ""
metadata: 
  node_type: memory
  title: ES-Da LANDED at 6dbb76c2 — and the four registration surfaces the packet did not enumerate
  date: 2026-08-12
  status: live
  severity: high
  lane: "Lane AA (Opus implementer), session c42c8924"
  packet: docs/implementation/packets/foreign-policy/ES-DA.md
  landed: "claude/composite-r4 @ 6dbb76c2 (parent caa6094a), full gate TRUE_EXIT=0"
  note: "supersedes this file's earlier STOPPED state — both blockers were ruled (CR-ESDA-6/7) and cured"
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-12T07:51:25.072Z
---

# ES-Da: the espionage rider LANDED, and what it cost beyond its manifest

The composite rider (covert cargo on an already-accepted peace envoy) landed DARK as ONE
commit, `6dbb76c2`, 12 files, full gate green. The packet reserved 8 paths; **the landing
needed 12**. The four extra were each a same-commit consequence the packet did not
enumerate, and two of them only surfaced at the FULL GATE, not at any focused run.

## ⛔⛔ THE LESSON: "this file is fully orphaned" IS A PIN SOMEWHERE

The packet's own headline addition was that ES-Da becomes the **first production caller of
`espionageDoctrineStage.js`, today a fully orphaned file.** That sentence should have been
read as a TRIPWIRE, because the estate pins orphan status:
`tests/domain/espionageDoctrineStage.test.js` held `expect(importers).toEqual([])` with a
comment saying in as many words *"the day a caller appears, this reds."* It did — at the
full gate, after a green focused suite and a first commit. **Before wiring a leaf the packet
calls orphaned/dead/unwired, grep the test corpus for a census pinning that emptiness.**
Narrowed, not deleted: it now names the one caller, so a SECOND reader still reds.

## The four out-of-manifest paths, and why each was forced

1. ⛔ **`tests/domain/couplingRegistry.test.js` — the frozen `COUPLING_ID_SHAPE` refuses a
   LETTER-NAMED WAVE.** The wave segment was `-\d+[a-z]?`, requiring digits: `ES-1`,
   `ES-5b`, `ES-6a` pass and **`ES-Da` cannot**. The chartered wave had NO legal coupling id
   at all. **CR-ESDA-6 (chair, 2026-08-12)** widened it to `-(?:\d+[a-z]?|[A-Z][a-z]?)`;
   rename was declined as provenance-erasing churn. ⚠ Two further exact-equality lists in
   the same file also had to gain the row (the CPL-19 INFO→GRAMMAR list and the full
   `ES_ESPIONAGE_COUPLINGS` roster) — **a new coupling row moves THREE pins in that file.**
2. **`src/domain/certification/couplingRegistry.js`** — the barrel must re-export the row or
   the test imports `undefined` and the exact-equality list fails with a confusing diff.
3. **`src/domain/worldPulse/envoyErrand.js`** — `mintEnvoyErrand`'s JSDoc said
   `covert?:boolean|null`, a **stale flag-era annotation on a parameter no production caller
   had ever exercised** (`espionageMissions.js` calls `mintErrandSpine` directly). Passing
   the real record broke BOTH typecheck ratchets at +1. **CR-ESDA-7** authorized the
   one-word cure to `unknown`, matching `errandMint.js` one layer down. Back to exact
   baselines: 173/173 and 1134/1134.
4. **`tests/domain/espionageDoctrineStage.test.js`** — the orphan pin above.

## ⭐⭐ THE PRE-FEATURE GOLDEN METHOD — use this, it is the real receipt

To prove dark-path byte identity against code that no longer exists, `git archive <base> |
tar -x` into the scratchpad (6,319 files), symlink the worktree's OWN `node_modules`, and
run the fence's fixture in both trees. Dark ten-tick ledger hashed
`cf6b2c95cb26e3b915eb6907d628cf5d82e7283c5ad2351a75a6c7dfbc545d3a` at BASE and **identically
at HEAD**, across all four non-true flag spellings and all ten per-tick hashes; lit diverged
to `30ca6fba…`. ⚠⚠ **THE GOLDEN MUST BE COMPUTED FROM THE TEST FILE'S OWN FIXTURE** — the
first attempt used a probe-shaped fixture with different settlement NAMES, and names reach
the errand row, so the hash was real but useless. Never touches the live tree.

## Other measurements worth keeping

- **`envoyDiplomacy.js` 753 → 762 effective** (delta 9 against a 15 budget, ceiling 800).
  Both pulse mouths untouched at their exact frozen ceilings (941/941, 1580/1580).
- **Door 3 (`no_doctrine`) is UNREACHABLE from production inputs** — `settlementAlignment`
  is TOTAL, clamping to a finite 0.5 for any item, so a named court always resolves, and
  door 2 refuses the unnamed case first. Kept as a fail-closed guard, driven at the module
  seam with `vi.doMock`, labelled honestly. **RATIFIED by the chair.**
- **`couplingInclusion.walker` is GREEN WITHOUT a coupling row** (16/16) — it licenses at
  LAYER-PAIR granularity, and `envoyDiplomacy.js` already imported `beliefMap.js` (INFO).
  So an ES coupling row is documentation, not enforcement. Recorded in the row itself so a
  later lane does not "discover" it is unenforced and retire it.
- **Lighting census re-derived WHOLE**: 2401/365/2036/19835/5594 → **2403/365/2038/19861/5602**.
  Decomposition: +17 titles/+5 suites and +9/+3 from the two new files = 26 and 8 exactly.
  Both CREDITED, measured by name. ⚠ The three OTHER test files ES-Da edits gained no
  `test()`/`describe()`, which is why titles moved by exactly 26. Renaming a test title does
  NOT move the census — `titles` is a COUNT, not a set.
- ⚠ **The anchored-negative walker wants EVERY negative anchored, not every RUN of them.**
  An `// anchored:` comment covers only the line immediately below it; a third consecutive
  `not.toContain` reds. Use `expectAbsentWithAnchor(collection, member, anchor, context)`.
- ⚠ **zsh does not word-split unquoted `$VAR`** — `git update-index --add -- $PATHS` passed
  all eleven paths as ONE argument. List pathspecs explicitly.
- ⚠⚠ **cwd is NOT stable across Bash calls in an agent thread.** Mid-task it silently moved
  from the minifold worktree to the main tree. Relative-path edits are a live hazard: use
  `git -C <abs>` and absolute paths, and re-verify with `git rev-parse HEAD` before acting.
  (Verified afterward that no work reached the main tree.)

## How to apply

The chair adds the four extra paths to ES-Da's `PACKET_MANIFEST.json` entry at the LANDED
flip. `espionageEnabled` remains absent from every preset; lighting is still the endgame's.
