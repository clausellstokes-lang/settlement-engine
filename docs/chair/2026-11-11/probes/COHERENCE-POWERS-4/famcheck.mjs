// node famcheck.mjs <a-label> <b-label> — for the families outside the cast (institutions, availableServices, economicState,
// economicViability, settlementReason, history.historicalEvents, publicLegitimacy): the births that move them, and whether
// each such birth's government (or governing power's name) moved too
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const S = '/tmp/claude-0/-home-user-settlement-engine/af36b3be-c713-5bc4-9179-581d679d45cb/scratchpad/dumps';
const [A, B] = process.argv.slice(2);
const FAM = ['institutions', 'availableServices', 'economicState', 'economicViability', 'settlementReason', 'historicalEvents', 'publicLegitimacy', 'stability', 'legitimacy'];
const pick = (r, f) => f === 'historicalEvents' ? r.history?.historicalEvents : f === 'publicLegitimacy' || f === 'stability' || f === 'legitimacy' ? r.powerStructure?.[f] : r[f];
const lines = (f) => readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()), crlfDelay: Infinity })[Symbol.asyncIterator]();
const out = {};
for (let i = 0; i < 4; i++) {
  const ia = lines(`${S}/${A}.w${i}.ndjson.gz`), ib = lines(`${S}/${B}.w${i}.ndjson.gz`);
  for (;;) {
    const [x, y] = await Promise.all([ia.next(), ib.next()]); if (x.done) break;
    const a = JSON.parse(x.value), b = JSON.parse(y.value);
    const gov = a.rec.powerStructure?.government !== b.rec.powerStructure?.government;
    const govName = (r) => (r.powerStructure?.factions || []).find((f) => f.isGoverning)?.faction;
    const ruler = govName(a.rec) !== govName(b.rec);
    for (const f of FAM) if (JSON.stringify(pick(a.rec, f)) !== JSON.stringify(pick(b.rec, f))) {
      out[f] ||= { births: 0, withGovMove: 0, withRulerMove: 0, neither: [] }; out[f].births++;
      if (gov) out[f].withGovMove++; if (ruler) out[f].withRulerMove++; if (!gov && !ruler) out[f].neither.push(a.key);
    }
  }
}
for (const [f, v] of Object.entries(out)) console.log(f, v.births, 'gov moved', v.withGovMove, 'ruler moved', v.withRulerMove, 'neither', v.neither.length, v.neither.slice(0, 12).join(' '));
