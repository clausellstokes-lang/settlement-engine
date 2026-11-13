/** @vitest-environment jsdom */
// REVIEW-R2-STAGES: the other surfaces of each town: the PDF (SettlementPDF walked to its text leaves, as tests/pdf do),
// the Foundry journal pages (buildJournalPages, every variant), the Tonight sheet (composeTonightSheet). Reads the
// records rendered by render.sh (RECORDS env), writes OUT/<seed>.<surface>.txt.
import { test, vi } from 'vitest';
import fs from 'node:fs';
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { SettlementPDF } from '__TREE__/src/pdf/SettlementPDF.jsx';
import { buildJournalPages } from '__TREE__/src/foundry/journalPages.js';
import { composeTonightSheet } from '__TREE__/src/domain/summary/tonightSheet.js';
const OUT = process.env.OUT, REC = process.env.RECORDS; const SEEDS = fs.readFileSync(process.env.SEEDS, 'utf8').trim().split('\n');
function collect(node, out) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collect(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') { let r; try { r = node.type(node.props); } catch (e) { out.push(`[[render error in ${node.type.name}: ${e.message}]]`); return out; } out.push('\n'); collect(r, out); out.push('\n'); return out; }
    if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') { return collect({ type: node.type.type, props: node.props }, out); }
    out.push('\n'); collect(node.props?.children, out); out.push('\n'); return out;
  }
  return out;
}
const lines = (arr) => arr.join(' ').split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
for (const seed of SEEDS) test(seed, () => {
  const town = JSON.parse(fs.readFileSync(`${REC}/${seed}.json`, 'utf8'));
  for (const variant of ['canon_dossier', 'draft_brief', 'timeline_packet']) {
    let vm; try { vm = buildViewModel({ settlement: town, phase: variant === 'draft_brief' ? 'draft' : 'canon' }); } catch (e) { fs.writeFileSync(`${OUT}/${seed}.vm-error.txt`, e.stack); continue; }
    let pdf; try { pdf = lines(collect({ type: SettlementPDF, props: { settlement: town, phase: variant === 'draft_brief' ? 'draft' : 'canon', variant, faithUnlocked: true } }, [])); } catch (e) { pdf = 'PDF ERROR ' + e.stack; }
    fs.writeFileSync(`${OUT}/${seed}.pdf-${variant}.txt`, pdf);
    let pages; try { pages = buildJournalPages(vm, { variant, faithUnlocked: true, settlement: town }); } catch (e) { pages = [{ name: 'ERROR', html: e.stack }]; }
    fs.writeFileSync(`${OUT}/${seed}.foundry-${variant}.txt`, (pages || []).map((p) => `== ${p.name || p.title || ''}\n` + String(p.text?.content ?? p.html ?? p.content ?? JSON.stringify(p)).replace(/<[^>]+>/g, '\n').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').split('\n').map((l) => l.trim()).filter(Boolean).join('\n')).join('\n'));
  }
  fs.writeFileSync(`${OUT}/${seed}.tonight.txt`, JSON.stringify(composeTonightSheet(town), null, 1));
}, 120000);
