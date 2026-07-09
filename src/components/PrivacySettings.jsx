/**
 * PrivacySettings.jsx — three plain-language consent toggles (doc §3).
 *
 * essential — product telemetry (default on unless DNT/opt-out). Cookieless,
 *             pseudonymous; powers funnels that tune the app.
 * research  — contribute anonymous STRUCTURAL data (no names/prose/secrets) to
 *             improve the generator. Consent model v2: ON by default (opt-OUT),
 *             one click to turn off; DNT is a hard override.
 * ai_prose  — reserved; gates nothing today (shown so the UI doesn't churn later).
 *
 * Writes through consent.js and fires CONSENT_UPDATED. Stamp-at-write: downgrades
 * apply going forward; full erasure goes through the account-deletion path.
 *
 * ResearchDisclosureNotice (exported) is the opt-out's honesty surface: a small,
 * dismissible first-run notice shown the first time research capture would fire,
 * telling the user they're contributing anonymous structure and where the off
 * switch is. Mount it once in the app shell; it self-gates via consent.js.
 */
import { useState } from 'react';
import {
  getConsent, setConsent, dntEnabled,
  researchDisclosureNeeded, markResearchDisclosed,
} from '../lib/consent.js';
import { track, EVENTS } from '../lib/analytics.js';
import { GOLD, INK, BODY, MUTED, BORDER, CARD, AMBER, AMBER_BG, sans, serif_, FS, SP, R } from './theme.js';

function Toggle({ on, disabled, onClick, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        flexShrink: 0, width: 42, height: 24, borderRadius: 12, position: 'relative',
        border: `1px solid ${on ? GOLD : BORDER}`, background: on ? GOLD : '#e8dcc8',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'background 120ms',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, borderRadius: '50%',
        background: CARD, transition: 'left 120ms', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

function Row({ id, title, desc, on, disabled, note, onToggle }) {
  return (
    <div style={{ display: 'flex', gap: SP.md, alignItems: 'flex-start', padding: `${SP.sm}px 0`, borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, fontFamily: sans }}>{title}</div>
        <div style={{ fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45, fontFamily: sans }}>{desc}</div>
        {note && <div style={{ fontSize: FS.xs, color: MUTED, marginTop: 2, fontStyle: 'italic' }}>{note}</div>}
      </div>
      <Toggle on={on} disabled={disabled} onClick={() => onToggle(id, !on)} label={title} />
    </div>
  );
}

export default function PrivacySettings() {
  const [consent, setLocal] = useState(getConsent);
  const dnt = dntEnabled();

  const update = (key, value) => {
    const next = setConsent({ [key]: value });
    setLocal(next);
    // Touching the research control counts as having seen the disclosure — the
    // first-run notice shouldn't reappear once the user has used the real toggle.
    if (key === 'research') markResearchDisclosed();
    track(EVENTS.CONSENT_UPDATED, {
      research: next.research ? 'granted' : 'denied',
      ai_prose: next.ai_prose ? 'granted' : 'denied',
      surface: 'account',
    });
  };

  return (
    <section aria-label="Privacy &amp; data" style={{
      border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD,
      padding: `${SP.md}px ${SP.lg}px`, marginTop: SP.lg,
    }}>
      <h3 style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, margin: 0 }}>
        Privacy &amp; data
      </h3>
      <p style={{ fontSize: FS.xs, color: BODY, margin: `${SP.xs}px 0 ${SP.sm}px`, lineHeight: 1.5, fontFamily: sans }}>
        Usage and settlement <em>structure</em> help improve the generator. Your private campaign
        text, NPC secrets, and notes are never collected. Research is opt-in and anonymous; you can
        change this anytime, and deleting your account erases your data.
      </p>

      {dnt && (
        <p style={{ fontSize: FS.xs, color: MUTED, margin: `0 0 ${SP.sm}px`, fontStyle: 'italic' }}>
          Your browser sends “Do Not Track”, so all telemetry is off regardless of these toggles.
        </p>
      )}

      <Row
        id="essential" title="Product analytics"
        desc="Cookieless, pseudonymous usage events that show us which features land and where new users get stuck."
        on={consent.essential} disabled={dnt}
        onToggle={update}
      />
      <Row
        id="research" title="Contribute to research (on by default)"
        desc="On unless you turn it off. Shares only the anonymous STRUCTURE of your settlements — tiers, counts, conditions, causal bands — to study how coherent settlements are designed. Never names, prose, or secrets."
        on={consent.research} disabled={dnt}
        note={dnt ? undefined : 'Anonymous · opt out anytime with one click'}
        onToggle={update}
      />
      <Row
        id="ai_prose" title="AI-prose research (coming later)"
        desc="Reserved for future prose-quality research. Off, and gates nothing today."
        on={consent.ai_prose} disabled
        note="Not used yet."
        onToggle={update}
      />
    </section>
  );
}

/**
 * ResearchDisclosureNotice — the opt-out's first-run honesty surface.
 *
 * Because research now defaults ON, the user must be told — once, plainly —
 * before any structural data leaves, with a one-click off switch. Self-gates via
 * consent.js (`researchDisclosureNeeded`): renders nothing under DNT, when
 * research is already off, or once dismissed/seen. Mount it once in the app shell
 * near the top-level notice stack (least-invasive surface; follows the existing
 * dismissible-notice pattern). Fires CONSENT_UPDATED on the off action.
 */
export function ResearchDisclosureNotice() {
  const [show, setShow] = useState(() => researchDisclosureNeeded());
  if (!show) return null;

  const dismiss = () => { markResearchDisclosed(); setShow(false); };
  const turnOff = () => {
    const next = setConsent({ research: false });
    markResearchDisclosed();
    setShow(false);
    track(EVENTS.CONSENT_UPDATED, {
      research: next.research ? 'granted' : 'denied',
      ai_prose: next.ai_prose ? 'granted' : 'denied',
      surface: 'opt_in_card',
    });
  };

  return (
    <div
      role="note"
      aria-label="Research contribution notice"
      style={{
        display: 'flex', gap: SP.sm, alignItems: 'flex-start', flexWrap: 'wrap',
        border: `1px solid ${AMBER}`, background: AMBER_BG, borderRadius: R.md,
        padding: `${SP.sm}px ${SP.md}px`, margin: `${SP.sm}px 0`,
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, fontFamily: sans }}>
          You&rsquo;re helping improve the generator
        </div>
        <div style={{ fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45, fontFamily: sans }}>
          SettlementForge studies the anonymous <em>structure</em> of settlements — tiers, counts,
          conditions — to make generation better. Never your names, prose, or secrets. It&rsquo;s on by
          default; you can turn it off here or anytime in Privacy &amp; data.
        </div>
      </div>
      <div style={{ display: 'flex', gap: SP.xs, flexShrink: 0 }}>
        <button
          type="button" onClick={turnOff}
          style={{
            fontSize: FS.xs, fontFamily: sans, fontWeight: 600, color: INK,
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.sm,
            padding: `${SP.xs}px ${SP.sm}px`, cursor: 'pointer',
          }}
        >
          Turn off
        </button>
        <button
          type="button" onClick={dismiss}
          style={{
            fontSize: FS.xs, fontFamily: sans, fontWeight: 600, color: CARD,
            background: GOLD, border: `1px solid ${GOLD}`, borderRadius: R.sm,
            padding: `${SP.xs}px ${SP.sm}px`, cursor: 'pointer',
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
