import { createContext, useContext, useEffect, useRef } from 'react';
import { useStore } from '../../store/index.js';

/**
 * useEntityFocus — THE ONE FOCUS CONVENTION every dossier card follows (RULINGS-CROSS X-20 (c)).
 *
 * A link click runs `navigateToEntity(id)`: the owning tab opens and the store's transient
 * `focusedEntity` is stamped `{ id, ts }`. The card whose OWN id (the same string the entity
 * index keys it by) matches then opens fully and scrolls itself to the top of the view. The
 * card does the scrolling from its own effect, so a lazy tab that mounts after the
 * navigator's timer still lands. Keyed on `ts`, so a repeat click of the same link re-fires
 * after the reader collapsed the card; focus only OPENS, a manual collapse afterwards works.
 * This generalises the convention the neighbour card and the Power roster already followed.
 *
 * `EntityFocusOverride` lets a surface force one card open without a navigation: the search
 * results view (X-19b) provides the id of its exact-name match, so the object the reader
 * typed the name of renders fully expanded where it was found. An override never scrolls.
 *
 * @example
 *   const [open, setOpen] = useState(false);
 *   const { ref } = useEntityFocus(entityIdFor('npc', npc), () => setOpen(true));
 *   return <div ref={ref} id={entityAnchor('npc', npc)}>…</div>;
 */
export const EntityFocusOverride = createContext(/** @type {string|null} */ (null));

/**
 * @param {string|null|undefined} id   the card's own entity id (as the index keys it)
 * @param {(() => void)} [onFocus]      opens the card (sets its own open state)
 * @returns {{ ref: import('react').MutableRefObject<any>, isFocused: boolean }}
 */
export function useEntityFocus(id, onFocus) {
  const focusedEntity = useStore(s => s.focusedEntity);
  const forcedId = useContext(EntityFocusOverride);
  const ref = useRef(null);
  // The latest opener, so the effect below never closes over a stale card state.
  const onFocusRef = useRef(onFocus);
  useEffect(() => { onFocusRef.current = onFocus; });
  const key = id == null ? '' : String(id);
  const storeFocused = !!key && focusedEntity?.id === key;
  const forced = !!key && forcedId === key;
  const ts = focusedEntity?.ts;
  useEffect(() => {
    if (!storeFocused && !forced) return;
    onFocusRef.current?.();
    if (storeFocused) ref.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, [ts, storeFocused, forced]);
  return { ref, isFocused: storeFocused || forced };
}

export default useEntityFocus;
