# Engine defects recorded and deliberately NOT fixed — the dispositions

**LONG TAIL #40.** A settled, code-facing disposition for each engine defect this estate has
measured and chosen not to cure, written **at the build slot** so a lane reading code here
finds the disposition beside the code instead of re-deriving it.

## Why this file is here and not in the owner's queue

`docs/OWNER_DECISION_QUEUE.md` lives on the **ledger branch**, whose `src/` has had no commit
since 2026-08-11 and is 619 src-touching commits behind this slot (ODQ §928.1). A lane working
code works *here*, cannot see that queue, and — as §928.1 records — **regenerates cured
findings** when it reads code there. The queue keeps the owner's decisions; this file keeps the
code-facing half: what was measured, at which line, and what a lane must **not** do about it.

**Rules for this file.** Append-only: a disposition is superseded by a new dated entry below it,
never edited in place. Every claim names its evidence as `file:line` **at this slot** and says
whether it is **CONFIRMED** (executed) or **PLAUSIBLE** (reasoning only).

---

## §1 — The four dark-pool dispositions are BANKED, not open (2026-09-15, lane-LT40-engine)

The "dark pools" defect car settled five items. **Three are already cured, on banked preserve
refs that are DESCENDANTS of this slot's own HEAD.** A lane reading only the records would
re-cure them here, fork a sealed ref, and collide when the rewrite lands. This section exists so
that cannot happen.

**CONFIRMED at this dock** (`git cat-file`, `git merge-base --is-ancestor`, `git branch -a
--contains`, `git for-each-ref --contains`, all run at `f73bdbf16`):

| item | commit | disposition | where it lives |
|---|---|---|---|
| 1 — the two DS-POW-2 share pools | `a921d54b4` | **CURED, BANKED** | 24 `refs/preserve/*` refs, **no branch** |
| 2 — DS-GEN-18 HOME-FED | `4884e5ccb` | **CURED, BANKED** | the same 24 refs, **no branch** |
| 3 — DS-CND-1 `{reason}` | `67bdb21cd` | **REFUSED, with reasons** | the same 24 refs, **no branch** |
| 4 — the RATE instrument's missing rung | `97302382a` | **CURED, BANKED** | the same 24 refs, **no branch** |

- `git merge-base --is-ancestor f73bdbf16 <each>` is **YES** for all four: the slot is **behind**
  these commits, never diverged from them.
- `git branch -a --contains <each>` is **EMPTY** for all four: nothing has landed them.
- The refs that contain them are the banked rewrite corpus —
  `refs/preserve/clarity-{economy,general,power,warfaith}-2026-09-14`, the eight
  `refs/preserve/dock-lane-*-live` refs, the nine `refs/preserve/scribe-w*` refs, and
  `refs/preserve/lane-promise-seedjoin-2026-09-13`. **The banked rewrite's landing is the
  owner's word.**

### ⛔ Every cause is STILL LIVE at this slot — and that is the trap

Reading the code here shows the defect, because the slot does not carry the cure. All four
re-measured at `f73bdbf16`:

- **item 1** — `src/generators/power/governanceNarrative.js:487` still ends `deriveBaselineConflict`
  in an **unconditional** `return 'A dispute over grazing rights and water access…'`, so
  `recentConflict` is non-empty on every town; `src/domain/display/stateProse/powerStateProse.js:377`
  (`stabilityLensPoolKey`) still returns `'recentConflict present'` first, so
  `governingSharePoolKey` is never reached.
- **item 2** — `src/domain/display/stateProse/generalStateProse.js:1362-1368` (`homeFedChain`) still
  does a bare `label.toLowerCase()` against keys built from a bare `.toLowerCase()`, while its own
  docblock at :1319-1322 says the canonical `resourceKeyForLabel` join is applied. It is not.
- **item 3** — the three `{reason}` variants still stand at
  `src/data/dossierStateProse/stressors.generated.js:2539/:2547/:2556`, and no `{reason}` producer
  exists. `67bdb21cd` REFUSED the cure as a **writing act**: the `{defmaterial}` precedent cannot be
  followed, because that precedent quotes a word the record's own description fixes and this record
  fixes none — all 242 conditions carry one source value, one event type, and a `detail` that is a
  machine sentence about the GENERATOR. Scale banked for a pool run: **235/768 towns, 100 % of
  condition-bearing towns, composing to nothing.**
- **item 4** — `scripts/prose-rate-corpus.mjs` still contains **zero** occurrences of
  `crisisBannerRung` while the product calls it at
  `src/components/new/tabs/OverviewTab.jsx:298`. (Measured with a byte scan, not `grep`: **that
  script carries four NUL bytes at this slot**, which make it invisible to `grep -n`. LT29 car 8
  cured the NUL bytes at `49f2dcab8`, sealed `refs/preserve/lt29-instruments-2026-09-15` — also not
  here. Anything that edits that file should collect LT29 first, or it will be editing a file its
  own tools cannot find.)

### The rule this section exists to state

**Do not re-cure items 1, 2 or 4 at the slot.** Re-writing a cure that exists forks a sealed ref
and collides at the rewrite's landing. Item 3 is **dispositioned, not open** — re-opening it needs
a new argument, not a re-reading.

### ⚠ FOR THE OWNER — the one sentence to rule

> Should the three banked dark-pool cures (`a921d54b4`, `4884e5ccb`, `97302382a`) be lifted onto
> the build slot **ahead of** the banked rewrite?

Lifting them makes each **output-moving** by its own declared figures — `recentConflict` 768 → 520
with DOMINANT 0 → 132 and NARROW 0 → 116; HOME-FED 0 → 20 joins; the rate table 271 → 290 pools with
63 committed values already stale — which puts all three under the **§764.3** sentence ("TRANS is
the LAST same-seed-moving wave"), whose amendment sits uninitialled as item 1 of the owner's
2026-09-15 sitting. **Until that is ruled, the default is: leave them banked.** This row is
recorded here because the sitting document lives on the ledger branch, which a slot lane cannot
write; carry it to the sitting.

---

## §2 — Index of what LONG TAIL #40 landed at this slot

| car | what it is | commits |
|---|---|---|
| 1 | the seed-join cure collected from `refs/preserve/lane-promise-seedjoin-2026-09-13`; red row set identical row for row | `c1792e11a`, `71c16dae8` |
| 2 | `settlement.services` PINNED permanently absent | `2d841ad53`, `43335c380` |
| 3 | the razing spoils PINNED inert — one reader, no writer | `5f9cd858a` |
| 4 | this file | — |

Owner-gated and deliberately untouched by all of them: the §764.3 sentence itself; populating or
retiring `settlement.services` (car 2b); the `Fish market` `priorityCategory` relabel
(`src/data/institutionalCatalog.js:517-522`, the one survivor of §708.7's six named trades); lifting
the three banked cures; curing `history.age`; changing any `fires(n)` constant or the `% 97`
modulus; curing the `compound.inst` snapshot; re-recording the generator golden master; W-COIN /
the treasury field; and the settlement-map module (§724/§739 descope — `grep forcePort` over this
whole checkout returns **zero**, so §708.4's ordering defect is not in this tree at all).
