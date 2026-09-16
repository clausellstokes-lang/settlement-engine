/**
 * AiPricingResyncPanel.jsx — Admin surface for the AI pricing resync.
 *
 * The resync recalibrates per-model credit costs from real usage cost: it
 * refetches provider list prices, merges them under guards, aggregates the
 * usage window, and recomputes each profile×feature credit cost toward a target
 * margin (bounded to one step per run). The heavy lifting is server-side in the
 * `ai_pricing_resync` admin-actions edge action — this panel is the operator's
 * cockpit: it shows when the schedule last changed, runs the action (DRY-RUN by
 * default so a preview never writes), and renders the returned report.
 *
 * Dry-run is CHECKED by default on purpose: applying rewrites the live pricing
 * config, so the safe default is "show me what would change" and the operator
 * unchecks to commit. Requires developer/admin (the edge action gates isHighest;
 * this UI mounts only inside AdminPanel, itself elevated-only) — the real
 * authority is server-side.
 *
 * Style mirrors AdminUsersPanel/SupportQueuePanel: renders flat (the parent
 * <Section> supplies the card frame + heading), inline strings (admin surfaces
 * are operator tooling, not user-facing copy), the house invoke-error pattern
 * (throw on transport error OR data.error), a busy flag, and the semantic
 * theme tokens.
 */
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.js';
import useLivePricing from '../../hooks/useLivePricing.js';
import Button from '../primitives/Button.jsx';
import {
  INK, MUTED, BODY, BORDER2, CARD_HDR, RED, GREEN, GOLD_TXT, sans, SP, FS } from '../theme.js';

/** Format an ISO timestamp for the "last updated" line, resilient to junk. */
function formatUpdatedAt(iso) {
  if (!iso) return 'never';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleString();
}

/**
 * Infer the provider label for a candidate row from its model id. The report's
 * `candidates` are ParsedPrice rows ({modelId, inputPerMtok, outputPerMtok}) —
 * the merge layer does NOT stamp a `provider` field on them, so derive it from
 * the id prefix rather than reading a key that isn't there.
 */
function candidateProvider(modelId) {
  const id = String(modelId || '').toLowerCase();
  if (id.startsWith('claude')) return 'anthropic';
  if (id.startsWith('gpt')) return 'openai';
  return 'provider';
}

/** Small labelled block wrapping a table/list; hidden when empty. */
function ReportBlock({ title, count, children }) {
  return (
    <div style={{ marginTop: SP.md }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 700, color: MUTED, fontFamily: sans,
        textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs,
      }}>
        {title}{count != null ? ` (${count})` : ''}
      </div>
      {children}
    </div>
  );
}

/** Shared header-row style for the mini report tables. */
const headRow = {
  display: 'flex', gap: SP.sm, padding: `${SP.xs}px ${SP.md}px`,
  background: CARD_HDR, borderBottom: `1px solid ${BORDER2}`,
  fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase',
  letterSpacing: '0.06em', fontFamily: sans,
};
const bodyRow = {
  display: 'flex', gap: SP.sm, padding: `${SP.sm}px ${SP.md}px`,
  borderBottom: `1px solid ${BORDER2}`, fontSize: FS.sm, fontFamily: sans, color: INK,
};
const tableWrap = { border: `1px solid ${BORDER2}`, overflow: 'hidden' };

export default function AiPricingResyncPanel() {
  // This panel is lazy, so the live read never enters the first-paint graph.
  const aiPricing = useLivePricing();

  const [dryRun, setDryRun] = useState(true);   // safe default: preview, don't write
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [report, setReport] = useState(null);

  // Nightly auto-resync (migration 115): status + toggle. Fetched on mount.
  const [cron, setCron] = useState(null);
  const [cronBusy, setCronBusy] = useState(false);
  const [cronError, setCronError] = useState(null);

  const fetchCronStatus = useCallback(async () => {
    setCronError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'ai_pricing_cron_status' },
      });
      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);
      setCron(data || null);
    } catch (e) {
      setCronError(e?.message || 'Could not load the nightly schedule status.');
    }
  }, []);

  // Status-load effect: fetchCronStatus() clears the error + sets cron on mount.
  // Intentional (same shape as AdminAnalyticsPanel's load effect).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchCronStatus(); }, [fetchCronStatus]);

  const toggleCron = useCallback(async () => {
    if (!cron) return;
    setCronBusy(true); setCronError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'ai_pricing_cron_set', enabled: !cron.enabled },
      });
      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);
      await fetchCronStatus();
    } catch (e) {
      setCronError(e?.message || 'Could not update the nightly schedule.');
    } finally {
      setCronBusy(false);
    }
  }, [cron, fetchCronStatus]);

  const runResync = useCallback(async () => {
    setBusy(true); setError(null);
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('admin-actions', {
        body: { action: 'ai_pricing_resync', dryRun },
      });
      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);
      setReport(data || null);
    } catch (e) {
      setError(e?.message || 'Resync failed.');
    } finally {
      setBusy(false);
    }
  }, [dryRun]);

  return (
    // Flat by design: the parent <Section> already frames this as a card with a
    // heading + body padding, so a self-framed card here would double the box.
    <section aria-label="AI pricing resync">
      {/* Nightly auto-resync (migration 115): status + kill-switch toggle. The
          real schedule is a pg_cron job; this block reflects + toggles it. */}
      <div aria-label="Nightly auto-resync" style={{
        padding: SP.md, marginBottom: SP.md,
        background: CARD_HDR, border: `1px solid ${BORDER2}`,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SP.md }}>
          <span style={{
            fontSize: FS.xs, fontWeight: 700, color: MUTED, fontFamily: sans,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Nightly auto-resync
          </span>
          {cron && (
            <span style={{
              fontSize: FS.xxs, fontWeight: 700, fontFamily: sans,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              padding: `2px ${SP.xs}px`,
              color: cron.enabled ? GREEN : MUTED,
              border: `1px solid ${cron.enabled ? GREEN : BORDER2}`,
            }}>
              {cron.enabled ? 'Enabled' : 'Disabled'}
            </span>
          )}
          {cron && (
            <Button variant="ghost" size="sm" onClick={toggleCron} disabled={cronBusy} busy={cronBusy}>
              {cron.enabled ? 'Disable' : 'Enable'}
            </Button>
          )}
        </div>

        {cronError && (
          <p role="alert" style={{ fontSize: FS.sm, color: RED, fontFamily: sans, marginTop: SP.xs }}>{cronError}</p>
        )}

        {cron && (
          <div style={{ marginTop: SP.sm, fontSize: FS.sm, color: BODY, fontFamily: sans, lineHeight: 1.7 }}>
            {cron.configured ? (
              <div>
                Runs at midnight {cron.timezone} · DST-safe. Credit costs{' '}
                {cron.applyCreditCosts ? 'are recalibrated' : 'are left unchanged (price book only)'}.
              </div>
            ) : (
              <div style={{ color: MUTED }}>
                Not configured. An operator must set the function url and secret once via service-role SQL (see migration 115's header) before the nightly job can dispatch.
              </div>
            )}
            <div style={{ color: MUTED }}>
              Last dispatched: <strong style={{ color: INK }}>{cron.lastDispatchedOn || 'never'}</strong>
            </div>
            {cron.lastRun ? (
              <div style={{ color: cron.lastRun.ok ? BODY : RED }}>
                Last run: {cron.lastRun.ok ? 'ok' : 'failed'} · {formatUpdatedAt(cron.lastRun.at)}
                {cron.lastRun.ok && cron.lastRun.summary ? (
                  <> · {cron.lastRun.summary.priceChanges ?? 0} price · {cron.lastRun.summary.creditChanges ?? 0} credit · {cron.lastRun.summary.staleModels ?? 0} stale</>
                ) : null}
                {!cron.lastRun.ok && cron.lastRun.error ? <> · {cron.lastRun.error}</> : null}
              </div>
            ) : (
              <div style={{ color: MUTED }}>Last run: never</div>
            )}
            {cron.lastRun?.ok && cron.lastRun.summary?.warnings?.length > 0 && (
              <ul style={{ margin: `${SP.xs}px 0 0`, paddingLeft: SP.lg, fontSize: FS.xs, color: RED, fontFamily: sans }}>
                {cron.lastRun.summary.warnings.map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Last-updated + controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SP.md, marginBottom: SP.md }}>
        <span style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
          Schedule last updated:{' '}
          <strong style={{ color: INK }}>{formatUpdatedAt(aiPricing?.updatedAt)}</strong>
        </span>
        <label htmlFor="ai-pricing-dry-run" style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, fontSize: FS.sm, color: BODY, fontFamily: sans, cursor: 'pointer' }}>
          <input
            id="ai-pricing-dry-run"
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            aria-label="Dry run (preview without writing)"
          />
          Dry run (preview only)
        </label>
        <Button variant="gold" size="sm" onClick={runResync} disabled={busy} busy={busy}>
          {busy ? 'Resyncing…' : 'Resync AI pricing'}
        </Button>
      </div>

      {error && (
        <p role="alert" style={{ fontSize: FS.sm, color: RED, fontFamily: sans }}>{error}</p>
      )}

      {report && (
        <div aria-label="Resync report">
          {/* Run banner: dry-run vs applied, plus the usage window covered. */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SP.md,
            padding: SP.md, marginBottom: SP.sm,
            background: CARD_HDR, border: `1px solid ${BORDER2}`,
          }}>
            <span style={{
              fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              color: report.dryRun ? GOLD_TXT : GREEN,
            }}>
              {report.dryRun ? 'Dry run (nothing written)' : 'Applied'}
            </span>
            <span style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
              Updated: <strong style={{ color: INK }}>{formatUpdatedAt(report.updatedAt)}</strong>
            </span>
            {report.usage && (
              <span style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
                Window {report.usage.windowDays}d · {report.usage.totalRuns} runs · {report.usage.profilesCovered} profiles
              </span>
            )}
          </div>

          {/* Credit changes — the headline: old → new per profile/feature. */}
          {report.creditChanges?.length > 0 && (
            <ReportBlock title="Credit changes" count={report.creditChanges.length}>
              <div style={tableWrap} role="table" aria-label="Credit changes">
                <div style={headRow} role="row">
                  <span role="columnheader" style={{ flex: 2 }}>Profile</span>
                  <span role="columnheader" style={{ flex: 1 }}>Feature</span>
                  <span role="columnheader" style={{ flex: 1, textAlign: 'right' }}>Old → New</span>
                  <span role="columnheader" style={{ flex: 1, textAlign: 'right' }}>Recommended</span>
                  <span role="columnheader" style={{ flex: 1, textAlign: 'right' }}>Runs</span>
                </div>
                {report.creditChanges.map((c, i) => (
                  <div key={`${c.profile}-${c.feature}-${i}`} style={bodyRow} role="row">
                    <span role="cell" style={{ flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.profile}</span>
                    <span role="cell" style={{ flex: 1, color: MUTED }}>{c.feature}</span>
                    <span role="cell" style={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>
                      {c.old} <span style={{ color: MUTED }}>→</span> <span style={{ color: c.new > c.old ? RED : GREEN }}>{c.new}</span>
                    </span>
                    <span role="cell" style={{ flex: 1, textAlign: 'right', color: MUTED }}>{c.recommended ?? '–'}</span>
                    <span role="cell" style={{ flex: 1, textAlign: 'right', color: MUTED }}>{c.runs ?? '–'}</span>
                  </div>
                ))}
              </div>
            </ReportBlock>
          )}

          {/* Price changes — provider list-price movements per profile/field. */}
          {report.priceChanges?.length > 0 && (
            <ReportBlock title="Price changes" count={report.priceChanges.length}>
              <div style={tableWrap} role="table" aria-label="Price changes">
                <div style={headRow} role="row">
                  <span role="columnheader" style={{ flex: 2 }}>Profile</span>
                  <span role="columnheader" style={{ flex: 1 }}>Field</span>
                  <span role="columnheader" style={{ flex: 1, textAlign: 'right' }}>Old → New</span>
                </div>
                {report.priceChanges.map((c, i) => (
                  <div key={`${c.profile}-${c.field}-${i}`} style={bodyRow} role="row">
                    <span role="cell" style={{ flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.profile}</span>
                    <span role="cell" style={{ flex: 1, color: MUTED }}>{c.field}</span>
                    <span role="cell" style={{ flex: 1, textAlign: 'right' }}>
                      {String(c.old)} <span style={{ color: MUTED }}>→</span> {String(c.new)}
                    </span>
                  </div>
                ))}
              </div>
            </ReportBlock>
          )}

          {/* Low-data profile×feature groups (kept at current cost). */}
          {report.lowData?.length > 0 && (
            <ReportBlock title="Low data (unchanged)" count={report.lowData.length}>
              <div style={{ fontSize: FS.sm, color: BODY, fontFamily: sans, lineHeight: 1.6 }}>
                {report.lowData.map((d, i) => (
                  <span key={`${d.profile}-${d.feature}-${i}`} style={{ display: 'inline-block', marginRight: SP.md }}>
                    {d.profile}/{d.feature} ({d.runs} runs)
                  </span>
                ))}
              </div>
            </ReportBlock>
          )}

          {/* Stale models — a provider fetch that didn't refresh the price. */}
          {report.staleModels?.length > 0 && (
            <ReportBlock title="Stale models" count={report.staleModels.length}>
              <div style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
                {report.staleModels.join(', ')}
              </div>
            </ReportBlock>
          )}

          {/* Candidate models parsed from a provider but outside the 8 profiles. */}
          {report.candidates?.length > 0 && (
            <ReportBlock title="Candidate models" count={report.candidates.length}>
              <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.6 }}>
                {report.candidates.map((c, i) => (
                  <span key={`${c.modelId}-${i}`} style={{ display: 'inline-block', marginRight: SP.md }}>
                    {candidateProvider(c.modelId)}/{c.modelId}
                  </span>
                ))}
              </div>
            </ReportBlock>
          )}

          {/* Profile models a successful provider fetch didn't return. */}
          {report.missingFromProvider?.length > 0 && (
            <ReportBlock title="Missing from provider" count={report.missingFromProvider.length}>
              <div style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
                {report.missingFromProvider.join(', ')}
              </div>
            </ReportBlock>
          )}

          {/* Merge / fetch warnings surfaced by the guard layer. */}
          {report.warnings?.length > 0 && (
            <ReportBlock title="Warnings" count={report.warnings.length}>
              <ul style={{ margin: 0, paddingLeft: SP.lg, fontSize: FS.sm, color: RED, fontFamily: sans, lineHeight: 1.6 }}>
                {report.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </ReportBlock>
          )}

          {/* Nothing moved — an honest empty-state so a clean run doesn't read
              as a failed one. */}
          {!report.creditChanges?.length && !report.priceChanges?.length && (
            <p style={{ fontSize: FS.sm, color: BODY, fontFamily: sans, marginTop: SP.md }}>
              No price or credit changes. The schedule is already calibrated for the current window.
            </p>
          )}
        </div>
      )}

      {!report && !error && (
        <p style={{ fontSize: FS.sm, color: BODY, fontFamily: sans }}>
          Run a dry run to preview how usage cost would move the per-model credit schedule. Uncheck dry run to apply.
        </p>
      )}
    </section>
  );
}
