/**
 * townMap/useTownCartographyBlock.js — THE CARTOGRAPHY BLOCK'S LIFECYCLE (TC-5b-i).
 *
 * Owns one question for the Map tab: does this settlement have a cartography sheet,
 * and if so, what is it? This is the PRESENCE ORACLE ruled at CR-TC5B-3 — after this
 * lands, a caller can ask without mounting a canvas, a worker, or a renderer.
 * `available` IS `status === 'ready'`: one derived boolean, never a second predicate.
 *
 * ── THE DARK GATE IS READ HERE, STATICALLY, AND THAT IS THE WHOLE DESIGN ─────
 * `townCartographyActive` lives in cartographyContract.js, which holds ZERO import
 * statements — a true leaf. So a dark reader decides "nothing to do" without pulling
 * a single byte of the compiler graph, and the transport module is never imported at
 * all. The transport is reached ONLY through `await import(...)` inside an effect; a
 * static `import … from` of it would put the manifest compiler, the compile-input
 * seam and the naming table into every caller's chunk, which is precisely the edge
 * tests/lib/townCartographyBlock.test.js's closure guard exists to forbid.
 *
 * ── IDENTITY IS BY REFERENCE, NOT BY inputDigest ─────────────────────────────
 * SettlementScene3D.jsx keys its compile effect on `prepareTownSceneCompileInput(...)
 * .inputDigest`. Copying that idiom would statically import the compile-input graph
 * and defeat the guard above. Reference identity costs at worst a redundant compile;
 * the digest would cost the guard, so the guard wins. The caller's props are
 * useMemo-stable, and a redundant recompile is a cost, not a defect.
 *
 * ── SUPERSESSION IS A GENERATION COUNTER, NOT AN AbortController ─────────────
 * A synchronous compile cannot be interrupted — the same reason townSceneWorkerClient
 * terminates rather than cancels — so a stale result is DROPPED rather than prevented.
 * An unmount drops the pending result without calling setState or warning.
 *
 * No store, no flag hook, no clock, no randomness, no persistence. Nothing here
 * writes a settlement blob field, a localStorage key, or a store slice.
 *
 * @enforced-by tests/hooks/useTownCartographyBlock.test.jsx
 * @enforced-by tests/lib/townCartographyBlock.test.js (the static-closure guard)
 */
import { useEffect, useMemo, useRef, useState } from 'react';

import { townCartographyActive } from '../../domain/townScene/cartographyContract.js';

/** Dark, or no settlement: nothing was attempted. */
const IDLE = Object.freeze({ status: 'idle', block: null, planExtent: null });
/** A lit compile is in flight. */
const COMPILING = Object.freeze({ status: 'compiling', block: null, planExtent: null });
/** The compile ran and produced no block. */
const UNAVAILABLE = Object.freeze({ status: 'unavailable', block: null, planExtent: null });
/** The compile threw. No error text is carried — that is TC-5b-ii's A-4 copy's job. */
const FAILED = Object.freeze({ status: 'failed', block: null, planExtent: null });

/**
 * @param {{ settlement: unknown, worldState?: unknown,
 *           regionalGraph?: unknown, audience?: 'dm'|'player'|'public' }} input
 * @returns {{ status: 'idle'|'compiling'|'ready'|'unavailable'|'failed',
 *             block: Record<string, unknown>|null, planExtent: number|null,
 *             available: boolean }}
 */
export function useTownCartographyBlock(input) {
  const settlement = input?.settlement ?? null;
  const worldState = input?.worldState ?? null;
  const regionalGraph = input?.regionalGraph ?? null;
  const audience = input?.audience;
  const lit = townCartographyActive(
    /** @type {{ simulationRules?: unknown }} */ (worldState)?.simulationRules,
  );

  const attempt = lit && settlement !== null;

  const [state, setState] = useState(IDLE);
  const generationRef = useRef(0);
  const worldStateRef = useRef(worldState);

  // ⭐ RESET BEFORE COMMIT, the convention useTownMapPresentation already uses. An
  // effect-based reset would leave ONE committed frame in which a world that just
  // went dark — or a settlement that just changed — still reported the PREVIOUS
  // settlement's block with `available: true`. For a presence oracle that gates a
  // tab's very existence, one such frame is a settlement rendering as something it
  // is not, so the stale state is discarded during render rather than after it.
  const [seeded, setSeeded] = useState({ lit, settlement, regionalGraph, audience });
  if (seeded.lit !== lit
    || seeded.settlement !== settlement
    || seeded.regionalGraph !== regionalGraph
    || seeded.audience !== audience) {
    setSeeded({ lit, settlement, regionalGraph, audience });
    setState(IDLE);
  }

  // worldState is THREADED to the compile but is deliberately not part of the
  // effect's identity: it moves every pulse and would recompile for no new answer.
  // The identity carries the flag VALUE instead. Syncing through a ref in its own
  // effect keeps the render phase pure, and this effect is declared FIRST so it
  // lands before the compile effect below reads the ref.
  useEffect(() => {
    worldStateRef.current = worldState;
  });

  useEffect(() => {
    // Dark, or no settlement: nothing is attempted and the transport module is
    // never imported. Anything already in flight is dropped by THIS effect's own
    // cleanup, which ran before this call — one drop mechanism, not two.
    if (!attempt) return undefined;

    const generation = generationRef.current + 1;
    generationRef.current = generation;
    // ONE drop mechanism, deliberately. An earlier cut also carried a `live`
    // closure flag cleared on cleanup; because React always runs cleanup before
    // re-running an effect, that flag SUBSUMED the generation check and a mutant
    // that deleted the generation check still passed every test. A guard no test
    // can distinguish is a disabled guard, so the second truth is gone: the
    // generation counter alone decides whether a settled compile may land.
    const isCurrent = () => generationRef.current === generation;
    setState(COMPILING);

    import('../../lib/townScene/townCartographyBlock.js')
      .then(({ compileTownCartographyBlock }) => compileTownCartographyBlock({
        settlement,
        worldState: worldStateRef.current,
        regionalGraph,
        audience,
      }))
      .then((result) => {
        if (!isCurrent()) return;
        setState(result.status === 'ready'
          ? { status: 'ready', block: result.block, planExtent: result.planExtent }
          : UNAVAILABLE);
      })
      .catch((error) => {
        // Checked BEFORE warning: an unmounted or superseded generation is silent.
        if (!isCurrent()) return;
        console.warn('[TownCartography] block compile failed', error);
        setState(FAILED);
      });

    // Unmount and supersession are the SAME event to this seam: bump the
    // generation, and whatever is still in flight can no longer land.
    return () => { generationRef.current += 1; };
  }, [attempt, settlement, regionalGraph, audience]);

  return useMemo(
    () => ({ ...state, available: state.status === 'ready' }),
    [state],
  );
}
