/**
 * impactKindWalkers.test.js — the impactKind coverage walkers (content-immersion-r2-1/-2).
 *
 * Two registration walkers over the impactKinds the engine MINTS (source-scanned from
 * every `impactKind: '<literal>'` write site in src/domain). They stop the two display
 * surfaces from silently lagging the engine as new waves add impactKinds:
 *
 *   1. PHRASING (content-immersion-r2-2): every minted impactKind must have an explicit
 *      WHAT_PHRASES entry in settlementRumors.js, so a rumor headline never renders a raw
 *      de-underscored slug ("Merchants bring word of generosity relief"). Reds until phrased.
 *
 *   2. VOICE (content-immersion-r2-1): every minted impactKind must be CLASSIFIED in the
 *      EXPECTED_VOICE manifest below — either to a real crier VoiceCategory or explicitly to
 *      null (no voice). A new mint reds this until its author decides whether it deserves a
 *      crier line, which — with the set-but-unclassified guard in newsVoiceCategory — is what
 *      keeps a boom from borrowing the trade crier's market-shortage line.
 *
 * The manifest-walker idiom (structural prevention §2): discovery is automatic (the scan),
 * registration is manual (WHAT_PHRASES + EXPECTED_VOICE), and these tests force them together.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { WHAT_PHRASES } from '../../src/domain/display/settlementRumors.js';
import { newsVoiceCategory } from '../../src/domain/display/newsVoice.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DOMAIN = join(ROOT, 'src', 'domain');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(e) && !/\.test\./.test(e)) out.push(p);
  }
  return out;
}

// Every `impactKind: '<literal>'` minted by a domain kernel/news-builder. (Dynamic
// `impactKind: <var>` assignments — the proposal candidateType path — are out of this
// literal scan's reach; those tokens are candidateTypes already phrased in WHAT_PHRASES.)
const MINT_RE = /impactKind:\s*['"]([a-z][a-z0-9_]*)['"]/g;

function mintedImpactKinds() {
  const kinds = new Set();
  for (const abs of walk(DOMAIN)) {
    const src = readFileSync(abs, 'utf8');
    for (const m of src.matchAll(MINT_RE)) kinds.add(m[1]);
  }
  return [...kinds].sort();
}

// The VOICE classification of every minted impactKind: a crier VoiceCategory, or null for
// "no voice" (out of scope — the crier stays silent). A new minted kind must be added here
// (the exact-set test below fails otherwise), forcing a conscious voice decision.
const EXPECTED_VOICE = {
  // voiced beats
  boom: 'prosperity', flourishing: 'prosperity', reconstruction: 'prosperity',
  bust: 'trade', calamity: 'calamity', plague_arrival: 'pestilence', generosity_relief: 'succor',
  // deliberately unvoiced (no crier beat for these impacts)
  belief_misjudgment: null, blockade_declared: null, blockade_lifted: null, cause_lifecycle: null, diplomacy: null,
  faction_capture: null, field_battle: null, generosity_credit_default: null,
  generosity_purchase: null, generosity_refuge: null, generosity_refusal: null,
  generosity_trade_overture: null, harvest: null, hierarchy_cascade: null, hungry_gap: null,
  intervention: null, intervention_clash: null, moral_reckoning: null, pantheon_ascendancy: null,
  pantheon_twilight: null, queue_refused: null, realm_verb_refused: null, sea_battle: null,
  spring_thaw: null, stressor_aftermath: null, stressor_graduated: null, stressor_wind_down: null,
  // THE GROWTH LAYER (owner commission #36): a person weathering into a learned trait is a
  // quiet local character beat, NOT a town-crier proclamation — deliberately unvoiced.
  npc_growth: null,
  // THE URBAN FABRIC LAYER (owner commission #39): stone turning at masonry pace is a
  // quiet chronicle beat, NOT a town-crier proclamation — deliberately unvoiced (the
  // npc_growth precedent; catastrophe itself is already voiced via the calamity beat).
  urban_fabric: null,
  // DOOR 1 — THE SPATIAL CONSEQUENCE LAYER (owner ruling #8): WHERE a calamity/intrigue
  // landed is district-precision chronicle detail, NOT a town-crier proclamation —
  // deliberately unvoiced (the urban_fabric precedent; the calamity itself is already
  // voiced via the calamity beat).
  spatial_consequence: null,
  // THE LADDER (owner commission, engine lift #3): a rise/fall within a faction's rank
  // order is a quiet court beat carrying its own reason receipt, NOT a town-crier
  // proclamation — deliberately unvoiced (the npc_growth/urban_fabric precedent).
  npc_ladder: null,
  // THE TRADITIONS (owner commission, engine lift #4): a festival held or set aside is a
  // chronicle beat carrying its own reason receipt, and no crier VoiceCategory fits a
  // culture observance — deliberately unvoiced (the npc_ladder/urban_fabric precedent; a
  // dedicated 'culture' crier is a T-5 surface question, not a T-2 mis-route).
  tradition: null,
  // DEEP COUPLINGS (D-0 / D-1c): the belief-axis SUBSTRATE beats — a refugee column
  // (migration_flight, the demographic axis) and a reshaped observance (tradition_change,
  // the cultural axis) enter the rumor net to feed distant courts' beliefs, but neither is
  // a town-crier proclamation: migration_flight would spam a crier on every column (the
  // aggregate migration_pressure keeps the 'migration' voice), and tradition_change follows
  // the tradition:null precedent (no culture crier). Deliberately unvoiced (JUDGMENT, vetoable).
  migration_flight: null,
  tradition_change: null,
};

describe('impactKind walkers (content-immersion-r2-1/-2)', () => {
  const minted = mintedImpactKinds();

  test('the mint scan is non-vacuous', () => {
    expect(minted.length).toBeGreaterThan(20);
  });

  test('every minted impactKind is phrased in WHAT_PHRASES (no raw slug reaches a headline)', () => {
    const unphrased = minted.filter((k) => !(k in WHAT_PHRASES));
    // To comply: add `k: '<in-world phrase a townsperson would say>'` to WHAT_PHRASES.
    expect(unphrased).toEqual([]);
  });

  test('every minted impactKind is classified in EXPECTED_VOICE (voice decision forced)', () => {
    const unclassified = minted.filter((k) => !(k in EXPECTED_VOICE));
    const stale = Object.keys(EXPECTED_VOICE).filter((k) => !minted.includes(k));
    // A new mint → add it to EXPECTED_VOICE (a real category or null). A removed mint →
    // delete its stale entry.
    expect({ unclassified, stale }).toEqual({ unclassified: [], stale: [] });
  });

  test('newsVoiceCategory returns each minted kind\'s expected category', () => {
    const wrong = [];
    for (const k of minted) {
      const got = newsVoiceCategory({ impactKind: k });
      if (got !== EXPECTED_VOICE[k]) wrong.push(`${k}: expected ${EXPECTED_VOICE[k]}, got ${got}`);
    }
    expect(wrong).toEqual([]);
  });
});
