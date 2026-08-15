/**
 * dossierLazyTabs.js — the dossier's lazy tab-component registry, extracted
 * VERBATIM from OutputContainer (the DossierGroupTabStrip / SimulationRulesAxes
 * sibling-leaf idiom, so OutputContainer stays under the max-lines ratchet as
 * tabs accrue — STEP 3.5 added Rumors & News and tipped it over).
 *
 * Chunking is unchanged: `lazy(() => import(...))` here produces exactly the
 * same per-tab dynamic chunks; OutputContainer (itself lazy) simply imports
 * the registry. Each tab loads only when first viewed.
 */
import { lazy } from 'react';

export const SummaryTab = lazy(() => import('../new/SummaryTab'));
// P129 / D-2 — Magazine-spread Summary V2. Self-gated by the
// `summaryMagazineV2` flag in renderTab(); legacy SummaryTab still
// loads in parallel so toggling the flag is instant.
export const SummaryTabV2 = lazy(() => import('../new/SummaryTabV2.jsx'));
export const PlotHooksTab = lazy(() => import('../new/tabs/PlotHooksTab.jsx'));
export const ChronicleTab = lazy(() => import('../new/tabs/ChronicleTab.jsx'));
export const VersionsTab = lazy(() => import('../settlement/VersionsTab.jsx'));
export const OverviewTab = lazy(() => import('../new/tabs/OverviewTab'));
export const EconomicsTab = lazy(() => import('../new/tabs/EconomicsTab'));
export const ServicesTab = lazy(() => import('../new/tabs/ServicesTab'));
export const PowerTab = lazy(() => import('../new/tabs/PowerTab'));
// Phase 4 W-F6 — the FAITH surface (patron / pantheon ranks / piety arc /
// legitimacy / cause chains), tier-gated inside. It now renders inside the
// dedicated War & Faith tab (WarFaithTab, W4e) rather than under Power, so it's
// still lazy — loaded with the WarFaithTab chunk on first open (ratchet: faith lazy).
// Phase 5 W-C4 — the patron/cult ASSIGNMENT control (the write half of the
// embed-on-assign bridge). Editable dossiers only; self-gates by tier inside
// (premium write · lapsed read-only · free upsell). Lazy so the registry + copy
// only load when a dossier is opened (ratchet: assignment lazy).
export const DeityAssignmentPanel = lazy(() => import('../settlement/DeityAssignmentPanel.jsx'));
export const DefenseTab = lazy(() => import('../new/tabs/DefenseTab'));
export const NPCsTab = lazy(() => import('../new/tabs/NPCsTab'));
export const HistoryTab = lazy(() => import('../new/tabs/HistoryTab'));
export const ResourcesTab = lazy(() => import('../new/tabs/ResourcesTab'));
export const ViabilityTab = lazy(() => import('../new/tabs/ViabilityTab'));
export const DailyLifeTab = lazy(() => import('../new/tabs/DailyLifeTab'));
export const RelationshipsTab = lazy(() => import('../new/tabs/RelationshipsTab'));
export const DMCompassTab = lazy(() => import('../new/tabs/DMCompassTab'));
export const NotesTab = lazy(() => import('../new/tabs/NotesTab.jsx'));
// Phase 5 W4e — dossier depth. Each lazy so the causal / magic / war read-models
// only load when the tab is first opened. new/tabs is NOT in the icon-split lazy
// dir, so these strip entries reuse icons ALREADY imported by OutputContainer
// (Cog / Sparkles / Swords) and add nothing to the first-paint vendor-icons chunk.
export const SubstrateTab = lazy(() => import('../new/tabs/SubstrateTab.jsx'));
export const MagicTab = lazy(() => import('../new/tabs/MagicTab.jsx'));
// War & Faith — composes OUR gated FaithSection (the constitutional premium seam)
// with a war half from OUR warResolve read-models. NEVER THEIRS' ungated
// WarFaithSection / useSettlementLiveWorld (those leak the live pantheon).
export const WarFaithTab = lazy(() => import('../new/tabs/WarFaithTab.jsx'));
// Rumors & News (Phase 5.5 STEP 3.5) — what this settlement has HEARD of the
// realm (the trade-carrier rumor ledger), player-scrubbed, with the DM-truth
// reveal on the includeGroundTruth seam. Lazy; the tab itself only registers
// when the owning campaign carries a rumor ledger (dormant ⇒ no tab at all).
export const RumorsTab = lazy(() => import('../new/tabs/RumorsTab.jsx'));
// THE TRADITIONS wave (Engine Lift #4, T-1) — the founding-traditions register
// (World group, beside Daily Life). Lazy so the genesis leaf + tradition corpus
// ride THIS chunk, never the first-paint graph (ratchet: traditions lazy).
export const TraditionsTab = lazy(() => import('../new/tabs/TraditionsTab.jsx'));
