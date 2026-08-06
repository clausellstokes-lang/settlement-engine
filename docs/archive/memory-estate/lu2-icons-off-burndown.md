---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-03
  lane: LU-2 (icons-off burn-down)
  status: IN PROGRESS — 55 of 127 frozen rows remain
  commits: d9973d4c (LU-2a) 8214872a (LU-2b) c24ae872 (LU-2c) 1ae224b9 (LU-2d) 69bf882e (LU-2e)
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T22:01:30.106Z
---

# LU-2 — the icons-off burn-down, and the four traps in stripping icons

## What this lane is

`tests/lint/lucideTotality.test.js` freezes every file that imports lucide-react
outside the Realm map. Lane LU-2 burns that census down family by family. The
only legal move is DELETING a row. **127 -> 55** so far.

Closed WHOLE: auth, account, gallery, compendium, contentStudio, dev, founders,
guidance, home, library, session, dossier, generate, region, settlementDetail,
surveyor. Remainder is enumerated in the LU-2e STOP report.

## THE CURE — IconButton's `glyph` text twin (LU-2a @ d9973d4c)

IconButton was documented as "THE ONE PRIMITIVE THIS GATE CANNOT CLOSE" — its
whole child was `<Icon/>`, so ~52 of the 127 rows existed only to feed it.
It now takes `glyph` (a unicode TEXT twin) beside `Icon`. Render rule, and the
middle arm is the fail-safe:

- `glyph` + icons OFF        -> the twin
- `glyph` + **no `Icon`**    -> the twin EVEN INSIDE the map Provider
- otherwise                  -> `Icon`, byte-identical to pre-LU-2

That last arm is what makes the sweep incremental — an unconverted call site
behaves exactly as before. Pinned behaviourally in
`tests/components/iconButtonGlyphChannel.test.jsx` (8 pins, 4 render arms +
box-neutrality + 2 negative controls).

⚠️ The chair picked the TWIN over "render the label as text" because label-text
varies control width by label length and would reflow every toolbar.

## ⚠️⚠️ THE FOUR TRAPS — every one of these ships an EMPTY LABELLED BOX or a crash

A regex/AST strip of icon renders CANNOT see these. All four were caught before
commit, three of them only because eslint or a build ran:

1. **Ternary `Icon=`** — `Icon={expanded ? ChevronDown : ChevronRight}`. A
   bare-identifier matcher misses it, then the dead-attribute pass DELETES the
   only child of a live control. Cure: `glyph={expanded ? '⌄' : '›'}`.
2. **Raw `<button>` whose sole child is the glyph** — not an IconButton at all
   (DossierTabStrip's tab scrollers), so nothing substitutes anything. Cure:
   `<span aria-hidden="true">‹</span>`, aria-label untouched.
3. **`Icon:` FIELD in a config object** — `{ id, Icon: LogIn, label }` rendered
   later as `<rung.Icon/>`. `Icon:` is not an attribute so the transform matches
   NOTHING, but a blanket import-stripper still runs => **three names referenced
   and undefined => ReferenceError at module eval.** eslint's unused-vars cannot
   see it; only a build or a mounting test does.
   ⭐ CURE: after ANY import-stripping sweep, run a dangling-reference scan
   (rendered / `Icon:` / `icon={<Name/>}` while no longer imported) over EVERY
   touched file, then `sh scripts/gate-tail.sh npx vite build`.
4. **Duplicate `glyph`** — see the latent-glyph note below.

## ⚠️ LATENT `glyph` PROPS WERE ACTIVATED BY LU-2a

8 IconButton call sites ALREADY carried `glyph="×"` / `glyph="↺"` from an earlier
lane (be3539d9). Pre-LU-2a, IconButton had no such prop, so it was spread onto
the DOM as an unknown attribute and did nothing. Giving the primitive a `glyph`
**activated all eight** — they now render the twin instead of the icon outside
the map. Intended end state, twins chosen by the earlier author, but it landed a
commit earlier than the family sweep. Sites: ControlsStrip, CompendiumGlobalSearch
x2, CustomContent, GalleryReportDialog, ImageCropper, WizardLoadedBanners x2.
The converter must KEEP the original author's twin and drop the redundant `Icon=`.

## ⚠️⚠️ THE FILE-SCOPED RATCHET IS BLIND TO PROP-FED CONSUMERS

lucideTotality matches the IMPORT SPECIFIER, so a file that renders lucide it
did not import is invisible. Two live violations found this way, both rendering
lucide OUTSIDE the map straight through the ratified redesign:

- `EmptyState.jsx` — took `Icon` and rendered it with NO gate (`accent` existed
  only to colour it). Doc said "map-context surfaces only"; nothing enforced it;
  all 4 call sites were gallery tabs. Channel DELETED (zero call sites remain).
- `customCategoryDefs.js` — a 9-entry category->lucide join whose TWO consumers
  rendered `<c.Icon size={11}/> {c.label}` ungated. Join DELETED.
  ⚠️ `ReadOnlyCustomContentList.jsx` had to be edited but is NOT a census row —
  it consumed the join without importing lucide. TRACE CONSUMERS, never assume.

Lane VT concurrently added `PROP_ICON_CONSUMERS` (IconButton, Pill, Segmented,
Stat) + a TOTALITY test to lucideTotality for exactly this blindness.

## ⚠️ PINS THAT HOLD A VIOLATION IN PLACE

`galleryFilterParity.test.jsx` asserted `querySelector('svg')` 3x as a PROXY for
"has the shared chrome" — it would have RED-ed anyone obeying the icons-off law.
Cure: move the assertion to the surviving channels (border, heading, body/CTA)
and **INVERT** the svg checks (`toBeNull`) so the removal is itself pinned.
Non-vacuity proof = the observed transition (failed "expected null to be truthy"
before, passes asserting null after).

## The twin vocabulary (deliberately NOT defaulted)

`× close/clear · ✓ confirm · ✓✓ approve-all · ✎ edit · − archive · + add ·
↺ reset · ↻ refresh · ‹ › back/forward · ⌄ ⌃ expand/collapse · → ← onward ·
⌕ search · ⧉ copy · ⊘ veto/decline · ↶ undo`

⭐ The converter **RAISES** on any icon with no assigned twin, so an affordance
can never ship a guessed mark. That is how `npcComponents.jsx` (Pin/Lock/Unlock)
was correctly refused — its pinned/locked pair needs a chair-picked twin.

## Slot healing is not always deletion

Beyond the literal-space trap (`<Icon/> {label}` — the space goes WITH the
glyph), GalleryCard had three slots where the glyph WAS the label: stripping
`<ThumbsUp/> {n}`, `<Eye/> {n}`, `<MessageCircle/> {n}` left three bare
integers in a row. Healed to "12 votes / 340 views / 8 comments", matching
sibling GalleryDetail which already spelled them out.

## Standing reds NOT this lane's (verified byte-identical before and after)

`tests/lint/rawButtonBaseline.test.js` — HowToUse.jsx appeared, ChairPlate.jsx
left, from the About repair tail (aaa6f3a4) and THE FOUNDERS' HALL (531a8488).
Its baseline went dirty mid-lane, i.e. a concurrent lane is repairing it.
