const P='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/src/domain/display/stateProse/';
const { composeStateProse, composeStateProseMount } = await import(P+'composeStateProse.js');

const v = (text, extra={}) => ({ text, ...extra });
const corpus = {
  B: {
    pools: {
      SPINE: [v('The spine speaks.')],
      COVERT: [v('the covert fact', { marks: ['dm-only'] })],
      OPEN:   [v('the open fact')],
      SPINE2: [v('Second spine speaks.')],
      OPEN2:  [v('the second open fact')],
    },
    poolMeta: {
      SPINE: { role: 'spine', readsCount: 1 },
      SPINE2: { role: 'spine', readsCount: 1 },
      // budget = 3-1 = 2, but only ONE sentence seat, so at most one modifier seats
      COVERT: { role: 'modifier', relation: 'addition', attach: ['SPINE','SPINE2'] },
      OPEN:   { role: 'modifier', relation: 'addition', attach: ['SPINE','SPINE2'] },
      OPEN2:  { role: 'modifier', relation: 'addition', attach: ['SPINE2'] },
    },
  },
};

// Find a seed where the COVERT candidate outranks OPEN (same band, so the seeded permutation decides)
function rank(seed, audience) {
  return composeStateProse(corpus, 'B', { spineKey: 'SPINE', candidates: [{key:'COVERT'},{key:'OPEN'}], seed, audience });
}
let seedCovertFirst = null;
for (let i=0;i<200;i+=1) {
  const dm = rank(`s${i}`,'dm');
  if (dm && dm.pieces.length===2 && dm.pieces[1].key==='COVERT') { seedCovertFirst = `s${i}`; break; }
}
console.log('seed where COVERT wins the one seat on the DM face:', seedCovertFirst);
const dm = rank(seedCovertFirst,'dm');
const pl = rank(seedCovertFirst,'player');
console.log('DM    :', JSON.stringify(dm.pieces.map(p=>p.key)), '|', dm.text);
console.log('PLAYER:', JSON.stringify(pl.pieces.map(p=>p.key)), '|', pl.text);
console.log('=> the player face keeps its seat for OPEN (covert did not consume it):', pl.pieces.length===2 && pl.pieces[1].key==='OPEN');

// POSITION BUDGET withdrawal: limit 1 rung bearing. Does a covert-only rung steal the bearing slot on the player face?
const rungs = [
  { spineKey: 'SPINE',  candidates: [{key:'COVERT'}] },
  { spineKey: 'SPINE2', candidates: [{key:'OPEN2'}] },
];
for (const aud of ['dm','player']) {
  let stolen = 0, total = 0;
  for (let i=0;i<200;i+=1) {
    const out = composeStateProseMount(corpus,'B',rungs,{ seed:`m${i}`, audience:aud, limit:1 });
    total += 1;
    if (out[1] && out[1].pieces.length===1) stolen += 1;   // rung 2 lost its modifier
  }
  console.log(`audience=${aud}: rung2 lost its modifier in ${stolen} of ${total} mounts (limit 1)`);
}
