import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { standardCommandRegistry } from '../../src/application/commands/standardCommandRegistry.js';
import { createCommandExecutor } from '../../src/application/commands/executeCommand.js';
import { makeCommandEnvelope } from '../../src/application/commands/commandEnvelope.js';

const ROOT = join(import.meta.dirname, '../..');
const read = (path) => readFileSync(join(ROOT, path), 'utf8');

describe('Surveyor Interpret application-command boundary', () => {
  test('the executor module never invokes injected store writers directly', () => {
    const source = read('src/lib/intent/interpretApply.js');
    expect(source).toContain('executeSessionCommand');
    expect(source).not.toMatch(/actions\.(?:applyEvent|recordPartyImpact)\s*\(/);
  });

  test('the panel delegates review results and does not call a writer itself', () => {
    const source = read('src/components/surveyor/InterpretApplyPanel.jsx');
    expect(source).toContain("import('../../lib/intent/interpretApply.js')");
    expect(source).not.toMatch(/\bapplyEvent\s*\(\s*/);
    expect(source).not.toMatch(/\brecordPartyImpact\s*\(\s*/);
  });

  test('only the three reviewed domain capabilities are Surveyor-public', () => {
    expect(
      standardCommandRegistry.surveyorCapabilities().map((spec) => spec.kind),
    ).toEqual([
      'settlement.canon-event.apply',
      'campaign.party-impact.record',
      'content.definition.create-revision',
    ]);
    expect(read('src/application/commands/standardCommandRegistry.js'))
      .not.toMatch(/(?:from|import\()\s*['"][^'"]*operationRegistry/);
  });

  // The runtime half of the three-kind ceiling. The census test above declares
  // WHICH kinds are Surveyor-public; these two pin that the executor itself
  // refuses a Surveyor-originated command of any other registered kind, so a
  // drifted construction site (a future AI surface stamping
  // provenance:'surveyor' onto a non-Surveyor kind) cannot reach a writer.
  const dispatchAsSurveyor = (kind) => createCommandExecutor({
    registry: standardCommandRegistry,
  }).execute(makeCommandEnvelope({
    commandId: `cmd:boundary-test:surveyor-gate:${kind}`,
    kind,
    provenance: 'surveyor',
    params: {},
  }), {});

  test('a Surveyor-origin command of every non-flagged registered kind is refused at dispatch', async () => {
    const nonFlagged = standardCommandRegistry
      .list()
      .filter((spec) => spec.surveyor !== true);
    expect(nonFlagged.length).toBeGreaterThan(0);
    for (const spec of nonFlagged) {
      const receipt = await dispatchAsSurveyor(spec.kind);
      expect(receipt.ok).toBe(false);
      expect(receipt.status).toBe('failed');
      expect(receipt.reason).toBe('surveyor_capability_refused');
      // Refused before the lifecycle starts: no validating/applying transitions.
      expect(receipt.transitions.map((entry) => entry.status))
        .toEqual(['received', 'failed']);
    }
  });

  test('the three Surveyor-public kinds pass the dispatch gate', async () => {
    for (const spec of standardCommandRegistry.surveyorCapabilities()) {
      const receipt = await dispatchAsSurveyor(spec.kind);
      // Each proceeds past the gate into its own adapter lifecycle; the bare
      // test context then refuses for adapter-specific reasons, never the
      // dispatch gate's.
      expect(receipt.reason).not.toBe('surveyor_capability_refused');
      expect(receipt.transitions.map((entry) => entry.status))
        .toContain('validating');
    }
  });

  test('command execution stays behind authoring-only lazy boundaries', () => {
    const settlementFacade = read('src/store/settlementPendingEditActions.js');
    const surveyorPanel = read('src/components/surveyor/InterpretApplyPanel.jsx');
    expect(settlementFacade).toMatch(
      /import\(\s*['"]\.\.\/application\/commands\/pendingEditCommitRuntime\.js['"]\s*\)/,
    );
    expect(settlementFacade).not.toMatch(
      /^import .*application\/commands\/pendingEditCommitRuntime/m,
    );
    expect(surveyorPanel).toContain(
      "import('../../lib/intent/interpretApply.js')",
    );
  });
});
