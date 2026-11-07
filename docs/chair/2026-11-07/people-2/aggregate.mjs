// PEOPLE-2 CAST-DERIVED aggregate (2026-11-07): the base's measure.mjs lines beside the tip's.
//   node docs/chair/2026-11-07/people-2/aggregate.mjs <before.jsonl> <after.jsonl> [tonightLimit] > out.md
// Per tier: cast roles filled (all / people / absent), the cast's people that are faces, lever
// holders (and those that are the lever house's face), the seat row filled (and rank 1). The
// Tonight sheet diffed line by line over the first `tonightLimit` settlements (all by default):
// every moved line classified NAME (equal once every roster name is masked, or a line of a sheet
// person whose name moved — the person's own role, want, secret and source travel with them),
// TITLE (equal once names and every card's title/role are masked), or OTHER with its cause
// (GOAL — the same person's want moved: the structural template, step 3; PARTY — equal once the
// powers' names are masked: the hook's "of <power>" reads the first-rank power, step 3;
// STRUCTURE — a path present on one side only; UNEXPLAINED — none of these).
import { readFileSync } from 'node:fs';

const [beforePath, afterPath, limitArg] = process.argv.slice(2);
const read = (p) => readFileSync(p, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const before = read(beforePath);
const after = read(afterPath);
const limit = limitArg ? Number(limitArg) : Infinity;
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const masker = (words, token) => {
  const list = [...new Set(words.filter((w) => w && w.length > 2))].sort((a, b) => b.length - a.length);
  if (!list.length) return (s) => s;
  const re = new RegExp(list.map(esc).join('|'), 'g');
  return (s) => s.replace(re, token);
};

function castFigures(rows) {
  const t = { settlements: 0, crises: 0, roles: 0, people: 0, faces: 0, absent: 0, levers: 0, held: 0, heldByFace: 0, houseHasFace: 0, seat: 0, seatRank1: 0 };
  for (const o of rows) {
    t.settlements += 1;
    if (o.seat) { t.seat += 1; if (o.seat.rank1) t.seatRank1 += 1; }
    for (const c of o.casts) {
      t.crises += 1;
      t.roles += c.roles.length;
      t.absent += c.absent.length;
      for (const r of c.roles) if (r.kind === 'npc') { t.people += 1; if (r.face) t.faces += 1; }
      for (const l of c.levers) {
        t.levers += 1;
        if (l.holderId) t.held += 1;
        if (l.holderIsFace) t.heldByFace += 1;
        if (l.houseHasFace) t.houseHasFace += 1;
      }
    }
  }
  return t;
}

function tonightDiff(a, b) {
  const out = { lines: 0, moved: 0, name: 0, namePerson: 0, nameAdded: 0, title: 0, goal: 0, party: 0, cast: 0, order: 0, lever: 0, structure: 0, unexplained: 0, samples: [] };
  const mapOf = (lines) => new Map(lines.map((l) => { const i = l.indexOf(' = '); return [l.slice(0, i), l.slice(i + 3)]; }));
  const A = mapOf(a.tonight);
  const B = mapOf(b.tonight);
  const names = masker([...a.names, ...b.names], '⟨N⟩');
  const titles = masker([...a.titles, ...b.titles], '⟨T⟩');
  const powers = masker([...(a.powers || []), ...(b.powers || [])], '⟨P⟩');
  // the people slots whose person moved
  const swapped = new Set();
  for (const [k, v] of A) { const m = k.match(/^(people\[\d+\])\.name$/); if (m && B.has(k) && B.get(k) !== v) swapped.add(m[1]); }
  const keys = new Set([...A.keys(), ...B.keys()]);
  const nCount = (v) => (names(v).match(/⟨N⟩/g) || []).length;
  // the multiset of a list's values on each side (a reorder moves values, it does not change them)
  const listValues = (M, prefix) => [...M].filter(([k]) => k.startsWith(prefix)).map(([, v]) => v).sort().join('\u0000');
  for (const k of keys) {
    out.lines += 1;
    const x = A.get(k); const y = B.get(k);
    if (x === y) continue;
    out.moved += 1;
    if (x === undefined || y === undefined) {
      // a slot present on one side only: a person (and their own fields) where none was, or gone
      if (/^(people|crisis\.persons)\[\d+\]\./.test(k)) { out.nameAdded += 1; continue; }
      out.structure += 1; if (out.samples.length < 12) out.samples.push(`STRUCTURE ${a.label} ${k}`); continue;
    }
    if (names(x) === names(y)) { out.name += 1; continue; }
    // a list's length grew or shrank by the people it names (the seat row filled, a cast role named)
    if (/^(people|crisis\.persons)\.length$/.test(k) || k === 'crisis.person') { out.nameAdded += 1; continue; }
    if (nCount(x) !== nCount(y)) { out.nameAdded += 1; continue; }
    const slot = k.match(/^(people\[\d+\])\./)?.[1];
    if (slot && swapped.has(slot)) { out.namePerson += 1; continue; }
    if (titles(names(x)) === titles(names(y))) { out.title += 1; continue; }
    // the crisis line's people: the cast person the line reads moved, with its own role label
    const personsMoved = listValues(A, 'crisis.persons[') !== listValues(B, 'crisis.persons[');
    if (personsMoved && (/^crisis\.persons\[\d+\]\./.test(k) || k === 'crisis.line' || k === 'opening')) { out.namePerson += 1; continue; }
    // a crisis hook names a cast row: the row moved, its person, power and reason travel together
    if (/^hooks\[\d+\]\.text$/.test(k) && /^"In the /.test(x) && /^"In the /.test(y) && !/the players can push on/.test(x)) { out.cast += 1; if (out.samples.length < 12) out.samples.push(`CAST ${k}: ${x.slice(0, 90)} → ${y.slice(0, 90)}`); continue; }
    // a person hook (the cards' own plot hooks) follows the roster's order
    if (/^hooks\[\d+\]\.(text|source)$/.test(k) && !/^"In the /.test(x) && !/^"In the /.test(y)) { out.order += 1; continue; }
    const list = k.match(/^(hooks|people)\[\d+\]/)?.[1];
    if (list && listValues(A, `${list}[`) === listValues(B, `${list}[`)) { out.order += 1; continue; }
    if (/^people\[\d+\]\.(sourcePath|why)$/.test(k)) { out.order += 1; continue; }
    if (/^people\[\d+\]\.line$/.test(k)) { out.goal += 1; if (out.samples.length < 6) out.samples.push(`GOAL ${k}: ${x.slice(0, 70)} → ${y.slice(0, 70)}`); continue; }
    if (/the players can push on/.test(x) && /the players can push on/.test(y)) { out.lever += 1; continue; }
    if (powers(titles(names(x))) === powers(titles(names(y)))) { out.party += 1; if (out.samples.length < 6) out.samples.push(`PARTY ${k}: ${x.slice(0, 90)} → ${y.slice(0, 90)}`); continue; }
    out.unexplained += 1;
    if (out.samples.length < 12) out.samples.push(`UNEXPLAINED ${a.label} ${k}: ${x.slice(0, 100)} → ${y.slice(0, 100)}`);
  }
  return out;
}

const byLabel = new Map(after.map((o) => [o.label, o]));
const lines = [];
lines.push(`# PEOPLE-2 aggregate — ${beforePath.split('/').pop()} → ${afterPath.split('/').pop()}`, '');
lines.push('| tier | settlements | cast roles filled before → after | of them people | people that are faces | absences | lever holders (of levers) | holders that are the lever house\'s face | lever houses with a face | seat row filled | seat row is rank 1 |');
lines.push('|---|---|---|---|---|---|---|---|---|---|---|');
for (const tier of [...TIERS, 'all']) {
  const pick = (rows) => rows.filter((o) => tier === 'all' || o.tier === tier);
  const b = castFigures(pick(before)); const a = castFigures(pick(after));
  if (!b.settlements) continue;
  lines.push(`| ${tier} | ${b.settlements} | ${b.roles} → ${a.roles} | ${b.people} → ${a.people} | ${b.faces} → ${a.faces} | ${b.absent} → ${a.absent} | ${b.held} → ${a.held} (of ${b.levers} → ${a.levers}) | ${b.heldByFace} → ${a.heldByFace} | ${b.houseHasFace} → ${a.houseHasFace} | ${b.seat} → ${a.seat} | ${b.seatRank1} → ${a.seatRank1} |`);
}
lines.push('');
const T = { settlements: 0, sheetsMoved: 0, lines: 0, moved: 0, name: 0, namePerson: 0, nameAdded: 0, title: 0, goal: 0, party: 0, cast: 0, order: 0, lever: 0, structure: 0, unexplained: 0 };
const samples = [];
for (const b of before.slice(0, limit)) {
  const a = byLabel.get(b.label);
  if (!a) continue;
  const d = tonightDiff(b, a);
  T.settlements += 1;
  if (d.moved) T.sheetsMoved += 1;
  for (const k of Object.keys(T)) if (k in d && k !== 'samples') T[k] += d[k];
  for (const s of d.samples) if (samples.length < 24) samples.push(s);
}
lines.push(`## Tonight — ${T.settlements} sheets, ${T.sheetsMoved} moved; ${T.lines} lines, ${T.moved} moved`, '');
lines.push('| class | lines |', '|---|---|');
lines.push(`| NAME (a roster name) | ${T.name} |`, `| NAME (the moved person's own role, want, secret, source) | ${T.namePerson} |`, `| NAME (a person named where none was, or no longer: the seat row filled, a cast role held by a person) | ${T.nameAdded} |`, `| TITLE | ${T.title} |`);
lines.push(`| OTHER — ORDER (the same values in another order: the roster's order is npcStructure's relevance order, step 3) | ${T.order} |`, `| OTHER — LEVER (the lever hook names the first lever house with a holder: the house's face, step 1) | ${T.lever} |`, `| OTHER — CAST (a crisis hook's cast row moved: its person, power and the cast's own reason travel together, steps 1–2) | ${T.cast} |`);
lines.push(`| OTHER — GOAL (the same person's want: the structural template, step 3) | ${T.goal} |`, `| OTHER — PARTY (a hook's "of <power>": the first-rank power, step 3) | ${T.party} |`);
lines.push(`| OTHER — STRUCTURE (a path on one side only) | ${T.structure} |`, `| OTHER — UNEXPLAINED | ${T.unexplained} |`, '');
if (samples.length) { lines.push('Samples:', '', ...samples.map((s) => `- ${s}`), ''); }
console.log(lines.join('\n'));
