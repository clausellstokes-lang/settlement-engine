/**
 * pageLaws/page.mjs — THE PAGE AS PRINTED, read for the BAR5 page-law detectors (BAR5-AUDIT, seat A).
 * A dump of PAGE-COPY (`docs/chair/2026-11-16/probes/PAGE-COPY`, render.census3.jsx) is `== <group>/<tab> ==`
 * headings, each followed by that tab's printed lines. `parseDump` returns `{ order, tabs }`: `tabs` maps a tab's
 * name to its lines in print order. The DOSSIER tabs (Summary/Systems/World/Notes) are the page the second check
 * reads; the Tonight sheet, the PDF and the Journal are other surfaces of the same record, kept apart (`SURFACE`).
 * Pure; no I/O.
 */
export const DOSSIER = /^(?:Summary|Systems|World|Notes)\//;
export const SURFACE = /^(?:Table|PDF|Journal)\//;

/** @param {string} text @returns {{ order: string[], tabs: Record<string, string[]> }} */
export function parseDump(text) {
  /** @type {Record<string, string[]>} */ const tabs = {};
  /** @type {string[]} */ const order = [];
  let cur = null;
  for (const line of String(text).split('\n')) {
    const m = /^== (.+) ==$/.exec(line);
    if (m) { cur = m[1]; if (!tabs[cur]) { tabs[cur] = []; order.push(cur); } continue; }
    if (cur && line.trim() !== '') tabs[cur].push(line);
  }
  return { order, tabs };
}

/** The dossier tabs only. @param {Record<string, string[]>} tabs */
export const dossierTabs = (tabs) => Object.fromEntries(Object.entries(tabs).filter(([k]) => DOSSIER.test(k)));

/** Every line of the given tabs as `{ tab, i, line }`. @param {Record<string, string[]>} tabs */
export const allLines = (tabs) => Object.entries(tabs).flatMap(([tab, ls]) => ls.map((line, i) => ({ tab, i, line })));

/** A whitespace- and quote-folded form for matching a sentence inside a printed line. @param {string} s */
export const fold = (s) => String(s).toLowerCase().replace(/[“”"'‘’`]/g, '').replace(/\s+/g, ' ').trim();
