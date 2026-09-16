---
name: svg-viewbox-becomes-layout-height
description: "An in-flow inline SVG with height=100% inside a content-sized (indefinite-height) ancestor chain falls back to its viewBox height as an INTRINSIC size and silently sets the container's flex line — this is what made the desktop header 124px against a CHROME.headerDesktop of 60, breaking every anchor landing in the estate; cure is position:absolute + inset:0"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T21:03:02.485Z
---

# A decoration priced the bar: an SVG viewBox became a layout height

Found and cured 2026-08-03 in **lane V2 (ribbon v2)** @ `b3b2dc2e`, on
`claude/composite-r4` in the minifold worktree. Lane FL-2 (@ `66b462e3`) had
**measured** the symptom and recorded it as an unexplained, estate-wide,
pre-existing divergence. This is its mechanism.

## The mechanism

`src/components/nav/NavDivider.jsx` draws the desktop ribbon's seam mark as an
inline SVG with `viewBox="0 0 w 100"` and `preserveAspectRatio="none"`. The 100 is
a **coordinate space**, meant to be rescaled to whatever the seam's height turns
out to be. The SVG asked for `width="100%" height="100%"`.

Every ancestor from that SVG up to `<header>` sized itself by content
(`alignSelf: stretch` all the way, which resolves against the flex line, which is
itself derived from content). So `height: 100%` had **no definite containing block
height to resolve against** — and a percentage that cannot resolve falls back to
the element's **intrinsic size**, which for an SVG is its viewBox.

The divider therefore asked layout for **100px**, got it, and became the tallest
item on the header's flex line:

    100 (divider) + 2 x 12 (header padding) = 124px header

against a `CHROME.headerDesktop` that said **60**.

## Why it mattered far outside the nav

`theme.js` derives `ANCHOR_OFFSET = CHROME.headerDesktop + SP.xxl`. Three live
defects fell out of the one leak, all silent, all with every test green:

1. **Every in-page anchor in the estate landed ~40px UNDER the chrome** — the
   About family, the guide, the Compendium hubs, the dossier entity links. The
   scroll-margin was computed from a token that was 64px short of the real bar.
2. **The dossier toolbar** (`WizardOutputToolbar.jsx`) pins at
   `top: CHROME.headerDesktop`, so it sat **64px beneath** the bar it was supposed
   to hug flush.
3. The header was roughly twice its intended height.

## The cure

`position: absolute` + `inset: 0` on the SVG (its span already had
`position: relative`). An absolutely positioned box's containing block is **always
definite**, so the percentage resolves, the mark still spans the seam exactly, and
it contributes **zero intrinsic height**. Then the header spends the token as its
own `minHeight` so the constant *is* the bar.

`minHeight`, not `height`: the desktop breakpoint is 640px while the header row
wants ~1000px, so `flexWrap` genuinely fires on a narrow desktop — a fixed height
would clip it instead of letting it grow.

Measured after, 1440x900: header 48 / nav 47 / main-top 48 / every divider box 47.

## How to apply

- **A decoration must never be able to price its container.** Any in-flow
  replaced element (SVG, img, video, canvas) with a percentage height inside a
  content-sized chain will fall back to an intrinsic size. Take it out of flow.
- **Suspect this whenever a CHROME/layout token disagrees with a live
  measurement.** The instinct is to "fix" the constant; that would have moved
  every anchor landing in the estate while leaving the real leak in place. Measure
  first, find the element whose box equals a suspiciously round authored number
  (here: exactly the viewBox's 100), then look for an unresolvable percentage.
- **jsdom cannot see this** — it has no layout. The guard has to be *structural*:
  `tests/components/navDividers.test.jsx` now asserts every divider SVG is
  `position:absolute` with `inset:0`, its parent is `position:relative`, the mark
  states no height property in any spelling, and — as a negative control — that the
  viewBox still says 100 while no inline style anywhere on the mark contains
  `100px`.
- **Never pin the SUM of a derivation.** `ANCHOR_OFFSET` pins across four suites
  now assert `CHROME.headerDesktop + SP.xxl`, never the literal. A pin on the
  literal survives an edit that *breaks* the derivation and fails one that
  *honours* it — exactly backwards. Fixed literals found and folded in this lane:
  `registrySlug.js ANCHOR_SCROLL_MARGIN = 84`, `CatalogTabs.jsx scrollMarginTop:80`,
  `SummaryTab.jsx` x4, `aboutSplit.test.jsx` x3 (`'84px'`), and
  `wizardOutputToolbar.test.jsx`'s `>= 59` — which was `CHROME.headerMobile`,
  i.e. it had been measuring the **wrong surface** and passed only because
  `headerDesktop` happened to be 60.

## Related

- [[ld-ladder-size-ratchet-gate]] — the same header's other constraint.
- [[anchor-offset-single-writer-and-side-table-class]] — ANCHOR_OFFSET is the
  About-family anchor-margin writer; that note's 84 is now 72.
