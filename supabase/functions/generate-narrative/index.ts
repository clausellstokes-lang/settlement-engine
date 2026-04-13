/**
 * Supabase Edge Function: generate-narrative
 *
 * Takes a settlement's raw data and generates an AI narrative synthesis
 * or daily-life scene using the Anthropic API (Claude).
 *
 * Deducts credits from the user's balance before calling the API.
 *
 * Environment variables:
 *   ANTHROPIC_API_KEY          — Anthropic API key
 *   SUPABASE_SERVICE_ROLE_KEY  — Service role key (bypasses RLS)
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const MODEL = 'claude-sonnet-4-20250514';

const CREDIT_COSTS: Record<string, number> = {
  narrative: 5,
  dailyLife: 3,
};

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('CLIENT_URL') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ── Prompt Templates ────────────────────────────────────────────────────────

function narrativePrompt(settlement: Record<string, unknown>): string {
  return `You are a master worldbuilder and narrator for tabletop RPGs. Given the following settlement data in JSON format, create a vivid, immersive narrative description that a Dungeon Master could read aloud or use as reference material.

Structure your response as a JSON object with these keys:
- "overview": A 2-3 paragraph atmospheric overview of the settlement
- "districts": An array of short descriptions for notable areas
- "atmosphere": A paragraph about the settlement's mood, sounds, and smells
- "hooks": An array of 3-5 adventure hooks or plot seeds
- "secrets": An array of 2-3 hidden truths about the settlement

Keep descriptions evocative but concise. Use second person sparingly. Focus on sensory details and narrative tension.

Settlement data:
${JSON.stringify(settlement, null, 2)}`;
}

function dailyLifePrompt(settlement: Record<string, unknown>): string {
  return `You are a master worldbuilder for tabletop RPGs. Given the following settlement data, generate a vivid "day in the life" scene that a Dungeon Master could use to bring this settlement alive during play.

Structure your response as a JSON object with these keys:
- "dawn": A paragraph describing what happens at dawn
- "morning": A paragraph about the morning bustle
- "midday": A paragraph about midday activities
- "evening": A paragraph about evening activities
- "night": A paragraph about nighttime

Include specific NPCs by name where available in the data. Reference institutions, trade goods, and local tensions. Make it feel lived-in.

Settlement data:
${JSON.stringify(settlement, null, 2)}`;
}

// ── Main handler ────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    // Parse request
    const { type, settlement, settlementId } = await req.json();
    if (!type || !['narrative', 'dailyLife'].includes(type)) {
      throw new Error('Invalid type. Must be "narrative" or "dailyLife"');
    }
    if (!settlement) throw new Error('Missing settlement data');

    const cost = CREDIT_COSTS[type];

    // Admin client for credit operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Check and deduct credits
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    const currentCredits = profile?.credits || 0;
    if (currentCredits < cost) {
      throw new Error(`Insufficient credits. Need ${cost}, have ${currentCredits}.`);
    }

    // Deduct credits
    await supabaseAdmin.from('profiles')
      .update({ credits: currentCredits - cost })
      .eq('id', user.id);

    // Record transaction
    await supabaseAdmin.from('credit_transactions').insert({
      user_id: user.id,
      amount: -cost,
      reason: type,
      settlement_id: settlementId || null,
    });

    // Call Anthropic API
    const prompt = type === 'narrative'
      ? narrativePrompt(settlement)
      : dailyLifePrompt(settlement);

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      // Refund credits on API failure
      await supabaseAdmin.from('profiles')
        .update({ credits: currentCredits })
        .eq('id', user.id);
      await supabaseAdmin.from('credit_transactions').insert({
        user_id: user.id,
        amount: cost,
        reason: 'refund',
        settlement_id: settlementId || null,
      });

      const errBody = await anthropicRes.text();
      throw new Error(`AI API error: ${anthropicRes.status} ${errBody.slice(0, 200)}`);
    }

    const aiResult = await anthropicRes.json();
    const rawText = aiResult.content?.[0]?.text || '';

    // Parse JSON from response (Claude may wrap in ```json blocks)
    let parsed;
    try {
      const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/) || rawText.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawText);
    } catch {
      // If JSON parse fails, return raw text wrapped
      parsed = type === 'narrative'
        ? { overview: rawText, districts: [], atmosphere: '', hooks: [], secrets: [] }
        : { dawn: rawText, morning: '', midday: '', evening: '', night: '' };
    }

    return new Response(
      JSON.stringify({
        result: parsed,
        creditsRemaining: currentCredits - cost,
        type,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
