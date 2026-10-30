import React, { useState } from 'react';
import { FS, swatch, CARD, EMPTY_VALUE } from '../../theme.js';

import { sans } from '../Primitives';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import {extractSettlementContext} from '../dailyLifeLogic';
import { useStore } from '../../../store/index.js';
import { isConfigured } from '../../../lib/supabase.js';
import Button from '../../primitives/Button.jsx';
import { useLiveAiCostResolver } from '../../../hooks/useLivePricing.js';
import { economyDeskRead } from '../economyDeskRead.js';
import { institutionDisplayName } from '../../../domain/display/institutionDisplayName.js';
import { DeskLines } from './EconomicsGlance.jsx'; // the shared position renderer (see its docblock)
import { edged } from '../../../design/edgedBox.js';

const INK = swatch['#1C1409'], MUTED = swatch['#9C8068'], SECOND = swatch['#6B5340'],
      BORDER = swatch['#E0D0B0'], PARCH = swatch['#FDF8F0'], _CARD = swatch['#FFFBF5'];

// ── Data extraction ── (moved to dailyLifeLogic.js)

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

export function DailyLifeTab({ settlement: r, _aiSettlement, saveId = null, onRequestDailyLife = null, publicDossier = false, playerView = false }) {
  const [narrative, setNarrative]   = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError]     = useState(null);
  const [loadMsg, setLoadMsg]       = useState('');
  const mobile = useIsMobile();

  const requestDailyLife = useStore(s => s.requestDailyLife);
  const getCost = useLiveAiCostResolver();
  const aiDailyLife = useStore(s => s.aiDailyLife);
  const storeAiLoading = useStore(s => s.aiLoading);
  const storeAiRegenerating = useStore(s => s.aiRegenerating);
  const storeAiError = useStore(s => s.aiError);
  const storeAiProgress = useStore(s => s.aiProgress);
  const _creditBalance = useStore(s => s.creditBalance);

  if (!r) return null;

  // AI-1: Daily-life generation is gated on a saved settlement (same rule
  // as the narrative layer). Local-dev mock remains ungated.
  const dailyLifeEnabled = isConfigured ? !!saveId : true;

  const ctx = extractSettlementContext(r);
  // THE ECONOMY DESK, through its one caller. DS-ECO-8 — the prosperity rung read ON ITS
  // OWN — speaks HERE, and this is the only page-set position where it does.
  const deskProse = economyDeskRead(r, { publicDossier, playerView });

  const loading = isConfigured ? storeAiLoading : localLoading;
  const regenerating = isConfigured ? storeAiRegenerating : false;
  const error = isConfigured ? storeAiError : localError;

  const LOAD_MSGS = [
    'Walking the streets…',
    'Listening at the alehouse…',
    'Watching the market open…',
    'Asking the locals…',
    'Reading the mood…',
  ];

  async function generate() {
    if (isConfigured) {
      if (onRequestDailyLife) await onRequestDailyLife();
      else await requestDailyLife(saveId);
      return;
    }

    // Local mode: deterministic offline prose (no credits, no browser API key).
    setLocalLoading(true);
    setLocalError(null);
    setNarrative(null);
    // Math.random() picks a loading message. The whole function is a
    // button-click handler — never runs during render — so the purity
    // rule is over-broad here.
    // eslint-disable-next-line react-hooks/purity
    setLoadMsg(LOAD_MSGS[Math.floor(Math.random() * LOAD_MSGS.length)]);

    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      setNarrative(buildLocalDailyLifeNarrative(ctx));
    } catch (e) {
      setLocalError(e.message);
    } finally {
      setLocalLoading(false);
    }
  }

  // Merge store daily life with local narrative
  const displayNarrative = narrative || (aiDailyLife ? formatDailyLifeResult(aiDailyLife) : null);
  const hasContent = !!displayNarrative;

  const foodLabel     =
    ctx.foodDeficit > 35 ? 'Severe' :
    ctx.foodDeficit > 20 ? 'Serious' :
    ctx.foodDeficit > 10 ? 'Strained' :
    ctx.foodDeficit > 0  ? 'Tightening' :
    ctx.foodSurplus > 10 ? 'Surplus' : 'Adequate';
  const foodColor     =
    ctx.foodDeficit > 35 ? '#5a0a0a' :
    ctx.foodDeficit > 20 ? '#8b1a1a' :
    ctx.foodDeficit > 10 ? '#8a4010' :
    ctx.foodDeficit > 0  ? '#a0762a' : '#1a5a28';

  // Button label logic — first-time generate vs regenerate. Both spend credits;
  // we name the action plainly so users know.
  const buttonLabel = (() => {
    if (!dailyLifeEnabled) return 'Save settlement to enable Daily Life narrative';
    if (loading) {
      return (isConfigured ? storeAiProgress : loadMsg) || (hasContent ? 'Regenerating…' : 'Generating…');
    }
    if (hasContent) {
      return isConfigured
        ? `↺ Regenerate Daily Life (${getCost('dailyLife')} credits)`
        : '↺ Regenerate Daily Life: Narrative refinement';
    }
    return isConfigured
      ? `Generate Daily Life (${getCost('dailyLife')} credits)`
      : 'Generate Daily Life: Narrative refinement';
  })();

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
      <DeskLines mount="daily_life.standingOfLiving" settlementName={r?.name} tier={r?.tier} rungs={[deskProse.prosperityRung]} />

      {/* ── ONE LINE AND THE BUTTON (chair ruling D3 + D6, 2026-10-30) ──────────
          The unsaved hint and the empty state were one pitch told twice; they are one plain
          line now, shown until there is prose, with the button beneath it once the
          settlement is saved. */}
      {!hasContent && !loading && (
        <p data-testid="daily-life-offer" style={{ margin: '0 0 10px', fontSize: proseFontSize(FS.sm, mobile), color: SECOND, lineHeight: 1.5 }}>
          {dailyLifeEnabled
            ? 'Ordinary life here in prose: dawn, the market, the tavern, the watch.'
            : 'Save this settlement to write its ordinary life in prose: dawn, the market, the tavern, the watch.'}
        </p>
      )}
      {dailyLifeEnabled && (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={generate}
          busy={loading}
          title={hasContent
            ? `Regenerate replaces the current daily-life prose with a fresh narrative pass against the simulator output. Spends ${getCost('dailyLife')} credits.`
            : `Refine the simulator output into daily-life prose for this settlement. Spends ${getCost('dailyLife')} credits.`}
          style={{ marginBottom: 16 }}
        >
          {buttonLabel}
        </Button>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* ── ERROR ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: swatch['#FAF8F4'], border: '1px solid #e8c0c0',
          padding: '12px 14px', marginBottom: 14,
          fontSize: chromeFontSize(FS['11.5'], mobile), color: swatch.danger,
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ── NARRATIVE ─────────────────────────────────────────────────────── */}
      {hasContent && (
        <div style={{ position: 'relative' }}>
          {/* Regenerate overlay — floating chip so the user sees "a new version is brewing" */}
          {regenerating && (
            <div style={{
              position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
              zIndex: 20, background: INK, color: CARD,
              padding: '8px 16px', border: '1px solid #c4803c',
              fontSize: chromeFontSize(FS['11.5'], mobile), fontWeight: 700, fontFamily: sans,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ display: 'inline-block', animation: 'spin 1.2s linear infinite' }}>⟳</span>
              {storeAiProgress || 'Regenerating…'}
            </div>
          )}
          <div style={{
            background: PARCH,
            border: `1px solid ${BORDER}`,
            padding: mobile ? '16px 14px' : '20px 22px',
            opacity: regenerating ? 0.55 : 1,
            transition: 'opacity 0.2s',
          }}>
            {displayNarrative.split(/\n\n+/).map((para, i, arr) => (
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

function humanize(value) {
  if (!value) return '';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, ch => ch.toUpperCase());
}

function listText(items, fallback) {
  const clean = (items || []).filter(Boolean);
  if (!clean.length) return fallback;
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(', ')} and ${clean.at(-1)}`;
}

function buildLocalDailyLifeNarrative(ctx) {
  const terrain = humanize(ctx.terrain) || 'mixed terrain';
  const trade = humanize(ctx.tradeRoute) || 'road access';
  const culture = humanize(ctx.culture) || 'local custom';
  const food = ctx.foodDeficit > 20
    ? 'bread is dear and the poorest households plan every meal carefully'
    : ctx.foodDeficit > 0
      ? 'food is adequate for most families, though prices are watched closely'
      : ctx.foodSurplus > 10
        ? 'granaries and kitchen gardens give the town a little breathing room'
        : 'the food supply is ordinary, practical, and never taken for granted';

  const order = ctx.safetyScore >= 70
    ? 'people move after dusk with confidence'
    : ctx.safetyScore >= 45
      ? 'doors are barred early and strangers are studied before they are welcomed'
      : 'ordinary errands carry a careful awareness of who controls the street';

  // §934.13 — these names land inside a SENTENCE the reader reads, so they take the seam
  // like any other print. `keyInsts` holds raw catalogue keys (dailyLifeLogic pushes
  // `i.name`), and nothing downstream matches on them.
  const institutions = Object.values(ctx.keyInsts || {}).flat().map(institutionDisplayName).filter(Boolean).slice(0, 5);
  const anchors = listText(institutions, 'the market, shrine, workshop, and watch post');
  const stress = ctx.stressTypes.length
    ? `The talk of the day keeps returning to ${listText(ctx.stressTypes.map(humanize), 'the current strain')}.`
    : 'The place is not peaceful so much as practiced: people know its routines and work around its frictions.';

  return [
    `Morning starts around ${anchors}. ${terrain} and ${trade} shape the pace: carts, tools, and gossip move where the ground and roads allow, while ${culture} gives even routine bargains a recognizable local rhythm.`,
    `${food}. Work is divided by habit more than proclamation. Farmers, haulers, priests, guards, and tradespeople all know which shortages can be endured and which ones will turn into arguments before sundown.`,
    `Power is felt through ${ctx.govFaction || 'whoever can make orders stick this week'}. ${ctx.stability < 45 ? "Promises are weighed carefully because yesterday's bargain may not survive tomorrow." : 'Most residents know where authority lives and how to petition it without making themselves memorable.'} ${order}.`,
    `${stress} By evening, daily life narrows to lamplight, shared meals, debts remembered, and news carried from door to door. The settlement feels less like a map marker than a set of bargains people keep renewing because leaving would cost more than staying.`,
  ].join('\n\n');
}

export default React.memo(DailyLifeTab);
