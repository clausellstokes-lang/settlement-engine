/**
 * PantheonPanel.jsx — the campaign Pantheon workspace (§S4).
 *
 * Renders the pantheon hierarchy from the LIVE `worldState.pantheon` ledger:
 * deities grouped by tier (major / minor / cult), with seats held and the
 * conversion win/loss record — plus the live realm arcs (Ascendancy / Twilight /
 * The War) derived from the same ledgers.
 *
 * HIDDEN WHEN DORMANT: religion is conditionally materialized — a dormant
 * (deity-free) campaign carries NO `pantheon` key, so this panel renders an empty
 * state and the toolbar tab self-hides via `hasPantheon`. Pure presentational.
 */

import { useMemo, useState } from 'react';
import { Sparkles, Swords } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { realmArcLines } from '../../domain/display/realmArcSummary.js';
import { pantheonDepthModel, seatsFromMajor, deityDisplayName, deityTierStrength, deityStatusWord } from '../../domain/display/pantheonDepth.js';
import { describeDeityEffects } from '../../domain/display/deityEffects.js';
import Button from '../primitives/Button.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, SECOND, VIOLET, VIOLET_DEEP, sans, swatch } from '../theme.js';

const TIER_ORDER = ['major', 'minor', 'cult'];
const TIER_LABEL = { major: 'Major Powers', minor: 'Minor Faiths', cult: 'Cults & Remnants' };
// Tier accents routed through violet tokens (lint bans raw hex): major reuses the
// exact #7c3aed swatch; minor/cult take the named VIOLET / VIOLET_DEEP tokens.
const TIER_COLOR = { major: swatch['#7C3AED'], minor: VIOLET, cult: VIOLET_DEEP };

/**
 * Whether the campaign has an active (materialized) pantheon — the religion gate
 * for the panel/tab. A dormant campaign has no `pantheon` key (or an empty one).
 */
export function hasPantheon(campaign) {
  const pantheon = campaign?.worldState?.pantheon;
  return !!pantheon && typeof pantheon === 'object' && Object.keys(pantheon).length > 0;
}

function deityName(settlements, deityId) {
  for (const item of settlements) {
    const deity = item?.settlement?.config?.primaryDeitySnapshot;
    if (!deity) continue;
    const ref = deity._deityRef || deity.primaryDeityRef || (deity.name ? `deity:${deity.name}` : null);
    if (String(ref) === String(deityId) && deity.name) return String(deity.name);
  }
  return deityDisplayName(deityId);
}

/** The embedded primary-deity snapshot for a deity id, from any carrying settlement. */
function deitySnapshotFor(settlements, deityId) {
  for (const item of settlements) {
    const deity = item?.settlement?.config?.primaryDeitySnapshot;
    if (!deity) continue;
    const ref = deity._deityRef || deity.primaryDeityRef || (deity.name ? `deity:${deity.name}` : null);
    if (String(ref) === String(deityId)) return deity;
  }
  return null;
}

/** Build the settlementId → deity ref carrier map for the contest preview. */
function carrierDeityMap(settlements) {
  const map = new Map();
  for (const item of settlements) {
    const deity = item?.settlement?.config?.primaryDeitySnapshot;
    if (!deity) continue;
    const ref = deity._deityRef || deity.primaryDeityRef || (deity.name ? `deity:${deity.name}` : null);
    if (ref != null && item?.id != null) map.set(String(item.id), String(ref));
  }
  return map;
}

// P9 gating: the free-vs-Cartographer wall lives UPSTREAM. RealmDashboard returns
// the locked teaser for `!canManageCampaigns` (anon/free), and RealmInspector only
// routes here when a campaign exists — so this panel is reached only by Cartographer
// and needs no local tier prop or `pantheon_preview` upsell hook.
export default function PantheonPanel({ campaign }) {
  const saves = useStore(s => s.savedSettlements);
  const settlementItems = useMemo(() => {
    const ids = new Set((campaign?.settlementIds || []).map(String));
    return (saves || [])
      .filter(sv => ids.has(String(sv.id)))
      .map(sv => ({ id: sv.id, name: sv.name || sv.settlement?.name, settlement: sv.settlement }));
  }, [saves, campaign]);

  const deities = useMemo(() => {
    const pantheon = campaign?.worldState?.pantheon || {};
    return Object.keys(pantheon)
      .map(id => ({ id, ...(pantheon[id] || {}) }))
      .sort((a, b) => (Number(b.seats) || 0) - (Number(a.seats) || 0) || (String(a.id) < String(b.id) ? -1 : 1));
  }, [campaign]);

  const byTier = useMemo(() => {
    const map = { major: [], minor: [], cult: [] };
    for (const d of deities) (map[d.tier] || map.cult).push(d);
    return map;
  }, [deities]);

  // deity id → tier, so the conversion-contest rows can read each contender's base
  // faith strength (the engine's DEITY_RANK_STRENGTH by tier) without re-deriving it.
  const tierById = useMemo(() => {
    const map = new Map();
    for (const d of deities) map.set(String(d.id), d.tier || 'cult');
    return map;
  }, [deities]);

  const arcs = useMemo(() => realmArcLines({
    worldState: campaign?.worldState,
    regionalGraph: campaign?.regionalGraph || campaign?.worldState?.regionalGraph,
    settlements: settlementItems,
  }), [campaign, settlementItems]);

  // UX Phase 5 — pantheon depth: seats-from-major + conversion-contest preview.
  // Pure projection over the live ledger + regional graph (no contest re-run).
  const depth = useMemo(() => pantheonDepthModel({
    worldState: campaign?.worldState,
    regionalGraph: campaign?.regionalGraph || campaign?.worldState?.regionalGraph,
    carrierDeity: carrierDeityMap(settlementItems),
  }), [campaign, settlementItems]);

  if (!campaign) return null;

  return (
    <section style={{
      flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column',
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden',
    }}>
      {/* P11: bespoke 34px-chip + h2 + meta header, token-matched to WorldPulsePanel
          so Pantheon and Pulse read identically (the same reconciliation made there). */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: `1px solid ${BORDER}`, background: CARD_ALT }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${BORDER2}`, background: CARD, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={18} color={GOLD} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.2, fontWeight: 900 }}>Pantheon</h2>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 4, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
            <span>{campaign.name}</span>
            <span>{deities.length} deit{deities.length === 1 ? 'y' : 'ies'}</span>
          </div>
        </div>
      </header>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!hasPantheon(campaign) ? (
          <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
            No pantheon yet. Assign a patron deity to a settlement to awaken the realm&apos;s faith.
          </div>
        ) : (
          <>
            {arcs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>Realm Arcs</div>
                {arcs.map((line, i) => (
                  <div key={i} style={{ padding: '8px 10px', border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${GOLD}`, borderRadius: 6, background: CARD_ALT, color: INK, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.4 }}>
                    {line}
                  </div>
                ))}
              </div>
            )}

            {TIER_ORDER.map(tier => byTier[tier].length > 0 && (
              <div key={tier} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ color: TIER_COLOR[tier], fontFamily: sans, fontSize: FS.xs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${BORDER}`, paddingBottom: 4 }}>
                  {TIER_LABEL[tier]} ({byTier[tier].length})
                </div>
                {byTier[tier].map(d => (
                  <DeityRow
                    key={d.id}
                    deity={d}
                    tierColor={TIER_COLOR[tier]}
                    name={deityName(settlementItems, d.id)}
                    snapshot={deitySnapshotFor(settlementItems, d.id)}
                  />
                ))}
              </div>
            ))}

            {/* UX Phase 5 — conversion-contest preview (who's contesting whom). */}
            {depth.contests.length > 0 && (
              <div data-testid="contest-preview" style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>
                  <Swords size={14} color={GOLD} /> Conversion Contests
                </div>
                {depth.contests.map(c => {
                  const aStrength = Math.round(deityTierStrength(tierById.get(String(c.aId))) * 100);
                  const bStrength = Math.round(deityTierStrength(tierById.get(String(c.bId))) * 100);
                  return (
                    <div key={`${c.contestedId}-${c.aId}-${c.bId}`} style={{ padding: '8px 10px', border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${TIER_COLOR.minor}`, borderRadius: 6, background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.4 }}>
                      <strong>{deityName(settlementItems, c.aId)}</strong> ({c.aSeats} seat{c.aSeats === 1 ? '' : 's'}, {aStrength}% strength)
                      {' vs '}
                      <strong>{deityName(settlementItems, c.bId)}</strong> ({c.bSeats} seat{c.bSeats === 1 ? '' : 's'}, {bStrength}% strength)
                      <span style={{ color: BODY }}>: contesting {deityName(settlementItems, c.contestedId)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/** A single deity row with seats, W/L, a seats-from-major progress note, and a
 *  collapsible deity-coupling explainer (reuses describeDeityEffects from P0). */
function DeityRow({ deity, tierColor, name, snapshot }) {
  const [open, setOpen] = useState(false);
  const seats = Number(deity.seats) || 0;
  const fromMajor = seatsFromMajor(deity);
  const effects = describeDeityEffects(snapshot);
  // The deity's 0..1 base strength (the engine's own DEITY_RANK_STRENGTH by tier).
  // Two channels carry it (P7): the colored fill BAR and the status WORD beside the
  // tier — never hue alone.
  const strength = deityTierStrength(deity.tier);
  const statusWord = deityStatusWord(deity);
  return (
    <div style={{ border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${tierColor}`, borderRadius: 6, background: CARD }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 800 }}>{name}</div>
          <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs }}>
            {seats} seat{seats === 1 ? '' : 's'} · {Number(deity.wins) || 0}W / {Number(deity.losses) || 0}L
            {deity.tier !== 'major' && (
              <> · <span style={{ color: GOLD, fontWeight: 800 }}>{fromMajor} from Major</span></>
            )}
          </div>
          {/* Horizontal strength meter — fill width is the tier's base strength,
              token-colored to the tier. The numeric title keeps the value readable;
              the status word carries the same signal in text (P7). */}
          <div
            role="img"
            aria-label={`Faith strength ${Math.round(strength * 100)} percent (${statusWord})`}
            title={`Base faith strength: ${Math.round(strength * 100)}%`}
            style={{ marginTop: 5, height: 4, borderRadius: 2, background: BORDER2, overflow: 'hidden' }}
          >
            <div style={{ width: `${Math.round(strength * 100)}%`, height: '100%', background: tierColor, borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
          <span style={{ color: tierColor, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, textTransform: 'capitalize' }}>{statusWord}</span>
          <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, textTransform: 'capitalize' }}>{deity.tier}</span>
        </div>
      </div>
      {effects.length > 0 && (
        <div style={{ padding: '0 10px 8px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            style={{ background: 'none', border: 'none', padding: '4px 0', minHeight: 32, color: tierColor, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, justifyContent: 'flex-start' }}
          >
            {open ? '▾' : '▸'} How this faith couples ({effects.length})
          </Button>
          {open && (
            <ul style={{ margin: '4px 0 0', padding: '0 0 0 12px', listStyle: 'none' }}>
              {effects.map((eff, i) => (
                <li key={i} style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, marginBottom: 3, lineHeight: 1.4 }}>
                  <span style={{ color: GOLD, fontWeight: 900 }}>•</span> {eff}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
