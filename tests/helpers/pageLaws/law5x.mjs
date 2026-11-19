// BAR7-AUDIT-I · LAW 5 WIDENED · 5x A SLASH LABEL AS A SENTENCE'S SUBJECT: a house's or a power's roster label that joins two
// names with a slash ("Weavers/Textile workers", "Military/Guard") printed inside a prose sentence (the positive control
// C25601: "Jómsmo's Weavers/Textile workers can offer less ..."). A row of cells (` · `), a heading, a chip and a label on
// a line of its own are the label's own place and are not counted. The labels are read from the town's own record
// (its houses and its powers), so a slash the page prints for anything else is not read. Pure; no I/O.
import { sentences } from './pageB.mjs';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function slashLabels(rec) {
  const names = [...(rec?.institutions || []).map((i) => String(i?.name || '')), ...(rec?.powerStructure?.factions || []).map((f) => String(f?.faction || ''))];
  return [...new Set(names.filter((n) => /\S\/\S/.test(n)))];
}

export function law5x(T, town) {
  const labels = slashLabels(T.record).sort((a, b) => b.length - a.length);
  if (!labels.length) return [];
  const re = new RegExp(labels.map(esc).join('|'));
  const out = [];
  for (const x of T.all) {
    if (!/^(Summary|Systems|World|Notes)\//.test(x.tab) || !re.test(x.text) || x.text.includes(' · ')) continue;
    for (const s of sentences(x.text)) {
      const m = re.exec(s); if (!m) continue;
      const words = s.split(/\s+/).length;
      // prose: a sentence of five words or more that ends in a stop (a label alone, a heading or a chip is not prose)
      if (words < 5 || !/[.!?]["”’]?$/.test(s.trim())) continue;
      // a label as one item of a list ("...: Mills, Weavers/Textile workers, Bakers.") is the label in its place: apart
      const listed = new RegExp(`(?:: |, )${esc(m[0])}(?:,|\\.$| and )`).test(s);
      out.push({ law: 'L5', rule: listed ? '5x.slash-list' : '5x.slash', town, tab: x.tab, line: x.text, sentence: s, label: m[0], cause: 'other', status: listed ? 'apart' : 'count',
        against: { tab: 'record', line: `roster label "${m[0]}"` }, why: `the roster label "${m[0]}" is printed as a name inside a sentence` });
    }
  }
  return out;
}
