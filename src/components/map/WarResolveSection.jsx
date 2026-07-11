/**
 * WarResolveSection.jsx — the Realm Inspector's "War & Resolve" tab (P5 surfacing,
 * flag warEconomySurfacing). A read-only window into each settlement's morale under war:
 * Resolve, Hope, Supply (bypass-aware), Faith relation, war Sentiment, and Leadership.
 *
 * PRESENTATION ONLY. Every value comes from realmResolveSignals — the same functions the
 * simulation acts on — so nothing here computes or mutates state. A realm at peace shows a
 * calm empty note; a settlement with a live siege gets the full card. The tab itself is
 * gated in RealmInspector, so this never mounts while the flag is off (byte-identical).
 */

import { useMemo } from 'react';
import { HeartHandshake, Swords, Home, Flame } from 'lucide-react';

import { realmResolveSignals } from '../../domain/display/warResolve.js';
import { Section } from './WorldPulsePrimitives.jsx';
import { INK, BODY, MUTED, SECOND, CARD, CARD_ALT, BORDER, BORDER2, RED, AMBER, GOLD, sans, FS, SP, R } from '../theme.js';

/** Map a signal band to a semantic tone. */
const RESOLVE_TONE = { capitulating: 'danger', breaking: 'danger', wavering: 'warn', steady: 'neutral', resolute: 'good' };
const HOPE_TONE = { forlorn: 'danger', slim: 'warn', even: 'neutral', favorable: 'good', commanding: 'good' };
const SUPPLY_TONE = { starving: 'danger', strained: 'warn', 'running the blockade': 'warn', supplied: 'good', provisioned: 'good' };
const TONE_COLOR = {
  danger: { fg: RED, bg: '#fff5f5', border: '#c89a9a' },
  warn: { fg: '#7a4f0f', bg: '#fff7ec', border: '#e0b070' },
  good: { fg: '#1c6b3a', bg: '#f0f8f2', border: '#a9cdb4' },
  neutral: { fg: SECOND, bg: CARD_ALT, border: BORDER2 },
};

function Chip({ label, value, tone = 'neutral' }) {
  const c = TONE_COLOR[tone] || TONE_COLOR.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'baseline', gap: 5, minHeight: 22, padding: '2px 8px',
      border: `1px solid ${c.border}`, borderRadius: 6, background: c.bg, fontFamily: sans, whiteSpace: 'nowrap',
    }}>
      <span style={{ color: MUTED, fontSize: FS.pico, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      <span style={{ color: c.fg, fontSize: FS.xxs, fontWeight: 800, textTransform: 'capitalize' }}>{value}</span>
    </span>
  );
}

/** The worst tone among a settlement's live signals — drives the card's left accent. */
function cardAccent(sig) {
  const tones = [RESOLVE_TONE[sig.resolve?.band], sig.hope ? HOPE_TONE[sig.hope.band] : null, SUPPLY_TONE[sig.supply?.band]];
  if (tones.includes('danger')) return RED;
  if (tones.includes('warn')) return AMBER;
  return BORDER;
}

function StatusBadge({ sig }) {
  if (sig.besieged) return <span style={badgeStyle(RED)}><Flame size={11} /> Under siege</span>;
  if (sig.besieging?.length) return <span style={badgeStyle(GOLD)}><Swords size={11} /> On campaign</span>;
  return <span style={badgeStyle(MUTED)}><Home size={11} /> At peace</span>;
}
function badgeStyle(color) {
  return { display: 'inline-flex', alignItems: 'center', gap: 4, color, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 };
}

function nameFor(id, nameById) {
  return (nameById && nameById.get && nameById.get(String(id))) || String(id);
}

function SettlementCard({ sig, nameById }) {
  const accent = cardAccent(sig);
  const faith = sig.faith;
  const lead = sig.leadership;
  const opposed = faith?.opposed || [];
  return (
    <div style={{
      display: 'grid', gap: 6, padding: '10px 12px', background: CARD,
      border: `1px solid ${BORDER}`, borderLeft: `3px solid ${accent}`, borderRadius: R.sm || 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>{sig.name}</span>
        <span style={{ marginLeft: 'auto' }}><StatusBadge sig={sig} /></span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Chip label="Resolve" value={sig.resolve.band} tone={RESOLVE_TONE[sig.resolve.band] || 'neutral'} />
        {sig.hope && <Chip label="Hope" value={sig.hope.band} tone={HOPE_TONE[sig.hope.band] || 'neutral'} />}
        <Chip label="Supply" value={sig.supply.band} tone={SUPPLY_TONE[sig.supply.band] || 'neutral'} />
        <Chip label="Public" value={sig.sentiment.band} tone="neutral" />
        {sig.warExhaustion.scar > 0 && <Chip label="War" value={sig.warExhaustion.band} tone={sig.warExhaustion.scar >= 0.6 ? 'warn' : 'neutral'} />}
      </div>

      {sig.supply.note && (
        <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45 }}>{sig.supply.note}</div>
      )}

      {sig.besieged && sig.besiegedBy?.length > 0 && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs }}>
          Besieged by {sig.besiegedBy.map(id => nameFor(id, nameById)).join(', ')}.
        </div>
      )}
      {sig.besieging?.length > 0 && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs }}>
          Besieging {sig.besieging.map(id => nameFor(id, nameById)).join(', ')}.
        </div>
      )}

      {faith?.patron?.name && (
        <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45 }}>
          Under {faith.patron.name}
          {(faith.patron.alignment || faith.patron.temper) ? ` (${[faith.patron.alignment, faith.patron.temper].filter(Boolean).join(', ')})` : ''}.
          {opposed.length > 0 && (
            <span style={{ color: RED, fontWeight: 700 }}>
              {' '}Set against {opposed.map(o => o.deity || nameFor(o.besieger, nameById)).join(', ')} — a war of opposed faiths, and the faithful dig in.
            </span>
          )}
        </div>
      )}

      {(lead?.government || lead?.governingFaction) && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs }}>
          {lead.government || 'Ruled'}{lead.governingFaction?.name ? ` · ${lead.governingFaction.name}` : ''}
          {lead.figures?.length > 0 ? ` · ${lead.figures.map(f => f.name).filter(Boolean).join(', ')}` : ''}
        </div>
      )}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {Array<{ id?: any, name?: any, settlement?: any }>} [props.saves]  the settlement saves.
 * @param {Map<string,string>} [props.nameById]
 */
export default function WarResolveSection({ campaign, saves = [], nameById }) {
  const signals = useMemo(() => {
    const worldState = campaign?.worldState || {};
    const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;
    const ids = new Set((campaign?.settlementIds || []).map(String));
    const scoped = (saves || []).filter(s => {
      const id = String(s?.id ?? s?.settlement?.id ?? '');
      // No settlementIds on the campaign ⇒ show the whole roster; otherwise scope to it.
      return ids.size === 0 || ids.has(id);
    });
    return realmResolveSignals({ saves: scoped, worldState, regionalGraph });
  }, [saves, campaign]);

  // Conflict first: besieged, then on-campaign, then at peace; stable by name within a band.
  const rank = (s) => (s.besieged ? 0 : s.besieging?.length ? 1 : 2);
  const ordered = [...signals].sort((a, b) => rank(a) - rank(b) || String(a.name).localeCompare(String(b.name)));
  const atWar = ordered.filter(s => s.atWar);
  const atPeace = ordered.filter(s => !s.atWar);

  if (signals.length === 0) {
    return <EmptyNote lead="War & Resolve reads each settlement's morale once a campaign holds settlements." />;
  }

  return (
    <div style={{ display: 'grid', gap: SP.md || 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <HeartHandshake size={14} style={{ color: GOLD }} />
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
          Resolve is the will to keep resisting; hope is the odds a besieged town faces; supply reads the granary and any circle or airship that runs the blockade.
        </span>
      </div>

      {atWar.length > 0 && (
        <Section title="At war" count={atWar.length}>
          <div style={{ display: 'grid', gap: 8 }}>
            {atWar.map(sig => <SettlementCard key={sig.id} sig={sig} nameById={nameById} />)}
          </div>
        </Section>
      )}

      {atPeace.length > 0 && (
        <Section title="At peace" count={atPeace.length}>
          <div style={{ display: 'grid', gap: 6 }}>
            {atPeace.map(sig => (
              <div key={sig.id} style={{
                display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 10px',
                background: CARD_ALT, border: `1px solid ${BORDER2}`, borderRadius: 6, flexWrap: 'wrap',
              }}>
                <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>{sig.name}</span>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Chip label="Resolve" value={sig.resolve.band} tone={RESOLVE_TONE[sig.resolve.band] || 'neutral'} />
                  <Chip label="Public" value={sig.sentiment.band} tone="neutral" />
                  {sig.supply.band !== 'provisioned' && <Chip label="Supply" value={sig.supply.band} tone={SUPPLY_TONE[sig.supply.band] || 'neutral'} />}
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function EmptyNote({ lead }) {
  return (
    <div style={{ padding: '18px 14px', textAlign: 'center', color: MUTED, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.6 }}>
      {lead}
    </div>
  );
}
