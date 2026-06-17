import { FS, swatch } from '../theme.js';

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
                <button
                  key={gid}
                  id={'sf-group-' + gid}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => handleGroupClick(gid)}
                  style={{
                    flex: 1, padding: '8px 6px',
                    background: active ? 'rgba(201,162,76,0.10)' : 'transparent',
                    border: active ? '1px solid rgba(201,162,76,0.40)' : '1px solid transparent',
                    borderRadius: 3,
                    fontSize: FS.sm,
                    fontWeight: active ? 700 : 500,
                    color: active ? '#8C6F32' : '#6B5340',
                    fontFamily: 'Nunito, sans-serif',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >{group.label}</button>
              );
            })}
          </div>
  );
}
