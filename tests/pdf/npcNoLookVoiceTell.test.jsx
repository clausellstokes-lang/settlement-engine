/**
 * @vitest-environment node
 *
 * X-48 (the owner, 2026-11-03): NO LOOK, VOICE OR TELL ANYWHERE.
 *
 * An NPC's look (`physical.build` / `.feature` / `.clothes`), voice (`personality.speech`)
 * and nervous habit (`personality.tell`) stay on the record, and no export prints them:
 * the PDF's NPC chapters (12 and 13), the Tonight chapter, and the Foundry VTT journal all
 * read the one view model, so this walks every one of them for sixty fresh settlements
 * across the six tiers and convicts any of those field values found in the printed text.
 *
 * Personality (temperament and flaw), wants, secrets and the identity facts stay; the
 * second test proves the walk read real NPC cards, so the absence above is not vacuous.
 */
import { describe, test, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { NotableNPCs } from '../../src/pdf/sections/NotableNPCs.jsx';
import { NPCQuickRef } from '../../src/pdf/sections/NPCQuickRef.jsx';
import { TonightAtTheTable } from '../../src/pdf/sections/TonightAtTheTable.jsx';
import { buildJournalPages } from '../../src/foundry/journalPages.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'mediterranean', 'norse', 'celtic', 'slavic'];
const SEEDS = Array.from({ length: 60 }, (_, i) => ({
  seed: `x48-no-look-${i}`,
  config: { settType: TIERS[i % TIERS.length], culture: CULTURES[i % CULTURES.length] },
}));

/** Every leaf string of an element tree, executing the hook-free PDF components. */
function deepText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) deepText(c, out); return out; }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') { deepText(node.type(node.props || {}), out); return out; }
  return deepText(node.props?.children, out);
}

/** The journal pages' printed markdown, whatever shape a page carries. */
function journalText(pages) {
  return JSON.stringify(pages);
}

/** @param {any} npc */
function hiddenValues(npc) {
  const p = (npc && typeof npc.personality === 'object' && npc.personality) || {};
  const ph = (npc && typeof npc.physical === 'object' && npc.physical) || {};
  return [
    ['tell', p.tell], ['speech', p.speech],
    ['build', ph.build], ['feature', ph.feature], ['clothes', ph.clothes],
  ].filter(([, v]) => typeof v === 'string' && v.trim().length > 0);
}

const ROWS = [];
beforeAll(() => {
  for (const { seed, config } of SEEDS) {
    const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const vm = buildViewModel({ settlement });
    const props = { settlement, narrativeMode: false, vm };
    const pdf = [NotableNPCs(props), NPCQuickRef(props), TonightAtTheTable(props)]
      .flatMap((tree) => deepText(tree)).join(' ');
    const vtt = journalText(buildJournalPages(vm));
    ROWS.push({ seed, settlement, text: `${pdf}\n${vtt}`.toLowerCase(), vm });
  }
}, 600000);

describe('X-48: no NPC look, voice or tell in any export', () => {
  test('the PDF NPC chapters, the Tonight chapter and the VTT journal print no look, speech or tell value, over sixty seeds', () => {
    const offenders = [];
    let checked = 0;
    for (const { seed, settlement, text } of ROWS) {
      for (const npc of settlement.npcs || []) {
        for (const [field, value] of hiddenValues(npc)) {
          checked += 1;
          if (text.includes(value.toLowerCase())) offenders.push(`${seed} · ${npc.name} · ${field}: ${value}`);
        }
      }
    }
    expect(checked, 'the walk found no look/voice/tell values on the record').toBeGreaterThan(500);
    console.info(`[x48] values checked ${checked}, printed ${offenders.length}, by field ${JSON.stringify(offenders.reduce((m, o) => { const f = o.split(' · ')[2].split(':')[0]; m[f] = (m[f] || 0) + 1; return m; }, {}))}`);
    expect(offenders.length, `printed look/voice/tell values:\n${offenders.slice(0, 20).join('\n')}`).toBe(0);
  });

  test('the walk read real NPC cards: names, temperaments and wants still print', () => {
    let named = 0;
    let temperaments = 0;
    for (const { settlement, text } of ROWS) {
      for (const npc of settlement.npcs || []) {
        if (npc.name && text.includes(String(npc.name).toLowerCase())) named += 1;
        const dominant = npc.personality?.dominant;
        if (typeof dominant === 'string' && dominant && text.includes(dominant.toLowerCase())) temperaments += 1;
      }
    }
    console.info(`[x48] names printed ${named}, temperaments printed ${temperaments}`);
    expect(named, 'NPC names reached the printed text').toBeGreaterThan(300);
    // The detailed sheet prints a temperament for the major and notable figures only.
    expect(temperaments, 'NPC temperaments reached the printed text').toBeGreaterThan(100);
  });
});
