---
name: typecheck-red-root-cause-and-reader-without-writer-class
description: "⭐⭐ The 351-error typecheck red is ONE idiom (`= {}` defaults) for 43.9% of it, and THREE live bugs share one shape: a READER asking for a key NO WRITER produces, invisible because the read is defensively guarded. Plus: JSDoc is FREE against sizeBaseline in .js."
metadata:
  node_type: memory
  type: project
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T08:43:46.107Z
---

# The typecheck red: one idiom, and one defect class

Measured 2026-08-07 in integrity-counted `git archive` extracts, and **independently
re-executed by an adversarial verifier which reproduced every headline figure EXACTLY**.

## ⚠⚠ THE REAL DAMAGE: `npm run check` IS AN `&&` CHAIN AND TYPECHECK IS STEP 9 OF 16

```
check: … && npm run typecheck && npm run typecheck:domain:strict && npm run lint
       && npm run test && npm run build && npm run verify:dist
```
CONFIRMED by reading `package.json`. Because `&&` short-circuits, **from 2026-08-02 until the
ratchet landed, `lint`, `test`, `build` and `verify:dist` NEVER RAN AS PART OF `npm run check`.**
The gate's whole tail was dark — this is far bigger than "the typecheck is red", and it is the
reason to care. (Lanes ran vitest directly per-wave, so tests were still executed; the COMPOSED
gate was not.) ⭐ **CURE: `scripts/check-typecheck-full.mjs`, a shrink-only per-file ratchet
mirroring the mature `scripts/check-domain-strict.mjs`, swapped into the `check` chain in place
of the bare boolean so the tail runs again.** `npm run typecheck` is KEPT raw for burn lanes.
⚠ **JUDGMENT, VETOABLE:** a ratchet tolerating N errors is weaker than a gate demanding zero —
but a gate nobody can pass tolerates INFINITY and hides every step behind it.
⚠ Any `&&` gate chain has this property: **put cheap-and-always-passable steps LAST, or one
long-lived red silently disables everything downstream of it.**

## The gate went red at `7796954e` with 14 errors and nobody could see it grow

**351 errors / 45 files at `eca65c8a`; 14 at the first red commit, across 366 commits ≈ 0.92
errors/commit accumulated INVISIBLY** — because the gate stopped reporting when it stopped
passing. ⚠ **42 of the 45 files are `src/domain/worldPulse/*` — the red is ONE SUBSYSTEM.**
⚠ `tsconfig.full.json` EXCLUDES all JSX and estimates ~650 more would surface with components:
**351 is the non-JSX logic tree only, never "the whole type health".**

## ⭐ ROOT CAUSE of 154 of the 351 (43.9%): the `= {}` default

`export function f({ a, b, c } = {})` — with a `= {}` default and no `@param`, **tsc types the
parameter FROM THE DEFAULTS ONLY.** Properties carrying a default get typed; properties without
one are ABSENT, so every non-defaulted binding errors. Minimal repro: the same signature
*without* `= {}` produces ZERO errors. Also the caller-side root of the 29 TS2353 and the 12
TS2739/2740/2741. ⚠ The reassuring "70% is TS2339, mostly one idiom" is doing work — the idiom
is 43.9% of the gate, not 70%.

⚠⚠ **THE BLANKET CURE `/** @type {Record<string, any>} */ ({})` IS NOT COMMENT-ONLY AND IS NOT
FREE.** It ADDS PARENTHESES (comment-stripped text differs in 196/196 files — the parens are
semantically inert but the LABEL is false), and its yield is **163 removed / 9 INTRODUCED, net
154** — a net that conceals new errors. It also silences a signature rather than typing it.
**Prefer an existing typedef; report blanket casts as a debt figure.**

## ⚠⚠ THE DEFECT CLASS: A READER ASKING FOR A KEY NO WRITER PRODUCES

All three live bugs found are the same shape, and **all three are invisible because the read is
DEFENSIVELY GUARDED — it degrades to a default instead of throwing.** Proven in each case by
EXECUTING the real generator, not by reading types.

- **TCD-1 (HIGH):** `.id` read on `RulingFaction` at 9 sites (`rulingPower.js:225`,
  `warSeatBooks.js:364`/`:401`, `applyWorldPulse.js:961`). **0 of 78 generated faction rows carry
  `.id`.** The typedef is CORRECT; the readers are wrong. `religionLegitimacy.js:249` ALREADY
  documents this class — the 9 sites were never swept. ⭐ **Consequence is a NEWS ADDRESS LAW
  breach:** factionId never reaches the war-seat books → never reaches war-termination →
  `warRulingsNews.js` omits `factionIds` entirely, an address-chain gap.
  ⚠ `applyWorldPulse.js:961` MASKS it with `installerFactionId`, silently wrong when installer ≠ governing.
- **TCD-2 (MED-HIGH):** `ownExportsOf` (`envoyNegotiationPictureBuilder.js:139`) probes
  `row.exports` on `economicState`/`economy`/`trade`. **`economy` and `trade` do not exist; 0/12
  settlements carry `economicState.exports`.** The `'known'` arm is STRUCTURALLY DEAD — every
  negotiation picture says "unknown". ⚠⚠ **TWO drift layers**: real homes are
  `resourceAnalysis.exports` and `economicState.primaryExports`, AND the row handler reads
  `name||good||resource||label` while rows key on **`product`** — fixing one layer still returns [].
- **TCD-3 (MED):** `satellite.foundingTier || 'thorp'` (`lineageMemberBirth.js:178`,
  `lineageClaim.js:156`) — no writer exists, so the comment calling it a legacy path for "older
  records" is false: **it is the ONLY path.**

⭐ **STRUCTURAL PREVENTION, FLAGGED NOT BUILT:** a walker asserting that every `@property` /
destructured key on a persisted record has **at least one writer** would have caught all three
— and would have caught the recorded [[faction-key-defect-class]] too.

## ⚠ CORRECTION TO THE sizeBaseline HAZARD

**JSDoc annotation is FREE against the size ratchet in `.js` files** (measured: delta 0). The
recorded "comments count" rule is about **`.jsx`**, where `{/* */}` is a JSX expression container
espree counts as code. Only 4 of the 45 erroring files are in `scripts/.size-baseline.json` at
all. ⚠ The BELOW-DEMANDS-RATCHET-DOWN rule still fires if a file SHRINKS — never delete code
while annotating.

**Why:** a red gate hides its own growth, and a defensively-guarded read of a nonexistent key
never announces itself — it just quietly returns the default forever.

**How to apply:** when a TS2339 appears, READ THE WRITER before annotating — decide whether the
type is wrong or the code is. Related: [[receipt-vacuity-and-shared-ratchet-rules]] ·
[[writer-reader-payload-spelling-class]] · [[news-address-law]] · [[sizebaseline-exact-ceiling-hazard]].
