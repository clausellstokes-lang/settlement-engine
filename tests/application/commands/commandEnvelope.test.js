import { describe, expect, test } from 'vitest';
import {
  commandFingerprint,
  commandIdForValue,
  makeCommandEnvelope,
  validateCommandEnvelope,
} from '../../../src/application/commands/commandEnvelope.js';

describe('application command envelope', () => {
  test('normalizes, detaches, and freezes a serializable addressed command', () => {
    const event = { type: 'ADD_NPC', payload: { name: 'Ada' } };
    const command = makeCommandEnvelope({
      commandId: 'cmd:test:one',
      kind: 'settlement.canon-event.apply',
      provenance: 'surveyor',
      ownerRef: { accountId: 'owner-1' },
      targets: { saveId: 'save-1' },
      expected: { revision: 12 },
      params: { event },
      correlation: { proposalIndex: 0 },
    });

    event.payload.name = 'Mutated later';
    expect(command.params.event.payload.name).toBe('Ada');
    expect(command.expected.revision).toBe('12');
    expect(Object.isFrozen(command)).toBe(true);
    expect(Object.isFrozen(command.params.event.payload)).toBe(true);
  });

  test('stable ids ignore object insertion order but retain proposal identity', () => {
    const a = commandIdForValue('interpret', {
      index: 4,
      op: { type: 'KILL_NPC', params: { npcId: 'npc-1', severity: 2 } },
    });
    const b = commandIdForValue('interpret', {
      op: { params: { severity: 2, npcId: 'npc-1' }, type: 'KILL_NPC' },
      index: 4,
    });
    const otherIndex = commandIdForValue('interpret', {
      index: 5,
      op: { type: 'KILL_NPC', params: { npcId: 'npc-1', severity: 2 } },
    });

    expect(a).toBe(b);
    expect(otherIndex).not.toBe(a);
    expect(a).toMatch(/^cmd:interpret:/);
    expect(a).not.toContain('npc-1');
  });

  test('rejects executable, cyclic, non-finite, and unsupported-version input', () => {
    const cyclic = {};
    cyclic.self = cyclic;
    const cases = [
      { params: { callback: () => {} } },
      { params: cyclic },
      { params: { amount: Number.POSITIVE_INFINITY } },
      { schemaVersion: 99 },
    ];
    for (const extra of cases) {
      expect(validateCommandEnvelope({
        commandId: 'cmd:test:invalid',
        kind: 'test.command',
        params: {},
        ...extra,
      }).ok).toBe(false);
    }
  });

  test('the behavior fingerprint detects command-id reuse with different params', () => {
    const base = {
      commandId: 'cmd:test:conflict',
      kind: 'test.command',
      targets: { saveId: 'save-1' },
    };
    const first = makeCommandEnvelope({ ...base, params: { value: 1 } });
    const second = makeCommandEnvelope({ ...base, params: { value: 2 } });
    expect(commandFingerprint(first)).not.toBe(commandFingerprint(second));
  });
});

