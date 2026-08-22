# Third-party notices

SettlementForge distributes third-party software. This file is the inventory of
what we ship, who holds the copyright in it, and under which terms it reaches
you. It is the authoritative copy; `public/third-party-notices.html` renders the
same content as a served page at `/third-party-notices.html`.

**Verified:** 2026-08-21, against the build branch `claude/composite-r4` at
`2cdb87fa`. Every licence identifier below was read out of the artefact in this
repository — a file header, a bundled licence file, a package's own
`package.json`, or a font's embedded name table. None was taken on trust from an
upstream project page, and none was invented.

**What this covers.** Three populations of third-party code and data reach a
browser from our origins:

1. the vendored Fantasy Map Generator fork under `public/map/`, served from
   `map.settlementforge.com/map/*`, together with the libraries vendored inside
   it (§1);
2. the web fonts under `public/fonts/`, served from the app origin (§2);
3. the application's own production dependency tree, whose modules the Vite
   build may include in the shipped bundle (§3).

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

- The 123 files are byte-identical to the upstream distribution and are served
  as static assets from the map origin.
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
hard-coded `organizationId` belonging to the upstream author's account, not
ours. On this branch the only reference to it sits below an unconditional
`return;` added by a fork patch, and the map origin's script policy permits
scripts only from our own origin, so the widget does not load. The file is
nevertheless still served, which is why it is listed. Removing it is tracked
work.

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
Reserved Font Name wording but no licence URL field. Neither family currently
ships a licence file next to it under `public/fonts/`. Adding one is tracked
work; this notice is the interim record.

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
| MPL-2.0 or Apache-2.0 (see §3.3) | 1 |
| MIT or an alternative offered by the author (see §3.3) | 1 |
| 0BSD | 1 |
| No identifier in `package.json` (see the note under the table) | 1 |

`png-js` states no `license` field in its `package.json`, but ships a `LICENSE`
file carrying the MIT text and "Copyright (c) 2017 Devon Govett". We treat it as
MIT on the strength of the file it distributes.

### 3.2 The inventory

| Package | Version | Licence | Copyright |
|---|---|---|---|
