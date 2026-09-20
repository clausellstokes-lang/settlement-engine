# EM-B1e — compile evidence

Every fact `EM-B1e.md` and `EM-B1e.manifest.json` call verified is proved by a command below with
its real output. A fact with no command here is not verified.

**Lane:** EM COMPILE LANE P2 (Opus), session 923472dc, letter `b`. **Read only** in `$SP/consist`;
**wrote only** under `$SP/lane-em-b-scratch/`. No vitest, no eslint, no writing script.

---

## §0 · The base

`d31af2cee` confirmed at 11:01:32 EDT **before any measurement**; the branch has moved repeatedly
since as the chair's rulings landed. `d31af2cee` **IS an ancestor** of every tip seen, and every
path this packet measures is **blob-identical** across the window. Worktree clean. Base held at
`d31af2cee` under **J-T1**.

```
IDENTICAL  src/domain/worldPulse/calamityKernel.js   IDENTICAL  src/domain/provenance/rosterProvenance.js
IDENTICAL  src/domain/worldPulse/causeLifecycle.js   IDENTICAL  src/domain/entities/status.js
```

---

## §1 · ⛔ THE HOT-FILE MEASUREMENT THE CHAIR REQUIRED FIRST

```
$ grep -n "calamityKernel" docs/implementation/PACKET_STANDARD.md
(no hit)
$ node -e '<scripts/.size-baseline.json lookup for calamityKernel>'
size-baseline: none
$ wc -l src/domain/worldPulse/calamityKernel.js
     831
```

⇒ **`calamityKernel.js` is NOT on the standing hot list and carries no `.size-baseline.json`
entry.** Hot-file rule 1 owes no opening headroom measurement, and **the ruling's condition for a
new leaf is not met** — the function stays in the kernel.

⚠ **831 raw lines is still large and `max-lines` is enforced per layer with per-file overrides
generated from the baseline:**

```
$ grep -n "max-lines" eslint.config.js
96:    rules: { 'max-lines': ['error', { max, skipBlankLines: true, skipComments: true }] },
667:      'max-lines': ['error', { max: 600, skipBlankLines: true, skipComments: true }],
```

A file with no override sits under its layer's ceiling. §8 step 1 therefore takes an **executed
measurement with eslint's own `Linter` before the first edit**, and headroom under ≤20 lines is a
STOP. ⛔ **`convergence.js` (hot, 798/800) is not touched, imported or read** — the chair's
explicit exclusion, asserted by A7.

---

## §2 · The ruin shape, its two call sites, and the one that is NOT a ruin

```
$ sed -n '250,252p' src/domain/worldPulse/calamityKernel.js
  const ruin = (/** @type {CalInstitution} */ inst, /** @type {string} */ reason) => ({
    ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true,
    worldPulseFate: 'destroyed_by_disaster', remnantReason: reason,
  });

$ grep -n "ruin(" src/domain/worldPulse/calamityKernel.js
282:        if (gi >= 0) { list[gi] = ruin(list[gi], 'Razed as the district collapsed to a single survivor after the disaster.'); removedNames.push(gone); }
286:      list[idx] = ruin(list[idx], 'Destroyed outright by the disaster.');

$ grep -n "^export" src/domain/worldPulse/calamityKernel.js | awk -F: '$1<251' | tail -2
180:export function promotesTo(name)
196:export function strikeCapForTier(tier)
```

⇒ **five added keys in that exact order; exactly two call sites; and `ruin` is module-private**,
declared inside a function body — which is the measured fact that made option (a) necessary and
why `strikeCapForTier` is the manifest's anchor symbol rather than `ruin` itself.

**The neighbouring branch that is NOT a ruin site:**

```
$ sed -n '270,276p' src/domain/worldPulse/calamityKernel.js
        ...list[idx], name: plan.demotedTo,
        id: `institution.${stablePart(plan.demotedTo)}`,
        description: '', tags: [],
        worldPulseFate: 'demoted_by_disaster',
        demotedFrom: name,
```

⇒ a **demotion**: no `status: 'ruined'`, no `_worldPulseInactive`. Named in §5 so it is not swept
in as a third site.

**A third key's reach, so it cannot be dropped from the shape:**

```
$ git grep -ln "_worldPulseEconomyClosed" -- 'src/**' | grep -v '\.test\.' | wc -l
8
```

---

## §3 · ⛔ THE RULING'S CONDITIONAL, ANSWERED: `worldPulseFate` HAS NO CLOSED VOCABULARY

```
$ git grep -n "worldPulseFate" -- 'src/**' | grep -v '\.test\.'
src/domain/provenance/rosterProvenance.js:258:  const fate = textOrNull(inst.worldPulseFate);
src/domain/worldPulse/calamityKernel.js:252:    worldPulseFate: 'destroyed_by_disaster', …
src/domain/worldPulse/calamityKernel.js:274:        worldPulseFate: 'demoted_by_disaster',
src/domain/worldPulse/causeLifecycle.js:69:/** @typedef {{ status?: string, worldPulseFate?: unknown, … }} InstLike */
src/domain/worldPulse/causeLifecycle.js:139:  if (inst.worldPulseFate) return true;
src/domain/worldPulse/institutionLifecycle.js:959,1019,1061,1103   (fate | null)
src/domain/worldPulse/magicRegimeLifecycle.js:357,374              (magicClosureFate(patch.form) | null)
src/domain/worldPulse/settlementLifecycleFirstClass.js:601         'abandoned_with_the_settlement'
src/domain/worldPulse/tierOutcomeApply.js:162,265                  (fate.fate | null)
src/domain/worldPulse/upswingKernel.js:53:  worldPulseFate?: string }} UpInstitution */
src/domain/worldPulse/upswingKernel.js:516,763  'upgraded_by_reconstruction', 'founded_by_flourishing'
```

| a closed vocabulary would need | found |
|---|---|
| a typedef enumerating the values | ⛔ **none** — the two that mention it declare `unknown` and `string` |
| a frozen table or constant set | ⛔ **none** |
| a walker asserting membership | ⛔ **none** |
| a reader branching on a value | ⛔ **none** — `rosterProvenance.js:258` reads it as **free text**; `causeLifecycle.js:139` tests **truthiness** |

⇒ **`ruined_by_decree` adds a value to no enumeration.** No MODIFY row is owed and no consumers
are named. The two readers are named in §5 as *unmoved*, which A6 executes through the real
functions. **RAISED R1 (confirm) and R2 (the openness is a real gap, and minting a vocabulary over
eight existing writers is not this packet's).**

---

## §4 · The separation this packet makes enforceable

```
$ sed -n '208,212p' src/domain/provenance/rosterProvenance.js
 * what the last writer actually left behind: 'removed'/'destroyed' is the
 * composer's own STATUS_REMOVED vocabulary, 'remnant'/'ruined' is the pulse's.
$ sed -n '81p' src/domain/provenance/rosterProvenance.js
const INACTIVE_STATUSES = Object.freeze(['removed', 'destroyed', 'remnant', 'ruined']);
```

⇒ the law is stated in the tree; this packet gives it **one enforcing writer**, which is what A7's
single-writer scan pins.

---

## §5 · `requiredSymbols` — proved present, verbatim

```
1  src/domain/worldPulse/calamityKernel.js    :: export function strikeCapForTier
1  src/domain/provenance/rosterProvenance.js  :: const INACTIVE_STATUSES
2  src/domain/worldPulse/causeLifecycle.js    :: worldPulseFate
4  src/domain/entities/status.js              :: EntityStatus
```

⚠ **`ruin` is NOT named as a required symbol** — it is module-private, so the validator could not
resolve it, and naming a symbol that cannot be resolved is exactly what the standard refuses.
**`ruinInstitution` is not named either**: it is what this packet CREATES, and the standard
withdraws "preserves **or creates**" before LANDED.

---

## §6 · Collision, absence, and train disjointness

```
$ node -e '<load PACKET_MANIFEST.json at HEAD>; per path …>'
src/domain/worldPulse/calamityKernel.js   holders 0 NON-TERMINAL 0
tests/domain/ruinInstitution.test.js      holders 0 NON-TERMINAL 0

$ [ -e tests/domain/ruinInstitution.test.js ] && echo EXISTS || echo ABSENT
ABSENT
```

**T3 disjointness, measured:** EM-B1d's five files are `entities/npcs.js`,
`density/factionLifecycle.js`, `entities/successors.js`, `worldPulse/envoyCasting.js`,
`worldPulse/magicFormsPractitioner.js`. This packet's one is `worldPulse/calamityKernel.js`.
**No overlap.** The only shared path is the deferred census walker, which neither claims.

---

## §7 · What this lane did NOT measure, and says so

- ⚠ **Whether `calamityKernel.js` sits inside an edge-shared bundle closure.** This is the first EM
  packet to MODIFY a production file, so the obligation is live; the implementer derives the
  closure from the metas' own `inputs` at preflight. **RAISED R3** — an unmeasured path is not a
  verified fact.
- ⚠ **The calamity kernel's own suites and the preset witness's path.** Named nowhere; §10 directs
  the implementer to resolve them at preflight.
- ⚠ **`calamityKernel.js`'s effective `max-lines` figure.** Only the raw count (831) is measured
  here; the effective measurement is step 1's, before the first edit.

## §8 · Out of scope, found while measuring

⚠ **`institutionStatusModel.js:99` carries a FOURTH institution vocabulary** —
`INSTITUTION_STATUSES = Object.freeze(['operational', 'impaired', 'shell'])` — distinct from both
`EntityStatus` and the pulse's ruin set. **Not investigated, not in scope**, recorded so it is not
discovered as new. **RAISED R4.**

## §9 · What this lane did NOT do

Ran no vitest, eslint or writing script. Wrote nothing in the consist or the ledger. Named no
symbol it did not prove present, and deliberately named neither the private `ruin` nor the
created `ruinInstitution`. Did not stamp the preamble's hash. Raised no budget — the packet fits
the default. **Adjudicated nothing:** R1–R4 are listed in the packet's §13.
