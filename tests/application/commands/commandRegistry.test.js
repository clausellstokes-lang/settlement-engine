import { describe, expect, test } from 'vitest';
import { createCommandRegistry } from '../../../src/application/commands/commandRegistry.js';
import { standardCommandRegistry } from '../../../src/application/commands/standardCommandRegistry.js';

function spec(kind = 'test.command') {
  return {
    kind,
    description: 'A test command.',
    targetScope: 'save',
    delivery: 'local',
    atomicity: 'single-target',
    apply: () => ({ ok: true }),
  };
}

describe('application command registry', () => {
  test('registers a small capability surface and refuses duplicate kinds', () => {
    const registry = createCommandRegistry([spec()]);
    expect(registry.has('test.command')).toBe(true);
    expect(registry.list()).toHaveLength(1);
    expect(() => registry.register(spec())).toThrow(/duplicate command spec/i);
  });

  test('rejects malformed execution policies rather than guessing', () => {
    expect(() => createCommandRegistry([{
      ...spec(),
      delivery: 'eventually-maybe',
    }])).toThrow(/invalid delivery/i);
    expect(() => createCommandRegistry([{
      ...spec(),
      apply: null,
    }])).toThrow(/apply/i);
  });

  test('the live registry exposes the bounded reviewed capabilities', () => {
    expect(standardCommandRegistry.list().map((entry) => entry.kind)).toEqual([
      'settlement.canon-event.apply',
      'campaign.party-impact.record',
      'settlement.pending-edits.commit',
      'import.settlement.create-and-attach',
      'import.campaign.attach-existing',
      'content.definition.create-revision',
      'content.definition.archive',
      'content.definition.restore',
      'content.pack.import',
      'content.environment.migrate',
      'content.definition.mass-update',
    ]);
    expect(
      standardCommandRegistry.surveyorCapabilities().map((entry) => entry.kind),
    ).toEqual([
      'settlement.canon-event.apply',
      'campaign.party-impact.record',
      'content.definition.create-revision',
    ]);
  });
});
