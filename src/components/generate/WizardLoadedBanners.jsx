/**
 * WizardLoadedBanners.jsx — the loaded-config / active-neighbour status notes.
 *
 * Deep Craft (C1r-c2 — THE TINT TRIO): the two tinted status banners (the amber
 * "Config loaded" wash + the green "Neighbour active" wash) become rubric-headed
 * clerk's notes. The tinted callout box was the SaaS tell — a coloured wash +
 * radius announcing tone by background; the clerk's note is the manuscript's way
 * (one reserved rubric voice, a single drawn rule at the left, NO wash, NO radius,
 * NO shadow — tone lives in the rubric's words). Each note self-gates on its own
 * datum; the clear affordance rides the note's actions slot. Presentational —
 * every value and handler arrives via props; state stays in the parent wizard.
 */

import { ClerkNote, ClerkNoteStrong } from './ClerkNote.jsx';
import IconButton from '../primitives/IconButton.jsx';

export function WizardLoadedBanners({
  loadedFromSave,
  clearLoadedFromSave,
  importedNeighbour,
  clearNeighbour,
}) {
  return (
    <>
      {loadedFromSave && (
        <ClerkNote
          rubric="Config loaded"
          actions={
            <IconButton glyph="×" label="Clear loaded config" tone="ghost" size="md" onClick={clearLoadedFromSave} />
          }
        >
          <ClerkNoteStrong>{loadedFromSave.name}</ClerkNoteStrong>
          {loadedFromSave.tier ? <>{' · '}{loadedFromSave.tier}</> : null}
        </ClerkNote>
      )}

      {importedNeighbour && (
        <ClerkNote
          rubric="Neighbour active"
          actions={
            <IconButton glyph="×" label="Clear neighbour" tone="ghost" size="md" onClick={clearNeighbour} />
          }
        >
          <ClerkNoteStrong>{importedNeighbour.name}</ClerkNoteStrong>
          {importedNeighbour.tier ? <>{' · '}{importedNeighbour.tier}</> : null}
        </ClerkNote>
      )}
    </>
  );
}
