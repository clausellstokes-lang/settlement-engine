import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  buildWorktreeInventoryReceipt,
  parseWorktreePorcelain,
} from '../../scripts/ops/worktree-inventory.mjs';

describe('worktree inventory', () => {
  it('parses branch, detached, bare, and prunable records', () => {
    const parsed = parseWorktreePorcelain([
      'worktree /repo',
      'HEAD abc123',
      'branch refs/heads/master',
      '',
      'worktree /repo/audit',
      'HEAD def456',
      'detached',
      'prunable gitdir file points to non-existent location',
      '',
    ].join('\n'));

    expect(parsed).toEqual([
      {
        path: '/repo',
        head: 'abc123',
        branch: 'master',
        bare: false,
        detached: false,
        prunable: false,
      },
      {
        path: '/repo/audit',
        head: 'def456',
        branch: null,
        bare: false,
        detached: true,
        prunable: true,
      },
    ]);
  });

  it('builds a stable, non-mutating receipt from inspected worktrees', () => {
    const inventory = buildWorktreeInventoryReceipt({
      base: 'main',
      baseCommit: 'abc123',
      currentPath: '/repo/current',
      generatedAt: '2026-07-24T12:00:00.000Z',
      worktrees: [
        {
          path: '/repo/current',
          head: 'abc123',
          branch: 'main',
          clean: false,
          mergedIntoBase: true,
          disposition: 'keep-current',
          current: true,
        },
        {
          path: '/repo/old',
          head: 'def456',
          branch: 'old',
          clean: true,
          mergedIntoBase: true,
          disposition: 'candidate-for-manual-removal',
          current: false,
        },
      ],
    });
    expect(inventory.kind).toBe('git_worktree_inventory');
    expect(inventory.counts).toEqual({
      total: 2,
      'keep-current': 1,
      'candidate-for-manual-removal': 1,
    });
    expect(inventory.worktrees.some((entry) => entry.current)).toBe(true);
    expect(inventory.destructiveActionTaken).toBe(false);
    expect(inventory.digest).toMatch(/^[a-f0-9]{64}$/);
  });

  it('contains no worktree removal or shell execution path', () => {
    const source = readFileSync(
      new URL('../../scripts/ops/worktree-inventory.mjs', import.meta.url),
      'utf8',
    );
    expect(source).toContain('buildWorktreeInventory({');
    expect(source).not.toMatch(/git['"`]?,\s*\[['"`](remove|prune)/);
    expect(source).not.toMatch(/\brmSync\b|\bunlinkSync\b/);
    expect(source).toContain('shell: false');
  });
});
