/**
 * AccountAutoReloadPanel.jsx — AI-credit auto-reload controls (DESIGN_MONEY_WAVE
 * §4.6 / #13) in the account Subscription section, beside Past purchases.
 *
 * Self-fetching + component-local (the FounderTile / Past-purchases idiom): reads
 * settings + status through owner-SELECT RLS via a LAZY import of
 * lib/autoReloadClient.js, so this panel + its data layer add ZERO eager bytes.
 * FLAT MATERIALS (kill-list): rule-framed rows, no rounded corners / shadows /
 * rgba washes / tinted callouts.
 */
import { useCallback, useEffect, useState } from 'react';
import Section from './AccountSection.jsx';
import Button from '../primitives/Button.jsx';
import AvailableAtLaunchPill from '../primitives/AvailableAtLaunchPill.jsx';
import { purchasesOpen } from '../../lib/launchGate.js';
import { INK, BODY, MUTED, SECOND, BORDER, sans, SP, FS, swatch } from '../theme.js';
import { AUTO_RELOAD_DEFAULTS, AUTO_RELOAD_LIMITS } from '../../lib/autoReloadClient.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

const clampInt = (v, min, max, dflt) => {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return dflt;
  return Math.max(min, Math.min(max, n));
};

// Wrapper is a computed tag (the PrefRow idiom) so the deprecated label-has-for
// rule doesn't false-positive on the cross-boundary nested control; the visible
// label is a real <label htmlFor> tied to the id-carrying input nested in children.
function Row({ label, htmlFor, children }) {
  const Wrapper = htmlFor ? 'label' : 'div';
  return (
    <Wrapper
      htmlFor={htmlFor}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.md, padding: `${SP.sm}px 0`, borderBottom: `1px solid ${BORDER}`, cursor: 'pointer' }}
    >
      <span style={{ fontSize: FS.sm, color: INK, fontWeight: 600 }}>{label}</span>
      <span style={{ flexShrink: 0 }}>{children}</span>
    </Wrapper>
  );
}

const numInputStyle = { width: 84, padding: `${SP.xs}px ${SP.sm}px`, border: `1px solid ${BORDER}`, background: 'transparent', color: INK, fontFamily: sans, fontSize: FS.sm, textAlign: 'right' };

export default function AccountAutoReloadPanel({ auth }) {
  const mobile = useIsMobile();
  const signedIn = Boolean(auth?.user?.id);
  // THE LAUNCH GATE (lib/launchGate.js), ONE-WAY: enabling auto-reload authorises future
  // card charges, so it stays locked with the pill until launch; but turning an existing
  // auto-reload OFF is never a purchase, so an account whose stored setting is on can
  // still untick it and save that (and only that) while purchases are closed.
  const purchasesAreOpen = purchasesOpen();
  const [storedEnabled, setStoredEnabled] = useState(false);
  const [form, setForm] = useState(null);        // null = loading
  const [status, setStatus] = useState({ thisMonthSpentCents: 0, openAttempt: null });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const { fetchAutoReloadSettings, fetchAutoReloadStatus } = await import('../../lib/autoReloadClient.js');
    const [s, st] = await Promise.all([fetchAutoReloadSettings(), fetchAutoReloadStatus()]);
    return { s, st };
  }, []);

  useEffect(() => {
    if (!signedIn) return undefined;
    let alive = true;
    (async () => {
      try {
        const { s, st } = await load();
        if (!alive) return;
        setForm({ enabled: s.enabled, thresholdCredits: s.thresholdCredits, targetCredits: s.targetCredits, capDollars: Math.round(s.monthlyCapCents / 100) });
        setStoredEnabled(Boolean(s.enabled));
        setStatus(st);
      } catch {
        if (alive) setForm({ ...AUTO_RELOAD_DEFAULTS, capDollars: Math.round(AUTO_RELOAD_DEFAULTS.monthlyCapCents / 100) });
      }
    })();
    return () => { alive = false; };
  }, [signedIn, load]);

  const patch = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };

  // While closed, the only save allowed is the one that turns a stored auto-reload OFF.
  const turningOff = Boolean(form) && storedEnabled && !form.enabled;
  const saveLocked = !purchasesAreOpen && !turningOff;

  const handleSave = useCallback(async () => {
    if (!form || saving) return;
    if (!purchasesOpen() && !(storedEnabled && !form.enabled)) return;
    setSaving(true); setError(null); setSaved(false);
    const thresholdCredits = clampInt(form.thresholdCredits, AUTO_RELOAD_LIMITS.threshold.min, AUTO_RELOAD_LIMITS.threshold.max, AUTO_RELOAD_DEFAULTS.thresholdCredits);
    let targetCredits = clampInt(form.targetCredits, AUTO_RELOAD_LIMITS.target.min, AUTO_RELOAD_LIMITS.target.max, AUTO_RELOAD_DEFAULTS.targetCredits);
    if (targetCredits <= thresholdCredits) targetCredits = thresholdCredits + 1;
    const capCents = clampInt(form.capDollars, AUTO_RELOAD_LIMITS.capCents.min / 100, AUTO_RELOAD_LIMITS.capCents.max / 100, AUTO_RELOAD_DEFAULTS.monthlyCapCents / 100) * 100;
    try {
      const { saveAutoReloadSettings } = await import('../../lib/autoReloadClient.js');
      await saveAutoReloadSettings({ enabled: form.enabled, thresholdCredits, targetCredits, monthlyCapCents: capCents });
      setStoredEnabled(Boolean(form.enabled));
      setForm((f) => ({ ...f, thresholdCredits, targetCredits, capDollars: Math.round(capCents / 100) }));
      setSaved(true);
      const st = await (await import('../../lib/autoReloadClient.js')).fetchAutoReloadStatus();
      setStatus(st);
    } catch (e) {
      setError(e?.message || 'Could not save auto-reload settings.');
    } finally {
      setSaving(false);
    }
  }, [form, saving, storedEnabled]);

  if (!signedIn) return null;

  return (
    <Section title="Automatic credit reload">
      {form === null ? (
        <div style={{ fontSize: FS.sm, color: MUTED, padding: `${SP.sm}px 0` }}>Loading…</div>
      ) : (
        <div>
          <p style={{ fontSize: proseFontSize(FS.xs, mobile), color: BODY, lineHeight: 1.5, margin: `0 0 ${SP.sm}px` }}>
            When your balance falls below the threshold we top it back up to your target and charge
            your saved card. Off by default. To save or change a card, buy a credit pack with the
            &ldquo;save my card&rdquo; box checked, or use the billing portal above.
          </p>

          <Row
            label={<>Enable auto-reload{!purchasesAreOpen && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}</>}
            htmlFor="ar-enabled"
          >
            <input
              id="ar-enabled"
              type="checkbox"
              aria-label="Enable auto-reload"
              checked={form.enabled}
              disabled={!purchasesAreOpen && !form.enabled && !storedEnabled}
              onChange={(e) => patch('enabled', e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
          </Row>
          <Row label="When balance falls below (credits)" htmlFor="ar-threshold">
            <input id="ar-threshold" type="number" inputMode="numeric" aria-label="When balance falls below (credits)"
              min={AUTO_RELOAD_LIMITS.threshold.min} max={AUTO_RELOAD_LIMITS.threshold.max}
              value={form.thresholdCredits} onChange={(e) => patch('thresholdCredits', e.target.value)}
              style={numInputStyle} />
          </Row>
          <Row label="Top up to (credits)" htmlFor="ar-target">
            <input id="ar-target" type="number" inputMode="numeric" aria-label="Top up to (credits)"
              min={AUTO_RELOAD_LIMITS.target.min} max={AUTO_RELOAD_LIMITS.target.max}
              value={form.targetCredits} onChange={(e) => patch('targetCredits', e.target.value)}
              style={numInputStyle} />
          </Row>
          <Row label="Monthly spending cap ($)" htmlFor="ar-cap">
            <input id="ar-cap" type="number" inputMode="numeric" aria-label="Monthly spending cap in dollars"
              min={AUTO_RELOAD_LIMITS.capCents.min / 100} max={AUTO_RELOAD_LIMITS.capCents.max / 100}
              value={form.capDollars} onChange={(e) => patch('capDollars', e.target.value)}
              style={numInputStyle} />
          </Row>

          <div style={{ fontSize: proseFontSize(FS.xs, mobile), color: MUTED, marginTop: SP.sm, lineHeight: 1.6 }}>
            <div>This month so far: ${(status.thisMonthSpentCents / 100).toFixed(2)} of ${form.capDollars}.00</div>
            {status.openAttempt && (
              <div style={{ paddingLeft: SP.md, borderLeft: `3px solid ${status.openAttempt.state === 'requires_action' ? swatch.danger : SECOND}`, marginTop: SP.xs }}>
                {status.openAttempt.state === 'requires_action'
                  ? `A reload of ${status.openAttempt.creditsDelta} credits needs card verification. Buy that pack on-session to complete it.`
                  : `A reload of ${status.openAttempt.creditsDelta} credits is in progress.`}
              </div>
            )}
          </div>

          {error && (
            <div role="alert" style={{ paddingLeft: SP.md, borderLeft: `3px solid ${swatch.danger}`, fontSize: FS.sm, color: swatch.danger, marginTop: SP.sm, lineHeight: 1.5 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: SP.md, marginTop: SP.md }}>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saveLocked || saving}
              style={saveLocked ? { flexWrap: 'wrap' } : undefined}>
              {saving ? 'Saving…' : 'Save auto-reload'}
              {saveLocked && <AvailableAtLaunchPill style={{ marginLeft: 6 }} />}
            </Button>
            {saved && <span role="status" style={{ fontSize: chromeFontSize(FS.xs, mobile), color: swatch.success }}>Saved.</span>}
          </div>
        </div>
      )}
    </Section>
  );
}
