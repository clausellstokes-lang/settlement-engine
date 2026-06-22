/**
 * nextSteps.js — pure builder for the post-generate "what's next" checklist.
 *
 * Once a user has generated a settlement, the post-generate flow ends on a
 * short, state-aware list of forward moves (save → export → refine → place).
 * This module derives that ordered checklist; it is the single source of truth
 * for the list, rendered as the final step of src/components/PostGenCoach.jsx.
 *
 * Pure and DOM-free so it can be unit-tested without a renderer
 * (tests/components/wizardNextSteps.test.js).
 */

/** The save step's framing depends on whether the user can save yet. */
export function saveStep({ canSave, signedIn }) {
  if (canSave) {
    return {
      id: 'save',
      label: 'Save it to your library',
      hint: 'Keep it for campaigns, inline editing, and export.',
    };
  }
  if (signedIn) {
    // Signed in but blocked → almost always the per-tier save cap.
    return {
      id: 'save',
      label: 'Save it. Free up a slot or upgrade',
      hint: "You've reached your library's save cap.",
    };
  }
  return {
    id: 'save',
    label: 'Save it. Create a free account',
    hint: 'A free account keeps your settlements and reaches every size up to metropolis.',
  };
}

/**
 * Build the ordered next-step checklist for a freshly-generated dossier.
 * Pure.
 *
 * The headline binds to the settlement's OWN identity (its name, falling back to
 * tier) so the peak/end focal line is about the artifact the user just made, not
 * a generic category label (P3/P9 — the end lands on content, not chrome).
 *
 * `steps` are the four forward moves that build ON this dossier (save → export →
 * refine → place). "Generate another" is intentionally NOT in `steps`: it
 * throws the work away rather than building on it, so it must not own the final
 * recency slot of a "what's next" list. It returns as a separate quiet `footer`
 * (rendered as a low-emphasis trailing row), not the climax of the checklist.
 *
 * @param {Object}  args
 * @param {Object}  [args.settlement] — the generated settlement (name + tier).
 * @param {boolean} [args.canSave]    — store `canSave()` result.
 * @param {boolean} [args.signedIn]   — whether the user is authenticated (non-wanderer).
 * @param {boolean} [args.saved]      — whether THIS settlement is already in the library.
 * @returns {{ headline: string, steps: Array<{id,label,hint}>, footer: {id,label,hint} }}
 */
export function buildNextSteps({ settlement, canSave = false, signedIn = false, saved = false } = {}) {
  const tier = settlement?.tier || 'settlement';
  const name = settlement?.name;
  return {
    headline: name ? `${name} is ready.` : `Your ${tier} is ready.`,
    steps: [
      saveStep({ canSave, signedIn }),
      {
        id: 'export',
        label: 'Export a PDF',
        hint: 'A print-ready dossier for the table.',
      },
      {
        id: 'refine',
        label: 'Refine the details',
        hint: 'Rename or tweak fields inline, then re-roll anything that misses.',
      },
      // State-aware: only instruct "drag from library" once the settlement is
      // actually saved — an unsaved draft isn't in the library yet, so the drag
      // has nothing to grab. For the unsaved case, point at the prerequisite.
      saved
        ? {
            id: 'map',
            label: 'Place it on your world map',
            hint: 'Drag it from your library onto the map to link trade and neighbours.',
          }
        : {
            id: 'map',
            label: 'Place it on your world map',
            hint: 'Save it first, then drag it from your library to link trade and neighbours.',
          },
    ],
    footer: {
      id: 'another',
      label: 'Generate another',
      hint: 'Same settings for a fresh roll, or switch modes to start over.',
    },
  };
}
