/**
 * eventComposer/EventComposerConstants.js — module-scope data + style constants
 * extracted from EventComposer.jsx (behavior-preserving decomposition). These
 * are pure declarations (event→entity maps, relationship vocabularies, the
 * non-authorable set, severity values, sentinel target, and the shared form
 * styles / button helpers). Moved verbatim so the parent and the extracted
 * presentational children can share one source of truth.
 */

import { Plus, Trash2, Flame, AlertOctagon, MapPinOff } from 'lucide-react';
import { GOLD, INK, MUTED, BORDER, sans, FS, R, swatch } from '../../theme.js';

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
} from '../../../domain/events/affordanceManifest.js';

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
