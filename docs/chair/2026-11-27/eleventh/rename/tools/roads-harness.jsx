/**
 * (B) WHAT SURVIVES THE ROADS: by execution on ten towns of C. For each road, the record that comes out of it, and the
 * identity parts of (A)'s keys read off it: town _seed / id / name; the person (the seat's holder, else the first named
 * person) id / name; the first house (institution) id / name; the first power id / name.
 * Roads (product functions; glue named where a function is not exported):
 *  R1 local save + reload   lib/saves.js :: saves.save -> saves.list (local mode: supabase mocked isConfigured=false)
 *  R1c cloud reload         lib/saves.js :: admitSupabaseSavedSettlementRows over a row whose `data` is the stamped record
 *                           (the row builder mutationRow / supabaseSave writes withPublicProse(settlement, stamp): replicated)
 *  R2 JSON export + import  lib/accountData.js :: buildAccountExport -> JSON -> lib/accountImport.js :: validateAccountImport
 *                           -> prepareSettlementEntry
 *  R3 the shared page       toPublicSafe(.., {full:false}) -> projectShareVeil(.., null)
 *  R4 gallery import        [SQL _gallery_sanitize_public_json: NOT executable here; mirrored by toPublicSafe(full:false)]
 *                           -> lib/gallery.js :: stripImportConfidential (not exported: replicated, 8 deletes) -> veilPublicPayload
 *                           -> store/galleryImportSettlement.js's entry transform (normalizeSettlement + the four scrubs)
 *  R5 PDF composer input    normalizeSettlement -> pdf/lib/viewModel.js :: buildViewModel (vm.raw)
 *  R6 Foundry export        buildFoundryModuleFiles (files: the identity parts found in the written files)
 */
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { toPublicSafe, veilPublicPayload } from 'TREE/src/domain/display/publicSafe.js';
import { projectShareVeil } from 'TREE/src/domain/display/galleryVeil.js';
import { saves, admitSupabaseSavedSettlementRows } from 'TREE/src/lib/saves.js';
import { buildAccountExport } from 'TREE/src/lib/accountData.js';
import { validateAccountImport, prepareSettlementEntry, ensureNormalizeLoaded } from 'TREE/src/lib/accountImport.js';
import { normalizeSettlement } from 'TREE/src/domain/normalizeSettlement.js';
import { scrubImportedConfig, scrubImportedTreasury, scrubGalleryImportLivingContent, scrubImportedEditState } from 'TREE/src/lib/importScrub.js';
import { buildViewModel } from 'TREE/src/pdf/lib/viewModel.js';
import { buildFoundryModuleFiles } from 'TREE/src/foundry/moduleBuilder.js';
import { holderOf } from 'TREE/src/domain/seat/holderOfSeat.js';
import { appendFileSync } from 'node:fs';

const clone = (v) => JSON.parse(JSON.stringify(v));

function who(town) {
  let person = null;
  try { const h = holderOf(town, { audience: 'owner' }); const nm = h?.person?.name; if (nm && (town.npcs || []).some((n) => n?.name === nm)) person = nm; } catch { /* */ }
  if (!person) person = (town.npcs || []).find((n) => n?.name)?.name || null;
  const p = (town.npcs || []).find((n) => n?.name === person) || null;
  const h = (town.institutions || [])[0] || null;
  const f = (town.powerStructure?.factions || [])[0] || null;
  return { personName: person, personId: p?.id ?? null, houseName: h?.name ?? null, houseId: h?.id ?? null, powerName: f ? (f.faction ?? f.name ?? null) : null, powerId: f?.id ?? null };
}

/** Read the identity parts off a record that came out of a road, following the SOURCE's people by position/id. */
function read(rec, src) {
  if (!rec || typeof rec !== 'object') return null;
  const w = who(src);
  const p = (rec.npcs || []).find((n) => (w.personId && n?.id === w.personId)) || (rec.npcs || []).find((n) => n?.name === w.personName) || null;
  const h = (rec.institutions || [])[0] || null;
  const f = (rec.powerStructure?.factions || [])[0] || null;
  return {
    _seed: rec._seed ?? null, id: rec.id ?? null, name: rec.name ?? null,
    personName: p ? (p.name ?? null) : '(person absent)', personId: p ? (p.id ?? null) : '(person absent)',
    houseName: h?.name ?? null, houseId: h?.id ?? null,
    powerName: f ? (f.faction ?? f.name ?? null) : null, powerId: f?.id ?? null,
    configSeed: rec.config?._seed ?? null, hasConfig_: !!rec._config, publicProse: !!rec.publicProse,
    npcCount: (rec.npcs || []).length,
  };
}

export async function run(plan, out) {
  await loadGenerationLawPayloads();
  await ensureNormalizeLoaded();
  for (const row of plan) {
    const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const stamped = withPublicProse(born, composePublicProse(born));
    const src = born;
    const res = { seed: row.seed, source: read(stamped, src) };
    const entry = { name: born.name, tier: born.tier, settlement: clone(stamped), config: born._config || null, seed: born._seed || null, aiData: {}, campaignState: { phase: 'draft', eventLog: [] }, versionHistory: [] };
    // R1 local
    try {
      try { globalThis.localStorage.clear(); } catch { /* */ }
      const id = await saves.save(clone(entry));
      const list = await saves.list();
      const back = list.find((e) => String(e.id) === String(id)) || list[0];
      res.R1_local = read(back?.settlement, src); res.R1_local_rowName = back?.name ?? null;
    } catch (e) { res.R1_local = { error: String(e).slice(0, 300) }; }
    // R1c cloud reload
    try {
      const rowc = { id: '00000000-0000-4000-8000-000000000001', user_id: 'u', name: born.name, tier: born.tier, data: clone(stamped), config: entry.config, seed: entry.seed, ai_data: {}, campaign_state: entry.campaignState, version_history: [], toggles: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
      const ad = await admitSupabaseSavedSettlementRows([rowc]);
      res.R1_cloud = read(ad.entries[0]?.settlement, src); res.R1_cloud_diag = (ad.diagnostics || []).length;
    } catch (e) { res.R1_cloud = { error: String(e).slice(0, 300) }; }
    // R2 JSON export + import
    try {
      const exp = buildAccountExport({ auth: { user: { id: 'u', email: null } }, savedSettlements: [{ ...clone(entry), id: 'local-1' }], campaigns: [], customContent: {} });
      const text = typeof exp === 'string' ? exp : JSON.stringify(exp);
      const v = validateAccountImport(text);
      if (!v.ok) throw new Error(`validate: ${v.reason || JSON.stringify(v).slice(0, 200)}`);
      const p = prepareSettlementEntry(v.value.settlements[0], { sourceName: 'export.json' });
      if (!p.ok) throw new Error(`prepare: ${p.reason}`);
      res.R2_export = read(JSON.parse(text).settlements?.[0]?.settlement, src);
      res.R2_import = read(p.entry.settlement, src); res.R2_import_rowName = p.entry.name;
    } catch (e) { res.R2_import = { error: String(e).slice(0, 300) }; }
    // R3 share
    try { res.R3_share = read(projectShareVeil(toPublicSafe(clone(stamped), { full: false, memberOverrides: null }), null), src); } catch (e) { res.R3_share = { error: String(e).slice(0, 300) }; }
    // R4 gallery import
    try {
      const data = toPublicSafe(clone(stamped), { full: false, memberOverrides: null });
      const o = { ...data }; delete o.seed; delete o._seed; delete o._config; if (o.config && typeof o.config === 'object') { o.config = { ...o.config }; delete o.config._seed; } delete o.dmNotes; delete o.dossierNotes; delete o.narrativeNotes;
      const dossier = veilPublicPayload({ id: 'row-1', name: born.name, tier: born.tier, settlement: o });
      const s = (dossier.settlement && typeof dossier.settlement === 'object') ? dossier.settlement : {};
      const settlement = scrubImportedEditState(scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({
        ...s, neighbourNetwork: [], neighborRelationship: null, interSettlementRelationships: [], _seed: undefined,
        config: scrubImportedConfig(s.config), importedFrom: { slug: 'x', sourceName: dossier.name || s.name || null, importedAt: 'now' },
      }))));
      res.R4_gallery = read(settlement, src); res.R4_gallery_rowName = `${dossier.name || s.name || 'Imported settlement'} (imported)`;
      // the full-share variant (gallery_share_dm): _gallery_dm_full_json mirrored by toPublicSafe(full:true)
      const dataF = toPublicSafe(clone(stamped), { full: true, memberOverrides: null });
      const oF = { ...dataF }; delete oF.seed; delete oF._seed; delete oF._config;
      res.R4_gallery_full = read(normalizeSettlement({ ...veilPublicPayload({ id: 'row-1', name: born.name, tier: born.tier, settlement: oF }).settlement, _seed: undefined }), src);
    } catch (e) { res.R4_gallery = { error: String(e).slice(0, 300) }; }
    // R5 PDF
    let vm = null; let nz = null;
    try { nz = normalizeSettlement(clone(stamped)); vm = buildViewModel({ settlement: nz, aiSettlement: null, aiDailyLife: null, narrativeMode: false, systemState: null, eventLog: [], phase: 'draft', campaign: null }); res.R5_pdf = read(vm.raw || nz, src); } catch (e) { res.R5_pdf = { error: String(e).slice(0, 300) }; }
    // R6 Foundry
    try {
      const { moduleId, files } = buildFoundryModuleFiles({ settlement: nz, vm, variant: 'canon_dossier', faithUnlocked: false });
      const all = files.map((f) => String(f.data)).join('\n');
      const w = who(src);
      res.R6_foundry = { moduleId, files: files.map((f) => f.path), has_seed: all.includes(String(born._seed)), has_id: all.includes(String(born.id)), has_idTail: moduleId.includes(String(born.id).slice(-6)), has_name: all.includes(born.name), has_personName: w.personName ? all.includes(w.personName) : null, has_personId: w.personId ? all.includes(w.personId) : null };
    } catch (e) { res.R6_foundry = { error: String(e).slice(0, 300) }; }
    appendFileSync(out, `${JSON.stringify(res)}\n`);
    console.log(row.seed);
  }
}
