/**
 * CauseWalkPanel — VISION V-4 THE CAUSE-WALK. "Click the coup, find the famine."
 *
 * Renders the backward provenance chain for one chronicle receipt: each hop with
 * its receipt, down to the roots, ending on the graceful "the ledger holds no
 * deeper memory of this" line at a root or a dark ledger. Pure view over
 * buildCauseWalk (the secrets seam lives there — covert hops arrive already
 * redacted for a non-DM viewer). A lazy leaf: STATIC-imported by AdvanceReport
 * (which rides RealmInspector's already-lazy chunk) ⇒ zero first-paint bytes.
 *
 * @enforced-by tests/domain/causeWalk.test.js (the read-model + secrets seam).
 */

import { useMemo } from 'react';
import { X } from 'lucide-react';
import { buildCauseWalk } from '../../domain/display/causeWalk.js';
import { discourseProseActive, realizeCauseWalk } from '../../domain/display/discourseKernel.js';
import { tickCalendarLabel } from '../../domain/display/humanizeEngineTokens.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, SP, sans } from '../theme.js';
import { IconButton } from './IconButton.jsx';

/**
 * @param {Object} props
 * @param {any} props.worldState
 * @param {string} props.rootId
 * @param {(id: string) => string} [props.resolveName]
 * @param {boolean} [props.seesSecrets]  DM view ⇒ covert hops shown (default true here:
 *   AdvanceReport is the owner's own realm inspector; a non-owner mount must pass false)
 * @param {() => void} [props.onClose]
 */
export default function CauseWalkPanel({ worldState, rootId, resolveName, seesSecrets = true, onClose }) {
  const nameOf = useMemo(() => resolveName || ((id) => String(id)), [resolveName]);
  const walk = useMemo(
    () => buildCauseWalk({ worldState, rootId, seesSecrets }),
    [worldState, rootId, seesSecrets],
  );

  // TRANCHE 3c THE DISCOURSE KERNEL — when the virtual `discourseProseEnabled`
  // flag is lit, the disconnected receipt list renders as ONE connected passage,
  // every clause still tracing to its receipt. Absent flag ⇒ null ⇒ the exact
  // current rendering path below, byte-identical (the dormancy law).
  const discourse = useMemo(
    () => (discourseProseActive(worldState)
      ? realizeCauseWalk(walk, {
        seedId: worldState?.rngSeed ?? rootId,
        nameOf,
        provenance: worldState?.spatialLedgers?.provenance,
      })
      : null),
    [worldState, walk, rootId, nameOf],
  );

  const rootHeadline = walk.root ? walk.root.headline : String(rootId);

  return (
    <div
      data-testid="cause-walk"
      style={{ border: `1px solid ${GOLD}`, background: CARD_ALT, padding: SP.sm, display: 'grid', gap: 6 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ flex: 1, color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Tracing the causes
        </div>
        {onClose && (
          <IconButton onClick={onClose} aria-label="Close cause trace" size="sm">
            <X size={13} />
          </IconButton>
        )}
      </div>

      {discourse ? (
        <p data-testid="cause-walk-prose" style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 650, lineHeight: 1.55 }}>
          {discourse.text}
        </p>
      ) : (
        <>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 850, lineHeight: 1.3 }}>
            {rootHeadline}
          </div>

          {walk.chain.length > 0 && (
            <ol data-testid="cause-walk-chain" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 4 }}>
              {walk.chain.map((hop, i) => {
                const names = (hop.settlementIds || []).map(nameOf).filter(Boolean);
                return (
                  <li
                    key={`${hop.id}-${i}`}
                    data-testid="cause-walk-hop"
                    data-redacted={hop.redacted ? 'true' : undefined}
                    style={{
                      marginLeft: Math.min(hop.depth - 1, 4) * 10,
                      borderLeft: `2px solid ${BORDER}`,
                      paddingLeft: 8,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                      <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 800 }}>
                        ← because
                      </span>
                      <span style={{ color: hop.redacted ? MUTED : BODY, fontFamily: sans, fontSize: FS.micro, fontWeight: 750, fontStyle: hop.redacted ? 'italic' : undefined }}>
                        {hop.headline}
                      </span>
                      {hop.tick != null && (
                        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro }}>
                          · {tickCalendarLabel(hop.tick)}
                        </span>
                      )}
                    </div>
                    {names.length > 0 && (
                      <div style={{ marginTop: 2, color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 800 }}>
                        {names.slice(0, 3).join(', ')}{names.length > 3 ? ` +${names.length - 3}` : ''}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </>
      )}

      {walk.graceLine && (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, fontStyle: 'italic', borderTop: `1px solid ${BORDER2}`, paddingTop: 6, background: CARD }}>
          {walk.graceLine}
        </div>
      )}
    </div>
  );
}
