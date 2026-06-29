/**
 * eventComposer/EventComposerConstants.js — module-scope data + style constants
 * extracted from EventComposer.jsx (behavior-preserving decomposition). These
 * are pure declarations (event→entity maps, relationship vocabularies, the
 * non-authorable set, severity values, sentinel target, and the shared form
 * styles / button helpers). Moved verbatim so the parent and the extracted
 * presentational children can share one source of truth.
 */

import { GOLD, INK, MUTED, BORDER, sans, FS, R, swatch } from '../../theme.js';

// Code-review fix: target field used to be a free-text input. The user
// shouldn't have to TYPE the name of an NPC they want to kill — the NPC
// is already in the dossier. This map declares which dossier collection
// to pull the target dropdown from for each event type. ADD_*
// (institution / npc) and CUT_TRADE_ROUTE genuinely have no source list
// (the user is naming something new), so they keep the text input.
export const TARGET_ENTITY_BY_EVENT = Object.freeze({
  ADD_INSTITUTION:      null,           // new entity — free text
  ADD_FACTION:          null,           // new entity — free-text name
  REMOVE_INSTITUTION:   'institutions',
  DAMAGE_INSTITUTION:   'institutions',
  IMPAIR_INSTITUTION:   'institutions',
  ADD_NPC:              null,           // new entity — free text
  KILL_NPC:             'npcs',
  IMPOSE_CORRUPTION:    'npcs',          // pick the clean NPC to turn; criminal org picked below
  ASSIGN_NPC_TO_ROLE:   'npcs',
  IMPAIR_FACTION:       'factions',
  RESTORE_FACTION:      'factions',     // recover a faction that is currently impaired
  EXPOSE_CORRUPTION:    'npcs',         // NPC-only: a faction/institution is scandalised only via chain propagation
  RESTORE_INSTITUTION:  'institutions', // recover an institution that is currently impaired
  DEPLETE_RESOURCE:     'resources',
  RECOVERED_RESOURCE:   'resources',    // recover a resource the campaign already depleted
  CUT_TRADE_ROUTE:      null,           // route names aren't tracked as entities — free text
  SETTLEMENT_DISPUTE:   'neighbours',   // §9b — pick a linked neighbour
  BROKERED_ALLIANCE:    'neighbours',   // §9g
  OPENED_TRADE_ROUTE:   'neighbours',   // §9h
  // Editor roster wave.
  RESOLVE_STRESSOR:     'stressors',    // pick one of the settlement's current stressors
  ADD_TRADE_GOOD:       null,           // new label — free text + datalist suggestions below
  REMOVE_TRADE_GOOD:    'tradeGoods',   // union of exports / imports / transit
  ADD_RESOURCE:         null,           // catalog select + custom name (custom UI below)
  REMOVE_RESOURCE:      'resources',
  PROMOTE_NPC:          null,           // faction-grouped NPC pair picker (custom UI below)
  DEMOTE_NPC:           null,
});

// §9b/§9g/§9h — relationship events target a neighbouring settlement and set a
// relationship type. The per-event option list drives the relationship dropdown;
// these events are only offered when the settlement has linked neighbours.
export const RELATIONSHIP_OPTIONS = Object.freeze({
  SETTLEMENT_DISPUTE: ['neutral', 'rival', 'cold_war', 'hostile'],
  BROKERED_ALLIANCE:  ['allied'],
  OPENED_TRADE_ROUTE: ['allied', 'client', 'patron', 'trade_partners'],
});
export const RELATIONSHIP_LABELS = Object.freeze({
  neutral: 'Neutral', rival: 'Rival', cold_war: 'Cold War', hostile: 'Hostile',
  allied: 'Allied', client: 'Client', patron: 'Patron', trade_partners: 'Trade Partners',
});

// Events the DM cannot hand-author from the Make Changes dropdown. They stay in
// the registry — and the world engine still produces them via simulation /
// regional propagation — they're just not one-click authorable here:
//   - KILL_LEADER folds into KILL_NPC (consequences derive from the NPC).
//   - REFUGEE_WAVE / PLAGUE / RAID_OR_MONSTER_ATTACK / REMOVED_THREAT /
//     STARTED_RIOT are authored via Stressors in the Roster below, not as
//     one-off events — a stressor IS the ongoing condition these represented.
//   - DAMAGE_INSTITUTION duplicated IMPAIR_INSTITUTION once the severity slider
//     was hidden, so Impair Institution is the single "weaken it" action.
//   - DEMOTE_NPC folds into PROMOTE_NPC (relabeled "Promote/Demote NPC"): the two
//     already share ONE mutation handler (the standing swap is symmetric — a
//     promote of A IS a demote of B), so one authorable action covers both. The
//     type stays in the registry/mutate/batch/undo so old DEMOTE_NPC event logs
//     still apply + undo.
export const NON_AUTHORABLE_EVENTS = new Set([
  'KILL_LEADER',
  'CUT_TRADE_ROUTE',          // §9b — replaced by Settlement Dispute (neighbour + relationship)
  'DAMAGE_INSTITUTION',
  'REFUGEE_WAVE',
  'PLAGUE',
  'RAID_OR_MONSTER_ATTACK',
  'REMOVED_THREAT',
  'STARTED_RIOT',
  'DEMOTE_NPC',               // folded into PROMOTE_NPC ("Promote/Demote NPC")
  // Authored via dedicated pickers, NOT the generic composer — they carry no buildEvent
  // payload branch, so a composer selection would assemble an empty (payload-less) event:
  // SET_PRIMARY_DEITY/IMPOSE_CULT via PrimaryDeityPicker/CultPicker (need a resolved
  // deity snapshot), SHIFT_TIER via TierShiftControl (needs a direction + cap/floor guard).
  'SET_PRIMARY_DEITY',
  'IMPOSE_CULT',
  'SHIFT_TIER',
]);

// ADD_RESOURCE — sentinel select value for "name a custom resource"; the real
// target comes from the companion text input while this is picked.
export const CUSTOM_RESOURCE_OPTION = '__custom_resource__';

export const inputStyle = {
  padding: '4px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm,
  fontSize: FS.xs, fontFamily: sans, color: INK, minWidth: 180, background: '#fff',
};
export const selectStyle = { ...inputStyle, minWidth: 180 };
export const pickedChipStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4,
  padding: '3px 8px', border: `1px solid ${GOLD}`, borderRadius: R.sm,
  fontSize: FS.xs, fontFamily: sans, color: INK, fontWeight: 700, background: swatch['#FAF8F4'],
};
export const chipClearBtn = {
  background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 0, display: 'flex', lineHeight: 1,
};

export function primaryBtn(disabled) {
  return {
    padding: '5px 12px',
    background: disabled ? '#eee' : GOLD,
    color: disabled ? '#999' : '#fff',
    border: 'none', borderRadius: R.sm,
    fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
export const confirmBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#1a5a28', color: '#fff',
  border: 'none', borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
};
export const cancelBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#fff', color: INK,
  border: `1px solid ${BORDER}`, borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans, cursor: 'pointer',
};
