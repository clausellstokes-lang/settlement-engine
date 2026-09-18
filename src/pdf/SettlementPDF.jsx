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
import { Traditions } from './sections/Traditions.jsx';
import { Timeline as TimelineChapter } from './sections/Timeline.jsx';
import { buildViewModel } from './lib/viewModel.js';
import { PDF_VARIANTS, shouldInclude, faithChapterVisible } from './variants.js';

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
  // The LIVE campaign world for this settlement ({ worldState, regionalGraph,
  // settlements?, nameById? }). Threaded ONLY for premium exports. When absent /
  // dormant the liveWorld slice resolves to null and the Faith & War chapter
  // renders nothing ⇒ byte-identical to a non-campaign export.
  campaign = null,
  // The faith premium seam, mirroring the screen's FaithSection. Only a premium /
  // elevated exporter unlocks the Faith & War chapter; a free / lapsed / anon
  // export keeps the DEFAULT (false) ⇒ no faith chapter, no deity names in the
  // PDF. The caller (the export surface) passes the tier result.
  faithUnlocked = false,
  // Audit recommendation: export variants, same engine underneath. Defaults to
  // canon_dossier (the previous behavior) so legacy callers that don't supply a
  // variant get exactly what they got before this feature landed.
  variant = 'canon_dossier',
  // Founder Lifetime exporters see a small parchment-gold "Founder
  // Edition" badge on the cover. Defaults false so historical PDFs
  // are unaffected.
  isFounder = false,
  // The cover's anti-scraping watermark. VERIFIED POSTURE (2026-07-30): NO
  // production caller passes true. The single-dossier purchase export passes
  // `false` explicitly (SingleDossierSuccessPage.jsx), and the three account
  // export surfaces (SettlementCard, ExportDraftButton, SettlementDetail) omit
  // it and take this default — so the watermark block in Cover.jsx is reachable
  // only from tests. Whether a purchase / anonymous export should carry it is an
  // open product call, recorded here, not a defect to re-find.
  isAnonymous = false,
  // The export date — injectable, mirroring the World Book cover (opts.now).
  // Null keeps the wall-clock read inside Cover, so legacy callers are unchanged.
  now = null,
  // The document's CreationDate. `now` is the printed COVER LABEL (a display
  // string); this is the metadata timestamp, and they are deliberately separate
  // props because they are separate facts — a cover can read "Cyfrin 1, 2026" in
  // a world calendar that no Date can express. react-pdf defaults this to
  // `new Date()`, so leaving it unset made every export of one unchanged
  // settlement differ in bytes. Null keeps that default: legacy callers unchanged.
  creationDate = null,
  // ⭐ THE MOUNTED STATE PROSE (owner order "impliment every fix", 2026-09-18) — the
  // fifty-one sentence-rung dossier positions the SCREEN draws and this document carried
  // none of, as `{ tab: { mount: paragraph } }`. Built by the CALLER
  // (`utils/generateSettlementPDF.js` → `domain/display/stateProse/printProse.js`) on the
  // main thread and posted to the render worker as plain strings, so the corpus leaves stay
  // out of this bundle entirely — see `primitives/StateProse.jsx`.
  //
  // ⛔ A PROP AND NOT A VIEW-MODEL FIELD, deliberately: `pdf/lib/viewModel.js` is pinned
  // byte-for-byte by tests/pdf/__snapshots__/goldenViewModel.test.js.snap, and these
  // paragraphs have nothing to do with the view model's shape. Null keeps every legacy
  // caller — the campaign book, the foundry module, every hand-built test document —
  // byte-identical, because each chapter renders nothing for an absent map.
  stateProse = null,
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
  // The live "Faith & War" chapter — variant + canon gated, self-gating on the
  // dormant liveWorld slice, AND premium-gated (faithUnlocked). All three must
  // pass; a free/anon export (faithUnlocked=false) or a dormant slice ⇒ no
  // chapter ⇒ no deity names ⇒ byte-identical.
  const showFaithWar = faithChapterVisible({
    variant, phase, hasLiveWorld: !!vm.liveWorld, faithUnlocked,
    narrated: useAi, eventCount: eventLog?.length || 0,
  });
  // The "Campaign State / War Room" variant promotes the State chapter to its
  // layered causal-detail form (16-var grid + pressures). Every other variant
  // keeps the default 4-dim snapshot byte-identical.
  const stateCausalDetail = variant === 'campaign_state';
  // THE TRADITIONS register (07B, T-5) — variant/canon gated AND self-gating on the
  // settlement.traditions MIRROR (the FaithWar off-state precedent). A draft, or any export
  // while the traditions layer is DARK (no mirror), ⇒ no chapter ⇒ byte-identical.
  const showTraditions = inc('traditions') && Array.isArray(safe.traditions) && safe.traditions.length > 0;

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
    showTraditions             && { no: '07B', title: 'Traditions', note: 'festivals & rites' },
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
      // Pinned rather than left to react-pdf's default 'react-pdf', so a paid
      // artifact's info dict names the product beside its engine instead of the
      // dependency alone. Truthful about both, and version-free by construction.
      producer="SettlementForge (react-pdf)"
      // undefined ⇒ react-pdf's own `new Date()` default, the pre-seam behaviour.
      creationDate={creationDate ? new Date(creationDate) : undefined}
      subject={`Settlement dossier${useAi ? ' (AI narrative edition)' : ''}`}
    >
      {inc('cover')               && <Cover                settlement={safe} narrativeMode={useAi} vm={vm} isFounder={isFounder} isAnonymous={isAnonymous} now={now} />}
      {inc('toc')                 && <TableOfContents      settlement={safe} narrativeMode={useAi} entries={tocEntries} />}
      {inc('overview')            && <Overview             settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('tonightAtTheTable')   && <TonightAtTheTable    settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('npcQuickRef')         && <NPCQuickRef          settlement={safe} narrativeMode={useAi} vm={vm} />}
      {showState                  && <SystemStateSnapshot  settlement={safe} narrativeMode={useAi} vm={vm} causalDetail={stateCausalDetail} />}
      {showTimeline               && <TimelineChapter      settlement={safe} narrativeMode={useAi} vm={vm} />}
      {showFaithWar               && <FaithWar             settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('notableNpcs')         && <NotableNPCs          settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('plotHooks')           && <PlotHooks            settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('powerStructure')      && <PowerStructure       settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('identityDailyLife')   && <IdentityDailyLife    settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {showTraditions             && <Traditions           settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('services')            && <Services             settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('institutions')        && <Institutions         settlement={safe} narrativeMode={useAi} vm={vm} />}
      {inc('economicsTrade')      && <EconomicsTrade       settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('resourcesProduction') && <ResourcesProduction  settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('defenseSecurity')     && <DefenseSecurity      settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('historyFounding')     && <HistoryFounding      settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('viabilityAssessment') && <ViabilityAssessment  settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('relationships')       && <Relationships        settlement={safe} narrativeMode={useAi} vm={vm} stateProse={stateProse} />}
      {inc('aiAppendix')          && <AIAppendix           settlement={safe} narrativeMode={useAi} vm={vm} />}
    </Document>
  );
}

export default SettlementPDF;
