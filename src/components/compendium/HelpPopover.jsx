/**
 * HelpPopover.jsx — inline Compendium help (W-GUIDE-1 disposition: RE-SKINNED +
 * ABSORBED).
 *
 * Drop a `<HelpPopover topic="trade-route" />` next to any config label and the
 * user gets a "?" affordance that opens a small PARCHMENT margin-popover with the
 * relevant Compendium snippet + a "Read full reference →" deep-link.
 *
 * Two things changed from the pre-guidance version:
 *   • The dark generic tooltip chrome (INK background, foreign to the study) is
 *     gone — the popover now renders from theme tokens in the callout grammar
 *     (parchment ground, gold accent, serif title), passing the dissociation
 *     test, and the trigger is a text glyph, not a lucide icon (the immersion law).
 *   • The inline COMPENDIUM_HINTS lookup is ABSORBED into the guidance registry
 *     (guidance whispers `config_*` with glossaryRefs) + the copy registry
 *     (en.js guidance.compendium.*), so the hint text and its Compendium anchor
 *     live with every other whisper and cannot drift from the reference.
 *
 * Self-gates on flag('compendiumInlineHelp'); measurement rides the existing
 * HELP_POPOVER_OPENED event (§7 — no new event names).
 */

import { useEffect, useRef, useState } from 'react';
import { FS, ELEV, PARCH_100, INK, BODY, GOLD, GOLD_DEEP, sans, serif_ } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { flag } from '../../lib/flags.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { whisperById } from '../../domain/display/guidanceRegistry.js';
import { t } from '../../copy/index.js';

/** topic → the registry whisper id + the camelCase copy stem. */
function topicKeys(topic) {
  const id = `config_${String(topic).replace(/-/g, '_')}`;
  const camel = String(topic).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return { id, camel };
}

export default function HelpPopover({ topic, label = 'Help' }) {
  const enabled = flag('compendiumInlineHelp');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click + Esc
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!enabled) return null;

  const { id, camel } = topicKeys(topic);
  const registered = whisperById(id);
  const title = registered ? t(`guidance.compendium.${camel}.title`) : null;
  const body = registered ? t(`guidance.compendium.${camel}.body`) : null;
  const anchor = registered?.glossaryRef || null;

  const handleToggle = () => {
    if (!open && registered) {
      Funnel.track(EVENTS.HELP_POPOVER_OPENED, { topic });
    }
    setOpen(o => !o);
  };

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleToggle}
        aria-label={`${label}: ${title || topic}`}
        aria-expanded={open}
        style={{ minWidth: 0, padding: '0 6px', fontWeight: 800, color: GOLD_DEEP }}
      >
        ?
      </Button>
      {open && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 26,
            zIndex: 100,
            width: 244,
            padding: 12,
            background: PARCH_100,
            color: BODY,
            border: `1px solid ${GOLD}`,
            boxShadow: ELEV[3],
            fontSize: FS.xs,
            lineHeight: 1.55,
            fontFamily: sans,
          }}
        >
          {/* Parchment arrow (matches the callout ground + gold edge). */}
          <div style={{
            position: 'absolute',
            top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: 10, height: 10,
            background: PARCH_100,
            borderLeft: `1px solid ${GOLD}`,
            borderTop: `1px solid ${GOLD}`,
          }} />
          {registered ? (
            <>
              <div style={{
                color: GOLD_DEEP,
                fontFamily: serif_,
                fontWeight: 600, fontSize: FS.md, marginBottom: 4,
              }}>
                {title}
              </div>
              <div style={{ color: INK }}>{body}</div>
              <a
                href={anchor ? `/compendium#${anchor}` : '/compendium'}
                style={{
                  display: 'inline-block', marginTop: 8,
                  color: GOLD_DEEP, fontSize: FS.xxs, fontWeight: 700,
                  textDecoration: 'underline',
                }}
              >
                Read full reference →
              </a>
            </>
          ) : (
            <>
              <div style={{ color: INK }}>
                More about <b>{topic}</b> in the Compendium.
              </div>
              <a
                href="/compendium"
                style={{
                  display: 'inline-block', marginTop: 8,
                  color: GOLD_DEEP, fontSize: FS.xxs, fontWeight: 700,
                  textDecoration: 'underline',
                }}
              >
                Open Compendium →
              </a>
            </>
          )}
        </div>
      )}
    </span>
  );
}
