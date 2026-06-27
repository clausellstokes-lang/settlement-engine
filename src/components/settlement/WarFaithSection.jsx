/**
 * WarFaithSection — the dossier's fuller "War & Faith" read surface (UX overhaul
 * Phase 2, plan §4.1). REPLACES the thin SummaryTab FaithWarBlock.
 *
 * Reads the LIVE campaign ledgers through the pure warStatus projections + the
 * settlement's embedded primary-deity snapshot, and renders:
 *   - Strategy posture / aggressiveness disposition + its named inputs.
 *   - War-exhaustion ("war-weary — near peace") for the home.
 *   - Disposition win/loss standing.
 *   - Coalition / siege / occupation status (settlementWarStatus + liveSieges).
 *   - Trade-war prize (liveTradeWars) the settlement is fighting over.
 *   - A Faith Effects disclosure rendered from describeDeityEffects(snapshot)
 *     (good/evil→corruption, warlike→aggression, major→magic-legality,
 *     rank→authority; deity domain as flavour).
 *
 * SELF-GATING — the non-negotiable guarantee. Renders NOTHING when the
 * settlement is peaceful (no live war status, no exhaustion scar, no disposition
 * record, no trade-war involvement) AND has no embedded deity. A peaceful,
 * deity-free, non-campaign town is byte-identical: this returns null. Every
 * warStatus reader already returns []/null for a dormant/absent ledger, so the
 * gate composes from pure projections.
 *
 * Altitude-aware: at Overview ('guided') it shows the headline status only
 * (the clean face); at Detail+ it adds the named disposition inputs, the
 * exhaustion band, the trade-war prize, and the Faith Effects disclosure.
 *
 * Pure read-models only — no store writes, no rng.
 */

import { useMemo, useState, useEffect, useRef } from 'react';
import {
  settlementWarStatus,
  settlementWarExhaustion,
  warExhaustionBand,
  dispositionStandings,
  liveTradeWars,
} from '../../domain/display/warStatus.js';
import { settlementMobilization } from '../../domain/display/mobilizationStatus.js';
import { deployedArmyStatus } from '../../domain/display/armyStrength.js';
import { settlementOccupation, occupierHoldings } from '../../domain/display/occupationStatus.js';
import { settlementTradePressure } from '../../domain/display/tradePressure.js';
import { computeAggressiveness, AGGRESSION_TUNING } from '../../domain/worldPulse/disposition.js';
import { governingFactionOf } from '../../domain/rulingPower.js';
import { describeDeityEffects } from '../../domain/display/deityEffects.js';
import { factionIdFromName } from '../../lib/entities.js';
import { slugifyEntity, entityAnchor } from '../../domain/dossier/entityLinks.js';
import { useStore } from '../../store/index.js';
import { useAltitude } from '../../hooks/useAltitude.js';
import Button from '../primitives/Button.jsx';
import EntityLink from '../primitives/EntityLink.jsx';
import {
  MUTED, BODY, BORDER, RED, RED_BG, GOLD, GREEN, sans, FS, swatch,
} from '../theme.js';

const INK_BROWN = swatch['#3A2A10'];

/** Human posture band for a centered-on-1.0 aggressiveness multiplier. */
function aggressionPosture(mult) {
  if (mult > 1.18) return { label: 'Belligerent', color: RED };
  if (mult > 1.04) return { label: 'Assertive', color: GOLD };
  if (mult < 0.82) return { label: 'Pacific', color: '#1a5a28' };
  if (mult < 0.96) return { label: 'Cautious', color: '#1a4a2a' };
  return { label: 'Even-handed', color: MUTED };
}

/**
 * The named inputs that move aggressiveness, for the Detail disclosure. The
 * GOVERNMENT input is intentionally NOT included here — it is an in-dossier
 * entity (a local faction) and is rendered separately as an {@link EntityLink}
 * by the caller. These remaining inputs are descriptive phrases, not entities.
 * @param {object} settlement
 * @returns {string[]}
 */
function aggressionInputs(settlement) {
  const inputs = [];
  const temper = settlement?.config?.primaryDeitySnapshot?.temperamentAxis;
  if (temper === 'warlike') inputs.push('Warlike patron deity (+aggression)');
  else if (temper === 'peacelike') inputs.push('Peacelike patron deity (−aggression)');
  inputs.push('Cross-settlement win/loss history');
  inputs.push('Authored NPC temperament');
  return inputs;
}

/**
 * The local governing faction's display name, or null. Drives the Government
 * EntityLink in the posture-inputs disclosure: a faction is an in-dossier
 * entity, so its name links to the Power-tab card by its canonical id
 * ({@link factionIdFromName} — the SAME id the index keys factions under), not
 * by name-matching. Rename-safe by construction; degrades to plain text when
 * the faction is absent from the index.
 * @param {object} settlement
 * @returns {string|null}
 */
function governingFactionName(settlement) {
  const gov = governingFactionOf(settlement);
  return gov?.faction || gov?.archetype || null;
}

function Line({ children, strong }) {
  return (
    <p style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
      {strong && <strong>{strong} </strong>}{children}
    </p>
  );
}

/**
 * @param {{
 *   settlement: any,
 *   settlementId?: string|null,
 *   worldState?: any,
 *   regionalGraph?: any,
 *   settlements?: Array<{ id?: any, settlement?: any }>,
 *   nameFor?: (id: any) => string,
 *   forceLevel?: 'guided'|'standard'|'expert',
 * }} props
 */
export default function WarFaithSection({
  settlement,
  settlementId,
  worldState,
  regionalGraph,
  settlements = [],
  nameFor = (id) => String(id),
  forceLevel,
}) {
  const { level: prefLevel } = useAltitude();
  const level = forceLevel || prefLevel;
  const detail = level !== 'guided';
  const [faithOpen, setFaithOpen] = useState(false);

  const model = useMemo(() => {
    const id = settlementId != null ? String(settlementId) : null;
    const status = id ? settlementWarStatus({ settlementId: id, worldState, regionalGraph }) : null;
    const exhaustionRaw = id ? settlementWarExhaustion({ settlementId: id, worldState }) : 0;
    const exhaustionBand = warExhaustionBand(exhaustionRaw);
    const standing = id
      ? dispositionStandings(worldState).find(s => s.id === id) || null
      : null;
    const prizes = id
      ? liveTradeWars({ worldState, regionalGraph }).filter(
          t => t.winnerId === id || t.incumbentId === id || t.buyerId === id,
        )
      : [];

    // ── B-track surfaces (heuristic, player-safe). Covert state is EXCLUDED
    // (includeCovert defaults false) — the dossier can be shared/exported, so it
    // honours the channel-visibility convention exactly like the gallery sanitizer.
    const mobilization = id ? settlementMobilization({ settlementId: id, worldState }) : null; // covert excluded
    const army = id ? deployedArmyStatus({ settlementId: id, worldState, nameFor }) : null;
    const occupied = id ? settlementOccupation({ settlementId: id, worldState, nameFor }) : null;
    const holdings = id ? occupierHoldings({ settlementId: id, worldState, nameFor }) : null;
    const tradeTies = id
      ? settlementTradePressure({
          settlementId: id, regionalGraph, settlements, worldState, includeCovert: false, nameFor,
        }).filter(t => t.role !== 'partner' || t.phrase) // valuable/critical ties only
      : [];

    // Aggressiveness is settlement-local — meaningful even without a campaign.
    const item = { id: id || settlement?.id, settlement };
    const aggressiveness = computeAggressiveness(item, worldState || {});
    const posture = aggressionPosture(aggressiveness);

    const deity = settlement?.config?.primaryDeitySnapshot || null;
    const faithEffects = describeDeityEffects(deity);
    // DM-imposed cults (IMPOSE_CULT) — minor faiths beneath the patron.
    const cults = Array.isArray(settlement?.config?.cultDeitySnapshots) ? settlement.config.cultDeitySnapshots : [];

    return {
      status, exhaustionRaw, exhaustionBand, standing, prizes,
      mobilization, army, occupied, holdings, tradeTies,
      aggressiveness, posture, deity, faithEffects, cults,
    };
  }, [settlement, settlementId, worldState, regionalGraph, settlements, nameFor]);

  const {
    status, exhaustionRaw, exhaustionBand, standing, prizes,
    mobilization, army, occupied, holdings, tradeTies,
    aggressiveness, posture, deity, faithEffects, cults,
  } = model;

  // Dossier hyperlink SINK for the patron deity. The deity renders ONLY here, so
  // a 'Primary faith:' link from elsewhere routes to this section (TYPE_TO_TAB.
  // deity = 'war_faith'). This block declares the matching anchor and, on focus,
  // scrolls itself into view. Identity is the `deity.<slug(name)>` id the index
  // mints; the anchor is entityAnchor('deity', { name }) — the SAME string the
  // index stores. Keyed on focus `ts` so a repeat click re-fires. The faith line
  // is always visible when a deity exists, so a scroll (no force-open) suffices.
  const deityFocusId = deity?.name ? `deity.${slugifyEntity(deity.name)}` : null;
  const focusedEntity = useStore(s => s.focusedEntity);
  const sectionRef = useRef(null);
  const isDeityFocused = !!focusedEntity?.id && !!deityFocusId && focusedEntity.id === deityFocusId;
  useEffect(() => {
    if (!isDeityFocused) return;
    sectionRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, [focusedEntity?.ts, isDeityFocused]);

  // ── Self-gating ─────────────────────────────────────────────────────────────
  // Nothing live AND no deity ⇒ render nothing (byte-identical off-state). A
  // settlement-local "even-handed" aggressiveness is NOT, by itself, a reason to
  // render — only LIVE geopolitical state or an assigned deity opens the block.
  const hasLive = !!status || exhaustionRaw > 0 || !!standing || prizes.length > 0
    || !!mobilization || !!army || !!occupied || !!holdings || tradeTies.length > 0;
  if (!hasLive && !deity && cults.length === 0) return null;

  return (
    <div
      ref={sectionRef}
      id={deity ? entityAnchor('deity', { name: deity.name }) : undefined}
      data-testid="war-faith-section"
      data-level={level}
      style={{
        background: RED_BG, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${RED}`,
        borderRadius: 8, padding: '12px 14px', marginBottom: 12, fontFamily: sans,
      }}
    >
      <div style={{
        fontSize: FS.xxs, fontWeight: 800, color: RED, textTransform: 'uppercase',
        letterSpacing: '0.07em', marginBottom: 8,
      }}>
        War &amp; Faith {hasLive ? '(live)' : ''}
      </div>

      {/* ── Siege / coalition / occupation ───────────────────────────────── */}
      {status?.besiegingTargets?.length > 0 && (
        <Line strong="At war.">Its army besieges {status.besiegingTargets.map(nameFor).join(', ')}.</Line>
      )}
      {status?.besiegedBy?.length > 0 && (
        <Line strong="Under siege.">
          {status.besiegedBy.length >= 2
            ? `A coalition of ${status.besiegedBy.map(nameFor).join(', ')} holds the walls.`
            : `${nameFor(status.besiegedBy[0])} lays siege.`}
        </Line>
      )}

      {/* ── Strategy posture / aggressiveness ────────────────────────────── */}
      <div data-testid="war-faith-posture" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
        <strong>Posture:</strong>{' '}
        <span style={{ color: posture.color, fontWeight: 700 }}>{posture.label}</span>
        <span style={{ color: MUTED }}> (aggression ×{aggressiveness.toFixed(2)})</span>
      </div>

      {detail && (() => {
        const govName = governingFactionName(settlement);
        const inputs = aggressionInputs(settlement);
        return (
          <div style={{ fontSize: FS.xxs, color: MUTED, lineHeight: 1.5, margin: '0 0 6px', paddingLeft: 2 }}>
            Driven by:{' '}
            {govName && (
              <>
                Government:{' '}
                {/* The local governing faction is an in-dossier entity — link it
                    to its Power card by canonical id. Degrades to plain text
                    when the faction is not in the index / the tab is gated. */}
                <EntityLink
                  id={factionIdFromName(govName)}
                  type="faction"
                  fallback={govName}
                  style={{ fontSize: 'inherit', fontWeight: 700 }}
                />
                {inputs.length > 0 ? ' · ' : ''}
              </>
            )}
            {inputs.join(' · ')}.
            {' '}<span style={{ opacity: 0.8 }}>(deity term weight {AGGRESSION_TUNING.W_DEITY})</span>
          </div>
        );
      })()}

      {/* ── War-exhaustion scar ──────────────────────────────────────────── */}
      {exhaustionRaw > 0 && (
        <div data-testid="war-exhaustion" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
          <strong>War-weary:</strong>{' '}
          {exhaustionBand} ({exhaustionRaw.toFixed(2)})
          {detail && exhaustionBand === 'near peace' && (
            <span style={{ color: MUTED }}>. The scar is healing. This realm leans toward peace.</span>
          )}
          {detail && exhaustionBand === 'exhausted' && (
            <span style={{ color: MUTED }}>. Sustained fighting is pushing it to sue for peace.</span>
          )}
        </div>
      )}

      {/* ── Mobilization posture (B1) — heuristic, covert excluded ───────── */}
      {mobilization && (
        <div data-testid="mobilization-posture" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
          <strong>Mobilization:</strong> {mobilization.phrase}
          {detail && mobilization.ticksToDeploy > 0 && (
            <span style={{ color: MUTED }}>. Roughly {mobilization.ticksToDeploy} {mobilization.ticksToDeploy === 1 ? 'tick' : 'ticks'} from marching.</span>
          )}
        </div>
      )}

      {/* ── Deployed army strength + attrition (B0/B2) — heuristic ────────── */}
      {army && (
        <div data-testid="army-strength" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
          <strong>Army in the field:</strong> marching on {army.targetName}, {army.remainingPhrase}
          {detail && <span style={{ color: MUTED }}>; {army.conditionPhrase}.</span>}
        </div>
      )}

      {/* ── Occupation: this settlement is OCCUPIED (B3) ──────────────────── */}
      {occupied && (
        <div data-testid="occupation-occupied" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
          <strong>Occupied:</strong> held by {occupied.occupierName}, {occupied.statePhrase}
          {detail && <span style={{ color: MUTED }}>; the population is {occupied.resistancePhrase}.</span>}
        </div>
      )}

      {/* ── Occupier: this settlement HOLDS occupations (B3) — burden/benefit  */}
      {holdings && (
        <div data-testid="occupation-holder" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
          <strong>Occupier:</strong> holds {holdings.holds.map(h => h.name).join(', ')}
          {holdings.stretchedThin && <span style={{ color: RED }}>, stretched thin holding them</span>}
          {!holdings.stretchedThin && holdings.strengthened && <span style={{ color: GREEN }}>, they now pay for themselves</span>}.
        </div>
      )}

      {/* ── Strategic trade pressure / dependency / coercion (B4) ─────────── */}
      {detail && tradeTies.map((tie, i) => (
        <div key={`trade-tie-${i}`} data-testid="trade-pressure" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
          <strong>Trade pressure:</strong>{' '}
          {tie.role === 'dependent'
            ? `dependent on ${tie.partnerName}, ${tie.phrase}; losing it would bite hard`
            : tie.role === 'supplier'
              ? `holds leverage over ${tie.partnerName}, ${tie.phrase} it relies on`
              : `${tie.phrase} with ${tie.partnerName}. War between them would be costly`}.
        </div>
      ))}

      {/* ── Disposition standing ─────────────────────────────────────────── */}
      {standing && (
        <div data-testid="disposition-standing" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
          <strong>Standing:</strong>{' '}
          <span style={{ color: standing.score > 0 ? '#1a5a28' : standing.score < 0 ? RED : MUTED, fontWeight: 700 }}>
            {standing.wins}W / {standing.losses}L
          </span>
          {detail && <span style={{ color: MUTED }}> (net {standing.score > 0 ? '+' : ''}{standing.score})</span>}
        </div>
      )}

      {/* ── Trade-war prize ──────────────────────────────────────────────── */}
      {detail && prizes.map(prize => (
        <div key={prize.prizeId} data-testid="trade-war-prize" style={{ fontSize: FS.sm, color: INK_BROWN, lineHeight: 1.5, margin: '0 0 5px' }}>
          <strong>Trade war:</strong>{' '}
          {prize.winnerId === (settlementId != null ? String(settlementId) : null)
            ? `Now the primary supplier of ${prize.commodityLabel} to ${nameFor(prize.buyerId)}`
            : prize.incumbentId === (settlementId != null ? String(settlementId) : null)
              ? `Displaced as supplier of ${prize.commodityLabel} to ${nameFor(prize.buyerId)}`
              : `Contesting ${prize.commodityLabel} (${nameFor(prize.buyerId)})`}.
        </div>
      ))}

      {/* ── Faith line + effects disclosure ──────────────────────────────── */}
      {deity && (
        <>
          <Line strong="Patron faith:">
            {/* This section IS the deity's sink (the outer div carries the
                deity anchor), so the patron's own name is PLAIN TEXT — a
                self-link that scrolls to the section it already sits in is
                pointless. Cross-references to the deity from other surfaces
                resolve here via the anchor above. */}
            <span style={{ fontWeight: 700, color: INK_BROWN }}>{deity.name}</span>
            {deity.rankAxis ? ` (${deity.rankAxis})` : ''}
            {/* B5 — surface the 4th (law) axis tag; legacy 3-axis / law-neutral says nothing. */}
            {deity.lawAxis && deity.lawAxis !== 'neutral' ? ` · ${deity.lawAxis}` : ''}
            {deity.domain ? ` · ${deity.domain}` : ''}.
          </Line>
          {detail && faithEffects.length > 0 && (
            <div data-testid="faith-effects">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFaithOpen(v => !v)}
                aria-expanded={faithOpen}
                style={{
                  background: 'none', border: 'none', padding: 0, minHeight: undefined,
                  color: RED, fontWeight: 700, fontSize: FS.xs, fontFamily: sans,
                  justifyContent: 'flex-start',
                }}
              >
                {faithOpen ? '▾' : '▸'} Faith Effects ({faithEffects.length})
              </Button>
              {faithOpen && (
                <ul style={{ margin: '4px 0 0', padding: '0 0 0 14px', listStyle: 'none' }}>
                  {faithEffects.map((eff, i) => (
                    <li key={i} style={{ fontSize: FS.xs, color: BODY, marginBottom: 3, lineHeight: 1.4 }}>
                      <span style={{ color: GOLD, fontWeight: 800 }}>•</span> {eff}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Cults — minor faiths imposed beneath the patron (IMPOSE_CULT) ────── */}
      {cults.length > 0 && (
        <Line strong="Cults:">
          {cults.map((c, i) => (
            <span key={String(c._deityRef || c.name || i)}>
              {i > 0 ? ', ' : ''}
              <span style={{ fontWeight: 700, color: INK_BROWN }}>{c.name}</span>
              {c.rankAxis ? ` (${c.rankAxis})` : ''}
              {c.domain ? ` · ${c.domain}` : ''}
            </span>
          ))}
          {' beneath the patron.'}
        </Line>
      )}
    </div>
  );
}
