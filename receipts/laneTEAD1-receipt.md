STARTED 2026-08-24T04:17:39Z

## RESUME POINT 1 — inventory spine measured (UTC below)
- MEASUREMENT BASE = build tip `7af8c3d08` (MF-CG1b). Chain: b2852ccc3 -> d78011665 -> 5055990a3 -> 7af8c3d08.
- `git ls-tree -r -l 7af8c3d08 -- public/` => 822 files, 176,499,727 B. REPRODUCES charter figure EXACTLY. CONFIRMED.
- Ledger branch review-fixes-2026-07-08 @a8b052cee = 820 files / 176,448,334 B; missing public/fonts/OFL.txt + public/third-party-notices.html (ancient divergence, merge-base 4a9b6cf4b 08-11). NOT the deploy line.
- Top-1 roots: landing-maps 68,558,483/80; media 44,601,456/13; map 24,738,225/636; videos 20,715,193/1; backgrounds 15,427,767/55; fonts 1,401,748/17; evolution 837,563/6; (root) 213,273/12; textures 6,019/2.
- TWO ROOTS THE CHARTER DID NOT NAME: public/evolution (6 jpg, 837,563 B) and public/textures (2 png, 6,019 B).
- Outside public/: only docs/samples/** SVGs (estate-generated sample output, ~150KB). No src/assets media.
STAMP 2026-08-24T04:20:38Z

## RESUME POINT 2 — notices + machinery measured
- THIRD-PARTY-NOTICES.md @7af8c3d08: 521 lines, 30,685 B, sha256 4806233eee33112862e8217423524bc919a92e51566cb3c14d073dd13d645735.
- Term census (grep -aci): texture 0, heightmap 0, heraldr 0, artwork 0, illustration 0, painting 0, .png/.jpg/.svg/.mp4/.webp 0, CC0 0, "Creative Commons" 0, "public domain" 0, public/backgrounds 0, public/landing-maps 0, public/media 0, public/videos 0, public/textures 0, public/evolution 0.
- CORRECTION to charter: `charge` = 2 occurrences (lines 58, 435 — both MIT boilerplate "free of charge"), charter said 3. `image` = 2 (line 70 FMG clause; line 281 npm pkg @react-pdf/image). `asset` = 1 (line 167, TinyMCE static assets). `video` = 1 (line 70). Substance unchanged: NO art rows.
- POSITIVE CONTROL for the zeros: same instrument returns public/map 10, public/fonts 6, OFL 6, Azgaar 3, MIT 140. Zeros are real absences.
- Notices doc's OWN scope sentence: "Three populations of third-party code and data reach a browser" = fork code, fonts, npm. Art is out of scope BY CONSTRUCTION, not by oversight.
- ⭐ THE DOC ALREADY STATES THE GOVERNING PRINCIPLE, and applies it to ONE function only: "The permissive top-level grant above does not reach code the project itself copied in from elsewhere" (re calculateUrquhartEdges, docketed §253.2). Never applied to 11.6 MB of textures / 338 charges.
- ⭐ VENDOR-MANIFEST.json pins libs/ ONLY: 140 entries, extensions js+css only; grep for charges/textures/heightmaps/.svg/.png/.jpg = 0 each. validate-map-fork.mjs walks public/map/ but ONLY inspects `extname === '.js'` (line 19). => 385 art files in the fork (338 charges + 23 textures + 24 heightmaps) have ZERO integrity or inventory machinery.
- tests/build/thirdPartyNoticesPage.test.js: two-file agreement guard (MD + public/third-party-notices.html). Its own CANNOT-CATCH list admits "A DEPENDENCY ADDED WITHOUT A ROW ... neither reads package-lock.json". Same blindness applies to assets.
- ⭐ "THE PAGE SHIPS DARK, BY DESIGN. Nothing in src/ links to it ... the darkness itself is pinned." Attribution obligations are not presented to any user.
- dist reachability: vite.config.js has NO publicDir override, no .vercelignore, no dist pruning => Vite default copies public/ verbatim. ALL 822 files / 176,499,727 B ship. Plus /map/* separately deployed to map.settlementforge.com (notices §1).
- vercel.json /map/ CSP frame-src allows https://watabou.github.io and https://deorum.vercel.app — the fork iframes THIRD-PARTY generators. Separate surface, flag it.
STAMP 2026-08-24T04:26:26Z

## RESUME POINT 3 — ⭐⭐ HEADLINE FOUND: the charges are self-documenting and 53% are NON-COMMERCIAL
Every charge SVG carries `<metadata source="..." license="..."/>`. Measured over all 338 at 7af8c3d08:
  336 carry `license=`; 264 carry `source=`; 2 carry NO metadata at all.
LICENCE CENSUS (arithmetic closes to 338):
  179  CC BY-NC-SA 3.0   <-- NON-COMMERCIAL. 173 wappenwiki.org + 5 www.wappenwiki.org + 1 commons.wikimedia.org
  104  CC0 1.0           <-- safe. 72 no-source + 30 commons + 1 freesvg.org + 1 en.wikipedia.org
   21  CC BY-SA 3.0      <-- copyleft (incl. 1 trailing-slash spelling). 17 commons + 2 vikinganswerlady.com + 2 upload.wikimedia
   15  CC BY-SA 4.0      <-- copyleft. 12 commons + 3 upload.wikimedia
   10  GFDL 1.3          <-- copyleft. commons
    1  CC BY-SA 2.5      <-- copyleft. commons
    1  Free Art Licence  <-- copyleft. commons
    2  CC BY 4.0         <-- attribution only. commons
    2  CC BY 1.0         <-- attribution only. commons
    1  license="licenseDescURL" (an Armoria TEMPLATE file with a literal placeholder)
    2  NONE  (arbalest.svg, plaice.svg)
 => 179 NC (53%) + 48 share-alike/copyleft + 4 attribution-only + 3 unknown = 234 of 338 (69%) are NOT freely usable in a paid proprietary product.
 => THIRD-PARTY-NOTICES.md mentions NONE of this (heraldr 0, charge = MIT boilerplate only).
MECHANISM: the fork bundle does `fetchCharge(t){ return fetch(`./charges/${t}.svg`).then(r=>r.text()) }` — the charge SVG SOURCE IS INLINED into the map DOM, so charge geometry survives XMLSerializer.
EXPORT LANE CONFIRMED: public/map/sf-bridge.js `settlementEngine:exportThumb` clones `#map`, serializes, rasterizes via canvas.toDataURL('image/jpeg',0.82); src/lib/realmMapExport.js `renderRealmMapPngBlob` composites the overlay and calls downloadBlob (imported from ./townMapExport.js) => a USER-DOWNLOADED PNG. ODQ 524 makes export PAID.
TEXTURES: public/map/index.html lines 941-970 = a 26-option texture dropdown, values `./images/textures/*.jpg`, DEFAULT `marble-big.jpg` (selected). Two options point at files NOT in the tree (stone-small.jpg, stone-big.jpg) and one at soiled-paper-vertical.JPG while the tree has .PNG.
HEIGHTMAPS: bundle does `const c=new Image; c.src=`./heightmaps/${n}.png`` -> canvas -> terrain seed. Generation-input shape.
STAMP 2026-08-24T04:32:15Z

## RESUME POINT 4 — the four export postures, traced
INSTRUMENT HAZARD DISCOVERED: `grep` on this machine is **ugrep**; a complex pattern fails with
"exceeds complexity limits" and prints an ERROR, and a careless reader takes it for zero matches.
All bundle censuses below were re-run with node string counting, not grep.
1. ESTATE EXPORT LANE (live today): src/lib/realmMapExport.js renderRealmMapPngBlob -> bridge.exportThumb(1024)
   -> public/map/sf-bridge.js clones #map, XMLSerializer -> data:image/svg+xml -> new Image() -> canvas
   -> toDataURL('image/jpeg',0.82) -> composite overlay -> downloadBlob. USER-DOWNLOADED PNG. ODQ 524 = PAID.
   * The embedded-mode hiding is document-level CSS (`body.sf-embedded #emblems{display:none}`) in document.head.
     `cloneNode(true)` on #map copies ONLY the SVG subtree; the serialized standalone SVG carries neither the
     `body.sf-embedded` context nor the stylesheet. => every CSS-hidden layer REAPPEARS in the serialized copy
     if its DOM is populated. #emblems and #burgEmblems are hidden ONLY by that CSS. NAMED EXPERIMENT REQUIRED.
   * External `<image href="./images/...">` does NOT load when SVG is rendered via data: URL in an <img>
     (secure static mode) => texture pixels do NOT reach the estate's PNG today. (PLAUSIBLE-class, browser-behaviour.)
2. THE FORK'S OWN NATIVE EXPORTER — public/map/modules/io/export.js DELIBERATELY BASE64-INLINES THE ART:
     line 262 "// replace ocean pattern href to base64" -> getBase64(href, b => image.setAttribute("href", b))
     line 276 "// replace texture href to base64"      -> same, on `#texture > image`
   That is EMBEDDING, by design, so the exported file is self-contained. src/lib/realmMapExport.js records that
   these native exporters are "NOT wired through the bridge — bridging them is a recorded seam."
   => TEXTURE EXPOSURE IS LATENT TODAY AND GOES LIVE THE MOMENT THAT SEAM IS BRIDGED (MAP-EXPORTS).
3. THE STANDALONE FORK IS PUBLICLY SERVED. vercel.json redirects /map/:path* -> map.settlementforge.com/map/:path*.
   The full FMG UI ships (texture dropdown index.html:941-970, export menu, options container) — #optionsContainer
   is hidden only under body.sf-embedded. So a member of the public can export a self-contained SVG/PNG with the
   textures base64-embedded, FROM OUR ORIGIN, TODAY, with no bridging needed.
4. HEIGHTMAPS: `new Image(); c.src='./heightmaps/'+n+'.png'` -> canvas -> terrain seed = GENERATION-INPUT.
   No heightmap pixel survives into output; the derived TERRAIN SHAPE does (weaker derivative-work question).
LAYER GATING: layers.js:187 `if (layerIsOn("toggleTexture")) drawTexture();` — texture is layer-gated, and
#texture is NOT in sf-bridge's embedded hide list (lines 174-195), unlike #emblems/#burgEmblems.
STAMP 2026-08-24T04:35:06Z

## RESUME POINT 5 — ⭐⭐ SECOND HEADLINE: the fonts in the SOLD PDF are MODIFIED and three notices say otherwise
THE ONLY third-party binary embedded in the $2.99 dossier PDF is the font set (src/pdf/theme.js:90-118;
src/utils/pdfRender.worker.js:23-26). src/pdf/ imports no react-pdf `Image` at all.
EVIDENCE THE FONTS ARE MODIFIED (all CONFIRMED, executed this session):
  - git df9c94d27 (2026-06-07) "Fix dossier rendering: F-artifact (font root-fix)": all 4 Lora TTFs re-cut,
    e.g. Lora-Regular.ttf Bin 132188 -> 129336, Lora-Bold 132124 -> 129280.
  - git cf9cfd3af (2026-06-07) "PDF: strip Nunito ligatures": all 4 Nunito TTFs re-cut, e.g. 125528 -> 125460.
  - src/pdf/theme.js:92-96 "The Lora files were re-cut to drop the broken fi/fl/ff ligature glyphs".
  - src/pdf/theme.js:107-111 "These files were re-cut to drop the ligature features (glyphs preserved 1:1)".
  - Binary check: GSUB feature tags now locl/calt/ccmp/frac with NO `liga` in either family.
NAME TABLE, parsed properly (my first crude utf16 decode was WRONG and said RFN=false; corrected):
  Lora-Regular / Lora-Bold  ID0 = 'Copyright 2011 The Lora Project Authors (...), with Reserved Font Name "Lora".'
                            ID1 family = "Lora"   => RFN DECLARED and still the primary font name.
  Nunito-Regular            ID0 = 'Copyright 2014 The Nunito Project Authors (...)'  => NO RFN declared.
  Both: ID13 (License Description) EMPTY; Nunito ID14 = https://scripts.sil.org/OFL, Lora ID14 empty.
THE GOVERNING TEXT, from the estate's OWN served public/fonts/OFL.txt:
  :94-97  '"Modified Version" refers to any derivative made by adding to, deleting, or substituting -- in part
           or in whole -- any of the components of the Original Version...'
  clause 3 'No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written
           permission is granted by the corresponding Copyright Holder. This restriction only applies to the
           primary font name as presented to the users.'
THE THREE FALSE STATEMENTS IN THE TREE:
  THIRD-PARTY-NOTICES.md:219-220 "Both families are shipped unmodified: neither is renamed, and no Reserved
                                  Font Name is used on a derivative."
  THIRD-PARTY-NOTICES.md:418     "unmodified, and we redistribute both unmodified."
  public/fonts/OFL.txt:10-11     "The fonts themselves are unmodified. Neither family is renamed, and no
                                  Reserved Font Name is used on a derivative."
=> LORA: Modified Version retaining the Reserved Font Name as primary family => OFL 1.1 clause 3 exposure,
   inside the artifact we SELL. NUNITO: modified but no RFN => only the notices statement is false.
   The notices doc's own opening claims every identifier "was read out of the artefact ... None was taken on
   trust" — the modification status was not.
LEG D CROSS-CHECK (verified by me independently): buildTownMapDrawList op vocabulary is 5 closed vector ops
  (poly/line/circle/rect/path, src/domain/townMap/townMapDraw.js:62-71); SVG adapter default:return '',
  PDF adapter default:return null. No raster can enter an estate-authored export.
MITIGATION VERIFIED: public/map/modules/ui/layers.js getDefaultPresets().political (the index.html:466 default,
  `selected`) contains NEITHER toggleTexture NOR toggleEmblems. So charges+textures are OFF by default in-app.
  BUT index.html offers an "emblems" preset option, and modules/ui/hotkeys.js maps X->toggleTexture,
  Y->toggleEmblems with no sf-bridge suppression. Off by default, one keystroke away.
STAMP 2026-08-24T04:37:01Z

## RESUME POINT 6 — removability + deadline inputs measured
- NO test or script references `map/charges` or `map/images/textures`. Node scan over all tests/**+scripts/**
  .js/.jsx/.json/.mjs => 0 hits. POSITIVE CONTROL: 9 files reference `map/libs`. So the fork art is unguarded
  AND removable without reddening anything. `validate:map` = validate-map-fork.mjs (parse-checks .js only,
  hashes libs/ only). tests/security/mapForkSinkInventory.json: charges 0, images/textures 0, heightmaps 0.
- NO PDF byte golden. tests/pdf/fullDocByteRender.test.js is a SMOKE test ("its job is to red a future change
  that produces a settlement shape the renderer can't paginate"), not a byte pin.
- A FONT RENAME remedy would touch: src/pdf/theme.js, the app CSS font-family, the ttf/woff2 filenames,
  4 PDF test shims (fullDocByteRender:26, notableNpcsByteRender:31, fullPdf.render:72, exoticUnicodeRender:30),
  tests/build/fontsAndMeta.test.js:62-63,97-98, tests/design/organicSamples.test.js:34-37,
  tests/build/thirdPartyNoticesPage.test.js:369 (which pins the exact Lora RFN string verbatim),
  public/fonts/OFL.txt, THIRD-PARTY-NOTICES.md, public/third-party-notices.html. Wide, but NOT same-seed.
- LEG C RESULT FOLDED: backgrounds split into cohort B (32 files, AI via Google/Higgsfield, C2PA-signed,
  DOCUMENTED outside the repo) and cohort A (17 files, 5,021,216 B) + 6 *.orig.jpg (2,391,935 B) = 7,413,151 B
  GENUINELY UNRECORDED. Videos = BytePlus ModelArk dreamina-seedance-2-0, C2PA intact on realm-journey.mp4,
  STRIPPED on the six re-encoded journey legs. landing-maps + public/textures = estate-generated, machine-provable.
- STILL PENDING: leg A (FMG upstream textures+charges licence research), leg B (heightmaps).
STAMP 2026-08-24T04:39:06Z

## RESUME POINT 7 — ⭐⭐ PRODUCTION VERIFIED BY MY OWN FETCH (2026-08-24)
  /third-party-notices.html              HTTP 404   (the compliance page DOES NOT EXIST in the deployed build)
  /map/heightmaps/world.png              HTTP 200   58,307 B  == repo byte size
  /map/LICENSE-FMG.txt                   HTTP 200   1,353 B
  /map/charges/oak.svg                   HTTP 200   70,238 B  == repo byte size
  /map/images/textures/marble-big.jpg    HTTP 200   548,407 B == repo byte size
  map.settlementforge.com                NXDOMAIN   (the fork is served from the APEX, not the documented subdomain)
BYTE-IDENTITY PROOF for the NC charge: live sha256 == repo sha256 ==
  2f77575b30f5d335edeaf6ca87999530067f55f73a56ecc793b96a55bea23878
and the LIVE file's own metadata reads license="https://creativecommons.org/licenses/by-nc-sa/3.0".
=> The exposure is LIVE TODAY, not prospective.
LEG B RESULT FOLDED: heightmaps are DOCUMENTED by public/map/heightmaps/import-rules.txt (Tangrams
  Heightmapper -> Mapzen/Nextzen Terrain Tiles = Tilezen, a composite of 13 DEMs). 22 of 23 byte-identical to
  Azgaar upstream. No copyleft, no NC, but MANDATORY attribution for EU-DEM/Copernicus, Kartverket (CC BY 4.0),
  LINZ, UK Environment Agency (OGL v3 — non-compliance terminates the grant automatically), Geoscience
  Australia, data.gv.at, CDEM Canada. Raster does NOT reach a sold file (downsampled, gamma-warped, quantised
  to 101 levels, discarded).
STAMP 2026-08-24T04:40:00Z

## TERMINAL — lane TE-AD-1 complete
- DELIVERABLE: $SP/draft-AD1-PROVENANCE-AUDIT.md — 950 lines, 62,944 B,
  sha256 861f785c00136902abbf04318171f01cceaff98eedad94ea837551d10ba0b506.
  Assembled from 10 parts in $SP/AD1-parts/ by $SP/AD1-assemble.sh (re-runnable, idempotent).
- FOUR LEGS all returned: A (FMG upstream), B (heightmaps), C (paintings/media), D (sold-artifact trace).
  Every leg's load-bearing NEW claim was re-verified by me first-hand before relaying:
  emblems-editor.js:502 admission, the 179/2 author count, soiled-paper-vertical unreachability,
  the font re-cut commits + name tables, the layers preset default, and the Armoria README (my own fetch).
- PROBE WORKTREE $SP/laneTEAD1-tree: created at 7af8c3d08, porcelain 0 lines at removal, removed cleanly.
  7af8c3d08 still held by laneTECG1b-tree — no orphaned tip. Disk returned to 12,441,136 KB free.
- REPO UNTOUCHED: nothing committed, nothing modified, nothing staged, no branch moved.
- MEMORY BANKED: art-provenance-audit-ad1-findings.md + ugrep-complexity-limit-prints-an-error-not-zero.md,
  both indexed in MEMORY.md under Live program hazards.
- OWNER-GATED AND NOT ACTED ON: every remedy in §6. This lane recommends; it deleted nothing.
FINISHED 2026-08-24T04:49:35Z

## ADDENDUM — sibling convergence (post-assembly)
The shared tree moved during the lane: HEAD a8b052cee -> 7ee72773c, and 120 docs/ paths are
STAGED. NONE of it is mine (0 staged under public/, 0 AD1 paths; I ran no git add and never
wrote in the checkout). Foreign WIP left untouched per shared-tree law.
The two new commits are ledger entries on THIS SAME subject from a sibling lane:
  2285cd762 §528 "the sold PDF is clean — no raster image ... the exposure is the realm PNG
            download, a public thumbnail bucket, and Ctrl+S downloading the full map file"
  7ee72773c §529 "texture forensics — FMG conveys no rights to the bundled rasters; four are
            proved CC BY and need only a credit, three Earth photos are the high risk, sixteen
            are unknown with metadata destroyed; the chair recommends wiring the estate own
            baked textures and deleting the rest"
INDEPENDENT CORROBORATION on: sold PDF raster-clean, FMG conveys no rights to bundled rasters,
delete-and-bake is the remedy. §529 is AHEAD on the four planetary textures (proved CC BY) —
this lane's UNKNOWN there is SUPERSEDED. This lane is ahead on: the 179 NC charges, the modified
fonts in the sold PDF, the production 404, and the deadline refutation.
Added as part 05-convergence.md and re-assembled.
ADDENDUM 2026-08-24T04:50:44Z
