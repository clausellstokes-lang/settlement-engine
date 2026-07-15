/**
 * tests/generators/chainUpstreamSingleSource.test.js
 *
 * Guard for the dual cascade-dependency collapse in computeActiveChains.js.
 *
 * The file once carried TWO overlapping upstream-dependency systems:
 *   1. a hardcoded `CHAIN_DEPS` map + its own propagation block, and
 *   2. the data-driven `chain.upstreamChains` multi-order resolution.
 * They disagreed (e.g. CHAIN_DEPS said smelting ← fuel/timber while the data
 * says smelting ← iron/fuel). Both wrote `chain.upstreamNote` / downgraded
 * `chain.status`; whichever ran last won, silently overwriting the other and —
 * because CHAIN_DEPS downgraded `running` → `vulnerable` first — suppressing the
 * data pass's `upstreamMissing`, so `deriveImportsFromChains` dropped the real
 * missing import. The fix collapses to the SINGLE data-driven graph.
 *
 * Two independent layers prove the collapse and ratchet against its return:
 *   A. Source-level ratchet — the file no longer declares a second hardcoded
 *      dependency map (`CHAIN_DEPS`). This catches a literal revert directly.
 *   B. Behavioural invariant — for every active chain, EVERY chain id named in
 *      `upstreamNote` / `upstreamWeak` / `upstreamMissing` is a member of that
 *      chain's OWN data-declared `upstreamChains`. A second, contradictory graph
 *      could only break this by stamping a note that mentions an upstream the
 *      data never declared (which is exactly what the old CHAIN_DEPS did for
 *      smelting → "timber"). Plus a concrete regression case for smelting and a
 *      stability check (same inputs → byte-identical upstream fields).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import { computeActiveChains } from '../../src/generators/computeActiveChains.js';
import { SUPPLY_CHAIN_NEEDS } from '../../src/data/supplyChainData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../../src/generators/computeActiveChains.js');

const inst = (...names) => names.map((name, i) => ({ id: `i${i}`, name }));

/** Bare chain id → its data-declared upstreamChains (the single source of truth). */
const UPSTREAM_BY_ID = (() => {
  const map = {};
  for (const need of Object.values(SUPPLY_CHAIN_NEEDS)) {
    for (const chain of need.chains) map[chain.id] = chain.upstreamChains || [];
  }
  return map;
})();

const ALL_CHAIN_IDS = new Set(Object.keys(UPSTREAM_BY_ID));

/** Pull the upstream chain ids a note string names (notes interpolate the ids). */
function chainIdsMentionedInNote(note) {
  if (!note) return [];
  return [...ALL_CHAIN_IDS].filter((id) => {
    // Match the id as a whole token so 'iron' does not match 'iron_ore' etc.
    const rx = new RegExp(`(^|[^a-z_])${id}([^a-z_]|$)`);
    return rx.test(note);
  });
}

// ── A. Source-level ratchet ──────────────────────────────────────────────────

describe('computeActiveChains has a SINGLE cascade-dependency graph', () => {
  it('source declares no second hardcoded dependency map', () => {
    const src = readFileSync(SRC, 'utf8');
    // The data-driven `chain.upstreamChains` is the only dependency table. A
    // reintroduced inline map (the dual-system bug) would declare a parallel
    // chain-id → upstream-ids object. Match the DECLARATION shape, not a bare
    // token, so the history described in the comments cannot trip the ratchet.
    expect(src, 'the old CHAIN_DEPS map must not return').not.toMatch(/\bconst\s+CHAIN_DEPS\s*=/);
    // Generalised: any new inline map whose values are bare-chain-id arrays
    // would re-create the contradiction. A const declaration immediately
    // followed by an object literal keyed by a bare chain id mapping to an
    // array literal is the structural fingerprint of such a parallel graph.
    const inlineDepMap = /\bconst\s+\w+\s*=\s*\{\s*\n\s*[a-z_]+\s*:\s*\[\s*['"][a-z_]+['"]/;
    expect(src, 'no inline {chainId: [upstreamIds]} dependency map may live in this file')
      .not.toMatch(inlineDepMap);
  });
});

// ── B. Behavioural invariant + regression + stability ────────────────────────

describe('upstream notes/weaknesses come from the data graph only', () => {
  // A spread of rosters/resources that activate downstream chains with and
  // without their declared upstreams, so the cascade actually fires.
  const cases = [
    // smelting (data upstream [iron, fuel]) active, NO local iron chain, fuel depleted
    {
      label: 'smelting, no iron chain, fuel depleted',
      args: [inst('Smelter', 'Charcoal burner'), ['iron_deposits', 'coal_deposits'], 'city', 'road', [], ['coal_deposits'], 0],
    },
    // brewing (data upstream [grain]) with grain present but its resource depleted
    {
      label: 'brewing with grain depleted upstream',
      args: [inst('Mill', 'Alehouse', 'Cooper'), ['grain_fields'], 'town', 'road', [], ['grain_fields'], 0],
    },
    // weapons_armor (data upstream [smelting]) with no local smelting chain
    {
      label: 'weapons_armor with no smelting chain',
      args: [inst('Armourers', 'Blacksmiths (3-10)'), ['iron_deposits'], 'city', 'road', [], [], 0],
    },
    // leather (data upstream [livestock]) active via hunting grounds, NO livestock chain
    {
      label: 'leather with no livestock chain',
      args: [inst('Tannery', "Cobbler's guild"), ['hunting_grounds'], 'town', 'road', [], [], 0],
    },
  ];

  it.each(cases)('every upstream id named is in the chain\'s own upstreamChains — $label', ({ args }) => {
    const chains = computeActiveChains(...args);
    // The case set must actually exercise the cascade, or the test is vacuous.
    const flagged = chains.filter(
      (c) => c.upstreamNote || c.upstreamWeak?.length || c.upstreamMissing?.length,
    );
    expect(flagged.length).toBeGreaterThan(0);

    for (const c of chains) {
      const declared = new Set(c.upstreamChains || []);
      const mentioned = new Set([
        ...chainIdsMentionedInNote(c.upstreamNote),
        ...(c.upstreamWeak || []),
        ...(c.upstreamMissing || []),
      ]);
      for (const id of mentioned) {
        expect(
          declared.has(id),
          `${c.chainId}: upstream "${id}" is referenced (note="${c.upstreamNote}") but is NOT in its data upstreamChains ${JSON.stringify(c.upstreamChains)} — a second dependency graph is fighting the data`,
        ).toBe(true);
      }
    }
  });

  it('smelting regression: the note matches the DATA graph (iron), not the dead [fuel,timber] map', () => {
    const chains = computeActiveChains(
      inst('Smelter', 'Charcoal burner'), ['iron_deposits', 'coal_deposits'], 'city', 'road', [], [], 0,
    );
    const smelting = chains.find((c) => c.chainId === 'smelting');
    expect(smelting, 'smelting chain should be active').toBeTruthy();
    // No local iron chain → data graph flags iron as the missing import.
    expect(smelting.upstreamMissing).toEqual(['iron']);
    expect(smelting.upstreamNote).toBe('Needs imported iron: no local source');
    // The old hardcoded map would have stamped "fuel or timber disrupted".
    expect(smelting.upstreamNote).not.toMatch(/timber/);
  });

  it('the upstream cascade fields are stable across identical runs', () => {
    const mk = () => computeActiveChains(
      inst('Smelter', 'Charcoal burner'), ['iron_deposits', 'coal_deposits'], 'city', 'road', [], ['coal_deposits'], 0,
    ).map((c) => ({
      chainId: c.chainId,
      status: c.status,
      upstreamNote: c.upstreamNote ?? null,
      upstreamWeak: c.upstreamWeak ?? null,
      upstreamMissing: c.upstreamMissing ?? null,
    }));
    expect(mk()).toEqual(mk());
  });
});
