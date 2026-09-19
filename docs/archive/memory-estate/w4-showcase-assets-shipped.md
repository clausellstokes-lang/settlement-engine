---
name: w4-showcase-assets-shipped
description: "W4 WALK LANE (showcase assets) on claude/w4-showcase-assets off composite-r4 5e23db2d, 2026-07-21: Cnocby settlement-layer plates regenerated through the CURRENT pipeline (4 taste candidates v2 ON/OFF × parchment/watercolor + canonical refreshed to pipeline-default v2, all byte-deterministic). DELIVERABLE (a) REALM PREVIEW is BLOCKED — architecturally non-deterministic (FMG/browser), owner-gated to build a new deterministic realm renderer."
metadata:
  node_type: memory
  type: project
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-21T16:57:34.626Z
---

# W4 SHOWCASE ASSETS — 2026-07-21 (branch claude/w4-showcase-assets off composite-r4 5e23db2d)

Walk lane dispatched by Fable (ledger 3e3afa1c RESUME v4 + orders row 4f71743a). Two
deliverables: (a) realm preview image; (b) Cnocby settlement-layer maps. Assets +
generation scripts only — NO src/ edits (W1 wires assets in a parallel lane).

## (b) CNOCBY — SHIPPED (fully deterministic)
The town-layer plate machinery is `scripts/generate-landing-map-plates.mjs`: it REPLAYS
the committed fixture (`src/components/home/landingFixture.js`, seed **lf-033**, full
STORE_CONFIG + `_randomizePriorities`, village → **Cnocby pop 412**) through
`generateSettlementPipeline`, builds the town-map model, crops (cartographer's crop:
content bounds → pad 70 → square → clamp to 1000 sheet), and renders parchment +
watercolor via `buildTownMapDrawList`/`drawListToSvg`. It HARDCODES `layoutLawVersion: 2`
(town-layout-v2 ON) and refuses v1.

- **The committed canonical plates were STALE** (Jul-20, ~5.8 KB) vs the current pipeline
  (~9.2 KB) — urban-fabric/roads updates since. The DRIFT GATE did NOT fire (town
  identity name+pop stable), so NO owner-gated ONE-REGEN of the fixture was needed —
  only the RENDER was stale. `--check` was red on arrival; now green.
- What I built: `scripts/generate-cnocby-candidates.mjs` — imports the canonical
  emitter's now-exported pure helpers (`replayFixtureTown`/`contentBounds`/`cropBox`/
  `renderPlate`) and fans out over BOTH layout laws, emitting 4 taste candidates for the
  manager's fold pick (v2 is opt-in, owner taste-veto pending — deliver all, never pick):
  - `cnocby.parchment.v2on.svg` (720², viewBox 460², 36 buildings, **30 road lines**)
  - `cnocby.watercolor.v2on.svg` (same geometry, watercolor lens)
  - `cnocby.parchment.v2off.svg` (720², viewBox 520², 36 buildings, **6 road lines** — sparser v1 net, wider crop)
  - `cnocby.watercolor.v2off.svg` (same geometry, watercolor lens)
- I ALSO refreshed the canonical `cnocby.{parchment,watercolor}.svg` to the pipeline
  DEFAULT (v2) via the unmodified canonical script — a STALENESS FIX to the contract the
  repo already declares, **NOT the taste pick**. If the owner's v2 taste-veto lands on
  OFF, replace canonical with the v2off candidate body. `v2on candidate BODY (sans
  provenance line) == canonical BODY` byte-for-byte (cross-checked) → promotion of v2on =
  the refreshed canonical.

### Refactor (vetoable JUDGMENT): I exported 4 pure helpers from the canonical script and
guarded its `main()` (`if (import.meta.url === pathToFileURL(process.argv[1]).href)`) so
the candidate script reuses the EXACT crop geometry (single source of truth, no
duplication/drift). Default direct-invocation behavior is byte-identical (verified:
`--check` still red-then-green same as before; canonical emit deterministic run1==run2).
No test pins the script source (only the output SVGs; `LandingArtifacts.jsx:386` consumes
`/landing-maps/${slug}.${lens}.svg` = canonical names).

## (a) REALM PREVIEW — BLOCKED, owner decision required (no asset emitted)
VERIFY-FIRST found NO deterministic, headless realm/world-layer map renderer. The realm
map's TERRAIN is the **FMG (Azgaar) fork rendered inside a browser iframe** (`public/map/`);
the only export is browser+canvas-bound raster (`src/lib/realmMapExport.js` — PLAUSIBLE-
class, bytes "deliberately unpinned, platform-variant" per map-exports memory). It is
NON-deterministic even when seeded: **`public/map/sf-bridge.js:515,594` mint burgIds with
`Date.now()` + `Math.random()`**, and `:111` uses `Math.random()`. FMG's native
`getMapURL("svg")` (`public/map/modules/io/export.js:6`) is unbridged AND browser-only.
No realm-preview machinery exists in git history. So "deterministic realm preview" CANNOT
be met by existing machinery — exactly the timestamp/random-id determinism FINDING the
brief anticipated.

`src/domain/instantWorld/worldPlan.js` DOES give a pure, deterministic settlement
placement plan (sites x/y, tiers, map kind) — but no terrain/coastline. Building a new
deterministic realm renderer (worldPlan sites + a seeded coastline/landform gen + the
house lenses, analogous to townMap's `drawListToSvg`) is **genuinely new capability =
owner-gated**; I did NOT build it unilaterally. Options surfaced to owner: (A) build the
new deterministic realm renderer [recommended, real lane]; (B) bridge FMG native SVG +
make burgId minting deterministic [FMG-fork surgery, still browser-driven]; (C) accept a
one-off non-deterministic FMG raster as decorative hero [violates the stated determinism
law].

## HAZARDS / receipts
- vitest 4.1.8 **dropped the standalone `vite-node` bin** — the scripts' documented
  `npx vite-node` is STALE. Run with plain `node` (repo is `type:module`; the src import
  chain is node-ESM runnable). node_modules resolves via main-tree walk-up (worktree npm
  ci is EUSAGE-broken — never run it).
- `buildTownMapModel(town, {layoutLawVersion:1})` == no-edits v1 render byte-for-byte
  (`townMapModel.js:274-280`, variant 0). `layoutLawVersion:2` opts into townLayoutV2.
- public/ assets are OUTSIDE the JS closure — closure suite NOT run (correctly).
- Provenance-comment `×`/`·` are multi-byte UTF-8 → on-disk bytes > char count (normal).
- Browser screenshot of out-of-project `file://` static snapshots is unavailable in this
  harness — validated SVGs via XML well-formedness + byte-identity to the app's renderer
  instead.

## GATE (all green): double-run `cmp` byte-identity on all 4 candidates + both canonical
(IDENTICAL) · eslint 0 on both scripts · `node scripts/check-domain-strict.mjs` 0/ceiling 0
· python NUL scan over 8 added/modified files 0 · all 6 SVGs well-formed XML · canonical
`--check` green.
