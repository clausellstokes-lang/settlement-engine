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
import { Lock, Sparkles, Globe2, Flame, Users, ArrowUp, ArrowRight } from 'lucide-react';

import { useStore } from '../../store/index.js';
import {
  liveSieges,
  warExhaustionStandings,
  warExhaustionBand,
} from '../../domain/display/warStatus.js';
import { mobilizationStandings } from '../../domain/display/mobilizationStatus.js';
import { occupationStandings } from '../../domain/display/occupationStatus.js';
import { WAR_SHAPED_TYPES } from './WorldPulseData.js';
import { hasPantheon } from './PantheonPanel.jsx';
import { PANTHEON_TUNING } from '../../domain/worldPulse/pantheon.js';
import { AMBER_DEEP, BODY, CARD, CARD_ALT, FS, GOLD, INK, RED, SECOND, R, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';
import CampaignEmptyState from './CampaignEmptyState.jsx';

const SEASON_LABEL = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', fall: 'Autumn', winter: 'Winter' };

// The faith-tier ladder, read low to high from the engine's own rank order so the
// gloss can never drift from the tiering code (cult → minor → major today).
const FAITH_TIER_GLOSS = `Faith ranks by seats won, from ${(PANTHEON_TUNING.TIER_FOR_RANK || []).join(' to ')}.`;

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

/**
 * Coarse 0..1 tension roll-up from live war + disposition pressure.
 *
 * The roll-up folds in EVERY live war signal the Conflict stat reports —
 * sieges, war-weariness, mobilizing powers, and standing occupations — so the
 * headline band can never disagree with its own sub-line (e.g. read "At peace"
 * while territory sits held by conquest). One source, one verdict.
 */
function tensionLabel({ worldState, regionalGraph, settlementCount, mobilizing = 0, occupations = 0 }) {
  const sieges = liveSieges({ worldState, regionalGraph }).length;
  const weary = warExhaustionStandings(worldState).length;
  const denom = Math.max(1, settlementCount || 1);
  const score = Math.min(
    1,
    (sieges * 0.5 + occupations * 0.4 + mobilizing * 0.3 + weary * 0.25) / denom,
  );
  if (score <= 0) return { label: 'At peace', tone: 'calm' };
  if (score < 0.34) return { label: 'Simmering', tone: 'warm' };
  if (score < 0.67) return { label: 'Strained', tone: 'hot' };
  return { label: 'In open war', tone: 'crisis' };
}

/**
 * A single stat. Rendered as a borderless ledger cell (P5 anti-box-soup) —
 * spacing and the grid gap carry the grouping, so the only border that survives
 * is the semantic left-accent on a crisis/hot stat, where it MEANS something.
 *
 * Three distinct type tiers carried by SIZE as well as weight (P4 — never a
 * single near-equal weight step): the focal value is FS.xl/950, ordinary values
 * are FS.sm/850, and the uppercase label is FS.xs/850. The section heading sits
 * at FS.xs (chrome/scent), so the panel reads focal-value(17) > value(12) >
 * label(11) with real size gaps, not a flat band of 13s.
 *
 * `delta` is the change channel (P3): when supplied it renders ABOVE the value as
 * the loudest line on a focal card — "+2 conflict events this tick" — so after
 * Advance Time the movement, not the static absolute, is what the eye lands on.
 */
// NOTE: this local Stat extends the shared primitives/Stat.jsx contract (a flat
// label+value ledger cell) with the delta (P3), focal, sub, and two-channel
// severity accent channels the canonical Stat lacks, so the local one stays.
function Stat({ Icon, label, value, sub, subTitle, tone, delta, focal = false, valueTitle }) {
  // Two-channel severity (P7): color is paired with a glyph + a left accent
  // border so crisis/hot never reads on hue alone.
  const valueColor = tone === 'crisis' ? RED : tone === 'hot' ? AMBER_DEEP : INK;
  const accent = tone === 'crisis' ? RED : tone === 'hot' ? AMBER_DEEP : null;
  return (
    <div style={{
      display: 'grid', gap: 3, minWidth: 0,
      padding: focal ? `${SP.sm}px ${SP.md}px` : `2px 0`,
      gridColumn: focal ? '1 / -1' : undefined,
      borderLeft: accent ? `3px solid ${accent}` : 'none',
      paddingLeft: accent ? SP.sm : (focal ? SP.md : 0),
      background: focal && accent ? CARD : undefined,
      borderRadius: focal && accent ? R.md : undefined,
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {Icon && <Icon size={12} />}{label}
      </span>
      {delta && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: delta.tone === 'crisis' ? RED : delta.tone === 'hot' ? AMBER_DEEP : SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, lineHeight: 1.15 }}>
          {delta.rising ? <ArrowUp size={12} aria-hidden /> : <ArrowRight size={12} aria-hidden />}{delta.text}
        </span>
      )}
      <span title={valueTitle} style={{ display: 'flex', alignItems: 'center', gap: 5, color: valueColor, fontFamily: sans, fontSize: focal ? FS.xl : FS.sm, fontWeight: focal ? 950 : 850, lineHeight: 1.15 }}>
        {/* ONE glyph on the focal card (P6): the Flame severity glyph is the
            two-channel severity signal; the label-row Swords icon is dropped so
            the card carries a single weapon/fire mark, not two. */}
        {focal && accent && <Flame size={16} aria-hidden />}{value}
      </span>
      {sub && <span title={subTitle} style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>{sub}</span>}
    </div>
  );
}

/**
 * The change since the last advance, derived from the most recent pulseHistory
 * record (P3 — the dashboard's headline selectors are point-in-time, but the
 * latest pulse record IS the honest "what moved last tick" read; no ambiguous
 * re-derivation of a prior band). Counts the war-shaped outcomes + war/faith
 * impact-digest entries the engine recorded for that tick. Returns null at turn 0
 * (no history) so the dashboard falls back to absolutes. Pure, no mutation.
 */
function lastTickConflictDelta(worldState) {
  const history = Array.isArray(worldState?.pulseHistory) ? worldState.pulseHistory : [];
  if (!history.length) return null;
  const latest = history[history.length - 1];
  const outcomes = Array.isArray(latest?.selectedOutcomes) ? latest.selectedOutcomes : [];
  const digest = Array.isArray(latest?.impactDigest) ? latest.impactDigest : [];
  let count = 0;
  for (const o of outcomes) {
    if (WAR_SHAPED_TYPES.has(o?.type) || WAR_SHAPED_TYPES.has(o?.candidateType) || WAR_SHAPED_TYPES.has(o?.stressor?.type)) count += 1;
  }
  for (const d of digest) {
    if (d?.channelType === 'war_front' || WAR_SHAPED_TYPES.has(d?.impactKind)) count += 1;
  }
  if (count <= 0) return { rising: false, tone: 'calm', text: 'Quiet last tick' };
  return {
    rising: true,
    tone: count >= 3 ? 'crisis' : 'hot',
    text: `+${count} conflict event${count === 1 ? '' : 's'} this tick`,
  };
}

/**
 * The locked teaser shown to anon / free users. Reachable (not hidden) — fires the
 * map_realm_teaser pricing moment once on mount, then offers an Upgrade CTA.
 */
function RealmDashboardLocked({ tier, onUpgrade, campaign }) {
  // P9 — turn the limit into a PREVIEW: when a free-tier user already has a
  // campaign, compute their OWN realm's Conflict band (the dashboard's pure
  // selectors run on any worldState) and show it blurred/read-only above the
  // CTA, so the wall reads as "here is your living world — unlock it" rather than
  // a denial. True anon has no campaign ⇒ no preview (the prose teaser stands).
  const previewWorldState = campaign?.worldState || null;
  const previewRegionalGraph = campaign
    ? (campaign.regionalGraph || campaign.worldState?.regionalGraph || null)
    : null;
  const previewTension = previewWorldState
    ? tensionLabel({
        worldState: previewWorldState,
        regionalGraph: previewRegionalGraph,
        settlementCount: (campaign.settlementIds || []).length,
      })
    : null;

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
        and a chronicle writes itself. Explore the map below. The live controls and
        the world pulse unlock with Cartographer.
      </p>
      {/* A real, read-only preview of the GM's own realm (P9): the Conflict band
          their world is in right now, blurred just enough to read as locked. The
          aria-label keeps the actual band available to assistive tech. */}
      {previewTension && (
        <div
          data-testid="realm-locked-preview"
          aria-label={`Your realm's conflict band: ${previewTension.label} (unlock to read live)`}
          style={{
            display: 'grid', gap: 3,
            padding: `${SP.sm}px ${SP.md}px`, borderRadius: R.md,
            background: CARD, borderLeft: `3px solid ${previewTension.tone === 'crisis' ? RED : previewTension.tone === 'hot' ? AMBER_DEEP : GOLD}`,
          }}
        >
          <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Conflict · your realm
          </span>
          <span aria-hidden style={{
            color: previewTension.tone === 'crisis' ? RED : previewTension.tone === 'hot' ? AMBER_DEEP : INK,
            fontFamily: sans, fontSize: FS.lg, fontWeight: 950, lineHeight: 1.15,
            filter: 'blur(3px)', userSelect: 'none',
          }}>
            {previewTension.label}
          </span>
        </div>
      )}
      {/* Body color (not SECOND) so the three value props clear AA 4.5:1 on
          parchment — these are load-bearing benefit prose, not quiet scent (P7). */}
      <ul style={{ margin: 0, paddingLeft: 18, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.7 }}>
        <li>Advance the realm month by month and watch the chronicle fill</li>
        <li>The self-ending war layer: sieges, coalitions, conquest</li>
        <li>The living pantheon: deities contest converts and rise</li>
      </ul>
      <div>
        <Button variant="primary" size="md" onClick={() => {
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
export default function RealmDashboard({
  campaign, canManageCampaigns, tier, onUpgrade, nameById,
  onCreateCampaign, onSelectCampaign, hasCampaigns = false,
}) {
  // Locked preview for anon / free — REACHABLE, not hidden.
  if (!canManageCampaigns) {
    return <RealmDashboardLocked tier={tier} onUpgrade={onUpgrade} campaign={campaign} />;
  }

  // No campaign selected yet — the SAME actionable gold callout every other Realm
  // section uses (P1/P4/P8): one empty-state recipe, a real first click here,
  // and no lone dashed box that read as a disabled false-floor (P5).
  if (!campaign) {
    return (
      <CampaignEmptyState
        lead="Pick a campaign to see the state of its realm."
        onCreateCampaign={onCreateCampaign}
        onSelectCampaign={onSelectCampaign}
        hasCampaigns={hasCampaigns}
      />
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
  // DM-only Realm dashboard (canManageCampaigns gate) ⇒ includeCovert is safe here.
  const mobilizing = mobilizationStandings({ worldState, includeCovert: true });
  const occupations = occupationStandings({ worldState });
  const tension = tensionLabel({
    worldState, regionalGraph, settlementCount,
    mobilizing: mobilizing.length, occupations: occupations.length,
  });

  // One focal Conflict digest: the tension band is the headline, and the four
  // former war stats survive as a one-line component breakdown beneath it. The
  // four facts the GM scans for ("is the realm at war, and how?") now win the
  // squint test as a single card instead of fragmenting across four equals.
  const conflictParts = [];
  if (sieges.length) conflictParts.push(`${sieges.length} siege${sieges.length === 1 ? '' : 's'}`);
  if (occupations.length) conflictParts.push(`${occupations.length} occupied`);
  if (mobilizing.length) conflictParts.push(`${mobilizing.length} mobilizing${mobilizing.some(m => m.covert) ? ' (some covert)' : ''}`);
  if (weariest && weariest.warExhaustion >= 0.6) {
    conflictParts.push(`${nameById?.get(String(weariest.id)) || weariest.id} war-weary`);
  }
  const conflictSub = conflictParts.length ? conflictParts.join(' · ') : 'No sieges, occupations, or mobilizations';
  const conflictTone = tension.tone === 'crisis' ? 'crisis'
    : (tension.tone === 'hot' || sieges.length || occupations.length || mobilizing.length) ? 'hot'
    : undefined;

  // The change channel (P3): what moved last advance. At turn 0 (no history)
  // delta is null and the focal card falls back to the absolute band alone.
  const conflictDelta = lastTickConflictDelta(worldState);

  return (
    <div data-testid="realm-dashboard" style={{ display: 'grid', gap: SP.lg }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Globe2 size={15} color={GOLD} />
        {/* The section heading is quiet scent (FS.xs uppercase), not a competing
            focal element — de-emphasizing it lets the focal Conflict value be the
            single dominant entry point in the panel (P4 de-emphasize-to-emphasize). */}
        <h3 style={{ margin: 0, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          State of the Realm
        </h3>
      </div>

      {/* Eye-path runs change/severity-first: the focal Conflict stat leads, then
          War-weariest (so all conflict signal is contiguous, P6), then the calmer
          Dominant faith; static reference (date, settlements) sits quietest at the
          end. Differential spacing (tight within cluster, SP.lg between) carries
          the grouping now that the per-card frames are gone (P5). */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
        gap: SP.sm,
      }}>
        <Stat
          focal
          label="Conflict"
          value={tension.label}
          valueTitle="The realm's conflict band, from at peace to simmering to strained to in open war."
          sub={conflictSub}
          tone={conflictTone}
          delta={conflictDelta}
        />
        <Stat
          Icon={Flame}
          label="War-weariest"
          value={weariest ? (nameById?.get(String(weariest.id)) || weariest.id) : '–'}
          sub={weariest ? warExhaustionBand(weariest.warExhaustion) : 'None war-weary'}
          tone={weariest && weariest.warExhaustion >= 0.6 ? 'hot' : undefined}
        />
        <Stat
          Icon={Sparkles}
          label="Dominant faith"
          value={faith ? faith.name : '–'}
          sub={faith ? `${faith.tier} · ${faith.seats} seat${faith.seats === 1 ? '' : 's'}` : 'No pantheon'}
          subTitle={faith ? FAITH_TIER_GLOSS : undefined}
        />
      </div>

      {/* Reference cluster — quietest, no tone accent. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
        gap: SP.sm,
      }}>
        <Stat
          Icon={Sparkles}
          label="In-world date"
          value={`${season}, Yr ${calendar.year || 1}`}
          sub={`Month ${calendar.month || 1}`}
        />
        <Stat Icon={Users} label="Settlements" value={settlementCount} />
      </div>
    </div>
  );
}
