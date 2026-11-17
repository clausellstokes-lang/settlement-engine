// BAR8-AUDIT-K · the page as printed, read into the parts LAWS 12 to 15 need (seat K).
// A WRAPPER beside the shared readers: it calls `pageC.mjs :: readTownC` (itself over `pageB.mjs :: readTown`) unchanged
// and adds what seat K's laws read a line against: the Legal Infrastructure row, the crime structure's own note, the
// person cards of World/NPCs (house line, title line, every line, the record's card), the plot hooks by person, the
// powers' cards and their tie lines, the Magic tab's reliance row, the threat bars. Pure; no I/O; changes nothing.
import { readTownC, sentences, MARK_LEAD } from './pageC.mjs';

export { sentences, MARK_LEAD };

const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** A crisis that changes what an ordinary day is (the record's `stress[].type`). */
export const LIVE_CRISES = ['under_siege', 'famine', 'plague_onset', 'wartime', 'occupied', 'insurgency', 'mass_migration', 'monster_threat', 'succession_crisis', 'religious_conversion', 'indebted'];
export const HARD_CRISES = ['under_siege', 'famine', 'plague_onset', 'wartime', 'occupied'];

/** The person cards of World/NPCs, keyed by the record's own roster. */
function readPeople(T) {
  const lines = T.tabs['World/NPCs'] || [];
  const npcs = Array.isArray(T.record?.npcs) ? T.record.npcs : [];
  const starts = [];
  for (const n of npcs) {
    if (!n?.name) continue;
    const re = new RegExp(`^${esc(n.name)}[●◆]*$`);
    const i = lines.findIndex((l) => re.test(l));
    if (i >= 0) starts.push({ i, n });
  }
  starts.sort((a, b) => a.i - b.i);
  return starts.map(({ i, n }, k) => {
    const end = k + 1 < starts.length ? starts[k + 1].i : lines.length;
    let j = i + 1;
    while (j < end && /^[▲▼]$/.test(lines[j])) j++;
    const house = lines[j] || '';
    const title = lines[j + 1] || '';
    const body = [];
    for (let x = i + 1; x < end; x++) body.push({ i: x, text: lines[x] });
    return { name: n.name, npc: n, idx: i, end, house, houseIdx: j, title, titleIdx: j + 1, body };
  });
}

/** Summary/Plot Hooks: { name, i, hook } (a person's name line, then the hook). */
function readHooks(T) {
  const lines = T.tabs['Summary/Plot Hooks'] || [];
  const names = new Set((T.record?.npcs || []).map((n) => n?.name).filter(Boolean));
  const out = [];
  lines.forEach((l, i) => { if (names.has(l.trim()) && lines[i + 1] && !names.has(lines[i + 1].trim())) out.push({ name: l.trim(), i: i + 1, hook: lines[i + 1] }); });
  return out;
}

/** The Defense tab's Legal Infrastructure row: its status word and its note. */
function readLegal(T) {
  const def = T.tabs['Systems/Defense'] || [];
  const i = def.findIndex((l) => /^Legal Infrastructure · /.test(l));
  if (i < 0) return null;
  const status = def[i].replace(/^Legal Infrastructure · /, '').trim();
  return { i, status, note: def[i + 1] || '', line: def[i], court: /court|bench/i.test(status), prison: /prison/i.test(status) };
}

/** The threat bars of the Defense tab: { label, word, i, under: [{ i, text }] } (the lines printed under a bar until the next). */
const BAR_LABELS = ['Beasts & Monsters', 'Invasion & War', 'Internal Security', 'Economic Survival', 'Disasters & Famine'];
function readBars(T) {
  const def = T.tabs['Systems/Defense'] || [];
  const out = [];
  def.forEach((l, i) => {
    if (!BAR_LABELS.includes(l) || !/^[A-Z][a-z]+[▲▼]?$/.test(def[i + 1] || '')) return;
    const under = [];
    for (let j = i + 2; j < def.length && !BAR_LABELS.includes(def[j]) && !/^Criminal Architecture/.test(def[j]); j++) under.push({ i: j, text: def[j] });
    out.push({ label: l, word: def[i + 1].replace(/[▲▼]/g, ''), i: i + 1, under });
  });
  return out;
}

/** One town, read for laws 12 to 15. */
export function readTownK(text, record) {
  const T = readTownC(text, record);
  T.people = readPeople(T);
  T.personByName = new Map(T.people.map((p) => [p.name, p]));
  T.hooks = readHooks(T);
  T.legal = readLegal(T);
  T.bars = readBars(T);
  T.name = String(record?.name || '');
  T.stripName = (s) => (T.name ? String(s).split(T.name).join('{settlement}') : String(s));
  // every dossier sentence (a row of cells is one sentence), with its tab and line index
  T.sents = [];
  for (const [tab, ls] of Object.entries(T.tabs)) {
    if (!/^(Summary|Systems|World|Notes)\//.test(tab)) continue;
    ls.forEach((line, i) => { for (const s of sentences(line)) T.sents.push({ tab, i, line, s }); });
  }
  T.findSent = (re, tabRe = /./) => T.sents.filter((x) => tabRe.test(x.tab) && re.test(x.s));
  // the house cards' own marks (the card's own lead line, or a state on its head)
  T.cardMark = (c) => {
    if (!c) return null;
    const lead = c.lines.find((l) => MARK_LEAD.test(l.text));
    if (lead) return lead.text.match(/^(Stopped by the \w+|Curtailed by the \w+|Scarce in the \w+|Short of [^.]+)/)?.[0] || 'marked';
    if (/· (Impaired|Stopped)\b/.test(c.head)) return c.head.split(' · ').pop();
    return null;
  };
  return T;
}
