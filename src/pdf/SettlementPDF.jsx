/**
 * SettlementPDF — top-level Document tree.
 *
 * Assembles the cover + ToC + every chapter page into a single @react-pdf
 * <Document>. Sections are added phase-by-phase; the ToC entries list grows
 * in lockstep so the index stays accurate.
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
import React from 'react';
import { Document } from '@react-pdf/renderer';
import { Cover } from './sections/Cover.jsx';
import { TableOfContents } from './sections/TableOfContents.jsx';
import { Overview } from './sections/Overview.jsx';
import { IdentityDailyLife } from './sections/IdentityDailyLife.jsx';
import { PowerStructure } from './sections/PowerStructure.jsx';
import { EconomicsTrade } from './sections/EconomicsTrade.jsx';
import { DefenseSecurity } from './sections/DefenseSecurity.jsx';
import { ServicesInstitutions } from './sections/ServicesInstitutions.jsx';
import { ResourcesProduction } from './sections/ResourcesProduction.jsx';
import { ViabilityAssessment } from './sections/ViabilityAssessment.jsx';
import { HistoryFounding } from './sections/HistoryFounding.jsx';
import { NotableNPCs } from './sections/NotableNPCs.jsx';
import { PlotHooks } from './sections/PlotHooks.jsx';
import { Relationships } from './sections/Relationships.jsx';
import { AIAppendix } from './sections/AIAppendix.jsx';
import { buildViewModel } from './lib/viewModel.js';

export function SettlementPDF({
  settlement,
  aiSettlement = null,
  aiDailyLife = null,
  narrativeMode = false,
}) {
  const safe = settlement || {};
  const vm = buildViewModel({ settlement, aiSettlement, aiDailyLife, narrativeMode });
  const useAi = vm.narrativeMode;

  // ToC entries — kept in sync with the actual sections rendered below.
  const tocEntries = [
    { title: 'Overview', note: useAi ? 'narrative + raw' : 'raw' },
    { title: 'Identity & Daily Life' },
    { title: 'Power Structure' },
    { title: 'Economics & Trade' },
    { title: 'Defense & Security' },
    { title: 'Services & Institutions' },
    { title: 'Resources & Production' },
    { title: 'Viability Assessment' },
    { title: 'History & Founding' },
    { title: 'Notable NPCs' },
    { title: 'Plot Hooks & Quests' },
    { title: 'Relationships' },
    ...(useAi ? [{ title: 'AI Appendix', note: 'compass + connections' }] : []),
  ];

  return (
    <Document
      title={`${safe.name || 'Settlement'} — Dossier`}
      author="SettlementForge"
      creator="SettlementForge"
      subject={`Settlement dossier${useAi ? ' (AI narrative edition)' : ''}`}
    >
      <Cover settlement={safe} narrativeMode={useAi} />
      <TableOfContents settlement={safe} narrativeMode={useAi} entries={tocEntries} />
      <Overview               settlement={safe} narrativeMode={useAi} vm={vm} />
      <IdentityDailyLife      settlement={safe} narrativeMode={useAi} vm={vm} />
      <PowerStructure         settlement={safe} narrativeMode={useAi} vm={vm} />
      <EconomicsTrade         settlement={safe} narrativeMode={useAi} vm={vm} />
      <DefenseSecurity        settlement={safe} narrativeMode={useAi} vm={vm} />
      <ServicesInstitutions   settlement={safe} narrativeMode={useAi} vm={vm} />
      <ResourcesProduction    settlement={safe} narrativeMode={useAi} vm={vm} />
      <ViabilityAssessment    settlement={safe} narrativeMode={useAi} vm={vm} />
      <HistoryFounding        settlement={safe} narrativeMode={useAi} vm={vm} />
      <NotableNPCs            settlement={safe} narrativeMode={useAi} vm={vm} />
      <PlotHooks              settlement={safe} narrativeMode={useAi} vm={vm} />
      <Relationships          settlement={safe} narrativeMode={useAi} vm={vm} />
      {useAi && <AIAppendix   settlement={safe} narrativeMode={useAi} vm={vm} />}
    </Document>
  );
}

export default SettlementPDF;
