# DESIGN_W_MEM — the Remembrance-grade durable ledger of concluded wars

> **RESUME (lane T12 · W-MEM ARCHITECTURE, Fable seat, design-only):** the skeptic panel
> returned REFUTED on all five lenses (40 MAJOR / 21 MINOR). **AMENDMENT A1 is folded in:**
> §1.3 CORRECTED · §2.2/§2.4/§2.5/§4 REWRITTEN in place under A1 markers · §2.1/§2.3/§2.6/
> §3.1/§3.3/§3.4/§5/§6 amended · Q-rows renumbered (now 8) · the full disposition table is
> §A1.D at the end of the volume. A SECOND fold pass (the W-MEM FOLD lane) re-verified the
> fold's new load-bearing citations at the laneT11-tree (ClosedWarFact typedef · the three
> completed recall-cause stamp sites · TERMINATION_PEACE_PROSE totality throw · the
> WAR_DURATION bands · the mobilization gate · TermRecord's magnitude unit) and tightened
> four residues (per-150 scaling note, Q-M4's import-loss sentence, A1.12's evidence,
> P1.10's ruling trace). Volume COMPLETE post-fold; chair spot-verify next.
> Measurement surface: laneT11-tree @ `b64dd5fdf` (on `b85044099`; includes NAME-1's
> render-time war namers and T11's WAR tab — ⚠ T11 is UNLANDED and §3.1 depends on its
> landing, which precedes T12's build in the queue per §826). The landed tip `19a8c9197`
> was re-checked by the panel: of every cited war file only `heraldRegister.js` differs
> there. SEAT-1 (`4e124fcdb`) is HOLDING-unlanded, cited only as forward context.

**Charter:** ODQ §764.2 ("W-MEM — ARCHITECTURE-FIRST: the Remembrance-grade durable ledger
of concluded wars — the §759/R-NAME1 finding that no post-war record exists; a NEW
persistence shape, designed then panel-ruled before any byte") + §773.1 T12 ("W-MEM
arch→panel→build + the granted Q-W4 region field") + §826 (T12 dispatch). Persistence-shape
details are owner-class by nature: **this volume proposes; the owner's batch disposes.**
Laws bound in: finite semantics (every vocabulary below is a CANDIDATE register until the
owner's pen), one resolver per quantity, THE PROMISE (a seed is a starting world forever;
no backfill invention), the news-address law, the legibility law (a war's record must read
as a story, not a table of floats), §711.6 (no unit-less numerics — and capacity 0..100 is
NOT headcount), §713.2 (a dormancy claim is a bit claim).

---

## §1 · THE CENSUS — what the estate records about a war today, and exactly where the record dies

The §759/R-NAME1 finding is re-proven here at `b64dd5fdf` by measurement, not quotation.
The one-sentence verdict survives, sharpened: **the deployment ledger is the engine's only
war record, it is deleted on seven distinct roads at war's end — one of which bypasses even
the return machinery — and every receipt that narrates the war lives in an 80-entry ring
buffer, so a concluded war leaves no addressable trace at all within ~80 advances.**

### 1.1 · Declaration (the record is born rich)

- `worldState.deployments[attackerId]` is minted by `seedDeploymentState` at the deploy
  seam (`warDeployment.js:1092-1124`). CONFIRMED fields at mint: `targetId`, `sinceTick`
  (the opening tick), `role`, `maxStartStrength` / `currentEffectiveStrength` (capacity
  units 0..100 — NOT headcount), `sizingBias`, `deployedQuality`, and — lit-only — the
  pinned founding casus: `casusReasons[] {type, score, receipt, atTick}` via
  `pinDeploymentCasusReasons` (`warTermination.js:226-262`; `atTick` flag-gated at `:243-249`)
  plus `sacredAnchors` (`attackerPatronRef`/`defenderPatronRef`) for `sacred_claim` wars.
- Coalition joiners mint their OWN bilateral deployment carrying the synthetic
  `alliance_obligation` casus and `joinLedger[0]` — the closed join anchor
  `{callId, partyId, callerId, enemyId, joinedTick, callerDeploymentSinceTick,
  originAttackerId, originSinceTick, allianceRelationshipKey, sourceCauseTypes, cause}`
  (`warCoalitionLedger.js` normalizeJoinAnchor; installed at `warDeployment.js:1107`).
  This anchor is the ONLY durable carrier of coalition structure, and it dies with the row.
- `blocks[]` — origin-tagged levy population inside the army (WC-0E,
  `worldState.js:149-174`) — records who actually marched, by home.
- WR-1 persistence law: `normalizeDeployments` (`worldState.js:107-178`) validates all of
  this on EVERY load, deliberately ungated (`:155-161`) — the estate already treats the
  deployment row as "a durable war ledger" (`:107-108`). Durable, that is, until the war ends.
- The march itself is announced as a `strategy_deploy` outcome whose receipt names the
  typed casus (`warDeployment.js:1216-1274`).

### 1.2 · Fronts (the war is narrated, tick by tick, into surfaces that rot)

- Live state, all read-side derivable while the war runs: `war_front` graph channels;
  `liveSieges`/`activeDeployments`/`settlementWarStatus` (`warStatus.js:88-146, 283-298`);
  the termination evaluator's per-tick `war_termination_read` receipt — the richest single
  object the war system produces (`warTermination.js:839-902`: cause/cost/momentum bands,
  believed vs truth balance, trajectory, home front, the two courts' books, ruler ids,
  the authored `reason` sentence).
- Those receipts persist into `worldState.pulseHistory` (writer: `pulseKernel.js:1870`,
  `warTerminationReads` on the pulse record) — **which is a ring buffer capped at
  `MAX_HISTORY = 80` records (`worldState.js:15`; restated at `chronicleGraph.js:17`)**.
  The termination evaluator itself re-reads them (`priorWarCostReceipt`,
  `warTermination.js:589-595`) — within an episode, never across one.
- Field battles (spatial marker worlds only): resolved in `armyTransitKernel.js`, narrated
  by `fieldBattleNews` (~`:585-630`) as a `wizard_news.<tick>.field_battle.<pair>` row.
  ⚠ **The battle's `region` is baked into a prose reason string**
  ("A crossing-path collision in ⟨name⟩'s approaches") **and never persisted as data** —
  the R-NAME3 refutation, re-confirmed here; this is the Q-W4 grant's target (§5).
- Sieges, harassment, abandonments, conquests each emit typed outcomes with authored
  headlines/reasons (`warDeployment.js:645-707, 801-854`) — again into the pulse stream.

### 1.3 · Termination — the seven roads, and where each record dies

All seven termination roads live in ONE file, `warDeployment.evaluateWarLayer` — carried
by FIVE `delete` statements (roads 5 and 6 share one behind the `razed ?` ternary at
`:878-879`; road 7 deletes nothing — it returns a fresh empty ledger at `:267`)
*(corrected under A1.11 — the earlier "seven delete statements" count was false)* — and
the file's own doctrine ("this head stays the WRITER... the only file that mints outcomes
and mutates the deployment / exhaustion ledgers", `warDeployment.js:33-37`) is about mint
authority, not about a durable record:

| # | Road | Site | What survives |
|---|---|---|---|
| 1 | Strategic recall (`recalled {cause, tick}` stamped by `stampDeploymentRecall`, `warIntent.js:313-324`). The COMPLETE cause census *(A1.11 — the earlier 5-of-7 census was incomplete)*: `'sue_for_peace'` (`applyWorldPulse.js:896-897`) · `'return_home'` (`applyWorldPulse.js:944`) · `'sue_for_peace_decree'` (`realmVerbExecution.js:613`, `peaceReasons.js:735`) · `'field_battle_retreat'` (`armyTransitKernel.js:936`, `convergence.js:666`) · `'convoy_lost_debark'` (`navalKernel.js:509`) · `'envoy_terms_carried_home'` (`armyTransitKernel.js:1098`) · `'authority_verdict'` (`warRulingsEvidence.js:228`) | `warDeployment.js:368-376` | outcome `'withdrawal'`; NO disposition delta (a choice, not a defeat — though a field-battle retreat and a lost convoy ride the same road) |
| 2 | **Attacker leaves the canon** | `warDeployment.js:394-396` | ⚠ **NOTHING — the record is dropped with no `resolvedDeployments` row, no outcome, no receipt.** The one road that bypasses even the return machinery. |
| 3 | Target leaves the canon | `warDeployment.js:399-402` | outcome `'withdrawal'` |
| 4 | Feasibility collapse / forced lift (siege abandoned) | `warDeployment.js:613-687` | `siege_abandoned` outcome + disposition loss/win deltas |
| 5 | Conquest | `warDeployment.js:711-889` (delete at `:879`) | power transfer (`cause:'conquest'`), occupation seed, disposition win/loss |
| 6 | Razing (replaces the conquest — LAW 6: "no occupation record, no garrison, no vassal ledger, no terms") | fork at `warDeployment.js:736-801` | the razing emission + vengeance-license patch |
| 7 | Wind-down (war layer toggled off mid-campaign) | `warDeployment.js:250-273` | mass `'withdrawal'` resolutions |

Roads 1 and 3–7 push `{attackerId, deployment, targetId, outcome}` onto
`resolvedDeployments` — **the full deployment record's last appearance anywhere** — which
flows to `deploymentReturnOutcomes` (`deploymentReturn.js:316-328`) via the kernel
(`pulseKernel.js:1044, 1184-1203`) and is then gone.

⚠⚠ **THE DISMISSAL TRAP (REWRITTEN under A1.1 — the first draft read it BACKWARDS).**
Evaluate-time is NOT verdict-time, but **a dismissed conquest still CONCLUDES the war.**
The kernel's own semantics, verbatim: "the OCCUPATION + its disposition deltas are rolled
back, but the war-layer resolution (the besieging army's deployment clears, the war_front
resolves) is INTENTIONALLY kept — a dismissed conquest means 'the takeover didn't stick;
the armies disperse', NOT 'the siege rewinds and continues'" (`pulseKernel.js:262-266`;
`deployments: war.deployments` committed unconditionally at `:1006`). The estate strips
the takeover's residue — the atomic sack ride (`warDeployment.js:778-798`), the
`sourceConquestId` disposition strip (`:856-871`, kernel strip `:1170-1181`) — but the
war is OVER either way. Two consequences for the writer: (a) it must run where the
dismissal verdicts are known, so a dismissed conquest records honestly as a war that
ended with the armies dispersing and NO applied conquest — never as a conquest, and
NEVER as nothing (writing nothing would reproduce the §759 failure on exactly the
strangest ending); (b) it must not fire on a PAUSED tick, where every major is parked
and no verdict exists yet (§2.4).

### 1.4 · What survives termination today — the complete durable inventory

- `worldState.dispositionStats` — the ratcheted W/L contest record. Explicitly NOT a war
  history: "not time at war or casualty accounting", and it counts trade-prize flips in
  the same ledger (`warStatus.js:33-39, 235-250`). Aggregate, unattributable to any war —
  and *(A1.14)* its writer set is wider than its own help string: beyond sieges, defenses,
  conquests and supplier flips, it is also fed by occupation stabilization rungs and
  collapses (`occupation.js:1082-1086, 1014-1024`), coalition settlement
  (`warCoalitionSettlement.js:584-627, 755-789`) and treaty breach
  (`treatyBreach.js:252-262`) — sources W-MEM deliberately records nothing about, so the
  two ledgers will legitimately disagree on a dossier and must never be reconciled to
  each other (§6.2 R1).
- `worldState.warExhaustion[homeId]` — the 0..1 scar, decaying (`warStatus.js:342-366`).
- `powerStructure.previousGovernments[] {label, cause:'conquest', tick}` — the conquest's
  ONLY durable trace: no attacker pair, no reason, and the array is "intentionally
  bounded" (`rulingPower.js:213`), so even this rots under churn. `occupiedSettlements`
  reads only its LAST row (`warStatus.js:306-340`) — an occupation followed by a coup
  vanishes from that read.
- `worldState.occupations[occupiedId] {occupierId, state, sinceTick, stateHeld,
  resistance, benefitYield, lastTick}` (`occupation.js:8-16, 311`) — live only; deleted at
  liberation/collapse (`occupation.js:966-971, 1008-1020`).
- Treaty rows materialized from accepted peace terms — live-clocked (`mintedTick`/
  `expiresTick`) and therefore EXPIRING, not durable; the authority-neutral carried sheet
  (`peaceTermsCarriedSheet.js:1-28`) exists only in transit.
- `pulseHistory` receipts (the 80-cap ring, §1.2) + wizard news — itself capped at 240
  entries (`chronicleGraph.js:14-18`; C9 promoted to CONFIRMED under A1.16).
- ⚠ `warId` has ONE reader and NO writer in the entire estate — the Herald's arc facet
  (`heraldIndex.js:155-162`, `refsOf: ['treatyId','warId','arcId']`, status `'pending'`).
  The estate already built the socket this ledger plugs into.

### 1.5 · Derivable post-hoc vs lost forever at termination

**Lost forever the tick the row is deleted** (no re-derivation exists): the founding
casus pins (`type, score, receipt, atTick`) and sacred anchors · the opening tick
(`sinceTick`) · the coalition join anchor (who fought beside whom, under whose call, on
whose cause) · the attrition arc (`maxStartStrength` vs final `currentEffectiveStrength`)
· the levy origin blocks · the termination FAMILY and its authored reason (they exist as
outcome rows for ≤80 advances, then roll off) · which peace terms ended it (the treaty
expires) · every field-battle and siege engagement (ring-buffered news).

**Weakly derivable, with decaying honesty:** that *a* conquest happened (last
`previousGovernments` row, until overwritten or bounded out) · aggregate martial standing
(dispositionStats — unattributable) · that an occupation is live NOW (occupations) · the
war-weary band (warExhaustion, decaying).

**The product consequence, measured on the display side:** NAME-1's war namer documents its
own defeat — "a CONCLUDED war has no ledger row left, so it can only be named through the
degraded pair form by a caller that still holds the pair" (`warAndRoadNames.js:26-30`).
The Herald's RUINS & REMEMBRANCE door (`heraldRegister.js:294-306`,
`HeraldRemembrance.jsx`) buries settlements with epitaphs, grades, and receipt pointers —
and can say nothing about the wars that killed them. §759's verdict stands at the current
tip: **no durable post-war record exists.**

---

## §2 · THE SHAPE — `worldState.concludedWars`

### 2.1 · The home

A NEW conditionally-materialized worldState ledger, **`concludedWars`**, appended at the
END of `CONDITIONAL_LEDGER_KEYS` (`worldState.js:439-472` — the array order IS the
serialized key order, pinned by the dormancy/golden oracle; APPEND-ONLY is the standing
law, and `politicsLedgers`/`factionPairStates`/`envoyErrands` are the recent precedents).
Object keyed (the `rulesetLog` idiom — `deepCloneConditionalLedger` and the mutable-clone
branch both want an object at the top), mutable-clone branch (it grows across ticks),
absent/empty ⇒ key omitted ⇒ byte-identical-dormant.

```
worldState.concludedWars = {
  [warId]: ConcludedWarRecord,
}
```

**`warId` = `war.<stablePart(lowId)>.<stablePart(highId)>.<openedTick>.<seq>`**
*(amended under A1.9)* — the sorted ORIGINAL belligerent pair (the NAME-1 address,
`warAndRoadNames.js:79-85`) + the origin deployment's `sinceTick` + a deterministic
sequence suffix (`0` almost always; the `rulesetLog` `rc_<tick>_<seq>` precedent,
`worldState.js:362-364`). The seq exists because the pair+tick key alone has a measured
structural opening: two settlements can open RECIPROCAL sieges on the SAME tick (the
blocking gate reads the PRE-tick graph — `warDeployment.js:285, :989` — so neither sees
the other's same-tick mint; the estate already models the mutual case at
`warTermination.js:964-968`). A reciprocal declaration folds onto ONE record
(`mutual: true`, `originAttackerId` = codepoint-first, both edges seal it per A1.10) —
the seq disambiguates only a genuinely distinct second episode. This finally mints the
id `heraldIndex.js` already reads, and the opening tick disambiguates the repeat war a
century later — the collision NAME-1 had to accept (`warAndRoadNames.js:27-29`) becomes
a display choice §3.1 now rules explicitly (A1.14).

⚠ **The key is a REGISTRATION EVENT, not just an append** *(A1.7)*. Landing
`concludedWars` in `CONDITIONAL_LEDGER_KEYS` trips, in the same act: (a) the
public-snapshot deny-census walker — every conditional ledger must be hard-denied or
public-allowlisted, `unclassified` must equal `[]`
(`worldSnapshotPublic.js:44-98`, `tests/security/worldSnapshotDenyCensus.test.js:26-32`);
(b) two exact-list pins and two `.at(-1) === 'envoyErrands'` pins
(`tests/domain/pantheon.test.js:609-615`, `tests/store/lifecycleRoundTrip.test.js:194-199,
:570, :580`); (c) the hand-mirrored server-side deny list (a Supabase migration —
owner-deploy-gated by nature). The audience ruling (Q-M4) therefore lands AT the
deny-census surface, in the same commit as the key — never after.

### 2.2 · The record — a persisted `ClosedWarFact`, no minted vocabulary, no prose (REWRITTEN under A1.2 + A1.5 + A1.6 + A1.12 + A1.13)

⭐ **The panel's best find (celebrated, not defended): the estate already owns the
war-ending vocabulary and its total classifier.** `WAR_ENDING_KEYS` is a closed eight-key
register (`warConvergenceContract.js:79-94` — the two punitive-sack keys kept separate
because "their ratio is itself evidence about the vengeance-license economy"), and
`warEndingClassifier.js` is a pure, TOTAL, precedence-declared mapping
(`WAR_ENDING_PRECEDENCE` `:64-73`, never-silently-buckets `:28-32`, closed unclassified
reasons `:81-85`) whose own docstring asks for exactly this ledger: "the census... decides
those and hands this module a finished fact record" (`:34-37`). The first draft's
ten-token `termination.family` register was a second vocabulary for the same quantity —
the §711.6 sibling class — and it DIES here. **The record persists the finished fact; the
ending is DERIVED at read through `classifyWarEnding` — one resolver, and a classifier
improvement retroactively improves every recorded war instead of stranding old tokens.**

```
ConcludedWarRecord {
  schemaVersion: 1,
  warId,                          // its own key, for consumers holding the record alone
  originPair: [lowId, highId],    // sorted settlement ids — the address
  originAttackerId,               // orientation (codepoint-first when mutual)
  mutual?,                        // true when reciprocal same-tick declarations folded (A1.9)
  openedTick, concludedTick,      // engine ticks; display derives turnings bands (§3.1)
  sealed,                         // A1.10: staged at first edge's close, SEALED at last;
                                  // immutability binds at seal (§2.4)

  participants: [                 // codepoint-sorted by id; small by construction
    { id,
      label,                      // the name AS IT STOOD at this party's conclusion —
                                  // the previousGovernments[].label precedent
                                  // (factionRename.js:282: recorded history, never
                                  // rewritten). Display resolves the LIVE name first
                                  // and falls back to label only when the id no longer
                                  // resolves (canon-departed, razed) — so renames
                                  // re-title and the departed stay nameable (A1.6).
      side: 'attacker'|'defender'|'attacker_ally'|'defender_ally',
      joinedTick?, leftTick?,     // allies; leftTick when an edge resolved pre-seal
      viaCallId? }                // the coalition anchor's callId, allies only
  ],

  casusReasons: [ {type, score, receipt, atTick?} ],  // COPIED VERBATIM from the origin
                                  // deployment's pins — the closed 16-type taxonomy
                                  // (warReasonTaxonomy.js:24-41) validates on load.
                                  // ⚠ A1.8: with warTerminationEnabled dark the pins
                                  // are the unvalidated LEGACY shape with no atTick
                                  // (warTermination.js:242-244) — the record stores
                                  // what the deployment carried, thinner where the
                                  // estate's own record was thinner; never invented.
  sacredAnchors?,                 // {attackerPatronRef?, defenderPatronRef?} — copied

  // ── THE FACT BLOCK — the persisted ClosedWarFact (warEndingClassifier.js:158-169),
  // written from what the writer's seam actually holds (§2.4). `ending` is NOT stored.
  // The typedef's attackerId/defenderId are NOT duplicated here — the read-side
  // adapter derives them from originAttackerId/originPair (one home per datum).
  fact: {
    closed: true,
    closeRoad,                    // the MECHANICAL road — a fact channel, not an ending
                                  // ranking. CANDIDATE register = the §1.3 roads with
                                  // road 1 fanned by its complete recalled.cause census
                                  // (§1.3 row 1's seven tokens) + 'attacker_lost' |
                                  // 'target_lost' | 'siege_abandoned' | 'conquest' |
                                  // 'razing' | 'wind_down'. An unmapped cause token
                                  // REDS the discovery arm (§4) rather than mis-filing.
    terminalOutcomes: [           // APPLIED outcomes only, post-verdict (A1.1): each
      { id, candidateType, targetSaveId, tick }   // — a dismissed conquest contributes
    ],                            // NO row here, so the classifier honestly yields a
                                  // non-conquest ending for it.
    loserDied?,                   // the harness died flag, when determinable
    coalitionFragmented?,         // pairwise-peace dissolution, when read
    seatTransitionFamily?,        // a governed WR-5 family when one closed it
                                  // (RULER_CHANGE_ENDING_FAMILIES, classifier :112-117)
    peaceReason?,                 // the deciding peace reason, when one was read
    treatyWritten?,               // a treaty document exists for the pair
  },

  victorId?,                      // absent for negotiated/dissolved ends — never ''
  terms?: [                       // peace-road wars: the authority-neutral clause list
    { type, family, good?, assetId?, durationTicks, magnitude }
                                  // — the carried-sheet clause SLIMMED (A1.12): burden01
                                  // and weightSpent (negotiation internals, raw 0..1 /
                                  // unitless — peaceTermsCarriedSheet.js:41-49) are
                                  // DROPPED; magnitude stays because its unit IS
                                  // declared: the TermRecord typedef binds it
                                  // ("bounded 0..1", peaceTermsCatalog.js) with
                                  // per-type share semantics, and ONE display
                                  // resolver bands it (treasuryShareWords, "A TERM'S
                                  // SHARE IN WORDS", peaceTermsDrafting.js:85-103) —
                                  // §711.6-clean; the page shows the band (§3.1).
  ],

  territorialOutcomes: [          // usually 0–1 rows
    { settlementId, kind: 'occupied'|'razed', occupierId?, tick,
      fallenSeatLabel? }          // A1.6: the governing label the conquest consumed —
                                  // the house R23's transfer-vs-overthrow story needs
  ],

  cost: {                         // BANDED — §711.6; capacity is not headcount and no
                                  // headcount is invented (the §826 row-3 law)
    attackerRemainingBand,        // final currentEffectiveStrength/maxStartStrength
                                  // through the estate's OWN 0..1 fraction ladder —
                                  // REMAINING_BANDS via attritionPhrase
                                  // (armyStrength.js:72-89). A1.13: the first draft
                                  // cited STRENGTH_BANDS, a 0..100 LATENT ladder —
                                  // a §711.6 unit fork caught by the panel.
    exhaustionBands: { [homeId]: warExhaustionBand word },  // warStatus.js:360-366
  },
  lastStanding?: {                // A1.5: OPTIONAL — the prior tick's
    causeBand, costToContinueBand,        // war_termination_read bands for this pair,
    costToStopBand, momentumBand,         // copied from pulseHistory's LAST record when
    homeFrontBand },                      // present (in hand at the seam — the last
                                          // record cannot have rolled off); absent
                                          // otherwise. Never required: readWarTerminations
                                          // sees only SURVIVORS on the closing tick
                                          // (warTermination.js:2-5; kernel :1292 runs
                                          // post-deletion), so a same-tick receipt for
                                          // the concluding pair does not exist.

  notableEngagements: [           // HARD CAP K=5, significance-ranked then tick-ordered
    { kind,                       // existing engagement-kind tokens — no new token
      tick, settlementIds,
      sourceEventId,              // kept as a SOFT reference (see §2.3)
      region? }                   // Q-W4 (§5): the field-battle site, as a settlement id
  ],                              // A1.5: NO headline field — see the prose law below.
}
```

**THE NO-PROSE LAW (A1.5 — cures five findings in one ruling).** The record stores NO
prose: no `termination.reason`, no copied headlines, no epitaph strings. Measured causes,
each fatal alone: (a) seven of the close roads emit no authored sentence at all — four
push the bare `'withdrawal'` token and roads 2/3/7 mint no outcome (`warDeployment.js:263,
:372, :395, :399, :623`; wind-down returns `outcomes: []`); (b) the one candidate voice,
`terminationReason`, is module-private, per-tick, and narrates a LIVE war's continuation
("so the war holds" — `warTermination.js:418-470`), and its receipt kind is under a
standing reader-facing refusal (`chroniclersLetter.js:123-125`); (c) copied prose freezes
settlement names against live renames, against NAME-1's own law ("No settlement name is
interpolated here; the pair is the ADDRESS" — `warAndRoadNames.js:93-96`); (d) copied
receipt prose can smuggle believed-layer numerics (the fought-blind clause,
`armyTransitKernel.js:597-599`). **Sentences are authored at RENDER time from the typed
facts and ids** — a closed, family-total prose table in the display leaf (the
WAR_NAME_POOLS / TERMINATION_PEACE_PROSE precedent, totality walker-asserted both
directions), resolving live names with the A1.6 label fallback. What is lost — per-receipt
narrative nuance — is priced and accepted; what is gained is one voice, rename-safe,
belief-clean, and a producer that actually exists for every family.

**What is deliberately NOT in the record:** `suePressure01` and every other ephemeral
control value (ephemerality is their design contract — `warTermination.js:8-11`); the
believed-vs-truth diagnostics and books internals (never persisted — the publicSafe
"never built" posture); raw strengths, raw scores, raw 0..1 anything (now honored by
A1.12's clause slimming and A1.13's fraction-band fix — the first draft violated its own
refusal twice, as the panel proved).

### 2.3 · Copy-then-reference — why the charter's ids-only roster is not honest here (amended under A1.16/A1.17)

The charter's record item asks for a "named engagements roster (ids only)"
(`docs/briefs/TRAIN-PACKETS.md:161-165`; the first draft argued against a phrase it had
itself minted — corrected, A1.16). **Measured: an ids-only roster cannot deliver what it
promises, because the receipt stream those ids address is `pulseHistory`, a
`MAX_HISTORY = 80` ring buffer (`worldState.js:15`) — a bare reference dies within 80
advances,** which on a 300-year world is ~99.5% of the timeline (wizard news likewise
caps at 240, `chronicleGraph.js:14-18`). The design therefore COPIES a minimal TYPED
epitome (kind, tick, ids, region — no prose, per A1.5) and KEEPS `sourceEventId` as a
soft reference: while the referent lives, the Herald can deep-link into the chronicle;
after it rolls off, the epitome still tells the story. This is a deliberate re-scope of
the charter's ids-only wording and gets its own owner row (**Q-M8**) rather than riding
silently. Same ruling for `terms` (treaties expire; `previousGovernments` is bounded).
**A Remembrance ledger may reference nothing whose lifetime it does not control** — which
is also why the record carries as-stood labels (A1.6): live names are themselves
references into a store whose membership the ledger does not control.

### 2.4 · One writer — placement is the whole design (REWRITTEN under A1.1 + A1.3 + A1.10 + A1.11)

The first draft anchored the writer "beside `applyDispositionDeltas`, AFTER the
dismissed-conquest residue strip" — **both halves of that anchor were false at the tree**
(`applyDispositionDeltas` has no kernel call site — its one kernel occurrence is a
comment at `pulseKernel.js:935`, the real disposition seam being
`advancePulseDisposition` at `:1582`; and the residue strips live inside
`@pulse-stage: mover_planes` at `:758`, which runs BEFORE `permission_and_apply` at
`:1486`). The rewritten placement:

**The writer is ONE function, `recordConcludedWars`, running in
`@pulse-stage: consequence_fold` (`pulseKernel.js:1556` — the stage that owns "secondary
ledgers"), gated OFF on a deferred tick, enrolled in the residue-strip registry.**

1. **It runs where the verdicts are knowable.** At consequence_fold the tick's
   dismissed/suppressed major ids (`conquestSuppressedIds`, derivable from
   `residueSuppressionIds` — `pulseKernel.js:270-296`) and the applied-outcome census are
   both in scope. Per A1.1, a dismissed conquest still CONCLUDES its war
   (`pulseKernel.js:262-266`) — the writer therefore ALWAYS writes a record for a
   concluded war, and the dismissal shapes the FACT block, never the existence of the
   record: a dismissed conquest's `fact.terminalOutcomes` carries no conquest row, so
   `classifyWarEnding` honestly yields a non-conquest ending for a war whose takeover
   did not stick.
2. **It never fires on a paused tick.** Under `deferMajors` every major is parked and no
   verdict exists (`pulseKernel.js:270-296`); a resume re-derives the tick from its
   pre-tick inputs by seed replay, so gating the write on `!deferMajors` makes the war
   record write EXACTLY ONCE, with real verdicts — the pause-path double-fire (a
   provisional first write made permanent by warId idempotency) is structurally
   impossible rather than patched.
3. **It enrolls in the machine-enforced registry anyway.** The kernel's law binds any
   layer banking out-of-band ledger residue: "a NEW layer that banks residue must add a
   strip + its marker + a registry entry, or the gate blocks"
   (`pulseKernel.js:298-309`, `RESIDUE_STRIP_SITES` `:145-150` — four rows today,
   `@enforced-by tests/domain/residueStripRegistry.test.js`). `recordConcludedWars` adds
   the FIFTH row: its strip is proven trivially byte-neutral (the defer gate means a
   paused tick banks nothing to strip), and the row pins the pause/dismiss
   byte-equivalence test that proves the invariant — "a paused world with no majors, and
   a resume that dismissed nothing, stay byte-identical to the single-pass
   autoresolve-ON tick."
4. **Every road reaches the writer, with its discriminator named** (A1.11 — the first
   draft's "one gate" overstated the carrier). The carrier
   `resolvedDeployments[{attackerId, deployment, targetId, outcome}]` collapses roads
   1/3/4/7 onto the one token `'withdrawal'`; the writer separates them from inputs it
   provably holds at consequence_fold: road 1 by `deployment.recalled.cause` (the
   complete seven-token census, §1.3 row 1); road 3 by the target's absence from the
   tick snapshot's canon; road 4 by matching the sibling `siege_abandoned` outcome id;
   road 7 by the kernel's own wind-down branch (`pulseKernel.js:1184-1204` — the
   dedicated else-branch the writer sits downstream of). Road 2 gains its missing push —
   `resolvedDeployments.push({..., outcome: 'attacker_lost'})`, FLAG-GATED per A1.8 —
   whose deploymentReturn containment is structural, not asserted: the return path
   `continue`s on a canon-absent home before any rng fork or credit
   (`deploymentReturn.js:331-333`, the panel's own verification). ⚠ Its third consumer
   is the real blast radius: `warReturnedSettlementIds` on the persisted pulse record
   (`pulseKernel.js:2805-2824`, under `coalitionLedgerActive`) — a declared lit-worlds
   byte shift, priced in Q-M5.

**Coalition folding (one war, one record):** joiners' resolutions fold onto the ORIGIN
pair — which is **sorted `{callerId, enemyId}` from the join anchor** (A1.9's correction:
`originAttackerId` is constrained to EQUAL one of those two, `warCoalitionLedger.js:100`,
so it carries orientation, not the pair) — with `originSinceTick` as the tick leg. The
SAME collapse law NAME-1 shipped (`warAndRoadNames.js:32-37`), one resolver. A joiner
whose origin record is somehow absent (imported mid-war saves) mints the record FROM the
anchor.

**THE SEAL LAW (A1.10 — cures the joiner-outlives-origin hole the panel proved).**
Deployment edges of one war terminate independently (each road is scoped to one row), so
a joiner's edge can outlive the origin pair's own. A record is therefore STAGED
(`sealed: false`) when its first edge concludes and SEALED (`sealed: true`) on the tick
no live deployment folds onto its warId — participants accumulate `leftTick`s in
between. **Immutability binds AT SEAL**: a sealed record is append-closed forever (THE
PROMISE; the factionRename recorded-history precedent, `factionRename.js:282-288`);
staged records accept exactly the two writes named here (a participant edge resolving;
the seal). The Remembrance door renders staged records honestly ("the war's last banners
have not yet come home"). Idempotency stands: the write is keyed by warId, so a re-fired
stale front (`occupation.js:958-965`) cannot double-mint.

### 2.5 · Size posture over a 300-year world — the honest divisor, and compaction dies (REWRITTEN under A1.4)

The first draft's "worst case" divided by `SIEGE_MAX_AGE = 60` — **a hard CEILING on
siege age (`warSiegeVerdict.js:131-137`: "the siege cannot outlive the ceiling") used as
a FLOOR on war length.** Roads 1, 2, 3 and 5 can all fire at deploymentAge 1
(`warDeployment.js:368-376, :394-396, :399-402, :876-881`), so the honest per-settlement
cadence floor is not 60 ticks but ~1 tick plus the re-mobilization ramp (a NEW siege
requires a war-ready posture rebuilt over prior ticks — the mobilization gate at
`warDeployment.js:993-1003` — plus the one-army law and `clearedAttackers` same-tick
lockout; the ramp length was NOT measured by this lane and is an input to the soak row
below). The honest table, at ~150 settlements over 15,600 ticks — where 150 is the
CURRENT SOAK-SCALE CORPUS, itself an assumption and not a product bound (P1.4's second
half): the table scales linearly in settlement count, and the owner should read it as
per-150, not as a ceiling:

| Cadence assumption | Records | At ~0.9 KB full form |
|---|---|---|
| 1 war/settlement/tick (no ramp — unreachable but the true ceiling) | ~2.3M | ~2 GB |
| 1 war/settlement/4 ticks (a short ramp) | ~585,000 | ~500 MB |
| 1 war/settlement/60 ticks (the first draft's "worst case") | ~39,000 | ~35 MB |
| Realistic (wars designed rare — exhaustion scars, confidence gates) | 10²–10³ | ≤1 MB |

**There is no structural bound the estate currently proves that yields a sane
worst-case ceiling by count alone** — that sentence, not a soothing constant, is what
the owner should see. And the first draft's escape hatch is DEAD: retroactive compaction
("older records fold to epitomes") was a retro-edit of concluded history — mutually
exclusive with the same list's own Q-M7 and the charter's "Append-only, immutable...
NO pruning ever (lived history)" (`docs/briefs/TRAIN-PACKETS.md:161-169`), as three
panel lenses independently proved.

**Proposed law (Q-M2, rewritten):** size is governed at WRITE time, never after.
1. Every war is recorded forever; **no record is ever rewritten, folded, or pruned.**
2. The record's FORM is decided ONCE, at seal, by a typed significance rule (CANDIDATE:
   full form when the war minted any terminal outcome (conquest/razing/siege_abandoned),
   carried terms, ran ≥ a floor of ticks, or involved ≥3 participants; EPITOME form —
   the same record minus `notableEngagements`, `lastStanding`, and `terms` detail,
   ~250 B — for the short trivial remainder, which is exactly the hypothetical flood
   class). Both forms are immutable from seal; nothing is ever demoted.
3. The rule's constants are tuning rows; **the honest table above ships to the owner's
   batch with the row**, and the terminal-soak measurement (wars-per-century at soak
   scale, ramp length measured) converts the cadence column from assumption to data
   before the constants are signed.
4. If the owner judges even the write-time governor insufficient, the fallback posture
   is epitome-by-default with full-form-by-significance — same machinery, stricter rule;
   the one thing not on the menu is retroactive history surgery.

### 2.6 · Schema and versioning under THE PROMISE

- Per-record `schemaVersion: 1` + a ledger normalizer `normalizeConcludedWars` — homed
  *(A1.16, corrected)* as a per-key branch INSIDE the `for (const key of
  CONDITIONAL_LEDGER_KEYS)` loop (`worldState.js:518-530` — the single existing per-key
  branch there is `envoyErrands`, the precedent), NOT beside `normalizeDeployments` in
  the base-key spread: the loop is what fixes the serialized key ORDER and enforces
  drop-when-empty via the `materialized !== undefined` contract, and a base-spread home
  would materialize the key unconditionally, breaking dormancy. It runs UNGATED like all
  load hygiene (the `:155-161` precedent). Casus types validate against the live
  taxonomy; unknown `closeRoad` tokens and unknown fact fields are PRESERVED verbatim
  (a newer build's record must survive a round-trip through an older reader — the
  forward-version museum fixture family covers this). The normalizer's key iteration is
  codepoint-sorted like every ledger rebuild — and because codepoint order over
  `war.<pair>.<tick>.<seq>` sorts ticks LEXICALLY, the record carries `openedTick` as a
  field (never parsed from the key) and every consumer orders by FIELD, not by key
  (A1.16, the panel's fold-determinism find, which the death of compaction otherwise
  moots).
- **Regen** *(A1.16 — the charter's own rule, now stated rather than assumed)*: "regen =
  a starting world has no concluded wars" — a regenerated world mints a fresh worldState,
  so the ledger starts empty by construction; the R5 fixture set gains an explicit regen
  arm proving it (the charter's A1.7-posture analogue), alongside save→load→undo
  round-trips and the forward-version row.
- No worldState schema bump: the ledger is additive and conditional (the standing
  additive-ledger law, `worldState.js:325-333`).
- **Old worlds: the ledger begins at its landing. No backfill, no invention.** The estate
  cannot reconstruct a pre-landing war (§1.5), and the SEAT-5 law binds harder here than
  anywhere: a Remembrance surface that fabricated a casus would be history-invention on
  the exact surface whose only value is honesty. `previousGovernments` conquest rows are
  NOT retro-minted into war records. What an old world's Remembrance door shows, honestly:
  the wars concluded SINCE the flag lit, plus one standing sentence for the dark past —
  "The chronicle of wars opens in this age; older wars left only their scars" — with the
  scars that DO survive (the contest record, conquest provenance, the exhaustion bands)
  linked under it. A pre-landing war that is STILL LIVE when the flag lights concludes
  normally and IS recorded (its deployment row still exists — nothing is invented).

---

## §3 · THE CONSUMERS — six doors, one ledger, and what each must NOT see

One derived read-side leaf (`domain/display/warMemory.js`, presentation-only, inert-not-
crash, the `warStatus.js` house pattern) owns ALL projections; no consumer touches the raw
ledger shape directly. One resolver per question:

### 3.1 · The Remembrance door (heraldRegister / HeraldRemembrance)

(REWRITTEN under A1.14.) The register grows a sibling lane: settlements have a
graveyard; wars get a CHRONICLE OF WARS beside it (wars are a sibling REGISTER, never a
fourth half of the settlement roster — J-D5's stasis reservation is untouched). ⚠ Build
dependency, stated: this door extends T11's register surfaces, which are UNLANDED
(`heraldRegister.js` is the ONE cited war file that differs at the landed tip
`19a8c9197` — 289 lines there, T11's DESK-1 columns absent); T11 lands before T12
builds (§826's queue), and the door's spec binds to T11's landed form. Each row is a
SENTENCE first (legibility law), authored at render from typed facts (A1.5):

> **the War of the Broken Pact** — Ashford against Kelby and its sworn allies, fought
> over a torn seal. Kelby fell to Ashford's banner that year. Concluded a few turnings
> back.

- **THE AS-OF-CONCLUSION TENSE LAW** *(A1.14 — the first draft's exemplar contradicted
  the world)*: every sentence renders the war's outcome as PAST FACT at its conclusion
  tick, never as present state — the engine reverses occupations
  (`occupation.js:969-970, :1012` delete liberated/collapsed entries and mint "the
  settlement reclaims its own authority"), and an append-closed record must never be
  made to assert a present it cannot track. "Kelby fell to Ashford's banner that year",
  never "Ashford's banner flies over Kelby". Current state, where a surface wants it,
  comes from the LIVE resolvers (`occupations`, `warStatus`) beside the record — two
  quantities, two resolvers, no second truth.
- The NAME comes from the NAME-1 namer — the ledger CURES its documented post-war
  degradation (`warAndRoadNames.js:26-30`): the record carries the casus type and pair
  forever. The namer stays render-time and write-nothing. **Repeat-war disambiguation is
  RULED, not left to the reader** *(A1.14)*: two same-pair same-casus wars render with an
  ordinal era clause from `openedTick`'s banded turning ("the elder war" / "the later
  war", or the display-calendar year-word where the surface carries one) — identical
  adjacent rows are refused, and a tick still never reaches the page.
- Time words: TURNINGS bands in the shape of `turningsAgoLabel` — which is
  module-private and hard-wired to the death verb ("Fell this turning."), so the door
  mints a MIRRORED SIBLING with its own verbs, the estate's stated pattern
  (`heraldWanderers.js:119`: "The bands mirror heraldRegister.turningsAgoLabel's shape
  so the two registers speak the same time"; `wanderingLabel`/`restingLabel` are the two
  existing siblings). Duration likewise banded, and the duration vocabulary REUSES the
  estate's own three-word war-length register where it grades ("most wars short, some
  long, a few generational" — `warConvergenceContract.js`, the WAR_DURATION bands) —
  never calendar arithmetic.
- **The audience ruling is FIELD-BY-FIELD** *(A1.14 — Q-M4's earlier form left four
  fields unclassified, a builder's guess)*. The table every surface implements
  (redaction = the field is never built into the row, the `heraldRegister.js:23-29`
  posture):

  | Record field | Every audience | Proven-owner only |
  |---|---|---|
  | pair, participants (ids+labels+sides), openedTick/concludedTick bands, casus TYPES, derived ending, victorId, territorialOutcomes (incl. fallenSeatLabel), mutual | ✓ | |
  | terms (type/family/good/assetId/duration words; magnitude via its catalog band) | ✓ | |
  | notableEngagements (kind, banded when, place names) | ✓ | |
  | casusReasons[].receipt strings, sourceEventIds, fact.* raw channels, lastStanding bands, cost bands' raw inputs | | ✓ |

  `lastStanding` is DM-tier by construction (it is the termination instrument's band
  set); the cost BANDS themselves (remaining/exhaustion words) ship to all — their raw
  inputs never render anywhere.

### 3.2 · Dossier war-history surfaces

A settlement's dossier asks ONE question — `warsInvolving(worldState, settlementId,
{sinceTick?, untilTick?})` — answered by the leaf with codepoint-stable ordering. The
dossier renders its wars as chronicle sentences (the settlementWorldChronicle idiom) and
deep-links each to the Remembrance row. The WAR tab (§805/§826: the BELIEVED live picture
with staleness bands) is UNCHANGED for live wars; concluded wars are settled public
history and join the dossier's past tense, not the believed present.

### 3.3 · Grudge and lesson writers (§810.8's family)

R23's TRANSFER-vs-OVERTHROW distinction ("whether the old house lives... is where decades
of story come from") needs a typed, dated, sided record of who lost what to whom — and
*(A1.14, panel-corrected on two counts)*: the `house_power_fell` family is UNBUILT today
(`grep -rn house_power_fell src` returns zero; it exists only in §810.8's charter text),
so these are hooks for TE-DENSITY-1's D-cars to consume when they build it, not wiring to
a live consumer; and the record now actually carries the house datum R23 names —
`territorialOutcomes[].fallenSeatLabel` (A1.6), copied from the governing label the
conquest consumed, the estate's one durable house trace (`rulingPower.js:78`, bounded
`MAX_PREVIOUS_GOVERNMENTS = 6` at `:355`). Offered hooks, all READ-side:
- grudge rows in the pair ledger (`factionPairStates`) may anchor `warId` in their
  receipts (an anchor, not a new write path);
- `house_power_fell` lessons minted at conquest/overthrow may cite the warId in their
  evidence binding (the W-LIVES receipts law: crossings/reversals/displacements carry
  evidence — a war is evidence);
- the `revanchism` casus scorer is the NATURAL future reader ("the War of Recovery" —
  currently scored without access to what was actually lost). ⚠ Rewiring `warReasons`'
  revanchism inputs onto the ledger is a SAME-SEED BEHAVIOR SHIFT and is explicitly OUT
  of W-MEM's scope — recorded as a follow-on candidate with its own declared-shift car
  (PLAUSIBLE benefit; the scorer's current inputs were not measured by this lane).

### 3.4 · The news layer

*(Amended under A1.8 and corrected under A1.14.)* The conclusion speaks where a closing
road authors an outcome (conquest, razing, siege_abandoned) — W-MEM adds NO second mouth
there (one-mouth law, `warDeployment.js:58-61`). But the panel is right that four roads
close silently (§2.2's no-prose law evidence), so for THOSE the ledger's Remembrance row
IS the first voice, authored at render — a read surface, still not a second news mouth.
The `warId` stamp on closing news rows is a WRITE into persisted pulse bytes and is
therefore FLAG-GATED under `warMemoryEnabled` and declared as part of the lit-worlds
shift (A1.8) — the Herald arc facet (`heraldIndex.js:155-162`, status `'pending'`) goes
populated only on memory-lit worlds. The address law is satisfied by what the outcomes
already carry.

### 3.5 · W-LIVES biography-as-query (GAP D, L7)

L7's biography surfaces answer "what has this figure lived through?" by QUERY, not by
persisted prose. The ledger contributes the wars: `warsInvolving(homeId, {interval})`
joined against the figure's lesson receipts by tick interval — "she came up during the
War of the Lean Years" is a JOIN, not a stored sentence. The leaf exposes the interval
query for exactly this; W-LIVES stores nothing war-shaped, W-MEM stores nothing
NPC-shaped. *(A1.14: both record forms keep `openedTick` and `concludedTick` as FIELDS —
the interval join survives the write-time epitome form, curing the panel's
compacted-wars-collapse-to-a-point find by construction.)* Belief scoping: concluded
wars are world facts (§3.1's ruling); a player-facing biography may cite them freely —
what stays DM-only is the diagnostic layer, which the ledger scopes per §3.1's table.

### 3.6 · Rumor and chronicle references (the chartered reader the first draft dropped — A1.14)

The charter's reader list names "rumor/chronicle references" (`docs/briefs/
TRAIN-PACKETS.md:170-172`). Delivered as references, not new machinery: the chronicle
surfaces (`settlementWorldChronicle`, `chronicleGraph`) may resolve a `warId` they
encounter on a news row into the record's rendered name and link (the arc facet's own
road, §3.4); the rumor layer's war-desk pools (`WAR_DESK_KINDS`, §761.3) may seed rumor
lines FROM sealed records ("they still speak of the War of the Lean Years") through the
same render-time prose leaf — a read, seeded and codepoint-stable, never a write into
the record. Both are follow-on wiring cars, listed so the reader is chartered rather
than dropped.

### 3.7 · The refusals (what no consumer gets)

No omniscient N×N war matrix (the DESK-4 refusal, §826, stands for the past as for the
present — surfaces answer addressed questions); no `suePressure01` or any revived control
value; no headcount casualties anywhere (never recorded — a surface cannot leak what the
estate refused to invent); no live-war reads from this ledger (live truth stays with
`warStatus.js` — one resolver per quantity, and this ledger's quantity is CONCLUDED wars
only; the two never overlap because the write happens at the tick the live row dies).

---

## §4 · DORMANCY AND FLAGS (REWRITTEN under A1.8)

- **The flag: `warMemoryEnabled`, enrolled in BOTH walker-enforced doors** — the first
  draft named neither and cited a precedent whose own text disclaims it ("DORMANCY IS
  STRUCTURAL, NOT A FLAG READ HERE", `warDeployment.js:731-735`; razing's family key sits
  in the manifest regardless). Corrected: `warMemoryEnabled` is a by-name `=== true`
  virtual key with no `DEFAULT_SIMULATION_RULES` entry and no preset spread, which is
  VERBATIM the class the fourth door governs — so it (a) joins
  `ENGINE_GATED_VIRTUAL_RULE_KEYS` (`simulationRules.js:158-184`, proved both ways by
  `tests/lint/engineGatedRuleKeys.walker.test.js`) with its certification row, and (b)
  joins `VIRTUAL_DORMANT_WRITERS` (`scripts/check-observed-shape-readers.mjs:1555-1613` —
  "a key written ONLY by a pulse writer standing behind a VIRTUAL simulation-rules
  flag"; an unenrolled row "CONVICTS... makes the whole scan throw"), where the
  `undercityHighWaterEnabled` row's reason — "it writes a real PERSISTED field... exactly
  what the exempt list refuses to shrug at" — is W-MEM's case precisely.
- **THE COMPLETE WRITE SET UNDER THE FLAG** *(A1.8 — the first draft's byte-identity
  claim was refuted by two ungated writes it proposed itself)*. Everything W-MEM adds is
  gated on `warMemoryEnabled === true`: the ledger write (`recordConcludedWars`), the
  road-2 `resolvedDeployments` push (Q-M5), and the `warId` stamp on closing news rows
  (§3.4). Dark ⇒ zero new writes anywhere ⇒ byte-identical. Lit ⇒ THREE declared
  serialized-byte shifts, enumerated for the owner rather than discovered later: the
  `concludedWars` key itself; `warReturnedSettlementIds` on coalition-lit pulse records
  now including road-2 ids (`pulseKernel.js:2805-2824`); `warId` on closing news rows
  (pulse/wizardNews bytes — a byte-identity golden surface, `factionRename.js:284`).
- **Dark means byte-identical**, proven at the raw-byte bar, not the canonical-form bar
  (§713.2; the dormancy oracle's absent≡{} tolerance is exactly the trap §759.4 named):
  1. same-seed corpus (the D1 precedent: ≥600 settlement-worlds, 6 tiers × 100 seeds),
     base vs tip with the flag ABSENT — serialized worldState hashes bit-identical;
  2. **anti-vacuity control** (the SEAT-1 law): the SAME comparator must see the lit run
     diverge — one lit fixture through a full war lifecycle; hash moves, key exists;
  3. base-dormant vs tip-dormant, never stale-artifact diffs (§713.2's comparing-nothing
     trap — the comparator's inputs are freshly generated both sides);
  4. greens LABELED: (1)+(3) are REGRESSION-grade; the DISCOVERY-grade arm (§711.4)
     drives one war down EACH of the seven roads — including every `recalled.cause`
     token of the complete census (§1.3 row 1) — and asserts the recorded `closeRoad`
     AND the classifier-derived ending for each; it REDS on an unmapped cause token,
     and it can red at its own tip only if the census is wrong, which is the red we
     want (a gate arm that reds at its own tip is a broken gate — the census was
     therefore completed BEFORE the register was frozen, A1.11).
  Plus the pause/dismiss byte-equivalence test the RESIDUE_STRIP_SITES row pins (§2.4.3).
- **Readers are never flag-gated** *(A1.8 — the first draft left this unspecified)*:
  history, once written, is readable regardless of the flag's present state. A
  RE-DARKENED world (lit → records → flag off) KEEPS its records and the door renders
  them, with the honest silence sentence for the post-darkening gap ("the chronicle
  falls silent after ⟨band⟩") — the same sentence class as §2.6's pre-landing gap.
  ⚠ This DIVERGES, deliberately and namedly, from the conditional-ledger DRAIN law the
  first draft's R6 mis-cited around (`tests/domain/tempoGovernorDormancy.byteIdentity
  .test.js:12-14, :170-183` — "a STRAY non-empty ledger (previously-lit governor, axis
  now off) DRAINS to dormant"): that law is for GOVERNOR state the engine re-derives;
  `concludedWars` is lived HISTORY, and draining it would be deleting the past. The
  divergence is a panel-attackable ruling, stated here so it is ruled once, not
  discovered as an inconsistency (Q-M7 carries it to the owner).
- **Flag interactions, stated:** the writer sits downstream of the kernel's wind-down
  else-branch (`pulseKernel.js:1184-1204`, panel-verified), so a lit `warMemoryEnabled`
  records road 7 on the very tick `warLayerEnabled` goes false. Lit-with-war-never-on is
  vacuous by construction. ⚠ Third-flag fidelity (A1.8): with `warTerminationEnabled`
  dark the casus pins are the LEGACY shape (no `atTick`, unvalidated —
  `warTermination.js:242-244`); the record stores what the estate stored, thinner where
  the estate was thinner (§2.2's casus note). Launch posture is the owner's walk
  decision, batched with the A1.2.12 family (Q-M3).

---

## §5 · THE Q-W4 REGION FIELD (granted — §762.5: "field-battle `region` persists as a settlement id, additive, sentinel-disciplined; rides a war-side car")

- **Today (CONFIRMED; count corrected under A1.15):** a field battle's site exists only
  inside prose — there is ONE authoring path, not two: `fieldBattleNews` is DEFINED at
  `armyTransitKernel.js:591` (the prose interpolation of `nameOf(snapshot,
  battle.region)` is `:597`, inside it) and CALLED once at `:909-913` (R-NAME3's
  ":596/:910" were the interpolation inside the one function and its single call site —
  a build briefed for two sites would hunt one that does not exist). The news row
  persists `settlementIds` (the two combatants) but NOT the place. Sieges never needed
  the row (the target IS the place — `resolveSettlementTerrain`), and
  `intervention_clash` carries its seat (`settlementIds[2]`, §761.2) —
  **`field_battle` alone carries the grant.**
- **The build (additive, sentinel-disciplined):** the in-memory `battle.region`
  settlement id (`col.region` at the one call site) is written as
  `region: <settlementId>` on the field-battle news row — present only when the transit
  layer resolved a region (ABSENT when unknown; never `''`, never a null sentinel).
  Dormancy is inherited for dark worlds (field battles exist only under the spatial
  armyTransit marker) — **and the shift it DOES cause is declared** *(A1.15)*: on lit
  spatial worlds that fight a field battle, the added key changes serialized wizardNews
  bytes, a byte-identity golden surface (`factionRename.js:284`) — a declared additive
  shift riding this car's landing, not a silent one.
- **Consumers:** NAME-3's engagement narrative gains the honest place from DATA (the
  PLACE RULE's field-battle gap closes); W-MEM's engagement epitome copies `region`
  (§2.2). **The display leaf RE-AUTHORS the place sentence from `region` at render**
  *(A1.15)* — "in ⟨name⟩'s approaches" is derived from the id via the NAME-1 render-time
  idiom, NEVER copied from the news row's `reasons[]`, which is exactly where the
  fought-blind DM receipt pushes a believed numeric (`armyTransitKernel.js:597-599`) —
  copying reasons to keep the sentence would persist a believed-layer number into a
  world-fact-tier record.
- ⚠ The two-terrain-vocabularies hazard (R-NAME3) binds any terrain derivation FROM the
  region id: resolve through `resolveSettlementTerrain` only — the id is persisted, a
  terrain class is not (persisting a class was the ask the recon shrank away from).

---

## §6 · RISK REGISTER + OPEN QUESTIONS FOR THE PANEL

### 6.1 · Claims ledger (attack these) — REVISED under A1; superseded rows marked

| # | Claim | Status |
|---|---|---|
| C1 | No durable post-war record exists at `b64dd5fdf`; SEVEN termination roads carried by FIVE delete statements (§1.3) | CONFIRMED (file:line in §1.3; count corrected under A1.11 — panel-verified by grep) |
| C2 | Road 2 (attacker-lost) leaves NO trace — no resolvedDeployments row, no outcome | CONFIRMED (`warDeployment.js:394-396`; re-verified by two panel lenses at the landed tip) |
| C3 | `pulseHistory` caps at 80; references into it die | CONFIRMED (`worldState.js:15`) |
| C4 | A dismissed conquest rolls back the TAKEOVER but the war still CONCLUDES — the war-layer resolution is intentionally kept | CONFIRMED (`pulseKernel.js:262-266` verbatim; `:1006` commits `war.deployments` unconditionally). REVISED under A1.1 — the first draft's reading ("writes nothing") was backwards |
| C5 | `warId` has one reader, no writer | CONFIRMED (`heraldIndex.js:155-162`; zero writers — re-verified at both surfaces) |
| C6 | The join anchor folds every joiner onto the origin pair — which is sorted `{callerId, enemyId}`, with `originAttackerId` as orientation only | CONFIRMED (`warCoalitionLedger.js:100, :109-121`; fold-key corrected under A1.9) |
| C7 | Size worst case: no structural per-count ceiling exists; the honest table is §2.5's (2.3M ceiling, cadence-dependent) | CONFIRMED arithmetic over CONFIRMED bounds; the cadence floor (ramp length) is UNMEASURED — the soak row converts it (A1.4; the first draft's 39,000 "worst case" divided by a ceiling and is DEAD) |
| C8 | The carried-sheet stripper's clause shape is reusable (slimmed per A1.12) for `terms` | PLAUSIBLE (shape read at `peaceTermsCarriedSheet.js:30-58`; the peace-road plumbing handing the sheet to the writer was not traced end-to-end — named build recon row) |
| C9 | `wizardNews` retention is bounded at 240 | CONFIRMED (`chronicleGraph.js:14-18`; promoted under A1.16) |
| C10 | The recall road's `recalled.cause` census is COMPLETE at seven tokens | CONFIRMED (§1.3 row 1, every site file:line; completed under A1.11 from the panel's 5-of-7 correction — `convoy_lost_debark`, `envoy_terms_carried_home` and `authority_verdict` verified this fold) |
| C11 | Occupation collapse/liberation is NOT a war conclusion and stays OUT of this ledger | Scope ruling, vetoable (unchallenged by the panel; the projection-tense consequence it creates is now ruled — §3.1's as-of-conclusion law) |
| C12 | The estate already owns the ending vocabulary + total classifier; the record persists its `ClosedWarFact` input and derives `ending` at read | CONFIRMED (`warConvergenceContract.js:79-94`, `warEndingClassifier.js:34-37, :64-73, :158-169`; A1.2) |
| C13 | The kernel's stage topology places residue strips PRE-apply (mover_planes) and secondary ledgers at consequence_fold; `applyDispositionDeltas` has no kernel call site | CONFIRMED (`pulseKernel.js:758, :1448, :1486, :1556, :2796` stage markers; `:935` comment-only; A1.3) |

### 6.2 · Known risks (REVISED under A1)

- **R1 · The two-truth risk.** `dispositionStats` and `concludedWars` both speak about
  martial pasts — and the contest record's writer set is WIDER than its help string
  (§1.4's amended census: occupation rungs/collapses, coalition settlement, treaty
  breach — sources W-MEM records nothing about). Cure: the two ledgers are never
  reconciled to each other; any dossier showing both labels the contest record with the
  full source list; the ledger is the only per-war truth.
- **R2 · Double-mint under re-fired conquests / imported duplicates.** Cure: warId
  idempotency + the seal law (§2.4).
- **R3 · The writer's plumbing at consequence_fold** (REWRITTEN under A1.3): the
  suppression-id set is block-scoped in mover_planes (`warOutcomeSuppressedIds`,
  `pulseKernel.js:944`), so handing the verdict census to a consequence_fold writer is
  NEW threading the build must design (carry the ids forward on the kernel's own
  locals, the pattern the stage already uses for its other folds). Still the
  highest-risk integration point; now with the true seam named and the residue-registry
  row as its machine-enforced tripwire. Its build car owes content-anchor citations,
  never `pulseKernel.js:<n>` literals (the line-address walker,
  `tests/lint/pulseKernelLineAddress.walker.test.js` — A1.16).
- **R4 · Size.** No per-count structural ceiling exists (C7); the write-time form
  governor (§2.5) plus the soak measurement are the controls; the owner sees the honest
  table.
- **R5 · Regen/undo/import lifecycle.** Undo is proven safe by the panel's own failed
  attack (wholesale worldState restore un-writes an undone tick's record); regen is
  ruled empty-by-construction with its fixture arm (§2.6); import/hydration rides the
  same normalizer hot and cold (`worldStateHydration.js:12-18`, panel-verified). The
  build still owes the fixture set: save→load→undo byte round-trip, regen-empty,
  forward-version museum row.
- **R6 · The re-darkened world** (RE-RULED under A1.8): records persist, readers render,
  the write stops, the silence sentence marks the gap — and the deliberate divergence
  from the governor-ledger drain law is stated in §4 and carried to the owner in Q-M7.
- **R7 · Staged records (the seal law's cost).** A record can sit `sealed: false` across
  saves while a joiner's edge outlives the origin's. Bounded by the same forces that
  end wars (every edge terminates — SIEGE_MAX_AGE ceilings sieges, wind-down and canon
  prunes catch the rest); the door renders staged records honestly; the normalizer never
  drops them. A staged record surviving with NO live matching deployment (an import
  artifact) is sealed by the normalizer with `closeRoad` preserved — stated so the
  builder does not invent a fourth state.

### 6.3 · Q-rows (owner's batch — persistence shapes propose, the owner disposes; renumbered under A1)

- **Q-M1 · The home, key, and registration**: `worldState.concludedWars` conditional
  ledger, appended last in `CONDITIONAL_LEDGER_KEYS`; object keyed
  `war.<low>.<high>.<openedTick>.<seq>`; landed in the SAME act as its deny-census
  classification (Q-M4), the four named test-pin updates, and the server-mirror
  migration note (§2.1 — the migration itself is owner-deploy-gated by nature).
  REC: grant.
- **Q-M2 · The growth law (REWRITTEN)**: size governed at WRITE time by a typed
  significance rule choosing full vs epitome form at seal — both immutable forever; no
  fold, no pruning, no retro-edit, ever; constants are tuning rows signed after the
  terminal-soak cadence measurement; §2.5's honest table attached. REC: grant the
  mechanism; sign constants at the tuning pass.
- **Q-M3 · The flag**: `warMemoryEnabled`, virtual key enrolled in both walker doors
  (§4), dark at landing; posture at the owner's walk with the A1.2.12 batch. Cost
  sentence unchanged: dark-at-launch means every war concluded before the flip is
  unrecorded forever (no backfill). REC: grant the key now; posture at the walk.
- **Q-M4 · The public-derivation decision (REWRITTEN to its real shape)**: the
  deny-census walker forces a classification (§2.1). REC: HARD-DENY at landing (the
  default every ledger but pantheon takes — the owner's own Remembrance door reads the
  owner session, not the public snapshot, so the door works day one), with the scrubbed
  public derivation — the second-ever allowlist entry, per §3.1's field table — as a
  named follow-on row the owner may grant with this batch or at the walk. The gallery
  consequence is stated either way: a public/gallery snapshot carries no war chronicle
  until the allowlist row lands — and, sharper (P4.6's import bite): a world IMPORTED
  from such a snapshot re-enters with an empty ledger, and its pre-import wars are then
  unrecorded FOREVER (no backfill, §2.6) even after the allowlist row lands; the §2.6
  honest-gap sentence covers them. Granting the allowlist row with this batch is what
  removes that loss class before it exists.
- **Q-M5 · Road-2 repair (AMENDED)**: the attacker-lost push, FLAG-GATED under
  `warMemoryEnabled`; blast radius fully named — three consumers, of which
  deploymentReturn's containment is structural (`deploymentReturn.js:331-333`) and
  `warReturnedSettlementIds` (`pulseKernel.js:2805-2824`) is a declared lit-worlds
  pulse-record byte shift. REC: grant; without it the ledger under-counts the
  strangest endings.
- **Q-M6 · Terms copy (AMENDED)**: the slimmed authority-neutral clause list
  (type/family/good/assetId/durationTicks/magnitude — `burden01`/`weightSpent` dropped,
  A1.12); the peace-road plumbing recon rides the build car (C8). REC: grant.
- **Q-M7 · Immutability + the history/governor divergence (AMENDED)**: sealed records
  are append-closed forever (staged records accept only the two seal-law writes, §2.4);
  a re-darkened world KEEPS its records — the named divergence from the
  conditional-ledger drain law (§4). REC: grant both halves together (they are one
  posture: history is never unwritten).
- **Q-M8 · NEW — the engagement epitome vs the charter's ids-only roster**: the charter
  says "named engagements roster (ids only)"; §2.3 proves ids-only dies with the
  80-ring and re-scopes to typed epitomes (no prose, A1.5) + soft id references.
  REC: grant the re-scope; the honest alternative (ids-only, knowingly dead references)
  is stated for completeness and not recommended.

### 6.4 · Explicitly out of scope for W-MEM (recorded, not dropped)

Rewiring `revanchism`/grudge scorers onto the ledger (declared-shift follow-on, §3.3) ·
building the `house_power_fell` lesson family (TE-DENSITY-1's; §3.3 offers the hooks) ·
any change to `warEndingClassifier`/`WAR_ENDING_KEYS` (consumed as-is; improvements are
the certification family's own cars — A1.2) · the occupation/liberation story (SEAT
trains) · any live-war surface change (T11's) · the `sea_battle` WAR_DESK pool (§764.2,
its own item) · stasis and the settlement register's third half (J-D5's parked design) ·
NPC-level war service records (W-LIVES; §3.5's query join is the contract) · the rumor/
chronicle wiring cars (§3.6 charters the reads; the cars ride later windows).

---

## AMENDMENT A1 — THE PANEL FOLD (chair-ordered; five lenses, all REFUTED; 40 MAJOR / 21 MINOR)

The skeptic panel outranks the volume. Every finding below was re-verified against the
tree by this lane before disposition — fresh evidence, not deference — and the fold's
verdict is: **the panel was right nearly everywhere it mattered.** No finding is fully
refuted; one carries a partial correction (P3.6) and one a narrative nuance (P5.12).
Several findings improved the design outright and are recorded as celebrations, not
concessions — above all P4.1 (the estate already owned the war-ending vocabulary and its
total classifier) and the three-lens convergence on the dismissal inversion.

Lens identities (from report content): **L1** charter-compliance & flag law · **L2**
reader-facing legibility & prose · **L3** conservation, units & one-resolver · **L4**
estate integration & lifecycle · **L5** kernel mechanics & verification.

### The rulings

- **A1.1 · THE DISMISSAL INVERSION (chair anchor 1; P3.2, P4.4, P5.1).** A dismissed
  conquest still concludes its war (`pulseKernel.js:262-266`, `:1006`). The writer
  ALWAYS records a concluded war; the dismissal shapes the FACT block (no applied
  conquest row), never the record's existence. §1.3 and §2.4 rewritten.
- **A1.2 · THE FACT RECORD, NOT A SECOND VOCABULARY (P4.1 — celebrated).** The
  ten-token `termination.family` register is DEAD. The record persists the estate's own
  `ClosedWarFact` (`warEndingClassifier.js:158-169`) plus the mechanical `closeRoad`
  fact channel; `ending` derives at read via `classifyWarEnding` — one resolver,
  retroactively improvable, the sack-ratio health metric preserved. §2.2 rewritten.
- **A1.3 · THE WRITER'S TRUE HOME (chair anchor 2; P1.5, P4.2, P4.3, P5.2, P5.11).**
  `@pulse-stage: consequence_fold`, gated `!deferMajors` (the pause double-fire dies
  structurally), enrolled as the FIFTH `RESIDUE_STRIP_SITES` row with marker and
  byte-equivalence pin. `applyDispositionDeltas` was a phantom anchor (comment-only in
  the kernel); the strips are pre-apply in mover_planes. §2.4 rewritten; R3 rewritten.
- **A1.4 · THE HONEST DIVISOR; COMPACTION DIES (chair anchor 5a; P1.3, P1.4, P3.4,
  P4.5, P5.5).** SIEGE_MAX_AGE is a ceiling, not a floor; no structural per-count
  ceiling exists and the owner sees that sentence plus the honest table. Retroactive
  compaction was a retro-edit of history, mutually exclusive with Q-M7 and the
  charter's NO-pruning law — replaced by the write-time form governor (full vs epitome
  decided ONCE at seal, both immutable). §2.5 rewritten; Q-M2 rewritten.
- **A1.5 · THE NO-PROSE LAW (chair anchor 3; P2.1, P2.2, P4.8, P5.3, P3.9(d)).** The
  record stores no sentences: seven close roads author nothing, `terminationReason` is a
  live-war continuation voice under a standing reader-facing refusal
  (`chroniclersLetter.js:123-125`), and copied prose freezes names and can smuggle
  believed numerics. Sentences author at render from typed facts; `cost.homeFrontBand`
  is re-sourced as the optional `lastStanding` copy of the prior tick's receipt bands;
  engagement epitomes drop `headline`. §2.2 rewritten.
- **A1.6 · AS-STOOD LABELS + THE FALLEN SEAT (P2.4, P4.9, P2.12, P3.9 jointly
  resolved).** Participants carry `label` (name-as-stood; the `previousGovernments[].
  label` recorded-history precedent); display resolves live-name-first with label
  fallback — renames re-title, the departed stay nameable. Conquest rows carry
  `fallenSeatLabel`, the house datum R23 names. §2.2 rewritten.
- **A1.7 · THE REGISTRATION EVENT (chair anchor 4; P3.7, P4.6, P5.4; with A1.8 and
  A1.12 it also resolves P1.10's Q-row recalibration).** The key lands
  WITH its deny-census classification, the four named test-pin updates, and the
  server-mirror migration note; "redaction = never built" is re-expressed as the
  hard-deny default plus a scrubbed public derivation as the second-ever allowlist
  candidate. §2.1 amended; Q-M1/Q-M4 rewritten.
- **A1.8 · THE COMPLETE WRITE SET + THE HISTORY/GOVERNOR DIVERGENCE (P1.1, P1.2, P4.7,
  P5.7, P5.16).** `warMemoryEnabled` enrolls in both walker doors
  (`ENGINE_GATED_VIRTUAL_RULE_KEYS`, `VIRTUAL_DORMANT_WRITERS`); every W-MEM write —
  ledger, road-2 push, news-row warId — is flag-gated; the three lit-worlds byte shifts
  are enumerated and declared; a re-darkened world KEEPS its records, a deliberate
  named divergence from the tempo-governor drain law. §4 rewritten.
- **A1.9 · THE KEY AND THE FOLD KEY (P3.5, P5.14, P5.15).** warId gains a `<seq>` leg;
  reciprocal same-tick declarations fold onto one `mutual: true` record; the coalition
  fold key is corrected to sorted `{callerId, enemyId}` (`originAttackerId` is
  orientation only, `warCoalitionLedger.js:100`). §2.1/§2.4 amended.
- **A1.10 · THE SEAL LAW (P3.3).** Records stage at first edge conclusion and seal when
  no live deployment folds onto the warId; immutability binds at seal; the
  joiner-outlives-origin hole closes without retro-editing sealed history. §2.4
  rewritten; R7 added.
- **A1.11 · THE CENSUS CORRECTIONS (chair anchor 5b; P2.3, P3.6, P5.6, P5.9).** Five
  delete statements carry seven roads; the recall-cause census is completed at seven
  tokens (`convoy_lost_debark` `navalKernel.js:509`, `envoy_terms_carried_home`
  `armyTransitKernel.js:1098`, `authority_verdict` `warRulingsEvidence.js:228` join the
  four measured earlier); each collapsed road's discriminator at the writer is named
  (recalled.cause / canon absence / siege_abandoned outcome id / the wind-down branch).
  The discovery arm asserts over the complete census so it cannot red at its own tip.
  §1.3 corrected; §2.4.4 rewritten. **victorId policy, ruled here:** occupier on
  conquest/razing; the successful defender on siege_abandoned (its banked win is the
  evidence, `warDeployment.js:670-673`); absent on every negotiated/dissolved/canon
  road.
- **A1.12 · THE SLIMMED CLAUSE (P5.10).** `terms` drops `burden01`/`weightSpent`
  (negotiation internals; raw 0..1 / undeclared units); `magnitude` stays under
  `TERM_CATALOG[type]`'s declared per-type unit. §2.2 amended.
- **A1.13 · THE RIGHT LADDER (P3.1).** `attackerRemainingBand` bands the 0..1 remaining
  fraction through `REMAINING_BANDS`/`attritionPhrase` (`armyStrength.js:72-89`) — the
  first draft's STRENGTH_BANDS cite was a 0..100 latent ladder, a §711.6 unit fork.
  §2.2 amended.
- **A1.14 · THE READER'S HALF (P2.5, P2.6, P2.7, P2.10, P2.11, P4.10, P1.9, P3.8,
  P2.12, P5.12).** The as-of-conclusion tense law; the field-by-field audience table;
  the mirrored turnings sibling (never reuse of the module-private label); the
  repeat-war ordinal-era ruling; both record forms keep openedTick/concludedTick as
  fields; the rumor/chronicle reader chartered (§3.6); R1's writer census widened;
  §3.3 corrected to unbuilt-family honesty; §3.1's T11-landing dependency stated.
- **A1.15 · Q-W4 CORRECTED (P2.8, P2.9, P5.8, P5.17).** One mint site, not two; the
  place sentence re-authors from `region` at render (never copied from `reasons[]` —
  the fought-blind believed numeric lives there); the lit-spatial wizardNews byte shift
  is declared. §5 rewritten in place.
- **A1.16 · HOUSEKEEPING CORRECTIONS (P1.7, P1.8, P3.10, P4.11, P4.12, P5.13).** The
  minted charter quote replaced with the real words; the regen-empty rule stated with
  its fixture arm; order-by-field-never-key folded into §2.6 (the compaction half of
  P3.10 is moot — compaction is dead); the normalizer homed in the conditional loop's
  per-key branch; C9 promoted (wizardNews caps at 240); build cars owe content-anchor
  citations for pulseKernel (the line-address walker; this volume lives in docs/,
  outside the walker's scope, and its build cars must not copy its citation style).
- **A1.17 · THE RE-SCOPE GETS ITS ROW (P1.6).** The epitome-vs-ids-only choice is now
  Q-M8, with the honest alternative stated.

### §A1.D · The disposition table — every finding, nothing dropped

Legend: **RW** = accepted, section rewritten · **RUL** = accepted as an A1 ruling ·
**COR** = accepted, correction applied · **MOOT** = accepted, mooted by another ruling's
rewrite · **PART** = accepted with a stated partial correction.

| ID | Sev | Finding (compressed) | Disposition |
|---|---|---|---|
| P1.1 | MAJ | Fourth-door/virtual-flag enrollment never named; wrong precedent | RW — §4 (A1.8) |
| P1.2 | MAJ | Two ungated writes refute byte-identical dormancy | RW — §4 write set (A1.8) |
| P1.3 | MAJ | Q-M2 compaction contradicts Q-M7/charter immutability | RW — §2.5 (A1.4) |
| P1.4 | MAJ | Worst case divides by a ceiling; 150 is not a product bound | RW — §2.5 (A1.4) |
| P1.5 | MAJ | Writer seam does not exist as described | RW — §2.4 (A1.3) |
| P1.6 | MAJ | Engagement epitome is an unrouted persistence re-scope | RUL — Q-M8 (A1.17) |
| P1.7 | MIN | Volume argues against a quotation it minted | COR — §2.3 (A1.16) |
| P1.8 | MIN | Charter's regen-empty rule unstated; "inherits" unproven | COR — §2.6 + R5 (A1.16) |
| P1.9 | MIN | Chartered rumor/chronicle reader undelivered | RW — §3.6 added (A1.14) |
| P1.10 | MIN | Q-row calibration soft both directions | RUL — Q-M4/Q-M6/Q-M7 recast (A1.7/A1.8/A1.12) |
| P2.1 | MAJ | termination.reason's producer narrates LIVE wars; standing refusal | RW — §2.2 no-prose law (A1.5) |
| P2.2 | MAJ | Four close roads emit bare tokens; seven families had nothing to copy | RW — §2.2 (A1.5) |
| P2.3 | MAJ | Carrier collapses roads 1/3/4/7 onto 'withdrawal'; discriminators unnamed | RW — §2.4.4 (A1.11) |
| P2.4 | MAJ | No names stored; canon-leave roads unnameable at the door | RW — labels (A1.6) |
| P2.5 | MAJ | Present-tense projection contradicts liberation | RW — §3.1 tense law (A1.14) |
| P2.6 | MAJ | Epitome drops openedTick; interval consumers break | MOOT — A1.4 forms keep both ticks (§3.5) |
| P2.7 | MAJ | Q-M4 leaves four record fields unclassified | RW — §3.1 field table (A1.14) |
| P2.8 | MIN | "Two mint sites" is one function + one call | COR — §5 (A1.15) |
| P2.9 | MIN | §5's promised sentence not derivable; reasons[] is a belief leak | RW — §5 re-author rule (A1.15) |
| P2.10 | MIN | turningsAgoLabel is private, death-verb-wired; claimed reuse impossible | COR — mirrored sibling (A1.14) |
| P2.11 | MIN | Repeat-war rows render identically; door owes a disambiguator | RUL — ordinal era clause (A1.14) |
| P2.12 | MIN | house_power_fell unbuilt; record omits the fallen house | RW — fallenSeatLabel + §3.3 honesty (A1.6/A1.14) |
| P3.1 | MAJ | Attrition band cites a 0..100 ladder for a 0..1 quantity | COR — REMAINING_BANDS (A1.13) |
| P3.2 | MAJ | "Dismissed conquest writes nothing" erases a genuinely ended war | RW — §1.3/§2.4 (A1.1) |
| P3.3 | MAJ | Joiner-outlives-origin: fold targets an append-closed record | RW — seal law (A1.10) |
| P3.4 | MAJ | 500-war fold is a retro-edit deleting §2.3's own must-copies | RW — compaction dead (A1.4) |
| P3.5 | MAJ | warId lacks a seq; same-pair/same-tick mutual declaration reachable | RW — seq + mutual (A1.9) |
| P3.6 | MAJ | "One gate" false; roads 3/7 separable only by unspecified re-derivation | **PART** — core accepted (discriminators now specified, A1.11); the sub-claim "road 3 emits no outcome AT ALL" conflates the two streams: road 3 pushes the carrier row (`warDeployment.js:399-402`), it is the OUTCOME stream it skips — the first draft's "road 2 is the only carrier bypass" stands (L1/L5's own verifications concur) |
| P3.7 | MAJ | "Never built" impossible for a persisted ledger; manifest unaddressed | RW — §2.1/Q-M4 (A1.7) |
| P3.8 | MAJ | R1's cure rests on an incomplete help string; 7+ writers; victorId unstated for siege_abandoned | RW — §1.4/R1 census + victorId policy (A1.11/A1.14) |
| P3.9 | MAJ | Copied prose freezes names; breaks NAME-1's no-interpolation law | RW — no-prose + labels (A1.5/A1.6) |
| P3.10 | MIN | Fold determinism unspecified; key order is insertion order; lexical tick sort | MOOT (fold dead) + COR — order-by-field law in §2.6 (A1.16) |
| P4.1 | MAJ | WAR_ENDING_KEYS + total classifier already exist; volume minted a rival | RW — §2.2 fact record (A1.2) ⭐ celebrated |
| P4.2 | MAJ | applyDispositionDeltas never called; strips are pre-apply; true home is consequence_fold | RW — §2.4 (A1.3) |
| P4.3 | MAJ | Writer is a residue-banking layer; RESIDUE_STRIP_SITES enrollment owed | RW — §2.4.3 (A1.3) |
| P4.4 | MAJ | Dismissal semantics: war still ends; record with non-conquest family | RW — (A1.1) |
| P4.5 | MAJ | Ceiling-as-floor arithmetic; ~60× under; both bounds mispriced | RW — §2.5 (A1.4) |
| P4.6 | MAJ | Key = registration event: 4 pins + deny census + server migration + import consequence | RW — §2.1/Q-M1/Q-M4 (A1.7) |
| P4.7 | MAJ | R6's precedent is a base key; drain-law precedent rules opposite; read side undefined | RW — §4 divergence named (A1.8) |
| P4.8 | MAJ | termination.reason has no source for 7 families; cited function private, wrong voice | RW — no-prose law (A1.5) |
| P4.9 | MIN | Durable ids, no durable names; road 2 born unnameable; rename re-titles | RW — labels (A1.6) |
| P4.10 | MIN | openedTick never reaches the page; collision cure overstated | RUL — ordinal era clause (A1.14) |
| P4.11 | MIN | Normalizer named beside the BASE spread; conditional loop is the legal home | COR — §2.6 (A1.16) |
| P4.12 | MIN | C9 promotable: wizardNews caps at 240 | COR — C9 CONFIRMED (A1.16) |
| P5.1 | MAJ | Dismissal read backwards (verbatim kernel semantics) | RW — (A1.1) |
| P5.2 | MAJ | Registry enrollment + pause double-fire (provisional write made permanent) | RW — defer-gate + fifth row (A1.3) |
| P5.3 | MAJ | homeFrontBand/reason unfillable at the seam (evaluator sees survivors only) | RW — lastStanding optional + no-prose (A1.5) |
| P5.4 | MAJ | Deny-census walker reds on the unclassified key; Q-M4 misses its real decision | RW — (A1.7) |
| P5.5 | MAJ | Ceiling-as-floor; ~40× under | RW — §2.5 (A1.4) |
| P5.6 | MAJ | Recall census 5-of-7; verdict cite was prose, not the stamp | COR — census complete, stamp site cited (A1.11) |
| P5.7 | MAJ | Q-M5 blast radius: three consumers; warReturnedSettlementIds byte shift | RW — §2.4.4/Q-M5/§4 (A1.8) |
| P5.8 | MAJ | Q-W4 "two mint sites" false | COR — §5 (A1.15) |
| P5.9 | MAJ | "Seven delete statements" is five; road 7 deletes nothing | COR — §1.3 (A1.11) |
| P5.10 | MAJ | terms clause carries burden01/unitless numerics against the record's own refusal | RW — slimmed clause (A1.12) |
| P5.11 | MIN | R3 pressed the panel toward a phantom call site | COR — folded into A1.3 |
| P5.12 | MIN | heraldRegister citations rot at the landed tip; table posture differs there | COR — §3.1 dependency note (A1.14); one nuance: the tip does not "strip" T11's columns — `19a8c9197` and T11's `b64dd5fdf` are parallel lines and T11 (which ADDS them) is simply unlanded; the dependency ruling is the same either way |
| P5.13 | MIN | pulseKernel.js:<n> literals are walker-banned in src/tests; cites rot | RUL — build cars use content anchors; volume is docs/-scoped (A1.16) |
| P5.14 | MIN | Fold key names orientation fields, not the pair | COR — sorted {callerId, enemyId} (A1.9) |
| P5.15 | MIN | Reciprocal same-tick opening is structurally reachable | RW — seq + mutual fold (A1.9) |
| P5.16 | MIN | Casus fidelity depends on a third flag (legacy shape when warTermination dark) | COR — §2.2 note + §4 (A1.8) |
| P5.17 | MIN | region field's lit-worlds wizardNews byte shift undeclared | COR — §5 declared (A1.15) |

**Disposition counts:** L1 6 MAJ + 4 MIN — all accepted · L2 7 MAJ + 5 MIN — all
accepted (one mooted by construction) · L3 9 MAJ + 1 MIN — accepted, one PARTIAL
(P3.6's road-3 sub-claim corrected with evidence) · L4 8 MAJ + 4 MIN — all accepted ·
L5 10 MAJ + 7 MIN — all accepted (one narrative nuance, P5.12). **Total: 61 findings,
61 dispositioned, 0 refuted outright, 0 dropped.** The panel's failed-attacks sections
were also folded: every volume claim they re-verified keeps its CONFIRMED grade on
their evidence as well as this lane's.
