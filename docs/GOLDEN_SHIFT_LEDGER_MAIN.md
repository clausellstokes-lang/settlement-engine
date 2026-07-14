# GOLDEN SHIFT LEDGER — MAIN TREE (`review-fixes-2026-07-08`)

The main tree runs a **NO-GOLDEN-SHIFT** discipline: golden manifests stay
byte-identical across a wave, and any legitimate shift is REVERTED in the working
tree and recorded HERE, to join the owner's batched `UPDATE_GOLDEN` sign-off (the
same gate the golden-branch's Track-G shifts pass through). The golden branch has
its own ledger; this file is the **main-tree** register.

Each entry records: the fix that causes the shift, why the shift is a legitimate
harness/fixture-fidelity change (engine bytes untouched), the exact before → after
manifest hashes (per key), and the capture command. Nothing here is landed until
the owner signs off the regen.

---

## SHIFT-1 — `[tests-2]` live-`regionalGraph` golden harnesses (F6 GATE HONESTY)

- **Wave:** F6 GATE-HONESTY. **Date:** 2026-07-14. **Status:** REVERTED — pending
  owner batched `UPDATE_GOLDEN` sign-off. Working tree carries the HARNESS fix with
  the OLD (pre-shift) manifests, so both goldens read RED on the drift test by
  design.
- **Class:** harness-fidelity (TEST code only). **Engine bytes: UNTOUCHED** — no
  `src/**` change; the only source touched in these two files is the state-threading
  line in the test harness.

### What changed and why it legitimately shifts

The deity and spatial worldpulse golden harnesses threaded the regional graph
forward each tick with `r.worldState?.regionalGraph || campaign.regionalGraph`.
`pulseKernel` returns the EVOLVED graph as the **top-level** `r.regionalGraph`
(`regionalGraph: applied.regionalGraph`); `worldState` never carries a
`regionalGraph` key, so the `r.worldState?.regionalGraph` term was ALWAYS
`undefined` and the fallback re-supplied the **frozen tick-0 graph** every tick.
Consequences the pins silently muted: queued-impact release, relationship
evolution, and (spatial) the `queuedImpacts` hash component — an inert constant.

The fix threads the sibling idiom `r.regionalGraph || campaign.regionalGraph`
(matching `beliefMapGolden` / `rumorLedgerGolden` / `worldpulseSeasonsGolden`) and
reads `queuedImpacts` from the threaded graph. The pinned projections therefore
now reflect a LIVE, evolving regional graph — a legitimate one-time shift of the
pinned hashes. A resurface guard was added to each harness asserting
`r.worldState.regionalGraph` stays `undefined` and `r.regionalGraph` is the carrier,
so the stale idiom cannot silently return.

Files: `tests/property/worldpulseDeityGolden.test.js`,
`tests/property/worldpulseSpatialGolden.test.js`.

### Before → after (captured via `UPDATE_GOLDEN=1`, then reverted)

**Deity — `tests/fixtures/worldpulse-golden-master.json`** (3 of 4 keys shift):

| key | before | after |
|-----|--------|-------|
| `gm-pulse-a\|3\|one_month` | `9e14b7a4…d6f9187` | `318b64ec…d32bff5f7` |
| `gm-pulse-a\|3\|one_week`  | `791616b4…3a60668d` | `53cdec0a…be8aa1de` |
| `gm-pulse-b\|5\|one_month` | `8a6ebc4e…b5a166ccd` | `e1ebb972…bea36ed049` |
| `gm-pulse-c\|8\|one_week`  | `18acece9…cf8137e2` | `18acece9…cf8137e2` (UNCHANGED) |

**Spatial — `tests/fixtures/worldpulse-spatial-golden.json`** (1 of 2 keys shift):

| key | before | after |
|-----|--------|-------|
| `sp-a\|4\|one_week`  | `9d9b5ced…ab864fbb` | `9d9b5ced…ab864fbb` (UNCHANGED) |
| `sp-b\|6\|one_month` | `970297aa…9538bd5bab` | `57703a99…b4000ed9` |

The rows that held are legitimate: for those seed/interval points the graph
evolution does not change the mechanical faith/spatial projection. The rows that
shift are exactly the propagation/relationship-evolution coverage the pins were
supposed to have and previously muted — proof the fix restores real coverage.

### Owner sign-off / capture command

```
UPDATE_GOLDEN=1 npx vitest run tests/property/worldpulseDeityGolden.test.js tests/property/worldpulseSpatialGolden.test.js
```

Run this ONCE, at the owner's batched golden sign-off, to write the "after" hashes
above into the two manifests. No other change is required — the harness fix is
already in the tree.
