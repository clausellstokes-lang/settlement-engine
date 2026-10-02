/** @typedef {import('./types.js').Op} Op */
/** @typedef {import('./types.js').EntityRef} EntityRef */

/**
 * `set-npc-name` — EM-B1c §6's row, carried VERBATIM into its own home.
 *
 * ⛔ THIS MODULE IMPORTS NOTHING. `operations.js` imports THIS module's rows, so an import back
 * for OP_STAGES / OP_CONSEQUENCE_POLICIES would be a module cycle whose `const` bindings sit in
 * the temporal dead zone at initialisation. `stage` and `consequence` are literals here and
 * acceptance B4 asserts their MEMBERSHIP in both vocabularies from the test, where there is no
 * cycle.
 */
export const NPC_RENAME_OP_TYPES = Object.freeze({
  'set-npc-name': Object.freeze({
    target: 'npc',
    payload: Object.freeze({ newName: Object.freeze({ kind: 'free', required: true }) }),
    stage: 'home',
    consequence: 'home',
    requires: Object.freeze({ world: Object.freeze([]), registry: Object.freeze([]) }),
    enables: Object.freeze([]),
    relatedTo: Object.freeze([]),
    conflictsWith: Object.freeze([]),
    duration: null,
    guards: Object.freeze([]),
    guardsStated:
      'NO GUARD. The rename DELEGATES: the estate\'s existing NPC cascade is the writer: '
      + 'src/domain/factionRename.js#npcRenameChanges (pure patch form) and '
      + '#applyNpcRenameToSettlement (in place), each walking NPC_RENAME_SURFACES. This module '
      + 'names them as DATA and imports neither. The STORE action the adapter calls is EM-C4a\'s '
      + 'to name: §P4 forbids a domain module reaching the store, so that name has exactly one '
      + 'home and it is not this one.',
  }),
});
