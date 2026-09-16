/**
 * HeraldGazetteer.jsx — THE GAZETTEER, the Herald's living-roster door (owner
 * directive 5, judgment J-D5, wave W-C).
 *
 * The other report doors answer "what happened". This one answers "what is
 * there": every settlement the realm still counts, one compact register row
 * each, in the order a register reads (alphabetical, codepoint-stable).
 *
 * LEGIBILITY LAW, glance then sentence: the name and its tier word are the
 * glance; the one-line state beneath is a SENTENCE, built by heraldRegister from
 * derivations the realm already publishes (the engine's tier stamp, the economy
 * generator's prosperity word, the live war ledgers). No population count, no
 * score, no band number reaches this page.
 *
 * NEWS ADDRESS LAW: every name is a live RealmEntityLink into that settlement's
 * dossier, so the register is a way IN, not a dead list.
 *
 * THE SECRETS SEAM: the door consults viewerSeesDmSecrets exactly as the Road
 * Scene and Travelers surfaces do (fail closed). The roster itself is the
 * world's own fact and ships to every audience; the monster-threat read is a DM
 * assessment and is never BUILT for an unproven session.
 *
 * A LAZY LEAF. HeraldBody mounts it through lazy(), so a GM who never opens this
 * door pays nothing for it. @enforced-by tests/build/heraldRegisterDoorsLazy.test.js
 */

import { useMemo } from 'react';

import { useStore } from '../../store/index.js';
import { viewerSeesDmSecrets } from '../../domain/display/viewerSecrets.js';
import { gazetteerRows } from './heraldRegister.js';
import { isCalmThreat, threatDisplay } from './settlementThreat.js';
import { Pill, Section } from './WorldPulsePrimitives.jsx';
import RealmEntityLink from '../primitives/RealmEntityLink.jsx';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, INK, SP, sans } from '../theme.js';

/** The register's calm nothing-here state. A realm with no places is not broken. */
function EmptyRegister() {
  return (
    <div style={{ border: `1px dashed ${BORDER}`, padding: 14, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
      No settlement stands in this realm yet. Place one on the map and it enters the register.
    </div>
  );
}

/** One register row: the name and its tier at a glance, the state as a sentence. */
function RegisterRow({ row }) {
  const threat = row.threat && !isCalmThreat(row.threat) ? threatDisplay(row.threat) : null;
  return (
    <div
      data-testid="gazetteer-row"
      style={{
        display: 'grid', gap: 3,
        padding: '8px 10px',
        border: `1px solid ${BORDER2}`,
        background: CARD,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <RealmEntityLink
          settlementSaveId={row.id}
          label={row.name}
          style={{ color: INK, fontWeight: 900, fontSize: FS.sm }}
        />
        <Pill>{row.tier}</Pill>
        {threat && (
          <span style={{ color: threat.text, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {threat.label}
          </span>
        )}
      </div>
      <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.45, overflowWrap: 'anywhere' }}>
        {row.line}
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {ReadonlyArray<any>} [props.saves]
 */
export default function HeraldGazetteer({ campaign, saves = [] }) {
  const auth = useStore(s => s.auth);
  // §15 fail-closed, the RoadScenePanel idiom: only a proven owner session gets
  // the DM half of the register.
  const seesSecrets = viewerSeesDmSecrets({ isOwner: !!auth?.user, authenticated: !!auth?.user });
  const rows = useMemo(
    () => gazetteerRows({ campaign, saves, seesSecrets }),
    [campaign, saves, seesSecrets],
  );

  return (
    <div data-testid="herald-gazetteer" style={{ display: 'grid', gap: SP.sm }}>
      <Section heading="The realm at large" count={rows.length}>
        {rows.length === 0 ? (
          <EmptyRegister />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rows.map(row => <RegisterRow key={row.id} row={row} />)}
          </div>
        )}
      </Section>
    </div>
  );
}
