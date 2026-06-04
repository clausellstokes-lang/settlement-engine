/**
 * Supabase Edge Function: generate-chronicle
 *
 * Turns a tick's deterministic Wizard News into an in-world prose "chronicle"
 * of the season's regional events. The CLIENT builds the grounding payload
 * (src/domain/worldPulse/chronicle.js → buildChronicleGrounding) and POSTs it
 * here; this function grounds an Anthropic pass on it and returns the prose.
 *
 * Why server-side: the browser must never hold the Anthropic key (enforced by
 * tests/security/clientAiBoundary.contract.test.js). Same trust-boundary shape
 * as generate-narrative - bot guard → JWT auth → atomic credit spend RPC →
 * model call → refund on failure.
 *
 * NOTE for deploy: mirror CHRONICLE_COST into src/config/pricing.js if you wire
 * a UI credit indicator (the narrative costs already live there). Set
 * ANTHROPIC_API_KEY + SUPABASE_URL/ANON/SERVICE keys in Functions secrets.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { botGuard } from '../_shared/requestMeta.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const CHRONICLE_MODEL = 'claude-haiku-4-5-20251001';
const CHRONICLE_COST = 2; // credits; mirror in src/config/pricing.js when wired

const HOUSE_STYLE = `Voice: a measured court chronicler. Concrete, specific, a little wry. No "nestled", no "bustling", no "tapestry of". Name the settlements. Do NOT invent events, NPCs, or facts - narrate ONLY what the grounding provides.`;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}

function buildPrompt(grounding: any): string {
  const headlines = (grounding?.headlines || [])
    .map((h: any) => `- [${h.scope}/${h.significance}] ${h.headline}${h.summary ? ` - ${h.summary}` : ''}`)
    .join('\n');
  const stressors = (grounding?.stressors || [])
    .map((s: any) => `- ${s.label || s.type} (severity ${Number(s.severity || 0).toFixed(2)}) in ${(s.affected || []).join(', ')}`)
    .join('\n');
  const realm = (grounding?.realmArcs || []).map((a: any) => `- ${a.headline}`).join('\n');

  return `You are the regional chronicler for a tabletop campaign. Write a SHORT chronicle (3-5 sentences) of this season's events across the region.

${HOUSE_STYLE}

SEASON: ${grounding?.calendar ? `${grounding.calendar.season || ''} of year ${grounding.calendar.year ?? '?'}` : `tick ${grounding?.tick ?? '?'}`}

REALM-WIDE ARCS:
${realm || '(none)'}

HEADLINES (ground every claim in these - do not add events):
${headlines || '(a quiet season)'}

ACTIVE PRESSURES:
${stressors || '(none of note)'}

Return ONLY the chronicle prose. No preamble, no headings, no markdown.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const guard = botGuard(req, 'generate-chronicle');
  if (guard) return guard;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401);

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401);

    const body = await req.json().catch(() => null);
    const grounding = body?.grounding;
    if (!grounding || typeof grounding !== 'object') return json({ error: 'Missing grounding payload' }, 400);

    // Atomic, RLS-enforced credit spend (same path as generate-narrative).
    const { data: spendResult, error: spendErr } = await supabaseUser.rpc('spend_credits', {
      amount: CHRONICLE_COST,
      reason: 'chronicle',
    });
    if (spendErr) return json({ error: spendErr.message || 'Insufficient credits' }, 402);
    const spendId = spendResult?.spend_id ?? spendResult?.id ?? null;
    const balanceAfter = spendResult?.balance ?? null;

    const refund = async (why: string) => {
      if (!spendId) return;
      await supabaseUser.rpc('refund_credits', { spend_id: spendId, refund_reason: why }).catch(() => {});
    };

    let prose = '';
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: CHRONICLE_MODEL,
          max_tokens: 700,
          messages: [{ role: 'user', content: buildPrompt(grounding) }],
        }),
      });
      if (!resp.ok) throw new Error(`Anthropic ${resp.status}`);
      const data = await resp.json();
      prose = (data?.content?.[0]?.text || '').trim();
      if (!prose) throw new Error('Empty chronicle');
    } catch (e) {
      await refund('chronicle generation failed');
      return json({ error: (e as Error).message, refunded: true }, 502);
    }

    return json({ chronicle: prose, creditsRemaining: balanceAfter });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
