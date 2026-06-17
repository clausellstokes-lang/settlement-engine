/**
 * LockToggle — Padlock chip for protecting parts of a settlement from
 * regeneration. Wired to mapState.locks via setLock.
 *
 * Usage:
 *   <LockToggle which="identity" />              // boolean lock
 *   <LockToggle which="factions" id="merchants"/>// per-id lock in array
 *
 * Visually small — meant to live next to section headers.
 */

import { Lock, Unlock } from 'lucide-react';
import { useStore } from '../../store/index.js';
import IconButton from '../primitives/IconButton.jsx';

/**
 * @param {Object} props
 * @param {'identity'|'geography'|'factions'|'institutions'|'npcs'} props.which
 * @param {string} [props.id]   when `which` is an array key, the specific id
 * @param {string} [props.label] optional override for the tooltip
 */
export default function LockToggle({ which, id, label }) {
  const locks   = useStore(s => s.locks);
  const setLock = useStore(s => s.setLock);

  const isArrayKey = which === 'factions' || which === 'institutions' || which === 'npcs';
  const current = locks?.[which];
  const isLocked = isArrayKey
    ? Array.isArray(current) && id != null && current.includes(id)
    : !!current;

  function toggle() {
    if (isArrayKey) {
      const next = new Set(Array.isArray(current) ? current : []);
      if (isLocked) next.delete(id); else next.add(id);
      setLock(which, [...next]);
    } else {
      setLock(which, !isLocked);
    }
  }

  const Icon = isLocked ? Lock : Unlock;
  return (
    <IconButton
      type="button"
      Icon={Icon}
      onClick={toggle}
      pressed={isLocked}
      tone="ghost"
      size="sm"
      label={label || (isLocked
        ? 'Locked. Preserved through regeneration'
        : 'Unlocked. May change on regeneration')}
    />
  );
}
