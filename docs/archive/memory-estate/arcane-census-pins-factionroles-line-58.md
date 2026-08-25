---
name: arcane-census-pins-factionroles-line-58
description: "⚠⚠ tests/lint/arcaneClassifierCensus.walker.test.js keys KNOWN_UNCONVERTED by `path:line` — `src/generators/factionRoles.js:58` is pinned, so INSERTING ANY LINE ABOVE IT (even a comment) rots the address and reds the census; edit in place and put notes BELOW the table"
metadata: 
  node_type: memory
  type: hazard — address rot
  created: 2026-08-11
  lane: Lane S — THE GOLDEN BATCH
  measured_at: e7774ff2 / landed b0912f7f
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-11T23:32:00.088Z
---

Caught BEFORE the first edit on 2026-08-11, during a narrowing of the Lord Mayor's
`linkToInst` on `src/generators/factionRoles.js:55` — three lines above the pinned address.

## The mechanism

`tests/lint/arcaneClassifierCensus.walker.test.js` holds a shrink-only allowlist:

```js
const KNOWN_UNCONVERTED = Object.freeze({
  …
  'src/generators/factionRoles.js:58':
    'CONTEXTUALLY SCOPED, not the class. The Archmagister\'s `linkToInst` runs only INSIDE …',
});
```

Its own docstring states the design intent: *"the line number is deliberately part of the
key so a moved pattern re-presents itself for a decision instead of drifting on unnoticed."*
Line 58 is the `arcane:` row (`/tower|academy|college|magisterium/`). Any inserted line
above it moves the pattern, the recorded site stops matching, and the shrink-only arm reds —
with a message about arcane classifiers, which has nothing to do with what you were editing.

This has bitten before and was recorded IN THE FILE: a comment there notes the key was
**RE-POINTED 57 → 58 on 2026-08-10** because commit 93e7ed50 added one import at line 23.
Same class, one line, different lane.

## How to apply

- Editing `FACTION_ROLES` rows 40–59: **replace in place, single line for single line.**
  Verify with `awk 'NR==58' src/generators/factionRoles.js` — it must still print the
  Archmagister row.
- Explanatory notes go **BELOW the closing `};` of the table** (line 60+). Nothing else in
  the file is line-keyed, so additions after 60 are free.
- The census only fires when a line mixes arcane tokens WITH ambiguous ones
  (`if (!arcane.length || !ambiguous.length) continue`), so a noble/merchant row carrying no
  arcane token is invisible to it — the risk is purely the ADDRESS, not your content.
- ⭐ Generalization: grep `tests/lint/*.test.js` for `'<your file>.js:` before ANY edit that
  changes a file's line count. Line-keyed allowlists are a standing idiom in this estate, and
  the red they produce never names the lane that caused it.

## What else was checked on this file and found NOT line-keyed

`scripts/.size-baseline.json` has **no** `factionRoles` key (no size ceiling).
`scripts/.observed-shape-readers-baseline.json` records `"id on institutions": 1` — keyed by
FILE and shape, not line. `scripts/.slugify-idiom-baseline.json` is a bare file list.
