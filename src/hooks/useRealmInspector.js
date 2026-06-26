/**
 * useRealmInspector.js — the Realm Inspector's open/section state + the Realm-hub
 * handlers, lifted out of WorldMap.jsx (UX Phase 4).
 *
 * The Realm Inspector is a right-dock OVERLAY over the world map (it never body-
 * swaps the map away). This hook owns:
 *   - inspectorOpen / inspectorSection state
 *   - the locked-preview auto-open for anon/free (the Realm is reachable, not
 *     hidden; the locked Dashboard teaser is the funnel surface)
 *   - the pendingMapWorkspace → Inspector-section translation (the Library
 *     Advance-Time CTA requests a workspace; we open the matching section)
 *   - handleApplyPreset (toolbar preset chips) + handleUpgrade (locked-state CTA)
 *
 * Behaviour-preserving extraction — no logic change, purely a god-component trim.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// Plain-language, GM-facing text for the engine's known advance-failure reasons
// (P10/P11): the raw reason code goes to console.warn, never the toast.
export const ADVANCE_ERROR_TEXT = Object.freeze({
  world_not_canonized: 'The realm advances only after you canonize this campaign world.',
  no_settlements: 'Add at least one settlement to this campaign before advancing.',
  busy: 'The realm is already advancing. Give it a moment.',
  // Typed no-op reasons from the store guards (campaignWorldPulseSlice):
  advance_in_flight: 'The realm is already advancing. Give it a moment.',
  advance_paused: 'This realm has a paused advance. Resume it (or undo it) before advancing again.',
});

// The old campaign-workspace tabs map onto Inspector sections. The
// pendingMapWorkspace store signal (e.g. the Library Advance-Time CTA requesting
// 'news') is translated to an Inspector section so the post-advance "what changed"
// surface lands without a body-swap.
const WORKSPACE_TO_SECTION = Object.freeze({
  map: 'dashboard', pulse: 'pulse', news: 'chronicle', pantheon: 'pantheon',
});

// The Inspector's three size states (plan §1). 'default' is today's 420px dock;
// 'min' is a slim top-right peek-bar; 'expanded' widens to cover the map for
// focused reading. Persisted to sessionStorage so the GM's last choice survives
// a section change or a quick close/reopen within the same tab session.
const INSPECTOR_SIZES = Object.freeze(['min', 'default', 'expanded']);
const SIZE_STORAGE_KEY = 'realmInspectorSize';

/**
 * @param {Object} args
 * @param {boolean} args.canManageCampaigns  premium/elevated → live controls
 * @param {string|null} args.pendingMapWorkspace  one-shot workspace request
 * @param {boolean} args.pendingSimulationRules  one-shot "open the rules dialog" request
 * @param {() => boolean} args.consumeSimulationRules  read-and-clear that request
 * @param {any} args.activeCampaign
 * @param {string|null} args.activeCampaignId
 * @param {() => string|null} args.consumeMapWorkspace
 * @param {(id: string, patch: any) => Promise<any>} args.updateCampaignSimulationRules
 * @param {(view: string) => void} [args.onNavigate]
 * @param {(kind: string, text: string) => void} args.showToast
 */
export function useRealmInspector({
  canManageCampaigns,
  pendingMapWorkspace,
  pendingSimulationRules,
  consumeSimulationRules,
  activeCampaign,
  activeCampaignId,
  consumeMapWorkspace,
  updateCampaignSimulationRules,
  onNavigate,
  showToast,
}) {
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorSection, setInspectorSection] = useState('dashboard');
  // The dock's three-state size (plan §1). Starts at 'default' (today's 420px)
  // and is restored from sessionStorage once on mount below.
  const [inspectorSize, setInspectorSizeState] = useState('default');

  // Persist the size whenever it changes. sessionStorage may be blocked (private
  // mode, embedded contexts), so every access is guarded — a failed write must
  // never break the toggle.
  const setInspectorSize = useCallback((next) => {
    if (!INSPECTOR_SIZES.includes(next)) return;
    setInspectorSizeState(next);
    try {
      window.sessionStorage?.setItem(SIZE_STORAGE_KEY, next);
    } catch {
      // storage blocked — keep the in-memory state, drop the persistence.
    }
  }, []);

  // Restore the persisted size once on mount, validating it against the known
  // set. Ref-guarded so a later storage change can't re-trigger this and stomp a
  // live selection.
  const sizeRestoredRef = useRef(false);
  useEffect(() => {
    if (sizeRestoredRef.current) return;
    sizeRestoredRef.current = true;
    try {
      const stored = window.sessionStorage?.getItem(SIZE_STORAGE_KEY);
      if (stored && INSPECTOR_SIZES.includes(stored)) {
        // One-shot sync of a persisted preference into local UI state — the ref
        // guard makes it fire exactly once.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setInspectorSizeState(stored);
      }
    } catch {
      // storage blocked — fall back to the 'default' initial state.
    }
  }, []);
  // The Simulation Rules dialog (which carries the religion-dynamics toggle) is an
  // overlay over the map; its open state lives here alongside the Inspector's so the
  // one-shot deep-link consumption below can drive it the way the workspace request
  // drives the Inspector section.
  const [showSimulationRules, setShowSimulationRules] = useState(false);

  // Open the locked Dashboard teaser for anon/free on entry (reachable, not hidden).
  const lockedPreviewShownRef = useRef(false);
  useEffect(() => {
    if (canManageCampaigns || lockedPreviewShownRef.current) return;
    lockedPreviewShownRef.current = true;
    // One-shot sync of an external signal (the auth tier) into local UI state —
    // the ref guard makes it fire exactly once.
    setInspectorSection('dashboard');
    setInspectorOpen(true);
  }, [canManageCampaigns]);

  // Honor a one-shot workspace request from another view (e.g. the Library
  // Advance-Time CTA → 'news'). Consume only once a campaign is active so the
  // section has data to show; translate the workspace to an Inspector section.
  useEffect(() => {
    if (!pendingMapWorkspace || !activeCampaign) return;
    const w = consumeMapWorkspace();
    // Applying a one-shot external signal (the store request) to local state is the
    // "sync with an external system" escape hatch effects exist for; consume()
    // makes it fire once.
    if (w) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInspectorSection(WORKSPACE_TO_SECTION[w] || 'dashboard');
      setInspectorOpen(true);
    }
  }, [pendingMapWorkspace, activeCampaign, consumeMapWorkspace]);

  // Honor a one-shot request to open the Simulation Rules dialog (e.g. the Pantheon
  // "Enable dynamics" CTA, which steers to the religion-dynamics toggle that lives
  // only in that dialog). Consume once a campaign is active and the GM can manage it,
  // so the dialog has rules to edit; consume() makes it fire exactly once.
  useEffect(() => {
    if (!pendingSimulationRules || !activeCampaign || !canManageCampaigns) return;
    if (consumeSimulationRules?.()) {
      // One-shot sync of an external store signal into local overlay state — the
      // consume() read-and-clear makes this fire once, not a cascading render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSimulationRules(true);
    }
  }, [pendingSimulationRules, activeCampaign, canManageCampaigns, consumeSimulationRules]);

  // Toolbar preset chips — Quiet / Realistic / Dramatic in one click.
  const handleApplyPreset = useCallback(async (presetId) => {
    if (!activeCampaignId) { showToast('info', 'Select a campaign first.'); return; }
    try {
      const { SIMULATION_RULE_PRESETS } = await import('../domain/worldPulse/index.js');
      const preset = SIMULATION_RULE_PRESETS[presetId];
      if (!preset) return;
      await updateCampaignSimulationRules(activeCampaignId, preset.rules);
      showToast('success', `Applied the ${preset.label} preset.`);
    } catch (err) {
      showToast('error', `Couldn't apply preset: ${err?.message || err}`);
    }
  }, [activeCampaignId, updateCampaignSimulationRules, showToast]);

  // Route anon/free from the Realm locked-state to the premium-value surface.
  const handleUpgrade = useCallback(() => {
    if (typeof onNavigate === 'function') onNavigate('pricing');
  }, [onNavigate]);

  // Open the Inspector at a given section (used by the advance flow).
  const openInspectorAt = useCallback((section) => {
    setInspectorSection(section);
    setInspectorOpen(true);
  }, []);

  return {
    inspectorOpen,
    setInspectorOpen,
    inspectorSection,
    setInspectorSection,
    inspectorSize,
    setInspectorSize,
    openInspectorAt,
    handleApplyPreset,
    handleUpgrade,
    showSimulationRules,
    setShowSimulationRules,
  };
}
