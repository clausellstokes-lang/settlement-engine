/**
 * RealmDocket — THE DOCKET (W-COMPOSER-2 §10): the realm's staged future as a
 * first-class surface. Every queued event across every campaign member, in
 * REAL DRAIN ORDER (the order the next tick consumes them), with per-settlement
 * chips, per-entry cancel, and the §10 LAPSED marking (the entry's verb
 * predicate no longer holds against the CURRENT member state — it will be
 * refused visibly at the drain). Editing reopens the entry in its settlement's
 * composer (the docket law's edit affordance lives where composition lives).
 *
 * The FORECAST (the pending future's clone-run) attaches to THIS surface —
 * "the forecast button attached to IT" (§10 THE DOCKET).
 */
import { useMemo, useState } from 'react';
import { CalendarClock, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { MUTED, INK, BORDER, CARD, sans, FS, SP } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { lapseOf, campaignPeerCountFor } from '../../domain/display/docketLapse.js';
import { t } from '../../copy/index.js';
import { isGuidanceDismissed, markGuidanceDismissed } from '../../lib/guidance.js';
import RealmForecast from './RealmForecast.jsx';

// content-immersion-r2-3: the registered realm_docket_teaching whisper — its body
// (guidance.realmDocket) was dead copy that rendered NOWHERE. It now mounts here,
// dismissible through the unified sf:guidance store.
const DOCKET_WHISPER_ID = 'realm_docket_teaching';

// C2 (misc, "raw save ids in narrative prose"): the target renders by NAME when the
// docket can resolve it; an unresolvable id never reaches the reader — the verb
// stands alone rather than dressed with a raw save id.
function entryLabel(event, resolveTargetName) {
  const base = event?.type ? String(event.type).replace(/_/g, ' ').toLowerCase() : 'change';
  const target = event?.payload?.label
    || (event?.targetId != null ? resolveTargetName?.(event.targetId) : null);
  return target ? `${base}: ${target}` : base;
}

export default function RealmDocket({ campaign }) {
  const cancelQueuedEvent = useStore(s => s.cancelQueuedEvent);
  const saves = useStore(s => s.savedSettlements);
  const canUseCustom = useStore(s => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const [taught, setTaught] = useState(() => !isGuidanceDismissed(DOCKET_WHISPER_ID));

  const queue = campaign?.worldState?.pendingEvents || [];
  const settlementById = useMemo(
    () => new Map((saves || []).map(s => [String(s.id), s.settlement || s])),
    [saves],
  );

  if (!campaign?.worldState?.canonizedAt) return null;

  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`,
      padding: SP.sm, marginTop: SP.sm,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.sm,
      }}>
        <CalendarClock size={12} />
        The Docket — staged for the next tick
        <span style={{ color: MUTED, opacity: 0.7, marginLeft: 6, textTransform: 'none', fontWeight: 400 }}>
          {queue.length} queued
        </span>
      </div>

      {taught && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: SP.sm,
          padding: SP.sm, border: `1px dashed ${BORDER}`,
          fontSize: FS.xxs, fontFamily: sans, color: MUTED, lineHeight: 1.5,
        }}>
          <span style={{ flex: 1 }}>{t('guidance.realmDocket')}</span>
          <Button
            variant="ghost" size="sm" icon={<X size={10} />}
            aria-label="Dismiss this tip"
            onClick={() => { markGuidanceDismissed(DOCKET_WHISPER_ID); setTaught(false); }}
          />
        </div>
      )}

      {queue.length === 0 ? (
        <p style={{ fontSize: FS.xxs, color: MUTED, margin: 0, fontStyle: 'italic' }}>
          Nothing is staged. Orders queued on member settlements appear here in the order the tick will consume them.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
          {queue.map(item => {
            const sid = String(item.saveId);
            const settlement = settlementById.get(sid);
            const name = settlement?.name || sid;
            // experience-product-fit-3: the composer's real ctx (peer count
            // EXCLUDES this entry's own save), never the empty {} that cried wolf.
            const lapsed = lapseOf(item.event, settlement, {
              canUseCustom,
              campaignPeerCount: campaignPeerCountFor(campaign, sid),
            });
            return (
              <div key={item.queueId} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: SP.sm, background: CARD,
                border: `1px solid ${BORDER}`,
              }}>
                <span style={{
                  padding: '1px 6px', border: `1px solid ${BORDER}`,
                  fontSize: FS.xxs, fontFamily: sans, color: MUTED, whiteSpace: 'nowrap',
                }}>
                  {name}
                </span>
                <span style={{ flex: 1, fontSize: FS.xs, color: INK, fontFamily: sans }}>
                  {entryLabel(item.event, (id) => settlementById.get(String(id))?.name || null)}
                  {lapsed && (
                    <>
                      <span style={{
                        marginLeft: 8, padding: '1px 6px',
                        border: `1px solid ${BORDER}`, color: MUTED,
                        fontSize: FS.xxs, fontWeight: 700, letterSpacing: '0.04em',
                      }}>
                        LAPSED — needs your attention
                      </span>
                      <span style={{ display: 'block', fontSize: FS.xxs, color: MUTED, marginTop: 2 }}>
                        {lapsed} Left as-is, the tick will refuse it visibly — edit it from {name}&apos;s dossier, or cancel it here.
                      </span>
                    </>
                  )}
                </span>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<X size={10} />}
                  aria-label={`Cancel the queued order for ${name}`}
                  onClick={() => cancelQueuedEvent(campaign.id, item.queueId)}
                >
                  Cancel
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: FS.xxs, color: MUTED, margin: '8px 0 0', fontStyle: 'italic', lineHeight: 1.5 }}>
        Every entry stays editable (from its settlement&apos;s dossier) and cancelable until the tick consumes it.
        Realm orders queue separately as pending proposals above.
      </p>

      {/* THE FORECAST (§10): two clone-runs of the SHARED pipeline over the
          realm's pending future — never a parallel implementation. */}
      <RealmForecast campaign={campaign} />
    </div>
  );
}
