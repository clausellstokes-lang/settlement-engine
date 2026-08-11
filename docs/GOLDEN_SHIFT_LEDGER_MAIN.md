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

---

## SHIFT-2 — `generator-golden-master` — the faction structural-NPC institution link (ENGINE BYTES)

- **Wave:** owner-approved generation-side repair. **Date:** 2026-08-11. **Status:**
  NOT RE-RECORDED — manifest left byte-identical, pending the owner's batched
  `UPDATE_GOLDEN` sign-off. `generatorGoldenMaster` therefore reads **RED BY
  DESIGN** on the drift test until that sign-off.
- **Class:** ⚠ **ENGINE BYTES — CHANGED.** This is the FIRST entry in this ledger
  that is not harness-fidelity. The owner explicitly approved the underlying repair
  after being shown that it moves same-seed output (`OWNER_DECISION_QUEUE` §12).
  Recording rather than re-recording keeps the before-hashes as evidence and keeps
  the regen a separate, owner-gated act, per this file's standing discipline.

### What changed and why it legitimately shifts

`src/generators/factionRoles.js` built a structural NPC's `linkedInstitutionIds`
from a bare `?.id`. A GENERATED institution carries no `id` property at all —
measured at HEAD `4a9b6cf4`: **3632 of 3632 institutions across 120 seeded
generations had none** — so the array was unconditionally `[]` for every faction
structural NPC ever generated, silently breaking pillar-NPC ripple, impairment
propagation, successor ranking, and the SuccessorPrompt institution link. The fix
reads the identity the consumers actually join on:
`domain/entities/propagate.js:478` defines `instId = (i) => i?.id || i?.name`,
and `EventComposer.jsx:332` builds the DM picker's option values with the same
`i.id || i.name`, so a generated link and a DM-authored link are now the same
string.

### Blast radius — MEASURED, and confined to one field

**25 of 525 rows drift.** The confinement is proven rather than asserted: re-hashing
each newly generated settlement with every `linkedInstitutionIds` forced back to
`[]` (its pre-fix value) reproduces the OLD manifest hash on **525 of 525 rows —
0 unexplained**. No RNG is drawn at the fix site, the NPC roster count is unchanged,
and structural NPC ids are unchanged. Independently, a 120-seed probe found the
masked-hash identical on 120/120 and `OTHER_FIELD_DIFFS: 0`.

⚠ **Known imperfection in the newly-live links, deliberately NOT fixed here:** of the
20 links created across the 120-seed probe, 16 are semantically correct and **4 are
not** — the noble role's `linkToInst: /council|court|hall|government/` matches any
`…hall` institution, so a Lord Mayor links to 'Gambling halls' (×2), 'Free company
hall', and 'Adventurers' charter hall'. That is a PRE-EXISTING defect in the
`FACTION_ROLES` table which the repair makes observable; narrowing the pattern would
be a second, unapproved same-seed shift and is left for an owner decision.

### Before → after (all 25 drifting rows; the other 500 are unchanged)

| key | before | after |
|-----|--------|-------|
| `city\|east_asian\|mountain\|road\|civilized\|golden-master-v3` | `1f0b1fd20e54…` | `ab2967db7688…` |
| `city\|germanic\|mountain\|road\|civilized\|golden-master-v3` | `7cac1f8342a2…` | `c3b77880f59f…` |
| `town\|arabic\|hills\|road\|civilized\|golden-master-v3` | `336535ed719b…` | `014242ebbeb4…` |
| `town\|celtic\|hills\|road\|civilized\|golden-master-v3` | `3fb1a7960c83…` | `e91f331b7232…` |
| `town\|east_asian\|hills\|road\|civilized\|golden-master-v3` | `03dbb38c9ec5…` | `7347c289b141…` |
| `town\|germanic\|auto\|random_trade\|civilized\|gm-seed-a` | `f9c154de1cf4…` | `0ead97b24084…` |
| `town\|germanic\|auto\|random_trade\|civilized\|gm-seed-c` | `01250591a7aa…` | `cc4d7da35939…` |
| `town\|germanic\|auto\|random_trade\|civilized\|golden-master-v3` | `8ba88a0859fc…` | `96c2ac26a395…` |
| `town\|germanic\|hills\|road\|civilized\|golden-master-v3` | `3aeaa7237940…` | `a50381d9c2d8…` |
| `town\|germanic\|mountain\|random_trade\|civilized\|gm-seed-a` | `a39332e0455e…` | `8beee2b8a6d1…` |
| `town\|germanic\|mountain\|random_trade\|civilized\|gm-seed-b` | `513f5e0710a6…` | `0ba1c7c6e953…` |
| `town\|germanic\|mountain\|random_trade\|civilized\|gm-seed-c` | `9c6cb519ea75…` | `01d392a3f7a0…` |
| `town\|germanic\|plains\|crossroads\|civilized\|golden-master-v3` | `7ed88bf3f776…` | `65e9a22f995d…` |
| `town\|germanic\|plains\|none\|civilized\|golden-master-v3` | `cad62a588b2e…` | `1aab7172a953…` |
| `town\|germanic\|plains\|river\|civilized\|golden-master-v3` | `f1795b55c7df…` | `d2cd9e2fdeef…` |
| `town\|germanic\|plains\|road\|civilized\|gm-seed-a` | `8bf2cef9d248…` | `3b79b0e112c7…` |
| `town\|germanic\|plains\|road\|civilized\|gm-seed-b` | `00d4dce1d825…` | `ddb05b4b0e85…` |
| `town\|germanic\|plains\|road\|civilized\|gm-seed-c` | `a65b1cfb94bc…` | `39b27fa06ae9…` |
| `town\|greek\|hills\|road\|civilized\|golden-master-v3` | `b6f7493bd26b…` | `d5703f2fb5e9…` |
| `town\|latin\|hills\|road\|civilized\|golden-master-v3` | `8f1c5781e0ff…` | `c2ab8c96dd6e…` |
| `town\|mediterranean\|hills\|road\|civilized\|golden-master-v3` | `8319e29a4849…` | `afe9244e8734…` |
| `town\|mesoamerican\|hills\|road\|civilized\|golden-master-v3` | `7691ccdef793…` | `b8b633514602…` |
| `town\|slavic\|hills\|road\|civilized\|golden-master-v3` | `6eb49e2822f2…` | `e85172a18615…` |
| `town\|south_asian\|hills\|road\|civilized\|golden-master-v3` | `da1666d48e9f…` | `8f5606f6fe08…` |
| `town\|steppe\|hills\|road\|civilized\|golden-master-v3` | `c84a9f59be0b…` | `59b1cf70a2ee…` |

### Owner sign-off / capture command

```
UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js
```

Run this ONCE, at the owner's batched golden sign-off, to write the 'after' hashes
into `tests/fixtures/generator-golden-master.json`. The engine fix is already in
the tree. `src/lib/roadNetwork.js` — the other half of the same approved repair —
moves NO golden: it is map-render code, outside the generation pipeline.
