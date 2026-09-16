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
  ✅ **DISCHARGED 2026-08-11** by THE GOLDEN BATCH (SHIFT-3 below), under the owner
  grant at `OWNER_DECISION_QUEUE` §17.1. The manifest is re-recorded and
  `generatorGoldenMaster` is GREEN. Twenty of the twenty-five "after" hashes below
  were reproduced EXACTLY by the discharge run — an independent confirmation of
  this entry's measurement, taken weeks later on a different lane. The remaining
  five were superseded in the same batch by SHIFT-3's narrowing and are re-tabled
  there; they are the five rows this entry's ⚠ note predicted would need it.
  *(Historical status, retained: NOT RE-RECORDED — manifest left byte-identical,
  pending the owner's batched `UPDATE_GOLDEN` sign-off; `generatorGoldenMaster`
  therefore read RED BY DESIGN on the drift test until that sign-off.)*
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

**RUN 2026-08-11.** Executed exactly once, under the gate mutex, as part of THE
GOLDEN BATCH. See SHIFT-3.

---

## SHIFT-3 — `generator-golden-master` — the Lord Mayor's civic-hall narrowing (ENGINE BYTES)

- **Wave:** THE GOLDEN BATCH. **Date:** 2026-08-11. **Status:** ✅ **RE-RECORDED
  AND LANDED.** Authorized under `OWNER_DECISION_QUEUE` §17.1 (the 2026-08-11
  owner grant), which licenses **one seed-line move** for this batch. SHIFT-2 and
  SHIFT-3 ride that single move together; the manifest is re-recorded once.
- **Class:** ⚠ **ENGINE BYTES — CHANGED.** The second such entry in this ledger.
- **Discipline note:** this file's standing NO-GOLDEN-SHIFT rule is *record, then
  re-record only under an owner gate*. That gate is §17.1, and this entry is the
  record. The rule is not suspended; it is satisfied.

### What changed and why it legitimately shifts

`FACTION_ROLES.noble`'s `linkToInst` was `/council|court|hall|government/`. The bare
`hall` alternative matched ANY institution whose name merely ends in "hall", so the
Lord Mayor — the settlement's civic head — was linked to gambling dens and mercenary
hiring halls. SHIFT-2 declared this as a known imperfection it deliberately did not
fix (4 wrong links of 20 across a 120-seed probe). §17.1 authorizes the fix.

The pattern is now:

```js
/council|court|government|\b(?:town|city)\s?halls?\b/
```

### The derivation — from the CLOSED corpus, not from guesswork

Institution names are never templated: every push site copies a literal key out of
`src/data/institutionalCatalog.js`, and `nativeSemanticName` returns `''` for
custom/DM content, so the set of strings this pattern can ever see is closed and
enumerable — **276 unique names over 6 tiers**. (Independently confirmed by a
1200-run pipeline sweep: 263 names observed, **zero** outside the catalog.)

Enumerated against that catalog at HEAD `e7774ff2`:

| | old pattern | new pattern |
|---|---|---|
| catalog names matched | 15 of 276 | 10 of 276 |
| names matched by NEW but not OLD | — | **0 (a strict subset)** |

The five names dropped are the ENTIRE non-civic-hall class — not merely the three
the 120-seed probe happened to name:

| dropped name | catalog category | provenance |
|---|---|---|
| `Adventurers' charter hall` | Magic / Adventuring | probe-named in SHIFT-2 |
| `Free company hall` | Defense | probe-named in SHIFT-2 |
| `Gambling halls` | Entertainment | probe-named in SHIFT-2 |
| `Hireling hall` | Adventuring | same class, unhit by the probe |
| `Carriers' hiring hall` | Economy | same class, unhit by the probe |

The ten that survive are every governmental/civic name the catalog contains —
`Town hall`, `City hall`, `Courthouse`, `Multiple courthouses`,
`Multiple court buildings`, `Mayor and council`, `Town council`,
`Elder Grove Council`, `City-state government`, `Palace/government complex`.

`council`, `court` and `government` are deliberately left BARE: they have zero false
friends in the closed corpus, so narrowing them would be unmeasured same-seed
movement bought for no defect. `court` in particular must stay un-anchored — a
`\bcourt\b` would stop matching `Courthouse` and `Multiple courthouses`.

### The cured links — before → after, measured on the real pipeline

Every mis-link falls through to the settlement's REAL civic seat rather than to
nothing, so **no settlement loses a link; five gain the correct one.**

| golden row | BEFORE | AFTER |
|---|---|---|
| `town\|germanic\|auto\|random_trade\|civilized\|gm-seed-a` | Free company hall | **Town hall** |
| `town\|germanic\|mountain\|random_trade\|civilized\|gm-seed-a` | Free company hall | **Town hall** |
| `town\|germanic\|mountain\|random_trade\|civilized\|gm-seed-c` | Adventurers' charter hall | **Town hall** |
| `town\|germanic\|plains\|none\|civilized\|golden-master-v3` | Hireling hall | **Town hall** |
| `town\|germanic\|plains\|road\|civilized\|gm-seed-a` | Free company hall | **Town hall** |

The full structural-NPC link census over the 525-row corpus, before and after —
**the correct pairings all survive, and the total link count is unchanged at 25**:

| link | before | after |
|---|---|---|
| Lord Mayor → Town hall | 10 | **15** |
| Lord Mayor → Mayor and council | 7 | 7 |
| Lord Mayor → Elder Grove Council | 1 | 1 |
| Lord Mayor → Free company hall | 3 | **0** |
| Lord Mayor → Adventurers' charter hall | 1 | **0** |
| Lord Mayor → Hireling hall | 1 | **0** |
| Archmagister → Bardic college | 2 | 2 |
| **total** | **25** | **25** |

### Blast radius — MEASURED

**5 of 525 rows move on top of SHIFT-2, and they are a strict SUBSET of SHIFT-2's
25.** The combined re-record therefore moves **25 of 525 rows — 0 added, 0 removed,
key set unchanged.** The confinement is structural, not asserted: the narrowing can
only alter a row that carried a noble link in the first place, and only 25 rows
carry any structural link at all (independently measured — the link set and
SHIFT-2's drift set are the SAME 25 keys). No RNG is drawn at the match site.

| key | before (SHIFT-2 'after') | after (this batch) |
|-----|--------|-------|
| `town\|germanic\|auto\|random_trade\|civilized\|gm-seed-a` | `0ead97b24084…` | `2f8e8a12401d…` |
| `town\|germanic\|mountain\|random_trade\|civilized\|gm-seed-a` | `8beee2b8a6d1…` | `cb2a7a9d523b…` |
| `town\|germanic\|mountain\|random_trade\|civilized\|gm-seed-c` | `01d392a3f7a0…` | `69f344041f89…` |
| `town\|germanic\|plains\|none\|civilized\|golden-master-v3` | `1aab7172a953…` | `6a32a994a896…` |
| `town\|germanic\|plains\|road\|civilized\|gm-seed-a` | `3b79b0e112c7…` | `c479c85d8bcc…` |

The other twenty rows carry SHIFT-2's tabled 'after' hash UNCHANGED.

### Cross-checks executed before the re-record was trusted

1. The manifest was computed INDEPENDENTLY of the test harness, by a separate
   script driving the same pipeline; the `UPDATE_GOLDEN` output and the independent
   computation are **equal on all 525 rows**.
2. Twenty of the twenty-five re-recorded hashes reproduce SHIFT-2's tabled 'after'
   values EXACTLY — hashes written down weeks earlier, on another lane, from a
   different tree. The five that differ are exactly the five rows measured as
   regex-moved.
3. An in-process A/B (old pattern vs new, same process, same corpus) reproduced the
   pre-edit and post-edit manifests exactly on all 525 rows each — proving the two
   passes were uncontaminated and the link diff above is real.

### Capture command (executed once, under the gate mutex)

```
UPDATE_GOLDEN=1 sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/generatorGoldenMaster.test.js
```

### JUDGMENT calls — vetoable

- **Cured the class (5 names), not merely the 3 the probe named.** `Hireling hall`
  and `Carriers' hiring hall` are the same defect — a non-civic "…hall" capturing
  the civic head — and cannot coherently be correct while `Free company hall` is
  wrong. Leaving them would bank a known-broken sibling. Say "veto" to restrict the
  cure to the three probe-named strings.
- **Narrowed the name pattern rather than making `linkToInst` category-aware.** The
  catalog's own `Government` / `Infrastructure` / `Entertainment` categories are a
  cleaner signal, but consuming them changes the `linkToInst` contract for all six
  role families — a schema change well outside the one-seed-line move §17.1
  authorizes. Recorded as the better long-term shape.
- **Added no speculative civic-hall spellings** (`moot hall`, `village hall`,
  `guildhall`). The corpus is closed, so an alternative matching nothing in it is
  unfalsifiable pattern surface. A future civic hall added to the catalog must be
  added to this pattern too — the same maintenance the merchant row's `trade hall`
  already carries. Note `guildhall` would additionally collide with the merchant
  family, which already claims the `guild` token.
