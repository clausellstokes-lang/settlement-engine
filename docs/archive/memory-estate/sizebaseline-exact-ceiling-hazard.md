---
name: ""
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
  modified: 2026-07-20T15:58:08.085Z
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
