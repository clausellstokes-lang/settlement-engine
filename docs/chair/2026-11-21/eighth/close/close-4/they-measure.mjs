// CLOSE-4: every template (both callers of secondMentions) where a LATER mention of a person is followed, in its own clause, by a they-form
const T = process.env.TREE;
const { STRESS_ECONOMIC_EFFECTS, HANDLER_TIE_ARCHETYPES } = await import(T + '/src/data/npcData.js');
const { GOAL_FAMILY_LINES, GOAL_RESERVE_LINES } = await import(T + '/src/data/people/goalFamilies.js');
const { secondMentions } = await import(T + '/src/data/people/personMention.js');
const R = 'Rhona Ashby', S = 'Silas Brent';
const FORCE = { body: 'garrison', members: 'soldiers', member: 'soldier' };
const PERSON_SLOTS = ['above', 'below', 'other', 'handler', 'agent', 'target'];
const out = [];
const THEY = /\b(themselves|themself|theirs|their|them|they)\b/i;
const SPLIT = /((?<=[.!?…]["”')]?)\s+(?=["“'(]?\p{Lu}))/u;
function scan(id, text, names) {
  for (const part of text.split(SPLIT)) {
    const hits = [];
    for (const n of names) { let i = -1; while ((i = part.indexOf(n, i + 1)) >= 0) hits.push({ n, start: i, end: i + n.length }); }
    hits.sort((a, b) => a.start - b.start);
    const seen = new Set();
    for (const h of hits) {
      if (!seen.has(h.n)) { seen.add(h.n); continue; }
      const rest = part.slice(h.end);
      const clause = rest.split(/[.;:!?]/)[0];
      const m = THEY.exec(clause);
      if (m) out.push({ id, who: h.n === R ? 'r' : 's', tail: clause.slice(0, m.index + m[0].length).trim(), sentence: part });
    }
  }
}
for (const [tn, table] of [['STRESS_ECONOMIC_EFFECTS', STRESS_ECONOMIC_EFFECTS], ['HANDLER_TIE_ARCHETYPES', HANDLER_TIE_ARCHETYPES]]) {
  for (const [key, row] of Object.entries(table)) for (const field of ['desc', 'tension']) {
    (row[field]?.lines || []).forEach((v, i) => {
      for (const [which, fn] of [['line', typeof v === 'function' ? v : v?.line], ['twin', v?.twin]]) {
        if (typeof fn === 'function') scan(`${tn}.${key}.${field}[${i}].${which}`, fn({ name: R }, { name: S }, FORCE), [R, S]);
      }
    });
  }
}
const walk = (node, path) => {
  if (Array.isArray(node)) { node.forEach((n, i) => walk(n, `${path}[${i}]`)); return; }
  const tpl = typeof node === 'string' ? node : typeof node?.line === 'string' ? node.line : typeof node?.text === 'string' ? node.text : null;
  if (tpl !== null) { if (PERSON_SLOTS.some((k) => tpl.includes(`{${k}}`))) { const t = tpl.replace(/\{(\w+)(?:\|[^}]*)?\}/g, (_w, k) => (PERSON_SLOTS.includes(k) ? R : 'Xpower')); scan(path, t[0].toUpperCase() + t.slice(1), [R]); } return; }
  if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
};
walk(GOAL_FAMILY_LINES, 'GOAL_FAMILY_LINES'); walk(GOAL_RESERVE_LINES, 'GOAL_RESERVE_LINES');
for (const o of out) {
  const cards = o.id.startsWith('GOAL') ? [{ name: R, gender: 'male' }] : [{ name: S, gender: 'male' }, { name: R, gender: 'female' }];
  o.printed = secondMentions(o.sentence, cards);
  console.log(`${o.id}\t${o.who}\t«${o.tail}»\n    ${o.printed}`);
}
console.log('candidates', out.length, 'templates', new Set(out.map((o) => o.id)).size);
