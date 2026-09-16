/**
 * ResetConstraintsButton — the one control that clears every hard constraint.
 *
 * Each Deep-constraints grid (Institutions / Services / Trade) carries its own
 * "Reset", and each clears only its own bag. Nothing cleared all of them at once,
 * so a GM who had forced choices spread across three collapsed disclosures had to
 * open each one to get back to a clean roll. `resetAllToggles` has done exactly
 * that in the store since the toggle slice was written; this is its surface.
 *
 * It is its own component, not an inline block in LayeredConfigurationPanel, so
 * the four-bag subscription re-renders one button instead of the whole Create
 * console on every card click inside the grids. It is a leaf: it pulls in nothing
 * the panel does not already hold, so it re-parents no chunk.
 */

import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import { MUTED, FS, SP } from '../theme.js';

export default function ResetConstraintsButton() {
  const resetAllToggles = useStore(s => s.resetAllToggles);
  // A scalar selector: the count is a primitive, so this subscription re-renders
  // only when the number of set constraints actually changes.
  const setCount = useStore(s => (
    Object.keys(s.institutionToggles || {}).length
    + Object.keys(s.categoryToggles || {}).length
    + Object.keys(s.goodsToggles || {}).length
    + Object.keys(s.servicesToggles || {}).length
  ));

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, marginLeft: 'auto' }}>
      <span style={{ fontSize: FS.xs, color: MUTED }}>
        {setCount === 0 ? 'nothing forced or forbidden yet' : `${setCount} set across the three`}
      </span>
      {/* No native title= tooltip (shrink-only census, guidanceRegistry
          walker): the count line beside the button already says what is set,
          and the grid headers name the three bags it clears. */}
      <Button
        variant="secondary"
        size="sm"
        disabled={setCount === 0}
        onClick={() => resetAllToggles?.()}
      >
        Clear all
      </Button>
    </span>
  );
}
