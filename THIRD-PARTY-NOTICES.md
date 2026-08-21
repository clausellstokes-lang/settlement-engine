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
Reserved Font Name wording but no licence URL field. Both families are shipped
unmodified: neither is renamed, and no Reserved Font Name is used on a
derivative.

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
| `dompurify` | 3.4.12 | (MPL-2.0 OR Apache-2.0) | not stated in the distributed package |
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
| `rgbcolor` | 1.0.1 | MIT OR SEE LICENSE IN FEEL-FREE.md | Copyright (c) 2016 Stoyan Stefanov, http://phpied.com/ |
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

### 3.3 Dual-licensed packages with no election recorded

Two production packages offer a choice of terms and no choice has been recorded:

| Package | Version | Offered under | Status |
|---|---|---|---|
| `dompurify` | 3.4.12 | the Mozilla Public Licence 2.0 **or** Apache-2.0 (it ships both `LICENSE` and `LICENSE-MPL`) | no election recorded |
| `rgbcolor` | 1.0.1 | the MIT licence **or** the alternative terms in the package's own `FEEL-FREE.md` | no election recorded; reaches the tree only as an optional dependency of `canvg` under `jspdf` |

Unlike the two map libraries in §1.3, these were not part of the licence review
that produced this file, and electing on either is a decision for the project
owner rather than a note to be added quietly here. Both are listed so the
question is visible. We use `dompurify` unmodified, and we redistribute both
unmodified.

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
- **Apache-2.0** applies to `@swc/helpers`, and is one of the two options for
  `dompurify` (§3.3). Each package ships the full text as its own `LICENSE`.
- **Mozilla Public Licence 2.0** is the other `dompurify` option; that package
  ships the full text as `LICENSE-MPL`.
- **SIL Open Font License 1.1** applies to the Lora and Nunito families (§2).
  The Nunito faces carry `https://scripts.sil.org/OFL` in their own metadata,
  and `public/fonts/OFL.txt` is served alongside the fonts — carrying their
  copyright notices and the verbatim body of the licence (§2).
- **Zlib**, combined with MIT, applies to `pako`; the package ships both texts.

---

## 5. Keeping this current

This file is maintained by hand, like the status page. When a dependency is
added, removed or upgraded, or when anything under `public/map/libs/` or
`public/fonts/` changes, this file and `public/third-party-notices.html` are
updated together in the same change.
`tests/build/thirdPartyNoticesPage.test.js` holds the two in agreement and
checks that the entries that matter most are still named, so the surface cannot
rot silently. It cannot tell whether a new dependency was added without a row,
which is a matter of habit rather than of automation.

Corrections and questions: `support@settlementforge.com`.
