# W4e Implementer Brief — Dossier Depth (Substrate / Magic / War&Faith / EngineSections / Workshop)

Opus implementer, Phase 5 Reunification W4e, /Users/cstokes/Desktop/settlement-engine
(branch review-fixes-2026-07-08). You implement; manager reviews + commits. BINDING:
docs/PHASE5_REUNIFICATION.md + memory/feature-parity-ledger.md §5 + §5b. REFERENCE
(read-only): /Users/cstokes/Desktop/settlement-generator/settlement-engine.

FENCE: src/components/OutputContainer.jsx, src/components/dossier/**,
src/components/settlement/** (SINGULAR — not settlements/), src/components/new/tabs/**,
src/components/settlement/eventComposer/**. NOT yours: settlements/** (plural, Library),
map/**, gallery/**, account/**. NO git add/commit/stash. RQ already registered the
Relationships tab in allTabs — build on that (don't re-add it).

## THE ONE CRITICAL CONSTRAINT (read first)
THEIRS' `WarFaithSection.jsx` + `useSettlementLiveWorld` LEAK the live pantheon (names,
standings, legitimacy) to free/lapsed users — no tier check (documented in
memory/third-lineage-mystifying-ride.md). OUR `settlement/FaithSection.jsx` +
`faithPanelModel.js` is the Phase-4 W-F6 CONSTITUTIONAL premium-gated faith seam
(free/anon = generic true-neutral, NO deity names; lapsed = read-only owned embeds).
When you build the War & Faith tab, you MUST build it on OUR gated FaithSection, adding
the war half beside it — you must NOT adopt THEIRS' ungated section or hook. Verify in a
test that free/anon see no deity names in the War&Faith tab. This is non-negotiable.

## Items (verify each ledger file:line against the live tree first)

1. SUBSTRATE tab (ledger §5 #9) — the 16-var causal engine read. Adopt new/tabs/SubstrateTab.jsx
   over OUR existing causal/substrate read-models (the dossier already derives these; surface
   them). Register in the Systems tab group + allTabs.
2. MAGIC tab (#9) — 10-facet magic profile. Adopt new/tabs/MagicTab.jsx over OUR magic
   read-model. Note OUR magic opt-out: a magic-free settlement's tab must be dormant/empty,
   not fabricated.
3. WAR & FAITH tab (#9) — see THE CRITICAL CONSTRAINT. Build new/tabs/WarFaithTab.jsx that
   composes OUR gated FaithSection (unchanged gating) + a war half (deployment/siege/supply
   from OUR warStatus read-models, the same W4b surfaced). Do NOT drop or bypass FaithSection's
   premium gate.
4. EngineSections (#9) — dossier/EngineSections.jsx, the causal sections THEIRS threads into
   Economics/Power/NPCs/Defense. Adopt over OUR read-models; these are deeper causal reads of
   data OURS already computes. Don't invent data.
5. Workshop editor + WhatChangedPanel + ChangeQueuePanel (ledger §5 #17). OURS wires composer/
   coherence/timeline directly with no unified Workshop. Adopt settlement/Workshop.jsx +
   WhatChangedPanel + ChangeQueuePanel IF they wire onto OUR existing store/event actions. The
   WhatChangedPanel should build on the SAME movement vocabulary as the Library's living-world
   signals / the causeLifecycle receipts (one "what changed" source, not a parallel one). If
   ChangeQueuePanel needs an absent change-queue store machinery (useChangeQueueCascade),
   wire what exists and STOP+report the rest.
6. Entity hyperlink layer (ledger §5) — DossierEntityContext / EntityLink / useNavigateToEntity
   so tabs cross-link entities (click an NPC → jump to it). Adopt IF it wires onto OUR nav; else
   report.
7. EventComposer field modules (§5b) — the 8 absent modules (AddNpcTraitFields,
   EventComposerCorruptionFields, EventComposerDeityField, EventComposerLinkNeighbourField,
   EventComposerRelationshipExtras, EventComposerSecondaryFields, EventComposerTierField,
   buildEvent.js). Adopt each ONLY if its event kind + store apply-path exists in OUR
   registry/mutateEntities (the deity field pairs with W-C4; the corruption field with the
   corruption system; the tier field with SHIFT_TIER which exists). Wire the ones with a
   backing event; STOP+report any whose event kind is absent.

## DO-NOT-REGRESS (OURS-ahead): the MOUNTED Versions tab (F26 — OURS mounts it as a live Notes
sub-tab; THEIRS orphaned it). Keep it mounted. Also keep OUR worker-based PDF render, OUR
FaithSection gating, OUR DossierActionBand inline strip (unless cleanly replaced).

## Laws + gates
Adopt onto our floor; premium/gating seams preserved (esp. FaithSection); dormancy-correct
(magic-free/faith-dormant tabs empty, not fabricated); stop+report on absent event kinds/store
machinery. eslint clean; targeted dossier tests + a new test pinning: War&Faith tab shows no
deity names to free/anon (the constitutional check), Substrate/Magic tabs register + render,
magic-free tab dormant, Versions tab still mounted; typecheck + strict; build + verify:dist
(budget — the icon-split now covers lazy surfaces, but new/tabs is not in the lazy-dir list, so
keep new tab code lazy and reuse bundled icons where possible; report if first paint moves);
goldens byte-identical. Report per-item status, the FaithSection-gate verification, absent
event kinds found, files + line counts, gate results, OURS-ahead preserved.
