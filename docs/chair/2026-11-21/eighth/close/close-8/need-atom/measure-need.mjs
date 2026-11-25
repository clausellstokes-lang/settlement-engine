// NEED-ATOM (CLOSE-8's cure 3b): the every-birth check. For each birth:
//   eq        needListOf(record) equals the page's own list (`importsAsPrinted(record).needed`), label by label;
//   dealt     the needs the page drops as "dealt in here" (the list with no service row read, less the page's list);
//   bad       of those, each one the ORACLE refuses: an oracle INDEPENDENT of the leaf (it imports nothing of
//             needNotBroughtIn.js): the raw roster (`record.institutions`, standing by its own status words), the record's
//             service rows, the catalogue of what a house needs (`economicData.js :: TRADE_DEPENDENCY_NEEDS`, its grounds read
//             through `crisisDependence.js :: SPENT_GROUND_YIELD`) and the page's own mark (`crisisStoppedRow.js :: rowShortOf`).
//             A dropped need is good only where a STANDING house's printed row deals in it and is not marked short of it,
//             and no standing house the catalogue says needs it is marked short of it.
//   atom      what the atom's readers return (needListOf, needNotBroughtInOf), for "what any reader returns" before/after;
//   keys      per-field hashes of the record (tools/measure-keys.mjs), for "records moved".
import { measure as keysOf } from '../tools/measure-keys.mjs';

let M = null;
async function mods(tree) {
  if (M) return M;
  M = {
    tl: await import(/* @vite-ignore */ `${tree}/src/domain/display/tradeListDisplay.js`),
    nn: await import(/* @vite-ignore */ `${tree}/src/domain/facts/needNotBroughtIn.js`),
    cr: await import(/* @vite-ignore */ `${tree}/src/domain/display/crisisStoppedRow.js`),
    ed: await import(/* @vite-ignore */ `${tree}/src/data/economicData.js`),
    cd: await import(/* @vite-ignore */ `${tree}/src/data/crisisDependence.js`),
  };
  return M;
}

const DOWN = new Set(['ruined', 'removed', 'destroyed', 'remnant']);
const standingOf = (town) => (Array.isArray(town?.institutions) ? town.institutions : [])
  .filter((i) => i && typeof i === 'object' && i._worldPulseInactive !== true && !DOWN.has(String(i.status || 'active').toLowerCase()));
const words = (s) => String(s ?? '').toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[^a-z]+/).filter(Boolean);
/** the good's head noun as the dealing rows and the catalogue name it ("livestock") */
const HEADS = ['livestock'];
const headOf = (need) => HEADS.find((h) => words(need).includes(h)) || '';

export async function measure(town, { tree }) {
  const { tl, nn, cr, ed, cd } = await mods(tree);
  const page = tl.importsAsPrinted(town).needed;
  const leaf = nn.needListOf(town);
  const eq = JSON.stringify(page) === JSON.stringify(leaf);
  const bare = tl.importsAsPrinted({ ...town, availableServices: {} }).needed;
  const dealt = bare.filter((n) => !page.includes(n));
  const standing = standingOf(town);
  const names = new Set(standing.map((i) => String(i.name ?? '')));
  const av = town?.availableServices;
  const rows = (Array.isArray(av) ? av : av && typeof av === 'object' ? Object.values(av).flat() : []).filter((r) => r && typeof r === 'object');
  const shortOf = (inst) => { const m = cr.rowShortOf(town, 'house', inst); return typeof m === 'string' ? m : ''; };
  const bad = [];
  for (const need of dealt) {
    const head = headOf(need);
    const grounds = Object.entries(cd.SPENT_GROUND_YIELD).filter(([, y]) => y === head).map(([g]) => g);
    const dealers = rows.filter((r) => head && words(r.name).includes(head) && names.has(String(r.institution ?? '')))
      .map((r) => standing.find((i) => i.name === r.institution)).filter((i) => i && !words(shortOf(i)).includes(head));
    const needers = standing.filter((i) => { const n = ed.TRADE_DEPENDENCY_NEEDS[String(i.name)]; return !!n && (words(n.label).includes(head) || (n.resources || []).some((g) => grounds.includes(g))); });
    const shortNeeders = needers.filter((i) => words(shortOf(i)).includes(head)).map((i) => `${i.name}: ${shortOf(i)}`);
    if (!head || !dealers.length || shortNeeders.length) bad.push({ need, head, dealers: dealers.map((i) => i.name), shortNeeders });
  }
  return { eq, page, leaf, dealt, bad, atom: { list: leaf, keys: nn.needNotBroughtInOf(town) ?? null }, ...keysOf(town) };
}
