
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
  The Nunito faces carry `https://scripts.sil.org/OFL` in their own metadata.
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
