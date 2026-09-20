# EM-B1f — Opus COMPILE lane report (2026-09-19)

## Verdict

**DRAFT — READY-able in one pass.** Not blocked: every premise in the charter's row was tested
against the tree and every one held. Two facts the charter could not know were measured and are
carried in the contract rather than discovered at the build.

Tree read: `$SP/read-tip-58fcfe614`, `git rev-parse HEAD` → `58fcfe61458b784b0470b854caf916b7c2961edf`.
Preamble hash verified: `1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6` — equals
the chair's stamp. Nothing was edited, staged or committed anywhere; no vitest, eslint, npm script
or build was run.

## Files

- `$SP/lane-em-compile-EM-B1f-scratch/EM-B1f.md` — the packet, DRAFT v1, twelve sections
- `$SP/lane-em-compile-EM-B1f-scratch/EM-B1f.manifest.json` — the manifest entry (parses; 9 change
  rows, 5 requiredSymbols, 7 acceptance cases, 12 check arrays)
- `$SP/lane-em-compile-EM-B1f-scratch/EM-B1f.evidence.md` — §1–§11, every command with its output
- `$SP/lane-em-compile-EM-B1f-scratch/EM-B1f.compile.report.md` — this file
- scratch measurers: `scan-status-writers.mjs`, `corpus-status-census.mjs`,
  `closure-membership.mjs`, `seat-probe.mjs`, `bytes/`

## The measured facts that shape the contract

1. **The charter's premise holds.** `isOffStage` (`src/domain/roads/state.js:157`) is
   `isInStasis(npc) || whereabouts.state === 'hostage'` and **never reads `.status`**. CONFIRMED.
2. **The defect is real and reproduced BEFORE the fix exists.** At the pre-edit tree a ruler with
   `status:'jailed'` or `'exiled'` reads `securityBand:'holding'`, `seatWeight01:0.3744`,
   `rulerId:'a:ruler'` — design §15's jailed mayor who still governs — while `dead`, shelved and
   hostage rulers all read `unseated`. CONFIRMED by execution (`seat-probe.mjs`).
3. **`exiled` is in the union but PRODUCIBLE BY NOBODY.** Six writers of an NPC's `.status` exist
   in `src/`, and they write only `'active'` or `'dead'`; `addNpc` (the ADD_NPC applier)
   enumerates its fields and does not forward `event.payload.status`; no preset, fixture or golden
   carries a non-active status literal. ⇒ **the arm is inert on every world that exists** — the
   charter's MEASUREMENT OWED, answered, with no reproduction to give because the value is
   unreachable. CONFIRMED.
4. **The goldens cannot move.** Over the FULL 525-row golden corpus, 5,171 generated NPCs carry
   only `<ABSENT>` (4,884) or `'active'` (287) — **zero `jailed`, zero `exiled`**. CONFIRMED by
   execution. The same histogram forced an absence rule into the contract: 94% of generated NPCs
   have **no `status` key at all**, so the arm must be absence-safe (A2 asserts it).
   ⚠ **Named rather than left for the build lane:** four TEST files *do* build `exiled` NPCs
   through helper default-arguments (`densityLaw.test.js:992`/`:1436`, `npcs.property`,
   `magicFormsPractitioner`, `successors`) — invisible to a `status:` grep. **None routes one
   through a chokepoint consumer**: densityLaw's two go through `isOnRoster`, and its single
   `eligibleMembersOf` call builds NPCs with no `status` key at all. The arm moves no existing
   test. Evidence §3.
5. **Seven consumers, not three, and none is a display surface.** The charter's three
   (`warSeatBooks`, `npcLadderState`, `npcLadderKernel`) are a subset of seven sites across six
   modules; all seven inherit the widening with no edit. `isOffStage` has **zero** importers under
   `src/components`, `src/domain/display` or `src/store`, and `worldSnapshotPublic.js` does not
   import `buildWorldSnapshot`. The dossier reads the SAVE, whose roster the chokepoint never
   touches (pinned by a live test). ⇒ **a jailed NPC still appears in the dossier as jailed.**
6. **`rosterNpcById` is module-private** (`warSeatBooks.js:92`, absent from the file's five
   exports). The seat-read arm is therefore observed through the exported `readWarSeatBooks`
   (`:618` → `:633`), copying the landed `status:'dead'` test's shape verbatim.

## ⭐ The one thing the charter could not know — and it would have red at the build

EM-B1d's union-totality walker flags every `src/` file whose **comment-stripped** source holds a
quoted `'dead'`, `'exiled'` or `'retired'`, and asserts flagged ≡ roster ∪ register **both
directions** — *"an unlisted flagged file reds."*

```sh
$ grep -nE "'(dead|exiled|retired)'" src/domain/roads/state.js
(no output)
```

`state.js` holds no trigger token today, so **EM-B1d's eight-row roster cannot name it** — and
EM-B1f's arm introduces `'exiled'` into exactly that file. ⇒ the walker **REDS** the moment the arm
lands unless EM-B1f carries a **ninth roster row**. The packet does: a `MODIFY` row on
`tests/lint/statusUnionTotality.walker.test.js` adding `src/domain/roads/state.js` / `isOffStage`
with the **one-line reasoned omission** the walker's own rule permits, naming `dead`, `missing`,
`removed`, `retired`. Nothing else in the walker is touched.

**No placement avoids it.** Moving the literals to a constant only moves the trigger, and the
roster row, to whichever file holds them.

## The budget table

| budget | ceiling | member? | cost | obligation |
|---|---:|---|---:|---|
| generation worker `WORKER_BUNDLE_CEILING_BYTES` | `1,401,208` — **ZERO slack** | **NO** (220-module closure) | **0 B** | none |
| eager first paint `EAGER_FIRST_PAINT_MODULES` | closure budget | **NO** (268 modules; both importers also absent) | **0 B** | none |
| lazy `engine` chunk | `< 679_000` | ⭐ **YES** | **+98 B measured**; bound **≤200 B** | real build + per-module attribution |
| `advanceInterval.worker` | ⛔ **no ceiling exists** | ⭐ **YES** (549-module closure) | unbounded today | **Q3** |
| `townSceneExport` / `townScene` / `customContentPreview` workers | — | **NO** | **0 B** | none |
| edge-shared `aiCharterBundle` (114 inputs) / `aiOutputSchemaBundle` (115) | INPUT membership | ⭐ **YES — input of BOTH** | regenerate | ⛔ **P2.10 OWED** |

Bytes were **measured, not estimated**: both candidate forms written over the real file and
minified with the repo's own esbuild — base 7,727 B; FORM A (contracted) 7,825 B = **+98 B**;
FORM B (an exported frozen vocabulary) 7,875 B = +148 B. ⚠ **CONFIRMED** as a minified-source
delta, **PLAUSIBLE** as the rendered-chunk delta — hence the ×2 bound.

**The cure was not available as a placement:** the chokepoint itself lives in the lazy engine
chunk, so the lever is the arm's size, and FORM A is the smallest form that keeps the estate's own
`String(x.status || '').toLowerCase()` idiom. **No re-mint is proposed.**

Scope: 1 behaviour family · 1 production file modified · 0 new leaves · 5 handwritten files ·
≤4 new effective production lines · 7 of ≤8 acceptance cases. `state.js` is **288 / 800**
effective lines under eslint's own `Linter` — **not a hot file**, no `.size-baseline.json` entry.

## The register deltas — as DELTAS, no absolutes quoted

| obligation | verdict | delta |
|---|---|---|
| P2.1 lighting census | **OWED, titles-only** | **`+0 files / +0 parked / +0 credited / +4 titles / +0 suiteTitles`** — no new test file, no new `describe`, exactly four new straight-line `it`. The absolute is the chair's stamp at promotion. |
| P2.2 mutation-coverage row | **NOT OWED** | The packet CREATEs nothing under `ENFORCER_DIRS`; it modifies the walker EM-B1d creates, whose row EM-B1d already inserts (705 → 706). |
| P2.3 observed-shape exemption | **NOT OWED** | No save-time key read. ⚠ the scanner covers every `src/**/*.js` and one file moves ⇒ in `checks`; **motion is a STOP**. |
| P2.4 writer-reach | ⚠ **measure, do not assume** | Baseline captured at step 1; a shrink is `--write`, **growth is a mint and a chair act**. |
| P2.5 / P2.7 | **NOT OWED** | No draw; no rendered figure. |
| P2.10 edge-shared | ⛔ **OWED** | `roads/state.js` is an input of both bundles (measured) ⇒ `npm run build:edge-shared`, four artifacts. |
| P2.11 byte budgets | **PRICED** | the table above. |

## requiredSymbols, with the post-edit simulation's verdict per row

| # | path | symbol | `grep -cF` | post-edit verdict |
|---|---|---|---:|---|
| 1 | `src/domain/roads/state.js` | `export function isOffStage` | 1 | ⭐ **HOLDS** — the body changes, the declaration line is pinned byte-for-byte by §6 |
| 2 | `src/domain/npc/npcOps.js` | `export function isInStasis` | 1 | **HOLDS** — untouched |
| 3 | `src/domain/worldPulse/warSeatBooks.js` | `function rosterNpcById` | 1 | **HOLDS** — untouched (the widening arrives, it does not edit) |
| 4 | `src/domain/worldPulse/warSeatBooks.js` | `export function readWarSeatBooks` | 1 | **HOLDS** — added at compile because A1 CALLS it |
| 5 | `src/domain/worldPulse/worldSnapshot.js` | `export function buildWorldSnapshot` | 1 | **HOLDS** — added at compile because A4 CALLS it |
| ⏳ | `tests/lint/statusUnionTotality.walker.test.js` | the consumer roster | n/a | **DELIBERATELY ABSENT** — the file does not exist at 58fcfe614; the pre-proof adds the row once the base is at-or-after EM-B1d's landing |

**`retiredSymbols`: NONE.** The packet moves, renames and deletes no symbol.
**Other packets' rows to discharge: NONE** — a scan of all 188 register entries finds no
`requiredSymbols` row naming any of the three chartered pairs.

## Questions only the chair can answer

1. **Q1 — do `missing` / `retired` / `removed` join the arm?** Not decided here, per the charter.
   The measurement: the estate already holds two readings that disagree **on purpose** —
   `factionLifecycle` keeps `missing` and `retired` ON the house roster (reversible absence; *"a
   retired elder has not left the house"*) while `magicFormsPractitioner` counts both LOST and
   `envoyCasting` refuses `missing`. `removed` is irreversible and absent everywhere except
   `envoyCasting`. Full table in evidence §6.
2. **Q2 — the lazy engine's ~700 B cross-environment margin: a per-landing reserve, or a
   raise-time convention?** At the measured +98 B it is intact with 571 B to spare; at the stated
   ≤200 B bound it is 31 B short of `679,000`. The literal assertion passes either way.
3. **Q3 — `advanceInterval.worker` has no byte ceiling**, and this file is in its closure. Charter
   TOOL-3 mints one in the tooling window, which precedes EM-T6. Must that mint land before
   EM-B1f, and against which base does this packet price?
4. **Q4 — FORM A or FORM B?** Two `===` (+98 B, contracted) versus an exported
   `OFF_STAGE_STATUSES = Object.freeze(['exiled','jailed'])` + `includes` (+148 B), which would
   give the estate a named vocabulary later packets could read. Both measured; the veto is cheap.
5. **Q5 — the walker's ninth roster row belongs to EM-B1f, not EM-B1d.** EM-B1d's roster is
   authored at its own landing and cannot name a file holding no trigger token then. Confirm the
   division.
6. **Q6 — placement order.** EM-B1d is `READY` (non-terminal) and reserves three of EM-B1f's
   paths. EM-B1f must be placed only **after** EM-B1d flips to LANDED, or
   `implementation-packets.mjs validate` prints `duplicate change path across packets` three
   times. The chartered train order already frees them; the act is the chair's.
7. **Q7 — `envoyCasting`'s double refusal.** After EM-B1d row 4 and this packet,
   `rosterPersonAvailable` refuses an exiled NPC through two independent paths. Belt-and-braces
   matching `npcLadderState:201`'s documented defense-in-depth, deliberately not cured here
   (that file is EM-B1d's change path). Worth a later cleanup, or the settled idiom?

## Labelling

Every fact in §§1–11 of the evidence is **CONFIRMED** — each carries the command that produced it
and its output. The two **PLAUSIBLE** claims, labelled as such in the packet: (a) the +98 B
minified delta as a proxy for the *rendered-chunk* delta (esbuild is not Rollup's renderer), which
is why the contract states a ≤200 B bound and hands the build lane the per-module attribution; and
(b) the prediction that the pulse goldens, the espionage fence and the preset witnesses cannot move
— inferred from the unreachability of both tokens rather than executed suite-by-suite, since no
build or vitest run was permitted to this lane.
