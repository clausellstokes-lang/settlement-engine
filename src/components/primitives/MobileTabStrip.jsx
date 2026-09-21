/**
 * primitives/MobileTabStrip — a horizontally scrollable tab strip that never
 * clips silently.
 *
 * The mobile failure mode for tab rows is a strip that overflows with no cue,
 * so the trailing tabs look like they don't exist. This primitive solves that
 * two ways: an edge fade appears on whichever side has hidden content (and
 * only when the strip actually overflows), and the active tab is scrolled into
 * view whenever the selection changes, so a programmatic or keyboard switch
 * never lands off-screen.
 *
 * It follows the WAI-ARIA tabs keyboard pattern (role="tablist" + roving
 * tabIndex, arrow/Home/End navigation, focus follows selection) and reuses the
 * same selection API shape as the existing dossier strips — an array of
 * { id, label } tabs, the selected id, and an onChange setter — so surfaces can
 * swap it in without reshaping their state.
 *
 * Token-driven and accessible. The tab buttons clear the 44px mobile tap
 * floor. Presentation only; ships unwired (a later sub-wave adopts it on the
 * read surfaces).
 *
 * @param {Object} props
 * @param {{id:string,label:React.ReactNode}[]} props.tabs
 * @param {string} props.value               selected tab id
 * @param {(id:string)=>void} props.onChange selection setter
 * @param {string} [props.ariaLabel='Tabs']  tablist accessible name
 * @param {string} [props.idPrefix='mts']    id namespace for tab/panel wiring
 */
import { useEffect, useId, useRef, useState } from 'react';
import {
  BORDER, CARD, CARD_HDR, FS, GOLD, GOLD_DEEP, MUTED, SP, sans,
} from '../theme.js';

export default function MobileTabStrip({
  tabs = [],
  value,
  onChange,
  ariaLabel = 'Tabs',
  idPrefix: idPrefixProp,
}) {
  const scrollRef = useRef(null);
  const autoId = useId();
  const idPrefix = idPrefixProp || `mts-${autoId.replace(/[:]/g, '')}`;
  const [edges, setEdges] = useState({ left: false, right: false });

  // Recompute which edges are clipped: a side fades only when content actually
  // overflows past it. Runs on scroll, on resize, and when the tab set changes.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return undefined;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = node;
      const max = scrollWidth - clientWidth;
      setEdges({
        left: scrollLeft > 1,
        right: scrollLeft < max - 1,
      });
    };
    update();
    node.addEventListener('scroll', update, { passive: true });
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(node);
    }
    return () => {
      node.removeEventListener('scroll', update);
      ro?.disconnect();
    };
  }, [tabs]);

  // Keep the active tab on-screen whenever the selection changes, so a switch
  // never strands the active tab in the clipped region.
  useEffect(() => {
    const el = typeof document !== 'undefined'
      ? document.getElementById(`${idPrefix}-tab-${value}`)
      : null;
    el?.scrollIntoView?.({ inline: 'nearest', block: 'nearest' });
  }, [value, idPrefix]);

  const onKeyDown = (event) => {
    const i = tabs.findIndex(t => t.id === value);
    if (i < 0) return;
    let j;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') j = (i + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') j = 0;
    else if (event.key === 'End') j = tabs.length - 1;
    else return;
    event.preventDefault();
    const target = tabs[j];
    onChange?.(target.id);
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        try { document.getElementById(`${idPrefix}-tab-${target.id}`)?.focus(); } catch { /* no-op */ }
      });
    }
  };

  // THE CUE HAS TO READ (2026-09-18). The edge overlay was 24px of the strip's
  // OWN background laid over that same background, reaching full opacity only at
  // 10%: against parchment it changed no colour at all and barely veiled the last
  // tab's final letters, so a clipped strip looked like a complete row that
  // happened to end where the screen did. Measured on a 375px phone, the Systems
  // group is 554px of tabs in a 349px strip — five of its eight tabs sit
  // off-screen — and nothing on the surface said so.
  //
  // The fade is now wide enough to genuinely take the text out, and it carries the
  // SAME ‹ › chevron the desktop strip uses on its scroll buttons, so the two
  // strips say "there is more this way" in one vocabulary. The overlay stays
  // DECORATIVE — aria-hidden, pointer-events none — because the gesture here is a
  // swipe and the keyboard path is the tablist's own arrow keys; a tappable
  // control at this position would sit on top of a real tab.
  const fade = (side) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    [side]: 0,
    width: 34,
    zIndex: 2,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
    padding: `0 ${SP.xs}px`,
    color: MUTED,
    fontSize: FS.lg,
    fontWeight: 700,
    background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, ${CARD_HDR} 45%, transparent)`,
  });

  return (
    <div style={{ position: 'relative', borderBottom: `1px solid ${BORDER}`, background: CARD_HDR }}>
      {edges.left && <span aria-hidden="true" style={fade('left')}>{'‹'}</span>}
      {edges.right && <span aria-hidden="true" style={fade('right')}>{'›'}</span>}
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- roving tabIndex lives on the child tabs (WAI-ARIA tabs pattern); the tablist forwards arrow keys but is not itself a focus stop */}
      <div
        ref={scrollRef}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {tabs.map(({ id, label }) => {
          const active = value === id;
          return (
            <button
              type="button"
              key={id}
              id={`${idPrefix}-tab-${id}`}
              role="tab"
              aria-selected={active}
              aria-controls={`${idPrefix}-panel-${id}`}
              // Roving tabIndex: only the active tab is in the tab order; the
              // rest are reached via the arrow-key handler on the tablist.
              tabIndex={active ? 0 : -1}
              onClick={() => onChange?.(id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `${SP.sm}px ${SP.md}px`,
                minHeight: 44,
                flexShrink: 0,
                border: 'none',
                borderBottom: `2px solid ${active ? GOLD : 'transparent'}`,
                marginBottom: -1,
                background: active ? CARD : 'transparent',
                color: active ? GOLD_DEEP : MUTED,
                fontFamily: sans,
                fontSize: FS.sm,
                fontWeight: active ? 800 : 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
