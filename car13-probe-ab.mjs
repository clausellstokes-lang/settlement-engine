// A/B identity probe: the four island modules at HEAD (3ccd29a29) vs the working tree,
// over the SHIPPED corpus. Same inputs, same loader, two module graphs.
const DOCK = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneINSTR2';
const OLD = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/5540cfd2-eea9-4469-ba34-6514b54a83ff/scratchpad/oldsrc';

const { loadStateLeaves, loadCausalLeaf, poolCells } = await import(`${DOCK}/tests/helpers/dossierCorpus.js`);
const { CHAIR_CEILINGS, CHAIR_THREE_NUMBERS, SYNTHETIC_BANDS } = await import(`${DOCK}/tests/fixtures/grammarControls.js`);
const { TABLE_EMPTY, TABLE_FULL } = await import(`${DOCK}/tests/fixtures/brackwaterTables.js`);

const gwNew = await import(`${DOCK}/src/domain/prose/grammarWalker.js`);
const gwOld = await import(`${OLD}/src/domain/prose/grammarWalker.js`);
const ewNew = await import(`${DOCK}/src/domain/prose/entryWalker.js`);
const ewOld = await import(`${OLD}/src/domain/prose/entryWalker.js`);
const mgNew = await import(`${DOCK}/src/domain/prose/moveGrammar.js`);
const mgOld = await import(`${OLD}/src/domain/prose/moveGrammar.js`);

const leaves = await loadStateLeaves();
const causal = await loadCausalLeaf();
const j = (v) => JSON.stringify(v);
let checks = 0; let bad = 0;
const same = (label, a, b) => {
  checks += 1;
  if (j(a) !== j(b)) { bad += 1; console.log(`DIFFERS: ${label}`); }
};

// 1. walkGrammar over the R1 leaves and the R2 causal join, with and without the chair ceilings.
for (const [name, corpus, register] of [['R1 dossier', leaves, 'dossier'], ['R2 causal', causal, 'dossier']]) {
  for (const ceilings of [CHAIR_CEILINGS, undefined]) {
    const args = () => ({
      corpus, cells: poolCells(corpus), register, ceilings, bands: SYNTHETIC_BANDS, three: CHAIR_THREE_NUMBERS,
    });
    same(`walkGrammar ${name} ceilings=${!!ceilings}`, gwOld.walkGrammar(args()), gwNew.walkGrammar(args()));
  }
  // the three-numbers/bands-absent path too
  same(`walkGrammar ${name} no bands`, gwOld.walkGrammar({ corpus, cells: poolCells(corpus), register }),
    gwNew.walkGrammar({ corpus, cells: poolCells(corpus), register }));
}

// 2. armF over EVERY entry in EVERY register name the estate walks (the wall-6 scope gate).
for (const register of ['dossier', 'herald', 'chronicle', 'estate', '*', '']) {
  for (const entry of [...leaves, ...causal]) {
    const moves = mgNew.classifyMoves(entry.text);
    const movesOld = mgOld.classifyMoves(entry.text);
    same(`classifyMoves ${entry.id}`, movesOld, moves);
    same(`armF ${register} ${entry.id}`, gwOld.armF(entry, movesOld, register), gwNew.armF(entry, moves, register));
  }
}

// 3. armE per pool + the uniformSegments pairing invariant the narrowing rests on.
let pairChecked = 0;
for (const [poolId, pool] of poolCells(leaves)) {
  const eOld = gwOld.armE(pool, poolId);
  const eNew = gwNew.armE(pool, poolId);
  same(`armE ${poolId}`, eOld, eNew);
  const f = eNew.figures;
  checks += 1;
  if (typeof f.uniformGrammar === 'boolean') {
    pairChecked += 1;
    if (typeof f.uniformSegments !== 'boolean') { bad += 1; console.log(`PAIRING BROKEN: ${poolId}`); }
  } else if ('uniformSegments' in f) { bad += 1; console.log(`ORPHAN uniformSegments: ${poolId}`); }
}

// 4. bandReadings + walkEntry over every entry, both grounds (armC1's byNoun is inside walkEntry).
for (const entry of [...leaves, ...causal]) {
  same(`bandReadings ${entry.id}`, ewOld.bandReadings(entry.text), ewNew.bandReadings(entry.text));
  for (const [gname, ground] of [['EMPTY', TABLE_EMPTY], ['FULL', TABLE_FULL]]) {
    same(`walkEntry ${gname} ${entry.id}`, ewOld.walkEntry(entry, ground), ewNew.walkEntry(entry, ground));
  }
}

// 5. wall 6 exists, so `Boolean(wall && ...)` is the same read as `wall.scope.includes(...)`.
checks += 1;
if (!mgNew.WALLS.find((w) => w.id === 6)) { bad += 1; console.log('WALL 6 MISSING'); }

console.log(`corpus: R1 ${leaves.length} entries / ${poolCells(leaves).size} pools · R2 ${causal.length} entries`);
console.log(`uniformGrammar-boolean pools whose sibling flag was checked: ${pairChecked}`);
console.log(`comparisons: ${checks} · differences: ${bad}`);
process.exit(bad ? 1 : 0);
