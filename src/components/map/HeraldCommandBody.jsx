/**
 * HeraldCommandBody.jsx — G-4a's reversible four-view command brief.
 *
 * This is a selector-and-layout shell over two proven owners:
 *
 *   - RealmItem supplies identity, attention evidence, and complete pilot-source
 *     coverage.
 *   - HeraldBody retains the forecast, docket, and adjudication writers.
 *
 * The shell does not rewrite the newspaper's voice or grant actions. Decisions
 * still execute through HeraldAdjudication's existing, revalidating store calls.
 * Stories still use HeraldHeadline and its recorded cause walk.
 */

import { useState } from 'react';
import { AlertTriangle, ArrowRight, BookOpen, CircleDot, Clock3 } from 'lucide-react';

import {
  BODY,
  BORDER,
  BORDER2,
  CARD_ALT,
  FS,
  GOLD,
  INK,
  MUTED,
  RED,
  SECOND,
  SP,
  sans,
} from '../theme.js';
import { IconButton } from './IconButton.jsx';
import HeraldBody from './HeraldBody.jsx';
import HeraldHeadline from './HeraldHeadline.jsx';
import { Pill } from './WorldPulsePrimitives.jsx';
import { realmAttentionDefinition } from '../../domain/realm/realmItemAttention.js';
import {
  briefingItems,
  decisionCaseItems,
  decisionItems,
  filterRealmItems,
  storyItems,
} from './heraldCommandSelectors.js';
import { specialistSectionForStoryTopic } from './heraldCommandSourceParity.js';

/**
 * Bound the initial archive DOM independently of campaign history depth. The
 * read model still retains the complete archive; the reader reveals it in
 * deterministic batches without making a 30-year realm mount hundreds of
 * cards before the first interaction.
 */
export const HERALD_ARCHIVE_PAGE_SIZE = 40;

const TOPIC_LABELS = Object.freeze({
  war: 'War',
  faith: 'Faith',
  trade: 'Trade',
  events: 'Civic',
  divination: 'Outlook',
  adjudication: 'Decisions',
});

const EMPTY_EDITION_STYLE = Object.freeze({
  border: `1px dashed ${BORDER}`,
  background: CARD_ALT,
  padding: SP.md,
  color: BODY,
  fontFamily: sans,
  fontSize: FS.sm,
  lineHeight: 1.5,
});

const SECTION_HEADER_STYLE = Object.freeze({
  display: 'flex',
  alignItems: 'center',
  gap: SP.sm,
  flexWrap: 'wrap',
  borderBottom: `1px solid ${GOLD}`,
  paddingBottom: SP.xs,
});

const SECTION_LABEL_STYLE = Object.freeze({
  color: SECOND,
  fontFamily: sans,
  fontSize: FS.xs,
  fontWeight: 900,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

const STORY_CARD_STYLE = Object.freeze({
  display: 'grid',
  gap: SP.xs,
  borderBottom: `1px solid ${BORDER}`,
  paddingBottom: SP.sm,
});

const SPECIALIST_DISCLOSURE_STYLE = Object.freeze({
  border: `1px solid ${BORDER}`,
  background: CARD_ALT,
});

const SPECIALIST_SUMMARY_STYLE = Object.freeze({
  cursor: 'pointer',
  padding: SP.sm,
  color: SECOND,
  fontFamily: sans,
  fontSize: FS.xs,
  fontWeight: 900,
});

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value).trim();
}

/** Read one authored reason array from the preserved source snapshot. */
function sourceReasonsOf(item) {
  const payload = item?.payload || {};
  const records = payload.sourceRecords || (
    payload.sourceRecord ? [{ record: payload.sourceRecord }] : []
  );
  for (const entry of records) {
    const record = entry?.record || {};
    const outcome = record?.outcome || {};
    const reasons = Array.isArray(record.reasons)
      ? record.reasons
      : (Array.isArray(outcome.reasons) ? outcome.reasons : []);
    if (reasons.length) return reasons;
  }
  return [];
}

function causeRootOf(item) {
  if (item?.identity?.interactive === false) return null;
  const cause = item?.cause || {};
  const state = text(cause.state);
  const rootId = text(cause.rootRecordId || cause.receiptId);
  const indexed = state
    ? state === 'available' || state === 'partial'
    : cause.available === true;
  return indexed && rootId ? rootId : null;
}

function fallbackHeadlineFor(workflow) {
  if (workflow === 'proposal') return 'A proposal awaits review';
  if (workflow === 'verdict') return 'A realm verdict awaits review';
  if (workflow === 'order') return 'A staged order remains on the docket';
  return 'A report from the realm';
}

/**
 * Adapt a RealmItem to the established Herald headline grammar. This is a view
 * adapter, not a second read model: every field is copied from the envelope.
 */
function headlineItemOf(item) {
  const subjects = Array.isArray(item?.subjects) ? item.subjects : [];
  const affected = Array.isArray(item?.affectedEntities) ? item.affectedEntities : [];
  const interactive = item?.identity?.interactive !== false;
  const routeableSubjects = interactive
    ? subjects.filter(subject => subject?.routeable !== false)
    : [];
  const settlement = routeableSubjects.find(subject => subject?.kind === 'settlement');
  const npc = routeableSubjects.find(subject => subject?.kind === 'npc');
  const faction = routeableSubjects.find(subject => subject?.kind === 'faction');
  const affectedIds = interactive
    ? [...new Set(affected
      .filter(entity => (
        entity?.kind === 'settlement'
        && entity.id != null
        && entity.routeable !== false
      ))
      .map(entity => String(entity.id)))]
    : [];
  const significance = Number(item?.attention?.significance) || 0;
  const workflow = item?.workflow?.kind;

  return {
    id: item.presentationKey || item.id,
    section: item?.compatibility?.heraldSection || item?.topic?.primary || 'events',
    headline: text(item?.headline) || fallbackHeadlineFor(workflow),
    summary: text(item?.summary),
    severity: significance,
    major: significance >= 0.72,
    tick: item?.tick ?? null,
    reasons: sourceReasonsOf(item),
    subject: {
      settlementId: settlement?.id ?? null,
      npcId: npc?.id ?? null,
      factionId: faction?.id ?? null,
      factionName: faction?.name ?? null,
    },
    affectedIds,
    kind: item?.sourceKind || '',
    rootId: causeRootOf(item),
    provenance: item?.epistemic?.class === 'pending_decision' ? 'amendable' : 'canon',
    record: item?.payload?.sourceRecord || item?.payload,
  };
}

function unrouteableLabelsOf(item) {
  const entities = [
    ...(Array.isArray(item?.subjects) ? item.subjects : []),
    ...(Array.isArray(item?.affectedEntities) ? item.affectedEntities : []),
  ];
  return [...new Set(entities
    .filter(entity => entity?.routeable === false)
    .map(entity => text(entity.fallbackLabel || entity.name || 'A referenced subject is no longer available'))
    .filter(Boolean))];
}

function EmptyEdition({ children }) {
  return (
    <div style={EMPTY_EDITION_STYLE}>
      {children}
    </div>
  );
}

/**
 * Keep the reversible jump visible in every destination. Briefing can promote a
 * decision, a plan, or a recorded story; none of those routes should rely on an
 * undocumented Escape shortcut to find the originating card again.
 */
function CommandDestination({ origin, onReturn, children }) {
  return (
    <div style={{ display: 'grid', gap: SP.sm }}>
      {origin && typeof onReturn === 'function' && (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <IconButton
            onClick={onReturn}
            size="sm"
          >
            Return to {origin.label || 'the previous view'}
          </IconButton>
        </div>
      )}
      {children}
    </div>
  );
}

function BriefingCard({ item, onSection, lead = false }) {
  const attention = item?.attention || {};
  const attentionClass = text(attention.class) || 'routine_record';
  const blocking = attention.blocking === true;
  const workflow = item?.workflow?.kind;
  const route = ['proposal', 'verdict'].includes(workflow)
    ? 'adjudication'
    : (workflow === 'order' || item?.temporal?.phase === 'emerging')
      ? 'divination'
      : (item?.compatibility?.heraldSection || 'events');
  const label = realmAttentionDefinition(attentionClass).label;
  const Icon = blocking || attentionClass === 'lapsed_order' ? AlertTriangle : CircleDot;
  const interactive = item?.identity?.interactive !== false;
  const originKey = text(item?.presentationKey || item?.id);
  const actionLabel = route === 'adjudication'
    ? 'Review decision'
    : route === 'divination'
      ? 'Review plan'
      : 'Read story';
  const headline = text(item?.headline) || headlineItemOf(item).headline;
  const reason = text(attention.reason) || 'No promotion reason was recorded.';

  return (
    <article
      data-testid="command-briefing-item"
      data-attention-class={attentionClass}
      data-realm-item-id={originKey || undefined}
      aria-label={`${label}: ${headline}. Why here: ${reason}`}
      style={{
        display: 'grid',
        gap: SP.xs,
        padding: SP.sm,
        border: `1px solid ${blocking ? GOLD : BORDER}`,
        borderLeft: `3px solid ${blocking ? RED : BORDER2}`,
        background: CARD_ALT,
      }}
    >
      <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
        <Icon size={13} color={blocking ? RED : SECOND} aria-hidden="true" />
        {lead && (
          <span
            data-testid="herald-command-stable-lead"
            style={{
              color: INK,
              fontFamily: sans,
              fontSize: FS.micro,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            First to address
          </span>
        )}
        <span style={{
          color: blocking ? RED : SECOND,
          fontFamily: sans,
          fontSize: FS.micro,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {label}
        </span>
        <Pill tone="neutral">{TOPIC_LABELS[item?.topic?.primary] || 'Realm'}</Pill>
      </div>
      <div style={{
        color: INK,
        fontFamily: sans,
        fontSize: FS.sm,
        fontWeight: 900,
        lineHeight: 1.3,
        overflowWrap: 'anywhere',
      }}>
        {headline}
      </div>
      {/* The promotion reason comes verbatim from the typed RealmItem attention
          fact. Absence is named; the UI never invents a substitute crisis. */}
      <div style={{
        color: BODY,
        fontFamily: sans,
        fontSize: FS.xxs,
        fontWeight: 700,
        lineHeight: 1.45,
      }}>
        <span style={{
          color: MUTED,
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          Why here{' '}
        </span>
        {reason}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <IconButton
          data-herald-command-origin={originKey || undefined}
          onClick={(event) => {
            if (interactive) onSection?.(route, item, event.currentTarget);
          }}
          disabled={!interactive}
          aria-label={!interactive
            ? 'This imported record has ambiguous identity and cannot be routed safely'
            : undefined}
          size="sm"
        >
          {actionLabel} <ArrowRight size={12} />
        </IconButton>
      </div>
    </article>
  );
}

function BriefingView({ items, onSection }) {
  const promoted = briefingItems(items);
  const decisions = decisionItems(items);
  return (
    <div data-testid="herald-command-briefing" style={{ display: 'grid', gap: SP.md }}>
      <div style={{ ...SECTION_HEADER_STYLE, alignItems: 'baseline' }}>
        <span style={SECTION_LABEL_STYLE}>The morning brief</span>
        {decisions.length > 0 && (
          <Pill tone="major">{decisions.length} awaiting your word</Pill>
        )}
      </div>
      {promoted.length === 0 ? (
        <EmptyEdition>
          The realm asks nothing of you just now. No recorded condition has been promoted above the routine record.
        </EmptyEdition>
      ) : (
        <div style={{ display: 'grid', gap: SP.sm }}>
          {promoted.map((item, index) => (
            <BriefingCard
              key={item.presentationKey || item.id}
              item={item}
              onSection={onSection}
              lead={index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StoryCard({ item, campaign, nameById }) {
  const topic = item?.topic?.primary;
  const tags = [
    TOPIC_LABELS[topic] || 'Realm',
    item?.temporal?.phase,
    item?.resolution?.state,
  ].map(text).filter(Boolean);
  const missingSubjects = unrouteableLabelsOf(item);
  return (
    <article data-testid="command-story-item" style={STORY_CARD_STYLE}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {tags.map(tag => <Pill key={tag} tone="neutral">{tag}</Pill>)}
      </div>
      <HeraldHeadline
        item={headlineItemOf(item)}
        worldState={campaign?.worldState}
        nameById={nameById}
      />
      {missingSubjects.map(label => (
        <div
          key={label}
          data-testid="story-subject-unavailable"
          style={{
            color: MUTED,
            fontFamily: sans,
            fontSize: FS.micro,
            fontWeight: 750,
          }}
        >
          {label}. The original route is no longer available.
        </div>
      ))}
      {!causeRootOf(item) && (
        <div
          data-testid="story-provenance-unavailable"
          style={{
            color: MUTED,
            fontFamily: sans,
            fontSize: FS.micro,
            fontWeight: 750,
          }}
        >
          {text(item?.cause?.reason) || 'Deeper provenance is unavailable for this recorded source.'}
        </div>
      )}
    </article>
  );
}

function StoriesView({
  items,
  topic,
  campaign,
  nameById,
  legacyBodyProps,
}) {
  const stories = storyItems(items, topic);
  const specialistSection = specialistSectionForStoryTopic(topic);
  const [visibleCount, setVisibleCount] = useState(HERALD_ARCHIVE_PAGE_SIZE);
  const visibleStories = stories.slice(0, visibleCount);
  const remaining = Math.max(0, stories.length - visibleStories.length);
  const topicLabel = topic ? TOPIC_LABELS[topic] : null;
  return (
    <div data-testid="herald-command-stories" style={{ display: 'grid', gap: SP.md }}>
      {specialistSection && (
        <section
          data-testid="herald-command-specialist-body"
          data-herald-source-owner={specialistSection}
          aria-label={`${TOPIC_LABELS[specialistSection]} specialist desk`}
          style={{ display: 'grid', gap: SP.sm }}
        >
          <div style={SECTION_HEADER_STYLE}>
            <span style={SECTION_LABEL_STYLE}>
              {TOPIC_LABELS[specialistSection]} desk
            </span>
          </div>
          <HeraldBody {...legacyBodyProps} section={specialistSection} />
        </section>
      )}
      <div style={SECTION_HEADER_STYLE}>
        <BookOpen size={14} color={SECOND} aria-hidden="true" />
        <span style={SECTION_LABEL_STYLE}>
          {topicLabel ? `${topicLabel} stories` : 'The complete archive'}
        </span>
        <span style={{
          marginLeft: 'auto',
          color: MUTED,
          fontFamily: sans,
          fontSize: FS.micro,
          fontWeight: 850,
        }}>
          {stories.length}
        </span>
      </div>
      {stories.length === 0 ? (
        <EmptyEdition>
          {topicLabel
            ? `No ${topicLabel.toLowerCase()} story matches this edition.`
            : 'The archive is quiet.'}
        </EmptyEdition>
      ) : (
        <div style={{ display: 'grid', gap: SP.md }}>
          {visibleStories.map(item => (
            <StoryCard
              key={item.presentationKey || item.id}
              item={item}
              campaign={campaign}
              nameById={nameById}
            />
          ))}
          {remaining > 0 && (
            <div style={{ display: 'grid', justifyItems: 'center', gap: SP.xs }}>
              <IconButton
                onClick={() => setVisibleCount(count => count + HERALD_ARCHIVE_PAGE_SIZE)}
                aria-label={`Show ${Math.min(HERALD_ARCHIVE_PAGE_SIZE, remaining)} older stories`}
                size="sm"
              >
                Show older stories
              </IconButton>
              <span
                role="status"
                style={{
                  color: MUTED,
                  fontFamily: sans,
                  fontSize: FS.micro,
                  fontWeight: 750,
                }}
              >
                {visibleStories.length} of {stories.length} stories shown
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * @param {object} props
 * @param {'briefing'|'stories'|'plans'|'decisions'} props.view
 * @param {string|null} props.topic
 * @param {Readonly<{
 *   items: ReadonlyArray<Record<string, unknown>>,
 *   ranked: ReadonlyArray<Record<string, unknown>>,
 * }>} props.realmModel
 * @param {(
 *   section: string,
 *   item?: Record<string, unknown>,
 *   trigger?: HTMLElement,
 * ) => void} props.onSection
 */
export default function HeraldCommandBody({
  view,
  topic = null,
  realmModel,
  onSection,
  campaign,
  feed,
  focusId,
  focusName,
  narrowing,
  query,
  attentionOn,
  filterBand,
  timeLens = 'advance',
  nameById,
  saves,
  emptyHandlers,
  canManageCampaigns,
  tier,
  onUpgrade,
  returnToOrigin = null,
  onReturnToOrigin,
}) {
  const baseItems = view === 'briefing' ? realmModel?.ranked : realmModel?.items;
  const visibleItems = filterRealmItems(baseItems || [], {
    focusId,
    query,
    attention: attentionOn,
    band: filterBand,
    timeLens,
    nameById,
  });
  const legacyBodyProps = {
    campaign,
    feed,
    focusId,
    focusName,
    narrowing,
    nameById,
    saves,
    emptyHandlers,
    canManageCampaigns,
    tier,
    onUpgrade,
  };

  // The command IA never owns access or monetization. Re-enter the established
  // Dashboard body for a locked viewer so RealmDashboard supplies the exact
  // anon/free teaser, pricing moment, and CTA already used by the legacy Herald.
  // This guard sits above every task view: a crafted Decisions address cannot
  // mount adjudication controls without campaign-management authority.
  if (!canManageCampaigns) {
    return <HeraldBody {...legacyBodyProps} section="dashboard" />;
  }

  // Preserve the established no-campaign funnels. The command shell reorganizes
  // live realm evidence; it does not replace empty-state ownership.
  if (!campaign && (view === 'briefing' || view === 'stories')) {
    const section = view === 'briefing' ? 'dashboard' : (topic || 'events');
    return <HeraldBody {...legacyBodyProps} section={section} />;
  }

  if (view === 'briefing') {
    return (
      <CommandDestination origin={returnToOrigin} onReturn={onReturnToOrigin}>
        <BriefingView items={visibleItems} onSection={onSection} />
        <details
          data-testid="herald-command-dashboard-parity"
          data-herald-source-owner="dashboard"
          style={SPECIALIST_DISCLOSURE_STYLE}
        >
          <summary style={SPECIALIST_SUMMARY_STYLE}>
            Realm overview and session prep
          </summary>
          <div style={{ padding: SP.sm, borderTop: `1px solid ${BORDER}` }}>
            <HeraldBody {...legacyBodyProps} section="dashboard" />
          </div>
        </details>
      </CommandDestination>
    );
  }
  if (view === 'stories') {
    return (
      <CommandDestination origin={returnToOrigin} onReturn={onReturnToOrigin}>
        <StoriesView
          key={topic || 'all'}
          items={visibleItems}
          topic={topic}
          campaign={campaign}
          nameById={nameById}
          legacyBodyProps={legacyBodyProps}
        />
      </CommandDestination>
    );
  }
  if (view === 'plans') {
    return (
      <CommandDestination origin={returnToOrigin} onReturn={onReturnToOrigin}>
        <div data-testid="herald-command-plans" style={{ display: 'grid', gap: SP.sm }}>
          <div style={{
            display: 'flex',
            gap: 7,
            alignItems: 'center',
            flexWrap: 'wrap',
            ...SECTION_LABEL_STYLE,
          }}>
            <Clock3 size={14} aria-hidden="true" /> Plans and outlook
          </div>
          <HeraldBody {...legacyBodyProps} section="divination" />
        </div>
      </CommandDestination>
    );
  }
  return (
    <CommandDestination origin={returnToOrigin} onReturn={onReturnToOrigin}>
      <div data-testid="herald-command-decisions" style={{ display: 'grid', gap: SP.sm }}>
        <HeraldBody
          {...legacyBodyProps}
          section="adjudication"
          realmDecisionItems={decisionCaseItems(visibleItems)}
          activeDecisionItemId={returnToOrigin?.itemId || null}
        />
      </div>
    </CommandDestination>
  );
}
