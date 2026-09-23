/**
 * decreeChronicleVoice.test.js — EM-E2b's TWO MEASUREMENTS (the verifier's FIX-7 / U76 and
 * NOTE-8 / U78; design §2.6, §11, §18 and §19 ruling 2).
 *
 * ⛔ WHAT THIS SUITE IS, STATED SO NOBODY READS IT AS COVERAGE OF FIX-7. EM-E2b's unit 1 —
 * "an applied decree writes its chronicle line and the entry keeps its `chronicleRef`" — is
 * STOPPED at this landing by the measurement case E2b-1 executes, and nothing of it is
 * built here. What IS here is that measurement, kept as a standing arm because it is the
 * fact that decides WHERE the chronicle writer must live, and it stays true after the cure:
 *
 *   `markApplied` reaches its row through `amendPending`, which amends a PENDING entry and
 *   nothing else (`registry.js`'s own predicate, `row.status === PENDING`). So the ONE
 *   instant at which an entry can be given a `chronicleRef` is the instant it is applied.
 *   The store's `markDecreeApplied` has no production caller; the only application site in
 *   `src/` is `decreeHook.js :: applyDecreesAtTick`, whose meta literal is
 *   `{ appliedAt: now, tickRef }`. A writer seated anywhere after the tick therefore hands
 *   `chronicleRef` to a verb that has already refused it — silently, with the registry
 *   re-sealed and the key absent, which is the worst shape a missing write can take.
 *
 * Case E2b-2 is unit 2's own fence: the shell's header says what is TRUE of the seal block
 * at this landing — the reason line beside each disabled seal is design §18's register, not
 * a reading of this world — so a reader of the file cannot mistake the herald's line for a
 * measurement the shell never made (NOTE-8; the seals' writers are U88's binder).
 *
 * PURE. No store, no clock, no draw: two frozen registries and one source read.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { markApplied, stage } from '../../src/domain/edit/registry.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SHELL_REL = 'src/components/edit/EditModeShell.jsx';

/** The shell's own leading block comment, whitespace collapsed so a wrap cannot hide a claim. */
function shellHeaderProse() {
  const source = readFileSync(join(REPO_ROOT, SHELL_REL), 'utf8');
  const header = source.slice(0, source.indexOf('*/'));
  return header.replace(/^\s*\*\s?/gm, ' ').replace(/\s+/g, ' ').trim();
}

/** One pending entry, staged through EM-C1's own verb so the shape is the registry's. */
function pendingOne() {
  return stage([], { type: 'set-field' }, { id: 'd1', orderedAt: 'stamp-1' });
}

describe('EM-E2b — the chronicle voice: where its writer must sit, and what the seal block says', () => {
  it('E2b-1 a `chronicleRef` is writable ONLY at the instant of application — an APPLIED entry can never acquire one, and the refusal is silent', () => {
    const pending = pendingOne();
    expect(pending.length, 'one entry was staged').toBe(1);
    expect(pending[0].status, 'and it is pending').toBe('pending');

    // THE ONE INSTANT. `markApplied` writes the reference when the caller supplies it, which
    // is the shape `registry.js` documents ("`chronicleRef` is written only when supplied").
    const applied = markApplied(pending, 'd1', {
      appliedAt: 'stamp-2', tickRef: 'tick-1', chronicleRef: 'line-7',
    });
    expect(applied[0].status, 'the entry is applied').toBe('applied');
    expect(applied[0].chronicleRef, 'and carries the line the caller minted').toBe('line-7');

    // THE MEASUREMENT THAT STOPS UNIT 1. A second call over the SAME entry — a writer seated
    // after the tick, holding the tick's causes and the lines it drew — changes nothing at
    // all, because `amendPending` has already declined the row. The registry comes back
    // sealed and the caller is told nothing: there is no refusal to read and no throw.
    const afterTheTick = markApplied(applied, 'd1', {
      appliedAt: 'stamp-3', tickRef: 'tick-1', chronicleRef: 'line-9',
    });
    expect(afterTheTick[0].chronicleRef, 'the later write is declined, not applied').toBe('line-7');
    expect(afterTheTick[0].appliedAt, 'and no other word of the applied entry moved').toBe('stamp-2');

    // AND AN ENTRY APPLIED WITHOUT A REFERENCE STAYS WITHOUT ONE, FOREVER. This is today's
    // tree: `applyDecreesAtTick` spells `{ appliedAt: now, tickRef }`, so every entry the
    // pulse applies reaches `applied` with no line, and no later verb can give it one.
    const bare = markApplied(pendingOne(), 'd1', { appliedAt: 'stamp-2', tickRef: 'tick-1' });
    expect(Object.hasOwn(bare[0], 'chronicleRef'), 'the key is ABSENT, not empty').toBe(false);
    const repaired = markApplied(bare, 'd1', {
      appliedAt: 'stamp-2', tickRef: 'tick-1', chronicleRef: 'line-7',
    });
    expect(Object.hasOwn(repaired[0], 'chronicleRef'), 'and it stays absent after the tick').toBe(false);
  });

  it('E2b-2 the shell\'s header says the reason beside a disabled seal is design §18\'s REGISTER and not a reading of this world', () => {
    const prose = shellHeaderProse();
    expect(prose.length, 'the header was read').toBeGreaterThan(0);
    expect(prose, 'the boundary is still declared').toContain('IT READS NO WORLD PREDICATE AT THIS LANDING');
    expect(prose, 'and the REASON LINE is named as the register it is')
      .toContain('THE REASON LINE BESIDE EACH DISABLED SEAL IS THAT REGISTER\'S OWN ROW, NEVER A READING OF THIS WORLD');
    expect(prose, 'and the header says the predicates are waiting for their binder rather than silent')
      .toContain('waits for the binder');
  });
});
