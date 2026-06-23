/**
 * components/auth/ForgotPasswordFlow.jsx — the logged-out forgot-password
 * challenge (Auth Phase 2).
 *
 * A self-contained multi-step flow rendered by AuthPanel's `reset` mode. It
 * runs entirely through the `auth-recovery` edge function (service-role,
 * rate-limited, bot-guarded) via the store's authRecoveryLookup /
 * authRecoveryVerify actions. The security-answer hash never reaches the
 * client — step 1 returns only a random question, step 2 a boolean, and the
 * FUNCTION mails the reset link on a correct answer.
 *
 * Steps:
 *   email    — enter an email → lookup. The operator chose reveal-as-described,
 *              so a missing account shows an honest "no account" notice (still
 *              rate-limited server-side). An account with no security question
 *              set shows a calm "cannot recover this way" notice.
 *   question — show the returned random question + an answer field → verify.
 *              ok:true → "check your email"; ok:false → "that did not match"
 *              (the field stays so they can retry, until the server rate-limits).
 *   sent     — terminal success close ("check your email for a reset link").
 *
 * Rate-limit: a coded error from the function (RECOVERY_RATE_LIMITED) swaps in
 * the back-off copy AND disables the verify control so the client stops
 * hammering — the server already throttles, this is the honest UI mirror.
 *
 * Conventions: calm voice via the copy registry, no icons, theme tokens, every
 * control labelled, no raw button elements (the authUI Button/Input wrap the DS
 * primitives), under the 600-line ratchet.
 */
import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { SECOND, FS, SP } from '../theme.js';
import { t } from '../../copy/index.js';
import { securityQuestionText } from '../../data/securityQuestions.js';
import { RECOVERY_RATE_LIMITED } from '../../lib/auth.js';
import Button from '../primitives/Button.jsx';
import { Input, Button as AuthCTAButton, Alert } from './authUI.jsx';

export default function ForgotPasswordFlow({ onBackToSignIn }) {
  const authRecoveryLookup = useStore(s => s.authRecoveryLookup);
  const authRecoveryVerify = useStore(s => s.authRecoveryVerify);

  const [step, setStep] = useState('email'); // 'email' | 'question' | 'sent'
  const [email, setEmail] = useState('');
  const [answer, setAnswer] = useState('');
  // The challenge returned by lookup: which slot + question id to ask. Held so
  // verify can echo the slot back. questionId resolves to display text locally.
  const [slot, setSlot] = useState(null);
  const [questionId, setQuestionId] = useState(null);

  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null); // calm, non-error notice (no account / wrong answer)
  const [loading, setLoading] = useState(false);
  // Once the server rate-limits, lock the verify control: the back-off copy
  // shows and further guesses are pointless until the window resets.
  const [rateLimited, setRateLimited] = useState(false);

  const resetMessages = () => { setError(null); setNotice(null); };

  // ── Step 1: look the email up, get one random question ──────────────────────
  const handleLookup = async () => {
    if (!email.trim()) { setError(t('auth.error.emailRequired')); return; }
    resetMessages();
    setLoading(true);
    try {
      const { exists, slot: s, questionId: qid } = await authRecoveryLookup(email.trim());
      if (!exists) {
        // Honest reveal (the operator's choice); still rate-limited server-side.
        setNotice(t('auth.recovery.noAccount'));
        return;
      }
      if (!s || !qid) {
        // Account exists but has no recoverable question (e.g. OAuth-only).
        setNotice(t('auth.recovery.noQuestion'));
        return;
      }
      setSlot(s);
      setQuestionId(qid);
      setAnswer('');
      setStep('question');
    } catch (e) {
      if (e?.code === RECOVERY_RATE_LIMITED) setError(t('auth.recovery.tooMany'));
      else setError(t('auth.recovery.unavailable'));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify the answer; on success the function mails the link ───────
  const handleVerify = async () => {
    if (!answer.trim()) return;
    resetMessages();
    setLoading(true);
    try {
      const { ok } = await authRecoveryVerify({ email: email.trim(), slot, answer: answer.trim() });
      if (ok) {
        setStep('sent');
      } else {
        // Wrong answer — keep the field so they can retry (until rate-limited).
        setNotice(t('auth.recovery.wrongAnswer'));
        setAnswer('');
      }
    } catch (e) {
      if (e?.code === RECOVERY_RATE_LIMITED) {
        setRateLimited(true);
        setError(t('auth.recovery.tooMany'));
      } else {
        setError(t('auth.recovery.unavailable'));
      }
    } finally {
      setLoading(false);
    }
  };

  const onEnter = (handler) => (e) => { if (e.key === 'Enter') handler(); };

  const startOver = () => {
    setStep('email');
    setAnswer('');
    setSlot(null);
    setQuestionId(null);
    setRateLimited(false);
    resetMessages();
  };

  // ── Terminal success: the reset link is on its way ──────────────────────────
  if (step === 'sent') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg, textAlign: 'center' }}>
        <Alert type="success">{t('auth.recovery.sent')}</Alert>
        <Button variant="ghost" size="sm" onClick={onBackToSignIn}>
          {t('auth.button.backToSignIn')}
        </Button>
      </div>
    );
  }

  // ── Step 2: the random security question ────────────────────────────────────
  if (step === 'question') {
    const questionText = securityQuestionText(questionId) || t('auth.recovery.questionProse');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
        <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
          {t('auth.recovery.questionProse')}
        </p>
        {error && <Alert type="error">{error}</Alert>}
        {notice && <Alert type="info">{notice}</Alert>}
        <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5, fontWeight: 600 }}>
          {questionText}
        </p>
        <Input
          type="text"
          placeholder={t('auth.recovery.answerLabel')}
          value={answer}
          onChange={setAnswer}
          onKeyDown={onEnter(handleVerify)}
        />
        <AuthCTAButton onClick={handleVerify} disabled={loading || rateLimited || !answer.trim()}>
          {loading ? t('auth.button.working') : t('auth.recovery.verifyCta')}
        </AuthCTAButton>
        <Button variant="ghost" size="sm" onClick={startOver}>
          {t('auth.recovery.startOver')}
        </Button>
      </div>
    );
  }

  // ── Step 1: enter an email ──────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
      <p style={{ fontSize: FS.md, color: SECOND, margin: 0, lineHeight: 1.5 }}>
        {t('auth.recovery.lookupProse')}
      </p>
      {error && <Alert type="error">{error}</Alert>}
      {notice && <Alert type="info">{notice}</Alert>}
      <Input
        type="email"
        placeholder={t('auth.placeholder.email')}
        value={email}
        onChange={setEmail}
        onKeyDown={onEnter(handleLookup)}
      />
      <AuthCTAButton onClick={handleLookup} disabled={loading}>
        {loading ? t('auth.button.working') : t('auth.recovery.lookupCta')}
      </AuthCTAButton>
      <Button variant="ghost" size="sm" onClick={onBackToSignIn}>
        {t('auth.button.backToSignIn')}
      </Button>
    </div>
  );
}
