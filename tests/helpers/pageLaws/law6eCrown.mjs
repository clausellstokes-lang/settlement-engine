// BAR7-AUDIT-I · LAW 6 WIDENED · 6e AGAIN, THE CROWN: a line that names a crown, a king, a realm or a royal thing in a town
// whose OWN facts give no sovereign. LAW 6's rule 6e (`law6.mjs :: law6e`, BAR6-AUDIT-C) reads a narrower word list
// (`SOV`: no "royal", no "king", no "realm") and spares every crown under a war or an occupation, because the atom
// (`src/domain/facts/sovereign.js :: sovereignOf`, the chair's SV1) lets a war or an occupation supply the realm's
// sovereign. The positive control C16768 ("Satisfy the crown requisition order", a war city whose government card says
// "No higher lord, no external charter"); the LOW rows "Crown supply carts", "a crown officer", "royal decrees".
// THE WIDE READ'S NEGATIVES STAND: a war's requisition in a town that HAS a sovereign of its own is true. So:
//   6e.no-higher  the page's own government card says the town has no higher lord ("No higher lord, no external charter",
//                 "governs itself ... as an independent polity"): a crown that commands the town is denied by the page,
//                 whatever the atom reads (C16768's town gives the atom a sovereign through "Noble Families", "the
//                 castellan", "the exchange's steward" and a noble founder: SOVEREIGN_WORDS reads a noble house, a
//                 steward and a castellan as a sovereign over the town) (counted; cause crisis where a war or an
//                 occupation stands)
//   6e.crown      no such card; no crisis supplies a sovereign and the town's own facts give none (counted)
//   6e.war-apart  no such card; a war or an occupation, the town's own facts give none (the atom's SV1: apart)
// Pure; reads one town read by `pageB.mjs :: readTown`; no I/O.
import { sentences } from './pageB.mjs';
import { SOV_FACT } from './law6.mjs';

export const CROWN = /\b(the crown(?:'s)?|crown (?:requisition|supply|officers?|officials?|orders?|carts|tax|taxes|levy|levies|agents?|authority|lands?|appointed|contracts?|pays|writ|charter|garrison|road)|a crown officer|crown-(?:appointed|chartered)|royal (?:decrees?|officers?|charter|writs?|tax|taxes|levy|court|road|seal|warrants?|authority|garrison|patent|assent)|the king(?:'s)?|the queen(?:'s)?|in the king's name|the realm(?:'s)?|by royal)\b/i;
const SPARED = /\bcrown or\b|\bor (?:the )?crown\b|\broyal or\b|\bor royal\b|\bno (?:lord|overlord|liege|crown|king)\b|\b(?:rival|nearby|neighbou?ring|surrounding|distant|foreign|other|enemy) (?:crowns?|kings?|realms?)\b|\bcrown (?:jewel|glass)\b|\bcrown of (?:the )?(?:hill|head|road|arch)\b/i;
const NO_HIGHER = /\b(No higher lord|no external charter|governs itself and its surrounding territory as an independent polity|answers to no lord|owes no lord)\b/;

/** the town's own facts (the crisis left out): the atom's sources, as `sovereign.js` spells them */
function ownSovereign(rec) {
  const ps = rec.powerStructure || {};
  const txt = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? JSON.stringify(v) : '');
  const live = (rec.institutions || []).filter((i) => i && !['ruined', 'removed', 'destroyed', 'remnant'].includes(String(i.status || 'active').toLowerCase())).map((i) => String(i.name || ''));
  const src = [txt(ps.government), txt(ps.governingName), ...(ps.factions || []).map((f) => txt(f?.faction)), ...live,
    ...(rec.npcs || []).flatMap((n) => [txt(n?.role), txt(n?.title)]), txt(rec.history?.founding)];
  return src.find((s) => s && SOV_FACT.test(s)) || null;
}

export function law6eCrown(T, town) {
  const rec = T.record || {};
  const outside = T.crises.has('wartime') || T.crises.has('occupied');
  const all = T.all.filter((x) => /^(Summary|Systems|World|Notes)\//.test(x.tab));
  let denial = null;
  for (const x of all) if (NO_HIGHER.test(x.text)) { denial = { tab: x.tab, line: sentences(x.text).find((s) => NO_HIGHER.test(s)) || x.text }; break; }
  const own = ownSovereign(rec);
  if (own && !denial) return [];
  const out = [];
  for (const x of all) {
    if (!CROWN.test(x.text)) continue;
    for (const s of sentences(x.text)) {
      const m = CROWN.exec(s); if (!m || SPARED.test(s) || /^(Connection:|Backs · )/.test(s)) continue;
      // "the rest of the realm" (the Rumors tab's heading) is the wide world, not a crown over the town: apart
      const world = /\bthe rest of the realm\b/i.test(s) && !/\b(crown|royal|king|queen)\b/i.test(s);
      // the founding row ("Founded by: · royal decree and a century of forced investment", 2 of the 720's 17) is the past: a
      // crown may have founded a town that rules itself now: apart
      const past = /^Founded by\b/.test(s);
      const rule = past ? '6e.founding' : world ? '6e.realm-world' : denial ? '6e.no-higher' : !outside ? '6e.crown' : '6e.war-apart';
      out.push({ law: 'L6', rule, town, tab: x.tab, line: x.text, sentence: s, cause: outside ? 'crisis' : 'other', word: m[0].toLowerCase(),
        against: denial || { tab: 'record', line: 'government, powers, houses, people and founding name no lord, crown or noble' },
        status: rule === '6e.war-apart' || rule === '6e.realm-world' || rule === '6e.founding' ? 'apart' : 'count',
        own: own || null,
        why: denial ? `"${m[0]}"; the page's government card says "${denial.line}"${own ? ` (the atom reads a sovereign from "${own.slice(0, 60)}")` : ''}${outside ? ' (a war does not make the town a crown\'s)' : ''}`
          : `"${m[0]}"; the town's own facts give no sovereign${outside ? ' (a war or an occupation supplies one by the atom: apart)' : ''}` });
    }
  }
  return out;
}
