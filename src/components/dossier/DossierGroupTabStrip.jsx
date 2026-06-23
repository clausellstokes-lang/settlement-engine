import { PARCH_100 } from '../theme.js';
import Button from '../primitives/Button.jsx';

// Thematic group tab strip (Summary / Systems / World / Notes).
// Extracted verbatim from OutputContainer's render; the parent still owns the
// `fiveTabsEnabled` gate and all state. Presentational only — the visible group
// list, the selected group, and the click handler arrive via props.
export default function DossierGroupTabStrip({
  visibleGroupEntries,
  selectedGroup,
  handleGroupClick,
}) {
  return (
          // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- roving tabIndex lives on the child tabs (WAI-ARIA tabs pattern); the tablist container forwards arrow keys but is not itself a focus stop
          <div
            role="tablist"
            aria-label="Dossier sections"
            onKeyDown={(e) => {
              const ids = visibleGroupEntries.map(([gid]) => gid);
              const i = ids.indexOf(selectedGroup);
              if (i < 0) return;
              let j;
              if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % ids.length;
              else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + ids.length) % ids.length;
              else if (e.key === 'Home') j = 0;
              else if (e.key === 'End') j = ids.length - 1;
              else return;
              e.preventDefault();
              handleGroupClick(ids[j]);
              if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(() => {
                  try { document.getElementById('sf-group-' + ids[j])?.focus(); } catch { /* no-op */ }
                });
              }
            }}
            // Master section-nav row. It reads as DOMINANT over the sub-tab
            // strip below via a deeper parchment tint + heavier md buttons, and
            // carries NO bottom border of its own so the master row and the
            // within-group sub-tab row group as one nav block — a single hairline
            // (the sub-strip's own bottom border) separates the combined nav from
            // the content column, instead of two near-identical stacked bands.
            style={{
              display: 'flex', gap: 4, padding: 6,
              background: PARCH_100,
            }}
          >
            {visibleGroupEntries.map(([gid, group]) => {
              const active = selectedGroup === gid;
              return (
                <Button
                  key={gid}
                  id={'sf-group-' + gid}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => handleGroupClick(gid)}
                  // Active group reads in two channels: solid gold fill + GOLD_TXT
                  // (variant 'gold') vs an outlined 'secondary' for inactive — so
                  // selection survives the squint test beyond accent color. md
                  // size gives the four top-level section targets a comfortable
                  // (~44px-class) hit area and the heavier weight the master row
                  // wants over the sub-tab strip.
                  variant={active ? 'gold' : 'secondary'}
                  size="md"
                  style={{ flex: 1 }}
                >{group.label}</Button>
              );
            })}
          </div>
  );
}
