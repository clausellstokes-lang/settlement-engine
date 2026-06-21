/**
 * SettlementPDF — top-level Document tree.
 *
 * Order (prep-friendly): Cover → Overview → Tonight at the Table →
 * People (NPCs, Hooks) → Power & Place (Power, Identity, Services) →
 * Systems (Economics, Resources, Defense) → Background (History, Viability) →
 * External (Relationships) → optional AI Appendix.
 *
 * The legacy Summary page was removed — Overview already carries everything
 * the one-pager held, and the duplication was confusing readers.
 *
 * Props
 *   settlement     — raw settlement object from the save / store
 *   aiSettlement   — narrative payload (thesis, factionBlurbs, npcs …) when
 *                    the user is viewing the AI lens. Optional.
 *   aiDailyLife    — { dawn, morning, midday, evening, night } prose blobs.
 *                    Optional. Drives the Daily Life chapter when present.
 *   narrativeMode  — true if the export should pull narrative content where
 *                    available. Drives the Cover badge and chapter accents.
 */
import { Document } from '@react-pdf/renderer';
import { Cover } from './sections/Cover.jsx';
import { TableOfContents } from './sections/TableOfContents.jsx';
import { Overview } from './sections/Overview.jsx';
import { TonightAtTheTable } from './sections/TonightAtTheTable.jsx';
import { NPCQuickRef } from './sections/NPCQuickRef.jsx';
import { IdentityDailyLife } from './sections/IdentityDailyLife.jsx';
import { PowerStructure } from './sections/PowerStructure.jsx';
import { EconomicsTrade } from './sections/EconomicsTrade.jsx';
import { DefenseSecurity } from './sections/DefenseSecurity.jsx';
import { Services } from './sections/Services.jsx';
import { Institutions } from './sections/Institutions.jsx';
import { ResourcesProduction } from './sections/ResourcesProduction.jsx';
import { ViabilityAssessment } from './sections/ViabilityAssessment.jsx';
import { HistoryFounding } from './sections/HistoryFounding.jsx';
import { NotableNPCs } from './sections/NotableNPCs.jsx';
import { PlotHooks } from './sections/PlotHooks.jsx';
import { Relationships } from './sections/Relationships.jsx';
import { AIAppendix } from './sections/AIAppendix.jsx';
import { SystemStateSnapshot } from './sections/SystemStateSnapshot.jsx';
import { FaithWar } from './sections/FaithWar.jsx';
import { Timeline as TimelineChapter } from './sections/Timeline.jsx';
import { buildViewModel } from './lib/viewModel.js';
import { PDF_VARIANTS, shouldInclude } from './variants.js';

export function SettlementPDF({
  settlement,
  aiSettlement = null,
  aiDailyLife = null,
  narrativeMode = false,
  // Campaign-state engine extras — when present, the PDF emits the
  // SystemStateSnapshot chapter (always) and the Timeline chapter
  // (canon mode only). When absent, both chapters are skipped — saved
  // settlements that pre-date this feature still export cleanly.
  systemState = null,
  eventLog = [],
  phase = 'draft',
  // The LIVE campaign world for this settlement
  // ({ worldState, regionalGraph, settlements?, nameFor? }). Threaded ONLY for
  // premium exports (data-layer gate in SettlementDetail). When absent/dormant
  // the liveWorld slice resolves to null and the Faith & War chapter renders
  // nothing ⇒ byte-identical to a non-campaign export.
  campaign = null,
  // Audit recommendation: three export variants, same engine
  // underneath. Defaults to canon_dossier (the previous behavior) so
  // legacy callers that don't supply a variant get exactly what they
  // got before this feature landed.
  variant = 'canon_dossier',
  // Founder Lifetime exporters see a small parchment-gold "Founder
  // Edition" badge on the cover. Defaults false so historical PDFs
  // are unaffected.
  isFounder = false,
  // Anonymous PDFs (single-dossier purchase, anonymous preview) carry
  // a footer watermark. Account holders — Wanderer, Cartographer,
  // Founder — get clean exports.
  isAnonymous = false,
}) {
  const safe = settlement || {};
  const vm = buildViewModel({
    settlement, aiSettlement, aiDailyLife, narrativeMode,
    systemState, eventLog, phase, campaign,
  });
  const useAi = vm.narrativeMode;
  const variantSpec = PDF_VARIANTS[variant] || PDF_VARIANTS.canon_dossier;
  const ctx = { phase, narrated: useAi, eventCount: eventLog?.length || 0 };
  const inc = (key) => shouldInclude(variantSpec.chapters[key], ctx);
  const showState    = inc('systemState') && !!systemState;
  const showTimeline = inc('timeline');
  // The live "Faith & War" chapter — variant-gated AND self-gating on the
  // dormant liveWorld slice (null when peaceful/deity-free/non-campaign). Both
  // gates must pass; a dormant slice ⇒ no chapter ⇒ byte-identical.
  const showFaithWar = inc('faithWar') && !!vm.liveWorld;
  // The "Campaign State / War Room" variant promotes the State chapter to its
  // layered causal-detail form (15-var grid + pressures). Every other variant
  // keeps the default 4-dim snapshot byte-identical.
  const stateCausalDetail = variant === 'campaign_state';

  // ToC entries — must match the chapters actually rendered below, which
  // are now variant-gated. Build by filtering against the same `inc()`
  // helper so the ToC and the rendered set never diverge.
  // §1i — each entry carries the chapter's actual eyebrow (`no`) and the list is
  // in document order, so the ToC numbers match the rendered chapter headings
  // (no sequential 01-N that drifts from the 03B/08A scheme).
  const tocEntries = [
    inc('overview')            && { no: '01',  title: 'Overview', note: useAi ? 'narrative + raw' : 'systems' },
    inc('tonightAtTheTable')   && { no: '02',  title: 'Tonight at the Table', note: 'quick prep' },
    inc('npcQuickRef')         && { no: '03',  title: 'NPC Quick Reference', note: 'index' },
    showState                  && { no: '03B', title: 'Current State', note: stateCausalDetail ? 'state + substrate' : '4-dim snapshot' },
    showTimeline               && { no: '03C', title: 'Timeline', note: `${eventLog.length} event${eventLog.length === 1 ? '' : 's'}` },
    showFaithWar               && { no: '03D', title: 'Faith & War', note: 'live campaign state' },
    inc('notableNpcs')         && { no: '04',  title: 'Notable NPCs', note: 'detailed sheets' },
    inc('plotHooks')           && { no: '05',  title: 'Plot Hooks & Quests' },
    inc('powerStructure')      && { no: '06',  title: 'Power Structure' },
    inc('identityDailyLife')   && { no: '07',  title: 'Identity & Daily Life' },
    inc('services')            && { no: '08A', title: 'Services', note: 'what players can buy' },
    inc('institutions')        && { no: '08B', title: 'Institutions', note: 'who runs what' },
    inc('economicsTrade')      && { no: '09',  title: 'Economics & Trade' },
    inc('resourcesProduction') && { no: '10',  title: 'Resources & Production' },
    inc('defenseSecurity')     && { no: '11',  title: 'Defense & Security' },
    inc('historyFounding')     && { no: '12',  title: 'History & Founding' },
    inc('viabilityAssessment') && { no: '13',  title: 'Viability Assessment' },
    inc('relationships')       && { no: '14',  title: 'Relationships' },
    inc('aiAppendix')          && { no: '15',  title: 'AI Appendix', note: 'compass + connections' },
  ].filter(Boolean);

  return (
    <Document
      title={`${safe.name || 'Settlement'}: Dossier`}
      author="SettlementForge"
      creator="SettlementForge"
      subject={`Settlement dossier${useAi ? ' (AI narrative edition)' : ''}`}
    >
      {inc('cover')               && <Cover                settlement={safe} narrativeMode={useAi} vm={vm} isFounder={isFounder} isAnonymous={isAnonymous} />}
      {inc('toc')                 && <TableOfContents      settlement={safe} narrativeMode={useAi} entries={tocEntries} />}
      {inc('overview')            && <Overview             settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('tonightAtTheTable')   && <TonightAtTheTable    settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('npcQuickRef')         && <NPCQuickRef          settlement={safe} narrativeMode={useAi} vm={vm} />}
      {showState                  && <SystemStateSnapshot  settlement={safe} narrativeMode={useAi} vm={vm} causalDetail={stateCausalDetail} />}
      {showTimeline               && <TimelineChapter      settlement={safe} narrativeMode={useAi} vm={vm} />}
      {showFaithWar               && <FaithWar             settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('notableNpcs')         && <NotableNPCs          settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('plotHooks')           && <PlotHooks            settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('powerStructure')      && <PowerStructure       settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('identityDailyLife')   && <IdentityDailyLife    settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('services')            && <Services             settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('institutions')        && <Institutions         settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('economicsTrade')      && <EconomicsTrade       settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('resourcesProduction') && <ResourcesProduction  settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('defenseSecurity')     && <DefenseSecurity      settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('historyFounding')     && <HistoryFounding      settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('viabilityAssessment') && <ViabilityAssessment  settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('relationships')       && <Relationships        settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('aiAppendix')          && <AIAppendix           settlement={safe} narrativeMode={useAi} vm={vm} />}
    </Document>
  );
}

export default SettlementPDF;
