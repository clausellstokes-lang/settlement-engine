---
name: ""
metadata: 
  node_type: memory
  kind: milestone
  date: 2026-07-15
  branch: claude/w-composer-2
  commits: 
    - fa4813cf
    - f86dc495
    - 75a31d39
    - 4a7e9cf1
    - 9c804b44
    - 01f2596a
    - 135148bc
  status: BUILT + committed on claude/w-composer-2 (off 69ef3e66 + coordinator 00f44338); NOT merged/pushed
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

# W-COMPOSER-2 — the composer completion wave (manifest lift + forecast + mutable docket)

THE LIFT: all 14 parked registrable-shape verbs registered in the NEW lazy leaf
`src/domain/events/realmManifest.js` (decree four: DECLARE_CASUS/SUE_FOR_PEACE/
ORDER_SUPPLY_RAID/DECLARE_TRADE_EMBARGO; factory six: ORDER_INTERVENTION/REINFORCE/
INTERCEPT/ORDER_CONVOY/DECLARE_BLOCKADE/FORCE_RECONSIDERATION; entry-factory four:
FORCE_CALAMITY/FORCE_FOUND_STEADING/FORCE_ABANDON/FORCE_RESETTLE). ONE LANE for all:
force-as-proposal (mint via `applyWorldPulse.mintRealmVerbProposal` → the sim's own
proposal path; apply via the `realm_verb_order` arm in `realmVerbExecution.js`, slotted
beside the M9d siege_initiation arm). REINFORCE/INTERCEPT registered but lane:'deferred'
(their organic column-commitment seam is W-CONVERGENCE's own documented deferral —
force≡organic forbids inventing a twin). The TWO proposal re-mint deferrals CLOSED:
advanceIntervention + advanceNaval mint pending proposals under DM-driven modes
(pendingActorMajorFor dedup; approval = the same arm; the DM's word replaces the dice).

THE FORECAST (§10): `src/domain/worldPulse/forecastRun.js` — simulatePendingFuture
drains the REAL queue via drainQueuedEvents + applyTwinDirectivesToWorld (extracted
from the store helper INTO the domain — one source) then runs the REAL
simulateCampaignWorldInterval on clones. Preview≡apply pin (tests/joins/
realmForecast.test.js) CONFIRMED: forecast worldState + member settlements equal the
committed advance byte-for-byte, modulo `lastLivingAdvanceAt` (store session stamp).

THE MUTABLE DOCKET (§10): updateQueuedEvent (in-place, same queueId/position/event-id);
queue/cancel/update all guarded by advanceInFlight + pausedAdvance sync-prefix; composer
edit-mode (editSeed.js reverse of buildEvent; EditQueueBanner); LAPSED marking; drain
refusals returned + surfaced as queue_refused news (never phantom, never silent);
proposal status 'refused' stamped when a realm order lapses at apply.

## Why / how to apply
- FORCING A REALM VERB in the UI: WorldPulsePanel → Realm Orders (RealmVerbComposer)
  → stages a pending proposal → approve in Pending Proposals. Cancel = dismiss.
- NEW MOVER RULE (fail-closed): the realm walker
  (tests/domain/events/realmCoverage.walker.test.js) source-scans worldPulse for
  factory shapes + `registered: false` markers — a new parked verb must register in
  REALM_MANIFEST or enter the walker's shrink-only PARKED ledger; glossary presence
  per verb + the mechanism whispers are walked too.
- BAND SUBMISSION RULE (RealmVerbComposer): dial keys ending `01` submit engine
  numbers; other band keys (FORCE_CALAMITY severity) submit the table WORD its
  kernel expects.

## Hazards / deferrals (documented, not bugs to re-find)
- ⚠️ FIRST-PAINT BUDGET RED left standing PER BRIEF: closure 1,125,078 vs budget
  1,122,663 (+2,415 over; wave's own eager delta +2,500 vs the 1,122,578 baseline).
  The coordinator closes the window with the FP-G7 reclaim; do NOT raise the constant.
- Party-caused queued events: the forecast applies their settlement-side effect but
  not the store-side party ripple (documented in forecastRun.js header).
- Cross-settlement docket EDIT lives on each settlement's PendingIntentions (the
  campaign RealmDocket cancels + points there); candidate-run forecast UI (marginal
  view in the composer pane) not wired — the domain lane (runRealmForecast candidate)
  is built + pinned.
- glossary.js now imports realmManifest (engine tree) — lazy-chunk weight on a
  reference surface, zero first-paint (vetoable; a light projection is the alternative).
- DM-forced ORDER_INTERVENTION strength derives at mint via patronStrength01Of
  (0.5 fallback when causal scores absent from the proposal snapshot); motive
  'dm_order' (not in MOTIVE_TYPES — record-shape only, no reader branches on it).
- Inherited strict-red repaired standalone (fa4813cf): glossary/guidanceNotes had 18
  implicit-any holes AT BASE 69ef3e66 (verified in a pristine scratch worktree).
- ⚠️ THE ANY-CAST RATCHET (tests/lint/domainAnyCastBaseline) counts every JSDoc `any`
  occurrence; new domain files must land at ZERO. The house escape is the schema-owned
  alias (`@typedef {NonNullable<import('../settlement.schema.js').SimSettlement['config']>} Mut`)
  + unknown-bridges for kernel-typed casts — burned 149 holes to zero (135148bc).
