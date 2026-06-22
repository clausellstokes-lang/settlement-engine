/**
 * Workshop — the editor's layered right-rail (UX overhaul Phase 6, plan §4.3).
 *
 * REPLACES the binary `editMode` gate that revealed the entire engine as one
 * long scroll. Instead, the engine is presented as a stack of labeled,
 * collapsible cards that:
 *   - READ in view mode (the free→premium teaser — the dossier read components
 *     built in Phase 2: CausalViewTabs, WarFaithSection, EngineSections,
 *     ReadSystemStateBar, WhatChangedPanel), and
 *   - become EDITABLE in edit mode (the write controls stay premium — the
 *     existing EventComposer, PrimaryDeityPicker, Timeline, etc.).
 *
 * Card order (plan §4.3):
 *   1. Causal State          — 4-dim header → 16-var grid.
 *   2. Pressures & Strength  — + live granary + disposition (read via the
 *                              Substrate Engine altitude + EngineSections).
 *   3. Faith & Pantheon      — describeDeityEffects axis disclosure + the
 *                              PrimaryDeityPicker (write) + "Awaken religion".
 *   4. Power & Succession    — coup forecast + lineage (PowerSuccessionSection).
 *   5. Make Changes          — EventComposer, PRECEDED by the state it mutates.
 *   6. Timeline & Chronicle.
 *   7. Provenance & Links.
 *
 * The 3 subsystem gate toggles (warLayerEnabled / settlementStrategyEnabled /
 * religionDynamicsEnabled) appear in the Faith & War cards, in ADDITION to the
 * SimulationRulesDialog, each carrying the byte-identical-when-off promise.
 *
 * Read components self-gate to nothing on a dormant/peaceful/deity-free save, so
 * the read surface a free user sees stays byte-identical to today's dossier.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { useSettlementLiveWorld } from '../../hooks/useSettlementLiveWorld.js';

// Read surfaces (Phase 2). These are the free→premium teaser.
import ReadSystemStateBar from './ReadSystemStateBar.jsx';
import CausalViewTabs from './CausalViewTabs.jsx';
import WarFaithSection from './WarFaithSection.jsx';
import WhatChangedPanel from './WhatChangedPanel.jsx';
import {
  EconomicsGranarySection,
  DefenseWarFrontSection,
  PowerSuccessionSection,
  NpcAgencySection,
} from '../dossier/EngineSections.jsx';

// Write controls (premium). Mounted only in edit mode.
import EventComposer from './EventComposer.jsx';
import PrimaryDeityPicker from './PrimaryDeityPicker.jsx';
import Timeline from './Timeline.jsx';
import PendingIntentions from './PendingIntentions.jsx';
import CoherencePanel from './CoherencePanel.jsx';
import ProvenanceBlock from './ProvenanceBlock.jsx';
import WorkshopGateToggle from './WorkshopGateToggle.jsx';
import Button from '../primitives/Button.jsx';

import { INK, MUTED, BODY, SECOND, BORDER, CARD, CARD_HDR, GOLD_TXT, sans, FS, R, SP, swatch } from '../theme.js';

// ── Collapsible card shell ───────────────────────────────────────────────────

/**
 * @param {{
 *   id: string, title: string, hint?: string, defaultOpen?: boolean,
 *   editMode?: boolean, children: React.ReactNode,
 * }} props
 */
function WorkshopCard({ id, title, hint, headline, defaultOpen = false, editMode = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <section
      data-testid={`workshop-card-${id}`}
      data-card={id}
      data-mode={editMode ? 'edit' : 'view'}
      style={{
        border: `1px solid ${BORDER}`, borderRadius: R.md, overflow: 'hidden',
        background: CARD, marginBottom: SP.sm,
      }}
    >
      <Button
        variant="ghost"
        size="sm"
        fullWidth
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        icon={<Chevron size={15} color={MUTED} />}
        style={{
          display: 'flex', alignItems: 'center', gap: SP.sm, justifyContent: 'flex-start',
          padding: `${SP.sm}px ${SP.md}px`, background: open ? CARD_HDR : CARD,
          border: 'none', borderBottom: open ? `1px solid ${BORDER}` : 'none',
          textAlign: 'left', borderRadius: 0,
        }}
      >
        <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: SP.sm, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: INK }}>{title}</span>
          {/* Keyword-first headline fact (P6): a single de-emphasized line so the
              collapsed rail is scannable without expansion — "who runs this town
              / why is it tense" reads off the closed card. Hidden once open
              (the card's own content then carries the detail). */}
          {headline && !open && (
            <span style={{ fontFamily: sans, fontSize: FS.xxs, fontWeight: 600, color: BODY, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {headline}
            </span>
          )}
        </span>
        <span style={{
          fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase',
          color: editMode ? GOLD_TXT : MUTED,
        }}>
          {editMode ? 'Edit' : 'Read'}
        </span>
      </Button>
      {open && (
        <div style={{ padding: SP.md }}>
          {hint && (
            <p style={{ fontSize: FS.xxs, color: MUTED, lineHeight: 1.5, margin: `0 0 ${SP.sm}px` }}>{hint}</p>
          )}
          {children}
        </div>
      )}
    </section>
  );
}

/** A subtle "writing is premium" strip shown where a read card would gain write controls. */
function PremiumWriteHint({ onUpgrade }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, marginTop: SP.sm,
      padding: `${SP.xs}px ${SP.sm}px`, background: swatch['#F5EDE0'],
      border: `1px dashed ${BORDER}`, borderRadius: R.sm,
      fontSize: FS.xxs, color: SECOND, fontFamily: sans,
    }}>
      <Lock size={11} color={MUTED} />
      <span style={{ flex: 1 }}>The read surface is free. Editing is a Cartographer (premium) feature.</span>
      {onUpgrade && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onUpgrade}
          style={{ background: 'none', border: 'none', color: GOLD_TXT, fontWeight: 800, fontSize: FS.xs }}
        >
          Upgrade
        </Button>
      )}
    </div>
  );
}

// ── Workshop ─────────────────────────────────────────────────────────────────

/**
 * @param {{
 *   settlement: any,
 *   saveId?: string|null,
 *   save?: any,
 *   editMode?: boolean,
 *   canEdit?: boolean,
 * }} props
 */
export default function Workshop({ settlement, saveId, save, editMode = false, canEdit = false }) {
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const { campaign, worldState, regionalGraph, settlements, nameFor } = useSettlementLiveWorld(saveId);
  const onUpgrade = () => setPurchaseModalOpen?.(true);

  if (!settlement) return null;

  // The write controls (EventComposer, PrimaryDeityPicker, Timeline, …) read the
  // live `settlement` off the store, so they only make sense in edit mode where
  // the store is hydrated to THIS settlement. In view mode the cards show their
  // read surface only.
  const showWrite = editMode && canEdit;

  // Keyword-first headline facts for the collapsed cards (P6 scannability). Each
  // is a single short fact pulled from the already-computed settlement data, so a
  // GM can read "who runs this town / why is it tense" off the closed rail
  // without expanding. All null-safe — a missing fact simply omits the line.
  const rulerName = settlement.powerStructure?.governingName || null;
  const pressureLine = (settlement.pressureSentence || '').trim() || null;
  const deityName = settlement.patronDeity?.name || settlement.powerStructure?.patronDeity || null;
  const eventCount = Array.isArray(settlement.eventLog) ? settlement.eventLog.length : 0;
  const headlines = {
    'causal-state': pressureLine,
    'power-succession': rulerName ? `Ruler: ${rulerName}` : null,
    'faith-pantheon': deityName ? `Patron: ${deityName}` : null,
    'timeline-chronicle': eventCount > 0 ? `${eventCount} logged change${eventCount === 1 ? '' : 's'}` : null,
  };

  return (
    <div data-testid="workshop-rail" style={{ marginBottom: SP.md }}>
      {/* 1 ── Causal State ──────────────────────────────────────────────────── */}
      <WorkshopCard
        id="causal-state"
        title="Causal State"
        headline={headlines['causal-state']}
        hint="The four-dimension health glance, then the sixteen causal variables beneath it. Drill into a variable for the engine's own “why”."
        // Open by default ONLY in edit mode. In the read-only View the dossier
        // above is the hero (P1); the Workshop is the collapsed drill-down, so
        // its first card stays a scent-bearing closed affordance rather than an
        // upfront mechanics dump.
        defaultOpen={showWrite}
        editMode={showWrite}
      >
        <ReadSystemStateBar settlement={settlement} />
        <CausalViewTabs
          settlement={settlement}
          settlementId={saveId}
          worldState={worldState}
          regionalGraph={regionalGraph}
          flat
        />
        <WhatChangedPanel settlement={settlement} />
      </WorkshopCard>

      {/* 2 ── Pressures & Strength ──────────────────────────────────────────── */}
      <WorkshopCard
        id="pressures-strength"
        title="Pressures & Strength"
        hint="Where the settlement is under pressure, its war-cost-aware strength, the live granary, and its standing in the wider realm."
        editMode={showWrite}
      >
        <CausalViewTabs
          settlement={settlement}
          settlementId={saveId}
          worldState={worldState}
          regionalGraph={regionalGraph}
          forceLevel="expert"
          flat
        />
        <EconomicsGranarySection settlement={settlement} />
        <DefenseWarFrontSection
          settlement={settlement}
          warStatus={null}
          nameFor={nameFor}
        />
        <WarFaithSection
          settlement={settlement}
          settlementId={saveId}
          worldState={worldState}
          regionalGraph={regionalGraph}
          settlements={settlements}
          nameFor={nameFor}
        />
      </WorkshopCard>

      {/* 3 ── Faith & Pantheon ──────────────────────────────────────────────── */}
      <WorkshopCard
        id="faith-pantheon"
        title="Faith & Pantheon"
        headline={headlines['faith-pantheon']}
        hint="What this settlement's patron deity does to the substrate, and the controls to assign one and awaken the religion layer."
        editMode={showWrite}
      >
        {/* Read: the axis-effect disclosure (renders nothing deity-free). */}
        <WarFaithSection
          settlement={settlement}
          settlementId={saveId}
          worldState={worldState}
          regionalGraph={regionalGraph}
          settlements={settlements}
          nameFor={nameFor}
          forceLevel="standard"
        />
        {/* The "Awaken religion" gate (+ byte-identical-when-off promise). */}
        <div style={{ marginTop: SP.sm, marginBottom: SP.sm }}>
          <WorkshopGateToggle gateKey="religionDynamicsEnabled" campaign={campaign} canWrite={showWrite} />
        </div>
        {/* Write: assign the primary deity. */}
        {showWrite ? (
          <PrimaryDeityPicker />
        ) : (
          <PremiumWriteHint onUpgrade={onUpgrade} />
        )}
      </WorkshopCard>

      {/* 4 ── Power & Succession ────────────────────────────────────────────── */}
      <WorkshopCard
        id="power-succession"
        title="Power & Succession"
        headline={headlines['power-succession']}
        hint="The ruler, the coup-risk forecast, the contenders, and the lineage of governments that came before."
        editMode={showWrite}
      >
        <PowerSuccessionSection settlement={settlement} />
        <NpcAgencySection npcs={settlement.npcs} />
        {!showWrite && <PremiumWriteHint onUpgrade={onUpgrade} />}
      </WorkshopCard>

      {/* 5 ── Make Changes ──────────────────────────────────────────────────── */}
      <WorkshopCard
        id="make-changes"
        title="Make Changes"
        hint="Apply an in-world event. It is preceded above by the state it mutates, so you edit the substrate with eyes open."
        editMode={showWrite}
      >
        {/* The war-layer + strategy gates live with the change tools, since events
            (declare war, deploy) only matter once the war layer is on. */}
        <div style={{ display: 'grid', gap: SP.xs, marginBottom: SP.sm }}>
          <WorkshopGateToggle gateKey="warLayerEnabled" campaign={campaign} canWrite={showWrite} />
          <WorkshopGateToggle gateKey="settlementStrategyEnabled" campaign={campaign} canWrite={showWrite} />
        </div>
        {showWrite ? (
          <>
            <CoherencePanel />
            <EventComposer />
            <PendingIntentions />
          </>
        ) : (
          <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
            In edit mode, the event composer applies in-world changes: declare a war, install a ruler,
            raze an institution. Each one lands on the timeline.
            <PremiumWriteHint onUpgrade={onUpgrade} />
          </div>
        )}
      </WorkshopCard>

      {/* 6 ── Timeline & Chronicle ──────────────────────────────────────────── */}
      <WorkshopCard
        id="timeline-chronicle"
        title="Timeline & Chronicle"
        headline={headlines['timeline-chronicle']}
        hint="The canon event log: every committed change, in order."
        editMode={showWrite}
      >
        {showWrite ? (
          <Timeline />
        ) : (
          <div style={{ fontSize: FS.sm, color: MUTED, lineHeight: 1.5 }}>
            Once you make changes in edit mode, each appears here as a dated entry in the settlement's history.
          </div>
        )}
      </WorkshopCard>

      {/* 7 ── Provenance & Links ────────────────────────────────────────────── */}
      <WorkshopCard
        id="provenance-links"
        title="Provenance & Links"
        hint="The seed, timestamps, and campaign link behind this dossier."
        editMode={showWrite}
      >
        <ProvenanceBlock save={save || { id: saveId }} />
      </WorkshopCard>
    </div>
  );
}
