/**
 * DossierSearchBar — the dossier search's field, above the group strip (RULINGS-CROSS X-19,
 * corrected by X-19b; BUILD-W2-SEARCH U4). Scoped to the open dossier; the cmd-K palette stays
 * the global jump bar and is not duplicated here.
 *
 * Keyboard: typing searches, and the results take the tab body's place (DossierSearchResults);
 * the field is a SEARCHBOX pointing its aria-controls at that region, not a combobox, because
 * X-19b withdrew the popup list of rows a combobox announces (and a dossier's only combobox is
 * an authoring lever, tests/components/npcAuthoringScope.test.jsx). Escape clears, which returns the reader to
 * the tab they were on, because the tab state was never touched; Enter opens the best result's
 * owning tab and lands on that object's card when it is an indexed entity.
 *
 * Controlled: OutputContainer owns the query (its tab setter clears it, so opening any tab ends
 * the search). Lazy, like the palette's body: the container imports this file through
 * React.lazy. It imports no icon library (the icons-off law): the clear control is the text
 * glyph IconButton already speaks.
 */
import { FS, INK, BORDER, CARD, PARCH_100, SP, sans } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';
import { useStore } from '../../store/index.js';
import { useDossierEntities } from './DossierEntityContext.jsx';
import { searchDossier, isSearchActive, SEARCH_RESULTS_ID } from '../../domain/dossier/dossierSearch.js';

/**
 * @param {{
 *   query: string,
 *   onQueryChange: (next: string) => void,
 *   settlement: object,
 *   tabs: Array<{ id: string }>,
 *   publicDossier?: boolean,
 *   playerView?: boolean,
 *   onOpenTab: (tabId: string) => void,
 * }} props
 */
export default function DossierSearchBar({ query, onQueryChange, settlement, tabs, publicDossier = false, playerView = false, onOpenTab }) {
  const { index, navigateToEntity } = useDossierEntities();
  const customTraditions = useStore((s) => s.customContent?.traditions);
  const active = isSearchActive(query);

  // Enter: the best object of the best group. An indexed entity lands on its own card (the
  // navigator switches tab, focuses and scrolls); anything else opens its owning tab.
  const openBest = () => {
    const { groups } = searchDossier(settlement, query, { publicDossier, playerView },
      { tabs: (tabs || []).map((t) => t.id), customTraditions });
    const best = groups[0]?.objects[0];
    if (!best) return;
    const entry = best.id ? index?.resolve?.(best.id) : null;
    if (entry && entry.tab === best.tab && entry.identity?.interactive !== false) navigateToEntity(best.id);
    else onOpenTab(best.tab);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape' && query) {
      e.preventDefault();
      e.stopPropagation();
      onQueryChange('');
    } else if (e.key === 'Enter' && active) {
      e.preventDefault();
      openBest();
    }
  };

  return (
    <div role="search" style={{ display: 'flex', alignItems: 'center', gap: SP.xs, padding: `${SP.xs}px ${SP.sm}px`, background: PARCH_100 }}>
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={onKeyDown}
        role="searchbox"
        aria-label="Search this dossier"
        aria-controls={SEARCH_RESULTS_ID}
        placeholder="Search this dossier"
        autoComplete="off"
        style={{
          flex: 1, minWidth: 0, boxSizing: 'border-box', border: `1px solid ${BORDER}`, background: CARD,
          padding: `${SP.xs}px ${SP.sm}px`, fontFamily: sans, fontSize: FS.sm, color: INK, outline: 'none',
        }}
      />
      {query && <IconButton glyph="×" label="Clear search" onClick={() => onQueryChange('')} tone="ghost" size="sm" />}
    </div>
  );
}
