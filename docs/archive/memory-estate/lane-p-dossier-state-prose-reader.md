---
name: ""
metadata: 
  node_type: memory
  created: 2026-08-03
  lane: P — dossier-native state prose
  branch: claude/composite-r4 (minifold worktree)
  status: reader BUILT and DARK; 5 of 6 desks and all component wiring OPEN
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T16:35:51.151Z
---

# LANE P — the dossier state-prose reader (built dark 2026-08-03)

## What exists

Five commits on `claude/composite-r4` in the minifold worktree, **not pushed**, dark by
construction (no component imports any of it, so the page is byte-identical):

| Commit | What |
|---|---|
| `a277f53d` | `scripts/generate-dossier-state-prose.mjs` + six desk leaves in `src/data/dossierStateProse/` + `src/data/dossierCausalProse.generated.js` + `tests/data/dossierStateProseProjection.contract.test.js` |
| `66f139dd` | `src/domain/display/stateProse/stateProseKernel.js` + `dmFieldProjection.js` |
| `23d118eb` | `causalDossierProse.js` — the [angle × arm] join reader |
| `20a7ee24` + `06614c47` | `economyStateProse.js` + `legibilityRung.js` — the reference desk |
| `6a1dbbef` | the §6 PROGRESS blockquote in `docs/DESIGN_FP_SPINE.md` |

Measured corpus: **58 state blocks / 664 pools / 2,153 variants across 6 desks; 78 causal
families / 468 variants**, every family exactly six arm-tagged variants in one pool.

## Why the corpus is generated, not transcribed

`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` and `RECEIPT_POOLS_CAUSAL_DOSSIER.md` are
the surface the chair and the owner read and veto. Hand-transcribing ~2,600 variants
would fork the content. So the **doc IS the source**, the script is the ONE projection,
and `--check` byte-compares. Run `npm run gen:dossier-prose` after ANY corpus edit; the
contract test fails on a stale leaf.

## ⚠️⚠️ The annexes are authored in FOUR different pool grammars

A parser that handles only the obvious one silently drops content, and a pool one line
short still renders — it just never says that thing again. The five defects caught, all
of which would have shipped as missing prose:

1. **WRITER-4's COMPACT ROWS** — a whole pool on one line
   (`` - `STRONG` — 1. `[visitor]` … · 2. `[ledger]` … ``), also in a bold-label form
   (`` **`port`** — 1. `[visitor]` … ``). **225 variants** invisible to the per-line grammar.
2. **THE SECOND `[dm-only]` TAG** — `` 6. `[counterforce · seat]` `[dm-only]` … `` (R-DOS-G).
   **89 covert variants** would have published to player pages.
3. **TWO TRAILING AUTHORING-NOTE FORMS** — ` *(…)*` and ` *— requires `tenure`*`. The
   first can contain its own `**bold**`, so an asterisk-free regex body is not a safe
   delimiter.
4. **BOLD RULE HEADINGS TAKEN FOR POOL LABELS** — `**Fence (from the sibling family):**
   **there is no …**` split three families' pools. Cure: a label never ends in a colon,
   never carries a sentence break, and a whole-line bold over 70 chars ending in a stop
   is a sentence. But engine values CAN carry a stop
   (`riskLabel: Critical. The seat could fall`), so length decides.
5. **HYPHENATED ARMS** — the arms extractor's class had no hyphen, dropping JF-CPL-14a's
   `broker-town` and orphaning two variants (reachable by no arm, renderable never).

The parser THROWS on any tagged pool line it fails to consume. Keep it that way.

## The reader's four laws (all pinned, two by executed negative control)

- **ANCHORED LIVENESS** — a variant renders only when every slot it names has a real
  fill. A pool DEGRADES to its slot-free variants; an absent pool returns `null`, and
  `null` means render NOTHING (R-DST-K). A numeric fill is rejected (§0d bans digits).
- **FAIL-CLOSED AUDIENCE** — `dm-only` truncates to silence; an unrecognised audience
  reads as the player's.
- **THE AVALANCHE DRAW** — `avalanche32(fnv1a32(...)) % n`, never a raw modulo.
  ⚠️ CONFIRMED: on `wizard_news.{i}.applied.evt{i}` a raw `% 8` reaches residues
  **{0,2,4,6}** — four of eight dead — where the finalized draw reaches all eight.
- **CANONICAL-AT-ZERO** — seedless reads index 0.

## ⭐⭐ THE DM-FIELD PROJECTION RULE — read before wiring ANY dossier section

The corpus's SECTION-TARGETs **read like write targets and are not**. `DS-GEN-5` frames
Overview › Situation, whose text IS `settlement.arrivalScene`; `DS-GEN-11` frames the
coherence verdict, whose text IS `economicViability.summary`. Both are queue-wired
DM-editable fields. The obvious wiring **overwrites the DM's pen silently**, because the
machine sentence is a perfectly good sentence.

`projectBesideDmField(fieldValue, machineLine)` returns the DM's string **by identity**
and offers the machine line as a separate adjacent field. There is no third shape.
`DM_FIELD_FRAMED_BY_BLOCK` maps the eight framing blocks to their fields, and
`DM_EDITABLE_SETTLEMENT_PROSE_PATHS` is pinned in exact lockstep with
`QUEUE_WIRED_PROSE_PATHS.settlement`. A source scan over the family reds on any
assignment into those paths — CONFIRMED live by injecting `s.arrivalScene = v`.

## Traps for the next wave

- ⚠️ **`src/data/**` has NO max-lines ceiling and its eager/lazy chunk routing is
  DERIVED from real import edges** — so a lazy-only corpus there stays out of first
  paint. (The `institutionVocabulary.js` header claiming "vite routes every src/data
  file into the EAGER data chunk" is STALE.) A 600 kB corpus in `src/domain` would have
  detonated the 800-line domain ratchet.
- ⚠️ **New `src/domain` files get ZERO any-casts.** The any-cast ratchet flagged
  `economyStateProse.js` at 11 and it had to be typed properly (`06614c47`). Declare the
  settlement slice you read; do not cast it.
- The generated leaves stay PURE DATA with **no import of any kind, including a JSDoc
  type import** — the corpus is typed at each desk's import boundary via an `unknown`
  round-trip.
- **The corpus already solved `isolated`**: §0c says an isolated town has no `{access}`
  fill, and the annex answers by authoring C2/C5 WITHOUT the slot. Don't build machinery
  for a case the content handles.

## What is open

1. **Five of six desks unwired** — power, defense, warFaith, stressors, general. Corpus
   projected; state→pool-key maps unwritten. Copy `economyStateProse.js` and its pin
   pattern (every emittable key asserted against the shipped corpus).
2. **No component consumes the reader.** Panels, flag, section composition.
3. **Join derivation unwritten** — `causalDossierProse` renders only joins it is HANDED,
   deliberately: a reader able to select a family from a band would let the page invent
   history. Deriving joins from `causes[]` / `sourceEventId` / CW-0's `receiptField` map
   is the caller's job.
4. **DS-ECO-1's rung cut is a chair call, VETO OPEN** — low = Subsistence–Poor, middle =
   Moderate–Comfortable, high = Prosperous–Wealthy.
5. **Slots-line hygiene recorded, not zeroed** — some blocks use a §0c-2 cluster-minted
   slot without restating it on their SLOTS line. Ratchets downward only.
