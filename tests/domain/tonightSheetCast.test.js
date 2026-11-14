/**
 * tests/domain/tonightSheetCast.test.js — the readers of the crisis record (docs/DESIGN_CRISIS_TAB.md,
 * "The surfaces that read it"): the Tonight sheet's crisis line takes its person from the cast (the
 * instigator for a social or engineered kind, the one who bears the brunt for a natural or external
 * one; the worst crisis first, a later crisis's person only when different), its three people to
 * voice come from the cast in the fixed order (instigator or brunt, lever, exploiter or defender)
 * before the seat, secret and cleric, and the print block and the journal page print the cast the
 * Crisis tab shows. 120 seeds: half random stress, half forced pairs (the first seat's corpus).
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';
import { composeCrisisPage } from '../../src/domain/crisis/crisisPage.js';
import { effectiveCastOf, CAST_EDIT_PATH } from '../../src/domain/crisis/crisisCast.js';
import { esc, buildJournalPages } from '../../src/foundry/journalPages.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { CrisisSections } from '../../src/pdf/sections/CrisisSections.jsx';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { institutionHouseLabel } from '../../src/domain/display/institutionDisplayName.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KINDS = Object.keys(STRESS_TYPE_MAP);
const LINE_ROLES = { social: ['instigator', 'target'], engineered: ['instigator', 'target'], natural: ['brunt', 'lever'], external: ['brunt', 'defender', 'face', 'treater'] };
const entriesOf = (s) => (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean);
const SEEDS = Array.from({ length: 120 }, (_, i) => `tonight-cast-${i}`);
const townFor = (seed, i) => (i % 2 === 0
  ? generateSettlementPipeline({ settType: TIERS[i % TIERS.length] }, null, { seed, customContent: {} })
  : generateSettlementPipeline({ settType: TIERS[i % TIERS.length], stressTypes: [KINDS[i % KINDS.length], KINDS[(i * 5 + 2) % KINDS.length]].filter((k, j, a) => a.indexOf(k) === j) }, null, { seed, customContent: {} }));
const linePersonOf = (cast) => {
  for (const role of LINE_ROLES[cast.nature] || []) {
    const row = cast.roles.find((r) => r.role === role && r.kind === 'npc');
    if (row) return row.name;
  }
  return null;
};
/** Every string in a react element tree (react-pdf's Text children), in order. */
const textsOf = (node) => {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') return [String(node)];
  if (Array.isArray(node)) return node.flatMap(textsOf);
  return textsOf(node.props?.children);
};

describe('the Tonight sheet reads the crisis cast', () => {
  it('120 towns: the Tonight line names a person for every crisis whose cast has one, and the people to voice lead with the cast', () => {
    let crises = 0;
    let named = 0;
    let castVoiced = 0;
    const failures = collectSeedFailures(SEEDS, (seed, i) => {
      const s = townFor(seed, i);
      const sheet = composeTonightSheet(s);
      const entries = entriesOf(s);
      for (const e of entries) {
        crises += 1;
        const who = linePersonOf(effectiveCastOf(s, e).cast);
        if (!who) continue;
        named += 1;
        if (!sheet.opening.includes(who)) throw new Error(`${e.type}: "${sheet.opening}" does not name ${who}`);
      }
      if (sheet.people.length > 3) throw new Error(`${sheet.people.length} people to voice`);
      const first = [...entries].sort((a, b) => a.cast.rank - b.cast.rank)[0];
      if (first) {
        const lead = first.cast.roles.find((r) => (r.role === 'instigator' || r.role === 'brunt') && r.kind === 'npc');
        if (lead && sheet.people[0]?.name !== lead.name) throw new Error(`the first person to voice is ${sheet.people[0]?.name}, not the cast's ${lead.role} ${lead.name}`);
      }
      castVoiced += sheet.people.filter((p) => p.why === 'cast').length;
      for (const p of sheet.people) if (p.why === 'cast' && !p.castLabel) throw new Error(`${p.name} is voiced from the cast with no role`);
    });
    expectNoSeedFailures(failures, 'the Tonight line and the people to voice over 120 towns');
    expect(crises).toBeGreaterThan(60);
    expect(named).toBeGreaterThan(crises / 2);
    expect(castVoiced).toBeGreaterThan(0);
  }, 300000);

  it('the DM\'s word is the sheet\'s: an edited cast names the DM\'s person', () => {
    const s = generateSettlementPipeline({ settType: 'town', stressTypes: ['famine'] }, null, { seed: 'tonight-cast-dm', customContent: {} });
    const [entry] = entriesOf(s);
    const who = s.npcs.find((n) => n.name && !n.ousted && !entry.cast.roles.some((r) => r.id === n.id));
    entry._userEdits = { [CAST_EDIT_PATH]: { value: `brunt=npc:${who.id}`, editedAt: '2026-11-03T00:00:00Z' } };
    const sheet = composeTonightSheet(s);
    expect(sheet.crisis.person).toBe(who.name);
    expect(sheet.opening).toContain(who.name);
    expect(sheet.people[0]).toMatchObject({ name: who.name, why: 'cast' });
  });

  it('a crisis-free town\'s sheet is unchanged: no person, no cast voice', () => {
    const s = generateSettlementPipeline({ settType: 'village', selectedStressesRandom: false, selectedStresses: [] }, null, { seed: 'tonight-cast-calm', customContent: {} });
    const sheet = composeTonightSheet(s);
    expect(s.stress).toBeNull();
    expect(sheet.crisis).toBeNull();
    expect(sheet.people.filter((p) => p.why === 'cast')).toEqual([]); // anchored: s.stress is pinned null above
  });
});

describe('the print block and the journal page print the Crisis tab\'s cast', () => {
  it('every cast name and reason of every crisis prints on both, from the one composer', () => {
    const failures = collectSeedFailures(SEEDS.slice(0, 24), (seed, i) => {
      const s = townFor(seed, i);
      const page = composeCrisisPage(s);
      const journal = buildJournalPages(buildViewModel({ settlement: s }), { settlement: s });
      const crisisPage = journal.find((p) => p.name === 'Crisis');
      const printed = textsOf(CrisisSections({ settlement: s })).join('\n');
      if (!page.length) {
        if (crisisPage) throw new Error('a calm town carries a Crisis journal page');
        if (printed) throw new Error('a calm town prints a crisis block');
        return;
      }
      if (!crisisPage) throw new Error('no Crisis journal page');
      for (const section of page) {
        for (const r of section.cast) {
          // 2026-11-07 PEOPLE-1 CAST: the journal page is MARKDOWN, and the cast now surfaces names the rung roster
          // never did — a HOUSE row "Inns and taverns (district)" and a person "Nessa O'Dwyer" — whose parentheses and
          // apostrophes the page escapes; the comparison reads the page with its escapes removed, the claim unchanged.
          // RE-KEYED (R2-CODE-B round 3, ruling (a)): the journal names a HOUSE row by its label too (moved up).
          const shown = r.kind === 'institution' ? institutionHouseLabel(r.name) : r.name;
          if (!crisisPage.markdown.includes(esc(shown))) throw new Error(`journal misses ${r.name}`);
          // re-keyed by identity (SW-9b-B A13): the print reads as the tab does, "{role}: {name} · {reason}" (the reason a
          // fragment, never a sentence after a full stop).
          // RE-KEYED (R2-CODE-B round 3, ruling (a)): a HOUSE row prints by the house's label, as the tab's door does.
          if (!printed.includes(`${r.roleLabel}: ${shown} · ${r.reason}`)) throw new Error(`print misses ${r.roleLabel} ${r.name}`);
        }
        if (!printed.includes(section.line)) throw new Error(`print misses ${section.line}`);
      }
    });
    expectNoSeedFailures(failures, 'print and journal agree with the record');
  }, 300000);
});
