/**
 * primitives/ActionRail — Phase-aware "next best action" stack.
 *
 * The audit's single most cost-effective UI win: surface the right
 * next CTA in a consistent place, instead of scattering buttons across
 * the dossier header, the right edge of the detail card, and a
 * floating bar somewhere. This component renders a vertical action
 * list with at most one primary CTA (visually dominant) and any number
 * of secondaries.
 *
 * Hard cap: 5 visible items. The audit's caveat ("the rail will become
 * a magnet") is real — additional items go behind a "More" disclosure.
 */

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card.jsx';

const VISIBLE_CAP = 5;

/**
 * @typedef {Object} ActionRailItem
 * @property {string}   id
 * @property {string}   label
 * @property {string=}  hint               one-line context shown below
 * @property {boolean=} primary            at most one per rail; visually dominant
 * @property {React.ComponentType<{size?:number}>=} Icon
 * @property {boolean=} disabled
 * @property {string=}  disabledReason     accessible explanation
 * @property {() => void} onClick
 */

/**
 * @param {Object} props
 * @param {string} [props.title='Next best action']
 * @param {ActionRailItem[]} props.items
 */
export default function ActionRail({ title = 'Next best action', items = [] }) {
  const [showMore, setShowMore] = useState(false);
  if (!items.length) return null;

  // Dedupe: only the first primary actually renders as primary.
  // Stateless form — findIndex finds the first primary slot, map then
  // demotes every other one. Earlier `let primarySeen = false; ...
  // primarySeen = true` inside .map mutated a closed-over variable,
  // which is a react-hooks/immutability violation under React Compiler.
  const firstPrimaryIdx = items.findIndex(it => it.primary);
  const normalized = items.map((it, idx) =>
    it.primary && idx === firstPrimaryIdx ? it : { ...it, primary: false },
  );

  const visible = showMore ? normalized : normalized.slice(0, VISIBLE_CAP);
  const overflow = normalized.length - VISIBLE_CAP;

  return (
    <Card kicker={title} compact>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map(it => <ActionRow key={it.id} item={it} />)}
        {overflow > 0 && (
          <button
            type="button"
            onClick={() => setShowMore(v => !v)}
            aria-expanded={showMore}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              gap: 4, padding: '4px 8px',
              background: 'transparent', border: 'none',
              fontSize: 11, fontWeight: 700,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: '#6b5340', cursor: 'pointer',
            }}
          >
            {showMore ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            {showMore ? 'Show fewer' : `Show ${overflow} more`}
          </button>
        )}
      </div>
    </Card>
  );
}

function ActionRow({ item }) {
  const Icon = item.Icon;
  const tone = item.primary ? primaryTone : secondaryTone;
  return (
    <button
      type="button"
      onClick={item.onClick}
      disabled={item.disabled}
      aria-label={item.label}
      aria-describedby={item.hint ? `${item.id}-hint` : undefined}
      title={item.disabled && item.disabledReason ? item.disabledReason : item.label}
      style={{
        display: 'flex', alignItems: 'flex-start',
        gap: 8, padding: '8px 10px',
        background: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.border}`,
        borderRadius: 4,
        fontSize: 12, fontWeight: 700,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'left',
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        opacity: item.disabled ? 0.5 : 1,
        width: '100%',
      }}
    >
      {Icon && (
        <span style={{ display: 'flex', flexShrink: 0, marginTop: 1 }}>
          <Icon size={13} aria-hidden="true" />
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block' }}>{item.label}</span>
        {item.hint && (
          <span
            id={`${item.id}-hint`}
            style={{
              display: 'block',
              fontSize: 10, fontWeight: 400, opacity: 0.85,
              marginTop: 2, lineHeight: 1.35,
            }}
          >
            {item.hint}
          </span>
        )}
      </span>
    </button>
  );
}

const primaryTone   = { bg: '#a0762a', fg: '#fffbf5', border: '#a0762a' };
const secondaryTone = { bg: '#fff',    fg: '#1c1409', border: '#d2bd96' };
