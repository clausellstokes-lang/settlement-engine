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
// The CANONICAL governing-faction accessors, deliberately imported rather than
// re-implemented. The coup shield matches the locked name against
// `nameOf(governingFactionOf(settlement))` (rulingPowerCoup.coupContenders builds
// `incumbent.name` that way), so a local four-line lookalike that ever disagreed
// would write a lock naming the WRONG faction — a control that says it protects
// the seat while protecting nobody. The edge is not new: SettlementDetail.jsx:36
// statically imports ChroniclePanel.jsx, which imports rulingPower.js at its
// line 26 — a LIVE chain. (Re-pointed 2026-08-11 per chair ruling R6; this cited
// dossier/EngineSections.jsx, which imports rulingPowerCoup.js rather than this
// module AND has no production importer at all, so it proved nothing.)
import { governingFactionOf, nameOf } from '../../domain/rulingPower.js';
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

/**
 * ⚠⚠ TWO ROW SHAPES, AND THE DIFFERENCE IS LOAD-BEARING — NOT COSMETIC.
 *
 * `identity` and `geography` are BOOLEAN locks: `setLock(key, true)`, read back as
 * `locks[key] === true`. `factions` is NAME-KEYED and cannot be either of those
 * things. Its reader is worldPulse/coup.js `lockedGoverningFaction`, which opens
 * with `if (!Array.isArray(locked) || !locked.length …) return false` and then
 * matches `stablePart()` of each entry against the incumbent's name. So a boolean
 * written under this key ARMS NOTHING: the control would light up "Locked", the
 * save would carry `factions: true`, and the coup would still auto-apply. That is
 * precisely the lying surface this row exists to remove, so the row carries
 * `nameKeyed` and the render below writes the governing faction's NAME.
 *
 * ⛔ NO RUNTIME STRING ASSEMBLY, including the faction's own name: every string
 * here is vetoable as a whole sentence (see the header). The row is HIDDEN when
 * there is no governing faction to name, which is honest — there is nothing to
 * keep in power — rather than offering a toggle that would write an empty lock.
 */
const WORLD_LOCKS = [
  { key: 'identity', locked: 'Locked. A new roll keeps the name.', open: 'A new roll can rename the settlement.', lockCta: 'Keep the name', unlockCta: 'Allow a new name' },
  { key: 'geography', locked: 'Locked. A new roll keeps the same ground.', open: 'A new roll can move it to different ground.', lockCta: 'Keep this ground', unlockCta: 'Allow new ground' },
  // ⏳ COPY IS A DRAFT FOR OWNER VETO. The wiring is the ruled part; these four
  // sentences are this lane's best reading of the house voice (say what SURVIVES,
  // plain words, never mechanism) and the owner keeps or rewrites them freely.
  // Note these speak about a COUP rather than "a new roll", because that is what
  // the lock actually governs — the other two rows guard the dice, this one
  // guards the seat.
  { key: 'factions', nameKeyed: true, locked: 'Locked. The ruling faction keeps the seat — a coup needs your approval first.', open: 'A coup can take the seat from the ruling faction.', lockCta: 'Keep them in power', unlockCta: 'Allow a coup' },
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
  // The name a `factions` lock has to write. Selected narrowly (the faction entry,
  // not the whole settlement) so this control re-renders on a seat change and not
  // on every unrelated settlement edit.
  const governingName = useStore(s => nameOf(governingFactionOf(s.settlement)));

  if (scope === 'world') {
    // `locks` is sparse: an absent key means "not locked", which is why every
    // read here is `=== true` rather than a truthiness test on a possibly-array.
    const anyLock = !!locks && Object.keys(locks).length > 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {WORLD_LOCKS.map(({ key, nameKeyed, locked, open, lockCta, unlockCta }) => {
          const current = locks?.[key];
          // A name-keyed lock is ON when it names anybody; a boolean lock is ON
          // only at exactly `true` (the sparse-map rule the header states).
          const on = nameKeyed
            ? Array.isArray(current) && current.length > 0
            : current === true;
          // Nothing to keep in power ⇒ no row at all, rather than a control that
          // would write a lock naming nobody.
          if (nameKeyed && !governingName) return null;
          return (
            <LockRow
              key={key}
              note={on ? locked : open}
              cta={on ? unlockCta : lockCta}
              on={on}
              // Unlocking writes `[]`, which setLock treats as DELETE the key —
              // the same erasure `false` performs for a boolean row, so an
              // unlocked faction leaves no residue for `anyLock` to count.
              onToggle={() => setLock(key, nameKeyed ? (on ? [] : [governingName]) : !on)}
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
