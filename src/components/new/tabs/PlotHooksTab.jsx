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

import { Empty } from '../Primitives';
import { FS, swatch } from '../../theme.js';
import { collectPlotHooks, groupPlotHooksBySourcePage, PLOT_HOOK_CATEGORIES } from '../../../domain/dossier/plotHooks.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { literaryTitle, nameOrTokenCase } from '../labelLadder.js';

/**
 * ⭐ THE PAGE IS THE HOOK CARDS AND NOTHING ABOVE THEM (chair rulings, RULINGS-T1 Plot
 * Hooks, 2026-10-30; rubric R6, R1). The "Plot hooks" title on the Plot Hooks tab is CUT
 * (it re-announced the tab), and DS-HK-1's framing paragraph is CUT with its desk position
 * (`plot_hooks.framing` glances): it restated the cards' categories as aphorisms on 991 of
 * 1000 towns. The cards are GROUPED BY THE PAGE THEIR SOURCE FACT LIVES ON, under a caption
 * naming that page (domain/dossier/plotHooks.js :: groupPlotHooksBySourcePage), so the
 * per-card category tag, which said the same thing again, is gone too; the card's left rule
 * keeps the category colour.
 */

const INK = swatch['#1B1408'];
const BODY = swatch['#3A2F18'];
const BORDER = swatch['#E8D9B0'];
const SERIF = 'Crimson Text, Georgia, serif';

export default function PlotHooksTab({ settlement }) {
  // THE PHONE PROSE FLOOR — every hook body. Bound above the empty-state early return so
  // the hook order is stable on a town that surfaces no hooks. The source name and the group
  // caption are the card's furniture and keep their own steps.
  const mobile = useIsMobile();
  const groups = useMemo(() => groupPlotHooksBySourcePage(collectPlotHooks(settlement || {})), [settlement]);

  if (!groups.length) {
    return (
      <Empty message="No structural plot hooks surfaced yet. They are drawn from NPCs, factions, tensions, economy, safety, history, and traditions." />
    );
  }

  return (
    <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {groups.map(({ page, hooks }) => (
        <section key={page.id} data-testid={`plot-hooks-from-${page.id}`}>
          <div style={{ ...literaryTitle(FS.sm), color: INK, marginBottom: 6 }}>{page.label}</div>
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
                  <div style={{
                    // The source NAME — furniture, and long enough to be read (a conflict
                    // source reads "X vs Y"), so it takes the chrome floor and wraps rather
                    // than clamping (ODQ §934.23: a floor inside a clamp shows less).
                    fontFamily: SERIF, fontWeight: 700, fontSize: chromeFontSize(FS['11.5'], mobile),
                    color: INK, minWidth: 0, overflow: 'visible', textOverflow: 'clip', whiteSpace: 'normal',
                  }}>
                    {/* `nameOrTokenCase`: this field is `npc.name` for an NPC hook and
                        `parties.join(' vs ')` for a faction one; it cases a raw token ("npc"
                        reads "NPC") and leaves a generated name exactly as spelled. */}
                    {nameOrTokenCase(hook.source)}
                  </div>
                  <div style={{ fontSize: proseFontSize(FS.xxs, mobile), color: BODY, marginTop: 2, lineHeight: 1.45 }}>
                    {hook.text}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
