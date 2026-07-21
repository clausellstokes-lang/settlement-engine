/**
 * WhileYouWereAway.jsx — the M10b "while you were away" catch-up digest banner
 * (components-dossier-4).
 *
 * The living/autonomous world now advances ON campaign activation
 * (setActiveCampaign — experience-product-fit-1), so the realm can move on a path
 * where no one is watching the Pulse tab. This banner makes that legible: it reads
 * the TRANSIENT `livingCatchUp` store field the catch-up body stashes and reports
 * what happened — a busy indicator while the (up to CATCH_UP_CAP_WEEKS) kernel ticks
 * run, then "N weeks passed" with the major beats over the caught-up window, a
 * capped note, and — surfaced, never swallowed — a failure note if the advance threw.
 *
 * Pure read + one store write (dismiss). Self-gates to nothing when the active
 * campaign has no digest (a dm_advanced / up-to-date / quiet open) so it costs a
 * quiet realm nothing. Mounted at the head of RealmDashboard (the default inspector
 * section + the mobile gate) and WorldPulsePanel (the Pulse tab), so a returning DM
 * sees it wherever they land.
 */

import { History, Sparkles, AlertTriangle, X } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { IconButton } from './IconButton.jsx';
import { BODY, BORDER2, FS, GOLD, GOLD_BG, INK, MUTED, RED, SECOND, sans } from '../theme.js';

/**
 * @param {Object} props
 * @param {string|number|null} [props.campaignId]  scope the banner to this campaign;
 *   defaults to the active campaign so a stale digest from another campaign never shows.
 */
export default function WhileYouWereAway({ campaignId = null }) {
  const digest = useStore(s => s.livingCatchUp);
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const dismiss = useStore(s => s.dismissLivingCatchUp);
  // experience-product-fit-1: did the living catch-up PARK on a surfacing major? The
  // world's pausedAdvance cursor is the ground truth — read it here (a lazy component)
  // so the eager catch-up store path stays byte-inert.
  const pausedAdvance = useStore(s => {
    const cid = campaignId != null ? String(campaignId)
      : (s.activeCampaignId != null ? String(s.activeCampaignId) : null);
    if (cid == null) return null;
    return (s.campaigns || []).find(c => String(c.id) === cid)?.worldState?.pausedAdvance || null;
  });

  const scopeId = campaignId != null ? String(campaignId)
    : (activeCampaignId != null ? String(activeCampaignId) : null);
  if (!digest) return null;
  if (scopeId != null && String(digest.campaignId) !== scopeId) return null;

  const running = digest.status === 'running';
  const error = digest.error || null;
  const weeks = Number(digest.weeksCaughtUp) || 0;
  const capped = !!digest.capped;
  // experience-product-fit-1: the living catch-up parked on a surfacing major.
  const paused = !!pausedAdvance;
  const majors = Array.isArray(digest.majors) ? digest.majors : [];
  // Defensive: nothing ran, nothing failed, and it didn't park ⇒ render nothing (the
  // store only stashes on real work, but keep the banner honest if that changes).
  if (!running && !error && weeks <= 0 && !paused) return null;

  // ── Busy: the catch-up is mid-flight (up to CATCH_UP_CAP_WEEKS ticks). ──
  if (running) {
    return (
      <div
        data-testid="while-you-were-away"
        role="status"
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: `1px solid ${BORDER2}`,
          background: GOLD_BG, padding: '9px 12px',
          color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
        }}
      >
        <History size={14} color={GOLD} />
        Catching the realm up on the time that passed…
      </div>
    );
  }

  const weekWord = weeks === 1 ? 'week' : 'weeks';
  return (
    <div
      data-testid="while-you-were-away"
      style={{
        border: `1px solid ${GOLD}`, borderLeft: `3px solid ${GOLD}`,
        background: GOLD_BG, padding: '10px 12px', display: 'grid', gap: 8,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <History size={15} color={GOLD} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950, lineHeight: 1.2 }}>
            While you were away
          </div>
          <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 750, marginTop: 2 }}>
            The realm advanced {weeks} {weekWord} on its own{paused ? ', then paused for your word' : ''}.
          </div>
        </div>
        <IconButton
          onClick={() => dismiss?.()}
          aria-label="Dismiss the catch-up summary"
          title="Dismiss"
        >
          <X size={13} />
        </IconButton>
      </header>

      {error ? (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 6,
          border: '1px solid rgba(197,74,74,0.45)',
          background: 'rgba(197,74,74,0.08)', padding: '7px 9px',
          color: RED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, lineHeight: 1.45,
        }}>
          <AlertTriangle size={13} style={{ marginTop: 1, flexShrink: 0 }} />
          <span>The catch-up hit a snag and stopped early: {error}. Advance the realm to resume.</span>
        </div>
      ) : majors.length > 0 ? (
        <div style={{ display: 'grid', gap: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
            <Sparkles size={12} /> What happened
          </div>
          <ul style={{ margin: 0, paddingLeft: 16, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
            {majors.slice(0, 6).map((headline, i) => (
              <li key={i} style={{ marginBottom: 3 }}>{headline}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, lineHeight: 1.45 }}>
          The realm advanced quietly — no major turns while you were gone.
        </div>
      )}

      {paused && !error && (
        <div data-testid="catchup-paused-note" style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800, lineHeight: 1.4 }}>
          A major turn surfaced and the realm paused for your word. Set your verdicts on it in the World Pulse panel, then resume the interval.
        </div>
      )}

      {/* Honest capped note (C3 finding 11): past the cap the realm lives the FIRST
          capped weeks of the absence, then the calendar leaps to now and the
          remainder is skipped for good (owner ruling 2026-07-13,
          calendar-advances-past-cap — no perpetual re-catch-up). The old copy
          claimed the "most recent" weeks were shown and the rest could still be
          run — both halves were false. */}
      {capped && !error && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750, lineHeight: 1.4 }}>
          More time had passed than a single catch-up covers — the realm lived the first {weeks} {weekWord} of it, then time leapt to today. The span between passes into history unrecorded.
        </div>
      )}
    </div>
  );
}
