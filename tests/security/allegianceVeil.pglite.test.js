/**
 * allegianceVeil.pglite.test.js — I-10, THE HIDDEN ALLEGIANCE NEVER REACHES A PUBLIC PAGE (the allegiance train, car 1,
 * ALLEGIANCE-CAR1, 2026-11-08; docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §8; built on
 * gallerySanitizer.pglite.test.js's harness, extended by car 4: the generator's own WARRANT, SUSPICION and allegiance goals,
 * their intent and their targets, on no public page and not in the gallery).
 *
 * On generated cities — criminal (the criminal slider high), organized (many criminal houses) and infiltrated — with a
 * PLANTED allegiance, a covert handler tie, a WARRANT and a SUSPICION goal with intent, and a hidden-power boost
 * receipt, the public projection carries each 0 times: the client `toPublicSafe` and the pglite SQL projection (the
 * net-current `_gallery_sanitize_public_json`), client equal to server.
 *
 * RED-FIRST, BY ITS CONTROL: the scan (`publicLeaks`) counts every one of the planted facts on the RAW record — so the
 * scan is live before the drop is proved; a scan that read 0 on the raw record would prove nothing.
 *
 * What drops what (§8): the card field `allegiance` and `goal` — the NPC public ALLOWLIST (publicSafe.js :: publicNpc;
 * SQL 033 → 205 → 206), a key not on it never leaves; the handler TIE — `covert: true` on the tie, the value-level
 * covert drop (publicSafe.js; SQL 142, re-stated in 206), the object dropped whole.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget (gallerySanitizer.pglite.test.js)
const MIGRATIONS_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Latest-wins `create or replace function` body across all migrations (gallerySanitizer.pglite.test.js's helper). */
function netCurrentFn(name) {
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => /^\d.*\.sql$/.test(f)).sort();
  const re = new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b[\\s\\S]*?\\$\\$;`, 'igm');
  let last = null; let lastFile = null;
  for (const f of files) {
    const src = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf-8');
    const matches = src.match(re);
    if (matches && matches.length) { last = matches[matches.length - 1]; lastFile = f; }
  }
  return { sql: last, file: lastFile };
}
const SANITIZER = netCurrentFn('_gallery_sanitize_public_json');

/** The strings the plant writes: none may appear on a public page. */
const PLANT = Object.freeze({
  warrant: 'PLANTED-WARRANT: bring the fence of the guild in before the spring assize',
  suspicion: 'PLANTED-SUSPICION: prove what the keeper answers to',
  tie: 'PLANTED-HANDLER-TIE: the keeper does what the fence asks',
});
/**
 * THE HIDDEN-POWER BOOST RECEIPT (car 3's patronage), planted apart. MEASURED (ALLEGIANCE-CAR1): a receipt STORED on a
 * `powerStructure.factions[]` row reaches the public page — both projections keep `powerStructure` whole (the veil
 * lane's own §7.1 note: the power rows are public). So J-9's rule — patronage is DERIVED by one pure function and
 * stored NOWHERE on the record — is load-bearing for the veil, and this arm pins it as car 3's contract: the boost's
 * only surface is the DM view's call of `patronageOf` on the DM record.
 */
const BOOST = 'PLANTED-BOOST: lends the Thieves\' Guild +3 through its hidden share';

/**
 * Every allegiance fact a public projection could carry, counted. On a raw record each count is the record's own; on
 * a public projection each must be 0.
 * @param {any} json the projection (or the raw record) @param {any} rec the raw record (the agents and their guilds)
 */
function publicLeaks(json, rec) {
  const text = JSON.stringify(json);
  const count = (needle) => (needle ? text.split(needle).length - 1 : 0);
  const agents = (rec.npcs || []).filter((n) => n?.allegiance);
  const byId = new Map((json.npcs || []).map((n) => [n?.id, n]));
  let guildBesideAgent = 0;
  for (const a of agents) {
    const card = byId.get(a.id);
    if (!card) continue;
    const cardText = JSON.stringify(card);
    for (const guild of [a.allegiance.power, a.allegiance.house].filter(Boolean)) if (cardText.includes(guild)) guildBesideAgent += 1;
  }
  return {
    allegianceKeys: count('"allegiance"'),
    covertTies: (json.relationships || []).filter((t) => t?.covert === true).length,
    handlerTies: (json.relationships || []).filter((t) => t?.handler === true).length,
    planted: Object.values(PLANT).reduce((s, p) => s + count(p), 0),
    intents: count('"intent"'),
    guildBesideAgent,
  };
}
const ZERO = { allegianceKeys: 0, covertTies: 0, handlerTies: 0, planted: 0, intents: 0, guildBesideAgent: 0 };

/** Plant on a generated record: one more allegiance, its covert handler tie, a WARRANT and a SUSPICION goal with
 *  intent, and a hidden-power boost receipt. Returns a copy. @param {any} rec */
function plant(rec) {
  const s = JSON.parse(JSON.stringify(rec));
  const cast = s.npcs || [];
  const handler = cast.find((n) => n?.institution?.kind === 'house' && /guild|fence|smuggl|gang|black|underground|rookery|whisper|front/i.test(String(n.institution.key)));
  const agent = cast.find((n) => n !== handler && !n.allegiance && n?.institution?.kind === 'house');
  const law = cast.find((n) => n !== handler && n !== agent && n?.institution?.kind === 'house');
  if (!handler || !agent || !law) throw new Error('plant: the town has no guild face, agent and law face to plant on');
  agent.allegiance = { power: "Thieves' Guild", house: String(handler.institution.key), vector: 'greed', via: 'front', handler: handler.id, share: 0.15, veiled: true, covert: true };
  s.relationships = [...(s.relationships || []).filter((t) => t.from !== agent.id),
    { id: `tie_${agent.id}`, from: agent.id, to: handler.id, type: 'patron_client', typeName: 'Silent Partnership', description: PLANT.tie, tension: PLANT.tie, covert: true, handler: true }];
  law.goal = { short: PLANT.warrant, long: PLANT.suspicion,
    intent: { short: { family: 'ALLEGIANCE', key: 'pursue_warrant', target: { kind: 'npc', id: handler.id } }, long: { family: 'ALLEGIANCE', key: 'pursue_warrant', target: { kind: 'npc', id: agent.id } } } };
  return s;
}

describe('I-10 — no hidden allegiance, handler tie, pursuit goal or hidden boost on a public page (pglite)', () => {
  let db;
  const sanitize = async (obj) => (await db.query('select public._gallery_sanitize_public_json($1::jsonb) as out', [JSON.stringify(obj)])).rows[0].out;
  /** @type {any[]} */
  let records = [];

  beforeAll(async () => {
    db = new PGlite();
    await db.exec('create schema if not exists public;');
    await db.exec(SANITIZER.sql);
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const configs = [
      { settType: 'city', culture: 'germanic', priorityCriminal: 95, priorityMilitary: 10 }, // criminal
      { settType: 'metropolis', culture: 'germanic', priorityCriminal: 85 }, // organized: many criminal houses
      { settType: 'city', culture: 'germanic', priorityCriminal: 80, stressTypes: ['infiltrated'] }, // infiltrated
    ];
    for (const [k, cfg] of configs.entries()) {
      for (const seed of ['allegiance-veil-a', 'allegiance-veil-b']) records.push(plant(generateSettlementPipeline(cfg, null, { seed: `${seed}-${k}`, customContent: {} })));
    }
  }, PGLITE_BOOT_TIMEOUT_MS);

  it('the net-current sanitizer is 206 or later', () => {
    expect(SANITIZER.sql).toMatch(/npc_allowed/);
    expect(Number(String(SANITIZER.file).split('_')[0])).toBeGreaterThanOrEqual(206);
  });

  it('THE CONTROL: the scan counts every planted fact on the raw record (the scan is live)', () => {
    for (const rec of records) {
      const raw = publicLeaks(rec, rec);
      expect(raw.allegianceKeys, 'raw: allegiance keys').toBeGreaterThanOrEqual(1);
      expect(raw.covertTies, 'raw: covert ties').toBeGreaterThanOrEqual(1);
      expect(raw.handlerTies, 'raw: handler ties').toBeGreaterThanOrEqual(1);
      expect(raw.planted, 'raw: the three planted strings').toBeGreaterThanOrEqual(3);
      expect(raw.intents, 'raw: the goal intent').toBeGreaterThanOrEqual(1);
      expect(raw.guildBesideAgent, 'raw: an agent card names its guild').toBeGreaterThanOrEqual(1);
    }
    // anchored: the generator itself deals allegiances in these towns (not only the plant)
    const born = records.flatMap((r) => (r.npcs || []).filter((n) => n.allegiance)).length - records.length;
    expect(born, 'allegiances the generator dealt across the six towns').toBeGreaterThan(0);
  });

  it('the SQL projection carries every count at 0', async () => {
    for (const rec of records) expect(publicLeaks(await sanitize(rec), rec)).toEqual(ZERO);
  });

  it('car 3\'s contract (J-9): a boost receipt stored on a power row WOULD be public, so patronage is never stored', async () => {
    const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
    const rec = JSON.parse(JSON.stringify(records[0]));
    const crim = (rec.powerStructure?.factions || []).find((f) => f.category === 'criminal') || rec.powerStructure.factions[0];
    crim.patronageReceipt = BOOST;
    expect(JSON.stringify(await sanitize(rec)), 'server: a stored receipt is public').toContain(BOOST);
    expect(JSON.stringify(toPublicSafe(rec)), 'client: a stored receipt is public').toContain(BOOST);
    // anchored: THE COUNTERFORCE — no generated record stores one (J-9: derived, never written)
    for (const r of records) expect(JSON.stringify(r)).not.toMatch(/patronage(Receipt|Boost)/i);
  });

  // J-20 (ALLEGIANCE-CAR2, the chair's ruling of 2026-11-08 ~23:47 UTC): THE HALL'S HOLD IS DM-ONLY. Red-first: with the client
  // strip alone (no migration 207) the SQL arm and the parity arm red; 207's twin greens them.
  it('J-20: the capture state, the power rows\' seed and the capture relation rows are on no public page (client and SQL)', async () => {
    const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
    const captureLeaks = (json) => {
      const text = JSON.stringify(json);
      const rels = json?.powerStructure?.factionRelationships || [];
      return {
        captureKeys: text.split('aptureState"').length - 1,
        corruptedRows: rels.filter((r) => r?.type === 'corrupted').length,
        captureRows: rels.filter((r) => r && Object.hasOwn(r, 'captureState')).length,
        frontWords: text.split(' is a front.').length - 1,
      };
    };
    const NONE = { captureKeys: 0, corruptedRows: 0, captureRows: 0, frontWords: 0 };
    let rawRows = 0;
    for (const rec of records) {
      const before = JSON.stringify(rec);
      const raw = captureLeaks(rec);
      expect(raw.captureKeys, 'THE CONTROL: the raw record carries its capture state').toBeGreaterThanOrEqual(1);
      rawRows += raw.captureRows;
      expect(captureLeaks(toPublicSafe(rec)), 'client').toEqual(NONE);
      expect(captureLeaks(await sanitize(rec)), 'server').toEqual(NONE);
      expect(JSON.stringify(rec), 'the projection never touches the record').toBe(before);
    }
    expect(rawRows, 'anchored: the six towns carry capture relation rows on the raw record').toBeGreaterThan(0);
  });

  // ALLEGIANCE-CAR4 (2026-11-09; the design §6.4, I-10 extended): THE GENERATOR'S OWN PURSUIT GOALS. A9 deals WARRANT and
  // SUSPICION goals with a target (`goal.intent.*.target`), and an agent's serve / escape goal names its guild and its
  // handler. None reaches a public page or the gallery: the NPC allowlist drops `goal` whole (and `intent` inside it).
  // RED-FIRST, BY ITS CONTROL: the raw records carry the generated pursuit goals and their targets.
  it('car 4: no generated WARRANT or SUSPICION goal, no intent and no hidden target on a public page or the gallery', async () => {
    const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
    const { galleryPayloadFor } = await import('../../src/domain/display/galleryVeil.js');
    const pursuitOf = (rec) => (rec.npcs || []).flatMap((n) => ['short', 'long']
      .map((v) => ({ n, v, it: n?.goal?.intent?.[v] }))
      .filter(({ it }) => it && (it.kind === 'warrant' || it.kind === 'suspicion' || it.family === 'ALLEGIANCE')));
    const leaks = (json, rec) => {
      const text = JSON.stringify(json);
      const texts = pursuitOf(rec).map(({ n, v }) => n.goal[v]).filter((t) => typeof t === 'string' && t.length > 12);
      return {
        goalKeys: (json?.npcs || []).filter((n) => n && Object.hasOwn(n, 'goal')).length,
        intents: text.split('"intent"').length - 1,
        targets: text.split('"target":{').length - 1,
        pursuitTexts: texts.filter((t) => text.includes(t)).length,
      };
    };
    const NONE = { goalKeys: 0, intents: 0, targets: 0, pursuitTexts: 0 };
    let raw = 0; let rawTargets = 0;
    for (const rec of records) {
      const p = pursuitOf(rec);
      raw += p.filter(({ it }) => it.kind === 'warrant' || it.kind === 'suspicion').length;
      rawTargets += p.filter(({ it }) => it.target && it.target.id).length;
      expect(leaks(toPublicSafe(rec), rec), 'client').toEqual(NONE);
      expect(leaks(await sanitize(rec), rec), 'server').toEqual(NONE);
      expect(leaks(galleryPayloadFor(rec), rec), 'gallery').toEqual(NONE);
    }
    expect(raw, 'THE CONTROL: the six towns carry generated WARRANT or SUSPICION goals on the raw record').toBeGreaterThan(0);
    expect(rawTargets, 'THE CONTROL: the raw goals carry their targets').toBeGreaterThan(0);
  });

  it('the client projection carries every count at 0, and client == server', async () => {
    const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
    for (const rec of records) {
      const client = JSON.parse(JSON.stringify(toPublicSafe(rec)));
      expect(publicLeaks(client, rec)).toEqual(ZERO);
      expect(client).toEqual(await sanitize(rec));
    }
  });
});
