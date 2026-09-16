/**
 * LockControls.jsx — the whole-section / world surface of the LOCKS ENGINE.
 *
 * A lock is the user's standing instruction "keep this when you roll again". The
 * store has written `state.locks` for a year; domain/locksPreservation.js is the
 * read side that finally honours it, and this is the only place a person can say
 * so. Without a control here the whole engine is unreachable — which is exactly
 * the finding (a registry row advertising an effect nothing exposed) this closes.
 *
 * LAZY LEAF. It is mounted through React.lazy from the tabs that own the reroll
 * buttons, imports the store handle and nothing heavy, and reaches the lock
 * predicates through the store's own helper seam — so no first-paint closure
 * grows to carry it.
 *
 * SCOPES, and why they are split this way. A lock is only legible next to the
 * button it governs:
 *   • `npcs` / `history` sit beside that section's Reroll, because that is the
 *     button they disarm.
 *   • `world` sits with the full generate, because identity, ground and past are
 *     what a whole new roll would otherwise take away.
 *
 * NOT "PINNED". The roster already has a PIN affordance and it is a different
 * promise: pinning protects a character from the AI rewriting its prose. A lock
 * protects from the dice. The copy below never uses the other word.
 *
 * LEGIBILITY: every string says what SURVIVES, in plain words, never mechanism —
 * "Rerolls keep the people here", not "regenSection refuses when npcs===true".
 */

import { useStore } from '../../store/index.js';
import { sans, FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

// One place for every word this control says — a section's noun, and the two
// states it can be in. Vetoable as single strings; nothing here is assembled
// from fragments at runtime.
const SECTIONS = {
  npcs: {
    label: 'the people',
    // The boundary is said out loud because the roster rows beside this control
    // now promise more than it does: locks engine Phase B carries an INDIVIDUALLY
    // locked character into a brand-new settlement, while this whole-section
    // boolean stops at rerolls (freezing a whole cast through a fresh roll would
    // nullify the roll — deliberately not built).
    locked: 'Locked. Rerolls keep the people here. A brand-new settlement still gets a new cast, so lock people one by one to bring them along.',
    open: 'Rerolls can replace the people here.',
    lockCta: 'Keep these people',
    unlockCta: 'Allow rerolls',
  },
  history: {
    label: 'this history',
    locked: 'Locked. Rerolls keep this history.',
    open: 'Rerolls can rewrite this history.',
    lockCta: 'Keep this history',
    unlockCta: 'Allow rerolls',
  },
};

const WORLD_LOCKS = [
  { key: 'identity', locked: 'Locked. A new roll keeps the name.', open: 'A new roll can rename the settlement.', lockCta: 'Keep the name', unlockCta: 'Allow a new name' },
  { key: 'geography', locked: 'Locked. A new roll keeps the same ground.', open: 'A new roll can move it to different ground.', lockCta: 'Keep this ground', unlockCta: 'Allow new ground' },
];

// `sans` is a font-family STRING, not a style object — spreading it would scatter
// its characters across the style as numeric keys, which React then tries to apply
// one by one. Assign it to fontFamily.
const noteStyle = { fontFamily: sans, fontSize: FS.xxs, color: swatch.inkMag, opacity: 0.75, margin: 0 };
const rowStyle = { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' };

/**
 * One lock, rendered as its own sentence plus the verb that flips it.
 * @param {{ note: string, cta: string, on: boolean, onToggle: () => void }} props
 */
function LockRow({ note, cta, on, onToggle }) {
  return (
    <div style={rowStyle}>
      <p style={noteStyle}>{note}</p>
      <Button variant="secondary" size="sm" onClick={onToggle} aria-pressed={on} style={{ flexShrink: 0 }}>
        {cta}
      </Button>
    </div>
  );
}

/**
 * @param {{ scope: 'npcs'|'history'|'world', onReroll?: (() => void)|null, style?: object }} props
 *   `scope` picks which locks this mount is responsible for (see the header for
 *   why they are split). `onReroll`, when given, moves that section's Reroll
 *   button INTO this control: the button and the lock that disarms it belong to
 *   one another, and keeping them in one component is what guarantees a locked
 *   section can never render an armed Reroll. The store's typed refusal is
 *   defense in depth behind this, not the user-facing explanation.
 */
export default function LockControls({ scope, onReroll = null, style }) {
  const locks = useStore(s => s.locks);
  const setLock = useStore(s => s.setLock);
  const clearLocks = useStore(s => s.clearLocks);

  if (scope === 'world') {
    // `locks` is sparse: an absent key means "not locked", which is why every
    // read here is `=== true` rather than a truthiness test on a possibly-array.
    const anyLock = !!locks && Object.keys(locks).length > 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {WORLD_LOCKS.map(({ key, locked, open, lockCta, unlockCta }) => {
          const on = locks?.[key] === true;
          return (
            <LockRow
              key={key}
              note={on ? locked : open}
              cta={on ? unlockCta : lockCta}
              on={on}
              onToggle={() => setLock(key, !on)}
            />
          );
        })}
        {anyLock && (
          <div style={rowStyle}>
            <Button variant="secondary" size="sm" onClick={() => clearLocks()} style={{ flexShrink: 0 }}>
              Clear all locks
            </Button>
            <p style={noteStyle}>Nothing will be held back from the next roll.</p>
          </div>
        )}
      </div>
    );
  }

  const copy = SECTIONS[scope];
  if (!copy) return null;
  // A whole-section lock is the boolean form of the key; the ARRAY form of the
  // same key names individuals and is driven from the roster rows themselves
  // (NPC_LOCK_COPY in components/new/npcComponents.jsx). Reading `=== true` keeps
  // the two forms from being confused for each other: a row toggle must never
  // write its array over this boolean, which would silently unlock the section,
  // so the row reports the section lock instead of overwriting it.
  const on = locks?.[scope] === true;
  return (
    <div style={{ ...rowStyle, ...style }}>
      {onReroll && (
        <Button variant="gold" size="sm" onClick={onReroll} disabled={on} style={{ flexShrink: 0 }}>
          ↺ Reroll
        </Button>
      )}
      <LockRow
        note={on ? copy.locked : copy.open}
        cta={on ? copy.unlockCta : copy.lockCta}
        on={on}
        onToggle={() => setLock(scope, !on)}
      />
    </div>
  );
}
