/**
 * HeraldRemembrance.jsx — RUINS & REMEMBRANCE, the Herald's graveyard door
 * (owner directive 5, judgment J-D5, wave W-C).
 *
 * The realm's fallen, in one place for the first time. Two lanes that were only
 * ever readable apart now read together (heraldRegister.remembranceRows):
 *   • the ENGINE remnants — the terminal-death lane's relic ruins and abandoned
 *     sites, with the chronicle entry that lane wrote when the place died;
 *   • the LIBRARY's Destroyed rubric — a settlement whose destruction the GM
 *     recorded into its own canon, with the cause they gave.
 * Each row carries its RECEIPT POINTERS: where the record of the fall already
 * lives. Retrospective review is a READ. This door rules on nothing, writes
 * nothing, and revives nothing.
 *
 * ── DELIBERATELY DEFERRED — USER-PARKABLE STASIS (J-D5). Not a gap to re-find. ──
 * The directive asks for a graveyard of "stasis / destroyed" settlements. This
 * door ships the DESTROYED half in full. The STASIS half — a GM parking a live
 * settlement so the simulation stops advancing it while it stays in the realm —
 * is NOT built here, and deliberately so: stasis is a NEW CANONICAL LIFECYCLE
 * STATE, not a display filter, and a new lifecycle state owes the same full
 * trace every other one owes before a single pixel of it is honest:
 *   persist (where the mark lives on the save AND survives a JSON round trip),
 *   regen  (a regeneration must not silently thaw a parked town),
 *   undo   (parking and unparking are canon edits, snapshot-undoable),
 *   import (an imported campaign must carry the parked marks it left with),
 *   engine (every pulse kernel that iterates the roster must skip a parked cell
 *           without corrupting conservation — population, food, and trade all
 *           balance across the roster today).
 * Building the surface first would mint a mark the engine ignores, which is the
 * writer/reader drift class this codebase has been bitten by before. When stasis
 * lands as a state, this door gains a third lane and the register invariant in
 * heraldRegister.js (one roster, two halves) becomes one roster, three halves.
 *
 * THE SECRETS SEAM: the fallen and how they are graded are the world's own facts
 * and ship to every audience — a ruin is a landmark. The RECEIPTS are not: the
 * cause the GM typed and the engine's own ruling ids are built only for a proven
 * owner session (viewerSeesDmSecrets, fail closed), and the row says so rather
 * than pretending the record is empty.
 *
 * A LAZY LEAF. HeraldBody mounts it through lazy(), so a GM who never opens this
 * door pays nothing for it. @enforced-by tests/build/heraldRegisterDoorsLazy.test.js
 */

import { useMemo } from 'react';

import { useStore } from '../../store/index.js';
import { viewerSeesDmSecrets } from '../../domain/display/viewerSecrets.js';
import { remembranceRows } from './heraldRegister.js';
import { Pill, Section } from './WorldPulsePrimitives.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, INK, MUTED, SECOND, SP, sans } from '../theme.js';

/** The calm nothing-here state. A young realm has buried no one, and that is news. */
function EmptyGraveyard() {
  return (
    <div style={{ border: `1px dashed ${BORDER}`, padding: 14, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
      No ruins yet. This realm is young, and every settlement it has raised still stands.
    </div>
  );
}

/** One fallen place: the name, how it is graded, when it fell, and the receipts. */
function RemembranceRow({ row }) {
  return (
    <div
      data-testid="remembrance-row"
      style={{
        display: 'grid', gap: 4,
        padding: '8px 10px',
        border: `1px solid ${BORDER2}`,
        borderLeft: `3px solid ${MUTED}`,
        background: CARD,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {/* THE NEWS ADDRESS LAW: the dossier survives the settlement. */}
        <RealmEntityLink
          settlementSaveId={row.id}
          label={row.name}
          style={{ color: INK, fontWeight: 900, fontSize: FS.sm }}
        />
        <Pill>{row.gradeLabel}</Pill>
      </div>
      <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45, overflowWrap: 'anywhere' }}>
        {row.epitaph}
      </div>
      <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>
        {row.whenLabel}
      </div>
      {row.receipts.length > 0 && (
        <dl style={{ margin: 0, display: 'grid', gap: 2 }}>
          {row.receipts.map(receipt => (
            <div key={receipt.id} style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <dt style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {receipt.label}
              </dt>
              <dd style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.xxs, overflowWrap: 'anywhere' }}>
                {receipt.detail}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {row.receiptsRedacted && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontStyle: 'italic' }}>
          The keeper&rsquo;s record of the cause is sealed to this reader.
        </div>
      )}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {ReadonlyArray<any>} [props.saves]
 */
export default function HeraldRemembrance({ campaign, saves = [] }) {
  const auth = useStore(s => s.auth);
  // §15 fail-closed, the RoadScenePanel idiom.
  const seesSecrets = viewerSeesDmSecrets({ isOwner: !!auth?.user, authenticated: !!auth?.user });
  const rows = useMemo(
    () => remembranceRows({ campaign, saves, seesSecrets }),
    [campaign, saves, seesSecrets],
  );

  return (
    <div data-testid="herald-remembrance" style={{ display: 'grid', gap: SP.sm }}>
      <Section heading="What the realm has lost" count={rows.length}>
        {rows.length === 0 ? (
          <EmptyGraveyard />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.map(row => <RemembranceRow key={row.id} row={row} />)}
          </div>
        )}
      </Section>
    </div>
  );
}
