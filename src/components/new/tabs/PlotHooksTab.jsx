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
import { deriveEscalationClocks } from '../../../domain/hookEscalation.js';
// THE GENERAL DESK THROUGH ITS ONE CALLER (the registry's ARM 2). The two token lists are
// derived HERE and passed in: `collectPlotHooks` and `deriveEscalationClocks` drag the
// supply-chain and faction-profile leaves, and the reader is imported by every tab that
// draws this desk — this page is the one that already pays for them.
import { generalDeskLines } from '../generalDeskRead.js';

const INK = swatch['#1B1408'];
const BODY = swatch['#3A2F18'];
const BORDER = swatch['#E8D9B0'];
const SERIF = 'Crimson Text, Georgia, serif';

export default function PlotHooksTab({ settlement, publicDossier = false, playerView = false }) {
  const hooks = useMemo(() => collectPlotHooks(settlement || {}), [settlement]);
  // DS-HK-1: the state a hook is framed FROM, never the hook prose itself. One line per
  // category the page actually carries, then one per live escalation clock.
  const { framingLines } = useMemo(() => generalDeskLines(settlement, {
    publicDossier,
    playerView,
    hookCategories: hooks.map((h) => h && h.category),
    clockIds: deriveEscalationClocks(settlement || {}).map((c) => c && c.id),
  }).hooks, [settlement, publicDossier, playerView, hooks]);

  if (!hooks.length) {
    return (
      <Empty message="No structural plot hooks surfaced yet. They are drawn from NPCs, factions, tensions, economy, safety, history, and relationships." />
    );
  }

  return (
    <div style={{ padding: '16px 18px' }}>
      <Section title="Plot hooks">
        {/* ── DS-HK-1 (plot_hooks.framing) ────────────────────────────────────
            What kind of opening this town offers, and which clocks are already
            running. The hooks below keep their own words: this is the state they
            are framed FROM, which is the block's own stated subject. */}
        {framingLines.length > 0 && (
          <div style={{
            background: swatch['#FAF8F4'], border: `1px solid ${BORDER}`,
            borderLeft: '3px solid #6b5340', padding: '9px 12px', marginBottom: 10,
          }}>
            {framingLines.map((line, i) => (
              <p key={i} style={{
                fontSize: FS.xxs, color: BODY, lineHeight: 1.55,
                margin: i === 0 ? 0 : '5px 0 0', fontStyle: 'italic',
              }}>{line}</p>
            ))}
          </div>
        )}
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
