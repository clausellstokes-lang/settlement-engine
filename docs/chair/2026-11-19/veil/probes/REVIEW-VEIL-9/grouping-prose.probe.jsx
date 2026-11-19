// REVIEW-VEIL-9 · V9-5's class: A SHUT GROUPING'S DATA TOLD BY THE STORED PUBLIC PROSE. For every share a cold run stored
// with every eye shut (RV9_DBS) and for each grouping the share shuts, the tree's own composer over the stored town and
// over the same town with that grouping's data deleted (the cold probe's GROUPING_DATA paths); a block the SERVER sends
// (party link and gallery) that equals the full composition and differs from the composition without the grouping is
// composed from data the DM shut by hand.
import { it, vi } from 'vitest';
import { writeFileSync } from 'node:fs';
const SRC = process.env.RV6_SRC;
vi.mock(`${process.env.RV6_SRC}/src/lib/supabase.js`, () => ({ supabase: { rpc: async () => ({ data: null, error: null }) }, isConfigured: true }));
const GROUPING_DATA = { 'block:services.criminal': [['availableServices', 'criminal']],
  'block:defense.criminalStructure': [['economicState', 'safetyProfile', 'criminalInstitutions'], ['economicState', 'safetyProfile', 'crimeTypes']],
  'block:power.criminalUnderside': [['powerStructure', 'criminalCaptureState'], ['economicState', 'safetyProfile', 'blackMarketCapture']],
  'block:housekeeping.structuralIssues': [['structuralViolations'], ['structuralSuggestions']], 'block:housekeeping.coherenceNotes': [['coherenceNotes']],
  'block:housekeeping.receipt': [['generationCoherenceReceipt']], 'block:housekeeping.decrees': [['decrees'], ['dmLayer']] };
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const clean = (v) => JSON.stringify(v ?? null).replace(/\s*vq6n[0-9]+z/gi, '');
it('REVIEW-VEIL-9: shut groupings told by the prose', async () => {
  const pg = (await import(`${process.env.RV6_PGMOD}/node_modules/pg/lib/index.js`)).default;
  const { composePublicProse } = await import(`${SRC}/src/components/new/publicProseCompose.js`);
  const { loadGenerationLawPayloads } = await import(`${SRC}/src/domain/density/densityCreateBoundary.js`);
  await loadGenerationLawPayloads();
  const rows = {}; const lines = [];
  for (const dbname of process.env.RV9_DBS.split(',')) {
    const db = new pg.Client({ host: process.env.PGHOST, user: 'postgres', database: dbname }); await db.connect();
    await db.query(`select set_config('test.uid', '', false)`);
    const shares = (await db.query(`select public_slug, unlisted_slug, name, data, gallery_share_dm dm, gallery_member_overrides->'$veil'->'deltas' deltas from public.settlements
      where public_slug is not null and coalesce(jsonb_array_length(gallery_member_overrides->'$veil'->'deltas'),0) > 0 and not gallery_share_narrated order by public_slug`)).rows;
    let n = 0;
    for (const sh of shares) {
      const shut = new Set((sh.deltas || []).filter((d) => d.hidden).map((d) => d.address));
      const reads = { link: (await db.query('select public.get_unlisted_dossier($1) x', [sh.unlisted_slug])).rows[0]?.x?.dossier, gallery: (await db.query('select * from public.get_gallery_dossier($1)', [sh.public_slug])).rows[0]?.data };
      const full = structuredClone(sh.data); delete full.publicProse; let A; try { A = composePublicProse(full).blocks; } catch { continue; }
      for (const [g, paths] of Object.entries(GROUPING_DATA)) { if (!shut.has(g)) continue;
        const w = structuredClone(full); for (const p of paths) { let h = w; for (const seg of p.slice(0, -1)) h = isRec(h) ? h[seg] : undefined; if (isRec(h)) delete h[p[p.length - 1]]; }
        let B; try { B = composePublicProse(w).blocks; } catch { continue; } n += 1;
        for (const [read, body] of Object.entries(reads)) { const sent = body?.publicProse?.blocks; if (!isRec(sent)) continue;
          for (const [site, blk] of Object.entries(sent)) { if (!isRec(blk)) continue;
            for (const [k, v] of Object.entries(blk)) { if (v == null) continue; const a = A?.[site]?.[k]; const b = B?.[site]?.[k];
              if (clean(v) === clean(a) && clean(a) !== clean(b)) { const key = `${dbname.replace(/_\d+$/, '')} | ${read} | ${sh.dm ? 'DM on ' : 'DM off'} | ${g} -> publicProse.blocks.${site}.${k}`;
                const r = rows[key] = rows[key] || { towns: new Set(), ex: `${sh.name}: sent ${clean(v).slice(0, 170)} | without the grouping ${clean(b).slice(0, 120)}` }; r.towns.add(sh.name); } } } } }
    }
    lines.push(`${dbname}: ${shares.length} shares with hand hides; ${n} (share, shut grouping) pairs composed`);
    await db.end();
  }
  for (const k of Object.keys(rows).sort()) lines.push(`${k} | towns ${rows[k].towns.size}\n      e.g. ${rows[k].ex}`);
  writeFileSync(process.env.RV9_OUT, lines.join('\n') + '\n');
}, 14_400_000);
