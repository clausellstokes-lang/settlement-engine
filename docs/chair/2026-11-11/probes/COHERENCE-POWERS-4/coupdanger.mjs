// node coupdanger.mjs <a-label> <b-label> — every coup move toward danger: the birth, its forced crisis, the stresses it
// actually carries, the move, and the roster before and after
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const S = '/tmp/claude-0/-home-user-settlement-engine/af36b3be-c713-5bc4-9179-581d679d45cb/scratchpad/dumps';
const [A, B] = process.argv.slice(2);
const COUP = ['Stable', 'Holding', 'Contested', 'Critical. The seat could fall'];
const lines = (f) => readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()), crlfDelay: Infinity })[Symbol.asyncIterator]();
const by = {};
for (let i = 0; i < 4; i++) {
  const ia = lines(`${S}/${A}.w${i}.ndjson.gz`), ib = lines(`${S}/${B}.w${i}.ndjson.gz`);
  for (;;) {
    const [x, y] = await Promise.all([ia.next(), ib.next()]); if (x.done) break;
    const a = JSON.parse(x.value), b = JSON.parse(y.value);
    if (a.coup === b.coup || COUP.indexOf(b.coup) < COUP.indexOf(a.coup)) continue;
    const st = [].concat(b.rec.stress || []).map((s) => s?.type).filter(Boolean);
    const seatCrisis = st.includes('occupied') ? 'occupied' : st.includes('politically_fractured') ? 'politically_fractured' : 'OTHER';
    by[seatCrisis] = (by[seatCrisis] || 0) + 1;
    if (seatCrisis === 'OTHER') console.log(a.key, st.join('+'), a.coup, '->', b.coup, '|', (a.rec.powerStructure.factions || []).map((f) => f.faction).join(', '), '=>', (b.rec.powerStructure.factions || []).map((f) => f.faction).join(', '));
  }
}
console.log(JSON.stringify(by));
