/**
 * RelationshipChronicleSection.jsx — "what this relationship survived"
 * (LONG TAIL #39 / docs/world-pulse-roadmap.md §4d, the history half).
 *
 * THE DESK IT COMPLETES. PerspectiveStandings (DESK-4) sits immediately above in
 * the Herald's War door and says what one settlement's standings ARE: its sieges,
 * its march-mates, its treaty roles. It reads no relationship state and no
 * archive, so the PRESENT had a surface and the PAST had none. This section is
 * the other half, on the same observer picker so the two read as one desk: the
 * dated record of what each of that settlement's relationships has been through.
 *
 * GLANCE → SENTENCE → TABLE (the legibility law). The heading and the count are
 * the glance; one plain line per relationship — both parties named, the present
 * standing in words, how far back the record runs — is the sentence; the dated
 * entries beneath are the table. No score, no token, no formula: every incident
 * type is spoken through the display lexicon, which is bound to its writers by
 * tests/lint/vocabularyTotality.walker.test.js.
 *
 * ⛔ DM-GATED, FAIL-CLOSED, AND THE GATE IS IN THE READ MODEL. An incident carries
 * no visibility field and its writers include corruptionWeb, espionageGauntlet and
 * informationStatecraft, so this component never filters secrets itself: it passes
 * `includeCovert` to relationshipChronicle, which withholds every line that is not
 * explicitly `public` — including a type no table has classified yet. A viewer
 * without ground truth is therefore shown only what the world can see, and a
 * relationship whose whole record is covert does not render at all.
 *
 * READ-ONLY. No store write, no engine call, no persisted byte; a realm with no
 * recorded relationship history renders NOTHING (the estate's empty-state
 * discipline — a young realm is news, a dormant system is not).
 *
 * Mounts inside the EXISTING War door. No Herald door is added: the nine-door
 * list and its conditional tenth are a ruled structure (RealmInspector.jsx).
 */

import { useMemo, useState } from 'react';

import { useStore } from '../../store/index.js';
import { relationshipChronicle } from '../../domain/display/relationshipChronicle.js';
import {
  humanizeToken, incidentPhrase, tickCalendarDetailLabel,
} from '../../domain/display/humanizeEngineTokens.js';
import Button from '../primitives/Button.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, SP, sans } from '../theme.js';

/** How many entries a relationship shows before the reader asks for the rest. */
const LINES_SHOWN = 6;

const TERM_HELP = Object.freeze({
  public: 'A recorded fact of the realm: the kind of thing neighbours would know.',
  covert: 'Quiet business — spies, sabotage, bought men. DM knowledge; a player-facing view does not receive it.',
  unclassified: 'The record keeps this one, but nothing yet says who would know of it. Withheld from a player-facing view for that reason. DM knowledge.',
});

/** The date a line carries, in the reader's own calendar; honest when undated. */
function whenLabel(tick) {
  return tick == null ? 'at a time the record does not fix' : tickCalendarDetailLabel(tick);
}

/** One dated entry. The disclosure word rides an aria-label, never a bare badge. */
function ChronicleLine({ line }) {
  const covert = line.disclosure !== 'public';
  return (
    <div
      data-testid="relationship-chronicle-line"
      data-disclosure={line.disclosure}
      aria-label={TERM_HELP[line.disclosure] || TERM_HELP.unclassified}
      style={{ display: 'flex', gap: 6, color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}
    >
      <span aria-hidden="true" style={{ color: covert ? GOLD : SECOND, fontWeight: 900, flexShrink: 0 }}>
        {covert ? '◆' : '•'}
      </span>
      <span>
        <span style={{ color: MUTED, fontWeight: 800 }}>{whenLabel(line.tick)}</span>
        {' — '}
        {incidentPhrase(line.type)}
        {line.fromType && line.toType ? (
          <span style={{ color: SECOND }}>
            {` (${humanizeToken(line.fromType)} → ${humanizeToken(line.toType)})`}
          </span>
        ) : null}
        {covert ? <span style={{ color: GOLD, fontWeight: 800 }}> · DM only</span> : null}
      </span>
    </div>
  );
}

/** The present standing, said in words rather than in a posture token. */
function standingWords(row) {
  if (row.postureLabel) return row.postureLabel;
  const type = humanizeToken(row.relationshipType);
  return type ? `${type} standing` : 'a standing the record does not name';
}

/** One relationship: who, where it stands now, and everything it has been through. */
function ChronicleRow({ row, nameFor }) {
  const [open, setOpen] = useState(false);
  const shown = open ? row.lines : row.lines.slice(0, LINES_SHOWN);
  const hidden = row.lines.length - shown.length;
  const span = row.firstTick == null
    ? 'The record does not date what it holds'
    : `The record runs from ${tickCalendarDetailLabel(row.firstTick)}`;
  return (
    <div
      data-testid="relationship-chronicle-row"
      style={{ border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${GOLD}`, background: CARD, padding: '8px 10px', display: 'grid', gap: 5 }}
    >
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, lineHeight: 1.4 }}>
        {/* THE NEWS ADDRESS LAW: both parties named, and both navigable. */}
        <RealmEntityLink settlementSaveId={row.from} label={nameFor(row.from)} style={{ fontSize: FS.xs }} />
        {' and '}
        <RealmEntityLink settlementSaveId={row.to} label={nameFor(row.to)} style={{ fontSize: FS.xs }} />
        {`: ${standingWords(row)} today, after ${row.lineCount} recorded ${row.lineCount === 1 ? 'turn' : 'turns'}.`}
      </div>
      <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 800 }}>{span}</div>
      <div style={{ display: 'grid', gap: 3 }}>
        {shown.map((line) => <ChronicleLine key={line.id} line={line} />)}
      </div>
      {hidden > 0 && (
        <Button
          variant="ghost" size="sm"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          style={{
            justifySelf: 'start', minHeight: undefined, padding: '1px 7px',
            border: `1px solid ${BORDER2}`, background: CARD_ALT, color: SECOND,
            fontSize: FS.micro, fontWeight: 850,
          }}
        >
          {`Show the other ${hidden}`}
        </Button>
      )}
    </div>
  );
}

/**
 * @param {{ campaign: any, nameById?: Map<string,string> }} props
 */
export default function RelationshipChronicleSection({ campaign, nameById }) {
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  // The covert half is DM knowledge — BeliefDivergenceBand's and
  // PerspectiveStandings' question verbatim, and its census row says so.
  const includeGroundTruth = tier === 'premium' || elevated;

  const ids = useMemo(() => (campaign?.settlementIds || []).map(String), [campaign]);
  const nameFor = useMemo(() => (id) => nameById?.get(String(id)) || String(id), [nameById]);
  const [pickedId, setPickedId] = useState(null);
  const observerId = pickedId != null && ids.includes(pickedId) ? pickedId : (ids[0] || null);

  const rows = useMemo(() => relationshipChronicle({
    worldState: campaign?.worldState,
    regionalGraph: campaign?.regionalGraph || campaign?.worldState?.regionalGraph,
    includeCovert: includeGroundTruth,
  }), [campaign, includeGroundTruth]);

  const mine = useMemo(
    () => rows.filter((r) => r.from === observerId || r.to === observerId),
    [rows, observerId],
  );

  // A realm that has survived nothing yet says nothing. Not an empty heading, not
  // a "no data" box — the section is simply absent until the world has a history.
  if (!observerId || rows.length === 0) return null;

  return (
    <section
      data-testid="relationship-chronicle"
      style={{ border: `1px solid ${BORDER}`, background: CARD_ALT, padding: '9px 11px', display: 'grid', gap: SP.sm }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {/* Text twin, not a lucide glyph — the LU-2 icons-off doctrine, and it
            keeps the icon census untouched (PerspectiveStandings' own idiom). */}
        <span aria-hidden="true" style={{ color: GOLD, fontWeight: 900, fontSize: FS.xs }}>❦</span>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
          What {nameFor(observerId)} has survived
        </span>
        <select
          aria-label="Pick the settlement whose history to read"
          value={observerId}
          onChange={(e) => setPickedId(e.target.value)}
          style={{ marginLeft: 'auto', fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, color: INK, background: CARD, border: `1px solid ${BORDER2}`, padding: '2px 6px' }}
        >
          {ids.map(id => <option key={id} value={id}>{nameFor(id)}</option>)}
        </select>
      </div>
      {mine.length === 0 ? (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontStyle: 'italic', lineHeight: 1.5 }}>
          {nameFor(observerId)} has come through nothing the record kept. Other settlements have;
          pick one of them above.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 5 }}>
          {mine.map(row => <ChronicleRow key={row.relationshipKey} row={row} nameFor={nameFor} />)}
        </div>
      )}
      <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.5 }}>
        Every entry here was written down when it happened and has not been thinned since
        {includeGroundTruth
          ? '. The gold entries are quiet business — yours to know, and not shown in a player-facing view.'
          : '. Quiet business is not shown here.'}
      </div>
    </section>
  );
}
