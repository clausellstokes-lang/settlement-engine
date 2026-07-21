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

import { useEffect, useState } from 'react';
import { track, EVENTS } from '../../lib/analytics.js';
import { useStore } from '../../store/index.js';
import ConfigurationPanel from '../ConfigurationPanel.jsx';
import InstitutionalGrid from '../InstitutionalGrid.jsx';
import ServicesTogglePanel from '../ServicesTogglePanel.jsx';
import TradeDynamicsPanel from '../TradeDynamicsPanel.jsx';
import CharacterPresetCard from './CharacterPresetCard.jsx';
import PlaceInRegionCard from './PlaceInRegionCard.jsx';
import Disclosure from '../primitives/Disclosure.jsx';
import DesktopOnlyGate from '../primitives/DesktopOnlyGate.jsx';
import Button from '../primitives/Button.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import { INK, MUTED, SECOND, BORDER, CARD, sans, serif_, FS, SP } from '../theme.js';

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
 * SeedField — THE PROMISE, made a surface (Walk W1, owner order 2026-07-21, ledger
 * 13da1e95). Enter an exact seed and forge it: this reuses the founding-seeds
 * derivation path (setRandomSliderMode(true) so every priority dial rolls
 * deterministically from the seed via resolveConfig's _randomizePriorities, then
 * generateSettlement(seed)). No parallel derivation, and no updateConfig({seed}) —
 * the seed is the generateSettlement argument, exactly as FoundingWorlds forges it,
 * so the configSeamContract stays intact. GenerateWizard swaps to the output view on
 * the new settlement (its settlement-change effect). The current draft's seed
 * (store lastSeed) is shown for copying so a rolled world can be reproduced or shared.
 */
function SeedField() {
  const generate = useStore((s) => s.generateSettlement);
  const setRandomSliderMode = useStore((s) => s.setRandomSliderMode);
  const lastSeed = useStore((s) => s.lastSeed);
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const forge = async () => {
    const seed = value.trim();
    if (!seed || busy) return;
    setBusy(true);
    try {
      setRandomSliderMode(true);
      await generate(seed);
    } finally {
      setBusy(false);
    }
  };

  const copySeed = async () => {
    if (lastSeed == null || typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(String(lastSeed));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked (permissions / insecure context) */ }
  };

  return (
    <div style={{ marginBottom: SP.md, paddingBottom: SP.sm, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, padding: `0 ${SP.xs}px ${SP.xs}px`, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK }}>Exact seed</span>
        <span style={{ fontSize: FS.xs, color: MUTED }}>reproduce a world: every dial rolls from the seed</span>
      </div>
      <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', alignItems: 'center', padding: `0 ${SP.xs}px` }}>
        <input
          type="text"
          aria-label="Exact seed"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') forge(); }}
          placeholder="Enter a seed"
          style={{ flex: '1 1 200px', minWidth: 160, padding: '6px 10px', border: `1px solid ${BORDER}`, fontSize: FS.sm, fontFamily: sans, boxSizing: 'border-box', background: CARD, color: INK }}
        />
        <Button variant="secondary" size="sm" busy={busy} disabled={!value.trim()} onClick={forge}>
          Forge seed
        </Button>
      </div>
      {lastSeed != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginTop: SP.xs, padding: `0 ${SP.xs}px`, flexWrap: 'wrap' }}>
          <span style={{ fontSize: FS.xs, color: MUTED }}>Current draft seed</span>
          <code style={{ fontSize: FS.xs, color: SECOND }} data-testid="current-seed">{String(lastSeed)}</code>
          <Button variant="ghost" size="sm" onClick={copySeed}>{copied ? 'Copied' : 'Copy'}</Button>
        </div>
      )}
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
  // Mobile pass (Phase 5): Advanced is a desktop authoring console — the
  // Deep-constraints editors (Institutions / Services / Trade) and Fine-tune are
  // dense, sub-44px, nested-scroll surfaces with no room on a phone. Per the
  // confirmed MIX rule we keep the BASIC authoring path on mobile (Character
  // chips + Foundations + name + Generate, which already collapse to one column)
  // and defer the hard constraints behind a calm "best on desktop" gate. The flag
  // is read reactively so the surface adapts on rotation; desktop is untouched
  // (advancedOnDesktop === advanced when not mobile), so its render is unchanged.
  const mobile = useIsMobile();
  const advancedOnDesktop = advanced && !mobile;
  // The Foundations/Fine-tune block is always mounted — report its step id once
  // on mount so the funnel's `config` step still registers without the linear wizard.
  useEffect(() => {
    try {
      track(EVENTS.WIZARD_STEP_VIEWED, { step_id: 'config', mode: 'layered', direction: 'mount' });
    } catch { /* analytics must never affect the panel */ }
  }, []);

  return (
    <div data-testid="layered-configuration-panel" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Exact-seed input (Advanced only, top of the panel): forge a world from a
          seed, and copy the current draft's seed. THE PROMISE made a surface. */}
      {advanced && <SeedField />}

      {/* Tier-1: Character preset. In Advanced this card also hosts the five
          always-on priority sliders (archetype chips + Random/Custom + sliders
          reconciled into one control); Basic shows archetype chips only. On
          mobile the Advanced slider/Custom surface defers to desktop, so the card
          renders its Basic chip-only form (the priorities still roll from
          defaults) — keeping the phone path to the Basic authoring shape. */}
      <CharacterPresetCard advanced={advancedOnDesktop} />

      {/* Foundations (always-on) + Fine-tune (collapsible). The outer bordered
          wrapper was removed: ConfigurationPanel already renders its OWN bordered
          card, so wrapping it produced card-in-card box-soup. The "Foundations"
          label now sits as a borderless group header above that single card —
          the dominant entry point (P4), grouping carried by spacing (P5). */}
      <div data-section-id="config" style={{ marginBottom: SP.sm }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, padding: `0 ${SP.xs}px ${SP.xs}px`, borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ fontFamily: serif_, fontSize: FS.xl, fontWeight: 700, color: INK }}>1 · Foundations</span>
          <span style={{ fontSize: FS.xs, color: MUTED }}>size, route, culture: the essentials</span>
        </div>
        <div>
          {/* Fine-tune (sliders, nearby-resource cycling, stress) is Advanced-only
              and, on mobile, a dense sub-44px / nested-scroll surface — so it
              defers to desktop. The phone keeps the Foundations select grids,
              which already collapse to one column. */}
          <ConfigurationPanel showFineTune={advancedOnDesktop} />
        </div>
      </div>

      {/* Deep constraints (Advanced only) — collapsibles absorbing
          Institutions / Services / Trade. Basic mode randomises these. */}
      {advancedOnDesktop && (
        <div style={{ marginTop: SP.md }}>
          {/* Keyword-first header with real information scent (P1): front-load
              WHAT this group controls at a visible tier, not a muted micro-cap
              that reads as fine print. This is the expert accelerator — sell that
              the depth exists, never bury it. */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: SP.sm, padding: `0 ${SP.xs}px ${SP.xs}px`, borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 700, color: INK }}>
              2 · Institutions, services &amp; trade
            </span>
            <span style={{ fontSize: FS.xs, color: MUTED }}>force or forbid specifics</span>
          </div>
          {DEEP_SECTIONS.map(s => <DeepSection key={s.id} {...s} />)}
        </div>
      )}

      {/* Mobile + Advanced: the hard-constraint editors (Institutions, Services,
          Trade) and the Fine-tune dials are raw authoring tools with no readable
          preview to teaser, so they get the plain "best on desktop" gate. Basic
          authoring stays fully usable on the phone above: pick a character, set
          the foundations, name it, and Generate. The constraints roll from
          working defaults until refined on a larger screen. */}
      {advanced && mobile && (
        <div style={{ marginTop: SP.md }} data-testid="deep-constraints-mobile-gate">
          <DesktopOnlyGate
            title="Hard constraints are best set on desktop"
            message="Forcing or forbidding specific institutions, services, and trade goods needs the full constraint console, which has room to work on a larger screen. On your phone you can pick a character, set the foundations, and generate a draft. The simulator rolls these constraints from working defaults until you refine them on desktop."
          />
        </div>
      )}

      {/* Premium "Place in Region" close-out (Advanced only) — assign to a
          campaign/region + an optional deity at birth. Self-gates for non-premium.
          Deferred to desktop on mobile alongside the rest of the Advanced console. */}
      {advancedOnDesktop && showPlaceInRegion && (
        <div style={{ marginTop: SP.md }}>
          <PlaceInRegionCard />
        </div>
      )}
    </div>
  );
}
