import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { FS, swatch, CARD, BODY } from '../../theme.js';

import { sans, TabIntro } from '../Primitives';
import {isMobile} from '../tabConstants';
import {extractSettlementContext} from '../dailyLifeLogic';
import { useStore } from '../../../store/index.js';
import { isConfigured } from '../../../lib/supabase.js';
import Button from '../../primitives/Button.jsx';

const INK = swatch['#1C1409'], MUTED = swatch['#9C8068'], SECOND = swatch['#6B5340'],
      BORDER = swatch['#E0D0B0'], GOLD = swatch['#A0762A'], PARCH = swatch['#FDF8F0'], _CARD = swatch['#FFFBF5'];

// ── Data extraction ── (moved to dailyLifeLogic.js)

// Lead anchor — full card chrome, 700-weight value. Reserved for the two or
// three facts that should win the squint test (Settlement / Economy / Safety).
function AnchorFact({ label, value, accent }) {
  return (
    <div style={{
      flex: '1 1 100px', minWidth: 0,
      background: accent ? `${accent}0d` : '#faf8f4',
      border: `1px solid ${accent ? `${accent}30` : BORDER}`,
      borderLeft: `3px solid ${accent || '#c8b89a'}`,
      borderRadius: 5, padding: '5px 9px',
    }}>
      <div style={{ fontSize: FS['8.5'], fontWeight: 700, color: accent || MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: FS['11.5'], fontWeight: 700, color: INK, lineHeight: 1.2 }}>{value || ', '}</div>
    </div>
  );
}

// Secondary fact — no card chrome, normal weight, label and value inline so the
// optional details recede behind the lead anchors. One channel quieter on size,
// weight, and background all at once.
function MetaFact({ label, value, accent }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, fontSize: FS['11.5'], lineHeight: 1.4 }}>
      <span style={{ fontSize: FS['8.5'], fontWeight: 700, color: accent || MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontWeight: 400, color: BODY }}>{value || ', '}</span>
    </span>
  );
}

// Active-stress chip — the one secondary signal that must stay loud. Emphasis
// in two channels: the danger color plus the explicit uppercase label and the
// danger border.
function StressFact({ value }) {
  const danger = swatch['#8B1A1A'];
  return (
    <div style={{
      flex: '1 1 100px', minWidth: 0,
      background: `${danger}0d`,
      border: `1px solid ${danger}30`,
      borderLeft: `3px solid ${danger}`,
      borderRadius: 5, padding: '5px 9px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 1 }}>
        <span style={{ fontSize: FS['8.5'], fontWeight: 700, color: danger, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Active stress</span>
      </div>
      <div style={{ fontSize: FS['11.5'], fontWeight: 700, color: INK, lineHeight: 1.2 }}>{value}</div>
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

export function DailyLifeTab({ settlement: r, _aiSettlement, saveId: _saveId = null }) {
  const [narrative, setNarrative]   = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError]     = useState(null);
  const [loadMsg, setLoadMsg]       = useState('');
  const mobile = isMobile();

  const aiDailyLife = useStore(s => s.aiDailyLife);
  const storeAiLoading = useStore(s => s.aiLoading);
  const storeAiRegenerating = useStore(s => s.aiRegenerating);
  const storeAiError = useStore(s => s.aiError);
  const storeAiProgress = useStore(s => s.aiProgress);

  if (!r) return null;

  const ctx = extractSettlementContext(r);

  // Daily life is generated as part of the narrative run (one action, the
  // narrative price). This tab DISPLAYS that prose; it no longer has its own
  // paid generate control. Local dev (no Supabase) keeps an offline preview so
  // the tab isn't blank without a configured backend.
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

  // Local-dev only: deterministic offline prose preview (no credits, no
  // backend). In production daily life arrives with the narrative run.
  async function generateLocalPreview() {
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

  const tierLabel     = ctx.tierLabel;
  const prospColor    = ctx.prospBand === 'prosperous' ? swatch['#1A5A28'] : ctx.prospBand === 'comfortable' ? swatch['#A0762A'] : ctx.prospBand === 'subsistence' ? '#8a4010' : swatch['#8B1A1A'];
  const safetyBand    = ctx.safetyLabelFromProfile || (ctx.safetyScore >= 70 ? 'Safe' : ctx.safetyScore >= 50 ? 'Moderate' : ctx.safetyScore >= 30 ? 'Dangerous' : 'Hostile');
  const safetyColor   = ctx.safetyScore >= 70 ? swatch['#1A5A28'] : ctx.safetyScore >= 50 ? swatch['#A0762A'] : ctx.safetyScore >= 30 ? '#8a4010' : swatch['#8B1A1A'];
  const foodLabel     =
    ctx.foodDeficit > 35 ? 'Severe' :
    ctx.foodDeficit > 20 ? 'Serious' :
    ctx.foodDeficit > 10 ? 'Strained' :
    ctx.foodDeficit > 0  ? 'Tightening' :
    ctx.foodSurplus > 10 ? 'Surplus' : 'Adequate';
  const foodColor     =
    ctx.foodDeficit > 35 ? '#5a0a0a' :
    ctx.foodDeficit > 20 ? swatch['#8B1A1A'] :
    ctx.foodDeficit > 10 ? '#8a4010' :
    ctx.foodDeficit > 0  ? swatch['#A0762A'] : swatch['#1A5A28'];

  // Local-dev preview button label. Production has no generate control here —
  // daily life rides in with the narrative run.
  const localButtonLabel = loading
    ? (loadMsg || (hasContent ? 'Refreshing preview…' : 'Drawing daily life…'))
    : (hasContent ? 'Refresh local preview' : 'Preview daily life (local)');

  return (
    <div style={{ fontFamily: sans, padding: mobile ? '12px 10px' : '16px 18px', maxWidth: 720, margin: '0 auto' }}>
      <TabIntro tabKey="dailyLife" />

      {/* ── ANCHOR FACTS ─────────────────────────────────────────────────── */}
      {/* Lead anchors win the squint test: the three facts that frame the town's
          state. Active stress, when present, is the fourth loud signal (danger
          color + warning icon). Optional detail recedes into the meta strip. */}
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
        <AnchorFact label="Settlement"  value={tierLabel}                        accent={GOLD} />
        <AnchorFact label="Economy"  value={ctx.prospBand.charAt(0).toUpperCase() + ctx.prospBand.slice(1)} accent={prospColor} />
        <AnchorFact label="Safety"      value={safetyBand}                        accent={safetyColor} />
        {ctx.stressTypes.length > 0 && (
          <StressFact value={ctx.stressTypes.map(t => STRESS_LABELS[t] || t).join(', ')} />
        )}
      </div>

      {/* Secondary detail — lighter inline strip, normal weight, no card chrome. */}
      <div style={{ display: 'flex', gap: '6px 16px', flexWrap: 'wrap', marginBottom: 14, paddingLeft: 2 }}>
        <MetaFact label="Food" value={foodLabel} accent={foodColor} />
        {ctx.govFaction && <MetaFact label="Governed by" value={ctx.govFaction} accent={swatch['#2A3A7A']} />}
        {ctx.terrain && ctx.terrain !== 'auto' && (
          <MetaFact label="Terrain" value={ctx.terrain.charAt(0).toUpperCase() + ctx.terrain.slice(1)} accent={swatch['#3A5A2A']} />
        )}
        {ctx.culture && ctx.culture !== 'random' && (
          <MetaFact label="Culture" value={ctx.culture.replace(/_/g,' ').split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')} accent={swatch['#3A3A6A']} />
        )}
        {ctx.tradeRoute && (
          <MetaFact label="Access" value={ctx.tradeRoute.replace(/_/g,' ').split(' ').map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' ')} accent={swatch['#5A3A1A']} />
        )}
        {ctx.defenseReadinessLabel && (
          <MetaFact label="Defense" value={ctx.defenseReadinessLabel} accent={swatch['#1A3A6A']} />
        )}
        <MetaFact label="Magic" value={ctx.magicLabel} accent={ctx.magicBand==='none'?swatch['#6B5340']:ctx.magicBand==='high'?swatch['#5A2A8A']:ctx.magicBand==='moderate'?'#6a2a6a':'#4a3a6a'} />
      </div>

      {/* ── DAILY LIFE SOURCE ─────────────────────────────────────────────── */}
      {/* Daily life is no longer generated here on its own. The narrative run
          does the full prose polish AND draws out daily life, under a single
          spend. This tab only displays the result. In local dev (no backend)
          we offer an offline preview so the tab isn't blank. */}
      {isConfigured ? (
        !hasContent && (
          <div
            style={{
              padding: '10px 14px', marginBottom: 16,
              background: 'linear-gradient(135deg, rgba(122,70,26,0.06), rgba(160,118,42,0.04))',
              border: `1px solid ${BORDER}`,
              borderLeft: '3px solid #a0762a',
              borderRadius: 6,
              fontSize: FS.sm, color: SECOND, lineHeight: 1.5,
              fontFamily: sans,
            }}
          >
            <strong style={{ color: swatch['#7A5A1A'] }}>Run the narrative layer</strong>
            {' '}to draw daily life into prose. The narrative run does the full prose polish and writes daily life with it, dawn to night, grounded in this town's own stressors, trade, and cast. The anchor facts above stay either way.
          </div>
        )
      ) : (
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={generateLocalPreview}
          busy={loading}
          title="Local preview only. In the live app, daily life is written as part of the narrative run."
          style={{ marginBottom: 16 }}
        >
          {localButtonLabel}
        </Button>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* ── ERROR ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: swatch.dangerBg, border: '1px solid #e8c0c0',
          borderRadius: 7, padding: '12px 14px', marginBottom: 14,
          fontSize: FS['11.5'], color: swatch.danger,
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
              zIndex: 20, background: 'rgba(122,70,26,0.95)', color: CARD,
              padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(196,128,60,0.6)',
              fontSize: FS['11.5'], fontWeight: 700, fontFamily: sans,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>
              <Loader2 size={14} aria-hidden="true" style={{ display: 'inline-block', animation: 'spin 1.2s linear infinite' }} />
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

      {/* ── EMPTY STATE ───────────────────────────────────────────────────── */}
      {!hasContent && !loading && !error && (
        <div style={{
          background: swatch['#FAF8F4'], border: `1px solid ${BORDER}`,
          borderRadius: 8, padding: '32px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: FS.md, fontWeight: 600, color: SECOND, marginBottom: 6 }}>
            What is daily life like here?
          </div>
          <div style={{ fontSize: FS['11.5'], color: BODY, lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
            Ordinary life in this settlement, dawn to night: the market, the tavern, the watch.
            Five paragraphs grounded in the town's own stressors and trade, written as part of the narrative run.
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

  const institutions = Object.values(ctx.keyInsts || {}).flat().slice(0, 5);
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
