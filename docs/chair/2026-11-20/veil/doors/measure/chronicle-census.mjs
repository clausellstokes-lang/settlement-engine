// VEIL-DOORS — THE CHRONICLE'S EVENT VOCABULARY, MEASURED (V10-1; VR20 (B)). Every event type the app's applyEvent can
// write (src/domain/events/registry.js's specs) narrated against a house hidden whole ('institution.black_market') and a
// person and a power, with every payload string planted: which strings the narrativeSummary carries. node chronicle-census.mjs <tree> <out>
import { writeFileSync } from 'node:fs';
const [tree, out] = process.argv.slice(2);
const reg = await import(`${tree}/src/domain/events/registry.js`);
const specs = reg.EVENT_SPECS || reg.EVENT_REGISTRY || reg.default || Object.values(reg).find((v) => v && typeof v === 'object' && v.ADD_INSTITUTION);
const town = { name: 'Rookford', npcs: [{ id: 'npc_vess', name: 'Vess' }], stressors: [] };
const PLANT = { criminalInstitution: 'PAYLOAD-ORG', institution: 'PAYLOAD-INST', role: 'PAYLOAD-ROLE', cause: 'PAYLOAD-CAUSE', name: 'PAYLOAD-NAME', faction: 'PAYLOAD-FACTION', label: 'PAYLOAD-LABEL', stressorType: 'PAYLOAD-STRESSOR', resource: 'PAYLOAD-RES', good: 'PAYLOAD-GOOD', deity: 'PAYLOAD-DEITY', relationship: 'PAYLOAD-REL', to: 'PAYLOAD-TO', direction: 'export', severity: 0.9 };
const rows = [];
for (const [type, spec] of Object.entries(specs)) {
  if (!spec || typeof spec.narrate !== 'function') { rows.push({ type, narrate: false }); continue; }
  const one = (targetId) => { try { return spec.narrate({ id: 'e1', type, targetId, payload: { ...PLANT }, cause: 'authoring' }, town); } catch (e) { return `THREW ${e.message}`; } };
  const s = one('institution.black_market');
  rows.push({ type, label: spec.label || null, requiresTarget: !!spec.requiresTarget, summary: s,
    namesTarget: /black market/i.test(s), payloadKeys: Object.keys(PLANT).filter((k) => typeof PLANT[k] === 'string' && s.includes(PLANT[k])) });
}
writeFileSync(out, JSON.stringify({ types: rows.length, rows }, null, 1));
console.log(rows.length, 'types;', rows.filter((r) => r.namesTarget).length, 'name the target;', rows.filter((r) => r.payloadKeys?.length).length, 'carry a payload string;', rows.filter((r) => !r.narrate).length, 'without narrate');
