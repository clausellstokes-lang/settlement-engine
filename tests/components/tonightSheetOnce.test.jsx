/** @vitest-environment jsdom */
/**
 * X-51 (the owner, 2026-11-03): "There should be one consolidated dub it tonight sheet".
 *
 * Sixty fresh settlements, ten per tier, rendered through every surface that carries the sheet:
 * the Table View, Session Mode, the PDF chapter and the Foundry journal page. On each:
 *   - the sheet renders exactly once, and the old Quick Guide and "Tonight at the table" do not
 *     render beside it;
 *   - its first line names the active crisis (its label and the settlement's name);
 *   - every value it prints is on the record: the people are the record's NPCs, each line is
 *     that NPC's own secret or want (a person voiced from the crisis cast: their role's want, RUNG2-F13), the hooks are the record's hooks, the food band is the food
 *     record's band, and none of the old invented fallbacks print.
 */
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {
    auth: { tier: 'premium' }, isElevated: () => false, phase: 'draft', systemState: null,
    eventLog: [], campaigns: [], savedSettlements: [],
  };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  return { useStore };
});

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import TableView from '../../src/components/TableView.jsx';
import SessionMode from '../../src/components/session/SessionMode.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { TonightAtTheTable } from '../../src/pdf/sections/TonightAtTheTable.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { castWantOf, composeTonightSheet, TONIGHT_COPY } from '../../src/domain/summary/tonightSheet.js';
import { firstRankMembershipOf, powerOrderOf } from '../../src/domain/people/membership.js';
import { effectiveCastOf } from '../../src/domain/crisis/crisisCast.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { FOOD_SECURITY_BANDS } from '../../src/data/bandLadders.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'mediterranean', 'norse', 'celtic', 'slavic'];
const SEEDS = Array.from({ length: 60 }, (_, i) => ({
  seed: `x51-tonight-${i}`,
  config: { settType: TIERS[i % TIERS.length], culture: CULTURES[i % CULTURES.length] },
}));

/** The old sheets' own words, and the fallbacks they printed that no record holds. */
const OLD_SHEETS = [/Settlement quick guide/i, /Tonight at the table/i, /Three faces to remember/i];
const INVENTED = [/NPCs go cold mid-sentence/i, /leverage tonight.s table/i, /\bmajor NPC\b/i, /Unnamed (NPC|person)/i, /Notable local/i];

/** Every leaf string of an element tree, executing the hook-free PDF components. */
function deepText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) deepText(c, out); return out; }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') { deepText(node.type(node.props || {}), out); return out; }
  return deepText(node.props?.children, out);
}

/** The role wants a cast person may voice: castWantOf for each (crisis, role) the record casts this NPC in. */
const castLinesOf = (s, npc) => {
  const id = String(npc.id || npc.name || '');
  return (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean).flatMap((entry) => {
    const cast = effectiveCastOf(s, entry).cast;
    return (cast?.roles || []).filter((r) => r.kind === 'npc' && r.id === id)
      .map((r) => castWantOf(r.role, r.id, String(entry.type || ''), '', String(firstRankMembershipOf(npc, powerOrderOf(s))?.power || ''))) // SW-6 (#40): re-keyed by identity — the want now reads the person's house
      .filter(Boolean);
  });
};

/** Lower-led, unclosed: the form every arm of the oracle compares in. */
const bare = (x) => String(x || '').replace(/[.!?]$/, '').toLowerCase();

/**
 * The oracle for one voiced person: null where the line is on the record, else the miss. The arms are R11's ruled
 * order (tonightSheet.js :: voicedLineOf): the cast role's want, the person's own want, their secret, and (d) their
 * temperament. Arm (d), the chair's ruling of 2026-11-12 on the fourth seat's parked item 2: the composer is as ruled
 * and the oracle lagged it (x51-tonight-51: the seat-holder is the insurgency's target and keeps its own secret, so
 * RUNG2-F13 withholds it and step (d) voices the temperament). The oracle accepts the temperament ONLY where the sheet
 * says 'temperament' AND the line is the record's own `personality.dominant`: a re-key to the ruled design by identity.
 */
const personMissOf = (seed, settlement, p) => {
  const npc = (settlement.npcs || []).find((n) => n.name === p.name);
  if (!npc) return `${seed}: ${p.name} is not on the roster`;
  const goal = bare(String(npc.goal?.short || npc.goal?.long || '').replace(/^to\s+/i, ''));
  const secret = bare(npc.secret?.what);
  const line = bare(p.line);
  // A person voiced FROM THE CRISIS CAST wants what the ROLE wants: their line is the castWantOf line for their
  // own role, crisis and id (the role's CAST_WANTS pool; their own goal where the role has none). Added at
  // 1e28faf1f (lane RUNG2-F13 unit 3, CRISIS-CAST-SENSE, the chair's ruling rung 2 §3c), which composes that
  // line at render; measured: this arm green at 1e28faf1f^ (f7127dd20), red at 1e28faf1f (12 cast lines at the
  // tip, every one a CAST_WANTS line). Every other person still prints their own want or secret.
  const castLine = p.why === 'cast' ? castLinesOf(settlement, npc).map(bare) : [];
  const dominant = typeof npc.personality === 'object' && npc.personality ? npc.personality.dominant : undefined;
  const temperament = p.says === 'temperament' && typeof dominant === 'string' && dominant !== '' ? bare(dominant) : null;
  if (p.line && line !== goal && line !== secret && !castLine.includes(line) && line !== temperament) {
    return `${seed}: ${p.name}'s line is neither their want nor their secret${p.says === 'temperament' ? ' nor their temperament' : ''}: ${p.line}`;
  }
  return null;
};

const crisisLabels = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : [])
  .filter(Boolean).map((x) => x.label).filter(Boolean);

const ROWS = [];
beforeAll(() => {
  for (const { seed, config } of SEEDS) {
    const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const surfaces = {};
    {
      const { container } = render(<TableView settlement={settlement} onClose={() => {}} />);
      const sheets = [...container.querySelectorAll('[data-tonight-sheet]')];
      surfaces.table = { count: sheets.length, all: container.textContent, first: sheets[0]?.firstElementChild?.textContent || '' };
      cleanup();
    }
    {
      const { container } = render(<SessionMode settlement={settlement} saveId={null} onClose={() => {}} />);
      const sheets = [...container.querySelectorAll('[data-tonight-sheet]')];
      surfaces.session = { count: sheets.length, all: container.textContent, first: sheets[0]?.firstElementChild?.textContent || '' };
      cleanup();
    }
    const vm = buildViewModel({ settlement });
    const pdf = deepText(TonightAtTheTable({ settlement, narrativeMode: false, vm }));
    // the chapter's first line is the one after its title band (the running header carries the name)
    const band = pdf.indexOf(TONIGHT_COPY.title);
    surfaces.pdf = { count: pdf.filter((t) => t === TONIGHT_COPY.title).length, all: pdf.join(' '), first: band < 0 ? '' : pdf.slice(band + 1, band + 3).join(' ') };
    const page = buildJournalPages(vm).find((p) => JSON.stringify(p).includes(`"${TONIGHT_COPY.title}"`));
    // the journal escapes markdown; read it as the DM reads it
    const journal = String(page?.markdown || '').replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/\\([\\`*_{}[\]()#+\-.!|>~])/g, '$1');
    surfaces.journal = { count: page ? 1 : 0, all: journal, first: journal.split('\n').slice(0, 2).join(' ') };
    ROWS.push({ seed, settlement, sheet: composeTonightSheet(settlement), surfaces });
  }
}, 600000);
afterEach(cleanup);

describe('X-51: one Tonight sheet', () => {
  test('each surface renders the Tonight sheet exactly once, with neither old sheet beside it', () => {
    const offenders = [];
    for (const { seed, surfaces } of ROWS) {
      for (const [name, s] of Object.entries(surfaces)) {
        if (s.count !== 1) offenders.push(`${seed} / ${name}: the sheet renders ${s.count} times`);
        for (const re of OLD_SHEETS) if (re.test(s.all)) offenders.push(`${seed} / ${name}: an old sheet prints (${re})`);
      }
    }
    expect(offenders, offenders.slice(0, 20).join('\n')).toEqual([]);
  });

  test('the sheet opens on the active crisis: its first line names the crisis and the settlement', () => {
    const offenders = [];
    let crises = 0;
    for (const { seed, settlement, surfaces } of ROWS) {
      const labels = crisisLabels(settlement);
      if (labels.length === 0) continue;
      crises += 1;
      for (const [name, s] of Object.entries(surfaces)) {
        if (!labels.every((l) => s.first.includes(l)) || !s.first.includes(settlement.name)) {
          offenders.push(`${seed} / ${name}: first line "${s.first.slice(0, 120)}" misses ${labels.join(', ')} in ${settlement.name}`);
        }
      }
    }
    expect(crises, 'the sixty seeds carried almost no crisis').toBeGreaterThan(10);
    expect(offenders, offenders.slice(0, 20).join('\n')).toEqual([]);
  });

  test('no field the sheet prints is absent from the record, and no invented fallback prints', () => {
    const offenders = [];
    let people = 0;
    for (const { seed, settlement, sheet, surfaces } of ROWS) {
      for (const p of sheet.people) {
        people += 1;
        const miss = personMissOf(seed, settlement, p);
        if (miss) offenders.push(miss);
      }
      const hookTexts = collectPlotHooks(settlement).map((h) => String(h.text).replace(/[.!?]$/, '').toLowerCase());
      for (const h of sheet.hooks) {
        if (!hookTexts.includes(h.text.replace(/[.!?]$/, '').toLowerCase())) offenders.push(`${seed}: hook not on the record: ${h.text}`);
      }
      const food = sheet.facts.find((f) => f.id === 'food');
      const record = settlement.economicState?.foodSecurity?.foodRecord;
      const band = record?.band;
      // RE-KEYED BY IDENTITY (R2-CODE-B-3 item 2b, the chair's ruling: a label of plenty never stands beside a deficit): the
      // record's own band word, except where the record makes it false — "Secure"/"Surplus" with a share of the need unmet
      // (gapPct > 0) reads the ladder's "Pressured"; "Import-Dependent" with no food brought in by trade reads "Deficit".
      const ruled = (band === 'secure' || band === 'surplus') && Number(record?.gapPct) > 0 ? 'pressured'
        : band === 'importDependent' && record?.normalImportPct === 0 ? 'deficit' : band;
      if (food && !food.text.startsWith(`${FOOD_SECURITY_BANDS[ruled]?.label ?? '\u0000'}.`)) offenders.push(`${seed}: food fact misreads the band ${band}: ${food.text}`);
      for (const [name, s] of Object.entries(surfaces)) {
        for (const re of INVENTED) if (re.test(s.all)) offenders.push(`${seed} / ${name}: invented fallback prints (${re})`);
        for (const p of sheet.people) if (!s.all.includes(p.name)) offenders.push(`${seed} / ${name}: ${p.name} is composed but not printed`);
      }
    }
    expect(people, 'the sheet voiced almost no one').toBeGreaterThan(90);
    expect(offenders, offenders.slice(0, 20).join('\n')).toEqual([]);
  });

  // The arm (d) is not a loosening: planted, a temperament that is not the record's own, or the record's own temperament
  // printed as a want, is red; the true one is green (x51-tonight-51, the seat-holder the chair's ruling names).
  test('arm (d) holds by identity: a wrong temperament, or the temperament said as a want, is red', () => {
    const row = ROWS.find((r) => r.seed === 'x51-tonight-51');
    const voiced = row.sheet.people.find((p) => p.says === 'temperament');
    expect(voiced, 'x51-tonight-51 voices no one by temperament').toBeTruthy();
    const npc = row.settlement.npcs.find((n) => n.name === voiced.name);
    expect(bare(voiced.line)).toBe(bare(npc.personality.dominant));
    expect(personMissOf(row.seed, row.settlement, voiced)).toBe(null);
    const wrong = npc.personality.dominant === 'Cold and calculating' ? 'Warm-hearted.' : 'Cold and calculating.';
    expect(personMissOf(row.seed, row.settlement, { ...voiced, line: wrong })).toMatch(/nor their temperament/);
    expect(personMissOf(row.seed, row.settlement, { ...voiced, says: 'want' })).toMatch(/neither their want nor their secret/);
  });
});
