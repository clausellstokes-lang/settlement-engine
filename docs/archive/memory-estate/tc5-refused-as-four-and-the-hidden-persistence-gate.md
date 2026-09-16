---
name: tc5-refused-as-four-and-the-hidden-persistence-gate
description: TC-5 refused as four packets; ⚠⚠ its design's own mount point IS the persisted localStorage vocabulary, so a UI addition was secretly a persistence-shape change
metadata:
  type: project
---

**TC-5a PROMOTED READY @ `8738f5ea`** (validate:packets 13/1). TC-5 as designed is 4–5
behavior families against a budget of one — calibrated decisively: the EXISTING plan-view
emitter `townMapDraw.js` is **264 effective lines alone**, with no palette, no audience
variant, no PNG, no sub-tab. Split: **5a** headless draw-list + palette ROLES → **5b**
sub-tab mount + colour binding + degraded states → **5c** PNG goldens → **5d** skins.

⚠⚠ **THE HIDDEN GATE — the sharpest finding: `mapSubTabs.js`'s OWN DOCUMENTED extension
point is `TOWN_MAP_VIEW_IDS`, which IS THE PERSISTED localStorage VOCABULARY**
(`lastMapView.js:23`). Following the design's stated plan would have silently turned a UI
addition into a **PERSISTENCE-SHAPE change — owner-gated — discovered only after landing.**
⭐ Cure: seat the painter as a **NON-PRESENTATION sub-tab like `player`** — same product
outcome, touches no persisted vocabulary. **Take the door that is not a gate.**
**Why: a documented extension point can be a gate in disguise. Before following one, ask
what its list IS, not what it is called.**

⚠⚠ **`illustrated` IS ALREADY TAKEN** — `src/design/townMapStyles.js:74`
`ILLUSTRATED_STYLE_ID` is a LIVE PICKABLE lens that re-shapes geometry into oblique
glyphs and paints the LEGACY TownMapModel, with a docblock warning about the paid
`LENS_COUNT`. Two pictures called "Illustrated" is the second-truth mode the design's own
§1 forbids. The id is **`cartography`**.

⭐ **THE BUNDLE CEILING IS NOT THE PAINTER'S CONSTRAINT** (measured): pair **385,137 of a
strict 400,000** (worker 77,455 + compiler 307,682; closure exactly **107** members, as
TC-4 §6.6 projected). **Every module the painter needs is OUTSIDE the compiler closure**,
and `cartographyContract.js:38-42` already rules *"NO COLOUR, EVER"* with a live
`rejectRawColour` validator. A correctly-sited painter costs ZERO; only a dragged-in edge
threatens it. ⚠ **The CSS budget margin is FIVE BYTES** (19,795 vs 19,800), not the
design's claimed 4.5KB — and ⚠ **`stats.html` DOES NOT EXIST in this repo**; measure
rendered CSS from the dist artifact.

⚠⚠ **TC-4 §6.6 IS WRONG about `institutionalCatalog.js`** — it names it a forbidden import
"outside the closure" but it is **ALREADY IN** via `institutionClassify.js:26`. Sound
coupling hygiene, never byte protection. **A packet must re-derive its forbidden list FROM
THE MEASURED CLOSURE, never by copying a sibling's.**

Other refutations: there is no "style block" (colour in the block is a hard validation
error) · the ward field is `tonePermille`, not `tone` · `scoreLynch` is never called from
cartography (it scores `townLayoutV2`'s legacy shape), so the rubric gate is a
SYNTHESIS-side slice. ⭐ Audience variants need NO work — `compileTownSceneManifest.js:265`
threads audience in BEFORE the cartography stage, so the block inherits projection by
construction; the obligation is a PROHIBITION: never filter at paint time.
⭐ TC-4's two-inconsistent-tables class was killed STRUCTURALLY: every vocabulary map
DERIVES its key set exact-set-both-ways with a THROWING accessor (an unknown kind cannot
fall to `default`), and the draw-op ceiling is an IDENTITY over the block's own record
counts — no band, no cap, nothing that can drift.
Related: [[tc4-ready-flip-rulings]], [[sizebaseline-exact-ceiling-hazard]].
