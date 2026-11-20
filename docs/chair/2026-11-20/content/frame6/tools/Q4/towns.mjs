// Q4 exploration: dump record facts for the three named towns (read-only; argv: pool.json, tree src/ path)
import fs from 'node:fs';
const R = process.argv[3];
const { castTroubleFrame, troubleOfWeight } = await import(R + 'domain/tension/troubleCast.js');
const { composeTonightSheet } = await import(R + 'domain/summary/tonightSheet.js');
const { membersByRank } = await import(R + 'domain/people/membership.js');
const { factionArchetype } = await import(R + 'domain/factionArchetypes.js');
const { rulingChainOf } = await import(R + 'domain/dossier/powerStrata.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const seed of ['frame-calm-town-20', 'frame-calm-hamlet-17', 'frame-calm-village-20']) {
  const { s } = towns.find((t) => t.seed === seed);
  console.log('=====', seed);
  console.log('weight', JSON.stringify(troubleOfWeight(s)?.strain), 'at', troubleOfWeight(s)?.at);
  console.log('seat', rulingChainOf(s).npc?.name);
  for (const f of s.powerStructure.factions) console.log('  POWER', f.faction, '| arch', factionArchetype(f), '| cat', f.category, '| pow', f.power, '| gov', f.isGoverning, '| capture', f.captureState, '| members', membersByRank(s.npcs, f.faction).map((n) => n.name).join(', '));
  for (const n of s.npcs) console.log('  NPC', n.id, n.name, '|', n.role, '|', n.title || '', '|', n.category, '| pow', n.power, '| inst', JSON.stringify(n.institution?.key || n.institution), '| mem', JSON.stringify(n.memberships || n.faction || ''), n.temporary ? 'TEMP' : '', n.ousted ? 'OUSTED' : '');
  for (const r of s.relationships || []) console.log('  TIE', r.typeName, s.npcs.find((n) => n.id === r.from)?.name, '->', s.npcs.find((n) => n.id === r.to)?.name);
  (s.history?.currentTensions || []).forEach((t, i) => console.log('  TENSION', i, t.type, JSON.stringify(t.factions), '|', t.description, '| hooks', JSON.stringify(t.plotHooks)));
  console.log('  CHAINS', JSON.stringify((s.economicState?.activeChains || []).map((c) => ({ id: c.chainId || c.id || c.name, status: c.status, res: c.resource || c.label }))));
  console.log('  CAST', JSON.stringify(castTroubleFrame(s).sides, null, 0));
  const sh = composeTonightSheet(s, { audience: 'owner' });
  console.log('  PEOPLE', JSON.stringify(sh.people.map((p) => p.name + '|' + p.why)));
  console.log('  HOOKS', JSON.stringify(sh.hooks));
  const line = composeTonightSheet(s);
  console.log('  LINE PEOPLE', JSON.stringify(line.people.map((p) => p.name + '|' + p.why)));
  console.log('  LINE HOOKS', JSON.stringify(line.hooks));
}
