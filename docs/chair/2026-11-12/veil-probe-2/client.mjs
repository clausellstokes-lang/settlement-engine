// The real client read over a fake supabase whose rpc runs the real SQL on a native database (H.db).
// A probe calls vi.mock('../../../../src/lib/supabase.js', () => fakeSupabase()) before importing gallery.js.
export const H = { db: null, uid: '', last: null };
export function fakeSupabase() {
  const SERVED = new Set(['get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier', 'get_gallery_map']);
  const tableFns = new Set(['get_gallery_dossier', 'import_gallery_dossier']);
  const supabase = {
    rpc: async (name, args = {}) => {
      if (!SERVED.has(name)) return { data: null, error: { message: `not served here: ${name}` } };
      try {
        await H.db.query(`select set_config('test.uid', $1, false)`, [H.uid]);
        const keys = Object.keys(args);
        const call = `public.${name}(${keys.map((k, i) => `${k} => $${i + 1}`).join(', ')})`;
        const r = await H.db.query(tableFns.has(name) ? `select * from ${call}` : `select ${call} as out`, keys.map((k) => args[k]));
        H.last = tableFns.has(name) ? r.rows : r.rows[0]?.out;
        return { data: H.last, error: null };
      } catch (e) { H.last = { error: String(e.message) }; return { data: null, error: { message: String(e.message) } }; }
    },
  };
  return { supabase, isConfigured: true, default: supabase };
}
export const BROWSER = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
/** Every eye the panel offers on a payload. */
export function everyEye(veil, pub) {
  const m = veil.curateModelFor(pub, []);
  return m.sections.flatMap((s) => [...s.groupings.map((g) => g.address), ...s.switches.map((x) => x.address),
    ...s.cards.flatMap((c) => [...(c.whole ? [c.whole.address] : []), ...c.eyes.map((e) => e.address)])]);
}
/** Median and max of seven warm reads (the first of eight is the warm-up). */
export function median7(ms) { const a = ms.slice(1).sort((x, y) => x - y); return { median: Math.round(a[3]), max: Math.round(a.at(-1)) }; }
