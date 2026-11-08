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
import { MentionText } from '../../ProseParagraph.jsx';
import { FLUSH_PAGE, FLUSH_RULED, FLUSH_STACK } from '../../../design/flush.js';

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

/**
 * One hook card, extracted verbatim from the tab's group list (BUILD-W2-SEARCH U2, no
 * behaviour change) so the dossier search mounts a hook through its own card.
 */
export function PlotHookCard({ hook }) {
  // THE PHONE PROSE FLOOR — the hook body. The source name is the card's furniture and keeps
  // its own step (it moved here from the tab with the card).
  const mobile = useIsMobile();
  const cat = PLOT_HOOK_CATEGORIES[hook.category] || PLOT_HOOK_CATEGORIES.tension;
  return (
    <div
      data-testid="plot-hook-card"
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
        <MentionText text={nameOrTokenCase(hook.source)} structural />
      </div>
      <div style={{ fontSize: proseFontSize(FS.xxs, mobile), color: BODY, marginTop: 2, lineHeight: 1.45 }}>
        <MentionText text={hook.text} />
      </div>
    </div>
  );
}

/**
 * THE TRIM (the owner, 2026-11-01, ODQ §934.103; rubric R6): within a page group, every hook
 * of one source sits under that source's name ONCE, in the collector's order of first
 * appearance, instead of one card per hook repeating the name. A source with a single hook
 * keeps the single card (which the dossier search also mounts).
 * @param {Array<{source:string}>} hooks
 * @returns {Array<{source:string, hooks:any[]}>}
 */
export function groupHooksBySource(hooks) {
  const groups = [];
  const bySource = new Map();
  for (const hook of hooks) {
    const key = String(hook?.source ?? '');
    let g = bySource.get(key);
    if (!g) { g = { source: key, hooks: [] }; bySource.set(key, g); groups.push(g); }
    g.hooks.push(hook);
  }
  return groups;
}

/**
 * ONE HOOK SENTENCE ONCE (X-50, "boilerplate once"; MERGE-CAR, the chair's ruling on tabSentencesOnce, the
 * people car's lane 3: one hook per card, so in a city or metropolis two cards of one kind can draw the
 * same line once their pools run dry). Within a page group, a hook whose TEXT an earlier hook already
 * holds folds into it: the line is printed once, its source naming every card that holds it ("A · B"),
 * in the collector's order of first appearance. Display-only: no record, field or golden moves.
 * @param {Array<{source:string, text:string}>} hooks
 * @returns {Array<{source:string, text:string}>}
 */
export function foldSharedHookText(hooks) {
  const out = [];
  const byText = new Map();
  for (const hook of hooks) {
    const text = String(hook?.text ?? '').trim();
    const seen = text ? byText.get(text) : undefined;
    if (!seen) { const copy = { ...hook }; out.push(copy); if (text) byText.set(text, { hook: copy, sources: [String(hook?.source ?? '')] }); continue; }
    const source = String(hook?.source ?? '');
    if (!seen.sources.includes(source)) { seen.sources.push(source); seen.hook.source = seen.sources.join(' · '); }
  }
  return out;
}

/** One source, several hooks: the name once, then each hook on its own line. */
export function PlotHookSourceCard({ source, hooks }) {
  const mobile = useIsMobile();
  const cat = PLOT_HOOK_CATEGORIES[hooks[0]?.category] || PLOT_HOOK_CATEGORIES.tension;
  return (
    <div
      data-testid="plot-hook-source-card"
      style={{
        padding: '8px 11px',
        background: swatch.white,
        border: `1px solid ${BORDER}`,
        borderLeft: `3px solid ${cat.color}`,
      }}
    >
      <div style={{
        fontFamily: SERIF, fontWeight: 700, fontSize: chromeFontSize(FS['11.5'], mobile),
        color: INK, minWidth: 0, overflow: 'visible', textOverflow: 'clip', whiteSpace: 'normal',
      }}>
        <MentionText text={nameOrTokenCase(source)} structural />
      </div>
      {hooks.map((hook, i) => (
        <div key={i} data-testid="plot-hook-line" style={{ fontSize: proseFontSize(FS.xxs, mobile), color: BODY, marginTop: i === 0 ? 2 : 6, lineHeight: 1.45 }}>
          <MentionText text={hook.text} />
        </div>
      ))}
    </div>
  );
}

export default function PlotHooksTab({ settlement }) {
  const groups = useMemo(() => groupPlotHooksBySourcePage(collectPlotHooks(settlement || {})), [settlement]);

  if (!groups.length) {
    return (
      <Empty message="No structural plot hooks surfaced yet." />
    );
  }

  return (
    <div style={{ ...FLUSH_PAGE, ...FLUSH_STACK }}>
      {groups.map(({ page, hooks }) => {
        const sourceGroups = groupHooksBySource(foldSharedHookText(hooks));
        return (
        <section key={page.id} data-testid={`plot-hooks-from-${page.id}`} style={FLUSH_RULED}>
          <div style={{ ...literaryTitle(FS.sm), color: INK, marginBottom: 6 }}>{page.label}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {sourceGroups.map((g, i) => (g.hooks.length === 1
              ? <PlotHookCard key={i} hook={g.hooks[0]} />
              : <PlotHookSourceCard key={i} source={g.source} hooks={g.hooks} />))}
          </div>
        </section>
        );
      })}
    </div>
  );
}
