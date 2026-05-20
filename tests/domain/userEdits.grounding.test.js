/**
 * tests/domain/userEdits.grounding.test.js — Tier 6.6 integration suite.
 *
 * Verifies the cross-module wiring that makes user edits visible to
 * the AI:
 *
 *   - forbiddenChanges() emits one "MUST PRESERVE user-edited field"
 *     line per editted path.
 *   - The AI grounding payload still includes the edited entity in
 *     lockedEntities (via canonStatus inferring source: 'user').
 *   - assemblePromptSections puts the locked entity list inside the
 *     dossier (not the user direction).
 *   - aiOverlayVerifier reports `changed_user_field` when the AI
 *     output contradicts a user's authored value.
 *   - Pass-through (AI doesn't touch the field) reports clean.
 *   - The verifier handles every editable entity type.
 */

import { describe, it, expect } from 'vitest';
import {
  buildAiGroundingPayload,
  forbiddenChanges,
  assemblePromptSections,
} from '../../src/domain/aiGrounding.js';
import { verifyAiOverlay } from '../../src/domain/aiOverlayVerifier.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';

function settlementFixture() {
  return {
    id: 'sett.test',
    name: 'Bridgeford',
    tier: 'town',
    population: 1500,
    arrivalScene: 'A stone bridge across the river.',
    pressureSentence: 'The guild is squeezing the dockers.',
    settlementReason: 'A river ford.',
    npcs: [
      {
        id: 'npc.aldis',
        name: 'Aldis',
        role: 'Guildmaster',
        secret: { what: 'Embezzles dues.' },
        goal:   { short: 'Tighten control.' },
      },
      {
        id: 'npc.morrow',
        name: 'Morrow',
        role: 'Captain',
      },
    ],
    powerStructure: {
      factions: [
        { id: 'fac.guild',  name: 'Merchant Guild', desc: 'Old money behind every door.' },
        { id: 'fac.river',  name: 'River Boatmen',  desc: 'Independent and angry.' },
      ],
      conflicts: [],
    },
    institutions: [
      { id: 'inst.market', name: 'Market', desc: 'A bustling daily market.' },
    ],
    history: {
      historicalCharacter: 'Resilient',
      founding: { reason: 'River ford toll', initialChallenge: 'flooding' },
      historicalEvents: [
        { name: 'Flood Year', description: 'River broke its banks.' },
      ],
      currentTensions: [
        { type: 'economic', description: 'Toll dispute' },
      ],
    },
  };
}

function clone(o) { return JSON.parse(JSON.stringify(o)); }

// ─────────────────────────────────────────────────────────────────────
// forbiddenChanges() — emit MUST PRESERVE lines for user edits
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.6 — forbiddenChanges emits MUST PRESERVE lines for user edits', () => {
  it('no edits → no user-field lines in forbiddenChanges', () => {
    const lines = forbiddenChanges(settlementFixture());
    expect(lines.some(l => l.includes('user-edited field'))).toBe(false);
  });

  it('an NPC secret edit produces one user-edited-field line', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'Hand-written secret.');
    const lines = forbiddenChanges(s);
    const userLines = lines.filter(l => l.includes('user-edited field'));
    expect(userLines.length).toBe(1);
    expect(userLines[0]).toMatch(/secret\.what/);
    expect(userLines[0]).toMatch(/Aldis/);
  });

  it('a settlement-root prose edit produces a line referencing "settlement"', () => {
    const s = settlementFixture();
    applyUserEdit(s, 'arrivalScene', 'Hand-written arrival.');
    const lines = forbiddenChanges(s);
    const userLines = lines.filter(l => l.includes('user-edited field'));
    expect(userLines.length).toBe(1);
    expect(userLines[0]).toMatch(/on settlement/);
    expect(userLines[0]).toMatch(/arrivalScene/);
  });

  it('multiple edits produce multiple lines', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'A');
    applyUserEdit(s.powerStructure.factions[0], 'desc', 'B');
    applyUserEdit(s.institutions[0], 'desc', 'C');
    applyUserEdit(s, 'arrivalScene', 'D');
    const lines = forbiddenChanges(s);
    const userLines = lines.filter(l => l.includes('user-edited field'));
    expect(userLines.length).toBe(4);
  });

  it('uses "pass through verbatim" guidance so the AI does not paraphrase', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'X');
    const userLines = forbiddenChanges(s).filter(l => l.includes('user-edited field'));
    expect(userLines[0]).toMatch(/verbatim/i);
  });
});

// ─────────────────────────────────────────────────────────────────────
// buildAiGroundingPayload — edited entities surface in lockedEntities
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.6 — edited entities appear in lockedEntities', () => {
  it('an edited NPC appears in constraints.lockedEntities', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'X');
    const p = buildAiGroundingPayload(s);
    const npcLocks = p.constraints.lockedEntities.filter(e => e.type === 'npc');
    expect(npcLocks.length).toBeGreaterThanOrEqual(1);
    expect(npcLocks.some(e => e.label === 'Aldis')).toBe(true);
  });

  it('an edited faction appears in lockedEntities', () => {
    const s = settlementFixture();
    // Collector reads `entity.faction` as the legacy faction-name key;
    // mirror it so the label matches the expected case.
    s.powerStructure.factions[0].faction = s.powerStructure.factions[0].name;
    applyUserEdit(s.powerStructure.factions[0], 'desc', 'X');
    const p = buildAiGroundingPayload(s);
    expect(p.constraints.lockedEntities.some(e => e.type === 'faction' && e.label === 'Merchant Guild')).toBe(true);
  });

  it('an edited institution appears in lockedEntities', () => {
    const s = settlementFixture();
    applyUserEdit(s.institutions[0], 'desc', 'X');
    const p = buildAiGroundingPayload(s);
    expect(p.constraints.lockedEntities.some(e => e.type === 'institution' && e.label === 'Market')).toBe(true);
  });

  it('lockedEntities source is "user" for edited entities', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'X');
    const p = buildAiGroundingPayload(s);
    const aldis = p.constraints.lockedEntities.find(e => e.label === 'Aldis');
    expect(aldis.source).toBe('user');
  });
});

// ─────────────────────────────────────────────────────────────────────
// assemblePromptSections — user edits stay inside the dossier
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.6 — user-edited values flow through the dossier section', () => {
  it('the user\'s edited prose appears in the dossier JSON', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'CANARY-USER-EDIT-12345');
    const sections = assemblePromptSections(buildAiGroundingPayload(s));
    expect(sections.dossier.includes('CANARY-USER-EDIT-12345')).toBe(true);
  });

  it('forbiddenChanges lines are part of the constraints.forbidden array, NOT the user direction', () => {
    const s = settlementFixture();
    applyUserEdit(s.npcs[0], 'secret.what', 'X');
    const p = buildAiGroundingPayload(s, { userDirection: 'Make it spookier.' });
    const userFieldLines = p.constraints.forbidden.filter(l => l.includes('user-edited field'));
    expect(userFieldLines.length).toBe(1);
    // User direction stays in its own slot.
    expect(p.constraints.userDirection).toBe('Make it spookier.');
  });
});

// ─────────────────────────────────────────────────────────────────────
// aiOverlayVerifier — changed_user_field detection
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.6 — aiOverlayVerifier detects changed_user_field violations', () => {
  it('clean refinement (AI passes user field through verbatim) → ok', () => {
    const original = settlementFixture();
    applyUserEdit(original.npcs[0], 'secret.what', 'Hand-written.');
    const refined = clone(original);
    // AI polished OTHER fields but left the user's edit alone.
    refined.arrivalScene = 'Polished arrival.';
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(true);
    expect(result.summary.userFieldChanged).toBe(0);
  });

  it('AI overrode the user\'s NPC secret → changed_user_field', () => {
    const original = settlementFixture();
    applyUserEdit(original.npcs[0], 'secret.what', 'Hand-written.');
    const refined = clone(original);
    refined.npcs[0].secret.what = 'AI thinks it knows better.';
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    expect(result.summary.userFieldChanged).toBe(1);
    const v = result.violations.find(x => x.kind === 'changed_user_field');
    expect(v.field).toBe('npc[0].secret.what');
    expect(v.before).toBe('Hand-written.');
    expect(v.after).toBe('AI thinks it knows better.');
  });

  it('AI overrode a settlement-root edit → changed_user_field', () => {
    const original = settlementFixture();
    applyUserEdit(original, 'arrivalScene', 'Hand-written arrival.');
    const refined = clone(original);
    refined.arrivalScene = 'AI rewrote the arrival.';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.userFieldChanged).toBe(1);
    const v = result.violations.find(x => x.kind === 'changed_user_field');
    expect(v.field).toBe('arrivalScene');
    expect(v.before).toBe('Hand-written arrival.');
  });

  it('AI overrode a faction description edit → changed_user_field', () => {
    const original = settlementFixture();
    applyUserEdit(original.powerStructure.factions[0], 'desc', 'User faction desc.');
    const refined = clone(original);
    refined.powerStructure.factions[0].desc = 'AI rewrote it.';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.userFieldChanged).toBe(1);
  });

  it('AI overrode an institution description edit → changed_user_field', () => {
    const original = settlementFixture();
    applyUserEdit(original.institutions[0], 'desc', 'User-authored.');
    const refined = clone(original);
    refined.institutions[0].desc = 'AI rewrote.';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.userFieldChanged).toBe(1);
  });

  it('multiple edits + multiple AI overrides → multiple violations', () => {
    const original = settlementFixture();
    applyUserEdit(original.npcs[0], 'secret.what', 'A');
    applyUserEdit(original.powerStructure.factions[0], 'desc', 'B');
    applyUserEdit(original, 'arrivalScene', 'C');
    const refined = clone(original);
    refined.npcs[0].secret.what = 'overridden';
    refined.powerStructure.factions[0].desc = 'overridden';
    refined.arrivalScene = 'overridden';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.userFieldChanged).toBe(3);
  });

  it('AI may polish OTHER fields without triggering changed_user_field', () => {
    const original = settlementFixture();
    applyUserEdit(original.npcs[0], 'secret.what', 'User text.');
    const refined = clone(original);
    // Refine the NPC's role (not user-edited) and ANOTHER NPC's whole record — fine.
    refined.npcs[0].role = 'Senior Guildmaster';
    refined.npcs[1].role = 'Captain of the Watch';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.userFieldChanged).toBe(0);
    // Renaming OTHER entities is still flagged via renamed_entity, but
    // these are role changes (not name changes) so nothing trips.
    expect(result.summary.renamed).toBe(0);
  });

  it('an edit followed by a revert + AI refinement should NOT report changed_user_field', () => {
    const original = settlementFixture();
    // No user edits at all (the revert lifecycle cleared _userEdits).
    const refined = clone(original);
    refined.npcs[0].secret.what = 'Refined by AI.';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.userFieldChanged).toBe(0);
  });

  it('"changed_user_field" appears in VIOLATION_KINDS', async () => {
    const { VIOLATION_KINDS } = await import('../../src/domain/aiOverlayVerifier.js');
    expect(VIOLATION_KINDS).toContain('changed_user_field');
  });

  it('summary.userFieldChanged is always present (0 when clean)', () => {
    const result = verifyAiOverlay(settlementFixture(), settlementFixture());
    expect(result.summary).toHaveProperty('userFieldChanged');
    expect(result.summary.userFieldChanged).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Defensive
// ─────────────────────────────────────────────────────────────────────

describe('Tier 6.6 — defensive', () => {
  it('null original / refined still returns ok:true (matches existing semantics)', () => {
    expect(verifyAiOverlay(null, settlementFixture()).ok).toBe(true);
    expect(verifyAiOverlay(settlementFixture(), null).ok).toBe(true);
  });

  it('user-edited entity removed in refined still surfaces removed_entity (not changed_user_field)', () => {
    const original = settlementFixture();
    applyUserEdit(original.npcs[0], 'secret.what', 'X');
    const refined = clone(original);
    refined.npcs.splice(0, 1); // Remove the user-edited NPC entirely.
    const result = verifyAiOverlay(original, refined);
    // Removed surfaces as removed_entity. changed_user_field shouldn't
    // also fire because there's nothing to compare against.
    expect(result.summary.removed).toBe(1);
    // Note: the verifier sees no entity at index 0 in refined to read
    // the value from, so it skips the user-field check for that path.
    // (Removed is the primary violation surface.)
  });

  it('edited path doesn\'t exist on the refined entity → still flagged', () => {
    const original = settlementFixture();
    applyUserEdit(original.npcs[0], 'secret.what', 'User text.');
    const refined = clone(original);
    refined.npcs[0].secret = null; // refined accidentally dropped the secret object
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.userFieldChanged).toBe(1);
  });
});
