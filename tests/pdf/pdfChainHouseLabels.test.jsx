/** @vitest-environment jsdom */
/**
 * R2-CODE-B item 1b, the chair's ruling R1 (REVIEW-R2-STAGES finding 3, be53f933b): THE PDF NAMES A
 * CHAIN'S HOUSES AS THE PAGE DOES. The PDF's supply-chain rows (SupplyChainFlow.jsx :: ChainRow) and
 * the Economics PROC row (EconomicsTrade.jsx) printed a chain's `processingInstitutions` raw — the
 * chain definition's patterns — so a metropolis holding "Craft guilds (100-150+)" read "Managed woodland
 * (depleted) > Craft guilds (5-15) > Bows and crossbows". They now read domain/display/chainHouses.js
 * (the seam's house label, each house once), as the Services chain card and the screen's chain card do.
 *
 * The guard reads the PDF's TEXT (SettlementPDF walked to its text leaves): every bracketed count
 * range it prints must be the roster's own house name, the one place a count range is still the
 * catalogue's name for a house (the Institutions roster, ODQ §934.13); a rank the roster does not hold
 * is the fault.
 */
import { describe, expect, test, vi } from 'vitest';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { institutionDisplayName } from '../../src/domain/display/institutionDisplayName.js';

/** Walk a react-pdf element tree to its text leaves. */
function collect(node, out) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collect(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') { out.push('\n'); collect(node.type(node.props), out); out.push('\n'); return out; }
    if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return collect({ type: node.type.type, props: node.props }, out);
    out.push('\n'); collect(node.props?.children, out); out.push('\n'); return out;
  }
  return out;
}
/** A catalogue count range: "(5-15)", "(100-150+)", "(10,000+ only)"; a heading's bare count "(17)" is not one. */
const RANGED = /([A-Z][A-Za-z'&/ -]*?) \((\d[\d,]*\s*-\s*\d[\d,]*\+?|\d[\d,]*\+(?: only)?)\)/g;

describe('the PDF names no rank of a house the roster does not hold', () => {
  test('six metropolises and cities, the canon dossier: every count range printed is a roster house', () => {
    const wrong = [];
    let chainRows = 0;
    for (let i = 0; i < 6; i++) {
      const town = generateSettlementPipeline({ settType: i % 2 ? 'city' : 'metropolis' }, null, { seed: `r2b-pdf-${i}`, customContent: {} });
      const roster = new Set((town.institutions || []).flatMap((x) => [x.name, institutionDisplayName(x.name)]));
      const text = collect({ type: SettlementPDF, props: { settlement: town, phase: 'canon', variant: 'canon_dossier', faithUnlocked: true } }, []).join(' ');
      chainRows += (text.match(/ > /g) || []).length;
      for (const m of text.matchAll(RANGED)) {
        const name = `${m[1].trim()} (${m[2]})`;
        if (![...roster].some((r) => r.endsWith(name))) wrong.push(`r2b-pdf-${i}: ${name}`);
      }
    }
    expect(chainRows, 'no supply-chain row was printed').toBeGreaterThan(20);
    expect([...new Set(wrong)]).toEqual([]);
  }, 240000);
});
