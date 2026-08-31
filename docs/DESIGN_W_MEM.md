# DESIGN_W_MEM — the Remembrance-grade durable ledger of concluded wars

> **RESUME (lane T12 · W-MEM ARCHITECTURE, Fable seat, design-only):** §1 census WRITTEN ·
> §2 shape WRITTEN · §3 consumers WRITTEN · §4 dormancy WRITTEN · §5 Q-W4 WRITTEN ·
> §6 risks + Q-rows WRITTEN. Volume COMPLETE; awaiting the chair-run skeptic panel.
> Measurement surface: laneT11-tree @ `b64dd5fdf` (on `b85044099`; includes NAME-1's
> render-time war namers and T11's WAR tab). SEAT-1's occupation resolvers (`4e124fcdb`)
> are HOLDING-unlanded and cited only as forward context. All file:line receipts below
> resolve against `b64dd5fdf` unless a doc sha is given.

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

All seven deletion roads live in ONE file, `warDeployment.evaluateWarLayer` — but they are
seven `delete` statements, not one writer, and the file's own doctrine ("this head stays
the WRITER... the only file that mints outcomes and mutates the deployment / exhaustion
ledgers", `warDeployment.js:33-37`) is about mint authority, not about a durable record:

| # | Road | Site | What survives |
|---|---|---|---|
| 1 | Strategic recall (`recalled {cause, tick}` stamped by `stampDeploymentRecall`, `warIntent.js:313-324`). Measured cause tokens fan wide: `'sue_for_peace_decree'` (`realmVerbExecution.js:613`, `peaceReasons.js:735`), `'field_battle_retreat'` (`armyTransitKernel.js:936`, `convergence.js:666`), the chooser's sue-for-peace/return-home orders, and the verdict-dissolution family (`warRulingsNews.js:68`) | `warDeployment.js:368-376` | outcome `'withdrawal'`; NO disposition delta (a choice, not a defeat — though a field-battle retreat rides the same road) |
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

⚠⚠ **THE DISMISSAL TRAP (load-bearing for §2's writer placement).** Evaluate-time is NOT
conclusion-time. A conquest outcome can be DM-deferred/dismissed — "the takeover didn't
stick; the armies disperse" — and the estate already handles this atomically: the sack
rides the conquest outcome precisely so a dismissed conquest withholds it
(`warDeployment.js:778-798`), and disposition deltas carry `sourceConquestId` so the
kernel's residue strip can remove exactly the dismissed conquest's win/loss pair
(`warDeployment.js:856-871`; strip filter on `candidateType === 'conquest'`). **A war
record written at evaluate time would immortalize conquests that never happened.**

### 1.4 · What survives termination today — the complete durable inventory

- `worldState.dispositionStats` — the ratcheted W/L contest record. Explicitly NOT a war
  history: "not time at war or casualty accounting", and it counts trade-prize flips in
  the same ledger (`warStatus.js:33-39, 235-250`). Aggregate, unattributable to any war.
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
- `pulseHistory` receipts + wizard news — the 80-cap ring (§1.2).
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

**`warId` = `war.<stablePart(lowId)>.<stablePart(highId)>.<openedTick>`** — the sorted
ORIGINAL belligerent pair (the NAME-1 address, `warAndRoadNames.js:79-85`) + the origin
deployment's `sinceTick`. This finally mints the id `heraldIndex.js` already reads, and the
opening tick disambiguates the repeat war a century later — the collision NAME-1 had to
accept (`warAndRoadNames.js:27-29`) becomes a display CHOICE (a chronicler may still reuse
the name; the ledger never confuses the records).

### 2.2 · The record (every vocabulary a CANDIDATE register; every number banded or ticked)

```
ConcludedWarRecord {
  schemaVersion: 1,
  warId,                          // its own key, for consumers holding the record alone
  originPair: [lowId, highId],    // sorted settlement ids — the address
  originAttackerId,               // who marched first (sides need an orientation)
  openedTick, concludedTick,      // engine ticks; display derives turnings bands (§3.1)

  participants: [                 // codepoint-sorted by id; small by construction
    { id, side: 'attacker'|'defender'|'attacker_ally'|'defender_ally',
      joinedTick?,                // allies only
      viaCallId? }                // the coalition anchor's callId, allies only
  ],

  casusReasons: [ {type, score, receipt, atTick?} ],  // COPIED VERBATIM from the origin
                                  // deployment's pins — the closed 16-type taxonomy
                                  // (warReasonTaxonomy.js:24-41) validates on load,
                                  // exactly as normalizeDeployments already does
  sacredAnchors?,                 // {attackerPatronRef?, defenderPatronRef?} — copied

  termination: {
    family:                       // CANDIDATE register, closed (ten tokens):
      'conquest' | 'razing' | 'peace_accord' | 'recall' | 'field_retreat'
      | 'siege_abandoned' | 'dissolved_by_verdict' | 'attacker_lost'
      | 'target_lost' | 'wind_down',
                                  // The seven ROADS (§1.3) map onto this register
                                  // through one gate: road 1 fans by its
                                  // recalled.cause (sue_for_peace* → peace_accord,
                                  // return-home → recall, field_battle_retreat →
                                  // field_retreat, verdict → dissolved_by_verdict);
                                  // an unmapped cause token REDS the discovery arm
                                  // (§4) rather than mis-filing silently.
    victorId?,                    // absent for negotiated/dissolved ends — never ''
    reason,                       // the authored sentence the estate already wrote
                                  // (the outcome headline/reason at the closing road —
                                  // terminationReason's voice, warTermination.js:418-470)
    terms?: [CarriedClause]       // peace_accord only: the authority-neutral clause list,
                                  // produced by the EXISTING stripper
                                  // (carriedClauseFromDraft, peaceTermsCarriedSheet.js:30-58)
                                  // — one resolver; durations, never clocks; the exact
                                  // historical bargain, immune to treaty expiry
  },

  territorialOutcomes: [          // usually 0–1 rows
    { settlementId, kind: 'occupied'|'razed', occupierId?, tick }
  ],

  cost: {                         // BANDED — §711.6; capacity is not headcount and no
                                  // headcount is invented (the §826 row-3 law)
    attackerAttritionBand,        // from maxStartStrength vs final currentEffectiveStrength,
                                  // through the ONE existing band vocabulary the muster
                                  // roll already uses (STRENGTH_BANDS floors — §761.2)
    homeFrontBand,                // the last war_termination_read's homeFrontBand word
    exhaustionBands: { [homeId]: warExhaustionBand word },  // warStatus.js:360-366 —
                                  // the existing resolver, called at conclusion
  },

  notableEngagements: [           // HARD CAP K=5, significance-ranked then tick-ordered
    { kind,                       // the existing engagement-kind tokens (field_battle,
                                  // siege fall, harassment, …) — no new token minted here
      tick, settlementIds,
      headline,                   // the receipt's own authored headline, copied
      sourceEventId,              // kept as a SOFT reference (see 2.3)
      region? }                   // Q-W4 (§5): the field-battle site, as a settlement id
  ],
}
```

**What is deliberately NOT in the record:** `suePressure01` and every other ephemeral
control value (ephemerality is their design contract — `warTermination.js:8-11`);
the believed-vs-truth diagnostics and books internals (DM-instrument tier — they may be
carried under a DM-only sub-object ONLY if the panel asks, and are otherwise never
persisted, which is the publicSafe "never built" posture); raw strengths, raw scores,
raw 0..1 anything.

### 2.3 · Copy-then-reference — why "by reference to existing receipts" alone is impossible

The charter asks for notable engagements "by reference to existing receipts." **Measured:
the receipt stream is `pulseHistory`, a `MAX_HISTORY = 80` ring buffer (`worldState.js:15`)
— a bare reference dies within 80 advances,** which on a 300-year world is ~99.5% of the
timeline. The design therefore COPIES the minimal epitome (kind, tick, ids, headline —
~150 bytes) and KEEPS `sourceEventId` as a soft reference: while the referent lives, the
Herald can deep-link into the chronicle; after it rolls off, the epitome still tells the
story. Same ruling for `termination.reason` and `terms` (treaties expire;
`previousGovernments` is bounded). **A Remembrance ledger may reference nothing whose
lifetime it does not control.**

### 2.4 · One writer — placement is the whole design

**The writer is ONE function, `recordConcludedWars`, running at the pulse-kernel
POST-APPLY seam — beside `applyDispositionDeltas`, AFTER the dismissed-conquest residue
strip — never inside `evaluateWarLayer`.** Three measured facts force this placement:

1. **Evaluate-time lies under DM authority** (§1.3's dismissal trap): the estate's own
   precedents (the atomic sack ride, `warDeployment.js:778-798`; the `sourceConquestId`
   strip, `:856-871`) prove conclusions are only real post-apply. The war record joins
   that family: a dismissed conquest writes nothing, exactly as it sacks nothing.
2. **Every termination family already flows through one carrier** —
   `resolvedDeployments[{attackerId, deployment, targetId, outcome}]` — which carries the
   FULL deployment record (pins, anchors, strengths, blocks) at its last live moment.
   The writer consumes that bag plus the applied outcomes (for the conquest/razing/
   terms context) and the closing tick's world reads (exhaustion bands).
3. **Road 2 (attacker-lost, `warDeployment.js:394-396`) bypasses the carrier today.**
   The build adds one push — `resolvedDeployments.push({..., outcome: 'attacker_lost'})`
   — so all seven roads reach ONE gate, where the writer files each into the ten-token
   family register (§2.2's fan-out mapping). deploymentReturn must ignore the new
   outcome token (there is no home to return to); that containment is asserted against
   its routing, the §761.2 both-directions idiom.

**Coalition folding (one war, one record):** joiners' resolutions fold onto the ORIGIN
pair via `joinLedger[0].originAttackerId/originSinceTick` — the SAME collapse law NAME-1
shipped (`warAndRoadNames.js:32-37`), reused as the one resolver, never re-derived. A
joiner's own resolution updates the origin record's participant row; it never mints a
second record. A joiner whose origin record is somehow absent (imported mid-war saves)
mints the record FROM the anchor — the anchor carries exactly the origin pair + tick.

**Idempotency:** the write is keyed by `warId`; a re-fired stale front (the estate's known
re-conquest idempotency class, `occupation.js:958-965`) cannot double-mint. A record, once
written, is APPEND-CLOSED: nothing rewrites a concluded war (THE PROMISE's immutable lived
history; the factionRename precedent — recorded history is "a recorded statement", never
retro-edited, `factionRename.js:282-288`).

### 2.5 · Size posture over a 300-year world — honest arithmetic, then the ratchet

Bounds, all CONFIRMED: one outbound war per settlement at a time (the one-army law);
`SIEGE_MAX_AGE = 60` ticks hard ceiling (`warSiegeVerdict.js:137`); 300 years = 15,600
ticks; the current soak-scale corpus runs ~150 settlements (§809). **Worst case** —
every settlement perpetually at war, back-to-back minimum-length episodes: 15,600/60 × 150
≈ 39,000 records ≈ 25–60 MB at ~0.7–1.5 KB/record. **Realistic case** is orders of
magnitude lower (mobilization posture ramps, the exhaustion scar, HOSTILE_CONFIDENCE, and
the disposition ratchet all throttle re-mobilization — wars are designed to be rare), but
a persistence shape must price its worst case, not its hope.

**Proposed law (Q-M2, owner's pen):** every war is recorded forever, but not at one
resolution forever. Records hold FULL form for the most recent `FULL_RECORD_KEEP = 500`
wars (~0.5–0.75 MB); older records COMPACT deterministically (tick-ordered, oldest first)
to an EPITOME — identity, pair, participants (ids+sides), casus TYPES (receipts dropped),
termination family + victor, territorial outcomes, concludedTick (~180 bytes) — so the
worst case bounds at ~7-8 MB and the realistic case never compacts at all. Compaction is
a fold, never a delete: no war ever leaves the register (the Remembrance-door guarantee),
and the epitome retains everything §3's consumers below need except the prose and the
engagement list. The threshold is a tuning row, not a hardcode. **A soak measurement row
(wars-per-century at soak scale) is docketed for the terminal soak so the constant is
signed against data, not this estimate.**

### 2.6 · Schema and versioning under THE PROMISE

- Per-record `schemaVersion: 1` + a ledger normalizer `normalizeConcludedWars` in
  `worldState.js` beside `normalizeDeployments`, running UNGATED on every load (the
  deliberate `:155-161` precedent: persistence hygiene never hides behind a flag).
  Casus types validate against the live taxonomy; unknown termination-family tokens are
  PRESERVED verbatim (a newer build's family must survive a round-trip through an older
  reader — the forward-version museum fixture family covers this).
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

## §3 · THE CONSUMERS — five doors, one ledger, and what each must NOT see

One derived read-side leaf (`domain/display/warMemory.js`, presentation-only, inert-not-
crash, the `warStatus.js` house pattern) owns ALL projections; no consumer touches the raw
ledger shape directly. One resolver per question:

### 3.1 · The Remembrance door (heraldRegister / HeraldRemembrance)

The register grows its third lane: settlements have a graveyard; wars get a CHRONICLE OF
WARS beside it (the door's own header already frames the invariant as extensible —
"one roster, two halves" became three when stasis lands; wars are a sibling REGISTER, not
a fourth half of the settlement roster). Each row is a SENTENCE first (legibility law:
glance → sentence → table):

> **the War of the Broken Pact** — Ashford against Kelby and its sworn allies, fought
> over a torn seal. Ended in conquest; Ashford's banner flies over Kelby.
> Concluded a few turnings back.

- The NAME comes from the NAME-1 namer — and the ledger CURES its documented post-war
  degradation (`warAndRoadNames.js:26-30`): the record carries the casus type and pair
  forever, so a concluded war keeps its full name. The namer stays render-time and
  write-nothing; the ledger is its durable caller, not its replacement.
- Time words: TURNINGS bands via the existing `turningsAgoLabel` family
  (`heraldRegister.js:207-215`) — a tick never reaches the page. Duration likewise banded
  ("a war of a single turning" / "a long war of many turnings") — the Herald's own words,
  one new banded deriver beside the existing one, never calendar arithmetic.
- Secrets seam (§15, the door's own posture): the pair, name, sides, casus type,
  termination family, territorial outcome, and turnings bands are the world's own facts
  and ship to every audience — a concluded war is sung by heralds. What is NEVER BUILT for
  an unproven session: `sourceEventId`s, the casus `receipt` internals where they quote
  DM-authored causes, and any DM-instrument numerics. Redaction = field never built.

### 3.2 · Dossier war-history surfaces

A settlement's dossier asks ONE question — `warsInvolving(worldState, settlementId,
{sinceTick?, untilTick?})` — answered by the leaf with codepoint-stable ordering. The
dossier renders its wars as chronicle sentences (the settlementWorldChronicle idiom) and
deep-links each to the Remembrance row. The WAR tab (§805/§826: the BELIEVED live picture
with staleness bands) is UNCHANGED for live wars; concluded wars are settled public
history and join the dossier's past tense, not the believed present.

### 3.3 · Grudge and lesson writers (§810.8's family)

R23's TRANSFER-vs-OVERTHROW distinction ("whether the old house lives... is where decades
of story come from") needs exactly what this ledger holds: a typed, dated, sided record of
who lost what to whom and why. Offered hooks, all READ-side:
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

The conclusion already speaks — every closing road mints its outcome with headline,
reason, and settlementIds (§1.3). W-MEM adds NO second mouth (one-mouth law, the razing
precedent `warDeployment.js:58-61`). Two additive touches only: the closing news row
carries `warId` (the Herald arc facet goes from `'pending'` to populated — its reader
exists today, `heraldIndex.js:155-162`), and the address law is satisfied by what the
outcomes already carry (subject chain, typed action, affected settlements, reason).

### 3.5 · W-LIVES biography-as-query (GAP D, L7)

L7's biography surfaces answer "what has this figure lived through?" by QUERY, not by
persisted prose. The ledger contributes the wars: `warsInvolving(homeId, {interval})`
joined against the figure's lesson receipts by tick interval — "she came up during the
War of the Lean Years" is a JOIN, not a stored sentence. The leaf exposes the interval
query for exactly this; W-LIVES stores nothing war-shaped, W-MEM stores nothing
NPC-shaped. Belief scoping: concluded wars are world facts (§3.1's ruling); a player-
facing biography may cite them freely — what stays DM-only is the diagnostic layer,
which the ledger does not persist at all (§2.2).

### 3.6 · The refusals (what no consumer gets)

No omniscient N×N war matrix (the DESK-4 refusal, §826, stands for the past as for the
present — surfaces answer addressed questions); no `suePressure01` or any revived control
value; no headcount casualties anywhere (never recorded — a surface cannot leak what the
estate refused to invent); no live-war reads from this ledger (live truth stays with
`warStatus.js` — one resolver per quantity, and this ledger's quantity is CONCLUDED wars
only; the two never overlap because the write happens at the tick the live row dies).

---

## §4 · DORMANCY AND FLAGS

- **The flag: `warMemoryEnabled`** (rules-family key; NO `DEFAULT_SIMULATION_RULES` entry
  ⇒ absent ⇒ dark — the razing-doctrine idiom, `warDeployment.js:731-735`). It gates the
  WRITE — `recordConcludedWars` returns the input untouched when dark — which is the whole
  dormancy story, because the writer is the only producer and the ledger key is
  conditionally materialized (absent ⇒ omitted ⇒ byte-identical serialization).
- **Dark means byte-identical**, proven at the raw-byte bar, not the canonical-form bar
  (§713.2; the dormancy oracle's absent≡{} tolerance is exactly the trap §759.4 named):
  1. same-seed corpus (the D1 precedent: ≥600 settlement-worlds, 6 tiers × 100 seeds),
     base vs tip with the flag ABSENT — serialized worldState hashes bit-identical;
  2. **anti-vacuity control** (the SEAT-1 law): the SAME comparator must see the lit run
     diverge — run one lit fixture through a full war lifecycle and confirm the hash moves
     and the ledger key exists;
  3. base-dormant vs tip-dormant, never `out/`-style stale-artifact diffs (§713.2's
     comparing-nothing trap — the comparator's inputs are freshly generated both sides);
  4. the greens are LABELED: (1)+(3) are REGRESSION-grade; the DISCOVERY-grade proof
     (§711.4) is a lit fixture driving one war down EACH of the ten termination families
     and asserting one record with the right family token each — an arm that can actually
     discover a mis-filed conclusion, and that REDS on an unmapped `recalled.cause` token.
- Reader dormancy is free: every projection is inert-not-crash on an absent key (the
  `warStatus.js` contract), so dark worlds render today's pixels.
- **Flag interactions, stated:** the write path runs at the post-apply seam, so it sees
  wind-down resolutions even on the tick `warLayerEnabled` goes false — a lit
  `warMemoryEnabled` records road 7 with family `'wind_down'` (the alternative — gating
  the write on the war layer — would lose exactly the conclusions a mid-campaign toggle
  creates, which are the ones a reader will ask about). `warMemoryEnabled` lit with the
  war layer never-on is vacuous by construction (no deployments ⇒ no conclusions).
  Launch posture (lit-in-which-presets) is the owner's walk decision, batched with the
  A1.2.12 family (Q-M3).

---

## §5 · THE Q-W4 REGION FIELD (granted — §762.5: "field-battle `region` persists as a settlement id, additive, sentinel-disciplined; rides a war-side car")

- **Today (CONFIRMED):** a field battle's site exists only inside prose —
  `fieldBattleNews` interpolates `nameOf(snapshot, battle.region)` into a reasons string
  (`armyTransitKernel.js` ~`:596`) and the second authoring site (~`:910` family, per
  R-NAME3) does the same; the news row persists `settlementIds` (the two combatants) but
  NOT the place. Sieges never needed the row (the target IS the place —
  `resolveSettlementTerrain`), and `intervention_clash` carries its seat
  (`settlementIds[2]`, §761.2) — **`field_battle` alone carries the grant.**
- **The build (additive, sentinel-disciplined):** the in-memory `battle.region` settlement
  id is written as `region: <settlementId>` on the field-battle receipt row at its two
  mint sites — present only when the transit layer resolved a region (ABSENT when
  unknown; never `''`, never a null sentinel). Dormancy is inherited: field battles exist
  only under the spatial armyTransit marker, so the field is born inside an
  already-conditional surface — aspatial and dark worlds are untouched by construction.
- **Consumers:** NAME-3's engagement narrative gains the honest place from DATA (the
  PLACE RULE's field-battle gap closes — terrain speaks because the record now holds a
  place); W-MEM's engagement epitome copies `region` (§2.2), so "the field between X and
  Y, in Z's approaches" survives the ring buffer.
- ⚠ The two-terrain-vocabularies hazard (R-NAME3) binds any terrain derivation FROM the
  region id: resolve through `resolveSettlementTerrain` only — the id is persisted, a
  terrain class is not (persisting a class was the ask the recon shrank away from).

---

## §6 · RISK REGISTER + OPEN QUESTIONS FOR THE PANEL

### 6.1 · Claims ledger (attack these)

| # | Claim | Status |
|---|---|---|
| C1 | No durable post-war record exists at `b64dd5fdf`; seven deletion roads, sites as tabled in §1.3 | CONFIRMED (file:line in §1.3) |
| C2 | Road 2 (attacker-lost) leaves NO trace — no resolvedDeployments row, no outcome | CONFIRMED (`warDeployment.js:394-396` — `delete` + `continue`, nothing pushed) |
| C3 | `pulseHistory` caps at 80; references into it die | CONFIRMED (`worldState.js:15`) |
| C4 | Evaluate-time conquests can be DM-dismissed; the estate strips their residue post-hoc | CONFIRMED (`warDeployment.js:778-798, 856-871`) |
| C5 | `warId` has one reader, no writer | CONFIRMED (`heraldIndex.js:155-162`; writer grep zero in src) |
| C6 | The join anchor suffices to fold every coalition joiner onto the origin pair | CONFIRMED for the anchor's fields (`warCoalitionLedger.js` normalizeJoinAnchor); the fold LOGIC is NAME-1's shipped law reused |
| C7 | Worst-case 300-year record count ≈ 39,000 | PLAUSIBLE (arithmetic from CONFIRMED bounds; realistic rate unmeasured — soak measurement row docketed, §2.5) |
| C8 | The carried-sheet stripper is reusable verbatim for `termination.terms` | PLAUSIBLE (shape read at `peaceTermsCarriedSheet.js:30-58`; the peace-road plumbing that would hand the sheet to the writer was not traced end-to-end by this lane) |
| C9 | `wizardNews` retention is also bounded (the field-battle news rots like pulseHistory) | PLAUSIBLE (cap not located this lane; the design does not depend on it — epitomes are copied regardless) |
| C10 | The recall road's `recalled.cause` vocabulary is closed | PARTIALLY CONFIRMED: the stamp shape and four cause tokens are measured (`stampDeploymentRecall` `warIntent.js:313-324`; `'sue_for_peace_decree'` ×2, `'field_battle_retreat'` ×2 at the callers in §1.3 row 1); the chooser's own order causes were not exhaustively enumerated — the writer's fan-out mapping REDS on an unmapped token (§4) rather than mis-filing |
| C11 | Occupation collapse/liberation is NOT a war conclusion and stays OUT of this ledger (it ends an occupation, not a war; SEAT-5/SEAT-6 own that story) | Scope ruling, vetoable |

### 6.2 · Known risks

- **R1 · The two-truth risk.** `dispositionStats` and `concludedWars` both speak about
  martial pasts. Cure written into §1.4/§3.6: the contest record keeps its own label and
  help text (explicitly "not time at war"); the ledger is the only per-war truth; no
  surface derives one from the other.
- **R2 · Double-mint under re-fired conquests / imported duplicates.** Cure: warId
  idempotency + append-closed records (§2.4).
- **R3 · The writer's inputs span the apply boundary** (resolvedDeployments from
  evaluate, dismissal verdicts from apply). The post-apply placement (§2.4) is the cure,
  and it is the single highest-risk integration point of the build — the panel should
  press hardest here (exact kernel line, ordering against `applyDispositionDeltas`,
  behavior under pausedAdvance).
- **R4 · Size drift.** The compaction ratchet (§2.5) bounds it; the soak measurement row
  converts the estimate into a signed constant.
- **R5 · Regen/undo/import lifecycle.** The ledger rides worldState, so it inherits the
  existing snapshot/undo/import machinery — but the build owes the explicit round-trip
  fixtures (record → save → load → undo → identical bytes; the forward-version museum
  row for an unknown family token), per the §2 lifecycle law.
- **R6 · A dormant-looking partial state:** flag lit → wars recorded → flag DARKENED.
  The key now holds records while the writer sleeps. Ruled: the ledger PERSISTS (it is
  history, exactly like the deliberately-kept warExhaustion scar on wind-down,
  `warDeployment.js:255`); dormancy proofs use never-lit worlds, not re-darkened ones.

### 6.3 · Q-rows (owner's batch — persistence shapes propose, the owner disposes)

- **Q-M1 · The home and key**: `worldState.concludedWars` conditional ledger, appended
  last in `CONDITIONAL_LEDGER_KEYS`; object keyed `war.<low>.<high>.<openedTick>`.
  REC: grant.
- **Q-M2 · The forever-growth law**: full records for the most recent 500 wars, older
  records fold to epitomes deterministically, nothing ever deleted; threshold is a
  tuning row. REC: grant with the soak measurement row attached.
- **Q-M3 · The flag**: `warMemoryEnabled`, dark at landing, launch posture decided at the
  owner's walk with the A1.2.12 batch. The cost sentence, stated per that batch's law:
  dark-at-launch means a launched user's Remembrance door never gains the war lane and
  every concluded war before the owner's flip is unrecorded forever (§2.6's no-backfill
  law makes the loss permanent). REC: grant the key now; posture at the walk.
- **Q-M4 · Audience scoping**: concluded wars are world facts (pair, name, sides, casus
  type, family, territory, turnings); receipts-internals and any DM-instrument fields are
  never built for unproven sessions. REC: grant (the §15/§826 travel-times precedent).
- **Q-M5 · Road-2 repair**: the attacker-lost drop gains a resolvedDeployments row so the
  one gate sees all ten families (§2.4.3) — a behavior-visible addition inside the war
  layer (a new outcome token flows to deploymentReturn's routing, asserted-contained).
  REC: grant; without it the ledger silently under-counts exactly the strangest endings.
- **Q-M6 · Terms copy**: a peace-accord record copies the authority-neutral clause list
  via the existing stripper (C8). REC: grant.
- **Q-M7 · Record immutability**: records are append-closed at write; no editor surface,
  no retro-edit, ever (THE PROMISE). REC: grant — and the panel should confirm this
  clears the regen-edit-loss hazard by construction (nothing user-authored lives here).

### 6.4 · Explicitly out of scope for W-MEM (recorded, not dropped)

Rewiring `revanchism`/grudge scorers onto the ledger (declared-shift follow-on, §3.3) ·
the occupation/liberation story (SEAT trains) · any live-war surface change (T11 landed
it) · the `sea_battle` WAR_DESK pool (§764.2, its own item) · stasis and the settlement
register's third half (J-D5's own parked design) · NPC-level war service records
(W-LIVES; §3.5's query join is the contract).
