// HeraldBody.jsx — the Herald's seven section bodies (the paper).
//
// RealmInspector owns the chrome (size, tabs, the desk strip, the time lens);
// this component owns the BODY: which of the seven news doors renders, and with
// what. The pulse + chronicle content is filed by the routing table
// (heraldFeed.buildHeraldFeed) into the four report doors (War / Faith / Trade /
// Events); Divination reads the forecast substrate; Adjudication is the decisions
// desk; Dashboard is the front page + prose session-prep.
//
// Closure discipline (survey wf_e940f170): the heavy section panels keep their
// EXISTING lazy() split (net-zero preload manifest — the same dynamic imports the
// old inspector minted); every NEW child is a STATIC import so it rides
// RealmInspector's already-lazy chunk at zero first-paint cost. No new lazy() here.

import { lazy, useMemo, useState } from 'react';
import { BookOpen, LayoutList } from 'lucide-react';

import { BODY, BORDER, CARD_ALT, FS, GOLD, SECOND, SP, sans } from '../theme.js';
import { IconButton } from './IconButton.jsx';
import CampaignEmptyState from './CampaignEmptyState.jsx';
import { hasLiveWarState } from '../../domain/display/warStatus.js';
import { flag } from '../../lib/flags.js';
import { buildHeraldFeed } from './heraldFeed.js';
import HeraldSection from './HeraldSection.jsx';
import HeraldAdjudication from './HeraldAdjudication.jsx';
import RealmIntrigue from './RealmIntrigue.jsx';
import BeliefDivergenceBand from './BeliefDivergenceBand.jsx';
import RealmDocket from './RealmDocket.jsx';
import WhileYouWereAway from './WhileYouWereAway.jsx';
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
function DashboardBody({ campaign, canManageCampaigns, tier, onUpgrade, nameById, emptyHandlers }) {
  const [prose, setProse] = useState(false);
  const nameFor = (id) => nameById?.get(String(id)) || String(id);
  return (
    <div style={{ display: 'grid', gap: SP.md }}>
      {campaign && (
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setProse(false)} aria-pressed={!prose} active={!prose} title="The realm at a glance">
            <LayoutList size={13} /> Glance
          </IconButton>
          <IconButton onClick={() => setProse(true)} aria-pressed={prose} active={prose} title="Prose session-prep">
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
          {campaign && <WhileYouWereAway campaignId={campaign.id} />}
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
 * @param {object} props.emptyHandlers
 * @param {boolean} props.canManageCampaigns
 * @param {string} props.tier
 * @param {() => void} [props.onUpgrade]
 */
export default function HeraldBody({ section, campaign, timeLens, nameById, emptyHandlers, canManageCampaigns, tier, onUpgrade }) {
  const feed = useMemo(() => buildHeraldFeed(campaign, { lens: timeLens }), [campaign, timeLens]);
  const showResolve = flag('warEconomySurfacing');

  if (section === 'dashboard') {
    return (
      <DashboardBody
        campaign={campaign}
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
    };
    return <CampaignEmptyState lead={leads[section] || leads.events} {...emptyHandlers} />;
  }

  if (section === 'war') {
    return (
      <HeraldSection items={feed.bySection.war} worldState={campaign.worldState} nameById={nameById} emptyLead="No war reported since the last turning. The realm holds.">
        <div style={{ display: 'grid', gap: SP.sm }}>
          <LiveWarStatus campaign={campaign} nameById={nameById} />
          <RealmIntrigue campaign={campaign} nameById={nameById} />
          <BeliefDivergenceBand campaign={campaign} nameById={nameById} />
          {showResolve && <WarResolveSection campaign={campaign} saves={[]} nameById={nameById} />}
          <PeacetimeNote campaign={campaign} />
        </div>
      </HeraldSection>
    );
  }

  if (section === 'faith') {
    return (
      <HeraldSection items={feed.bySection.faith} worldState={campaign.worldState} nameById={nameById} emptyLead="No faith stirred since the last turning. The altars are quiet.">
        <div style={{ display: 'grid', gap: SP.md }}>
          <PantheonPanel campaign={campaign} />
          <AssignDeityFromMap campaign={campaign} />
        </div>
      </HeraldSection>
    );
  }

  if (section === 'trade') {
    return (
      <HeraldSection items={feed.bySection.trade} worldState={campaign.worldState} nameById={nameById} emptyLead="No trade shifted since the last turning. The roads run as they did.">
        <TreatyPanel campaign={campaign} nameById={nameById} />
      </HeraldSection>
    );
  }

  if (section === 'events') {
    return <HeraldSection items={feed.bySection.events} worldState={campaign.worldState} nameById={nameById} emptyLead="Little else of note since the last turning." />;
  }

  if (section === 'divination') {
    return (
      <HeraldSection
        items={feed.bySection.divination}
        worldState={campaign.worldState}
        nameById={nameById}
        title="Pressures building"
        emptyLead="No pressure is building that the realm can yet foresee."
      >
        <div style={{ border: `1px solid ${GOLD}`, background: CARD_ALT, padding: SP.sm }}>
          <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            The forecast · amendable, not yet come to pass
          </div>
          <RealmDocket campaign={campaign} />
        </div>
      </HeraldSection>
    );
  }

  if (section === 'adjudication') {
    return <HeraldAdjudication campaign={campaign} />;
  }

  return <div style={{ padding: SP.sm, color: BODY, fontFamily: sans, fontSize: FS.xs, border: `1px dashed ${BORDER}` }}>Unknown section.</div>;
}
