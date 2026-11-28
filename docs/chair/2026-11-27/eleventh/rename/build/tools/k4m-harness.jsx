// K4 MEASURE: the share veil's stored addresses (`card:<kind>:<id>`, `field:<kind>:<id>:<field>`, galleryVeil.js CARD_KINDS)
// and the renames that re-key them. Per birth, every card id of every kind on the share payload, before and after each rename
// path, each by its writer: F the governing power (applyFactionRenameToSettlement, renameFactionImpl's writer), P the seat's
// holder else the first person (applyNpcRenameToSettlement), H the first house (applyInstitutionRenameToSettlement, no product
// caller), T the town (renameTownInRecord, renameSettlementImpl's). And: a DM's hide of the renamed entity's description,
// made before the rename, read on the served record (toPublicSafe + projectShareVeil) after it.
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { applyFactionRenameToSettlement, applyNpcRenameToSettlement } from 'TREE/src/domain/factionRename.js';
import { applyInstitutionRenameToSettlement } from 'TREE/src/domain/institutionRename.js';
import { renameTownInRecord } from 'TREE/src/domain/townRename.js';
import { governingFactionOf, nameOf } from 'TREE/src/domain/rulingPower.js';
import { galleryPayloadFor, CARD_KINDS, writeShareVeil, projectShareVeil } from 'TREE/src/domain/display/galleryVeil.js';
import { toPublicSafe } from 'TREE/src/domain/display/publicSafe.js';
import { appendFileSync } from 'node:fs';
const clone = (v) => JSON.parse(JSON.stringify(v));
const copiesOf = (s, kind) => CARD_KINDS[kind].lists.flatMap((path) => {
  const star = path.indexOf('*');
  const at = (root, p) => { let cur = root; for (const seg of p) cur = cur && typeof cur === 'object' && !Array.isArray(cur) ? cur[seg] : undefined; return Array.isArray(cur) ? cur.filter((x) => x && typeof x === 'object' && !Array.isArray(x)) : []; };
  return star < 0 ? at(s, path) : at(s, path.slice(0, star)).flatMap((o) => at(o, path.slice(star + 1)));
});
const idsOf = (s) => { const pub = galleryPayloadFor(s); const out = {}; for (const kind of Object.keys(CARD_KINDS)) out[kind] = [...new Set(copiesOf(pub, kind).map((c) => CARD_KINDS[kind].idOf(c)).filter(Boolean))]; return out; };
const served = (t, ov) => projectShareVeil(toPublicSafe(t, { full: false, memberOverrides: ov }), ov);
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line;
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const B = idsOf(born); const ids = Object.fromEntries(Object.entries(B).map(([k, v]) => [k, v.length]));
      const withIdCount = { npc: (born.npcs || []).filter((n) => n?.id).length, institution: (born.institutions || []).filter((i) => i?.id).length,
        faction: (born.powerStructure?.factions || []).filter((f) => f?.id).length };
      const paths = {};
      const g = governingFactionOf(born); const gname = g ? nameOf(g) : null;
      const person = (born.npcs || []).find((n) => n?.name)?.name || null; const house = (born.institutions || []).find((i) => i?.name)?.name || null;
      const R = {
        F: gname ? (() => { const r = clone(born); applyFactionRenameToSettlement(r, gname, 'The Ashen Compact'); return { r, kind: 'faction', find: (s) => (s.powerStructure?.factions || []).find((f) => nameOf(f) === 'The Ashen Compact'), idOld: CARD_KINDS.faction.idOf(g) }; })() : null,
        P: person ? (() => { const r = clone(born); applyNpcRenameToSettlement(r, person, 'Quill Marsh'); const n = (born.npcs || []).find((x) => x.name === person); return { r, kind: 'npc', find: (s) => (s.npcs || []).find((x) => x.name === 'Quill Marsh'), idOld: CARD_KINDS.npc.idOf(n) }; })() : null,
        H: house ? (() => { const r = clone(born); applyInstitutionRenameToSettlement(r, house, 'Greywater Hall'); const i = (born.institutions || []).find((x) => x.name === house); return { r, kind: 'institution', find: (s) => (s.institutions || []).find((x) => x.name === 'Greywater Hall'), idOld: CARD_KINDS.institution.idOf(i) }; })() : null,
        T: (() => ({ r: renameTownInRecord(clone(born), born.name, 'Quillmarsh'), kind: null }))(),
      };
      for (const [k, v] of Object.entries(R)) {
        if (!v) { paths[k] = { skip: true }; continue; }
        const A = idsOf(v.r); const lost = {};
        for (const kind of Object.keys(B)) { const gone = B[kind].filter((id) => !A[kind].includes(id)); if (gone.length) lost[kind] = gone.length; }
        const res = { lost };
        if (v.kind) {
          const addr = `field:${v.kind}:${v.idOld}:description`;
          const ov = writeShareVeil(null, [{ address: addr, hidden: true }]);
          const keys = CARD_KINDS[v.kind].fields.description || ['desc', 'description']; const dOf = (c) => { if (!c) return null; for (const k of keys) { const x = c[k]; if (x != null && x !== '' && !(Array.isArray(x) && !x.length)) return x; } return null; }; const descOf = (s) => dOf(v.find(s) || null);
          const desc = (s) => { const pub = served(s, ov); const card = v.kind === 'faction' ? (pub.powerStructure?.factions || []).find((f) => f?.isGoverning || nameOf(f) === 'The Ashen Compact') : v.kind === 'npc' ? (pub.npcs || []).find((x) => x?.name === 'Quill Marsh' || x?.name === person) : (pub.institutions || []).find((x) => x?.name === 'Greywater Hall' || x?.name === house); return dOf(card); };
          const has = !!descOf(v.r);
          res.hide = has ? { addr, hiddenBefore: !desc(born), hiddenAfter: !desc(v.r), idNew: CARD_KINDS[v.kind].idOf(v.find(v.r)) } : { noDescription: true };
        }
        paths[k] = res;
      }
      line = { seed: row.seed, size: row.size, ids, withIdCount, paths };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 800) }; }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
  }
}
