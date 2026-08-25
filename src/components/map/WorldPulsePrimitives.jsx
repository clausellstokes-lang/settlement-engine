// WorldPulsePrimitives.jsx — presentational primitives extracted verbatim from
// WorldPulsePanel.jsx. Pills, the entity badge, the outcome card, the small
// action button, the section wrapper, and the inline name-the-attacker control.
// All purely presentational — every value arrives via props.

import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';

import { BORDER, BORDER2, BODY, CARD, CARD_ALT, FS, GOLD, GOLD_BG, GREEN, INK, MUTED, SECOND, sans, swatch } from '../theme.js';
import { human, percent } from './WorldPulseData.js';
import Button from '../primitives/Button.jsx';

export function Pill({ children, tone = 'neutral' }) {
  const bg = tone === 'major' ? GOLD_BG : tone === 'good' ? swatch.successBg : CARD_ALT;
  const color = tone === 'major' ? GOLD : tone === 'good' ? GREEN : SECOND;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 22,
      padding: '2px 7px',
      border: `1px solid ${BORDER2}`,
      borderRadius: 6,
      background: bg,
      color,
      fontFamily: sans,
      fontSize: FS.xxs,
      fontWeight: 800,
      whiteSpace: 'nowrap',
      textTransform: 'capitalize',
    }}>
      {children}
    </span>
  );
}

export function EntityPill({ label, value }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', minHeight: 22, maxWidth: '100%',
      padding: '2px 8px', border: `1px solid ${BORDER2}`, borderRadius: 6,
      background: swatch.infoBg, color: INK,
      fontFamily: sans, fontSize: FS.xxs, fontWeight: 700,
    }}>
      <span style={{ color: MUTED, fontWeight: 900, marginRight: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </span>
  );
}

// Inline affordance for the nullable-attacker design: a war-shaped stressor
// with no named force gets a one-line input so the DM can attribute it to a
// settlement-less force ("The Red Fang warband") right from the card.
export function NameAttackerControl({ stressor, onName, busy }) {
  const [value, setValue] = useState('');
  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', width: '100%' }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Name the attacking force…"
        aria-label={`Name the force behind ${stressor.label || human(stressor.type)}`}
        style={{
          flex: 1, minWidth: 0, minHeight: 30, padding: '5px 9px',
          border: `1px solid ${BORDER2}`, borderRadius: 6,
          background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs,
        }}
      />
      <SmallButton
        tone="good"
        title="Name attacker"
        disabled={busy || !value.trim()}
        onClick={() => onName(value.trim())}
      >
        Name
      </SmallButton>
    </div>
  );
}

export function OutcomeCard({ title, summary, severity, reasons = [], actions = null, tone = 'normal', details = [], involved = [] }) {
  const major = tone === 'major' || severity >= 0.7;
  return (
    <article style={{
      border: `1px solid ${major ? GOLD : BORDER}`,
      borderRadius: 8,
      background: major ? GOLD_BG : CARD,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <ShieldAlert size={16} color={major ? GOLD : SECOND} style={{ marginTop: 1, flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{
            margin: 0,
            color: INK,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 900,
            lineHeight: 1.25,
            overflowWrap: 'anywhere',
          }}>
            {title}
          </h4>
          {summary && (
            <p style={{
              margin: '5px 0 0',
              color: BODY,
              fontFamily: sans,
              fontSize: FS.xs,
              lineHeight: 1.45,
              overflowWrap: 'anywhere',
            }}>
              {summary}
            </p>
          )}
        </div>
      </div>
      {involved.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {involved.map((entity, index) => <EntityPill key={`${entity.label}-${index}`} label={entity.label} value={entity.value} />)}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        <Pill tone={major ? 'major' : 'neutral'}>Severity {percent(severity)}</Pill>
        {details.slice(0, 5).map((detail, index) => <Pill key={`${detail}-${index}`}>{detail}</Pill>)}
        {reasons.slice(0, 3).map((reason, index) => <Pill key={`${reason}-${index}`}>{reason}</Pill>)}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
          {actions}
        </div>
      )}
    </article>
  );
}

export function SmallButton({ children, onClick, tone = 'neutral', title, disabled = false }) {
  const variant = tone === 'good' ? 'success' : tone === 'danger' ? 'danger' : 'secondary';
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}

export function Section({ title, count, children }) {
  return (
    <section style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <h3 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>
          {title}
        </h3>
        <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}
