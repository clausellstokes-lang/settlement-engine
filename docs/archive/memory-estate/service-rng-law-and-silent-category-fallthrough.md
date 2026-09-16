---
name: service-rng-law-and-silent-category-fallthrough
description: "⚠⚠ ADDING AN INSTITUTION SERVICE MOVES GOLDENS UNLESS on:false — and `p >= 1` IS NOT stream-neutrality at a criminal provider (156/525 rows). Plus: an unregistered service name NEVER reds, it silently defaults to 'equipment' — three live mis-folds measured, no walker exists."
metadata: 
  node_type: memory
  type: project
  created: 2026-08-07
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T04:06:14.187Z
---

# The service RNG law, and the silent category fallthrough

Both MEASURED 2026-08-06/07 by regenerating **all 525 golden-master settlements as objects**
and deep-diffing field by field (indices collapsed), harness proven faithful first by
reproducing the committed manifest 525/525 with 0 mismatches. Landed at `3bb846bb`; full
detail in the `FABLE_VALIDATION_QUEUE.md` row at `c60eb644`.

## ⚠⚠ THE RNG LAW — `p >= 1` IS NOT STREAM-NEUTRALITY

Service selection draws from the SHARED seeded stream (`src/kernel/rngContext.js`, one
module-level `_activeRng`). **Two draw sites:** `src/generators/services/institutionServices.js:177`
per candidate service, and `serviceRollMaterialization.js:224` a crime-scaled gate for any
criminal-category service from a criminal provider.

| Shape | Rows moved of 525 |
|---|---|
| `on:false`, any `p`, criminal host | **0** — byte-identical |
| `on:true`, p 0.5, criminal host | **156** — wholesale reshuffle, 8 buckets |
| `on:true`, **p 1.0**, criminal host | **156** — ⚠⚠ p>=1 does NOT save you |
| `on:true`, p 1.0, NON-criminal host | 84 — pure addition, 0 changed/removed |

**WHY:** `p >= 1` short-circuits the `:177` draw, but the `:224` crime-scaled gate **draws
BEFORE `p` is consulted**. **THE ONLY FREE SHAPES ARE `on:false`** (`:175` returns before any
draw) **and `p >= 1` at a NON-criminal provider.**

⭐ Containment: every moved path-template sat under `$.availableServices`. The shift is real
but does not propagate past the services block.

## ⚠⚠ AN UNREGISTERED SERVICE NAME NEVER REDS

`serviceClassifier.js:20` looks up `SERVICE_CATEGORY_MAP[serviceName]` — exact,
case-sensitive, unnormalized. On a miss it runs a ~30-branch keyword ternary over the
lowercased service AND institution name and terminates at
`INSTITUTION_DEFAULT_CATEGORY[instName] || 'equipment'`. **Zero throw paths, total function.**

- **266 of 841 unique names are explicitly mapped (~32%).** The other ~575 ride the heuristic.
- ⛔ **NO WALKER EXISTS** — `SERVICE_CATEGORY_MAP`, `classifyService` and
  `serviceCategoryTables` appear NOWHERE in `tests/`. This is the standing
  structural-prevention item.

**THREE LIVE MIS-FOLDS, MEASURED IN SHIPPED OUTPUT:**
- `Discreet passage` @ Underground network → **equipment** (16/525 rows)
- `Hospitality` @ Monastery or friary → **healing** (12/525 rows)
- `Hideout rental` @ Outlaw shelter → **equipment** (LATENT; baseChance 0.08 never rolled)
- `Sanctuary` is *explicitly* mapped to `healing` though its desc is "Legal protection on
  holy ground". ⛔ Re-mapping is golden-moving (it is `on:true`) and is a CHAIR CALL.

⚠ **THE CLASSIFIER IS HOST-DEPENDENT ON A MISS.** Before `'Safe house'` was registered, the
identical name folded to `lodging` at an inn and `criminal` at a guild, because the
`includes('inn')` branch **preempts** the criminal keyword.

## Two unreachabilities and one dead key

- **`requiredTradeRoute` is set ZERO times** across all 961 authored defs — the vocabulary is
  exactly `{on, p, desc}` — so the conjunction at `institutionServices.js:178` is unreachable
  from native data. See [[unreachable-predicate-conjunction-class]].
- `on` is a plain boolean in **961/961** authored defs (591 true / 370 false); the
  `{allow, force}` object form is reachable only via the DM override channel.
- ⚠ **`Church/Temple` is a DEAD RESOLUTION KEY** — a `p:1.0 on:true` probe there moved **0 of
  525 rows**; no corpus institution ever resolves to it. The whole safe-house/sanctuary family
  (`Sanctuary`, `Safe house`, `Safe houses`, `Hideout rental`, `Safe passage`,
  `Hidden storage`, `Transport routes`) appears **ZERO times** in 525 settlements — DM-opt-in
  surface only.

## Census, for the next lane that needs it

**311 institutions** — thorp 18 · hamlet 36 · village 59 · town 84 · city 89 · metropolis 25.
By category: Economy 77 · Crafts 69 · **Criminal 28** · Government 24 · Infrastructure 23 ·
Magic 21 · Religious 21 · Defense 17 · Entertainment 15 · Adventuring 9 · Exotic 7.
All 28 Criminal entries carry the `criminal` tag; **no institution outside Criminal carries
`criminal`/`smuggling`/`underground`.** The institution's kind is `category` + `tags` —
there is **no `type` field**.

**Why:** a data-only service addition looks free and is not; and a category that resolves by
heuristic looks correct and is silently wrong in shipped output today.

**How to apply:** before adding ANY service, decide `on:false` (free) or measure the shift.
Never trust `p >= 1` as neutral at a criminal provider. Register every new name in
`SERVICE_CATEGORY_MAP` explicitly — the fallthrough will not tell you that you did not.
Related: [[fnv1a-low-bit-parity-pool-aliasing]] · [[generator-golden-shift-record-established]] ·
[[derive-dont-restate-and-mutant-must-change]].
