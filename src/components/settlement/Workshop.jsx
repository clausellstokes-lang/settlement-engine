/**
 * Workshop — the editor's two-card edit surface (edit-IA refinement).
 *
 * REPLACES the flat stack of labelled engine cards with a coherent
 * two-card information architecture, gated behind "Edit Dossier" upstream:
 *
 *   Card 1 — "The settlement" (its own attributes, read-leaning):
 *       Causal State · Pressures & Strength · Power & Succession ·
 *       Timeline & Chronicle · Provenance & Links.
 *
 *   Card 2 — "Change the settlement" (the write surface):
 *       Make Changes (the event composer + coherence + pending intentions),
 *       the Assign-deity write, the Living-world layer toggles, and the
 *       Link-neighbour / Edit-names affordances (passed in as `changeExtras`,
 *       since they own SettlementDetail state). Structured cleanly so a future
 *       change-queue can slot in without re-laying-out the card.
 *
 * Each sub-section keeps its OWN collapse, so a GM can still drill one surface
 * at a time. Both outer cards READ in view mode (the free→premium teaser — the
 * Phase 2 dossier read components: WarFaithSection, EngineSections,
 * ReadSystemStateBar) and become EDITABLE in edit mode (write controls premium).
 *
 * Faith & Pantheon is no longer its own edit card: the faith READ lives in the
 * dossier's War & Faith tab (new/tabs/WarFaithTab) and the Pressures card's
 * WarFaithSection, and the deity-assign WRITE (SET_PRIMARY_DEITY via
 * PrimaryDeityPicker) relocates into Card 2. The "Awaken religion" gate joins
 * the War-layer + Settlement-strategy gates as one Living-world layer group.
 *
 * The canonical Substrate/Causal READ (the 16-variable grid) and the
 * What-changed deltas are NOT duplicated here: they live in the tabbed dossier
 * above (Systems -> Substrate; Summary owns WhatChangedPanel).
 *
 * The 3 subsystem gate toggles (warLayerEnabled / settlementStrategyEnabled /
 * religionDynamicsEnabled) appear here, in ADDITION to the SimulationRulesDialog,
 * each carrying the byte-identical-when-off promise.
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { useSettlementLiveWorld } from '../../hooks/useSettlementLiveWorld.js';

// Read surfaces (Phase 2). These are the free→premium teaser.
import ReadSystemStateBar from './ReadSystemStateBar.jsx';
import WarFaithSection from './WarFaithSection.jsx';
import {
  EconomicsGranarySection,
  DefenseWarFrontSection,
  PowerSuccessionSection,
  NpcAgencySection,
} from '../dossier/EngineSections.jsx';

// Write controls (premium). Mounted only in edit mode.
import EventComposer from './EventComposer.jsx';
import ChangeQueuePanel from './ChangeQueuePanel.jsx';
import PrimaryDeityPicker from './PrimaryDeityPicker.jsx';
import Timeline from './Timeline.jsx';
import PendingIntentions from './PendingIntentions.jsx';
import CoherencePanel from './CoherencePanel.jsx';
import ProvenanceBlock from './ProvenanceBlock.jsx';
import WorkshopGateToggle from './WorkshopGateToggle.jsx';
import Button from '../primitives/Button.jsx';

import { INK, MUTED, BODY, SECOND, BORDER, CARD, CARD_HDR, GOLD_TXT, sans, FS, R, SP, swatch } from '../theme.js';

// ── Collapsible sub-section shell ────────────────────────────────────────────

/**
 * A single collapsible surface inside an outer grouping card. Carries the same
 * data-testid / data-mode contract the prior flat cards exposed, so callers and
 * tests can still address each surface by id.
 *
 * @param {{
 *   id: string, anchorId?: string, title: string, hint?: string,
 *   headline?: string, defaultOpen?: boolean, editMode?: boolean,
 *   children: React.ReactNode,
 * }} props
 */
function WorkshopCard({ id, anchorId, title, hint, headline, defaultOpen = false, editMode = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <section
      id={anchorId}
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
              collapsed rail is scannable without expansion. Hidden once open. */}
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

/** A subtle "writing is premium" strip shown where a read surface would gain write controls. */
function PremiumWriteHint({ onUpgrade }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, marginTop: SP.sm,
      padding: `${SP.xs}px ${SP.sm}px`, background: swatch['#F5EDE0'],
      border: `1px dashed ${BORDER}`, borderRadius: R.sm,
      fontSize: FS.xxs, color: SECOND, fontFamily: sans,
    }}>
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

/**
 * GroupCard — the outer grouping shell. Carries a clear title + a quiet
 * standfirst, and holds the collapsible sub-sections as accessible content.
 * The heading is a real <h2> so the two-card IA reads in the document outline.
 *
 * @param {{
 *   id: string, title: string, blurb?: string, children: React.ReactNode,
 * }} props
 */
function GroupCard({ id, title, blurb, children }) {
  return (
    <section
      data-testid={`workshop-group-${id}`}
      data-group={id}
      aria-label={title}
      style={{ marginBottom: SP.lg }}
    >
      <header style={{ margin: `0 0 ${SP.sm}px` }}>
        <h2 style={{ margin: 0, fontFamily: sans, fontSize: FS.md, fontWeight: 900, color: INK, letterSpacing: '0.01em' }}>
          {title}
        </h2>
        {blurb && (
          <p style={{ margin: `${SP.xs}px 0 0`, fontFamily: sans, fontSize: FS.xxs, color: MUTED, lineHeight: 1.5 }}>
            {blurb}
          </p>
        )}
      </header>
      {children}
    </section>
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
 *   changeExtras?: React.ReactNode,
 *   onQueueCommitted?: (settlement: any) => void,
 * }} props
 */
export default function Workshop({ settlement, saveId, save, editMode = false, canEdit = false, changeExtras = null, onQueueCommitted = null }) {
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  const { campaign, worldState, regionalGraph, settlements, nameFor } = useSettlementLiveWorld(saveId);
  const onUpgrade = () => setPurchaseModalOpen?.(true);

  if (!settlement) return null;

  // The write controls (EventComposer, PrimaryDeityPicker, Timeline, …) read the
  // live `settlement` off the store, so they only make sense in edit mode where
  // the store is hydrated to THIS settlement. In view mode the cards show their
  // read surface only.
  const showWrite = editMode && canEdit;

  // Keyword-first headline facts for the collapsed cards (P6 scannability).
  const rulerName = settlement.powerStructure?.governingName || null;
  const pressureLine = (settlement.pressureSentence || '').trim() || null;
  const eventCount = Array.isArray(settlement.eventLog) ? settlement.eventLog.length : 0;
  const headlines = {
    'causal-state': pressureLine,
    'power-succession': rulerName ? `Ruler: ${rulerName}` : null,
    'timeline-chronicle': eventCount > 0 ? `${eventCount} logged change${eventCount === 1 ? '' : 's'}` : null,
  };

  return (
    <div data-testid="workshop-rail" style={{ marginBottom: SP.md }}>

      {/* ══ Card 1 — The settlement ════════════════════════════════════════════
          The dossier's own attributes: its causal state, its pressures and
          strength, its power and succession, its timeline, and its provenance.
          Read-leaning; the write here is limited to the timeline drill-down. */}
      <GroupCard
        id="the-settlement"
        title="The settlement"
        blurb="Its own attributes — the causal state, the pressures and strength, the power and succession, the timeline, and the provenance behind this dossier."
      >
        {/* 1 ── Causal State ─────────────────────────────────────────────────── */}
        <WorkshopCard
          id="causal-state"
          title="Causal State"
          headline={headlines['causal-state']}
          hint="The four-dimension health glance. The sixteen causal variables live in the dossier above (Systems -> Substrate)."
          // Open by default ONLY in edit mode. In the read-only View the dossier
          // above is the hero; the Workshop is the collapsed drill-down.
          defaultOpen={showWrite}
          editMode={showWrite}
        >
          <ReadSystemStateBar settlement={settlement} />
        </WorkshopCard>

        {/* 2 ── Pressures & Strength ─────────────────────────────────────────── */}
        <WorkshopCard
          id="pressures-strength"
          title="Pressures and Strength"
          hint="The live granary, its war-cost-aware strength, and its standing in the wider realm. The full substrate grid lives in the dossier above (Systems -> Substrate)."
          editMode={showWrite}
        >
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

        {/* 3 ── Power & Succession ───────────────────────────────────────────── */}
        <WorkshopCard
          id="power-succession"
          title="Power and Succession"
          headline={headlines['power-succession']}
          hint="The ruler, the coup-risk forecast, the contenders, and the lineage of governments that came before."
          editMode={showWrite}
        >
          <PowerSuccessionSection settlement={settlement} />
          <NpcAgencySection npcs={settlement.npcs} />
          {!showWrite && <PremiumWriteHint onUpgrade={onUpgrade} />}
        </WorkshopCard>

        {/* 4 ── Timeline & Chronicle ─────────────────────────────────────────── */}
        <WorkshopCard
          id="timeline-chronicle"
          title="Timeline and Chronicle"
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

        {/* 5 ── Provenance & Links ───────────────────────────────────────────── */}
        <WorkshopCard
          id="provenance-links"
          title="Provenance and Links"
          hint="The seed, timestamps, and campaign link behind this dossier."
          editMode={showWrite}
        >
          <ProvenanceBlock save={save || { id: saveId }} />
        </WorkshopCard>
      </GroupCard>

      {/* ══ Card 2 — Change the settlement ═════════════════════════════════════
          The write surface: the event composer, the deity-assign write, the
          living-world layer toggles, and the link / rename affordances. Each
          change applies immediately today; the section is structured so a future
          change-queue can slot in above the composer without re-laying it out. */}
      <GroupCard
        id="change-the-settlement"
        title="Change the settlement"
        blurb="The write surface — apply an in-world event, assign a patron deity, link a neighbour, or rename what lives here. Each change lands on the timeline above."
      >
        {/* 6 ── Make Changes ─────────────────────────────────────────────────── */}
        <WorkshopCard
          id="make-changes"
          anchorId="workshop-make-changes"
          title="Make Changes"
          hint="Apply an in-world event. It is preceded above by the state it mutates, so you edit the substrate with eyes open."
          defaultOpen={showWrite}
          editMode={showWrite}
        >
          {showWrite ? (
            <>
              {/* The change-queue: staged orders sit here, between the read of
                  current state and the composer that mutates it. Hidden when the
                  queue is empty. Committing soft-refreshes the dossier above. */}
              <ChangeQueuePanel saveId={saveId} onCommitted={onQueueCommitted} />
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

        {/* 7 ── Assign a deity ───────────────────────────────────────────────── */}
        {/* The faith READ now lives in the dossier's War & Faith tab and the
            Pressures card above; only the deity-assign WRITE remains, regrouped
            here under the change surface (SET_PRIMARY_DEITY via PrimaryDeityPicker). */}
        <WorkshopCard
          id="assign-deity"
          title="Assign a Deity"
          hint="Name this settlement's patron. Its effect on the substrate is read in the dossier's War & Faith tab; awaken the living religion layer below."
          editMode={showWrite}
        >
          {showWrite ? (
            <PrimaryDeityPicker />
          ) : (
            <PremiumWriteHint onUpgrade={onUpgrade} />
          )}
        </WorkshopCard>

        {/* 8 ── Living-world layers ──────────────────────────────────────────── */}
        {/* The three subsystem gates, now one group: War layer, Settlement
            strategy, and (moved in from the old Faith card) Awaken religion. Each
            is opt-in and byte-identical when off. Faith is a layer here, not an
            edit card. */}
        <WorkshopCard
          id="living-world-layers"
          title="Living-world Layers"
          hint="Opt-in subsystems for the wider realm, off by default and byte-identical to today while off. Turn one on and the realm starts moving."
          editMode={showWrite}
        >
          <div style={{ display: 'grid', gap: SP.xs }}>
            <WorkshopGateToggle gateKey="warLayerEnabled" campaign={campaign} canWrite={canEdit} />
            <WorkshopGateToggle gateKey="settlementStrategyEnabled" campaign={campaign} canWrite={canEdit} />
            <WorkshopGateToggle gateKey="religionDynamicsEnabled" campaign={campaign} canWrite={canEdit} />
          </div>
        </WorkshopCard>

        {/* 9 ── Link a neighbour / Edit names ────────────────────────────────────
            These own SettlementDetail state (the linking picker, the neighbour
            network, the rename drafts), so SettlementDetail passes their existing
            JSX down unchanged. They sit inside Card 2 so the change surface reads
            as one coherent group, with no behaviour change. */}
        {changeExtras}
      </GroupCard>
    </div>
  );
}
