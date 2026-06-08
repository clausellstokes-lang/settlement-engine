/**
 * PlotHooksTab.jsx — the Summary group's "Plot Hooks" sub-tab (spec §8).
 *
 * Structural plot hooks aggregated from NPCs, factions, tensions, economy,
 * safety, history and relationships via domain/dossier/plotHooks. These are
 * simulation-derived seeds — always available, NOT gated on the AI narrative
 * layer (that's what the purple-tinted Guidance sub-tab is for). Previously
 * rendered inline inside SummaryTabV2; promoted to its own sub-tab so DM
 * Summary and Plot Hooks read as the distinct surfaces the spec calls for.
 */
import { useMemo } from 'react';

import { Section, Empty } from '../Primitives';
import { FS, swatch } from '../../theme.js';
import { collectPlotHooks, PLOT_HOOK_CATEGORIES } from '../../../domain/dossier/plotHooks.js';

const INK = '#1B1408';
const BODY = '#3A2F18';
const BORDER = '#E8D9B0';
const SERIF = 'Crimson Text, Georgia, serif';

export default function PlotHooksTab({ settlement }) {
  const hooks = useMemo(() => collectPlotHooks(settlement || {}), [settlement]);

  if (!hooks.length) {
    return (
      <Empty message="No structural plot hooks surfaced yet — they're drawn from NPCs, factions, tensions, economy, safety, history, and relationships." />
    );
  }

  return (
    <div style={{ padding: '16px 18px' }}>
      <Section title="Plot hooks">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {hooks.map((hook, i) => {
            const cat = PLOT_HOOK_CATEGORIES[hook.category] || PLOT_HOOK_CATEGORIES.tension;
            return (
              <div
                key={i}
                style={{
                  padding: '8px 11px',
                  background: swatch.white,
                  border: `1px solid ${BORDER}`,
                  borderLeft: `3px solid ${cat.color}`,
                  borderRadius: 4,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{
                    fontFamily: SERIF, fontWeight: 700, fontSize: FS['11.5'],
                    color: INK, minWidth: 0, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {hook.source}
                  </span>
                  <span style={{
                    fontSize: FS['7.5'], fontWeight: 800,
                    color: cat.color, letterSpacing: '0.08em', flexShrink: 0,
                  }}>
                    {String(cat.label).toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: FS.xxs, color: BODY, marginTop: 2, lineHeight: 1.45 }}>
                  {hook.text}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
