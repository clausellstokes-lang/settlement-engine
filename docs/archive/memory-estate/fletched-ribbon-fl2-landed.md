---
name: fletched-ribbon-fl2-landed
description: "Lane FL-2 @ 66b462e3 — the desktop fletched ribbon landed whole; ⚠️⚠️ CHROME.headerDesktop is 60 while the LIVE desktop header measures 124, so ANCHOR_OFFSET (84) is ~40px short estate-wide"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T19:38:08.343Z
---

2026-08-03, lane FL-2 (resumed from a killed-mid-edit predecessor), committed
`66b462e3` on `claude/composite-r4` in the minifold worktree. DARK, nothing pushed.

## ⚠️⚠️ THE FINDING THAT OUTLIVES THE LANE — `CHROME.headerDesktop` IS NOT THE HEADER

`src/components/theme.js` says `CHROME.headerDesktop = 60` and derives
`ANCHOR_OFFSET = CHROME.headerDesktop + SP.xxl = 84`, which is the single writer
for every About / guide / Compendium in-page anchor's `scroll-margin-top`.

**Measured in a real browser at 1440×900, base `83b18609` and the fletched tree
served side by side on :5202 and :5201: the desktop header is `124px`, the nav
row `100px`, `#main-content` top `124`.** The right cluster (the Sign In chip)
is what sets the 100. So ANCHOR_OFFSET is ~40px SHORT of the sticky bar it is
supposed to clear, and every anchor landing in the estate sits that much under
the header. **PRE-EXISTING** — the 124 is identical at base, before any FL work.

Deliberately NOT repaired by FL-2: changing ANCHOR_OFFSET relocates every anchor
landing in the estate, which is not a nav lane's call. Recorded in the theme.js
FLETCH docstring, the NavRibbon header note, and `navFletching.test.jsx`'s
docstring so nobody re-derives it. Task #66 ("Ribbon v2: slim shaft, headerDesktop
60→~48 via the single writer") is the follow-on that must resolve it — note that
lowering the CONSTANT without lowering the real bar makes the drift WORSE.

**How to re-measure:** minifold already runs vite on `:5201` (a long-lived
concurrent server, cwd-verified with `lsof -p <pid> | awk '$4=="cwd"'`). For a
base control, `git worktree add --detach`, symlink `node_modules` from minifold,
`npx vite --port 5202`, then read `document.querySelector('header')
.getBoundingClientRect()` in both tabs.

## What the ribbon now is

- `routes.js` `home` entry keeps `path`/`title`/`'/'`-canonicalization and lost
  ONLY its `nav` block. That is the whole retirement mechanism — it removes
  Welcome from `NAV` and so from every NAV-derived surface. `appNavSsot.test.js`
  pins the SHAPE (live route + `nav === undefined`) so a DELETION can never pass
  as a retirement. App.jsx needed no edit (`MOBILE_NAV_PRIORITY` never named
  `home`), so the dispatch's expected App.jsx size-baseline shrink did NOT happen.
- `theme.js` is the single writer: `FLETCH_BROWN` (= `L.GOLD_TXT`, gold-800),
  `FLETCH_BROWN_LIFT = '#7A5C23'`, `FLETCH = {slant: 10, overhang: 4}`.
- The band's MEMBERSHIP is derived from `NAV_FLOW` through `flowsInto`, never
  listed. `dividerKind` answers `'fletch'` (was `'chevron'`) — ONE straight
  stroke corner-to-corner in a box exactly `FLETCH.slant` wide, which is what
  makes it parallel to the vanes by construction.
- **The overhang is a `drop-shadow` filter on an absolute zero-inset paint layer**
  — no height, margin, padding or negative offset anywhere. Proven twice: a
  jsdom walk over every ribbon node asserting no layout property spends the 4px,
  and the browser measurement above showing header 124 in BOTH trees.
- **The clip never touches a focusable element.** `clip-path` clips an element's
  outline too, and a11y.css draws the ring at `outline: 3px` / `outline-offset:
  2px` OUTSIDE the border box — clipping the `<button>` would silently swallow
  the keyboard focus ring while every visual test stayed green. The shape is on
  an aria-hidden VANE span inside the button. Verified live: a focused Realm
  feather reports `outline: rgb(160,118,42) solid 3px`, own `clip-path: none`,
  ZERO clipping ancestors.
- Contrast is computed, not claimed, in `tests/design/contrast.test.js`:
  PARCH_100/BROWN 6.24:1, PARCH/LIFT 5.71:1, PARCH_100/LIFT 5.18:1 (all AA),
  GOLD/BROWN 3.12:1 (SC 1.4.11). GOLD/LIFT is 2.59:1 and is asserted AS BEING
  below 3:1 — a redundant channel, recorded rather than hidden.

## Two inherited reds, one repaired and one not

- **REPAIRED (in a file this lane owns):** `navFlowArrows.test.jsx` exited 1 at
  base with five `EnvironmentTeardownError: Cannot load '/src/lib/creditLedger.js'`
  unhandled rejections while all tests passed. Mocking `src/lib/stripe.js` alone
  is NOT enough — a lazily-mounted pricing chunk still resolves the real stripe
  graph, whose line-17 import of `creditLedger.js` lands after jsdom teardown.
  **Add `vi.mock('../../src/lib/creditLedger.js', …)` too.** Exit 0 after.
- **NOT MINE, still red:** `tests/lint/rawButtonBaseline.test.js` — the baseline
  disagrees on `src/components/HowToUse.jsx` (gained a raw button) and
  `src/components/founders/ChairPlate.jsx` (lost one). Reproduced identically in
  a detached worktree at base `83b18609`. The occurrence-count BUDGET test passes,
  so it is a set-membership drift owed by whichever lanes touched those two files.

## Shared-tree note

During this lane HEAD advanced `83b18609 → 41287742` and a foreign dirty
`src/domain/worldPulse/pulseKernel.js` appeared and then vanished. **It was NOT
eaten by this lane's commit** — lint-staged's own backup stash (`6feb60be`)
lists 12 files and does not include it, which proves it was already clean when
the hook took its snapshot. That object is the cheapest way to settle "did my
commit eat foreign WIP": read `git show --stat <lint-staged stash sha>` from the
commit output. `docs/FABLE_VALIDATION_QUEUE.md` carries a FOREIGN hunk (R-BLD-9 /
Lane M / war-tranche rows, zero fletching content) — left dirty and untouched.
