import React, { useState } from 'react';
import { FS, swatch, CARD, EMPTY_VALUE } from '../../theme.js';

import { sans } from '../Primitives';
import {PROSPERITY_COLORS} from '../tabConstants';
import useIsMobile from '../../../hooks/useIsMobile.js';
import {extractSettlementContext} from '../dailyLifeLogic';
import { useStore } from '../../../store/index.js';
import { isConfigured } from '../../../lib/supabase.js';
import Button from '../../primitives/Button.jsx';
import { useLiveAiCostResolver } from '../../../hooks/useLivePricing.js';
import { economyDeskRead } from '../economyDeskRead.js';
import { DeskLines } from './EconomicsGlance.jsx'; // the shared position renderer (see its docblock)
import { flag } from '../../../lib/flags.js';
import { proseOf, unitsFor } from '../../../lib/scribeArtefact.js';
import {
  DAILY_LIFE_BEATS, DAILY_LIFE_BLOCK, DAILY_LIFE_LABELS, dailyLifeBeats, dailyLifeNarrative,
} from '../../../domain/prose/dailyLifeBeats.js';

const INK = swatch['#1C1409'], MUTED = swatch['#9C8068'], SECOND = swatch['#6B5340'],
      BORDER = swatch['#E0D0B0'], GOLD = swatch['#A0762A'], PARCH = swatch['#FDF8F0'], _CARD = swatch['#FFFBF5'];

// ── Data extraction ── (moved to dailyLifeLogic.js)

function AnchorFact({ label, value, accent }) {
  return (
    <div style={{
      flex: '1 1 100px', minWidth: 0,
      background: accent ? `${accent}0d` : '#faf8f4',
      border: `1px solid ${accent ? `${accent}30` : BORDER}`,
      borderLeft: `3px solid ${accent || '#c8b89a'}`,
      padding: '5px 9px',
    }}>
      <div style={{ fontSize: FS['8.5'], fontWeight: 700, color: accent || MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: FS['11.5'], fontWeight: 700, color: INK, lineHeight: 1.2 }}>{value || EMPTY_VALUE}</div>
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
    // Math.random() picks a loading message. The whole function is a button-click handler and
    // never runs during render. It used to carry a `react-hooks/purity` disable, which the rule
    // now reports as UNNECESSARY: the rule fired because this closure read the render-phase `ctx`,
    // and W4 car 3's one generator takes the settlement instead, so the closure is no longer
    // render-phase at all. The directive is removed rather than left for `--fix` to strip and
    // re-stage behind a commit.
    setLoadMsg(LOAD_MSGS[Math.floor(Math.random() * LOAD_MSGS.length)]);

    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      // ⭐ ONE GENERATOR (W4 car 3). The four-paragraph offline prose used to live at the foot
      // of this file; it is `domain/prose/dailyLifeBeats.js` now, so the text the tab renders
      // offline, the CLAIM the Scribe is handed and the FALLBACK a refused beat draws are the same
      // bytes. `dailyLifeNarrative` rejoins the last two beats exactly as they were joined before.
      setNarrative(dailyLifeNarrative(r));
    } catch (e) {
      setLocalError(e.message);
    } finally {
      setLocalLoading(false);
    }
  }

  // Merge store daily life with local narrative
  const displayNarrative = narrative || (aiDailyLife ? formatDailyLifeResult(aiDailyLife) : null);
  const hasContent = !!displayNarrative;

  // ⭐⭐ DAILY LIFE IS RENDERED BY DEFAULT (design §5c rule 4; the owner, 2026-09-14 ~06:5x: "it is
  // automatically default that the daily life tab be populated rather than on command"). The five
  // beats are the seventh tab call of the epoch render, they land on the same artefact as every
  // other block, and they are FROZEN until the next advance exactly as every other block is — so
  // the on-command Generate button has nothing left to ask for and the survey-level Redraw covers
  // the one case it served. The OLD path is not removed (W5 owns the retirements, ruling 20): it is
  // simply not reachable while the beats are on the page.
  //
  // ⛔ DARK, THIS FILE IS BYTE-IDENTICAL TO WHAT IT WAS. `scribeBeats` is null with the flag off,
  // null on a town that has never been scribed, and null on a render made for another seed or
  // another engine; every branch below then reads exactly as it read before.
  const scribeBeats = flag('scribe') ? scribeDailyLifeBeatsOf(r) : null;
  const scribeOn = Array.isArray(scribeBeats);

  const tierLabel     = ctx.tierLabel;
  // Prosperity color from the canonical PROSPERITY_COLORS map (the same source
  // the Overview and Economics tabs read) so every surface agrees. The engine's
  // real bands are Struggling/Poor/Moderate/Comfortable/Prosperous/Wealthy
  // (economicGenerator LABELS); ctx.prospBand is that label lowercased. The old
  // ad-hoc ternary only handled prosperous/comfortable and a never-emitted
  // 'subsistence', so the real top band 'wealthy' — and Moderate/Poor — fell
  // through to crisis red.
  const prospColor    = PROSPERITY_COLORS[ctx.prospBand.charAt(0).toUpperCase() + ctx.prospBand.slice(1)] || '#a0762a';
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

      {/* ── THE STANDING OF LIVING (DS-ECO-8 at daily_life.standingOfLiving) ──
          THE LADDER BLOCK'S ONE SPEAKING POSITION. The prosperity band word is already the
          "Economy" anchor fact three lines above, which is exactly the shape a LADDER block
          wants: the reader has the band, and this is the town's own account of what living
          at that band is like. It does NOT speak on economics (DS-ECO-1 has the header
          there, R-DST-A) and it does NOT speak on overview (DS-GEN-3's five `prosperity:`
          pools already speak about the rung at overview.systemsHealth — measured, not
          assumed). Additive: every anchor fact and the AI narrative below are untouched. */}
      <DeskLines mount="daily_life.standingOfLiving" rungs={[deskProse.prosperityRung]} />

      {/* ── GENERATE / REGENERATE BUTTON ──────────────────────────────────── */}
      {/* Unsaved settlements (Create page) get a slim inline hint instead of
          a disabled teaser button — tab-contextual, so it explains what saving
          unlocks for "Daily Life" specifically. */}
      {scribeOn ? null : !dailyLifeEnabled ? (
        <div
          style={{
            padding: '10px 14px', marginBottom: 16,
            background: PARCH,
            border: `1px solid ${BORDER}`,
            borderLeft: '3px solid #a0762a',
            fontSize: FS.sm, color: SECOND, lineHeight: 1.5,
            fontFamily: sans,
          }}
        >
          <strong style={{ color: swatch['#7A5A1A'] }}>Save this settlement</strong>
          {' '}to refine Daily Life into narrative. Five paragraphs of evocative prose grounded in this town's specific stressors, trade, and cast. Anchor facts above remain available either way.
        </div>
      ) : (
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

      {/* ── THE SURVEY'S FIVE BEATS (design §5c rule 4) ────────────────────
          One ordinary day as the archiver watched it, in the order the day happens in. Every
          paragraph is a unit the same two readers judged as they judge every other unit on every
          other tab; a beat they refused is the deterministic offline paragraph, seated silently
          (ruling 6: the reader is never told which line a model wrote). */}
      {scribeOn && (
        <div style={{
          background: PARCH,
          border: `1px solid ${BORDER}`,
          padding: mobile ? '16px 14px' : '20px 22px',
          marginBottom: 16,
        }}>
          {scribeBeats.map((text, i) => (
            <div key={DAILY_LIFE_BEATS[i]} style={{ marginBottom: i < scribeBeats.length - 1 ? 16 : 0 }}>
              <div style={{
                fontSize: FS['8.5'], fontWeight: 700, color: MUTED,
                textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3,
              }}>{DAILY_LIFE_LABELS[i]}</div>
              <p style={{
                fontSize: FS['13.5'], lineHeight: 1.75, color: INK, margin: 0,
                fontFamily: `Georgia, 'Times New Roman', serif`,
              }}>{text}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── ERROR ─────────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: swatch['#FAF8F4'], border: '1px solid #e8c0c0',
          padding: '12px 14px', marginBottom: 14,
          fontSize: FS['11.5'], color: swatch.danger,
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* ── NARRATIVE ─────────────────────────────────────────────────────── */}
      {!scribeOn && hasContent && (
        <div style={{ position: 'relative' }}>
          {/* Regenerate overlay — floating chip so the user sees "a new version is brewing" */}
          {regenerating && (
            <div style={{
              position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
              zIndex: 20, background: INK, color: CARD,
              padding: '8px 16px', border: '1px solid #c4803c',
              fontSize: FS['11.5'], fontWeight: 700, fontFamily: sans,
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

      {/* ── EMPTY STATE ───────────────────────────────────────────────────── */}
      {!scribeOn && !hasContent && !loading && !error && (
        <div style={{
          background: swatch['#FAF8F4'], border: `1px solid ${BORDER}`,
          padding: '32px 20px', textAlign: 'center',
        }}>
          <div style={{ fontSize: FS.md, fontWeight: 600, color: SECOND, marginBottom: 6 }}>
            What is daily life like here?
          </div>
          <div style={{ fontSize: FS['11.5'], color: MUTED, lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
            Generate a prose description of ordinary life in this settlement. Dawn, the market, the tavern,
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

/**
 * ⭐⭐ THE FIVE BEATS THE SCRIBE RENDERED, OR NULL (design §5c rule 4; W4 car 3).
 *
 * Null is the answer in every case the composer's own switch answers null in, and for the same
 * reasons: no artefact, a render made for a different seed, an engine the world has migrated past,
 * or no `DS-DAILY` block landed. Then the tab is EXACTLY what it was before this file knew about
 * the Scribe.
 *
 * ⛔ A BEAT THAT DID NOT LAND FALLS BACK TO ITS OWN OFFLINE PARAGRAPH, not to a hole and not to
 * the whole tab reverting: a unit refused by the instruments draws the hand-written line at its
 * own seat, which is the rule every other pool on every other tab is drawn under.
 *
 * ⛔ THE ENGINE GATE IS THE WORLD'S OWN TWO VERSIONS, spelled exactly as `faceSources.js` spells
 * it (design §7), so the tab and the composer can never disagree about whether an artefact is
 * still the world's.
 */
function scribeDailyLifeBeatsOf(settlement) {
  const prose = proseOf(settlement);
  if (!prose) return null;
  const renderedFor = String(settlement?._seed ?? settlement?.id ?? '');
  const engineVersion = `gen-${String(settlement?.generatorVersion ?? '')}/sim-${String(settlement?.simulationVersion ?? '')}`;
  const rendered = DAILY_LIFE_BEATS.map((beat) => {
    const units = unitsFor(prose, {
      blockId: DAILY_LIFE_BLOCK, poolKey: beat, renderedFor, engineVersion,
    });
    const spine = Array.isArray(units) && typeof units[0]?.spine === 'string' ? units[0].spine.trim() : '';
    return spine;
  });
  if (!rendered.some(Boolean)) return null;
  const offline = dailyLifeBeats(settlement);
  return rendered.map((text, i) => text || offline[i]);
}

export default React.memo(DailyLifeTab);
