// BAR5-AUDIT-B · the page as printed, read into the parts a law needs (seat B: laws 2 and 3).
// Pure functions over one PAGE-COPY dump (`== <group>/<tab> ==` headings, then the tab's lines) and its record.
// Nothing here changes anything; a detector reads `readTown(dumpText, record)` and returns instances.

export const DOSSIER = /^(Summary|Systems|World|Notes|Table)\//;

/** Split a dump into { tabName: [lines] }, keeping only the dossier tabs (the PDF and the journal are copies). */
export function splitTabs(text, keep = DOSSIER) {
  const tabs = {};
  let cur = null;
  for (const raw of text.split('\n')) {
    const m = raw.match(/^== (.+) ==$/);
    if (m) { cur = keep.test(m[1]) ? m[1] : null; if (cur) tabs[cur] = []; continue; }
    if (cur && raw.trim()) tabs[cur].push(raw);
  }
  return tabs;
}

/** A row's own crisis mark, as the page prints it. */
export const MARK_LEAD = /^(Stopped by|Curtailed by|Scarce in|Short of)\b/;
export const MARK_ANY = /(Stopped by the|Curtailed by the|Scarce in the|Short of [a-z]|\((stopped|curtailed|scarce|short)\b[^)]*\)|\bImpaired\b)/;
export const CHIP_MARK = /\((stopped|curtailed|scarce|short)\b[^)]*\)/;

/** Sentences of a line (a row of cells counts as one sentence). */
export function sentences(line) {
  if (line.includes(' · ')) return [line];
  return line.split(/(?<=[.!?])\s+(?=[A-Z"'“])/).map((s) => s.trim()).filter(Boolean);
}

const fold = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
export { fold };

/** Institutions: cards { name, cat, head, marked, lines:[{i,text}], chips:[{name, marked}], chipLine } */
export function readCards(lines = []) {
  const cards = [];
  let card = null;
  // a card's heading: "<name> · <Category>[ · <state>]" (the category one capitalised word or an "&" pair)
  const isHead = (l) => /^[^·]+ · [A-Z][A-Za-z]+( & [A-Z][A-Za-z]+)?( · [A-Z][A-Za-z ]+)?$/.test(l) && !/^(Backs|Services|Connection|Law & order)\b/.test(l);
  lines.forEach((l, i) => {
    if (isHead(l)) {
      const parts = l.split(' · ');
      card = { name: parts[0].trim(), cat: parts[1] || '', head: l, headIdx: i, marked: /· Impaired\b|· Stopped\b/.test(l), lines: [], chips: [], chipIdx: -1 };
      cards.push(card);
      return;
    }
    if (!card) return;
    if (/^Services · /.test(l)) {
      card.chipIdx = i;
      card.chipLine = l;
      card.chips = l.replace(/^Services · /, '').split(' · ').map((c) => ({ name: c.replace(CHIP_MARK, '').replace(/\(a day away\)/, '').trim(), raw: c, marked: CHIP_MARK.test(c) }));
      return;
    }
    if (/^(Backs|Connection)/.test(l)) return;
    card.lines.push({ i, text: l });
    if (MARK_LEAD.test(l)) card.marked = true;
  });
  return cards;
}

/** Services tab: entries { title, titleIdx, desc, descIdx, house, needs, marked } found by their house line. */
export function readServiceEntries(lines = [], houseNames) {
  const out = [];
  lines.forEach((l, i) => {
    if (!houseNames.has(l.trim()) || i < 2) return;
    const title = lines[i - 2], desc = lines[i - 1];
    const needs = /^Needs /.test(lines[i + 1] || '') ? lines[i + 1] : null;
    const titleName = title.replace(/\s+Impaired$/, '').replace(CHIP_MARK, '').trim();
    out.push({ title: titleName, titleRaw: title, titleIdx: i - 2, desc, descIdx: i - 1, house: l.trim(), houseIdx: i, needs,
      marked: /\sImpaired$/.test(title) || CHIP_MARK.test(title) || MARK_LEAD.test(desc) });
  });
  return out;
}

/** Economics: chain blocks { name, head, state, marked, from, via:[..], outputs, outIdx, yieldsNormally, lines } */
export function readChains(lines = []) {
  const out = [];
  let ch = null;
  const HEAD = /^(.+?) · (.+?)(✓ Running|○ Operational| · Impaired| · Vulnerable| · Stopped| · Failed|✗ [A-Za-z]+)\s*$/;
  // BAR5-CHAINS (2026-11-16): a card that prints NO state (`chainStateShown.js :: NO_STATE_SHOWN`: a chain run only through
  // an "Access to …" row) is a card too: its head is "<name> · <Category>" straight before its From or Via. Read as no head,
  // its Via was read as the card above's (3 of the 13 L3.chainOverStopped of the 720 and the 300: "Black market … Operational
  // over (Access to a house of worship)").
  const STATELESS = /^(.+?) · ([A-Z][^·]*)$/;
  lines.forEach((l, i) => {
    const m = l.match(HEAD) || (/^(From|Via)$/.test(lines[i + 1] || '') && l.match(STATELESS) ? [l, ...l.match(STATELESS).slice(1, 3), ''] : null);
    if (m && !/^(From|Via|Outputs|Normally yields)$/.test(l)) {
      ch = { name: m[1].trim(), cat: m[2].trim(), state: m[3].replace(/^ · /, '').trim(), head: l, headIdx: i, lines: [], via: [], from: [], outputs: null, outIdx: -1, yieldsNormally: false };
      ch.marked = /Impaired|Stopped|Failed|✗/.test(ch.state);
      out.push(ch);
      return;
    }
    if (!ch) return;
    if (/^(Income Sources|Trade Profile|Food Security|Economic Flows)/.test(l)) { ch = null; return; }
    const prev = lines[i - 1];
    if (prev === 'Via') ch.via = l.split(' · ').map((s) => s.trim());
    else if (prev === 'From') ch.from = l.split(' · ').map((s) => s.trim());
    else if (prev === 'Outputs' || prev === 'Normally yields') { ch.outputs = l; ch.outIdx = i; ch.yieldsNormally = prev === 'Normally yields'; }
    ch.lines.push({ i, text: l });
    if (MARK_LEAD.test(l)) ch.marked = true;
  });
  return out;
}

/** The economics tab's lines that are not inside a chain block (income rows, trade profile, food security). */
export function economicsSections(lines = []) {
  const sec = {}; let cur = 'head';
  for (const [i, l] of lines.entries()) {
    const m = l.match(/^(Income Sources|Trade Profile|Food Security|Economic Flows)/);
    if (m) { cur = m[1]; sec[cur] = []; continue; }
    (sec[cur] ||= []).push({ i, text: l });
  }
  return sec;
}

/** One town, read. */
export function readTown(text, record) {
  const tabs = splitTabs(text);
  const cards = readCards(tabs['Systems/Institutions']);
  const houseNames = new Set(cards.map((c) => c.name));
  const services = readServiceEntries(tabs['Systems/Services'], houseNames);
  const chains = readChains(tabs['Systems/Economics']);
  const st = record?.stress; const crises = new Set((Array.isArray(st) ? st : st ? [st] : []).map((x) => x?.type).filter(Boolean));
  const all = Object.entries(tabs).flatMap(([tab, ls]) => ls.map((text, i) => ({ tab, i, text })));
  const pageHas = (re) => all.find((x) => re.test(x.text)) || null;
  return { tabs, cards, houseNames, services, chains, crises, record, all, pageHas };
}

const lastAt = (arr, key, i) => { let r = null; for (const x of arr) if (x[key] <= i) r = x; return r; };
export const cardAt = (T, i) => lastAt(T.cards, 'headIdx', i);
export const entryAt = (T, i) => { const e = lastAt(T.services, 'titleIdx', i); return e && i <= (e.needs ? e.houseIdx + 1 : e.houseIdx) ? e : null; };
export const chainAt = (T, i) => lastAt(T.chains, 'headIdx', i);

/** Is line i of a tab marked by its own row, card, entry or chain? Returns the mark's kind, or null. */
export function lineMarked(T, tab, i) {
  const line = T.tabs[tab]?.[i] || '';
  if (MARK_LEAD.test(line)) return 'own';
  if (tab === 'Systems/Institutions') { const c = cardAt(T, i); if (c?.marked) return 'card'; }
  if (tab === 'Systems/Services') {
    const e = entryAt(T, i);
    if (e?.marked) return 'entry';
    const c = e && T.cards.find((c) => c.name === e.house);
    if (c?.marked) return 'card';
  }
  if (tab === 'Systems/Economics') {
    const ch = chainAt(T, i); if (ch?.marked) return 'chain';
    if (ch && ch.yieldsNormally && i === ch.outIdx) return 'normally'; // "Normally yields": the chain says it is not yielding now
  }
  return null;
}
