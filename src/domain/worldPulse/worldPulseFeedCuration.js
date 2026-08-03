import { clamp01 } from '../../kernel/math.js';

/** @typedef {import('./pulseShapes.js').PulseOutcome} PulseOutcome */
/** @typedef {import('../region/wizardNews.js').RawWizardNewsEntry} RawWizardNewsEntry */
/** @typedef {import('../spatial/rumorNetwork.js').RumorSeedEntry} RumorSeedEntry */
/**
 * The common structural subset accepted by Wizard News curation and the rumor
 * seeder. The intersection keeps normalized feed rows assignable while ruling
 * out the nullable/id-number tolerances that the spatial seed path cannot use.
 * @typedef {RawWizardNewsEntry & RumorSeedEntry & { recordMode?: string }} CurationEntry
 */
/** @typedef {RawWizardNewsEntry[]|{ entries?: RawWizardNewsEntry[], [key: string]: unknown }|null|undefined} NewsFeed */
/** @typedef {{ outcome?: PulseOutcome, status?: string, supersessionReason?: string }} ProposalLike */
/** @typedef {{ proposals?: ProposalLike[], wizardNews?: NewsFeed, [key: string]: unknown }} CuratedWorldState */
/** @typedef {{ tick?: unknown, consequenceOutcomes?: PulseOutcome[], mechanicalOutcomes?: PulseOutcome[], mechanicalRumorSeeds?: CurationEntry[] }} PulseHistoryRecord */

/** @type {Array<[RegExp, string]>} */
const APPLIED_HEADLINE_REWRITES = [
  [/\bmay grow\b/, 'grows'],
  [/\bmay fall\b/, 'falls'],
  [/\bmay rise\b/, 'rises'],
  [/\bmay recover\b/, 'recovering'],
  [/\bmay be depleted\b/, 'depleted'],
  [/\bmay raise a\b/, 'raises a'],
  [/\bmay close its doors\b/, 'closes its doors'],
  [/\bmay take hold\b/, 'takes hold'],
  [/\bmay emerge\b/, 'emerges'],
  [/\bmay intensify\b/, 'intensifies'],
  [/\bmay spread\b/, 'spreads'],
  [/\bmay become\b/, 'becomes'],
  [/\bmay shift\b/, 'shifts'],
  [/\bmay protect\b/, 'protects'],
  [/\bmay exploit\b/, 'exploits'],
  [/\bmay reform\b/, 'reforms'],
  [/\bmay suppress\b/, 'suppresses'],
  [/\bmay bargain\b/, 'bargains'],
  [/\bmay defect\b/, 'defects'],
  [/\bmay expose\b/, 'exposes'],
  [/\bmay hoard\b/, 'hoards'],
  [/\bmay mobilize\b/, 'mobilizes'],
  [/\bmay sabotage\b/, 'sabotages'],
  [/\bmay seek promotion\b/, 'seeks promotion'],
  [/\bmay undermine\b/, 'undermines'],
];

function appliedHeadlineFor(/** @type {PulseOutcome} */ outcome) {
  if (outcome.appliedHeadline) return outcome.appliedHeadline;
  const headline = outcome.headline || '';
  for (const [pattern, replacement] of APPLIED_HEADLINE_REWRITES) {
    if (pattern.test(headline)) return headline.replace(pattern, replacement);
  }
  return headline;
}

/**
 * @param {PulseOutcome} outcome
 * @param {unknown} tick
 * @param {string} [status]
 * @returns {CurationEntry}
 */
export function newsEntryForOutcome(outcome, tick, status = 'applied') {
  const severity = clamp01(outcome.severity ?? 0);
  const normalizedTick = Number.isFinite(Number(tick)) ? Number(tick) : 0;
  const scope = (outcome.affectedSettlementIds || []).length >= 3 ? 'realm' : outcome.relationshipKey ? 'regional' : 'settlement';
  let major = outcome.applyMode === 'proposal' || severity >= 0.72 || (outcome.affectedSettlementIds || []).length >= 3;
  if (major && scope === 'settlement'
      && String(outcome.candidateType || '').startsWith('npc_')
      && severity < 0.72) {
    major = false;
  }
  return {
    id: `wizard_news.${normalizedTick}.world_pulse.${status}.${outcome.id}`,
    tick: normalizedTick,
    scope,
    significance: major ? 'major' : 'notable',
    score: Math.round(severity * 80) + (major ? 18 : 0),
    headline: (status === 'proposal' ? outcome.headline : appliedHeadlineFor(outcome)) || 'World pulse update',
    summary: outcome.summary || '',
    kind: status === 'proposal' ? 'queued' : 'applied',
    impactKind: outcome.candidateType || outcome.type,
    channelType: null,
    severity,
    settlementIds: outcome.affectedSettlementIds || [outcome.targetSaveId].filter(Boolean),
    impactIds: [],
    channelIds: [],
    sourceEventId: outcome.id,
    tags: /** @type {string[]} */ (
      ['world_pulse', outcome.type, outcome.candidateType, status].filter(Boolean)
    ),
    reasons: outcome.reasons || [],
  };
}

const DRIFT_REEMIT_COOLDOWN_TICKS = 6;

export function isDriftOnlyOutcome(/** @type {PulseOutcome} */ outcome) {
  if (outcome.curationClass === 'transition' || outcome.partySourced) return false;
  if (outcome.tierChange || outcome.powerTransfer || outcome.resourcePatch
      || outcome.institutionPatch || outcome.condition || outcome.stressor
      || outcome.relationshipKey || outcome.relationshipPatch
      || outcome.proposalPayload || outcome.lifecyclePatch) {
    return false;
  }
  return (outcome.populationDeltas || []).length <= 1;
}

function curationReasonsKey(/** @type {unknown[]|undefined} */ reasons) {
  return JSON.stringify([...new Set((reasons || []).filter(Boolean).map(String))]);
}

function curationSettlementsKey(/** @type {unknown[]|undefined} */ settlementIds) {
  return JSON.stringify([...new Set((settlementIds || []).map(String))].sort());
}

export function isMetronomeRepeat(/** @type {CurationEntry} */ entry, /** @type {CurationEntry[]} */ priorEntries, /** @type {unknown} */ tick) {
  const normalizedTick = Number.isFinite(Number(tick)) ? Number(tick) : 0;
  const idsKey = curationSettlementsKey(entry.settlementIds);
  const reasonsKey = curationReasonsKey(entry.reasons);
  return priorEntries.some((/** @type {CurationEntry} */ prior) =>
    prior.kind === 'applied'
    && normalizedTick - (prior.tick ?? -Infinity) < DRIFT_REEMIT_COOLDOWN_TICKS
    && prior.impactKind === entry.impactKind
    && prior.headline === entry.headline
    && curationSettlementsKey(prior.settlementIds) === idsKey
    && curationReasonsKey(prior.reasons) === reasonsKey);
}

/**
 * Recreate the private seed history that used to live in Wizard News before
 * v4. Processing records oldest-first through the same metronome predicate
 * preserves both delayed info-mode activation and later repeat suppression.
 * @param {PulseHistoryRecord[]} pulseHistory
 * @param {CurationEntry[]} publicEntries
 * @returns {CurationEntry[]}
 */
export function stateOnlyRumorSeedsFromHistory(pulseHistory = [], publicEntries = []) {
  const prior = Array.isArray(publicEntries) ? publicEntries : [];
  /** @type {CurationEntry[]} */
  const hidden = [];
  const seen = new Set();
  const pulses = [...(Array.isArray(pulseHistory) ? pulseHistory : [])]
    .sort((a, b) => Number(a?.tick || 0) - Number(b?.tick || 0));
  for (const pulse of pulses) {
    // v4 pulse records make this field authoritative. An explicit [] means
    // curation produced no private seed; never re-expand one from the broader
    // audit/consequence receipts below. Only pre-v4 records that lack the field
    // use receipt reconstruction as a compatibility fallback.
    if (Array.isArray(pulse?.mechanicalRumorSeeds)) {
      for (const entry of pulse.mechanicalRumorSeeds) {
        const id = entry?.sourceEventId ?? entry?.id;
        if (id == null || seen.has(String(id))) continue;
        seen.add(String(id));
        hidden.push({ ...entry, recordMode: 'state_only' });
      }
      continue;
    }
    const receipts = [
      ...(Array.isArray(pulse?.consequenceOutcomes) ? pulse.consequenceOutcomes : []),
      ...(Array.isArray(pulse?.mechanicalOutcomes) ? pulse.mechanicalOutcomes : []),
    ];
    for (const outcome of receipts) {
      if (outcome?.recordMode !== 'state_only' || outcome?.id == null || seen.has(String(outcome.id))) continue;
      seen.add(String(outcome.id));
      const tick = Number.isFinite(Number(pulse?.tick)) ? Number(pulse.tick) : Number(outcome.tick || 0);
      const entry = newsEntryForOutcome(outcome, tick, 'applied');
      const earlierPublic = prior.filter(item => Number(item?.tick) <= tick);
      if (!isDriftOnlyOutcome(outcome)
          || !isMetronomeRepeat(entry, [...earlierPublic, ...hidden], tick)) {
        hidden.push({ ...entry, recordMode: 'state_only' });
      }
    }
  }
  return hidden;
}

/**
 * Retire the public question that belonged to a proposal made obsolete by the
 * v4 record-mode upgrade or by a bilateral peace offer whose live relationship
 * has moved on. This is deliberately a surgical filter rather than a feed
 * normalization: unrelated entries and feed metadata keep their exact shape.
 * @param {CuratedWorldState} worldState
 * @param {NewsFeed} wizardNews
 * @returns {{ worldState: CuratedWorldState, wizardNews: NewsFeed }}
 */
export function reconcileSupersededProposalNews(worldState, wizardNews) {
  const sourceIds = new Set((worldState?.proposals || [])
    .filter((/** @type {ProposalLike} */ proposal) => proposal?.status === 'superseded'
      && (String(proposal?.supersessionReason || '').startsWith('record_mode_upgrade')
        || proposal?.supersessionReason === 'bilateral_peace_lapsed'))
    .map((/** @type {ProposalLike} */ proposal) => proposal?.outcome?.id)
    .filter(Boolean)
    .map(String));
  if (sourceIds.size === 0) return { worldState, wizardNews };
  const clean = (/** @type {NewsFeed} */ feed) => {
    const entries = Array.isArray(feed) ? feed : feed?.entries;
    if (!Array.isArray(entries)) return feed;
    const next = entries.filter((entry) => {
      const proposalTagged = (entry?.tags || []).includes('proposal')
        || String(entry?.id || '').includes('.world_pulse.proposal.');
      return !(entry?.kind === 'queued'
        && proposalTagged
        && sourceIds.has(String(entry?.sourceEventId || '')));
    });
    if (next.length === entries.length) return feed;
    return Array.isArray(feed) ? next : { ...feed, entries: next };
  };
  const legacyNews = clean(worldState?.wizardNews);
  return {
    worldState: legacyNews === worldState?.wizardNews
      ? worldState
      : { ...worldState, wizardNews: legacyNews },
    wizardNews: clean(wizardNews),
  };
}
