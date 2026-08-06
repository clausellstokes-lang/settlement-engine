---
name: ""
metadata: 
  node_type: memory
  title: SS1 FMG fork polish + the sink-sweep shipped
  date: 2026-07-20
  branch: claude/ss1-fmg-polish
  tip: e2b7abf8
  base: e457d923
  status: "shipped (NOT folded, NOT pushed — owner-gated)"
  tags: 
    - fmg-fork
    - security
    - xss
    - sink-sweep
    - supply-chain
    - runbook
    - public-map
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-07-21T03:28:21.303Z
---

## What
Refute-and-fix of the 47-finding SS1 cluster (FMG fork polish + the deferred panel-gated
`innerHTML` sink-sweep). ONE commit `e2b7abf8` on `claude/ss1-fmg-polish` (base `e457d923`),
37 files (36 modified, 1 deleted). Scope stayed strictly inside `public/map/` +
`docs/fmg-fork.md` + `tests/security/mapForkXssChain.test.js`. Nothing under `src/`.

## Why it matters
The fork ships **same-origin as auth+payments**, so any `.map`-fed string reaching `innerHTML`
is account-takeover-class. Section 3 of `docs/fmg-fork.md` had explicitly DEFERRED the ~40
panel-gated sinks. SS1 closed that whole class + landed the accompanying fork bug-fixes + made
the runbook accurate so an FMG upgrade **re-applies** our patches instead of silently reverting.

## The sink-sweep architecture (reuse this idiom)
- `escapeHtml()` is a global in `modules/ui/general.js` (~128), reachable bare from every fork
  file (classic-script global + module scope). Its map encodes `& < > " '` — so it protects
  **both** double- and single-quoted attributes and text.
- **Escape PER FIELD at each interpolation**, never scrub the whole `lines` string: the row
  templates legitimately contain fork-built `onmouseover="showElementLockTip(event)"` handlers
  that a `sanitizeMapSvg`-style scrub would strip → broken UI. This is the load-bearing rule.
- Escape only untrusted `.map` strings: names, types, groups, colors, icons, deity/form, codes.
  Numbers (ids/counts/pop/coords) and internal enums are left raw.
- **Unquoted attributes** (`data-state=${s.name}` in battle-screen; `data-culture=${...}` in
  states-editor; `data-color=${...}` in biomes) must be **quoted AND escaped** — escaping alone
  does not stop a space-injected attribute.

## Hazards / decisions banked
- ⚠️ **lint-staged runs `eslint --fix` on commit and re-stages.** That is an edit AFTER your
  green gate. Fork files under `public/map/` are eslint-IGNORED (no-op), but always re-run the
  fork validator + the XSS test on the clean post-commit tree to confirm the COMMITTED bytes.
- ⚠️ **Commit-msg backticks:** used `git commit -F <file>` (never `-m` with backticks) — avoids
  the shell command-substitution hazard.
- ⚠️ **`escapeHtml` does NOT fix attribute-NAME injection.** `data-${u.name}=` (custom military
  unit-type names, `options.military[].name`) is a residual DEFERRED — needs load-time identifier
  validation, not output escaping (naive sanitize would break `dataset[u.name]` read-back).
- ⛔ **`main.js` addLake typed-array bug (`~858`, `cells.t[c]=1`) DEFERRED owner-gated** — it is a
  real no-op bug, but activating it changes same-seed generation output ("a seed is a world").
- **STRUCK:** the coastline half of the lake-group finding — coastline grouping is DOM-only
  (`changeCoastlineGroup` sets no `feature.group`), so there is nothing to desync. Only the LAKE
  side (`getLake().group` sync in createNewGroup + removeLakeGroup) was a real bug and was fixed.
- **Already-fixed by wave1/FMG-remainder (skipped):** marker.icon escape, cloud.js token→
  sessionStorage, tinymce local, ai-generator egress disabled.

## Supply-chain
- `libs/umami.js` **DELETED** + de-listed from `VENDOR-MANIFEST.json` (dead beacon, 0 refs). Libs
  count 141→140; exact-set validator still 0. On upgrade do NOT re-add it.
- OpenWidget remote chat load disabled via early `return` in `toggleAssistant` (main.js ~408) —
  same pattern as the ai-generator disable; owner may re-enable.
- Manifest: recorded real versions for jquery/d3/jszip/three/tinymce; header comment corrected
  to the actual EXACT-SET contract. `vercel.json` / `scripts/validate-map-fork.mjs` /
  `.github/workflows/ci.yml` are OUT of this fork's scope — CSP-Report-Only + SHIPPABLE_EXTS
  gaps documented in the runbook, not edited.

## Gate (all green on the committed tree)
domain-strict bare 0 · tsc `tsconfig.full` 0 (no src leak) · validate-map-fork pass/140 libs ·
`vitest run tests/security/ --no-file-parallelism` 1101 passed/6 skipped/0 failed · NUL scan clean.
Fork is outside dist = 0 eager. Pins: `mapForkXssChain.test.js` +3 describe blocks / ~60 asserts
(source-slice idiom — fork sinks have no runtime here).

## Next
Fold `e2b7abf8` into the composite when the owner runs the next fold batch. NOT pushed.
