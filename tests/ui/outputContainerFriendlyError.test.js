/**
 * tests/ui/outputContainerFriendlyError.test.js — lock-in for the
 * never-leak-raw-e.message contract (RP-1 §159).
 *
 * The local-dev narrative path used to do setLocalAiError(e.message), leaking
 * transport/engine internals onto the GM trust surface. toFriendlyAiError (now
 * in the dossier/DossierAiConfirms sibling) maps any caught error to GM-facing
 * domain language; the raw message must never appear in its output.
 */

import { describe, test, expect } from 'vitest';
import { toFriendlyAiError } from '../../src/components/dossier/DossierAiConfirms.jsx';

describe('toFriendlyAiError', () => {
  test('never returns the raw error message', () => {
    const raw = 'RPC 500: parse error at supabase.functions/narrate line 42';
    const friendly = toFriendlyAiError(new Error(raw));
    expect(friendly).not.toContain(raw);
    expect(friendly).not.toMatch(/supabase|RPC|500|parse/i);
    expect(friendly.length).toBeGreaterThan(0);
  });

  test('maps network/transport faults to a connection message', () => {
    expect(toFriendlyAiError(new Error('Failed to fetch'))).toMatch(/connection|reached/i);
    expect(toFriendlyAiError(new Error('network timeout'))).toMatch(/connection|reached/i);
  });

  test('falls back to a generic narrative message for opaque errors', () => {
    expect(toFriendlyAiError(new Error('boom'))).toMatch(/narrative layer could not be generated/i);
    expect(toFriendlyAiError(null)).toMatch(/narrative layer could not be generated/i);
    expect(toFriendlyAiError('some string')).toMatch(/narrative layer could not be generated/i);
  });
});
