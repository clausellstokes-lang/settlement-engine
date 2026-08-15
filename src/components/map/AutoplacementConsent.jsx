/**
 * AutoplacementConsent.jsx — THE AUTOPLACE CONSENT POPUP (realm directive 1,
 * binding design ruling J-D1).
 *
 * "One button places all settlements on the realm map balancing sim dynamism and
 * a connected visual web, matching terrain/resources; mismatches trigger an
 * OPTIONAL 'bare minimum adjustments' popup."
 *
 * ── PLACEMENT-FIRST, THEN CONSENT (the J-D1 order, and it is load-bearing) ───
 * The survey runs on mount and mutates NOTHING. By the time this dialog has
 * anything to show, the whole layout has already been derived and every proposed
 * action is itemized on screen. The user is never asked to approve a plan that
 * does not exist yet, and nothing whatsoever is written until Confirm.
 *
 * ── THE THREE CLASSES, NEVER BUNDLED ────────────────────────────────────────
 *   (a) MOVE / PLACE — position only, default-selected, individually revocable.
 *       Safe because a position is campaign map data: no generation input is read
 *       or written on this path, so the same seed still makes the same world.
 *   (b) PAINT MAP TERRAIN — reported UNAVAILABLE with its reason. The map canvas
 *       is a vendored frame behind an iframe whose whole command surface was
 *       enumerated; it exposes no programmatic terrain write, only an editor that
 *       arms for the user's own pointer. J-D1 forbids inventing canvas mutations,
 *       so this class renders as an honest absence rather than a dead control.
 *   (c) RE-TERRAIN AS REGEN — shown ONLY on a mismatch row, never pre-selected,
 *       and stated plainly for what it is. DELIBERATELY NOT WIRED IN THIS WAVE
 *       (deliberately deferred, documented, not a bug to re-find): terrain is a
 *       generation input, so rebuilding a settlement under the same-seed law is an
 *       owner-gated act, not something a placement pass may do on the way past.
 *       The row states the consequence and names it as a separate decision.
 *
 * ── MISMATCHES ARE OPT-IN, NOT OPT-OUT ──────────────────────────────────────
 * A settlement whose ground does not exist on this realm starts UNCHECKED. The
 * safe class starts checked because moving a pin is reversible in one gesture; a
 * mismatch is a compromise about the world, and a compromise nobody actively
 * agreed to is not consent.
 *
 * LAZY LEAF: mounted through lazy() by WorldMapStage only when the button is
 * pressed, so a session that never autoplaces pays nothing for it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { MapPinned, AlertTriangle, Ban, Loader } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { resolveTerrain } from '../../domain/resolveTerrain.js';
import { isCanonSave } from '../../domain/campaign/canon.js';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';
import Button from '../primitives/Button.jsx';
import {
  GOLD, INK, BODY, MUTED, SECOND, BORDER, CARD, CARD_ALT, RED, sans, FS, SP,
} from '../theme.js';

const TITLE_ID = 'autoplace-consent-title';

/**
 * Project the campaign's canon settlements into the planner's READ-ONLY roster.
 * Deliberately hand-built rather than passed through: the planner must never
 * receive a settlement object, because a module that cannot see a `config` cannot
 * write one. Terrain comes from resolveTerrain, the ONE terrain read.
 */
export function rosterForPlanning(saves, placements) {
  const byId = new Map();
  for (const [burgId, p] of Object.entries(placements || {})) {
    if (p?.settlementId != null) byId.set(String(p.settlementId), { burgId, cellId: p.cellId });
  }
  const out = [];
  for (const save of saves || []) {
    const id = save?.id != null ? String(save.id) : '';
    if (!id || !isCanonSave(save)) continue;
    const seat = byId.get(id);
    out.push({
      id,
      burgId: seat ? seat.burgId : null,
      name: save.name || save.settlement?.name || 'A settlement',
      terrain: resolveTerrain(save.settlement?.config) || '',
      tier: save.tier || save.settlement?.tier || '',
      cellId: Number.isInteger(seat?.cellId) ? seat.cellId : null,
    });
  }
  return out.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export default function AutoplacementConsent({ saves = [], onClose, announce }) {
  const placements = useStore((s) => s.mapState.placements);
  const mapSeed = useStore((s) => s.mapState.seed);
  const applyAutoplacement = useStore((s) => s.applyAutoplacement);
  const canonizedAt = useStore((s) => {
    const c = (s.campaigns || []).find((x) => x?.id != null && String(x.id) === String(s.activeCampaignId));
    return c?.worldState?.canonizedAt || null;
  });

  const [phase, setPhase] = useState('surveying');
  const [plan, setPlan] = useState(null);
  const [failure, setFailure] = useState('');
  const [chosen, setChosen] = useState(() => new Set());
  const dialogRef = useDialogFocusTrap(true, onClose);
  // The survey must not write into an unmounted tree if the dialog closes mid-read.
  const liveRef = useRef(true);
  useEffect(() => () => { liveRef.current = false; }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (canonizedAt) { setPhase('canonized'); return; }
      try {
        // The three heavy leaves ride this interaction chunk, never first paint.
        const [{ getSpatialCaptureBridge }, raster, placer] = await Promise.all([
          import('../../lib/spatialCaptureRegistry.js'),
          import('../../domain/realm/placementRaster.js'),
          import('../../domain/realm/autoplacement.js'),
        ]);
        const bridge = getSpatialCaptureBridge();
        if (!bridge || typeof bridge.getSpatialPack !== 'function' || !bridge.isReady) {
          if (!cancelled) { setFailure('The realm map is not open, so its ground cannot be read yet.'); setPhase('failed'); }
          return;
        }
        // READ-ONLY: the same one-shot pack read the canonize path uses. It copies
        // terrain arrays out of the frame and mutates nothing inside it.
        const reply = await bridge.getSpatialPack();
        const pack = reply?.pack;
        if (!pack?.cells?.h?.length) {
          if (!cancelled) { setFailure('The realm map has no terrain to read yet.'); setPhase('failed'); }
          return;
        }
        const settlements = rosterForPlanning(saves, placements);
        if (!settlements.length) {
          if (!cancelled) { setFailure('This campaign has no canon settlements to place.'); setPhase('failed'); }
          return;
        }
        const next = placer.planAutoplacement({
          raster: raster.realmRasterFromPack(pack),
          settlements,
          seed: String(mapSeed ?? ''),
        });
        if (cancelled || !liveRef.current) return;
        setPlan(next);
        // The safe class is pre-selected; the mismatch class deliberately is not.
        setChosen(new Set(next.proposals.map((p) => p.settlementId)));
        setPhase('ready');
        announce?.(`The realm is surveyed. ${next.proposals.length} settlements have a better place to stand.`);
      } catch (err) {
        if (!cancelled) { setFailure(`The realm could not be surveyed: ${err?.message || err}`); setPhase('failed'); }
      }
    })();
    return () => { cancelled = true; };
    // Survey once per open: a plan that re-derived under the user's cursor as the
    // store ticked would move the very rows they were reading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = useCallback((id) => {
    setChosen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const confirm = useCallback(() => {
    if (!plan) return;
    const all = [...plan.proposals, ...plan.mismatches.map((m) => m.bestAvailable).filter(Boolean)];
    const agreed = all.filter((p) => chosen.has(p.settlementId));
    if (!agreed.length) { onClose?.(); return; }
    setPhase('applying');
    const res = applyAutoplacement({ proposals: agreed, seed: plan.seed, version: plan.version });
    if (res && res.ok === false) {
      setFailure(res.reason === 'canonized'
        ? 'This realm is canonized, so its settlements can no longer be moved.'
        : 'Nothing could be placed.');
      setPhase('failed');
      return;
    }
    const total = (res?.moved || 0) + (res?.placed || 0);
    announce?.(total === 1 ? 'One settlement took its place.' : `${total} settlements took their places.`);
    onClose?.();
  }, [plan, chosen, applyAutoplacement, announce, onClose]);

  const rowStyle = {
    display: 'flex', alignItems: 'flex-start', gap: SP.sm,
    padding: `${SP.xs}px ${SP.sm}px`, borderBottom: `1px solid ${BORDER}`,
    fontSize: FS.sm, fontFamily: sans, color: INK,
  };

  return (
    <div
      role="presentation"
      className="oc-m-warmdim"
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SP.lg,
      }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <section
        ref={dialogRef}
        data-testid="autoplacement-consent"
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        tabIndex={-1}
        style={{
          width: 'min(100%, 700px)', maxHeight: 'min(90vh, 740px)',
          display: 'flex', flexDirection: 'column',
          border: `1px solid ${BORDER}`, background: CARD,
        }}
      >
        <header style={{
          display: 'flex', alignItems: 'flex-start', gap: SP.md,
          padding: `${SP.lg}px ${SP.lg}px ${SP.md}px`,
          borderBottom: `1px solid ${BORDER}`, background: CARD_ALT,
        }}>
          <MapPinned size={16} color={GOLD} style={{ marginTop: 3, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id={TITLE_ID} style={{
              margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.25, fontWeight: 900,
            }}>
              Draw the realm&rsquo;s charter
            </h2>
            <p style={{ margin: `${SP.xs}px 0 0`, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.45 }}>
              Every change is listed below before anything happens. Nothing is written until you confirm.
            </p>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {phase === 'surveying' && (
            <div style={{ padding: SP.lg, display: 'flex', alignItems: 'center', gap: SP.sm, color: SECOND, fontFamily: sans, fontSize: FS.sm }}>
              <Loader size={14} /> Surveying the realm for the best ground&hellip;
            </div>
          )}

          {phase === 'canonized' && (
            <div style={{ padding: SP.lg, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
              This realm is canonized. Its settlements have taken their places for good, and the map
              no longer moves them. A seed is a world, and this one is written.
            </div>
          )}

          {phase === 'failed' && (
            <div style={{ padding: SP.lg, display: 'flex', gap: SP.sm, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5 }}>
              <AlertTriangle size={15} color={RED} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{failure}</span>
            </div>
          )}

          {(phase === 'ready' || phase === 'applying') && plan && (
            <>
              {/* ── CLASS (a): position only. Safe, pre-selected. ─────────── */}
              <SectionHead
                heading="Move a settlement"
                note="Position only. Nothing about these settlements changes but where they stand."
              />
              {plan.proposals.length === 0 ? (
                <Empty text="Every settlement already stands on the best ground the realm offers." />
              ) : plan.proposals.map((p) => (
                <label key={p.settlementId} htmlFor={`autoplace-move-${p.settlementId}`} style={rowStyle}>
                  <input
                    id={`autoplace-move-${p.settlementId}`}
                    type="checkbox"
                    aria-label={`${p.name}: ${p.reason}`}
                    checked={chosen.has(p.settlementId)}
                    onChange={() => toggle(p.settlementId)}
                    style={{ marginTop: 3 }}
                  />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ fontWeight: 700 }}>{p.name}</strong>
                    <span style={{ color: BODY }}> {p.reason}</span>
                    {p.kind === 'place' && (
                      <span style={{ color: SECOND, fontSize: FS.xxs, display: 'block' }}>
                        Not yet on the map. This puts it there for the first time.
                      </span>
                    )}
                  </span>
                </label>
              ))}

              {plan.unchanged.length > 0 && (
                <div style={{ ...rowStyle, color: SECOND, fontStyle: 'italic' }}>
                  {plan.unchanged.length === 1
                    ? '1 settlement is already well placed and will not be touched.'
                    : `${plan.unchanged.length} settlements are already well placed and will not be touched.`}
                </div>
              )}

              {/* ── CLASS (b): paint. Unavailable, with the reason. ───────── */}
              <SectionHead heading="Paint the map's terrain" note="Reshaping the land itself." />
              <div style={{ ...rowStyle, color: SECOND }}>
                <Ban size={14} color={MUTED} style={{ flexShrink: 0, marginTop: 2 }} />
                <span data-testid="paint-unavailable">{plan.paint.reason}</span>
              </div>

              {/* ── CLASS (c): mismatches. Opt-in, and regen is never wired in. ── */}
              {plan.mismatches.length > 0 && (
                <>
                  <SectionHead
                    heading="Settlements this realm cannot house"
                    note="Their ground does not exist anywhere on this map. Each one is your call, and none is selected for you."
                  />
                  {plan.mismatches.map((m) => (
                    <div key={m.settlementId} style={{ ...rowStyle, flexDirection: 'column', gap: SP.xs }}>
                      <label
                        htmlFor={`autoplace-mismatch-${m.settlementId}`}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: SP.sm }}
                      >
                        <input
                          id={`autoplace-mismatch-${m.settlementId}`}
                          type="checkbox"
                          aria-label={`${m.name}: ${m.reason} Move it to the closest available ground.`}
                          checked={chosen.has(m.settlementId)}
                          onChange={() => toggle(m.settlementId)}
                          style={{ marginTop: 3 }}
                        />
                        <span>
                          <strong style={{ fontWeight: 700 }}>{m.name}</strong>
                          <span style={{ color: BODY }}> {m.reason}</span>
                          {m.bestAvailable && (
                            <span style={{ color: SECOND, fontSize: FS.xxs, display: 'block' }}>
                              {m.bestAvailable.reason}
                            </span>
                          )}
                        </span>
                      </label>
                      <div
                        data-testid={`reterrain-${m.settlementId}`}
                        style={{
                          marginLeft: 24, padding: SP.xs, border: `1px solid ${BORDER}`,
                          background: CARD_ALT, color: SECOND, fontSize: FS.xxs, lineHeight: 1.5,
                        }}
                      >
                        <strong style={{ color: INK, fontWeight: 700 }}>{m.options.reterrain.label}.</strong>{' '}
                        {m.options.reterrain.warning}{' '}
                        This is a separate decision and this button will not take it for you.
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        <footer style={{
          display: 'flex', justifyContent: 'flex-end', gap: SP.sm,
          padding: SP.md, borderTop: `1px solid ${BORDER}`, background: CARD_ALT,
        }}>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {phase === 'ready' ? 'Cancel' : 'Close'}
          </Button>
          {phase === 'ready' && (
            <Button
              variant="primary"
              size="sm"
              onClick={confirm}
              disabled={chosen.size === 0}
            >
              {chosen.size === 1 ? 'Place 1 settlement' : `Place ${chosen.size} settlements`}
            </Button>
          )}
        </footer>
      </section>
    </div>
  );
}

/** @param {{ title: string, note: string }} props */
function SectionHead({ heading, note }) {
  return (
    <div style={{
      padding: `${SP.sm}px ${SP.sm}px ${SP.xs}px`, background: CARD_ALT,
      borderBottom: `1px solid ${BORDER}`, fontFamily: sans,
    }}>
      <div style={{ fontSize: FS.xs, fontWeight: 800, color: INK, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {heading}
      </div>
      <div style={{ fontSize: FS.xxs, color: SECOND, marginTop: 2, lineHeight: 1.45 }}>{note}</div>
    </div>
  );
}

/** @param {{ text: string }} props */
function Empty({ text }) {
  return (
    <div style={{
      padding: SP.sm, color: SECOND, fontStyle: 'italic',
      fontSize: FS.sm, fontFamily: sans, borderBottom: `1px solid ${BORDER}`,
    }}>
      {text}
    </div>
  );
}
