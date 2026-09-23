/**
 * DecreeRegistryPage.jsx — THE REGISTRY PAGE AT THE DOSSIER'S FOOT (EM-D3, wave 4;
 * design §2.5, §2.5a, §3's registry row, §12.1 and §12.2; ARCH §87).
 *
 * ONE page of decrees: the waiting sequence in the DM's own order with move, withdraw and
 * reopen; the guard badges with their offers inline; the realm's own Advance control when
 * the settlement is in a campaign and the estate's existing rung when it is not; the
 * rewind's session limit stated; the applied entries below, read-only, with their
 * chronicle links; the withdrawn kept for the record (design §2.5: application never
 * deletes an entry).
 *
 * ⛔ IT LANDS DARK. Nothing mounts it at this landing, so no account sees anything new and
 * the eager first-paint closure gains 0 members (`EAGER_FIRST_PAINT_MODULES` walks STATIC
 * edges from the shell entry, and no edge reaches this leaf). The mount is EM-D1's, behind
 * the tier gate that member owns: this file spells no gate, names no tier and reads no
 * entitlement.
 *
 * ⛔ IT IS A CONTAINER, NOT A WRITER, AND IT HOLDS NO STATE AT ALL. Everything it cannot
 * honestly know arrives as a prop — EM-D0e's landed idiom one layer up. It imports nothing
 * from `src/store` or `src/application` (ARCH §28: no store writer is reachable from
 * `src/components/edit/**` except the op boundary), draws no random number, reads no clock,
 * runs no effect, mounts no portal and touches no browser storage. Two renders with the
 * same props reach the same markup.
 *
 * ⛔ THE STORE'S ACTIONS ARE CALLED BY THEIR DECLARED NAMES, AND THE REQUEST IS THE STORE'S
 * OWN SHAPE. `actions` is EM-C4b's `DECREE_ACTIONS` bound by the caller; this page reaches
 * exactly the two verbs a registry page writes with — `reorder` (move up, move down) and
 * `withdraw` — and hands each the request that member's `commitRegistry` reads
 * (`{ saveId, entryId, ... }`), so a caller can bind the landed action itself and nothing
 * here re-shapes a request on the way. `REGISTRY_ACTION_NAMES` below is that vocabulary,
 * exported so a test pins it against the store's own declaration rather than re-typing it.
 *
 * ⛔ REOPEN IS A SEAM, NOT A WRITE, AND THAT IS THE DESIGN'S OWN SPLIT. Design §2.5a: the
 * click reopens the entry's own card with its values (the modal reappears) and SAVE returns
 * it to exactly its place in the order — so EM-C1's `reopen(registry, entryId, op)` is what
 * the modal's Save makes, with the op the DM edited, and a page that called it on the click
 * would write an entry's own op back over itself and claim a change nobody made. The
 * control is offered on PENDING entries only (the charter's row; ARCH §87: an applied entry
 * opens read-only), and the applied rows carry their chronicle link instead.
 *
 * ⛔ AN OFFER WITH NO WRITER IS WORDS, NOT A CONTROL. Design §2.7's three offers are writes
 * (fulfil INSERTS a seeded entry, proceed RECORDS the override on the entry), and at this
 * tip neither writer exists: EM-C1 mints no override verb and EM-C4b's `DECREE_ACTIONS`
 * carries none. So each offer renders as a control exactly when the caller supplies the
 * `onGuardOffer` seam and as a stated offer otherwise, and this page invents no writer.
 *
 * ⛔ IT NAMES THE OP TYPE AND NEVER A CATALOGUE LABEL. A row says what it does and what it
 * requires out of the ENTRY (`op.type`, `op.target`, `op.requires`), because `OP_TYPES` is
 * one of the four symbols `tests/lint/editMutationPath.walker.test.js` convicts a component
 * for importing: reaching the catalogue for a prettier label would make this page a second
 * mutation path by that walker's own predicate. The written line is EM-E2's chronicle
 * prose, which does not exist at this wave.
 *
 * ⛔ THE WAITING ORDER IS `orderIndex` THEN `id`, WHICH IS THE LIST `reorder` ITSELF
 * ADDRESSES. EM-C1's `reorder` computes the pending list as `orderIndex` ascending with a
 * codepoint tie-break on `id`, and permutes the entries over the index values they already
 * occupy; a move is therefore a position in THAT list, and a page that ordered by any other
 * reading would move the wrong row. The comparator's second key is the estate's own
 * `compareCodepoint`, never a default sort. Design §11's `when` schedule is the TICK's fold
 * and is not restated here: this page draws the DM's list, which is the thing the controls
 * act on.
 *
 * ⛔ THE TOME'S IDIOM, AND NO HALO. Design §3's halo ruling item 5: the glow belongs to the
 * editor's pop-up only and never to the registry page, which stays in the tome's idiom. So
 * this page carries the house card tokens and no glow, no elevation and no new hex.
 *
 * ⛔ THE ADVANCE CONTROL IS THE REALM'S OWN (design §12.2). The realm already owns it
 * (`WorldMapToolbar.jsx`: `handleAdvanceRealm` behind the Advance Realm control, rendered
 * only while `campaignActive`), so this page renders the caller's control in a slot and
 * mints none; outside a campaign it shows the estate's EXISTING rung from the copy registry
 * (`detail.sendToRealmCta` / `detail.sendToRealmHint`) and no advance affordance at all.
 * The locked viewer is the mount's case and the estate has one gate for it already
 * (`src/components/map/RealmLockedGate.jsx`): this page mints no second gate and no upsell.
 */
import { t } from '../../copy/index.js';
import { compareCodepoint } from '../../domain/deterministicSort.js';
import Button from '../primitives/Button.jsx';
import { BODY, BORDER, CARD, CARD_ALT, FS, GOLD, INK, SECOND, SP, sans } from '../theme.js';

/** ONE shared frozen empty list, so an absent prop allocates nothing. */
const NO_ROWS = Object.freeze([]);

/** EM-C2's verdict as the engine hands it back, at its absence value. */
const EMPTY_VERDICT = Object.freeze({ guards: NO_ROWS, unevaluated: NO_ROWS });

/**
 * The three sections, in the order the page draws them, each with the heading it wears.
 * EXPORTED so a test pins `status` SET-EQUAL IN BOTH DIRECTIONS against EM-C1's own
 * `DECREE_STATUSES` rather than re-typing the vocabulary: a fourth status that grew a verb
 * and no section would show up there.
 */
export const STATUS_SECTIONS = Object.freeze([
  Object.freeze({ status: 'pending', heading: 'Waiting' }),
  Object.freeze({ status: 'applied', heading: 'Applied' }),
  Object.freeze({ status: 'withdrawn', heading: 'Withdrawn' }),
]);

/**
 * Who staged an entry, in the reader's words (design §2.7: a guard's own entry is visible,
 * seeded, editable and marked as added by the guard; §3: the Surveyor's proposals land as
 * decrees). Pinned SET-EQUAL against `DECREE_AUTHORS`.
 */
export const AUTHOR_LABELS = Object.freeze({
  dm: 'Yours',
  guard: 'Added by a guard',
  surveyor: 'From the Surveyor',
});

/** EM-C2's five kinds in the reader's words. Pinned SET-EQUAL against `GUARD_KINDS`. */
export const GUARD_KIND_LABELS = Object.freeze({
  connection: 'Connection',
  contention: 'Contention',
  contradiction: 'Contradiction',
  prerequisite: 'Prerequisite',
  totality: 'Totality',
});

/**
 * The seven offers in the reader's words (design §2.7 and §2.7a). Pinned SET-EQUAL against
 * `GUARD_OFFERS`, so an offer the engine can mint always has words and a control can never
 * offer a word the engine does not know.
 */
export const GUARD_OFFER_LABELS = Object.freeze({
  fulfil: 'Fulfil it for me',
  keepBoth: 'Keep both',
  keepFirst: 'Keep the first',
  keepLast: 'Keep the last',
  proceed: 'Proceed anyway',
  reorder: 'Reorder them',
  self: 'I will do it myself',
});

/**
 * The store verbs this page WRITES with, exported so a test pins them inside EM-C4b's
 * `DECREE_ACTIONS`. `reopen` is deliberately absent: it is the modal's Save (see the header).
 */
export const REGISTRY_ACTION_NAMES = Object.freeze(['reorder', 'withdraw']);

/** @param {unknown} value @returns {value is Record<string, unknown>} */
const isPlainObject = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

/** An entry this page will draw: EM-C1's own `isEntry` predicate, read-side. */
const isEntry = (row) => isPlainObject(row) && typeof row.id === 'string' && row.id.length > 0
  && isPlainObject(row.op) && typeof row.op.type === 'string' && row.op.type.length > 0;

/** @param {unknown} row @returns {number} an absent or non-finite index reads 0, as EM-C1 reads it */
const orderIndexOf = (row) => (
  isPlainObject(row) && typeof row.orderIndex === 'number' && Number.isFinite(row.orderIndex)
    ? row.orderIndex
    : 0
);

/** The DM's own list order, key for key as EM-C1's `reorder` computes it. */
const inListOrder = (left, right) => (
  (orderIndexOf(left) - orderIndexOf(right)) || compareCodepoint(String(left.id), String(right.id))
);

/** What the entry does, out of the entry itself and out of no catalogue. */
const summaryOf = (entry) => {
  const target = isPlainObject(entry.op.target) ? entry.op.target : null;
  const kind = target && typeof target.kind === 'string' ? target.kind : '';
  const id = target && typeof target.id === 'string' ? target.id : '';
  const named = [kind, id].filter((part) => part !== '').join(' ');
  return named === '' ? String(entry.op.type) : `${entry.op.type} · ${named}`;
};

/** What it requires, out of the op's own declared relation (design §2.7a). */
const requiresOf = (entry) => (Array.isArray(entry.op.requires) ? entry.op.requires : NO_ROWS);

const styles = Object.freeze({
  page: { display: 'grid', gap: SP.md, padding: SP.lg, background: CARD_ALT, border: `1px solid ${GOLD}` },
  title: { margin: 0, color: INK, fontFamily: sans, fontSize: FS.xl, fontWeight: 950 },
  heading: { margin: 0, color: INK, fontFamily: sans, fontSize: FS.md, fontWeight: 950 },
  note: { margin: 0, color: BODY, fontFamily: sans, fontSize: FS['14'], lineHeight: 1.55 },
  quiet: { margin: 0, color: SECOND, fontFamily: sans, fontSize: FS['14'], lineHeight: 1.55 },
  section: { display: 'grid', gap: SP.sm },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: SP.sm },
  row: { display: 'grid', gap: 6, padding: SP.sm, background: CARD, borderLeft: `3px solid ${GOLD}` },
  line: { color: INK, fontFamily: sans, fontSize: FS['14'], lineHeight: 1.55 },
  meta: { color: SECOND, fontFamily: sans, fontSize: FS.sm, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.05em' },
  controls: { display: 'flex', gap: SP.xs, flexWrap: 'wrap', alignItems: 'center' },
  badge: { display: 'grid', gap: 4, padding: SP.sm, background: CARD_ALT, border: `1px solid ${BORDER}` },
  rung: { display: 'grid', gap: 4, padding: SP.sm, background: CARD, borderLeft: `3px solid ${GOLD}` },
  rungCta: { color: INK, fontFamily: sans, fontSize: FS.md, fontWeight: 950 },
  link: { color: INK, fontFamily: sans, fontSize: FS['14'], lineHeight: 1.55 },
});

/**
 * @param {{ saveId?: string, decrees?: readonly object[],
 *   verdict?: { guards?: readonly object[], unevaluated?: readonly string[] },
 *   inCampaign?: boolean, advanceControl?: import('react').ReactNode,
 *   rewindLimit?: number|null,
 *   actions?: Readonly<Record<string, (request: object) => unknown>>|null,
 *   chronicleHref?: ((entry: object) => string|null)|null,
 *   onReopen?: ((entry: object) => void)|null,
 *   onGuardOffer?: ((guard: object, offer: string) => void)|null }} props
 */
export default function DecreeRegistryPage({
  saveId = '',
  decrees = NO_ROWS,
  verdict = EMPTY_VERDICT,
  inCampaign = false,
  advanceControl = null,
  rewindLimit = null,
  actions = null,
  chronicleHref = null,
  onReopen = null,
  onGuardOffer = null,
}) {
  const rows = Array.isArray(decrees) ? decrees.filter(isEntry) : NO_ROWS;
  const groupOf = (status) => rows.filter((row) => row.status === status).sort(inListOrder);
  const waiting = groupOf(STATUS_SECTIONS[0].status);

  // The verdict's OWN order is kept: `evaluateGuards` orders by the fold, then by rule id,
  // then by the order the rule yielded its findings, and re-sorting here would answer a
  // different question than the one the engine answered.
  const found = Array.isArray(verdict?.guards) ? verdict.guards : NO_ROWS;
  const skipped = Array.isArray(verdict?.unevaluated) ? verdict.unevaluated : NO_ROWS;
  const guardsFor = (entryId) => found.filter(
    (guard) => isPlainObject(guard) && guard.entryId === entryId,
  );

  // THE SEAM PREDICATES, SPELLED WHERE THE CONTROL IS DISABLED AND AGAIN AS THE HANDLER'S
  // FIRST STATEMENT (EM-D0e's landed belt): react-dom returns no listener for a click on a
  // control whose REACT PROPS carry `disabled`, so the second guard is what convicts a
  // DOM-re-enabled control, and only a source read can see it.
  const canMove = typeof actions?.reorder === 'function';
  const canWithdraw = typeof actions?.withdraw === 'function';
  const canReopen = typeof onReopen === 'function';
  const canOffer = typeof onGuardOffer === 'function';

  const move = (entryId, toIndex) => {
    if (typeof actions?.reorder !== 'function') return;
    actions.reorder({ saveId, entryId, toIndex });
  };
  const drop = (entryId) => {
    if (typeof actions?.withdraw !== 'function') return;
    actions.withdraw({ saveId, entryId });
  };
  const reopen = (entry) => {
    if (typeof onReopen !== 'function') return;
    onReopen(entry);
  };
  const offer = (guard, name) => {
    if (typeof onGuardOffer !== 'function') return;
    onGuardOffer(guard, name);
  };

  const hrefFor = (entry) => {
    if (typeof chronicleHref !== 'function') return '';
    const href = chronicleHref(entry);
    return typeof href === 'string' ? href : '';
  };

  const offerOf = (guard, name) => {
    const words = GUARD_OFFER_LABELS[name] ?? String(name);
    if (!canOffer) {
      return (
        <span key={String(name)} style={styles.meta} data-testid="decree-guard-offer" data-offer={String(name)}>
          {words}
        </span>
      );
    }
    return (
      <Button
        key={String(name)}
        variant="secondary"
        size="sm"
        onClick={() => offer(guard, name)}
        data-testid="decree-guard-offer"
        data-offer={String(name)}
      >
        {words}
      </Button>
    );
  };

  const badgesFor = (entry) => {
    const mine = guardsFor(entry.id);
    if (mine.length === 0) return null;
    return (
      <ul style={styles.list} data-testid="decree-guards">
        {mine.map((guard) => (
          <li
            key={String(guard.id)}
            style={styles.badge}
            data-testid="decree-guard"
            data-guard-kind={String(guard.kind)}
            data-guard-overridden={guard.overridden === true ? 'yes' : 'no'}
          >
            <span style={styles.meta}>
              {GUARD_KIND_LABELS[guard.kind] ?? String(guard.kind)}
              {guard.overridden === true ? ' · proceeded past' : ''}
            </span>
            <span style={styles.line}>{String(guard.message ?? '')}</span>
            <span style={styles.controls}>
              {(Array.isArray(guard.offers) ? guard.offers : NO_ROWS).map((name) => offerOf(guard, name))}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const rowHeadOf = (entry) => {
    const requires = requiresOf(entry);
    return (
      <>
        <span style={styles.line} data-testid="decree-entry-summary">{summaryOf(entry)}</span>
        {requires.length === 0 ? null : (
          <span style={styles.line} data-testid="decree-entry-requires">
            {`Requires: ${requires.join(', ')}`}
          </span>
        )}
        <span style={styles.meta} data-testid="decree-entry-author">
          {AUTHOR_LABELS[entry.addedBy] ?? AUTHOR_LABELS.dm}
        </span>
      </>
    );
  };

  const waitingRow = (entry, at) => (
    <li
      key={entry.id}
      style={styles.row}
      data-testid="decree-entry"
      data-entry-id={entry.id}
      data-status={entry.status}
    >
      {rowHeadOf(entry)}
      {badgesFor(entry)}
      <span style={styles.controls}>
        <Button
          variant="secondary"
          size="sm"
          disabled={!canMove || at === 0}
          onClick={() => move(entry.id, at - 1)}
          data-testid="decree-move-up"
        >
          Move up
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!canMove || at === waiting.length - 1}
          onClick={() => move(entry.id, at + 1)}
          data-testid="decree-move-down"
        >
          Move down
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!canReopen}
          onClick={() => reopen(entry)}
          data-testid="decree-reopen"
        >
          Reopen
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!canWithdraw}
          onClick={() => drop(entry.id)}
          data-testid="decree-withdraw"
        >
          Withdraw
        </Button>
      </span>
    </li>
  );

  const appliedRow = (entry) => {
    const href = hrefFor(entry);
    return (
      <li
        key={entry.id}
        style={styles.row}
        data-testid="decree-entry"
        data-entry-id={entry.id}
        data-status={entry.status}
      >
        {rowHeadOf(entry)}
        {href === '' ? null : (
          <a href={href} style={styles.link} data-testid="decree-chronicle-link">
            Read its chronicle line
          </a>
        )}
      </li>
    );
  };

  const withdrawnRow = (entry) => {
    const reason = isPlainObject(entry.withdrawnReason) ? entry.withdrawnReason : null;
    return (
      <li
        key={entry.id}
        style={styles.row}
        data-testid="decree-entry"
        data-entry-id={entry.id}
        data-status={entry.status}
      >
        {rowHeadOf(entry)}
        {reason === null ? null : (
          <span style={styles.line} data-testid="decree-entry-reason">
            {`Withdrawn: ${String(reason.was)} is no longer in the catalogue`}
          </span>
        )}
      </li>
    );
  };

  const rowsOfSection = (status, group) => {
    if (status === STATUS_SECTIONS[0].status) return group.map((entry, at) => waitingRow(entry, at));
    if (status === STATUS_SECTIONS[1].status) return group.map((entry) => appliedRow(entry));
    return group.map((entry) => withdrawnRow(entry));
  };

  return (
    <section style={styles.page} data-testid="decree-registry-page" aria-label="The page of decrees">
      <h2 style={styles.title}>Decrees</h2>

      {inCampaign ? (
        advanceControl === null ? null : (
          <div style={styles.controls} data-testid="decree-registry-advance">{advanceControl}</div>
        )
      ) : (
        <div style={styles.rung} data-testid="decree-registry-realm-rung">
          <span style={styles.rungCta}>{t('detail.sendToRealmCta')}</span>
          <span style={styles.line}>{t('detail.sendToRealmHint')}</span>
        </div>
      )}

      <p style={styles.note} data-testid="decree-registry-rewind">
        {typeof rewindLimit === 'number' && Number.isFinite(rewindLimit)
          ? `A rewind returns the decrees of a tick to the waiting list in their own order. It reaches the last ${rewindLimit} advances of this session, and a reload clears it.`
          : 'A rewind returns the decrees of a tick to the waiting list in their own order. It lasts for this session only, and a reload clears it.'}
      </p>

      {skipped.length === 0 ? null : (
        <p style={styles.quiet} data-testid="decree-registry-unevaluated">
          {`Not judged here: ${skipped.join(', ')}. No rule, no guard, and the absence is stated.`}
        </p>
      )}

      {rows.length === 0 ? (
        <p style={styles.quiet} data-testid="decree-registry-empty">
          Nothing is decreed yet. An edit made here waits in this list until time advances.
        </p>
      ) : null}

      {STATUS_SECTIONS.map(({ status, heading }) => {
        const group = status === STATUS_SECTIONS[0].status ? waiting : groupOf(status);
        if (group.length === 0) return null;
        return (
          <div key={status} style={styles.section} data-testid={`decree-registry-${status}`}>
            <h3 style={styles.heading}>{heading}</h3>
            <ol style={styles.list}>{rowsOfSection(status, group)}</ol>
          </div>
        );
      })}
    </section>
  );
}
