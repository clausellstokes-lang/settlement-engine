// @vitest-environment node
/**
 * fullPdf.render.test.jsx — the REAL PDF render lane (F36).
 *
 * The sibling fullPdf.smoke.test.js only calls React.createElement(SettlementPDF,
 * props). createElement builds a descriptor; it never executes the component, so
 * those tests pass even if SettlementPDF (or any chapter) throws on render. The
 * paid deliverable — the actual PDF bytes — was therefore never exercised by any
 * test: the top-level variant gating, ToC assembly, isFounder/isAnonymous wiring,
 * and ~12 chapter components never ran as functions.
 *
 * This lane renders SettlementPDF END TO END to a PDF buffer, in the node
 * environment (fontkit + @react-pdf need real filesystem font access — see the
 * font re-registration below), against real pipeline-generated settlements, for
 * all three export variants. It also renders every one of the twelve previously
 * unexecuted section components individually so a crash in any single chapter is
 * caught even when the full-document path happens to gate it out.
 *
 * Assertions that bite:
 *   - %PDF- magic header + non-trivial byte length (a broken render throws or
 *     yields an empty/short buffer).
 *   - Page count per variant above a floor, AND the full variants produce many
 *     more pages than the lean timeline_packet — this pins the variant gating
 *     (if timeline_packet stopped gating chapters out, or a full variant stopped
 *     including them, the relation breaks).
 *   - Every listed section lays out to a valid PDF buffer against real data.
 */
import { describe, test, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToBuffer, Font, Document, Page } from '@react-pdf/renderer';

import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';

// The twelve section components the smoke test never executed.
import { TableOfContents } from '../../src/pdf/sections/TableOfContents.jsx';
import { TonightAtTheTable } from '../../src/pdf/sections/TonightAtTheTable.jsx';
import { NPCQuickRef } from '../../src/pdf/sections/NPCQuickRef.jsx';
import { NotableNPCs } from '../../src/pdf/sections/NotableNPCs.jsx';
import { PlotHooks } from '../../src/pdf/sections/PlotHooks.jsx';
import { Services } from '../../src/pdf/sections/Services.jsx';
import { Institutions } from '../../src/pdf/sections/Institutions.jsx';
import { HistoryFounding } from '../../src/pdf/sections/HistoryFounding.jsx';
import { Relationships } from '../../src/pdf/sections/Relationships.jsx';
import { Timeline } from '../../src/pdf/sections/Timeline.jsx';
import { SystemStateSnapshot } from '../../src/pdf/sections/SystemStateSnapshot.jsx';
import { SupplyChainFlow } from '../../src/pdf/sections/SupplyChainFlow.jsx';

// ── Font re-registration (node) ──────────────────────────────────────────────
// theme.js (pulled in transitively by SettlementPDF) registers Lora/Nunito with
// browser URL sources ("/fonts/Lora-Regular.ttf?v=2"). In node, fontkit tries to
// open that literal path on disk and fails with ENOENT. The real TTFs ship under
// public/fonts/. Empty the two custom families' source lists (register() appends,
// resolve() returns the FIRST match, so the browser paths would otherwise win)
// and re-register them from disk. Standard fonts (Helvetica) are left untouched.
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FONT = (name) => path.join(REPO_ROOT, 'public', 'fonts', name);
const registeredFonts = Font.getRegisteredFonts();
if (registeredFonts.Lora) registeredFonts.Lora.sources = [];
if (registeredFonts.Nunito) registeredFonts.Nunito.sources = [];
Font.register({
  family: 'Lora',
  fonts: [
    { src: FONT('Lora-Regular.ttf'), fontWeight: 400 },
    { src: FONT('Lora-Bold.ttf'), fontWeight: 700 },
    { src: FONT('Lora-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
    { src: FONT('Lora-BoldItalic.ttf'), fontWeight: 700, fontStyle: 'italic' },
  ],
});
Font.register({
  family: 'Nunito',
  fonts: [
    { src: FONT('Nunito-Regular.ttf'), fontWeight: 400 },
    { src: FONT('Nunito-Bold.ttf'), fontWeight: 700 },
    { src: FONT('Nunito-ExtraBold.ttf'), fontWeight: 800 },
    { src: FONT('Nunito-Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
  ],
});

const VARIANTS = ['canon_dossier', 'draft_brief', 'timeline_packet'];

// Minimum page count expected per variant. Observed at authoring time (town +
// metropolis, canon phase, one event): canon_dossier ~32-33p, draft_brief ~31-32p,
// timeline_packet ~4p. Floors sit well below observed so ordinary content drift
// doesn't flake, but a variant that renders far too few pages (a chapter or the
// whole body silently dropping out) trips.
const PAGE_FLOOR = { canon_dossier: 12, draft_brief: 12, timeline_packet: 2 };

// Synthetic canon history so the Timeline + SystemStateSnapshot chapters render
// their real bodies (not the "unavailable" shells) in the full-document lane.
const EVENT_LOG = [
  {
    narrativeSummary: 'A bandit warband tested the eastern palisade.',
    appliedAt: Date.UTC(2026, 3, 12, 9, 30),
    event: { type: 'raid', description: 'Outriders probed the approaches at dawn.', inWorldDate: 'Spring, 12th of Thawmonth' },
    deltas: [
      { explanation: 'Resilience fell as stores were spent on the muster', before: 62, after: 51 },
      { explanation: 'External threat climbed', before: 30, after: 44 },
    ],
    factionResponses: [
      { factionName: 'The Town Watch', response: 'Doubled the night rotation.', hookSeed: 'Who tipped the raiders to the gap in the wall?' },
    ],
  },
];

const PDF_MAGIC = '%PDF-';

/** %PDF- header + latin1 body (safe for the byte-scanning regexes below). */
function pdfInfo(buf) {
  expect(Buffer.isBuffer(buf) || buf instanceof Uint8Array).toBe(true);
  const body = Buffer.from(buf).toString('latin1');
  return { bytes: buf.length, head: body.slice(0, 5), body };
}

/** Count page objects in the PDF. "/Type /Page" but not "/Type /Pages" (the page
 *  tree node) — dependency-free structural read of the byte stream. */
function countPages(body) {
  return (body.match(/\/Type\s*\/Page(?!s)/g) || []).length;
}

async function renderVariant(settlement, systemState, variant) {
  const doc = React.createElement(SettlementPDF, {
    settlement,
    systemState,
    eventLog: EVENT_LOG,
    phase: 'canon',
    variant,
    isFounder: true,
    isAnonymous: true,
  });
  return renderToBuffer(doc);
}

// ── Fixtures ────────────────────────────────────────────────────────────────
// Generated ONCE and reused across the whole lane (variants + per-section lane).
let townSettlement, townState, townVm;
let metroSettlement, metroState;
let sparseSettlement;

beforeAll(() => {
  // Stressed river town — mid-tier, chain-bearing, most-restructured chapters.
  townSettlement = normalizeSettlement(
    generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' },
      null,
      { seed: 'pdf-render-town-2026', customContent: {} },
    ),
  );
  townState = deriveSystemState(townSettlement);
  townVm = buildViewModel({ settlement: townSettlement, systemState: townState, eventLog: EVENT_LOG, phase: 'canon' });

  // Metropolis — largest tier, exercises the town-plus supply-chain grouping.
  metroSettlement = normalizeSettlement(
    generateSettlementPipeline(
      { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
      null,
      { seed: 'pdf-render-metro-2026', customContent: {} },
    ),
  );
  metroState = deriveSystemState(metroSettlement);

  // Threadbare pre-canonical save — the shape a legacy load produces. Must still
  // render a full-document dossier without crashing.
  sparseSettlement = normalizeSettlement({ name: 'Sparse Thorp', tier: 'thorp', population: 40 });
});

// ── Lane A: full-document render, every variant × real settlements ───────────
describe('SettlementPDF full-document render lane', () => {
  const cases = [
    ['stressed town', () => ({ settlement: townSettlement, state: townState })],
    ['metropolis', () => ({ settlement: metroSettlement, state: metroState })],
  ];

  for (const [label, get] of cases) {
    describe(`${label}`, () => {
      const buffers = {};

      test.each(VARIANTS)('%s renders to a valid PDF above its page floor', async (variant) => {
        const { settlement, state } = get();
        const buf = await renderVariant(settlement, state, variant);
        const { bytes, head, body } = pdfInfo(buf);
        expect(head, `${label}/${variant} is not a PDF`).toBe(PDF_MAGIC);
        expect(bytes, `${label}/${variant} buffer suspiciously small`).toBeGreaterThan(3000);
        const pages = countPages(body);
        expect(pages, `${label}/${variant} page count ${pages} below floor ${PAGE_FLOOR[variant]}`)
          .toBeGreaterThanOrEqual(PAGE_FLOOR[variant]);
        buffers[variant] = pages;
      });

      test('variant gating: full variants dwarf the lean timeline_packet', () => {
        // Runs after the test.each above (declaration order). If gating broke —
        // timeline_packet stopped dropping chapters, or a full variant stopped
        // including them — this relation collapses.
        expect(buffers.canon_dossier).toBeGreaterThan(buffers.timeline_packet + 4);
        expect(buffers.draft_brief).toBeGreaterThan(buffers.timeline_packet + 4);
        // canon_dossier carries the Timeline chapter draft_brief omits, so it is
        // never shorter than the draft.
        expect(buffers.canon_dossier).toBeGreaterThanOrEqual(buffers.draft_brief);
      });
    });
  }

  test('a sparse / pre-canonical settlement still renders a full canon dossier', async () => {
    const buf = await renderVariant(sparseSettlement, deriveSystemState(sparseSettlement), 'canon_dossier');
    const { bytes, head } = pdfInfo(buf);
    expect(head).toBe(PDF_MAGIC);
    expect(bytes).toBeGreaterThan(3000);
  });
});

// ── Lane B: every previously-unexecuted section renders individually ─────────
// One row per section. A brand-new chapter that nobody wires into this list is a
// visible gap; a chapter that throws on layout fails its own row (rather than
// being masked by whichever variant happened to gate it out).
//
// kind:
//   'page' — component returns a <Page> (via PageChrome); wrap in <Document>.
//   'view' — component returns a <View> fragment; wrap in <Document><Page>.
const SAMPLE_TOC = [
  { no: '01', title: 'Overview', note: 'systems' },
  { no: '02', title: 'Tonight at the Table', note: 'quick prep' },
  { no: '05', title: 'Plot Hooks & Quests' },
];

const SECTIONS = [
  ['TableOfContents', TableOfContents, 'page'],
  ['TonightAtTheTable', TonightAtTheTable, 'page'],
  ['NPCQuickRef', NPCQuickRef, 'page'],
  ['NotableNPCs', NotableNPCs, 'page'],
  ['PlotHooks', PlotHooks, 'page'],
  ['Services', Services, 'page'],
  ['Institutions', Institutions, 'page'],
  ['HistoryFounding', HistoryFounding, 'page'],
  ['Relationships', Relationships, 'page'],
  ['Timeline', Timeline, 'page'],
  ['SystemStateSnapshot', SystemStateSnapshot, 'page'],
  ['SupplyChainFlow', SupplyChainFlow, 'view'],
];

function sectionProps(name) {
  if (name === 'TableOfContents') {
    return { settlement: townSettlement, narrativeMode: false, entries: SAMPLE_TOC };
  }
  if (name === 'SupplyChainFlow') {
    // Metropolis maximizes the town-plus grouping branch. Falls back to the town
    // if the metropolis produced no chains for the seed.
    const src = metroSettlement?.economicState?.activeChains?.length ? metroSettlement : townSettlement;
    return {
      chains: src?.economicState?.activeChains || [],
      instNames: (src?.institutions || []).map((inst) => inst.name || ''),
      primaryExports: src?.economicState?.primaryExports || [],
      tier: src?.tier,
    };
  }
  // Timeline + SystemStateSnapshot read vm.eventLog / vm.systemState; townVm
  // carries both (built with the canon systemState + EVENT_LOG in beforeAll).
  return { settlement: townSettlement, narrativeMode: false, vm: townVm };
}

describe('every listed section renders individually to a valid PDF', () => {
  test.each(SECTIONS)('%s executes and lays out against real data', async (name, Component, kind) => {
    const props = sectionProps(name);
    const element = React.createElement(Component, props);
    const doc = kind === 'view'
      ? React.createElement(Document, null, React.createElement(Page, null, element))
      : React.createElement(Document, null, element);
    const buf = await renderToBuffer(doc);
    const { bytes, head } = pdfInfo(buf);
    expect(head, `${name} did not render a PDF`).toBe(PDF_MAGIC);
    expect(bytes, `${name} produced a suspiciously small buffer`).toBeGreaterThan(800);
  });

  test('the section list covers all twelve chapters the smoke test never executed', () => {
    const listed = SECTIONS.map(([n]) => n).sort();
    const expected = [
      'HistoryFounding', 'Institutions', 'NPCQuickRef', 'NotableNPCs', 'PlotHooks',
      'Relationships', 'Services', 'SupplyChainFlow', 'SystemStateSnapshot',
      'TableOfContents', 'Timeline', 'TonightAtTheTable',
    ].sort();
    expect(listed).toEqual(expected);
  });
});
