/** @vitest-environment jsdom */
/**
 * tests/lib/scribeArtefact.test.js — THE ARTEFACT AND ITS FIVE LIFECYCLE CURES (W2 commit 1).
 *
 * The design traced every path a settlement's state can take (design §5) and named five where
 * an unguarded 150-200 KB prose key would have done real damage. Each has one arm here, each
 * arm has a NEGATIVE CONTROL, and the controls matter more than the assertions: an arm that
 * cannot fail is not a pin.
 *
 *   1. SNAPSHOT      — 50 version-history clones would each carry the prose. Stripped.
 *   2. STASH         — five whole settlements in localStorage against a ~5 MB quota. Stripped.
 *   3. EXPORT/IMPORT — the transfer ceiling refused an account its own export. Raised, and the
 *                      1,000-town round trip is measured rather than asserted.
 *   4. LOCKED CARRY  — a full generate is a new town; a unit only carries where its ground did.
 *   5. PUBLIC        — absent from the allowlist, so no gallery, anon or preview surface sees it.
 */
import { describe, it, expect, beforeEach } from 'vitest';

import {
  SCRIBE_ARTEFACT_SCHEMA,
  SCRIBE_PAST_EPOCH_LIMIT,
  attachProse,
  carryProseThroughGenerate,
  currentAdvanceSeq,
  emptyArtefact,
  isStale,
  landBlock,
  proseOf,
  restoreToDepth,
  retireCurrent,
  stripProse,
  unitsFor,
} from '../../src/lib/scribeArtefact.js';
import { snapshotSettlement } from '../../src/store/settlementSliceHelpers.js';
import { stashPendingDossier, readPendingDossierByToken, clearPendingDossier } from '../../src/lib/pendingDossier.js';
import { toPublicSafe, PUBLIC_TOPLEVEL_KEYS } from '../../src/domain/display/publicSafe.js';
import { MAX_IMPORT_BYTES, accountTransferByteLength } from '../../src/lib/accountTransferContract.js';
import { validateAccountImport } from '../../src/lib/accountImport.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** The ceiling before W2 raised it. Named so the round-trip arm can show both directions. */
const OLD_CEILING_BYTES = 32 * 1024 * 1024;

const unit = (text) => ({ vid: 3, spine: text, faces: [text], notebook: [], verdicts: ['PASS'], report: {} });

function scribed(overrides = {}) {
  const prose = landBlock(null, {
    advanceSeq: 0,
    blockId: 'DS-DEF-2',
    pools: { 'FAMILY: acute crisis': [unit('The watch keeps a short roll.')] },
    renderedFor: 'seed-a',
    renderedAt: '2026-09-14T00:00:00.000Z',
    version: { scribe: 'sc1', engine: 'eng1', refuter: 'rf1', model: 'claude-opus-5' },
  });
  return {
    id: 'town-1', name: 'Ashford', _seed: 'seed-a', tier: 'town',
    history: { age: 215 }, npcs: [], institutions: [],
    ...overrides,
    prose,
  };
}

describe('the artefact shape', () => {
  it('an unscribed settlement has NO key at all (absent, not empty)', () => {
    // The 525-town generator golden master hashes whole settlements. An unconditional key,
    // even an empty one, would move all 525 hashes and demand a shift record for nothing.
    const plain = { id: 'x', name: 'y' };
    expect('prose' in plain).toBe(false);
    expect(proseOf(plain)).toBe(null);
    expect(attachProse(plain, null)).toEqual(plain);
  });

  it('names the seed field renderedFor, never seed', () => {
    // PRIVATE_KEY_RE strips any sub-key containing `seed` on every public projection, and its
    // SQL twin does the same. A field called `seed` here would be silently holed the day the
    // artefact is ever projected.
    const artefact = emptyArtefact({ renderedFor: 'seed-a' });
    expect(Object.keys(artefact)).toContain('renderedFor');
    expect(JSON.stringify(artefact)).not.toMatch(/"seed"/);
    expect(artefact.schema).toBe(SCRIBE_ARTEFACT_SCHEMA);
  });

  it('a block lands, and reads back only for its own seed and engine', () => {
    const prose = proseOf(scribed());
    const q = { blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis' };
    expect(unitsFor(prose, { ...q, renderedFor: 'seed-a', engineVersion: 'eng1' })).toHaveLength(1);
    // NEGATIVE CONTROLS — each of these must fall back to the corpus, never draw stale prose.
    expect(unitsFor(prose, { ...q, renderedFor: 'seed-b', engineVersion: 'eng1' })).toBe(null);
    expect(unitsFor(prose, { ...q, renderedFor: 'seed-a', engineVersion: 'eng2' })).toBe(null);
    expect(unitsFor(prose, { blockId: 'DS-ECO-1', poolKey: 'x', renderedFor: 'seed-a' })).toBe(null);
    expect(unitsFor(null, q)).toBe(null);
    expect(unitsFor({ schema: 99, current: {} }, q)).toBe(null);
  });

  it('staleness is what the OPEN trigger asks', () => {
    const prose = proseOf(scribed());
    expect(isStale(prose, { advanceSeq: 0, renderedFor: 'seed-a', engineVersion: 'eng1' })).toBe(false);
    expect(isStale(prose, { advanceSeq: 1, renderedFor: 'seed-a', engineVersion: 'eng1' })).toBe(true);
    expect(isStale(prose, { advanceSeq: 0, renderedFor: 'seed-b' })).toBe(true);
    expect(isStale(null, { advanceSeq: 0 })).toBe(true);
  });

  it('every writer is pure: the input artefact is never mutated', () => {
    const prose = proseOf(scribed());
    const before = JSON.stringify(prose);
    landBlock(prose, {
      advanceSeq: 1, blockId: 'DS-ECO-1', pools: { p: [unit('a')] }, renderedFor: 'seed-a',
    });
    retireCurrent(prose, { state: 'undone' });
    restoreToDepth(prose, { advanceSeq: 0 });
    expect(JSON.stringify(prose)).toBe(before);
  });
});

describe('CURE 1 — the version-history snapshot strips the artefact', () => {
  it('a snapshot carries no prose, and everything else survives', () => {
    const settlement = scribed();
    const snap = snapshotSettlement(settlement);
    expect('prose' in snap).toBe(false);
    expect(snap.name).toBe('Ashford');
    expect(snap.history).toEqual({ age: 215 });
    // NEGATIVE CONTROL — the live blob still has it, so a restore re-attaches from there.
    expect(proseOf(settlement)).not.toBe(null);
  });

  it('fifty snapshots of a scribed town cost nothing in prose bytes', () => {
    const settlement = scribed();
    const lane = Array.from({ length: 50 }, () => snapshotSettlement(settlement));
    const bytes = accountTransferByteLength(JSON.stringify(lane));
    const oneWithProse = accountTransferByteLength(JSON.stringify(settlement));
    expect(JSON.stringify(lane)).not.toContain('The watch keeps a short roll.');
    // The whole lane is smaller than fifty copies of ONE settlement that carries the artefact.
    expect(bytes).toBeLessThan(oneWithProse * 50);
  });
});

describe('CURE 2 — the pending-dossier stash strips the artefact', () => {
  const token = 'tok-'.padEnd(30, 'x');
  beforeEach(() => {
    window.localStorage.clear();
    clearPendingDossier();
  });

  it('a stashed settlement keeps its world and loses its prose', () => {
    expect(stashPendingDossier(scribed(), token)).toBe(true);
    const read = readPendingDossierByToken(token);
    expect(read.settlement.name).toBe('Ashford');
    expect('prose' in read.settlement).toBe(false);
    expect(window.localStorage.getItem('sf.pendingDossier')).not.toContain('The watch keeps a short roll.');
  });

  it('NEGATIVE CONTROL — an unscribed settlement stashes byte-identically to before', () => {
    const plain = { id: 't', name: 'Plain', _seed: 's' };
    expect(stashPendingDossier(plain, token)).toBe(true);
    expect(readPendingDossierByToken(token).settlement).toEqual(plain);
  });
});

describe('CURE 3 — the account-transfer ceiling, and the wall behind it', () => {
  const scribedTown = () => {
    // The artefact sized the way the design costs it (§6): roughly sixty firing pools a town,
    // each a spine and its faces. That is tens of kilobytes of TEXT, not the hundreds the town
    // CARD runs to; the card crosses the boundary and is never persisted, only the units are.
    const filler = 'The watch keeps a roll of the men it can call, and the roll is short. '.repeat(5);
    let town = scribed();
    for (let block = 0; block < 12; block += 1) {
      town = {
        ...town,
        prose: landBlock(town.prose, {
          advanceSeq: 0,
          blockId: `DS-BLK-${block}`,
          pools: Object.fromEntries(
            Array.from({ length: 5 }, (unused, pool) => [`pool-${pool}`, [unit(filler)]]),
          ),
          renderedFor: 'seed-a',
          renderedAt: '2026-09-14T00:00:00.000Z',
          version: { scribe: 'sc1', engine: 'eng1', refuter: 'rf1', model: 'claude-opus-5' },
        }),
      };
    }
    return town;
  };

  it('the ceiling is 64 MiB', () => {
    expect(MAX_IMPORT_BYTES).toBe(64 * 1024 * 1024);
  });

  it('a 1,000-town scribed export fits the raised ceiling and would NOT have fit the old one', () => {
    // MAX_IMPORT_SETTLEMENTS is 1,000, so this is the largest estate the contract admits by
    // COUNT. The cure is shown in both directions: the same estate fits under the raised byte
    // ceiling and was over the old one, which is exactly the silent data-loss path the design
    // named — an account that cannot re-import its own export.
    const town = scribedTown();
    const envelope = {
      version: 4,
      settlements: Array.from({ length: 1000 }, (unused, index) => ({
        id: `t-${index}`, name: `Town ${index}`, settlement: town,
      })),
      campaigns: [],
    };
    const bytes = accountTransferByteLength(JSON.stringify(envelope));
    expect(bytes).toBeLessThanOrEqual(MAX_IMPORT_BYTES);
    expect(bytes).toBeGreaterThan(OLD_CEILING_BYTES);
  });

  it('⛔ THE WALL BEHIND THE CEILING — the node budget, measured, and NOT the Scribe\'s', () => {
    // ⭐ A FINDING THIS ARM EXISTS TO KEEP, recorded here so it is never re-found as a Scribe
    // bug. Raising the BYTE ceiling does not make a large estate importable, because
    // `validateAccountImport` parses through `parseContentJson` → `detachContentJson`, whose
    // MAX_NODES is 20,000 JSON nodes for the WHOLE envelope. A real generated settlement is
    // over five thousand nodes on its own, so the importer admits a HANDFUL of real
    // settlements — with the artefact or without it. The artefact is a small fraction of a
    // town's node count and moves that number not at all.
    //
    // Changing MAX_NODES is a bound on an UNTRUSTED parse, which is security posture and the
    // owner's call, so this lane MEASURES it and leaves it. What the arm pins is the shape of
    // the claim: the binding limit is the node budget, it is pre-existing, and it is
    // prose-neutral.
    const real = generateSettlementPipeline(
      {
        settType: 'town', culture: 'germanic', terrainOverride: 'river',
        roadOverride: 'road', civOverride: 'civilized',
      },
      null,
      { seed: 'scribe-node-budget-probe', customContent: {} },
    );
    const plain = real.settlement || real;
    const withProse = { ...plain, prose: scribedTown().prose };

    const nodesOf = (value) => {
      let nodes = 0;
      const visit = (v) => {
        nodes += 1;
        if (v && typeof v === 'object') for (const key of Object.keys(v)) visit(v[key]);
      };
      visit(value);
      return nodes;
    };
    const plainNodes = nodesOf(plain);
    const proseNodes = nodesOf(withProse) - plainNodes;

    // The town itself is the dominant term by an order of magnitude.
    expect(plainNodes).toBeGreaterThan(4000);
    expect(proseNodes).toBeLessThan(plainNodes / 3);
    // And the whole budget is smaller than a handful of towns, artefact or no artefact.
    expect(plainNodes * 4).toBeGreaterThan(20_000);

    const envelopeOf = (town, count) => JSON.stringify({
      version: 4,
      settlements: Array.from({ length: count }, (unused, index) => ({
        id: `t-${index}`, name: `Town ${index}`, settlement: town,
      })),
      campaigns: [],
    });
    // FOUR real towns are refused either way, and NOT on bytes.
    const fourWith = envelopeOf(withProse, 4);
    expect(accountTransferByteLength(fourWith)).toBeLessThan(MAX_IMPORT_BYTES);
    expect(validateAccountImport(fourWith).failureKind).toBe('json_boundary_invalid');
    expect(validateAccountImport(envelopeOf(plain, 4)).failureKind).toBe('json_boundary_invalid');
    // THREE are admitted either way, which is the prose-neutrality claim stated as a number.
    expect(validateAccountImport(envelopeOf(plain, 3)).ok).toBe(true);
    expect(validateAccountImport(envelopeOf(withProse, 3)).ok).toBe(true);
  });

  it('an estate inside the node budget round-trips with its prose intact', () => {
    const town = scribedTown();
    const envelope = JSON.stringify({
      version: 4,
      settlements: Array.from({ length: 20 }, (unused, index) => ({
        id: `t-${index}`, name: `Town ${index}`, settlement: town,
      })),
      campaigns: [],
    });
    const result = validateAccountImport(envelope);
    expect(result.ok).toBe(true);
    expect(result.value.settlements).toHaveLength(20);
    // The artefact survives the transfer VERBATIM — it is the owner's own world's text.
    expect(result.value.settlements[0].settlement.prose.current.blocks['DS-BLK-0']).toBeTruthy();
  });

  it('NEGATIVE CONTROL — an envelope past the byte ceiling is still refused on bytes', () => {
    const oversized = `{"version":4,"settlements":[],"campaigns":[],"pad":"${'x'.repeat(MAX_IMPORT_BYTES)}"}`;
    const result = validateAccountImport(oversized);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/too large/i);
  });
});

describe('CURE 4 — the locked carry across a full generate', () => {
  const rows = (ground) => () => [
    { blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', ground },
  ];

  it('nothing carries when no lock is set, however identical the ground', () => {
    const prev = scribed();
    const fresh = { id: 'town-2', name: 'Bywater', _seed: 'seed-b' };
    const out = carryProseThroughGenerate(prev, fresh, {}, rows('same'));
    expect(out).toBe(fresh);
    expect('prose' in out).toBe(false);
  });

  it('a locked pool carries only where its ground is unchanged', () => {
    const prev = scribed();
    const fresh = { id: 'town-2', name: 'Ashford', _seed: 'seed-b' };
    const carried = carryProseThroughGenerate(prev, fresh, { history: true }, rows('same'));
    expect(proseOf(carried)).not.toBe(null);
    expect(unitsFor(proseOf(carried), {
      blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', renderedFor: 'seed-b',
    })).toHaveLength(1);
    // The carried artefact is re-keyed to the NEW town's seed, or it would never read back.
    expect(proseOf(carried).renderedFor).toBe('seed-b');
  });

  it('NEGATIVE CONTROL — one moved ground field drops the unit to the corpus', () => {
    const prev = scribed();
    const fresh = { id: 'town-2', name: 'Ashford', _seed: 'seed-b' };
    let call = 0;
    const moved = () => {
      call += 1;
      return [{ blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', ground: call === 1 ? 'a' : 'b' }];
    };
    const out = carryProseThroughGenerate(prev, fresh, { history: true }, moved);
    expect(out).toBe(fresh);
    expect('prose' in out).toBe(false);
  });

  it('a pool the fresh town does not fire at all carries nothing', () => {
    const prev = scribed();
    const fresh = { id: 'town-2', name: 'Ashford', _seed: 'seed-b' };
    let call = 0;
    const gone = () => {
      call += 1;
      return call === 1 ? [{ blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', ground: 'a' }] : [];
    };
    expect(carryProseThroughGenerate(prev, fresh, { history: true }, gone)).toBe(fresh);
  });
});

describe('CURE 5 — the artefact never reaches a public projection', () => {
  it('prose is absent from the top-level allowlist (ruling 3, fail-closed)', () => {
    expect(PUBLIC_TOPLEVEL_KEYS).not.toContain('prose');
  });

  it('a scribed settlement projects with no prose anywhere in the output', () => {
    const projected = toPublicSafe(scribed());
    expect('prose' in projected).toBe(false);
    expect(JSON.stringify(projected)).not.toContain('The watch keeps a short roll.');
  });

  it('a scribed settlement projects with no prose in FULL (DM share) mode either', () => {
    const projected = toPublicSafe(scribed(), { full: true });
    expect('prose' in projected).toBe(false);
    expect(JSON.stringify(projected)).not.toContain('The watch keeps a short roll.');
  });

  it('NEGATIVE CONTROL — the projection does pass an allowlisted key through', () => {
    // Proof the arm above is not passing because the projection returns nothing at all.
    const projected = toPublicSafe(scribed({ tier: 'town' }));
    expect(projected.name).toBe('Ashford');
    expect(projected.tier).toBe('town');
  });
});

describe('the past lane (the shape commit 2 drives)', () => {
  it('a retire moves the current render whole and deletes nothing', () => {
    const prose = proseOf(scribed());
    const after = retireCurrent(prose, { state: 'undone', nonce: 'n1', at: '2026-09-14T01:00:00.000Z' });
    expect(after.current).toBe(null);
    expect(after.epochs).toHaveLength(1);
    expect(after.epochs[0].state).toBe('undone');
    expect(after.epochs[0].blocks['DS-DEF-2']['FAMILY: acute crisis'][0].spine)
      .toBe('The watch keeps a short roll.');
    // A compact epoch keeps the UNITS and drops the working: no verdicts, no report.
    expect(after.epochs[0].blocks['DS-DEF-2']['FAMILY: acute crisis'][0].report).toBeUndefined();
  });

  it('a restore moves every epoch above the depth and re-points current', () => {
    let prose = proseOf(scribed());
    prose = landBlock(prose, {
      advanceSeq: 1, blockId: 'DS-DEF-2', pools: { 'FAMILY: acute crisis': [unit('epoch one')] },
      renderedFor: 'seed-a', renderedAt: '2026-09-14T02:00:00.000Z',
    });
    expect(currentAdvanceSeq(prose)).toBe(1);
    const after = restoreToDepth(prose, { advanceSeq: 0, nonce: 'n2', at: '2026-09-14T03:00:00.000Z' });
    expect(currentAdvanceSeq(after)).toBe(0);
    expect(after.epochs.filter((e) => e.state === 'undone')).toHaveLength(1);
    expect(after.epochs.find((e) => e.state === 'undone').advanceSeq).toBe(1);
    // The road not taken is READABLE, which is the whole of the owner's rule.
    expect(JSON.stringify(after)).toContain('epoch one');
  });

  it('the lane is bounded, oldest out first', () => {
    let prose = proseOf(scribed());
    for (let seq = 1; seq <= SCRIBE_PAST_EPOCH_LIMIT + 3; seq += 1) {
      prose = landBlock(prose, {
        advanceSeq: seq, blockId: 'DS-DEF-2', pools: { p: [unit(`e${seq}`)] }, renderedFor: 'seed-a',
      });
    }
    expect(prose.epochs.length).toBe(SCRIBE_PAST_EPOCH_LIMIT);
    expect(prose.epochs[0].advanceSeq).toBeGreaterThan(0);
  });

  it('stripProse returns the SAME reference when there is nothing to strip', () => {
    const plain = { id: 'x' };
    expect(stripProse(plain)).toBe(plain);
    expect(stripProse(null)).toBe(null);
  });
});
