// HeraldBody.jsx — the Herald's section bodies (the paper).
//
// RealmInspector owns the chrome (size, tabs, the desk strip, the time lens);
// this component owns the BODY: which news door renders, and with what. The
// pulse + chronicle content is filed by the routing table
// (heraldFeed.buildHeraldFeed) into the four report doors (War / Faith / Trade /
// Events); Divination reads the forecast substrate; Adjudication is the decisions
// desk; Dashboard is the front page + prose session-prep.
//
// Closure discipline (survey wf_e940f170): the heavy section panels keep their
// EXISTING lazy() split (the same dynamic imports the old inspector minted), and
// a small NEW child is a STATIC import so it rides RealmInspector's already-lazy
// chunk at zero first-paint cost.
//
// W-C AMENDS THAT RULE FOR THE TWO REGISTER DOORS (owner directive 5 / J-D5).
// This header used to say "No new lazy() here", on the reasoning that a static
// child costs nothing beyond the inspector chunk it already rides. That reasoning
// holds for a small child of an ALREADY-OPEN door; it does not hold for a whole
// door most sessions never open. The Gazetteer and Ruins & Remembrance are
// mounted through lazy() so their bodies + the heraldRegister read model stay out
// of the inspector chunk until the GM asks for that page. First paint is
// unaffected either way (the inspector is itself lazy); what this buys is the
// Herald's own open cost. @enforced-by tests/build/heraldRegisterDoorsLazy.test.js

import { lazy, useState } from 'react';
import { BookOpen, LayoutList } from 'lucide-react';

import { BODY, BORDER, CARD_ALT, FS, GOLD, INK, RED, SECOND, SP, sans } from '../theme.js';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import { IconButton } from './IconButton.jsx';
import CampaignEmptyState from './CampaignEmptyState.jsx';
import { hasLiveWarState } from '../../domain/display/warStatus.js';
import { flag } from '../../lib/flags.js';
import { needsAttentionDigest } from './heraldFilter.js';
import { Section } from './WorldPulsePrimitives.jsx';
import HeraldSection from './HeraldSection.jsx';
import HeraldForecast from './HeraldForecast.jsx';
import HeraldAdjudication from './HeraldAdjudication.jsx';
import RealmIntrigue from './RealmIntrigue.jsx';
import BeliefDivergenceBand from './BeliefDivergenceBand.jsx';
import PerspectiveStandings from './PerspectiveStandings.jsx';
import RelationshipChronicleSection from './RelationshipChronicleSection.jsx';
import NpcTrailSection from './NpcTrailSection.jsx';
import RealmDocket from './RealmDocket.jsx';
import AdvanceReport from './AdvanceReport.jsx';
import TreatyPanel from './TreatyPanel.jsx';
import ChroniclersLetterPanel from './ChroniclersLetterPanel.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';

// EXISTING lazy split preserved (same dynamic imports as the pre-Herald inspector).
const RealmDashboard = lazy(() => import('./RealmDashboard.jsx'));
const LiveWarStatus  = lazy(() => import('./LiveWarStatus.jsx'));
const PantheonPanel  = lazy(() => import('./PantheonPanel.jsx'));
const AssignDeityFromMap = lazy(() => import('./AssignDeityFromMap.jsx'));
const WarResolveSection = lazy(() => import('./WarResolveSection.jsx'));
const WizardNewsPanel = lazy(() => import('./WizardNewsPanel.jsx'));
// W-C — the two REGISTER doors, each its own lazy leaf (see the header note).
const HeraldGazetteer = lazy(() => import('./HeraldGazetteer.jsx'));
const HeraldRemembrance = lazy(() => import('./HeraldRemembrance.jsx'));
// W-H4 — the THIRD register door, on the same rule and for the same reason: the
// Wanderers page carries a whole read model plus the DM's three verbs, and most
// sessions never turn to it. Its tab is CONDITIONAL (RealmInspector omits it when the
// consequence economy is dark), so this mount is only ever reached by a realm that runs
// the lane at all.
const HeraldWanderers = lazy(() => import('./HeraldWanderers.jsx'));

// DESK-5 — door→overlay affinity: the one-tap, REVERSIBLE map-lens chip. A door
// with a natural map lens offers to light it (and to dim it again — the chip is
// its own undo); it never lights a lens unasked (the upstream auto-Layers.show
// idiom is deliberately not adopted — a door visit must not silently rewrite
// the reader's map). Keys must exist in DEFAULT_LAYERS (toggleLayer refuses
// unknown keys).
const DOOR_LENSES = Object.freeze({
  war: { layerKey: 'warFaith', label: 'war & faith lens' },
  events: { layerKey: 'regionalImpacts', label: 'events lens' },
  wanderers: { layerKey: 'travelers', label: 'travelers lens' },
});
function DoorLensChip({ section }) {
  const lens = DOOR_LENSES[section] || null;
  const lit = useStore(s => (lens ? !!s.mapState?.layers?.[lens.layerKey] : false));
  const toggleLayer = useStore(s => s.toggleLayer);
  if (!lens) return null;
  return (
    <Button
      variant={lit ? 'gold' : 'secondary'}
      size="sm"
      aria-pressed={lit}
      data-testid={`door-lens-${section}`}
      onClick={() => toggleLayer?.(lens.layerKey)}
      style={{ justifySelf: 'start' }}
    >
      {lit ? `Dim the ${lens.label} on the map` : `Light the ${lens.label} on the map`}
    </Button>
  );
}

// A calm peacetime note (the War door's live-block empty tail).
function PeacetimeNote({ campaign }) {
  const mobile = useIsMobile();
  const worldState = campaign?.worldState || {};
  const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;
  if (hasLiveWarState({ worldState, regionalGraph })) return null;
  return (
    <div style={{ padding: SP.sm, color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 750, lineHeight: 1.5 }}>
      The realm is at peace. No sieges, deployments, or trade wars are live.
    </div>
  );
}

// The Dashboard's session-prep prose mode (absorbs the old Letter + the chronicle
// feed + this advance's report). Toggled from the glance stats.
function DashboardBody({ campaign, feed = { bySection: {} }, canManageCampaigns, tier, onUpgrade, nameById, emptyHandlers }) {
  const mobile = useIsMobile();
  const [prose, setProse] = useState(false);
  const nameFor = (id) => nameById?.get(String(id)) || String(id);
  // THE FRONT-PAGE BANNER — the K most-severe live items cross-realm, severity-first
  // (NOT alphabetical here; the sort law's urgent lens on the front page).
  const digest = campaign ? needsAttentionDigest(feed, 4) : [];
  return (
    <div style={{ display: 'grid', gap: SP.md }}>
      {digest.length > 0 && (
        <div data-testid="dashboard-needs-attention" style={{ border: `1px solid ${GOLD}`, borderLeft: `3px solid ${RED}`, background: CARD_ALT, padding: SP.sm, display: 'grid', gap: 4 }}>
          <div style={{ color: RED, fontFamily: sans, fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Needs attention</div>
          {digest.map(item => (
            <div key={item.id} style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, overflowWrap: 'anywhere' }}>{item.headline}</div>
          ))}
        </div>
      )}
      {campaign && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setProse(false)} aria-pressed={!prose} aria-label="The realm at a glance" active={!prose}>
            <LayoutList size={13} /> Glance
          </IconButton>
          <IconButton onClick={() => setProse(true)} aria-pressed={prose} aria-label="Prose session-prep" active={prose}>
            <BookOpen size={13} /> Session prep
          </IconButton>
        </div>
      )}
      {!prose && (
        <>
          <RealmDashboard
            campaign={campaign}
            canManageCampaigns={canManageCampaigns}
            tier={tier}
            onUpgrade={onUpgrade}
            nameById={nameById}
            {...emptyHandlers}
          />
        </>
      )}
      {prose && campaign && (
        <div style={{ display: 'grid', gap: SP.md }}>
          <ChroniclersLetterPanel campaign={campaign} />
          <AdvanceReport campaign={campaign} nameFor={nameFor} />
          <WizardNewsPanel campaign={campaign} />
        </div>
      )}
    </div>
  );
}

/**
 * @param {object} props
 * @param {string} props.section       active door id
 * @param {any} props.campaign
 * @param {'advance'|'campaign'} props.timeLens
 * @param {Map<string,string>} props.nameById
 * @param {Array<any>} props.saves
 * @param {object} props.emptyHandlers
 * @param {boolean} props.canManageCampaigns
 * @param {string} props.tier
 * @param {() => void} [props.onUpgrade]
 * @param {ReadonlyArray<Record<string, unknown>>} [props.realmDecisionItems]
 * @param {string|null} [props.activeDecisionItemId]
 * @param {(() => void)|null} [props.onOpenGatheredDocket]  J-D7: re-open the gathered
 *   adjudication screen from the Adjudication door's one-line pointer.
 */
export default function HeraldBody({
  section,
  campaign,
  feed = { bySection: {}, counts: {} },
  focusId = null,
  focusName = '',
  narrowing = false,
  totalCounts = null,
  nameById,
  saves = [],
  emptyHandlers,
  canManageCampaigns,
  tier,
  onUpgrade,
  realmDecisionItems,
  activeDecisionItemId = null,
  onOpenGatheredDocket = null,
}) {
  const mobile = useIsMobile();
  const showResolve = flag('warEconomySurfacing');
  const bySection = feed.bySection || {};
  // DESK-5 — the unfiltered per-door denominator for the footer sentence.
  const totalFor = (id) => (totalCounts && Number.isFinite(totalCounts[id]) ? totalCounts[id] : null);
  // A focus/filter that empties a door reads as the local edition's "nothing here",
  // not a broken panel — the "table of contents" the tab badges also carry.
  const focusEmpty = (base) => (focusId != null ? `Nothing at ${focusName}.` : narrowing ? 'Nothing matches the current filter.' : base);

  if (section === 'dashboard') {
    return (
      <DashboardBody
        campaign={campaign}
        feed={feed}
        canManageCampaigns={canManageCampaigns}
        tier={tier}
        onUpgrade={onUpgrade}
        nameById={nameById}
        emptyHandlers={emptyHandlers}
      />
    );
  }

  if (!campaign) {
    const leads = {
      war: 'War and diplomacy fills once a campaign is live.',
      faith: 'Faith and the pantheon fill once a campaign is live.',
      trade: 'Trade and treaties fill once a campaign is live.',
      events: 'The realm\'s events fill once a campaign is live.',
      divination: 'The forecast reads a live campaign\'s rising pressures.',
      adjudication: 'Decisions await once a campaign\'s realm is live.',
      gazetteer: 'The register fills with every settlement a live campaign counts.',
      remembrance: 'The realm remembers its lost places once a campaign is live.',
      wanderers: 'The realm keeps track of its wanderers once a campaign is live.',
    };
    return <CampaignEmptyState lead={leads[section] || leads.events} {...emptyHandlers} />;
  }

  if (section === 'war') {
    return (
      <HeraldSection items={bySection.war} worldState={campaign.worldState} nameById={nameById} emptyLead={focusEmpty('No war reported since the last turning. The realm holds.')} totalCount={totalFor('war')} narrowing={narrowing}>
        <div style={{ display: 'grid', gap: SP.sm }}>
          <DoorLensChip section="war" />
          <LiveWarStatus campaign={campaign} nameById={nameById} />
          <RealmIntrigue campaign={campaign} nameById={nameById} />
          <BeliefDivergenceBand campaign={campaign} nameById={nameById} />
          {/* DESK-4 — one observer, its relations in plain words; the believed
              half is DM-gated inside; the omniscient matrix stays refused. */}
          <PerspectiveStandings campaign={campaign} nameById={nameById} />
          {/* LT39 — the other half of that desk: what those standings SURVIVED.
              Self-gates to absent on a realm with no recorded history; the covert
              rows are withheld inside the read model, fail-closed. */}
          <RelationshipChronicleSection campaign={campaign} nameById={nameById} />
          {/* LT39 car 5 — the court's dated record, beside RealmIntrigue's
              present standing. DM-only inside; absent when the ladder recorded
              nothing. */}
          <NpcTrailSection campaign={campaign} />
          {showResolve && (
            <WarResolveSection
              campaign={campaign}
              saves={saves}
              nameById={nameById}
            />
          )}
          <PeacetimeNote campaign={campaign} />
        </div>
      </HeraldSection>
    );
  }

  if (section === 'faith') {
    return (
      <HeraldSection items={bySection.faith} worldState={campaign.worldState} nameById={nameById} emptyLead={focusEmpty('No faith stirred since the last turning. The altars are quiet.')} totalCount={totalFor('faith')} narrowing={narrowing}>
        <div style={{ display: 'grid', gap: SP.md }}>
          <PantheonPanel campaign={campaign} />
          <AssignDeityFromMap campaign={campaign} />
        </div>
      </HeraldSection>
    );
  }

  if (section === 'trade') {
    return (
      <HeraldSection items={bySection.trade} worldState={campaign.worldState} nameById={nameById} emptyLead={focusEmpty('No trade shifted since the last turning. The roads run as they did.')} totalCount={totalFor('trade')} narrowing={narrowing}>
        <TreatyPanel campaign={campaign} nameById={nameById} />
      </HeraldSection>
    );
  }

  if (section === 'events') {
    return (
      <HeraldSection items={bySection.events} worldState={campaign.worldState} nameById={nameById} emptyLead={focusEmpty('Little else of note since the last turning.')} totalCount={totalFor('events')} narrowing={narrowing}>
        <DoorLensChip section="events" />
      </HeraldSection>
    );
  }

  if (section === 'divination') {
    // THE FORECAST DOOR — not a past report. The pressure/emergence substrate read in
    // present-progressive grammar (HeraldForecast), visually unmistakable as a weather
    // page: a dashed frame, every entry amendable. Severity-first (the closest reckoning
    // leads).
    const forecasts = [...(bySection.divination || [])].sort((a, b) => (b.severity ?? 0) - (a.severity ?? 0));
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{ border: `1px dashed ${GOLD}`, background: CARD_ALT, padding: SP.sm }}>
          <div style={{ color: SECOND, fontFamily: sans, fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            The forecast · amendable, not yet come to pass
          </div>
          <RealmDocket campaign={campaign} />
        </div>
        <Section heading="Pressures building" count={forecasts.length}>
          {forecasts.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, padding: 14, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              {focusEmpty('No pressure is building that the realm can yet foresee.')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {forecasts.map(item => <HeraldForecast key={item.id} item={item} nameById={nameById} />)}
            </div>
          )}
        </Section>
      </div>
    );
  }

  // ── THE TWO REGISTERS (W-C) ────────────────────────────────────────────────
  // Not report doors: they carry no feed items and no focus/filter narrowing,
  // because a register answers "what is there", not "what happened since".
  if (section === 'gazetteer') {
    return <HeraldGazetteer campaign={campaign} saves={saves} />;
  }

  if (section === 'remembrance') {
    return <HeraldRemembrance campaign={campaign} saves={saves} />;
  }

  if (section === 'wanderers') {
    return (
      <div style={{ display: 'grid', gap: SP.sm }}>
        <DoorLensChip section="wanderers" />
        <HeraldWanderers campaign={campaign} saves={saves} />
      </div>
    );
  }

  if (section === 'adjudication') {
    return (
      <HeraldAdjudication
        campaign={campaign}
        focusId={focusId}
        focusName={focusName}
        realmDecisionItems={realmDecisionItems}
        activeDecisionItemId={activeDecisionItemId}
        onOpenGatheredDocket={onOpenGatheredDocket}
      />
    );
  }

  return <div style={{ padding: SP.sm, color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), border: `1px dashed ${BORDER}` }}>Unknown section.</div>;
}
