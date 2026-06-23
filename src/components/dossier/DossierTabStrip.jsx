import { FS, swatch, GOLD_TXT } from '../theme.js';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import IconButton from '../primitives/IconButton.jsx';
import { useIconsOn } from '../primitives/IconsContext.js';

// One-line affordance glosses for tab labels a first-time DM can't guess from
// the word alone. Surfaced via the native title= tooltip, so the visible label
// (pinned by tests) is untouched. Only the genuinely opaque labels carry a
// gloss; self-evident tabs (Power, Economics, NPCs) get none. (Checklist 2.)
const TAB_GLOSS = {
  substrate: 'The sixteen causal variables the simulation runs on. The deepest diagnostic view.',
  dm_compass: 'The narrated layer: hooks, red flags, and the twist drawn from this settlement.',
  viability: 'Whether the settlement can sustain itself, and where it falls short.',
};

// Dossier tab strip — extracted verbatim from OutputContainer's render.
// Presentational only: scroll, the scroll-container ref, the resolved `tabs`
// list, the selected tab + setter, and onboarding flags all arrive via props.
// The parent keeps every piece of state and all handlers.
export default function DossierTabStrip({
  onboardingActive,
  onboardingStep,
  scroll,
  scrollRef,
  tabs,
  selectedTab,
  setActiveTab,
}) {
  const iconsOn = useIconsOn();
  return (
        <div data-onboard-highlight={onboardingActive && onboardingStep === 2 ? 'true' : undefined} style={{ position: 'relative', borderBottom: '1px solid #e0d0b0', background: swatch['#F7F0E4'] }}>
          {/* The gradient-fade edge stays on this absolute wrapper; the
              interactive control is the IconButton inside it, so the
              aria-label, focus ring, and 44px target come from the primitive. */}
          <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2, background: 'linear-gradient(to right, #f7f0e4 60%, transparent)', display: 'flex', alignItems: 'center', paddingLeft: 2 }}>
            <IconButton Icon={ChevronLeft} glyph="‹" label="Scroll tabs left" tone="ghost" size="xl" onClick={() => scroll(-1)} />
          </span>
          {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- roving tabIndex lives on the child tabs (WAI-ARIA tabs pattern); the tablist container forwards arrow keys but is not itself a focus stop */}
          <div
            ref={scrollRef}
            role="tablist"
            aria-label="Dossier tabs"
            // WAI-ARIA tabs keyboard pattern: arrows move between tabs (with
            // roving tabIndex below, only the active tab is in the tab order, so
            // Tab enters the strip once and arrows navigate within it). Home/End
            // jump to the ends. Focus follows selection.
            onKeyDown={(e) => {
              const i = tabs.findIndex(t => t.id === selectedTab);
              if (i < 0) return;
              let j;
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % tabs.length;
              else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
              else if (e.key === 'Home') j = 0;
              else if (e.key === 'End') j = tabs.length - 1;
              else return;
              e.preventDefault();
              const target = tabs[j];
              setActiveTab(target.id);
              if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(() => {
                  try { document.getElementById('sf-tab-' + target.id)?.focus(); } catch { /* no-op */ }
                });
              }
            }}
            style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', paddingLeft: 28, paddingRight: 28, WebkitOverflowScrolling: 'touch' }}
          >
            {tabs.map(({ id, label }) => {
              const active = selectedTab === id;
              // Guidance (DM Compass) is the AI-narrated layer — give it a subtle
              // purple tint so the AI surface reads as distinct from the
              // simulation tabs.
              const purple = id === 'dm_compass';
              // Two color channels per active tab: `indicator` paints the 2px
              // bottom underline + icon (non-text, needs ≥3:1); `textColor` paints
              // the LABEL (text, needs ≥4.5:1). Gold-as-text ('#a0762a') only
              // clears 3.98:1 on the active cream bg, so the gold branch swaps to
              // GOLD_TXT (gold-800, 7.25:1) for the label while keeping '#a0762a'
              // for the underline/icon. The purple branch's '#7a3aa8' already
              // clears 4.5:1 as text, so it serves both roles.
              const indicator = purple ? '#7a3aa8' : '#a0762a';
              const textColor = active ? (purple ? '#7a3aa8' : GOLD_TXT) : (purple ? '#7a5a92' : swatch.inkMag3);
              const bg = active
                ? (purple ? '#f7f0fa' : '#fffbf5')
                : (purple ? 'rgba(122,58,168,0.05)' : 'transparent');
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setActiveTab(id)}
                  id={'sf-tab-' + id}
                  title={TAB_GLOSS[id]}
                  role="tab"
                  aria-selected={active}
                  aria-controls={'sf-panel-' + id}
                  // Roving tabIndex: only the selected tab is tabbable; the rest are
                  // reached via the arrow-key handler on the tablist.
                  tabIndex={active ? 0 : -1}
                  // Active state reads as a clean underline tab (bottom accent +
                  // bg tint + weight), not a boxed cell: no top/left/right borders
                  // on top of the strip's own bottom border.
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '10px 12px 8px', minHeight: 44, flexShrink: 0, background: bg, border: 'none', borderBottom: '2px solid ' + (active ? indicator : 'transparent'), cursor: 'pointer', color: textColor, fontSize: FS.xs, fontWeight: active ? 800 : 600, fontFamily: 'Nunito, sans-serif', marginBottom: -1, whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: active ? indicator : textColor }}>
                    {/* Second, non-color channel marking the AI/narrated surface:
                        the same ✦ glyph the narrative layer uses, so the
                        AI-vs-simulation distinction survives the squint test and
                        color-blind reads. */}
                    {iconsOn && purple && <Sparkles size={11} aria-hidden="true" />}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
          <span style={{ position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 2, background: 'linear-gradient(to left, #f7f0e4 60%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 2 }}>
            <IconButton Icon={ChevronRight} glyph="›" label="Scroll tabs right" tone="ghost" size="xl" onClick={() => scroll(1)} />
          </span>
        </div>
  );
}
