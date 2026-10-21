// D-BD-p5b probe (b): P5-V1 — what master's custody normalizer does to a body-held (errand-less) row while the
// relaxed shape's flag is dark, and what the errandId dedupe does to two errand-less captives. Read-only import.
const M = process.argv[2];
const H = await import(M + '/src/domain/worldPulse/foreignGuestHold.js');
const routeRef = (id = 'road:ash') => ({ id, name: `Road ${id}` });
const cont = () => ({ schemaVersion: 1, resumeState: 'travelling', journey: 'outbound', destinationId: 'court:b', interruptedTick: 4,
  positionRef: { journey: 'outbound', legIndex: 0, fromId: 'court:a', toId: 'court:b', progressBand: 'near' },
  journeyLegs: [{ fromId: 'court:a', toId: 'court:b', departTick: 1, arrivalTick: 6, journey: 'outbound', routeRef: routeRef() }],
  expectedReturnTick: 20 });
const envoy = (s) => ({ schemaVersion: 1, id: `hold:${s}`, npcId: `npc:${s}`, errandId: `errand:${s}`, encounterId: `encounter:${s}`,
  captorId: `court:captor:${s}`, venueId: `hall:${s}`, venueRef: { kind: 'settlement', settlementId: `hall:${s}` },
  heldSinceTick: 5, cause: 'private_imprisonment', continuation: cont() });
// A body-held captive as ES-2b's relaxed shape would write it while LIT: no errand, no encounter; a captiveId key.
const bodyHeld = (s) => { const r = envoy(s); delete r.errandId; delete r.encounterId; r.captiveId = `captive:${s}`; r.captorId = `body:gang:${s}`; return r; };
const ws0 = { spatialLedgers: { foreignGuestHolds: [envoy('a'), bodyHeld('x')] } };
console.log('(1) dark READ   foreignGuestHoldsOf ids:', H.foreignGuestHoldsOf(ws0).map(r => r.id).join(',') || '(none)');
console.log('    normalizeForeignGuestHold(bodyHeld) ->', H.normalizeForeignGuestHold(bodyHeld('x')));
const opened = H.openForeignGuestHold({ worldState: ws0, hold: envoy('b') });
const ws1 = opened?.worldState ?? opened;
const persisted = ws1?.spatialLedgers?.foreignGuestHolds;
console.log('(2) dark WRITE  an envoy hold opened beside it; persisted ids:', Array.isArray(persisted) ? persisted.map(r => r.id).join(',') : JSON.stringify(Object.keys(opened || {})));
console.log('    body-held row survives the write:', Array.isArray(persisted) && persisted.some(r => r.id === 'hold:x'));
// (3) the dedupe, under a relaxed normalizer that admitted an errand-less row (master's parsedHolds logic, copied):
const relaxed = (r) => ({ ...r });   // stands in for an ES-2b normalizer that keeps the row
const dedupe = (rows, keys) => { const c = Object.fromEntries(keys.map(k => [k, new Map()]));
  for (const r of rows) for (const k of keys) { if (keys.length > 3 && r[k] == null) continue; const v = String(r[k]); c[k].set(v, (c[k].get(v) || 0) + 1); }
  return rows.filter(r => keys.every(k => (keys.length > 3 && r[k] == null) || c[k].get(String(r[k])) === 1)); };
const two = [bodyHeld('x'), bodyHeld('y')].map(relaxed);
console.log('(3) master dedupe (id · npcId · errandId) keeps:', dedupe(two, ['id','npcId','errandId']).map(r => r.id).join(',') || '(none — both erased: String(undefined) counted twice)');
console.log('    cure dedupe (errandId only when present; captiveId unique) keeps:', dedupe(two, ['id','npcId','errandId','captiveId']).map(r => r.id).join(','));
