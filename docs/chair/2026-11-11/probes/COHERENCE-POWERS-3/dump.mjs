// node dump.mjs <tree> <which: R|G|S combos> <shard> <nshards> <out.jsonl>
// One compact line per birth: the roster, the cards, the seat row, the card line, the seat house's Connection row,
// the capture state, the coup label, the ladder's first-lit top rungs, and the whole record's sha256.
import path from 'node:path'; import fs from 'node:fs'; import { createHash } from 'node:crypto';
import { jobsFor } from './corpus.mjs';
const tree = path.resolve(process.argv[2]); const imp = (p) => import(path.join(tree, p));
const opt = async (p) => { try { return await imp(p); } catch { return {}; } };
const [which, shard, nshards, out] = [process.argv[3], +process.argv[4], +process.argv[5], process.argv[6]];
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
const PS = await imp('src/domain/dossier/powerSupport.js');
const { rulingChainOf } = await imp('src/domain/dossier/powerStrata.js');
const CP = await imp('src/domain/people/cardPowers.js');
const { cardHonorificOf, faceNameOf } = await imp('src/domain/people/cardDoor.js');
const { seatHouseFaceOf } = await opt('src/domain/dossier/seatHolder.js');
const { leaderlessLineOf } = await opt('src/domain/people/stressPowerFaces.js');
const SK = { ...(await opt('src/domain/people/seatKeeper.js')), ...(await opt('src/domain/people/seatKeeperDisplay.js')) };
const { hallCaptureOf } = await imp('src/domain/people/hallCapture.js');
const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
const LS = await imp('src/domain/worldPulse/npcLadderState.js');
const { npcId } = await imp('src/domain/worldPulse/npcAgency.js');
await loadGenerationLawPayloads();
const jobs = (await jobsFor(imp, which)).filter((_, i) => i % nshards === shard);
const fd = fs.openSync(out, 'w');
for (const j of jobs) {
  const s = generateSettlementPipeline(j.cfg, null, { seed: j.seed, customContent: {} });
  const hash = createHash('sha256').update(JSON.stringify(s)).digest('hex');
  const npcs = s.npcs || [];
  const govRow = governingFactionOf(s); const gov = nameOf(govRow);
  const powers = (s.powerStructure?.factions || []).map((f) => {
    const n = nameOf(f);
    const first = npcs.findIndex((c) => (c.memberships || []).some((m) => m.power === n && m.rank === 1));
    let top = null; try { top = LS.eligibleMembersOf('a', s, f, LS.ladderFactionKey(f))[0]?.npcId || null; } catch { top = 'ERR'; }
    return { n, p: f.power, g: f.isGoverning ? 1 : 0, a: PS.backingArchetypeOf(f), d: f.desc || '', l: leaderlessLineOf ? (leaderlessLineOf(s, n) || '') : '',
      first: first < 0 ? null : npcs[first].id, top, firstLadder: first < 0 ? null : npcId('a', npcs[first], first), mods: f.modifiers || [] };
  });
  const cards = npcs.map((c) => ({ id: c.id, n: c.name, t: c.title, r: c.role, ik: c.institution?.kind || null, ikey: c.institution?.key || null, iv: !!c.institution?.veiled,
    ms: (c.memberships || []).map((m) => [m.power, m.rank ?? null, m.share ?? null, m.veiled ? 1 : 0]), h: SK.shownHonorificOf ? SK.shownHonorificOf(c, s) : cardHonorificOf(c, s),
    line: CP.governingNameOf ? CP.cardPowerLine(c, [], gov, !!SK.seatKeeperOf && SK.seatKeeperOf(s)?.id === c.id) : CP.cardPowerLine(c) }));
  const chain = rulingChainOf(s);
  const seatHouse = PS.seatHouseName ? PS.seatHouseName(s.institutions || []) : null;
  let conn = null;
  if (seatHouse) {
    const own = CP.facesByHouse(npcs).get(seatHouse) || null;
    const face = own || (seatHouseFaceOf ? seatHouseFaceOf(s, seatHouse) : null);
    const seatFaced = !own && !!face && !!(CP.cardOfficeOf && CP.cardOfficeOf(face));
    const cx = face && SK.connectionOf ? SK.connectionOf(face, s, seatFaced) : null;
    conn = face ? { house: seatHouse, id: face.id, text: cx ? cx.name + cx.tail : seatFaced ? `${CP.cardOfficeOf(face)} ${face.name}${face.title ? `, ${face.title}` : ''}` : faceNameOf(face, s) } : { house: seatHouse, id: null, text: null };
  }
  let coup = null; try { coup = coupRiskLabel(coupContenders(s)); } catch (e) { coup = 'ERR'; }
  const rec = { key: j.key, c: j.c, tier: j.tier, stress: j.stress, stresses: [].concat(s.stress || []).map((x) => x?.type).filter(Boolean), name: s.name, hash,
    gov, government: s.powerStructure?.government ?? null, powers, cards,
    seat: chain.npc ? { name: chain.npc.name, role: chain.npc.role } : { absence: chain.absence?.line || null },
    conn, capture: s.powerStructure?.criminalCaptureState ?? null, hall: hallCaptureOf(s)?.state ?? null, coup: typeof coup === 'string' ? coup : (coup?.label ?? JSON.stringify(coup)),
    rels: (s.powerStructure?.factionRelationships || []).map((r) => r.pair || []),
    tensions: (s.history?.currentTensions || []).map((t) => t.factions || []) };
  fs.writeSync(fd, JSON.stringify(rec) + '\n');
}
fs.closeSync(fd);
console.log('births', jobs.length);
