// R-PA3 probe: what each landed relationship writer/normalizer does with a PRE-BIRTH (negative) tick.
const R = '/home/user/master-code-of-record/src/domain';
const out = (k, v) => console.log(k.padEnd(44), typeof v === 'string' ? v : JSON.stringify(v));
const { draftPactSheet, signPactProposal, pactSignedBeat } = await import(`${R}/worldPulse/pactFormation.js`);
const { appendWizardNewsEntries } = await import(`${R}/region/wizardNews.js`);
const { normalizeAllianceCalls } = await import(`${R}/worldPulse/relationshipState.js`);
const { normalizeConcludedWarRecord } = await import(`${R}/worldPulse/concludedWarRecord.js`);
const { bandCrossingReceipt, decayTowardNeutral } = await import(`${R}/worldPulse/bandedStock.js`);
const { getSpatialLedger } = await import(`${R}/spatial/spatialLedgerAccess.js`);

// 1. pact: draft at -530, sign at -520 (ten years of 52 weeks before birth)
const draft = draftPactSheet({ trigger: 'trade_demand', fromId: 'sA', toId: 'sB', reciprocal: true, tick: -530, score01: 0.9 });
out('1a draft refusal / term count', { refusal: draft.refusal, n: draft.terms.length, types: draft.terms.map(t => t.type), span: draft.terms.map(t => t.expiresTick - t.mintedTick) });
const signed = signPactProposal({ worldState: { simulationRules: { pactFormationEnabled: true } }, proposal: { id: 'p1', from: 'sA', to: 'sB', sheet: { terms: draft.terms } }, tick: -520 });
const treaties = getSpatialLedger(signed.worldState, 'treaties');
const key = Object.keys(treaties)[0];
out('1b treaty key / minted', { key, minted: signed.minted, mintedTick: treaties[key].mintedTick, expires: treaties[key].terms.map(t => t.expiresTick), lineage: treaties[key].lineage, provenance: treaties[key].provenance, complianceState: treaties[key].complianceState });
out('1c worldState top keys after sign', Object.keys(signed.worldState));
// 2. the signing beat through the Herald normalizer
const beat = pactSignedBeat({ tick: -520, proposal: { id: 'p1', from: 'sA', to: 'sB' }, terms: signed.added, fromName: 'Ashford', toName: 'Brindle' });
out('2a beat minted?', beat ? { id: beat.id, tick: beat.tick, headline: beat.headline } : null);
if (beat) {
  const feed = appendWizardNewsEntries({}, [{ ...beat, past: true, eraTick: -520 }], { now: '2026-10-23T00:00:00.000Z' });
  const e = feed.entries[0];
  out('2b after normalizeEntry: tick / past / eraTick', { tick: e.tick, past: e.past, eraTick: e.eraTick, source: e.source });
  const feed2 = appendWizardNewsEntries({}, [{ ...beat, source: 'table' }], { now: '2026-10-23T00:00:00.000Z' });
  out('2c source passes through?', feed2.entries[0].source);
}
// 3. alliance call with a negative tick
const call = { callId: 'coalition_call.sA.sB.sC.-300', partyId: 'sB', callerId: 'sA', enemyId: 'sC', relationshipKey: 'edge.sA.sB', tick: -300, callerDeploymentSinceTick: -300, originSinceTick: -300, originAttackerId: 'sA', decision: 'joined', cause: 'alliance_obligation' };
out('3 normalizeAllianceCalls(neg)', normalizeAllianceCalls([call]));
// 4. concluded war with negative ticks
const war = { warId: 'war.sA.sC.-400.0', originPair: ['sA', 'sC'], originAttackerId: 'sA', openedTick: -400, concludedTick: -350, participants: [] };
out('4a normalizeConcludedWarRecord(neg)', normalizeConcludedWarRecord(war, war.warId));
out('4b same record at 0..50', normalizeConcludedWarRecord({ ...war, openedTick: 0, concludedTick: 50 }, war.warId) ? 'kept' : 'dropped');
// 5. banded stock
try { bandCrossingReceipt({ stockKind: 'grudge', cause: 'raid', ladder: ['cold', 'warm'], from: 'cold', to: 'warm', tick: -10 }); out('5a crossing receipt neg tick', 'accepted'); }
catch (err) { out('5a crossing receipt neg tick', 'THROWS: ' + err.message); }
out('5b grudge 0.9→neutral 0.12 after 60y, a_generation', decayTowardNeutral(0.9, 0.12, 60 * 52, 'a_generation').toFixed(4));
out('5c grudge 0.9→neutral 0.12 after 60y, a_few_years', decayTowardNeutral(0.9, 0.12, 60 * 52, 'a_few_years').toFixed(4));
