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

import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { track, EVENTS } from '../../lib/analytics.js';
import ConfigurationPanel from '../ConfigurationPanel.jsx';
import InstitutionalGrid from '../InstitutionalGrid.jsx';
import ServicesTogglePanel from '../ServicesTogglePanel.jsx';
import TradeDynamicsPanel from '../TradeDynamicsPanel.jsx';
import CharacterPresetCard from './CharacterPresetCard.jsx';
import PlaceInRegionCard from './PlaceInRegionCard.jsx';
import Button from '../primitives/Button.jsx';
import { INK, MUTED, SECOND, BORDER, BORDER2, CARD, CARD_HDR, sans, serif_, FS, SP, R } from '../theme.js';

// Deep-constraints sections — each keeps its wizard STEP ID so funnel analytics
// (wizard_step_viewed) still fire when the section is opened.
const DEEP_SECTIONS = [
  { id: 'institutions', label: 'Institutions', hint: 'Force or exclude specific institutions as hard constraints.', Panel: InstitutionalGrid },
  { id: 'services', label: 'Available Services', hint: 'Guarantee or prevent services; missing institutions are added to satisfy a forced service.', Panel: ServicesTogglePanel },
  { id: 'trade', label: 'Trade Dynamics', hint: 'Control exported and imported goods; feeds supply chains and cross-settlement trade.', Panel: TradeDynamicsPanel },
];

/**
 * One collapsible Deep-constraints section. Fires wizard_step_viewed the first
 * time it opens (per mount) so the funnel still sees the step.
 * @param {{ id: string, label: string, hint: string, Panel: React.ComponentType }} props
 */
function DeepSection({ id, label, hint, Panel }) {
  const [open, setOpen] = useState(false);
  const fired = useRef(false);
  const onToggle = () => {
    setOpen(o => {
      const next = !o;
      if (next && !fired.current) {
        fired.current = true;
        try {
          track(EVENTS.WIZARD_STEP_VIEWED, { step_id: id, mode: 'layered', direction: 'expand' });
        } catch { /* analytics must never affect the panel */ }
      }
      return next;
    });
  };
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <section data-section-id={id} style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, overflow: 'hidden', marginTop: SP.sm }}>
      <Button
        variant="ghost"
        size="md"
        fullWidth
        aria-expanded={open}
        onClick={onToggle}
        icon={<Chevron size={16} color={MUTED} />}
        style={{
          display: 'flex', alignItems: 'center', gap: SP.sm, justifyContent: 'flex-start',
          padding: `${SP.md}px ${SP.lg}px`, background: open ? CARD_HDR : CARD,
          border: 'none', borderBottom: open ? `1px solid ${BORDER2}` : 'none', textAlign: 'left', borderRadius: 0,
        }}
      >
        <span style={{ flex: 1, fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>{label}</span>
        <span style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans }}>{open ? 'Hide' : 'Optional'}</span>
      </Button>
      {open && (
        <div>
          <div style={{ padding: `${SP.sm}px ${SP.lg}px 0`, fontSize: FS.xs, color: SECOND, lineHeight: 1.5 }}>{hint}</div>
          <Panel />
        </div>
      )}
    </section>
  );
}

/**
 * @param {{ showPlaceInRegion?: boolean }} [props]
 *   showPlaceInRegion — render the premium "Place in Region" close-out card
 *   (campaign/region + optional deity at birth). Defaults true.
 */
export default function LayeredConfigurationPanel({ showPlaceInRegion = true } = {}) {
  // The Foundations/Fine-tune block is always mounted — report its step id once
  // on mount so the funnel's `config` step still registers without the linear wizard.
  useEffect(() => {
    try {
      track(EVENTS.WIZARD_STEP_VIEWED, { step_id: 'config', mode: 'layered', direction: 'mount' });
    } catch { /* analytics must never affect the panel */ }
  }, []);

  return (
    <div data-testid="layered-configuration-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Tier-1: Character preset (promoted out of SliderPanel). */}
      <CharacterPresetCard />

      {/* Foundations (always-on) + Fine-tune (collapsible) live inside the
          ConfigurationPanel, now layered. Header marks it as the foundation. */}
      <div data-section-id="config" style={{ border: `1px solid ${BORDER}`, borderRadius: R.lg, overflow: 'hidden', marginBottom: SP.sm }}>
        <div style={{ padding: `${SP.md}px ${SP.lg}px`, background: CARD_HDR, borderBottom: `1px solid ${BORDER2}` }}>
          <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>Foundations</span>
          <span style={{ fontSize: FS.xs, color: MUTED, marginLeft: SP.sm }}>size, route, culture — the essentials</span>
        </div>
        <div style={{ padding: `${SP.lg}px 0 0`, background: CARD }}>
          <ConfigurationPanel />
        </div>
      </div>

      {/* Deep constraints — collapsibles absorbing Institutions / Services / Trade. */}
      <div style={{ marginTop: SP.xs }}>
        <div style={{ fontSize: FS.xs, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', margin: `${SP.sm}px 0 ${SP.xs}px ${SP.xs}px` }}>
          Deep constraints
        </div>
        {DEEP_SECTIONS.map(s => <DeepSection key={s.id} {...s} />)}
      </div>

      {/* Premium "Place in Region" close-out — assign to a campaign/region + an
          optional deity at birth. Self-gates to a teaser for non-premium. */}
      {showPlaceInRegion && (
        <div style={{ marginTop: SP.md }}>
          <PlaceInRegionCard />
        </div>
      )}
    </div>
  );
}
