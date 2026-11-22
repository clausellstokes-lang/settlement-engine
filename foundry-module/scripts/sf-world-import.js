/**
 * sf-world-import.js — the SettlementForge World Importer entry (Foundry VTT).
 *
 * A THIN wiring layer over the pure builder (build-journals.js): it adds a GM-only
 * "Import World" button to the Journal sidebar, reads a `settlementforge-world`
 * export JSON the GM picks, and creates the journal entries in-world. It is
 * READ-ONLY toward the exported world — it only CREATES journal documents on
 * explicit GM action and never writes anything back. No settlement content ever
 * reaches executable code: every string is data rendered by the pure builder.
 *
 * v1 = manual export/import. Live sync + scene pins are recorded follow-ons.
 * Compatible with Foundry VTT v11–v13.
 */

import { buildJournalDocuments, worldFolderName, MODULE_ID } from './build-journals.js';

/**
 * Create the journal documents for a parsed world export, under a realm folder.
 * @param {any} data a parsed `settlementforge-world` export
 * @returns {Promise<any[]>} the created JournalEntry documents
 */
async function importWorld(data) {
  const docs = buildJournalDocuments(data); // throws if the payload is not a world export
  const folder = await Folder.create({ name: worldFolderName(data), type: 'JournalEntry' });
  const withFolder = docs.map((d) => ({ ...d, folder: folder && folder.id ? folder.id : null }));
  const created = await JournalEntry.createDocuments(withFolder);
  const n = Array.isArray(created) ? created.length : 0;
  if (globalThis.ui && ui.notifications) ui.notifications.info(`SettlementForge: imported ${n} journal entr${n === 1 ? 'y' : 'ies'} from "${worldFolderName(data)}".`);
  return created;
}

/** Open a file picker and import the chosen world-export JSON. */
async function pickAndImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      await importWorld(data);
    } catch (err) {
      console.error('SettlementForge |', err);
      if (globalThis.ui && ui.notifications) ui.notifications.error('SettlementForge: could not import world — ' + (err && err.message ? err.message : err));
    }
  });
  input.click();
}

// Expose a small, stable API for macros/console + the button below.
Hooks.once('init', () => {
  globalThis.game = globalThis.game || {};
  game.settlementforge = game.settlementforge || {};
  game.settlementforge.importWorld = importWorld;
  game.settlementforge.pickAndImport = pickAndImport;
  game.settlementforge.buildJournalDocuments = buildJournalDocuments;
  game.settlementforge.moduleId = MODULE_ID;
});

// GM-only "Import World" affordance on the Journal sidebar. Tolerant of both the
// jQuery (v11/v12) and HTMLElement (v13 ApplicationV2) render signatures.
Hooks.on('renderJournalDirectory', (app, html) => {
  if (!(game.user && game.user.isGM)) return;
  const root = html instanceof HTMLElement ? html : (html && html[0]);
  if (!root || root.querySelector('.sf-world-import-btn')) return;
  const header = root.querySelector('.directory-header .header-actions')
    || root.querySelector('.directory-header')
    || root.querySelector('.header-actions')
    || root;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'sf-world-import-btn';
  btn.style.flex = '0 0 auto';
  btn.innerHTML = '<i class="fas fa-globe"></i> Import World';
  btn.addEventListener('click', (ev) => { ev.preventDefault(); pickAndImport(); });
  header.appendChild(btn);
});
