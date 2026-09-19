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
 * ── THE WAR SECTION (RR-2, the Remembrance READER) ─────────────────────────────
 * A realm loses places, and it also loses WARS. W-MEM writes a typed, prose-free
 * record of every war that ended (`worldState.concludedWars`) and until this
 * section nothing could read one: the flag lit a writer whose output no surface
 * showed. The reader lives in `domain/display/warRemembrance.js` and authors every
 * sentence at render time; this file only lays them out.
 *
 * ⛔ IT RENDERS NOTHING WHEN THERE IS NOTHING TO REMEMBER, and that is load-bearing
 * rather than tidy. `warMemoryEnabled` is DARK by default, so the ledger key is
 * simply absent and the roster is empty for every campaign alive today. An empty
 * section with a "no wars yet" note would have changed this LIVE door for every
 * existing GM on the day a dormant flag shipped. The graveyard's own empty state is
 * different and stays: a realm that has buried no one is news; a realm whose engine
 * was never asked to remember a war is not.
 *
 * A LAZY LEAF. HeraldBody mounts it through lazy(), so a GM who never opens this
 * door pays nothing for it. @enforced-by tests/build/heraldRegisterDoorsLazy.test.js
 */

import { useMemo } from 'react';

import { useStore } from '../../store/index.js';
import { viewerSeesDmSecrets } from '../../domain/display/viewerSecrets.js';
import { concludedWarRows } from '../../domain/display/warRemembrance.js';
import { remembranceRows } from './heraldRegister.js';
import { Pill, Section } from './WorldPulsePrimitives.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, INK, MUTED, SECOND, SP, sans } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

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
  const mobile = useIsMobile();
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
      <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.45, overflowWrap: 'anywhere' }}>
        {row.epitaph}
      </div>
      <div style={{ color: SECOND, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800 }}>
        {row.whenLabel}
      </div>
      {row.receipts.length > 0 && (
        <dl style={{ margin: 0, display: 'grid', gap: 2 }}>
          {row.receipts.map(receipt => (
            <div key={receipt.id} style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <dt style={{ color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {receipt.label}
              </dt>
              <dd style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), overflowWrap: 'anywhere' }}>
                {receipt.detail}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {row.receiptsRedacted && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontStyle: 'italic' }}>
          The keeper&rsquo;s record of the cause is sealed to this reader.
        </div>
      )}
    </div>
  );
}

/** One line of a war's account. Kept out of the row so the layout reads as prose. */
function WarClause({ children }) {
  const mobile = useIsMobile();
  return (
    <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.45, overflowWrap: 'anywhere' }}>
      {children}
    </div>
  );
}

/** One war the realm wrote down: what it was called, how it ended, and what it cost. */
function ConcludedWarRow({ row }) {
  const mobile = useIsMobile();
  return (
    <div
      data-testid="concluded-war-row"
      style={{
        display: 'grid', gap: 4,
        padding: '8px 10px',
        border: `1px solid ${BORDER2}`,
        borderLeft: `3px solid ${MUTED}`,
        background: CARD,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ color: INK, fontWeight: 900, fontSize: FS.sm }}>{row.name}</span>
        {row.staged && <Pill>Still being written</Pill>}
      </div>
      <WarClause>{row.line}</WarClause>
      <WarClause>{row.endingLine}</WarClause>
      {row.costLine && <WarClause>{row.costLine}</WarClause>}
      {row.allies.length > 0 && (
        <WarClause>{`Fought beside them: ${row.allies.join(', ')}.`}</WarClause>
      )}
      {row.territory.map(line => <WarClause key={line}>{line}</WarClause>)}
      {row.engagements.length > 0 && (
        <WarClause>{`Remembered from the field: ${row.engagements.join(' ')}`}</WarClause>
      )}
      <div style={{ color: SECOND, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800 }}>
        {`${row.whenLabel} ${row.ranLabel}`}
      </div>
      {row.stagedNote && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontStyle: 'italic' }}>
          {row.stagedNote}
        </div>
      )}
      {row.receipts.length > 0 && (
        <dl style={{ margin: 0, display: 'grid', gap: 2 }}>
          {row.receipts.map(receipt => (
            <div key={receipt.id} style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <dt style={{ color: MUTED, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {receipt.label}
              </dt>
              <dd style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), overflowWrap: 'anywhere' }}>
                {receipt.detail}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/** The live name of every seat the library still holds, for the war reader's
 *  name resolver. A belligerent the library no longer holds falls back to the
 *  name the record itself carried at the war's conclusion. */
function liveNameMap(saves) {
  const map = new Map();
  for (const save of Array.isArray(saves) ? saves : []) {
    const id = String(save?.id ?? save?.settlement?.id ?? '');
    const name = String(save?.settlement?.name || save?.name || '').trim();
    if (id && name) map.set(id, name);
  }
  return map;
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
  const wars = useMemo(
    () => {
      const names = liveNameMap(saves);
      return concludedWarRows({
        worldState: campaign?.worldState,
        nameFor: (id) => names.get(String(id)) || '',
        seesSecrets,
      });
    },
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
      {/* Absent, not empty, when the realm has remembered no war. See the header. */}
      {wars.length > 0 && (
        <Section heading="The wars that ended" count={wars.length}>
          <div data-testid="herald-war-remembrance" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {wars.map(row => <ConcludedWarRow key={row.id} row={row} />)}
          </div>
        </Section>
      )}
    </div>
  );
}
