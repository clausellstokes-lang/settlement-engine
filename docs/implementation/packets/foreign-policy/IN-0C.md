# Foreign Policy / IN-0C — disclosure treaty executor

- **Status:** `BLOCKED`
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `2c810d167d016302e641fc9cfe74fff57475b14e`
- **Last revalidated:** `2026-08-09`
- **Depends on:** `NONE beyond the verified base`; landed IN-0a/0b/0d do not settle IN-0C ordering
- **Commit authority:** `NONE — implementation prohibited while BLOCKED`
- **Baseline:** focused suites pass `4 files / 91 tests`; focused ESLint exits `0`; full gate, property goldens, typecheck ratchets, and bundle were not run.

## 1. Dispatch verdict and reconciled authority

Do not dispatch this packet. It intentionally withholds coding instructions.

Authority, in order:

1. Live source at the verified base establishes pulse order, writers, gates,
   and registered receipt kinds.
2. `PACKET_STANDARD.md` requires exact same-tick visibility, state ownership,
   merge behavior, and closed receipts before READY.
3. `DESIGN_FP_ARCH_IN.md` marks IN-0C owed/BLOCKED and forbids inventing its
   signing-credit order.
4. `DESIGN_FP_INFORMATION.md` defines a compelled loser-to-victor belief feed,
   same-tick expiry lift, standard default, and one-time signing credit.
5. `RECEIPT_POOLS_INFORMATION.md` provides content pools; pool headings are not
   source event registration or audience authority.

Reconciled facts:

- `TERM_CATALOG.disclosure` and `CLASS_TERM.intel` already exist.
- `advanceTreaties` already persists, advances, and expires the term. No second
  treaty ledger or compliance vocabulary is allowed.
- `ALLY_INTEL_TUNING.RELAY_KEEP` already supplies the lawful `0.95` precedent.
- `advanceInformationStatecraft` accepts `provenTrue = []`, but its pulse caller
  supplies none.
- No `peaceTermsDisclosure.js` exists and no disclosure receipt kind is
  registered in source.

## 2. Verified live tree contract

| Role | Exact file and symbol | Verified fact |
|---|---|---|
| Treaty gate | `src/domain/worldPulse/warReasons.js:peaceCausalActive` | Existing strict peace gate |
| Feed flag | `src/domain/worldPulse/simulationRules.js`, Full Simulation preset | `allyIntelSharingEnabled: true` is reachable-lit |
| Catalog | `src/domain/worldPulse/peaceTermsCatalog.js:TERM_CATALOG.disclosure`, `CLASS_TERM.intel` | Existing seam term; no second speller |
| Treaty writer | `src/domain/worldPulse/peaceTerms.js:advanceTreaties` | PASS 1 signs; PASS 2 expires/complies in the same call |
| Treaty wrapper | `src/domain/worldPulse/dispositionChannels.js:advanceTreatiesWithDisposition` | Calls treaty mover and folds late disposition effects |
| Belief writer | `src/domain/worldPulse/beliefMap.js:advanceBeliefMaps` | Ordinary reconcile and M9b sharing run first |
| Relay precedent | same file, `applyAllyIntelSharing`, `ALLY_INTEL_TUNING.RELAY_KEEP` | Deterministic strongest-confidence merge; lawful keep `0.95` |
| Seat key | same file, `GOVERNING_SEAT_KEY` | Canonical governing slot is `seat` |
| Credit consumer | `src/domain/worldPulse/informationStatecraft.js:advanceInformationStatecraft` | Folds supplied `provenTrue` in its one pass |
| Pipeline | `src/domain/worldPulse/pulseKernel.js` | `advanceBeliefMaps`, then statecraft, then treaties |
| Lifecycle voice | `src/domain/worldPulse/treatyLifecycleVoice.js:treatyDefaultDetectedBeats`, `treatyLapsedBeats` | Existing standard default/lapse kinds |
| Treaty test | `tests/domain/peaceTerms.test.js` seam-term case | Disclosure currently mints inertly without crashing |
| Relay test | `tests/domain/allyIntelSharing.test.js` | Relay keep, strongest merge, opt-in identity |
| Credit test | `tests/domain/informationStatecraftPins.test.js` | Existing `provenTrue` behavior |
| Preset test | `tests/domain/simulationRulesPreset.stability.test.js` | Reachable ally-sharing preset |
| Dormancy oracles | `tests/property/peaceCausalDormancyGolden.test.js`, `tests/property/informationStatecraftDormancyGolden.test.js` | Identified; not run in this authorship pass |

## 3. Exact blockers

### B1 — signing happens after the only credibility fold

Live `pulseKernel.js` order is:

1. `advanceBeliefMaps(...)`;
2. `advanceInformationStatecraft(...)`;
3. `advanceTreatiesWithDisposition(...)`.

Treaty PASS 1 writes the treaty, runs `mint.applyMintEffects`, conveyances, and
the signing beat. By then the tick's statecraft `provenTrue` fold has completed.
The existing parameter is a consumer seam, not transport from a later producer.

Moving either stage, adding a second statecraft pass, depositing a later delta,
or directly calling credibility from treaty code each changes architecture,
visibility, and replay semantics. None is currently ruled.

### B2 — belief merge ownership depends on that ruling

Beliefs normally merge in `advanceBeliefMaps`; statecraft later applies belief
overrides; treaties run later still. Until the owner fixes order and visibility,
the packet cannot name the legal merge point or whether a signing-tick feed is
visible immediately. A treaty leaf may not invent a third merge law.

### B3 — event vocabulary and fidelity are not closed

Architecture names `treaty_disclosure_opened` and reuses standard default.
The content pool also names `disclosure_feed`, `disclosure_strained`, and an
inferred, chair-flagged `disclosure_expired`. None is registered in source.
Design says strained feeds thinner but gives no exact fidelity values/bounds.

## 4. Minimum owner decision required

One owner ruling must answer all three items exactly:

1. **Transport/order:** producer stage, consumer stage, signing-tick versus
   later-tick credit, exact transient/persisted data shape, sole writer if
   persisted, duplicate/replay behavior, full relative order of belief relay,
   statecraft, treaty PASS 1/PASS 2, and receipt publication, plus the snapshot
   each reads.
2. **Closed kinds/audience:** classify each token as engine event, DM projection
   only, reserved content handle, or excluded: `treaty_disclosure_opened`,
   `disclosure_feed`, `disclosure_strained`, `disclosure_expired`. Confirm that
   honored stays quiet and default uses only the existing standard kind, or name
   the exact replacement.
3. **Compliance fidelity:** exact multiplier/value for each existing observed
   compliance state, every boundary/clamp/rounding rule, and whether merge uses
   the existing strongest-confidence precedent unchanged.

Do not answer item 1 by selecting or implying a stage move, second pass,
deposit, direct credibility write, or `provenTrue` bypass in this packet. The
owner must rule the mechanism. Do not split off a reduced feed-only or
credit-only substitute.

## 5. Scope and manifest while blocked

**Authorized behavior/files/lines/tests:** `0 / 0 / 0 / 0`

**Exact coding manifest:** `NONE`

After the rulings and any prerequisite, a new READY revision must remain one
behavior family, add no flag, normally add no persisted family, use at most one
new logic leaf, modify at most two existing logic files plus three registration
files, touch at most twelve handwritten files, change at most 250 effective
production lines, keep any hot-file delta at 15, and name at most eight
acceptance cases. A larger ruled transport requires a separate prerequisite.

## 6. Forbidden implementation

Do not change source, tests, fixtures, or registrations. Specifically, do not:

- create `peaceTermsDisclosure.js` or add a `provenTrue` pulse argument;
- move/duplicate a stage, add a pending-credit ledger, or mutate credibility
  directly from treaty code;
- run the feed from PASS 1/PASS 2 or copy private `styleSharedBelief`;
- treat relay keep as permission for a second merge rule;
- register any disclosure kind or expose private feed detail publicly;
- alter current term compliance/expiry, update a golden, or add a flag; or
- touch design docs, baselines, migrations, UI, or unrelated IN waves.

These are forbidden premature choices, not suggested solutions.

## 7. Read-only preflight and evidence

After the owner ruling, a coordinator may run only this preflight before
recompiling the packet:

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor \
  2c810d167d016302e641fc9cfe74fff57475b14e HEAD
rg -n 'advanceBeliefMaps|advanceInformationStatecraft|advanceTreatiesWithDisposition' \
  src/domain/worldPulse/pulseKernel.js
rg -n 'export function advanceTreaties|PASS 1|PASS 2|applyMintEffects|expiresTick' \
  src/domain/worldPulse/peaceTerms.js
rg -n 'provenTrue|advanceInformationStatecraft' \
  src/domain/worldPulse/informationStatecraft.js
rg -n 'GOVERNING_SEAT_KEY|ALLY_INTEL_TUNING|applyAllyIntelSharing' \
  src/domain/worldPulse/beliefMap.js
rg -n 'treaty_disclosure_opened|disclosure_feed|disclosure_strained|disclosure_expired' \
  src tests
```

Measured focused baseline at the verified base:

```sh
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 140 \
  npx vitest run tests/domain/peaceTerms.test.js \
  tests/domain/allyIntelSharing.test.js \
  tests/domain/informationStatecraftPins.test.js \
  tests/domain/simulationRulesPreset.stability.test.js
```

Result: exit `0`, `4 files / 91 tests`.

Any changed symbol/order, target dirt, incomplete ruling, added writer/state/
flag, scope overrun, audience leak, unexpected golden movement, or non-READY
status is a STOP. Recompile this packet; do not adapt while coding.
