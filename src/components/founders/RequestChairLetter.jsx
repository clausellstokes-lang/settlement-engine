/**
 * founders/RequestChairLetter.jsx — THE REQUEST FOR A CHAIR (§5b).
 *
 * "Claim a founder seat" is dead vocabulary. A chair is asked for by LETTER.
 *
 * THE LETTER IS THE FORM, AND THE FORM IS THE FILTER. Two prompts in the
 * covenant's register, framed around what a founder IS — a patron whose name the
 * Hall keeps for as long as SettlementForge runs — never around what a founder
 * GETS. There is no price anywhere, no "apply now", and deliberately NO
 * reach/audience/follower field: chairs will often go to prominent DMs, but a
 * form that smells like an influencer application attracts applicants, and a
 * letter attracts believers. The owner reads standing from a letter.
 *
 * EXPECTATION HONESTY (binding copy law): chairs are few, invitations are rare,
 * and a letter may not be answered with a chair. No queue position, no status
 * tracker, no implied timeline. ONE promise, and it is the only one that is
 * true — every letter is read.
 *
 * PRESENCE, NOT DISABLEMENT: this component is not rendered at all when the Hall
 * is full. The parent derives that from the same ledger read as the counter, so
 * a chair freed by any path reopens the letterbox with no code change here.
 *
 * SIGNED-IN REQUIRED — an honor needs a bearer. An anonymous visitor sees the
 * control and is asked to sign in first, on a real link that returns to the Hall.
 */
import { useEffect, useState } from 'react';
import Button from '../primitives/Button.jsx';
import { HALL, covenantProseStyle, quietLineStyle } from './hallRegister.js';
import {
  HALL_LETTER_PROMPTS, HALL_LETTER_MAX,
  validateChairLetterAnswer, HALL_CIVILITY_GUARD,
} from '../../lib/foundersHall.js';
import { SP, FS, sans, serif_ } from '../theme.js';

const SIGN_IN_HREF = `/signin?next=${encodeURIComponent('/founders')}`;

/** Why a band-failed answer was refused, said plainly and without moralizing. */
function refusal(reason) {
  if (reason === 'empty') return 'Please answer both prompts.';
  if (reason === 'short') return 'A line or two more, please — this is a letter.';
  if (reason === 'long') return `Please keep this under ${HALL_LETTER_MAX} characters.`;
  if (reason === 'blocked') return 'That wording can’t be used here. Think this is wrong? Feedback & support.';
  return null;
}

/**
 * @param {Object} props
 * @param {{ user?: { id?: string, email?: string } }|null} props.auth
 * @param {(letter: { userId: string, email: string, answers: Record<string,string> }) => Promise<{ok: boolean, error: string|null}>} props.onSubmit
 * @param {(userId: string) => Promise<import('../../lib/founderChairRequest.js').ChairRequestStanding>} props.onLoadStanding
 * @param {((text: string) => { blocked: boolean })|null} [props.civilityGuard]
 */
export default function RequestChairLetter({ auth, onSubmit, onLoadStanding, civilityGuard = HALL_CIVILITY_GUARD }) {
  const userId = auth?.user?.id || null;
  const [standing, setStanding] = useState(null);
  const [writing, setWriting] = useState(false);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!userId || !onLoadStanding) { if (alive) setStanding(null); return; }
      const s = await onLoadStanding(userId);
      if (alive) setStanding(s);
    })();
    return () => { alive = false; };
  }, [userId, onLoadStanding]);

  const handleSubmit = async () => {
    const nextErrors = {};
    for (const p of HALL_LETTER_PROMPTS) {
      const r = validateChairLetterAnswer(answers[p.key], { civility: civilityGuard });
      if (!r.ok) nextErrors[p.key] = refusal(r.reason);
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSending(true);
    setSendError(null);
    const res = await onSubmit({ userId, email: auth?.user?.email || '', answers });
    setSending(false);
    if (res?.ok) { setSent(true); setWriting(false); } else setSendError(res?.error || 'Your letter could not be sent.');
  };

  return (
    <section aria-label="Request a chair" style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <h2 style={{
        margin: 0, fontFamily: serif_, fontSize: FS.lg, fontWeight: 700,
        letterSpacing: '0.04em', color: HALL.gold,
      }}>
        Request a chair
      </h2>

      {/* EXPECTATION HONESTY — stated before the control, never after it. */}
      <p style={covenantProseStyle}>
        Chairs are few and invitations are rare. A letter may not be answered with a
        chair. Every letter is read.
      </p>

      {sent ? (
        <p style={{ ...covenantProseStyle, color: HALL.ink }}>
          Your letter is in. There is nothing to track and nothing more to do &mdash; if a
          chair is ever offered, it will come to you.
        </p>
      ) : !userId ? (
        <a
          href={SIGN_IN_HREF}
          style={{
            alignSelf: 'flex-start', fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
            color: HALL.gold, textDecoration: 'underline', textUnderlineOffset: 4,
          }}
        >
          Sign in to write a letter
        </a>
      ) : standing && standing.state === 'open' ? (
        <p style={{ ...quietLineStyle, color: HALL.faint }}>
          Your letter is already in hand.
        </p>
      ) : standing && standing.state === 'cooling' ? (
        <p style={{ ...quietLineStyle, color: HALL.faint }}>
          You may write again in {standing.daysLeft} days.
        </p>
      ) : !writing ? (
        <Button variant="primary" size="lg" onClick={() => setWriting(true)} style={{ alignSelf: 'flex-start' }}>
          Request a chair
        </Button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md, maxWidth: 640 }}>
          {HALL_LETTER_PROMPTS.map((p) => (
            <label
              key={p.key}
              htmlFor={`sf-hall-letter-${p.key}`}
              style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}
            >
              <span style={{ fontFamily: serif_, fontSize: FS.md, color: HALL.ink }}>{p.label}</span>
              <span style={{ ...quietLineStyle, color: HALL.faint }}>{p.help}</span>
              <textarea
                id={`sf-hall-letter-${p.key}`}
                // The <label htmlFor> above already binds this control; the
                // explicit aria-label is here because the id is a template
                // literal the a11y linter cannot resolve statically, and a
                // control the linter cannot prove is labelled is one nobody can
                // prove is labelled.
                aria-label={p.label}
                rows={5}
                value={answers[p.key] || ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [p.key]: e.target.value }))}
                style={{
                  fontFamily: serif_, fontSize: FS.sm, lineHeight: 1.6,
                  color: HALL.ink, background: HALL.panel,
                  border: `1px solid ${errors[p.key] ? HALL.goldSoft : HALL.rule}`,
                  padding: SP.sm, resize: 'vertical',
                }}
              />
              {errors[p.key] && (
                <span role="alert" style={{ ...quietLineStyle, color: HALL.goldSoft }}>{errors[p.key]}</span>
              )}
            </label>
          ))}
          {sendError && <p role="alert" style={{ ...quietLineStyle, color: HALL.goldSoft }}>{sendError}</p>}
          <div style={{ display: 'flex', gap: SP.md, alignItems: 'center' }}>
            <Button variant="primary" size="lg" onClick={handleSubmit} busy={sending}>
              Send the letter
            </Button>
            <Button variant="ghost" size="md" onClick={() => setWriting(false)}>
              Not now
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
