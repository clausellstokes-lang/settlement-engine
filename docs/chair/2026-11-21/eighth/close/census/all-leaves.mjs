// Every leaf and home: the walker's own leafArm verdict; who reads powersList.
const T = process.argv[2];
const sh = await import(`${T}/tests/lint/factLayers.shared.mjs`);
const { LEAVES } = await import(`${T}/src/domain/facts/factLayers.js`);
const births = await sh.gridBirths();
const leaves = await sh.leafArm(births);
const bad = Object.entries(leaves).filter(([, v]) => v.undeclared.length || v.unread.length || v.unplaced.length || (v.violations || []).length);
console.log('leaves', Object.keys(leaves).length, 'failing', bad.length);
for (const [id, v] of bad) console.log(' ', id, JSON.stringify({ undeclared: v.undeclared, unread: v.unread, unplaced: v.unplaced, violations: v.violations }));
const readers = Object.entries(LEAVES).filter(([, r]) => (r.reads || []).includes('powersList') || JSON.stringify(r).includes('powersList')).map(([id]) => id);
console.log('rows naming powersList:', readers.join(', ') || 'none');
