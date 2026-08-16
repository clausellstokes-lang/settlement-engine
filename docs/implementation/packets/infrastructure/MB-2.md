# MB / MB-2 — the servicesToggles writer chokepoint (member 2 of `mb`, §66.3)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `752b1bbc36672bc54e6bbed67284f8a0ba5e0a32`
  (the `gvf` terminal; the micro-batch's fourth train base)
- **Train:** `mb`, family **MB**, member **2** of 3.
- **Preamble:** none — MB is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§66.3** · **§137** · **§142**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.4, annex row `MB.M16`; fork `J-TC23-7`.

---

## §1 · THE DEFECT

`servicesToggles` is persisted, and a Stage-2b key change orphaned every bag written under the old
display-name form. The DEVICE-BLOB path is cured: `onRehydrateStorage` runs
`normalizeServicesToggles` at rehydrate. **The SAVE-LOAD path is not.** `setServiceToggles` writes
the bag RAW, and `SettlementsPanel.jsx:107` calls it with `data.servicesToggles` straight off a
loaded save — **after** rehydrate has already run, so nothing heals it. A returning user who loads
a save silently stops having their service preferences applied, forever, with no error.

## §2 · THE CURE

Route the WRITER through `normalizeServicesToggles`. Normalizing on write rather than asking each
caller to remember is the point: the caller that mattered did not remember, and every future
caller now inherits the fix by construction. The pass is pure and idempotent, so a bag already in
the current form normalizes to itself and the common path is unchanged.

⚠ **STATED BEHAVIOUR CHANGE.** A returning user's legacy-keyed saved service preferences START
APPLYING AGAIN. That is the cure's whole purpose and is recorded in-file, never left to look silent.

## §3 · THE REGISTRY HALF IS DEFERRED, AND THE COMPILE'S PRICE FOR IT WAS WRONG

`J-TC23-7` prices re-pointing `onRehydrateStorage` at the ACTION `hydrateServicesToggles` as "one
path at zero behavioural cost", against retirement's three. **Measured here, the re-point is also a
three-path act.** `tests/store/toggleSlice.servicesNormalize.test.js` carries a `store-lifecycle`
describe that SOURCE-SCANS `store/index.js` for the direct call — it pins both
`import … normalizeServicesToggles … from './toggleSlice.js'` and
`state.servicesToggles = normalizeServicesToggles(state.servicesToggles)` inside the
`onRehydrateStorage` window. Re-pointing reds both arms and requires rewriting a genuine SB1
lifecycle pin whose whole purpose is to red if that wiring is ever dropped.

⇒ **The registry half is DEFERRED to the chair with its true price**, and this member lands the
load-bearing half only. Recorded rather than silently dropped.

## §4 · SCOPE AND BOUNDARY

This fixes the save-load write path for `servicesToggles`. It does not touch the rehydrate wiring,
the registry, the exempt ceiling, or `toggleSlice.scope.test.js` (which TTS **S10** forbids this
member from opening).

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | a legacy display-name bag handed to the writer lands normalized |
| A2 | an already-current bag is written unchanged (idempotent) |
| A3 | the hydrate action's own pin still discriminates after the writer normalizes |
| A4 | the rehydrate source-scan pins are untouched and still pass |

## §6 · CHECKS

```
npx vitest run tests/store/toggleSlice.servicesNormalize.test.js \
  tests/store/toggleSlice.scope.test.js
```

## §7 · MUTANTS AND HAZARDS

- ⚠⚠ **A VACUITY THIS CURE WOULD HAVE CREATED, AND DID NOT.** The existing
  `hydrateServicesToggles action` pin seeded its raw bag by calling `setServiceToggles`. Once the
  writer normalizes, that seed arrives already-normalized and the pin would pass **even if
  `hydrateServicesToggles` did nothing at all** — it would stop discriminating at exactly the
  moment it stopped being able to fail. The seed is planted through `setState` instead, so the
  hydrate pin keeps its teeth. This is the batch's own class, met inside the batch.
- ⚠ **Same-seed: NEUTRAL** — a store slice, outside the generation fence.
- ⚠ **Census:** no test FILE is created or deleted. `titles` moves by two.
