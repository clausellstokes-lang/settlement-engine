/**
 * CrisisTab — the Summary group's Crisis tab (docs/DESIGN_CRISIS_TAB.md; the owner, 2026-11-03:
 * "Do it", and later the same day: "the tab only appears when there is a crises and it should be
 * black background with red bold coloring (the tab) similar to criminal institutions and
 * services").
 *
 * A crisis is a singular event, and this is its one page: one section per active crisis, worst
 * first, each exactly the sections the design names — the event in one line; the cast by role
 * with the reason beside each name and a door to the person, the house or the institution; the
 * stakes, one line per faction; the levers; what the players see first; what happens if nothing
 * is done. Every line is composed once by `domain/crisis/crisisPage.js :: composeCrisisPage`; the
 * print chapter and the Foundry journal print the same sections from the same record.
 *
 * The tab is registered only when a crisis is active (OutputContainer, `hasActiveCrisis`), so it
 * renders nothing for a calm town. Its chrome is the criminal mark (tabPalette.js ::
 * TAB_CRISIS_MARK): the ink-black ground with the red worn bold.
 *
 * TRUST THE DM (X-45's Institutions-card idiom): a viewer who may author, in edit mode, reassigns
 * a role to another roster NPC, removes a role, or adds one from the vocabulary; Done writes the
 * cast as one line on the crisis entry (`applyUserEditAction('crisis', index, 'castRoles', …)`),
 * the ✎ YOU mark shows where the DM spoke, and "As the engine has it" reverts it. No free text.
 * This tab is the cast's only editor.
 */
import { useMemo, useState } from 'react';
import { FS } from '../../theme.js';
import { useStore } from '../../../store/index.js';
import Button from '../../primitives/Button.jsx';
import EntityLink from '../../primitives/EntityLink.jsx';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { FIELD_INK } from '../../../design/organic/ink.js';
import { FLUSH, FLUSH_PAGE, FLUSH_STACK } from '../../../design/flush.js';
import { useEntityFocus } from '../../dossier/useEntityFocus.js';
import { entityAnchor } from '../../../domain/dossier/entityLinks.js';
import { composeCrisisPage, CRISIS_PAGE_COPY } from '../../../domain/crisis/crisisPage.js';
import { CAST_EDIT_PATH, CRISIS_ROLES, CRISIS_ROLE_LABEL, formatCastRoles } from '../../../domain/crisis/crisisCast.js';
import { TAB_CRISIS_MARK } from './tabPalette.js';

const MARK = TAB_CRISIS_MARK;
const BODY = FIELD_INK.body;
const FAINT = FIELD_INK.faint;

/** The roster the editor offers: every named, present person, in roster order. */
export function castRosterOf(settlement) {
  return (Array.isArray(settlement?.npcs) ? settlement.npcs : [])
    .filter((n) => n && typeof n === 'object' && typeof n.name === 'string' && n.name.trim() && !n.ousted)
    .map((n) => ({ id: String(n.id || n.name), name: n.name }));
}

function Heading({ children }) {
  const mobile = useIsMobile();
  return (
    <div style={{ fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, letterSpacing: '0.06em', color: MARK.ink, margin: '8px 0 2px' }}>
      {children}
    </div>
  );
}

/**
 * THE CAST EDITOR: each role a select of the roster (an NPC row) or a fixed name (a house or an
 * institution), each removable; one more role added from the vocabulary. Selects and Buttons
 * only, never a text field.
 */
function CastEditor({ section, roster, onDone, onRevert, onClose }) {
  const mobile = useIsMobile();
  const [rows, setRows] = useState(() => section.cast.map((r) => ({ role: r.role, kind: r.kind, id: r.id, name: r.name })));
  const [addRole, setAddRole] = useState(CRISIS_ROLES[0]);
  const [addWho, setAddWho] = useState(roster[0]?.id || '');
  const selectStyle = { fontSize: chromeFontSize(FS.xs, mobile), background: MARK.ground, color: BODY, border: `1px solid ${MARK.rule}`, padding: '2px 4px' };
  const setWho = (i, id) => setRows((prev) => prev.map((r, j) => (j === i ? { ...r, kind: 'npc', id } : r)));
  return (
    <div data-testid="crisis-cast-editor" style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
      {rows.map((r, i) => (
        <div key={`${r.role}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, color: MARK.ink }}>{CRISIS_ROLE_LABEL[r.role] || r.role}</span>
          {r.kind === 'npc' ? (
            <select aria-label={`Who ${CRISIS_ROLE_LABEL[r.role] || r.role}`} value={r.id} onChange={(e) => setWho(i, e.target.value)} style={selectStyle}>
              {roster.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          ) : <span style={{ fontSize: chromeFontSize(FS.xs, mobile), color: BODY }}>{r.name}</span>}
          <Button variant="ghost" size="sm" onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))} aria-label={`${CRISIS_PAGE_COPY.remove} ${CRISIS_ROLE_LABEL[r.role] || r.role}`}>{CRISIS_PAGE_COPY.remove}</Button>
        </div>
      ))}
      {roster.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <select aria-label="Role to add" value={addRole} onChange={(e) => setAddRole(e.target.value)} style={selectStyle}>
            {CRISIS_ROLES.map((role) => <option key={role} value={role}>{CRISIS_ROLE_LABEL[role]}</option>)}
          </select>
          <select aria-label="Who takes the role" value={addWho} onChange={(e) => setAddWho(e.target.value)} style={selectStyle}>
            {roster.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <Button variant="secondary" size="sm" onClick={() => addWho && setRows((prev) => [...prev, { role: addRole, kind: 'npc', id: addWho, name: '' }])}>{CRISIS_PAGE_COPY.add}</Button>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Button variant="primary" size="sm" onClick={() => onDone(formatCastRoles(rows))} aria-label={`${CRISIS_PAGE_COPY.done} editing who ${section.label} touches`}>{CRISIS_PAGE_COPY.done}</Button>
        {section.edited && <Button variant="ghost" size="sm" onClick={onRevert}>{CRISIS_PAGE_COPY.revert}</Button>}
        <Button variant="ghost" size="sm" onClick={onClose}>{CRISIS_PAGE_COPY.cancel}</Button>
      </div>
    </div>
  );
}

/** One crisis: the event, the cast, the stakes, the levers, what is seen first, the escalation. */
export function CrisisSection({ section, canAuthor = false, roster = [] }) {
  const mobile = useIsMobile();
  const { ref } = useEntityFocus(section.id);
  const editMode = useStore((s) => s.editMode);
  const applyUserEditAction = useStore((s) => s.applyUserEditAction);
  const revertUserEditAction = useStore((s) => s.revertUserEditAction);
  const [editing, setEditing] = useState(false);
  const mayEdit = canAuthor && editMode && roster.length > 0;
  const prose = { fontSize: proseFontSize(FS.xs, mobile), color: BODY, lineHeight: 1.45, margin: '1px 0' };
  const door = { color: FIELD_INK.ink, fontWeight: 700 };
  return (
    <section ref={ref} id={entityAnchor('crisis', { id: section.id })} data-testid="crisis-section" data-crisis={section.type}
      style={{ ...FLUSH, background: MARK.ground, borderLeft: `3px solid ${MARK.ink}`, padding: '10px 12px' }}>
      <div data-testid="crisis-event" style={{ fontSize: proseFontSize(FS.md, mobile), fontWeight: 800, color: MARK.ink, lineHeight: 1.3 }}>{section.line}</div>
      {section.summary && <p style={prose}>{section.summary}</p>}

      <Heading>{CRISIS_PAGE_COPY.cast}</Heading>
      <div data-testid="crisis-cast">
        {section.cast.map((r, i) => (
          <p key={`${r.role}-${r.id}-${i}`} data-testid="crisis-cast-row" data-role={r.role} style={prose}>
            <span style={{ fontWeight: 800, color: MARK.ink }}>{r.roleLabel}: </span>
            <EntityLink id={r.doorId} type={r.kind} fallback={r.name} style={door} />
            <span style={{ color: FAINT }}> · {r.reason}</span>
          </p>
        ))}
        {section.cast.length === 0 && <p style={{ ...prose, fontStyle: 'italic' }}>{CRISIS_PAGE_COPY.nobody}</p>}
        {!section.edited && section.absent.map((a, i) => (
          <p key={`absent-${a.role}-${i}`} data-testid="crisis-cast-absent" style={{ ...prose, color: FAINT }}>
            <span style={{ fontWeight: 800, color: MARK.muted }}>{a.roleLabel}: </span>{a.reason}
          </p>
        ))}
        {(section.edited || mayEdit) && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
            {section.edited && <span data-testid="crisis-cast-authored" title={CRISIS_PAGE_COPY.editedTitle} style={{ fontSize: chromeFontSize(FS.nano, mobile), fontWeight: 800, color: MARK.ink }}>{CRISIS_PAGE_COPY.edited}</span>}
            {mayEdit && !editing && <Button variant="ghost" size="sm" onClick={() => setEditing(true)} aria-label={`Edit who ${section.label} touches`} style={{ padding: '0 6px', minHeight: 0 }}>{CRISIS_PAGE_COPY.edit}</Button>}
          </div>
        )}
        {mayEdit && editing && (
          <CastEditor section={section} roster={roster}
            onDone={(line) => { applyUserEditAction?.('crisis', section.index, CAST_EDIT_PATH, line); setEditing(false); }}
            onRevert={() => { revertUserEditAction?.('crisis', section.index, CAST_EDIT_PATH); setEditing(false); }}
            onClose={() => setEditing(false)} />
        )}
      </div>

      {section.stakes.length > 0 && <Heading>{CRISIS_PAGE_COPY.stakes}</Heading>}
      {section.stakes.map((k) => (
        <p key={k.factionId} data-testid="crisis-stake" style={prose}>
          <EntityLink id={k.doorId} type="faction" fallback={k.factionId} style={door} />
          <span style={{ fontWeight: 800, color: MARK.ink }}> {CRISIS_PAGE_COPY.stake[k.stake]}</span>
          <span style={{ color: FAINT }}> · {k.reason}</span>
        </p>
      ))}

      <Heading>{CRISIS_PAGE_COPY.levers}</Heading>
      {section.levers.map((l) => (
        <p key={l.institution} data-testid="crisis-lever" style={prose}>
          <EntityLink id={l.doorId} type="institution" fallback={l.institution} style={door} />
          {l.holderName && <><span style={{ color: FAINT }}> · held by </span><EntityLink id={l.holderDoorId || ''} type="npc" fallback={l.holderName} style={door} /></>}
        </p>
      ))}
      {section.levers.length === 0 && <p style={{ ...prose, color: FAINT }}>{CRISIS_PAGE_COPY.noLevers}</p>}

      {section.seeFirst.length > 0 && <Heading>{CRISIS_PAGE_COPY.seeFirst}</Heading>}
      {section.seeFirst.map((f) => (
        <p key={f.id} data-testid="crisis-see-first" style={prose}><span style={{ fontWeight: 800, color: MARK.ink }}>{f.label}: </span>{f.text}</p>
      ))}

      {section.ifNothingIsDone && <Heading>{CRISIS_PAGE_COPY.ifNothing}</Heading>}
      {section.ifNothingIsDone && <p data-testid="crisis-if-nothing" style={prose}>{section.ifNothingIsDone}</p>}

      {section.hook && <Heading>{CRISIS_PAGE_COPY.hook}</Heading>}
      {section.hook && <p data-testid="crisis-hook" style={{ ...prose, fontStyle: 'italic' }}>{section.hook}</p>}
    </section>
  );
}

export default function CrisisTab({ settlement, canAuthor = false }) {
  const sections = useMemo(() => composeCrisisPage(settlement), [settlement]);
  const roster = useMemo(() => castRosterOf(settlement), [settlement]);
  if (!sections.length) return null;
  return (
    <div style={{ ...FLUSH_PAGE, background: MARK.ground }} data-testid="crisis-tab">
      <div style={FLUSH_STACK}>
        {sections.map((section) => <CrisisSection key={section.id} section={section} canAuthor={canAuthor} roster={roster} />)}
      </div>
    </div>
  );
}
