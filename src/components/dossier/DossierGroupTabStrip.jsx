import { swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

// P102 / D-1 — Thematic group tab strip (Summary / Systems / World / Notes).
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
            style={{
              display: 'flex', gap: 2, padding: 4,
              background: swatch['#F7F0E4'], borderBottom: '1px solid #e0d0b0',
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
                  variant={active ? 'gold' : 'ghost'}
                  size="sm"
                  style={{ flex: 1 }}
                >{group.label}</Button>
              );
            })}
          </div>
  );
}
