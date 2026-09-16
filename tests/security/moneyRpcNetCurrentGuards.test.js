/**
 * moneyRpcNetCurrentGuards.test.js — fork-discipline guard for the money RPCs.
 *
 * spend_credits and refund_credits are each recreated across several migrations
 * (the documented "net-current rule": every fork must copy the highest-numbered
 * body verbatim). Correctness has rested ONLY on header prose — nothing failed
 * the gate if a future migration forked from a stale ancestor and silently dropped
 * a guard (the account_is_active gate, the FOR UPDATE serialization, the
 * service-role refund awareness). This test removes that gap: it finds the
 * LEXICALLY-HIGHEST migration that defines each function (= the live body after a
 * lexical-order apply) and asserts the load-bearing guards are present in it.
 *
 * It is intentionally version-agnostic: a legitimate future recreate (095, 096…)
 * just becomes the new net-current and passes AS LONG AS it keeps the guards. A
 * fork that drops one fails here instead of in production.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase', 'migrations');
const migrationFiles = readdirSync(MIG_DIR)
  .filter((f) => /^\d{3}_.*\.sql$/.test(f))
  .sort();

/**
 * ⚠ ANCHORED AT LINE START (`^` with the m flag) — the load-bearing character in
 * this file, and the reason it was amended. The house net-current extractors used
 * to spell this UNANCHORED, which matches a migration HEADER that quotes the
 * create-or-replace statement in prose: the extract then begins mid-comment and
 * swallows the header instead of (or ahead of) the real body. The pglite suites
 * that share this idiom fail loudly on a mis-extract, because Postgres refuses to
 * parse English — wave L-5 of docs/DESIGN_AI_CAPABILITY_LADDER.md fed it ~11k
 * characters of header prose before anchoring its own extractors. THIS suite has
 * no such backstop: it only reads text, and a header discussing the money path
 * mentions `account_is_active`, `for update` and `service_role` by name, so an
 * unanchored mis-extract would have stayed GREEN over prose — a guard asserting
 * nothing while reporting that the money RPCs are safe.
 *
 * A SQL comment line begins with `--`, so anchoring makes the whole class
 * impossible rather than merely absent. It is not theoretical in this corpus:
 * 101's @rollback note quotes `create or replace function
 * public.current_user_is_privileged()` and 098's wraps mid-identifier — both are
 * mis-extracted by the unanchored form today. assertFunctionShaped() below is the
 * belt for anything the anchor cannot see.
 */
const createRe = (name, flags) =>
  new RegExp(`^create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b`, flags);

/** The lexically-highest migration file that defines `public.<name>`, or null. */
function netCurrentFileFor(name) {
  const re = createRe(name, 'im');
  let found = null;
  for (const f of migrationFiles) {
    if (re.test(readFileSync(join(MIG_DIR, f), 'utf-8'))) found = f; // keep the highest
  }
  return found;
}

/**
 * The loud half: an extract that is not a function definition must FAIL here,
 * never be asserted over. Every real body on disk shares five properties, and
 * each one rules out a mis-extract shape the anchor alone would not:
 *   1. it STARTS with the create-function line (no leading prose);
 *   2. it is dollar-quoted and the quote is closed at the very end;
 *   3. the SIGNATURE region — the create line through the `as $tag$` opener —
 *      carries no `--` comment line. That is the direct tell of a slice that
 *      began inside a header, and it is what would still catch a mis-extract if
 *      the anchoring above were ever undone. Exactly one function in the whole
 *      corpus (172's list_gallery_comments) documents its RETURNS TABLE inline
 *      this way and neither money RPC does, so the cost of the rule is that a
 *      future author must put such a note above the create statement — which is
 *      the migration-header hygiene this whole class of bug came from anyway;
 *   4. it contains NO SECOND line-anchored definition of the same function —
 *      the tell of a slice that swallowed the real body whole;
 *   5. it has a plpgsql `begin`. spend_credits and refund_credits raise
 *      exceptions, lock rows FOR UPDATE and loop over grants, so neither can be
 *      `language sql`; a red here means the money RPC changed language, which is
 *      exactly the kind of rewrite this suite exists to surface.
 */
function assertFunctionShaped(text, name, label) {
  const head = JSON.stringify(text.split('\n', 1)[0].slice(0, 120));
  if (!createRe(name, 'i').test(text)) {
    throw new Error(`${label}: MIS-EXTRACT of ${name} — the extract does not START with the create-function line (begins ${head})`);
  }
  const tagM = text.match(/\bas\s+(\$[a-z_]*\$)/);
  if (!tagM || !text.endsWith(tagM[1])) {
    throw new Error(`${label}: MIS-EXTRACT of ${name} — the extract is not a closed dollar-quoted body (begins ${head})`);
  }
  if (/^\s*--/m.test(text.slice(0, tagM.index))) {
    throw new Error(`${label}: MIS-EXTRACT of ${name} — a SQL comment line sits between the create statement and its body, so the extract began inside a header (begins ${head}). If ${name} legitimately documents a parameter inline, move that note above the create statement.`);
  }
  if ([...text.matchAll(createRe(name, 'gim'))].length !== 1) {
    throw new Error(`${label}: MIS-EXTRACT of ${name} — the extract swallows a second definition of the same function, so it began before the real body (begins ${head})`);
  }
  if (!/\bbegin\b/.test(text)) {
    throw new Error(`${label}: MIS-EXTRACT of ${name} — no plpgsql begin marker; either this is prose or ${name} is no longer plpgsql (begins ${head})`);
  }
  return text;
}

/**
 * Extract a single function's body from SQL text (dollar-quote aware: handles $$
 * and $body$). Takes the LAST definition in the source, because within one file
 * as across the corpus it is the last create-or-replace that Postgres keeps.
 * `label` names the source in failure messages.
 */
function extractFunctionFrom(src, name, label) {
  const starts = [...src.matchAll(createRe(name, 'gim'))];
  if (starts.length === 0) return null;
  const from = starts[starts.length - 1].index;
  const tagM = src.slice(from).match(/as\s+(\$[a-z_]*\$)/i);
  if (!tagM) throw new Error(`${label}: MIS-EXTRACT of ${name} — the definition has no dollar-quoted body tag`);
  const tag = tagM[1];
  const bodyStart = from + tagM.index + tagM[0].length;
  const endIdx = src.indexOf(tag, bodyStart);
  if (endIdx === -1) throw new Error(`${label}: MIS-EXTRACT of ${name} — the body is never closed by ${tag}`);
  return assertFunctionShaped(src.slice(from, endIdx + tag.length).toLowerCase(), name, label);
}

/** The same, read off one migration file (which also names it in failures). */
function extractFunction(file, name) {
  return extractFunctionFrom(readFileSync(join(MIG_DIR, file), 'utf-8'), name, file);
}

describe('money RPC net-current fork discipline', () => {
  it('a spend_credits and a refund_credits definition exist on disk', () => {
    expect(netCurrentFileFor('spend_credits'), 'no migration defines spend_credits').not.toBeNull();
    expect(netCurrentFileFor('refund_credits'), 'no migration defines refund_credits').not.toBeNull();
  });

  it('net-current spend_credits keeps the account-status gate AND the per-user FOR UPDATE serialization', () => {
    const file = netCurrentFileFor('spend_credits');
    const body = extractFunction(file, 'spend_credits');
    expect(body, `could not extract spend_credits body from ${file}`).toBeTruthy();
    // Dropping either of these reintroduces a real money bug (spend while banned /
    // concurrent double-spend). If a future fork loses one, this fails naming the file.
    expect(body, `${file}: spend_credits lost the account_is_active gate`).toContain('account_is_active');
    expect(body, `${file}: spend_credits lost the FOR UPDATE balance serialization`).toMatch(/for\s+update/);
  });

  it('net-current refund_credits keeps the service-role awareness AND the FOR UPDATE serialization', () => {
    const file = netCurrentFileFor('refund_credits');
    const body = extractFunction(file, 'refund_credits');
    expect(body, `could not extract refund_credits body from ${file}`).toBeTruthy();
    // 085 made the auth gate service-role-aware (the edge refunds via service_role);
    // 087 added FOR UPDATE on the spend row. A fork from 009/033 silently drops both
    // and charges-without-refunding again.
    expect(body, `${file}: refund_credits lost service-role awareness (085 regression)`).toContain('service_role');
    expect(body, `${file}: refund_credits lost the FOR UPDATE serialization (087 regression)`).toMatch(/for\s+update/);
  });
});

// ── GUARD-THE-GUARD: the extractor itself ────────────────────────────────────
// Everything above is `toContain` over extracted text, so this suite is only as
// honest as the extraction. These three cases prove the extraction, because the
// failure mode being prevented is silent: a mis-extract here does not crash, it
// passes.
describe('the net-current extractor cannot be fooled by prose', () => {
  /** The pre-fix extractor, verbatim, so the control compares like with like. */
  const unanchoredExtract = (src, name) => {
    const startM = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b`, 'i'));
    if (!startM) return null;
    const from = startM.index;
    const tagM = src.slice(from).match(/as\s+(\$[a-z_]*\$)/i);
    if (!tagM) return null;
    const tag = tagM[1];
    const bodyStart = from + tagM.index + tagM[0].length;
    const endIdx = src.indexOf(tag, bodyStart);
    if (endIdx === -1) return null;
    return src.slice(from, endIdx + tag.length).toLowerCase();
  };

  it('NEGATIVE CONTROL: a migration that only MENTIONS the money RPC in prose is not mistaken for its definition', () => {
    // The wave L-5 accident in the shape that is actually lethal HERE. A later
    // migration discusses spend_credits in its header and defines something else.
    // The unanchored form starts at the comment and slices through the UNRELATED
    // function's closing $$ — prose plus a foreign body — and because a header
    // discussing the money path names every guard word by construction, all three
    // assertions above passed on it. Nothing crashed; the suite simply stopped
    // asserting anything.
    const planted = [
      '-- <planted fixture> — a later migration that only DISCUSSES spend_credits.',
      '-- @rollback: re-apply the previous body, i.e. re-run',
      '--   create or replace function public.spend_credits(feature text, p_profile text default null)',
      '--   which keeps the account_is_active gate, the for update serialization and',
      '--   the service_role awareness the money path depends on.',
      '',
      'create or replace function public.unrelated_helper()',
      'returns void language plpgsql as $$',
      'begin',
      '  perform 1 from public.profiles for update;',
      'end',
      '$$;',
    ].join('\n');

    // The plant must reproduce the bug, or this control proves nothing: the OLD
    // form returns text that satisfies every assertion this file makes.
    const old = unanchoredExtract(planted, 'spend_credits');
    expect(old, 'the OLD form must have returned something').toBeTruthy();
    expect(old, 'OLD: prose satisfied the spend_credits account gate assertion').toContain('account_is_active');
    expect(old, 'OLD: prose satisfied the FOR UPDATE assertion').toMatch(/for\s+update/);
    expect(old, 'OLD: prose satisfied the refund_credits service-role assertion').toContain('service_role');
    expect(old, 'OLD: and it is prose, not a definition').toMatch(/^--/m);

    // The anchored form sees no definition of spend_credits here at all, so the
    // `could not extract` expectation in the cases above fires instead.
    expect(extractFunctionFrom(planted, 'spend_credits', '<planted fixture>'),
      'the anchored form must find NO spend_credits definition in a prose-only file').toBeNull();
    // …while the function the file really does define is extracted normally.
    expect(extractFunctionFrom(planted, 'unrelated_helper', '<planted fixture>'))
      .toMatch(/^create or replace function public\.unrelated_helper\(\)/);
  });

  it('the shape check fails loudly on prose that would have satisfied every assertion above', () => {
    // The belt, exercised directly: even a mis-extract that begins with the create
    // line must red rather than pass. Note the prose alone contains all three
    // guard words — under the old extractor this text WAS a passing result.
    const prose = [
      'create or replace function public.spend_credits(feature text)',
      '--   which keeps the account_is_active gate, the for update serialization and',
      '--   the service_role awareness the money path depends on.',
      '',
      'create or replace function public.spend_credits(feature text, p_profile text default null)',
      'returns jsonb language plpgsql as $$ begin return null; end $$',
    ].join('\n');
    expect(prose, 'the prose must satisfy the spend_credits assertions').toContain('account_is_active');
    expect(prose, 'the prose must satisfy the spend_credits assertions').toMatch(/for\s+update/);
    expect(prose, 'the prose must satisfy the refund_credits assertions').toContain('service_role');
    expect(() => assertFunctionShaped(prose, 'spend_credits', '<planted fixture>'))
      .toThrow(/MIS-EXTRACT of spend_credits/);
  });

  it('CORPUS: every prose quote of the create statement is invisible to the anchored form', () => {
    // Not hypothetical. 101's @rollback note quotes the statement for
    // current_user_is_privileged and 098's wraps it mid-identifier; the
    // unanchored form mis-extracts both today.
    const proseHits = [];
    let oldFormWouldHaveTakenProse = 0;
    for (const f of migrationFiles) {
      const src = readFileSync(join(MIG_DIR, f), 'utf-8');
      for (const m of src.matchAll(/create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+)/gi)) {
        if (m.index !== src.lastIndexOf('\n', m.index) + 1) proseHits.push({ f, src, name: m[1].toLowerCase(), at: m.index });
      }
    }
    // Non-vacuity: if the corpus ever stops carrying such a quote this case is
    // asserting nothing and must be revisited, not silently kept.
    expect(proseHits.length, 'no mid-line quote of the create statement left in the corpus').toBeGreaterThan(0);

    for (const { f, src, name, at } of proseHits) {
      const anchored = [...src.matchAll(createRe(name, 'gim'))].map((m) => m.index);
      expect(anchored, `${f}: the anchored form must never match the prose quote of ${name}`).not.toContain(at);
      const unanchored = src.match(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\b`, 'i'));
      if (unanchored.index === at) oldFormWouldHaveTakenProse += 1;
    }
    expect(oldFormWouldHaveTakenProse,
      'at least one live corpus quote must be one the OLD form would have extracted').toBeGreaterThan(0);
  });
});
