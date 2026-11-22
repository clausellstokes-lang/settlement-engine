/**
 * eventComposer/EventComposerConstants.js — module-scope data + style constants
 * extracted from EventComposer.jsx (behavior-preserving decomposition). These
 * are pure declarations (event→entity maps, relationship vocabularies, the
 * non-authorable set, severity values, sentinel target, and the shared form
 * styles / button helpers). Moved verbatim so the parent and the extracted
 * presentational children can share one source of truth.
 */

import { Plus, Trash2, Flame, AlertOctagon, MapPinOff } from 'lucide-react';
import { GOLD, INK, MUTED, BORDER, sans, FS, SP, swatch } from '../../theme.js';
import { chromeFontSize } from '../../../design/proseScale.js';

export const _TYPE_ICONS = {
  ADD_INSTITUTION:    Plus,
  REMOVE_INSTITUTION: Trash2,
  DAMAGE_INSTITUTION: Flame,
  DEPLETE_RESOURCE:   AlertOctagon,
  CUT_TRADE_ROUTE:    MapPinOff,
};

// The composer's data vocabulary moved to the AFFORDANCE MANIFEST
// (domain/events/affordanceManifest.js — Composer V2 §2): targetsFrom,
// relationship vocabularies, the non-authorable fold set, and the word-banded
// severity map are manifest data now. Re-exported here so the existing field
// modules keep their import paths (both files ride the same lazy chunk).
export {
  TARGET_ENTITY_BY_EVENT,
  RELATIONSHIP_OPTIONS, RELATIONSHIP_LABELS,
  NON_AUTHORABLE_EVENTS,
  STRESSOR_SEVERITY_VALUES,
  RELIEF_MAGNITUDE_VALUES,
} from '../../../domain/events/affordanceManifest.js';

// ADD_RESOURCE — sentinel select value for "name a custom resource"; the real
// target comes from the companion text input while this is picked.
export const CUSTOM_RESOURCE_OPTION = '__custom_resource__';

/**
 * The composer's form controls, as functions of the viewport rather than frozen
 * objects: every one of them is chrome, so below the breakpoint it takes the phone
 * chrome floor (design/proseScale.js) and above it keeps its own step.
 * @param {boolean} mobile the viewport flag, from `useIsMobile()`
 */
export const inputStyle = (mobile) => ({
  padding: '4px 8px', border: `1px solid ${BORDER}`,
  fontSize: chromeFontSize(FS.xs, mobile), fontFamily: sans, color: INK, minWidth: 180, background: '#fff',
});
export const selectStyle = (mobile) => ({ ...inputStyle(mobile), minWidth: 180 });
// The inline Apply-refusal box (a handler veto §2 OR a clock-bound queue refusal
// store-hooks-state-1) — blocking, danger-toned, keeps the form.
export const refusalBoxStyle = (mobile) => ({
  marginTop: SP.sm, padding: '8px 10px', border: `1px solid ${swatch.danger}`,
  background: swatch.dangerBg,
  fontSize: chromeFontSize(FS.xs, mobile), fontFamily: sans, color: swatch.danger, fontWeight: 700, lineHeight: 1.4,
});
export const pickedChipStyle = (mobile) => ({
  display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 4,
  padding: '3px 8px', border: `1px solid ${GOLD}`,
  fontSize: chromeFontSize(FS.xs, mobile), fontFamily: sans, color: INK, fontWeight: 700, background: swatch['#FAF8F4'],
});
export const chipClearBtn = {
  background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 0, display: 'flex', lineHeight: 1,
};

export function primaryBtn(disabled, mobile) {
  return {
    padding: '5px 12px',
    background: disabled ? '#eee' : GOLD,
    color: disabled ? '#999' : '#fff',
    border: 'none',
    fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700, fontFamily: sans,
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}
export const confirmBtn = (mobile) => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#1a5a28', color: '#fff',
  border: 'none',
  fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700, fontFamily: sans, cursor: 'pointer',
});
export const cancelBtn = (mobile) => ({
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '5px 12px', background: '#fff', color: INK,
  border: `1px solid ${BORDER}`,
  fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700, fontFamily: sans, cursor: 'pointer',
});
