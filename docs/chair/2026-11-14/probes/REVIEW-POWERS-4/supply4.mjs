// REVIEW-POWERS-4 supply4.mjs — CORPUS= [DUMPS=] node supply4.mjs : the reworded SUPPLY goals (impaired, expansion) in full:
// each goal's chain (economicState.activeChains by the goal's target id) and its status, the crisis in force, the house
// slot as printed, and whether the sentence is on the rendered page. Reads only.
import fs from 'node:fs'; import zlib from 'node:zlib';
const rows = zlib.gunzipSync(fs.readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
const C = {}; const houses = {}; const statuses = {}; let onPage = 0, offPage = 0; const odd = [];
for (const { seed, s } of rows) {
  const d = process.env.DUMPS ? (() => { try { return fs.readFileSync(`${process.env.DUMPS}/${seed}.txt`, 'utf8'); } catch { return null; } })() : null;
  const st = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).map((x) => x?.type).filter(Boolean);
  const chains = s.economicState?.activeChains || [];
  for (const c of s.npcs || []) for (const v of ['short', 'long']) {
    const i = c.goal?.intent?.[v]; const text = c.goal?.[v]; if (i?.family !== 'SUPPLY' || !['impaired', 'expansion'].includes(i.kind)) continue;
    const ch = chains.find((x) => x.chainId === i.target?.id || x.label === i.target?.id);
    const k = `${i.kind}: status ${ch?.status ?? 'NO CHAIN'}`; statuses[k] = (statuses[k] || 0) + 1;
    const h = (text.match(/(?:at|supply|for|of|roof of|name of) (the [^,.]+?)(?:[,.]| through| so| while| before| beyond| by| until| to| into| the thing| safe| back| alive| lost| never| with)/) || [])[1] || '?';
    houses[h] = (houses[h] || 0) + 1;
    if (d) { if (d.includes(text.slice(1, -1))) onPage++; else offPage++; }
    if (st.includes('under_siege') && /Find a new source|Bring in from outside|Find whoever can still supply|Take on more hands|Win new business|Get the most out|Grow the work at .* by one/.test(text)) odd.push(`SIEGE ${seed} ${text}`);
    if (st.includes('famine') && /Take on more hands|Get the most out|Grow the work at .* by one/.test(text)) odd.push(`FAMINE ${seed} ${text}`);
    if (!ch || (i.kind === 'impaired' && ch.status !== 'impaired') || (i.kind === 'expansion' && !['running', 'operational'].includes(ch.status))) odd.push(`STATUS ${seed} ${i.kind} ${ch?.label}/${ch?.status} :: ${text}`);
  }
}
console.log(JSON.stringify({ statuses, onPage, offPage, oddCount: odd.length, odd: odd.slice(0, 30), houses: Object.entries(houses).sort((a, b) => b[1] - a[1]) }, null, 0).slice(0, 9000));
