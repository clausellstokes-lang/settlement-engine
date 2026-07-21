/**
 * TableLedgerPanel.jsx — R-1 THE SESSION LEDGER (the manual surface + the clerk).
 *
 * The product's one missing loop: the world feeds the table, but the table could
 * not feed the world. Here the DM records what happened at the game table as a
 * TYPED, BOUNDED line the world remembers — the finite-semantics law made a UI.
 *
 * THE MANUAL PICKER ALWAYS WORKS (no AI): pick a kind from the closed vocabulary,
 * pick a target, set a bounded magnitude, add flavor in your own words. The
 * schema wall (domain/tableLedger) validates + builds the typed directive, which
 * enters the EXISTING pendingEdits queue as a 'table-event'. THE CLERK is optional
 * — it reads free text and proposes buckets for you to confirm; its output passes
 * the SAME wall. Free text is FLAVOR ONLY — stored verbatim, never fed to mechanics.
 *
 * Lazy-loaded (off first paint); the finite-semantics core (tableLedger) + the
 * clerk transport are imported here, in a lazy chunk — never eager.
 */
import { useState, useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { sans, FS, SP, R, INK, SLATE, SLATE_BG, MUTED, CARD, AMBER_DEEP, RED } from '../theme.js';
import {
  TABLE_EVENT_KINDS, MAGNITUDE_BAND_IDS, OBLIGATION_TYPES, KIND_SPEC,
  validateTableEvent, buildTableEffect, exposureTargets,
} from '../../domain/tableLedger.js';
// The canonical stressor accessor (already eager via the engine substrate): the
// picker and the clerk must see the SAME hardships every domain reader sees —
// `stressors` / `stress` / `stresses` aliases and the bare-object legacy shape.
import { canonStressors } from '../../domain/canonicalAccessors.js';
import Card from '../primitives/Card.jsx';
import Segmented from '../primitives/Segmented.jsx';
import Button from '../primitives/Button.jsx';
import Badge from '../primitives/Badge.jsx';
import Disclosure from '../primitives/Disclosure.jsx';

// House-voice labels for the closed vocabulary (the chronicler's register).
const KIND_LABELS = {
  incident: 'A happening',
  'stressor-relief': 'A hardship eased',
  obligation: 'A burden taken on',
  exposure: 'A secret laid bare',
};
const KIND_HINTS = {
  incident: 'A moment worth remembering — recorded as a line of the settlement’s chronicle.',
  'stressor-relief': 'The party lifted a hardship the settlement was carrying.',
  obligation: 'The settlement now owes a debt or bears a new burden.',
  exposure: 'A hidden corruption is dragged into the light.',
};
const BAND_LABELS = { minor: 'Slight', moderate: 'Marked', major: 'Grave' };
const OBLIGATION_LABELS = {
  debt: 'A debt', famine: 'Famine', scarcity: 'Scarcity',
  unrest: 'Unrest', siege: 'A siege', plague: 'Plague',
};

const KIND_OPTIONS = TABLE_EVENT_KINDS.map((id) => ({ id, label: KIND_LABELS[id] }));
const BAND_OPTIONS = MAGNITUDE_BAND_IDS.map((id) => ({ id, label: BAND_LABELS[id] }));

const selectStyle = {
  width: '100%', padding: `${SP.sm}px ${SP.md}px`, borderRadius: R.md,
  border: `1px solid ${SLATE_BG}`, background: CARD, color: INK,
  fontSize: FS.sm, fontFamily: sans,
};
const labelStyle = { display: 'block', fontSize: FS.xs, color: MUTED, fontFamily: sans, letterSpacing: '0.03em', marginBottom: SP.xs, textTransform: 'uppercase' };

export default function TableLedgerPanel() {
  const settlement = useStore((s) => s.settlement);
  const phase = useStore((s) => s.phase);
  const queue = useStore((s) => s.pendingEditsQueue || []);
  const queueEdit = useStore((s) => s.queueEdit);
  const commit = useStore((s) => s.commitPendingEdits);
  const revertAll = useStore((s) => s.revertPendingEdits);

  const [kind, setKind] = useState('incident');
  const [targetRef, setTargetRef] = useState('');
  const [band, setBand] = useState('moderate');
  const [flavor, setFlavor] = useState('');
  const [note, setNote] = useState('');

  const spec = KIND_SPEC[kind];

  // Targets drawn from the LIVE settlement — the DM can only name what is there.
  // Stressors resolve through canonStressors (every alias + legacy shape); exposure
  // offers ONLY what EXPOSE_CORRUPTION can act on (exposureTargets — corrupt NPCs +
  // corruption-impaired institutions/factions, id-or-name refs the engine resolves),
  // so a recorded exposure can never ghost into a target_not_found veto.
  const targetOptions = useMemo(() => {
    if (kind === 'obligation') return OBLIGATION_TYPES.map((t) => ({ ref: t, label: OBLIGATION_LABELS[t] || t }));
    if (kind === 'stressor-relief') {
      return canonStressors(settlement)
        .map((s) => ({ ref: String(s.type || s.name || ''), label: String(s.label || s.name || s.type || 'a hardship') }))
        .filter((o) => o.ref);
    }
    if (kind === 'exposure') return exposureTargets(settlement);
    return [];
  }, [kind, settlement]);

  const tableEvents = queue.filter((e) => e.kind === 'table-event' && !e.reverted);

  if (!settlement) {
    return (
      <Card title="The Session Ledger" kicker="At the table">
        <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: 0 }}>
          Open a settlement to keep its ledger. What happens at your table &mdash; a hardship eased,
          a debt taken on, a secret laid bare &mdash; is recorded here as a line the world remembers.
        </p>
      </Card>
    );
  }

  const incidentNeedsCanon = kind === 'incident' && phase !== 'canon';
  const targetChosen = !spec.needsTarget || !!targetRef;
  const canRecord = targetChosen && !incidentNeedsCanon;

  function record() {
    const input = {
      kind, flavor,
      ...(spec.needsMagnitude ? { magnitude: band } : {}),
      ...(spec.needsTarget ? { targets: { ref: targetRef, label: (targetOptions.find((o) => o.ref === targetRef) || {}).label } } : {}),
    };
    const { ok, errors, record: rec } = validateTableEvent(input);
    if (!ok) { setNote(errors[0] || 'That entry could not be recorded.'); return; }
    const queued = queueEdit('table-event', { directive: buildTableEffect(rec), record: rec });
    if (!queued) { setNote('That entry could not be queued.'); return; }
    setFlavor(''); setTargetRef(''); setNote('');
  }

  return (
    <Card title="The Session Ledger" kicker="At the table">
      <p style={{ fontFamily: sans, fontSize: FS.sm, color: MUTED, margin: `0 0 ${SP.md}px` }}>
        Record what happened at your table. Each entry becomes a typed, bounded line the world
        remembers &mdash; and your own words are kept, verbatim, on the receipt.
      </p>

      <div style={{ marginBottom: SP.md }}>
        <span style={labelStyle}>What happened</span>
        <Segmented options={KIND_OPTIONS} value={kind} onChange={(k) => { setKind(k); setTargetRef(''); setNote(''); }} ariaLabel="Kind of table event" />
        <p style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED, margin: `${SP.xs}px 0 0` }}>{KIND_HINTS[kind]}</p>
      </div>

      {spec.needsTarget && (
        <div style={{ marginBottom: SP.md }}>
          <span style={labelStyle}>Who or what</span>
          <select id="tl-target" aria-label="Who or what" style={selectStyle} value={targetRef} onChange={(e) => setTargetRef(e.target.value)}>
            <option value="">{targetOptions.length ? 'Choose…' : 'Nothing here to name yet'}</option>
            {targetOptions.map((o) => <option key={o.ref} value={o.ref}>{o.label}</option>)}
          </select>
        </div>
      )}

      {spec.needsMagnitude && (
        <div style={{ marginBottom: SP.md }}>
          <span style={labelStyle}>How much</span>
          <Segmented options={BAND_OPTIONS} value={band} onChange={setBand} ariaLabel="Magnitude" />
        </div>
      )}

      <div style={{ marginBottom: SP.md }}>
        <span style={labelStyle}>In your own words</span>
        <textarea
          id="tl-flavor" aria-label="In your own words" value={flavor} onChange={(e) => setFlavor(e.target.value)} rows={2}
          placeholder="The party bought the miller a season’s grain…"
          style={{ ...selectStyle, resize: 'vertical', minHeight: 44 }}
        />
        <p style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED, margin: `${SP.xs}px 0 0` }}>
          Kept verbatim on the receipt. Never fed to the engine &mdash; flavor only.
        </p>
      </div>

      {incidentNeedsCanon && (
        <p style={{ fontFamily: sans, fontSize: FS.xs, color: AMBER_DEEP, margin: `0 0 ${SP.sm}px` }}>
          Canonize this settlement to write a chronicle line.
        </p>
      )}
      {note && (
        <p role="alert" style={{ fontFamily: sans, fontSize: FS.xs, color: RED, margin: `0 0 ${SP.sm}px` }}>{note}</p>
      )}

      <div style={{ display: 'flex', gap: SP.sm, alignItems: 'center' }}>
        <Button variant="primary" size="sm" onClick={record} disabled={!canRecord}>Record it</Button>
        <TableClerkAffordance
          // The clerk grounds on the SAME rosters the manual picker offers: canonical
          // stressors (all aliases) and the compromised exposure roster — so the two
          // paths can never disagree about what is nameable on this settlement.
          targets={{
            stressors: canonStressors(settlement).map((s) => String(s.type || s.name || '')).filter(Boolean),
            npcs: exposureTargets(settlement).map((t) => ({ id: t.ref, name: t.label })),
          }}
          onAccept={(rec) => queueEdit('table-event', { directive: buildTableEffect(rec), record: rec })}
        />
      </div>

      {tableEvents.length > 0 && (
        <div style={{ marginTop: SP.lg, borderTop: `1px solid ${SLATE_BG}`, paddingTop: SP.md }}>
          <span style={labelStyle}>{tableEvents.length} recorded, awaiting the world</span>
          <ul style={{ listStyle: 'none', margin: `${SP.xs}px 0 ${SP.md}px`, padding: 0, display: 'flex', flexDirection: 'column', gap: SP.xs }}>
            {tableEvents.map((e) => (
              <li key={e.id} style={{ display: 'flex', alignItems: 'center', gap: SP.sm, fontFamily: sans, fontSize: FS.sm, color: INK }}>
                <Badge tone="neutral" size="sm">{KIND_LABELS[e.payload?.record?.kind] || 'entry'}</Badge>
                <span style={{ color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {e.payload?.record?.flavor || KIND_HINTS[e.payload?.record?.kind] || ''}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: SP.sm }}>
            <Button variant="primary" size="sm" onClick={commit}>Let the world feel it</Button>
            <Button variant="ghost" size="sm" onClick={revertAll} style={{ color: SLATE }}>Discard</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * The optional AI clerk affordance — reads free text, proposes buckets, and lets
 * the DM confirm each. Inert-honest when the edge is unconfigured (it says so and
 * the manual picker above is unaffected). Every proposal is re-validated by the
 * schema wall inside compileTableClerk before it can be confirmed.
 * @param {{ targets: any, onAccept: (record:any)=>void }} props
 */
function TableClerkAffordance({ targets, onAccept }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(/** @type {any} */ (null));

  async function ask() {
    setBusy(true); setResult(null);
    try {
      const { compileTableClerk } = await import('../../lib/tableClerk.js');
      setResult(await compileTableClerk({ text, targets }));
    } catch { setResult({ ok: false, error: 'The clerk is unavailable right now.' }); }
    setBusy(false);
  }

  return (
    <Disclosure title="Let the clerk sort your words">
      <div style={{ padding: `${SP.sm}px 0` }}>
        <textarea
          value={text} onChange={(e) => setText(e.target.value)} rows={2} aria-label="Tell the clerk what happened"
          placeholder="Tell the clerk, in a sentence, what happened&hellip;"
          style={{ ...selectStyle, resize: 'vertical', minHeight: 44, marginBottom: SP.sm }}
        />
        <Button variant="secondary" size="sm" onClick={ask} disabled={busy || !text.trim()}>
          {busy ? 'Reading…' : 'Ask the clerk'}
        </Button>
        {result && !result.ok && (
          <p style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED, margin: `${SP.sm}px 0 0` }}>{result.error}</p>
        )}
        {result && result.ok && (
          <div style={{ marginTop: SP.sm, display: 'flex', flexDirection: 'column', gap: SP.xs }}>
            {(result.accepted || []).map((a) => (
              <div key={a.index} style={{ display: 'flex', alignItems: 'center', gap: SP.sm, fontFamily: sans, fontSize: FS.sm }}>
                <Badge tone="neutral" size="sm">{KIND_LABELS[a.record.kind] || a.record.kind}</Badge>
                <span style={{ color: MUTED, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.record.flavor || a.record.targetLabel}</span>
                <Button variant="ghost" size="sm" onClick={() => { onAccept(a.record); setResult({ ...result, accepted: result.accepted.filter((x) => x.index !== a.index) }); }}>Keep</Button>
              </div>
            ))}
            {!(result.accepted || []).length && (
              <p style={{ fontFamily: sans, fontSize: FS.xs, color: MUTED, margin: 0 }}>The clerk found nothing it could bucket. Record it by hand.</p>
            )}
          </div>
        )}
      </div>
    </Disclosure>
  );
}
