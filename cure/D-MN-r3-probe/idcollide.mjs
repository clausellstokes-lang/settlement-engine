// MN-r2-verify probe (read-only): in-place adoption keeps the TOWN'S DEFAULT stressor id; a declared war's
// siege birth at the same town mints that same id, so stressors.js :: evaluateStressorRules' collision guard
// (`if (activeIds.has(idFor({ type, originSettlementId }))) continue;`) blocks it, and the applier's byId upsert
// would merge onto the menace's record if the guard were bypassed. Run: node idcollide.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const core = await import(pathToFileURL(path.join(W, 'src/domain/worldPulse/stressorsCore.js')).href);
// the war's sealed siege record as born by the pressure loop (candidateForTypeAndPressure passes no id)
const warSiege = core.normalizeStressor({ type: 'siege', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: 0.7,
  originContext: { variant: 'declared_war', attackerSettlementId: 'merewick', sponsorSettlementId: 'merewick', attackerLabel: null } });
// COMMIT THE FORCE adopts it IN PLACE (MN §5.6 / §3.2): id kept, menace stamp, sponsor/attacker cleared
const adopted = core.normalizeStressor({ ...warSiege, durationPolicy: 'episodic',
  originContext: { variant: 'menace', menaceId: 'menace.m1', attackerLabel: 'the Third Levy', attackerSettlementId: null, sponsorSettlementId: null } });
// a later declared-war siege candidate at Kell (the M37 case) — same constructor shape
const laterWar = core.normalizeStressor({ type: 'siege', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: 0.6,
  originContext: { variant: 'declared_war', attackerSettlementId: 'merewick', sponsorSettlementId: 'merewick', attackerLabel: null } });
const guardId = core.idFor({ type: 'siege', originSettlementId: 'kell' });
// a menace-MINTED record (pre-round-2 idiom) for contrast
const minted = core.normalizeStressor({ id: 'world_stressor.siege.kell.menace.menace_m1', type: 'siege', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: 0.9 });
console.log(JSON.stringify({
  adoptedId: adopted.id, laterWarId: laterWar.id, guardIdFor: guardId,
  adoptedCollidesWithGuard: adopted.id === guardId, laterWarCollidesWithAdopted: laterWar.id === adopted.id,
  mintedMenaceId: minted.id, mintedCollidesWithGuard: minted.id === guardId,
  adoptedStampSurvivesNormalize: adopted.originContext?.menaceId === 'menace.m1',
}, null, 2));
