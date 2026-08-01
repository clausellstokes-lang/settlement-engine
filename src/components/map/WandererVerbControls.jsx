/**
 * WandererVerbControls.jsx — the DM's three verbs, as one control row
 * (design DESIGN_NPC_CONSEQUENCES.md §7, wave W-H4).
 *
 * ONE CONTROL SURFACE, TWO MOUNTS. The Wanderers register (world scope) and a
 * settlement dossier's Unaffiliates section (local scope) show the same people through
 * the same projection, so they get the same verbs from the same component. A second
 * control row would be a second place for the confirm/override/undo discipline to drift.
 *
 * THE OVERRIDE IS A DELIBERATE SECOND ACT. Design §7 makes ASSIGN sovereign: a DM may
 * walk a banished person back through the gate that threw them out. The domain verb
 * REFUSES that assignment unless the caller says "anyway" explicitly, and this control
 * is where the DM says it: the override checkbox appears only when a door is actually
 * shut, it is unchecked every time, and the receipt names what it set aside. A silent
 * override would be indistinguishable from a missing check.
 *
 * DEATH ASKS TWICE. Killing is the one act in the whole subsystem that removes somebody
 * from the world, so the button arms a confirm rather than firing. It is still undoable
 * (the verb hands back the record verbatim), and the row says so instead of implying
 * the act is final.
 *
 * THE UNDO IS A SURFACE CONTROL, NOT A ROW CONTROL, and the reason is the death verb.
 * `undoLastNpcVerb` walks back the newest ruling ON THIS CAMPAIGN, so its scope is the
 * register rather than any one person — but the deciding argument is reachability: a KILL
 * takes the record out of the ledger, the row for that person leaves the page with it, and
 * an undo button living inside that row would vanish at exactly the moment a DM wants it.
 * So WandererUndoControl below is mounted once per surface, beside the register rather than
 * inside a card, and it says which ruling came back rather than implying the row it sits
 * near. PRESENCE, NOT DISABLEMENT: with nothing to walk back it renders nothing at all
 * (it stays mounted only long enough to deliver the sentence for the undo just performed).
 *
 * DM-ONLY BY CONSTRUCTION. The mounts render both controls only for a proven owner session;
 * neither carries a player branch of its own, because a control that decides its own
 * audience is a control that can be mounted wrongly.
 */

import { useState } from 'react';

import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import { BODY, BORDER2, CARD_ALT, FS, MUTED, SECOND, sans } from '../theme.js';

const CONTROL_ROW = {
  display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
  paddingTop: 6, borderTop: `1px dashed ${BORDER2}`,
};

const NOTE = { color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontStyle: 'italic' };

/**
 * @param {Object} props
 * @param {string} props.campaignId
 * @param {string} props.wnpcId
 * @param {string} props.name
 * @param {boolean} props.doorsShut   at least one gate is shut against them
 * @param {ReadonlyArray<{ id: string, name: string }>} props.places  assignable settlements
 * @param {string} [props.defaultPlaceId]
 */
export default function WandererVerbControls({
  campaignId,
  wnpcId,
  name,
  doorsShut = false,
  places = [],
  defaultPlaceId = '',
}) {
  const assignNpc = useStore(s => s.assignNpc);
  const killNpc = useStore(s => s.killNpc);
  const pardonNpc = useStore(s => s.pardonNpc);
  const [placeId, setPlaceId] = useState(defaultPlaceId || places[0]?.id || '');
  const [override, setOverride] = useState(false);
  const [confirmingDeath, setConfirmingDeath] = useState(false);
  const [note, setNote] = useState('');
  // Both controls repeat once per person on the page, so their ids are keyed on the
  // durable id: a label must point at ITS OWN control, not the first one that rendered.
  const placeFieldId = `wanderer-place-${wnpcId}`;
  const overrideFieldId = `wanderer-override-${wnpcId}`;

  const run = async (fn) => {
    const result = await fn();
    setNote(noteFor(result, name));
  };

  return (
    <div data-testid="wanderer-verbs" style={{ display: 'grid', gap: 5 }}>
      <div style={CONTROL_ROW}>
        <label htmlFor={placeFieldId} style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900 }}>
          Settle them at
          <select
            id={placeFieldId}
            aria-label={`Settle ${name} at`}
            value={placeId}
            onChange={(e) => setPlaceId(e.target.value)}
            style={{ marginLeft: 5, fontFamily: sans, fontSize: FS.xxs, background: CARD_ALT, color: BODY, border: `1px solid ${BORDER2}` }}
          >
            {places.map(place => (
              <option key={place.id} value={place.id}>{place.name}</option>
            ))}
          </select>
        </label>
        <Button
          size="sm"
          disabled={!placeId}
          onClick={() => run(() => assignNpc(campaignId, {
            wnpcId, settlementId: placeId, overrideExclusions: override,
          }))}
        >
          Settle them
        </Button>
        {doorsShut && (
          <label htmlFor={overrideFieldId} style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              id={overrideFieldId}
              type="checkbox"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
              aria-label={`Set aside the order against ${name}`}
            />
            Set aside the order against them
          </label>
        )}
      </div>
      <div style={CONTROL_ROW}>
        <Button size="sm" onClick={() => run(() => pardonNpc(campaignId, { wnpcId }))}>
          Pardon them
        </Button>
        {!confirmingDeath && (
          <Button size="sm" onClick={() => setConfirmingDeath(true)}>
            Record their death
          </Button>
        )}
        {confirmingDeath && (
          <>
            <span style={NOTE}>Strike {name} from the register of the living?</span>
            <Button
              size="sm"
              onClick={() => { setConfirmingDeath(false); return run(() => killNpc(campaignId, { wnpcId })); }}
            >
              Yes, they are dead
            </Button>
            <Button size="sm" onClick={() => setConfirmingDeath(false)}>Not yet</Button>
          </>
        )}
      </div>
      {note && <div data-testid="wanderer-verb-note" style={NOTE}>{note}</div>}
    </div>
  );
}

/**
 * THE UNDO DOOR for the whole register: one control, campaign-scoped, mounted beside the
 * rows rather than inside one (see the module header for why the death verb settles that).
 *
 * It is ABSENT when there is nothing to walk back, which is the same presence rule the
 * register itself follows — a permanently greyed "Undo" would advertise a recovery the
 * session cannot perform. It stays up one beat longer than the ring does so the sentence
 * for the LAST undo is actually read: the note is what tells a DM which ruling came back.
 *
 * @param {Object} props
 * @param {string} props.campaignId
 */
export function WandererUndoControl({ campaignId }) {
  const undoLastNpcVerb = useStore(s => s.undoLastNpcVerb);
  // A COUNT, not the ring: a selector that returned the array would hand this control a
  // reference it must not read (the ring carries the DM-truth snapshots), and a number is
  // the only thing the door actually needs to know.
  const pending = useStore(s => undoableRulingCount(s.npcVerbUndoStack, campaignId));
  const [note, setNote] = useState('');

  if (pending === 0 && !note) return null;

  return (
    <div data-testid="wanderer-undo" style={{ ...CONTROL_ROW, borderTop: 'none' }}>
      {pending > 0 && (
        <Button
          size="sm"
          onClick={async () => setNote(undoNoteFor(await undoLastNpcVerb(campaignId)))}
        >
          Undo the last ruling
        </Button>
      )}
      {pending > 0 && (
        <span style={NOTE}>
          {pending === 1
            ? 'One ruling of yours can still be walked back.'
            : `${pending} rulings of yours can still be walked back, newest first.`}
        </span>
      )}
      {note && <span data-testid="wanderer-undo-note" style={NOTE}>{note}</span>}
    </div>
  );
}

/**
 * How many rulings on THIS campaign the session can still walk back. A DM running two
 * realms in one session must never be told the other realm's ring depth, which is why the
 * campaign id is compared rather than the ring simply counted.
 *
 * Total: a missing or unreadable ring reads as nothing to undo, never as an offer.
 *
 * @param {unknown} ring the session undo ring (store: npcVerbUndoStack)
 * @param {string} campaignId
 * @returns {number}
 */
export function undoableRulingCount(ring, campaignId) {
  const id = String(campaignId == null ? '' : campaignId);
  if (!id) return 0;
  let count = 0;
  for (const entry of Array.isArray(ring) ? ring : []) {
    const owner = entry && typeof entry === 'object' ? entry.campaignId : null;
    if (String(owner == null ? '' : owner) === id) count += 1;
  }
  return count;
}

/**
 * The one-line answer, in world words. A refusal is a SENTENCE about the realm, never a
 * token: `excluded_without_override` on a page would be the engine talking to itself.
 * @param {{ ok?: boolean, refusal?: string|null } | null | undefined} result
 * @param {string} name
 * @returns {string}
 */
export function noteFor(result, name) {
  if (!result) return '';
  if (result.ok) return 'Done, and it can be undone. The Herald carries it.';
  const refusal = String(result.refusal || '');
  if (refusal === 'excluded_without_override') {
    return `A standing order keeps ${name} out of that place. Set it aside to overrule it.`;
  }
  if (refusal === 'nothing_to_lift') return `Nothing stands against ${name} to lift.`;
  if (refusal === 'already_there') return `${name} is already settled there.`;
  if (refusal === 'unknown_identity') return `The register no longer holds ${name}.`;
  if (refusal === 'no_settlement') return 'Choose a place for them first.';
  if (refusal === 'dormant') return 'This realm does not follow its people once they leave.';
  if (refusal === 'advance_in_flight') return 'The realm is mid-advance. Let it finish, then rule.';
  return 'The realm did not act on that.';
}

/**
 * The undo's own answer, which cannot borrow `noteFor`: an undone ruling comes back
 * carrying the verb it REVERSED, so "Done, and it can be undone" would promise a redo the
 * ring does not hold. Each sentence says what the realm took back, by verb, without naming
 * a person — the control is campaign-scoped and does not know whose row it just restored.
 *
 * @param {{ ok?: boolean, verb?: string, refusal?: string|null } | null | undefined} result
 * @returns {string}
 */
export function undoNoteFor(result) {
  if (!result) return '';
  if (result.ok) {
    const verb = String(result.verb || '');
    if (verb === 'kill') return 'They are struck from the roll of the dead. The notice is withdrawn.';
    if (verb === 'assign') return 'They are back where they were. The notice is withdrawn.';
    if (verb === 'pardon') return 'What stood against them stands again. The notice is withdrawn.';
    return 'The ruling is walked back and the notice withdrawn.';
  }
  const refusal = String(result.refusal || '');
  if (refusal === 'nothing_to_undo') return 'There is no ruling of yours left to take back.';
  if (refusal === 'advance_in_flight') return 'The realm is mid-advance. Let it finish, then take it back.';
  return 'The realm did not take that back.';
}
