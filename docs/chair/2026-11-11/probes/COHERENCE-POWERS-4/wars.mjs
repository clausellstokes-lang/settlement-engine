// node wars.mjs <tree> <seed> <out.json> — statecraftExposureBand's seeded run (composeReaderRegion, the deity case
// seated, head on, twenty years) on one realm seed; mobilizations counted the test's own way (war_mobilization raw wizard
// news, impactKind else kind), per year; the four NPC acts and every npc_* act; spy scandals; conquests.
import path from 'node:path'; import fs from 'node:fs';
const tree = path.resolve(process.argv[2]); const seed = process.argv[3]; const out = process.argv[4];
const imp = (p) => import(path.join(tree, p));
const { composeReaderRegion, advanceReaderCampaign, READER_NOW } = await imp('scripts/review/readerCorpus.mjs');
const { seatDeityBearingCase, WF0_DEITY_BEARING_CASE } = await imp('scripts/audit/whole-world-soak-deity-fixture.mjs');
const row = { campaignId: 'fp-read-2', posture: 'launch', preset: 'dramatic_campaign', goldenKey: null, seed, overlay: null, years: 20 };
let { campaign, saves } = composeReaderRegion(row);
({ saves } = seatDeityBearingCase(saves, WF0_DEITY_BEARING_CASE, { now: READER_NOW }));
const rules = campaign.worldState.simulationRules;
campaign = { ...campaign, worldState: { ...campaign.worldState, simulationRules: { ...rules, infoStatecraftEnabled: true, informationBrokeragesEnabled: true } } };
const kinds = {}; const perYear = [];
await advanceReaderCampaign({ campaign, saves, years: 20, seed, onYear: (cap) => {
  let m = 0;
  for (const n of cap.rawWizardNewsEntries) { const k = String(n?.impactKind || n?.kind || 'unknown'); kinds[k] = (kinds[k] || 0) + 1; if (k === 'war_mobilization') m++; }
  perYear.push(m);
} });
const npc = Object.fromEntries(Object.entries(kinds).filter(([k]) => k.startsWith('npc_')));
fs.writeFileSync(out, JSON.stringify({ seed, mob: kinds.war_mobilization || 0, perYear, scandals: kinds.infowar_spy_exposed || 0, npc,
  conquest: Object.entries(kinds).filter(([k]) => /conquest/.test(k)).reduce((a, [, v]) => a + v, 0), courts: saves.length }));
