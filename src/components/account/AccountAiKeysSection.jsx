/**
 * AccountAiKeysSection.jsx — the BYOK MANAGEMENT SURFACE (owner commission #29).
 *
 * One account section that lets a Surveyor member: pick a provider and paste their key
 * (prefix hint-warnings only); VERIFY it by a real test-call (never shown healthy until
 * a real ping succeeds); choose a model per task class from the key's own list-models ∩
 * the adapter set (each labelled with its §3e retention class); see a persistent
 * key-health status with a last-verified stamp; set daily/weekly usage caps (tokens or
 * estimated-$), a warn threshold, and a PAUSE switch; and open a lazy usage dashboard.
 *
 * The key plaintext exists in the browser only for the paste→save instant, travels to
 * the encrypted vault, and is never read back or logged. This whole tree rides the lazy
 * AccountPage chunk (zero first-paint bytes); the dashboard is a further lazy split.
 */
import { Suspense, lazy, useEffect, useState } from 'react';
import { useAccountSurveyorGate } from './useAccountSurveyorGate.js';
import { INK, BODY, MUTED, BORDER, CARD, GOLD, GREEN, RED, AMBER, CARD_ALT, SP, R, FS, sans, serif_, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import {
  keyPrefixHint, getByokStatus, setByokKey, clearByokKey, verifyByokKey,
  getSurveyorSettings, setSurveyorSettings,
} from '../../lib/surveyorByok.js';

const AiUsageDashboard = lazy(() => import('./AiUsageDashboard.jsx'));

const PROVIDER = 'anthropic';
const TASK_CLASSES = [
  { id: 'analysis', label: 'Analyst answers' },
  { id: 'brief', label: 'Briefs' },
];

/** Perceivable status chip for each health state. */
function healthMeta(health) {
  switch (health) {
    case 'healthy':       return { label: 'Healthy', color: GREEN, bg: 'transparent' };
    case 'out_of_credit': return { label: 'Out of credit', color: AMBER, bg: 'transparent' };
    case 'invalid':       return { label: 'Invalid or expired', color: RED, bg: 'transparent' };
    case 'rate_limited':  return { label: 'Rate-limited', color: AMBER, bg: 'transparent' };
    case 'down':          return { label: 'Provider unavailable', color: MUTED, bg: CARD_ALT };
    default:              return { label: 'Not verified', color: MUTED, bg: CARD_ALT };
  }
}

const inputStyle = { padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, fontSize: FS.sm, fontFamily: sans, color: INK, background: '#fff', width: '100%', boxSizing: 'border-box' };
const labelStyle = { fontSize: FS.xs, color: MUTED, fontFamily: sans, marginBottom: 2 };
const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : '–');

export default function AccountAiKeysSection() {
  // Defense-in-depth: the BYOK surface is Surveyor-gated (owner ruling
  // 2026-07-19). AccountPage already hides the nav tab + section render for
  // non-entitled accounts; this guard makes the component itself refuse to
  // render if it is ever mounted directly, so the discriminator can't leak.
  const surveyorEntitled = useAccountSurveyorGate();
  const [statusRow, setStatusRow] = useState(null); // the anthropic byok status row, or null
  const [settings, setSettings] = useState(null);
  const [keyInput, setKeyInput] = useState('');
  const [busy, setBusy] = useState(null);           // 'save' | 'verify' | 'remove' | 'model' | 'caps' | 'pause'
  const [verify, setVerify] = useState(null);       // last verify result { ok, health, models?, message? }
  const [error, setError] = useState(null);
  const [showUsage, setShowUsage] = useState(false);
  const [caps, setCaps] = useState({ daily_token_cap: '', weekly_token_cap: '', daily_usd_cap: '', weekly_usd_cap: '', warn_pct: '80' });

  const refreshStatus = async () => {
    const rows = await getByokStatus(PROVIDER).catch(() => []);
    setStatusRow(rows.find((r) => r.provider === PROVIDER) || null);
  };
  const loadSettings = async () => {
    const s = await getSurveyorSettings().catch(() => null);
    setSettings(s);
    if (s) {
      setCaps({
        daily_token_cap: s.daily_token_cap ?? '',
        weekly_token_cap: s.weekly_token_cap ?? '',
        daily_usd_cap: s.daily_usd_cap ?? '',
        weekly_usd_cap: s.weekly_usd_cap ?? '',
        warn_pct: String(s.warn_pct ?? 80),
      });
    }
  };

  useEffect(() => { (async () => { await refreshStatus(); await loadSettings(); })(); }, []);

  // Surveyor-gate the whole surface (after the hooks, so hook order is stable).
  if (!surveyorEntitled) return null;

  const hint = keyPrefixHint(PROVIDER, keyInput);
  const health = verify?.health || statusRow?.health || 'unverified';
  const hm = healthMeta(health);
  const hasKey = !!statusRow?.has_key || !!keyInput;
  const models = verify?.models || [];
  const modelPrefs = settings?.model_prefs || {};

  const run = async (name, fn) => {
    setBusy(name); setError(null);
    try { await fn(); }
    catch (e) { setError(e.message || 'Something went wrong.'); }
    finally { setBusy(null); }
  };

  const handleSaveAndVerify = () => run('save', async () => {
    await setByokKey(PROVIDER, keyInput.trim());
    setKeyInput('');
    const res = await verifyByokKey(PROVIDER);
    setVerify(res);
    await refreshStatus();
  });

  const handleVerify = () => run('verify', async () => {
    const res = await verifyByokKey(PROVIDER);
    setVerify(res);
    await refreshStatus();
  });

  const handleRemove = () => run('remove', async () => {
    await clearByokKey(PROVIDER);
    setVerify(null);
    await refreshStatus();
  });

  const handlePickModel = (task, modelId) => run('model', async () => {
    const next = await setSurveyorSettings({ model_prefs: { ...modelPrefs, [task]: modelId } });
    setSettings(next);
  });

  const handleSaveCaps = () => run('caps', async () => {
    const num = (v) => (v === '' || v == null ? 0 : Number(v));
    const next = await setSurveyorSettings({
      daily_token_cap: num(caps.daily_token_cap),
      weekly_token_cap: num(caps.weekly_token_cap),
      daily_usd_cap: num(caps.daily_usd_cap),
      weekly_usd_cap: num(caps.weekly_usd_cap),
      warn_pct: Math.min(100, Math.max(1, Number(caps.warn_pct) || 80)),
    });
    setSettings(next);
    await loadSettings();
  });

  const handleTogglePause = (paused) => run('pause', async () => {
    const next = await setSurveyorSettings({ paused });
    setSettings(next);
  });

  const paused = !!settings?.paused;

  return (
    // Inline card matching AccountSection's default tone. The heading is text content,
    // NOT a `title=` prop, so this new section does not grow the shrink-only native
    // title= census (tests/domain/guidanceRegistry.walker.test.js — never-raise ceiling).
    <div style={{ border: `1px solid ${BORDER}`, overflow: 'hidden', background: CARD }}>
      <div style={{ padding: `${SP.md}px ${SP.lg}px` }}>
        <h2 style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, margin: 0 }}>AI provider &amp; keys</h2>
      </div>
      <div style={{ padding: `0 ${SP.lg}px ${SP.lg}px` }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
        <p style={{ fontSize: FS.sm, color: BODY, margin: 0, lineHeight: 1.5 }}>
          Bring your own provider key so Surveyor runs inference on your account. Your key is stored
          encrypted, used only server-side, and never shown again after you save it.
        </p>

        {error && (
          <div role="alert" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch['#FAF8F4'], borderLeft: `3px solid ${swatch.danger}`, fontSize: FS.sm, color: swatch.danger }}>{error}</div>
        )}

        {/* ── Provider + key + verify ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <div>
            <div style={labelStyle}>Provider</div>
            <select aria-label="AI provider" value={PROVIDER} disabled style={{ ...inputStyle, maxWidth: 240 }}>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
          </div>

          <div>
            <div style={labelStyle}>{statusRow?.has_key ? 'Replace key' : 'Paste your key'}</div>
            <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap' }}>
              <input
                type="password" autoComplete="off" spellCheck={false}
                aria-label="Provider API key"
                placeholder="sk-ant-…" value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                style={{ ...inputStyle, flex: '1 1 260px' }}
              />
              <Button variant="primary" size="md" disabled={!keyInput.trim() || busy === 'save'} onClick={handleSaveAndVerify}>
                {busy === 'save' ? 'Saving…' : 'Save & verify'}
              </Button>
            </div>
            {hint && <div style={{ fontSize: FS.xs, color: AMBER, marginTop: 4 }}>{hint}</div>}
          </div>
        </div>

        {/* ── Key-health status ───────────────────────────────────────────────── */}
        {statusRow?.has_key && (
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap', padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, background: CARD_ALT }}>
            <span style={{ padding: `2px ${SP.sm}px`, borderRadius: R.pill || R.md, fontSize: FS.xs, fontWeight: 700, color: hm.color, background: hm.bg, border: `1px solid ${hm.color}` }}>{hm.label}</span>
            <span style={{ fontSize: FS.xs, color: MUTED }}>Last verified: {fmtDate(statusRow?.last_verified_at)}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: SP.sm }}>
              <Button variant="ghost" size="sm" disabled={busy === 'verify'} onClick={handleVerify}>{busy === 'verify' ? 'Verifying…' : 'Verify'}</Button>
              <Button variant="ghost" size="sm" disabled={busy === 'remove'} onClick={handleRemove} style={{ color: RED }}>Remove</Button>
            </div>
            {verify && !verify.ok && verify.message && (
              <div style={{ flexBasis: '100%', fontSize: FS.xs, color: BODY }}>{verify.message}</div>
            )}
          </div>
        )}

        {/* ── Per-task model choice (from the key's models ∩ adapter set) ──────── */}
        {models.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>Model per task</div>
            {TASK_CLASSES.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
                <div style={{ width: 130, fontSize: FS.sm, color: BODY }}>{t.label}</div>
                <select
                  aria-label={`Model for ${t.label}`}
                  value={modelPrefs[t.id] || ''} disabled={busy === 'model'}
                  onChange={(e) => handlePickModel(t.id, e.target.value)}
                  style={{ ...inputStyle, maxWidth: 320 }}
                >
                  <option value="">Default</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>{m.id} · retention: {m.retentionClass}</option>
                  ))}
                </select>
              </div>
            ))}
            <div style={{ fontSize: FS.xs, color: MUTED }}>Retention is your provider’s data-retention posture for that model, shown honestly.</div>
          </div>
        ) : hasKey && (
          <div style={{ fontSize: FS.xs, color: MUTED }}>Verify your key to choose a model per task from the models it can access.</div>
        )}

        {/* ── Usage governors: caps + warn + pause ────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>Usage caps</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: SP.sm }}>
            {[
              ['daily_token_cap', 'Daily tokens'],
              ['weekly_token_cap', 'Weekly tokens'],
              ['daily_usd_cap', 'Daily est-$'],
              ['weekly_usd_cap', 'Weekly est-$'],
              ['warn_pct', 'Warn at %'],
            ].map(([field, label]) => (
              <div key={field}>
                <div style={labelStyle}>{label}</div>
                <input
                  type="number" min="0" inputMode="numeric"
                  aria-label={label}
                  placeholder={field === 'warn_pct' ? '80' : 'uncapped'}
                  value={caps[field]} onChange={(e) => setCaps((c) => ({ ...c, [field]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, flexWrap: 'wrap' }}>
            <Button variant="secondary" size="md" disabled={busy === 'caps'} onClick={handleSaveCaps}>
              {busy === 'caps' ? 'Saving…' : 'Save caps'}
            </Button>
            <label htmlFor="ai-pause-toggle" style={{ display: 'inline-flex', alignItems: 'center', gap: SP.sm, cursor: 'pointer' }}>
              <input id="ai-pause-toggle" aria-label="Pause all AI usage" type="checkbox" checked={paused} disabled={busy === 'pause'} onChange={(e) => handleTogglePause(e.target.checked)} style={{ accentColor: GOLD, width: 18, height: 18 }} />
              <span style={{ fontSize: FS.sm, color: paused ? RED : BODY, fontWeight: paused ? 700 : 400 }}>
                {paused ? 'AI usage is PAUSED' : 'Pause all AI usage'}
              </span>
            </label>
          </div>
          <div style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.5 }}>
            Caps are enforced at the edge before anything runs. Over a cap or paused, a request is
            refused before it costs you (and nothing is charged). Blank fields mean uncapped.
          </div>
        </div>

        {/* ── Usage meter (lazy) ──────────────────────────────────────────────── */}
        <div>
          <Button variant="ghost" size="sm" onClick={() => setShowUsage((v) => !v)}>
            {showUsage ? 'Hide usage' : 'Show usage'}
          </Button>
          {showUsage && (
            <div style={{ marginTop: SP.md }}>
              <Suspense fallback={<div style={{ fontSize: FS.sm, color: BODY }}>Loading usage…</div>}>
                <AiUsageDashboard provider={PROVIDER} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
