# RECEIPT — CHAIR-904 (Opus lane; Seat: Opus 5 — Fable-unvalidated; Lane: CHAIR-904)
## STATUS: ⏳ PARTIAL — written on arrival, updated after every proof. A session can die with no notice.

Dock `$SC/laneLUIMAT`. **Arrival verified:** HEAD `c2337220a965e1eea02815c194df393c61d28e35`
(= the brief's sha), `git status --porcelain` **EMPTY (exit 0)**, detached HEAD, parent `dd5f13218`.
Brief: `$SC/briefs/brief-CHAIR-904.md`. Preamble: `$SC/briefs/_PREAMBLE.md`. Both read in full before any edit.
Acts on `$SC/receipt-l-ui-mat.md` **R1** (the L-UI-MAT lane's refusal of O-13's third flip).

THE CAR: retire the `mobileSingleChrome` flag-registry entry whose reader was deleted at `8bf493d05`.

## Premise ledger (P1–P6) — each re-derived BEFORE any edit. Two chair mechanisms are CONTRADICTED.
| # | premise | verdict | measurement |
|---|---|---|---|
| P1 | six hits in four files | ✅ **CONFIRMED, exactly** | `git grep -n mobileSingleChrome` = **6 hits / 4 files**, at the exact lines briefed (`flagRegistry.js:81,93,105` · `flags.js:73` · `UIUX_AUDIT_AND_PLAN.md:1960` · `critique-implementation-status.md:71`). `grep -rn` incl. untracked = **the same 6** ⇒ no untracked file names it. Not one is a `flag()`/`useFlag()` call. |
| P2 | the reader is gone at `8bf493d05` | ✅ **CONFIRMED, and stronger than briefed** | `8bf493d0594eeecbba7b1582114263fb95fd84d2` (Clausell Stokes III, **Mon Jun 22 2026**, `fix(nav): resolve 17 navigation-audit findings`) deletes **all three** read sites in `src/App.jsx` (`.slice(0, _readFlag('mobileSingleChrome') ? 4 : 5)` → `.slice(0, 5)`; the `&& !_readFlag(...)` header gate; the 6th auth-slot block). **TODAY `grep -c _readFlag src/App.jsx` = 0** — App.jsx has no flag reader of ANY kind. Both cited lines verified verbatim: **`:482 .slice(0, 5)`** and **`:533 {isMobile && (`** (unconditional mobile top header). |
| P3 | no roster pins the exact key count | ✅ **CONFIRMED** | `FLAG_DEFAULTS` = **39 keys** today → **38** after this car. `founderTileRestore.test.jsx:162` asserts `> 20` (margin **18**, was 19). `gameGradePromotionContract.test.js`: `grep -c mobileSingleChrome` = **0**; `PROMOTION_FLAGS` is 3 names (`settlementWorkbench`, `heraldCommandBrief`, `realmItemShadowDiagnostics`) — the chair read it right. `flags.test.js:102-110` asserts per key `typeof decl.default === 'boolean'` **and** `typeof decl.description === 'string'` + `length > 10` ⇒ **the PAIRED deletion is mandatory**; dropping either side alone reds it. |
| P4 | the OSR does not red on this file | ✅ **CONFIRMED** (my own first probe was wrong; corrected) | `src/lib/flagRegistry.js` **is** in `executionTree` (2201 entries), `scanTree` (2176) and `sourceTree` (2190) — recorded at sha256 `a8c75f1a…`, **size 8513**, i.e. the PRE-L-UI-MAT byte count, and the walker is green today at 11528. It is **absent from `detectorTree`** (11 entries, 0 src/). Mechanism read at source: `provenanceDriftOf` (`:2442`) skips the scanned half outright — `for (const entry of snapshot.sourceTree.entries) { if (scannedNow.has(entry.path)) continue; …}` — so a SCANNED source may change freely. Baseline `frozen 2026-09-06`, `frozenAtSha a7ca033a6…`, `total 1972`. |
| P5 | the soak flag census is live | ⚠️ **CONCLUSION CONFIRMED — CHAIR MECHANISM CONTRADICTED (twice)** | The brief says "`scripts/soak/flagConstraints.mjs` reads `liveCensus()`; the key simply leaves the union." Measured: `flagConstraints.mjs` contains **0** occurrences of `liveCensus` and **0** of `FLAG_DEFAULTS`. `liveCensus` is defined **in the test** (`coveringArrayCoverage.test.js:44`) over `DEFAULT_SIMULATION_RULES` / `SIMULATION_RULE_PRESETS` / `ENGINE_GATED_VIRTUAL_RULE_KEYS` — the **simulation-rules** domain (`src/domain/worldPulse/simulationRules.js`, **0** hits for `mobileSingleChrome`), NOT the UI `FLAG_DEFAULTS`. ⇒ the key **was never in the union**; it does not "leave" it. **Safer than briefed, by a different mechanism.** |
| P6 | first paint can only shrink | ✅ **CONFIRMED** (bytes below) | `flagRegistry.js` is the eager resolution core; `flags.js` is the declared LAZY sidecar (its header: descriptions "never reach the eager crash-forensics closure"). This car only DELETES from both. Byte deltas recorded after the edit. |

### ⭐ Two extra sites the brief does not name (found by a fuzzy `single[_-]?chrome` sweep, 8 hits vs the key's 6)
- `src/lib/flagRegistry.js:176` — `// Read from Vite env. Convention: VITE_FLAG_MOBILE_SINGLE_CHROME.` The env key is **derived generically** at `:179` (`'VITE_FLAG_' + name.replace(/([A-Z])/g,'_$1').toUpperCase()`), so this is an ILLUSTRATIVE example, not a binding. **Hazard checked** (index: "a flag name in a comment is minted into the denominator"): `grep -rn VITE_FLAG scripts/ tests/` = **0 hits** ⇒ no scanner mints it. Left as-is — out of the brief's four-file scope; recorded for the chair as a stale example naming a retired flag.
- `docs/UIUX_AUDIT_AND_PLAN.md:1969` — a second stale sentence describing the flag-on auth slot as live ("mobile single-chrome slot jumps straight to setView('account')"). Out of scope (brief names :1960-1961 only); recorded as a docs-corpus row.

---
## THE CAR — four files, written (diff verified before any instrument ran)
```
 docs/UIUX_AUDIT_AND_PLAN.md            |  4 ++--
 docs/critique-implementation-status.md |  2 +-
 src/lib/flagRegistry.js                | 26 ++++++++------------------
 src/lib/flags.js                       |  1 -
 4 files changed, 11 insertions(+), 22 deletions(-)
```
**Composition invariant re-measured after the edit (the P3 risk):**
`FLAG_DEFAULTS` **39 → 38** · `FLAG_DESCRIPTIONS` **39 → 38** · defaults with no description = **[]** ·
descriptions with no default = **[]** · `mobileSingleChrome` in either map = **false**.
The paired deletion held; `flags.test.js:102-110` cannot red on an orphan.

**P6 — bytes, measured (`wc -c` before/after, backups in `$SC/chair904-scratch/*.BEFORE`):**
| file | before | after | delta |
|---|---|---|---|
| `src/lib/flagRegistry.js` (EAGER core) | 11528 | 10734 | **−794 B** |
| `src/lib/flags.js` (LAZY sidecar) | 10954 | 10865 | **−89 B** |

⚠️ **Honest correction to the brief's own figure:** it predicted "~1.5 KB of comment plus one line" deleted.
The gross deletion is ~1.5 KB, but the car ADDS a 6-line retirement note back, so the NET eager shrink is
**794 B, not ~1.5 KB**. First paint can only shrink — both files are strictly smaller. No build run (the gate builds).

**Whole-tree count sweep (beyond the brief):** `grep -rn -E "FLAG_DEFAULTS\)\.length|Object\.keys\(FLAGS\)\.length|flagCount" tests scripts src`
returns **exactly one** hit in the entire repo — `founderTileRestore.test.jsx:162`, the `> 20` gate.
64 test files import `lib/flags*`; **none** pins a count. P3 is confirmed tree-wide, not just on the three named rosters.

---
## PREDICTIONS — written BEFORE the instruments ran
| instrument | prediction |
|---|---|
| `tests/lib/flags.test.js` | GREEN. Every arm loops `Object.entries(FLAGS)`; the paired deletion keeps default+description aligned. No arm names the retired key. |
| `tests/ui/founderTileRestore.test.jsx` | GREEN. `38 > 20` holds (margin 18). |
| `tests/domain/gameGradePromotionContract.test.js` | GREEN. 0 occurrences of the key; `PROMOTION_FLAGS` is 3 unrelated names. |
| `tests/lib/crashForensicsBootTiming.test.js` | GREEN. Asserts `flags_on.length > 0`; the retired flag was `false` and so was NEVER in `flags_on` — a false flag cannot shrink that set. |
| `tests/soak-harness/coveringArrayCoverage.test.js` | GREEN, and **for a different reason than the brief gives**: the census is the SIMULATION-RULES domain; the key was never in the union (P5). |
| `tests/lint/observedShapeReaders.walker.test.js` | GREEN, **no drift line** — flagRegistry.js is in `scanTree`, and `provenanceDriftOf` skips the scanned half. |
| `tests/components/handbookVoice.test.jsx` | GREEN and UNTOUCHED by me (the neighbour L-UI-MAT re-polarised). |
| `node scripts/check-observed-shape-readers.mjs` (dry READ, no flag) | "exactly matching the frozen inventory", **1972** findings, exit 0. |
| `tests/lint/` DIRECTORY RUN | GREEN — **140 test files / 2194 tests**, matching the L-UI-MAT baseline exactly (no test file added, renamed or deleted). |
| `npm run typecheck:domain:strict` | exit **0**, 1120 errors at ceiling 1120 (unchanged — only deletions in `src/`). |
| `npm run typecheck:ratchet` | exit **0**, 173 at ceiling 173. |
| **Registers (no doors taken)** | lighting census NO movement (files 2543 / parked 373 / credited 2170 / titles 23653 / suiteTitles 6333); test-ratchet totalTests 31970 / totalFiles 2489 / entries 3; writer-reach no writer string changed; prose-numerics 225 exact; observed-shape 1972 exact. |

---
## MEASUREMENTS — every exit captured in-shell. Conditions: load avg 1.73, mutex FREE, `$SC/HOLD-VITEST` absent.
| instrument | predicted | measured | verdict |
|---|---|---|---|
| `tests/lib/flags.test.js` | green | **EXIT=0** · Test Files 1 passed (1) · Tests **10 passed (10)** | ✅ |
| `tests/ui/founderTileRestore.test.jsx` | green | **EXIT=0** · 1 passed (1) · Tests **9 passed (9)** | ✅ |
| `tests/domain/gameGradePromotionContract.test.js` | green | **EXIT=0** · 1 passed (1) · Tests **6 passed (6)** | ✅ |
| `tests/lib/crashForensicsBootTiming.test.js` | green | **EXIT=0** · 1 passed (1) · Tests **1 passed (1)** | ✅ |
| `tests/soak-harness/coveringArrayCoverage.test.js` | green | **EXIT=0** · 1 passed (1) · Tests **6 passed (6)** | ✅ |
| `tests/lint/observedShapeReaders.walker.test.js` | green, no drift | **EXIT=0** · 1 passed (1) · Tests **44 passed (44)** | ✅ |
| `tests/components/handbookVoice.test.jsx` (neighbour, untouched) | green | **EXIT=0** · 1 passed (1) · Tests **3 passed (3)** | ✅ |
| `node scripts/check-observed-shape-readers.mjs` (DRY READ, no flag) | 1972, "exactly matching" | **EXIT=0** — `observed-shape readers: 1972 finding(s), exactly matching the frozen inventory.` **No drift line, no provenance line.** | ✅ EXACT |

**FAILING ARMS ACROSS ALL SEVEN FILES: NONE.** 79 tests, 0 failures.
No register door was taken: the OSR ran with **no flag at all** (no `--write`, `--update`, `--genesis`, `--rebank`, no `*_REFREEZE`/`UPDATE_*`).
