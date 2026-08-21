/**
 * components/auth/SecurityQuestionsFields.jsx — the two security-question
 * pickers + answer fields shown at sign-up (email/password accounts only).
 *
 * Controlled, presentational, and self-contained: the parent owns the four
 * values (q1/a1/q2/a2) and passes setters. The second question's <select>
 * EXCLUDES whatever the first picked, so the two are always distinct by
 * construction; if a prior first-pick later collides, the parent clears it
 * (see clearSecondIfColliding). The answers are hashed server-side after a
 * session exists — this component never touches the network or the hash.
 *
 * Voice/a11y: a calm prose intro from the copy registry, every control labelled
 * (the <select> via aria-label, the answer Input via its placeholder→aria-label
 * bridge), no raw button elements, theme tokens only.
 */
import { SECURITY_QUESTIONS } from '../../data/securityQuestions.js';
import { SECOND, FS, SP } from '../theme.js';
import { t } from '../../copy/index.js';
import { Input, Select } from './authUI.jsx';

export default function SecurityQuestionsFields({
  q1, a1, q2, a2,
  setQ1, setA1, setQ2, setA2,
  onKeyDown,
}) {
  // The second picker offers every question EXCEPT the one chosen first, so the
  // distinct-question invariant holds in the UI itself (the DB re-enforces it).
  const secondOptions = SECURITY_QUESTIONS.filter(q => q.id !== q1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
      <p style={{ fontSize: FS.sm, color: SECOND, margin: 0, lineHeight: 1.5 }}>
        {t('auth.security.prose')}
      </p>

      {/* First question + its answer. */}
      <Select value={q1} onChange={setQ1} ariaLabel={t('auth.security.question1')}>
        <option value="" disabled>{t('auth.security.choosePrompt')}</option>
        {SECURITY_QUESTIONS.map(q => (
          <option key={q.id} value={q.id}>{q.text}</option>
        ))}
      </Select>
      <Input
        type="text"
        placeholder={t('auth.security.answer1')}
        value={a1}
        onChange={setA1}
        onKeyDown={onKeyDown}
      />

      {/* Second question (excludes the first pick) + its answer. */}
      <Select value={q2} onChange={setQ2} ariaLabel={t('auth.security.question2')}>
        <option value="" disabled>{t('auth.security.choosePrompt')}</option>
        {secondOptions.map(q => (
          <option key={q.id} value={q.id}>{q.text}</option>
        ))}
      </Select>
      <Input
        type="text"
        placeholder={t('auth.security.answer2')}
        value={a2}
        onChange={setA2}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
