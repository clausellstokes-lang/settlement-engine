/**
 * Reusable deliberate-confirmation dialog for high-impact admin actions.
 *
 * The client ceremony is not the authority boundary: it reauthenticates the
 * operator so GoTrue mints a fresh password AMR, then sends the exact text the
 * server guard independently verifies. Account actions expect a user id;
 * broadcasts expect the closed literal SEND TO ALL.
 */
import { useEffect, useId, useState } from 'react';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
import { INK, MUTED, RED, BORDER, sans, SP, FS, swatch } from '../theme.js';

export default function AdminTwoKeyDialog({ config, onCancel, onConfirmed }) {
  const [typedText, setTypedText] = useState('');
  const [password, setPassword] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const valueId = useId();
  const textId = useId();
  const passwordId = useId();

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- a new high-impact action must never inherit confirmation credentials */
    setTypedText('');
    setPassword('');
    setValue('');
    setError(null);
    setBusy(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [config]);

  const expectedText = config?.expectedText || '';
  const typedMatches = typedText.trim() === expectedText;

  const submit = async () => {
    if (!config || !typedMatches) return;
    let parsedValue;
    if (config.parseValue) {
      parsedValue = config.parseValue(value);
      if (parsedValue == null) {
        setError(config.valueHint || 'Enter a valid value.');
        return;
      }
    }
    setBusy(true);
    setError(null);
    try {
      const { reauthenticateWithPassword } = await import('../../lib/authSecurity.js');
      await reauthenticateWithPassword(password);
      await onConfirmed?.({
        typedText: typedText.trim(),
        parsedValue,
        config,
      });
    } catch (err) {
      setError(err?.message || 'Re-authentication failed. Please check your password.');
      setBusy(false);
    }
  };

  return (
    <ConfirmDialog
      open={!!config}
      heading={config?.title || ''}
      body={config?.body}
      confirmLabel={config?.confirmLabel || 'Confirm'}
      tone="danger"
      confirmDisabled={!config || busy || !typedMatches || !password}
      onCancel={() => { if (!busy) onCancel?.(); }}
      onConfirm={submit}
      extra={config && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm, marginBottom: SP.md }}>
          {config.valueLabel && (
            <label htmlFor={valueId} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: FS.xs, fontWeight: 700, color: MUTED, fontFamily: sans }}>
              {config.valueLabel}
              <input
                id={valueId}
                aria-label={config.valueLabel}
                value={value}
                onChange={(event) => setValue(event.target.value)}
                style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, fontSize: FS.sm, fontFamily: sans, background: swatch.white, color: INK }}
              />
            </label>
          )}
          <label htmlFor={textId} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: FS.xs, fontWeight: 700, color: MUTED, fontFamily: sans }}>
            {config.confirmationLabel || `Retype the account id (${expectedText})`}
            <input
              id={textId}
              aria-label={config.confirmationAriaLabel || 'Retype the account id'}
              value={typedText}
              onChange={(event) => setTypedText(event.target.value)}
              autoComplete="off"
              // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the first confirmation field when the modal opens
              autoFocus
              style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, fontSize: FS.sm, fontFamily: sans, background: swatch.white, color: INK }}
            />
          </label>
          <label htmlFor={passwordId} style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: FS.xs, fontWeight: 700, color: MUTED, fontFamily: sans }}>
            Your account password
            <input
              id={passwordId}
              aria-label="Your account password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              style={{ padding: `${SP.sm}px ${SP.md}px`, border: `1px solid ${BORDER}`, fontSize: FS.sm, fontFamily: sans, background: swatch.white, color: INK }}
            />
          </label>
          {error && <p role="alert" style={{ margin: 0, fontSize: FS.sm, color: RED, fontFamily: sans }}>{error}</p>}
        </div>
      )}
    />
  );
}
