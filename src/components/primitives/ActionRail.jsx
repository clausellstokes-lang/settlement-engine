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
 *
 * RESTORED @ S2r-a (owner's BASE RULING, 2026-07-18): revived verbatim from
 * origin/master (d024286e). ⚠ KNOWN COLLISION (ruled, not re-litigated): the
 * guidance layer once retired this file as a kill-list violator (rounded radii,
 * rgba tones); the owner's base ruling supersedes. The materials pass (S2r-c)
 * flattens these to the deep-craft idiom and lowers the ceilings.
 */

import { useState } from 'react';
import { FS, swatch, GOLD_DEEP, INK, CARD, BORDER, PARCH } from '../theme.js';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Card from './Card.jsx';
import { useIconsOn } from './IconsContext.js';

const VISIBLE_CAP = 5;

/**
 * @typedef {Object} ActionRailItem
 * @property {string}   id
 * @property {string}   label
 * @property {string=}  hint               one-line context shown below
 * @property {string=}  tag                small text tag (e.g. a required tier) shown beside the label
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
  const iconsOn = useIconsOn();
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
              fontSize: FS.xs, fontWeight: 700,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              color: swatch.inkMag3, cursor: 'pointer',
            }}
          >
            {iconsOn && (showMore ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}
            {showMore ? 'Show fewer' : `Show ${overflow} more`}
          </button>
        )}
      </div>
    </Card>
  );
}

function ActionRow({ item }) {
  const Icon = item.Icon;
  const iconsOn = useIconsOn();
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
        // S2r-c materials: rule-framed, not rounded — the deep-craft flat idiom
        // (the rounded corners the restored master rail carried are struck;
        // hairline rule only).
        display: 'flex', alignItems: 'flex-start',
        gap: 8, padding: '8px 10px',
        background: tone.bg,
        color: tone.fg,
        border: `1px solid ${tone.border}`,
        fontSize: FS.sm, fontWeight: 700,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'left',
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        opacity: item.disabled ? 0.5 : 1,
        width: '100%',
      }}
    >
      {iconsOn && Icon && (
        <span style={{ display: 'flex', flexShrink: 0, marginTop: 1 }}>
          <Icon size={13} aria-hidden="true" />
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
          <span>{item.label}</span>
          {item.tag && (
            <span
              style={{
                // S2r-c materials: flat parchment chip, hairline-ruled — no radius,
                // palette tokens (the master rail's rounded + rgba tag is struck).
                flexShrink: 0,
                fontSize: FS.xxs, fontWeight: 700,
                letterSpacing: '0.02em',
                padding: '1px 5px',
                background: PARCH,
                border: `1px solid ${BORDER}`,
              }}
            >
              {item.tag}
            </span>
          )}
        </span>
        {item.hint && (
          <span
            id={`${item.id}-hint`}
            style={{
              display: 'block',
              fontSize: FS.xxs, fontWeight: 400, opacity: 0.85,
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

// S2r-c materials: the rail's tones re-vehicled from master's raw hex onto the
// deep-craft palette tokens (gold-700 primary, parchment card + parchment-ink
// secondary, palette border) — same families, routed through the ramp so no raw
// color literal lands in the tree.
const primaryTone   = { bg: GOLD_DEEP, fg: CARD, border: GOLD_DEEP };
const secondaryTone = { bg: CARD,      fg: INK,  border: BORDER };
