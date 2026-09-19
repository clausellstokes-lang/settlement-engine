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
// THE ONE PARAGRAPH RENDERER (owner finding 2026-09-18) — see the framing block below for
// why this position is also CAPPED, which no other position is.
import ProseBlock from '../ProseBlock.jsx';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { tokenCase } from '../labelLadder.js';

/**
 * ⭐ THE FRAMING CAP, AND THE RULING BEHIND IT (owner finding 4, 2026-09-18).
 *
 * DS-HK-1 draws ONE line per hook category the page carries plus one per live escalation
 * clock, so a busy town reaches TEN framing sentences above its hook list — a page of
 * preamble before the hooks it is meant to frame, each sentence opening on the town's name.
 *
 * ⛔ THE FIRST CURE WAS CONSIDERED AND REFUSED ON EVIDENCE: rendering each framing sentence
 * under the hook group it belongs to. The composer DOES key these lines — `hookCategoryPoolKey`
 * makes a 7-for-7 identity with `PLOT_HOOK_CATEGORIES`, and the key rides on
 * `rung.provenance.poolKey`. It cannot be done at this render site today, for three reasons
 * that are facts about the tree rather than preferences:
 *
 *   1. THE KEY DOES NOT REACH HERE. `generalDeskRead.js` — the desk's ONE caller, which ARM 2
 *      of the mount registry requires to stay one — returns `framingLines` as `string[]`; the
 *      rung and its provenance are consumed inside it. Carrying the key out is a change to
 *      that reader's return contract (`GENERAL_DESK_SILENT`), which is a different car.
 *   2. THERE ARE NO GROUPS TO RENDER UNDER. The hooks below are ONE FLAT LIST of cards in
 *      `collectPlotHooks` order, each with a category badge. There is no per-category header
 *      to hang a sentence on; grouping the list is a layout change nobody has asked for.
 *   3. HALF THE LINES HAVE NO CATEGORY AT ALL. The clock lines (`escalationClockPoolKey`,
 *      `clock bread_riot`) are keyed to an ESCALATION CLOCK, not a hook category, so even a
 *      keyed reader would leave them homeless.
 *
 * So the second rule applies: ONE woven paragraph, the first three sentences in COMPOSER
 * ORDER, the rest dropped. Composer order puts the category lines first and the clock lines
 * after, so the cap keeps the framing of the hooks the page actually carries.
 */
const FRAMING_CAP = 3;

const INK = swatch['#1B1408'];
const BODY = swatch['#3A2F18'];
const BORDER = swatch['#E8D9B0'];
const SERIF = 'Crimson Text, Georgia, serif';

export default function PlotHooksTab({ settlement, publicDossier = false, playerView = false }) {
  // THE PHONE PROSE FLOOR — the framing lines and every hook body. Bound above
  // the empty-state early return so the hook order is stable on a town that
  // surfaces no hooks. The hook's source name and its category tag are the card's
  // furniture and keep their own steps.
  const mobile = useIsMobile();
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
            <ProseBlock lines={framingLines.slice(0, FRAMING_CAP)}
              settlementName={settlement?.name} tier={settlement?.tier}
              style={{ fontSize: proseFontSize(FS.xxs, mobile), color: BODY, lineHeight: 1.55, margin: 0, fontStyle: 'italic' }}/>
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
                    // The source NAME — furniture, and long enough to be read
                    // (a conflict source reads "X vs Y"), so it takes the chrome floor.
                    fontFamily: SERIF, fontWeight: 700, fontSize: chromeFontSize(FS['11.5'], mobile),
                    color: INK, minWidth: 0, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {/* THE ONLY SITE IN THIS LADDER THAT WAS SHOUTING NOTHING AND STILL
                        WRONG: it printed the RAW ENGINE TOKEN, so a source read "npc" in
                        lower case where SessionMode:471 and the PDF's PlotHooks both print
                        "NPC". tokenCase is the one function that gets both halves right. */}
                    {tokenCase(hook.source)}
                  </span>
                  <span style={{
                    fontSize: FS['7.5'], fontWeight: 800,
                    color: cat.color, letterSpacing: '0.08em', flexShrink: 0,
                  }}>
                    {/* ⛔ THIS LINE DESTROYED THE ONE WORD THE LADDER PROTECTS. The category
                        vocabulary carries 'NPCs' (`domain/dossier/plotHooks.js`), and
                        `.toUpperCase()` printed it 'NPCS' — an initialism broken by the very
                        transform the ladder removes. tokenCase returns 'NPCs' intact. */}
                    {tokenCase(cat.label)}
                  </span>
                </div>
                <div style={{ fontSize: proseFontSize(FS.xxs, mobile), color: BODY, marginTop: 2, lineHeight: 1.45 }}>
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
