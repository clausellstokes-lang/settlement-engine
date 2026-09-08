/**
 * foundryFaithGate.test.js — W-Session. THE Foundry export "Faith & War"
 * premium/campaign gate — the constitutional mirror of
 * tests/pdf/faithWarGate.test.js for the module export channel.
 *
 * The non-negotiable privacy guarantee: a FREE / LAPSED / ANON export must
 * NEVER carry the Faith & War journal page — and so never a deity name —
 * even for a canonized, deity-carrying settlement. The Foundry pipeline uses
 * the LITERAL faithChapterVisible predicate (src/pdf/variants.js), so the two
 * export formats share one gate; these tests additionally pin the guarantee
 * STRING-LEVEL over the full emitted module file set: no gate ⇒ the deity
 * name appears nowhere in any byte the user downloads.
 */
import { describe, it, expect } from 'vitest';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { buildFoundryModuleFiles } from '../../src/foundry/moduleBuilder.js';

const DEITY_NAME = 'Varisha the Ember Crown';

const deitySettlement = () => ({
  id: 's_ab12cd34ef567890',
  name: 'Emberhold',
  tier: 'town',
  population: 2400,
  npcs: [
    {
      name: 'Serah Voss', role: 'Captain of the Watch', power: 85,
      goal: { short: 'hold the wall' },
      secret: { what: 'owes a debt to smugglers', stakes: 'exposure means the noose' },
      plotHooks: ['A midnight muster nobody ordered'],
    },
    { name: 'Old Tam', role: 'Innkeep', power: 20 },
  ],
  config: {
    primaryDeitySnapshot: {
      name: DEITY_NAME, rankAxis: 'major', alignmentAxis: 'evil',
      temperamentAxis: 'warlike', domain: 'forge and conquest',
    },
  },
});

// A canon event log carrying the deity event kinds whose generated narration
// EMBEDS the deity name (registry SET_PRIMARY_DEITY/IMPOSE_CULT narrate) —
// the Timeline leak channel the gate must also close.
const deityEventLog = () => [
  {
    event: { type: 'ADD_INSTITUTION', description: 'A granary is raised' },
    narrativeSummary: 'The granary rises by the river ward.',
  },
  {
    event: { type: 'SET_PRIMARY_DEITY', description: `${DEITY_NAME} is proclaimed` },
    narrativeSummary: `${DEITY_NAME} is proclaimed the settlement's patron deity.`,
  },
];

const vmFor = (phase = 'canon', eventLog = []) =>
  buildViewModel({ settlement: deitySettlement(), phase, eventLog });

const pageNames = (pages) => pages.map(p => p.name);

describe('buildJournalPages — the premium/campaign gate', () => {
  it('a free / lapsed / anon export (faithUnlocked=false) NEVER emits the page', () => {
    const pages = buildJournalPages(vmFor(), { variant: 'canon_dossier', faithUnlocked: false });
    expect(pageNames(pages)).not.toContain('Faith & War');
  });

  it('the default (no faithUnlocked passed) is the safe one — no page', () => {
    const pages = buildJournalPages(vmFor(), { variant: 'canon_dossier' });
    expect(pageNames(pages)).not.toContain('Faith & War');
  });

  it('a premium export of a canon settlement with a live slice emits the page', () => {
    const vm = vmFor();
    expect(vm.liveWorld).not.toBeNull(); // the deity keeps the slice live
    const pages = buildJournalPages(vm, { variant: 'canon_dossier', faithUnlocked: true });
    expect(pageNames(pages)).toContain('Faith & War');
  });

  it('is canon-only — a draft-phase export never emits it even for premium', () => {
    const pages = buildJournalPages(vmFor('draft'), { variant: 'canon_dossier', faithUnlocked: true });
    expect(pageNames(pages)).not.toContain('Faith & War');
  });

  it('is variant-gated — draft_brief / timeline_packet never include it', () => {
    for (const variant of ['draft_brief', 'timeline_packet']) {
      const pages = buildJournalPages(vmFor(), { variant, faithUnlocked: true });
      expect(pageNames(pages), variant).not.toContain('Faith & War');
    }
  });

  it('a dormant settlement (no deity, no campaign) emits no page even for premium', () => {
    const vm = buildViewModel({
      settlement: { id: 's2', name: 'Quiet Vale', config: {} }, phase: 'canon',
    });
    expect(vm.liveWorld).toBeNull();
    const pages = buildJournalPages(vm, { variant: 'canon_dossier', faithUnlocked: true });
    expect(pageNames(pages)).not.toContain('Faith & War');
  });
});

describe('the Timeline page — the event-log leak channel is gated too', () => {
  it('a free export drops deity-event entries; non-faith events survive', () => {
    const vm = vmFor('canon', deityEventLog());
    const pages = buildJournalPages(vm, { variant: 'canon_dossier', faithUnlocked: false });
    const timeline = pages.find(p => p.name === 'Timeline');
    expect(timeline).toBeTruthy();
    expect(timeline.markdown).toContain('granary');
    expect(timeline.markdown).not.toContain(DEITY_NAME);
  });

  it('a premium export keeps the deity events on the timeline', () => {
    const vm = vmFor('canon', deityEventLog());
    const pages = buildJournalPages(vm, { variant: 'canon_dossier', faithUnlocked: true });
    const timeline = pages.find(p => p.name === 'Timeline');
    expect(timeline.markdown).toContain(DEITY_NAME);
  });
});

describe('module file set — the guarantee holds STRING-LEVEL over every emitted byte', () => {
  it('a free/anon export of the deity settlement contains the deity name NOWHERE — even with deity events in the log', () => {
    const settlement = deitySettlement();
    const vm = buildViewModel({ settlement, phase: 'canon', eventLog: deityEventLog() });
    // The gate — not a data absence — is what protects privacy:
    expect(vm.liveWorld?.deity?.name).toBe(DEITY_NAME);
    const { files } = buildFoundryModuleFiles({ settlement, vm, variant: 'canon_dossier', faithUnlocked: false });
    for (const f of files) {
      expect(String(f.data), f.path).not.toContain(DEITY_NAME);
    }
  });

  it('a premium canon export carries the deity name in the journal data (proving the gate, not absence, is load-bearing)', () => {
    const settlement = deitySettlement();
    const vm = buildViewModel({ settlement, phase: 'canon' });
    const { files } = buildFoundryModuleFiles({ settlement, vm, variant: 'canon_dossier', faithUnlocked: true });
    const journals = files.find(f => f.path.endsWith('data/journals.json'));
    expect(String(journals.data)).toContain(DEITY_NAME);
  });
});
