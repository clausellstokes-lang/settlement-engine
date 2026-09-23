/**
 * EditModeShell.jsx — THE EDIT-MODE SHELL (EM-D1, wave 4).
 *
 * The tome's register while the mode is on: the mode indicator in the forge's gold, a
 * PENCIL on every card EM-A1 declares, a PLUS on every roster, the SEALS design §17
 * places on the process cards, §14's provenance note where a derivation would otherwise
 * wear a pencil, and Done. It is the first surface that MOUNTS EM-D0e's door.
 *
 * ⛔ IT IS MOUNTED LAZILY AND THAT IS ITS PRICE. `src/App.jsx` reaches this leaf through
 * `lazy(() => import(...))`, and the eager first-paint graph walks STATIC edges only, so
 * this file, EM-A1's declaration table, EM-D0e's door and EM-C4a's store slice all stay
 * out of the first-paint closure. `tests/build/vendorPdfLazy.test.js`'s editor-train arm
 * prices that claim against the build config's own exported derivation.
 *
 * ⛔ IT SPELLS NO TIER LITERAL AND FLIPS NO GATE (design §20.4, judgment 268). The door's
 * visibility is an OWNER-SIGNED act: this shell READS `canEditSettlement()` exactly as
 * that predicate stands and says so in the house's own refusal shape when it answers
 * false. Premium enters the day the owner deletes the predicate's second conjunct, with
 * zero change here.
 *
 * ⛔ IT REACHES THE WRITER THROUGH THE ONE INJECTED SEAM. The door's `apply` prop is bound
 * to EM-C4b's `applyPlainEditIntent`, the single binder that turns the four coordinates a
 * component can honestly know into the writer's request through the estate's one generic
 * command adapter. This leaf imports no op producer and no layer, which is the whole of
 * what `tests/lint/editMutationPath.walker.test.js` convicts.
 *
 * ⛔ IT READS NO WORLD PREDICATE AT THIS LANDING, and the copy says so rather than
 * implying otherwise. `src/domain/edit/worldConditions.js` has no importer under `src/`,
 * and EM-E4/EM-E7 own the acts themselves; so every seal renders DISABLED beside the
 * state design §18 says it needs, under one standing note that names the boundary. That
 * is §19 ruling 2's own register for an unbuilt seam, not a measurement of the live world.
 *
 * ⛔ THE PENCIL BINDS BY ROLE AND NAME (judgment 264c). No marker attribute is minted
 * anywhere in this file; a reader finds a pencil the way a DM does, by its words.
 *
 * ⭐ THE FOURTH ROSTER IS THE COUNTERPARTIES (EM-F3, design §2.8; the chair's judgment 275).
 * The three roster roots above are collections of the record; this one is not on the record at
 * all — it is the town's neighbour partners and the DM's own off-stage counterparties, which
 * are SAVES (EM-F1). Its plus opens the SAME door in CREATE mode on EM-A1's `phantom` card, and
 * each off-stage row carries the FORGE control that hands EM-F2's promotion the row's own id.
 *
 * ⛔ AND IT REACHES NEITHER THE PHANTOM LEAF NOR THE POOL TABLE. This file's edge set into
 * `src/domain/edit/` is EXACTLY the declaration table, pinned by its own arm, so the reading of
 * a counterparty's reality and the mint itself are bound the way EM-D1 bound the writer: one
 * function from the store, passed down. Nothing about a phantom is decided here.
 *
 * ⚠ THE REGISTER IS PER CARD TYPE, NOT PER SUBJECT. The shell places one mark per card
 * the tome shows and opens the door on that card's FIRST subject; the per-entity pencils
 * ride the dossier's own cards, which are not this member's files. That is a scope line,
 * recorded, and it is why `subjectOf` returns null rather than guessing when a card's
 * collection is empty: the pencil is then rendered and disabled, never absent.
 */
import { useId, useState } from 'react';

import { t } from '../../copy/index.js';
import { savePhase } from '../../domain/campaign/canon.js';
import { declarationsFor, isEditableCard } from '../../domain/edit/fieldDeclarations.js';
import {
  applyPlainEditIntent, EDITOR_MODE_OFF, EDITOR_MODE_PREF_KEY, selectEditorMode,
} from '../../store/editSlice.js';
import { useStore } from '../../store/index.js';
import { counterpartiesOf, mintPhantomIntent } from '../../store/phantomMintAction.js';
import { raisedHere, REFUSAL_SURFACES } from '../../lib/refusalReasons.js';
import { ClerkNote } from '../generate/ClerkNote.jsx';
import Button from '../primitives/Button.jsx';
import RefusalNotice from '../primitives/RefusalNotice.jsx';
import { BORDER, GOLD, GOLD_TXT, INK, MUTED, sans, serif_, FS, SP } from '../theme.js';
import CardEditorDialog from './CardEditorDialog.jsx';

/** @typedef {import('../../domain/edit/types.js').FieldDeclaration} FieldDeclaration */

/** One card's first subject: the record row the door opens on. */
/** @typedef {{ id: string, values: Record<string, unknown> }} CardSubject */

/**
 * ⭐ THE TOME'S REGISTER — the cards edit mode marks, in reading order, as PLAIN IDS.
 *
 * ⛔ WHICH MARK A ROW WEARS IS NOT WRITTEN HERE, and that is the point of the list being
 * flat. `isEditableCard` decides the pencil, `SEALS` decides the acts, and a card that is
 * neither takes §14's provenance note. So a row EM-A1 does not declare cannot grow a
 * pencil by an edit to this file, and the five declared card types cannot lose one.
 * @type {readonly string[]}
 */
const CARD_REGISTER = Object.freeze([
  'worldFact', 'npc', 'institution', 'faction', 'powerSeat',
  'war', 'trade', 'rumour', 'chronicle',
  'goods', 'services',
]);

/**
 * ⭐ THE CREATE-ONLY CARD. EM-A1 declares it, and it wears NO pencil: its subject is a save of
 * its own rather than a row of this record, so `CARD_REGISTER` above does not name it and the
 * only door onto it is the counterparties roster's plus. Spelled once, here.
 */
const PHANTOM_CARD = 'phantom';

/** The subject a CREATE door opens on: no row, no values, and the door generates from the table. */
/** @type {CardSubject} */
const NEW_SUBJECT = Object.freeze({ id: '', values: Object.freeze({}) });

/**
 * ⭐ DESIGN §17's ACTS, BY THE CARD THEY START ON, each with the §18 world-state
 * condition it needs. `needs` is the id of a `WORLD_CONDITIONS` row (plus §18's own
 * `always` for the chronicle's catalogue), and it is the JOIN to the copy registry's
 * reason line rather than an import: this leaf must not carry the predicate volume into
 * a bundle closure, and the condition's prose has no home in that leaf.
 *
 * ⛔ `npc` CARRIES BOTH MARKS. A person's card wears EM-A1's pencils and §17's mission
 * seal, which is exactly the design's "the same gesture edits a fact and directs a
 * process, and the glyph tells them which".
 * @type {Readonly<Record<string, readonly {seal: string, needs: string}[]>>}
 */
const SEALS = Object.freeze({
  war: Object.freeze([
    Object.freeze({ seal: 'suePeace', needs: 'warInProgress' }),
    Object.freeze({ seal: 'acceptPeace', needs: 'pendingPeaceOffer' }),
    Object.freeze({ seal: 'refusePeace', needs: 'pendingPeaceOffer' }),
    Object.freeze({ seal: 'directForce', needs: 'forceInField' }),
    Object.freeze({ seal: 'resupply', needs: 'forceInField' }),
    Object.freeze({ seal: 'letSiegeFall', needs: 'siegeInProgress' }),
    Object.freeze({ seal: 'letCoupFail', needs: 'plotInMotion' }),
  ]),
  trade: Object.freeze([
    Object.freeze({ seal: 'receiveEnvoy', needs: 'envoyArrived' }),
    Object.freeze({ seal: 'turnEnvoyAway', needs: 'envoyArrived' }),
    Object.freeze({ seal: 'directTrade', needs: 'openRoute' }),
    Object.freeze({ seal: 'embargo', needs: 'tradeWith' }),
  ]),
  rumour: Object.freeze([
    Object.freeze({ seal: 'confirmRumour', needs: 'beliefExists' }),
    Object.freeze({ seal: 'castDoubt', needs: 'beliefExists' }),
    Object.freeze({ seal: 'twistRumour', needs: 'beliefExists' }),
  ]),
  chronicle: Object.freeze([
    Object.freeze({ seal: 'scheduleEvent', needs: 'always' }),
  ]),
  npc: Object.freeze([
    Object.freeze({ seal: 'sendOnMission', needs: 'npcPresent' }),
  ]),
});

/**
 * ⭐ §14 item 3's DERIVED CARDS and the editable card each follows from. The two rows are
 * EM-A1's own measurement, quoted from `fieldDeclarations.js`'s header: goods and services
 * "are keys of the world-fact vocabulary, but the wizard's toggles never reach the
 * settlement record and what the record holds nearby is their DERIVATION, which design §14
 * forbids declaring". So the source is the world-fact card, measured rather than invented,
 * and no producer map is minted here.
 * @type {Readonly<Record<string, string>>}
 */
const DERIVED_SOURCE = Object.freeze({ goods: 'worldFact', services: 'worldFact' });

/**
 * The copy key of one register row's name. A literal per row, never a built string, so a
 * key that stops resolving is a walker's find rather than a raw dotted word at a reader.
 * @type {Readonly<Record<string, string>>}
 */
const CARD_NAME_KEYS = Object.freeze({
  chronicle: 'edit.shell.card.chronicle',
  faction: 'edit.shell.card.faction',
  goods: 'edit.shell.card.goods',
  institution: 'edit.shell.card.institution',
  npc: 'edit.shell.card.npc',
  powerSeat: 'edit.shell.card.powerSeat',
  rumour: 'edit.shell.card.rumour',
  services: 'edit.shell.card.services',
  trade: 'edit.shell.card.trade',
  war: 'edit.shell.card.war',
  worldFact: 'edit.shell.card.worldFact',
});

/** The copy key of one act's name, by §17's own words. @type {Readonly<Record<string, string>>} */
const SEAL_NAME_KEYS = Object.freeze({
  acceptPeace: 'edit.shell.seal.acceptPeace',
  castDoubt: 'edit.shell.seal.castDoubt',
  confirmRumour: 'edit.shell.seal.confirmRumour',
  directForce: 'edit.shell.seal.directForce',
  directTrade: 'edit.shell.seal.directTrade',
  embargo: 'edit.shell.seal.embargo',
  letCoupFail: 'edit.shell.seal.letCoupFail',
  letSiegeFall: 'edit.shell.seal.letSiegeFall',
  receiveEnvoy: 'edit.shell.seal.receiveEnvoy',
  refusePeace: 'edit.shell.seal.refusePeace',
  resupply: 'edit.shell.seal.resupply',
  scheduleEvent: 'edit.shell.seal.scheduleEvent',
  sendOnMission: 'edit.shell.seal.sendOnMission',
  suePeace: 'edit.shell.seal.suePeace',
  turnEnvoyAway: 'edit.shell.seal.turnEnvoyAway',
  twistRumour: 'edit.shell.seal.twistRumour',
});

/**
 * The copy key of one §18 condition's herald line, keyed by the condition's own id.
 * @type {Readonly<Record<string, string>>}
 */
const REASON_KEYS = Object.freeze({
  always: 'edit.shell.reason.always',
  beliefExists: 'edit.shell.reason.beliefExists',
  envoyArrived: 'edit.shell.reason.envoyArrived',
  forceInField: 'edit.shell.reason.forceInField',
  npcPresent: 'edit.shell.reason.npcPresent',
  openRoute: 'edit.shell.reason.openRoute',
  pendingPeaceOffer: 'edit.shell.reason.pendingPeaceOffer',
  plotInMotion: 'edit.shell.reason.plotInMotion',
  siegeInProgress: 'edit.shell.reason.siegeInProgress',
  tradeWith: 'edit.shell.reason.tradeWith',
  warInProgress: 'edit.shell.reason.warInProgress',
});

/**
 * ⭐ THE COLLECTION A CARD'S SUBJECTS LIVE IN, READ OUT OF EM-A1's OWN `outputKey` AND
 * NEVER RETYPED. `npcs[].name` names the collection `npcs`; `powerStructure.factions[]
 * .faction` names a nested one; a card whose rows carry no `[]` at all has exactly ONE
 * subject, the settlement itself, and answers the empty string. A rename upstream moves
 * this reader with it instead of leaving a bare path pointing at nothing.
 * @param {readonly FieldDeclaration[]} rows
 * @returns {string}
 */
function collectionOf(rows) {
  const keyed = rows.filter((row) => typeof row.outputKey === 'string' && row.outputKey.includes('[]'));
  return keyed.length > 0 ? String(keyed[0].outputKey).split('[]')[0] : '';
}

/**
 * One dotted path read off a record. Total, never a throw, `undefined` on any absence.
 * @param {unknown} record @param {string} path
 * @returns {unknown}
 */
function readPath(record, path) {
  /** @type {unknown} */
  let branch = record;
  for (const part of path.split('.')) {
    branch = branch !== null && typeof branch === 'object'
      ? /** @type {Record<string, unknown>} */ (branch)[part]
      : undefined;
  }
  return branch;
}

/**
 * THE CARD'S FIRST SUBJECT, or null when the record holds none. `null` is a real answer
 * and the caller renders a disabled pencil for it: a card with no people on it is not a
 * card without a pencil, it is a pencil with nothing to open.
 * @param {unknown} record @param {string} cardType
 * @returns {CardSubject|null}
 */
function subjectOf(record, cardType) {
  if (record === null || typeof record !== 'object') return null;
  const whole = /** @type {Record<string, unknown>} */ (record);
  const path = collectionOf(declarationsFor(cardType));
  if (path === '') return { id: String(whole.id ?? ''), values: whole };
  const rows = readPath(whole, path);
  const first = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  if (first === null || typeof first !== 'object') return null;
  const values = /** @type {Record<string, unknown>} */ (first);
  return { id: String(values.id ?? ''), values };
}

/**
 * The values the door shows for one subject, as the strings EM-D0e's controls take.
 * @param {CardSubject|null} subject @param {readonly FieldDeclaration[]} rows
 * @returns {Record<string, string>}
 */
function valuesOf(subject, rows) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const row of rows) out[row.field] = String(subject?.values?.[row.field] ?? '');
  return out;
}

/**
 * THE EDIT-MODE SHELL. It takes no props: everything it shows is read off the store the
 * mount already composes, which is what lets `src/App.jsx` mount it as a one-liner behind
 * a lazy edge and keeps the route table out of it.
 */
export default function EditModeShell() {
  const headingId = useId();
  const mode = useStore((state) => selectEditorMode(state));
  const settlement = useStore((state) => state.settlement);
  const saved = useStore((state) => state.savedSettlements);
  const generate = useStore((state) => state.generateSettlement);
  // ⛔ NO GATE REFUSES SILENTLY (the owner's ruling, ODQ §934.24(c)). The Forge control
  // reaches the generation lane, so it can be handed the same gate refusals every other forge
  // can, and the DM is told WHERE SHE CLICKED. The record is ONE store slot that every mount
  // renders, so the call stamps its own surface and this mount asks whether the record is its
  // own before it says anything.
  const lastRefusal = useStore((state) => state.lastRefusal);
  const seed = useStore((state) => state.lastSeed);
  const phase = useStore((state) => savePhase(state));
  const setUserPref = useStore((state) => state.setUserPref);
  const admitted = useStore(
    (state) => (typeof state.canEditSettlement === 'function' ? state.canEditSettlement() : false),
  );
  /** @type {[{cardType: string, subject: CardSubject, create: boolean}|null, Function]} */
  const [open, setOpen] = useState(null);

  const leaveMode = () => setUserPref?.(EDITOR_MODE_PREF_KEY, EDITOR_MODE_OFF);

  // ⛔ THE ONE BINDING OF THE WRITER. The store handles are passed as the binder's own
  // first two parameters, so this leaf holds no `get`/`set` of its own and mints no
  // second path; the four coordinates come from the door, verbatim.
  /** @param {{cardType: string, entityId: string, field: string, value: string}} intent */
  const apply = (intent) => applyPlainEditIntent(useStore.getState, useStore.setState, intent);

  // ⛔ THE ONE BINDING OF THE MINT, in the identical shape and for the identical reason: the
  // door hands over the declared values and knows nothing about records, pools or saves.
  /** @param {Record<string, string>} values */
  const mint = (values) => mintPhantomIntent(useStore.getState, useStore.setState, values);

  // The forge's gold on the tome's own ground (design §3). The halo and the umber belong
  // to the POP-UP alone (§3 halo item 5), so nothing here carries either.
  const rubric = {
    fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: GOLD_TXT, margin: 0,
  };
  const head = { ...rubric, color: INK, marginTop: SP.md };
  const line = { fontFamily: serif_, fontSize: FS.sm, color: INK, margin: 0 };
  const quiet = { fontFamily: sans, fontSize: FS.sm, color: MUTED };
  const rowBox = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SP.sm };
  const frame = {
    display: 'flex', flexDirection: 'column', gap: SP.sm,
    padding: `${SP.md}px ${SP.lg}px`, border: `1px solid ${GOLD}`, textAlign: 'left',
  };

  // ⛔ THE MODE IS READ THROUGH THE SLICE'S OWN READER, and OFF renders nothing at all.
  // `src/App.jsx` mounts this leaf on a bare truthiness read of the preference bag, which
  // is what keeps the store slice out of the eager closure; the authoritative reading of
  // the stored word — an unknown value is OFF — belongs here, beside the slice that owns
  // the vocabulary. So the mount is cheap and the meaning has exactly one home.
  if (mode === EDITOR_MODE_OFF) return null;

  // THE GATE, READ AS IT STANDS. A refused account gets ONE notice in the house's own
  // shape and nothing else: no register, no door, no control that would refuse later.
  if (admitted !== true) {
    return (
      <section aria-labelledby={headingId} style={frame}>
        <h2 id={headingId} style={rubric}>{t('edit.shell.title')}</h2>
        <ClerkNote role="alert" rubric={t('edit.shell.refusalRubric')}>
          {t('edit.shell.refusalGated')}
        </ClerkNote>
      </section>
    );
  }

  /** @param {string} cardType */
  const pencilRow = (cardType) => {
    const subject = subjectOf(settlement, cardType);
    const name = t(CARD_NAME_KEYS[cardType]);
    const roster = collectionOf(declarationsFor(cardType)) !== '';
    return (
      <div key={cardType} style={rowBox}>
        <Button
          variant="secondary"
          size="sm"
          disabled={subject === null}
          onClick={() => subject !== null && setOpen({ cardType, subject, create: false })}
        >
          {t('edit.shell.pencil', { card: name })}
        </Button>
        {roster ? (
          <Button variant="ghost" size="sm" disabled>
            {t('edit.shell.plus', { card: name })}
          </Button>
        ) : null}
        {roster ? <span style={quiet}>{t('edit.shell.plusReason')}</span> : null}
      </div>
    );
  };

  /** @param {string} cardType */
  const sealBlock = (cardType) => (
    <div
      key={cardType}
      style={{
        display: 'flex', flexDirection: 'column', gap: SP.xs,
        borderTop: `1px solid ${BORDER}`, paddingTop: SP.xs,
      }}
    >
      <span style={quiet}>{t(CARD_NAME_KEYS[cardType])}</span>
      {SEALS[cardType].map((act) => (
        <div key={act.seal} style={rowBox}>
          <Button variant="secondary" size="sm" disabled>{t(SEAL_NAME_KEYS[act.seal])}</Button>
          <span style={quiet}>{t(REASON_KEYS[act.needs])}</span>
        </div>
      ))}
    </div>
  );

  /** @param {string} cardType */
  const provenanceRow = (cardType) => (
    <div key={cardType} style={rowBox}>
      <span style={line}>{t(CARD_NAME_KEYS[cardType])}</span>
      <span style={quiet}>
        {t('edit.shell.provenance', { source: t(CARD_NAME_KEYS[DERIVED_SOURCE[cardType]]) })}
      </span>
    </div>
  );

  /**
   * ⭐ ONE OFF-STAGE ROW. The reality mark and the Forge control are the same fact read twice:
   * a row the roster reports off-stage is a phantom save, so it is the one that may be forged.
   * The lane is handed the row's own id under `promote` and the surface stamp under `at`, and
   * NOTHING ELSE: no seed, no intent, no config. The forge takes the phantom's OWN seed, which
   * is EM-F2's landed contract rather than this leaf's argument, and `at` changes nothing about
   * the generation beyond naming which surface any refusal belongs to.
   * @param {{ id: string, name: string, offStage: boolean }} row
   */
  const counterpartyRow = (row) => (
    <div key={row.id} style={rowBox}>
      <span style={line}>{row.name}</span>
      <span style={quiet}>
        {row.offStage ? t('edit.shell.counterparty.offStage') : t('edit.shell.counterparty.real')}
      </span>
      {row.offStage ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => generate?.(undefined, {
            promote: row.id, at: REFUSAL_SURFACES.EDIT_FORGE,
          })}
        >
          {t('edit.shell.counterparty.forge')}
        </Button>
      ) : null}
    </div>
  );

  const counterparties = counterpartiesOf(settlement, saved);
  const declared = CARD_REGISTER.filter((cardType) => isEditableCard(cardType));
  const sealed = CARD_REGISTER.filter((cardType) => Object.hasOwn(SEALS, cardType));
  const derived = CARD_REGISTER.filter((cardType) => Object.hasOwn(DERIVED_SOURCE, cardType));
  const openRows = open === null ? declarationsFor('') : declarationsFor(open.cardType);

  return (
    <section aria-labelledby={headingId} style={frame}>
      <h2 id={headingId} style={rubric}>{t('edit.shell.title')}</h2>
      <p style={line}>{t('edit.shell.indicator')}</p>

      <h3 style={head}>{t('edit.shell.cardsHead')}</h3>
      {declared.map((cardType) => pencilRow(cardType))}

      <h3 style={head}>{t('edit.shell.actsHead')}</h3>
      <ClerkNote rubric={t('edit.shell.actsHead')}>{t('edit.shell.actsNote')}</ClerkNote>
      {sealed.map((cardType) => sealBlock(cardType))}

      <h3 style={head}>{t('edit.shell.counterpartiesHead')}</h3>
      <div style={rowBox}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setOpen({ cardType: PHANTOM_CARD, subject: NEW_SUBJECT, create: true })}
        >
          {t('edit.shell.counterparty.add')}
        </Button>
        <span style={quiet}>{t('edit.shell.counterparty.note')}</span>
      </div>
      {counterparties.length === 0
        ? <span style={quiet}>{t('edit.shell.counterparty.none')}</span>
        : counterparties.map((row) => counterpartyRow(row))}
      <RefusalNotice
        refusal={raisedHere(lastRefusal, REFUSAL_SURFACES.EDIT_FORGE) ? lastRefusal : null}
      />

      <h3 style={head}>{t('edit.shell.derivedHead')}</h3>
      {derived.map((cardType) => provenanceRow(cardType))}

      <Button variant="primary" size="sm" onClick={leaveMode}>{t('edit.shell.done')}</Button>

      <CardEditorDialog
        open={open !== null}
        cardType={open === null ? '' : open.cardType}
        entityId={open === null ? '' : open.subject.id}
        values={open === null ? {} : valuesOf(open.subject, openRows)}
        world={settlement ?? null}
        seed={String(seed ?? '')}
        phase={phase === 'draft' ? 'draft' : 'canon'}
        apply={open !== null && open.create ? null : apply}
        create={open !== null && open.create ? mint : null}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
