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

### 1a. Stressor channel vocabulary + confirmed gating  **[next]**  (task #27)
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

### 1b. Deterministic `now`/`tick`  **[next]**  (task #28)
`normalizeStressor` (and a few peers) fall back to `new Date()`; thread `now`
from the orchestrator everywhere so replays are byte-identical. Consider an
ESLint guard banning `new Date()` under `src/domain/`.

### 1c. NPC↔faction seats  **[next]**  (task #29)
`factionState.internalSeats` is declared but never populated. Wire NPC
`dotRank`/`factionSeat` into the owning faction's seats; promotion/defection
should move seat occupants and feed faction power.

---

## Phase 2 — Feel / tuning

### 2a. Tuning table + world volatility dial  **[next]**  (task #30)
Extract the inline severity/probability coefficients into a named tuning module;
add a campaign **volatility** setting (`calm`/`normal`/`turbulent`) that scales
candidate probabilities globally (threaded through `rollCandidates` +
`advanceCampaignWorld`). *Touches the determinism rollExplanation fixtures.*

### 2b. Mean-reversion  **[next]**  (task #31)
NPC `momentum`/`ambitionHeat`/`corruptionHeat` and relationship
`resentment`/`fear` ratchet upward with no relaxation. Add per-tick decay toward
baseline on quiet ticks so 50-tick campaigns stay stable. (Faction `exhaustion`
already self-limits — mirror that.)

### 2c. Goal-culmination arcs  **[next]**  (task #32)
`goalProgress` accumulates but never *pays off*. When long-goal progress crosses
a threshold, fire a culminating event (succession bid, charter win, government
change) somewhat independent of current pressure — setup → payoff stories.

### 2d. Realm-event synthesizer + relationship→pressure feedback  **[next]**  (task #33)
New `realmEvents.js`: detect when N settlements share a stressor/relationship
pattern and promote it to a named regional arc (Wizard News `realm` scope —
"The Grain War"). Also feed relationship state back into `pressureModel` (a
`hostile` neighbor raises conflict pressure; a dependent supplier's famine
raises your food pressure as a first-class signal, not just a channel count).

---

## Phase 3 — Validation

### 3a. Soak / balance test  **[next]**  (task #34)
Long-horizon statistical test (the analog of the generator's
`distribution.test.js`): run ~50 ticks × ~6 settlements and assert the world
stays plausible — no settlement pegs all-crisis, events neither die out nor
explode, scalars stay bounded. Best landed *after* 2b (mean-reversion) so it
passes; it will otherwise surface the ratchet.

---

## Phase 4 — Depth (your backend / UI lane)

### 4a. AI campaign chronicle  **[backend]**
Wizard News is deterministic prose with structured `reasons` — ideal grounding
for an optional AI "regional chronicle / this season's news" pass, mirroring the
dossier narrative layer. **Must** go through a Supabase edge function (the
`clientAiBoundary` contract test forbids the browser calling Anthropic). Design:
a `generate-chronicle` edge endpoint that takes the tick's Wizard News entries +
grounding and returns prose; a client hook + a credit cost. I can build the
client hook + grounding payload; the edge function + deploy is your Codespace.

### 4b. Inter-settlement economy + population flows  **[next/large]**
Today channels emit *conditions*; they don't move goods or people. Add a light
supply→price signal (a supplier's famine raises a dependent's prices) and a
population flow (refugees from a sieged town arrive at a neighbor, shifting its
labor + housing pressure). Sizeable new subsystem — phase it after Phase 2.

### 4c. Pulse-vs-local reconciliation policy  **[next]**
When the pulse applies `regional_import_shortage` and the DM later regenerates/
edits that settlement, what wins? `activeConditions` + provenance likely cover
it — make the policy explicit and add a test at that seam.

### 4d. NPC / relationship chronicle surface  **[ui]**
`relationshipState.history`/`recentIncidents` are captured; NPCs have a thinner
trail. A readable "what this alliance survived / who this NPC betrayed" log turns
the simulation's memory into table-usable narrative. Data mostly exists; the
surface is UI.

---

## Suggested order

Phase 0 **[done]** → 1a/1b/1c (correctness) → 2a/2b (volatility + mean-reversion)
→ 3a (soak, now passes) → 2c/2d (goal arcs + realm events) → 4b/4c (flows +
reconciliation) → 4a/4d (chronicle prose + UI). Each behavior-changing step
reconciles the pinned `worldPulse`/`regional` suites in the same commit.
