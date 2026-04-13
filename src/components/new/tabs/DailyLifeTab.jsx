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

export function DailyLifeTab({ settlement: r, aiSettlement }) {
  const [narrative, setNarrative]   = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError]     = useState(null);
  const [loadMsg, setLoadMsg]       = useState('');
  const mobile = isMobile();

  const requestDailyLife = useStore(s => s.requestDailyLife);
  const aiDailyLife = useStore(s => s.aiDailyLife);
  const storeAiLoading = useStore(s => s.aiLoading);
  const storeAiError = useStore(s => s.aiError);
  const creditBalance = useStore(s => s.creditBalance);

  if (!r) return null;

  const ctx = extractSettlementContext(r);
  const prompt = buildPrompt(ctx);

  const loading = isConfigured ? storeAiLoading : localLoading;
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
      await requestDailyLife();
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

  const tierLabel     = ctx.tierLabel;
  // magicCtx inlined into JSX to avoid any TDZ risk
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

      {/* ── GENERATE BUTTON ───────────────────────────────────────────────── */}
      <button
        onClick={generate}
        disabled={loading}
        style={{
          width: '100%', padding: '13px 20px',
          background: loading ? '#e8dcc8' : 'linear-gradient(135deg, #a0762a, #7a5a1a)',
          color: loading ? MUTED : '#fffbf5',
          border: 'none', borderRadius: 8, cursor: loading ? 'default' : 'pointer',
          fontSize: 13, fontWeight: 700, fontFamily: sans,
          letterSpacing: '0.03em', marginBottom: 16,
          transition: 'opacity 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
      >
        {loading ? (
          <>
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
            {loadMsg || 'Generating…'}
          </>
        ) : displayNarrative ? (
          isConfigured ? `↺ Regenerate Daily Life (${CREDIT_COSTS.dailyLife} credits)` : '↺ Regenerate Daily Life — Powered by AI'
        ) : (
          isConfigured ? `✦ Generate Daily Life (${CREDIT_COSTS.dailyLife} credits)` : '✦ Generate Daily Life — Powered by AI'
        )}
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

            {/* ── NARRATIVE LAYER DAILY LIFE ─────────────────────────────────── */}
      {aiSettlement?.dailyLife && !narrative && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: '#8a50b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>✦</span> From AI Narrative Layer — <span style={{ fontWeight: 400, textTransform: 'none', fontSize: 9.5, letterSpacing: 0 }}>generate below for a standalone version</span>
          </div>
          <div style={{ background: PARCH, border: `1px solid rgba(138,80,176,0.2)`, borderLeft: '3px solid #8a50b0', borderRadius: 8, padding: '16px 18px' }}>
            {(aiSettlement.dailyLife.split('\n\n').filter(Boolean)).map((para, i, arr) => (
              <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: INK, margin: 0, marginBottom: i < arr.length - 1 ? 16 : 0, fontFamily: `Georgia, 'Times New Roman', serif` }}>
                {para.trim()}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── NARRATIVE ─────────────────────────────────────────────────────── */}
      {displayNarrative && (
        <div style={{
          background: PARCH,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
          padding: mobile ? '16px 14px' : '20px 22px',
        }}>
          {displayNarrative.split(/\n\n+/).map((para, i) => (
            <p key={i} style={{
              fontSize: 13.5,
              lineHeight: 1.75,
              color: INK,
              margin: 0,
              marginBottom: i < displayNarrative.split(/\n\n+/).length - 1 ? 16 : 0,
              fontFamily: `Georgia, 'Times New Roman', serif`,
            }}>
              {para.trim()}
            </p>
          ))}
        </div>
      )}

      {/* ── EMPTY STATE ───────────────────────────────────────────────────── */}
      {!displayNarrative && !loading && !error && !aiSettlement?.dailyLife && (
        <div style={{
          background: '#faf8f4', border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: '32px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>️</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: SECOND, marginBottom: 6 }}>
            What is daily life like here?
          </div>
          <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
            Generate a prose description of ordinary life in this settlement — food, safety, governance, and how it all fits together from the perspective of the people who live here.
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

export default DailyLifeTab;
