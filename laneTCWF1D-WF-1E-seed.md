# COMPILE SEED — the deferred WF-1d half: THE FAITHSECTION CAUSE-CHAIN LINE

> **Not a packet.** This is the pre-executed substrate for the member `draft-WF-1D.md` §7 defers, so
> the chair can place it (RAISED-3) and its compiler can write a packet without re-discovering five
> figures. Every measurement below was executed by lane TC-WF1D at
> `claude/composite-r4 @ 2cdb87fa` against a `git archive` tree, with eslint's own `Linter` under
> `max-lines {skipBlankLines:true, skipComments:true}`. ⛔ **Re-execute every one at the member's own
> base; inherit nothing.**

## What it is

`DESIGN_FP_FAITH.md` §5-WF-1, the crown pin: *"open the town → FaithSection ACTIVE state → the
cause-chain line renders 'the patron fell: discredited (scandal of the granary tithe)' from
patronFalls[0]."* One sentence in the dossier's faith panel, behind the landed
`faithUnseatingEnabled`.

⚠ The same sentence continues *"the Chronicle carries the obituary row"* — **that half is dead and
`draft-WF-1D.md` §4 is the measurement.** This member is the FaithSection half only.

## The data path, executed — and it is the whole design constraint

| step | measured |
|---|---|
| what the panel reads | `faithPanelModel.js:144` reads **only** `settlement.config` + `powerStructure`. Its header states the invariant in terms: *"Reads ONLY the settlement's own config + powerStructure — no worldState, no store."* ⛔ It **cannot** reach `worldState.religionStates` |
| how live faith data arrives | `config.faithProfile`, whose **sole writer** is `projectReligionStateOntoSettlement` (`religionState.js:603`) |
| does that writer have the ring? | ⭐ **YES** — its `state` local IS `religionStates[saveId]`, which carries `patronFalls` |
| does it have the flag? | ⛔ **NO.** Its signature is `(settlement, religionStates, saveId, pietyByCid = null, martialByCid = null)` — no rules, no worldState |
| its only production caller | `pulseKernel.js:1773`, a **single line** |
| the conditional-key precedent in that same writer | `unaffiliated`, `piety`, `martial` — all three `...(x ? { x } : {})`. The new key takes the identical idiom |
| where the sentence renders | `FaithSection.jsx:195-198` — an EXISTING `<Cause>` block already rendering `piety.sentences` and `sinkSentence`. The model is destructured at `:75` |

## The five figures that would otherwise be found at a terminal

1. ⛔⛔ **DS-FTH-1 BINDS `faithPanelModel`'s RETURN SIGNATURE VERBATIM.** Executed at
   `src/data/dossierStateProse/warFaith.generated.js:2113`:
   *"DS-FTH-1 — War & Faith › Faith panel (ACTIVE mode) · `faithPanelModel(settlement) → {patron,
   cults, ranks, piety, unaffiliated, mandate, sinkSentence, live}`"*.
   ⇒ a new key **AMENDS** that row. Preamble §P2.7 and Lane P's standing law: edit the corpus source
   `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` and run **`npm run gen:dossier-prose`** in the SAME
   commit. ⚠ **Volume Q4 (the DS-FTH binding) is OPEN at the chair** — WF-1B's J-TCWF1B-4 recorded
   that this is the engineering fact, not the ruling. **This member may need Q4 ruled before it can
   promote; the join half does not.**
   ⭐ DS-FTH-3 already binds `patronFalls[]` and **agrees** (WF-1a discharged it) — no second
   amendment is owed.
2. ⛔⛔ **`FaithSection.jsx` CARRIES TWELVE HAND-KEYED `.prose-numerics-baseline.json` ROWS.**
   Executed: `path: src/components/settlement/FaithSection.jsx` at lines **49, 53, 174, 176, 179,
   188** (categories `floatInterpolation` / `percentToken`). The baseline holds **413** rows total.
   ⭐ **The render belongs in the `<Cause>` block at `:195-198`, BELOW every one of them**, and the
   model destructure at `:75` takes a name on an EXISTING line. ⇒ **add no line above `:174` and the
   bill is ZERO.** Add one and six rows rot. ⛔ **RE-ADDRESS such rows; NEVER delete them** — the
   walker itself invites the wrong cure.
3. ⭐ **THE KERNEL TOUCH IS NET ZERO AND IT IS ALREADY MEASURED.** Packing a sixth argument onto the
   existing single-line call at `pulseKernel.js:1773`:
   ```
   src/domain/worldPulse/pulseKernel.js   eff=1581   baseline=1581   EXACT
   npx eslint src/domain/worldPulse/pulseKernel.js   ESLINT_TRUE_EXIT=0
   ```
   `simulationRules` (declared `:307`) is in scope — verified by an executed top-level brace scan:
   `simulateCampaignWorldPulse` opens at `:241` and no top-level `}` occurs before `:1773`.
   ⛔ **ZERO HEADROOM, pinned exact in BOTH directions. Add no line, delete no line, move no line, and
   add no PRNG draw.**
4. ⭐ **IMPORT IS ALREADY ANSWERED.** `scrubImportedConfig` (`src/lib/importScrub.js:36`) **drops
   `faithProfile` outright** on import, so the new key needs no import-validation arm. The volume's
   *"import validates cause tokens against the closed set"* binds WF-1a's ring, not this projection.
5. ⚠⚠ **THE DARK FENCE IS NOT THE RING'S PRESENCE.** Gating the key on `state.patronFalls` alone
   would render the line in a world that was lit once and then darkened, because the ring is history
   and history is immutable under THE PROMISE. **The flag read is what makes the fence honest**,
   which is why item 3's kernel touch is OWED rather than optional. State it affirmatively.

## Priced shape

| limit (`PACKET_STANDARD` default) | this member |
|---|---|
| behavior families | 1 |
| new persisted record families | **0** — `faithProfile` is re-derived every tick and scrubbed on import |
| user-facing surfaces | **1** of 1 (`FaithSection.jsx`) |
| direct production consumers | **2** of 2 (`faithPanelModel.js`, `FaithSection.jsx`) |
| existing logic files modified | **3** of 3 AT CAP (`religionState.js` 368, `pulseKernel.js` 1581 NET ZERO, `faithPanelModel.js` 117) |
| registration-only files | 0 |
| handwritten files | **9** of 12 — the three above, `FaithSection.jsx`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, `tests/components/faithPanelModel.test.js`, `tests/components/faithSection.test.jsx`, `tests/lint/sovereigntyLightingContract.walker.test.js`, the packet |
| generated artefacts | `src/data/dossierStateProse/warFaith.generated.js` — generator `npm run gen:dossier-prose` |
| acceptance cases | ~6 of 8 |
| census delta | `+0/+0/+0/+6/+0` predicted (no new file) |
| overrides needed | **NONE** |

## Acceptance sketch

1. **Main behaviour** — lit, a settlement whose ring records a fall renders one cause-chain sentence
   naming the typed cause, built from `patronFalls[0]` through the landed writer.
2. **Absent vs false vs lit at the byte level** on a deity-BEARING fixture; the LITERAL
   `faithUnseatingEnabled: true` drive is the lit-mutant control.
3. **No ring ⇒ no key ⇒ no sentence** — `faithProfile` carries no fall key at all (absent, never
   `null`), on the `unaffiliated`/`piety`/`martial` conditional precedent. **anchored**
4. **The DS-FTH-1 round trip** — the amended corpus row and the live return signature agree, and the
   generated artefact is byte-current with its source.
5. **The rendered surface actually rendered** — ⛔ the rendered-surface-negative law's second
   vacuity: a negative that passes because the panel never mounted. Assert the positive (the panel
   is in ACTIVE mode and the other `<Cause>` sentences are present) in the same test.
6. **Lifecycle** — zero new top-level keys; `CONDITIONAL_LEDGER_KEYS` unchanged; `scrubImportedConfig`
   drops the key on import (asserted, not assumed).

## Mutants sketch

- **(a)** ignore the flag in the projector ⇒ must red the dark fence alone.
- **(b)** materialize the key unconditionally as `null` ⇒ must red case 3 alone (a key is a byte).
- **(c)** render the sentence outside the `<Cause>` block guard ⇒ must red case 5.
- ⚠ **A DOCBLOCK IS POSITIONAL** — placing a helper directly above an existing export in
  `religionState.js` orphans that export's JSDoc; WF-1B paid this as nine
  `typecheck:domain:strict` errors against a GREEN `typecheck:ratchet`.

## Path reservation

Shares **no** production path with `draft-WF-1D.md`. The only common file is
`tests/lint/sovereigntyLightingContract.walker.test.js`. ⛔ **A change path is reserved at every
non-terminal status, DRAFT included**, so in a two-member train **only the LAST tests-moving member
names the walker** (`DESIGN_BUILD_EFFICIENCY.md` §2.3 — the census re-derived WHOLE at the last
tests-moving member). The other member's titles then land against a stale tuple: **that is a PLANNED
INTERIOR RED and §P7.15 requires it be named in the train plan BEFORE it exists.**


## CHAIR APPENDS — 2026-08-21 ~17:25 (ODQ §326.4)

WF-1E's manifest additionally carries THREE micro-items queued by chair ruling:

1. **RAISED-B (§324.4):** deityNameForRef's truncating branch is live on an unflagged
   surface (executed blast radius in laneTEWF1C-receipt §7b). The cure re-records ONE
   labelled measured-truth arm (WF-1C's A1 keeps the production-shape headline).
2. **WF-1D RAISED-4a:** subsystemRowsVirtual.js:1268 — a landed sentence predicts the
   obituary beat lands in WF-1b; §309 re-filed it to WF-8. Reword to name WF-8.
   ⚠ Comment-only edit: check the per-file anchor walker and the §104.4 instrument
   BEFORE the edit; the file joins the manifest for this line alone.
3. **WF-1D RAISED-4b:** couplingInclusion.walker.test.js:157 — the FAITH exact-path
   row's justification cites patronFall.js having one importer; WF-1D adds a second.
   The ratio is unaffected — fix the JUSTIFICATION PROSE only, and re-run that walker
   file as the focused proof.

All three are prose/single-arm repairs; none may widen WF-1E's behavioral scope.
