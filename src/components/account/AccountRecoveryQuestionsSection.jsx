/**
 * AccountRecoveryQuestionsSection.jsx — "Account recovery questions" section of
 * the Account page.
 *
 * The durable, honest home for security-question enrollment. At sign-up the
 * answers are captured best-effort by a deferred polling write that only lands
 * if the original window stays open through email confirmation — so OAuth
 * sign-ups, confirmations elsewhere, and closed windows leave an account with
 * NO recovery questions, locked out of the only self-service forgot-password
 * path. This signed-in section lets any account SET or REPLACE its two
 * questions at will, and shows whether they are currently set.
 *
 * Security: the raw answers are passed straight to the set-answers store action
 * (which wraps the bcrypt-hashing RPC) and never persisted client-side — no
 * localStorage, no store-persist. Status is read from get_my_security_question_ids,
 * which returns only the question ids, never the hash.
 */
import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { securityQuestionText } from '../../data/securityQuestions.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import {
  INK, BODY, MUTED, BORDER, GOLD_TXT, SP, R, FS, swatch,
  DANGER_BORDER, SUCCESS_BORDER, TINT_GOLD,
} from '../theme.js';
import Section from './AccountSection.jsx';
import SecurityQuestionsFields from '../auth/SecurityQuestionsFields.jsx';

function ErrorBanner({ children }) {
  return (
    <div role="alert" style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.dangerBg, border: `1px solid ${DANGER_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.danger }}>
      {children}
    </div>
  );
}

function OkBanner({ children }) {
  return (
    <div style={{ padding: `${SP.sm}px ${SP.md}px`, background: swatch.successBg, border: `1px solid ${SUCCESS_BORDER}`, borderRadius: R.md, fontSize: FS.sm, color: swatch.success }}>
      {children}
    </div>
  );
}

export default function AccountRecoveryQuestionsSection() {
  const authSetSecurityAnswers = useStore(s => s.authSetSecurityAnswers);
  const authGetSecurityQuestionIds = useStore(s => s.authGetSecurityQuestionIds);

  // Current status. `null` while loading; an array (possibly empty) once read.
  const [current, setCurrent] = useState(null);

  // Edit form state. The four values mirror the sign-up capture; they are never
  // persisted anywhere but the hashing RPC, and are cleared on save/cancel.
  const [editing, setEditing] = useState(false);
  const [q1, setQ1] = useState('');
  const [a1, setA1] = useState('');
  const [q2, setQ2] = useState('');
  const [a2, setA2] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.resolve(authGetSecurityQuestionIds?.())
      .then((list) => { if (alive) setCurrent(Array.isArray(list) ? list : []); })
      .catch(() => { if (alive) setCurrent([]); });
    return () => { alive = false; };
  }, [authGetSecurityQuestionIds]);

  const hasQuestions = Array.isArray(current) && current.length > 0;

  // Drop a colliding second pick so the two questions can never be equal (the
  // second <select> also excludes the first; this guards the change-after case).
  const chooseQ1 = (next) => {
    setQ1(next);
    if (next && next === q2) setQ2('');
  };

  const complete =
    Boolean(q1) && Boolean(q2) && q1 !== q2 && a1.trim() !== '' && a2.trim() !== '';

  const resetForm = () => {
    setQ1(''); setA1(''); setQ2(''); setA2('');
    setError(null);
  };

  const handleEdit = () => {
    resetForm();
    setDone(false);
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    resetForm();
  };

  const handleSave = async () => {
    setError(null);
    if (!complete) {
      setError(t('auth.security.error.bothRequired'));
      return;
    }
    setBusy(true);
    try {
      // Raw answers go straight to the hashing RPC; nothing sensitive is kept.
      await authSetSecurityAnswers({ q1, a1: a1.trim(), q2, a2: a2.trim() });
      const list = await authGetSecurityQuestionIds();
      setCurrent(Array.isArray(list) ? list : []);
      setEditing(false);
      resetForm();
      setDone(true);
    } catch {
      setError(t('auth.security.account.saveError'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title={t('auth.security.account.heading')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
        <p style={{ fontSize: FS.sm, color: BODY, margin: 0, lineHeight: 1.5 }}>
          {t('auth.security.account.prose')}
        </p>

        {done && <OkBanner>{t('auth.security.account.saved')}</OkBanner>}

        {/* Gentle, non-blocking nudge: shown only when no questions are set and
            the user has not already opened the editor. Calm callout, not a
            warning — it points to the set control directly below. */}
        {hasQuestions === false && !editing && !done && (
          <div style={{
            padding: `${SP.sm}px ${SP.md}px`, background: TINT_GOLD,
            border: `1px solid ${BORDER}`, borderRadius: R.md,
            fontSize: FS.sm, color: GOLD_TXT, lineHeight: 1.5,
          }}>
            {t('auth.security.account.nudge')}
          </div>
        )}

        {/* Status — set / not set, with the current questions listed when set. */}
        {current === null ? (
          <div style={{ fontSize: FS.sm, color: BODY }}>Loading…</div>
        ) : (
          <div style={{ fontSize: FS.sm, color: INK, fontWeight: 600 }}>
            {hasQuestions
              ? t('auth.security.account.statusSet')
              : t('auth.security.account.statusNotSet')}
          </div>
        )}

        {hasQuestions && !editing && (
          <div>
            <div style={{ fontSize: FS.xs, fontWeight: 700, color: MUTED, marginBottom: SP.xs }}>
              {t('auth.security.account.currentLabel')}
            </div>
            <ul style={{ margin: 0, paddingLeft: SP.lg, display: 'flex', flexDirection: 'column', gap: SP.xs }}>
              {current.map((row) => (
                <li key={row.slot} style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
                  {securityQuestionText(row.questionId) || row.questionId}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!editing ? (
          <div>
            <Button variant="secondary" size="md" onClick={handleEdit}>
              {hasQuestions
                ? t('auth.security.account.replace')
                : t('auth.security.account.edit')}
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md, borderTop: `1px solid ${BORDER}`, paddingTop: SP.md }}>
            {error && <ErrorBanner>{error}</ErrorBanner>}
            <SecurityQuestionsFields
              q1={q1} a1={a1} q2={q2} a2={a2}
              setQ1={chooseQ1} setA1={setA1} setQ2={setQ2} setA2={setA2}
            />
            <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap' }}>
              <Button variant="primary" size="md" busy={busy} disabled={!complete} onClick={handleSave} icon={<Check size={14} />}>
                {busy ? t('auth.security.account.saving') : t('auth.security.account.save')}
              </Button>
              <Button variant="ghost" size="md" disabled={busy} onClick={handleCancel}>
                {t('auth.security.account.cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
