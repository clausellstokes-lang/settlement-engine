/**
 * moduleBuilder.js — assemble the Foundry VTT module file set for a settlement.
 *
 * Packaging decision (docs/briefs/SESSION_FOUNDRY_SCOPE.md §D1): Foundry v12+
 * removed NeDB packs and LevelDB compendia cannot be written client-side, so
 * the module ships its journal content as JSON plus a STATIC loader script
 * that creates the JournalEntry documents in-world on first enable (GM only,
 * idempotent). The loader is byte-identical in every export — no settlement
 * content is ever interpolated into executable code — and the raw journal
 * JSON doubles as Foundry's per-document "Import Data" manual fallback.
 *
 * Pure module: returns { moduleId, files } for the zip writer; no DOM.
 */

import { buildJournalPages } from './journalPages.js';
import { slugify as kernelSlugify } from '../kernel/slugify.js';

/** Foundry module ids must be lowercase [a-z0-9-]. */
function slugify(name) {
  return kernelSlugify(name, { sep: '-', max: 40, fallback: 'settlement', empty: 'settlement' });
}

// Stable per-settlement id tail so two exported settlements install side by
// side: the content-stable `s_<16hex>` id normalizeSettlement stamps.
function idTail(settlement) {
  const id = String(settlement?.id || '');
  const hex = id.match(/^s_([0-9a-f]+)$/i);
  if (hex) return hex[1].slice(-6).toLowerCase();
  return id.replace(/[^a-z0-9]/gi, '').slice(-6).toLowerCase() || 'export';
}

/**
 * The loader script — STATIC BY CONSTRUCTION. This constant is emitted
 * verbatim into every module (tests/foundry/foundryManifest.test.js pins that
 * two different settlements produce identical script bytes). All content it
 * touches comes from data/journals.json at runtime; it deliberately avoids
 * template literals so nothing here even looks interpolatable.
 */
const INIT_SCRIPT = `/**
 * SettlementForge journal loader. Static: all settlement content lives in
 * ../data/journals.json. On ready (GM only) it offers to import the bundled
 * journals into a world folder; if this module's journals already exist in
 * the world the import is skipped.
 */
Hooks.once('ready', async () => {
  try {
    if (!game.user?.isGM) return;
    const match = import.meta.url.match(/\\/modules\\/([^/]+)\\//);
    const moduleId = match && match[1];
    if (!moduleId) return;
    const existing = game.journal?.find?.((j) => j?.flags?.settlementforge?.moduleId === moduleId);
    if (existing) return;
    const res = await fetch('modules/' + moduleId + '/data/journals.json');
    if (!res.ok) return;
    const data = await res.json();
    const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (ch) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
    const count = data.journals.length;
    const content = '<p>Import ' + count + ' journal entr' + (count === 1 ? 'y' : 'ies')
      + ' from <strong>' + escapeHtml(data.title) + '</strong> into this world?</p>';
    let proceed = true;
    const DialogV2 = foundry?.applications?.api?.DialogV2;
    if (DialogV2?.confirm) {
      proceed = await DialogV2.confirm({ window: { title: data.title }, content });
    } else if (globalThis.Dialog?.confirm) {
      proceed = await Dialog.confirm({ title: data.title, content });
    }
    if (!proceed) return;
    const folder = await Folder.create({ name: data.folderName, type: 'JournalEntry' });
    const docs = data.journals.map((j) => ({ ...j, folder: folder?.id ?? null }));
    await JournalEntry.createDocuments(docs);
    ui.notifications?.info(data.title + ': journal import complete.');
  } catch (err) {
    console.error('SettlementForge | journal import failed:', err);
    ui.notifications?.error('SettlementForge: journal import failed - see console.');
  }
});
`;

function buildReadme({ name, moduleId, journalFile }) {
  return [
    `# SettlementForge — ${name}`,
    '',
    'A Foundry VTT module carrying this settlement\'s dossier as a multi-page',
    'journal entry, exported from SettlementForge.',
    '',
    '## Install',
    `1. Extract this zip into your Foundry \`Data/modules/\` directory (it contains the \`${moduleId}/\` folder).`,
    '2. Enable the module in your world (Game Settings → Manage Modules).',
    '3. As GM, confirm the one-time journal import prompt.',
    '',
    '## Manual fallback (no module install)',
    'Create a Journal Entry in your world, right-click it in the sidebar →',
    `**Import Data**, and select \`data/${journalFile}\` from this archive.`,
    '',
    '## Re-exporting after the world changes',
    'The loader skips the import while journals from this module exist in the',
    'world. To re-import a fresh export of the same settlement and variant,',
    'delete the previously imported journal entry (or its folder) first, then',
    'reload the world.',
    '',
    'Compatible with Foundry VTT v11–v13. Content is plain journal pages',
    '(markdown) — no game-system dependency.',
    '',
  ].join('\n');
}

/**
 * Build the full module file set.
 *
 * @param {{
 *   settlement: any,
 *   vm: any,
 *   variant?: string,
 *   faithUnlocked?: boolean,
 * }} input — `vm` is buildViewModel output for this settlement;
 *   `faithUnlocked` is the premium seam result (default false = safe).
 * @returns {{ moduleId: string, files: Array<{ path: string, data: string }>, pages: Array<{name: string, markdown: string}> }}
 */
export function buildFoundryModuleFiles({ settlement, vm, variant = 'canon_dossier', faithUnlocked = false }) {
  const name = settlement?.name || 'Unnamed Settlement';
  const slug = slugify(name);
  // The VARIANT is part of the module identity: the loader's idempotency
  // check keys on moduleId, so without it a second variant of the same
  // settlement would install but silently never import its journals.
  const variantSlug = { draft_brief: 'draft', canon_dossier: 'canon', timeline_packet: 'timeline', campaign_state: 'war' }[variant] || slugify(variant);
  const moduleId = `settlementforge-${slug}-${variantSlug}-${idTail(settlement)}`;

  const pages = buildJournalPages(vm, { variant, faithUnlocked });

  const journal = {
    name: `${name} — Settlement Dossier`,
    pages: pages.map((p, i) => ({
      name: p.name,
      type: 'text',
      sort: (i + 1) * 100,
      title: { show: true, level: 1 },
      text: { format: 2, markdown: p.markdown },
    })),
    flags: {
      settlementforge: { moduleId, variant, source: 'settlementforge-export' },
    },
  };

  const manifest = {
    id: moduleId,
    title: `SettlementForge — ${name}`,
    description: `The ${name} settlement dossier as Foundry journal entries, exported from SettlementForge.`,
    version: '1.0.0',
    authors: [{ name: 'SettlementForge' }],
    compatibility: { minimum: '11', verified: '13' },
    esmodules: ['scripts/init.js'],
  };

  const journalFile = `${slug}-journal.json`;
  const files = [
    { path: `${moduleId}/module.json`, data: JSON.stringify(manifest, null, 2) + '\n' },
    { path: `${moduleId}/scripts/init.js`, data: INIT_SCRIPT },
    {
      path: `${moduleId}/data/journals.json`,
      data: JSON.stringify({
        title: manifest.title,
        folderName: `SettlementForge — ${name}`,
        journals: [journal],
      }, null, 2) + '\n',
    },
    // The single-document copy for Foundry's per-document "Import Data" flow.
    { path: `${moduleId}/data/${journalFile}`, data: JSON.stringify(journal, null, 2) + '\n' },
    { path: `${moduleId}/README.md`, data: buildReadme({ name, moduleId, journalFile }) },
  ];

  return { moduleId, files, pages };
}

export default buildFoundryModuleFiles;
