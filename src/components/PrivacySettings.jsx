/**
 * PrivacySettings.jsx — three plain-language consent toggles (doc §3).
 *
 * essential — product telemetry (default on unless DNT/opt-out). Cookieless,
 *             pseudonymous; powers funnels that tune the app.
 * research  — contribute anonymous STRUCTURAL data (no names/prose/secrets) to
 *             improve the generator. Opt-in.
 * ai_prose  — reserved; gates nothing today (shown so the UI doesn't churn later).
 *
 * Writes through consent.js and fires CONSENT_UPDATED. Stamp-at-write: downgrades
 * apply going forward; full erasure goes through the account-deletion path.
 */
import { useState } from 'react';
import { getConsent, setConsent, dntEnabled } from '../lib/consent.js';
import { track, EVENTS } from '../lib/analytics.js';
import { GOLD, INK, BODY, MUTED, BORDER, CARD, sans, serif_, FS, SP, R } from './theme.js';

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

// Rows group by vertical padding alone — the per-row borderBottom drew a false
// floor on every row (including the last), the same anti-pattern the sibling
// AccountPreferencesSection's PrefRow already removed. Matching it keeps the two
// on-page toggle lists consistent (P5).
function Row({ id, title, desc, on, disabled, note, onToggle }) {
  return (
    <div style={{ display: 'flex', gap: SP.md, alignItems: 'flex-start', padding: `${SP.md}px 0` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, fontFamily: sans }}>{title}</div>
        <div style={{ fontSize: FS.xs, color: BODY, marginTop: 2, lineHeight: 1.45, fontFamily: sans }}>{desc}</div>
        {note && <div style={{ fontSize: FS.xs, color: MUTED, marginTop: 2, fontStyle: 'italic' }}>{note}</div>}
      </div>
      <Toggle on={on} disabled={disabled} onClick={() => onToggle(id, !on)} label={title} />
    </div>
  );
}

/**
 * @param {object} props
 * @param {boolean} [props.bare] When true (embedded inside an Account Section),
 *   render as a borderless sub-group: no concentric card chrome, and the title
 *   demoted to the same inline keyword-row the sibling sub-groups use, so the
 *   parent Section's border is the only boundary and spacing carries the
 *   grouping (P5 anti-box-soup). Defaults to false for standalone callers
 *   (onboarding/consent) that still want the self-contained card.
 */
export default function PrivacySettings({ bare = false }) {
  const [consent, setLocal] = useState(getConsent);
  const dnt = dntEnabled();

  const update = (key, value) => {
    const next = setConsent({ [key]: value });
    setLocal(next);
    track(EVENTS.CONSENT_UPDATED, {
      research: next.research ? 'granted' : 'denied',
      ai_prose: next.ai_prose ? 'granted' : 'denied',
      surface: 'account',
    });
  };

  const sectionStyle = bare
    ? { marginTop: 0 }
    : {
        border: `1px solid ${BORDER}`, borderRadius: R.lg, background: CARD,
        padding: `${SP.md}px ${SP.lg}px`, marginTop: SP.lg,
      };

  return (
    <section aria-label="Privacy and data" style={sectionStyle}>
      {bare ? (
        // Inline keyword-row title — matches the "Export my data" / "Delete
        // content" sub-group headers in AccountDataPrivacySection so the
        // embedded instance reads as one more sub-group, not a second card.
        <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, fontFamily: sans }}>
          Privacy and analytics
        </div>
      ) : (
        <h3 style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, margin: 0 }}>
          Privacy and data
        </h3>
      )}
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
        id="research" title="Contribute to research (anonymous)"
        desc="Share the structure of your settlements (tiers, counts, conditions, causal bands) to study how coherent settlements are designed. Never names, prose, or secrets."
        on={consent.research} disabled={dnt}
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
