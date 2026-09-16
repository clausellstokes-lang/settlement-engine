# SK / SK-0 — the soak-script extension (member 1 of `sk-a`)

- **Status:** LANDED
- **Landed at:** `b8753e28`
- **Verified base:** `claude/composite-r4` at `0cbb0177b177717873804200e908a27d42363ed4`
  (the `tm-core` terminal)
- **Train:** `sk-a`, family **SK**, member **1** of 4.
- **Depends on:** `tm-core` LANDED.
- **Preamble:** none — SK rides its own compile.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§141** · **§143** · **§145.2** · **§146** ·
  **§149.3** · **§180.3a** · §42/§43 · §131.
- **Compile of record:** `laneTC28-SK-PLAN.md` §3.1, annex rows `SK.M1`–`SK.M8`, `SK.L3`.

---

## §1 ⛔ THE ONE-SOAK LAW IS WHY THIS FILE IS TOUCHED AT ALL

`whole-world-soak.mjs` carries its own header law: *one soak, flag-varied — never a
second soak script*. The grid runner, the combinatorial flag sweep and the fix loop
must therefore reach the world through it, and it lacks the four seams they need.
Re-implementing fixture composition inside `scripts/soak/` would have been the cheap
route and it is the one the law forbids.

## §2 ⛔⛔ THE COMPOSITION IS EXTRACTED, AND IT IS EXTRACTED INSIDE `scripts/audit/`

`darkRules` is `Object.fromEntries(Object.entries(fullRules)…)`, so its KEY SET IS
`fullRules`'s KEY SET. An overlay applied ABOVE that derivation gives the dark control
an explicit `false` for every key the lit run declares; applied BELOW it, those keys
are ABSENT — and absence is not falseness for the booleans the normalizer defaults
true, nor for any engine read spelled `!== false`. The detector that would eventually
catch the damage is `conditionalStateLeaks` over ten worldState containers against
`maxConditionalStateLeaks: 0`, which is a whole soak away from the edit.

The composition therefore moves to its own module — but to `scripts/audit/soakRules.mjs`,
NOT to `scripts/soak/`. `REALM_SCALE_SOURCE_PATHS` contains `scripts/audit` and does not
contain `scripts/soak`, so code that decides what a soak MEASURES has to sit inside the
certification source fingerprint or the fingerprint has a silent hole. The general law —
`scripts/soak/**` may import from `scripts/audit/**`, never the reverse — is pinned with
a planted violation, so the hole cannot open later.

## §3 ⛔ `--skip-divergence` WOULD HAVE PUBLISHED A PROPERTY THE RUN DID NOT EARN

`properties` was an all-or-nothing literal that always contained `seed_divergent`;
`realm-scale-certification.mjs` requires that property and `certificationSchema.js`
publishes it as a customer-facing clause. A naive flag either lies or reds the
aggregate. The cure is three-part: the array becomes COMPUTED, the receipt records
`seedDivergence.executed:false` with its reason so the absence is a positive statement,
and the flag is REFUSED with `--case-id` so no case receipt can exist without the
property. The refusal is structural, not a convention the runner is trusted to honour.

## §4 ⛔⛔ SK.U1 IS SETTLED — AND IT WAS CURED, NOT FORKED

The compile's signed fork assumed a lossy year-boundary round trip would need an
ENGINE-SIDE serialization seam, which would flip the family's no-`src/` classification.
Executed at this base, the round trip IS lossy — 146 `undefined`-valued keys across
twelve distinct paths (`activeChains[].entrepot`, `foodBalance.magicFoodNote`,
`stress.icon`, `institutions[].removedByWorldPulseOutcomeId`, …) — and the composite
hash is BLIND to every one of them, because the hash is itself `JSON.stringify`-based.

⭐ **The fork's premise is refuted:** the census already knows the exact paths, so the
writer records them and the reader RE-PLANTS them. The restore is made true rather than
the instrument made blind — the census still runs at full strength AFTER the replant and
is what proves the cure. Nothing under `src/` is touched.

⚠ **AND THE FIRST INSTRUMENT WAS WRONG IN A WAY WORTH RECORDING.** A census with one
global `seen` set is ALIAS-SENSITIVE: a live realm is a DAG and its round-tripped copy is
a TREE, so every shared reference reported as a difference — 121 artifacts around 12 real
findings. The cycle detector is now the ANCESTOR STACK, with a `(node, path)` memo to keep
DAG re-walking bounded.

## §5 ⭐ THE §180.3a ADDRESS-CHAIN RIDER, ON THE SAME DECLARED MOVE

TE-27 refused this band with its price named: supplying the receipt field edits
`scripts/audit/behavioral-observation.mjs`, inside `REALM_SCALE_SOURCE_PATHS`. The chair
placed it here because this member ALREADY moves the fingerprint, so both changes ride
ONE declared move. The instrument measures the NEWS ADDRESS LAW's four mandatory parts
over the rows the phrase instrument already reads; the depth walk is CONTIGUOUS, so an
NPC id with no faction scores as an incomplete chain rather than as the best case. Rates
are integer milli, the `sim_narration_tempo` idiom, so no float can fork two faces.

## §6 ⛔ THE FINGERPRINT MOVE, STATED

This member edits three files inside `REALM_SCALE_SOURCE_PATHS`, so
`sourceIdentityMatches` will refuse to rebind any pre-existing realm-scale evidence.
Because §145.2/§146 mean **no soak has run yet**, there is no evidence to invalidate —
but the stamp must be taken after the LAST of `sk-a` + `sk-b` lands, and any evidence
produced mid-stack is unrebindable by construction.

## §7 · SCOPE AND BOUNDARY

Nothing under `src/`. No flag minted. No engine module changed. **Same-seed: NEUTRAL** —
with no overlay passed, the composition is byte-identical to the literal it replaced, and
that identity is pinned against a golden CAPTURED from the pre-change code.

## §8 · ACCEPTANCE

| id | case |
|---|---|
| A1 | an overlay key reaches the dark control with an explicit `false`, and the key sets are identical |
| A2 | the mutant that applies the overlay below the derivation fails A1, and the real function does not |
| A3 | absence and explicit-false are different normalizer inputs, which is why A1 is not cosmetic |
| A4 | no module under `scripts/audit` imports from `scripts/soak`, and a planted edge is convicted |
| A5 | with no overlay the extraction equals a golden captured from the pre-change literal |
| A6 | properties are computed; the skipped run omits `seed_divergent`; all three refusals fire by cause |
| A7 | the key census sees the loss the hash cannot, the replant cures it, and its absence reds |

## §9 · CHECKS

```
npx vitest run tests/soak-harness/soakScriptSeams.test.js tests/ops/behavioralObservation.test.js
```

## §10 · MUTANTS AND HAZARDS

- ⚠ The golden is CAPTURED, never authored — a hand-written expectation would mirror the
  new code and prove nothing.
- ⚠ The refusals exit **2** before any soak work begins, so they are executable evidence
  that costs no engine time.
- ⚠ §102.3: `tests/soak-harness/` is not an enforcer dir and `soakScriptSeams.test.js`
  matches no `NAME_PATTERN` token ⇒ **no mutation-coverage row owed**, deliberately.
- ⚠ Census: one new test file, seven titles, one suite title.
