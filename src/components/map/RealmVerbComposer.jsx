/**
 * RealmVerbComposer — THE REALM FORCING SURFACE (W-COMPOSER-2; Composer V2 §6).
 *
 * The owner's law, delivered at realm scale: every simulation capability has a
 * forceable counterpart. This surface projects the REALM_MANIFEST (the lazy
 * realm affordance manifest): every registered realm verb, predicate-gated
 * against the CURRENT world (grayed-WITH-REASON — unavailability teaches),
 * dials rendered from schemas (bounded by construction; freetext is flavor
 * or identity only), staged through stageRealmVerb as a PENDING PROPOSAL the
 * DM approves above (cancel = dismiss). Force ≡ organic: approval applies
 * through the same arms the world's own movers use.
 */
import { useMemo, useState } from 'react';
import { Crown, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { MUTED, INK, BORDER, CARD, sans, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { realmVerbs, realmVetoProse } from '../../domain/events/realmManifest.js';
import { humanizeToken } from '../../domain/display/humanizeEngineTokens.js';
import { t } from '../../copy/index.js';
import { isGuidanceDismissed, markGuidanceDismissed } from '../../lib/guidance.js';

// content-immersion-r2-3: the registered realm_orders_teaching whisper — its body
// (guidance.realmOrders) was dead copy that rendered NOWHERE. It now mounts here,
// dismissible through the unified sf:guidance store.
const ORDERS_WHISPER_ID = 'realm_orders_teaching';

const selectStyle = {
  fontSize: 12, fontFamily: 'inherit', padding: '4px 6px',
  border: `1px solid ${BORDER}`, background: CARD, color: INK,
};

/** Band submission rule (words at the table, numbers in the engine): a key
 * ending in `01` submits the engine number; other band keys (the calamity
 * severity band) submit the table word the kernel expects. */
function bandValue(dial, word) {
  return dial.key.endsWith('01') ? (dial.bandWords[word] ?? 0.5) : word;
}

/** An authored dial label wins; imported or future schema keys remain legible. */
function dialDisplayLabel(dial) {
  return String(dial?.label || '').trim()
    || humanizeToken(dial?.key)
    || 'Order detail';
}

/** Enum values remain unchanged in `<option value>`; only their visible copy changes. */
function optionDisplayLabel(option) {
  return humanizeToken(option) || String(option ?? '');
}

export default function RealmVerbComposer({ campaign }) {
  const saves = useStore(s => s.savedSettlements);
  const stageRealmVerb = useStore(s => s.stageRealmVerb);
  const [verbKey, setVerbKey] = useState('');
  const [dialState, setDialState] = useState({});
  const [notice, setNotice] = useState(null);
  const [taught, setTaught] = useState(() => !isGuidanceDismissed(ORDERS_WHISPER_ID));

  const worldState = useMemo(() => campaign?.worldState || {}, [campaign?.worldState]);
  const ctx = useMemo(() => {
    const memberIds = new Set((campaign?.settlementIds || []).map(String));
    return {
      settlements: (saves || [])
        .filter(s => memberIds.has(String(s.id)))
        .map(s => ({ id: String(s.id), name: s.settlement?.name || s.name || String(s.id), settlement: s.settlement })),
      tick: worldState.tick ?? 0,
    };
  }, [saves, campaign?.settlementIds, worldState.tick]);

  const verbs = useMemo(() => realmVerbs().map(v => ({
    entry: v,
    verdict: v.predicate(worldState, ctx),
  })), [worldState, ctx]);

  const active = verbs.find(v => v.entry.verb === verbKey) || null;
  const memberOptions = ctx.settlements.map(s => ({ id: s.id, name: s.name }));

  function pick(v) {
    setVerbKey(v.entry.verb);
    setNotice(null);
    // Dial defaults (bounded by construction — the schema's own defaults).
    const next = {};
    for (const d of v.entry.dials || []) next[d.key] = d.default ?? '';
    setDialState(next);
  }

  async function stage() {
    if (!active) return;
    const args = {};
    for (const d of active.entry.dials || []) {
      const raw = dialState[d.key];
      if (d.kind === 'band') args[d.key] = bandValue(d, String(raw || d.default));
      else if (d.kind === 'toggle') args[d.key] = !!raw;
      else if (raw != null && String(raw) !== '') args[d.key] = String(raw);
    }
    // composer-realm-verbs-1: a dial may stage a COMPOSITE value (e.g. the
    // FORCE_RECONSIDERATION course = actorId + courseKey) that the entry resolves
    // into the real apply args before minting.
    const staged = typeof active.entry.stageArgs === 'function' ? active.entry.stageArgs(args) : args;
    const r = await stageRealmVerb(campaign.id, active.entry.verb, staged);
    if (r && r.ok) {
      setNotice({ ok: true, text: 'Queued as a pending proposal. Approve or dismiss it in the proposals list.' });
    } else {
      setNotice({ ok: false, text: r?.prose || realmVetoProse(r?.code) || 'The order could not be staged.' });
    }
  }

  if (!campaign?.worldState?.canonizedAt) return null;

  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, padding: SP.sm, marginTop: SP.sm }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: SP.sm,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans, color: MUTED,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <Crown size={12} /> Realm Orders
      </div>
      {taught && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: SP.sm,
          padding: SP.sm, border: `1px dashed ${BORDER}`,
          fontSize: FS.xxs, fontFamily: sans, color: MUTED, lineHeight: 1.5,
        }}>
          <span style={{ flex: 1 }}>{t('guidance.realmOrders')}</span>
          <Button
            variant="ghost" size="sm" icon={<X size={10} />}
            aria-label="Dismiss this tip"
            onClick={() => { markGuidanceDismissed(ORDERS_WHISPER_ID); setTaught(false); }}
          />
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: SP.sm }}>
        {verbs.map(v => (
          <Button
            key={v.entry.verb}
            size="sm"
            variant={verbKey === v.entry.verb ? 'primary' : 'ghost'}
            aria-label={v.entry.label}
            onClick={() => pick(v)}
            style={v.verdict.available ? undefined : { opacity: 0.55 }}
          >
            {v.entry.label}
          </Button>
        ))}
      </div>

      {active && !active.verdict.available && (
        <div style={{ padding: SP.sm, border: `1px dashed ${BORDER}`, fontSize: FS.xxs, fontFamily: sans, color: MUTED, lineHeight: 1.5 }}>
          {/* Grayed-WITH-REASON (design LAW): unavailability teaches. */}
          {active.verdict.reasons.join(' ')} {active.verdict.unlocks.join(' ')}
        </div>
      )}

      {active && active.verdict.available && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          {(active.entry.dials || []).map(d => (
            <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: FS.xs, fontFamily: sans, color: INK }}>
              <span style={{ minWidth: 160, color: MUTED }}>{dialDisplayLabel(d)}</span>
              {d.kind === 'target' && (
                <select
                  id={`realm-dial-${d.key}`}
                  aria-label={dialDisplayLabel(d)}
                  style={selectStyle}
                  value={dialState[d.key] || ''}
                  onChange={e => setDialState(s => ({ ...s, [d.key]: e.target.value }))}
                >
                  <option value="">Pick a settlement</option>
                  {(active.entry.targetOptions?.(worldState, ctx) || memberOptions).map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                  {/* Members always listable (the manifest's options narrow the
                      primary target; the apply-time gates stay the law). */}
                  {memberOptions
                    .filter(member => {
                      const listedTargets = active.entry.targetOptions?.(worldState, ctx) || [];
                      return !listedTargets.some(
                        target => String(target.id) === String(member.id),
                      );
                    })
                    .map(member => (
                      <option key={`m-${member.id}`} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                </select>
              )}
              {(d.kind === 'enum' || d.kind === 'band') && (
                <select
                  id={`realm-dial-${d.key}`}
                  aria-label={dialDisplayLabel(d)}
                  style={selectStyle}
                  value={dialState[d.key] ?? String(d.default ?? '')}
                  onChange={e => setDialState(s => ({ ...s, [d.key]: e.target.value }))}
                >
                  {(d.kind === 'enum' ? d.options : Object.keys(d.bandWords)).map(o => (
                    <option key={String(o)} value={String(o)}>{optionDisplayLabel(o)}</option>
                  ))}
                </select>
              )}
              {d.kind === 'toggle' && (
                <input
                  id={`realm-dial-${d.key}`}
                  aria-label={dialDisplayLabel(d)}
                  type="checkbox"
                  checked={!!dialState[d.key]}
                  onChange={e => setDialState(s => ({ ...s, [d.key]: e.target.checked }))}
                />
              )}
              {d.kind === 'text' && (
                <input
                  id={`realm-dial-${d.key}`}
                  aria-label={dialDisplayLabel(d)}
                  style={{ ...selectStyle, flex: 1 }}
                  value={dialState[d.key] || ''}
                  placeholder={dialDisplayLabel(d)}
                  onChange={e => setDialState(s => ({ ...s, [d.key]: e.target.value }))}
                />
              )}
            </div>
          ))}
          <div>
            <Button size="sm" variant="primary" onClick={stage}>
              Stage the order
            </Button>
          </div>
        </div>
      )}

      {notice && (
        <div style={{
          marginTop: SP.xs, padding: SP.sm, border: `1px ${notice.ok ? 'solid' : 'dashed'} ${BORDER}`,
          fontSize: FS.xxs, fontFamily: sans, color: notice.ok ? INK : MUTED,
        }}>
          {notice.text}
        </div>
      )}

      <p style={{ fontSize: FS.xxs, color: MUTED, margin: '8px 0 0', fontStyle: 'italic', lineHeight: 1.5 }}>
        Every order stages as a pending proposal and applies through the world&apos;s own machinery on approval:
        the walls hold even under force, and a refused order says why.
      </p>
    </div>
  );
}
