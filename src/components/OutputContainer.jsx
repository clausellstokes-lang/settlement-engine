import React, { useState, useRef, lazy, Suspense } from 'react';
import { runAiLayer } from '../generators/aiLayer';
import { Scroll, MapPin, Coins, Building2, Shield, Swords, Users, History, Package, CircleCheckBig, Sparkles, ChevronLeft, ChevronRight, RefreshCw, Eye, EyeOff, Compass } from 'lucide-react';
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
const DMCompassTab = lazy(() => import('./new/tabs/DMCompassTab'));


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

export default function OutputContainer({ settlement: propSettlement, readOnly = false, saveId = null }) {
  const storeSettlement = useStore(s => s.settlement);
  const storeAi = useStore(s => s.aiSettlement);
  const storeSetAi = useStore(s => s.setAiSettlement);
  const clearAiSettlement = useStore(s => s.clearAiSettlement);
  const storeRegenerate = useStore(s => s.regenSection);
  const requestNarrative = useStore(s => s.requestNarrative);
  const creditBalance = useStore(s => s.creditBalance);
  const storeAiLoading = useStore(s => s.aiLoading);
  const storeAiRegenerating = useStore(s => s.aiRegenerating);
  const storeAiError = useStore(s => s.aiError);
  const storeAiProgress = useStore(s => s.aiProgress);
  const storeAiPartialFailure = useStore(s => s.aiPartialFailure);
  const storeShowNarrative = useStore(s => s.showNarrative);
  const setShowNarrative = useStore(s => s.setShowNarrative);
  // Pinned NPCs — AI-4a. The live save entry is the source of truth so the
  // pin icons stay in sync across tabs without an extra hydration hop.
  const liveSaveEntry = useStore(s => saveId ? s.savedSettlements.find(x => x.id === saveId) : null);
  const pinNpc = useStore(s => s.pinNpc);
  const unpinNpc = useStore(s => s.unpinNpc);

  const rawSettlement = propSettlement || storeSettlement;
  // AI narrative is now gated behind a saveId (AI-1): the ai_data has a
  // durable home on the saved settlement row. readOnly still controls
  // editing affordances (regen, setAi from local-dev mock) independently.
  const narrativeEnabled = isConfigured ? !!saveId : true; // local-dev mock is ungated
  const aiSettlement = storeAi;
  const setAiSettlement = readOnly ? null : storeSetAi;
  const onRegenerate = readOnly ? null : storeRegenerate;
  const trackTabExplored = useStore(s => s.trackTabExplored);
  const onboardingActive = useStore(s => s.onboardingActive);
  const onboardingStep = useStore(s => s.onboardingStep);
  const [activeTab, _setActiveTab] = useState('summary');
  const setActiveTab = (id) => {
    _setActiveTab(id);
    if (!readOnly && trackTabExplored) trackTabExplored();
  };
  const [localAiLoading, setLocalAiLoading] = useState(false);
  const [localAiError, setLocalAiError]     = useState(null);
  const [aiProgress, setAiProgress] = useState('');
  const scrollRef = useRef(null);
  if (!rawSettlement) return null;

  // Use store-based AI (credit-gated via edge function) when Supabase is configured,
  // fall back to direct aiLayer call for local dev
  const aiLoading = isConfigured ? storeAiLoading : localAiLoading;
  const aiRegenerating = isConfigured ? storeAiRegenerating : false;
  const aiError = isConfigured ? storeAiError : localAiError;
  const displayProgress = isConfigured ? storeAiProgress : aiProgress;

  // ── Which settlement object drives the tabs? ───────────────────────────────
  // When narrative view is on AND aiSettlement exists, read from the refined
  // clone. Otherwise read raw. Refined sections the AI completed show polished
  // prose; sections the AI didn't touch (or passes that failed) show raw data
  // because aiSettlement started as a deep clone of the source.
  const showNarrative = storeShowNarrative && !!aiSettlement;
  const activeSettlement = showNarrative ? aiSettlement : rawSettlement;

  const runNarrativeLayer = async () => {
    if (isConfigured) {
      await requestNarrative(saveId);
    } else {
      setLocalAiLoading(true);
      setLocalAiError(null);
      setAiProgress('');
      try {
        const result = await runAiLayer(rawSettlement, msg => setAiProgress(msg));
        setAiSettlement?.(result);
      } catch (e) {
        setLocalAiError(e.message);
      } finally {
        setLocalAiLoading(false);
        setAiProgress('');
      }
    }
  };

  // Pin props for the NPCs tab — only surface when we have a real save to
  // persist onto AND we're not in read-only mode. `pinnedIds` is a Set of
  // normalized pin keys so NPCInlineCard can do O(1) lookups and the backend
  // filter's key format matches.
  const pinnedIds = React.useMemo(() => {
    const arr = liveSaveEntry?.aiData?.pinnedNpcs;
    return Array.isArray(arr) ? new Set(arr.map(String)) : new Set();
  }, [liveSaveEntry?.aiData?.pinnedNpcs]);
  const onTogglePin = (!readOnly && saveId) ? ((npcId) => {
    const key = String(npcId);
    if (pinnedIds.has(key)) unpinNpc(saveId, key);
    else pinNpc(saveId, key);
  }) : null;

  // DM Compass tab is visible only when the narrative layer has produced at
  // least one of its four fields (AI-3a). Unnarrated saves don't need the tab.
  const hasDMCompass = !!(aiSettlement && (
    (Array.isArray(aiSettlement.identityMarkers) && aiSettlement.identityMarkers.length) ||
    (Array.isArray(aiSettlement.frictionPoints)  && aiSettlement.frictionPoints.length)  ||
    (Array.isArray(aiSettlement.connectionsMap)  && aiSettlement.connectionsMap.length)  ||
    (aiSettlement.dmCompass && (
      (Array.isArray(aiSettlement.dmCompass.hooks)    && aiSettlement.dmCompass.hooks.length) ||
      (Array.isArray(aiSettlement.dmCompass.redFlags) && aiSettlement.dmCompass.redFlags.length) ||
      (typeof aiSettlement.dmCompass.twist === 'string' && aiSettlement.dmCompass.twist.length)
    ))
  ));

  const tabs = [...TABS,
    ...(hasDMCompass ? [{ id:'dm_compass', label:'DM Compass', Icon: Compass }] : []),
    ...(rawSettlement.neighborRelationship || rawSettlement.neighbourRelationship || rawSettlement.neighbourNetwork?.length
      ? [{ id:'neighbours', label:'Neighbours', Icon: MapPin }] : [])
  ];

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 120, behavior: 'smooth' });

  const renderTab = () => {
    const s = activeSettlement;
    switch (activeTab) {
      case 'summary':    return React.createElement(SummaryTab, { settlement: s });
      case 'daily_life': return React.createElement(DailyLifeTab, { settlement: s, aiSettlement, saveId });
      case 'overview':   return React.createElement(OverviewTab, { settlement: s, narrativeNote: null });
      case 'economics':  return React.createElement(EconomicsTab, { settlement: s, narrativeNote: null });
      case 'services':   return React.createElement(ServicesTab, { services: s.availableServices, settlement: s, narrativeNote: null });
      case 'power':      return React.createElement(PowerTab, { powerStructure: s.powerStructure, settlement: s, narrativeNote: null });
      case 'defense':    return React.createElement(DefenseTab, { settlement: s, narrativeNote: null });
      case 'npcs':       return React.createElement(NPCsTab, { npcs: s.npcs, settlement: s, onRerollNPCs: onRegenerate ? () => onRegenerate('npcs') : null, narrativeNote: null, pinnedIds, onTogglePin });
      case 'history':    return React.createElement(HistoryTab, { settlement: s, narrativeNote: null });
      case 'resources':  return React.createElement(ResourcesTab, { settlement: s, narrativeNote: null });
      case 'viability':  return React.createElement(ViabilityTab, { settlement: s, narrativeNote: null });
      case 'plot_hooks': return React.createElement(PlotHooksTab, { settlement: s, narrativeNote: null });
      case 'dm_compass': return React.createElement(DMCompassTab, { settlement: s });
      case 'neighbours':    return React.createElement(RelationshipsTab, { settlement: s, narrativeNote: null, neighboursOnly: true });
      case 'relationships': return React.createElement(RelationshipsTab, { settlement: s, narrativeNote: null });
      default:           return React.createElement('div', null);
    }
  };

  // Header chips read from the raw settlement — mechanical facts shouldn't
  // change between views.
  const settlement = rawSettlement;
  const stressObj = settlement.stress
    ? (Array.isArray(settlement.stress) ? settlement.stress[0] : settlement.stress) : null;

  // ── Button group state ─────────────────────────────────────────────────────
  // Three distinct buttons replace the old single action so view-toggling
  // can't accidentally spend credits.
  const renderNarrativeButtons = () => {
    // Unsaved settlements: render nothing here. The AI-enrichment affordance
    // moved to a slim hint line below the tab strip so the header stays
    // focused on what the user just generated. This avoids a teaser button
    // that can't actually fire.
    if (!narrativeEnabled) return null;

    const costLabel = isConfigured ? ` (${CREDIT_COSTS.narrative} credits)` : '';
    const btnBase = {
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '6px 14px', borderRadius: 20,
      fontSize: 11, fontWeight: 800,
      fontFamily: 'Nunito, sans-serif', letterSpacing: '0.04em',
      transition: 'all 0.2s', whiteSpace: 'nowrap',
      cursor: 'pointer',
    };

    // State 1: no narrative yet → single generate button
    if (!aiSettlement && !aiLoading) {
      return React.createElement('div', { style: { position: 'relative', display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('button', {
          onClick: runNarrativeLayer,
          title: 'AI Narrative Layer — refines every prose field to feel specific to this settlement. Uses credits.',
          style: {
            ...btnBase,
            background: 'rgba(90,42,138,0.2)',
            border: '1px solid rgba(160,100,220,0.35)',
            color: '#c8a0f0',
          }
        },
          React.createElement('span', { style: { fontSize: 11 } }, '\u2726'),
          `Generate AI Narrative${costLabel}`
        ),
        aiError && React.createElement('div', {
          style: { position: 'absolute', top: '110%', right: 0, background: '#2d0a0a', border: '1px solid #8b1a1a', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#f0a0a0', whiteSpace: 'nowrap', zIndex: 50, maxWidth: 300, wordBreak: 'break-word' }
        }, ' ', aiError)
      );
    }

    // State 2: loading (first-time) → progress chip
    if (aiLoading && !aiRegenerating) {
      return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement('div', {
          style: {
            ...btnBase,
            background: 'rgba(90,42,138,0.3)',
            border: '1px solid rgba(160,100,220,0.35)',
            color: 'rgba(200,160,240,0.8)',
            cursor: 'default',
          }
        },
          React.createElement('span', { style: { display: 'inline-block', animation: 'spin 1.2s linear infinite' } }, '\u2726'),
          displayProgress || 'Weaving\u2026'
        )
      );
    }

    // State 3 or 4: narrative exists → toggle + regenerate pair
    // (Includes the aiLoading && aiRegenerating case — buttons appear but the
    // Regenerate one is disabled while the new narrative is brewing.)
    const inNarrativeView = storeShowNarrative;
    const regenerating = aiLoading && aiRegenerating;

    return React.createElement('div', { style: { position: 'relative', display: 'flex', alignItems: 'center', gap: 6 } },
      // Toggle view button — free action
      React.createElement('button', {
        onClick: () => setShowNarrative(!inNarrativeView),
        disabled: regenerating,
        title: inNarrativeView
          ? 'Switch to the raw generated data (no AI polish). No credits used.'
          : 'Switch to the AI-refined view. No credits used.',
        style: {
          ...btnBase,
          background: inNarrativeView
            ? 'rgba(156,128,104,0.2)'
            : 'linear-gradient(135deg, #4a1a7a, #6a2a9a)',
          border: inNarrativeView
            ? '1px solid rgba(156,128,104,0.35)'
            : '1px solid rgba(160,100,220,0.6)',
          color: inNarrativeView ? '#c8b89a' : '#f0d8ff',
          opacity: regenerating ? 0.5 : 1,
          cursor: regenerating ? 'default' : 'pointer',
        }
      },
        inNarrativeView
          ? React.createElement(EyeOff, { size: 12 })
          : React.createElement(Eye, { size: 12 }),
        inNarrativeView ? 'View Raw Data' : 'View AI Narrative'
      ),
      // Regenerate button — spends credits
      React.createElement('button', {
        onClick: runNarrativeLayer,
        disabled: regenerating,
        title: `Regenerate the AI Narrative Layer from the source settlement. Spends ${CREDIT_COSTS.narrative} credits.`,
        style: {
          ...btnBase,
          background: regenerating ? 'rgba(90,42,138,0.3)' : 'rgba(90,42,138,0.2)',
          border: '1px solid rgba(160,100,220,0.35)',
          color: regenerating ? 'rgba(200,160,240,0.6)' : '#c8a0f0',
          cursor: regenerating ? 'default' : 'pointer',
        }
      },
        regenerating
          ? React.createElement('span', { style: { display: 'inline-block', animation: 'spin 1.2s linear infinite' } }, '\u21ba')
          : React.createElement(RefreshCw, { size: 12 }),
        regenerating ? (displayProgress || 'Regenerating\u2026') : `Regenerate${costLabel}`
      ),
      aiError && React.createElement('div', {
        style: { position: 'absolute', top: '110%', right: 0, background: '#2d0a0a', border: '1px solid #8b1a1a', borderRadius: 6, padding: '8px 12px', fontSize: 11, color: '#f0a0a0', whiteSpace: 'nowrap', zIndex: 50, maxWidth: 300, wordBreak: 'break-word' }
      }, ' ', aiError)
    );
  };

  return (
    React.createElement('div', { style: { background: 'rgba(255,251,245,0.96)', border: '1px solid #c8b89a', borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' } },
      // Header
      React.createElement('div', { style: { padding: '14px 20px', background: 'linear-gradient(135deg, #1c1409 0%, #2d1f0e 60%, #1c1409 100%)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', borderBottom: '1px solid rgba(196,154,60,0.2)' } },
        React.createElement('div', { style: { flex: 1, minWidth: 0 } },
          React.createElement('div', { style: { fontFamily: 'Crimson Text, Georgia, serif', fontSize: 24, fontWeight: 600, color: '#c49a3c', lineHeight: 1.1 } }, settlement.name),
          React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' } },
            React.createElement('span', { style: { fontSize: 12, color: '#9c8068', textTransform: 'capitalize', fontWeight: 600 } }, TIER_LABELS[settlement.tier] || settlement.tier),
            React.createElement('span', { style: { fontSize: 12, color: '#6b5340' } }, '\u00b7'),
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
        // ── AI Narrative Layer button group ──────────────────────────────────
        renderNarrativeButtons()
      ),
      // Tab strip
      React.createElement('div', { 'data-onboard-highlight': onboardingActive && onboardingStep === 2 ? 'true' : undefined, style: { position: 'relative', borderBottom: '1px solid #e0d0b0', background: '#f7f0e4' } },
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
      // Unlock hint — shown only when this is an unsaved settlement (Create
      // page). Replaces the disabled "save to enable" chip that used to live
      // in the header next to the regen button. Single calm hint, single
      // place; clicked nowhere.
      !narrativeEnabled && React.createElement('div', {
        style: {
          padding: '8px 18px',
          borderBottom: '1px solid #e0d0b0',
          background: 'linear-gradient(135deg, rgba(74,26,122,0.05), rgba(106,42,154,0.02))',
          fontSize: 11.5, color: '#6b5340',
          fontFamily: 'Nunito, sans-serif',
          display: 'flex', alignItems: 'center', gap: 8,
        }
      },
        React.createElement('span', { style: { fontSize: 12, color: '#8a50b0' } }, '\u2726'),
        React.createElement('span', null,
          React.createElement('strong', { style: { color: '#5a2a8a' } }, 'Save this settlement'),
          ' to unlock AI Narrative & Daily Life prose.'
        )
      ),
      // Content — dimmed overlay during regenerate so the user sees "something is changing"
      React.createElement('div', { style: { position: 'relative', minHeight: 300, background: 'rgba(250,248,244,0.97)' } },
        // ── Banners above tab content ────────────────────────────────────────
        // Banner targeting:
        //   • Thesis (identity-level prose) lives only on Summary & Overview —
        //     the high-altitude reads.
        //   • Per-tab notes (`narrativeNotes[activeTab]`) replace the thesis
        //     on every functional tab so each tab gets a contextual lens
        //     instead of re-reading the same identity statement.
        //   • Daily Life, DM Compass, and Neighbours/Relationships carry
        //     their own AI prose inside the tab — no banner.
        // The partial-failure notice was lifted out of the thesis block so it
        // surfaces on every tab (it's a session-level concern, not an
        // identity-banner concern).
        (() => {
          if (!showNarrative || !aiSettlement) return null;
          const THESIS_TABS = ['summary', 'overview'];
          const NOTE_TABS = ['economics', 'services', 'power', 'defense', 'npcs', 'history', 'resources', 'viability', 'plot_hooks'];
          const showThesis = THESIS_TABS.includes(activeTab) && typeof aiSettlement.thesis === 'string' && aiSettlement.thesis.length > 0;
          const note = NOTE_TABS.includes(activeTab) ? aiSettlement.narrativeNotes?.[activeTab] : null;
          const showNote = typeof note === 'string' && note.length > 0;
          if (!showThesis && !showNote) return null;

          return React.createElement('div', {
            style: {
              padding: '12px 18px',
              borderBottom: '1px solid rgba(160,100,220,0.2)',
              background: 'linear-gradient(135deg, rgba(74,26,122,0.06), rgba(106,42,154,0.04))',
              opacity: aiRegenerating ? 0.55 : 1,
            }
          },
            React.createElement('div', { style: { display: 'flex', alignItems: 'flex-start', gap: 10 } },
              React.createElement('span', { style: { fontSize: 13, flexShrink: 0, marginTop: 2, color: '#8a50b0' } }, '\u2726'),
              React.createElement('div', { style: { flex: 1, minWidth: 0 } },
                React.createElement('div', { style: { fontSize: 9, fontWeight: 800, color: '#8a50b0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 } },
                  showThesis ? 'AI Narrative Layer \u2014 Identity' : 'AI Narrative Layer \u2014 Lens'
                ),
                showThesis
                  ? aiSettlement.thesis.split(/\n\n+/).map((para, i, arr) =>
                      React.createElement('p', { key: i, style: { margin: 0, marginBottom: i < arr.length - 1 ? 10 : 0, fontSize: 12.5, color: '#2d1f0e', lineHeight: 1.65, fontFamily: 'Georgia, serif' } }, para.trim())
                    )
                  : React.createElement('p', { style: { margin: 0, fontSize: 12.5, color: '#2d1f0e', lineHeight: 1.65, fontFamily: 'Georgia, serif' } }, note)
              )
            )
          );
        })(),
        // Partial-refinement notice — independent of which tab is active.
        showNarrative && storeAiPartialFailure && storeAiPartialFailure.failedFields?.length > 0 && React.createElement('div', {
          style: {
            margin: '8px 18px 0', padding: '6px 10px',
            background: 'rgba(196,128,60,0.08)',
            border: '1px solid rgba(196,128,60,0.2)',
            borderRadius: 4, fontSize: 10.5, color: '#8a5a20',
            fontFamily: 'Nunito, sans-serif',
          }
        }, `Partial refinement: ${storeAiPartialFailure.failedFields.join(', ')} kept raw data.`),
        // Regenerate overlay — floats progress above the dimmed existing content
        aiRegenerating && React.createElement('div', {
          style: {
            position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
            zIndex: 20, background: 'rgba(74,26,122,0.95)', color: '#f0d8ff',
            padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(160,100,220,0.6)',
            fontSize: 11.5, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }
        },
          React.createElement('span', { style: { display: 'inline-block', animation: 'spin 1.2s linear infinite' } }, '\u2726'),
          displayProgress || 'Regenerating\u2026'
        ),
        React.createElement(
          Suspense,
          { fallback: React.createElement('div', {
              style: { padding: 32, textAlign: 'center', color: '#9c8068',
                       fontFamily: 'Nunito,sans-serif', fontSize: 13 }
            }, 'Loading\u2026') },
          React.createElement('div', { style: { opacity: aiRegenerating ? 0.6 : 1, transition: 'opacity 0.2s' } },
            renderTab()
          )
        ),
        React.createElement('style', null, '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }')
      )
    )
  );
}
