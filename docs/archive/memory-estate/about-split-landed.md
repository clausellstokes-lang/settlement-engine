---
name: ""
metadata: 
  node_type: memory
  title: "THE ABOUT SPLIT landed — two pages, three retired URLs, one mapping writer"
  date: 2026-08-03
  tags: 
    - about
    - routes
    - navigation
    - ld-5
    - pins
    - hazard
  status: LANDED
  commit: "d6c5af8e (minifold, claude/composite-r4)"
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T14:51:40.338Z
---

# THE ABOUT SPLIT — landed 2026-08-03 (Lane C)

`docs/DESIGN_ABOUT_PAGES.md` §1/§2/§3/§5 BUILT at minifold `d6c5af8e`. §4 (the
About ▾ dropdown) DEFERRED — blocked on LD-5, recorded in the doc's PROGRESS
blockquote and in `docs/SOL_QUEUE.md`.

## What now exists

- `about-what-this-is` → `/about/what-this-is` — the trust page (manifesto +
  the positioning ladder). This is the **About nav cell's destination**; the view
  id `howto` no longer appears in NAV.
- `about-guide` → `/about/guide` — the Practical Guide (`src/components/HowToUse.jsx`,
  which KEPT ITS PATH on purpose: three source-scanning pins read that path —
  `handbookClaimsParity`, `tierFacts.contract`, the guidance registry's legacy ledger).
- `about`, `howto`, `compare*` → retired redirect surfaces, resolved by
  `redirectForView(view, search)` in `src/lib/routes.js`.

## How to apply

- **`src/lib/aboutMapping.js` is the SINGLE mapping writer.** Twelve units, each
  with its destination view + `#anchor`. Read by `routes.js redirectForView`, by
  both pages' section ids, and by the pins. Never hand-type an About anchor.
- **`tests/components/aboutSplit.test.jsx` holds a LITERAL `PUBLISHED_ANCHORS`
  table.** Those strings are the public URL-fragment contract. Changing an anchor
  is a breaking change and must be edited in BOTH places in the same commit.
- **`src/App.jsx` sits at its size ceiling (now 720).** Anything added to the shell
  must be net-zero or come out of it — this lane had to move the redirect decision
  into `routes.js` to fit.

## Hazards this lane paid for

1. ⚠️ **A pin whose fixture comes from the module under test is VACUOUS.** The
   first anchor-survival pin rendered the pages and checked their ids — but the
   pages derive those ids from the manifest, so a corrupted anchor stayed GREEN
   under a negative control. Cure: an independently authored literal table.
2. ⚠️ **`replaceState` performs NO fragment navigation, and `navigate()` then
   scrolls to top.** A hash set by a redirect scrolls nothing, and a cold load
   looks for the anchor before React renders. `components/about/useAboutHashScroll.js`
   is the cure; any future anchored SPA landing needs the same.
3. ⚠️ **A retired path can be a PREFIX of a live one.** `tests/build/sitemap.test.js`
   substring-scanned a joined blob, so `/about` (retired) read as leaked when
   `/about/what-this-is` was published. Fixed to exact-pathname comparison.
4. ⚠️ **The tooltip census counts the literal `title=` token.** Five new section
   headings would have reddened it; the house idiom is the semantic `heading`
   prop (HERALD FOLD / ADMIN OBLIGATIONS precedent). Baseline banked 487 → 482.
5. ⚠️ **A rAF-based UI pin flakes under a loaded parallel run.** A `setTimeout(30)`
   flush passed in isolation and failed inside an 11-worker full suite. Cure: poll
   for the effect to a generous deadline, never a fixed sleep.
6. ⚠️ **The design doc's substrate claims were WRONG and said so in advance.** There
   were no collapsible anchor ids (Disclosure uses `useId()`), and `/about` did not
   exist. Its own VERIFY-AT-BUILD marking is why this cost minutes, not a wave.

## Attribution method worth reusing

Full suite at a **detached temp worktree on HEAD** vs the working tree: base
38 failing files / 65 tests, lane 37 / 65. The set difference was entirely in the
lane's favour (it HEALED `tests/build/sitemap.test.js` and
`tests/domain/guidanceRegistry.walker.test.js`, both red at base). That is an
executed pre-existing-red claim rather than an asserted one — cheap, and it also
found two reds worth banking.

## LD-5 must read this first

`docs/FIRST_CONTACT_BACKLOG.md`'s LD-5 About ▾ block is AMENDED. Its old targets
`/how-to` and `/how-to?tab=guide` are now WRONG — the first is a redirect, the
second never existed. The three real targets are `/about/what-this-is`,
`/about/guide`, `/founders`. Same landed-surface hazard shape as the Messages seam.
