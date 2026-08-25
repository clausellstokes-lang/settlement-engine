import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { censusTotality } from '../../src/domain/townMap/fabric/partitionCensus.js';
function fixtureLedger() {
  const epochs = []; const pops = [1, 60, 240, 700, 1400]; const years = [0, 20, 55, 110, 200];
  for (let k = 0; k < pops.length; k++) epochs.push({
    index: k, year: years[k], population: pops[k], peakSoFar: pops[k], extentTier: 'town',
    builtRadius: 30 + k * 26, plotSetDelta: k === 0 ? 1 : pops[k] - pops[k - 1],
    intramuralDelta: k === 0 ? 1 : pops[k] - pops[k - 1], extramuralDelta: 0,
    provenance: k === 0 ? 'recorded' : 'interpolated',
    circuitEvents: k === 3 ? [{ index: 0, epoch: 3, year: 110, frozenRadius: 108, provenance: 'derived-frozen' }] : [],
    emissions: k === 4 ? [{ key: 'emit.E4.0', epoch: 4, year: 200, souls: 120, kind: 'faubourg', origin: 'gate', provenance: 'interpolated', reason: 'a saturated circuit' }] : [],
    quarterMints: k === 3 ? [{ epoch: 3, year: 110, tier: 'town', provenance: 'recorded', reason: 'town scale' }] : [],
  });
  return { version: 1, epochs, circuitEvents: [], emissions: [], quarterMints: [], annotations: {} };
}
const P = buildSettledPartition({ seed: 'spine1-fixture', ledger: fixtureLedger(), extent: { cx: 0, cy: 0, radius: 200 },
  originForm: 'NUCLEATED_CROSSROADS', planMode: 'COMPOSITE', roadWidth: 5, bodyTarget: 260, water: null,
  wallForm: { facets: 20, width: 2.2 } });
const arr = P.arrangement;
const t = censusTotality(P);
console.log('plots', P.plots, 'wraps', P.wraps.length, 'annots', Object.keys(P.annotations).length);
console.log('totality owed', t.owed, 'orphans', t.orphans.length, 'unknown', t.unknown);
const firstPlot = Object.keys(P.annotations).find(k => k.startsWith('plot.'));
console.log('first plot key:', firstPlot);
const pid = Number(firstPlot.slice(5));
const piece = arr.pieces[pid];
console.log('piece:', piece ? JSON.stringify({id:piece.id, cls:piece.cls, face:piece.face}) : 'MISSING');
const owner = liveFaces(arr).find(f => f.cls === 'PLOT' && f.piece === pid);
console.log('live PLOT face with that piece:', owner ? owner.id : 'NONE');
if (piece && piece.face !== undefined) {
  const f = arr.faces[piece.face];
  console.log('the piece\'s face', piece.face, '→ alive', f && f.alive, 'cls', f && f.cls, 'piece', f && f.piece, 'attrs', JSON.stringify(f && f.attrs));
}
const plotAnnots = Object.keys(P.annotations).filter(k=>k.startsWith('plot.'));
const livePieces = new Set(liveFaces(arr).filter(f=>f.cls==='PLOT').map(f=>f.piece));
const strayPlots = plotAnnots.filter(k=>!livePieces.has(Number(k.slice(5))));
console.log('plot annots', plotAnnots.length, 'stray plot annots', strayPlots.length, strayPlots.slice(0,10));
