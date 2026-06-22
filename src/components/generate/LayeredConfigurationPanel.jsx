/**
 * LayeredConfigurationPanel — the ONE progressive Create panel. Collapses
 * the Basic/Advanced ModeSelector fork into a single layered surface:
 *
 *   Character (Tier-1 card)  — the 17 archetypes, promoted out of SliderPanel.
 *   Foundations (always-on)  — size up to metropolis + the essentials.
 *   Fine-tune (collapsible)  — sliders, culture, age, presets (inside the panel).
 *   Deep constraints         — Institutions / Services / Trade, each a collapsible
 *                              that ABSORBS the old per-step wizard panels.
 *
 * The controls and their config→generator mapping are UNCHANGED — this is a UI
 * reshuffle of the same inputs, so a given config produces the byte-identical
 * settlement (generatorGoldenMaster is the proof). No defaults change.
 *
 * Funnel continuity: each Deep-constraints disclosure keeps the wizard STEP ID
 * (`institutions` / `services` / `trade`) and fires `wizard_step_viewed` the
 * first time it is expanded, so the existing funnel analytics still fire even
 * though the linear step wizard is gone. The `config` step id corresponds to the
 * Foundations/Fine-tune block (always mounted) and is reported on mount.
 *
 * Size is NOT gated — free accounts already generate up to metropolis; this panel
 * reintroduces no size gate. The anon HomeHero instant path never reaches here.
 */

import { useEffect } from 'react';
import { track, EVENTS } from '../../lib/analytics.js';
import ConfigurationPanel from '../ConfigurationPanel.jsx';
import InstitutionalGrid from '../InstitutionalGrid.jsx';
import ServicesTogglePanel from '../ServicesTogglePanel.jsx';
import TradeDynamicsPanel from '../TradeDynamicsPanel.jsx';
import CharacterPresetCard from './CharacterPresetCard.jsx';
import PlaceInRegionCard from './PlaceInRegionCard.jsx';
import Disclosure from '../primitives/Disclosure.jsx';
import { INK, MUTED, SECOND, serif_, FS, SP } from '../theme.js';

// Deep-constraints sections — each keeps its wizard STEP ID so funnel analytics
// (wizard_step_viewed) still fire when the section is opened.
// `collapsedHint` names what each section SHAPES (information scent) rather than
// the bare "Optional" — a paying GM scanning the panel needs to see that this is
// the expert depth, not fine print (P1 progressive-disclosure-WITH-scent).
const DEEP_SECTIONS = [
  { id: 'institutions', label: 'Institutions', hint: 'Force or exclude specific institutions as hard constraints.', collapsedHint: 'Force or forbid', Panel: InstitutionalGrid },
  { id: 'services', label: 'Available Services', hint: 'Guarantee or forbid a service. Force one in, and the simulator adds whatever institution it takes to provide it.', collapsedHint: 'Guarantee or forbid', Panel: ServicesTogglePanel },
  { id: 'trade', label: 'Trade Dynamics', hint: 'Control which goods leave and which arrive. This feeds supply chains and trade between settlements.', collapsedHint: 'Exports & imports', Panel: TradeDynamicsPanel },
];

/**
 * One collapsible Deep-constraints section, built on the canonical Disclosure
 * primitive. Disclosure's onFirstOpen fires exactly once on first open (per
 * mount), which preserves the existing single-fire funnel analytics
 * (wizard_step_viewed) without a hand-rolled `fired` ref. The descriptive hint
 * renders inside the disclosure, above the absorbed wizard Panel.
 * @param {{ id: string, label: string, hint: string, collapsedHint: string, Panel: React.ComponentType }} props
 */
function DeepSection({ id, label, hint, collapsedHint, Panel }) {
  const onFirstOpen = () => {
    try {
      track(EVENTS.WIZARD_STEP_VIEWED, { step_id: id, mode: 'layered', direction: 'expand' });
    } catch { /* analytics must never affect the panel */ }
  };
  return (
    <div data-section-id={id} style={{ marginTop: SP.sm }}>
      <Disclosure title={label} hint={collapsedHint} onFirstOpen={onFirstOpen}>
        <div style={{ marginBottom: SP.sm, fontSize: FS.xs, color: SECOND, lineHeight: 1.5 }}>{hint}</div>
        <Panel />
      </Disclosure>
    </div>
  );
}

/**
 * @param {{ mode?: 'basic'|'advanced', showPlaceInRegion?: boolean }} [props]
 *   mode — 'basic' renders Character + Foundations only (the simulator rolls
 *     priorities, resources, stress, institutions, services, and trade from
 *     working defaults). 'advanced' (default) additionally exposes Fine-tune,
 *     the Deep-constraints sections, and Place in Region. This is the load-
 *     bearing difference between the two Create modes.
 *   showPlaceInRegion — render the premium "Place in Region" close-out card;
 *     only shown in advanced mode.
 */
export default function LayeredConfigurationPanel({ mode = 'advanced', showPlaceInRegion = true } = {}) {
  const advanced = mode === 'advanced';
  // The Foundations/Fine-tune block is always mounted — report its step id once
  // on mount so the funnel's `config` step still registers without the linear wizard.
  useEffect(() => {
    try {
      track(EVENTS.WIZARD_STEP_VIEWED, { step_id: 'config', mode: 'layered', direction: 'mount' });
    } catch { /* analytics must never affect the panel */ }
  }, []);

  return (
    <div data-testid="layered-configuration-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Tier-1: Character preset. In Advanced this card also hosts the five
          always-on priority sliders (archetype chips + Random/Custom + sliders
          reconciled into one control); Basic shows archetype chips only. */}
      <CharacterPresetCard advanced={advanced} />

      {/* Foundations (always-on) + Fine-tune (collapsible). The outer bordered
          wrapper was removed: ConfigurationPanel already renders its OWN bordered
          card, so wrapping it produced card-in-card box-soup. The "Foundations"
          label now sits as a borderless group header above that single card —
          the dominant entry point (P4), grouping carried by spacing (P5). */}
      <div data-section-id="config" style={{ marginBottom: SP.sm }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, padding: `0 ${SP.xs}px ${SP.xs}px` }}>
          <span style={{ fontFamily: serif_, fontSize: FS.xl, fontWeight: 700, color: INK }}>1 · Foundations</span>
          <span style={{ fontSize: FS.xs, color: MUTED }}>size, route, culture: the essentials</span>
        </div>
        <div>
          <ConfigurationPanel showFineTune={advanced} />
        </div>
      </div>

      {/* Deep constraints (Advanced only) — collapsibles absorbing
          Institutions / Services / Trade. Basic mode randomises these. */}
      {advanced && (
        <div style={{ marginTop: SP.md }}>
          {/* Keyword-first header with real information scent (P1): front-load
              WHAT this group controls at a visible tier, not a muted micro-cap
              that reads as fine print. This is the expert accelerator — sell that
              the depth exists, never bury it. */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, padding: `0 ${SP.xs}px ${SP.xs}px` }}>
            <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK }}>
              2 · Institutions, services &amp; trade
            </span>
            <span style={{ fontSize: FS.xs, color: MUTED }}>force or forbid specifics</span>
          </div>
          {DEEP_SECTIONS.map(s => <DeepSection key={s.id} {...s} />)}
        </div>
      )}

      {/* Premium "Place in Region" close-out (Advanced only) — assign to a
          campaign/region + an optional deity at birth. Self-gates for non-premium. */}
      {advanced && showPlaceInRegion && (
        <div style={{ marginTop: SP.md }}>
          <PlaceInRegionCard />
        </div>
      )}
    </div>
  );
}
