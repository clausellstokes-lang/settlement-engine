# AD-1 — THE ART AND MEDIA PROVENANCE AUDIT

**Lane TE-AD-1. Read-only. Nothing committed, nothing modified.**
Measurement base: build tip `7af8c3d08162d8cf2c107f550f08322d15c9286b` (MF-CG1b).
Chain: `b2852ccc3 -> d78011665 -> 5055990a3 -> 7af8c3d08`.
Production observations fetched 2026-08-24. Upstream sources fetched 2026-08-23/24.

---

## §Σ · THE VERDICT, BEFORE THE REASONING

> **The audit found two real exposures, and neither is the one the charter expected.**
>
> **The first is measured, not inferred.** The 338 heraldic charge SVGs inside the vendored
> Fantasy Map Generator fork are **self-documenting**: 336 of them carry an inline
> `<metadata source="..." license="..."/>` element naming their origin and terms.
> **179 of the 338 — 53 percent — are CC BY-NC-SA 3.0, which is a NON-COMMERCIAL licence**,
> and 173 of those come from `wappenwiki.org`. A further 48 are share-alike copyleft
> (CC BY-SA 2.5/3.0/4.0, GFDL 1.3, Free Art Licence). **234 of 338 (69%) are not freely
> usable in a paid proprietary product.** `THIRD-PARTY-NOTICES.md` mentions none of it —
> `heraldr` returns zero, and every hit for `charge` is MIT boilerplate. The charter said
> "we have not checked". We have now checked, and upstream had already written the answer
> into the files: the FMG MIT grant never covered this art, and most of it forbids the
> commercial use we make of it. **This is live in production today, not prospective:**
> `https://settlementforge.com/map/charges/oak.svg` returns HTTP 200, byte-identical to the
> repo (sha256 `2f77575b…`), with `license="https://creativecommons.org/licenses/by-nc-sa/3.0"`
> inside the served bytes.
>
> **The second exposure is the one that is actually inside the thing we sell.** The audit's
> central question — what rides inside a paid artifact — has a clean answer for the art:
> **nothing does.** `buildTownMapDrawList` emits five closed vector ops and no raster can
> enter an estate-authored export. But there is exactly one third-party binary embedded in
> the $2.99 dossier PDF, and it is **the fonts** — and the fonts are **modified**. Lora and
> Nunito were re-cut in June 2026 to strip ligature features (commits `df9c94d27`,
> `cf9cfd3af`; the estate's own `src/pdf/theme.js:92-96` says so). Under SIL OFL 1.1 that
> makes them Modified Versions, and **Lora still carries `Reserved Font Name "Lora"` in its
> name table while shipping under the primary family name `Lora`** — which OFL clause 3
> forbids. Meanwhile three places in the tree affirmatively state the opposite:
> `THIRD-PARTY-NOTICES.md:219-220`, `:418`, and the served `public/fonts/OFL.txt:10-11` all
> say the fonts are "shipped unmodified" and that "no Reserved Font Name is used on a
> derivative." **The only third-party binary in the artifact we sell is the one whose notice
> is wrong.**
>
> **What is documented.** The heightmaps are fully documented — the 24th file in that
> directory, `import-rules.txt`, records the method, and the trail runs to Tangrams
> Heightmapper over Mapzen/Tilezen Terrain Tiles. No copyleft and no non-commercial term,
> but **mandatory attribution** for several constituent DEMs, including UK Environment
> Agency OGL v3, whose grant terminates automatically on non-compliance. The landing-map
> exhibit plates and the paper-grain tiles are provably estate-generated. The page
> paintings split: 32 are AI-generated via Google/Higgsfield with signed C2PA manifests in
> their out-of-repo masters; the videos are BytePlus ModelArk `dreamina-seedance-2-0`.
>
> **What is unknown.** 17 page paintings plus 6 `.orig.jpg` preserves — **7,413,151 bytes** —
> entered on 2026-06-05, six weeks before the reference library existed, with no commit
> statement, no metadata, and no notice. **That is the record being genuinely silent**, and
> it is the single largest unattributed block in the estate. It is display-only, so it is
> not in a sold file, but it is served publicly and its origin cannot be stated.
>
> **What is at risk BECAUSE WE NOW SELL IT.** §524 changed the category for exactly one
> group — the fonts — because they are the only third-party bytes inside the paid PDF. For
> the charges and textures §524 changed nothing, because they never enter a sold file; what
> condemns those is **commercial distribution**, which we have been doing since April 2026
> and which the NC term restricts whether or not anyone pays. The trichotomy
> VIEW/AUTHOR/TAKE-AWAY does not gate distribution, so the paywall ruling neither creates
> nor cures that exposure. **And the compliance page that would carry the attributions
> returns HTTP 404 in production** — the obligations the tree believes are discharged are
> not discharged in the live product.
>
> **The cheapest safe path, and it is very cheap.** Delete `public/map/charges/` and
> `public/map/images/textures/` — 14,740,423 bytes, 361 files. Both layers are **off by
> default** (`getDefaultPresets().political` contains neither `toggleTexture` nor
> `toggleEmblems`), the application never fetches either, and **no test or script in the
> repository references them** (node scan: 0 hits; positive control: 9 files reference
> `map/libs`). Deleting them trips no gate, changes no engine output, forces no
> regeneration, and removes 53% of the audit's legal surface along with 8.4% of the
> shipped payload. Then correct the font notice and rename the modified Lora, add an
> attribution block for the heightmap DEMs, and get the notices page actually served. The
> only item that needs money or waiting is counsel's read on the 17 unattributable
> paintings — and that is the long pole, not any build task.

**The owner makes the legal call. This document exists to make it decidable.**


---

## §0 · CONVERGENCE WITH §528 / §529 — two lanes, independently, same answer

While this lane ran, a sibling banked two ledger entries on the same subject. They were not
consulted during the work; this audit's conclusions were reached from its own measurements.
The overlap is therefore independent corroboration rather than agreement by construction.

**§528** — "the sold PDF is clean — no raster image exists in any generated PDF and no
heightmap data reaches the $2.99 dossier; the exposure is the realm PNG download, a public
thumbnail bucket, and Ctrl+S downloading the full map file with its height array."

**§529** — "texture forensics — FMG conveys no rights to the bundled rasters; four are proved
CC BY and need only a credit, three Earth photos are the high risk, sixteen are unknown with
metadata destroyed; the chair recommends wiring the estate own baked textures and deleting the
rest."

**Where we agree, independently:** the sold PDF carries no raster; heightmap data does not reach
it; the FMG MIT grant conveys no rights in the bundled rasters; the right remedy for textures is
the estate's own baked tiles plus deletion. This audit reached each of those from code and
licence text without reference to those entries.

**Where §529 is ahead of this lane:** it reports the four planetary textures (Mars ×2,
Mercury ×2) **proved CC BY**, needing only a credit line. This lane left them **UNKNOWN**,
having established only an exact 2048×1024 dimensional and subject match against Solar System
Scope's CC BY 4.0 2K maps and declining to call a dimension match provenance. **Take §529's
resolution over this lane's UNKNOWN on those four files**, and treat this document's §2.1 row
and §6.2 as superseded there. The three Earth-observation photographs (`spain`, `iran`,
`mauritania`, 1460×900) remain unidentified in both accounts, and both call them the high risk.

**Where this lane is ahead:** four findings do not appear in either entry —

1. **The 338 charges are self-documenting and 179 are CC BY-NC-SA 3.0 non-commercial** (§2, §3.5).
   §529 covers rasters; the charges are vector and were not in its scope.
2. **The fonts in the sold PDF are modified while three notices say otherwise** (§4A). §528
   established the PDF carries no *raster*; the exposure is the one binary that is not a raster.
3. **`https://settlementforge.com/third-party-notices.html` returns HTTP 404 in production**,
   and `map.settlementforge.com` is NXDOMAIN (§3.5).
4. **The one-regen deadline premise is false, and the counsel brief is scheduled too late**
   (§7).

**One difference worth reconciling.** §528 names "a public thumbnail bucket" and "Ctrl+S
downloading the full map file with its height array" as exposures. This lane traced the same
`exportThumb` path and agrees it is user-downloadable and publicly shareable with no entitlement
gating found, and agrees the height array leaves the iframe via `getSpatialPack`. This lane
adds only that **no texture or charge byte reaches that raster today**, because the serialised
SVG is loaded through a `data:` URL and both layers are off by default — so the thumbnail
exposure is about *our own* terrain rendering, not about third-party art.


---

## §1 · THE COMPLETE INVENTORY, RE-MEASURED

Every figure below was re-derived this session with `git ls-tree -r -l 7af8c3d08 -- public/`,
not inherited from the AD compile.

### §1.1 · Reconciliation against the 176 MB figure

| | Files | Bytes |
|---|---|---|
| **`public/` at build tip `7af8c3d08`** | **822** | **176,499,727** |
| The AD compile's figure | — | 176,499,727 |
| **Delta** | — | **0 — reproduces exactly** |

Every sub-figure the compile quoted also reproduces exactly: textures 23 / 11,646,263;
charges 338 / 3,094,160; heightmaps 24 / 1,224,885 (23 PNG); backgrounds 55 / 15,427,767;
video 7 files / 62,821,740. **CONFIRMED.**

**One topology correction the compile did not carry.** The ledger branch
`review-fixes-2026-07-08` (`a8b052cee`) measures **820 files / 176,448,334 B** — it lacks
`public/fonts/OFL.txt` and `public/third-party-notices.html`. That is an ancient divergence
(merge-base `4a9b6cf4b`, 2026-08-11), not a deletion, and that branch is not the deploy line.
Anyone re-measuring must use the build line or they will under-count the notices surface.

**Two roots the compile did not name:** `public/evolution/` (6 files, 837,563 B) and
`public/textures/` (2 files, 6,019 B). Both are covered below.

### §1.2 · Does it all ship?

**Yes — all 822 files.** `vite.config.js` sets no `publicDir` override, there is no
`.vercelignore`, and no build step prunes `dist/`; Vite's default copies `public/` verbatim.
`vercel.json` sets `outputDirectory: "dist"`. **CONFIRMED by configuration.**

Outside `public/` the only media in the repository is `docs/samples/**` (~150 KB of SVG
sample output, estate-generated). `docs/` does not ship. There is no `src/assets` media root.

### §1.3 · The inventory by kind

| Kind | Location | Files | Bytes | % of payload |
|---|---|---|---|---|
| Video (AI-generated) | `videos/realm-journey.mp4` + `media/journey-legs/*.mp4` | 7 | 62,821,740 | 35.6% |
| Exhibit plates (estate-generated) | `landing-maps/**` (32 png, 25 glb, 17 svg, 6 html) | 80 | 68,558,483 | 38.8% |
| Page paintings | `backgrounds/**` (33 jpg, 22 webp) | 55 | 15,427,767 | 8.7% |
| **FMG textures (third-party)** | `map/images/textures/` | **23** | **11,646,263** | **6.6%** |
| FMG code, libs, styles, markup | `map/**` minus charges/heightmaps/images | 231 | 8,445,164 | 4.8% |
| **FMG heraldic charges (third-party)** | `map/charges/` | **338** | **3,094,160** | **1.8%** |
| Journey still frames | `media/journey-legs/bg/*.jpg` | 7 | 2,494,909 | 1.4% |
| Fonts (third-party, OFL) | `fonts/**` (8 ttf, 8 woff2, 1 txt) | 17 | 1,401,748 | 0.8% |
| **FMG heightmaps (third-party)** | `map/heightmaps/` (23 png + 1 txt) | **24** | **1,224,885** | **0.7%** |
| Evolution stills (AI-generated) | `evolution/*.jpg` | 6 | 837,563 | 0.5% |
| FMG icons, patterns, social, preview | `map/images/` minus textures | 20 | 327,753 | 0.2% |
| Site icons, OG images, sitemap, notices page | `public/` root | 12 | 213,273 | 0.1% |
| Paper-grain tiles (estate-generated) | `textures/*.png` | 2 | 6,019 | <0.1% |
| **Total** | | **822** | **176,499,727** | **100%** |

Arithmetic closes exactly on both columns.

### §1.4 · The structural finding: nothing guards any of it

The estate has real supply-chain machinery over the vendored fork, and it covers **only
code**:

- `public/map/libs/VENDOR-MANIFEST.json` pins **140 entries**, extensions `js` and `css`
  only. Occurrences of `charges`, `textures`, `heightmaps`, `images/`, `.svg`, `.png`,
  `.jpg` in that manifest: **0 each.**
- `scripts/validate-map-fork.mjs` (which `npm run check` invokes as `validate:map`) walks
  `public/map/` recursively but inspects only files where `extname(entry.name) === '.js'`
  (line 19). Its SHA-256 pinning is scoped to `libsRoot`.
- **No test or script anywhere in the repository references `map/charges` or
  `map/images/textures`.** Node scan across every `.js/.jsx/.json/.mjs` under `tests/` and
  `scripts/`: **0 hits.** *Positive control: the same scan finds **9** files referencing
  `map/libs`.* `tests/security/mapForkSinkInventory.json` likewise returns 0 for all three
  art directories.

So **385 third-party art files inside the fork are covered by zero integrity, inventory, or
licence machinery**, while the twenty JavaScript files beside them are pinned by SHA-256 and
gated in CI. The estate's own manifest states the reasoning it did not extend to the art:
the libs "ship to the SAME ORIGIN as the payment + auth app … a silent swap/tamper is still
a real risk the gate must see."


---

## §2 · PROVENANCE PER GROUP, EVIDENCED

Classification is strict. **DOCUMENTED** means a repo file, an embedded metadata field, an
upstream licence, or a commit message states the origin. **INFERRED** means a mechanism (not
a filename) implies it. **UNKNOWN** means nothing states it — and an inference from a
directory name is UNKNOWN, not INFERRED.

### §2.1 · The master table

| Group | Files | Bytes | Source | Licence | Evidence | Class |
|---|---|---|---|---|---|---|
| **Charges — WappenWiki** | **179** | 2,560,701 | wappenwiki.org (178), commons (1) | **CC BY-NC-SA 3.0 — NON-COMMERCIAL** | per-file `<metadata license=…/>`; Armoria README | **DOCUMENTED** |
| **Charges — copyleft** | **48** | 230,972 | commons.wikimedia, upload.wikimedia, vikinganswerlady.com | CC BY-SA 2.5/3.0/4.0, GFDL 1.3, Art Libre | per-file `<metadata>` | **DOCUMENTED** |
| Charges — attribution-only | 4 | 4,636 | commons.wikimedia.org | CC BY 1.0 / 4.0 | per-file `<metadata>` | DOCUMENTED |
| Charges — CC0 | 104 | 279,799 | 72 `author="Azgaar"`, 32 commons/freesvg/wikipedia | CC0 1.0 | per-file `<metadata>` | DOCUMENTED |
| Charges — undeclared | 3 | 18,052 | none | none | `arbalest.svg`, `plaice.svg` have no `<metadata>`; a template file has `license="licenseDescURL"` | **UNKNOWN** |
| **Textures — paper/marble/plaster/wood** | **18** | ~9,352,000 | **NOTHING** | **NOTHING** | metadata stripped; no notice anywhere | **UNKNOWN** |
| **Textures — Mars, Mercury** | 4 | ~1,302,000 | not established; both "big" are exactly 2048×1024, matching Solar System Scope 2K planetary maps (CC BY 4.0) | not established | dimensional + subject match only | **UNKNOWN** |
| **Textures — Spain/Iran/Mauritania** | 3 | 644,433 | **NOTHING** | **NOTHING** | all exactly 1460×900 true-colour Earth observation; no collection matched | **UNKNOWN** |
| **Heightmaps** | 23 PNG | 1,224,573 | Tangrams Heightmapper over Mapzen/Tilezen Terrain Tiles | mixed; **attribution mandatory** for several DEMs | `map/heightmaps/import-rules.txt`; 22/23 byte-identical to upstream | **DOCUMENTED** (method + immediate upstream); **INFERRED** as to which DEM per image |
| **Fonts** | 17 | 1,401,748 | Google Fonts (Lora, Nunito) | SIL OFL 1.1 — **but shipped MODIFIED** | name tables; `theme.js:92-96,107-111`; `df9c94d27`, `cf9cfd3af` | DOCUMENTED, **and the notice is wrong** |
| Social icons (Discord/Reddit/Pinterest/X/Facebook) | 5 | 2,518 | NOTHING | NOTHING — and these are third-party **trademarks** | `index.html:2455-2484`; only `Software=www.inkscape.org` | **UNKNOWN** |
| `pattern1-6.png`, `kiwiroo.png` | 7 | 34,980 | NOTHING | NOTHING | `index.html:1039-1045` | **UNKNOWN** |
| FMG `preview.png`, PWA icons | 8 | 290,255 | FMG's own rendered output | covered by the derivative-works clause | visually confirmed rendered FMG maps | INFERRED |
| **Page paintings — cohort B** | 32 | 8,014,616 | **AI: Google AI via Higgsfield** | vendor ToS | `5b582428c`; masters carry `photoshop:Credit="Made with Google AI"`, IPTC `trainedAlgorithmicMedia`, Google-signed C2PA, `hf-job-id` | **DOCUMENTED** (evidence lives outside the repo) |
| **Page paintings — cohort A** | 17 | 5,021,216 | **NOTHING** | **NOTHING** | `f1727ecfa` 2026-06-05; no statement, no metadata | **UNKNOWN** |
| **Page paintings — `.orig.jpg`** | 6 | 2,391,935 | **NOTHING** | **NOTHING** | preserved cohort A | **UNKNOWN** |
| `videos/realm-journey.mp4` | 1 | 20,715,193 | **AI: BytePlus ModelArk `dreamina-seedance-2-0`** | vendor ToS | C2PA `c2pa.actions.v2` intact in the shipped file, signed by Byteplus Pte. Ltd. | **DOCUMENTED** |
| `media/journey-legs/**` | 13 | 44,601,456 | AI: same Seedance upstream, then ffmpeg re-encoded | vendor ToS | `eedb67bf6`, `f9ae55685`; **C2PA stripped by the re-encode** | DOCUMENTED (by commit, not by file) |
| `evolution/*.jpg` | 6 | 837,563 | AI, stamped in-file | vendor ToS | credit strings present in the files | DOCUMENTED |
| `landing-maps/**` | 80 | 68,558,483 | **estate — procedurally generated** | ours | `scripts/generate-k{0,0b,1,2,3,4}.mjs`, `generate-landing-map-plates.mjs` build them from in-repo kernels with double-build byte-identity asserted | **DOCUMENTED** |
| `public/textures/paper-grain-*.png` | 2 | 6,019 | **estate — seeded generator** | ours | `scripts/gen-paper-grain.mjs`, FNV-1a seeded noise | **DOCUMENTED** |
| Root icons, OG images | 12 | 213,273 | estate | ours | `scripts/gen-organic-logo.mjs` (byte-golden), resvg-wasm | DOCUMENTED |

### §2.2 · The FMG grant, and exactly what it does not reach

`public/map/LICENSE-FMG.txt`, byte-identical to upstream (fetched 2026-08-23). The operative
widening clause:

> You can produce, without restrictions, any derivative works from the original software and
> even reap commercial benefits from the sale of the secondary product. The derivates include
> created maps, map images, screenshots, videos, and other materials.

That is a strong grant over **outputs**. It makes no representation about the provenance of
the bundled **inputs**, and it cannot: Azgaar cannot licence rights he never held.

**And upstream says so, in its own words.** Armoria's README, fetched 2026-08-24:

> A lot of the complex charge renders are from [WappenWiki](http://wappenwiki.org) and
> available for [non-commercial use only](https://creativecommons.org/licenses/by-nc/3.0/).

**The fork concedes it inside our own tree, too.** `public/map/modules/ui/emblems-editor.js:502`
writes this line into every emblems gallery a user exports:

> Generated by ${FMG}. The tool is free, but images may be copyrighted, see ${license}

### §2.3 · The doctrine was already in the notices file — applied to one function, not to 11.6 MB of art

`THIRD-PARTY-NOTICES.md` §1.1 states the governing principle exactly right, in a
"third-party-within-third-party note" about a copied-in Urquhart-graph utility:

> The permissive top-level grant above does not reach code the project itself copied in from
> elsewhere, so the provenance of that utility is a separate open question, docketed at §253.2.

The doctrine is in the file. It was applied to one minified function and never to the 385 art
files sitting beside it, while the same document's table books the whole of `public/map/` as MIT.

### §2.4 · What the notices document does and does not contain

Measured at `7af8c3d08` (`grep -aci`, 521 lines, sha256 `4806233e…`):

`texture` **0** · `heightmap` **0** · `heraldr` **0** · `artwork` **0** · `illustration` **0** ·
`painting` **0** · `.png`/`.jpg`/`.svg`/`.mp4`/`.webp` **0** · `CC0` **0** ·
`Creative Commons` **0** · `public domain` **0** · `public/backgrounds` **0** ·
`public/landing-maps` **0** · `public/media` **0** · `public/videos` **0** · `wappenwiki` **0** ·
`Armoria` **0** · `NonCommercial` **0**.

*Positive control — the same instrument, same file:* `public/map` **10**, `public/fonts` **6**,
`OFL` **6**, `Azgaar` **3**, `MIT` **140**. The zeros are real absences, not a broken search.

**One correction to the AD compile:** `charge` is **2** occurrences, not 3 (lines 58 and 435,
both MIT boilerplate "free of charge"). `image` is 2 — line 70 (the FMG clause) and line 281
(the npm package `@react-pdf/image`). `asset` is 1 — line 167, TinyMCE static assets. The
substance is unchanged: there is no art row anywhere in the document.

The omission is structural, not an oversight. The document's own scope sentence reads: "Three
populations of third-party code and data reach a browser" — the fork's code, the fonts, and
the npm tree. Art was never in scope.


---

## §3 · THE SELLING QUESTION

### §3.1 · The premise, verified rather than inherited

`src/config/pricing.js:297-304`:

```js
export const SINGLE_DOSSIER = Object.freeze({
  key:           'single_dossier',
  stripeProduct: 'single_dossier',
  priceCents:    299,                     // $2.99
  priceLabel:    '$2.99',
  deliverables:  ['pdf'],
  requiresAccount: false,                 // can be claimed without signup
});
```

`src/components/dossier/ExportUnlockDialog.jsx:11-13` describes the same SKU as "Unlock all
exports for this settlement · $2.99", so the $2.99 covers the PDF, the town-map SVG/PNG/JPEG/WebP,
the VTT token raster and the Foundry bundle. **CONFIRMED.**

### §3.2 · The chokepoint holds, and it decides most of the question

`buildTownMapDrawList` can emit exactly five op types, declared at
`src/domain/townMap/townMapDraw.js:62-71`: `poly`, `line`, `circle`, `rect`, `path`. Both
adapters are closed switches that discard anything else — the SVG adapter
(`townMapDraw.js:409-439`) ends `default: return ''`, and the PDF adapter
(`src/pdf/sections/TownMapPlate.jsx:47-113`) ends `default: return null`. The react-pdf import
line at `TownMapPlate.jsx:19` is `View, Text, Svg, Polygon, Polyline, Line, Circle, Rect, Path`
— **`Image` is not imported anywhere in `src/pdf/`.**

**No raster, no external file reference, no pattern fill and no `data:` URI can enter any
estate-authored export.** That single fact clears the textures, the charges, the heightmaps,
the paper-grain tiles and the page paintings from every SettlementForge-authored sold artifact.

### §3.3 · The four postures, per group

| Group | Posture | Reaches which sold surface | Evidence |
|---|---|---|---|
| FMG textures (23) | **SCREEN-ONLY** in-app (and dormant); **EMBEDDED** in the fork's own native export | none in-app; FMG's SVG/PNG/JPEG/tiles export | `modules/io/export.js:276-286` rewrites `#texture > image` href to base64. Not reachable in-app: no default preset contains `toggleTexture` |
| FMG charges (338) | **SCREEN-ONLY**, never fetched in-app; **EMBEDDED** as inline geometry in the fork's native export | FMG native SVG/PNG | `fetch('./charges/${t}.svg').then(r=>r.text())` inlines the geometry; `export.js:246-258` clones displayed emblem defs into the export |
| FMG heightmaps (23) | **GENERATION-INPUT-ONLY** | none | downsampled, gamma-warped, quantised to 101 levels, then `r.remove(); c.remove()`. No pixel survives |
| FMG patterns / icons / social | SCREEN-ONLY / REFERENCED from `manifest.webmanifest`; `preview.png` is an orphan | none | `index.html:385, 2455-2484` |
| Page paintings (55) | **SCREEN-ONLY** | none | only producer is a CSS `url()` at `src/config/pageBackgrounds.js:66,159`; zero hits in `src/pdf/`, `src/lib/*Export*.js`, `src/foundry/` |
| `public/textures/paper-grain-*` | **SCREEN-ONLY** | none | a CSS tile (`src/styles/organic.css:214,216`); the PDF has no CSS |
| **Fonts (Lora, Nunito)** | **EMBEDDED** | **the sold PDF, all four variants** | `src/pdf/theme.js:90,105`; fetched and embedded in `src/utils/pdfRender.worker.js:23-26`. **The only third-party binary in the PDF** |
| landing-maps, media, videos, evolution, og/favicons | SCREEN-ONLY | none | `LandingArtifacts.jsx:62,399`; `HomeLanding.jsx:38`; `HomeHero.jsx:332` |

The map plate ships in exactly two of four dossier variants — `src/pdf/variants.js:50`
(`draft_brief`) and `:88` (`canon_dossier`) are `townMapPlate: true`; `:121` and `:160` are
false. The AD compile's claim is **CONFIRMED**.

### §3.4 · The realm-map PNG — the one composite, and why it is still clean

`src/lib/realmMapExport.js` `renderRealmMapPngBlob` is the only export that composites
anything from the fork. It calls `bridge.exportThumb(1024)`; `public/map/sf-bridge.js:908-960`
clones `#map`, serialises it with `XMLSerializer`, loads it as `data:image/svg+xml` into an
`<img>`, draws to canvas, and returns `toDataURL('image/jpeg', 0.82)`. The parent composites
its own pure-vector marker overlay and calls `downloadBlob`.

A relative `./images/textures/*.jpg` href cannot resolve against a `data:` URL, and SVG
rendered inside an `<img>` blocks external subresource loading regardless of origin. **Texture
bytes do not reach it.** The bridge's own comment at `:905` anticipates the alternative
outcome ("tainted canvas from an external `<image>`"), which would return `null` and fall back
to a placeholder. Either branch is safe. The code half is CONFIRMED; the browser-behaviour
half is PLAUSIBLE (spec behaviour, not executed here) — and it is redundant anyway, because
the texture layer is off by default.

**One mechanism worth recording, because it is the seam that would flip this.** The embedded
hiding is document-level CSS (`body.sf-embedded #emblems { display: none }`, `sf-bridge.js:182,190`)
living in `document.head`. `cloneNode(true)` on `#map` copies only the SVG subtree, so the
serialised standalone SVG carries neither the `body.sf-embedded` context nor the stylesheet.
**Every layer hidden only by that CSS reappears in the exported raster if its DOM is populated.**
Today the emblems layer is not populated, because the default preset does not enable it — so
this is latent, not live. It becomes live if the emblems layer is ever switched on.

### §3.5 · Why §524 is not what condemns the charges

The trichotomy VIEW/AUTHOR/TAKE-AWAY gates **use**. CC BY-NC-SA restricts **commercial use and
distribution**, which is a different act. The charges never enter a sold file, so the paywall
ruling neither creates nor cures their exposure. What creates it is that a commercial product
has been publicly redistributing them since April 2026.

**And that redistribution is live right now.** Fetched 2026-08-24:

| URL | Result |
|---|---|
| `https://settlementforge.com/map/charges/oak.svg` | **HTTP 200**, 70,238 B, byte-identical to the repo (sha256 `2f77575b30f5d335edeaf6ca87999530067f55f73a56ecc793b96a55bea23878`), and the served bytes contain `license="https://creativecommons.org/licenses/by-nc-sa/3.0"` |
| `https://settlementforge.com/map/images/textures/marble-big.jpg` | **HTTP 200**, 548,407 B, matches the repo |
| `https://settlementforge.com/map/heightmaps/world.png` | **HTTP 200**, 58,307 B, matches the repo |
| `https://settlementforge.com/map/LICENSE-FMG.txt` | HTTP 200, 1,353 B |
| **`https://settlementforge.com/third-party-notices.html`** | **HTTP 404** |
| `map.settlementforge.com` | **NXDOMAIN** |

Two operational facts fall out of that table. **The compliance page does not exist in the
deployed build**, so every attribution obligation the tree believes is discharged is
undischarged in the live product — and the notices test cannot see this, because it compares
two files in the repository, not the deployment. And **the fork is served from the apex, not
from the `map.settlementforge.com` subdomain** that `THIRD-PARTY-NOTICES.md` §1 and
`vercel.json` both describe, so the documented origin separation is not the live arrangement.

### §3.6 · The standalone fork is a public product surface

`sf-bridge.js:51-52` is `const isEmbedded = window.parent !== window; if (!isEmbedded) return;`.
A top-level visit therefore installs no bridge, applies no `sf-embedded` class, and presents
the **complete FMG UI** — including the 26-option texture dropdown (`index.html:941-970`, default
`marble-big.jpg`), the Emblems layer preset, and the native Export menu that base64-inlines the
art. `vercel.json:49` restricts framing but not top-level navigation, and the paths resolve as
the table above proves.

Inside the iframe, `modules/ui/hotkeys.js` maps `X` to `toggleTexture` and `Y` to
`toggleEmblems` with no suppression from `sf-bridge.js`, and `applyLayersPreset` reads
`localStorage.getItem("preset")` (`layers.js:103`) on an origin shared with the standalone
visit. The layers are off by default and one keystroke away.


---

## §4 · THE HEIGHTMAPS — the group that turned out to be documented

23 PNGs, 1,224,573 B, plus a 24th file that is the answer.

### §4.1 · The 24th file

`public/map/heightmaps/import-rules.txt` (312 B), in full:

> To get heightmap with correct height scale: 1. Open https://tangrams.github.io/heightmapper
> 2. Toggle off auto-exposure 3. Set max elevation to 2000 4. Set min elevation to -500
> 5. Find region you like 6. Render image 7. Optionally rescale image to a smaller size
> (e.g. 500x300px) as high resolution is not used

**The chain, every link fetched 2026-08-23:**

1. `tangrams/heightmapper` README — "Uses Mapzen's global elevation service", with a UI
   matching `import-rules.txt` step for step.
2. `tangrams/heightmapper` `scene.yaml` — the elevation source is
   `https://tile.nextzen.org/tilezen/terrain/v1/512/terrarium/{z}/{x}/{y}.png`. There is **no
   `attribution:` field in that file**.
3. `tilezen/joerd` `docs/attribution.md` — Mapzen/Tilezen Terrain Tiles, **a composite of 13
   DEMs**, opening "Attribution is required for many terrain tile data providers." The AWS Open
   Data registry names this document as the dataset's licence.

**Physical corroboration, measured rather than assumed.** Histograms show hard clamping at both
ends (`world.png` 55.9% at value 0, 1.7% at 255) — exactly what "auto-exposure off, min −500,
max 2000" produces. Sea level under that range sits at grey 51 = 0.2, and FMG's consumer code
branches on the literal `a < .2`. The recipe and the consuming code agree to the constant.
Connected-component analysis refutes any OpenStreetMap vector overlay (in `greenland.png`,
6,087 of 6,278 saturated pixels form one blob — the ice sheet — not thin label strokes), so
**ODbL share-alike is not engaged.**

**Byte-identity to upstream:** 22 of 23 are byte-identical to
`Azgaar/Fantasy-Map-Generator/master/public/heightmaps/`, as is `import-rules.txt`. Only
`europe-north.png` differs — upstream replaced it on 2026-07-11 (`a7474045f`), after our
2026-04-24 vendoring.

**Metadata:** every PNG is 8-bit greyscale, colour type 0, with exactly two `tEXt` chunks
(`date:create`, `date:modify`, 2022-04-21) and **no Copyright, Author, Software, Comment, XMP,
EXIF or iCCP chunk on any file**. Those 2022 timestamps are upstream ImgBot artefacts
(`8a0fbd14d`, "[ImgBot] Optimize images"), not ours. *Positive control: a purpose-built chunk
parser extracted `tEXt[Copyright]`, `tEXt[Software]`, `tEXt[Author]`, `zTXt[Comment]`,
`iTXt[XMP]` and `eXIf` verbatim from a synthetic PNG carrying all six. The instrument works;
the negative is real.*

**Git:** all 24 entered in a single commit, `f386f48d9` (2026-04-24), as part of the FMG vendor
drop, unremarked. That commit's message says "LGPL — see LICENSE-FMG.txt"; the actual file is
MIT plus the derivative-works clause. A small documentation error worth correcting.

### §4.2 · The terms that actually apply

From the Tilezen attribution document (fetched 2026-08-23). **No copyleft and no
non-commercial term** — but attribution is mandatory for several constituents:

| Source | Status | Attribution | Commercial |
|---|---|---|---|
| ETOPO1 (NOAA) — all bathymetry | US public domain | requested | yes |
| GMTED2010 / SRTM / 3DEP (USGS) | US public domain | requested, not required | yes |
| **EU-DEM (Copernicus/EEA)** | Reg. (EU) 1159/2013 | **required** — the prescribed credit **plus a statement that the data was modified** | yes |
| **Kartverket (Norway)** | CC BY 4.0 | **required** — "© Kartverket" | yes |
| **UK Environment Agency** | **OGL v3** | **required**; non-compliance terminates the grant *automatically* | yes |
| LINZ (New Zealand) | CC BY 3.0 NZ | required | yes |
| Geoscience Australia | CC BY 4.0 | required | yes |
| data.gv.at (Austria) | CC BY 3.0 AT | required | yes |
| CDEM (Canada) | OGL–Canada | required | yes |
| INEGI (Mexico), ArcticDEM | open / unlicensed | required / requested | yes |

**Three premises in the audit brief are refuted.** Ordnance Survey Terrain 50, GEBCO and
viewfinderpanoramas are **not** constituents — the UK source is Environment Agency LIDAR and
the bathymetry is ETOPO1, not GEBCO. ASTER GDEM, Natural Earth, OpenTopography and Copernicus
DEM GLO-30 are also not implicated. *Instrument note: the 843 apparent "aster" hits in the repo
are substring noise — `master` 1961, `disaster` 369, `raster` 361, `faster` 281, `monastery` 229.*

### §4.3 · Classification, and the honest residual

All 23 are **DOCUMENTED** as to method and immediate upstream, and **INFERRED** as to which
specific DEM contributed to which image — that depends on the render zoom, which the PNGs do
not record. **None is UNKNOWN.** The extents most likely to touch the attribution-mandatory
sources are `europe.png`, `europe-north.png`, `iceland.png`, `britain.png` and `greenland.png`.
Do not lean on "it is all US public domain."

Neither we nor upstream carries the credit: Azgaar's repo has no CREDITS or NOTICE file, and
his `docs/wiki/Dependencies.md` credits 13 JavaScript libraries and zero data sources.

**Can a heightmap reach a sold file? No.** `HeightmapGenerator.fromPrecreated` draws the PNG to
an offscreen canvas, reads only the red channel, applies `a < .2 ? a : .2 + (a-.2)**.8`,
quantises to `clamp(floor(r*100), 0, 100)`, and removes both elements. Even the picker
thumbnail is a re-render from the height array, not the source PNG. Heightmap-*derived* content
does leave the iframe — the per-cell height array via `getSpatialPack`, and the rasterised
terrain via `exportThumb` — but no pixel of the source image does.


---

## §4A · THE FONTS — the only third-party binary inside the thing we sell

This group was booked "covered and clean" by the AD compile, on the strength of a notices
section that is genuinely careful about everything except one fact.

### §4A.1 · The fonts are modified

| Evidence | What it shows |
|---|---|
| `df9c94d27` (2026-06-07) "Fix dossier rendering: F-artifact (font root-fix)" | all four Lora TTFs re-cut — `Lora-Regular.ttf` Bin 132,188 → 129,336; `Lora-Bold.ttf` 132,124 → 129,280; Italic and BoldItalic likewise |
| `cf9cfd3af` (2026-06-07) "PDF: strip Nunito ligatures (real F-artifact cause)" | all four Nunito TTFs re-cut — `Nunito-Regular.ttf` 125,528 → 125,460, etc. |
| `src/pdf/theme.js:92-96` | "The Lora files were **re-cut** to drop the broken fi/fl/ff ligature glyphs" |
| `src/pdf/theme.js:107-111` | "These files were **re-cut** to drop the ligature features (glyphs preserved 1:1)" |
| Binary inspection this session | GSUB now exposes `locl calt ccmp frac` and **no `liga`** in either family |

**CONFIRMED**, five independent ways, including the estate's own prose.

### §4A.2 · What the name tables actually say

Parsed directly from the shipped binaries this session:

| File | name ID 0 (copyright) | name ID 1 (family) | RFN declared? |
|---|---|---|---|
| `Lora-Regular.ttf` | `Copyright 2011 The Lora Project Authors (…), with Reserved Font Name "Lora".` | **`Lora`** | **YES** |
| `Lora-Bold.ttf` | same | **`Lora`** | **YES** |
| `Nunito-Regular.ttf` | `Copyright 2014 The Nunito Project Authors (…)` | `Nunito` | no |

Name ID 13 (License Description) is empty on every face; Nunito carries ID 14
`https://scripts.sil.org/OFL`, Lora carries none. *(My first pass used a crude UTF-16 decode
and wrongly reported RFN absent; the proper name-table parse above supersedes it.)*

### §4A.3 · The governing text, from the estate's own served notice

`public/fonts/OFL.txt:94-97`:

> "Modified Version" refers to any derivative made by adding to, deleting, or substituting --
> in part or in whole -- any of the components of the Original Version, by changing formats or
> by porting the Font Software to a new environment.

`public/fonts/OFL.txt`, clause 3:

> No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit
> written permission is granted by the corresponding Copyright Holder. This restriction only
> applies to the primary font name as presented to the users.

Deleting the `liga` GSUB feature is deleting components of the Original Version. The shipped
Lora files are therefore Modified Versions, and their primary font name — in the name table
and in `Font.register({ family: 'Lora' })` — is still `Lora`.

### §4A.4 · Three statements in the tree say the opposite

- `THIRD-PARTY-NOTICES.md:219-220` — "Both families are shipped **unmodified**: neither is
  renamed, and no Reserved Font Name is used on a derivative."
- `THIRD-PARTY-NOTICES.md:418` — "unmodified, and we redistribute both unmodified."
- `public/fonts/OFL.txt:10-11` — "The fonts themselves are **unmodified**. Neither family is
  renamed, and no Reserved Font Name is used on a derivative."

The notices document opens by claiming every licence identifier "was read out of the artefact
in this repository … None was taken on trust." The modification status was not read out of the
artefact; had it been, `df9c94d27` would have surfaced.

### §4A.5 · Why this outranks the charges on urgency

These fonts are **embedded in the $2.99 dossier PDF, in all four variants**
(`src/pdf/theme.js:90,105`; fetched and embedded in `src/utils/pdfRender.worker.js:23-26`), and
`src/pdf/` imports no react-pdf `Image` at all. **The fonts are the only third-party bytes in
the artifact the estate sells** — and the notice served alongside them makes a false factual
statement about them.

Nunito is a Modified Version too, but declares no Reserved Font Name, so clause 3 does not
bite; only the "unmodified" claim is wrong there.

**Legal conclusion is PLAUSIBLE — this is licence text being read, not advice.** The factual
mismatch is CONFIRMED. Nothing in the test suite pins provenance, so it can drift again;
`tests/build/thirdPartyNoticesPage.test.js:369` pins the exact Lora copyright string
*including* the Reserved Font Name wording, which means the guard currently helps preserve the
inaccuracy rather than catch it.


---

## §5 · THE PAGE PAINTINGS — where the record speaks, and where it is silent

15,427,767 B in 55 files, the largest block the AD compile flagged as unattributed. The answer
splits, and only half of it is silence.

### §5.1 · What `public/BACKGROUND.md` actually says

The file documents these images thoroughly on resolution, format and budget. Its **entire**
provenance content is one clause:

> Source paintings were ~3 MB PNGs; these are resized to ≤1920px wide and ~200–500 KB each.

It never names a painter, a tool, a model or a licence. The AD compile's characterisation is
**CONFIRMED.**

### §5.2 · Cohort B — 32 files, 8,014,616 B — DOCUMENTED, outside the repo

Commit `5b582428c` (2026-07-18) states these came from `marketing/assets/references/site-plates`
via "PNG -> 1672w mozjpeg-q80 JPG". Those masters live at
`~/Desktop/settlementforge-marketing-masters/references/site-plates/` (archived out of git by
`ced265b8c`, 381 MB), and the repo's own `marketing/assets/README.md` points there by absolute
path.

**21 of 22 masters carry `photoshop:Credit="Made with Google AI"`, IPTC
`DigitalSourceType=trainedAlgorithmicMedia`, a C2PA manifest signed by *Google LLC / Google
C2PA Media Services 1P ICA G3*, and an `hf-job-id` Higgsfield job UUID.** The mozjpeg step
stripped all of it from the shipped derivatives — which is why the repo looks silent when it is
not.

The out-of-repo art-direction manifest (`marketing/assets/references/MANIFEST.md`, reachable on
1 of 446 refs and **not** an ancestor of the build tip) reads: "14 images · nano-banana-2 route
@ 2K … REFERENCES ONLY — nothing generated ships without the taste veto." That line sits above
the table of 14 video references and does not explicitly enumerate the site plates; the plates'
AI origin rests on their own embedded metadata, which is stronger evidence anyway.

Covers: `about`, `city`, `compendium`, `gallery`, `settlements`, `world-map`, `dim-desk`,
`realm-table`, `founders-charter`, `export-dispatch`, `evolution-1..6`.

### §5.3 · Cohort A — 17 files, 5,021,216 B — plus 6 `.orig.jpg`, 2,391,935 B — UNKNOWN

**This is the true silence: 7,413,151 bytes.**

Introduced by `f1727ecfa` on **2026-06-05**, six weeks before the reference library existed.
No commit states an origin. No file carries metadata. No notice covers them. No adjacent
README, CREDITS, SOURCES or PROVENANCE file exists in any asset directory (`find` returned
zero).

Covers: `create`, `account`, `pricing`, `thorpe`, `village`, `settlement-progression`,
`landing/*-1400`, and the six preserved `*.orig.jpg`.

**Stated affirmatively: the painter of these 23 files is not recorded anywhere in the tree, and
I could not establish it.** It is *likely* they were produced the same way as cohort B — same
project, same visual idiom, and the July replacements were framed as improved versions of the
same scenes — but **no evidence supports that**, and it is not being dressed as a finding.

*Positive control on the metadata instrument: `exiftool` is not installed, so a PIL-based
extractor plus raw marker scanning was used. Against a synthetic JPEG and PNG carrying known
tags, the same script printed `EXIF Artist = CONTROL ARTIST Jane Painter`, `EXIF Copyright`,
`EXIF Software` and `PNGTEXT Author` verbatim, and it positively surfaced real credit strings
on `evolution/*.jpg`. So "(none)" on the 55 backgrounds is a true negative.*

### §5.4 · The video chain — closed

`public/videos/realm-journey.mp4` is byte-identical to its master
(`masters/videos/settlementforge-journey-scrub.mp4`, both sha256 `745c2b0a…`), vindicating the
commit's "copied byte-exact, NEVER re-encoded". Its C2PA reads verbatim: `action: c2pa.created`,
`when: 2026-07-18T18:26:22Z`, `softwareAgent.name: BytePlus_ModelArk`, `model_name:
dreamina-seedance-2-0`, signed by Byteplus Pte. Ltd. **The provenance manifest ships intact in
production**, so any recipient can read that the hero video is AI-generated.

The six `media/journey-legs/*.mp4` are ffmpeg re-encodes (`Lavc62.28.102 libx264`, 5.041667 s
each, Σ 30.25 s, matching `f9ae55685`'s "30.25 s all-keyframe film" and `videos/concat.txt`) of
the same Seedance-generated masters. **The re-encode stripped the C2PA**; the shipped legs carry
no provenance at all. The seven paired stills are frame grabs with a Photoshop `DocumentID` and
no author.

*Instrument receipt: `grep -ac 'dreamina-seedance-2-0' realm-journey.mp4` returns `1`; bare
`grep -c` printed nothing. The binary-count hazard reproduced live.*

**A false positive caught and discarded:** several files appeared to contain "Veo". Every hit
sits deep inside compressed H.264/IDAT payload, never in a metadata box. **There is no evidence
of Google Veo anywhere** — reported as absent, not present.

### §5.5 · The clean cases, machine-provable

`landing-maps/**` (80 files, 68,558,483 B) and `public/textures/` (2 files, 6,019 B) are
**estate-authored and provable**. `scripts/generate-k{0,0b,1,2,3,4}.mjs`,
`generate-landing-map-plates.mjs` and `generate-realm-preview.mjs` generate the plates from
in-repo pure kernels (`src/domain/townMap/arch/*`) using the repo's own PNG encoder, with
double-build byte-identity asserted; `generate-landing-map-plates.mjs:45-51` calls
`buildTownMapDrawList` directly. `scripts/gen-paper-grain.mjs` bakes the grain tiles from
FNV-1a seeded noise. Root icons come from `scripts/gen-organic-logo.mjs` (byte-golden set) and
`og-default.png` from a hand-built SVG via resvg-wasm.

**One trap worth naming so nobody re-reads it wrongly.** `scripts/optimize-backgrounds.mjs`
**only post-processes** — it reads existing `public/backgrounds/*.jpg` and emits WebP twins via
sharp at q72. Its presence in `scripts/` could easily be misread as estate authorship of the
paintings. **It establishes authorship of nothing.** The same applies to the `sips` step in the
evolution pipeline.

### §5.6 · An incidental finding

Three k-exhibit plates are byte-identical across supposedly different conditions: blob
`26dd10166` is shared by `k2/plate-cathedral-corrupt-decayed.png`,
`k2/plate-cathedral-war-scarred.png` and `k3/plate-cathedral-ruinedGothic.png`, and two further
pairs collide. Consistent with a deterministic renderer collapsing distinct inputs to identical
output. Not a licence question — recorded for whoever owns the exhibit set.


---

## §6 · THE REMEDY MENU, PRICED

Costs are engineer-hours unless cash is named, and are this lane's estimates, marked as such.
"Cheap now / expensive later" is the column that matters.

### §6.1 · The charges — 234 of 338 problematic

| Option | Cost | Consequence | Verdict |
|---|---|---|---|
| **DELETE the whole directory** (338 files, 3,094,160 B) | **~1 hour** | Emblems become unavailable in the standalone fork. In-app: **zero change** — the layer is off by default, the app never fetches a charge, and no test references the directory. Closes 53% of the audit's legal surface outright | **RECOMMENDED** |
| Delete only the 234 non-CC0 (NC + copyleft + undeclared) | ~2 h | Keeps 104 CC0 charges for a future emblems feature. Needs a pruned selection list in the fork or a user gets a 404 | Good second choice if emblems are wanted later |
| Attribute and keep | **NOT AVAILABLE for the 179 NC** — attribution does not cure a non-commercial term, and **177 of the 179 record no author**, so even the BY half is uncompliable | — | Refused |
| Attribute and keep, copyleft subset only (48) | ~3 h | ShareAlike would require licensing our derivative under the same terms — incompatible with a proprietary paid product | Refused |
| Obtain a commercial licence from WappenWiki | unknown cash, weeks–months | 178 files from one source, so one negotiation could clear most of it. But it is a real negotiation with an unknown counterparty | Only if emblems become a product commitment |
| Replace with estate-authored charges | weeks | Fits the charter's option (a) and the setting-agnostic law | The right answer *if* emblems ever ship; not needed to close the exposure |

**Cheap now, expensive later:** deletion costs an hour today. After launch it becomes a
takedown, a re-issue of sold artifacts, and a disclosure conversation.

### §6.2 · The textures — 23 files, 11,646,263 B, provenance NOTHING

| Option | Cost | Consequence | Verdict |
|---|---|---|---|
| **DELETE the directory** | **~1 hour** | Texture layer unavailable in the standalone fork; **zero in-app change** (layer off by default, no test references it). Removes 6.6% of total payload | **RECOMMENDED** |
| Delete only the unreachable one | ~10 min | `soiled-paper-vertical.png` is **3,174,114 B — 27.3% of all texture bytes — and unreachable**: the only reference is to a `.jpg` spelling that does not exist. Pure dead weight | Do this regardless |
| Identify and attribute | days, uncertain | Metadata is stripped and upstream documents nothing. Mars/Mercury are both exactly 2048×1024, matching Solar System Scope's 2K planetary maps (CC BY 4.0, commercial OK, credit required). **One download and a hash comparison would settle those two** and is the single highest-value cheap test outstanding. The 18 paper/marble/plaster files and the three 1460×900 Earth-observation images matched nothing | Worth 30 minutes for Mars/Mercury only |
| Replace with procedural paper grain | ~1 day | The estate **already has this**: `scripts/gen-paper-grain.mjs` bakes seeded noise tiles. Extending it to a texture set is squarely charter option (a) | The right long answer |

### §6.3 · The fonts — the sold artifact

| Option | Cost | Consequence | Verdict |
|---|---|---|---|
| **Correct the three false statements** | **~1 hour** | Fixes the accuracy defect in `THIRD-PARTY-NOTICES.md:219-220`, `:418` and `public/fonts/OFL.txt:10-11`. Does **not** cure the Lora RFN question | **Do immediately; necessary but not sufficient** |
| **Rename the modified Lora** (e.g. `SF Lora` / a forge name) | ~3–4 h | The OFL-sanctioned route: clause 3 restricts only "the primary font name as presented to the users". Touches `src/pdf/theme.js`, the app CSS, the TTF/WOFF2 filenames and name tables, four PDF test shims, `fontsAndMeta.test.js`, `organicSamples.test.js`, `thirdPartyNoticesPage.test.js:369`, `OFL.txt`, the notices MD and its HTML twin. **PDF bytes change; no same-seed shift and no PDF byte golden exists** | **RECOMMENDED** |
| Revert to unmodified upstream binaries | ~2 h + an unsolved bug | Restores the "tofu after f" artifact the re-cut was made to fix. Only viable if the ligature problem can be suppressed at the react-pdf layer instead — feasibility unknown | Investigate; do not assume |
| Ask the Lora authors for written permission | free, weeks, uncertain | Clause 3 allows it explicitly. Slow and not in our control | Fallback |
| Nunito | ~0 beyond the notice fix | Modified but declares no RFN, so only the "unmodified" statement is wrong | Notice fix only |

### §6.4 · The heightmaps — 23 files, attribution owed

| Option | Cost | Consequence | Verdict |
|---|---|---|---|
| **Add an attribution block** naming Tilezen/Mapzen and the mandatory-credit DEMs | **~2 hours** | Discharges EU-DEM (which also requires a "data was modified" statement), Kartverket, LINZ, UK Environment Agency OGL v3, Geoscience Australia, data.gv.at, CDEM. Cheapest possible fix for a whole group | **RECOMMENDED** |
| Delete them | ~2 h | Removes the predefined-heightmap templates, a real fork feature the app's terrain tooling uses. Unnecessary — nothing here is NC or copyleft | Refused |

### §6.5 · The page paintings — 23 files, 7,413,151 B, UNKNOWN

| Option | Cost | Consequence | Verdict |
|---|---|---|---|
| **Establish origin from the marketing masters and the owner's own records** | **~1 hour of the owner's time** | The owner very likely knows. Cohort A predates the reference library, so the answer is not in the repo — but it may be trivially in hand. **This is the cheapest possible resolution and it needs the owner, not an engineer** | **DO FIRST** |
| Regenerate cohort A the way cohort B was made | ~1 day + generation cost | Produces a documented replacement with C2PA-bearing masters, retiring the silence entirely. Display-only assets, so no engine impact | Strong fallback |
| Ship as-is with the origin unrecorded | 0 | Leaves 7.4 MB of publicly-served imagery the estate cannot account for. Acceptable only if the owner *knows* and simply has not written it down | Owner's call |

### §6.6 · The rest

- **Social icons (5 files):** these are third-party **trademarks** (Meta, X, Pinterest, Reddit,
  Discord), which is a different question from copyright. The fork links to social pages that
  are Azgaar's, not ours. **Delete them** — ~10 minutes, no in-app effect.
- **The journey-leg videos:** the re-encode stripped their C2PA. If the estate wants to be able
  to prove its own AI-disclosure posture, re-attaching provenance is ~2 hours. Not a licence
  issue.
- **`public/third-party-notices.html` returns HTTP 404 in production.** Whatever else is
  decided, the compliance page must actually be served, and the guard must learn to check the
  deployment rather than only the two files in the tree. ~2 hours including the guard.
- **The `map.settlementforge.com` subdomain is NXDOMAIN** while the notices document and
  `vercel.json` both describe the fork as served from it. Reconcile the documented origin with
  the live one.

### §6.7 · The recommended package

| Act | Cost | Removes |
|---|---|---|
| Delete `public/map/charges/` + `public/map/images/textures/` | ~2 h | 361 files, **14,740,423 B**, and 53% of the legal surface |
| Correct the three font statements; rename modified Lora | ~5 h | The only defect inside a sold artifact |
| Add the heightmap attribution block | ~2 h | A whole group's obligation |
| Serve the notices page; teach the guard about assets | ~2 h | The undischarged-in-production gap |
| Delete the social-icon trademarks and the dead 3.17 MB texture | ~0.5 h | Trademark surface plus payload |
| Owner states the origin of the 23 cohort-A paintings | ~1 h owner time | The last UNKNOWN |

**Roughly a day and a half of engineering, one hour of owner time, and no cash** — and the
payload drops by about 8.4% as a side effect.


---

## §7 · THE DEADLINE, TESTED

### §7.1 · The charter's claim

> The last responsible moment to start the provenance audit is before the ONE trailing OSR mint
> (G1) … If it finds an asset that is drawn into settlement output — a texture composited into
> a map, a charge rendered into a dossier — then replacing it changes what the engine draws,
> and that is a same-seed shift arriving after the one regen. The tail cannot absorb it.

The reasoning is valid. **Its premise is false for every finding this audit actually made.**

### §7.2 · Testing the premise

The premise requires that some at-risk asset be inside the deterministic derivation the
Promise binds. Measured:

- `buildTownMapDrawList` emits five closed vector ops (`townMapDraw.js:62-71`); the SVG adapter
  ends `default: return ''` and the PDF adapter ends `default: return null`; `src/pdf/` imports
  no react-pdf `Image`. **No raster or external reference can enter an estate-authored export.**
- The textures and charges live entirely inside the FMG iframe, with both layers **off by
  default**. The application never fetches either.
- The heightmaps are a generation input whose pixels are discarded.
- The page paintings are CSS backgrounds.
- The fonts affect PDF bytes, and **there is no PDF byte golden** —
  `tests/pdf/fullDocByteRender.test.js` is a smoke test whose stated job is "to red a future
  change that produces a settlement shape the renderer can't paginate", not a byte pin.

**Therefore no remedy in §6 produces a same-seed shift, and none of them forces a second
regeneration.** The one-regen constraint does not bind this work. **The charter's date is
wrong, and it is wrong in the safe direction — it is earlier than it needed to be.**

### §7.3 · What actually binds

Three constraints replace the one that failed.

**(1) The landing slot, not the regen.** Every remedy edits shipped files, and the notices
remedies edit two files under a strict agreement guard
(`tests/build/thirdPartyNoticesPage.test.js` derives the inventory from the Markdown and
requires every row on the HTML twin). That is a build car and build cars need a landing slot.
The deadline is **the last landing slot**, which is *later* than the charter's G1 but still
inside the tail.

**(2) The font remedy is the widest car.** A Lora rename touches `src/pdf/theme.js`, the app
CSS, the TTF/WOFF2 filenames and name tables, four PDF test shims
(`fullDocByteRender:26`, `notableNpcsByteRender:31`, `fullPdf.render:72`,
`exoticUnicodeRender:30`), `fontsAndMeta.test.js:62-63,97-98`,
`organicSamples.test.js:34-37`, `thirdPartyNoticesPage.test.js:369`, `public/fonts/OFL.txt`,
`THIRD-PARTY-NOTICES.md` and `public/third-party-notices.html`. Wide, mechanical, and
output-moving only in the sense that PDF bytes change with no golden to re-record. It wants
more slack than the others, but it is not regen-bound.

**(3) The real long pole is counsel, and the schedule currently puts counsel too late.**
The 179 non-commercial charges and the OFL clause 3 question are legal calls, and
`docs/DESIGN_IP_PROTECTION.md` §4 schedules the "IP-2c counsel brief" at **row 10, in parallel
with push**. That is after the last landing slot. Counsel's answer is an *input* to the remedy,
not a record of it, so a brief that arrives alongside the push cannot change anything.

> **THE TRUE DEADLINE: counsel's turnaround time, subtracted from the last landing slot.**
> That is the only quantity here the estate does not control, and it is longer than every
> engineering task in this program combined.

### §7.4 · A second clock the charter did not see

`docs/DESIGN_IP_PROTECTION.md` is a four-programme IP volume — and it runs **entirely
outbound**. Measured: `provenance` **0**, `texture` **0**, `artwork` **0**, `third-party` **0**,
`scrub` **0**. It protects the estate's own IP with sourcemap guards, static watermarks,
server-enforced paid surfaces and cloud worlds. **There is no inbound programme at all.** The
V5 / cull / IP-scrub step at the end of the tail is the only place inbound exposure was ever
going to be looked at, and it has nothing behind it but the push.

### §7.5 · The answer

**Confirm the charter's instinct; correct its reasoning and its date.**

- The audit did have a real clock, and starting it now was right.
- It is **not** gated by the one regen — nothing found is output-moving.
- It **is** gated by counsel turnaround before the last landing slot, and the IP volume
  currently schedules counsel after that point. **That mis-scheduling is the finding**, and it
  is cheaper to fix today than any asset.
- The cheap deletions (§6.7) need no legal input at all and can land immediately. Doing them
  first shrinks what counsel has to rule on to two questions: the OFL clause 3 posture on Lora,
  and whether past distribution of the NC charges needs any remedial step beyond stopping.


---

## §8 · THE LEDGER

### §8.1 · Judgment calls made in this lane, each vetoable by one word

**JUDGMENT 1** — chose the **build tip `7af8c3d08`** as the measurement base over the ledger
branch `review-fixes-2026-07-08` (`a8b052cee`), because the ledger branch is an ancient
divergence (merge-base `4a9b6cf4b`) missing `public/fonts/OFL.txt` and
`public/third-party-notices.html`, and it is not the deploy line. Reversal: re-run
`git ls-tree -r -l <ref> -- public/`. Say "veto" to flip it.

**JUDGMENT 2** — classified the AI-generated marketing media as **DOCUMENTED** even though the
decisive C2PA evidence lives outside the repository, because the repo's own
`marketing/assets/README.md` points at that location by absolute path, making it part of the
estate's record rather than an outside inference. Rejected: calling it UNKNOWN, which would
have overstated the gap by 8 MB. Say "veto" to flip it.

**JUDGMENT 3** — reported the Mars/Mercury textures as **UNKNOWN** rather than "probably Solar
System Scope", despite an exact 2048×1024 dimensional match and correct subject matter,
because a dimension plus a subject is not provenance. The one download that would settle it was
not performed. Say "veto" to flip it.

**JUDGMENT 4** — recommended **deletion** over attribution for the charges and textures. Anchored
to the owner's stated fix philosophy (bold architecture over patches) and to the charter's own
option (a). Rejected: attribute-and-keep, which is unavailable for the 179 NC files anyway.
**This is a recommendation only — the act itself is owner-gated (deleting shipped data, and a
paid-surface-adjacent legal posture) and nothing was deleted.** Say "veto" to flip it.

### §8.2 · Corrections to the AD compile

1. `charge` appears **2** times in `THIRD-PARTY-NOTICES.md`, not 3.
2. Two shipped roots were unnamed: `public/evolution/` (837,563 B) and `public/textures/`
   (6,019 B).
3. The compile's central inference — "we have not checked, and nobody knows" — is **superseded**
   for the charges: upstream documented it all along, inside the files.
4. The compile booked the fonts "covered and clean". They are the one group inside the sold
   artifact and their notice is wrong.
5. The compile's `landing-maps` provenance was "almost certainly estate-generated … an
   inference". It is now **machine-provable**.

### §8.3 · Corrections to my own earlier working

- My first pass reported "RFN in name table: **false**" for Lora from a crude UTF-16 decode of
  the whole file. The proper name-table parse shows **RFN present**. The corrected reading
  stands; the first is withdrawn.
- I initially suspected the CSS-hidden emblems layer would populate and survive serialisation.
  The layer is not enabled by the default preset, so it does not populate. The mechanism
  remains true and is recorded as a latent seam, not a live exposure.

### §8.4 · Instruments that lied, this session

- **`grep` on this machine is `ugrep`.** A sufficiently complex pattern fails with
  "exceeds complexity limits" and prints an error where a careless reader sees zero matches.
  Two of my bundle censuses were re-run with node string counting as a result. **New for the
  standing checklist.**
- `grep -c` reports an empty count on binary; `grep -ac` was used throughout, and the hazard
  reproduced live on `realm-journey.mp4` (`-ac` returns 1, bare `-c` prints nothing).
- A template-literal path (`./charges/${t}.svg`) defeats a `charges/[A-Za-z0-9_.-]+` pattern —
  the character after the slash is `$`. That false zero would have wrongly declared the charge
  library dead code, and it was caught only by a literal-prefix re-run.
- "aster" matches `master`, `disaster`, `raster`, `faster`, `monastery` — 843 hits, all noise.

### §8.5 · Positive controls, listed so every negative is auditable

| Negative claimed | Control that fires |
|---|---|
| No art terms in `THIRD-PARTY-NOTICES.md` | same `grep -aci`: `public/map` 10, `public/fonts` 6, `OFL` 6, `Azgaar` 3, `MIT` 140 |
| No test references `map/charges` or `map/images/textures` | same node scan finds **9** files referencing `map/libs` |
| `VENDOR-MANIFEST.json` covers no art | same parse reports 140 `libs` entries, extensions `js`+`css` |
| No rights metadata on the 23 heightmap PNGs | purpose-built chunk parser extracted `tEXt[Copyright]`, `[Software]`, `[Author]`, `zTXt[Comment]`, `iTXt[XMP]`, `eXIf` verbatim from a synthetic control PNG |
| No EXIF author on the 55 paintings | same extractor printed `EXIF Artist = CONTROL ARTIST Jane Painter` etc. from a synthetic control, and surfaced real credits on `evolution/*.jpg` |
| No texture reaches the sold PDF | same grep family finds `/fonts/` in `src/pdf/theme.js:98`, which does |
| No licence text under `map/images/` | same recursive grep finds `Permission is hereby granted` in `LICENSE-FMG.txt` and `creativecommons.org` in 324 charge files |
| FMG native exporters not bridged | `sf-bridge.js` demonstrably calls other FMG globals (`window.zoomTo:971`, `window.regenerateMap:1288`) |
| 177 of 179 NC charges carry no author | same scan finds `author=` in **147** charges overall |

### §8.6 · Open questions, single-sourced claims, and what would change the conclusion

**Unverified / single-sourced:**
- The Mars and Mercury textures' identity. **The decisive test** is one download of Solar
  System Scope's 2K Mars and Mercury maps and a hash comparison against `mars-big.jpg` /
  `mercury-big.jpg`. If they match, the fix is a credit line (CC BY 4.0, commercial permitted).
- The three 1460×900 Earth-observation textures (`spain`, `iran`, `mauritania`) matched no
  published collection. Genuinely unidentified.
- The 18 paper/marble/plaster/wood textures: metadata stripped, upstream silent, no match found.
- Whether cohort-A paintings were AI-generated. **Likely, unevidenced, not asserted.**
- The browser half of "SVG-in-`<img>` blocks external subresources" is spec behaviour, not
  executed here. It is redundant to the conclusion because the texture layer is off by default.
- Production observations are a single moment (2026-08-24) from one vantage point.

**Deliberately not covered — documented, not bugs to re-find:**
- I did not run the test suite or the gate. This lane is read-only and evidence-gathering.
- I did not download any third-party asset for hash comparison (approval-gated).
- I did not assess the vendor terms of service for Google AI / Higgsfield / BytePlus ModelArk
  as they bear on commercial use of generated output. **That is a real gap and a separate
  question** — the estate ships 63 MB of AI-generated video and 8 MB of AI-generated stills,
  and whose terms govern their commercial use was not examined.
- Copyrightability of AI-generated output (whether the estate can assert rights in its own
  paintings and videos) is an *asset* question, not an infringement question, and was out of
  scope. It interacts with the existing `ip-exposure-measured-2026-08-07` conclusion that the
  corpus is the moat.
- TinyMCE (§254.5.5, §295) and the nine notice-less libraries (§1.5) are pre-existing docketed
  items and were not re-opened.

**What would most change the conclusion:** counsel taking the view that publicly serving an NC
asset from a commercial domain, without it entering a sold artifact, is not a commercial use.
That would downgrade the charges from urgent to housekeeping. My reading is that it is a
commercial use, but **that is exactly the call the owner and counsel own, not this lane.**

**Weakest link in my own reasoning:** the claim that deleting the two directories has zero
in-app effect. It rests on the default preset, the absence of any in-app fetch, and a zero-hit
test scan — three independent lines, but none of them is a running application.


---

*Assembled 2026-08-24T04:50:44Z from 11 parts by AD1-assemble.sh.*
