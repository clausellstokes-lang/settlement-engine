/**
 * COHERENCE-VEIL-3: THE ID DIFFERENTIAL, re-run after the third seat's cures (R3: numbers at the top of
 * numeric's range; R4: ids nested arrays deep). Every id-forming field of the seven card kinds, filled
 * from awkward pools (the pin's own, the range edges, ids up to 600 arrays deep), and the server's
 * `_gallery_veil_card_id` against the client's `CARD_KINDS[kind].idOf` on the card as a reader's browser
 * receives it (JSON.parse of PostgreSQL's own jsonb text). A card whose idOf throws in the client (an
 * object with a toString key: the declared limit 3) and an anonymous legacy event are counted apart.
 *   PG_MODULE=... PGHOST=... PGUSER=postgres [CARDS=4000] npx vitest run --config docs/chair/2026-11-12/veil-probe-2/vitest.config.mjs iddiff
 * Writes veil-probe-2/out/iddiff-cv3.json. Reads the database `cw211` the towns probe builds (or IDDIFF_DB).
 */
import { it } from 'vitest';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { client } from './native.mjs';

const OUT = resolve(process.cwd(), 'docs/chair/2026-11-12/veil-probe-2/out');

function rngOf(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32; }; }
const EDGES = ['0', '-0', '1', '-1', '0.5', '1e-7', '-1e-7', '1e-6', '1e21', '1e20', '123456789012345678901', '9007199254740993', '1e400', '-1e400',
  '1e-400', '5e-324', '2.4703282292062327e-324', '2.4703282292062328e-324', '1.7976931348623157e308', '1.7976931348623159e308', '0.1', '1E5',
  '1e131071', '-1e131071', '9.99e131071', '2.5e130748', '-2.5e130748', '1e130747', '1e-16383', '-1e-16383'];
const STRINGS = ['', ' ', 'x', 'House', 'The Hidden Hand', "Thieves' Guild", '  -- Ünder  Côte --  ', 'İstanbul KELVIN Kk', '日本語', '🗝 Key',
  'a:b:c', 'a'.repeat(120), '0', 'false', 'null', 'event.legacy-1', 'ß ẞ ſ', 'ＡＢＣ'];
function number(r) {
  if (r() < 0.5) return EDGES[Math.floor(r() * EDGES.length)];
  const dv = new DataView(new ArrayBuffer(8));
  dv.setUint32(0, Math.floor(r() * 2 ** 32)); dv.setUint32(4, Math.floor(r() * 2 ** 32));
  const x = dv.getFloat64(0);
  return Number.isFinite(x) ? JSON.stringify(x) : '0';
}
function value(r, d = 0) {
  const p = r();
  if (p < 0.35) return number(r);
  if (p < 0.65) return JSON.stringify(STRINGS[Math.floor(r() * STRINGS.length)]);
  if (p < 0.72) return ['true', 'false', 'null'][Math.floor(r() * 3)];
  if (p < 0.76) { const n = [2, 40, 600][Math.floor(r() * 3)]; return `${'['.repeat(n)}${number(r)}${']'.repeat(n)}`; }
  if (p < 0.9 && d < 2) return `[${Array.from({ length: Math.floor(r() * 4) }, () => value(r, d + 1)).join(',')}]`;
  if (p < 0.93) return '{"toString":1}';
  return d < 2 ? `{${r() < 0.5 ? '' : `"a":${value(r, d + 1)}`}}` : '{}';
}
// KEYS_EXTRA (COHERENCE-VEIL-5): more id-forming keys, comma-separated; `KEYS_EXTRA=npc1Id,npc2Id` draws a tie's
// ends in the deployed client's stored shape too (master's npc1Id/npc2Id; V4-1)
const KEYS = ['id', 'refId', 'name', 'label', 'title', 'type', 'faction', 'parties', 'issue', 'from', 'to', 'npc1Name', 'npc2Name',
  ...(process.env.KEYS_EXTRA ? process.env.KEYS_EXTRA.split(',') : [])];
const card = (r) => `{${KEYS.filter(() => r() < 0.4).map((k) => `${JSON.stringify(k)}:${value(r)}`).join(',')}}`;

it('the id differential: server card ids against the client\'s idOf', async () => {
  const veil = await import('../../../../src/domain/display/galleryVeil.js');
  const db = await client(process.env.IDDIFF_DB || 'cw211');
  const per = Number(process.env.CARDS || 4000);
  const r = rngOf(3211);
  const out = { perKind: per, kinds: {}, compared: 0, unequal: 0, clientThrows: 0, legacy: 0, raised: 0, examples: [] };
  for (const kind of Object.keys(veil.CARD_KINDS)) {
    const texts = Array.from({ length: per }, () => card(r));
    let rows;
    try {
      rows = (await db.query(`select e::text as t, public._gallery_veil_card_id($2, e) as id from jsonb_array_elements($1::jsonb) with ordinality x(e, o) order by o`, [`[${texts.join(',')}]`, kind])).rows;
    } catch (e) { out.raised += per; out.examples.push(`${kind} RAISED ${String(e.message).slice(0, 120)}`); continue; }
    const k = { compared: 0, unequal: 0 };
    for (const { t, id } of rows) {
      const c = JSON.parse(t);
      let want;
      try { want = veil.CARD_KINDS[kind].idOf(c); } catch { out.clientThrows += 1; continue; }
      const anonymous = kind === 'event' && !(typeof c.id === 'string' && c.id) && !(c.name || c.title || c.label);
      if (anonymous) { out.legacy += 1; if (id !== null) { out.unequal += 1; out.examples.push(`${kind} ${t.slice(0, 80)} -> ${id} (want legacy)`); } continue; }
      k.compared += 1;
      if (id !== want) { k.unequal += 1; if (out.examples.length < 20) out.examples.push(`${kind} ${t.slice(0, 100)} -> ${JSON.stringify(id)?.slice(0, 60)}, client ${JSON.stringify(want)?.slice(0, 60)}`); }
    }
    out.kinds[kind] = k; out.compared += k.compared; out.unequal += k.unequal;
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(resolve(OUT, process.env.OUT_FILE || 'iddiff-cv3.json'), JSON.stringify(out, null, 1));
  await db.end();
});
