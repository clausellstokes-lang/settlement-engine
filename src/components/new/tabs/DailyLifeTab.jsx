import React, { useState } from 'react';

import {sans, Empty} from '../Primitives';
import {isMobile} from '../tabConstants';
import {extractSettlementContext, buildPrompt} from '../dailyLifeLogic';
import { useStore } from '../../../store/index.js';
import { CREDIT_COSTS } from '../../../store/creditsSlice.js';
import { isConfigured } from '../../../lib/supabase.js';

const INK = '#1c1409', MUTED = '#9c8068', SECOND = '#6b5340',
      BORDER = '#e0d0b0', GOLD = '#a0762a', PARCH = '#fdf8f0', CARD = '#fffbf5';

// ── Data extraction ── (moved to dailyLifeLogic.js)

function AnchorFact({ label, value, accent }) {
  return (
    <div style={{
      flex: '1 1 100px', minWidth: 0,
      background: accent ? `${accent}0d` : '#faf8f4',
      border: `1px solid ${accent ? `${accent}30` : BORDER}`,
      borderLeft: `3px solid ${accent || '#c8b89a'}`,
      borderRadius: 5, padding: '5px 9px',
    }}>
      <div style={{ fontSize: 8.5, fontWeight: 700, color: accent || MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: INK, lineHeight: 1.2 }}>{value || '—'}</div>
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

export function DailyLifeTab({ settlement: r, aiSettlement, saveId = null }) {
  const [narrative, setNarrative]   = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError]     = useState(null);
  const [loadMsg, setLoadMsg]       = useState('');
  const mobile = isMobile();

  const requestDailyLife = useStore(s => s.requestDailyLife);
  const aiDailyLife = useStore(s => s.aiDailyLife);
  const storeAiLoading = useStore(s => s.aiLoading);
  const storeAiRegenerating = useStore(s => s.aiRegenerating);
  const storeAiError = useStore(s => s.aiError);
  const storeAiProgress = useStore(s => s.aiProgress);
  const creditBalance = useStore(s => s.creditBalance);

  if (!r) return null;

  // AI-1: Daily-life generation is gated on a saved settlement (same rule
  // as the narrative layer). Local-dev mock remains ungated.
  const dailyLifeEnabled = isConfigured ? !!saveId : true;

  const ctx = extractSettlementContext(r);
  const prompt = buildPrompt(ctx);

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
      await requestDailyLife(saveId);
      return;
    }

    // Local mode: direct API call (no credits)
    setLocalLoading(true);
    setLocalError(null);
    setNarrative(null);
    setLoadMsg(LOAD_MSGS[Math.floor(Math.random() * LOAD_MSGS.length)]);

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a worldbuilding consultant for tabletop RPG game masters. You write evocative, specific, grounded descriptions of fictional medieval settlements. You never use game mechanics language or mention statistics.',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const text = data.content?.filter(b => b.type === 'text').map(b => b.text).join('').trim();
      if (!text) throw new Error('Empty response');
      setNarrative(text);
    } catch (e) {
      setLocalError(e.message);
    } finally {
      setLocalLoading(false);
    }
  }

  // Merge store daily life with local narrative
  const displayNarrative = narrative || (aiDailyLife ? formatDailyLifeResult(aiDailyLife) : null);
  const hasContent = !!displayNarrative;

  const tierLabel     = ctx.tierLabel;
  const prospColor    = ctx.prospBand === 'prosperous' ? '#1a5a28' : ctx.prospBand === 'comfortable' ? '#a0762a' : ctx.prospBand === 'subsistence' ? '#8a4010' : '#8b1a1a';
  const safetyBand    = ctx.safetyLabelFromProfile || (ctx.safetyScore >= 70 ? 'Safe' : ctx.safetyScore >= 50 ? 'Moderate' : ctx.safetyScore >= 30 ? 'Dangerous' : 'Hostile');
  const safetyColor   = ctx.safetyScore >= 70 ? '#1a5a28' : ctx.safetyScore >= 50 ? '#a0762a' : ctx.safetyScore >= 30 ? '#8a4010' : '#8b1a1a';
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
    if (!dailyLifeEnabled) return '✦ Save settlement to enable AI Daily Life';
    if (loading) {
      return (isConfigured ? storeAiProgress : loadMsg) || (hasContent ? 'Regenerating…' : 'Generating…');
    }
    if (hasContent) {
      return isConfigured
        ? `↺ Regenerate Daily Life (${CREDIT_COSTS.dailyLife} credits)`
        : '↺ Regenerate Daily Life — Powered by AI';
    }
    return isConfigured
      ? `✦ Generate Daily Life (${CREDIT_COSTS.dailyLife} credits)`
      : '✦ Generate Daily Life — Powered by AI';
  })();

  return (
    <div style={{ fontFamily: sans, padding: mobile ? '12px 10px' : '16px 18px', maxWidth: 720, margin: '0 auto' }}>

      {/* ── ANCHOR FACTS ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 14 }}>
        <AnchorFact label="Settlement"  value={tierLabel}                        accent={GOLD} />
        <AnchorFact label="Economy"  value={ctx.prospBand.charAt(0).toUpperCase() + ctx.prospBand.slice(1)} accent={prospColor} />
        <AnchorFact label="Safety"      value={safetyBand}                        accent={safetyColor} />
        <AnchorFact label="Food"        value={foodLabel}                          accent={foodColor} />
        {ctx.govFaction && <AnchorFact label="Governed by" value={ctx.govFaction} accent='#2a3a7a' />}
        {ctx.terrain && ctx.terrain !== 'auto' && (
          <AnchorFact label="Terrain" value={ctx.terrain.charAt(0).toUpperCase() + ctx.terrain.slice(1)} accent='#3a5a2a' />
        )}
        {ctx.culture && ctx.culture !== 'random' && (
          <AnchorFact label="Culture" value={ctx.culture.replace(/_/g,' ').split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')} accent='#3a3a6a' />
        )}
        {ctx.tradeRoute && (
          <AnchorFact label="Access" value={ctx.tradeRoute.replace(/_/g,' ').split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')} accent='#5a3a1a' />
        )}
        {ctx.defenseReadinessLabel && (
          <AnchorFact label="Defense" value={ctx.defenseReadinessLabel} accent='#1a3a6a' />
        )}
        <AnchorFact label="Magic" value={ctx.magicLabel} accent={ctx.magicBand==='none'?'#6b5340':ctx.magicBand==='high'?'#5a2a8a':ctx.magicBand==='moderate'?'#6a2a6a':'#4a3a6a'} />
        {ctx.stressTypes.length > 0 && (
          <AnchorFact
            label="Active stress"
            value={ctx.stressTypes.map(t => STRESS_LABELS[t] || t).join(', ')}
            accent='#8b1a1a'
          />
        )}
      </div>

      {/* ── GENERATE / REGENERATE BUTTON ──────────────────────────────────── */}
      <button
        onClick={generate}
        disabled={loading || !dailyLifeEnabled}
        title={!dailyLifeEnabled
          ? 'AI daily-life generation requires a saved settlement so the output can be preserved across sessions.'
          : (hasContent
              ? `Regenerate replaces the current daily-life prose by calling the AI again. Spends ${CREDIT_COSTS.dailyLife} credits.`
              : `Generate daily-life prose for this settlement. Spends ${CREDIT_COSTS.dailyLife} credits.`)}
        style={{
          width: '100%', padding: '13px 20px',
          background: !dailyLifeEnabled
            ? 'rgba(120,100,80,0.12)'
            : (loading ? '#e8dcc8' : 'linear-gradient(135deg, #a0762a, #7a5a1a)'),
          color: !dailyLifeEnabled ? MUTED : (loading ? MUTED : '#fffbf5'),
          border: !dailyLifeEnabled ? '1px dashed rgba(156,128,104,0.45)' : 'none',
          borderRadius: 8,
          cursor: (loading || !dailyLifeEnabled) ? 'default' : 'pointer',
          fontSize: 13, fontWeight: 700, fontFamily: sans,
          letterSpacing: '0.03em', marginBottom: 16,
          transition: 'opacity 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {loading && (
          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
        )}
        {buttonLabel}
      </button>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* ── ERROR ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: '#fdf4f4', border: '1px solid #e8c0c0',
          borderRadius: 7, padding: '12px 14px', marginBottom: 14,
          fontSize: 11.5, color: '#8b1a1a',
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
              zIndex: 20, background: 'rgba(122,70,26,0.95)', color: '#fffbf5',
              padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(196,128,60,0.6)',
              fontSize: 11.5, fontWeight: 700, fontFamily: sans,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>
              <span style={{ display: 'inline-block', animation: 'spin 1.2s linear infinite' }}>⟳</span>
              {storeAiProgress || 'Regenerating…'}
            </div>
          )}
          <div style={{
            background: PARCH,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            padding: mobile ? '16px 14px' : '20px 22px',
            opacity: regenerating ? 0.55 : 1,
            transition: 'opacity 0.2s',
          }}>
            {displayNarrative.split(/\n\n+/).map((para, i, arr) => (
              <p key={i} style={{
                fontSize: 13.5,
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

      {/* ── EMPTY STATE ───────────────────────────────────────────────────── */}
      {!hasContent && !loading && !error && (
        <div style={{
          background: '#faf8f4', border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: '32px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: SECOND, marginBottom: 6 }}>
            What is daily life like here?
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
            Generate a prose description of ordinary life in this settlement — dawn, the market, the tavern,
            the watch. Opus-grade writing, five paragraphs, grounded in this settlement's specific stressors and trade.
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

export default React.memo(DailyLifeTab);
