---
name: icon-sweep-lane-ic
description: "Lane IC (owner icon directive 2026-08-03) @ d9a1ea5a — the authored-glyph surface is CLOSED; the 184-file/305-site lucide family is NOT and needs an architectural cure via the existing IconsContext gate; ✦ is TWO populations and the data one is legend-backed + pin-defended; the AI Surveyor prompt has NO icon"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T20:04:31.845Z
---

# THE ICON SWEEP — what lane IC closed, and the three things it did not

Owner directive 2026-08-03: remove ALL icons of any kind that are not logos,
EXCEPT the icon on the AI Surveyor prompt. Lane IC closed **one surface family**
at `d9a1ea5a` on `claude/composite-r4` (worktree `minifold`). Nothing pushed.

## ⚠️⚠️ THE SURVEYOR PROMPT HAS NO ICON — the carve-out protects nothing

`SurveyorDoor.jsx` renders a **text-label reveal tab** (`sf-door-label`); the
slip's only glyph is the lucide `X` close control. Do not go hunting for a
Surveyor icon to preserve. The nearest candidates are the ✦ eyebrows on
`SurveyorNote.jsx:52` and `SurveyorGlossary.jsx:69` — the Surveyor's *authorial*
mark ("A NOTE FROM THE SURVEYOR … — S."). **Both were KEPT** on the reading that
this is what the carve-out meant; the ruling is still open.

## ⚠️⚠️ ✦ IS TWO POPULATIONS — never sweep it by character

The directive names "the ✦ ornaments" as decorative. **A second ✦ is a data
marker with its own legend and no text twin**, and removing it deletes meaning:

- **Custom-content OWNERSHIP mark.** `rosterProvenance.js:148` calls it "an
  ownership boundary". The LEGEND row is `OverviewTab.jsx:394`
  (`['✦',GOLD_DEEP,'custom']`). Bare marks: `serviceComponents.jsx:36`,
  `OverviewTab.jsx:384`, `ResourcesTab.jsx:130/138`,
  `EconomicsTab.jsx:388/389/413/414/542`.
- **Magic marker** (`swatch.magic`, no text twin): `OverviewTab.jsx:191`,
  `PowerTab.jsx:264`, `HistoryTab.jsx:217/303`, `ResourcesTab.jsx:174`,
  `EconomicsTab.jsx:510`.
- **TWO RATIFIED PINS DEFEND THESE.** `tests/components/magicSupplyBlue.test.jsx:26/33`
  pins `dot === '✦'` and the `FLOW_STATUS.magically_sustained` label, its docstring
  saying "the ✦ marker is retained (channel redundancy…)".
  `institutionProvenanceBadges.test.jsx:131` pins the legend set including '✦'.

Same class, also untouched: `traditionCorpus.js:50-65` (16 per-tradition heraldic
motifs, rendered `TraditionsTab.jsx:47/69`, pinned `traditionsTab.test.jsx:68`),
`livingWorldSignals.js:46-48` (☼ ☽ ✦ bands), `SupplyChainsPanel.jsx:16-32` status
dots, `map/TierIcon.jsx`, `map/MapLegend.jsx`, `map/RelationshipEdges.jsx`.

**Cure if the owner does order them gone: replace each glyph with a text token in
the SAME commit. Never remove the glyph alone.**

## ⭐⭐ THE REAL REMAINDER: 184 files import lucide-react, ~305 render sites

**An icons-off gate ALREADY EXISTS and is being bypassed.**
`primitives/IconsContext.js` documents "the redesign suppresses lucide/SVG icons
on EVERY surface except the Realm map"; `AppViews.jsx:109` opts the map subtree
back in. But **only ELEVEN primitives consult it** (Button, IconButton, Badge,
Pill, Dialog, Stat, Segmented, BottomSheet, FounderBadge, ActionRail,
DesktopOnlyGate) — the 184 direct importers render around it entirely.

The cure is **architectural** (make the single Provider total, delete the direct
imports), not 305 hand edits, and it needs **one owner ruling first: does the
Realm-map exception survive at all?** Dispatched as its own lane.

## ⚠️⚠️ DEAD ICON SLOTS — 94 fields that rendered nothing but ate a flex gap

An earlier mechanical emoji strip removed glyphs and **left the slots**. The
dossier had been laying out an invisible span beside stress, threat, capability
and service rows ever since: 24 `icon: ""` in `resourceData.js`, 15 in
`stressTypes.js`, 5 in `threatAssessment.js`, 9 in `computeActiveChains.js`, plus
27 **orphan U+FE0F** (a lone variation selector, the emoji base gone) across
`src/data`. All removed; every render site healed.

**Detector for the future** — the repo's own two signatures:
`/\bicon\s*[:=]\s*(?:""|'')/` and `/[>'"\s]\x{FE0F}/`.

## ⚠️⚠️ THE GUARD WAS LYING — `copyCorruption.test.js` scanned only 2 directories

`tests/lint/copyCorruption.test.js` exists **precisely** to stop emoji-strip
residue, and its `SCAN_DIRS` was `['src/components','src/copy']` — so all 94 dead
slots survived untouched in `src/data`, `src/domain`, `src/generators` for as long
as they existed. **Now `['src']` (total), plus a NON-VACUITY test** asserting the
walk reaches >500 files including src/data, src/domain, src/generators,
src/components. Same family as [[filename-anchored-source-pin-vacuity]]: a
zero-hit result is only evidence if the walk read something.

New complementary pin: `tests/components/serviceCategoryIcons.test.jsx` freezes
the ABSENCE of the 11 service-category pictograms structurally (no `icon` field;
no pictographic value) with its own negative control. The lint pin bans the
*residue of a removal*; this one bans *the removal being undone*.

## Traps hit along the way

- **`resourceIcon` / `needIcon` are PERSISTED schema fields**
  (`reviewedSupplyChainPersistence.js:70,80,517-520,542`) carrying custom/AI
  content. Schema shape is owner-gated → dead VALUES cleared, schema untouched,
  renders made conditional (`SupplyChainsPanel.jsx:148,234`, `EconomicsTab.jsx:145`).
- **A pin addressed a child by INDEX.** `dossierMobileGate.test.jsx` used
  `row.children[1]`, silently encoding "an icon sits at index 0"; removing the
  dead icon shifted the label and reddened two reflow pins for an unrelated
  reason. Repaired to locate by identifying style, not position.
- **eslint `no-misleading-character-class`**: `\u{FE0F}` inside a character class
  reads as a combining mark on the preceding range. Use a separate alternative.
- `public/map/**` is the vendored Azgaar generator and `public/landing-maps/**` is
  generated art — **exclude both from any render-surface census** (they hold
  hundreds of SVG charges).

## Reds attributed at base (detached worktree at HEAD `66b462e3`), NOT this lane's

`stressTypeRegistration.test.js` (STRESS_BOOSTS in historyGenerator.js — Lane D's
decomposition), `voiceMechanics.test.js` ×4, `crisisTripleSync.test.js` ×2,
`fieldManifest.test.js` ×1 — all seven identical at base; the voiceMechanics
per-file ratchet detail is **byte-identical** base-vs-tree. `versionsTab` and
`welcomeJourney` fail only in the 256-file parallel run and pass in isolation in
both trees — the documented parallel-load flake.
