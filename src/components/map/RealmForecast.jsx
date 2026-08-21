/**
 * RealmForecast — THE FORECAST pane (Composer V2 §10): the realm's pending
 * future, click-driven (two clone-runs are ~interval-sized compute — never
 * dial-live). Renders the joint outcome of the ENTIRE docket + the organic
 * world over the chosen interval, grouped per settlement (the story of the
 * unattended interval), with queue-mouth refusals and pause markers surfaced.
 *
 * REALM-WIDE STALENESS: the pane is keyed to forecastFingerprint(campaign,
 * interval); ANY queue mutation, advance, or proposal decision voids it
 * visibly. THE HONEST LABEL is printed verbatim. NO-COMMIT: the run happens on
 * clones inside the domain module; this component holds only local state.
 */
import { useMemo, useState } from 'react';
import { Telescope } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { forecastFingerprint } from '../../domain/worldPulse/forecastFingerprint.js';
import { MUTED, INK, BORDER, CARD, sans, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';

const INTERVALS = Object.freeze([
  ['one_week', 'Week'], ['one_month', 'Month'], ['one_season', 'Season'], ['one_year', 'Year'],
]);

/** @param {unknown} value @returns {string} */
function human(value) {
  return String(value || 'order').replace(/[_-]+/g, ' ').trim().toLowerCase();
}

/** @param {string} interval @returns {string} */
function intervalLabel(interval) {
  return INTERVALS.find(([key]) => key === interval)?.[1] || 'Selected interval';
}

export default function RealmForecast({ campaign }) {
  const saves = useStore(s => s.savedSettlements);
  const [interval, setSpan] = useState('one_month');
  const [running, setRunning] = useState(false);
  const [view, setView] = useState(null); // { digest, refusals, interval }
  const [fp, setFp] = useState('');

  const memberSaves = useMemo(() => {
    const memberIds = new Set((campaign?.settlementIds || []).map(String));
    return (saves || []).filter(save => memberIds.has(String(save.id)));
  }, [campaign?.settlementIds, saves]);
  const settlementNameById = useMemo(
    () => new Map(memberSaves.map(save => [
      String(save.id),
      String(save?.settlement?.name || save?.name || 'A campaign settlement'),
    ])),
    [memberSaves],
  );

  // composer-realm-verbs-3 — CANDIDATE LANE DEFERRAL (deliberate, recorded — not
  // a gap to re-find): the marginal with-vs-without view (runRealmForecast's
  // `candidate` arm + forecastDigest's marginal isolation) is DELIBERATELY not
  // wired here. The domain lane (runRealmForecast candidate) is built + pinned
  // (forecastRun.test.js), but its UI is owner-gated product scope, recorded in
  // memory/w-composer-2-realm-lift.md ("candidate-run forecast UI (marginal view
  // in the composer pane) not wired"). This pane renders the BASELINE pending
  // future (§10's headline) + the realm-scope beats; a staged order already
  // appears inside that baseline.
  async function run() {
    setRunning(true);
    try {
      const { simulatePendingFuture, forecastDigest } =
        await import('../../domain/worldPulse/forecastRun.js');
      const now = new Date().toISOString();
      const runOut = await simulatePendingFuture({ campaign, saves: memberSaves, interval, now });
      setView({
        digest: forecastDigest(runOut, memberSaves),
        refusals: runOut.refusals,
        interval,
      });
      setFp(forecastFingerprint(campaign, interval, memberSaves));
    } finally {
      setRunning(false);
    }
  }

  // Staleness: recompute the live fingerprint cheaply on render (string build).
  const liveFp = useMemo(
    () => view ? forecastFingerprint(campaign, interval, memberSaves) : '',
    [view, campaign, interval, memberSaves],
  );
  const stale = view && liveFp !== fp;

  return (
    <div style={{ marginTop: SP.sm, borderTop: `1px solid ${BORDER}`, paddingTop: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: FS.xs, fontWeight: 800, fontFamily: sans, color: MUTED,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <Telescope size={12} /> Forecast the pending future
        </span>
        <span style={{ display: 'inline-flex', gap: 4 }}>
          {INTERVALS.map(([key, label]) => (
            <Button
              key={key}
              size="sm"
              variant={interval === key ? 'primary' : 'ghost'}
              aria-pressed={interval === key}
              onClick={() => setSpan(key)}
            >
              {label}
            </Button>
          ))}
        </span>
        <Button size="sm" variant="primary" disabled={running} onClick={run}>
          {running ? 'Running the future…' : 'Run forecast'}
        </Button>
      </div>

      {view && (
        <div style={{ marginTop: SP.sm }}>
          <div
            data-testid="realm-forecast-boundary"
            style={{
              marginBottom: SP.sm,
              color: INK,
              fontFamily: sans,
              fontSize: FS.xs,
              fontWeight: 800,
            }}
          >
            Projected interval: {intervalLabel(view.interval)}
          </div>
          {stale && (
            <div style={{
              padding: SP.sm, marginBottom: SP.sm, border: `1px dashed ${BORDER}`,
              fontSize: FS.xxs, fontFamily: sans, color: MUTED,
            }}>
              The world or the docket changed underneath this forecast. It no longer speaks for the pending future. Run it again.
            </div>
          )}
          {(view.refusals || []).length > 0 && (
            <section
              aria-labelledby="realm-forecast-refusals"
              style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, marginBottom: SP.sm }}
            >
              <div id="realm-forecast-refusals" style={{ color: INK, fontWeight: 850 }}>
                Orders currently expected to be refused
              </div>
              <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                {view.refusals.map(refusal => (
                  <li key={refusal.queueId || `${refusal.saveId}:${refusal.eventType}`}>
                    {settlementNameById.get(String(refusal.saveId)) || 'A campaign settlement'}:{' '}
                    {human(refusal.eventType)}. Reason: {human(refusal.code)}
                    {refusal.detail ? `: ${String(refusal.detail)}` : ''}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
            {view.digest.members.map(m => (
              <div key={m.saveId} style={{ padding: SP.sm, border: `1px solid ${BORDER}`, background: CARD }}>
                <div style={{ fontSize: FS.xs, fontFamily: sans, color: INK, fontWeight: 700 }}>
                  {m.name}
                  <span style={{ color: MUTED, fontWeight: 400, marginLeft: 8 }}>
                    {m.populationBefore.toLocaleString()} → {m.populationAfter.toLocaleString()}
                    {m.tierBefore !== m.tierAfter ? ` · ${m.tierBefore} → ${m.tierAfter}` : ''}
                  </span>
                </div>
                {m.beats.slice(0, 5).map((b, i) => (
                  <div key={i} style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, marginTop: 2 }}>
                    {Number.isFinite(b.tick) ? `Week ${b.tick}: ` : ''}{b.headline}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {/* composer-realm-verbs-3: the realm-scope beats — the digest's
              "readable in both directions" law (§10). These are the news beats
              that belong to NO single member (realm-wide events: treaties,
              coalitions, foreign intervention), rendered as a realm band. */}
          {(view.digest.realm || []).length > 0 && (
            <div style={{ marginTop: SP.sm, padding: SP.sm, border: `1px solid ${BORDER}`, background: CARD }}>
              <div style={{
                fontSize: FS.xxs, fontWeight: 800, fontFamily: sans, color: MUTED,
                letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2,
              }}>
                Across the realm
              </div>
              {view.digest.realm.slice(0, 6).map((b, i) => (
                <div key={i} style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, marginTop: 2 }}>
                  {Number.isFinite(b.tick) ? `Week ${b.tick}: ` : ''}{b.headline}
                </div>
              ))}
            </div>
          )}
          {view.digest.pauseMarkers.length > 0 && (
            <div style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, marginTop: SP.xs }}>
              {view.digest.pauseMarkers.length} moment{view.digest.pauseMarkers.length === 1 ? '' : 's'} where the world would await your word (auto-resolved with defaults here).
            </div>
          )}
          <p style={{ fontSize: FS.xxs, color: MUTED, margin: '8px 0 0', fontStyle: 'italic', lineHeight: 1.5 }}>
            This is a deterministic, bounded projection from the recorded snapshot through the selected interval.
            It includes the current docket and organic realm changes, assumes no later edits or party actions, and
            uses defaults where the world would await your word. A queued party action&apos;s wider realm ripple is
            not included, so this is guidance rather than a guaranteed outcome.
          </p>
        </div>
      )}
    </div>
  );
}

/** Compatibility export for focused UI tests and external callers. */
export function liveFingerprint(campaign, interval, saves = []) {
  return forecastFingerprint(campaign, interval, saves);
}
