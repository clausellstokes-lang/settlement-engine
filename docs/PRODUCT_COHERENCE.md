# SettlementForge — Product Coherence

> **Reviewed: 2026-06-16.** Companion to [`RISK_REGISTER.md`](./RISK_REGISTER.md) (UX-coherence row)
> and [`ARCHITECTURE.md`](../ARCHITECTURE.md). Purpose: state the product's core mental model once,
> map the feature surface, and name the places where the model leaks — so feature work can be judged
> against "does this make the arc clearer?" rather than "is this a cool capability?".

## 1. The core model — two nested lifecycles

SettlementForge has **two lifecycles the code treats as one continuous arc**, living in different
slices, with an invisible seam between them. Understanding this is the key to understanding the product.

### (a) Per-settlement: `draft → canon`  (`settlementSlice.js`)

Every settlement carries a `phase` field — `@typedef {'draft' | 'canon'} Phase` (`domain/types.js`):

- **Draft** — authoring/tinkering. Edits are *authorial* and immediate (rename, regenerate, what-if).
  `generateSettlement()` always resets to `phase:'draft'`, clears `eventLog`, nulls `canonizedAt` — going
  to canon is a deliberate act, never a regeneration side-effect.
- **Canon** — deployed into play. `canonize()` sets `phase:'canon'`, clears the log, stamps `canonizedAt`,
  and fires `CANON_PHASE_CHANGED`. Now changes are *diegetic events* (`applyEvent`) that log to a timeline
  and ripple to the world. `uncanonize()` ("Reset to Draft") reverses it and discards the log.

The phase changes **policy, not the engine**: same generators, different meaning for an edit. Three
provenance stamps (`generatedAt` / `editedAt` / `canonizedAt`) surface in `ProvenanceBlock`.

### (b) Per-campaign: `canonize world → world-pulse`  (`campaignWorldPulseSlice.js`)

A **campaign** is a folder of settlements + a map + a `worldState`. Independently of per-settlement canon,
the *campaign world* is canonized (`canonizeCampaignWorld`, stamps `worldState.canonizedAt`) and then
**advanced one interval at a time** (`advanceCampaignWorld`): each tick drains members' queued intentions,
runs the organic simulation (stressor decay/spread, regional propagation), and surfaces **proposals** the
DM accepts or dismisses. `undoLastPulse` reverses a tick (session-scoped).

### The seam

A settlement being *canon* and its campaign world *pulsing* are **different states**, gated by hidden
membership. The same verb — "canonize" — names both. This is the product's most load-bearing transition
and it is largely invisible (see Gap 1).

```
 draft ──canonize()──> canon ──(join clock-bound campaign)──> events QUEUE
   ▲                      │                                         │
 uncanonize()      applyEvent → timeline                    advanceCampaignWorld (tick)
                          │                                         │
                          └────────── rippleEventThroughWorld ──────┴─> world-pulse proposals
```

## 2. Feature surface

18 substantial areas. **Core/mature** = stable spine; **developing** = the simulation frontier.

| Area | Maturity | Purpose | Entry point |
|---|---|---|---|
| Settlement generation | core | Procedural settlement (institutions, NPCs, factions, economy, stressors, hooks, history) | `GenerateWizard.jsx`, `ConfigurationPanel.jsx` |
| Dossier + editing | core | Read/edit: editable prose, pending-edit queue with cascade preview | `SettlementDetail.jsx`, `components/new/*` |
| Draft→Canon lifecycle | core | Promote draft to canon; edits become logged in-world events | `settlement/PhaseBadge.jsx` |
| In-world events (engine) | core | Diegetic events (kill NPC, deplete resource, apply/resolve stressor) → timeline | `settlement/EventComposer.jsx` |
| Campaigns & folders | mature | Named folders grouping settlements + map + world state | `SettlementsPanel.jsx`, `CampaignBoard` |
| World map (Azgaar/FMG) | mature | Import FMG snapshot, place settlements, draw routes/relationships | `WorldMap.jsx` (premium) |
| World-pulse simulation | developing | Canonize world, advance tick-by-tick, accept/dismiss proposals | `map/WorldPulsePanel.jsx` |
| Pending intentions / simultaneity | developing | Clock-bound members queue events; all resolve at the tick | `settlement/PendingIntentions.jsx` |
| Regional causality | developing | Cross-settlement impact propagation to neighbours | `region/RegionalImpactInbox.jsx` |
| Gallery sharing | mature | Publish/import canonized settlements & maps to a public gallery | `ShareToGallery.jsx`, `GalleryPage.jsx` |
| Custom content (homebrew) | developing | User-authored institutions/resources/stressors/goods | `CompendiumPanel.jsx` |
| AI narrative layer | developing | Credit-gated AI prose refinement + chronicles | `settlement/AIInlineCard.jsx` |
| PDF export | mature | Draft Brief / Canon Dossier / Timeline Packet variants | `settlement/ExportSheet.jsx` |
| Credits & billing | mature | Pay-per-use AI credits (Stripe packs), independent of tier | `PricingPage.jsx`, `PurchaseModal.jsx` |
| Auth & account | mature | Sign-in/anon cap/account/privacy | `AuthModal.jsx`, `components/auth/*` |
| Analytics & admin | mature | Two-plane telemetry (funnel + research), consent-gated, admin panel | `AdminPanel.jsx` |
| Onboarding & coaching | developing | First-run guidance, post-gen coach, pipeline reveal | `OnboardingCoach.jsx`, `HowToUse.jsx` |

## 3. Coherence gaps (where the model leaks)

1. **Two "canon" verbs, one word, meaning hidden behind membership.** Settlement `canonize()` and campaign
   `canonizeCampaignWorld` are different transitions sharing a label; which one fires depends on hidden
   membership state. The most important transition in the product happens invisibly.
   → *Qualify them in the UI: "Mark Canon" (settlement) vs "Start the World Clock" (campaign).*

2. **No campaign-level lifecycle view.** Per-settlement `phase`/`eventLog`/`systemState` are global on
   `settlementSlice`, but a campaign has many members. A user can't answer "is this world pulsing yet?
   which towns are clock-bound? what's pending?" in one place.
   → *Add a campaign lifecycle dashboard: draft/canon counts, clock-bound members, pending intentions, last tick.*

3. **"Canon" (phase) vs "canon" (entity provenance) collide.** `domain/canonStatus.js` uses `canonStatus`
   ('draft'/'canon'/…) for individual entities — a different axis from the settlement lifecycle phase. A
   badge reading "canon" is ambiguous.
   → *Reserve "Canon" for the lifecycle phase in user copy; relabel entity `canonStatus` (locked/pinned/optional).*

4. **Simulation surfaces sprawl across four accept/reject vocabularies.** Regional impacts (queued/applied/
   resolved/ignored), world-pulse proposals (apply/dismiss), crisis stressor twins, and pending intentions
   are, from the DM's seat, the same act — "the world wants to change something; allow it?" — with four UIs.
   → *Consolidate into one "World Consequences" review surface with a single accept/dismiss vocabulary + provenance tags.*

5. **Reversibility is inconsistent.** Settlement events have `undoLastEvent`; `canonize` has `uncanonize`
   (discards the log); world-pulse undo is **session-only and silently vanishes on reload**. No single
   "how do I take that back?" model.
   → *Unify/document the undo story; at minimum warn that pulse undo is session-scoped.*

6. **The draft-edit surface is the most sprawled.** Three overlapping "change this town" paths — what-if
   `applyChange`, section/full regen, and `RegenerationModeSelector` — plus locks plus the pending-edit queue.
   → *Pick one primary "propose change → preview cascade → commit" flow; demote the others.*

## 4. Recommendation — feature freeze + consolidation pass

**Recommend a feature freeze on the simulation frontier and a consolidation pass.** The surface already
spans 18 areas; the **core spine is mature** (generation, draft→canon, events, campaigns, map, gallery,
PDF, billing, auth, analytics). The **simulation frontier** (world-pulse, regional causality, pending
intentions, custom content, AI narrative) is powerful but is exactly where the coherence gaps cluster —
four consequence vocabularies, an invisible canon seam, inconsistent undo.

The git history shows the team has *already* shifted from building to cohering (Cohesion Waves 1–8 complete,
a `code-hardening` branch, the WS4 decomposition, this risk-register pass). The highest-leverage next move
is **not another simulation capability** — it's collapsing Gaps 1, 4, and 5 so a DM holds one mental model:
*draft a town → make it canon → start the world clock → review the world's consequences in one place → undo
predictably.* Ship that coherence, then reopen the frontier.
