/** @vitest-environment jsdom */
/**
 * tests/config/pricing.test.js — Pricing config single-source-of-truth tests.
 *
 * These tests are deliberately strict because pricing drift is one of
 * the highest-stakes bugs we can ship: any mismatch between client and
 * server numbers either over-charges users or lets them spend free
 * credits. The contract test below pins the client's AI cost schedule
 * to the values the edge function enforces — when either changes, the
 * test fails and forces a deliberate sync.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { resolve, join } from 'node:path';
import {
  TIERS,
  SINGLE_DOSSIER,
  getActivePacks,
  getActiveAiCosts,
  getAiCost,
  getSurveyorAiCost,
  getTierMultiplier,
  getVisibleTiers,
  singleDossierEnabled,
  findPackByKey,
  AI_MODEL_OPTIONS,
  DEFAULT_MODEL_PREFERENCE,
  normalizeModelPreference,
  isFastModelPreference,
  _internal,
  SURVEYOR_PLAN,
  ANNUAL_FACTOR,
  CARTOGRAPHER_ANNUAL,
  ACTIVE_CHECKOUT_SKUS,
} from '../../src/config/pricing.js';

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');

/** Every migration's SQL, in applied (numeric-prefix sorted) order. */
function migrationSources() {
  return readdirSync(MIG_DIR)
    .filter((f) => /^\d+_.*\.sql$/.test(f))
    .sort()
    .map((f) => ({ file: f, src: readFileSync(join(MIG_DIR, f), 'utf-8') }));
}

/**
 * The NET-CURRENT definition of `public.<name>` — the LAST `create or replace
 * function` for it anywhere in the corpus, which is the body the database
 * actually ends up with after a lexical-order apply.
 *
 * ⚠ THIS IS THE 159 LESSON, APPLIED TO PRICING. A pin that reads ONE migration's
 * file goes green over a later migration that forked from a stale ancestor and
 * dropped a delta. That is not hypothetical: 159 recreated surveyor_byok_set
 * from 139's body and silently dropped 143's health reset, and the 143-scoped
 * source pin could not see it (migration 191's header records the whole
 * incident). The surveyor prices below used to be pinned by a COMMENT naming
 * migrations 140/149/151/153; by the time this wave landed, spend_credits had
 * been recreated twice more (161's session belt, 174's reprice) and once again
 * by 192's tier multiplier. Resolving the body dynamically means the pin follows
 * the function instead of rotting against a migration number.
 */
function netCurrentSpendCredits() {
  // ⚠ ANCHORED AT LINE START. The unanchored form also matches a migration
  // HEADER that quotes the create-or-replace statement in prose, extracting the
  // comment block instead of the function. That is not hypothetical: 192's own
  // header quoted it, and this pin read a page of English as a function body
  // until the anchor went in. A comment line begins with `--`, so the anchor
  // makes the class impossible.
  const re = /^create\s+or\s+replace\s+function\s+public\.spend_credits\b[\s\S]*?\$\$;/gim;
  let last = null;
  for (const { file, src } of migrationSources()) {
    for (const m of src.matchAll(re)) last = { file, body: m[0] };
  }
  if (!last) throw new Error('could not extract a net-current body for public.spend_credits');
  return last;
}

/** Parse the `when '<feature>' then <n>` arms out of a spend_credits body. */
function caseArms(body) {
  const out = {};
  for (const m of body.matchAll(/when\s+'([A-Za-z_]+)'\s+then\s+(\d+)/g)) {
    out[m[1]] = Number(m[2]);
  }
  return out;
}

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState({}, '', '/');
});

// ── Server contract ───────────────────────────────────────────────────────
// These literal values mirror the server-side CREDIT_COSTS map in
// supabase/functions/generate-narrative/index.ts. When the server's
// pricing changes, this block has to change too (and so does the
// edge function). A grep for "CONTRACT_AI_COSTS" finds both ends.
const CONTRACT_AI_COSTS_LEGACY = { narrative: 8, dailyLife: 10, progression: 12 };
const CONTRACT_AI_COSTS_NEW    = { narrative: 5, dailyLife: 4,  progression: 6  };

describe('AI cost server contract', () => {
  it('legacy schedule matches the server-enforced legacy costs', () => {
    expect(_internal.LEGACY_AI_COSTS).toEqual(CONTRACT_AI_COSTS_LEGACY);
  });

  it('new schedule matches the server-enforced new costs', () => {
    expect(_internal.NEW_AI_COSTS).toEqual(CONTRACT_AI_COSTS_NEW);
  });

  // Surveyor S1+S3+S4–S7 task-priced managed credits. THE THREE WAYS that must agree:
  //   1. the literal expectations written here (what a reviewer reads),
  //   2. the _internal.SURVEYOR_AI_COSTS map + getSurveyorAiCost accessor (what the
  //      client quotes the buyer),
  //   3. the NET-CURRENT spend_credits CASE in supabase/migrations (what actually
  //      debits the ledger) — resolved dynamically, never by migration number.
  // Provisional pricing (owner-queued); when the owner re-tunes, all three move together.
  const SURVEYOR_PRICES = {
    analysis: 3, brief: 4, interpret: 5, parley: 3,
    customContent: 6, constructSettlement: 6, constructRealm: 8,
    autonomy: 4,
  };

  // ⚰ styleOverhaul (3) DE-LISTED — ODQ §763.2, Q-STYLE arm 2. Trimming the row above is
  // the whole cure for the two loops below, because both iterate the CLIENT's keys. That is
  // also exactly why the trim alone would be dishonest: it silently stops checking a CASE
  // arm that is still in the database and can never be removed. So the residue is named.
  const DELISTED_SURVEYOR_PRICES = { styleOverhaul: 3 };

  it('surveyor task prices match the map and the accessor', () => {
    expect(_internal.SURVEYOR_AI_COSTS).toEqual(SURVEYOR_PRICES);
    for (const [feature, price] of Object.entries(SURVEYOR_PRICES)) {
      expect(getSurveyorAiCost(feature), `${feature} accessor`).toBe(price);
    }
    expect(getSurveyorAiCost('nope')).toBe(0);
  });

  it('surveyor task prices match the NET-CURRENT server spend_credits CASE', () => {
    const { file, body } = netCurrentSpendCredits();
    const arms = caseArms(body);
    // Guard-the-guard: if the extraction breaks, `arms` goes empty and every
    // assertion below would vacuously pass on undefined. Anchor on a price the
    // CASE has carried since 057 so an empty parse can never read as green.
    expect(Object.keys(arms).length, `no CASE arms parsed out of ${file}`).toBeGreaterThan(10);
    expect(arms.narrative, `${file}: narrative arm missing`).toBe(5);
    for (const [feature, price] of Object.entries(SURVEYOR_PRICES)) {
      // 'brief' is priced client-side only (S2 has no spend_credits arm of its own).
      if (feature === 'brief') continue;
      expect(arms[feature], `${file}: spend_credits CASE charges ${arms[feature]} for ${feature}, client quotes ${price}`).toBe(price);
    }
  });

  /**
   * ⚰⚠ THE DE-LISTED ARM IS STILL IN THE DATABASE, AND THAT IS PINNED RATHER THAN FORGOTTEN.
   *
   * ODQ §763.2 retired styleOverhaul on the client. It could not retire it in SQL: the
   * `when 'styleOverhaul' then 3` arm is written into SEVEN APPLIED migrations
   * (151/152/153/154/161/174/192) and an applied migration is immutable.
   *
   * The loop above iterates the CLIENT's price keys, so the moment `styleOverhaul` left
   * SURVEYOR_PRICES that arm stopped being compared by anything at all — a live, chargeable
   * server behaviour with no test looking at it. That is the residue this wave would
   * otherwise have created, and it is the exact shape of defect the wave exists to remove
   * (a menu advertising a deleted chapter), only pointed at the ledger instead of the page.
   *
   * So the arm is asserted DIRECTLY, with its price, and its unreachability is asserted as
   * a property of the CLIENT rather than assumed: nothing the client can name reaches it.
   * ⛔ A RED HERE IS NOT CURED BY DELETING THIS TEST. If the arm's price moved, an applied
   * migration was edited. If the client quotes styleOverhaul again, the capability came
   * back and belongs in SURVEYOR_PRICES with a fresh owner signature.
   */
  it('DE-LISTED: the immutable spend_credits arm survives, priced, and unreachable from the client', () => {
    const { file, body } = netCurrentSpendCredits();
    const arms = caseArms(body);
    for (const [feature, price] of Object.entries(DELISTED_SURVEYOR_PRICES)) {
      expect(arms[feature], `${file}: the immutable ${feature} CASE arm went missing — an applied migration cannot lose an arm`).toBe(price);
      // …and no client-side surface can name it: not the price map, not the accessor,
      // not the public task menu. Each is a separate way the feature could come back.
      expect(_internal.SURVEYOR_AI_COSTS[feature], `${feature} is quoted again`).toBeUndefined();
      expect(getSurveyorAiCost(feature), `${feature} accessor still resolves`).toBe(0);
    }
  });

  // ── The capability-tier multiplier (wave L-5) ───────────────────────────────
  // docs/DESIGN_AI_CAPABILITY_LADDER.md §3 piece 5 + §4 L-5. The machinery is
  // built on both sides; the EFFECT is nil until the owner signs the pricing
  // sheet (§5 owner-gated, queue M5). These pins are what make "inert" a fact
  // rather than an intention.
  it('the net-current spend_credits carries the tier machinery (a later fork may not drop it)', () => {
    const { file, body } = netCurrentSpendCredits();
    expect(body, `${file}: spend_credits lost the p_tier parameter`).toMatch(/p_tier\s+text\s+default\s+null/i);
    expect(body, `${file}: spend_credits lost the ai_tier_multipliers lookup`).toContain('ai_tier_multipliers');
    // The hard 1..12 band survives the multiplication.
    expect(body, `${file}: spend_credits lost the 1..12 clamp on the tiered cost`).toMatch(/greatest\(1,\s*least\(12,/i);
    // And the belt + gate the money guards care about are still there after the
    // fork (moneyRpcNetCurrentGuards asserts these too; duplicated cheaply here
    // because THIS wave is the one that forked the body).
    expect(body, `${file}: spend_credits lost the account_is_active gate`).toContain('account_is_active');
    expect(body, `${file}: spend_credits lost the single-session belt`).toContain('assert_current_session');
  });

  it('TIER_MULTIPLIERS are all exactly 1 (pricing activation is owner-signed)', () => {
    expect(_internal.TIER_MULTIPLIERS).toEqual({ scout: 1, journeyman: 1, master: 1 });
    // The accessor degrades unknown/absent tiers to 1 rather than throwing, so a
    // client that ran ahead of an owner tier-rename cannot fail a quote.
    expect(getTierMultiplier('scout')).toBe(1);
    expect(getTierMultiplier('journeyman')).toBe(1);
    expect(getTierMultiplier('master')).toBe(1);
    expect(getTierMultiplier('archmage')).toBe(1);
    expect(getTierMultiplier(undefined)).toBe(1);
    expect(getTierMultiplier(null)).toBe(1);
  });

  it('EXECUTED IDENTITY PIN: a tiered quote equals an untiered quote for every feature and tier', () => {
    // The whole inertness claim of wave L-5, executed rather than asserted. If a
    // multiplier is ever changed without the owner's signature, this reds and
    // names the cell. Includes the unknown-feature cell (0), which is where a
    // naive `Math.max(1, ...)` clamp would break identity by quoting 1.
    // ⚰⭐ THE DE-LISTED FEATURE STAYS IN THIS LOOP (ODQ §763.2). Dropping it with its price
    // row would have been the smaller edit and the wrong one: the cell that matters most
    // after a de-list is whether the TIER MACHINERY can resurrect a price the client no
    // longer quotes. It cannot — a de-listed feature quotes 0 at every tier, and that is
    // now executed rather than assumed. The cell count is unchanged at 60 for the same
    // reason, so this pin's non-vacuity floor did not have to move at all.
    const tiers = [null, undefined, 'scout', 'journeyman', 'master', 'archmage'];
    const features = [
      ...Object.keys(SURVEYOR_PRICES),
      ...Object.keys(DELISTED_SURVEYOR_PRICES),
      'nope',
    ];
    const mismatches = [];
    for (const feature of features) {
      const base = getSurveyorAiCost(feature);
      for (const tier of tiers) {
        const tiered = getSurveyorAiCost(feature, tier);
        if (tiered !== base) mismatches.push(`${feature} @ ${String(tier)}: ${tiered} !== ${base}`);
      }
    }
    expect(mismatches, `\n${mismatches.join('\n')}\n`).toEqual([]);
    // Non-vacuity: the loop really compared every cell.
    expect(features.length * tiers.length).toBe(60);
  });
});

describe('getActiveAiCosts() / getAiCost()', () => {
  it('returns the repriced cost schedule', () => {
    expect(getActiveAiCosts()).toEqual(CONTRACT_AI_COSTS_NEW);
    expect(getAiCost('narrative')).toBe(5);
    expect(getAiCost('dailyLife')).toBe(4);
    expect(getAiCost('progression')).toBe(6);
  });

  it('returns 0 for unknown features', () => {
    expect(getAiCost('totallyMadeUp')).toBe(0);
  });
});

describe('AI model preferences', () => {
  it('defaults to the explicit Claude Opus preference', () => {
    expect(DEFAULT_MODEL_PREFERENCE).toBe('anthropic_claude_opus_4_8');
    expect(AI_MODEL_OPTIONS.find(option => option.key === DEFAULT_MODEL_PREFERENCE)?.model).toBe('claude-opus-4-8');
  });

  it('offers explicit Anthropic and OpenAI model IDs', () => {
    expect(AI_MODEL_OPTIONS.map(option => option.key)).toEqual([
      'anthropic_claude_opus_4_8',
      'anthropic_claude_sonnet_4_6',
      'anthropic_claude_haiku_4_5',
      'openai_gpt_5_2',
      'openai_gpt_5_mini',
      'openai_gpt_5_nano',
      'openai_gpt_4_1',
      'openai_gpt_4_1_mini',
    ]);
    expect(AI_MODEL_OPTIONS.find(option => option.key === 'openai_gpt_5_2')?.model).toBe('gpt-5.2');
  });

  it('normalizes legacy aliases into current explicit preferences', () => {
    expect(normalizeModelPreference('claude_best')).toBe('anthropic_claude_opus_4_8');
    expect(normalizeModelPreference('chatgpt_fast')).toBe('openai_gpt_5_mini');
    expect(normalizeModelPreference('not_real')).toBe(DEFAULT_MODEL_PREFERENCE);
  });

  it('uses model cost tiers for fast pricing', () => {
    expect(isFastModelPreference('anthropic_claude_haiku_4_5')).toBe(true);
    expect(isFastModelPreference('openai_gpt_5_mini')).toBe(true);
    expect(isFastModelPreference('openai_gpt_5_2')).toBe(false);
  });
});

describe('getActivePacks()', () => {
  it('returns the new (repriced) packs', () => {
    const packs = getActivePacks();
    expect(Object.keys(packs)).toEqual(['credits_25', 'credits_60', 'credits_150']);
  });

  it('every pack has the fields the UI needs', () => {
    for (const pack of Object.values(getActivePacks())) {
      expect(pack).toEqual(expect.objectContaining({
        key:       expect.any(String),
        name:      expect.any(String),
        price:     expect.any(String),
        credits:   expect.any(Number),
        perCredit: expect.any(String),
        tier:      expect.any(String),
      }));
    }
  });
});

describe('findPackByKey()', () => {
  it('resolves new SKUs', () => {
    expect(findPackByKey('credits_60')?.credits).toBe(60);
  });

  it('resolves legacy SKUs even when packsRepriced is on (refund/replay safety)', () => {
    expect(findPackByKey('credits_15')?.credits).toBe(15);
  });

  it('returns null for unknown keys', () => {
    expect(findPackByKey('does_not_exist')).toBeNull();
  });
});

describe('TIERS', () => {
  it('has wanderer / cartographer / founder', () => {
    expect(TIERS).toHaveProperty('wanderer');
    expect(TIERS).toHaveProperty('cartographer');
    expect(TIERS).toHaveProperty('founder');
  });

  it('wanderer is free, saves 3, and unlocks every size', () => {
    expect(TIERS.wanderer.priceCents).toBe(0);
    expect(TIERS.wanderer.saveLimit).toBe(3);
    // A free account unlocks the full size ladder; only anonymous is town-capped.
    expect(TIERS.wanderer.maxSize).toBe('capital');
  });

  it('cartographer is $5.99/mo and unlocks neighbourhood + supply chain', () => {
    // Rebaselined 600→599 at the owner sign-off 2026-07-17: config reconciled to the
    // DISPLAYED price (the pricing page showed $5.99 while config said $6.00 — the
    // ToS wave's finding; customer-facing prevails).
    expect(TIERS.cartographer.priceCents).toBe(599);
    expect(TIERS.cartographer.billing).toBe('monthly');
    expect(TIERS.cartographer.features.neighbourhoodSystem).toBe(true);
    expect(TIERS.cartographer.features.supplyChainMap).toBe(true);
  });

  it('founder is $99 lifetime with a 30-seat cap', () => {
    expect(TIERS.founder.priceCents).toBe(9900);
    expect(TIERS.founder.billing).toBe('lifetime');
    // 30 chairs — the Hall's cap (lib/founderSeats FOUNDER_SEAT_CAP). There is
    // no server seat gate to match any more: create-checkout sells no chair.
    expect(TIERS.founder.seatLimit).toBe(30);
    expect(TIERS.founder.features.founderBadge).toBe(true);
  });

  it('founder unlocks the same surface as cartographer', () => {
    for (const key of Object.keys(TIERS.cartographer.features)) {
      if (key === 'founderBadge') continue;
      expect(TIERS.founder.features[key]).toBe(TIERS.cartographer.features[key]);
    }
  });
});

describe('getVisibleTiers()', () => {
  it('shows all three tiers (wanderer / cartographer / founder)', () => {
    const tiers = getVisibleTiers();
    expect(tiers.map(t => t.key)).toEqual(['wanderer', 'cartographer', 'founder']);
  });
});

// ── ODQ §464.2 / §471.1-F1 — THE SELLABLE-SKU LIST AND ITS TWO DOCUMENTS ─────
// A SKU can go wrong in two directions and only one of them is loud. An
// UNDOCUMENTED but consumed price id breaks a first cutover: the env is unset,
// create-checkout resolves '' and the product is silently unpurchasable. A
// DOCUMENTED but abolished one is quieter and worse — it instructs a deployer to
// configure a product the platform refuses to sell (`founder_lifetime`,
// ABOLISHED_PRODUCTS, ODQ §118). ACTIVE_CHECKOUT_SKUS is the single derived list
// both directions are measured against.

const ENV_EXAMPLE = '.env.example';
const CREATE_CHECKOUT = 'supabase/functions/create-checkout/index.ts';
const ENV_ACTIVE_MARKER = '# ── Stripe price ids: ACTIVE catalog';
const ENV_LEGACY_MARKER = '# ── Stripe price ids: LEGACY';

const readRepo = (rel) => readFileSync(resolve(process.cwd(), rel), 'utf-8');

/** `credits_25` → `STRIPE_PRICE_CREDITS_25`, the one spelling both docs use. */
function envNameFor(sku) {
  return `STRIPE_PRICE_${sku.toUpperCase()}`;
}

/** The two halves of .env.example's price-id section, sliced on their markers. */
function envBlocks() {
  const src = readRepo(ENV_EXAMPLE);
  const activeAt = src.indexOf(ENV_ACTIVE_MARKER);
  const legacyAt = src.indexOf(ENV_LEGACY_MARKER);
  // A rotted marker would silently produce empty blocks and pass every arm below.
  expect(activeAt, `${ENV_EXAMPLE} lost its ACTIVE marker`).toBeGreaterThan(-1);
  expect(legacyAt, `${ENV_EXAMPLE} lost its LEGACY marker`).toBeGreaterThan(activeAt);
  return { whole: src, active: src.slice(activeAt, legacyAt), legacy: src.slice(legacyAt) };
}

/** Every STRIPE_PRICE_* name in a chunk of text. */
function priceNames(text) {
  return [...text.matchAll(/STRIPE_PRICE_[A-Z0-9_]+/g)].map((m) => m[0]);
}

/**
 * The KEYS of create-checkout's ACTIVE PRICE_MAP block — the server's own view
 * of what is sellable, read off the source between its two section comments.
 */
function serverActiveSkus(src = readRepo(CREATE_CHECKOUT)) {
  const mapAt = src.indexOf('const PRICE_MAP');
  const activeAt = src.indexOf('// ── Active catalog', mapAt);
  const legacyAt = src.indexOf('// ── Legacy SKUs', activeAt);
  expect(mapAt, 'create-checkout lost its PRICE_MAP').toBeGreaterThan(-1);
  expect(activeAt, 'create-checkout lost its Active-catalog marker').toBeGreaterThan(mapAt);
  expect(legacyAt, 'create-checkout lost its Legacy-SKUs marker').toBeGreaterThan(activeAt);
  return [...src.slice(activeAt, legacyAt).matchAll(/^\s+(\w+):\s+Deno\.env\.get\(/gm)].map((m) => m[1]);
}

describe('ACTIVE_CHECKOUT_SKUS ↔ .env.example (the deployer-facing document)', () => {
  it('the derived list is the active packs plus the standing products, dial-aware', () => {
    // ⚠⭐ THIS ARM ASSERTS THE DIAL-INVARIANT SPINE, NEVER THE DIAL'S VALUE.
    //
    // It used to be an EXACT six-element literal, which made it the ONE place the
    // owner's one-line `ANNUAL_FACTOR = 0 → 10` flip would have gone red — against
    // the promise the landed packet makes in its own words (the derivation note at
    // src/config/pricing.js, and docs/implementation/packets/website/WEB-8.md
    // "green at 0 and at 10"), and against the correction R-PINS-SWEEP had already
    // landed on this defect's manifest sibling (PACKET_MANIFEST's WEB-8
    // requiredSymbols row, now symbol-only). A latent red named by no record until
    // the long-tail money-path recon found it.
    //
    // The cure KEEPS the exactness the pin was for — no SKU may join the sellable
    // list without a deliberate edit right here — and removes only the dial
    // coupling, by filtering out the single member the dial governs. Its presence
    // is then asserted below as the dial's CONSEQUENCE, which is the one place in
    // this file the dial's value is read.
    const dialInvariantSpine = ACTIVE_CHECKOUT_SKUS.filter((sku) => sku !== CARTOGRAPHER_ANNUAL.key);
    expect(dialInvariantSpine).toEqual([
      'credits_25', 'credits_60', 'credits_150', 'premium', 'single_dossier', 'surveyor',
    ]);
    // A chair is given, never sold (ABOLISHED_PRODUCTS, ODQ §118). The anchor is
    // `premium` — a sibling produced by the same derivation — so an emptied or
    // re-shaped list reds on the anchor rather than reporting a comfortable
    // absence from nothing.
    expectAbsentWithAnchor(
      ACTIVE_CHECKOUT_SKUS, 'founder_lifetime', 'premium',
      'the abolished SKU is never sellable',
    );
    // THE DIAL'S CONSEQUENCE, not the dial's value: this holds at ANNUAL_FACTOR 0
    // and at 10, so WEB-10's flip needs no edit here.
    expect(ACTIVE_CHECKOUT_SKUS.includes('premium_annual')).toBe(ANNUAL_FACTOR > 0);
  });

  it('every active SKU has its env name in the ACTIVE block', () => {
    const { active } = envBlocks();
    const missing = ACTIVE_CHECKOUT_SKUS.filter((sku) => !active.includes(envNameFor(sku)));
    expect(missing, `${ENV_EXAMPLE}'s active block is missing: ${missing.join(', ')}`).toEqual([]);
    // GUARD THE GUARD: an empty roster would make the filter above vacuous.
    expect(ACTIVE_CHECKOUT_SKUS.length).toBeGreaterThanOrEqual(6);
  });

  it('the ACTIVE block names NO abolished SKU and NO legacy pack', () => {
    const { active } = envBlocks();
    const names = priceNames(active);
    // The anchor is STRIPE_PRICE_PREMIUM: a name produced by the same block slice and
    // the same regex, so a rotted marker or an emptied block reds on the anchor rather
    // than reporting a comfortable absence from nothing.
    const ANCHOR = 'STRIPE_PRICE_PREMIUM';
    expectAbsentWithAnchor(names, 'STRIPE_PRICE_FOUNDER_LIFETIME', ANCHOR, 'the active block excludes abolished SKUs');
    for (const legacyPack of ['CREDITS_5', 'CREDITS_10', 'CREDITS_15', 'CREDITS_40', 'CREDITS_50']) {
      expectAbsentWithAnchor(names, `STRIPE_PRICE_${legacyPack}`, ANCHOR, `${legacyPack} is legacy — it belongs below the legacy marker`);
    }
  });

  it('legacy pack names appear ONLY below the legacy marker, and nowhere else in the file', () => {
    const { whole, legacy } = envBlocks();
    const legacyNames = priceNames(legacy);
    expect(legacyNames).toContain('STRIPE_PRICE_CREDITS_10');
    expect(legacyNames).toContain('STRIPE_PRICE_CREDITS_50');
    // Every occurrence in the whole file is accounted for by one of the two blocks.
    const { active } = envBlocks();
    expect(priceNames(whole).length).toBe(priceNames(active).length + legacyNames.length);
  });

  it('the abolished founder SKU is absent from the whole file', () => {
    const { whole } = envBlocks();
    // The anchor is the Surveyor name — the newest active SKU, produced by the same
    // whole-file scan, so an unreadable or renamed file reds here rather than below.
    expectAbsentWithAnchor(priceNames(whole), 'STRIPE_PRICE_FOUNDER_LIFETIME', 'STRIPE_PRICE_SURVEYOR', 'the abolished SKU is nowhere in .env.example');
  });
});

describe('ACTIVE_CHECKOUT_SKUS ↔ create-checkout PRICE_MAP (both directions, F8)', () => {
  it('the two active sets are equal — neither side may move alone', () => {
    const server = serverActiveSkus();
    expect([...server].sort()).toEqual([...ACTIVE_CHECKOUT_SKUS].sort());
  });

  it('NEGATIVE CONTROL: an extra on the SERVER side breaks the equality', () => {
    const src = readRepo(CREATE_CHECKOUT).replace(
      '  // ── Legacy SKUs',
      "  premium_annual:   Deno.env.get('STRIPE_PRICE_PREMIUM_ANNUAL') || '',\n  // ── Legacy SKUs",
    );
    const planted = serverActiveSkus(src);
    expect(planted).toContain('premium_annual');
    expect([...planted].sort()).not.toEqual([...ACTIVE_CHECKOUT_SKUS].sort());
  });

  it('NEGATIVE CONTROL: an extra on the CLIENT side breaks the equality', () => {
    const planted = [...ACTIVE_CHECKOUT_SKUS, 'premium_annual'];
    expect([...planted].sort()).not.toEqual([...serverActiveSkus()].sort());
  });
});

describe('SURVEYOR_PLAN — the dark registration (ODQ §464.2 O-P2, landed by WEB-8)', () => {
  it('is $14.99 monthly, BYOK, and keyed to the entitlement table', () => {
    expect(SURVEYOR_PLAN.priceCents).toBe(1499);
    expect(SURVEYOR_PLAN.priceCents).toBe(Math.round(14.99 * 100));
    expect(SURVEYOR_PLAN.billing).toBe('monthly');
    expect(SURVEYOR_PLAN.byok).toBe(true);
    expect(SURVEYOR_PLAN.entitlement).toBe('surveyor_entitlements');
    expect(Object.isFrozen(SURVEYOR_PLAN)).toBe(true);
  });

  it("its stripeProduct is a key create-checkout already resolves", () => {
    expect(SURVEYOR_PLAN.stripeProduct).toBe('surveyor');
    expect(serverActiveSkus()).toContain(SURVEYOR_PLAN.stripeProduct);
  });

  it('it is an ENTITLEMENT, not a tier — getVisibleTiers stays three-way', () => {
    // TIERS keys are profiles.tier shapes; migration 139 declined to widen the
    // CHECK, so the plan lives outside TIERS and no TIERS consumer changes. The
    // anchor is cartographer — the paying tier that must always be in both
    // collections, so a frozen-away TIERS or an empty visible list reds on it.
    expectAbsentWithAnchor(Object.keys(TIERS), 'surveyor', 'cartographer', 'Surveyor is an entitlement, not a TIERS key');
    expectAbsentWithAnchor(getVisibleTiers().map((t) => t.key), 'surveyor', 'cartographer', 'Surveyor does not render as a tier');
  });
});

describe('CARTOGRAPHER_ANNUAL — a DERIVATION, so the pins hold at either dial', () => {
  it('price and credits are exactly ANNUAL_FACTOR times the monthly plan', () => {
    expect(CARTOGRAPHER_ANNUAL.priceCents).toBe(ANNUAL_FACTOR * TIERS.cartographer.priceCents);
    expect(CARTOGRAPHER_ANNUAL.credits).toBe(ANNUAL_FACTOR * TIERS.cartographer.monthlyCredits);
    expect(CARTOGRAPHER_ANNUAL.factor).toBe(ANNUAL_FACTOR);
    expect(CARTOGRAPHER_ANNUAL.billing).toBe('annual');
    expect(Object.isFrozen(CARTOGRAPHER_ANNUAL)).toBe(true);
  });

  it('the derivation is proved live at the dial WEB-10 will set (two months free)', () => {
    // Driven rather than asserted: the same arithmetic at factor 10 is what the
    // flip produces, so this pin cannot pass by both sides being zero.
    const AT_TEN = 10;
    expect(AT_TEN * TIERS.cartographer.priceCents).toBe(5990);
    expect(AT_TEN * TIERS.cartographer.monthlyCredits).toBe(300);
    expect(AT_TEN * TIERS.cartographer.priceCents).toBe(12 * TIERS.cartographer.priceCents - 2 * TIERS.cartographer.priceCents);
  });

  it('it is not a tier and not on sale at this dial', () => {
    expectAbsentWithAnchor(Object.keys(TIERS), 'premium_annual', 'cartographer', 'the annual plan is not a TIERS key');
    expectAbsentWithAnchor(getVisibleTiers().map((t) => t.key), 'premium_annual', 'cartographer', 'the annual plan does not render as a tier');
    // The anchor is the monthly premium SKU: it is derived by the same spread that
    // would carry premium_annual once the dial lit, so an emptied list cannot pass.
    expectAbsentWithAnchor(ACTIVE_CHECKOUT_SKUS, CARTOGRAPHER_ANNUAL.key, 'premium', 'the annual SKU is unsellable at dial 0');
  });
});

describe('SINGLE_DOSSIER', () => {
  it('is $2.99, requires no account, and ships a PDF', () => {
    expect(SINGLE_DOSSIER.priceCents).toBe(299);
    expect(SINGLE_DOSSIER.priceLabel).toBe('$2.99');
    expect(SINGLE_DOSSIER.requiresAccount).toBe(false);
    expect(SINGLE_DOSSIER.deliverables).toContain('pdf');
  });

  it('singleDossierEnabled() is true (the one-shot ships)', () => {
    expect(singleDossierEnabled()).toBe(true);
  });
});

// ── Source pin: no panel resolves its price at import time (wave L-5) ────────
// Eight Surveyor panels used to read `const cost = getSurveyorAiCost('x')` at
// MODULE SCOPE, which freezes the quote at the moment the module is first
// imported — one value for the whole session, for every user. That is fine while
// the price is a constant and wrong the instant the capability-tier multiplier
// activates, because the tier is a property of the USER, not of the bundle. The
// calls now live inside the component bodies, so the price re-resolves per
// render. This pin keeps them there: a module-scope call reintroduced later
// would be invisible in review and would silently pin one user's price for
// everybody.
const COMPONENT_ROOT = resolve(process.cwd(), 'src', 'components');

/** Every .js/.jsx file under src/components, recursively. */
function componentFiles(dir = COMPONENT_ROOT, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) componentFiles(full, out);
    else if (/\.jsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

/**
 * Lines that CALL getSurveyorAiCost at module scope. A call inside a component
 * or a hook is indented; a module-scope declaration starts at column 0. The
 * import statement is excluded (it names the symbol without calling it).
 */
function moduleScopeCostCalls(src) {
  return src.split('\n')
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => /getSurveyorAiCost\s*\(/.test(line) && /^\S/.test(line));
}

describe('surveyor panels resolve their price per render, not at import', () => {
  it('the detector actually fires (negative control)', () => {
    // Both real shapes this wave removed: a bare module-scope constant, and a
    // module-scope helper closing over the call.
    expect(moduleScopeCostCalls("const cost = getSurveyorAiCost('autonomy');")).toHaveLength(1);
    expect(moduleScopeCostCalls('const costFor = (s) => getSurveyorAiCost(s);')).toHaveLength(1);
    // And it does NOT fire on the compliant shape or on the import.
    expect(moduleScopeCostCalls("  const cost = getSurveyorAiCost('autonomy');")).toHaveLength(0);
    expect(moduleScopeCostCalls("import { getSurveyorAiCost } from '../config/pricing.js';")).toHaveLength(0);
  });

  it('no file under src/components calls getSurveyorAiCost at module scope', () => {
    const offenders = [];
    let callers = 0;
    for (const file of componentFiles()) {
      const src = readFileSync(file, 'utf-8');
      if (!src.includes('getSurveyorAiCost')) continue;
      callers += 1;
      for (const { n, line } of moduleScopeCostCalls(src)) {
        offenders.push(`${relativeToRoot(file)}:${n}  ${line.trim()}`);
      }
    }
    // Guard-the-guard: if the roster ever reads 0 the scan found nothing to
    // check and this suite would be green on an empty set.
    // ⚠ 8 → 7 (ODQ §763.2): StyleOverhaulPanel.jsx was one of the eight importers and is
    // deleted. This floor moves DOWN ONLY, and only for a genuine retirement — raising it to
    // clear a red would be raising the bar on a detector that had already collapsed.
    expect(callers, 'no component imports getSurveyorAiCost — the scan broke').toBeGreaterThanOrEqual(7);
    expect(offenders, `\nmove these inside the component body:\n${offenders.join('\n')}\n`).toEqual([]);
  });
});

/** Repo-relative path for a readable failure message. */
function relativeToRoot(file) {
  return file.slice(process.cwd().length + 1);
}
