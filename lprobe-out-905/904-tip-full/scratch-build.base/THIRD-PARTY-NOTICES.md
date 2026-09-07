# Third-party notices

SettlementForge distributes third-party software. This file is the inventory of
what we ship, who holds the copyright in it, and under which terms it reaches
you. It is the authoritative copy; `public/third-party-notices.html` renders the
same content as a served page at `/third-party-notices.html`.

**Verified:** 2026-08-21, against the build branch `claude/composite-r4` at
`2cdb87fa`. Every licence identifier below was read out of the artefact in this
repository — a file header, a bundled licence file, a package's own
`package.json`, or a font's embedded name table. None was taken on trust from an
upstream project page, and none was invented. The two production-dependency
elections in §3.3 were added later, on 2026-08-22 at `19b799ce`, and the
packages they name were re-read at that commit rather than carried over from the
verification above.

**What this covers.** Four populations of third-party code and data reach a
browser from our origins:

1. the vendored Fantasy Map Generator fork under `public/map/`, served from
   `map.settlementforge.com/map/*`, together with the libraries vendored inside
   it (§1) **and the art bundled inside that fork (§1.7)**;
2. the web fonts under `public/fonts/`, served from the app origin (§2);
3. the application's own production dependency tree, whose modules the Vite
   build may include in the shipped bundle (§3);
4. the art and media served from the app origin — page paintings, videos,
   exhibit plates and generated textures (§6).

The fourth population was added on 2026-08-24. Populations 1 and 4 had never
been inventoried: §1.1 booked the whole of the vendored map as MIT, which
covers Azgaar's software and not art bundled with it, and art served from the
app origin was outside the stated scope entirely. Correcting that removed two
directories from the payload; §1.7 records what and why.

**What this does not cover.** Development-only tooling (test runners, linters,
build plugins) is not distributed and is out of scope. The Deno edge functions
under `supabase/functions/` execute server-side and convey nothing to a browser;
their imports are tracked separately in `deno.lock`.

**What this does not decide.** Section 1.4 reports TinyMCE exactly as it ships
today. The disposition of that component is an open owner and counsel matter
recorded in the decision queue at §254.5.5 and §295; this page reports the
present state and settles nothing about it.

---

## 1. The vendored map (`public/map/`)

`public/map/` is a fork of Azgaar's Fantasy Map Generator. The application
embeds it in an iframe on the Realm surface, and it is deployed as static files
to `map.settlementforge.com`, where the apex and www hosts redirect `/map/*`.

### 1.1 Fantasy Map Generator

| Component | Version | Licence | Copyright holder |
|---|---|---|---|
| Fantasy Map Generator (forked) | fork revision `sfdrop16` | MIT, with an added derivative-works clause | Max Haniyeu (Azgaar) |

The notice we serve is `/map/LICENSE-FMG.txt`, reproduced here in full:

```
MIT License

Copyright 2017-2024 Max Haniyeu (Azgaar), azgaar.fmg@yandex.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

You can produce, without restrictions, any derivative works from the original
software and even reap commercial benefits from the sale of the secondary product.
The derivates include created maps, map images, screenshots, videos, and other materials.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

The two paragraphs beginning "You can produce, without restrictions" are not
part of the standard MIT text. They are the upstream project's own widening of
the grant, and they are quoted above so a reader can see the licence we actually
received rather than a template.

**A third-party-within-third-party note.** The upstream project's road builder
computes an Urquhart graph, and that utility carries an upstream provenance
comment showing it was copied in from an Observable notebook rather than
authored by the project. The permissive top-level grant above does not reach
code the project itself copied in from elsewhere, so the provenance of that
utility is a separate open question, docketed at §253.2. In our tree the routine
survives inside the fork's built bundle
(`public/map/index-Bp79q281.js`, as `calculateUrquhartEdges`); minification has
stripped the comment, so the provenance is recorded here rather than in the
shipped bytes. We have adopted none of that code into the application: our own
generators are written from scratch.

**Code adopted from the fork into the application (W-CAP, 2026-08-29).** The
sentence above — "we have adopted none of that code" — was true of the Urquhart
utility and remains true of it, but it is no longer true of the fork as a whole,
so the exception is recorded here rather than left to contradict the paragraph
above it. The FMG grant quoted above is MIT and reaches these adoptions; they are
noted because §1.8 of the integration program requires every substantive copy to
be named in this file in the same landing act, not because their licence is in
doubt.

| Adopted into | What was taken | Upstream site (fork) |
|---|---|---|
| `src/domain/spatial/spatialCost.js` | the navigable-river flux threshold (100) and the river-width saturation constants (`FLUX_FACTOR` 500, `MAX_FLUX_WIDTH` 1) the great-river shoulder is derived from | the burg-type classifier (`cells.r[i] && cells.fl[i] >= 100`) and the river renderer's `getOffset` |
| `src/domain/spatial/spatialDigest.js` | the climate band cuts: the glacier temperature (−5 °C), the hot-desert predicate (≥25 °C with moisture <8), the moisture-band-0 edge (5), and the temperate/taiga knee the mild band uses | `Biomes.getId` and its `biomesMatrix` |
| `src/domain/spatial/waterBodies.js` | the lake water budget **in substance**: the surface-elevation delta (0.1), the shoreline-median temperature rule, the shoreline precipitation sum, the Penman-shaped evaporation line, the frozen cut (−3 °C) and the dry ratio (×4) | `Lakes.getHeight`, `defineClimateData`, and the lake branch of `defineGroups` |

Two clarifications the table cannot carry. First, the evaporation line is the
only one of these that is a formula rather than a threshold, and it is
reimplemented rather than pasted — same arithmetic, our own naming, with FMG's
`heightExponent` DOM input replaced by an explicit parameter. Second, we
deliberately did **not** adopt FMG's `salt` lake group: its rule tests whether a
river flows *out* of the lake, and our captured pack cannot distinguish an inlet
from an outlet, so emitting that verdict would assert something the inputs do not
support. `waterBodies.js` records that refusal at its head.

### 1.2 Libraries vendored inside the fork (`public/map/libs/`)

Twenty files plus the TinyMCE subtree. Every one is pinned by name, size and
SHA-256 in `public/map/libs/VENDOR-MANIFEST.json`; the version column repeats
what the artefact itself declares, and reads "not declared" where the file
carries no version string. The notice column records the licence evidence
present in **our** copy of the file, which is the copy a browser receives.

| File | Version | Licence | Notice carried in our copy |
|---|---|---|---|
| `alea.min.js` | not declared | MIT, and BSD for the derivative | "©2010 Johannes Baagøe, MIT license; Derivative ©2017-2020 W. Mac McMeans, BSD license." |
| `d3.min.js` | 5.8.0 | ISC upstream | Header names the project and "Copyright 2019 Mike Bostock"; no licence word in our copy |
| `delaunator.min.js` | not declared | ISC upstream | None — see §1.5 |
| `dropbox-sdk.min.js` | not declared | MIT upstream | None — see §1.5 |
| `flatqueue.js` | not declared | ISC upstream | None — see §1.5 |
| `indexedDB.js` | not declared | not determinable from our copy | None — see §1.5 |
| `jquery-3.1.1.min.js` | 3.1.1 | MIT | "jQuery v3.1.1 \| (c) jQuery Foundation \| jquery.org/license" |
| `jquery-ui.css` | 1.12.1 | MIT | "Copyright jQuery Foundation and other contributors; Licensed MIT" |
| `jquery-ui.min.js` | 1.12.1 | MIT upstream | None — see §1.5 |
| `jquery.ui.touch-punch.min.js` | 0.2.3 | **MIT or GPL-2.0, at our election — see §1.3** | "Copyright 2011-2014, Dave Furfero / Dual licensed under the MIT or GPL Version 2 licenses." |
| `jszip.min.js` | 3.6.0 | **MIT or GPL-3.0, at our election — see §1.3** | "(c) 2009-2016 Stuart Knightley / Dual licenced under the MIT license or GPLv3." |
| `loopsubdivison.min.js` | not declared | MIT | "@license MIT - Copyright (c) 2022 Stephens Nunnally" |
| `mapControls.min.js` | not declared | MIT upstream (a three.js example) | None — see §1.5 |
| `objexporter.min.js` | not declared | MIT upstream (a three.js example) | None — see §1.5 |
| `openwidget.min.js` | not declared | not determinable from our copy | None — see §1.6 |
| `orbitControls.min.js` | not declared | MIT upstream (a three.js example) | None — see §1.5 |
| `polylabel.min.js` | not declared | ISC upstream | None — see §1.5 |
| `rgbquant.min.js` | not declared | MIT | "© 2015, Leon Sorokin, MIT" |
| `simplify.js` | not declared | BSD-2-Clause upstream | "(c) 2017, Vladimir Agafonkin"; no licence word in our copy |
| `three.min.js` | r140 | MIT | "@license Copyright 2010-2022 Three.js Authors  SPDX-License-Identifier: MIT" |
| `tinymce/**` (123 files) | 7.1.0 | **GPL-2.0-or-later — see §1.4** | `tinymce/license.md`, reproduced in §1.4 |

### 1.3 The two dual-licence elections

Two vendored libraries are offered under a choice of terms. **We elect the MIT
licence for both.** The elections are recorded here so a recipient knows which
grant we distribute under, and so the question is settled on the record rather
than left to inference:

| Component | Offered under | **Our election** |
|---|---|---|
| JSZip 3.6.0 (`jszip.min.js`) | the MIT licence **or** GPL-3.0 | **MIT** |
| jQuery UI Touch Punch 0.2.3 (`jquery.ui.touch-punch.min.js`) | the MIT licence **or** GPL-2.0 | **MIT** |

Under those elections the terms are the MIT terms reproduced in §4.1, and the
copyright notices are those in the table above: "(c) 2009-2016 Stuart
Knightley" for JSZip, and "Copyright 2011-2014, Dave Furfero" for Touch Punch.

### 1.4 TinyMCE, as it ships today

This section states what is served. It settles nothing.

| Component | Version | Licence | Copyright holder |
|---|---|---|---|
| TinyMCE (`public/map/libs/tinymce/`, 123 files) | 7.1.0 | GNU General Public Licence version 2 or later | Ephox Corporation DBA Tiny Technologies, Inc. |

The licence file we serve at `/map/libs/tinymce/license.md` reads, in full:

```
# Software License Agreement

**TinyMCE** – [<https://github.com/tinymce/tinymce>](https://github.com/tinymce/tinymce)
Copyright (c) 2024, Ephox Corporation DBA Tiny Technologies, Inc.

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html).
```

The facts, each read from this tree:

- The 123 files are served as static assets from the map origin, and we have
  never modified them: the subtree entered this repository in a single commit on
  24 April 2026 and no commit has touched it since. Every shippable file in it
  is pinned by SHA-256 in `public/map/libs/VENDOR-MANIFEST.json`, and the build
  gate compares those pins against the bytes on disk.
- The map fork's notes editor loads TinyMCE from that local copy, not from any
  remote host, and its initialisation call sets `license_key: "gpl"` — the
  editor's own switch for GPL-mode use.
- What we distribute is the minified build plus the licence text above. We ship
  no corresponding source and no written offer for it.

Whether that is sufficient, and what should change, is an owner and counsel
question open at §254.5.5 and §295. This page does not answer it.

### 1.5 Libraries we distribute without a notice

Nine of the vendored files carry no copyright or licence text at all in our
copy: `delaunator.min.js`, `dropbox-sdk.min.js`, `flatqueue.js`,
`indexedDB.js`, `jquery-ui.min.js`, `mapControls.min.js`, `objexporter.min.js`,
`orbitControls.min.js` and `polylabel.min.js`. Upstream each is permissive, and
the licence column in §1.2 records that upstream position; but the artefact we
serve carries nothing, so a recipient of our bytes alone receives no notice.
Recording that gap here is the interim measure. Restoring the per-file headers,
or shipping the upstream licence files alongside them, is tracked work.

### 1.6 openwidget

`public/map/libs/openwidget.min.js` (829 bytes) is an upstream chat-widget
loader that arrived with the fork. It carries no licence text. It also carries a
hard-coded `organizationId` that appears nowhere else in this repository; the
fork patch that disabled it records that the identifier is the upstream
author's, so any chat opened through it would route to him rather than to us. On
this branch the only reference to the file sits below an unconditional `return;`
added by that patch, and the map origin's content-security policy names no
third-party script host, so the widget does not load. The file is nevertheless
still served, which is why it is listed. Removing it is tracked work.

### 1.7 Art bundled inside the fork

The fork ships images as well as code, and until 2026-08-24 this document said
nothing about any of them — §1.1 booked the whole of `public/map/` as MIT, and
the MIT grant reaches Azgaar's software, not the provenance of art he bundled
from elsewhere. The principle was already stated in §1.1's note about a
copied-in graph utility: the permissive top-level grant does not reach material
the project itself copied in from elsewhere. It is applied here too.

**Heightmaps (`public/map/heightmaps/`, 23 PNG + 1 text file, 1,224,885 bytes) —
attribution owed, and given below.** The directory documents its own method. Its
24th file, `import-rules.txt`, records that these are renders from the Tangrams
Heightmapper (`https://tangrams.github.io/heightmapper`) with auto-exposure off
and the elevation range set to −500…2000 m. That tool's elevation source is
Mapzen/Tilezen Terrain Tiles, which are a composite of many public elevation
datasets. The composite carries no share-alike and no non-commercial term, and
commercial use is permitted throughout — but several constituents require
attribution, and one of them terminates automatically if it is not given. The
credit is therefore:

> Elevation renders in `public/map/heightmaps/` were produced with the Tangrams
> Heightmapper over Mapzen/Tilezen Terrain Tiles, and are **modified** — rendered
> to greyscale at a fixed −500…2000 m exposure and rescaled. Terrain Tiles are
> assembled from, among others: ETOPO1 (NOAA, US public domain); GMTED2010,
> SRTM and 3DEP (USGS, US public domain); **EU-DEM, produced using Copernicus
> data and information funded by the European Union**; **© Kartverket**
> (Norway, CC BY 4.0); **UK Environment Agency LIDAR, © Environment Agency
> copyright and/or database right, Open Government Licence v3.0**; **Land
> Information New Zealand (CC BY 3.0 NZ)**; **© Commonwealth of Australia
> (Geoscience Australia), CC BY 4.0**; **data.gv.at (CC BY 3.0 AT)**; **Canadian
> Digital Elevation Model, © Department of Natural Resources Canada, Open
> Government Licence – Canada**; INEGI (Mexico); and ArcticDEM.

Which dataset contributed to which image depends on the render zoom, which the
PNGs do not record, so the credit is given for the composite rather than
per-file. The extents most likely to touch the attribution-mandatory sources are
`europe.png`, `europe-north.png`, `iceland.png`, `britain.png` and
`greenland.png`; the list above should not be pruned on the assumption that it is
all US public domain. Neither we nor upstream previously carried this credit.

**A surgical removal on 2026-08-24, recorded here so neither what went nor what
stayed is silent.** The first pass deleted both directories wholesale; the licence
census then showed that would have thrown away 104 clean files, so the removal was
narrowed to exactly the material the product cannot lawfully carry.

| Removed | Files | Bytes | Why |
|---|---|---|---|
| `public/map/charges/` — 234 of 338 | 234 | 2,814,361 | **179 declared CC BY-NC-SA 3.0, a non-commercial licence.** 37 more CC BY-SA 2.5/3.0/4.0, 10 GFDL 1.3 and 1 Free Art Licence are share-alike copyleft, which a proprietary product cannot honour. 4 declared CC BY but the credit had never been carried. 1 carried the literal placeholder `licenseDescURL`, and 2 (`arbalest.svg`, `plaice.svg`) declared nothing at all — unlabelled is unknown, and unknown is not permission |
| `public/map/images/textures/` — all 23 | 23 | 11,646,263 | Metadata stripped; provenance recorded nowhere upstream or here. The terms of the likeliest origin forbid redistribution in a texture pack, modified or not, with no attribution cure |

**Kept, and stated positively: the 104 CC0 charges.** Every surviving file in
`public/map/charges/` carries `license="https://creativecommons.org/publicdomain/zero/1.0"`
in its own `<metadata>` element — a public-domain dedication with no attribution
requirement and no restriction on commercial use or redistribution. 72 name Azgaar,
the fork's own author, as the author; 30 come from `commons.wikimedia.org`, one from
`en.wikipedia.org` and one from `freesvg.org`. They are named here because a
compliance document should say what it is entitled to ship, not only what it removed.
`tests/lint/shippedAssetLicence.test.js` holds that line: it refuses any charge whose
declared licence is anything other than CC0.

**Replacing the textures with our own.** `public/map/images/textures/` now contains two
estate-authored tiles, `paper-grain-light.png` and `paper-grain-dim.png`, copied from
`public/textures/` where `scripts/gen-paper-grain.mjs` bakes them from a fixed seed.
The fork's twelve style presets, its layer default in `modules/io/load.js` and its
texture dropdown were all repointed at them.

**And the fork was patched so it stops asking for what it no longer has.** Deleting art
is only safe if nothing still requests it. The emblem generator picks from a weighted
table inside its hashed bundle: measured against the surviving 104 charges, the
unpatched table made **22,285 of 40,000 draws** request a file that is not there. The
fork swallows that failure — `fetchCharge` catches, logs, and returns nothing, so an
emblem renders silently incomplete rather than visibly broken. The table was pruned to
the charges that ship, and the three categories it emptied (`beastHeads`, `birds`,
`fishes`) had their selection weight set to zero so the generator cannot draw an empty
category. After the patch, 40,000 draws request an absent file zero times.

**Art still bundled in the fork whose origin the record does not state.** Listed
because an honest inventory names its own gaps:

| Files | Bytes | What the record says |
|---|---|---|
| `images/Discord.png`, `Facebook.png`, `Pinterest.png`, `Reddit.png`, `Twitter.png` | 2,518 | **Nothing.** These reproduce third-party marks, which is a trademark question distinct from copyright. They came with the fork and link to the upstream author's own social pages, not ours. Removing them is tracked work |
| `images/pattern1.png` … `pattern6.png`, `images/kiwiroo.png` | 34,980 | **Nothing.** No embedded metadata, no upstream statement |
| `images/preview.png`, `images/icons/*` | 290,255 | Rendered output of the generator itself, which the fork's own derivative-works clause covers. Inferred from the imagery, not stated upstream |

---

## 2. Fonts (`public/fonts/`)

Two font families are served from the app origin and are also embedded in
exported PDFs. Both are SIL Open Font Licence families; the copyright strings
below were read out of each file's own embedded name table.

| Family | Faces shipped | Licence | Copyright, verbatim from the font |
|---|---|---|---|
| Lora | Regular, Italic, Bold, Bold Italic (TTF and WOFF2) | SIL Open Font License 1.1 | `Copyright 2011 The Lora Project Authors (https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora".` |
| Nunito | Regular, Italic, Bold, Extra Bold (TTF and WOFF2) | SIL Open Font License 1.1 | `Copyright 2014 The Nunito Project Authors (https://github.com/googlefonts/nunito)` |

The Nunito faces name their licence URL in the font itself
(`https://scripts.sil.org/OFL`); the Lora faces carry the copyright with the
Reserved Font Name wording but no licence URL field.

**Both families are shipped MODIFIED, and until 2026-08-24 this section said the
opposite.** The correction, and what it does and does not settle:

- **What was changed.** Both families were re-cut in June 2026 to remove the
  `liga` ligature feature, because the `fi`/`fl`/`ff` ligature glyphs rendered as
  tofu in the exported PDF. Lora in `df9c94d27` (2026-06-07), Nunito in
  `cf9cfd3af` (2026-06-07). `src/pdf/theme.js` has said so in a code comment since
  that day. Read out of the binaries themselves: `Lora-Regular.ttf` went from
  132,188 to 129,336 bytes and its GSUB feature list from
  `calt ccmp frac liga locl pnum tnum` to `calt ccmp frac locl`;
  `Nunito-Regular.ttf` went from 125,528 to 125,460 bytes and lost `liga`
  likewise. Glyph outlines were preserved; only the feature was dropped.
- **What that makes them.** The SIL Open Font License defines a Modified Version
  as any derivative made by "adding to, deleting, or substituting — in part or in
  whole — any of the components of the Original Version". Deleting a GSUB feature
  is deleting a component, so both families as we ship them are Modified Versions.
- **The Lora Reserved Font Name is an open question, docketed.** `Lora-Regular.ttf`
  declares `Reserved Font Name "Lora"` in its copyright field and still presents
  the primary family name `Lora`, both in its own name table and in
  `Font.register({ family: 'Lora' })`. Clause 3 of the licence restricts use of a
  Reserved Font Name on a Modified Version. Renaming the modified faces is the
  route the licence itself provides, and it has not been done. This section states
  the position rather than resolving it; the disposition is an owner and counsel
  matter.
- **Nunito is not affected by clause 3.** It declares no Reserved Font Name, so
  only the accuracy of the "unmodified" statement was wrong there.
- **One further consequence of the re-cut, recorded for completeness.** The Lora
  faces carried `https://scripts.sil.org/OFL` in name ID 14 before the re-cut and
  do not carry it now. The licence text still reaches every recipient through
  `public/fonts/OFL.txt`, served beside the fonts, so nothing is withheld; but the
  reason Lora has "no licence URL field" is that our own re-cut dropped it, not
  that upstream omitted it.

| File | What it is | State |
|---|---|---|
| `public/fonts/OFL.txt` | the notice file served alongside the fonts: both families' copyright and Reserved Font Name lines, read out of the TTF name tables, followed by the verbatim body of the SIL Open Font License 1.1 | **complete — copyright notices and licence body both present** |

**The Open Font Licence asks that its text accompany the fonts, and it does.**
`public/fonts/OFL.txt` carries both families' copyright notices and Reserved
Font Name declarations, read out of the TTF name tables, and then the verbatim
body of the licence, so a recipient of the fonts receives the terms with them.
The body is reproduced from the `OFL.txt` that Google Fonts distributes with
these two families: the copy shipped with Lora and the copy shipped with Nunito
are byte-identical below their FAQ-pointer line, differing only in the scheme of
that pointer, and the https form is the one kept. No part of it was written from
memory — the font binaries themselves carry none of it, every face having an
empty `name` ID 13, the License Description field.

---

## 3. The application's production dependencies

The table below is the complete production dependency tree of the application
package: every entry in `package-lock.json` not marked development-only, at the
exact version the lock file pins, with the licence identifier and copyright line
read from the installed package itself. A given build includes the subset of
these modules that the bundler reaches, so this list is a superset of any one
bundle.

Direct dependencies are `@react-pdf/renderer`, `@supabase/supabase-js`,
`dompurify`, `immer`, `jspdf`, `lucide-react`, `react`, `react-dom`,
`seedrandom`, `three` and `zustand`. Four rows are marked "nested under" a
parent: those are second copies of a package installed beneath a dependency that
needs a different version, and each is listed at its own version.

### 3.1 Licences in play

| Licence | Packages |
|---|---|
| MIT | 95 |
| ISC | 5 |
| MIT and Zlib (combined) | 2 |
| Apache-2.0 | 1 |
| MPL-2.0 or Apache-2.0 — Apache-2.0 elected (see §3.3) | 1 |
| MIT or an alternative offered by the author — MIT elected (see §3.3) | 1 |
| 0BSD | 1 |
| No identifier in `package.json` (see the note under the table) | 1 |

`png-js` states no `license` field in its `package.json`, but ships a `LICENSE`
file carrying the MIT text and "Copyright (c) 2017 Devon Govett". We treat it as
MIT on the strength of the file it distributes.

### 3.2 The inventory

| Package | Version | Licence | Copyright |
|---|---|---|---|
| `@babel/runtime` | 7.29.2 | MIT | Copyright (c) 2014-present Sebastian McKenzie and other contributors |
| `@noble/ciphers` | 1.3.0 | MIT | Copyright (c) 2022 Paul Miller (https://paulmillr.com) |
| `@noble/hashes` | 1.8.0 | MIT | Copyright (c) 2022 Paul Miller (https://paulmillr.com) |
| `@react-pdf/fns` | 3.1.3 | MIT | not stated in the distributed package |
| `@react-pdf/font` | 4.0.8 | MIT | not stated in the distributed package |
| `@react-pdf/image` | 3.1.0 | MIT | not stated in the distributed package |
| `@react-pdf/layout` | 4.6.1 | MIT | not stated in the distributed package |
| `@react-pdf/pdfkit` | 5.1.1 | MIT | Copyright (c) 2014 Devon Govett |
| `@react-pdf/primitives` | 4.3.0 | MIT | not stated in the distributed package |
| `@react-pdf/reconciler` | 2.0.0 | MIT | not stated in the distributed package |
| `scheduler` (nested under `@react-pdf/reconciler`) | 0.25.0-rc-603e6108-20241029 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `@react-pdf/render` | 4.5.1 | MIT | not stated in the distributed package |
| `@react-pdf/renderer` | 4.5.1 | MIT | not stated in the distributed package |
| `@react-pdf/stylesheet` | 6.2.1 | MIT | not stated in the distributed package |
| `@react-pdf/svg` | 1.1.0 | MIT | not stated in the distributed package |
| `@react-pdf/textkit` | 6.3.0 | MIT | not stated in the distributed package |
| `@react-pdf/types` | 2.11.1 | MIT | not stated in the distributed package |
| `@supabase/auth-js` | 2.103.0 | MIT | Copyright (c) 2020 Supabase |
| `@supabase/functions-js` | 2.103.0 | MIT | not stated in the distributed package |
| `@supabase/phoenix` | 0.4.0 | MIT | Copyright (c) 2014 Chris McCord |
| `@supabase/postgrest-js` | 2.103.0 | MIT | not stated in the distributed package |
| `@supabase/realtime-js` | 2.103.0 | MIT | not stated in the distributed package |
| `@supabase/storage-js` | 2.103.0 | MIT | not stated in the distributed package |
| `@supabase/supabase-js` | 2.103.0 | MIT | not stated in the distributed package |
| `@swc/helpers` | 0.5.21 | Apache-2.0 | not stated in the distributed package (authored by the swc project) |
| `@types/node` | 25.6.0 | MIT | Copyright (c) Microsoft Corporation. |
| `@types/pako` | 2.0.4 | MIT | Copyright (c) Microsoft Corporation. |
| `@types/raf` | 3.4.3 | MIT | Copyright (c) Microsoft Corporation. |
| `@types/trusted-types` | 2.0.7 | MIT | Copyright (c) Microsoft Corporation. |
| `@types/ws` | 8.18.1 | MIT | Copyright (c) Microsoft Corporation. |
| `abs-svg-path` | 0.1.1 | MIT | not stated in the distributed package |
| `base64-arraybuffer` | 1.0.2 | MIT | Copyright (c) 2012 Niklas von Hertzen |
| `base64-js` | 1.5.1 | MIT | Copyright (c) 2014 Jameson Little |
| `bidi-js` | 1.0.3 | MIT | Copyright (c) 2021 Jason Johnston |
| `brotli` | 1.3.3 | MIT | not stated in the distributed package |
| `browserify-zlib` | 0.2.0 | MIT | Copyright (c) 2014-2015 Devon Govett <devongovett@gmail.com> |
| `pako` (nested under `browserify-zlib`) | 1.0.11 | (MIT AND Zlib) | Copyright (C) 2014-2017 by Vitaly Puzrin and Andrei Tuputcyn |
| `canvg` | 3.0.11 | MIT | Copyright (c) 2010 - present Gabe Lerner (gabelerner@gmail.com) - https://github.com/canvg/canvg |
| `clone` | 2.1.2 | MIT | Copyright © 2011-2015 Paul Vorbach <paul@vorba.ch> |
| `color-name` | 2.1.0 | MIT | Copyright (c) 2015 Dmitry Ivanov |
| `color-string` | 2.1.4 | MIT | Copyright (c) 2011 Heather Arthur <fayearthur@gmail.com> |
| `core-js` | 3.49.0 | MIT | Copyright (c) 2013–2025 Denis Pushkarev (zloirock.ru) |
| `css-line-break` | 2.1.0 | MIT | Copyright (c) 2017 Niklas von Hertzen |
| `dfa` | 1.2.0 | MIT | not stated in the distributed package |
| `dompurify` | 3.4.12 | (MPL-2.0 OR Apache-2.0) — **Apache-2.0 at our election, see §3.3** | not stated in the distributed package |
| `emoji-regex-xs` | 1.0.0 | MIT | Copyright (c) 2024 Steven Levithan |
| `events` | 3.3.0 | MIT | Copyright Joyent, Inc. and other Node contributors. |
| `fast-deep-equal` | 3.1.3 | MIT | Copyright (c) 2017 Evgeny Poberezkin |
| `fast-png` | 6.4.0 | MIT | Copyright (c) 2015 Michaël Zasso |
| `fflate` | 0.8.2 | MIT | Copyright (c) 2023 Arjun Barrett |
| `fontkit` | 2.0.4 | MIT | not stated in a licence file; package author Devon Govett |
| `hsl-to-hex` | 1.0.0 | MIT | not stated in the distributed package |
| `hsl-to-rgb-for-reals` | 1.1.1 | ISC | not stated in the distributed package |
| `html2canvas` | 1.4.1 | MIT | Copyright (c) 2012 Niklas von Hertzen |
| `hyphen` | 1.14.1 | ISC | Copyright (c) 2026, Yevhen Tiurin <yevhentiurin@gmail.com> |
| `iceberg-js` | 0.8.1 | MIT | Copyright (c) 2025 Supabase |
| `immer` | 11.1.4 | MIT | Copyright (c) 2017 Michel Weststrate |
| `inherits` | 2.0.4 | ISC | Copyright (c) Isaac Z. Schlueter |
| `iobuffer` | 5.4.0 | MIT | Copyright (c) 2015 Michaël Zasso |
| `is-url` | 1.2.4 | MIT | not stated in the distributed package |
| `jay-peg` | 1.1.1 | MIT | Copyright (c) 2024 Diego Muracciole <diegomuracciole@gmail.com> |
| `js-md5` | 0.8.3 | MIT | Copyright 2014-2023 Chen, Yi-Cyuan |
| `js-tokens` | 4.0.0 | MIT | Copyright (c) 2014, 2015, 2016, 2017, 2018 Simon Lydell |
| `jspdf` | 4.2.1 | MIT | Copyright (c) 2010-2025 James Hall, https://github.com/MrRio/jsPDF |
| `linebreak` | 1.1.0 | MIT | Copyright (c) 2014-present Devon Govett |
| `base64-js` (nested under `linebreak`) | 0.0.8 | MIT | Copyright (c) 2014 |
| `loose-envify` | 1.4.0 | MIT | Copyright (c) 2015 Andres Suarez <zertosh@gmail.com> |
| `lucide-react` | 0.383.0 | ISC | Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022. |
| `media-engine` | 1.0.3 | MIT | not stated in the distributed package |
| `normalize-svg-path` | 1.1.0 | MIT | Copyright © 2008-2013 Dmitry Baranovskiy (http://raphaeljs.com) |
| `object-assign` | 4.1.1 | MIT | Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com) |
| `pako` | 2.1.0 | (MIT AND Zlib) | Copyright (C) 2014-2017 by Vitaly Puzrin and Andrei Tuputcyn |
| `parse-svg-path` | 0.1.2 | MIT | Copyright (c) 2013 Jake Rosoman <jkroso@gmail.com> |
| `performance-now` | 2.1.0 | MIT | Copyright (c) 2017 Braveg1rl |
| `png-js` | 2.0.0 | UNSTATED | Copyright (c) 2017 Devon Govett |
| `postcss-value-parser` | 4.2.0 | MIT | Copyright (c) Bogdan Chadkin <trysound@yandex.ru> |
| `prop-types` | 15.8.1 | MIT | Copyright (c) 2013-present, Facebook, Inc. |
| `queue` | 6.0.2 | MIT | Copyright (c) 2014 Jesse Tane <jesse.tane@gmail.com> |
| `raf` | 3.4.1 | MIT | Copyright 2013 Chris Dickinson <chris@neversaw.us> |
| `react` | 19.2.5 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `react-dom` | 19.2.5 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `react-is` | 16.13.1 | MIT | Copyright (c) Facebook, Inc. and its affiliates. |
| `regenerator-runtime` | 0.13.11 | MIT | Copyright (c) 2014-present, Facebook, Inc. |
| `require-from-string` | 2.0.2 | MIT | Copyright (c) Vsevolod Strukchinsky <floatdrop@gmail.com> (github.com/floatdrop) |
| `restructure` | 3.0.2 | MIT | Copyright (c) 2015-present Devon Govett |
| `rgbcolor` | 1.0.1 | MIT OR SEE LICENSE IN FEEL-FREE.md — **MIT at our election, see §3.3** | Copyright (c) 2016 Stoyan Stefanov, http://phpied.com/ |
| `safe-buffer` | 5.2.1 | MIT | Copyright (c) Feross Aboukhadijeh |
| `scheduler` | 0.27.0 | MIT | Copyright (c) Meta Platforms, Inc. and affiliates. |
| `seedrandom` | 3.0.5 | MIT | Copyright 2019 David Bau. |
| `stackblur-canvas` | 2.7.0 | MIT | Copyright (c) 2010 Mario Klingemann |
| `string_decoder` | 1.3.0 | MIT | Copyright Node.js contributors. All rights reserved. |
| `svg-arc-to-cubic-bezier` | 3.2.0 | ISC | Copyright (c) 2017, Colin Meinke |
| `svg-pathdata` | 6.0.3 | MIT | Copyright © 2017 Nicolas Froidure |
| `text-segmentation` | 1.0.3 | MIT | Copyright (c) 2021 Niklas von Hertzen |
| `three` | 0.185.1 | MIT | Copyright © 2010-2026 three.js authors |
| `tiny-inflate` | 1.0.3 | MIT | Copyright (c) 2015-present Devon Govett |
| `tslib` | 2.8.1 | 0BSD | Copyright (c) Microsoft Corporation. |
| `undici-types` | 7.19.2 | MIT | Copyright (c) Matteo Collina and Undici contributors |
| `unicode-properties` | 1.4.1 | MIT | Copyright 2018 |
| `unicode-trie` | 2.0.0 | MIT | Copyright 2018 |
| `pako` (nested under `unicode-trie`) | 0.2.9 | MIT | Copyright (C) 2014-2016 by Vitaly Puzrin |
| `util-deprecate` | 1.0.2 | MIT | Copyright (c) 2014 Nathan Rajlich <nathan@tootallnate.net> |
| `utrie` | 1.0.2 | MIT | Copyright (c) 2021 Niklas von Hertzen |
| `vite-compatible-readable-stream` | 3.6.1 | MIT | Copyright Node.js contributors. All rights reserved. |
| `ws` | 8.21.0 | MIT | Copyright (c) 2011 Einar Otto Stangvik <einaros@gmail.com> |
| `yoga-layout` | 3.2.1 | MIT | not stated in the distributed package |
| `zustand` | 5.0.12 | MIT | Copyright (c) 2019 Paul Henschel |

### 3.3 The two production-dependency elections

Two production packages are offered under a choice of terms, and both choices
are now recorded. **We elect Apache-2.0 for `dompurify` and the MIT licence for
`rgbcolor`.** The elections are recorded here so a recipient knows which grant
we distribute under, and so the question is settled on the record rather than
left to inference:

| Package | Version | Offered under | **Our election** |
|---|---|---|---|
| `dompurify` | 3.4.12 | the Mozilla Public Licence 2.0 **or** Apache-2.0 (it ships both `LICENSE` and `LICENSE-MPL`) | **Apache-2.0** |
| `rgbcolor` | 1.0.1 | the MIT licence **or** the alternative terms in the package's own `FEEL-FREE.md` | **MIT** |

The two rows in §1.3 were the earlier half of the same question, and these two
follow the same standard: where a permissive option is offered beside a
copyleft or bespoke one, the permissive option is the one we take. The
disposition is the project owner's, taken on the record; nothing here was
decided quietly.

Under those elections:

- **`dompurify` reaches you under Apache-2.0.** The package ships the full
  Apache-2.0 text as its own `LICENSE`, and ships the Mozilla Public Licence 2.0
  text as `LICENSE-MPL`. Both files travel inside the package unchanged, so the
  option we did not take is still visible to anyone who receives it. See §4.4.
- **`rgbcolor` reaches you under the MIT licence.** The package ships its own
  `LICENSE.md`, which carries the MIT terms above the copyright line in the
  table in §3.2 and then names the choice in its own words; the terms are the
  MIT terms reproduced in §4.1, which that file's body matches. The alternative
  it offers, `FEEL-FREE.md`, is not the grant we rely on. `rgbcolor` reaches the
  tree only as an optional dependency of `canvg` under `jspdf`.

Every licence identifier and licence body named in this section was read out of
the package installed from this repository's lock file. We use `dompurify`
unmodified, and we redistribute both unmodified.

---

## 4. Licence texts

Where a licence is short and shared by many packages, its text is reproduced
here once and the copyright notices it applies to are the ones listed in the
tables above. Where a licence is long, the package's own copy travels inside the
package.

### 4.1 The MIT licence

Reproduced verbatim from `node_modules/react/LICENSE`, less its copyright line —
the copyright lines this text applies to are the ones in the tables above.

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 4.2 The ISC licence

Reproduced verbatim from `node_modules/inherits/LICENSE`, less its copyright
line.

```
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

### 4.3 The 0BSD licence

Reproduced verbatim from `node_modules/tslib/LICENSE.txt`, less its copyright
line. It applies to `tslib`, copyright Microsoft Corporation.

```
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

### 4.4 The longer licences

- **GNU General Public Licence version 2 or later** applies to TinyMCE (§1.4).
  The notice we serve is `/map/libs/tinymce/license.md`, reproduced in §1.4; it
  points at `http://www.gnu.org/licenses/gpl.html` for the licence text.
- **Apache-2.0** applies to `@swc/helpers`, and to `dompurify` under the
  election recorded in §3.3. Each package ships the full text as its own
  `LICENSE`.
- **Mozilla Public Licence 2.0** is the `dompurify` option we did not elect;
  that package ships the full text as `LICENSE-MPL`, and it travels with the
  package unchanged so a recipient can see the option we passed over.
- **SIL Open Font License 1.1** applies to the Lora and Nunito families (§2).
  The Nunito faces carry `https://scripts.sil.org/OFL` in their own metadata,
  and `public/fonts/OFL.txt` is served alongside the fonts — carrying their
  copyright notices and the verbatim body of the licence (§2).
- **Zlib**, combined with MIT, applies to `pako`; the package ships both texts.

---

## 5. Keeping this current

This file is maintained by hand, like the status page. When a dependency is
added, removed or upgraded, or when anything under `public/map/libs/`,
`public/fonts/`, or any shipped art directory changes, this file and
`public/third-party-notices.html` are updated together in the same change.
`tests/lint/shippedAssetLicence.test.js` walks every shipped asset directory and
refuses a file whose own embedded metadata declares a non-commercial or
share-alike licence, so the §1.7 class cannot re-enter the payload unnoticed;
what it cannot see is art that carries no metadata at all, which is why the
unattributed rows in §1.7 and §6 are written down rather than machine-checked.
`tests/build/thirdPartyNoticesPage.test.js` holds the two in agreement and
checks that the entries that matter most are still named, so the surface cannot
rot silently. It cannot tell whether a new dependency was added without a row,
which is a matter of habit rather than of automation.

---

## 6. Art and media served from the app origin

This section was added on 2026-08-24. Until then this document's scope sentence
named three populations of third-party material, all of them code, and the art
the product serves was outside it by construction. Most of that art is the
estate's own, but "most" is not an inventory, so here is the inventory —
including the part of it we cannot account for.

| Group | Files | Bytes | Origin | What states it |
|---|---|---|---|---|
| `landing-maps/**` | 80 | 68,558,483 | **ours** — procedurally generated | built by `scripts/generate-k*.mjs` and `scripts/generate-landing-map-plates.mjs` from in-repo kernels, with double-build byte-identity asserted |
| `videos/realm-journey.mp4` | 1 | 20,715,193 | **AI-generated**, BytePlus ModelArk `dreamina-seedance-2-0` | a C2PA manifest signed by Byteplus Pte. Ltd. is intact in the shipped file |
| `media/journey-legs/**` | 13 | 44,601,456 | **AI-generated**, same upstream, then re-encoded with ffmpeg | the commit trail; the re-encode **stripped the C2PA**, so the shipped bytes no longer carry it |
| `backgrounds/**` — the documented cohort | 32 | 8,014,616 | **AI-generated** via Google AI through Higgsfield | the out-of-repo masters carry `photoshop:Credit="Made with Google AI"`, an IPTC digital-source-type of trained algorithmic media, and a Google-signed C2PA manifest. **The shipped web-optimised JPEGs carry none of that** — the optimiser stripped it |
| `backgrounds/**` — **the undocumented cohort** | 17 + 6 `.orig.jpg` | **7,413,151** | **UNKNOWN** | **Nothing.** They entered on 2026-06-05 with no statement in the commit, no embedded metadata, and no notice. `public/BACKGROUND.md` documents which page shows which painting and says nothing about where any of them came from |
| `evolution/*.jpg` | 6 | 837,563 | **AI-generated** | five of the six carry a Google credit string in the file itself; `village.jpg` carries none |
| `textures/paper-grain-*.png` | 2 | 6,019 | **ours** — seeded generator | `scripts/gen-paper-grain.mjs`, deterministic noise |
| `public/` root — icons, OG images, sitemap, robots, and the status and notices pages | 12 | 213,273 | **ours** | `scripts/gen-organic-logo.mjs` (byte-goldened) for the imagery; the rest is authored here |

**The gap this section exists to state plainly.** 7,413,151 bytes of page
paintings are served publicly from a commercial origin and the estate cannot say
where they came from. They are display-only: no raster reaches a generated PDF,
and nothing in this group enters a paid artifact. But display-only is not the
same as accounted-for, and this document should not imply otherwise. Establishing
their origin needs the owner's own records rather than an engineer's search, and
that is where the question sits.

**A second gap, named because it is ours.** For the AI-generated groups, this
section records the generating vendor. Whether those vendors' terms of service
permit commercial use of the output, and whether the estate can assert rights in
it, are separate questions this document does not answer and no lane has yet
examined.

---

## 7. AI-generated media

Some of the imagery this application serves was generated by an AI model. This
section says which, and by what, because a reader should not have to guess and
because no licence in this document compels the answer.

**The growth film and the journey legs.** `public/videos/realm-journey.mp4`,
the six `public/media/journey-legs/bg/leg-*.mp4` clips and the still frames cut
from them were generated on 18 July 2026 through Higgsfield's service, using
the `seedance_2_0` video model, which runs on BytePlus ModelArk's
`dreamina-seedance-2-0`. The stills are frame grabs of those clips.

**The page paintings and the tier plates.** The paintings behind the per-view
backdrops in `public/backgrounds/` and the six plates in `public/evolution/`
were generated on the same day through the same service, using a Google image
model. Ten of the source plates carry a Higgsfield job identifier and no Google
attribution; which model produced those ten is not established, and this
section does not claim one.

**Not all of it, and we say so.** Several paintings in `public/backgrounds/`
predate that work and their origin is not recorded. They are listed in
`scripts/ai-media-provenance.json` with the origin `unrecorded`, and nothing
here asserts a generator for them.

**Provenance markings.** These generators embed machine-readable credentials in
their output — a C2PA Content Credentials manifest, an IPTC
`DigitalSourceType` tag and a `Made with Google AI` credit. An image
optimisation pass in July 2026 re-encoded most of the shipped derivatives and
removed those markings without intending to. The pipelines now preserve
metadata, and `scripts/ai-media-provenance.json` records file by file what is
carried today. **A C2PA manifest is cryptographically signed and binds to the
exact bytes it was issued for**, so a resized copy cannot carry a valid one,
whatever the copy is derived from. Where a credit is put back it is a credit;
this project will not describe it as a restored manifest.

This section states what was generated and how. It settles nothing about
authorship, and it claims no ownership the generators' own terms decline to
grant.

Corrections and questions: `support@settlementforge.com`.
