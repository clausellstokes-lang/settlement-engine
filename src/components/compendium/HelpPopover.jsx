/**
 * HelpPopover.jsx - P126 / CP-1 inline Compendium help.
 *
 * Drop a `<HelpPopover topic="trade-route" />` next to any config
 * label and the user gets a "?" affordance that opens a small popover
 * with the relevant Compendium snippet. "Read full reference →" inside
 * the popover links to the Compendium scrolled to the matching section.
 *
 * Content source - `src/data/compendiumHints.js` (a tiny lookup that
 * mirrors the Compendium tab content for the topics we want
 * inline-help on). Falls back to a generic "see Compendium" link when
 * the topic isn't in the lookup.
 *
 * Self-gates on flag('compendiumInlineHelp'). When the flag is off the
 * component renders nothing - drop-in to any control without breaking
 * the visual layout (the `?` only appears under the flag).
 *
 * Click-outside closes; Esc closes; keyboard-accessible.
 */

import { useEffect, useRef, useState } from 'react';
import { FS, ELEV, PARCH_100, GOLD_DEEP, INK, GOLD, swatch } from '../theme.js';
import { flag } from '../../lib/flags.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';

const COMPENDIUM_HINTS = Object.freeze({
  'trade-route': {
    title: 'Trade Route',
    body: 'How goods, news, and trouble move through the settlement. Crossroads = high diversity. River = food security. Isolated = thin services, high secrets.',
    anchor: 'trade-routes',
  },
  'terrain': {
    title: 'Terrain',
    body: 'Constrains what the settlement can produce, defend, and rely on. Coastal towns import grain; mountain holds export stone. Frontier terrains bias toward militarized institutions.',
    anchor: 'terrain',
  },
  'culture': {
    title: 'Culture',
    body: 'Names, naming patterns, institution flavor, faction archetypes. Drives the prose of the place more than the math - a "germanic" town and a "south-asian" town with identical configs read very differently.',
    anchor: 'cultures',
  },
  'monster-threat': {
    title: 'Monster Threat',
    body: 'Heartland = monsters are rumor. Frontier = active patrols. Plagued = the militia is the most important institution and people lock their doors at dusk.',
    anchor: 'threat',
  },
  'magic-level': {
    title: 'Magic Level',
    body: 'Mundane = no magical economy. Common = magic shops in cities; everyday charms in villages. High = magic is the economy. Affects institution distribution + NPC archetypes.',
    anchor: 'magic',
  },
  'tier': {
    title: 'Settlement Tier',
    body: 'Thorp through Metropolis. Each tier sets the institution count, NPC count, district count, and what kinds of stressors are likely. Bigger ≠ better; a thorp can carry one perfect hook better than a metropolis.',
    anchor: 'tiers',
  },
});

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

  const content = COMPENDIUM_HINTS[topic];
  if (!content) {
    // Unknown topic - still render the "?" but link to Compendium root.
    // Better than silently dropping the affordance.
  }

  const handleToggle = () => {
    if (!open && content) {
      Funnel.track(EVENTS.HELP_POPOVER_OPENED, { topic });
    }
    setOpen(o => !o);
  };

  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={`${label}: ${content?.title || topic}`}
        aria-expanded={open}
        style={{
          width: 16, height: 16, borderRadius: '50%',
          background: PARCH_100,
          color: GOLD_DEEP,
          border: '1px solid #D8C588',
          fontSize: FS.xxs, fontWeight: 700,
          cursor: 'help',
          padding: 0, lineHeight: 1,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >?</button>
      {open && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 24,
            zIndex: 100,
            width: 240,
            padding: 12,
            background: INK,
            color: PARCH_100,
            border: '1px solid #8C6F32',
            borderRadius: 6,
            boxShadow: ELEV[3],
            fontSize: FS.xs,
            lineHeight: 1.55,
            fontFamily: '"Nunito", system-ui, sans-serif',
          }}
        >
          <div style={{
            position: 'absolute',
            top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: 10, height: 10,
            background: INK,
            borderLeft: '1px solid #8C6F32',
            borderTop: '1px solid #8C6F32',
          }} />
          {content ? (
            <>
              <div style={{
                color: GOLD,
                fontFamily: '"Crimson Text", Georgia, serif',
                fontWeight: 600, fontSize: FS.md, marginBottom: 4,
              }}>
                {content.title}
              </div>
              <div style={{ color: swatch['#C8B098'] }}>{content.body}</div>
              <a
                href={`/compendium#${content.anchor}`}
                style={{
                  display: 'inline-block', marginTop: 8,
                  color: GOLD, fontSize: FS.xxs, fontWeight: 700,
                  textDecoration: 'underline',
                }}
              >
                Read full reference →
              </a>
            </>
          ) : (
            <>
              <div style={{ color: swatch['#C8B098'] }}>
                More about <b>{topic}</b> in the Compendium.
              </div>
              <a
                href={`/compendium`}
                style={{
                  display: 'inline-block', marginTop: 8,
                  color: GOLD, fontSize: FS.xxs, fontWeight: 700,
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
