import React, { useMemo } from 'react';
import { FS, swatch, EMPTY_VALUE } from '../../theme.js';

import { sans } from '../Primitives';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { extractSettlementContext } from '../dailyLifeLogic';
import { deriveDailyLifeSlot, DAILY_LIFE_EMPTY_SLOT_TEXT } from '../../../domain/dailyLife.js';
import { useStore } from '../../../store/index.js';
import { economyDeskRead } from '../economyDeskRead.js';
import { DeskLines } from './EconomicsGlance.jsx'; // the shared position renderer (see its docblock)
import { edged } from '../../../design/edgedBox.js';
import { foodBandOf } from '../../../domain/summary/tonightSheet.js'; // the food label's one home (ROUND THREE item 2b)

const INK = swatch['#1C1409'], MUTED = swatch['#9C8068'],
      BORDER = swatch['#E0D0B0'], PARCH = swatch['#FDF8F0'], _CARD = swatch['#FFFBF5'];

// ── Data extraction ── (moved to dailyLifeLogic.js)

/** The standing-of-living position, spelled once: two draws share it (the registry's one-site rule). */
const STANDING_MOUNT = 'daily_life.standingOfLiving';

function AnchorFact({ label, value, accent }) {
  const mobile = useIsMobile();
  return (
    <div style={{
      flex: '1 1 100px', minWidth: 0,
      background: accent ? `${accent}0d` : '#faf8f4',
      ...edged(`1px solid ${accent ? `${accent}30` : BORDER}`, `3px solid ${accent || '#c8b89a'}`),
      padding: '5px 9px',
    }}>
      <div style={{ fontSize: chromeFontSize(FS['8.5'], mobile), fontWeight: 700, color: accent || MUTED, marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: chromeFontSize(FS['11.5'], mobile), fontWeight: 700, color: INK, lineHeight: 1.2 }}>{value || EMPTY_VALUE}</div>
    </div>
  );
}

const STRESS_LABELS = {
  under_siege:'Under Siege', famine:'Famine', occupied:'Occupied',
  politically_fractured:'Fractured', indebted:'Indebted',
  recently_betrayed:'Betrayed', infiltrated:'Infiltrated',
  plague_onset:'Disease', succession_void:'Succession Void',
  monster_pressure:'Monster Threat', insurgency:'Insurgency',
  religious_conversion:'Religious Crisis', slave_revolt:'Slave Revolt',
  wartime:'Wartime', mass_migration:'Mass Migration',
};

// ── Main component ────────────────────────────────────────────────────────────

/**
 * DAILY-PAGE-1 (the owner's order of 2026-11-22: "remove the button prompt for Daily life and simply generate it
 * automatically"): the engine's own Daily Life lines, in the order the page prints them. The other five slots join when
 * built.
 */
const ENGINE_SLOTS = ['dawn_work', 'gathering_places', 'child_warnings'];

export function DailyLifeTab({ settlement: r, _aiSettlement, publicDossier = false, playerView = false }) {
  const mobile = useIsMobile();
  const aiDailyLife = useStore(s => s.aiDailyLife);
  // The engine's three slots, derived from the settlement THIS PAGE IS HANDED (a shared read is handed the shared
  // document), once per render pass. A slot whose text is empty or "—" prints nothing.
  const engineLines = useMemo(() => {
    /** @type {string[]} */ const out = [];
    if (!r) return out;
    for (const key of ENGINE_SLOTS) {
      const slot = deriveDailyLifeSlot(key, r);
      const sentence = typeof slot?.text === 'string' ? slot.text.trim() : '';
      if (sentence && sentence !== DAILY_LIFE_EMPTY_SLOT_TEXT) out.push(sentence);
    }
    return out;
  }, [r]);

  if (!r) return null;

  // R2-CODE-B item 4 (the cold list REVIEW-W2A-3 #848: the tile read "Surplus" beside a record that
  // reads secure): whether the place has food to spare is the food record's band
  // (`foodSecurity.foodRecord.band`, data/bandLadders.js :: foodSecurityBandKeyOf), the home the
  // Overview's Food Security reads; the context's own percent stands only for a record with no band.
  const ctx = withRecordSurplus(extractSettlementContext(r), r);
  // THE ECONOMY DESK, through its one caller. DS-ECO-8 — the prosperity rung read ON ITS
  // OWN — speaks HERE, and this is the only page-set position where it does.
  const deskProse = economyDeskRead(r, { publicDossier, playerView, publicSite: 'economy:daily_life', tier: r?.tier });

  // A daily-life account already saved on the settlement still prints, read-only (nothing a user paid for disappears).
  const savedAccount = aiDailyLife ? formatDailyLifeResult(aiDailyLife) : null;

  // ROUND THREE item 2b (the cut's #843 #1102 #1297: "Strained" under an active famine, "Tightening" beside "Secure"):
  // the tile prints the food label's ONE home (tonightSheet.js :: foodBandOf), the word the Tonight sheet and the Crisis
  // page print; its own percent ladder stands only for a record with no band.
  const foodBand      = foodBandOf(r?.economicState?.foodSecurity?.foodRecord);
  const foodLabel     = foodBand ? foodBand.label :
    ctx.foodDeficit > 35 ? 'Severe' :
    ctx.foodDeficit > 20 ? 'Serious' :
    ctx.foodDeficit > 10 ? 'Strained' :
    ctx.foodDeficit > 0  ? 'Tightening' :
    ctx.hasSurplus ? 'Surplus' : 'Adequate';
  const foodColor     = foodBand ? foodBand.color :
    ctx.foodDeficit > 35 ? '#5a0a0a' :
    ctx.foodDeficit > 20 ? '#8b1a1a' :
    ctx.foodDeficit > 10 ? '#8a4010' :
    ctx.foodDeficit > 0  ? '#a0762a' : '#1a5a28';

  return (
    <div style={{ fontFamily: sans, padding: mobile ? '12px 10px' : '16px 18px', maxWidth: 720, margin: '0 auto' }}>

      {/* ── ANCHOR FACTS ─────────────────────────────────────────────────────
          THE FOUR FACTS THAT FRAME DAILY LIFE AND LIVE ON NO OTHER PAGE (chair ruling D1,
          2026-10-30). Tier, prosperity, safety and defense are the Overview's glance (X-1);
          who governs, terrain and magic are Power's and the Overview's; the active stress is
          the Overview crisis card's, and is said here once, as its own anchor (X-3). */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
        <AnchorFact label="Food"        value={foodLabel}                          accent={foodColor} />
        {ctx.tradeRoute && (
          <AnchorFact label="Access" value={ctx.tradeRoute.replace(/_/g,' ').split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')} accent='#5a3a1a' />
        )}
        {ctx.culture && ctx.culture !== 'random' && (
          <AnchorFact label="Culture" value={ctx.culture.replace(/_/g,' ').split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')} accent='#3a3a6a' />
        )}
        {ctx.stressTypes.length > 0 && (
          <AnchorFact
            label="Active stress"
            value={ctx.stressTypes.map(t => STRESS_LABELS[t] || t).join(', ')}
            accent='#8b1a1a'
          />
        )}
      </div>

      {/* ── THE STANDING OF LIVING (DS-ECO-8 at daily_life.standingOfLiving) ──
          THE LADDER BLOCK'S ONE SPEAKING POSITION. The prosperity band word is the Overview's
          glance (the "Economy" anchor that repeated it here is cut, D1), and this is the
          town's own account of what living at that band is like. It does NOT speak on economics (DS-ECO-1 has the header
          there, R-DST-A) and it does NOT speak on overview (DS-GEN-3's five `prosperity:`
          pools already speak about the rung at overview.systemsHealth — measured, not
          assumed). Additive: every anchor fact and the AI narrative below are untouched. */}
      <DeskLines mount={STANDING_MOUNT} settlementName={r?.name} tier={r?.tier} rungs={[deskProse.prosperityRung]} />
      {/* W1 ECO construction (2026-11-07, C12): food's grip on prosperity, the coupled food field
          the ladder block may join in its own pool, drawn at the same position under the rung. */}
      <DeskLines mount={STANDING_MOUNT} settlementName={r?.name} tier={r?.tier} rungs={[deskProse.foodOnProsperity]} />

      {/* ── THE ENGINE'S OWN LINES (DAILY-PAGE-1, the owner's order of 2026-11-22) ──────────
          Where the button stood: how the day starts, where people gather, what children are warned
          about. No heading and no label (each sentence names its own subject); where all three are
          empty the box is absent. */}
      {engineLines.length > 0 && (
        <div data-testid="daily-life-engine" style={{
          background: PARCH,
          border: `1px solid ${BORDER}`,
          padding: mobile ? '16px 14px' : '20px 22px',
          marginBottom: 16,
        }}>
          {engineLines.map((line, i, arr) => (
            <p key={i} style={{
              fontSize: proseFontSize(FS['13.5'], mobile), // the narrative's type, held to the phone prose floor
              lineHeight: 1.75,
              color: INK,
              margin: 0,
              marginBottom: i < arr.length - 1 ? 16 : 0,
              fontFamily: `Georgia, 'Times New Roman', serif`,
            }}>
              {line}
            </p>
          ))}
        </div>
      )}

      {/* ── THE SAVED ACCOUNT (read-only) ─────────────────────────────────── */}
      {savedAccount && (
        <div style={{
          background: PARCH,
          border: `1px solid ${BORDER}`,
          padding: mobile ? '16px 14px' : '20px 22px',
        }}>
          {savedAccount.split(/\n\n+/).map((para, i, arr) => (
            <p key={i} style={{
              fontSize: FS['13.5'],
              lineHeight: 1.75,
              color: INK,
              margin: 0,
              marginBottom: i < arr.length - 1 ? 16 : 0,
              fontFamily: `Georgia, 'Times New Roman', serif`,
            }}>
              {para.trim()}
            </p>
          ))}
        </div>
      )}

    </div>
  );
}

// Format the structured daily life result from the edge function into prose
function formatDailyLifeResult(result) {
  if (typeof result === 'string') return result;
  if (!result) return null;
  const parts = [result.dawn, result.morning, result.midday, result.evening, result.night].filter(Boolean);
  return parts.join('\n\n');
}

/**
 * The context with `hasSurplus`: the food record's band where the record has one, else the context's
 * own percent over its old cut (a record written before the band).
 * @param {ReturnType<typeof extractSettlementContext>} ctx @param {any} r @returns {ReturnType<typeof extractSettlementContext> & { hasSurplus: boolean }}
 */
function withRecordSurplus(ctx, r) {
  const band = r?.economicState?.foodSecurity?.foodRecord?.band;
  return { ...ctx, hasSurplus: typeof band === 'string' && band ? band === 'surplus' : ctx.foodSurplus > 10 };
}

export default React.memo(DailyLifeTab);
