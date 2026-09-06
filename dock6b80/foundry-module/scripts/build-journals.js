/**
 * build-journals.js — PURE world-export → Foundry JournalEntry documents.
 *
 * The heart of the SettlementForge world importer, kept free of every Foundry
 * global so it is unit-testable and can never smuggle content into executable
 * code: it takes a parsed world-export JSON (the `settlementforge-world` format,
 * either variant) and returns plain JournalEntry document objects. All settlement
 * content is DATA rendered through `esc()` into markdown pages at import time —
 * nothing is interpolated into code. The entry (sf-world-import.js) creates these
 * documents in-world.
 *
 * Both export variants are handled by the same builder: it renders whatever
 * public fields the JSON carries, so a DM export naturally shows the secrets/hooks
 * it contains and a player export simply has none to show.
 */

import { escapeMarkdown } from './markdownEscape.js';

export const WORLD_EXPORT_FORMAT = 'settlementforge-world';
export const MODULE_ID = 'settlementforge-world-importer';

/**
 * THE escaper, shared with the in-app lane (see markdownEscape.js for the
 * ordering contract). Re-exported under this lane's historical name so existing
 * importers keep working.
 * @type {(value: unknown) => string}
 */
export const esc = escapeMarkdown;

/** @param {any} data @returns {string} */
export function worldFolderName(data) {
  const name = data && data.realm && data.realm.name ? String(data.realm.name) : 'Realm';
  return `SettlementForge — ${name}`;
}

/** A text markdown page. @param {string} name @param {string} markdown */
function page(name, markdown) {
  return { name, type: 'text', title: { show: true, level: 1 }, text: { format: 2, markdown } };
}

/** @param {any[]} lines @returns {string} */
function joinLines(lines) {
  return lines.filter((l) => l != null && l !== '').join('\n');
}

/**
 * A raw hook is either a bare string or an object carrying its prose under
 * `hook` (economics) / `text`. Same read order as the app's shared aggregator
 * (src/domain/dossier/plotHooks.js textForHook).
 * @param {any} raw
 * @returns {string}
 */
function hookProse(raw) {
  if (raw == null) return '';
  if (typeof raw === 'object') return String(raw.hook || raw.text || '');
  return String(raw);
}

/**
 * The settlement-level plot hooks a DM export actually carries.
 *
 * `settlement.plotHooks` is NEVER written by the engine. The live settlement-scope
 * hooks are `economicViability.plotHooks` ({ category, hook, severity } objects)
 * and the per-event `history.historicalEvents[].plotHooks` (strings) — the same
 * two surfaces src/generators/aiLayer.js merges, with the top-level key kept only
 * as a legacy fallback for hand-authored/imported payloads. Reading the top-level
 * key alone rendered NO hooks page for any real export.
 *
 * A player export carries none: toPublicSafe's recursive denylist drops every
 * *hook key, so this returns [] and the page is skipped — the secrets seam is the
 * export's, never re-implemented here.
 * @param {any} dossier
 * @returns {string[]}
 */
function dossierPlotHooks(dossier) {
  const arr = (v) => (Array.isArray(v) ? v : []);
  const events = arr(dossier && dossier.history && dossier.history.historicalEvents);
  const raw = [
    ...arr(dossier && dossier.economicViability && dossier.economicViability.plotHooks),
    ...events.flatMap((e) => arr(e && e.plotHooks)),
    ...arr(dossier && dossier.plotHooks),
  ];
  /** @type {string[]} */ const out = [];
  const seen = new Set();
  for (const entry of raw) {
    const text = hookProse(entry).trim();
    if (!text || seen.has(text)) continue;
    seen.add(text);
    out.push(text);
  }
  return out;
}

/**
 * Build the realm index journal (overview + member list + chronicle).
 * @param {any} data
 * @returns {{ name: string, pages: any[] }}
 */
function realmJournal(data) {
  const realm = (data && data.realm) || {};
  const snapshot = realm.snapshot || {};
  const settlements = Array.isArray(data && data.settlements) ? data.settlements : [];
  const pages = [];

  const overview = [`## ${esc(realm.name || 'Realm')}`, ''];
  overview.push(`A realm of **${settlements.length}** settlement${settlements.length === 1 ? '' : 's'}, exported from SettlementForge (${esc(data && data.variant ? data.variant : 'player')} view).`);
  const clock = snapshot.worldClock;
  if (clock && clock.calendar) {
    overview.push('', `**In-world time:** year ${esc(clock.calendar.year)}, ${esc(clock.calendar.season)} (tick ${esc(clock.tick)}).`);
  }
  const arcs = snapshot.dashboard && Array.isArray(snapshot.dashboard.realmArcLines) ? snapshot.dashboard.realmArcLines : [];
  if (arcs.length) {
    overview.push('', '## The realm arcs', '');
    for (const line of arcs) overview.push(`- ${esc(line)}`);
  }
  pages.push(page('Realm Overview', joinLines(overview)));

  const members = ['## Settlements', ''];
  for (const s of settlements) {
    members.push(`- **${esc(s && s.name)}**${s && s.tier ? ` — ${esc(s.tier)}` : ''}`);
  }
  pages.push(page('Settlements', joinLines(members)));

  const chronicle = Array.isArray(snapshot.chronicle) ? snapshot.chronicle : [];
  if (chronicle.length) {
    const lines = ['## Recent history', ''];
    for (const tickRow of chronicle.slice(0, 20)) {
      for (const h of (Array.isArray(tickRow.headlines) ? tickRow.headlines : [])) {
        lines.push(`- **${esc(h.headline)}**${h.summary ? ` — ${esc(h.summary)}` : ''}`);
      }
    }
    if (lines.length > 2) pages.push(page('Chronicle', joinLines(lines)));
  }

  return { name: `${realm.name || 'Realm'} — Realm`, pages };
}

/**
 * Build one settlement dossier journal.
 * @param {any} entry a world-export settlement `{ id, name, tier, dossier }`
 * @param {string} realmName
 * @returns {{ name: string, pages: any[] }}
 */
function settlementJournal(entry, realmName) {
  const dossier = (entry && entry.dossier) || {};
  const pages = [];

  const overview = [`## ${esc(entry && entry.name)}`, ''];
  if (entry && entry.tier) overview.push(`**Tier:** ${esc(entry.tier)}`);
  if (dossier.population != null) overview.push(`**Population:** ${esc(dossier.population)}`);
  if (realmName) overview.push(`**Realm:** ${esc(realmName)}`);
  if (dossier.thesis) overview.push('', esc(dossier.thesis));
  if (dossier.pressureSentence) overview.push('', `*${esc(dossier.pressureSentence)}*`);
  pages.push(page('Overview', joinLines(overview)));

  const npcs = Array.isArray(dossier.npcs) ? dossier.npcs : [];
  if (npcs.length) {
    const lines = ['## Notable people', ''];
    for (const n of npcs) {
      lines.push(`### ${esc(n && n.name)}${n && n.role ? ` — ${esc(n.role)}` : ''}`);
      // DM-variant fields (absent in a player export) render when present.
      const goal = n && typeof n.goal === 'object' && n.goal ? (n.goal.short || n.goal.long) : (n && n.goal);
      const secret = n && typeof n.secret === 'object' && n.secret ? n.secret.what : (n && n.secret);
      if (goal) lines.push('', `*Wants:* ${esc(goal)}`);
      if (secret) lines.push('', `*Secret:* ${esc(secret)}`);
      lines.push('');
    }
    pages.push(page('Notable People', joinLines(lines)));
  }

  const ps = dossier.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : (Array.isArray(dossier.factions) ? dossier.factions : []);
  if (factions.length) {
    const lines = ['## Factions', ''];
    for (const f of factions) {
      const fname = f && (f.faction || f.name);
      lines.push(`- **${esc(fname)}**${f && f.desc ? ` — ${esc(f.desc)}` : ''}`);
    }
    pages.push(page('Power & Factions', joinLines(lines)));
  }

  // DM-only chapter: plot hooks (a player export carries none — see
  // dossierPlotHooks for where the engine actually writes them).
  const hooks = dossierPlotHooks(dossier);
  if (hooks.length) {
    const lines = ['## Plot hooks', ''];
    for (const h of hooks) lines.push(`- ${esc(h)}`);
    pages.push(page('Plot Hooks', joinLines(lines)));
  }

  return { name: `${entry && entry.name ? entry.name : 'Settlement'} — Dossier`, pages };
}

/**
 * Validate + convert a parsed world export into JournalEntry document objects
 * (one realm index + one per settlement), each flagged for this module.
 * @param {any} data a parsed `settlementforge-world` export
 * @returns {Array<{ name: string, pages: any[], flags: any }>}
 * @throws {Error} when the payload is not a recognized world export
 */
export function buildJournalDocuments(data) {
  if (!data || typeof data !== 'object' || data.format !== WORLD_EXPORT_FORMAT) {
    throw new Error('Not a SettlementForge world export (missing format "settlementforge-world").');
  }
  const realmName = (data.realm && data.realm.name) || 'Realm';
  const variant = data.variant === 'dm' ? 'dm' : 'player';
  const flagsFor = (kind) => ({ settlementforge: { moduleId: MODULE_ID, source: 'settlementforge-world', variant, kind } });

  const docs = [];
  const realm = realmJournal(data);
  docs.push({ ...realm, flags: flagsFor('realm') });
  for (const entry of (Array.isArray(data.settlements) ? data.settlements : [])) {
    const j = settlementJournal(entry, realmName);
    docs.push({ ...j, flags: flagsFor('settlement') });
  }
  // Stable sort keys keep page order in Foundry's sidebar.
  for (const doc of docs) {
    doc.pages = doc.pages.map((p, i) => ({ ...p, sort: (i + 1) * 100 }));
  }
  return docs;
}
