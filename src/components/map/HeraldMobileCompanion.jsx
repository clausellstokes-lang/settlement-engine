/**
 * HeraldMobileCompanion.jsx — the phone-safe reading and decision surface for
 * the flagged command brief.
 *
 * Map authoring remains desktop-only. This companion deliberately mounts below
 * that capability gate so a GM can still read the Briefing and Stories, review
 * Plans, complete a Decision through the established adjudication writer, and
 * return to the edition that sent them there.
 */

import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { BookOpen, Eye, Gavel, LayoutDashboard } from 'lucide-react';

import { buildRealmItemReadModel } from '../../domain/realm/realmItemReadModel.js';
import { useStore } from '../../store/index.js';
import { BODY, BORDER, CARD, FS, GOLD, SECOND, SP, sans } from '../theme.js';
import { IconButton } from './IconButton.jsx';
import HeraldCommandBody from './HeraldCommandBody.jsx';
import { buildHeraldFeed } from './heraldFeed.js';
import { filterFeed } from './heraldFilter.js';
import {
  STORY_TOPICS,
  commandLocationOf,
  legacyAddressForCommandView,
  legacyAddressForStoryTopic,
} from './heraldCommandNavigation.js';
import {
  commandViewCounts,
  filterRealmItems,
} from './heraldCommandSelectors.js';

const MOBILE_VIEWS = Object.freeze([
  { id: 'briefing', label: 'Briefing', Icon: LayoutDashboard },
  { id: 'stories', label: 'Stories', Icon: BookOpen },
  { id: 'plans', label: 'Plans', Icon: Eye },
  { id: 'decisions', label: 'Decisions', Icon: Gavel },
]);

const MOBILE_HEADER_STYLE = Object.freeze({
  display: 'flex',
  alignItems: 'baseline',
  gap: SP.sm,
  flexWrap: 'wrap',
  borderBottom: `1px solid ${GOLD}`,
  paddingBottom: SP.xs,
});

const MOBILE_TITLE_STYLE = Object.freeze({
  margin: 0,
  color: SECOND,
  fontFamily: sans,
  fontSize: FS.sm,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

const CONTROL_GROUP_STYLE = Object.freeze({
  display: 'flex',
  gap: 6,
  flexWrap: 'wrap',
});

const MOBILE_BODY_STYLE = Object.freeze({
  minWidth: 0,
  maxHeight: '70dvh',
  overflowY: 'auto',
  border: `1px solid ${BORDER}`,
  background: CARD,
  padding: SP.sm,
});

/**
 * @param {object} props
 * @param {Record<string, unknown>|null} props.campaign
 * @param {Array<Record<string, unknown>>} props.saves active campaign member saves
 * @param {Map<string,string>} props.nameById
 */
export default function HeraldMobileCompanion({
  campaign,
  saves = [],
  nameById = new Map(),
  canManageCampaigns,
  tier,
  onUpgrade,
  onCreateCampaign,
  onSelectCampaign,
  hasCampaigns = false,
}) {
  const canUseCustom = useStore(state => (
    typeof state.canUseCustomContent === 'function' ? state.canUseCustomContent() : false
  ));
  const [section, setSection] = useState('briefing');
  const [returnOrigin, setReturnOrigin] = useState(null);
  const bodyRef = useRef(null);
  const pendingRestoreRef = useRef(null);
  const location = commandLocationOf(section);
  const realmModel = useMemo(
    () => buildRealmItemReadModel(campaign, { saves, canUseCustom }),
    [campaign, saves, canUseCustom],
  );
  const feed = useMemo(
    () => filterFeed(buildHeraldFeed(campaign, { lens: 'advance' }), { nameById }),
    [campaign, nameById],
  );
  const commandCounts = useMemo(
    () => commandViewCounts(filterRealmItems(realmModel.items, {
      timeLens: 'advance',
      nameById,
    })),
    [realmModel, nameById],
  );

  const navigate = (nextSection, item) => {
    if (item) {
      setReturnOrigin({
        section,
        label: location.view === 'briefing' ? 'Briefing' : 'Stories',
        itemId: String(item?.presentationKey || item?.id || '').trim() || null,
        scrollTop: bodyRef.current?.scrollTop || 0,
      });
    }
    setSection(nextSection);
  };

  const returnToEdition = () => {
    if (!returnOrigin) return;
    pendingRestoreRef.current = returnOrigin;
    setSection(returnOrigin.section);
    setReturnOrigin(null);
  };

  useEffect(() => {
    const restore = pendingRestoreRef.current;
    if (!restore || commandLocationOf(section).view !== commandLocationOf(restore.section).view) return;
    const body = bodyRef.current;
    if (!body) return;
    body.scrollTop = Number(restore.scrollTop) || 0;
    const candidates = body.querySelectorAll('[data-herald-command-origin]');
    const trigger = [...candidates].find(node => (
      node.getAttribute('data-herald-command-origin') === restore.itemId
    ));
    if (trigger) trigger.focus();
    else body.focus();
    pendingRestoreRef.current = null;
  }, [section]);

  const chooseView = (view) => {
    setReturnOrigin(null);
    setSection(legacyAddressForCommandView(view));
  };

  const chooseTopic = (topic) => {
    setReturnOrigin(null);
    setSection(legacyAddressForStoryTopic(topic));
  };

  return (
    <section
      data-testid="herald-mobile-companion"
      aria-labelledby="herald-mobile-title"
      style={{ display: 'grid', gap: SP.sm, minWidth: 0 }}
    >
      <div style={MOBILE_HEADER_STYLE}>
        <h2 id="herald-mobile-title" style={MOBILE_TITLE_STYLE}>
          The Herald
        </h2>
        <span style={{
          color: BODY,
          fontFamily: sans,
          fontSize: FS.micro,
          fontWeight: 750,
        }}>
          Field companion
        </span>
      </div>

      <div
        role="group"
        aria-label="Herald sections"
        style={CONTROL_GROUP_STYLE}
      >
        {MOBILE_VIEWS.map(view => (
          <IconButton
            key={view.id}
            onClick={() => chooseView(view.id)}
            aria-pressed={location.view === view.id}
            aria-label={`${view.label}, ${commandCounts[view.id] || 0}`}
            active={location.view === view.id}
            size="sm"
          >
            <view.Icon size={13} /> {view.label}
            <span style={{ color: location.view === view.id ? SECOND : BODY, fontSize: FS.micro }}>
              {commandCounts[view.id] || 0}
            </span>
          </IconButton>
        ))}
      </div>

      {location.view === 'stories' && (
        <div
          role="group"
          aria-label="Story topics"
          style={CONTROL_GROUP_STYLE}
        >
          <IconButton
            onClick={() => chooseView('stories')}
            aria-pressed={location.topic == null}
            aria-label="All stories"
            active={location.topic == null}
            size="sm"
          >
            All
          </IconButton>
          {STORY_TOPICS.map(topic => (
            <IconButton
              key={topic.id}
              onClick={() => chooseTopic(topic.id)}
              aria-pressed={location.topic === topic.id}
              aria-label={`${topic.label} stories`}
              active={location.topic === topic.id}
              size="sm"
            >
              {topic.label}
            </IconButton>
          ))}
        </div>
      )}

      <div
        ref={bodyRef}
        data-testid="herald-mobile-body"
        tabIndex={-1}
        style={MOBILE_BODY_STYLE}
      >
        <HeraldCommandBody
          view={location.view}
          topic={location.topic}
          realmModel={realmModel}
          onSection={navigate}
          campaign={campaign}
          feed={feed}
          focusId={null}
          focusName=""
          narrowing={false}
          query=""
          attentionOn={false}
          filterBand={null}
          timeLens="advance"
          nameById={nameById}
          saves={saves}
          emptyHandlers={{ onCreateCampaign, onSelectCampaign, hasCampaigns }}
          canManageCampaigns={canManageCampaigns}
          tier={tier}
          onUpgrade={onUpgrade}
          returnToOrigin={returnOrigin}
          onReturnToOrigin={returnToEdition}
        />
      </div>
    </section>
  );
}
