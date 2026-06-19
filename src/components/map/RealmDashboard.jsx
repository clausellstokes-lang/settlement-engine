/**
 * RealmDashboard.jsx — the Realm Inspector's default section (UX Phase 4, plan §4.5).
 *
 * A live, glanceable summary of the campaign's living world, built ENTIRELY on the
 * existing pure read-side selectors (domain/display/warStatus.js + the pantheon
 * ledger). It reports:
 *   - in-world tick + era (calendar month/season/year)
 *   - settlement count
 *   - active wars (liveSieges)
 *   - dominant faith (top pantheon tier, by seats)
 *   - war-weariest power (warExhaustionStandings)
 *   - tension (a coarse roll-up of live war/disposition pressure)
 *
 * Two faces:
 *   - PREMIUM / live campaign → the summary above.
 *   - ANON / FREE (no canManageCampaigns) → a LOCKED teaser that fires the
 *     `map_realm_teaser` pricing moment (once, cooldown-guarded) and routes the
 *     CTA to the canonical premium-value surface. The Realm is REACHABLE for anon
 *     (not hidden) — this is the locked-state preview the plan calls for.
 *
 * Pure presentational + one fire-and-forget pricing-moment effect. No worldState
 * mutation, no rng, no wall clock.
 */

import { useEffect } from 'react';
import { Lock, Sparkles, Swords, Globe2, Flame, Users } from 'lucide-react';

import { useStore } from '../../store/index.js';
import {
  liveSieges,
  warExhaustionStandings,
  warExhaustionBand,
} from '../../domain/display/warStatus.js';
import { hasPantheon } from './PantheonPanel.jsx';
import { BODY, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, R, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';

const SEASON_LABEL = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', fall: 'Autumn', winter: 'Winter' };

/** The dominant faith — the top deity by seats, with its tier. Null when dormant. */
function dominantFaith(worldState) {
  if (!worldState?.pantheon || typeof worldState.pantheon !== 'object') return null;
  const entries = Object.keys(worldState.pantheon).map(id => ({ id, ...(worldState.pantheon[id] || {}) }));
  if (!entries.length) return null;
  entries.sort((a, b) => (Number(b.seats) || 0) - (Number(a.seats) || 0) || (String(a.id) < String(b.id) ? -1 : 1));
  const top = entries[0];
  const tail = String(top.id).split(/[:_]/).filter(Boolean).pop() || String(top.id);
  return {
    name: tail.charAt(0).toUpperCase() + tail.slice(1),
    tier: top.tier || 'cult',
    seats: Number(top.seats) || 0,
  };
}

/** Coarse 0..1 tension roll-up from live war + disposition pressure. */
function tensionLabel({ worldState, regionalGraph, settlementCount }) {
  const sieges = liveSieges({ worldState, regionalGraph }).length;
  const weary = warExhaustionStandings(worldState).length;
  const denom = Math.max(1, settlementCount || 1);
  const score = Math.min(1, (sieges * 0.5 + weary * 0.25) / denom);
  if (score <= 0) return { label: 'At peace', tone: 'calm' };
  if (score < 0.34) return { label: 'Simmering', tone: 'warm' };
  if (score < 0.67) return { label: 'Strained', tone: 'hot' };
  return { label: 'In open war', tone: 'crisis' };
}

function Stat({ Icon, label, value, sub, tone }) {
  const valueColor = tone === 'crisis' ? '#b4282a' : tone === 'hot' ? '#b4632a' : INK;
  return (
    <div style={{
      display: 'grid', gap: 3, minWidth: 0,
      padding: SP.sm,
      border: `1px solid ${BORDER2}`,
      borderRadius: R.md,
      background: CARD,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {Icon && <Icon size={12} />}{label}
      </span>
      <span style={{ color: valueColor, fontFamily: sans, fontSize: FS.md, fontWeight: 950, lineHeight: 1.15 }}>
        {value}
      </span>
      {sub && <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700 }}>{sub}</span>}
    </div>
  );
}

/**
 * The locked teaser shown to anon / free users. Reachable (not hidden) — fires the
 * map_realm_teaser pricing moment once on mount, then offers an Upgrade CTA.
 */
function RealmDashboardLocked({ tier, onUpgrade }) {
  useEffect(() => {
    let cancelled = false;
    import('../../lib/pricingMoments.js')
      .then(({ triggerPricingMoment }) => {
        if (cancelled) return;
        const setActive = useStore.getState().setActivePricingMoment;
        triggerPricingMoment('map_realm_teaser', setActive, { tier });
      })
      .catch(() => { /* never block the teaser render */ });
    return () => { cancelled = true; };
  }, [tier]);

  return (
    <div data-testid="realm-dashboard-locked" style={{
      display: 'grid', gap: SP.md,
      padding: SP.lg,
      border: `1px solid ${GOLD}`,
      borderRadius: R.lg,
      background: CARD_ALT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Lock size={16} color={GOLD} />
        <h3 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.md, fontWeight: 950 }}>
          The Realm comes alive with Cartographer
        </h3>
      </div>
      <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.55 }}>
        This is the living simulation. Advance time and the region runs for years:
        wars ignite and burn themselves out, faiths win converts, trade routes flip,
        and a chronicle writes itself. Explore the map below — the live controls and
        the world pulse unlock with Cartographer.
      </p>
      <ul style={{ margin: 0, paddingLeft: 18, color: SECOND, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.7 }}>
        <li>Advance the realm month-by-month and watch the chronicle</li>
        <li>The self-ending war layer: sieges, coalitions, conquest</li>
        <li>The living pantheon: deities contest converts and rise</li>
      </ul>
      <div>
        <Button variant="gold" size="md" onClick={() => {
          // P9 — clicking "run the Realm" IS the advance attempt: fire the
          // simulation-intent moment (cooldown-guarded), then route to the
          // canonical premium-value surface.
          import('../../lib/pricingMoments.js')
            .then(({ triggerPricingMoment }) =>
              triggerPricingMoment('first_advance_attempt', useStore.getState().setActivePricingMoment, { tier }))
            .catch(() => {});
          onUpgrade?.();
        }}>
          {tier === 'anon' ? 'Sign in to unlock the Realm' : 'Upgrade to run the Realm'}
        </Button>
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {any} props.campaign     the active campaign (worldState + settlementIds)
 * @param {boolean} props.canManageCampaigns  premium/elevated → live dashboard
 * @param {string} props.tier      auth tier (drives the locked-teaser moment + CTA)
 * @param {() => void} [props.onUpgrade]  route to the premium-value surface
 */
export default function RealmDashboard({ campaign, canManageCampaigns, tier, onUpgrade }) {
  // Locked preview for anon / free — REACHABLE, not hidden.
  if (!canManageCampaigns) {
    return <RealmDashboardLocked tier={tier} onUpgrade={onUpgrade} />;
  }

  // No campaign selected yet — a neutral prompt (still premium, just empty).
  if (!campaign) {
    return (
      <div style={{
        padding: SP.lg, border: `1px dashed ${BORDER2}`, borderRadius: R.lg,
        color: MUTED, fontFamily: sans, fontSize: FS.sm, fontWeight: 750, textAlign: 'center',
      }}>
        Select a campaign to see the state of its realm.
      </div>
    );
  }

  const worldState = campaign.worldState || {};
  const regionalGraph = campaign.regionalGraph || worldState.regionalGraph || null;
  const calendar = worldState.calendar || {};
  const season = SEASON_LABEL[String(calendar.season || '').toLowerCase()] || 'Spring';
  const settlementCount = (campaign.settlementIds || []).length;
  const sieges = liveSieges({ worldState, regionalGraph });
  const weary = warExhaustionStandings(worldState);
  const weariest = weary.slice().sort((a, b) => b.warExhaustion - a.warExhaustion)[0] || null;
  const faith = hasPantheon(campaign) ? dominantFaith(worldState) : null;
  const tension = tensionLabel({ worldState, regionalGraph, settlementCount });

  return (
    <div data-testid="realm-dashboard" style={{ display: 'grid', gap: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Globe2 size={15} color={GOLD} />
        <h3 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          State of the Realm
        </h3>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
        gap: SP.sm,
      }}>
        <Stat
          Icon={Sparkles}
          label="In-world date"
          value={`${season}, Yr ${calendar.year || 1}`}
          sub={`Tick ${worldState.tick || 0} · month ${calendar.month || 1}`}
        />
        <Stat Icon={Users} label="Settlements" value={settlementCount} />
        <Stat
          Icon={Swords}
          label="Active wars"
          value={sieges.length}
          sub={sieges.length ? `${sieges.length} siege${sieges.length === 1 ? '' : 's'}` : 'No sieges'}
          tone={sieges.length ? 'crisis' : undefined}
        />
        <Stat
          Icon={Sparkles}
          label="Dominant faith"
          value={faith ? faith.name : '—'}
          sub={faith ? `${faith.tier} · ${faith.seats} seat${faith.seats === 1 ? '' : 's'}` : 'No pantheon'}
        />
        <Stat
          Icon={Flame}
          label="War-weariest"
          value={weariest ? weariest.id : '—'}
          sub={weariest ? warExhaustionBand(weariest.warExhaustion) : 'None war-weary'}
          tone={weariest && weariest.warExhaustion >= 0.6 ? 'hot' : undefined}
        />
        <Stat
          Icon={Swords}
          label="Tension"
          value={tension.label}
          tone={tension.tone === 'crisis' ? 'crisis' : tension.tone === 'hot' ? 'hot' : undefined}
        />
      </div>
    </div>
  );
}
