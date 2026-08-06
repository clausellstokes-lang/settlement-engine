---
name: faction-key-precedence-sweep-shipped
description: "The repo-wide faction display-name precedence sweep — 25 reversed + 2 no-fallback sites fixed, a CI-enforcing source-scan guard, and the edge-bundle regeneration hazard it exposed."
metadata: 
  node_type: memory
  type: project
  originSessionId: 22912484-b551-4393-b6a7-490e750ece38
  modified: 2026-07-20T01:38:35.508Z
---

**SHIPPED 2026-07-19** on `claude/blissful-bhaskara-c43dcd` @ **b561d0d4** (base dc0b6e2b, the
composite tip). 19 files, +413/−41. NOT folded, NOT pushed.

Follow-on to [[ladder-faction-key-fold-composite]]: that fold fixed the ladder's read; this
sweep closed the whole class repo-wide.

## ⚠️⚠️ PARALLEL-SESSION OVERLAP — READ BEFORE FOLDING
While I worked, another session advanced `claude/the-composite` past my base by three commits:
29f7abc9 (ChroniclePanel), **4c1143b9 (personaSlicer)**, **24f46337 (rulerLens)**. See
[[faction-key-defect-class]], which frames the class more broadly than I did — THREE dead keys
(`.name` AND `.id` AND `.archetype`), 5 instances, #5 clergyTraitPlane still OPEN/owner-gated.

**Two of my files duplicate theirs, and THEIRS ARE BETTER — take theirs at fold:**
- `src/domain/ai/personaSlicer.js` — they import the canonical `nameOf`; I inlined the chain.
- `src/domain/worldPulse/religionLegitimacy.js` — they import `governingFactionOf` /
  `factionArchetype` / `npcInFaction` and fix all THREE dead keys; I fixed only `.name`.
They proved the import is byte-safe (lazy worldPulse leaf → EAGER rulingPower = 0 first-paint
bytes). **My reasoning that new import edges risked the budget was over-cautious — in the
lazy→eager direction it is free. Prefer the canonical import over an inlined chain.**

**VERIFIED FOLD SAFETY (executed against composite tip 24f46337 in a temp worktree):** my pins
are behavioural, not implementation-shaped, so **PIN 4 and PIN 6 PASS against THEIR versions.**
Resolving those two files in their favour keeps my whole pin file green. The other 7 pins fail
there and my guard enumerates **25 offenders still live on the composite** (17 src + 8
prompts.ts + 2 in the stale aiGroundingBundle) — that is exactly my non-overlapping contribution.

FOLD RECIPE: take my commit whole, then resolve `personaSlicer.js` and `religionLegitimacy.js`
to the composite's versions. Nothing else of mine overlaps.

## What the class is
A `powerStructure.factions[]` record's canonical display name is `.faction`; `.name` is a legacy
alias `addFaction` also mints. `rulingPower.nameOf` reads `.faction || .name` (pinned dc0b6e2b).
Consumers reading the reverse silently key/join/dedup/slug on the stale alias.

## THE DENOMINATOR WAS WRONG TWICE — the reusable lesson
- The brief said 12 sites. A plain `.name || X.faction` grep found 16 — it structurally could not
  see `beliefMap`'s `??` spelling nor `aiOverlayVerifier.entityKey`'s MULTI-STATEMENT form
  (`if (e.name) return ...; if (e.faction) return ...`).
- A completeness-critic pass then found **8 more in the Deno edge tree**
  (`supabase/functions/generate-narrative/prompts.ts`) that a `src`-only census could never reach.
- **Rule: for any faction-key or shape census in this repo, scan `src` AND `supabase/functions`,
  and hand-search multi-statement / no-fallback forms — the regex cannot see them.**

## Two were NOT latent — unconditionally wrong on real generator data
Generator records carry ONLY `.faction`, so a `.name`-only read yields `undefined` for every one:
- `personaSlicer` roster mapped `f?.name` → `filter(Boolean)` emptied it → the AI persona slice
  was grounded on an **EMPTY faction roster for every generated settlement**. (Module is lazy and
  currently has no production importer — dormant, but unconditionally broken when it lights.)
- `religionLegitimacy.rulerLens` matched the governing seat on `.name` alone → BOTH arms missed →
  fell through to the highest-power faction, i.e. the wrong archetype whenever the governing seat
  is not the strongest power (post-coup, occupation, thieves-guild power floor). **This one changes
  behaviour on generated data.** Religion (98) + simulation (59, goldens) stayed green, so no
  pinned output moved, but the shift is real and is declared in the commit body.

## ⚠️ HAZARD: editing src/domain/aiGrounding.js desyncs a generated edge bundle
`supabase/functions/_shared/aiGroundingBundle.js` is GENERATED from it. My edit left it carrying
pre-fix text and turned `tests/edgeFunctions/aiGroundingBundle.freshness.test.js` RED — and would
have ghosted the fix on the server path. Cure: `npm run build:edge-shared`, commit the bundle +
its `.meta.json`. Watch out: that script ALSO rewrites `analyticsEventsBundle.meta.json` with a
new `generatedAt` while its `sourceHash` is unchanged — revert that timestamp-only churn rather
than committing a spurious diff. Same family as [[store-action-registry-lifecycle]].

## ⚠️ A test was PINNING the defect
`tests/edgeFunctions/contracts.test.js` asserted the source text
`governing?.name || governing?.faction` under a title about "tolerating the .faction shape" — a
contract certifying the bug it was meant to prevent. Order corrected, intent preserved, change
declared inline. **When a sweep hits a red source-text contract, check whether the contract froze
the defect before assuming your fix is wrong.**

## The standing machinery — maintain, do not bypass
`tests/lint/factionNamePrecedenceScan.test.js` — cleared-worklist source scan (exact equality; no
legal way to raise a ceiling). Covers `src` AND `supabase/functions`; matches `||`, `??` and
ternary forms with dot / optional-chain / indexed / bracket-key receivers. Its header ADMITS its
blind spots: no-fallback reads, multi-statement chains, destructuring, cross-statement splits.
Companion behavioural pins: `tests/domain/factionNamePrecedence.test.js` (PIN 1 factionRoles slug
+ affiliation join, PIN 2 thievesGuild join key, PIN 3 factionCatalog dedup, PIN 4 personaSlicer
roster, PIN 5 aiOverlayVerifier entityKey, PIN 6 rulerLens). Revert-proofed: 9 of 14 fail against
dc0b6e2b in a detached temp worktree.

## Byte budget: ZERO eager delta (measured twice)
Closure measured **1,040,998** — byte-identical to the pre-existing figure both before and after.
Every precedence swap is byte-neutral by construction (`.name || .faction` and `.faction || .name`
are the same length); added bytes are comments/JSDoc, and the only code growth sits in lazy
modules. The 998 B breach is pre-existing and owner-gated — see [[composite-budget-breach-998b]].

## Deferred, documented not dropped
- `ChroniclePanel.jsx` reads `f?.name` with no fallback — a PARALLEL SESSION owns that file
  (worktree agent-a04d3f325c72e62dd, `tests/ui/chronicleSnapshotShape.test.jsx`). Left to that lane.
- The `.desc`/`.description` blurb divergence: `addFaction` writes `.description`; PowerTab,
  journalPages and factionProfile read only `.desc` (only `pdf/lib/viewModel.js:509` reads both).
  LATENT not live — the composer's `description` is per-event-type prose, not a DM field, so
  nothing sets it today. The clean cure (addFaction minting `.desc`) is persistence shape =
  ⛔OWNER-GATED; the reader-side fix touches `PowerTab.jsx` under the tolerance-0 kill-list barrier
  of [[wave-a-cluster2-killlist-shipped]].
- Adjacent, reported not fixed (different classes): `mutateHelpers.findFaction` label matching +
  its null-target early match, `timeProgression` applying deltas on `.faction` only, `PowerTab`
  rendering `.faction` with no `.name` fallback, and older fixtures whose
  `powerStructure.factions` records carry only `.name`.

## Gate note
Three `tests/generators` files (`neighbourFactionRenorm`, `foodModelSingleWriter`,
`servicesSeverityPlaceholder`) fail when run CONCURRENTLY with each other and pass in isolation on
BOTH my tree and base — load flakes, not regressions. Confirms [[lane-end-gate-gotchas]]: diff
isolation runs, never raw failing-file sets.
