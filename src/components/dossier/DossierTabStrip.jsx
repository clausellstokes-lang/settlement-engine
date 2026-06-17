import { FS, swatch } from '../theme.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  return (
        <div data-onboard-highlight={onboardingActive && onboardingStep === 2 ? 'true' : undefined} style={{ position: 'relative', borderBottom: '1px solid #e0d0b0', background: swatch['#F7F0E4'] }}>
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll tabs left" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2, background: 'linear-gradient(to right, #f7f0e4 60%, transparent)', border: 'none', cursor: 'pointer', color: swatch.mutedBrown, padding: '0 8px' }}><ChevronLeft size={14} /></button>
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
            {tabs.map(({ id, label, Icon }) => {
              const active = selectedTab === id;
              // Guidance (DM Compass) is the AI-narrated layer — give it a subtle
              // purple tint so the AI surface reads as distinct from the
              // simulation tabs.
              const purple = id === 'dm_compass';
              const accent = purple ? '#7a3aa8' : '#a0762a';
              const idle   = purple ? '#7a5a92' : swatch.inkMag3;
              const bg = active
                ? (purple ? '#f7f0fa' : '#fffbf5')
                : (purple ? 'rgba(122,58,168,0.05)' : 'transparent');
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setActiveTab(id)}
                  id={'sf-tab-' + id}
                  role="tab"
                  aria-selected={active}
                  // Roving tabIndex: only the selected tab is tabbable; the rest are
                  // reached via the arrow-key handler on the tablist.
                  tabIndex={active ? 0 : -1}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 12px 8px', flexShrink: 0, background: bg, borderBottom: '2px solid ' + (active ? accent : 'transparent'), borderTop: active ? '1px solid #e0d0b0' : '1px solid transparent', borderLeft: active ? '1px solid #e0d0b0' : '1px solid transparent', borderRight: active ? '1px solid #e0d0b0' : '1px solid transparent', cursor: 'pointer', color: active ? accent : idle, fontSize: FS.xxs, fontWeight: active ? 700 : 500, fontFamily: 'Nunito, sans-serif', marginBottom: -1, whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent' }}
                ><Icon size={14} />{label}</button>
              );
            })}
          </div>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll tabs right" style={{ position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 2, background: 'linear-gradient(to left, #f7f0e4 60%, transparent)', border: 'none', cursor: 'pointer', color: swatch.mutedBrown, padding: '0 8px' }}><ChevronRight size={14} /></button>
        </div>
  );
}
