/**
 * scopedTestEnv.ts — THE ONE SPELLING OF "THIS SUITE'S ENVIRONMENT IS ITS OWN".
 *
 * ⛔⛔ THE CLASS THIS FILE REMOVES THE HABITAT FOR. `deno.json`'s `test:edge` task runs
 * `deno test` WITHOUT `--parallel`, so all 43 edge suites share ONE process and ONE
 * `Deno.env`. Every module-top `Deno.env.set` is therefore AMBIENT for every
 * alphabetically later suite, and the sets are never restored. That is not a theory: it
 * red the `deno-tests` CI job. `operator-message-worker/index.test.ts` set
 * `CLIENT_URL=https://settlementforge.example` at module top; `_shared/cors.ts` re-reads
 * `CLIENT_URL` PER REQUEST to compose `configuredOrigins()`, whose FIRST entry is what a
 * fail-closed response pins to; and `verify-checkout-session`'s CORS pins — `v…` after
 * `o…` — asserted against the poisoned host (laneTE33 §1).
 *
 * ⭐ WHY A MODULE-TOP SET CANNOT SIMPLY BE MOVED INSIDE THE TEST BODIES. Most of these
 * suites read their handler through `const { … } = await import('./index.ts')`, and edge
 * modules read configuration at MODULE SCOPE (`founder-transfer/index.ts:31` is
 * `const CLIENT_URL = Deno.env.get('CLIENT_URL') || …`). The stubs must therefore be
 * present DURING the import, and absent afterwards. So the lifecycle is three-part, and
 * this module is the only place it is spelled:
 *
 *   1. `installScopedTestEnv(stubs)` applies the stubs immediately — the import window;
 *   2. `release()` puts the ambient values back the moment the import has read them, so
 *      nothing this file supplied is visible while ANY other suite runs;
 *   3. `scopedEnv.test(...)` re-applies them for the duration of each body and restores
 *      afterwards, so per-REQUEST reads (cors.ts's is the one that bit) see them too.
 *
 * ⚠ RESTORE, NEVER DELETE-BY-DEFAULT. The prior value is captured at every apply and put
 * back verbatim; a key that had NO prior value is DELETED rather than left holding this
 * suite's stub, because setting it to `''` is a different world from an unset key for
 * every `Deno.env.get(k) || fallback` read in the estate.
 *
 * ⚠ THE CAPTURE IS RE-TAKEN ON EVERY APPLY, not once at module load. A capture taken once
 * would restore whatever was ambient at IMPORT time, which is not necessarily what is
 * ambient when a body runs; re-capturing makes each scope restore the world it actually
 * interrupted, and makes nesting and re-entry safe.
 */

/**
 * The stub values a suite supplies for itself.
 *
 * ⭐ `null` MEANS ABSENT, AND IT IS A REAL STUB RATHER THAN A GAP. Several suites need a
 * key to be UNSET for their own import — `admin-actions` wants no `OWNER_EMAIL`,
 * `generate-narrative` wants no provider keys — and they used to spell that as a module-top
 * `Deno.env.delete`, which is the same unrestored leak wearing the opposite sign: it can
 * strip a value an alphabetically later suite is relying on. Declaring the absence here
 * puts it under exactly the same apply/release/re-apply lifecycle as a value.
 */
export type EnvStubs = Record<string, string | null>;

export interface ScopedTestEnv {
  /** The stubs, so a pin can assert against the value this suite supplied. */
  readonly stubs: Readonly<EnvStubs>;
  /**
   * Put the ambient environment back. Call it as soon as the module-scope
   * `await import(...)` has read the stubs — that is the whole point of the seam.
   */
  release(): void;
  /**
   * Register a Deno test whose body runs with this suite's stubs applied and the ambient
   * environment restored afterwards, whatever the body does or throws.
   */
  test(name: string, body: (t: unknown) => void | Promise<void>): void;
  test(definition: Record<string, unknown>): void;
  test(name: string, options: Record<string, unknown>, body: (t: unknown) => void | Promise<void>): void;
}

export function installScopedTestEnv(stubs: EnvStubs): ScopedTestEnv {
  const keys = Object.keys(stubs);
  /** The values displaced by the CURRENT apply, in key order. Empty when not applied. */
  let displaced: Array<[string, string | undefined]> = [];

  const apply = () => {
    if (displaced.length) return; // already inside a scope — never double-capture
    displaced = keys.map((key) => [key, Deno.env.get(key)] as [string, string | undefined]);
    for (const key of keys) {
      const value = stubs[key];
      if (value === null) Deno.env.delete(key);
      else Deno.env.set(key, value);
    }
  };
  const restore = () => {
    for (const [key, prior] of displaced) {
      if (prior === undefined) Deno.env.delete(key);
      else Deno.env.set(key, prior);
    }
    displaced = [];
  };

  // (1) THE IMPORT WINDOW. Applied on construction so the caller's next statement — the
  //     dynamic import of the handler — sees the stubs at module scope.
  apply();

  const scoped = {
    stubs,
    release: restore,
    test(
      nameOrDefinition: string | Record<string, unknown>,
      optionsOrBody?: unknown,
      maybeBody?: unknown,
    ) {
      const scopeIt = (body: (t: unknown) => unknown) => async (t: unknown) => {
        apply();
        try {
          await body(t);
        } finally {
          restore();
        }
      };
      if (typeof nameOrDefinition !== 'string') {
        const definition = nameOrDefinition;
        const fn = definition.fn as (t: unknown) => unknown;
        Deno.test({ ...definition, fn: scopeIt(fn) } as Deno.TestDefinition);
        return;
      }
      if (typeof optionsOrBody === 'function') {
        Deno.test(nameOrDefinition, scopeIt(optionsOrBody as (t: unknown) => unknown));
        return;
      }
      Deno.test(
        nameOrDefinition,
        optionsOrBody as Deno.TestDefinition,
        scopeIt(maybeBody as (t: unknown) => unknown),
      );
    },
  };
  return scoped as ScopedTestEnv;
}
