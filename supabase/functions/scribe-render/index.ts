/**
 * Supabase Edge Function: scribe-render — THE SCRIBE (docs/DESIGN_SCRIBE_GENERATION_TIME_PROSE.md).
 *
 * Renders ONE TAB of one settlement's dossier prose, once per epoch, from the town card the client
 * builds and POSTs. The rendered words land on `settlement.prose` through the save outbox; the
 * display layer swaps a pool from the hand corpus to the rendered line only where the words fit
 * the variant they were written for (the kernel's `scribeVariantPool`).
 *
 * ⭐⭐ WHY THIS IS ITS OWN FUNCTION AND NOT A FOURTH `type` ON `generate-narrative` (JUDGMENT,
 * VETOABLE — the brief offers both and says to judge by the budget). Four reasons, measured:
 *   1. THE DESIGN ASKS FOR `runCreditedCall` AND ITS SEVEN INVARIANTS BY NAME (§6), and
 *      `generate-narrative` DOES NOT USE IT — it carries its own inline reserve/spend/refund
 *      sequence (index.ts:1159-1433), which no other AI surface shares. Putting the Scribe there
 *      would mean either rewriting the narrative's money path or shipping the one surface the
 *      design names the orchestrator for on a second, unshared one.
 *   2. THE NEXT COMMIT GUTS THAT MODULE. The owner's rule 17 retires the narrative overlay, and
 *      `requestNarrative` with it. A new paid surface entangled with a module being retired in the
 *      same wave is a merge hazard for no benefit.
 *   3. THE SHAPES DIFFER. `generate-narrative` is ONE invocation per settlement that fans out
 *      internally under a 55 s budget; the Scribe is ONE INVOCATION PER TAB (§6), each landing and
 *      swapping independently through the outbox. Seven small calls, not one large one.
 *   4. BLAST RADIUS. While the flag is dark, a separate function cannot regress the live narrative
 *      path at all — there is no shared code to get wrong.
 *
 * THE MONEY PATH is `runCreditedCall` (`../ai-analyst/creditFlow.ts`) verbatim: reserve the global
 * USD cap before the spend, rate-limit after reserve, capture the spend id, meter(false) → refund →
 * release on model failure, meter(true) → release on success, never refund an elevated spend, and
 * release the reservation on every post-reserve exit. The FREE FIRST RENDER (chair ruling 2) rides
 * on migration 118's pattern — `claim_free_scribe` before the spend, `release_free_scribe` on any
 * failure — so it is unfarmable by construction and returned when the render does not land.
 *
 * ⛔ EVERY RENDERED LINE PASSES THE TIER-0 INSTRUMENTS BEFORE IT IS RETURNED, from
 * `_shared/proseKernel.bundle.js` — the byte-derived copy of the same `refuteUnit` the corpus
 * programme is audited by. A FAIL is dropped and that pool draws the hand corpus. The refuter runs
 * SERVER-SIDE deliberately: a forged card harms only the forger's own prose, but the persisted
 * artefact stays lawful whatever the client sent.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { isSessionSuperseded, deviceLabelFromRequest } from '../_shared/sessionGate.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { scheduleAutoReload } from '../_shared/autoReload.ts';
import { aiIpRateGuard } from '../_shared/rateLimit.ts';
import { runCreditedCall } from '../ai-analyst/creditFlow.ts';
import { resolveProviderKey, isVaultUnavailable } from '../ai-analyst/byok.ts';
// @ts-ignore — the bundle is generated JavaScript with JSDoc types, checked by `deno check` in
// tests/lint/scribeBundle.walker.test.js and byte-derived from src/domain/prose/refuteUnit.js.
import { refuteUnit } from '../_shared/proseKernel.bundle.js';
import { SCRIBE_VOICE } from './voice.ts';
import { SCRIBE_EXEMPLARS } from './exemplars.ts';
import {
  SCRIBE_FALLBACK_BETA,
  SCRIBE_MODEL,
  SCRIBE_OUTPUT_SCHEMA,
  buildScribeBrief,
  buildScribeUserTurn,
  buildTownBlock,
  judgeUnits,
  parseScribeUnits,
} from './scribeCore.ts';
import type { ScribeUnit, ScribeVerdict } from './scribeCore.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const ANTHROPIC_VERSION = '2023-06-01';
const SCRIBE_PROVIDER = 'anthropic';
/** The ONE render SKU (chair ruling 1 as amended by ruling 19: one price for the whole render). */
const SCRIBE_FEATURE = 'dossierProse';
const SCRIBE_TIMEOUT_MS = 55_000;
const SCRIBE_SPEND_ESTIMATE_USD = 0.08;
/** A tab's card is tens of kilobytes; thirteen tabs of one town run to 261 KB, and this is one. */
const MAX_BODY_BYTES = 512 * 1024;
const MAX_OUTPUT_TOKENS = 16_000;

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

function defaultUserClient(authHeader: string) {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
}
function defaultAdminClient() { return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!); }

/**
 * THE PROVIDER CALL, per the API skill's current contract for `claude-opus-5`:
 *   • TWO CACHED `system` BLOCKS, each `cache_control: {type:'ephemeral', ttl:'1h'}` (chair ruling
 *     31). The API allows four breakpoints and this uses two, because the two halves have
 *     DIFFERENT LIFETIMES: the brief is byte-identical for every user, every world and every tab,
 *     so it is written once an hour and read by everybody after that; the town block is identical
 *     across one settlement's six or seven tab calls and different for the next settlement. One
 *     breakpoint over both would re-write the whole prefix, exemplar pack included, on every town.
 *     The card's volatile half is the user turn, so no per-tab byte sits inside a cached block.
 *   • ADAPTIVE THINKING (`{type:'adaptive'}`), which is the only on-mode on this model family;
 *   • `output_config.effort: 'high'` and `output_config.format`, the CURRENT structured-output
 *     parameter (the deprecated top-level `output_format` is not used);
 *   • server-side `fallbacks: 'default'` under its beta, so a refusal category re-routes inside the
 *     same call instead of blanking a tab.
 */
async function callAnthropic(args: {
  apiKey: string; brief: string; townBlock: string; turn: string;
  providerFetch: typeof fetch; signal: AbortSignal;
}): Promise<Response> {
  return args.providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal: args.signal,
    headers: {
      'x-api-key': args.apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-beta': SCRIBE_FALLBACK_BETA,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: SCRIBE_MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      thinking: { type: 'adaptive' },
      fallbacks: 'default',
      output_config: {
        effort: 'high',
        format: { type: 'json_schema', schema: SCRIBE_OUTPUT_SCHEMA },
      },
      system: [
        { type: 'text', text: args.brief, cache_control: { type: 'ephemeral', ttl: '1h' } },
        { type: 'text', text: args.townBlock, cache_control: { type: 'ephemeral', ttl: '1h' } },
      ],
      messages: [{ role: 'user', content: args.turn }],
    }),
  });
}

/** The text of a structured answer: the first text block, which the schema wall has validated. */
function answerTextOf(data: any): string {
  const blocks = Array.isArray(data?.content) ? data.content : [];
  for (const block of blocks) {
    if (block?.type === 'text' && typeof block.text === 'string') return block.text;
  }
  return '';
}

export async function handleScribeRender(
  req: Request,
  deps: {
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
    anthropicFetch?: typeof fetch;
  } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const providerFetch = deps.anthropicFetch ?? fetch;
  const cors = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

  const guard = botGuard(req, 'scribe-render');
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401, cors);
    const supabaseUser = makeUserClient(authHeader);
    const supabaseAdmin = makeAdminClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401, cors);
    if (await isSessionSuperseded(supabaseAdmin, user.id, authHeader, deviceLabelFromRequest(req))) {
      return json({ error: 'session_superseded' }, 401, cors);
    }
    const ipGate = await aiIpRateGuard(supabaseAdmin, guard.meta.ip, cors);
    if (ipGate) return ipGate;

    const { data: isActive, error: activeErr } = await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) logError('scribe-render', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }

    const saveId = typeof body?.saveId === 'string' ? body.saveId : '';
    const renderedFor = typeof body?.renderedFor === 'string' ? body.renderedFor : '';
    const engineVersion = typeof body?.engineVersion === 'string' ? body.engineVersion : '';
    const advanceSeq = typeof body?.advanceSeq === 'number' && Number.isFinite(body.advanceSeq) ? body.advanceSeq : 0;
    const card = body?.card && typeof body.card === 'object' ? body.card : null;
    const record = body?.record && typeof body.record === 'object' ? body.record : null;
    const guidance = typeof body?.guidance === 'string' ? body.guidance : '';
    // THE DURABLE-HOME CONDITION, enforced on the paying side as well as in the trigger: no credit
    // is spent on a settlement that cannot keep what it paid for.
    if (!saveId) return json({ error: 'Save this settlement first.' }, 400, cors);
    if (!card || !Array.isArray(card.pools) || card.pools.length === 0) {
      return json({ error: 'Missing card' }, 400, cors);
    }
    if (!renderedFor) return json({ error: 'Missing seed' }, 400, cors);

    // ⭐ BYOK (chair ruling 10): a BYOK user's Scribe runs on THEIR key, and the tier-0 refuter is
    // unchanged either way. FAIL CLOSED on a vault error — a typed, retryable refusal BEFORE the
    // credit flow is constructed, so there is no reservation to release and no spend to refund.
    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, SCRIBE_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('scribe-render', user.id, note, { stage: 'byok' }), supabaseUser,
    );
    if (isVaultUnavailable(providerKey)) {
      return json({ error: providerKey.message, code: providerKey.code, retryable: providerKey.retryable }, providerKey.status, cors);
    }

    // ⭐ THE FREE FIRST RENDER (chair ruling 2), on migration 118's atomic pattern: claimed BEFORE
    // the spend, released on EVERY path that does not land a render, so it is unfarmable and never
    // silently consumed by a failure.
    let usedFree = false;
    let freeReleased = false;
    const releaseFree = async () => {
      if (!usedFree || freeReleased) return;
      freeReleased = true;
      try { await supabaseAdmin.rpc('release_free_scribe', { p_user: user.id }); }
      catch (e) { logError('scribe-render', user.id, e, { stage: 'free-release' }); }
    };
    try {
      const { data: claimed, error: claimErr } = await supabaseAdmin.rpc('claim_free_scribe', { p_user: user.id });
      if (claimErr) logError('scribe-render', user.id, `claim_free_scribe errored: ${claimErr.message}`, { stage: 'free-claim' });
      usedFree = claimed === true;
    } catch (e) { logError('scribe-render', user.id, e, { stage: 'free-claim' }); }

    let spendId: string | null = null;
    let promptChars = 0;
    let answerChars = 0;
    let usage: { input: number | null; output: number | null; cacheRead: number | null; cacheWrite: number | null } =
      { input: null, output: null, cacheRead: null, cacheWrite: null };
    let units: ScribeUnit[] = [];
    let verdicts: ScribeVerdict[] = [];
    let dropped = 0;
    let refused = false;
    let fellBack = false;
    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: SCRIBE_SPEND_ESTIMATE_USD });
        if (error) logError('scribe-render', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        return {
          allowed: (data as { allowed?: boolean } | null)?.allowed === true,
          reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null,
        };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('scribe-render', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        // The free first render skips the charge entirely and reports an ok spend with no id, so
        // the orchestrator's refund arm has nothing to refund and the release arm still runs.
        if (usedFree) return { ok: true, spendId: null, elevated: false, balance: null };
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: SCRIBE_FEATURE });
        if (error) { logError('scribe-render', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        spendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        const brief = buildScribeBrief({ voice: SCRIBE_VOICE, exemplars: SCRIBE_EXEMPLARS });
        const townBlock = buildTownBlock(card);
        const turn = buildScribeUserTurn({ card, record, guidance });
        promptChars = brief.length + townBlock.length + turn.length;
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), SCRIBE_TIMEOUT_MS);
        let resp: Response;
        try {
          resp = await callAnthropic({
            apiKey: providerKey.key, brief, townBlock, turn, providerFetch, signal: ac.signal,
          });
        } finally { clearTimeout(timer); }
        if (!resp.ok) {
          const text = await resp.text().catch(() => '');
          logError('scribe-render', user.id, `anthropic ${resp.status}: ${text.slice(0, 500)}`, { stage: 'provider' });
          throw new Error(`Anthropic ${resp.status}`);
        }
        const data = await resp.json();
        usage = {
          input: typeof data?.usage?.input_tokens === 'number' ? data.usage.input_tokens : null,
          output: typeof data?.usage?.output_tokens === 'number' ? data.usage.output_tokens : null,
          cacheRead: typeof data?.usage?.cache_read_input_tokens === 'number' ? data.usage.cache_read_input_tokens : null,
          cacheWrite: typeof data?.usage?.cache_creation_input_tokens === 'number' ? data.usage.cache_creation_input_tokens : null,
        };
        // A fallback block names the model that declined and the one that continued; a sticky turn
        // carries none, so the iteration list is read too. Both are receipts, never control flow.
        fellBack = (Array.isArray(data?.content) ? data.content : []).some((b: any) => b?.type === 'fallback')
          || (Array.isArray(data?.usage?.iterations) ? data.usage.iterations : []).some((i: any) => i?.type === 'fallback_message');
        // THE WHOLE CHAIN REFUSED. Not an error and not a line: the tab keeps the hand corpus.
        if (data?.stop_reason === 'refusal') { refused = true; return { ok: false, answerText: '' }; }

        const answer = answerTextOf(data);
        answerChars = answer.length;
        const parsed = parseScribeUnits(answer);
        if (!parsed.ok) return { ok: false, answerText: '' };

        const judged = judgeUnits(parsed.units, card, refuteUnit);
        units = judged.kept;
        verdicts = judged.verdicts;
        dropped = judged.dropped;
        // EVERY unit refused is not a model failure: it is a render that landed nothing, and the
        // reader keeps the corpus. It is still a failed call for money, so the spend is refunded.
        return { ok: units.length > 0, answerText: answer };
      },
      async refund(id, reason, elevated) {
        if (!id || elevated) return;
        try {
          const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: id, refund_reason: reason });
          if (error) logError('scribe-render', user.id, error.message, { stage: 'refund', spend_id: id });
        } catch (e) { logError('scribe-render', user.id, e, { stage: 'refund', spend_id: id }); }
      },
      async release(id) {
        if (!id) return;
        try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); }
        catch (e) { logError('scribe-render', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); }
      },
      async meter(ok) {
        try {
          // ⭐ THE CACHE READ IS THE RECEIPT the design says no test can prove (§6), so it is
          // METERED rather than assumed: cache reads and writes are folded into `input_tokens` at
          // full input price, exactly as `generate-narrative` folds them — conservative, so the
          // global cap trips no later than reality — and the raw figures ride in the response for
          // the pilot to read on two consecutive calls.
          const inTok = (usage.input ?? estTokens(String(promptChars))) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
          const outTok = usage.output ?? Math.max(1, Math.ceil(answerChars / 4));
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 5) + ((outTok / 1_000_000) * 25)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: SCRIBE_FEATURE, phase: String(card?.tab ?? ''), provider: SCRIBE_PROVIDER,
            model: SCRIBE_MODEL, model_preference: null,
            input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: usage.input == null || usage.output == null,
            estimated_cost_usd: costUsd, ok, fellback: fellBack, duration_ms: 0, spend_id: spendId,
          });
          if (error) logError('scribe-render', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('scribe-render', user.id, e, { stage: 'metering' }); }
      },
    }, 'scribe render failed');

    if (outcome.outcome !== 'ok') {
      await releaseFree();
      const status = outcome.status;
      const message = outcome.outcome === 'cap'
        ? 'The dossier survey is temporarily unavailable. Nothing was charged.'
        : outcome.outcome === 'rate_limited'
          ? 'Too many renders in a short time. Nothing was charged.'
          : outcome.outcome === 'insufficient'
            ? 'Not enough credits to render this dossier.'
            : 'The survey could not be written this time; the dossier reads as it did.';
      return json({ ok: false, outcome: outcome.outcome, refused, error: message }, status, cors);
    }

    // ⭐ THE RESPONSE IS BLOCK-SHAPED, because the artefact lands a BLOCK at a time and a tab swaps
    // from the corpus to the rendered line the moment ITS block is present.
    const blocks: Record<string, Record<string, Array<{ vid: number; spine: string; faces: string[]; notebook: string[] }>>> = {};
    for (const unit of units) {
      if (!blocks[unit.blockId]) blocks[unit.blockId] = {};
      const pool = blocks[unit.blockId][unit.poolKey] || [];
      pool.push({ vid: unit.vid, spine: unit.spine, faces: unit.faces, notebook: unit.notebook });
      blocks[unit.blockId][unit.poolKey] = pool;
    }

    // The reader is coming back for more tabs of this same dossier, so the session's own reload
    // window is extended here exactly as every other credited surface extends it.
    scheduleAutoReload(supabaseAdmin, user.id);
    return json({
      ok: true,
      saveId,
      advanceSeq,
      renderedFor,
      engineVersion,
      tab: String(card?.tab ?? ''),
      blocks,
      verdicts,
      dropped,
      balance: outcome.balance,
      free: usedFree,
      usage: {
        input: usage.input, output: usage.output,
        cacheRead: usage.cacheRead, cacheWrite: usage.cacheWrite,
        fellBack,
      },
    }, 200, cors);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logError('scribe-render', null, message, { stage: 'outer' });
    return json({ error: 'The survey could not be written this time.' }, 500, getCorsHeaders(req));
  }
}

serve((req) => handleScribeRender(req));
