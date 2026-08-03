/**
 * CausalityPopup — THE CAUSALITY POPUP, tier 3 of the Herald entry (SP-6's
 * SURFACE CONTRACT + PORTABLE POPUP + MANIPULATION DISCLOSURE amendments,
 * 2026-08-03).
 *
 * Click a headline and the chain arrives, in the DM's own paper's voice:
 *
 *   the HEADLINE           the gesture the list item already made
 *   the SUBHEADER          the plain statement, so the gesture stays honest
 *   the TELLING            the full composed chain, per-link entailed
 *   the DISCLOSURE         per link: clean · worn · planted · planted-then-worn
 *                          · unknown — the information-integrity register
 *   the CAUSE-WALK TABLE   beneath, the receipts themselves: the ground truth
 *                          both registers project (CauseWalkPanel, unchanged)
 *
 * It renders inside PortablePopup, which owns the convention: no acknowledge
 * control, so outside-click closes. It performs ZERO navigation — the dossier or
 * the Herald stays exactly where it was beneath.
 *
 * TWO MODULES, SIDE BY SIDE, DELIBERATELY: `heraldCausalVoice` composes the prose
 * and is FENCED from every belief source; `heraldIntegrity` reads the disinfo
 * record as an AUDIT register and contributes no word to any sentence. This
 * component is where the two meet, and that is the only place they meet.
 *
 * THE DISCLOSURE IS THE DM'S. `seesSecrets === false` ⇒ `disclosureFor` returns
 * null ⇒ nothing renders: not a redacted stub, not a hole where a name would sit.
 *
 * @enforced-by tests/ui/causalityPopup.test.jsx
 */

import { useMemo } from 'react';

import { UNRECEIPTED_HOP, buildCauseWalk } from '../../domain/display/causeWalk.js';
import { heraldEntryProse } from '../../domain/display/heraldCausalVoice.js';
import { classifyLinkIntegrity, disclosureFor } from '../../domain/display/heraldIntegrity.js';
import { BODY, BORDER2, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, SP, sans } from '../theme.js';
import PortablePopup from '../primitives/PortablePopup.jsx';
import CauseWalkPanel from './CauseWalkPanel.jsx';

/** The register's word for each integrity state — the DM's label, never a token. */
const INTEGRITY_LABEL = Object.freeze({
  clean: 'Clean',
  worn: 'Worn in the telling',
  planted: 'Planted',
  planted_worn: 'Planted, then worn',
  unknown: 'Unknown',
});

/** Planted links wear the alarm colour; wear and unknown stay muted (no author). */
function integrityTone(state) {
  return state === 'planted' || state === 'planted_worn' ? GOLD : MUTED;
}

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {import('./heraldFeed.js').HeraldItem|null} props.item
 * @param {any} props.worldState
 * @param {Map<string,string>} [props.nameById]
 * @param {boolean} [props.seesSecrets]   the DM gate; default false (fail closed)
 * @param {string} [props.settlementName]
 */
export default function CausalityPopup({
  open, onClose, item, worldState, nameById, seesSecrets = false, settlementName = '',
}) {
  const nameOf = useMemo(
    () => (id) => nameById?.get(String(id)) || String(id),
    [nameById],
  );

  const walk = useMemo(
    () => (item?.rootId ? buildCauseWalk({ worldState, rootId: item.rootId, seesSecrets }) : null),
    [worldState, item, seesSecrets],
  );

  // The seed is the entry's own id: the same entry tells itself the same way in
  // every world that ever renders it, from every summoning surface.
  const seed = String(item?.id || item?.rootId || '');

  const prose = useMemo(
    () => (item && walk ? heraldEntryProse({ worldState, item, walk, seed, seesSecrets }) : null),
    [worldState, item, walk, seed, seesSecrets],
  );

  const nowTick = Number.isFinite(worldState?.tick) ? Number(worldState.tick) : null;

  /** Per-link disclosure rows, in the telling's own order. */
  const disclosures = useMemo(() => {
    if (!walk || !seesSecrets) return [];
    return (walk.chain || []).map((hop) => {
      const integrity = classifyLinkIntegrity({
        worldState,
        link: {
          // RESOLVED means a receipt was FOUND. The walk's own two non-receipt
          // lines are imported, never re-spelled here: a copy that drifted from
          // the walk's wording would silently mark an unreceipted hop resolved,
          // and the register would then read it CLEAN — vouching for a link
          // whose receipt it never found, which is exactly the assumption from
          // silence the disclosure forbids.
          resolved: hop.redacted !== true && hop.headline !== UNRECEIPTED_HOP,
          lineageIds: Array.isArray(hop.lineageIds) ? hop.lineageIds : [],
          accuracy01: Number.isFinite(hop.accuracy01) ? hop.accuracy01 : 1,
          hopCount: hop.hopCount,
          tick: hop.tick,
        },
        nowTick,
      });
      const rendered = disclosureFor({
        integrity, seed: `${seed}::${hop.id}`, seesSecrets, nameOf, settlementName,
      });
      return { id: String(hop.id), clause: String(hop.headline || ''), integrity, rendered };
    });
  }, [walk, worldState, seesSecrets, seed, nameOf, settlementName, nowTick]);

  if (!open || !item) return null;

  return (
    <PortablePopup open={open} title="Why this happened" onClose={onClose} testId="causality-popup">
      <div style={{ display: 'grid', gap: SP.sm }}>
        {/* TIER 1 — THE HEADLINE. The composed gesture when the voice is lit, the
            recorded headline byte-verbatim otherwise. */}
        <div data-testid="causality-headline" style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, lineHeight: 1.35 }}>
          {prose?.headline?.text || item.headline}
        </div>

        {/* TIER 2 — THE SUBHEADER. Plain, unembellished, the recorded statement.
            Absent when the record holds no summary; never authored to fill space. */}
        {(prose?.subheader?.text || item.summary) && (
          <div data-testid="causality-subheader" style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 650, lineHeight: 1.5 }}>
            {prose?.subheader?.text || item.summary}
          </div>
        )}

        {/* TIER 3 — THE TELLING. The chain as one passage, freed from the
            headline's compression. Pull, never push. */}
        {prose?.telling?.text && (
          <p
            data-testid="causality-telling"
            style={{ margin: 0, borderLeft: `2px solid ${GOLD}`, paddingLeft: SP.sm, color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 650, lineHeight: 1.6 }}
          >
            {prose.telling.text}
          </p>
        )}

        {/* THE MANIPULATION DISCLOSURE — per link, DM only. A player audience
            reaches an empty list and this block does not render at all. */}
        {disclosures.length > 0 && (
          <div data-testid="causality-disclosure" style={{ display: 'grid', gap: 6 }}>
            <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              How each link reached the page
            </div>
            {disclosures.map((row) => (
              row.rendered && (
                <div
                  key={row.id}
                  data-testid="causality-disclosure-row"
                  data-integrity={row.rendered.state}
                  style={{ border: `1px solid ${BORDER2}`, background: CARD_ALT, padding: SP.xs, display: 'grid', gap: 3 }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ color: integrityTone(row.rendered.state), fontFamily: sans, fontSize: FS.micro, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {INTEGRITY_LABEL[row.rendered.state] || INTEGRITY_LABEL.unknown}
                    </span>
                    <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 700 }}>
                      {row.clause}
                    </span>
                  </div>
                  <div style={{ color: BODY, fontFamily: sans, fontSize: FS.micro, fontWeight: 650, lineHeight: 1.5 }}>
                    {row.rendered.line}
                  </div>
                  {/* THE SEED, ALWAYS — the planted assertion as it was sown, shown
                      beside the wear so the mutation never erases the intent. */}
                  {row.rendered.seededAssertion && (
                    <div data-testid="causality-seeded-assertion" style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 700, fontStyle: 'italic' }}>
                      Sown as: {row.rendered.seededAssertion}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}

        {/* TIER 4 — THE TABLE. The receipts themselves, the ground truth both
            registers project. Unchanged, and still the thing that outranks them. */}
        {item.rootId && (
          <CauseWalkPanel
            worldState={worldState}
            rootId={item.rootId}
            resolveName={nameOf}
            seesSecrets={seesSecrets}
          />
        )}
      </div>
    </PortablePopup>
  );
}
