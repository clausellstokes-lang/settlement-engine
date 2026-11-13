/**
 * WhoRunsThisTownPanel — THE DM VIEW: "who really runs this town" (the allegiance train, car 3,
 * ALLEGIANCE-CAR3, 2026-11-08; docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §9).
 *
 * DM LAYER ONLY. It names hidden allegiances, handlers, covert ties and a hidden power's boost, so the
 * Power tab mounts it only on the DM's own view (never `playerView`, never `publicDossier`), and nothing
 * else mounts it — never a player surface, a public page or the Foundry journal (the W7 receipt ruling).
 * Every row reads one writer's receipt (`patronage.js :: dmPowerViewOf` over `allegianceOf`, the covert
 * handler ties, `patronageOf` and the stored capture rung) and invents nothing; every sentence is
 * WRITE-PEOPLE's (`src/data/people/dmPowerLines.js`). Display only: no store writes, no draws.
 *
 * The blocks: the ruling three · who answers to whom · the fronts · the hall · the boosts. "Who hunts
 * whom" is car 4's: its slot is mounted empty and hidden.
 */
import { useMemo } from 'react';
import { FS, MUTED, swatch } from '../../theme.js';
import { chromeFontSize } from '../../../design/proseScale.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { LITERARY_TITLE } from '../labelLadder.js';
import { FLUSH } from '../../../design/flush.js';
import EntityLink from '../../primitives/EntityLink.jsx';
import { entityIdFor } from '../../../domain/dossier/entityLinks.js';
import { dmPowerViewOf } from '../../../domain/people/patronage.js';
import { boostWords, rulingHeadOf } from '../../../data/people/dmPowerLines.js';

const PLACE = Object.freeze({ 1: 'Head', 2: 'Second', 3: 'Third', steward: 'Steward' });
const RANK_WORD = Object.freeze({ 1: 'first', 2: 'second', 3: 'third' });

const box = { background: swatch['#FAF8F4'], border: '1px solid #d8c090', borderLeft: '4px solid #4a1a4a', padding: '10px 14px', ...FLUSH };
const head = { fontWeight: 800, color: swatch.inkMag3, margin: '10px 0 4px' };
const row = { fontSize: FS.sm, color: swatch.inkMag2, lineHeight: 1.5, margin: '2px 0' };
const line = { fontSize: FS.sm, color: swatch.inkMag2, lineHeight: 1.55, margin: '2px 0 6px 12px', fontStyle: 'italic' };

/** @param {{ face: { id: string, name: string } }} props */
function Face({ face }) {
  return <EntityLink id={entityIdFor('npc', face, face.name)} type="npc" fallback={face.name} style={{ color: swatch.inkMag, fontWeight: 600 }} />;
}

/** @param {{ settlement: any }} props */
export default function WhoRunsThisTownPanel({ settlement }) {
  const view = useMemo(() => dmPowerViewOf(settlement), [settlement]);
  const mobile = useIsMobile();
  // the phone chrome floor (MERGE-TRAIN at the OWNER-WORDS-DOSSIER point: car 3's two sub-floor sizes floored by the helper)
  const headStyle = { ...head, fontSize: chromeFontSize(FS.xs, mobile) };
  if (!view) return null;
  return (
    <div data-testid="who-runs-this-town" data-layer="dm" style={box}>
      <div style={{ ...LITERARY_TITLE, color: swatch.inkMag, marginBottom: 2 }}>{`Who really runs this ${view.tierNoun}`}</div>
      <div style={{ fontSize: chromeFontSize(FS.xxs, mobile), color: MUTED, marginBottom: 4 }}>For the DM only. Nothing here appears on a player view or a shared page.</div>

      {/* COHERENCE-POWERS-5 (N5): the title names as many as it heads (dmPowerLines.js :: rulingHeadOf) */}
      <div data-testid="dm-ruling-head" style={headStyle}>{rulingHeadOf(view.rulingThree.length, view.ruler)}</div>
      {view.rulingThree.map((f) => (
        <div key={f.id} data-testid="dm-ruling-face">
          <div style={row}>
            <strong>{PLACE[f.rank]}</strong>{' · '}<Face face={f} />{f.title ? `, ${f.title}` : ''}
            {f.openPowers.length > 0 && <span style={{ color: MUTED }}>{` · also ${f.openPowers.map((m) => (m.rank ? `${RANK_WORD[m.rank]} in ${m.powerName}` : `in ${m.powerName}`)).join(', ')}`}</span>}
            {f.answersTo && <span>{` · answers to ${f.answersTo.guild}${f.answersTo.handler ? ` through ${f.answersTo.handler}` : ''}`}</span>}
          </div>
          {f.lends.map((l) => <p key={l.powerName} style={line}>{l.line}</p>)}
        </div>
      ))}

      {view.answers.length > 0 && <>
        <div style={headStyle}>Who answers to whom</div>
        {view.answers.map((g) => (
          <div key={g.guild} data-testid="dm-answers-group" style={{ marginBottom: 6 }}>
            <div style={row}><strong>{g.guild}</strong>{g.boss && <>{' · led by '}<Face face={g.boss} />{g.boss.title ? `, ${g.boss.title}` : ''}</>}</div>
            {g.handlers.map((h) => (
              <div key={h.id} style={{ marginLeft: 12 }}>
                <div style={row}>{'handled by '}<Face face={h} />{h.title ? `, ${h.title}` : ''}{h.house ? ` (${h.house})` : ''}</div>
                {h.agents.map((a) => (
                  <div key={a.id} style={{ ...row, marginLeft: 12 }}>
                    <Face face={a} />{a.title ? `, ${a.title}` : ''}{a.house ? ` (${a.house})` : ''}
                    <span style={{ color: MUTED }}>{` · brings ${a.brings}${a.tie ? ` · ${a.tie}` : ''}`}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </>}

      {view.fronts.length > 0 && <>
        <div style={headStyle}>The fronts</div>
        {view.fronts.map((f) => (
          <div key={f.id} style={row}>
            <strong>{f.house}</strong>{' · '}<Face face={f} />{` · fronts for ${f.guild}`}{f.handler ? ` · handled by ${f.handler}` : ''}
          </div>
        ))}
      </>}

      <div style={headStyle}>The hall</div>
      <div style={row} data-testid="dm-hall"><strong>{view.hall.label}</strong>{'. '}{view.hall.line}</div>

      {view.boosts.length > 0 && <>
        <div style={headStyle}>The boosts</div>
        {view.boosts.map((b) => (
          <div key={b.powerName} data-testid="dm-boost">
            <div style={row}>
              <strong>{b.powerName}</strong>
              <span style={{ color: MUTED }}>{` · ${boostWords(b.base, b.boost)}`}</span>
            </div>
            <p style={line}>{b.line}</p>
          </div>
        ))}
      </>}

      {/* car 4's "who hunts whom": the slot is mounted, empty and hidden, until car 4 fills it */}
      <div data-slot="who-hunts-whom" hidden />
    </div>
  );
}

