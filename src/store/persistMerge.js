/**
 * persistMerge.js — the custom zustand-persist `merge` for the app store (store-6).
 *
 * zustand's DEFAULT merge is a SHALLOW top-level spread — `{ ...currentState,
 * ...persistedState }` — so a returning user's persisted `config` object REPLACES
 * DEFAULT_CONFIG wholesale. Any key added to DEFAULT_CONFIG after they last saved then
 * reads `undefined` for them, while a FRESH user gets the default: a silent config-shape
 * fork between cohorts that reaches the generator as input (the owner's most-bitten
 * class — a write that survives one path and ghosts another, in persistence-shape form).
 *
 * This merge deep-merges `config` (and the four toggle maps) OVER their defaults, so a
 * returning user's missing keys backfill to exactly what a fresh user gets, while the
 * top-level spread still restores every other slice's methods + state. Extracted to a
 * leaf so it is unit-testable without importing the whole store (which has boot-time
 * side effects).
 *
 * @param {any} persistedState the rehydrated (partialized) blob from storage
 * @param {any} currentState   the freshly-created store state (all slices + defaults)
 * @returns {any} the merged state the store adopts on rehydrate
 */
import { DEFAULT_CONFIG } from './configSlice.js';
import { DEFAULT_DISPLAY_PREFS } from './displayPrefsSlice.js';
import {
  inferLegacyUserContentTunableIntent,
  normalizeUserContentTunableIntent,
} from '../domain/content/userContentTunableIntent.js';

/**
 * The persisted anonymous draft, or null when the blob does not carry a genuine
 * one. FAIL CLOSED: only a plain object with a truthy `settlement` counts. An
 * absent key (a blob written before the draft existed), a bare `true` or a
 * string (a hand-edited or half-migrated blob), an empty `{}` (a stale envelope
 * whose payload was dropped) and an array all read as NOT ANONYMOUS, so the
 * draft is not adopted rather than adopted on a guess.
 *
 * @param {unknown} envelope the blob's `anonDraft` value
 * @returns {{ settlement: any, lastSeed: any }|null}
 */
export function readAnonDraft(envelope) {
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) return null;
  const draft = /** @type {Record<string, any>} */ (envelope);
  if (!draft.settlement) return null;
  return { settlement: draft.settlement, lastSeed: draft.lastSeed ?? null };
}

export function mergePersistedState(persistedState, currentState) {
  const persisted = /** @type {Record<string, any>} */ (persistedState || {});
  const current = /** @type {Record<string, any>} */ (currentState || {});
  // THE ANONYMOUS DRAFT, LIFTED OUT OF ITS ENVELOPE (2026-09-18). The envelope is
  // a TRANSPORT and is consumed here: the draft becomes live state, and the
  // marker is spent so nothing downstream can mistake a stale copy for a fresh
  // claim. `restoredAnonDraft` holds the restored settlement BY REFERENCE, which
  // is what lets the boot auth resolution (store/index.js) tell "the draft this
  // reload adopted" from "a world the visitor generated since" — a fresh
  // generation replaces the object, so the identity check can never drop it.
  const anonDraft = readAnonDraft(persisted.anonDraft);
  const configExplicitFields = Object.hasOwn(persisted, 'configExplicitFields')
    ? normalizeUserContentTunableIntent(persisted.configExplicitFields)
    : inferLegacyUserContentTunableIntent(persisted.config);
  return {
    ...current,
    ...persisted,
    // Deep-merge config over DEFAULT_CONFIG so newly-added default keys survive for a
    // returning user whose persisted config predates them.
    config: { ...DEFAULT_CONFIG, ...(persisted.config || {}) },
    // Pre-intent blobs can prove only non-default authored values. Default-valued
    // fields stay unmarked so an environment can supply its own defaults rather
    // than every materialized DEFAULT_CONFIG key becoming an accidental veto.
    configExplicitFields,
    // The toggle maps default to {} today, so this currently equals the shallow merge —
    // but it makes them robust the moment any gains a seeded default, closing the same
    // class for those keys too.
    institutionToggles: { ...(current.institutionToggles || {}), ...(persisted.institutionToggles || {}) },
    categoryToggles:    { ...(current.categoryToggles || {}),    ...(persisted.categoryToggles || {}) },
    goodsToggles:       { ...(current.goodsToggles || {}),       ...(persisted.goodsToggles || {}) },
    servicesToggles:    { ...(current.servicesToggles || {}),    ...(persisted.servicesToggles || {}) },
    // Same cohort-fork cure as `config`, for the persisted display-preference bag
    // (R-5b): a blob written before a preference existed — including one written
    // before the bag itself existed — backfills to the shipped default instead of
    // reading undefined at the consumer.
    displayPrefs:       { ...DEFAULT_DISPLAY_PREFS, ...(persisted.displayPrefs || {}) },
    // Lifted out of the envelope, or the slice defaults when the blob carries no
    // genuine anonymous draft. Written AFTER the spread so a hand-edited blob
    // cannot smuggle a top-level `settlement` past the envelope check.
    settlement:        anonDraft ? anonDraft.settlement : (current.settlement ?? null),
    lastSeed:          anonDraft ? anonDraft.lastSeed : (current.lastSeed ?? null),
    restoredAnonDraft: anonDraft ? anonDraft.settlement : null,
  };
}
