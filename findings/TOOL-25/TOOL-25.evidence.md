# TOOL-25 — EVIDENCE (measured before any edit; no tracked file was edited)

Lane worktree `$SP/lane-tool-25`, branch `tool-25-nul-walker-2026-09-20`, cut at
**`578272a99`** (the composed, refrozen tip). `git status --short` empty throughout.
Stamps from `date` in the measuring call: first measurement **Sun Sep 20 13:00:22 EDT 2026**.

**GOLDENS, before the first read and unchanged after (nothing was edited):**

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

---

## 1. THE INSTRUMENT'S ACTUAL SCOPE (the CORRECTION AT DISPATCH, re-measured)

`tests/lint/controlBytes.test.js` (155 lines, read whole):

| Property | Measured value |
|---|---|
| Roots | `const SCAN_DIRS = ['src', 'tests'];` — a **filesystem** walk (`readdirSync`/`statSync`), not `git ls-files` |
| Extensions | **ALL** — the header states "Every file is scanned regardless of extension" |
| Predicate | `isBanned = (b) => (b < 0x20 && b !== 0x09 && b !== 0x0a && b !== 0x0d) \|\| b === 0x7f` — the whole C0 class plus DEL, **not NUL alone** |
| Admissions | `BINARY_ALLOWLIST`, ONE entry: `src/domain/worldPulse/supplyCompleteness.js` (owner-parked, MASTER_MERGE_PLAN §8 item 2 / §5.4) |
| Exports | `scanBuffer(buf)`, `findControlBytes(rootDirs, root = ROOT)` — already parameterised on roots |
| Guard-the-guard | 3 arms (historical AccountPage case; the boundary-byte predicate; an end-to-end tmpdir fixture) |

⛔ **THE CHAIR'S DISPATCH HYPOTHESIS IS REFUTED IN ONE RESPECT.** The dispatch reads
"`src/lib/anonForkSalt.js` and a commit message were the two misses", implying `src/` is
outside the walked roots. **`src/` IS walked.** `src/lib/anonForkSalt.js` was squarely in
scope. FIX-P1b's NUL was missed not because of a root gap but because **that lane never ran
`tests/lint` whole** — its receipt lists only `negativeAssertionAnchor + mutationCoverageManifest
+ sizeBaseline`. This is the run-17/18/19 family exactly: a walker that governs the directory,
never run by the lane whose file it governs.

So "extend the roots" means the **1,723 tracked files outside `src/` and `tests/`**, not `src/`.

**Tracked-file census by top-level directory (`git ls-files` = 6,787):**

| Dir | Files | Walked today? |
|---|---|---|
| `tests` | 2,805 | ✅ |
| `src` | 2,259 | ✅ |
| `public` | 559 | ❌ |
| `docs` | 534 | ❌ |
| `supabase` | 346 | ❌ |
| `scripts` | 216 | ❌ |
| (root files) | 30 | ❌ |
| `e2e` 15 · `api` 6 · `mcp-server` 5 · `foundry-module` 5 · `.husky` 2 · `.github` 2 · `tools`/`schema`/`.claude` 1 each | 38 | ❌ |

**BASE IS GREEN.** The existing predicate reproduced in node over its exact current scope:

```
EXISTING SCOPE (src+tests, all extensions, minus allowlist): files=5063 bytes=70893638 ms=1513
violations: (none) — GREEN at base
```

---

## 2. THE `-P` PROOF (demanded by the brief; the NUL built with node, never a shell escape)

A throwaway git repo with three blobs — `withnul.txt` (a raw NUL), `clean.txt` (`alpha|beta`),
`escapetext.txt` (the four TEXT characters `\x00`):

```
--- byte truth ---
withnul.txt NULcount= 1
clean.txt NULcount= 0
escapetext.txt NULcount= 0
--- git grep -l -P '\x00' ---
withnul.txt
--- git grep -l -E '\x00' ---
escapetext.txt
--- git diff --numstat <empty-tree> HEAD ---
1	0	clean.txt
1	0	escapetext.txt
-	-	withnul.txt
```

⛔ **`-E` IS NOT MERELY UNDERCOUNTING — IT RETURNS THE WRONG SET.** `-E '\x00'` matched the file
containing the literal text `\x00` and **did not match the raw byte**; `-P` matched the raw byte
and only it. This is the `\s` law's sibling and is sharper: a NUL population counted with `-E`
is inverted, not short. `git version 2.39.5 (Apple Git-154)`; `-P` is available and correct here.

`numstat` against the empty tree printed `-  -` for exactly the NUL carrier — the
binary-classification arm's premise, proved on a fixture.

---

## 3. THE POPULATION (node over `git ls-files -z`; `git check-attr binary` for declarations)

```
tracked entries: 6787
declared binary (.gitattributes): 183
git-detected binary: 209
text-extension files scanned bytes: 123850883
byte-scan wall clock: 2364 ms
```

**WALL CLOCK: 2,364 ms** over 123.8 MB / the whole tracked tree — inside the brief's 5 s bar and
far inside the 15 s STOP. The existing narrower scope costs 1,513 ms. **The performance premise holds.**

### 3a. THE CLASS — git-detected binary AND a text extension AND not declared binary

| Path | ext | declaredBinary | gitBinary | disposition |
|---|---|---|---|---|
| `src/domain/worldPulse/supplyCompleteness.js` | js | false | **true** | **ALREADY ADMITTED** — the sole `BINARY_ALLOWLIST` entry, owner-parked |

**Count of UNADMITTED members of the class: ZERO.** The class's only member is the one the
instrument already exempts, and its git-binary status is a *consequence* of its NUL, not a
second defect. The 209 git-binary files are otherwise 88 png · 46 jpg · 25 webp · 25 glb ·
8 woff2 · 8 ttf · 7 mp4 · 1 ico — all genuine assets.

⚠ **25 `.glb` files are git-binary but NOT declared binary in `.gitattributes`** (which names
png/jpg/jpeg/gif/webp/ico/pdf/zip/woff/woff2/ttf/otf/eot/mp3/mp4/webm — no `glb`). They carry no
text extension so no arm reds on them, but the declaration gap is real.

### 3b. NUL BYTES over every tracked text-extension, not-declared-binary file — **THREE carriers**

| # | Path | ext | NULs | first offset | line:col | walked today? |
|---|---|---|---|---|---|---|
| 1 | `src/domain/worldPulse/supplyCompleteness.js` | js | 1 | 6520 | 158:42 | ✅ (allowlisted) |
| 2 | `scripts/prose-wave-gate.mjs` | mjs | 2 | 39627, 39637 | 753:30, 753:40 | ❌ |
| 3 | `docs/implementation/packets/settlement-editor/EM-P2.md` | md | 1 | 40219 | 333:107 | ❌ |

**All three are the same idiom — a raw NUL as a composite-key separator in a template literal:**

```
1  supplyCompleteness.js:158   const cacheKey = `${String(supplierId)}<NUL>${commodityId}`;
2  prose-wave-gate.mjs:753     const key = `${label}<NUL>${at.key}<NUL>${at.evidence}`;
3  EM-P2.md:333                seed: seed === undefined ? '<NUL>undefined' : String(seed),
```

### 3c. FULL C0 class (the instrument's actual predicate) over every tracked text-extension file

The three above, plus one more that carries **no NUL** but does carry C0 bytes:

| Path | bytes |
|---|---|
| `public/map/libs/jszip.min.js` | `0x03@24760 0x04@24761 0x01@24789 0x02@24790 0x05@24820 0x06@24821` (…) |

A **vendored minified third-party library** under `public/`. It is not NUL-bearing, so a
NUL-only tree-wide arm ignores it; the instrument's *existing* C0 predicate would red on it the
moment `public/` enters the roots. This is a scoping fork the chair must settle (see §5).

### 3d. Scope question the brief's extension list leaves open

146 tracked files carry neither a text extension from the brief's list, nor a binary declaration,
nor git-binary status:

```
ext=svg: 132   ext=snap: 1   ext=jsonl: 1   ext=toml: 1   ext=xml: 1   ext=webmanifest: 1
ext=lock: 1    ext=e2e: 1    ext=example: 1 ext=gitattributes: 1 ext=gitignore: 1
ext=npmrc: 1   ext=nvmrc: 1  ext=husky/pre-commit: 1  ext=husky/pre-push: 1
```

⚠ `.gitattributes` declares **`*.svg text eol=lf`** — 132 SVGs are *declared text* by the estate
and are excluded by the brief's extension list. "Every tracked text file" and the brief's
15-extension list disagree by 146 files. Not decided here.
