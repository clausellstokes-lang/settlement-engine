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
import RealmDocket from './RealmDocket.jsx';
import AdvanceReport from './AdvanceReport.jsx';
import TreatyPanel from './TreatyPanel.jsx';
import ChroniclersLetterPanel from './ChroniclersLetterPanel.jsx';

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

// A calm peacetime note (the War door's live-block empty tail).
function PeacetimeNote({ campaign }) {
  const worldState = campaign?.worldState || {};
  const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;
  if (hasLiveWarState({ worldState, regionalGraph })) return null;
  return (
    <div style={{ padding: SP.sm, color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 750, lineHeight: 1.5 }}>
      The realm is at peace. No sieges, deployments, or trade wars are live.
    </div>
  );
}

// The Dashboard's session-prep prose mode (absorbs the old Letter + the chronicle
// feed + this advance's report). Toggled from the glance stats.
function DashboardBody({ campaign, feed = { bySection: {} }, canManageCampaigns, tier, onUpgrade, nameById, emptyHandlers }) {
  const [prose, setProse] = useState(false);
  const nameFor = (id) => nameById?.get(String(id)) || String(id);
  // THE FRONT-PAGE BANNER — the K most-severe live items cross-realm, severity-first
  // (NOT alphabetical here; the sort law's urgent lens on the front page).
  const digest = campaign ? needsAttentionDigest(feed, 4) : [];
  return (
    <div style={{ display: 'grid', gap: SP.md }}>
      {digest.length > 0 && (
        <div data-testid="dashboard-needs-attention" style={{ border: `1px solid ${GOLD}`, borderLeft: `3px solid ${RED}`, background: CARD_ALT, padding: SP.sm, display: 'grid', gap: 4 }}>
          <div style={{ color: RED, fontFamily: sans, fontSize: FS.micro, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Needs attention</div>
          {digest.map(item => (
            <div key={item.id} style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, overflowWrap: 'anywhere' }}>{item.headline}</div>
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
 */
export default function HeraldBody({
  section,
  campaign,
  feed = { bySection: {}, counts: {} },
  focusId = null,
  focusName = '',
  narrowing = false,
  nameById,
  saves = [],
  emptyHandlers,
  canManageCampaigns,
  tier,
  onUpgrade,
  realmDecisionItems,
  activeDecisionItemId = null,
}) {
  const showResolve = flag('warEconomySurfacing');
  const bySection = feed.bySection || {};
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
    };
    return <CampaignEmptyState lead={leads[section] || leads.events} {...emptyHandlers} />;
  }

  if (section === 'war') {
    return (
      <HeraldSection items={bySection.war} worldState={campaign.worldState} nameById={nameById} emptyLead={focusEmpty('No war reported since the last turning. The realm holds.')}>
        <div style={{ display: 'grid', gap: SP.sm }}>
          <LiveWarStatus campaign={campaign} nameById={nameById} />
          <RealmIntrigue campaign={campaign} nameById={nameById} />
          <BeliefDivergenceBand campaign={campaign} nameById={nameById} />
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
      <HeraldSection items={bySection.faith} worldState={campaign.worldState} nameById={nameById} emptyLead={focusEmpty('No faith stirred since the last turning. The altars are quiet.')}>
        <div style={{ display: 'grid', gap: SP.md }}>
          <PantheonPanel campaign={campaign} />
          <AssignDeityFromMap campaign={campaign} />
        </div>
      </HeraldSection>
    );
  }

  if (section === 'trade') {
    return (
      <HeraldSection items={bySection.trade} worldState={campaign.worldState} nameById={nameById} emptyLead={focusEmpty('No trade shifted since the last turning. The roads run as they did.')}>
        <TreatyPanel campaign={campaign} nameById={nameById} />
      </HeraldSection>
    );
  }

  if (section === 'events') {
    return <HeraldSection items={bySection.events} worldState={campaign.worldState} nameById={nameById} emptyLead={focusEmpty('Little else of note since the last turning.')} />;
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
          <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
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

  if (section === 'adjudication') {
    return (
      <HeraldAdjudication
        campaign={campaign}
        focusId={focusId}
        focusName={focusName}
        realmDecisionItems={realmDecisionItems}
        activeDecisionItemId={activeDecisionItemId}
      />
    );
  }

  return <div style={{ padding: SP.sm, color: BODY, fontFamily: sans, fontSize: FS.xs, border: `1px dashed ${BORDER}` }}>Unknown section.</div>;
}
