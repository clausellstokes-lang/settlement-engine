/**
 * edgeLifetime.ts — keep best-effort work alive after an Edge response returns.
 *
 * Supabase Edge isolates may finish once the request handler settles. Callers that
 * deliberately do not await non-response-critical work must therefore register it
 * with EdgeRuntime.waitUntil. Tests and non-Edge runtimes do not expose that API,
 * so the guarded promise remains detached there; its rejection is still consumed.
 */

type EdgeRuntimeLike = {
  waitUntil?: (work: Promise<unknown>) => void;
};

type EdgeGlobal = typeof globalThis & {
  EdgeRuntime?: EdgeRuntimeLike;
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Register background work with the Edge runtime without extending response
 * latency. The fallback is safe in tests/non-Edge hosts: work remains detached,
 * but every rejection is observed so it cannot become an unhandled rejection.
 */
export function runDetached(work: PromiseLike<unknown> | unknown, label = 'background task'): void {
  const guarded = Promise.resolve(work).catch((error) => {
    console.warn(`[${label}] detached work failed: ${errorMessage(error)}`);
  });

  const edge = (globalThis as EdgeGlobal).EdgeRuntime;
  if (edge && typeof edge.waitUntil === 'function') {
    try {
      edge.waitUntil(guarded);
    } catch (error) {
      // A malformed/partial host shim must not turn best-effort work into a
      // response failure. `guarded` is already rejection-safe and keeps running.
      console.warn(`[${label}] EdgeRuntime.waitUntil failed: ${errorMessage(error)}`);
    }
  }
}
