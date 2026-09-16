# THE ATLAS IDENTITY — town-map lens craft samples (SM-5, deliverable 4)

**Taste veto pending.** These are the same representative v2 settlement (a coastal
walled city) rendered under **every town-map lens**, so the one-atlas lens treatment can
be judged in a single glance:

| Sample | Lens |
|---|---|
| `atlas-parchment.svg`   | Parchment (default; byte-identical to the legacy plate) |
| `atlas-watercolor.svg`  | Watercolor |
| `atlas-darkFantasy.svg` | Dark Fantasy |
| `atlas-vtt.svg`         | VTT (grid + scale bar) |
| `atlas-accessible.svg`  | **Accessible** — the new SM-5 colorblind-safe / high-contrast lens |

Regenerate deterministically (buildTownMapSvg is pure):

```
node scripts/gen-atlas-samples.mjs      # or: npm run gen:atlas-samples
```

`tests/design/atlasSamples.test.js` pins the committed bytes; a deliberate lens/craft
change reds it and is re-minted with a stated cause.

## The "one atlas" identity — scope + the recorded realm seam

SM-5 delivers the **town** side of the atlas identity: one bounded, data-only style
schema (`src/design/townMapStyles.js`, THE WALL) drives the lens across every town
surface — the interactive pane, the panorama, the PDF plate, the library thumbnail, and
every image/VTT export — so a lens reads identically wherever it appears.

**The realm side is a recorded, owner-gated seam, deliberately unbuilt here.** The realm
map is rendered by the FMG fork inside an iframe (`public/map/`); its terrain styling is
iframe-bound and is **not** exposed through the export bridge (`src/lib/mapBridge.js`
exposes only `exportThumb`). The realm export (`src/lib/realmMapExport.js`) composites a
pre-rendered terrain raster + the parent marker overlay — it has **no lens parameter**.
Unifying the realm treatment with the town atlas therefore requires either:

1. applying an atlas palette to the parent-owned overlay/composite in
   `renderRealmMapPngBlob` (the only parent-controlled layer), or
2. bridging the FMG fork's style presets (`public/map/modules/ui/style-presets.js`)
   through `mapBridge.js` (the fork's native exporters are a recorded seam).

Both are **realm-export territory** (outside the town-map fence) and touch a paid export
surface — an owner-gated call. The town lens vocabulary above is the shared design
language the realm side would adopt when that work is commissioned.
