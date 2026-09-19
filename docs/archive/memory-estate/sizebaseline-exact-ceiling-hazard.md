---
name: sizebaseline-exact-ceiling-hazard
description: "sizeBaseline is a TOLERANCE-0 exact ceiling — App.jsx=732, WorldMap.jsx=600 are frozen EXACT; never judge headroom by `wc -l`, because skipComments makes a plain `//` FREE and raw and effective counts can differ by ~150 lines"
metadata: 
  node_type: memory
  title: "sizeBaseline is a TOLERANCE-0 exact ceiling — App.jsx=732, WorldMap.jsx=600 are frozen EXACT"
  date: 2026-07-20
  tags: 
    - hazard
    - max-lines
    - size-baseline
    - app-shell
    - worldmap
    - shared-eager-files
  surfaced_by: Vision lane V-H (R-20 command palette eager host)
  originSessionId: ff8b4b71-3ea5-4d7a-9793-42190018c11f
  modified: 2026-08-12T21:30:02.270Z
---

## The hazard
`tests/lint/sizeBaseline.test.js` asserts each baselined file's effective line
count (eslint max-lines, skipBlankLines+skipComments) **exactly equals** its
frozen number (`toEqual`, tolerance 0 — BOTH directions fail). `scripts/.size-baseline.json`
has `src/App.jsx = 732`. So App.jsx must stay at EXACTLY 732 effective lines:
adding a line reds ("grew — decompose it, never raise the number"), removing one
reds ("shrank — lower the number"). Raising the JSON is explicitly forbidden by the
test's own TO-COMPLY note.

Separately, files NOT in the baseline are bound by the per-layer ceiling (src-root
+ components .jsx = 600). Measured this lane: **App.jsx = 732 (baselined, exact)**,
**WorldMap.jsx = 600 (NOT baselined — sitting exactly AT the 600 layer ceiling,
zero headroom)**. WorldMapToolbar.jsx = 566 (34 headroom, safe). Both App.jsx and
WorldMap.jsx therefore reject ANY added effective line.

## How to apply
- Before adding to App.jsx or WorldMap.jsx: you must net-ZERO effective lines. The
  cure is the file's own documented idiom — combine two existing adjacent single-
  statement lines onto one (e.g. `const a = useStore(...), b = useStore(...);`),
  reclaiming one line per combine to offset each line you add. App.jsx already does
  this (grep "hold App.jsx at its max-lines ceiling").
- Measure with eslint's OWN Linter (the test uses it) — `max-lines {max:1,
  skipBlankLines:true, skipComments:true}` and parse `(N)` from the message. A
  quick node one-liner is in the V-H transcript.
- GOTCHA: a JSX comment `{/* ... */}` is NOT a comment-only line to max-lines — the
  `{` and `}` braces are code, so a 2-line `{/* */}` counts as 2 effective lines.
  This bit V-H once (734 not 732). Prefer a plain `//` line above the JSX, or no
  comment, when holding a ceiling.
- If a feature needs eager code in one of these files, prefer a NEW tiny eager
  module (statically imported) + a single mount line, offset net-zero — that is how
  V-H's command-palette hotkey host landed (+562 B eager total, palette body lazy).

## ⚠⚠ NEVER JUDGE HEADROOM BY `wc -l` (carried off the MEMORY.md index 2026-08-11)

**This hook lived ONLY in the index line and existed in no topic file** — it was written
down here during the 2026-08-11 index compaction, before the hook was trimmed, under the
[[index-compaction-destroys-index-only-facts]] protocol.

**`SettlementCard.jsx` read 600/600 by raw `wc -l` — a file apparently at its ceiling with
zero headroom — but measured 451/600 EFFECTIVE, i.e. ~150 lines of real headroom.** The
gap is `skipComments` + `skipBlankLines`: a plain `//` line is FREE, and so is a blank one.

**Why:** the ratchet asserts the ESLint effective count, never the raw count, so `wc -l`
can overstate a file's size by a third and scare a lane into an unnecessary decomposition
— or, in the other direction, understate a JSX-comment-heavy file (see the `{/* */}`
gotcha above, where braces ARE code). Raw and effective are different measurements; only
one of them is the gate.

**How to apply:** measure effective lines with the command in
[[hot-files-at-max-lines-ceiling]] before concluding a file is out of room:
`npx eslint --rule '{"max-lines":["error",{"max":1,"skipBlankLines":true,"skipComments":true}]}' <file>`
and read the `(N)` out of the message. Never quote a headroom figure taken from `wc -l`.

## ⚠⚠ A THIRD EXACT-CEILING FAMILY MEMBER: the `title=` prop walker (measured 2026-08-12)

`tests/domain/guidanceRegistry.walker.test.js` holds `TITLE_BASELINE` shrink-only,
counting `/title=(\{|")/g` across ALL of `src/**` — and by its own comments it counts
**component props** (`<Section title=...>`, etc.), not just native tooltips. At `6ad9f8dd`
it sat at EXACTLY 484/484. **Any new `title=` anywhere in src reds it** — IN-1b's single
ordered `<Section title>` did (484→485; cured by chair-authorized raise CR-IN1B-8, the
estate's FIFTH reasoned raise: 476→…→510→482→484→485). It is a `.walker.test.js`, so
banking it in the test-ratchet census is forbidden; **the only cure is a raise with a
written reason in the walker's own format — a CHAIR act (§14), never the implementer's.**
Packet compilers: any packet mounting a titled Section/component must measure THIS walker
in its preflight (IN-1B's B-rows missed it and the implementer hit the wall at landing).

Related: [[hot-files-at-max-lines-ceiling]], [[wr7b-size-ratchet-decomposition]],
[[index-compaction-destroys-index-only-facts]].
