/** @vitest-environment jsdom */
// A5 proof (BIRTH-2, RULING G1). Births a plan on a TREE ($A5_TREE) and writes one line a birth:
//   recordStripped: sha256 of the record with every `dmStanding` key removed (equal to the base tree's record hash = "equal
//     but for the new key"); vm / journal / grounding / search: sha256 of the PDF view model (its `raw` passthrough dropped),
//     the Foundry journal pages, the AI grounding payload, the search enumeration; publicKeys: `dmStanding` keys left in the
//     player's projection (toPublicSafe(withPublicProse(s, composePublicProse(s)))), at any depth; groundingKeys: the same in
//     the grounding payload;
//   on a tree that writes the field: fieldMissing (a power with no string field), notEnding (a desc that does not end with
//     its non-empty field), writerMismatch (at EVERY call of the wrapped writer, annotateFactionStanding: the field differs
//     from the text the writer appended to that power's desc, its own output), roundTrip (normalizeSettlement keeps the
//     new record's JSON; an OLD record, the key removed, round-trips byte-equal: no key added).
import { test, vi } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const { tally } = vi.hoisted(() => ({ tally: { calls: 0, mismatch: 0, powers: 0 } }));
vi.mock(process.env.A5_TREE + '/src/generators/power/factionStanding.js', async (orig) => {
  const m = await orig();
  return { ...m, annotateFactionStanding: (factions, force, seat) => {
    const before = factions.map((f) => String(f.desc || ''));
    const r = m.annotateFactionStanding(factions, force, seat);
    tally.calls++;
    factions.forEach((f, i) => {
      if (!('dmStanding' in f)) return;
      tally.powers++;
      const d = String(f.desc || ''); const appended = d.startsWith(before[i]) ? d.slice(before[i].length).trim() : null;
      if (appended !== f.dmStanding) tally.mismatch++;
    });
    return r;
  } };
});
const T = process.env.A5_TREE;
const h = (v) => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(v) ?? 'undefined').digest('hex').slice(0, 16);
const strip = (v) => JSON.parse(JSON.stringify(v), (k, x) => (k === 'dmStanding' ? undefined : x));
const countKey = (v) => { let n = 0; JSON.stringify(v, (k, x) => { if (k === 'dmStanding') n++; return x; }); return n; };
test('A5 proof', async () => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  const { buildViewModel } = await import(/* @vite-ignore */ R + 'pdf/lib/viewModel.js');
  const { buildJournalPages } = await import(/* @vite-ignore */ R + 'foundry/journalPages.js');
  const { buildAiGroundingPayload } = await import(/* @vite-ignore */ R + 'domain/aiGrounding.js');
  const { enumerateDossierObjects } = await import(/* @vite-ignore */ R + 'domain/dossier/dossierSearch.js');
  const { composePublicProse } = await import(/* @vite-ignore */ R + 'components/new/publicProseCompose.js');
  const { withPublicProse } = await import(/* @vite-ignore */ R + 'domain/display/publicProse.js');
  const { toPublicSafe } = await import(/* @vite-ignore */ R + 'domain/display/publicSafe.js');
  const { normalizeSettlement } = await import(/* @vite-ignore */ R + 'domain/normalizeSettlement.js');
  await loadGenerationLawPayloads();
  const plan = JSON.parse(readFileSync(process.env.A5_PLAN, 'utf8')).filter((_, i) => i % 150 < Number(process.env.A5_N || 150));
  const out = [];
  for (const { seed, size, config } of plan) {
    tally.calls = 0; tally.mismatch = 0; tally.powers = 0;
    const s = generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
    const row = { seed, size, recordStripped: createHash('sha256').update(JSON.stringify(strip(s))).digest('hex') };
    const safe = (f) => { try { return f(); } catch (e) { return `ERR ${String(e?.message || e).slice(0, 80)}`; } };
    const vm = safe(() => buildViewModel({ settlement: s }));
    row.vm = h(safe(() => JSON.stringify(vm, (k, x) => (k === 'raw' ? undefined : x))));
    row.journal = h(safe(() => buildJournalPages(vm)));
    const g = safe(() => buildAiGroundingPayload(s)); row.grounding = h(g); row.groundingKeys = countKey(g);
    row.search = h(safe(() => enumerateDossierObjects(s)));
    const pub = safe(() => toPublicSafe(withPublicProse(s, composePublicProse(s)))); row.publicKeys = typeof pub === 'string' ? pub : countKey(pub);
    const fs = s.powerStructure?.factions || [];
    row.powers = fs.length; row.fieldMissing = fs.filter((f) => typeof f.dmStanding !== 'string').length;
    row.notEnding = fs.filter((f) => typeof f.dmStanding === 'string' && f.dmStanding && !String(f.desc || '').endsWith(f.dmStanding)).length;
    row.nonEmpty = fs.filter((f) => f.dmStanding).length;
    row.writerCalls = tally.calls; row.writerPowers = tally.powers; row.writerMismatch = tally.mismatch;
    const json = JSON.stringify(s);
    const newRt = safe(() => JSON.stringify(normalizeSettlement(JSON.parse(json))) === json);
    const old = JSON.stringify(strip(s));
    const oldRt = safe(() => JSON.stringify(normalizeSettlement(JSON.parse(old))) === old);
    row.roundTrip = `${newRt}/${oldRt}`;
    out.push(JSON.stringify(row));
  }
  writeFileSync(process.env.A5_OUT, out.join('\n') + '\n');
}, 7200000);
