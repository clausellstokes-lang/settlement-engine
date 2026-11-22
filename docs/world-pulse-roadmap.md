# World Pulse — refinement & extension roadmap

Findings + plan from the deep review of `src/domain/worldPulse/`. The engine's
architecture is sound (deterministic, explainable, DM-canon, bounded); this is
refinement, coherence-closing, and depth — not a redirect.

**Status refresh (2026-06-11, verified against code + suites by the regional
audit — see `docs/REGIONAL_ENGINE_AUDIT.md`):** every phase below is
**implemented, wired, and tested green** except 4d. That includes the items the
sections still mark [next]: 1a (canonicalSpreadChannel + confirmed-only
spreadTargetsFor, pinned by `stressorChannels.test.js`), 1b (now threaded
through the orchestrators; the graph/news helper residue was closed by Regional
wave R4), 1c (internalSeats populated, `factionCompetition.js`), 2a
(volatility dial, `worldPulseVolatility.test.js`), 2b (mean-reversion relax
passes), 2c (goal culmination, `npcGoalCulmination.test.js`), 2d
(`realmEvents.js` + pressure feedback), 3a (`worldPulseSoak.test.js`), 4b
(`flows.js` + `populationDynamics.js`, `flows.test.js`), 4c (`reconcile.js`,
`chronicleAndReconcile.test.js`), and 4a end-to-end (the
`generate-chronicle` edge function exists in-repo with the client hook and
credit cost). Full domain+store suite at refresh time: 2,029+ tests green.
**Genuinely remaining:** Phase 4d (NPC/relationship chronicle UI — the data is
captured; no surface reads `relationshipState.history`/`recentIncidents`).
Section bodies below are kept for design rationale; trust this block and the
audit for status.

**Status refresh (2026-09-15, LONG TAIL #39 — every figure below MEASURED at the
build slot `claude/composite-r4`, not carried forward):** Phase 4d is **landed**,
and the TEN stale `[next]` markers the 2026-06-11 block already contradicted
(1a, 1b, 1c, 2a, 2b, 2c, 2d, 3a, 4b, 4c) are flipped in the bodies below, each
against the address that was checked. 4a is the eleventh item that block covers
and it is NOT flipped: it is `[backend]`, it is built, and its deploy is
outstanding — see the end of this block. Nothing else about the 2026-06-11 block
changes.

**4d, as built.** The record named two archives; the slot carries **six** on every
relationship edge, all bounded, all persisted, all written by
`ensureRelationshipState` — `recentIncidents` (cap 8), `history` (12),
`turningPoints` (24), `allianceCalls` (24), `coalitionSettlements` (24),
`hierarchyResolutions` (6). `turningPoints` / `allianceCalls` /
`coalitionSettlements` exist precisely because a busy border evicts the alliance
that explains the present posture, so they are the archive a "what this alliance
survived" page must read. The surface is
`src/components/map/RelationshipChronicleSection.jsx`, over the pure read model
`src/domain/display/relationshipChronicle.js`, mounted in the Herald's existing
War door beside DESK-4's `PerspectiveStandings` — that desk says what a
settlement's standings ARE, this says what they SURVIVED. The NPC half is
`src/components/map/NpcTrailSection.jsx` over `npcInteriorityRead`'s DM block,
and it renders the LADDER'S dated record (`contests`, `seatTransitions`) because
`npcStates` still carry no history array at all: no trail was minted, which is
what "NPCs have a thinner trail" meant. Both surfaces are READ-ONLY — no new
persisted field, no store-shape change — and both are fail-closed DM gates.

⛔ **TWO THINGS A LATER READER WOULD OTHERWISE RE-FIND, recorded once here.**

1. **`buildRelationshipPostures`' `recentMemory` IS NOT THE CHRONICLE, and it
   looks exactly like it.** `relationshipMemory.memoryEntry` returns null whenever
   `relationshipMemoryWeight` is 0, and that weight is 0 for an undated row and
   for anything older than `RELATIONSHIP_MEMORY_MAX_LOOKBACK_TICKS = 24`. It is a
   24-tick DECAY WINDOW for classifying a present posture. Driven side by side on
   a world whose only history is a turning point 40 ticks old, `recentMemory`
   returned `[]` while the chronicle returned the line. A surface built on it
   silently forgets exactly what it was asked to remember.
2. **A relationship key is not a pair.** `relationshipKeyFromEdge` returns
   `edge.id` whenever the edge carries one, so `rel.a.b` splitting works until it
   does not. Settlement names must come from the edge's own from/to or from the
   record's id-bearing fields — never from the key string, and never from
   `chronicleGraph.entityKeysOf`, which SPLITS the key on `/[:|>-]+/` on purpose
   to widen inferred linkage and therefore launders `edge-77` into the tokens
   `edge` and `77`.

**4a is unchanged and still owes exactly one thing, which is not ours.** The whole
chain is in-repo and measured: `supabase/functions/generate-chronicle/index.ts`
(430 lines, with its 462-line test beside it), the pure grounding
`src/domain/worldPulse/chronicle.js` (140), the client hook
`src/lib/campaignChronicle.js` (58), the button in `WizardNewsPanel.jsx`, and the
credit cost pinned to `src/config/pricing.js`. **THE DEPLOY HAS NOT HAPPENED AND
IS THE OWNER'S** — `npx supabase functions deploy generate-chronicle`
(`docs/DEPLOY.md`), plus `ANTHROPIC_API_KEY` in the Supabase dashboard. No work in
this lane touched it.

Status legend: **[done]** landed + tested · **[next]** domain work, behavior-
changing (needs reconciliation against the pinned worldPulse/regional test
suites) · **[backend]**/**[ui]** outside the pure-domain lane.

---

## Phase 0 — Party as a first-class actor  **[done]**

> "The world pulses autonomously, but in a TTRPG the party is the main causal
> force … the difference between a world that runs beside the table and a world
> the table changes."

`src/domain/worldPulse/partyImpact.js` (+ `resolveStressorById` /
`adjustStressorSeverityById` in `stressors.js`, `recordPartyImpact` in
`campaignSlice.js`, `tests/domain/partyImpact.test.js`).

A DM-declared party outcome becomes an **authoritative, party-tagged** pulse
input that flows through the existing `applyWorldPulseOutcomes` pipeline (so
regional propagation + Wizard News come for free). Because the DM is asserting
canon, party impacts **auto-apply** (no roll) and relationship label changes
apply immediately rather than queuing.

Kinds: `resolve_stressor` (broke the siege → ends it + leaves residual scars),
`ease_stressor` / `worsen_stressor`, `broker_relationship` / `inflame_relationship`
(ladder shift hostile↔allied + vector patch + edge relabel), `clear_condition`
(cured the plague), `impose_condition`, `bolster_/undermine_faction`,
`empower_npc`, `remove_npc` (assassinated the patron → `dominant_npc_removed`
leadership void). Pure, deterministic, invalid actions are a safe no-op.

---

## Phase 1 — Correctness (bugs found in review)

### 1a. Stressor channel vocabulary + confirmed gating  **[done]**  (task #27)
*Landed: `canonicalSpreadChannel` in `stressorsCore.js` + `stressors.js`; pinned by `tests/domain/stressorChannels.test.js` (183 lines). Measured 2026-09-15.*
`STRESSOR_CATALOG.spreadChannels` uses names that aren't in
`REGIONAL_CHANNEL_TYPES`, so several spreads silently never fire:
`regional_authority`→`political_authority`, `information_network`→`information_flow`,
`patronage`/`faction_patronage`→`political_authority`, `arcane_network`→`information_flow`,
`labor_dependency`→`trade_dependency`, `wilderness_frontier`→`resource_competition`.
Fix: one exported canonical channel-type enum + a `canonicalSpreadChannel`
normalizer; `spreadTargetsFor` should walk **confirmed channels**
(`activeChannelsFrom`) not raw `edges` (the design says confirmed-only). Add a
test asserting every `spreadChannels` entry is a known type. *Behavior change:
some spreads that silently no-op'd will now fire — reconcile `regionalEngine`/
`worldPulseRulebook` expectations.*

### 1b. Deterministic `now`/`tick`  **[done]**  (task #28)
*Landed: threaded through the orchestrators by Regional wave R4. Measured 2026-09-15 — `src/domain/worldPulse/` holds ZERO live `new Date()` calls; the three textual hits are comments recording the rule.*
`normalizeStressor` (and a few peers) fall back to `new Date()`; thread `now`
from the orchestrator everywhere so replays are byte-identical. Consider an
ESLint guard banning `new Date()` under `src/domain/`.

### 1c. NPC↔faction seats  **[done]**  (task #29)
*Landed: `internalSeats` is populated at `factionCompetition.js:303` and re-stamped at `:546` alongside `memberNpcIds`. Measured 2026-09-15.*
`factionState.internalSeats` is declared but never populated. Wire NPC
`dotRank`/`factionSeat` into the owning faction's seats; promotion/defection
should move seat occupants and feed faction power.

---

## Phase 2 — Feel / tuning

### 2a. Tuning table + world volatility dial  **[done]**  (task #30)
*Landed: the dial is threaded through `candidateEvents.js`, `pulseKernel.js`, `worldState.js` and `simulationRules.js`; pinned by `tests/domain/worldPulseVolatility.test.js`. Measured 2026-09-15.*
Extract the inline severity/probability coefficients into a named tuning module;
add a campaign **volatility** setting (`calm`/`normal`/`turbulent`) that scales
candidate probabilities globally (threaded through `rollCandidates` +
`advanceCampaignWorld`). *Touches the determinism rollExplanation fixtures.*

### 2b. Mean-reversion  **[done]**  (task #31)
*Landed: the relax passes live in `pulseKernel.js`, `npcAgency.js` and `relationshipEvolution.js`. Measured 2026-09-15.*
NPC `momentum`/`ambitionHeat`/`corruptionHeat` and relationship
`resentment`/`fear` ratchet upward with no relaxation. Add per-tick decay toward
baseline on quiet ticks so 50-tick campaigns stay stable. (Faction `exhaustion`
already self-limits — mirror that.)

### 2c. Goal-culmination arcs  **[done]**  (task #32)
*Landed: pinned by `tests/domain/npcGoalCulmination.test.js`. Measured 2026-09-15.*
`goalProgress` accumulates but never *pays off*. When long-goal progress crosses
a threshold, fire a culminating event (succession bid, charter win, government
change) somewhat independent of current pressure — setup → payoff stories.

### 2d. Realm-event synthesizer + relationship→pressure feedback  **[done]**  (task #33)
*Landed: `src/domain/worldPulse/realmEvents.js` (454 lines). Measured 2026-09-15.*
New `realmEvents.js`: detect when N settlements share a stressor/relationship
pattern and promote it to a named regional arc (Wizard News `realm` scope —
"The Grain War"). Also feed relationship state back into `pressureModel` (a
`hostile` neighbor raises conflict pressure; a dependent supplier's famine
raises your food pressure as a first-class signal, not just a channel count).

---

## Phase 3 — Validation

### 3a. Soak / balance test  **[done]**  (task #34)
*Landed: `tests/domain/worldPulseSoak.test.js` (707 lines). Measured 2026-09-15.*
Long-horizon statistical test (the analog of the generator's
`distribution.test.js`): run ~50 ticks × ~6 settlements and assert the world
stays plausible — no settlement pegs all-crisis, events neither die out nor
explode, scalars stay bounded. Best landed *after* 2b (mean-reversion) so it
passes; it will otherwise surface the ratchet.

---

## Phase 4 — Depth (your backend / UI lane)

### 4a. AI campaign chronicle  **[backend]** — built in-repo; **DEPLOY OUTSTANDING, and it is the owner's**
Wizard News is deterministic prose with structured `reasons` — ideal grounding
for an optional AI "regional chronicle / this season's news" pass, mirroring the
dossier narrative layer. **Must** go through a Supabase edge function (the
`clientAiBoundary` contract test forbids the browser calling Anthropic). Design:
a `generate-chronicle` edge endpoint that takes the tick's Wizard News entries +
grounding and returns prose; a client hook + a credit cost. I can build the
client hook + grounding payload; the edge function + deploy is your Codespace.

### 4b. Inter-settlement economy + population flows  **[done]**
*Landed: `flows.js` (178 lines) + `populationDynamics.js` (608), pinned by `tests/domain/flows.test.js`. Measured 2026-09-15.*
Today channels emit *conditions*; they don't move goods or people. Add a light
supply→price signal (a supplier's famine raises a dependent's prices) and a
population flow (refugees from a sieged town arrive at a neighbor, shifting its
labor + housing pressure). Sizeable new subsystem — phase it after Phase 2.

### 4c. Pulse-vs-local reconciliation policy  **[done]**
*Landed: `reconcile.js` (74 lines), pinned by `tests/domain/chronicleAndReconcile.test.js`. Measured 2026-09-15.*
When the pulse applies `regional_import_shortage` and the DM later regenerates/
edits that settlement, what wins? `activeConditions` + provenance likely cover
it — make the policy explicit and add a test at that seam.

### 4d. NPC / relationship chronicle surface  **[ui]** — **[done]** (LONG TAIL #39, 2026-09-15)
`relationshipState.history`/`recentIncidents` are captured; NPCs have a thinner
trail. A readable "what this alliance survived / who this NPC betrayed" log turns
the simulation's memory into table-usable narrative. Data mostly exists; the
surface is UI.

*Landed, and WIDER than this paragraph knew: the durable archive is SIX fields,
not two, and the NPC half reads the LADDER'S record because `npcStates` carry no
history array to read. `relationshipChronicle.js` →
`RelationshipChronicleSection.jsx` and `npcInteriorityRead.js` →
`NpcTrailSection.jsx`, both in the Herald's existing War door, both read-only,
both DM-gated fail-closed. Incident types reach the reader through
`DISPLAY_LEXICON.incidentType`, which `tests/lint/vocabularyTotality.walker.test.js`
holds exact-set-both-ways against its writers. The two traps are recorded in the
2026-09-15 status block at the top of this file — read them before touching this
seam again.*

---

## Suggested order

Phase 0 **[done]** → 1a/1b/1c (correctness) → 2a/2b (volatility + mean-reversion)
→ 3a (soak, now passes) → 2c/2d (goal arcs + realm events) → 4b/4c (flows +
reconciliation) → 4a/4d (chronicle prose + UI). Each behavior-changing step
reconciles the pinned `worldPulse`/`regional` suites in the same commit.

**This order is now WALKED THROUGH (2026-09-15).** Every step above is landed;
4d closed last, as the order predicted. The single outstanding item in this whole
document is the `generate-chronicle` DEPLOY under 4a, which is a Supabase act and
the owner's alone. There is no remaining code work on this roadmap.
