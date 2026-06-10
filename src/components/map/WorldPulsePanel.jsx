import { useMemo, useState } from 'react';
import { Activity, BookMarked, CheckCircle2, Clock3, ShieldAlert, XCircle } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { BORDER, BORDER2, BODY, CARD, CARD_ALT, FS, GOLD, GOLD_BG, GREEN, INK, MUTED, RED, SECOND, sans, swatch } from '../theme.js';

function percent(value) {
  return `${Math.round((Number.isFinite(value) ? value : 0) * 100)}%`;
}

function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

function signedNumber(value) {
  const n = Math.round(Number(value) || 0);
  return `${n > 0 ? '+' : ''}${n.toLocaleString()}`;
}

function unique(values = []) {
  return values.filter(Boolean).filter((value, index, arr) => arr.indexOf(value) === index);
}

// ── Entity resolution ───────────────────────────────────────────────────────
// Turn the ids the simulation records into the names a reader needs: which
// settlement, which faction, which institution.
function nameMapFromSaves(saves = []) {
  const map = new Map();
  for (const save of saves || []) {
    const id = save?.id || save?.settlement?.id;
    const name = save?.name || save?.settlement?.name;
    if (id && name) map.set(String(id), name);
  }
  return map;
}

function collectSettlementIds(item = {}) {
  const ids = [];
  for (const src of [item, item.outcome || {}, item.proposalPayload || item.outcome?.proposalPayload || {}]) {
    if (!src || typeof src !== 'object') continue;
    if (src.settlementId) ids.push(src.settlementId);
    if (src.targetSaveId) ids.push(src.targetSaveId);
    if (src.saveId) ids.push(src.saveId);
    for (const id of src.affectedSettlementIds || []) ids.push(id);
    for (const id of src.settlementIds || []) ids.push(id);
    for (const delta of src.populationDeltas || []) if (delta?.saveId) ids.push(delta.saveId);
  }
  return unique(ids.map(String));
}

// The named entities involved in a pulse item, in reader-priority order.
function involvedEntities(item = {}, nameById = new Map()) {
  const o = item.outcome || item;
  const payload = o.proposalPayload || item.proposalPayload || {};
  const out = [];

  const settlements = unique(collectSettlementIds(item).map(id => nameById.get(String(id))).filter(Boolean));
  if (settlements.length) {
    out.push({ label: settlements.length > 1 ? 'Settlements' : 'Settlement', value: settlements.slice(0, 4).join(', ') });
  }

  const faction = o.factionName || payload.factionName || item.factionName;
  if (faction) out.push({ label: 'Faction', value: human(faction) });

  const institution = o.metadata?.institutionName || payload.institutionName || o.institutionName || item.institutionName;
  if (institution) out.push({ label: 'Institution', value: institution });

  const npcRole = payload.roleArchetype || o.metadata?.roleArchetype;
  if ((o.npcId || item.npcId) && npcRole) out.push({ label: 'NPC role', value: human(npcRole) });

  return out;
}

function Pill({ children, tone = 'neutral' }) {
  const bg = tone === 'major' ? GOLD_BG : tone === 'good' ? swatch.successBg : CARD_ALT;
  const color = tone === 'major' ? GOLD : tone === 'good' ? GREEN : SECOND;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 22,
      padding: '2px 7px',
      border: `1px solid ${BORDER2}`,
      borderRadius: 6,
      background: bg,
      color,
      fontFamily: sans,
      fontSize: FS.xxs,
      fontWeight: 800,
      whiteSpace: 'nowrap',
      textTransform: 'capitalize',
    }}>
      {children}
    </span>
  );
}

function EntityPill({ label, value }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', minHeight: 22, maxWidth: '100%',
      padding: '2px 8px', border: `1px solid ${BORDER2}`, borderRadius: 6,
      background: swatch.infoBg, color: INK,
      fontFamily: sans, fontSize: FS.xxs, fontWeight: 700,
    }}>
      <span style={{ color: MUTED, fontWeight: 900, marginRight: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </span>
  );
}

function proposalDetails(outcome = {}) {
  const payload = outcome.proposalPayload || {};
  if (payload.kind === 'tier_change') {
    return [`${human(payload.fromTier)} -> ${human(payload.toTier)}`, human(payload.direction)];
  }
  if (payload.kind === 'relationship_label_change') {
    return [`${human(payload.fromType)} -> ${human(payload.toType)}`, human(outcome.ruleId || outcome.ruleFamily)];
  }
  if (payload.kind === 'npc_action') {
    return [
      human(payload.actionFamily),
      payload.dotRankBefore && payload.dotRankAfter ? `${payload.dotRankBefore} dot -> ${payload.dotRankAfter} dot` : human(payload.roleArchetype),
    ].filter(Boolean);
  }
  if (payload.kind === 'government_change') {
    return [human(payload.governmentPreference), human(payload.legitimacyBand), 'preserve institutions'];
  }
  if (payload.kind === 'institution_suppression' || payload.kind === 'institution_capture') {
    return [human(payload.kind), payload.institutionName].filter(Boolean);
  }
  if (payload.kind === 'faction_power_shift') {
    return [human(payload.kind), human(payload.cause)].filter(Boolean);
  }
  return [human(outcome.ruleFamily), human(outcome.ruleId)].filter(Boolean).slice(0, 2);
}

function outcomeDetails(outcome = {}, nameById = new Map()) {
  const details = [...proposalDetails(outcome)];
  if (outcome.tierChange) {
    details.push(`${human(outcome.tierChange.fromTier)} -> ${human(outcome.tierChange.toTier)}`);
  }
  if (outcome.populationDeltas?.length) {
    details.push(...outcome.populationDeltas.slice(0, 3).map(delta => `${nameById.get(String(delta.saveId)) || 'Settlement'}: ${signedNumber(delta.delta)}`));
  }
  if (outcome.resourcePatch) {
    details.push(`${human(outcome.resourcePatch.resource)} ${human(outcome.resourcePatch.state)}`);
  }
  if (outcome.npcPatch?.shortGoal) details.push(`short: ${human(outcome.npcPatch.shortGoal)}`);
  if (outcome.npcPatch?.longGoal) details.push(`long: ${human(outcome.npcPatch.longGoal)}`);
  if (outcome.stressor?.type) details.push(human(outcome.stressor.type));
  if (outcome.metadata?.economicRole) details.push(human(outcome.metadata.economicRole));
  if (outcome.metadata?.transferMode) details.push(`migration ${human(outcome.metadata.transferMode)}`);
  if (outcome.metadata?.rebellionOutcome) details.push(`rebellion ${human(outcome.metadata.rebellionOutcome)}`);
  return unique(details).slice(0, 5);
}

function digestDetails(entry = {}, nameById = new Map()) {
  const names = unique((entry.settlementIds || []).map(id => nameById.get(String(id))).filter(Boolean));
  const settlementDetail = names.length
    ? `${names.slice(0, 3).join(', ')}${names.length > 3 ? ` +${names.length - 3}` : ''}`
    : (entry.settlementIds?.length ? `${entry.settlementIds.length} settlement${entry.settlementIds.length === 1 ? '' : 's'}` : null);
  return unique([
    human(entry.scope),
    human(entry.kind),
    human(entry.impactKind),
    human(entry.channelType),
    settlementDetail,
  ]).slice(0, 5);
}

function rollIsDeterministic(roll = {}) {
  return !!roll.conflictResolution?.deterministic || (roll.probability >= 1 && roll.roll === 0);
}

// ── Live stressors & echoes ─────────────────────────────────────────────────
// worldState.stressors carries both ACTIVE crises and residual ECHOES
// (resolved-but-remembered). The cards surface the new dynamics: why a crisis
// is resolving fast or slow (counterforce), what it's entangled with
// (synergies), and who is behind it (origin variant / attacker — nullable by
// design until the DM names the force).

const ACTIVE_UI_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);

function stressorDetails(stressor = {}) {
  const details = [human(stressor.lifecycleStage || 'active'), human(stressor.durationPolicy)];
  const cf = stressor.counterforce;
  if (cf && Number.isFinite(cf.score)) {
    const trend = cf.score > 0.55 ? 'recovering fast' : cf.score < 0.45 ? 'wallowing' : 'holding';
    details.push(`resilience ${percent(cf.score)} — ${trend}${cf.floorsMet === false ? ' (a pillar is missing)' : ''}`);
  }
  if (stressor.synergy?.companions?.length) {
    details.push(`entangled with ${stressor.synergy.companions.slice(0, 2).map(human).join(', ')}`);
  }
  if (stressor.synergy?.blocksResolution) details.push('cannot lift while blocked');
  if (stressor.originContext?.variant) details.push(human(stressor.originContext.variant));
  return unique(details).slice(0, 5);
}

const WAR_SHAPED_TYPES = new Set(['siege', 'wartime', 'occupation', 'monster_raider_pressure']);

function stressorSummary(stressor = {}) {
  const parts = [];
  if (stressor.originContext?.reason) parts.push(stressor.originContext.reason);
  const hooks = stressor.originContext?.hooks || [];
  if (hooks.length) parts.push(`Hooks: ${hooks.slice(0, 2).join(' • ')}`);
  return parts.join(' — ');
}

// Inline affordance for the nullable-attacker design: a war-shaped stressor
// with no named force gets a one-line input so the DM can attribute it to a
// settlement-less force ("The Red Fang warband") right from the card.
function NameAttackerControl({ stressor, onName, busy }) {
  const [value, setValue] = useState('');
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', width: '100%' }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Name the attacking force…"
        aria-label={`Name the force behind ${stressor.label || human(stressor.type)}`}
        style={{
          flex: 1, minWidth: 0, minHeight: 30, padding: '5px 9px',
          border: `1px solid ${BORDER2}`, borderRadius: 6,
          background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs,
        }}
      />
      <SmallButton
        tone="good"
        title="Name attacker"
        disabled={busy || !value.trim()}
        onClick={() => onName(value.trim())}
      >
        Name
      </SmallButton>
    </div>
  );
}

function attackerEntity(stressor = {}, nameById = new Map()) {
  const ctx = stressor.originContext;
  if (!ctx) return null;
  if (ctx.attackerLabel) return { label: 'Attacker', value: ctx.attackerLabel };
  if (ctx.attackerSettlementId) {
    return { label: 'Attacker', value: nameById.get(String(ctx.attackerSettlementId)) || String(ctx.attackerSettlementId) };
  }
  if (ctx.sponsorSettlementId) {
    return { label: 'Sponsor', value: nameById.get(String(ctx.sponsorSettlementId)) || String(ctx.sponsorSettlementId) };
  }
  if (ctx.formerSponsorSettlementId) {
    return { label: 'Former sponsor', value: nameById.get(String(ctx.formerSponsorSettlementId)) || String(ctx.formerSponsorSettlementId) };
  }
  // A war-shaped stressor with no named force: the DM can name it later.
  if (['declared_war', 'unattributed'].includes(ctx.variant)) return { label: 'Attacker', value: 'unnamed' };
  return null;
}

function OutcomeCard({ title, summary, severity, reasons = [], actions = null, tone = 'normal', details = [], involved = [] }) {
  const major = tone === 'major' || severity >= 0.7;
  return (
    <article style={{
      border: `1px solid ${major ? GOLD : BORDER}`,
      borderRadius: 8,
      background: major ? GOLD_BG : CARD,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <ShieldAlert size={16} color={major ? GOLD : SECOND} style={{ marginTop: 1, flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{
            margin: 0,
            color: INK,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 900,
            lineHeight: 1.25,
            overflowWrap: 'anywhere',
          }}>
            {title}
          </h4>
          {summary && (
            <p style={{
              margin: '5px 0 0',
              color: BODY,
              fontFamily: sans,
              fontSize: FS.xs,
              lineHeight: 1.45,
              overflowWrap: 'anywhere',
            }}>
              {summary}
            </p>
          )}
        </div>
      </div>
      {involved.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {involved.map((entity, index) => <EntityPill key={`${entity.label}-${index}`} label={entity.label} value={entity.value} />)}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        <Pill tone={major ? 'major' : 'neutral'}>Severity {percent(severity)}</Pill>
        {details.slice(0, 5).map((detail, index) => <Pill key={`${detail}-${index}`}>{detail}</Pill>)}
        {reasons.slice(0, 3).map((reason, index) => <Pill key={`${reason}-${index}`}>{reason}</Pill>)}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
          {actions}
        </div>
      )}
    </article>
  );
}

function SmallButton({ children, onClick, tone = 'neutral', title, disabled = false }) {
  const primary = tone === 'good';
  const danger = tone === 'danger';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        minHeight: 30,
        padding: '5px 9px',
        border: `1px solid ${primary ? GREEN : danger ? RED : BORDER2}`,
        borderRadius: 6,
        background: primary ? swatch.successBg : danger ? 'rgba(197,74,74,0.08)' : CARD,
        color: primary ? GREEN : danger ? RED : SECOND,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 900,
        opacity: disabled ? 0.62 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function Section({ title, count, children }) {
  return (
    <section style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <h3 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>
          {title}
        </h3>
        <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

export default function WorldPulsePanel({ campaign }) {
  const applyProposal = useStore(s => s.applyWorldPulseProposal);
  const dismissProposal = useStore(s => s.dismissWorldPulseProposal);
  const canonizeCampaignWorld = useStore(s => s.canonizeCampaignWorld);
  const recordPartyImpact = useStore(s => s.recordPartyImpact);
  const [namingStressorId, setNamingStressorId] = useState(null);
  const [busyProposalId, setBusyProposalId] = useState(null);
  const [canonBusy, setCanonBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const saves = useStore(s => s.savedSettlements);
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);
  if (!campaign) return null;

  const worldState = campaign.worldState || {};
  const pending = (worldState.proposals || []).filter(proposal => proposal.status === 'pending');
  const latestPulse = (worldState.pulseHistory || [])[worldState.pulseHistory.length - 1] || null;
  const rules = worldState.simulationRules || {};
  const rolls = latestPulse?.rollExplanations || [];
  const resolved = latestPulse?.resolvedStressors || [];
  const appliedOutcomes = latestPulse?.selectedOutcomes || [];
  const impactDigest = latestPulse?.impactDigest || [];
  const selected = latestPulse?.selectedCount || 0;
  const liveStressors = worldState.stressors || [];
  const activeStressors = liveStressors.filter(s => ACTIVE_UI_STAGES.has(s.lifecycleStage || 'active'));
  const echoes = liveStressors.filter(s => s.status === 'residual');

  const runProposalAction = async (proposalId, action) => {
    if (busyProposalId) return;
    setBusyProposalId(`${action}:${proposalId}`);
    setActionError(null);
    try {
      const fn = action === 'apply' ? applyProposal : dismissProposal;
      const updated = await fn(campaign.id, proposalId);
      if (!updated) setActionError('Proposal could not be updated.');
    } catch (err) {
      setActionError(`Proposal update failed: ${err?.message || err}`);
    } finally {
      setBusyProposalId(null);
    }
  };

  const runCanonizeWorld = async () => {
    if (canonBusy) return;
    setCanonBusy(true);
    setActionError(null);
    try {
      await canonizeCampaignWorld(campaign.id);
    } catch (err) {
      setActionError(`Canonize failed: ${err?.message || err}`);
    } finally {
      setCanonBusy(false);
    }
  };

  if (!worldState.canonizedAt) {
    return (
      <section style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '13px 16px',
          borderBottom: `1px solid ${BORDER}`,
          background: CARD_ALT,
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: `1px solid ${BORDER2}`,
            background: CARD,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Activity size={18} color={GOLD} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.2, fontWeight: 900 }}>
              World Pulse
            </h2>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 4, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
              <span>{campaign.name}</span>
              <span>Draft world</span>
            </div>
          </div>
        </header>
        <div style={{ padding: 16 }}>
          {actionError && (
            <div style={{ border: '1px solid rgba(197,74,74,0.45)', borderRadius: 8, padding: 10, marginBottom: 10, color: RED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, background: 'rgba(197,74,74,0.08)' }}>
              {actionError}
            </div>
          )}
          <OutcomeCard
            title="Canonize the campaign world first"
            summary="World Pulse advancement starts after you lock the map, placements, and campaign assumptions as canon."
            severity={0.45}
            details={['required before advancement']}
            actions={(
              <SmallButton tone="good" onClick={runCanonizeWorld} disabled={canonBusy} title="Canonize campaign world">
                <BookMarked size={13} /> {canonBusy ? 'Canonizing' : 'Canonize world'}
              </SmallButton>
            )}
          />
        </div>
      </section>
    );
  }

  return (
    <section style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '13px 16px',
        borderBottom: `1px solid ${BORDER}`,
        background: CARD_ALT,
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          border: `1px solid ${BORDER2}`,
          background: CARD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Activity size={18} color={GOLD} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.2, fontWeight: 900 }}>
            World Pulse
          </h2>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 4, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
            <span>{campaign.name}</span>
            <span>Tick {worldState.tick || 0}</span>
            <span>{human(worldState.calendar?.season || 'spring')}</span>
            <span>{human(rules.propagationMode || 'full')}</span>
            <span>{human(rules.intensity || 'normal')}</span>
            <span>{pending.length} pending</span>
          </div>
        </div>
      </header>

      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
        gap: 16,
        alignItems: 'start',
      }}>
        <Section title="Pending Proposals" count={pending.length}>
          {actionError && (
            <div style={{ border: '1px solid rgba(197,74,74,0.45)', borderRadius: 8, padding: 10, marginBottom: 10, color: RED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, background: 'rgba(197,74,74,0.08)' }}>
              {actionError}
            </div>
          )}
          {pending.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No pending proposals.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pending.map(proposal => (
                <OutcomeCard
                  key={proposal.id}
                  title={proposal.headline}
                  summary={proposal.summary}
                  severity={proposal.severity}
                  reasons={proposal.reasons}
                  details={proposalDetails(proposal.outcome)}
                  involved={involvedEntities(proposal, nameById)}
                  tone="major"
                  actions={(
                    <>
                      <SmallButton
                        tone="good"
                        onClick={() => runProposalAction(proposal.id, 'apply')}
                        title="Apply proposal"
                        disabled={!!busyProposalId}
                      >
                        <CheckCircle2 size={13} /> {busyProposalId === `apply:${proposal.id}` ? 'Applying' : 'Apply'}
                      </SmallButton>
                      <SmallButton
                        tone="danger"
                        onClick={() => runProposalAction(proposal.id, 'dismiss')}
                        title="Dismiss proposal"
                        disabled={!!busyProposalId}
                      >
                        <XCircle size={13} /> {busyProposalId === `dismiss:${proposal.id}` ? 'Dismissing' : 'Dismiss'}
                      </SmallButton>
                    </>
                  )}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Active Stressors & Echoes" count={activeStressors.length + echoes.length}>
          {activeStressors.length + echoes.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No active stressors. The realm is quiet — for now.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeStressors.map(stressor => {
                const attacker = attackerEntity(stressor, nameById);
                const unnamed = WAR_SHAPED_TYPES.has(stressor.type)
                  && !stressor.originContext?.attackerLabel
                  && !stressor.originContext?.attackerSettlementId;
                const nameThisAttacker = async (label) => {
                  if (!recordPartyImpact || namingStressorId) return;
                  setNamingStressorId(stressor.id);
                  setActionError(null);
                  try {
                    await recordPartyImpact(campaign.id, {
                      kind: 'name_attacker',
                      stressorId: stressor.id,
                      attackerLabel: label,
                      label: `Named the force behind ${stressor.label || human(stressor.type)}`,
                    });
                  } catch (err) {
                    setActionError(`Naming failed: ${err?.message || err}`);
                  } finally {
                    setNamingStressorId(null);
                  }
                };
                return (
                  <OutcomeCard
                    key={stressor.id}
                    title={stressor.label || human(stressor.type)}
                    summary={stressorSummary(stressor)}
                    severity={stressor.severity}
                    details={stressorDetails(stressor)}
                    involved={[
                      ...involvedEntities(stressor, nameById),
                      ...(attacker ? [attacker] : []),
                    ]}
                    tone={stressor.severity >= 0.72 ? 'major' : 'normal'}
                    actions={unnamed && recordPartyImpact ? (
                      <NameAttackerControl
                        stressor={stressor}
                        busy={!!namingStressorId}
                        onName={nameThisAttacker}
                      />
                    ) : null}
                  />
                );
              })}
              {echoes.map(stressor => (
                <OutcomeCard
                  key={`echo-${stressor.id}`}
                  title={`${stressor.label || human(stressor.type)} — in living memory`}
                  summary="Resolved, not forgotten: this echo still colors new events and can re-ignite while warm."
                  severity={stressor.memoryStrength ?? 0}
                  details={[`memory ${percent(stressor.memoryStrength ?? 0)}`, 'fading', human(stressor.type)]}
                  involved={involvedEntities(stressor, nameById)}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Latest Pulse" count={latestPulse ? selected : 0}>
          {!latestPulse ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No pulse history yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <OutcomeCard
                title={`Tick ${latestPulse.tick} advanced`}
                summary={`${latestPulse.autoAppliedCount || 0} drift item(s), ${latestPulse.proposalCount || 0} proposal(s), ${latestPulse.candidateCount || 0} candidate(s).`}
                severity={Math.min(1, selected / 8)}
                reasons={[latestPulse.interval, latestPulse.calendar?.season, `${rolls.length} rolls`].filter(Boolean)}
              />
              {appliedOutcomes.slice(0, 10).map(outcome => (
                <OutcomeCard
                  key={outcome.id}
                  title={outcome.headline || human(outcome.candidateType)}
                  summary={outcome.summary}
                  severity={outcome.severity}
                  reasons={outcome.reasons}
                  details={outcomeDetails(outcome, nameById)}
                  involved={involvedEntities(outcome, nameById)}
                  tone={outcome.applyMode === 'proposal' ? 'major' : 'normal'}
                />
              ))}
              {resolved.map(stressor => (
                <OutcomeCard
                  key={stressor.id}
                  title={`${stressor.label} resolved`}
                  summary={`Resolution roll ${percent(stressor.resolutionRoll)} against ${percent(stressor.resolutionChance)} chance.`}
                  severity={stressor.resolutionChance}
                  reasons={['time bounded stressor', human(stressor.type)]}
                  involved={involvedEntities(stressor, nameById)}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Impact Digest" count={impactDigest.length}>
          {!latestPulse ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No pulse history yet.
            </div>
          ) : impactDigest.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No regional impacts recorded for this pulse.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {impactDigest.slice(0, 12).map(entry => (
                <OutcomeCard
                  key={entry.id}
                  title={entry.headline}
                  summary={entry.summary}
                  severity={entry.severity ?? Math.min(1, (entry.score || 0) / 100)}
                  reasons={entry.reasons}
                  details={digestDetails(entry, nameById)}
                  involved={involvedEntities(entry, nameById)}
                  tone={entry.significance === 'major' ? 'major' : 'normal'}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Roll Explanations" count={rolls.length}>
          {rolls.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No rolls recorded.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rolls.slice(0, 18).map(roll => {
                const passed = !!roll.passed;
                const deterministic = rollIsDeterministic(roll);
                return (
                  <article key={roll.candidateId} style={{
                    display: 'grid',
                    gridTemplateColumns: '24px minmax(0, 1fr)',
                    gap: 8,
                    padding: 10,
                    border: `1px solid ${passed ? GOLD : BORDER}`,
                    borderRadius: 8,
                    background: passed ? GOLD_BG : CARD,
                  }}>
                    <Clock3 size={15} color={passed ? GOLD : MUTED} style={{ marginTop: 2 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, overflowWrap: 'anywhere' }}>
                        {human(roll.candidateType)}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                        <Pill tone={passed ? 'major' : 'neutral'}>{deterministic ? 'deterministic' : passed ? 'selected' : 'missed'}</Pill>
                        {!deterministic && <Pill>Roll {percent(roll.roll)}</Pill>}
                        <Pill>Chance {percent(roll.probability)}</Pill>
                        <Pill>Severity {percent(roll.severity)}</Pill>
                        {roll.ruleFamily && <Pill>{human(roll.ruleFamily)}</Pill>}
                        {roll.proposalPayload?.kind && <Pill>{human(roll.proposalPayload.kind)}</Pill>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Section>
      </div>
    </section>
  );
}
