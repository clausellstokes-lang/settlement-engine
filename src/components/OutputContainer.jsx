import React, { useState, useRef, lazy, Suspense } from 'react';
import { runAiLayer } from '../generators/aiLayer';
import { Scroll, MapPin, Coins, Building2, Shield, Swords, Users, History, Package, CircleCheckBig, Sparkles, ChevronLeft, ChevronRight, RefreshCw, Zap } from 'lucide-react';
import { C, TIER_LABELS } from './new/design';
import { useStore } from '../store/index.js';
import { CREDIT_COSTS } from '../store/creditsSlice.js';
import { isConfigured } from '../lib/supabase.js';
import { sans, serif } from './new/Primitives';

// ── Lazy-loaded tabs (each loads only when first viewed) ────────────────────
const SummaryTab = lazy(() => import('./new/SummaryTab'));
const OverviewTab = lazy(() => import('./new/tabs/OverviewTab'));
const EconomicsTab = lazy(() => import('./new/tabs/EconomicsTab'));
const ServicesTab = lazy(() => import('./new/tabs/ServicesTab'));
const PowerTab = lazy(() => import('./new/tabs/PowerTab'));
const DefenseTab = lazy(() => import('./new/tabs/DefenseTab'));
const NPCsTab = lazy(() => import('./new/tabs/NPCsTab'));
const HistoryTab = lazy(() => import('./new/tabs/HistoryTab'));
const ResourcesTab = lazy(() => import('./new/tabs/ResourcesTab'));
const ViabilityTab = lazy(() => import('./new/tabs/ViabilityTab'));
const PlotHooksTab = lazy(() => import('./new/tabs/PlotHooksTab'));
const DailyLifeTab = lazy(() => import('./new/tabs/DailyLifeTab'));
const RelationshipsTab = lazy(() => import('./new/tabs/RelationshipsTab'));


const TABS = [
  { id: 'summary',    label: 'DM Summary', Icon: Scroll },
  { id: 'overview',   label: 'Overview',   Icon: MapPin },
  { id: 'daily_life', label: 'Daily Life', Icon: Users },
  { id: 'economics',  label: 'Economics',  Icon: Coins },
  { id: 'services',   label: 'Services',   Icon: Building2 },
  { id: 'power',      label: 'Power',      Icon: Shield },
  { id: 'defense',    label: 'Defense',    Icon: Swords },
  { id: 'npcs',       label: 'NPCs',       Icon: Users },
  { id: 'history',    label: 'History',    Icon: History },
  { id: 'resources',  label: 'Resources',  Icon: Package },
  { id: 'viability',  label: 'Viability',  Icon: CircleCheckBig },
  { id: 'plot_hooks', label: 'Plot Hooks', Icon: Sparkles },
];
const REROLLABLE = { npcs: 'Reroll NPCs', history: 'Reroll History' };

export default function OutputContainer({ settlement: propSettlement, readOnly = false }) {
  const storeSettlement = useStore(s => s.settlement);
  const storeAi = useStore(s => s.aiSettlement);
  const storeSetAi = useStore(s => s.setAiSettlement);
  const clearAiSettlement = useStore(s => s.clearAiSettlement);
  const storeRegenerate = useStore(s => s.regenSection);
  const requestNarrative = useStore(s => s.requestNarrative);
  const creditBalance = useStore(s => s.creditBalance);
  const storeAiLoading = useStore(s => s.aiLoading);
  const storeAiError = useStore(s => s.aiError);

  const settlement = propSettlement || storeSettlement;
  const aiSettlement = readOnly ? null : storeAi;
  const setAiSettlement = readOnly ? null : storeSetAi;
  const onRegenerate = readOnly ? null : storeRegenerate;
  const [activeTab, setActiveTab] = useState('summary');
  const [localAiLoading, setLocalAiLoading] = useState(false);
  const [localAiError, setLocalAiError]     = useState(null);
  const [aiProgress, setAiProgress] = useState('');
  const scrollRef = useRef(null);
  if (!settlement) return null;

  // Use store-based AI (credit-gated via edge function) when Supabase is configured,
  // fall back to direct aiLayer call for local dev
  const aiLoading = isConfigured ? storeAiLoading : localAiLoading;
  const aiError = isConfigured ? storeAiError : localAiError;

  const runNarrativeLayer = async () => {
    if (isConfigured) {
      await requestNarrative();
    } else {
      setLocalAiLoading(true);
      setLocalAiError(null);
      setAiProgress('');
      try {
        const result = await runAiLayer(settlement, msg => setAiProgress(msg));
        setAiSettlement?.(result);
      } catch (e) {
        setLocalAiError(e.message);
      } finally {
        setLocalAiLoading(false);
        setAiProgress('');
      }
    }
  };

  const tabs = [...TABS,
    ...(settlement.neighborRelationship || settlement.neighbourRelationship || settlement.neighbourNetwork?.length
      ? [{ id:'neighbours', label:'Neighbours', Icon: MapPin }] : [])
  ];

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 120, behavior: 'smooth' });

  const renderTab = () => {
    const note = aiSettlement?.tabNotes?.[activeTab] || null;
    switch (activeTab) {
      case 'summary':    return React.createElement(SummaryTab, { settlement });
      case 'daily_life': return React.createElement(DailyLifeTab, { settlement, aiSettlement });
      case 'overview':   return React.createElement(OverviewTab, { settlement, narrativeNote: note });
      case 'economics':  return React.createElement(EconomicsTab, { settlement, narrativeNote: note });
      case 'services':   return React.createElement(ServicesTab, { services: settlement.availableServices, settlement, narrativeNote: note });
      case 'power':      return React.createElement(PowerTab, { powerStructure: settlement.powerStructure, settlement, narrativeNote: note });
      case 'defense':    return React.createElement(DefenseTab, { settlement, narrativeNote: note });
      case 'npcs':       return React.createElement(NPCsTab, { npcs: settlement.npcs, settlement, onRerollNPCs: onRegenerate ? () => onRegenerate('npcs') : null, narrativeNote: note });
      case 'history':    return React.createElement(HistoryTab, { settlement, narrativeNote: note });
      case 'resources':  return React.createElement(ResourcesTab, { settlement, narrativeNote: note });
      case 'viability':  return React.createElement(ViabilityTab, { settlement, narrativeNote: note });
      case 'plot_hooks': return React.createElement(PlotHooksTab, { settlement, narrativeNote: note });
      case 'neighbours':    return React.createElement(RelationshipsTab, { settlement, narrativeNote: note, neighboursOnly: true });
      case 'relationships': return React.createElement(RelationshipsTab, { settlement, narrativeNote: note });
      default:           return React.createElement('div', null);
    }
  };;

  const stressObj = settlement.stress
    ? (Array.isArray(settlement.stress) ? settlement.stress[0] : settlement.stress) : null;

  return (
    React.createElement('div', { style: { background: 'rgba(255,251,245,0.96)', border: '1px solid #c8b89a', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' } },
      // Header
      React.createElement('div', { style: { padding: '14px 20px', background: 'linear-gradient(135deg, #1c1409 0%, #2d1f0e 60%, #1c1409 100%)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid rgba(196,154,60,0.2)' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontFamily: 'Crimson Text, Georgia, serif', fontSize: 24, fontWeight: 600, color: '#c49a3c', lineHeight: 1.1 } }, settlement.name),
          React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: 12, color: '#9c8068', textTransform: 'capitalize', fontWeight: 600 } }, TIER_LABELS[settlement.tier] || settlement.tier),
            React.createElement('span', { style: { fontSize: 12, color: '#6b5340' } }, '·'),
            React.createElement('span', { style: { fontSize: 12, color: '#9c8068' } }, settlement.population?.toLocaleString() + ' pop.'),
            settlement.config?.tradeRouteAccess && React.createElement('span', { style: { fontSize: 12, color: '#9c8068' } }, settlement.config.tradeRouteAccess.replace(/_/g,' ')),
            settlement.config?.monsterThreat && settlement.config.monsterThreat !== 'frontier' && React.createElement('span', { style: { fontSize: 11, fontWeight: 700, color: settlement.config.monsterThreat === 'plagued' ? '#c87060' : '#c49a3c', background: 'rgba(196,154,60,0.12)', borderRadius: 3, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.06em' } }, settlement.config.monsterThreat === 'plagued' ? ' Embattled' : ' Frontier'),
            stressObj && React.createElement('span', { style: { fontSize: 10, fontWeight: 800, color: '#ffd080', background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' } }, stressObj.label)
          )
        ),
        REROLLABLE[activeTab] && onRegenerate && React.createElement('button', {
          onClick: () => onRegenerate(activeTab),
          style: { display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 5, background: 'rgba(196,154,60,0.15)', border: '1px solid rgba(196,154,60,0.3)', color: '#c49a3c', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }
        }, React.createElement(RefreshCw, { size: 12 }), ' ', REROLLABLE[activeTab]),
        // ── AI Narrative Layer button ────────────────────────────────────────
        React.createElement('div', { style: { position: 'relative', display: 'flex', alignItems: 'center', gap: 4 } },
          aiSettlement && React.createElement('button', {
            onClick: () => clearAiSettlement(),
            title: 'Remove AI Narrative Layer — revert all tabs to original generated output',
            style: {
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%', padding: 0,
              background: 'rgba(90,42,138,0.15)', border: '1px solid rgba(160,100,220,0.3)',
              color: '#c8a0f0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Nunito, sans-serif', lineHeight: 1, flexShrink: 0,
            }
          }, '×'),
          React.createElement('button', {
            onClick: runNarrativeLayer,
            disabled: aiLoading,
            title: 'AI Narrative Layer — reads the full settlement output, finds the threads connecting each system, and adds a cohesive narrative layer across all tabs. Generates daily life prose. Can be run repeatedly for fresh interpretations.',
            style: {
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 20,
              background: aiSettlement
                ? 'linear-gradient(135deg, #4a1a7a, #6a2a9a)'
                : aiLoading
                ? 'rgba(90,42,138,0.3)'
                : 'rgba(90,42,138,0.2)',
              border: `1px solid ${aiSettlement ? 'rgba(160,100,220,0.6)' : 'rgba(160,100,220,0.35)'}`,
              color: aiLoading ? 'rgba(200,160,240,0.6)' : '#c8a0f0',
              fontSize: 11, fontWeight: 800, cursor: aiLoading ? 'default' : 'pointer',
              fontFamily: 'Nunito, sans-serif', letterSpacing: '0.04em',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }
          },
            aiLoading
              ? React.createElement('span', { style: { display: 'inline-block', animation: 'spin 1.2s linear infinite', fontSize: 12 } }, '✦')
              : React.createElement('span', { style: { fontSize: 11 } }, '✦'),
            aiLoading ? (aiProgress || 'Weaving…') : aiSettlement ? 'AI Narrative Layer ✓' : isConfigured ? `AI Narrative (${CREDIT_COSTS.narrative} credits)` : 'AI Narrative Layer'
          ),
          aiError && React.createElement('div', {
            style: { position: 'absolute', top: '110%', right: 0, background: '#2d0a0a', border: '1px solid #8b1a1a', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#f0a0a0', whiteSpace: 'nowrap', zIndex: 50, maxWidth: 300, wordBreak: 'break-word' }
          }, ' ', aiError)
        )
      ),
      // Tab strip
      React.createElement('div', { style: { position: 'relative', borderBottom: '1px solid #e0d0b0', background: '#f7f0e4' } },
        React.createElement('button', { onClick: () => scroll(-1), style: { position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2, background: 'linear-gradient(to right, #f7f0e4 60%, transparent)', border: 'none', cursor: 'pointer', color: '#9c8068', padding: '0 8px' } }, React.createElement(ChevronLeft, { size: 14 })),
        React.createElement('div', { ref: scrollRef, style: { display: 'flex', overflowX: 'auto', scrollbarWidth: 'none', paddingLeft: 28, paddingRight: 28, WebkitOverflowScrolling: 'touch' } },
          tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return React.createElement('button', {
              key: id, onClick: () => setActiveTab(id),
              style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 12px 8px', flexShrink: 0, background: active ? '#fffbf5' : 'transparent', borderBottom: '2px solid ' + (active ? '#a0762a' : 'transparent'), borderTop: active ? '1px solid #e0d0b0' : '1px solid transparent', borderLeft: active ? '1px solid #e0d0b0' : '1px solid transparent', borderRight: active ? '1px solid #e0d0b0' : '1px solid transparent', cursor: 'pointer', color: active ? '#a0762a' : '#6b5340', fontSize: 9.5, fontWeight: active ? 700 : 500, fontFamily: 'Nunito, sans-serif', marginBottom: -1, whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent' }
            }, React.createElement(Icon, { size: 14 }), label);
          })
        ),
        React.createElement('button', { onClick: () => scroll(1), style: { position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 2, background: 'linear-gradient(to left, #f7f0e4 60%, transparent)', border: 'none', cursor: 'pointer', color: '#9c8068', padding: '0 8px' } }, React.createElement(ChevronRight, { size: 14 }))
      ),
      // Content
      React.createElement('div', { style: { minHeight: 300, background: 'rgba(250,248,244,0.97)' } },
        aiSettlement?.thesis && React.createElement('div', {
          style: { padding: '12px 18px', borderBottom: '1px solid rgba(160,100,220,0.2)', background: 'linear-gradient(135deg, rgba(74,26,122,0.06), rgba(106,42,154,0.04))' }
        },
          React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } },
            React.createElement('span', { style: { fontSize: 13, flexShrink: 0, marginTop: 2, color: '#8a50b0' } }, '✦'),
            React.createElement('div', { style: { flex: 1, minWidth: 0 } },
              React.createElement('div', { style: { fontSize: 9, fontWeight: 800, color: '#8a50b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 } }, 'AI Narrative Layer'),
              aiSettlement.thesis.split(/\n\n+/).map((para, i) =>
                React.createElement('p', { key: i, style: { margin: 0, marginBottom: i < aiSettlement.thesis.split(/\n\n+/).length - 1 ? 10 : 0, fontSize: 12.5, color: '#2d1f0e', lineHeight: 1.65, fontFamily: 'Georgia, serif' } }, para.trim())
              ),
              React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' } },
                React.createElement('button', {
                  onClick: runNarrativeLayer, disabled: aiLoading,
                  style: { fontSize: 10, color: '#8a50b0', background: 'none', border: '1px solid rgba(138,80,176,0.3)', borderRadius: 4, padding: '2px 10px', cursor: aiLoading ? 'default' : 'pointer', fontFamily: 'Nunito, sans-serif' }
                }, aiLoading ? 'Weaving…' : '↺ Regenerate'),
                React.createElement('button', {
                  onClick: () => clearAiSettlement(),
                  style: { fontSize: 10, color: '#9c8068', background: 'none', border: '1px solid rgba(156,128,104,0.3)', borderRadius: 4, padding: '2px 10px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }
                }, '× Remove layer')
              )
            )
          )
        ),
        React.createElement(
          Suspense,
          { fallback: React.createElement('div', {
              style: { padding: 32, textAlign: 'center', color: '#9c8068',
                       fontFamily: 'Nunito,sans-serif', fontSize: 13 }
            }, 'Loading…') },
          renderTab()
        )
      )
    )
  );
}
