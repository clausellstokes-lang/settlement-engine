---
name: t3b-orphans-wrong-lineage-and-archaeology
description: "The 3 T3-B orphaned components (MemberSettlementsList / GalleryMapsSidebar / GateToggle) — verified orphan status, cross-lineage archaeology, and brief-offender-label inaccuracy."
metadata: 
  node_type: memory
  type: project
  originSessionId: 132693a1-af4c-4363-b78b-614d0d68d040
  modified: 2026-07-21T15:20:00.931Z
---

The "3 orphaned components" T5 owner-queue item (composite-r4). A brief posed each as wire-vs-delete; the exploration below is decision-independent and airtight — a successor handed the same brief should NOT re-run it.

**Wrong-lineage trap (this exact brief).** The brief targets composite-r4 (base 17d46413, head bff01718 = worktree `minifold`). A fresh session worktree can land on `claude/competent-shirley-a07533` @ **d024286e** instead — which is an ANCESTOR of 17d46413 (1375 commits behind bff01718; merge-base = d024286e itself), a pre-program July-5 checkpoint. There the task is NON-executable: `tests/design/deepCraftKillList.test.js` does not exist yet, and all three components are still WIRED (their original built state). Always `rev-parse` + confirm bff01718 is HEAD before acting. See [[wrong-lineage-worktree-trap-2026-07-14]].

**Archaeology (why they're orphaned on composite-r4).** All three were built-AND-wired at d024286e, then the 1375-commit program refactored their consumers to inline SIMPLER UIs, orphaning the richer originals:
- **MemberSettlementsList** (rich: published→deep-link cards, unpublished→inline PublicDossierView expander). Its d024286e consumer `MapGalleryDetail.jsx` was DELETED on composite-r4; `GalleryMaps.jsx` (~line 109) now renders a flat "Settlements (N)" name-chip list in its read-only preview. Deliberate page removal ⇒ leans superseded/dead.
- **GalleryMapsSidebar** (complete kind/backdrop/has-settlements/importable/tags facets, desktop + mobile BottomSheet). GalleryMaps has ZERO filter state — fetches hardcoded `{kind:['map']}`. Server RPC already accepts filters; only UI wiring missing ⇒ a ready-to-wire feature, cleanest genuine wire-vs-delete call.
- **GateToggle** (SimulationRulesGateToggle.jsx; P7 On/Off word + description + disabledReason, designed for the 3 subsystem gates War/Settlement/Religion). The dialog now renders 8 GENERIC toggles (Emergents/Stressors/NPC agency/Factions/Population/Resources/Promotion-demotion/Institution-lifecycle) via a plain inline `Toggle` (def ~line 129, use ~line 520). Its designed use case isn't in the dialog; NO size ratchet tracks SimulationRulesDialog (passes at 624 lines) so its "keep under the component-size ratchet" justification is inoperative ⇒ leans reverted/dead.

**⚠️ Brief offender labels are INACCURATE — re-measure post-delete, never assume.** Measured on composite-r4: MemberSettlementsList = 1 borderRadius; GalleryMapsSidebar = 1 borderRadius (brief said "1 rgba" — wrong); SimulationRulesGateToggle = 0 of {borderRadius, boxShadow, rgba} (brief said "2: borderRadius+boxShadow" — wrong; its offender, if any, is a tinted-callout — verify with the ratchet's own regex). Ceilings on composite-r4: borderRadius 104 / boxShadow 72 / rgbaLiterals 167 / tintedCallouts 167 (tolerance-0 exact). See [[sizebaseline-exact-ceiling-hazard]].

**RESOLVED 2026-07-21 — owner ruled, executed @ c3ae63df** (branch claude/t3b-orphans-resolve off bff01718, fresh worktree t3b-orphans): #1 MemberSettlementsList DELETED · #3 GateToggle DELETED · #2 GalleryMapsSidebar WIRED (backdrop/importable/tags facets → list_gallery_maps server-side; kind + has-settlements struck as incoherent with the phase-2 blank-maps narrowing; +4 pins). Ceilings lowered measured: borderRadius 104→103, tintedCallouts 167→165. DEAD_CODE_DISPOSITION.md carries the addendum (the three were master-merge resurrections, de9b0361, of the 2026-07-14 dead-code-wave deletions; CampaignStatePanel was the 4th resurrection and is genuinely re-wired).

⚠️ **The +42 B lesson (bit AGAIN here, cure now canonical):** wiring the sidebar made the gallery chunk import galleryMapsUtils (previously inlined solo in MapShareEditorOverlay) → Rollup extracted a NEW shared chunk → its dep-map filename in the eager index = +42 B → closure 1,040,019 vs budget 1,040,000. Cure = split the module so each lazy chunk keeps a single-home: light filter model → galleryMapsFilters.js (gallery-only), campaign facets stay galleryMapsUtils (share-editor-only). Closure back to EXACT 1,039,977 / margin 23 B. The full mechanism + convention is documented IN-REPO at src/components/gallery/galleryMapsFilters.js header. Related: [[cycle2-tranches-complete-halt]] (the margin), the wave-b rebalance hazard.

Deferred-with-note in the commit: maps-tab filtered-empty copy stays inline (file's existing idiom; settlements tab routes t()); MAP_SORT_OPTIONS + ownedCampaignBySlug remain test-only exports (pre-existing); maps tab still has no sort/search UI (the sidebar wire was the ruled scope).
