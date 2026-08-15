# CS / CS-B3 — `FRIENDLY_REL` gains `allied` and loses `ally` (member 4 of `cs-b`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `eab6eba053e09732f12acbfe563874db02f056ce`
  (the `cs-a` train's dispatch base; authored on top of cs-b's `6d19d5e7`)
- **Train:** `cs-b`, family **CS** (un-stamped, cap 4), member **4** and its **LAST
  tests-moving member**, so it carries the lighting-census re-record for the whole train.
- **Preamble:** none — CS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§72.1** (cs-6) · **§72.3** (the trajectory
  pin is mandatory) · **§107.3** (convergence ceiling named at 798/800) · **§111.3** ·
  the RN-C habitat pin's own charter, which chartered `CR-TE18-CONVERGENCEALLIED` as the
  chair surface this member is the act of closing.
- **Compile of record:** `laneTC20-CSGEN-PLAN.md` §4.5.

---

## §1 · THE DEFECT — A SET THAT ADMITTED A TOKEN NOTHING CAN PRODUCE

`src/domain/worldPulse/convergence.js:836`:

```js
const FRIENDLY_REL = new Set(['ally', 'trade_partner', 'vassal']);
```

`relType` reaches it **raw** off a regional-graph edge via `neighborsOf` at `:822`
(`String(e?.relationshipType ?? e?.relType ?? '')` — no canonicalization), and
regional-graph edges carry **canonical** labels. Executed at this base:

```
canonicalRelationshipLabel("ally")     = "allied"
canonicalRelationshipLabel("alliance") = "allied"
canonicalRelationshipLabel("allies")   = "allied"
RELATIONSHIP_SELECTIONS: neutral, trade_partner, allied, rival, cold_war, hostile,
                         criminal_network, patron_of, client_of, overlord_of, vassal_of
```

Both the `region/graph.js` and the `relationships/canonicalRelationship.js` spellings agree.
So `ally` can never arrive and cannot even be authored, while `allied` — which can and does
— was **absent**. The set is read at `:919` (`motiveInputsFor` → `treatyWithIncumbent` and
`tradeDependence01`) and at `:1111` / `:1159` (the `invited` read).

⛔ **A sworn ally therefore read exactly like a stranger.** Measured at this base over a
live coup contest whose two foreign neighbours are bound by `allied` edges:

| tick | base — the defect | this cure |
|---:|---|---|
| 1 | interventions ledger **empty** | `crown→ford`, incumbent, `preserve_order`, **invited** |
| 2 | **empty** | `+ delve→ford` (one new column per contest per tick) |
| 3-4 | **empty** | both rows held, both still invited |

The base `allied` run is byte-for-byte the **neutral** run. That is the defect stated as a
measurement: the engine could not tell an ally from a stranger, so no ally ever propped an
incumbent, and the legitimacy-cheap `invited` path was unreachable from a treaty.

## §2 · WHAT REPLACES IT

The one-token swap, with the RN-C comment block above it rewritten from "the defect is
recorded" to "the defect is cured" (comments are excluded from the effective count, so the
rewrite is size-free):

```js
const FRIENDLY_REL = new Set(['allied', 'trade_partner', 'vassal']);
```

## §3 · ⛔ THE PAIRED OBLIGATION — BOTH SIDES MOVE IN THIS COMMIT

`tests/lint/vocabularyTotality.walker.test.js` holds the RN-C habitat pin's declaration
table for this exact set, and its arms are **exact-set in both directions**. The member
must delete the `ally` row (a declaration for a departed member reds: *"declares member(s)
that have LEFT the set"*) **and** add an `allied` row (an undeclared member reds too), in
the same commit.

The `ally` row was kept ON PURPOSE by RN-C as an instrument — a tidy `{trade_partner,
vassal}` would have looked correct and the missing `allied` would have stopped being
visible. **This member is the act that retires the instrument, and it may only do so
because the gap it pointed at is closed.**

⚠ **The non-vacuity arm still holds, re-derived rather than inherited.** The
`dead.length > 0` arm at `:285` counts declaration rows whose reason begins
`EXPECTED-DEAD`. Derived programmatically at this tree: **5 → 4** (three `defensive_pact`
rows plus `thirdPartyRansom.js|ALLY_LIKE`'s own `ally`), which is exactly what
`laneTC20-CSGEN-PLAN.md` §4.5 predicted. ⚠ `laneTE20-receipt.md`'s figure of "10" is a
grep-LINE count over a file whose prose also contains the token, not the declaration-row
count the arm actually uses; the correction is recorded here rather than carried forward.

## §4 · THE TRAJECTORY PIN (§72.3)

`tests/domain/convergence.test.js` gains one suite of three arms that drive
`advanceIntervention` for four ticks. Every fork rolls 0, so the loaded dice always fire —
deliberate, because this pin is about which motives the relationship makes available, not
about the rarity of the roll.

1. **The trajectory** — the ledger census is asserted as `[1, 2, 2, 2]` rows across the
   four ticks (the "interventions accrue over ticks, never a same-tick swarm" law made
   visible, and the accumulator §72.3 requires), with each row named exactly; and at
   **every** tick every committed column is asserted incumbent-side and `invited === true`.
2. **The negative control** — a `neutral` edge reads neither treaty nor invitation and the
   ledger stays empty for all four ticks.
3. **The retired token** — a raw `ally` edge is **inert**. This is the cure's own premise
   executed rather than asserted: if a future change canonicalized on the way in, or
   re-added `ally`, arms 1 and 3 would stop disagreeing and the gap would be back.

⛔ **Why `expect(FRIENDLY_REL.has('allied')).toBe(true)` would NOT have been a pin.** It is
the pure-function set-membership shape §72.3 refuses: it restates the edit instead of
proving the consequence, and it would pass just as happily on a set that had gained
`allied` while some caller still canonicalized on the way in.

**Mutants, both executed:** reverting the token (code only) reds **three** arms — the
walker's exact-set arm, this member's trajectory, and the retired-token arm, which flips
rather than merely failing, proving it discriminates; deleting the walker's `allied`
declaration row (code left cured) reds the walker's exact-set arm with `expected [ 'allied' ]
to deeply equal []`. Both directions of the paired obligation are therefore enforced.

## §5 · SIZE AND MANIFEST

`src/domain/worldPulse/convergence.js`: **798 → 798** effective lines (eslint's own
`Linter`), against the domain layer's 800 ceiling. ⛔ **This is the tightest ceiling in the
batch — two lines — and the cure consumes NONE of it.** The set swap is line-neutral and
the comment rewrite is free. The trajectory pin lives in the test file, never here.

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/worldPulse/convergence.js` |
| 2 | MODIFY | `tests/lint/vocabularyTotality.walker.test.js` |
| 3 | MODIFY | `tests/domain/convergence.test.js` |
| 4 | MODIFY | `tests/lint/sovereigntyLightingContract.walker.test.js` |

Handwritten files: **4**. New production leaves: **0**. Flags: **0**. Persisted record
families: **0**. **+3 test titles, +1 suite title** for this member; row 4 is the
**lighting-census re-record for the whole train**, carried here because this is `cs-b`'s
last tests-moving member. No member of this train creates a test file, which is deliberate:
the census sits at its pinned ceiling and a new file reds two censuses.

## §6 · STOP CONDITIONS

1. `convergence.js` gains even one effective line — it has two, and this cure is budgeted
   for none of them.
2. The walker's `dead.length > 0` non-vacuity arm loses its last member.
3. Any census figure is PREDICTED rather than read from the walker's own failure output.
4. A same-seed golden covering the intervention path moves. The `allied` relationship is
   rare in generated corpora and the intervention layer is flag-gated, so a move here would
   mean the blast radius was mis-measured and is a chair surface, not a re-record.
